import React, { createContext, useState } from "react";
import { getAxios } from "../Config/AxiosConfig";

export const BankingContext = createContext();

export default function BankingProvider({ children }) {
  const [bankList, setBankList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [responsiblePersonList, setResponsiblePersonList] = useState([]);
  const [bankOverview, setBankOverview] = useState(null);
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

      const axios = getAxios()
      const res = await axios.put(`/v2/bank/money/${hostelId}`, {
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
  }

  //new apis ==>
  const NewgetBankList = async (hostelId, page = 1, size = 10) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.get(`/v3/bank/${hostelId}`, {
        params: {
          page,
          size,
        },
      })


      if (res.status === 200) {
        console.log("res", res.data);

        const banks = res?.data?.banks || res.data?.data || res.data?.banks || [];

        setBankList(banks);

        return {
          success: true,
          data: banks,
          response: res.data,
        };
      }

      return {
        success: false,
        message: "Failed to fetch bank list",
      };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);

      return {
        success: false,
        message: msg,
      };
    } finally {
      setLoading(false);
    }
  };


  const createBankAccount = async (hostelId, payload) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.post(`/v3/bank/${hostelId}`, payload);

      if (res?.status === 200 || res?.status === 201) {
        await NewgetBankList(hostelId);

        return {
          success: true,
          message: res.data,
        };
      }

      return {
        success: false,
        message: "Failed to create account",
      };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);

      return {
        success: false,
        message: msg,
      };
    } finally {
      setLoading(false);
    }
  };


  const getResponsiblePersonList = async (hostelId) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.get(
        `/v3/bank/responsiblePerson/${hostelId}`
      );

      if (res.status === 200) {
        const users = Array.isArray(res.data) ? res.data : [];

        setResponsiblePersonList(users);

        return {
          success: true,
          data: users,
        };
      }

      return {
        success: false,
        message: "Failed to fetch responsible persons",
      };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);

      return {
        success: false,
        message: msg,
      };
    } finally {
      setLoading(false);
    }
  };


  const getAllTransactions = async (
    hostelId,
    page = 1,
    size = 20,
    filters = {}
  ) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const params = {
        page,
        size,
        ...(filters.dateFilter && { dateFilter: filters.dateFilter }),
        ...(filters.source && { source: filters.source }),
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate }),
      };

      const res = await axios.get(
        `/v3/bank/allTransactions/${hostelId}`,
        { params }
      );

      if (res.status === 200) {
        console.log("All Transactions =>", res.data);

        const transactions =
          res.data?.list ||
          res.data?.data ||
          res.data?.transactions ||
          res.data ||
          [];

        setTransactionList(transactions);

        return {
          success: true,
          data: transactions,
          response: res.data,
        };
      }

      return {
        success: false,
        message: "Failed to fetch transactions",
      };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);

      return {
        success: false,
        message: msg,
      };
    } finally {
      setLoading(false);
    }
  };

  const getBankOverview = async (
    hostelId,
    bankId,
    dateFilter = ""
  ) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const params = {};

      if (dateFilter) {
        params.dateFilter = dateFilter;
      }

      const res = await axios.get(
        `/v3/bank/overview/${hostelId}/${bankId}`,
        { params }
      );

      if (res.status === 200) {
        const overview = res.data || {};

        setBankOverview(overview);

        return {
          success: true,
          data: overview,
        };
      }

      return {
        success: false,
        message: "Failed to fetch bank overview",
      };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);

      return {
        success: false,
        message: msg,
      };
    } finally {
      setLoading(false);
    }
  };


  return (
    <BankingContext.Provider
      value={{
        bankList,
        transactionList,
        responsiblePersonList,
        bankOverview , 
        loading,
        errorMsg,
        getBankListByHostel,
        addBanking,
        editBanking,
        AddBankAmount,
        createBankAccount, NewgetBankList, getResponsiblePersonList, getAllTransactions , getBankOverview
      }}
    >
      {children}
    </BankingContext.Provider>
  );
}
