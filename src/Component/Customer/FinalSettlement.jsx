import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform, LayoutAnimation, BackHandler
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import CalendarIcon from "../../Assets/Images/calendar.png";
import Profile from "../../Assets/Images/User.png";
import RoomIcon from "../../Assets/Images/Room_Icon.png";
import BedIcon from "../../Assets/Images/Bed_Icon.png";
import AddCircle from "../../Assets/Images/add-circle.png";
// import RemoveIcon from "../../Assets/Images/remove.png";
import Delete from "../../Assets/Images/remove.png";
import DirectionDownIcon from "../../Assets/Images/direction_down.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import { useFocusEffect } from '@react-navigation/native';
import { useCustomer } from "../../Context/CustomerContext";
import { CommonContexts } from "../../Context/CommonContext";
import SuccessModal from "../../ToastFile/ToastPage";
import { Calendar } from "react-native-calendars";
import EditIcon from "../../Assets/Images/edit.png";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";


export default function FinalSettlement({ navigation, route }) {
  const { selectedItem, selectedBed } = route.params || {};
  const { activeHostelId } = useContext(CommonContexts);
  const { getCustomersByHostel, loading, getSettlementByCustomerId, submitSettlement } = useCustomer();

  const [extraCharges, setExtraCharges] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [open, setOpen] = useState(false);
  // const maintenanceAlreadyUsed = extraCharges.some(c => c.type === "Maintenance");
  const maintenanceAlreadyUsed = extraCharges.some(
  (c) => c.type === "Maintenance" && c.isDefault === false
);
  const [settlementDetails, setSettlementDetails] = useState("")
  const [ReturnAmount, setReturnAmount] = useState('')
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);
const [openCheckoutCalendar, setOpenCheckoutCalendar] = useState(false);
console.log("settlementDetails",settlementDetails)
const [actualCheckoutDate, setActualCheckoutDate] = useState(
  dayjs().format("DD-MM-YYYY")
);
console.log("selectedBed",selectedBed)
  const TYPE_OPTIONS = ["Maintenance", "Others"];
  useEffect(() => {
  if (!selectedItem && !selectedBed) return;

  const fetchSettlement = async () => {
    const customerId =
      selectedItem?.customerId || selectedBed?.currentTenantInfo[0]?.tenetId;

    const leavingDate = actualCheckoutDate || dayjs().format("DD-MM-YYYY"); // ✅

    const res = await getSettlementByCustomerId(customerId, leavingDate);

    if (res.success) {
      setSettlementDetails(res.data);
    } else {
      alert(res.message || "Failed to load settlement");
    }
  };

  fetchSettlement();
}, [selectedItem, selectedBed, actualCheckoutDate]);

  // useEffect(() => {
  //   if (!selectedItem && !selectedBed) return;

  //   const fetchSettlement = async () => {


  //     const res = await getSettlementByCustomerId(selectedItem?.customerId || selectedBed?.currentTenantInfo[0]?.tenetId);

  //     if (res.success) {
  //       setSettlementDetails(res.data);
  //     } else {
  //       alert(res.message || "Failed to load settlement");
  //     }


  //   };

  //   fetchSettlement();
  // }, [selectedItem, selectedBed]);



  const addCharge = () => {
    setExtraCharges(prev => [
      ...prev,
      {
        id: Date.now(),
        type: "",
        title: "",
        amount: "",
        isDefault: false, // 🔥
      }
    ]);
  };


  const removeCharge = (id) => {
    setExtraCharges(prev => prev.filter(i => i.id !== id));

    // if (type === "Maintenance") {
    //   setDisabledTypes([]);
    // }
  };
const selectType = (id, type) => {
  const maintenanceExists = extraCharges.some(
    (c) => c.type === "Maintenance" && c.isDefault === false
  );

  if (type === "Maintenance" && maintenanceExists) {
    return; // ✅ user already added maintenance once
  }

  setExtraCharges((prev) =>
    prev.map((i) =>
      i.id === id ? { ...i, type, title: "", amount: "" } : i
    )
  );

  setOpenDropdownId(null);
};

  // const selectType = (id, type) => {


  //   if (type === "Maintenance" && maintenanceAlreadyUsed) return;

  //   setExtraCharges(prev =>
  //     prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "" } : i))
  //   );

  //   setOpenDropdownId(null);
  // };
  useEffect(() => {
    if (!settlementDetails?.customerInfo?.listDeductions?.length) return;

    const mappedCharges = settlementDetails.customerInfo.listDeductions.map(item => {
      const isMaintenance = item.type?.toLowerCase() === "maintenance";

      return {
        id: Date.now() + Math.random(),
        type: isMaintenance ? "Maintenance" : "Others",
        title: isMaintenance ? "" : item.type,
        amount: String(item.amount),
        isDefault: true,   // 🔥 IMPORTANT
      };
    });

    setExtraCharges(mappedCharges);
  }, [settlementDetails]);






  // const updateTitle = (id, title) => {
  //   setExtraCharges(prev =>
  //     prev.map(i => (i.id === id ? { ...i, title } : i))
  //   );
  // };
   const updateTitle = (id, title) => {
        // setExtraCharges(prev =>
        //     prev.map(i => (i.id === id ? { ...i, title } : i))
        // );
           setExtraCharges(prev =>
    prev.map(i =>
      i.id === id
        ? { ...i, title, titleError: "" }
        : i
    )
  );
    };

  // const updateAmount = (id, amount) => {
  //   setExtraCharges(prev =>
  //     prev.map(i => (i.id === id ? { ...i, amount } : i))
  //   );
  // };
    const updateAmount = (id, amount) => {
  const onlyNum = amount.replace(/[^0-9]/g, "");

  setExtraCharges((prev) =>
    prev.map((i) =>
      i.id === id
        ? { ...i, amount: onlyNum, amountError: "" }
        : i
    )
  );
};
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


  const mockData = {
    customer_name: "Daniel Balaji",
    profile_image: "",

    floor: "Ground Floor",
    room: "003",
    bed: "03",

    joined_date: "22/10/2024",
    req_checkout_date: "24/08/2025",

    advance_amount: 8000,
    monthly_rent: 4000,
    booking_amount: 500,
    advance_paid: 6000,

    actual_checkout_date: "30/11/2025",
    status: "Pending",

    last_reading: 230,
    current_reading: 471.89,

    deductions: [
      { reason: "Miscellaneous", amount: "2000" },
      { reason: "Other", amount: "1200" },
    ],

    invoices_pending: [{ invoice_no: "INV001", type: "Recurring", amount: 5000 }],

    refundable_rent: [
      { description: "Last Rent Paid (30 Days)", amount: 6000 },
      { description: "Actual Stay Days (14 days ₹ 200)", amount: 2800 },
      { description: "EB Amount", amount: 600 },
      { description: "Food", amount: 2600 },
    ],
  };

  const data = mockData;

  const hasPending =
    data.status === "Pending" && (data.invoices_pending || []).length > 0;

  const [currentEB, setCurrentEB] = useState(
    data.current_reading ? String(data.current_reading) : ""
  );
  const [showEBPicker, setShowEBPicker] = useState(false);

  const [checkoutDate, setCheckoutDate] = useState("");
  const [showCheckoutPicker, setShowCheckoutPicker] = useState(false);

  const [maintenanceAmount, setMaintenanceAmount] = useState("");
  const [nonRefundables, setNonRefundables] = useState([]);

  const addNonRefundable = () => {
    setNonRefundables(prev => [
      ...prev,
      { reason: "", amount: "" }
    ]);
  };

  const removeNonRefundable = (index) => {
    setNonRefundables(prev => prev.filter((_, i) => i !== index));
  };

  const onEBDatePick = (event, selected) => {
    if (Platform.OS === "android") setShowEBPicker(false);
  };



  const onCheckoutDatePick = (event, selected) => {
    if (Platform.OS === "android") setShowCheckoutPicker(false);
    if (selected) {
      const formatted = dayjs(selected).format("DD/MM/YYYY");
      setCheckoutDate(formatted);
    }
  };

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };
  const userEnteredDeductionsTotal = extraCharges
    .filter(item => !item.isDefault)
    .reduce((sum, item) => {
      const amt = Number(item.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

  const apiDeductions =
    Number(settlementDetails?.settlementInfo?.totalDeductions) || 0;
  const finalTotalDeductions = apiDeductions + userEnteredDeductionsTotal;
  const grandFinalTotalDeductions = apiDeductions + userEnteredDeductionsTotal + settlementDetails?.currentMonthRentInfo?.currentPayableRent

  useEffect(() => {
    if (settlementDetails?.settlementInfo) {
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

      setReturnAmount(finalAmount);
    }
  }, [settlementDetails]);
  const isNegative = Number(ReturnAmount) < 0;

  const extraDeductionsPayload = extraCharges
    .filter(item => !item.isDefault && Number(item.amount) > 0)
    .map(item => ({
      item: item.type === "Others"
        ? item.title?.trim()
        : item.type,        // 👈 Maintenance / DueAmount
      amount: Number(item.amount),
    }));


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
  const handleGenerate = async () => {
     const chargeValid = validateExtraCharges();
  if (!chargeValid) return;
    const customerId =
      selectedItem?.customerId ||
      selectedBed?.currentTenantInfo[0]?.tenetId;


    const payload = extraDeductionsPayload;



    const res = await submitSettlement(customerId, payload);

    if (res.success) {

      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);
      navigation.goBack();
      setTimeout(() => {
        setShowSuccess(false);
      }, 800);

    } else {

      setModalType("warning");
      setMessage(res.message);
      setShowSuccess(true);
    }
  };

  const fmt = (v) =>
    typeof v === "number" ? `₹ ${v.toLocaleString("en-IN")}` : `₹ ${v}`;

  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Final Settlement</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 40, marginTop: 20 }}>


          <View style={styles.card}>
            <View style={styles.row}>
              {/* <Image source={Profile} style={styles.profileImg} /> */}
              {settlementDetails?.customerInfo?.profilePic ? (
  <Image
    source={{ uri: settlementDetails.customerInfo.profilePic }}
    style={styles.profileImg}
  />
) : (
  <View style={[styles.initialCircle, { width: 42, height: 42, borderRadius: 21 }]}>
    <Text style={styles.initialText}>
      {settlementDetails?.customerInfo?.initials ||
        settlementDetails?.customerInfo?.fullName
          ?.split(" ")
          ?.map(w => w[0])
          ?.join("")
          ?.slice(0, 2)
          ?.toUpperCase() || "--"}
    </Text>
  </View>
)}

              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.name}>{settlementDetails?.customerInfo?.fullName}</Text>
                {
                  settlementDetails?.currentMonthRentInfo?.rentLists?.map((item, index) => {
                    return (

                      <View style={styles.smallRow} key={item.bedName || index}>
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.floorName}</Text>
                        </View>

                        <Image source={RoomIcon} style={styles.smallIcon} />
                        <Text style={styles.badgeLabel}>{item.roomName}</Text>

                        <Image source={BedIcon} style={styles.smallIcon} />
                        <Text style={styles.badgeLabel}>{item.bedName}</Text>
                      </View>

                    )

                  })
                }

              </View>
            </View>
            <View style={styles.grid}>

              <View style={styles.gridPair}>
                <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>Joined Date</Text>
                  <Text style={styles.gridValue}>{settlementDetails?.customerInfo?.joiningDate}</Text>
                </View>

                <View style={[styles.gridCol, { marginLeft: 30 }]}>
                  <Text style={styles.gridLabel}>Req Checkout Date</Text>
                  <Text style={styles.gridValue}>{settlementDetails?.stayInfo?.noticeDate}</Text>
                </View>
              </View>

              <View style={styles.gridPair}>
                <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>Advance Amount</Text>
                  <Text style={styles.gridValue}>{settlementDetails?.customerInfo?.advanceAmount}</Text>
                </View>

                <View style={[styles.gridCol, { marginLeft: 30 }]}>
                  <Text style={styles.gridLabel}>Monthly Rent</Text>
                  <Text style={styles.gridValue}>{settlementDetails?.customerInfo?.rentAmount}</Text>
                </View>
              </View>

              <View style={styles.gridPair}>
                <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>Booking Amount</Text>
                  <Text style={styles.gridValue}>{settlementDetails?.customerInfo?.bookingAmount}</Text>
                </View>

                <View style={[styles.gridCol, { marginLeft: 30 }]}>
                  <Text style={styles.gridLabel}>Advance Paid</Text>
                  <Text style={styles.gridValue}>{settlementDetails?.customerInfo?.advancePaidAmount}</Text>
                </View>
              </View>

              <View style={styles.gridPair}>
                {/* <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>Actual Checkout Date</Text>
                  <Text style={styles.gridValue}>{settlementDetails?.stayInfo?.checkoutDate}</Text>
                </View> */}
                <View style={styles.gridCol}>
  <Text style={styles.gridLabel}>Actual Checkout Date</Text>

  <View style={styles.checkoutRow}>
    <Text style={styles.gridValue}>
      {actualCheckoutDate || "DD-MM-YYYY"}
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


                <View style={[styles.gridCol, { marginLeft: 30 }]}>
                  <Text style={styles.gridLabel}>Status</Text>
                  <Text
                    style={[
                      styles.gridValue,
                      { color: data.status === "Pending" ? "#E11D48" : "#16A34A" },
                    ]}
                  >
                    {data.status}
                  </Text>
                </View>
              </View>

            </View>

          </View>

          <View style={styles.ebHeaderRow}>
            <Text style={styles.ebTitle}>
              Current EB Reading <Text style={{ color: "red" }}>*</Text>
            </Text>

            <Text style={styles.lastReadingText}>
              Last Reading : 230
            </Text>
          </View>


          <View style={styles.inputWrap}>
            <TextInput
              style={styles.ebInput}
              value={currentEB}
              onChangeText={setCurrentEB}
              keyboardType="numeric"
              placeholder="Enter reading"
            />

          </View>

          <View style={styles.nonRefund}>
            <View style={styles.extraHeader}>
              <Text style={styles.label}>Non Refundable Amount</Text>

              <TouchableOpacity style={styles.addBtn} onPress={addCharge}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Add</Text>
              </TouchableOpacity>
            </View>

            {extraCharges.map((item) => (
              <View key={item.id} style={styles.figmaRowWrapper}>

                {/* CLOSE BTN */}
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
                        item.isDefault && { opacity: 0.6 }
                      ]}
                      onPress={() =>
                        setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                      }
                    >
                      <Text style={{ color: "#777" }}>Select...</Text>
                      <Image source={DownArrow} style={styles.arrow} />
                    </TouchableOpacity>
                  ) : item.type === "Others" ? (
                    <TextInput
                      style={styles.figmaLeftBox}
                      placeholder="Enter reason"
                      value={item.title}
                      onChangeText={(t) => updateTitle(item.id, t)}
                    />
                  ) : (
                    <View style={[styles.figmaLeftBox, { backgroundColor: "#EFEFEF" }]}>
                      <Text>Maintenance</Text>
                    </View>
                  )}

                  {/* RIGHT BOX ALWAYS VISIBLE (disabled until type selected) */}
                  {item.type === "" ? (
                    <View style={[styles.figmaRightBox, { opacity: 0.4 }]}>
                      <Text style={{ color: "#999" }}>Enter amount</Text>
                    </View>
                  ) : (
                    // <TextInput
                    //   style={styles.figmaRightBox}
                    //   placeholder="Enter amount"
                    //   keyboardType="numeric"
                    //   value={item.amount}
                    //   onChangeText={(t) => updateAmount(item.id, t)}
                    // />
                    <TextInput
                      editable={!item.isDefault}
                      style={[
                        styles.figmaRightBox,
                        item.isDefault && { backgroundColor: "#F1F1F1" }
                      ]}
                      value={item.amount}
                      placeholder="Enter Amount"
                      keyboardType="numeric"
                      onChangeText={(t) => updateAmount(item.id, t)}
                    />
                  )}

                </View>
 {item.titleError && (
                  <ErrorMessage message={item.titleError} type="error" />
                )}
{/* {item.amountError ? (
  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
    {item.amountError}
  </Text>
) : null} */}
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
                      );
                    })}
                  </View>
                )}

              </View>
            ))}





          </View>

          {
            settlementDetails?.unpaidInvoices?.length > 0 &&
            <>
              <Text style={{ marginLeft: 15, fontWeight: 600, marginTop: 10 }}>Invoices Pending</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCellLeft, styles.tableHeaderText]}>INVOICE.NO</Text>
                  <Text style={[styles.tableCellCenter, styles.tableHeaderText]}>TYPE</Text>
                  <Text style={[styles.tableCellRight, styles.tableHeaderText]}>INVOICE AMOUNT</Text>
                </View>

                {Array.isArray(settlementDetails?.unpaidInvoices) && settlementDetails?.unpaidInvoices.map((user, i) => (
                  <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableStrip : null]}>
                    <Text style={[styles.tableCellLeft, styles.invoiceLink]}>{user.invoiceNumber}</Text>
                    <Text style={styles.tableCellCenter}> {user.type}</Text>
                    <Text style={styles.tableCellRight}>{user.payableAmount}</Text>
                  </View>
                ))}
              </View>
            </>
          }

          {/* // <>
          //   <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Check out Date *</Text>
          //   <TouchableOpacity style={styles.inputBoxSingle} onPress={() => setShowCheckoutPicker(true)}>
          //     <Text style={{ color: checkoutDate ? "#000" : "#9CA3AF" }}>{checkoutDate || "DD/MM/YYYY"}</Text>
          //     <Image source={CalendarIcon} style={styles.iconImage} />
          //   </TouchableOpacity>
          // </> */}


          <Text style={{ marginLeft: 15, fontWeight: 600, marginTop: 10 }}>
            Refundable Rent
          </Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCellLeft, styles.tableHeaderText]}>
                DESCRIPTION
              </Text>
              <Text style={[styles.tableCellRight, styles.tableHeaderText]}>
                INVOICE AMOUNT
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tabledescription}>
                Last Rent (30 days)
              </Text>

              <Text style={styles.tableCellRight}>
                ₹ {Number(
                  (settlementDetails?.currentMonthRentInfo?.currentRentPaid) || 0
                ).toLocaleString("en-IN")}
              </Text>

            </View>
            {/* <View style={styles.tableRow}>
              <Text style={styles.tabledescription}>
                Acctual days (
                {settlementDetails?.currentMonthRentInfo?.stayDays} days)
              </Text>
              <Image source={DownArrow} style={styles.arrow}/>
              {showDetails &&
  settlementDetails?.currentMonthRentInfo?.rentLists?.map(
    (item, index) => (
      <View key={index} style={styles.detailRow}>
        <View>
          <Text style={styles.linkText}>
            {item.floorName}
          </Text>
          <Text style={styles.linkText}>
            {item.roomName} - {item.bedName}
          </Text>
        </View>

        <Text style={styles.rightText}>
          ({item.noOfDays} day = {item.rent})
        </Text>
      </View>
    )
  )}

              <Text style={styles.tableCellRight}>
                ₹ {Number(
                  (settlementDetails?.currentMonthRentInfo?.currentPayableRent) || 0
                ).toLocaleString("en-IN")}
              </Text>

            </View> */}

            <TouchableOpacity
  style={styles.tableRow}
  onPress={() => setShowDetails(!showDetails)}
  activeOpacity={0.7}
>
  {/* LEFT SIDE */}
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={styles.tabledescription}>
      Actual day ({settlementDetails?.currentMonthRentInfo?.stayDays} days)
    </Text>

    <Image
      source={DownArrow}
      style={[
        styles.arrow,
        showDetails && { transform: [{ rotate: "180deg" }] }
      ]}
    />
  </View>

  {/* RIGHT SIDE */}
  <Text style={styles.tableCellRight}>
    ₹{" "}
    {Number(
      settlementDetails?.currentMonthRentInfo?.currentPayableRent || 0
    ).toLocaleString("en-IN")}
  </Text>
</TouchableOpacity>
{showDetails &&
  settlementDetails?.currentMonthRentInfo?.rentLists?.map(
    (item, index) => (
      <View key={index} style={styles.detailRow}>
        <View>
          <Text style={styles.linkText}>{item.floorName}</Text>
          <Text style={styles.linkText}>
            {item.roomName} - {item.bedName} -  ({item.noOfDays} day = {item.rent})
          </Text>
        </View>

        {/* <Text style={styles.rightText}>
        
        </Text> */}
      </View>
    )
  )}

          </View>


          <View style={{ paddingHorizontal: 25, paddingTop: 10 }}>
            <TouchableOpacity style={styles.header} onPress={toggle}>
              <Text style={styles.totalRefund}>Total Refund</Text>

              <Image
                source={DirectionDownIcon}
                style={{ height: 30, width: 30, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </TouchableOpacity>
          </View>
          {open && (
            <View style={styles.card}>
              <View style={styles.content}>

                {/* <Row
      label="Final Settlement"
     
    /> */}
                <Text style={{ fontWeight: 600, marginTop: 10 }}>
                  Final Settlement
                </Text>

                <Row
                  label="Refundable Advance"
                  value={`₹ ${(
                    settlementDetails?.settlementInfo?.refundableAdvance || 0
                  ).toLocaleString("en-IN")}`}
                />

                <Row
                  label="Refundable Rent"
                  value={`₹ ${(
                    settlementDetails?.settlementInfo?.refundableRent || 0
                  ).toLocaleString("en-IN")}`}
                />

                <Row
                  label="Total Deductions"
                  value={`-₹ ${finalTotalDeductions.toLocaleString("en-IN")}`}
                  red
                />

                <View style={styles.resultBox}>
                  <Text
                    style={[
                      styles.finalAmount,
                      { color: isNegative ? "#D70000" : "#16A34A" } // 🔴 red : 🟢 green
                    ]}
                  >
                    {isNegative ? "-" : ""}₹{" "}
                    {Math.abs(Number(ReturnAmount)).toLocaleString("en-IN")}
                  </Text>
                </View>

              </View>
            </View>

          )}





        </ScrollView>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addBtn2} onPress={handleGenerate}>
            <Text style={styles.addBtnText} >Generate</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showEBPicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={{ fontWeight: "700", marginBottom: 10 }}>Enter EB Reading</Text>
              <TextInput
                placeholder="Reading"
                value={currentEB}
                onChangeText={setCurrentEB}
                keyboardType="numeric"
                style={[styles.inputBox, { marginBottom: 10 }]}
              />
              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <TouchableOpacity style={{ marginRight: 12 }} onPress={() => setShowEBPicker(false)}>
                  <Text style={{ color: "#6B7280" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEBPicker(false)}>
                  <Text style={{ color: "#2B6CF6", fontWeight: "700" }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {showCheckoutPicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onCheckoutDatePick}
          />
        )}
      </SafeAreaView>
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
        }}
      />
    </View>
  </View>
</Modal>

    </>
  );
}

const Row = ({ label, value, red }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, red && { color: "#D70000" }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 6,

  },

  topHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 100,
    marginTop: 35
    //   elevation: 5, 
  },

  backIcon: { width: 18, height: 18, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "700" },

  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    backgroundColor: "#fff",
    elevation: 1
  },

  row: { flexDirection: "row", alignItems: "center" },
  profileImg: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#E6EEF9" },
  name: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  smallRow: { flexDirection: "row", alignItems: "center" },
  badge: { backgroundColor: "#FFEFCF", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 8 },
  badgeText: { color: "black", fontSize: 12 },
  smallIcon: { width: 16, height: 16, marginHorizontal: 4 },
  badgeLabel: { fontSize: 13 },

  grid: {
    marginTop: 10
  },

  gridPair: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  gridCol: {
    width: "48%",
    flexDirection: "column",
  },

  gridLabel: {
    color: "#6B7280",
    fontSize: 13,
  },

  gridValue: {
    fontWeight: "700",
    fontSize: 14,
    marginTop: 3,
  },

  ebHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
  },

  ebTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },

  lastReadingText: {
    fontSize: 13,
    color: "#444",
    fontWeight: "400",
  },


  inputWrap: { flexDirection: "row", marginHorizontal: 16, marginTop: 10, alignItems: "center" },
  ebInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  iconBtn: {
    marginLeft: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  iconImage: { width: 18, height: 18 },
  nonRefundContainer: {
    marginTop: 10,
    backgroundColor: "#F7F7FA",
    padding: 10,
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15
  },

  nonRefundHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  nonRefundRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },



  fixedLabel: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },

  closeInside: {
    position: "absolute",
    right: -6,
    top: -8,
    padding: 6,
    backgroundColor: "#DCDCDC",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 20,
  },





  iconImage: {
    height: 16,
    width: 16,
    marginRight: 6
  },

  addText: { color: "#fff", fontSize: 12, fontWeight: "600" },


  inputBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  rowClose: {
    position: "absolute",
    right: -6,
    top: -8,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    padding: 6,
  },

  table: { marginHorizontal: 16, marginTop: 10, borderRadius: 8, borderWidth: 1, borderColor: "#EEF2F7", overflow: "hidden", backgroundColor: "#fff" },
  tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 12, justifyContent: "space-between" },
  tableHeader: { backgroundColor: "#FBFDFF" },
  tableHeaderText: { fontWeight: "700", color: "#111", fontSize: 12 },
  tableCellLeft: { width: "33%", color: "#1E5BFF", fontSize: 11 },
  tableCellCenter: { width: "33%", textAlign: "center", fontSize: 11 },
  tableCellRight: { width: "33%", textAlign: "right", fontSize: 11 },
  tabledescription: { width: "55%", color: "#1E5BFF", fontSize: 11 },
  tableStrip: { backgroundColor: "#FCFCFD" },
  invoiceLink: { color: "#1E5BFF", textDecorationLine: "underline" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 24 },
  modalBox: { backgroundColor: "#fff", borderRadius: 12, padding: 16 },

  inputBoxSingle: {
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },


  totalRefund: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    color: "#666",
  },
  value: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  resultBox: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    borderRadius: 8,
  },
  finalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "green",
    textAlign: "left",
  },
  btnRow: {
    display: 'flex',
    flexDirection: "row",
    //   alignItems: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 60,
    paddingHorizontal: 12,
  },

  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },

  cancelText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
  },

  addBtn2: {
    backgroundColor: "#2B6CF6",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  addBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },



  // add
  nonRefund: {
    backgroundColor: "#F7F9FF",
    padding: 10,
    marginTop: 10,
    borderRadius: 20
  },

  extraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
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
    marginRight: 20
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
    height: 10
  },
  arrow: { width: 18, height: 18, tintColor: "#444" },
  dropdownMenu: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,

  },

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
     detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingLeft: 10,
  },
    linkText: {
    color: "#2563EB",
    fontSize: 13,
  },
   rightText: {
    fontSize: 13,
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
  fontWeight: "700",
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
initialCircle: {
  backgroundColor: "#E5E7EB",
  alignItems: "center",
  justifyContent: "center",
},

initialText: {
  fontSize: 16,
  fontWeight: "700",
  color: "#374151",
},




});
