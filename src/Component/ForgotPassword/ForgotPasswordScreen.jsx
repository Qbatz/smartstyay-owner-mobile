import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import { LoginContexts } from "../../Context/LoginContext";
import SuccessModal from "../../ToastFile/ToastPage";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [emailError,setEmailError]=useState("")
  const [deviceWidth, setDeviceWidth] = useState(Dimensions.get("window").width);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");
    // const [emailError,setEmailError]=useState("")

  const {getForgotPasswordotp}=useContext(LoginContexts)

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDeviceWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  const validate = () => {
    let valid = true;

    setEmailError("");

    if (!email.trim()) {
      setEmailError("Please Enter Email");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please Enter Valid Email");
      valid = false;
    }


    return valid;
  };


  const handleContinue=async()=>{
    if(!email){
      setEmailError("Please Enter Valid Email")
      return;
    }
    if(!validate()) return;
    if(email){
        console.log(email)
      try{
        const res = await getForgotPasswordotp(email)

        console.log(res)
        if(res?.status === 200){
           navigation.navigate("OtpVerification", { email,userId:res?.data?.userId })
        }
        else{
            setShowSuccessModal(true)
            setModalMessage( res?.data?.message || res?.message || "Something went wrong")
            setModalType("error")

            setTimeout(()=>{
              setShowSuccessModal(false)
            },[1500])
        }

      }catch(error){
        console.log(error)
      }
     
    }
     


  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />
      <SuccessModal 
      visible={showSuccessModal}
      onClose={()=>setShowSuccessModal(false)}
      message={modalMessage}
      type={modalType}/>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.innerContainer}>

          {/* Title */}
          <Text style={styles.title}>Forgot Password ?</Text>
          <Text style={styles.subtitle}>
            Enter your email address to recover your account.
          </Text>

          {/* Email Label */}
          <Text style={styles.label}>Email ID <Text style={{ color: "red" }}>*</Text></Text>

          {/* Input */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#A1A1A1"
              value={email}
              onChangeText={(text)=>{
                const sanitized = text.toLowerCase().replace(/[^a-z0-9@._-]/g, "");
                  setEmail(sanitized);
                setEmailError("");
              }
                
              }
              keyboardType="email-address"
            />
          </View>
          {emailError && <ErrorMessage message={emailError} type="error"/>}


          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>


          <Text style={styles.backText}>
            Return to your Account?{" "}
            <Text
              style={styles.signIn}
              onPress={() => navigation.replace("LoginDesign")}
            >
              Sign In
            </Text>
          </Text>


        </View>


        <ImageBackground
          source={require("../../Assets/Images/login_Rectangle.png")} // use your curve image

          style={[styles.bottomImg, { width: deviceWidth }]}
          resizeMode="cover"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },

  innerContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 170,
  },


  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 30,
  },

  label: {
    color: "#111",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },

  inputBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 3,
    height: 48,
    justifyContent: "center",
  },

  input: {
    fontSize: 15,
    color: "#111",
  },

  button: {
    backgroundColor: "#2D6CDF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  backText: {
    textAlign: "center",
    marginTop: 18,
    color: "#6B7280",
  },

  signIn: {
    color: "#2D6CDF",
    fontWeight: "600",
  },


  bottomImg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 130,
    resizeMode: "cover",
  },

});
