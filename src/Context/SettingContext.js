import React, { createContext, useContext,useState } from "react";
import AxiosConfig, {getAxios} from "../Config/AxiosConfig";
import { retriveData } from "../Utils/Storage";


const ElectricityContext = createContext();
export const UseSetting = () => useContext(ElectricityContext);


export const SettingProvider = ({ children }) => {
const [loading, setLoading] = useState(false);
const getElectricity = async (hostelId) => {
  try {
    setLoading(true)
    const token = await retriveData("token");
console.log("token",token , hostelId)
const axios = getAxios();
    const res = await AxiosConfig.get(
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
      const res = await getAxios.put(
        `/v2/hostel/electricity/${hostelId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("UPDATE EB SUCCESS →", res.data);
      return { success: true, data: res.data };

    } catch (err) {
      console.log("UPDATE EB ERROR →", err.response?.data);
      return { success: false, data: err.response?.data };
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
    return { success: false, data: err.response?.data };
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

  return (
    <ElectricityContext.Provider value={{ getElectricity,updateElectricity,changeRoomHostelElectricity ,getBillingConfig,addBillingRecurring,getRoleByHostel,
    getRoleModules,addRole,updateRole,deleteRole,loading,setLoading,getUsersByHostel,addUser,updateUser,deleteUser}}>
      {children}
    </ElectricityContext.Provider>
  );
};
