import axios from 'axios'

const CLIENTE_API_BASE_URL = "http://localhost:8080/api/v1/clientes";
class ClienteService{

    getClientes(){
        return axios.get(CLIENTE_API_BASE_URL);
    }
    createCliente(cliente){
        return axios.post(CLIENTE_API_BASE_URL,cliente);
    }
    getClienteById( clienteId){
        return axios.get(CLIENTE_API_BASE_URL + "/" + clienteId);
    }
}

export default new ClienteService()