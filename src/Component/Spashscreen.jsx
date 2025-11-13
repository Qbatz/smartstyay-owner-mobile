import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions,Image } from "react-native";
import spashimg from '../Assets/Images/splash.png'

const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace("LogoScreen");
//     }, 2000);
//     return () => clearTimeout(timer);
//   }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
          source={spashimg}
          style={styles.image}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  logo: { width: 120, height: 50, marginTop: 60, resizeMode: "contain" },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  image: { width: 220, height: 180, resizeMode: "contain", marginVertical: 20 },
  title: { fontSize: 20, fontWeight: "bold", color: "#000", marginBottom: 10 },
  desc: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  dots: { flexDirection: "row", marginBottom: 30 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: { backgroundColor: "#007bff" },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
