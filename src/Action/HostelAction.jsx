import AxiosConfig from "../Config/AxiosConfig";

export const getHostels=async(token)=>{
    try{
        const response=await AxiosConfig.get('/v2/hostel', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }
}
export const postTenant=async()=>{
    
}