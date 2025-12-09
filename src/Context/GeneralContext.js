import React, { createContext, useState, useContext } from "react";
import AxiosConfig from "../Config/AxiosConfig";
import { Alert } from "react-native";

export const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

const addGeneral = async (params) => {
  try {
    const formData = new FormData();

    // send JSON as string
    formData.append("accountInfo", JSON.stringify(params.accountInfo));

    // append image only if exists
    if (params.profilePic) {
      formData.append("profilePic", {
        uri: params.profilePic.uri,
        type: params.profilePic.type || "image/jpeg",
        name: params.profilePic.name || "photo.jpg"
      });
    }

    const response = await AxiosConfig.post(
      "/v2/profile/add-admin",
      formData
    );

    return response;

  } catch (error) {
    console.log("ERR:", error.response?.data);
    return null;
  }
};




  return (
    <GeneralContext.Provider
      value={{
        addGeneral,
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
