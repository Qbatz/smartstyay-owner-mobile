import React, { useState , useEffect, useRef , useLayoutEffect , useCallback , useContext } from "react";
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
  PanResponder, KeyboardAvoidingView ,Keyboard
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

import FilterIcon from "../../../Assets/Images/filter.png";
import AddIcon from "../../../Assets/Images/add-circle.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import BankIcon from "../../../Assets/Images/bank.png";
import UpiIcon from "../../../Assets/Images/Upi_Icon.png";
import CardIcon from "../../../Assets/Images/Card_Icon.png";
import CashIcon from "../../../Assets/Images/Cash_Icon.png";

import DeleteIcon from "../../../Assets/Images/trash.png";
import EditIcon from "../../../Assets/Images/editIcon.png";
import SelfTransIcon from "../../../Assets/Images/arrow-transfer.png";
import ThreeDotsIcon from "../../../Assets/Images/3dots.png";

import MoneyPlus from "../../../Assets/Images/money_plus.png";
import MoneyMinus from "../../../Assets/Images/money-minus.png";
import ArrowUp from "../../../Assets/Images/arrow-up.png";
import ArrowDown from "../../../Assets/Images/arrow-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import DownArrow from "../../../Assets/Images/direction-down.png";





export default function BankingScreen() {
  const navigation = useNavigation();
  dayjs.extend(customParseFormat)

  const { activeHostelId } = useContext(CommonContexts);
const { bankList, transactionList,  loading, errorMsg, getBankListByHostel , AddBankAmount } =
  useContext(BankingContext);

  console.log("bankinglist", bankList , transactionList);
  


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
   const [deleteshow , setDeleteShow] = useState(false)
   const [transactionshow , setTransactionShow] = useState(false)
    const [showtransaction, setShowTransaction] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
     const [showFilter, setShowFilter] = useState(false);

   const [selfTransferScreen,setSelfTransferScreen] = useState(false)


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

  const transactions = [
    { id: 1, type: "income", title: "Record Payment",ArrowImage : ArrowUp,  icon : MoneyPlus, category: "Rent Income", amount: "+ ₹7,500.00", date: "12 May 2025" ,},
    { id: 2, type: "expense", title: "Asset Purchase", ArrowImage : ArrowDown,  icon : MoneyMinus,  category: "Capital Expenditure", amount: "- ₹12,500.00", date: "12 May 2025" },
    { id: 3, type: "selftransfer", title: "self transfer",ArrowImage : SelfTransIcon,  icon : MoneyMinus,  category: "Checkout", amount: "- ₹1,250.00", date: "12 May 2025" },
    { id: 4, type: "income", title: "Bills", category: "Income",ArrowImage : ArrowUp,  icon : MoneyPlus,  amount: "+ ₹1,250.00", date: "12 May 2025" },
    { id: 5, type: "expense", title: "Checkout", category: "Checkout", ArrowImage : ArrowDown,  icon : MoneyMinus,  amount: "- ₹1,200.00", date: "12 May 2025" },
    { id: 6, type: "expense", title: "Assest", category: "Checkout", ArrowImage : ArrowDown,  icon : MoneyMinus,  amount: "- ₹1,100.00", date: "12 May 2025" },
    { id: 7, type: "income", title: "Checkout", category: "Checkout", ArrowImage : ArrowUp,  icon : MoneyPlus, amount: "- ₹1,200.00", date: "12 May 2025" },
    { id: 8, type: "expense", title: "Assest", category: "Checkout", ArrowImage : ArrowDown,  icon : MoneyMinus,  amount: "- ₹1,100.00", date: "12 May 2025" },
    { id: 9, type: "expense", title: "Assest", category: "Checkout", ArrowImage : ArrowDown,  icon : MoneyMinus,  amount: "- ₹1,100.00", date: "12 May 2025" },
    { id: 10, type: "expense", title: "Checkout", category: "Checkout",ArrowImage : ArrowDown,  icon : MoneyMinus,  amount: "- ₹1,200.00", date: "12 May 2025" },
    { id: 11, type: "expense", title: "Assest", category: "Checkout",ArrowImage : ArrowDown,  icon : MoneyMinus,  amount: "- ₹1,100.00", date: "12 May 2025" },
  ];

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
  

    useEffect(() => {
  if (activeHostelId) {
    getBankListByHostel(activeHostelId);
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
        if(showAddBalance){
          setShowAddBalance(false)
           return true;
        }
      
        
        return false;
      };
  
      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [ showFilter, openFrom, openTo, amountDropdownVisible , showAddBalance]);



     useFocusEffect(
      useCallback(() => {
    
        const onBackPress = () => {
    
        if(selfTransferScreen){
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

  
const mappedBankList = (bankList || []).map((b) => {
  if (b.accountType === "BANK") {
    return {
      id: b.bankingId,
      title: b.bankName || "Bank",
      subtitle: "Savings A/C",
      name: b.accountHolderName,
      acc: b.accountNumber,
      balance: b.accountBalance ?? 0,
      Icon: BankIcon,
      raw: b,
    };
  }

  if (b.accountType === "UPI") {
    return {
      id: b.bankingId,
      title: "UPI",
      subtitle: "UPI ID",
      name: b.accountHolderName,
      acc: b.upiId,
      balance: b.accountBalance ?? 0,
      Icon: UpiIcon,
      raw: b,
    };
  }

  if (b.accountType === "CARD") {
    return {
      id: b.bankingId,
      title: "Card",
      subtitle: b.cardType || "Card",
      name: b.accountHolderName,
      acc: b.creditCardNumber || b.debitCardNumber,
      balance: b.accountBalance ?? 0,
      Icon: CardIcon,
      raw: b,
    };
  }

  if (b.accountType === "CASH") {
    return {
      id: b.bankingId,
      title: "Cash",
      subtitle: "Petty Cash",
      name: b.accountHolderName,
      acc: "",
      balance: b.accountBalance ?? 0,
      Icon: CashIcon,
      raw: b,
    };
  }

  return null;
}).filter(Boolean);


const mappedTransactions = (transactionList || []).map((t) => {
  const isCredit = t.type === "CREDIT";

  return {
    id: t.transactionId,
    type: isCredit ? "income" : "expense",
    title: t.source === "INVOICE" ? "Bill Payment" : "Transaction",
    category: t.source,
    Accountholder : t.accountHolder,
    amount: `${isCredit ? "+" : "-"} ₹${t.amount}`,
   date: dayjs(t.createdAt, "DD/MM/YYYY", true).isValid()
      ? dayjs(t.createdAt, "DD/MM/YYYY", true).format("DD/MM/YYYY")
      : t.createdAt,
    ArrowImage: isCredit ? ArrowUp : ArrowDown,
    icon: isCredit ? MoneyPlus : MoneyMinus,
    raw: t,
  };
});



const handleShowAddBalance = (item) => {
  setAddBankName(`${item.name} - ${item.title}`);
  setSelectedBankId(item.id);
  setShowAddBalance(true);
};



const handleAddBankAmount = (v) => {
  if (!/^\d*$/.test(v)) return;
  if (/^0+$/.test(v)) return;

  setAddBankAmount(v);
  setAmountError("");
};

const closeAddBalancePopup = () => {
  setShowAddBalance(false);
  setAddBankName("");
  setAddBankAmount("");
  setAmountError("");
  setSelectedBankId(null);
};



const handleAddAmountSubmit = async () => {
  if (!addBankAmount.trim()) {
    setAmountError("Please Enter Amount");
    return;
  }

  const res = await AddBankAmount(
    activeHostelId,
    selectedBankId,
    addBankAmount
  );

  if (res.success) {
    setModalType("success");
    setModalMessage(res?.message || "Amount Added Successfully");
    setShowSuccessModal(true);

    closeAddBalancePopup()
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
  outputRange: [190, 0],
  extrapolate: "clamp",
});

const bankListOpacity = scrollY.interpolate({
  inputRange: [0, 10],
  outputRange: [1, 20],
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
  setEditMode({ mode: "add", tab: "Bank", raw: null, bankId: null });
  setAddBankingShow(true);
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
      item.raw.accountType === "UPI"  ? "UPI"  :
      item.raw.accountType === "CARD" ? "Card" :
      "Cash",
    raw: item.raw,         
    bankId: item.raw.bankingId
  });
};



 const handleShowAddTransaction  = () => {
    navigation.navigate("AddTransaction")
 }

 const handleshowTransaction = (item) => {
    setShowTransaction(true)
     setSelectedTransaction(item);
      setShowFilter(false);
 }

 


  return (
    <>
        { loading && <Loader />}
    <View style={styles.container}>

      <View style={styles.stickyHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.heading}>Banking</Text>
        </View>

   
        <View style={styles.searchBox}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/622/622669.png" }}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#A1A1A1"
            style={styles.searchInput}
          />
        </View>
      </View>


   {!loading && (

    <>

    
  <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 130 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >

    
        <Animated.View style={{ opacity: bankListOpacity }}>
          <View style={{ flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal:16,
    alignItems: "center",
    marginTop: 23,marginBottom:10}}>
            <Text style={styles.sectionTitle}>Bank List</Text>

            <TouchableOpacity style={styles.addBankBtn} onPress={handleAddBanking}>
              <Text style={styles.addBankText}>Add Bank</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

    
        <Animated.View style={{ height: bankListHeight, opacity: bankListOpacity }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mappedBankList && mappedBankList?.length > 0 && mappedBankList?.map((item , index) => (
              <View key={index} style={styles.bankCard}>

  <View
   style={{backgroundColor:'#f7f5ff',  padding:20 ,  flexGrow: 1,paddingTop:7 , paddingBottom:7 }}
  >

    <View style={styles.topRow}>
      <View style={styles.bankLeft}>
        <View style={styles.bankIconBg}>
        <Image
          source={item.Icon}
          style={styles.bankIcon}
        />
        </View>
        <View>
          <Text style={styles.bankTitle}>{item.title}</Text>
          <Text style={styles.bankSub}>{item.subtitle}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.moreIcon}   ref={(ref) => (dotsRef.current[item.id] = ref)}  onPress={() => openMenu(item)}>
        <Image source={ThreeDotsIcon}  style={styles.popupIcon}/>
      </TouchableOpacity>
    </View>

 
<View style={styles.middleRow}>
  {/* LEFT SIDE */}
  <View style={styles.nameContainer}>
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.acc}>{item.acc}</Text>
  </View>

  {/* RIGHT SIDE */}
  <View style={styles.defaultColumn}>
    <Text style={styles.defaultText}>Default Bank A/C</Text>
    <Text style={styles.changeText}>Change</Text>
  </View>
</View>


  </View>

<View style={styles.balanceRow}>
  <Text style={styles.balanceText}>Balance</Text>

 {item.balance === 0 ? (
  <Text
    style={styles.addAmountText}
    onPress={() => handleShowAddBalance(item)}
  >
    + Add Amount
  </Text>
) : (
  <Text style={styles.balanceAmount}>
    ₹{item.balance.toLocaleString("en-IN")}
  </Text>
)}

</View>



</View>

            ))}
          </ScrollView>
        </Animated.View>

     
        <View style={[styles.rowBetween, { marginBottom: 15 ,  marginTop:20}]}>
          <Text style={styles.sectionTitle}>All Transactions</Text>
        </View>

       
        {mappedTransactions && mappedTransactions.length > 0 &&  mappedTransactions?.map((t) => (
            <TouchableOpacity  key={t.id} onPress={()=>handleshowTransaction(t)}>
          {/* <View style={styles.transCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[
                  styles.iconArrow,
                 {
  backgroundColor:
    t.type === "income"
      ? "#E4FFE8"          
      : t.type === "selftransfer"
      ? "rgb(232,236,252)" 
      : "#FFE8E8"    
}
,
                ]}
              >

                <Image source={t.ArrowImage}  style={{height:19 , width:19}}/>
               
             
              </View>

              <View>
                <Text style={styles.transTitle}>{t.Accountholder}</Text>
                <Text style={styles.category}>{t.category}</Text>
              </View>
            </View>
         

            <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.date}>{t?.date}</Text>
              <Text
                style={[
                  styles.amount,
                  { color: t.type === "income" ? "green" : "red" },
                ]}
              >
                {t.amount}
              </Text>
            </View>
          </View> */}

          <View style={styles.transCard}>
  {/* LEFT SIDE */}
  <View style={styles.transLeft}>
    <View
      style={[
        styles.iconArrow,
        {
          backgroundColor:
            t.type === "income"
              ? "#E4FFE8"
              : "#FFE8E8",
        },
      ]}
    >
      <Image source={t.ArrowImage} style={{ height: 19, width: 19 }} />
    </View>

    <View style={styles.transTextWrap}>
      <Text style={styles.transTitle} numberOfLines={0}>
        {t.Accountholder}
      </Text>
      <Text style={styles.category}>{t.category}</Text>
    </View>
  </View>

  {/* RIGHT SIDE */}
  <View style={styles.transRight}>
    <Text style={styles.date}>{t.date}</Text>
    <Text
      style={[
        styles.amount,
        { color: t.type === "income" ? "green" : "red" },
      ]}
    >
      {t.amount}
    </Text>
  </View>
</View>

             </TouchableOpacity>
        ))}




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



      <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
        <Image source={FilterIcon} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>

    
      <TouchableOpacity style={styles.addBtn} onPress={handleShowAddTransaction}>
        <Image source={AddIcon} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>
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

      <Text style={{  fontSize: 18,
  fontWeight: "700",
  marginBottom: 10,}}>Transaction Details</Text>

      {/* TOP ROW */}
      <View style={{flexDirection: "row",
  alignItems: "center",
  marginBottom: 5,}}>
        <View      style={[
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
       
           <Image source={selectedTransaction.ArrowImage}  style={{height:19 , width:19}}/>
           
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
          <Text style={{  fontSize: 14,
  color: "#000",
  fontWeight: "600",marginLeft:-3}}> {selectedTransaction?.raw?.accountHolder}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>To</Text>
          <Text style={styles.valueText}>HDFC Bank</Text>
        </View>
      </View>

      {/* AMOUNT */}
      
      <Text style={styles.label}>Amount</Text>
      <View style={{display:'flex', flexDirection:'row'}}>
           <Image  source={selectedTransaction.icon} style={{height:18, width:18 , marginRight:5, marginTop:5}}/>
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
      <Text style={styles.label}>Description</Text>
      <Text style={styles.description}>
        Transfer Rs:10,000 for Balance maintenance
        {selectedTransaction?.raw?.referenceNumber || "-"}
      </Text>
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
                   <TouchableOpacity style={styles.resetBtn}
                     onPress={() => {
                       setFromDate(dayjs());
                       setToDate(dayjs());
                       setAmountSelected(amountOptions[0]);
                     }}
                   >
                     <Text style={styles.resetBtnText}>Reset All</Text>
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
       
            <TouchableOpacity style={styles.popupRow} onPress={() => {
  setShowMenu(false);
  setSelfTransferScreen(true);   // OPEN SELF TRANSFER SCREEN
}}
 >
               <Image
                 source={SelfTransIcon}
                 style={styles.popupIcon}
               />
               <Text style={styles.popupText}>Self Transfer</Text>
             </TouchableOpacity>
       
             <TouchableOpacity style={styles.popupRow}   onPress={()=>handleEditBanking(selectedItem)}>
               <Image
                 source={EditIcon}
                 style={styles.popupIcon}
               />
               <Text style={styles.popupText}>Edit</Text>
             </TouchableOpacity>
           
        
       
            
       
             
      
        <TouchableOpacity
         style={styles.popupRow}
         onPress={handleDeleteShow}
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
    fontWeight: "700",
  },

  /* SEARCH BAR */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 6,
  },

  searchIcon: { width: 20, height: 20, tintColor: "#9B9B9B", marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#000" },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal:16,
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
    fontWeight: "600",
    fontSize: 12,
  },

 bankCard: {
  width: 260,
  height:190,
  borderRadius: 18,
  marginHorizontal: 16,
  backgroundColor: "#F7F8FF",
  overflow: "hidden",
  borderColor: "grey",
  borderWidth: 0.4,
  paddingTop:-5
}
,

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
bankIconBg : {
   backgroundColor:"#3D6DFF", borderRadius:'50%', padding:5, justifyContent:'center', marginRight:5
},

bankIcon: {
  width: 17,
  height: 17,
},

moreIcon: {
  padding: 5,
},

bankTitle: {
  fontSize: 17,
  fontWeight: "700",
},

bankSub: {
  color: "#777",
  fontSize: 13,
},

name: {
  fontSize: 15,
  fontWeight: "600",
  marginTop: 4,
},

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
balanceAmount: { fontWeight: "700", fontSize: 16 },
addAmountText: {
  color: "#1D5DFF",
  fontWeight: "600",
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
  fontWeight: "600",
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
  fontWeight: "600",
},

changeText: {
  color: "blue",
  marginTop: 2,
  fontSize: 11,
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
  fontWeight: "600",
  flexShrink: 1,        // 🔥 MUST
  flexWrap: "wrap",
},

category: {
  fontSize: 13,
  color: "#666",
  marginTop: 2,
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

  transTitle: { fontSize: 16, fontWeight: "600" },
  category: { fontSize: 13, color: "#666" },
  date: { fontSize: 12, color: "#777" },
  amount: { fontSize: 16, fontWeight: "700" },

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

popupIcon: {
  width: 23,
  height: 23,
},

popupText: {
  fontSize: 14,
  color: "#333",
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
  marginRight: 10,
  alignItems: "center",
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
},
 
deleteBtnText: {
  fontSize: 16,
  fontWeight: "600",
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


//   sheetHandle: { width: 60, height: 4, backgroundColor: "#D1D5DB", alignSelf: "center", borderRadius: 20, marginBottom: 15 },


  topActions: { flexDirection: "row", alignItems: "center" },
  headerIcon: { width: 20, height: 20, marginLeft: 12 },

  divider: { height: 1, backgroundColor: "#E8E8E8", marginVertical: 12 },

  twoColRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  colLeft: { width: "48%" },
  colRight: { width: "48%" },

  label: { fontSize: 13, color: "#7A7A7A", marginBottom: 6 },
  value: { fontSize: 15, fontWeight: "600", color: "#000" },

  assignBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#1E45E1", paddingVertical: 14, borderRadius: 12, marginTop: 20 },
  assignIcon: { width: 18, height: 18, tintColor: "#fff", marginRight: 8 },
  assignText: { color: "#fff", fontSize: 16, fontWeight: "700" },

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

label: {
  fontSize: 13,
  color: "#888",
  marginBottom: 5,
  fontWeight: "600",
},

valueText: {
  fontSize: 14,
  color: "#000",
  fontWeight: "600",
},

amountText: {
  fontSize: 18,
  fontWeight: "700",
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

 filterTitle: { fontSize: 20, fontWeight: "700" },
  resetTextSmall: { color: "#2D6CDF", fontWeight: "600" },

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
 bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 42, marginBottom:25 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontWeight: "700" },
  applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontWeight: "700" },

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
  fontWeight: "700",
},

label: {
  fontSize: 14,
  fontWeight: "500",
  marginTop: 10,
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
},

addBalanceBtnText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
},



});
