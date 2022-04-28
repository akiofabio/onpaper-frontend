import axios from 'axios'

const CARRINHO_API_BASE_URL = "http://localhost:8080/api/v1/carrinho";
class CarrinhoService{

    async getCarrinhos(){
        return await axios.get( CARRINHO_API_BASE_URL );
    }
    async createCarrinho( carrinho ){
        return await axios.post( CARRINHO_API_BASE_URL , carrinho );
    }
    async getCarrinhoById( carrinhoId ){
        return await axios.get( CARRINHO_API_BASE_URL + "/" + carrinhoId );
    }

    async updateCarrinho( carrinho, carrinhoId ){
        return await axios.put( CARRINHO_API_BASE_URL + "/" + carrinhoId , carrinho );
    }

    async addItemCarrinho( item, carrinhoId ){
        return await axios.put( CARRINHO_API_BASE_URL + "/add/" + carrinhoId , item );
    }

    async removeItemCarrinho( item, carrinhoId ){
        return await axios.put( CARRINHO_API_BASE_URL + "/remove/" + carrinhoId , item );
    }
}

export default new CarrinhoService()