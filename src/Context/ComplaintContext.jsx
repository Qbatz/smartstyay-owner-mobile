import React, { createContext, useState } from "react";
import {getAxios} from "../Config/AxiosConfig";


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
  const [selectedComplaint, setSelectedComplaint] = useState(null);
const [commentsLoading, setCommentsLoading] = useState(false);
const [complaintUpdates, setComplaintUpdates] = useState([]);


  const getErrorMessage = (err) => {
  return (
    err?.response?.data?.message || 
    err?.response?.data || 
    "Something went wrong"
  );
};





const fetchComplaintTypes = async (hostelId) => {

  setComplaintTypes([]);  
     

  try {
      setLoading(true);  
    const axios = getAxios();
    const res = await axios.get(
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
             setLoading(false);
  }
};



 const addComplaintType = async ({ hostelId, complaintTypeName }) => {
  try {
    const payload = { complaintTypeName, hostelId, isActive: true };
    const axios = getAxios();
    const res = await axios.post("/v2/ComplaintType", payload);

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
    const axios = getAxios();
    const res = await axios.put(
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
    const axios = getAxios();
    const res = await axios.delete(`/v2/ComplaintType/${id}`);

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
    const axios = getAxios();
    const res = await axios.get(
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
    const axios = getAxios();
    const res = await axios.post("/v2/complaint", payload);

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
    const axios = getAxios();
    const res = await axios.put(
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
    const axios = getAxios();
    const res = await axios.delete(
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

const changeComplaintStatus = async ({ complaintId, status, hostelId }) => {
  // setLoading(true);

  try {
    const axios = getAxios();
    const res = await axios.put(
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
  console.log("pap",complaintId,userId)
    try {
      // setLoading(true);
      setAssignError("");
      const axios = getAxios();
      const res = await axios.put(
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
      console.log("err",error.message)
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

 const getParticularComplaint = async (hostelId, complaintId) => {
  // setLoading(true);
  try {

    const axios = getAxios()
    const res = await axios.get(
      `/v2/complaint/${complaintId}`
    );

    console.log("response", res);

    
    if (res?.status === 200) {
      setSelectedComplaint(res?.data);
      return { success: true, data: res?.data };
    }

    return { success: false };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  } finally {
    setLoading(false);
  }
}


const addComplaintComment = async ({ complaintId, message }) => {
  // setCommentsLoading(true);

  console.log("complaintId", complaintId , message);
  

  try {
    const axios = getAxios();
    const res = await axios.post(
      `/v2/complaint/add-comment/${complaintId}`,
      { message },
      { headers: { "Content-Type": "application/json" } }
    );
     console.log("complaintId", res);

    if (res.status === 201 || res.status === 200) {
      await getParticularComplaint(complaintId);
console.log("rescomment",res)
      return {
        success: true,
        message: res.data || "Comment added successfully",
      };
    }

    return { success: false, message: "Failed to add comment" };
  } catch (err) {
         console.log("complaintId", err);
    return { success: false, message: getErrorMessage(err) };
  } finally {
    setCommentsLoading(false);
  }
};

const complaintsViewUpdates = async ({ hostelId, complaintsId }) => {
  setLoading(true);
  setComplaintUpdates([]);

  try {
    const axios = getAxios();
    const res = await axios.get(
      `/v2/complaint/updates/${hostelId}/${complaintsId}`
    );

    if (res?.status === 200) {
      const data = Array.isArray(res?.data?.complaintUpdates) ? res?.data?.complaintUpdates : [];
      setComplaintUpdates(data);
      return { success: true, data };
    }

    return { success: false, data: [] };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
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
        selectedComplaint,
        complaintUpdates,
        fetchComplaintTypes,
        addComplaintType,
        editComplaintType,
        deleteComplaintType,
        GetComplaintListDetails,
        AddComplaint,
        EditComplaint,
        deleteComplaint,
        changeComplaintStatus,
        assignComplaint,
        getParticularComplaint,  
        addComplaintComment,
        complaintsViewUpdates  
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}
