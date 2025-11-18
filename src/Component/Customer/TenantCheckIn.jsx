import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import AddCircle from "../../Assets/Images/add-circle.png";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import RemoveIcon from "../../Assets/Images/remove.png";

export default function TenantCheckIn({ navigation }) {
  const [tab, setTab] = useState("long");

  const floors = ["Ground Floor", "First Floor", "Second Floor"];
  const rooms = {
    "Ground Floor": ["Room No 1", "Room No 2"],
    "First Floor": ["101", "102", "103"],
    "Second Floor": ["201", "202"],
  };
  const beds = {
    "Room No 1": ["001", "002"],
    "Room No 2": ["003", "004"],
    "101": ["A", "B"],
    "102": ["C"],
    "201": ["X"],
  };

  const [selectedFloor, setSelectedFloor] = useState(floors[0]);
  const [selectedRoom, setSelectedRoom] = useState(rooms[floors[0]][0]);
  const [selectedBed, setSelectedBed] = useState(beds[rooms[floors[0]][0]][0]);

  const [joiningDate, setJoiningDate] = useState(new Date());
  const [showJoiningPicker, setShowJoiningPicker] = useState(false);

  const [advanceAmount, setAdvanceAmount] = useState("12000");
  const [rentalAmount, setRentalAmount] = useState("5000");

  const [checkinDate, setCheckinDate] = useState(new Date());
  const [showCheckinPicker, setShowCheckinPicker] = useState(false);
  const [checkinTime, setCheckinTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [checkoutDate, setCheckoutDate] = useState(new Date());
  const [showCheckoutPicker, setShowCheckoutPicker] = useState(false);

  const [amountPerDay, setAmountPerDay] = useState("500");

  const billingModeOptions = ["Check-out Date", "Monthly", "Daily"];
  const [billingMode, setBillingMode] = useState(billingModeOptions[0]);


const [maintenanceAmount, setMaintenanceAmount] = useState("");
const [nonRefundables, setNonRefundables] = useState([]);

const addNonRefundable = () => {
  setNonRefundables(prev => [
    ...prev,
    { reason: "", amount: "" }
  ]);
};

const removeNonRefundable = (index) => {
  setNonRefundables(prev => prev.filter((_, i) => i !== index));
};

  const onFloorChange = (v) => {
    setSelectedFloor(v);
    const r = rooms[v][0];
    const b = beds[r][0];
    setSelectedRoom(r);
    setSelectedBed(b);
  };

  const submitLongStay = () => {
    const payload = {
      type: "long",
      floor: selectedFloor,
      room: selectedRoom,
      bed: selectedBed,
      joiningDate: joiningDate.toISOString(),
      advanceAmount,
      rentalAmount,
      maintenanceAmount,
      nonRefundables,
    };
    console.log("submitLongStay", payload);
  };

  const submitShortStay = () => {
    const payload = {
      type: "short",
      floor: selectedFloor,
      room: selectedRoom,
      bed: selectedBed,
      checkinDate: checkinDate.toISOString(),
      checkinTime: checkinTime.toISOString(),
      checkoutDate: checkoutDate.toISOString(),
      amountPerDay,
      billingMode,
    };
    console.log("submitShortStay", payload);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack?.()}
            style={styles.backBtn}
          >
            <Image source={ArrowLeft} style={{ height: 20, width: 20 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tenant Check-In</Text>
        </View>

        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={[styles.segment, tab === "long" && styles.segmentActive]}
            onPress={() => setTab("long")}
          >
            <Text
              style={[
                styles.segmentText,
                tab === "long" && styles.segmentTextActive,
              ]}
            >
              Long Stay
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segment, tab === "short" && styles.segmentActive]}
            onPress={() => setTab("short")}
          >
            <Text
              style={[
                styles.segmentText,
                tab === "short" && styles.segmentTextActive,
              ]}
            >
              Short Stay
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container}>
          <View style={styles.field}>
            <Text style={styles.label}>Floor</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={selectedFloor}
                onValueChange={onFloorChange}
              >
                {floors.map((f) => (
                  <Picker.Item key={f} label={f} value={f} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Room</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={selectedRoom}
                onValueChange={(v) => setSelectedRoom(v)}
              >
                {(rooms[selectedFloor] || []).map((r) => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Bed</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={selectedBed}
                onValueChange={(v) => setSelectedBed(v)}
              >
                {(beds[selectedRoom] || []).map((b) => (
                  <Picker.Item key={b} label={b} value={b} />
                ))}
              </Picker>
            </View>
          </View>

          {tab === "long" && (
            <View>
              <View style={styles.field}>
                <Text style={styles.label}>Joining Date *</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowJoiningPicker(true)}
                >
                  <Text>{joiningDate.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showJoiningPicker && (
              <DateTimePicker
               value={joiningDate}
               mode="date"
               display={showJoiningPicker ? "default" : "none"}
               maximumDate={new Date()}
               onChange={(e, d) => {
    setShowJoiningPicker(false);
    if (d) setJoiningDate(d);
  }}
/>

                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Advance Amount *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={advanceAmount}
                  onChangeText={setAdvanceAmount}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Rental Amount *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={rentalAmount}
                  onChangeText={setRentalAmount}
                />
              </View>

<View style={styles.nonRefundContainer}>
  
  <View style={styles.nonRefundHeader}>
    <Text style={styles.label}>Non Refundable Amount</Text>

    <TouchableOpacity style={styles.addBtn} onPress={addNonRefundable}>
      <View style={styles.iconCircle}>
        <Image source={AddCircle} style={styles.iconImage} />
      </View>
      <Text style={styles.addText}>Add</Text>
    </TouchableOpacity>
  </View>

  <View style={styles.nonRefundRow}>
    <View style={[styles.inputBox, { flex: 1 }]}>
      <Text style={styles.fixedLabel}>Maintenance</Text>
    </View>

    <View style={{ width: 120 }}>
      <TextInput
        value={maintenanceAmount}
        onChangeText={setMaintenanceAmount}
        keyboardType="numeric"
        placeholder="Enter Amount"
        style={styles.inputBox}
      />
    </View>
  </View>

  {nonRefundables.map((item, index) => (
    <View key={index} style={styles.nonRefundRow}>

      <TextInput
        placeholder="Reason"
        value={item.reason}
        onChangeText={(t) => {
          const updated = [...nonRefundables];
          updated[index].reason = t;
          setNonRefundables(updated);
        }}
        style={[styles.inputBox, { flex: 1 }]}
      />

      <View style={{ width: 120 }}>
        <TextInput
          placeholder="Amount"
          value={item.amount}
          onChangeText={(t) => {
            const updated = [...nonRefundables];
            updated[index].amount = t;
            setNonRefundables(updated);
          }}
          keyboardType="numeric"
          style={[styles.inputBox, { paddingRight: 30 }]}
        />

        <TouchableOpacity
          style={styles.closeInside}
          onPress={() => removeNonRefundable(index)}
        >
          <Image source={RemoveIcon} style={{ width: 12, height: 12 }} />
        </TouchableOpacity>
      </View>

    </View>
  ))}

</View>



              <View style={styles.BtnRow}>
                <TouchableOpacity style={styles.CancelBtn}>
                  <Text style={{ color: "grey", fontWeight: "600" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={submitLongStay}>
                  <Text style={styles.submitText}>Assign Bed</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {tab === "short" && (
            <View>
              <View style={styles.field}>
                <Text style={styles.label}>Check-in Date *</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowCheckinPicker(true)}
                >
                  <Text>{checkinDate.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showCheckinPicker && (
                  <DateTimePicker
                   value={checkinDate}
                   mode="date"
                   display={showCheckinPicker ? "default" : "none"}
                   minimumDate={new Date()}
                   onChange={(e, d) => {
                   setShowCheckinPicker(false);
                   if (d) setCheckinDate(d);
                   }}
                  />

                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Check-in Time *</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text>
                    {checkinTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>

                {showTimePicker && (
                 <DateTimePicker
                 value={checkinTime}
                 mode="time"
                 display={showTimePicker ? "default" : "none"}
                 onChange={(e, d) => {
                 setShowTimePicker(false);
                 if (d) setCheckinTime(d);
                }}
               />

                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Rental Amount/Day *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={amountPerDay}
                  onChangeText={setAmountPerDay}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Checkout Date (Expected)</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowCheckoutPicker(true)}
                >
                  <Text>{checkoutDate.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showCheckoutPicker && (
                  <DateTimePicker
                   value={checkoutDate}
                   mode="date"
                   display={showCheckoutPicker ? "default" : "none"}
                   minimumDate={checkinDate}
                   onChange={(e, d) => {
                   setShowCheckoutPicker(false);
                   if (d) setCheckoutDate(d);
                    }}
                 />

                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Billing Mode</Text>
                <View style={styles.pickerWrap}>
                  <Picker
                    selectedValue={billingMode}
                    onValueChange={(v) => setBillingMode(v)}
                  >
                    {billingModeOptions.map((opt) => (
                      <Picker.Item key={opt} label={opt} value={opt} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.BtnRow}>
                <TouchableOpacity style={styles.CancelBtn}>
                  <Text style={{ color: "grey", fontWeight: "600" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={submitShortStay}>
                  <Text style={styles.submitText}>Assign Bed</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 32,
  },

  backBtn: { padding: 6, marginRight: 8 },

  headerTitle: { fontSize: 18, fontWeight: "600" },

  segmentRow: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#EEF2F7",
    borderRadius: 8,
    padding: 4,
  },

  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentActive: { backgroundColor: "#2B6CF6" },

  segmentText: { color: "#4B5563" },

  segmentTextActive: { color: "#fff", fontWeight: "600" },

  container: { paddingHorizontal: 16 },

  field: { marginBottom: 12 },

  label: { color: "#4B4B4B", marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  pickerWrap: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  nonRefundContainer: {
    marginTop: 10,
    backgroundColor: "#F7F7FA",
    padding: 10,
    borderRadius: 10,
  },

  nonRefundHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  nonRefundRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },

  inputBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
  },

  fixedLabel: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },

  closeInside: {
    position: "absolute",
    right: -6,
    top: -6,
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 20,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E5BFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },



  iconImage: {
    height: 16,
    width: 16,
    marginRight:6
  },

  addText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  BtnRow: {
    flexDirection: "row",
    width: "99%",
    marginTop: 18,
    gap: 10,
  },

  CancelBtn: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  submitBtn: {
    flex: 1,
    backgroundColor: "#2B6CF6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  submitText: { color: "#fff", fontWeight: "600" },
});
