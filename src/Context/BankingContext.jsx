import React, { createContext, useState } from "react";
import { getAxios } from "../Config/AxiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BankingContext = createContext();

export default function BankingProvider({ children }) {
  const [bankList, setBankList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [responsiblePersonList, setResponsiblePersonList] = useState([]);
  const [bankOverview, setBankOverview] = useState(null);
  const [bankTransactionHistory, setBankTransactionHistory] = useState([]);
  const [upiAppList, setUpiAppList] = useState([]);
  const [bankMethod, setBankMethod] = useState(null);
  const [transferInitialize, setTransferInitialize] = useState(null);
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

        const transactions = res?.data || []

        setBankList(res?.data?.bankList)
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
  }


  const getBankTransactionHistory = async (
  hostelId,
  bankId,
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
      `/v3/bank/allBankTransactions/${hostelId}/${bankId}`,
      { params }
    );

    if (res.status === 200) {
      console.log("Bank Transaction History =>", res.data);

      const transactions =
        res.data?.transactions ||
        res.data?.list ||
        res.data?.data ||
        res.data ||
        [];

      setBankTransactionHistory(transactions);

      return {
        success: true,
        data: transactions,
        response: res.data,
      };
    }

    return {
      success: false,
      message: "Failed to fetch bank transactions",
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
}

const getQrCardTypeList = async (type = "UPI") => {
  try {
    setLoading(true);
    setErrorMsg("");

    const axios = getAxios();

    const res = await axios.get("/v3/bank/qrCardType", {
      params: {
        type,
      },
    });

    if (res.status === 200) {
      const list = Array.isArray(res.data) ? res.data : [];

      setUpiAppList(list);

      return {
        success: true,
        data: list,
      };
    }

    return {
      success: false,
      message: "Failed to fetch QR/Card Type list",
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
}
;

const getBankMethod = async (hostelId, bankId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const axios = getAxios();

    const res = await axios.get(
      `/v3/bank/bankMethod/${hostelId}/${bankId}`
    );

    if (res.status === 200) {
      const method = res.data || {};

      setBankMethod(method);

      return {
        success: true,
        data: method,
      };
    }
    return {
      success: false,
      message: "Failed to fetch bank method",
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
}

const addMoneyInvestment = async (hostelId, payload) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const axios = getAxios();

    const res = await axios.put(
      `/v3/bank/addMoney/${hostelId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        data: res.data,
      };
    }

    return {
      success: false,
      message: "Failed to add investment",
    };
  } catch (error) {
    console.log("ADD MONEY ERROR =>", error?.response?.status);
    console.log("ADD MONEY DATA =>", error?.response?.data);

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


const getTransferInitialize = async (
  hostelId,
  bankId,
  paymentMethodId = ""
) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const axios = getAxios();

    const params = {};

    if (paymentMethodId) {
      params.paymentMethodId = paymentMethodId;
    }

    const res = await axios.get(
      `/v3/bank/transfer/initialize/${hostelId}/${bankId}`,
      {
        params,
      }
    );

    if (res.status === 200) {
      const data = res.data || {};

      console.log("Transfer Initialize =>", data);

      setTransferInitialize(data);

      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      message: "Failed to fetch transfer initialize",
    };

  } catch (error) {
    console.log(
      "TRANSFER INITIALIZE ERROR =>",
      error?.response?.status
    );
    console.log(
      "TRANSFER INITIALIZE DATA =>",
      error?.response?.data
    );

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


const moneyTransfer = async (hostelId, payload) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const axios = getAxios();

    const res = await axios.put(
      `/v3/bank/moneyTransfer/${hostelId}`,
      {
        fromBankId: payload.fromBankId,
        toBankId: payload.toBankId,
        amount: Number(payload.amount),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        data: res.data,
      };
    }

    return {
      success: false,
      message: "Failed to transfer money",
    };
  } catch (error) {
    console.log("MONEY TRANSFER STATUS =>", error?.response?.status);
    console.log("MONEY TRANSFER DATA =>", error?.response?.data);

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
        bankTransactionHistory ,
        upiAppList ,
        bankMethod ,
        transferInitialize,
        loading,
        errorMsg,
        getBankListByHostel,
        addBanking,
        editBanking,
        AddBankAmount,
        createBankAccount, NewgetBankList, getResponsiblePersonList, getAllTransactions , 
        getBankOverview , getBankTransactionHistory , getQrCardTypeList  ,
        getBankMethod , addMoneyInvestment , getTransferInitialize , moneyTransfer
      }}

    >
      {children}
    </BankingContext.Provider>
  );
}
