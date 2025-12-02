import React, { useState , useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,BackHandler,
} from "react-native";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

export default function AddTransaction({ navigation }) {

  // ---------- DATE ----------
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(new Date());

  // ---------- DROPDOWN STATES ----------
  const [transactionType, setTransactionType] = useState("Expense");
  const [transactionTypeOpen, setTransactionTypeOpen] = useState(false);

  const [category, setCategory] = useState("Food");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [fromAcc, setFromAcc] = useState("Cash");
  const [fromAccOpen, setFromAccOpen] = useState(false);

  const [toAcc, setToAcc] = useState("HDFC XXXX1234");
  const [toAccOpen, setToAccOpen] = useState(false);

  // ---------- OTHER DATA ----------
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // ---------- OPTIONS ----------
  const transactionOptions = ["Expense", "Income", "Transfer"];
  const categoryOptions = ["Food", "Travel", "Shopping", "Bills", "Recharge", "Other"];
  const accounts = ["Cash", "HDFC XXXX1234", "SBI XXXX5678", "Wallet", "Credit Card"];

  // Close all dropdowns
  const closeAll = () => {
    setTransactionTypeOpen(false);
    setCategoryOpen(false);
    setFromAccOpen(false);
    setToAccOpen(false);
  };

      useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          navigation.goBack();  
          return true;
        }
      );
    
      return () => backHandler.remove();
    }, []);

  // Dropdown box UI (shared inside same file)
  const renderSelect = (label, selected, open, setOpen, list, onSelect) => (
    
   <>
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom:5 }}>
    <Text style={styles.label}>{label.replace("*", "")}</Text>
    {label.includes("*") && <Text style={{ color: "red" }}>*</Text>}
  </View>


      <View style={{ position: "relative" }}>
        <TouchableOpacity
          style={styles.select}
          activeOpacity={0.9}
          onPress={() => {
            closeAll();
            setOpen(!open);
          }}
        >
          <Text style={styles.selectText}>{selected}</Text>
          <Text style={styles.caret}>⌄</Text>
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdownMenu}>
            <ScrollView style={{ maxHeight: 160 }}>
              {list.map((v, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.option}
                  onPress={() => {
                    onSelect(v);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{v}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );

  return (
    <>
      <SafeAreaView style={styles.safe}>

        {/* HEADER */}
       

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
            style={styles.dateBox}
            onPress={() => {
              closeAll();
              setOpenDatePicker(true);
            }}
          >
            <Text style={styles.placeholder}>
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
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4, marginBottom: 5 }}>
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

          {/* Buttons */}
         <View style={styles.btnRow}>
           <TouchableOpacity
             style={styles.cancelBtn}
             onPress={() => navigation.goBack()}
           >
             <Text style={styles.cancelText}>Cancel</Text>
           </TouchableOpacity>
         
           <TouchableOpacity style={styles.addBtn2}>
             <Text style={styles.addBtnText}>Add</Text>
           </TouchableOpacity>
         </View>

        </ScrollView>
      </SafeAreaView>

      {/* DATE PICKER OVERLAY — header blur ஆகாது */}
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
  safe: { flex: 1, backgroundColor: "#fff", paddingTop: 20 },

  topHeader: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",

  },

  backIcon: { width: 18, height: 18, marginRight: 10, tintColor: "#222" },

  headerTitle: { fontSize: 18, fontWeight: "700" },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20, 
    backgroundColor: "#fff",
    flex: 1,
  },

  label: {
    fontSize: 14,
    color: "#000",
    marginTop: 12,
    marginBottom: 5,
  },

  select: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  selectText: { color: "#222" },
  caret: { fontSize: 16, color: "#666" },

  dropdownMenu: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 999,
    elevation: 15,
  },

  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

  dateBox: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  placeholder: { color: "#555" },
  calendarIcon: { width: 20, height: 20, tintColor: "#444" },

  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 15,
    fontSize: 15,
    color: "#000",
  },

 btnRow: {
    display:'flex',
  flexDirection: "row",
//   alignItems: "flex-end",
  justifyContent: "flex-end",
  marginTop: 40,
  paddingHorizontal: 12,
},

cancelBtn: {
  paddingVertical: 12,
  paddingHorizontal: 32,
},

cancelText: {
  color: "#6B7280",
  fontSize: 15,
  fontWeight: "500",
},

addBtn2: {
  backgroundColor: "#2B6CF6",
  paddingVertical: 12,
  paddingHorizontal: 40,
  borderRadius: 10,
},

addBtnText: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
},

  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom:30,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    zIndex: 800, 
  },

 datePickerBox: {
  backgroundColor: "#fff",
  width: "90%",
  borderRadius: 16,
  paddingVertical: 10,
  paddingHorizontal: 10,
  alignSelf: "center",
  marginBottom: 140,
},

});
