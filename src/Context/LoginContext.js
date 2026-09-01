import React, { createContext, useId, useState } from "react";
import { getAxios } from "../Config/AxiosConfig";
import { storeData, removeData } from "../Utils/Storage";
import { ACCESS_TOKEN, LOGGEDIN } from "../Utils/Constant";

export const LoginContexts = createContext();

const LoginContext = ({ children }) => {
  const [userId, setUserId] = useState(null);
  // const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedIN, setLoggedIN] = useState()
  const [pinVerifid, setPinVerified] = useState(false)
  const [route, setRoute] = useState()
  const [Network, setCheckNetConnectivity] = useState(true)
  console.log(userId)


  console.log("pinverfied", pinVerifid);
  //  console.log("loggedIn", loggedIn);
  console.log("loggedIn", loggedIN);
  console.log("userId", userId);

  const login = async (payload) => {
    try {
      setLoading(true);
      const axios = getAxios();
      const res = await axios.post("/v2/mobile/login", payload);
      console.log("res", res);

      // setUserId(res.data.userId);
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
  }



  const logout = async () => {

    try {

      setLoading(true);
      const axios = getAxios();
      const res = await axios.post("/v2/profile/logout", {
        source: "MOBILE",
      });
      console.log(res)
      return res;

    } catch (error) {
      return { status: error.response.status, message: error.response.data };
    }
    // try {
    //   setLoading(true);

    //   const res = await AxiosConfig.post("/v2/profile/logout", {
    //     source: "MOBILE",
    //   });

    //   if (res?.status === 200) {
    //         await removeData(ACCESS_TOKEN);
    //   await removeData(LOGGEDIN);

    //   setUserId(null);
    //   setLoggedIn(false);
    //   setPinVerified(false);
    //   setRoute(null);
    //     return { success: true };

    //   }

    //   return { success: false };

    // } catch (error) {
    //   console.log("logout error", error?.response?.data);
    //   return {
    //     success: false,
    //     message: error?.response?.data?.message || "Logout failed",
    //   };
    // } finally {
    //   setLoading(false);
    // }
  };




  const CreateMpin = async (data) => {
    console.log(userId)
    try {
      const axios = getAxios();
      const res = await axios.post(
        `/v2/mobile/pin/${userId}`,
        data
      );
      console.log(res)
      await storeData("token", res.data)

      // await storeData(LOGGEDIN, "true");
      // setLoggedIn(true);


      return res;
    } catch (error) {
      return { status: error.response.status, message: error.response.data };
    }
  };


  const verifyMpin = async (data) => {

    console.log("user id", userId)
    try {
      const axios = getAxios();
      const res = await axios.post(
        `/v2/mobile/verify/${userId}`,
         data 
      );

      const token = res.data;

      console.log("token", token);
      await storeData("token", token);
      await storeData(LOGGEDIN, "true");
      // setLoggedIn(true);

      return res;
    } catch (error) {
      console.log("verify mpin error", error);
      return { status: error.response.status, message: error.response.data };
    }
  };
  const loggedinFn = (value) => {
    setLoggedIN(value)
  }

  const updatePinSetupStatus = (status) => {
    setPinVerified(status)
  }

  const updateUserId = (userId) => {
    console.log("updating userId", userId)
    setUserId(userId);
  }

  const routeNamefn = (value) => {
    setRoute(value)
  }

  const logoutfn = (value) => {
    console.log(value)
    // setLoggedIn(value)
    setLoggedIN(value)
  }
  const fetchNetwork = (value) => {
    setCheckNetConnectivity(value)
  }

  const getForgotPasswordotp = async (emailID) => {
    try {
      const axios = getAxios();
      const res = await axios.get("/v2/users/request-otp/" + emailID)
      console.log(res)
      return res;
    } catch (error) {
      console.log("verify mpin error", error);
      return { status: error.response.status, message: error.response.data };
    }
  }

  const updatePassword=async(data)=>{
    try{
      const axios=getAxios();
      
      const res=await axios.post("/v2/users/reset-password", )
    }catch(error){
      console.log("verify mpin error", error);
      return { status: error.response.status, message: error.response.data };
    }
  }

  return (
    <LoginContexts.Provider
      value={{
        login,
        logout,
        CreateMpin,
        verifyMpin,
        userId,
        loading,

        loggedin: loggedinFn,
        LoggedIN: loggedIN,
        pinVerifid,
        updatePinSetupStatus,
        updateUserId,
        logoutf: logoutfn,
        getForgotPasswordotp,

        updateRoute: routeNamefn, getRoute: route, internet: fetchNetwork, getNetworkConnectivity: Network,

      }}
    >
      {children}
    </LoginContexts.Provider>
  );
};

export default LoginContext;
