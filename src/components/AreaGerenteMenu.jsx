import React, { useEffect , useState } from 'react';
import { Link, useNavigate , useParams} from 'react-router-dom';
        
function AreaGerenteMenu(){
    
    return(
        <div className='card border-dark' style={{marginTop:10}}>
            <h3 style={{textAlign:"center"}}>Menu</h3>
            <div className='card-body '>
                <div className='row'>
                    <Link to="clientes" name="clientes_menu_button" className='btn btn-outline-dark'>Clientes</Link>
                </div>
                <div className='row'>
                    <Link to="pedidos" name="pedidos_menu_button" className='btn btn-outline-dark'>Pedidos</Link>
                </div>
                <div className='row'>
                    <Link to="produtos" name="produtos_menu_button" className='btn btn-outline-dark'>Produtos</Link>
                </div>
                <div className='row'>
                    <Link to="configuracaoes" name="configuracoes_menu_button" className='btn btn-outline-dark'>Configuracao</Link>
                </div>
            </div>
        </div>
    )
}
export default AreaGerenteMenu