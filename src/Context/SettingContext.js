import React, { createContext, useContext,useState } from "react";
import {getAxios} from "../Config/AxiosConfig";
import { retriveData } from "../Utils/Storage";
import qs from "qs";

const ElectricityContext = createContext();
export const UseSetting = () => useContext(ElectricityContext);


export const SettingProvider = ({ children }) => {
const [loading, setLoading] = useState(false);
  const [Reportsdetails , setReportsDetails] = useState(null)
  const [invoiceReports, setInvoiceReports] = useState(null);
const getElectricity = async (hostelId) => {
  try {
    setLoading(true)
    const token = await retriveData("token");
console.log("token",token , hostelId)
const axios = getAxios();
    const res = await axios.get(
      `/v2/hostel/electricity/${hostelId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("res", res);
    
    
    return { success: true, data: res.data }; 

  } catch (err) {
    return { success: false, data: err.response?.data || err.message };
  }
  finally{
     setLoading(false)
  }
};



const updateElectricity = async (hostelId, unitPrice) => {
    try {
      const token = await retriveData("token");

      const body = { unitPrice };
      const axios = getAxios();
      const res = await axios.put(
        `/v2/hostel/electricity/${hostelId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("res", res);
      

      console.log("UPDATE EB SUCCESS →", res.data);
      return { success: true, data: res.data };

    } catch (err) {
      console.log("UPDATE EB ERROR →", err);
      return { success: false, data: err.response?.data };
    }
  };

const NewupdateElectricityRule = async (hostelId, payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();

const query = new URLSearchParams({
  typeofReading: payload.typeOfReading,   // ✅ FIX
  charge: payload.charge ?? 0,
  shouldIncludeInRent: payload.shouldIncludeInRent,
  frequent: payload.frequent || "MONTHLY",
}).toString();;

    const url = `/v2/hostel/electricity/config/${hostelId}?${query}`;

    console.log("EB CONFIG URL →", url);

    const res = await axios.put(url, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: res.data };

  } catch (err) {
    console.log("EB CONFIG ERROR →", err?.response?.data);
    return { success: false, data: err?.response?.data };
  }
};

const changeRoomHostelElectricity = async (payload) => {
  try {
    const token = await retriveData("token");

    const query = new URLSearchParams({
      isRoomBased: payload.isRoomBased,
      isHostelBased: payload.isHostelBased,
      isProRate: payload.isProRate ?? true,
      calculationStartingDate:
        payload.calculationStartingDate ?? Math.floor(Date.now() / 1000), // FIXED!!
      frequent: payload.frequent ?? "monthly",
      shouldIncludeInRent: payload.shouldIncludeInRent ?? true,
    }).toString();

    const url = `/v2/hostel/electricity/config/${payload.hostelId}?${query}`;

    console.log("🔵 FINAL EB CONFIG URL →", url);
    const axios = getAxios();
    const res = await axios.put(url, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("🟢 EB CONFIG SUCCESS →", res.data);
    return { success: true, data: res.data };

  } catch (err) {
    console.log("🔴 EB CONFIG ERROR →", err.response?.data || err.message);
    return { success: false, data: err.response?.data || err.message };
  }
};


const getBillingConfig = async (hostelId) => {
    try {
      setLoading(true);
      const token = await retriveData("token");
      const axios = getAxios();
      const res = await axios.get(
        `/v2/hostel/config/billing/${hostelId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { success: true, data: res.data };

    } catch (err) {
      return { success: false, data: err.response?.data || err.message };
    }
    finally{
      setLoading(false);
    }
  };

const addBillingRecurring = async (payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.put(
      `/v2/hostel/config/billing/${payload.hostelId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return { success: true, data: res.data };

  } catch (err) {
    return { success: false, data: err?.response?.data || err?.messag};
  }
};

const getRoleByHostel = async (hostelId) => {
  try {
    setLoading(true);   // 🔵 START LOADER

    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.get(
      `/v2/role/hostel/${hostelId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true, data: res.data };

  } catch (err) {
    return {
      success: false,
      data: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);  // 🟢 STOP LOADER
  }
};

// const getRoleByHostel = async (hostelId) => {
//    const [loading, setLoading] = useState(false);
//   try {
//     const token = await retriveData("token");

//     const res = await AxiosConfig.get(
//       `/v2/role/hostel/${hostelId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return { success: true, data: res.data };

//   } catch (err) {
//     return {
//       success: false,
//       data: err.response?.data || err.message,
//     };
//   }
// };

const getRoleModules = async () => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.get(
      "/v2/role/modules",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return { success: true, data: res.data };

  } catch (err) {
    return { success: false, data: err.response?.data || err.message };
  }
};
const addRole = async (payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.post(
      "/v2/role",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: res.data };

  } catch (err) {
    return {
      success: false,
      data: err.response?.data || err.message,
    };
  }
};

const updateRole = async (id, payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.put(
      `/v2/role/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, data: err.response?.data || err.message };
  }
};
// SettingContext.js

const deleteRole = async (roleId) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.delete(
      `/v2/role/${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: res.data };

  } catch (err) {
    return {
      success: false,
      data: err.response?.data || err.message,
    };
  }
};
const getUsersByHostel = async (hostelId) => {
  try {
    setLoading(true); 
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.get(
      `/v2/profile/users-list/${hostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: res.data };

  } catch (err) {
    return {
      success: false,
      data: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);
  }
};
const addUser = async (hostelId, payload) => {
  try {
    setLoading(true);

    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.post(
      `/v2/profile/add-user/${hostelId}`, // ✅ IMPORTANT
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: res.data };

  } catch (err) {
    console.log("ADD USER ERROR →", err.response?.data);
    return {
      success: false,
      data: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);
  }
};

const updateUser = async (hostelId, userId, payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.put(
      `/v2/profile/users/${hostelId}/${userId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      data: err.response?.data || err.message,
    };
  }
};
// const deleteUser = async (userId) => {
//   try {
//     const res = await api.delete(`/v2/profile/delete-user/${userId}`);
//     return res.data;
//   } catch (err) {
//     return {
//       success: false,
//       message: err?.response?.data?.message || "Delete failed",
//     };
//   }
// };

const deleteUser = async (userId) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.delete(
      `/v2/profile/delete-user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: res.data };

  } catch (err) {
    return {
      success: false,
      data: err.response?.data || err.message,
    };
  }
};

const getReportsByHostel = async (hostelId) => {
  try {
    setLoading(true);

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.get(
      `/v2/reports/${hostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setReportsDetails(res?.data)
    console.log("REPORTS SUCCESS →", res.data);
    return { success: true, data: res.data };

  } catch (err) {
    console.log("REPORTS ERROR →", err.response?.data || err.message);
    return {
      success: false,
      data: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);
  }
};

const GetInvoiceReports = async (hostelId, filters = {}) => {
  try {
    setLoading(true);

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.get(
      `/v2/reports/invoice/${hostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: filters?.startDate,
          endDate: filters?.endDate,
          search: filters?.search,
          paymentStatus: filters?.paymentStatus,
          invoiceModes: filters?.invoiceModes,
          invoiceTypes: filters?.invoiceTypes,
          createdBy: filters?.createdBy,
          period: filters?.period,
          minPaidAmount: filters?.minPaidAmount,
          maxPaidAmount: filters?.maxPaidAmount,
          minOutstandingAmount: filters?.minOutstandingAmount,
          maxOutstandingAmount: filters?.maxOutstandingAmount,
          page: filters?.page ?? 0,
          size: filters?.size ?? 10,
        },
      }
    );

    setInvoiceReports(res?.data);

    return {
      success: true,
      data: res.data,
    };

  } catch (err) {
    return {
      success: false,
      data: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);
  }
};





const getReceiptRegisterReport = async (hostelId, filters = {}) => {
  try {
    setLoading(true);

    const token = await retriveData("token");
    const axios = getAxios();

    const params = {
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      invoiceType: filters?.invoiceType,
      collectedBy: filters?.collectedBy,
      period: filters?.period,
      paymentMode: filters?.paymentMode,
      page: filters?.page ?? 0,
      size: filters?.size ?? 10,
    };

    // 🔥 Remove undefined keys
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );

    const res = await axios.get(
      `/v2/reports/transaction/${hostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: cleanParams,
    paramsSerializer: (params) =>
  qs.stringify(params, { arrayFormat: "repeat" })
      }
    )

    return {
      success: true,
      data: res.data,
    };

  } catch (err) {
    return {
      success: false,
      data: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);
  }
};


const getTenantRegisterReport = async (hostelId, filters = {}) => {
  try {
    setLoading(true);

    const token = await retriveData("token");
    const axios = getAxios();

    const params = {
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      period: filters?.period,
      status: filters?.status,
      floor: filters?.floor,
      room: filters?.room,
      search: filters?.search,
      sharingType: filters?.sharingType,
      page: filters?.page ?? 0,
      size: filters?.size ?? 10,
    };

    // remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );

    const res = await axios.get(
      `/v2/reports/tenants/${hostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: cleanParams,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      }
    );

    return {
      success: true,
      data: res.data,
    };

  } catch (err) {
    console.log("TENANT REGISTER ERROR →", err.response?.data || err.message);

    return {
      success: false,
      data: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);
  }
};


const GetExpenseRegisterReport = async (hostelId, filters = {}) => {
  try {
    setLoading(true);

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.get(
      `/v2/reports/expense/${hostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: filters?.startDate,
          endDate: filters?.endDate,
          period: filters?.period,
          categoryId: filters?.category,
          paymentMode: filters?.paymentMode,
          createdBy: filters?.createdBy,
          paidTo: filters?.paidTo,
          page: filters?.page ?? 0,
          size: filters?.size ?? 10,
        },
      }
    );

    console.log("EXPENSE REGISTER SUCCESS →", res.data);

    return {
      success: true,
      data: res.data,
    };

  } catch (err) {
    console.log("EXPENSE REGISTER ERROR →", err.response?.data || err.message);

    return {
      success: false,
      data: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);
  }
};

const downloadReceiptReport = async (hostelId) => {
  if (!hostelId) {
    return { success: false, message: "Invalid hostelId" };
  }

  try {
    setLoading(true);

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.get(
      `/v2/reports/download/receipts/${hostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      return {
        success: true,
        url: res.data, 
      };
    }

    return { success: false, message: "Download failed" };

  } catch (err) {
    return {
      success: false,
      message: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);
  }
};

const downloadExpenseReport = async (hostelId) => {
  if (!hostelId) {
    return { success: false, message: "Invalid hostelId" };
  }

  try {
    setLoading(true);

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.get(
      `/v2/reports/download/expense/${hostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      return {
        success: true,
        url: res.data, 
      };
    }

    return { success: false, message: "Download failed" };

  } catch (err) {
    return {
      success: false,
      message: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);
  }
}


const downloadInvoiceReport = async (hostelId) => {
  if (!hostelId) {
    return { success: false, message: "Invalid hostelId" };
  }

  try {
    setLoading(true);

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.get(
      `/v2/reports/download/invoice/${hostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res?.status === 200) {
      return {
        success: true,
        url: res.data, 
      };
    }

    return { success: false, message: "Download failed" };

  } catch (err) {
    return {
      success: false,
      message: err.response?.data || err?.message,
    };
  } finally {
    setLoading(false);
  }
};

const getHostelPlans = async () => {
  try {
    setLoading(true);

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.get(
      `/v2/plans`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("PLANS RESPONSE →", res.data);

    return {
      success: true,
      data: res.data,
    };

  } catch (err) {
    console.log("PLANS ERROR →", err.response?.data || err.message);

    return {
      success: false,
      data: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);
  }
};

const getCurrentHostelPlan = async (hostelId) => {
  try {
    setLoading(true);

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.get(
      `/v2/plans/${hostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("CURRENT PLAN →", res.data);

    return {
      success: true,
      data: res.data,
    };

  } catch (err) {
    console.log("CURRENT PLAN ERROR →", err.response?.data || err.message);

    return {
      success: false,
      data: err.response?.data || err.message,
    };
  } finally {
    setLoading(false);
  }
};

const postSubscription = async(hostelId,payload)=>{
  console.log(hostelId)

  try{
    const token =await retriveData("token");
    console.log(token)
    const axios=await getAxios();

    const response =await axios.post( `/v2/subscription/mobile/subscribe/${hostelId}`, payload,{
     headers: {
          Authorization: `Bearer ${token}`,
        },
    })
    return response;
  }catch(error){
    return {status: error.response.status, message: error.response.data}
  }

}

const verfiyPayment=async(hostelId,paymentId)=>{
  try{
    const token =await retriveData("token");
    console.log(token)
    const axios=await getAxios();

    const response=await axios.get(`/v2/subscription/payment/verify/${hostelId}/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    console.log(response)
    return response;
  }catch(error){
    return {status: error.response.status, message: error.response.data}
  }
}


  return (
    <ElectricityContext.Provider value={{ getElectricity,updateElectricity,changeRoomHostelElectricity ,getBillingConfig,addBillingRecurring,getRoleByHostel,
    getRoleModules,addRole,updateRole,deleteRole,loading,setLoading,getUsersByHostel,addUser,updateUser,deleteUser , getReportsByHostel , Reportsdetails , GetInvoiceReports , invoiceReports , getTenantRegisterReport , GetExpenseRegisterReport , getReceiptRegisterReport , downloadReceiptReport ,
     downloadExpenseReport, downloadInvoiceReport , getHostelPlans , getCurrentHostelPlan , NewupdateElectricityRule,postSubscription,verfiyPayment }}>
      {children}
    </ElectricityContext.Provider>
  );
};
