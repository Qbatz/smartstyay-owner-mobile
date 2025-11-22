// AddExpenses.js
// Navigation-friendly, Figma-styled Add Expense screen with inline full-width dropdowns & date picker below the field

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

export default function AddExpenses({ navigation }) {
  // DATE
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(new Date());

  // SELECTS (hooks stable)
  const [category, setCategory] = useState("Kitchen");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [unitCount, setUnitCount] = useState("120");
  const [unitCountOpen, setUnitCountOpen] = useState(false);

  const [modePayment, setModePayment] = useState("Cash");
  const [modePaymentOpen, setModePaymentOpen] = useState(false);

  // INPUTS
  const [perUnit, setPerUnit] = useState("100");
  const [purchaseAmount, setPurchaseAmount] = useState("12000");
  const [description, setDescription] = useState("");

  // OPTIONS
  const categoryOptions = ["Kitchen", "Food", "Veg", "Non Veg"];
  const unitCountOptions = ["10", "50", "120", "200"];
  const paymentOptions = ["Cash", "UPI", "Card", "Online"];

  // close all open lists
  const closeAll = () => {
    setCategoryOpen(false);
    setUnitCountOpen(false);
    setModePaymentOpen(false);
    setOpenDatePicker(false);
  };

  // shared select UI (field)
  const renderSelectField = (label, selected, open, setOpen, list, onSelect) => (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.select}
        onPress={() => {
          // close other open ones and toggle this
          setCategoryOpen(false);
          setUnitCountOpen(false);
          setModePaymentOpen(false);
          setOpenDatePicker(false);
          setOpen(!open);
        }}
      >
        <Text style={styles.selectText}>{selected}</Text>
        <Text style={styles.caret}>⌄</Text>
      </TouchableOpacity>

      {/* Inline dropdown list (full width under field) */}
      {open && (
        <View style={styles.dropdownBox}>
          <ScrollView
            style={{ maxHeight: 220 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {list.map((v, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  onSelect(v);
                  setOpen(false);
                }}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{v}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>

          <View style={styles.topHeader}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                          <Image source={ArrowLeft} style={styles.backIcon} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Add Expense</Text>
                      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
       

        {/* Category */}
        {renderSelectField(
          "Category *",
          category,
          categoryOpen,
          setCategoryOpen,
          categoryOptions,
          setCategory
        )}

        {/* Purchase Date */}
        <Text style={styles.label}>Purchase Date *</Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => {
            // close other lists and toggle date picker inline
            setCategoryOpen(false);
            setUnitCountOpen(false);
            setModePaymentOpen(false);
            setOpenDatePicker(!openDatePicker);
          }}
        >
          <Text style={styles.inputText}>{dayjs(purchaseDate).format("DD/MM/YYYY")}</Text>
          <Image source={CalendarIcon} style={styles.calendarIcon} />
        </TouchableOpacity>

        {/* Date picker inline under the field (Option B) */}
        {openDatePicker && (
          <View style={styles.dropdownBox}>
            {/* DatePicker UI rendered inline */}
            <DatePicker
              mode="single"
              date={purchaseDate}
              onChange={(v) => {
                setPurchaseDate(v.date || new Date());
                setOpenDatePicker(false);
              }}
              style={{ width: Platform.OS === "ios" ? 320 : "100%" }}
            />
          </View>
        )}

        {/* Unit Count */}
        {renderSelectField(
          "Unit Count *",
          unitCount,
          unitCountOpen,
          setUnitCountOpen,
          unitCountOptions,
          setUnitCount
        )}

        {/* Per Unit */}
        <Text style={styles.label}>Per Unit amount *</Text>
        <TextInput
          style={styles.inputBox}
          value={perUnit}
          keyboardType="numeric"
          onChangeText={(t) => setPerUnit(t)}
          placeholder="0"
          placeholderTextColor="#999"
        />

        {/* Purchase Amount */}
        <Text style={styles.label}>Purchase amount *</Text>
        <TextInput
          style={styles.inputBox}
          value={purchaseAmount}
          keyboardType="numeric"
          onChangeText={(t) => setPurchaseAmount(t)}
          placeholder="0"
          placeholderTextColor="#999"
        />

        {/* Mode of Transaction */}
        {renderSelectField(
          "Mode of Transaction *",
          modePayment,
          modePaymentOpen,
          setModePaymentOpen,
          paymentOptions,
          setModePayment
        )}

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textarea}
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Add a short description"
          placeholderTextColor="#999"
        />

        {/* Controls row (Cancel / Save) */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => {
              // TODO: handle submit -> call API or update parent
              navigation.goBack();
            }}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" , paddingTop:30},

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    // marginBottom: 8,
  },

  backIcon: { width: 20, height: 20, marginRight: 12, tintColor: "#222" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111" },

  container: { paddingHorizontal: 20, paddingBottom: 30 },

  label: {
    fontSize: 14,
    color: "#222",
    marginTop: 18,
    marginBottom: 6,
    fontWeight: "500",
  },

  select: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  selectText: { fontSize: 15, color: "#000" },
  caret: { fontSize: 18, color: "#444" },

  inputBox: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    justifyContent: "center",
    backgroundColor: "#fff",
    fontSize: 15,
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  inputText: { color: "#111" },

  textarea: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    fontSize: 15,
    textAlignVertical: "top",
  },

  calendarIcon: { width: 22, height: 22, tintColor: "#676767" },

  /* Inline dropdown box (full width under field) */
  dropdownBox: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#fff",
    overflow: "hidden",
    // shadow for iOS / elevation for Android
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
    }),
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  dropdownItemText: { fontSize: 15, color: "#222" },

  /* Buttons */
  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
    alignItems: "center",
  },

  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },

  cancelText: {
    color: "#6B7280",
    fontSize: 15,
  },

  saveBtn: {
    backgroundColor: "#2B6CF6",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
