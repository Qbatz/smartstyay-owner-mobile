import React, { useState, useEffect, useContext, useRef } from 'react';
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
  Image, TouchableWithoutFeedback, Keyboard
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
import SuccessModal from '../../ToastFile/ToastPage';

export default function TenantCheckIn({ navigation, route }) {
  const { customerId, customer } = route.params || {};
  const [tab, setTab] = useState("long");
  const { activeHostelId } = useContext(CommonContexts);
  const { getAllFloorsByHostel, getAllRoomsByFloor, getAllBedsByRoom } = useFloor();
  const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel } = useCustomer();

  const [floors, setFloors] = useState([]);
  const [floorOpen, setFloorOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomOpen, setRoomOpen] = useState(false);

  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [beds, setBeds] = useState([]);
  const [bedOpen, setBedOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [floorError, setFloorError] = useState("")
  const [roomError, setRoomError] = useState("")
  const [bedError, setBedError] = useState('')
  const [advanceError, setAdvanceError] = useState("")
  const [rentError, setRentError] = useState("")
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [joiningDate, setJoiningDate] = useState(new Date());
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [rentalAmount, setRentalAmount] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [extraCharges, setExtraCharges] = useState([]);

  const scrollRef = React.useRef(null);
  const scrollToInput = (y = 200) => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y,
        animated: true,
      });
    }, 150); // keyboard animation wait
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", e => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);


  console.log("selectedBed", customer)

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


  const loadRooms = async (floorId) => {
    const res = await getAllRoomsByFloor(floorId);
    if (res.success) {
      setRooms(res.data);
    } else {
      setRooms([]);
    }
  };




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

  const filteredBeds = beds.filter(bed => {
    if (!selectedFloor || !selectedRoom) return false;

    return (
      bed.floorId === selectedFloor.id &&
      bed.roomId === selectedRoom.id &&
      bed.currentStatus === "VACANT"
    );
  });

  const maintenanceAlreadyUsed = extraCharges.some(c => c.type === "Maintenance");


  const TYPE_OPTIONS = ["Maintenance", "Others"];


  const addCharge = () => {
    setExtraCharges(prev => [
      ...prev,
      { id: Date.now(), type: "", title: "", amount: "" }
    ]);
  };

  const removeCharge = (id) => {
    setExtraCharges(prev => prev.filter(i => i.id !== id));

  };

  const selectType = (id, type) => {


    if (type === "Maintenance" && maintenanceAlreadyUsed) return;

    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "" } : i))
    );

    setOpenDropdownId(null);
  };





  const updateTitle = (id, title) => {
    // setExtraCharges(prev =>
    //   prev.map(i => (i.id === id ? { ...i, title } : i))
    // );
     setExtraCharges(prev =>
    prev.map(i =>
      i.id === id
        ? { ...i, title, titleError: "" }
        : i
    )
  );
  };

  const updateAmount = (id, amount) => {
    // setExtraCharges(prev =>
    //   prev.map(i => (i.id === id ? { ...i, amount } : i))
    // );
    setExtraCharges(prev =>
    prev.map(i =>
      i.id === id
        ? { ...i, amount, amountError: "" }
        : i
    )
  );
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
      setRentError("Please Enter Rental amount");
      valid = false;
    }

    return valid;
  };
const validateExtraCharges = () => {
  let valid = true;

  const updated = extraCharges.map((e) => {
    let titleError = "";
    let amountError = "";

    const titleFilled = e.title?.trim()?.length > 0;
    const amountFilled = e.amount !== "" && e.amount !== null && e.amount !== undefined;

    const amt = Number(e.amount);

    // ✅ CASE 1: type not selected -> ignore row (no validation)
    if (!e.type) {
      return { ...e, titleError: "", amountError: "" };
    }

    // ✅ CASE 2: Maintenance -> amount mandatory
    if (e.type === "Maintenance") {
      if (!amountFilled) {
        amountError = "Please enter maintenance amount";
        valid = false;
      } else if (isNaN(amt) || amt <= 0) {
        amountError = "Amount must be greater than 0";
        valid = false;
      }

      return { ...e, titleError: "", amountError };
    }

    // ✅ CASE 3: Others -> reason + amount both mandatory
    if (e.type === "Others") {
      // both empty -> ok (optional row)
      if (!titleFilled && !amountFilled) {
        return { ...e, titleError: "", amountError: "" };
      }

      if (!titleFilled) {
        titleError = "Please enter reason";
        valid = false;
      }

      if (!amountFilled) {
        amountError = "Please enter amount";
        valid = false;
      } else if (isNaN(amt) || amt <= 0) {
        amountError = "Amount must be greater than 0";
        valid = false;
      }

      return { ...e, titleError, amountError };
    }

    return { ...e, titleError: "", amountError: "" };
  });

  setExtraCharges(updated);
  return valid;
};


  const submitLongStay = async () => {
    const isValid = validateLongStay();

    if (!isValid) return;
     const chargeValid = validateExtraCharges();
  if (!chargeValid) return;
    const payload = {
      floorId: selectedFloor.id,
      roomId: selectedRoom.id,
      bedId: selectedBed.bedId,
      joiningDate: dayjs(joiningDate).format("DD-MM-YYYY"),
      advanceAmount: Number(advanceAmount),
      rentalAmount: Number(rentalAmount),
      stayType: "LONG",

      deductions: extraCharges.map((e) => ({
        type:
          e.type === "Others"
            ? e.title.trim().toLowerCase()
            : e.type.toLowerCase(),
        amount: Number(e.amount),
      })),
    };

    const res = await checkInCustomer(customerId, payload);

    if (res.success) {
      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      await getAllBedsByRoom(selectedRoom.id);
      navigation.goBack();
      setTimeout(() => {
        setShowSuccess(false);

      }, 800);

    } else {
      alert(res.message);
    }
  };





  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
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

          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: keyboardHeight > 0 ? keyboardHeight + 60 : 130,
              padding: 15
            }}
          >




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

                          <TouchableOpacity
                            key={v.id}
                            style={styles.option}
                            onPress={() => {
                              setSelectedFloor(v);
                              setFloorOpen(false);

                              setSelectedRoom(null);
                              setSelectedBed(null);
                              setRooms([]);
                              loadRooms(v.id);
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


                <Text style={styles.label}>Room</Text>

                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => setRoomOpen(!roomOpen)}
                    activeOpacity={0.9}
                    disabled={!rooms.length}
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
                    onChangeText={(text) => {
                      setAdvanceAmount(text);
                      setAdvanceError("");
                    }}

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
                    onChangeText={(text) => {
                      setRentalAmount(text);
                      setRentError("");
                    }}
                  />

                </View>
                {rentError && (
                  <ErrorMessage message={rentError} type="error" />
                )}

                <View style={styles.nonRefund}>
                  <View style={styles.extraHeader}>
                    <Text style={styles.label}>Non Refundable Amoun</Text>

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
                            // onChangeText={(t) => updateTitle(item.id, t)}
                            onFocus={() => {
                              setOpenDropdownId(null);
                              scrollToInput(420);
                            }}
                            onChangeText={(t) => {
                              const onlyLetters = t.replace(/[^a-zA-Z\s]/g, "");
                              updateTitle(item.id, onlyLetters);
                            }}
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
{item.titleError ? (
  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
    {item.titleError}
  </Text>
) : null}
{item.amountError ? (
  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
    {item.amountError}
  </Text>
) : null}

                      {openDropdownId === item.id && item.type === "" && (
                        <View style={styles.nonRefundDropdown}>
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

              <View><Text>Comming Soon</Text></View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {openDatePicker && (
        <View style={styles.sheetOverlay} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={close} >
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
  nonRefundDropdown: {
    position: "absolute",
    top: 55,
    left: 0,
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 12,
    zIndex: 20,
    elevation: 10,
  },


});
