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



const RefundPaymentSheet = ({
  visible,
  onClose,
  selectedBill,
  onSuccess,
}) => {

  const { RecordPayment, GetAllBillDetails, CreateRefund, GetInitializeRefundDetails } = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);
  const { bankList, getBankListByHostel } = useContext(BankingContext)

  const [refundInitDetails, setRefundInitDetails] = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);

  const [refundAmount, setRefundAmount] = useState("");
  const [refundBalance, setRefundBalance] = useState(0);
  const [refundAmountError, setRefundAmountError] = useState("");
  const [refundFromError, setRefundFromError] = useState("");
  const [refundFrom, setRefundFrom] = useState("");
  const [showRefundFrom, setShowRefundFrom] = useState(false);
  const [refundDateError, setRefundDateError] = useState("");

  const [refundDate, setRefundDate] = useState(null);
  const [openRefundDate, setOpenRefundDate] = useState(false);

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


  const fetchRefundInitialize = async () => {
    try {

      const res = await GetInitializeRefundDetails({
        hostelId: activeHostelId,
        invoiceId: normalizedBill?.invoiceId,
      });

      if (res?.success) {
        setRefundInitDetails(res?.data);
      } else {
        console.log(res.message);
      }
    } catch (err) {
      console.log("Failed to load refund details");
    }

  };

  useEffect(() => {
    if (
      normalizedBill?.invoiceId &&
      activeHostelId
    ) {
      fetchRefundInitialize()
    }
  }, [normalizedBill?.invoiceId, activeHostelId]);



  useEffect(() => {
    if (activeHostelId) {
      getBankListByHostel(activeHostelId);
    }
  }, [activeHostelId]);

  const resetRefundForm = () => {
    onClose()
    setRefundAmount("");
    setRefundBalance("");
    setRefundDate(null);
    setRefundFrom("");
    setTransactionId("");

    setRefundAmountError("");
    setRefundDateError("");
    setRefundFromError("");

    setRefundInitDetails(null);
  };

  const refundSheetY = useRef(new Animated.Value(0)).current;

  const refundPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) refundSheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(refundSheetY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            refundSheetY.setValue(0);
          });
        } else {
          Animated.spring(refundSheetY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(refundSheetY, {
        // toValue: -e.endCoordinates.height + 70,
        toValue: -e.endCoordinates.height / 2,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(refundSheetY, {
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
      refundSheetY.setValue(300);

      Animated.timing(refundSheetY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (refundInitDetails?.refundableAmount != null) {
      setRefundBalance(refundInitDetails?.pendingRefund);
      setRefundAmount("");
    }
  }, [refundInitDetails]);



  const transactionOptions = (bankList || []).map((item) => ({
    label: `${item.accountHolderName || "Account"} - ${item.accountType}`,
    value: item.bankingId,
  }));

  const refundBankOptions = (refundInitDetails?.listBanks || []).map((b) => ({
    label: `${b?.bankName}`,
    value: b?.bankId,
  }));


  const normalizeDate = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
      return dayjs(value).startOf("day");
    }

    if (dayjs.isDayjs(value)) {
      return value.startOf("day");
    }

    if (typeof value === "string") {
      const d = dayjs(value, "DD/MM/YYYY");
      return d.isValid() ? d.startOf("day") : null;
    }

    return null;
  };


  const parseInvoiceDate = (date) => {
    if (!date) return null;

    if (date instanceof Date) {
      return dayjs(date).startOf("day");
    }

    if (typeof date === "string") {
      const cleaned = date
        .replace(/\u00A0/g, " ")
        .trim();

      const dmy = dayjs(cleaned, "DD/MM/YYYY");
      if (dmy.isValid()) return dmy.startOf("day");

      const fallback = dayjs(cleaned);
      return fallback.isValid() ? fallback.startOf("day") : null;
    }

    return null;
  };

  // useEffect(() => {
  //   if (normalizedBill?.invoiceDate && !refundDate) {
  //     const inv = parseInvoiceDate(normalizedBill.invoiceDate);
  //     if (inv) setRefundDate(inv.toDate());
  //   }
  // }, [normalizedBill]);

  const handleRefundAmountChange = (val) => {
    const value = val.trim();

    // allow empty
    if (value === "") {
      const max = Math.abs(Number(refundInitDetails?.pendingRefund || 0));
      setRefundAmount("");
      setRefundBalance(max);
      setRefundAmountError("");
      return;
    }

    // numbers only (allow typing)
    if (!/^\d*$/.test(value)) return;

    const num = Number(value);
    const max = Math.abs(Number(refundInitDetails?.pendingRefund || 0));

    // block exceed
    if (num > max) {
      setRefundAmountError(`Amount cannot exceed ₹${max}`);
      return;
    }

    setRefundAmount(value);
    setRefundBalance(max - num);
    setRefundAmountError("");
  };


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



  const isDisabledRefundDate = (d) => {
    if (!d) return false;

    if (invoiceDate && d.isBefore(invoiceDate, "day")) return true;
    if (d.isAfter(today, "day")) return true;

    return false;
  };


  const refundMarkedDates = {};

  for (let i = -365; i <= 365; i++) {
    const d = dayjs().add(i, "day");
    const key = d.format("YYYY-MM-DD");

    if (isDisabledRefundDate(d)) {
      refundMarkedDates[key] = {
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

  const balanceDue =
    Math.abs(Number(refundInitDetails?.pendingRefund || 0)) -
    (Number(refundAmount) || 0);

  console.log("balancedue", refundInitDetails);


  // 👉 amount change
  const handlePaidAmountChange = (value) => {
    setAmountError("");

    let num = Number(value);
    if (isNaN(num)) num = 0;

    if (num > (normalizedBill?.dueAmount || 0)) {
      num = normalizedBill?.dueAmount || 0;
    }

    setPaidAmount(String(num));
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


  const handleSaveRefund = async () => {
    setRefundAmountError("");
    setRefundDateError("");
    setRefundFromError("");

    let valid = true;

    if (!refundAmount || Number(refundAmount) <= 0) {
      setRefundAmountError("Please Enter Refund Amount");
      valid = false;
    }


    if (!refundDate) {
      setRefundDateError("Please Select Refund Date");
      valid = false;
    }

    if (!refundFrom) {
      setRefundFromError("Please Select Refund Account");
      valid = false;
    }

    if (Number(refundAmount) > Math.abs(refundInitDetails?.pendingRefund)) {
      setRefundAmountError("Amount exceeds refundable amount");
      valid = false;
    }

    if (!valid) return;

    const payload = {
      refundAmount: String(refundAmount),
      refundDate: dayjs(refundDate).format("DD-MM-YYYY"),
      bankId: refundFrom,
      referenceNumber: transactionId || "",
      invoiceId: normalizedBill?.invoiceId,
      hostelId: activeHostelId,
    };

    console.log("payload", payload);



    const res = await CreateRefund({
      hostelId: activeHostelId,
      invoiceId: normalizedBill?.invoiceId,
      payload,
    });

    if (res?.success) {
      GetAllBillDetails(activeHostelId);
      setModalType("success");
      setModalMessage("Refund successfully");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false)
        onSuccess?.();
        resetRefundForm();
      }, 1500);





      onClose();
      setRefundAmount("");
      setRefundDate(null);
      setRefundFrom("");
      setTransactionId("");
    } else if (res?.refundableError) {
      setModalType("warning");
      setModalMessage(res?.refundableError);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
    } else {
      setModalType("warning");
      setModalMessage(res?.message);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
    }
  };




  if (!visible) return null;

  return (
    <>
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
            minHeight: 400, height: "85%",
            transform: [{ translateY: refundSheetY }],
          }}
          {...refundPan.panHandlers}


        >
          <View style={{
            width: 60,
            height: 5,
            backgroundColor: "#ccc",
            alignSelf: "center",
            borderRadius: 30,
            marginBottom: 15,
          }} />
          <View style={styles.sheetHandle} />

          <ScrollView showsVerticalScrollIndicator={false}>

            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
              Refund Payment
            </Text>

            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              {normalizedBill?.profilePic ? (
                <Image
                  source={{ uri: normalizedBill.profilePic }}
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
                    <Text style={{ color: "#C67506", fontSize: 11, fontFamily: "Gilroy-Semibold" }}>
                      {normalizedBill?.invoiceType || "-"}
                    </Text>
                  </View>

                  <Image
                    source={Bills_Black_Icon}
                    style={{ width: 12, height: 12, marginTop: 3, marginRight: 5 }}
                  />
                  <Text style={{ fontSize: 11, color: "#555" }}>{normalizedBill?.invoiceNumber}</Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: "#444", fontSize: 13 }}>Refund Amount</Text>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#000" }}>
                  ₹ {refundInitDetails?.pendingRefund || 0}
                </Text>
              </View>
            </View>

            <Text style={styles.label}>
              Refund amount <Text style={{ color: "red", fontSize: 16 }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={refundAmount}
              onChangeText={(val) => {
                let cleaned = val.replace(/[^0-9.]/g, "");

                const parts = cleaned.split(".");
                if (parts.length > 2) {
                  cleaned = parts[0] + "." + parts[1];
                }

                if (parts[1]?.length > 2) {
                  cleaned = parts[0] + "." + parts[1].slice(0, 2);
                }

                const num = Number(cleaned);
                const max = Math.abs(Number(refundInitDetails?.pendingRefund || 0));

                if (num > max) {
                  setRefundAmountError(`Amount cannot exceed ₹${max}`);
                  return;
                }

                setRefundAmount(cleaned);

                if (cleaned && (!num || num <= 0)) {
                  setRefundAmountError("Enter valid amount");
                } else {
                  setRefundAmountError("");
                }
              }}
            // onChangeText={(val) => {

            //   const numericValue = val.replace(/[^0-9]/g, "");
            //   const max = Math.abs(
            //     Number(refundInitDetails?.pendingRefund || 0)
            //   );

            //   const num = Number(numericValue || 0);

            //   if (num > max) {
            //     setRefundAmountError(`Amount cannot exceed ₹${max}`);
            //     return;
            //   }

            //   setRefundAmount(numericValue);
            //   setRefundAmountError("");
            // }}
            />


            {refundAmountError && (
              <ErrorMessage message={refundAmountError} type="error" />
            )}

            <Text style={styles.label}>Balance Due <Text style={{ color: "red", fontSize: 16 }}>*</Text></Text>
            <View style={styles.inputBox}>
              <Text style={{ fontSize: 16 }}>
                ₹ {Math.max(0, balanceDue)}
              </Text>
            </View>


            <Text style={styles.label}>
              Refund Date <Text style={{ color: "red", fontSize: 16 }}>*</Text>
            </Text>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => {
                setRefundDateError("");
                setOpenRefundDate(true);
              }}
            >
              <Text style={{ fontSize: 15 }}>
                {refundDate ? dayjs(refundDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
              </Text>

              <Image source={CalendarIcon} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>

            {refundDateError && (
              <ErrorMessage message={refundDateError} type="error" />
            )}








            <View style={{ position: "relative" }}>

              <Text style={styles.label}>
                Refund From <Text style={{ color: "red" }}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => {
                  setRefundFromError("");
                  setShowRefundFrom(v => !v);
                }}
              >
                <Text style={{ fontSize: 15 }}>
                  {refundFrom
                    ? refundBankOptions.find(o => o.value === refundFrom)?.label
                    : "Select bank"}
                </Text>

                <Image
                  source={DownArrow}
                  style={{ width: 18, height: 18, tintColor: "#555" }}
                />
              </TouchableOpacity>

              {showRefundFrom && (
                <View style={styles.transactiondropdown}>
                  <ScrollView
                    nestedScrollEnabled
                    scrollEnabled={refundBankOptions.length > 3}
                    showsVerticalScrollIndicator={false}
                  >
                    {refundBankOptions.map(opt => {
                      const isSelected = refundFrom === opt.value;

                      return (
                        <TouchableOpacity
                          key={opt.value}
                          style={[
                            styles.dropdownRow,
                            isSelected && styles.dropdownRowSelected,
                          ]}
                          onPress={() => {
                            setRefundFrom(opt.value);
                            setShowRefundFrom(false);
                            setRefundFromError("");
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
            </View>

            {refundFromError && (
              <ErrorMessage message={refundFromError} type="error" />
            )}




            {/* TRANSACTION ID */}
            <Text style={styles.label}>Transaction ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter transaction ID"
              // keyboardType="numeric"
              value={transactionId}
              onChangeText={(text) => {
                const noEmoji = text.replace(
                  /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
                  ""
                );
                setTransactionId(noEmoji)
              }
              }
            />

            {/* BUTTON ROW */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={resetRefundForm}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveRefund}
              >
                <Text style={styles.saveText}>Refund</Text>
              </TouchableOpacity>
            </View>


          </ScrollView>

        </Animated.View>
      </View>

      {openRefundDate && (
        <View style={styles.dateOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenRefundDate(false)}>
            <View style={styles.overlayBg} />
          </TouchableWithoutFeedback>

          <View style={styles.calendarContainer}>
            <Calendar
              markingType="custom"
              markedDates={refundMarkedDates}
              // current={
              //   refundDate
              //     ? refundDate.format("YYYY-MM-DD")
              //     : today.format("YYYY-MM-DD")
              // }
              current={
                refundDate
                  ? dayjs(refundDate).format("YYYY-MM-DD")
                  : today.format("YYYY-MM-DD")
              }

              onDayPress={(day) => {
                if (refundMarkedDates[day.dateString]?.disabled) return;

                // setRefundDate(dayjs(day.dateString));
                setRefundDate(new Date(day.dateString));
                setOpenRefundDate(false);
              }}
            />
          </View>
        </View>
      )}

    </>

  );
};

export default RefundPaymentSheet;


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
