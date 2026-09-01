import React from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import LottieView from "lottie-react-native";

const CatLoader = ({ visible }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <LottieView
            source={require("../../Assets/animations/catloader.json")}
            autoPlay
            loop
            style={{ width: 140, height: 140 }}
          />

          <Text style={styles.text}>
            Almost there...
          </Text>
          <Text>Don't blink!</Text>
        </View>
      </View>
    </Modal>
  );
};

export default CatLoader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)", // light dim
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 25,
    alignItems: "center",

    // shadow
    elevation: 8,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    letterSpacing:0.7
  },
});