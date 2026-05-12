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
import LinkIcon from "../../../Assets/Images/link.png";


const BillBookingDetailsSheet = ({
  visible,
  onClose,
  selectedBill,
}) => {


  const { CommonModule } = NativeModules;
  const navigation = useNavigation();

  const { BillDetails, loading, GetAllBillDetails,
    RecordPayment, GetInitializeRefundDetails, CreateRefund, refundError
    , GetRecurringBills, recurringBills, BillPdfdetails, getBillsPdfDetails, getReceiptPdfDetails, downloadReceipt, DeleteReceipt,
    downloadBill, shareBillOnWhatsapp, shareReceiptOnWhatsapp, GetReceiptsList, receiptsList, MarkBillAsUnpaid , GetInitializeAdvanceRedeem  , InitializebookingBills} = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);
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

      const {
      canReadModule: canReadBooking,
    } = useHasPermission("Booking");
  

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
  
  const [showBookingInvoice , setShowBookingInvoice] = useState(false)



  const recordSheetY = useRef(new Animated.Value(0)).current;
  console.log(selectedBill, "bills")




  const bill = selectedBill
  const invoice = selectedBill;
  const customer = selectedBill;
  const stay = BillPdfdetails?.stayInfo

  const bookingData = InitializebookingBills;
  console.log("bookingdata", bookingData);
  
const invoicesList = InitializebookingBills?.listInvoices || [];


 


 



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

  console.log("InitializebookingBills", InitializebookingBills);
  



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

console.log("InitializebookingBills", InitializebookingBills);
console.log("invoicesList", invoicesList);



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

//   const handleShowRecordPayment = () => {
//     setShowMenu(false);
//     setShowRecordPayment(true);
//   };

//   const handleShowRefundPayment = () => {
//     setShowMenu(false);
//     setShowRefundPayment(true);
//   };


  const handleShowBookingtoInvoice = () => {
     navigation.navigate("BookingtoDiscount")
      onClose()
       
  }



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

  const BillsStatusStyle = getStatusStyle(invoice?.paymentStatus)
  console.log("bill", bill);


  const isPaid = invoice?.paymentStatus === "Paid";
  const isPartial =
    invoice?.paymentStatus === "Partially Paid" ||
    invoice?.paymentStatus === "Partial Payment";

  const isPending = invoice?.paymentStatus === "Pending";
  const partiallyRefund = invoice?.paymentStatus === "Partially Refunded";
  const pendingRefund = invoice?.paymentStatus === "Pending Refund";
  const cancelled = invoice?.paymentStatus === "Cancelled";
  const FullyRefund = invoice?.paymentStatus === "Refunded";

  const invoiceType = bill?.configurations?.invoiceType;
  const paymentStatus = invoice?.paymentStatus;
  const isDiscounted = invoice?.isDiscounted;
  const invoiceMode = bill?.invoiceMode; // fallback if exists

  const isValidSubscription = PGDetails?.isSubscriptionActive;
  const isExportAllow = isValidSubscription && canReadInvoice;

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
    invoiceId: bill?.invoiceId,

    dueAmount: invoice?.balanceAmount || invoice?.totalAmount || 0,

    invoiceDate: bill?.invoiceDate,

    fullName: customer?.fullName,

    invoiceType: bill?.configurations?.invoiceType,

    invoiceNumber: bill?.invoiceNumber,

    profilePic: customer?.profilePic,

    initials: customer?.initials,

    customerName: customer?.fullName,
  };

  const handleEditBill = (item) => {

    navigation.navigate("CreateBills", {
      mode: "edit",
      data: item,
    });
  }

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


const canRedeem = selectedBill?.canRedeem;

console.log("canRedeem", canRedeem);



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
              maxHeight: '95%',
              transform: [{ translateY: detailsSheetY }]
            }
          ]}
          {...billDetailsPan.panHandlers}
        >
          <View style={styles.sheetHandle} />



          <ScrollView showsVerticalScrollIndicator={false}>

            <View style={styles.billHeaderRow}>
              <Text style={styles.billHeaderText}>Bill Details</Text>


              <View style={{ display: 'flex', flexDirection: 'row' }}>


                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: "#038C3D" },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: "#fff" },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: "#fff" },
                    ]}
                  >
                    Paid
                  </Text>
                </View>


                {
                  ((!isPaid) ||
                    (isPaid && invoiceDetail?.invoiceMode === "Manual" && bill?.configurations?.invoiceType !== "Settlement")) && (

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

            <View style={styles.userRow}>
  {customer?.profilePic ? (
    <Image source={{ uri: customer.profilePic }} style={styles.userImg} />
  ) : (
    <View style={styles.initialCircle}>
      <Text style={styles.initialText}>
        {customer?.initials || customer?.fullName?.slice(0, 2)?.toUpperCase()}
      </Text>
    </View>
  )}

  <View style={{ flex: 1, marginLeft: 12 }}>
    <Text style={styles.userName}>
      {customer?.fullName || "--"}
    </Text>

    <View style={{ flexDirection: "row", marginTop: 4 , alignItems:'center'}}>

          <View style={styles.invTypeBadge}>
                                    <Text style={styles.invTypeText}>Booking</Text>
                                  </View>
      <Image source={Bills_Black_Icon} style={{ width: 12, height: 12, marginRight: 5 }} />
      <Text style={styles.billNumber}>
        {customer?.invoiceNumber || "--"}
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
                  <Text style={styles.amountValue}>
                    {/* ₹ {BillPdfdetails?.invoiceInfo?.totalAmount ?? "--"} */}
                    ₹ {selectedBill?.invoiceAmount ? Number(selectedBill?.invoiceAmount).toFixed(2) : "0.00"}
                  </Text>
                    <View style={{ marginTop: 3, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

                      <Image source={TickIcon} style={{ height: 13, width: 13, marginRight: 5, marginTop: 2 }} />
                      <Text style={{ fontSize: 13, fontFamily: "Gilroy-Semibold" }}>Full Paid</Text>

                    </View>
                </View>

              </View>
            </View>

          



          
              <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 15, fontFamily: "Gilroy-Semibold" }}>Booking</Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.amountValue,
                     
                    ]}
                  >
                    ₹ {selectedBill?.availableAmount}
                  </Text>
                </View>
              </View>

         



            {invoicesList?.length > 0 && (
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
                    {invoicesList?.map((pay, index) => (
                      <View key={index} style={styles.paymentCard}>

                        <View style={styles.paymentTopRow}>
                          <TouchableOpacity 
                        //   onPress={() => handleOpenReceiptFromBill(pay)} 
                        style={{ display: 'flex', flexDirection: 'row' , alignItems:'center'}}
                          >
                             <Image source={InvoiceLinkIcon} style={{ height: 14, width: 14, marginLeft: 7 , marginRight:5 }} />
                            <Text style={{ color: "#1E45E1", fontFamily: "Gilroy-Semibold" }}>
                              #{pay?.invoiceNumber}
                            </Text>
                           
                          </TouchableOpacity>

                          <Text style={styles.paymentAmount}>
                          ₹ {pay?.invoiceAmount ? Number(pay?.invoiceAmount).toFixed(2) : "0.00"}
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

export default BillBookingDetailsSheet;



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
  flexDirection:'row',
  justifyContent:'center', 
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

})
