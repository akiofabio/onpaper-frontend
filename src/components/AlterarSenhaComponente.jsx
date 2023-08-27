import React, { useEffect , useState } from 'react';
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import {cepMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString} from '../etc/Funcoes'
import ClienteMenuComponent from './ClienteMenuComponent';
import ClienteService from '../services/ClienteService';
import AreaClienteInicioComponent from './AreaClienteInicioComponent'
import AreaClientePedidosComponent from './AreaClientePedidosComponent'
import AreaClienteDadosComponent from './AreaClienteDadosComponent'
import DetalhesPedidosComponent from './DetalhesPedidosComponent';

function AlterarSenhaComponent(){
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
        <div className="card border-dark" style={{ marginTop:10 , paddingTop:5 , paddingLeft:10}}>
            <h4>Dados Pessoais</h4>
            <div className='card-body'>
                <div className='form-group'>
                    <label>Digite sua senha:</label>
                    <input type={"password"}  name='senha' className='form-control' value={cliente.senha} onChange={(event) => setCliente({...cliente, senha: event.target.value})}></input>
                    <label>Confirme sua senha:</label>
                    <input type={"password"}  name='confimarSenha' className='form-control' value={senhaConfirmacao} onChange={(event) => setSenhaConfirmacao(event.target.value)}></input>
                </div>
            </div>  
        </div>
    )
}
export default AlterarSenhaComponent