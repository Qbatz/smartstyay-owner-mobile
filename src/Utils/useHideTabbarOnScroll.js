// import React, { useRef } from "react";

// export const useHideTabbarOnScroll = (setShowTabBar, setShowFloorBar, setShowProfileTopBar) => {
//   const lastScrollY = useRef(0);
//   const isHidden = useRef(false);

//   const handleScroll = (event) => {
//     const currentY = event.nativeEvent.contentOffset.y;
//     const diff = currentY - lastScrollY.current;

//     if (Math.abs(diff) < 20) return;

//     if (diff > 0 && currentY > 50) {
//       setShowTabBar?.(false);
//       setShowFloorBar?.(false)
//       setShowProfileTopBar?.(false)
//     } else if (diff < 0) {
//       setShowTabBar?.(true);
//       setShowFloorBar?.(true)
//       setShowProfileTopBar?.(true)
//     }

//     if (diff > 0 && currentY > 50) {
//       if (!isHidden.current) {
//         setShowTabBar?.(false);
//         setShowFloorBar?.(false)
//         setShowProfileTopBar?.(false)
//         isHidden.current=true;
//       }
//     } else if (diff < 0) {
//       if (isHidden.current) {
//         setShowTabBar?.(true);
//         setShowFloorBar?.(true)
//         setShowProfileTopBar?.(true)
//         isHidden.current=false;
//       }
//     }



//     lastScrollY.current = Math.max(currentY, 0);
//   };

//   return { handleScroll };
// }


// import { useRef } from "react";

// export const useHideTabbarOnScroll = (
//   setShowTabBar,
//   setShowProfileTopBar
// ) => {
//   const lastScrollY = useRef(0);
//   const isHidden = useRef(false);

//   const scrollAccumulator = useRef(0); 

//   const handleScroll = (event) => {
//     const currentY = event.nativeEvent.contentOffset.y;
//     const diff = currentY - lastScrollY.current;

//     scrollAccumulator.current += diff


//     if (scrollAccumulator.current > 40 && currentY > 50) {
//       if (!isHidden.current) {
//         setShowTabBar?.(false);
//         setShowProfileTopBar?.(false);
//         isHidden.current = true;
//       }
//       scrollAccumulator.current = 0; 
//     }

//     else if (scrollAccumulator.current < -40) {
//       if (isHidden.current) {
//         setShowTabBar?.(true);
//         setShowProfileTopBar?.(true);
//         isHidden.current = false;
//       }
//       scrollAccumulator.current = 0; 
//     }

//     lastScrollY.current = Math.max(currentY, 0);
//   };

//   return { handleScroll };
// };

import { useRef, useCallback } from "react";
import { Animated } from "react-native";
import { Platform } from "react-native";

export const useHideTabbarOnScroll = (
  setShowTabBar
) => {
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  const HEADER_HEIGHT =
  Platform.OS === "ios" ? 80 : 120;

  const headerTranslate = useRef(new Animated.Value(0)).current;

  const handleScroll = useCallback((event) => {
    if (!event?.nativeEvent?.contentOffset) return;

    const currentY = event.nativeEvent.contentOffset.y;

    if (currentY < 0) return;

    const diff = currentY - lastScrollY.current;

    if (Math.abs(diff) < 15) return;

    // HIDE
    if (
      diff > 0 &&
      currentY > 80 &&
      !isHidden.current
    ) {
      isHidden.current = true;

      Animated.timing(headerTranslate, {
        toValue: -HEADER_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }).start();

      setShowTabBar?.(false);
    }

    // SHOW
    else if (
      diff < 0 &&
      isHidden.current
    ) {
      isHidden.current = false;

      Animated.timing(headerTranslate, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();

      setShowTabBar?.(true);
    }

    lastScrollY.current = currentY;
  }, []);

  return {
    handleScroll,
    headerTranslate,
  };
};