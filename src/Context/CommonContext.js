// import React,{createContext,useState} from "react";

//         export const CommonContexts=createContext();

// const CommonContext=(props)=>{

//     const [HostelId,setHostelId]=useState()

//     return<CommonContexts.Provider value={{updateHostelId:setHostelId,getHostelId:HostelId}}>
//         {props.children}
//     </CommonContexts.Provider>
// }
// export default CommonContext;

import React, { createContext, useState } from "react";

export const CommonContexts = createContext();

const CommonContext = (props) => {
  const [HostelId, setHostelId] = useState();
  const [hostelList, setHostelList] = useState([])
  

  return (
    <CommonContexts.Provider
      value={{
        updateHostelId: setHostelId,
        getHostelId: HostelId,

        hostelList,               
        updateHostelList: setHostelList, 
      }}
    >
      {props.children}
    </CommonContexts.Provider>
  );
};

export default CommonContext;
