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
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";

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
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const [firstNameError, setFirstNameError] = useState("");
const [emailError, setEmailError] = useState("");
const [mobileError, setMobileError] = useState("");
const [passwordError, setPasswordError] = useState([]);
const [confirmPasswordError, setConfirmPasswordError] = useState("");
const [bothPasswordError, setBothPasswordError] = useState("");

const [backendEmailError, setBackendEmailError] = useState("");
const [backendMobileError, setBackendMobileError] = useState("");
const [backendPasswordError, setBackendPasswordError] = useState("");

const nameRegex = /^[A-Za-z\s]*$/;
const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const phoneRegex = /^(?!0{10})[1-9][0-9]{9}$/;


const validatePassword = (password) => {
  let errors = [];

  if (/\s/.test(password)) {
    errors.push("Password cannot contain spaces");
  }
  if (password.length < 8) {
    errors.push("8 characters minimum");
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    errors.push("One uppercase and lowercase");
  }
  if (!/\d/.test(password) || !/[@$!%*?&]/.test(password)) {
    errors.push("Numeric and Special symbols");
  }

  return errors;
};


const createAccountClick = async () => {
  setFirstNameError("");
  setEmailError("");
  setMobileError("");
  setPasswordError([]);
  setConfirmPasswordError("");
  setBothPasswordError("");

  let hasError = false;

  if (!firstName || firstName.trim() === "") {
    setFirstNameError("Please Enter First Name");
    hasError = true;
  }

  if (!emailid) {
    setEmailError("Please Enter Email ID");
    hasError = true;
  } else if (!emailRegex.test(emailid)) {
    setEmailError("Please Enter Valid Email ID");
    hasError = true;
  }

  if (!mobileNo) {
    setMobileError("Please Enter Mobile No");
    hasError = true;
  } else if (!phoneRegex.test(mobileNo)) {
    setMobileError("Please Enter Valid Mobile Number");
    hasError = true;
  }

  if (!password) {
    setPasswordError(["Please Enter Password"]);
    hasError = true;
  } else {
    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) {
      setPasswordError(pwdErrors);
      hasError = true;
    }
  }

  if (!confirmPassword) {
    setConfirmPasswordError("Please Enter Confirm Password");
    hasError = true;
  }

  if (password && confirmPassword && password !== confirmPassword) {
    setBothPasswordError("Password and Confirm Password do Not Match");
    hasError = true;
  }

  if (hasError) return;

  const data = {
    firstName,
    lastName,
    mailId: emailid,
    mobile: mobileNo,
    password,
    confirmPassword,
  };

 const res = await postNewAccount(data);
 console.log("res", res);
 

if (res?.status === 201) {
  setShowSuccessModal(true);
  setToastMessage("Created Successfully");
  setModelType("success");

  setTimeout(() => {
    setShowSuccessModal(false);
    navigation.replace("LoginDesign");
  }, 1500);
} else {
  if (res?.message?.emailStatus) {
    setBackendEmailError(res?.message?.emailStatus);
  }

  if (res?.message?.mobileStatus) {
    setBackendMobileError(res?.message?.mobileStatus);
  }

  if (res?.message?.passwordStatus) {
    setBackendPasswordError(res?.message?.passwordStatus);
  }

  if (
    !res?.message?.emailStatus &&
    !res?.message?.mobileStatus &&
    !res?.message?.passwordStatus
  ) {
    setShowSuccessModal(true);
    setToastMessage(res?.message || "Something went wrong");
    setModelType("error");
    setTimeout(() => setShowSuccessModal(false), 2000);
  }
}

};


//   const createAccountClick=()=>{

//     if(password !=confirmPassword){
//       alert("incorrect Confirm Password")
//       return;
//     }

//     const data= {
//           firstName: firstName,
//           lastName : lastName,
//           mailId : emailid,
//           password : password,
//           confirmPassword: confirmPassword,
//           mobile: mobileNo,
//   }

//       if(
//   firstName && firstName.trim() !== "" &&
//   lastName && lastName.trim() !== "" &&
//   emailid && emailid.trim() !== "" &&
//   mobileNo && mobileNo.trim() !== "" &&
//   password && password.trim() !== ""
// ){
//   if(!passwordRegex.test(password)){
//     setShowSuccessModal(true);
//     setToastMessage('Password must contain uppercase, number & special character');
//     setModelType('error');
//     setTimeout(() => {
//       setShowSuccessModal(false);
//     }, 2000);
//     return;
//   }

//   postNewAccount(data).then(r=>{
//     console.log(r)
//     if(r.status === 201){
//       setShowSuccessModal(true);
//       setToastMessage('Created Successfully');
//       setModelType('success');
//       setTimeout(() => {
//         setShowSuccessModal(false);
//       }, 2000);
//     }
//   });

// }
// else{
//   setShowSuccessModal(true);
//   setToastMessage('All Fields Required');
//   setModelType('error');
//   setTimeout(() => {
//     setShowSuccessModal(false);
//   }, 2000);
// }

     
//   }

  



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
       
          <View style={styles.content}>

            <Image source={SmartstayIcon} style={styles.logo} />

            <Text style={styles.heading}>Create your free account</Text>
            <Text style={styles.subheading}>
              Enter your details below to find your stay smartly
            </Text>

            <View style={styles.formScrollBox}>
              <ScrollView
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                persistentScrollbar={Platform.OS === "android"}
              >

                <Text style={styles.label}>First Name <Text style={{ color: "red" , fontSize:18}}>*</Text></Text>
                <View style={styles.inputBox}>
                <TextInput
  placeholder="Enter First Name"
  style={styles.input}
  value={firstName}
  onChangeText={(text) => {
    if (!/^[A-Za-z\s]*$/.test(text)) return

    setFirstName(text);
    setFirstNameError(""); 
  }}
/>

                  
                </View>
              {firstNameError ? (
  <ErrorMessage message={firstNameError} type="error" />
) : null}

                <Text style={styles.label}>Last Name </Text>
                <View style={styles.inputBox}>
                  <TextInput
  placeholder="Enter Last Name"
  style={styles.input}
  value={lastName}
  onChangeText={(text) => {
    if (!/^[A-Za-z\s]*$/.test(text)) return; 
    setLastName(text);
  }}
/>

                </View>

                <Text style={styles.label}>Email <Text style={{ color: "red" , fontSize:18}}>*</Text></Text>
                <View style={styles.inputBox}>
    <TextInput
  style={styles.input}
  placeholder="Enter Email ID"
  value={emailid}
  onChangeText={(text) => {
    setEmailId(text.toLowerCase());
    setEmailError("");
    setBackendEmailError("");
  }}
/>


                </View>
            {emailError && <ErrorMessage message={emailError} type="error" />}
{backendEmailError && (
  <ErrorMessage message={backendEmailError} type="error" />
)}


                <Text style={styles.label}>Mobile No <Text style={{ color: "red" , fontSize:18}}>*</Text></Text>
                <View style={styles.inputBox}>
                  <TextInput
                  style={styles.input}
                  placeholder="9876543210"
  value={mobileNo}
  keyboardType="numeric"
  maxLength={10}
  onChangeText={(text) => {
    setMobileNo(text.replace(/\D/g, ""));
    setMobileError("");
    setBackendMobileError("");
  }}
/>

                </View>
             {mobileError && <ErrorMessage message={mobileError} type="error" />}
{backendMobileError && (
  <ErrorMessage message={backendMobileError} type="error" />
)}


                <Text style={styles.label}>Password <Text style={{ color: "red", fontSize:18 }}>*</Text></Text>
                <View style={styles.inputBox}>
    <TextInput
  style={styles.input}
  placeholder="Enter Password"
  secureTextEntry={!showPassword}
  value={password}
  onChangeText={(text) => {
    setPassword(text);
    setPasswordError([]);
    setBackendPasswordError("");
  }}
/>


                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
  <Image
    source={showPassword ? Eye : EyeIcon}
    style={styles.eyeIcon}
  />
</TouchableOpacity>

                </View>
  {passwordError.length > 0 && (
  <ErrorMessage message={passwordError} type="error" />
)}

{backendPasswordError && (
  <ErrorMessage message={backendPasswordError} type="error" />
)}


                <Text style={styles.label}>Confirm Password <Text style={{ color: "red", fontSize:18 }}>*</Text></Text>
                <View style={styles.inputBox}>
                  <TextInput
  style={styles.input}
  placeholder="Confirm Password"
  secureTextEntry={!showConfirmPassword}
  value={confirmPassword}
  onChangeText={(text) => {
    setConfirmPassword(text);
    setConfirmPasswordError("");
    setBothPasswordError("");
  }}
/>

                 <TouchableOpacity
  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
>
  <Image
    source={showConfirmPassword ? Eye : EyeIcon}
    style={styles.eyeIcon}
  />
</TouchableOpacity>

                </View>
              {confirmPasswordError && (
  <ErrorMessage message={confirmPasswordError} type="error" />
)}

{bothPasswordError && (
  <ErrorMessage message={bothPasswordError} type="error" />
)}


              </ScrollView>
            </View>

  


            <TouchableOpacity onPress={createAccountClick} style={styles.button}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.signInText}  onPress={() => navigation.replace("LoginDesign")}>Sign In</Text>
            </Text>

          </View>
      
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
    paddingTop: 30,
  },

  logo: {
    width: 230,
    height: 40,
    alignSelf: "center",
    marginBottom: 5,
  },

  heading: {
    fontSize: 23,
    fontWeight: "500",
    textAlign: "center",
    color: "#16151C",
  },

  subheading: {
    fontSize: 13,
    color: "#A1A1A1",
    textAlign: "center",
    // marginBottom: 25,
  },

  formScrollBox: {
    height: 540, 
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    // color: "#202020",
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
    height: 60,
  },
});
