import React, { useEffect , useState } from 'react';
import { moedaRealMask , stringDataMask , cepMask , cpfMask, dataToStringDataHoraMask} from "../etc/Mask";
import { getUltimoStatus,separarParagrafo,separarParagrafoSemMargem } from '../etc/Funcoes';
import AreaGerenteMenu from "./AreaGerenteMenu";
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import PesquisarComponent from './PesquisarComponet';
import ClienteService from '../services/ClienteService';
import ItemService from '../services/ItemService';
import PedidoService from '../services/PedidoService'
import ProdutoService from '../services/ProdutoService';
import Overlay from 'react-bootstrap/Overlay';

function AreaGerentePedidodComponent(){
    const [clientes, setClientes] = useState([])
    const [pedidos, setPedidos] = useState([])
    const [pesquisas , setPesquisas] = useState([{
        conteudo:"",
        parametro:"nome"
    }]);
    const [pedidoTemp, setPedidoTemp] = useState();
    const [ mostrarDetalhes , setMostrarDetalhes ] = useState([])
    const [mostrarQuantidadeTroca, setMostrarQuantidadeTroca] = useState(false);
    const navegation = useNavigate()
    
    function MostrarBotataoDevolverItem(props){
        /*
        if(props.status == "Em Troca"){
            return(
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-success' onClick={()=>{mudarStatusItem("Troca Aprovada", props.item)}}>Aceitar Troca</button>
                    </div>
                    <div className='col'>
                        <button className='btn btn-danger' onClick={()=>{mudarStatusItem("Troca Recusada", props.item)}}>Recusar Troca</button>
                    </div>
                </div>
            )
        }
        else if(props.status == "Troca Aprovada"){
            return(
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-success' onClick={()=>{mudarStatusItem("Trocado", props.item)}}>Troca Recebida</button>
                    </div>
                    <div className='col'>
                        <button className='btn btn-danger' onClick={()=>{mudarStatusItem("Troca Cancelada", props.item)}}>Cancelar Troca</button>
                    </div>
                </div>
            )
        }
        */
    }

    async function pesquisar(){
        var pedidosTemp = []
        var mosDel = []
        var clientesTemp = []
        await PedidoService.getPedidoByParametros(pesquisas).then(res => {
            pedidosTemp = res.data
            //alert(JSON.stringify(pedidosTemp))
            setPedidos(pedidosTemp)
        }).catch(error => {
            alert(JSON.stringify(error.response.data))
        })
        pedidosTemp.forEach(pedido => {
            mosDel.push(false)
            ClienteService.getClienteByPedidoId(pedidosTemp[pedidosTemp.indexOf(pedido)].id).then(res2 => {
                clientesTemp.push(res2.data)
                setClientes(clientesTemp)
            }).catch( erro => {
                alert(JSON.stringify(erro.response.data))
            })
        })
        setMostrarDetalhes(mosDel)
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
            nome:"",
            cpf:0
        }
        if(clientes.length === pedidos.length){
            clienteTeste = clientes[pedidos.indexOf(pedido)]
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
                                <label>Data: {dataToStringDataHoraMask(getUltimoStatus(pedido.status).data)}</label>
                            </div>
                        </div>
                        <div className="row">
                            <label>Nome: {clienteTeste.nome}</label>
                        </div>
                        <div className="row">
                            <label>CPF: {cpfMask(clienteTeste.cpf)}</label>
                        </div>
                        <div className="row">
                            <label>Endereço de Entrega:</label>
                                <div className="card">
                                    {separarParagrafoSemMargem(pedido.endereco)}
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
                            <button className='btn btn-dark' onClick={() => setMostrarDetalhes(mostrarDetalhes.map(mosDel => mostrarDetalhes.indexOf(mosDel) === pedidos.indexOf(pedido)? false: mosDel))}>Esconder Detalhes</button>
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
        else if(status.status == "Em Troca Parcial"){
            return(
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-success' onClick={()=>{mudarStatus("Troca Parcial Aprovada", pedido)}}>Aceitar Troca Parcial</button>
                    </div>
                    <div className='col'>
                        <button className='btn btn-danger' onClick={()=>{mudarStatus("Troca Parcial Recusada", pedido)}}>Recusar Troca Parcial</button>
                    </div>
                </div>
            )
        }
        else if(status.status == "Troca Parcial Aprovada"){
            return(
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-success' onClick={()=>{mudarStatus("Trocado Parcialmente", pedido)}}>Troca Recebida</button>
                    </div>
                    <div className='col'>
                        <button className='btn btn-danger' onClick={()=>{mudarStatus("Troca Parcial Cancelada", pedido)}}>Cancelar Troca</button>
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
        else if(status.status == "Trocado Parcialmente"){
            var baixa = true;
            pedido.itens.forEach(item => {
                if(item.quantidadeTrocar>0){
                    baixa = false;
                }
            })
            if(!baixa){
                return(
                    <div className='row'>
                        <div className='col'>
                            <button className='btn btn-dark' onClick={()=>{quantidadeTrocaButton(pedido)}}>Adicionar Alguns Itens Trocados ao Estoque</button>
                        </div>
                    </div>
                )
            }
        }
    }
    
    function mudarStatus(status,pedido){
        PedidoService.updatePedidoStatus(status,pedido.id).then(res => {
            setPedidos(pedidos.map( pedidoTemp => pedido.id === pedidoTemp.id? res.data : pedidoTemp
            )) 
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
                    <label>Quantidade a Trocar: {item.quantidadeTrocar}</label>
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

    function mudarStatusItem(status, item){
        ItemService.updateItemStatus(status,item.id).then(res => {
            navegation(0)
        }).catch(erro => {
            alert(JSON.stringify(erro.response.data))
        })
    }
    
    function addPesquisa(){
        var pes ={
            conteudo:"",
            parametro:"nomeCliente"
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
        PedidoService.getPedidoByPendente().then(res => {
            setPedidos(res.data)
        }).catch( erro => {
            alert(JSON.stringify(erro.response.data))
        })
    }

    function quantideHandler (event , item)  {
        setPedidoTemp({...pedidoTemp, itens : pedidoTemp.itens.map(itemTemp => 
            pedidoTemp.itens.indexOf(itemTemp) === pedidoTemp.itens.indexOf(item) ? { ...item, quantidadeTrocar: event.target.value} : itemTemp
        )})
    }

    function quantidadeTrocaButton(pedido){
        setPedidoTemp(pedido)
        setMostrarQuantidadeTroca(true)
    }

    function confimarQuantidadeTroca(){
        var pedido = pedidoTemp
        pedido.itens.forEach( item => {
            ItemService.updateQuantidade(item.idProduto, item.quantidadeTrocar ).then( res => {
                
            }).catch( erro => {
                alert(JSON.stringify(erro))
            })
            item.quantidadeTrocar = 0
        })
        setPedidos(pedidos.map(pedidoTempMap => pedido.id === pedidoTempMap.id ? pedido : pedidoTempMap))
        setMostrarQuantidadeTroca(false)
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
                                    <h3 className='text-center'>Adicionar ao Estoque a Troca do Pedido</h3>
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
                                                                    <label>Quantidade Trocada: { item.quantidadeTrocada } </label>
                                                                </div>
                                                                <div className='col' >
                                                                    <p align="center" style={{ marginBottom:0}}>Preço Unitário: {moedaRealMask(item.preco)}</p>
                                                                </div>
                                                                <div className='col' >
                                                                    <label>Quantidade a Voltar ao Estoque:</label>
                                                                    <input name={'quantidade_input'+ pedidoTemp.itens.indexOf(item)} className='form-control' value={ item.quantidadeTrocar } style={{width:80}} onChange={ ( event ) => quantideHandler( event, item ) } type={"number"} min="0" max={item.quantidadeTrocada}></input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                

                                <div className='row justify-content-md-center'>
                                    <div className='col-auto'>
                                        <button name='confimar_button' className='btn btn-dark'  style={{marginBottom: 5} } onClick={() => confimarQuantidadeTroca()}>Confirmar</button>
                                    </div>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' name='cancelar_button' style={{marginBottom: 5}} onClick={() => setMostrarQuantidadeTroca(false)}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    )}
                </Overlay>
            </div>
        )
    }

    useEffect(() => {
        if(pedidos.length==0){
            PedidoService.getPedidos().then(res => {
                setPedidos(res.data)
            }).catch( erro => {
                alert(JSON.stringify(erro.response.data))
            })
        }
    },[]);

    
    return(
        <div>
            <h3>Pedidos</h3>
            <div style={{margin:10}}>
                {quantidadeTrocaOverlay()}
                {pesquisas.map( pesquisa => 
                    <div className='row'>
                        <div className='col'>
                            <input className="form-control me-2" type="search" placeholder="Qual pedido que você procura?" aria-label="Search" value={pesquisa.conteudo} onKeyDown={(event)=> pressEnter(event)} onChange={(event)=>setPesquisas(pesquisas.map(pes => pesquisas.indexOf(pes)===pesquisas.indexOf(pesquisa)? {...pes, conteudo: event.target.value}:pes))}></input>
                        </div>
                        <div className='col-auto'>
                            <select className='form-select'  onChange={(event)=>setParametro(event , pesquisa)} style={{}}>
                                <option value={"nomeCliente"}>Nome do Cliente</option>
                                <option value={"cpf"}>CPF do Cliente</option>
                                <option value={"id"}>ID do Pedido</option>
                                <option value={"nomeProduto"}>Nome do Produto</option>
                                <option value={"status"}>Status do Pedido</option>
                                <option value={"dataStatus"}>Data do Ultimo Status do Pedido</option>
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
                        <button className="btn btn-success" type="button" onClick={()=> getPendentes()}>Pedidos Pendentes</button>
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