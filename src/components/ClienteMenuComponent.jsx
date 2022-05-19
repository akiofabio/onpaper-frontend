import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import {cepMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString} from '../etc/Funcoes'
import { defaults } from 'chart.js';

function ClienteMenuComponent(){
    return (

        <div className='card'>
            <h3 style={{textAlign:"center"}}>Menu</h3>
            <div className='card-body'>
                <div className='row'>
                    <button className='btn btn-outline-dark'>Meus Dados</button>
                </div>
                <div className='row'>
                    <button className='btn btn-outline-dark'>Meus Pedidos</button>
                </div>
                <div className='row'>
                    <button className='btn btn-outline-dark'>Mensgens</button>
                </div>
                <div className='row'>
                    <button className='btn btn-outline-dark'>Alterar Senha</button>
                </div>
                <div className='row'>
                    <button className='btn btn-outline-dark'>Meus Cupons</button>
                </div>
                <div className='row'>
                    <button className='btn btn-outline-dark'>Fale Conosco</button>
                </div>
            </div>
        </div>
    )
}
export default ClienteMenuComponent