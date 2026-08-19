import React, { useContext, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    PanResponder,
    TextInput,
    Image,
    StyleSheet,
    TouchableWithoutFeedback, Keyboard,
    ScrollView
} from "react-native";
import dayjs from "dayjs";
import { Calendar } from "react-native-calendars";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import AlertIcon from "../../../Assets/Images/AlertIcon.png"
import DropdownArrow from "../../../Assets/Images/direction_down.png"
import CalenderIcon from "../../../Assets/Images/calendar.png"
import { ElectricityContext } from "../../../Context/ElectricityContext";
import { CommonContexts } from "../../../Context/CommonContext";

export default function ResetEBAmount({
    visible,
    onClose,
    roomInfo,
}) {

    const translateY = useRef(new Animated.Value(500)).current;


    const { resetEBMeterReading, GetEBRoomReading, ParticularRoomReadingDetails } = useContext(ElectricityContext);
    const { activeHostelId } = useContext(CommonContexts);
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [modalType, setModalType] = useState("success");

    const [isSubmitClicked, setIsSubmitClicked] = useState(false)
    const [openReason, setOpenReason] = useState(false)
    const [selectedReason, setSelectedReasonType] = useState("")
    const [errormsg, setErrorMsg] = useState("")
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [meterReading, setMeterReading] = useState("")
    const [dateError, setDateError] = useState("")
    const [readingError, setReadingError] = useState("")

    const reasonType = [{ id: 1, type: "Meter Replaced" }, { id: 2, type: "Meter Reset" }, { id: 3, type: "Other" }
    ]


    console.log("RoomeIfo", roomInfo)


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



    const handleClose = () => {
        setSelectedReasonType("")
        setSelectedStartDate(null)
        setMeterReading("")
        setDateError("")
        setReadingError("")
        setIsSubmitClicked(false)
        onClose();
    }

    // 🔥 Open / Close animation
    useEffect(() => {

        Animated.timing(translateY, {
            toValue: visible ? 0 : 500,
            duration: 250,
            useNativeDriver: true,
        }).start();

    }, [visible]);
    useEffect(() => {
        if (!visible) {
            setSelectedReasonType("")
            setSelectedStartDate(null)
            setMeterReading("")
            setDateError("")
            setReadingError("")
            setIsSubmitClicked(false)
        }
    }, [visible])

    // 🔥 Swipe down close
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) translateY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 120) {
                    handleClose();
                }
                else Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
            },
        })
    ).current;





    const handleResetReading = async () => {

        let hasError = false;

        if (!selectedStartDate) {
            setDateError("Please select starting date");
            hasError = true;
        }

        if (!meterReading) {
            setReadingError("Provide reading");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        if (isSubmitClicked) return;

        const payload = {
            roomId: roomInfo?.roomId,
            resetOn: dayjs(selectedStartDate).format("DD-MM-YYYY") || "",
            startReading: Number(meterReading)
        }

        try {
            setIsSubmitClicked(true)

            const res = await resetEBMeterReading(activeHostelId, payload)
            console.log("SuccesofReset", res)

            if (res?.status == 200) {
                GetEBRoomReading(activeHostelId);
                ParticularRoomReadingDetails(activeHostelId, roomInfo?.roomId);
                setShowSuccess(true)
                setMessage(res?.data || "Reset Success")
                setModalType("success")

                setTimeout(() => {
                    setShowSuccess(false)
                    handleClose()
                    setIsSubmitClicked(false)
                }, 1100);
            } else {
                setShowSuccess(true)
                setMessage(res?.message)
                setModalType("error")

                setTimeout(() => {
                    setShowSuccess(false)
                    setIsSubmitClicked(false)
                }, 1500);
            }

        } catch (error) {
            console.log(error)
            setIsSubmitClicked(false)
        }

    }



    if (!visible) return null;

    return (

        <>
            <SuccessModal visible={showSuccess} message={message} type={modalType} />

            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={StyleSheet.absoluteFillObject} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[styles.sheet, { transform: [{ translateY }] }]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.handle} />

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                        <View style={{ flexDirection: 'row', marginTop: 13, }}>
                            <Image source={AlertIcon} style={{ width: 17.5, height: 17.5, tintColor: '#E27625', marginTop: 4 }} />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={styles.headerTxt}>Reset EB Meter Reading</Text>
                                <Text style={styles.subTxt}>
                                    These files will be Reset the meter when the EB meter is replaced or its reading starts again from zero. </Text>
                            </View>
                        </View>

                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 16 }}>Reset Reason</Text>

                        <TouchableOpacity onPress={() => {
                            setOpenReason(!openReason)
                            setErrorMsg("")
                        }}
                            style={styles.inputBox}>
                            <Text style={styles.valueTxt}>{selectedReason ? selectedReason : "Select reason"}</Text>
                            <Image source={DropdownArrow} style={{ width: 21, height: 21, tintColor: '#28303F' }} />
                        </TouchableOpacity>

                        {errormsg && <ErrorMessage message={errormsg} type="error" />}


                        {openReason && (
                            <View style={{
                                borderWidth: 1, borderRadius: 10, marginTop: 8, borderColor: '#D9D9D9', elevation: 1,
                                backgroundColor: '#ffffff', paddingVertical: 4, paddingHorizontal: 18
                            }}>
                                {reasonType.map((i, index) => (
                                    <TouchableOpacity key={index} onPress={() => {
                                        setSelectedReasonType(i?.type)
                                        setOpenReason(false)
                                    }}
                                        style={{ marginVertical: 10 }}>
                                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>{i.type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}


                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 16 }}>Starting Date</Text>

                        <TouchableOpacity onPress={() => {
                            setOpenDatePicker(!openDatePicker)
                            setErrorMsg("")
                        }}
                            style={styles.inputBox}>
                            <Text style={styles.valueTxt}>
                                {selectedStartDate ? dayjs(selectedStartDate).format("DD-MM-YYYY") : "Select Date"}</Text>
                            <Image source={CalenderIcon} style={{ width: 16.5, height: 17, tintColor: '#28303F' }} />
                        </TouchableOpacity>

                        {dateError && <ErrorMessage message={dateError} type="error" />}

                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 16 }}>New Meter Reading</Text>

                        <View style={styles.meterInputBox}>
                            <TextInput
                                value={meterReading}
                                style={{ flex: 1 }}
                                placeholder="00000"
                                onChangeText={(text) => {
                                    const onlyNumbers = text.replace(/[^0-9]/g, "");
                                    setMeterReading(onlyNumbers)
                                    setReadingError("")
                                }} />
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>kWh</Text>
                        </View>

                        {readingError && <ErrorMessage message={readingError} type="error" />}

                    </ScrollView>


                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}>
                        <TouchableOpacity onPress={handleClose}
                            style={{
                                borderWidth: 1, borderColor: "#E8E8E8", paddingHorizontal: 10, paddingVertical: 12,
                                borderRadius: 10, flex: 1, alignItems: 'center', marginRight: 8
                            }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Cancel</Text>
                        </TouchableOpacity>


                        <TouchableOpacity onPress={handleResetReading} disabled={isSubmitClicked}
                            style={[{
                                backgroundColor: "#1E45E1", alignItems: 'center', flexDirection: 'row', alignSelf: 'center', justifyContent: 'center',
                                paddingHorizontal: 10, paddingVertical: 12, borderRadius: 10, flex: 1, marginLeft: 8,
                            }, isSubmitClicked && { opacity: 0.4 }]}>
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', color: '#ffffff', marginLeft: 8 }}>
                                Reset Meter</Text>
                        </TouchableOpacity>
                    </View>



                </Animated.View>
            </View>
            {openDatePicker && (
                <View style={styles.dateOverlay}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setOpenDatePicker(false)}
                    />

                    <View style={styles.datePickerBox}>
                        <Calendar
                            // minDate={
                            //   bookingDateObj
                            //     ? bookingDateObj.format("YYYY-MM-DD")
                            //     : undefined
                            // }
                            minDate={dayjs().format("YYYY-MM-DD")}
                            // maxDate={dayjs().format("YYYY-MM-DD")}   
                            onDayPress={(day) => {
                                const selected = dayjs(day.dateString);

                                // extra safety check
                                //   if (
                                //     bookingDateObj &&
                                //     selected.isBefore(bookingDateObj, "day")
                                //   ) {
                                //     return;
                                //   }

                                setSelectedStartDate(selected);
                                setDateError("");
                                setOpenDatePicker(false);
                            }}
                            markedDates={
                                selectedStartDate
                                    ? {
                                        [dayjs(selectedStartDate).format("YYYY-MM-DD")]: {
                                            selected: true,
                                            selectedColor: "#1D5DFF",
                                        },
                                    }
                                    : {}
                            }
                        />
                    </View>
                </View>
            )}
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
    headerTxt: {
        fontSize: 19.5, fontFamily: 'Gilroy-Medium'
    },
    subTxt: {
        fontSize: 13.5, fontFamily: 'Gilroy-Regular', color: '#3C3C4399',
        marginTop: 12, lineHeight: 20
    },
    inputBox: {
        borderWidth: 1, borderRadius: 8, borderColor: '#D9D9D9', paddingVertical: 16,
        paddingHorizontal: 14, marginTop: 14, flexDirection: 'row',
        justifyContent: 'space-between', fontSize: 15,
        fontFamily: "Gilroy-Medium", alignItems: 'center'
    },
    meterInputBox: {
        borderWidth: 1, borderRadius: 8, borderColor: '#D9D9D9', paddingVertical: 6,
        paddingHorizontal: 14, marginTop: 14, flexDirection: 'row',
        justifyContent: 'space-between', fontSize: 15,
        fontFamily: "Gilroy-Medium", alignItems: 'center'
    },
    valueTxt: {
        fontSize: 15, fontFamily: "Gilroy-Medium", color: '#222222'
    },
    dateOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center", zIndex: 9999
    },

    datePickerBox: {
        backgroundColor: "#fff",
        width: "90%",
        alignSelf: "center",
        borderRadius: 20,
        padding: 10,
        marginBottom: 70,
    },
})