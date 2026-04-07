import React, { useEffect, useState, useRef, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    PanResponder,
    TextInput,
    Keyboard,
    Platform,
    ScrollView, BackHandler
} from "react-native";
import dayjs from "dayjs";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import CloseIcon from "../../../Assets/Images/remove.png";
import { useCustomer } from "../../../Context/CustomerContext";
import { Calendar } from "react-native-calendars";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";

const SHEET_HEIGHT = 420;

export default function EditJoiningDateSheet({
    visible,
    onClose,
    onUpdate,
    initialDate,
    customerDetails, onSuccess
}) {
    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const keyboardOffset = useRef(new Animated.Value(0)).current;
    const { editJoiningDate } = useCustomer();
    const [date, setDate] = useState(initialDate || "");
    const [reason, setReason] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");


    const bookingDate =
        customerDetails?.bookingInfo?.bookingDate ||
        customerDetails?.hostelInfo?.bookingDate;


    const today = dayjs().format("YYYY-MM-DD");
    const minDate = bookingDate
  ? dayjs(bookingDate, "DD/MM/YYYY").format("YYYY-MM-DD")
  : undefined;


const maxDate = today;

    const [selectedDate, setSelectedDate] = useState(null);

    const [error, setError] = useState("");
    const [dateError,setDateError]=useState("")

    const resetState = () => {
        setSelectedDate(null);
        setReason("");
        setError("");
        setDateError("")
        setShowCalendar(false);
        onClose()
    };
    useEffect(() => {
        if (!visible) return;

        const onBackPress = () => {
            resetState();   // ✅ clear state + close sheet
            return true;    // ⛔ stop default back navigation
        };

        const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            onBackPress
        );

        return () => subscription.remove();
    }, [visible]);

    console.log("customerDetailsKeyboard", customerDetails)
    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
            Animated.timing(keyboardOffset, {
                toValue: e.endCoordinates.height - 20,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });

        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            Animated.timing(keyboardOffset, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    /* ---------------- OPEN / CLOSE ---------------- */
    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : SHEET_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    /* ---------------- PAN ---------------- */
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) translateY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 120) {
                    Keyboard.dismiss();
                    resetState();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;
    //    useEffect(() => {
    //     if (customerDetails?.hostelInfo?.joiningDate) {
    //       setSelectedDate(
    //         dayjs(customerDetails.hostelInfo.joiningDate, "DD/MM/YYYY").format(
    //           "YYYY-MM-DD"
    //         )
    //       );
    //     }
    //   }, [customerDetails]);

    if (!visible) return null;




    // const minDate = bookingDate
    //     ? dayjs(bookingDate, "DD/MM/YYYY").format("YYYY-MM-DD")
    //     : undefined;




    const handleUpdate = async () => {
        setError("");
        setDateError("")

        if (!selectedDate) {
            setDateError("Please select joining date");
            return;
        }

        const oldJoiningDate = customerDetails?.hostelInfo?.joiningDate;

        const oldDate = oldJoiningDate
            ? dayjs(oldJoiningDate, "DD/MM/YYYY").format("YYYY-MM-DD")
            : null;

        const newDate = selectedDate;


        if (oldDate && oldDate === newDate) {
            setDateError("No changes detected in Joining Date");
            return;
        }

        const formattedDate = dayjs(newDate).format("DD-MM-YYYY");

        const res = await editJoiningDate(
            customerDetails.hostelId,
            customerDetails.bookingId,
            {
                joiningDate: formattedDate,
                reason,
            }
        );

        if (res?.success) {
            setModalType("success");
            setMessage(res.data);
            setShowSuccess(true);

            await onSuccess();

            setTimeout(() => {
                setShowSuccess(false);
                resetState();
            }, 800);
        } else {
            setError(res?.message || "Update failed");
        }
    };



    //   const handleUpdate = async () => {
    //   setError("");

    //   if (!selectedDate) {
    //     setError("Please select joining date");
    //     return;
    //   }

    //   const formattedDate = dayjs(selectedDate).format("DD-MM-YYYY");

    //   const res = await editJoiningDate(
    //     customerDetails.hostelId,
    //     customerDetails.bookingId,
    //     {
    //       joiningDate: formattedDate,
    //       reason,
    //     }
    //   );

    //   if (res?.success) {
    //     onClose();
    //   } else {
    //     setError(res?.message || "Update failed");
    //   }
    // };

    // const formattedDate = dayjs(selectedDate).format("DD-MM-YYYY");


    if (!visible) return null;

    return (
        <>
            <SuccessModal visible={showSuccess} message={message} type={modalType} />
            <View style={styles.wrapper} pointerEvents="box-none">
                {/* BACKDROP */}
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={() => {
                        Keyboard.dismiss();
                        resetState();
                    }}
                />

                {/* SHEET */}
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.sheet,
                        {
                            transform: [
                                { translateY },
                                { translateY: Animated.multiply(keyboardOffset, -1) },
                            ],
                        },
                    ]}
                >
                    {/* HANDLE */}
                    <View style={styles.handle} />

                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 30 }}
                    >
                        {/* HEADER */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Edit Joining Date</Text>
                            {/* <TouchableOpacity onPress={onClose}>
              <Image source={CloseIcon} style={styles.closeIcon} />
            </TouchableOpacity> */}
                        </View>

                        {/* DATE */}
                        <Text style={styles.label}>
                            Edit Joining Date <Text style={{ color: "red" }}>*</Text>
                        </Text>

                        <TouchableOpacity
                            style={styles.inputBox}
                            onPress={() => setShowCalendar(true)}
                        >
                            <Text style={styles.placeholder}>
                                {selectedDate
                                    ? dayjs(selectedDate).format("DD/MM/YYYY")
                                    : "DD/MM/YYYY"}
                            </Text>

                            <Image source={CalendarIcon} style={styles.calendarIcon} />
                        </TouchableOpacity>

                        {dateError && (
                            <ErrorMessage message={dateError} type="error" />
                        )}





                        {/* REASON */}
                        <Text style={[styles.label,{marginTop:16}]}>Reason</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Enter your reason"
                            value={reason}
                            onChangeText={(text)=>{
                                setReason(text)
                                setError("")
                            }}
                            multiline
                        />
                        {error && (
                            <ErrorMessage message={error} type="error" />
                        )}
                       
                        <View style={styles.footer}>
                            <TouchableOpacity onPress={resetState}>
                                <Text style={[styles.cancel,{marginRight:15}]}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.updateBtn,{marginLeft:10}]}
                                
                                onPress={handleUpdate}
                            >
                                <Text style={styles.updateText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>

            </View>
            {showCalendar && (
                <View style={styles.calendarOverlay}>

                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setShowCalendar(false)}
                    />

                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.calendarSheet}
                        onPress={() => { }}
                    >
                       <Calendar
  current={selectedDate || today}
  minDate={minDate}     
  maxDate={maxDate} 
  onDayPress={(day) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
    setError("");
    setDateError("")
  }}
  markedDates={{
    ...(selectedDate && {
      [selectedDate]: {
        selected: true,
        selectedColor: "#2563EB",
      },
    }),
  }}
  theme={{
    todayTextColor: "#2563EB",
    arrowColor: "#2563EB",
    selectedDayTextColor: "#fff",
    textDisabledColor: "#9CA3AF",
  }}
/>

                    </TouchableOpacity>
                </View>
            )}


        </>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    sheet: {
        height: SHEET_HEIGHT,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    handle: {
        width: 60,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#ccc",
        alignSelf: "center",
        marginBottom: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
    },
    closeIcon: {
        width: 22,
        height: 22,
    },
    label: {
        fontSize: 13,
        color: "#555",
        marginBottom: 6,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        // marginBottom: 16,
    },
    placeholder: {
        color: "#999",
    },
    calendarIcon: {
        width: 18,
        height: 18,
        tintColor: "#666",
    },
    textArea: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 14,
        minHeight: 90,
        textAlignVertical: "top",
        marginBottom: 5,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop:15
    },
    cancel: {
        color: "#2563EB",
        fontSize: 15,
    },
    updateBtn: {
        backgroundColor: "#1E40AF",
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 24,
    },
    updateText: {
        color: "#fff",
        fontWeight: "600",
    },
    disabledIcon: {
        opacity: 0.4,
        tintColor: "#9CA3AF", // light gray
    },
    datePickerBox: {
        backgroundColor: "#fff",
        width: "80%",

        borderRadius: 20,
        padding: 10,
        marginBottom: 190
    },
    calendarOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
        alignItems: "center",   // ⭐ IMPORTANT
        zIndex: 2000,
    },


    calendarSheet: {
        backgroundColor: "#fff",
        width: "90%",           // ⭐ better than 80%
        borderRadius: 20,
        padding: 12,
        marginBottom: 80,       // ⭐ THIS moves it UP
    },


});
