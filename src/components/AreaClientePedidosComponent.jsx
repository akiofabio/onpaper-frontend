import React, { useEffect, useState } from "react";
import { moedaRealMask , stringDataMask } from "../etc/Mask";
function AreaClientePedidosComponent (props){
    function getUltimoStatus(status){
        var ultimoStatus={
            data: new Date(0)
        }
        for (const st of status){
            if(!st.data || st.data==null){
                return st
            }
            else {
                ultimoStatus=st
            }
        };
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
    return(
        <div>
            <h3>Meus Pedidos</h3>
            {props.pedidos.map( pedido => 
                <div key={pedido.id} className="card border-dark" style={{ marginTop:10}}>
                    <div key="id" className="card-header border-dark bg-dark text-white">
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
                        Itens:
                        {pedido.itens.map( item =>
                            <div key={item.id} className="card border-dark">
                                <div key={item.id} className="card-body">
                                    <div className='row no-gutters'>
                                        <div className='col-sm-2'>
                                            <img src={'/imagens/produtos/' + item.imagemProduto} alt={item.imgemProduto} width='80' height="auto"></img>
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
                                            <p align="center">R$ {item.preco.toFixed(2)}</p>
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
            )}
        </div>
    )
}
export default AreaClientePedidosComponent