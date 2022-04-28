import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';

function finalizarCompraComponent (){
    const [ subtotal , setSubtotal ] = useState(0)
    const [ freteTotal , setFreteTotal ] = useState(0)
    const [ mostrarEnderecos , setMostrarEnderecos ] = useState(false)
    const [ carrinho , setCarrinho ] = useState({
        itens : [], 
        endereco : {
            cep: " "
        }
    })

    return(
        <div>
            <h3 style={{ marginTop: 40 }}>Meu Carrinho de Compra</h3>
            <div>
                <div className='row justify-content-end'>
                    <div className='col-3 align-content-center' style={{ marginBottom:10 }} >
                        <label>CEP</label>
                        <input value={cepMask(carrinho.endereco.cep)} onChange={(event) => cepHandler(event) }  className='form-control' style={{width:100}}></input>
                        <MostrarEndereco/>
                    </div>
                </div>
                <ItensCarrinho/>
                <div>
                    {carrinho.itens.map( item => 
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
                                                    <input className='form-control' value={ item.quantidade } style={{width:80}} onChange={ ( event ) => quantideHandler( event, item.id ) } type={"number"} min="1"></input>
                                                </div>
                                                <div className="col-auto">
                                                    <label>{ item.status }</label>
                                                </div>
                                                <div className="col-auto">
                                                    <button className='btn' onClick={() => removeItem( item )}> Remover</button>
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
                    <h2>Subtotal: R$ {subtotal} + {freteTotal.toFixed(2)}</h2>
                    <MostrarFinalizarCompra/>
                </div>
            </div>
        </div>
    
    )
}
export default finalizarCompraComponent