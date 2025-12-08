import React, {useLayoutEffect, useEffect, useState , useRef,useCallback } from "react";
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
  PanResponder, Animated , ScrollView , Modal
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
import Edit from "../../../Assets/Images/editIcon.png";
import Delete from "../../../Assets/Images/trash.png";
import AssetIcon from "../../../Assets/Images/Asset.png";
import ButtonTag from "../../../Assets/Images/tag.png";
import FilterIcon from "../../../Assets/Images/filter.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import CloseIcon from "../../../Assets/Images/remove.png";
import { useFocusEffect } from '@react-navigation/native';


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
  const [selectedExpense, setSelectedExpense] = useState(null);
  const detailsTranslateY = useRef(new Animated.Value(0)).current;
  const [showTagAsset, setShowTagAsset] = useState(false);
  const [deleteshow , setDeleteShow] = useState(false)


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
  const tagAssetTranslateY = useRef(new Animated.Value(0)).current;
  const detailsY = useRef(new Animated.Value(0)).current;
  const assignTranslateY = useRef(new Animated.Value(0)).current;




  const renderExpensesItem = ({ item }) => (
  <TouchableOpacity onPress={() => openDetails(item)}>
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Image source={ExpensesIcon} style={{ height: 24, width: 24 }} />
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
  </TouchableOpacity>
);


 

const openDetails = (item) => {
  setSelectedExpense(item);
  Animated.timing(detailsTranslateY, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  }).start();
};


const detailsPan = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) detailsTranslateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) {
        closeDetails();
      } else {
        Animated.spring(detailsTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  })
).current;

const closeDetails = () => {
  Animated.timing(detailsTranslateY, {
    toValue: 600,
    duration: 200,
    useNativeDriver: true,
  }).start(() => setSelectedExpense(null));
};




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


  const tagAssetPan = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) tagAssetTranslateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) {
        closeTagAsset();
      } else {
        Animated.spring(tagAssetTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  })
).current;


const closeTagAsset = () => {
  Animated.timing(tagAssetTranslateY, {
    toValue: 600,
    duration: 200,
    useNativeDriver: true,
  }).start(() => {
    setShowTagAsset(false);
    tagAssetTranslateY.setValue(600)
  });
};




  
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
  
  
    // useEffect(() => {
    //   const onBackPress = () => {
       
    //     if (showFilter) {
    //       setShowFilter(false);
    //       return true;
    //     }
        
        
    //     return false;
    //   };
  
    //   const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    //   return () => sub.remove();
    // }, [showFilter]);


   useFocusEffect(
  useCallback(() => {

    const onBackPress = () => {

      // 1️⃣ Expense Details Open → Close it
      if (selectedExpense) {
        setSelectedExpense(null);
        return true;
      }

      // 2️⃣ Filter Sheet Open → Close it
      if (showFilter) {
        setShowFilter(false);
        return true;
      }

      // 3️⃣ Tag Asset Sheet Open → Close it
      if (showTagAsset) {
        setShowTagAsset(false);
        return true;
      }

      // 4️⃣ If can go back → goBack()
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }

      // 5️⃣ Otherwise allow default behaviour
      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [
    selectedExpense,
    showFilter,
    showTagAsset,
    navigation
  ])
);


//    useEffect(() => {
//   const onBackPress = () => {

    
//     if (selectedExpense) {
//       closeDetails();
//       return true;
//     }

  
//     if (showFilter) {
//       setShowFilter(false);
//       return true;
//     }

    
//     if (showTagAsset) {
//       setShowTagAsset(false);
//       return true;
//     }

   
//     navigation.navigate("MyTabs");
//     return true;
//   };

//   const sub = BackHandler.addEventListener(
//     "hardwareBackPress",
//     onBackPress
//   );

//   return () => sub.remove();
// }, [selectedExpense, showFilter, showTagAsset,navigation]);


  
const toggleAmountDropdown = () => {
    setAmountDropdownVisible((v) => !v);
  };

const handleShowAddExpense = () => {
   navigation.navigate("AddExpenses") 
}

const handleEditExpenses = () => {
  navigation.navigate("AddExpenses", { editData: selectedExpense });
};


  const handleDeleteShow = () => {
    setDeleteShow(true)
}

  const handleCloseDeleteShow = () => {
    setDeleteShow(false)
}

const handleOpenTagAsset = () => {
  closeDetails();

  setTimeout(() => {
    tagAssetTranslateY.setValue(600);   
    setShowTagAsset(true);

    setTimeout(() => {
      Animated.timing(tagAssetTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }, 20);

  }, 200);
};





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
        renderItem={renderExpensesItem}
        showsVerticalScrollIndicator={false}
        onPress={() => openDetails(item)}
      />


         <TouchableOpacity style={styles.Filterfab} onPress={() => setShowFilter(true)}  accessibilityLabel="Open filters">
                <Image source={FilterIcon} style={styles.fabIcon} />
              </TouchableOpacity>
       <TouchableOpacity
             style={styles.fab} onPress={handleShowAddExpense}
           >
             <Image source={AddIcon} style={styles.fabIconAdd} />
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

                 {selectedExpense && (
  <View style={styles.sheetOverlay}>
    <TouchableWithoutFeedback onPress={closeDetails}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>

    <Animated.View
      style={[styles.detailsSheet, { transform: [{ translateY: detailsTranslateY }] }]}
      {...detailsPan.panHandlers}
    >
      <View style={styles.sheetHandle} />

      <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <View>
      <Text style={styles.detailsTitle}>{selectedExpense.title}</Text>
      <Text style={styles.detailsDate}>{selectedExpense.date}</Text>
      <Text style={styles.detailsCategory}>{selectedExpense.category}</Text>
      </View>

      <View style={styles.iconRow}>
                    <TouchableOpacity  onPress={handleEditExpenses}>
                    <Image source={Edit} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteShow} >
                    <Image source={Delete} style={[styles.icon, { marginLeft: 12 }]} />
                    </TouchableOpacity>
                  </View>
    </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Unit Count</Text>
          <Text style={styles.value}>100</Text>
        </View>

        <View>
          <Text style={styles.label}>Per Unit Price</Text>
          <Text style={styles.value}>₹ 120</Text>
        </View>

        <View>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>{selectedExpense.amount}</Text>
        </View>
      </View>

      <View style={{marginTop:10}}>
      <Text style={styles.label}>Description</Text>
      <Text style={styles.descText}>
        Lorem ipsum dollar Lorem ipsum dollarLorem ipsum dollarLorem ipsum dollarLorem ipsum dollarLorem ipsum dollar
      </Text>
      </View>

      <TouchableOpacity style={styles.tagBtn} onPress={handleOpenTagAsset}>
        <Image source={ButtonTag} style={{ width: 18, height: 18, tintColor: "#fff" }} />
        <Text style={styles.tagBtnText}>Tag Asset</Text>
      </TouchableOpacity>
    </Animated.View>
  </View>
)}


{showTagAsset && (
  <View style={styles.sheetOverlay}>
    <TouchableWithoutFeedback onPress={closeTagAsset}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>

    <Animated.View
      style={[
        styles.tagAssetSheet,
        { transform: [{ translateY: tagAssetTranslateY }] }
      ]}
      {...tagAssetPan.panHandlers}
    >
      <View style={styles.sheetHandle} />

      <View style={styles.tagAssetHeader}>
        <Text style={styles.tagAssetTitle}>Tag Asset</Text>

        <TouchableOpacity onPress={closeTagAsset}>
          <Image source={CloseIcon} style={{ width: 14, height: 14, tintColor: "#444" }} />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Select Asset <Text style={{color:'red'}}>*</Text></Text>

      <TouchableOpacity style={styles.assetDropdown}>
        <Text style={styles.dropdownText}>Assets</Text>
        <Image source={DownArrow} style={styles.downArrow} />
      </TouchableOpacity>

      <View style={styles.tagAssetFooter}>
        <TouchableOpacity style={styles.cancelBtn} onPress={closeTagAsset}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  </View>
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

  fab: { position: "absolute", bottom: 45, right: 25, width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  fabIcon: { width: 30, height: 30 },
  fabIconAdd:{ width: 60, height: 60},
 Filterfab: {
  position: "absolute",
  bottom: 120,
  right:30,
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

  label: { fontSize: 13, color: "#4B4B4B", marginBottom: 6 },
  value: { fontSize: 14, fontWeight: "600", color: "#000" },

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

  detailsSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  height: "50%",
},

detailsTitle: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
detailsCategory: { fontSize: 12, color: "#666" },
detailsDate: { fontSize: 12, color: "#424242",fontWeight: "600", marginBottom: 3 },

row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 20 },

descText: { fontSize: 14, color: "#444", lineHeight: 20, marginBottom: 20 },

tagBtn: {
  backgroundColor: "#1E45E1",
  paddingVertical: 14,
  borderRadius: 12,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop:20
},
tagBtnText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
iconRow: { flexDirection: "row" , marginTop:14},
icon: { width: 20, height: 20 },

tagAssetSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  height: "33%",     // small height
},

tagAssetHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},

tagAssetTitle: {
  fontSize: 18,
  fontWeight: "700",
},

assetDropdown: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ddd",
  padding: 14,
  borderRadius: 12,
  marginTop: 10,
},

dropdownText: {
  fontSize: 15,
  color: "#444",
},

tagAssetFooter: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 30,
},

cancelBtn: {
  width: "48%",
  paddingVertical: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#1E45E1",
  alignItems: "center",
},

cancelText: {
  color: "#1E45E1",
  fontWeight: "700",
},

saveBtn: {
  width: "48%",
  paddingVertical: 14,
  borderRadius: 12,
  backgroundColor: "#1E45E1",
  alignItems: "center",
},

saveText: {
  color: "#fff",
  fontWeight: "700",
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

});
