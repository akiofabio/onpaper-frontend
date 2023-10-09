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
    getPedidoByParametros( pesquisas ){
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
        //alert(request.params)
        return axios.get( API_BASE_URL + "/pesquisa",request);
    }
    
    getPedidoByPendente(){
        return axios.get( API_BASE_URL + "/pendentes");
    }

    updatePedido( pedido, pedidoId ){
        return axios.put( API_BASE_URL + "/" + pedidoId , pedido );
    }

    updatePedidoStatus( status, pedidoId ){
        return axios.put( API_BASE_URL + "/" + status + "/" + pedidoId);
    }
}
export default new PedidoService()