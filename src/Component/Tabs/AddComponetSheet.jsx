// import React, { useState , useEffect, useRef , useContext } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   PanResponder,
//   Dimensions,
//   ScrollView,
//   Image, TouchableWithoutFeedback , BackHandler
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import BookingPencilIcon from "../../Assets/Images/pencil-book.png"
// import { CommonContexts } from "../../Context/CommonContext"
// import SuccessModal from "../../ToastFile/ToastPage";

// const { height } = Dimensions.get("window");
// const SHEET_HEIGHT = height * 0.44;

// export default function AddComponentSheet({
//   visible,
//   onClose,  bottomOffset = 85,
// }) {


//       const { activeHostelId } = useContext(CommonContexts);

//         const [modalType, setModalType] = useState("success");
//         const [showSuccess, setShowSuccess] = useState(false);
//         const [message, setMessage] = useState("");

// const navigation = useNavigation();
// const translateY = useRef(
//   new Animated.Value(SHEET_HEIGHT)
// ).current;

// useEffect(() => {
//   Animated.timing(translateY, {
//     toValue: visible ? 0 : SHEET_HEIGHT,
//     duration: 250,
//     useNativeDriver: true,
//   }).start();
// }, [visible])




// useEffect(() => {
//   if (!visible) return;

//   const backAction = () => {
//     closeSheet();
//     return true; 
//   };

//   const subscription = BackHandler.addEventListener(
//     "hardwareBackPress",
//     backAction
//   );

//   return () => subscription.remove();
// }, [visible]);




// const closeSheet = () => {
//   Animated.timing(translateY, {
//     toValue: SHEET_HEIGHT,
//     duration: 220,
//     useNativeDriver: true,
//   }).start(() => {
//     onClose?.();
//   });
// };


//   const panResponder = useRef(
//   PanResponder.create({
//     onMoveShouldSetPanResponder: (_, g) => g.dy > 10,

//     onPanResponderMove: (_, g) => {
//       if (g.dy > 0) {
//         translateY.setValue(g.dy);
//       }
//     },

//     onPanResponderRelease: (_, g) => {
//       if (g.dy > 120) {
//         closeSheet();
//       } else {
//         Animated.spring(translateY, {
//           toValue: 0,
//           useNativeDriver: true,
//         }).start();
//       }
//     },
//   })
// ).current;

// const DATA = [
//   {
//     title: "Tenant",
//     icon: require("../../Assets/Images/user-circle-add.png"),
//     screen: "AddTenantNew",
//   },
//   {
//     title: "Booking",
//     icon: BookingPencilIcon,
//     screen:'AddBookingNewForm',
//   },
//   {
//     title: "Expense",
//     icon: require("../../Assets/Images/money-minus.png"),
//     screen: "AddExpensesPage",
//   },
//   {
//     title: "Walkin",
//     icon: require("../../Assets/Images/walkin_user.png"),
//     screen: "AddTenant",
//   },
//   {
//     title: "Invoice",
//     icon: require("../../Assets/Images/invoice.png"),
//     screen: "CreateBills",
//   },

//   {
//     title: "Complaint",
//     icon: require("../../Assets/Images/InvestmentBlue.png"),
//     screen: "AddComplaint",
//   },


//   {
//     title: "vendors",
//     icon: require("../../Assets/Images/profileElec.png"),
//     screen: "AddVendorPage",
//   },
// ];

// const [mounted, setMounted] = useState(visible);

// useEffect(() => {
//   if (visible) {
//     setMounted(true);

//     Animated.timing(translateY, {
//       toValue: 0,
//       duration: 250,
//       useNativeDriver: true,
//     }).start();
//   } else {
//     Animated.timing(translateY, {
//       toValue: SHEET_HEIGHT,
//       duration: 220,
//       useNativeDriver: true,
//     }).start(() => {
//       setMounted(false);
//     });
//   }
// }, [visible]);

// const handleItemPress = (item) => {

//     if (!activeHostelId) {
//     setModalType("warning")
//     setMessage("Please add a hostel first")
//     setShowSuccess(true)
//     setTimeout(() => setShowSuccess(false), 1500)
//     return
//   }

//   Animated.timing(translateY, {
//     toValue: SHEET_HEIGHT,
//     duration: 220,
//     useNativeDriver: true,
//   }).start(() => {
//     onClose?.();

//     navigation.navigate(item.screen);
//   });
// };

// if (!mounted) return null;

// return (
// <>


//   <SuccessModal
//         visible={showSuccess}
//         message={message}
//         type={modalType}

//       />
//   <View style={styles.wrapper} pointerEvents="box-none">


//     <TouchableWithoutFeedback onPress={closeSheet}>
//   <View style={styles.backdrop} />
// </TouchableWithoutFeedback>

//     <Animated.View
//       {...panResponder.panHandlers}
//      style={[
//     styles.sheet,
//     {
//       bottom: bottomOffset,
//       transform: [{ translateY }],
//     },
//   ]}
//     >


//       <ScrollView
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.grid}>
//           {DATA.map((item, index) => (
//             <TouchableOpacity
//   key={index}
//   style={styles.item}
//   activeOpacity={0.8}
//   onPress={() => handleItemPress(item)}
// >
//               <View style={styles.iconBox}>
//                 <Image
//                   source={item.icon}
//                   style={styles.icon}
//                 />
//               </View>

//               <Text style={styles.label}>
//                 {item.title}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>

//     </Animated.View>

//   </View>
//   </>
// );
// }

// const styles = StyleSheet.create({
// wrapper: {
//   ...StyleSheet.absoluteFillObject,
//   justifyContent: "flex-end",
//   zIndex: 9999,
//   elevation: 9999,
// },

// backdrop: {
//   ...StyleSheet.absoluteFillObject,
//   backgroundColor: "rgba(0,0,0,0.22)",
// },

// sheet: {
//   position: "absolute",
//   left: 0,
//   right: 0,

//   height: SHEET_HEIGHT,

//   backgroundColor: "#FFF",

//   borderTopLeftRadius: 32,
//   borderTopRightRadius: 32,

//   paddingTop: 24,
//   paddingHorizontal: 28,

//   elevation: 100,
//   zIndex: 100,
// },

//  handle:{
//     width:48,
//     height:5,
//     borderRadius:10,
//     backgroundColor:"#D8D8D8",
//     alignSelf:"center",
//     marginBottom:20,
// },

//  title:{
//     fontSize:18,
//     fontFamily:"Gilroy-Semibold",
//     color:"#1E1E1E",
//     marginBottom:28,
// },

//   grid:{
//     flexDirection:"row",
//     flexWrap:"wrap",
//     justifyContent:"space-around",
// },

//  item:{
//     width:"30%",
//     alignItems:"center",
//     marginBottom:34,
// },

//  iconBox:{
//     width:56,
//     height:56,
//     borderRadius:24,

//     backgroundColor:"#FFF",

//     borderWidth:1,
//     borderColor:"#ECECEC",

//     justifyContent:"center",
//     alignItems:"center",

//     marginBottom:12,
// },

//  icon:{
//     width:24,
//     height:24,
//     resizeMode:"contain",
// },

//  label:{
//     marginTop:6,
//     textAlign:"center",
//     fontSize:15,
//     fontFamily:"Gilroy-Medium",
//     color:"#222",
// }
// });

import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  Image, TouchableWithoutFeedback, BackHandler
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import BookingPencilIcon from "../../Assets/Images/pencil-book.png"
import { CommonContexts } from "../../Context/CommonContext"
import { useCustomer } from "../../Context/CustomerContext";        // 👈 fix: 3 dots -> 2 dots
import { ExpensesContext } from "../../Context/ExpensesContext"
import { VendorContext } from "../../Context/VendorContext"          // 👈 add pannunga - missing import
import SuccessModal from "../../ToastFile/ToastPage";

import { PGContext } from "../../Context/PGContext";
import { ComplaintContext } from "../../Context/ComplaintContext";



const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.44;

export default function AddComponentSheet({
  visible,
  onClose, bottomOffset = 85,
}) {

  const { activeHostelId } = useContext(CommonContexts);
  const { PGDetails } = useContext(PGContext);

  const isExpired = PGDetails && !PGDetails.isSubscriptionActive;

  const { getCustomersByHostel } = useCustomer();

    const { complaintsList, complaintListOtherDetails, GetComplaintListDetails,
      complaintTypes, fetchComplaintTypes, getParticularComplaint } = useContext(ComplaintContext);

  const { IntializeexpensesList, GetInitializeExpense } = useContext(ExpensesContext)

  const { vendorCategories, getVendorCategories } = useContext(VendorContext);   // 👈 correct-ah destructure

  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [customers, setCustomers] = useState([]);
  const [walkinCustomers, setWalkinCustomers] = useState([]);

  const navigation = useNavigation();
  const translateY = useRef(
    new Animated.Value(SHEET_HEIGHT)
  ).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible])

  useFocusEffect(
    useCallback(() => {
      fetchWalkinCustomers();
      fetchCustomers();
    }, [activeHostelId])
  );

  const fetchWalkinCustomers = async () => {
    if (activeHostelId) {
      const data = await getCustomersByHostel(
        activeHostelId,
        "",
        "Inactive"
      );
      setWalkinCustomers(data?.listCustomers || []);
    }
  };

  const fetchCustomers = async () => {
    if (activeHostelId) {
      const data = await getCustomersByHostel(activeHostelId);
      setCustomers(data || []);
    }
  };

  useEffect(() => {
    if (activeHostelId) {
      GetInitializeExpense(activeHostelId)
    }
  }, [activeHostelId])

  useEffect(() => {
    if (activeHostelId) {
      getVendorCategories(activeHostelId);
    }
  }, [activeHostelId])

    useEffect(() => {
      if (activeHostelId) {
        fetchComplaintTypes(activeHostelId);
      }
    }, [activeHostelId])

  // 👇 Expense category, Vendor category — rendum vera vera source
  const expenseCategoryList = IntializeexpensesList?.listExpenses || [];
  const vendorCategoryList = vendorCategories || [];

  useEffect(() => {
    if (!visible) return;

    const backAction = () => {
      closeSheet();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => subscription.remove();
  }, [visible]);



  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
    });
  };


  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10,

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          translateY.setValue(g.dy);
        }
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const DATA = [
    {
      title: "Tenant",
      icon: require("../../Assets/Images/user-circle-add.png"),
      screen: "AddTenantNew",
    },
    {
      title: "Booking",
      icon: BookingPencilIcon,
      screen: 'AddBookingNewForm',
    },
    {
      title: "Expense",
      icon: require("../../Assets/Images/money-minus.png"),
      screen: "AddExpensesPage",
    },
    {
      title: "Walkin",
      icon: require("../../Assets/Images/walkin_user.png"),
      screen: "AddTenant",
    },
    {
      title: "Invoice",
      icon: require("../../Assets/Images/invoice.png"),
      screen: "CreateBills",
    },
    {
      title: "Complaint",
      icon: require("../../Assets/Images/InvestmentBlue.png"),
      screen: "AddComplaint",
    },
    {
      title: "vendors",
      icon: require("../../Assets/Images/profileElec.png"),
      screen: "AddVendorPage",
    },
  ];

  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);

      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        setMounted(false);
      });
    }
  }, [visible]);

  const getValidationError = (item) => {
    if (!activeHostelId) {
      return "Please add a hostel first";
    }

    switch (item.title) {
      // case "Booking":
      //   if (!walkinCustomers || walkinCustomers.length === 0) {
      //     return "Please add a walkin first";
      //   }
      //   break;

     case "Invoice":
      if (!customers || customers.length === 0) {
        return "Please add a tenant first";
      }
      break;

    case "Complaint":
      if (!customers || customers.length === 0) {
        return "Please add a tenant first";
      }

      if (!complaintTypes || complaintTypes.length === 0) {
        return "Please Create Complaint Type in Settings-Complaint";
      }
      break;

      case "Expense":
        if (!expenseCategoryList || expenseCategoryList.length === 0) {
          return "Please add a expense category first";
        }
        break;

      case "vendors":
        if (!vendorCategoryList || vendorCategoryList.length === 0) {
          return "Please add a vendor category first";
        }
        break;

      default:
        break;
    }

    return null;
  };

  const handleItemPress = (item) => {
    if (isExpired) {
      return;
    }

    const errorMsg = getValidationError(item);

    if (errorMsg) {
      setModalType("warning");
      setMessage(errorMsg);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
      return;
    }

    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      onClose?.();

      navigation.navigate(item.screen);
    });
  };

  if (!mounted) return null;

  return (
    <>


      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}

      />
      <View style={styles.wrapper} pointerEvents="box-none">

        <TouchableWithoutFeedback onPress={closeSheet}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.sheet,
            {
              bottom: bottomOffset,
              transform: [{ translateY }],
            },
          ]}
        >

          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {DATA.map((item, index) => (
                // <TouchableOpacity
                //   key={index}
                //   style={styles.item}
                //   activeOpacity={0.8}
                //   onPress={() => handleItemPress(item)}
                // >
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.item,
                      isExpired && { opacity: 0.4 }
                    ]}
                    activeOpacity={isExpired ? 1 : 0.8}
                    disabled={isExpired}
                    onPress={() => handleItemPress(item)}
                  >
                  <View style={styles.iconBox}>
                    <Image
                      source={item.icon}
                      style={styles.icon}
                    />
                  </View>

                  <Text style={styles.label}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

        </Animated.View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 9999,
    elevation: 9999,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,

    height: SHEET_HEIGHT,

    backgroundColor: "#FFF",

    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

    paddingTop: 24,
    paddingHorizontal: 28,

    elevation: 100,
    zIndex: 100,
  },

  handle: {
    width: 48,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#D8D8D8",
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontFamily: "Gilroy-Semibold",
    color: "#1E1E1E",
    marginBottom: 28,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

  item: {
    width: "30%",
    alignItems: "center",
    marginBottom: 34,
  },

  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 24,

    backgroundColor: "#FFF",

    borderWidth: 1,
    borderColor: "#ECECEC",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 12,
  },

  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  label: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 15,
    fontFamily: "Gilroy-Medium",
    color: "#222",
  }
});