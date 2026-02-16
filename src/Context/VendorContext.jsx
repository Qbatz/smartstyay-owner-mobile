import React, { createContext, useState, useContext } from "react";
import { getAxios } from "../Config/AxiosConfig";
import { CommonContexts } from "../Context/CommonContext";

export const VendorContext = createContext();

export default function VendorProvider({ children }) {
  const [vendorList, setVendorList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (err) =>
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    "Something went wrong";

  const getVendorList = async (hostelId) => {
    setLoading(true);
    setVendorList([]);

    try {
      const axios = getAxios();
      const res = await axios.get(`/v2/vendors/all-vendors/${hostelId}`);

      if (res.status === 200) {
        setVendorList(res.data || []);
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (err) {
      console.log("Vendor list error:", err?.response?.data || err);
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD VENDOR
 const addVendor = async ({ profilePic, payLoads, hostelId }) => {
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("payLoads", {
      string: JSON.stringify(payLoads),
      type: "application/json",
      name: "blob",
    });

    if (profilePic?.uri) {
      formData.append("profilePic", {
        uri: profilePic.uri,
        name: profilePic.fileName || "vendor.jpg",
        type: profilePic.type || "image/jpeg",
      });
    }

    const axios = getAxios()
    const res = await axios.post("/v2/vendors", formData);

    if (res.status === 200 || res.status === 201) {
      await getVendorList(hostelId);
      return { success: true, data: res.data };
    }

    return { success: false, message: "Failed" };
  } catch (err) {
    console.log("ADD VENDOR ERROR 👉", err?.response?.data || err);
    return { success: false, message: err?.response?.data?.message || "Something went wrong" };
  } finally {
    setLoading(false);
  }
};


  // ✅ UPDATE VENDOR
  const updateVendor = async ({ profilePic, updateVendor, hostelId }) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("updateVendor", JSON.stringify(updateVendor));

      if (profilePic?.uri) {
        formData.append("profilePic", {
          uri: profilePic.uri,
          name: profilePic.fileName || "vendor.jpg",
          type: profilePic.type || "image/jpeg",
        });
      }

      const axios = getAxios();
      const res = await axios.put(
        `/v2/vendors/${updateVendor.vendorId}`,
        formData
      ); // ✅ no headers

      if (res.status === 200) {
        await getVendorList(hostelId);
        return { success: true, data: res.data };
      }

      return { success: false, message: "Failed to update vendor" };
    } catch (err) {
      console.log("UPDATE VENDOR ERROR 👉", err?.response?.data || err);
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
        return { success: true, message: "Vendor deleted successfully" };
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
