import React, { useEffect , useState , useRef} from 'react';
import Overlay from 'react-bootstrap/Overlay';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import {cepMask} from '../etc/Mask'
import {separarParagrafoSemMargemFonte,enderecoToString} from '../etc/Funcoes'

function DetalheProdutoComponent() {
    const navegate = useNavigate()
    const [ subtotal , setSubtotal ] = useState(0)
    const [ freteTotal , setFreteTotal ] = useState(0)
    const [ mostrarEnderecos , setMostrarEnderecos ] = useState(false)
    const [ mostrarNovoEndereco , setMostrarNovoEndereco ] = useState(false)
    const [ enderecoIndexTemp , setEnderecoIndexTemp ] = useState()
    const [ clienteTemp , setClienteTemp ] = useState()
    const [ cliente , setCliente ] = useState( {
        enderecos : []
    } )
    const [ produto , setProduto ] = useState()
    const [ quantidade , setQuantidade] = useState()
    const [ cep , setCep ] = useState()
    const target = useRef(null)

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
            setCep(target.value.replace(/\D/g, ""))
        }
    }
    
    function calculoSubtotal(){
        var subtotalSoma =0
        subtotalSoma =  quantidade * produto.preco
        setSubtotal(subtotalSoma);
    }

    function calculoFreteTotal(){
        var fretetotalSoma = 0
        if(cep.length==8){
            fretetotalSoma +=  0.1 * quantidade
            var cepNumero = cep;
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
                        {separarParagrafoSemMargemFonte(cliente.carrinho.endereco,10)}
                    </button>
                )
            }
            else{
                return (
                    <div>
                        {cliente.enderecos.map(endereco => 
                            <button key={endereco.id} className='btn btn-outline-dark' style={{ margin:2}} onClick={() => selecionarEndereco(endereco.id)}>
                                <p style={{ margin:0, padding:0, fontSize:10}}>{endereco.nome}</p>
                                <p style={{ margin:0, padding:0, fontSize:10}}>{endereco.tipoLogradouro} {endereco.logradouro}, nº {endereco.numero}</p>
                                <p style={{ margin:0, padding:0, fontSize:10}}>{cepMask(endereco.cep)} - {endereco.bairro} - {endereco.cidade} - {endereco.estado}</p>
                            </button>
                        )}
                        <button className='btn btn-outline-dark' style={{ margin:2}} onClick={() => novoEndereco()}>
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
        setCep(endereco.cep)
    }

    async function addItem( produtoId ){
        var carrinho;
        if( !localStorage.getItem( "isLogged" ) ) {
            if( !localStorage.getItem( "carrinhoId" ) ) {
                console.log("Não possue carrinho") 
                
                const carrinhoNovo = { 
                    itens : [], 
                    endereco : null
                }
                carrinho = await CarrinhoService.createCarrinho( carrinhoNovo ).then( res => {
                    return res.data
                });
                localStorage.setItem( "carrinhoId" , carrinho.id )
            }
            else {
                console.log("Possue carrinho") 
                carrinho = await CarrinhoService.getCarrinhoById( localStorage.getItem( "carrinhoId" ) ).then( res => {
                    return res.data
                })
            }
        } 
        else{
            if( localStorage.getItem( "tipo" ) === "CLIENTE" )
            var cliente = await ClienteService.getClienteById( localStorage.getItem( "id" ) ).then( res => {
                return res.data
            })
            carrinho = cliente.carrinho
            console.log("cliente.carrinho" + JSON.stringify(cliente.carrinho))
        }        
        var porduto = await ProdutoService.getProdutoById( produtoId ).then( res => {
            return res.data
        })
        var item =  {
            idProduto: porduto.id, 
            nomeProduto : porduto.nome,
            imagemProduto : porduto.imagens, 
            quantidade : quantidade,
            preco : porduto.preco,
        }        
                
        await CarrinhoService.addItemCarrinho( item , localStorage.getItem( "carrinhoId" ) )
        navigate( "/carrinho" )
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
                setCep(res.data.enderecos[0].cep)
            })
        }
        
    }, []);

    useEffect(() => {
        calculoSubtotal()
        calculoFreteTotal()
    }, [cep,quantidade]);
    

    return (
        <div>
            <h3 style={{ marginTop: 40 }} ref={target}>Meu Carrinho de Compra</h3>
            <div>
                <div className='row justify-content-end'>
                    <div className='col-3 align-content-center' style={{ marginBottom:10 }} >
                        <label>CEP</label>
                        <input value={cepMask(cep)} onChange={(event) => cepHandler(event) }  className='form-control' style={{width:100}}></input>
                        <MostrarEndereco/>
                    </div>
                </div>
                <div>
                    <div className='card '>
                        <div className="container" style={{margin: 0,padding :0}}>
                            <div className='card-body'>
                                <div className='row no-gutters'>
                                    <div className='col-sm-2'>
                                        <img src={'imagens/produtos/' + produto.imagem} width='80' height="auto"></img>
                                    </div>
                                    <div className='col-sm-8'>
                                        <p style={{ height:60}}>Nome: {produto.nome}</p>
                                        <div className="row g-3 align-items-center">
                                            <div className="col-auto">
                                                <label>Quantidade:</label>
                                            </div>
                                            <div className="col-auto">
                                                <input className='form-control' value={ quantidade } style={{width:80}} onChange={ ( event ) => quantideHandler( event, item.id ) } type={"number"} min="1"></input>
                                            </div>
                                            <div className="col-auto">
                                                <label>{ produto.status }</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-2' >
                                        <p align="center" style={{ marginBottom:0}}>Preço</p>
                                        <p align="center">R$ {produto.preco.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2>Subtotal: R$ {subtotal.toFixed(2)} + {freteTotal.toFixed(2)}</h2>
                    <MostrarFinalizarCompra/>
                </div>
            </div>
        </div>
    )
}
export default DetalheProdutoComponent;