import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";

export const ElectricityContext = createContext();


export default function ElectricityProvider({children}){

  const [EbRoomReading, setEBRoomReading] = useState([]);
  const [particular_EbRoomReading, setParticular_EBRoomReading] = useState([]);
  const [EbTenantReading, setEBTenantReading] = useState([]);
  const [particular_EbTenantReading, setParticular_EBTenantReading] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";

    const GetEBRoomReading = async (hostelId) => {

       try{
           setLoading(true);
           const res = await AxiosConfig.get(`/v2/electricity/${hostelId}`);
            if (res.status === 200) {
             setEBRoomReading(res?.data?.listReadings || []);
             return { success: true, data: res?.data };
            }

            return { success: false };

       }
       catch(error){
         const msg = getErrorMessage(error);
          setErrorMsg(msg);
          return { success: false, message: msg };
       
       }
       finally{
        setLoading(false)
       }
    }

    const GetEBTenantReading = async (hostelId) => {
       try{
           setLoading(true);
           const res = await AxiosConfig.get(`/v2/electricity/customers/${hostelId}`);
            if (res.status === 200) {
             setEBTenantReading(res?.data || []);
             return { success: true, data: res?.data };
            }

            return { success: false };
       }
       catch(error){
          const msg = getErrorMessage(error);
          setErrorMsg(msg);
          return { success: false, message: msg };       
       }
       finally{
        setLoading(false)
       }
    }

    const ParticularRoomReadingDetails = async (hostelId, roomId) => {
        try{
            setLoading(true);
           const res = await AxiosConfig.get(`/v2/electricity/${hostelId}/${roomId}`);
            if (res.status === 200) {
             setParticular_EBRoomReading(res?.data || []);
             return { success: true, data: res?.data };
            }

            return { success: false };
           

        }
        catch(error){
          const msg = getErrorMessage(error);
          setErrorMsg(msg);
          return { success: false, message: msg };    
            
        }
        finally{
            setLoading(false)
        }
    }

     const ParticularTenantReadingDetails = async (hostelId, customerId) => {
        try{
            setLoading(true);
           const res = await AxiosConfig.get(`/v2/electricity/customers/${hostelId}/${customerId}`);
           
            if (res.status === 200) {
             setParticular_EBTenantReading(res?.data || []);
             return { success: true, data: res?.data };
            }

            return { success: false };
           

        }
        catch(error){
          const msg = getErrorMessage(error);
          setErrorMsg(msg);
          return { success: false, message: msg };    
            
        }
        finally{
            setLoading(false)
        }
    }

    return(
        <ElectricityContext.Provider
        value={{
            EbRoomReading , 
            particular_EbRoomReading,
            EbTenantReading,
            particular_EbTenantReading,
            loading,
            error, 
            errorMsg,
            GetEBRoomReading,
            GetEBTenantReading,
            ParticularRoomReadingDetails,
            ParticularTenantReadingDetails
        }}
        >
            {children}
        </ElectricityContext.Provider>
    )
}