import React, { useEffect , useState , useRef} from 'react';
import { moedaRealMask , stringDataMask } from "../etc/Mask";
import AreaGerenteMenu from "./AreaGerenteMenu";
import { useNavigate , useParams , Routes , Route, Outlet} from 'react-router-dom';
import GraficoLinhaComponent_v2 from "./GraficoLinhaComponent_v2"

function AreaGerenteInicioComponent(){

    return(
        <div className='row ' >
            <h1>Produtos mais vendidos: </h1>
            <GraficoLinhaComponent_v2/>
        </div>
    )
}
export default AreaGerenteInicioComponent