import React, { useState, useRef, useEffect, useContext } from "react";
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
  Modal, Animated,
  PanResponder,
  BackHandler, Keyboard
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { NativeModules } from "react-native";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { BankingContext } from "../../../Context/BankingContext";
import { PGContext } from "../../../Context/PGContext";
import { Calendar } from "react-native-calendars";
import { useHasPermission } from "../../../Utils/useHasPermission";
import ReactNativeBlobUtil from "react-native-blob-util";
import Share from "react-native-share";
import Loader from "../../../Component/Loader/Loader"
import SmLoader from "../../../Component/Loader/SmartStayLoader"
// import CatLoader from "../../../Component/Loader/CatLoader"
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import MultiSelectDropdown from "./MultiSelectDropdown"
import SuccessModal from "../../../ToastFile/ToastPage";
import PaymentIcon from "../../../Assets/Images/RecordPayIcon.png";
import Profile from "../../../Assets/Images/profile.png";
import FilterIcon from "../../../Assets/Images/filter.png";
import SearchIcon from "../../../Assets/Images/Asset_search.png";
import InProfile from "../../../Assets/Images/inActiveuser.png";
import ActiveCheckout from "../../../Assets/Images/Active_checkout.png";
import CheckoutIcon from "../../../Assets/Images/checkout.png";
import ActiveWalkin from "../../../Assets/Images/ActiveWalkin.png";
import WalkinIcon from "../../../Assets/Images/walkin.png";
import RefundedIcon from "../../../Assets/Images/CancelledIcon.png";
import WhatsappIcon from "../../../Assets/Images/whatsapp_blue.png";
import WhatsappGreenIcon from "../../../Assets/Images/whatsapp.png";
import PlusIcon from "../../../Assets/Images/add.png";
import ShareIcon from "../../../Assets/Images/share.png";
// import TenAntAdd from "../../../Assets/Images/TenantAdd.png";
import AddIcon from "../../../Assets/Images/add-circle.png";
import Dots from "../../../Assets/Images/3dots.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
// import MoveNoticeModal from '../Customer/MoveToNoticePeriod';
// import ReassignBedModal from '../Customer/ReAssignBed';
// import CheckoutList from '../Customer/Checkout/CheckoutList';
import DownloadIcon from "../../../Assets/Images/download.png";
import DeleteIcon from "../../../Assets/Images/trash.png"
import EditIcon from "../../../Assets/Images/editIcon.png"
import Telegram from "../../../Assets/Images/telegram.png";
import Payment from "../../../Assets/Images/payment.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import RecurringBills from "./RecurringBills"
import Receipt from './Receipt'
import Bookings from "./Bill_Bookings"
import Call from "../../../Assets/Images/call.png";
import Sms from "../../../Assets/Images/sms.png";
import dateImg from "../../../Assets/Images/home-link.png";
import room from "../../../Assets/Images/PG_active.png";
import Bed from "../../../Assets/Images/bed.png";
import Bills_Black_Icon from "../../../Assets/Images/Bills_Black_Icon.png";
import EmptyFloor from "../../../Assets/Images/Empty_state.png"

import ArrowUp from "../../../Assets/Images/arrow-up.png";
import ArrowDown from "../../../Assets/Images/arrow-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import CalendarBlueIcon from "../../../Assets/Images/calendar_blue.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import ProfileImage from "../../../Assets/Images/Avatar.png";
import DueIcon from "../../../Assets/Images/Due_Icon.png";
import MoneyCheckIcon from "../../../Assets/Images/money_check.png";
import PreviewIcon from "../../../Assets/Images/Preview_icon.png";
import WriteOffDueIcon from "../../../Assets/Images/writeoff_due_icon.png";
import PaidIcon from "../../../Assets/Images/tick-circle.png"
import PartiallypaidIcon from "../../../Assets/Images/Orange_tick.png"
import TickIcon from "../../../Assets/Images/check.png";
import { Dimensions } from "react-native";
import BillBookings from "./Bill_Bookings";
import { s, vs } from "../../../Utils/rnScale";








export default function BillsDesign({ route }) {

  const insets = useSafeAreaInsets();
  //  const { CommonModule } = NativeModules;

  const detailDotsRef = useRef(null);

  const { BillDetails, loading, GetAllBillDetails,
    RecordPayment, GetInitializeRefundDetails, CreateRefund, refundError
    , GetRecurringBills, recurringBills, BillPdfdetails, getBillsPdfDetails, getReceiptPdfDetails, downloadReceipt, DeleteReceipt,
    downloadBill, shareBillOnWhatsapp, shareReceiptOnWhatsapp ,GetReceiptsList, receiptsList} = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);
  const { bankList, getBankListByHostel } = useContext(BankingContext)
    const { getParticularHostelDetails, PGDetails } = useContext(PGContext);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [showPayments, setShowPayments] = useState(false);


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


  console.log("bills", BillDetails, filterOptions);
  console.log("PGDetails", PGDetails);


  const [activeTab, setActiveTab] = useState("Invoices");
  const navigation = useNavigation();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refundInitDetails, setRefundInitDetails] = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);

  const [refundAmountError, setRefundAmountError] = useState("");
  const [refundFromError, setRefundFromError] = useState("");
  const [searchText, setSearchText] = useState("");


  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selecetedTenantReceipt, setSelectedTenantReceipt] = useState(null)
  const [showReAssignbed, setShowReAssignBed] = useState(false)
  const [showNotice, setShowNotice] = useState(false);
  const [reqDate, setReqDate] = useState("31/07/2025");
  const [outDate, setOutDate] = useState("30/08/2025");
  const [reason, setReason] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showReceiptMenu, setShowReceiptMenu] = useState(false)
  const [deleteReceipt, setDeleteReceipt] = useState(false)
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDetailsMenu, setShowDetailsMenu] = useState(false);
  const [deleteTenants, setDeleteTenants] = useState(false)
  const [showWriteOff, setShowWriteOff] = useState(false);
  const [writeOffReason, setWriteOffReason] = useState("");

  const [showReceiptDetails, setShowReceiptDetails] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedReceiptFullDetail, setSelectedReceiptFull] = useState(null)




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


  const [billStatus, setBillStatus] = useState([]);
  const [type, setType] = useState([]);
  const [mode, setMode] = useState([]);
  const [createdBy, setCreatedBy] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [filterError, setFilterError] = useState("");


  const [showRecuringBillDetail,setShowRecuringBillDetail]=useState(false)
  const [selectedRecurringBill,setSelectedRecurringBill]=useState("")


  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const isBillLocked = true;

  const { CommonModule } = NativeModules;



  // useEffect(() => {
  //   GetAllBillDetails(activeHostelId);
  // }, [activeHostelId])

  useEffect(() => {
    if (activeHostelId && canReadInvoice) {
      GetAllBillDetails(activeHostelId);
    }
  }, [activeHostelId, canReadInvoice]);




  useEffect(() => {
    if (activeHostelId) {
      getBankListByHostel(activeHostelId);
    }
  }, [activeHostelId]);


  useEffect(() => {
    if (activeHostelId) {
      GetRecurringBills(activeHostelId);
    }
  }, [activeHostelId])

    useEffect(() => {
      if (activeHostelId) {
        GetReceiptsList(activeHostelId);
      }
    }, [activeHostelId]);

    useEffect(() => {
      if (activeHostelId) {
        getParticularHostelDetails(activeHostelId);
      }
    }, [activeHostelId])

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

      if (showReceiptDetails) {
        setShowReceiptDetails(false);
        return true;
      }

      if (showWriteOff) {
        setShowWriteOff(false);
        return true;
      }

      if (showRecordPayment) {
        setShowRecordPayment(false);
        return true;
      }

      if (showRefundPayment) {
        setShowRefundPayment(false);
        return true;
      }

      if (deleteTenants) {
        setDeleteTenants(false);
        return true;
      }

      if (showMenu) {
        setShowMenu(false);
        return true;
      }
      if (showReceiptMenu) {
        setShowReceiptMenu(false);
        return true;
      }

      if(showRecuringBillDetail){
        setShowRecuringBillDetail(false);
        return true;
      }

      // ✅ 2) Tab navigation back order




      if (activeTab === "Receipt") {
        setActiveTab("RecurringBills");
        return true;
      }

      if (activeTab === "RecurringBills") {
        setActiveTab("Bookings");
        return true;
      }
      if (activeTab === "Bookings") {
        setActiveTab("Invoices");
        return true;
      }

      // ✅ 3) Last → screen goBack
      navigation.goBack();
      return true;
    };

    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => handler.remove();
  }, [
    showDetailModal,
    showFilter,
    showBillDetails,
    showReceiptDetails,
    showWriteOff,
    showRecordPayment,
    showRefundPayment,
    deleteTenants,
    showMenu,
    activeTab,
    showRecuringBillDetail
  ]);


  // const dotsRef = useRef(null);

  const dotsRefs = useRef({});


  const detailsY = useRef(new Animated.Value(0)).current;
  const detailsSheetY = useRef(new Animated.Value(0)).current;
  const writeoffSheetY = useRef(new Animated.Value(0)).current;
  const receiptdetailsSheetY = useRef(new Animated.Value(0)).current;
  const recurringSheetY = useRef(new Animated.Value(0)).current;


  const handleRefundRecord = () => {
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

    const payload = {
      customer: "Jobin",
      refundAmount,
      refundDate: dayjs(refundDate).format("YYYY-MM-DD"),
      refundFrom,
      refundMode,
      transactionId,
    };

    console.log("REFUND DATA", payload);

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


  // const openMenu = (event, item) => {
  //   event.target.measureInWindow((x, y, width, height) => {
  //     setPopupPosition({
  //       x: x,
  //       y: y + height,
  //     });
  //       setSelectedBill(item);
  //     setSelectedCustomer(item);
  //     setShowMenu(true);
  //   });
  // };

  const openMenu = (item) => {
    const ref = dotsRefs.current[item?.invoiceId];

    if (ref) {
      ref.measureInWindow((x, y, width, height) => {

        setPopupPosition({
          x: x,
          y: y + height,
        });

        setSelectedBill(item);
        setShowMenu(true);
      });
    }
  };



  const DeleteMenu = () => {
    setDeleteTenants(true)
  }
  const CloseDelete = () => {
    setDeleteTenants(false)
  }

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);


  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);

  const formatDate = (d) => {
    if (!d) return "Select Date";
    return dayjs(d).format("DD-MM-YYYY");
  };

  const payload = {
    startDate: fromDate ? dayjs(fromDate).format("DD/MM/YYYY") : null,
    endDate: toDate ? dayjs(toDate).format("DD/MM/YYYY") : null,
  };

  console.log("BillDetails", BillDetails);


  const [showBillDetails, setShowBillDetails] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

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

  const BillsStatusStyle = getStatusStyle(selectedBill?.paymentStatus);
  const statusStyle = getStatusStyle(selectedReceipt?.paymentStatus);
  console.log("statusstyle", statusStyle)


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

   useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(recordSheetY, {
        toValue: -e.endCoordinates.height + 70,
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

  const maxRefund = Number(refundInitDetails?.pendingRefund || 0);


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

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(refundSheetY, {
        toValue: -e.endCoordinates.height + 70,
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
  const [isInputFocused, setIsInputFocused] = useState(false);

  // useEffect(() => {
  //   const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
  //     if (!isInputFocused) return;
  //     Animated.timing(recordSheetY, {
  //       toValue: -e.endCoordinates.height + 80,
  //       duration: 180,
  //       useNativeDriver: true,
  //     }).start();
  //   });

  //   const hideSub = Keyboard.addListener("keyboardDidHide", () => {
  //     Animated.timing(recordSheetY, {
  //       toValue: 0,
  //       duration: 180,
  //       useNativeDriver: true,
  //     }).start();
  //     setIsInputFocused(false);
  //   });

  //   return () => {
  //     showSub.remove();
  //     hideSub.remove();
  //   };
  // }, [isInputFocused]);




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

      if (showReceiptDetails) {
        setShowReceiptDetails(false)
        return true;
      }

      if (showWriteOff) {
        setShowWriteOff(false);
        return true;
      }

      if (showRecordPayment) {
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
  }, [showDetailModal, showFilter, showBillDetails, showWriteOff, showRecordPayment, showRefundPayment, showReceiptDetails]);

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
  }, [showFilter, openFrom, openTo, amountDropdownVisible]);


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

  // const receiptDetailsPan = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
  //     onPanResponderGrant: () => {
  //     setShowReceiptMenu(false);
  //   },
  //     onPanResponderMove: (_, g) => {
  //       if (g.dy > 0) receiptdetailsSheetY.setValue(g.dy);
  //     },
  //     onPanResponderRelease: (_, g) => {
  //       if (g.dy > 120) {
  //         Animated.timing(receiptdetailsSheetY, {
  //           toValue: 700,
  //           duration: 200,
  //           useNativeDriver: true,
  //         }).start(() => {
  //           setShowReceiptDetails(false);
  //           setShowReceiptMenu(false);
  //           receiptdetailsSheetY.setValue(0);
  //         });
  //       } else {
  //         Animated.spring(receiptdetailsSheetY, {
  //           toValue: 0,
  //           useNativeDriver: true,
  //         }).start();
  //       }
  //     },
  //   })
  // ).current;
  const receiptDetailsPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        if (g.dy > 5) {
          setShowReceiptMenu(false);
          return true;
        }
        return false;
      },

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
            setShowReceiptMenu(false); // safety
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

  const recurringDetailsPan = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 5,

    onPanResponderMove: (_, g) => {
      if (g.dy > 0) recurringSheetY.setValue(g.dy);
    },

    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) {
        Animated.timing(recurringSheetY, {
          toValue: 700,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShowRecuringBillDetail(false);
          recurringSheetY.setValue(0);
        });
      } else {
        Animated.spring(recurringSheetY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  })
).current;

  const toggleAmountDropdown = () => {
    setAmountDropdownVisible((v) => !v);
  };


  const tabs = [
    { key: "Invoices", active: Profile, inactive: InProfile },
    { key: "Bookings", active: ActiveWalkin, inactive: WalkinIcon },
    { key: "RecurringBills", active: ActiveCheckout, inactive: CheckoutIcon },
    { key: "Receipt", active: ActiveWalkin, inactive: WalkinIcon },
  ];


  const openCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const openBillDetails = (item) => {
    if (!canReadInvoice) return;
    setSelectedBill(item);
    setShowBillDetails(true);
    const res = getBillsPdfDetails(item?.hostelId, item?.invoiceId);
  };



  const handleShowWriteOff = () => {
    setShowWriteOff(true);
  }
  const handleTransactionChange = (text) => {
    const filteredText = text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/
      , ""
    );

    setTransactionId(filteredText);
  };


  const resetRecordPaymentForm = () => {
    setPaidAmount("");
    setBalanceAmount(0);
    setPaidDate(null);
    setSelectedMode("");
    setTransactionId("");
    setAmountError("");
    setDateError("");
    setModeError("");
  };

  const handleShowRecordPayment = () => {
    setShowMenu(false);
    resetRecordPaymentForm();
    setShowRecordPayment(true);
  };
  // const handleShowRecordPayment  = () => {
  //   setShowMenu(false);
  //   setShowRecordPayment(true);
  // }

  const handleCreateBill = () => {

    if (!activeHostelId) {
      setModalType("warning");
      setModalMessage("Please Add a Hostel First");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
      return;
    }
    if (!canReadInvoice) return;

    navigation.navigate("CreateBills", { mode: "add" })
  }

  const formatApiDate = (date) =>
    date
      ? dayjs(date, "DD/MM/YYYY").format("DD MMM YYYY")
      : "--";


  const handleOpenReceiptSheet = async (item) => {
    console.log(item);

    const res = await getReceiptPdfDetails(
      activeHostelId,
      item?.transactionId
    );

    console.log(res)

    setSelectedReceipt(item);
    setSelectedReceiptFull(res.data)
    setShowReceiptDetails(true);
  };

const handleOpenReceiptFromBill = async (pay) => {
  
  console.log("pay", pay);
   const receipt = receiptsList.find(
    (r) =>
      r.transactionNumber === pay?.referenceNumber
  );

  console.log("receipt", receipt);

  if (!receipt) {
    console.log("Receipt not found");
    return;
  }

  const res = await getReceiptPdfDetails(
    activeHostelId,
    receipt?.transactionId
  );

  setSelectedReceipt(receipt);
  setSelectedReceiptFull(res?.data);
  setShowReceiptDetails(true);
};

console.log("selectedReceipt", selectedReceipt);


 const handleDeleteReceipt = async () => {

    if (!canDeleteReceipt) return;

    const res = await DeleteReceipt({
      hostelId: activeHostelId,
      receiptId: selectedReceipt?.transactionId,
    });



    if (res.success) {
        setShowReceiptDetails(false);
         setShowReceiptMenu(false)
      setModalType("success");
      setModalMessage("Deleted Successfully");
      setShowSuccessModal(true);
      setDeleteReceipt(false)

      setTimeout(() => setShowSuccessModal(false), 1500);
    } else {
      setModalType("warning");
      setModalMessage(res?.message || "Something went wrong");
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 1500);
    }
  };

  const handleRecurringBill=(item)=>{
    console.log("billa",item)
    setSelectedRecurringBill(item)
    setShowRecuringBillDetail(true)
  }

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

    if (num > (selectedBill?.dueAmount || 0)) {
      num = selectedBill?.dueAmount || 0;
    }

    setPaidAmount(String(num));
    setBalanceAmount((selectedBill?.dueAmount || 0) - num);
  };

  const formatDateForPayload = (date) => {
    if (!date) return null;

    // works for dayjs & Date
    return dayjs(date).format("DD-MM-YYYY");
  };


  const handleSaveRecordPayment = async () => {
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
      const billDate = dayjs(selectedBill?.invoiceDate, "DD/MM/YYYY");
      const paid = dayjs(formattedPaidDate, "DD-MM-YYYY");

      if (paid.isBefore(billDate, "day")) {
        setDateError("Paid date should not be before Bill date");
        isValid = false;
      }
    }

    if (!selectedMode) {
      setModeError("Please Select Transaction Type");
      isValid = false;
    }

    if (!isValid) return;

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
        await GetAllBillDetails(activeHostelId);
        setShowBillDetails(false)
        setShowRecordPayment(false);

        setModalType("success");
        setModalMessage("Payment recorded successfully");
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 1500);
      } else if (res.payableAmount) {
        setModalType("warning");
        setModalMessage(res.payableAmount);
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
      setRecordLoading(false);
    }
  };









  const handleSearch = async (text) => {
    if (!canReadInvoice) return;
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

  console.log("refunddetails", refundInitDetails, selectedBill?.invoiceDate);


  const handleApplyFilter = async () => {
    if (!canReadInvoice) return;
    if (!fromDate && toDate) {
      setFilterError("Please select Start Date");
      return;
    }

    const filters = {
      startDate: fromDate ? dayjs(fromDate).format("DD/MM/YYYY") : null,
      endDate: toDate ? dayjs(toDate).format("DD/MM/YYYY") : null,
      paymentStatus: billStatus,
      type: type,
      modes: mode,
      createdBy: createdBy,
    };

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

    await GetAllBillDetails(activeHostelId, filters);

    setAppliedFilters(filters);

    setShowFilter(false);
  };



  const handleResetFilters = async () => {
    if (!canReadInvoice) return;
    setFromDate(null);
    setToDate(null);
    setBillStatus([]);
    setType([]);
    setMode([]);
    setCreatedBy([]);

    setAppliedFilters(null);
    setFilterError("")

    await GetAllBillDetails(activeHostelId);
  };

  const resetRefundForm = () => {
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


  const today = dayjs();


  const invoiceDate = dayjs(selectedBill?.invoiceDate, "DD-MM-YYYY");


  const getInvoiceDate = () => {
    if (!selectedBill?.invoiceDate) return null;
    return dayjs(selectedBill.invoiceDate, "DD/MM/YYYY").startOf("day");
  };

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




  const handleShowRefundPayment = () => {

    resetRefundForm();
    setShowMenu(false);
    setShowRefundPayment(true);
    setShowRefundFrom(false);

  }

  useEffect(() => {
    if (
      showRefundPayment &&
      selectedBill?.invoiceId &&
      activeHostelId
    ) {
      fetchRefundInitialize()
    }
  }, [showRefundPayment, selectedBill?.invoiceId, activeHostelId]);


  // useEffect(() => {
  //   if (refundInitDetails?.pendingRefund != null) {
  //     setRefundAmount("");
  //     setRefundBalance(
  //       Number(refundInitDetails.pendingRefund)
  //     );
  //   }
  // }, [refundInitDetails]);

  useEffect(() => {
    if (refundInitDetails?.refundableAmount != null) {
      setRefundBalance(refundInitDetails?.pendingRefund);
      setRefundAmount("");
    }
  }, [refundInitDetails]);






  // const today = dayjs().startOf("day");

  // const invoiceDate = selectedBill?.invoiceDate
  //   ? dayjs(selectedBill.invoiceDate, "DD/MM/YYYY").startOf("day")
  //   : null;


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

  useEffect(() => {
    if (selectedBill?.invoiceDate && !refundDate) {
      const inv = parseInvoiceDate(selectedBill.invoiceDate);
      if (inv) setRefundDate(inv.toDate());
    }
  }, [selectedBill]);

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


  const balanceDue =
    Math.abs(Number(refundInitDetails?.pendingRefund || 0)) -
    (Number(refundAmount) || 0);

  console.log("balancedue", refundInitDetails);





  const refundBankOptions = (refundInitDetails?.listBanks || []).map((b) => ({
    label: `${b?.bankName}`,
    value: b?.bankId,
  }));

  const handleReceiptMenu = (item, id) => {

    const Idvalue = id || selectedReceipt[0]?.transactionId

    const ref = dotsRefs.current[id]

    if (ref) {
      ref.measureInWindow((x, y, width, height) => {
        setPopupPosition({
          x: x,
          y: y + height, // show just below button
        });
        setShowReceiptMenu(true);
        setSelectedTenantReceipt(item)
      });
    }
    // const ref = dotsRefs.current[id];

    // if (!ref) return;

    // ref.measureInWindow((px, py, width, height) => {
    //   setPopupPosition({ x: px, y: py });
    //   setSelectedCustomer(item);
    //   setShowReceiptMenu(true);
    // });
  }

  const handleDownloadBillsPdf = async () => {
    if (!activeHostelId || !selectedBill?.invoiceId) return;

    const res = await downloadBill(activeHostelId, selectedBill.invoiceId);

    if (res?.success && res?.url) {
      await CommonModule.downloadAndViewDocument(res.url);
      setShowMenu(false)
      setShowBillDetails(false)
    } else {
      console.log(res?.message);
      setShowMenu(false)

    }
  };

  const handleShareBill = async () => {
    const res = await shareBillOnWhatsapp(activeHostelId, selectedBill?.invoiceId);

    if (res?.success) {
      setShowMenu(false)
      setShowBillDetails(false)
      setModalType("success");
      setModalMessage("Bill shared successfully");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);

      // console.log("WhatsApp shared successfully");
    } else {
      console.log(res?.message);
      setShowMenu(false)
    }
  }


  const handleShareReceipt = async () => {

    const res = await shareReceiptOnWhatsapp(activeHostelId, selectedReceipt?.transactionId);

    if (res?.success) {
      setShowReceiptMenu(false)
      setShowReceiptDetails(false)
      setModalType("success");
      setModalMessage("Receipt shared successfully");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);

      // console.log("WhatsApp shared successfully");
    } else {
      console.log(res?.message);
      setShowMenu(false)
    }
  };


  // const handleDownloadReport = async () => {
  //   try {


  //     const res = await axios.get(`/v2/reports/download/${activeHostelId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         params: {
  //           startDate,
  //           endDate,
  //         },
  //       }
  //     )

  //     console.log("DOWNLOAD API RESPONSE →", res.data);

  //     const fileUrl = res.data;

  //     if (!fileUrl) {
  //       console.log("No file URL received");
  //       return;
  //     }

  //     await CommonModule.downloadAndViewDocument(fileUrl);

  //   } catch (error) {
  //     console.log("Download error →", error);
  //   }
  // };


  const handleDownloadReceipt = async (item) => {
    if (!activeHostelId || !item?.transactionId) return;

    const response = await downloadReceipt(
      activeHostelId,
      item.transactionId
    );

    CommonModule.downloadAndViewDocument(response.url);
  };
  // const handleDownloadReceipt = async (item) => {
  //   if (!activeHostelId) return;

  //   const response = await downloadReceipt(activeHostelId, item?.transactionId);

  //   if (!response?.success) {
  //     console.log("Failed to fetch receipt");
  //     return;
  //   }

  //   const pdfUrl = response?.url;

  //   try {
  //     const { fs } = ReactNativeBlobUtil;
  //     const filePath =
  //       fs.dirs.CacheDir + `/receipt-${Date.now()}.pdf`;

  //     const res = await ReactNativeBlobUtil.config({
  //       fileCache: true,
  //       path: filePath,
  //     }).fetch("GET", pdfUrl);

  //     await Share.open({
  //       url: "file://" + res.path(),
  //       type: "application/pdf",
  //       failOnCancel: false,
  //     });

  //   } catch (err) {
  //     console.log("Error:", err);
  //   }
  // };

  const handleEditReceipt = () => {

    navigation.navigate("CreateReceipt", {
      mode: "edit",
      // data: item,  
    });
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
      setModalType("success");
      setModalMessage("Refund successfully");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
      GetAllBillDetails(activeHostelId);
      setShowRefundPayment(false);
      setRefundAmount("");
      setRefundDate(null);
      setRefundFrom("");
      setTransactionId("");
    } else if (res.refundableError) {
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


  const getPaymentIcon = (status) => {
    switch (status) {
      case "Paid":
        return PaidIcon;

      case "Partial Payment":
      case "Partially Paid":
      case "Partially Refunded":
        return PartiallypaidIcon;

      case "Cancelled":
        return RefundedIcon;

      case "Pending":
      case "Pending Refund":
        return null;

      default:
        return null;
    }
  };

  const isPaid = selectedBill?.paymentStatus === "Paid";
  const isPartial =
    selectedBill?.paymentStatus === "Partially Paid" ||
    // selectedBill?.paymentStatus === "Partially Refunded" ||
    selectedBill?.paymentStatus === "Partial Payment"
  const isPending = selectedBill?.paymentStatus === "Pending";
  const cancelled = selectedBill?.paymentStatus === "Cancelled";
  const pendingRefund = selectedBill?.paymentStatus === "Pending Refund";
  const partiallyRefund = selectedBill?.paymentStatus === "Partially Refunded"

  const isValidSubscription = PGDetails?.isSubscriptionActive;
const isExportAllow = isValidSubscription && canReadInvoice;
const isReceiptExportAllow = isValidSubscription && canReadReceipt;


  const getOverdueDays = (dueDate) => {
    if (!dueDate) return 0;

    const today = dayjs().startOf("day");

    const due = dayjs(dueDate, "DD/MM/YYYY").startOf("day");

    if (!due.isValid()) return 0;

    const diff = today.diff(due, "day");

    return diff > 0 ? diff : 0;
  };


  const overdueDays = getOverdueDays(BillPdfdetails?.dueDate);



  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#00A32E"; // Green
      case "Partially paid":
        return "#1E45E1"; // Blue
      case "Notice Period":
      case "Pending":
        return "#FF0000"; // Red
      case "Partially Refunded":
        return "#ffe5b6"; // dark yellow
      case "Cancelled":
        return "#ffe6b3"; // dark yellow
      default:
        return "#D1D5DB"; // Grey fallback
    }
  };

        //  

//          if(loading){
//           <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
//    <SmLoader/>
// </View>
//          }


  return (

    <>
             {loading && <Loader  />}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />

      <View style={[styles.safe, { paddingTop: insets.top }]}>

        <SafeAreaView style={styles.container}>

 
          <View style={{ flexDirection: "row", alignItems: "center" }}>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={ArrowLeft} style={styles.backIcon} />
            </TouchableOpacity>

            <View style={styles.searchContainer}>
              <Image source={SearchIcon} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Invoices"
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={(text) => {
                  setSearchText(text);
                  handleSearch(text);
                }}
                editable={canReadInvoice}
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



          {activeTab === "Invoices" && (
            <View style={{ flex: 1 }}>

              {!canReadInvoice && (
                <View style={styles.centerContainer}>
                  <Image source={EmptyFloor} style={styles.image} />
                  <Text style={styles.noFloorText}>
                    You don’t have permission to view bills
                  </Text>
                </View>
              )}


              {canReadInvoice && !loading && (
                <>
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
                        <TouchableOpacity key={item.invoiceId} activeOpacity={0.8} style={styles.tenantRow} onPress={() => openBillDetails(item)}>
                         
                          <View>
                            {item?.profilePic ? (
                              <Image
                                source={{ uri: item.profilePic }}
                                style={styles.profileImg}
                              />
                            ) : (
                              <View style={styles.initialCircle}>
                                <Text style={styles.initialText}>
                                  {item?.initials?.toUpperCase() || "NA"}
                                </Text>
                              </View>
                            )}

                            <View style={styles.profileStatusBadge}>
                              {item.paymentStatus === "Pending" || item.paymentStatus === "Pending Refund" ?(
                                <View style={styles.redDot} />
                              ) : (
                                <View style={styles.tickBadge}>
                                  <Image
                                    source={getPaymentIcon(item.paymentStatus)}
                                    style={styles.statusIcon}
                                  />
                                </View>
                              )}
                            </View>




                          </View>

                          <View style={{ flex: 1 }}>
                            {/* <Text style={styles.name}>{item.fullName}</Text> */}

                            <Text style={styles.name}>{item.fullName}</Text>



                            <View style={[styles.detailRow, { flex: 1 }]}>
                              <View style={[styles.floorBadge, { alignItems: 'center' }]}>
                                <Text style={styles.floorText}>{item.invoiceType}</Text>
                              </View>

                              <Image source={Bills_Black_Icon} style={styles.iconSmall} />
                              <Text style={[styles.detailText, { flexShrink: 1, flex: 1 }]}>{item.invoiceNumber}</Text>
                            </View>

                                {["Partially Paid","Partial Payment"].includes(item.paymentStatus) && (
                                     <Text style={styles.dueLabel}>Outstanding</Text>
                                )}
                          </View>

                          <View style={styles.rightSection}>
                            {/* <TouchableOpacity ref={dotsRef}  onPress={(e) => openMenu(e, item)}>
            <Image
              source={Dots}
              style={{ width: 30, height: 30, transform: [{ rotate: "90deg" }] }}
            />
          </TouchableOpacity> */}
                            <Text style={{
                              fontSize: 14,
                              fontFamily: "Gilroy-Bold",
                              color: "#000",
                            }}>₹ {item?.invoiceAmount ?? "--"}</Text>

                            <Text style={styles.dateText}>{item.invoiceDate}</Text>
                              {["Partially Paid","Partial Payment"].includes(item.paymentStatus) && (
                                     <Text style={styles.dueAmount}>   ₹ {item?.dueAmount || 0}</Text>
                                )}
                          </View>

                          <View style={{display:'flex', flexDirection:'row'}}>
  
  </View>

                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}

                  {(
                    !loading && BillDetails && (BillDetails?.listInvoices?.length === 0 || BillDetails?.length === 0) &&
                    <View style={styles.centerContainer}>
                      <Image source={EmptyFloor} style={styles.image} />
                      <Text style={styles.noFloorText}>No bills are there!</Text>

                      <TouchableOpacity
                        style={[
                          styles.addFloorBtn,
                          !canWriteInvoice && { opacity: 0.4 }
                        ]}
                        disabled={!canWriteInvoice}
                        onPress={handleCreateBill}>
                        <Text style={styles.addFloorText}>+ Add Bill</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                </>
              )}

              {!loading && BillDetails?.listInvoices?.length > 0 && (
                <>
                  <TouchableOpacity
                    style={[styles.FilterButton, !canReadInvoice && { opacity: 0.4 }]}
                    disabled={!canReadInvoice}
                    onPress={() => setShowFilter(true)}>
                    <Image source={FilterIcon} style={{ width: 30, height: 30 }} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.addBtn,
                      !canWriteInvoice && { opacity: 0.4 }
                    ]}
                    disabled={!canWriteInvoice}
                    onPress={handleCreateBill}>
                    <Image source={AddIcon}
                      style={{ width: 25, height: 25 }} />
                  </TouchableOpacity>
                </>
              )
              }


            </View>
          )}
          {activeTab === "Bookings" && (
            <BillBookings />
          )}

          {activeTab === "RecurringBills" && (
            <RecurringBills onSelectRecurringBill={handleRecurringBill}/>
          )}
          {activeTab === "Receipt" && (
            <Receipt onSelectReceipt={handleOpenReceiptSheet} />
          )}

          {showBillDetails && (
            <View style={styles.sheetOverlay}>

              <TouchableWithoutFeedback onPress={() => {
                setShowBillDetails(false)
                setShowPayments(!showPayments)
              }}
              >
                <View style={{ flex: 1 }} />
              </TouchableWithoutFeedback>

              <Animated.View
                style={[
                  styles.transactionSheet,
                  {
                    height: isPaid ? "60%" : isPartial ? "80%" : "60%",
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
                          {selectedBill?.paymentStatus}
                        </Text>
                      </View>


                     {
                        !isPaid && (
                      <TouchableOpacity ref={(ref) => (dotsRefs.current[selectedBill?.invoiceId] = ref)}
                        onPress={() => openMenu(selectedBill)}>
                        <Image
                          source={Dots}
                          style={{ width: 30, height: 30, }}
                        />
                      </TouchableOpacity>
                        )}

                    </View>
                  </View>

                  <View style={styles.userRow}>
                    {selectedBill?.profilePic ? (
                      <Image
                        source={{ uri: selectedBill.profilePic }}
                        style={styles.userImg}
                      />
                    ) : (
                      <View style={styles.initialCircle}>
                        <Text style={styles.initialText}>
                          {selectedBill?.initials || selectedBill?.fullName?.slice(0, 2)?.toUpperCase()}
                        </Text>
                      </View>
                    )}


                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("CustomerOverviewScreen", {
                            customerId: selectedBill?.customerId,
                            customer: selectedBill,
                          })
                        }
                      >
                        <Text style={styles.userName}>{selectedBill?.fullName || "--"}</Text>
                      </TouchableOpacity>

                      <View style={{ flexDirection: "row", marginTop: 4 }}>
                        <View style={styles.invTypeBadge}>
                          <Text style={styles.invTypeText}>{selectedBill?.invoiceType}</Text>
                        </View>

                        <Image source={Bills_Black_Icon} style={{
                          width: 12,
                          height: 12, marginTop: 5, marginRight: 5
                        }} />
                        <Text style={styles.billNumber}>{selectedBill?.invoiceNumber || "--"}</Text>
                      </View>
                    </View>
                  </View>
                  {(isPending || isPartial || partiallyRefund || pendingRefund) && (
                    <View style={styles.actionRow}>

                      <TouchableOpacity style={styles.reminderBtn} >
                        <Image source={WhatsappGreenIcon} style={styles.actionIcon} />
                        <Text style={styles.reminderText}>Remainder</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.callBtn}>
                        <Image source={Call} style={styles.actionIcon} />
                        <Text style={styles.callText}>Call</Text>
                      </TouchableOpacity>

                    </View>
                  )}

                  <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ fontSize: 15, fontFamily: "Gilroy-Semibold" }}>Total Amount</Text>
                    </View>
                    <View>
                      <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={styles.amountValue}>
                          {/* ₹ {BillPdfdetails?.invoiceInfo?.totalAmount ?? "--"} */}
                          ₹ {BillPdfdetails?.invoiceInfo?.totalAmount ? Number(BillPdfdetails?.invoiceInfo?.totalAmount).toFixed(2) : "0.00"}
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



                  {(isPartial || partiallyRefund ) && (
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




                  {(isPaid || isPartial ) && BillPdfdetails?.paymentHistory?.length > 0 && (
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
                               <TouchableOpacity onPress={() => handleOpenReceiptFromBill(pay)}>
  <Text style={{ color: "#1E45E1", fontFamily: "Gilroy-Semibold" }}>
    #{pay?.referenceNumber}
  </Text>
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


                  {(selectedBill?.paymentStatus === "Partially Refunded" || selectedBill?.paymentStatus === "Refunded") && BillPdfdetails?.refundHistory?.length > 0 && (
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

                              <View style={styles.paymentTopRow}>
                                <Text >
                                  #{BillPdfdetails?.invoiceNumber}
                                </Text>

                                <Text style={styles.paymentAmount}>
                                  ₹ {pay?.amount ? Number(pay.amount).toFixed(2) : "0.00"}
                                </Text>
                              </View>

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




                  <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={[styles.label, { fontFamily: "Gilroy-Semibold" }]}>Invoice date</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 12, fontFamily: "Gilroy-Semibold" }}>
                        {BillPdfdetails?.invoiceDate ?? "--"}
                      </Text>
                    </View>
                  </View>

                  {!isPaid && (
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




                </ScrollView>





                <View style={styles.fixedBottomBar}>

                  {(isPaid || cancelled || pendingRefund || partiallyRefund) && (
                    <>
                      <TouchableOpacity
                        style={[styles.paidBtn, !isExportAllow && { opacity: 0.4 }]}
                        disabled={!isExportAllow}
                        onPress={handleShareBill}>
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

                  {(isPending || isPartial ) && (
                    <>
                      <View style={styles.bottomActionItem}>
                        <TouchableOpacity
                        style={[styles.iconBtn, !isExportAllow && { opacity: 0.4 }]}
                        disabled={!isExportAllow} onPress={handleShareBill}
                    >
                          <Image source={ShareIcon} style={styles.iconDark}  />
                        </TouchableOpacity>
                        <Text style={styles.bottomText}>Share</Text>
                      </View>

                      <View style={styles.bottomActionItem}>
                        <TouchableOpacity
                        style={[styles.iconBtn, !isExportAllow && { opacity: 0.4 }]}
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
          )}

          {showReceiptDetails && (
            <View style={styles.sheetOverlay}>

              <TouchableWithoutFeedback onPress={() => {
                setShowReceiptDetails(false)
                setShowReceiptMenu(false)
              }}>
                <View style={{ flex: 1 }} />
              </TouchableWithoutFeedback>

              <Animated.View
                style={[
                  styles.transactionSheet,
                  { maxHeight: '100%', transform: [{ translateY: receiptdetailsSheetY }] }
                ]}
                {...receiptDetailsPan.panHandlers}
              >
                <View style={styles.sheetHandle} />



                <ScrollView showsVerticalScrollIndicator={false}>

                  <View style={styles.billHeaderRow}>
                    <Text style={styles.billHeaderText}>Bill Details</Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusStyle.bg },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: statusStyle.dot },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: statusStyle.text },
                          ]}
                        >
                          {selectedReceipt?.paymentStatus}
                        </Text>
                        {console.log("resc", selectedReceipt)}
                        {console.log(selectedReceiptFullDetail)}
                      </View>

                      <TouchableOpacity ref={(el) => {
                        dotsRefs.current[selectedReceipt?.transactionId] = el;
                      }}
                        onPress={() => handleReceiptMenu(selectedReceipt, selectedReceipt?.transactionId)}>
                        <Image source={Dots} style={{ width: 28, height: 28 }} />
                      </TouchableOpacity>
                    </View>
                  </View>


                  <View style={styles.userRow}>
                    {selectedReceipt?.profilePic ? (
                      <Image
                        source={{ uri: selectedReceipt.profilePic }}
                        style={styles.userImg}
                      />
                    ) : (
                      <View style={styles.initialCircle}>

                        <Text style={styles.initialText}>
                          {selectedReceipt?.initials ||
                            selectedReceipt?.fullName?.slice(0, 2)?.toUpperCase() ||
                            "--"}
                        </Text>
                      </View>
                    )}

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("CustomerOverviewScreen", {
                            customerId: selectedReceipt.customerId,
                            customer: selectedReceipt,
                          })
                        }>
                        <Text style={styles.userName}>  {selectedReceipt?.fullName || "--"}</Text>
                      </TouchableOpacity>

                      <View style={{ flexDirection: "row", marginTop: 4 }}>
                        <View style={styles.invTypeBadge}>
                          <Text style={styles.invTypeText}>{selectedReceipt?.invoiceType}</Text>
                        </View>

                        <Image source={Bills_Black_Icon} style={{
                          width: 12,
                          height: 12, marginTop: 5, marginRight: 5
                        }} />
                        <Text style={styles.billNumber}>{selectedReceiptFullDetail?.receiptInfo?.receiptNumber}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 22 }}>
                    <Text style={{ fontSize: 17, fontFamily: "Gilroy-Semibold" }}>Amount Paid</Text>
                    <Text style={{ fontSize: 17, fontFamily: "Gilroy-Semibold" }}>₹{selectedReceipt?.paidAmount ?? "--"}</Text>
                  </View>

                  <View style={{ borderWidth: 0.8, marginVertical: 20, borderColor: '#E3E3E3' }} />

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Medium", color: '#3C3C4399' }}>Payment date</Text>
                    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Semibold" }}>{formatApiDate(selectedReceipt?.paidAt)}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
                    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Medium", color: '#3C3C4399' }}>Payment mode</Text>
                    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Semibold" }}>{selectedReceiptFullDetail?.accountDetails?.bankName || "N/A"}</Text>
                  </View>


                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
                    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Medium", color: '#3C3C4399' }}>Invoice No</Text>
                    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Semibold" }}>{selectedReceipt?.invoiceNumber || "N/A"}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
                    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Medium", color: '#3C3C4399' }}>Payment to</Text>
                    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Semibold" }}>{selectedReceiptFullDetail?.receiptInfo?.receivedBy || "N/A"}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, marginBottom: 9 }}>
                    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Medium", color: '#3C3C4399' }}>Transaction Id</Text>
                    <Text style={{ fontSize: 14, fontFamily: "Gilroy-Semibold" }}>{selectedReceipt?.transactionNumber || "--"}</Text>
                  </View>






                  <View style={styles.fixedBottomBar}>


                    <TouchableOpacity
                     style={[styles.paidBtn, !isReceiptExportAllow && { opacity: 0.4 }]}
                      disabled={!isReceiptExportAllow} onPress={handleShareReceipt}>
                      <Image source={ShareIcon} style={styles.iconDark} />
                      <Text style={styles.paidText}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.paidBtn, !isReceiptExportAllow && { opacity: 0.4 }]}
                      disabled={!isReceiptExportAllow}
                      onPress={() => handleDownloadReceipt(selectedReceipt)}>
                      <Image source={DownloadIcon} style={styles.iconDark} />
                      <Text style={styles.paidText}>Download</Text>
                    </TouchableOpacity>
                  </View>



                </ScrollView>
                {showReceiptMenu && (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setShowReceiptMenu(false)}
                    style={styles.popupOverlay}
                  >
                    <View
                      style={[
                        styles.popupBox,
                        { bottom: popupPosition.y - 50, left: popupPosition.x - 180 },
                      ]}
                    >
                      {/* <TouchableOpacity
                        style={[styles.popupRow, !canReadReceipt && { opacity: 0.4 }]}
                        disabled={!canReadReceipt}
                        onPress={() => handleDownloadReceipt(selecetedTenantReceipt)}
                      >
                        <Image source={DownloadIcon} style={styles.popupIcon} />
                        <Text style={styles.popupText}>Download</Text>
                      </TouchableOpacity> */}

                      <TouchableOpacity
                        // style={[styles.popupRow, !canUpdateReceipt && { opacity: 0.4 }]}
                        // disabled={!canUpdateReceipt}
                          style={[styles.popupRow, { opacity: 0.4 }]}
                         disabled
                        onPress={handleEditReceipt}>
                        <Image source={EditIcon} style={styles.popupIcon} />
                        <Text style={styles.popupText}>Edit</Text>
                      </TouchableOpacity>

                     
                      <TouchableOpacity
                        style={[styles.popupRow, !canDeleteReceipt && { opacity: 0.4 }]}
                        disabled={!canDeleteReceipt}
                        onPress={() => {
                          setShowReceiptMenu(false)
                          setDeleteReceipt(true)
                        }
                        }

                      >
                        <Image source={DeleteIcon} style={styles.popupIcon} />
                        <Text style={styles.popupText}>Delete</Text>
                      </TouchableOpacity>

                      {/* <TouchableOpacity
                        style={[styles.popupRow, !canReadReceipt && { opacity: 0.4 }]}
                        disabled={!canReadReceipt}
                        onPress={handleShareReceipt}
                      >
                        <Image source={WhatsappIcon} style={styles.popupIcon} />
                        <Text style={styles.popupText}>share</Text>
                      </TouchableOpacity> */}

                    </View>
                  </TouchableOpacity>
                )}


              </Animated.View>
            </View>
          )}

          {deleteReceipt && (
            <Modal
              transparent
              animationType="fade"
              visible={deleteReceipt}
              onRequestClose={() => setDeleteReceipt(false)}
            >
              <View style={styles.deleteOverlay}>
                <View style={styles.deleteBox}>

                  <Text style={styles.deleteTitle}>Delete Receipt?</Text>
                  <Text style={styles.deleteSub}>
                    Are you sure you want to delete this Receipt?
                  </Text>

                  <View style={styles.deleteBtnRow}>
                    <TouchableOpacity
                      style={styles.ReceiptcancelBtn}
                      onPress={() => setDeleteReceipt(false)}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.receiptDeleteBtn}
                      onPress={() => handleDeleteReceipt()}
                    >
                      <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
            </Modal>
          )}

          {showDetailModal && showDetailsMenu && (
            <>
              <TouchableOpacity
                style={styles.menuBackdrop}
                onPress={() => setShowDetailsMenu(false)}
              />

              <View
                // style={[
                //   styles.popupBox,
                //   {
                //     top: popupPosition.y + popupPosition.h + 8,
                //     left:
                //       popupPosition.x + 200 > screenWidth
                //         ? popupPosition.x - 200 + popupPosition.w
                //         : popupPosition.x,
                //   },
                // ]}

                style={[
                  styles.popupBox,

                  {
                    top: popupPosition.y - 10,
                    left: popupPosition.x - 180,
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
                  {
                    top: popupPosition.y - 10,
                    left: popupPosition.x - 180,
                  },
                ]}
              >



                {/* <TouchableOpacity style={styles.popupRow} onPress={handleShowCancelNotice} >
        <Image
          source={require("../../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Download</Text> 
      </TouchableOpacity> */}

                {/* <TouchableOpacity
                  style={[styles.popupRow, !canWriteInvoice && { opacity: 0.4 }]}
                  onPress={handleDownloadBillsPdf}
                  disabled={!canWriteInvoice}
                >
                  <Image
                    source={DownloadIcon}
                    style={styles.popupIcon}
                  />
                  <Text
                    style={[
                      styles.popupText,
                    ]}
                  >
                    Download
                  </Text>
                </TouchableOpacity> */}

                {selectedBill?.invoiceAmount < 0 && selectedBill?.paymentStatus !== "Refunded" && selectedBill?.paymentStatus !== "Cancelled" && (
                  <TouchableOpacity style={[styles.popupRow, !canWriteInvoice && { opacity: 0.4 }]}
                    onPress={handleShowRefundPayment} disabled={!canWriteInvoice}>
                    <Image
                      source={PaymentIcon}
                      style={styles.popupIcon}
                    />
                    <Text style={styles.popupText}>Refund Amount</Text>
                  </TouchableOpacity>
                )}


                {/* {(selectedBill?.dueAmount !== 0 && selectedBill?.invoiceAmount > 0 && selectedBill?.paymentStatus !== "Cancelled" && selectedBill?.paymentStatus !== "Paid") && (
                  <TouchableOpacity
                    style={[styles.popupRow, !canWriteInvoice && { opacity: 0.4 }]}
                    onPress={handleShowRecordPayment} disabled={!canWriteInvoice}>
                    <Image
                      source={PaymentIcon}
                      style={styles.popupIcon}
                    />
                    <Text style={styles.popupText}>Record Payment</Text>
                  </TouchableOpacity>

                )} */}

                {/* <TouchableOpacity
                  style={[
                    styles.popupRow,
                    isBillLocked && styles.popupRowDisabled,
                  ]}
                  disabled={isBillLocked && !canWriteInvoice}
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
                </TouchableOpacity> */}


                {/* <TouchableOpacity style={styles.popupRow} onPress={handleShowWriteOff} >
        <Image
          source={require("../../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Write-off</Text>
      </TouchableOpacity> */}


                {(selectedBill?.invoiceMode === "Recurring" && selectedBill?.paymentStatus === "Pending") && (
                  <TouchableOpacity
                    style={[styles.popupRow, !canUpdateInvoice && { opacity: 0.4 }]}
                    disabled={!canUpdateInvoice}
                    onPress={handleEditBill} >
                    <Image
                      source={require("../../../Assets/Images/ReAssign.png")}
                      style={styles.popupIcon}
                    />
                    <Text style={styles.popupText}>Edit</Text>
                  </TouchableOpacity>
                )}


                {/* <TouchableOpacity
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
</TouchableOpacity> */}


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
             

                {/* <TouchableOpacity
                  style={[styles.popupRow, !canReadInvoice && { opacity: 0.4 }]}
                  disabled={!canReadInvoice}
                  onPress={handleShareBill}
                >
                  <Image source={WhatsappIcon} style={styles.popupIcon} />
                  <Text style={styles.popupText}>share</Text>
                </TouchableOpacity> */}


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
                          <Text style={{ color: "#C67506", fontSize: 11, fontFamily: "Gilroy-Semibold" }}>
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
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Image source={WriteOffDueIcon} style={{ height: 12, width: 12, marginTop: 4, marginRight: 4 }} />
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
                  <Text style={{ marginBottom: 6, fontFamily: "Gilroy-Semibold", color: "#444" }}>
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
                  { height: "90%", transform: [{ translateY: recordSheetY }] }
                ]}
                {...recordPan.panHandlers}
              >
                <View style={styles.sheetHandle} />

                <ScrollView showsVerticalScrollIndicator={false}
                >

                  {/* Header */}
                  <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
                    Record Payment
                  </Text>

                  {/* USER INFO */}
                  <View style={{ flexDirection: "row", marginBottom: 20 }}>
                    {selectedBill?.profilePic ? (
                      <Image
                        source={{ uri: selectedBill.profilePic }}
                        style={styles.userImg}
                      />
                    ) : (
                      <View style={styles.initialCircle}>
                        <Text style={styles.initialText}>
                          {selectedBill?.initials || selectedBill?.fullName?.slice(0, 2)?.toUpperCase()}
                        </Text>
                      </View>
                    )}

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
                          <Text style={{ color: "#C67506", fontFamily: "Gilroy-Semibold", fontSize: 12 }}>
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





                  <Text style={styles.label}>Balance Amount</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: "#EFF2FF", color: "grey" }]}
                    value={`₹ ${balanceAmount}`}
                    editable={false}
                  />

                  {/* PAID DATE */}
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




                  {/* <Modal
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
  minDate={getInvoiceDate()?.toDate()}   
  maxDate={today.toDate()}              
  onChange={(v) => {
    if (!v?.date) return;

    setPaidDate(v.date);
    setDateError("");
    setOpenPaidDate(false);
  }}
/>

        
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal> */}

                  {/* {dateError ? (
  <Text style={{ color: "red", marginTop: 4, fontSize: 13 }}>
    {dateError}
  </Text>
) : null} */}


                  {/* <View style={{ position: "relative" }}>
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
      : "Please Select"}
  </Text>

  <Image
    source={DownArrow}
    style={{ width: 18, height: 18, tintColor: "#555" }}
  />
</TouchableOpacity>



{showPaymentMode && (
  <View
    style={[
      styles.transactiondropdown,
      transactionOptions.length <= 1 && {
        minHeight: undefined,
        maxHeight: undefined,
      },
    ]}
  >
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      scrollEnabled={transactionOptions.length > 2} 
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
        })
      ) : (
        <Text style={{ padding: 12, color: "#777" }}>
          No accounts available
        </Text>
      )}
    </ScrollView>
  </View>
)}
</View> */}

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



                  {/* Buttons */}
                  <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowRecordPayment(false)}>
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
                  { height: "85%", transform: [{ translateY: refundSheetY }] }
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
                    {selectedBill?.profilePic ? (
                      <Image
                        source={{ uri: selectedBill.profilePic }}
                        style={styles.userImg}
                      />
                    ) : (
                      <View style={styles.initialCircle}>
                        <Text style={styles.initialText}>
                          {selectedBill?.initials || selectedBill?.fullName?.slice(0, 2)?.toUpperCase()}
                        </Text>
                      </View>
                    )}

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
                          <Text style={{ color: "#C67506", fontSize: 11, fontFamily: "Gilroy-Semibold" }}>
                            {selectedBill?.invoiceType || "-"}
                          </Text>
                        </View>

                        <Image
                          source={Bills_Black_Icon}
                          style={{ width: 12, height: 12, marginTop: 3, marginRight: 5 }}
                        />
                        <Text style={{ fontSize: 11, color: "#555" }}>{selectedBill?.invoiceNumber}</Text>
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
                    Refund amount <Text style={{ color: "red", fontSize: 16 }}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Amount"
                    keyboardType="numeric"
                    value={refundAmount}
                    onChangeText={(val) => {

                      const numericValue = val.replace(/[^0-9]/g, "");
                      const max = Math.abs(
                        Number(refundInitDetails?.pendingRefund || 0)
                      );

                      const num = Number(numericValue || 0);

                      if (num > max) {
                        setRefundAmountError(`Amount cannot exceed ₹${max}`);
                        return;
                      }

                      setRefundAmount(numericValue);
                      setRefundAmountError("");
                    }}
                  />


                  {refundAmountError && (
                    <ErrorMessage message={refundAmountError} type="error" />
                  )}





                  {/* BALANCE DUE */}
                  <Text style={styles.label}>Balance Due <Text style={{ color: "red", fontSize: 16 }}>*</Text></Text>
                  <View style={styles.inputBox}>
                    <Text style={{ fontSize: 16 }}>
                      ₹ {Math.max(0, balanceDue)}
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


                  {/* 
 <Modal
  visible={openRefundDate}
  transparent
  animationType="fade"
  onRequestClose={() => setOpenRefundDate(false)}
>
  <TouchableWithoutFeedback onPress={() => setOpenRefundDate(false)}>
    <View style={styles.dateModalOverlay}>
      
      <TouchableWithoutFeedback>
        <View style={styles.dateModalBox}>




<DatePicker
  mode="single"
  date={refundDate || new Date()}
  minDate={getInvoiceDate()?.toDate()}
  maxDate={today.toDate()}
  onChange={(v) => {
    if (!v?.date) return;

    setRefundDate(v.date);
    setRefundDateError("");
    setOpenRefundDate(false);
  }}
/>



        </View>
      </TouchableWithoutFeedback>

    </View>
  </TouchableWithoutFeedback>
</Modal> */}


                  {/* REFUND FROM */}


                  {/* <Text style={styles.label}>
  Refund From <Text style={{ color: "red" }}>*</Text>
</Text>

<TouchableOpacity
  style={styles.inputBox}
  onPress={() => {
    setRefundFromError("");
    setShowRefundFrom((v) => !v);
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
  <View
    style={[
      styles.transactiondropdown,
      refundBankOptions.length <= 1 && {
        minHeight: undefined,
        maxHeight: undefined,
      },
    ]}
  >
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      scrollEnabled={refundBankOptions.length > 3}
    >
      {refundBankOptions.length > 0 ? (
        refundBankOptions.map((opt) => {
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
        })
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
                                )} */}

                  <View style={{ position: "relative" }}>

                    <Text style={styles.label}>
                      Refund From <Text style={{ color: "red" }}>*</Text>
                    </Text>
                    {/* INPUT */}
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

                    {/* DROPDOWN */}
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
                      <Text style={styles.saveText}>Refund</Text>
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

           {showRecuringBillDetail && (
                    <View style={styles.sheetOverlay}>
          
                      <TouchableWithoutFeedback onPress={() => setShowRecuringBillDetail(false)}>
                        <View style={{ flex: 1 }} />
                      </TouchableWithoutFeedback>
          
                      <Animated.View
                        style={[
                          styles.recurringTransactionSheet,
                          { minHeight: vs(280), maxHeight: vs(420), transform: [{ translateY: recurringSheetY }] }
                        ]}
                        {...recurringDetailsPan.panHandlers}
                      >
                        <View style={styles.sheetHandle} />
          
                        <ScrollView showsVerticalScrollIndicator={false}>
          
                          <View style={styles.billHeaderRow}>
                            <Text style={styles.billHeaderText}>Bill Details</Text>
          
          
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                              {/* <Image
                          source={Download}
                          style={{ width: 23, height: 23, marginRight:10 }}
                        /> */}
          
          
                              {/* <TouchableOpacity>
                        <Image
                          source={Dots}
                          style={{ width: 28, height: 28,  }}
                        />
                      </TouchableOpacity> */}
                            </View>
                          </View>
          
                          <View style={styles.userRow}>
          
                            {selectedRecurringBill.profilePic ? (
                              <Image
                                source={{ uri: selectedRecurringBill.profilePic }}
                                style={styles.avatar}
                              />
                            ) : (
                              <View style={styles.initialCircle}>
                                <Text style={styles.initialText}>
                                  {selectedRecurringBill.initials}
                                </Text>
                              </View>
                            )}
          
          
          
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <Text style={styles.userName}>{selectedRecurringBill?.fullName || "--"}</Text>
          
                              <View style={{ flexDirection: "row", marginTop: vs(4) }}>
                                <View style={styles.invTypeBadge}>
                                  <Text style={styles.invTypeText}>Recurring Inv</Text>
                                </View>
          
                                <Image source={Bills_Black_Icon} style={{
                                  width: 12,
                                  height: 12, marginTop: vs(5), marginRight: s(5)
                                }} />
                                <Text style={styles.billNumber}> #{selectedRecurringBill?.lastInvoiceNumber || "--"}</Text>
                              </View>
                            </View>
                          </View>
          
                          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(10) }}>
                            <View><Text style={{ fontSize: 16, fontFamily: "Gilroy-Medium"}}>Recurring</Text></View>
                            {/* <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                              <Text style={styles.labelOn}>
                                {selectedRecurringBill?.currentStatus ? "On" : "Off"}
                              </Text>
          
                              <TouchableOpacity>
                                <View
                                  style={[
                                    styles.switch,
                                    { backgroundColor: selectedRecurringBill?.currentStatus ? "#3562FF" : "#A68DE3" },
                                  ]}
                                >
                                  <View
                                    style={[
                                      styles.knob,
                                      { transform: [{ translateX: selectedRecurringBill?.currentStatus ? s(18) : 0 }] },
                                    ]}
                                  >
                                    <Text style={{ fontSize: 10, fontFamily: "Gilroy-Bold"  }}>
                                      {selectedRecurringBill?.currentStatus ? "✓" : "✕"}
                                    </Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
          
          
          
                            </View> */}
                          </View>
          
                          <View style={[styles.twoColRow]}>
                            <View >
                              <Text style={styles.label}>Last Invoice date</Text>
                              <View style={styles.rowAlign}>
                                <Image source={CalendarBlueIcon} style={styles.iconSmall} />
                                <Text style={styles.value}> {formatApiDate(selectedRecurringBill?.lastInvoiceDate)}</Text>
                              </View>
                            </View>
          
                            <View >
                              <Text style={styles.label}>Next Invoice date</Text>
                              <View style={styles.rowAlign}>
                                <Image source={CalendarBlueIcon} style={styles.iconSmall} />
                                <Text style={styles.value}> {formatApiDate(selectedRecurringBill?.nextInvoiceDate)}</Text>
                              </View>
                            </View>
                          </View>
          
                          <View style={styles.twoColRow}>
                            <View style={styles.colItem}>
                              <Text style={styles.label}>Amount</Text>
                              <View style={styles.rowAlign}>
                                <Image source={MoneyCheckIcon} style={{
                                  width: 18,
                                  height: 18, marginTop: vs(5), marginRight: s(5)
                                }} />
                                <Text style={styles.amountValue}>₹{selectedRecurringBill?.invoiceAmount ?? "--"}</Text>
                              </View>
                            </View>
          
          
                          </View>
          
                          {/* <TouchableOpacity style={styles.previewBtn} >
                      <View style={{display:'flex', flexDirection:'row'}}>
                                 <Image source={PreviewIcon} style={{   width: 18,
                      height: 18, marginTop:3 , marginRight:12
                    }} />
                      <Text style={styles.previewText}>Preview</Text>
                      </View>
                    </TouchableOpacity> */}
          
                        </ScrollView>
          
          
                      </Animated.View>
                    </View>
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
      </View>

    </>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: "#fff", flex: 1 },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    // paddingTop: 60
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
    fontFamily: "Gilroy-Medium",
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
    fontFamily: "Gilroy-Semibold"
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2D6CDF",
    fontFamily: "Gilroy-Bold"
  },

  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    fontFamily: "Gilroy-Semibold"
  },

  tabIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },

  tabText: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "Gilroy-Semibold"
  },

  activeText: {
    color: "#2D6CDF",
    fontFamily: "Gilroy-Bold"
    // fontWeight: "600",
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
    marginRight: 5,
  },
  name: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
    color: "#111827",
  },
  profileStatusBadge: {
    position: "absolute",
    top: 3,
    right: 3,
  },

  tickBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  statusIcon: {
    width: 14,
    height: 14,
    resizeMode: "contain",
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
    fontFamily: "Gilroy-Medium",
  },
  iconSmall: {
    width: 12,
    height: 12,
    marginHorizontal: 3,
  },
  detailText: {
    fontSize: 10,
    color: "#4B5563",
    fontFamily: "Gilroy-Medium"
  },
  rightSection: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 3,
    fontFamily: "Gilroy-Medium"
  },
  dueRow:{
flexDirection:"row",
alignItems:"center",
marginTop:4
},

dueLabel:{
fontSize:12,
color:"#4B4B4B",
marginRight:6,
marginTop:5,
  fontFamily: "Gilroy-Medium"
},

dueAmount:{
fontSize:14,
fontFamily:"Gilroy-Bold",
color:"#E02D2D",
marginTop:5
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
    bottom: 125,
    right: 35,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },

  addBtn: {
    position: "absolute",
    bottom: 60,
    right: 30,
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
    fontFamily: "Gilroy-Semibold",
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
    fontFamily: "Gilroy-Semibold",
  },
  // popupOverlay: {
  //   position: "absolute",
  //   top: 10,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: "transparent",
  // },
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



  // popupBox: {
  //   position: "absolute",
  //   width: 200,
  //   backgroundColor: "#fff",
  //   borderRadius: 12,
  //   elevation: 20,
  //   paddingVertical: 10,
  //   zIndex: 10000,
  // },
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

  // label: {
  //   fontSize: 13,
  //   color: "#6B7280",
  //   marginBottom: 6,
  //   marginTop: 10,
  // },

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




  dropdownContent: {
    // minHeight: 130,   
    height: 'auto',
    maxHeight: 130
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
    fontFamily: "Gilroy-Semibold",
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

  quickText: { color: "#111", fontFamily: "Gilroy-Medium" },

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
    fontFamily: "Gilroy-Semibold",
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
    fontFamily: "Gilroy-Semibold",
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
    gap: 10
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

  ReceiptcancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2D6CDF",
    alignItems: "center",
    marginRight: 30,
  },
  receiptDeleteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#2D6CDF",
    alignItems: "center",
  },



  cancelText: {
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
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
    fontFamily: "Gilroy-Semibold",
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
    fontFamily: "Gilroy-Semibold",
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
  recurringTransactionSheet:{
       backgroundColor: "#fff",
    padding: s(20),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: vs(50),
    minHeight: vs(280),
    maxHeight: vs(420),
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
  resetTextSmall: { color: "#2D6CDF", fontFamily: "Gilroy-Semibold", marginLeft: 10 },

  dateRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  dateBox: { width: "48%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 12 },
  // dateText: { color: "#111" },
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
  quickText: { color: "#111", fontFamily: "Gilroy-Medium" },
  //  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 72 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontFamily: "Gilroy-Bold" },
  applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontFamily: "Gilroy-Bold" },
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

  billNumber: {
    color: "#555",
    fontSize: 13,
    alignSelf: "center",
    fontFamily: "Gilroy-Semibold"
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
    width: 13,
    height: 13,
    marginRight: 6,
  },

  value: {
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
    color: "#000",
  },

  amountValue: {
    fontSize: 15,
    fontFamily: "Gilroy-Bold",
    color: "#000",
  },

  dueValue: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "red",
  },

  previewBtn: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 2,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },


  previewText: {
    color: "#111",
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
  },


  primaryBtn: {
    backgroundColor: "#1E45E1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 6,
  },

  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
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
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    fontSize: 15,
    // marginBottom: 5,
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

  dateOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    width: "85%",
    elevation: 10,
  },

  // statusIcon: {
  //   width: 15,
  //   height: 15,
  //   marginRight:7,
  //   marginBottom:3
  // },

  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF0000",
    borderWidth: 2,
    borderColor: "#fff",
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

  bottomActionBar: {
    flexDirection: "row",
    // justifyContent:"space-between",
    marginTop: 20,
    alignItems: "center"
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

  /* PAID BUTTON */
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
    marginRight:15
  },

  iconBtn: {
    backgroundColor: "#F3F4F6",
    // padding:14,
    paddingVertical: 14,
    paddingHorizontal: 37,
    borderRadius: 10,
    marginRight:10
  },

  recordBtn: {
    backgroundColor: "#00A32E",
    paddingVertical: 14,
    paddingHorizontal: 37,
    borderRadius: 10,
    // marginLeft:5
  },

  bottomText: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: "Gilroy-Semibold"
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
  bottomBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5
  },



  recordText: {
    color: "#fff",
    marginLeft: 6,
    fontFamily: "Gilroy-Semibold"
  },

  // bottomText:{
  // fontSize:12,
  // fontFamily:"Gilroy-Semibold"
  // },



  recordIcon: {
    width: 24,
    height: 24,
    marginRight: 10
    // tintColor:"#fff"
  },
  labelOn: { fontSize: s(12), color: "#3562FF", marginBottom: 2, marginRight: s(5) , fontFamily: "Gilroy-Medium"},
  switch: {
    width: s(42),
    height: s(24),
    borderRadius: 20,
    padding: s(3),
    justifyContent: "center",
  },
  knob: {
    width: s(18),
    height: s(18),
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
