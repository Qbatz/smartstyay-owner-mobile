import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";


export default function AssignTenant({navigation,route}) {
      const { roomNo, bedId } = route.params || {};


    
  const [activeTab, setActiveTab] = useState("Booking");

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
    prev.map(i => (i.id === id ? { ...i, type } : i))
  );

  if (type === "Maintenance") {
    setDisabledTypes(["Maintenance"]);
  }

  setOpenDropdownId(null);
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

        {/* DROPDOWNS & INPUTS SHARED IN BOTH TABS */}
        <Text style={styles.label}>Select Tenant</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text>{tenant || "Select Tenant"}</Text>
          <Text>⌄</Text>
        </TouchableOpacity>

        {/* Booking Date (ONLY for Booking tab) */}
        {activeTab === "Booking" && (
          <>
            <Text style={styles.label}>Booking Date</Text>
            <TouchableOpacity style={styles.dateBox}>
              <Text>{bookingDate || "Pick a Date"}</Text>
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

          </>
        )}

        {/* Common Joining Date */}
        <Text style={styles.label}>Joining Date *</Text>
        <TouchableOpacity style={styles.dateBox}>
          <Text>{joiningDate || "Pick a Date"}</Text>
          <Image
            source={require("../../Assets/Images/calendar.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

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
  <View key={item.id} style={{ marginTop: 12 }}>

  
   <View style={{ flexDirection: "row", alignItems: "center" }}>

  {/* TYPE DROPDOWN – show only if not Others */}
  {item.type !== "Others" && (
    <TouchableOpacity
      style={styles.selectBox}
      onPress={() =>
        setOpenDropdownId(openDropdownId === item.id ? null : item.id)
      }
    >
      <Text>{item.type || "Select"}</Text>
      <Text>⌄</Text>
    </TouchableOpacity>
  )}

  {/* IF OTHERS SELECTED → SHOW TITLE + AMOUNT */}
  {item.type === "Others" && (
    <>
      <TextInput
        placeholder="Enter Title"
        value={item.title}
        onChangeText={(txt) => {
          setExtraCharges(prev =>
            prev.map(i => (i.id === item.id ? { ...i, title: txt } : i))
          );
        }}
        style={[styles.titleInput, { marginLeft: 10 }]}
      />

      <TextInput
        placeholder="₹"
        value={item.amount}
        keyboardType="numeric"
        onChangeText={(txt) => {
          setExtraCharges(prev =>
            prev.map(i => (i.id === item.id ? { ...i, amount: txt } : i))
          );
        }}
        style={[styles.amountInput, { marginLeft: 10 }]}
      />
    </>
  )}

  {/* IF MAINTENANCE → ONLY AMOUNT */}
  {item.type === "Maintenance" && (
    <TextInput
      placeholder="₹"
      value={item.amount}
      keyboardType="numeric"
      onChangeText={(txt) => {
        setExtraCharges(prev =>
          prev.map(i => (i.id === item.id ? { ...i, amount: txt } : i))
        );
      }}
      style={[styles.amountInput, { marginLeft: 10 }]}
    />
  )}

  {/* REMOVE */}
  <TouchableOpacity onPress={() => removeCharge(item.id, item.type)}>
    <Text style={{ fontSize: 18, color: "red", marginLeft: 5 }}>✕</Text>
  </TouchableOpacity>

</View>


    {/* ⬇⬇⬇ THIS IS WHERE YOUR DROPDOWN CODE GOES ⬇⬇⬇ */}
    {openDropdownId === item.id && (
      <View style={styles.dropdownMenu}>
        
        {/* PUT YOUR CODE HERE */}
        {TYPE_OPTIONS.map((t) => {
          let disabled = disabledTypes.includes(t);

          if (disabled && t !== item.type) return null;

          return (
            <TouchableOpacity key={t} onPress={() => selectType(item.id, t)}>
              <Text style={styles.dropdownItem}>{t}</Text>
            </TouchableOpacity>
          );
        })}

      </View>
    )}
    {/* ⬆⬆⬆ END DROPDOWN CODE ⬆⬆⬆ */}

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
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
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
    width: 120,
    flexDirection: "row",
    justifyContent: "space-between",
  },

 titleInput: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  padding: 10,
},

amountInput: {
  width: 80,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  padding: 10,
  marginLeft: 10,
},


  dropdownMenu: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 6,
    width: 120,
    paddingVertical: 4,
  },

  dropdownItem: {
    padding: 10,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

