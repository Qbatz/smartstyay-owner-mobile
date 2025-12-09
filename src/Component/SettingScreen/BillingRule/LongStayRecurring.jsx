import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet,Image, ScrollView } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DownArrow from "../../../Assets/Images/direction-down.png";

export default function LongStayRecurring({ navigation }) {


  const billingDays = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const [billingOpen, setBillingOpen] = useState(false);
  const [selectedBillingDay, setSelectedBillingDay] = useState("");
  const dueDays = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const [dueOpen, setDueOpen] = useState(false);
  const [selectedDueDay, setSelectedDueDay] = useState("");

  const noticeDays = Array.from({ length: 30 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState("");


  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Long stay Recurring</Text>
      </View>


      <Text style={styles.label}>Billing Date Of Month *</Text>

      <TouchableOpacity
        style={styles.dropdownBox}
        onPress={() => setBillingOpen(!billingOpen)}
      >
        <Text style={{ color: selectedBillingDay ? "#000" : "#9CA3AF" }}>
          {selectedBillingDay || "Select Billing Date"}
        </Text>

        <Image
          source={DownArrow}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      {billingOpen && (
        <View style={styles.billingDropdownMenu}>
          <ScrollView style={{ maxHeight: 180 }}>
            {billingDays.map((d, index) => {
              const isSelected = d === selectedBillingDay;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.billingOption,
                    isSelected && styles.billingOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedBillingDay(d);
                    setBillingOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.billingOptionText,
                      isSelected && styles.billingOptionTextSelected,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}


      {/* Due Date */}
      <Text style={styles.label}>Due Date of Month</Text>

      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setDueOpen(!dueOpen)}
      >
        <Text style={{ color: selectedDueDay ? "#000" : "#9CA3AF" }}>
          {selectedDueDay || "Select Due Date of Month"}
        </Text>

        <Image
          source={DownArrow}
          style={styles.icon}
        />
      </TouchableOpacity>

      {dueOpen && (
        <View style={styles.dueDropdownMenu}>
          <ScrollView style={{ maxHeight: 180 }}>
            {dueDays.map((d, index) => {
              const isSelected = d === selectedDueDay;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dueOption,
                    isSelected && styles.dueOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedDueDay(d);
                    setDueOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dueOptionText,
                      isSelected && styles.dueOptionTextSelected,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}


      <Text style={styles.label}>Notice Period</Text>

      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setNoticeOpen(!noticeOpen)}
      >
        <Text style={{ color: selectedNotice ? "#000" : "#9CA3AF" }}>
          {selectedNotice || "Select Notice Period"}
        </Text>

        <Image source={DownArrow} style={styles.icon} />
      </TouchableOpacity>

      {noticeOpen && (
        <View style={styles.noticeDropdownMenu}>
          <ScrollView style={{ maxHeight: 180 }}>
            {noticeDays.map((day, index) => {
              const isSelected = selectedNotice === day;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.noticeOption,
                    isSelected && styles.noticeOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedNotice(day);
                    setNoticeOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.noticeOptionText,
                      isSelected && styles.noticeOptionTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}


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
  container: { flex: 1, backgroundColor: "#fff", padding: 20,paddingTop:40 },

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
    top: "20%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    zIndex: 999,
    elevation: 10,
  },





  billingDropdownMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#fff",
    maxHeight: 200,
    overflow: "hidden",
  },

  billingOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  billingOptionSelected: {
    backgroundColor: "#1D5BEE",   // அந்த blue highlight
  },

  billingOptionText: {
    fontSize: 15,
    color: "#111827",
  },

  billingOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  dueDropdownMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  dueOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  dueOptionSelected: {
    backgroundColor: "#1D5BEE",
  },

  dueOptionText: {
    fontSize: 15,
    color: "#111827",
  },

  dueOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  noticeDropdownMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  noticeOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  noticeOptionSelected: {
    backgroundColor: "#1D5BEE",
  },

  noticeOptionText: {
    fontSize: 15,
    color: "#111",
  },

  noticeOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },



});
