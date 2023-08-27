import React, { useEffect , useState , useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import {cepMask, cpfMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString} from '../etc/Funcoes'
import ClienteMenuComponent from './ClienteMenuComponent';
import ClienteService from '../services/ClienteService';
import AreaClienteInicioComponent from './AreaClienteInicioComponent'
import AreaClientePedidosComponent from './AreaClientePedidosComponent'
import BandeiraService from '../services/BandeiraService'
import { Alert } from 'bootstrap';

function CadastrarClienteComponent(){
    const navegate = useNavigate()
    const [cliente, setCliente] = useState({
        score:0,
        tipo:"CLIENTE",
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
            pais:"",
            estado:"",
            cidade:"",
            bairro:"",
            tipoLogradouro:"",
            logradouro:"",
            numero:"",
            tipo:"",
            entrega:true,
            cobranca:true,
            observacao:""
        }],
        cartoes: [{
            nome:"",
            numero:"",
            codigoSeguranca:"",
            validade:"",
            preferencial:true,
            bandeira:{id:""}
        }],
        pedidos: [],
        cupons: [],
        pedidos: [],
        carrinho:{},
    })
    const [senhaConfirmacao, setSenhaConfirmacao] = useState()
    const [bandeiras, setBandeiras] = useState([])
    function confimarSenha(){
        
    }

    function addTelefone(){
        var tel = {
            tipo:"",
            ddd:"",
            numero:""
        }
        var temp = cliente.telefones
        temp.push(tel)
        setCliente({...cliente, telefones : temp})
    }
    function removerTelefone(){
        if(cliente.telefones.length>1){
            var temp = cliente.telefones
            temp.pop()
            setCliente({...cliente, telefones : temp})
        }
    }

    function addEndereco(){
        var end = {
            nome:"",
            cep:"",
            pais:"",
            estado:"",
            cidade:"",
            bairro:"",
            tipoLogradouro:"",
            logradouro:"",
            numero:"",
            tipo:"",
            entrega:1,
            cobranca:1,
            observacao:"",
        }
        var temp = cliente.enderecos
        temp.push(end)
        setCliente({...cliente, enderecos : temp})
    }
    function removerEndereco(){
        if(cliente.enderecos.length>1){
            var temp = cliente.enderecos
            temp.pop()
            setCliente({...cliente, enderecos : temp})
        }
    }    
    function addCartao(){
        var cart = {
            nome:"",
            numero:"",
            codigoSeguranca:"",
            validade:"",
            preferencial:"",
            bandeira:{nome:""}
        }
        var temp = cliente.cartoes
        temp.push(cart)
        setCliente({...cliente, cartoes : temp})
    }
    function removerCartao(){
        if(cliente.cartoes.length>1){
            var temp = cliente.cartoes
            temp.pop()
            setCliente({...cliente, cartoes : temp})
        }
    }
    function setCartaoPreferecial(cartao){
        setCliente({...cliente, cartoes: cliente.cartoes.map( cart => cliente.cartoes.indexOf(cart) === cliente.cartoes.indexOf(cartao) ? {...cart, preferencial:true}: {...cart,preferencial:false})})
    }

    function cadastrar(){
        if(senhaConfirmacao === cliente.senha){
            var clienteTemp = cliente
            clienteTemp.cartoes.forEach( cartao =>{
                cartao.validade = new Date(cartao.validade)
            })
            ClienteService.createCliente(clienteTemp).then(res => {
                if(!localStorage.getItem("isLogged")){
                        var usuario = res.data
                    localStorage.setItem( "id" , usuario.id )
                    localStorage.setItem( "tipo" , usuario.tipo )
                    localStorage.setItem( "isLogged" , true )
                    if(usuario.tipo == "CLIENTE"){
                        if(localStorage.getItem("carrinhoId")){

                        }
                        localStorage.setItem( "carrinhoId" , usuario.carrinho.id )
                    }
                    
                }
                alert("Cliente Cadastrado com sucesso")
                navegate(-1)
                
            }).catch(error => {
                alert(JSON.stringify(error.response.data))
            })
        }
        else{
            alert("A comfimação da senha não é igual")
        }
    }

    useEffect(() => {
        if(bandeiras.length === 0){
            BandeiraService.getBandeiras().then( res => {
                setBandeiras(res.data)
                setCliente({...cliente, cartoes:[{
                    nome:"",
                    numero:"",
                    codigoSeguranca:"",
                    validade:"",
                    preferencial:true,
                    bandeira:res.data[0]
                }]})
            }).catch(erro => {
                alert(JSON.stringify(erro.response.data))
            })
        }
    }, [])

    return( 
        <div className='row ' >
            <div className='container' style={{ marginBottom:30 ,marginTop:30}}>
                <div className='card'>
                    <h3 className='text-center'>Cadastrar</h3>
                    <div className='card-body' >
                        <div className='card' style={{ marginBottom:10 }}>                                
                            <div className='card-body'>
                                
                                <div className='card-body'>
                                    <h4 className='text'>Dados pessoal</h4>
                                    <div className='form-group'>
                                        <label>Nome:</label>
                                        <input type={"text"} placeholder='Nome Completo' name='nome_input' className='form-control' value={cliente.nome} onChange={(event) => setCliente({...cliente, nome : event.target.value})}></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>CPF:</label>
                                        <input type={"text"} placeholder='CPF' name='cpf_input' className='form-control' value={cpfMask(cliente.cpf)} onChange={(event) => setCliente({...cliente, cpf : event.target.value.replace(/\D/g, "")})}></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>Genero:</label>
                                        <input type={"text"} placeholder='Genero' name='genero_input' className='form-control' value={cliente.genero} onChange={(event) => setCliente({...cliente, genero : event.target.value})}></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>Data de Nascimento:</label>
                                        <input type={"date"} name='data_nacimento_input' className='form-control' value={cliente.dataNascimento} onChange={(event) => setCliente({...cliente, dataNascimento : event.target.value})}></input>
                                    </div>
                                </div>
                                <h4 className='text'>Meios de Contatos</h4>
                                <div className='card-body'>
                                    <div className='form-group'>
                                        <label>Email:</label>
                                        <input type={"text"} placeholder='email' name='email' className='form-control' value={cliente.email} onChange={(event) => setCliente({...cliente, email : event.target.value})}></input>
                                    </div>
                                    {cliente.telefones.map(telefone => 
                                        <div className='form-group card'  style={{marginTop:10}}>
                                            <div className='card-header'>
                                                <label>Telefone{cliente.telefones.indexOf(telefone) +1}</label>
                                            </div>
                                            <div className='card-body'>
                                                <label>Tipo</label>
                                                <input type={"text"} placeholder='Ex. Celular' name='tipo' className='form-control' value={telefone.tipo} onChange={(event) => setCliente({...cliente, telefones : cliente.telefones.map(tel => cliente.telefones.indexOf(tel) === cliente.telefones.indexOf(telefone) ? {...tel, tipo : event.target.value} : tel)})}></input>
                                                <label>DDD</label>
                                                <input type={"text"} placeholder='(xxx)' name='ddd' className='form-control' value={telefone.ddd} onChange={(event) => setCliente({...cliente, telefones : cliente.telefones.map(tel => cliente.telefones.indexOf(tel) === cliente.telefones.indexOf(telefone) ? {...tel, ddd : event.target.value} : tel)})}></input>
                                                <label>Numero</label>
                                                <input type={"text"} placeholder='xxxxx-xxxx' name='tipo' className='form-control' value={telefone.numero} onChange={(event) => setCliente({...cliente, telefones : cliente.telefones.map(tel => cliente.telefones.indexOf(tel) === cliente.telefones.indexOf(telefone) ? {...tel, numero : event.target.value}:tel)})}></input>
                                            </div>
                                        </div>
                                    )}
                                    <div className='row justify-content-center' style={{ marginTop:10, marginBottom:10 }}>
                                        <div className="col-auto">
                                            <button className='btn btn-dark' onClick={()=>addTelefone()} >Adicionar Telefone</button>
                                        </div>
                                        <div className="col-auto">
                                            <button className='btn btn-dark' onClick={()=>removerTelefone()} >Remover Telefone</button>
                                        </div>
                                    </div>
                                </div>
                                <h4 className='text'>Endereco</h4>
                                <div className='card-body'>
                                    {cliente.enderecos.map( endereco => 
                                        <div className='form-group card' style={{margeTop:10}}>
                                            <div className='card-header'>
                                                <label>Endereco {cliente.enderecos.indexOf(endereco) +1}</label>
                                            </div>
                                                <div className='card-body'>
                                                <label>Nome</label>
                                                <input type={"text"} placeholder='Nome do endereço, exp. "Casa" , "Trabalho"' className='form-control' value={endereco.nome} onChange={(event) => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, nome : event.target.value} : end)})}></input>
                                                <label>CEP</label>
                                                <input type={"text"} placeholder='CEP' className='form-control' value={cepMask(endereco.cep)} onChange={(event) => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, cep : event.target.value.replace(/\D/g, "")} : end)})}></input>
                                                <label>País</label>
                                                <input type={"text"} placeholder='Pais' className='form-control' value={endereco.pais} onChange={(event) => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, pais : event.target.value}:end)})}></input>
                                                <label>Estado</label>
                                                <input type={"text"} placeholder='Estado' className='form-control' value={endereco.estado} onChange={(event) => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, estado : event.target.value}:end)})}></input>
                                                <label>Cidadde</label>
                                                <input type={"text"} placeholder='Cidadde' className='form-control' value={endereco.cidade} onChange={(event) => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, cidade : event.target.value}:end)})}></input>
                                                <label>Bairro</label>
                                                <input type={"text"} placeholder='Bairro' className='form-control' value={endereco.bairro} onChange={(event) => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, bairro : event.target.value}:end)})}></input>
                                                <label>Tipo de Logradouro</label>
                                                <input type={"text"} placeholder='Tipo de Logradouro' className='form-control' value={endereco.tipoLogradouro} onChange={(event) => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, tipoLogradouro : event.target.value}:end)})}></input>
                                                <label>Logradouro</label>
                                                <input type={"text"} placeholder='Logradouro'  className='form-control' value={endereco.logradouro} onChange={(event) => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, logradouro : event.target.value}:end)})}></input>
                                                <label>Numero</label>
                                                <input type={"text"} placeholder='Numero' className='form-control' value={endereco.numero} onChange={(event) => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, numero : event.target.value}:end)})}></input>
                                                <label>Tipo</label>
                                                <input type={"text"} placeholder='Tipo do endereço, Ex. Casa, Predio, etc.' className='form-control' value={endereco.tipo} onChange={(event) => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, tipo : event.target.value}:end)})}></input>
                                                <label>Observacao</label>
                                                <input type={"text"} placeholder='Observacao' className='form-control' value={endereco.observacao} onChange={(event) => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, observacao : event.target.value}:end)})}></input>
                                                <input type={"checkbox"} name='Entrega' onClick={() => setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, entrega : !endereco.entrega}:end)})} checked={endereco.entrega}></input>Endereço de Entrega
                                                <br></br>
                                                <input type={"checkbox"} name='Cobranca' onClick={()=>setCliente({...cliente, enderecos : cliente.enderecos.map(end => cliente.enderecos.indexOf(end) === cliente.enderecos.indexOf(endereco) ? {...end, cobranca : !endereco.cobranca}:end)})} checked={endereco.cobranca}></input>Endereço de Cobrança
                                                
                                            </div>
                                        </div>
                                    )}
                                    <div className='row justify-content-center' style={{ marginTop:10, marginBottom:10 }}>
                                        <div className="col-auto">
                                            <button className='btn btn-dark' onClick={()=>addEndereco()} >Adicionar Endereco</button>
                                        </div>
                                        <div className="col-auto">
                                            <button className='btn btn-dark' onClick={()=>removerEndereco()} >Remover Endereco</button>
                                        </div>
                                    </div>
                                </div>
                                <h4 className='text'>Cartao de Credito</h4>
                                <div className='card-body'>
                                    {cliente.cartoes.map( cartao =>
                                        <div className='form-group card' style={{marginTop:10}}>
                                            <div className='card-header'>
                                                <label >Catao {cliente.cartoes.indexOf(cartao) +1}</label>
                                            </div>
                                            <div className='card-body'>
                                                <label>Bandeira:</label>
                                                <select name="bandeira" onSelect={(event)=>{setCliente({...cliente, cartoes : cliente.cartoes.map(cart => cliente.cartoes.indexOf(cart) === cliente.cartoes.indexOf(cartao) ? {...cart, bandeira : {id:event.target.value} } : cart)})}} >
                                                    {bandeiras.map(bandeira => 
                                                        <option value={bandeira.id}> {bandeira.nome} </option>
                                                    )}

                                                </select>
                                                <br></br>
                                                <label>Nome:</label>
                                                <input type={"text"} placeholder='Nome' name='tipo' className='form-control' value={cartao.nome} onChange={(event) => setCliente({...cliente, cartoes : cliente.cartoes.map(cart => cliente.cartoes.indexOf(cart) === cliente.cartoes.indexOf(cartao) ? {...cart, nome : event.target.value} : cart)})}></input>
                                                <label>Numero:</label>
                                                <input type={"text"} placeholder='Numero' name='tipo' className='form-control' value={cartao.numero} onChange={(event) => setCliente({...cliente, cartoes : cliente.cartoes.map(cart => cliente.cartoes.indexOf(cart) === cliente.cartoes.indexOf(cartao) ? {...cart, numero : event.target.value} : cart)})}></input>
                                                <label>Data de Vencimento:</label>
                                                <input type={"month"} name='tipo' className='form-control' value={cartao.validade} onChange={(event) => setCliente({...cliente, cartoes : cliente.cartoes.map(cart => cliente.cartoes.indexOf(cart) === cliente.cartoes.indexOf(cartao) ? {...cart, validade : event.target.value} : cart)})}></input>
                                                <label>Codigo de Seguranca:</label>
                                                <input type={"text"} placeholder='Codigo de Seguanca' name='tipo' className='form-control' value={cartao.codigoSeguranca} onChange={(event) => setCliente({...cliente, cartoes : cliente.cartoes.map(cart => cliente.cartoes.indexOf(cart) === cliente.cartoes.indexOf(cartao) ? {...cart, codigoSeguranca : event.target.value} : cart)})}></input>
                                                <input type={"checkbox"} name='tipo' onClick={()=>setCartaoPreferecial(cartao)} checked={cartao.preferencial}></input>Preferencial
                                                
                                            </div>
                                        </div>
                                    )}
                                    <div className='row justify-content-center' style={{ marginTop:10, marginBottom:10 }}>
                                        <div className="col-auto">
                                            <button className='btn btn-dark' onClick={()=>addCartao()} >Adicionar Cartao</button>
                                        </div>
                                        <div className="col-auto">
                                            <button className='btn btn-dark' onClick={()=>removerCartao()} >Remover Cartao</button>
                                        </div>
                                    </div>
                                </div>
                                <h4 className='text'>Senha</h4>
                                <div className='card-body'>
                                    <div className='form-group'>
                                        <label>Digite sua senha:</label>
                                        <input type={"password"}  name='senha' className='form-control' value={cliente.senha} onChange={(event) => setCliente({...cliente, senha: event.target.value})}></input>
                                        <label>Confirme sua senha:</label>
                                        <input type={"password"}  name='confimarSenha' className='form-control' value={senhaConfirmacao} onChange={(event) => setSenhaConfirmacao(event.target.value)}></input>
                                    </div>
                                </div>    
                            </div>
                        </div>
                        <div className='row justify-content-center'>
                            <div className="col-auto">
                                <button className='btn btn-dark' onClick={()=>cadastrar()} >Cadastrar</button>
                            </div>
                            <div className="col-auto">
                                <button className='btn btn-secondary' onClick={()=>navegate(-1)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CadastrarClienteComponent