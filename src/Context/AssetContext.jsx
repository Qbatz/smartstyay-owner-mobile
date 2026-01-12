import React, { createContext, useState, useContext } from "react";
import AxiosConfig from "../Config/AxiosConfig";

export const AssetContext = createContext();

export const AssetProvider = ({ children }) => {
  const [assetList, setAssetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getErrorMessage = (err) =>
    err?.response?.data?.message ||
    err?.response?.data ||
    "Something went wrong";

 
  const getAllAssets = async (hostelId) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await AxiosConfig.get(`/v2/assets/${hostelId}`);

      if (res.status === 200) {
        setAssetList(res.data || []);
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (err) {
      console.log("GET ASSET ERROR 👉", err.response?.data);
      setErrorMsg(getErrorMessage(err));
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };


  const deleteAsset = async (assetId, hostelId) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await AxiosConfig.delete(`/v2/assets/${assetId}`);

      if (res.status === 200) {
        await getAllAssets(hostelId);
        return {
          success: true,
          message: "Asset deleted successfully",
        };
      }

      return { success: false };
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <AssetContext.Provider
      value={{
        assetList,
        loading,
        errorMsg,
        getAllAssets,
        deleteAsset,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

