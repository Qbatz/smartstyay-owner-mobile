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
  Image,TouchableWithoutFeedback
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import AddCircle from "../../Assets/Images/add-circle.png";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import RemoveIcon from "../../Assets/Images/remove.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import Calendar from "../../Assets/Images/calendar.png";

export default function TenantCheckIn({ navigation }) {
  const [tab, setTab] = useState("long");

  
 


    const floors = ["Vendor 1", "Vendor 2", "Vendor 3", "Vendor 4", "Vendor 5"];
      const [floorOpen, setFloorOpen] = useState(false);
      const [selectedFloor, setSelectedFloor] = useState("Select a Floor");
   
   const rooms = ["Vendor 1", "Vendor 2", "Vendor 3", "Vendor 4", "Vendor 5"];
    const [roomOpen, setRoomOpen] = useState(false);
   
  
  const [selectedRoom, setSelectedRoom] = useState("Select a Room");

    const beds = ["Vendor 1", "Vendor 2", "Vendor 3", "Vendor 4", "Vendor 5"];
      const [bedOpen, setBedOpen] = useState(false);
     
  const [selectedBed, setSelectedBed] = useState("Select a Bed");
  const [openDatePicker, setOpenDatePicker] = useState(false);
    const [purchaseDate, setPurchaseDate] = useState(dayjs());
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
    <>
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
         

          {/* <View style={styles.field}>
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
          </View> */}

          {tab === "long" && (
            <View>
         <Text style={styles.label}>Floor</Text>

                    <View style={{ position: "relative" }}>
                        <TouchableOpacity
                            style={styles.select}
                            onPress={() => setFloorOpen(!floorOpen)}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.selectText}>{selectedFloor}</Text>
                            <Image source={DownArrow} style={styles.arrow} />
                        </TouchableOpacity>

                        {floorOpen && (
                            <View style={styles.dropdownMenu}>
                                <ScrollView style={{ maxHeight: 160 }}>
                                    {floors.map((v, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.option}
                                            onPress={() => {
                                                setSelectedFloor(v);
                                                setFloorOpen(false);
                                            }}
                                        >
                                            <Text style={styles.optionText}>{v}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
         
          <Text style={styles.label}>Room</Text>
          
                              <View style={{ position: "relative" }}>
                                  <TouchableOpacity
                                      style={styles.select}
                                      onPress={() => setRoomOpen(!roomOpen)}
                                      activeOpacity={0.9}
                                  >
                                      <Text style={styles.selectText}>{selectedRoom}</Text>
                                      <Image source={DownArrow} style={styles.arrow} />
                                  </TouchableOpacity>
          
                                  {roomOpen && (
                                      <View style={styles.dropdownMenu}>
                                          <ScrollView style={{ maxHeight: 160 }}>
                                              {rooms.map((v, index) => (
                                                  <TouchableOpacity
                                                      key={index}
                                                      style={styles.option}
                                                      onPress={() => {
                                                          setSelectedRoom(v);
                                                          setRoomOpen(false);
                                                      }}
                                                  >
                                                      <Text style={styles.optionText}>{v}</Text>
                                                  </TouchableOpacity>
                                              ))}
                                          </ScrollView>
                                      </View>
                                  )}
                              </View>
 <Text style={styles.label}>Bed</Text>

                    <View style={{ position: "relative" }}>
                        <TouchableOpacity
                            style={styles.select}
                            onPress={() => setBedOpen(!bedOpen)}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.selectText}>{selectedBed}</Text>
                            <Image source={DownArrow} style={styles.arrow} />
                        </TouchableOpacity>

                        {bedOpen && (
                            <View style={styles.dropdownMenu}>
                                <ScrollView style={{ maxHeight: 160 }}>
                                    {beds.map((v, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.option}
                                            onPress={() => {
                                                setSelectedBed(v);
                                                setBedOpen(false);
                                            }}
                                        >
                                            <Text style={styles.optionText}>{v}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
               <Text style={styles.label}>Joining Date</Text>
              
                                  <TouchableOpacity
                                      style={styles.dateBox}
                                      onPress={() => setOpenDatePicker(true)}
                                  >
                                      <Text style={styles.placeholder}>
                                          {joiningDate ? dayjs(joiningDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                                      </Text>
                                      <Image source={Calendar} style={styles.calendarIcon} />
                                  </TouchableOpacity>
             

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
            // <View>
            //   <View style={styles.field}>
            //     <Text style={styles.label}>Check-in Date *</Text>
            //     <TouchableOpacity
            //       style={styles.input}
            //       onPress={() => setShowCheckinPicker(true)}
            //     >
            //       <Text>{checkinDate.toLocaleDateString()}</Text>
            //     </TouchableOpacity>

            //     {showCheckinPicker && (
            //       <DateTimePicker
            //        value={checkinDate}
            //        mode="date"
            //        display={showCheckinPicker ? "default" : "none"}
            //        minimumDate={new Date()}
            //        onChange={(e, d) => {
            //        setShowCheckinPicker(false);
            //        if (d) setCheckinDate(d);
            //        }}
            //       />

            //     )}
            //   </View>

            //   <View style={styles.field}>
            //     <Text style={styles.label}>Check-in Time *</Text>
            //     <TouchableOpacity
            //       style={styles.input}
            //       onPress={() => setShowTimePicker(true)}
            //     >
            //       <Text>
            //         {checkinTime.toLocaleTimeString([], {
            //           hour: "2-digit",
            //           minute: "2-digit",
            //         })}
            //       </Text>
            //     </TouchableOpacity>

            //     {showTimePicker && (
            //      <DateTimePicker
            //      value={checkinTime}
            //      mode="time"
            //      display={showTimePicker ? "default" : "none"}
            //      onChange={(e, d) => {
            //      setShowTimePicker(false);
            //      if (d) setCheckinTime(d);
            //     }}
            //    />

            //     )}
            //   </View>

            //   <View style={styles.field}>
            //     <Text style={styles.label}>Rental Amount/Day *</Text>
            //     <TextInput
            //       style={styles.input}
            //       keyboardType="numeric"
            //       value={amountPerDay}
            //       onChangeText={setAmountPerDay}
            //     />
            //   </View>

            //   <View style={styles.field}>
            //     <Text style={styles.label}>Checkout Date (Expected)</Text>
            //     <TouchableOpacity
            //       style={styles.input}
            //       onPress={() => setShowCheckoutPicker(true)}
            //     >
            //       <Text>{checkoutDate.toLocaleDateString()}</Text>
            //     </TouchableOpacity>

            //     {showCheckoutPicker && (
            //       <DateTimePicker
            //        value={checkoutDate}
            //        mode="date"
            //        display={showCheckoutPicker ? "default" : "none"}
            //        minimumDate={checkinDate}
            //        onChange={(e, d) => {
            //        setShowCheckoutPicker(false);
            //        if (d) setCheckoutDate(d);
            //         }}
            //      />

            //     )}
            //   </View>

            //   <View style={styles.field}>
            //     <Text style={styles.label}>Billing Mode</Text>
            //     <View style={styles.pickerWrap}>
            //       <Picker
            //         selectedValue={billingMode}
            //         onValueChange={(v) => setBillingMode(v)}
            //       >
            //         {billingModeOptions.map((opt) => (
            //           <Picker.Item key={opt} label={opt} value={opt} />
            //         ))}
            //       </Picker>
            //     </View>
            //   </View>

            //   <View style={styles.BtnRow}>
            //     <TouchableOpacity style={styles.CancelBtn}>
            //       <Text style={{ color: "grey", fontWeight: "600" }}>
            //         Cancel
            //       </Text>
            //     </TouchableOpacity>

            //     <TouchableOpacity style={styles.submitBtn} onPress={submitShortStay}>
            //       <Text style={styles.submitText}>Assign Bed</Text>
            //     </TouchableOpacity>
            //   </View>
            // </View>
            <View><Text>Comming Soon</Text></View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
     {openDatePicker && (
                <View style={styles.sheetOverlay}>
                    <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
                        <View style={{ flex: 1 }} />
                    </TouchableWithoutFeedback>

                    <View style={styles.datePickerBox}>
                        <DatePicker
                            mode="single"
                            date={joiningDate}
                            onChange={(p) => {
                                setJoiningDate(p.date || dayjs());
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
      arrow: { width: 18, height: 18, tintColor: "#777" },


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
       datePickerPopup: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
        width: "100%",
    },
    sheetOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
      datePickerBox: {
        backgroundColor: "#fff",
        width: "80%",

        borderRadius: 20,
        padding: 10,
        marginBottom: 190
    },


});
