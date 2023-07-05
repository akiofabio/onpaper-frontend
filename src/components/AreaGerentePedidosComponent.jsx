import React, { useEffect , useState } from 'react';
import { moedaRealMask , stringDataMask , cepMask , cpfMask} from "../etc/Mask";
import AreaGerenteMenu from "./AreaGerenteMenu";
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import PesquisarComponent from './PesquisarComponet';
import ClienteService from '../services/ClienteService';

function AreaGerentePedidodComponent(){
    const [clientes, setClientes] = useState([])
    const [pesquisas , setPesquisas] = useState([{
        conteudo:"",
        parametro:"nome"
    }]);
    const [ mostrarDetalhes , setMostrarDetalhes ] = useState([])
    const navegation = useNavigate()
    function pesquisar(){
        ClienteService.getClientesByParametros(pesquisas).then(res => {
            var clientesTemp = res.data
            setClientes(clientesTemp)
            var mosDel = []
            for( var i=0 ; i<clientesTemp.length ; i++){
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
    
    function mostrarDetalhesDisplay(cliente){        
        if( !mostrarDetalhes[clientes.indexOf(cliente)]){
            return(
                <div className="card border-dark" style={{ marginTop:10 , paddingTop:5 , paddingLeft:10}}>
                    <div className="card-body">
                        <div className="row">
                            <label>Nome: {cliente.nome}</label>
                        </div>
                        <div className="row">
                            <label>CPF: {cpfMask(cliente.cpf)}</label>
                        </div>
                    </div>
                    <div className='row' style={{ margin:10 , paddingTop:5 , paddingLeft:10}}>
                        <div className='col-auto'>
                            <button className='btn btn-dark' onClick={() => setMostrarDetalhes(mostrarDetalhes.map(mosDel => mostrarDetalhes.indexOf(mosDel) == clientes.indexOf(cliente)? true: mosDel))}>Mostrar Detalhes</button>
                        </div>
                        <div className='col-auto'>
                            <button className='btn btn-dark' >Editar</button>
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
                            <div className="row">
                                <label>Nome: {cliente.nome}</label>
                            </div>
                            <div className="row">
                                <label>CPF: {cpfMask(cliente.cpf)}</label>
                            </div>
                            <div className="row">
                                <label>Genero: {cliente.genero}</label>
                            </div>
                            <div className="row">
                                <label>Data de Nascimento: {stringDataMask(cliente.dataNascimento)}</label>
                            </div>
                            <h4>Contatos</h4>
                            <div className="row">
                                <label>Email: {cliente.email}</label>
                            </div>
                            {cliente.telefones.map( telefone => 
                                <div className="row">
                                    <div className='col-8'>
                                        <label>Telefone {cliente.telefones.indexOf(telefone) +1}: {telefone.tipo} ({telefone.ddd}) {telefone.numero}</label>
                                    </div>
                                </div>
                            )}
                            <h4>Endereco</h4>
                            {cliente.enderecos.map( endereco =>
                                <div>
                                    <div className="card border-dark" style={{ marginTop:10 , marginBottom:10}}>
                                        <div className="card-header">
                                            <label>Endereco {cliente.enderecos.indexOf(endereco) +1}</label>
                                        </div>
                                        <div className='card-body'>
                                            <div className="row">
                                                <label>nome: {endereco.nome} </label>
                                            </div>
                                            <div className="row">
                                                <label>CEP: {cepMask(endereco.cep)} </label>
                                            </div>
                                            <div className="row">
                                                <label>{endereco.tipoLogradouro} {endereco.logradouro}, nº {endereco.numero}, {endereco.bairro}, {endereco.cidade} - {endereco.estado}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <h4>Cartao de Credito</h4>
                            {cliente.cartoes.map( cartao =>
                                <div>
                                    <div className="card border-dark" style={{ marginTop:10 , marginBottom:10}}>
                                        <div className="card-header">
                                            <label>Cartao {cliente.cartoes.indexOf(cartao) +1}</label>
                                        </div>
                                        <div className='card-body'>
                                            <div className="row">
                                                <label>Bandeira: {cartao.bandeira} </label>
                                            </div>
                                            <div className="row">
                                                <label>Nome: {cartao.nome} </label>
                                            </div>
                                            <div className="row">
                                                <label>Numero: {cartao.numero} </label>
                                            </div>
                                            <div className="row">
                                                <label>Data de Vencimento: {cartao.vencimento} </label>
                                            </div>
                                            <div className="row">
                                                <label>Codigo de Seguranca: {cartao.codigoSeguranca} </label>
                                            </div>
                                            <div className='form'>
                                                <input type={"checkbox"} name='tipo' checked={cartao.preferencial} disabled></input>Preferencial
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='row' style={{ margin:10 , paddingTop:5 , paddingLeft:10}}>
                        <div className='col-auto'>
                            <button className='btn btn-dark' onClick={() => setMostrarDetalhes(mostrarDetalhes.map(mosDel => mostrarDetalhes.indexOf(mosDel) == clientes.indexOf(cliente)? false: mosDel))}>Esconder Detalhes</button>
                        </div>
                        <div className='col-auto'>
                            <button className='btn btn-dark' >Editar</button>
                        </div>
                    </div>
                </div>
            )
        }
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
                                <option value={"nome"}>Nome</option>
                                <option value={"cpf"}>CPF</option>
                                <option value={"dataNascimento"}>Data de Nascimento</option>
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
            {clientes.length == 0? <h3>Pedido nao encontrado</h3> : <h3>Resultado:</h3>}
            {clientes.map(cliente =>
                <div >
                    {mostrarDetalhesDisplay(cliente)}
                </div>
            )}
        </div>
    )
}
export default AreaGerentePedidodComponent