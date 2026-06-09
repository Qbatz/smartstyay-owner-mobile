import React, { createContext, useContext, useState } from "react";
import base64 from "react-native-base64";
import { getAxios } from "../Config/AxiosConfig";
import axios from "axios";
import { retriveData } from "../Utils/Storage";
import { LoginContexts } from "./LoginContext";
import {AutoLogout} from "../Component/AutoLogout"
export const PGContext = createContext();

export default function PGProvider({ children }) {
  const [pgLoading, setPgLoading] = useState(false);
  const [pgError, setPgError] = useState(null);
  const [PGDetails, setPgDetails] = useState(null);
  const loginContext=useContext(LoginContexts)


  const convertToBase64File = (json) => {
    const jsonString = JSON.stringify(json);
    const encoded = base64.encode(jsonString);

    return {
      uri: `data:application/json;base64,${encoded}`,
      type: "application/json",
      name: "payload.json",
    };
  };


  const addPG = async (params) => {
    console.log(params)
    try {
      setPgLoading(true);
      setPgError(null);

      const formData = new FormData();


      formData.append("payloads", convertToBase64File(params.payloads));


      if (params.mainImage) {
        formData.append("mainImage", params.mainImage);
      }


      if (params.additionalImages?.length > 0) {
        params.additionalImages.forEach((img) => {
          formData.append("additionalImages", img);
        });
      }
      const axios = getAxios();
      const response = await axios.post("/v2/hostel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if(response.status === 200){
        setPgLoading(false);
      }
      
      return response;
    } catch (error) {
      console.log("ADD PG ERROR:", error);
      if (error?.response?.status === 401) {
        await AutoLogout(loginContext)
      }
      setPgError(error);
      setPgLoading(false);
      return error;
    } 
    // finally {
    //   setPgLoading(false);
    // }
  };


  const editPG = async (params) => {
    console.log(params.additionalImages)
    try {
      setPgLoading(true);
      setPgError(null);

      const formData = new FormData();

      const isNewImage = (img) => {
        return typeof img?.uri === "string" && img.uri.startsWith("file://");
      };
      // Append payload
      formData.append("payloads", convertToBase64File(params.payloads));

      // Append main image ONLY if new
      if (params.mainImage && isNewImage(params.mainImage)) {
        formData.append("mainImage", params.mainImage);
      }

      // Append only NEW additional images
      if (params.additionalImages?.length > 0) {
        params.additionalImages.forEach((img) => {
          if (isNewImage(img)) {
            formData.append("additionalImages", img);
          }
        });
      }


      // formData.append("payloads", convertToBase64File(params.payloads));


      // formData.append("mainImage", params.mainImage || "");


      // if (params.additionalImages?.length > 0) {
      //   params.additionalImages.forEach((img) =>
      //     formData.append("additionalImages", img)
      //   );
      // } else {
      //   formData.append("additionalImages", "");
      // }
      const axios = getAxios();
      const response = await axios.put(
        `/v2/hostel/${params.hostelId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response;
    } catch (error) {
      console.log("UPDATE PG ERROR:", error);
      console.log("error", error.message)
      if (error?.response?.status === 401) {
        await AutoLogout(loginContext)
      }
      setPgError(error);
      return error;
    } finally {
      setPgLoading(false);
    }
  };

  const deletePG = async (hostelId) => {
    try {
      setPgLoading(true);
      setPgError(null);
      const axios = getAxios();
      const response = await axios.delete(`/v2/hostel/${hostelId}`);
      return response;

    } catch (error) {
      console.log("DELETE PG ERROR:", error?.response || error);
      if (error?.response?.status === 401) {
        await AutoLogout(loginContext)
      }

      setPgError(error);
      return error?.response || error;
    } finally {
      setPgLoading(false);
    }
  };

  const getParticularHostelDetails = async (hostelId) => {
    try {
      setPgLoading(true);
      setPgError(null);

      const axios = getAxios();
      const response = await axios.get(`/v2/hostel/${hostelId}`);

      setPgDetails(response?.data);

      return response;
    } catch (error) {
      console.log("GET PG DETAILS ERROR:", error?.response || error);
      if (error?.response?.status === 401) {
        await AutoLogout(loginContext)
      }
      setPgError(error);
      return error?.response || error;
    } finally {
      setPgLoading(false);
    }
  };

  const getDashboard = async (hostelId, filters = {}) => {
    console.log(hostelId, filters, "listDetails")
    try {
      setPgLoading(true);
      setPgError(null);

      const axios = getAxios();

      const response = await axios.get(`/v2/dashboard/new/${hostelId}`, {
        params: {
          billingFilter: filters?.billingFilter,
          complaintRequestFilter: filters?.complaintRequestFilter,
          financeFilter: filters?.financeFilter,
          occupancyFilter: filters?.occupancyFilter,
        },
        paramsSerializer: params => {
          const qs = require("qs");
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      });
      return response;

    } catch (error) {
      console.log("GET DASHBOARD ERROR:", error?.response || error);
      if (error?.response?.status === 401) {
        await AutoLogout(loginContext)
      }
      setPgError(error);
      return error?.response || error;

    } finally {
      setPgLoading(false);
    }
  };

  const deleteAdditionalImages = async (hostelId, imageId) => {



    try {
      const axios = getAxios();
      const token = await retriveData("token");

      const res = await axios.delete(`/v2/hostel/${hostelId}/additional-images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return res;
    } catch (error) {
      return { status: error.response.status, message: error.response.data }
    }
  }


  return (
    <PGContext.Provider value={{ addPG, editPG, deletePG, getParticularHostelDetails, getDashboard, PGDetails,setPgDetails, pgLoading, pgError, deleteAdditionalImages }}>
      {children}
    </PGContext.Provider>
  );
}
