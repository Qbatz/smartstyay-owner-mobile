import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
  BackHandler,
  ScrollView,
  Image
} from "react-native";
import CloseIcon from "../../../Assets/Images/remove.png";

export default function AddBankingModal({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState("Bank");

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    };

    const back = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => back.remove();
  }, [visible]);

  const TabButton = ({ title }) => (
    <TouchableOpacity
      style={[styles.tabBtn, activeTab === title && styles.activeTab]}
      onPress={() => setActiveTab(title)}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === title && { color: "#1D5DFF", fontWeight: "700" },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const RenderForm = () => {
    switch (activeTab) {
      case "Bank":
        return (
          <>
            <Text style={styles.label}>Beneficiary Name</Text>
            <TextInput style={styles.input} placeholder="Enter Beneficiary Name" />

            <Text style={styles.label}>Bank Name</Text>
            <TextInput style={styles.input} placeholder="Enter Bank Name" />

            <Text style={styles.label}>Account No</Text>
            <TextInput style={styles.input} placeholder="Enter Account No" />

            <Text style={styles.label}>IFSC Code</Text>
            <TextInput style={styles.input} placeholder="Enter IFSC Code" />

            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.input} placeholder="Enter Description" />
          </>
        );

      case "UPI":
        return (
          <>
            <Text style={styles.label}>Beneficiary Name</Text>
            <TextInput style={styles.input} placeholder="Enter Beneficiary Name" />

            <Text style={styles.label}>UPI ID</Text>
            <TextInput style={styles.input} placeholder="Enter UPI ID" />

            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.input} placeholder="Enter Description" />
          </>
        );

      case "Card":
        return (
          <>
            <Text style={styles.label}>Beneficiary Name</Text>
            <TextInput style={styles.input} placeholder="Enter Beneficiary Name" />

            <Text style={styles.label}>Card Type</Text>
            <TextInput style={styles.input} placeholder="Select Card Type" />

            <Text style={styles.label}>Card No</Text>
            <TextInput style={styles.input} placeholder="Enter Card No" />

            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.input} placeholder="Enter Description" />
          </>
        );

      case "Cash":
        return (
          <>
            <Text style={styles.label}>Beneficiary Name</Text>
            <TextInput style={styles.input} placeholder="Enter Beneficiary Name" />

            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.input} placeholder="Enter Description" />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      {/* BACKDROP CLOSE */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* MAIN SHEET */}
      <View style={styles.sheet}>
        {/* HEADER */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>
            {activeTab === "Bank" ? "Add Bank" :
             activeTab === "UPI" ? "Add UPI" :
             activeTab === "Card" ? "Add Card" :
             "Add Cash"}
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Image source={CloseIcon} style={styles.closeIcon}/>
          </TouchableOpacity>
        </View>

        {/* TABS */}
        <View style={styles.tabsRow}>
          <TabButton title="Bank" />
          <TabButton title="UPI" />
          <TabButton title="Card" />
          <TabButton title="Cash" />
        </View>

        <ScrollView style={{ maxHeight: 350 }}>
          <RenderForm />
        </ScrollView>

        {/* ADD BUTTON */}
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    elevation: 10,
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  closeIcon: {
    height:12, width:12,
    color: "#000",
  },

  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#1D5DFF",
  },

  tabText: {
    fontSize: 14,
    color: "#555",
  },

  label: {
    fontSize: 13,
    marginBottom: 6,
    marginTop: 10,
    color: "#444",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    padding: 10,
  },

  addBtn: {
    backgroundColor: "#1D5DFF",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
