import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import PedidoService from '../services/PedidoService';
import {cepMask,moedaRealMask} from '../etc/Mask'
import {separarParagrafo, separarParagrafoSemMargem,cartaoToString,enderecoToString, separarParagrafoSemMargemFonte} from '../etc/Funcoes'

function FianlizarCompraComponent (){
    const navigate = useNavigate()
    const [ subtotal , setSubtotal ] = useState(0)
    const [ freteTotal , setFreteTotal ] = useState(0)
    const [ total , setTotal ] = useState(0)
    const [ totalPagar , setTotalPagar ] = useState(0)
    const [ mostrarEnderecos , setMostrarEnderecos ] = useState(false)
    const [ mostrarCartoes , setMostrarCartoes ] = useState(0)
    const [ mostrarCupomPromocionais , setMostrarCupomPromocionais ] = useState(0)
    const [ mostrarCupomTroca , setMostrarCupomTroca ] = useState(0)
    const [ pedido , setPedido ] = useState({
        itens : [], 
        endereco : " ",
        cep : " ",
        meioDePagamentos: [],
    })
    const [ cliente , setCliente ] = useState( {
        enderecos : []
    } )

    function calculoSubtotal(){
        var subtotalSoma =0
        
        pedido.itens.forEach(item => {
            subtotalSoma +=  item.quantidade * item.preco
        })
        setSubtotal(subtotalSoma);
    }

    function calculoFreteTotal(){
        var fretetotalSoma = 0
        if(pedido.endereco && pedido.cep && pedido.cep.length==8){
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
        pedido.meioDePagamentos.forEach(meio => {
            if(meio.valor){
                resultado += Number(meio.valor)
            }
        })
        setTotalPagar(resultado)
    }

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
                </div>
            )
        }
    }

    function selecionarEndereco(id){
        setMostrarEnderecos(false)
        var endereco = cliente.enderecos.find(endereco => endereco.id == id)
        setPedido({ 
            ...pedido,
            cep: endereco.cep,
            endereco : enderecoToString(endereco),
            idEndereco : endereco.id
        })
    }

    function valorHandler(event,meio){
        var valorTemp = event.target.value
        valorTemp = valorTemp.replace(/\D/g, "");
        if(valorTemp.length >2){
            valorTemp = valorTemp.replace(/(\d+)(\d\d)/, "$1.$2");
        }
        else{
            valorTemp = valorTemp.replace(/(\d\d)/, "0.$1");
        }
        setPedido({
            ...pedido,
            meioDePagamentos: pedido.meioDePagamentos.map(meioTemp => 
                meioTemp.index === meio.index ? {...meioTemp, valor:valorTemp} : meioTemp
            )
        })
    }

    function MostrarCartao(props){
        if( mostrarCartoes == props.meio.index ){
            var cartoesTemp = cliente.cartoes
            pedido.meioDePagamentos.forEach(pag => {
                cartoesTemp = cartoesTemp.filter(cartao => ( ( "Nome: " + cartao.nome + "\nNumero: " + cartao.numero + "\n" + cartao.bandeira ) !== pag.detalhes) || ( props.meio.index == pag.index ))
            })
            return (
                <div>
                    {cartoesTemp.map(cartao => 
                        <button key={cartao.id} className='btn btn-outline-dark' style={{ margin:2}} onClick={() => selecionarCartao(cartao,props.meio)  }>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Nome: {cartao.nome}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Numero: {cartao.numero}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}> {cartao.bandeira}</p>
                        </button>
                    )}
                    <button className='btn btn-outline-dark' style={{ margin:2}}>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Novo Cartão</p>
                    </button>
                </div>          
            )
        }
        else{
            return (
                <div className='d-grid'>
                    <button  className='btn btn-outline-dark btn-block' onClick={() => setMostrarCartoes(props.meio.index)} style={{ margin:2}}>
                        {separarParagrafo(props.meio.detalhes)}
                    </button>
                </div>
            )
        }
    }

    function selecionarCartao(cartao,meioPagamento){
        setMostrarCartoes(0)
        var meioDePagamentoTemp={
            index:meioPagamento.index,
            detalhes: "Nome: " + cartao.nome + "\nNumero: " + cartao.numero + "\n" + cartao.bandeira,
            tipo: "Cartão de Credito",
        }
        setPedido({ 
            ...pedido, 
            meioDePagamentos : pedido.meioDePagamentos.map(meio => 
                meio.index === meioPagamento.index ? meioDePagamentoTemp : meio
        )})
    }

    function addCartao(){
        if(mostrarCartoes==0){
            var indexTemp
            if(pedido.meioDePagamentos.length == 0){
                indexTemp = 1
            }
            else{
                indexTemp = pedido.meioDePagamentos[pedido.meioDePagamentos.length-1].index + 1
            }
            var meio = {
                index: indexTemp,
                tipo: "Cartão de Credito",
                detalhes: " ",
                valor: 0
            }
            setPedido({
                ...pedido,
                meioDePagamentos:[
                    ...pedido.meioDePagamentos,
                    meio
                ]
            })
            setMostrarCartoes(meio.index)
        }
        else{
            alert("Escolha/Remova o cartão primeiro")
        }
    }

    function removerCartao(meioDePagamento){
        if(mostrarCartoes==0 || mostrarCartoes==meioDePagamento.index){
            setPedido({
                ...pedido,
                meioDePagamentos: pedido.meioDePagamentos.filter(meio => meio.index !== meioDePagamento.index )
            })
            setMostrarCartoes(0)
        }
        else{
            alert("Escolha/Remova o cartão primeiro")
        }
    }

    function MostrarCupomPromocinais(props){
        if( mostrarCupomPromocionais==1 ){
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
                <div key={props.meio.index}>
                    <button  className='btn btn-outline-dark' onClick={() => setMostrarCupomPromocionais(true)} style={{ margin:2}}>
                        {separarParagrafo(props.meio.detalhes)}
                    </button>
                </div>
            )
        }
    }

    function selecionarCupomPromocional(cupom,meioPagamento){
        setMostrarCupomPromocionais(-1)
        var meioDePagamentoTemp={
            index:meioPagamento.index,
            detalhes: "Numero: " + cupom.id + "\n" + cupom.descricao,
            tipo: "Cupom Promocional",
            valor: cupom.valor
        }
        setPedido({ 
            ...pedido, 
            meioDePagamentos : pedido.meioDePagamentos.map(meio => 
                meio.index === meioPagamento.index ? meioDePagamentoTemp : meio
        )})
    }

    function addCupomPromocional(){
        if(mostrarCupomPromocionais == 0){
            var indexTemp
            if(pedido.meioDePagamentos.length == 0){
                indexTemp = 1
            }
            else{
                indexTemp = pedido.meioDePagamentos[pedido.meioDePagamentos.length-1].index + 1
            }
            var meio = {
                index: indexTemp,
                tipo: "Cupom Promocional",
                detalhes: " ",
                valor: 0
            }
            setPedido({
                ...pedido,
                meioDePagamentos:[
                    ...pedido.meioDePagamentos,
                    meio
                ]
            })
            setMostrarCupomPromocionais(1)
        }
        else if(mostrarCupomPromocionais == -1){
            alert("É permitido apenas um cupom promocional por compra")
        }
        else{
            alert("Escolha/Remova o Cupom primeiro")
        }
    }
    
    function removerCupomPromocional(meioDePagamento){
        if(mostrarCupomPromocionais==-1 || mostrarCupomPromocionais == 1){
            setPedido({
                ...pedido,
                meioDePagamentos: pedido.meioDePagamentos.filter(meio => meio.index !== meioDePagamento.index )
            })
            setMostrarCupomPromocionais(0)
        }
    }

    function MostrarCupomTroca(props){
        if( mostrarCupomTroca == props.meio.index ){
            var cupomTroca = cliente.cupons.filter(cupom => cupom.tipo === "Troca")
            pedido.meioDePagamentos.forEach(pag => {
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
                <div key={props.meio.index}>
                    <button  className='btn btn-outline-dark' onClick={() => setMostrarCupomTroca(props.meio.index)} style={{ margin:2}}>
                        {separarParagrafo(props.meio.detalhes)}
                    </button>
                </div>
            )
        }
    }

    function selecionarCupomTroca(cupom,meioPagamento){
        setMostrarCupomTroca(0)
        var meioDePagamentoTemp={
            index:meioPagamento.index,
            detalhes: "Numero: " + cupom.id + "\n" + cupom.descricao,
            tipo: "Cupom de Troca",
            valor: cupom.valor
        }
        setPedido({ 
            ...pedido, 
            meioDePagamentos : pedido.meioDePagamentos.map(meio => 
                meio.index === meioPagamento.index ? meioDePagamentoTemp : meio
        )})
    }

    function addCupomTroca(){
        if(mostrarCupomTroca == 0){
            var indexTemp
            if(pedido.meioDePagamentos.length == 0){
                indexTemp = 1
            }
            else{
                indexTemp = pedido.meioDePagamentos[pedido.meioDePagamentos.length-1].index + 1
            }
            var meio = {
                index: indexTemp,
                tipo: "Cupom de Troca",
                detalhes: " ",
                valor: 0
            }
            setPedido({
                ...pedido,
                meioDePagamentos:[
                    ...pedido.meioDePagamentos,
                    meio
                ]
            })
            setMostrarCupomTroca(indexTemp)
        }
        else{
            alert("Escolha/Remova o Cupom primeiro")
        }
    }
    
    function removerCupomTroca(meioDePagamento){
        if(mostrarCupomTroca==0 || mostrarCupomTroca == meioDePagamento.index){
            setPedido({
                ...pedido,
                meioDePagamentos: pedido.meioDePagamentos.filter(meio => meio.index !== meioDePagamento.index )
            })
            setMostrarCupomTroca(0)
        }
    }

    function finalizar(){
        var meioDePagamentosTemp= pedido.meioDePagamentos
        meioDePagamentosTemp.forEach(meio => {
            delete meio.index
        })
        var pedidoTemp = {
            ...pedido,
            meioDePagamentos: meioDePagamentosTemp,
            frete: freteTotal
        }
        alert("pedido: " + JSON.stringify(pedidoTemp))
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

                navigate("/")
                
            }).catch(error =>{
                alert("Cliente save erro" + error.response.data)
            })
        }).catch(error =>{
            alert(error.response.data)
        })
        
    }

    useEffect(() => {
        if(localStorage.getItem( "isLogged" )){
            if(!cliente.id){
                
                ClienteService.getClienteById( localStorage.getItem( "id" ) ).then(res => {
                    setCliente(res.data)
                    if(pedido.itens.length===0){
                        var meioPag;
                        if( res.data.cartoes && res.data.cartoes.length!=0){
                            res.data.cartoes.forEach(cartao => {
                                if(cartao.preferencial){
                                    meioPag = {
                                        index: 1,
                                        tipo: "Cartão de Credito",
                                        detalhes: cartaoToString(cartao),
                                        valor: subtotal + freteTotal
                                    }
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
                            meioDePagamentos: [meioPag]
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

    return(
        <div>
            <h3 style={{ marginTop: 40 }}>Finalizar Pedido</h3>
            <div>
                <div className='row justify-content-end'>
                </div>
                <h4>Pedido:</h4>
                <div>
                    {pedido.itens.map( item => 
                        <div key = {item.id} className='card '>
                            <div className="container" style={{margin: 0,padding :0}}>
                                <div className='card-body'>
                                    <div className='row no-gutters'>
                                        <div className='col-sm-2'>
                                            <img src={'imagens/produtos/' + item.imagemProduto} alt={item.imagemProduto} width='80' height="auto"></img>
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
                            {pedido.meioDePagamentos.filter(meioDePagamentoTemp => meioDePagamentoTemp.tipo==="Cartão de Credito").map( meioDePagamento =>
                                
                                <div className='col'>
                                    <div className='card text-center' >
                                        <div className='card-body'>
                                            <div key={meioDePagamento.index}>
                                                <div className='row'>
                                                    <MostrarCartao meio = {meioDePagamento}/>
                                                </div>
                                                <div className='row' >
                                                    <div className="col-sm-4 text-end">
                                                        <label>Valor:</label>
                                                    </div>
                                                    <div className="col">
                                                        <input className='form-control' value={ moedaRealMask(meioDePagamento.valor) } style={{width:150}} onChange={ ( event ) => valorHandler( event, meioDePagamento ) } ></input>
                                                    </div>
                                                </div>
                                                <button className='btn ' onClick={() => removerCartao(meioDePagamento)}> - Remover</button>
                                            </div>
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
                            {pedido.meioDePagamentos.filter(meioDePagamento => meioDePagamento.tipo==="Cupom Promocional").map( meioDePagamento =>
                                <div key={meioDePagamento.index}>
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
                            {pedido.meioDePagamentos.filter(meioDePagamento => meioDePagamento.tipo==="Cupom de Troca").map( meioDePagamento =>
                                <div key={meioDePagamento.index}>
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
export default FianlizarCompraComponent