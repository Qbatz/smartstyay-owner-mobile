import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";

export const AmenityContext = createContext();

export default function AmenityProvider({ children }) {
  const [amenities, setAmenities] = useState([]);
  const [amenityDetail, setAmenityDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (err) =>
    err?.response?.data?.message ||
    err?.response?.data ||
    "Something went wrong";


  const GetAllAmenities = async (hostelId) => {
    setLoading(true);
    setAmenities([]);

    try {
      const res = await AxiosConfig.get(`/v2/amenity/${hostelId}`);

      if (res.status === 200) {
        const formatted = (res.data || []).map((item) => ({
          id: item.amenityId,
          name: item.amenityName,
          amount: item.amenityAmount,
          proRate: item.proRate,
          raw: item,
        }));

        setAmenities(formatted);
        return { success: true, data: formatted };
      }
      return { success: false, data: [] };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };


  const ParticularAmenityDetails = async ({ hostelId, amenityId }) => {
    setLoading(true);
    setAmenityDetail(null);

    try {
      const res = await AxiosConfig.get(
        `/v2/amenity/${hostelId}/${amenityId}`
      );

      if (res.status === 200) {
        const data = {
          id: res.data.amenityId,
          name: res.data.amenityName,
          amount: res.data.amenityAmount,
          proRate: res.data.proRate,

          assigned: res.data.assignedCustomers || [],
          unAssigned: res.data.unassignedCustomers || [],
        };

        setAmenityDetail(data);
        return { success: true, data };
      }
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };


  const addAmenity = async ({ hostelId, payload }) => {
    try {
      setLoading(true);
      const res = await AxiosConfig.post(
        `/v2/amenity/${hostelId}`,
        payload
      );

      if (res.status === 200 || res.status === 201) {
        await GetAllAmenities(hostelId);
        return { success: true, message: "Amenity added" };
      }
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };


  const updateAmenity = async ({ hostelId, amenityId, payload }) => {
    try {
      setLoading(true);
      const res = await AxiosConfig.put(
        `/v2/amenity/${hostelId}/${amenityId}`,
        payload
      );

      if (res.status === 200) {
        await GetAllAmenities(hostelId);
        return { success: true, message: "Updated successfully" };
      }
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };


  const deleteAmenity = async ({ hostelId, amenityId }) => {
    try {
      setLoading(true);
      const res = await AxiosConfig.delete(
        `/v2/amenity/${amenityId}/${hostelId}`
      );

      if (res.status === 200) {
        await GetAllAmenities(hostelId);
        return { success: true, message: "Deleted successfully" };
      }
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

 
  const assignAmenity = async ({ hostelId, amenityId, customers }) => {
    try {
      setLoading(true);
      const res = await AxiosConfig.put(
        `/v2/amenity/assign/${hostelId}/${amenityId}`,
        { customers }
      );

      if (res.status === 200 || res.status === 201) {
        return { success: true, message: "Assigned successfully" };
      }
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

 
  const unAssignAmenity = async ({ hostelId, amenityId, customers }) => {
    try {
      setLoading(true);
      const res = await AxiosConfig.put(
        `/v2/amenity/unAssign/${hostelId}/${amenityId}`,
        { customers }
      );

      if (res.status === 200) {
        return { success: true, message: "Unassigned successfully" };
      }
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AmenityContext.Provider
      value={{
        amenities,
        amenityDetail,
        loading,

        GetAllAmenities,
        ParticularAmenityDetails,
        addAmenity,
        updateAmenity,
        deleteAmenity,
        assignAmenity,
        unAssignAmenity,
      }}
    >
      {children}
    </AmenityContext.Provider>
  );
}
