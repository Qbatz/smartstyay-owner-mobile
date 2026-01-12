import React, { createContext, useState } from "react";
import {getAxios} from "../Config/AxiosConfig";
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

    if (profilePic) {
      formData.append("profilePic", {
        uri: profilePic.uri,
        name: "vendor.jpg",
        type: "image/jpeg",
      });
    }

    // ✅ MUST be Blob (same as website)
    formData.append(
      "payLoads",
      new Blob([JSON.stringify(payLoads)], {
        type: "application/json",
      })
    );
    const axios = getAxios();
    const res = await axios.post("/v2/vendors", formData);
    // ❌ DO NOT pass headers manually

    console.log("res", res);
    

    if (res.status === 201 || res.status === 200) {
      await getVendorList(hostelId);
      return { success: true, message: res.data };
    }

    return { success: false };
  } catch (err) {
    console.log("ADD VENDOR ERROR 👉", err.response?.data);
    return { success: false, message: getErrorMessage(err) };
  } finally {
    setLoading(false);
  }
};





 
 

const updateVendor = async ({ profilePic, updateVendor, hostelId }) => {
  setLoading(true);
  try {
    const formData = new FormData();
        const token = await retriveData("token");

        console.log("token", token);
        

    if (profilePic) {
      formData.append("profilePic", {
        uri: profilePic.uri,
        name: "vendor.jpg",
        type: "image/jpeg",
      });
    }

    // ✅ MUST be Blob (NOT string)
    formData.append(
      "updateVendor",
      new Blob([JSON.stringify(updateVendor)], {
        type: "application/json",
      })
    );
    const axios = getAxios();
    const res = await axios.put(
      `/v2/vendors/${updateVendor.vendorId}`,
      formData ,
       {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
    )
    // ❌ DO NOT set Content-Type

    if (res.status === 200) {
      await getVendorList(hostelId);
      return { success: true, message: res.data };
    }

    return { success: false };
  } catch (err) {
    console.log("UPDATE ERROR 👉", err.response?.data);
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
