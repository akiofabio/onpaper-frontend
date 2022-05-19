import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import {cepMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString} from '../etc/Funcoes'
import ClienteMenuComponent from './ClienteMenuComponent';

function AreaClienteComponent(){
    const [cliente, setCliente] = useState()
    
    return( 
        <div className='row ' >
            <div className='col-sm-2'>
                <ClienteMenuComponent/>
            </div>
        </div>
    )
}
export default AreaClienteComponent