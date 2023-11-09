import axios from 'axios'

const API_BASE_URL = "http://localhost:8080/api/v1/item";
class ItemService{

    getItens(){
        return axios.get( API_BASE_URL );
    }

    createItem(item){
        return axios.post( API_BASE_URL, item);
    }

    getDados( dataInicio, dataFinal , tipo, escala){
        return axios.get( API_BASE_URL + "/dados/dataInicio=" + dataInicio + "&dataFinal=" + dataFinal + "&tipo=" + tipo + "&escala=" + escala );
    }
    updateItemStatus( status, id ){
        return axios.put( API_BASE_URL + "/" + status + "/" + id);
    }
    updateQuantidade(id,quantidade){
        return axios.put( API_BASE_URL + "/updateQuantidade/" + id + "/" + quantidade);
    }
}

export default new ItemService()