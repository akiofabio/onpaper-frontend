import React, { useEffect , useState , useRef} from 'react';
import Overlay from 'react-bootstrap/Overlay';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import {cepMask} from '../etc/Mask'
import {separarParagrafoSemMargemFonte,enderecoToString} from '../etc/Funcoes'

function CarrinhoComponent() {
    const navigate = useNavigate()
    const [ subtotal , setSubtotal ] = useState(0)
    const [ freteTotal , setFreteTotal ] = useState(0)
    const [ mostrarEnderecos , setMostrarEnderecos ] = useState(false)
    const [ mostrarNovoEndereco , setMostrarNovoEndereco ] = useState(false)
    const [ enderecoIndexTemp , setEnderecoIndexTemp ] = useState()
    const [ clienteTemp , setClienteTemp ] = useState()
    const [ carrinho , setCarrinho ] = useState({
        itens : [], 
        endereco : " ",
        cep : "0"
    })
    const [ cliente , setCliente ] = useState( {
        enderecos : []
    } )

    const target = useRef(null);

    function ItensCarrinho(){
        //console.log("carrinhoID = " + localStorage.getItem("carrinhoId"))
        //console.log("carrinho = " + JSON.stringify(carrinho))

        if( ( !carrinho ) || ( carrinho.itens.length == 0 ) ){
            return(
                <div>
                    <p>O Carrinho está vasio</p> 
                    <a href='/' className ='btn btn-success'>Voltar</a>
                </div>
            )
        }
    }

    function quantideHandler (event , id)  {
        var carrinhoTemp = {...carrinho, itens : carrinho.itens.map(item => 
            item.id === id ? { ...item, quantidade: event.target.value} : item
        )}
        if( localStorage.getItem( "isLogged" ) ){
            CarrinhoService.updateCarrinho(carrinhoTemp,carrinhoTemp.id).then( res => {
                CarrinhoService.getCarrinhoById(res.data.id).then( res2 => {
                    setCarrinho(res2.data)
                })
            }).catch( error => {
                alert(error.response.data)
            })
        }
        else{
            localStorage.setItem("carrinhoTemp",JSON.stringify(carrinhoTemp))
            setCarrinho(carrinhoTemp)
        }
    }

    function cepHandler ( event )  {
        if (!localStorage.getItem("isLogged")){
            var posicao = event.target.selectionStart;
            var cepNumero = cepMask(event.target.value);
            if(event.target.value.length<cepNumero.length){
                posicao++
            }
            if(event.target.value.length>8 && event.target.selectionStart==6){
                posicao++
            }
            event.target.value = cepNumero;
            event.target.selectionStart = posicao;
            event.target.selectionEnd = posicao;
            setCarrinho({...carrinho, cep : event.target.value.replace(/\D/g, "")})
        }
    }
    
    function calculoSubtotal(){
        var subtotalSoma =0
        
        carrinho.itens.forEach(item => {
            subtotalSoma +=  item.quantidade * item.preco
        })
        setSubtotal(subtotalSoma);
    }

    function calculoFreteTotal(){
        var fretetotalSoma = 0
        if(carrinho.endereco && carrinho.cep.length==8){
            carrinho.itens.forEach(item => {
                fretetotalSoma +=  0.1 * item.quantidade
            })
            var cepNumero = carrinho.cep;
            cepNumero = cepNumero.replace(/\D/g, "");
            fretetotalSoma *= (parseFloat(cepNumero))/1000000
        }
        setFreteTotal(fretetotalSoma);
    }

    function MostrarEndereco(){
        if( localStorage.getItem( "isLogged" ) ){
            if( !mostrarEnderecos ){
                return (
                    <button className='btn btn-outline-dark' onClick={() => setMostrarEnderecos(true)} style={{ margin:2}}>
                        {separarParagrafoSemMargemFonte(carrinho.endereco,10)}
                    </button>
                )
            }
            else{
                return (
                    <div>
                        {cliente.enderecos.map(endereco => 
                            <button name={"end_tbn"+cliente.enderecos.indexOf(endereco)} key={endereco.id} className='btn btn-outline-dark' style={{ margin:2}} onClick={() => selecionarEndereco(endereco.id)}>
                                <p style={{ margin:0, padding:0, fontSize:10}}>{endereco.nome}</p>
                                <p style={{ margin:0, padding:0, fontSize:10}}>{endereco.tipoLogradouro} {endereco.logradouro}, nº {endereco.numero}</p>
                                <p style={{ margin:0, padding:0, fontSize:10}}>{cepMask(endereco.cep)} - {endereco.bairro} - {endereco.cidade} - {endereco.estado}</p>
                            </button>
                        )}
                        <button name="novoEndButton" className='btn btn-outline-dark' style={{ margin:2}} onClick={() => novoEndereco()}>
                            <p style={{ margin:0, padding:0, fontSize:15}}>Novo Endereco</p>
                        </button>
                    </div>        
                )
            }
        }
        else{
            
        }
    }

    function selecionarEndereco(id){
        setMostrarEnderecos(false)
        var endereco = cliente.enderecos.find(endereco => endereco.id == id)
        setCarrinho({ 
            ...carrinho,
            cep: endereco.cep,
            endereco : enderecoToString(endereco)})
    }

    function novoEndereco(){
        setClienteTemp({...cliente , enderecos : [...cliente.enderecos,{nome:"", cep:"", estsdo:"", cidade:"", bairro:"", tipoLogradouro:"", logradouro:"", numero:""}]})
        setEnderecoIndexTemp(cliente.enderecos.length)
        setMostrarNovoEndereco(true)
    }

    function novoEnderecoOverlay(){
        return(
            <div>
                <Overlay show={mostrarNovoEndereco} placement="auto">
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                position: 'fixed',
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0, 0, 0, 0.4)',
                                transform: 'translate(0%,0%)',
                               
                            }}
                        >
                            <div className='card border-dark' style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translate(-50%)',
                                maxHeight: '100%',
                                overflowY: 'scroll'
                            }}>
                                <div  className="card-header border-dark bg-dark text-white">
                                    <h3 className='text-center'>Alterar Endereço</h3>
                                </div>
                                <div className='card-body' >
                                    <div className='form-group'>
                                        <label>Nome:</label>
                                        <input type={"text"} placeholder='Nome' name='nome_end_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].nome} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, nome : event.target.value} : end)})} size="80"></input>
                                        <label>CEP:</label>
                                        <input type={"text"} placeholder='CEP' name='cep_end_input' className='form-control' value={cepMask(clienteTemp.enderecos[enderecoIndexTemp].cep)} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, cep : event.target.value.replace(/\D/g, "")} : end)})}></input>
                                        <div className='row'>
                                            <div className='col'>
                                                <label>País:</label>
                                                <input type={"text"} placeholder='País' name='pais_end_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].pais} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, pais : event.target.value} : end)})}></input>
                                            </div>
                                            <div className='col'>
                                                <label>Estado:</label>
                                                <input type={"text"} placeholder='Estado' name='estado_end_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].estado} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, estado : event.target.value} : end)})}></input>
                                            </div>
                                        </div>
                                        <label>Cidade:</label>
                                        <input type={"text"} placeholder='Cidade' name='cidade_end_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].cidade} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, cidade : event.target.value} : end)})}></input>
                                        <label>Bairro:</label>
                                        <input type={"text"} placeholder='Tipo' name='bairro_end_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].bairro} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, bairro : event.target.value} : end)})}></input>
                                        <div className='row'>
                                            <div className='col col-sm-5'>
                                                <label>Tipo de Logradouro:</label>
                                                <input type={"text"} placeholder='Tipo de Logradouro' name='tipo_logradouro_end_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].tipoLogradouro} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, tipoLogradouro : event.target.value} : end)})}></input>
                                            </div>
                                            <div className='col'>
                                                <label>Logradouro:</label>
                                                <input type={"text"} placeholder='Logradouro' name='logradouro_end_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].logradouro} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, logradouro : event.target.value} : end)})}></input>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col col-sm-5'>
                                                <label>Numero:</label>
                                                <input type={"text"} placeholder='Numero' name='numero_end_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].numero} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, numero : event.target.value} : end)})}></input>
                                            </div>
                                            <div className='col col-sm-5'>
                                                <label>Tipo:</label>
                                                <input type={"text"} placeholder='Tipo do endereço, Ex. Casa, Predio, etc.' name='tipo_end_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].tipo} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, tipo : event.target.value} : end)})}></input>
                                            </div>
                                        </div>
                                        <label>Observacao:</label>
                                        <input type={"text"} placeholder='Observacao' name='observacao_end_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].observacao} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, observacao : event.target.value} : end)})}></input>
                                        <input type={"checkbox"} name='entrega_end_input' onClick={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, entrega : !clienteTemp.enderecos[enderecoIndexTemp].entrega} : end)})} checked={clienteTemp.enderecos[enderecoIndexTemp].entrega}></input>Endereço de Entrega
                                        <br></br>
                                        <input type={"checkbox"} name='cobranca_end_input' onClick={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, cobranca : !clienteTemp.enderecos[enderecoIndexTemp].cobranca} : end)})} checked={clienteTemp.enderecos[enderecoIndexTemp].cobranca}></input>Endereço de Cobrança
                                        
                                    </div>
                                </div>
                                <div className='row justify-content-md-center'>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' name='salvar_end_button' style={{marginBottom: 5} } onClick={() => salvar(clienteTemp)}>Salvar</button>
                                    </div>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' name='cancelar_end_button' style={{marginBottom: 5}} onClick={() => setMostrarNovoEndereco(!mostrarNovoEndereco)}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    )}
                </Overlay>
            </div>
        )
    }

    function salvar(cli){
        ClienteService.updateCliente(cli, cliente.id).then(res => {
            var usuario = res.data
            localStorage.setItem( "id" , usuario.id )
            localStorage.setItem( "tipo" , usuario.tipo )
            localStorage.setItem( "isLogged" , true )
            if(usuario.tipo == "CLIENTE"){
                if(localStorage.getItem("carrinhoId")){

                }
                localStorage.setItem( "carrinhoId" , usuario.carrinho.id )
            }
            alert("Cliente Alterado com sucesso")
            setCliente(usuario)
            setMostrarNovoEndereco(false)
        }).catch(error => {
            alert(error.response.data)
        })
    }

    function MostrarFinalizarCompra(){
        if( ( carrinho.cep ) && ( carrinho.cep.length == 8 ) && ( carrinho.itens.length!=0 )){
            return(
                <button type="button" className="btn btn-dark" onClick={() => finalizarCompra()}>Finalizar Compra</button>
            )
        }
        else{
            return(
                <button type="button" className="btn btn-dark" disabled>Finalizar Compra</button>
            )
        }
    }

    function finalizarCompra(){
        if( localStorage.getItem( "isLogged" ) ){
            navigate("/finalizar_compra")
        }
        else{
            navigate("/login")
        }
    }

    function removeItem( item ){
        if( localStorage.getItem( "isLogged" )){
            CarrinhoService.removeItemCarrinho( item , carrinho.id ).then( res => {
                setCarrinho(res.data)
            })
        }
        else{
            var car = carrinho
            car.itens = car.itens.filter(itemTemp =>
                car.itens.indexOf(itemTemp) !== car.itens.indexOf(item)
            )
            localStorage.setItem("carrinhoTemp", JSON.stringify(car))
            setCarrinho(car)
            navigate(0)
        }
    }

    useEffect(() => {
        if(localStorage.getItem( "isLogged" )){
            ClienteService.getClienteById( localStorage.getItem( "id" ) ).then(res => {
                if(res.data.carrinho.endereco==null){
                    var endereco = res.data.enderecos[0]
                    res.data.carrinho.endereco = "Nome: " + endereco.nome + 
                    "\n" + endereco.tipoLogradouro + " " + endereco.logradouro + ", nº " + endereco.numero +
                    "\n" + cepMask(endereco.cep) + " - " + endereco.bairro + " - " + endereco.cidade + " - " + endereco.estado
                    res.data.carrinho.cep = endereco.cep
                    res.data.carrinho.idEndereco = endereco.id
                    CarrinhoService.updateCarrinho(res.data.carrinho,res.data.carrinho.id)
                }
                setCliente(res.data)
                setCarrinho(res.data.carrinho)
            })
        }
        else{
            if( localStorage.getItem( "carrinhoTemp" ) ){
                setCarrinho(JSON.parse(localStorage.getItem( "carrinhoTemp" )))
            }
            else{
                var carrinhoTemp = { 
                    itens : [], 
                    endereco : null,
                    cep: '',
                };
                setCarrinho(carrinhoTemp)
            }
        }
    }, []);

    useEffect(() => {
        calculoSubtotal()
        calculoFreteTotal()
    }, [carrinho]);
    

    return (
        <div>
            <h3 style={{ marginTop: 40 }} ref={target}>Meu Carrinho de Compra</h3>
            <div>
                <div className='row justify-content-end'>
                    <div className='col-3 align-content-center' style={{ marginBottom:10 }} >
                        <label>CEP</label>
                        <input value={cepMask(carrinho.cep)} onChange={(event) => cepHandler(event) }  className='form-control' style={{width:100}}></input>
                        <MostrarEndereco/>
                        {novoEnderecoOverlay()}
                    </div>
                </div>
                <ItensCarrinho/>
                <div>
                    {carrinho.itens.map( item => 
                        <div key = {item.id} className='card '>
                            <div className="container" style={{margin: 0,padding :0}}>
                                <div className='card-body'>
                                    <div className='row no-gutters'>
                                        <div className='col' style={{textAlign:'center', width:160, height:160}}>
                                            <img src={'imagens/produtos/' + item.imagemProduto} alt={item.imgemProduto} style={{maxHeight:"100%"}}></img>
                                        </div>
                                        <div className='col-sm-8'>
                                            <p style={{ height:60}}>Nome: {item.nomeProduto}</p>
                                            <div className="row g-3 align-items-center">
                                                <div className="col-auto">
                                                    <label>Quantidade:</label>
                                                </div>
                                                <div className="col-auto">
                                                    <input name={'quantidade_input'+ carrinho.itens.indexOf(item)} className='form-control' value={ item.quantidade } style={{width:80}} onChange={ ( event ) => quantideHandler( event, item.id ) } type={"number"} min="1"></input>
                                                </div>
                                                <div className="col-auto">
                                                    <label>{ item.status }</label>
                                                </div>
                                                <div className="col-auto">
                                                    <button name={'remover_button'+ carrinho.itens.indexOf(item)} className='btn' onClick={() => removeItem( item )}> - Remover</button>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div className='col-sm-2' >
                                            <p align="center" style={{ marginBottom:0}}>Preço</p>
                                            <p align="center">R$ {item.preco.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <h2>Subtotal: R$ {subtotal.toFixed(2)} + {freteTotal.toFixed(2)}</h2>
                    <MostrarFinalizarCompra/>
                </div>
            </div>
        </div>
    )
}
export default CarrinhoComponent;