import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  SafeAreaView,
  ScrollView,
  Platform,
  Modal
} from "react-native";

import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import CalendarIcon from "../../Assets/Images/calendar.png";
import DownArrow from "../../Assets/Images/direction_down.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";


export default function AddWalkin({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [showDate, setShowDate] = useState(false);
  const [walkinDate, setWalkinDate] = useState("");

  const [openRequestPicker, setOpenRequestPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDate(false); 
    }

    if (selectedDate) {
      const d = selectedDate;
      const formatted = `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`;
      setWalkinDate(formatted);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Walkin</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>
            First Name <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput
            placeholder="Enter First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            placeholder="Enter Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />

          <Text style={styles.label}>
            Mobile Number <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={styles.mobileRow}>
            <TouchableOpacity style={styles.countryCode}>
              <Text style={{ fontSize: 14 }}>+91</Text>
              <Image source={DownArrow} style={{ width: 10, height: 10 }} />
            </TouchableOpacity>

            <TextInput
              placeholder="Enter Mobile Number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="numeric"
              style={[styles.input, { flex: 1 }]}
            />
          </View>

          <Text style={styles.label}>Email ID</Text>
          <TextInput
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Walkin Date</Text>

            <TouchableOpacity
                                          style={styles.inputBox}
                                          onPress={() => setShowDate(true)}
                                      >
                                          <Text style={styles.textInput}>
                                              {walkinDate || "DD/MM/YYYY"}
                                          </Text>
                                          <Image source={CalendarIcon} style={styles.calendarIcon} />
                                      </TouchableOpacity>

      
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

        </View>
      </ScrollView>
      
            <Modal visible={showDate} transparent animationType="fade">
                    <View style={styles.calendarOverlay}>
                        <View style={styles.calendarBox}>
                            <DatePicker
                                mode="single"
                                date={dayjs()}
                                onChange={(p) => {
                                    setWalkinDate(dayjs(p.date).format("DD/MM/YYYY"));
                                    setShowDate(false);
                                }}
                            />
                        </View>
                    </View>
                </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },

  backIcon: { width: 20, height: 20, marginRight: 10 },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  formContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },

  label: {
    color: "#4B4B4B",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
     inputBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 48,
    },
    textInput: { flex: 1, fontSize: 14, color: "#111" },

  mobileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  countryCode: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  /* DATE ROW */
  dateRow: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  calendarIcon: { width: 20, height: 20 },
   calendarOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 20,
    },
    calendarBox: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 10,
    },

  /* BUTTONS */
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

});
