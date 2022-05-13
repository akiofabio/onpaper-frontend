import React, { useEffect , useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale} from 'chart.js';
import PedidoService from '../services/PedidoService';
import CategoriaService from '../services/CategoriaService';
import {stringDataMask} from '../etc/Mask'
import ProdutoService from '../services/ProdutoService';


ChartJS.register( LineElement, PointElement, LinearScale, Title ,CategoryScale);
function GraficoComponent(){
    const [dataInicio, setDataInicio] = useState("2022-04-01")
    const [dataFinal, setDataFinal] = useState(new Date().toISOString().split('T')[0])
    const [escala, setEscala] = useState("Dia")
    const [dadosGrafico, setDadosGrafico] = useState({
        "labels":["dia1","dia2","dia3"],
        "datasets":[
            {data:[1,2,3]},
            {data:[3,2,3]}
        ]

    })
    const [intervalo,setIntervalo] = useState("Dia");
    function gerarGrafico () {
        var dataInicioTemp = new Date(stringDataMask(dataInicio))
        var dataFinalTemp = new Date(stringDataMask(dataFinal))
        var dadosGraficoTemp = {
            labels:[],
            datasets:[{
                data:[]
            }]
        }
        
        for(var i=0; i < (dataFinalTemp.getTime() - dataInicioTemp.getTime())/( 1000 * 60 * 60 * 24); i++ ){
            var dataTemp = new Date(dataInicioTemp.getTime() + (i * 1000 * 60 * 60 * 24))
            //dadosGraficoTemp.labels.push(dataTemp.getDate() + "/" + (dataTemp.getMonth()+1))            
        }
        var categorias =[]
        setDadosGrafico(dadosGraficoTemp)
        ProdutoService.getProdutos().then( resProduto => {
            CategoriaService.getCategorias().then( resCategoria => {
                resCategoria.data.forEach( categoria => {
                    var categoriaTemp = {
                        label: categoria.nome,
                        value:[],
                        ids: []
                    }

                    resProduto.data.filter(produto => produto.categoria.nome === categoria.nome).forEach( produto2 => {
                       categoriaTemp.ids.push(produto2.id)
                    })
                })
            })
        })
        /* PedidoService.getPedidoByDatas( dataInicioTemp  , dataFinalTemp ).then( res => {
            
            res.data.forEach(pedido => {
                pedido.itens.forEach(item => {
                    if(dadosGraficoTemp.labels.includes(item.nomeProduto)){
                        dadosGraficoTemp.datasets[0].data[dadosGraficoTemp.labels.indexOf(item.nomeProduto)] += item.quantidade
                    }
                    else {
                        dadosGraficoTemp.labels.push(item.nomeProduto)
                        dadosGraficoTemp.datasets[0].data.push(item.quantidade)
                    }
                    
                })
            })
            for(var i=0 ; i < dadosGraficoTemp.labels.length;i++){
                for(var j=i+1 ; j < dadosGraficoTemp.labels.length;j++){
                    if(dadosGraficoTemp.datasets[0].data[i] < dadosGraficoTemp.datasets[0].data[j] ){
                        var temp = dadosGraficoTemp.datasets[0].data[i]
                        dadosGraficoTemp.datasets[0].data[i] = dadosGraficoTemp.datasets[0].data[j]
                        dadosGraficoTemp.datasets[0].data[j] = temp

                        temp = dadosGraficoTemp.labels[i]
                        dadosGraficoTemp.labels[i] = dadosGraficoTemp.labels[j]
                        dadosGraficoTemp.labels[j] = temp
                    }
                } 
            }
            setDadosGrafico(dadosGraficoTemp) 
        }).catch(error => {
            alert("not find")
        }) */
        
    }
    return (
        <div>
            <Line data={dadosGrafico} />
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
                        <option value="Dia">Dia</option>
                        <option value="Semana">Semana</option>
                        <option value="Mes">Mes</option>
                        <option value="Ano">Ano</option>
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
export default GraficoComponent