import React, { useEffect , useState } from 'react';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import { useNavigate } from 'react-router-dom';

function AutoCreateComponet(){
    const navigate = useNavigate()
    var produto = {
        nome: "Produto1",
        status: "Disponivel",
        nome: "Produto 1",
        descricao: "Desc do Produto1",
        codigoDeBarra: "11111",
        grupoDePrecificacao: null,
        preco: 11.0,
        custo: 10.0,
        quantidade: 100,
        imagens: "caderno1.jpg",
        inativacoes: [],
        ativacoes: [],
        altura: 1.0,
        largura: 1.0,
        comprimento: 1.0,
        peso: 1.0,
        fabricante: null,
        categoria: null,
        destaque: true,
        quantidadeBloqueada: 0
    }

    var cliente ={
        email: "cliente1@mail.com",
        senha: "senha1",
        tipo: "CLIENTE",
        status: "ATIVO",
        nome: "Cliente 1",
        cpf: "11111111111",
        genero: "Masculino",
        dataNascimento: "2001-01-01T00:00:00.000+00:00",
        score: "0",
        telefones: [
            {
                tipo: "FIXO",
                ddd: "011",
                numero: "1111111"
            },
            {
                tipo: "CELULAR",
                ddd: "011",
                numero: "222222222"
            }
        ],
        enderecos: [
            {
                nome: "Casa",
                cep: "01111111",
                estado: "SP",
                cidade: "Cidade1",
                bairro: "Bairro1",
                tipoLogradouro: "Rua",
                logradouro: "1",
                numero: "1",
                observacao: null
            },
            {
                nome: "Trabalho",
                cep: "02222222",
                estado: "SP",
                cidade: "Cidade2",
                bairro: "Bairro2",
                tipoLogradouro: "Rua",
                logradouro: "2",
                numero: "2",
                observacao: null
            }
        ],
        cartoes: [
            {
                nome: "Cartao1",
                numero: "1111111",
                codigoSeguranca: "1111",
                validade: null,
                preferencial: false,
                bandeira:"Visa"
            },
            {
                nome: "Cartao2",
                numero: "2222222",
                codigoSeguranca: "222",
                validade: null,
                preferencial: true,
                bandeira:"Master Card"
            }
        ],
        pedidos: [],
        cupons: [
            {
                tipo: "PROMOCIONAL",
                descricao: "Desconto na de R$5,00",
                valor: 5.0
            }
        ],
        carrinho: {
        }
    }
    function save(){
        localStorage.clear()        
        ClienteService.createCliente(cliente);
        ProdutoService.createProduto(produto);
        navigate(0)
    }
    return(
        <button className='btn btn-dark' onClick={() => save()}>Auto Criar</button>
    )
}
export default AutoCreateComponet