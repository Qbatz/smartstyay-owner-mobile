import React, { createContext, useState } from "react";
import { getAxios } from "../Config/AxiosConfig";
import { retriveData } from "../Utils/Storage";

export const BillContext = createContext();

export default function BillsProvider({ children }) {
  const [BillDetails, setBillDetails] = useState([]);
  const [recurringBills, setRecurringBills] = useState([]);
  const [receiptsList, setReceiptsList] = useState([]);
  const [BillPdfdetails, setBillsPdfDetails] = useState(null);
  const [ReceiptPdfdetails, setReceiptPdfDetails] = useState(null);
  const [bookingBills, setBookingBills] = useState([]);
  const [InitializebookingBills, setInitailizeBookingBills] = useState([])
  const [advanceCreditDetails, setAdvanceCreditDetails] = useState(null);
  const [InitializeRecordPaymentDetails , setInitializeRecordPaymentDetails] = useState(null)
  const [InitializeDiscountDetails , setInitializeDiscountDetails] = useState(null)
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [refundError, setRefundError] = useState("");
  const [retainerInvoiceDetail,setRetainerInvoiceDetail]=useState(null)


  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";


  // const GetAllBillDetails = async (hostelId) => {
  //   try {
  //     setLoading(true);
  //     const res = await AxiosConfig.get(`v2/bills/new/${hostelId}`);

  //     if (res.status === 200) {
  //       setBillDetails(res.data || []);
  //       return { success: true, data: res.data };
  //     }

  //     return { success: false };
  //   } catch (error) {
  //     const msg = getErrorMessage(error);
  //     setErrorMsg(msg);
  //     return { success: false, message: msg };
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const GetAllBillDetails = async (hostelId, filters = {}) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const axios = getAxios();
      console.log("filters",filters);
      const res = await axios.get(`/v2/bills/${hostelId}`, {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate,
          type: filters.type,
          createdBy: filters.createdBy,
          modes: filters.modes,
          paymentStatus: filters.paymentStatus,
          search: filters.search,
        },
        
        
        paramsSerializer: (params) =>
          Object.keys(params)
            .map((key) => {
              const value = params[key];
              if (Array.isArray(value)) {
                return value.map((v) => `${key}=${v}`).join("&");
              }
              if (value !== undefined && value !== null && value !== "") {
                return `${key}=${value}`;
              }
              return null;
            })
            .filter(Boolean)
            .join("&"),
      });

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
      const axios = getAxios();
      const res = await axios.post(
        `/v2/bills/manual/${payload.customerId}`,
        payload
      );


      if (res.status === 200 || res.status === 201) {
        if (hostelId) {
          await GetAllBillDetails(hostelId);
        }

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

  const UpdateBill = async ({ hostelId, invoiceId, payload }) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.put(
        `/v2/bills/${hostelId}/${invoiceId}`,
        payload
      );

      if (res.status === 200) {
        await GetAllBillDetails(hostelId);

        return { success: true, data: res.data };
      }

      return { success: false, message: "Update failed" };
    } catch (error) {
      const msg = getErrorMessage(error);
      console.log(error)
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
      const axios = getAxios();
      const res = await axios.post(
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


  //  REFUND DETAILS
  const GetInitializeRefundDetails = async ({ hostelId, invoiceId }) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const axios = getAxios();
      const res = await axios.get(
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
      const axios = getAxios();
      const res = await axios.post(
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




  const GetRecurringBills = async (hostelId) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const axios = getAxios();
      const res = await axios.get(
        `/v2/customers/config/${hostelId}`
      );

      if (res.status === 200) {
        setRecurringBills(res.data || []);

        return {
          success: true,
          data: res.data,
          statusCode: res.status,
        };
      }

      return {
        success: false,
        message: "Failed to fetch recurring bills",
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


  // UPDATE RECURRING BILL STATUS
  // ----------------------------------
  const UpdateTenantRecurringStatus = async ({
    hostelId,
    customerId,
    status, // boolean
  }) => {
    if (!hostelId || !customerId) {
      return { success: false, message: "Invalid data" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const body = {
        status: String(status), // API expects "true" / "false"
      };
      const axios = getAxios();
      const res = await axios.put(
        `/v2/customers/config/${hostelId}/${customerId}`,
        body
      );

      if (res.status === 200) {
        setRecurringBills((prev) => {
          if (!prev?.customers) return prev;

          return {
            ...prev,
            customers: prev.customers.map((c) =>
              c.customerId === customerId
                ? { ...c, currentStatus: status }
                : c
            ),
          };
        });

        return {
          success: true,
          data: res.data,
          statusCode: res.status,
        };
      }

      return {
        success: false,
        message: "Failed to update recurring status",
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


  // GET RECEIPTS LIST
  // ----------------------------------
  const GetReceiptsList = async (hostelId) => {
    if (!hostelId) {
      return { success: false, message: "Invalid hostelId" };
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const axios = getAxios();
      const res = await axios.get(
        `/v2/bills/receipts/${hostelId}`
      );

      if (res.status === 200) {
        console.log("receiptlist", res);

        setReceiptsList(res.data || []);

        return {
          success: true,
          data: res.data || [],
          statusCode: res.status,
        };
      }

      if (res.status === 400) {
        setReceiptsList([]);
        return {
          success: false,
          message: res.data || "No receipts found",
          statusCode: res.status,
        };
      }

      return {
        success: false,
        message: "Failed to fetch receipts",
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

  const ReceiptFilter = async ({
    hostelId,
    keyword = "",
    // page = 1,
    // size = 10,
    period,
    bankIds = [],
    invoiceType,
    collectedBy = [],
    minAmount,
    maxAmount,
  }) => {
    console.log("wordsSearch",keyword)
    if (!hostelId) {
      return { success: false, message: "Invalid hostelId" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.get(`/v2/transaction/${hostelId}`, {
        params: {
          keyword,
          // page,
          // size,
          period,
          bankIds,
          invoiceType,
          collectedBy,
          minAmount,
          maxAmount,
        },
        paramsSerializer: (params) =>
          Object.keys(params)
            .map((key) => {
              const value = params[key];

              if (Array.isArray(value)) {
                if (!value.length) return null;
                return value
                  .map((v) => `${key}=${encodeURIComponent(v)}`)
                  .join("&");
              }

              if (
                value !== undefined &&
                value !== null &&
                value !== ""
              ) {
                return `${key}=${encodeURIComponent(value)}`;
              }

              return null;
            })
            .filter(Boolean)
            .join("&"),
      });

      if (res?.status === 200) {

        console.log("receiptfilter", res);

        setReceiptsList(res?.data || []);

        return {
          success: true,
          data: res.data,
        };
      }

      return {
        success: false,
        message: "Failed to fetch receipts",
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


  const DeleteReceipt = async ({ hostelId, receiptId }) => {
    if (!hostelId || !receiptId) {
      return { success: false, message: "Invalid data" };
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const axios = getAxios();
      const res = await axios.delete(
        `/v2/transaction/receipts/${hostelId}/${receiptId}`
      );
      console.log("receiptDel", res)

      if (res.status === 204) {
        // setReceiptsList((prev) =>
        //   prev.filter((item) => item.transactionId !== receiptId)
        // );
        setReceiptsList((prev) => ({
          ...prev,
          listReceipts: prev.listReceipts.filter(
            (item) => item.transactionId !== receiptId
          ),
        }));

        return {
          success: true,
          statusCode: res.status,
        };
      }

      return {
        success: false,
        message: "Failed to delete receipt",
      };
    } catch (error) {
      const status = error?.response?.status;

      if (status === 400 || status === 403) {
        return {
          success: false,
          message: error?.response?.data,
          statusCode: status,
        };
      }

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

  const getBillsPdfDetails = async (hostelId, invoiceId) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const axios = getAxios()
      const res = await axios.get(
        `/v2/bills/${hostelId}/${invoiceId}`
      )

      if (res.status === 200) {
        setBillsPdfDetails(res.data)
        console.log("res", res)

        return { success: true, data: res.data }
      }
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };


  const getReceiptPdfDetails = async (hostelId, transactionId) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const axios = getAxios();
      const res = await axios.get(
        `/v2/transaction/${hostelId}/${transactionId}`
      );

      if (res.status === 200) {
        setReceiptPdfDetails(res.data);
        return { success: true, data: res.data };
      }
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (hostelId, transactionId) => {
    console.log(hostelId)
    console.log("istransactionGet",transactionId)
    if (!hostelId || !transactionId) {
      return { success: false, message: "Invalid data" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.get(
        `/v2/transaction/download/${hostelId}/${transactionId}`
      );

      if (res.status === 200) {
        return {
          success: true,
          url: res.data, // 🔥 PDF URL
        };
      }

      return { success: false, message: "Download failed" };
    } catch (error) {
      const msg = getErrorMessage(error);
      console.log("whyError",msg)
      console.log("whyError",error.message)
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const downloadBill = async (hostelId, invoiceId) => {
    if (!hostelId || !invoiceId) {
      return { success: false, message: "Invalid data" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.get(
        `/v2/bills/download/${hostelId}/${invoiceId}`
      );

      if (res.status === 200) {
        return {
          success: true,
          url: res.data,
        };
      }

      return { success: false, message: "Download failed" };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }


  const shareBillOnWhatsapp = async (hostelId, invoiceId) => {
    if (!hostelId || !invoiceId) {
      return { success: false, message: "Invalid data" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.get(
        `/v2/bills/share/${hostelId}/${invoiceId}`
      );

      if (res.status === 200) {
        return {
          success: true,
          data: res.data,
        };
      }

      return { success: false, message: "Share failed" };

    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };


  const shareReceiptOnWhatsapp = async (hostelId, transactionId) => {
    if (!hostelId || !transactionId) {
      return { success: false, message: "Invalid data" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.get(
        `/v2/transaction/share/${hostelId}/${transactionId}`
      );

      if (res.status === 200) {
        return {
          success: true,
          data: res.data,
        };
      }

      return { success: false, message: "Share failed" };

    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const MarkBillAsUnpaid = async ({ hostelId, invoiceId }) => {
    if (!hostelId || !invoiceId) {
      return { success: false, message: "Invalid data" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.put(
        `/v2/bills/unpaid/${hostelId}/${invoiceId}`
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
        message: "Failed to mark as unpaid",
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

  const getGlobalBillPdfDetail = async (hostelId) => {
    try {
      setLoading(true)
      setErrorMsg("")
      const axios = getAxios();

      const res = await axios.get("/v2/hostel/config/" + hostelId)
      return res;
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false)
    }
  };

  const postGlobalBilPdfDetails = async (hostelId, payload, formData) => {
    console.log("payload", payload)
    console.log(formData)
    try {

      const axios = getAxios();
      const res = await axios.post("/v2/hostel/config/" + hostelId,
        formData, {
        params: {
          mobile: payload?.mobile,
          email: payload?.email,
          isMobileCustomized: payload?.isMobileCustomized,
          isEmailCustomized: payload?.isEmailCustomized,
          isLogoCustomized: payload?.isLogoCustomized,
          isSignatureCustomized: payload?.isSignatureCustomized,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      )
      return res;
    }
    catch (error) {
      console.log(error)
      return { status: error.response.status, message: error.response.data }
    }
  }

  const ApplyBillDiscount = async ({
    hostelId,
    invoiceId,
    discountAmount,
    discountPercentage,
    reason,
  }) => {
    if (!hostelId || !invoiceId) {
      return { success: false, message: "Invalid data" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      // const payload = {
      //   discountAmount: discountAmount || 0,
      //   discountPercentage: discountPercentage || 0,
      //   reason: reason || "",
      // };

      const payload = {
        reason: reason || "",
        ...(discountAmount !== undefined && { discountAmount }),
        ...(discountPercentage !== undefined && { discountPercentage }),
      };

      const res = await axios.post(
        `/v2/bills/discount/${hostelId}/${invoiceId}`,
        payload
      );

      if (res.status === 200) {
        await GetAllBillDetails(hostelId);

        return {
          success: true,
          data: res.data,
        };
      }

      return { success: false, message: "Discount failed" };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);

      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const UpdateBillDiscount = async ({
    hostelId,
    invoiceId,
    discountAmount,
    discountPercentage,
    reason,
  }) => {
    if (!hostelId || !invoiceId) {
      return { success: false, message: "Invalid data" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const payload = {
        reason: reason || "",
        ...(discountAmount !== undefined && { discountAmount }),
        ...(discountPercentage !== undefined && { discountPercentage }),
      };

      const res = await axios.put(
        `/v2/bills/discount/${hostelId}/${invoiceId}`,
        payload
      );

      if (res.status === 200) {
        await GetAllBillDetails(hostelId);

        return {
          success: true,
          data: res.data,
        };
      }

      return { success: false, message: "Discount update failed" };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);

      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const DeleteBillDiscount = async ({ hostelId, invoiceId }) => {
    if (!hostelId || !invoiceId) {
      return { success: false, message: "Invalid data" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.delete(
        `/v2/bills/discount/${hostelId}/${invoiceId}`
      );

      console.log();


      if (res?.status === 200 || res?.status === 204) {
        await GetAllBillDetails(hostelId);

        return {
          success: true,
          data: res.data,
        };
      }

      return { success: false, message: "Failed to remove discount" };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);

      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };


  const deleteTemplateImage = async ({ hostelId, templateId, type }) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.delete(
        `/v2/hostel/config/template/${hostelId}/${templateId}`,
        {
          data: {
            type: type, // "logo" or "signature"
          },
        }
      );

      return {
        success: true,
        statusCode: res.status,
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

  const GetBillDetailsById = async ({ hostelId, invoiceId }) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.get(
        `/v2/bills/details/${hostelId}/${invoiceId}`
      );

      if (res.status === 200) {
        return {
          success: true,
          data: res.data,
        };
      }

      return { success: false, message: "Failed to fetch bill details" };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);

      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }

  //  const GetAllBillDetails = async (hostelId, filters = {}) => {
  //   try {
  //     setLoading(true);
  //     setErrorMsg("");
  //     const axios = getAxios();
  //     console.log("filters",filters);
  //     const res = await axios.get(`/v2/bills/${hostelId}`, {
  //       params: {
  //         startDate: filters.startDate,
  //         endDate: filters.endDate,
  //         type: filters.type,
  //         createdBy: filters.createdBy,
  //         modes: filters.modes,
  //         paymentStatus: filters.paymentStatus,
  //         search: filters.search,
  //       },
        
        
  //       paramsSerializer: (params) =>
  //         Object.keys(params)
  //           .map((key) => {
  //             const value = params[key];
  //             if (Array.isArray(value)) {
  //               return value.map((v) => `${key}=${v}`).join("&");
  //             }
  //             if (value !== undefined && value !== null && value !== "") {
  //               return `${key}=${value}`;
  //             }
  //             return null;
  //           })
  //           .filter(Boolean)
  //           .join("&"),
  //     });

  //     if (res.status === 200) {
  //       setBillDetails(res.data || []);
  //       return { success: true, data: res.data };
  //     }

  //     return { success: false };
  //   } catch (error) {
  //     const msg = getErrorMessage(error);
  //     setErrorMsg(msg);
  //     return { success: false, message: msg };
  //   } finally {
  //     setLoading(false);
  //   }
  // };




  const GetAdvanceBookingBills = async (hostelId,filters,page=1,size=10) => {
    console.log("filteredRetainer",filters)
    if (!hostelId) {
      return { success: false, message: "Invalid hostelId" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.get( `/v2/bills/advances/${hostelId}`,{
          params: {
            page,
            size,
            name: filters?.name,
            floor:filters?.floor,
            room: filters?.room,
            minAmount: filters?.minAmount,
            maxAmount: filters?.maxAmount
          },
           paramsSerializer: (params) =>
          Object.keys(params)
            .map((key) => {
              const value = params[key];
              if (Array.isArray(value)) {
                return value.map((v) => `${key}=${v}`).join("&");
              }
              if (value !== undefined && value !== null && value !== "") {
                return `${key}=${value}`;
              }
              return null;
            })
            .filter(Boolean)
            .join("&"),
      
          
        }
      );
      console.log("Request URL:", res.request?.responseURL);

      console.log("AfterFilterRetainer",res)

     

      if (res.status === 200) {
        setBookingBills(res?.data || []);
        console.log("res", res);

        return {
          success: true,
          data: res.data,
          statusCode: res.status,
        };
      }

      return { success: false, message: "Failed to fetch advance bills" };

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

  const GetInitializeAdvanceRedeem = async ({ hostelId, advanceInvoiceId }) => {
    if (!hostelId || !advanceInvoiceId) {
      return { success: false, message: "Invalid data" };
    }

    console.log("soru", hostelId, advanceInvoiceId)
    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.get(
        `/v2/bills/redeem/initialize/${hostelId}/${advanceInvoiceId}`
      );

      if (res.status === 200) {
        setInitailizeBookingBills(res?.data || [])
        return {
          success: true,
          data: res.data,
          statusCode: res.status,
        };
      }

      return {
        success: false,
        message: "Failed to fetch redeem details",
      };

    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      console.log(msg)

      return {
        success: false,
        message: msg,
      };
    } finally {
      setLoading(false);
    }
  }

  const ApplyAdvanceToInvoices = async ({
    hostelId,
    invoiceId,
    listItems,
  }) => {

    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.post(
        `/v2/bills/redeem/${hostelId}/${invoiceId}`,
        {
          listItems,
        }
      );

      return {
        success: true,
        data: res.data,
      };

    } catch (error) {

      console.log("ERROR", error?.response?.data);

      const message =
        error?.response?.data ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";

      return {
        success: false,
        message,
      };
    }
    finally {
      setLoading(false);
    }
  }


  const GetAdvanceCreditDetails = async ({
    hostelId,
    invoiceId,
    type = "",
  }) => {
    if (!hostelId || !invoiceId) {
      return { success: false, message: "Invalid data" };
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const axios = getAxios();

      const res = await axios.get(
        `/v2/bills/advances/${hostelId}/${invoiceId}`,
        {
          params: {
            type,
          },
        }
      );

      if (res.status === 200) {
        setAdvanceCreditDetails(res?.data || null);

        return {
          success: true,
          data: res.data,
          statusCode: res.status,
        };
      }

      return {
        success: false,
        message: "Failed to fetch advance credit details",
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


  const GetInitializeRecordPaymentDetails = async ({ hostelId, invoiceId }) => {
  if (!hostelId || !invoiceId) {
    return { success: false, message: "Invalid data" };
  }

  try {
    setLoading(true);
    setErrorMsg("");

    const axios = getAxios();

    const res = await axios.get(
      `/v2/bills/payment/initialize/${hostelId}/${invoiceId}`
    );

    if (res?.status === 200) {
      setInitializeRecordPaymentDetails(res?.data || [])
      return {
        success: true,
        data: res?.data,
        statusCode: res?.status,
      };
    }

    return {
      success: false,
      message: "Failed to fetch payment initialization details",
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


const GetInitializeDiscountDetails = async ({ hostelId, invoiceId }) => {
  if (!hostelId || !invoiceId) {
    return { success: false, message: "Invalid data" };
  }

  try {
    setLoading(true);
    setErrorMsg("");

    const axios = getAxios();

    const res = await axios.get(
      `/v2/bills/discount/${hostelId}/${invoiceId}`
    );

    if (res?.status === 200) {
      setInitializeDiscountDetails(res?.data)
      return {
        success: true,
        data: res?.data,
        statusCode: res?.status,
      };
    }

    return {
      success: false,
      message: "Failed to fetch discount initialization details",
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

 const createRetainderInvoice=async(hostelId,customerId,payload)=>{

  setLoading(true)
  try{
    const token= await retriveData("token")
    const axios= getAxios()

    const res= await axios.post(`/v2/retainer/${hostelId}/${customerId}`, payload)

    console.log(res)

     if (res?.status === 201 || 200) {
      return {
        success: true,
        data: res?.data,
        statusCode: res?.status,
      };
    }
  }catch(error){
    console.log(error)
    const msg = getErrorMessage(error);
    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
  }finally{
    setLoading(false)
  }
 }

 const getRetainerInvoiceDetail=async(hostelId,invoiceId)=>{
  setLoading(true)

  try{
    const token= await retriveData("token")
    const axios= getAxios();

    const res= await axios.get(`/v2/retainer/get/${hostelId}/${invoiceId}`);
    console.log("RetainerInvoice",res)

     if (res?.status === 200) {
      setRetainerInvoiceDetail(res?.data)
     
      return {
        success: true,
        data: res?.data,
        statusCode: res?.status,
      };
    }
  }catch(error){
    console.log(error)
    const msg = getErrorMessage(error);
    setErrorMsg(msg);

    return {
      success: false,
      message: msg,
    };
  }finally{
    setLoading(false)
  }
 }

 const ApplyRetainerToInvoices = async ({
    hostelId,
    invoiceId,
    payload,
  }) => {

    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.post(
        `/v2/retainer/redeem/${hostelId}/${invoiceId}`, payload);

      console.log("appliedretainersin",res)

      return {
        success: true,
        data: res.data,
      };

    } catch (error) {

      console.log("ERRORRetinar", error?.response?.data);
      console.log("messageRetiner",error?.response?.data?.message)

      const message =
        error?.response?.data ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
        console.log(message)

      return {
        success: false,
        message,
      };
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <BillContext.Provider
      value={{
        BillDetails,
        recurringBills,
        receiptsList,
        BillPdfdetails,
        ReceiptPdfdetails,
        bookingBills,
        InitializebookingBills,
        advanceCreditDetails,
        InitializeRecordPaymentDetails ,
        InitializeDiscountDetails ,
        loading,
        errorMsg,
        refundError,
        GetAllBillDetails,
        // GetFilteredBills, 
        CreateManualBill,
        UpdateBill,
        RecordPayment,
        GetInitializeRefundDetails,
        CreateRefund,
        GetRecurringBills,
        UpdateTenantRecurringStatus,
        GetReceiptsList,
        DeleteReceipt,
        getBillsPdfDetails,
        getReceiptPdfDetails,
        downloadReceipt,
        downloadBill,
        shareBillOnWhatsapp,
        shareReceiptOnWhatsapp,
        getGlobalBillPdfDetail,
        postGlobalBilPdfDetails,
        MarkBillAsUnpaid,
        ApplyBillDiscount,
        deleteTemplateImage,
        UpdateBillDiscount,
        DeleteBillDiscount,
        GetBillDetailsById,
        GetAdvanceBookingBills,
        GetInitializeAdvanceRedeem,
        ApplyAdvanceToInvoices,
        GetAdvanceCreditDetails,
        ReceiptFilter,
        GetInitializeRecordPaymentDetails , GetInitializeDiscountDetails,createRetainderInvoice,
        getRetainerInvoiceDetail,retainerInvoiceDetail,ApplyRetainerToInvoices,setBillDetails,setRecurringBills
      }}
    >
      {children}
    </BillContext.Provider>
  )
}
