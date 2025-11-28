import React, { useState } from "react";
import {
   View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Modal, Animated ,
  PanResponder,
  BackHandler , Dimensions
} from "react-native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import CalendarBlueIcon from "../../../Assets/Images/calendar_blue.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import RemoveIcon from "../../../Assets/Images/remove-circle.png";



export default function CreateBill({navigation}) {
  const itemOptions = ["Room rent", "EB", "Others"];

  const [customer, setCustomer] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
//   const [invoiceDate, setInvoiceDate] = useState("");
//   const [dueDate, setDueDate] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
const [openinvoiceDatePicker, setOpenInvoiceDatePicker] = useState(false);
const [opendueDatePicker, setOpenDueDatePicker] = useState(false);  

  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");
  const [invoiceDate, setInvoiceDate] = useState(
     new Date()
  )
   const [dueDate, setDueDate] = useState(new Date());

  const [items, setItems] = useState([]);

  const selectedTypes = items.map((i) => i.type);

  const filteredOptions = itemOptions.filter(
    (op) => op === "Others" || !selectedTypes.includes(op)
  );

      const CustomerOptions = [
        "Suresh",
        "Kumar",
        "Ruban",
        "Rajesh",
      ];
   
        const [customerSelected, setCustomerSelected] = useState(CustomerOptions[0]);
        const [customeDropdownVisible, setCustomerDropdownVisible] = useState(false);

  const handleSelectItem = (type) => {
    let newCard;

    if (type === "Room rent") {
      newCard = { type, description: "Room rent", amount: "" };
    } else if (type === "EB") {
      newCard = { type, description: "EB", amount: "" };
    } else {
      newCard = { type, description: "", amount: "" };
    }

    setItems([...items, newCard]);
    setDropdownOpen(false);
  };

  const updateCard = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const removeCard = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };


    const toggleAmountDropdown = () => {
    setCustomerDropdownVisible((v) => !v);
  };

  return (
<>
 <View style={styles.topHeader}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                          <Image source={ArrowLeft} style={styles.backIcon} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>  Create New Bill</Text>
                      </View>



    <ScrollView style={styles.container}>
    
      {/* CUSTOMER */}
      <Text style={styles.label}>Customer</Text>
     <View
                       style={styles.selectWrapper}
                       onLayout={(event) => {
                         const { y, height } = event.nativeEvent.layout;
                         const screenHeight = Dimensions.get("window").height;
                         const bottomSpace = screenHeight - (y + height);
         
                         setOpenUpward(bottomSpace < 250);
                       }}
                     >
                       <TouchableOpacity style={styles.selectBox} onPress={toggleAmountDropdown}>
                         <Text style={styles.selectedText}>{customerSelected}</Text>
                         <Image source={DownArrow} style={styles.downArrow} />
                       </TouchableOpacity>
         
                       {customeDropdownVisible && (
                         <View style={[styles.dropdownMenu, openUpward ? { bottom: 58 } : { top: 58 }]}>
                           <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled showsVerticalScrollIndicator={true}>
                             {CustomerOptions.map((opt) => (
                               <TouchableOpacity key={opt} style={styles.option}
                                 onPress={() => {
                                   setCustomerSelected(opt);
                                   setCustomerDropdownVisible(false);
                                 }}
                               >
                                 <Text style={styles.optionText}>{opt}</Text>
                               </TouchableOpacity>
                             ))}
                           </ScrollView>
                         </View>
                       )}
                     </View>

      {/* INVOICE NO */}
      <Text style={styles.label}>Invoice No</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Invoice Number"
        value={invoiceNo}
        onChangeText={setInvoiceNo}
      />

      {/* INVOICE DATE */}
      <Text style={styles.label}>Invoice Date</Text>
          <TouchableOpacity
          style={styles.inputBox}
          onPress={() => {
            setOpenInvoiceDatePicker(!openinvoiceDatePicker);
          }}
        >
          <Text style={styles.inputText}>{dayjs(invoiceDate).format("DD/MM/YYYY")}</Text>
          <Image source={CalendarIcon} style={styles.calendarIcon} />
        </TouchableOpacity>

        {/* Date picker inline under the field (Option B) */}
        {openinvoiceDatePicker && (
          <View style={styles.dropdownBox}>
            {/* DatePicker UI rendered inline */}
            <DatePicker
              mode="single"
              date={invoiceDate}
              onChange={(v) => {
                setInvoiceDate(v.date || new Date());
                setOpenInvoiceDatePicker(false);
              }}
              style={{ width: Platform.OS === "ios" ? 320 : "100%" }}
            />
          </View>
        )}


      {/* DUE DATE */}
      <Text style={styles.label}>Due Date</Text>
         <TouchableOpacity
          style={styles.inputBox}
          onPress={() => {
            setOpenDueDatePicker(!opendueDatePicker);
          }}
        >
          <Text style={styles.inputText}>{dayjs(dueDate).format("DD/MM/YYYY")}</Text>
          <Image source={CalendarIcon} style={styles.calendarIcon} />
        </TouchableOpacity>

        {/* Date picker inline under the field (Option B) */}
        {opendueDatePicker && (
          <View style={styles.dropdownBox}>
            {/* DatePicker UI rendered inline */}
            <DatePicker
              mode="single"
              date={dueDate}
              onChange={(v) => {
                setDueDate(v.date || new Date());
                setOpenDueDatePicker(false);
              }}
              style={{ width: Platform.OS === "ios" ? 320 : "100%" }}
            />
          </View>
        )}

      {/* ITEMS */}
      <Text style={styles.label}>Items</Text>
      <TouchableOpacity
        style={styles.ItemdropdownBox}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <Text style={styles.placeholder}>Select Item Type</Text>
      </TouchableOpacity>

      {dropdownOpen && (
        <View style={styles.dropdownList}>
          {filteredOptions.map((op) => (
            <TouchableOpacity
              key={op}
              style={styles.dropdownOption}
              onPress={() => handleSelectItem(op)}
            >
              <Text style={{ fontSize: 15 }}>{op}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ITEM CARDS */}
      {items.map((item, index) => (
        <View key={index} style={styles.itemCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIndex}>
              {String(index + 1).padStart(2, "0")}
            </Text>
            <TouchableOpacity onPress={() => removeCard(index)}>
              <Image source={RemoveIcon} style={{height:18 , width:18}}/>
            </TouchableOpacity>
          </View>

          <Text style={styles.smallLabel}>Description</Text>
          <TextInput
            style={styles.input}
            value={item.description}
            editable={item.type === "Others"}
            onChangeText={(txt) => updateCard(index, "description", txt)}
          />

          <Text style={styles.smallLabel}>Total amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={item.amount}
            onChangeText={(txt) => updateCard(index, "amount", txt)}
          />
        </View>
      ))}

      {/* BOTTOM BUTTONS */}
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
                 <Text style={styles.saveText}> Create Bill</Text>
               </TouchableOpacity>
             </View>

      <View style={{ height: 40 }} />
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
     topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 35,
     backgroundColor:'white'
    // marginBottom: 8,
  },

  backIcon: { width: 20, height: 20, marginRight: 12, tintColor: "#222" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111" },
  container: { padding: 20 , backgroundColor:'white'},
  header: { fontSize: 22, fontWeight: "700", marginBottom: 25 },

  label: { fontSize: 15, marginBottom: 6 },

  ItemdropdownBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    justifyContent: "center",
  },
  placeholder: { color: "#777" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
  },

  dateField: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  calendarIcon: { fontSize: 18, paddingLeft: 10 },

  dropdownList: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  itemCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardIndex: {
    color: "#4A63FF",
    fontWeight: "700",
    fontSize: 16,
  },
  deleteBtn: { fontSize: 22, color: "red" },
  smallLabel: { fontWeight: "600", marginTop: 10, marginBottom: 5 },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelBtn: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelText: { fontSize: 16, color: "#555" },

  createBtn: {
    backgroundColor: "#2E5BFF",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  createText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    selectWrapper: { position: "relative", width: "100%", marginTop: 8 },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 50,   // 🔥 consistent height
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  selectedText: { fontSize: 15, color: "#000", flex: 1 },
  downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },
  dropdownMenu: {
  position: "absolute",
  top: 52,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  elevation: 7,
  zIndex: 9999,
  maxHeight: 150,    
  overflow: "hidden", 
},
 option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },
  
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
