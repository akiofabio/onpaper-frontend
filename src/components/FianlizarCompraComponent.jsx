import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import PedidoService from '../services/PedidoService';
import {cepMask} from '../etc/Mask'

function FianlizarCompraComponent (){
    const [ subtotal , setSubtotal ] = useState(0)
    const [ freteTotal , setFreteTotal ] = useState(0)
    const [ mostrarEnderecos , setMostrarEnderecos ] = useState(false)
    const [ mostrarCartao , setMostrarCartoes ] = useState(false)
    const [ pedido , setPedido ] = useState({
        id:null,
        itens : [], 
        endereco : {
            cep: " "
        },
        meioDePagamentos: [{
            tipo: " ",
            detalhes: " ",
            valor: " "
        }],
    })
    const [ cliente , setCliente ] = useState( {
        enderecos : []
    } )

   

    function calculoSubtotal(){
        var subtotalSoma =0
        
        pedido.itens.forEach(item => {
            subtotalSoma +=  item.quantidade * item.produto.preco
        })
        setSubtotal(subtotalSoma);
    }

    function calculoFreteTotal(){
        var fretetotalSoma = 0
        if(pedido.endereco && pedido.endereco.cep.length==8){
            pedido.itens.forEach(item => {
                fretetotalSoma +=  0.1 * item.quantidade
            })
            var cepNumero = pedido.endereco.cep;
            cepNumero = cepNumero.replace(/\D/g, "");
            fretetotalSoma *= (parseFloat(cepNumero))/1000000
        }
        setFreteTotal(fretetotalSoma);
    }
    useEffect(() => {
        if(localStorage.getItem( "isLogged" )){
            if(!cliente.id){
                ClienteService.getClienteById( localStorage.getItem( "id" ) ).then(res => {
                    setCliente(res.data)
                    if(pedido.id==null){
                        var meioPag;
                        if( res.data.cartoes && res.data.cartoes.length!=0){
                            res.data.cartoes.forEach(cartao => {
                                if(cartao.preferencial){
                                    meioPag = {
                                        tipo: "Cartão de Credito",
                                        detalhes: "Nome: " + cartao.nome + "\n Numero: " + cartao.numero 
                                    }
                                }
                            })
                        }
                        else{
                            meioPag={
                                tipo: "SEM Cartão Cadastrado",
                            }
                        }
                        var pedidoTemp = {
                            itens : res.data.carrinho.itens, 
                            endereco : res.data.carrinho.endereco,
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
    }, [pedido]);

    function MostrarEndereco(){
        if( !mostrarEnderecos ){
            return (
                <button className='btn btn-outline-dark' onClick={() => setMostrarEnderecos(true)} style={{ margin:2}}>
                    <p style={{ margin:0, padding:0}}>{pedido.endereco.nome}</p>
                    <p style={{ margin:0, padding:0}}>{pedido.endereco.tipoLogradouro} {pedido.endereco.logradouro}, nº {pedido.endereco.numero}</p>
                    <p style={{ margin:0, padding:0}}>{cepMask(pedido.endereco.cep)} - {pedido.endereco.bairro} - {pedido.endereco.cidade} - {pedido.endereco.estado}</p>
                </button>
            )
        }
        else{
            return (
                <div>
                    {cliente.enderecos.map(endereco => 
                        <button key={endereco.id} className='btn btn-outline-dark' style={{ margin:2}} onClick={() => selecionarEndereco(endereco.id)  }>
                            <p style={{ margin:0, padding:0, fontSize:10}}>{endereco.nome}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}>{endereco.tipoLogradouro} {endereco.logradouro}, nº {endereco.numero}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}>{cepMask(endereco.cep)} - {endereco.bairro} - {endereco.cidade} - {endereco.estado}</p>

                        </button>
                    )}
                </div>
                                    
            )
        }
    }

    function selecionarEndereco(id){
        setMostrarEnderecos(false)
        setPedido({ ...pedido , endereco : cliente.enderecos.find(endereco => endereco.id == id)})
    }
    function separarParagrafo(texto){
        return texto.split("\n").map(txt => <p>{txt}</p>)
    }

    function valorHandler(event,meio){
        setPedido({
            ...pedido,
            meioDePagamentos: pedido.meioDePagamentos.map(meioTemp => 
                meioTemp.index === meio.index ? {...meioTemp, valor:event.targent.value} : meioTemp
            )
        })
    }

    function MostrarCartao(props){
        if( !mostrarCartao ){
            return (
                <div key={props.meio.id}>
                    <button  className='btn btn-outline-dark' onClick={() => setMostrarCartoes(true)} style={{ margin:2}}>
                        <p>Tipo:{props.meio.tipo}</p>
                        <p>{separarParagrafo(props.meio.detalhes)}</p>
                    </button>
                    <div className='row'>
                        <div className="col-auto">
                            <label>Valor:</label>
                        </div>
                    </div>
                    <div className="col-auto">
                        <input className='form-control' value={ props.meio.valor } style={{width:80}} onChange={ ( event ) => valorHandler( event, props.meio ) } type={"number"} min="1"></input>
                    </div>
                </div>
            )
        }
        else{
            return (
                <div>
                    {cliente.cartoes.map(cartao => 
                        <button key={cartao.id} className='btn btn-outline-dark' style={{ margin:2}} onClick={() => selecionarCartao(cartao,props.meio)  }>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Nome: {cartao.nome}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}>Numero: {cartao.numero}</p>
                            <p style={{ margin:0, padding:0, fontSize:10}}> {cartao.bandeira}</p>
                        </button>
                    )}
                </div>          
            )
        }
    }

    function selecionarCartao(cartao,meioPagamento){
        setMostrarCartoes(false)
        var meioDePagamentoTemp={
            detalhes: "Nome: " + cartao.nome + "\nNumero: " + cartao.numero + " Bandeira: " + cartao.bandeira,
            tipo: "Cartão de Credito",
        }
        alert("Teste meioPagamento: "+JSON.stringify(meioPagamento))
        setPedido({ 
            ...pedido, 
            meioDePagamentos : pedido.meioDePagamentos.map(meio => 
                meio.id === meioPagamento.id ? meioDePagamentoTemp : meio
        )})
    }
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
                                            <img src={'imagens/produtos/' + item.produto.imagens} alt={item.produto.imagens} width='80' height="auto"></img>
                                        </div>
                                        <div className='col-sm-8'>
                                            <p style={{ height:60}}>Nome: {item.produto.nome}</p>
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
                                            <p align="center">R$ {item.preco.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                <h3>Endereco de Entrega: </h3>
                <div className='card'>
                    <MostrarEndereco/>
                </div>
                <h2>Subtotal: R$ {subtotal.toFixed(2)} + {freteTotal.toFixed(2)}</h2>
                
                <h3>Meio de Pagamento: </h3>
                
                <div className='card'>
                    <h4>Cartao de Credito: </h4>
                    <div className='card'>
                        {pedido.meioDePagamentos.map( meioDePagamento =>
                            <div key={meioDePagamento.id}>
                                <MostrarCartao meio = {meioDePagamento}/>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
        </div>
    )
}
export default FianlizarCompraComponent