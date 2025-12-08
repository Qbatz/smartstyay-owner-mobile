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
  Platform,
  BackHandler
} from "react-native";

import CalendarIcon from "../../../Assets/Images/calendar.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

export default function AddExpenses({ navigation, route }) {
  const editData = route?.params?.editData || null;

  // STATES
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [category, setCategory] = useState(editData?.category || "Kitchen");
  const [unitCount, setUnitCount] = useState(editData?.unitCount || "120");
  const [modePayment, setModePayment] = useState(editData?.paymentMode || "Cash");

  const [perUnit, setPerUnit] = useState(editData?.perUnit || "100");
  const [purchaseAmount, setPurchaseAmount] = useState(editData?.amount || "12000");
  const [description, setDescription] = useState(editData?.description || "");

  const [purchaseDate, setPurchaseDate] = useState(
    editData?.date ? new Date(editData.date) : new Date()
  );

  // Dropdown states
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [unitCountOpen, setUnitCountOpen] = useState(false);
  const [modePaymentOpen, setModePaymentOpen] = useState(false);

  // OPTIONS
  const categoryOptions = ["Kitchen", "Food", "Veg", "Non Veg"];
  const unitCountOptions = ["10", "50", "120", "200"];
  const paymentOptions = ["Cash", "UPI", "Card", "Online"];

  // BACK HANDLER
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  // CLOSE ALL DROPDOWNS
  const closeAll = () => {
    setCategoryOpen(false);
    setUnitCountOpen(false);
    setModePaymentOpen(false);
    setOpenDatePicker(false);
  };

  // REUSABLE DROPDOWN FIELD
  const renderSelectField = (label, selected, open, setOpen, list, onSelect) => (
    <View style={{ marginBottom: 6 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.select}
        onPress={() => {
          closeAll();
          setOpen(!open);
        }}
      >
        <Text style={styles.selectText}>{selected}</Text>
        <Text style={styles.caret}>⌄</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownBox}>
          <ScrollView
            style={{ maxHeight: 180 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {list.map((item, i) => {
              const isSelected = selected === item;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    isSelected && styles.dropdownItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      isSelected && styles.dropdownItemTextSelected,
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
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editData ? "Edit Expense" : "Add Expense"}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
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
            closeAll();
            setOpenDatePicker(!openDatePicker);
          }}
        >
          <Text style={styles.inputText}>{dayjs(purchaseDate).format("DD/MM/YYYY")}</Text>
          <Image source={CalendarIcon} style={styles.calendarIcon} />
        </TouchableOpacity>

        {openDatePicker && (
          <View style={[styles.dropdownBox, { maxHeight: 350 }]}>
            <ScrollView nestedScrollEnabled>
              <DatePicker
                mode="single"
                date={purchaseDate}
                onChange={(v) => {
                  setPurchaseDate(v.date || new Date());
                  setOpenDatePicker(false);
                }}
              />
            </ScrollView>
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
          onChangeText={setPerUnit}
          placeholder="0"
          placeholderTextColor="#999"
        />

        {/* Purchase Amount */}
        <Text style={styles.label}>Purchase amount *</Text>
        <TextInput
          style={styles.inputBox}
          value={purchaseAmount}
          keyboardType="numeric"
          onChangeText={setPurchaseAmount}
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

        {/* BUTTONS */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.saveText}>{editData ? "Update" : "Save"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============================= STYLES ============================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", paddingTop: 30 },

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  backIcon: { width: 20, height: 20, marginRight: 12, tintColor: "#222" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111" },

  container: { paddingHorizontal: 20 },

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
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
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

  dropdownBox: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#fff",
    overflow: "hidden",
    maxHeight: 180,
    zIndex: 999,
    elevation: 8,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  dropdownItemSelected: {
    backgroundColor: "#1D5BEE",
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#111",
  },

  dropdownItemTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
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
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
