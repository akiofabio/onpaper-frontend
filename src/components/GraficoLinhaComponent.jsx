import React, { useEffect , useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend } from 'chart.js';
import PedidoService from '../services/PedidoService';
import CategoriaService from '../services/CategoriaService';
import {stringDataMask} from '../etc/Mask'
import ProdutoService from '../services/ProdutoService';

 
ChartJS.register( LineElement, PointElement, LinearScale, Title ,CategoryScale, Legend);
function GraficoComponent(){
    const [dataInicio, setDataInicio] = useState("2022-02-01")
    const [dataFinal, setDataFinal] = useState(new Date().toISOString().split('T')[0])
    const [escala, setEscala] = useState("Mes")
    const [dadosGrafico, setDadosGrafico] = useState({
        labels:["dia1","dia2","dia3"],
        datasets:[
            {data:[1,2,3]},
            {data:[3,2,3]}
        ]

    })
    const [tipoDado,setTipoDado] = useState("Quantidade");
    const [options,setOptions] = useState({
        plugins: {
            legend: {
                display: true,
                position: 'right'
            }
        }
    });
    function dynamicColors () {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
     };

    function escalaTempo(data,tipo) {
        var escalaTime = 1
        switch(tipo) {
            case "Ano" : 
                if( new Date( data.getYear(), 1 , 29).getMonth()==  1 ) {
                    escalaTime = (1000*60*60*24*366);
                }
                else{
                    escalaTime = (1000*60*60*24*365);
                } 
                break;
            case "Mes" : 
                switch( data.getMonth()){
                    case 0:
                    case 2:
                    case 4:
                    case 6:
                    case 7:
                    case 9:
                    case 11:
                        escalaTime = (1000*60*60*24*31);
                        break;
                    case 3:
                    case 5:
                    case 8:
                    case 10:
                        escalaTime = (1000*60*60*24*30);
                        break;
                    case 1 :
                        if( new Date( data.getYear(), 1 , 29).getMonth()==  1 ) {
                            escalaTime = (1000*60*60*24*29)
                         } 
                        else{
                            escalaTime = (1000*60*60*24*28)
                        } 
                        break;
                }
                break;
            case "Semana" : 
                escalaTime = (1000*60*60*24*7); 
                break;
            case "Dia" : 
                escalaTime = (1000*60*60*24); 
                break;
        }
        return escalaTime
    }




    async function gerarGrafico () {
        var dataInicioTemp = new Date(stringDataMask(dataInicio))
        var dataFinalTemp = new Date(stringDataMask(dataFinal))
        var dadosGraficoTemp = {
            labels:[],
            datasets:[]
        }
        var produtos
        await ProdutoService.getProdutos().then( resProdutos => {
            produtos = resProdutos.data
        } )
        var Categorias
        await CategoriaService.getCategorias().then( resCategorias  => {
            Categorias = resCategorias.data
        })
        Categorias.forEach( categoria => {
            var dado = {
                label: categoria.nome,
                data: [], 
                ids: [],
                borderColor: dynamicColors()
            }
            produtos.forEach( produto => {
                produto.categorias.forEach( categoriaProduto => {
                    if( categoriaProduto.nome == categoria.nome) {
                        dado.ids.push( produto.id )
                    } 
                }) 
            }) 
            dadosGraficoTemp.datasets.push(dado)
        }) 
        var pedidos
        await PedidoService.getPedidoByDatas( dataInicioTemp , dataFinalTemp  ).then( resPedido  => {
            pedidos = resPedido.data
        } )
        var escalaTemp = escalaTempo( dataInicioTemp, escala ) 
        var dataTemp = dataInicioTemp
        for( var i = 0; dataTemp.getTime() < dataFinalTemp.getTime() ; i++ ) {
            dadosGraficoTemp.datasets.forEach( dataset => {
                dataset.data[i]=0
            })
            pedidos.forEach( pedido => {
                dadosGraficoTemp.datasets.forEach( dataset => {
                    var statusPedido
                    pedido.status.forEach( st => {
                        if( st.status =  "Concluido"){
                            statusPedido = st
                        }
                    })
                    //alert( new Date(statusPedido.data) +" = " + dataTemp )
                    if( ( new Date(statusPedido.data).getTime()>=dataTemp.getTime() ) && ( new Date(statusPedido.data).getTime()<( dataTemp.getTime() + escalaTemp )) ){
                        
                        pedido.itens.forEach( item => {
                            //alert(item.idProduto)
                            if(dataset.ids.includes( item.idProduto )){
                                if(tipoDado == "Quantidade"){
                                    dataset.data[i] += item.quantidade
                                }
                                else if (tipoDado == "Valor"){
                                    dataset.data[i] += item.preco
                                }
                            }
                        })
                    }
                })
            })
            dadosGraficoTemp.labels.push(dataTemp.getDate() + "/" + (dataTemp.getMonth()+1))
            dataTemp = new Date( dataTemp.getTime()  + escalaTemp)
            escalaTemp = escalaTempo( dataTemp , escala)
        }
        dadosGraficoTemp.datasets.forEach( dataset =>{
            delete dataset.ids
        })
        setDadosGrafico({
            labels: dadosGraficoTemp.labels,
            datasets: dadosGraficoTemp.datasets
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
                        <option value="Dia">Dia</option>
                        <option value="Semana">Semana</option>
                        <option value="Mes">Mes</option>
                        <option value="Ano">Ano</option>
                    </select>
                </div>
                <div className ="col-auto" >
                    <h5>Por: </h5>
                </div>
                <div className ="col-auto" >
                    <select  value={tipoDado}  onChange={(e) => setTipoDado(e.target.value) } >
                        <option value="Quantidade">Quantidade</option>
                        <option value="Valor">Valor</option>
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