import React, { useState, useEffect, useRef , useContext} from "react";
import {
   View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView,Platform
} from "react-native";

import CategoryIcon from "../../../Assets/Images/Category.png";
import CallIcon from "../../../Assets/Images/call.png";
import LocationIcon from "../../../Assets/Images/LocationIcon.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import MobileIcon from "../../../Assets/Images/mobile.png";

import { Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import Loader from "../../../Component/Loader/Loader"
import { useHasPermission } from "../../../Utils/useHasPermission";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import RevenueIcon from "../../../Assets/Images/MoneyRecive.png";
import PeopleIcon from "../../../Assets/Images/People.png";
import RupeeIcon from "../../../Assets/Images/Rupees.png";
// import CategoryIcon from "../../../Assets/Images/Card_Icon.png";
import TenantsIcon from "../../../Assets/Images/Tenants.png";
import InvoiceIcon from "../../../Assets/Images/Receipts.png";
import ReceiptIcon from "../../../Assets/Images/ReceiptItem.png";
import ExpensesIcon from "../../../Assets/Images/Expenses_Register.png";
import ElectricityIcon from "../../../Assets/Images/Electricity_Bills.png";
import FinalSettlementIcon from "../../../Assets/Images/Rupees.png";
import BankIcon from "../../../Assets/Images/Bank_Transaction.png";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import DirectionImage from "../../../Assets/Images/direction-down.png"
import AccountIcon from "../../../Assets/Images/AccountIcon.png"
import InfoIcon from "../../../Assets/Images/InfoIcon.png"



const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.42;
// const HEADER_HEIGHT = 120;
const HEADER_HEIGHT = Platform.OS === "ios" ? 90 : 120;


export default function BankOverview({ expense }) {

    const TOTAL_CARDS = 4;
    const CARDS_PER_PAGE = 2;

    const PAGE_WIDTH = (CARD_WIDTH + 12) * CARDS_PER_PAGE;
    const [currentPage, setCurrentPage] = useState(0);

    const horizontalRef = useRef(null);


    const handleSwipe = () => {
        const nextPage = currentPage === 0 ? 1 : 0;

        horizontalRef.current?.scrollTo({
            x: nextPage * PAGE_WIDTH,
            animated: true,
        });

        setCurrentPage(nextPage);
    };


    return (

<>


   <ScrollView
          horizontal
          ref={horizontalRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardRow}
        >
<SummaryCard
  icon={RevenueIcon}
  title="Current Balance"
  value={"10000"}
  prefix="₹ "
/>

<SummaryCard
  icon={RupeeIcon}
  title="Opening Balance"
  value={"1000"}
  prefix="₹ "
/>

<SummaryCard
  icon={PeopleIcon}
  title="inflow (Income)"
  value={"35"}
/>

<SummaryCard
  icon={CategoryIcon}
  title="Outflow (Expenses)"
  value={"1.24"}
  suffix=" %"
/>
<SummaryCard
  icon={CategoryIcon}
  title="Transfers"
  value={"1.24"}
  suffix=" %"
/>

        </ScrollView>
    
 
 
        <TouchableOpacity style={styles.swipeBtn} onPress={handleSwipe}>
          <Text style={styles.swipeText}>‹‹ Swipe</Text>
        </TouchableOpacity>


    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <InfoItem
        label="Bank Name"
        value={"Canara Bank"} 
      />

      <InfoItem
        label="Account Holder Name"
        value={"Immanuvel"}
        icon={CategoryIcon}
      />


      <InfoItem
        label="Account No"
        value={"65784195214"}
        icon={AccountIcon}
      />

       <InfoItem
        label="IFSC Code"
        value={"CAN45789"}
       icon={InfoIcon}
      />

      <InfoItem
        label="Branch"
        value={"Navalur Canara"}
        icon={LocationIcon}
      />

      <InfoItem
        label="Credit Limit"
        value={"₹ 15,000.00"}
        icon={CalendarIcon}
      />
    </ScrollView>
    </>
    );
}

const InfoItem = ({ label, value, icon }) => (
    <View style={styles.item}>
        <Text style={styles.label}>{label}</Text>

        {icon ? (
            <View style={styles.valueRow}>
                <Image source={icon} style={styles.icon} />

                <Text
                    style={styles.value}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {value}
                </Text>
            </View>
        ) : (
            <Text style={styles.value}>{value}</Text>
        )}
    </View>
);


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

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 80,
    },

    item: {
        marginBottom: 24,
    },

    label: {
        fontSize: 13,
        color: "#6B7280",
        fontFamily: "Gilroy-Medium",
        marginBottom: 8,
    },

    valueRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    icon: {
        width: 18,
        height: 18,
        marginRight: 10,
        tintColor: "#64748B",
        marginTop: 2,
        flexShrink: 0,
    },

    value: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
        fontFamily: "Gilroy-Medium",
        flexWrap: "wrap",
    },
     cardRow: { paddingLeft: 16, paddingTop: 4},

  // summaryCard: {
  //   width: CARD_WIDTH,
  //   backgroundColor: "#fff",
  //   borderRadius: 10,
  //   padding: 14,
  //   marginRight: 12,
  //   marginBottom:5,
  //   elevation: 2,
  // },
  summaryCard: {
  width: CARD_WIDTH,
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 14,
  marginRight: 12,
  marginBottom: 5,
  paddingBottom:28,
marginTop:10,
  elevation: 3,

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,

  // borderWidth: 1,
  // borderColor: "#E5E7EB",
},

  // iconBox: {
  //   width: 36,
  //   height: 36,
  //   borderRadius: 10,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginBottom: 8,
  //   elevation: 3,
  //   backgroundColor: "#fff",
  // },
iconBox: {
  width: 36,
  height: 36,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,


  // ✅ Add this
  backgroundColor: "#FFFFFF",

  // ✅ Border (IMPORTANT)
  borderWidth: 1,
  borderColor: "#E5E7EB",

  // ✅ iOS shadow
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,

  // ✅ Android shadow
  elevation: 3,
},
  cardIcon: { width: 20, height: 20 },

  cardTitle: { fontSize: 12, color: "#6B7280" },

  cardValue: { fontSize: 18, fontWeight: "700" , marginBottom:10},

  swipeBtn: { alignSelf: "flex-end", paddingRight: 16, paddingTop:10 },

  swipeText: { color: "#2563EB", fontWeight: "600" },

  registerScroll: { paddingHorizontal: 16, marginTop: 20 },

  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },

  // registerCard: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: "#fff",
  //   borderRadius: 14,
  //   padding: 14,
  //   marginBottom: 12,
  //   elevation: 1,
  // },
registerCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 14,
  marginBottom: 12,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 3,
  borderWidth: 1,
  borderColor: "#E5E7EB",
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
  justifyContent: "space-between", 
},

title: {
  flex: 1,                        
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