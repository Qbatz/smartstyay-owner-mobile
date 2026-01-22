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
  Platform,Image
} from "react-native";
import { useGeneral } from "../../../Context/GeneralContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import Eye from "../../../Assets/Images/Eye.png";
import EyeClose from "../../../Assets/Images/EyeIcon.png";


export default function ChangePasswordSheet({ visible, onClose, adminId }) {
  const sheetY = useRef(new Animated.Value(400)).current;
  const { changePassword } = useGeneral();

  const [newPass, setNewPass] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [passError, setPassError] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showPassword, setShowPassword] = useState(false);



  // ✅ keyboard height state
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handlePasswordUpdate = async () => {
    if (!newPass.trim()) {
      setPassError("Please Enter Password");
      return;
    }

    if (!strongPasswordRegex.test(newPass)) {
      setPassError(
        "Password must be 8 chars, include A-Z, a-z, 0-9 & a special character"
      );
      return;
    }

    const res = await changePassword(adminId, newPass);

    if (res.success) {
      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setNewPass("");
      }, 1500);
    } else {
      setModalType("error");
      setMessage(res.data?.message || "Failed to update password");
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

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
    Keyboard.dismiss(); // ✅ important
    Animated.timing(sheetY, {
      toValue: 400,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setKeyboardHeight(0);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1.5) closeSheet();
        else Animated.spring(sheetY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <>
      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}
        onClose={() => setShowSuccess(false)}
      />

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.touchArea} onPress={closeSheet} />

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.sheet,
            {
              transform: [{ translateY: sheetY }],
              // ✅ keyboard opened -> increase padding
              paddingBottom:
                keyboardHeight > 0
                  ? keyboardHeight + 20
                  : 80,
            },
          ]}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>Change Password</Text>

          <Text style={styles.label}>
            New Password <Text style={{ color: "red", fontWeight: "700" }}>*</Text>
          </Text>

          {/* <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={newPass}
            secureTextEntry={true}
            onChangeText={(t) => {
              setNewPass(t);
              setPassError("");
            }}
          /> */}
          <View style={styles.passwordWrapper}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Enter new password"
    value={newPass}
    secureTextEntry={!showPassword}
  onChangeText={(t) => {
  const cleaned = t.replace(/[^A-Za-z0-9@$!%*?&]/g, "");
  setNewPass(cleaned);
  setPassError("");
}}
  />

  <TouchableOpacity
    style={styles.eyeIconBox}
    onPress={() => setShowPassword(!showPassword)}
  >
    <Image
      source={showPassword ? Eye : EyeClose}
      style={styles.eyeIcon}
    />
  </TouchableOpacity>
</View>


          {passError && <ErrorMessage message={passError} type="error" />}

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.updateBtn} onPress={handlePasswordUpdate}>
              <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // ✅ 20 remove
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  touchArea: { flex: 1 },

  sheet: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  
  },

  handle: {
    width: 45,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },

  label: {
    color: "#555",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#000",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  cancelBtn: {
    width: "45%",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#4466F2",
    borderRadius: 10,
    alignItems: "center",
  },

  cancelText: {
    color: "#4466F2",
    fontWeight: "700",
  },

  updateBtn: {
    width: "45%",
    paddingVertical: 12,
    backgroundColor: "#4466F2",
    borderRadius: 10,
    alignItems: "center",
  },

  updateText: {
    color: "#fff",
    fontWeight: "700",
  },
  passwordWrapper: {
  position: "relative",
  justifyContent: "center",
},

passwordInput: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  height: 48,
  paddingHorizontal: 14,
  paddingRight: 45, // ✅ space for eye
  marginTop: 8,
},

eyeIconBox: {
  position: "absolute",
  right: 12,
  top: 20,
},

eyeIcon: {
  width: 20,
  height: 20,
  tintColor: "#999",
},

});
