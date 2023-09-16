import React, { useEffect , useState , useRef} from 'react';
import Overlay from 'react-bootstrap/Overlay';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import {cepMask,moedaRealMask} from '../etc/Mask'
import {separarParagrafoSemMargemFonte,enderecoToString} from '../etc/Funcoes'

function DetalheProdutoComponent() {
    const navigate = useNavigate()
    const parametros = useParams()
    const [ subtotal , setSubtotal ] = useState(0)
    const [ freteTotal , setFreteTotal ] = useState(0)
    const [ mostrarEnderecos , setMostrarEnderecos ] = useState(false)
    const [ cliente , setCliente ] = useState( {
        id: null,
        enderecos : []
    } )
    const [ produto , setProduto ] = useState({
        id : null,
        imagens : "produto2.jpg",
        nome : "",
        preco : 0,
        categorias:[],
        fabricante:{
            nome:""
        },
    })
    const [ quantidade , setQuantidade] = useState(1)
    const [ quantidadeDisponivel , setQuantidadeDisponivel] = useState(0)
    const [ cep , setCep ] = useState(0)
    const target = useRef(null)

    function cepHandler ( event )  {
        var cepTemp = event.target.value.replace(/\D/g, "");
        if(cepTemp==""){
            event.target.value=''
        }
        if(Number.isInteger(cepTemp)){
            cepTemp.toString()
        }
        
        if(cepTemp.length>8){
            cepTemp = cepTemp.slice(0, 8);
        }
        calculoFreteTotal()
        setCep(cepTemp)
    }
    
    function quantideHandler (event)  {
        if(event.target.value <= quantidadeDisponivel){
            setQuantidade( event.target.value )
        }
        else{
            alert("Quantidade indisponivel")
        }
    }

    function calculoSubtotal(){
        var subtotalSoma =0
        subtotalSoma =  quantidade * produto.preco
        setSubtotal(subtotalSoma);
    }

    function calculoFreteTotal(){
        var fretetotalSoma = 0
        if(Number.isInteger(cep)){
            cep.toString()
        }
        if(cep.length==8){
            fretetotalSoma +=  0.1 * quantidade
            fretetotalSoma *= (parseFloat(cep))/1000000
        }
        setFreteTotal(fretetotalSoma);
    }

    function MostrarEndereco(){
        if( localStorage.getItem( "isLogged" ) ){
            if( !mostrarEnderecos ){
                return (
                    <button className='btn btn-outline-dark' onClick={() => setMostrarEnderecos(true)} style={{ margin:2}}>
                        Escolher Endereço
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
                    </div>        
                )
            }
        }
        else{
            return (
                <button  disabled className='btn btn-outline-dark' onClick={() => setMostrarEnderecos(true)} style={{ margin:2}}>
                    Escolher Endereço
                </button>
            )
        }
    }

    function selecionarEndereco(id){
        setMostrarEnderecos(false)
        var endereco = cliente.enderecos.find(endereco => endereco.id == id)
        setCep(endereco.cep)
    }

    
    async function addItem( produtoId ){
        localStorage.clear()
        var produto = await ProdutoService.getProdutoById( produtoId ).then( res => {
            return res.data
        })
        var item =  {
            idProduto: produto.id, 
            nomeProduto : produto.nome,
            imagemProduto : produto.imagens, 
            quantidade : quantidade,
            preco : produto.preco,
        } 
        
        if( !localStorage.getItem( "isLogged" ) ) {
            var carrinhoTemp
            if( !localStorage.getItem( "carrinhoTemp" ) ) {
                carrinhoTemp = { 
                    itens : [], 
                    endereco : " ",
                    cep: cep,
                };
            }
            else{
                carrinhoTemp = JSON.parse(localStorage.getItem( "carrinhoTemp" ))
            }
            carrinhoTemp.itens.push(item)
            localStorage.setItem( "carrinhoTemp" , JSON.stringify(carrinhoTemp))
        } 
        else{
            if( localStorage.getItem( "tipo" ) === "CLIENTE" ){
                var cliente = await ClienteService.getClienteById( localStorage.getItem( "id" ) ).then( res => {
                    return res.data
                })
                if( !localStorage.getItem( "carrinhoId" ) ) {
                    localStorage.setItem( "carrinhoId", cliente.carrinho.id)
                }
            }
            await CarrinhoService.addItemCarrinho( item , localStorage.getItem( "carrinhoId" ) )
        }
        navigate( "/carrinho" )
    }

    function pesquisarCategoria(categoria){
        alert("Não implementado")
    }

    useEffect(() => {
        if(produto.id == null)
            ProdutoService.getProdutoById(parametros.id).then(res => {
                setProduto(res.data)
                setQuantidadeDisponivel(res.data.quantidade - res.data.quantidadeBloqueada)
                
                setSubtotal(quantidade * res.data.preco );
        })
        if(localStorage.getItem( "isLogged" ) && cliente.id===null ){
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
        <div style={{margin: 60}}>
            <div className='card ' >
                <div className="container" style={{margin: 0,padding :0}}>
                    <div className='card-body'>
                        <div className='row no-gutters'>
                            <div className='col' style={{textAlign:'center', width:420, height:420}}>
                                <img src={'/imagens/produtos/' + produto.imagens} alt={produto.imagens}  style={{maxHeight:"100%",maxWidth:"100%"}} ></img>
                            </div>
                            <div className='col-sm-8'>
                                <div className="row">
                                    <label>Nome:</label>
                                    <textarea value={produto.nome} disabled></textarea>
                                </div>
                                <div className="row">
                                    <label>Descrição:</label>
                                    <textarea value={produto.descricao} disabled></textarea>
                                </div>
                                <div className="row">
                                    <label>Categorias:</label>
                                    {produto.categorias.map(categoria => 
                                        <div className='col-auto'>
                                            <button className='btn btn-outline-dark' onClick={()=>pesquisarCategoria(categoria.nome)}>{categoria.nome}</button>
                                        </div>
                                    )}
                                </div>
                                <div className="row">
                                    <label>Fabricante:</label>
                                    <div className='col-auto'>
                                        <button className='btn btn-outline-dark' onClick={()=>pesquisarCategoria(produto.fabricante.nome)}>{produto.fabricante.nome}</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <label>Preço Unitario: { moedaRealMask(produto.preco)}</label>
                                </div>
                                <div className="row g-3 align-items-center">
                                    <div className="col-auto">
                                        <label>Quantidade:</label>
                                    </div>
                                    <div className="col-auto">
                                        <input className='form-control' value={ quantidade } style={{width:80}} onChange={ ( event ) => quantideHandler( event ) } type={"number"} min="1"></input>
                                    </div>
                                    <div className="col-auto">
                                        <label>Quantidade Disponivel: { quantidadeDisponivel }</label>
                                    </div>
                                </div>
                                <div className="row" style={{marginTop: 30}}>
                                    <div className="col-sm-2">
                                        <label>Frete: { moedaRealMask(freteTotal)}</label>
                                    </div>
                                    <div className="col-auto">
                                        <label>CEP:</label>
                                    </div>
                                    <div className="col-auto">
                                        <input value={cepMask(cep)} onChange={(event) => cepHandler(event) }  className='form-control' style={{width:100}}></input>
                                    </div>
                                    <div className="col-auto">
                                        <MostrarEndereco/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Subtotal: R$ {subtotal.toFixed(2)} + {freteTotal.toFixed(2)}</h2>
            <button type="button" className='btn btn-dark' onClick={()=>addItem(produto.id)}>Adicionar ao Carrinho</button>
        </div>
    )
}
export default DetalheProdutoComponent;