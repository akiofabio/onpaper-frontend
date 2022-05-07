import React, { Component } from 'react';
import ClienteService from '../services/ClienteService';
import { useNavigate,Link } from 'react-router-dom';

class ListClienteComponents extends Component {
    /* constructor(props){
        super(props)

        this.state = { 
            clientes: []
        }

        this.editCliente = this.editCliente.bind(this);
    }
    
    editCliente(userId){
        this.props.navigate('/update-cliente/' + userId,{state: {
            id: userId}})
    }

    componentDidMount(){
        ClienteService.getClientes().then((res) => {
            this.setState({clientes: res.data});
        })
    }
    render() {
        return (
            <div>
                <div className='container' >
                    <h2 className='text-center'>Clientes</h2>
                    <div>
                        <Link className='btn btn-primary' to="/cadastrar-cliente">Cadastrar Cliente</Link>
                    </div>
                    <div className='row'>
                        <table className='table table-striped table-bordered'>
                            <thead>
                                <tr>
                                    <th>Nome Completo</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.clientes.map(
                                        cliente => 
                                        <tr key = {cliente.id}>
                                            <td>{cliente.nome}</td>
                                            <td>{cliente.email}</td>
                                            <td>
                                                <button onClick={ () => this.editCliente(cliente.id)}>Editar</button>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    } */
}
export default (ListClienteComponents);