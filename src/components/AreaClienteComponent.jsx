import React, { useEffect , useState } from 'react';
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import {cepMask} from '../etc/Mask'
import {separarParagrafoSemMargem,enderecoToString} from '../etc/Funcoes'
import ClienteMenuComponent from './ClienteMenuComponent';
import ClienteService from '../services/ClienteService';
import AreaClienteInicioComponent from '../components/AreaClienteInicioComponent'
import AreaClientePedidosComponent from '../components/AreaClientePedidosComponent'
import AreaClienteDadosComponent from '../components/AreaClienteDadosComponent'
import DetalhesPedidosComponent from './DetalhesPedidosComponent';
import AreaClienteAlterarSenhaComponent from './AlterarSenhaComponente';

function AreaClienteComponent(){
    const [cliente, setCliente] = useState({
        nome: "",
        pedidos: []
    })
    useEffect(() => {
        if(!cliente.id){
            ClienteService.getClienteById( localStorage.getItem( "id" ) ).then( res => {
                setCliente(res.data)
            })
        }
    }, [])
    return( 
        <div className='row ' >
            <div className='col-sm-2'>
                <ClienteMenuComponent/>
            </div>
            <div className='col-sm-8'>
                <Routes>
                    <Route index element = {<AreaClienteInicioComponent cliente={cliente}/>}></Route>
                    <Route path = "pedidos" element = {<AreaClientePedidosComponent pedidos={cliente.pedidos}/>} ></Route>
                    <Route path = "dados" element = {<AreaClienteDadosComponent cliente={cliente}/>} ></Route>
                    <Route path = "detalhePedido/:id" element = {<DetalhesPedidosComponent />} ></Route>
                    <Route path = "alterarSenha" element = {<AreaClienteAlterarSenhaComponent cliente={cliente}/>} ></Route>
                </Routes >
                <Outlet/>
            </div>
        </div>
    )
}
export default AreaClienteComponent