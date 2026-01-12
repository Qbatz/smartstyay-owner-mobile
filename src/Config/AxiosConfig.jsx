import axios from "axios";
import {retriveData} from '../Utils/Storage'
import { BASE_URL  as URL} from "../Utils/Constant";
let axiosInstance = null;

const AxiosConfig = axios.create({
    baseURL: "https://webdevapi.qbatz.com",
    headers: {
        "Content-Type": "application/json",
    }
})


AxiosConfig.interceptors.request.use(
    async (config) => {
        const token = await retriveData("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log("sending request without Authorization");
        }
        return config;
    },
    (error) => {
    console.log(error)
    return Promise.reject(error);
  }
);

export const getAxios = () => { 
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: URL(),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(axiosInstance)

    axiosInstance.interceptors.request.use(async (config) => {
      const token = await retriveData("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  return axiosInstance;
}

export default AxiosConfig;