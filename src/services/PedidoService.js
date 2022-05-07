import axios from 'axios'

const API_BASE_URL = "http://localhost:8080/api/v1/pedido";
class PedidoService{

    getPedidos(){
        return axios.get( API_BASE_URL );
    }
    createPedido( pedido ){
        return axios.post( API_BASE_URL , pedido );
    }
    getPedidoById( pedidoId ){
        return axios.get( API_BASE_URL + "/" + pedidoId );
    }
    getPedidoByDatas( dataInicio , dataFinal ){
        return axios.get( API_BASE_URL + "/datas/dataInicio=" + dataInicio + "&dataFinal=" + dataFinal );
    }
    updatePedido( pedido, pedidoId ){
        return axios.put( API_BASE_URL + "/" + pedidoId , pedido );
    }
}
export default new PedidoService()