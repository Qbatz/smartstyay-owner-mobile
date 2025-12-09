import AxiosConfig from "../Config/AxiosConfig";

export const setLogin= async(data)=>{
    try{
         const response=await AxiosConfig.post('/v2/users/login', data)
         return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }
   
}

export const postNewAccount=async(data)=>{
    try{
        const response=await AxiosConfig.post('/v2/users', data)
       return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }   
}