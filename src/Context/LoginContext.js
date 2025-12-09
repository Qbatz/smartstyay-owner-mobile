// import React,{createContext,useState} from "react";

//     export const LoginContexts=createContext();

// const LoginContext=(props)=>{

//     const [AccessToken,setAccessToken]=useState()

//     console.log(AccessToken)
    


//     return <LoginContexts.Provider value={{updateToken:setAccessToken,getToken:AccessToken}}>
//         {props.children}
//     </LoginContexts.Provider>
// }
// export default LoginContext;

import React, { createContext, useState } from "react";
import { storeData } from "../Utils/Storage";

export const LoginContexts = createContext();

const LoginContext = (props) => {
  const [AccessToken, setAccessToken] = useState();

  const saveToken = async (token) => {
    setAccessToken(token);
    await storeData("token", token); 
  };

  return (
    <LoginContexts.Provider value={{ updateToken: saveToken, getToken: AccessToken }}>
      {props.children}
    </LoginContexts.Provider>
  );
};

export default LoginContext;
