import React, { useState } from 'react';

function LoginImage (props){
    if( !props.isLogged ){
        return (
            <a href="http://localhost:3000/login" className='nav-item'>
                <img src='imagens/icones/login.png'></img>
            </a>
        );
    }
    else{
        return (
            <a href="http://localhost:3000/login" className='nav-item'>
                Teste
            </a>
        );
    }

}

function HeaderComponent (){
    const [isLogged,setIsLogged] = useState();
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
                        <LoginImage isLogged={isLogged}/>
                    </div>
                </nav>
            </header>
        </div>
    );
}
export default HeaderComponent;