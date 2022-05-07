import React, { Component } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import ClienteService from '../services/ClienteService';

function CreateClienteComponet () {
    const navigate = useNavigate()

    function saveCliente(event){
        event.preventDefault();
        let cliente = {nome: this.state.nome, email: this.state.email}
        console.log('cliente => ' + cliente)
        
        ClienteService.createCliente(cliente).then(res =>(
            navigate("/clientes")
        ));
    }
    function cancelCliente(){
        navigate("/clientes");
    }

    return (
        <div>
            <div className='container'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    <h3 className='text-center'>Cadastrar</h3>
                    <div className='card-body'>
                        <form>
                            <div className='card'>
                                <h4 className='text-center'>Dados Pessoais</h4>
                                <div className='card-body'>
                                    <div className='form-group'>
                                        <label>Nome:</label>
                                        <input placeholder='Nome' name='nome' className='form-control' value={this.state.nome} onChange={this.changeNomeHandler}></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>Genero:</label>
                                        <input placeholder='Genero' name='genero' className='form-control' value={this.state.genero} onChange={this.changeEmailHandler}></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>Data de Nascimento:</label>
                                        <input placeholder='Data de Nascimento' name='dataNacimento' className='form-control' value={this.state.dataNacimento} onChange={this.changeDataNacimentoHandler}></input>
                                    </div>
                                    <div className='form-group'>
                                        <label>CPF:</label>
                                        <input placeholder='CPF' name='cpf' className='form-control' value={this.state.cpf} onChange={this.changeCpfHandler}></input>
                                    </div>
                                </div>
                            </div>
                            <div className='card'>
                                <h4 className='text-center'>Meios de Contatos</h4>
                                <div className='card-body'>
                                    <div className='form-group'>
                                        <label>Email:</label>
                                        <input placeholder='Email' name='email' className='form-control' value={this.state.nome} onChange={this.changeNomeHandler}></input>
                                    </div>
                                    <div className='card'>
                                        <label>Telefone:</label>
                                        <div className='card-body'>
                                            <div className='form-group'>
                                                <label>DDD:</label>
                                                <input placeholder='DDD' name='email' className='form-control' value={this.state.email} onChange={this.changeNomeHandler}></input>
                                            </div>
                                            <div className='form-group'>
                                                <label>Numero:</label>
                                                <input placeholder='DDD' name='numero' className='form-control' value={'0'} onChange={this.changeNomeHandler}></input>
                                            </div>
                                            <div className='form-group'>
                                                <label>Tipo:</label>
                                                <input placeholder='DDD' name='email' className='form-control' value={this.state.nome} onChange={this.changeNomeHandler}></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>   
                            <button className='btn btn-success' onClick={() => saveCliente()}>Save</button>
                            <Link className='btn btn-primary' to="/">Cancelar</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default (CreateClienteComponet);