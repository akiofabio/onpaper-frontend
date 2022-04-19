import React, { Component, useEffect , useState } from 'react';
import ProdutoService from '../services/ProdutoService';
import {useImage} from 'react-image'

function ImagemExist(){
    

    
        return(
        <div>
                <h1>Teste</h1>
                <img src={'imagens/produtos/semImagem'}></img>
        </div>
        )
    
}
function HomeComponent() {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        ProdutoService.getProdutos().then((res) => {
            setProdutos(res.data);
        })
    }, []);
        
    const handleErro = (e) => {
        
    }
    return (
        <div>
            <h1>Onpaper, a melhor papelaria online de LES deste 2022</h1>
            &nbsp;
            
            
            <div style={{marginTop:100}}>
                <h3>Destaques:</h3>
                <div>
                    {produtos.map(
                        produto => 
                        <div key = {produto.id} style={{ border: "1px black solid" }}>
                            <div>
                                <img src={'imagens/produtos/' + produto.imagens} alt="Imagem do Produto" width='100' height="auto"></img>
                            </div>
                            <p>Nome: {produto.nome}</p>
                            <p>Descrição: {produto.descricao}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default HomeComponent;