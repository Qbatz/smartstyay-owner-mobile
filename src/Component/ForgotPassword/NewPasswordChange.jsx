import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import EyeIcon from "../../Assets/Images/EyeIcon.png";
import Eye from "../../Assets/Images/Eye.png";
import Rectangle from "../../Assets/Images/OtpRectangle.png";
import { useNavigation } from "@react-navigation/native";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import { LoginContexts } from "../../Context/LoginContext";

export default function SetNewPassword({route}) {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [showPasswordError, setPasswordError] = useState("");
  const {}=useContext(LoginContexts)
  const {email}=route?.params
  const {userId}=route?.params


  const [deviceWidth, setDeviceWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setDeviceWidth(window.width);
    });
    return () => sub?.remove();
  }, []);

  const handleUpdatePassword = async () => {
    if (password != confirmPwd) {
      setPasswordError("Password Mismatch");
      return;
    }

    try{
      const res=await updatePassword()
      console.log(res)
    }catch(error){
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Set a New Password</Text>
          <Text style={styles.subtitle}>
            Create a new password. Ensure it differs from previous ones for
            security
          </Text>


          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPwd}
              value={password}
              onChangeText={(text) => {
                const filter = text.replace(/[^\x00-\x7F]/g, "");
                setPassword(filter)
              }}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
              <Image
                source={
                  showPwd
                    ? Eye
                    : EyeIcon
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>


          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Re-enter password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPwd}
              value={confirmPwd}
              onChangeText={(text) => {
                const filter = text.replace(/[^\x00-\x7F]/g, "");
                setConfirmPwd(filter)
                setPasswordError("")
              }}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPwd(!showConfirmPwd)}
            >

              <Image
                source={
                  showConfirmPwd
                    ? Eye
                    : EyeIcon
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          {showPasswordError && (<ErrorMessage message={showPasswordError} type="error" />)}


          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdatePassword}>

    // navigation.navigate("SucessUpdatePassword");

            <Text style={styles.updateText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>


      <Image
        source={Rectangle}
        style={[styles.bottomImage, { width: deviceWidth }]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 26,
    paddingTop: 80,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
    marginTop: 50,
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 25,
    width: "95%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C7D3E3",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    paddingVertical: 12,
  },

  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: "#6B7280",
  },

  updateBtn: {
    backgroundColor: "#1E5EFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },

  updateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  bottomImage: {
    height: 200,
    position: "absolute",
    bottom: 0,
    left: 0,
    resizeMode: "cover",
  },
});
