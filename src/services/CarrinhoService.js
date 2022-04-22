import axios from 'axios'

const CARRINHO_API_BASE_URL = "http://localhost:8080/api/v1/carrinho";
class CarrinhoService{

    async getCarrinhos(){
        return await axios.get( CARRINHO_API_BASE_URL );
    }
    async createCarrinho( produto ){
        return await axios.post( CARRINHO_API_BASE_URL , produto );
    }
    async getCarrinhoById( produtoId ){
        return await axios.get( CARRINHO_API_BASE_URL + "/" + produtoId );
    }

    async updateCarrinho( produto, produtoId ){
        return await axios.put( CARRINHO_API_BASE_URL + "/" + produtoId , produto );
    }
}

export default new CarrinhoService()