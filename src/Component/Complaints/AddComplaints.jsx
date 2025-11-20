import React, { useState , useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation , useRoute} from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CalendarIcon from "../../Assets/Images/calendar.png";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";

export default function AddComplaint() {
  const navigation = useNavigation();
  const route = useRoute();
  const { mode, data } = route.params || {};


  const [floor] = useState("Ground");
  const [room] = useState("10-A");
  const [bed] = useState("A1");


  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [description, setDescription] = useState("");
  const [custOpen, setCustOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [customerList, setCustomerList] = useState([
    { label: "Suresh", value: "Suresh" },
    { label: "Ravi", value: "Ravi" },
  ]);

  const [ctypeOpen, setCtypeOpen] = useState(false);
  const [complaintType, setComplaintType] = useState(null);
  const [complaintTypes, setComplaintTypes] = useState([
    { label: "EB", value: "EB" },
    { label: "AC", value: "AC" },
     { label: "Gym", value: "Gym" },
       { label: "washing machine", value: "washing machine" },
  ]);

  const handleSubmit = () => {
  if (mode === "edit") {
    console.log("Updating complaint...");
    navigation.goBack()
  } else {
    console.log("Adding new complaint...");
  }
};


  useEffect(() => {
  if (mode === "edit" && data) {
    setCustomer(data.customer);
    setComplaintType(data.complaintType);
    setDescription(data.description);
    setDate(new Date(data.date));
  }
}, [mode, data]);

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>  {mode === "edit" ? "Edit Complaint" : "Add Complaint"}</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >

        <Text style={styles.label}>Customer <Text style={{color:"red"}}>*</Text></Text>
        <View style={{ zIndex: 2000 }}>
 <DropDownPicker
  open={custOpen}
  value={customer}
  items={customerList}
  setOpen={setCustOpen}
  setValue={setCustomer}
  setItems={setCustomerList}
  placeholder="Select Customer"

  listMode="SCROLLVIEW"
  showTickIcon={false}
  closeOnTapOutside={true}
  closeAfterSelecting={true}

  selectedItemLabelStyle={{
    fontWeight: "700",
    color: "#1D5DFF",
  }}
  selectedItemContainerStyle={{
    backgroundColor: "#E8F0FE",
  }}

  style={styles.dropdownBox}
  dropDownContainerStyle={styles.dropdownContainer}
/>


        </View>

        <Text style={styles.label}>Complaint Type <Text style={{color:"red"}}>*</Text></Text>
        <View style={{ zIndex: 1000 }}>
   <DropDownPicker
  open={ctypeOpen}
  value={complaintType}
  items={complaintTypes}
  setOpen={setCtypeOpen}
  setValue={setComplaintType}
  setItems={setComplaintTypes}
  placeholder="Select Complaint Type"

  listMode="SCROLLVIEW"
  showTickIcon={false}
  closeOnTapOutside={true}
  closeAfterSelecting={true}

  selectedItemLabelStyle={{
    fontWeight: "700",
    color: "#1D5DFF",
  }}
  selectedItemContainerStyle={{
    backgroundColor: "#E8F0FE",
  }}

  style={styles.dropdownBox}
  dropDownContainerStyle={styles.dropdownContainer}
/>


        </View>

        {/* FLOOR */}
        <Text style={styles.label}>Floor <Text style={{color:"red"}}>*</Text></Text>
        <TextInput style={styles.inputBox} value={floor} editable={false} />

        {/* ROOM */}
        <Text style={styles.label}>Room <Text style={{color:"red"}}>*</Text></Text>
        <TextInput style={styles.inputBox} value={room} editable={false} />

        {/* BED */}
        <Text style={styles.label}>Bed <Text style={{color:"red"}}>*</Text></Text>
        <TextInput style={styles.inputBox} value={bed} editable={false} />

        {/* DATE */}
        <Text style={styles.label}>Complaint Date <Text style={{color:"red"}}>*</Text></Text>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowDate(true)}
        >
          <Text style={styles.inputText}>{date.toLocaleDateString()}</Text>
          <Image source={CalendarIcon} style={{ height: 20, width: 20 }} />
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={date}
            onChange={(e, selected) => {
              setShowDate(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descriptionBox}
          value={description}
          placeholder="Enter Description"
          placeholderTextColor="#C3C3C3"
          multiline
        />

        <View style={{ height: 90 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}> 
             {mode === "edit" ? "Update Complaint" : "Add Complaint"}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

/* ---------------------- STYLES ----------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backIcon: { width: 20, height: 20, marginRight: 10 },
  headerTitle: { fontSize: 17, fontWeight: "600" },

  label: { fontSize: 14, marginTop: 18, marginBottom: 6, fontWeight: "500" },

  dropdownBox: {
    borderColor: "#A8A8A8",
    borderRadius: 10,
    height: 52,

  },

  dropdownContainer: {
    borderColor: "#A8A8A8",
    borderRadius: 10,
    marginTop: 2,
  },

  inputBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
  },

  inputText: { fontSize: 15 },

  dateBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  descriptionBox: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    height: 120,
    padding: 15,
    textAlignVertical: "top",
    marginTop: 10,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },

  submitBtn: {
    backgroundColor: "#1D5DFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
