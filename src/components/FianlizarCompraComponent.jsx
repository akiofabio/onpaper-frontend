import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import PedidoService from '../services/PedidoService';
import {cepMask} from '../etc/Mask'
import {separarParagrafo} from '../etc/Funcoes'
function FianlizarCompraComponent (){
    const [ subtotal , setSubtotal ] = useState(0)
    const [ freteTotal , setFreteTotal ] = useState(0)
    const [ total , setTotal ] = useState(0)
    const [ mostrarEnderecos , setMostrarEnderecos ] = useState(false)
    const [ mostrarCartoes , setMostrarCartoes ] = useState(0)
    const [ mostrarCupomPromocionais , setMostrarCupomPromocionais ] = useState(0)

    const [ pedido , setPedido ] = useState({
        novo: true,
        itens : [], 
        endereco : {
            cep: " "
        },
        meioDePagamentos: [],
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
    
    function calculoTotal(){
        setTotal(subtotal + freteTotal)
    }

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
    

    function valorHandler(event,meio){
        setPedido({
            ...pedido,
            meioDePagamentos: pedido.meioDePagamentos.map(meioTemp => 
                meioTemp.index === meio.index ? {...meioTemp, valor:event.target.value} : meioTemp
            )
        })
    }

    function MostrarCartao(props){
        if( mostrarCartoes == props.meio.index ){
            var cartoesTemp = cliente.cartoes
            pedido.meioDePagamentos.forEach(pag => {
                cartoesTemp = cartoesTemp.filter(cartao => ("Nome: " + cartao.nome + "\nNumero: " + cartao.numero + "\n" + cartao.bandeira )!== pag.detalhes)
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
                <div>
                    <button  className='btn btn-outline-dark' onClick={() => setMostrarCartoes(props.meio.index)} style={{ margin:2}}>
                        <p>index: {props.meio.index}</p>
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
                            <p style={{ margin:0, padding:0, fontSize:10}}>Valor: {cupom.valor}</p>
                        </button>
                    )}
                </div>          
            )
        }
        else{
            return (
                <div key={props.meio.index}>
                    <button  className='btn btn-outline-dark' onClick={() => setMostrarCupomPromocionais(true)} style={{ margin:2}}>
                        <p>index: {props.meio.index}</p>
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

    useEffect(() => {
        if(localStorage.getItem( "isLogged" )){
            if(!cliente.id){
                ClienteService.getClienteById( localStorage.getItem( "id" ) ).then(res => {
                    setCliente(res.data)
                    if(pedido.novo){
                        var meioPag;
                        if( res.data.cartoes && res.data.cartoes.length!=0){
                            res.data.cartoes.forEach(cartao => {
                                if(cartao.preferencial){
                                    meioPag = {
                                        index: 1,
                                        tipo: "Cartão de Credito",
                                        detalhes: "Nome: " + cartao.nome + "\nNumero: " + cartao.numero + "\n" + cartao.bandeira,
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
                            novo: false,
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
        calculoTotal()
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
                            {pedido.meioDePagamentos.filter(meioDePagamentoTemp => meioDePagamentoTemp.tipo==="Cartão de Credito").map( meioDePagamento =>
                                <div key={meioDePagamento.index}>
                                    <MostrarCartao meio = {meioDePagamento}/>
                                    <div className='row'>
                                        <div className="col-auto">
                                            <label>Valor:</label>
                                        </div>
                                        <div className="col-auto">
                                            <input className='form-control' value={ meioDePagamento.valor } style={{width:80}} onChange={ ( event ) => valorHandler( event, meioDePagamento ) } type={"number"} min="1"></input>
                                        </div>
                                    </div>
                                    <button className='btn ' onClick={() => removerCartao(meioDePagamento)}> - Remover</button>

                                </div>
                            )}
                        </div>
                        <button className='btn ' onClick={() => addCartao()}> + Add Cartão de credito</button>
                    </div>
                    <div className='card'>
                        <h4>Cupons Promocionais: </h4>
                        <div className='card'>
                            {pedido.meioDePagamentos.filter(meioDePagamento => meioDePagamento.tipo==="Cupom Promocional").map( meioDePagamento =>
                                <div key={meioDePagamento.index}>
                                    <MostrarCupomPromocinais meio = {meioDePagamento}/>
                                    <div className='row'>
                                        <div className="col-auto">
                                            <label>Valor: { meioDePagamento.valor.toFixed(2) } </label>
                                        </div>
                                    </div>
                                    <button className='btn ' onClick={() => removerCupomPromocional(meioDePagamento)}> - Remover</button>

                                </div>
                            )}
                        </div>
                        <button className='btn ' onClick={() => addCupomPromocional()}> + Add Cupom Promocional</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FianlizarCompraComponent