import React, { useState,useCallback } from "react";
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
  BackHandler
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; 
import PgImg from '../../Assets/Images/PgImg.png'
import Bell from '../../Assets/Images/bell.png'
import Profile from '../../Assets/Images/profile.png'
import Announcement from '../../Assets/Images/announcement.png';
import UpdateImg from '../../Assets/Images/updateImg.png'
import InProfile from '../../Assets/Images/inActiveuser.png'
import Activeannouncement from '../../Assets/Images/Activeannouncement.png';
import ActiveUpdate from '../../Assets/Images/ActiveUpdate.png'
import SmartPlur from '../../Assets/Images/smartPlurImg.png';
import RoomImg from '../../Assets/Images/room.png';
import BedImg from '../../Assets/Images/bed.png';
import FreeBedImg from '../../Assets/Images/freeBed.png';
import Usercircle from '../../Assets/Images/user-circle-add.png';
import ExpenseImg from '../../Assets/Images/money-minus.png';
import CrateBill from '../../Assets/Images/create_bill.png';
import WalkinImg from '../../Assets/Images/walkin_user.png';
import AgreementImg from '../../Assets/Images/paperclip.png';

import AdvanceHand from '../../Assets/Images/AdvanceHand.png';
import ActiveCompliance from '../../Assets/Images/Active_Compliance.png';
import MonthProfit from '../../Assets/Images/Month_Profit.png';
import AnnouncementScreen from '../Dashboard/Announcement';
import UpdatesScreen from '../Dashboard/Update';


import {
  BarChart,
  LineChart,
  PieChart,
  Grid,
  YAxis,
  XAxis
} from "react-native-svg-charts";
import * as shape from "d3-shape";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState("Dashboard");
   const navigation = useNavigation();

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


  const tabs = [
    { key: "Dashboard", active: Profile, inactive: InProfile },
    { key: "Announcement", active: Activeannouncement, inactive: Announcement },
    { key: "Updates", active: ActiveUpdate, inactive: UpdateImg },
  ];


const revenue = [300, 250, 400, 100, 450];   
const product = [400, 200, 350, 250, 300]; 
const months = ["Jan", "Feb", "Mar", "Apr", "May"];

  const barData = [30000, 18000, 25000, 42000, 38000];
  const barLabels = ["Jan", "Feb", "Mar", "Apr", "May"];

  const lineData1 = [10000, 15000, 20000, 28000, 24000];
  const lineData2 = [12000, 18000, 22000, 26000, 21000];

  const cashbackData = [
    { key: 1, value: 65, svg: { fill: "#10B981" } },
    { key: 2, value: 35, svg: { fill: "#E5E7EB" } },
  ];

  const expenseCategory = [
    { key: 1, value: 45, svg: { fill: "#FBBF24" } },
    { key: 2, value: 30, svg: { fill: "#3B82F6" } },
    { key: 3, value: 15, svg: { fill: "#EF4444" } },
    { key: 4, value: 10, svg: { fill: "#A78BFA" } },
  ];


  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#E9F2FF" barStyle="dark-content" />



      <LinearGradient
        colors={["#E9F2FF", "#F6FBFF"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.hostelRow}>
            <Image source={PgImg} style={{ width: 38, height: 38 }} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.hostelTitle}>Royal Grand Hostel</Text>
              <Text style={styles.changeText}>Change Hostel →</Text>
            </View>
          </View>

          <View style={styles.rightIcons}>
            <View style={styles.iconCircle}>
              <Image source={Bell} style={{ width: 22, height: 22 }} />
            </View>
            <View style={[styles.iconCircle, { marginLeft: 10 }]}>
              <Image source={Profile} style={{ width: 22, height: 22 }} />
            </View>
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
              {/* Icon + Text row */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={activeTab === item.key ? item.active : item.inactive}
                  style={{
                    width: 22,
                    height: 22,
                  }}
                />

                <Text
                  style={[
                    styles.tabText,
                    activeTab === item.key && {
                      color: "#1E45E1",
                      fontWeight: "700",
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
      <ScrollView showsVerticalScrollIndicator={false}>

       
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>SmartStay –</Text>
            <Text style={styles.bannerSub}>
              The smartest way to manage your PG, all in one place!
            </Text>
          </View>

          <Image
            source={SmartPlur}
            style={styles.bannerIcon}
          />
        </View>



        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View >

              <Image
                source={RoomImg}
                style={{ width: 35, height: 35 }}
              />
            </View>
            <Text style={styles.cardLabel}>Total Rooms</Text>
            <Text style={styles.cardValue}>20</Text>
          </View>

          <View style={styles.sideColumn}>

            <View style={styles.smallCard}>
              <View style={styles.smallCardContent}>
                <View>
                  <Text style={styles.smallLabel}>Total Beds</Text>
                  <Text style={styles.smallValue}>74</Text>
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
                  <Text style={styles.smallValue}>21</Text>
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
        </View>


        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {/* <View style={styles.quickGrid}>
          {[
            { label: "Add Customers", icon: Usercircle, color: "#7C3AED" },
            { label: "Add Expense", icon: ExpenseImg, color: "#EF4444" },
            { label: "Create Bills", icon: CrateBill, color: "#F59E0B" },
            { label: "Add Walkin", icon: WalkinImg, color: "#A78BFA" },
            { label: "Make agreement", icon: AgreementImg, color: "#10B981" },
          ].map((x, i) => (
            <View key={i} style={styles.quickCard}>
              <View style={[styles.quickIconBox, { borderColor: x.color }]}>

              </View>
              <Text style={styles.quickLabel}>{x.label}</Text>
            </View>
          ))}
        </View> */}
        <View style={styles.quickGrid}>
  {[
    { label: "Add Customers", icon: Usercircle, color: "#7C3AED" },
    { label: "Add Expense", icon: ExpenseImg, color: "#EF4444" },
    { label: "Create Bills", icon: CrateBill, color: "#F59E0B" },
    { label: "Add Walkin", icon: WalkinImg, color: "#A78BFA" },
    { label: "Make agreement", icon: AgreementImg, color: "#10B981" },
  ].map((x, i) => (
    <View key={i} style={styles.quickCard}>
      
      <View style={[ { borderColor: x.color }]}>
        <Image
          source={x.icon}
          style={{ width: 30, height: 30, resizeMode: "contain" }}
        />
      </View>

      <Text style={styles.quickLabel}>{x.label}</Text>
    </View>
  ))}
</View>


<View style={{backgroundColor:"#F3F5FF"}}>
   <View style={styles.statsGrid}>
          {[
            { title: "Occupied Bed", value: "53" },
            { title: "Next Month Projection", value: "16" },
            { title: "Total Customer", value: "378" },
            { title: "EB Amount", value: "₹ 24,000" },
          ].map((item, i) => (
            <View key={i} style={styles.statBox}>
              <Text style={styles.statTitle}>{item.title}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
          ))}
        </View>
    


      
        <View style={[styles.statBoxOne, { marginHorizontal: 16 }]}>
          <Text style={styles.statTitle}>Total Asset Value</Text>
          <Text style={[styles.statValue, { fontSize: 22 }]}>₹ 14,550</Text>
        </View>

</View>
       
        {/* ---------------- ADVANCE IN HAND ---------------- */}

       
        
        {/* <View style={styles.advanceCard}>
          <Text style={styles.advanceTitle}>Advance in Hand</Text>
          <Text style={styles.advanceAmount}>₹ 32,500</Text>
        </View> */}
        {/* 1. Advance in Hand */}
<View style={styles.cardBlue}>
  <View style={styles.row}>
   
     <Image source={AdvanceHand} style={{ width: 25, height: 25 }} />
    <Text style={styles.cardTitle}>Advance in Hand</Text>
  </View>
  <Text style={styles.cardValue}>₹ 32,500</Text>
</View>


<View style={styles.cardWhite}>
  <View style={styles.row}>
 
     <Image source={ActiveCompliance} style={{ width: 25, height: 25 }} />
    <Text style={styles.cardTitle}>Active Complaint</Text>
  </View>
  <Text style={styles.cardValue}>153</Text>
</View>

{/* 3. Current Month Profit */}
<View style={styles.cardWhite}>
  <View style={styles.row}>
   <Image source={MonthProfit} style={{ width: 25, height: 25 }} />
    <Text style={styles.cardTitle}>Current Month Profit</Text>
  </View>
  <Text style={styles.cardValue}>₹ 84,550</Text>
</View>

        

     
<View style={styles.chartCard}>

  
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
      min={0}
      max={500}
      numberOfTicks={6}
      contentInset={{ top: 25, bottom: 25 }}
      svg={{ fill: "#6B7280", fontSize: 10 }}
      style={{ marginBottom: 22 }}
    />

 
    <View style={{ flex: 1, marginLeft: 10 }}>
      <BarChart
        style={{ flex: 1 }}
        yMin={0}
        yMax={500}
        spacingInner={0.2}   
        spacingOuter={0.05} 
        contentInset={{ top: 25, bottom: 25 }}
        data={[
          {
            data: [300, 250, 400, 100, 450],
            svg: { fill: "#EF4444", rx: 6, ry: 6 }
          },
          {
            data: [400, 200, 350, 250, 300],
            svg: { fill: "#22C55E", rx: 6, ry: 6 }
          }
        ]}
      >

      
    <Grid
  direction="HORIZONTAL"
  ticks={[100, 200, 300, 400]}  
  svg={{
    stroke: "#E5E7EB",
    strokeWidth: 0.5,
    opacity: 0.35,  
  }}
  contentInset={{ top: 40, bottom: 40 }}  
/>



      </BarChart>
      <View style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "100%"
      }}>
        {["₹1000","₹1000","₹1000","₹100","₹1000"].map((v,i) => (
          <Text
            key={"r"+i}
            style={{
              position: "absolute",
              left: 48 * i + 65,
              top: 180 - [300,250,400,100,450][i] * 0.36,
              color: "#EF4444",
              fontSize: 10,
              fontWeight: "bold"
            }}
          >
            {v}
          </Text>
        ))}

        {["₹25000","₹25000","₹25000","₹25000","₹25000"].map((v,i) => (
          <Text
            key={"g"+i}
            style={{
              position: "absolute",
              left: 48 * i + 95,
              top: 180 - [400,200,350,250,300][i] * 0.36,
              color: "#22C55E",
              fontSize: 10,
              fontWeight: "bold"
            }}
          >
            {v}
          </Text>
        ))}
      </View>

     
      <XAxis
        style={{ marginTop: 8 }}
        data={[0,1,2,3,4]}
        formatLabel={(v) =>
          ["Jan 2024","Feb 2024","Mar 2024","Apr 2024","May 2024"][v]
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

</View>




        {/* ============= LINE CHART ============= */}
        <Text style={styles.sectionTitle}>Advance VS Advance Return</Text>
        <View style={styles.chartCard}>
          <LineChart
            style={{ height: 200 }}
            data={lineData1}
            svg={{ stroke: "#2F80ED", strokeWidth: 3 }}
            curve={shape.curveMonotoneX}
            contentInset={{ top: 20, bottom: 20 }}
          >
            <Grid />
          </LineChart>

          <LineChart
            style={{ height: 200, position: "absolute" }}
            data={lineData2}
            svg={{ stroke: "#FF5A5F", strokeWidth: 3 }}
            curve={shape.curveMonotoneX}
            contentInset={{ top: 20, bottom: 20 }}
          />
        </View>

        {/* ============= CASHBACK DONUT ============= */}
        <Text style={styles.sectionTitle}>Total Cashback</Text>
        <View style={styles.cashbackRow}>
          <PieChart
            style={{ height: 180, width: 180 }}
            data={cashbackData}
            innerRadius={65}
            outerRadius={"95%"}
          />

          <View style={{ marginLeft: 16 }}>
            <Text style={styles.cashbackValue}>₹19,500</Text>

            <View style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: "#10B981" }]} />
              <Text>Received ₹19,500</Text>
            </View>

            <View style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: "#E5E7EB" }]} />
              <Text>Pending ₹30,000</Text>
            </View>
          </View>
        </View>

        {/* ============= CATEGORY DONUT ============= */}
        <Text style={styles.sectionTitle}>Expenses</Text>
        <View style={styles.chartCard}>
          <PieChart
            style={{ height: 200 }}
            data={expenseCategory}
            innerRadius={40}
            outerRadius={"90%"}
          />

          <View style={{ marginTop: 16 }}>
            {[
              { text: "Category 1 – 45%", color: "#FBBF24" },
              { text: "Category 2 – 30%", color: "#3B82F6" },
              { text: "Category 3 – 15%", color: "#EF4444" },
              { text: "Category 4 – 10%", color: "#A78BFA" },
            ].map((item, i) => (
              <View key={i} style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={{ marginLeft: 8 }}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
        )}
        {activeTab === "Announcement" && <AnnouncementScreen />}
        {activeTab === "Updates" && <UpdatesScreen />}
    </SafeAreaView>
  );
}

/* ------------------- STYLES ------------------- */

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
  },


  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40
  },

  hostelRow: { flexDirection: "row", alignItems: "center" },

  hostelTitle: { fontSize: 16, fontWeight: "700", color: "#1E293B" },

  changeText: { fontSize: 12, color: "#2F80ED", marginTop: 3 },

  //   iconCircle: {
  //     width: 42,
  //     height: 42,
  //     borderRadius: 22,
  //     backgroundColor: "#fff",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     elevation: 3,
  //   },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  tabsRow: { flexDirection: "row", marginTop: 18 },

  tabBtn: { marginRight: 20 },

  tabText: { fontSize: 17, color: "#6B7280" },

  underline: {
    height: 3,
    backgroundColor: "#1E45E1",
    borderRadius: 6,
    marginTop: 6,
  },

  banner: {
    backgroundColor: "#2F80ED",
    margin: 16,
    padding: 20,
    borderRadius: 14,
    overflow: "hidden",       // 🔥 important for clean edges
    flexDirection: "row",
  },

  bannerIcon: {
    width: 130,
    height: 130,
    position: "absolute",
    right: 20,
    top: -5,

  },

  bannerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  bannerSub: {
    color: "white",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",        // <== ITALIC
    width: 190,                 // <== FORCE 2 LINES LIKE FIGMA
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
    width: width * 0.45,
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

  cardLabel: { color: "#42526E", marginTop: 10 },

  cardValue: { fontSize: 28, fontWeight: "800", marginTop: 6 },

  sideColumn: { justifyContent: "space-between" },
  smallCard: {
    width: width * 0.4,
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

  // smallCard: {
  //   width: width * 0.4,
  //   padding: 14,
  //   backgroundColor: "#fff",
  //   borderRadius: 16,
  //   borderWidth: 1,
  //   borderColor: "#EAEFFC",
  //   elevation: 2,
  // },

  smallCardIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#F4F7FF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  smallLabel: { fontSize: 12, color: "#6B7280", marginTop: 6 },

  smallValue: { fontSize: 18, fontWeight: "700", marginTop: 4 },

  sectionTitle: {
    marginLeft: 16,
    marginTop: 20,
    fontWeight: "700",
    fontSize: 17,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    // justifyContent: "space-between",
  },

  quickCard: {
    width: width * 0.28,
  backgroundColor: "#fff",
  padding: 14,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#EEF2FF",
  marginBottom: 12,
  marginHorizontal: 6,   // ⭐ perfect spacing
  alignItems: "center",
  },

  // quickIconBox: {
  //   width: 46,
  //   height: 46,
  //   borderRadius: 12,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderWidth: 1,
  // },
  quickIconBox: {
  width: 46,
  height: 46,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  backgroundColor: "#FFFFFF",
},

  quickLabel: { fontSize: 12, marginTop: 8, textAlign: "center" },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginTop: 16,
  },

  statBox: {
    width: width * 0.42,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2FF",
    marginBottom: 12,
  },
  statBoxOne:{

    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2FF",
    marginBottom: 12,
  },

  statTitle: { color: "#6B7280", fontSize: 13 },

  statValue: { fontSize: 22, fontWeight: "700", marginTop: 6 },

  advanceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#EEF7FF",
    borderRadius: 16,
  },
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
  fontWeight: "500",
},

cardValue: {
  fontSize: 26,
  fontWeight: "700",
  marginTop: 10,
  color: "#1E293B",
},


  advanceTitle: { color: "#2F80ED", fontWeight: "700", fontSize: 15 },

  advanceAmount: { fontSize: 28, fontWeight: "800", marginTop: 8 },

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
  fontSize: 18,
  fontWeight: "700",
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
  fontWeight: "600",
},

greenLabel: {
  color: "#22C55E",
  fontSize: 12,
  fontWeight: "600",
},

xLabels: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 10,
},

monthLabel: {
  fontSize: 12,
  color: "#6B7280",
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

legendRow: {
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 18,
},

legendItem: {
  flexDirection: "row",
  alignItems: "center",
  marginHorizontal: 15,
},

});
