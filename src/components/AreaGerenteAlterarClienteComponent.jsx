import React, { useEffect , useState , useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import {cepMask, stringDataMask, dataToInputDataMask , cpfMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString} from '../etc/Funcoes'
import ClienteService from '../services/ClienteService';
import DadosClientesComponent from './DadosClientesComponent';
import CuponsClientesComponent from './CuponsClientesComponent';
function AreaGerenteAlterarClienteComponent (props){
    
    return(
        <div>
            <h3>Alterar Cliente</h3>
            {DadosClientesComponent()}
            {CuponsClientesComponent()}
        </div>
    )
}
export default AreaGerenteAlterarClienteComponent