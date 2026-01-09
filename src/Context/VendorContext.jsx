import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";

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
      const res = await AxiosConfig.get(
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
        formData.append("profilePic", profilePic);
      }

      if (payLoads) {
        formData.append(
          "payLoads",
          new Blob([JSON.stringify(payLoads)], {
            type: "application/json",
          })
        );
      }

      const res = await AxiosConfig.post("/v2/vendors", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201 || res.status === 200) {
        await getVendorList(hostelId);
        return {
          success: true,
          message: res.data || "Vendor added successfully",
        };
      }

      return { success: false, message: "Failed to add vendor" };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

 
  const updateVendor = async ({ profilePic, updateVendor, hostelId }) => {
    setLoading(true);

    try {
      const formData = new FormData();

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      if (updateVendor) {
        formData.append(
          "updateVendor",
          new Blob([JSON.stringify(updateVendor)], {
            type: "application/json",
          })
        );
      }

      const res = await AxiosConfig.put(
        `/v2/vendors/${updateVendor.vendorId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        await getVendorList(hostelId);
        return {
          success: true,
          message: res.data || "Vendor updated successfully",
        };
      }

      return { success: false, message: "Failed to update vendor" };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };


  const deleteVendor = async (vendorId, hostelId) => {
    setLoading(true);

    try {
      const res = await AxiosConfig.delete(`/v2/vendors/${vendorId}`);

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
