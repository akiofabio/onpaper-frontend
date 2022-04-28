import axios from 'axios'

const API_BASE_URL = "http://localhost:8080/api/v1/usuario";
class UserService{

    async getUsers(){
        return await axios.get( API_BASE_URL );
    }
    async createUser( user ){
        return await axios.post( API_BASE_URL , user );
    }
    async getUserById( userId ){
        return await axios.get( API_BASE_URL + "/" + userId );
    }

    async updateUser( user, userId ){
        return await axios.put( API_BASE_URL + "/" + userId , user );
    }

    async getUserLogin( email , senha ){
        return await axios.get( API_BASE_URL + "/login/email=" + email + "&senha=" + senha );
    }
}

export default new UserService()