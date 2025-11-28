import React, { useState, useRef, useEffect } from "react";
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


import Profile from "../../../Assets/Images/profile.png";
import FilterIcon from "../../../Assets/Images/EditPin.png";
import SearchIcon from "../../../Assets/Images/Asset_search.png";
import InProfile from "../../../Assets/Images/inActiveuser.png";
import ActiveCheckout from "../../../Assets/Images/ActiveCheckout.png";
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
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
// import WalkinScreen from '../Customer/WalkIn/WalkinList'
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
//   const { setShowTabBar } = route.params;
//   const screenWidth = Dimensions.get("window").width;

  const detailDotsRef = useRef(null);

  const [activeTab, setActiveTab] = useState("Bills");
  const navigation = useNavigation();
  const [showDetailModal, setShowDetailModal] = useState(false);
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

const [showRecordPayment, setShowRecordPayment] = useState(false);

const [paidAmount, setPaidAmount] = useState("");
const [paidDate, setPaidDate] = useState(new Date());

const [showPaymentMode, setShowPaymentMode] = useState(false);
const paymentModes = ["Cash", "UPI", "Bank Transfer"];
const [selectedMode, setSelectedMode] = useState("");

const [openPaidDate, setOpenPaidDate] = useState(false);

const [showRefundPayment, setShowRefundPayment] = useState(false);

const [refundAmount, setRefundAmount] = useState("5600");
const [refundDate, setRefundDate] = useState(new Date());
const [openRefundDate, setOpenRefundDate] = useState(false);
const [refundFrom, setRefundFrom] = useState("");
const [showRefundFrom, setShowRefundFrom] = useState(false);

const [refundMode, setRefundMode] = useState("");
const [showRefundMode, setShowRefundMode] = useState(false);

const [transactionId, setTransactionId] = useState("");

const bankOptions = ["SBI-IMMAN", "HDFC-JOBIN", "ICICI-KUMAR"];
const refundModes = ["UPI", "Cash", "Bank Transfer"];




const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

const dotsRef = useRef(null);

    const detailsY = useRef(new Animated.Value(0)).current;
    const detailsSheetY = useRef(new Animated.Value(0)).current;
    const writeoffSheetY = useRef(new Animated.Value(0)).current;

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


const openMenu = (item) => {
  dotsRef.current.measure((fx, fy, width, height, px, py) => {
    setPopupPosition({ x: px, y: py });
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

const [fromDate, setFromDate] = useState(dayjs());
const [toDate, setToDate] = useState(dayjs());

const [openFrom, setOpenFrom] = useState(false);
const [openTo, setOpenTo] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);

const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");

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
}, [showDetailModal, showFilter , showBillDetails , showWriteOff , showRecordPayment , showRefundPayment]);


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
    { key: "Bills", active: Profile, inactive: InProfile },
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
   setShowRecordPayment(true);
}

const handleCreateBill = () => {
navigation.navigate("CreateBills")
}

const handleShowRefundPayment = () => {
  setShowRefundPayment(true)
}
const handleShowAddBooking = () => {
navigation.navigate("AddBooking")
}

const handleShowCancelNotice = () => {
navigation.navigate("CancelNotice")
}

const customerList = [
  {
    id: 1,
    name: "Allwin A",
    img: Profile,
    floor: "Ground Floor",
    room: "203",
    bed: "03",
    email: "rajkumar001@gmail.com",
    phone: "+91 98765 43210",
    joinDate: "10 July 2025",
  },
];

  return (
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
        <Image
          source={activeTab === tab.key ? tab.active : tab.inactive}
          style={styles.tabIcon}
        />
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

{activeTab === "Bills" && (
  <View style={{ flex: 1 }}>

    {customerList.length > 0 ? (
      // 👉 SHOW LIST WHEN DATA EXISTS
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <Text style={styles.sectionTitle}>This Month</Text>

          <View style={styles.tenantRow}>
            <TouchableOpacity onPress={() => openBillDetails(customerList[0])}>
              <Image source={ProfileImage} style={styles.profileImg} />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Allwin A</Text>

              <View style={styles.detailRow}>
                <View style={styles.floorBadge}>
                  <Text style={styles.floorText}>Advance</Text>
                </View>

                <Image source={Bills_Black_Icon} style={styles.iconSmall} />
                <Text style={styles.detailText}>#12121212</Text>
              </View>
            </View>

            <View style={styles.rightSection}>
              <TouchableOpacity ref={dotsRef} onPress={() => openMenu(customerList[0])}>
                <Image
                  source={Dots}
                  style={{ width: 30, height: 30, transform: [{ rotate: "90deg" }] }}
                />
              </TouchableOpacity>

              <Text style={styles.dateText}>01/06</Text>
            </View>
          </View>
        </ScrollView>
      </>
    ) : (
      // 👉 EMPTY STATE WHEN NO DATA
      <View style={styles.centerContainer}>
        <Image source={EmptyFloor} style={styles.image} />
        <Text style={styles.noFloorText}>No floors are there!</Text>

        <TouchableOpacity style={styles.addFloorBtn}>
          <Text style={styles.addFloorText}>+ Add Floor</Text>
        </TouchableOpacity>
      </View>
    )}

    {customerList.length > 0 && (
        <>
         <TouchableOpacity style={styles.editButton} onPress={() => setShowFilter(true)}>
      <Image source={FilterIcon} style={{ width: 60, height: 60 }} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.addBtn} onPress={handleCreateBill}>
      <Image source={AddIcon} style={{ width: 25, height: 25 }} />
    </TouchableOpacity>
        </>
    )
}
   

  </View>
)}


{/* {activeTab === "RecurringBills" && (
   <CheckoutList/>
  )}
  {activeTab === "Receipt" && (
   <WalkinScreen setShowTabBar = {setShowTabBar}/>
  )} */}
 
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
    <Image source={ProfileImage} style={styles.userImg} />

    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.userName}>Ajmal Muhammed</Text>

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

  {/* DATES SECTION */}
  <View style={styles.twoColRow}>
    <View style={styles.colItem}>
      <Text style={styles.label}>Invoice date</Text>
      <View style={styles.rowAlign}>
        <Image source={CalendarBlueIcon} style={styles.iconSmall} />
        <Text style={styles.value}>5 Aug 2025</Text>
      </View>
    </View>

    <View style={styles.colItem}>
      <Text style={styles.label}>Due date</Text>
      <View style={styles.rowAlign}>
        <Image source={CalendarBlueIcon} style={styles.iconSmall} />
        <Text style={styles.value}>8 Aug 2025</Text>
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
        <Text style={styles.amountValue}>₹7,000</Text>
      </View>
    </View>

    <View style={styles.colItem}>
      <Text style={styles.label}>Due</Text>
      <View style={styles.rowAlign}>
           <Image source={DueIcon} style={{   width: 18,
    height: 18, marginTop:5 , marginRight:5
  }} />
        <Text style={styles.dueValue}>₹0.00</Text>
      </View>
    </View>
  </View>

  {/* PREVIEW BUTTON */}
  <TouchableOpacity style={styles.previewBtn}>
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

   

      <TouchableOpacity style={styles.popupRow} onPress={handleShowCancelNotice} >
        <Image
          source={require("../../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Download</Text>
      </TouchableOpacity>
     
     
        <TouchableOpacity style={styles.popupRow} onPress={handleShowRefundPayment} >
        <Image
          source={require("../../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Refund Amount</Text>
      </TouchableOpacity>
     
     

      
    <TouchableOpacity style={styles.popupRow} onPress={handleShowRecordPayment} >
  <Image
    source={require("../../../Assets/Images/ReAssign.png")}
    style={styles.popupIcon}
  />
  <Text style={styles.popupText}>Record Payment</Text>
</TouchableOpacity>

  <TouchableOpacity style={styles.popupRow} onPress={handleShowWriteOff} >
        <Image
          source={require("../../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Write-off</Text>
      </TouchableOpacity>
       <TouchableOpacity style={styles.popupRow} onPress={handleShowCancelNotice} >
        <Image
          source={require("../../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Edit</Text>
      </TouchableOpacity>

 <TouchableOpacity
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
</TouchableOpacity>
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


{showRecordPayment && (
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
              Jebin
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
                  Checkout Inv
                </Text>
              </View>

              <Image source={Bills_Black_Icon} style={{ width: 12, height: 12, marginTop: 3, marginRight: 5 }} />
              <Text style={{ fontSize: 13, color: "#555" }}>#1212121212</Text>
            </View>
          </View>
        </View>

        {/* DUE AMOUNT */}
        <Text style={styles.label}>Due Amount</Text>
        <View style={styles.inputBox}>
          <Text style={{ fontSize: 16 }}>₹ 3200</Text>
        </View>

        {/* PAID AMOUNT */}
        <Text style={styles.label}>Paid Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="₹ 0"
          value={paidAmount}
          onChangeText={setPaidAmount}
        />

        {/* PAID DATE */}
        <Text style={styles.label}>Paid Date</Text>

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setOpenPaidDate(!openPaidDate)}
        >
          <Text style={{ fontSize: 15 }}>
            {paidDate ? dayjs(paidDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
          </Text>

          <Image
            source={CalendarIcon}
            style={{ width: 22, height: 22, tintColor: "#444" }}
          />
        </TouchableOpacity>

        {openPaidDate && (
          <View style={styles.dropdownBox}>
            <DatePicker
              mode="single"
              date={paidDate}
              onChange={(v) => {
                setPaidDate(v.date || new Date());
                setOpenPaidDate(false);
              }}
            />
          </View>
        )}

        {/* TRANSACTION MODE */}
        <Text style={styles.label}>Transaction Mode</Text>

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setShowPaymentMode((v) => !v)}
        >
          <Text style={{ fontSize: 15 }}>
            {selectedMode ? selectedMode : "Select mode"}
          </Text>

          <Image
            source={DownArrow}
            style={{ width: 18, height: 18, tintColor: "#555" }}
          />
        </TouchableOpacity>

        {/* Dropdown mode */}
        {showPaymentMode && (
          <View style={styles.transactiondropdown}>
            {paymentModes.map((mode) => (
              <TouchableOpacity
                key={mode}
                style={{ padding: 12 }}
                onPress={() => {
                  setSelectedMode(mode);
                  setShowPaymentMode(false);
                }}
              >
                <Text style={{ fontSize: 15 }}>{mode}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Buttons */}
          <View style={styles.btnRow}>
                      <TouchableOpacity style={styles.cancelBtn} >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
            
                      <TouchableOpacity
                        style={styles.saveBtn}
                       
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
              Jebin
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
                  Checkout Inv
                </Text>
              </View>

              <Image
                source={Bills_Black_Icon}
                style={{ width: 12, height: 12, marginTop: 3, marginRight: 5 }}
              />
              <Text style={{ fontSize: 11, color: "#555" }}>#1212121212</Text>
            </View>
          </View>

          {/* RIGHT SIDE REFUND AMOUNT */}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: "#444", fontSize: 13 }}>Refund Amount</Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000" }}>
              ₹ 5,600.00
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
          onChangeText={setRefundAmount}
        />

        {/* BALANCE DUE */}
        <Text style={styles.label}>Balance Due</Text>
        <View style={styles.inputBox}>
          <Text style={{ fontSize: 16 }}>₹ 0.00</Text>
        </View>

        {/* REFUND DATE */}
        <Text style={styles.label}>Refund Date</Text>

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setOpenRefundDate(!openRefundDate)}
        >
          <Text style={{ fontSize: 15 }}>
            {refundDate ? dayjs(refundDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
          </Text>

          <Image
            source={CalendarIcon}
            style={{ width: 22, height: 22, tintColor: "#444" }}
          />
        </TouchableOpacity>

        {openRefundDate && (
          <View style={styles.dropdownBox}>
            <DatePicker
              mode="single"
              date={refundDate}
              onChange={(v) => {
                setRefundDate(v.date || new Date());
                setOpenRefundDate(false);
              }}
            />
          </View>
        )}

        {/* REFUND FROM */}
        <Text style={styles.label}>Refund From</Text>

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setShowRefundFrom((v) => !v)}
        >
          <Text style={{ fontSize: 15 }}>
            {refundFrom ? refundFrom : "Select bank"}
          </Text>

          <Image
            source={DownArrow}
            style={{ width: 18, height: 18, tintColor: "#555" }}
          />
        </TouchableOpacity>

        {showRefundFrom && (
          <View style={styles.transactiondropdown}>
            {bankOptions.map((bank) => (
              <TouchableOpacity
                key={bank}
                style={{ padding: 12 }}
                onPress={() => {
                  setRefundFrom(bank);
                  setShowRefundFrom(false);
                }}
              >
                <Text style={{ fontSize: 15 }}>{bank}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* REFUND MODE */}
        <Text style={styles.label}>Refund Mode</Text>

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setShowRefundMode((v) => !v)}
        >
          <Text style={{ fontSize: 15 }}>
            {refundMode ? refundMode : "Select mode"}
          </Text>

          <Image
            source={DownArrow}
            style={{ width: 18, height: 18, tintColor: "#555" }}
          />
        </TouchableOpacity>

        {showRefundMode && (
          <View style={styles.transactiondropdown}>
            {refundModes.map((m) => (
              <TouchableOpacity
                key={m}
                style={{ padding: 12 }}
                onPress={() => {
                  setRefundMode(m);
                  setShowRefundMode(false);
                }}
              >
                <Text style={{ fontSize: 15 }}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
            date={fromDate}
            onChange={(d) => {
              setFromDate(d.date);
              setOpenFrom(false);
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
            date={toDate}
            onChange={(d) => {
              setToDate(d.date);
              setOpenTo(false);
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

        <Text style={styles.deleteTitle}>Delete Customer?</Text>
        <Text style={styles.deleteSub}>
          Are you sure you want to delete this Customer?
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
    width: 14,
    height: 14,
    marginHorizontal: 3,
  },
  detailText: {
    fontSize: 12,
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
   editButton: {
    position: "absolute",
    right: 10,
    bottom:110,
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

popupIcon: {
  width: 20,
  height: 20,
  marginRight: 10,
},

popupText: {
  fontSize: 14,
  color: "#333",
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
transactiondropdown : {
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
 bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 72 },
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
});
