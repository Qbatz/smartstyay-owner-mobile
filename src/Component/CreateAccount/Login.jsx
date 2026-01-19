import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  NativeModules,
} from "react-native";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../ToastFile/ToastPage";
import SmartstayIcon from "../../Assets/Images/Sm_Icon.png";
import EyeIcon from "../../Assets/Images/EyeIcon.png";
import WaveImage from "../../Assets/Images/login_Rectangle.png";

import { useNavigation } from "@react-navigation/native";
import { LoginContexts } from "../../Context/LoginContext";
import { storeData } from "../../Utils/Storage";
import { LOGGEDIN, USER_ID } from "../../Utils/Constant";

export default function LoginDesign() {

  const { login } = useContext(LoginContexts);
  const loginContext = useContext(LoginContexts)
  const navigation = useNavigation();
  const {NotificationModule}=NativeModules;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
 



  const validate = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Please Enter Email");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please Enter Valid Email");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Please Enter Password");
      valid = false;
    }

    return valid;
  };


  const loginClick = async () => {
    if (!validate()) return;

    const data = {
      emailId: email,
      password: password,
    };

    const response = await login(data);
    console.log("response", response);


    if (response?.success) {
      const { pinSetup } = response.data;
      console.log(pinSetup)


      if (pinSetup === false) {
        // loginContext.updatePinSetupStatus(true)
        loginContext?.updateUserId(response.data.userId)
        navigation.navigate("CreateMpin");

      } else {
        //old user 
        loginContext?.updateUserId(response.data.userId)
        storeData(LOGGEDIN, 'true')
        storeData(USER_ID, response.data.userId)
        loginContext.updateUserId(response?.data.userId)
        loginContext.updatePinSetupStatus(false)
        loginContext.loggedin('true')
        // navigation.navigate("EnterMPin");
      }
    }
    else if (response?.status === 400) {
      setModalType("error");
      setModalMessage(
        response?.data?.message || response?.message || "Bad Request"
      );
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
    }
    else if (response?.status === 403) {
      setModalType("error");
      setModalMessage("Invalid Email or Password");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
    }
  };

  



  return (

    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />

      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Image source={SmartstayIcon} style={styles.logo} />

            <Text style={styles.welcome}>Welcome Back Admin 👋</Text>
            <Text style={styles.subtitle}>Login here</Text>

            <Text style={styles.label}>Username / Email</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Please Enter Email"
                placeholderTextColor="#A1A1A1"
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setEmail(text.toLowerCase());
                  setEmailError("");
                }}
                autoCapitalize="none"
              />


            </View>


            {emailError && (
              <ErrorMessage message={emailError} type="error" />
            )}


            <Text style={styles.label}>Password</Text>
            <View style={styles.inputBox}>

              <TextInput
                placeholder="Please Enter Password"
                secureTextEntry={!showPassword}
                style={styles.input}
                placeholderTextColor="#A1A1A1"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
              />


              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Image source={EyeIcon} style={{ width: 22, height: 22 }} />
              </TouchableOpacity>
            </View>

            {passwordError && (
              <ErrorMessage message={passwordError} type="error" />
            )}




            <TouchableOpacity
              onPress={() => navigation.replace("ForgotPassword")}
            >
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={loginClick}>
              <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>

            <Text style={styles.registerText}>
              Not Registered yet?{" "}
              <Text
                style={styles.registerLink}
                onPress={() => navigation.replace("CreateAccount")}
              >
                Create Account
              </Text>
            </Text>
          </View>
        </ScrollView>

        <Image source={WaveImage} style={styles.bottomWave} resizeMode="cover" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    paddingBottom: 160,
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 40,
  },

  logo: {
    width: 220,
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
  },

  welcome: {
    fontSize: 26,
    fontWeight: "600",
    color: "#16151C",
    textAlign: "center",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#A2A1A8",
    marginBottom: 30,
    marginTop: 12,
  },

  label: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: "500",
    color: "#202020",
  },

  inputBox: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 48,
  },

  input: {
    flex: 1,
    color: "#000",
    fontSize: 15,
  },

  eyeIcon: {
    padding: 5,
  },

  forgot: {
    marginTop: 8,
    color: "#0565FF",
    textAlign: "right",
    fontSize: 13,
    fontWeight: "500",
  },

  loginButton: {
    backgroundColor: "#1D5DFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  registerText: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 16,
    color: "#202020",
  },

  registerLink: {
    color: "#1E45E1",
    fontWeight: "600",
  },

  bottomWave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 120,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },




});
