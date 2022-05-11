import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import {cepMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString} from '../etc/Funcoes'
import { defaults } from 'chart.js';

function AreaCliente(){
    const [cliente, setCliente] = useState()
    
    return( 
        <div className='row'>
            <div className='col'>
                <div className=''></div>
            </div>
        </div>
    )
}
export default AreaCliente