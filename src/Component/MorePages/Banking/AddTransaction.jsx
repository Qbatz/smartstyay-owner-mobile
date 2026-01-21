import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  BackHandler,
} from "react-native";

import CalendarIcon from "../../../Assets/Images/calendar.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

export default function AddTransaction({ navigation }) {
  // DATE
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(new Date());

  // DROPDOWNS
  const [transactionType, setTransactionType] = useState("Expense");
  const [transactionTypeOpen, setTransactionTypeOpen] = useState(false);

  const [category, setCategory] = useState("Food");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [fromAcc, setFromAcc] = useState("Cash");
  const [fromAccOpen, setFromAccOpen] = useState(false);

  const [toAcc, setToAcc] = useState("HDFC XXXX1234");
  const [toAccOpen, setToAccOpen] = useState(false);

  // OTHER INPUTS
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // OPTIONS
  const transactionOptions = ["Expense", "Income", "Transfer"];
  const categoryOptions = ["Food", "Travel", "Shopping", "Bills", "Recharge", "Other"];
  const accounts = ["Cash", "HDFC XXXX1234", "SBI XXXX5678", "Wallet", "Credit Card"];

  // CLOSE ALL LISTS
  const closeAll = () => {
    setTransactionTypeOpen(false);
    setCategoryOpen(false);
    setFromAccOpen(false);
    setToAccOpen(false);
  };

  // BACK HANDLER
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // REUSABLE BLUE-HIGHLIGHT DROPDOWN
  const renderSelect = (label, selected, open, setOpen, list, onSelect) => (
    <>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <Text style={styles.label}>{label.replace("*", "")}</Text>
        {label.includes("*") && <Text style={{ color: "red" }}>*</Text>}
      </View>

      <View style={{ position: "relative" }}>
        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => {
            closeAll();
            setOpen(!open);
          }}
        >
          <Text style={styles.selectText}>{selected}</Text>
          <Image source={require("../../../Assets/Images/direction-down.png")}
                 style={styles.downArrow} />
        </TouchableOpacity>

        {open && (
          <View style={styles.newDropdownMenu}>
            <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
              {list.map((item, i) => {
                const isSelected = selected === item;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.newOption,
                      isSelected && styles.newOptionSelected
                    ]}
                    onPress={() => {
                      onSelect(item);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.newOptionText,
                        isSelected && styles.newOptionTextSelected
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );

  return (
    <>
      <SafeAreaView style={styles.safe}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* HEADER */}
          <View style={styles.topHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={ArrowLeft} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Transaction</Text>
          </View>

          {/* Transaction Type */}
          {renderSelect(
            "Transaction Type *",
            transactionType,
            transactionTypeOpen,
            setTransactionTypeOpen,
            transactionOptions,
            setTransactionType
          )}

          {/* Category */}
          {renderSelect(
            "Category *",
            category,
            categoryOpen,
            setCategoryOpen,
            categoryOptions,
            setCategory
          )}

          {/* Date */}
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => {
              closeAll();
              setOpenDatePicker(true);
            }}
          >
            <Text style={{ color: "#222" }}>
              {dayjs(purchaseDate).format("DD-MM-YYYY")}
            </Text>
            <Image source={CalendarIcon} style={styles.calendarIcon} />
          </TouchableOpacity>

          {/* From Account */}
          {renderSelect(
            "From Account *",
            fromAcc,
            fromAccOpen,
            setFromAccOpen,
            accounts,
            setFromAcc
          )}

          {/* To Account */}
          {renderSelect(
            "To Account *",
            toAcc,
            toAccOpen,
            setToAccOpen,
            accounts,
            setToAcc
          )}

          {/* Amount */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            <Text style={styles.label}>Amount</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="₹0.00"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Description"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* BUTTONS */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveText}>Add</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* DATE PICKER MODAL */}
      {openDatePicker && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
              date={purchaseDate}
              onChange={(v) => {
                setPurchaseDate(v.date || new Date());
                setOpenDatePicker(false);
              }}
            />
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" , paddingTop:50},

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  backIcon: { width: 22, height: 22, marginRight: 12, tintColor: "#222" },

  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111" },

  container: { paddingHorizontal: 20, paddingTop: 20 },

  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 6,
    fontWeight: "500",
  },

  selectBox: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectText: { fontSize: 15, color: "#000" },
  downArrow: { width: 18, height: 18, tintColor: "#6A6A6A" },

  newDropdownMenu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    overflow: "hidden",
    maxHeight: 180,
    zIndex: 9999,
    elevation: 10,
  },

  newOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  newOptionSelected: {
    backgroundColor: "#1D5BEE",
  },

  newOptionText: { fontSize: 15, color: "#111" },
  newOptionTextSelected: { color: "#fff", fontWeight: "600" },

  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },

  inputBox: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  calendarIcon: { width: 20, height: 20, tintColor: "#444" },

  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 30,
    gap: 12,
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
    paddingHorizontal: 36,
    borderRadius: 10,
  },

  saveText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  datePickerBox: {
    backgroundColor: "#fff",
    width: "92%",
    borderRadius: 16,
    padding: 10,
    alignSelf: "center",
    marginBottom: 100,
  },
});
