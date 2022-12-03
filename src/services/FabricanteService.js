import axios from 'axios'

const API_BASE_URL = "http://localhost:8080/api/v1/fabricante";
class FabricanteService{

    getFabricantes(){
        return axios.get( API_BASE_URL );
    }
    createFabricante( fabricante ){
        return axios.post( API_BASE_URL , fabricante );
    }
    getFabricanteById( fabricanteId ){
        return axios.get( API_BASE_URL + "/" + fabricanteId );
    }
    updateFabricante( fabricante, fabricanteId ){
        return axios.put( API_BASE_URL + "/" + fabricanteId , fabricante );
    }
}

export default new FabricanteService