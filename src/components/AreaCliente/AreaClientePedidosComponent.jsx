import React, { useEffect, useState } from "react";
import { moedaRealMask , stringDataMask , dataToStringDataHoraMask} from "../../etc/Mask";
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import Overlay from 'react-bootstrap/Overlay';
import ClienteService from "../../services/ClienteService";
import PedidoService from "../../services/PedidoService";
import { getUltimoStatus } from "../../etc/Funcoes";
import ItemService from "../../services/ItemService";
function AreaClientePedidosComponent (props){
    const [cliente, setCliente] = useState({
        email: "",
        senha: "",
        nome: "",
        cpf: "",
        genero: "",
        dataNascimento:"",
        
        telefones: [{
            tipo:"",
            ddd:"",
            numero:""
        }],
        
        enderecos: [{
            nome:"",
            cep:"",
            estado:"",
            cidade:"",
            bairro:"",
            tipoLogradouro:"",
            logradouro:"",
            numero:"",
            observacao:""
        }],
        cartoes: [{
            nome:"",
            numero:"",
            codigoSeguranca:"",
            validade:"",
            preferencial:false,
            bandeira:""
        }],
        cupons: [],
        pedidos: [],
        carrinho:null,
    })
    const navegation = useNavigate()
    
    const [pedidoTemp, setPedidoTemp] = useState();
    const [mostrarQuantidadeTroca, setMostrarQuantidadeTroca] = useState(false);

    function calculoSubtotal(pedido){
        var subtotalSoma =0
        
        pedido.itens.forEach(item => {
            subtotalSoma +=  item.quantidade * item.preco
        })
        return subtotalSoma;
    }

    function calculoValorTroca(pedido){
        var total =0
        
        pedido.itens.forEach(item => {
            total +=  item.quantidadeTrocar * item.preco
        })
        return total;
    }

    function MostrarBotataoDevolverItem(props){
        /*
        if( props.status=="Entregue"){
            return(
                <div>
                    <button className="btn btn-dark" onClick={() => mudarStatusItem("Em Troca", props.item)}>Trocar Item</button>
                </div>
            )
        }
        */
    }
    
    function MostrarBotaoDevolverPedido(props){
        if( props.status=="Entregue"){
            return(
                <div>
                    <button name={"devolver_pedido_button"+cliente.pedidos.indexOf(props.pedido)} className="btn btn-dark" onClick={() => mudarStatus("Em Troca",props.pedido)}>Trocar Pedido</button>
                    <button name={"devolver_pedido_parcial_button"+cliente.pedidos.indexOf(props.pedido)}className="btn btn-dark" onClick={() => trocaParcialButton(props.pedido)}>Trocar Pedido Parcialmente</button>
                </div>
            )
        }
        else if(props.status=="Em Processamento" || props.status=="Aprovado" || props.status=="Em Preparo" ){
            return(
                <div>
                    <button className="btn btn-dark" onClick={() => mudarStatus("Em Cancelamento",props.pedido)}>Cancelar Pedido</button>
                </div>
            )
        }
    }

    function trocaParcialButton(pedido){
        pedido.itens.forEach(item => {
            item.quantidadeTrocar = item.quantidade
        })
        setPedidoTemp(pedido)
        setMostrarQuantidadeTroca(true)
    }

    function trocaParcial(){
        PedidoService.trocaParcialPedido(pedidoTemp).then(res => {
            setMostrarQuantidadeTroca(false)
            setCliente({...cliente, pedidos : cliente.pedidos.map( pedido => pedido.id === pedidoTemp.id? res.data : pedido)})
        }).catch(erro => {
            alert(JSON.stringify(erro.response.data))
        })
    }

    function quantideHandler (event , item)  {
        setPedidoTemp({...pedidoTemp, itens : pedidoTemp.itens.map(itemTemp => 
            pedidoTemp.itens.indexOf(itemTemp) === pedidoTemp.itens.indexOf(item) ? { ...item, quantidadeTrocar: event.target.value} : itemTemp
        )})
    }

    function quantidadeTrocaOverlay(){
        return(
            <div>
                <Overlay show={mostrarQuantidadeTroca} placement="auto">
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
                                    <h3 className='text-center'>Solicitar Troca do Pedido</h3>
                                </div>
                                <div className='card-body' >
                                    <div className='form-group'>


                        {pedidoTemp.itens.map( item =>
                            <div key={item.id} className="card border-dark">
                                <div className="card-body">
                                    <div className='row no-gutters'>
                                        <div className='col-sm-2'  style={{textAlign:'center', width: 90, height:90}}>
                                            <img src={'/imagens/produtos/' + item.imagemProduto} alt={item.imgemProduto}  className="img-fluid" style={{maxHeight:"100%"}}></img>
                                        </div>
                                        <div className='col-sm-10'>
                                            <div className="row align-items-center">
                                                <label style={{ height:60}}>Nome: {item.nomeProduto}</label>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className='col' >
                                                    <label>Quantidade Pedida: { item.quantidade } </label>
                                                </div>
                                                <div className='col' >
                                                    <p align="center" style={{ marginBottom:0}}>Preço Unitário: {moedaRealMask(item.preco)}</p>
                                                </div>
                                                <div className='col' >
                                                    <label>Quantidade a Trocar:</label>
                                                    <input name={'quantidade_input'+ pedidoTemp.itens.indexOf(item)} className='form-control' value={ item.quantidadeTrocar } style={{width:80}} onChange={ ( event ) => quantideHandler( event, item ) } type={"number"} min="0" max={item.quantidade}></input>
                                                </div>
                                                <div className='col' >
                                                    <label>Valor do Item a Trocar: {moedaRealMask(item.preco*item.quantidadeTrocar)}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                                        
                                    </div>
                                    <label>Valor Total da Trocar: {moedaRealMask(calculoValorTroca(pedidoTemp))}</label>
                                </div>
                                

                                <div className='row justify-content-md-center'>
                                    <div className='col-auto'>
                                        <button name='confimar_button' className='btn btn-dark'  style={{marginBottom: 5} } onClick={() => trocaParcial()}>Confirmar</button>
                                    </div>
                                    <div className='col-auto'>
                                        <button name='cancelar_button' className='btn btn-dark' style={{marginBottom: 5}} onClick={() => setMostrarQuantidadeTroca(false)}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    )}
                </Overlay>
            </div>
        )
    }


    function mudarStatus(status, pedido){
        PedidoService.updatePedidoStatus(status,pedido.id).then(res => {
            //navegation(0)
            setCliente(cliente.pedidos.map( pedidoTemp => pedido.id === pedidoTemp.id? res.data : pedidoTemp))

        }).catch(erro => {
            alert(JSON.stringify(erro.response.data))
        })
    }

    function mudarStatusItem(status, item){
        ItemService.updateItemStatus(status,item.id).then(res => {
            navegation(0)
        }).catch(erro => {
            alert(JSON.stringify(erro.response.data))
        })
    }

    function quantidadeDevolvida(pedido,item){
        if(pedido.ultimoStatus.status === "Em Troca Parcial"){
            return(
                <div>
                    <label>Quantidade a Trocar: {item.quantidadeTrocar}</label>
                </div>
            )
        }
        else if(pedido.ultimoStatus.status === "Troca Parcial Aprovada"){
            return(
                <div>
                    <label>Quantidade Trocada: {item.quantidadeTrocar}</label>
                </div>
            )
        }
        else if(pedido.ultimoStatus.status === "Trocado Parcialmente"){
            return(
                <div>
                    <label>Quantidade Trocada: {item.quantidadeTrocada}</label>
                </div>
            )
        }
    }

    useEffect(() => {
        if(!cliente.id){
            ClienteService.getClienteById( localStorage.getItem( "id" ) ).then( res => {
                setCliente(res.data)
            })
        }
    }, [])

    return(
        <div>
            <h3>Meus Pedidos</h3>
            {quantidadeTrocaOverlay()}
            {cliente.pedidos.map( pedido => 
                <div key={pedido.id} className="card border-dark" style={{ marginTop:10}}>
                    <div key="id" className="card-header border-dark bg-dark text-white">
                        <div className="row">
                            <div className="col">
                                Status: {getUltimoStatus(pedido.status).status}
                            </div>
                            <div className="col">
                                data: {dataToStringDataHoraMask(getUltimoStatus(pedido.status).data)}
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        Itens:
                        {pedido.itens.map( item =>
                            <div key={item.id} className="card border-dark">
                                <div className="card-body">
                                    <div className='row no-gutters'>
                                        <div className='col-sm-2'  style={{textAlign:'center', width: 90, height:90}}>
                                            <img src={'/imagens/produtos/' + item.imagemProduto} alt={item.imgemProduto}  className="img-fluid" style={{maxHeight:"100%"}}></img>
                                        </div>
                                        <div className='col-sm-8'>
                                            <div className="row g-3 align-items-center">
                                                <label style={{ height:60}}>Nome: {item.nomeProduto}</label>
                                            </div>
                                            <div className="row g-3 align-items-center">
                                                <div className='col-sm-4' >
                                                    <label>Quantidade: { item.quantidade } </label>
                                                </div>
                                                <div className='col-sm-4' >
                                                    <p align="center" style={{ marginBottom:0}}>Preço: {moedaRealMask(item.preco)}</p>
                                                </div>
                                                {quantidadeDevolvida(pedido,item)}
                                            </div>
                                            <MostrarBotataoDevolverItem item={item} status={getUltimoStatus(item.status).status}/> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="row">
                            <div className="col-sm-8">
                                Total: {moedaRealMask(calculoSubtotal(pedido)+pedido.frete)} ( {moedaRealMask( calculoSubtotal(pedido))} + {moedaRealMask(pedido.frete)} de Frete)
                            </div>
                            
                        </div>
                        <div className="row">
                            <div className="col">
                                <button className="btn btn-dark" onClick={() => navegation("/areaCliente/detalhePedido/" + pedido.id)}>Detalhes</button>
                            </div>
                            <div className="col">
                                <MostrarBotaoDevolverPedido pedido={pedido} status={getUltimoStatus(pedido.status).status}/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default AreaClientePedidosComponent