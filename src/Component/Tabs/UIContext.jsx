import React, { createContext, useState } from "react";

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [tabBarHeight, setTabBarHeight] = useState(0);

  return (
    <UIContext.Provider value={{ tabBarHeight, setTabBarHeight }}>
      {children}
    </UIContext.Provider>
  );
};
