import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
  BackHandler,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  PanResponder, KeyboardAvoidingView, Keyboard, SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import EmptyStateImage from "../../../Assets/Images/Empty_state.png"
import Loader from "../../../Component/Loader/Loader"
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import AddBankingDesign from "./AddBanking"
import AddTransaction from "./AddTransaction"
import SelfTransferModal from "./SelfTransferScreen";
import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { PGContext } from "../../../Context/PGContext";
import { useHasPermission } from "../../../Utils/useHasPermission";
import FilterIcon from "../../../Assets/Images/filter.png";
import AddIcon from "../../../Assets/Images/add-circle.png";
import AddBankIcon from "../../../Assets/Images/plusIcon.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import BankIcon from "../../../Assets/Images/Expensebank.png";
import UpiIcon from "../../../Assets/Images/Upi_Icon.png";
import CardIcon from "../../../Assets/Images/card.png";
import CashIcon from "../../../Assets/Images/Cash_Icon.png";
import GooglePayIcon from "../../../Assets/Images/GpayIcon.png";
import DeleteIcon from "../../../Assets/Images/trash.png";
import EditIcon from "../../../Assets/Images/editIcon.png";
import SelfTransIcon from "../../../Assets/Images/arrow-transfer.png";
import InvestmentIcon from "../../../Assets/Images/Investment.png";
import ThreeDotsIcon from "../../../Assets/Images/3dots.png";

import MoneyPlus from "../../../Assets/Images/money_plus.png";
import MoneyMinus from "../../../Assets/Images/money-minus.png";
import ArrowUp from "../../../Assets/Images/arrow-up.png";
import ArrowDown from "../../../Assets/Images/arrow-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import SearchIcon from "../../../Assets/Images/SearchIcon.png";
import BackIcon from "../../../Assets/Images/Arrow_left.png";

import FilterBottomSheet from "../Reports/FilterBottomSheet"



export default function NewBankingList() {
  const navigation = useNavigation();
  dayjs.extend(customParseFormat)

  const { activeHostelId } = useContext(CommonContexts);
  const { getBankOverview, NewgetBankList, bankList, getAllTransactions, newtransactionList, loading, errorMsg, getBankListByHostel, AddBankAmount } =
    useContext(BankingContext);

  const { getParticularHostelDetails, PGDetails } = useContext(PGContext);

  console.log("bankinglist", bankList,);
  console.log("transactionList", newtransactionList,);


  const [showAddBalance, setShowAddBalance] = useState(false);
  const [addBankName, setAddBankName] = useState("");
  const [addBankAmount, setAddBankAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [selectedBankId, setSelectedBankId] = useState(null);

  const [selectedBank, setSelectedBank] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const [addbankingshow, setAddBankingShow] = useState(false)

  const [editMode, setEditMode] = useState({ mode: "add", tab: "Bank" });
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteshow, setDeleteShow] = useState(false)
  const [transactionshow, setTransactionShow] = useState(false)
  const [showtransaction, setShowTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const [selfTransferScreen, setSelfTransferScreen] = useState(false)
  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const filterOptions = newtransactionList?.filterOptions;

  const dateFilterOptions =
    filterOptions?.dateFilter?.map((item) => ({
      label: item?.name,
      value: item?.type,
    })) || [];

  const sourceOptions =
    filterOptions?.source?.map((item) => ({
      label: item?.name,
      value: item?.type,
    })) || [];

  const [selectedDateFilter, setSelectedDateFilter] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);

  const [tempDateFilter, setTempDateFilter] = useState([]);
  const [tempSource, setTempSource] = useState([]);

  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false);


  const [billStatus, setBillStatus] = useState([]);
  const [type, setType] = useState([]);
  const [mode, setMode] = useState([]);
  const [sharingtype, setSharingTypes] = useState([]);
  const [filterError, setFilterError] = useState("");
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [typeSheetOpen, setTypeSheetOpen] = useState(false);
  const [sharingtypeOpen, setSharingTypeOpen] = useState(false);

  const [tempStatus, setTempStatus] = useState([]);
  const [tempType, setTempType] = useState([]);
  const [tempsharingType, setTempSharingype] = useState([]);

  const isValidSubscription = PGDetails?.isSubscriptionActive;
  const isSubscriptionAllow = isValidSubscription



  const {
    canWriteModule: canWriteBanking,
    canReadModule: canReadBanking,
    canUpdateModule: canUpdateBanking,
    canDeleteModule: canDeleteBanking,
  } = useHasPermission("Banking")

  console.log("selectedTransaction", selectedTransaction);



  if (!canReadBanking && !loading) {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.headerRow}>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image source={BackIcon} style={styles.backArrow} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Image source={EmptyStateImage} style={styles.emptyImage} />
          <Text style={{ fontSize: 16, color: "#888", marginTop: 20 }}>
            You don’t have permission to view Banking details
          </Text>
        </View>
      </SafeAreaView>
    );
  }



  // const bankList = [
  //   {
  //     id: 1,
  //     title: "Canara Bank",
  //     subtitle: "Savings A/C",
  //     name: "Immanuel",
  //     acc: "4561 2013 6210 6540",
  //     balance: "₹2,500",
  //     Icon : BankIcon
  //   },
  //   {
  //     id: 2,
  //     title: "UPI",
  //     subtitle: "Net Banking",
  //     name: "Immanuel",
  //     acc: "imman@oksbi",
  //     balance: "₹2,100",
  //      Icon : UpiIcon
  //   },
  //     {
  //     id: 3,
  //     title: "Card",
  //     subtitle: "Credit Card",
  //     name: "Immanuel",
  //     acc: "imman@oksbi",
  //     balance: "₹4,000",
  //      Icon : CardIcon
  //   },
  //   {
  //     id: 4,
  //     title: "Cash",
  //     subtitle: "Petty Cash",
  //     name: "Immanuel",
  //     acc: "",
  //     balance: "₹4,320",
  //      Icon : CashIcon
  //   },
  // ];

  // const transactions = [
  //   { id: 1, type: "income", title: "Record Payment", ArrowImage: ArrowUp, icon: MoneyPlus, category: "Rent Income", amount: "+ ₹7,500.00", date: "12 May 2025", },
  //   { id: 2, type: "expense", title: "Asset Purchase", ArrowImage: ArrowDown, icon: MoneyMinus, category: "Capital Expenditure", amount: "- ₹12,500.00", date: "12 May 2025" },
  //   { id: 3, type: "selftransfer", title: "self transfer", ArrowImage: SelfTransIcon, icon: MoneyMinus, category: "Checkout", amount: "- ₹1,250.00", date: "12 May 2025" },
  //   { id: 4, type: "income", title: "Bills", category: "Income", ArrowImage: ArrowUp, icon: MoneyPlus, amount: "+ ₹1,250.00", date: "12 May 2025" },
  //   { id: 5, type: "expense", title: "Checkout", category: "Checkout", ArrowImage: ArrowDown, icon: MoneyMinus, amount: "- ₹1,200.00", date: "12 May 2025" },
  //   { id: 6, type: "expense", title: "Assest", category: "Checkout", ArrowImage: ArrowDown, icon: MoneyMinus, amount: "- ₹1,100.00", date: "12 May 2025" },
  //   { id: 7, type: "income", title: "Checkout", category: "Checkout", ArrowImage: ArrowUp, icon: MoneyPlus, amount: "- ₹1,200.00", date: "12 May 2025" },
  //   { id: 8, type: "expense", title: "Assest", category: "Checkout", ArrowImage: ArrowDown, icon: MoneyMinus, amount: "- ₹1,100.00", date: "12 May 2025" },
  //   { id: 9, type: "expense", title: "Assest", category: "Checkout", ArrowImage: ArrowDown, icon: MoneyMinus, amount: "- ₹1,100.00", date: "12 May 2025" },
  //   { id: 10, type: "expense", title: "Checkout", category: "Checkout", ArrowImage: ArrowDown, icon: MoneyMinus, amount: "- ₹1,200.00", date: "12 May 2025" },
  //   { id: 11, type: "expense", title: "Assest", category: "Checkout", ArrowImage: ArrowDown, icon: MoneyMinus, amount: "- ₹1,100.00", date: "12 May 2025" },
  // ];

  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");



  const amountOptions = [
    "Low to High (Lowest First)",
    "High to Low (Highest First)",
    "Newest First",
    "Oldest First",
  ];
  const [amountSelected, setAmountSelected] = useState(amountOptions[0]);
  const [amountDropdownVisible, setAmountDropdownVisible] = useState(false);

  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");


  const dummyData = [
    { name: "Refrigerator", model: "6987165476", brand: "Whirlpool", price: "₹16,500" },
    { name: "Refrigerator", model: "6987165476", brand: "Whirlpool", price: "₹16,500" },
    { name: "Ceiling Fan", model: "SB-989543", brand: "Crompton", price: "₹2,500" },
    { name: "Mattresses", model: "SB-989543", brand: "CURL ON", price: "₹7,500" },
  ];


  // useEffect(() => {
  //   if (activeHostelId) {
  //     getBankListByHostel(activeHostelId);
  //   }
  // }, [activeHostelId])


  useEffect(() => {
    if (activeHostelId) {
      NewgetBankList(activeHostelId);
    }
  }, [activeHostelId]);


  useEffect(() => {
    if (activeHostelId) {
      getAllTransactions(activeHostelId);
    }
  }, [activeHostelId]);


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
      if (showAddBalance) {
        setShowAddBalance(false)
        return true;
      }


      return false;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [showFilter, openFrom, openTo, amountDropdownVisible, showAddBalance]);



  useFocusEffect(
    useCallback(() => {

      const onBackPress = () => {

        if (selfTransferScreen) {
          setSelfTransferScreen(false)
          return true;
        }

        if (showFilter) {
          setShowFilter(false);
          return true;
        }

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
    }, [
      showFilter, selfTransferScreen,
      navigation
    ])
  );

  const translateY = useRef(new Animated.Value(0)).current;
  const detailsY = useRef(new Animated.Value(0)).current;
  const assignTranslateY = useRef(new Animated.Value(0)).current;


  const getUniqueBanks = (banks = []) => {
    const map = new Map();

    banks.forEach((b) => {
      let key = "";

      if (b.accountType === "BANK") {
        key = `BANK-${b.bankName}-${b.accountNumber}`;
      } else if (b.accountType === "UPI") {
        key = `UPI-${b.upiId}`;
      } else if (b.accountType === "CARD") {
        key = `CARD-${b.creditCardNumber || b.debitCardNumber}`;
      } else if (b.accountType === "CASH") {
        key = "CASH";
      }

      if (!map.has(key)) {
        map.set(key, b);
      }
    });

    return Array.from(map.values());
  };

  const transactions = [
    {
      id: 1,
      type: "expense",
      title: "Expense",
      amount: "₹ 12,500.00",
      date: "18 July 2026, 10:30 AM",
      icon: ArrowDown,
      account: BankIcon,
    },
    {
      id: 2,
      type: "transfer",
      title: "Self transfer",
      amount: "₹ 2,700.00",
      date: "18 July 2026, 10:30 AM",
      icon: SelfTransIcon,
      from: GooglePayIcon,
      to: CardIcon,
    },
    {
      id: 3,
      type: "income",
      title: "Income",
      amount: "₹ 2,700.00",
      date: "18 July 2026, 10:30 AM",
      icon: ArrowUp,
      account: GooglePayIcon,
    },
    {
      id: 4,
      type: "investment",
      title: "Investment",
      amount: "₹ 27,000.00",
      date: "18 July 2026, 10:30 AM",
      icon: InvestmentIcon,
      account: GooglePayIcon,
    },
  ];

  const applyTransactionFilters = async ({
    dateFilter = selectedDateFilter,
    source = selectedSource,
    fromDate,
    toDate,
  } = {}) => {
    if (!activeHostelId) return;

    console.log("Applying Banking Filters:", {
      dateFilter,
      source,
      fromDate,
      toDate,
    });

    await getAllTransactions(
      activeHostelId,
      1,
      20,
      {
        dateFilter,
        source,
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate }),
      }
    );
  };

  const handleApplyFilter = async () => {
    if (!canReadBanking || !activeHostelId) return;

    const filters = {
      dateFilter: tempDateFilter,
      source: tempSource,
    };

    console.log("FULL BANKING FILTER:", filters);

    setSelectedDateFilter(tempDateFilter);
    setSelectedSource(tempSource);

    await getAllTransactions(activeHostelId, filters);

    setShowFilter(false);
  };


  // const mappedBankList = (bankList || []).map((item) => {
  //   const type = item.accountType;

  //   return {
  //     id: item?.bankId || item?.bankingId,

  //     title:
  //       type === "BANK"
  //         ? item.bankName
  //         : type === "CASH"
  //           ? item.accountHolderName
  //           : "Card",

  //     subtitle:
  //       type === "BANK"
  //         ? "Bank Account"
  //         : type === "CASH"
  //           ? "Cash Account"
  //           : "Card",

  //     name: item.accountHolderName,

  //     acc:
  //       type === "BANK"
  //         ? item.accountNumber
  //         : type === "CARD"
  //           ? item.creditCardNumber || item.debitCardNumber
  //           : "",

  //     balance: Number(item.accountBalance ?? item.balance ?? 0),

  //     branch: item.branchName || "",

  //     isDefault: item.isDefault,

  //     isActive: !item.isDeleted,

  //     Icon:
  //       type === "BANK"
  //         ? BankIcon
  //         : type === "CASH"
  //           ? CashIcon
  //           : CardIcon,

  //     raw: item,
  //   };
  // });


  // const mappedTransactions = (transactionList || []).map((t) => {
  //   const isCredit = t.type === "CREDIT";

  //   return {
  //     id: t.transactionId,
  //     type: isCredit ? "income" : "expense",
  //     title: t.source === "INVOICE" ? "Bill Payment" : "Transaction",
  //     category: t.source,
  //     Accountholder: t.accountHolder,
  //     amount: `${isCredit ? "+" : "-"} ₹${t.amount}`,
  //     date: dayjs(t.createdAt, "DD/MM/YYYY", true).isValid()
  //       ? dayjs(t.createdAt, "DD/MM/YYYY", true).format("DD/MM/YYYY")
  //       : t.createdAt,
  //     ArrowImage: isCredit ? ArrowUp : ArrowDown,
  //     icon: isCredit ? MoneyPlus : MoneyMinus,
  //     raw: t,
  //   };
  // });

  const mappedBankList = (newtransactionList?.bankList || []).map((item) => {
    const type = item.accountType;

    return {
      id: item.bankId,

      title:
        type === "BANK"
          ? item.bankName || "Bank"
          : type === "CASH"
            ? "Cash"
            : type === "CARD"
              ? "Card"
              : "UPI",

      subtitle:
        type === "BANK"
          ? "Bank Account"
          : type === "CASH"
            ? "Cash Account"
            : type === "CARD"
              ? "Card"
              : "UPI",

      name: item.accountHolderName,

      acc:
        type === "BANK"
          ? item.accountNumber
          : type === "CARD"
            ? item.cardNumber
            : type === "UPI"
              ? item.upiId
              : "",

      balance: Number(item.balance ?? 0),

      branch: item.branchName || "",

      isDefaultAccount: item.isDefaultAccount,

      Icon:
        type === "BANK"
          ? BankIcon
          : type === "CASH"
            ? CashIcon
            : type === "CARD"
              ? CardIcon
              : UpiIcon,

      raw: item,
    };
  });

  const mappedTransactions = (newtransactionList?.transactions || []).map((t) => {
    const isCredit = t.type === "CREDIT";
    const isSelfTransfer = t.source === "SELF_TRANSFER";
    const isInvestment = t.source === "ASSETS";

    return {
      id: t.transactionId,

      // Self transfer needs its own blue presentation, while the amount
      // color still follows CREDIT / DEBIT like the Figma design.
      type: isSelfTransfer
        ? "selftransfer"
        : isInvestment
          ? "Assets"
          : isCredit
            ? "income"
            : "expense",

      title: isSelfTransfer
        ? "Self transfer"
        : isInvestment
          ? "Assets"
          : t.source || "Transaction",

      amount: `₹${Number(t.transactionAmount ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,

      date: dayjs(t.createdAt).format("DD MMM YYYY, hh:mm A"),

      icon: isSelfTransfer
        ? SelfTransIcon
        : isInvestment
          ? InvestmentIcon
          : isCredit
            ? ArrowUp
            : ArrowDown,

      // Figma: Self Transfer = #1E45E1, Investment = purple,
      // Income = green, Expense = red.
      iconBackgroundColor: isSelfTransfer
        ? "#1E45E1"
        : isInvestment
          ? "#6B3FB8"
          : isCredit
            ? "#05964B"
            : "#EB2D2D",

      // Prefer the actual bank account when bankId is available.
      // This also keeps ASSETS / SELF_TRANSFER rows from falling back
      // to the card icon when bankAccountType is not populated.
      account:
        t.bankAccountType || t.bankId
          ? BankIcon
          : t.cashAccountType
            ? CashIcon
            : t.cardNumber || t.cardNetwork
              ? CardIcon
              : t.linkedUpiId || t.upiApp
                ? UpiIcon
                : null,

      raw: t,
    };
  });



  const handleShowAddBalance = (item) => {
    setAddBankName(`${item.name} - ${item.title}`);
    setSelectedBankId(item.id);
    setShowAddBalance(true);
  };



  // const handleAddBankAmount = (v) => {
  //   if (!/^\d*$/.test(v)) return;
  //   if (/^0+$/.test(v)) return;

  //   setAddBankAmount(v);
  //   setAmountError("");
  // }

  const handleAddBankAmount = (v) => {
    let cleaned = v.replace(/[^0-9.]/g, "");

    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts[1];
    }

    if (parts[1]?.length > 2) {
      cleaned = parts[0] + "." + parts[1].slice(0, 2);
    }

    const num = Number(cleaned);

    if (cleaned && num === 0) {
      setAddBankAmount(cleaned);
      setAmountError("Amount must be greater than 0");
      return;
    }

    if (cleaned && (isNaN(num) || num < 0)) {
      setAmountError("Enter valid amount");
      return;
    }

    setAddBankAmount(cleaned);
    setAmountError("");
  };

  const closeAddBalancePopup = () => {
    setShowAddBalance(false);
    setAddBankName("");
    setAddBankAmount("");
    setAmountError("");
    setSelectedBankId(null);
  };



  // const handleAddAmountSubmit = async () => {
  //   if (!addBankAmount.trim()) {
  //     setAmountError("Please Enter Amount");
  //     return;
  //   }

  //   const res = await AddBankAmount(
  //     activeHostelId,
  //     selectedBankId,
  //     addBankAmount
  //   );

  //   if (res.success) {
  //     setModalType("success");
  //     setModalMessage(res?.message || "Amount Added Successfully");
  //     setShowSuccessModal(true);

  //     closeAddBalancePopup()
  //     setTimeout(() => {
  //       setShowSuccessModal(false);
  //     }, 1200);

  //   } else {
  //     setAmountError(res?.message);
  //   }
  // };

  const handleClearSearch = async () => {
    setSearchText("");
    setSearchOpen(false);

  };

  const handleAddAmountSubmit = async () => {
    const num = Number(addBankAmount);

    if (!addBankAmount.trim()) {
      setAmountError("Please Enter Amount");
      return;
    }

    if (isNaN(num) || num <= 0) {
      setAmountError("Amount must be greater than 0");
      return;
    }

    const res = await AddBankAmount(
      activeHostelId,
      selectedBankId,
      addBankAmount
    );

    if (res?.success) {
      setModalType("success");
      setModalMessage(res?.message || "Amount Added Successfully");
      setShowSuccessModal(true);

      closeAddBalancePopup();

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1200);
    } else {
      setAmountError(res?.message);
    }
  };

  const addBalanceTranslateY = useRef(new Animated.Value(0)).current;

  const addBalancePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) addBalanceTranslateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(addBalanceTranslateY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            addBalanceTranslateY.setValue(0);
            closeAddBalancePopup(); // 🔥 RESET + CLOSE
          });
        } else {
          Animated.spring(addBalanceTranslateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(addBalanceTranslateY, {
        toValue: -e.endCoordinates.height + 60,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(addBalanceTranslateY, {
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




  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          Animated.timing(translateY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setShowTransaction(false);
            translateY.setValue(0);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
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


  const scrollY = useRef(new Animated.Value(0)).current;


  const bankListHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [295, 0], // அல்லது 290
    extrapolate: "clamp",
  });

  const bankListOpacity = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [1, 20],
    extrapolate: "clamp",
  });

  const bankTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -180],
    extrapolate: "clamp",
  });

  const bankOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });


  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const dotsRef = useRef({});

  const openMenu = (item) => {
    setSelectedItem(item);
    dotsRef.current[item.id].measure((fx, fy, width, height, px, py) => {
      setPopupPosition({ x: px, y: py });
      setShowMenu(true);
    });
  };



  // const handleAddBanking = () => {
  //   setAddBankingShow(true)
  // }


  const handleAddBanking = () => {
      if (!canWriteBanking || !isSubscriptionAllow) return;
    navigation.navigate("AddBankAccount")
    // setEditMode({ mode: "add", tab: "Bank", raw: null, bankId: null });
    // setAddBankingShow(true);
  };

  const handleCloseAddBanking = () => {
    setAddBankingShow(false);
    setEditMode({ mode: "add", tab: "Bank", raw: null, bankId: null });
  };

  const handleDeleteShow = () => {
    setDeleteShow(true)
    setShowMenu(false);
  }

  const handleCloseDeleteShow = () => {
    setDeleteShow(false)
  }

  const handleEditBanking = (item) => {
    setShowMenu(false);
    setAddBankingShow(true);

    setEditMode({
      mode: "edit",
      tab:
        item.raw.accountType === "BANK" ? "Bank" :
          item.raw.accountType === "UPI" ? "UPI" :
            item.raw.accountType === "CARD" ? "Card" :
              "Cash",
      raw: item.raw,
      bankId: item.raw.bankingId
    });
  };



  const handleShowAddTransaction = () => {
    navigation.navigate("AddTransaction")
  }

  const handleshowTransaction = (item) => {
    setShowTransaction(true)
    setSelectedTransaction(item);
    setShowFilter(false);
  }


  if (!activeHostelId && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={ArrowLeft} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>Banking</Text>
          </View>
        </View>

        <View style={styles.emptyContainer}>
          <Image source={EmptyStateImage} style={styles.emptyImage} />
          <Text style={styles.emptyText}>No Banks are there!</Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <>
      {loading && <Loader />}
      <View style={styles.container}>

        <View style={styles.stickyHeader}>
          <View style={styles.headerRow}>

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Image source={BackIcon} style={styles.backArrow} />
            </TouchableOpacity>

            {!searchOpen ? (
              <>
                <Text style={styles.headerTitle}>Banking</Text>

                <TouchableOpacity
                  style={styles.searchBtn}
                  onPress={() => setSearchOpen(true)}
                  disabled
                >
                  <Image source={SearchIcon} style={styles.headerSearchIcon} />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.searchWrapper}>
                <TextInput
                  placeholder="Search Banking"
                  value={searchText}
                  onChangeText={(text) => {
                    setSearchText(text);
                    //   handleSearch(text);
                  }}
                  style={styles.searchInput}
                  placeholderTextColor="#9CA3AF"
                  autoFocus
                />

                <TouchableOpacity
                  onPress={handleClearSearch}
                >
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>


          {/* <View style={styles.searchBox}>
            <Image
              source={SearchIcon}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#A1A1A1"
              style={styles.searchInput}
            />
          </View> */}
        </View>

        {console.log("sillana", mappedBankList)}

        {!loading && (

          <>


            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 110 }}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
            >

              {/* 
              <Animated.View style={{ opacity: bankListOpacity }}>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  alignItems: "center",
                  marginTop: 33, marginBottom: 10
                }}>
                  <Text style={styles.sectionTitle}>Bank List</Text>

                  <TouchableOpacity
                    style={[
                      styles.addBankBtn,
                      !canWriteBanking && { opacity: 0.4 }
                    ]}
                    disabled={!canWriteBanking}
                    onPress={handleAddBanking}>
                    <Text style={styles.addBankText}>Add Bank</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View> */}


              <Animated.View style={{ height: bankListHeight, opacity: bankListOpacity, }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {mappedBankList.map((item, index) => {

                    const type = item.raw?.accountType;

                    return (

                      <TouchableOpacity
                        // key={item.id}
                        key={`${item.id}-${index}`}
                        onPress={() => {
                          navigation.navigate("BankingDetails", {
                            bankDetails: item?.raw,
                            bankId: item?.id,
                          })
                          console.log("item", item?.raw,);

                          getBankOverview(activeHostelId, item?.id);
                        }

                        }
                        style={[
                          styles.bankCard,

                          type === "CASH" && styles.cashCard,

                          type === "CARD" && styles.creditCard,

                          type === "BANK" && styles.bankAccountCard,
                        ]}
                      >

                        {/* HEADER */}

                        <View style={styles.cardHeader}>

                          <View style={styles.headerLeft}>

                            <View
                              style={[
                                styles.iconCircle,

                                type === "BANK" && {
                                  backgroundColor: "#EEF2FF"
                                },

                                type === "CASH" && {
                                  backgroundColor: "#E9FFF1"
                                },

                                type === "CARD" && {
                                  backgroundColor: "#FFF3E8"
                                }

                              ]}
                            >

                              <Image
                                source={
                                  type === "BANK"
                                    ? BankIcon
                                    : type === "CASH"
                                      ? CashIcon
                                      : CardIcon
                                }
                                style={styles.bankIcon}
                              />

                            </View>

                            <View>

                              {/* <Text style={styles.bankName}>
              {type === "CASH"
                ? "Petty Cash"
                : item.title}
                
            </Text> */}

                              <Text style={styles.bankName}>
                                {item?.title}
                              </Text>

                              {/* <Text style={styles.bankType}>
                                {type === "BANK"
                                  ? "Bank Account"
                                  : type === "CASH"
                                    ? "Cash Account"
                                    : "Credit Card"}
                              </Text> */}

                              <Text style={styles.bankType}>
                                {item?.subtitle}
                              </Text>

                            </View>

                          </View>

                          <TouchableOpacity>
                            <Image source={ThreeDotsIcon} style={styles.moreIcon} />
                          </TouchableOpacity>

                        </View>

                        {/* BALANCE */}

                        {/* <Text style={styles.balanceAmount}>
                          ₹{Number(item.balance).toLocaleString("en-IN")}
                        </Text> */}

                        <Text style={styles.balanceAmount}>
                          ₹{item?.balance.toLocaleString("en-IN")}
                        </Text>

                        <Text style={styles.balanceLabel}>
                          Balance
                        </Text>

                        {/* CHIPS */}

                        <View style={styles.tagRow}>

                          {/* {
                            type !== "CASH" && (
                              <View style={styles.locationChip}>
                                <Text>📍 {item?.branch}</Text>
                              </View>
                            )
                          } */}

                          {item.raw.accountType === "BANK" && item.branch ? (
                            <View style={styles.locationChip}>
                              <Text numberOfLines={1}>
                                📍 {item.branch}
                              </Text>
                            </View>
                          ) : null}

                          {/* {item?.raw?.accountType === "BANK" && (
  <View style={styles.upiChip}>
    <Text numberOfLines={1}>
      A/C : {item.acc}
    </Text>
  </View>
)} */}


                          {/* {item.raw.accountType === "CASH" && (
  <View style={styles.upiChip}>
    <Text numberOfLines={1}>
      Cash Account
    </Text>
  </View>
)} */}
                          {
                            type === "BANK" && item?.upiId ? (
                              <View style={styles.upiChip}>
                                <Text numberOfLines={1}>
                                  UPI : {item.acc}
                                </Text>
                              </View>
                            ) : null
                          }

                          {
                            type === "CARD" && (
                              <View style={styles.upiChip}>
                                <Text numberOfLines={1}>
                                  **** **** {item.acc?.slice(-4)}
                                </Text>
                              </View>
                            )
                          }

                          {item?.isDefaultAccount && (
                            <View style={styles.defaultChip}>
                              <Text style={styles.defaultChipText}>Default A/C</Text>
                            </View>
                          )}

                        </View>

                        <Text style={styles.lastTxn}>
                          {
                            type === "CARD"
                              ? "Due Date : 10 Jun 2026"
                              : "Last Txn : Today, 10:30 AM"
                          }
                        </Text>

                      </TouchableOpacity>

                    );

                  })}

                  {/* ADD CARD */}

                  <TouchableOpacity
                    // style={[styles.addNewCard, !canWriteBanking && { opacity: 0.4 }]}
                    // disabled={!canWriteBanking}

                    style={[
                      styles.addNewCard,
                      (!canWriteBanking || !isSubscriptionAllow) && {
                        opacity: 0.4,
                      },
                    ]}
                    disabled={!canWriteBanking || !isSubscriptionAllow}
                    onPress={handleAddBanking}
                  >

                    <View style={{ height: 50, width: 50 }}>
                      <Image source={AddBankIcon} style={styles.addIcon} />
                    </View>

                    <Text style={styles.addText}>
                      Add New
                    </Text>

                    <Text style={styles.addText}>
                      Bank / Cash
                    </Text>

                  </TouchableOpacity>
                </ScrollView>
              </Animated.View>




              {/* <View style={[styles.rowBetween, { marginBottom: 15, marginTop: 20 }]}>
                <Text style={styles.sectionTitle}>All Transactions</Text>
              </View> */}

              <ScrollView
                horizontal
                persistentScrollbar={false}
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{
                  paddingLeft: 16,
                  paddingRight: 12,
                }}
              >
                <View style={styles.filterRow}>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >

                    {/* DATE FILTER */}
                    <TouchableOpacity
                      style={[
                        styles.filterBox,
                        selectedDateFilter.length > 0 &&
                        selectedDateFilter[0] !== "ALL" &&
                        styles.filterBoxActive,
                      ]}
                      onPress={() => {
                        setTempDateFilter(selectedDateFilter);
                        setDateSheetOpen(true);
                      }}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          selectedDateFilter.length > 0 &&
                          selectedDateFilter[0] !== "ALL" &&
                          styles.filterTextActive,
                        ]}
                      >
                        {selectedDateFilter.length === 0 ||
                          selectedDateFilter[0] === "ALL"
                          ? "All"
                          : dateFilterOptions.find(
                            (item) => item.value === selectedDateFilter[0]
                          )?.label || "All"}
                      </Text>

                      <Image
                        source={DownArrow}
                        style={{
                          width: 16,
                          height: 16,
                          marginLeft: 6,
                        }}
                      />
                    </TouchableOpacity>


                    {/* SOURCE FILTER */}
                    <TouchableOpacity
                      style={[
                        styles.filterBox,
                        selectedSource.length > 0 &&
                        styles.filterBoxActive,
                      ]}
                      onPress={() => {
                        setTempSource(selectedSource);
                        setSourceSheetOpen(true);
                      }}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          selectedSource.length > 0 &&
                          styles.filterTextActive,
                        ]}
                      >
                        {selectedSource.length === 0
                          ? "Source"
                          : `${sourceOptions.find(
                            (item) => item.value === selectedSource[0]
                          )?.label || selectedSource[0]}${selectedSource.length > 1
                            ? ` +${selectedSource.length - 1} more`
                            : ""
                          }`}
                      </Text>

                      <Image
                        source={DownArrow}
                        style={{
                          width: 16,
                          height: 16,
                          marginLeft: 6,
                        }}
                      />
                    </TouchableOpacity>

                  </View>


                  {/* FULL FILTER */}
                  {/* <TouchableOpacity
                    style={[
                      styles.filterIconBtn,
                      { marginLeft: 5 },
                    ]}
                    disabled={!canReadBanking}
                    onPress={() => setShowFilter(true)}
                  >
                    <Image
                      source={FilterIcon}
                      style={{
                        width: 18,
                        height: 18,
                      }}
                    />
                  </TouchableOpacity> */}

                </View>
              </ScrollView>



              <View style={{ paddingHorizontal: 20 }}>
                {/* <Text style={styles.todayText}>Today</Text> */}

                {mappedTransactions.map((item, index) => (
                  <TouchableOpacity
                    key={item?.id || index}
                    // key={item?.transactionId}
                    style={styles.transactionCard}
                  // onPress={() => handleshowTransaction(item)}
                  >
                    <View style={styles.leftSection}>
                      <View
                        style={[
                          styles.iconContainer,
                          {
                            backgroundColor: item.iconBackgroundColor,
                          },
                        ]}
                      >
                        <Image
                          source={item.icon}
                          style={styles.transactionIcon}
                        />
                      </View>

                      <View style={{ marginLeft: 18 }}>
                        <Text style={styles.transactionTitle}>
                          {item.title}
                        </Text>

                        <Text style={styles.transactionDate}>
                          {item.date}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rightSection}>
                      <Text
                        style={[
                          styles.transactionAmount,
                          {
                            color:
                              item.type === "income"
                                ? "#05964B"
                                : "#EB2D2D",
                          },
                        ]}
                      >
                        {item.type === "income" ? "+" : "-"} {item.amount}
                      </Text>

                      {item.account && (
                        <Image
                          source={item.account}
                          style={styles.smallIcon}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>




              {mappedTransactions && mappedTransactions?.length === 0 &&
                <View style={{ alignItems: "center", marginTop: 70 }}>
                  <Image
                    source={EmptyStateImage}
                    style={{ width: 250, height: 180, }}
                  />
                  <Text style={{ marginTop: 12, fontSize: 16, color: "#888" }}>
                    No Transaction Found
                  </Text>
                </View>
              }

            </Animated.ScrollView>



            {/* <TouchableOpacity
              style={[
                styles.filterBtn,
                !canReadBanking && { opacity: 0.4 }
              ]}
              disabled={!canReadBanking}
              onPress={() => setShowFilter(true)}>
              <Image source={FilterIcon} style={{ width: 25, height: 25 }} />
            </TouchableOpacity> */}


            {/* <TouchableOpacity 
        style={[
    styles.addBtn,
    !canWriteBanking && { opacity: 0.4 }
  ]}
      disabled={!canWriteBanking}
       onPress={handleShowAddTransaction}>
        <Image source={AddIcon} style={{ width: 25, height: 25 }} />
      </TouchableOpacity> */}

          </>

        )}







      </View>





      {showtransaction && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowTransaction(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[styles.transactionSheet, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.sheetHandle} />

            <Text style={{
              fontSize: 18,
              fontFamily: "Gilroy-Bold",
              marginBottom: 10,
            }}>Transaction Details</Text>

            {/* TOP ROW */}
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}>
              <View style={[
                styles.iconArrow,
                {
                  backgroundColor:
                    selectedTransaction.type === "income"
                      ? "#E4FFE8"
                      : selectedTransaction.type === "selftransfer"
                        ? "rgb(232,236,252)"
                        : "#FFE8E8"
                }
                ,
              ]}>

                <Image source={selectedTransaction.ArrowImage} style={{ height: 19, width: 19 }} />

              </View>

              <View>
                <Text style={styles.transTitle}>{selectedTransaction?.title}</Text>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{selectedTransaction?.category}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* FROM - TO */}
            <View style={styles.fromToRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>From</Text>
                <Text style={{
                  fontSize: 14,
                  color: "#000",
                  fontFamily: "Gilroy-Semibold", marginLeft: -3
                }}> {selectedTransaction?.raw?.accountHolder}</Text>
              </View>

              {/* <View style={{ flex: 1 }}>
          <Text style={styles.label}>To</Text>
          <Text style={styles.valueText}>N/A</Text>
        </View> */}
            </View>

            {/* AMOUNT */}

            <Text style={styles.label}>Amount</Text>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Image source={selectedTransaction.icon} style={{ height: 18, width: 18, marginRight: 5, marginTop: 5 }} />
              <Text
                style={[
                  styles.amountText,
                  { color: selectedTransaction?.type === "income" ? "green" : "red" },
                ]}
              >

                {selectedTransaction?.amount}
              </Text>
            </View>


            {/* DESCRIPTION */}
            {/* <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>
              {/* Transfer Rs:10,000 for Balance maintenance */}
            {/* {selectedTransaction?.raw?.referenceNumber || "-"}
            </Text> */}
          </Animated.View>
        </View>
      )}


      {showAddBalance && (
        <View style={styles.sheetOverlay}>
          {/* BACKGROUND TAP */}
          <TouchableWithoutFeedback onPress={closeAddBalancePopup}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.addBalanceSheet,
              { transform: [{ translateY: addBalanceTranslateY }] },
            ]}
            {...addBalancePanResponder.panHandlers}
          >
            {/* HANDLE */}
            <View style={styles.sheetHandle} />

            {/* HEADER */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add Balance</Text>
              <TouchableOpacity onPress={closeAddBalancePopup}>
                <Text style={{ fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* ACCOUNT */}
            <Text style={styles.label}>
              Account <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: "#F5F5F5" }]}
              value={addBankName}
              editable={false}
            />

            {/* AMOUNT */}
            <Text style={styles.label}>
              Balance <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              keyboardType="number-pad"
              value={addBankAmount}
              onChangeText={handleAddBankAmount}
            />

            {amountError && <ErrorMessage message={amountError} type="error" />}


            {/* BUTTON */}
            <TouchableOpacity
              style={styles.addBalanceBtn}
              onPress={handleAddAmountSubmit}
            >
              <Text style={styles.addBalanceBtnText}>Add balance</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      <FilterBottomSheet
        visible={dateSheetOpen}
        title="Date"
        options={dateFilterOptions}
        selectedValues={tempDateFilter}
        setSelectedValues={setTempDateFilter}

        onReset={async () => {
          setTempDateFilter([]);
          setSelectedDateFilter([]);
          setDateSheetOpen(false);

          await applyTransactionFilters({
            dateFilter: [],
            source: selectedSource,
          });
        }}

        onApply={async () => {
          setSelectedDateFilter(tempDateFilter);
          setDateSheetOpen(false);

          await applyTransactionFilters({
            dateFilter: tempDateFilter,
            source: selectedSource,
          });
        }}

        onClose={() => setDateSheetOpen(false)}
      />

      <FilterBottomSheet
        visible={sourceSheetOpen}
        title="Source"
        options={sourceOptions}
        selectedValues={tempSource}
        setSelectedValues={setTempSource}

        onReset={async () => {
          setTempSource([]);
          setSelectedSource([]);
          setSourceSheetOpen(false);

          await applyTransactionFilters({
            dateFilter: selectedDateFilter,
            source: [],
          });
        }}

        onApply={async () => {
          setSelectedSource(tempSource);
          setSourceSheetOpen(false);

          await applyTransactionFilters({
            dateFilter: selectedDateFilter,
            source: tempSource,
          });
        }}

        onClose={() => setSourceSheetOpen(false)}
      />



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
                  setFromDate(dayjs());
                  setToDate(dayjs());
                  setAmountSelected(amountOptions[0]);
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
                <Text style={styles.quickText}>Today</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickBtn} onPress={() => { setFromDate(dayjs().startOf("week")); setToDate(dayjs().endOf("week")); }}>
                <Text style={styles.quickText}>This Week</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickBtn} onPress={() => { setFromDate(dayjs().startOf("month")); setToDate(dayjs().endOf("month")); }}>
                <Text style={styles.quickText}>This Month</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: 18 }]}>Type</Text>

            <View
              style={styles.selectWrapper}
              onLayout={(event) => {
                const { y, height } = event.nativeEvent.layout;
                const screenHeight = Dimensions.get("window").height;
                const bottomSpace = screenHeight - (y + height);

                setOpenUpward(bottomSpace < 250);
              }}
            >
              <TouchableOpacity style={styles.selectBox} onPress={toggleAmountDropdown}>
                <Text style={styles.selectedText}>{amountSelected}</Text>
                <Image source={DownArrow} style={styles.downArrow} />
              </TouchableOpacity>

              {amountDropdownVisible && (
                <View style={[styles.dropdownMenu, openUpward ? { bottom: 58 } : { top: 58 }]}>
                  <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled showsVerticalScrollIndicator={true}>
                    {amountOptions.map((opt) => (
                      <TouchableOpacity key={opt} style={styles.option}
                        onPress={() => {
                          setAmountSelected(opt);
                          setAmountDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.optionText}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={async () => {
                  setSelectedDateFilter([]);
                  setSelectedSource([]);

                  setTempDateFilter([]);
                  setTempSource([]);

                  await getAllTransactions(
                    activeHostelId,
                    1,
                    20,
                    {}
                  );

                  setShowFilter(false);
                }}
              >
                <Text style={styles.resetBtnText}>
                  Reset All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilter(false)}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}







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

            <TouchableOpacity
              //                         style={[
              //   styles.popupRow,
              //   (!canWriteBanking || selectedItem?.isDeleted) && { opacity: 0.4 }
              // ]}

              style={[
                styles.popupRow,
                , { opacity: 0.4 }
              ]}
              disabled

              // disabled={!canWriteBanking || selectedItem?.isDeleted}
              onPress={() => {
                if (!canWriteBanking || selectedItem?.isDeleted) return;
                setShowMenu(false);
                setSelfTransferScreen(true);
              }}
            >
              <Image
                source={SelfTransIcon}
                style={styles.popupIcon}
              />
              <Text style={styles.popupText}>Self Transfer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              //  style={styles.popupRow} 
              //  onPress={()=>handleEditBanking(selectedItem)}

              style={[
                styles.popupRow,
                (!canUpdateBanking || selectedItem?.isDeleted) && { opacity: 0.4 }
              ]}

              disabled={!canUpdateBanking || selectedItem?.isDeleted}
              onPress={() => {
                if (!canUpdateBanking || selectedItem?.isDeleted) return;
                handleEditBanking(selectedItem);
              }}
            >
              <Image
                source={EditIcon}
                style={styles.popupIcon}
              />
              <Text style={styles.popupText}>Edit</Text>
            </TouchableOpacity>







            <TouchableOpacity

              //             style={[
              //   styles.popupRow,
              //   (!canDeleteBanking || selectedItem?.isDeleted) && { opacity: 0.4 }
              // ]}
              style={[
                styles.popupRow,
                , { opacity: 0.4 }
              ]}

              disabled

              // disabled={!canDeleteBanking || selectedItem?.isDeleted}
              onPress={() => {
                if (!canDeleteBanking || selectedItem?.isDeleted) return;
                handleDeleteShow();
              }}

            >
              <Image
                source={DeleteIcon}
                style={styles.popupIcon}
              />
              <Text style={styles.popupText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}


      {deleteshow && (
        <>
          <Modal
            transparent
            animationType="fade"
            visible={deleteshow}
            onRequestClose={handleCloseDeleteShow}
          >
            <View style={styles.deleteOverlay}>
              <View style={styles.deleteBox}>

                <Text style={styles.deleteTitle}>Delete Bank ?</Text>
                <Text style={styles.deleteSub}>
                  Are you sure you want to delete this Bank ?
                </Text>

                <View style={styles.deleteBtnRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={handleCloseDeleteShow}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={handleCloseDeleteShow}
                  >
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>
        </>
      )}

      {selfTransferScreen && (
        <SelfTransferModal
          visible={selfTransferScreen}
          onClose={() => setSelfTransferScreen(false)}
        />
      )}

      {addbankingshow && (
        <AddBankingDesign visible={addbankingshow} onClose={handleCloseAddBanking}
          mode={editMode.mode}
          editTab={editMode}
        />
      )

      }



    </>


  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* TOP STICKY HEADER */
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#fff",
    zIndex: 999,
    // elevation: 6,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  backIcon: { width: 20, height: 20, marginRight: 10 },

  heading: {
    fontSize: 22,
    fontFamily: "Gilroy-Bold",
  },

  // searchBox: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   borderWidth: 1,
  //   borderColor: "#D9D9D9",
  //   borderRadius: 14,
  //   paddingHorizontal: 14,
  //   paddingVertical: 6,
  //   marginBottom: 6,
  // },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
  },

  searchIcon: { width: 20, height: 20, tintColor: "#9B9B9B", marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    fontFamily: "Gilroy-Regular",

    paddingVertical: 0,

    ...(Platform.OS === "ios" && {
      height: 40,
    }),
  },
  // searchInput: { flex: 1, fontSize: 15, color: "#000" , fontFamily: "Gilroy-Regular" },

  sectionTitle: {
    fontSize: 17,
    fontFamily: "Gilroy-Bold",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 20,
  },

  addBankBtn: {
    backgroundColor: "#3D6DFF",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
  },

  addBankText: {
    color: "#fff",
    fontFamily: "Gilroy-Semibold",
    fontSize: 12,
  },
  bankCard: {
    width: 350,
    height: 265,
    backgroundColor: "#FFF",
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 14,
    overflow: "visible",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    borderWidth: 1,
    borderColor: "#E8E8E8",
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  bankIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  bankName: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Gilroy-Bold",
  },

  bankType: {
    fontSize: 14,
    color: "#8B8B8B",
    marginTop: 3,
    fontFamily: "Gilroy-Regular",
  },

  moreIcon: {
    width: 25,
    height: 25,
    tintColor: "#555",
  },

  amount: {
    fontSize: 42,
    color: "#333",
    fontFamily: "Gilroy-Bold",
  },

  balanceLabel: {
    fontSize: 17,
    color: "#8A8A8A",
    marginTop: 2,
    fontFamily: "Gilroy-Regular",
  },

  infoIcon: {
    position: "absolute",
    right: 0,
    top: 15,
  },

  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
  },

  locationChip: {
    backgroundColor: "#FFF5E8",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 34,
    justifyContent: "center",
    marginRight: 8,
  },

  locationText: {
    color: "#B27A17",
    fontSize: 12,
    fontFamily: "Gilroy-Semibold",
  },

  upiChip: {
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 34,
    justifyContent: "center",
    marginRight: 8,
    flex: 1,
  },

  upiText: {
    color: "#4B63FF",
    fontSize: 12,
    fontFamily: "Gilroy-Semibold",
  },

  defaultChip: {
    borderWidth: 1.4,
    borderColor: "#4F6BFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 34,
    justifyContent: "center",
  },

  defaultChipText: {
    color: "#4F6BFF",
    fontSize: 12,
    fontFamily: "Gilroy-Semibold",
  },

  lastTxn: {
    marginTop: 24,
    alignSelf: "flex-end",
    color: "#777",
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
  },

  bgImage: {
    flex: 1,
    padding: 16,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bankLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  bankIconBg: {
    backgroundColor: "#3D6DFF", borderRadius: '50%', padding: 5, justifyContent: 'center', marginRight: 5
  },

  bankIcon: {
    width: 17,
    height: 17,
  },

  //   moreIcon: {
  //     padding: 5,
  //   },

  bankTitle: {
    fontSize: 17,
    fontFamily: "Gilroy-Bold",
  },

  bankSub: {
    color: "#777",
    fontSize: 13,
    fontFamily: "Gilroy-Semibold",
  },

  // name: {
  //   fontSize: 15,
  // fontFamily: "Gilroy-Semibold",
  //   marginTop: 4,
  // },

  acc: {
    fontSize: 13,
    color: "#666",
  },

  defaultRow: {
    position: "absolute",
    right: 16,
    top: 75,
    alignItems: "flex-end",
  },

  // defaultText: {
  //   color: "green",
  //   fontSize: 11,
  //   fontWeight: "600",
  // },

  // changeText: {
  //   color: "blue",
  //   marginTop: 2,
  //   fontSize: 11,
  // },

  balanceRow: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderColor: "#E6E6E6",
  },


  balanceText: { color: "#777" },
  balanceAmount: { fontFamily: "Gilroy-Bold", fontSize: 16 },
  addAmountText: {
    color: "#1D5DFF",
    fontFamily: "Gilroy-Semibold",
  },


  middleRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  nameContainer: {
    flex: 1,              // 🔥 THIS IS THE KEY
    paddingRight: 10,     // gap before right column
  },

  name: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
    flexWrap: "wrap",
    flexShrink: 1,     // 🔥 MUST
  },


  acc: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  defaultColumn: {
    alignItems: "flex-end",
    width: 90,        // 🔥 prevents pushing left content
  },


  defaultText: {
    color: "green",
    fontSize: 11,
    fontFamily: "Gilroy-Semibold",
  },

  changeText: {
    color: "blue",
    marginTop: 2,
    fontSize: 11,
    fontFamily: "Gilroy-Semibold",
  },

  /* TRANSACTION CARD */
  transCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,

  },
  transLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,              // 🔥 IMPORTANT
  },

  transTextWrap: {
    flex: 1,              // 🔥 allows wrapping
    paddingRight: 8,
  },

  transTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
    flexShrink: 1,        // 🔥 MUST
    flexWrap: "wrap",
  },

  category: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    fontFamily: "Gilroy-Semibold",
  },

  transRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  iconArrow: {
    height: 36,
    width: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  transTitle: { fontSize: 16, fontFamily: "Gilroy-Semibold", },
  // category: { fontSize: 13, color: "#666" },
  date: { fontSize: 12, color: "#777", fontFamily: "Gilroy-Semibold", },
  amount: { fontSize: 16, fontFamily: "Gilroy-Bold" },

  /* FLOATING BUTTONS */
  filterBtn: {
    position: "absolute",
    bottom: 140,
    right: 25,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 6,
  },

  addBtn: {
    position: "absolute",
    bottom: 70,
    right: 20,
    backgroundColor: "#1D5DFF",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  /* POPUP */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupCard: {
    width: 180,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    elevation: 8,
  },

  popupItem: { paddingVertical: 12 },
  popupBlue: { color: "#3D6DFF", fontSize: 15 },
  popupRed: { color: "red", fontSize: 15 },


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
    width: 160,
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

  popupIcon: {
    width: 23,
    height: 23,
  },

  popupText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10
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
  },

  deleteTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
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
    marginRight: 10,
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
  },

  deleteBtnText: {
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
    color: "#fff",
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
    minHeight: 350,
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
    fontFamily: "Gilroy-Bold",
    marginBottom: 20,
  },


  //   sheetHandle: { width: 60, height: 4, backgroundColor: "#D1D5DB", alignSelf: "center", borderRadius: 20, marginBottom: 15 },


  topActions: { flexDirection: "row", alignItems: "center" },
  headerIcon: { width: 20, height: 20, marginLeft: 12 },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
    zIndex: 100,
  },

  //   headerRow: {
  //     height: 50,
  //     flexDirection: "row",
  //     alignItems: "center",
  //   },

  backIcon: { width: 22, height: 22, marginRight: 10 },

  title: { fontSize: 18, fontFamily: "Gilroy-Bold", },

  divider: { height: 1, backgroundColor: "#E8E8E8", marginVertical: 12 },

  twoColRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  colLeft: { width: "48%" },
  colRight: { width: "48%" },

  label: { fontSize: 13, color: "#7A7A7A", marginBottom: 6, fontFamily: "Gilroy-Semibold", },
  value: { fontSize: 15, fontFamily: "Gilroy-Semibold", color: "#000" },

  assignBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#1E45E1", paddingVertical: 14, borderRadius: 12, marginTop: 20 },
  assignIcon: { width: 18, height: 18, tintColor: "#fff", marginRight: 8 },
  assignText: { color: "#fff", fontSize: 16, fontFamily: "Gilroy-Bold", },

  iconBox: {
    height: 45,
    width: 45,
    borderRadius: 12,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  tag: {
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 5,
    alignSelf: "flex-start",
  },

  tagText: {
    fontSize: 12,
    color: "#666",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },

  fromToRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  // label: {
  //   fontSize: 13,
  //   color: "#888",
  //   marginBottom: 5,
  //   fontWeight: "600",
  // },

  valueText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Gilroy-Semibold",
  },

  amountText: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    marginBottom: 20,
  },

  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
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

  filterTitle: { fontSize: 20, fontFamily: "Gilroy-Bold", },
  resetTextSmall: { color: "#2D6CDF", ffontFamily: "Gilroy-Semibold", },

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
  quickText: { color: "#111", fontFamily: "Gilroy-Semibold", },
  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 42, marginBottom: 25 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontFamily: "Gilroy-Bold", },
  applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontFamily: "Gilroy-Bold", },

  addBalanceSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sheetTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
  },

  label: {
    fontSize: 14,
    fontFamily: "Gilroy-Medium",
    // marginTop: 10,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  addBalanceBtn: {
    backgroundColor: "#1E45E1",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30
  },

  addBalanceBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  emptyImage: {
    width: 250,
    height: 180,
    resizeMode: "contain",
    opacity: 0.9,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "Gilroy-Medium",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backArrow: { width: 22, height: 22 },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    color: "#111827",
    fontFamily: "Gilroy-Semibold",
  },

  searchBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerSearchIcon: {
    width: 24,
    height: 24,
  },

  searchWrapper: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: "#DDE3F0",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginLeft: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },

  closeIcon: {
    fontSize: 20,
    color: "#6B7280",
    fontWeight: "600",
  },
  addNewCard: {
    width: 120,
    height: 265,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#3D6DFF",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  addIcon: {
    width: 24,
    height: 24,
    margin: 10
  },

  addText: {
    fontSize: 16,
    color: "#2E5BFF",
    fontFamily: "Gilroy-Semibold",
    textAlign: "center",
  },
  cashCard: {
    backgroundColor: "#FFFFFF",
  },
  creditCard: {
    backgroundColor: "#FFFFFF",
  },
  bankAccountCard: {
    backgroundColor: "#FFFFFF",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  //  filterRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   marginTop: 12,
  //   marginBottom: 8,
  // },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginLeft: 8
  },

  filterChipActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF2FF",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  filterChipText: {
    fontSize: 13,
    color: "#374151",
  },

  filterChipTextActive: {
    fontSize: 13,
    color: "#2D6CDF",
    fontFamily: "Gilroy-Semibold",
  },

  filterIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    // backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  chipContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  chipArrow: {
    width: 14,
    height: 14,
    marginLeft: 6,
  },
  todayText: {
    fontSize: 18,
    fontFamily: "Gilroy-SemiBold",
    color: "#1A1A1A",
    marginBottom: 18,
  },

  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },

  leftSection: {
    flexDirection: "row",
    flex: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  transactionIcon: {
    width: 23,
    height: 23,
    resizeMode: "contain",
    tintColor: "#FFFFFF", // white icon
  },

  transactionTitle: {
    fontSize: 16,
    color: "#222",
    fontFamily: "Gilroy-SemiBold",
  },

  transactionDate: {
    fontSize: 14,
    color: "#777",
    marginTop: 8,
    fontFamily: "Gilroy-Regular",
  },

  rightSection: {
    alignItems: "flex-end",
  },

  transactionAmount: {
    fontSize: 16,
    color: "#222",
    fontFamily: "Gilroy-Bold",
  },

  transferRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  smallIcon: {
    width: 23,
    height: 23,
    resizeMode: "contain",
  },

  arrow: {
    marginHorizontal: 8,
    fontSize: 18,
    color: "#777",
  },
  filterBox: {
    // flex: 1,
    // paddingVertical: 4,
    // paddingHorizontal: 14,

    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    // borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
    marginLeft: 8,
    backgroundColor: "#fff",
    flexDirection: "row", justifyContent: "center", alignItems: "center"
  },

  filterBoxActive: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },

  filterText: {
    textAlign: "center",
    color: "#374151",
  },

  filterTextActive: {
    color: "#fff",
  },
});
