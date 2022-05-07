import React , { useState } from 'react';
import {Bar} from 'react-chartjs-2';
import PedidoService from '../services/PedidoService';

function GraficoProdutoMaisVendido(){
    const [dataIncio, setDataInicio] = useState() 
    const [dataFinal, setDataFinal] = useState() 
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
    const state = {
        labels: ['January', 'February', 'March',
                 'April', 'May'],
        datasets: [
          {
            label: 'Rainfall',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [65, 59, 80, 81, 56]
          }
        ]
      }
    return (
        <div> 
            <Bar data={state}
          options={{
            title:{
              display:true,
              text:'Average Rainfall per month',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
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
    ) ;
}

export default GraficoProdutoMaisVendido