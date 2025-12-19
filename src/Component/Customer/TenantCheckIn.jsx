import React, { useState, useEffect, useContext } from 'react';
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
  Image, TouchableWithoutFeedback
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import AddCircle from "../../Assets/Images/add-circle.png";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import Calendar from "../../Assets/Images/calendar.png";
import { useFloor } from "../../Context/PayingGuestContext";
import { CommonContexts } from "../../Context/CommonContext";
import { useCustomer } from '../../Context/CustomerContext';
import Delete from "../../Assets/Images/remove.png";
import ErrorMessage from '../ErrorMessagr/Errormessagestyle';
export default function TenantCheckIn({ navigation, route }) {
  const { customerId, customer } = route.params || {};
  const [tab, setTab] = useState("long");
  const { activeHostelId } = useContext(CommonContexts);
  const { getAllFloorsByHostel, getAllRoomsByFloor } = useFloor();
  const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel } = useCustomer();

  const [floors, setFloors] = useState([]);
  const [floorOpen, setFloorOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomOpen, setRoomOpen] = useState(false);


  const [selectedRoom, setSelectedRoom] = useState(null);

  const [beds, setBeds] = useState([]);
  const [bedOpen, setBedOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [floorError, setFloorError] = useState("")
  const [roomError, setRoomError] = useState("")
  const [bedError, setBedError] = useState('')
  const [advanceError, setAdvanceError] = useState("")
  const [rentError, setRentError] = useState("")

  useEffect(() => {
    if (!activeHostelId) return;

    loadFloors();
  }, [activeHostelId]);

  const loadFloors = async () => {
    const res = await getAllFloorsByHostel(activeHostelId);
    if (res.success) {
      setFloors(res.data);


    }
  };
  console.log("customer", customer)

  const loadRooms = async (floorId) => {
    const res = await getAllRoomsByFloor(floorId);
    if (res.success) {
      setRooms(res.data);
    } else {
      setRooms([]);
    }
  };

  console.log("floors...?", rooms)

  useEffect(() => {
    if (!activeHostelId || !joiningDate) return;

    loadBeds(joiningDate);
  }, [activeHostelId]);



  const loadBeds = async (date) => {
    if (!activeHostelId) return;

    const formattedDate = dayjs(date).format("DD-MM-YYYY");

    const res = await getBedsByHostelAndDate(
      activeHostelId,
      formattedDate
    );

    if (res.success) {
      setBeds(res.data.listBeds);
    } else {
      setBeds([]);
    }
  };
  console.log("Beds", beds)
  const filteredBeds = beds.filter(bed => {
    if (!selectedFloor || !selectedRoom) return false;

    return (
      bed.floorId === selectedFloor.id &&
      bed.roomId === selectedRoom.id &&
      bed.currentStatus === "VACANT"
    );
  });
  console.log("Filtered Beds:", filteredBeds);


  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(dayjs());
  const [joiningDate, setJoiningDate] = useState(new Date());
  const [showJoiningPicker, setShowJoiningPicker] = useState(false);

  const [advanceAmount, setAdvanceAmount] = useState("");
  const [rentalAmount, setRentalAmount] = useState("");

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
  const [extraCharges, setExtraCharges] = useState([]);
  const maintenanceAlreadyUsed = extraCharges.some(c => c.type === "Maintenance");

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const TYPE_OPTIONS = ["Maintenance", "Others"];


  const addCharge = () => {
    setExtraCharges(prev => [
      ...prev,
      { id: Date.now(), type: "", title: "", amount: "" }
    ]);
  };

  const removeCharge = (id) => {
    setExtraCharges(prev => prev.filter(i => i.id !== id));

    // if (type === "Maintenance") {
    //   setDisabledTypes([]);
    // }
  };

  const selectType = (id, type) => {


    if (type === "Maintenance" && maintenanceAlreadyUsed) return;

    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "" } : i))
    );

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

  console.log("nonRefundables", extraCharges)
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
  const validateLongStay = () => {
    let valid = true;

    // reset errors
    setFloorError("");
    setRoomError("");
    setBedError("");
    setAdvanceError("");
    setRentError("");

    if (!selectedFloor) {
      setFloorError("Please select a floor");
      valid = false;
    }

    if (!selectedRoom) {
      setRoomError("Please select a room");
      valid = false;
    }

    if (!selectedBed) {
      setBedError("Please select a bed");
      valid = false;
    }

    if (!advanceAmount || Number(advanceAmount) <= 0) {
      setAdvanceError("Please enter advance amount");
      valid = false;
    }

    if (!rentalAmount || Number(rentalAmount) <= 0) {
      setRentError("Please enter rental amount");
      valid = false;
    }

    return valid;
  };

  const submitLongStay = async () => {
    const isValid = validateLongStay();

    if (!isValid) return;
    const payload = {
      floorId: selectedFloor.id,
      roomId: selectedRoom.id,
      bedId: selectedBed.bedId,
      joiningDate: dayjs(joiningDate).format("DD-MM-YYYY"),
      advanceAmount: Number(advanceAmount),
      rentalAmount: Number(rentalAmount),
      stayType: "LONG",
      deductions: extraCharges.map(e => ({
        type: e.type.toLowerCase(),
        amount: Number(e.amount),
      })),
    };

    const res = await checkInCustomer(customerId, payload);

    if (res.success) {
      alert("Customer Checked-in Successfully ✅");
      navigation.goBack();
    } else {
      alert(res.message);
    }
  };



  // const submitLongStay = () => {
  //   const payload = {
  //     type: "long",
  //     floor: selectedFloor,
  //     room: selectedRoom,
  //     bed: selectedBed,
  //     joiningDate: joiningDate.toISOString(),
  //     advanceAmount,
  //     rentalAmount,
  //     maintenanceAmount,
  //     nonRefundables,
  //   };
  //   console.log("submitLongStay", payload);
  // };

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
                <Text style={styles.label}>Floor</Text>

                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => setFloorOpen(!floorOpen)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.selectText}>
                      {selectedFloor ? selectedFloor.name : "Select a Floor"}
                    </Text>
                    <Image source={DownArrow} style={styles.arrow} />
                  </TouchableOpacity>

                  {floorOpen && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView style={{ maxHeight: 160 }}>
                        {floors.map((v) => (
                          // <TouchableOpacity
                          //   key={v.id}
                          //   style={styles.option}
                          //   onPress={() => {
                          //     setSelectedFloor(v);   // store whole object
                          //     setFloorOpen(false);
                          //   }}
                          // >
                          //   <Text style={styles.optionText}>{v.name}</Text>
                          // </TouchableOpacity>
                          <TouchableOpacity
                            key={v.id}
                            style={styles.option}
                            onPress={() => {
                              setSelectedFloor(v);
                              setFloorOpen(false);

                              setSelectedRoom(null);   // reset room
                              setSelectedBed(null);    // reset bed
                              setRooms([]);            // clear old rooms

                              loadRooms(v.id);         // 🔥 CALL API WITH FLOOR ID
                            }}
                          >
                            <Text style={styles.optionText}>{v.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
                {floorError && (
                  <ErrorMessage message={floorError} type="error" />
                )}

                {/* <Text style={styles.label}>Room</Text>
          
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
                              </View> */}
                <Text style={styles.label}>Room</Text>

                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => setRoomOpen(!roomOpen)}
                    activeOpacity={0.9}
                    disabled={!rooms.length}   // no rooms → disable
                  >
                    <Text style={styles.selectText}>
                      {selectedRoom ? selectedRoom.name : "Select a Room"}
                    </Text>
                    <Image source={DownArrow} style={styles.arrow} />
                  </TouchableOpacity>

                  {roomOpen && rooms.length > 0 && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView style={{ maxHeight: 160 }}>
                        {rooms.map((r) => (
                          <TouchableOpacity
                            key={r.id}
                            style={styles.option}
                            onPress={() => {
                              setSelectedRoom(r);
                              setRoomOpen(false);
                            }}
                          >
                            <Text style={styles.optionText}>{r.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
                {roomError && (
                  <ErrorMessage message={roomError} type="error" />
                )}
                <Text style={styles.label}>Bed</Text>

                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => setBedOpen(!bedOpen)}
                    activeOpacity={0.9}
                    disabled={!filteredBeds.length}
                  >
                    <Text style={styles.selectText}>
                      {selectedBed ? selectedBed.bedName : "Select a Bed"}
                    </Text>

                    <Image source={DownArrow} style={styles.arrow} />
                  </TouchableOpacity>

                  {bedOpen && filteredBeds.length > 0 && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView style={{ maxHeight: 160 }}>
                        {filteredBeds.map((b) => (
                          <TouchableOpacity
                            key={b.bedId}
                            style={styles.option}
                            onPress={() => {
                              setSelectedBed(b);
                              setBedOpen(false);
                              //  setRentalAmount(String(b.rentAmount));
                            }}
                          >
                            <Text style={styles.optionText}>
                              {b.bedName}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
                {bedError && (
                  <ErrorMessage message={bedError} type="error" />
                )}



                <View style={styles.field}>
                  <Text style={styles.label}>Advance Amount *</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={advanceAmount}
                    placeholder='Enter AdvanceAmount'
                    onChangeText={setAdvanceAmount}
                  />
                </View>
                {advanceError && (
                  <ErrorMessage message={advanceError} type="error" />
                )}

                <View style={styles.field}>
                  <Text style={styles.label}>Rental Amount *</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={rentalAmount}
                    placeholder={
                      selectedBed?.rentAmount
                        ? String(selectedBed.rentAmount)
                        : "Enter Rental Amount"
                    }
                    placeholderTextColor="#9CA3AF"
                    onChangeText={setRentalAmount}
                  />

                </View>
                {rentError && (
                  <ErrorMessage message={rentError} type="error" />
                )}

                <View style={styles.nonRefund}>
                  <View style={styles.extraHeader}>
                    <Text style={styles.label}>Non Refundable Amount</Text>

                    <TouchableOpacity style={styles.addBtn} onPress={addCharge}>
                      <Text style={{ color: "#fff", fontWeight: "600" }}>Add</Text>
                    </TouchableOpacity>
                  </View>

                  {extraCharges.map((item) => (
                    <View key={item.id} style={styles.figmaRowWrapper}>

                      {/* CLOSE BTN */}
                      <TouchableOpacity
                        onPress={() => removeCharge(item.id, item.type)}
                        style={styles.figmaCloseBtn}
                      >

                        <Image
                          source={Delete}
                          style={styles.figmaCloseText}
                        />
                      </TouchableOpacity>


                      <View style={styles.figmaRow}>


                        {item.type === "" ? (
                          <TouchableOpacity
                            style={styles.figmaLeftBox}
                            onPress={() =>
                              setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                            }
                          >
                            <Text style={{ color: "#777" }}>Select...</Text>
                            <Image source={DownArrow} style={styles.arrow} />
                          </TouchableOpacity>
                        ) : item.type === "Others" ? (
                          <TextInput
                            style={styles.figmaLeftBox}
                            placeholder="Enter reason"
                            value={item.title}
                            onChangeText={(t) => updateTitle(item.id, t)}
                          />
                        ) : (
                          <View style={[styles.figmaLeftBox, { backgroundColor: "#EFEFEF" }]}>
                            <Text>Maintenance</Text>
                          </View>
                        )}

                        {/* RIGHT BOX ALWAYS VISIBLE (disabled until type selected) */}
                        {item.type === "" ? (
                          <View style={[styles.figmaRightBox, { opacity: 0.4 }]}>
                            <Text style={{ color: "#999" }}>Enter amount</Text>
                          </View>
                        ) : (
                          <TextInput
                            style={styles.figmaRightBox}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={item.amount}
                            onChangeText={(t) => updateAmount(item.id, t)}
                          />
                        )}

                      </View>


                      {openDropdownId === item.id && item.type === "" && (
                        <View style={styles.dropdownMenuone}>
                          {TYPE_OPTIONS.map((t) => {

                            const disabled = t === "Maintenance" && maintenanceAlreadyUsed;

                            return (
                              <TouchableOpacity
                                key={t}
                                disabled={disabled}
                                onPress={() => !disabled && selectType(item.id, t)}
                                style={{ opacity: disabled ? 0.3 : 1 }}
                              >
                                <Text style={styles.dropdownItem}>{t}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}

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
                const selectedDate = p.date || dayjs();
                setJoiningDate(selectedDate);
                setOpenDatePicker(false);

                setSelectedFloor(null);
                setSelectedRoom(null);
                setSelectedBed(null);

                setRooms([]);
                setBeds([]);

                loadBeds(selectedDate);
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
    marginRight: 6
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

  nonRefund: {
    backgroundColor: "#F7F9FF",
    padding: 10,
    marginTop: 10,
    borderRadius: 20
  },

  addBtn: {
    backgroundColor: "#2D6CDF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  extraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  figmaRowWrapper: {
    marginTop: 20,
    position: "relative",
  },

  figmaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  figmaLeftBox: {
    width: "48%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  figmaRightBox: {
    width: "45%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    justifyContent: "center",
    marginRight: 20
  },

  figmaCloseBtn: {
    position: "absolute",
    right: 5,
    top: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E1E1E1",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  figmaCloseText: {
    width: 10,
    height: 10
  },
  dropdownMenuone: {
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

});
