import React, { useEffect , useState } from 'react';
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import {cepMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString} from '../etc/Funcoes'
import ClienteMenuComponent from './ClienteMenuComponent';
import ClienteService from '../services/ClienteService';
import AreaClienteInicioComponent from './AreaClienteInicioComponent'
import AreaClientePedidosComponent from './AreaClientePedidosComponent'


function CadastrarClienteComponent(){
    const navegate = useNavigate()
    const [cliente, setCliente] = useState({
        nome: "",
        email: "",
        senha: "",
        pedidos: []
    })

    function confimarLogin(){
    }
    function cadastrar(){
    }
    return( 
        
        <div className='row ' >
            <div className='container' style={{ marginBottom:30 ,marginTop:30}}>
                    <div className='card col-md-6 offset-md-3 offset-md-3'>
                        <h3 className='text-center'>Cadastrar</h3>
                        <div className='card-body' >
                            <div className='card' style={{ marginBottom:10 }}>                                
                                <div className='card-body'>
                                    <h4 className='text'>Dados pessoal</h4>
                                    <div className='card-body'>
                                        <div className='form-group'>
                                            <label>Nome:</label>
                                            <input type={"text"} placeholder='Nome Completo' name='nome' className='form-control' value={cliente.senha} onChange={(event) => setCliente(event.target.value)}></input>
                                        </div>
                                        <div className='form-group'>
                                            <label>CPF:</label>
                                            <input type={"text"} placeholder='CPF' name='cpf' className='form-control' value={cliente.senha} onChange={(event) => setCliente(event.target.value)}></input>
                                        </div>
                                        <div className='form-group'>
                                            <label>CPF:</label>
                                            <input type={"text"} placeholder='CPF' name='cpf' className='form-control' value={cliente.senha} onChange={(event) => setCliente(event.target.value)}></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row justify-content-center'>
                                <div className="col-auto">
                                    <button className='btn btn-dark' onClick={()=>confimarLogin()} >Cadastrar</button>
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