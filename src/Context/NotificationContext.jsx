import React, { createContext, useContext, useState } from "react";
import { getAxios } from "../Config/AxiosConfig";
import { retriveData } from "../Utils/Storage";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getNotificationsByHostel = async (hostelId) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token = await retriveData("token");
      const axios = getAxios();

      const res = await axios.get(
        `/v2/notification/${hostelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
console.log("resNoti",res)
      if (res.status === 200) {
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (error) {
      console.log("NOTIFICATION ERROR 👉", error?.response?.data);
      setErrorMsg(
        error?.response?.data?.message || "Notification fetch failed"
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
const readNotificationsByHostel = async (hostelId) => {
    try {
      const token = await retriveData("token");
      const axios = getAxios();

      const res = await axios.put(
        `/v2/notification/read/${hostelId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.status === 200;
    } catch (error) {
      console.log("READ NOTIFICATION ERROR 👉", error?.response?.data);
      return false;
    }
  };
  const getComplaintUpdates = async (hostelId, complaintId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const token = await retriveData("token");
    const axios = getAxios();

    const res = await axios.get(
      `/v2/complaint/updates/${hostelId}/${complaintId}`,
      {
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
    console.log("COMPLAINT UPDATE ERROR 👉", error?.response?.data);
    setErrorMsg(
      error?.response?.data?.message || "Complaint update fetch failed"
    );
    return { success: false };
  } finally {
    setLoading(false);
  }
};

  return (
    <NotificationContext.Provider
      value={{
        getNotificationsByHostel,
        loading,
        errorMsg,
        readNotificationsByHostel,getComplaintUpdates
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () =>
  useContext(NotificationContext);
