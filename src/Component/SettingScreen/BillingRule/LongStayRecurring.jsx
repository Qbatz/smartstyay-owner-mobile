import React from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DownArrow from "../../../Assets/Images/direction-down.png";

export default function LongStayRecurring({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Long stay Recurring</Text>
      </View>

      {/* Billing Date */}
      <Text style={styles.label}>Billing Date of Month</Text>
      <TouchableOpacity style={styles.inputBox}>
        <Text style={styles.placeholder}>Select Billing Date of Month</Text>
        <Image source={require("../../../Assets/Images/calendar.png")} style={styles.icon} />
      </TouchableOpacity>

      {/* Due Date */}
      <Text style={styles.label}>Due Date of Month</Text>
      <TouchableOpacity style={styles.inputBox}>
        <Text style={styles.placeholder}>Select Due Date of Month</Text>
        <Image source={require("../../../Assets/Images/calendar.png")} style={styles.icon} />
      </TouchableOpacity>

      {/* Notice Period */}
      <Text style={styles.label}>Notice Period</Text>
      <TouchableOpacity style={styles.inputBox}>
        <Text style={styles.placeholder}>Select Notice Period</Text>
        <Image source={DownArrow} style={styles.icon} />
      </TouchableOpacity>

      {/* Button Row */}
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backIcon: { width: 20, height: 20, marginRight: 10 },

  headerTitle: { fontSize: 20, fontWeight: "700" },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },

  inputBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    justifyContent: "space-between",
    marginBottom: 12,
  },

  placeholder: {
    color: "#A0A0A0",
    fontSize: 14,
  },

  icon: { width: 20, height: 20, tintColor: "#8C8C8C" },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  cancelBtn: {
    backgroundColor: "#F3F3F3",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },

  cancelText: {
    color: "#555",
    fontSize: 16,
  },

  saveBtn: {
    backgroundColor: "#1D5BEE",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
