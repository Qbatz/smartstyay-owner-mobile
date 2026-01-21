import React, { createContext, useState } from "react";
import AxiosConfig, {getAxios} from "../Config/AxiosConfig";
import { retriveData } from "../Utils/Storage";

export const VendorContext = createContext();

export default function VendorProvider({ children }) {
  const [vendorList, setVendorList] = useState([]);
  const [loading, setLoading] = useState(false);


  const getErrorMessage = (err) =>
    err?.response?.data?.message ||
    err?.response?.data ||
    "Something went wrong";

 
  const getVendorList = async (hostelId) => {
    setLoading(true);
    setVendorList([]);

    try {
      const axios = getAxios();
      const res = await axios.get(
        `/v2/vendors/all-vendors/${hostelId}`
      );

      if (res.status === 200) {
        setVendorList(res.data || []);
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (err) {
      console.log("Vendor list error:", err);
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

 
const addVendor = async ({ profilePic, payLoads, hostelId }) => {
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("payLoads", {
      string: JSON.stringify(payLoads),
      type: "application/json",
      name: "blob",
    });

    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    const res = await AxiosConfig.post("/v2/vendors", formData);

    if (res.status === 200 || res.status === 201) {
      await getVendorList(hostelId);
      return { success: true, message: res.data };
    }

    return { success: false };
  } catch (err) {
    console.log("ADD VENDOR ERROR 👉", err?.response?.data);
    return { success: false, message: getErrorMessage(err) };
  } finally {
    setLoading(false);
  }
};







 
 
const updateVendor = async ({ profilePic, updateVendor, hostelId }) => {
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("updateVendor", {
      string: JSON.stringify(updateVendor),
      type: "application/json",
      name: "blob",
    });

    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    const res = await AxiosConfig.put(
      `/v2/vendors/${updateVendor.vendorId}`,
      formData
    );

    if (res.status === 200) {
      await getVendorList(hostelId);
      return { success: true, message: res.data };
    }

    return { success: false };
  } catch (err) {
    console.log("UPDATE VENDOR ERROR 👉", err?.response?.data);
    return { success: false, message: getErrorMessage(err) };
  } finally {
    setLoading(false);
  }
};



  const deleteVendor = async (vendorId, hostelId) => {
    setLoading(true);

    try {
      const axios = getAxios();
      const res = await axios.delete(`/v2/vendors/${vendorId}`);

      if (res.status === 200) {
        await getVendorList(hostelId);
        return {
          success: true,
          message: "Vendor deleted successfully",
        };
      }

      return { success: false, message: "Failed to delete vendor" };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorContext.Provider
      value={{
        vendorList,
        loading,
        getVendorList,
        addVendor,
        updateVendor,
        deleteVendor,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}
