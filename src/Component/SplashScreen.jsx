import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // navigation.replace("LogoScreen");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SmartStay</Text>
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    alignItems: "center",
    justifyContent: "center" 
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  }
});

export default SplashScreen;