import React, { createContext, useContext, useState } from "react";
import api from "../Config/AxiosConfig";
import { retriveData } from "../Utils/Storage";

const FloorContext = createContext();

export const FloorProvider = ({ children }) => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllFloorsByHostel = async (hostelId) => {
    try {
      setLoading(true);
      const token = await retriveData("token");

      const res = await api.get(
        `/v2/floor/all-floors/${hostelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 IMPORTANT FIX
      // Swagger returns ARRAY directly
      setFloors(res.data);

      return { success: true, data: res.data };
    } catch (err) {
      console.log("Floor API error", err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
const addFloor = async ({ hostelId, floorName }) => {
    try {
      setLoading(true);
      const token = await retriveData("token");

      const payload = {
        hostelId,
        floorName,
      };

      const res = await api.post(
        `/v2/floor`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data,
      };
    } finally {
      setLoading(false);
    }
  };
  const getAllRoomsByFloor = async (floorId) => {
    try {
      setLoading(true);
      const token = await retriveData("token");

      const res = await api.get(
        `/v2/room/all-rooms/${floorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

    

      return { success: true, data: res.data };
    } catch (err) {
      console.log("Room API error", err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
  const addRoom = async ({ hostelId, floorId, roomName }) => {
    try {
      setLoading(true);
      const token = await retriveData("token");

      const payload = {
        hostelId,
        floorId,
        roomName,
      };

      const res = await api.post(`/v2/room`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data || "Room add failed",
      };
    } finally {
      setLoading(false);
    }
  };
  const getAllBedsByRoom = async (roomId) => {
  try {
    setLoading(true);
    const token = await retriveData("token");

    const res = await api.get(
      `/v2/bed/all-beds/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: res.data };
  } catch (err) {
    console.log("Bed API error", err);
    return { success: false };
  } finally {
    setLoading(false);
  }
};

const addBed = async ({ bedName, roomId, hostelId, amount }) => {
  try {
    setLoading(true);
    const token = await retriveData("token");

    const payload = {
      bedName,
      roomId,
      hostelId,
      amount,
    };

    const res = await api.post(
      `/v2/bed`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: res.data };
  } catch (err) {
    console.log("Add Bed API error", err);
    return {
      success: false,
      message: err?.response?.data || "Bed add failed",
    };
  } finally {
    setLoading(false);
  }
};


const updateRoom = async ({ roomId, hostelId, roomName }) => {
  try {
    setLoading(true);
    const token = await retriveData("token");

    const res = await api.put(
      `/v2/room/${roomId}/${hostelId}`,
      {
        roomName,
        isActive: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: res.data };
  } catch (err) {
    console.log("UPDATE ROOM ERROR", err?.response?.data || err);
    return {
      success: false,
      message: err?.response?.data || "Room update failed",
    };
  } finally {
    setLoading(false);
  }
};

const deleteRoom = async (roomId) => {
  try {
    const token = await retriveData("token");

    const res = await api.delete(`/v2/room/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data || "Room delete failed",
    };
  }
};
const deleteBed = async (bedId) => {
  try {
    const token = await retriveData("token");
    console.log("DELETE BED TOKEN 👉", token); // 🔥 ADD THIS

    const res = await api.delete(`/v2/bed/${bedId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: res.data };
  } catch (err) {
    console.log("Delete Bed API error 👉", err?.response?.data);
    return {
      success: false,
      message: err?.response?.data || "Bed delete failed",
    };
  }
};


const updateBed = async ({ bedId, bedName, amount }) => {
  try {
    setLoading(true);
    const token = await retriveData("token");

    const payload = {
      bedName,
      isActive: true,
      amount: Number(amount),
    };

    const res = await api.put(
      `/v2/bed/${bedId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: res.data };
  } catch (err) {
    console.log("UPDATE BED ERROR 👉", err?.response?.data || err);
    return {
      success: false,
      message: err?.response?.data || "Bed update failed",
    };
  } finally {
    setLoading(false);
  }
};


  return (
    <FloorContext.Provider
      value={{
        floors,
        loading,
        getAllFloorsByHostel,
        addFloor,getAllRoomsByFloor,addRoom,getAllBedsByRoom,addBed,updateRoom,deleteRoom,deleteBed,updateBed
      }}
    >
      {children}
    </FloorContext.Provider>
  );
};

export const useFloor = () => useContext(FloorContext);
