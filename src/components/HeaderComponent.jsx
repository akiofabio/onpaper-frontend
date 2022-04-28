import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginImage (props){
    const isLogged = localStorage.getItem( "isLogged" )
    const navigate = useNavigate()
    function sair(){
        localStorage.clear()
        navigate(0)
    }

    if( !isLogged ){
        return (
            <a href="http://localhost:3000/login" className='nav-item'>
                <img src='imagens/icones/login.png'></img>
            </a>
        );
    }
    else{
        return (
            <button className='btn btn-dark' onClick={() => sair()}>Sair</button>
        );
    }

}

function HeaderComponent (){
    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark nav-pills nav-fill">
                    <div className="container-fluid">
                        <a href="http://localhost:3000/" className='navbar-brand'>OnPaper</a>
                        <form className="nav-item d-flex">
                            <input className="form-control me-2" type="search" placeholder="O que você procura?" aria-label="Search" style={{width:300, marginLeft:200}} ></input>
                            <button className="btn btn-success" type="submit">Search</button>
                        </form>
                        <a href="http://localhost:3000/carrinho" className='nav-item' style={{marginLeft:200}}>
                            <img src='imagens/icones/carrinho.png' width={30} height='auto'></img>
                        </a>
                        <LoginImage />
                    </div>
                </nav>
            </header>
        </div>
    );
}
export default HeaderComponent;