import axios from 'axios'

const PRODUTO_API_BASE_URL = "http://localhost:8080/api/v1/produto";
class ProdutoService{

    getProdutos(){
        return axios.get( PRODUTO_API_BASE_URL );
    }
    createProduto( produto ){
        return axios.post( PRODUTO_API_BASE_URL , produto );
    }
    getProdutoById( produtoId ){
        return axios.get( PRODUTO_API_BASE_URL + "/" + produtoId );
    }
}

export default new ProdutoService()