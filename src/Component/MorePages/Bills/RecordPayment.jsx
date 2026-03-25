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
  TouchableWithoutFeedback,
} from "react-native";
import dayjs from "dayjs";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { BankingContext } from "../../../Context/BankingContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import Loader from "../../../Component/Loader/Loader"

const RecordPaymentSheet = ({
  visible,
  onClose,
  selectedBill,
}) => {

  const { RecordPayment, GetAllBillDetails } = useContext(BillContext);
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

  useEffect(() => {
  if (visible) {
    setPaidAmount("");
    setBalanceAmount(0);
    setPaidDate(null);
    setSelectedMode("");
    setTransactionId("");
  }
}, [visible]);

  useEffect(() => {
    if (activeHostelId) {
      getBankListByHostel(activeHostelId);
    }
  }, [activeHostelId]);



  const transactionOptions = (bankList || []).map((item) => ({
    label: `${item.accountHolderName || "Account"} - ${item.accountType}`,
    value: item.bankingId,
  }));





  const invoiceDate = dayjs(selectedBill?.invoiceDate, "DD-MM-YYYY");

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
  const handlePaidAmountChange = (value) => {
    setAmountError("");

    let num = Number(value);
    if (isNaN(num)) num = 0;

    if (num > (selectedBill?.dueAmount || 0)) {
      num = selectedBill?.dueAmount || 0;
    }

    setPaidAmount(String(num));
    setBalanceAmount((selectedBill?.dueAmount || 0) - num);
  };

  // 👉 save
  const handleSave = async () => {
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
    }

    if (!selectedMode) {
      setModeError("Please Select Transaction Type");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const res = await RecordPayment({
        hostelId: activeHostelId,
        invoiceId: selectedBill?.invoiceId,
        data: {
          bankId: selectedMode,
          paymentDate: formattedPaidDate,
          referenceId: transactionId,
          amount: Number(paidAmount),
        },
      });

      if (res.success) {
        await GetAllBillDetails(activeHostelId);
        onClose();
      }
    } catch (e) {
      console.log("error", e);
    }
  };


//    const handleSaveRecordPayment = async () => {
//       let isValid = true;
  
//       setAmountError("");
//       setDateError("");
//       setModeError("");
  
//       const formattedPaidDate = formatDateForPayload(paidDate);
  
//       if (!paidAmount || Number(paidAmount) <= 0) {
//         setAmountError("Please Enter Amount");
//         isValid = false;
//       }
  
//       if (!formattedPaidDate) {
//         setDateError("Please Select Date");
//         isValid = false;
//       } else {
//         const billDate = dayjs(selectedBill?.invoiceDate, "DD/MM/YYYY");
//         const paid = dayjs(formattedPaidDate, "DD-MM-YYYY");
  
//         if (paid.isBefore(billDate, "day")) {
//           setDateError("Paid date should not be before Bill date");
//           isValid = false;
//         }
//       }
  
//       if (!selectedMode) {
//         setModeError("Please Select Transaction Type");
//         isValid = false;
//       }
  
//       if (!isValid) return;
  
//       try {
//         setRecordLoading(true);
  
//         const res = await RecordPayment({
//           hostelId: activeHostelId,
//           invoiceId: selectedBill?.invoiceId,
//           data: {
//             bankId: selectedMode,
//             paymentDate: formattedPaidDate,
//             referenceId: transactionId,
//             amount: Number(paidAmount),
//           },
//         });
  
//         if (res.success) {
//           await GetAllBillDetails(activeHostelId);
//           setShowBillDetails(false)
//           setShowRecordPayment(false);
  
//           setModalType("success");
//           setModalMessage("Payment recorded successfully");
//           setShowSuccessModal(true);
//           setTimeout(() => setShowSuccessModal(false), 1500);
//         } else if (res.payableAmount) {
//           setModalType("warning");
//           setModalMessage(res.payableAmount);
//           setShowSuccessModal(true);
//           setTimeout(() => setShowSuccessModal(false), 1500);
//         } else {
//           throw new Error();
//         }
//       } catch {
//         setModalType("warning");
//         setModalMessage("Something went wrong");
//         setShowSuccessModal(true);
//         setTimeout(() => setShowSuccessModal(false), 1500);
//       } finally {
//         setRecordLoading(false);
//       }
//     };


  if (!visible || !selectedBill) return null;

  return (
    <>
      <SuccessModal
            visible={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={modalMessage}
            type={modalType}
          />
          
    <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
      
      {/* overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }} />
      </TouchableWithoutFeedback>

      {/* sheet */}
      <Animated.View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          minHeight: 400,
        }}
      >
        <ScrollView>

          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            Record Payment
          </Text>

          {/* Amount */}
          <TextInput
            placeholder="Amount"
            value={paidAmount}
            onChangeText={handlePaidAmountChange}
            style={{ borderWidth: 1, marginTop: 10 }}
          />
          {amountError && <ErrorMessage message={amountError} />}

          {/* Balance */}
          <Text>Balance: ₹ {balanceAmount}</Text>

          {/* Mode */}
          <TouchableOpacity
            onPress={() => setShowPaymentMode(!showPaymentMode)}
            style={{ borderWidth: 1, padding: 12, marginTop: 10 }}
          >
            <Text>
              {selectedMode
                ? transactionOptions.find(o => o.value === selectedMode)?.label
                : "Select Mode"}
            </Text>
          </TouchableOpacity>

          {showPaymentMode &&
            transactionOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  setSelectedMode(opt.value);
                  setShowPaymentMode(false);
                }}
              >
                <Text>{opt.label}</Text>
              </TouchableOpacity>
            ))}

          {modeError && <ErrorMessage message={modeError} />}

          {/* Transaction ID */}
          <TextInput
            placeholder="Transaction ID"
            value={transactionId}
            onChangeText={setTransactionId}
            style={{ borderWidth: 1, marginTop: 10 }}
          />

          {/* Buttons */}
          <TouchableOpacity onPress={handleSave}>
            <Text>Save</Text>
          </TouchableOpacity>

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