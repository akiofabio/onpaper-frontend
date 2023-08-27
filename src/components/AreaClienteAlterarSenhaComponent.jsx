import React, { useEffect , useState , useRef } from 'react';
import AlterarSenhaComponent from './AlterarSenhaComponente';

function AreaClienteAlterarComponent (props){
    
    return(
        <div>
            <h3>Mudar Senha</h3>
            {AlterarSenhaComponent()}
        </div>
    )
}
export default AreaClienteAlterarComponent