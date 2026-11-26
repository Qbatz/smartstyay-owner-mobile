import React, { createContext, useState, useContext, useRef } from "react";
import { getAxios } from "../Config/AxiosConfig";
import { CommonContexts } from "../Context/CommonContext";

export const VendorContext = createContext();

export default function VendorProvider({ children }) {
  const [vendorList, setVendorList] = useState([]);
  const [vendorCategories, setVendorCategories] = useState([]);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [vendorExpenses, setVendorExpenses] = useState([]);

  // Vendor expenses pagination / filters
  const [vendorExpensesLoading, setVendorExpensesLoading] = useState(false);      // page 1
  const [vendorExpensesLoadingMore, setVendorExpensesLoadingMore] = useState(false); // page 2+
  const [vendorExpenseFilterOptions, setVendorExpenseFilterOptions] = useState(null);
  const vendorExpenseFiltersRef = useRef({});
  const vendorExpensePageRef = useRef(1);
  const vendorExpenseHasMoreRef = useRef(false);
  const vendorExpenseFetchingRef = useRef(false);
  const vendorExpenseRequestIdRef = useRef(0);
  const vendorExpenseVendorIdRef = useRef(null);
  const [vendorExpensePayments, setVendorExpensePayments] = useState([]);
  const [vendorSettlementInitialize, setVendorSettlementInitialize] = useState(null);
  const [vendorComments, setVendorComments] = useState([]);
  const [vendorInitialize, setVendorInitalize] = useState([]);


  const [loading, setLoading] = useState(false);

  const getErrorMessage = (err) =>
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    "Something went wrong";

  const clearVendorDetails = () => {
    setVendorDetails(null);
  };

  // const getVendorList = async (hostelId) => {
  //   setLoading(true);
  //   setVendorList([]);

  //   try {
  //     const axios = getAxios();
  //     const res = await axios.get(`/v2/vendors/all-vendors/${hostelId}`);

  //     if (res.status === 200) {
  //       setVendorList(res.data || []);
  //       return { success: true, data: res.data };
  //     }

  //     return { success: false };
  //   } catch (err) {
  //     console.log("Vendor list error:", err?.response?.data || err);
  //     return { success: false, message: getErrorMessage(err) };
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // const getVendorList = async (
  //   hostelId,
  //   filters = {}
  // ) => {
  //   setLoading(true);
  //   setVendorList([]);

  //   try {
  //     const axios = getAxios();

  //     const res = await axios.get(
  //       `/v2/vendors/all-vendors/${hostelId}`,
  //       {
  //         params: {
  //           name: filters?.name,
  //           categoryId: filters?.categoryId,
  //           paymentStatus: filters?.paymentStatus,
  //           page: filters?.page || 1,
  //           size: filters?.size || 10,
  //         },
  //       }
  //     );

  //     if (res.status === 200) {
  //       setVendorList(res.data || []);
  //       return {
  //         success: true,
  //         data: res.data,
  //       };
  //     }

  //     return { success: false };
  //   } catch (err) {
  //     return {
  //       success: false,
  //       message: getErrorMessage(err),
  //     };
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getVendorList = async (
    hostelId,
    filters = {}
  ) => {
    setLoading(true);
    setVendorList([]);

    try {
      const axios = getAxios();

      const res = await axios.get(
        `/v2/vendors/all-vendors/${hostelId}`,
        {
          params: {
            name: filters?.name || undefined,
            categoryId: filters?.categoryId || undefined,
            paymentStatus: filters?.paymentStatus || undefined,
            page: filters?.page,
            size: filters?.size,
          },
        }
      );

      console.log("vendor", params);


      if (res.status === 200) {
        console.log("vendorres", res.data);

        setVendorList(res.data || []);

        return {
          success: true,
          data: res.data,
        };
      }

      return { success: false };

    } catch (err) {
      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  };

  const initializeVendorList = async (hostelId) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.get(
        `/v2/vendors/hostel/${hostelId}/vendors`
      );

      console.log("INITIALIZE VENDOR LIST RESPONSE =>", res.data);

      if (res?.status === 200) {
        setVendorInitalize(res?.data)
        return {
          success: true,
          data: res?.data,
        }
      }

      return {
        success: false,
        message: "Failed to get vendor list",
      };

    } catch (err) {
      console.log(
        "INITIALIZE VENDOR LIST ERROR =>",
        err?.response?.data || err
      );

      return {
        success: false,
        message: getErrorMessage(err),
      };

    } finally {
      setLoading(false);
    }
  };

  const getVendorCategories = async (hostelId) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.get(
        `/v2/vendors/categories?hostelId=${hostelId}`
      );

      if (res?.status === 200) {
        setVendorCategories(res?.data || []);

        return {
          success: true,
          data: res?.data,
        };
      }

      return { success: false };
    } catch (err) {
      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  };

  const getVendorDetails = async (vendorId) => {
    try {
      setLoading(true);

      const axios = getAxios();
      const res = await axios.get(`/v2/vendors/${vendorId}`);

      if (res?.status === 200) {
        setVendorDetails(res?.data);

        return {
          success: true,
          data: res?.data,
        };
      }

      return { success: false };
    } catch (err) {
      console.log(
        "GET VENDOR DETAILS ERROR:",
        err?.response?.data || err
      );

      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  };

 
  const getVendorExpenses = async (vendorId, filters = {}, page = 1, size = 10) => {
    if (!vendorId) return { success: false };

    const isLoadMore = page > 1;

    if (isLoadMore && vendorExpenseFetchingRef.current) {
      return { success: false };
    }

    vendorExpenseFetchingRef.current = true;
    const requestId = ++vendorExpenseRequestIdRef.current;

    if (isLoadMore) {
      setVendorExpensesLoadingMore(true);
    } else {
     
      if (vendorExpenseVendorIdRef.current !== vendorId) {
        setVendorExpenseFilterOptions(null);
        setVendorExpenses([]);
      }
      vendorExpenseVendorIdRef.current = vendorId;
      vendorExpenseFiltersRef.current = { ...(filters || {}), size };
      vendorExpensePageRef.current = 1;
      vendorExpenseHasMoreRef.current = true;
      setVendorExpensesLoadingMore(false); // a superseded load-more can't clear it
      setVendorExpensesLoading(true);
    }

    try {
      const axios = getAxios();

      const params = { page, size };
      const add = (key, value) => {
        if (value === undefined || value === null) return;
        if (typeof value === "string" && value.trim() === "") return;
        params[key] = value;
      };
      add("search", filters?.search);
      add("startDate", filters?.startDate);
      add("endDate", filters?.endDate);
      add("categoryId", filters?.categoryId);
      add("paymentStatus", filters?.paymentStatus);
      add("minAmount", filters?.minAmount);
      add("maxAmount", filters?.maxAmount);

      const res = await axios.get(`/v2/vendors/expenses/${vendorId}`, { params });

      if (requestId !== vendorExpenseRequestIdRef.current) {
        return { success: false, stale: true };
      }

      if (res?.status === 200) {
        const data = res?.data || {};
        const list = Array.isArray(data?.expenses) ? data.expenses : [];

        const currentPage = Number(data?.currentPage) || page;
        const totalPages = Number(data?.totalPages);

        vendorExpensePageRef.current = currentPage;
        vendorExpenseHasMoreRef.current =
          Number.isFinite(totalPages) && totalPages > 0
            ? currentPage < totalPages
            : list.length >= size;

       
        const hasFilters = Object.entries(filters || {}).some(
          ([, v]) => v !== undefined && v !== null && String(v).trim() !== ""
        );
        if (data?.filterOptions && (!hasFilters || !vendorExpenseFilterOptions)) {
          setVendorExpenseFilterOptions(data.filterOptions);
        }

        if (isLoadMore) {
          setVendorExpenses((prev) => {
            const prevList = Array.isArray(prev?.expenses) ? prev.expenses : [];
            const seen = new Set(prevList.map((e) => e?.expenseId));
            return {
              ...data,
              expenses: [...prevList, ...list.filter((e) => !seen.has(e?.expenseId))],
            };
          });
        } else {
          setVendorExpenses({ ...data, expenses: list });
        }

        return { success: true, data };
      }

      if (!isLoadMore) vendorExpenseHasMoreRef.current = false;
      return { success: false };
    } catch (err) {
      console.log(
        "GET VENDOR EXPENSES ERROR:",
        err?.response?.data || err
      );

      if (!isLoadMore && requestId === vendorExpenseRequestIdRef.current) {
        vendorExpenseHasMoreRef.current = false;
      }

      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      if (requestId === vendorExpenseRequestIdRef.current) {
        vendorExpenseFetchingRef.current = false;
        if (isLoadMore) setVendorExpensesLoadingMore(false);
        else setVendorExpensesLoading(false);
      }
    }
  };

  // Next page of vendor expenses with the currently applied filters
  const LoadMoreVendorExpenses = async (vendorId) => {
    if (
      !vendorId ||
      vendorId !== vendorExpenseVendorIdRef.current ||
      vendorExpenseFetchingRef.current ||
      !vendorExpenseHasMoreRef.current
    ) {
      return { success: false };
    }

    const { size = 10, ...filters } = vendorExpenseFiltersRef.current || {};
    return getVendorExpenses(vendorId, filters, vendorExpensePageRef.current + 1, size);
  };

  const getVendorExpensePayments = async (
    vendorId,
    startDate = "",
    endDate = "",
    page = 1,
    size = 10
  ) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.get(
        `/v2/vendors/expense-payments/${vendorId}`,
        {
          params: {
            startDate,
            endDate,
            page,
            size,
          },
        }
      );

      if (res?.status === 200) {
        setVendorExpensePayments(res?.data || []);

        return {
          success: true,
          data: res?.data,
        };
      }

      return { success: false };
    } catch (err) {
      console.log(
        "GET VENDOR EXPENSE PAYMENTS ERROR:",
        err?.response?.data || err
      );

      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  };

  const addVendorCategory = async (
    categoryName,
    hostelId
  ) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.post(
        "/v2/vendors/categories",
        {
          categoryName,
          hostelId: String(hostelId),
        }
      );

      if (
        res?.status === 200 ||
        res?.status === 201
      ) {
        await getVendorCategories(hostelId);

        return {
          success: true,
          message:
            "Vendor Category added successfully",
        };
      }

      return {
        success: false,
        message:
          "Failed to add vendor category",
      };
    } catch (err) {
      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  };
  const updateVendorCategory = async (
    categoryId,
    categoryName,
    hostelId
  ) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.put(
        `/v2/vendors/categories/${categoryId}?hostelId=${hostelId}`,
        {
          categoryName,
        }
      );

      if (res?.status === 200) {
        await getVendorCategories(hostelId);

        return {
          success: true,
          message: "Vendor Category updated successfully",
          data: res?.data,
        };
      }

      return {
        success: false,
        message: "Failed to update vendor category",
      };
    } catch (err) {
      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  };


  const deleteVendorCategory = async (
    categoryId,
    hostelId
  ) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.post(
        `/v2/vendors/categories/${categoryId}/delete?hostelId=${hostelId}`
      );

      if (res?.status === 200) {
        await getVendorCategories(hostelId);

        return {
          success: true,
          message:
            "Vendor Category deleted successfully",
        };
      }

      return {
        success: false,
        message:
          "Failed to delete vendor category",
      };
    } catch (err) {
      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD VENDOR
  const addVendor = async ({ profilePic, payLoads, hostelId }) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("payLoads", {
        string: JSON.stringify(payLoads),
        type: "application/json",
        name: "blob",
      });

      if (profilePic?.uri) {
        formData.append("profilePic", {
          uri: profilePic.uri,
          name: profilePic.fileName || "vendor.jpg",
          type: profilePic.type || "image/jpeg",
        });
      }

      const axios = getAxios()
      const res = await axios.post("/v2/vendors", formData);

      if (res?.status === 200 || res?.status === 201) {
        await getVendorList(hostelId);
        return { success: true, data: res.data };
      }

      return { success: false, message: "Failed" };
    } catch (err) {
      console.log("ADD VENDOR ERROR 👉", err?.response?.data || err);
      return { success: false, message: err?.response?.data?.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };


  // ✅ UPDATE VENDOR
  const updateVendor = async ({ profilePic, updateVendor, hostelId }) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("updateVendor", JSON.stringify(updateVendor));

      if (profilePic?.uri) {
        formData.append("profilePic", {
          uri: profilePic.uri,
          name: profilePic.fileName || "vendor.jpg",
          type: profilePic.type || "image/jpeg",
        });
      }

      const axios = getAxios();
      const res = await axios.put(
        `/v2/vendors/${updateVendor.vendorId}`,
        formData
      ); // ✅ no headers

      if (res.status === 200) {
        await getVendorList(hostelId);
        return { success: true, data: res.data };
      }

      return { success: false, message: "Failed to update vendor" };
    } catch (err) {
      console.log("UPDATE VENDOR ERROR 👉", err?.response?.data || err);
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (vendorId, hostelId) => {
    setLoading(true);

    try {
      const axios = getAxios();
      const res = await axios.delete(`/v2/vendors/${vendorId}`);

      if (res.status === 200) {
        await getVendorList(hostelId);
        return { success: true, message: "Vendor deleted successfully" };
      }

      return { success: false, message: "Failed to delete vendor" };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  }

  const getVendorSettlementInitialize = async (
    hostelId,
    vendorId
  ) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.get(
        `/v2/vendors/initialize/${hostelId}/${vendorId}`
      );

      if (res?.status === 200) {
        setVendorSettlementInitialize(res?.data);

        return {
          success: true,
          data: res?.data,
        };
      }

      return { success: false };
    } catch (err) {
      console.log(
        "GET VENDOR SETTLEMENT INITIALIZE ERROR:",
        err?.response?.data || err
      );

      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  }

  const settleVendorPayment = async (
    vendorId,
    payload
  ) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.post(
        `/v2/vendors/settle/${vendorId}`,
        payload
      );

      if (
        res?.status === 200 ||
        res?.status === 201
      ) {

        return {
          success: true,
          data: res?.data,
        };
      }

      return {
        success: false,
        message: "Failed to settle payment",
      };
    } catch (err) {
      console.log(
        "SETTLE VENDOR PAYMENT ERROR:",
        err?.response?.data || err
      );

      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  }



  const getVendorComments = async (
    vendorId
  ) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.get(
        `/v2/vendors/comments/${vendorId}`
      )

      console.log("res", res)


      if (res?.status === 200) {
        setVendorComments(res?.data?.comments || []);

        return {
          success: true,
          data: res?.data,
        };
      }

      return { success: false };
    } catch (err) {
      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  };


  const addVendorComment = async (payload) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.post(
        "/v2/vendors/comments",
        payload
      );

      if (res?.status === 200 || res?.status === 201) {
        return {
          success: true,
          data: res?.data,
          message: "Comment Added Successfully",
        };
      }

      return {
        success: false,
        message: "Failed to add comment",
      };
    } catch (err) {
      console.log(
        "ADD VENDOR COMMENT ERROR:",
        err?.response?.data || err
      );

      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  }

  const updateVendorComment = async (
    commentId,
    payload
  ) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.put(
        `/v2/vendors/comments/${commentId}`,
        payload
      );

      if (res?.status === 200) {
        return {
          success: true,
          data: res?.data,
          message: "Comment Updated Successfully",
        };
      }

      return {
        success: false,
        message: "Failed to update comment",
      };
    } catch (err) {
      console.log(
        "UPDATE VENDOR COMMENT ERROR:",
        err?.response?.data || err
      );

      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  }

  const deleteVendorComment = async (
    commentId
  ) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.delete(
        `/v2/vendors/comments/${commentId}`
      );

      if (res?.status === 200) {
        return {
          success: true,
          message: "Comment Deleted Successfully",
        };
      }

      return {
        success: false,
        message: "Failed to delete comment",
      };
    } catch (err) {
      console.log(
        "DELETE VENDOR COMMENT ERROR:",
        err?.response?.data || err
      );

      return {
        success: false,
        message: getErrorMessage(err),
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorContext.Provider
      value={{
        vendorList,
        vendorCategories,
        vendorDetails,
        vendorExpenses,
        vendorExpensePayments,
        vendorSettlementInitialize,
        vendorComments, vendorInitialize,
        loading,
        getVendorList,
        getVendorCategories,
        addVendor,
        updateVendor,
        deleteVendor,
        addVendorCategory,
        deleteVendorCategory,
        getVendorDetails,
        getVendorExpenses,
        LoadMoreVendorExpenses,
        vendorExpensesLoading,
        vendorExpensesLoadingMore,
        vendorExpenseFilterOptions,
        getVendorExpensePayments,
        getVendorSettlementInitialize,
        settleVendorPayment,
        clearVendorDetails,
        getVendorComments,
        addVendorComment,
        updateVendorComment,
        deleteVendorComment,
        updateVendorCategory, initializeVendorList
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}
