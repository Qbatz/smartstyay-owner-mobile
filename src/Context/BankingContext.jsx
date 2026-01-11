import React, { createContext, useState } from "react";
import AxiosConfig, {getAxios} from "../Config/AxiosConfig";

export const BankingContext = createContext();

export default function BankingProvider({ children }) {
  const [bankList, setBankList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";


  const getBankListByHostel = async (hostelId) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const axios = getAxios();
      const res = await axios.get(`/v2/bank/${hostelId}`);

      if (res.status === 200) {
        const banks = res.data?.listBanks || [];
        const transaction = res.data?.listTransactions || [];
        setBankList(banks);
        setTransactionList(transaction)

        return { success: true, data: banks };
      }

      return { success: false, message: "Failed to fetch banks" };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <BankingContext.Provider
      value={{
        bankList,
        transactionList,
        loading,
        errorMsg,
        getBankListByHostel,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
}
