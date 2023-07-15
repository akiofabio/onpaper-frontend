import React, { useEffect , useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend } from 'chart.js';
import PedidoService from '../services/PedidoService';
import CategoriaService from '../services/CategoriaService';
import {stringDataMask} from '../etc/Mask'
import ProdutoService from '../services/ProdutoService';
import ItemService from '../services/ItemService';
import {dateToUTC} from '../etc/Funcoes'
 
ChartJS.register( LineElement, PointElement, LinearScale, Title ,CategoryScale, Legend);
function GraficoComponent_v2(){
    const [dataInicio, setDataInicio] = useState(addMes(new Date()).toISOString().split('T')[0])
    const [dataFinal, setDataFinal] = useState(new Date().toISOString().split('T')[0])
    const [escala, setEscala] = useState("MES")
    const [dadosGrafico, setDadosGrafico] = useState({
        labels:[],
        datasets:[]
    })
    const [tipoDado,setTipoDado] = useState("QUANTIDADE");
    const [options,setOptions] = useState({
        plugins: {
            legend: {
                display: true,
                position: 'right'
            }
        }
    });

    useEffect(() => {
        gerarGrafico ()
    }, [])
    
    function addMes(data){
        data.setMonth(data.getMonth()-6)
        return data
    }
    function dynamicColors () {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    };
    

    async function gerarGrafico () {
        alert( 'TESTE' )
        var dataInicioTemp = new Date(dataInicio)
        var dataFinalTemp = new Date(dataFinal)
        dataFinalTemp.setDate(dataFinalTemp.getDate() + 1)
        var datasets = []
        
        var dados
        await ItemService.getDados( dateToUTC(dataInicioTemp), dateToUTC(dataFinalTemp), tipoDado, escala ).then( res => {
            dados = res.data
            
        } )
        for(var i=0; i<dados.categoriaLabel.length; i++){
            var dataset = {
                label: dados.categoriaLabel[i],
                data: dados.dados[i],
                borderColor: dynamicColors(),
                tension:0.3
            }
            datasets.push(dataset)
        }
        setDadosGrafico({
            labels: dados.dataLebel,
            datasets: datasets
        })
    }
    return (
        <div>
            <Line data={dadosGrafico} options ={options} />
            <div className ="row">
                <div className ="col-auto" >
                    <h5>Data de Inicio: </h5>
                </div>
                <div className ="col-auto" >
                    <input type="date" value={dataInicio} onChange={ (e) => setDataInicio(e.target.value) } ></input>
                </div>
                <div className ="col-auto" >
                    <h5>Data de Final: </h5>
                </div>
                <div className ="col-auto" >
                    <input type="date" value={dataFinal}  onChange={(e) => setDataFinal(e.target.value) } ></input>
                </div>
                <div className ="col-auto" >
                    <h5>Escala: </h5>
                </div>
                <div className ="col-auto" >
                    <select  value={escala}  onChange={(e) => setEscala(e.target.value) } >
                        <option value="DIA">Dia</option>
                        <option value="SEMANA">Semana</option>
                        <option value="MES">Mes</option>
                        <option value="ANO">Ano</option>
                    </select>
                </div>
                <div className ="col-auto" >
                    <h5>Por: </h5>
                </div>
                <div className ="col-auto" >
                    <select  value={tipoDado}  onChange={(e) => setTipoDado(e.target.value) } >
                        <option value="QUANTIDADE">Quantidade</option>
                        <option value="VALOR">Valor</option>
                    </select>
                </div>
            </div>
            <div className ="row justify-content-md-center" >
                <div className ="col-auto" >
                    <button className ="btn btn-dark" onClick={() => gerarGrafico() } >Atualizar Gráfico</button>
                </div>
            </div>
        </div>
    );
}
export default GraficoComponent_v2