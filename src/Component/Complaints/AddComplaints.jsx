import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  BackHandler,Modal , TouchableWithoutFeedback
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CalendarIcon from "../../Assets/Images/calendar.png";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

export default function AddComplaint() {
  const navigation = useNavigation();
  const route = useRoute();
  const { mode, data } = route.params || {};

  // ---------- STATIC ROOM DATA ----------
  const [floor] = useState("Ground");
  const [room] = useState("10-A");
  const [bed] = useState("A1");

  // ---------- DATE ----------
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [openDate, setOpenDate] = useState(false);
const [complaintDate, setComplaintDate] = useState(new Date());


  // ---------- DROPDOWN STATES ----------
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const customerList = ["Suresh", "Ravi"];

  const [ctypeOpen, setCtypeOpen] = useState(false);
  const [complaintType, setComplaintType] = useState(null);
  const complaintTypes = ["EB", "AC", "Gym", "Washing Machine"];

  // ---------- OTHER ----------
  const [description, setDescription] = useState("");

  const closeAll = () => {
    setCustomerOpen(false);
    setCtypeOpen(false);
  };

  useEffect(() => {
    if (mode === "edit" && data) {
      setCustomer(data.customer);
      setComplaintType(data.complaintType);
      setDescription(data.description);
      setDate(new Date(data.date));
    }
  }, [mode, data]);

  useEffect(() => {
    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
    return () => back.remove();
  }, []);

  const handleSubmit = () => {
    console.log("Submitted");
    navigation.goBack();
  };

  // ------------------- REUSABLE DROPDOWN FIELD -------------------
  const renderDropdown = (label, selected, open, setOpen, list, onSelect) => (
    <>
      <View style={{ flexDirection: "row", marginTop: 18 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={{ color: "red" }}>*</Text>
      </View>

      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => {
          closeAll();
          setOpen(!open);
        }}
      >
        <Text style={styles.selectedText}>
          {selected || `Select ${label}`}
        </Text>
        <Text style={styles.arrow}>⌄</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownMenu}>
          <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
            {list.map((item, index) => {
              const isSelected = item === selected;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownOption,
                    isSelected && styles.dropdownOptionSelected,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
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
    </>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === "edit" ? "Edit Complaint" : "Add Complaint"}
        </Text>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        scrollEnabled={!customerOpen && !ctypeOpen} // 🔥 prevents page shaking
      >
        {/* CUSTOMER */}
        {renderDropdown(
          "Customer",
          customer,
          customerOpen,
          setCustomerOpen,
          customerList,
          setCustomer
        )}

        {/* COMPLAINT TYPE */}
        {renderDropdown(
          "Complaint Type",
          complaintType,
          ctypeOpen,
          setCtypeOpen,
          complaintTypes,
          setComplaintType
        )}

        {/* FLOOR */}
        <Text style={styles.label}>Floor *</Text>
        <TextInput style={styles.inputBox} value={floor} editable={false} />

        {/* ROOM */}
        <Text style={styles.label}>Room *</Text>
        <TextInput style={styles.inputBox} value={room} editable={false} />

        {/* BED */}
        <Text style={styles.label}>Bed *</Text>
        <TextInput style={styles.inputBox} value={bed} editable={false} />

        {/* DATE */}
      <Text style={styles.label}>Complaint Date *</Text>

<TouchableOpacity
  style={styles.dateBox}
  onPress={() => setOpenDate(true)}
>
  <Text style={styles.inputText}>
    {dayjs(complaintDate).format("DD-MM-YYYY")}
  </Text>
  <Image source={CalendarIcon} style={{ width: 20, height: 20 }} />
</TouchableOpacity>


        {/* DESCRIPTION */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descriptionBox}
          placeholder="Enter Description"
          placeholderTextColor="#C3C3C3"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>
            {mode === "edit" ? "Update Complaint" : "Add Complaint"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
  transparent
  visible={openDate}
  animationType="fade"
  onRequestClose={() => setOpenDate(false)}
>
  <View style={styles.datePickerOverlay}>
    <TouchableOpacity
      style={styles.outsideTouch}
      activeOpacity={1}
      onPress={() => setOpenDate(false)}
    />

    <View style={styles.datePickerBox}>
      <TouchableWithoutFeedback>
        <View>
          <DatePicker
            mode="single"
            date={complaintDate}
            onChange={(d) => {
              setComplaintDate(d.date);
              setOpenDate(false);
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  </View>
</Modal>

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

  header: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backIcon: { width: 20, height: 20, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "700" },

  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },

  /* Select Box */
  selectBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectedText: { fontSize: 15, color: "#000" },
  arrow: { fontSize: 18, color: "#666" },

  /* Dropdown Menu */
  dropdownMenu: {
    position: "absolute",
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#DDDDDD",
    elevation: 10,
    zIndex: 999,
    overflow: "hidden",
  },

  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  dropdownOptionSelected: {
    backgroundColor: "#1D5BEE",
  },

  optionText: { fontSize: 15, color: "#111" },

  optionTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },

  inputBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
  },

  dateBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  descriptionBox: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    marginTop: 10,
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },

  submitBtn: {
    backgroundColor: "#1D5BEE",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  datePickerOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},

outsideTouch: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},

datePickerBox: {
  width: "90%",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 12,
  elevation: 10,
  zIndex: 999,
},

});
