import React, { createContext, useState, useContext } from "react";
import { getAxios } from "../Config/AxiosConfig";
import { CommonContexts } from "../Context/CommonContext";

export const VendorContext = createContext();

export default function VendorProvider({ children }) {
  const [vendorList, setVendorList] = useState([]);
  const [vendorCategories, setVendorCategories] = useState([]);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [vendorExpenses, setVendorExpenses] = useState([]);
  const [vendorExpensePayments, setVendorExpensePayments] = useState([]);
  const [vendorSettlementInitialize, setVendorSettlementInitialize] = useState(null);
  const [vendorComments, setVendorComments] = useState([]);



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
            name: filters?.name,
            categoryId: filters?.categoryId,
            paymentStatus: filters?.paymentStatus,
            page: filters?.page || 1,
            size: filters?.size || 10,
          },
        }
      );

      if (res.status === 200) {
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

  const getVendorExpenses = async (
    vendorId,
    search = "",
    startDate = "",
    endDate = "",
    page = 1,
    size = 10
  ) => {
    try {
      setLoading(true);

      const axios = getAxios();

      const res = await axios.get(
        `/v2/vendors/expenses/${vendorId}`,
        {
          params: {
            search,
            startDate,
            endDate,
            page,
            size,
          },
        }
      );

      if (res?.status === 200) {
        setVendorExpenses(res?.data || []);

        return {
          success: true,
          data: res?.data,
        };
      }

      return { success: false };
    } catch (err) {
      console.log(
        "GET VENDOR EXPENSES ERROR:",
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
        vendorComments,
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
        getVendorExpensePayments,
        getVendorSettlementInitialize,
        settleVendorPayment,
        clearVendorDetails,
        getVendorComments,
        addVendorComment,
        updateVendorComment,
        deleteVendorComment,
        updateVendorCategory
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}
