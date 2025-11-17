import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  BackHandler,
} from "react-native";

import DirectionDownIcon from "../../Assets/Images/direction_down.png";
import CalendorIcon from "../../Assets/Images/calendar.png";

export default function ReassignBedModal({ visible, onClose }) {
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [reFloor, setReFloor] = useState("");
  const [reRoom, setReRoom] = useState("");
  const [reBed, setReBed] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const [openDropdown, setOpenDropdown] = useState("");

  const floors = ["Ground Floor", "First Floor", "Second Floor"];
  const rooms = ["101", "102", "103", "104"];
  const beds = ["A", "B", "C"];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: visible ? 250 : 150,
      useNativeDriver: true,
    }).start();
  }, [visible]);

 useEffect(() => {
  const backAction = () => {
    if (visible) {
      onClose();
      return true;
    }
    return false;
  };

  const subscription = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => subscription.remove();
}, [visible]);


  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const renderDisabledDropdown = (label, value) => (
    <View>
      <Text style={styles.label}>
        {label} <Text style={styles.star}>*</Text>
      </Text>

      <View style={styles.disabledBox}>
        <Text style={styles.disabledText}>{value}</Text>
        <Image source={DirectionDownIcon} style={styles.downIcon} />
      </View>
    </View>
  );

 const renderDropdown = (label, placeholder, value, setValue, data, key) => (
  <View>
    <Text style={styles.label}>
      {label} <Text style={styles.star}>*</Text>
    </Text>

    <TouchableOpacity
      style={styles.inputBox}
      onPress={() => setOpenDropdown(openDropdown === key ? "" : key)}
    >
      <Text style={{ fontSize: 15, color: value ? "#000" : "#8a8a8a" }}>
        {value || placeholder}
      </Text>

      <Image
        source={DirectionDownIcon}
        style={[
          styles.downIcon,
          openDropdown === key ? { transform: [{ rotate: "180deg" }] } : {},
        ]}
      />
    </TouchableOpacity>

    {openDropdown === key && (
      <View style={styles.dropdownMenu}>
        <ScrollView>
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                setValue(item);
                setOpenDropdown("");
              }}
            >
              <Text style={styles.dropdownText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}
  </View>
);


  return (
    <Modal visible={visible} transparent animationType="fade"    onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.headerBar} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Re Assign Bed</Text>

          {renderDisabledDropdown("Current Floor", "Ground Floor")}
          {renderDisabledDropdown("Current Room", "103")}
          {renderDisabledDropdown("Current Bed", "A")}

        {renderDropdown("Reassign Floor", "Select Floor", reFloor, setReFloor, floors, "floor")}
        {renderDropdown("Reassign Room", "Select Room", reRoom, setReRoom, rooms, "room")}
        {renderDropdown("Reassign Bed", "Select Bed", reBed, setReBed, beds, "bed")}


          <Text style={styles.label}>
            Date <Text style={styles.star}>*</Text>
          </Text>

          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setDate(new Date().toLocaleDateString("en-GB"))}
          >
            <Text style={{ fontSize: 15, color: date ? "#000" : "#8a8a8a" }}>
              {date || "DD/MM/YYYY"}
            </Text>

            <Image source={CalendorIcon} style={styles.downIcon} />
          </TouchableOpacity>

          <Text style={styles.label}>
            New Rent Amount <Text style={styles.star}>*</Text>
          </Text>

          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter Amount"
              placeholderTextColor="#8a8a8a"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={{ flex: 1, fontSize: 15, color: "#000" }}
            />
          </View>

          <Text style={styles.label}>
            Reason <Text style={styles.star}>*</Text>
          </Text>

          <View style={styles.textArea}>
            <TextInput
              placeholder="Enter Comments"
              placeholderTextColor="#8a8a8a"
              multiline
              value={reason}
              onChangeText={setReason}
              style={styles.textAreaInput}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reassignBtn}>
              <Text style={styles.reassignText}>Re Assign</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },

  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  headerBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },

  title: { fontSize: 19, fontWeight: "700", marginBottom: 20 },

  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, marginTop: 12 },

  star: { color: "red" },

  inputBox: {
    backgroundColor: "#F6F8FF",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  disabledBox: {
    backgroundColor: "#EEF2FF",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  disabledText: { fontSize: 15, color: "#666" },

  downIcon: { height: 20, width: 20 },

  dropdownMenu: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    maxHeight: 150,
    marginTop: 5,
    marginBottom: 10,
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  dropdownText: { fontSize: 15, color: "#000" },

  textArea: {
    backgroundColor: "#F6F8FF",
    padding: 14,
    borderRadius: 12,
    height: 100,
  },

  textAreaInput: {
    fontSize: 15,
    color: "#000",
    textAlignVertical: "top",
    height: 100,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 20,
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    marginRight: 10,
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },

  reassignBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#1E45E1",
    alignItems: "center",
    marginLeft: 10,
  },

  reassignText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
