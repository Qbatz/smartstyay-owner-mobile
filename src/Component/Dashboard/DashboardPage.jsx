import React, { useState } from "react";
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
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

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

import {
  BarChart,
  LineChart,
  PieChart,
  Grid,
} from "react-native-svg-charts";
import * as shape from "d3-shape";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState("Dashboard");


  const tabs = [
  { key: "Dashboard", active: Profile, inactive: InProfile },
  { key: "Announcement", active: Activeannouncement, inactive: Announcement },
  { key: "Updates", active: ActiveUpdate, inactive: UpdateImg },
];



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

    {/* Tabs */}
    {/* <View style={styles.tabsRow}>
      {["Dashboard", "Announcement", "Updates"].map((t) => (
        <TouchableOpacity
          key={t}
          onPress={() => setActiveTab(t)}
          style={styles.tabBtn}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === t && { color: "#2F80ED", fontWeight: "700" },
            ]}
          >
            {t}
          </Text>
          {activeTab === t && <View style={styles.underline} />}
        </TouchableOpacity>
      ))}
    </View> */}
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
  <ScrollView showsVerticalScrollIndicator={false}>
       
        {/* <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>SmartStay –</Text>
            <Text style={styles.bannerSub}>
              The smartest way to manage your PG, al in one place!
            </Text>
          </View>

          <View style={styles.bannerIconBox}>
            <Image source={SmartPlur} style={{width:80,height:80}}/>
          </View>
        </View> */}
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
            <View style={styles.bigCardIcon}>
              {/* <AntDesign name="home" size={22} color="#2F80ED" /> */}
               <Image
    source={RoomImg}
   style={{width:22,height:22}}
  />
            </View>
            <Text style={styles.cardLabel}>Total Rooms</Text>
            <Text style={styles.cardValue}>20</Text>
          </View>

          <View style={styles.sideColumn}>
            <View style={styles.smallCard}>
              <View style={styles.smallCardIcon}>
                         <Image
    source={BedImg}
   style={{width:22,height:22}}
  />
              </View>
              <Text style={styles.smallLabel}>Total Beds</Text>
              <Text style={styles.smallValue}>74</Text>
            </View>

            <View style={styles.smallCard}>
              <View style={styles.smallCardIcon}>
                         <Image
    source={FreeBedImg}
   style={{width:22,height:22}}
  />
              </View>
              <Text style={styles.smallLabel}>Free Bed</Text>
              <Text style={styles.smallValue}>21</Text>
            </View>
          </View>
        </View>

      
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickGrid}>
          {[
            { label: "Add Customers", icon: "adduser", color: "#7C3AED" },
            { label: "Add Expense", icon: "wallet", color: "#EF4444" },
            { label: "Create Bills", icon: "filetext1", color: "#F59E0B" },
            { label: "Add Walkin", icon: "user", color: "#A78BFA" },
            { label: "Make agreement", icon: "profile", color: "#10B981" },
          ].map((x, i) => (
            <View key={i} style={styles.quickCard}>
              <View style={[styles.quickIconBox, { borderColor: x.color }]}>
             
              </View>
              <Text style={styles.quickLabel}>{x.label}</Text>
            </View>
          ))}
        </View>

      
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

        {/* ---------------- ASSET VALUE ---------------- */}
        <View style={[styles.statBox, { marginHorizontal: 16 }]}>
          <Text style={styles.statTitle}>Total Asset Value</Text>
          <Text style={[styles.statValue, { fontSize: 22 }]}>₹ 14,550</Text>
        </View>

        {/* ---------------- ADVANCE IN HAND ---------------- */}
        <View style={styles.advanceCard}>
          <Text style={styles.advanceTitle}>Advance in Hand</Text>
          <Text style={styles.advanceAmount}>₹ 32,500</Text>
        </View>

        {/* ============= BAR CHART ============= */}
        <Text style={styles.sectionTitle}>Expenses Vs Revenue</Text>
        <View style={styles.chartCard}>
          <BarChart
            style={{ height: 200 }}
            data={barData}
            svg={{ fill: "#2F80ED", rx: 6, ry: 6 }}
            contentInset={{ top: 20, bottom: 20 }}
          >
            <Grid />
          </BarChart>

          <View style={styles.barLabels}>
            {barLabels.map((l, i) => (
              <Text key={i} style={styles.barLabel}>
                {l}
              </Text>
            ))}
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
    paddingTop:40
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

  summaryCard: {
    width: width * 0.45,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAEFFC",
    padding: 18,
    elevation: 2,
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
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAEFFC",
    elevation: 2,
  },

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
    justifyContent: "space-between",
  },

  quickCard: {
    width: width * 0.28,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF2FF",
    marginBottom: 12,
  },

  quickIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
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

  statTitle: { color: "#6B7280", fontSize: 13 },

  statValue: { fontSize: 22, fontWeight: "700", marginTop: 6 },

  advanceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#EEF7FF",
    borderRadius: 16,
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

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});
