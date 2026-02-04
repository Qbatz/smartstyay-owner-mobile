import React, { useState ,useRef , useContext , useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import Loader from "../../../Component/Loader/Loader"

import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import RevenueIcon from "../../../Assets/Images/MoneyRecive.png";
import PeopleIcon from "../../../Assets/Images/People.png";
import RupeeIcon from "../../../Assets/Images/Rupees.png";
import CategoryIcon from "../../../Assets/Images/Category.png";

import TenantsIcon from "../../../Assets/Images/Tenants.png";
import InvoiceIcon from "../../../Assets/Images/Receipts.png";
import ReceiptIcon from "../../../Assets/Images/ReceiptItem.png";
import ExpensesIcon from "../../../Assets/Images/Expenses_Register.png";
import ElectricityIcon from "../../../Assets/Images/Electricity_Bills.png";
import FinalSettlementIcon from "../../../Assets/Images/Rupees.png";
import BankIcon from "../../../Assets/Images/Bank_Transaction.png";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import DirectionImage from "../../../Assets/Images/direction-down.png"

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.42;
const HEADER_HEIGHT = 120;

const Reports = () => {

  const { getReportsByHostel , loading  , Reportsdetails} = UseSetting();
    const { activeHostelId } = useContext(CommonContexts);






  const navigation = useNavigation();
  const horizontalRef = useRef(null);



  const [currentIndex, setCurrentIndex] = useState(0);
const [isForward, setIsForward] = useState(true);

const [reportFilterOpen, setReportFilterOpen] = useState(false);
const [selectedFilter, setSelectedFilter] = useState("This Month");

const FILTER_OPTIONS = [
  "Today",
  "This Week",
  "This Month",
  "Last Month",
  "Last 3 Months",
];


const TOTAL_CARDS = 4;
const CARDS_PER_PAGE = 2;

const PAGE_WIDTH = (CARD_WIDTH + 12) * CARDS_PER_PAGE;
const [currentPage, setCurrentPage] = useState(0);
// 0 = cards 1&2
// 1 = cards 3&4



useEffect(() => {
  const fetchReports = async () => {
    const res = await getReportsByHostel(activeHostelId);
    if (res.success) {
      console.log("Reports:", res.data);
    }
  };
  fetchReports();
}, [])


if (!activeHostelId && !loading) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Operational Reports</Text>
        </View>
      </View>

      <View style={styles.emptyContainer}>
        <Image source={EmptyState} style={styles.emptyImage} />
        <Text style={styles.emptyText}>No Reports are there!</Text>
      </View>
    </SafeAreaView>
  );
}


const handleSwipe = () => {
  const nextPage = currentPage === 0 ? 1 : 0;

  horizontalRef.current?.scrollTo({
    x: nextPage * PAGE_WIDTH,
    animated: true,
  });

  setCurrentPage(nextPage);
};


// auto swipe 
// useEffect(() => {
//   const interval = setInterval(handleSwipe, 3000);
//   return () => clearInterval(interval);
// }, [currentIndex, isForward]);


  return (
    <>
       {loading && <Loader />}
    <SafeAreaView style={styles.container}>
      {/* 🔒 FIXED HEADER (NO ANIMATION) */}

    
     


      <View style={styles.header}>
<View style={styles.headerRow}>
  {/* LEFT */}
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Image source={ArrowLeft} style={styles.backIcon} />
  </TouchableOpacity>

  {/* CENTER TITLE */}
  <Text style={styles.title} numberOfLines={1}>
    Operational Reports
  </Text>

  {/* RIGHT FILTER */}
  <TouchableOpacity
    style={styles.filterBtn}
    onPress={() => setReportFilterOpen(!reportFilterOpen)}
    activeOpacity={0.7}
  >
    <Text style={styles.filterText}>{selectedFilter}</Text>
    {/* <Text style={styles.filterArrow}>⌄</Text> */}
    <Image source={DirectionImage} style={{   marginLeft: 6,
  height:15, width:15 , transform: reportFilterOpen ? "rotate(180deg)": "rotate(0deg)"}}/>
  </TouchableOpacity>
</View>

{reportFilterOpen && (
  <TouchableOpacity
    activeOpacity={1}
    style={styles.overlay}
    onPress={() => setReportFilterOpen(false)}
  />
)}

{reportFilterOpen && (
  <View style={styles.dropdown}>
    {FILTER_OPTIONS.map((item) => {
      const active = selectedFilter === item;

      return (
        <TouchableOpacity
          key={item}
          style={[
            styles.dropdownItem,
            active && styles.dropdownItemActive,
          ]}
          onPress={() => {
            setSelectedFilter(item);
            setReportFilterOpen(false);
            // 🔥 here you can call API based on filter
          }}
        >
          <Text
            style={[
              styles.dropdownText,
              active && styles.dropdownTextActive,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
)}


        <View style={styles.searchBox}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/622/622669.png",
            }}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search Reports"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>


      </View>
  
      {/* 📜 SCROLLABLE CONTENT ONLY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + 10,
          paddingBottom: 40,
        }}
      >
        {/* SUMMARY CARDS */}

     
        <ScrollView
          horizontal
          ref={horizontalRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardRow}
        >
<SummaryCard
  icon={RevenueIcon}
  title="Total Revenue (MTD)"
  value={Reportsdetails?.totalRevenue}
  prefix="₹ "
/>

<SummaryCard
  icon={RupeeIcon}
  title="Outstanding Amount"
  value={Reportsdetails?.outStandingAmount}
  prefix="₹ "
/>

<SummaryCard
  icon={PeopleIcon}
  title="Active Tenants"
  value={Reportsdetails?.tenantInfo?.totalTenants}
/>

<SummaryCard
  icon={CategoryIcon}
  title="Occupancy Rate"
  value={Reportsdetails?.tenantInfo?.occupancyRate}
  suffix=" %"
/>

        </ScrollView>
    
 
 
        <TouchableOpacity style={styles.swipeBtn} onPress={handleSwipe}>
          <Text style={styles.swipeText}>‹‹ Swipe</Text>
        </TouchableOpacity>


        {/* REGISTERS */}
       
        <View style={styles.registerScroll}>
          <Text style={styles.sectionTitle}>Registers</Text>
          <RegisterCard icon={InvoiceIcon}  onPress={() => navigation.navigate("InvoiceRegister")} 
           title="Invoices" desc="Track all invoices and payments" bgColor="#E8F0FF"  />
          <RegisterCard icon={ReceiptIcon} title="Receipt Register" desc="Monitor all collections" bgColor="#E6F9F1" />
          {/* <RegisterCard icon={BankIcon} title="Bank Transactions" desc="View all banking transactions" bgColor="#F1EBFF" /> */}
          <RegisterCard icon={TenantsIcon} onPress={() => navigation.navigate("TenantRegister")}
           title="Tenants" desc="Tenant directory & status" bgColor="#FFF3DB" />
          <RegisterCard icon={ExpensesIcon} onPress={() => navigation.navigate("ExpenseRegister")}
           title="Expense Register" desc="Expenses & approvals" bgColor="#FFECEC"   />
          <RegisterCard icon={ElectricityIcon} title="Electricity Bills" desc="Meter readings & billing" bgColor="#EEF2FF" />
          <RegisterCard icon={FinalSettlementIcon} title="Final Settlement" desc="Security deposit refunds" bgColor="#E6F9F1" />
        </View>
      
      </ScrollView>
          
    </SafeAreaView>

</>
  );
};

export default Reports;

/* ---------------- COMPONENTS ---------------- */

const AnimatedNumber = ({ value, duration = 800 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    animatedValue.setValue(0);

    Animated.timing(animatedValue, {
      toValue: Number(value) || 0,
      duration,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.floor(value));
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value]);

  return <Text>{displayValue}</Text>;
};

const SummaryCard = ({ icon, title, value, prefix, suffix }) => (
  <View style={styles.summaryCard}>
    <View style={styles.iconBox}>
      <Image source={icon} style={styles.cardIcon} />
    </View>

    <Text style={styles.cardTitle}>{title}</Text>

    <Text style={styles.cardValue}>
      {prefix && <Text style={styles.symbol}>{prefix}</Text>}

      <AnimatedNumber value={value} />

      {suffix && <Text style={styles.symbol}>{suffix}</Text>}
    </Text>
  </View>
);



const RegisterCard = ({ icon, title, desc, bgColor, onPress }) => (
  <TouchableOpacity style={styles.registerCard} onPress={onPress}>
    <View style={[styles.registerIconBox, { backgroundColor: bgColor }]}>
      <Image source={icon} style={styles.registerIcon} />
    </View>
    <View style={styles.registerTextBox}>
      <Text style={styles.registerTitle}>{title}</Text>
      <Text style={styles.registerDesc}>{desc}</Text>
    </View>
  </TouchableOpacity>
);


/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" , paddingTop:30 },

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

  // headerRow: {
  //   height: 50,
  //   flexDirection: "row",
  //   alignItems: "center",
  // },

  backIcon: { width: 22, height: 22, marginRight: 10 },

  // title: { fontSize: 18, fontWeight: "700" },

  searchBox: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 25,
    paddingHorizontal: 14,
    marginBottom: 8,
  },

  searchIcon: { width: 18, height: 18, tintColor: "#9B9B9B", marginRight: 8 },

  searchInput: { flex: 1, height: 40 },

  cardRow: { paddingLeft: 16, paddingTop: 4},

  summaryCard: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginRight: 12,
    marginBottom:5,
    elevation: 2,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    elevation: 3,
    backgroundColor: "#fff",
  },

  cardIcon: { width: 20, height: 20 },

  cardTitle: { fontSize: 12, color: "#6B7280" },

  cardValue: { fontSize: 18, fontWeight: "700" },

  swipeBtn: { alignSelf: "flex-end", paddingRight: 16, paddingTop:10 },

  swipeText: { color: "#2563EB", fontWeight: "600" },

  registerScroll: { paddingHorizontal: 16, marginTop: 20 },

  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },

  registerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },

  registerIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  registerIcon: { width: 22, height: 22 },

  registerTextBox: { flex: 1 },

  registerTitle: { fontSize: 15, fontWeight: "600" },

  registerDesc: { fontSize: 13, color: "#6B7280" },
  symbol: {
  fontSize: 14,
  fontWeight: "500",
  color: "#374151",
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
    fontWeight: "500",
  },
headerRow: {
  height: 50,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between", // ✅ key line
},

title: {
  flex: 1,                         // ✅ center control
  fontSize: 18,
  fontWeight: "700",
  // textAlign: "center",
  marginHorizontal: 5,
},

filterBtn: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  backgroundColor: "#fff",
},

filterText: {
  fontSize: 13,
  fontWeight: "600",
  color: "#111827",
},

filterArrow: {
  marginLeft: 6,
  height:15, width:15
},

overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 99,
},

dropdown: {
  position: "absolute",
  top: 90,              // adjust based on header
  right: 16,
  width: 160,
  backgroundColor: "#fff",
  borderRadius: 10,
  elevation: 6,
  zIndex: 100,
  borderWidth: 1,
  borderColor: "#E5E7EB",
},

dropdownItem: {
  paddingVertical: 12,
  paddingHorizontal: 14,
},

dropdownItemActive: {
  backgroundColor: "#F3F4F6",
},

dropdownText: {
  fontSize: 13,
  color: "#374151",
},

dropdownTextActive: {
  fontWeight: "700",
  color: "#111827",
},


});
