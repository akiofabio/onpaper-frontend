import React, { useState , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Overlay from 'react-bootstrap/Overlay';

function LoginImage (props){
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const isLogged = localStorage.getItem( "isLogged" )
    const navigate = useNavigate()
    function sair(){
        localStorage.clear()
        setShow(!show)
        navigate("/")
    }
    function menu(){
        setShow(!show)
        if(localStorage.getItem( "tipo" )=="CLIENTE"){
            navigate("/areaCliente")
        }
        else if(localStorage.getItem( "tipo" )=="ADMIN"){
            navigate("/areaGerente")
        }
        
    }
    if( !isLogged ){
        return (
            <button className='btn btn-dark' onClick={()=>navigate("/login")}>
                <img src='/imagens/icones/login.png'></img>
            </button>
        );
    }
    else{
        return (
            <div>
                <button className='btn btn-dark' ref={target} onClick={()=>setShow(!show)}>
                    <img src='/imagens/icones/login.png'></img>
                </button>
                
                <Overlay target={target.current} show={show} placement="bottom" rootClose='true' onHide={()=>setShow(!show)}>
                {({ placement, arrowProps, show: _show, popper, ...props }) => (
                    <div className='row'
                        {...props}
                        style={{
                        backgroundColor: 'black',
                        padding: '2px 10px',
                        color: 'white',
                        borderRadius: 5,
                        borderWidth: 10,
                        borderColor: 'black',
                        ...props.style,
                        }}
                    >
                        <button className='btn btn-dark' style={{marginBottom: 5 , marginTop: 5 } } onClick={() => menu()}>Menu</button>
                        <button className='btn btn-dark' style={{marginBottom: 5}} onClick={() => sair()}>Sair</button>
                    </div>
                    )}
                </Overlay>
            </div>
        );
    }
}

function HeaderComponent (){
    const [pesquisa , setPesquisa] = useState("");
    const navigate = useNavigate()

    function pesquisar(){
        if(pesquisa===""){
            navigate("/pesquisar")
        }
        else{
            navigate("/pesquisar/"+pesquisa)
        }
    }
    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark nav-pills nav-fill">
                    <div className="container-fluid">
                        <a href="http://localhost:3000/" className='navbar-brand'>OnPaper</a>
                        <form className="nav-item d-flex">
                            <input className="form-control me-2" type="search" placeholder="O que você procura?" aria-label="Search" style={{width:300, marginLeft:200}} value={pesquisa} onChange={(event)=>setPesquisa(event.target.value)}></input>
                            <button className="btn btn-success" type="submit" onClick={()=>pesquisar()}>Search</button>
                        </form>
                        <a href="http://localhost:3000/carrinho" className='nav-item' style={{marginLeft:200}}>
                            <img src='/imagens/icones/carrinho.png' width={30} height='auto'></img>
                        </a>
                        <LoginImage />
                    </div>
                </nav>
            </header>
        </div>
    );
}
export default HeaderComponent;