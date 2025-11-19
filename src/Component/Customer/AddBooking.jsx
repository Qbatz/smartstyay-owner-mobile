import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
} from "react-native";
import DirectionDownIcon from "../../Assets/Images/direction_down.png";
import CalendarIcon from "../../Assets/Images/calendar.png";
import BackIcon from "../../Assets/Images/Arrow_left.png";
import UserImage from "../../Assets/Images/User.png";

export default function AddBookingScreen({ navigation }) {
  const [bookingDate, setBookingDate] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [amount, setAmount] = useState("");

  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [bed, setBed] = useState("");

  const [openDrop, setOpenDrop] = useState("");

  const floors = ["Ground Floor", "First Floor", "Second Floor"];
  const rooms = ["101", "102", "103", "104"];
  const beds = ["A", "B", "C"];

  const openDatePicker = (setValue) => {
    const today = new Date();
    setValue(today.toLocaleDateString("en-GB"));
  };

  const Dropdown = (label, value, setValue, list, key) => (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setOpenDrop(openDrop === key ? "" : key)}
      >
        <Text style={{ fontSize: 15, color: value ? "#000" : "#999" }}>
          {value || `Select ${label}`}
        </Text>
        <Image source={DirectionDownIcon} style={styles.icon} />
      </TouchableOpacity>

      {openDrop === key && (
        <View style={styles.dropdownMenu}>
          <ScrollView>
            {list.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.dropdownItem}
                onPress={() => {
                  setValue(item);
                  setOpenDrop("");
                }}
              >
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" , paddingTop:20}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Booking </Text>

        <View style={{ width: 30 }} />
      </View>

      <View style={styles.userRow}>
        <Image source={UserImage} style={styles.userImg} />
        <Text style={styles.userName}>Rajesh</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        
        <Text style={styles.label}>Booking Date <Text style={styles.star}>*</Text></Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => openDatePicker(setBookingDate)}
        >
          <Text style={{ fontSize: 15, color: bookingDate ? "#000" : "#999" }}>
            {bookingDate || "DD/MM/YYYY"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Booking Amount <Text style={styles.star}>*</Text></Text>
        <View style={styles.inputBox}>
          <TextInput
            style={{ flex: 1, fontSize: 15 }}
            placeholder="₹500"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <Text style={styles.label}>Joining Date (Tentative) <Text style={styles.star}>*</Text></Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => openDatePicker(setJoiningDate)}
        >
          <Text style={{ fontSize: 15, color: joiningDate ? "#000" : "#999" }}>
            {joiningDate || "DD/MM/YYYY"}
          </Text>
          <Image source={CalendarIcon} style={styles.icon} />
        </TouchableOpacity>

        {Dropdown("Floor", floor, setFloor, floors, "floor")}
        {Dropdown("Room", room, setRoom, rooms, "room")}
        {Dropdown("Bed", bed, setBed, beds, "bed")}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bookBtn}>
            <Text style={styles.bookText}>Book</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "left",
    padding: 18,
  },
  backIcon: { width: 22, height: 22 },
  headerTitle: {
    flex: 1,
    // textAlign: "center",
    marginLeft:10,
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  userImg: { width: 45, height: 45, borderRadius: 25 },
  userName: { marginLeft: 12, fontSize: 16, fontWeight: "600" },

  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, marginTop: 12 },

  inputBox: {
    backgroundColor: "#F6F8FF",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  icon: { width: 20, height: 20, tintColor: "#555" },

  dropdownMenu: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    maxHeight: 150,
    marginTop: 5,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  dropdownText: { fontSize: 15, color: "#000" },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  cancelText: { color: "#000", fontSize: 15, fontWeight: "500" },

  bookBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#1E45E1",
    marginLeft: 10,
  },
  bookText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  star: {
  color: "red",
},

});
