import {getAxios} from "../Config/AxiosConfig";



export const getHostels = async () => {
  try {
    const axios = getAxios();
    const response = await axios.get("/v2/hostel");
    return response;
  } catch (error) {
    return {
      status: error.response?.status,
      message: error.response?.data,
    };
  }
};


export const postTenant=async()=>{
    
}