import React, { createContext, useState, useContext } from "react";
import AxiosConfig from "../Config/AxiosConfig";
import { Alert } from "react-native";
import { retriveData } from '../Utils/Storage';

export const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");


const addGeneral = async (formData) => {
  try {
    const token = await retriveData("token");

    const response = await AxiosConfig.post(
      "/v2/profile/add-admin",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;

  } catch (err) {
    console.log("API ERROR:", err.response?.data || err.message);
    return null;
  }
};








const getAdminList = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const response = await AxiosConfig.get("/v2/profile/admin-list");
      console.log('response',response)

      setLoading(false);
      return response.data;

    } catch (error) {
      setLoading(false);
      console.log("ADMIN LIST API ERROR:", error.response ?? error.message);
      setErrorMsg("Failed to fetch admin list");
      return null;
    }
  };

  return (
    <GeneralContext.Provider
      value={{
        addGeneral,
        getAdminList,
        loading,
        errorMsg,
        successMsg,
        setErrorMsg,
        setSuccessMsg,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneral = () => useContext(GeneralContext);
