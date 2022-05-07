import React from 'react';
import PedidoService from '../services/PedidoService';
import ProdutoService from '../services/ProdutoService';
    

function CreateRandomVendas(){
    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    function gerarPedidoAleatorio(){
        var pedidoRandom = {
            data: randomDate(new Date(2021, 0, 1) , new Date),
            itens: []
        }
        var nItens = 1 + Math.round(Math.random()*3)
        
        for(var i = 0; i < nItens; i++){
            var quantidadeRandom = 1 + Math.round(Math.random()*3)
            var porodutoIdRandom = 1 + Math.round(Math.random()*14)
            var produtoRandom
            ProdutoService.getProdutoById(porodutoIdRandom).then(res => {
                produtoRandom = res.data
                var itemRandom = {
                    produto : produtoRandom,
                    quantidade : quantidadeRandom
                }
                pedidoRandom.itens.push(itemRandom)
                return pedidoRandom
            }).catch(error => {
                alert(error.response.data)
            })
        }
    }

    function gerar(quantidade){
        for(var i = 0; i<quantidade ; i++){
            
            PedidoService.createPedido(gerarPedidoAleatorio()).catch(error => {
                alert("Save erro: " + error.response.data)
            })
        }
    }

    return <button className='btn btn-dark' onClick={() => gerar(1)}>Gerar Pedidos Aleatorios</button>
}
export default CreateRandomVendas