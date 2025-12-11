import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";
import base64 from "react-native-base64";


export const PGContext = createContext();

export default function PGProvider({ children }) {
  const [pgLoading, setPgLoading] = useState(false);
  const [pgError, setPgError] = useState(null);

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

      const response = await AxiosConfig.post("/v2/hostel", formData, {
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

      const response = await AxiosConfig.put(
        `/v2/hostel/${params.hostelId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response;
    } catch (error) {
      console.log("UPDATE PG ERROR:", error);
      setPgError(error);
      return error;
    } finally {
      setPgLoading(false);
    }
  };

  return (
    <PGContext.Provider value={{ addPG, editPG, pgLoading, pgError }}>
      {children}
    </PGContext.Provider>
  );
}
