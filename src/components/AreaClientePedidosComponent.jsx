import React, { useEffect, useState } from "react";
import { moedaRealMask , stringDataMask } from "../etc/Mask";
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';

import ClienteService from "../services/ClienteService";
import PedidoService from "../services/PedidoService"
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
            return(
                <div>
                    <button className="btn" onClick={() => trocarItem(props.item)} disabled>Trocar</button>
                    <button className="btn" onClick={() => devolverItem(props.item)} disabled>Devolver</button>
                </div>
            )
        }
    }
    
    function MostrarBotaoDevolverPedido(props){
        if( props.status=="Entregue"){
            return(
                <div>
                    <button className="btn btn-dark" onClick={() => trocarPedido(props.pedido)}>Trocar Pedido</button>
                    <button className="btn btn-dark" onClick={() => trocarPedido(props.pedido)}>Devolver Pedido</button>
                </div>
            )
        }
        else if(props.status=="Em Processamento" || props.status=="Aprovado" || props.status=="Em Preparo" ){
            return(
                <div>
                    <button className="btn btn-dark" onClick={() => cancelarPedido(props.pedido)}>Cancelar Pedido</button>
                </div>
            )
        }
        else if(props.status=="Em Processamento" || props.status=="Aprovado"){
            return(
                <div>
                    <button className="btn btn-dark" onClick={() => cancelarPedido(props.pedido)}>Cancelar Pedido</button>
                </div>
            )
        }
        else{
            return(
                <div>
                    <button className="btn btn-dark" disabled>Trocar Pedido</button>
                    <button className="btn btn-dark" disabled>Devolver Pedido</button>
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
        if(!cliente.id){
            ClienteService.getClienteById( localStorage.getItem( "id" ) ).then( res => {
                setCliente(res.data)
            })
        }
    }, [])

    return(
        <div>
            <h3>Meus Pedidos</h3>
            {cliente.pedidos.map( pedido => 
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
                                        <div className='col-sm-2'  style={{textAlign:'center', width: 90, height:90}}>
                                            <img src={'/imagens/produtos/' + item.imagemProduto} alt={item.imgemProduto}  className="img-fluid" style={{maxHeight:"100%"}}></img>
                                        </div>
                                        <div className='col-sm-8'>
                                            <div className="row">
                                                
                                            </div>
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
                                            </div>
                                            <MostrarBotataoDevolverItem pedido={pedido} status={getUltimoStatus(pedido.status).status}/> 
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