import React,{createContext,useState} from "react";

    export const LoginContexts=createContext();

const LoginContext=(props)=>{



    return <LoginContexts.Provider value={{}}>
        {props.children}
    </LoginContexts.Provider>
}