import React, { useEffect, useState } from "react";
import { moedaRealMask , stringDataMask } from "../etc/Mask";
import AreaGerenteMenu from "./AreaGerenteMenu";
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';

import AreaGerenteClientesComponent from "./AreaGerenteClientesComponent";
import AreaGerenteConfiguracaoComponent from "./AreaGerenteConfiguracaoComponent";
import AreaGerentePedidosComponent from "./AreaGerentePedidosComponent";
import AreaGerenteProdutosComponent from "./AreaGerenteProdutosComponent";
import AreaGerenteInicioComponent from "./AreaGerenteInicioComponent";
import AreaGerenteAlterarClienteComponent from "./AreaGerenteAlterarClienteComponent";
import CadastrarClienteComponent from "./CadastrarClienteComponent"
function AreaGerenteComponent(){
    return(
        <div className='row '>
            <div className='col-sm-2'>
                <AreaGerenteMenu/>
            </div>
            <div className='col-sm-8'>
                <Routes>
                    <Route index element = {<AreaGerenteInicioComponent/>}></Route>
                    <Route path = "clientes" element = {<AreaGerenteClientesComponent/>} ></Route>
                    <Route path = "pedidos" element = {<AreaGerentePedidosComponent/>} ></Route>
                    <Route path = "produtos" element = {<AreaGerenteProdutosComponent/>} ></Route>
                    <Route path = "configuracao" element = {<AreaGerenteConfiguracaoComponent/>} ></Route>
                    <Route path = "editarCliente/:id" element = {<AreaGerenteAlterarClienteComponent/>} ></Route>
                    <Route path = "cadastrarCliente/" element = {<CadastrarClienteComponent/>} ></Route>
                </Routes>
                <Outlet/>
            </div>
        </div>
    )
}
export default AreaGerenteComponent