import React,{useEffect}from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function SplashText() {
    const navigation = useNavigation();

useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("SplashScreen");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);    
  return (
    <View style={styles.container}>
      <Text style={styles.bigText}>Smart</Text>
      <Text style={styles.tagline}>All Your Needs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },

  bigText: {
    position: "absolute",
    top: height * 0.15,            // slightly above middle
    fontSize: width * 0.42,        // HUGE text like screenshot
    fontWeight: "900",
    opacity: 0.05,
    color: "#000",
    textAlign: "center",
    width: width * 1.5,            // overflow like screenshot
  },

  tagline: {
    position: "absolute",
    top: height * 0.55,            // below center
    fontSize: width * 0.14,
    fontWeight: "700",
    opacity: 0.05,
    color: "#000",
    textAlign: "center",
    width: width * 1.5,
  },
});
