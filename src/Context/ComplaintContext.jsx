import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";


export const ComplaintContext = createContext();

export default function ComplaintProvider({ children }) {
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [loading, setLoading] = useState(false);



  const getErrorMessage = (err) => {
  return (
    err?.response?.data?.message || 
    err?.response?.data || 
    "Something went wrong"
  );
};


//   const fetchComplaintTypes = async (hostelId) => {
//     try {
//       setLoading(true);

//       const res = await AxiosConfig.get(
//         `/v2/ComplaintType/all-complaintTypes/${hostelId}`,
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (res?.status === 200) {
//         const list = Array.isArray(res.data) ? res.data : [];
//           console.log("list",res,  list);
          
//         const formatted = list.map((item) => ({
//           id: item.complaintTypeId,
//           title: item.complaintTypeName,
//           raw: item, //
//         }));
//         console.log("formatted",formatted );
        

//         setComplaintTypes(formatted);
//       }
//     } catch (err) {
//       console.log("Complaint Type Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };


const fetchComplaintTypes = async (hostelId) => {

  setComplaintTypes([]);  
  setLoading(true);       

  try {
    const res = await AxiosConfig.get(
      `/v2/ComplaintType/all-complaintTypes/${hostelId}`
    );

    if (res.status === 200) {
      const list = Array.isArray(res.data) ? res.data : [];

      const formatted = list.map((item) => ({
        id: item.complaintTypeId,
        title: item.complaintTypeName,
        raw: item,
      }));

      setComplaintTypes(formatted);
      return { success: true, data: formatted };
    }

    return { success: false, data: [] };

  } catch (err) {
    console.log("Complaint Fetch Error:", err);
    return { success: false, data: [] };

  } finally {
       setTimeout(() => {
             setLoading(false);
        }, 1000);    
  }
};



 const addComplaintType = async ({ hostelId, complaintTypeName }) => {
  try {
    const payload = { complaintTypeName, hostelId, isActive: true };
    const res = await AxiosConfig.post("/v2/ComplaintType", payload);

    if (res?.status === 200 || res?.status === 201) {
        console.log("response", res);
        
      await fetchComplaintTypes(hostelId);
      return { success: true , message: res?.data || "Created Successfully" };
    }
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
};


  const editComplaintType = async (data) => {
  const { id, complaintTypeName, isActive, hostelId } = data;

  try {
    const res = await AxiosConfig.put(
      `/v2/ComplaintType/${id}`,
      { complaintTypeName, isActive, hostelId }
    );

    if (res?.status === 200) {
          console.log("response", res);
      await fetchComplaintTypes(hostelId);
      return { success: true ,message: res?.data || "Updated Successfully" };
    }
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
};



  const deleteComplaintType = async (id, hostelId) => {
  try {
    const res = await AxiosConfig.delete(`/v2/ComplaintType/${id}`);

    if (res?.status === 200) {
         console.log("response", res);
      await fetchComplaintTypes(hostelId);
      return { success: true , message: res?.data || "Deleted Successfully"};
    }
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
};


  return (
    <ComplaintContext.Provider
      value={{
        complaintTypes,
        loading,

        fetchComplaintTypes,
        addComplaintType,
        editComplaintType,
        deleteComplaintType,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}
