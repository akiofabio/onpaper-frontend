import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import PedidoService from '../services/PedidoService';
import {cepMask,moedaRealMask,dataToInputMesEAnoDataMask} from '../etc/Mask';
import Overlay from 'react-bootstrap/Overlay';
import {separarParagrafo, separarParagrafoSemMargem,cartaoToString,enderecoToString, separarParagrafoSemMargemFonte} from '../etc/Funcoes'
import BandeiraService from '../services/BandeiraService'

function FianlizarCompraComponent2 (){
    const navigate = useNavigate()
    const [ subtotal , setSubtotal ] = useState(0)
    const [ freteTotal , setFreteTotal ] = useState(0)
    const [ total , setTotal ] = useState(0)
    const [ totalPagar , setTotalPagar ] = useState(0)
    const [ mostrarEnderecos , setMostrarEnderecos ] = useState(false)
    const [ mostrarCartoes , setMostrarCartoes ] = useState(-1)
    const [ mostrarCupomPromocionais , setMostrarCupomPromocionais ] = useState(0)
    const [ mostrarCupomTroca , setMostrarCupomTroca ] = useState(-1)

    const [ cartoes , setCartoes ] = useState([])
    const [ cuponsPromocionais , setCuponsPromocionais ] = useState([])
    const [ cuponsTroca , setCuponsTroca ] = useState([])
    
    const [mostrarNovoEndereco, setMostrarNovoEndereco] = useState(0)
    const [novoEndereco, setNovoEndereco] = useState({
        nome:"",
        pais:"",
        cep:"",
        estado:"",
        cidade:"",
        bairro:"",
        tipoLogradouro:"",
        logradouro:"",
        numero:"",
        observacao:"",
        cobranca: true,
        entrega:true
    })

    const [mostrarNovoCartao, setMostrarNovoCartao] = useState(0)
    const [novoCartao, setNovoCartao] = useState({
        nome:"",
        numero:"",
        validade:"",
        preferencial:"",
        codigoSeguranca:""
    })

    const [bandeiras, setBandeiras] = useState([])
    const [pedido, setPedido] = useState({
        itens : [], 
        endereco : " ",
        cep : " ",
        meioDePagamentos: [],
    })
    const [ cliente , setCliente ] = useState( {
        enderecos : []
    } )
    
    function valorHandler(event,meio){
        var valorTemp = event.target.value
        valorTemp = valorTemp.replace(/\D/g, "");
        if(valorTemp.length >2){
            valorTemp = valorTemp.replace(/(\d+)(\d\d)/, "$1.$2");
        }
        else{
            valorTemp = valorTemp.replace(/(\d\d)/, "0.$1");
        }
        setCartoes(cartoes.map(meioTemp => 
            cartoes.indexOf(meioTemp) === cartoes.indexOf(meio) ? {...meioTemp, valor:valorTemp} : meioTemp
            )
        )
    }

    function calculoSubtotal(){
        var subtotalSoma =0
        
        pedido.itens.forEach(item => {
            subtotalSoma +=  item.quantidade * item.preco
        })
        setSubtotal(subtotalSoma);
    }

    function calculoFreteTotal(){
        var fretetotalSoma = 0
        if(pedido.endereco && pedido.cep && pedido.cep.length===8){
            pedido.itens.forEach(item => {
                fretetotalSoma +=  0.1 * item.quantidade
            })
            var cepNumero = pedido.cep;
            cepNumero = cepNumero.replace(/\D/g, "");
            fretetotalSoma *= (parseFloat(cepNumero))/1000000
        }
        setFreteTotal(fretetotalSoma.toFixed(2));
    }
    
    function calculoTotal(){
        setTotal(Number(subtotal) + Number(freteTotal))
    }

    function calculoTotalPagar(){
        var resultado = 0 
        cartoes.forEach(meio => {
            if(meio.valor){
                resultado += Number(meio.valor)
            }
        })
        cuponsPromocionais.forEach(meio => {
            if(meio.valor){
                resultado += Number(meio.valor)
            }
        })
        cuponsTroca.forEach(meio => {
            if(meio.valor){
                resultado += Number(meio.valor)
            }
        })
        setTotalPagar(resultado)
    }

    //Endereço
    function MostrarEndereco(){
        if( !mostrarEnderecos ){
            return (
                <button className='btn btn-outline-dark' onClick={() => setMostrarEnderecos(true)} style={{ margin:2}}>
                    {separarParagrafoSemMargem(pedido.endereco)}
                </button>
            )
        }
        else{
            return (
                <div>
                    {cliente.enderecos.map(endereco => 
                        <button key={endereco.id} className='btn btn-outline-dark' style={{ margin:2}} onClick={() => selecionarEndereco(endereco.id)  }>
                            <p style={{ margin:0, padding:0}}>{endereco.nome}</p>
                            <p style={{ margin:0, padding:0}}>{endereco.tipoLogradouro} {endereco.logradouro}, nº {endereco.numero}</p>
                            <p style={{ margin:0, padding:0}}>{cepMask(endereco.cep)} - {endereco.bairro} - {endereco.cidade} - {endereco.estado}</p>
                        </button>
                    )}
                    <button className='btn btn-outline-dark' style={{ margin:2}} onClick={() => setMostrarNovoEndereco(1)  }>
                            <p style={{ margin:0, padding:0}}>Novo Endereço</p>
                    </button>
                </div>
            )
        }
    }

    function novoEnderecoOverlay(){
        return(
            <div>
                <Overlay show={mostrarNovoEndereco} placement="auto">
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                        <div
                            {...props}
                            style={{
                            position: 'fixed',
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.8)',
                            maxHeight: '100vh',
                            ...props.style,
                            }}
                        >
                            <div className='card border-dark' style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translate(-50%)',
                            }}>
                                <div  className="card-header border-dark bg-dark text-white">
                                    <h3 className='text-center'>Alterar Endereco</h3>
                                </div>
                                <div className='card-body' >
                                    <div className='form-group'>
                                    <label>Nome:</label>
                                        <input type={"text"} placeholder='Nome' name='nome_end_input' className='form-control' value={novoEndereco.nome} onChange={(event) => setNovoEndereco({...novoEndereco, nome : event.target.value})} size="80"></input>
                                        <label>CEP:</label>
                                        <input type={"text"} placeholder='CEP' name='cep_end_input' className='form-control' value={cepMask(novoEndereco.cep)} onChange={(event) => setNovoEndereco({...novoEndereco, cep : event.target.value.replace(/\D/g, "")})}></input>
                                        <div className='row'>
                                            <div className='col'>
                                                <label>País:</label>
                                                <input type={"text"} placeholder='País' name='pais_end_input' className='form-control' value={novoEndereco.pais} onChange={(event) => setNovoEndereco({...novoEndereco, pais : event.target.value})}></input>
                                            </div>
                                            <div className='col'>
                                                <label>Estado:</label>
                                                <input type={"text"} placeholder='Estado' name='estado_end_input' className='form-control' value={novoEndereco.estado} onChange={(event) => setNovoEndereco({...novoEndereco, estado : event.target.value})}></input>
                                            </div>
                                        </div>
                                        <label>Cidade:</label>
                                        <input type={"text"} placeholder='Cidade' name='cidade_end_input' className='form-control' value={novoEndereco.cidade} onChange={(event) => setNovoEndereco({...novoEndereco, cidade : event.target.value})}></input>
                                        <label>Bairro:</label>
                                        <input type={"text"} placeholder='Tipo' name='bairro_end_input' className='form-control' value={novoEndereco.bairro} onChange={(event) => setNovoEndereco({...novoEndereco, bairro : event.target.value})}></input>
                                        <div className='row'>
                                            <div className='col col-sm-5'>
                                                <label>Tipo de Logradouro:</label>
                                                <input type={"text"} placeholder='Tipo de Logradouro' name='tipo_logradouro_end_input' className='form-control' value={novoEndereco.tipoLogradouro} onChange={(event) => setNovoEndereco({...novoEndereco, tipoLogradouro : event.target.value})}></input>
                                            </div>
                                            <div className='col'>
                                                <label>Logradouro:</label>
                                                <input type={"text"} placeholder='Logradouro' name='logradouro_end_input' className='form-control' value={novoEndereco.logradouro} onChange={(event) => setNovoEndereco({...novoEndereco, logradouro : event.target.value})}></input>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col col-sm-5'>
                                                <label>Numero:</label>
                                                <input type={"text"} placeholder='Numero' name='numero_end_input' className='form-control' value={novoEndereco.numero} onChange={(event) => setNovoEndereco({...novoEndereco, numero : event.target.value})}></input>
                                            </div>
                                            <div className='col col-sm-5'>
                                                <label>Tipo:</label>
                                                <input type={"text"} placeholder='Tipo do endereço, Ex. Casa, Predio, etc.' name='tipo_end_input' className='form-control' value={novoEndereco.tipo} onChange={(event) => setNovoEndereco({...novoEndereco, tipo : event.target.value})}></input>
                                            </div>
                                        </div>
                                        <label>Observacao:</label>
                                        <input type={"text"} placeholder='Observacao' name='observacao_end_input' className='form-control' value={novoEndereco.observacao} onChange={(event) => setNovoEndereco({...novoEndereco, observacao : event.target.value})}></input>
                                        <input type={"checkbox"} name='entrega_end_input' onClick={(event) => setNovoEndereco({...novoEndereco, entrega : !novoEndereco.entrega})} checked={novoEndereco.entrega}></input>Endereço de Entrega
                                        <br></br>
                                        <input type={"checkbox"} name='cobranca_end_input' onClick={(event) => setNovoEndereco({...novoEndereco, cobranca : !novoEndereco.cobranca})} checked={novoEndereco.cobranca}></input>Endereço de Cobrança
                                    </div>
                                </div>
                                <div className='row justify-content-md-center'>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5} } onClick={() => salvarEnderecoNovo()}>Salvar</button>
                                    </div>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5}} onClick={() => cancelarEnderecoNovo()}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    )}
                </Overlay>
            </div>
        )
    }

    function salvarEnderecoNovo(){
        var clienteTenp = cliente
        clienteTenp.enderecos.push(novoEndereco)
        alert(JSON.stringify(novoEndereco))
        ClienteService.updateCliente(clienteTenp).then(res => {
            setCliente(res.data)
            setNovoEndereco(0)
        }).catch(erro => {
            alert(JSON.stringify(erro.response.data))
        })
    }

    function cancelarEnderecoNovo(){
        setNovoEndereco({
            nome:"",
            cep:"",
            estado:"",
            cidade:"",
            bairro:"",
            tipoLogradouro:"",
            logradouro:"",
            numero:"",
            observacao:"",
            cobranca: true,
            entrega: true
        })
        setMostrarNovoEndereco(0)
    }

    function selecionarEndereco(id){
        setMostrarEnderecos(false)
        var endereco = cliente.enderecos.find(endereco => endereco.id === id)
        setPedido({ 
            ...pedido,
            cep: endereco.cep,
            endereco : enderecoToString(endereco),
            idEndereco : endereco.id
        })
    }


    //Cartão
    function MostrarCartao(props){
        
        if( mostrarCartoes === cartoes.indexOf(props.meio)){
            var cartoesTemp = cliente.cartoes
            cartoes.forEach(pag => {
                cartoesTemp = cartoesTemp.filter(cartao => ( ( "Nome: " + cartao.nome + "\nNumero: " + cartao.numero + "\n" + cartao.bandeira.nome ) !== pag.detalhes))
            })
            return (
                <div>
                    {cartoesTemp.map(cartao => 
                        <button key={cartao.id} className='btn btn-outline-dark' style={{ margin:2}} onClick={() => selecionarCartao(cartao,props.meio)  }>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Nome: {cartao.nome}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Numero: {cartao.numero}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}> {cartao.bandeira.nome}</p>
                        </button>
                    )}
                    <button className='btn btn-outline-dark' style={{ margin:2}} onClick={()=>setMostrarNovoCartao(true)}>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Novo Cartão</p>
                    </button>
                </div>          
            )
        }
        else{
            return (
                <div className='d-grid'>
                    <button  className='btn btn-outline-dark btn-block' onClick={() => setMostrarCartoes(cartoes.indexOf(props.meio))} style={{ margin:2}}>
                        {separarParagrafo(props.meio.detalhes)}
                    </button>
                </div>
            )
        }
    }

    function novoCartaoOverlay(){
        return(
            <div>
                <Overlay show={mostrarNovoCartao} placement="auto" >
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                        <div
                            {...props}
                            style={{
                            position: 'fixed',
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.4)',
                            ...props.style,
                            }}
                        >
                            <div className='card border-dark' style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translate(-50%)',
                                opacity: 1,
                            }}>
                                <div className="card-header border-dark bg-dark text-white">
                                    <h3 className='text-center'>Alterar Cartão de Credito</h3>
                                </div>
                                <div className='card-body'>
                                    <div className='form-group'>
                                        <label>Bandeira:</label>
                                        <select  name="bandeira_car_select" onChange={(event)=>{setNovoCartao({...novoCartao, bandeira : event.target.value})}}>
                                            {bandeiras.map(bandeira => 
                                                <option value={bandeiras.indexOf(bandeira)}> {bandeira.nome} </option>
                                            )}
                                        </select>
                                    </div>
                                    <div className='form-group'>
                                        <label>Nome:</label>
                                        <input type={"text"} placeholder='Nome como esta no cartao' name='nome_car_input' className='form-control' value={novoCartao.nome} onChange={(event) => setNovoCartao({...novoCartao, nome : event.target.value})} size="50"></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>Numero:</label>
                                        <input type={"text"} placeholder='xxx.xxx.xxx.xxx.xxx.xxx' name='numero_car_input' className='form-control' value={novoCartao.numero} onChange={(event) => setNovoCartao({...novoCartao, numero : event.target.value})} size="50"></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>Data de Validade:</label>
                                        <input type={"month"} name='data_validade_car_input' className='form-control' value={dataToInputMesEAnoDataMask(novoCartao.validade)} onChange={(event) => setNovoCartao({...novoCartao, validade : event.target.value})} size="50"></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>Codigo de Seguranca:</label>
                                        <input type={"text"} placeholder='CVV' name='codigo_seguranca_car_input' className='form-control' value={novoCartao.codigoSeguranca} onChange={(event) => setNovoCartao({...novoCartao, codigoSeguranca : event.target.value})} size="50"></input>
                                    </div>
                                    <div className='form'>
                                        <input type={"checkbox"} name='preferencial_car_input' onClick={()=>setNovoCartao({...novoCartao, preferencial: novoCartao.preferencial})} checked={novoCartao.preferencial}></input>Preferencial
                                    </div>
                                </div>
                                <div className='row justify-content-md-center'>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' name='salvar_car_button' style={{marginBottom: 5} } onClick={() => salvarNovoCartao()}>Salvar</button>
                                    </div>
                                    <div className='col-auto'>
                                    <button className='btn btn-dark' name='cancelar_car_button' style={{marginBottom: 5}} onClick={() => cancelarNovoCartao()}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Overlay>
        </div>
        )
    }

    function salvarNovoCartao(){
        var clienteTenp = cliente
        if(novoCartao.preferencial){
            clienteTenp.cartoes.forEach(cartao => {
                if(cartao.preferencial){
                    cartao.preferencial = false
                }
            })
        }
        clienteTenp.cartoes.push(novoCartao)
        ClienteService.updateCliente(clienteTenp).then(res => {
            setCliente(res.data)
            setMostrarNovoCartao(false)
        }).catch(erro => {
            alert(JSON.stringify(erro.response.data))
        })
    }

    function cancelarNovoCartao(){
        setNovoCartao({
            nome:"",
            numero:"",
            validade:"",
            preferencial:"",
            codigoSeguranca:""
        })
        setMostrarNovoCartao(false)
    }

    function selecionarCartao(cartao,meioPagamento){
        setMostrarCartoes(-1)
        var meioDePagamentoTemp={
            detalhes: "Nome: " + cartao.nome + "\nNumero: " + cartao.numero + "\n" + cartao.bandeira.nome,
            tipo: "Cartão de Credito",
        }
        setCartoes(cartoes.map(meio => 
            cartoes.indexOf(meio) === cartoes.indexOf(meioPagamento) ? meioDePagamentoTemp : meio
        ))
    }

    function addCartao(){
        if(mostrarCartoes===-1){
            var meio = {
                tipo: "Cartão de Credito",
                detalhes: " ",
                valor: 0
            }
            setCartoes([
                    ...cartoes,
                    meio
                ]
            )
            setMostrarCartoes(cartoes.length)
        }
        else{
            alert("Escolha/Remova o cartão primeiro")
        }
    }

    function removerCartao(meioDePagamento){
        if(mostrarCartoes===-1 || mostrarCartoes===cartoes.indexOf(meioDePagamento)){
            setCartoes(cartoes.filter(meio => cartoes.indexOf(meio) !== cartoes.indexOf(meioDePagamento))
            )
            setMostrarCartoes(-1)
        }
        else{
            alert("Escolha/Remova o cartão primeiro")
        }
    }

    function MostrarCupomPromocinais(props){
        if( mostrarCupomPromocionais===1 ){
            var cupomPromocionais = cliente.cupons.filter(cupom => cupom.tipo === "Promocional")
            
            return (
                <div>
                    {cupomPromocionais.map(cupom => 
                        <button key={cupom.id} className='btn btn-outline-dark' style={{ margin:2}} onClick={() => selecionarCupomPromocional(cupom,props.meio)  }>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Numero: {cupom.numero}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}>{cupom.descricao}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Valor: {moedaRealMask(cupom.valor)}</p>
                        </button>
                    )}
                </div>          
            )
        }
        else{
            return (
                <div>
                    <button  className='btn btn-outline-dark' onClick={() => setMostrarCupomPromocionais(true)} style={{ margin:2}}>
                        {separarParagrafo(props.meio.detalhes)}
                    </button>
                </div>
            )
        }
    }

    function selecionarCupomPromocional(cupom,meioPagamento){
        setMostrarCupomPromocionais(0)
        var meioDePagamentoTemp={
            detalhes: "Numero: " + cupom.id + "\n" + cupom.descricao,
            tipo: "Cupom Promocional",
            valor: cupom.valor
        }
        setCuponsPromocionais( cuponsPromocionais.map(meio => 
            cuponsPromocionais.indexOf(meio) === cuponsPromocionais.indexOf(meioPagamento) ? meioDePagamentoTemp : meio
        ))
    }

    function addCupomPromocional(){
        if(mostrarCupomPromocionais === 0 && cuponsPromocionais.length === 0){
            var meio = {
                tipo: "Cupom Promocional",
                detalhes: " ",
                valor: 0
            }
            setCuponsPromocionais([...cuponsPromocionais, meio])
            setMostrarCupomPromocionais(1)
        }
        else if(mostrarCupomPromocionais === 1){
            alert("Escolha/Remova o Cupom primeiro")
        }
        else{
            alert("É permitido apenas um cupom promocional por compra")
        }
    }
    
    function removerCupomPromocional(meioDePagamento){
        if(mostrarCupomPromocionais===0 || mostrarCupomPromocionais === 1){
            setCuponsPromocionais(cuponsPromocionais.filter(meio => cartoes.indexOf(meio) !== cartoes.indexOf(meioDePagamento) )
            )
            setMostrarCupomPromocionais(0)
        }
    }

    function MostrarCupomTroca(props){
        if( mostrarCupomTroca === cuponsTroca.indexOf(props.meio)){
            var cupomTroca = cliente.cupons.filter(cupom => cupom.tipo === "Troca")
            cuponsTroca.forEach(pag => {
                cupomTroca = cupomTroca.filter(cupom => ("Numero: " + cupom.id + "\n" + cupom.descricao )!== pag.detalhes)
            })
            return (
                <div>
                    {cupomTroca.map(cupom => 
                        <button key={cupom.id} className='btn btn-outline-dark' style={{ margin:2}} onClick={() => selecionarCupomTroca(cupom,props.meio)  }>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Numero: {cupom.id}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}>{cupom.descricao}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Valor: {moedaRealMask(cupom.valor)}</p>
                        </button>
                    )}
                </div>          
            )
        }
        else{
            return (
                <div>
                    <button  className='btn btn-outline-dark' onClick={() => setMostrarCupomTroca(cuponsTroca.indexOf(props.meio))} style={{ margin:2}}>
                        {separarParagrafo(props.meio.detalhes)}
                    </button>
                </div>
            )
        }
    }

    function selecionarCupomTroca(cupom,meioPagamento){
        setMostrarCupomTroca(-1)
        var meioDePagamentoTemp={
            index:meioPagamento.index,
            detalhes: "Numero: " + cupom.id + "\n" + cupom.descricao,
            tipo: "Cupom de Troca",
            valor: cupom.valor
        }
        setCuponsTroca(cuponsTroca.map(meio => 
            cuponsTroca.indexOf(meio) ===  cuponsTroca.indexOf(meioPagamento) ? meioDePagamentoTemp : meio
        ))
    }

    function addCupomTroca(){
        if(mostrarCupomTroca === -1){
            var meio = {
                tipo: "Cupom de Troca",
                detalhes: " ",
                valor: 0
            }
            setCuponsTroca([...cuponsTroca, meio]
           )
            setMostrarCupomTroca(cuponsTroca.length)
        }
        else{
            alert("Escolha/Remova o Cupom primeiro")
        }
    }
    
    function removerCupomTroca(meioDePagamento){
        if(mostrarCupomTroca===-1 || mostrarCupomTroca === cuponsTroca.indexOf(meioDePagamento)){
            setCuponsTroca(cuponsTroca.filter(meio => cuponsTroca.indexOf(meio) !== cuponsTroca.indexOf(meioDePagamento) ))
            setMostrarCupomTroca(-1)
        }
    }

    function finalizar(){
        var meioDePagamentosTemp = []
        meioDePagamentosTemp = meioDePagamentosTemp.concat(cartoes)
        meioDePagamentosTemp = meioDePagamentosTemp.concat(cuponsPromocionais)
        meioDePagamentosTemp = meioDePagamentosTemp.concat(cuponsTroca)
        var pedidoTemp = {
            ...pedido,
            meioDePagamentos: meioDePagamentosTemp,
            frete: freteTotal
        }
        //alert("pedido: " + JSON.stringify(pedidoTemp))
        PedidoService.createPedido(pedidoTemp).then(res => {
            var clienteTemp = cliente
            clienteTemp.pedidos.push(res.data)
            clienteTemp.carrinho={
                ...clienteTemp.carrinho,
                itens: [],
                frete: 0
            }
            ClienteService.updateCliente(clienteTemp,clienteTemp.id).then(res => {
                alert("Pedido Realizado Com Sucesso!")
                setCliente(res.data)
                navigate("/")
            }).catch(error =>{
                alert("Cliente save erro" + error.response.data)
            })
        }).catch(error =>{
            alert(error.response.data)
        })
    }

    useEffect(() => {
        if(bandeiras.length){
            BandeiraService.getBandeiras.then(res => {
                setBandeiras(res.data)
            })
        }
        if(totalPagar===0){

        }
        if(localStorage.getItem( "isLogged" )){
            if(!cliente.id){
                ClienteService.getClienteById( localStorage.getItem( "id" ) ).then(res => {
                    setCliente(res.data)
                    if(pedido.itens.length===0){
                        var meioPag;
                        if( res.data.cartoes && res.data.cartoes.length!==0){
                            res.data.cartoes.forEach(cartao => {
                                if(cartao.preferencial){
                                    meioPag = {
                                        tipo: "Cartão de Credito",
                                        detalhes: cartaoToString(cartao),
                                        valor: subtotal + freteTotal
                                    }
                                    setCartoes((car) => [...car,meioPag])
                                }
                            })
                        }
                        else{
                            meioPag={
                                index: 1,
                                tipo: "SEM Cartão Cadastrado"
                            }
                        }
                        var pedidoTemp = {
                            itens : res.data.carrinho.itens, 
                            endereco : res.data.carrinho.endereco,
                            cep: res.data.carrinho.cep,
                            idEndereco : res.data.carrinho.idEndereco,
                            meioDePagamentos: []
                        }
                        setPedido(pedidoTemp)
                    }
                })
            }
        }
    }, []);

    useEffect(() => {
        calculoSubtotal()
        calculoFreteTotal()
        calculoTotal()
        calculoTotalPagar()
    }, [pedido]);

    useEffect(() => {
        calculoTotalPagar()
    },[cartoes,cuponsPromocionais,cuponsTroca]);
    
    useEffect(() => {
        calculoTotal()
    }, [subtotal,freteTotal]);

    useEffect(() => {
        
    }, [total]);

    return(
        <div>
            <h3 style={{ marginTop: 40 }}>Finalizar Pedido</h3>
            <div>
                <div className='row justify-content-end'>
                </div>
                <h4>Pedido:</h4>
                <div>
                    {novoEnderecoOverlay()}
                    {pedido.itens.map( item => 
                        <div key = {item.id} className='card '>
                            <div className="container" style={{margin: 0,padding :0}}>
                                <div className='card-body'>
                                    <div className='row no-gutters'>
                                    <div className='col' style={{textAlign:'center', width:160, height:160}}>
                                            <img src={'imagens/produtos/' + item.imagemProduto} alt={item.imagemProduto} style={{maxHeight:"100%"}}></img>
                                        </div>
                                        <div className='col-sm-8'>
                                            <p style={{ height:60}}>Nome: {item.nomeProduto}</p>
                                            <div className="row g-3 align-items-center">
                                                <div className="col-auto">
                                                    <label>Quantidade:</label>
                                                </div>
                                                <div className="col-auto">
                                                    <label>{ item.quantidade } </label>
                                                </div>
                                                <div className="col-auto">
                                                    <label>{ item.status }</label>
                                                </div>
                                                
                                            </div>
                                            
                                        </div>
                                        <div className='col-sm-2' >
                                            <p align="center" style={{ marginBottom:0}}>Preço</p>
                                            <p align="center">{moedaRealMask(item.preco)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <h3>Endereco de Entrega: </h3>
                    <div className='card'>
                        <div className='card-body'>
                            <MostrarEndereco/>
                        </div>
                    </div>
                    <h2>Subtotal: {moedaRealMask(subtotal)} + {moedaRealMask(freteTotal)}</h2>
                
                    <h3>Meio de Pagamento: </h3>
                
                    <div className='card'>
                        <h4>Cartao de Credito: </h4>

                        <div className='row row-cols-3'>
                            {cartoes.map( cartao =>
                                <div className='col'>
                                    <div className='card text-center' >
                                        <div className='card-body'>
                                            <div className='row'>
                                                <MostrarCartao meio={cartao}></MostrarCartao>
                                            </div>
                                            <div className='row' >
                                                <div className="col-sm-4 text-end">
                                                    <label>Valor:</label>
                                                </div>
                                                <div className="col">
                                                    <input className='form-control' value={ moedaRealMask(cartao.valor) } style={{width:150}} onChange={ ( event ) => valorHandler( event, cartao ) } ></input>
                                                </div>
                                            </div>
                                            <button className='btn ' onClick={() => removerCartao(cartao)}> - Remover</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button className='btn ' onClick={() => addCartao()}> + Add Cartão de credito</button>
                    <div className='card'>
                        <h4>Cupons Promocionais: </h4>
                        <div className='card'>
                            {cuponsPromocionais.map( meioDePagamento =>
                                <div>
                                    <MostrarCupomPromocinais meio = {meioDePagamento}/>
                                    <div className='row'>
                                        <div className="col-auto">
                                            <label>Valor: { moedaRealMask(meioDePagamento.valor) } </label>
                                        </div>
                                    </div>
                                    <button className='btn ' onClick={() => removerCupomPromocional(meioDePagamento)}> - Remover</button>

                                </div>
                            )}
                        </div>
                        <button className='btn ' onClick={() => addCupomPromocional()}> + Add Cupom Promocional</button>
                    </div>
                    <div className='card'>
                        <h4>Cupons de Troca: </h4>
                        <div className='card'>
                            {cuponsTroca.map( meioDePagamento =>
                                <div>
                                    <MostrarCupomTroca meio = {meioDePagamento}/>
                                    <div className='row'>
                                        <div className="col-auto">
                                            <label>Valor: { moedaRealMask(meioDePagamento.valor) } </label>
                                        </div>
                                    </div>
                                    <button className='btn ' onClick={() => removerCupomTroca(meioDePagamento)}> - Remover</button>

                                </div>
                            )}
                        </div>
                        <button className='btn ' onClick={() => addCupomTroca()}> + Add Cupom de Troca</button>
                    </div>
                    <div className='row' style={{ textAlign:'right'}}>
                        <div className='col-sm-2'>
                            <p style={{ margin: 0 }}>Total:</p>
                        </div>
                        <div className='col-sm-2' >
                            <p style={{ margin: 0 }}>{moedaRealMask(total)}</p>
                        </div>
                    </div>
                    <div className='row' style={{ textAlign:'right'}}>
                        <div className='col-sm-2'>
                            <p style={{ margin: 0 }}>Valor a pagar:</p>
                        </div>
                        <div className='col-sm-2' >
                            <p style={{ margin: 0 }}>{moedaRealMask(totalPagar)}</p>
                        </div>
                    </div>
                    <div className='row' style={{ textAlign:'right'}}>
                        <div className='col-sm-2'>
                        </div>
                        <div className='col-sm-2' >
                            <hr/>
                        </div>
                    </div>
                    <div className='row' style={{ textAlign:'right'}}>
                        <div className='col-sm-2'>
                            <p style={{ margin: 0 }}>Restante:</p>
                        </div>
                        <div className='col-sm-2' >
                            <p style={{ margin: 0 }}> {moedaRealMask(total - totalPagar)}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <button className='btn btn-dark' onClick={() => finalizar()}>Finalizar</button>
                </div>
            </div>
        </div>
    )
}
export default FianlizarCompraComponent2