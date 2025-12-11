import React, { useState,useCallback, useEffect, useContext, } from "react";
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
  TouchableWithoutFeedback
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import PgImg from '../../Assets/Images/PgImg.png'
import Bell from '../../Assets/Images/bell.png'
import Profile from '../../Assets/Images/profile.png'
import Announcement from '../../Assets/Images/announcement.png';
import UpdateImg from '../../Assets/Images/updateImg.png'
import InProfile from '../../Assets/Images/inActiveuser.png'
import Activeannouncement from '../../Assets/Images/Active_announcement.png';
import ActiveUpdate from '../../Assets/Images/Active_update.png'
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
import ActiveCompliance from '../../Assets/Images/Active_compliance.png';
import MonthProfit from '../../Assets/Images/Month_Profit.png';
import AnnouncementScreen from '../Dashboard/Announcement';
import UpdatesScreen from '../Dashboard/Update';
import Svg, {  Path, Circle, Line, Text as SvgText} from "react-native-svg";
import { CommonContexts } from "../../Context/CommonContext";
import { LoginContexts } from "../../Context/LoginContext";
import ProfileDrawer from "./ProfileClickScreen";
import AddTenant from "../Customer/AddTenants";


import {
  BarChart,
  PieChart,
  Grid,
  YAxis,
  XAxis
} from "react-native-svg-charts";
import { getHostels } from "../../Action/HostelAction";



export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [drawerVisible, setDrawerVisible] = useState(false);
  
 const { updateHostelList, hostelList  , activeHostelId  , setActiveHostelId} = useContext(CommonContexts);
  const login = useContext(LoginContexts);

  console.log("Hostels:", hostelList);

//   const activeHostel = hostelList &&  hostelList.find(h =>
//   (h.hostelId ?? h.id) === activeHostelId
// ) || hostelList[0];

const activeHostel =
  hostelList?.find(h => (h.hostelId ?? h.id) === activeHostelId) ??
  hostelList?.[0] ??
  null;


  const navigation = useNavigation();


   useEffect(() => {
    if (!login.getToken) return;

    getHostels(login.getToken).then((res) => {
      updateHostelList(res.data);
    });
  }, [login.getToken]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (drawerVisible) {
          setDrawerVisible(false);
          return true;
        }
        return false;
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [drawerVisible])
  );

  const context=useContext(LoginContexts)
    const [tooltip, setTooltip] = useState(null);
    const { width } = Dimensions.get("window");
    // const [hostelList,setHostelList]=useState([])

    console.log(hostelList , activeHostel)

  const months = ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024"];
  const advance = [100000, 150000, 23000, 31000, 28000];
  const advanceReturn = [10000, 12000, 21000, 30000, 50000];

  const padding = 20;
  const chartHeight = 250;

  const [chartWidth, setChartWidth] = useState(width - 40);

  const maxY = Math.max(...advance, ...advanceReturn);

  const getX = (i) =>
    (i / (months.length - 1)) * (chartWidth - padding * 2) + padding;

  const getY = (value) =>
    padding + (1 - value / maxY) * (chartHeight - padding * 2);

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
  if (!login.getToken) return;
  if(activeHostelId){
 getHostels(login.getToken).then((res) => {
    const reordered = reorderHostels(res.data, activeHostelId);
    updateHostelList(reordered);
  });
  }
 
}, [login.getToken, activeHostelId]);



    // useEffect(()=>{
    //     getHostels(context.getToken).then(r=>{
    //       console.log(r)
    //       setHostelList(r.data)
    //     })
    // },[])


  const data = [
    { label: "Jun 2025", value: 5000 },
    { label: "Jul 2025", value: 195000 },
    { label: "Aug 2025", value: 168000 },
    { label: "Sep 2025", value: 0 },
    { label: "Oct 2025", value: 0 },
    { label: "Nov 2025", value: 5000 }
  ];



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



  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>

      <StatusBar backgroundColor="#E9F2FF" barStyle="dark-content" />



      <LinearGradient
        colors={["#E9F2FF", "#F6FBFF"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.hostelRow}>
            <Image source={PgImg} style={{ width: 38, height: 38 }} />
            <View style={{ marginLeft: 12 }}>
            <Text style={styles.hostelTitle}>  {activeHostel?.name || "Select PG"}</Text>
              {/* <Text style={styles.changeText}>Change Hostel →</Text> */}
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
            <View style={[styles.summaryCard, { width: width * 0.45 }]}>
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

              <View style={[styles.smallCard, { width: width * 0.4 }]}>
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

        
          <View style={styles.quickGrid}>
  {[
    { label: "Add Customers", icon: Usercircle, color: "#7C3AED", route: "AddTenant" },
    { label: "Add Expense", icon: ExpenseImg, color: "#EF4444", route: "AddExpenses" },
    { label: "Create Bills", icon: CrateBill, color: "#F59E0B", route: "CreateBills" },
    { label: "Add Walkin", icon: WalkinImg, color: "#A78BFA", route: "AddWalkin" },
    { label: "Make agreement", icon: AgreementImg, color: "#10B981", route: "Agreement" },
  ].map((x, i) => (
    <TouchableOpacity
      key={i}
      style={styles.quickCard}
      onPress={() => navigation.navigate(x.route)}   // 👈 Navigate on press
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
</View>



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

          </View>

      

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




                {/* X Axis */}
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

            {/* Legend */}
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



          <View style={styles.card}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Advance VS Advance Return</Text>

              <View style={styles.dropdownBox}>
                <Text style={styles.dropdownText}>Last 6 Months</Text>
                <Text style={{ fontSize: 18, marginLeft: 4 }}>▾</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>

              <View style={{ width: 40, justifyContent: "space-between", marginTop: 10 }}>
                {[50000, 40000, 30000, 20000, 10000, 0].map((v, i) => (
                  <Text key={i} style={{ fontSize: 10, color: "#6B7280" }}>
                    {v === 0 ? "0" : v / 1000 + "k"}
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

                    <Path d={createPath(advance)}
                      stroke="#3A7BFF"
                      strokeWidth={3}
                      fill="none"
                    />

                   
                    <Path d={createPath(advanceReturn)}
                      stroke="#FF5733"
                      strokeWidth={3}
                      fill="none"
                    />

                   
                    {advance.map((v, i) => (
                      <Circle
                        key={i}
                        cx={getX(i)}
                        cy={getY(v)}
                        r={6}
                        fill="#3A7BFF"
                        onPress={() => onPointPress(i)}
                      />
                    ))}

                  
                    {advanceReturn.map((v, i) => (
                      <Circle
                        key={i}
                        cx={getX(i)}
                        cy={getY(v)}
                        r={6}
                        fill="#FF5733"
                        onPress={() => onPointPress(i)}
                      />
                    ))}
                  </Svg>

                
                  {tooltip && (
                    <View style={[styles.tooltipBox, { top: tooltip.y, left: tooltip.x - 70 }]}>
                      <Text style={styles.tooltipMonth}>{tooltip.month}</Text>
                      <Text style={[styles.tooltipValue, { color: "#3A7BFF" }]}>
                        Advance : ₹{tooltip.advance}
                      </Text>
                      <Text style={[styles.tooltipValue, { color: "#FF5733" }]}>
                        Advance Return : ₹{tooltip.advanceReturn}
                      </Text>
                    </View>
                  )}

                </View>
              </TouchableWithoutFeedback>
            </View>

            
            <View style={styles.monthRow}>
              {months.map((m, i) => (
                <Text key={i} style={styles.monthLabel}>{m}</Text>
              ))}
            </View>

            
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#3A7BFF" }]} />
                <Text>Advance</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#FF5733" }]} />
                <Text>Advance Return</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
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
          </View>



          <View style={styles.chartCard}>

            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Expenses</Text>

              <View style={styles.dropdownBox}>
                <Text style={styles.dropdownText}>This Month</Text>
                <Text style={{ fontSize: 18, marginLeft: 4 }}>▾</Text>
              </View>
            </View>


            <View style={{ width: 220, height: 220, alignSelf: "center" }}>


              <PieChart
                style={{ height: 220 }}
                data={expenseCategory}
                innerRadius={70}
                outerRadius={"90%"}
              />


              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 220,
                  height: 220,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 145,
                    height: 145,
                    borderRadius: 145 / 2,
                    backgroundColor: "white",
                  }}
                />


                <Text
                  style={{
                    position: "absolute",
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#000",
                  }}
                >
                  {totalCategories}
                </Text>
              </View>
            </View>



            <View style={styles.legendGrid}>
              {legendItems.map((item, i) => (
                <View key={i} style={styles.legendItemRow}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.text}</Text>
                </View>
              ))}
            </View>

          </View>


          <View style={{ height: 50 }} />
        </ScrollView>
      )}
      {activeTab === "Announcement" && <AnnouncementScreen />}
      {activeTab === "Updates" && <UpdatesScreen />}

      <ProfileDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />

    </View>
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
  },


  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },

  hostelRow: { flexDirection: "row", alignItems: "center" },

  hostelTitle: { fontSize: 16, fontWeight: "700", color: "#1E293B", marginLeft:-8 },

  changeText: { fontSize: 12, color: "#2F80ED", marginTop: 3 },


  iconCircle: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",

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

  quickLabel: { fontSize: 12, marginTop: 8, textAlign: "center" },

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
    fontSize: 16,
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
    marginTop: 14,
  },

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
    fontWeight: "600",
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
  title: { fontSize: 16, fontWeight: "700" },
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
    fontWeight: "700",
    marginBottom: 4,
  },
  tooltipValue: {
    fontSize: 13,
    fontWeight: "600",
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



});
