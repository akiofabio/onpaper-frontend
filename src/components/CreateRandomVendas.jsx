import React from 'react';
import PedidoService from '../services/PedidoService';
import ProdutoService from '../services/ProdutoService';
import ItemService from '../services/ItemService';
    

function CreateRandomVendas(){
    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    async function gerarPedidoAleatorio(quantidade){
        var clienteRamdon = {
            score:0,
            tipo:"CLIENTE",
            email: "",
            senha: "",
            nome: "",
            cpf: "",
            genero: "",
            dataNascimento:"",
            
            telefones: [{
                tipo:"",
                ddd:"",
                numero:""
            }],
            
            enderecos: [{
                nome:"",
                cep:"",
                pais:"",
                estado:"",
                cidade:"",
                bairro:"",
                tipoLogradouro:"",
                logradouro:"",
                numero:"",
                tipo:"",
                entrega:true,
                cobranca:true,
                observacao:""
            }],
            cartoes: [{
                nome:"",
                numero:"",
                codigoSeguranca:"",
                validade:"",
                preferencial:true,
                bandeira:{id:""}
            }],
            pedidos: [],
            cupons: [],
            pedidos: [],
            carrinho:{},
        }
        for(var j = 0; j<quantidade; j++){
            var pedidoRandom = {
                itens: [],
                frete: 0,
                meioDePagamentos: [{
                    tipo: "Cartão de Credito",
                    detalhes: "Nome:Anonimo \nNumero:00000 \nVisa",
                    valor: 0,
                    idTipo: 1
                }],
                status: [{
                    status: "Entregue",
                    data: randomDate( new Date(2023,3,1) , new Date() )
                }],
                cep: 11111111,
                endereco: "Nome: Casa \nRua 1, nº 1\n01111-111 - Bairro1 - Cidade1 - SP"
            }
            var nItens = 1 + Math.round(Math.random()*3)
            for(var i = 0; i < nItens; i++){
                var quantidadeRandom = 1 + Math.round(Math.random()*3)
                var porodutoIdRandom = 1 + Math.round(Math.random()*14)
                var produtoRandom
                var itemRandom
                await ProdutoService.getProdutoById(porodutoIdRandom).then(res => {
                    produtoRandom = res.data
                    itemRandom = {
                        idProduto : produtoRandom.id,
                        nomeProduto : produtoRandom.nome,
                        imagemProduto : produtoRandom.imagens,
                        preco : produtoRandom.preco,
                        quantidade : quantidadeRandom,
                        status : pedidoRandom.status,
                    }
                    
                }).catch(error => {
                    alert(error.response.data)
                })
                await ItemService.createItem(itemRandom).then(res =>{
                    pedidoRandom.itens.push(res.data)
                    pedidoRandom.meioDePagamentos[0].valor += ( res.data.preco * res.data.quantidade )
                })
            }
            await PedidoService.createPedido(pedidoRandom).then( res => {
                //alert("res: " + new Date(res.data.status[0].data))
            }).catch(error => {
                alert(JSON.stringify(error.response.data))
            })
        }
    }
    return <button className='btn btn-dark' onClick={() => gerarPedidoAleatorio(100)}>Gerar Pedidos Aleatorios</button>
}
export default CreateRandomVendas