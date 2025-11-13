import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import SmartstayIcon from "../Assets/Images/Sm_Icon.png";
import EyeIcon from "../Assets/Images/EyeIcon.png";
import Eye from "../Assets/Images/Eye.png";
import WaveImage from "../Assets/Images/CreateAccount_Rectangle.png";

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View style={styles.content}>

            <Image source={SmartstayIcon} style={styles.logo} />

            <Text style={styles.heading}>Create your free account</Text>
            <Text style={styles.subheading}>
              Enter your details below to find your stay smartly
            </Text>

            <View style={styles.formScrollBox}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >

                <Text style={styles.label}>First name *</Text>
                <View style={styles.inputBox}>
                  <TextInput placeholder="Enter First Name" style={styles.input} />
                </View>

                <Text style={styles.label}>Last Name *</Text>
                <View style={styles.inputBox}>
                  <TextInput placeholder="Enter Last Name" style={styles.input} />
                </View>

                <Text style={styles.label}>Email *</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="Ex : arunkumar77@mail.com"
                    style={styles.input}
                  />
                </View>

                <Text style={styles.label}>Mobile No *</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="+91   98765 43210"
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>

                <Text style={styles.label}>Password *</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="Enter Password"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Image source={showPassword ? Eye : EyeIcon}  style={styles.eyeIcon} />
                     
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Confirm Password *</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Image source={showPassword ? Eye : EyeIcon} style={styles.eyeIcon} />
                  </TouchableOpacity>
                </View>

              </ScrollView>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.signInText}>Sign In</Text>
            </Text>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Image source={WaveImage} style={styles.bottomWave} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 50,
  },

  logo: {
    width: 230,
    height: 40,
    alignSelf: "center",
    marginBottom: 10,
  },

  heading: {
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    color: "#16151C",
  },

  subheading: {
    fontSize: 14,
    color: "#A1A1A1",
    textAlign: "center",
    marginBottom: 25,
  },

  formScrollBox: {
    height: 420, 
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    color: "#202020",
  },

  inputBox: {
    backgroundColor: "#F3F3F3",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
  },

  eyeIcon: {
    width: 22,
    height: 22,
  },

  button: {
    backgroundColor: "#1D5DFF",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  footerText: {
    textAlign: "center",
    fontSize: 15,
    color: "#202020",
    marginTop: 10,
  },

  signInText: {
    color: "#1E45E1",
    fontWeight: "600",
  },

  bottomWave: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 180,
  },
});
