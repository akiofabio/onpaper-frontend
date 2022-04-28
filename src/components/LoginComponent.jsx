import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import UserService from '../services/UserService';
import ClienteService from '../services/ClienteService';
import axios from 'axios'
function LoginComponent(){
    const navegate = useNavigate()
    const [ email , setEmail ] = useState("")
    const [ senha , setSenha ] = useState("")

    function confimarLogin(){
        let usuario = {
            "email": "cliente1@mail.com",
            "senha": "senha1"
        }

        /* var myHeaders = new Headers();
        myHeaders.set("Content-Type", "application/json");
        var myInit = { method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
        };

        fetch( "http://localhost:8080/api/v1/usuario/login" , myInit )
            .then(res => {
                if(res.ok){
                    return res.json()
                }
                throw res;
            })
            .then(data => {
                localStorage.setItem( "id" , data.id )
                localStorage.setItem( "tipo" , data.tipo )
                localStorage.setItem( "isLogged" , true )
                navegate(-1)
            }) */
        UserService.getUserLogin( email , senha ).then(res => {
            usuario = res.data
            localStorage.setItem( "id" , usuario.id )
            localStorage.setItem( "tipo" , usuario.tipo )
            localStorage.setItem( "isLogged" , true )
            if(localStorage.getItem("carrinhoId")){
                
            }
            localStorage.setItem( "carrinhoId" , usuario.carrinho.id )
            navegate(-1)
        }).catch(error => {
            alert(error.response.data)
        })
    }
    return(
        <div>
            <div className='container' style={{ marginBottom:30 ,marginTop:30}}>
                    <div className='card col-md-6 offset-md-3 offset-md-3'>
                        <h3 className='text-center'>Login</h3>
                        <div className='card-body' >
                            <div className='card' style={{ marginBottom:10 }}>
                                
                                <div className='card-body'>
                                    <div className='form-group'>
                                        <label>Email:</label>
                                        <input type={"email"} placeholder='Email' name='email' className='form-control' value={email} onChange={ (event) => setEmail(event.target.value)}></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>Senha:</label>
                                        <input type={"password"} placeholder='Senha' name='senha' className='form-control' value={senha} onChange={(event) => setSenha(event.target.value)}></input>
                                    </div>
                                </div>
                            </div>
                            <div className='row justify-content-center'>
                                <div className="col-auto">
                                    <button className='btn btn-dark' onClick={()=>confimarLogin()} >Entrar</button>
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
export default LoginComponent;