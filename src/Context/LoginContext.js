

// import React, { createContext, useState } from "react";
// import { storeData } from "../Utils/Storage";

// export const LoginContexts = createContext();

// const LoginContext = (props) => {
//   const [AccessToken, setAccessToken] = useState();
//   const [getUserId, setUserId] = useState(null);

//   const saveToken = async (token) => {
//     setAccessToken(token);
//     await storeData("token", token); 
//   };

//   return (
//     <LoginContexts.Provider value={{ updateToken: saveToken, getToken: AccessToken }}>
//       {props.children}
//     </LoginContexts.Provider>
//   );
// };

// export default LoginContext;



import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";
import { storeData } from "../Utils/Storage";
import { LOGGEDIN } from "../Utils/Constant";

export const LoginContexts = createContext();

const LoginContext = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // ------------------------
  // LOGIN (EMAIL + PASSWORD)
  // ------------------------
  const login = async (payload) => {
    try {
      setLoading(true);
      const res = await AxiosConfig.post("/v2/mobile/login", payload);
      setUserId(res.data.userId);
      return { success: true, data: res.data };
    } catch (e) {
      return {
        success: false,
        status: e.response?.status,
        message: e.response?.data?.message,
      };
    } finally {
      setLoading(false);
    }
  };

 
  const CreateMpin = async (pin) => {
    try {
      const res = await AxiosConfig.post(
        `/v2/mobile/pin/${userId}`,
        { pin }
      );

      await storeData(LOGGEDIN, "true");
      setLoggedIn(true);

      return { success: true };
    } catch (e) {
      return { success: false };
    }
  };


  const verifyMpin = async (pin) => {
    try {
      const res = await AxiosConfig.post(
        `/v2/mobile/verify/${userId}`,
        { pin }
      );

      await storeData(LOGGEDIN, "true");
      setLoggedIn(true);

      return { success: true };
    } catch {
      return { success: false };
    }
  };

  return (
    <LoginContexts.Provider
      value={{
        login,
        CreateMpin,
        verifyMpin,
        userId,
        loggedIn,
        loading,
      }}
    >
      {children}
    </LoginContexts.Provider>
  );
};

export default LoginContext;
