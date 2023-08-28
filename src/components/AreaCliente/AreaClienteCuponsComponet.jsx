import React, { useEffect , useState , useRef } from 'react';
import { moedaRealMask} from '../../etc/Mask'

import ClienteService from '../../services/ClienteService';

function AreaClienteCuponsComponet (props){
    const [cliente, setCliente] = useState({
        score:"",
        email: "",
        senha: "",
        nome: "",
        cpf: "",
        genero: "",
        dataNascimento:"",
        
        telefones: [{
            tipo:"",
            ddd:"",
            numero:""
        }],
        
        enderecos: [{
            nome:"",
            cep:"",
            pais:"",
            estado:"",
            cidade:"",
            bairro:"",
            tipoLogradouro:"",
            logradouro:"",
            numero:"",
            tipo:"",
            entrega:false,
            cobranca:false,
            observacao:""
        }],
        cartoes: [{
            nome:"",
            numero:"",
            codigoSeguranca:"",
            validade:"",
            preferencial:false,
            bandeira:{nome:""}
        }],
        pedidos: [{
            data:"",
            status:""
        }],
        cupons: [],
        carrinho:null,
    })
    useEffect(() => {
        if(!cliente.id){
            ClienteService.getClienteById( localStorage.getItem( "id" ) ).then( res => {
                setCliente(res.data)
            })
        }
    }, [])

    return(
        <div>
            <h3>Meus Cupons</h3>
            <div className="card-body">
                {cliente.cupons.map( cupom => 
                    <div className="card border-dark" style={{ marginTop:10 , marginBottom:10}}>
                        <div className="card-header">
                            <label>Cupom {cupom.id}</label>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <label>Tipo: {cupom.tipo} </label>
                            </div>
                            <div className="row">
                                <label>Descricao: {cupom.descricao} </label>
                            </div>
                            <div className="row">
                                <label>Valor: {moedaRealMask(cupom.valor)} </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default AreaClienteCuponsComponet