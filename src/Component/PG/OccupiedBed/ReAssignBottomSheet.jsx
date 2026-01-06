import React, { useRef, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput, Keyboard, PanResponder, KeyboardAvoidingView
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

  const { activeHostelId } = useContext(CommonContexts);
  const { getAllFloorsByHostel, getAllRoomsByFloor } = useFloor();
  const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel, changeBedCustomer, getCustomerDetails } = useCustomer();

 
  useEffect(() => {
    if (sameAsCurrent) {
      setRentAmount(String(selectedBed?.rentAmount || ""));
    }
  }, [sameAsCurrent]);
  const today = dayjs().format("YYYY-MM-DD");


  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 500,
      duration: 250,
      useNativeDriver: true,
    }).start();
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
        navigation.navigate({
          name: "PG",
          params: { refresh: true },
          merge: true,
        });
      }, 800);


    } else {
      alert(res.message || "Change bed failed");
    }
  };


  return (
    <>
      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}

      />
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />

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
            onPress={() => setShowDatePicker(true)}
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.inputBox} >
              <TextInput
                style={styles.inputField}
                placeholder="Enter Amount"
                value={rentAmount}
                onChangeText={(text) => {
                  setRentAmount(text);
                  setRentError("");
                }}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />

            </View>
            {rentError && (
              <ErrorMessage message={rentError} type="error" />
            )}
          </KeyboardAvoidingView>
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
            <Calendar
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

  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    justifyContent: "space-between",
    paddingTop: 25,
    marginBottom: 20
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
