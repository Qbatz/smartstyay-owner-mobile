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
  PanResponder, Dimensions
} from "react-native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import DirectionDownIcon from "../../Assets/Images/direction_down.png";
import CalendorIcon from "../../Assets/Images/calendar.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import { CommonContexts } from "../../Context/CommonContext";
import { useCustomer } from '../../Context/CustomerContext';
import { useFloor } from "../../Context/PayingGuestContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ReassignBedSheet({ visible, onClose, customer }) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  console.log("customer", customer)
  const { activeHostelId } = useContext(CommonContexts);
  const { getAllFloorsByHostel, getAllRoomsByFloor } = useFloor();
  const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel,changeBedCustomer } = useCustomer();
  const [reFloor, setReFloor] = useState("");
  const [reRoom, setReRoom] = useState("");
  const [reBed, setReBed] = useState("");

  const [date, setDate] = useState(null);

  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);

  // const [floors,setFloors]  =useState ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"];
  const [floorOpen, setFloorOpen] = useState(false);
  const [floorSelected, setFloorSelected] = useState(null);
  // const [rooms,setRooms] = useState["Room_1", "Room_2", "Room_3", "Room_4", "Room_5"];
  const [roomOpen, setRoomOpen] = useState(false);
  const [roomSelected, setRoomSelected] = useState(null);
  // const [beds,setBeds] =useState ["one", "two", "three", "four", "five"];
  const [bedOpen, setBedOpen] = useState(false);
  const [bedSelected, setBedSelected] = useState(null);

  const [dateError, setDateError] = useState("")
  const [floorError, setFloorError] = useState("")
  const [roomError, setRoomError] = useState("")
  const [bedError, setBedError] = useState("")
  const [rentError, setRentError] = useState("")
  const [disableSheetDrag, setDisableSheetDrag] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [disableSheetScroll, setDisableSheetScroll] = useState(false);
  const isFloorDisabled = !date;
  const isRoomDisabled = !date || !floorSelected;
  const isBedDisabled = !date || !floorSelected || !roomSelected;

  // values: "floor" | "room" | "bed" | null
  useEffect(() => {
    const isOpen = openDropdown !== null;
    setDisableSheetDrag(isOpen);
    setDisableSheetScroll(isOpen);
  }, [openDropdown]);

  const resetForm = () => {

    setDate(null);
    setAmount("");
    setReason("");

    setFloorSelected("Select a Floor");
    setRoomSelected("Select a Room");
    setBedSelected("Select a Bed");


    // setFloorOpen(false);
    setOpenDropdown(null)
    // setRoomOpen(false);
    // setBedOpen(false);
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

  /* 🔹 Swipe Gesture */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        if (disableSheetDrag) return false; // 🚫 block sheet drag
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
      console.log("Floor error", e);
      setFloors([]);
    }
  };



  console.log("floors", floors)
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
      console.log("Room error", e);
      setRooms([]);
    }
  };

  console.log("rooms", rooms)
  useEffect(() => {
    if (visible && activeHostelId) {
      loadFloors();        // 🔥 FLOOR API CALL
    }
  }, [visible, activeHostelId]);
  const loadBedsByDate = async (selectedDate) => {
    if (!activeHostelId || !selectedDate) return;

    const formattedDate = dayjs(selectedDate).format("DD-MM-YYYY");

    console.log("Calling bed API with:", formattedDate);

    try {
      const res = await getBedsByHostelAndDate(
        activeHostelId,
        formattedDate
      );

      if (res?.success) {
        setBeds(res.data.listBeds || []);
        console.log("test", res.data.listBeds)
      } else {
        setBeds([]);
      }
    } catch (err) {
      console.log("BED FETCH ERROR:", err);
      setBeds([]);
    }
  };
  console.log("beds", beds)
  // const filteredBeds = beds.filter((b) => {
  //   if (!floorSelected || !roomSelected) return false;

  //   return (
  //     b.floorName === floorSelected &&
  //     b.roomName === roomSelected &&
  //     b.currentStatus === "VACANT"
  //   );
  // });
  const filteredBeds = beds.filter(bed => {
    if (!floorSelected || !roomSelected) return false;

    return (
      bed.floorId === floorSelected.id &&
      bed.roomId === roomSelected.id &&
      bed.currentStatus === "VACANT"
    );
  });





  console.log("filteredBeds", filteredBeds)
 const handleSubmit = async () => {
  const customerId = customer?.customerId || customer?.id;

  if (!customerId) {
    alert("Customer ID missing");
    return;
  }

  if (!bedSelected?.bedId) {
    alert("Bed not selected properly");
    return;
  }

  const payload = {
    bedId: bedSelected.bedId,
    rentAmount: Number(amount),
    joiningDate: dayjs(date).format("YYYY-MM-DD"),
    reason: reason || "",
  };

  console.log("CHANGE BED PAYLOAD", payload);

  const res = await changeBedCustomer(
    activeHostelId,
    customerId,
    payload
  );

  if (res.success) {
    await getCustomersByHostel(activeHostelId);
    closeSheet();
  } else {
    console.log("API FAIL MSG:", res.message);
    alert(res.message || "Change bed failed");
  }
};


  // const handleSubmit = () => {
  //   let valid = true;

  //   // reset errors
  //   setDateError("");
  //   setFloorError("");
  //   setRoomError("");
  //   setBedError("");
  //   setRentError("");

  //   if (!date) {
  //     setDateError("Date is required");
  //     valid = false;
  //   }

  //   if (floorSelected === "Select a Floor") {
  //     setFloorError("Please select a floor");
  //     valid = false;
  //   }

  //   if (roomSelected === "Select a Room") {
  //     setRoomError("Please select a room");
  //     valid = false;
  //   }

  //   if (bedSelected === "Select a Bed") {
  //     setBedError("Please select a bed");
  //     valid = false;
  //   }

  //   if (!amount || amount.trim() === "") {
  //     setRentError("Rent amount is required");
  //     valid = false;
  //   }

  //   if (!valid) return;


  //   console.log("SUBMIT DATA", {
  //     floorSelected,
  //     roomSelected,
  //     bedSelected,
  //     date: dayjs(date).format("YYYY-MM-DD"),
  //     amount,
  //     reason,
  //   });

  //   closeSheet();
  // };
  const hasRooms = rooms && rooms.length > 0;
  const hasBeds = filteredBeds && filteredBeds.length > 0;


  return (
    <>

      <TouchableWithoutFeedback onPress={closeSheet}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      {openDatePicker && (
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


                  setRooms([]);
                  setBeds([]);

                  loadBedsByDate(selectedDate);
                }}
              />


            </View>
          </TouchableWithoutFeedback>

        </View>
      )}


      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.headerBar} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={!disableSheetScroll}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 60,
          }}
        >
          <Text style={styles.title}>Re Assign Bed</Text>

          <Text style={styles.label}>Current Floor</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter Floor"
              keyboardType="numeric"
              // value={customer.floorName || "--"}
              onChangeText={setAmount}
              style={{ flex: 1 }}
            />
          </View>

          <Text style={styles.label}>Current Room</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter Room"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={{ flex: 1 }}
            />
          </View>
          <Text style={styles.label}>Current Bed</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter Bed"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={{ flex: 1 }}
            />
          </View>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.inputBox}
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



          <Text style={styles.label}>Floor</Text>

          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={[
                styles.select,
                isFloorDisabled && styles.disabledSelect
              ]}
              disabled={isFloorDisabled}
              onPress={() => setOpenDropdown("floor")}
            >
              <Text style={styles.selectText}>
                {floorSelected ? floorSelected.name : "Select a Floor"}
              </Text>
              <Image source={DownArrow} style={styles.arrow} />
            </TouchableOpacity>


            {/*           
           {openDropdown === "floor" && (
              <View style={styles.dropdownMenu}>
  <ScrollView
  nestedScrollEnabled
  keyboardShouldPersistTaps="handled"
  onTouchStart={() => setDisableSheetDrag(true)}
  onTouchEnd={() => setDisableSheetDrag(false)}
  style={{ maxHeight: 160 }}
>
                  {floors.map((v, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.option}
                     onPress={() => {
  setFloorSelected(v);
  setOpenDropdown(null);
}}
                    >
                      <Text style={styles.optionText}>{v}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )} */}
            {openDropdown === "floor" && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={{ maxHeight: 160 }}>
                  {floors.map((f) => (
                    <TouchableOpacity
                      key={f.id}
                      style={styles.option}
                      onPress={() => {

                        setFloorSelected(f);          // ✅ FULL OBJECT
                        setOpenDropdown(null);

                        setRoomSelected(null);
                        setBedSelected(null);
                        setRooms([]);


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
          <Text style={styles.label}>Room</Text>

          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={[
                styles.select,
                isRoomDisabled && styles.disabledSelect
              ]}
              disabled={isRoomDisabled}
              onPress={() => setOpenDropdown("room")}
            >
              <Text>
                {roomSelected ? roomSelected.name : "Select a Room"}
              </Text>
              <Image source={DownArrow} style={styles.arrow} />
            </TouchableOpacity>



            {openDropdown === "room" && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={{ maxHeight: 160 }}>

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
          <Text style={styles.label}>Bed</Text>

          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={[
                styles.select,
                isBedDisabled && styles.disabledSelect
              ]}
              disabled={isBedDisabled}
              onPress={() => setOpenDropdown("bed")}
            >
              <Text style={styles.selectText}>
                {bedSelected ? bedSelected.bedName : "Select a Bed"}
              </Text>
              <Image source={DownArrow} style={styles.arrow} />
            </TouchableOpacity>


            {openDropdown === "bed" && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={{ maxHeight: 160 }}>

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
          <Text style={styles.label}>Date *</Text>

          <Text style={styles.label}>New Rent Amount *</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={{ flex: 1 }}
            />
          </View>
          {rentError && (
            <ErrorMessage message={rentError} type="error" />
          )}
          <Text style={styles.label}>Reason *</Text>
          <View style={styles.textArea}>
            <TextInput
              multiline
              value={reason}
              onChangeText={setReason}
              placeholder="Enter Comments"
              style={styles.textAreaInput}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reassignBtn} onPress={handleSubmit}>
              <Text style={{ color: "#fff" }}>Re Assign</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>


    </>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  // sheet: {
  //   position: "absolute",
  //   left: 0,           
  //   right: 0,      
  //   bottom: 0,
  //   width: "100%",
  //   backgroundColor: "#fff",
  //   borderTopLeftRadius: 30,
  //   borderTopRightRadius: 30,
  //   padding: 20,
  // },
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
    padding: 14,
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
  }



});
