import AxiosConfig from "../Config/AxiosConfig";

export const getTenants=async(token)=>{
    try{
        const response=await AxiosConfig.get('/v2/customers/{hostelId}')
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }
}
