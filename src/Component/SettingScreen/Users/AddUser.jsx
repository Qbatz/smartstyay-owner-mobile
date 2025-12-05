import React, { useRef, useEffect, useState } from "react";
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
  ScrollView, KeyboardAvoidingView, Platform,Keyboard
} from "react-native";
import EyeOpen from "../../../Assets/Images/Eye.png";
import EyeClose from "../../../Assets/Images/EyeIcon.png";

export default function AddUserBottomSheet({ visible, onClose }) {
  const translateY = useRef(new Animated.Value(500)).current;
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const roles = ["Accounts Manager", "Office Admin", "Hostel Manager", "Staff"];
 

  const [description, setDescription] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);



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
      if (g.dy > 120) onClose();
      else
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
    },
  });
useEffect(() => {
  const show = Keyboard.addListener("keyboardDidShow", (e) => {
    setKeyboardHeight(e.endCoordinates.height - 40); // adjust ↓
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
          {/* Title */}
          <Text style={styles.title}>Add User</Text>

          {/* Name */}
          <Text style={styles.label}>Name *</Text>
          <TextInput style={styles.input} placeholder="Enter Name" />

          {/* Email */}
          <Text style={styles.label}>Email ID *</Text>
          <TextInput style={styles.input} placeholder="Enter Email" />

          {/* Mobile */}
          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput style={styles.input} placeholder="+91 98765 43210" />

          {/* Password */}
         <Text style={styles.label}>Password *</Text>
        
          <View style={styles.passwordWrapper}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Enter Password"
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


          {/* Role */}
          <Text style={styles.label}>Role *</Text>

          <TouchableOpacity
            style={styles.dropdownBox}
            onPress={() => setRoleOpen(!roleOpen)}
          >
            <Text style={{ color: selectedRole ? "#000" : "#9CA3AF" }}>
              {selectedRole || "Select a role"}
            </Text>

            <Image
              source={require("../../../Assets/Images/direction-down.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          {roleOpen && (
                                      <View style={styles.dropdownMenu}>
                                          <ScrollView style={{ maxHeight: 150 }}>
                                              {roles.map((v, index) => (
                                                  <TouchableOpacity
                                                      key={index}
                                                      style={styles.option}
                                                      onPress={() => {
                                                          setSelectedRole(v);
                                                          setRoleOpen(false);
                                                      }}
                                                  >
                                                      <Text style={styles.optionText}>{v}</Text>
                                                  </TouchableOpacity>
                                              ))}
                                          </ScrollView>
                                      </View>
                                  )}

          {/* Role list */}
          {/* {roleOpen && (
            <View style={styles.dropdownList}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 160 }}>
                {roles.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedRole(item);
                      setRoleOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )} */}
             

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
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

            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
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
