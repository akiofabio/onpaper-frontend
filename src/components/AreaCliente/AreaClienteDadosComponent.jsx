import React, { useEffect , useState , useRef } from 'react';
import DadosClientesComponent from '../DadosClientesComponent';

function AreaClienteDadosComponent (props){
    
    return(
        <div>
            <h3>Meus Dados</h3>
            {DadosClientesComponent()}
        </div>
    )
}
export default AreaClienteDadosComponent