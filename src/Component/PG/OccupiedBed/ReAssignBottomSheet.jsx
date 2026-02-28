import React, { useRef, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput, Keyboard, PanResponder, KeyboardAvoidingView,ScrollView
} from "react-native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { Calendar } from "react-native-calendars";
import customParseFormat from "dayjs/plugin/customParseFormat";
import FloorIcon from "../../../Assets/Images/FloorImg.png";
import RoomIcon from "../../../Assets/Images/RoomImg.png";
import BedIcon from "../../../Assets/Images/RoomImg.png";
import SwapIcon from "../../../Assets/Images/swap.png";
import CalendarImg from "../../../Assets/Images/calendar.png";
import Assign from "../../../Assets/Images/exchange.png";
import { useFloor } from "../../../Context/PayingGuestContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";
import { useNavigation } from "@react-navigation/native";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import minMax from "dayjs/plugin/minMax";
dayjs.extend(minMax);



export default function ConfirmReassignSheet({
  visible,
  onClose,
  current,
  next,
  selectedNewBed, selectedBed

}) {
  dayjs.extend(customParseFormat);
  const translateY = useRef(new Animated.Value(500)).current;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const [rentAmount, setRentAmount] = useState("");
  const [reason, setReason] = useState("");
  const navigation = useNavigation();
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [dateError, setDateError] = useState("")
  const [rentError, setRentError] = useState("")
  const [customerdetails, setCustomerDetails] = useState(null)

 const scrollRef = useRef(null);
  const reasonRef = useRef(null);
  const { activeHostelId } = useContext(CommonContexts);
  const { getAllFloorsByHostel, getAllRoomsByFloor } = useFloor();
  const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel, changeBedCustomer, getCustomerDetails } = useCustomer();

 
  useEffect(() => {
    if (sameAsCurrent) {
      setRentAmount(String(selectedBed?.rentAmount || ""));
    }
  }, [sameAsCurrent]);

 
 useEffect(() => {
  const fetchCustomerDetails = async () => {
    const tenantId = selectedBed?.currentTenantInfo?.[0]?.tenetId;

    if (!tenantId || !activeHostelId) return;

    const res = await getCustomerDetails(tenantId);

    if (res?.success) {
      setCustomerDetails(res?.data);
    }
  };

  fetchCustomerDetails();
}, [selectedBed, activeHostelId]);

console.log("customerdetails", customerdetails);


  const today = dayjs().startOf("day");


  const joiningDateRaw = selectedBed?.currentTenantInfo?.[0]?.joiningDate;

const joiningDate = joiningDateRaw
  ? dayjs(joiningDateRaw, ["DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD"])
  : null;

 const bedHistory = customerdetails?.bedHistory || [];
  console.log("bedhistory", bedHistory);

  const invoices = customerdetails?.invoiceResponseList || [];

const lastBillDate =
  invoices.length > 0
    ? dayjs(
        invoices[invoices.length - 1].invoiceGeneratedDate,
        ["DD/MM/YYYY", "DD-MM-YYYY"]
      )
    : null;
  

let latestBedChangeDate = null;

if (bedHistory.length > 0) {
  const lastRecord = bedHistory[bedHistory.length - 1];

  if (lastRecord.endDate === "Till date") {
    latestBedChangeDate = dayjs(
      lastRecord.startDate,
      ["DD/MM/YYYY", "DD-MM-YYYY"]
    );
  } else {
    const validDates = bedHistory
      .filter(b => b.startDate)
      .map(b =>
        dayjs(b.startDate, ["DD/MM/YYYY", "DD-MM-YYYY"])
      );

    if (validDates.length > 0) {
      latestBedChangeDate = dayjs.max(validDates);
    }
  }
}

const joinedThisMonth =
  joiningDate &&
  joiningDate.month() === today.month() &&
  joiningDate.year() === today.year();

let compareDate;

if (joinedThisMonth) {
  compareDate = latestBedChangeDate || joiningDate;
} else {
  compareDate =
    latestBedChangeDate || lastBillDate || joiningDate;
}

// const compareDate = latestBedChangeDate || joiningDate;




const isDateDisabled = (date) => {
  if (!date) return false;

  const d = dayjs(date);

  // ❌ future block
  if (d.isAfter(today, "day")) return true;

  // ❌ before latest bed change OR joining date
  if (compareDate && d.isBefore(compareDate, "day")) return true;

  return false;
};

// const isDateDisabled = (date) => {
//   if (!date) return false;

//   const d = dayjs(date);

//   if (joiningDate && d.isBefore(joiningDate, "day")) return true;


//   if (d.isAfter(today, "day")) return true;

//   return false;
// };


const markedDates = {};

for (let i = -180; i <= 180; i++) {
  const d = dayjs().add(i, "day");
  const key = d.format("YYYY-MM-DD");

  if (isDateDisabled(d)) {
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

// selected highlight
if (selectedDate) {
  markedDates[dayjs(selectedDate).format("YYYY-MM-DD")] = {
    selected: true,
    selectedColor: "#1E45E1",
  };
}
// const keyboardHeight = useRef(new Animated.Value(0)).current;

// useEffect(() => {
//   const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
//     Animated.timing(keyboardHeight, {
//       toValue: e.endCoordinates.height,
//       duration: 250,
//       useNativeDriver: false,
//     }).start();
//   });

//   const hideSub = Keyboard.addListener("keyboardDidHide", () => {
//     Animated.timing(keyboardHeight, {
//       toValue: 0,
//       duration: 250,
//       useNativeDriver: false,
//     }).start();
//   });

//   return () => {
//     showSub.remove();
//     hideSub.remove();
//   };
// }, []);
const [keyboardHeight, setKeyboardHeight] = useState(0);

useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height + 60,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

// useEffect(() => {
//   const show = Keyboard.addListener("keyboardDidShow", (e) => {
//     setKeyboardHeight(e.endCoordinates.height);
//   });

//   const hide = Keyboard.addListener("keyboardDidHide", () => {
//     setKeyboardHeight(0);
//   });

//   return () => {
//     show.remove();
//     hide.remove();
//   };
// }, []);


// const [keyboardOpen, setKeyboardOpen] = useState(false);

// useEffect(() => {
//   const show = Keyboard.addListener("keyboardDidShow", () =>
//     setKeyboardOpen(true)
//   );
//   const hide = Keyboard.addListener("keyboardDidHide", () =>
//     setKeyboardOpen(false)
//   );

//   return () => {
//     show.remove();
//     hide.remove();
//   };
// }, []);

  useEffect(() => {
  Animated.timing(translateY, {
  toValue: visible ? 0 : 500,
  duration: 250,
  useNativeDriver: true,
}).start();

  }, [visible])

  

useEffect(() => {
  if (visible) {
    setSelectedDate(null);
    setRentAmount("");
    setSameAsCurrent(false);
    setReason("");
    setDateError("");
    setRentError("");
  }
}, [visible]);



  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 150) onClose();
      else
      Animated.spring(translateY, {
  toValue: 0,
  useNativeDriver: true,
}).start();

    },
  });


  if (!visible) return null;

  const handleSubmitReassign = async () => {
    let hasError = false;

    setDateError("");
    setRentError("");

    if (!selectedDate) {
      setDateError("Please select date");
      hasError = true;
    }

    if (!rentAmount || Number(rentAmount) <= 0) {
      setRentError("Enter valid rent amount");
      hasError = true;
    }


    if (hasError) return;


    const payload = {
      bedId: selectedNewBed.bed.id,
      rentAmount: Number(rentAmount),
      joiningDate: dayjs(selectedDate).format("DD-MM-YYYY"),
      reason: reason || "Bed reassigned",
    };
   

    const res = await changeBedCustomer(
      activeHostelId,
      selectedBed.currentTenantInfo[0]?.tenetId,
      payload
    );

    if (res.success) {
      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        // navigation.navigate({
        //   name: "PG",
        //   params: { refresh: true },
        //   merge: true,
        // });
      }, 800);


    } else {
      // alert(res.message || "Change bed failed");
       setModalType("error");
      setMessage(res.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
       
      }, 800);
    }
  };


  return (
    <>
      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}

      />
     <View
  style={styles.overlay}

>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>


 <Animated.View
           {...panResponder.panHandlers}
 style={[
  styles.sheet,
  {
    transform: [{ translateY }],
  },
]}

         >
          <View style={styles.handle} />
 <ScrollView
  ref={scrollRef}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="on-drag"
  contentContainerStyle={{
    paddingBottom:  20,
    flexGrow: 1,
  }}
>

          <Text style={styles.title}>Confirm Change Bed</Text>


          <Text style={styles.sectionLabel1}>Current Bed</Text>
          <View style={styles.row}>
            <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
              <Image source={FloorIcon} style={styles.icon} />
              <Text style={styles.valueText}>{selectedBed.floorName}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
              <Image source={RoomIcon} style={styles.icon} />
              <Text style={styles.valueText}>{selectedBed.roomName}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
              <Image source={BedIcon} style={styles.icon} />
              <Text style={styles.valueText}>{selectedBed.bedName}</Text>
            </View>
          </View>

          <View style={styles.swapWrapper}>
            <Image source={SwapIcon} style={styles.swapIcon} />
          </View>


          <Text style={styles.sectionLabel1}>New Bed</Text>
          <View style={styles.row1}>
            <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
              <Image source={FloorIcon} style={styles.icon} />
              <Text style={styles.valueText}>{selectedNewBed.bed.floorName}</Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
              <Image source={RoomIcon} style={styles.icon} />
              <Text style={styles.valueText}>{selectedNewBed.bed.roomName}</Text></View>
            <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
              <Image source={BedIcon} style={styles.icon} />
              <Text style={styles.valueText}>{selectedNewBed.bed.bedName}</Text></View>
          </View>


          <Text style={styles.sectionLabel}>Date <Text style={{color:"red"}}>*</Text></Text>
          <TouchableOpacity
            // onPress={() => setShowDatePicker(true)}
            onPress={() => {
  Keyboard.dismiss();          
  setTimeout(() => {
    setShowDatePicker(true);  
  }, 150);
}}
            style={styles.inputBoxDate}
          >
            <Text style={{ color: selectedDate ? "#000" : "#999" }}>
              {selectedDate
                ? dayjs(selectedDate).format("DD/MM/YYYY")
                : "Select Date"}
            </Text>

            <Image source={CalendarImg} style={styles.icon} />
          </TouchableOpacity>
          {dateError && (
            <ErrorMessage message={dateError} type="error" />
          )}


          <View style={styles.rentHeaderRow}>
            <Text style={styles.sectionLabel}>New Rent Amount  <Text style={{color:"red"}}>*</Text></Text>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => {
                setSameAsCurrent((prev) => {
                  const next = !prev;

                  if (next) {

                    setRentAmount(String(selectedBed?.rentAmount || ""));
                  } else {

                    setRentAmount("");
                  }

                  setRentError("");
                  return next;
                });
              }}
            >
              <View style={[styles.checkbox, sameAsCurrent && styles.checkboxActive]}>
                {sameAsCurrent && <Text style={styles.tick}>✓</Text>}
              </View>

              <Text style={styles.checkboxLabel}>Same as Current</Text>
            </TouchableOpacity>

          </View>
         
            <View style={styles.inputBox} >
              <TextInput
                style={styles.inputField}
                placeholder="Enter Amount"
                value={rentAmount}
                onChangeText={(t) => {
                  const cleaned = t.replace(/[^0-9]/g, "");
                  setRentAmount(cleaned);
                  // setRentAmount(text);
                  setRentError("");
                }}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />

            </View>
            {rentError && (
              <ErrorMessage message={rentError} type="error" />
            )}
         
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>



            <TouchableOpacity style={styles.assignBtn} onPress={handleSubmitReassign}>
              <View style={styles.assignRow}>
                <Image source={Assign} style={styles.assignIcon} />
                <Text style={styles.assignText}>Assign</Text>
              </View>
            </TouchableOpacity>

          </View>
          </ScrollView>
        </Animated.View>
      
      </View>
      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <TouchableWithoutFeedback
            onPress={() => setShowDatePicker(false)}
          >
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            {/* <Calendar
              current={today}
              maxDate={today}
              onDayPress={(day) => {
                setSelectedDate(dayjs(day.dateString, "YYYY-MM-DD"));
                setShowDatePicker(false);
                setDateError("")
              }}
              markedDates={
                selectedDate
                  ? {
                    [dayjs(selectedDate).format("YYYY-MM-DD")]: {
                      selected: true,
                      selectedColor: "#1E45E1",
                    },
                  }
                  : {}
              }
              theme={{
                todayTextColor: "#1E45E1",
                selectedDayBackgroundColor: "#1E45E1",
                arrowColor: "#1E45E1",
                textDisabledColor: "#9CA3AF",
              }}
            /> */}
            <Calendar
  current={today.format("YYYY-MM-DD")}
  maxDate={today.format("YYYY-MM-DD")} // ❌ future block
  markingType="custom"
  markedDates={markedDates}
  onDayPress={(day) => {
    if (isDateDisabled(day.dateString)) return;

    setSelectedDate(dayjs(day.dateString, "YYYY-MM-DD"));
    setShowDatePicker(false);
    setDateError("");
  }}
  theme={{
    todayTextColor: "#1E45E1",
    selectedDayBackgroundColor: "#1E45E1",
    arrowColor: "#1E45E1",
    textDisabledColor: "#9CA3AF",
  }}
/>



          </View>
        </View>
      )}
    </>
  );
}



const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

//  sheet: { backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25, maxHeight: "90%", },

sheet: {
  backgroundColor: "#fff",
  paddingHorizontal: 20,
  paddingTop: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  maxHeight: "90%",
  paddingBottom: 30,
},

  handle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 12,
  },
  tick: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },


  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
  },

  sectionLabel: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 14,
    color: "#555",
  },
  sectionLabel1: {
    marginTop: 14,
    marginBottom: 16,
    fontSize: 14,
    color: "#555",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    gap: 12,
    marginBottom: 10,
  },
   row1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    gap: 12,
    marginBottom:20,
    
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
    tintColor: "#1E45E1",

  },

  valueText: {
    fontSize: 15,
    fontWeight: "600",
  },

  swapIcon: {
    width: 35,
    height: 35,

  },
 swapWrapper: {
  alignItems: "center",    
  justifyContent: "center", 
  paddingTop:30
},

  inputField: {
     flex: 1,  
    fontSize: 15,
    color: "#000",
  },
  inputBoxDate: {
    borderWidth: 1,
    borderColor: "#ddd",

    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50, paddingLeft: 14
  },

  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",

    paddingLeft: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50
  },


  footer: {
        flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  marginTop: 20,
  marginBottom: 10,
  gap: 20, 
  },

  cancel: {
    fontSize: 16,
    color: "#777",
  },

  assignBtn: {
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  assignRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8, // spacing between icon & text (RN 0.71+)
  },

  assignIcon: {
    width: 16,
    height: 16,
    tintColor: "#fff",
    resizeMode: "contain",
  },

  assignText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },


  datePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 30,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    padding: 40,

  },

  datePickerBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 16
  },
  rentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 6,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: "#555",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  checkboxActive: {
    borderColor: "#1E45E1",
    backgroundColor: "#1E45E1",
  },

  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 2,
  },

  checkboxLabel: {
    fontSize: 13,
    color: "#444",
  },

});
