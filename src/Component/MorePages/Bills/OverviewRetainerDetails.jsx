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
  TouchableWithoutFeedback, StyleSheet, NativeModules,
  Modal
} from "react-native";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { Calendar } from "react-native-calendars";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { BankingContext } from "../../../Context/BankingContext";
import { PGContext } from "../../../Context/PGContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import Loader from "../../../Component/Loader/Loader"
import Dots from "../../../Assets/Images/3dots.png";
import PaymentIcon from "../../../Assets/Images/RecordPayIcon.png";
import WhatsappGreenIcon from "../../../Assets/Images/whatsapp.png";
import Call from "../../../Assets/Images/call.png";
import ShareIcon from "../../../Assets/Images/share.png";
import DownloadIcon from "../../../Assets/Images/download.png";
import PlusIcon from "../../../Assets/Images/add.png";
import TickIcon from "../../../Assets/Images/check.png";
import InvoiceLinkIcon from "../../../Assets/Images/Invoice_Link.png";
import DiscountDown from "../../../Assets/Images/direction-downIcon.png";
import { PanResponder } from "react-native";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import CalendarBlueIcon from "../../../Assets/Images/calendar_blue.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import ProfileImage from "../../../Assets/Images/Avatar.png";
import Bills_Black_Icon from "../../../Assets/Images/Bills_Black_Icon.png"
import RecordPaymentSheet from "./RecordPayment";
import RefundPaymentSheet from "./RefundPayment"
import { useHasPermission } from "../../../Utils/useHasPermission";
import { useNavigation } from "@react-navigation/native";
import DiscountActionSheet from "./DiscountActionSheet"
import QuestionIcon from "../../../Assets/Images/help.png";
import BillIcon from "../../../Assets/Images/bill.png";
import RefundedIcon from "../../../Assets/Images/Repeat.png";
import LinkIcon from "../../../Assets/Images/link.png";




const RetainerDetailsSheet = ({
  visible,
  onClose,
  selectedBill
  // BillPdfdetails,
  // isExportAllow,
  // canWriteInvoice,
  // handleDownloadBillsPdf,
  // handleshareBill,
  // handleWhatsappShareBill,
  // handleCallPhone,
  // handleShowRecordPayment,
}) => {


  const { CommonModule } = NativeModules;
  const navigation = useNavigation();





  const { BillDetails, loading, GetAllBillDetails,
    refundError, GetRecurringBills, recurringBills, BillPdfdetails, getBillsPdfDetails, getReceiptPdfDetails, downloadReceipt, DeleteReceipt,
    downloadBill, shareBillOnWhatsapp, shareReceiptOnWhatsapp, GetReceiptsList, receiptsList, MarkBillAsUnpaid, GetAdvanceCreditDetails,
    GetInitializeAdvanceRedeem, GetInitializeRecordPaymentDetails, InitializebookingBills } = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);
  const { bankList, getBankListByHostel } = useContext(BankingContext)
  const { getParticularHostelDetails, PGDetails } = useContext(PGContext);

  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const isBillLocked = true;

  const {
    canWriteModule: canWriteInvoice,
    canReadModule: canReadInvoice,
    canUpdateModule: canUpdateInvoice,
    canDeleteModule: canDeleteInvoice,
  } = useHasPermission("Bills")

  const {
    canWriteModule: canWriteReceipt,
    canReadModule: canReadReceipt,
    canUpdateModule: canUpdateReceipt,
    canDeleteModule: canDeleteReceipt,
  } = useHasPermission("Receipt")

  const dotsRefs = useRef({});


  const [showMenu, setShowMenu] = useState(false);
  const [showReceiptMenu, setShowReceiptMenu] = useState(false)
  const [showPayments, setShowPayments] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [showRefundPayement, setShowRefundPayment] = useState(false)
  const detailsSheetY = useRef(new Animated.Value(0)).current;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showDiscountSheet, setShowDiscountSheet] = useState(false)
  const [showUnpaidModal, setShowUnpaidModal] = useState(false)

  const [openUnpaid, setOpenUnpaid] = useState(false);
  const [openRefundRent, setOpenRefundRent] = useState(false);
  const [openEBill, setOpenEBill] = useState(false);
  const [extraCharges, setExtraCharges] = useState([]); const [ReturnAmount, setReturnAmount] = useState('')
  const [showDetails, setShowDetails] = useState(false);
  const [showOtherDetails, setShowOtherDetails] = useState(false);
  const [showLastRentDetails, setShowLastRentDetails] = useState(false);

  const [showRefundableAdvance, setShowRefundableAdvance] = useState(false);

  const [showDeductions, setShowDeductions] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showWallet, setShowWallet] = useState(false);


  const formatEBDate = (date) => {
    if (!date) return "-";
    return dayjs(date).format("DD/MM/YYYY");
  };

  const recordSheetY = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   if (visible) {
  //     setPaidAmount("");
  //     setBalanceAmount(0);
  //     setPaidDate(null);
  //     setSelectedMode("");
  //     setTransactionId("");
  //     setAmountError("");
  //     setDateError("");
  //     setModeError("");
  //   }
  // }, [visible]);


  const bill = BillPdfdetails;
  const invoice = BillPdfdetails?.invoiceInfo;
  const customer = BillPdfdetails?.customerInfo;
  const stay = BillPdfdetails?.stayInfo;

  console.log("invoice_details", invoice);
  console.log("InitializebookingBills",InitializebookingBills)


  // const normalizedBill = {
  //   invoiceId: selectedBill?.invoiceId,
  //   dueAmount: selectedBill?.dueAmount || selectedBill?.totalAmount || 0,
  //   invoiceDate: selectedBill?.invoiceDate,
  //   fullName: selectedBill?.fullName || selectedBill?.customerName || "",
  //   invoiceType: selectedBill?.invoiceType || selectedBill?.status || "",
  //   invoiceNumber: selectedBill?.invoiceNumber,
  //   profilePic: selectedBill?.profilePic,
  //   initials: selectedBill?.initials,
  // };

  // console.log("normalize", normalizedBill);


  useEffect(() => {
    if (activeHostelId) {
      getBankListByHostel(activeHostelId);
    }
  }, [activeHostelId]);

  useEffect(() => {
    if (activeHostelId && canReadInvoice) {
      GetAllBillDetails(activeHostelId);
    }
  }, [activeHostelId, canReadInvoice]);

  useEffect(() => {
    if (activeHostelId) {
      getParticularHostelDetails(activeHostelId);
    }
  }, [activeHostelId])

  useEffect(() => {
    if (activeHostelId) {
      const res = getBillsPdfDetails(activeHostelId, selectedBill?.invoiceId);
      console.log("res", res);

    }
  }, [activeHostelId])


  useEffect(() => {
    const fetchData = async () => {
      if (activeHostelId && selectedBill?.invoiceId) {
        const res = await GetInitializeAdvanceRedeem({
          hostelId: activeHostelId,
          advanceInvoiceId: selectedBill?.invoiceId,
        });

        console.log("API RESPONSE:", res);
      }
    };

    fetchData();
  }, [activeHostelId, selectedBill]);




  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {

        if (showRecordPayment) {
          setShowRecordPayment(false);
          return true;
        }

        if (showRefundPayement) {
          setShowRefundPayment(false);
          return true;
        }

        if (visible) {
          onClose();
          return true;
        }

        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [visible, showRecordPayment, showRefundPayement])
  );





  const invoiceDetail = BillDetails?.listInvoices?.find((item) => item?.invoiceId === BillPdfdetails?.invoiceId)



  const billDetailsPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) detailsSheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(detailsSheetY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose(); // ✅ IMPORTANT
            detailsSheetY.setValue(0);
          });
        } else {
          Animated.spring(detailsSheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;


  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(detailsSheetY, {
        toValue: -e.endCoordinates.height + 120,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(detailsSheetY, {
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
      detailsSheetY.setValue(300);

      Animated.timing(detailsSheetY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible])




  //  useLayoutEffect(() => {
  //     const backAction = () => {

  //       if (showRecordPayment) {
  //         setShowRecordPayment(false);
  //         return true;
  //       }

  //       if (showRefundPayment) {
  //         setShowRefundPayment(false);
  //         return true;
  //       }

  //       navigation.goBack();
  //       return true;
  //     };

  //     const handler = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       backAction
  //     );

  //     return () => handler.remove();
  //   }, []);



  const handleWhatsappShareBill = async () => {
    const res = await shareBillOnWhatsapp(activeHostelId, bill?.invoiceId);

    if (res?.success) {
      // setShowBillDetails(false)
      setModalType("success");
      setModalMessage("Bill shared successfully");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);

      // console.log("WhatsApp shared successfully");
    } else {
      console.log(res?.message);
    }
  }

  const handleshareBill = async () => {
    if (!activeHostelId || !bill?.invoiceId) return;

    const res = await downloadBill(activeHostelId, bill?.invoiceId);

    console.log("response", res);


    if (res?.success && res?.url) {
      await CommonModule.downloadAndShareFile(res?.url);
      // setShowBillDetails(false)
    } else {
      console.log(res?.message);

    }
  }

  const handleDownloadBillsPdf = async () => {
    if (!activeHostelId || !bill?.invoiceId) return;

    const res = await downloadBill(activeHostelId, bill.invoiceId);

    if (res?.success && res?.url) {
      await CommonModule.downloadAndViewDocument(res.url);
      // setShowMenu(false)
      // setShowBillDetails(false)
    } else {
      console.log(res?.message);
      // setShowMenu(false)

    }
  };

  const handleCallPhone = (mobile) => {
    console.log("mobile", mobile)
    if (mobile) {
      CommonModule.makeCall(mobile)
    }
  }

  const handleShowRecordPayment = async () => {
    setShowMenu(false);
    const res = await GetInitializeRecordPaymentDetails({
      hostelId: activeHostelId,
      invoiceId: BillPdfdetails?.invoiceId || BillPdfdetails?.invoiceInfo?.invoiceId || selectedBill?.invoiceId,
    })
    console.log(res)
    navigation.navigate("NewRecordPayment",
      {
        selectedBill, BillPdfdetails,
        onPaymentSuccess: onClose(),
      })
  };

  const handleShowRefundPayment = () => {
    setShowMenu(false);
    setShowRefundPayment(true);
  };



  const openMenu = (item) => {
    const ref = dotsRefs.current[item?.invoiceId];

    if (ref) {
      ref.measureInWindow((x, y, width, height) => {
        setPopupPosition({
          x,
          y: y + height,
        });
        setShowMenu(true);
      });
    }
  };

  const handleOpenReceiptFromBill = (pay) => {
    console.log("open receipt", pay);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return {
          bg: "#038C3D",
          text: "#fff",
          dot: "#fff",
        };

      case "PAID": {
        return {
          bg: "#038C3D",
          text: "#fff",
          dot: "#fff",
        };
      }

      case "Partially Paid":
        return {
          bg: "#FFF7E7",
          text: "black",
          dot: "#F39F18",
        };

      case "Pending":
        return {
          bg: "#FFF2F2",
          text: "black",
          dot: "#FF0000",
        };

      default:
        return {
          bg: "#FFF2F2",
          text: "black",
          dot: "black",
        };
    }
  };

  // const BillsStatusStyle = {
  //   bg: "#E5E7EB",
  //   dot: "#6B7280",
  //   text: "#374151",
  // };

  const paymentStatus = invoice?.paymentStatus ?? invoice?.status;

  const BillsStatusStyle = getStatusStyle(paymentStatus)
  // console.log("bill", bill);


  const isPaid = paymentStatus === "Paid";
  // const isPartial =
  //   invoice?.paymentStatus === "Partially Paid" ||
  //   invoice?.paymentStatus === "Partial Payment";

  const invoiceType = selectedBill?.invoiceType ?? bill?.configurations?.invoiceType;


  console.log("paymentStatus", paymentStatus);


  const isPartial =
    paymentStatus === "Partially Paid" ||
    paymentStatus === "Partial Payment" ||
    paymentStatus === "PARTIAL_PAYMENT";

  const isPending = invoice?.status === "PENDING" || selectedBill?.paymentStatus === "Pending";
  const partiallyRefund = invoice?.status === "PARTIAL_REFUND" || selectedBill?.paymentStatus === "Partially Refunded";
  const pendingRefund = invoice?.status === "PENDING_REFUND" || selectedBill?.paymentStatus === "Pending Refund";
  const cancelled = invoice?.paymentStatus === "Cancelled";
  const FullyRefund = invoice?.paymentStatus === "Refunded";

  // const invoiceType = bill?.configurations?.invoiceType;
  const showRefundButton =
    selectedBill?.invoiceType === "Settlement" &&
    pendingRefund || partiallyRefund

  const showSettlementRedeem =
    selectedBill?.invoiceType === "Settlement" &&
    BillPdfdetails?.invoiceInfo?.isNewPattern;




  // const paymentStatus = invoice?.paymentStatus;
  const isDiscounted = invoice?.isDiscounted;
  const invoiceMode = bill?.invoiceMode; // fallback if exists

  const isValidSubscription = PGDetails?.isSubscriptionActive;
  const isExportAllow = isValidSubscription && canReadInvoice;

  const showDotsbtn =
    !cancelled &&
    !pendingRefund &&
    !partiallyRefund &&
    !FullyRefund &&
    (
      !isPaid ||
      (
        isPaid &&
        selectedBill?.invoiceMode === "Manual" || selectedBill?.invoiceMode === "MANUAL" &&
        selectedBill?.invoiceType !== "Settlement"
      )
    );


  const unpaidRotate = useRef(new Animated.Value(openUnpaid ? 1 : 0)).current;
  const rentRotate = useRef(new Animated.Value(openRefundRent ? 1 : 0)).current;
  const ebRotate = useRef(new Animated.Value(openEBill ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(unpaidRotate, {
      toValue: openUnpaid ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [openUnpaid]);

  useEffect(() => {
    Animated.timing(rentRotate, {
      toValue: openRefundRent ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [openRefundRent]);

  useEffect(() => {
    Animated.timing(ebRotate, {
      toValue: openEBill ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [openEBill]);

  const unpaidArrow = unpaidRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const rentArrow = rentRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const ebArrow = ebRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });



  const showApplyToInvoices = BillPdfdetails?.invoiceInfo?.canApplyToOtherInvoice

  const showAdjustWithAdvance = BillPdfdetails?.invoiceInfo?.isAvanceAvailableForRedeem

  // const isDiscounted = BillPdfdetails?.invoiceInfo?.discountAmount > 0;



  const getOverdueDays = (dueDate) => {
    if (!dueDate) return 0;

    const today = dayjs().startOf("day");

    const due = dayjs(dueDate, "DD/MM/YYYY").startOf("day");

    if (!due.isValid()) return 0;

    const diff = today.diff(due, "day");

    return diff > 0 ? diff : 0;
  };


  const overdueDays = getOverdueDays(BillPdfdetails?.dueDate);

  const mappedBillForRecord = {
    invoiceId: bill?.invoiceInfo?.invoiceId,

    dueAmount: invoice?.balanceAmount || invoice?.totalAmount || 0,

    invoiceDate: bill?.invoiceInfo?.invoiceDate,

    fullName: customer?.fullName,

    invoiceType: bill?.configurations?.invoiceType || selectedBill?.invoiceType,

    invoiceNumber: bill?.invoiceNumber || bill?.invoiceInfo?.invoiceNo,

    profilePic: customer?.profilePic,

    initials: customer?.initials,

    customerName: customer?.fullName,
  };

  const handleEditBill = (item) => {
    onClose();

    navigation.navigate("CreateBills", {
      mode: "edit",
      data: item,
    });
  }


  // booking invoice
  // const handleBookingApplyInvoices = async () => {

  //   navigation.navigate("BillsApplyInvoices");

  //   const AdvanceCredits = await GetAdvanceCreditDetails({
  //     hostelId: activeHostelId,
  //     invoiceId: selectedBill?.invoiceId,
  //     type: "Credit", 
  //   })

  //   console.log("AdvanceCredits", AdvanceCredits);
  // }


  const handleBillUnpaid = async () => {
    const res = await MarkBillAsUnpaid({
      hostelId: activeHostelId,
      invoiceId: invoiceDetail?.invoiceId,
    })

    console.log("unpaidstatus", res);


    if (res.success) {
      setModalType("success");
      setModalMessage("Marked as unpaid successfully");
      setShowSuccessModal(true);
      // setShowBillDetails(false)
      onClose();
      setShowUnpaidModal(false)
      setShowMenu(false)

      setTimeout(() => setShowSuccessModal(false), 1500);
    } else {
      setModalType("warning");
      setModalMessage(res?.message || "Something went wrong");
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 1500);
    }
  };





  // const handleClose = () => {
  //     onClose()
  //     setAmountError("");
  //     setDateError("");
  //     setModeError("");
  //    setPaidAmount("");
  //   setBalanceAmount(0);
  //   setPaidDate(null);
  //   setSelectedMode("");
  //   setTransactionId("");

  // }
  const handleShowBookingtoInvoice = () => {
    navigation.navigate("BookingtoDiscount")
    onClose()

  }


  console.log("BillPdfdetails", BillPdfdetails);
  console.log("selectedBill", selectedBill);

  console.log(invoice);
  console.log(invoice?.paymentStatus);
  console.log(invoice?.status);
  console.log(bill?.configurations);
  console.log(selectedBill?.invoiceType);
    // const advanceInfo = InitializebookingBills?.advanceInfo || {};
  const canRedeem = InitializebookingBills?.advanceInfo?.status


  if (!visible) return null;

  return (
    <>


      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />



      <View style={styles.sheetOverlay}>
        {loading && <Loader />}

        <TouchableWithoutFeedback onPress={() => {
          onClose()
          // setShowBillDetails(false)
          setShowPayments(false)
        }}
        >
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.transactionSheet,
            {
              // height: isPaid ? "60%" : isPartial ? "80%" : "60%",
              maxHeight: '98%',
              transform: [{ translateY: detailsSheetY }]
            }
          ]}
          {...billDetailsPan.panHandlers}
        >
          <View style={styles.sheetHandle} />

          <ScrollView showsVerticalScrollIndicator={false}>

            <View style={styles.billHeaderRow}>
              <Text style={styles.billHeaderText}>{selectedBill?.invoiceNo}</Text>


              <View style={{ display: 'flex', flexDirection: 'row' }}>


                <View
                  style={[
                    styles.statusBadge,
                    selectedBill.status === "Available"
                      ? styles.paidBadge : selectedBill.status === "Fully Adjusted" ? styles.adjustedBadge
                        : styles.overdueBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      selectedBill.status === "Available"
                        ? styles.paidText : selectedBill.status === "Fully Adjusted" ? styles.adjustedText
                          : styles.overdueText, 
                    ]}
                  >
                    {selectedBill?.status}
                  </Text>
                </View>



              </View>
            </View>





            <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 15, fontFamily: "Gilroy-Semibold" }}>Total Amount</Text>
              </View>
              <View>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text style={{ fontSize: 18, fontFamily: "Gilroy-Semibold" }}>
                    {/* ₹ {BillPdfdetails?.invoiceInfo?.totalAmount ?? "--"} */}
                    ₹ {selectedBill?.amount ? Number(selectedBill?.amount).toFixed(2) : "0.00"}
                  </Text>
                  {/* <View style={{ marginTop: 3, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            
                                <Image source={TickIcon} style={{ height: 13, width: 13, marginRight: 5, marginTop: 2 }} />
                                <Text style={{ fontSize: 13, fontFamily: "Gilroy-Semibold" }}>Full Paid</Text>
            
                              </View> */}
                </View>

              </View>
            </View>


            <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, fontFamily: "Gilroy-Regular", color: '#3C3C4399' }}>Type</Text>

              <View>
                <Text
                  style={{ fontSize: 14, fontFamily: "Gilroy-Regular" }}
                >
                  {selectedBill?.invoiceType}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, fontFamily: "Gilroy-Regular", color: '#3C3C4399' }}>Received From</Text>

              <View>
                <Text
                  style={{ ffontSize: 14, fontFamily: "Gilroy-Regular" }}
                >
                  {BillPdfdetails?.paymentHistory[0]?.paidBy || "N/A"}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, fontFamily: "Gilroy-Regular", color: '#3C3C4399' }}>Date</Text>

              <View>
                <Text
                  style={{ fontSize: 14, fontFamily: "Gilroy-Regular" }}
                >
                  {BillPdfdetails?.paymentHistory[0]?.date || "N/A"}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, fontFamily: "Gilroy-Regular", color: '#3C3C4399' }}>Payment Method</Text>

              <View>
                <Text
                  style={{ fontSize: 14, fontFamily: "Gilroy-Regular" }}
                >
                  {selectedBill?.paymentMode}
                </Text>
              </View>
            </View>





            <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 15, fontFamily: "Gilroy-Semibold" }}>Balance</Text>

              <View>
                <Text
                  style={{ fontSize: 18, fontFamily: "Gilroy-Semibold" }}
                >
                  ₹ {selectedBill?.availableBalance}
                </Text>
              </View>
            </View>





            {InitializebookingBills?.listInvoices?.length > 0 && (
              <View style={{ marginTop: 25 }}>
                <TouchableOpacity
                  onPress={() => setShowPayments(!showPayments)}
                >
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                    <Text style={styles.paymentHeaderText}>
                      Payments Made
                    </Text>




                    <Image
                      source={DownArrow}
                      style={{ width: 22, height: 22, transform: showPayments ? "rotate(180deg)" : "rotate(0deg)" }}
                    />

                  </View>
                </TouchableOpacity>
                {showPayments && (
                  <View style={{ marginTop: 10 }}>
                    {InitializebookingBills?.listInvoices?.map((pay, index) => (
                      <View key={index} style={styles.paymentCard}>

                        <View style={styles.paymentTopRow}>
                          <TouchableOpacity
                            //   onPress={() => handleOpenReceiptFromBill(pay)} 
                            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                          >
                            <Image source={InvoiceLinkIcon} style={{ height: 14, width: 14, marginLeft: 7, marginRight: 5 }} />
                            <Text style={{ color: "#1E45E1", fontFamily: "Gilroy-Semibold" }}>
                              #{pay?.invoiceNumber}
                            </Text>

                          </TouchableOpacity>

                          <Text style={styles.paymentAmount}>
                            ₹ {pay?.pendingAmount ? Number(pay?.pendingAmount).toFixed(2) : "0.00"}
                          </Text>
                        </View>

                        <View style={styles.divider} />



                        <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View>
                            <Text style={[styles.label, { fontFamily: "Gilroy-Semibold" }]}>Date</Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: 12, fontFamily: "Gilroy-Semibold" }}>
                              {pay?.invoiceDate || "--"}
                            </Text>
                          </View>
                        </View>



                        <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View>
                            <Text style={[styles.label, { fontFamily: "Gilroy-Semibold" }]}>Mode</Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: 12, fontFamily: "Gilroy-Semibold" }}>
                              {pay?.paymentMode ?? "N/A"}
                            </Text>
                          </View>
                        </View>

                      </View>
                    ))}
                  </View>
                )}

              </View>
            )}





          </ScrollView>


          <View style={styles.fixedBottomBar}>


            <>




              <TouchableOpacity
                style={[
                  styles.applyBtn,
                  (!canRedeem || !canUpdateInvoice) && {
                    backgroundColor: "#D1D5DB",
                    opacity: 0.7,
                  },
                ]}
                onPress={handleShowBookingtoInvoice}
                disabled={!canRedeem || !canUpdateInvoice}
              >
                <Image
                  source={LinkIcon}
                  style={{ height: 20, width: 20, marginRight: 5 }}
                />

                <Text style={styles.applyText}>
                  Apply to Invoices
                </Text>
              </TouchableOpacity>





            </>


            {/* {(isPending || isPartial) && (
              <>
                <View style={styles.bottomActionItem}>
                  <TouchableOpacity
                    style={[styles.iconBtn, !isExportAllow && { opacity: 0.4 }]}
                    disabled={!isExportAllow}
                    onPress={handleshareBill}
                  >
                    <Image source={ShareIcon} style={styles.iconDark} />
                  </TouchableOpacity>
                  <Text style={styles.bottomText}>Share</Text>
                </View>

                <View style={styles.bottomActionItem}>
                  <TouchableOpacity
                    style={[styles.downloadBtn, !isExportAllow && { opacity: 0.4 }]}
                    disabled={!isExportAllow} onPress={handleDownloadBillsPdf}>
                    <Image source={DownloadIcon} style={styles.iconDark} />
                  </TouchableOpacity>
                  <Text style={styles.bottomText}>Download</Text>
                </View>

                <View style={styles.bottomActionItem}>
                  <TouchableOpacity
                    style={[styles.recordBtn, !canWriteInvoice && { opacity: 0.4 }]}
                    onPress={handleShowRecordPayment} disabled={!canWriteInvoice}
                  >
                    <Image source={PlusIcon} style={styles.iconWhite} />
                  </TouchableOpacity>
                  <Text style={styles.bottomText}>Record</Text>
                </View>
              </>
            )} */}
          </View>






        </Animated.View>
      </View>


    </>

  );
};

export default RetainerDetailsSheet;



const styles = StyleSheet.create({

  sheetHandle: {
    width: 60,
    height: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 30,
    marginBottom: 15,
  },
  transactionSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 30,
    minHeight: 400,
  },
  sheetOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    zIndex: 9999,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  billHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },

  billHeaderText: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    color: "#000",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minHeight: 26,
    alignSelf: "flex-start",
    elevation: 1,
  },
  paidBadge: {
    backgroundColor: "#DCFCE7",
  },
  adjustedBadge: { backgroundColor: '#FFE9E3' },
  overdueBadge: {
    backgroundColor: "#FEF3C7",
  },



  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },


  statusText: {
    fontSize: 12,
    fontFamily: "Gilroy-Bold",
  },
  paidText: {
    color: "#15803D",
  },
  adjustedText: {
    color: '#E02D2D'
  },
  overdueText: {
    color: "#FF9900",
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10
  },

  reminderBtn: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#E8F7EE",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1
  },

  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#E8F0FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1
  },

  reminderText: {
    color: "#00A653",
    fontFamily: "Gilroy-Semibold",
    marginLeft: 6
  },

  callText: {
    color: "#1E45E1",
    fontFamily: "Gilroy-Semibold",
    marginLeft: 6
  },

  actionIcon: {
    width: 18,
    height: 18
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  userImg: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },

  userName: {
    fontSize: 17,
    fontFamily: "Gilroy-Bold",
    color: "#000",
  },

  invTypeBadge: {
    backgroundColor: "#FFE6C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },

  invTypeText: {
    color: "#C67506",
    fontFamily: "Gilroy-Semibold",
    fontSize: 12,
  },
  iconDark: {
    width: 20,
    height: 20
  },

  iconWhite: {
    width: 20,
    height: 20,
    tintColor: "#fff"
  },
  fixedBottomBar: {

    // paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff"
  },
  paidBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 6
  },

  paidText: {
    marginLeft: 6,
    fontFamily: "Gilroy-Semibold"
  },

  /* ICON BUTTONS */
  bottomActionItem: {
    alignItems: "center",
    flex: 1,
    marginRight: 15
  },

  iconBtn: {
    backgroundColor: "#F3F4F6",
    // padding:14,
    paddingVertical: 14,
    paddingHorizontal: 37,
    borderRadius: 10,
    marginRight: 20
  },

  downloadBtn: {
    backgroundColor: "#F3F4F6",
    // padding:14,
    paddingVertical: 14,
    paddingHorizontal: 37,
    borderRadius: 10,
    marginRight: 20,
    marginLeft: 15
  },

  recordBtn: {
    backgroundColor: "#00A32E",
    paddingVertical: 14,
    paddingHorizontal: 37,
    borderRadius: 10,
    marginLeft: 15
  },

  bottomText: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: "Gilroy-Semibold"
  },

  paymentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  paymentHeaderText: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#111",
  },

  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  paymentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Gilroy-Semibold"
  },

  receiptText: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
    color: "#111",
  },

  paymentAmount: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  paymentLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  paymentValue: {
    fontSize: 13,
    fontFamily: "Gilroy-Semibold",
    color: "#111",
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmBox: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 10,
  },

  confirmTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  confirmIcon: { width: 22, height: 22, marginRight: 8, marginBottom: 10 },

  confirmTitle: {
    fontSize: 17,
    fontFamily: "Gilroy-Bold",
    color: "#111",
  },

  confirmMessage: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
    fontFamily: "Gilroy-Medium"
  },

  confirmButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  cancelConfirmBtn: {
    borderWidth: 1,
    borderColor: "#C7C7CC",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },

  cancelConfirmText: {
    fontSize: 15,
    color: "#555",
    fontFamily: "Gilroy-Semibold"
  },

  okConfirmBtn: {
    backgroundColor: "#2D6CDF",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },

  okConfirmText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Gilroy-Bold"
  },
  applyBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#9C9C9C",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
  },

  applyText: {
    fontFamily: "Gilroy-Semibold",
    fontSize: 16,
  },
  billNumber: {
    color: "#555",
    fontSize: 13,
    alignSelf: "center",
    fontFamily: "Gilroy-Semibold",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E8F0FF",
  },

})
