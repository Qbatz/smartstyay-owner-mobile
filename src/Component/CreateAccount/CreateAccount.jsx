import React, { useRef, useState } from "react";
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
  Keyboard,
} from "react-native";

import SmartstayIcon from "../../Assets/Images/Sm_Icon.png";
import EyeIcon from "../../Assets/Images/EyeIcon.png";
import Eye from "../../Assets/Images/Eye.png";
import WaveImage from "../../Assets/Images/CreateAccount_Rectangle.png";
import { useNavigation } from "@react-navigation/native";
import { postNewAccount } from "../../Action/LoginAction";
import SuccessModal from "../../ToastFile/ToastPage";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";

export default function CreateAccount() {
  const navigation = useNavigation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailid, setEmailId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [modelType, setModelType] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [bothPasswordError, setBothPasswordError] = useState("");

  const [backendEmailError, setBackendEmailError] = useState("");
  const [backendMobileError, setBackendMobileError] = useState("");
  const [backendPasswordError, setBackendPasswordError] = useState("");

  // ✅ REFS
  const scrollRef = useRef(null);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const mobileRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // ✅ positions for scroll
  const firstNamePos = useRef(0);
  const lastNamePos = useRef(0);
  const emailPos = useRef(0);
  const mobilePos = useRef(0);
  const passwordPos = useRef(0);
  const confirmPasswordPos = useRef(0);

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  const phoneRegex = /^(?!0{10})[1-9][0-9]{9}$/;

  const validatePassword = (pwd) => {
    let errors = [];
    if (/\s/.test(pwd)) errors.push("Password cannot contain spaces");
    if (pwd.length < 8) errors.push("8 characters minimum");
    if (!/[a-z]/.test(pwd) || !/[A-Z]/.test(pwd))
      errors.push("One uppercase and lowercase");
    if (!/\d/.test(pwd) || !/[@$!%*?&]/.test(pwd))
      errors.push("Numeric and Special symbols");
    return errors;
  };

  // ✅ Scroll helper
  const scrollToY = (y) => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: y - 80, animated: true });
    }, 150);
  };

  // ✅ Focus helper (scroll + focus)
  const focusField = (ref, pos) => {
    scrollToY(pos.current);
    setTimeout(() => ref.current?.focus(), 200);
  };
  const createAccountClick = async () => {
  Keyboard.dismiss();

  // reset errors
  setFirstNameError("");
  setEmailError("");
  setMobileError("");
  setPasswordError([]);
  setConfirmPasswordError("");
  setBothPasswordError("");

  setBackendEmailError("");
  setBackendMobileError("");
  setBackendPasswordError("");

  let hasError = false;
  let firstErrorRef = null;
  let firstErrorPos = null;

  // ✅ First Name
  if (!firstName?.trim()) {
    setFirstNameError("Please Enter First Name");
    if (!firstErrorRef) {
      firstErrorRef = firstNameRef;
      firstErrorPos = firstNamePos;
    }
    hasError = true;
  }

  // ✅ Email
  if (!emailid?.trim()) {
    setEmailError("Please Enter Email ID");
    if (!firstErrorRef) {
      firstErrorRef = emailRef;
      firstErrorPos = emailPos;
    }
    hasError = true;
  } else if (!emailRegex.test(emailid)) {
    setEmailError("Please Enter Valid Email ID");
    if (!firstErrorRef) {
      firstErrorRef = emailRef;
      firstErrorPos = emailPos;
    }
    hasError = true;
  }

  // ✅ Mobile
  if (!mobileNo?.trim()) {
    setMobileError("Please Enter Mobile No");
    if (!firstErrorRef) {
      firstErrorRef = mobileRef;
      firstErrorPos = mobilePos;
    }
    hasError = true;
  } else if (!phoneRegex.test(mobileNo)) {
    setMobileError("Please Enter Valid Mobile Number");
    if (!firstErrorRef) {
      firstErrorRef = mobileRef;
      firstErrorPos = mobilePos;
    }
    hasError = true;
  }

  // ✅ Password
  if (!password?.trim()) {
    setPasswordError(["Please Enter Password"]);
    if (!firstErrorRef) {
      firstErrorRef = passwordRef;
      firstErrorPos = passwordPos;
    }
    hasError = true;
  } else {
    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) {
      setPasswordError(pwdErrors);
      if (!firstErrorRef) {
        firstErrorRef = passwordRef;
        firstErrorPos = passwordPos;
      }
      hasError = true;
    }
  }

  // ✅ Confirm Password
  if (!confirmPassword?.trim()) {
    setConfirmPasswordError("Please Enter Confirm Password");
    if (!firstErrorRef) {
      firstErrorRef = confirmPasswordRef;
      firstErrorPos = confirmPasswordPos;
    }
    hasError = true;
  } else if (password?.trim() && password !== confirmPassword) {
    setBothPasswordError("Password and Confirm Password do Not Match");
    if (!firstErrorRef) {
      firstErrorRef = confirmPasswordRef;
      firstErrorPos = confirmPasswordPos;
    }
    hasError = true;
  }

  // ✅ if any error -> focus first error field
  if (hasError) {
    focusField(firstErrorRef, firstErrorPos);
    return;
  }

  // ✅ API Call
  const data = {
    firstName,
    lastName,
    mailId: emailid,
    mobile: mobileNo,
    password,
    confirmPassword,
  };

  const res = await postNewAccount(data);

  if (res?.status === 201) {
    setShowSuccessModal(true);
    setToastMessage("Created Successfully");
    setModelType("success");

    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.replace("LoginDesign");
    }, 1500);
  } else {
    // backend errors
    if (res?.message?.emailStatus) {
      setBackendEmailError(res.message.emailStatus);
      focusField(emailRef, emailPos);
      return;
    }

    if (res?.message?.mobileStatus) {
      setBackendMobileError(res.message.mobileStatus);
      focusField(mobileRef, mobilePos);
      return;
    }

    if (res?.message?.passwordStatus) {
      setBackendPasswordError(res.message.passwordStatus);
      focusField(passwordRef, passwordPos);
      return;
    }

    setShowSuccessModal(true);
    setToastMessage(res?.message || "Something went wrong");
    setModelType("error");

    setTimeout(() => setShowSuccessModal(false), 2000);
  }
};


  // const createAccountClick = async () => {
  //   Keyboard.dismiss();

  //   // reset errors
  //   setFirstNameError("");
  //   setEmailError("");
  //   setMobileError("");
  //   setPasswordError([]);
  //   setConfirmPasswordError("");
  //   setBothPasswordError("");

  //   setBackendEmailError("");
  //   setBackendMobileError("");
  //   setBackendPasswordError("");

  //   // ✅ validations (and focus first error field)
  //   if (!firstName.trim()) {
  //     setFirstNameError("Please Enter First Name");
  //     focusField(firstNameRef, firstNamePos);
  //     return;
  //   }

  //   if (!emailid.trim()) {
  //     setEmailError("Please Enter Email ID");
  //     focusField(emailRef, emailPos);
  //     return;
  //   }

  //   if (!emailRegex.test(emailid)) {
  //     setEmailError("Please Enter Valid Email ID");
  //     focusField(emailRef, emailPos);
  //     return;
  //   }

  //   if (!mobileNo.trim()) {
  //     setMobileError("Please Enter Mobile No");
  //     focusField(mobileRef, mobilePos);
  //     return;
  //   }

  //   if (!phoneRegex.test(mobileNo)) {
  //     setMobileError("Please Enter Valid Mobile Number");
  //     focusField(mobileRef, mobilePos);
  //     return;
  //   }

  //   if (!password.trim()) {
  //     setPasswordError(["Please Enter Password"]);
  //     focusField(passwordRef, passwordPos);
  //     return;
  //   }

  //   const pwdErrors = validatePassword(password);
  //   if (pwdErrors.length > 0) {
  //     setPasswordError(pwdErrors);
  //     focusField(passwordRef, passwordPos);
  //     return;
  //   }

  //   if (!confirmPassword.trim()) {
  //     setConfirmPasswordError("Please Enter Confirm Password");
  //     focusField(confirmPasswordRef, confirmPasswordPos);
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     setBothPasswordError("Password and Confirm Password do Not Match");
  //     focusField(confirmPasswordRef, confirmPasswordPos);
  //     return;
  //   }

  //   const data = {
  //     firstName,
  //     lastName,
  //     mailId: emailid,
  //     mobile: mobileNo,
  //     password,
  //     confirmPassword,
  //   };

  //   const res = await postNewAccount(data);

  //   if (res?.status === 201) {
  //     setShowSuccessModal(true);
  //     setToastMessage("Created Successfully");
  //     setModelType("success");

  //     setTimeout(() => {
  //       setShowSuccessModal(false);
  //       navigation.replace("LoginDesign");
  //     }, 1500);
  //   } else {
  //     if (res?.message?.emailStatus) {
  //       setBackendEmailError(res?.message?.emailStatus);
  //       focusField(emailRef, emailPos);
  //       return;
  //     }

  //     if (res?.message?.mobileStatus) {
  //       setBackendMobileError(res?.message?.mobileStatus);
  //       focusField(mobileRef, mobilePos);
  //       return;
  //     }

  //     if (res?.message?.passwordStatus) {
  //       setBackendPasswordError(res?.message?.passwordStatus);
  //       focusField(passwordRef, passwordPos);
  //       return;
  //     }

  //     setShowSuccessModal(true);
  //     setToastMessage(res?.message || "Something went wrong");
  //     setModelType("error");

  //     setTimeout(() => setShowSuccessModal(false), 2000);
  //   }
  // };

  return (
    <View style={styles.container}>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={toastMessage}
        type={modelType}
      />

      {/* ✅ HEADER FIXED (No Scroll) */}
      <View style={styles.headerFixed}>
        <Image source={SmartstayIcon} style={styles.logo} />
        <Text style={styles.heading}>Create your free account</Text>
        <Text style={styles.subheading}>
          Enter your details below to find your stay smartly
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        {/* ✅ FORM SCROLL ONLY */}
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.content}>
            {/* ✅ First Name */}
            <View onLayout={(e) => (firstNamePos.current = e.nativeEvent.layout.y)}>
              <Text style={styles.label}>
                First Name <Text style={styles.star}>*</Text>
              </Text>
              <View style={styles.inputBox}>
                <TextInput
                  ref={firstNameRef}
                  placeholder="Enter First Name"
                  style={styles.input}
                  value={firstName}
                  returnKeyType="next"
                  onFocus={() => scrollToY(firstNamePos.current)}
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                  onChangeText={(text) => {
                    if (!/^[A-Za-z\s]*$/.test(text)) return;
                    setFirstName(text);
                    setFirstNameError("");
                  }}
                />
              </View>
              {!!firstNameError && <ErrorMessage message={firstNameError} type="error" />}
            </View>

            {/* ✅ Last Name */}
            <View onLayout={(e) => (lastNamePos.current = e.nativeEvent.layout.y)}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputBox}>
                <TextInput
                  ref={lastNameRef}
                  placeholder="Enter Last Name"
                  style={styles.input}
                  value={lastName}
                  returnKeyType="next"
                  onFocus={() => scrollToY(lastNamePos.current)}
                  onSubmitEditing={() => emailRef.current?.focus()}
                  onChangeText={(text) => {
                    if (!/^[A-Za-z\s]*$/.test(text)) return;
                    setLastName(text);
                  }}
                />
              </View>
            </View>

            {/* ✅ Email */}
            <View onLayout={(e) => (emailPos.current = e.nativeEvent.layout.y)}>
              <Text style={styles.label}>
                Email <Text style={styles.star}>*</Text>
              </Text>
              <View style={styles.inputBox}>
                <TextInput
                  ref={emailRef}
                  placeholder="Enter Email ID"
                  style={styles.input}
                  value={emailid}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onFocus={() => scrollToY(emailPos.current)}
                  onSubmitEditing={() => mobileRef.current?.focus()}
                  onChangeText={(text) => {
                    setEmailId(text.toLowerCase());
                    setEmailError("");
                    setBackendEmailError("");
                  }}
                />
              </View>
              {!!emailError && <ErrorMessage message={emailError} type="error" />}
              {!!backendEmailError && <ErrorMessage message={backendEmailError} type="error" />}
            </View>

            {/* ✅ Mobile */}
            <View onLayout={(e) => (mobilePos.current = e.nativeEvent.layout.y)}>
              <Text style={styles.label}>
                Mobile No <Text style={styles.star}>*</Text>
              </Text>
              <View style={styles.inputBox}>
                <TextInput
                  ref={mobileRef}
                  placeholder="9876543210"
                  style={styles.input}
                  value={mobileNo}
                  keyboardType="numeric"
                  maxLength={10}
                  returnKeyType="next"
                  onFocus={() => scrollToY(mobilePos.current)}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  onChangeText={(text) => {
                    setMobileNo(text.replace(/\D/g, ""));
                    setMobileError("");
                    setBackendMobileError("");
                  }}
                />
              </View>
              {!!mobileError && <ErrorMessage message={mobileError} type="error" />}
              {!!backendMobileError && <ErrorMessage message={backendMobileError} type="error" />}
            </View>

            {/* ✅ Password */}
            <View onLayout={(e) => (passwordPos.current = e.nativeEvent.layout.y)}>
              <Text style={styles.label}>
                Password <Text style={styles.star}>*</Text>
              </Text>
              <View style={styles.inputBox}>
                <TextInput
                  ref={passwordRef}
                  placeholder="Enter Password"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={password}
                  returnKeyType="next"
                  onFocus={() => scrollToY(passwordPos.current)}
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError([]);
                    setBackendPasswordError("");
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Image source={showPassword ? Eye : EyeIcon} style={styles.eyeIcon} />
                </TouchableOpacity>
              </View>
              {passwordError.length > 0 && <ErrorMessage message={passwordError} type="error" />}
              {!!backendPasswordError && <ErrorMessage message={backendPasswordError} type="error" />}
            </View>

            {/* ✅ Confirm Password */}
            <View
              onLayout={(e) => (confirmPasswordPos.current = e.nativeEvent.layout.y)}
            >
              <Text style={styles.label}>
                Confirm Password <Text style={styles.star}>*</Text>
              </Text>
              <View style={styles.inputBox}>
                <TextInput
                  ref={confirmPasswordRef}
                  placeholder="Confirm Password"
                  style={styles.input}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  returnKeyType="done"
                  onFocus={() => scrollToY(confirmPasswordPos.current)}
                  onSubmitEditing={createAccountClick}
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

              {!!confirmPasswordError && (
                <ErrorMessage message={confirmPasswordError} type="error" />
              )}

              {!!bothPasswordError && (
                <ErrorMessage message={bothPasswordError} type="error" />
              )}
            </View>
          </View>
        </ScrollView>

        {/* ✅ BOTTOM FIXED */}
        <View style={styles.bottomFixed}>
          <TouchableOpacity onPress={createAccountClick} style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.signInText}
              onPress={() => navigation.replace("LoginDesign")}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>

      {/* ✅ WAVE BACKGROUND */}
      <Image source={WaveImage} style={styles.bottomWave} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
   
  },

  headerFixed: {
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 10,
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
    marginTop: 2,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
  },

  star: { color: "red", fontSize: 18 },

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

  bottomFixed: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 80, // ✅ figma like gap
    paddingHorizontal: 25,
    backgroundColor: "transparent",
  },

  button: {
    backgroundColor: "#1D5DFF",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
    height: 90,
    zIndex: -1,
  },
});
