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

  const addAsset = async (payload) => {
  setLoading(true);
  setErrorMsg("");

  try {
    const res = await AxiosConfig.post(
      `/v2/assets/${payload.hostelId}`,
      payload
    );

    if (res.status === 200) {
      await getAllAssets(payload.hostelId);

      return {
        success: true,
        data: res.data,
        message: "Asset created successfully",
      };
    }

    return { success: false };
  } catch (err) {
    const msg =
      err?.response?.data === "Serial number already exists"
        ? "Serial number already exists"
        : err?.response?.data || "Failed to add asset";

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
}

const handleUpdateAsset = async (payload) => {
  setLoading(true);
  setErrorMsg("");

  try {
    const res = await AxiosConfig.put(
      `/v2/assets/${payload.hostelId}/${payload.assetId}`,
      payload
    );

    if (res.status === 200) {
      await getAllAssets(payload.hostelId);

      return {
        success: true,
        data: res.data,
        message: "Asset updated successfully",
      };
    }

    return { success: false };
  } catch (err) {
    console.log("UPDATE ASSET ERROR", err?.response);

    const msg =
      err?.response?.status === 403
        ? "You don’t have permission to update this asset"
        : err?.response?.data || "Failed to update asset";

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};


const assignAsset = async (payload) => {
  setLoading(true);
  setErrorMsg("");

  try {
    const res = await AxiosConfig.put(
      `/v2/assets/assign/${payload.assetId}`,
      payload
    );

    if (res.status === 200) {
      // refresh asset list after assign
      await getAllAssets(payload.hostelId);

      return {
        success: true,
        message: res.data || "Asset assigned successfully",
      };
    }

    return { success: false };
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data ||
      "Failed to assign asset";

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
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
        addAsset,
        handleUpdateAsset,
        deleteAsset,
        assignAsset,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

