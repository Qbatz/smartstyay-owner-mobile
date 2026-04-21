import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  PanResponder,
  Keyboard,
  Image
} from "react-native";
import { useGeneral } from "../../../Context/GeneralContext";
import Eye from "../../../Assets/Images/Eye.png";
import EyeClose from "../../../Assets/Images/EyeIcon.png";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";



export default function AdminResetPasswordSheet({ visible, onClose }) {

  const sheetY = useRef(new Animated.Value(400)).current;
  const { AdminResetPassword } = useGeneral();

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [oldError, setOldError] = useState("");
  const [newError, setNewError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [apiError, setApiError] = useState("");

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");

  useEffect(() => {
    if (visible) {
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const closeSheet = () => {
    Keyboard.dismiss();

    Animated.timing(sheetY, {
      toValue: 400,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setApiError("")
      setOldError("")
      setConfirmError("")
      setNewError("")
      onClose();
    });
  };

  useEffect(() => {
  const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  });

  const hideSub = Keyboard.addListener("keyboardDidHide", () => {
    setKeyboardHeight(0);
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);


const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

const cleanPassword = (text) => {
  return text.replace(/[^A-Za-z0-9@$!%*?&^#]/g, "");
};

const handleUpdate = async () => {

  let valid = true;

  setOldError("");
  setNewError("");
  setConfirmError("");
  setApiError("");

  if (!oldPass) {
    setOldError("Please Enter Current Password");
    valid = false;
  }

  if (!newPass) {
    setNewError("Please Enter New Password");
    valid = false;
  }
  else if (!passwordRegex.test(newPass)) {
    setNewError(
      "Password must be 8+ chars with upper, lower, number & special symbol"
    );
    valid = false;
  }

  if (!confirmPass) {
    setConfirmError("Please Enter Confirm Password");
    valid = false;
  }
  else if (newPass !== confirmPass) {
    setConfirmError("Password Does Not Match");
    valid = false;
  }

  if (!valid) return;

  const res = await AdminResetPassword(oldPass, newPass, confirmPass);

  if (res?.success) {
      setModalMessage(res?.data);
      setModalType("success");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
          closeSheet();
      }, 1500);

  } else {
    setApiError(res?.data || "Failed to reset password")
  }
};

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeSheet();
        else Animated.spring(sheetY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  if (!visible) return null;

  return (

    <>
    
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />
    <View style={styles.overlay}>
      <TouchableOpacity style={{ flex: 1 }} onPress={closeSheet} />

     <Animated.View
  {...panResponder.panHandlers}
  style={[
    styles.sheet,
    {
      transform: [{ translateY: sheetY }],
      paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 40
    },
  ]}
>


        <View style={styles.handle} />

        <Text style={styles.title}>Reset Password</Text>

        {/* OLD PASSWORD */}

        <Text style={styles.label}>Old Password <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>

        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showOld}
            placeholder="Enter old password"
            value={oldPass}
            onChangeText={(t) => {
               setOldPass(cleanPassword(t));
              // setOldPass(t);
              setApiError("");
              setOldError("")
            }}
          />

          <TouchableOpacity
            style={styles.eye}
            onPress={() => setShowOld(!showOld)}
          >
            <Image source={showOld ? Eye : EyeClose} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>

         {oldError && (
              <ErrorMessage message={oldError} type="error" />
            )}

              {apiError && (
              <ErrorMessage message={apiError} type="error" />
            )}

        <Text style={styles.label}>New Password <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>

        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showNew}
            placeholder="Enter new password"
            value={newPass}
            onChangeText={(t) => {
            //  const cleaned = t.replace(/[^A-Za-z0-9@$!%*?&^#]/g, "");
            //  setNewPass(cleaned);

              setNewPass(cleanPassword(t));
            //   setNewPass(t);
              setApiError("");
              setNewError("")
            }}
          />

          <TouchableOpacity
            style={styles.eye}
            onPress={() => setShowNew(!showNew)}
          >
            <Image source={showNew ? Eye : EyeClose} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>

        {newError && (
              <ErrorMessage message={newError} type="error" />
            )}


        {/* CONFIRM PASSWORD */}

        <Text style={styles.label}>Confirm Password <Text style={{ color: "red", fontWeight: "700" }}>*</Text>
            </Text>

        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showConfirm}
            placeholder="Confirm password"
            value={confirmPass}
            onChangeText={(t) => {
              // setConfirmPass(t);
              setConfirmPass(cleanPassword(t));
              setApiError("");
              setConfirmError("")
            }}
          />

          <TouchableOpacity
            style={styles.eye}
            onPress={() => setShowConfirm(!showConfirm)}
          >
            <Image source={showConfirm ? Eye : EyeClose} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>

          {confirmError && (
              <ErrorMessage message={confirmError} type="error" />
            )}

  




  


        <View style={styles.row}>

          <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
            <Text style={{ color: "#4466F2",  fontFamily: "Gilroy-Bold"}}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
            <Text style={{ color: "#fff", fontFamily: "Gilroy-Bold" }}>Update</Text>
          </TouchableOpacity>

        </View>

      </Animated.View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({

  overlay:{
    position:"absolute",
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor:"rgba(0,0,0,0.5)",
    justifyContent:"flex-end"
  },

  sheet:{
    backgroundColor:"#fff",
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    padding:20, paddingBottom:60
  },

  handle:{
    width:40,
    height:5,
    backgroundColor:"#ccc",
    alignSelf:"center",
    borderRadius:10,
    marginBottom:15
  },

  title:{
    fontSize:18,
   fontFamily: "Gilroy-Bold" ,
    marginBottom:20
  },

  label:{
    fontSize:14,
    color:"#555",
    marginTop:10,
    marginRight:4,
    fontFamily: "Gilroy-Semibold"
  },

  passwordWrapper:{
    position:"relative",
    justifyContent:"center"
  },

  passwordInput:{
    borderWidth:1,
    borderColor:"#ddd",
    borderRadius:10,
    padding:12,
    marginTop:8,
    marginBottom:10,
    paddingRight:45,
    fontFamily: "Gilroy-Regular" 
  },

  eye:{
    position:"absolute",
    right:12,
    top:20
  },

  eyeIcon:{
    width:20,
    height:20,
    tintColor:"#999"
  },

  row:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:30 , marginBottom:30
  },

  cancelBtn:{
    width:"45%",
    padding:12,
    borderWidth:1,
    borderColor:"#4466F2",
    borderRadius:10,
    alignItems:"center"
  },

  updateBtn:{
    width:"45%",
    padding:12,
    backgroundColor:"#4466F2",
    borderRadius:10,
    alignItems:"center"
  }

});