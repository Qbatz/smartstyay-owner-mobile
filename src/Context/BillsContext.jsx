import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";

export const BillContext = createContext();

export default function BillsProvider({ children }) {
  const [BillDetails, setBillDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";

  const GetAllBillDetails = async (hostelId) => {
    setLoading(true);
    try {
      const res = await AxiosConfig.get(`v2/bills/${hostelId}`);

      if (res.status === 200) {
        setBillDetails(res?.data || []);
        return { success: true, data: res?.data || [] };
      }
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  return (
    <BillContext.Provider
      value={{
        BillDetails,
        loading,
        GetAllBillDetails,
      }}
    >
      {children}
    </BillContext.Provider>
  );
}
