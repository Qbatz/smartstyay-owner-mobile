import React,{useRef} from "react";

export const useHideTabbarOnScroll=(setShowTabBar,setShowFloorBar,setShowProfileTopBar)=>{
     const lastScrollY = useRef(0);

  const handleScroll = (event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (Math.abs(diff) < 15) return;

    if (diff > 0 && currentY > 50) {
      setShowTabBar?.(false);
      setShowFloorBar?.(false)
      setShowProfileTopBar?.(false)
    } else if (diff < 0) {
      setShowTabBar?.(true);
      setShowFloorBar?.(true)
      setShowProfileTopBar?.(true)
    }

    lastScrollY.current = Math.max(currentY, 0);
  };

  return { handleScroll };
}