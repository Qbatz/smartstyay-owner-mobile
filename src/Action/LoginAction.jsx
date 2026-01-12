import AxiosConfig, {getAxios} from "../Config/AxiosConfig";

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
        const axios = getAxios();
        const response=await axios.post('/v2/users', data)
       return response;
    }catch(error){
        return{status: error.response.status, message: error.response.data}
    }   
}

export const updateFcmToken=async(fcmToken,authToken)=>{
    const data= {
        token: fcmToken,
        source: 'Mobile',
    }
    try{
        const axios = getAxios();
        const response=await axios.put('/v2/profile/fcm', data, {
            headers: {
                Authorization: 'Bearer ' + authToken
            }
        })
        console.log(response);
        return response;
    }catch (error){
        console.log(error)
        return {  status: error?.response?.status ?? 500,
      message: error?.response?.data ?? 'Not available', }
    }

}