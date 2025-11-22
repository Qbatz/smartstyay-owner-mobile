import React, {useLayoutEffect, useEffect, useState , useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,  BackHandler,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  PanResponder, Animated , ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import AddExpenses from "./AddExpenses"
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import SearchIcon from "../../../Assets/Images/Asset_search.png";
import ExpensesIcon from "../../../Assets/Images/direct-right.png";
import AddIcon from "../../../Assets/Images/TenantAddBlue.png";
import AssetIcon from "../../../Assets/Images/Asset.png";
import ButtonTag from "../../../Assets/Images/tag.png";
import FilterIcon from "../../../Assets/Images/EditPin.png";
import DownArrow from "../../../Assets/Images/direction-down.png";


export default function ExpensesScreen() {
  const navigation = useNavigation();
   const [showFilter, setShowFilter] = useState(false);

const expensesData = [
  {
    id: "1",
    title: "Chicken",
    category: "Non Veg",
    amount: "₹ 2,000.00",
    date: "14 JUN 2025",
  },
  {
    id: "2",
    title: "Vegetables",
    category: "Food",
    amount: "₹ 2,000.00",
    date: "14 JUN 2025",
  },
  {
    id: "3",
    title: "Chicken",
    category: "Food",
    amount: "₹ 2,000.00",
    date: "14 JUN 2025",
  },
  {
    id: "4",
    title: "Asset Purchase",
    category: "Asset",
    amount: "₹ 2,000.00",
    date: "14 JUN 2025",
  },
  {
    id: "5",
    title: "Electricity Bill",
    category: "Maintenance",
    amount: "₹ 2,000.00",
    date: "14 JUN 2025",
  },
  {
    id: "6",
    title: "Vegetables",
    category: "Food",
    amount: "₹ 2,000.00",
    date: "14 JUN 2025",
  },
  {
    id: "7",
    title: "Electricity Bill",
    category: "Maintenance",
    amount: "₹ 2,000.00",
    date: "14 JUN 2025",
  },
  {
    id: "8",
    title: "Asset Purchase",
    category: "Asset",
    amount: "₹ 2,000.00",
    date: "14 JUN 2025",
  },
    {
    id: "9",
    title: "Asset Purchase",
    category: "Asset",
    amount: "₹ 2,000.00",
    date: "14 JUN 2025",
  }
];

  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);

 const amountOptions = [
    "Low to High (Lowest First)",
    "High to Low (Highest First)",
    "Newest First",
    "Oldest First",
  ];
  const [amountSelected, setAmountSelected] = useState(amountOptions[0]);
  const [amountDropdownVisible, setAmountDropdownVisible] = useState(false);

  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");


const translateY = useRef(new Animated.Value(0)).current;
  const detailsY = useRef(new Animated.Value(0)).current;
  const assignTranslateY = useRef(new Animated.Value(0)).current;




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
       
        if (showFilter) {
          setShowFilter(false);
          return true;
        }
        
        
        return false;
      };
  
      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [showFilter]);
  
const toggleAmountDropdown = () => {
    setAmountDropdownVisible((v) => !v);
  };

const handleShowAddExpense = () => {
   navigation.navigate("AddExpenses") 
}



  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        {/* <Text style={{ color: "#4D6BFE", fontSize: 18 }}>↗</Text> */}
        <Image source={ExpensesIcon} style={{height:24 , width:24}}/>
      </View>

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.tagBox}>
          <Text style={styles.tagText}>{item.category}</Text>
        </View>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.amount}>{item.amount}</Text>
      </View>
    </View>
  );

  return (
    <>
    <View style={styles.container}>
      {/* Top Header */}
      

       <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image source={ArrowLeft} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Expenses</Text>
              </View>

      {/* Search Bar */}
       <View style={styles.searchBox}>
              <Image source={SearchIcon} style={styles.searchIcon} />
              <TextInput
                placeholder="Search Expenses"
                placeholderTextColor="#8a8a8a"
                style={styles.searchInput}
              />
            </View>

      {/* List */}
      <FlatList
        data={expensesData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />


         <TouchableOpacity style={styles.Filterfab} onPress={() => setShowFilter(true)}  accessibilityLabel="Open filters">
                <Image source={FilterIcon} style={styles.fabIcon} />
              </TouchableOpacity>
       <TouchableOpacity
             style={styles.fab} onPress={handleShowAddExpense}
           >
             <Image source={AddIcon} style={styles.fabIcon} />
           </TouchableOpacity>


           
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

        {/* {
  showAddexpense && (
      <AddExpenses onclose={handleCloseAddExpense} />
  )
} */}

    </View>

   

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  topHeader: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    marginBottom:10
  },

  backIcon: { width: 18, height: 18, marginRight: 10, tintColor: "#222" },

  headerTitle: { fontSize: 18, fontWeight: "700" },

   searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 14, padding: 12, marginBottom: 20 },
  searchIcon: { width: 20, height: 20, tintColor: "#9E9E9E" },
  searchInput: { flex: 1, marginLeft: 10 },

card: {
  paddingVertical: 15,
  paddingHorizontal: 5,
  marginBottom: 5,
  flexDirection: "row",
  alignItems: "center",
  borderBottomWidth: 1,
  borderBottomColor: "#E5E5E5",
}
,

  iconCircle: {
    height: 45,
    width: 45,
    borderRadius: 30,
    backgroundColor: "#E7EDFF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  tagBox: {
    backgroundColor: "#F3E6CB",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: "flex-start",
  },

  tagText: {
    fontSize: 12,
    color: "black",
    fontWeight: "500",
  },

  date: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },

  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },

  floatingContainer: {
    position: "absolute",
    bottom: 25,
    right: 25,
    alignItems: "center",
  },

  filterBtn: {
    height: 55,
    width: 55,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    marginBottom: 10,
  },

  floatingText: {
    fontSize: 24,
    color: "#4D6BFE",
  },

  addBtn: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#306BFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  floatingAdd: {
    fontSize: 35,
    color: "#fff",
    marginTop: -3,
  },

  fab: { position: "absolute", bottom: 35, right: 25, width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  Filterfab: { position: "absolute", bottom: 100, right: 25, width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  fabIcon: { width: 60, height: 60 },

    sheetOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  sheetHandle: { width: 60, height: 4, backgroundColor: "#D1D5DB", alignSelf: "center", borderRadius: 20, marginBottom: 15 },

  sheetTitle: { fontSize: 20, fontWeight: "700", color: "#000" },

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

   filterSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: "55%",             // ⭐ increase height here
  }, filterHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  filterTitle: { fontSize: 20, fontWeight: "700" },
  resetTextSmall: { color: "#2D6CDF", fontWeight: "600" },

  dateRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  dateBox: { width: "48%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 12 },
  dateText: { color: "#111" },
  calIcon: { width: 20, height: 20 },

  
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

  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  quickBtn: { width: "32%", paddingVertical: 12, borderRadius: 12, backgroundColor: "#F5F6FA", alignItems: "center" },
  quickText: { color: "#111", fontWeight: "600" },

  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 72 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontWeight: "700" },
  applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontWeight: "700" },
  sheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  selectedText: { fontSize: 15, color: "#000", flex: 1 },
  downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },
});
