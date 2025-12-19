import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";

export const BillContext = createContext();

export default function BillsProvider({ children }) {
  const [BillDetails, setBillDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [refundError, setRefundError] = useState("");

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


const RecordPayment = async ({ hostelId, invoiceId, data }) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await AxiosConfig.post(
      `/v2/transaction/${hostelId}/${invoiceId}`,
      data
    );

    if (res.status === 200) {
      await GetAllBillDetails(hostelId);

      return {
        success: true,
        data: res.data,
        statusCode: res.status,
      };
    }

    return {
      success: false,
      message: "Payment failed",
    };
  } catch (error) {
    const msg = getErrorMessage(error);

    if (
      error?.code === "ERR_BAD_REQUEST" &&
      (error?.response?.status === 400 ||
        error?.response?.status === 403)
    ) {
      return {
        success: false,
        payableAmount: error.response.data,
      };
    }

    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};


// GET INITIALIZE REFUND DETAILS
const GetInitializeRefundDetails = async ({ hostelId, invoiceId }) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await AxiosConfig.get(
      `/v2/bills/refund/${hostelId}/${invoiceId}`
    );

    if (res.status === 200) {
      return {
        success: true,
        data: res.data,
        statusCode: res.status,
      };
    }

    return {
      success: false,
      message: "Failed to fetch refund details",
    };
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      "Something went wrong";

    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
  } finally {
    setLoading(false);
  }
};


const CreateRefund = async ({ hostelId, invoiceId, payload }) => {
    try {
      setLoading(true);
      setRefundError("");
 
      const res = await AxiosConfig.post(
        `/v2/transaction/refund/${hostelId}/${invoiceId}`,
        payload
       
      );
 
      if (res.status === 200) {
        return {
          success: true,
          data: res.data,
        };
      }
 
      return { success: false, message: "Refund failed" };
    } catch (error) {
      const status = error?.response?.status;
 
      if (status === 400 || status === 403) {
        setRefundError(error?.response?.data);
        return {
          success: false,
          refundableError: error?.response?.data,
        };
      }
 
      return {
        success: false,
        message: getErrorMessage(error),
      };
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
        refundError,
        GetAllBillDetails,
        CreateManualBill,
        RecordPayment,
        GetInitializeRefundDetails,
        CreateRefund
      }}
    >
      {children}
    </BillContext.Provider>
  )
}
