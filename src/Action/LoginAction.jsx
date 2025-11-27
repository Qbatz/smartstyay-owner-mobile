import AxiosConfig from "../Config/AxiosConfig";

export const setLogin= async(data)=>{
    const response=await AxiosConfig.post('/v2/users/login', data)
    return response;
}

export const postNewAccount=async(data)=>{
        console.log(data)
    const response=await AxiosConfig.post('/v2/users', data)
    return response;
}