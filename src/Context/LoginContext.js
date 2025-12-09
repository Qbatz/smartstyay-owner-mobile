import React,{createContext,useState} from "react";

    export const LoginContexts=createContext();

const LoginContext=(props)=>{

    const [AccessToken,setAccessToken]=useState()

    console.log(AccessToken)
    


    return <LoginContexts.Provider value={{updateToken:setAccessToken,getToken:AccessToken}}>
        {props.children}
    </LoginContexts.Provider>
}
export default LoginContext;