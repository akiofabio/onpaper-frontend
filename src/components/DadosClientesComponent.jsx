import React, { useEffect , useState , useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import {cepMask, stringDataMask, dataToInputDataMask , cpfMask, dataToInputMesEAnoDataMask, dataToStringMesEAnoDataMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString,enderecoToUmaLinhaSemCEP} from '../etc/Funcoes'
import ClienteMenuComponent from './ClienteMenuComponent';
import ClienteService from '../services/ClienteService';
import AreaClienteInicioComponent from './AreaClienteInicioComponent'
import AreaClientePedidosComponent from './AreaClientePedidosComponent'
import BandeiraService from '../services/BandeiraService';

function DadosClientesComponent (props){
    const [cliente, setCliente] = useState({
        score:"",
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
            entrega:false,
            cobranca:false,
            observacao:""
        }],
        cartoes: [{
            nome:"",
            numero:"",
            codigoSeguranca:"",
            validade:"",
            preferencial:false,
            bandeira:{nome:""}
        }],
        pedidos: [{
            data:"",
            status:""
        }],
        cupons: [],
        carrinho:null,
    })
    const { id } = useParams()
    const [ clienteTemp , setClienteTemp ] = useState()
    const [ telefoneIndexTemp , setTelefoneIndexTemp ] = useState()
    const [ enderecoIndexTemp , setEnderecoIndexTemp ] = useState()
    const [ cartaoIndexTemp , setCartaoIndexTemp ] = useState()

    const [mostrarEditarDadosPessoal, setMostrarEditarDadosPessoal] = useState(false);
    const [mostrarEditarTelefone, setMostrarEditarTelefone] = useState(false);
    const [mostrarEditarEndereco, setMostrarEditarEndereco] = useState(false);
    const [mostrarEditarCartao, setMostrarEditarCartao] = useState(false);
    
    const [bandeiras, setBandeiras] = useState([]);
    
    function editarDadosPessoal(){
        setClienteTemp(cliente)
        setMostrarEditarDadosPessoal(true)
    }

    function editarTelefone(tel){
        setClienteTemp(cliente)
        setTelefoneIndexTemp(tel)
        setMostrarEditarTelefone(true)
    }

    function addTelefone(){
        setClienteTemp({...cliente , telefones : [...cliente.telefones,{tipo:"", ddd:"", numero:""}]})
        setTelefoneIndexTemp(cliente.telefones.length)
        setMostrarEditarTelefone(true)
    }
    
    function removerTelefone(telIndex){     
        if(cliente.telefones.length>1){
            var telefonesTemp = cliente.telefones.filter(tel => cliente.telefones.indexOf(tel) !== telIndex)
            salvar({...cliente, telefones: telefonesTemp})
        }
        
    }

    function editarEndereco(end){
        setClienteTemp(cliente)
        setEnderecoIndexTemp(end)
        setMostrarEditarEndereco(true)
    }

    function addEndereco(){
        setClienteTemp({...cliente , enderecos : [...cliente.enderecos,{nome:"", cep:"", estsdo:"", cidade:"", bairro:"", tipoLogradouro:"", logradouro:"", numero:""}]})
        setEnderecoIndexTemp(cliente.enderecos.length)
        setMostrarEditarEndereco(true)
    }
    
    function removerEndereco(endIndex){     
        if(cliente.enderecos.length>1){
            var enderecosTemp = cliente.enderecos.filter(end => cliente.enderecos.indexOf(end) !== endIndex)
            salvar({...cliente, enderecos: enderecosTemp})
        }
    }

    function editarCartao(car){
        setClienteTemp(cliente)
        setCartaoIndexTemp(car)
        setMostrarEditarCartao(true)
    }

    function addCartao(){
        setClienteTemp({...cliente , cartoes : [...cliente.cartoes,{nome:"", numero:""}]})
        setCartaoIndexTemp(cliente.cartoes.length)
        setMostrarEditarCartao(true)
    }
    
    function removerCartao(carIndex){     
        if(cliente.cartoes.length>1){
            var cartoesTemp = cliente.cartoes.filter(car => cliente.cartoes.indexOf(car) !== carIndex)
            if(cliente.cartoes[carIndex].preferencial)
                cartoesTemp = cartoesTemp.map(car => cartoesTemp.indexOf(car)===0? {...car, preferencial:true}:{...car, preferencial:false})
            salvar({...cliente, cartoes: cartoesTemp})
        }
    }

    function salvar(cli){
        cli.cartoes.forEach( cartao =>{
            cartao.validade = new Date(cartao.validade)
        })
        ClienteService.updateCliente(cli, cliente.id).then(res => {
            var usuario = res.data
            localStorage.setItem( "id" , usuario.id )
            localStorage.setItem( "tipo" , usuario.tipo )
            localStorage.setItem( "isLogged" , true )
            if(usuario.tipo == "CLIENTE"){
                if(localStorage.getItem("carrinhoId")){

                }
                localStorage.setItem( "carrinhoId" , usuario.carrinho.id )
            }
            alert("Cliente Alterado com sucesso")
            setCliente(usuario)
            setMostrarEditarDadosPessoal(false)
            setMostrarEditarTelefone(false)
            setMostrarEditarEndereco(false)
            setMostrarEditarCartao(false)
        }).catch(error => {
            alert(JSON.stringify(error.response.data))
        })
    }

    function editarDadosPessoalOverlay(){
        return(
            <div>
                <Overlay show={mostrarEditarDadosPessoal} placement="auto">
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                        <div
                            {...props}
                            style={{
                            position: 'fixed',
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.8)',
                            ...props.style,
                            }}
                        >
                            <div className='card border-dark' style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translate(-50%)',
                            }}>
                                <div  className="card-header border-dark bg-dark text-white" style={{borderRadius: 5}}>
                                    <h3 className='text-center'>Alterar Dados Pessoal</h3>
                                </div>
                                
                                <div className='card-body' >
                                    <div className='form-group'>
                                        <label>Nome:</label>
                                        <input type={"text"} placeholder='Nome Completo' name='nome_input' className='form-control' value={clienteTemp.nome} onChange={(event) => setClienteTemp({...clienteTemp, nome : event.target.value})}  size="50"></input>
                                        <label>CPF:</label>
                                        <input type={"text"} placeholder='CPF' name='cpf_input' className='form-control' value={cpfMask(clienteTemp.cpf)} onChange={(event) => setClienteTemp({...clienteTemp, cpf : event.target.value})}></input>
                                        <label>Genero:</label>
                                        <input type={"text"} placeholder='Genero' name='genero_input' className='form-control' value={clienteTemp.genero} onChange={(event) => setClienteTemp({...clienteTemp, genero : event.target.value})}></input>
                                        <label>Data de Nascimento:</label>
                                        <input type={"date"} name='genero_input' className='form-control' value={dataToInputDataMask(clienteTemp.dataNascimento)} onChange={(event) => setClienteTemp({...clienteTemp, dataNascimento : event.target.value})}></input>
                                    </div>
                                </div>
                                <div className='row justify-content-md-center'>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5} } onClick={() => salvar(clienteTemp)}>Salvar</button>
                                    </div>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5}} onClick={() => setMostrarEditarDadosPessoal(!mostrarEditarDadosPessoal)}>Cancelar</button>
                                    </div>                                
                                </div>
                            </div>
                        </div>
                    )}
                </Overlay>
            </div>
        )
    }

    function editarTelefoneOverlay(){
        return(
            <div>
                <Overlay show={mostrarEditarTelefone} placement="auto">
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                        <div
                            {...props}
                            style={{
                            position: 'fixed',
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.8)',
                            ...props.style,
                            }}
                        >
                            <div className='card border-dark' style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translate(-50%)',
                            }}>
                                <div  className="card-header border-dark bg-dark text-white" style={{borderRadius: 5}}>
                                    <h3 className='text-center'>Alterar Telefone</h3>
                                </div>
                                
                                <div className='card-body' >
                                    <div className='form-group'>
                                        <label>Tipo:</label>
                                        <input type={"text"} placeholder='Tipo' name='tipo_input' className='form-control' value={clienteTemp.telefones[telefoneIndexTemp].tipo} onChange={(event) => setClienteTemp({...clienteTemp, telefones : clienteTemp.telefones.map(tel => clienteTemp.telefones.indexOf(tel) === telefoneIndexTemp ? {...tel, tipo : event.target.value} : tel)})} size="50"></input>
                                        <label>DDD:</label>
                                        <input type={"text"} placeholder='DDD' name='ddd_input' className='form-control' value={clienteTemp.telefones[telefoneIndexTemp].ddd} onChange={(event) => setClienteTemp({...clienteTemp, telefones : clienteTemp.telefones.map(tel => clienteTemp.telefones.indexOf(tel) === telefoneIndexTemp ? {...tel, ddd : event.target.value} : tel)})}></input>
                                        <label>Numeo:</label>
                                        <input type={"text"} placeholder='Numero' name='numero_input' className='form-control' value={clienteTemp.telefones[telefoneIndexTemp].numero} onChange={(event) => setClienteTemp({...clienteTemp, telefones : clienteTemp.telefones.map(tel => clienteTemp.telefones.indexOf(tel) === telefoneIndexTemp ? {...tel, numero : event.target.value} : tel)})}></input>
                                    </div>
                                </div>
                                <div className='row justify-content-md-center'>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5} } onClick={() => salvar(clienteTemp)}>Salvar</button>
                                    </div>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5}} onClick={() => setMostrarEditarTelefone(!mostrarEditarTelefone)}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Overlay>
            </div>
        )
    }

    function editarEnderecoOverlay(){
        return(
            <div>
                <Overlay show={mostrarEditarEndereco} placement="auto">
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                        <div
                            {...props}
                            style={{
                            position: 'fixed',
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.4)',
                            ...props.style,
                            }}
                        >
                            <div className='card border-dark' style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translate(-50%)',
                            }}>
                                <div  className="card-header border-dark bg-dark text-white">
                                    <h3 className='text-center'>Alterar Endereço</h3>
                                </div>
                                <div className='card-body' >
                                    <div className='form-group'>
                                        <label>Nome:</label>
                                        <input type={"text"} placeholder='Nome' name='tipo_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].nome} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, nome : event.target.value} : end)})} size="80"></input>
                                        <label>CEP:</label>
                                        <input type={"text"} placeholder='CEP' name='tipo_input' className='form-control' value={cepMask(clienteTemp.enderecos[enderecoIndexTemp].cep)} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, cep : event.target.value.replace(/\D/g, "")} : end)})}></input>
                                        <div className='row'>
                                            <div className='col'>
                                                <label>País:</label>
                                                <input type={"text"} placeholder='País' name='tipo_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].pais} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, pais : event.target.value} : end)})}></input>
                                            </div>
                                            <div className='col'>
                                                <label>Estado:</label>
                                                <input type={"text"} placeholder='Estado' name='tipo_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].estado} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, estado : event.target.value} : end)})}></input>
                                            </div>
                                        </div>
                                        <label>Cidade:</label>
                                        <input type={"text"} placeholder='Cidade' name='tipo_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].cidade} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, cidade : event.target.value} : end)})}></input>
                                        <label>Bairro:</label>
                                        <input type={"text"} placeholder='Tipo' name='tipo_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].bairro} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, bairro : event.target.value} : end)})}></input>
                                        <div className='row'>
                                            <div className='col col-sm-5'>
                                                <label>Tipo de Logradouro:</label>
                                                <input type={"text"} placeholder='Tipo de Logradouro' name='tipo_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].tipoLogradouro} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, tipoLogradouro : event.target.value} : end)})}></input>
                                            </div>
                                            <div className='col'>
                                                <label>Logradouro:</label>
                                                <input type={"text"} placeholder='Logradouro' name='tipo_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].logradouro} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, logradouro : event.target.value} : end)})}></input>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col col-sm-5'>
                                                <label>Numero:</label>
                                                <input type={"text"} placeholder='Numero' name='tipo_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].numero} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, numero : event.target.value} : end)})}></input>
                                            </div>
                                            <div className='col col-sm-5'>
                                                <label>Tipo:</label>
                                                <input type={"text"} placeholder='Tipo do endereço, Ex. Casa, Predio, etc.' name='tipo_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].tipo} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, tipo : event.target.value} : end)})}></input>
                                            </div>
                                        </div>
                                        <label>Observacao:</label>
                                        <input type={"text"} placeholder='Observacao' name='tipo_input' className='form-control' value={clienteTemp.enderecos[enderecoIndexTemp].observacao} onChange={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, observacao : event.target.value} : end)})}></input>
                                        <input type={"checkbox"} name='Entrega' onClick={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, entrega : !clienteTemp.enderecos[enderecoIndexTemp].entrega} : end)})} checked={clienteTemp.enderecos[enderecoIndexTemp].entrega}></input>Endereço de Entrega
                                        <br></br>
                                        <input type={"checkbox"} name='Cobranca' onClick={(event) => setClienteTemp({...clienteTemp, enderecos : clienteTemp.enderecos.map(end => clienteTemp.enderecos.indexOf(end) === enderecoIndexTemp ? {...end, cobranca : !clienteTemp.enderecos[enderecoIndexTemp].cobranca} : end)})} checked={clienteTemp.enderecos[enderecoIndexTemp].cobranca}></input>Endereço de Cobrança
                                        
                                    </div>
                                </div>
                                <div className='row justify-content-md-center'>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5} } onClick={() => salvar(clienteTemp)}>Salvar</button>
                                    </div>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5}} onClick={() => setMostrarEditarEndereco(!mostrarEditarEndereco)}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    )}
                </Overlay>
            </div>
        )
    }

    function editarCartaoOverlay(){

        return(
            <div>
                <Overlay show={mostrarEditarCartao} placement="auto" >
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                        <div
                            {...props}
                            style={{
                            position: 'fixed',
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.8)',
                            ...props.style,
                            }}
                        >
                            <div className='card border-dark' style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translate(-50%)',
                                opacity: 1,
                            }}>
                                <div className="card-header border-dark bg-dark text-white">
                                    <h3 className='text-center'>Alterar Cartao</h3>
                                </div>
                                <div className='card-body'>
                                    <div className='form-group'>
                                        <label>Bandeira:</label>
                                        <select name="bandeira" onSelect={(event)=>{setClienteTemp({...cliente, cartoes : cliente.cartoes.map(cart => cliente.cartoes.indexOf(cart) === cartaoIndexTemp ? {...cart, bandeira : {id:event.target.value} } : cart)})}} >
                                            {bandeiras.map(bandeira => 
                                                <option value={bandeira}> {bandeira.nome} </option>
                                            )}

                                        </select>    
                                    </div>
                                    <div className='form-group'>
                                        <label>Nome:</label>
                                        <input type={"text"} placeholder='Nome como esta no cartao' name='tipo_input' className='form-control' value={clienteTemp.cartoes[cartaoIndexTemp].nome} onChange={(event) => setClienteTemp({...clienteTemp, cartoes : clienteTemp.cartoes.map(car => clienteTemp.cartoes.indexOf(car) === cartaoIndexTemp ? {...car, nome : event.target.value} : car)})} size="50"></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>Numero:</label>
                                        <input type={"text"} placeholder='xxx.xxx.xxx.xxx.xxx.xxx' name='tipo_input' className='form-control' value={clienteTemp.cartoes[cartaoIndexTemp].numero} onChange={(event) => setClienteTemp({...clienteTemp, cartoes : clienteTemp.cartoes.map(car => clienteTemp.cartoes.indexOf(car) === cartaoIndexTemp ? {...car, numero : event.target.value} : car)})} size="50"></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>Data de Validade:</label>
                                        <input type={"month"} name='tipo_input' className='form-control' value={dataToInputMesEAnoDataMask(clienteTemp.cartoes[cartaoIndexTemp].validade)} onChange={(event) => setClienteTemp({...clienteTemp, cartoes : clienteTemp.cartoes.map(car => clienteTemp.cartoes.indexOf(car) === cartaoIndexTemp ? {...car, validade : event.target.value} : car)})} size="50"></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>Codigo de Seguranca:</label>
                                        <input type={"text"} placeholder='CVV' name='tipo_input' className='form-control' value={clienteTemp.cartoes[cartaoIndexTemp].codigoSeguranca} onChange={(event) => setClienteTemp({...clienteTemp, cartoes : clienteTemp.cartoes.map(car => clienteTemp.cartoes.indexOf(car) === cartaoIndexTemp ? {...car, codigoSeguranca : event.target.value} : car)})} size="50"></input>
                                    </div>
                                    <div className='form'>
                                        <input type={"checkbox"} name='tipo' onClick={()=>setCartaoPreferecialTemp()} checked={clienteTemp.cartoes[cartaoIndexTemp].preferencial}></input>Preferencial
                                    </div>
                                </div>
                                <div className='row justify-content-md-center'>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5} } onClick={() => salvar(clienteTemp)}>Salvar</button>
                                    </div>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5}} onClick={() => setMostrarEditarCartao(!mostrarEditarCartao)}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Overlay>
            </div>
        )
    }

    function setCartaoPreferecial(cartao){
        setCliente({...cliente, cartoes: cliente.cartoes.map( cart => cliente.cartoes.indexOf(cart) === cliente.cartoes.indexOf(cartao) ? {...cart, preferencial:true}: {...cart,preferencial:false})})
    }

    function setCartaoPreferecialTemp(){
        if(clienteTemp.cartoes[cartaoIndexTemp].preferencial && cliente.cartoes[cartaoIndexTemp].preferencial){
            alert("E necessario ter um cartao preferencial")
        }
        else if(clienteTemp.cartoes[cartaoIndexTemp].preferencial){
            setClienteTemp({...clienteTemp, cartoes : cliente.cartoes})
        }
        else{
            setClienteTemp({...clienteTemp, cartoes : clienteTemp.cartoes.map(car => clienteTemp.cartoes.indexOf(car) === cartaoIndexTemp ? {...car, preferencial : true} : {...car, preferencial : false})})
        }
    }

    useEffect(() => {
        if(!cliente.id){
            if( id !== undefined){
                ClienteService.getClienteById( id ).then( res => {
                    setCliente(res.data)
                })
            }
            else{
                ClienteService.getClienteById( localStorage.getItem( "id" ) ).then( res => {
                    setCliente(res.data)
                })
            }
        }
        if(bandeiras.length===0){
            BandeiraService.getBandeiras().then(res =>{
                setBandeiras(res.data);
            })
        }
    }, [])

    return(
        <div>
            <div className="card border-dark" style={{ marginTop:10 , paddingTop:5 , paddingLeft:10}}>
                <h4>Dados Pessoais</h4>
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
                    <div className="row">
                        <div className='col'>
                            <button className='btn btn-dark' onClick={()=>editarDadosPessoal()}>editar</button>
                        </div>
                    </div>
                    {editarDadosPessoalOverlay()}
                </div>
            </div>
            <div className="card border-dark" style={{ marginTop:10 , paddingTop:5 , paddingLeft:10}}>
                <h4>Contatos</h4>
                <div className="card-body">
                    <div className="row">
                        <label>Email: {cliente.email}</label>
                    </div>
                    {cliente.telefones.map( telefone => 
                        <div className="row">
                            <div className='col-8'>
                                <label>Telefone {cliente.telefones.indexOf(telefone) +1}: {telefone.tipo} ({telefone.ddd}) {telefone.numero}</label>
                            </div>
                            <div className='col'>
                                <button className='btn btn-outline-dark' onClick={()=>removerTelefone(cliente.telefones.indexOf(telefone))}>remover</button>
                            </div>
                            <div className='col'>
                                <button className='btn btn-outline-dark' onClick={()=>editarTelefone(cliente.telefones.indexOf(telefone))}>editar</button>
                            </div>
                            {editarTelefoneOverlay()}
                        </div>
                    )}
                    <button className='btn btn-dark' onClick={()=>addTelefone()}>Adicionar Telefone</button>
                </div>
            </div>
            <div className="card border-dark" style={{ marginTop:10 , paddingTop:5 , paddingLeft:10}}>
                <h4>Endereco</h4>
                <div className="card-body">
                        {cliente.enderecos.map( endereco =>
                        <div>
                            <div className="card border-dark" style={{ marginTop:10 , marginBottom:10}}>
                                <div className="card-header">
                                    <label>Endereco {cliente.enderecos.indexOf(endereco) +1}</label>
                                </div>
                                <div className='card-body'>
                                    <div className="row">
                                        <label>Nome: {endereco.nome} </label>
                                    </div>
                                    <div className="row">
                                        <label>CEP: {cepMask(endereco.cep)} </label>
                                    </div>
                                    <div className="row">
                                        <label> {enderecoToUmaLinhaSemCEP(endereco)} </label>
                                    </div>
                                        <input type={"checkbox"} name='Entrega' disabled  checked={endereco.entrega}></input>Endereço de Entrega
                                        <br></br>
                                        <input type={"checkbox"} name='Cobranca' disabled  checked={endereco.cobranca}></input>Endereço de Cobrança
                                    
                                </div>
                                {editarEnderecoOverlay()}
                            </div>
                            <div className="row justify-content-md-center">
                            <div className='col-2'>
                                <button className='btn btn-outline-dark' onClick={()=>removerEndereco(cliente.enderecos.indexOf(endereco))}>remover</button>
                            </div>
                            <div className='col-2'>
                                <button className='btn btn-outline-dark' onClick={()=>editarEndereco(cliente.enderecos.indexOf(endereco))}>editar</button>
                            </div>
                        </div>
                    </div>
                    )}
                    <button className='btn btn-dark' onClick={()=>addEndereco()}>Adicionar Endereco</button>
                </div>
            </div>
            <div className="card border-dark" style={{ marginTop:10 , paddingTop:5 , paddingLeft:10}}>
                <h4>Cartao de Credito</h4>
                <div className="card-body">
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
                                        <label>Data de Vencimento: {dataToStringMesEAnoDataMask(cartao.validade)} </label>
                                    </div>
                                    <div className="row">
                                        <label>Codigo de Seguranca: {cartao.codigoSeguranca} </label>
                                    </div>
                                    <div className='form'>
                                        <input type={"checkbox"} name='tipo' onClick={()=>setCartaoPreferecial(cartao)} checked={cartao.preferencial}></input>Preferencial
                                    </div>
                                </div>
                                {editarCartaoOverlay()}
                            </div>
                            <div className="row justify-content-md-center">
                            <div className='col-2'>
                                <button className='btn btn-outline-dark' onClick={()=>removerCartao(cliente.cartoes.indexOf(cartao))}>remover</button>
                            </div>
                            <div className='col-2'>
                                <button className='btn btn-outline-dark' onClick={()=>editarCartao(cliente.cartoes.indexOf(cartao))}>editar</button>
                            </div>
                            
                        </div>
                    </div>
                    )}
                    <button className='btn btn-dark' onClick={()=>addCartao()}>Adicionar Cartao</button>
                </div>
            </div>
        </div>
    )
}
export default DadosClientesComponent