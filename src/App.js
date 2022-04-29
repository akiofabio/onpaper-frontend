import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Navigate, Route, Routes,useNavigate}from 'react-router-dom'
import ListClienteComponents from './components/ListClienteComponents'
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import CreateClienteComponet from './components/CreateClienteComponet';
import UpdateClienteComponent from './components/UpdateClienteComponent';
import HomeComponent from './components/HomeComponent';
import ProdutoAutoCreate from './components/ProdutoAutoCreate';
import CarrinhoComponet from './components/CarrinhoComponent';
import LoginComponent from './components/LoginComponent';
import FianlizarCompraComponent from './components/FianlizarCompraComponent';

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

                        <Route path = "/clientes" element = {<ListClienteComponents/>}></Route>
                        <Route path = "/cadastrar-cliente" element = {<CreateClienteComponet/>}></Route>
                        <Route path = "/update-cliente/:id" element = {<UpdateClienteComponent/>}></Route>
                        <Route path = "/auto" element = {<ProdutoAutoCreate/>}></Route>
                    </Routes >
                    </div>
                <FooterComponent />
        </Router>
        </div>
    );
}

export default App;
