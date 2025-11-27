import axios from "axios";
import {retriveData} from '../Utils/Storage'

const AxiosConfig = axios.create({
    baseURL: "https://webdevapi.qbatz.com",
    headers: {
        "Content-Type": "application/json",
    }
});


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

export default AxiosConfig;