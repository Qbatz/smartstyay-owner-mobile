import React, { useState, useRef, useEffect , useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Modal, Animated ,
  PanResponder,
  BackHandler
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react"; 
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { BankingContext } from "../../../Context/BankingContext";
import Loader from "../../../Component/Loader/Loader"
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import MultiSelectDropdown from "./MultiSelectDropdown"

import Profile from "../../../Assets/Images/profile.png";
import FilterIcon from "../../../Assets/Images/filter.png";  
import SearchIcon from "../../../Assets/Images/Asset_search.png";
import InProfile from "../../../Assets/Images/inActiveuser.png";
import ActiveCheckout from "../../../Assets/Images/Active_checkout.png";
import CheckoutIcon from "../../../Assets/Images/checkout.png";
import ActiveWalkin from "../../../Assets/Images/ActiveWalkin.png";
import WalkinIcon from "../../../Assets/Images/walkin.png";
// import TenAntAdd from "../../../Assets/Images/TenantAdd.png";
import AddIcon from "../../../Assets/Images/add-circle.png";
import Dots from "../../../Assets/Images/3dots.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
// import MoveNoticeModal from '../Customer/MoveToNoticePeriod';
// import ReassignBedModal from '../Customer/ReAssignBed';
// import CheckoutList from '../Customer/Checkout/CheckoutList';
import Download from "../../../Assets/Images/download.png";
import Telegram from "../../../Assets/Images/telegram.png";
import Payment from "../../../Assets/Images/payment.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import RecurringBills from "./RecurringBills"
import Receipt from './Receipt'
import Call from "../../../Assets/Images/call.png";
import Sms from "../../../Assets/Images/sms.png";
import dateImg from "../../../Assets/Images/home-link.png";
import room from "../../../Assets/Images/PG_active.png";
import Bed from "../../../Assets/Images/bed.png";
import Bills_Black_Icon from "../../../Assets/Images/Bills_Black_Icon.png";
import EmptyFloor from "../../../Assets/Images/Empty_floor.png"

import ArrowUp from "../../../Assets/Images/arrow-up.png";
import ArrowDown from "../../../Assets/Images/arrow-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import CalendarBlueIcon from "../../../Assets/Images/calendar_blue.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import ProfileImage from "../../../Assets/Images/Avatar.png";
import DueIcon from "../../../Assets/Images/Due_Icon.png";
import MoneyCheckIcon from "../../../Assets/Images/money_check.png";
import PreviewIcon from "../../../Assets/Images/View_Icon.png";
import WriteOffDueIcon from "../../../Assets/Images/writeoff_due_icon.png";
import { Dimensions } from "react-native";







export default function BillsDesign({ route }) {
  // const { setShowTabBar } = route.params;
  // const screenWidth = Dimensions.get("window").width;

  const detailDotsRef = useRef(null);

  const { BillDetails , loading, GetAllBillDetails ,
     RecordPayment , GetInitializeRefundDetails , CreateRefund , refundError  
     , GetRecurringBills, recurringBills , BillPdfdetails , getBillsPdfDetails , getReceiptPdfDetails} = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);
  const {bankList, getBankListByHostel } = useContext(BankingContext);


  const filterOptions = BillDetails?.filterOptions;

  const billStatusOptions = filterOptions?.paymentStatus?.map(i => ({
  label: i?.name,
  value: i?.type,
}));

console.log("BillPdfdetails", BillPdfdetails);



const typeOptions = filterOptions?.invoiceTypes?.map(i => ({
  label: i?.name,
  value: i?.type,
}));

const modeOptions = filterOptions?.invoiceModes?.map(i => ({
  label: i?.name,
  value: i?.mode,
}));


const createdByOptions = filterOptions?.createdBy?.map(u => ({
  label: u?.name.trim(),
  value: u?.userId,
}));


    console.log("bills", BillDetails , filterOptions);
    console.log("recurringBills", recurringBills);


  const [activeTab, setActiveTab] = useState("All Bills");
  const navigation = useNavigation();
  const [showDetailModal, setShowDetailModal] = useState(false);
 const [refundInitDetails, setRefundInitDetails] = useState(null);
const [refundLoading, setRefundLoading] = useState(false);

const [refundAmountError, setRefundAmountError] = useState("");
const [refundFromError, setRefundFromError] = useState("");
const [searchText, setSearchText] = useState("");
 

const [selectedCustomer, setSelectedCustomer] = useState(null);
const [showReAssignbed , setShowReAssignBed] = useState(false)
const [showNotice, setShowNotice] = useState(false);
const [reqDate, setReqDate] = useState("31/07/2025");
const [outDate, setOutDate] = useState("30/08/2025");
const [reason, setReason] = useState("");
const [showMenu, setShowMenu] = useState(false);
const [showFilter, setShowFilter] = useState(false);
const [status, setStatus] = useState("All");
const [showStatusDropdown, setShowStatusDropdown] = useState(false);
const [showDetailsMenu, setShowDetailsMenu] = useState(false);
const [deleteTenants,setDeleteTenants] = useState(false)
const [showWriteOff, setShowWriteOff] = useState(false);
const [writeOffReason, setWriteOffReason] = useState("");

 const [showReceiptDetails, setShowReceiptDetails] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

 


//record payement

const [showRecordPayment, setShowRecordPayment] = useState(false);

const [paidDate, setPaidDate] = useState(null);
const [openPaidDate, setOpenPaidDate] = useState(false);


const [paidAmount, setPaidAmount] = useState("");
const [balanceAmount, setBalanceAmount] = useState(0);
const [selectedMode, setSelectedMode] = useState("");
const [transactionId, setTransactionId] = useState("");
const [amountError, setAmountError] = useState("");
const [dateError, setDateError] = useState("");
const [modeError, setModeError] = useState("");

const [recordLoading, setRecordLoading] = useState(false);

const [showPaymentMode, setShowPaymentMode] = useState(false);
const paymentModes = ["Cash", "UPI", "Bank Transfer"];


const [showRefundPayment, setShowRefundPayment] = useState(false);

const [refundAmount, setRefundAmount] = useState("");
const [refundBalance, setRefundBalance] = useState(0);

const [refundDate, setRefundDate] = useState(null);
const [openRefundDate, setOpenRefundDate] = useState(false);
const [refundDateError, setRefundDateError] = useState("");
const [refundFrom, setRefundFrom] = useState("");
const [showRefundFrom, setShowRefundFrom] = useState(false);

const [refundMode, setRefundMode] = useState("");
const [showRefundMode, setShowRefundMode] = useState(false);


const bankOptions = ["SBI-IMMAN", "HDFC-JOBIN", "ICICI-KUMAR"];
const refundModes = ["UPI", "Cash", "Bank Transfer"];


// filter 
const [billStatus, setBillStatus] = useState([]);
const [type, setType] = useState([]);
const [mode, setMode] = useState([]);
const [createdBy, setCreatedBy] = useState([]);
const [appliedFilters, setAppliedFilters] = useState(null);
const [filterError, setFilterError] = useState("");



const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
const isBillLocked = true;


useEffect(() => {
  GetAllBillDetails(activeHostelId);
}, [activeHostelId]);

    useEffect(() => {
  if (activeHostelId) {
    getBankListByHostel(activeHostelId);
  }
}, [activeHostelId]);


useEffect(() => {
  if (activeHostelId) {
    GetRecurringBills(activeHostelId);
  }
}, [activeHostelId]);

  

const dotsRef = useRef(null);

    const detailsY = useRef(new Animated.Value(0)).current;
    const detailsSheetY = useRef(new Animated.Value(0)).current;
    const writeoffSheetY = useRef(new Animated.Value(0)).current;
     const receiptdetailsSheetY = useRef(new Animated.Value(0)).current;

    const handleRefundRecord = () => {
  // Basic validation
  if (!refundAmount) {
    alert("Enter refund amount");
    return;
  }
  if (!refundFrom) {
    alert("Select refund from");
    return;
  }
  if (!refundMode) {
    alert("Select refund mode");
    return;
  }

  // Example payload (you can send this to API)
  const payload = {
    customer: "Jobin",
    refundAmount,
    refundDate: dayjs(refundDate).format("YYYY-MM-DD"),
    refundFrom,
    refundMode,
    transactionId,
  };

  console.log("REFUND DATA 👉", payload);

  // Close popup
  setShowRefundPayment(false);
};


// const openMenu = (item) => {
//   dotsRef.current.measure((fx, fy, width, height, px, py) => {
//     setPopupPosition({ x: px, y: py });
//     setSelectedCustomer(item);
//     setShowMenu(true);
//   });
// };


const transactionOptions = (bankList || []).map((item) => ({
  label: `${item.accountHolderName || "Account"} - ${item.accountType}`,
  value: item.bankingId,
}));


const openMenu = (event, item) => {
  event.target.measureInWindow((x, y, width, height) => {
    setPopupPosition({
      x: x,
      y: y + height,
    });
      setSelectedBill(item);
    setSelectedCustomer(item);
    setShowMenu(true);
  });
};


const DeleteMenu = ()=>{
  setDeleteTenants(true)
}
const CloseDelete = () =>{
  setDeleteTenants(false)
}

     const [fromDate, setFromDate] = useState(null);
     const [toDate, setToDate] = useState(null);


    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);

    // const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");
    const formatDate = (d) => {
  if (!d) return "Select Date";
  return dayjs(d).format("DD-MM-YYYY");
};

const payload = {
  startDate: fromDate ? dayjs(fromDate).format("DD/MM/YYYY") : null,
  endDate: toDate ? dayjs(toDate).format("DD/MM/YYYY") : null,
};

console.log("datepayload", payload);


    const [showBillDetails, setShowBillDetails] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);




    const amountOptions = [
      "Low to High (Lowest First)",
      "High to Low (Highest First)",
      "Newest First",
      "Oldest First",
    ];
 
      const [amountSelected, setAmountSelected] = useState(amountOptions[0]);
      const [amountDropdownVisible, setAmountDropdownVisible] = useState(false);


      const recordSheetY = useRef(new Animated.Value(0)).current;

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
          setShowRecordPayment(false);
          recordSheetY.setValue(0);
        });
      } else {
        Animated.spring(recordSheetY, { toValue: 0, useNativeDriver: true }).start();
      }
    },
  })
).current;


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
          setShowRefundPayment(false);
          refundSheetY.setValue(0);
        });
      } else {
        Animated.spring(refundSheetY, { toValue: 0, useNativeDriver: true }).start();
      }
    },
  })
).current;




// useLayoutEffect(() => {
//   setShowTabBar(!showDetailModal && !showFilter);
// }, [showDetailModal, showFilter]);



useLayoutEffect(() => {
  const backAction = () => {
    if (showDetailModal) {
      setShowDetailModal(false);
      return true;
    }

    if (showFilter) {
      setShowFilter(false);
      return true;
    }

     if (showBillDetails) {
      setShowBillDetails(false);
      return true;
    }

    if(showReceiptDetails){
      setShowReceiptDetails(false)
       return true;
    }

    if (showWriteOff) {
      setShowWriteOff(false);
      return true;
    }

    if(showRecordPayment){
      setShowRecordPayment(false)
      return true;
    }

     if (showRefundPayment) {
          setShowRefundPayment(false);
          return true;
        }


    return false;
  };

  const handler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => handler.remove();
}, [showDetailModal, showFilter , showBillDetails , showWriteOff , showRecordPayment , showRefundPayment , showReceiptDetails]);

  useEffect(() => {
              const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                () => {
                  navigation.goBack();  
                  return true;
                }
              );
            
              return () => backHandler.remove();
            }, [])




 useLayoutEffect(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: "none" },
      });
  
      return () => {
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            paddingVertical: 12,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderColor: "#fff",
            elevation: 8,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        });
      };
    }, [navigation]);
  
  
    useEffect(() => {
      const onBackPress = () => {
        if (amountDropdownVisible) {
          setAmountDropdownVisible(false);
          return true;
        }
       
        if (openFrom) {
          setOpenFrom(false);
          return true;
        }
        if (openTo) {
          setOpenTo(false);
          return true;
        }
        if (showFilter) {
          setShowFilter(false);
          return true;
        }

        
      
        
        return false;
      };
  
      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [ showFilter, openFrom, openTo, amountDropdownVisible]);


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
          setShowBillDetails(false);
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

   const receiptDetailsPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) receiptdetailsSheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(receiptdetailsSheetY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setShowReceiptDetails(false);
            receiptdetailsSheetY.setValue(0);
          });
        } else {
          Animated.spring(receiptdetailsSheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;




const writeoffPan = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) writeoffSheetY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) {
        Animated.timing(writeoffSheetY, {
          toValue: 700,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShowWriteOff(false);
          writeoffSheetY.setValue(0);
        });
      } else {
        Animated.spring(writeoffSheetY, { toValue: 0, useNativeDriver: true }).start();
      }
    },
  })
).current;


 const detailsfilter = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
        onPanResponderMove: (_, g) => {
          if (g.dy > 0) detailsY.setValue(g.dy);
        },
        onPanResponderRelease: (_, g) => {
          if (g.dy > 120) {
            Animated.timing(detailsY, {
              toValue: 700,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              setShowFilter(false);
              detailsY.setValue(0);
            });
          } else {
            Animated.spring(detailsY, { toValue: 0, useNativeDriver: true }).start();
          }
        },
      })
    ).current;
  
    const toggleAmountDropdown = () => {
    setAmountDropdownVisible((v) => !v);
  };

  
  const tabs = [
    { key: "All Bills", active: Profile, inactive: InProfile },
    { key: "RecurringBills", active: ActiveCheckout, inactive: CheckoutIcon },
    { key: "Receipt", active: ActiveWalkin, inactive: WalkinIcon },
  ];


const openCustomerDetails = (customer) => {
  setSelectedCustomer(customer);
  setShowDetailModal(true);
};

const openBillDetails = (item) => {
  setSelectedBill(item);
  setShowBillDetails(true);
};



const handleShowWriteOff = () => {
  setShowWriteOff(true);
}

const handleShowRecordPayment  = () => {
  setShowMenu(false);
  setShowRecordPayment(true);
}

const handleCreateBill = () => {
navigation.navigate("CreateBills" , {mode: "add"})
}

const formatApiDate = (date) =>
  date
    ? dayjs(date, "DD/MM/YYYY").format("DD MMM YYYY")
    : "--";


 const handleOpenReceiptSheet = (item) => {
  console.log(item);
  
    setSelectedReceipt(item);
    setShowReceiptDetails(true);
  };

  const handleShowReceiptPdf = async () => {
navigation.navigate("ReceiptPdf")
  const res = await getReceiptPdfDetails(
      activeHostelId,
      selectedReceipt?.transactionId
    );
    console.log("res", res);
}

const handlePaidAmountChange = (value) => {
  setAmountError("");

  let num = Number(value);

  if (isNaN(num)) num = 0;

  // ❗ paid amount > due amount block
  if (num > (selectedBill?.dueAmount || 0)) {
    num = selectedBill?.dueAmount || 0;
  }

  setPaidAmount(String(num));
  setBalanceAmount((selectedBill?.dueAmount || 0) - num);
};

const formatDateForPayload = (date) => {
  if (!date) return null;

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);

  const day = String(localDate.getDate()).padStart(2, "0");
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const year = localDate.getFullYear();

  return `${day}-${month}-${year}`;
};


const handleSaveRecordPayment = async () => {
  const formattedPaidDate = formatDateForPayload(paidDate);

  // ---------- VALIDATION ----------
  if (!paidAmount || Number(paidAmount) <= 0) {
    setAmountError("Please Enter Amount");
    return;
  }

  if (!formattedPaidDate) {
    setDateError("Please Select Date");
    return;
  }

  // Paid date < invoice date block
  const billDate = dayjs(selectedBill?.invoiceDate, "DD/MM/YYYY");
  const paid = dayjs(formattedPaidDate, "DD-MM-YYYY");

  if (paid.isBefore(billDate, "day")) {
    setDateError("Paid date should not be before Bill date");
    return;
  }

  if (!selectedMode) {
    setModeError("Please Select Transaction Type");
    return;
  }

  // ---------- API CALL ----------
  try {
    setRecordLoading(true);

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
      // refresh bills
      await GetAllBillDetails(activeHostelId);

      setShowRecordPayment(false);

      // reset
      setPaidAmount("");
      setBalanceAmount(0);
      setSelectedMode("");
      setTransactionId("");

      alert("Payment recorded successfully");
    } 
    else if (res.payableAmount) {
      // backend validation (same as web PAYABLE_AMOUNT)
      alert(res.payableAmount);
    } 
    else {
      alert(res.message || "Payment failed");
    }
  } catch (err) {
    alert("Something went wrong");
  } finally {
    setRecordLoading(false);
  }
};



const handleSearch = async (text) => {
  const filters = {
    startDate: appliedFilters?.startDate || null,
    endDate: appliedFilters?.endDate || null,
    paymentStatus: appliedFilters?.paymentStatus || [],
    type: appliedFilters?.type || [],
    modes: appliedFilters?.modes || [],
    createdBy: appliedFilters?.createdBy || [],
    search: text || null, 
  };

  await GetAllBillDetails(activeHostelId, filters);
};





// const handleSaveInvoiceList = async () => {
//   const formatpaiddate = formatDateForPayload(paidDate);

//   const res = await RecordPayment({
//     hostelId,
//     invoiceId: invoiceList.InvoiceId,
//     data: {
//       bankId: invoiceList.transaction,
//       paymentDate: formatpaiddate,
//       referenceId: transactionId,
//       amount: payableAmount,
//     },
//   });

//   if (res.success) {
//     toast.success(res.data, {
//       position: "bottom-center",
//       autoClose: 2000,
//       hideProgressBar: true,
//     });
//   } else if (res.payableAmount) {
//     // same as PAYABLE_AMOUNT reducer
//     setPayableAmount(res.payableAmount);
//   } else {
//     alert(res.message);
//   }
// };


const fetchRefundInitialize = async () => {
  try {
    setRefundLoading(true);

    const res = await GetInitializeRefundDetails({
      hostelId: activeHostelId,
      invoiceId: selectedBill.invoiceId,
    });

    if (res.success) {
      setRefundInitDetails(res.data);
    } else {
      alert(res.message);
    }
  } catch (err) {
    alert("Failed to load refund details");
  } finally {
    setRefundLoading(false);
  }
};

console.log("refunddetails" , refundInitDetails , selectedBill?.invoiceDate);


const handleApplyFilter = async () => {
  // 🔹 Validation 1: End date without start date
  if (!fromDate && toDate) {
    setFilterError("Please select Start Date");
    return;
  }

  // 🔹 Build filters object
  const filters = {
    startDate: fromDate ? dayjs(fromDate).format("DD/MM/YYYY") : null,
    endDate: toDate ? dayjs(toDate).format("DD/MM/YYYY") : null,
    paymentStatus: billStatus,
    type: type,
    modes: mode,
    createdBy: createdBy,
  };

  // 🔹 Validation 2: At least one filter selected
  const hasAnyFilter =
    filters.startDate ||
    filters.endDate ||
    (filters.paymentStatus && filters.paymentStatus.length > 0) ||
    (filters.type && filters.type.length > 0) ||
    (filters.modes && filters.modes.length > 0) ||
    (filters.createdBy && filters.createdBy.length > 0);

  if (!hasAnyFilter) {
    setFilterError("Please select at least one filter");
    return;
  }

  // 🔹 API call
  await GetAllBillDetails(activeHostelId, filters);

  // 🔹 Save applied filters for chips
  setAppliedFilters(filters);

  setShowFilter(false);
};



const handleResetFilters = async () => {
  setFromDate(null);
  setToDate(null);
  setBillStatus([]);
  setType([]);
  setMode([]);
  setCreatedBy([]);

  setAppliedFilters(null);
  setFilterError("")

  // 3️⃣ Normal GET bills API
  await GetAllBillDetails(activeHostelId);
};




const handleShowRefundPayment = () => {
  setShowRefundPayment(true)
  setShowMenu(false);
  if (selectedBill?.invoiceId && activeHostelId) {
    fetchRefundInitialize();
  }
}

useEffect(() => {
  if (refundInitDetails?.refundableAmount != null) {
    setRefundBalance(refundInitDetails.refundableAmount);
    setRefundAmount("");
  }
}, [refundInitDetails]);



const today = dayjs().startOf("day");

const invoiceDate = selectedBill?.invoiceDate
  ? dayjs(selectedBill.invoiceDate, "DD/MM/YYYY").startOf("day")
  : null;


  const normalizeDate = (value) => {
  if (!value) return null;

  // Date object
  if (value instanceof Date) {
    return dayjs(value).startOf("day");
  }

  // dayjs object
  if (dayjs.isDayjs(value)) {
    return value.startOf("day");
  }

  // string (DD/MM/YYYY)
  if (typeof value === "string") {
    const d = dayjs(value, "DD/MM/YYYY");
    return d.isValid() ? d.startOf("day") : null;
  }

  return null;
};


const parseInvoiceDate = (date) => {
  if (!date) return null;

  // If already Date
  if (date instanceof Date) {
    return dayjs(date).startOf("day");
  }

  if (typeof date === "string") {
    // 🔥 CLEAN invisible chars + trim
    const cleaned = date
      .replace(/\u00A0/g, " ") // non-breaking space
      .trim();

    // Try DD/MM/YYYY
    const dmy = dayjs(cleaned, "DD/MM/YYYY");
    if (dmy.isValid()) return dmy.startOf("day");

    // Fallback (ISO etc)
    const fallback = dayjs(cleaned);
    return fallback.isValid() ? fallback.startOf("day") : null;
  }

  return null;
};

useEffect(() => {
  if (selectedBill?.invoiceDate && !refundDate) {
    const inv = parseInvoiceDate(selectedBill.invoiceDate);
    if (inv) setRefundDate(inv.toDate());
  }
}, [selectedBill]);





const refundBankOptions = (refundInitDetails?.listBanks || []).map((b) => ({
  label: `${b?.bankName}`,
  value: b?.bankId,
}));

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
 
  if (!valid) return;
 
 const payload = {
  refundAmount: String(refundAmount),
  refundDate: dayjs(refundDate).format("DD-MM-YYYY"),
  bankId: refundFrom,
  referenceNumber: transactionId || "",
  invoiceId: selectedBill.invoiceId,
  hostelId: activeHostelId,
};
 
console.log("payload", payload);



  const res = await CreateRefund({
    hostelId: activeHostelId,
    invoiceId: selectedBill.invoiceId,
    payload,
  });
 
  if (res.success) {
    alert("Refund successfully");
    GetAllBillDetails(activeHostelId);
    setShowRefundPayment(false);
    setRefundAmount("");
    setRefundDate(null);
    setRefundFrom("");
    setTransactionId("");
  } else if (res.refundableError) {
    alert(res.refundableError);
  } else {
    alert(res.message);
  }
};



const handleEditBill = () => {

 navigation.navigate("CreateBills", {
    mode: "edit",
    // data: item,  
  });
}

const handleShowBillPdf = async () => {
navigation.navigate("BillsPdf")
  const res = await getBillsPdfDetails(
      selectedBill.hostelId,
      selectedBill.invoiceId
    );
    console.log("res", res);
    
}

console.log("selectedbill", selectedBill);


const handleShowCancelNotice = () => {
navigation.navigate("CancelNotice")
}

// const customerList = [
//   {
//     id: 1,
//     name: "Allwin A",
//     img: Profile,
//     floor: "Ground Floor",
//     room: "203",
//     bed: "03",
//     email: "rajkumar001@gmail.com",
//     phone: "+91 98765 43210",
//     joinDate: "10 July 2025",
//   },
// ];

  return (

    <>
     { loading && <Loader />}
  
    <SafeAreaView style={styles.container}>
      {/* 🔍 Search Bar */}


    <View style={{ flexDirection: "row", alignItems: "center" }}>

  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Image source={ArrowLeft} style={styles.backIcon} />
  </TouchableOpacity>

  <View style={styles.searchContainer}>
    <Image source={SearchIcon} style={styles.searchIcon} />
    <TextInput
      style={styles.searchInput}
      placeholder="Search Bills"
      placeholderTextColor="#9CA3AF"
      value={searchText}
      onChangeText={(text) => {
      setSearchText(text);
      handleSearch(text);
    }}
    />
  </View>

</View>


      
      <View style={styles.tabContainer}>
  {tabs.map((tab) => (
    <TouchableOpacity
      key={tab.key}
      style={[styles.tab, activeTab === tab.key && styles.activeTab]}
      onPress={() => setActiveTab(tab.key)}
    >
      <View style={styles.tabContent}>
      
        <Text
          style={[
            styles.tabText,
            activeTab === tab.key && styles.activeText,
          ]}
        >
          {tab.key}
        </Text>
      </View>
    </TouchableOpacity>
  ))}
</View>

{activeTab === "All Bills" && (
  <View style={{ flex: 1 }}>

    {!loading && BillDetails?.listInvoices && BillDetails.listInvoices.length > 0 && (
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 50 }}
  >

    


    {appliedFilters && (
  <View style={{ marginTop: 10 }}>

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>

        {/* STATUS */}
        {appliedFilters.paymentStatus?.map((s) => (
          <View key={s} style={styles.chip}>
            <Text style={styles.chipText}>Status is : {s}</Text>
          </View>
        ))}

        {/* TYPE */}
        {appliedFilters.type?.map((t) => (
          <View key={t} style={styles.chip}>
            <Text style={styles.chipText}>Type is : {t}</Text>
          </View>
        ))}

        {/* MODE */}
        {appliedFilters.modes?.map((m) => (
          <View key={m} style={styles.chip}>
            <Text style={styles.chipText}>Mode is : {m}</Text>
          </View>
        ))}

        {/* DATE RANGE */}
        {appliedFilters.startDate && appliedFilters.endDate && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              Date Region is : {appliedFilters.startDate} - {appliedFilters.endDate}
            </Text>
          </View>
        )}

      </View>
    </ScrollView>

    {/* RESET */}
    <TouchableOpacity onPress={handleResetFilters}>
      <Text style={styles.resetTextSmall}>Reset</Text>
    </TouchableOpacity>

  </View>
)}


    {BillDetails?.listInvoices?.map((item) => (
      <View key={item.invoiceId} style={styles.tenantRow}>
        <TouchableOpacity onPress={() => openBillDetails(item)}>
          <Image
            source={item.profilePic ? { uri: item.profilePic } : ProfileImage}
            style={styles.profileImg}
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.fullName}</Text>

          <View style={styles.detailRow}>
            <View style={styles.floorBadge}>
              <Text style={styles.floorText}>{item.invoiceType}-{item?.invoiceMode}</Text>
            </View>

            <Image source={Bills_Black_Icon} style={styles.iconSmall} />
            <Text style={styles.detailText}>#{item.invoiceNumber}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity ref={dotsRef}  onPress={(e) => openMenu(e, item)}>
            <Image
              source={Dots}
              style={{ width: 30, height: 30, transform: [{ rotate: "90deg" }] }}
            />
          </TouchableOpacity>

          <Text style={styles.dateText}>{item.invoiceDate}</Text>
        </View>
      </View>
    ))}
  </ScrollView>
) }

{( 
   !loading && BillDetails?.listInvoices && BillDetails.listInvoices.length === 0 &&
      <View style={styles.centerContainer}>
        <Image source={EmptyFloor} style={styles.image} />
        <Text style={styles.noFloorText}>No bills are there!</Text>

        <TouchableOpacity style={styles.addFloorBtn}>
          <Text style={styles.addFloorText}>+ Add Bill</Text>
        </TouchableOpacity>
      </View>
    )}

    {!loading && BillDetails?.listInvoices?.length > 0 && (
        <>
         <TouchableOpacity style={styles.FilterButton} onPress={() => setShowFilter(true)}>
      <Image source={FilterIcon} style={{ width: 30, height: 30 }} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.addBtn} onPress={handleCreateBill}>
      <Image source={AddIcon} style={{ width: 25, height: 25 }} />
    </TouchableOpacity>
        </>
    )
}
   

  </View>
)}


{activeTab === "RecurringBills" && (
   <RecurringBills />
  )}
  {activeTab === "Receipt" && (
   <Receipt onSelectReceipt={handleOpenReceiptSheet}  />
  )}
 
{showBillDetails && (
  <View style={styles.sheetOverlay}>

    <TouchableWithoutFeedback onPress={() => setShowBillDetails(false)}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>

    <Animated.View
      style={[
        styles.transactionSheet,
        { height: "50%", transform: [{ translateY: detailsSheetY }] }
      ]}
      {...billDetailsPan.panHandlers}
    >
      <View style={styles.sheetHandle} />

      {/* TOP HEADER TITLE */}
      

      <ScrollView showsVerticalScrollIndicator={false}>

  {/* HEADER ROW */}
  <View style={styles.billHeaderRow}>
    <Text style={styles.billHeaderText}>Bill Details</Text>


    <View style={{display:'flex', flexDirection:'row'}}>
    <View style={styles.statusBadge}>
      <Text style={styles.statusText}>Paid</Text>
    </View>

    <TouchableOpacity>
      <Image
        source={Dots}
        style={{ width: 28, height: 28,  }}
      />
    </TouchableOpacity>
    </View>
  </View>

  {/* USER SECTION */}
  <View style={styles.userRow}>
    <Image 
      source={
         selectedBill?.profilePic
           ? { uri: selectedBill.profilePic }
           : ProfileImage
       }
    style={styles.userImg} />

    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.userName}>{selectedBill?.fullName || "--"}</Text>

      <View style={{ flexDirection: "row", marginTop: 4 }}>
        <View style={styles.invTypeBadge}>
          <Text style={styles.invTypeText}>{selectedBill?.invoiceType}</Text>
        </View>
 
        <Image source={Bills_Black_Icon} style={{   width: 12,
    height: 12, marginTop:5 , marginRight:5
  }} />
        <Text style={styles.billNumber}>#{selectedBill?.invoiceNumber || "--"}</Text>
      </View>
    </View>
  </View>

  {/* DATES SECTION */}
  <View style={styles.twoColRow}>
    <View style={styles.colItem}>
      <Text style={styles.label}>Invoice date</Text>
      <View style={styles.rowAlign}>
        <Image source={CalendarBlueIcon} style={styles.iconSmall} />
        <Text style={styles.value}>{selectedBill?.invoiceDate}</Text>
      </View>
    </View>

    <View style={styles.colItem}>
      <Text style={styles.label}>Due date</Text>
      <View style={styles.rowAlign}>
        <Image source={CalendarBlueIcon} style={styles.iconSmall} />
        <Text style={styles.value}>{selectedBill?.dueDate}</Text>
      </View>
    </View>
  </View>

  {/* AMOUNT SECTION */}
  <View style={styles.twoColRow}>
    <View style={styles.colItem}>
      <Text style={styles.label}>Amount</Text>
      <View style={styles.rowAlign}>
            <Image source={MoneyCheckIcon} style={{   width: 18,
    height: 18, marginTop:5 , marginRight:5
  }} />
        <Text style={styles.amountValue}>₹{selectedBill?.invoiceAmount ?? "--"}</Text>
      </View>
    </View>

    <View style={styles.colItem}>
      <Text style={styles.label}>Due</Text>
      <View style={styles.rowAlign}>
           <Image source={DueIcon} style={{   width: 18,
    height: 18, marginTop:5 , marginRight:5
  }} />
        <Text style={styles.dueValue}>₹{selectedBill?.dueAmount ?? "--"}</Text>
      </View>
    </View>
  </View>

  {/* PREVIEW BUTTON */}
  <TouchableOpacity style={styles.previewBtn} onPress={handleShowBillPdf}>
    <View style={{display:'flex', flexDirection:'row'}}>
               <Image source={PreviewIcon} style={{   width: 18,
    height: 18, marginTop:3 , marginRight:12
  }} />
    <Text style={styles.previewText}>Preview</Text>
    </View>
  </TouchableOpacity>

</ScrollView>


    </Animated.View>
  </View>
)}

 {showReceiptDetails && (
          <View style={styles.sheetOverlay}>
        
            <TouchableWithoutFeedback onPress={() => setShowReceiptDetails(false)}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
        
            <Animated.View
              style={[
                styles.transactionSheet,
                { height: "58%", transform: [{ translateY: receiptdetailsSheetY }] }
              ]}
              {...receiptDetailsPan.panHandlers}
            >
              <View style={styles.sheetHandle} />
        
              
        
              <ScrollView showsVerticalScrollIndicator={false}>
        
          <View style={styles.billHeaderRow}>
            <Text style={styles.billHeaderText}>Bill Details</Text>
        
        
            <View style={{display:'flex', flexDirection:'row'}}>
            <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Paid</Text>
              </View>

        
            <TouchableOpacity>
              <Image
                source={Dots}
                style={{ width: 28, height: 28,  }}
              />
            </TouchableOpacity>
            </View>
          </View>
        
          <View style={styles.userRow}>
            <Image source={ProfileImage} style={styles.userImg} />
        
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.userName}>  {selectedReceipt?.fullName || "--"}</Text>
        
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <View style={styles.invTypeBadge}>
                  <Text style={styles.invTypeText}>Checkout Inv</Text>
                </View>
         
                <Image source={Bills_Black_Icon} style={{   width: 12,
            height: 12, marginTop:5 , marginRight:5
          }} />
                <Text style={styles.billNumber}>#1212121212</Text>
              </View>
            </View>
          </View>

        
        
          <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.label}>Payment date</Text>
              <View style={styles.rowAlign}>
                <Image source={CalendarBlueIcon} style={styles.iconSmall} />
                <Text style={styles.value}>  {formatApiDate(selectedReceipt?.paidAt)}</Text>
              </View>
            </View>
        
            <View style={styles.colItem}>
              <Text style={styles.label}>Payment Mode</Text>
              <View style={styles.rowAlign}>
                <Image source={Payment} style={styles.iconSmall} />
                <Text style={styles.value}> {selectedReceipt?.invoiceMode || "--"}</Text>
              </View>
            </View>
          </View>

           <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.label}>Payment to</Text>
              <View style={styles.rowAlign}>
                    <Image source={Payment} style={{   width: 18,
            height: 18, marginTop:5 , marginRight:5
          }} />
                <Text style={styles.amountValue}>  {selectedReceipt?.bankName || "--"}</Text>
              </View>
            </View>
             </View>
        
          <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.rowAlign}>
                    <Image source={MoneyCheckIcon} style={{   width: 18,
            height: 18, marginTop:5 , marginRight:5
          }} />
                <Text style={styles.amountValue}> ₹{selectedReceipt?.paidAmount ?? "--"}</Text>
              </View>
            </View>
             <View style={styles.colItem}>
              <Text style={styles.label}>Transaction Id</Text>
              <View style={styles.rowAlign}>
                    <Image source={Telegram} style={{   width: 18,
            height: 18, marginTop:2 , marginRight:5
          }} />
                <Text style={styles.amountValue}>{selectedReceipt?.transactionNumber || "--"}</Text>
              </View>
            </View>
        
          
          </View>
        
          <TouchableOpacity style={styles.previewBtn} onPress={handleShowReceiptPdf} >
            <View style={{display:'flex', flexDirection:'row'}}>
                       <Image source={PreviewIcon} style={{   width: 18,
            height: 18, marginTop:3 , marginRight:12
          }} />
            <Text style={styles.previewText}>Preview</Text>
            </View>
          </TouchableOpacity>
        
        </ScrollView>
        
        
            </Animated.View>
          </View>
        )}

 {showDetailModal && showDetailsMenu && (
  <>
    <TouchableOpacity
      style={styles.menuBackdrop}
      onPress={() => setShowDetailsMenu(false)}
    />

    <View
      style={[
        styles.popupBox,
        {
          top: popupPosition.y + popupPosition.h + 8,
          left:
            popupPosition.x + 200 > screenWidth
              ? popupPosition.x - 200 + popupPosition.w
              : popupPosition.x,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.popupRow}
        onPress={() => {
          setShowDetailsMenu(false);
          setShowReAssignBed(true);
        }}
      >
        <Image source={require("../../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
        <Text style={styles.popupText}>Re-Assign Bed</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.popupRow}
        onPress={() => {
          setShowDetailsMenu(false);
          setShowNotice(true);
        }}
      >
        <Image source={require("../../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
        <Text style={styles.popupText}>Move to Notice Period</Text>
      </TouchableOpacity>



   
    </View>
  </>
)}



    {/* <ReassignBedModal visible={showReAssignbed}  onClose={handlecloseReAssignbed} /> */}


{showMenu && (
  <TouchableOpacity
    activeOpacity={1}
    onPress={() => setShowMenu(false)}
    style={styles.popupOverlay}
  >
    <View
      style={[
        styles.popupBox,
        { top: popupPosition.y + 10, left: popupPosition.x - 180 },
      ]}
    >

   

      {/* <TouchableOpacity style={styles.popupRow} onPress={handleShowCancelNotice} >
        <Image
          source={require("../../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Download</Text> 
      </TouchableOpacity> */}

      <TouchableOpacity
  style={[
    styles.popupRow,
    isBillLocked && styles.popupRowDisabled,
  ]}
  disabled={isBillLocked}
  onPress={() => {
    setShowMenu(false);
    setDeleteTenants(true);
  }}
>
  <Image
    source={require("../../../Assets/Images/ReAssign.png")}
    style={styles.popupIcon}
  />
  <Text
    style={[
      styles.popupText,
      isBillLocked && styles.popupTextDisabled,
    ]}
  >
    Download
  </Text>
</TouchableOpacity>
     
        {selectedBill?.invoiceAmount < 0 && selectedBill?.paymentStatus !== "Refunded" && selectedBill?.paymentStatus !== "Cancelled" && (
        <TouchableOpacity style={styles.popupRow} onPress={handleShowRefundPayment} >
        <Image
          source={require("../../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Refund Amount</Text>
      </TouchableOpacity>
    )}
     
     
{ (selectedBill?.dueAmount !== 0 && selectedBill?.invoiceAmount > 0 && selectedBill?.paymentStatus !== "Cancelled" && selectedBill?.paymentStatus !== "Paid") &&(
    <TouchableOpacity style={styles.popupRow} onPress={handleShowRecordPayment} >
  <Image
    source={require("../../../Assets/Images/ReAssign.png")}
    style={styles.popupIcon}
  />
  <Text style={styles.popupText}>Record Payment</Text>
</TouchableOpacity>

      )}

<TouchableOpacity
  style={[
    styles.popupRow,
    isBillLocked && styles.popupRowDisabled,
  ]}
  disabled={isBillLocked}
  onPress={handleShowWriteOff}
>
  <Image
    source={require("../../../Assets/Images/ReAssign.png")}
    style={styles.popupIcon}
  />
  <Text
    style={[
      styles.popupText,
      isBillLocked && styles.popupTextDisabled,
    ]}
  >
    Write-off
  </Text>
</TouchableOpacity>


  {/* <TouchableOpacity style={styles.popupRow} onPress={handleShowWriteOff} >
        <Image
          source={require("../../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Write-off</Text>
      </TouchableOpacity> */}

      
                    { (selectedBill?.invoiceMode === "Recurring" && selectedBill?.paymentStatus === "Pending") &&( 
       <TouchableOpacity style={styles.popupRow} onPress={handleEditBill} >
        <Image
          source={require("../../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Edit</Text>
      </TouchableOpacity>
          )}


      <TouchableOpacity
  style={[
    styles.popupRow,
    isBillLocked && styles.popupRowDisabled,
  ]}
  disabled={isBillLocked}
  onPress={handleEditBill}
>
  <Image
    source={require("../../../Assets/Images/ReAssign.png")}
    style={styles.popupIcon}
  />
  <Text
    style={[
      styles.popupText,
      isBillLocked && styles.popupTextDisabled,
    ]}
  >
    Edit
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={[
    styles.popupRow,
    isBillLocked && styles.popupRowDisabled,
  ]}
  disabled={isBillLocked}
  onPress={() => {
    setShowMenu(false);
    setDeleteTenants(true);
  }}
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


 {/* <TouchableOpacity
  style={styles.popupRow}
  onPress={() => {
    setShowMenu(false);
    setDeleteTenants(true);
  }}
>
  <Image
    source={require("../../../Assets/Images/trash.png")}
    style={styles.popupIcon}
  />
  <Text style={styles.popupText}>Delete</Text>
</TouchableOpacity> */}
    </View>
  </TouchableOpacity>
)}

{showWriteOff && (
  <View style={styles.sheetOverlay}>

    {/* Close when tap outside */}
    <TouchableWithoutFeedback onPress={() => setShowWriteOff(false)}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>

    {/* Bottom Sheet */}
    <Animated.View
      style={[
        styles.transactionSheet,
        { height: "55%", transform: [{ translateY: writeoffSheetY }] }
      ]}
      {...writeoffPan.panHandlers}
    >
      <View style={styles.sheetHandle} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* WRITE OFF TITLE */}
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
          Write off
        </Text>

        <Text style={{ color: "#777", lineHeight: 20, marginBottom: 18 }}>
          Use when tenant has absconded and all pending dues 
          must be written off.
        </Text>

        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <Image source={ProfileImage} style={{ width: 55, height: 55, borderRadius: 28 }} />

          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#000" }}>
              Daniel Balaji R
            </Text>

            <View style={{ flexDirection: "row", marginTop: 4, alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "#FFE6C7",
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 6,
                  marginRight: 7,
                }}
              >
                <Text style={{ color: "#C67506", fontSize: 11, fontWeight: "600" }}>
                  Checkout Inv
                </Text>
              </View>

              <Image
                source={Bills_Black_Icon}
                style={{ width: 12, height: 12, marginRight: 5 }}
              />

              <Text style={{ fontSize: 11, color: "#444" }}>#1212121212</Text>
            </View>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <View style={{display:'flex', flexDirection:'row'}}>
            <Image  source={WriteOffDueIcon} style={{height:12, width:12 , marginTop:4, marginRight:4}}/>
            <Text style={{ color: "#1E45E1", fontWeight: "700", marginBottom: 4 }}>
              Due Pending
            </Text>
            </View>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#000" }}>
              ₹ 2,200.00
            </Text>
          </View>
        </View>

        {/* COMMENT BOX */}
        <Text style={{ marginBottom: 6, fontWeight: "600", color: "#444" }}>
          Reason (Comments)
        </Text>

        <TextInput
          placeholder="Enter reason here"
          multiline={true}
          style={{
            borderWidth: 1,
            borderColor: "#D9D9D9",
            padding: 14,
            borderRadius: 12,
            minHeight: 110,
            textAlignVertical: "top",
            fontSize: 15,
          }}
          value={writeOffReason}
          onChangeText={setWriteOffReason}
        />

        {/* BOTTOM BUTTONS */}
         <View style={styles.btnRow}>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
            
                      <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={() => {
                          navigation.goBack();
                        }}
                      >
                        <Text style={styles.saveText}> Confirm</Text>
                      </TouchableOpacity>
                    </View>
      </ScrollView>
    </Animated.View>
  </View>
)}


{showRecordPayment && selectedBill && (
  <View style={styles.sheetOverlay}>

    {/* Close on tap outside */}
    <TouchableWithoutFeedback onPress={() => setShowRecordPayment(false)}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>

    <Animated.View
      style={[
        styles.transactionSheet,
        { height: "75%", transform: [{ translateY: recordSheetY }] }
      ]}
      {...recordPan.panHandlers}
    >
      <View style={styles.sheetHandle} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
          Record Payment
        </Text>

        {/* USER INFO */}
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <Image
            source={ProfileImage}
            style={{ width: 55, height: 55, borderRadius: 28 }}
          />

          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#000" }}>
              {selectedBill?.fullName || "-"}
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
                <Text style={{ color: "#C67506", fontWeight: "600", fontSize: 12 }}>
                 {selectedBill?.invoiceType || "-"}
                </Text>
              </View>

              <Image source={Bills_Black_Icon} style={{ width: 12, height: 12, marginTop: 3, marginRight: 5 }} />
              <Text style={{ fontSize: 13, color: "#555" }}> #{selectedBill?.invoiceNumber || "-"}</Text>
            </View>
          </View>
        </View>

        {/* DUE AMOUNT */}
        <Text style={styles.label}>Due Amount</Text>
       <TextInput
  style={[
    styles.input,
    { backgroundColor: "#EFF2FF", color: "grey" }
  ]}
  value={`₹ ${selectedBill?.dueAmount || 0}`}
  editable={false}   
/>

        {/* PAID AMOUNT */}
        <Text style={styles.label}>Paid Amount</Text>
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



        

         <Text style={styles.label}>Balance Amount</Text>
        <TextInput
           style={[styles.input, { backgroundColor: "#EFF2FF", color: "grey" }]}
           value={`₹ ${balanceAmount}`}
           editable={false}
        />

        {/* PAID DATE */}
       <Text style={styles.label}>
  Paid Date <Text style={{ color: "red" }}>*</Text>
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

<Modal
  visible={openPaidDate}
  transparent
  animationType="fade"
  onRequestClose={() => setOpenPaidDate(false)}
>
  <TouchableWithoutFeedback onPress={() => setOpenPaidDate(false)}>
    <View style={styles.dateModalOverlay}>
      <TouchableWithoutFeedback>
        <View style={styles.dateModalBox}>
          <DatePicker
            mode="single"
            date={paidDate || new Date()}
            onChange={(v) => {
              const selected = v.date;
              if (!selected) return;

              const invoiceDate = selectedBill?.invoiceDate
                ? dayjs(selectedBill.invoiceDate, "DD/MM/YYYY").startOf("day")
                : null;

              const pickedDate = dayjs(selected).startOf("day");
              const today = dayjs().startOf("day");

              if (invoiceDate && pickedDate.isBefore(invoiceDate)) {
                setDateError("Paid date should not be before Bill date");
                return;
              }

              if (pickedDate.isAfter(today)) {
                setDateError("Paid date cannot be a future date");
                return;
              }

              setDateError("");
              setPaidDate(selected);
              setOpenPaidDate(false);
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>

{/* {dateError ? (
  <Text style={{ color: "red", marginTop: 4, fontSize: 13 }}>
    {dateError}
  </Text>
) : null} */}



      <Text style={styles.label}>
  Transaction Mode <Text style={{ color: "red" }}>*</Text>
</Text>

<TouchableOpacity
  style={styles.inputBox}
  onPress={() => {
    setModeError("");
    setShowPaymentMode((v) => !v);
  }}
>
  <Text style={{ fontSize: 15 }}>
    {selectedMode
      ? transactionOptions.find(o => o.value === selectedMode)?.label
      : "Select mode"}
  </Text>

  <Image
    source={DownArrow}
    style={{ width: 18, height: 18, tintColor: "#555" }}
  />
</TouchableOpacity>



{showPaymentMode && (
  <View style={styles.transactiondropdown}>
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.dropdownContent} 
    >
      {transactionOptions.length > 0 ? (
        transactionOptions.map((opt) => {
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
        })
      ) : (
        <Text style={{ padding: 12, color: "#777" }}>
          No accounts available
        </Text>
      )}
    </ScrollView>
  </View>
)}

 {modeError && (
                    <ErrorMessage message={modeError} type="error" />
                                )}





        {/* Buttons */}
          <View style={styles.btnRow}>
                      <TouchableOpacity style={styles.cancelBtn} >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
            
                      <TouchableOpacity
                        style={styles.saveBtn}
                       onPress={handleSaveRecordPayment}
                      >
                        <Text style={styles.saveText}>Record</Text>
                      </TouchableOpacity>
                    </View>
      </ScrollView>
    </Animated.View>
  </View>
)}


{showRefundPayment && (
  <View style={styles.sheetOverlay}>
    <TouchableWithoutFeedback onPress={() => setShowRefundPayment(false)}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>

    <Animated.View
      style={[
        styles.transactionSheet,
        { height: "93%", transform: [{ translateY: refundSheetY }] }
      ]}
      {...refundPan.panHandlers}
    >
      <View style={styles.sheetHandle} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* TITLE */}
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
          Refund Payment
        </Text>

        {/* USER SECTION */}
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <Image
            source={ProfileImage}
            style={{ width: 55, height: 55, borderRadius: 30 }}
          />

          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#000" }}>
               {selectedBill?.fullName || "-"}
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
                <Text style={{ color: "#C67506", fontSize: 11, fontWeight: "600" }}>
                 {selectedBill?.invoiceType || "-"}
                </Text>
              </View>

              <Image
                source={Bills_Black_Icon}
                style={{ width: 12, height: 12, marginTop: 3, marginRight: 5 }}
              />
              <Text style={{ fontSize: 11, color: "#555" }}>#{selectedBill?.invoiceNumber}</Text>
            </View>
          </View>

          {/* RIGHT SIDE REFUND AMOUNT */}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: "#444", fontSize: 13 }}>Refund Amount</Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000" }}>
              ₹ {refundInitDetails?.pendingRefund || 0}
            </Text>
          </View>
        </View>

        {/* REFUND AMOUNT */}
        <Text style={styles.label}>
          Refund amount <Text style={{ color: "red" , fontSize:16}}>*</Text>
        </Text>
   <TextInput
  style={styles.input}
  placeholder="₹ 0.00"
  keyboardType="numeric"
  value={refundAmount}
  onChangeText={(val) => {
    let num = Number(val);
    if (isNaN(num)) num = 0;

    const max = refundInitDetails?.refundableAmount || 0;

    // ❌ block more than refundable
    if (num > max) num = max;

    setRefundAmount(String(num));
    setRefundBalance(max - num);  
    setRefundAmountError("") 
  }}
/>


 {refundAmountError && (
                    <ErrorMessage message={refundAmountError} type="error" />
                                )}





        {/* BALANCE DUE */}
       <Text style={styles.label}>Balance Due <Text style={{ color: "red" , fontSize:16}}>*</Text></Text>
<View style={styles.inputBox}>
 <Text style={{ fontSize: 16 }}>
    ₹ {refundBalance}
  </Text>
</View>


        {/* REFUND DATE */}
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

{/* ERROR MESSAGE */}


 {refundDateError && (
                    <ErrorMessage message={refundDateError} type="error" />
                                )}



 <Modal
  visible={openRefundDate}
  transparent
  animationType="fade"
  onRequestClose={() => setOpenRefundDate(false)}
>
  {/* OUTSIDE TAP CLOSE */}
  <TouchableWithoutFeedback onPress={() => setOpenRefundDate(false)}>
    <View style={styles.dateModalOverlay}>
      
      {/* PREVENT CLOSE WHEN CLICKING INSIDE */}
      <TouchableWithoutFeedback>
        <View style={styles.dateModalBox}>
 <DatePicker
  mode="single"
  date={refundDate || new Date()}
  onChange={(v) => {
    if (!v?.date) return;

    const pickedDate = normalizeDate(v.date);
    if (!pickedDate) return;

    const invoiceDate = normalizeDate(selectedBill?.invoiceDate);
    const today = dayjs().startOf("day");

    console.log(
      "Invoice:",
      invoiceDate?.format("DD/MM/YYYY"),
      "Selected:",
      pickedDate.format("DD/MM/YYYY")
    );

    // ❌ BEFORE INVOICE DATE
    if (invoiceDate && pickedDate.isBefore(invoiceDate)) {
      setRefundDateError("Refund date should not be before Invoice date");
      return;
    }

    // ❌ FUTURE DATE
    if (pickedDate.isAfter(today)) {
      setRefundDateError("Refund date cannot be a future date");
      return;
    }

    // ✅ VALID
    setRefundDate(pickedDate.toDate());
    setRefundDateError("");
    setOpenRefundDate(false);
  }}
/>







        </View>
      </TouchableWithoutFeedback>

    </View>
  </TouchableWithoutFeedback>
</Modal>


        {/* REFUND FROM */}
        <Text style={styles.label}>Refund From <Text style={{ color: "red" , fontSize:16}}>*</Text></Text>

<TouchableOpacity
  style={styles.inputBox}
  onPress={() => setShowRefundFrom((v) => !v)}
>
  <Text style={{ fontSize: 15 }}>
    {refundFrom
      ? refundBankOptions.find(o => o.value === refundFrom)?.label
      : "Select bank"}
  </Text>

  <Image source={DownArrow} style={{ width: 18, height: 18 }} />
</TouchableOpacity>


       {showRefundFrom && (
  <View style={styles.transactiondropdown}>
    <ScrollView>
      {refundBankOptions.length > 0 ? (
        refundBankOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={{ padding: 12 }}
            onPress={() => {
              setRefundFrom(opt.value);   
              setShowRefundFrom(false);
              setRefundFromError("")
            }}
          >
            <Text style={{ fontSize: 15 }}>{opt.label}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ padding: 12, color: "#777" }}>
          No banks available
        </Text>
      )}
    </ScrollView>
  </View>
)}



 {refundFromError && (
                    <ErrorMessage message={refundFromError} type="error" />
                                )}



      

        {/* TRANSACTION ID */}
        <Text style={styles.label}>Transaction ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter transaction ID"
          keyboardType="numeric"
          value={transactionId}
          onChangeText={setTransactionId}
        />

        {/* BUTTON ROW */}
        <View style={styles.btnRow}>
                      <TouchableOpacity style={styles.cancelBtn} >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
            
                      <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={handleSaveRefund}
                      >
                        <Text style={styles.saveText}>Record</Text>
                      </TouchableOpacity>
                    </View>


      </ScrollView>
    </Animated.View>
  </View>
)}




{showFilter && (
      <View style={styles.sheetOverlay}>
    <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>

    <Animated.View
      style={[styles.transactionSheet, { transform: [{ translateY: detailsY }] }]}
      {...detailsfilter.panHandlers}
    >
      <View style={styles.sheetHandle} />
     
                 <View style={styles.filterHeaderRow}>
                   <View style={{ flexDirection: "row", alignItems: "center" }}>
                     <Image source={FilterIcon} style={{ width: 30, height: 30 }} />
                     <Text style={styles.filterTitle}>  Filter by</Text>
                   </View>
                 </View>
     
                 <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                   <Text style={styles.label}>Date Range</Text>
                   <TouchableOpacity
                     onPress={() => {
                       setFromDate(null);
                       setToDate(null);
                       setFilterError("")
                     }}
                   >
                     <Text style={styles.resetTextSmall}>Reset</Text>
                   </TouchableOpacity>
                 </View>
     
                 <View style={styles.dateRow}>
                   <TouchableOpacity style={styles.dateBox} onPress={() => setOpenFrom(true)}>
                     <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
                     <Image source={CalendarIcon} style={styles.calIcon} />
                   </TouchableOpacity>
     
                   <TouchableOpacity style={styles.dateBox} onPress={() => setOpenTo(true)}>
                     <Text style={styles.dateText}>{formatDate(toDate)}</Text>
                     <Image source={CalendarIcon} style={styles.calIcon} />
                   </TouchableOpacity>
                 </View>
                     
     
                 <View style={styles.quickRow}>
                   <TouchableOpacity style={styles.quickBtn} onPress={() => { setFromDate(dayjs()); setToDate(dayjs()); }}>
                     <Text style={styles.quickText}>This Month</Text>
                   </TouchableOpacity>
     
                   <TouchableOpacity style={styles.quickBtn} onPress={() => { setFromDate(dayjs().startOf("week")); setToDate(dayjs().endOf("week")); }}>
                     <Text style={styles.quickText}>Last Month</Text>
                   </TouchableOpacity>
     
                   <TouchableOpacity style={styles.quickBtn} onPress={() => { setFromDate(dayjs().startOf("month")); setToDate(dayjs().endOf("month")); }}>
                     <Text style={styles.quickText}>Last 3 Months</Text>
                   </TouchableOpacity>
                 </View>

   <MultiSelectDropdown
  label="Bill Status"
  placeholder="Select Bill Status"
  options={billStatusOptions}
  selected={billStatus}
  onChange={(values) => {
    setBillStatus(values);
    setFilterError("");  
  }}
/>

<MultiSelectDropdown
  label="Type"
  placeholder="Select Type"
  options={typeOptions}
  selected={type}
  onChange={(values) => {
    setType(values);
    setFilterError("");  
  }}
/>


<MultiSelectDropdown
  label="Mode"
  placeholder="Select Mode"
  options={modeOptions}
  selected={mode}
   onChange={(values) => {
    setMode(values);
    setFilterError("");  
  }}
/>


<MultiSelectDropdown
  label="Created By"
  placeholder="Select User"
  options={createdByOptions}
  selected={createdBy}
   onChange={(values) => {
    setCreatedBy(values);
    setFilterError("");  
  }}
/>


{/* <MultiSelectDropdown
  label="Period"
  placeholder="Select Period"
  options={["This Month", "Last Month", "Last 3 Months"]}
/> */}
     
      {filterError && (
                    <ErrorMessage message={filterError} type="error" />
                                )}
                
     
                 <View style={styles.bottomButtons}>
                   <TouchableOpacity style={styles.resetBtn}
                      onPress={() => {
                       setFromDate(null);
                       setToDate(null);
                       setCreatedBy([]);
                       setBillStatus([]);
                       setType([]);
                       setMode([]);
                       setFilterError("")
                     }}
                   >
                     <Text style={styles.resetBtnText}>Reset All</Text>
                   </TouchableOpacity>
     
                   <TouchableOpacity style={styles.applyBtn} onPress={handleApplyFilter}>
                     <Text style={styles.applyBtnText}>Apply</Text>
                   </TouchableOpacity>
                 </View>
    </Animated.View>
  </View>
      )}

<Modal
  transparent
  visible={openFrom}
  animationType="fade"
  onRequestClose={() => setOpenFrom(false)}
>
  <View style={styles.datePickerOverlay}>
    <TouchableOpacity
      style={styles.outsideTouch}
      activeOpacity={1}
      onPress={() => setOpenFrom(false)}
    />
    <View style={styles.datePickerBox}>
      <TouchableWithoutFeedback>
        <View>
          <DatePicker
  mode="single"
  date={fromDate ? dayjs(fromDate) : dayjs()}
  onChange={(d) => {
    setFromDate(d.date);
    setOpenFrom(false);
    setFilterError("")
  }}
/>

        </View>
      </TouchableWithoutFeedback>
    </View>

  </View>
</Modal>


<Modal
  transparent
  visible={openTo}
  animationType="fade"
  onRequestClose={() => setOpenTo(false)}
>
  <View style={styles.datePickerOverlay}>
    
    <TouchableOpacity
      style={styles.outsideTouch}
      activeOpacity={1}
      onPress={() => setOpenTo(false)}
    />

    <View style={styles.datePickerBox}>
      <TouchableWithoutFeedback>
        <View>
         <DatePicker
  mode="single"
  date={toDate ? dayjs(toDate) : dayjs()}
  onChange={(d) => {
    setToDate(d.date);
    setOpenTo(false);
    setFilterError("")
  }}
/>

        </View>
      </TouchableWithoutFeedback>
    </View>

  </View>
</Modal>


{deleteTenants && (
  <Modal
    transparent
    animationType="fade"
    visible={deleteTenants}
    onRequestClose={() => setDeleteTenants(false)}
  >
    <View style={styles.deleteOverlay}>
      <View style={styles.deleteBox}>

        <Text style={styles.deleteTitle}>Delete Bill?</Text>
        <Text style={styles.deleteSub}>
          Are you sure you want to delete this Bill?
        </Text>

        <View style={styles.deleteBtnRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setDeleteTenants(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              console.log("DELETE CONFIRMED");
              setDeleteTenants(false);
            }}
          >
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  </Modal>
)}



{/* {showNotice && (
  <MoveNoticeModal
    visible={showNotice}
    onClose={() => setShowNotice(false)}
    tenant={selectedCustomer}
    requestDate={reqDate}
    checkoutDate={outDate}
    reason={reason}
    setRequestDate={setReqDate}
    setCheckoutDate={setOutDate}
    setReason={setReason}
    onMove={() => console.log("Move Clicked")}
  />
)} */}


      
    </SafeAreaView>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical:50
  },
searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F5F6FA",
  borderRadius: 10,
  paddingHorizontal: 12,
  height: 55,
  flex: 1,       
},

  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
 
backIcon: {
  width: 22,
  height: 22,
  marginRight: 12,
  tintColor: "#222",
},

  outsideTouch: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
tabContainer: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 14,
  borderBottomWidth: 1,
  borderBottomColor: "#E5E7EB",
  paddingBottom: 6,
},
// dropdownMenu: {
//   backgroundColor: "#fff",
//   borderRadius: 10,
//   marginTop: 5,
//   borderWidth: 1,
//   borderColor: "#E5E7EB",
//   overflow: "hidden",
//   elevation: 5,
// },
dropdownMenu: {
  position: "absolute",
  top: 52,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  elevation: 7,
  zIndex: 9999,
  maxHeight: 150,    
  overflow: "hidden", 
},
menuBackdrop: {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "transparent",
  zIndex: 9999
},

datePickerOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},

datePickerBox: {
  width: "90%",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 12,
  elevation: 10,
  zIndex: 999,
},



calIcon: { width: 20, height: 20 },






dropdownItem: {
  paddingVertical: 12,
  paddingHorizontal: 12,
},

dropdownItemText: {
  fontSize: 14,
  color: "#111",
},


tab: {
  alignItems: "center",
  paddingBottom: 6,
},

activeTab: {
  borderBottomWidth: 2,
  borderBottomColor: "#2D6CDF",
},

tabContent: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6, 
},

tabIcon: {
  width: 25,
  height: 25,
  resizeMode: "contain",
},

tabText: {
  fontSize: 16,
  color: "#6B7280",
},

activeText: {
  color: "#2D6CDF",
  fontWeight: "600",
},

  sectionTitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginVertical: 10,
  },
  tenantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  profileImg: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  floorBadge: {
    backgroundColor: "#FFEFCF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  floorText: {
    fontSize: 11,
    color: "black",
    fontWeight: "500",
  },
  iconSmall: {
    width: 12,
    height: 12,
    marginHorizontal: 3,
  },
  detailText: {
    fontSize: 10,
    color: "#4B5563",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 3,
  },
  dots: {
    fontSize: 22,
    color: "#6B7280",
  },
//   addButton: {
//     position: "absolute",
//     right: 10,
//     bottom: 50,
//   },
   FilterButton: {
   position: "absolute",
    bottom: 120,
    right: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },

   addBtn: {
    position: "absolute",
    bottom: 50,
    right: 10,
    backgroundColor: "#1D5DFF",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  modalOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "flex-end",
},

bottomSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  height: "55%",
},

modalHandle: {
  width: 60,
  height: 4,
  backgroundColor: "#ccc",
  alignSelf: "center",
  borderRadius: 100,
  marginBottom: 15,
},

modalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},

modalTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#111",
},

modalProfileRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
},

modalProfileImg: {
  width: 55,
  height: 55,
  borderRadius: 30,
},

modalName: {
  fontSize: 17,
  fontWeight: "600",
  color: "#111",
},

infoLabel: {
  marginTop: 15,
  fontSize: 13,
  color: "#6B7280",
},

infoValue: {
  fontSize: 14,
  color: "#111",
  marginTop: 3,
},

unassignBtn: {
  borderWidth: 1,
  borderColor: "#111",
  borderRadius: 15,
  marginTop: 25,
  paddingVertical: 12,
  alignItems: "center",
},

unassignText: {
  fontSize: 15,
  fontWeight: "600",
},
popupOverlay: {
  position: "absolute",
  top: 10,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "transparent",
},

popupBox: {
  position: "absolute",
  width: 200,
  backgroundColor: "#fff",
  borderRadius: 12,
  elevation: 20,
  paddingVertical: 10,
  zIndex: 10000,
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
},

 popupTextDisabled: {
    color: "#9CA3AF", 
  },

filterOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
},

filterSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
},

filterHandle: {
  width: 60,
  height: 4,
  backgroundColor: "#ccc",
  alignSelf: "center",
  borderRadius: 50,
  marginBottom: 20,
},

filterHeader: {
  flexDirection: "row",
  justifyContent: "flex-start",
  marginBottom: 20,
},

filterTitle: {
  fontSize: 18,
  fontWeight: "700",
},

label: {
  fontSize: 13,
  color: "#6B7280",
  marginBottom: 6,
  marginTop: 10,
},

dropdownBox: {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  padding: 12,
  borderRadius: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

dropdownText: {
  color: "#111",
  fontSize: 15,
},
transactiondropdown: {
  minHeight: 130,       
  maxHeight: 130,        
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E6E6E6",
  backgroundColor: "#fff",
  marginTop: 5,
  overflow: "hidden",
  ...Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    android: { elevation: 3 },
  }),
},

dropdownContent: {
  minHeight: 130,   
  maxHeight:130
},

dropdownRow: {
  paddingVertical: 12,
  paddingHorizontal: 14,
},

dropdownRowSelected: {
  backgroundColor: "#1E45E1", 
},

dropdownText: {
  color: "#111",
  fontSize: 15,
},

dropdownTextSelected: {
  color: "#fff", // 👈 WHITE
  fontSize: 15,
  fontWeight: "600",
},


arrow: { fontSize: 18, color: "#555" },

dateRow: { flexDirection: "row", marginTop: 10 },


dateBox: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  padding: 14,
  borderRadius: 10,
  marginTop: 6,
  backgroundColor: "#fff",
},



quickRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 20,
},

quickBtn: {
  backgroundColor: "#F8F9FA",
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 10,
},

quickText: { color: "#111", fontWeight: "500" },

bottomButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 25,
  marginBottom: 5
},

resetBtn: {
  backgroundColor: "#F2F3FF",
  paddingVertical: 12,
  borderRadius: 10,
  width: "48%",
  alignItems: "center",
},

resetText: {
  color: "#2D6CDF",
  fontWeight: "600",
},

applyBtn: {
  backgroundColor: "#2D6CDF",
  paddingVertical: 12,
  borderRadius: 10,
  width: "48%",
  alignItems: "center",
},

applyText: {
  color: "#fff",
  fontWeight: "600",
},



deleteOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},

deleteBox: {
  width: "90%",
  backgroundColor: "#fff",
  padding: 25,
  borderRadius: 15,
  alignItems: "center",
  elevation: 10,
  gap:10
},

deleteTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#111",
  marginBottom: 10,
},

deleteSub: {
  fontSize: 14,
  color: "#555",
  textAlign: "center",
  marginBottom: 25,
},

deleteBtnRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
},

cancelBtn: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#2D6CDF",
  alignItems: "center",
  marginRight: 30,
},


cancelText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#2D6CDF",
},

deleteBtn: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 10,
  backgroundColor: "#2D6CDF",
  alignItems: "center",
  marginLeft: 10,
},


deleteBtnText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#fff",
},



  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 250,
    height: 180,
    resizeMode: "contain",
    opacity: 0.9,
  },

  noFloorText: {
    fontSize: 16,
    color: "#777",
    marginTop: 10,
  },

  addFloorBtn: {
    marginTop: 20,
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },

  addFloorText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
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

transactionSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  paddingBottom: 30,
  minHeight: 400,
},

sheetHandle: {
  width: 60,
  height: 5,
  backgroundColor: "#ccc",
  alignSelf: "center",
  borderRadius: 30,
  marginBottom: 15,
},

sheetTitle: {
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 20,
},
downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },

  dropdownMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    elevation: 15,
    zIndex: 1000,
    paddingVertical: 8,
    height: 100
  },
  filterSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: "55%",             // ⭐ increase height here
  }, filterHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

 filterTitle: { fontSize: 20, fontWeight: "700" },
  resetTextSmall: { color: "#2D6CDF", fontWeight: "600" , marginLeft:10 },

  dateRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  dateBox: { width: "48%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 12 },
  dateText: { color: "#111" },
  calIcon: { width: 20, height: 20 },

  selectWrapper: { position: "relative", width: "100%", marginTop: 8 },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 50,   // 🔥 consistent height
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  selectedText: { fontSize: 15, color: "#000", flex: 1 },
  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  quickBtn: { width: "32%", paddingVertical: 12, borderRadius: 12, backgroundColor: "#F5F6FA", alignItems: "center" },
  quickText: { color: "#111", fontWeight: "600" },
//  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 72 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontWeight: "700" },
  applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontWeight: "700" },
billHeaderRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
  paddingHorizontal: 5,
},

billHeaderText: {
  fontSize: 20,
  fontWeight: "700",
  color: "#000",
},

statusBadge: {
  backgroundColor: "#D7FFD7",
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderRadius: 20,
},

statusText: {
  color: "#2E8B2E",
  fontWeight: "700",
  fontSize: 13,
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
  fontWeight: "700",
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
  fontWeight: "600",
  fontSize: 12,
},

billNumber: {
  color: "#555",
  fontSize: 13,
  alignSelf: "center",
},

twoColRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 25,
},

colItem: {
  width: "48%",
},

label: {
  color: "#777",
  fontSize: 14,
  marginBottom: 5,
},

rowAlign: {
  flexDirection: "row",
  alignItems: "center",
},

iconSmall: {
  width: 18,
  height: 18,
  marginRight: 6,
},

value: {
  fontSize: 16,
  fontWeight: "600",
  color: "#000",
},

amountValue: {
  fontSize: 16,
  fontWeight: "700",
  color: "#000",
},

dueValue: {
  fontSize: 16,
  fontWeight: "700",
  color: "red",
},

previewBtn: {
  backgroundColor: "#1E45E1",
  paddingVertical: 14,
  borderRadius: 12,
  marginTop: 39,
  alignItems: "center",
},

previewText: {
  color: "#fff",
  fontSize: 16,
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
    fontWeight: "600",
  },
inputBox: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
 input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 12,
  },
//   dateModalOverlay: {
//   flex: 1,
//   backgroundColor: "rgba(0,0,0,0.4)",
//   justifyContent: "center",
//   alignItems: "center",
// },

// dateModalBox: {
//   backgroundColor: "#fff",
//   borderRadius: 12,
//   padding: 16,
//   width: "90%",
// },

dateModalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},

dateModalBox: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 16,
  width: "90%",
},

chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F4F7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 13,
    marginRight: 6,
  },

});
