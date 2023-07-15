import React from 'react';
import PedidoService from '../services/PedidoService';
import ProdutoService from '../services/ProdutoService';
    

function CreateRandomVendas(){
    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    async function gerarPedidoAleatorio(quantidade){
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
                    status: "ENTREGUE",
                    data: randomDate( new Date(2022,1,1) , new Date() )
                }]
            }
            var nItens = 1 + Math.round(Math.random()*3)
            for(var i = 0; i < nItens; i++){
                var quantidadeRandom = 1 + Math.round(Math.random()*3)
                var porodutoIdRandom = 1 + Math.round(Math.random()*14)
                var produtoRandom
                await ProdutoService.getProdutoById(porodutoIdRandom).then(res => {
                    produtoRandom = res.data
                    var itemRandom = {
                        idProduto : produtoRandom.id,
                        nomeProduto : produtoRandom.nome,
                        imagenProduto : produtoRandom.imagens,
                        preco : produtoRandom.preco,
                        quantidade : quantidadeRandom,
                        status : pedidoRandom.status,
                    }
                    pedidoRandom.itens.push(itemRandom)
                    pedidoRandom.meioDePagamentos[0].valor += ( produtoRandom.preco * quantidadeRandom )
                    
                }).catch(error => {
                    alert(error.response.data)
                })
            }
            await PedidoService.createPedido(pedidoRandom).then( res => {
                //alert("res: " + new Date(res.data.status[0].data))
            }).catch(error => {
                alert("Save erro: " + error.response.data)
            })
        }
    }
    return <button className='btn btn-dark' onClick={() => gerarPedidoAleatorio(100)}>Gerar Pedidos Aleatorios</button>
}
export default CreateRandomVendas