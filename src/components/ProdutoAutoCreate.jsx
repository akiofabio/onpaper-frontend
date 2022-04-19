import React, { Component, useEffect , useState } from 'react';
import ProdutoService from '../services/ProdutoService';

function createProduto() {
    let produtoTeste = {
        status: "Disponivel",
        nome:"Produto 1",
        descricao: "Desc do Produto1",
        codigoDeBarra:11111,
        grupoDePrecificacao:{id:1},
        preco:11,
        custo:10 ,
        quantidade:100,
        imagens:"",
        inativacoes:[],
        ativacoes:[],
        altura:1,
        largura:1,
        comprimento:1,
        peso:1,
        fabricante:null,
        categoria:null,
        destaque:true
    }
    console.log('produto => ' + JSON.stringify(produtoTeste))
    ProdutoService.createProdutos(produtoTeste)
}

function ProdutoAutoCreate(){
    const [produtos,setProdutos]=useState([]);
    const [categoria,setCategoria]=useState();
    const [grupoDePrecificacao,setGrupoDePrecificacao]=useState();
    const [fabricante,setfabricante]=useState();

    
    useEffect(() => {
        console.log( window.location.origin + "/src/imagens/cardeno1.jpg")
       
        ProdutoService.getProdutos().then((res) => {
            setProdutos(res.data);
        })
        
    }, []);
    
    return(
        <div>
            <button onClick={createProduto()}>Create</button>
            {produtos.map(
                produto => 
                <div key = {produto.id} style={{ border: "1px black solid" }}>
                    <p>Nome: {produto.nome}</p>
                    <p>Descrição: {produto.descricao}</p>
                </div>
            )}
            
        </div>
        
    );
    
}
export default ProdutoAutoCreate;