import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  TextInput,
  ScrollView,
  BackHandler,
  Keyboard, Image,
  TouchableWithoutFeedback
} from "react-native";
import dayjs from "dayjs";
import { Calendar } from "react-native-calendars";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import { useCustomer } from "../../../Context/CustomerContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import DownArrow from "../../../Assets/Images/direction-down.png";
import MonthPicker from "react-native-month-year-picker";


export default function EditRentalAmountSheet({
  visible,
  onClose,
  customerDetails,
  onSuccess,
}) {

  const translateY = useRef(new Animated.Value(600)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(keyboardOffset, {
        toValue: e.endCoordinates.height - 20,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);


  const { editRentalAmount } = useCustomer();
  const { getBillingConfig } = UseSetting();
  // const [billingData, setBillingData] = useState("")
  const { activeHostelId } = useContext(CommonContexts);

  const [type, setType] = useState(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const [monthlyRent, setMonthlyRent] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [effectiveMonth, setEffectiveMonth] = useState(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [renteError, setRentError] = useState("");
  const [dateError, setDateError] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [billingData, setBillingData] = useState(null);

  // const billStartDate = billingData?.billStartDate;
  // const billDueDate = billingData?.billDueDate;
  const typeOfBilling = billingData?.typeOfBilling;

  const billStartDate = Number(billingData?.billStartDate) || 1;
  const billDueDate = Number(billingData?.billDueDate) || 1;

  console.log("billingdata", billingData);

  const today = dayjs();

  let startMonth;
  let endMonth;

  if (billingData && billStartDate && billDueDate) {
    if (typeOfBilling === "Joining Date Based") {
      startMonth = today.add(1, "month").startOf("month");
      endMonth = today.add(3, "month").endOf("month");
    } else {
      let cycleMonth = today.month();
      let cycleYear = today.year();

      if (today.date() > billStartDate) {
        const nextMonth = today.add(1, "month");
        cycleMonth = nextMonth.month();
        cycleYear = nextMonth.year();
      }

      const start = dayjs()
        .year(cycleYear)
        .month(cycleMonth)
        .date(billStartDate)
        .startOf("day");

      const end = start
        .add(2, "month")
        .date(billDueDate)
        .endOf("day");

      startMonth = start;
      endMonth = end;
    }
  }


  const isMonthDisabled = (year, monthIndex) => {
    if (!startMonth || !endMonth) return true;

    const current = dayjs()
      .year(year)
      .month(monthIndex)
      .startOf("month");

    return current.isBefore(startMonth, "month") || current.isAfter(endMonth, "month");
  }



  /* ================= RESET ================= */
  const resetState = () => {
    setType(null);
    setShowTypeDropdown(false);
    setMonthlyRent("");
    setEffectiveDate(null);
    setShowCalendar(false);
    setReason("");
    setError("");
    setRentError("")
    setDateError("")
    onClose();
  };


  useEffect(() => {
    if (activeHostelId) {
      loadBilling(activeHostelId);
    }
  }, [activeHostelId]);

  const loadBilling = async (id) => {
    const res = await getBillingConfig(id);
    console.log("Billing Data →", res);
    setBillingData(res.data)
  };
  console.log("billingData", billingData)



  const getBillingCycleRange = (billStartDate) => {
    const today = dayjs();

    let cycleMonth = today.month(); // 0-based

    if (today.date() >= billStartDate) {
      cycleMonth = today.add(1, "month").month();
    }

    const start = dayjs()
      .year(today.year() + (cycleMonth < today.month() ? 1 : 0))
      .month(cycleMonth)
      .date(billStartDate)
      .startOf("day");

    const end = start
      .add(1, "month")
      .date(billStartDate - 1)
      .endOf("day");

    return {
      minDate: start.format("YYYY-MM-DD"),
      maxDate: end.format("YYYY-MM-DD"),
    };
  };

  const billingRange = billStartDate
    ? getBillingCycleRange(billStartDate)
    : null;
  /* ================= BACK BUTTON ================= */
  useEffect(() => {
    if (!visible) return;

    const backAction = () => {
      resetState();
      return true;
    };

    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => sub.remove();
  }, [visible]);
  const getSheetHeight = () => {
    if (!type) return 240;                // only dropdown
    if (type === "Edit-Rent") return 480; // rent + reason
    if (type === "Rent-Revision") return 620; // full form
    return 560;
  };
  const sheetHeight = getSheetHeight();
  /* ================= OPEN / CLOSE ================= */
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : sheetHeight,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, sheetHeight]);


  /* ================= PAN ================= */
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

  if (!visible) return null;

  /* ================= SUBMIT ================= */
  const handleUpdate = async () => {
    let valid = true;
    setError("");

    if (!type) {
      setError("Please select type");
      valid = false;
    }

    if (!monthlyRent || Number(monthlyRent) <= 0) {
      setRentError("Please Enter Monthly Rent");
      valid = false;
    }

    if (type === "Rent-Revision" && !effectiveMonth) {
      setDateError("Please select effective Month");
      valid = false;
    }

    const oldAmount = Number(customerDetails?.hostelInfo?.monthlyRent);
    const newAmount = Number(monthlyRent);

    if (oldAmount === newAmount) {
      setError("No changes detected in Rent Amount");
      valid = false;
    }
    if (!valid) return;
    const payload = {
      newRent: newAmount,
      reason,
      // effectiveDate:
      //   type === "Rent-Revision"
      //     ? dayjs(effectiveDate).format("DD-MM-YYYY")
      //     : "",
      effectiveDate:
        type === "Rent-Revision"
          ? dayjs(effectiveMonth).format("MM-YYYY")
          : ""
    }

    const res = await editRentalAmount(
      customerDetails.hostelId,
      customerDetails.bookingId,
      payload
    );
    console.log("payload", payload)

    if (res?.success) {
      setMessage(res.data);
      setShowSuccess(true);
      await onSuccess?.();

      setTimeout(() => {
        setShowSuccess(false);
        resetState();
      }, 800);
    } else {
      setError(res?.message || "Update failed");
    }
  };

  console.log("showdatepicker", showCalendar);


  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type="success" />
      <View style={styles.wrapper} pointerEvents="box-none">
        {/* BACKDROP */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={resetState}
        />

        {/* SHEET */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              transform: [
                { translateY },
                { translateY: Animated.multiply(keyboardOffset, -1) }, // ⭐ IMPORTANT
              ],
            },
          ]}
        >
          <View style={styles.handle} />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 24,
              width: "100%",
            }}
          >
            <Text style={styles.title}>Edit Rental Amount</Text>



            {type === "Rent-Revision" && (
              <View style={styles.infoBanner}>
                <Text style={styles.infoIcon}>?</Text>
                <Text style={styles.infoText}>
                  Rent changes will apply from next billing cycle and are fully audit-logged
                </Text>
              </View>
            )}

            <Text style={styles.label}>Type <Text style={{ color: "red" }}>*</Text></Text>

            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !type && { color: "#9CA3AF" },
                ]}
              >
                {type === "Edit-Rent"
                  ? "Edit Rent"
                  : type === "Rent-Revision"
                    ? "Rent Revision"
                    : "Select Type"}
              </Text>
              <Image source={DownArrow} style={styles.arrow} />
            </TouchableOpacity>

            {showTypeDropdown && (
              <View style={styles.dropdownBox}>
                {[
                  { label: "Edit Rent", value: "Edit-Rent" },
                  { label: "Rent Revision", value: "Rent-Revision" },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setType(item.value);
                      setShowTypeDropdown(false);
                      setError("");
                    }}
                  >
                    <Text style={styles.dropdownItemText}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* ================= RENT (ONLY AFTER TYPE) ================= */}
            {type && (
              <>
                <Text style={[styles.label, { marginTop: 15 }]}>New Monthly Rent <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Enter rent"
                  value={monthlyRent}
                  onChangeText={(text) => {
                    const onlyNum = text.replace(/[^0-9]/g, "").replace(/^0+/, "");
                    setMonthlyRent(onlyNum);
                    setRentError("");
                  }}

                />
                {renteError && <ErrorMessage message={renteError} />}
              </>
            )}

            {/* ================= EFFECTIVE DATE ================= */}
            {type === "Rent-Revision" && (
              <>
                <Text style={[styles.label, { marginTop: 15 }]}>Effective From <Text style={{ color: "red" }}>*</Text></Text>
                {/* <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowCalendar(true)}
                >
                  <Text>
                    {effectiveDate
                      ? dayjs(effectiveDate).format("DD/MM/YYYY")
                      : "DD/MM/YYYY"}
                  </Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={styles.input}
                  onPress={() =>{
                    setShowMonthPicker(true)
                    Keyboard.dismiss();
                  }}
                >
                  <Text>
                    {effectiveMonth
                      ? dayjs(effectiveMonth).format("MM/YYYY")
                      : "MM/YYYY"}
                  </Text>
                </TouchableOpacity>
              </>

            )}


            {dateError && <ErrorMessage message={dateError} />}

            {/* ================= REASON ================= */}
            {type && (
              <>
                <Text style={[styles.label, { marginTop: 15 }]}>Reason</Text>
                <TextInput
                  style={[styles.input, { height: 90 }]}
                  multiline
                  placeholder="Enter reason"
                  value={reason}
                  onChangeText={setReason}
                />
              </>
            )}

            {error && <ErrorMessage message={error} />}

            {/* ================= ACTIONS ================= */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={resetState}
                style={{ borderColor: "#1E40AF", borderWidth: 1, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 24, marginRight: 8 }}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.updateBtn,
                  !type && { opacity: 0.5 },
                ]}
                disabled={!type}
                onPress={handleUpdate}
              >
                <Text style={styles.updateText}>Update</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>

      </View>

      {/* <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}> */}
        {showMonthPicker && (
          <View style={styles.calendarOverlay}>
            <TouchableWithoutFeedback onPress={() => setShowMonthPicker(false)}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </TouchableWithoutFeedback>
            <View style={styles.calendarSheet}>

              {/* YEAR HEADER */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                <TouchableOpacity onPress={() => setSelectedYear(selectedYear - 1)}>
                  <Text>{"<<"}</Text>
                </TouchableOpacity>

                <Text style={{ fontWeight: "600" }}>{selectedYear}</Text>

                <TouchableOpacity onPress={() => setSelectedYear(selectedYear + 1)}>
                  <Text>{">>"}</Text>
                </TouchableOpacity>
              </View>

              {/* MONTH GRID */}
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {dayjs.monthsShort().map((m, index) => {

                  const disabled = isMonthDisabled(selectedYear, index);

                  return (
                    <TouchableOpacity
                      key={index}
                      disabled={disabled}
                      style={{
                        width: "33%",
                        padding: 12,
                        alignItems: "center",
                        opacity: disabled ? 0.3 : 1,
                      }}
                      onPress={() => {
                        if (disabled) return;

                        const date = dayjs()
                          .year(selectedYear)
                          .month(index)
                          .startOf("month");

                        setEffectiveMonth(date.toDate());
                        setShowMonthPicker(false);
                      }}
                    >
                      <Text style={{ color: disabled ? "#aaa" : "#000" }}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

            </View>
          </View>
        )}
      {/* </View> */}

      {/* {showCalendar && (
        <View style={styles.calendarOverlay}>
          <TouchableWithoutFeedback
            onPress={() => setShowCalendar(false)}
          >
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
          </TouchableWithoutFeedback>
          <View style={styles.calendarSheet}>
         
            <Calendar
              minDate={billingRange?.minDate}
              maxDate={billingRange?.maxDate}
              disableAllTouchEventsForDisabledDays={true}
              onDayPress={(day) => {
                setEffectiveDate(day.dateString);
                setShowCalendar(false);
                setRentError("")
              }}
              markedDates={{
                ...(effectiveDate && {
                  [effectiveDate]: {
                    selected: true,
                    selectedColor: "#2563EB",
                  },
                }),
              }}
            />

          </View>
        </View>
      )} */}
    </>
  );
}



/* ================= STYLES ================= */
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
    position: "absolute",
    bottom: 0,
    left: 0,            // ⭐ ADD
    right: 0,           // ⭐ ADD
    width: "100%",
    minHeight: 300,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 60,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 3,
    width: "100%"
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dropdownText: {
    fontSize: 15,
  },
  arrow: { width: 18, height: 18, tintColor: "#777" },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 16,
  },
  dropdownItem: {
    padding: 14,
  },
  dropdownItemText: {
    fontSize: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    alignItems: 'center'
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
    marginLeft: 5
  },
  updateText: {
    color: "#fff",
    fontWeight: "600",
  },

  calendarOverlay: {
    // ...StyleSheet.absoluteFillObject,
    // backgroundColor: "rgba(0,0,0,0.4)",
    // justifyContent: "flex-end",
    // alignItems: "center",
    // zIndex: 9999,
    // elevation: 10,
     position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
        alignItems: "center",  
        zIndex: 2000,
  },

  //   calendarOverlay: {

  //       position: "absolute",
  //         top: 0,
  //         left: 0,
  //         right: 0,
  //         bottom: 0,
  //         backgroundColor: "rgba(0,0,0,0.4)",
  //         justifyContent: "flex-end",
  //         alignItems: "center",   
  //         zIndex: 2000,
  //   },

  calendarSheet: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 20,
    padding: 12,
    marginBottom: 80,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C7D2FE", // light blue
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  infoIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E0E7FF",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "700",
    marginRight: 8,
    color: "#1E3A8A",
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#1E3A8A",
    fontWeight: "500",
  },

});
