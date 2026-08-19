import React, { createContext, useState } from "react";
import {getAxios} from "../Config/AxiosConfig";

export const ElectricityContext = createContext();


export default function ElectricityProvider({children}){

  const [EbRoomReading, setEBRoomReading] = useState([]);
  const [hostelBased , setHostelBased] = useState(false)
  const [hostelElectricityDetails, setHostelELectricityDetails] = useState(null)
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
           const axios = getAxios();
           const res = await axios.get(`/v2/electricity/${hostelId}`);
            if (res.status === 200) {
             setEBRoomReading(res?.data?.listReadings || []);
             setHostelBased(res.data.isHostelBased)
             setHostelELectricityDetails(res.data)
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
           const axios = getAxios();
           const res = await axios.get(`/v2/electricity/customers/${hostelId}`);
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
            const axios = getAxios();
           const res = await axios.get(`/v2/electricity/${hostelId}/${roomId}`);
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
            const axios = getAxios();
           const res = await axios.get(`/v2/electricity/customers/${hostelId}/${customerId}`);
           
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

  const AddRoomReading = async (payload) => {
  setLoading(true);
  setErrorMsg("");

  try {
    const axios = getAxios();
    const res = await axios.post(
      `/v2/electricity/${payload.hostelId}`,
      payload
    );

    console.log("res", res);
    

    if (res?.status === 200 || res?.status === 201) {
      await GetEBRoomReading(payload.hostelId);

      return {
        success: true,
        data: res.data,
        statusCode: res.status,
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
      statusCode: error?.response?.status,
    };
  } finally {
    setLoading(false);
  }
};
  

const UpdateRoomReading = async (payload) => {
  setLoading(true);
  setErrorMsg("");

  try {
    const axios = getAxios();
    const res = await axios.put(
      `/v2/electricity/${payload.hostelId}/${payload.readingId}`,
      null,
      {
        params: {
          reading: payload.reading,
          entryDate: payload?.readingDate || payload?.entryDate,
        },
      }
    );

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        data: res.data,
        statusCode: res.status,
      };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};


const DeleteRoomReading = async ({ hostelId, readingId }) => {
  setLoading(true);
  setErrorMsg("");

  try {
    const axios = getAxios();
    const res = await axios.delete(
      `/v2/electricity/${hostelId}/${readingId}`
    );

    console.log('hostelId', hostelId);
        console.log('readingId', readingId);
            console.log('res', res);

    if (res?.status === 200 || res?.status === 204) {
      return { success: true };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    console.log("error", error , msg);
    
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};

const resetEBMeterReading=async(hostelId,payload)=>{
  setLoading(true)
  try{
    const axios=getAxios()

    const res=await axios.post(`/v2/electricity/reset/${hostelId}`,payload)
    console.log(res)
    return res;
  }catch(error){
    const msg = getErrorMessage(error);
    console.log("error", error , msg);
    
    setErrorMsg(msg);
    return { success: false, message: msg };
  }finally{
    setLoading(false)
  }
}


    return(
        <ElectricityContext.Provider
        value={{
            hostelBased,
            hostelElectricityDetails,
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
            ParticularTenantReadingDetails,
            AddRoomReading,
            UpdateRoomReading,     
            DeleteRoomReading,resetEBMeterReading
        }}
        >
            {children}
        </ElectricityContext.Provider>
    )
}