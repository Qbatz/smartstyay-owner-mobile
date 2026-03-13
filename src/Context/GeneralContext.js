import React, { createContext, useState, useContext } from "react";
import {getAxios} from "../Config/AxiosConfig";
import { Alert } from "react-native";
import { retriveData } from '../Utils/Storage';

export const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [mailError, setMailError] = useState("")


  const addGeneral = async (formData) => {
    try {
      const token = await retriveData("token");
      const axios = getAxios();
      const response = await axios.post(
        "/v2/profile/add-admin",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("ResponseAdd", response)
      return response;

    }
    catch (err) {
      const errorData = err.response?.data || { message: err.message };

      console.log("API ERROR:", errorData);


      return { success: false, data: errorData }; // IMPORTANT FIX
    }

  };



  const updateGeneral = async (adminId, formData) => {
    try {
      const token = await retriveData("token");
      const axios = getAxios();
      const response = await axios.put(
        `/v2/profile/admin/${adminId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("responseupdate", response)

      return response.data;

    } catch (error) {
      console.log("UPDATE ERROR:", error.response?.data || error.message);
      return null;
    }
  };


  const deleteGeneral = async (userId) => {
    try {
      const token = await retriveData("token");
      const axios = getAxios();
      const response = await axios.delete(
        `/v2/profile/delete-admin/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DELETE SUCCESS:", response.data);
      return { success: true, data: response.data };

    } catch (err) {
      const errorData = err.response?.data || { message: err.message };
      console.log("DELETE ERROR:", errorData);

      return { success: false, data: errorData };
    }
  };



  const getAdminList = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const axios = getAxios();
      const response = await axios.get("/v2/profile/admin-list");
      console.log('response', response)

      setLoading(false);
      setSuccessMsg("General Added Successfully ✔");
      return response.data;

    } catch (error) {
      setLoading(false);
      console.log("ADMIN LIST API ERROR:", error.response ?? error.message);
      setErrorMsg("Failed to fetch admin list");
      return null;
    }
  };

  const changePassword = async (adminId, newPassword) => {
  try {
    const token = await retriveData("token");

    const body = {
      adminId,
      password: newPassword
    };
    const axios = getAxios();
    const response = await axios.post(
      "/v2/profile/change-password",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Password Change SUCCESS:", response);
    return { success: true, data: response.data };

  } catch (err) {
    const errorData = err.response?.data || { message: err.message };
    console.log("Password Change ERROR:", errorData);

    return { success: false, data: errorData };
  }
};

 const updateProfile =async(formData)=>{
  console.log("for",formData)
    try{
      const token = await retriveData("token");
      const axios = getAxios();
      const res=await axios.put("/v2/profile", formData ,{
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },

      });
      console.log(res)
      return { success: true, data: res.data }
    }catch (error) {
      const errorData = error.response?.data || { message: error.message }
      return {success: false, data: errorData };
    }
 }

 const AdminResetPassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();

    const body = {
      currentPassword,
      newPassword,
      confirmPassword
    };

    const response = await axios.post(
      "/v2/profile/reset-password",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("RESET PASSWORD SUCCESS:", response.data);

    return { success: true, data: response.data };

  } catch (err) {
    const errorData = err.response?.data || { message: err.message };
    console.log("RESET PASSWORD ERROR:", errorData);

    return { success: false, data: errorData };
  }
};


  return (
    <GeneralContext.Provider
      value={{
        addGeneral,
        getAdminList,
        updateGeneral,
        deleteGeneral,
        changePassword,
        loading,
        errorMsg,
        successMsg,
        setErrorMsg,
        setSuccessMsg,
        updateProfile,
        AdminResetPassword,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneral = () => useContext(GeneralContext);
