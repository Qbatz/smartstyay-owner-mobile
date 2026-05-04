import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Keyboard,
  TouchableWithoutFeedback, StyleSheet
} from "react-native";
import dayjs from "dayjs";
import { Calendar } from "react-native-calendars";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { BankingContext } from "../../../Context/BankingContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import Loader from "../../../Component/Loader/Loader"
import { PanResponder } from "react-native";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import CalendarBlueIcon from "../../../Assets/Images/calendar_blue.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import ProfileImage from "../../../Assets/Images/Avatar.png";
import Bills_Black_Icon from "../../../Assets/Images/Bills_Black_Icon.png"



const RecordPaymentSheet = ({
  visible,
  onClose,
  selectedBill,
  onCloseBillDetails
}) => {

  const { RecordPayment, GetAllBillDetails, loading } = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);
  const { bankList, getBankListByHostel } = useContext(BankingContext)

  const [paidAmount, setPaidAmount] = useState("");
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [paidDate, setPaidDate] = useState(null);
  const [selectedMode, setSelectedMode] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [openPaidDate, setOpenPaidDate] = useState(false);

  const [amountError, setAmountError] = useState("");
  const [dateError, setDateError] = useState("");
  const [modeError, setModeError] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [showPaymentMode, setShowPaymentMode] = useState(false);
  const recordSheetY = useRef(new Animated.Value(0)).current;

  const [isTriggered, setIsTriggered] = useState(false);
  const isTriggeredRef = useRef(false)

  useEffect(() => {
    if (visible) {
      setPaidAmount("");
      setBalanceAmount(0);
      setPaidDate(null);
      setSelectedMode("");
      setTransactionId("");
      setAmountError("");
      setDateError("");
      setModeError("");
    }
  }, [visible]);

  const normalizedBill = {
    invoiceId: selectedBill?.invoiceId,
    dueAmount: selectedBill?.dueAmount || selectedBill?.totalAmount || 0,
    invoiceDate: selectedBill?.invoiceDate,
    fullName: selectedBill?.fullName || selectedBill?.customerName || "",
    invoiceType: selectedBill?.invoiceType || selectedBill?.status || "",
    invoiceNumber: selectedBill?.invoiceNumber,
    profilePic: selectedBill?.profilePic,
    initials: selectedBill?.initials,
  };

  console.log("normalize", normalizedBill);


  useEffect(() => {
    if (activeHostelId) {
      getBankListByHostel(activeHostelId);
    }
  }, [activeHostelId]);

  const recordPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) recordSheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(recordSheetY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose(); // 👈 IMPORTANT
            recordSheetY.setValue(0);
          });
        } else {
          Animated.spring(recordSheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(recordSheetY, {
        toValue: -e.endCoordinates.height + 120,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(recordSheetY, {
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

  useEffect(() => {
    if (visible) {
      recordSheetY.setValue(300);

      Animated.timing(recordSheetY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);



  const transactionOptions = (bankList || []).map((item) => ({
    label: `${item.accountHolderName || "Account"} - ${item.accountType}`,
    value: item.bankingId,
  }));


  const today = dayjs();


  const invoiceDate = dayjs(
    normalizedBill?.invoiceDate,
    ["DD/MM/YYYY", "DD-MM-YYYY"],
    true
  );

  const isDisabledPaidDate = (d) => {
    if (!d) return false;

    if (invoiceDate && d.isBefore(invoiceDate, "day")) return true;
    if (d.isAfter(today, "day")) return true;

    return false;
  };


  const paidMarkedDates = {};

  for (let i = -365; i <= 365; i++) {
    const d = dayjs().add(i, "day");
    const key = d.format("YYYY-MM-DD");

    if (isDisabledPaidDate(d)) {
      paidMarkedDates[key] = {
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

  // 👉 format date
  const formatDateForPayload = (date) => {
    if (!date) return null;
    return dayjs(date).format("DD-MM-YYYY");
  };

  // 👉 amount change
  // const handlePaidAmountChange = (value) => {
  //   setAmountError("");

  //   let num = Number(value);
  //   if (isNaN(num)) num = 0;

  //   if (num > (normalizedBill?.dueAmount || 0)) {
  //     num = normalizedBill?.dueAmount || 0;
  //   }

  //   setPaidAmount(String(num));
  //   setBalanceAmount((normalizedBill?.dueAmount || 0) - num);
  // };

  const handlePaidAmountChange = (text) => {
    setAmountError("");

    let cleaned = text.replace(/[^0-9.]/g, "");

    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts[1];
    }

    if (parts[1]?.length > 2) {
      cleaned = parts[0] + "." + parts[1].slice(0, 2);
    }

    let num = parseFloat(cleaned);
    if (isNaN(num)) num = 0;

    if (num > (normalizedBill?.dueAmount || 0)) {
      num = normalizedBill?.dueAmount || 0;
      cleaned = String(num);
    }

    setPaidAmount(cleaned);
    setBalanceAmount((normalizedBill?.dueAmount || 0) - num);
  };

  const handleTransactionChange = (text) => {
    const filteredText = text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/
      , ""
    );

    setTransactionId(filteredText);
  };



  const handleClose = () => {
    onClose()
    setAmountError("");
    setDateError("");
    setModeError("");
    setPaidAmount("");
    setBalanceAmount(0);
    setPaidDate(null);
    setSelectedMode("");
    setTransactionId("");

  }
  console.log("isTrigg", isTriggered)

  const handleSaveRecordPayment = async () => {
    // if(isTriggered) return;
    // setIsTriggered(true)
    if (isTriggeredRef.current) return;
    isTriggeredRef.current = true;
    let isValid = true;

    setAmountError("");
    setDateError("");
    setModeError("");

    const formattedPaidDate = formatDateForPayload(paidDate);

    if (!paidAmount || Number(paidAmount) <= 0) {
      setAmountError("Please Enter Amount");
      isValid = false;
    }

    if (!formattedPaidDate) {
      setDateError("Please Select Date");
      isValid = false;
    } else {
      const billDate = dayjs(normalizedBill?.invoiceDate, "DD/MM/YYYY");
      const paid = dayjs(formattedPaidDate, "DD-MM-YYYY");

      if (paid.isBefore(billDate, "day")) {
        setDateError("Paid date should not be before Bill date");
        isValid = false;
      }
  
      if (!isValid){
       isTriggeredRef.current = false;
        return;
      } ;
  
      try {
  
        const res = await RecordPayment({
          hostelId: activeHostelId,
          invoiceId: normalizedBill?.invoiceId,
          data: {
            bankId: selectedMode,
            paymentDate: formattedPaidDate,
            referenceId: transactionId,
            amount: Number(paidAmount),
          },
        })
        console.log("response", res);
        
  
        if (res?.success) {
          await GetAllBillDetails(activeHostelId);
            const res = getBillsPdfDetails(activeHostelId, normalizedBill?.invoiceId,);
          
  
          setModalType("success")
          setModalMessage("Payment recorded successfully");
          setShowSuccessModal(true);
          setTimeout(() =>  {
            handleClose()
            setShowSuccessModal(false), 1500
        })
        } else if (res?.payableAmount) {
          setModalType("warning");
          setModalMessage(res?.payableAmount);
          setShowSuccessModal(true);
          setTimeout(() => setShowSuccessModal(false), 1500);
        } else {
          throw new Error();
        }
      } catch {
        setModalType("warning");
        setModalMessage(res?.payableAmount);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 1500);
      } else {
        throw new Error();
      }
    } catch {
      setModalType("warning");
      setModalMessage("Something went wrong");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
    } finally {
      isTriggeredRef.current = false;
    }

  };


  if (!visible) return null;

  return (
    <>
      {loading && <Loader />}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />

      <View style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
        zIndex: 9999,
      }}>

        {/* overlay */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            minHeight: 400, height: "90%",
            transform: [{ translateY: recordSheetY }],
          }}
          {...recordPan.panHandlers}


        >
          {/* Handle bar */}
          <View style={{
            width: 60,
            height: 5,
            backgroundColor: "#ccc",
            alignSelf: "center",
            borderRadius: 30,
            marginBottom: 15,
          }} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >

            {/* TITLE */}
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
              Record Payment
            </Text>

            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              {normalizedBill?.profilePic ? (
                <Image
                  source={{ uri: normalizedBill?.profilePic }}
                  style={styles.userImg}
                />
              ) : (
                <View style={styles.initialCircle}>
                  <Text style={styles.initialText}>
                    {normalizedBill?.initials || normalizedBill?.fullName?.slice(0, 2)?.toUpperCase()}
                  </Text>
                </View>
              )}

              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 17, fontWeight: "700", color: "#000" }}>
                  {normalizedBill?.fullName || "-"}
                </Text>

                <View style={{ flexDirection: "row", marginTop: 4 }}>
                  <View
                    style={{
                      backgroundColor: "#FFE6C7",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 6,
                      marginRight: 8,
                    }}
                  >
                    <Text style={{ color: "#C67506", fontFamily: "Gilroy-Semibold", fontSize: 12 }}>
                      {normalizedBill?.invoiceType || "-"}
                    </Text>
                  </View>

                  <Image source={Bills_Black_Icon} style={{ width: 12, height: 12, marginTop: 3, marginRight: 5 }} />
                  <Text style={{ fontSize: 13, color: "#555" }}> #{normalizedBill?.invoiceNumber || "-"}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.label}>Due Amount</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: "#EFF2FF", color: "grey" }
              ]}
              value={`₹ ${normalizedBill?.dueAmount || 0}`}
              editable={false}
            />

            {/* PAID AMOUNT */}
            <Text style={styles.label}>Paid Amount <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="₹ 0"
              value={paidAmount}
              onChangeText={handlePaidAmountChange}
            />

            {amountError && (
              <ErrorMessage message={amountError} type="error" />
            )}

            {/* BALANCE */}
            <Text style={styles.label}>Balance Amount</Text>
            <TextInput
              style={[styles.input, { backgroundColor: "#EFF2FF", color: "grey" }]}
              value={`₹ ${balanceAmount}`}
              editable={false}
            />

            {/* DATE */}
            <Text style={styles.label}>
              Paid Date <Text style={{ color: "red", fontSize: 19 }}>*</Text>
            </Text>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => {
                setDateError("");
                setOpenPaidDate(true);
              }}
            >
              <Text style={{ fontSize: 15 }}>
                {paidDate ? dayjs(paidDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
              </Text>

              <Image
                source={CalendarIcon}
                style={{ width: 22, height: 22, tintColor: "#444" }}
              />
            </TouchableOpacity>

            {dateError && (
              <ErrorMessage message={dateError} type="error" />
            )}

            <View style={{ position: "relative" }}>
              <Text style={styles.label}>
                Transaction Mode <Text style={{ color: "red", fontSize: 19 }}>*</Text>
              </Text>

              {/* INPUT */}
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => {
                  setModeError("");
                  setShowPaymentMode(v => !v);
                }}
              >
                <Text style={{ fontSize: 15 }}>
                  {selectedMode
                    ? transactionOptions.find(o => o.value === selectedMode)?.label
                    : "Select payment mode"}
                </Text>

                <Image
                  source={DownArrow}
                  style={{ width: 18, height: 18, tintColor: "#555" }}
                />
              </TouchableOpacity>

              {/* DROPDOWN */}
              {showPaymentMode && (
                <View style={styles.transactiondropdown}>
                  <ScrollView
                    nestedScrollEnabled
                    scrollEnabled={transactionOptions.length > 3}
                    showsVerticalScrollIndicator={false}
                  >
                    {transactionOptions.map(opt => {
                      const isSelected = selectedMode === opt.value;

                      return (
                        <TouchableOpacity
                          key={opt.value}
                          style={[
                            styles.dropdownRow,
                            isSelected && styles.dropdownRowSelected,
                          ]}
                          onPress={() => {
                            setSelectedMode(opt.value);
                            setShowPaymentMode(false);
                            setModeError("");
                          }}
                        >
                          <Text
                            style={
                              isSelected
                                ? styles.dropdownTextSelected
                                : styles.dropdownText
                            }
                          >
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {modeError && <ErrorMessage message={modeError} type="error" />}
            </View>

            {/* TRANSACTION ID */}
            <Text style={styles.label}>Transaction ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Transaction ID"
              // keyboardType="numeric"
              value={transactionId}
              onChangeText={handleTransactionChange}
            // onFocus={() => {
            //   setIsInputFocused(true);
            // }}
            // onBlur={() => {
            //   setIsInputFocused(false);
            // }}
            />


            {/* BUTTONS */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, isTriggeredRef.current && { opacity: 0.6 }]}
                onPress={handleSaveRecordPayment}
                disabled={isTriggeredRef.current}
              >
                <Text style={styles.saveText}>Record</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </Animated.View>
      </View>

      {openPaidDate && (
        <View style={styles.dateOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenPaidDate(false)}>
            <View style={styles.overlayBg} />
          </TouchableWithoutFeedback>

          <View style={styles.calendarContainer}>
            <Calendar
              markingType="custom"
              markedDates={paidMarkedDates}
              current={
                paidDate
                  ? dayjs(paidDate).format("YYYY-MM-DD")
                  : today.format("YYYY-MM-DD")
              }
              onDayPress={(day) => {
                if (paidMarkedDates[day.dateString]?.disabled) return;

                setPaidDate(new Date(day.dateString))
                setOpenPaidDate(false);
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

    </>

  );
};

export default RecordPaymentSheet;


const styles = StyleSheet.create({
  label: {
    color: "#777",
    fontSize: 14,
    marginBottom: 5,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  inputBox: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    // marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 160,
  },
  transactiondropdown: {
    position: "absolute",
    top: 77,          // 👈 input height
    left: 0,
    right: 0,

    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 9999,
    elevation: 20,

    maxHeight: 160,
  },

  dropdownRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  dropdownRowSelected: {
    backgroundColor: "#2563EB",
  },

  dropdownText: {
    color: "#111",
  },

  dropdownTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },




  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
    alignItems: "center",
  },

  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },

  cancelText: {
    color: "#6B7280",
    fontSize: 15,
  },

  saveBtn: {
    backgroundColor: "#2B6CF6",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
  },
  dateOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,   // 🔥 IMPORTANT
    elevation: 50,   // 🔥 ANDROID
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    width: "85%",
    elevation: 20,
    zIndex: 2,
  },
  initialCircle: {
    width: 45,
    height: 45,
    borderRadius: 21,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5
  },

  initialText: {
    fontSize: 13,
    fontFamily: "Gilroy-Bold",
    color: "#4B5563",
  },

})
