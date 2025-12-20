import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function Loader() {
  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <LottieView
          source={require("../../Assets/animations/loader.json")}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />

        {/* 👇 Loading text */}
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  content: {
    alignItems: "center",
  },

  loadingText: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
});
