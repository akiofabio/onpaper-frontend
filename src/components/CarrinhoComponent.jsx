import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import {cepMask} from '../etc/Mask'
import {separarParagrafoSemMargem} from '../etc/Funcoes'

function CarrinhoComponent() {
    const navegate = useNavigate()
    const [ subtotal , setSubtotal ] = useState(0)
    const [ freteTotal , setFreteTotal ] = useState(0)
    const [ mostrarEnderecos , setMostrarEnderecos ] = useState(false)
    const [ carrinho , setCarrinho ] = useState({
        itens : [], 
        endereco : " ",
        cep : "0"
    })
    
    const [ cliente , setCliente ] = useState( {
        enderecos : []
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
        var carrinhoTemp ={...carrinho,itens : carrinho.itens.map(item => 
            item.id === id ? { ...item, quantidade:event.target.value} : item
        )}
        CarrinhoService.updateCarrinho(carrinhoTemp,carrinhoTemp.id).then( res => {
            CarrinhoService.getCarrinhoById(res.data.id).then( res2 => {
                setCarrinho(res2.data)
            })
        }).catch( error => {
            alert(error.response.data)
        })
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
                        <p style={{ margin:0, padding:0, fontSize:10}}>{separarParagrafoSemMargem(carrinho.endereco)}</p>
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
        else{
            
        }
    }

    function selecionarEndereco(id){
        setMostrarEnderecos(false)
        var endereco = cliente.enderecos.find(endereco => endereco.id == id)
        setCarrinho({ 
            ...carrinho,
            cep: endereco.cep,
            endereco : "Nome: " + endereco.nome + 
                        "\n" + endereco.tipoLogradouro + " " + endereco.logradouro + ", nº " + endereco.numero +
                        "\n" + cepMask(endereco.cep) + " - " + endereco.bairro + " - " + endereco.cidade + " - " + endereco.estado})
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
            navegate("/finalizar_compra")
        }
        else{
            navegate("/login")
        }
    }

    function removeItem( item ){
        CarrinhoService.removeItemCarrinho( item , carrinho.id ).then( res => {
            setCarrinho(res.data)
        })
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
            if( !localStorage.getItem( "carrinhoId" ) ){
            
                CarrinhoService.createCarrinho( carrinho ).then( res => {
                    setCarrinho( res.data );
                    localStorage.setItem( "carrinhoId" , res.data.id )
                })
            }
            else{
                CarrinhoService.getCarrinhoById( localStorage.getItem( "carrinhoId" ) ).then( ( res ) => {
                    var carrinhoTemp =  res.data
                    
                    if(res.data.endereco==null){
                        carrinhoTemp.cep = " "
                    }
                    setCarrinho( res.data );
                    CarrinhoService.updateCarrinho(res.data)
                    //console.log( "carrinhoLoad = " + JSON.stringify(res.data) )
                })
            }
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
                <div className='row justify-content-end'>
                    <div className='col-3 align-content-center' style={{ marginBottom:10 }} >
                        <label>CEP</label>
                        <input value={cepMask(carrinho.cep)} onChange={(event) => cepHandler(event) }  className='form-control' style={{width:100}}></input>
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
                                            <img src={'imagens/produtos/' + item.imagemProduto} alt={item.imgemProduto} width='80' height="auto"></img>
                                        </div>
                                        <div className='col-sm-8'>
                                            <p style={{ height:60}}>Nome: {item.nomeProduto}</p>
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
                                                    <button className='btn' onClick={() => removeItem( item )}> - Remover</button>
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