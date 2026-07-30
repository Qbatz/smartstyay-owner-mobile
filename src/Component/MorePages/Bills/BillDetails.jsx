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



const BillDetailsSheet = ({
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





  const { BillDetails, loading, GetAllBillDetails,RecordPayment, GetInitializeRefundDetails, CreateRefund,
     refundError, GetRecurringBills, recurringBills, BillPdfdetails, getBillsPdfDetails, getReceiptPdfDetails, downloadReceipt, DeleteReceipt,
    downloadBill, shareBillOnWhatsapp, shareReceiptOnWhatsapp, GetReceiptsList, receiptsList, MarkBillAsUnpaid, GetAdvanceCreditDetails,
     GetInitializeAdvanceRedeem,GetInitializeRecordPaymentDetails } = useContext(BillContext);
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

  const handleShowRecordPayment =async() => {
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


  // const handleApplyInvoice = async () => {
  //   navigation.navigate("BookingtoDiscount", {
  //     source: "bill",
  //     invoiceType: "advance",
  //   })
  //   const res = await GetInitializeAdvanceRedeem({
  //     hostelId: activeHostelId,
  //     advanceInvoiceId: selectedBill?.invoiceId,
  //   });
  // }

  // Advance invoice
  // const handleAdvanceApplyInvoices = async () => {

  //   navigation.navigate("BillsApplyInvoices", {
  //     bill: selectedBill,
  //   });

  //   const AdvanceCredits = await GetAdvanceCreditDetails({
  //     hostelId: activeHostelId,
  //     invoiceId: selectedBill?.invoiceId,
  //     type: "", 
  //   })
  // }

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


  console.log("BillPdfdetails", BillPdfdetails);
  console.log("selectedBill", selectedBill);

  console.log(invoice);
  console.log(invoice?.paymentStatus);
  console.log(invoice?.status);
  console.log(bill?.configurations);
  console.log(selectedBill?.invoiceType);


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
              <Text style={styles.billHeaderText}>{(bill?.invoiceNumber || bill?.invoiceInfo?.invoiceNo) || "N/A"}</Text>


              <View style={{ display: 'flex', flexDirection: 'row' }}>


                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: BillsStatusStyle.bg },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: BillsStatusStyle.dot },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: BillsStatusStyle.text },
                    ]}
                  >
                    {paymentStatus}
                  </Text>
                </View>


                {/* {
                  ((!isPaid) ||
                    (isPaid && invoiceDetail?.invoiceMode === "Manual" && bill?.configurations?.invoiceType !== "Settlement")) && ( */}
                {
                  // !cancelled && !pendingRefund &&
                  //   !partiallyRefund &&
                  //   !FullyRefund &&
                  // (
                  //   (!isPaid) ||
                  //   (isPaid &&
                  //     invoiceDetail?.invoiceMode === "Manual" &&
                  //     bill?.configurations?.invoiceType !== "Settlement")
                  // )

                  showDotsbtn
                  && (
                    <TouchableOpacity
                      ref={(ref) => (dotsRefs.current[bill?.invoiceId] = ref)}
                      onPress={() => openMenu(bill)}
                    >
                      <Image
                        source={Dots}
                        style={{ width: 30, height: 30 }}
                      />
                    </TouchableOpacity>
                  )
                }
              </View>
            </View>

            {/* <View style={styles.userRow}>
              {customer?.profilePic ? (
                <Image
                  source={{ uri: customer.profilePic }}
                  style={styles.userImg}
                />
              ) : (
                <View style={styles.initialCircle}>
                  <Text style={styles.initialText}>
                    {customer?.initials || customer?.fullName?.slice(0, 2)?.toUpperCase()}
                  </Text>
                </View>
              )}


              <View style={{ flex: 1, marginLeft: 12 }}>
                <TouchableOpacity
               
                >
                  <Text style={styles.userName}>{customer?.fullName || "--"}</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", marginTop: 4 }}>
                  <View style={styles.invTypeBadge}>
                    <Text style={styles.invTypeText}>{bill?.configurations?.invoiceType}</Text>
                  </View>

                  <Image source={Bills_Black_Icon} style={{
                    width: 12,
                    height: 12, marginTop: 5, marginRight: 5
                  }} />
                  <Text style={styles.billNumber}>{bill?.invoiceNumber || "--"}</Text>
                </View>
              </View>
            </View> */}

            {/* {(isPending || isPartial || partiallyRefund || pendingRefund) && (
              <View style={styles.actionRow}>

                <TouchableOpacity
                  style={[styles.reminderBtn, !isExportAllow && { opacity: 0.4 }]}
                  disabled={!isExportAllow}
                  onPress={handleWhatsappShareBill}>
                  <Image source={WhatsappGreenIcon} style={styles.actionIcon} />
                  <Text style={styles.reminderText}>Reminder </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.callBtn, !isExportAllow && { opacity: 0.4 }]}
                  disabled={!isExportAllow}
                  onPress={() => {
                    handleCallPhone(BillPdfdetails?.customerInfo?.customerMobileNo)
                  }}>
                  <Image source={Call} style={styles.actionIcon} />
                  <Text style={styles.callText}>Call</Text>
                </TouchableOpacity>

              </View>
            )} */}

            <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 15, fontFamily: "Gilroy-Semibold" }}>Total Amount</Text>
              </View>
              <View>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text style={styles.amountValue}>
                    {/* ₹ {BillPdfdetails?.invoiceInfo?.totalAmount ?? "--"} */}
                    ₹ {(BillPdfdetails?.invoiceInfo?.totalAmount || BillPdfdetails?.invoiceInfo?.finalAmount) ? Number(BillPdfdetails?.invoiceInfo?.totalAmount || BillPdfdetails?.invoiceInfo?.finalAmount).toFixed(2) : "0.00"}
                  </Text>
                  {isPaid && (
                    <View style={{ marginTop: 3, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

                      <Image source={TickIcon} style={{ height: 13, width: 13, marginRight: 5, marginTop: 2 }} />
                      <Text style={{ fontSize: 13, fontFamily: "Gilroy-Semibold" }}>Full Paid</Text>

                    </View>
                  )}
                </View>

              </View>
            </View>

            {isDiscounted && (
              <View style={styles.discountCard}>

                {/* Actual Amount */}
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.discountLabel}>Actual Amount</Text>
                  <Text style={styles.discountValue}>
                    ₹ {(
                      (BillPdfdetails?.invoiceInfo?.totalAmount || 0) +
                      (BillPdfdetails?.invoiceInfo?.discountAmount || 0)
                    ).toFixed(2)}
                  </Text>
                </View>

                {/* Discount */}
                {/* <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                  <Text style={styles.discountLabel}>Discount</Text>
                  <Text style={styles.discountMinus}>
                    - ₹ {BillPdfdetails?.invoiceInfo?.discountAmount.toFixed(2)}
                  </Text>
                </View> */}

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.discountLabel}>Discount</Text>
                    <TouchableOpacity onPress={() => setShowDiscountSheet(true)}>
                      <Image source={DiscountDown} style={{ height: 22, width: 22 }} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.discountMinus}>
                    - ₹ {BillPdfdetails?.invoiceInfo?.discountAmount.toFixed(2)}
                  </Text>

                </View>

                {/* Badge */}
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>
                    ✔ Discount Applied
                  </Text>
                </View>

              </View>
            )}

            {selectedBill?.invoiceType === "Settlement" && showSettlementRedeem && (


              <>

                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 13, fontFamily: "Gilroy-Medium" }}>Refundable Advance</Text>
                  </View>
                  <View>
                    <Text style={styles.amountValue}>

                      ₹ {BillPdfdetails?.advanceItems?.paidAmount || 0}
                      {/* ₹ {pay?.amount ? Number(pay.amount).toFixed(2) : "0.00"} */}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 13, fontFamily: "Gilroy-Medium" }}>Payable Rent</Text>
                  </View>
                  <View>
                    <Text style={styles.amountValue}>

                      ₹ {BillPdfdetails?.currentMonthRentInfo?.currentMonthPayableAmount || 0}
                      {/* ₹ {pay?.amount ? Number(pay.amount).toFixed(2) : "0.00"} */}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 13, fontFamily: "Gilroy-Medium" }}>Deductions</Text>
                  </View>
                  <View>
                    <Text style={[
                      styles.amountValue,
                      { color: "#FF0000" },
                    ]}>
                      ₹  {BillPdfdetails?.invoiceInfo?.deductionAmount || 0}
                      {/* ₹ {pay?.amount ? Number(pay.amount).toFixed(2) : "0.00"} */}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 13, fontFamily: "Gilroy-Medium" }}>Electricity Bill</Text>
                  </View>
                  <View>
                    <Text style={[
                      styles.amountValue,
                      { color: "#FF0000" },
                    ]}>

                      ₹  {BillPdfdetails?.invoiceInfo?.electricityAmount || 0}
                      {/* ₹ {pay?.amount ? Number(pay.amount).toFixed(2) : "0.00"} */}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 13, fontFamily: "Gilroy-Medium" }}>Unpaid Invoices </Text>
                  </View>
                  <View>
                    <Text style={[
                      styles.amountValue,
                      { color: "#FF0000" },
                    ]} >
                      ₹  {BillPdfdetails?.invoiceInfo?.unpaidInvoiceAmount || 0}
                      {/* ₹ {pay?.amount ? Number(pay.amount).toFixed(2) : "0.00"} */}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={[styles.label, { fontFamily: "Gilroy-Semibold" }]}>Type</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, fontFamily: "Gilroy-Semibold" }}>
                      Manual
                    </Text>
                  </View>
                </View>

              </>
            )}


            {!cancelled &&
              bill?.configurations?.invoiceType !== "Booking" && (
                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={[styles.label, { fontFamily: "Gilroy-Semibold" }]}>Invoice date</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, fontFamily: "Gilroy-Semibold" }}>
                      {BillPdfdetails?.invoiceDate ?? BillPdfdetails?.invoiceInfo?.invoiceDate}
                    </Text>
                  </View>
                </View>
              )}

            {selectedBill?.invoiceType !== "Settlement" && (
              <>

                {BillPdfdetails?.invoiceInfo?.invoiceItems?.map((pay, index) => (
                  <View key={index} style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ fontSize: 13, fontFamily: "Gilroy-Medium" }}>{pay?.description ?? "N/A"}</Text>
                    </View>
                    <View>
                      <Text style={styles.amountValue}>
                        ₹ {pay?.amount ? Number(pay.amount).toFixed(2) : "0.00"}
                      </Text>
                    </View>
                  </View>
                ))}

                {BillPdfdetails?.invoiceInfo?.listDeductions?.map((pay, index) => (
                  <View key={index} style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ fontSize: 13, fontFamily: "Gilroy-Medium" }}>{pay?.type ?? "N/A"}</Text>
                    </View>
                    <View>
                      <Text style={styles.amountValue}>
                        ₹ {pay?.amount ? Number(pay.amount).toFixed(2) : "0.00"}
                      </Text>
                    </View>
                  </View>
                ))}



                {(isPartial || partiallyRefund) && (
                  <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ fontSize: 15, fontFamily: "Gilroy-Semibold" }}>Due Pending</Text>
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.amountValue,
                          { color: "#FF0000" },
                        ]}
                      >
                        ₹ {BillPdfdetails?.invoiceInfo?.balanceAmount ?? 0}
                      </Text>
                    </View>
                  </View>

                )}

              </>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontSize: 14, fontFamily: "Gilroy-Semibold", color: "#777", }}>
                Invoice Date</Text>
              <Text style={{ fontSize: 13, fontFamily: "Gilroy-Semibold" }}>{BillPdfdetails?.invoiceDate}</Text>
            </View>

            {BillPdfdetails?.invoiceInfo?.isCancelled && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ fontSize: 14, fontFamily: "Gilroy-Semibold", color: "#777", }}>
                  Cancelled on</Text>
                <Text style={{ fontSize: 13, fontFamily: "Gilroy-Semibold" }}>{BillPdfdetails?.invoiceInfo?.cancelledOn}</Text>
              </View>
            )}


            {selectedBill?.paymentStatus === "Cancelled" && (
              <View style={styles.cancelInfoCard}>

                <View style={styles.cancelIconWrapper}>
                  <Text style={styles.cancelIconText}>i</Text>
                </View>

                <Text style={styles.cancelInfoText}>
                  Invoice cancelled due to Final Settlement
                </Text>

              </View>
            )}




            {(isPaid || isPartial) && BillPdfdetails?.paymentHistory?.length > 0 && (
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
                    {BillPdfdetails?.paymentHistory?.map((pay, index) => (
                      <View key={index} style={styles.paymentCard}>

                        <View style={styles.paymentTopRow}>
                          <TouchableOpacity onPress={() => handleOpenReceiptFromBill(pay)} style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ color: "#1E45E1", fontFamily: "Gilroy-Semibold" }}>
                              #{pay?.referenceNumber}
                            </Text>
                            <Image source={InvoiceLinkIcon} style={{ height: 14, width: 14, marginLeft: 7 }} />
                          </TouchableOpacity>

                          <Text style={styles.paymentAmount}>
                            ₹ {pay?.amount ? Number(pay.amount).toFixed(2) : "0.00"}
                          </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1, }}>
                          <View style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Text style={[styles.label, { fontFamily: "Gilroy-Semibold" }]}> Date</Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: 12, fontFamily: "Gilroy-Semibold" }}>
                              {pay?.date ?? "N/A"}
                            </Text>
                          </View>
                        </View>




                        <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View>
                            <Text style={[styles.label, { fontFamily: "Gilroy-Semibold" }]}>Mode</Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: 12, fontFamily: "Gilroy-Semibold" }}>
                              {pay?.bankAccount ?? "N/A"}
                            </Text>
                          </View>
                        </View>
                        <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View>
                            <Text style={[styles.label, { fontFamily: "Gilroy-Semibold" }]}>Transaction ID</Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: 12, fontFamily: "Gilroy-Semibold" }}>
                              {pay?.referenceNumber ?? "N/A"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

              </View>
            )}


            {(paymentStatus === "Partially Refunded" ||
              paymentStatus === "Refunded") &&
              BillPdfdetails?.refundHistory?.length > 0 && (
                <View style={{ marginTop: 25 }}>

                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.paymentHeaderText}>
                      Payments Made
                    </Text>

                    <TouchableOpacity
                      style={styles.paymentHeader}
                      onPress={() => setShowPayments(!showPayments)}
                    >
                      <Image
                        source={DownArrow}
                        style={{ width: 18, height: 18, transform: showPayments ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </TouchableOpacity>
                  </View>

                  {showPayments && (
                    <View style={{ marginTop: 10 }}>
                      {BillPdfdetails?.refundHistory?.map((pay, index) => (
                        <View key={index} style={styles.paymentCard}>

                          <TouchableOpacity style={styles.paymentTopRow}>
                            <Text >
                              #{BillPdfdetails?.invoiceNumber}
                              <Image source={InvoiceLinkIcon} style={{ height: 14, width: 14 }} />
                            </Text>

                            <Text style={styles.paymentAmount}>
                              ₹ {pay?.amount ? Number(pay.amount).toFixed(2) : "0.00"}
                            </Text>
                          </TouchableOpacity>

                          <View style={styles.divider} />

                          <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                              <Text style={[styles.label, { fontFamily: "Gilroy-Semibold" }]}> date</Text>
                            </View>
                            <View>
                              <Text style={{ fontSize: 12, fontFamily: "Gilroy-Semibold" }}>
                                {pay?.date ?? "N/A"}
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
                          <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                              <Text style={[styles.label, { fontFamily: "Gilroy-Semibold" }]}>Transaction ID</Text>
                            </View>
                            <View>
                              <Text style={{ fontSize: 12, fontFamily: "Gilroy-Semibold" }}>
                                {pay?.referenceNumber ?? "N/A"}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                </View>
              )}



            {selectedBill?.invoiceType === "Settlement" && showSettlementRedeem && (


              <>
                <View style={styles.accordionCard}>
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => setOpenUnpaid(!openUnpaid)}
                    activeOpacity={0.8}
                  >
                    <Animated.Image
                      source={DownArrow}
                      style={[styles.arrowImg, { transform: [{ rotate: unpaidArrow }] }]}
                    />
                    <Text style={styles.cardTitle}>Unpaid Invoices</Text>
                    <Text style={styles.amountText}>
                      ₹  {BillPdfdetails?.invoiceInfo?.unpaidInvoiceAmount || 0}
                    </Text>
                  </TouchableOpacity>

                  {openUnpaid && (

                    <View style={styles.accordionBody}>

                      <View style={styles.tableHeader}>
                        <Text style={[styles.th, { flex: 1 }]}>Invoice No</Text>
                        {/* <Text style={[styles.th, { flex: 1 }]}>Type</Text> */}
                        <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>
                          Invoice Amount
                        </Text>
                      </View>


                      {Array.isArray(BillPdfdetails?.unpaidInvoiceInfo?.unpaidInvoiceItems) &&
                        BillPdfdetails?.unpaidInvoiceInfo?.unpaidInvoiceItems.length > 0 ? (
                        <>
                          {BillPdfdetails?.unpaidInvoiceInfo?.unpaidInvoiceItems?.map((item, index) => (
                            <View key={index} style={styles.invoiceRow}>
                              <Text style={[styles.invText, { flex: 1, color: "#2563EB" }]}>
                                {item?.invoiceNumber}
                              </Text>
                              {/* <Text style={[styles.invText, { flex: 1 }]}>
                                                      {item?.type}
                                                    </Text> */}
                              <Text style={[styles.invText, { flex: 1, textAlign: "right" }]}>
                                ₹ {item?.pendingAmount}
                              </Text>
                            </View>
                          ))}
                        </>
                      ) : (
                        <View style={styles.emptyWallet}>
                          <View style={styles.emptyState}>
                            <Text style={styles.emptyWalletText}>No pending invoices</Text>
                          </View>
                        </View>
                      )}

                      <View style={styles.totalInvoiceRow}>
                        <Text style={styles.totalText}>Total</Text>
                        <Text style={styles.totalAmount}>
                          {BillPdfdetails?.unpaidInvoiceInfo?.unpaidInvoiceTotalAmount}
                          {/* ₹{" "}
                                                        {Array.isArray(settlementDetails?.unpaidInvoices)
                                                          ? settlementDetails.unpaidInvoices.reduce(
                                                            (sum, i) => sum + Number(i.payableAmount || 0),
                                                            0
                                                          )
                                                          : 0} */}
                        </Text>
                      </View>
                    </View>

                  )}
                </View>

                <View style={styles.refundCard}>

                  <TouchableOpacity
                    style={styles.refundHeader}
                    onPress={() => setOpenRefundRent(!openRefundRent)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={DownArrow}
                        style={[
                          styles.arrow,
                          openRefundRent && { transform: [{ rotate: "180deg" }] },
                        ]}
                      />
                      <Text style={styles.refundTitle}>Payable Rent</Text>
                    </View>

                    <Text style={styles.refundAmount}>
                      ₹ {BillPdfdetails?.currentMonthRentInfo?.currentMonthPayableAmount}
                      {/* ₹{" "}
                                                    {Number(
                                                      settlementDetails?.currentMonthRentInfo?.currentMonthPayableAmount || 0
                                                    ).toLocaleString("en-IN")} */}
                    </Text>
                  </TouchableOpacity>

                  {openRefundRent && (
                    <View style={styles.refundBody}>


                      <TouchableOpacity
                        style={styles.rowBetween}
                        onPress={() => setShowLastRentDetails(!showLastRentDetails)}
                        activeOpacity={0.7}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={styles.descText}>
                            {/* 0 days */}
                            Last Rent Paid ({BillPdfdetails?.currentMonthRentInfo?.currentMonthStayDays} days)
                          </Text>

                          {/* <Image
                                                  source={DownArrow}
                                                  style={[
                                                    styles.arrowSmall,
                                                    showLastRentDetails && { transform: [{ rotate: "180deg" }] },
                                                  ]}
                                                /> */}
                        </View>

                        <Text style={styles.amountText}>

                          ₹ {Number(
                            BillPdfdetails?.currentMonthRentInfo?.currentMonthPaidAmount || 0
                          ).toLocaleString("en-IN")}
                        </Text>
                      </TouchableOpacity>

                      {/* {showLastRentDetails && (
                                              <View style={styles.detailCard}>
                                                <Text style={styles.sectionLabel}>
                                                  Actual Stay Days(Rent)-{BillPdfdetails?.currentMonthRentInfo?.currentMonthStayDays}</Text>
                                                <Text style={styles.amountText}>
                                                  0
                                                  ₹ {settlementDetails?.currentMonthRentInfo?.currentMonthRent || 0}
                                                </Text>
                                              </View>
                                            )} */}

                      {/* {showLastRentDetails && settlementDetails?.currentMonthRentInfo?.discountAmount > 0 && (
                                                      <View style={styles.detailCard}>
                                                        <Text style={styles.sectionLabel}>Discount</Text>
                                                        <Text style={styles.rightMuted}>
                                                          ₹ {settlementDetails?.currentMonthRentInfo?.discountAmount}
                                                        </Text>
                                                      </View>
                                                    )} */}

                      <TouchableOpacity
                        style={styles.rowBetween}
                        onPress={() => setShowDetails(!showDetails)}
                        activeOpacity={0.7}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={styles.descText}>
                            Actual Stay Days (Rent) - {BillPdfdetails?.currentMonthRentInfo?.currentMonthStayDays}
                          </Text>

                          <Image
                            source={DownArrow}
                            style={[
                              styles.arrowSmall,
                              showDetails && { transform: [{ rotate: "180deg" }] },
                            ]}
                          />
                        </View>

                        <Text style={styles.amountText}>
                          ₹{" "}
                          {Number(
                            BillPdfdetails?.currentMonthRentInfo?.listBreakup[0]?.rentPerDay * BillPdfdetails?.currentMonthRentInfo?.listBreakup[0]?.noOfDays || 0
                          ).toLocaleString("en-IN")}
                        </Text>
                      </TouchableOpacity>

                      {showDetails &&
                        BillPdfdetails?.currentMonthRentInfo?.listBreakup?.map(
                          (item, index) => (

                            <View key={index} style={{
                              flexDirection: 'row', backgroundColor: '#F9F9F9', alignItems: 'center',
                              padding: 8, borderRadius: 8
                            }}>
                              <Text style={styles.linkText}>
                                {item?.floorName} | {item?.roomName} - {item?.bedName}
                              </Text>

                              <Text
                                style={styles.rightMuted}
                                numberOfLines={0}
                              >
                                ({item?.noOfDays} {item?.noOfDays === 1 ? "day" : "days"} × {item?.rentPerDay})
                              </Text>
                            </View>

                          )
                        )
                      }
                      <TouchableOpacity
                        style={styles.rowBetween}
                        onPress={() => setShowOtherDetails(!showOtherDetails)}
                        activeOpacity={0.7}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={styles.descText}>
                            Other Charges
                          </Text>

                          <Image
                            source={DownArrow}
                            style={[
                              styles.arrowSmall,
                              showOtherDetails && { transform: [{ rotate: "180deg" }] },
                            ]}
                          />
                        </View>

                        <Text style={styles.amountText}>

                          ₹{" "}
                          {Number(BillPdfdetails?.currentMonthRentInfo?.currentMonthOtherItemAmount || 0).toLocaleString("en-IN")}


                        </Text>
                      </TouchableOpacity>

                      {showOtherDetails &&
                        BillPdfdetails?.currentMonthRentInfo?.listCurrentMonthOtherItems?.map(
                          (i, index) => (
                            <View key={index} style={styles.detailCard}>
                              <Text style={styles.linkText}>
                                {i?.item}
                              </Text>

                              <Text style={styles.rightMuted}>
                                ₹ {i?.amount}
                              </Text>
                            </View>
                          )
                        )}
                    </View>
                  )}
                </View>

                <View style={styles.accordionCard}>
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => setOpenEBill(!openEBill)}
                    activeOpacity={0.8}
                  >
                    <Animated.Image
                      source={DownArrow}
                      style={[styles.arrowImg, { transform: [{ rotate: ebArrow }] }]}
                    />
                    <Text style={styles.cardTitle}>Electricity Bill</Text>
                    <Text style={styles.amountText}>
                      ₹  {BillPdfdetails?.invoiceInfo?.electricityAmount || 0}
                    </Text>
                  </TouchableOpacity>

                  {openEBill && (
                    <View style={styles.accordionBody}>

                      {/* {settlementDetails?.ebInfo?.missedEb?.length > 0 && (
                                                      <Text style={styles.sectionLabel}>Missed Electricity</Text>
                                                    )} */}

                      {/* 
                                            {BillPdfdetails?.currentMonthEbInfo?.map((item, index) => (
                                                      <View key={index} style={styles.ebRowWeb}>
                                  
                                                        <View style={{ flex: 1 }}>
                                                          <Text style={styles.ebText}>
                                                            {item?.floorName} | {item?.roomName} - {item?.bedName}
                                                          </Text>
                                  
                                                          <View style={styles.dateChip}>
                                                            <Text style={styles.dateChipText}>
                                                              {item?.fromDate} - {item?.toDate}
                                                            </Text>
                                                          </View>
                                                        </View>
                                  
                                                      
                                                      </View>
                                                    ))} */}


                      {/* <Text style={styles.sectionLabel}>Pending Invoices</Text> */}

                      {BillPdfdetails?.currentMonthEbInfo?.ebItemsList.map((item, index) => (
                        <View key={index} style={styles.ebRowWeb}>

                          <View style={{ flex: 1 }}>
                            <Text style={styles.ebText}>
                              {item?.floorName || "Floor"} | {item?.roomName || "Room"} - {item?.bedName || "Bed"}
                            </Text>

                            <View style={[styles.dateChip, { backgroundColor: "#E0F2FE" }]}>
                              <Text style={[styles.dateChipText, { color: "#1D4ED8" }]}>
                                {formatEBDate(item?.fromDate)} - {formatEBDate(item?.toDate)}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.ebRightBox}>
                            <Text style={styles.unitText}>
                              ({item.consumption} Units)
                            </Text>
                            <Text style={styles.amountText}>
                              ₹ {item?.totalAmount}
                            </Text>
                          </View>

                        </View>
                      ))}



                    </View>
                  )}
                </View>


                {showSettlementRedeem && (
                  <View style={styles.accordionCard}>
                    <TouchableOpacity
                      style={styles.accordionHeader}
                      onPress={() => setShowRefundableAdvance(!showRefundableAdvance)}
                      activeOpacity={0.8}
                    >
                      <Animated.Image
                        source={DownArrow}
                        style={[styles.arrowImg, { transform: [{ rotate: unpaidArrow }] }]}
                      />
                      <Text style={styles.cardTitle}>Refundable Advance</Text>
                      <Text style={styles.amountText}>

                        ₹ {BillPdfdetails?.advanceItems?.availableAdvanceBalance}
                        {/* {
                                                    settlementDetails?.unpaidInvoiceInfo?.listUnpaidInvoices?.reduce(
                                                      (sum, inv) => sum + Number(inv.payableAmount || 0),
                                                      0
                                                    ) || 0
                                                  } */}
                      </Text>
                    </TouchableOpacity>

                    {showRefundableAdvance && (

                      <View style={styles.accordionBody}>

                        <View style={styles.tableHeader}>
                          <Text style={[styles.th, { flex: 1 }]}>Invoice No</Text>
                          <Text style={[styles.th, { flex: 1 }]}>Type</Text>
                          <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>
                            Invoice Amount
                          </Text>
                        </View>

                        {BillPdfdetails?.advanceItems ? (
                          <View style={styles.invoiceRow}>
                            <Text style={[styles.invText, { flex: 1, color: "#2563EB" }]}>
                              {BillPdfdetails?.advanceItems?.invoiceNo}
                            </Text>

                            <Text style={[styles.invText, { flex: 1 }]}>
                              {BillPdfdetails?.advanceItems?.label}
                            </Text>

                            <Text
                              style={[
                                styles.invText,
                                { flex: 1, textAlign: "right" }
                              ]}
                            >
                              ₹ {BillPdfdetails?.advanceItems?.paidAmount || 0}
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.emptyWallet}>
                            <View style={styles.emptyState}>
                              <Text style={styles.emptyWalletText}>No pending invoices</Text>
                            </View>
                          </View>
                        )}

                        {/* )} */}

                        <View style={styles.totalInvoiceRow}>
                          <Text style={styles.totalText}>Total</Text>
                          <Text style={styles.totalAmount}>
                            ₹ {BillPdfdetails?.advanceItems?.paidAmount || 0}
                            {/* ₹{" "}
                                                        {Array.isArray(settlementDetails?.unpaidInvoices)
                                                          ? settlementDetails.unpaidInvoices.reduce(
                                                            (sum, i) => sum + Number(i.payableAmount || 0),
                                                            0
                                                          )
                                                          : 0} */}
                          </Text>
                        </View>
                      </View>

                    )}
                  </View>
                )}




                {showSettlementRedeem && (
                  <View style={styles.accordionCard}>
                    <TouchableOpacity
                      style={styles.accordionHeader}
                      onPress={() => setShowBookings(!showBookings)}
                      activeOpacity={0.8}
                    >

                      <Animated.Image
                        source={DownArrow}
                        style={[styles.arrowImg, { transform: [{ rotate: unpaidArrow }] }]}
                      />
                      <Text style={styles.cardTitle}>Bookings</Text>
                      <Text style={styles.amountText}>

                        ₹ {BillPdfdetails?.bookingItems?.availableAdvanceBalance}
                        {/* {
                                                    settlementDetails?.unpaidInvoiceInfo?.listUnpaidInvoices?.reduce(
                                                      (sum, inv) => sum + Number(inv.payableAmount || 0),
                                                      0
                                                    ) || 0
                                                  } */}
                      </Text>
                    </TouchableOpacity>

                    {showBookings && (

                      <View style={styles.accordionBody}>

                        <View style={styles.tableHeader}>
                          <Text style={[styles.th, { flex: 1 }]}>Adjusted with</Text>
                          {/* <Text style={[styles.th, { flex: 1 }]}>Type</Text> */}
                          <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>
                            APllied Amount
                          </Text>
                        </View>


                        {BillPdfdetails?.bookingItems?.redeemedList?.length > 0 ? (
                          BillPdfdetails.bookingItems.redeemedList.map((item, index) => (
                            <View key={index} style={styles.invoiceRow}>
                              <Text style={[styles.invText, { flex: 1 }]}>
                                {item?.invoiceNumber}
                              </Text>

                              <Text
                                style={[
                                  styles.invText,
                                  { flex: 1, textAlign: "right" }
                                ]}
                              >
                                ₹ {item?.redeemedAmount || 0}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <View style={styles.emptyWallet}>
                            <View style={styles.emptyState}>
                              <Text style={styles.emptyWalletText}>No Pending Bookings</Text>
                            </View>
                          </View>
                        )}

                        <View style={styles.totalInvoiceRow}>
                          <Text style={styles.totalText}>Total</Text>
                          <Text style={styles.totalAmount}>
                            ₹ {BillPdfdetails?.bookingItems?.paidAmount || 0}
                          </Text>
                        </View>
                      </View>

                    )}
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.accordionCard}
                  onPress={() => setShowWallet(!showWallet)}
                >
                  <View style={styles.accordionHeader}>
                    <View style={styles.accordionLeft}>
                      {/* <Image
                      source={showWallet ? ArrowUp : ArrowDown}
                      style={styles.arrowIcon}
                    /> */}

                      <Image
                        source={DownArrow}
                        style={[
                          styles.arrowImg,
                          showWallet && { transform: [{ rotate: "180deg" }] },
                        ]}
                      />
                      {/* <Animated.Image
                                              source={DownArrow}
                                              style={[styles.arrowImg, { transform: [{ rotate: unpaidArrow }] }]}
                                            /> */}

                      <Text style={styles.accordionTitle}>
                        Wallet
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.amountText,
                        {
                          color:
                            (BillPdfdetails?.walletInfo?.totalWalletAmount || 0) < 0
                              ? "#DC2626"
                              : "#16A34A",
                        },
                      ]}
                    >
                      ₹ {BillPdfdetails?.walletInfo?.totalWalletAmount || 0}
                    </Text>
                  </View>

                  {showWallet && (
                    <View style={styles.accordionBody}>
                      {BillPdfdetails?.walletInfo?.walletItems?.length > 0 ? (
                        BillPdfdetails?.walletInfo?.walletItems?.map((item, index) => (
                          <View
                            key={index}
                            style={styles.walletRow}
                          >
                            <Text style={styles.walletSource}>
                              {item?.name}
                            </Text>

                            <Text
                              style={[
                                styles.walletAmount,
                                {
                                  color:
                                    item?.amount < 0
                                      ? "#DC2626"
                                      : "#16A34A",
                                },
                              ]}
                            >
                              ₹ {item?.amount}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <View style={styles.emptyWallet}>
                          <Text style={styles.emptyWalletText}>
                            No wallet transactions available
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </TouchableOpacity>



              </>
            )}







            {!isPaid &&
              !cancelled &&
              bill?.configurations?.invoiceType !== "Booking" && selectedBill?.invoiceType !== "Settlement" && (
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={[styles.label, { fontFamily: "Gilroy-Semibold" }]}>Due date</Text>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 12, fontFamily: "Gilroy-Semibold" }}>
                      {BillPdfdetails?.dueDate ?? "--"}
                    </Text>

                    {overdueDays > 0 && (
                      <Text
                        style={{
                          color: "#F97316",
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        Overdue by {overdueDays}{" "}
                        {overdueDays === 1 ? "Day" : "Days"}
                      </Text>
                    )}
                  </View>
                </View>
              )}


            {/* {BillPdfdetails?.invoiceInfo?.avilableAmountToRedeem > 0 && (
              <View style={styles.creditCard}>
                <View style={styles.creditTopRow}>
                  <View style={styles.creditTitleRow}>
                    <View style={styles.greenTick}>
                      <Text style={styles.tickText}>✓</Text>
                    </View>

                    <Text style={styles.creditTitle}>
                      Credits Available
                    </Text>
                  </View>

                  <Text style={styles.creditAmount}>
                    ₹ {BillPdfdetails?.invoiceInfo?.avilableAmountToRedeem}
                  </Text>
                </View>

                <Text style={styles.creditDesc}>
                  The booking amount isn't applied with any bills yet.
                </Text>

                <TouchableOpacity style={styles.applyBtn}
                  onPress={handleBookingApplyInvoices}
                >
                  <Text style={{
                    color: "#fff",
                    fontSize: 16,
                    fontFamily: "Gilroy-Bold",
                  }}>
                    Apply Now
                  </Text>
                </TouchableOpacity>
              </View>
            )} */}




          </ScrollView>





          <View style={styles.fixedBottomBar}>

            {(isPaid || cancelled ) && (
              <>
                <TouchableOpacity
                  style={[styles.paidBtn, !isExportAllow && { opacity: 0.4 }]}
                  disabled={!isExportAllow}
                  onPress={handleshareBill}
                >
                  <Image source={ShareIcon} style={styles.iconDark} />
                  <Text style={styles.paidText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.paidBtn, !isExportAllow && { opacity: 0.4 }]}
                  disabled={!isExportAllow}
                  onPress={handleDownloadBillsPdf}>
                  <Image source={DownloadIcon} style={styles.iconDark} />
                  <Text style={styles.paidText}>Download</Text>
                </TouchableOpacity>
              </>
            )}

            {(pendingRefund || partiallyRefund || FullyRefund) && (
              <>
                <View style={styles.bottomRefundActionItem}>
                  <TouchableOpacity
                    style={[styles.refundiIconBtn, !isExportAllow && { opacity: 0.4 }]}
                    disabled={!isExportAllow}
                    onPress={handleshareBill}
                  >
                    <Image source={ShareIcon} style={styles.iconDark} />

                  </TouchableOpacity>
                  <Text style={styles.refundActionTxt}>Share</Text>
                </View>

                <View style={styles.bottomRefundActionItem}>
                  <TouchableOpacity
                    style={[styles.refundiIconBtn, !isExportAllow && { opacity: 0.4 }]}
                    disabled={!isExportAllow}
                    onPress={handleDownloadBillsPdf}>
                    <Image source={DownloadIcon} style={styles.iconDark} />

                  </TouchableOpacity>
                  <Text style={styles.refundActionTxt}>Download</Text>
                </View>
                {showRefundButton && (
                  <View style={styles.bottomRefundActionItem}>
                    <TouchableOpacity
                      style={styles.refundBtn}
                      onPress={handleShowRefundPayment}
                    >
                      <Image
                        source={RefundedIcon}
                        style={styles.refundIcon}
                      />

                    </TouchableOpacity>
                    <Text style={styles.refundText}>
                      Refund
                    </Text>
                  </View>
                )}



              </>

            )}


            {(isPending || isPartial) && (
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
            )}
          </View>


        </Animated.View>
      </View>

      {showMenu && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
          style={styles.popupOverlay}
        >
          <View
            style={[
              styles.popupBox,
              {
                top: popupPosition.y - 10,
                left: popupPosition.x - 180,
              },
            ]}
          >

            {invoice?.totalAmount < 0 &&
              paymentStatus !== "Refunded" &&
              paymentStatus !== "Cancelled" && (
                <TouchableOpacity style={[styles.popupRow, !canWriteInvoice && { opacity: 0.4 }]}
                  onPress={handleShowRefundPayment} disabled={!canWriteInvoice}
                >
                  <Image
                    source={PaymentIcon}
                    style={styles.popupIcon}
                  />
                  <Text style={styles.popupText}>Refund Amount</Text>
                </TouchableOpacity>
              )}





            {isPaid &&
              invoiceDetail?.invoiceMode === "Manual" &&
              paymentStatus === "Paid" &&
              invoiceType === "Rent" && (
                <TouchableOpacity
                  style={[styles.popupRow, !canUpdateInvoice && { opacity: 0.4 }]}
                  disabled={!canUpdateInvoice}
                  // style={styles.popupRow} 
                  onPress={() => setShowUnpaidModal(true)} >
                  <Image
                    source={require("../../../Assets/Images/Union.png")}
                    style={styles.popupIcon}
                  />
                  <Text style={styles.popupText}>UnPaid</Text>
                </TouchableOpacity>
              )}





            {
              invoiceDetail?.canEdit && (
                <TouchableOpacity
                  style={[styles.popupRow, !canUpdateInvoice && { opacity: 0.4 }]}
                  disabled={!canUpdateInvoice}
                  onPress={() => handleEditBill(invoiceDetail)}
                >
                  <Image
                    source={require("../../../Assets/Images/ReAssign.png")}
                    style={styles.popupIcon}
                  />
                  <Text style={styles.popupText}>Edit</Text>
                </TouchableOpacity>
              )}

            {paymentStatus === "Pending" &&
              (invoiceType === "Rent" || invoiceType === "Settlement") &&
              !isDiscounted &&
              (
                <TouchableOpacity
                  style={styles.popupRow}
                  onPress={() => {
                    setShowMenu(false);
                    // setShowBillDetails(false)
                    navigation.navigate("DiscountInvoice", {
                      // bill: selectedBill,
                      onSuccess: () => {
                        onClose();
                      },
                    });
                  }}
                >
                  <Image
                    source={require("../../../Assets/Images/discount-circle.png")}
                    style={styles.popupIcon}
                  />
                  <Text style={styles.popupText}>Make as discount</Text>
                </TouchableOpacity>
              )}


            {/* {showApplyToInvoices && (
              <TouchableOpacity
                style={styles.popupRow}
                onPress={handleApplyInvoice}
              >
                <Image
                  source={BillIcon}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: "#000",
                    marginRight: 10,
                  }}
                />

                <Text style={styles.popupText}>
                  Apply to Invoices
                </Text>
              </TouchableOpacity>
            )} */}


            {/* {showAdjustWithAdvance && (
              <TouchableOpacity
                style={[
                  styles.popupRow,
                  {
                    opacity: 0.4,
                    backgroundColor: "#F3F4F6",
                  },
                ]}
                onPress={handleAdvanceApplyInvoices}
              >
                <Image
                  source={BillIcon}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: "#000",
                    marginRight: 10,
                  }}
                />

                <Text
                  style={[
                    styles.popupText,
                    {
                      color: "#9CA3AF",
                    },
                  ]}
                >
                  Adjust with Advance
                </Text>
              </TouchableOpacity>
            )} */}



            {
              !isPaid && (
                <TouchableOpacity
                  style={[
                    styles.popupRow,
                    isBillLocked && styles.popupRowDisabled,
                  ]}
                  disabled={isBillLocked && !canDeleteInvoice}
                // onPress={() => {
                //   setShowMenu(false);
                //   setDeleteTenants(true);
                // }}
                >
                  <Image
                    source={require("../../../Assets/Images/trash.png")}
                    style={styles.popupIcon}
                  />
                  <Text
                    style={[
                      styles.popupText,
                      isBillLocked && styles.popupTextDisabled,
                    ]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              )
            }



          </View>
        </TouchableOpacity>
      )}

      <RecordPaymentSheet
        visible={showRecordPayment}
        onClose={() => {
          setShowRecordPayment(false)
          onClose();
        }}
        selectedBill={mappedBillForRecord}
      />

      <RefundPaymentSheet
        visible={showRefundPayement}
        onClose={() => setShowRefundPayment(false)}
        selectedBill={mappedBillForRecord}
        onSuccess={() => {
          setShowRefundPayment(false)
          onClose()
        }}
      />

      <DiscountActionSheet
        visible={showDiscountSheet}
        onClose={() => setShowDiscountSheet(false)}
        discountAmount={BillPdfdetails?.invoiceInfo?.discountAmount || 0}
        totalAmount={BillPdfdetails?.invoiceInfo?.totalAmount || 0}
        hostelId={invoiceDetail?.hostelId}
        invoiceId={invoiceDetail?.invoiceId}
        onEdit={() => {
          navigation.navigate("DiscountInvoice", {
            bill: invoiceDetail,
            isEdit: true,
            discountAmount: BillPdfdetails?.invoiceInfo?.discountAmount,
            discountPercentage: BillPdfdetails?.invoiceInfo?.discountPercentage,
            totalAmount: BillPdfdetails?.invoiceInfo?.subTotal,
            DiscountReason: BillPdfdetails?.invoiceInfo?.discountReason
          });
        }}

        onEditSuccess={() => {
          onClose();
          // setShowBillDetails(false);
        }}


        onSuccess={() => {
          // setShowBillDetails(false); 
          onClose();
          setShowSuccessModal(true);
          setModalType("success");
          setModalMessage("Discount removed successfully");

          setTimeout(() => setShowSuccessModal(false), 1500);
        }}
      />

      <Modal
        visible={showUnpaidModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUnpaidModal(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>


            <View style={styles.confirmTitleRow}>
              <View style={{ width: "70%" }}>
                <Text style={styles.confirmTitle}>Mark Invoice {invoiceDetail?.invoiceNumber} as Unpaid?</Text>
              </View>
              <View style={{ width: "30%", flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Image source={QuestionIcon} style={styles.confirmIcon} />
              </View>
            </View>


            <Text style={styles.confirmMessage}>
              Are you sure  to mark this invoice as unpaid?
            </Text>


            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.cancelConfirmBtn}
                onPress={() => setShowUnpaidModal(false)}
              >
                <Text style={styles.cancelConfirmText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.okConfirmBtn}
                onPress={handleBillUnpaid}
              >
                <Text style={styles.okConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>


    </>

  );
};

export default BillDetailsSheet;



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
  amountValue: {
    fontSize: 15,
    fontFamily: "Gilroy-Bold",
    color: "#000",
  },
  discountCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },

  discountLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Gilroy-Medium",
  },

  discountValue: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
  },

  discountMinus: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
    color: "#000",
  },

  discountBadge: {
    backgroundColor: "#16A34A",
    alignSelf: "flex-end",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  discountBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Gilroy-Semibold",
  },
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20000,
    elevation: 50,
  },
  popupBox: {
    position: "absolute",
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 50,
    zIndex: 20001,
    paddingVertical: 10,
  },
  popupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  popupRowDisabled: {
    opacity: 0.4,
  },

  popupIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  popupText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Gilroy-Medium"
  },

  popupTextDisabled: {
    color: "#9CA3AF",
    fontFamily: "Gilroy-Medium"
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
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
  creditCard: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 18,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },

  creditTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  creditTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  greenTick: {
    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: "#08B32A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  tickText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
  },

  creditTitle: {
    fontSize: 18,
    color: "#111827",
    fontFamily: "Gilroy-SemiBold",
  },

  creditAmount: {
    fontSize: 18,
    color: "#111827",
    fontFamily: "Gilroy-Bold",
  },

  creditDesc: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
    fontFamily: "Gilroy-Regular",
  },

  applyBtn: {
    marginTop: 22,
    height: 44,
    borderRadius: 5,
    backgroundColor: "#2446F5",
    justifyContent: "center",
    alignItems: "center",
  },

  applyBtnText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Gilroy-SemiBold",
  },
  cancelInfoCard: {
    marginTop: 22,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 16,
    paddingVertical: 10,
    // paddingHorizontal: 10,
    paddingLeft: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  cancelIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E57A1F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  cancelIconText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Gilroy-Semibold",
    marginTop: Platform.OS === "ios" ? 1 : -1,
  },

  cancelInfoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
    color: "#222222",
    fontFamily: "Gilroy-Medium",
  },

  accordionCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    marginBottom: 14,
    marginTop: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    // marginHorizontal: 16,
  },

  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    justifyContent: "space-between",
  },

  arrowImg: { width: 18, height: 18, tintColor: "#111", marginRight: 10 },

  cardTitle: { flex: 1, fontSize: 14, fontFamily: "Gilroy-Bold", },
  amountText: { fontSize: 14, fontFamily: "Gilroy-Bold" },

  accordionBody: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 14,
    paddingHorizontal: 10
  },


  th: { fontSize: 12, fontFamily: "Gilroy-Bold", color: "#6B7280" },
  invoiceRow: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10 },
  invText: { fontSize: 13, color: "#111" },

  sectionLabel: { fontSize: 13, fontFamily: "Gilroy-Bold", marginBottom: 8 },
  descText: { fontSize: 13, color: "#6B7280" },

  ebRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  ebLeft: { flex: 1, fontSize: 13 },
  ebRight: { fontSize: 13, fontFamily: "Gilroy-Bold" },

  pendingRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  addText: { color: "#1D4ED8", fontFamily: "Gilroy-Bold" },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginHorizontal: 16,
  },


  totalValue: { fontSize: 18, fontWeight: "800" },

  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: "row",
    gap: 12,
  },
  bottomFixed: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  totalLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Gilroy-Medium"
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: "800",
  },
  refundCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#fff",
    // marginHorizontal: 16,
    marginBottom: 14,
  },

  refundHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },

  refundTitle: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
    marginLeft: 6,
  },

  refundAmount: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },

  refundBody: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 14,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
    marginTop: 5
  },

  negativeamountlabel: {
    fontSize: 12,
    fontFamily: "Gilroy-Bold",
    color: "red"
  }
  ,



  arrowSmall: {
    width: 16,
    height: 16,
    tintColor: "#2563EB",
    marginLeft: 6,
  },
  totalInvoiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 10,
    paddingVertical: 10
  },

  totalText: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
  },

  totalAmount: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
  },
  tableHeader: {
    flexDirection: "row",        // ✅ IMPORTANT
    paddingVertical: 10,
    backgroundColor: "#FBFDFF",
    paddingHorizontal: 10
  },

  arrow: { width: 18, height: 18, tintColor: "#444" },

  tableCellLeft: { width: "33%", color: "#1E5BFF", fontSize: 11 },
  tableCellCenter: { width: "33%", textAlign: "center", fontSize: 11 },
  tableCellRight: { width: "33%", textAlign: "right", fontSize: 11 },
  tabledescription: { width: "55%", color: "#1E5BFF", fontSize: 11 },
  ebRowWeb: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  ebText: {
    fontSize: 14,
    fontFamily: "Gilroy-Medium",
    color: "#111827",
  },

  dateChip: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },

  dateChipText: {
    fontSize: 12,
    color: "#EA580C",
    fontFamily: "Gilroy-Semibold"
  },

  ebRightBox: {
    alignItems: "flex-end",
  },

  unitText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },

  cancelInfoCard: {
    marginTop: 22,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 16,
    paddingVertical: 10,
    // paddingHorizontal: 10,
    paddingLeft: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  cancelIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E57A1F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  cancelIconText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Gilroy-Semibold",
    marginTop: Platform.OS === "ios" ? 1 : -1,
  },

  cancelInfoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
    color: "#222222",
    fontFamily: "Gilroy-Medium",
  },
  accordionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginRight: 10,
  },
  accordionTitle: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
    color: "#111827",
  },
  walletRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  walletSource: {
    fontSize: 14,
    color: "#111827",
    fontFamily: "Gilroy-Medium",
  },

  walletAmount: {
    fontSize: 14,
    fontFamily: "Gilroy-SemiBold",
  },

  emptyWallet: {
    paddingVertical: 16,
    alignItems: "center",
  },

  emptyWalletText: {
    backgroundColor: "#FFF5EE",
    color: "#AA6805",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "Gilroy-Medium",
  },
  bottomRefundActionItem: {
    alignItems: "center",
    flex: 1,
    // marginRight: 15
  },
  refundiIconBtn: {
    backgroundColor: "#F3F4F6",
    // padding:14,
    paddingVertical: 14,
    paddingHorizontal: 37,
    borderRadius: 10,
    // marginRight: 20
  },
  refundActionTxt:{
    fontFamily: "Gilroy-Semibold"
  },
  refundBtn: {
    backgroundColor: "#E67E22",
     paddingVertical: 14,
    paddingHorizontal: 37,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 37,
    borderRadius: 10,
  },

  refundIcon: {
    width: 15,
    height: 15,
    tintColor: "#FFFFFF",
  },

  refundText: {
    marginLeft: 7,
    // color: "#FFFFFF",
    // marginTop: 4,
    // fontSize: 12,
    fontFamily: "Gilroy-Semibold",
  },


})
