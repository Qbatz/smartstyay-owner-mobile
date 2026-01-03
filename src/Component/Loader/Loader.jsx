import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

export default function Loader() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#2D6CDF" />
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
});
