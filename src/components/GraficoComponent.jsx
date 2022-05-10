import React, { useEffect , useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarController, BarElement, Title , CategoryScale, LinearScale } from 'chart.js';
import PedidoService from '../services/PedidoService';


ChartJS.register( BarController , BarElement , Title ,  CategoryScale , LinearScale);


function GraficoComponent(){
    const [dataInicio, setDataInicio] = useState("2022-01-01")
    const [dataFinal, setDataFinal] = useState(new Date().toISOString().split('T')[0]) 
    const [dadosGrafico, setDadosGrafico] = useState({
        "labels":[],
        "datasets":[{data:[]}]
    })
    const [quantidadeMostrada, setQuantidadeMostrada] = useState(3)


    function gerarGrafico () {
        var dadosGraficoTemp = {
            labels:[],
            datasets:[{
                data:[]
            }]
        }
        
        PedidoService.getPedidoByDatas( new Date(dataInicio)  , new Date(dataFinal) ).then( res => {
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
            if( quantidadeMostrada < dadosGraficoTemp.labels.length ) {
                dadosGraficoTemp.labels.length = quantidadeMostrada;
                dadosGraficoTemp.datasets[0].data.length = quantidadeMostrada
            }
            setDadosGrafico(dadosGraficoTemp) 
        }).catch(error => {
            alert("not find")
        })
        
    }
    return (
        <div>
            <Bar data={dadosGrafico} />
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
                    <h5>Quantidade Mostrada: </h5>
                </div>
                <div className ="col-auto" >
                    <input type="number" value={quantidadeMostrada}  onChange={(e) => setQuantidadeMostrada(e.target.value) } style={{width:80}}></input>
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