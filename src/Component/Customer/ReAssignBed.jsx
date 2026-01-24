import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  BackHandler,
  PanResponder, Dimensions, KeyboardAvoidingView, Keyboard, Platform
} from "react-native";
import dayjs from "dayjs";
import DirectionDownIcon from "../../Assets/Images/direction_down.png";
import CalendorIcon from "../../Assets/Images/calendar.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import { CommonContexts } from "../../Context/CommonContext";
import { useCustomer } from '../../Context/CustomerContext';
import { useFloor } from "../../Context/PayingGuestContext";
import SuccessModal from "../../ToastFile/ToastPage";
import { Calendar } from "react-native-calendars";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ReassignBedSheet({ visible, onClose, customer, onSuccess }) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const { activeHostelId } = useContext(CommonContexts);
  const { getAllFloorsByHostel, getAllRoomsByFloor, getAllBedsByRoom } = useFloor();
  const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel, changeBedCustomer, getCustomerDetails } = useCustomer();

  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [date, setDate] = useState(null);

  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const [floorSelected, setFloorSelected] = useState(null);
  const [roomSelected, setRoomSelected] = useState(null);
  const [bedSelected, setBedSelected] = useState(null);
  const [dateError, setDateError] = useState("")
  const [floorError, setFloorError] = useState("")
  const [roomError, setRoomError] = useState("")
  const [bedError, setBedError] = useState("")
  const [rentError, setRentError] = useState("")
  const [disableSheetDrag, setDisableSheetDrag] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [disableSheetScroll, setDisableSheetScroll] = useState(false);
  const [rentAmount, setRentAmount] = useState("")
  const isFloorDisabled = !date;
  const isRoomDisabled = !date || !floorSelected;
  const isBedDisabled = !date || !floorSelected || !roomSelected;
  const [currentFloorName, setCurrentFloorName] = useState("")
  const [currentRoomName, setCurrentRoomName] = useState("")
  const [currentBedName, setCurrentBedName] = useState("")
  const [reAssignBedDate, setReAssignBedDate] = useState("")


  useEffect(() => {
    if (visible && customer?.customerId) {
      fetchCustomerDetails();
    }
  }, [visible, customer]);
  const toggleDropdown = (type) => {
  setOpenDropdown((prev) => (prev === type ? null : type));
};


  const fetchCustomerDetails = async () => {
    const res = await getCustomerDetails(customer.customerId);
    console.log("fetchCustomerDetails", res)
    if (res.success) {
      setRentAmount(String(res.data.hostelInfo?.monthlyRent || ""));
      setReAssignBedDate(res.data.hostelInfo.joiningDate)
      setCurrentFloorName(res.data.hostelInfo.floorName)
      setCurrentRoomName(res.data.hostelInfo.roomName)
      setCurrentBedName(res.data.hostelInfo.bedName)

    } else {
      alert(res.message);
    }
  };

  const minDate = reAssignBedDate
    ? dayjs(reAssignBedDate, "DD/MM/YYYY")
    : null;

  const maxDate = dayjs(); // today
  const isDisabledReassignDate = (dateStr) => {
    const d = dayjs(dateStr, "YYYY-MM-DD");

    // joiningDate இல்லனா future மட்டும் disable
    if (!minDate) return d.isAfter(maxDate, "day");

    // joiningDate ku munnadi disable
    if (d.isBefore(minDate, "day")) return true;

    // future date disable
    if (d.isAfter(maxDate, "day")) return true;

    return false;
  };
  const markedDates = {};

  for (let i = -365; i <= 365; i++) {
    const d = dayjs().add(i, "day");
    const key = d.format("YYYY-MM-DD");

    if (isDisabledReassignDate(key)) {
      markedDates[key] = {
        disabled: true,
        disableTouchEvent: true,
        customStyles: {
          container: {
            backgroundColor: "#F3F4F6",
            opacity: 0.4,
            borderRadius: 8,
          },
          text: {
            color: "#9CA3AF",
          },
        },
      };
    }
  }

  // selected date highlight
  if (date) {
    const selectedKey = dayjs(date).format("YYYY-MM-DD");
    markedDates[selectedKey] = {
      ...markedDates[selectedKey],
      selected: true,
      selectedColor: "#2563EB",
      selectedTextColor: "#fff",
    };
  }
  const scrollRef = useRef(null);

  useEffect(() => {
    const isOpen = openDropdown !== null;
    setDisableSheetDrag(isOpen);
    setDisableSheetScroll(isOpen);
  }, [openDropdown]);
  console.log("reAssignBedDate", reAssignBedDate)
  const resetForm = () => {

    setDate(null);
    setAmount("");
    setReason("");

    setFloorSelected("Select a Floor");
    setRoomSelected("Select a Room");
    setBedSelected("Select a Bed");
    setOpenDropdown(null)
    setOpenDatePicker(false);
    setDateError("");
    setFloorError("");
    setRoomError("");
    setBedError("");
    setRentError("");
  };


  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT * 0.1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);


  useEffect(() => {
    const backAction = () => {
      if (visible) {
        closeSheet();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => sub.remove();
  }, [visible]);

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      resetForm();
      onClose();
    });
  };


  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        if (disableSheetDrag) return false;
        return Math.abs(g.dy) > 5;
      },
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;




  const loadFloors = async () => {
    if (!activeHostelId) return;

    try {
      const res = await getAllFloorsByHostel(activeHostelId);

      if (res?.success && Array.isArray(res.data)) {
        setFloors(res.data);
      } else {
        setFloors([]);
      }
    } catch (e) {

      setFloors([]);
    }
  };


  const loadRoomsByFloor = async (floorId) => {
    if (!floorId) return;

    try {
      const res = await getAllRoomsByFloor(floorId);

      if (res?.success && Array.isArray(res.data)) {
        setRooms(res.data);
      } else {
        setRooms([]);
      }
    } catch (e) {
      setRooms([]);
    }
  };

  useEffect(() => {
    if (visible && activeHostelId) {
      loadFloors();
    }
  }, [visible, activeHostelId]);
  const loadBedsByDate = async (selectedDate) => {
    if (!activeHostelId || !selectedDate) return;

    const formattedDate = dayjs(selectedDate).format("DD-MM-YYYY");


    try {
      const res = await getBedsByHostelAndDate(
        activeHostelId,
        formattedDate
      );

      if (res?.success) {
        setBeds(res.data.listBeds || []);

      } else {
        setBeds([]);
      }
    } catch (err) {

      setBeds([]);
    }
  };


  const filteredBeds = beds.filter(bed => {
    if (!floorSelected || !roomSelected) return false;

    return (
      bed.floorId === floorSelected.id &&
      bed.roomId === roomSelected.id &&
      bed.currentStatus === "VACANT"
    );

  });


  const handleSubmit = async () => {
    const customerId = customer?.customerId || customer?.id;
    let valid = true;

    // reset errors
    setDateError("");
    setFloorError("");
    setRoomError("");
    setBedError("");
    setRentError("");

    if (!date) {
      setDateError("Date is required");
      valid = false;
    }

    if (!floorSelected) {
      setFloorError("Please select a floor");
      valid = false;
    }

    if (!roomSelected) {
      setRoomError("Please select a room");
      valid = false;
    }

    if (!bedSelected) {
      setBedError("Please select a bed");
      valid = false;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setRentError("Enter valid rent amount");
      valid = false;
    }

    if (!valid) return;


    const payload = {
      bedId: bedSelected.bedId,
      rentAmount: Number(amount),
      joiningDate: dayjs(date).format("YYYY-MM-DD"),
      reason: reason || "",
    };
    const res = await changeBedCustomer(
      activeHostelId,
      customerId,
      payload
    );

    if (res.success) {

      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);
      onSuccess && onSuccess();
      await getAllBedsByRoom(roomSelected.id);
      setTimeout(() => {
        setShowSuccess(false);
        closeSheet();

      }, 800);


    } else {

      alert(res.message || "Change bed failed");
    }
  };



  const hasRooms = rooms && rooms.length > 0;
  const hasBeds = filteredBeds && filteredBeds.length > 0;


  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <TouchableWithoutFeedback onPress={closeSheet}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      {/* {openDatePicker && (
        <View style={styles.datePickerOverlay}>

          <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
            <View style={styles.overlayTouch} />
          </TouchableWithoutFeedback>


          <TouchableWithoutFeedback>
            <View style={styles.datePickerBox}>
              <DatePicker
                mode="single"
                date={date || dayjs()}
                onChange={(p) => {
                  const selectedDate = p.date;
                  setDate(selectedDate);
                  setOpenDatePicker(false);
                  setDateError("")


                  setRooms([]);
                  setBeds([]);

                  loadBedsByDate(selectedDate);
                }}
              />


            </View>
          </TouchableWithoutFeedback>

        </View>
      )} */}
      {openDatePicker && (
        <View style={styles.datePickerOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
            <View style={styles.overlayTouch} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <Calendar
              markingType="custom"
              markedDates={markedDates}
              current={
                date
                  ? dayjs(date).format("YYYY-MM-DD")
                  : minDate
                    ? minDate.format("YYYY-MM-DD")
                    : dayjs().format("YYYY-MM-DD")
              }
              onDayPress={(day) => {
                if (isDisabledReassignDate(day.dateString)) return;

                setDate(day.dateString);
                setOpenDatePicker(false);
                setDateError("");

                setRooms([]);
                setBeds([]);
                loadBedsByDate(day.dateString);
              }}
              theme={{
                todayTextColor: "#2563EB",
                selectedDayBackgroundColor: "#2563EB",
                selectedDayTextColor: "#FFFFFF",
                textDisabledColor: "#9CA3AF",
                arrowColor: "#111827",
              }}
            />
          </View>
        </View>
      )}


      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.headerBar} />

        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={!disableSheetScroll}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 60,
          }}
        > */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
        >
         <ScrollView
  ref={scrollRef}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  scrollEnabled={!disableSheetScroll}   // ✅ important
  contentContainerStyle={{ paddingBottom: 40 }}
>

            <Text style={styles.title}>Change Bed</Text>

            <Text style={styles.label}>Current Floor</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Enter Floor"
                keyboardType="numeric"
                value={currentFloorName}

                style={{ flex: 1 }}
              />
            </View>

            <Text style={styles.label}>Current Room</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Enter Room"
                keyboardType="numeric"
                value={currentRoomName}

                style={{ flex: 1 }}
              />
            </View>
            <Text style={styles.label}>Current Bed</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Enter Bed"
                keyboardType="numeric"
                value={currentBedName}

                style={{ flex: 1 }}
              />
            </View>
            <Text style={styles.label}>Date <Text style={{ color: "red" }}>*</Text></Text>
            <TouchableOpacity
              style={styles.inputBoxdate}
              onPress={() => setOpenDatePicker(true)}
            >
              <Text>
                {date ? dayjs(date).format("DD/MM/YYYY") : "DD/MM/YYYY"}
              </Text>

              <Image source={CalendorIcon} style={styles.downIcon} />
            </TouchableOpacity>
            {dateError && (
              <ErrorMessage message={dateError} type="error" />
            )}



            <Text style={styles.label}>New Floor <Text style={{ color: "red" }}>*</Text></Text>

            <View style={{ position: "relative" }}>
             <TouchableOpacity
  style={[styles.select, isFloorDisabled && styles.disabledSelect]}
  disabled={isFloorDisabled}
  onPress={() => toggleDropdown("floor")}
>
  <Text style={styles.selectText}>
    {floorSelected ? floorSelected.name : "Select a Floor"}
  </Text>
  <Image source={DownArrow} style={styles.arrow} />
</TouchableOpacity>



              {openDropdown === "floor" && (
                <View style={styles.dropdownMenu}>
                  {openDropdown && (
  <TouchableWithoutFeedback onPress={() => setOpenDropdown(null)}>
    <View style={styles.dropdownOverlay} />
  </TouchableWithoutFeedback>
)}
                   <ScrollView
      style={{ maxHeight: 160 }}
      nestedScrollEnabled={true}          // ✅ Android fix
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
                    {floors.map((f) => (
                      <TouchableOpacity
                        key={f.id}
                        style={styles.option}
                        onPress={() => {

                          setFloorSelected(f);
                          setOpenDropdown(null);

                          setRoomSelected(null);
                          setBedSelected(null);
                          setRooms([]);

                          setFloorError("")
                          loadRoomsByFloor(f.id);
                        }}


                      >
                        <Text style={styles.optionText}>{f.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            {floorError && (
              <ErrorMessage message={floorError} type="error" />
            )}
            <Text style={styles.label}>New Room <Text style={{ color: "red" }}>*</Text></Text>

            <View style={{ position: "relative" }}>
              <TouchableOpacity
  style={[styles.select, isRoomDisabled && styles.disabledSelect]}
  disabled={isRoomDisabled}
  onPress={() => toggleDropdown("room")}
>
  <Text style={styles.selectText}>
    {roomSelected ? roomSelected.name : "Select a Room"}
  </Text>
  <Image source={DownArrow} style={styles.arrow} />
</TouchableOpacity>




              {openDropdown === "room" && (
                <View style={styles.dropdownMenu}>
                  {openDropdown && (
  <TouchableWithoutFeedback onPress={() => setOpenDropdown(null)}>
    <View style={styles.dropdownOverlay} />
  </TouchableWithoutFeedback>
)}

                  <ScrollView
      style={{ maxHeight: 160 }}
      nestedScrollEnabled={true}          // ✅ Android fix
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

                    {!hasRooms ? (
                      <View style={styles.emptyOption}>
                        <Text style={styles.emptyText}>No room available</Text>
                      </View>
                    ) : (
                      rooms.map((r) => (
                        <TouchableOpacity
                          key={r.id}
                          style={styles.option}
                          onPress={() => {
                            setRoomSelected(r);
                            setOpenDropdown(null);
                            setBedSelected(null);
                            setRoomError("")
                          }}
                        >
                          <Text style={styles.optionText}>{r.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}

                  </ScrollView>
                </View>
              )}

            </View>
            {roomError && (
              <ErrorMessage message={roomError} type="error" />
            )}
            <Text style={styles.label}>New Bed <Text style={{ color: "red" }}>*</Text></Text>

            <View style={{ position: "relative" }}>
             <TouchableOpacity
  style={[styles.select, isBedDisabled && styles.disabledSelect]}
  disabled={isBedDisabled}
  onPress={() => toggleDropdown("bed")}
>
  <Text style={styles.selectText}>
    {bedSelected ? bedSelected.bedName : "Select a Bed"}
  </Text>
  <Image source={DownArrow} style={styles.arrow} />
</TouchableOpacity>



              {openDropdown === "bed" && (
                <View style={styles.dropdownMenu}>
                  {openDropdown && (
  <TouchableWithoutFeedback onPress={() => setOpenDropdown(null)}>
    <View style={styles.dropdownOverlay} />
  </TouchableWithoutFeedback>
)}

                 <ScrollView
      style={{ maxHeight: 160 }}
      nestedScrollEnabled={true}          // ✅ Android fix
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

                    {!hasBeds ? (
                      <View style={styles.emptyOption}>
                        <Text style={styles.emptyText}>No bed available</Text>
                      </View>
                    ) : (
                      filteredBeds.map((b) => (
                        <TouchableOpacity
                          key={b.bedId}
                          style={styles.option}

                          onPress={() => {
                            setBedSelected(b);
                            setOpenDropdown(null);
                            setBedError("");


                            if (!sameAsCurrent) {
                              setAmount(String(b.rentAmount));
                              setRentError("");
                            }
                          }}

                        >
                          <Text style={styles.optionText}>{b.bedName}</Text>
                        </TouchableOpacity>
                      ))
                    )}

                  </ScrollView>
                </View>
              )}

            </View>
            {bedError && (
              <ErrorMessage message={bedError} type="error" />
            )}

            <View style={styles.rentHeader}>
              <Text style={styles.label}>
                New Rent Amount <Text style={{ color: "red" }}>*</Text>
              </Text>

              <TouchableOpacity
                style={styles.sameRow}
                onPress={() => {
                  const val = !sameAsCurrent;
                  setSameAsCurrent(val);

                  if (val) {
                    setAmount(rentAmount);
                    setRentError("");
                  } else {
                    setAmount("");
                  }
                }}
                activeOpacity={0.8}
              >

                <View style={[styles.checkbox, sameAsCurrent && styles.checkboxChecked]}>
                  {sameAsCurrent && <Text style={styles.tick}>✓</Text>}
                </View>
                <Text style={styles.sameText}>Same as Current</Text>
              </TouchableOpacity>
            </View>


            <View
              style={[
                styles.inputBox,
                sameAsCurrent && styles.disabledInput,
              ]}
            >
              <TextInput
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={amount}

                onChangeText={(text) => {
                  setAmount(text);
                  setRentError("");
                }}
                onFocus={() => {
                  setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }, 200);
                }}
                style={{ flex: 1, color: sameAsCurrent ? "#000" : "#000" }}
              />

            </View>

            {rentError && (
              <ErrorMessage message={rentError} type="error" />
            )}


            <Text style={styles.label}>Reason </Text>
            <View style={styles.textArea}>
              <TextInput
                multiline
                value={reason}
                onChangeText={setReason}
                placeholder="Enter Comments"
                style={styles.textAreaInput}
                onFocus={() => {
                  setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }, 200);
                }}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.reassignBtn} onPress={handleSubmit}>
                <Text style={{ color: "#fff" }}>Change Bed</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>


    </>
  );
}


const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    height: "95%",
    maxHeight: "90%",

    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 12,
  },


  headerBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "700" },
  label: { marginTop: 14, fontWeight: "600" },
  star: { color: "red" },
  inputBox: {
    backgroundColor: "#F6F8FF",
    padding: 5,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputBoxdate: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  downIcon: { width: 20, height: 20 },
  textArea: {
    backgroundColor: "#F6F8FF",
    borderRadius: 12,
    padding: 12,
    height: 100,
  },
  textAreaInput: { height: 100, textAlignVertical: "top" },
  buttonRow: {
    flexDirection: "row",
    marginVertical: 20,

  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginRight: 10,
  },
  reassignBtn: {
    flex: 1,
    backgroundColor: "#1E45E1",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginLeft: 10,
  },
  datePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  overlayTouch: {
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
  },
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

  selectText: { color: "#555" },
  arrow: { width: 18, height: 18, tintColor: "#777" },
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
  disabledSelect: {
    backgroundColor: "#f2f2f2",
    opacity: 0.6,
  }, emptyOption: {
    paddingVertical: 14,
    alignItems: "center",
  },

  emptyText: {
    color: "#999",
    fontStyle: "italic",
    fontSize: 14,
  },
  rentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },

  sameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  sameText: {
    fontSize: 14,
    color: "#2563EB",
    marginLeft: 6,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: "#2563EB",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxChecked: {
    backgroundColor: "#2563EB",
  },

  tick: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },


  checkboxDot: {
    width: 8,
    height: 8,
    backgroundColor: "#fff",
    borderRadius: 2,
  },



  disabledInput: {
    backgroundColor: "#F6F8FF",
    padding: 5,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },




});
