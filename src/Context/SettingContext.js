import React, { createContext, useContext } from "react";
import AxiosConfig from "../Config/AxiosConfig";
import { retriveData } from "../Utils/Storage";


const ElectricityContext = createContext();
export const useElectricity = () => useContext(ElectricityContext);

export const ElectricityProvider = ({ children }) => {

const getElectricity = async (hostelId) => {
  try {
    const token = await retriveData("token");
console.log("token",token , hostelId)
    const res = await AxiosConfig.get(
      `/v2/hostel/electricity/${hostelId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    return { success: true, data: res.data }; 

  } catch (err) {
    return { success: false, data: err.response?.data || err.message };
  }
};



const updateElectricity = async (hostelId, unitPrice) => {
    try {
      const token = await retriveData("token");

      const body = { unitPrice };

      const res = await AxiosConfig.put(
        `/v2/hostel/electricity/${hostelId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("UPDATE EB SUCCESS →", res.data);
      return { success: true, data: res.data };

    } catch (err) {
      console.log("UPDATE EB ERROR →", err.response?.data);
      return { success: false, data: err.response?.data };
    }
  };
const changeRoomHostelElectricity = async (payload) => {
  try {
    const token = await retriveData("token");

    const query = new URLSearchParams({
      isRoomBased: payload.isRoomBased,
      isHostelBased: payload.isHostelBased,
      isProRate: payload.isProRate ?? true,
      calculationStartingDate:
        payload.calculationStartingDate ?? Math.floor(Date.now() / 1000), // FIXED!!
      frequent: payload.frequent ?? "monthly",
      shouldIncludeInRent: payload.shouldIncludeInRent ?? true,
    }).toString();

    const url = `/v2/hostel/electricity/config/${payload.hostelId}?${query}`;

    console.log("🔵 FINAL EB CONFIG URL →", url);

    const res = await AxiosConfig.put(url, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("🟢 EB CONFIG SUCCESS →", res.data);
    return { success: true, data: res.data };

  } catch (err) {
    console.log("🔴 EB CONFIG ERROR →", err.response?.data || err.message);
    return { success: false, data: err.response?.data || err.message };
  }
};






  return (
    <ElectricityContext.Provider value={{ getElectricity,updateElectricity,changeRoomHostelElectricity }}>
      {children}
    </ElectricityContext.Provider>
  );
};
