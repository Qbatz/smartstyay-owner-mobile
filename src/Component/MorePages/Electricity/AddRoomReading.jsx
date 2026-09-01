import React, { useRef, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  TextInput,
  Image,
  StyleSheet,
  TouchableWithoutFeedback, Keyboard
} from "react-native";
import dayjs from "dayjs";
import { ElectricityContext } from "../../../Context/ElectricityContext";
import { CommonContexts } from "../../../Context/CommonContext";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";
import { Calendar } from "react-native-calendars";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";

export default function AddRoomReading({
  visible,
  onClose,
  isEditMode,
  roomInfo,          // { roomName, floorName }
  initialValues,     // { reading, date }
}) {


  const { EbRoomReading,
    EbTenantReading,
    loading,
    error,
    errorMsg,
    GetEBRoomReading,
    GetEBTenantReading,
    ParticularRoomReadingDetails, particular_EbRoomReading,
    AddRoomReading, UpdateRoomReading,
    DeleteRoomReading, } = useContext(ElectricityContext);
  const { activeHostelId } = useContext(CommonContexts);

  const translateY = useRef(new Animated.Value(500)).current;


  const [openReadingDatePic, setOpenReadingDatePic] = useState(false);
  const [readingDate, setReadingDate] = useState(null);
  const [readingDateError, setReadingDateError] = useState("");
  const [editReadingData, setEditReadingData] = useState(null);
  const [currentReading, setCurrentReading] = useState("");
  const [readingError, setReadingError] = useState("");
  const [apiError, setApiError] = useState("");

  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [isSubmitClicked, setIsSubmitClicked] = useState(false)


  const today = dayjs();
  const isDisabledReadingDate = (d) => {
    if (!d) return false;

    if (d.isAfter(today, "day")) return true;

    return false;
  };

  console.log(readingDate)
  console.log("intialsVa", initialValues)



  const readingMarkedDates = {};

  for (let i = -180; i <= 180; i++) {
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

  //     useEffect(() => {
  //   if (visible && isEditMode && initialValues) {
  //     setCurrentReading(String(initialValues.reading));
  //     setReadingDate(
  //       dayjs(initialValues.date, ["DD-MM-YYYY", "DD/MM/YYYY"]).format("YYYY-MM-DD")
  //     );
  //   }
  // }, [visible]);

  useEffect(() => {
    if (visible && isEditMode && initialValues) {
      setCurrentReading(String(initialValues.currentReading));
      setReadingDate(
        dayjs(initialValues.entryDate, ["DD-MM-YYYY", "DD/MM/YYYY"]).format("YYYY-MM-DD")
      );
    }

    if (visible && !isEditMode) {
      setCurrentReading("");
      setReadingDate(null);
    }

    setReadingError("");
    setReadingDateError("");
    setApiError("");
  }, [visible, isEditMode, initialValues]);

  console.log("initialvalue", initialValues);


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
  // 🔥 Open / Close animation
  useEffect(() => {
    if (!visible) {
      setOpenReadingDatePic(false);
    }
    Animated.timing(translateY, {
      toValue: visible ? 0 : 500,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // 🔥 Swipe down close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) onClose();
        else Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  const formatApiMonth = (date) => {
    if (!date || date === "N/A") return "--";

    return dayjs(date, ["DD/MM/YYYY", "D/MM/YYYY", "DD-MM-YYYY"])
      .format("MMMM YYYY");
  };

  const handleSubmit = async () => {
    let hasError = false;

    setReadingError("");
    setReadingDateError("");
    setApiError("");

    if (!readingDate) {
      setReadingDateError("Please Select Reading Date");
      hasError = true;
    }

    if (!currentReading || Number(currentReading) <= 0) {
      setReadingError("Please Enter Valid Current Reading");
      hasError = true;
    }

    if (isEditMode && initialValues) {
      const isReadingChanged =
        Number(currentReading) !== Number(initialValues.currentReading);

      const isDateChanged = !dayjs(readingDate).isSame(
        dayjs(initialValues.entryDate, ["DD-MM-YYYY", "DD/MM/YYYY"]),
        "day"
      );

      if (!isReadingChanged && !isDateChanged) {
        setApiError("No changes detected");
        return;
      }
    }

    if (hasError) return;
    if (isSubmitClicked) return;

    const payload = {
      hostelId: activeHostelId,
      roomId: initialValues?.roomId,
      floorId: initialValues?.floorId,
      reading: Number(currentReading),
      readingDate: dayjs(readingDate).format("DD-MM-YYYY"),
      readingId: initialValues?.readingId || initialValues?.ebId,
    };

    try {
      setIsSubmitClicked(true)


      const res = isEditMode
        ? await UpdateRoomReading(payload)
        : await AddRoomReading(payload);

      if (res.success) {
        GetEBRoomReading(activeHostelId);
        ParticularRoomReadingDetails(activeHostelId, initialValues?.roomId);

        setModalType("success");
        setMessage(isEditMode ? "Reading Updated" : "Reading Added");
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          onClose();
          setCurrentReading("");
          setReadingDate(null);
            setIsSubmitClicked(false)
        }, 800);
      } else {
        setApiError(res?.message || "Something went wrong");
          setIsSubmitClicked(false)
      }
    } catch (error) {
       setIsSubmitClicked(false)
    }
  };


  if (!visible) return null;

  return (

    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />

      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>
            {isEditMode ? "Edit Room Reading" : "Add Room Reading"}
          </Text>

          {/* Room Info */}
          <View style={styles.roomRow}>
            <Image source={RoomIcon} style={styles.icon} />
            <View>
              <Text style={styles.roomName}>{roomInfo?.roomName}</Text>
              <Text style={styles.floor}>{roomInfo?.floorName}</Text>
            </View>
          </View>

          {/* Reading */}


          {/* Date */}
          <Text style={styles.label}>
            Reading Date <Text style={{ color: "red" }}>*</Text>
          </Text>
          {/* <View style={styles.dateInputWrapper}>
  <TextInput
    style={styles.dateInput}
    placeholder="DD-MM-YYYY"
    value={readingDate ? dayjs(readingDate).format("DD-MM-YYYY") : ""}
    editable={false}
    pointerEvents="none"
  />

  <TouchableOpacity
    style={styles.calendarIconWrapper}
    onPress={() => setOpenReadingDatePic(true)}
  >
    <Image
      source={require("../../../Assets/Images/calendar.png")}
      style={styles.calendarIcon}
    />
  </TouchableOpacity>

</View> */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setOpenReadingDatePic(true)}
          >
            <View style={styles.dateInputWrapper}>
              <TextInput
                style={styles.dateInput}
                placeholder="DD-MM-YYYY"
                value={readingDate ? dayjs(readingDate).format("DD-MM-YYYY") : ""}
                editable={false}     // still non-editable
                pointerEvents="none" // input doesn't block touch
              />

              <Image
                source={require("../../../Assets/Images/calendar.png")}
                style={styles.calendarIcon}
              />
            </View>
          </TouchableOpacity>

          {openReadingDatePic && (
            <View style={styles.dateOverlay}>
              <TouchableWithoutFeedback onPress={() => setOpenReadingDatePic(false)}>
                <View style={styles.overlayBg} />
              </TouchableWithoutFeedback>

              <View style={styles.calendarContainer}>
                <Calendar
                  markingType="custom"
                  markedDates={readingMarkedDates}
                  current={
                    readingDate
                      ? dayjs(readingDate).format("YYYY-MM-DD")
                      : dayjs().format("YYYY-MM-DD")
                  }
                  onDayPress={(day) => {
                    if (readingMarkedDates[day.dateString]?.disabled) return;

                    setReadingDate(day.dateString);
                    setOpenReadingDatePic(false);
                    setReadingDateError("");
                    setApiError("");
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


          {readingDateError &&
            <ErrorMessage message={readingDateError} type="error" />
          }

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <Text style={styles.sheetLabel}>Current Reading <Text style={{ color: "red" }}>*</Text></Text>

            <TouchableOpacity>
              <Text style={styles.lastReading}>Last Reading : {initialValues?.currentReading} </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={currentReading}

            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, "");
              setCurrentReading(onlyNumbers);
              setReadingError("");
              setApiError("");
            }}
            placeholder="Enter Reading"
          />
          {readingError &&
            <ErrorMessage message={readingError} type="error" />}

          {apiError &&
            <ErrorMessage message={apiError} type="error" />
          }

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.submit,isSubmitClicked && {opacity:0.4}]}
             onPress={handleSubmit} disabled={isSubmitClicked}>
              <Text style={{ color: "#fff" }}>
                {isEditMode ? "Update" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  /* ===== Overlay ===== */
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
    zIndex: 999,
  },

  /* ===== Bottom Sheet ===== */
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },

  /* ===== Room Info ===== */
  roomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  icon: {
    width: 42,
    height: 42,
    marginRight: 12,
  },

  roomName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  floor: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  /* ===== Labels ===== */
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },

  /* ===== Input ===== */
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#fff",
    marginBottom: 6,
  },

  /* ===== Error ===== */
  error: {
    color: "#DC2626",
    fontSize: 12,
    marginBottom: 10,
  },

  /* ===== Buttons ===== */
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },

  cancel: {
    width: "48%",
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },

  submit: {
    width: "48%",
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#1E45E1",
    alignItems: "center",
  },


  /* Calendar modal */

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
  sheetLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  lastReading: { color: "#1E45E1", fontWeight: "600" },
});
