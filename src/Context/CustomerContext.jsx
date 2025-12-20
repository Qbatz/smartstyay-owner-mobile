import React, { createContext, useContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";
import { retriveData } from "../Utils/Storage";

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")

  const [ParticularcustomerDetails, setParticularCustomerDetails] = useState(null);

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";

  const getCustomersByHostel = async (
    hostelId,
    name = "",
    type = ""
  ) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token = await retriveData("token");

      const response = await AxiosConfig.get(
        `/v2/customers/${hostelId}`,
        {
          params: {
            ...(name && { name }),
            ...(type && { type }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      return response.data;

    } catch (error) {
      setLoading(false);
      const msg =
        error.response?.data?.message || "Customer fetch failed";
      console.log("CUSTOMER API ERROR:", msg);
      setErrorMsg(msg);
      return [];
    }
  }


  const GetParticularCustomerDetails = async (customerId) => {
    if (!customerId) return { success: false };

    try {
      setLoading(true);
      setErrorMsg("");

      const token = await retriveData("token");

      const res = await AxiosConfig.get(
        `/v2/customers/details/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setParticularCustomerDetails(res.data); // 🔥 STORE DATA
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (error) {
      const msg = getErrorMessage(error);
      console.log("CUSTOMER DETAILS ERROR:", msg);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const resetParticularCustomer = () => {
    setParticularCustomerDetails(null);
  };


  const addCustomer = async (hostelId, payloads, image) => {
    try {
      const token = await retriveData("token");

      const formData = new FormData();

      formData.append("customerInfo", {
        string: JSON.stringify(payloads.customerInfo),
        type: "application/json",
      });

      if (image?.uri) {
        formData.append("profilePic", {
          uri: image.uri,
          type: image.type || "image/jpeg",
          name: image.fileName || "profile.jpg",
        });
      }

      const res = await AxiosConfig.post(
        `/v2/customers/${hostelId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { success: true, data: res.data };

    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data ||
          "Customer already exists with this mobile number",
        status: error?.response?.status,
      };
    }
  };




  const getBedsByHostelAndDate = async (hostelId, joiningDate) => {
    try {
      const token = await retriveData("token");

      const res = await AxiosConfig.get(
        `/v2/bed/initialize/${hostelId}`,
        {
          params: {
            joiningDate, // DD-MM-YYYY
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (error) {
      console.log("BED INIT ERROR:", error?.response?.data);
      return { success: false };
    }
  };


  const checkInCustomer = async (customerId, payload) => {
    try {
      const token = await retriveData("token");

      const res = await AxiosConfig.post(
        `/v2/customers/check-in/${customerId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true, data: res.data };
    } catch (error) {
      console.log("CHECK-IN ERROR:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "Check-in failed",
      };
    }
  };


  const deleteCustomer = async (hostelId, customerId) => {
    try {
      const token = await retriveData("token");

      const res = await AxiosConfig.delete(
        `/v2/customers/${hostelId}/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      return { success: true, data: res.data };
    } catch (error) {
      console.log("DELETE CUSTOMER ERROR:", error?.response?.data);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Unable to delete customer",
      };
    }
  };

  const changeBedCustomer = async (hostelId, customerId, payload) => {
    try {
      const token = await retriveData("token");

      const res = await AxiosConfig.post(
        `/v2/customers/change-bed/${hostelId}/${customerId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (error) {
      console.log("CHANGE BED ERROR:", error?.response?.data);
      return {
        success: false,
        message:
          error?.response?.data?.message || "Change bed failed",
      };
    }
  };
  const getCustomerDetails = async (customerId) => {
    if (!customerId) {
      return { success: false, message: "CustomerId missing" };
    }

    try {
      const token = await retriveData("token");

      const res = await AxiosConfig.get(
        `/v2/customers/details/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        return { success: true, data: res.data };
      }

      return { success: false, message: "Failed to fetch customer details" };
    } catch (error) {
      console.log("CUSTOMER DETAILS ERROR:", error?.response?.data);
      return {
        success: false,
        message:
          error?.response?.data?.message || "Something went wrong",
      };
    }
  };


  return (
    <CustomerContext.Provider
      value={{
        getCustomersByHostel,
        GetParticularCustomerDetails,
        ParticularcustomerDetails,
        resetParticularCustomer,
        loading,
        errorMsg,
        addCustomer, getBedsByHostelAndDate, checkInCustomer, deleteCustomer, changeBedCustomer, getCustomerDetails
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);
