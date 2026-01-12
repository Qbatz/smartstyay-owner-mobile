import AxiosConfig, {getAxios} from "../Config/AxiosConfig";

export const getTenants=async(token)=>{
    try{
        const axios = getAxios();
        const response=await axios.get('/v2/customers/{hostelId}')
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }
}
