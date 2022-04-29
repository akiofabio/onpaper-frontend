import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import {cepMask} from '../etc/Mask'

function FianlizarCompraComponent (){
    const [ subtotal , setSubtotal ] = useState(0)
    const [ freteTotal , setFreteTotal ] = useState(0)
    const [ mostrarEnderecos , setMostrarEnderecos ] = useState(false)
    const [ mostrarCartao , setmostrarCartao ] = useState(false)
    const [ pedido , setPedido ] = useState({
        itens : [], 
        endereco : {
            cep: " "
        },
        meioDePagamentos: [],
    })
    const [ cliente , setCliente ] = useState( {
        enderecos : []
    } )

    useEffect(() => {
        if(localStorage.getItem( "isLogged" )){

            ClienteService.getClienteById( localStorage.getItem( "id" ) ).then(res => {
                setCliente(res.data)
                setPedido(res.data.carrinho)
            })
        }
    }, []);

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

    function MostrarCartao(){
        if( !mostrarCartao ){
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
                                            <p style={{ height:60}}>Id: {item.id}   qtdBloc: {item.produto.quantidadeBloqueada}</p>
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
                        <MostrarCartao/>
                    </div>
                </div>

            </div>
        </div>
    </div>
    )
}
export default FianlizarCompraComponent