import React from 'react';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import CategoriaService from '../services/CategoriaService';
import FabricanteService from '../services/FabricanteService';
function AutoCreateComponent(){
    const navigate = useNavigate()
    async function save(){
        var categorias = [
            {
                nome: "caderno",
                descricao: "Categoria geral para todos os tipos de cardeno"
            },
            {
                nome: "caneta",
                descricao: "Categoria geral para todos os tipos de caneta"
            },
            {
                nome: "lapis",
                descricao: "Categoria geral para todos os tipos de lapis"
            },
            {
                nome: "lapiseira",
                descricao: "Categoria geral para todos os tipos de lapiseira"
            },
            {
                nome: "post-it",
                descricao: "Categoria geral para todos os tipos de post-it"
            },
            {
                nome: "cola",
                descricao: "Categoria geral para todos os tipos de cola"
            },
            {
                nome: "borracha",
                descricao: "Categoria geral para todos os tipos de borracha"
            }
        ]
        for (const categoria of categorias) {
            await CategoriaService.createCategoria(categoria).catch(error =>{
                alert(error.response.data)
             })
        }

        var fabricantes = [
            {
                nome:"Bic"
            },
            {
                nome:"Faber Castell"
            },
            {
                nome:"CiS"
            }
        ]
        for (const fabricante of fabricantes) {
            await FabricanteService.createFabricante(fabricante).catch(error =>{
                alert(error.response.data)
             })
        }

        var produtos =[
            {
                status: "Disponivel",
                nome: "Produto 1",
                descricao: "Desc do Produto1",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 10.0,
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
                categorias: [{
                    id:1
                }],
                destaque: true,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 2",
                descricao: "Desc do Produto 2",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 11.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto2.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{
                    id:1
                }],
                destaque: true,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 3",
                descricao: "Desc do Produto 3",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 12.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto3.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 1}],
                destaque: true,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 4",
                descricao: "Desc do Produto 4",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 13.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto4.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 2}],
                destaque: true,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 5",
                descricao: "Desc do Produto 5",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 14.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto5.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 2}],
                destaque: true,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 6",
                descricao: "Desc do Produto 6",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 15.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto6.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 3}],
                destaque: false,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 7",
                descricao: "Desc do Produto 7",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 16.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto7.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 3}],
                destaque: false,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 8",
                descricao: "Desc do Produto 8",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 17.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto8.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 4}],
                destaque: false,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 9",
                descricao: "Desc do Produto 9",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 18.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto9.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 4}],
                destaque: false,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 10",
                descricao: "Desc do Produto 10",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 19.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto10.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 5}],
                destaque: false,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 11",
                descricao: "Desc do Produto 11",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 20.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto11.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 5}],
                destaque: false,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 12",
                descricao: "Desc do Produto 12",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 21.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto12.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 6}],
                destaque: false,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 13",
                descricao: "Desc do Produto 13",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 22.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto13.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 6}],
                destaque: false,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 14",
                descricao: "Desc do Produto 14",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 23.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto14.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 7}],
                destaque: false,
                quantidadeBloqueada: 0
            },
            {
                status: "Disponivel",
                nome: "Produto 15",
                descricao: "Desc do Produto 15",
                codigoDeBarra: "11111",
                grupoDePrecificacao: null,
                preco: 24.0,
                custo: 10.0,
                quantidade: 100,
                imagens: "produto15.jpg",
                inativacoes: [],
                ativacoes: [],
                altura: 1.0,
                largura: 1.0,
                comprimento: 1.0,
                peso: 1.0,
                fabricante: null,
                categorias: [{ id: 7}],
                destaque: false,
                quantidadeBloqueada: 0
            }
        ]
    
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
                    tipo: "Promocional",
                    descricao: "Desconto de R$5,00",
                    valor: 5.0
                },
                {
                    tipo: "Promocional",
                    descricao: "Desconto de R$10,00",
                    valor: 10.0
                },
                {
                    tipo: "Troca",
                    descricao: "Troca no valor de R$15,00",
                    valor: 15.0
                },
                {
                    tipo: "Troca",
                    descricao: "Troca no valor de R$10,00",
                    valor: 10.0
                },
                {
                    tipo: "Troca",
                    descricao: "Troca no valor de R$1,00",
                    valor: 1.0
                },
                
            ],
            carrinho: {
            }
        }
    
        var user = {
            email:"admin@mail.com",
            senha: "admin123",
            tipo: "ADMIN"
        }
        localStorage.clear()
        UserService.createUser(user)      
        ClienteService.createCliente(cliente);

        for (const produto of produtos) {
            await ProdutoService.createProduto(produto).catch(error =>{
                alert(error.response.data)
             })
        }
        navigate(0)
    }

    return(
        <button className='btn btn-dark' onClick={() => save()}>Auto Criar</button>
    )
}
export default AutoCreateComponent