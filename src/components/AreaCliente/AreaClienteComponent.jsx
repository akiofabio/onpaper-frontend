import React, { useEffect , useState } from 'react';
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import ClienteMenuComponent from '../ClienteMenuComponent';
import ClienteService from '../../services/ClienteService';
import AreaClienteInicioComponent from './AreaClienteInicioComponent'
import AreaClientePedidosComponent from './AreaClientePedidosComponent'
import AreaClienteDadosComponent from './AreaClienteDadosComponent'
import DetalhesPedidosComponent from '../DetalhesPedidosComponent';
import AreaClienteAlterarSenhaComponent from './AreaClienteAlterarSenhaComponent';
import AreaClienteCuponsComponet from './AreaClienteCuponsComponet';
import AreaClienteMensagemComponet from './AreaClienteMensagemComponet';
import AreaClienteFaleConoscoComponet from './AreaClienteFaleConoscoComponet';
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
                    <Route path = "cupons" element = {<AreaClienteCuponsComponet cliente={cliente}/>} ></Route>
                    <Route path = "mensagens" element = {<AreaClienteMensagemComponet cliente={cliente}/>} ></Route>
                    <Route path = "contatos" element = {<AreaClienteFaleConoscoComponet cliente={cliente}/>} ></Route>
                </Routes >
                <Outlet/>
            </div>
        </div>
    )
}
export default AreaClienteComponent