import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import SmartstayIcon from "../../Assets/Images/Sm_Icon.png"
import EyeIcon from "../../Assets/Images/EyeIcon.png";
import WaveImage from "../../Assets/Images/login_Rectangle.png";
import { useNavigation } from "@react-navigation/native";


export default function LoginDesign() {
  
   const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.content}>
          
          <Image
            source={SmartstayIcon}
            style={styles.logo}
          />

          <Text style={styles.welcome}>Welcome Back Admin 👋</Text>
          <Text style={styles.subtitle}>Login here</Text>

          <Text style={styles.label}>Username / Email</Text>
          <View style={styles.inputBox}>
           <TextInput
  placeholder="admin@gmail.com"
  placeholderTextColor="#A1A1A1"
  style={styles.input}
  value={email}
  onChangeText={setEmail}
/>

          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
           <TextInput
  placeholder="Enter Password"
  placeholderTextColor="#A1A1A1"
  secureTextEntry={!showPassword}
  style={styles.input}
  value={password}
  onChangeText={setPassword}
/>


            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Image
                source={
                  showPassword
                    ? EyeIcon
                    : EyeIcon
                }
                style={{ width: 22, height: 22 }}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.replace("ForgotPassword")}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton}  onPress={() => navigation.replace("VerifyAccountScreen")}>
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

      <Image
        source={WaveImage}
        style={styles.bottomWave}
      resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop:70
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

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#000",
  },

  welcome: {
    fontSize: 26,
    fontWeight: "600",
    color:'#16151C',
    textAlign: "center",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#A2A1A8",
    marginBottom: 30,
    marginTop:12
  },

  label: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: "500",
    color: "#202020",
    lineHeight:12
  },

  inputBox: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 8,
    marginBottom:10,
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
    color:'#202020'
  },

  registerLink: {
    color: "#1E45E1",
    fontWeight: "600",
  },

bottomWave: {
  width: "100%",
  height: 180,
  position: "absolute",
  bottom: 0,
  left: 0,
},



});
