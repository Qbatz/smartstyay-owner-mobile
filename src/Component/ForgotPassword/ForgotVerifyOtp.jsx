import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function OtpVerification({ route }) {
    
  const { email } = route.params;
   const navigation = useNavigation();
  const [deviceWidth, setDeviceWidth] = useState(Dimensions.get("window").width);
   const userEmail = route?.params?.email || "user@example.com";
   const userId=route?.params?.userId || "";

useEffect(() => {
  const subscription = Dimensions.addEventListener("change", ({ window }) => {
    setDeviceWidth(window.width);
  });

  return () => subscription?.remove();
}, []);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [filled, setFilled] = useState(false);

  console.log(route)

  let inputs = [];

  const handleChange = (text, index) => {
    let updated = [...otp];
    updated[index] = text;
    setOtp(updated);

    setError("");

    // Enable button
    setFilled(updated.every((v) => v !== ""));

    if (text && index < 5) {
      inputs[index + 1].focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>OTP Verification</Text>

          <Image
            source={require("../../Assets/Images/forgotVerify.png")}
            style={styles.otpImage}
          />

          <Text style={styles.subTitle}>Check your inbox.</Text>
          <Text style={styles.mailText}>
            We’ve sent an OTP to <Text style={{ fontWeight: "600" }}>{email}</Text>
          </Text>

          <Text style={styles.label}>Enter 6 Digit OTP Number</Text>

          <View style={styles.otpRow}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs[index] = ref)}
                value={value}
                onChangeText={(t) => handleChange(t, index)}
                maxLength={1}
                keyboardType="numeric"
                style={[
                  styles.otpBox,
                  error ? styles.otpErrorBorder : null,
                ]}
              />
            ))}
          </View>

          {error ? <Text style={styles.errorText}>❗ {error}</Text> : null}

          <TouchableOpacity style={styles.resendTop}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!filled}
           onPress={() => navigation.navigate("SetNewPassword", { email: userEmail,userId:userId })}
            style={[
              styles.verifyBtn,
              { backgroundColor: filled ? "#1E5EFF" : "#9CC1FF" },
            ]}
          >
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>

         
        </View>
      </KeyboardAvoidingView>

      {/* 🔥 FIXED BOTTOM IMAGE */}
      <Image
        source={require("../../Assets/Images/OtpRectangle.png")}
      style={[styles.bottomImage, { width: deviceWidth }]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 40,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
   marginTop:55,
    color: "#111",
  },

  otpImage: {
    width: "60%",
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
    resizeMode: "contain",
  },

  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  mailText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    color: "#000",
  },

  otpErrorBorder: {
    borderColor: "red",
  },

  errorText: {
    color: "red",
    marginTop: 4,
    marginBottom: 10,
    fontSize: 12,
  },

  resendTop: {
    alignSelf: "flex-end",
    marginTop: 5,
  },

  resendText: {
    color: "#1E5EFF",
    fontSize: 12,
    marginBottom: 15,
  },

  verifyBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },

  verifyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  resendTextUnder: {
    textAlign: "center",
    color: "#1E5EFF",
    fontSize: 14,
    marginTop: 8,
  },


 bottomImage: {
    height: 220,           
    position: "absolute",
    bottom: 0,
    left: 0,
    resizeMode: "cover",
},

});
