import React, { useEffect , useState , useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import {moedaRealToFloatMask, cepMask, stringDataMask, dataToInputDataMask , cpfMask, dataToInputMesEAnoDataMask, dataToStringMesEAnoDataMask, moedaRealMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString,enderecoToUmaLinhaSemCEP} from '../etc/Funcoes'
import ClienteService from '../services/ClienteService';

function CuponsClientesComponent (props){
    
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
    const [mostrarEditarCupom, setMostrarEditarCupom] = useState(false)
    const [cupomIndexTemp, setCupomIndexTemp] = useState()

    function editarCupom(index){
        setClienteTemp(cliente)
        setCupomIndexTemp(index)
        setMostrarEditarCupom(true)
    }

    function addCupom(){
        setCupomIndexTemp(cliente.cupons.length)
        setClienteTemp({...cliente , cupons : [...cliente.cupons,{tipo:"Promocional", decricao:"", valor:0}]})
        setMostrarEditarCupom(true)
    }
    
    function removerCupom(index){     
        if(cliente.cupons.length>0){
            var cuponsTemp = cliente.cupons.filter(cup => cliente.cupons.indexOf(cup) !== index)
            salvarCupom({...cliente, cupons: cuponsTemp})
        }
        
    }

    function salvarCupom(cli){
        ClienteService.updateCliente(cli, cli.id).then(res => {
            var usuario = res.data
            localStorage.setItem( "id" , usuario.id )
            localStorage.setItem( "tipo" , usuario.tipo )
            localStorage.setItem( "isLogged" , true )
            alert("Cliente Alterado com sucesso")
            setCliente(usuario)
            setMostrarEditarCupom(false)
        }).catch(error => {
            alert(JSON.stringify(error.response.data))
        })
    }

    function editarCupomOverlay(){
        return(
            <div>
                <Overlay show={mostrarEditarCupom} placement="auto">
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
                                <div  className="card-header border-dark bg-dark text-white" style={{borderRadius: 5}}>
                                    <h3 className='text-center'>Alterar Cupom</h3>
                                </div>
                                
                                <div className='card-body' >
                                    <div className='form-group'>
                                        <label>Tipo:</label>
                                        <select defaultValue={clienteTemp.cupons[cupomIndexTemp].tipo} onChange={(event) => setClienteTemp({...clienteTemp, cupons : clienteTemp.cupons.map(cup => clienteTemp.cupons.indexOf(cup) === cupomIndexTemp ? {...cup, tipo : event.target.value} : cup)})}>
                                            <option value={"Promocional"}>Promocional</option>
                                            <option value={"Troca"}>Troca</option>
                                        </select>
                                        <br></br>
                                        <label>Descrição:</label>
                                        <input type={"text"} placeholder='Descricao' name='descricao_input' className='form-control' value={clienteTemp.cupons[cupomIndexTemp].descricao} onChange={(event) => setClienteTemp({...clienteTemp, cupons : clienteTemp.cupons.map(cup => clienteTemp.cupons.indexOf(cup) === cupomIndexTemp ? {...cup, descricao : event.target.value} : cup)})}></input>
                                        <label>Valor:</label>
                                        <input type={"text"} placeholder='Valor' name='numero_input' className='form-control' value={moedaRealMask(clienteTemp.cupons[cupomIndexTemp].valor)} onChange={(event) => setClienteTemp({...clienteTemp, cupons : clienteTemp.cupons.map(cup => clienteTemp.cupons.indexOf(cup) === cupomIndexTemp ? {...cup, valor : moedaRealToFloatMask(event.target.value)} : cup)})}></input>
                                    </div>
                                </div>
                                <div className='row justify-content-md-center'>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5} } onClick={() => salvarCupom(clienteTemp)}>Salvar</button>
                                    </div>
                                    <div className='col-auto'>
                                        <button className='btn btn-dark' style={{marginBottom: 5}} onClick={() => setMostrarEditarCupom(!setMostrarEditarCupom)}>Cancelar</button>
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
    }, [])

    return(
        <div>
            <div className="card border-dark" style={{ marginTop:10 , paddingTop:5 , paddingLeft:10}}>
                <h4>Cupons</h4>
                <div className="card-body">
                    {cliente.cupons.map( cupom => 
                        <div className="card border-dark" style={{ marginTop:10 , marginBottom:10}}>
                            <div className="card-header">
                                <label>Cupom {cupom.id}</label>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <label>Tipo: {cupom.tipo} </label>
                                </div>
                                <div className="row">
                                    <label>Descricao: {cupom.descricao} </label>
                                </div>
                                <div className="row">
                                    <label>Valor: {moedaRealMask(cupom.valor)} </label>
                                </div>
                                <div className="row justify-content-md-center">
                                    <div className='col-2'>
                                        <button className='btn btn-outline-dark' onClick={()=>removerCupom(cliente.cupons.indexOf(cupom))}>remover</button>
                                    </div>
                                    <div className='col-2'>
                                        <button className='btn btn-outline-dark' onClick={()=>editarCupom(cliente.cupons.indexOf(cupom))}>editar</button>
                                    </div>
                                </div>
                            </div>
                            {editarCupomOverlay()}
                        </div>
                    )}
                    <button className='btn btn-dark' onClick={()=>addCupom()}>Adicionar Cupom</button>
                </div>
            </div>
        </div>
    )
}
export default CuponsClientesComponent