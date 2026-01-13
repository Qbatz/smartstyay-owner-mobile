import React, { useState,useRef,useEffect , useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  PanResponder,Animated,TouchableWithoutFeedback,Dimensions,BackHandler
} from "react-native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react"; 
import {ElectricityContext} from "../../../Context/ElectricityContext";
import { CommonContexts } from "../../../Context/CommonContext";
import Loader from "../../../Component/Loader/Loader"
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";


import BackIcon from "../../../Assets/Images/Arrow_left.png";
import SearchIcon from "../../../Assets/Images/Asset_search.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";
import ProfileIcon from "../../../Assets/Images/profile.png";
import FilterIcon from "../../../Assets/Images/filter.png";
import TenantsList from "./TenantsList";
import DownArrow from "../../../Assets/Images/direction-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import EmptyState from "../../../Assets/Images/Empty_state.png"



export default function Electricity({ navigation }) {

   const { activeHostelId } = useContext(CommonContexts);
  const { EbRoomReading , 
            EbTenantReading,
            loading,
            error, 
            errorMsg,
            GetEBRoomReading,
            GetEBTenantReading , ParticularRoomReadingDetails ,AddRoomReading } = useContext(ElectricityContext);

            console.log("EbRoomReading" , EbRoomReading);
            console.log("EbTenantReading" , EbTenantReading);

  const [activeTab, setActiveTab] = useState("Room Reading");
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());

    const [readingError, setReadingError] = useState("");
    const [dateError, setDateError] = useState("");
    const [currentReading, setCurrentReading] = useState("");
    const [readingDate, setReadingDate] = useState(null);
    const [toDate, setToDate] = useState(dayjs());
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
     const [amountDropdownVisible, setAmountDropdownVisible] = useState(false);
      const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");
       const toggleAmountDropdown = () => {
    setAmountDropdownVisible((v) => !v);
  };

    useEffect(() => {
  if (activeHostelId) {
    GetEBRoomReading(activeHostelId);
  }
}, [activeHostelId]);

   useEffect(() => {
  if (activeHostelId) {
    GetEBTenantReading(activeHostelId);
  }
}, [activeHostelId]);

 useEffect(() => {
  const onBackPress = () => {
    if (showFilter) {
      setShowFilter(false);   
      return true;
    }

 
    navigation.navigate("MoreDesign");
    return true;
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    onBackPress
  );

  return () => backHandler.remove();
}, [showFilter]);


     const amountOptions = [
    "Low to High (Lowest First)",
    "High to Low (Highest First)",
    "Newest First",
    "Oldest First",
  ];
      const [amountSelected, setAmountSelected] = useState(amountOptions[0]);
   const translateY = useRef(new Animated.Value(0)).current;
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
               setShowFilter(false);
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
   

  const tabs = [
    { key: "Room Reading" },
    { key: "Tenant Reading" },
  ];

  const dummy = [
    { room: "Room 001", floor: "Ground Floor", users: 3, amount: "1,500.00", month: "August" },
    { room: "Room 002", floor: "Ground Floor", users: 4, amount: "2,400.00", month: "August" },
    { room: "Room 003", floor: "Ground Floor", users: 2, amount: "1,400.00", month: "August" },
    { room: "Room 004", floor: "Ground Floor", users: 2, amount: "1,200.00", month: "August" },
    { room: "Room 005", floor: "Ground Floor", users: 4, amount: "1,450.00", month: "August" },
    
  ];

const formatApiMonth = (date) => {
  if (!date || date === "N/A") return "--";

  return dayjs(date, ["DD/MM/YYYY", "D/MM/YYYY"]).format("MMMM");
};

   const handleClickRoomDetails = (item) => {
    console.log("item", item);
    
    navigation.navigate("RoomDetails", { roomData: item })
    ParticularRoomReadingDetails(item.hostelId, item.roomId);
   }

//    const handleSubmit = async () => {
//   let hasError = false;

//   if (!currentReading) {
//     setReadingError("Please enter reading");
//     hasError = true;
//   } else {
//     setReadingError("");
//   }

//   if (!readingDate) {
//     setDateError("Please select reading date");
//     hasError = true;
//   } else {
//     setDateError("");
//   }

//   if (hasError) return;

//   const payload = {
//     hostelId: activeHostelId,
//     reading: currentReading,
//     readingDate: dayjs(readingDate).format("DD-MM-YYYY"),
//     roomId: selectedRowDetails?.roomId,
//     floorId: selectedRowDetails?.floorId,
//   };

//   const res = await AddRoomReading(payload);

//   if (res.success) {
//     Alert.alert("Success", res.data || "Reading added successfully");
//     setCurrentReading("");
//     setReadingDate(null);
//   } else {
//     Alert.alert("Error", res.message || "Something went wrong");
//   }
// };


  return (

    <>
    { loading && <Loader />}
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Image source={SearchIcon} style={styles.searchIcon} />
          <TextInput
            placeholder="Search Electricity"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabsRow}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={styles.tabBtn}
            onPress={() => setActiveTab(t.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === t.key && styles.tabActive,
              ]}
              onLayout={(event) => {
                if (activeTab === t.key) {
                  setUnderlineWidth(event.nativeEvent.layout.width);
                }
              }}
            >
              {t.key}
            </Text>

            {activeTab === t.key && (
              <View style={[styles.tabUnderline, { width: underlineWidth }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>

     {activeTab === "Room Reading" &&
     <>
     <ScrollView    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
    flexGrow: 1,
    justifyContent:
      !loading && EbRoomReading?.length === 0 ? "center" : "flex-start",
  }}>
      { !loading && EbRoomReading && EbRoomReading.length > 0 && (
  EbRoomReading.map((item, index) => (
    <View key={index} style={styles.row}>

      {/* ICON */}
      <View style={styles.iconCircle}>
        <Image source={RoomIcon} style={styles.iconImg} />
      </View>

      {/* MIDDLE */}
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() =>handleClickRoomDetails(item)}
        >
          <Text style={styles.roomName}>{item.roomName}</Text>
        </TouchableOpacity>

        <View style={styles.subRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.floorName}</Text>
          </View>

          <View style={styles.people}>
            <Image source={ProfileIcon} style={styles.peopleIcon} />
            <Text style={styles.peopleText}>
              {item.noOfTenants ?? 0}
            </Text>
          </View>
        </View>
      </View>

      {/* RIGHT */}
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.price}>₹ {item.totalPrice ?? 0}</Text>
        <Text style={styles.month}>
           {formatApiMonth(item?.startDate)}
          {/* {dayjs(item.startDate).format("MMM")} */}
        </Text>
      </View>

    </View>
  )))
}

  {( 
         !loading && EbRoomReading && EbRoomReading.length === 0 &&
            <View style={styles.centerContainer}>
              <Image source={EmptyState} style={styles.image} />
              <Text style={styles.noFloorText}>No Room Readings are there!</Text>
      
              
            </View>
          )}

      </ScrollView>

      {/* Floating Filter Button */}
      {
       !loading &&  EbRoomReading && EbRoomReading.length > 0 &&
       (
<TouchableOpacity style={styles.fab}  onPress={() => setShowFilter(true)} accessibilityLabel="Open filters">
        <Image source={FilterIcon} style={styles.fabIcon} />
      </TouchableOpacity>
       )
      }
      
     </>
     }
      
  {activeTab === "Tenant Reading" &&
  <TenantsList/>}
     {showFilter && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[styles.filterSheet, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.filterHeaderRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={FilterIcon} style={{ width: 50, height: 50 }} />
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

            <Text style={[styles.label, { marginTop: 18 }]}>Amount</Text>

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



      {openFrom && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenFrom(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
              date={fromDate}
              onChange={(p) => {
                setFromDate(p.date || dayjs());
                setOpenFrom(false);
              }}
            />
          </View>
        </View>
      )}


      {openTo && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenTo(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
              date={toDate}
              onChange={(p) => {
                setToDate(p.date || dayjs());
                setOpenTo(false);
              }}
            />
          </View>
        </View>
      )}
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15, paddingTop: 40 },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backIcon: { width: 22, height: 22, marginRight: 10 },

  searchBox: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 50,
  },
  sheetOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  searchIcon: { width: 18, height: 18, tintColor: "#9CA3AF" },
  searchInput: { flex: 1, marginLeft: 8, color: "#000" },

  /* TABS */
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    marginBottom: 10,
  },

  tabBtn: { alignItems: "center" },

  tabText: {
    fontSize: 16,
    color: "#7A7A7A",
    fontWeight: "600",
  },

  tabActive: {
    color: "#1E45E1",
  },

  tabUnderline: {
    marginTop: 6,
    height: 3,
    backgroundColor: "#1E45E1",
    borderRadius: 10,
  },
  sheetHandle: { width: 60, height: 4, backgroundColor: "#D1D5DB", alignSelf: "center", borderRadius: 20, marginBottom: 15 },

  /* LIST ROW */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 50,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  iconImg: { width: 26, height: 26, tintColor: "#3F6AFF" },

  roomName: { fontSize: 16, fontWeight: "700", color: "#000" },

  subRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },

  tag: {
    backgroundColor: "#FFF4D7",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 12,
  },

  tagText: { fontSize: 12, fontWeight: "600", color: "#A47E00" },

  people: { flexDirection: "row", alignItems: "center" },
  peopleIcon: { width: 16, height: 16},
  peopleText: { marginLeft: 4, color: "#3D6AE8", fontWeight: "600" },

  price: { fontSize: 16, fontWeight: "700", color: "#000" },
  month: { color: "#6B7280", fontSize: 13, marginTop: 4 },
 fab: {
  position: "absolute",
  bottom: 120,
  right: 25,
  width: 50,
  height: 50,
  backgroundColor: "#fff",
  borderRadius: 55,
  justifyContent: "center",
  alignItems: "center",
  elevation: 6, 
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 }, // iOS shadow
},
  

  fabIcon: { width: 30, height: 30 },
  sheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  selectedText: { fontSize: 15, color: "#000", flex: 1 },
  downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },
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
   datePickerBox: { width: "90%", backgroundColor: "#fff", padding: 12, borderRadius: 15, alignSelf: "center", marginBottom: 30 },
   filterSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: "55%",           
  }, filterHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  filterTitle: { fontSize: 20, fontWeight: "700" },
  resetTextSmall: { color: "#2D6CDF", fontWeight: "600" },
  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  quickBtn: { width: "32%", paddingVertical: 12, borderRadius: 12, backgroundColor: "#F5F6FA", alignItems: "center" },
  quickText: { color: "#111", fontWeight: "600" },
  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 72 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontWeight: "700" },applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontWeight: "700" },
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

     centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
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
  
});
