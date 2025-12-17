import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";

export const BillContext = createContext();

export default function BillsProvider({ children }) {
  const [BillDetails, setBillDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";

 
  const GetAllBillDetails = async (hostelId) => {
    try {
      setLoading(true);
      const res = await AxiosConfig.get(`v2/bills/${hostelId}`);

      if (res.status === 200) {
        setBillDetails(res.data || []);
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };


  const CreateManualBill = async (payload, hostelId) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await AxiosConfig.post(
        `/v2/bills/manual/${payload.customerId}`,
        payload
      );


      if (res.status === 200 || res.status === 201) {
        // if (hostelId) {
        //   await GetAllBillDetails(hostelId); 
        // }

        return { success: true, data: res.data };
      }

      return { success: false, message: "Failed to create bill" };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <BillContext.Provider
      value={{
        BillDetails,
        loading,
        errorMsg,
        GetAllBillDetails,
        CreateManualBill,
      }}
    >
      {children}
    </BillContext.Provider>
  );
}
