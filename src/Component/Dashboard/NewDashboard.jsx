import React, { useState, useCallback, useEffect, useContext, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  BackHandler,
  TouchableWithoutFeedback, Modal
} from "react-native";
import { useLayoutEffect } from "react";
import { Animated, Easing } from "react-native";
import SubscriptionBanner from "./SubscriptionBannerAlert"
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import RecordPaymentSheet from "../MorePages/Bills/RecordPayment";
import PgImg from '../../Assets/Images/PgImg.png'
import Bell from '../../Assets/Images/bell.png'
import Profile from '../../Assets/Images/profile.png'
import Announcement from '../../Assets/Images/announcement.png';
import UpdateImg from '../../Assets/Images/updateImg.png'
import InProfile from '../../Assets/Images/inActiveuser.png'
import Activeannouncement from '../../Assets/Images/Active_announcement.png';
import ActiveUpdate from '../../Assets/Images/Active_update.png'
import SmartPlur from '../../Assets/Images/sm_dashboard.png';
import RoomImg from '../../Assets/Images/room.png';
import BedImg from '../../Assets/Images/bed.png';
import FreeBedImg from '../../Assets/Images/freeBed.png';
import OutstandingImg from '../../Assets/Images/Outstanding.png';
import RoomsBedImg from '../../Assets/Images/Room_bed.png';
import OccupancyImg from '../../Assets/Images/Occupancy.png';
import TenantImg from '../../Assets/Images/Tenant.png';
import CheckinImg from '../../Assets/Images/Checkin.png';
import AdvanceImg from '../../Assets/Images/Advance.png';
import RevenueImg from '../../Assets/Images/MoneyRecive.png';
import ProfitImg from '../../Assets/Images/Profit.png';
import RightArrowImg from '../../Assets/Images/ArrowRight.png';
import TenantRequestImg from '../../Assets/Images/MessageQuestion.png';
import ComplaintRequestImg from '../../Assets/Images/complaintReq.png';
import TrendupImg from '../../Assets/Images/TrendUp.png';
import TrenddownImg from '../../Assets/Images/TrendDown.png';
import SharingBreakdownImg from '../../Assets/Images/sharing_breakdown.png';
import SharingImg from '../../Assets/Images/sharingbreak.png';
import DownArrow from "../../Assets/Images/direction-down.png";

import Usercircle from '../../Assets/Images/user-circle-add.png';
import ExpenseImg from '../../Assets/Images/money-minus.png';
import CrateBill from '../../Assets/Images/create_bill.png';
import WalkinImg from '../../Assets/Images/walkin_user.png';
import AgreementImg from '../../Assets/Images/paperclip.png';
import AdvanceHand from '../../Assets/Images/AdvanceHand.png';
import ActiveCompliance from '../../Assets/Images/ActiveCompliance.png';

import MonthProfit from '../../Assets/Images/Month_Profit.png';
import AnnouncementScreen from '../Dashboard/Announcement';
import UpdatesScreen from '../Dashboard/Update';
import Svg, { Path, Circle, Line, Text as SvgText } from "react-native-svg";
// import { BarChart,  } from "react-native-svg-charts";
import { G, Rect } from "react-native-svg";
import { CommonContexts } from "../../Context/CommonContext";
import { LoginContexts } from "../../Context/LoginContext";
import { PGContext } from "../../Context/PGContext";
import { ExpensesContext } from "../../Context/ExpensesContext";
import { useHasPermission } from "../../Utils/useHasPermission";
import ProfileDrawer from "./ProfileClickScreen";
import AddTenant from "../Customer/AddTenants";
import { useCustomer } from "../../Context/CustomerContext";
import { NotificationContext } from "../../Context/NotificationContext";
import EmptyState from "../../Assets/Images/Empty_state.png"
import Loader from "../Loader/Loader"
import OrangeLocationIcon from "../../Assets/Images/OrangeLocationIcon.png"
import ExpiryImg from "../../Assets/Images/subscription_expiry.png";
import SubscriptionExpiredSheet from "../../ToastFile/SubscriptionExpired"


import {
  BarChart,
  PieChart,
  Grid,
  YAxis,
  XAxis , StackedBarChart 
} from "react-native-svg-charts";
import { getHostels } from "../../Action/HostelAction";
import { retriveData } from "../../Utils/Storage";
import SuccessModal from "../../ToastFile/ToastPage";
import SubscriptionFullScreenAlert from "./SubscriptionBannerAlert";
import FilterBottomSheet from "../MorePages/Reports/FilterBottomSheet";
import SubscriptionExpiredCard from "./SubscriptionBannerAlert";



export default function DashboardNewDesign({ initialParams, route }) {

  console.log("initialParams", initialParams, route);

  const insets = useSafeAreaInsets();
  const { getDashboardByHostel , GetParticularCustomerDetails } = useCustomer();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { updateHostelList, hostelList, activeHostelId, setActiveHostelId } = useContext(CommonContexts);
  const login = useContext(LoginContexts);
  const {getDashboard , getParticularHostelDetails, PGDetails , loading } = useContext(PGContext);
  const { getNotificationsByHostel } = useContext(NotificationContext);
  const { expensesList, GetExpenseList, rolePermission, GetRoleBasedPermission, profileDetails, GetProfileDetails, IntializeexpensesList, GetInitializeExpense } = useContext(ExpensesContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dashboardList, setDashboardList] = useState([])
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [showExpiryBanner, setShowExpiryBanner] = useState(false);

  const [monthSheetOpen, setMonthSheetOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [tempMonth, setTempMonth] = useState("");
  const [showRecordPayment, setShowRecordPayment] = useState(false);

  const [sharingModalVisible, setSharingModalVisible] = useState(false);

  const [activeSubTab, setActiveSubTab] = useState("Activities");
  const [showExpiryScreen, setShowExpiredScreen] = useState(false);
    const [selectedBill , setSelectedBill] = useState(null)


  const { setShowTabBar } = route.params || {};


  const subTabs = [
    "Activities",
    "Expenses & Profit",
    "Requests & Complaint",
    "Core Analytics",
  ];

  const categoryList = IntializeexpensesList?.listExpenses || [];

  // useEffect(() => {
  //   if (!activeHostelId) return;

  //   const loadDashboard = async () => {
  //     const res = await getDashboardByHostel(activeHostelId);


  //     if (res.success) {
  //       setDashboardList(res.data);

  //     }
  //   };

  //   loadDashboard();
  // }, [activeHostelId]);


  const mapDashboardData = (data) => {
  return {
    // ROOMS
    totalRooms: data?.roomsBeds?.totalRooms || 0,
    totalBeds: data?.roomsBeds?.totalBeds || 0,
    occupiedBeds: data?.roomsBeds?.occupiedBeds || 0,
    freeBeds: data?.roomsBeds?.availableBeds || 0,

    // OCCUPANCY
    occupancyRate: data?.occupancy?.occupancyRate?.replace("%", "") || 0,
    occupancyRateFromLastMonth : data?.occupancy?.occupancyRateFromLastMonth?.replace("%", "") || 0,

    // BILLING
    totalInvoiceGenerated: data?.billingSummary?.totalInvoiceGenerated || 0,
    totalAmount: data?.billingSummary?.totalAmount || 0,
    totalPaid: data?.billingSummary?.totalPaid || 0,
    totalPending: data?.billingSummary?.totalPending || 0,
    refundedAmount:data?.billingSummary?.refundedAmount || 0,
    collectionRate: data?.billingSummary?.collectionRate || "0%",
    fromLastMonth : data?.billingSummary?.fromLastMonth || "0%",
    // TENANTS
    totalTenants: data?.tenantsSummary?.totalTenants || 0,
    checkInTenants: data?.tenantsSummary?.checkInTenants || 0,
    noticePeriod: data?.tenantsSummary?.noticePeriod || 0,
    nextCheckout: data?.tenantsSummary?.nextCheckout || "",

    // ADVANCE
    totalAdvance: data?.advanceSummary?.totalAdvance || 0,
    otherAdvance: data?.advanceSummary?.otherDeduction || 0,
    advanceHolding: data?.advanceSummary?.advanceHolding || 0,

    // CHECKINS
    checkins: data?.checkins || [],

    // OVERDUE
    overdueInvoices: data?.overdueInvoices || [],

    // REQUESTS / COMPLAINTS
    tenantRequests: data?.tenantRequests  || {},
    tenantComplaints: data?.tenantComplaints || {},

    // FINANCE
    totalIncome: data?.finance?.totalIncome || 0,
    totalExpense: data?.finance?.totalExpense || 0,
    netProfit: data?.finance?.netProfit || 0,

    incomeTrend: data?.finance?.incomeTrend || 0,
expenseTrend: data?.finance?.expenseTrend || 0,
profitTrend: data?.finance?.profitTrend || 0,
expenseSummary: data?.expenseSummary || {},
 roomsBeds: data?.roomsBeds || {},

 tenantcomplaint: data?.tenantcomplaint || [],
dashboardRequests: data?.dashboardRequests || [],
  };
};

const sharingData = dashboardList?.roomsBeds?.sharingInfo || [];

console.log("sharingData", sharingData);

console.log("dashboardList", dashboardList);



const occupancyTrendData =
  dashboardList?.occupancyTrendSummary?.occupancyTrend?.map((item) => ({
    label: item.date,
    occupied: item.occupied,
    vacant: item.vacant,
  })) || [];

  

const financeData = {
  totalIncome: dashboardList?.totalIncome || 0,
  totalExpense: dashboardList?.totalExpense || 0,
  netProfit: dashboardList?.netProfit || 0,

  incomeTrend: dashboardList?.incomeTrend || 0,
  expenseTrend: dashboardList?.expenseTrend || 0,
  profitTrend: dashboardList?.profitTrend || 0,
};


 useEffect(() => {
  const fetchDashboard = async () => {
    const res = await getDashboard(activeHostelId, {
      billingFilter: "This Month",
      complaintRequestFilter: "This Month",
      financeFilter: "This Month",
      occupancyFilter: "This Month"
    });

   if (res?.data) {
      const mapped = mapDashboardData(res?.data);

      setDashboardList({
        ...mapped,

        occupancyTrendSummary: res.data.occupancyTrendSummary,
        revenueSummary: res.data.revenueSummary,
        revenueTrend : res.data.revenueTrend,
      });
    }
  };

  fetchDashboard();
}, [activeHostelId])


  useEffect(() => {
    if (activeHostelId) {
      GetInitializeExpense(activeHostelId);
    }
  }, [activeHostelId])

  console.log("dashboardjd", dashboardList)
  const fetchCustomers = async () => {
    const res = await getNotificationsByHostel(activeHostelId);


    setUnreadCount(res?.data?.unreadCount);
  };
  console.log("unreadCount", unreadCount)

  useFocusEffect(
    useCallback(() => {
      if (activeHostelId) {
        fetchCustomers();
      }
    }, [activeHostelId])
  );
  useEffect(() => {
    if (activeHostelId) {
      getParticularHostelDetails(activeHostelId);
    }
  }, [activeHostelId]);

  console.log("profileDetails", profileDetails);



  useEffect(() => {
    GetProfileDetails();
  }, []);


  useEffect(() => {
    if (profileDetails?.roleId) {
      GetRoleBasedPermission(profileDetails?.roleId);
    }
  }, [profileDetails?.roleId]);


  useLayoutEffect(() => {
    const backAction = () => {
      if (sharingModalVisible) {
        setSharingModalVisible(false);
        return true;
      }

      return false;
    };

    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    )


    return () => handler.remove();
  }, [sharingModalVisible,]);


  //   useEffect(() => {
  //   if (!PGDetails) return;

  //   setSubscriptionChecked(true);

  //   if (!PGDetails.isSubscriptionActive) {
  //     setShowExpiryModal(true); 
  //   }
  // }, [PGDetails]);

  // const [subscriptionChecked, setSubscriptionChecked] = useState(false);

  // useEffect(() => {
  //   if (!PGDetails) return;

  //   if (!subscriptionChecked) {
  //     setSubscriptionChecked(true);

  //     if (PGDetails.isSubscriptionActive === false) {
  //       navigation.replace("SubscriptionExpired");
  //     }
  //   }
  // }, [PGDetails]);

  console.log("rolepermission", rolePermission);

  console.log("PGdetails", PGDetails);

  const isExpired = PGDetails && !PGDetails.isSubscriptionActive;


  useEffect(() => {
    if (isExpired) {
      setShowExpiredScreen(true);

      if (setShowTabBar) {
        setShowTabBar(false); 
      }
    }else {
      setShowExpiredScreen(false);

      if(setShowTabBar){
        setShowTabBar(true);
      }
    }
  }, [isExpired,activeHostelId])


  const {
    canWriteModule: canWriteDashboard,
    canReadModule: canReadDashboard,
    canUpdateModule: canUpdateDashboard,
    canDeleteModule: canDeleteDashboard,
  } = useHasPermission("Dashboard")

  const {
    canReadModule: canReadAnnouncement,
  } = useHasPermission("Announcement");

  const {
    canReadModule: canReadUpdates,
  } = useHasPermission("Updates");

  const {
    canWriteModule: canWriteWalkin,
    canReadModule: canReadWalkin,
    // canUpdateModule: canUpdateWalkin,
    canDeleteModule: canDeleteWalkin,
  } = useHasPermission("Walk in");

  const {
    canWriteModule: canWriteExpense,
    canReadModule: canReadExpense,
    canUpdateModule: canUpdateExpense,
    canDeleteModule: canDeleteExpense,
  } = useHasPermission("Expense");

  const {
    canWriteModule: canWriteInvoice,
    canReadModule: canReadInvoice,
    canUpdateModule: canUpdateInvoice,
    canDeleteModule: canDeleteInvoice,
  } = useHasPermission("Bills")

  const dashboardLists = {
    totalCustomers: 306,
    checkinTenants: 43,
    noticeTenants: 4,
    nextCheckoutDate: "Jan 20, 2026"
  }

  const checkinList = [
    {
      name: "Charles Raj",
      sharing: "2-Sharing",
      room: "A-205",
      date: "Jan 15, 2026"
    },
    {
      name: "Karthik Subbaraj R",
      sharing: "2-Sharing",
      room: "A-205",
      date: "Jan 15, 2026"
    },
    {
      name: "Ranganathan J",
      sharing: "2-Sharing",
      room: "A-205",
      date: "Jan 15, 2026"
    }
  ]

 const expenseBreakdown =
  dashboardList?.expenseSummary?.breakdown?.map((item, index) => {
    const colors = ["#155DFC", "#00A63E", "#F54900", "#9810FA"];

    return {
      label: item.expenseType,
      amount: `₹${item.amount}`,
      percentage: item.percentage,
      color: colors[index % colors.length],
    };
  }) || [];


const requestStats = [
  {
    count: dashboardList?.tenantRequests?.pending || 0,
    label: "Pending",
    bg: "#FFF7ED",
    text: "#CA3500",
  },
  {
    count: dashboardList?.tenantRequests?.inprogress || 0,
    label: "In Progress",
    bg: "#EFF6FF",
    text: "#1447E6",
  },
  {
    count: dashboardList?.tenantRequests?.resolved || 0,
    label: "Resolved",
    bg: "#F0FDF4",
    text: "#008236",
  },
];



const requestComplaints = [
  {
    count: dashboardList?.tenantComplaints?.pending || 0,
    label: "Pending",
    bg: "#FFF7ED",
    text: "#CA3500",
  },
  {
    count: dashboardList?.tenantComplaints?.inprogress || 0,
    label: "In Progress",
    bg: "#EFF6FF",
    text: "#1447E6",
  },
  {
    count: dashboardList?.tenantComplaints?.resolved || 0,
    label: "Resolved",
    bg: "#F0FDF4",
    text: "#008236",
  },
];


const CustomerOverviewshow = async(item) => {
      const res = await GetParticularCustomerDetails(item?.tenantId)
      console.log("responsedata", res);
      
      if(res?.success){
      navigation.navigate("CustomerOverviewScreen", {
      customer: res?.data,
    });
      }
}

 const handleShowTennantCheckin = async(item) => {
  console.log("item", item);

      const res = await GetParticularCustomerDetails(item.tenantId)
      if(res?.success){
      navigation.navigate("BookingCheckIn", {
      customerId: item?.tenantId,
      customer: res?.data?.hostelInfo,
    });
      }

  }


  const handleShowRecordPayment = (item) => {
    setShowRecordPayment(true)
    setSelectedBill(item)
    
  }
  console.log("Recordpayment", showRecordPayment);
  

// const complaintList =
//   dashboardList?.tenantcomplaint?.map((item) => ({
//     id: item.tenantId,
//     name: item.fullName || "-",
//     room: item.roomName,
//     title: item.complaintDescription,
//     type: item.complaintType,
//     status: item.status,
//     time: item.complaintDate,
//   })) || [];

//  const requestList =
//   dashboardList?.dashboardRequests?.map((item) => ({
//     id: item.requestId,
//     name: item.customerName || "-",
//     room: item.roomName || "",
//     title: item.description,
//     type: item.type,
//     status: item.status,
//     time: item.date,
//   })) || []


const complaintList =
  dashboardList?.tenantcomplaint?.map((item) => ({
    name: item.fullName,
    room: item.roomName || "",
    status: "Pending", 
    type: item.complaintDescription || item.complaintName,
    category: item.complaintType,
    time: item.complaintDate,
  })) || [];

  

  const requestList =
  dashboardList?.dashboardRequests?.map((item) => ({
    name: item.customerName,
    room: item.roomName || "",
    status: item.status, 
    title: item.type, 
    type: item.type,
    time: item.date,
  })) || [];

  const getStatusStyle = (status) => {
  const s = status?.toLowerCase();

  if (s === "pending") return { bg: "#FFF1E6", color: "#EA580C" };
  if (s === "inprogress") return { bg: "#E8F0FF", color: "#2563EB" };
  if (s === "resolved") return { bg: "#E8F7EE", color: "#16A34A" };

  return { bg: "#eee", color: "#333" };
};


  // const month = ["Aug", "Sep", "Oct"]

  // const collectedData = [12.5, 13.2, 14]

  // const outstandingData = [1.2, 0.9, 0.5]

        const revenueTrendData =
  dashboardList?.revenueTrend?.map((item) => ({
    month: item.month,
    collected: item.collected,
    outstanding: item.outstanding,
  })) || [];


  const month = revenueTrendData.map(i => i.month);
const collectedData = revenueTrendData.map(i => i.collected);
const outstandingData = revenueTrendData.map(i => i.outstanding);

const formatToLakhs = (v) => `${(v / 100000).toFixed(0)}`;

// const barData = revenueTrendData
//   .slice(-4)   
//   .map(item => ({
//     month: item.month,
//     collected: Number(item.collected) || 0,
//     outstanding: Number(item.outstanding) || 0,
//   }));

const barData = revenueTrendData.slice(-4);



const yData = barData.map(d => Math.max(d.collected, d.outstanding));


const CustomBars = ({ x, y, bandwidth, data }) => (
  <G>
    {data.map((item, index) => {
      const barWidth = bandwidth / 2;

      return (
        <G key={index}>
          {/* Collected */}
          <Rect
            x={x(index) - barWidth / 2}   // ✅ center left
            y={y(item.collected)}
            width={barWidth}
            height={Math.max(0, y(0) - y(item.collected))}
            fill="#00A32E"
            rx={6}
          />

          {/* Outstanding */}
          <Rect
            x={x(index) + barWidth / 2}   // ✅ center right
            y={y(item.outstanding)}
            width={barWidth}
            height={Math.max(0, y(0) - y(item.outstanding))}
            fill="#F54900"
            rx={6}
          />
        </G>
      );
    })}
  </G>
);

  const quickActions = [
    {
      label: "Add Tenant",
      icon: Usercircle,
      color: "#7C3AED",
      route: "AddTenant",
      permission: canWriteWalkin
    },
    {
      label: "Add Expense",
      icon: ExpenseImg,
      color: "#EF4444",
      route: "AddExpenses",
      permission: canWriteExpense
    },
    {
      label: "Create Bills",
      icon: CrateBill,
      color: "#F59E0B",
      route: "CreateBills",
      permission: canWriteInvoice
    },

    {
      label: "Make agreement",
      icon: AgreementImg,
      color: "#10B981",
      route: "Agreement",
      permission: canReadDashboard
    },
  ];



  useEffect(() => {
    retriveData("token").then(t => console.log("TOKEN:", t));
  }, [])

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;



  const [showBanner, setShowBanner] = useState(false);
  const bannerDismissedRef = useRef(false);


  useEffect(() => {
    if (!PGDetails) return;

    if (bannerDismissedRef.current) return;

    const { isSubscriptionActive, remainingDaysLeft } = PGDetails;

    // ❌ 8+ days → NEVER show
    if (remainingDaysLeft > 7 && isSubscriptionActive) {
      setShowBanner(false);
      return;
    }

    // ✅ 7 days or less OR expired
    if (!isSubscriptionActive || remainingDaysLeft <= 7) {
      setShowBanner(true);
    }
  }, [PGDetails]);
  ;

  const getSubscriptionCopy = (PGDetails) => {
    if (!PGDetails) return null;

    const { isSubscriptionActive, remainingDaysLeft } = PGDetails;

    if (!isSubscriptionActive || remainingDaysLeft <= 0) {
      return {
        title: "Subscription Expired",
        subtitle:
          "Your SmartStay subscription has expired. Please renew now to continue using all features without interruption.",
      };
    }

    if (remainingDaysLeft === 1) {
      return {
        title: "Subscription Expiring Tomorrow",
        subtitle:
          "Your SmartStay subscription will expire tomorrow. Renew now to avoid service disruption.",
      };
    }

    if (remainingDaysLeft <= 7) {
      return {
        title: "Subscription Expiring Soon",
        subtitle:
          `Your SmartStay subscription will expire in ${remainingDaysLeft} days. Renew soon to ensure uninterrupted service.`,
      };
    }

    return null;
  };


  const shouldShowBanner = (() => {
    if (!PGDetails) return false;

    const { isSubscriptionActive, remainingDaysLeft } = PGDetails;

    if (bannerDismissedRef.current) return false;

    if (!isSubscriptionActive || remainingDaysLeft <= 0) return true;
    if (remainingDaysLeft === 1) return true;
    if (remainingDaysLeft <= 7) return true;

    return false; // ⛔ 8+ days → NEVER SHOW
  })();


  // useEffect(() => {
  //   if (!PGDetails) return;

  //   setShowBanner(shouldShowBanner);
  // }, [PGDetails]);


  const copy = getSubscriptionCopy(PGDetails);

  const handleCloseBanner = () => {
    bannerDismissedRef.current = true; // this login only
    setShowBanner(false);
  };




  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);


  console.log("Hostels:", hostelList);

  //   const activeHostel = hostelList &&  hostelList.find(h =>
  //   (h.hostelId ?? h.id) === activeHostelId
  // ) || hostelList[0];

  const activeHostel =
    hostelList?.find(h => (h.hostelId ?? h.id) === activeHostelId) ??
    hostelList?.[0] ??
    {};


  const navigation = useNavigation();


  //  useEffect(() => {
  //   if (!login.getToken) return;


  //   getHostels(login.getToken).then((res) => {
  //     updateHostelList(res.data);
  //   });
  // }, [login.getToken]);

  useEffect(() => {
    getHostels().then((res) => {
      console.log("res", res);

      if (res?.data) {
        updateHostelList(res.data);
      }
    });
  }, []);


  useEffect(() => {
    if (activeHostel) {
      setActiveHostelId(activeHostel.hostelId)
    }
  }, [activeHostel])

  console.log("activeHostelId", activeHostelId);


  // useFocusEffect(
  //   useCallback(() => {
  //     const onBackPress = () => {
  //       if (drawerVisible) {
  //         setDrawerVisible(false);
  //         return true;
  //       }
  //       return false;
  //     };

  //     const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
  //     return () => sub.remove();
  //   }, [drawerVisible])
  // );


  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {

        // Drawer open → close drawer
        if (drawerVisible) {
          setDrawerVisible(false);
          return true;
        }

        // Updates → Announcement
        if (activeTab === "Updates") {
          setActiveTab("Announcement");
          return true;
        }

        // Announcement → Dashboard
        if (activeTab === "Announcement") {
          setActiveTab("Dashboard");
          return true;
        }

        // Dashboard → EXIT APP
        // if (activeTab === "Dashboard") {
        //   BackHandler.exitApp();
        //   return true;
        // }

        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [activeTab, drawerVisible])
  );

  //   useFocusEffect(
  //   useCallback(() => {
  //     const onBackPress = () => {


  //       if (drawerVisible) {
  //         setDrawerVisible(false);
  //         return true;
  //       }


  //       if (activeTab === "Updates") {
  //         setActiveTab("Announcement");
  //         return true;
  //       }

  //       if (activeTab === "Announcement") {
  //         setActiveTab("Dashboard");
  //         return true;
  //       }


  //       return false;
  //     };

  //     const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
  //     return () => sub.remove();
  //   }, [drawerVisible, activeTab])
  // );

  // useFocusEffect(
  //   useCallback(() => {
  //     const onBackPress = () => {
  //       if (navigation.canGoBack()) {
  //         navigation.goBack();
  //         return true;
  //       }
  //       return false;
  //     };

  //     const subscription = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       onBackPress
  //     );

  //     return () => subscription.remove();
  //   }, [navigation])
  // );
  const context = useContext(LoginContexts)
  const [tooltip, setTooltip] = useState(null);
  const { width } = Dimensions.get("window");
  // const [hostelList,setHostelList]=useState([])

  console.log("activeHostel", activeHostel)
  console.log("hostelList", hostelList);


  const months = ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024"];
  const advance = [100000, 150000, 23000, 31000, 28000];
  const advanceReturn = [10000, 12000, 21000, 30000, 50000];


    const occupiedArray = occupancyTrendData.map(i => i.occupied);
const vacantArray = occupancyTrendData.map(i => i.vacant);
const labels = occupancyTrendData.map(i => i.label);

  const padding = 20;
  const chartHeight = 250;

  const [chartWidth, setChartWidth] = useState(width - 40);

  // const maxY = Math.max(...advance, ...advanceReturn);
  const maxY = Math.max(...occupiedArray, ...vacantArray, 10); 

  const getX = (i) =>
    (i / (months.length - 1)) * (chartWidth - padding * 2) + padding;

  const getY = (value) =>
    padding + (1 - value / maxY) * (chartHeight - padding * 2);

const interval = 4;

const filteredLabels = labels.map((item, index) => {
  return index % interval === 1 ? item : "";
});


// safe fallback

  const createPath = (array) =>
    array
      .map((v, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(v)}`)
      .join(" ");

   




  const onPointPress = (index) => {
    setTooltip({
      x: getX(index),
      y: Math.min(getY(advance[index]), getY(advanceReturn[index])) - 15,
      month: months[index],
      advance: advance[index],
      advanceReturn: advanceReturn[index]
    });
  };


  const reorderHostels = (list, activeId) => {
    const selected = list.find(h => (h.hostelId ?? h.id) === activeId);
    const others = list.filter(h => (h.hostelId ?? h.id) !== activeId);

    return selected ? [selected, ...others] : list;
  };

  useEffect(() => {
    if (!activeHostelId) return;

    getHostels().then((res) => {
      console.log("res", res);
      if (res?.data) {
        const reordered = reorderHostels(res.data, activeHostelId);
        updateHostelList(reordered);
      }
    });
  }, [activeHostelId]);


  //   useEffect(() => {
  //   if (!login.getToken) return;
  //   if(activeHostelId){
  //  getHostels(login.getToken).then((res) => {
  //     const reordered = reorderHostels(res.data, activeHostelId);
  //     updateHostelList(reordered);
  //   });
  //   }

  // }, [login.getToken, activeHostelId]);



  // useEffect(()=>{
  //     getHostels(context.getToken).then(r=>{
  //       console.log(r)
  //       setHostelList(r.data)
  //     })
  // },[])


  const statsCards = [
  {
    title: "Revenue",
    amount: `₹ ${financeData.totalIncome}`,
    change: `${financeData.incomeTrend}%`,
    isPositive: false,
    bg: ["#FFFFFF", "#F2FFF5"],
    icon: RevenueImg,
  },
  {
    title: "Expenses",
    amount: `₹ ${financeData.totalExpense}`,
    change: `${financeData.expenseTrend}%`,
    isPositive: true,
    bg: ["#FFFFFF", "#FFF6EB"],
    icon: ExpenseImg,
  },
  {
    title: "Profit",
    amount: `₹ ${financeData.netProfit}`,
    change: `${financeData.profitTrend}%`,
    isPositive: true,
    bg: ["#FFFFFF", "#F6FAFF"],
    icon: ProfitImg,
  },
];


  const data = [
    { label: "Jun 2025", value: 5000 },
    { label: "Jul 2025", value: 195000 },
    { label: "Aug 2025", value: 168000 },
    { label: "Sep 2025", value: 0 },
    { label: "Oct 2025", value: 0 },
    { label: "Nov 2025", value: 5000 }
  ];




  const revenue = [300, 250, 400, 150, 450];
  const product = [400, 200, 350, 250, 300];
  const BarLabels = ({ x, y, bandwidth, revenueData, productData }) => (
    <>
      {revenueData.map((value, index) => (
        <SvgText
          key={`rev-${index}`}
          x={x(index) + bandwidth * 0}
          y={y(value) + 20}
          fill="#FFFFFF"
          fontSize="11"
          fontWeight="bold"
          rotation={-90}
          origin={`${x(index) + bandwidth * 0.22}, ${y(value) + 20}`}
        >
          ₹{value}
        </SvgText>
      ))}

      {productData.map((value, index) => (
        <SvgText
          key={`pro-${index}`}
          x={x(index) + bandwidth * 0.40}
          y={y(value) + 20}
          fill="#FFFFFF"
          fontSize="11"
          fontWeight="bold"
          rotation={-90}
          origin={`${x(index) + bandwidth * 0.70}, ${y(value) + 20}`}
        >
          ₹{value}
        </SvgText>
      ))}
    </>
  );







  const tabs = [
    { key: "Dashboard", active: Profile, inactive: InProfile },
    { key: "Announcement", active: Activeannouncement, inactive: Announcement },
    { key: "Updates", active: ActiveUpdate, inactive: UpdateImg },
  ];



  const cashbackData = [
    { key: 1, value: 65, svg: { fill: "#10B981" } },
    { key: 2, value: 35, svg: { fill: "#E5E7EB" } },
  ];




  const received = 10000;
  const pending = 11000;

  const safeReceived = Number(received) || 0;
  const safePending = Number(pending) || 0;
  const total = safeReceived + safePending;

  const percentage = total === 0 ? 0 : safeReceived / total;

  // Gauge settings
  const radius = 80;
  const strokeWidth = 22;
  const cx = 100;
  const cy = 100;

  // Convert percentage to angle (half circle = 180°)
  const endAngle = Math.PI * percentage; // 0 → π radians

  // Convert angle to coordinates
  const startX = cx - radius;
  const startY = cy;

  const endX = cx + radius * Math.cos(Math.PI - endAngle);
  const endY = cy - radius * Math.sin(Math.PI - endAngle);

  const expenseCategory = [
    { key: 1, value: 95, svg: { fill: "#22C55E" } },
    { key: 2, value: 26, svg: { fill: "#FBBF24" } },
    { key: 3, value: 17, svg: { fill: "#EF4444" } },
    { key: 4, value: 12, svg: { fill: "#A78BFA" } },
    { key: 5, value: 17, svg: { fill: "#0EA5E9" } },
    { key: 6, value: 12, svg: { fill: "#3B82F6" } },
  ];

  const totalCategories = 150;

  const legendItems = [
    { color: "#22C55E", text: "Category 1   95" },
    { color: "#FBBF24", text: "Category 2   26" },
    { color: "#EF4444", text: "Category 3   17" },

    { color: "#A78BFA", text: "Category 4   12" },
    { color: "#0EA5E9", text: "Category 5   17" },
    { color: "#3B82F6", text: "Others 6   12" },
  ];

  const hasHostel = hostelList && hostelList?.length > 0

  const hasHostelProfile = !!activeHostel?.mainImage

  const getProfileInitial = () => {
    if (!hasHostel) return "PG";

    const name = activeHostel?.name?.trim();
    if (!name) return "PG";

    const words = name.split(" ").filter(Boolean);

    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }

    if (words[0].length >= 2) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return words[0][0].toUpperCase();
  };


  console.log("profile", getProfileInitial);

  const filterOptions = []

  const monthOptions =
    filterOptions?.periods?.map((item) => ({
      label: item,
      value: item,
    })) || [];

  const applyFilters = (
    newMonth = selectedMonth,
  ) => {
    const filters = {
      period: newMonth ? newMonth : undefined,
    };

    // GetInvoiceReports(activeHostelId, filters);
  };





  return (
    <>

      {loading && <Loader />}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />


    {
      showExpiryScreen && <SubscriptionExpiredSheet setTabBar={()=>setShowTabBar(true)}
       onClose={()=>setShowExpiredScreen(false)}/>
    }
   

      <View style={[styles.safe, { paddingTop: insets.top }]}>

        <StatusBar backgroundColor="#E9F2FF" barStyle="dark-content" />


        <LinearGradient
          colors={["#E9F2FF", "#F6FBFF"]}
          style={styles.header}
        >


          {/* <View style={styles.headerTop}>
          <View style={styles.hostelRow}>
            <Image source={PgImg} style={{ width: 38, height: 38 }} />
            <View style={{ marginLeft: 12 , flex:1, paddingRight:13}}>
            <Text style={styles.hostelTitle}>  {activeHostel?.name || "Select PG"}</Text>
              <TouchableOpacity onPress={() => navigation.navigate("SettingsPG")}>
                <Text style={styles.changeText}>Change Hostel →</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rightIcons}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => navigation.navigate("NotificationDetails")}
            >
              <Image source={Bell} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconCircle, { marginLeft: 10 }]}
              onPress={() => setDrawerVisible(true)}
            >
              <Image source={Profile} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
          </View>
        </View> */}

          <View style={styles.headerTop}>
            {/* <View style={styles.hostelRow}>
    <Image source={PgImg} style={{ width: 38, height: 38 }} />

    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text style={styles.hostelTitle}>
        {activeHostel?.name || "Select PG"}
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate("SettingsPG")}>
        <Text style={styles.changeText}>Change Hostel →</Text>
      </TouchableOpacity>
    </View>
  </View> */}

            {/* <View style={styles.hostelRow}>
  {hasHostel ? (
    <>

    <TouchableOpacity
        style={styles.hostelAvatar}
        activeOpacity={0.8}
      >
        {hasHostelProfile ? (
          <Image
            source={{ uri: activeHostel?.mainImage }}
            style={styles.hostelAvatarImg}
          />
        ) : (
          <Text style={styles.hostelAvatarText}>
            {getProfileInitial()}
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.hostelTitle}>
          {activeHostel?.name}
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("SettingsPG")}>
          <Text style={styles.changeText}>Change Hostel →</Text>
        </TouchableOpacity>
      </View>
    </>
  ) : (
    <TouchableOpacity
      onPress={() => navigation.navigate("AddPG")}
    >
      <Text style={[styles.hostelTitle, { color: "#2F80ED" }]}>
        + Add PG
      </Text>
    </TouchableOpacity>
  )}
</View> */}

            <View style={styles.hostelRow}>
              <TouchableOpacity style={styles.hostelAvatar}>
                {hasHostelProfile ? (
                  <Image
                    source={{ uri: activeHostel?.mainImage }}
                    style={styles.hostelAvatarImg}
                  />
                ) : (
                  <Text style={styles.hostelAvatarText}>
                    {getProfileInitial()}
                  </Text>
                )}
              </TouchableOpacity>

              {hasHostel ? (
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <TouchableOpacity onPress={() => navigation.navigate("SettingsPG")}>
                    <Text style={styles.hostelTitle}>{activeHostel?.name}</Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Image source={OrangeLocationIcon} style={{ width: 15, height: 15 }} />
                    <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Medium', marginLeft: 2 }}>
                      {activeHostel?.city}</Text>
                  </View>
                  {/* <TouchableOpacity onPress={() => navigation.navigate("SettingsPG")}>
                    <Text style={styles.changeText}>Change Hostel →</Text>
                  </TouchableOpacity> */}

                </View>
              ) : (
                (
                  <Animated.View
                    style={[
                      styles.addPgWrapper,
                      {
                        transform: [{ scale: scaleAnim }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.addPgBtn}
                      onPress={() => navigation.navigate("AddPG")}
                    >
                      <Animated.Text
                        style={[
                          styles.addPgIcon,
                          {
                            transform: [
                              {
                                rotate: rotateAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ["0deg", "90deg"],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        +
                      </Animated.Text>

                      <Text style={styles.addPgText}>Add  PG</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )

              )}
            </View>



            <View style={styles.rightIcons}>
              {/* <TouchableOpacity
      style={styles.iconCircle}
      onPress={() => navigation.navigate("NotificationDetails")}
    >
      <Image source={Bell} style={{ width: 28, height: 28 }} />
    </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.iconCirclenoti}
                onPress={() => navigation.navigate("NotificationDetails")}
              >
                <Image source={Bell} style={{ width: 28, height: 28 }} />

                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>


              <TouchableOpacity
                style={[styles.iconCircle, { marginLeft: 10 }]}
                onPress={() => setDrawerVisible(true)}
              >
                <Image source={Profile} style={{ width: 40, height: 40 }} />
              </TouchableOpacity>
            </View>
          </View>


          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}
          >
            {tabs.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => setActiveTab(item.key)}
                style={styles.tabBtn}
              >

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* <Image
                    source={activeTab === item.key ? item.active : item.inactive}
                    style={{
                      width: 22,
                      height: 22,
                    }}
                  /> */}

                  <Text
                    style={[
                      styles.tabText,
                      activeTab === item.key && {
                        color: "#1E45E1",
                        fontFamily: "Gilroy-Bold",
                        fontSize: 17,
                      },
                    ]}
                  >
                    {"  "}
                    {item.key}
                  </Text>
                </View>

                {activeTab === item.key && <View style={styles.underline} />}
              </TouchableOpacity>
            ))}
          </ScrollView>


        </LinearGradient>


        {activeTab === "Dashboard" && (

          !hasHostel ? (

            <View style={styles.centerContainer}>
              <Image source={EmptyState} style={styles.image} />
              <Text style={styles.nodataText}>
                No PG added yet
              </Text>

              <TouchableOpacity
                style={{
                  marginTop: 20,
                  backgroundColor: "#2F80ED",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
                onPress={() => navigation.navigate("AddPG")}
              >
                <Text style={{ color: "#fff", fontFamily: "Gilroy-Regular" }}>
                  Add PG
                </Text>
              </TouchableOpacity>
            </View>

          ) : (

            <>

              {canReadDashboard && !loading && (

                <>

                  <View style={styles.subTabWrapper}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.subTabContainer}
                    >
                      {subTabs.map((tab) => (
                        <TouchableOpacity
                          key={tab}
                          onPress={() => setActiveSubTab(tab)}
                          style={[
                            styles.subTab,
                            activeSubTab === tab && styles.activeSubTab,
                          ]}
                        >
                          <Text
                            style={[
                              styles.subTabText,
                              activeSubTab === tab && styles.activeSubTabText,
                            ]}
                          >
                            {tab}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}>



                    {activeSubTab === "Activities" && (
                      <>

                        {isExpired ? (

                          <LinearGradient
                            colors={["#10267B", "#1E45E1"]}
                            style={styles.expiryCard}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >

                            <View style={{ flex: 1 }}>
                              <Text style={styles.expiryTitle}>
                                Your Plan has Expired..!
                              </Text>

                              <Text style={styles.expirySub}>
                                Renew your plan to continue managing the property operations.
                              </Text>

                              <TouchableOpacity
                                style={styles.renewBtn}
                                onPress={() => navigation.navigate("SubscriptionPlans")}
                              >
                                <Text style={styles.renewText}>
                                  Renew Now →
                                </Text>
                              </TouchableOpacity>

                            </View>

                          </LinearGradient>

                        ) : (
                          <LinearGradient
                            colors={["#10267B", "#1E45E1"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.expiryCard}
                          >
                            {/* <View style={styles.banner}> */}
                            <View style={{ flex: 1 }}>
                              <Text style={styles.bannerTitle}>SmartStay </Text>
                              <Text style={styles.bannerSub}>
                                The smartest way to manage your PG, All in one place!
                              </Text>
                            </View>

                            <Image source={SmartPlur} style={styles.bannerIcon} />
                            {/* </View> */}
                          </LinearGradient>

                        )}

                        <View style={styles.billingCard}>

                          <View style={styles.billingHeader}>
                            <View style={styles.billingLeft}>

                              <View style={styles.billingIconBox}>
                                <Image source={CrateBill} style={{ width: 18, height: 18 }} />
                              </View>

                              <Text style={styles.billingTitle}>Billing Summary</Text>

                            </View>

                            <TouchableOpacity
                              style={styles.monthBtn}
                              onPress={() => {
                                setTempMonth(selectedMonth);
                                setMonthSheetOpen(true);
                              }}
                            >
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.monthText}>  {selectedMonth || "Select Month"}</Text>
                                <Image
                                  source={DownArrow}
                                  style={{ width: 14, height: 14, marginLeft: 5 }}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>


                          <View style={styles.billingRow}>
                            <Text style={styles.billingLabel}>Invoices Generated</Text>
                         <Text style={styles.billingValue}>
  {dashboardList?.totalInvoiceGenerated}
</Text>
                          </View>


                          <View style={styles.billingRow}>
                            <Text style={styles.billingLabel}>Total Amount</Text>
                            <Text style={styles.billingValueGreen}> ₹ {dashboardList?.totalAmount}</Text>
                          </View>


                          <View style={styles.billingDivider} />


                          <View style={styles.billingRow}>
                            <Text style={styles.billingLabel}>Collected</Text>
                            <Text style={styles.billingValue}> ₹ {dashboardList?.totalPaid}</Text>
                          </View>

                          
                          <View style={styles.billingRow}>
                            <Text style={styles.billingLabel}>Refunded</Text>
                            <Text style={{    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "red"}}> ₹ {dashboardList?.refundedAmount}</Text>
                          </View>


                          <View style={styles.billingRow}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                              <Text style={styles.billingLabel}>Outstanding</Text>
                              <Image source={OutstandingImg} style={{ height: 12, width: 12, marginLeft: 7, }} />
                            </View>
                            <Text style={styles.billingValue}>₹ {dashboardList?.totalPending}</Text>
                          </View>


                          <View style={styles.billingRow}>
                            <Text style={styles.billingLabel}>Collection Rate</Text>
                            <Text style={styles.billingValue}> {dashboardList?.collectionRate}</Text>
                          </View>


                          <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width:  dashboardList?.collectionRate }]} />
                          </View>


                          <Text style={styles.billingFooter}>↑ {dashboardList?.fromLastMonth} from last month</Text>

                        </View>


                        <View style={styles.roomsCard}>

                          {/* Header */}
                          <View style={styles.roomsHeader}>
                            <View style={styles.roomsHeaderLeft}>
                              <View style={styles.roomsIconBox}>
                                <Image source={RoomsBedImg} style={{ width: 18, height: 18 }} />
                              </View>
                              <Text style={styles.roomsTitle}>Rooms & Beds</Text>
                            </View>
                          </View>

                          {/* Room / Bed count */}
                          <View style={styles.roomsRow}>
                            <Text style={styles.roomsLabel}>Total Rooms</Text>
                            <Text style={styles.roomsValue}>{dashboardList?.totalRooms}</Text>
                          </View>

                          <View style={styles.roomsRow}>
                            <Text style={styles.roomsLabel}>Total Beds</Text>
                            <Text style={styles.roomsValue}>{dashboardList?.totalBeds}</Text>
                          </View>

                          {/* Divider */}
                          <View style={styles.roomsDivider} />
                          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.sharingTitle}>Sharing Breakdown</Text>

                            <TouchableOpacity
  onPress={() => {
    if (sharingData && sharingData.length > 0) {
      setSharingModalVisible(true);
    }
  }}
  disabled={!sharingData || sharingData.length === 0}
  style={{
    opacity: sharingData && sharingData.length > 0 ? 1 : 0.4,
  }}
>
                              <Image source={SharingBreakdownImg} style={styles.downupIcons} />
                            </TouchableOpacity>
                          </View>

{sharingData && sharingData.length > 0 ? (
  sharingData.map((item, index) => (
    <View style={styles.shareRow} key={index}>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBarBlue,
            {
              width: `${item?.occupancyRatio || 0}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.shareText}>
        {item?.shareType}: {item?.totalBeds}
      </Text>
    </View>
  ))
) : (
  <Text style={{ color: "red", marginTop: 10 , fontFamily:"Gilroy-Semibold" }}>
    No sharing details are there!
  </Text>
)}

                        </View>


                        <View style={styles.occupancyCard}>

                          {/* Header */}
                          <View style={styles.occupancyHeader}>
                            <View style={styles.occupancyHeaderLeft}>
                              <View style={styles.occupancyIconBox}>
                                <Image source={OccupancyImg} style={{ width: 18, height: 18 }} />
                              </View>
                              <Text style={styles.occupancyTitle}>Occupancy</Text>
                            </View>

                            <TouchableOpacity style={styles.dropdownBtn} onPress={() => {
                              setTempMonth(selectedMonth);
                              setMonthSheetOpen(true);
                            }}>
                              <Text style={{ fontSize: 16 }}>▾</Text>
                            </TouchableOpacity>
                          </View>

                          {/* Occupied */}
                          <View style={styles.occupancyRow}>
                            <Text style={styles.occupancyLabel}>Occupied Beds</Text>
                            <Text style={styles.occupiedValue}>  {dashboardList?.occupiedBeds}</Text>
                          </View>

                          {/* Available */}
                          <View style={styles.occupancyRow}>
                            <Text style={styles.occupancyLabel}>Available Beds</Text>
                            <Text style={styles.availableValue}>{dashboardList?.freeBeds}</Text>
                          </View>

                          {/* Divider */}
                          <View style={styles.occupancyDivider} />

                          {/* Rate */}
                          <View style={styles.occupancyRow}>
                            <Text style={styles.occupancyLabel}>Occupancy Rate</Text>
                            <Text style={styles.occupancyRate}>
                              {dashboardList?.occupancyRate}%
                            </Text>
                          </View>

                          {/* Progress Bar */}
                          <View style={styles.occupancyProgress}>
                            <View
                              style={[
                                styles.occupancyProgressFill,
                                { width: `${dashboardList?.occupancyRate}%` }
                              ]}
                            />
                          </View>

                          <Text style={styles.occupancyFooter}>↑ {dashboardList?.occupancyRateFromLastMonth}% from last month</Text>

                        </View>


                        <View style={styles.tenantsCard}>

                          {/* Header */}
                          <View style={styles.tenantsHeader}>
                            <View style={styles.tenantsHeaderLeft}>
                              <View style={styles.tenantsIconBox}>
                                <Image source={TenantImg} style={{ width: 18, height: 18 }} />
                              </View>
                              <Text style={styles.tenantsTitle}>Tenants</Text>
                            </View>

                            <TouchableOpacity style={styles.dropdownBtn} onPress={() => {
                              setTempMonth(selectedMonth);
                              setMonthSheetOpen(true);
                            }}>
                              <Text style={{ fontSize: 16 }}>▾</Text>
                            </TouchableOpacity>
                          </View>

                          {/* Total Tenants */}
                          <View style={styles.tenantsRow}>
                            <Text style={styles.tenantsLabel}>Total Tenants</Text>
                            <Text style={styles.tenantsValue}>
                             {dashboardList?.totalTenants}
                            </Text>
                          </View>

                          {/* Check-in Tenants */}
                          <View style={styles.tenantsRow}>
                            <Text style={styles.tenantsLabel}>Check-in Tenants</Text>
                            <Text style={styles.checkinValue}>
                               {dashboardList?.checkInTenants}
                            </Text>
                          </View>

                          {/* Divider */}
                          <View style={styles.tenantsDivider} />

                          {/* Notice Period */}
                          <View style={styles.noticeRow}>
                          <Text style={styles.noticeTitle}>Notice Period</Text>
 <View style={styles.noticeBadge}>
                              <Text style={styles.noticeBadgeText}>
                              {dashboardList?.noticePeriod} Tenants
                              </Text>
                            </View>
                          
                             </View>
                            <Text style={styles.checkoutText}>
                              Next Checkout : {dashboardList?.nextCheckout}
                            </Text>

                           
                       

                        </View>

                        <View style={styles.advanceCard}>

                          {/* Header */}
                          <View style={styles.advanceHeader}>
                            <View style={styles.advanceHeaderLeft}>
                              <View style={styles.advanceIconBox}>
                                <Image source={AdvanceImg} style={{ width: 18, height: 18 }} />
                              </View>
                              <Text style={styles.advanceTitle}>Advance Holding</Text>
                            </View>

                            <TouchableOpacity style={styles.dropdownBtn} onPress={() => {
                              setTempMonth(selectedMonth);
                              setMonthSheetOpen(true);
                            }}>
                              <Text style={{ fontSize: 16 }}>▾</Text>
                            </TouchableOpacity>
                          </View>

                          {/* Total Advance */}
                          <View style={styles.advanceRow}>
                            <Text style={styles.advanceLabel}>Total Advance</Text>
                            <Text style={styles.advanceValue}>
                             ₹{dashboardList?.totalAdvance}
                            </Text>
                          </View>

                          {/* Refunded */}
                          <View style={styles.advanceRow}>
                            <Text style={styles.advanceLabel}>Advance Holding</Text>
                            <Text style={styles.refundValue}>
                            ₹{dashboardList?.advanceHolding}
                            </Text>
                          </View>

                          {/* Divider */}
                          <View style={styles.advanceDivider} />

                          {/* Others */}
                          <View style={styles.advanceRow}>
                            <Text style={styles.advanceLabel}>Others</Text>
                            <Text style={styles.otherValue}>
                              ₹{dashboardList?.otherAdvance}
                            </Text>
                          </View>

                          <Text style={styles.advanceSubText}>
                            Non-Refundable & more
                          </Text>

                        </View>

                        <View style={styles.bookingsCard}>

                          {/* Header */}
                          <View style={styles.bookingHeader}>
                            <View style={styles.bookingHeaderLeft}>
                              <View style={styles.bookingIconBox}>
                                <Image source={CheckinImg} style={{ width: 18, height: 18 }} />
                              </View>
                              <Text style={styles.bookingTitle}>Upcoming Check-ins</Text>
                            </View>

                            <TouchableOpacity
                              style={styles.monthBtn}
                              onPress={() => {
                                setTempMonth(selectedMonth);
                                setMonthSheetOpen(true);
                              }}
                            >
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.monthText}>  {selectedMonth || "Select Month"}</Text>
                                <Image
                                  source={DownArrow}
                                  style={{ width: 14, height: 14, marginLeft: 5 }}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>

                          {/* Scrollable list */}
                          <ScrollView
                            style={{ maxHeight: 260 }}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                          >
                            {dashboardList?.checkins?.length > 0 ? (
  dashboardList.checkins.map((item, index) => (
    <View key={index} style={styles.bookingItem}>
      <Text style={styles.bookingName}>{item.customerName}</Text>
      
      <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
      <Text style={styles.bookingInfo}>
        {item?.sharingType} {item?.roomName} {item?.bedName}
      </Text>
      <Text style={styles.bookingInfo}>
        Check-in : {item?.joiningDate}
      </Text>
      </View>

      <View style={styles.bookingActions}>
        <TouchableOpacity style={styles.viewBtn} onPress={() => CustomerOverviewshow(item)}>
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkinBtn} onPress={() => handleShowTennantCheckin(item)}>
          <Text style={styles.checkinText}>Check-in</Text>
        </TouchableOpacity>
      </View>
    </View>
  ))
) : (
  <View style={styles.noDataContainer}>
    <Text style={styles.noDataText}>No Upcoming Check-ins</Text>
  </View>
)}

                           {/* {dashboardList?.checkins?.map((item, index) => (
                              <View key={index} style={styles.bookingItem}>

                          <Text style={styles.bookingName}>{item.customerName}</Text>

    <Text style={styles.bookingInfo}>
      {item.sharingType}   {item.roomName}  {item.bedName}
    </Text>

                                <View style={styles.bookingActions}>

                                  <TouchableOpacity style={styles.viewBtn} onPress={()=>CustomerOverviewshow(item)}>
                                    <Text style={styles.viewText}>View</Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity style={styles.checkinBtn} onPress={()=> handleShowTennantCheckin(item)}>
                                    <Text style={styles.checkinText}>Check-in</Text>
                                  </TouchableOpacity>

                                </View>

                              </View>
                            ))} */}

                          </ScrollView>

                        </View>


                        <View style={styles.bookingsCard}>


                          <View style={styles.bookingHeader}>
                            <View style={styles.bookingHeaderLeft}>
                              <View style={styles.bookingIconBox}>
                                <Image source={CheckinImg} style={{ width: 18, height: 18 }} />
                              </View>
                              <Text style={styles.bookingTitle}>Overdue Invoices</Text>
                            </View>

                            <TouchableOpacity
                              style={styles.monthBtn}
                              onPress={() => {
                                setTempMonth(selectedMonth);
                                setMonthSheetOpen(true);
                              }}
                            >
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.monthText}>  {selectedMonth || "Select Month"}</Text>
                                <Image
                                  source={DownArrow}
                                  style={{ width: 14, height: 14, marginLeft: 5 }}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>

                          <ScrollView
                           style={{ maxHeight: 260 }}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                          >

                           {/* {dashboardList?.overdueInvoices?.map((item, index) => (
                              <View key={index} style={styles.invoiceItem}>

                                <View style={styles.invoiceTopRow}>

                                  <View>
                                     <Text style={styles.invoiceName}>{item?.customerName}</Text>

                                    <View style={styles.invoiceSubRow}>
                                      <Text style={styles.invoiceNumber}>
                                        {item?.invoice}
                                      </Text>

                                      <View style={styles.statusBadges}>
                                        <View style={styles.statusDot} />
                                        <Text style={styles.statusText}>{item?.status}</Text>
                                      </View>
                                    </View>
                                  </View>

                                  <View style={{ alignItems: "flex-end" }}>
                                    <Text style={styles.amountText}>
      ₹ {item?.dueAmount}
    </Text>

                                    <Text style={styles.dateText}>
                                      {item?.dueDate}
                                    </Text>
                                  </View>

                                </View>

                                <View style={styles.actionRow}>
                                  <TouchableOpacity style={styles.paymentBtn} onPress={()=>handleShowRecordPayment(item)}>
                                    <Text style={styles.paymentText}>Record Payment</Text>
                                  </TouchableOpacity>
                                </View>

                              </View>
                            ))} */}

                            {dashboardList?.overdueInvoices?.length > 0 ? (
  dashboardList.overdueInvoices.map((item, index) => (
    <View key={index} style={styles.invoiceItem}>
      <View style={styles.invoiceTopRow}>
        <View>
          <Text style={styles.invoiceName}>{item?.customerName}</Text>

          <View style={styles.invoiceSubRow}>

            <Text style={styles.invoiceNumber}>{item?.invoiceNumber}</Text>

            <View style={styles.statusBadges}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{item?.status}</Text>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.amountText}>₹ {item?.dueAmount}</Text>
          <Text style={styles.dateText}>{item?.dueDate}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.paymentBtn} onPress={() => handleShowRecordPayment(item)}>
          <Text style={styles.paymentText}>Record Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  ))
) : (
  <View style={styles.noDataContainer}>
    <Text style={styles.noDataText}>No Overdue Invoices</Text>
  </View>
)}

                          </ScrollView>

                        </View>

                        {/* <View style={styles.summaryRow}>
                    <View style={[styles.summaryCard, { width: width * 0.45 }]}>
                      <View >

                        <Image
                          source={RoomImg}
                          style={{ width: 35, height: 35 }}
                        />
                      </View>
                      <Text style={styles.cardLabel}>Total Rooms</Text>
                      <Text style={styles.cardValue}>{dashboardList?.totalRooms}</Text>
                    </View>

                    <View style={styles.sideColumn}>

                      <View style={[styles.smallCard, { width: width * 0.4 }]}>
                        <View style={styles.smallCardContent}>
                          <View>
                            <Text style={styles.smallLabel}>Total Beds</Text>
                            <Text style={styles.smallValue}>{dashboardList?.totalBeds}</Text>
                          </View>

                          <View >
                            <Image
                              source={BedImg}
                              style={{ width: 35, height: 35 }}
                            />
                          </View>
                        </View>
                      </View>



                      <View style={styles.smallCard}>
                        <View style={styles.smallCardContent}>
                          <View>
                            <Text style={styles.smallLabel}>Free Bed</Text>
                            <Text style={styles.smallValue}>{dashboardList?.freeBeds}</Text>
                          </View>

                          <View >
                            <Image
                              source={FreeBedImg}
                              style={{ width: 35, height: 35 }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View> */}


                        {/* <Text style={styles.sectionTitle}>Quick Actions</Text> */}

                        {/* 
                  <View style={styles.quickGrid}>
                  
                      {quickActions.map((x, i) => (
  <TouchableOpacity
    key={i}
    style={[
      styles.quickCard,
      !x.permission && { opacity: 0.4 }
    ]}
    disabled={!x.permission}
    onPress={() => {
      if (!x.permission) return;

      if (x.label === "Add Expense") {
        if (categoryList && categoryList.length > 0) {
          navigation.navigate(x.route);
        } else {
          setShowSuccessModal(true);
          setModalMessage(
            "Please add a Category option in Settings before adding expense"
          );
          setModalType("warning");

          setTimeout(() => {
            setShowSuccessModal(false);
          }, 1000);
        }
      } else {
        navigation.navigate(x.route);
      }
    }}
  >
                        <View style={[styles.iconWrapper, { borderColor: x.color }]}>
                          <Image
                            source={x.icon}
                            style={{ width: 30, height: 30, resizeMode: "contain" }}
                          />
                        </View>

                        <Text style={styles.quickLabel}>{x.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View> */}
                        {/* 
          <View style={{ backgroundColor: "#F3F5FF" }}>
                    <View style={styles.statsGrid}>
                 
                      <View style={[styles.statBox, { width: width * 0.42 }]}>
                        <Text style={styles.statTitle}>Occupied Bed</Text>
                        <Text style={styles.statValue}>{dashboardList?.occupiedBeds}</Text>
                      </View>
                      <View style={[styles.statBox, { width: width * 0.42 }]}>
                        <Text style={styles.statTitle}>Next Month Projection</Text>
                        <Text style={styles.statValue}>{dashboardList?.nextMonthProjection}</Text>
                      </View>
                      <View style={[styles.statBox, { width: width * 0.42 }]}>
                        <Text style={styles.statTitle}>Total Tenants</Text>
                        <Text style={styles.statValue}>{dashboardList?.totalCustomers}</Text>
                      </View>
                      <View style={[styles.statBox, { width: width * 0.42 }]}>
                        <Text style={styles.statTitle}>EB Amount</Text>
                        <Text style={styles.statValue}>{dashboardList?.electricityAmount}</Text>
                      </View>
                    </View>




                    <View style={[styles.statBoxOne, { marginHorizontal: 16 }]}>
                      <Text style={styles.statTitle}>Total Asset Value</Text>
                      <Text style={[styles.statValue, { fontSize: 22 }]}>₹ {dashboardList?.totalAssetsValue}</Text>
                    </View>

                  </View>

                  <View style={styles.cardBlue}>
                    <View style={styles.row}>

                      <Image source={AdvanceHand} style={{ width: 25, height: 25 }} />
                      <Text style={styles.cardTitle}>Advance in Hand</Text>
                    </View>
                    <Text style={styles.cardValue}>₹ {dashboardList?.advances}</Text>
                  </View>


                  <View style={styles.cardWhite}>
                    <View style={styles.row}>

                      <Image source={ActiveCompliance} style={{ width: 25, height: 25 }} />
                      <Text style={styles.cardTitle}>New Booking</Text>
                    </View>
                    <Text style={styles.cardValue}>{dashboardList?.bookedBeds}</Text>
                  </View>


                  <View style={styles.cardWhite}>
                    <View style={styles.row}>
                      <Image source={MonthProfit} style={{ width: 25, height: 25 }} />
                      <Text style={styles.cardTitle}>Current Month Profit</Text>
                    </View>
                    <Text style={styles.cardValue}>₹ {dashboardList?.currentMonthProfit}</Text>
                  </View>
                  <View style={styles.cardWhite}>
                    <View style={styles.row}>

                      <Image source={ActiveCompliance} style={{ width: 25, height: 25 }} />
                      <Text style={styles.cardTitle}>Pending Invoice Count</Text>
                    </View>
                    <Text style={styles.cardValue}>{dashboardList?.pendingInvoiceCount}</Text>
                  </View>

                  <View style={styles.cardWhite}>
                    <View style={styles.row}>

                      <Image source={ActiveCompliance} style={{ width: 25, height: 25 }} />
                      <Text style={styles.cardTitle}>Other Profit</Text>
                    </View>
                    <Text style={styles.cardValue}>{dashboardList?.otherProfit}</Text>
                  </View> */}








                      </>
                    )}

                    {activeSubTab === "Expenses & Profit" && (
                      <>
                       {statsCards.map((card, index) => (
  <LinearGradient
    key={index}
    colors={card.bg}
    style={styles.revenueCard}
  >
    <View style={styles.revenueHeader}>
      <View style={styles.revenueLeft}>
        <View style={styles.revenueIconBox}>
          <Image source={card.icon} style={{ width: 18, height: 18 }} />
        </View>
        <Text style={styles.revenueTitle}>{card.title}</Text>
      </View>
    </View>

    <View style={styles.revenueAmountRow}>
      <Text style={styles.revenueAmount}>{card.amount}</Text>
      <Text style={styles.revenueMonth}> this month</Text>
    </View>

    <View style={styles.revenueChangeRow}>
      <Image
        source={card.isPositive ? TrendupImg : TrenddownImg}
        style={styles.downupIcons}
      />
      <Text
        style={{
          color: card.isPositive ? "#16A34A" : "#EF4444",
          fontFamily: "Gilroy-Bold",
        }}
      >
        {card.change}
      </Text>
      <Text style={styles.revenueCompare}> vs last time</Text>
    </View>

    <View style={styles.revenueDivider} />

    <TouchableOpacity style={styles.reportRow}>
      <Text style={styles.reportText}>View Report</Text>
      <Image source={RightArrowImg} style={styles.RightArrowIcon} />
    </TouchableOpacity>
  </LinearGradient>
))}
<View style={styles.expenseBreakdownCard}>
  <View style={styles.expenseBreakdownHeader}>
    <Text style={styles.expenseBreakdownTitle}>
      Expense Breakdown
    </Text>
  </View>

  {expenseBreakdown.length === 0 ? (
    <Text style={{ textAlign: "center", color: "#999", marginTop: 10 , fontFamily:"Gilroy-Semibold"}}>
      No Data Available
    </Text>
  ) : (
    expenseBreakdown.map((item, index) => (
      <View key={index} style={styles.expenseItem}>
        <View style={styles.expenseTopRow}>
          <Text style={styles.expenseLabel}>{item.label}</Text>

          <Text style={styles.expenseAmount}>
            {item.amount} ({item.percentage}%)
          </Text>
        </View>

        <View style={styles.expenseProgressTrack}>
          <View
            style={[
              styles.expenseProgressFill,
              {
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              },
            ]}
          />
        </View>
      </View>
    ))
  )}
</View>
                        {/* <View style={styles.expenseBreakdownCard}>

                          <View style={styles.expenseBreakdownHeader}>
                            <Text style={styles.expenseBreakdownTitle}>
                              Expense Breakdown
                            </Text>

                          </View>


                          {expenseData.map((item, index) => (
                            <View key={index} style={styles.expenseItem}>

                              <View style={styles.expenseTopRow}>
                                <Text style={styles.expenseLabel}>{item.name}</Text>

                                <Text style={styles.expenseAmount}>
                                  {item.amount} ({item.percent}%)
                                </Text>
                              </View>

                              <View style={styles.expenseProgressTrack}>
                                <View
                                  style={[
                                    styles.expenseProgressFill,
                                    {
                                      width: `${item.percent}%`,
                                      backgroundColor: item.color
                                    }
                                  ]}
                                />
                              </View>

                            </View>
                          ))}

                        </View> */}
                      </>
                    )}

                    {activeSubTab === "Requests & Complaint" && (
                      <>
                        <View style={styles.requestsCard}>

                          {/* Header */}
                          <View style={styles.requestHeader}>

                            <View style={styles.requestHeaderLeft}>
                              <View style={styles.requestIconBox}>
                                <Image source={TenantRequestImg} style={{ width: 18, height: 18 }} />
                              </View>

                              <Text style={styles.requestTitle}>Tenant Requests ({dashboardList?.tenantRequests?.total || 0})</Text>
                            </View>

                            <TouchableOpacity
                              style={styles.monthBtn}
                              onPress={() => {
                                setTempMonth(selectedMonth);
                                setMonthSheetOpen(true);
                              }}
                            >
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.monthText}>  {selectedMonth || "Select Month"}</Text>
                                <Image
                                  source={DownArrow}
                                  style={{ width: 14, height: 14, marginLeft: 5 }}
                                />
                              </View>
                            </TouchableOpacity>

                          </View>


                          {/* Status Summary */}
                    <View style={styles.requestStatsRow}>
  {requestStats.map((item, index) => (
    <View
      key={index}
      style={[styles.requestStatBox, { backgroundColor: item.bg }]}
    >
      <Text style={[styles.requestStatNumber, { color: item.text }]}>
        {item.count}
      </Text>
      <Text style={styles.requestStatLabel}>{item.label}</Text>
    </View>
  ))}
</View>


                          {/* Scrollable Request List */}
                          <ScrollView
                            style={{ maxHeight: 220 }}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                          >
{requestList?.length === 0 ? (
  <Text style={{ textAlign: "center", color: "#999" }}>
    No requests are there
  </Text>
) : (
  requestList.map((item, index) => (
                              <View key={index} style={styles.requestItem}>

                                <View style={styles.requestTopRow}>
                                  <Text style={styles.requestName}>
                                    {item?.name}
                                  </Text>

                              {item?.room  &&
                                  <Text style={styles.requestRoom}>
                                    • {item.room}
                                  </Text>
                                  }

                                  <View style={[
                                    styles.statusBadge,
                                    item?.status === "Pending" && { backgroundColor: "#FFF1E6" },
                                    item?.status === "In Progress" && { backgroundColor: "#E8F0FF" }
                                  ]}>
                                    <Text style={[
                                      styles.statusText,
                                      item?.status === "Pending" && { color: "#EA580C" },
                                      item?.status === "In Progress" && { color: "#2563EB" }
                                    ]}>
                                      {item?.status}
                                    </Text>
                                  </View>

                                </View>

                                {/* <Text style={styles.requestIssue}>
                                 {item.title}
                                </Text> */}

                                <View style={styles.requestBottomRow}>
                                  <Text style={styles.requestCategory}>
                                   {item.type}
                                  </Text>

                                  <Text style={styles.requestTime}>
                                   {item.time}
                                  </Text>
                                </View>

                              </View>
                             ))
)}
                          </ScrollView>


                          {/* Footer */}
                          <TouchableOpacity             style={[
                styles.viewRequestsBtn,
                 { opacity: 0.7 }
              ]} disabled>
                            <Text style={styles.viewRequestsText}>
                              View All Requests
                            </Text>
                            <Image source={RightArrowImg} style={styles.RightArrowIcon} />
                            {/* <Text style={styles.viewArrow}>→</Text> */}
                          </TouchableOpacity>

                        </View>

                        <View style={styles.requestsCard}>

                          {/* Header */}
                          <View style={styles.requestHeader}>

                            <View style={styles.requestHeaderLeft}>
                              <View style={styles.requestIconBox}>
                                <Image source={ComplaintRequestImg} style={{ width: 18, height: 18 }} />
                              </View>

                              <Text style={styles.requestTitle}>Tenant  Complaints ({dashboardList?.tenantComplaints?.total || 0})</Text>
                            </View>

                            <TouchableOpacity
                              style={styles.monthBtn}
                              onPress={() => {
                                setTempMonth(selectedMonth);
                                setMonthSheetOpen(true);
                              }}
                            >
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.monthText}>  {selectedMonth || "Select Month"}</Text>
                                <Image
                                  source={DownArrow}
                                  style={{ width: 14, height: 14, marginLeft: 5 }}
                                />
                              </View>
                            </TouchableOpacity>

                          </View>


                          {/* Status Summary */}
                         <View style={styles.requestStatsRow}>
  {requestComplaints.map((item, index) => (
    <View
      key={index}
      style={[styles.requestStatBox, { backgroundColor: item.bg }]}
    >
      <Text style={[styles.requestStatNumber, { color: item.text }]}>
        {item.count}
      </Text>
      <Text style={styles.requestStatLabel}>{item.label}</Text>
    </View>
  ))}
</View>


                          {/* Scrollable Request List */}
                          <ScrollView
                            style={{ maxHeight: 220 }}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled
                          >
{complaintList?.length === 0 ? (
  <Text style={{ textAlign: "center", color: "#999" }}>
    No requests are there
  </Text>
) : (
  complaintList.map((item, index) => (
                              <View key={index} style={styles.requestItem}>

                                <View style={styles.requestTopRow}>
                                  <Text style={styles.requestName}>
                                    {item.name}
                                  </Text>


                               {item.room && 
                                <Text style={styles.requestRoom}>
                                    • {item.room}
                                  </Text>
                               }
                                 

                                  {/* <View style={[
                                    styles.statusBadge,
                                    item.status === "Pending" && { backgroundColor: "#FFF1E6" },
                                    item.status === "In Progress" && { backgroundColor: "#E8F0FF" }
                                  ]}>
                                    <Text style={[
                                      styles.statusText,
                                      item.status === "Pending" && { color: "#EA580C" },
                                      item.status === "In Progress" && { color: "#2563EB" }
                                    ]}>
                                      {item.status}
                                    </Text>
                                  </View> */}

                                </View>

                                <Text style={styles.requestIssue}>
                                  {item?.type}
                                </Text>

                                <View style={styles.requestBottomRow}>
                                  <Text style={styles.requestCategory}>
                                    {item?.category}
                                  </Text>

                                  <Text style={styles.requestTime}>
                                    {item?.time}
                                  </Text>
                                </View>

                              </View>
                                                      ))
)}

                          </ScrollView>


                          {/* Footer */}
                          <TouchableOpacity 
                          // style={styles.viewRequestsBtn}
                           style={[
                styles.viewRequestsBtn,
                 { opacity: 0.7 }
              ]}
                          disabled>
                            <Text style={styles.viewRequestsText}>
                              View All Complaints
                            </Text>

                            <Image source={RightArrowImg} style={styles.RightArrowIcon} />
                          </TouchableOpacity>

                        </View>


                      </>
                    )}

                    {activeSubTab === "Core Analytics" && (
                      <>
                        <View style={styles.card}>
                          <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Occupancy Trend</Text>

                            <TouchableOpacity
                              style={styles.monthBtn}
                              onPress={() => {
                                setTempMonth(selectedMonth);
                                setMonthSheetOpen(true);
                              }}
                            >
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.monthText}>  {selectedMonth || "Select Month"}</Text>
                                <Image
                                  source={DownArrow}
                                  style={{ width: 14, height: 14, marginLeft: 5 }}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                          <View style={{ flexDirection: "row" }}>

                            {/* <View style={{ width: 40, justifyContent: "space-between", marginTop: 10 }}>
                              {[50000, 40000, 30000, 20000, 10000, 0].map((v, i) => (
                                <Text key={i} style={{ fontSize: 10, color: "#6B7280" }}>
                                  {v === 0 ? "0" : v / 1000}
                                </Text>
                              ))}
                            </View> */}

                            <View style={{ width: 30, justifyContent: "space-between", marginTop: 10 }}>
  {[maxY, maxY * 0.75, maxY * 0.5, maxY * 0.25, 0].map((v, i) => (
    <Text key={i} style={{ fontSize: 10, color: "#6B7280" }}>
      {Math.round(v)}
    </Text>
  ))}
</View>


                            <TouchableWithoutFeedback onPress={() => setTooltip(null)}>
                              <View
                                style={{ position: "relative", flex: 1 }}
                                onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
                              >
                                <Svg width={chartWidth} height={chartHeight}>

                                  {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                                    <Line
                                      key={i}
                                      x1={padding}
                                      y1={padding + t * (chartHeight - padding * 2)}
                                      x2={chartWidth - padding}
                                      y2={padding + t * (chartHeight - padding * 2)}
                                      stroke="#E5E7EB"
                                      strokeWidth={1}
                                    />
                                  ))}

    
<Path d={createPath(occupiedArray)} stroke="#10B981" strokeWidth={3} fill="none" />
<Path d={createPath(vacantArray)} stroke="#F54900" strokeWidth={3} fill="none" />

                                  {/* <Path d={createPath(occupiedArray)} stroke="#10B981" strokeWidth={3} fill="none" /> */}

{/* <Path d={createPath(vacantArray)} stroke="#FF5733" strokeWidth={3} fill="none" /> */}

                                  {/* <Path d={createPath(advance)}
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fill="none"
                                  />


                                  <Path d={createPath(advanceReturn)}
                                    stroke="#FF5733"
                                    strokeWidth={3}
                                    fill="none"
                                  /> */}

                              {occupiedArray.map((v, i) => (
  <Circle
    key={i}
    cx={getX(i)}
    cy={getY(v)}
    r={5}
    fill="#10B981"
  />
))}

{vacantArray.map((v, i) => (
  <Circle
    key={i}
    cx={getX(i)}
    cy={getY(v)}
    r={5}
    fill="#F54900"
  />
))}

                                </Svg>

                                {/* {tooltip && (
                    <View style={[styles.tooltipBox, { top: tooltip.y, left: tooltip.x - 70 }]}>
               
                   </View>
)} */}

                                {/* {tooltip && (
                    <View style={[styles.tooltipBox, { top: tooltip.y, left: tooltip.x - 70 }]}>
                      <Text style={styles.tooltipMonth}>{tooltip.month}</Text>
                      <Text style={[styles.tooltipValue, { color: "#3A7BFF" }]}>
                        Avg Occupied{tooltip.advance}
                      </Text>
                      <Text style={[styles.tooltipValue, { color: "#FF5733" }]}>
                       Avg Vacant{tooltip.advanceReturn}
                      </Text>
                    </View>
                  )} */}



                              </View>
                            </TouchableWithoutFeedback>
                          </View>

<View style={styles.monthRow}>
  {filteredLabels.map((m, i) => (
    <Text key={i} style={styles.monthLabel}>
      {m}
    </Text>
  ))}
</View>


                          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 10 }}>
                            <View style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', }}>
                              <Text style={{ fontSize: 14, color: '#4A5565', fontFamily: "Gilroy-Semibold", }}> Avg Occupied</Text>
                              <Text style={{ fontSize: 20, color: '#00A63E', fontFamily: "Gilroy-Semibold", }}>{dashboardList?.occupancyTrendSummary?.avgOccupied || 0}</Text>

                            </View>

                            <View style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', }}>
                              <Text style={{ fontSize: 14, color: '#4A5565', fontFamily: "Gilroy-Semibold", }}> Avg Vacant</Text>
                              <Text style={{ fontSize: 20, color: '#F54900', fontFamily: "Gilroy-Semibold", }}>{dashboardList?.occupancyTrendSummary?.avgVacant || 0}</Text>
                            </View>

                          </View>
                        </View>


                        <View style={styles.revenueTrendCard}>

                          <View style={styles.revenueTrendHeader}>

                            <Text style={styles.revenueTrendTitle}>
                              Revenue Trend
                            </Text>

                            <TouchableOpacity
                              style={styles.monthBtn}
                              onPress={() => {
                                setTempMonth(selectedMonth);
                                setMonthSheetOpen(true);
                              }}
                            >
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.monthText}>  {selectedMonth || "Select Month"}</Text>
                                <Image
                                  source={DownArrow}
                                  style={{ width: 14, height: 14, marginLeft: 5 }}
                                />
                              </View>
                            </TouchableOpacity>

                          </View>


                          <View style={styles.legendRow}>

                            <View style={styles.legendItem}>
                              <View style={[styles.legendDot, { backgroundColor: "#00A32E" }]} />
                              <Text style={styles.legendText}>Collected</Text>
                            </View>

                            <View style={styles.legendItem}>
                              <View style={[styles.legendDot, { backgroundColor: "#F54900" }]} />
                              <Text style={styles.legendText}>Outstanding</Text>
                            </View>

                          </View>


                       <View style={{ flexDirection: "row", height: 220, marginTop: 10 }}>

  <YAxis
    data={barData.map(d => Math.max(d.collected, d.outstanding))}
    contentInset={{ top: 20, bottom: 20 }}
    svg={{ fontSize: 10, fill: "#6B7280" }}
    numberOfTicks={5}
  />

  <View style={{ flex: 1, marginLeft: 10 }}>

 <BarChart
  style={{ height: 200 }}
  data={barData}
  yAccessor={({ item }) => Math.max(item.collected, item.outstanding)}
  contentInset={{ top: 20, bottom: 10, left: 25, right: 25 }} // 👈🔥 SAME AS XAxis
  svg={{ fill: "transparent" }}
>
      <Grid
        svg={{
          stroke: "#E5E7EB",
          strokeDasharray: [4, 4],
        }}
      />
      <CustomBars />
    </BarChart>

   <XAxis
  style={{ marginTop: 10 }}
  data={barData}
  formatLabel={(value, index) => barData[index].month}
  contentInset={{ left: 25, right: 25 }}   // 👈🔥 FIX
  svg={{ fontSize: 11, fill: "#6B7280" }}
/>
  </View>
</View>

                          <View style={styles.chartDivider} />


                          <View style={styles.revenueStatsRow}>

                            <View>
                              <Text style={styles.statLabel}>Total Collected</Text>
                              {/* <Text style={styles.collectedValue}>₹ {dashboardList?.revenueSummary?.totalCollected?.amount || 0}</Text> */}
                              <Text style={styles.collectedValue}>
  ₹ {Number(dashboardList?.revenueSummary?.totalCollected?.amount || 0).toFixed(2)}
</Text>
                              <Text style={styles.statSub}>↓ {dashboardList?.revenueSummary?.totalCollected?.percentageChange || 0}% from last Month</Text>
                            </View>

                            <View>
                              <Text style={styles.statLabel}>Total Outstanding</Text>
          <Text style={styles.outstandingValue}>
  ₹ {Number(dashboardList?.revenueSummary?.totalOutstanding?.amount || 0).toFixed(2)}
</Text>

                              <Text style={styles.statSubGreen}>↑ {dashboardList?.revenueSummary?.totalOutstanding?.percentageChange || 0}% from last Month</Text>
                            </View>

                          </View>

                        </View>






                      </>
                    )}



                    {/* 
          <View style={{ backgroundColor: "#F3F5FF" }}>
            <View style={styles.statsGrid}>
              {[
                { title: "Occupied Bed", value: "53" },
                { title: "Next Month Projection", value: "16" },
                { title: "Total Customer", value: "378" },
                { title: "EB Amount", value: "₹ 24,000" },
              ].map((item, i) => (
                <View key={i} style={[styles.statBox, { width: width * 0.42 }]}>
                  <Text style={styles.statTitle}>{item.title}</Text>
                  <Text style={styles.statValue}>{item.value}</Text>
                </View>
              ))}
            </View>




            <View style={[styles.statBoxOne, { marginHorizontal: 16 }]}>
              <Text style={styles.statTitle}>Total Asset Value</Text>
              <Text style={[styles.statValue, { fontSize: 22 }]}>₹ 14,550</Text>
            </View>

          </View> */}



                    {/* <View style={styles.chartCard}>

            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Expenses Vs Revenue</Text>

              <View style={styles.dropdownBox}>
                <Text style={styles.dropdownText}>Last 6 Months</Text>
                <Text style={{ fontSize: 18, marginLeft: 4 }}>▾</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", height: 330, marginTop: 10 }}>
              <YAxis
                data={[0, 100, 200, 300, 400, 500]}
                numberOfTicks={6}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{ fill: "#6B7280", fontSize: 10 }}
              />





              <View style={{ flex: 1, marginLeft: 10 }}>

                <BarChart
                  style={{ height: 300 }}
                  data={[
                    { data: revenue, svg: { fill: "#EF4444", rx: 6, ry: 6 } },
                    { data: product, svg: { fill: "#22C55E", rx: 6, ry: 6 } }
                  ]}
                  spacingInner={0.3}
                  spacingOuter={0.1}
                  contentInset={{ top: 20, bottom: 20 }}
                >
                  <Grid
                    belowChart={true}
                    direction="HORIZONTAL"
                    ticks={[0, 100, 200, 300, 400, 500]}
                    svg={{ stroke: "#E5E7EB", strokeWidth: 1, opacity: 0.7 }}
                    contentInset={{ top: 20, bottom: 20 }}
                  />


                  <BarLabels
                    revenueData={revenue}
                    productData={product}
                  />
                </BarChart>




                
                <XAxis
                  style={{ marginTop: 12 }}
                  data={[0, 1, 2, 3, 4]}
                  formatLabel={(i) =>
                    ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024"][i]
                  }
                  contentInset={{ left: 25, right: 25 }}
                  svg={{ fontSize: 10, fill: "#374151" }}
                />

              </View>
            </View>

       
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#EF4444" }]} />
                <Text style={styles.legendText}>Revenue</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#22C55E" }]} />
                <Text style={styles.legendText}>Product</Text>
              </View>
            </View>

          </View> */}





                    {/* <View style={styles.card}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Total Cashback</Text>

              <View style={styles.dropdownBox}>
                <Text style={styles.dropdownText}>Last 6 Months</Text>
                <Text style={{ fontSize: 18, marginLeft: 4 }}>▾</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", margin: 16 }}>
              <Svg width={200} height={150}>

               
                <Path
                  d={`M ${cx - radius} ${cy}
          A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                  stroke="#E5E7EB"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />

               
                <Path
                  d={`M ${startX} ${startY}
          A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
                  stroke="#10B981"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                />

               
                <Text
                  style={{
                    position: "absolute",
                    top: 90,
                    left: 110,
                    transform: [{ translateX: -40 }],
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#000",
                  }}
                >
                  ₹{safeReceived.toLocaleString()}
                </Text>

              </Svg>


              <View style={{ marginLeft: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#10B981", marginRight: 8 }} />
                  <Text>Received ₹{safeReceived.toLocaleString()}</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#E5E7EB", marginRight: 8 }} />
                  <Text>Pending ₹{safePending.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </View> */}






                    <View style={{ height: 50 }} />
                  </ScrollView>
                </>
              )}

              {!canReadDashboard && !loading && (
                <View style={styles.centerContainer}>
                  <Image source={EmptyState} style={styles.image} />
                  <Text style={styles.nodataText}>
                    You do not have access to view Dashboard
                  </Text>
                </View>
              )}
            </>
          )
        )}


        {activeTab === "Announcement" && (
          !canReadAnnouncement && !loading ? (
            <View style={styles.centerContainer}>
              <Image source={EmptyState} style={styles.image} />
              <Text style={styles.nodataText}>
                You do not have access to view Announcements
              </Text>
            </View>
          ) : (
            <AnnouncementScreen onGoBack={() => setActiveTab("Dashboard")} />
          )
        )}

        {activeTab === "Updates" && (
          !canReadUpdates && !loading ? (
            <View style={styles.centerContainer}>
              <Image source={EmptyState} style={styles.image} />
              <Text style={styles.nodataText}>
                You do not have access to view Updates
              </Text>
            </View>
          ) : (
            <UpdatesScreen onGoBack={() => setActiveTab("Announcement")} />
          )
        )}


        <ProfileDrawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
        />

        <FilterBottomSheet
          visible={monthSheetOpen}
          title="Select Month"
          options={monthOptions}
          selectedValues={tempMonth ? [tempMonth] : []}
          setSelectedValues={(val) => setTempMonth(val[0])}
          isSingleSelect={true}

          onReset={() => {
            setTempMonth("");
            setSelectedMonth("");
            setMonthSheetOpen(false);

            applyFilters("", billStatus, type);
          }}

          onApply={() => {
            setSelectedMonth(tempMonth);
            setMonthSheetOpen(false);

            applyFilters(tempMonth, billStatus, type);
          }}

          onClose={() => setMonthSheetOpen(false)}
        />

      </View >


      <Modal
        visible={sharingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSharingModalVisible(false)}
      >
   <View style={styles.modalOverlay}>

    {/* backdrop */}
    <TouchableWithoutFeedback onPress={() => setSharingModalVisible(false)}>
      <View style={StyleSheet.absoluteFillObject} />
    </TouchableWithoutFeedback>

          
              <View style={styles.modalContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', }}>
                  <Image source={SharingImg} style={{ height: 15, width: 15, alignItems: 'center', marginTop: 2, marginRight: 5 }} />

                  <Text style={styles.modalTitle}>Detailed Sharing Breakdown</Text>
                </View>
                {/* 1 Sharing */}
              <ScrollView style={{ maxHeight: 430 }}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled>
  {sharingData.map((item, index) => (
    <View style={styles.shareCard} key={index}>
      
      <View style={styles.shareCardHeader}>
        <Text style={styles.shareCardTitle}>
          {item.shareType}
        </Text>

        <Text style={styles.roomsAvailable}>
          {item.availableRooms} Rooms Available
        </Text>
      </View>

      <View style={styles.shareCardRow}>
        <View>
          <Text style={styles.cardLabel}>Rooms</Text>
          <Text style={styles.cardValue}>{item.totalRooms}</Text>
        </View>

        <View>
          <Text style={styles.cardLabel}>Total Beds</Text>
          <Text style={styles.cardValue}>{item.totalBeds}</Text>
        </View>

        <View>
          <Text style={styles.cardLabel}>Occupied</Text>
          <Text style={{    fontSize: 28,
    fontFamily: "Gilroy-Bold",
    color: "#16A34A" ,  marginTop: 6 }}>
            {item.occupiedBeds}
          </Text>
        </View>
      </View>

    </View>
  ))}
</ScrollView>

              </View>
         
          </View>
        {/* </TouchableWithoutFeedback> */}
      </Modal>


      <RecordPaymentSheet
  visible={showRecordPayment}
  onClose={() => setShowRecordPayment(false)}
  selectedBill={selectedBill}
/>

      {/* {showExpiryModal && (
  <SubscriptionFullScreenAlert
    visible={true}
    onClose={() => {
      setShowExpiryModal(false);
      setShowExpiryBanner(true);
    }}
  />

)} */}




      {/* {showBanner && (
  <SubscriptionBanner
    visible={true}
    title={copy?.title}
    subtitle={copy?.subtitle}
    primaryText="Renew now"
    onClose={handleCloseBanner}
  />
)} */}



      {/* {showBanner && (
  <SubscriptionBanner
    text={bannerText}
    bgColor="#DC2626" // Red
  />
)} */}

    </>
  );
}



const styles = StyleSheet.create({
  safe: { backgroundColor: "#fff", flex: 1 },

  header: {
    padding: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    width: 90,
    justifyContent: "flex-end",
  },


  headerTop: {
    flexDirection: "row",
    // alignItems: "flex-start",
    alignItems: "center",
  },


  hostelRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    // paddingRight: 30,   
  },

  hostelAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    // marginRight: 10, 
  },

  hostelAvatarText: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "black",
  },

  hostelAvatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: 19,
    resizeMode: "cover",
  },

  addPgWrapper: {
    marginLeft: 12,
  },

  addPgBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2F80ED",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
    shadowColor: "#89ec27",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  addPgIcon: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginRight: 8,
  },

  addPgText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
  },


  hostelTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B",
    flexWrap: "wrap",
  },



  changeText: { fontSize: 12, color: "#2F80ED", marginTop: 3, fontFamily: "Gilroy-Regular" },


  iconCircle: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",

  },
  iconCirclenoti: {
    position: "relative",
    padding: 6,

  },

  tabsRow: { flexDirection: "row", marginTop: 18 },

  tabBtn: { marginRight: 20 },

  tabText: { fontSize: 17, color: "#6B7280", fontFamily: "Gilroy-Bold" },

  underline: {
    height: 3,
    backgroundColor: "#1E45E1",
    borderRadius: 6,
    marginTop: 8,
  },

  subTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 10,
    backgroundColor: "#fff",
  },

  subTabWrapper: {
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: 6,
  },

  subTabContainer: {
    paddingHorizontal: 16,
    alignItems: "center"
  },

  activeSubTab: {
    backgroundColor: "#EEF2FF",
    borderColor: "#3A7BFF",
  },

  subTabText: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Gilroy-Medium",
  },

  activeSubTabText: {
    color: "#1E45E1",
    fontFamily: "Gilroy-Bold",
  },

  financeCard: {
    backgroundColor: "#F9FAFB",
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  financeTitle: {
    fontSize: 14,
    color: "#6B7280",
  },

  financeAmount: {
    fontSize: 22,
    fontFamily: "Gilroy-Bold",
    marginTop: 6,
  },

  financeSub: {
    fontSize: 12,
    color: "#6B7280",
  },

  banner: {
    backgroundColor: "#1E45E1",
    margin: 16,
    padding: 20,
    paddingRight: 10,
    borderRadius: 14,
    overflow: "hidden",
    flexDirection: "row",
  },

  expiryCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16
  },

  expiryTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Gilroy-Bold"
  },

  expirySub: {
    color: "#E5E7EB",
    marginTop: 6,
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    lineHeight: 20,
    width: 250
  },

  renewBtn: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "white",
    borderWidth: 0.2,
  },

  renewText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Gilroy-Bold"
  },

  bannerIcon: {
    width: 142,
    height: 140,
    position: "absolute",
    right: 5,
    top: -5,

  },

  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Gilroy-Bold",
  },

  bannerSub: {
    color: "white",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    // fontStyle: "italic",
    fontFamily: "Gilroy-Regular",
    width: 250,
  },

  billingCard: {
    // backgroundColor:"#F9FAFB",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },

  billingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14
  },

  billingLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  billingIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#FFF4E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  billingTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  monthBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
  },

  monthText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  billingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6
  },

  billingLabel: {
    fontSize: 13,
    color: "#4A5565",
    fontFamily: "Gilroy-Regular"
  },

  billingValue: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#222222"
  },

  billingValueGreen: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#00A63E"
  },

  billingDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8
  },

  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 10
  },

  progressFill: {
    height: 6,
    backgroundColor: "#F54900",
    borderRadius: 10
  },

  billingFooter: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6
  },



  roomsCard: {
    // backgroundColor:"#F9FAFB",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },

  roomsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },

  roomsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  roomsIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  roomsTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  roomsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6
  },

  roomsLabel: {
    fontSize: 13,
    color: "#4A5565",
    fontFamily: "Gilroy-Regular"
  },

  roomsValue: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#111"
  },

  roomsDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10
  },

  sharingTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
    fontFamily: "Gilroy-Medium"
  },

  shareRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },

  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginRight: 20
  },

  progressBarBlue: {
    height: 6,
    backgroundColor: "#2563EB",
    borderRadius: 10
  },

  shareText: {
    fontSize: 12,
    color: "#374151",
    width: 100
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20
  },

  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18
  },

  modalTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    marginBottom: 12
  },

  shareCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12
  },

  shareCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  shareCardTitle: {
    fontFamily: "Gilroy-Bold",
    fontSize: 15
  },

  roomsAvailable: {
    fontSize: 12,
    color: "#6B7280"
  },

  shareCardRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  cardLabel: {
    fontSize: 12,
    color: "#6B7280"
  },

  cardValue: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold"
  },

  cardOccupied: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#16A34A"
  },


  occupancyCard: {
    // backgroundColor:"#F9FAFB",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },

  occupancyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },

  occupancyHeaderLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  occupancyIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#E8F7EE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  occupancyTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  dropdownBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },

  occupancyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6
  },

  occupancyLabel: {
    fontSize: 13,
    color: "#4A5565",
    fontFamily: "Gilroy-Regular"
  },

  occupiedValue: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#16A34A"
  },

  availableValue: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#F97316"
  },

  occupancyDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10
  },

  occupancyRate: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  occupancyProgress: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 10
  },

  occupancyProgressFill: {
    height: 6,
    backgroundColor: "#16A34A",
    borderRadius: 10
  },

  occupancyFooter: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6
  },


  tenantsCard: {
    // backgroundColor:"#F9FAFB",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },

  tenantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },

  tenantsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  tenantsIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  tenantsTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  tenantsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6
  },

  tenantsLabel: {
    fontSize: 13,
    color: "#4A5565",
    fontFamily: "Gilroy-Regular"
  },

  tenantsValue: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  checkinValue: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    color: "#16A34A"
  },

  tenantsDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10
  },

  noticeTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
    fontFamily: "Gilroy-Medium"
  },

  noticeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  checkoutText: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Gilroy-Regular"
  },

  noticeBadge: {
    backgroundColor: "#FFF1E6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },

  noticeBadgeText: {
    fontSize: 12,
    color: "#F97316",
    fontFamily: "Gilroy-Bold"
  },

  advanceCard: {
    // backgroundColor:"#F9FAFB",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },

  advanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },

  advanceHeaderLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  advanceIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    // backgroundColor:"#FFF4E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  advanceTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  advanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6
  },

  advanceLabel: {
    fontSize: 13,
    color: "#4A5565",
    fontFamily: "Gilroy-Regular"
  },

  advanceValue: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  refundValue: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#F97316"
  },

  otherValue: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#16A34A"
  },

  advanceDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10
  },

  advanceSubText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    fontFamily: "Gilroy-Regular"
  },

  bookingsCard: {
    // backgroundColor:"#F9FAFB",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },

  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },

  bookingHeaderLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  bookingIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#E8F7EE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  bookingTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  bookingItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB"
  },

  bookingName: {
    fontSize: 15,
    fontFamily: "Gilroy-Bold",
    color: "#111"
  },

  bookingInfo: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
      fontFamily: "Gilroy-Bold",
  },

  bookingActions: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    marginTop: 10
  },

  viewBtn: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10
  },

  viewText: {
    color: "#374151",
    fontFamily: "Gilroy-Medium"
  },

  checkinBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8
  },

  checkinText: {
    color: "#fff",
    fontFamily: "Gilroy-Bold"
  },

  invoiceItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB"
  },

  invoiceTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  invoiceName: {
    fontSize: 15,
    fontFamily: "Gilroy-Bold",
    color: "#111827"
  },

  invoiceSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4
  },

  invoiceNumber: {
    fontSize: 12,
    color: "#6B7280",
    marginRight: 8,
      fontFamily: "Gilroy-Bold",
  },

  statusBadges: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7E7",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#F59E0B",
    marginRight: 6
  },

  statusText: {
    fontSize: 11,
    color: "#374151"
  },

  amountText: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#111827"
  },

  dateText: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 3
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10
  },

  paymentBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10
  },

  paymentText: {
    color: "#fff",
    fontFamily: "Gilroy-Bold"
  },

  revenueCard: {
    height: 200,
    marginHorizontal: 16,
    marginTop: 10,
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 1,
    paddingLeft: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "space-between"
  },

  revenueHeader: {
    flexDirection: "row",
    alignItems: "center"
  },

  revenueLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  revenueIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#E8F7EE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  revenueTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  revenueAmountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10
  },

  revenueAmount: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111"
  },

  revenueMonth: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 6
  },

  revenueChangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6
  },

  revenueLoss: {
    color: "#EF4444",
    fontSize: 13,
    fontFamily: "Gilroy-Bold"
  },

  revenueCompare: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6
  },

  revenueDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 12
  },

  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10
  },

  reportText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "Gilroy-Medium"
  },

  RightArrowIcon: {
    height: 18, width: 18
  },
  downupIcons: {
    height: 14, width: 14, marginRight: 5
  }
  ,
  expenseCard: {
    height: 200,
    marginHorizontal: 16,
    marginTop: 10,
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 1,
    paddingLeft: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    overflow: "hidden",
    justifyContent: "space-between"
  },

  expenseHeader: {
    flexDirection: "row",
    alignItems: "center"
  },

  expenseLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  expenseIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFF0E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  expenseTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  expenseAmountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10
  },

  expenseAmount: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111"
  },

  expenseMonth: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 6
  },

  expenseChangeRow: {
    marginTop: 6
  },

  expenseNeutral: {
    fontSize: 16,
    color: "#16A34A",
    fontFamily: "Gilroy-Bold"
  },

  expenseDivider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginTop: 12
  },

  expenseReportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10
  },

  expenseReportText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "Gilroy-Medium"
  },

  expenseArrow: {
    fontSize: 18,
    color: "#2563EB",
    fontFamily: "Gilroy-Regular"
  },

  profitCard: {
    height: 200,
    marginHorizontal: 16,
    marginTop: 10,
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 1,
    paddingLeft: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    overflow: "hidden",
    justifyContent: "space-between"
  },

  profitHeader: {
    flexDirection: "row",
    alignItems: "center"
  },

  profitLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  profitIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  profitTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  profitAmountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10
  },

  profitAmount: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    color: "#111"
  },

  profitMonth: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 6
  },

  profitChangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6
  },

  profitGain: {
    color: "#16A34A",
    fontSize: 13,
    fontFamily: "Gilroy-Bold"
  },

  profitCompare: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6
  },

  profitDivider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginTop: 12
  },

  profitReportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10
  },

  profitReportText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "Gilroy-Medium"
  },

  profitArrow: {
    fontSize: 18,
    color: "#2563EB",
    fontWeight: "600"
  },
  expenseBreakdownCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA"
  },

  expenseBreakdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },

  expenseBreakdownTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  dropdownArrow: {
    fontSize: 16,
    color: "#6B7280"
  },

  expenseItem: {
    marginTop: 12
  },

  expenseTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },

  expenseLabel: {
    fontSize: 13,
    color: "#374151",
    fontFamily: "Gilroy-Medium"
  },

  expenseAmount: {
    fontSize: 13,
    color: "#374151",
    fontFamily: "Gilroy-Medium"
  },

  expenseProgressTrack: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden"
  },

  expenseProgressFill: {
    height: 6,
    borderRadius: 10
  },
  requestsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAEAEA"
  },

  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14
  },

  requestHeaderLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  requestIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  requestTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  weekDropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },

  weekText: {
    fontSize: 12,
    color: "#374151"
  },

  requestStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  requestStatBox: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4
  },

  requestStatNumber: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold"
  },

  requestStatLabel: {
    fontSize: 12,
    color: "#6B7280"
  },

  requestItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB"
  },

  requestTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  requestName: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  requestRoom: {
    fontSize: 12,
    color: "#6B7280"
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6
  },

  statusText: {
    fontSize: 11,
    fontFamily: "Gilroy-Bold"
  },

  requestIssue: {
    fontSize: 13,
    color: "#374151",
    marginTop: 4
  },

  requestBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4
  },

  requestCategory: {
    fontSize: 12,
    color: "#6B7280"
  },

  requestTime: {
    fontSize: 12,
    color: "#6B7280"
  },

  viewRequestsBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'grey'
  },

  viewRequestsText: {
    fontSize: 14,
    fontFamily: "Gilroy-Medium",
    // color: "#374151",
    color:'#fff',
    marginRight: 8
  },

  viewArrow: {
    marginLeft: 8,
    fontSize: 16,
    color: "#2563EB"
  },

  revenueTrendCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAEAEA"
  },

  revenueTrendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  revenueTrendTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B"
  },

  legendRow: {
    flexDirection: "row",
    marginTop: 10
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6
  },

  legendText: {
    fontSize: 13,
    color: "#374151"
  },

  chartDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16
  },

  revenueStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  statLabel: {
    fontSize: 13,
    color: "#6B7280"
  },

  collectedValue: {
    fontSize: 22,
    color: "#00A32E",
    fontFamily: "Gilroy-Bold"
  },

  outstandingValue: {
    fontSize: 22,
    color: "#F54900",
    fontFamily: "Gilroy-Bold"
  },

  statSub: {
    fontSize: 12,
    color: "#EF4444"
  },

  statSubGreen: {
    fontSize: 12,
    color: "#16A34A"
  },

  // bannerIconBox: {

  //   justifyContent: "center",
  //   alignItems: "center",
  // },

  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },

  // summaryCard: {
  //   width: width * 0.45,
  //   backgroundColor: "#fff",
  //   borderRadius: 16,
  //   borderWidth: 1,
  //   borderColor: "#EAEFFC",
  //   padding: 18,
  //   elevation: 2,
  //    height: heigh * 0.45,


  // },
  smallIconWrapper: {
    width: 38,
    height: 38,
    backgroundColor: "#EEF3FF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAEFFC",
    padding: 18,
    elevation: 2,
    position: "relative",
    height: 170,
  },


  bigCardIcon: {
    width: 45,
    height: 45,
    backgroundColor: "#EEF7FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  cardLabel: { color: "#42526E", marginTop: 10, fontFamily: "Gilroy-Medium" },

  cardValue: { fontSize: 28, fontWeight: "800", marginTop: 6 },

  sideColumn: { justifyContent: "space-between" },
  smallCard: {

    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAEFFC",
    padding: 14,
    elevation: 2,
  },
  smallCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },



  smallCardIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#F4F7FF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  smallLabel: { fontSize: 12, color: "#6B7280", marginTop: 6, fontFamily: "Gilroy-Medium" },

  smallValue: { fontSize: 18, fontFamily: "Gilroy-Bold", marginTop: 4 },

  sectionTitle: {
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 4,
    fontFamily: "Gilroy-Bold",
    fontSize: 17,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,

  },

  quickCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF2FF",
    marginBottom: 12,
    marginHorizontal: 6,   // ⭐ perfect spacing
    alignItems: "center",
  },


  quickIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },

  quickLabel: { fontSize: 12, marginTop: 8, textAlign: "center", fontFamily: "Gilroy-Regular" },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginTop: 16,
  },

  statBox: {
    // width: width * 0.42,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2FF",
    marginBottom: 12,
  },
  statBoxOne: {

    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2FF",
    marginBottom: 12,
  },

  statTitle: { color: "#6B7280", fontSize: 13, fontFamily: "Gilroy-Regular" },

  statValue: { fontSize: 22, fontFamily: "Gilroy-Bold", marginTop: 6 },

  // advanceCard: {
  //   margin: 16,
  //   padding: 16,
  //   backgroundColor: "#EEF7FF",
  //   borderRadius: 16,
  // },
  cardBlue: {
    backgroundColor: "#E8F0FF",
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },

  cardWhite: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#EEF2FF",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },

  cardTitle: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Gilroy-Regular",
    marginLeft: 4,
    marginBottom: 3
  },

  cardValue: {
    fontSize: 26,
    fontFamily: "Gilroy-Bold",
    marginTop: 10,
    color: "#1E293B",
  },


  // advanceTitle: { color: "#2F80ED", fontWeight: "700", fontSize: 15 },

  advanceAmount: { fontSize: 28, fontFamily: "Gilroy-Bold", marginTop: 8 },

  chartCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF2FF",
  },

  barLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 20,
  },

  barLabel: { fontSize: 12, color: "#6B7280" },

  cashbackRow: {
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  cashbackValue: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
  },


  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  chartTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#1E293B",
  },

  dropdownBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
  },

  dropdownText: {
    fontSize: 13,
    color: "#6B7280",
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
    color: "#1E293B",
    fontWeight: "500",
  },


  labelLayer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    top: 10,
    width: "100%",
  },

  labelLayerGreen: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    top: 90,
    width: "100%",
  },

  redLabel: {
    color: "#EF4444",
    fontSize: 12,
    fontFamily: "Gilroy-Regular"
  },

  greenLabel: {
    color: "#22C55E",
    fontSize: 12,
    fontFamily: "Gilroy-Regular"
  },

  xLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },


  monthArrow: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
    color: "#6B7280",
  },
  redLayer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    top: 10,
    width: "100%",
  },

  greenLayer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    top: 90,
    width: "100%",
  },


  legendRowBottom: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },

  // legendRow: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   marginTop: 14,
  // },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 8,
    width: 150,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
  },
  value: {
    marginTop: 4,
    color: "#3A7BFF",
    fontFamily: "Gilroy-Regular"
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EBEDF5",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 16, fontFamily: "Gilroy-Bold", },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dropdownText: { marginRight: 6 },
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  monthLabel: { fontSize: 11, color: "#6B7280" },


  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  tooltipBox: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 8,
    width: 160,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tooltipTitle: {
    fontSize: 13,
    fontFamily: "Gilroy-Bold",
    marginBottom: 4,
  },
  tooltipValue: {
    fontSize: 13,
    fontFamily: "Gilroy-Regular"
  },
  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 10,
    paddingHorizontal: 10,
  },

  legendItemRow: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },



  legendLabel: {
    fontSize: 13,
    color: "#1E293B",
  },


  badge: {
    position: "absolute",
    top: 2,          // 👈 IMPORTANT
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },


  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Gilroy-Bold",
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 120,
  },

  image: {
    width: 250,
    height: 180,
    resizeMode: "contain",
    opacity: 0.9,
  },

  nodataText: {
    fontSize: 16,
    color: "#777",
    marginTop: 10,
  },

  noDataContainer: {
  height: 260,
  justifyContent: "center",
  alignItems: "center",
},

noDataText: {
  color: "#999",
  fontSize: 14,
  fontFamily: "Gilroy-Medium",
},


});
