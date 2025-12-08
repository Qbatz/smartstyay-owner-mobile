import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  BackHandler,  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

import DownArrow from "../../../Assets/Images/direction-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";

export default function CreateReceipt({ navigation }) {

    
  const CustomerOptions = ["Harish", "Kumar", "Ruban", "Suresh"];
  const InvoiceOptions = ["INV001", "INV002", "INV003" , "INV004"];
  const ModeOptions = ["Google Pay", "PhonePe", "IMMAN SBI", "Cash"];

  const [customer, setCustomer] = useState("Select Customer");
  const [invoiceNo, setInvoiceNo] = useState("Select Invoice");
  const [amountReceived, setAmountReceived] = useState("");
  const [modeSelected, setModeSelected] = useState("Select Mode");
  const [notes, setNotes] = useState("");

  const [dueAmount, setDueAmount] = useState("");

  const [paymentDate, setPaymentDate] = useState(new Date());

  const [openCustomer, setOpenCustomer] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openMode, setOpenMode] = useState(false);

  const [openDuePicker, setOpenDuePicker] = useState(false);
  const [openPaymentPicker, setOpenPaymentPicker] = useState(false);
  
   

  const route = useRoute();
  const { mode, data } = route.params || {};

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  return (
    <>
      {/* HEADER */}
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
  >

      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}> {mode === "edit" ? "Edit Receipt" : " Create Receipt"}</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* ========================= CUSTOMER ======================== */}
       <Text style={styles.label}>Customer</Text>
<View style={styles.selectWrapper}>
  <TouchableOpacity
    style={styles.selectBox}
    onPress={() => setOpenCustomer(!openCustomer)}
  >
    <Text style={[styles.selectedText, !customer && { color: "#9CA3AF" }]}>
      {customer}
    </Text>
    <Image source={DownArrow} style={styles.downArrow} />
  </TouchableOpacity>

  {openCustomer && (
    <View style={styles.newDropdownMenu}>
      <ScrollView style={{ maxHeight: 130 }} nestedScrollEnabled={true}>
        {CustomerOptions.map((item, index) => {
          const isSelected = customer === item;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.newOption,
                isSelected && styles.newOptionSelected,
              ]}
              onPress={() => {
                setCustomer(item);
                setOpenCustomer(false);
              }}
            >
              <Text
                style={[
                  styles.newOptionText,
                  isSelected && styles.newOptionTextSelected,
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


        {/* ========================= INVOICE ======================== */}
      <Text style={styles.label}>Invoice No</Text>
<View style={styles.selectWrapper}>
  <TouchableOpacity
    style={styles.selectBox}
    onPress={() => setOpenInvoice(!openInvoice)}
  >
    <Text style={styles.selectedText}>{invoiceNo}</Text>
    <Image source={DownArrow} style={styles.downArrow} />
  </TouchableOpacity>

  {openInvoice && (
    <View style={styles.newDropdownMenu}>
      <ScrollView style={{ maxHeight: 130 }} nestedScrollEnabled={true}>
        {InvoiceOptions.map((item, index) => {
          const isSelected = invoiceNo === item;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.newOption,
                isSelected && styles.newOptionSelected,
              ]}
              onPress={() => {
                setInvoiceNo(item);
                setOpenInvoice(false);
              }}
            >
              <Text
                style={[
                  styles.newOptionText,
                  isSelected && styles.newOptionTextSelected,
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

        {/* ========================= DUE + RECEIVED ======================== */}
        <View style={styles.row}>
          {/* Due Amount NOT editable */}
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Due Amount</Text>
             <TextInput
                     style={styles.input}
                     placeholder="₹ 5,000"
                     value={dueAmount}
                     onChangeText={setDueAmount}
                   />
          </View>

          {/* Amount Received */}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.label}>Amount Received</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={amountReceived}
              onChangeText={setAmountReceived}
            />
          </View>
        </View>

        {/* ========================= PAYMENT DATE ======================== */}
        <Text style={styles.label}>Payment Date</Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setOpenPaymentPicker(!openPaymentPicker)}
        >
          <Text>{dayjs(paymentDate).format("DD/MM/YYYY")}</Text>
          <Image source={CalendarIcon} style={styles.calendarIcon} />
        </TouchableOpacity>

        {openPaymentPicker && (
          <View style={styles.dropdownBox}>
            <DatePicker
              mode="single"
              date={paymentDate}
              onChange={(v) => {
  if (v?.date) setPaymentDate(v.date);
  setOpenPaymentPicker(false);
}}

            />
          </View>
        )}

        {/* ========================= MODE ======================== */}
      <Text style={styles.label}>Mode of Transaction</Text>
<View style={styles.selectWrapper}>
  <TouchableOpacity
    style={styles.selectBox}
    onPress={() => setOpenMode(!openMode)}
  >
    <Text style={styles.selectedText}>{modeSelected}</Text>
    <Image source={DownArrow} style={styles.downArrow} />
  </TouchableOpacity>

  {openMode && (
    <View style={styles.newDropdownMenu}>
      <ScrollView style={{ maxHeight: 130 }} nestedScrollEnabled={true}>
        {ModeOptions.map((item, index) => {
          const isSelected = modeSelected === item;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.newOption,
                isSelected && styles.newOptionSelected,
              ]}
              onPress={() => {
                setModeSelected(item);
                setOpenMode(false);
              }}
            >
              <Text
                style={[
                  styles.newOptionText,
                  isSelected && styles.newOptionTextSelected,
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


        {/* ========================= NOTES ======================== */}
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Enter Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
 <View style={styles.btnRow}>
               <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                 <Text style={styles.cancelText}>Cancel</Text>
               </TouchableOpacity>
     
               <TouchableOpacity
                 style={styles.saveBtn}
                 onPress={() => {
                   navigation.goBack();
                 }}
               >
                 <Text style={styles.saveText}> {mode === "edit" ? "Update Receipt" : " Create Receipt"}</Text>
               </TouchableOpacity>
             </View>

      </ScrollView>

      {/* ========================= BOTTOM BUTTONS ======================== */}
    
      </KeyboardAvoidingView>
    </>
  );
}

/* ============================= STYLES ============================= */

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 35,
    backgroundColor: "#fff",
  },

  backIcon: { width: 20, height: 20, marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111" },

  container: { padding: 20, backgroundColor: "#fff" },

  label: { fontSize: 15, fontWeight: "600", marginBottom: 6 },

  selectWrapper: { position: "relative", width: "100%", marginBottom: 18 },

  selectBox: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedText: { color: "#000", fontSize: 15 },

  downArrow: { width: 18, height: 18, tintColor: "#5E5E5E" },

  dropdownMenu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    zIndex: 999,
  },

  option: { padding: 14 },
  optionText: { fontSize: 15, color: "#000" },
 input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    paddingLeft:13,
    backgroundColor:"#EFF2FF"
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent: "space-between",
  },

  textarea: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    height: 110,
    marginBottom: 20,
    textAlignVertical: "top",
  },

  calendarIcon: { width: 20, height: 20, tintColor: "#555" },

  row: { flexDirection: "row", justifyContent: "space-between" },


  //updated
newDropdownMenu: {
  position: "absolute",
  top: 52,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#DDDDDD",
  borderRadius: 10,
  overflow: "hidden",   // REQUIRED
  maxHeight: 180,       // REQUIRED (scroll works ONLY if height is limited)
  zIndex: 9999,
  elevation: 10,
},


newOption: {
  paddingVertical: 12,
  paddingHorizontal: 14,
},

newOptionSelected: {
  backgroundColor: "#1D5BEE",  // BLUE HIGHLIGHT
},

newOptionText: {
  fontSize: 15,
  color: "#111",
},

newOptionTextSelected: {
  color: "#fff",
  fontWeight: "600",
},


  dropdownBox: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
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
