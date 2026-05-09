import React, { useContext } from "react";
import {storeData,removeData} from "../Utils/Storage.js"
// import { LoginContexts } from "../Context/LoginContext.js";
import { ACCESS_TOKEN, LOGGEDIN, USER_ID } from "../Utils/Constant.js";

export const AutoLogout=async(loginContext)=>{
     await Promise.all([
        removeData(ACCESS_TOKEN),
        storeData(LOGGEDIN, "false"),
        removeData(USER_ID)
      ])


      loginContext.logoutf("false")

      loginContext.updateUserId("")
}