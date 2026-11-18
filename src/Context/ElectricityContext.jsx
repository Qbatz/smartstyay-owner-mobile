import React, { createContext, useState, useRef } from "react";
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
  const [roomReadingLoadingMore, setRoomReadingLoadingMore] = useState(false);
  const [roomReadingPagination, setRoomReadingPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemPerPage: 10,
  });
  const roomReadingRequestId = useRef(0);
  const roomReadingFetchingRef = useRef(false);
  // Page tracking from each response (refs, so load-more never reads stale
  // state or depends on the response's pagination key names).
  const roomReadingPageRef = useRef(1);
  const roomReadingHasMoreRef = useRef(false);

  // Tenant readings pagination
  const [tenantReadingLoadingMore, setTenantReadingLoadingMore] = useState(false);
  const tenantReadingRequestId = useRef(0);
  const tenantReadingFetchingRef = useRef(false);
  const tenantReadingPageRef = useRef(1);
  const tenantReadingHasMoreRef = useRef(false);

    const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";

    // Readings with no entry yet come back with readingId 0, so roomId is
    // needed alongside readingId to identify a row uniquely.
    const getReadingKey = (r) => `${r?.roomId}-${r?.readingId}`;

    const GetEBRoomReading = async (hostelId, options = {}) => {
       const { page = 1, size = 10, showLoader = true } = options;
       const isFirstPage = page === 1;

       // Load-more requests are skipped while another fetch is running;
       // a page-1 request (initial load / refresh after add/edit/reset) always runs.
       if (!isFirstPage && roomReadingFetchingRef.current) {
         return { success: false };
       }

       const requestId = ++roomReadingRequestId.current;
       roomReadingFetchingRef.current = true;

       if (isFirstPage) {
         roomReadingPageRef.current = 1;
         roomReadingHasMoreRef.current = false;
         if (showLoader) setLoading(true);
       } else {
         setRoomReadingLoadingMore(true);
       }

       try{
           const axios = getAxios();
           const res = await axios.get(`/v2/electricity/${hostelId}`, {
             params: { page, size },
           });

           // Ignore responses superseded by a newer request.
           if (requestId !== roomReadingRequestId.current) {
             return { success: false };
           }

            if (res.status === 200) {
             const data = res?.data || {};
             const list = Array.isArray(data?.listReadings) ? data.listReadings : [];

             // API may send pagination top-level or nested, as totalPages or
             // totalPage. Without it: a full page means there may be more.
             const pagination = data?.pagination || data?.paginationSummary || data;
             const respPage = Number(pagination?.currentPage) || page;
             const respTotalPages = Number(
               pagination?.totalPages ?? pagination?.totalPage
             );

             if (isFirstPage || list.length > 0) {
               roomReadingPageRef.current = respPage;
             }
             roomReadingHasMoreRef.current =
               Number.isFinite(respTotalPages) && respTotalPages > 0
                 ? respPage < respTotalPages
                 : list.length >= size;

             setEBRoomReading((prev) => {
               if (isFirstPage) return list;
               const existing = new Set(prev.map(getReadingKey));
               return [...prev, ...list.filter((r) => !existing.has(getReadingKey(r)))];
             });

             setRoomReadingPagination({
               currentPage: roomReadingPageRef.current,
               totalPages:
                 Number.isFinite(respTotalPages) && respTotalPages > 0
                   ? respTotalPages
                   : 1,
               itemPerPage: Number(data?.itemPerPage) || size,
             });

             if (isFirstPage) {
               setHostelBased(data.isHostelBased)
               setHostelELectricityDetails(data)
             }
             return { success: true, data };
            }

            return { success: false };

       }
       catch(error){
         const msg = getErrorMessage(error);
          setErrorMsg(msg);
          return { success: false, message: msg };

       }
       finally{
        if (requestId === roomReadingRequestId.current) {
          roomReadingFetchingRef.current = false;
          if (isFirstPage) {
            if (showLoader) setLoading(false);
          } else {
            setRoomReadingLoadingMore(false);
          }
        }
       }
    }

    // Fetches the next page of room readings, if there is one.
    const LoadMoreEBRoomReading = async (hostelId, size = 10) => {
      if (!hostelId || roomReadingFetchingRef.current || !roomReadingHasMoreRef.current) {
        return { success: false };
      }

      return GetEBRoomReading(hostelId, {
        page: roomReadingPageRef.current + 1,
        size,
        showLoader: false,
      });
    }

    // page 1 -> initial load / refresh: replaces readingList (full-screen loader)
    // page > 1 -> load more: appends to readingList (footer loader only)
    // Response: { currentPage, totalPages, itemPerPage, readingList, ... }
    const GetEBTenantReading = async (hostelId, options = {}) => {
       const { page = 1, size = 10, showLoader = true } = options;
       const isFirstPage = page === 1;

       if (!hostelId) return { success: false };

       // Load-more is skipped while another fetch runs; page 1 always runs.
       if (!isFirstPage && tenantReadingFetchingRef.current) {
         return { success: false };
       }

       const requestId = ++tenantReadingRequestId.current;
       tenantReadingFetchingRef.current = true;

       if (isFirstPage) {
         tenantReadingPageRef.current = 1;
         tenantReadingHasMoreRef.current = false;
         if (showLoader) setLoading(true);
       } else {
         setTenantReadingLoadingMore(true);
       }

       try{
           const axios = getAxios();
           const res = await axios.get(`/v2/electricity/customers/${hostelId}`, {
             params: { page, size },
           });
            console.log("AllEbTenantReading",res)

            // Ignore responses superseded by a newer request.
            if (requestId !== tenantReadingRequestId.current) {
              return { success: false };
            }

            if (res.status === 200) {
             const data = res?.data || {};
             const list = Array.isArray(data?.readingList) ? data.readingList : [];
             const respPage = Number(data?.currentPage) || page;
             const respTotalPages = Number(data?.totalPages);

             if (isFirstPage || list.length > 0) {
               tenantReadingPageRef.current = respPage;
             }
             tenantReadingHasMoreRef.current =
               Number.isFinite(respTotalPages) && respTotalPages > 0
                 ? respPage < respTotalPages
                 : list.length >= size;

             setEBTenantReading((prev) => {
               if (isFirstPage) return data;
               const prevList = Array.isArray(prev?.readingList) ? prev.readingList : [];
               return { ...data, readingList: [...prevList, ...list] };
             });

             return { success: true, data };
            }

            return { success: false };
       }
       catch(error){
          const msg = getErrorMessage(error);
          setErrorMsg(msg);
          return { success: false, message: msg };
       }
       finally{
        if (requestId === tenantReadingRequestId.current) {
          tenantReadingFetchingRef.current = false;
          if (isFirstPage) {
            if (showLoader) setLoading(false);
          } else {
            setTenantReadingLoadingMore(false);
          }
        }
       }
    }

    // Fetches the next page of tenant readings, if there is one.
    const LoadMoreEBTenantReading = async (hostelId, size = 10) => {
      if (!hostelId || tenantReadingFetchingRef.current || !tenantReadingHasMoreRef.current) {
        return { success: false };
      }

      return GetEBTenantReading(hostelId, {
        page: tenantReadingPageRef.current + 1,
        size,
        showLoader: false,
      });
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
    console.log("kaliie",error)
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
            LoadMoreEBTenantReading,
            tenantReadingLoadingMore,
            particular_EbTenantReading,
            loading,
            error, 
            errorMsg,
            GetEBRoomReading,
            LoadMoreEBRoomReading,
            roomReadingLoadingMore,
            roomReadingPagination,
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