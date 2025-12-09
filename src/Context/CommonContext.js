import React,{createContext,useState} from "react";

        export const CommonContexts=createContext();

const CommonContext=(props)=>{

    const [HostelId,setHostelId]=useState()

    return<CommonContexts.Provider value={{updateHostelId:setHostelId,getHostelId:HostelId}}>
        {props.children}
    </CommonContexts.Provider>
}
export default CommonContext;