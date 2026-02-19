// AddRoomReadingSheet.js
import React, { useRef, useState,useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";

import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import dayjs from "dayjs";
import { Calendar } from "react-native-calendars";
import { ElectricityContext } from "../../Context/ElectricityContext";
import { CommonContexts } from "../../Context/CommonContext";
import SuccessModal from "../../ToastFile/ToastPage";




export default function AddRoomReadingSheet({
  visible,
  onClose,
  onSubmit,
  roomInfo,
  selectedPendingEb,settlementDetails,selectedItem,selectedBed,fetchSettlement
}) {
  const translateY = useRef(new Animated.Value(500)).current;

  const [readingDate, setReadingDate] = useState("");

  const [currentReading, setCurrentReading] = useState("");
  const [readingError, setReadingError] = useState("");
  const [openReadingDatePic, setOpenReadingDatePic] = useState(false);
const [readingDateError, setReadingDateError] = useState("");
 const { AddRoomReading,} = useContext(ElectricityContext);
 const { activeHostelId } = useContext(CommonContexts);
 const [modalType, setModalType] = useState("success");
     const [showSuccess, setShowSuccess] = useState(false);
     const [message, setMessage] = useState("");

 console.log("selectedPendingEb",selectedPendingEb)
 console.log("settlementDetails",settlementDetails)
 console.log("selectedItem",selectedItem)
  React.useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 500,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

 
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          onClose();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;
  const today = dayjs();
  const lastEntryDate = selectedPendingEb?.lastEntryDate
  ? dayjs(selectedPendingEb.lastEntryDate, "DD/MM/YYYY")
  : null;

const minSelectableDate = lastEntryDate
  ? lastEntryDate.add(1, "day")   // ✅ start from next day
  : null;

const isDisabledReadingDate = (date) => {
  if (!date) return false;

  // ❌ before min date
  if (minSelectableDate && date.isBefore(minSelectableDate, "day")) {
    return true;
  }

  // ❌ future date
  if (date.isAfter(today, "day")) {
    return true;
  }

  return false;
};

const readingMarkedDates = {};

for (let i = -365; i <= 365; i++) {
  const d = dayjs().add(i, "day");
  const key = d.format("YYYY-MM-DD");

  if (isDisabledReadingDate(d)) {
    readingMarkedDates[key] = {
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





//   const handleSubmit = () => {
//   setReadingError("");
//   setReadingDateError("");

//   if (!readingDate) {
//     setReadingDateError("Please Select Reading Date");
//     return;
//   }

//   if (!currentReading || Number(currentReading) <= 0) {
//     setReadingError("Please Enter Valid Current Reading");
//     return;
//   }

//   onSubmit({
//     reading: Number(currentReading),
//     readingDate: dayjs(readingDate).format("DD-MM-YYYY"), // ✅ final format
//     roomId: roomInfo?.roomId,
//     floorId: roomInfo?.floorId,
//   });
// };
  const customerId =
        selectedItem?.customerId || selectedBed?.currentTenantInfo?.[0]?.tenetId;

        console.log("customerId", customerId);
        
const handleSubmit = async () => {
  setReadingError("");
  setReadingDateError("");

  if (!readingDate) {
    setReadingDateError("Please Select Reading Date");
    return;
  }

  if (!currentReading || Number(currentReading) <= 0) {
    setReadingError("Please Enter Valid Current Reading");
    return;
  }

  const payload = {
    hostelId: activeHostelId, // OR pass hostelId as prop
    reading: Number(currentReading),
    readingDate: dayjs(readingDate).format("DD-MM-YYYY"),
    roomId: selectedItem?.roomId,
    floorId: selectedItem?.floorId,
  };

  const res = await AddRoomReading(payload);

  // if (res?.success) {
  //   onClose();               // ✅ close sheet
  //   setCurrentReading("");
  //   setReadingDate(
  //     minSelectableDate
  //       ? minSelectableDate.format("YYYY-MM-DD")
  //       : dayjs().format("YYYY-MM-DD")
  //   );
  // } 
   if (res.success) {
 setCurrentReading("");
   setReadingDate(""); 
  
      setModalType("success");
      setMessage(res?.data || "Reading Added");
      setShowSuccess(true);
      // onSuccess && onSuccess();
      // await fetchSettlement(customerId);
      await fetchSettlement();
      setTimeout(() => {
        setShowSuccess(false);
        onClose();

      }, 800);


    } 
  else {
    setReadingError(res?.message || "Something went wrong");
  }
};

  if (!visible) return null;

  return (

    <>
       <SuccessModal visible={showSuccess} message={message} type={modalType} />
   
    <View style={styles.sheetOverlay}>
      <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />

      <Animated.View
        style={[styles.sheetContainer, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.sheetHandle} />

        <Text style={styles.sheetTitle}>Add Room Reading</Text>

        {/* Room Info */}
        <View style={styles.sheetRoomRow}>
          <Image
            source={require("../../Assets/Images/Room_Icon.png")}
            style={styles.sheetRoomIcon}
          />
          <View>
            <Text style={styles.sheetRoomName}>{selectedPendingEb?.roomName}</Text>
            <Text style={styles.sheetFloor}>{selectedPendingEb?.floorName}</Text>
          </View>

       
        </View>

        {/* Input */}

<Text style={styles.sheetLabel}>
  Reading Date <Text style={{ color: "red" }}>*</Text>
</Text>

 <TouchableOpacity
    // style={styles.calendarIconWrapper}
    onPress={() => {
      setOpenReadingDatePic(true);
      setReadingDateError("");
      setReadingError("");
    }}
  >
<View style={styles.dateInputWrapper}>
  <TextInput
  style={styles.dateInput}
  placeholder="DD-MM-YYYY"
  value={readingDate ? dayjs(readingDate).format("DD-MM-YYYY") : ""}
  editable={false}
/>

 
    <Image
      source={require("../../Assets/Images/calendar.png")}
      style={styles.calendarIcon}
    />
 
</View>
 </TouchableOpacity>

{readingDateError && <ErrorMessage message={readingDateError} type="error" />}


        {/* <Text style={styles.sheetLabel}>
          Reading <Text style={{ color: "red" }}>*</Text>
        </Text>

        <TextInput
          placeholder="Please Enter Reading"
          style={styles.sheetInput}
          keyboardType="numeric"
          value={currentReading}
          onChangeText={(t) => {
            setCurrentReading(t.replace(/[^0-9]/g, ""));
            setReadingError("");
          }}
        /> */}
        <View style={styles.readingLabelRow}>
  <Text style={styles.sheetLabel}>
    Reading <Text style={{ color: "red" }}>*</Text>
  </Text>

  <Text style={styles.lastReadingText}>
    Last Reading: <Text style={styles.lastReadingValue}>{selectedPendingEb?.lastReading}</Text>
  </Text>
</View>

<TextInput
  placeholder="Enter Reading"
  style={styles.sheetInput}
  keyboardType="numeric"
  value={currentReading}
  onChangeText={(t) => {
    setCurrentReading(t.replace(/[^0-9]/g, ""));
    setReadingError("");
  }}
/>


        {readingError && <ErrorMessage message={readingError} type="error" />}

        {/* Buttons */}
        <View style={styles.sheetBtnRow}>
          <TouchableOpacity style={styles.sheetCancel} onPress={onClose}>
            <Text style={styles.sheetCancelTxt}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetAdd} onPress={handleSubmit}>
            <Text style={styles.sheetAddTxt}>Add</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      {openReadingDatePic && (
  <View style={styles.dateOverlay}>
    <TouchableWithoutFeedback onPress={() => setOpenReadingDatePic(false)}>
      <View style={styles.overlayBg} />
    </TouchableWithoutFeedback>

    <View style={styles.calendarContainer}>
 <Calendar
  markingType="custom"
  markedDates={readingMarkedDates}
  {...(readingDate && {
    current: dayjs(readingDate).format("YYYY-MM-DD"),
  })}
  onDayPress={(day) => {
    if (readingMarkedDates[day.dateString]?.disabled) return;

    setReadingDate(day.dateString);
    setOpenReadingDatePic(false);
    setReadingDateError("");
  }}
/>



    </View>
  </View>
)}

    </View>
     </>
  );
}

const styles = StyleSheet.create({
  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    zIndex: 9999,
  },

  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },

  sheetContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 60,
  },

  sheetHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },

  sheetRoomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  sheetRoomIcon: { width: 40, height: 40, marginRight: 12 },

  sheetRoomName: { fontSize: 16, fontWeight: "700" },
  sheetFloor: { color: "#777", marginTop: 3 },

  sheetDateLabel: { color: "#555", fontSize: 12 },
  sheetDateValue: { fontSize: 14, fontWeight: "700", color: "#000" },

  sheetLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  sheetInput: {
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginTop: 6,
    backgroundColor: "#fff",
  },

  sheetBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  sheetCancel: {
    width: "48%",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    alignItems: "center",
  },

  sheetAdd: {
    width: "48%",
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  sheetCancelTxt: { fontSize: 16, fontWeight: "600" },
  sheetAddTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  dateInputWrapper: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  height: 48,
  paddingHorizontal: 12,
  marginTop: 6,
},

dateInput: {
  flex: 1,
  fontSize: 14,
  color: "#111827",
},

calendarIconWrapper: {
  padding: 6,
},

calendarIcon: {
  width: 20,
  height: 20,
  tintColor: "#6B7280",
},

dateOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
},

overlayBg: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0,0,0,0.3)",
},

calendarContainer: {
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 10,
  width: "85%",
  elevation: 10,
},
readingLabelRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 6,
},



lastReadingText: {
  fontSize: 13,
  color: "#6B7280",
},

lastReadingValue: {
  fontWeight: "700",
  color: "#2563EB",
},

});
