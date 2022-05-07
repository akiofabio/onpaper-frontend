import React, { useEffect , useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarController, BarElement, Title , CategoryScale, LinearScale } from 'chart.js';
import PedidoService from '../services/PedidoService';


ChartJS.register( BarController , BarElement , Title ,  CategoryScale , LinearScale);


function GraficoComponent(){
    const [dataInicio, setDataInicio] = useState(new Date(2022,5,1))
    const [dataFinal, setDataFinal] = useState(Date.now()) 
    const [dadosGrafico, setDadosGrafico] = useState({
        label:["tese","teste"],
        datasets:[{
            data:[2,3]
        }]
    })
    const [quantidadeMostrada, setQuantidadeMostrada] = useState(10)


    function gerarGrafico () {
        var dadosGraficoTemp = {
            label:[],
            datasets:[{
                data:[]
            }]
        }
        
        PedidoService.getPedidoByDatas( new Date(dataInicio)  , new Date(dataFinal) ).then( res => {
            alert(JSON.stringify(res.data))
            res.data.forEach(pedido => {

                pedido.itens.forEach(item => {
                    if(dadosGraficoTemp.label.find(item.produto.nome)){
                        dadosGraficoTemp.datasets[0].data[dadosGraficoTemp.label.findIndex(item.produto.nome)] += item.quantidade
                    }
                    else {
                        dadosGraficoTemp.label.push(item.produto.nome)
                        dadosGraficoTemp.datasets[0].data.push(item.quantidade)
                    }
                })
            })
            for(var i=0 ; i < dadosGraficoTemp.label.length;i++){
                for(var j=i+1 ; j < dadosGraficoTemp.label.length;j++){
                    if(dadosGraficoTemp.datasets[0].data[i] > dadosGraficoTemp.datasets[0].data[j] ){
                        var temp = dadosGraficoTemp.datasets[0].data[i]
                        dadosGraficoTemp.datasets[0].data[i] = dadosGraficoTemp.datasets[0].data[j]
                        dadosGraficoTemp.datasets[0].data[j] = temp
                    }
                } 
            } 
            if( quantidadeMostrada < dadosGraficoTemp.label.length ) {
                dadosGraficoTemp.label.length = quantidadeMostrada;
            }
            alert(JSON.stringify(dadosGraficoTemp))
            setDadosGrafico(dadosGraficoTemp) 
        }).catch(error => {
            alert("not find")
        })
        
    }
    return (
        <div>
            <Bar data={dadosGrafico} />
            <div className ="row">
                <div className ="col" >
                    <input type="date" value={dataInicio} onChange={ (e) => setDataInicio(e.target.value) } ></input>
                </div>
                <div className ="col" >
                    <input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value) } ></input>
                </div>
                <div className ="col" >
                    <button className ="btn btn-dark" onClick={() => gerarGrafico() } >Alterar</button>
                </div>
            </div>
        </div>
    );
}
export default GraficoComponent