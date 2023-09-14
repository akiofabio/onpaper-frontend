import axios from 'axios'

const CLIENTE_API_BASE_URL = "http://localhost:8080/api/v1/cliente";
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
    updateCliente( cliente, clienteId ){
        return axios.put( CLIENTE_API_BASE_URL + "/" + clienteId , cliente );
    }

    getClienteByPedidoId( clienteId){
        return axios.get(CLIENTE_API_BASE_URL + "/pedido/" + clienteId);
    }

    getClientesByParametros( pesquisas ){
        var params = new URLSearchParams();
        pesquisas.map(pesquisa => {
            if(pesquisa!==undefined && pesquisa.conteudo.length>0){
                params.append("pes", pesquisa.conteudo)
                params.append("par", pesquisa.parametro)
            }
        })
        var request = {
            params: params
        };
        alert(request.params)
        return axios.get( CLIENTE_API_BASE_URL + "/pesquisa",request);
    }

    delete(clienteId){
        return axios.delete(CLIENTE_API_BASE_URL + "/" + clienteId);
    }
}
export default new ClienteService()