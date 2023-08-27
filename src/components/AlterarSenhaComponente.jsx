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
    const [novaSenha,setNovaSenha] = useState()
    const [senhaConfirmacao,setSenhaConfirmacao] = useState()
    const { id } = useParams()

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

    function save(){
        if(cliente.senha === senhaConfirmacao){
            ClienteService.updateCliente(cliente,cliente.id).then(res => {
                setCliente(res.data)
                alert("Senha Alterado com Sucesso")
            }).catch(erro => {
                alert(JSON.stringify(erro.response.data))
            })
        }
        else{
            alert("A Senha de Confirmação não Confere")
        }
    }
    return(
        <div className="card border-dark" style={{ marginTop:10 , paddingTop:5 , paddingLeft:10}}>
            <h4>Alterar Senha</h4>
            <div className='card-body'>
                <div className='form-group'>
                    <label>Digite a nova senha:</label>
                    <input type={"password"}  name='senha' className='form-control' value={cliente.senha} onChange={(event) => setCliente({...cliente, senha: event.target.value})}></input>
                    <label>Confirme a nova senha:</label>
                    <input type={"password"}  name='confimarSenha' className='form-control' value={senhaConfirmacao} onChange={(event) => setSenhaConfirmacao(event.target.value)}></input>
                </div>
                <div className="row justify-content-md-center" style={{margin:20}}>
                    <div className='col-2'>
                        <button className='btn btn-outline-dark' onClick={() => save()}>Confirmar</button>
                    </div>
                </div>
            </div>  
        </div>
    )
}
export default AlterarSenhaComponent