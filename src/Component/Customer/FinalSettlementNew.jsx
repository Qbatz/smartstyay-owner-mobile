import React, { useRef, useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  Image,
  SafeAreaView, BackHandler, Modal, Platform, KeyboardAvoidingView,
  Keyboard,
  findNodeHandle,
  Dimensions,
} from "react-native";
import Delete from "../../Assets/Images/remove.png";
import dayjs from "dayjs";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import { useCustomer } from "../../Context/CustomerContext";
import { CommonContexts } from "../../Context/CommonContext";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import AddRoomReadingSheet from "../Customer/AddRoomReadingSheet";
import { useFocusEffect } from '@react-navigation/native';
import RoomIcon from "../../Assets/Images/Room_Icon.png";
import BedIcon from "../../Assets/Images/Bed_Icon.png";
import EditIcon from "../../Assets/Images/edit.png";
import DiscountIcon from "../../Assets/Images/discount-shape.png";
import { Calendar } from "react-native-calendars";
import SuccessModal from "../../ToastFile/ToastPage";
import FinalSettlementDiscount from "./FinalSettlementDiscountSheet"
import SettlementDiscountAction from "./settlementdiscountAction"




export default function FinalSettlementScreen({ navigation, route }) {
  const { selectedItem, selectedBed } = route.params || {};
  const { getSettlementByCustomerId, submitSettlement } = useCustomer();
  const { activeHostelId } = useContext(CommonContexts);

  const [openUnpaid, setOpenUnpaid] = useState(false);
  const [openRefundRent, setOpenRefundRent] = useState(false);
  const [openEBill, setOpenEBill] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [extraCharges, setExtraCharges] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [settlementDetails, setSettlementDetails] = useState("");
  const [showRoomReadingSheet, setShowRoomReadingSheet] = useState(false);
  const [openCheckoutCalendar, setOpenCheckoutCalendar] = useState(false);
  const [showCheckoutPicker, setShowCheckoutPicker] = useState(false);
  const [selectedPendingEb, setSelectedPendingEb] = useState("")
  const [ReturnAmount, setReturnAmount] = useState('')
  const [showDetails, setShowDetails] = useState(false);
  const [showOtherDetails, setShowOtherDetails] = useState(false);
  const [showRefundpay, setShowRefundpay] = useState(false)
  const [actualCheckoutDate, setActualCheckoutDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );
  const [deductionAmount, setDeductionAmount] = useState("")

  console.log("kam", selectedItem)
  const scrollRef = useRef(null);

  const [discountshow, setDiscountshow] = useState(false)
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showLastRentDetails, setShowLastRentDetails] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);

  const [appliedDiscount, setAppliedDiscount] = useState(0);   // final applied

  console.log("actualcheckoutdate", actualCheckoutDate);



  //    useEffect(() => {
  //    if (!selectedItem && !selectedBed) return;

  //    const fetchSettlement = async () => {
  //      const customerId =
  //        selectedItem?.customerId || selectedBed?.currentTenantInfo[0]?.tenetId;

  //      const leavingDate = actualCheckoutDate || dayjs().format("DD-MM-YYYY"); // ✅

  //      const res = await getSettlementByCustomerId(customerId, leavingDate);

  //      if (res.success) {
  //        setSettlementDetails(res.data);
  //      } else {
  //   setModalType("error");
  //   setMessage(res.message || "Failed to load settlement");
  //   setShowSuccess(true);
  //   setTimeout(() => setShowSuccess(false), 800);
  // }
  //    };

  //    fetchSettlement();
  //  }, [selectedItem, selectedBed, actualCheckoutDate]);




  // const fetchSettlement = async (date = actualCheckoutDate) => {
  //   if (!selectedItem && !selectedBed) return;

  //   const customerId =
  //     selectedItem?.customerId ||
  //     selectedBed?.currentTenantInfo?.[0]?.tenetId;

  //   const leavingDate = date || dayjs().format("DD-MM-YYYY");
  //       console.log("beforeaddreading", customerId , leavingDate);

  //   const res = await getSettlementByCustomerId(customerId, leavingDate);

  //   if (res?.success) {
  //     setSettlementDetails(res?.data);
  //     console.log("afteraddreading", res);

  //   }

  // };

  const fetchSettlement = async (date = actualCheckoutDate) => {
    const customerId =
      selectedItem?.customerId ||
      selectedBed?.currentTenantInfo?.[0]?.tenetId;

    const leavingDate = date || dayjs().format("DD-MM-YYYY");

    console.log("customerId", customerId);
    console.log("leavingDate", leavingDate);
    console.log("leavingDate", date);

    // ✅ Stop if values not available
    if (!customerId || !leavingDate) {
      console.log("Missing customerId or leavingDate");
      return;
    }

    console.log("beforeaddreading", customerId, leavingDate);

    const res = await getSettlementByCustomerId(customerId, leavingDate);

    if (res?.success) {
      setSettlementDetails(res?.data);
      console.log("afteraddreading", res);
    }
  };


  // useEffect(() => {
  //   const customerId =
  //     selectedItem?.customerId ||
  //     selectedBed?.currentTenantInfo?.[0]?.tenetId;

  //   if (customerId && actualCheckoutDate) {
  //     fetchSettlement(actualCheckoutDate);
  //   }
  // }, [selectedItem, selectedBed, actualCheckoutDate]);

  useFocusEffect(
    useCallback(() => {
      const customerId =
        selectedItem?.customerId ||
        selectedBed?.currentTenantInfo?.[0]?.tenetId;

      if (customerId && actualCheckoutDate) {
        fetchSettlement(actualCheckoutDate)

      }
    }, [selectedItem, selectedBed, actualCheckoutDate])
  );


  useEffect(() => {
    if (settlementDetails?.currentMonthRentInfo?.discountAmount) {
      setDiscountValue(
        String(settlementDetails.currentMonthRentInfo.discountAmount)
      );
    }
  }, [settlementDetails]);


  // useEffect(() => {
  //   if (selectedItem || selectedBed) {
  //     fetchSettlement();
  //   }
  // }, [selectedItem, selectedBed, actualCheckoutDate]);







  console.log('selectedBed', selectedBed)
  console.log("selectedItem", selectedItem)


  const TYPE_OPTIONS = ["Maintenance", "Others"];

  const onCheckoutDatePick = (event, selected) => {
    if (Platform.OS === "android") setShowCheckoutPicker(false);
    if (selected) {
      const formatted = dayjs(selected).format("DD/MM/YYYY");
      setCheckoutDate(formatted);
    }
  };

  const maintenanceAlreadyUsed = extraCharges.some(
    (c) => c.type === "Maintenance" && c.isDefault === false
  );

  // ✅ ARROW ANIMATION (3 Accordions)
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

  // ✅ API CALL (Same as your code)

  const userEnteredDeductionsTotal = extraCharges
    .filter(item => !item.isDefault)
    .reduce((sum, item) => {
      const amt = Number(item.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);


  // useEffect(() => {
  //   if (!settlementDetails?.settlementInfo) return;


  //   const { isRefundable, amountTobePaid } = settlementDetails.settlementInfo;

  //   let finalAmount = 0;

  //   if (amountTobePaid < 0) {
  //     finalAmount = isRefundable
  //       ? amountTobePaid + userEnteredDeductionsTotal
  //       : amountTobePaid - userEnteredDeductionsTotal;
  //   } else {
  //     finalAmount = isRefundable
  //       ? amountTobePaid - userEnteredDeductionsTotal
  //       : amountTobePaid + userEnteredDeductionsTotal;
  //   }

  //   setReturnAmount(finalAmount);
  // }, [settlementDetails, userEnteredDeductionsTotal]);

  // useEffect(() => {
  //   if (!settlementDetails?.settlementInfo) return;

  //   const { isRefundable, amountTobePaid } = settlementDetails.settlementInfo;

  //   let finalAmount = 0;

  //   if (amountTobePaid < 0) {
  //     finalAmount = isRefundable
  //       ? amountTobePaid + userEnteredDeductionsTotal
  //       : amountTobePaid - userEnteredDeductionsTotal;
  //   } else {
  //     finalAmount = isRefundable
  //       ? amountTobePaid - userEnteredDeductionsTotal
  //       : amountTobePaid + userEnteredDeductionsTotal;
  //   }



  //   const discount = Number(discountValue) || 0;
  //   finalAmount -= discount;

  //   setReturnAmount(finalAmount);
  // }, [settlementDetails, userEnteredDeductionsTotal, discountValue]);

  useEffect(() => {
    if (!settlementDetails?.settlementInfo) return;

    const { isRefundable, amountTobePaid } = settlementDetails.settlementInfo;

    let finalAmount = 0;

    if (amountTobePaid < 0) {
      finalAmount = isRefundable
        ? amountTobePaid + userEnteredDeductionsTotal
        : amountTobePaid - userEnteredDeductionsTotal;
    } else {
      finalAmount = isRefundable
        ? amountTobePaid - userEnteredDeductionsTotal
        : amountTobePaid + userEnteredDeductionsTotal;
    }

    finalAmount -= Number(appliedDiscount || 0);

    setReturnAmount(finalAmount);

  }, [settlementDetails, userEnteredDeductionsTotal, appliedDiscount]);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const discountRef = useRef(null);
  // const FOOTER_HEIGHT = 160; 
  const EXTRA_SPACE = 20;
  const FOOTER_HEIGHT = Platform.select({
  ios: 160,
  android: 140,
});

  // useEffect(() => {
  //   const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
  //     setKeyboardHeight(e.endCoordinates.height);
  //   });

  //   const hideSub = Keyboard.addListener("keyboardDidHide", () => {
  //     setKeyboardHeight(0);
  //   });

  //   return () => {
  //     showSub.remove();
  //     hideSub.remove();
  //   };
  // }, []);
//   const handleDiscountFocus = () => {
//   setTimeout(() => {
//     if (discountRef.current && scrollRef.current) {
//       discountRef.current.measureLayout(
//         findNodeHandle(scrollRef.current),
//         (x, y) => {
//           scrollRef.current.scrollTo({
//             y: y - 140, // 👈 adjust for footer height
//             animated: true,
//           });
//         }
//       );
//     }
//   }, 200);
// };
// const handleDiscountFocus = () => {
//   setTimeout(() => {
//     scrollRef.current?.scrollToEnd({ animated: true });
//   }, 200);
// };
const [isDiscountFocused,setIsDiscountFocused]=useState(false)
const discountScrollY = 900; 
const handleDiscountFocus = () => {
  setTimeout(() => {
    scrollRef.current?.scrollTo({
      y: discountScrollY,
      animated: true,
    });
  }, 200);
};
useEffect(()=>{
 
    if (isDiscountFocused) {
      scrollRef.current?.scrollTo({
        y: 1200, // or dynamic later
        animated: true,
      });
    }
  
},[isDiscountFocused])






  const isNegative = Number(ReturnAmount) < 0;

  // ✅ Map default deductions
  useEffect(() => {
    if (!settlementDetails?.customerInfo?.listDeductions?.length) return;

    const mappedCharges = settlementDetails.customerInfo.listDeductions.map(
      (item) => {
        const isMaintenance = item.type?.toLowerCase() === "maintenance";

        return {
          id: Date.now() + Math.random(),
          type: isMaintenance ? "Maintenance" : "Others",
          title: isMaintenance ? "" : item.type,
          amount: String(item.amount),
          isDefault: true,
        };
      }
    );

    setExtraCharges(mappedCharges);
  }, [settlementDetails]);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {


        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }

        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [navigation])
  );

  // ✅ Add Non Refund charge
  const addCharge = () => {
    setExtraCharges((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "",
        title: "",
        amount: "",
        isDefault: false,
      },
    ]);
  };

  const updateTitle = (id, title) => {
    setExtraCharges((prev) =>
      prev.map((i) => (i.id === id ? { ...i, title, titleError: "" } : i))
    );
  };

  const updateAmount = (id, amount) => {
    const onlyNum = amount.replace(/[^0-9.]/g, "")
    setExtraCharges((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, amount: onlyNum, amountError: "" } : i
      )
    );
  };

  const totalDeduction = extraCharges.reduce((sum, item) => {
    return sum + Number(item.amount || 0);
  }, 0);

  const removeCharge = (id) => {
    setExtraCharges((prev) => prev.filter((i) => i.id !== id));
  }

  const selectType = (id, type) => {
    const maintenanceExists = extraCharges.some(
      (c) => c.type === "Maintenance" && c.isDefault === false
    );

    if (type === "Maintenance" && maintenanceExists) return;

    setExtraCharges((prev) =>
      prev.map((i) => (i.id === id ? { ...i, type, title: "", amount: "" } : i))
    );

    setOpenDropdownId(null);
  };
  const validateExtraCharges = () => {
    let valid = true;

    const updated = extraCharges.map((e) => {
      let titleError = "";
      let amountError = "";

      const titleFilled = e.title?.trim()?.length > 0;
      const amountFilled = e.amount !== "" && e.amount !== null && e.amount !== undefined;

      const amt = Number(e.amount);


      if (!e.type) {
        return { ...e, titleError: "", amountError: "" };
      }


      if (e.type === "Maintenance") {
        if (!amountFilled) {
          amountError = "Please enter maintenance amount";
          valid = false;
        } else if (isNaN(amt) || amt <= 0) {
          amountError = "Amount must be greater than 0";
          valid = false;
        }

        return { ...e, titleError: "", amountError };
      }


      if (e.type === "Others") {

        if (!titleFilled && !amountFilled) {
          return { ...e, titleError: "", amountError: "" };
        }

        if (!titleFilled) {
          titleError = "Please enter reason";
          valid = false;
        }

        if (!amountFilled) {
          amountError = "Please enter amount";
          valid = false;
        } else if (isNaN(amt) || amt <= 0) {
          amountError = "Amount must be greater than 0";
          valid = false;
        }

        return { ...e, titleError, amountError };
      }

      return { ...e, titleError: "", amountError: "" };
    });

    setExtraCharges(updated);
    return valid;
  };

  const extraDeductionsPayload = extraCharges
    .filter(item => !item.isDefault && Number(item.amount) > 0)
    .map(item => ({
      item: item.type === "Others"
        ? item.title?.trim()
        : item.type,        // 👈 Maintenance / DueAmount
      amount: Number(item.amount),
    }));

  // const validateDiscount = () => {
  //   let valid = true;

  //   const discount = Number(discountValue);

  //   if (discountValue === "") {
  //     setMessage("Please enter discount amount");
  //     setModalType("warning");
  //     setShowSuccess(true);

  //     setTimeout(() => {
  //       setShowSuccess(false);
  //     }, 1500);
  //     valid = false;
  //   } else if (isNaN(discount) || discount < 0) {
  //     setMessage("Invalid discount amount");
  //     setModalType("warning");
  //     setShowSuccess(true);
  //     setTimeout(() => {
  //       setShowSuccess(false);
  //     }, 1500);
  //     valid = false;
  //   } else if (discount > Number(settlementDetails?.currentMonthRentInfo?.currentPayableRent || 0)) {
  //     setMessage("Discount cannot be greater than rent amount");
  //     setModalType("warning");
  //     setShowSuccess(true);
  //     setTimeout(() => {
  //       setShowSuccess(false);
  //     }, 1500);
  //     valid = false
  //   }

  //   return valid;
  // }

  const validateDiscount = () => {
    let valid = true;

    const discount = Number(discountValue);
    const baseAmount = Math.abs(
      Number(settlementDetails?.settlementInfo?.amountTobePaid || 0)
    );

    if (discountValue === "") {
      setMessage("Please enter discount amount");
      setModalType("warning");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
      valid = false;
    } else if (isNaN(discount) || discount < 0) {
      setMessage("Invalid discount amount");
      setModalType("warning");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
      valid = false;
    } else if (discount > baseAmount) {
      setMessage("Discount cannot be greater than payable amount");
      setModalType("warning");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
      valid = false;
    }

    return valid;
  };

  console.log("discountvalue", discountValue);


  const handleGenerate = async () => {
    const chargeValid = validateExtraCharges();
    //   const discountValid = validateDiscount();

    // if (!chargeValid || !discountValid) return;

    let discountValid = true;

    // 👉 only validate if value entered
    if (discountValue !== "") {
      discountValid = validateDiscount();
    }

    if (!chargeValid || !discountValid) return;

    // if (!chargeValid) return;
    const customerId =
      selectedItem?.customerId ||
      selectedBed?.currentTenantInfo[0]?.tenetId;


    const payload = {
      discountAmount: Number(discountValue) || 0,
      deductions: extraDeductionsPayload,
    }

    // const payload = {
    //   ...(discountValue !== "" && {
    //     discountAmount: Number(discountValue)
    //   }),
    //   deductions: extraDeductionsPayload,
    // };

    // const payload = extraDeductionsPayload;



    const res = await submitSettlement(customerId, payload);

    if (res.success) {

      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);
      navigation.goBack();
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);

    } else {

      setModalType("warning");
      setMessage(res.message);
      setShowSuccess(true);
    }
  };

  const handleDiscount = () => {
    if (discountApplied) {
      setShowActionSheet(true);   // 👈 open action sheet
    } else {
      setDiscountshow(true);      // 👈 open discount sheet
    }
  };
  console.log("clicked", discountshow);

  const isRefundable = settlementDetails?.settlementInfo?.isRefundable;
  const discountApplied = settlementDetails?.currentMonthRentInfo?.isDiscountApplied;
  const label = settlementDetails?.settlementInfo?.label;
  console.log("settlement", settlementDetails);



  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* ✅ HEADER */}
          <View style={styles.topHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={ArrowLeft} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Final Settlement</Text>
          </View>

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={{ paddingBottom: 200 }}
            keyboardShouldPersistTaps="handled"

          >
            {/* ✅ TOP CUSTOMER CARD */}
            <View style={styles.customerCard}>


              <View style={{ display: 'flex', flexDirection: 'row' }}>


                <View style={{ width: 50, height: 50 }}>
                  {settlementDetails?.customerInfo?.profilePic ? (
                    <Image
                      source={{
                        uri: settlementDetails?.customerInfo?.profilePic,
                      }}
                      style={{ width: 40, height: 40, borderRadius: 45, marginBottom: 12, }}
                    />
                  ) : (
                    <View style={{
                      width: 40, height: 40, borderRadius: 45, backgroundColor: "#E5E7EB",
                      alignItems: "center", justifyContent: "center"
                    }}>
                      <Text style={{
                        fontSize: 17, fontFamily: "Gilroy-Semibold", color: "#374151",
                      }}>
                        {settlementDetails?.customerInfo?.initials}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{ display: "flex", flexDirection: 'column' }}>
                  <Text style={styles.customerName}>{settlementDetails?.customerInfo?.fullName}</Text>

                  <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#4B4B4B' }}>
                    +{settlementDetails?.customerInfo?.countryCode} {settlementDetails?.customerInfo?.mobile}</Text>

                </View>

              </View>
              <View style={styles.smallRow} >
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{selectedItem?.floorName || selectedBed?.floorName || selectedItem?.hostelInfo?.floorName}</Text>
                </View>

                <View style={styles.Roombadge}>
                  <Text style={styles.badgeText}>
                    {selectedItem || selectedBed ? `${selectedItem?.roomName || selectedBed?.roomName || selectedItem?.hostelInfo?.roomName || ""} - ${selectedItem?.bedName || selectedBed?.bedName || selectedItem?.hostelInfo?.bedName || ""}` : ""}
                  </Text>
                </View>



                {/* <Image source={RoomIcon} style={styles.smallIcon} />
                                           <Text style={styles.badgeLabel}>{selectedItem?.roomName || selectedBed.roomName}</Text>
                   
                                           <Image source={BedIcon} style={styles.smallIcon} />
                                           <Text style={styles.badgeLabel}>{selectedItem?.bedName || selectedBed.bedName}</Text> */}
              </View>

              <View style={{ borderWidth: 0.2, marginTop: 12, marginBottom: 8, borderColor: "#E5E7EB" }} />



              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.smallLabel}>Joined Date</Text>
                  <Text style={styles.value}>{settlementDetails?.customerInfo?.joiningDate}</Text>
                </View>
                <View style={[styles.gridCol, { marginLeft: 23 }]}>
                  <Text style={styles.smallLabel}>Req Checkout Date</Text>
                  <Text style={styles.value}>{settlementDetails?.stayInfo?.noticeDate}</Text>
                </View>
              </View>

              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.smallLabel}>Advance Amount</Text>
                  <Text style={styles.value}>₹ {settlementDetails?.customerInfo?.advanceAmount}</Text>
                </View>
                <View style={[styles.gridCol, { marginLeft: 23 }]}>
                  <Text style={styles.smallLabel}>Monthly Rent</Text>
                  <Text style={styles.value}>₹ {settlementDetails?.customerInfo?.rentAmount}</Text>
                </View>
              </View>

              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.smallLabel}>Booking Amount</Text>
                  <Text style={styles.value}>₹ {settlementDetails?.customerInfo?.bookingAmount}</Text>
                </View>
                <View style={[styles.gridCol, { marginLeft: 23 }]}>
                  <Text style={styles.smallLabel}>Advance paid</Text>
                  <Text style={styles.value}>₹ {settlementDetails?.customerInfo?.advancePaidAmount}</Text>
                </View>
              </View>

              <View style={styles.rowBetween}>

                <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>Actual Checkout Date</Text>

                  <View style={styles.checkoutRow}>
                    <Text style={styles.gridValue}>
                      {/* {actualCheckoutDate || "DD-MM-YYYY"} */}

                      {settlementDetails?.stayInfo?.actualCheckoutDate ? settlementDetails?.stayInfo?.actualCheckoutDate : actualCheckoutDate || "DD-MM-YYYY" }
                    </Text>

                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => setOpenCheckoutCalendar(true)}
                      activeOpacity={0.7}
                    >
                      <Image source={EditIcon} style={styles.editIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.gridCol, { marginLeft: 13 }]}>
                  <Text style={styles.gridLabel}>Status</Text>
                  <Text
                    style={[
                      styles.gridValue,
                      { color: ReturnAmount > 0 ? "red" : "#038C3D" },
                    ]}
                  // style={styles.gridValue}
                  //  style={{ color: ReturnAmount > 0 ? "red" : "#038C3D", fontSize: "0.875rem", fontFamily: "Gilroy", fontWeight: 400, textAlign: "center" }}
                  >
                    {ReturnAmount > 0 ? "Pending" : "Refund"}
                  </Text>
                </View>
              </View>



            </View>

            {/* ✅ UNPAID INVOICES (INLINE ACCORDION) */}
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
                <Text style={styles.amountText}>  ₹{
                  settlementDetails?.unpaidInvoiceInfo?.listUnpaidInvoices?.reduce(
                    (sum, inv) => sum + Number(inv.payableAmount || 0),
                    0
                  ) || 0
                }</Text>
              </TouchableOpacity>

              {openUnpaid && (

                <View style={styles.accordionBody}>

                  <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 1 }]}>Invoice No</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Type</Text>
                    <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>
                      Invoice Amount
                    </Text>
                  </View>


                  {/* ✅ DATA EXISTS */}
                  {Array.isArray(settlementDetails?.unpaidInvoiceInfo?.listUnpaidInvoices) &&
                    settlementDetails?.unpaidInvoiceInfo?.listUnpaidInvoices?.length > 0 ? (
                    <>
                      {settlementDetails?.unpaidInvoiceInfo?.listUnpaidInvoices?.map((item, index) => (
                        <View key={index} style={styles.invoiceRow}>
                          <Text style={[styles.invText, { flex: 1, color: "#2563EB" }]}>
                            {item.invoiceNumber}
                          </Text>
                          <Text style={[styles.invText, { flex: 1 }]}>
                            {item.type}
                          </Text>
                          <Text style={[styles.invText, { flex: 1, textAlign: "right" }]}>
                            ₹ {item.payableAmount}
                          </Text>
                        </View>
                      ))}
                    </>
                  ) : (
                    /* ❌ NO DATA (EMPTY STATE) */
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyText}>No pending invoices</Text>
                    </View>
                  )}

                  {/* TOTAL ROW (always show) */}
                  <View style={styles.totalInvoiceRow}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalAmount}>
                      ₹{" "}
                      {Array.isArray(settlementDetails?.unpaidInvoices)
                        ? settlementDetails.unpaidInvoices.reduce(
                          (sum, i) => sum + Number(i.payableAmount || 0),
                          0
                        )
                        : 0}
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
                  <Text style={styles.refundTitle}>Refundable Rent</Text>
                </View>

                <Text style={styles.refundAmount}>
                  ₹{" "}
                  {Number(
                    settlementDetails?.currentMonthRentInfo?.currentMonthPayableAmount || 0
                  ).toLocaleString("en-IN")}
                </Text>
              </TouchableOpacity>

              {openRefundRent && (
                <View style={styles.refundBody}>

                  {/* <View style={styles.rowBetween}>
                    <Text style={styles.descText}>
                      Last Rent Paid ({settlementDetails?.currentMonthRentInfo?.paidDays} days)
                    </Text>

                    <Text style={styles.amountText}>
                      ₹{" "}
                      {Number(
                        settlementDetails?.currentMonthRentInfo?.currentRentPaid || 0
                      ).toLocaleString("en-IN")}
                    </Text>
                  </View> */}
                  <TouchableOpacity
                    style={styles.rowBetween}
                    onPress={() => setShowLastRentDetails(!showLastRentDetails)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={styles.descText}>
                        Last Rent Paid ({settlementDetails?.currentMonthRentInfo?.paidDays} days)
                      </Text>

                      <Image
                        source={DownArrow}
                        style={[
                          styles.arrowSmall,
                          showLastRentDetails && { transform: [{ rotate: "180deg" }] },
                        ]}
                      />
                    </View>

                    <Text style={styles.amountText}>
                      ₹ {Number(
                        settlementDetails?.currentMonthRentInfo?.currentRentPaid || 0
                      ).toLocaleString("en-IN")}
                    </Text>
                  </TouchableOpacity>

                  {showLastRentDetails && (
                    <View style={styles.detailCard}>
                      <Text style={styles.sectionLabel}>Actual Rent</Text>
                      <Text style={styles.amountText}>
                        ₹ {settlementDetails?.currentMonthRentInfo?.currentMonthRent || 0}
                      </Text>
                    </View>
                  )}

                  {showLastRentDetails && settlementDetails?.currentMonthRentInfo?.discountAmount > 0 && (
                    <View style={styles.detailCard}>
                      <Text style={styles.sectionLabel}>Discount</Text>
                      <Text style={styles.rightMuted}>
                        ₹ {settlementDetails?.currentMonthRentInfo?.discountAmount}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.rowBetween}
                    onPress={() => setShowDetails(!showDetails)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={styles.descText}>
                        Actual Stay Days (Rent) ({settlementDetails?.currentMonthRentInfo?.stayDays} days)
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
                        settlementDetails?.currentMonthRentInfo?.currentPayableRent || 0
                      ).toLocaleString("en-IN")}
                    </Text>
                  </TouchableOpacity>

                  {/* DETAILS */}
                  {showDetails &&
                    settlementDetails?.currentMonthRentInfo?.rentLists?.map(
                      (item, index) => (
                        // <View key={index} style={styles.detailCard}>
                        //   <Text style={styles.linkText}>
                        //     {item.floorName} | {item.roomName} - {item.bedName}
                        //   </Text>

                        //   <Text style={styles.rightMuted}>
                        //    ({item.noOfDays} {item.noOfDays === 1 ? "day" : "days"} × {item.rentPerDay} = {item.totalRent})
                        //   </Text>
                        // </View>

                        <View key={index} style={styles.detailCard}>
                          <Text style={styles.linkText}>
                            {item.floorName} | {item.roomName} - {item.bedName}
                          </Text>

                          <Text
                            style={styles.rightMuted}
                            numberOfLines={0}
                          >
                            ({item.noOfDays} {item.noOfDays === 1 ? "day" : "days"} × {item.rentPerDay} = {item.totalRent})
                          </Text>
                        </View>

                      )
                    )}
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
                      {Number(
                        settlementDetails?.currentMonthRentInfo?.otherItemAmount || 0
                      ).toLocaleString("en-IN")}


                    </Text>
                  </TouchableOpacity>

                  {/* DETAILS */}
                  {showOtherDetails &&
                    settlementDetails?.currentMonthRentInfo?.currentMonthOtherItems?.map(
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
                <Text style={styles.amountText}>₹ {settlementDetails?.ebInfo?.pendingEbAmount}</Text>
              </TouchableOpacity>

              {openEBill && (
                <View style={styles.accordionBody}>
                  {/* <Text style={styles.sectionLabel}>Missed Electricity</Text>

              <View style={styles.ebRow}>
                <Text style={styles.ebLeft}>Ground Floor | G005 - B03</Text>
                <Text style={styles.ebRight}>₹ 170</Text>
              </View>

              <View style={styles.ebRow}>
                <Text style={styles.ebLeft}>First Floor | F002 - B01</Text>
                <Text style={styles.ebRight}>₹ 130</Text>
              </View> */}
                  {/* ✅ MISSED ELECTRICITY */}
                  {settlementDetails?.ebInfo?.missedEb?.length > 0 && (
                    <Text style={styles.sectionLabel}>Missed Electricity</Text>
                  )}


                  {settlementDetails?.ebInfo?.missedEb?.map((item, index) => (
                    <View key={index} style={styles.ebRowWeb}>

                      {/* Left Info */}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.ebText}>
                          {item.floorName} | {item.roomName} - {item.bedName}
                        </Text>

                        <View style={styles.dateChip}>
                          <Text style={styles.dateChipText}>
                            {item.fromDate} - {item.toDate}
                          </Text>
                        </View>
                      </View>

                      {/* Add Button */}
                      <TouchableOpacity
                        onPress={() => {
                          setShowRoomReadingSheet(true);
                          setSelectedPendingEb(item); // 👈 optional if needed
                        }}
                      >
                        <Text style={styles.addText}>+ Add</Text>
                      </TouchableOpacity>
                    </View>
                  ))}


                  <Text style={styles.sectionLabel}>Pending Invoices</Text>

                  {settlementDetails?.ebInfo?.pendingEb?.map((item, index) => (
                    <View key={index} style={styles.ebRowWeb}>

                      {/* Left Info */}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.ebText}>
                          {item.floorName} | {item.roomName} - {item.bedName}
                        </Text>

                        <View style={[styles.dateChip, { backgroundColor: "#E0F2FE" }]}>
                          <Text style={[styles.dateChipText, { color: "#1D4ED8" }]}>
                            {item.fromDate} - {item.toDate}
                          </Text>
                        </View>
                      </View>

                      {/* Units & Amount */}
                      <View style={styles.ebRightBox}>
                        <Text style={styles.unitText}>
                          ({item.units} Units)
                        </Text>
                        <Text style={styles.amountText}>₹ {item.amount}</Text>
                      </View>

                    </View>
                  ))}



                </View>
              )}
            </View>


            <View style={styles.accordionCard}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => setShowRefundpay(!showRefundpay)}
                activeOpacity={0.8}
              >
                <Animated.Image
                  source={DownArrow}
                  style={[styles.arrowImg, { transform: [{ rotate: ebArrow }] }]}
                />
                <Text style={styles.cardTitle}>Refund Payable to Tenant</Text>

              </TouchableOpacity>

              {showRefundpay && (
                <View style={styles.accordionBody}>

                  {/* Final Settlement Title */}
                  <Text style={styles.sectionTitle}>Final Settlement</Text>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>
                      {label ? label : "Refundable Rent"}
                    </Text>

                    <Text style={styles.value}>
                      {/* {!isRefundable ? "- " : ""}  */}
                      ₹ {
                        label
                          ? settlementDetails?.settlementInfo?.payableAmount
                          : settlementDetails?.settlementInfo?.refundableRent
                      }
                    </Text>
                  </View>


                  {/* <View style={styles.rowBetween}>
      <Text style={styles.label}>Refundable Rent</Text>
      <Text style={styles.value}>
      {!isRefundable ? "- " : ""}  ₹ {settlementDetails?.settlementInfo?.refundableRent}
      </Text>
    </View> */}

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Refundable Advance</Text>
                    <Text style={styles.value}>
                      {/* {!isRefundable ? "- " : ""}  */}
                      ₹ {settlementDetails?.settlementInfo?.refundableAdvance}
                    </Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Total Deductions</Text>
                    <Text style={styles.negativeamountlabel}>
                      {!isRefundable ? "- " : ""}   ₹ {settlementDetails?.settlementInfo?.totalDeductions || totalDeduction}
                    </Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Electricity</Text>
                    <Text style={styles.negativeamountlabel}>
                      ₹ {settlementDetails?.settlementInfo?.electricityAmount}
                    </Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Unpaid Invoices</Text>
                    <Text style={styles.negativeamountlabel}>
                      ₹ {settlementDetails?.settlementInfo?.unpaidInvoiceAmount}
                    </Text>
                  </View>


                  {/* <View style={styles.rowBetween}>
                    <Text style={styles.label}>Refundable Rent</Text>
                    <Text style={styles.value}>
                      ₹{" "}
                      {settlementDetails?.settlementInfo?.refundableRent}
                    </Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Refundable Advance</Text>
                    <Text style={styles.value}>
                      ₹ {Number(
                        settlementDetails?.settlementInfo?.refundableAdvance || 0
                      ).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Total Deductions</Text>
                    <Text style={styles.negativeamountlabel}>
                     ₹ - {Number(
                        settlementDetails?.settlementInfo?.totalDeductions || 0
                      ).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Electricity</Text>
                    <Text style={styles.negativeamountlabel}>
                      ₹{" " + settlementDetails?.settlementInfo?.electricityAmount}
                    </Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.label}>Unpaid Invoices</Text>
                    <Text style={styles.negativeamountlabel}>
                      ₹ {Number(
                        settlementDetails?.settlementInfo?.unpaidInvoiceAmount || 0
                      ).toFixed(2)}
                    </Text>
                  </View> */}

                </View>
              )}

            </View>

            <View style={styles.nonRefund}>
              <View style={styles.extraHeader}>
                <Text style={styles.label}>Deductions</Text>

                <TouchableOpacity style={styles.addBtn} onPress={addCharge}>
                  <Text style={{ color: "#fff", fontFamily: "Gilroy-Semibold" }}>Add</Text>
                </TouchableOpacity>
              </View>


              {extraCharges.length === 0 ? (
                <View style={{
                  paddingVertical: 20,
                  alignItems: "center",
                  justifyContent: "center", backgroundColor: "#fff", margin: 10, borderRadius: 10
                }}>
                  <Text style={styles.emptyText}>No deductions available</Text>
                </View>
              ) : (

                extraCharges.map((item) => (
                  <View key={item.id} style={styles.figmaRowWrapper}>
                    {!item.isDefault && (
                      <TouchableOpacity
                        onPress={() => removeCharge(item.id)}
                        style={styles.figmaCloseBtn}
                      >
                        <Image source={Delete} style={styles.figmaCloseText} />
                      </TouchableOpacity>
                    )}

                    <View style={styles.figmaRow}>
                      {item.type === "" ? (
                        <TouchableOpacity
                          disabled={item.isDefault}
                          style={[
                            styles.figmaLeftBox,
                            item.isDefault && { opacity: 0.6 },
                          ]}
                          onPress={() =>
                            setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                          }
                        >
                          <Text style={{ color: "#777" }}>Select...</Text>
                          <Image source={DownArrow} style={styles.smallArrow} />
                        </TouchableOpacity>
                      ) : item.type === "Others" ? (
                        <TextInput
                          style={styles.figmaLeftBox}
                          placeholder="Enter reason"
                          value={item.title}
                          onChangeText={(t) => updateTitle(item.id, t)}
                          onPress={() => {
                            setTimeout(() => {
                              scrollRef.current?.scrollTo({
                                y: 900,   // 👈 adjust if needed
                                animated: true,
                              });
                            }, 200);
                          }}
                        />
                      ) : (
                        <View
                          style={[
                            styles.figmaLeftBox,
                            { backgroundColor: "#EFEFEF" },
                          ]}
                        >
                          <Text>Maintenance</Text>
                        </View>
                      )}

                      {item.type === "" ? (
                        <View style={[styles.figmaRightBox, { opacity: 0.4 }]}>
                          <Text style={{ color: "#999" }}>Enter amount</Text>
                        </View>
                      ) : (
                        <TextInput
                          editable={!item.isDefault}
                          style={styles.figmaRightBox}
                          value={item.amount}
                          placeholder="Enter Amount"
                          keyboardType="numeric"
                          onChangeText={(t) => {

                            let cleaned = t.replace(/[^0-9.]/g, "");

                            const parts = cleaned.split(".");

                            if (parts.length > 2) {
                              cleaned = parts[0] + "." + parts[1];
                            }

                            if (parts[1]?.length > 2) {
                              cleaned = parts[0] + "." + parts[1].slice(0, 2);
                            }
                            updateAmount(item?.id, cleaned)

                          }

                          }
                          onPress={() => {
                            setTimeout(() => {
                              scrollRef.current?.scrollTo({
                                y: 900,
                                animated: true,
                              });
                            }, 200);
                          }}
                        />

                      )}
                    </View>

                    {item.titleError && (
                      <ErrorMessage message={item.titleError} type="error" />
                    )}

                    {item.amountError && (
                      <ErrorMessage message={item.amountError} type="error" />
                    )}

                    {openDropdownId === item.id && item.type === "" && (
                      <View style={styles.nonRefundDropdown}>
                        {TYPE_OPTIONS.map((t) => {
                          const disabled = t === "Maintenance" && maintenanceAlreadyUsed;

                          return (
                            <TouchableOpacity
                              key={t}
                              disabled={disabled}
                              onPress={() => !disabled && selectType(item.id, t)}
                              style={{ opacity: disabled ? 0.3 : 1 }}
                            >
                              <Text style={styles.dropdownItem}>{t}</Text>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>



            <View style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 14,
              marginHorizontal: 16,
              marginTop: 10,
              borderWidth: 1,
              borderColor: "#E5E7EB"
            }}>

              <Text style={{ fontFamily: "Gilroy-Semibold", marginBottom: 10 }}>
                Discount (Current Month)
              </Text>

              {!isEditingDiscount ? (
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 12,
                  padding: 12
                }}>
                  <Text style={{ fontSize: 16, fontFamily: "Gilroy-Bold" }}>
                    ₹ {discountValue || 0}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setIsEditingDiscount(true)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#E0ECFF",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 10,
                    }}
                  >
                    <Image
                      source={EditIcon}
                      style={{
                        width: 16,
                        height: 16,
                        tintColor: "#2563EB",
                        marginRight: 6,
                      }}
                    />

                    <Text
                      style={{
                        color: "#2563EB",
                        fontFamily: "Gilroy-Semibold",
                        fontSize: 13,
                      }}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 5,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 12,

                }}>
                  <TextInput
                 ref={discountRef}
                    value={discountValue}
                    onChangeText={(t) => {
                      let cleaned = t.replace(/[^0-9.]/g, "");

                      const parts = cleaned.split(".");

                      if (parts.length > 2) {
                        cleaned = parts[0] + "." + parts[1];
                      }

                      if (parts[1]?.length > 2) {
                        cleaned = parts[0] + "." + parts[1].slice(0, 2);
                      }
                      setDiscountValue(cleaned)
                    }
                    }



                    keyboardType="numeric"
                    placeholder="Enter discount"
                    style={{ flex: 1, fontSize: 16 }}
                  onPress={handleDiscountFocus}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      if (!validateDiscount()) return;
                      setAppliedDiscount(Number(discountValue) || 0);
                      setIsEditingDiscount(false);
                    }}
                    style={{
                      backgroundColor: "#DEF7EC",
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8
                    }}
                  >
                    <Text style={{ color: "#03543F", fontFamily: "Gilroy-Bold" }}>
                      Set
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

            </View>



          </ScrollView>


          <View style={[styles.bottomFixed]}>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>{isRefundable ? "Total Refund Payable" : "Outstanding Amount Payable"}</Text>
              <Text
                style={[
                  styles.totalAmount,
                  { color: isNegative ? "#D70000" : "#16A34A" },
                ]}
              >
                {isNegative ? "-" : ""}₹{" "}
                {Math.abs(Number(ReturnAmount)).toLocaleString("en-IN")}
                {/* {Math.round(Math.abs(Number(ReturnAmount))).toLocaleString("en-IN")} */}
              </Text>
            </View>

            {/* {Number(ReturnAmount) > 0 && (
  discountApplied ? (
    <View style={styles.discountAppliedCard}>
      
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.tickCircle}>
          <Text style={styles.tick}>✓</Text>
        </View>

        <Text style={styles.discountText}>
          ₹ {settlementDetails?.currentMonthRentInfo?.discountAmount} discount applied on this invoice
        </Text>
      </View>

      <TouchableOpacity onPress={handleDiscount}>
        <Text style={styles.Discountarrow}>›</Text>
      </TouchableOpacity>

    </View>
  ) : (
    <View style={{ marginBottom: 12 }}>
      <TouchableOpacity
        onPress={handleDiscount}
        activeOpacity={0.8}
        style={{ flexDirection: 'row' }}
      >
        <Text style={styles.makeDiscountText}>
          Make Discount
        </Text>

        <Image
          source={DiscountIcon}
          style={{ height: 18, width: 18, marginLeft: 7 }}
        />
      </TouchableOpacity>
    </View>
  )
)} */}







            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelTxt}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
                <Text style={styles.generateTxt}>Generate Bill</Text>
              </TouchableOpacity>
            </View>
          </View>

          <AddRoomReadingSheet
            visible={showRoomReadingSheet}
            onClose={() =>{
              fetchSettlement();
              setShowRoomReadingSheet(false)
            } }
            roomInfo={{
              roomId: "F002_ID",
              floorId: "FIRST_FLOOR_ID",
              roomName: "F002",
              floorName: "First Floor",
            }}
            onSubmit={(payload) => {
              console.log("Submit Payload =>", payload);


              setShowRoomReadingSheet(false);
            }}
            selectedPendingEb={selectedPendingEb}
            settlementDetails={settlementDetails}
            selectedItem={selectedItem}
            selectedBed={selectedBed}
            fetchSettlement={fetchSettlement}
          />
          {showCheckoutPicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={onCheckoutDatePick}
            />
          )}

        </SafeAreaView>
      </KeyboardAvoidingView>
      <Modal
        transparent
        visible={openCheckoutCalendar}
        animationType="fade"
        onRequestClose={() => setOpenCheckoutCalendar(false)}
      >
        <View style={styles.calendarOverlay}>
          <TouchableOpacity
            style={styles.outsideTouch}
            activeOpacity={1}
            onPress={() => setOpenCheckoutCalendar(false)}
          />

          <View style={styles.calendarBox}>
            <Text style={styles.calendarTitle}>Select Checkout Date</Text>

            <Calendar
              maxDate={dayjs().format("YYYY-MM-DD")} // ✅ future disabled
              markedDates={
                actualCheckoutDate
                  ? {
                    [dayjs(actualCheckoutDate, "DD-MM-YYYY").format("YYYY-MM-DD")]:
                    {
                      selected: true,
                      selectedColor: "#2B6CF6",
                    },
                  }
                  : {}
              }

              onDayPress={(day) => {
                const formatted = dayjs(day.dateString).format("DD-MM-YYYY");

                setActualCheckoutDate(formatted);
                setOpenCheckoutCalendar(false);

                const customerId =
                  selectedItem?.customerId ||
                  selectedBed?.currentTenantInfo?.[0]?.tenetId;

                // 👇 same date select pannalum call varum
                getSettlementByCustomerId(customerId, formatted)
                  .then((res) => {
                    if (res?.success) {
                      setSettlementDetails(res.data);
                    } else {
                      setModalType("error");
                      setMessage(res?.message || "Failed to load settlement");
                      setShowSuccess(true);
                      setTimeout(() => setShowSuccess(false), 800);
                    }
                  });
              }}

            />
          </View>
        </View>
      </Modal>

      <FinalSettlementDiscount
        visible={discountshow}
        onClose={() => setDiscountshow(false)}
        selectedBill={{
          invoiceId: settlementDetails?.currentMonthRentInfo?.currentInvoiceId,
          totalAmount: settlementDetails?.currentMonthRentInfo?.currentPayableRent || 0,
          discountAmount: settlementDetails?.currentMonthRentInfo?.discountAmount || 0,
        }}
        onSuccess={() => {
          setDiscountshow(false);
          fetchSettlement(); // refresh
        }}
      />
      <SettlementDiscountAction
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}

        discountAmount={
          settlementDetails?.currentMonthRentInfo?.discountAmount
        }

        hostelId={activeHostelId}
        invoiceId={
          settlementDetails?.currentMonthRentInfo?.currentInvoiceId
        }

        onEdit={() => {
          setShowActionSheet(false);
          setDiscountshow(true); // 👈 open edit sheet
        }}

        onSuccess={() => {
          fetchSettlement(); // 👈 refresh after delete
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },

  backIcon: { width: 18, height: 18, marginRight: 10 },
  headerTitle: { fontSize: 18, fontFamily: "Gilroy-Bold" },

  customerCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 16,
  },

  customerName: { fontSize: 16, fontFamily: "Gilroy-Bold", marginBottom: 4 },

  smallLabel: { fontSize: 12, color: "#6B7280", fontFamily: "Gilroy-Regular" },
  value: { fontSize: 14, fontFamily: "Gilroy-Semibold", marginTop: 4 },
  refundText: { fontSize: 14, fontFamily: "Gilroy-Bold", color: "green", marginTop: 4 },

  accordionCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginHorizontal: 16,
  },

  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    justifyContent: "space-between",
  },

  arrowImg: { width: 18, height: 18, tintColor: "#111", marginRight: 10 },

  cardTitle: { flex: 1, fontSize: 14, fontFamily: "Gilroy-Bold" },
  amountText: { fontSize: 14, fontFamily: "Gilroy-Bold" },

  accordionBody: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 14,
  },


  th: { fontSize: 12, fontFamily: "Gilroy-Bold", color: "#6B7280" },
  invoiceRow: { flexDirection: "row", paddingVertical: 10 },
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

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 55
  },

  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  cancelTxt: { fontSize: 15, fontFamily: "Gilroy-Semibold" },

  generateBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#1D4ED8",
  },

  generateTxt: { fontSize: 15, fontFamily: "Gilroy-Bold", color: "#fff" },

  // ✅ NON REFUND
  nonRefund: {
    backgroundColor: "#F7F9FF",
    padding: 10,
    marginTop: 10,
    borderRadius: 20,
    marginHorizontal: 16,
  },

  extraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginTop: 5,
  },

  label: { fontFamily: "Gilroy-Semibold" },

  addBtn: {
    backgroundColor: "#2D6CDF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },

  figmaRowWrapper: {
    marginTop: 20,
    position: "relative",
  },

  figmaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  figmaLeftBox: {
    width: "48%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  figmaRightBox: {
    width: "45%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    justifyContent: "center",
    marginRight: 20,
  },

  figmaCloseBtn: {
    position: "absolute",
    right: 5,
    top: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E1E1E1",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  figmaCloseText: {
    width: 10,
    height: 10,
  },

  smallArrow: { width: 18, height: 18, tintColor: "#444" },

  dropdownItem: {
    padding: 12,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  nonRefundDropdown: {
    position: "absolute",
    top: 55,
    left: 0,
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 12,
    zIndex: 20,
    elevation: 10,
  },
  smallRow: { flexDirection: "row", alignItems: "center", },
  badge: { backgroundColor: "#FFEFCF", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 8 },
  Roombadge: { backgroundColor: "#FFE0D9", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 8 },
  badgeText: { color: "black", fontSize: 12, fontFamily: "Gilroy-Regular" },
  smallIcon: { width: 16, height: 16, marginHorizontal: 4 },
  badgeLabel: { fontSize: 13 },
  gridCol: {
    width: "48%",
    flexDirection: "column",
  },

  gridLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontFamily: "Gilroy-Regular"
  },

  gridValue: {
    fontFamily: "Gilroy-Bold",
    fontSize: 14,
    marginTop: 3,
  },
  checkoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editBtn: {
    padding: 6,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: "#F3F4F6",
  },

  editIcon: {
    width: 18,
    height: 18,
    tintColor: "#111827",
  },
  calendarOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  calendarBox: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    elevation: 12,
  },

  calendarTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    marginBottom: 10,
    color: "#111",
  },

  outsideTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
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

  addBtnCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    lineHeight: 28,
  },

  ebRightBox: {
    alignItems: "flex-end",
  },

  unitText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    fontFamily: "Gilroy-Medium"
  },

  totalInvoiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  totalText: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
  },

  totalAmount: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
  },
  linkText: {
    color: "#2563EB",
    fontSize: 13,
    flex: 1,
  },

  rightMuted: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
    textAlign: "right",
  },

  tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 12, justifyContent: "space-between" },
  tableHeader: {
    flexDirection: "row",        // ✅ IMPORTANT
    paddingVertical: 10,
    backgroundColor: "#FBFDFF",
  },

  arrow: { width: 18, height: 18, tintColor: "#444" },

  tableCellLeft: { width: "33%", color: "#1E5BFF", fontSize: 11 },
  tableCellCenter: { width: "33%", textAlign: "center", fontSize: 11 },
  tableCellRight: { width: "33%", textAlign: "right", fontSize: 11 },
  tabledescription: { width: "55%", color: "#1E5BFF", fontSize: 11 },
  tableStrip: { backgroundColor: "#FCFCFD" },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingLeft: 16,
  },
  refundCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#fff",
    marginHorizontal: 16,
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

  // detailCard: {
  //   backgroundColor: "#F8FAFC",
  //   borderRadius: 10,
  //   padding: 12,
  //   marginTop: 6,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  // },

  detailCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Gilroy-Bold",
    marginBottom: 5
  },
  discountAppliedCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tickCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  tick: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  discountText: {
    fontSize: 13,
    color: "#111",
    fontFamily: "Gilroy-Medium",
  },

  Discountarrow: {
    fontSize: 22,
    color: "#1D4ED8",
    fontWeight: "bold",
  },

  makeDiscountText: {
    fontSize: 14,
    color: "#338BFF",
    fontFamily: "Gilroy-Medium",
  },


  // rightMuted: {
  //   fontSize: 12,
  //   color: "#6B7280",
  // },


});
