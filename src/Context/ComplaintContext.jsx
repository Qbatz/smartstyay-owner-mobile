import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";


export const ComplaintContext = createContext();

export default function ComplaintProvider({ children }) {
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [complaintsList, setComplaintsList] = useState([]);
  const [complaintListOtherDetails, setComplaintListOtherDetails] = useState({
  startDate: null,
  endDate: null,
  complaintCount: 0,
});
  const [assignError, setAssignError] = useState("");
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

  const GetComplaintListDetails = async (hostelId) => {
  setComplaintsList([]);
  setComplaintListOtherDetails({
    startDate: null,
    endDate: null,
    complaintCount: 0,
  });
  setLoading(true);

  try {
    const res = await AxiosConfig.get(
      `/v2/complaint/all-complaints/${hostelId}`
    );

    if (res.status === 200) {
      const data = res?.data || {};

      setComplaintsList(data?.complaintsList || []);
      setComplaintListOtherDetails({
        startDate: data?.startDate || null,
        endDate: data?.endDate || null,
        complaintCount: data?.complaintCount || 0,
      });

      return { success: true, data };
    }

    return { success: false, data: {} };
  } catch (error) {
    console.log("Complaint Fetch Error:", error);
    return { success: false, data: {} };
  } finally {
    setLoading(false);
  }
};

const AddComplaint = async (payload) => {
  setLoading(true);

  try {
    const res = await AxiosConfig.post("/v2/complaint", payload);

    if (res.status === 201 || res.status === 200) {
      await GetComplaintListDetails(payload.hostelId);

      return {
        success: true,
        message: res.data || "Complaint added successfully",
      };
    }

    return { success: false, message: "Failed to add complaint" };
  } catch (err) {
    return {
      success: false,
      message: getErrorMessage(err),
    };
  } finally {
    setLoading(false);
  }
};

const EditComplaint = async ({ complaintId, complaintDate, description, hostelId }) => {
  setLoading(true);

  try {
    const res = await AxiosConfig.put(
      `/v2/complaint/${complaintId}`,
      {
        complaintDate,
        description,
      }
    );

    if (res.status === 200) {
      await GetComplaintListDetails(hostelId);

      return {
        success: true,
        message: res.data || "Complaint updated successfully",
      };
    }

    return { success: false, message: "Failed to update complaint" };
  } catch (err) {
    return {
      success: false,
      message: getErrorMessage(err),
    };
  } finally {
    setLoading(false);
  }
};

const deleteComplaint = async (complaintId, hostelId) => {
  setLoading(true);

  try {
    const res = await AxiosConfig.delete(
      `/v2/complaint/delete-complaint/${complaintId}`
    );

    if (res.status === 200) {
      // 🔄 refresh complaint list
      await GetComplaintListDetails(hostelId);

      return {
        success: true,
        message: res.data || "Complaint deleted successfully",
      };
    }

    return {
      success: false,
      message: "Failed to delete complaint",
    };
  } catch (err) {
    return {
      success: false,
      message: getErrorMessage(err),
    };
  } finally {
    setLoading(false);
  }
};

// ComplaintContext.js
const changeComplaintStatus = async ({ complaintId, status, hostelId }) => {
  setLoading(true);

  try {
    const res = await AxiosConfig.put(
      `/v2/complaint/update-status/${complaintId}`,
      { status }
    );

    if (res.status === 200) {
      await GetComplaintListDetails(hostelId); 

      return {
        success: true,
        message: res.data || "Status updated successfully",
      };
    }

    return { success: false, message: "Failed to update status" };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  } finally {
    setLoading(false);
  }
};


 const assignComplaint = async ({ complaintId, userId }) => {
    try {
      setLoading(true);
      setAssignError("");

      const res = await AxiosConfig.put(
        `/v2/complaint/assign-user/${complaintId}`,
        { userId }
      );

      if (res.status === 200) {
        return {
          success: true,
          data: res.data,
          message: res.data || "Complaint assigned successfully",
        };
      }

      return { success: false, message: "Something went wrong" };
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Something went wrong";

      setAssignError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };



  return (
    <ComplaintContext.Provider
      value={{
        complaintTypes,
        loading,
        complaintsList,
        complaintListOtherDetails,
        fetchComplaintTypes,
        addComplaintType,
        editComplaintType,
        deleteComplaintType,
        GetComplaintListDetails,
        AddComplaint,
        EditComplaint,
        deleteComplaint,
        changeComplaintStatus,
        assignComplaint
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}
