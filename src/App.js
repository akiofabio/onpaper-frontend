import logo from './logo.svg';
import './App.css';
import React from 'react'
import {BrowserRouter as Router, Navigate, Route, Routes,useNavigate}from 'react-router-dom'
import ListClienteComponents from './components/ListClienteComponents'
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import CreateClienteComponet from './components/CreateClienteComponet';
import HomeComponent from './components/HomeComponent';
import ProdutoAutoCreate from './components/ProdutoAutoCreate';
import CarrinhoComponet from './components/CarrinhoComponent';
import LoginComponent from './components/LoginComponent';
import FianlizarCompraComponent from './components/FianlizarCompraComponent';
import AreaClienteComponent from './components/AreaClienteComponent';

function App() {
    return (
        <div>
        <Router>
                <HeaderComponent />
                    <div className="container">
                    <Routes>
                        <Route path = "/" element = {<HomeComponent/>}></Route>
                        <Route path = "/carrinho" element = {<CarrinhoComponet/>}></Route>
                        <Route path = "/login" element = {<LoginComponent/>}></Route>
                        <Route path = "/finalizar_compra" element = {<FianlizarCompraComponent/>}></Route>
                        <Route path = "/areaCliente/*" element = {<AreaClienteComponent/>}></Route>
                        <Route path = "/clientes" element = {<ListClienteComponents/>}></Route>
                        <Route path = "/cadastrar-cliente" element = {<CreateClienteComponet/>}></Route>
                        <Route path = "/auto" element = {<ProdutoAutoCreate/>}></Route>
                    </Routes >
                    </div>
                <FooterComponent />
        </Router>
        </div>
    );
}

export default App;
