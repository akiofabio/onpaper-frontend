import React, { useEffect , useState } from 'react';
import { moedaRealMask , stringDataMask , cepMask , cpfMask, dataToInputMesEAnoDataMask} from "../etc/Mask";
import AreaGerenteMenu from "./AreaGerenteMenu";
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import PesquisarComponent from './PesquisarComponet';
import ClienteService from '../services/ClienteService';


function AreaGerenteClientesComponent(){
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

    function editar(cliente){
        navegation("/areaGerente/editarCliente/"+cliente.id)
    }

    function deletar(cliente){
        ClienteService.delete(cliente.id).then( res => {
            alert("Cliente Deletado com sucesso")
            setClientes(clientes.filter( cli => cli.id !== cliente.id? cli: null))
        }).catch(erro => {
            alert(JSON.stringify(erro.response.data))
        })
    }

    function mostrarDetalhesbutton(cliente){
        var temp=[]
        for(var i=0; i<mostrarDetalhes.length;i++){
            if(i===clientes.indexOf(cliente)){
                temp.push(true)
            }
            else{
                temp.push(mostrarDetalhes[i])
            }

        }
        alert(temp)
        setMostrarDetalhes(temp)
    }

    function esconderDetalhesbutton(cliente){
        var temp=[]
        for(var i=0; i<mostrarDetalhes.length;i++){
            if(i===clientes.indexOf(cliente)){
                temp.push(false)
            }
            else{
                temp.push(mostrarDetalhes[i])
            }

        }
        alert(temp)
        setMostrarDetalhes(temp)
    }

    function mostrarDetalhesDisplay(cliente){
        //alert(JSON.stringify(mostrarDetalhes))
        //alert("cli"+ clientes.indexOf(cliente)+ " = "+ mostrarDetalhes[clientes.indexOf(cliente)])        
        if( mostrarDetalhes[clientes.indexOf(cliente)]===false){
            //alert("Sem detalhes")
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
                            <button name={"mostrar_detalhes_button" + (clientes.indexOf(cliente)+1)} className='btn btn-dark' onClick={() => mostrarDetalhesbutton(cliente)}>Mostrar Detalhes</button>
                        </div>
                        <div className='col-auto'>
                            <button name={"editar_button" + (clientes.indexOf(cliente)+1)} className='btn btn-dark' onClick={() => editar(cliente)}>Editar</button>
                        </div>
                        <div className='col-auto'>
                            <button name={"deletar_button" + (clientes.indexOf(cliente)+1)} className='btn btn-dark' onClick={() => deletar(cliente)}>Deletar</button>
                        </div>
                    </div>
                </div>
            )
        }
        else{
            //alert("Com detelhes")
            return(
                <div>
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
                                                <label>Bandeira: {cartao.bandeira.nome} </label>
                                            </div>
                                            <div className="row">
                                                <label>Nome: {cartao.nome} </label>
                                            </div>
                                            <div className="row">
                                                <label>Numero: {cartao.numero} </label>
                                            </div>
                                            <div className="row">
                                                <label>Data de Vencimento: {dataToInputMesEAnoDataMask(cartao.validade)} </label>
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
                            
                            <h4>Cupons</h4>
                            {cliente.cupons.map( cupom =>
                                <div>
                                    <div className="card border-dark" style={{ marginTop:10 , marginBottom:10}}>
                                        <div className="card-header">
                                            <label>Cupom {cupom.id}</label>
                                        </div>
                                        <div className='card-body'>
                                            <div className="row">
                                                <label>Tipo: {cupom.tipo} </label>
                                            </div>
                                            <div className="row">
                                                <label>Descrição: {cupom.nome} </label>
                                            </div>
                                            <div className="row">
                                                <label>Numero: {moedaRealMask(cupom.valor)} </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className='row' style={{ margin:10 , paddingTop:5 , paddingLeft:10}}>
                            <div className='col-auto'>
                                <button name={"esconder_detalhes_button" + (clientes.indexOf(cliente)+1)} className='btn btn-dark' onClick={() => esconderDetalhesbutton(cliente)}>Esconder Detalhes</button>
                            </div>
                            <div className='col-auto'>
                                <button name={"editar_button" + (clientes.indexOf(cliente)+1)} className='btn btn-dark' onClick={() => editar(cliente)}>Editar</button>
                            </div>
                            <div className='col-auto'>
                                <button name={"deletar_button" + (clientes.indexOf(cliente)+1)} className='btn btn-dark' onClick={() => deletar(cliente)}>Deletar</button>
                            </div>
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
            <h3>Clientes</h3>
            <div style={{margin:10}}>
                {pesquisas.map( pesquisa => 
                    <div className='row'>
                        <div className='col'>
                            <input name={"pesquisa_input" + (pesquisas.indexOf(pesquisa)+1)} className="form-control me-2" type="search" placeholder="Quem que você procura?" aria-label="Search" value={pesquisa.conteudo} onKeyDown={(event)=> pressEnter(event)} onChange={(event)=>setPesquisas(pesquisas.map(pes => pesquisas.indexOf(pes)===pesquisas.indexOf(pesquisa)? {...pes, conteudo: event.target.value}:pes))}></input>
                        </div>
                        <div className='col-auto'>
                            <select name={"parametro_select" + (pesquisas.indexOf(pesquisa)+1)} className='form-select'  onChange={(event)=>setParametro(event , pesquisa)} style={{}}>
                                <option value={"nome"}>Nome</option>
                                <option value={"cpf"}>CPF</option>
                                <option value={"dataNascimento"}>Data de Nascimento</option>
                            </select>
                        </div>
                    </div>
                )}
                <div className='row' style={{ margin:15}}>
                    <div className='col-auto'>
                        <button name="pesquisar_button" className="btn btn-dark" type="submit" onClick={()=> pesquisar()}>Pesquisar</button>
                    </div>
                    <div className='col-auto'>
                        <button className="btn btn-outline-dark" onClick={()=> addPesquisa()}>+ Adicionar Pesquisa</button>
                    </div>
                    <div className='col-auto'>
                        <button className="btn btn-outline-dark" type="button" onClick={()=> removerPesquisa()}>- Remover Pesquisa</button>
                    </div>
                    <div className='col-auto'>
                        <button className="btn btn-success" type="button" onClick={()=> navegation("/areaGerente/cadastrarCliente/")}>Cadastrar Novo Cliente</button>
                    </div>
                </div>
                
            </div>
            {clientes.length == 0? <h3>Cliente nao encontrado</h3> : <h3>Resultado:</h3>}
            {clientes.map(cliente =>
                <div >
                    {mostrarDetalhesDisplay(cliente)}
                </div>
            )}
        </div>
    )
}
export default AreaGerenteClientesComponent