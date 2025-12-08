import React, { useState , useEffect } from "react";
import {
   View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
 Dimensions , BackHandler
} from "react-native";
import {  useRoute} from "@react-navigation/native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import DownArrow from "../../../Assets/Images/direction-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import RemoveIcon from "../../../Assets/Images/remove-circle.png";



export default function CreateBill({navigation}) {
  const itemOptions = ["Room rent", "EB", "Others"];

    const route = useRoute();
    const { mode, data } = route.params || {};
  const [customer, setCustomer] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
//   const [invoiceDate, setInvoiceDate] = useState("");
//   const [dueDate, setDueDate] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  
  const [openUpward, setOpenUpward] = useState(false);
const [openinvoiceDatePicker, setOpenInvoiceDatePicker] = useState(false);
const [opendueDatePicker, setOpenDueDatePicker] = useState(false);  

  const [invoiceDate, setInvoiceDate] = useState(
     new Date()
  )
   const [dueDate, setDueDate] = useState(new Date());

  const [items, setItems] = useState([]);

  const selectedTypes = items.map((i) => i.type);

  const filteredOptions = itemOptions.filter(
    (op) => op === "Others" || !selectedTypes.includes(op)
  );

  const [customerOpen, setCustomerOpen] = useState(false);
const [customerSelected, setCustomerSelected] = useState("");
const CustomerOptions = ["Suresh", "Kumar", "Ruban", "Rajesh"];

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

        //  this is dummy data store for edit 
        //  useEffect(() => {
        //   if (mode === "edit" && data) {
        //     setCustomer(data?.customer);
        //     setInvoiceNo(data?.invoiceno);
        //     setInvoiceDate(data?.invoice_date);
        //     setDueDate(new Date(data?.dueDate));
        //   }
        // }, [mode, data]); 

          
       

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
                        <Text style={styles.headerTitle}>  {mode === "edit" ? "Edit Bill" : " Create New Bill"} </Text>
                      </View>



    <ScrollView style={styles.container}>
    
  <Text style={styles.label}>Customer *</Text>

<TouchableOpacity
  style={styles.customerdropdownBox}
  onPress={() => setCustomerOpen(!customerOpen)}
>
  <Text style={{ color: customerSelected ? "#000" : "#9CA3AF" }}>
    {customerSelected || "Select Customer"}
  </Text>

  <Image source={DownArrow} style={styles.arrowIcon} />
</TouchableOpacity>

{customerOpen && (
  <View style={styles.customerDropdownMenu}>
    <ScrollView style={{ maxHeight: 130 }}>
      {CustomerOptions.map((name, index) => {
        const isSelected = name === customerSelected;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.customerOption,
              isSelected && styles.customerOptionSelected,
            ]}
            onPress={() => {
              setCustomerSelected(name);
              setCustomerOpen(false);
            }}
          >
            <Text
              style={[
                styles.customerOptionText,
                isSelected && styles.customerOptionTextSelected,
              ]}
            >
              {name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
)}


      <Text style={styles.label}>Invoice No</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Invoice Number"
        value={invoiceNo}
        onChangeText={setInvoiceNo}
      />

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

        {openinvoiceDatePicker && (
          <View style={styles.dropdownBox}>
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

        {opendueDatePicker && (
          <View style={styles.dropdownBox}>
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

   <Text style={styles.label}>Items</Text>

<TouchableOpacity
  style={styles.ItemdropdownBox}
  onPress={() => setDropdownOpen(!dropdownOpen)}
>
  <Text style={{ color: "#9CA3AF" }}>
    Select Item Type
  </Text>
</TouchableOpacity>

{dropdownOpen && (
  <View style={styles.itemDropdownMenu}>
    <ScrollView style={{ maxHeight: 180 }}>
      {filteredOptions.map((op, index) => {
        const isSelected = false; // optional highlight, since it does not stay selected in box

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.itemOption,
              isSelected && styles.itemOptionSelected,
            ]}
            onPress={() => handleSelectItem(op)}
          >
            <Text
              style={[
                styles.itemOptionText,
                isSelected && styles.itemOptionTextSelected,
              ]}
            >
              {op}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
)}


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
                 <Text style={styles.saveText}> {mode === "edit" ? "Update Bill" : " Create Bill"}</Text>
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

itemDropdownMenu: {
  marginTop: 4,
  marginBottom:8,
  borderWidth: 1,
  borderColor: "#DDDDDD",
  borderRadius: 10,
  backgroundColor: "#fff",
  overflow: "hidden",
},

itemOption: {
  paddingVertical: 10,
  paddingHorizontal: 14,
},

itemOptionSelected: {
  backgroundColor: "#1D5BEE",   
},

itemOptionText: {
  fontSize: 15,
  color: "#111",
},

itemOptionTextSelected: {
  color: "#fff",
  fontWeight: "600",
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
  arrowIcon: {
  width: 18,
  height: 18,
  tintColor: "#6A6A6A",
},
dropdownMenu: {
  position: "absolute",
  left: 0,
  right: 0,
  top: "17%",
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  zIndex: 999,
  elevation: 10,
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

    customerdropdownBox: {
  borderWidth: 1,
  borderColor: "#D4D4D4",
  borderRadius: 10,
  padding: 14,
  marginTop: 6,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

customerDropdownMenu: {
  marginTop: 4,
  borderWidth: 1,
  borderColor: "#DDDDDD",
  borderRadius: 10,
  backgroundColor: "#fff",
  overflow: "hidden",
},

customerOption: {
  paddingVertical: 10,
  paddingHorizontal: 14,
},

customerOptionSelected: {
  backgroundColor: "#1D5BEE",   // SAME BLUE HIGHLIGHT
},

customerOptionText: {
  fontSize: 15,
  color: "#111",
},

customerOptionTextSelected: {
  color: "#fff",
  fontWeight: "600",
},

  
    calendarIcon: { width: 22, height: 22, tintColor: "#676767" },
  
    /* Inline dropdown box (full width under field) */
    dropdownBox: {
        borderWidth: 1,
  borderColor: "#D4D4D4",
  borderRadius: 10,
  padding: 14,
  marginTop: 6,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
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
