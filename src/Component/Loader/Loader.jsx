// import React from "react";
// import { View, StyleSheet, ActivityIndicator } from "react-native";

// export default function Loader() {
//   return (
//     <View style={styles.overlay}>
//       <ActivityIndicator size="large" color="#2D6CDF" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "rgba(0,0,0,0.25)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 9999,
//   },
// });



import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const Loader = () => {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <LottieView
          source={require("../../Assets/animations/catloader.json")}
          autoPlay
          loop
          style={{ width: 140, height: 140 }}
        />

        <Text style={styles.text}>Almost there...</Text>
        <Text style={styles.subText}>Don't blink!</Text>
      </View>
    </View>
  );
};

export default Loader;

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
    zIndex: 999,            
    elevation: 10,         
  },
  card: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 25,
    alignItems: "center",
    elevation: 8,
  },
  text: {
    marginTop: 10,
    fontSize: 22,
    // fontWeight: "600",
   fontFamily: "Gilroy-Bold",
    color: "#222222",
  },
  subText: {
    fontSize: 22,
    color: "#222222",
    fontFamily: "Gilroy-Bold",
    marginTop: 4,
  },
});
