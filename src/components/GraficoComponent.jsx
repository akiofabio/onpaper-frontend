import React, { useEffect , useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarController, BarElement, Title , CategoryScale, LinearScale } from 'chart.js';
import PedidoService from '../services/PedidoService';


ChartJS.register( BarController , BarElement , Title ,  CategoryScale , LinearScale);

const [dataIncio, setDataInicio] = useState("20022/04/05") 
const [dataFinal, setDataFinal] = useState("20022/04/05") 
const [dadosGrafico, setDadosGrafico] = useState([])
const [quantidadeMostrada, setQuantidadeMostrada] = useState(10)

function gerarGrafico () {
    var dados = [] 
    PedidoService.getByDatas( dataIncio , dataFinal ).them( res => {
        res.data.forEach(pedido => {
            pedido.itens.forEach(item => {
                var encontrado = false
                dados.forEach(dado => {
                    if( dado.nome == item.produto.nome ) {
                        dado = { ...dado , quantidade: dado.quantidade + item.quantidade}
                        encontrado = true
                    }
                })
                if( !encontrado ) {
                    dados.push({
                        produto: item.produto.nome, 
                        quantidade: item.quantidade
                    }) 
                }
            })
        })
    })
    dados.sort( function(a, b) {return  a.quantidade - b.quantidade }) 
    if( quantidadeMostrada < dados.length ) {
        dados.length = quantidadeMostrada;
    }
    setDadosGrafico(dados) 
}
var dataChart = {
    labels: ['Jun', 'Jul', 'Aug'],
    datasets: [
      {
        id: 1,
        label: '',
        data: [5],
      },
      {
        id: 2,
        label: '',
        data: [3],
      },
    ],
  }
function GraficoComponent(){
    return (
      <div>
        <Bar data={dataChart} />
        <div className ="row">
              <div className ="col" >
                  <input type="date" value={dataIncio} onChange={ (e) => setDataInicio(e.target.value) } ></input>
              </div>
              <div className ="col" >
                  <input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value) } ></input>
              </div>
              <div className ="col" >
                  <button className ="btn btn-dark" onClick={() => gerarGrafico() } ></button>
              </div>
          </div>
      </div>
    );
}
export default GraficoComponent