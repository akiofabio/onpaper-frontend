import React, { useEffect , useState } from 'react';
import { Link, useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import {cepMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString} from '../etc/Funcoes'
import { defaults } from 'chart.js';

function ClienteMenuComponent(){
    return (

        <div className='card border-dark' style={{marginTop:10}}>
            <h3 style={{textAlign:"center"}}>Menu</h3>
            <div className='card-body '>
                <div className='row'>
                    <Link to="dados" className='btn btn-outline-dark'>Meus Dados</Link>
                </div>
                <div className='row'>
                    <Link to="pedidos" className='btn btn-outline-dark'>Meus Pedidos</Link>
                </div>
                <div className='row'>
                    <Link to="mensagens" className='btn btn-outline-dark'>Mensagens</Link>
                </div>
                <div className='row'>
                    <Link to="alterarSenha"className='btn btn-outline-dark'>Alterar Senha</Link>
                </div>
                <div className='row'>
                    <Link to="pedidos"className='btn btn-outline-dark'>Meus Cupons</Link>
                </div>
                <div className='row'>
                    <Link to="pedidos" className='btn btn-outline-dark'>Fale Conosco</Link>
                </div>
            </div>
        </div>
    )
}
export default ClienteMenuComponent