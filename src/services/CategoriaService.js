import axios from 'axios'

const API_BASE_URL = "http://localhost:8080/api/v1/categoria";
class CategoriaService{

    getCategorias(){
        return axios.get( API_BASE_URL );
    }
    createCategoria( categoria ){
        return axios.post( API_BASE_URL , categoria );
    }
    getCategoriaById( categoriaId ){
        return axios.get( API_BASE_URL + "/" + categoriaId );
    }
    updateCategoria( categoria, categoriaId ){
        return axios.put( API_BASE_URL + "/" + categoriaId , categoria );
    }
}

export default new CategoriaService