import axios from 'axios'

const API_BASE_URL = "http://localhost:8080/api/v1/bandeira";
class BandeiraService{

    async getBandeiras(){
        return await axios.get( API_BASE_URL );
    }
    async createBandeira( badeira ){
        return await axios.post( API_BASE_URL , badeira );
    }
    async getBandeiraById( badeiraId ){
        return await axios.get( API_BASE_URL + "/" + badeiraId );
    }

    async updateBandeira( badeira, badeiraId ){
        return await axios.put( API_BASE_URL + "/" + badeiraId , badeira );
    }
}

export default new BandeiraService()