import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Dimensions
} from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

export default function SucessUpdatePassword() {
  const navigation = useNavigation();

  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(60)).current;

 useEffect(() => {
  Animated.parallel([
    Animated.timing(scale, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }),
  ]).start(() => {
   
    navigation.navigate("LoginDesign");
  });
}, []);


  return (
    <SafeAreaView style={styles.container}>

     
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity,
          marginTop: 120,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LottieView
          source={require("../../Assets/animations/success.json")}
          autoPlay
          loop={false}
          style={{ width: 200, height: 200 }}
        />
      </Animated.View>

      
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }],
          alignItems: "center",
        
          paddingHorizontal: 30,
        }}
      >
        <Text style={styles.title}>Succeeded</Text>

        <Text style={styles.subtitle}>
          Congratulations! Your password has been{"\n"}
          successfully updated. Click Continue to login
        </Text>
      </Animated.View>

     
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }],
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#989898",
  },

  button: {
    backgroundColor: "#2D6CDF",
    paddingVertical: 14,
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 40,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
