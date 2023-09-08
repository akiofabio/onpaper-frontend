import React, { useEffect , useState } from 'react';
import { moedaRealMask , stringDataMask , cepMask , cpfMask} from "../etc/Mask";
import { getUltimoStatus } from '../etc/Funcoes';
import AreaGerenteMenu from "./AreaGerenteMenu";
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import PesquisarComponent from './PesquisarComponet';
import ClienteService from '../services/ClienteService';
import PedidoService from '../services/PedidoService'
function AreaGerentePedidodComponent(){
    const [pedidos, setPedidos] = useState([])
    const [pesquisas , setPesquisas] = useState([{
        conteudo:"",
        parametro:"nome"
    }]);
    const [ mostrarDetalhes , setMostrarDetalhes ] = useState([])
    const navegation = useNavigate()
    
    function pesquisar(){
        PedidoService.getPedidoByParametros(pesquisas).then(res => {
            setPedidos(res.data)
            var mosDel = []
            for( var i=0 ; i<res.data.length ; i++){
                mosDel.push(false)
            }
            setMostrarDetalhes(mosDel)
        }).catch(error => {
            alert(JSON.stringify(error.response.data))
        })
    }
    
    function setParametro(event , pesquisa){
        setPesquisas(pesquisas.map(pes => pesquisas.indexOf(pes) == pesquisas.indexOf(pesquisa)? {...pes, parametro : event.target.value} : pes))
    }
    
    function calculoSubtotal(pedido){
        var subtotalSoma =0
        
        pedido.itens.forEach(item => {
            subtotalSoma +=  item.quantidade * item.preco
        })
        return subtotalSoma;
    }

    function mostrarDetalhesDisplay(pedido){    
        var clienteTeste ={
            nome:"Teste1",
            cpf:1111111
        }    
        if( !mostrarDetalhes[pedidos.indexOf(pedido)]){
            return(
                <div className="card border-dark" style={{ marginTop:10 , paddingTop:5 , paddingLeft:10}}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <label>Status: {getUltimoStatus(pedido.status).status}</label>
                            </div>
                            <div className="col">
                                <label>Data: {getUltimoStatus(pedido.status).data}</label>
                            </div>
                        </div>
                        <div className="row">
                            <label>Nome: {clienteTeste.nome}</label>
                        </div>
                        <div className="row">
                            <label>CPF: {cpfMask(clienteTeste.cpf)}</label>
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
                        </div>
                    </div>
                    <div className='row' style={{ margin:10 , paddingTop:5 , paddingLeft:10}}>
                        <div className='col-sm-2'>
                            <button className='btn btn-dark' onClick={() => setMostrarDetalhes(mostrarDetalhes.map(mosDel => mostrarDetalhes.indexOf(mosDel) == pedidos.indexOf(pedido)? true: mosDel))}>Mostrar Detalhes</button>
                        </div>
                        <div className='col-sm-4'>
                            <button className='btn btn-dark' >Editar</button>
                        </div>
                        <div className='col-sm-4'>
                            {mostrarAcao(getUltimoStatus(pedido.status),pedido)}
                        </div>
                        
                    </div>
                </div>
            )
        }
        else{
            return(
                <div className='card border-dark' style={{ padding:10}}>
                    <div className="card border-dark" style={{ marginTop:10 , paddingTop:5 , paddingLeft:10}}>
                        <div className="card-body">
                        </div>
                    </div>
                    <div className='row' style={{ margin:10 , paddingTop:5 , paddingLeft:10}}>
                        <div className='col-auto'>
                            <button className='btn btn-dark' onClick={() => setMostrarDetalhes(mostrarDetalhes.map(mosDel => mostrarDetalhes.indexOf(mosDel) == pedidos.indexOf(pedido)? false: mosDel))}>Esconder Detalhes</button>
                        </div>
                        <div className='col-auto'>
                            <button className='btn btn-dark' >Editar</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    function mostrarAcao(status,pedido){
        if(status.status == "Em Processamento"){
            return(
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-success' onClick={()=>{mudarStatus("Aprovado", pedido)}}>Aprovar Transação</button>
                    </div>
                    <div className='col'>
                        <button className='btn btn-danger' onClick={()=>{mudarStatus("Recusado", pedido)}}>Recusar Transação</button>
                    </div>
                </div>
            )
        }
        else if(status.status == "Aprovado"){
            return(
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-success' onClick={()=>{mudarStatus("Em Preparo", pedido)}}>Separar Pedido</button>
                    </div>
                    <div className='col'>
                        <button className='btn btn-danger' onClick={()=>{mudarStatus("Cancelado", pedido)}}>Cancelar Pedido</button>
                    </div>
                </div>
            )
        }
        else if(status.status == "Em Preparo"){
            return(
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-success' onClick={()=>{mudarStatus("Enviado", pedido)}}>Pedido Enviado</button>
                    </div>
                    <div className='col'>
                        <button className='btn btn-danger' onClick={()=>{mudarStatus("Cancelado", pedido)}}>Cancelar Pedido</button>
                    </div>
                </div>
            )
        }
        else if(status.status == "Enviado"){
            return(
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-success' onClick={()=>{mudarStatus("Entregue", pedido)}}>Confimar Entrega do Pedido</button>
                    </div>
                    <div className='col'>
                        <button className='btn btn-danger' onClick={()=>{mudarStatus("Cancelado", pedido)}}>Cancelar Pedido</button>
                    </div>
                </div>
            )
        }
        else if(status.status == "Em Troca"){
            return(
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-success' onClick={()=>{mudarStatus("Troca Aprovada", pedido)}}>Aceitar Troca</button>
                    </div>
                    <div className='col'>
                        <button className='btn btn-danger' onClick={()=>{mudarStatus("Troca Recusada", pedido)}}>Recusar Troca</button>
                    </div>
                </div>
            )
        }
        else if(status.status == "Troca Aprovada"){
            return(
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-success' onClick={()=>{mudarStatus("Trocado", pedido)}}>Troca Recebida</button>
                    </div>
                    <div className='col'>
                        <button className='btn btn-danger' onClick={()=>{mudarStatus("Troca Cancelada", pedido)}}>Cancelar Troca</button>
                    </div>
                </div>
            )
        }
        else if(status.status == "Em Cancelamento"){
            return(
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-danger' onClick={()=>{mudarStatus("Cancelada", pedido)}}>Cancelar Troca</button>
                    </div>
                </div>
            )
        }
    }

    function mudarStatus(status,pedido){
        PedidoService.updatePedidoStatus(status,pedido.id).then(res => {
            navegation(0)
            
            /*
            setPedidos(pedidos.map( pedidoTemp =>{
                if(pedidos.indexOf(pedidoTemp) === pedidos.indexOf(pedido))
                    pedidoTemp = res.data
            }))
            */ 
        }).catch(erro => {
            alert(JSON.stringify(erro.response.data))
        })
    }

    function addPesquisa(){
        var pes ={
            conteudo:"",
            parametro:"nome"
        }
        setPesquisas([...pesquisas, pes])
    }

    function removerPesquisa(){
        if(pesquisas.length>1)
            setPesquisas(pesquisas.filter( pes => pesquisas.indexOf(pes) !== (pesquisas.length -1) ))
        
    }

    function pressEnter( event ){
        if(event.key === 'Enter'){
            pesquisar()
        }
    }

    function getPendentes(){
        if(pedidos.length==0){
            PedidoService.getPedidoByPendente().then(res => {
                setPedidos(res.data)
            }).catch( erro => {
                alert(JSON.stringify(erro.response.data))
            })
        }
    }


    useEffect(() => {
        if(pedidos.length==0){
            PedidoService.getPedidos().then(res => {
                setPedidos(res.data)
            }).catch( erro => {
                alert(JSON.stringify(erro.response.data))
            })
            
            /*
            PedidoService.getPedidoByPendente().then(res => {
                setPedidos(res.data)
            }).catch( erro => {
                alert(JSON.stringify(erro.response.data))
            })
            */
        }
    });

    return(
        <div>
            <h3>Pedidos</h3>
            <div style={{margin:10}}>
                {pesquisas.map( pesquisa => 
                    <div className='row'>
                        <div className='col'>
                            <input className="form-control me-2" type="search" placeholder="Qual pedido que você procura?" aria-label="Search" value={pesquisa.conteudo} onKeyDown={(event)=> pressEnter(event)} onChange={(event)=>setPesquisas(pesquisas.map(pes => pesquisas.indexOf(pes)===pesquisas.indexOf(pesquisa)? {...pes, conteudo: event.target.value}:pes))}></input>
                        </div>
                        <div className='col-auto'>
                            <select className='form-select'  onChange={(event)=>setParametro(event , pesquisa)} style={{}}>
                                <option value={"nome"}>Nome do Cliente</option>
                                <option value={"cpf"}>CPF do Cliente</option>
                                <option value={"id"}>ID do Pedido</option>
                                <option value={"nome "}>Nome do Produto</option>
                                <option value={"status"}>Status do Pedido</option>
                            </select>
                        </div>
                    </div>
                )}
                <div className='row' style={{ margin:15}}>
                    <div className='col-auto'>
                        <button className="btn btn-dark" type="submit" onClick={()=> pesquisar()}>Pesquisar</button>
                    </div>
                    <div className='col-auto'>
                        <button className="btn btn-outline-dark" onClick={()=> addPesquisa()}>+ Adicionar Pesquisa</button>
                    </div>
                    <div className='col-auto'>
                        <button className="btn btn-outline-dark" type="button" onClick={()=> removerPesquisa()}>- Remover Pesquisa</button>
                    </div>
                    <div className='col-auto'>
                        <button className="btn btn-success" type="button" onClick={()=> navegation(0)}>Pedidos Pendentes</button>
                    </div>
                </div>
            </div>
            {pedidos.length == 0? <h3>Pedido nao encontrado</h3> : <h3>Resultado:</h3>}
            {pedidos.map(pedido =>
                <div >
                    {mostrarDetalhesDisplay(pedido)}
                </div>
            )}
        </div>
    )
}
export default AreaGerentePedidodComponent