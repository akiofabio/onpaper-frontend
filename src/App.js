import logo from './logo.svg';
import './App.css';
import React from 'react'
import {BrowserRouter as Router, Navigate, Route, Routes,useNavigate}from 'react-router-dom'
import ListClienteComponents from './components/ListClienteComponents'
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import CadastrarClienteComponent from './components/CadastrarClienteComponent';
import HomeComponent from './components/HomeComponent';
import ProdutoAutoCreate from './components/ProdutoAutoCreate';
import CarrinhoComponet from './components/CarrinhoComponent';
import LoginComponent from './components/LoginComponent';
import FianlizarCompraComponent from './components/FianlizarCompraComponent';
import AreaClienteComponent from './components/AreaClienteComponent';
import AreaClienteDadosComponent from './components/AreaClienteDadosComponent';
import PesquisarComponent from './components/PesquisarComponet';
import AreaGerenteComponent from './components/AreaGerenteComponent';
import DetalheProdutoComponent from './components/DetalheProdutoComponent';
import FianlizarCompraComponent2 from './components/FianlizarCompraComponent2';
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
                        <Route path = "/finalizar_compra" element = {<FianlizarCompraComponent2/>}></Route>
                        <Route path = "/areaCliente/*" element = {<AreaClienteComponent/>}></Route>
                        <Route path = "/clientes" element = {<ListClienteComponents/>}></Route>
                        <Route path = "/cadastrar_cliente" element = {<CadastrarClienteComponent/>}></Route>
                        <Route path = "/auto" element = {<ProdutoAutoCreate/>}></Route>
                        <Route path = "/areaClienteDados" element = {<AreaClienteDadosComponent/>}></Route>
                        <Route path = "/areaGerente/*" element = {<AreaGerenteComponent/>}></Route>
                        <Route path = "/pesquisar/:pesquisa" element = {<PesquisarComponent/>}></Route>
                        <Route path = "/pesquisar/" element = {<PesquisarComponent/>}></Route>
                        <Route path = "/produto/:id" element = {<DetalheProdutoComponent/>}></Route>
                    
                    </Routes >
                    </div>
                <FooterComponent />
        </Router>
        </div>
    );
}

export default App;
