import React, { useEffect , useState , useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import {cepMask, stringDataMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString} from '../etc/Funcoes'
import ClienteMenuComponent from './ClienteMenuComponent';
import ClienteService from '../services/ClienteService';
import AreaClienteInicioComponent from './AreaClienteInicioComponent'
import AreaClientePedidosComponent from './AreaClientePedidosComponent'
import DadosClientesComponent from './DadosClientesComponent';

function AreaClienteDadosComponent (props){
    
    return(
        <div>
            <h3>Meus Dados</h3>
            {DadosClientesComponent()}
        </div>
    )
}
export default AreaClienteDadosComponent