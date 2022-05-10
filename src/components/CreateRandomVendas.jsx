import React from 'react';
import PedidoService from '../services/PedidoService';
import ProdutoService from '../services/ProdutoService';
    

function CreateRandomVendas(){
    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    function gerarPedidoAleatorio(quantidade){
        for(var j = 0; j<quantidade; j++){
            var total = 0
            var pedidoRandom = {
                itens: [],
                frete: 0,
                meioDePagamentos: [{
                    tipo: "Cartão de Credito",
                    detalhes: "Nome:Anonimo \nNumero:00000 \nVisa",
                    valor: 0
                }],
                status: [{
                    status: "Concluido",
                    data: randomDate( new Date(2022,1,1) , new Date() )
                }]
            }
            var nItens = 1 + Math.round(Math.random()*3)
            alert(pedidoRandom.status[0].data)
            for(var i = 0; i < nItens; i++){
                var quantidadeRandom = 1 + Math.round(Math.random()*3)
                var porodutoIdRandom = 1 + Math.round(Math.random()*14)
                var produtoRandom
                ProdutoService.getProdutoById(porodutoIdRandom).then(res => {
                    produtoRandom = res.data
                    var itemRandom = {
                        idPoduto : produtoRandom.id,
                        nomeProduto : produtoRandom.nome,
                        imagenProduto : produtoRandom.imagens,
                        preco : produtoRandom.preco,
                        quantidade : quantidadeRandom,

                    }
                    pedidoRandom.itens.push(itemRandom)
                    pedidoRandom.meioDePagamentos[0].valor += ( produtoRandom.preco * quantidadeRandom )
                    PedidoService.createPedido(pedidoRandom).catch(error => {
                        alert("Save erro: " + error.response.data)
                    })
                }).catch(error => {
                    alert(error.response.data)
                })
            }
        }
    }
    return <button className='btn btn-dark' onClick={() => gerarPedidoAleatorio(1)}>Gerar Pedidos Aleatorios</button>
}
export default CreateRandomVendas