import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Image, Easing } from "react-native";

import SmartStayLogo from "../../Assets/Images/smarstay_icon.png";

const SmartStayLoader = () => {

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loaderCircle,
          { transform: [{ rotate }] }
        ]}
      />

      <Image source={SmartStayLogo} style={styles.logo} />
    </View>
  );
};

export default SmartStayLoader;

const styles = StyleSheet.create({

  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
     backgroundColor: "rgba(0,0,0,0.4)",
  },

  loaderCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 6,
    borderColor: "#dbe4ff",
    borderTopColor: "#2f5bff",
    position: "absolute"
  },

  logo: {
    width: 35,
    height: 35,
    resizeMode: "contain"
  }

});