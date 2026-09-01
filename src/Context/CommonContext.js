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
   const [activeHostelId, setActiveHostelId] = useState(null);

  return (
    <CommonContexts.Provider
      value={{
        updateHostelId: setHostelId,
        getHostelId: HostelId,

        hostelList,               
        updateHostelList: setHostelList, 
          activeHostelId,
        setActiveHostelId,  
      }}
    >
      {props.children}
    </CommonContexts.Provider>
  );
};

export default CommonContext;
