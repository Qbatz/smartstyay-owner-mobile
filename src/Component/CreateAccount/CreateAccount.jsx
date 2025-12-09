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

import SmartstayIcon from "../../Assets/Images/Sm_Icon.png";
import EyeIcon from "../../Assets/Images/EyeIcon.png";
import Eye from "../../Assets/Images/Eye.png";
import WaveImage from "../../Assets/Images/CreateAccount_Rectangle.png";
import { useNavigation } from "@react-navigation/native";
import { postNewAccount } from "../../Action/LoginAction";
import SuccessModal from '../../ToastFile/ToastPage'

export default function CreateAccount() {
   const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName,setFirstName]=useState()
  const [lastName,setLastName]=useState()
  const [emailid,setEmailId]=useState()
  const [mobileNo,setMobileNo]=useState()
  const [password,setPassword]=useState()
  const[confirmPassword,setConfirmPassword]=useState()
  const [showSuccessModal,setShowSuccessModal]=useState(false)
  const[toastMessage,setToastMessage]=useState()
  const[modelType,setModelType]=useState()



  const createAccountClick=()=>{

    if(password !=confirmPassword){
      alert("incorrect Confirm Password")
      return;
    }

    const data= {
          firstName: firstName,
          lastName : lastName,
          mailId : emailid,
          password : password,
          confirmPassword: confirmPassword,
          mobile: mobileNo,
  }

      postNewAccount(data).then(r=>{
        console.log(r)

        if(r.status==201){
            setShowSuccessModal(true)
            setToastMessage('Created Successfully')
            setModelType('success')
        }
      })  
  }

  



  return (
    <View style={styles.container}>
      <SuccessModal
              visible={showSuccessModal}
              onClose={() => setShowSuccessModal(false)}
              message={toastMessage}
              type={modelType}
            />
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
                  <TextInput placeholder="Enter First Name" style={styles.input}
                  value={firstName} onChangeText={setFirstName} />
                </View>

                <Text style={styles.label}>Last Name *</Text>
                <View style={styles.inputBox}>
                  <TextInput placeholder="Enter Last Name" style={styles.input} 
                  value={lastName} onChangeText={setLastName}/>
                </View>

                <Text style={styles.label}>Email *</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="Ex : arunkumar77@mail.com"
                    style={styles.input} value={emailid} onChangeText={setEmailId}

                  />
                </View>

                <Text style={styles.label}>Mobile No *</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="+91   98765 43210"
                    style={styles.input}
                    keyboardType="numeric"
                    value={mobileNo} onChangeText={setMobileNo}
                  />
                </View>

                <Text style={styles.label}>Password *</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="Enter Password"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    value={password} onChangeText={setPassword}
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
                    value={confirmPassword} onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Image source={showPassword ? Eye : EyeIcon} style={styles.eyeIcon} />
                  </TouchableOpacity>
                </View>

              </ScrollView>
            </View>

            <TouchableOpacity onPress={createAccountClick} style={styles.button}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.signInText}  onPress={() => navigation.replace("LoginDesign")}>Sign In</Text>
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
