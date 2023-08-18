import React, { useEffect, useState } from "react";
import { moedaRealMask , stringDataMask } from "../etc/Mask";
import ClienteService from "../services/ClienteService";
import PedidoService from "../services/PedidoService";
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';

function DetalhesPedidosComponent (props){
    const [pedido, setPedido] = useState({
        status: [{
            data:"",
            status:""
        }],
        itens: [],
        idEndereco:"",
        endereco:"",
        cep:"",
        frete:""
    })
    const { id } = useParams()

    function getUltimoStatus(status){
        var ultimoStatus={
            data: new Date(0).getDate,
            status: "Status nao Encontrado"
        }
        if(status!==undefined && status.length>0){
            ultimoStatus = status[status.length - 1]
        }
        return ultimoStatus
    }

    function calculoSubtotal(pedido){
        var subtotalSoma =0
        
        pedido.itens.forEach(item => {
            subtotalSoma +=  item.quantidade * item.preco
        })
        return subtotalSoma;
    }

    function MostrarBotataoDevolverItem(props){
        if( props.status=="Entregue"){
            return(
                <div>
                    <button className="btn" onClick={() => trocarItem(props.item)}>Trocar</button>
                    <button className="btn" onClick={() => devolverItem(props.item)}>Devolver</button>
                </div>
            )
            
        }
        else{

        }
    }
    
    function MostrarBotaoDevolverPedido(props){
        if( props.status=="Entregue"){
            return(
                <div>
                    <button className="btn" onClick={() => trocarPedido(props.pedido)}>Trocar Pedido</button>
                </div>
            )
        }
        else if(props.status=="Em Processamento" || props.status=="Aprovado"){
            return(
                <div>
                    <button className="btn" onClick={() => cancelarPedido(props.pedido)}>Cancelar Pedido</button>
                </div>
            )
        }
        else{
            return(
                <div>
                    <button className="btn" disabled>Trocar Pedido</button>
                </div>
            )
        }
    }


    function trocarItem(){
        alert("nao implementado")
    }

    function devolverItem(){
        alert("nao implementado")
    }

    function trocarPedido(){
        alert("nao implementado")
    }

    function cancelarPedido(){
        alert("nao implementado")
    }

    useEffect(() => {
        if(!pedido.id){
            PedidoService.getPedidoById( id ).then( res => {
                setPedido(res.data)
            })
        }
    }, [])

    return(
        <div> 
            <div className="card border-dark" style={{ marginTop:10}}>
                <div className="card-header border-dark bg-dark text-white">
                    <div className="row">
                        <div className="col">
                            Status: {getUltimoStatus(pedido.status).status}
                        </div>
                        <div className="col">
                            data: {stringDataMask(getUltimoStatus(pedido.status).data)}
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    Status:
                    <div  className="card border-dark">
                        {pedido.status.map( pStatus => 
                            <div key={pStatus.id} className="row">
                                <div className="col">
                                    Status: {pStatus.status}
                                </div>
                                <div className="col">
                                    data: {stringDataMask(pStatus.data)}
                                </div>
                            </div>  
                        )}
                    </div>
                </div>
                <div className="card-body">
                    Endereco de entrega:
                    <div className="card border-dark">
                        <div className="row">
                            <div className="col">
                                {pedido.endereco}
                            </div>
                        </div>  
                    </div>
                </div>
                <div className="card-body">
                    Itens:
                    {pedido.itens.map( item =>
                        <div key={item.id} className="card border-dark">
                            <div key={item.id} className="card-body">
                                <div className='row no-gutters'>
                                    <div className='col-sm-2' style={{textAlign:'center', width: 90, height:90}}>
                                        <img src={'/imagens/produtos/' + item.imagemProduto} alt={item.imgemProduto} className="img-fluid" style={{maxHeight:"100%"}}></img>
                                    </div>
                                    <div className='col-sm-8'>
                                        <p style={{ height:60}}>Nome: {item.nomeProduto}</p>
                                        <div className="row g-3 align-items-center">
                                            <div className="col-auto">
                                                <label>Quantidade:</label>
                                            </div>
                                            <div className="col-auto">
                                                { item.quantidade } 
                                            </div>
                                            <div className="col-auto">
                                                <MostrarBotataoDevolverItem pedido={pedido} status={getUltimoStatus(pedido.status).status}/> 
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-2' >
                                        <p align="center" style={{ marginBottom:0}}>Preço</p>
                                        <p align="center"> {moedaRealMask(item.preco)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="row">
                        <div className="col-sm-8">
                            Total: {moedaRealMask(calculoSubtotal(pedido)+pedido.frete)} ( {moedaRealMask( calculoSubtotal(pedido))} + {moedaRealMask(pedido.frete)} de Frete)
                        </div>
                        <div className="col">
                            <MostrarBotaoDevolverPedido pedido={pedido} status={getUltimoStatus(pedido.status).status}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DetalhesPedidosComponent