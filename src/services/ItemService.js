import axios from 'axios'

const API_BASE_URL = "http://localhost:8080/api/v1/item";
class ItemService{

    getItens(){
        return axios.get( API_BASE_URL );
    }
    getDados( dataInicio, dataFinal , tipo, escala){
        return axios.get( API_BASE_URL + "/dados/dataInicio=" + dataInicio + "&dataFinal=" + dataFinal + "&tipo=" + tipo + "&escala=" + escala );
    }
}

export default new ItemService