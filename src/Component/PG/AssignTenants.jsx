import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,TouchableWithoutFeedback
} from "react-native";
import Delete from "../../Assets/Images/trash.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";


export default function AssignTenant({navigation,route}) {
      const { roomNo, bedId } = route.params || {};


    
  const [activeTab, setActiveTab] = useState("Booking");
    const [openDatePicker, setOpenDatePicker] = useState(false);
      const [purchaseDate, setPurchaseDate] = useState(dayjs());

  const [tenant, setTenant] = useState("");
  const [stayType, setStayType] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [bookingAmount, setBookingAmount] = useState("");
  const [rentalAmount, setRentalAmount] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");

 const [extraCharges, setExtraCharges] = useState([]);
const [openDropdownId, setOpenDropdownId] = useState(null); 
const [disabledTypes, setDisabledTypes] = useState([]); 
 const TenantsName = ["priya", "Allwin", "Mathu", "Arputha", "Hepzi"];
    const [TenantsOpen, setTenantsopen] = useState(false);
    const [TenantsSelected, setTenantsSelected] = useState("Select a Vendor");

const TYPE_OPTIONS = ["Maintenance", "Others"];
 // store selected types

const addCharge = () => {
  setExtraCharges(prev => [
    ...prev,
    { id: Date.now(), type: "", title: "", amount: "" }
  ]);
};

const removeCharge = (id, type) => {
  setExtraCharges(prev => prev.filter(i => i.id !== id));

  if (type === "Maintenance") {
    setDisabledTypes([]); // enable again
  }
};



const selectType = (id, type) => {
  setExtraCharges(prev =>
    prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "" } : i))
  );

  if (type === "Maintenance") {
    setDisabledTypes(["Maintenance"]); // disable everywhere
  }

  if (type === "Others") {
    // Others should NEVER disable Maintenance
  }

  setOpenDropdownId(null);
};


const updateTitle = (id, title) => {
  setExtraCharges(prev =>
    prev.map(i => (i.id === id ? { ...i, title } : i))
  );
};

const updateAmount = (id, amount) => {
  setExtraCharges(prev =>
    prev.map(i => (i.id === id ? { ...i, amount } : i))
  );
};



  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>← Assign Tenant</Text>
      </TouchableOpacity>

      <Text style={styles.roomText}>Room No {roomNo} | Bed {bedId}</Text>

      {/* TABS */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Booking" && styles.tabActive]}
          onPress={() => setActiveTab("Booking")}
        >
          <Text style={[styles.tabText, activeTab === "Booking" && styles.tabTextActive]}>
            Booking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "CheckIn" && styles.tabActive]}
          onPress={() => setActiveTab("CheckIn")}
        >
          <Text style={[styles.tabText, activeTab === "CheckIn" && styles.tabTextActive]}>
            Check In
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ marginTop: 10 }} showsVerticalScrollIndicator={false}>

    
        
         <Text style={styles.label}>Select Tenant</Text>
        
                            <View style={{ position: "relative" }}>
                                <TouchableOpacity
                                    style={styles.select}
                                    onPress={() => setTenantsopen(!TenantsOpen)}
                                    activeOpacity={0.9}
                                >
                                    <Text style={styles.selectText}>{TenantsSelected}</Text>
                                    <Image source={DownArrow} style={styles.arrow} />
                                </TouchableOpacity>
        
                                {TenantsOpen && (
                                    <View style={styles.dropdownMenuone}>
                                        <ScrollView style={{ maxHeight: 160 }}>
                                            {TenantsName.map((v, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.option}
                                                    onPress={() => {
                                                        setTenantsSelected(v);
                                                        setTenantsopen(false);
                                                    }}
                                                >
                                                    <Text style={styles.optionText}>{v}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

        {/* Booking Date (ONLY for Booking tab) */}
        {activeTab === "Booking" && (
          <>
            <Text style={styles.label}>Booking Date</Text>
            <TouchableOpacity style={styles.dateBox}   onPress={() => setOpenDatePicker(true)}>
              <Text style={styles.placeholder}>
                                         {purchaseDate ? dayjs(purchaseDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                                     </Text>
              <Image
                source={require("../../Assets/Images/calendar.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

            <Text style={styles.label}>Booking Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={bookingAmount}
              onChangeText={setBookingAmount}
            />
            <Text style={styles.label}>Joining Date *</Text>
        <TouchableOpacity style={styles.dateBox}>
          <Text>{joiningDate || "Pick a Date"}</Text>
          <Image
            source={require("../../Assets/Images/calendar.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

            {openDatePicker && (
                <View style={styles.sheetOverlay}>
                    <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
                        <View style={{ flex: 1 }} />
                    </TouchableWithoutFeedback>

                    <View style={styles.datePickerBox}>
                        <DatePicker
                            mode="single"
                            date={purchaseDate}
                            onChange={(p) => {
                                setPurchaseDate(p.date || dayjs());
                                setOpenDatePicker(false);
                            }}
                        />
                    </View>
                </View>
            )}
          </>

        )}

        {/* Check-in Only Fields */}
        {activeTab === "CheckIn" && (
          <>
            <Text style={styles.label}>Stay Type</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text>{stayType || "Select Type"}</Text>
              <Text>⌄</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Rental Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={rentalAmount}
              onChangeText={setRentalAmount}
            />

            <Text style={styles.label}>Advance Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={advanceAmount}
              onChangeText={setAdvanceAmount}
            />
            <Text style={styles.label}>Joining Date *</Text>
        <TouchableOpacity style={styles.dateBox}>
          <Text>{joiningDate || "Pick a Date"}</Text>
          <Image
            source={require("../../Assets/Images/calendar.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

          </>
        )}

     
        

        {/* Non-Refundable Amount (Check-In only) */}
        {activeTab === "CheckIn" && (
          <>
            <View style={styles.extraHeader}>
              <Text style={styles.label}>Non Refundable Amount</Text>

              <TouchableOpacity style={styles.addBtn} onPress={addCharge}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Add</Text>
              </TouchableOpacity>
            </View>
{extraCharges.map((item) => (
  <View
    key={item.id}
    style={{
      marginTop: 12,
      position: "relative",
      zIndex: openDropdownId === item.id ? 999 : 1,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>

      {/* SELECT BOX (when type is empty) */}
      {item.type === "" && (
        <TouchableOpacity
          style={styles.leftBox}
          onPress={() =>
            setOpenDropdownId(openDropdownId === item.id ? null : item.id)
          }
        >
          <Text>Select...</Text>
      <Image source={DownArrow} style={styles.arrow} />
        </TouchableOpacity>
      )}

     
      {item.type === "Others" && (
        <TextInput
          style={styles.leftBox}
          placeholder="Enter custom reason"
          value={item.title}
          onChangeText={(txt) => updateTitle(item.id, txt)}
        />
      )}

    
      {item.type === "Maintenance" && (
        <View style={[styles.leftBox, { backgroundColor: "#eee" }]}>
          <Text>Maintenance</Text>
        </View>
      )}

   
      {item.type !== "" && (
        <TextInput
          style={styles.rightBox}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={item.amount}
          onChangeText={(txt) => updateAmount(item.id, txt)}
        />
      )}

    
      <TouchableOpacity onPress={() => removeCharge(item.id, item.type)}>
     
        <Image source={Delete}  style={styles.DeleteImg}/>
      </TouchableOpacity>
    </View>

  
    {openDropdownId === item.id && item.type === "" && (
      <View style={styles.dropdownMenu}>
      {TYPE_OPTIONS.map((t) => {
  const maintenanceDisabled =
    disabledTypes.includes("Maintenance") && t === "Maintenance";


  if (maintenanceDisabled) {
    return (
      <View key={t} style={{ opacity: 0.4 }}>
        <Text style={styles.dropdownItem}>{t}</Text>
      </View>
    );
  }

  // Others always allowed
  return (
    <TouchableOpacity
      key={t}
      onPress={() => selectType(item.id, t)}
    >
      <Text style={styles.dropdownItem}>{t}</Text>
    </TouchableOpacity>
  );
})}

      </View>
    )}
  </View>
))}








          </>
        )}

        {/* BUTTONS */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitText}>
              {activeTab === "Booking" ? "Book" : "Check In"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  backArrow: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },

  roomText: {
    fontSize: 13,
    color: "#777",
    marginBottom: 15,
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#E9ECF7",
    padding: 4,
    borderRadius: 10,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#1D5DFF",
  },
  tabText: {
    textAlign: "center",
    fontSize: 14,
    color: "#777",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  label: {
    marginTop: 18,
    marginBottom: 5,
    fontWeight: "600",
    color: "#444",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

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

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },

  icon: { width: 20, height: 20 },

  extraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  addBtn: {
    backgroundColor: "#2D6CDF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },

  extraRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },

  extraInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
  },

  removeIcon: {
    fontSize: 20,
    color: "red",
    marginLeft: 5,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  cancelBtn: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 14,
    borderRadius: 10,
  },

  cancelText: {
    textAlign: "center",
    color: "#333",
  },

  submitBtn: {
    width: "48%",
    backgroundColor: "#1D5DFF",
    paddingVertical: 14,
    borderRadius: 10,
  },

  submitText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
  },
    selectBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: 300,
    flexDirection: "row",
    justifyContent: "space-between",
  },

titleInput: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 10,
  marginLeft: 10,
},

amountInput: {
  width: 100,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 10,
  marginLeft: 10,
},

  typeBox: {

  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 12,
  flexDirection: "row",
  justifyContent: "space-between",
  width:300
},

titleBox: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 12,
  marginLeft: 10,
},

amountBox: {
  width: 90,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 12,
  marginLeft: 10,
},
 arrow: { width: 18, height: 18, tintColor: "#444" },

dropdownMenu: {
  marginTop: 6,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  
},

dropdownItem: {
  padding: 12,
  fontSize: 14,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},
typeBoxDisabled: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 12,
  width: 300,
  backgroundColor: "#eee",
},
leftBox: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 12,
  marginRight: 10,
  backgroundColor: "#fff",
  flexDirection: "row",
  justifyContent: "space-between",
},

rightBox: {
  width: 110,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  padding: 12,
},
DeleteImg:{
    width:30,
    height:30,
    marginLeft:20
},
 dropdownMenuone: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        zIndex: 999,
        elevation: 10,
    },

    option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    optionText: {
        fontSize: 15,
        color: "#000",
    },
     selectText: { color: "#555" },
      select: {
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
     option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    optionText: {
        fontSize: 15,
        color: "#000",
    },


    datePickerBox: {
        backgroundColor: "#fff",
        width: "80%",
   borderColor: "#DCDCDC",  
        borderRadius: 30,
       padding:5,
        marginBottom: 120,
         borderWidth: 0.5,   
    },

    fullDateOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 10,

        justifyContent: "flex-end",
        zIndex: 9999,
        elevation: 20,
    },

 datePickerPopup: {
    borderColor: "#DCDCDC",      // ✔ correct
    borderWidth: 1,              // ✔ border visible
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    width: "100%",
  
},
    sheetOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: "flex-end",
      
    },


});

