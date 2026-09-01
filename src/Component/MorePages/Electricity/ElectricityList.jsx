import React, { useState,useRef,useEffect , useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView, Modal,
  PanResponder,Animated,TouchableWithoutFeedback,Dimensions,BackHandler , Keyboard
} from "react-native";
import { StatusBar, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { Calendar } from "react-native-calendars";
import UserProfile from "../../../Assets/Images/profileElec.png";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react"; 
import {ElectricityContext} from "../../../Context/ElectricityContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useHasPermission } from "../../../Utils/useHasPermission";
import Loader from "../../../Component/Loader/Loader"
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import Dots from "../../../Assets/Images/3dots.png";
import Add from "../../../Assets/Images/ElectricityAdd.png";
import DeleteIcon from  "../../../Assets/Images/trash.png"
import EditIcon from  "../../../Assets/Images/editIcon.png" 

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
  const { EbRoomReading ,  hostelBased, EbTenantReading, hostelElectricityDetails,
            loading,DeleteRoomReading, UpdateRoomReading,
            error, 
            errorMsg,
            GetEBRoomReading,
            GetEBTenantReading , ParticularRoomReadingDetails ,AddRoomReading } = useContext(ElectricityContext);

            console.log("EbRoomReading" , EbRoomReading);
            console.log("hostelElectricityDetails" , hostelElectricityDetails);

const [activeTab, setActiveTab] = useState("reading");

  const {
    canWriteModule: canWriteElectricity,
    canReadModule: canReadElectricity,
    canUpdateModule: canUpdateElectricity,
    canDeleteModule: canDeleteElectricity,
  } = useHasPermission("Electricity");


  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());


  const [currentReadingData, setCurrentReadingData] = useState(null);
const [roomData, setRoomData] = useState(null);
const [isEditMode, setIsEditMode] = useState(false);

console.log("roomdata", roomData);


      const [apiError, setApiError] = useState("");
      const [showSuccess, setShowSuccess] = useState(false);
      const [message, setMessage] = useState("");
      const [modalType, setModalType] = useState("success");

      const [openReadingDatePic, setOpenReadingDatePic] = useState(false);
      const [readingDate, setReadingDate] = useState(null);
      const [readingDateError, setReadingDateError] = useState("");

    const [readingError, setReadingError] = useState("");
    const [dateError, setDateError] = useState("");
    const [currentReading, setCurrentReading] = useState("");
    const [toDate, setToDate] = useState(dayjs());
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
     const [amountDropdownVisible, setAmountDropdownVisible] = useState(false);
     const [showAddSheet, setShowAddSheet] = useState(false);

       const [showDeleteModal, setShowDeleteModal] = useState(false);
       const [deleteData, setDeleteData] = useState(null);
       const [ showActionMenu, setShowActionMenu] = useState(false)
       const [initialValues, setInitialValues] = useState(null);
   const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
     const dotsRefs = useRef({});
       const today = dayjs();

          const isDisabledReadingDate = (d) => {
         if (!d) return false;
       
         // ❌ future dates disable
         if (d.isAfter(today, "day")) return true;
       
         return false; // ✅ past & today allowed
       };
       
       
          const readingMarkedDates = {};
       
       for (let i = -180; i <= 180; i++) {
         const d = dayjs().add(i, "day");
         const key = d.format("YYYY-MM-DD");
       
         if (isDisabledReadingDate(d)) {
           readingMarkedDates[key] = {
             disabled: true,
             disableTouchEvent: true,
             customStyles: {
               container: {
                 backgroundColor: "#F3F4F6",
                 opacity: 0.4,
                 borderRadius: 8,
               },
               text: {
                 color: "#9CA3AF",
               },
             },
           };
         }
       }
       

      const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");
       const toggleAmountDropdown = () => {
    setAmountDropdownVisible((v) => !v);
  };

    useEffect(() => {
  if (activeHostelId) {
    GetEBRoomReading(activeHostelId);
  }
}, [activeHostelId]);

  useFocusEffect(
  useCallback(() => {
    if (activeHostelId) {
      GetEBTenantReading(activeHostelId);
    }
  }, [activeHostelId])
);


useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      if (showFilter) {
        setShowFilter(false);
        return true;
      }

      if (showAddSheet) {
        closeSheet();
        return true;
      }

      navigation.goBack();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [showFilter, showAddSheet, navigation])
);



//  useEffect(() => {
//   const onBackPress = () => {
//     if (showFilter) {
//       setShowFilter(false);   
//       return true;
//     }

 
//     navigation.navigate("MoreDesign");
//     return true;
//   };

//   const backHandler = BackHandler.addEventListener(
//     "hardwareBackPress",
//     onBackPress
//   );

//   return () => backHandler.remove();
// }, [showFilter]);

useEffect(() => {
  if (hostelElectricityDetails?.hostelReadings?.length > 0) {
    console.log("reading", hostelElectricityDetails);
    
    setCurrentReadingData(hostelElectricityDetails?.hostelReadings[0])
  }
}, [hostelElectricityDetails]);



useEffect(() => {
  setActiveTab("reading"); // ✅ always valid id
}, [hostelBased]);




  // ⭐ Bottom Sheet State


// ⭐ Animated value for swipe sheet
// const translateX = useRef(new Animated.Value(500)).current;

useEffect(() => {
  const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
    const keyboardHeight = e.endCoordinates.height;
    Animated.timing(translateY, {
      toValue: -keyboardHeight + 40, // sheet top visible
      duration: 220,
      useNativeDriver: true,
    }).start();
  });

  const hideSub = Keyboard.addListener("keyboardDidHide", () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);


// ⭐ Animate open
const openSheet = () => {
  setShowAddSheet(true);
  Animated.timing(translateY, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  }).start();
};

// ⭐ Animate close
const closeSheet = () => {

   setReadingDate(null)
   setCurrentReading("")
   setReadingError("")
   setApiError("")
   setReadingDateError("")
   setIsEditMode(false)

  Animated.timing(translateY, {
    toValue: 500,
    duration: 200,
    useNativeDriver: true,
  }).start(() => setShowAddSheet(false));
};

// ⭐ PanResponder (Swipe down)
const panResponderdots = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) {
        closeSheet();
      } else {
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      }
    }
  })
).current;

const hasReading = !!hostelElectricityDetails?.hostelReadings?.[0]?.lastReading;






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
   

//  const tabs = [
//   { key: hostelBased ? "Hostel Reading" : "Room Reading" },
//   { key: "Tenant Reading" },
// ];

const tabs = [
  {
    id: "reading",
    label: hostelBased ? "Hostel Reading" : "Room Reading",
  },
  {
    id: "tenant",
    label: "Tenant Reading",
  },
];


// useEffect(() => {
//   setUnderlineWidth(0);
// }, [activeTab]);





const HostelHeaderCard = ({ data }) => {
  return (
    <View style={styles.hostelHeaderCard}>
      
    <View style={styles.hostelTopRow}>
  {/* LEFT */}
  <View style={styles.hostelInfo}>
    <Image
      source={
        hostelElectricityDetails?.hostelInfo?.hostelImage
          ? { uri: hostelElectricityDetails?.hostelInfo?.hostelImage }
          : require("../../../Assets/Images/PgImg.png")
      }
      style={styles.hostelImage}
    />

    <Text style={styles.hostelTitle}>
      {hostelElectricityDetails?.hostelInfo?.hostelName}
    </Text>
  </View>

  {/* RIGHT */}
  <View style={styles.hostelActions}>
    <TouchableOpacity 
        style={[ styles.addBtn,
      !canWriteElectricity && { opacity: 0.4 }]}
      disabled={!canWriteElectricity}
    onPress={openSheet}>
      <Image source={Add} style={styles.AddPeple} />
      <Text style={styles.addText}>Add</Text>
    </TouchableOpacity>

<TouchableOpacity
  ref={(ref) => (dotsRefs.current["room"] = ref)}
  disabled={!hasReading}
  onPress={() => {
    if (!hasReading || !currentReadingData) return;

    dotsRefs.current["room"]?.measureInWindow((x, y, width, height) => {
      setPopupPosition({ x: x + width, y: y + height });
      setShowActionMenu(true);
    });
  }}
  activeOpacity={hasReading ? 0.6 : 1}
>
  <Image
    source={Dots}
    style={{
      width: 24,
      height: 24,
      tintColor: hasReading ? "#1E45E1" : "#BDBDBD",
      opacity: hasReading ? 1 : 0.4,
      marginLeft: 12,
    }}
  />
</TouchableOpacity>

  </View>
</View>


        <Modal
          transparent
          visible={showActionMenu}
          animationType="fade"
          onRequestClose={() => setShowActionMenu(false)}
        >
          {/* FULL SCREEN OVERLAY */}
          <TouchableWithoutFeedback onPress={() => setShowActionMenu(false)}>
            <View style={styles.popupBackdrop}>
              {/* STOP touch propagation inside popup */}
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.popupBox,
                    {
                      top: popupPosition.y - 10,
                      left: Math.max(10, popupPosition.x - 140),
                    },
                  ]}
                >
                  <TouchableOpacity
                    
                            style={[ styles.popupRow,
      !canUpdateElectricity && { opacity: 0.4 }]}
      disabled={!canUpdateElectricity}
                    onPress={() => {
                      setShowActionMenu(false);
                      handleEditRoomReading(currentReadingData);
                    }}
                  >
                    <Image source={EditIcon} style={styles.popupIcon} />
                    <Text style={styles.popupText}>Edit</Text>
                  </TouchableOpacity>
        
                  <TouchableOpacity 
                    style={[ styles.popupRow, !canDeleteElectricity && { opacity: 0.4 }]}
                    disabled={!canDeleteElectricity}
                    onPress={() => {
                      setShowActionMenu(false);
                      handleDeleteRoomReading(currentReadingData);
                    }}
                  >
                    <Image source={DeleteIcon} style={styles.popupIcon} />
                    <Text style={styles.popupText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

       {showDeleteModal && (
                      <Modal
                        transparent
                        animationType="fade"
                        visible={showDeleteModal}
                        onRequestClose={() => setShowDeleteModal(false)}
                      >
                        <View style={styles.deleteOverlay}>
                          <View style={styles.deleteBox}>
                    
                            <Text style={styles.deleteTitle}>Delete Reading?</Text>
                            <Text style={styles.deleteSub}>
                              Are you sure you want to delete this Reading?
                            </Text>
                    
                            <View style={styles.deleteBtnRow}>
                              <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setShowDeleteModal(false)}
                              >
                                <Text style={styles.cancelText}>Cancel</Text>
                              </TouchableOpacity>
                    
                              <TouchableOpacity
                                style={styles.deleteBtn}
                               onPress={handleConfirmReadingDelete}
                              >
                                <Text style={styles.deleteBtnText}>Delete</Text>
                              </TouchableOpacity>
                            </View>
                    
                          </View>
                        </View>
                      </Modal>
                    )}


      

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Previous</Text>
          <Text style={styles.statValue}>{hostelElectricityDetails?.hostelInfo?.previousEntry}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>{hostelElectricityDetails?.lastReading}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Units</Text>
          <Text style={styles.statValue}>{hostelElectricityDetails?.hostelInfo?.consumption}</Text>
        </View>
      </View>

      {/* BOTTOM */}
      <View style={styles.bottomRow}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
<View style={{ flexDirection: "row", alignItems: "center" }}>
  <Image source={UserProfile} style={styles.peopleIcon} />
  <Text style={styles.badgeText}>
    {hostelElectricityDetails?.hostelInfo?.noOfOccupants || "N/A"}
  </Text>
</View>

          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>📅 {hostelElectricityDetails?.hostelInfo?.billingMonth}</Text>
          </View>
        </View>

        <Text style={styles.totalAmount}>₹ {hostelElectricityDetails?.hostelInfo?.totalAmount || "0"}</Text>
      </View>

    </View>
  );
};



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

const handleSubmit = async () => {
  setReadingError("");
  setReadingDateError("");
  setApiError("");

  let hasError = false;

  if (!readingDate) {
    setReadingDateError("Select Reading Date");
    hasError = true;
  }

  if (!currentReading) {
    setReadingError("Enter Reading");
    hasError = true;
  }

  if (hasError) return;

  if (isEditMode && initialValues) {
    const isReadingChanged =
      Number(currentReading) !== Number(initialValues.reading);

    const isDateChanged =
      !dayjs(readingDate).isSame(initialValues.date, "day");

    if (!isReadingChanged && !isDateChanged) {
      setApiError("No changes detected");
      return; 
    }
  }

  const payload = isEditMode
    ? {
        hostelId: activeHostelId,
        readingId: currentReadingData?.id,
        reading: Number(currentReading),
        entryDate: dayjs(readingDate).format("DD-MM-YYYY"),
      }
    : {
        hostelId: activeHostelId,
        reading: Number(currentReading),
        readingDate: dayjs(readingDate).format("DD-MM-YYYY"),
      };

      console.log("payload", payload);
      

  const res = isEditMode
    ? await UpdateRoomReading(payload)
    : await AddRoomReading(payload);

  if (res?.success) {
    closeSheet();
    GetEBRoomReading(activeHostelId);

    setModalType("success");
    setMessage(isEditMode ? "Updated successfully" : "Added successfully");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);

    setIsEditMode(false);
    setInitialValues(null);
  } else {
    setApiError(res?.message || "Something went wrong");
  }
};






const handleEditRoomReading = (data) => {
  const parsedDate = dayjs(data?.entryDate, "DD/MM/YYYY");

  console.log("date", data);
  

  setIsEditMode(true);
  setCurrentReading(String(data?.lastReading || ""));
  setReadingDate(parsedDate);

  // ⭐ VERY IMPORTANT (baseline)
  setInitialValues({
    reading: Number(data?.lastReading || 0),
    date: parsedDate,
  });

  setCurrentReadingData(data);
  openSheet();
};

console.log("readingdate", currentReadingData);





const handleDeleteRoomReading = (data) => {
  if (!data?.id) return;
  setDeleteData(data);
  setShowDeleteModal(true);
  setShowActionMenu(false);
};


const handleConfirmReadingDelete = async () => {
  const res = await DeleteRoomReading({
    hostelId: activeHostelId,
    readingId: deleteData?.id,
  });

  if (res?.success) {
    setShowDeleteModal(false);
    GetEBRoomReading(activeHostelId);
    setModalType("success");
    setMessage("Deleted successfully");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
  } else {
      setModalType("warning");
      setMessage("something went wrong");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1200);
  }
};




//   const handleConfirmReadingDelete = async () => {
//   const res = await DeleteRoomReading({
//     hostelId: activeHostelId,
//     readingId: deleteData?.readingId,
//   }); 

//   if (res.success) {
//     setShowDeleteModal(false);
//     GetEBRoomReading(activeHostelId);

//     setMessage("Deleted successfully");
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 1200);
//   }
// };


console.log("hostelBased", hostelBased);

if (loading) {
  return <Loader />;
}


if (!canReadElectricity && !loading) {
    return (
       <View style={styles.container}>
       
      <View style={{ alignItems: "center", marginTop: 180 }}>
        
        <Image source={EmptyState} style={{ width: 250, height: 180, }}/>
        <Text style={{ marginTop: 12, fontSize: 16, color: "#888" }}>
          You do not have access to view Electricity
        </Text>
      </View>
      </View>
    )
  }



  return (

    <>
   
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
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
            editable={canReadElectricity}
          />
        </View>
      </View>

      {/* TABS */}
    <View style={styles.tabsRow}>
  {tabs.map((t) => (
    <TouchableOpacity
      key={t.id}
      style={styles.tabBtn}
      onPress={() => setActiveTab(t.id)}
    >
      <Text
        style={[
    styles.tabText,
    activeTab === t.id && styles.tabActive,
  ]}
  onLayout={(e) => {
    setUnderlineWidth(e.nativeEvent.layout.width);
  }}
      >
        {t.label}
      </Text>

      {activeTab === t.id && (
        <View
          style={[
            styles.tabUnderline,
            { width: underlineWidth },
          ]}
        />
      )}
    </TouchableOpacity>
  ))}
</View>


   {activeTab === "reading" && hostelBased && (
      hostelElectricityDetails?.hostelReadings?.length > 0 ? (
  <ScrollView  showsVerticalScrollIndicator={false}
    contentContainerStyle={{
    flexGrow: 1,
    // justifyContent:
    //   !loading && EbRoomReading?.length === 0 ? "center" : "flex-start",
  }}>

    <HostelHeaderCard data={{}} />

    {EbRoomReading.map((item, index) => (
      <View key={index} style={styles.roomRow}>
        <View style={styles.roomLeft}>
          <View style={styles.roomIcon}>
            <Image source={RoomIcon} style={{ width: 18, height: 18 }} />
          </View>

          <View>
            <Text style={styles.roomName}>{item.roomName}</Text>
            <View style={styles.roomMeta}>
              <View style={styles.floorBadge}>
                <Text style={styles.floorText}>{item.floorName}</Text>
              </View>
              <View style={{display:'flex', flexDirection:'row'}}>
                <Image source={ProfileIcon} style={styles.peopleIcon} /> 
                <Text style={styles.peopleText}>{item.noOfTenants}</Text>
                </View>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.roomAmount}>₹ {item.totalPrice}</Text>
          <Text style={styles.roomMonth}>
            {formatApiMonth(item.startDate)}
          </Text>
        </View>
      </View>
    ))}
  </ScrollView> ):

  (
    /* ✅ EMPTY STATE */
    <View style={styles.centerContainer}>
      <Image source={EmptyState} style={styles.image} />
      <Text style={styles.noFloorText}>
        No Electricity Readings Found
      </Text>
          <TouchableOpacity  
           style={[
    {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#EEF2FF",
      paddingHorizontal: 13,
      paddingVertical: 9,
      borderRadius: 8,
      marginTop: 10,
    },
    !canWriteElectricity && { opacity: 0.4 }
  ]}
      disabled={!canWriteElectricity}
  onPress={openSheet}>
      <Image source={Add} style={styles.AddPeple} />
      <Text style={styles.addText}>Add Reading</Text>
    </TouchableOpacity>
    </View>
  )
)}




{activeTab === "reading" && !hostelBased && (
  <ScrollView  showsVerticalScrollIndicator={false}
    contentContainerStyle={{
    flexGrow: 1,
    justifyContent:
      !loading && EbRoomReading?.length === 0 ? "center" : "flex-start",
  }}>
  {!loading && !hostelBased && EbRoomReading?.length > 0 && (
  EbRoomReading.map((item, index) => (
   <TouchableOpacity
  key={index}
  style={styles.row}
  onPress={() => handleClickRoomDetails(item)}
  activeOpacity={0.7}
>

      <View style={styles.iconCircle}>
        <Image source={RoomIcon} style={styles.iconImg} />
      </View>

      <View style={{ flex: 1 }}>
        {/* <TouchableOpacity onPress={() => handleClickRoomDetails(item)}> */}
          <Text style={styles.roomName}>{item.roomName}</Text>
        {/* </TouchableOpacity> */}

        <View style={styles.subRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.floorName}</Text>
          </View>

          <View style={styles.people}>
            <Image source={ProfileIcon} style={styles.peopleIcon} />
            <Text style={styles.peopleText}>{item.noOfTenants ?? 0}</Text>
          </View>
        </View>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.price}>₹ {item.totalPrice ?? 0}</Text>
        <Text style={styles.month}>
          {formatApiMonth(item?.startDate)}
        </Text>
      </View>

    </TouchableOpacity>
  ))
)}

  {/* {
       !loading &&  EbRoomReading && EbRoomReading.length > 0 &&
       (
<TouchableOpacity 
           style={[
            styles.fab,
            !canReadElectricity && { opacity: 0.4 }
          ]}
            disabled={!canReadElectricity}

onPress={() => setShowFilter(true)} accessibilityLabel="Open filters">
        <Image source={FilterIcon} style={styles.fabIcon} />
      </TouchableOpacity>
       )
      } */}

{!loading &&
  (
    (hostelBased && EbRoomReading.length === 0) ||
    (!hostelBased && EbRoomReading?.length === 0)
  ) && (
    <View style={styles.centerContainer}>
      <Image source={EmptyState} style={styles.image} />
      <Text style={styles.noFloorText}>
        No Electricity Readings Found
      </Text>
    </View>
)}


  </ScrollView>
)}

   
      
  {activeTab === "tenant" &&
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



                        {showAddSheet && (
  <View style={styles.sheetOverlay}>
    
    {/* Outside Tap Close */}
    <TouchableOpacity style={styles.overlayTouchable} onPress={closeSheet} />

    {/* Bottom Sheet */}
    <Animated.View
      style={[styles.sheetContainer, { transform: [{ translateY  }] }]}
      {...panResponderdots.panHandlers}
    >
      <View style={styles.sheetHandle} />

      <Text style={styles.sheetTitle}>{isEditMode ? "Edit Hostel Reading" : "Add Hostel Reading"}</Text>
      

      {/* ROOM CARD */}
      {/* <View style={styles.sheetRoomRow}>
        <Image   source={
        hostelElectricityDetails?.hostelInfo?.hostelImage
          ? { uri: hostelElectricityDetails?.hostelInfo?.hostelImage }
          : require("../../../Assets/Images/PgImg.png")
      } style={styles.sheetRoomIcon} />
        <View>
          <Text style={styles.sheetRoomName}> {hostelElectricityDetails?.hostelInfo?.hostelName}</Text>
        </View>

        <View style={{ marginLeft: "auto" }}>
          <Text style={styles.sheetDateLabel}>Date</Text>
          <Text style={styles.sheetDateValue}>{dayjs().format("DD-MM-YYYY")}</Text>
        </View>
      </View> */}

  
   
 <Text style={styles.sheetLabel}>
  Reading Date <Text style={{ color: "red" }}>*</Text>
</Text>

<View style={styles.dateInputWrapper}>
  <TextInput
    style={styles.dateInput}
    placeholder="DD-MM-YYYY"
    // value={readingDate ? dayjs(readingDate).format("DD-MM-YYYY") : ""}
    value={readingDate ? readingDate.format("DD-MM-YYYY") : ""}
    editable={false}
    pointerEvents="none"
  />

  <TouchableOpacity
    style={styles.calendarIconWrapper}
    onPress={() => setOpenReadingDatePic(true)}
  >
    <Image
      source={require("../../../Assets/Images/calendar.png")}
      style={styles.calendarIcon}
    />
  </TouchableOpacity>
</View>

{readingDateError && (
  <ErrorMessage message={readingDateError} type="error" />
)}




{openReadingDatePic && (
  <View style={styles.dateOverlay}>
    <TouchableWithoutFeedback onPress={() => setOpenReadingDatePic(false)}>
      <View style={styles.overlayBg} />
    </TouchableWithoutFeedback>

    <View style={styles.calendarContainer}>
      <Calendar
        markingType="custom"
        markedDates={readingMarkedDates}
       

        current={
  readingDate
    ? readingDate.format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD")
}

        onDayPress={(day) => {
          if (readingMarkedDates[day.dateString]?.disabled) return;
          setReadingDate(dayjs(day.dateString, "YYYY-MM-DD")); 
          setOpenReadingDatePic(false);
          setReadingDateError("");
          setApiError("");
        }}
        theme={{
          todayTextColor: "#2563EB",
          selectedDayBackgroundColor: "#2563EB",
          selectedDayTextColor: "#FFFFFF",
          textDisabledColor: "#9CA3AF",
          arrowColor: "#111827",
        }}
      />
    </View>
  </View>
)}




<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop:10 }}>
  <Text style={styles.sheetLabel}>Current Reading <Text style={{ color: "red" }}>*</Text></Text>

  <TouchableOpacity>
    <Text style={styles.lastReading}>Last Reading :{currentReadingData?.lastReading ?? "--"}</Text>
  </TouchableOpacity>
</View>

{/* Input */}
<TextInput
  placeholder="0"
  style={styles.sheetInput}
  keyboardType="numeric"
  value={currentReading}
  onChangeText={(text) => {
    setCurrentReading(text);
    setReadingError("");
    setApiError("");
  }}
/>

{readingError && (
  <ErrorMessage message={readingError} type="error" />
)}

{apiError && (
  <ErrorMessage message={apiError} type="error" />
)}



      {/* Buttons */}
      <View style={styles.sheetBtnRow}>
        <TouchableOpacity style={styles.sheetCancel} onPress={closeSheet}>
          <Text style={styles.sheetCancelTxt}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sheetAdd} onPress={handleSubmit}>
          <Text style={styles.sheetAddTxt}>  {isEditMode ? "Update" : "Add"}</Text>
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
  container: { flex: 1, backgroundColor: "#fff", padding: 15, paddingTop: Platform.OS === "android"
  ? StatusBar.currentHeight + 10
  : 70 },

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
overlayTouchable: {
  ...StyleSheet.absoluteFillObject,
},

sheetContainer: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
 paddingBottom: 20,
},

sheetHandle: {
  width: 50,
  height: 5,
  backgroundColor: "#ccc",
  borderRadius: 3,
  alignSelf: "center",
  marginBottom: 15,
},

sheetTitle: {
  fontSize: 20,
 fontFamily: "Gilroy-Bold" ,
  marginBottom: 20,
  color: "#000",
},


sheetRoomRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 25,
},

sheetRoomIcon: { width: 40, height: 40, marginRight: 12 },

sheetRoomName: { fontSize: 16, fontFamily: "Gilroy-Bold" ,},
sheetFloor: { color: "#777", marginTop: 3 },

sheetDateLabel: { color: "#555", fontSize: 12 },
sheetDateValue: { fontSize: 14, fontFamily: "Gilroy-Bold" , color: "#000" },

sheetLabel: {
  fontSize: 14,
  fontFamily: "Gilroy-Semibold" ,
  color: "#000",
  marginBottom: 8,
},

sheetReadingRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 30,
},

sheetInput: {
  borderWidth: 1,
  borderColor: "#DADADA",
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 16,
  color: "#000",
  marginTop: 6,
  backgroundColor: "#fff",
},


  
datePickerBox: {
    backgroundColor: "#fff",
    width: "80%",
    borderColor: "#DCDCDC",
    borderRadius: 30,
    padding: 5,
    marginBottom: 100,
    borderWidth: 0.5,
  },

  dateInputWrapper: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  height: 48,
  paddingHorizontal: 12,
  marginTop: 6,
},

dateInput: {
  flex: 1,
  fontSize: 14,
  color: "#111827",
},

calendarIconWrapper: {
  padding: 6,
},

calendarIcon: {
  width: 20,
  height: 20,
  tintColor: "#6B7280",
},

lastReading: { color: "#1E45E1", fontFamily: "Gilroy-Semibold" ,},

sheetBtnRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop:20
},

sheetCancel: {
  width: "48%",
  paddingVertical: 12,
  borderWidth: 1,
  borderRadius: 10,
  borderColor: "#ccc",
  alignItems: "center",
},

sheetAdd: {
  width: "48%",
  backgroundColor: "#1E45E1",
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: "center",
},

sheetCancelTxt: { color: "#000", fontSize: 16,  fontFamily: "Gilroy-Semibold" ,},
sheetAddTxt: { color: "#fff", fontSize: 16, fontFamily: "Gilroy-Bold" ,},
readingRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",   // ⭐ VERY IMPORTANT — aligns last reading to top
  marginTop: 8,
},

readingInput: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#D8D8D8",
  borderRadius: 10,
  padding: 12,
  fontSize: 16,
  color: "#000",
  marginRight: 10,             // space between input & last reading
},

lastReadingText: {
  fontSize: 14,
  color: "#1E45E1",
   fontFamily: "Gilroy-Semibold" ,
  marginTop: 4,                // aligns exactly like Figma
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
     fontFamily: "Gilroy-Semibold" ,
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


  hostelCard: {
  flexDirection: "row",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 14,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  alignItems: "center",
},
hostelIcon: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#EEF2FF",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,
},
hostelName: {
  fontSize: 16,
  fontFamily: "Gilroy-Bold" ,
  marginBottom: 6,
},
hostelStatsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
},
statLabel: {
  fontSize: 12,
  color: "#6B7280",
},
statValue: {
  fontSize: 14,
   fontFamily: "Gilroy-Semibold" ,
},
amountBox: {
  backgroundColor: "#FFF6E5",
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 12,
  alignItems: "center",
},
amountLabel: {
  fontSize: 12,
  color: "#6B7280",
},
amountValue: {
  fontSize: 16,
  fontFamily: "Gilroy-Bold" ,
},

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

  roomName: { fontSize: 16, fontFamily: "Gilroy-Bold" ,color: "#000" },

  subRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },

  tag: {
    backgroundColor: "#FFF4D7",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 12,
  },

  tagText: { fontSize: 12,  fontFamily: "Gilroy-Semibold" , color: "#A47E00" },

  people: { flexDirection: "row", alignItems: "center" },
  // peopleIcon: { width: 16, height: 16},
  peopleText: { marginLeft: 3, color: "#3D6AE8",  fontFamily: "Gilroy-Semibold" , },

  price: { fontSize: 16, fontFamily: "Gilroy-Bold" , color: "#000" },
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
  filterTitle: { fontSize: 20, fontFamily: "Gilroy-Bold" ,},
  resetTextSmall: { color: "#2D6CDF",  fontFamily: "Gilroy-Semibold" ,},
  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  quickBtn: { width: "32%", paddingVertical: 12, borderRadius: 12, backgroundColor: "#F5F6FA", alignItems: "center" },
  quickText: { color: "#111",  fontFamily: "Gilroy-Semibold" ,},
  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 72 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontFamily: "Gilroy-Bold" ,},applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontFamily: "Gilroy-Bold" ,},
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

  hostelHeaderCard: {
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 16,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: "#EEE",
},

hostelTopRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

hostelInfo: {
  flexDirection: "row",
  alignItems: "center",
  flex: 1,              // ⭐ IMPORTANT
  marginRight: 10,
},


hostelImage: {
  width: 36,
  height: 36,
  borderRadius: 8,
  marginRight: 10,
},

hostelTitle: {
  fontSize: 16,
  fontFamily: "Gilroy-Bold" ,
  flexShrink: 1,       
  flexWrap: "wrap",
},
hostelActions: {
  flexDirection: "row",
  alignItems: "center",
  marginLeft: 8,
},
addBtn: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#EEF2FF",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 8,
},

addText: {
  color: "#1E45E1",
  fontFamily: "Gilroy-Bold" ,
  fontSize: 13,
},


menuDots: {
  fontSize: 22,
  color: "#777",
},

statsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 14,
},

statBox: {
  alignItems: "center",
  flex: 1,
},

statLabel: {
  fontSize: 12,
  color: "#777",
},

statValue: {
  fontSize: 15,
  fontFamily: "Gilroy-Bold" ,
  marginTop: 4,
},

bottomRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 14,
},

badgeRow: {
  flexDirection: "row",
},

badge: {
  backgroundColor: "#F4F6FF",
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 8,
  marginRight: 8,
},

badgeText: {
  fontSize: 12,
   fontFamily: "Gilroy-Semibold" ,
  color: "#333",
},

totalAmount: {
  fontSize: 18,
  fontWeight: "800",
},

/* ROOM LIST */
roomRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderColor: "#F0F0F0",
},

roomLeft: {
  flexDirection: "row",
},

roomIcon: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#EEF3FF",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
},

roomName: {
  fontSize: 15,
  fontFamily: "Gilroy-Bold" ,
},

roomMeta: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4,
},

floorBadge: {
  backgroundColor: "#FFF1C1",
  borderRadius: 6,
  paddingHorizontal: 6,
  marginRight: 8,
},

floorText: {
  fontSize: 11,
   fontFamily: "Gilroy-Semibold" ,
  color: "#8A6A00",
},

roomAmount: {
  fontSize: 15,
  fontFamily: "Gilroy-Bold" ,
},

roomMonth: {
  fontSize: 12,
  color: "#777",
  marginTop: 2,
   fontFamily: "Gilroy-Semibold" ,
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
  fontFamily: "Gilroy-Bold" ,
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
   fontFamily: "Gilroy-Semibold" ,
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
   fontFamily: "Gilroy-Semibold" ,
  color: "#fff",
}, 


 popupOverlay: {
  position: "absolute",
  top: 10,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "transparent",
},


popupBackdrop: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.25)", 
},

popupBox: {
  position: "absolute",
  width: 140,
  backgroundColor: "#fff",
  borderRadius: 12,
  elevation: 20,
  paddingVertical: 8,
},

// popupBox: {
//   position: "absolute",
//   width: 120,
//   backgroundColor: "#fff",
//   borderRadius: 12,
//   elevation: 20,
//   paddingVertical: 10,
//   zIndex: 10000,
// },

  popupRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 12,
},

popupIcon: {
  width: 20,
  height: 20,
  marginRight: 10,
},

popupText: {
  fontSize: 14,
  color: "#333",
},
peopleBox: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFF3D6",
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 10,
},


peopleIcon: {
  width: 14,
  height: 14,
  marginRight: 6,
},



AddPeple:{
 width: 12,
  height: 12,
  marginRight: 8,
},

// peopleText: {
//   fontSize: 14,
//   color: "#8A5A00",
//   fontWeight: "600",
// },

dateOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
},

overlayBg: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0,0,0,0.3)",
},

calendarContainer: {
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 10,
  width: "85%",
  elevation: 10,
},
actionPopup: {
  position: "absolute",
  top: 60,
  right: 10,
  backgroundColor: "#F9F9F9",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#EBEBEB",
  width: 130,
  zIndex: 999,
},

actionItem: {
  paddingVertical: 10,
  paddingHorizontal: 14,
},

editText: {
  fontSize: 14,
   fontFamily: "Gilroy-Semibold" ,
  color: "#1E45E1",
},


});
