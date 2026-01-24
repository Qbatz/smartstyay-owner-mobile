import React, { useRef, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  PanResponder,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  ScrollView, Keyboard, BackHandler
} from "react-native";
import EyeOpen from "../../../Assets/Images/Eye.png";
import EyeClose from "../../../Assets/Images/EyeIcon.png";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
export default function AddUserBottomSheet({ visible, onClose, editData, onSuccess }) {
  const { activeHostelId } = useContext(CommonContexts);
  const { getRoleByHostel, addUser, updateUser } = UseSetting();
  const translateY = useRef(new Animated.Value(500)).current;
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([])
  const [nameError, setNameError] = useState("")
  const [mobilError, setMobileError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [roleError, setRoleError] = useState("")
  const [emailError, setEmailError] = useState("")

  const [description, setDescription] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [initialData, setInitialData] = useState(null);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!activeHostelId) return;

    loadRoles();
  }, [activeHostelId]);

  const loadRoles = async () => {
    const res = await getRoleByHostel(activeHostelId);

    if (res.success) {
      console.log("Roles →", res.data);
      setRoles(res.data);
    } else {
      console.log("Role API error →", res.data);
    }
  };
  useEffect(() => {
    if (!visible) return;

    if (editData) {
      const init = {
        name: editData.firstName || "",
        email: editData.mailId || "",
        mobile: editData.mobileNo || "",
        roleId: editData.roleId,
        description: editData.description || "",
      };

      setInitialData(init);

      setName(init.name);
      setEmail(init.email);
      setMobile(init.mobile);
      setDescription(init.description);

      setSelectedRole({
        id: init.roleId,
        name: editData.roleName,
      });
    } else {
      setInitialData(null);
      setName("");
      setEmail("");
      setMobile("");
      setPassword("");
      setDescription("");
      setSelectedRole(null);
    }
  }, [editData, visible]);
  const isNoChangeDetected = () => {
    if (!initialData || !editData) return false;

    return (
      name.trim() === initialData.name &&
      email.trim() === initialData.email &&
      mobile.trim() === initialData.mobile &&
      description.trim() === initialData.description &&
      selectedRole?.id === initialData.roleId
    );
  };





  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[6-9]\d{9}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleAddUser = async () => {
    let valid = true;

    setNameError("");
    setEmailError("");
    setMobileError("");
    setPasswordError("");
    setRoleError("");

    if (!name.trim()) {
      setNameError("Please Enter Name");
      valid = false;
    }

    if (!email.trim()) {
      setEmailError("Please Enter Email ID");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Enter valid email");
      valid = false;
    }

    if (!mobile.trim()) {
      setMobileError("Please Enter Mobile Number");
      valid = false;
    } else if (!mobileRegex.test(mobile)) {
      setMobileError("Enter valid mobile number");
      valid = false;
    }

    if (!selectedRole) {
      setRoleError("Please Select Role");
      valid = false;
    }


    if (!editData) {
      if (!password.trim()) {
        setPasswordError("Please Enter Password");
        valid = false;
      } else if (!passwordRegex.test(password)) {
        setPasswordError(
          "Password must have uppercase, number & special character"
        );
        valid = false;
      }
    }

    if (!valid) return;
    if (editData && isNoChangeDetected()) {

      setModalType("warning");
      setMessage("No changes detected");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false)
      }, 800);
      return;

    }


    if (!editData) {
      const payload = {
        name: name.trim(),
        emailId: email.trim(),
        mobile: String(mobile),
        password,
        roleId: selectedRole.id,
        description: description.trim(),
      };


      const res = await addUser(activeHostelId, payload);

      if (res.success) {

        setModalType("success");
        setMessage(res.data);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false)
          onClose();
          onSuccess && onSuccess();
        }, 800);

      } else {
        setEmailError(res.data?.emailStatus);
        setMobileError(res.data?.mobileStatus);
      }
      return;
    }


    const payload = {
      name: name.trim(),
      emailId: email.trim(),
      mobile: String(mobile),
      role: selectedRole.id,
      description: description.trim(),
    };

    const res = await updateUser(
      activeHostelId,
      editData.userId,
      payload
    );

    if (res.success) {

      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false)
        onClose();
        onSuccess && onSuccess();
      }, 800);
    } else {

      setEmailError(res.data?.emailStatus);
      setMobileError(res.data?.mobileStatus);
    }
  };




  useEffect(() => {
    if (!visible) return;

    const backAction = () => {
      onClose();
      setNameError("");
      setEmailError("");
      setMobileError("");
      setPasswordError("");
      setRoleError("");
      return true;
    };

    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => handler.remove();
  }, [visible]);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 500,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible]);


  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy);
    },

    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) {
        onClose();
        setNameError("");
        setEmailError("");
        setMobileError("");
        setPasswordError("");
        setRoleError("");
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },

  });
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height - 40);
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);



  if (!visible) return null;

  return (
    <>
      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}

      />
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY }], paddingBottom: keyboardHeight }
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />

          <ScrollView
            style={{ paddingHorizontal: 20 }}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
          >

            <Text style={styles.title}>{editData ? "Edit User" : "Add User"}</Text>


            <Text style={styles.label}>Name <Text style={{color:'red'}}>*</Text></Text>
            <TextInput style={styles.input} placeholder="Enter Name" value={name} onChangeText={(text) => {
              setName(text);
              setNameError("");
            }} />
            {nameError && (
              <ErrorMessage message={nameError} type="error" />
            )}

            <Text style={styles.label}>Email ID <Text style={{color:'red'}}>*</Text></Text>
            <TextInput style={styles.input} placeholder="Enter Email" value={email} onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }} />
            {emailError && (
              <ErrorMessage message={emailError} type="error" />
            )}

            <Text style={styles.label}>Mobile Number <Text style={{color:'red'}}>*</Text></Text>
            <TextInput style={styles.input} placeholder="+91 98765 43210" value={mobile} onChangeText={(text) => {
              setMobile(text);
              setMobileError("");
            }}
            />
            {mobilError && (
              <ErrorMessage message={mobilError} type="error" />
            )}
            {!editData && (
              <>

                <Text style={styles.label}>Password <Text style={{color:'red'}}>*</Text></Text>

                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter Password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setPasswordError("");
                    }}
                    secureTextEntry={!showPassword}


                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      source={showPassword ? EyeOpen : EyeClose}
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>
                {passwordError && (
                  <ErrorMessage message={passwordError} type="error" />
                )}
              </>
            )}


            <Text style={styles.label}>Role <Text style={{color:'red'}}>*</Text></Text>

            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() => setRoleOpen(!roleOpen)}
            >
              <Text style={{ color: selectedRole ? "#000" : "#9CA3AF" }}>
                {selectedRole?.name || "Select a role"}
              </Text>


              <Image
                source={require("../../../Assets/Images/direction-down.png")}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
            {roleOpen && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={{ maxHeight: 150 }}>
                  {roles.map((role) => (
                    <TouchableOpacity
                      key={role.id}
                      style={styles.option}
                      onPress={() => {
                        setSelectedRole(role);
                        setRoleOpen(false);
                        setRoleError("")
                      }}
                    >
                      <Text style={styles.optionText}>{role.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {roleError && (
              <ErrorMessage message={roleError} type="error" />
            )}







            <Text style={styles.label}>Description </Text>
            <TextInput
              style={styles.textarea}
              placeholder="Enter Description"
              multiline
              value={description}
              onChangeText={setDescription}
            />

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addBtn} onPress={handleAddUser}>
                <Text style={styles.addText}>{editData ? "Edit" : "Add"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  sheet: {
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
  },

  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#D6D6D6",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    fontSize: 15,
  },

  dropdownBox: {
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  arrowIcon: {
    width: 18,
    height: 18,
    tintColor: "#6A6A6A",
  },

  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  dropdownText: {
    fontSize: 15,
  },

  textarea: {
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    height: 110,
    textAlignVertical: "top",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 30,
  },

  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },

  cancelText: {
    fontSize: 16,
    color: "#656565",
  },

  addBtn: {
    backgroundColor: "#1D5BEE",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  addText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dropdownMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "67%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    zIndex: 999,
    elevation: 10,
  },


  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  optionText: {
    fontSize: 15,
    color: "#000",
  },

  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },

  passwordInput: {
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 10,
    padding: 12,
    paddingRight: 45,   // space for eye icon
    marginTop: 6,
    fontSize: 15,
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    top: 22,  // perfect alignment
  },

  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: "#6A6A6A",
  },

});
