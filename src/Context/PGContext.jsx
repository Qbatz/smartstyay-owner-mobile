import React, { createContext, useState } from "react";
import base64 from "react-native-base64";
import { getAxios } from "../Config/AxiosConfig";


export const PGContext = createContext();

export default function PGProvider({ children }) {
  const [pgLoading, setPgLoading] = useState(false);
  const [pgError, setPgError] = useState(null);
  const [PGDetails, setPgDetails] = useState(null);


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

      return response;
    } catch (error) {
      console.log("ADD PG ERROR:", error);
      setPgError(error);
      return error;
    } finally {
      setPgLoading(false);
    }
  };


  const editPG = async (params) => {
    try {
      setPgLoading(true);
      setPgError(null);

      const formData = new FormData();


      formData.append("payloads", convertToBase64File(params.payloads));


      formData.append("mainImage", params.mainImage || "");

    
      if (params.additionalImages?.length > 0) {
        params.additionalImages.forEach((img) =>
          formData.append("additionalImages", img)
        );
      } else {
        formData.append("additionalImages", "");
      }
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
      console.log("error",error.message)
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
    setPgError(error);
    return error?.response || error;
  } finally {
    setPgLoading(false);
  }
};




  return (
    <PGContext.Provider value={{ addPG, editPG,deletePG ,getParticularHostelDetails,PGDetails, pgLoading, pgError }}>
      {children}
    </PGContext.Provider>
  );
}
