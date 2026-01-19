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

  const addBanking = async (hostelId, data) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const axios = getAxios();
    const res = await axios.post(`/v2/bank/${hostelId}`, data);

    if (res.status === 201) {
      return { success: true, message: res.data };
    }
    return { success: false, message: "Failed to add bank" };
  } catch (e) {
    const msg = getErrorMessage(e);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};


const editBanking = async (hostelId, bankId, data) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const axios = getAxios();
    const res = await axios.put(`/v2/bank/${hostelId}/${bankId}`, data);

    if (res.status === 200) {
      return { success: true, message: res.data };
    }
    return { success: false, message: "Failed to edit bank" };
  } catch (e) {
    const msg = getErrorMessage(e);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};


const AddBankAmount = async (hostelId, bankId, amount) => {
  try {
    setLoading(true);
    setErrorMsg("");


    const res = await AxiosConfig.put(`/v2/bank/money/${hostelId}`, {
      bankId,
      balance: amount,
    });

    // 2️⃣ SUCCESS
    if (res.status === 200) {
      await getBankListByHostel(hostelId);

      return {
        success: true,
        message: res.data,
      };
    }

    return {
      success: false,
      message: res?.data?.message || "Failed to add balance",
    };
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
        addBanking,
        editBanking , 
        AddBankAmount
      }}
    >
      {children}
    </BankingContext.Provider>
  );
}
