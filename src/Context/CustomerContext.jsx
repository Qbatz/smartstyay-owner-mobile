import React, { createContext, useContext, useState } from "react";
import AxiosConfig, {getAxios} from "../Config/AxiosConfig";
import { retriveData } from "../Utils/Storage";

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")
  

  const [ParticularcustomerDetails, setParticularCustomerDetails] = useState(null);

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.response?.data ||
    "Something went wrong";

  const getCustomersByHostel = async (
    hostelId,
    name = "",
    type = ""
  ) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token = await retriveData("token");
      const axios = getAxios();
      const response = await axios.get(
        `/v2/customers/${hostelId}`,
        {
          params: {
            ...(name && { name }),
            ...(type && { type }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      return response.data;

    } catch (error) {
      setLoading(false);
      const msg =
        error.response?.data?.message || "Customer fetch failed";
      console.log("CUSTOMER API ERROR:", msg);
      setErrorMsg(msg);
      return [];
    }
  }


  const GetParticularCustomerDetails = async (customerId) => {
    if (!customerId) return { success: false };

    try {
      setLoading(true);
      setErrorMsg("");

      const token = await retriveData("token");
      const axios = getAxios();
      const res = await axios.get(
        `/v2/customers/details/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setParticularCustomerDetails(res.data); // 🔥 STORE DATA
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (error) {
      const msg = getErrorMessage(error);
      console.log("CUSTOMER DETAILS ERROR:", msg);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const resetParticularCustomer = () => {
    setParticularCustomerDetails(null);
  };

  


  const addCustomer = async (hostelId, payloads, image) => {
    try {
      const token = await retriveData("token");

      const formData = new FormData();

      formData.append("customerInfo", {
        string: JSON.stringify(payloads.customerInfo),
        type: "application/json",
      });

      if (image?.uri) {
        formData.append("profilePic", {
          uri: image.uri,
          type: image.type || "image/jpeg",
          name: image.fileName || "profile.jpg",
        });
      }
      const axios = getAxios();
      const res = await axios.post(
        `/v2/customers/${hostelId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { success: true, data: res.data };

    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data ||
          "Customer already exists with this mobile number",
        status: error?.response?.status,
      };
    }
  };




  const getBedsByHostelAndDate = async (hostelId, joiningDate) => {
    try {
      const token = await retriveData("token");
      const axios = getAxios();
      const res = await axios.get(
        `/v2/bed/initialize/${hostelId}`,
        {
          params: {
            joiningDate, // DD-MM-YYYY
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (error) {
      console.log("BED INIT ERROR:", error?.response?.data);
      return { success: false };
    }
  };


  const checkInCustomer = async (customerId, payload) => {
    try {
      const token = await retriveData("token");
      const axios = getAxios();
      const res = await axios.post(
        `/v2/customers/check-in/${customerId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true, data: res.data };
    } catch (error) {
      console.log("CHECK-IN ERROR:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "Check-in failed",
      };
    }
  };


  const deleteCustomer = async (hostelId, customerId) => {
    try {
      const token = await retriveData("token");
      const axios = getAxios();
      const res = await axios.delete(
        `/v2/customers/${hostelId}/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      return { success: true, data: res.data };
    } catch (error) {
      console.log("DELETE CUSTOMER ERROR:", error?.response?.data);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Unable to delete customer",
      };
    }
  };

  const changeBedCustomer = async (hostelId, customerId, payload) => {
    try {
      const token = await retriveData("token");
      const axios = getAxios();
      const res = await axios.post(
        `/v2/customers/change-bed/${hostelId}/${customerId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (error) {
      console.log("CHANGE BED ERROR:", error?.response?.data);
      return {
        success: false,
        message:
          error?.response?.data?.message || "Change bed failed",
      };
    }
  };
  const getCustomerDetails = async (customerId) => {
    if (!customerId) {
      return { success: false, message: "CustomerId missing" };
    }

    try {
      const token = await retriveData("token");
      const axios = getAxios();
      const res = await axios.get(
        `/v2/customers/details/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        return { success: true, data: res.data };
      }

      return { success: false, message: "Failed to fetch customer details" };
    } catch (error) {
      console.log("CUSTOMER DETAILS ERROR:", error?.response?.data);
      return {
        success: false,
        message:
          error?.response?.data?.message || "Something went wrong",
      };
    }
  };

const moveToNoticePeriod = async (hostelId, payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.post(
      `/v2/customers/notice/${hostelId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 201 || res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Failed to move notice" };

  }
  catch (error) {
  console.log("NOTICE ERROR FULL 👉", error.response?.data);
  return {
    success: false,
    message:
      error?.response?.data?.message ||
      JSON.stringify(error?.response?.data) ||
      "Move to notice failed",
  };
}

};
 const bookCustomer = async (hostelId, payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.post(
      `/v2/customers/booking/${hostelId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200 || res.status === 201) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Booking failed" };
  } catch (error) {
    console.log("error", error.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data) ||
        "Booking failed",
    };
  }
};

const cancelCheckout = async (hostelId, customerId, payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.post(
      `/v2/customers/cancel-checkout/${hostelId}/${customerId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Cancel checkout failed" };
  } catch (error) {
    console.log("error", error.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data) ||
        "Cancel checkout failed",
    };
  }
};

const getSettlementByCustomerId = async (customerId) => {
  if (!customerId) {
    return { success: false, message: "CustomerId missing" };
  }

  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.get(
      `/v2/customers/settlement/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Failed to fetch settlement" };
  } catch (error) {
    console.log("error", error.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data) ||
        "Settlement fetch failed",
    };
  }
};

const submitSettlement = async (customerId, payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.post(
      `/v2/customers/settlement/${customerId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 201 || res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Settlement failed" };
  } catch (error) {
    console.log("error", error.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data) ||
        "Settlement submit failed",
    };
  }
};
const initializeCheckout = async (hostelId, customerId) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.post(
      `/v2/bookings/initialize/checkout/${hostelId}/${customerId}`,
      {}, // 👈 body empty
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: res.data };
  } catch (error) {
    console.log("error", error.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message || "Checkout init failed",
    };
  }
};

const confirmCheckout = async (customerId) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.post(
      `/v2/bookings/checkout/${customerId}`,
      {}, // 👈 empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Checkout failed" };
  } catch (error) {
    console.log("CONFIRM CHECKOUT ERROR 👉", error.response?.data);
    return {
      success: false,
      message:
        error?.response?.data ||
        "Checkout confirmation failed",
    };
  }
};
const initializeCheckIn = async (hostelId, customerId) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.get(
      `/v2/bookings/initialize-check-in/${hostelId}/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: res.data };
   
  } catch (error) {
    console.log("INIT CHECK-IN ERROR 👉", error.response?.data);
    return {
      success: false,
      message:
        error?.response?.data || "Initialize check-in failed",
    };
  }
};

const bookedCheckInCustomer = async (customerId, payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.post(
      `/v2/customers/booked/check-in/${customerId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200 || res.status === 201) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Booked check-in failed" };
  } catch (error) {
    console.log("BOOKED CHECK-IN ERROR 👉", error.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data) ||
        "Booked check-in failed",
    };
  }
};
const initializeCancelBooking = async (customerId) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.get(
      `/v2/bookings/initialize/cancel/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Initialize cancel failed" };
  } catch (error) {
    console.log("INIT CANCEL ERROR 👉", error.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data) ||
        "Initialize cancel failed",
    };
  }
};
const cancelBooking = async (customerId, payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.put(
      `/v2/bookings/cancel/${customerId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Cancel booking failed" };
  } catch (error) {
    console.log("CANCEL BOOKING ERROR 👉", error.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data) ||
        "Cancel booking failed",
    };
  }
};

const getCheckoutCustomersByHostel = async (hostelId, name = "") => {
  try {
    setLoading(true);
    setErrorMsg("");

    const token = await retriveData("token");
    const axios = getAxios();
    const res = await axios.get(
      `/v2/customers/checkout/${hostelId}`,
      {
        params: {
          ...(name && { name }),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log("CHECKOUT CUSTOMERS ERROR 👉", error?.response?.data);
    setErrorMsg(
      error?.response?.data?.message || "Checkout customers fetch failed"
    );
    return [];
  } finally {
    setLoading(false);
  }
};
const editBasicDetails = async (customerId, payloads, profilePic = null) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const token = await retriveData("token");

    const formData = new FormData();

    // ✅ payload JSON
    formData.append("payloads", {
      string: JSON.stringify(payloads),
      type: "application/json",
    });

    // ✅ optional profile pic
    if (profilePic?.uri) {
      formData.append("profilePic", {
        uri: profilePic.uri,
        type: profilePic.type || "image/jpeg",
        name: profilePic.fileName || "profile.jpg",
      });
    }
    const axios = getAxios();
    const res = await axios.put(
      `/v2/customers/update/${customerId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Update failed" };
  } catch (error) {
    console.log("EDIT BASIC DETAILS ERROR 👉", error?.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data ||
        "Something went wrong",
    };
  } finally {
    setLoading(false);
  }
};


const addVendor = async (payloads, profilePic = null) => {
  try {
    setLoading(true);
    setErrorMsg("");
 
    const token = await retriveData("token");
    const formData = new FormData();
 
    // ✅ payload JSON (IMPORTANT: key name = payLoads)
    formData.append("payLoads", {
      string: JSON.stringify(payloads),
      type: "application/json",
    });
 
    // ✅ profile image
    if (profilePic?.uri) {
      formData.append("profilePic", {
        uri: profilePic.uri,
        type: profilePic.type || "image/jpeg",
        name: profilePic.fileName || "profile.jpg",
      });
    }
    const axios = getAxios();
    const res = await axios.post(
      "/v2/vendors",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
 
    if (res.status === 201 || res.status === 200) {
      return { success: true, data: res.data };
    }
 
    return { success: false, message: "Vendor creation failed" };
  } catch (error) {
    console.log("ADD VENDOR ERROR 👉", error?.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data) ||
        "Something went wrong",
    };
  } finally {
    setLoading(false);
  }
};

const editJoiningDate = async (hostelId, bookingId, payload) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.put(
      `/v2/bookings/rent/${hostelId}/${bookingId}`,
      {}, // body empty
      {
        params: {
          joiningDate: payload.joiningDate, // DD-MM-YYYY
          reason: payload.reason || "",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Update failed" };

  } catch (error) {
    console.log("EDIT JOINING DATE ERROR 👉", error?.response?.data);
    return {
      success: false,
      message:
        error?.response?.data ||
        "Unable to update joining date",
    };
  } finally {
    setLoading(false);
  }
};

const editRentalAmount = async (hostelId, bookingId, payload) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.put(
      `/v2/bookings/rent/${hostelId}/${bookingId}`,
      {}, // body empty
      {
        params: {
          newRent: payload.newRent,
          reason: payload.reason || "",
          effectiveDate: payload.effectiveDate || "",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Update failed" };
  } catch (error) {
    console.log("EDIT RENT ERROR 👉", error?.response?.data);
    return {
      success: false,
      message:
        error?.response?.data || "Unable to update rent amount",
    };
  } finally {
    setLoading(false);
  }
};const editAdvanceAmount = async (hostelId, bookingId, payload) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.put(
      `/v2/bookings/advance/${hostelId}/${bookingId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Update failed" };
  } catch (error) {
    console.log("EDIT ADVANCE ERROR 👉", error?.response?.data);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Unable to update advance amount",
    };
  } finally {
    setLoading(false);
  }
};

const assignAmenitiesForTenant = async (hostelId, payload) => {
  try {
    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.put(
      `/v2/amenity/assign/customer/${hostelId}`,
      payload, // ✅ body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: res.data };
  } catch (error) {
    console.log("ASSIGN AMENITY ERROR 👉", error?.response?.data);
    return {
      success: false,
      message: error?.response?.data?.message || "Assign failed",
    };
  }
};



  return (
    <CustomerContext.Provider
      value={{
        getCustomersByHostel,
        GetParticularCustomerDetails,
        ParticularcustomerDetails,
        resetParticularCustomer,
        loading,
        errorMsg,
        addCustomer,
        addVendor ,
        getBedsByHostelAndDate, 
        checkInCustomer, deleteCustomer,
         changeBedCustomer, 
         getCustomerDetails,
         moveToNoticePeriod,
         bookCustomer,cancelCheckout,getSettlementByCustomerId,submitSettlement,initializeCheckout,confirmCheckout,
         initializeCheckIn,bookedCheckInCustomer,initializeCancelBooking,cancelBooking,getCheckoutCustomersByHostel,editBasicDetails,editJoiningDate,editRentalAmount,editAdvanceAmount,assignAmenitiesForTenant
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);
