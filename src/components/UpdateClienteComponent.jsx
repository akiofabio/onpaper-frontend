import React, { Component } from 'react';
import { useNavigate,Link , useParams} from 'react-router-dom';
import {withRouter} from '../etc/withRouter';
import ClienteService from '../services/ClienteService';

class UpdateClienteComponet extends Component {

    constructor(props){
        super(props)

        this.state = { 
            id: this.props.params.id,
            nome: '',
            email: ''
        }
        this.changeNomeHandler = this.changeNomeHandler.bind(this);
        this.changeEmailHandler = this.changeEmailHandler.bind(this);
        this.updateCliente = this.updateCliente.bind(this);
    }

    changeNomeHandler (event) {
        this.setState({nome: event.target.value});
    }

    changeEmailHandler (event) {
        this.setState({email: event.target.value});
    }
    
    updateCliente = (e) =>{
        e.preventDefault();
        let cliente = {nome: this.state.nome, email: this.state.email}
        console.log('cliente => ' + JSON.stringify(cliente))
    }
    cancelCliente(){
        this.props.navigate("/clientes");
    }
    componentDidMount(){
        
        ClienteService.getClienteById(this.state.id).then((res) => {
            let cliente = res.data;
            this.setState({nome: cliente.nome, email: cliente.email})
        });
    }
    render() {
        return (
            <div>
                <div className='container'>
                    <div className='card col-md6 offset-md-3 offset-md-3'>
                        <h3 className='text-center'>Alterar</h3>
                        <div className='card-body'>
                            <form>
                                <div className='form-group'>
                                    <label>Nome:</label>
                                    <input placeholder='Nome' name='nome' className='form-control' value={this.state.nome} onChange={this.changeNomeHandler}></input>
                                </div>
                                <div className='form-group'>
                                    <label>Email:</label>
                                    <input placeholder='Email' name='email' className='form-control' value={this.state.email} onChange={this.changeEmailHandler}></input>
                                </div>
                                <button className='btn btn-success' onClick={this.updateCliente}>Save</button>
                                <Link className='btn btn-primary' to="/">Cancelar</Link>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(UpdateClienteComponet);