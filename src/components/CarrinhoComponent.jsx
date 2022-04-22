import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';

function CarrinhoComponent() {
    const [ carrinho , setCarrinho ] = useState({
        itens : [], 
        endereco : null
    })
    const [ subtotal , setSubtotal ] = useState(0)
    const [ freteTotal , setFreteTotal ] = useState(0)
    const [ cliente , setCliente ] = useState( {
        endereco : []
    } )
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
         
        setCarrinho({...carrinho,itens : carrinho.itens.map(item => 
            item.id === id ? { ...item, quantidade:event.target.value,frete: ( event.target.value*0.2 )} : item
        )})
        
    }

    function calculoSubtotal(){
        var subtotalSoma =0
        
        carrinho.itens.forEach(item => {
            subtotalSoma +=  item.quantidade * item.produto.preco
        })
        setSubtotal(subtotalSoma.toFixed(2));
    }

    function calculoFreteTotal(){
        var fretetotalSoma = 0
        
        carrinho.itens.forEach(item => {
            fretetotalSoma +=  item.frete
        })
        setFreteTotal(fretetotalSoma.toFixed(2));
    }

    useEffect(() => {
        //console.log("Carrinho")
        //console.log("carrinhoID = " + localStorage.getItem("carrinhoId"))
        if( !localStorage.getItem( "carrinhoId" ) ){
            const carrinhoNovo = { 
                itens : [], 
                endereco : null
            }
            CarrinhoService.createCarrinho( carrinhoNovo ).then( res => {
                setCarrinho( res.data );
                localStorage.setItem( "carrinhoId" , res.data.id )
            })
        }
        else{
            CarrinhoService.getCarrinhoById( localStorage.getItem( "carrinhoId" ) ).then( ( res ) => {
                setCarrinho( res.data );
                console.log( "carrinhoLoad = " + JSON.stringify(res.data) )
            })
        }
        
    }, []);

    useEffect(() => {
        calculoSubtotal()
        calculoFreteTotal()
    }, [carrinho]);
    

    return (
        <div>
            <h3 style={{ marginTop: 40 }}>Meu Carrinho de Compra</h3>
            <div>
                <ItensCarrinho/>
                <div>
                    {carrinho.itens.map( item => 
                        <div key = {item.id} className='card '>
                            <div className="container">
                                <div className='card-body' style={{ paddingRight:0 }}>
                                    <div className='row no-gutters'>
                                        <div className='col-sm-2'>
                                            <img src={'imagens/produtos/' + item.produto.imagens} alt={item.produto.imagens} width='80' height="auto"></img>
                                        </div>
                                        <div className='col-sm-6'>
                                            <p style={{ height:60}}>Nome: {item.produto.nome}</p>
                                            <div className="row g-3 align-items-center">
                                                <div className="col-auto">
                                                    <label>Quantidade:</label>
                                                </div>
                                                <div className="col-auto">
                                                    <input className='form-control' value={ item.quantidade} style={{width:80}} onChange={ ( event ) => quantideHandler( event, item.id ) } autoFocus type={"number"} min="1"></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-2' >
                                            <p align="right" style={{ marginBottom:0}}>Preço</p>
                                            <p align="right">R$ {item.preco.toFixed(2)}</p>
                                        </div>
                                        <div className='col-sm-2'>
                                            <p align="right" style={{ marginBottom:0}}>Frete</p>
                                            <p align="right">R$ {item.frete.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <h2>Subtotal: R$ {subtotal} + {freteTotal}</h2>
                </div>
            </div>
        </div>
    )
}
export default CarrinhoComponent;