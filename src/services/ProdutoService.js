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
    getProdutoByNome( pesquisa , catergorias , fabricantes ){
        var params = new URLSearchParams();
        if(pesquisa!==undefined)
            params.append("pes",pesquisa)
        catergorias.map(catergoria => params.append("cat", catergoria.nome))
        fabricantes.map(fabricante => params.append("fab",fabricante.nome))
        
        var request = {
            params: params
        };
        alert(request.params)
        alert(PRODUTO_API_BASE_URL + "/pesquisa",request)
        return axios.get( PRODUTO_API_BASE_URL + "/pesquisa",request);
    }
}

export default new ProdutoService()