import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView, Modal,
  Animated, PanResponder, TextInput, BackHandler, TouchableWithoutFeedback, Keyboard,
  FlatList
} from "react-native";
import { ElectricityContext } from "../../../Context/ElectricityContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useHasPermission } from "../../../Utils/useHasPermission";
import AddRoomReadingForm from "./AddRoomReading"
import Loader from "../../../Component/Loader/Loader"
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import customParseFormat from "dayjs/plugin/customParseFormat";
import SuccessModal from "../../../ToastFile/ToastPage";
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";
import ProfileIcon from "../../../Assets/Images/profile.png";
import FilterIcon from "../../../Assets/Images/filter.png";
import UserProfile from "../../../Assets/Images/profileElec.png";
import calendarCheck from "../../../Assets/Images/calendarcheck.png";
import Add from "../../../Assets/Images/ElectricityAdd.png";
import DeleteIcon from "../../../Assets/Images/trash.png"
import EditIcon from "../../../Assets/Images/editIcon.png"
import Dots from "../../../Assets/Images/3dots.png";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import BedIcon from "../../../Assets/Images/Bed_Icon.png"
import ResetEBAmount from "./ResetEBAmount"
import ResetIcon from "../../../Assets/Images/recheckinIcon.png"

export default function RoomDetails({ route, navigation }) {
  const { activeHostelId } = useContext(CommonContexts);
  const { EbRoomReading,
    EbTenantReading,
    loading,
    error,
    errorMsg,
    GetEBRoomReading,
    GetEBTenantReading,
    ParticularRoomReadingDetails, particular_EbRoomReading,
    AddRoomReading, UpdateRoomReading,
    DeleteRoomReading, } = useContext(ElectricityContext);

  const { roomData } = route.params || {};

  console.log("particular_EbRoomReading", particular_EbRoomReading);
  console.log("EbRoomReading", EbRoomReading);
 


  const {
    canWriteModule: canWriteElectricity,
    canReadModule: canReadElectricity,
    canUpdateModule: canUpdateElectricity,
    canDeleteModule: canDeleteElectricity,
  } = useHasPermission("Electricity");

  //    const currentReadingData =
  // particular_EbRoomReading?.readings?.[0] ?? null;

  const currentReadingData =
    particular_EbRoomReading?.readings?.length > 0
      ? particular_EbRoomReading.readings[
      particular_EbRoomReading.readings.length - 1
      ]
      : null;

  console.log("currentreading", roomData);

  const matchedRoomData = useMemo(() => {
    if (!Array.isArray(EbRoomReading) || EbRoomReading.length === 0 || !roomData) {
      return null;
    }

    return EbRoomReading.find(
      (item) =>
        item.hostelId === roomData.hostelId &&
        item.floorId === roomData.floorId &&
        item.roomId === roomData.roomId
    );
  }, [EbRoomReading, roomData]);


  console.log("matchedRoom:", matchedRoomData);




  const [activeTab, setActiveTab] = useState("Previous Reading");
  const [underlineWidth, setUnderlineWidth] = useState(0);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editReadingData, setEditReadingData] = useState(null);


  dayjs.extend(customParseFormat);

  console.log("roomData", roomData);

  const [readings, setReadings] = useState([])
  const [occupants, setOccupants] = useState([])
  const [openReadingDatePic, setOpenReadingDatePic] = useState(false);
  const [readingDate, setReadingDate] = useState(null);
  const [readingDateError, setReadingDateError] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [currentReading, setCurrentReading] = useState("");
  const [readingError, setReadingError] = useState("");
  const [apiError, setApiError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false)
  const [initialValues, setInitialValues] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const dotsRefs = useRef({});
  const today = dayjs();
  const [showResetEbSheet,setShowResetEbSheet]=useState(false)
  

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




  useEffect(() => {
    if (particular_EbRoomReading?.readings?.length > 0) {
      setReadings(particular_EbRoomReading?.readings)
    }else{
      setReadings("")
    }
  }, [particular_EbRoomReading])

  useEffect(() => {
    if (particular_EbRoomReading?.customers?.length > 0) {
      setOccupants(particular_EbRoomReading?.customers)
    }else{
      setOccupants("")
    }
  }, [particular_EbRoomReading])



  // ⭐ Bottom Sheet State
  const [showAddSheet, setShowAddSheet] = useState(false);

  // ⭐ Animated value for swipe sheet
  const translateY = useRef(new Animated.Value(500)).current;

  // ⭐ Animate open
  const openSheet = () => {
    setShowAddSheet(true);
    setIsEditMode(false);
    setCurrentReading("");
    setReadingDate(null);
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
    setIsEditMode(false);

    Animated.timing(translateY, {
      toValue: 500,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowAddSheet(false));
  };

  // ⭐ PanResponder (Swipe down)
  const panResponder = useRef(
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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (openReadingDatePic) {
          setOpenReadingDatePic(false);
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
    }, [openReadingDatePic, showAddSheet])
  );

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height + 60,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);


  // const handleEditRoomReading = (data) => {
  //   if (!data) return;

  //   setIsEditMode(true);
  //   setEditReadingData(data);

  //   setInitialValues({
  //     reading: data.reading,
  //     date: data.entryDate,
  //   });

  //   setCurrentReading(String(data.reading));

  //   setReadingDate(
  //     dayjs(data.entryDate, ["DD/MM/YYYY", "DD-MM-YYYY"]).format("YYYY-MM-DD")
  //   );

  //   openSheet();
  // };

  const [showSheet, setShowSheet] = useState(false);
  // const [isEditMode, setIsEditMode] = useState(false);
  // const [currentReading, setCurrentReading] = useState("");
  // const [readingDate, setReadingDate] = useState(null);


  const openAdd = () => {
    setIsEditMode(false);
    setCurrentReading("");
    setReadingDate(null);
    setShowSheet(true);
  };


  const handleEditRoomReading = (data) => {
    // setIsEditMode(true);
    // setCurrentReading(String(data.currentReading));
    // setReadingDate(data.entryDate);

    setIsEditMode(true);
    setEditReadingData(matchedRoomData);

    console.log("editdata", data);


    setInitialValues({
      reading: matchedRoomData?.currentReading,
      date: matchedRoomData.entryDate,
    });

    setCurrentReading(String(matchedRoomData?.currentReading));

    setReadingDate(
      dayjs(matchedRoomData.entryDate, ["DD/MM/YYYY", "DD-MM-YYYY"]).format("YYYY-MM-DD")
    );

    setShowAddSheet(true);
  };



  // const handleEditRoomReading = (data) => {
  //   if (!data?.ebId) {
  //     console.log("Edit failed  invalid reading", data);
  //     return;
  //   }

  //   setIsEditMode(true);
  //   setEditReadingData(matchedRoomData);

  //   console.log("editdata", data);


  //   setInitialValues({
  //     reading: matchedRoomData?.currentReading,
  //     date: matchedRoomData.entryDate,
  //   });

  //   setCurrentReading(String(matchedRoomData?.currentReading));

  //   setReadingDate(
  //     dayjs(matchedRoomData.entryDate, ["DD/MM/YYYY", "DD-MM-YYYY"]).format("YYYY-MM-DD")
  //   );

  //   openSheet();
  // };








  // const hasReading =
  //   roomData?.currentReading !== null &&
  //   roomData?.currentReading !== undefined &&
  //   Number(roomData.currentReading) > 0;

  const hasReading =
    particular_EbRoomReading?.readings?.length > 0;




  const formatApiMonth = (date) => {
    if (!date || date === "N/A") return "--";

    return dayjs(date, ["DD/MM/YYYY", "D/MM/YYYY", "DD-MM-YYYY"])
      .format("MMMM YYYY");
  };

  const handleSubmit = async () => {
    let hasError = false;

    setReadingError("");
    setReadingDateError("");
    setApiError("");

    if (!readingDate) {
      setReadingDateError("Please Select Reading Date");
      hasError = true;
    }

    if (!currentReading || Number(currentReading) <= 0) {
      setReadingError("Please Enter Valid Current Reading");
      hasError = true;
    }

    if (isEditMode && initialValues) {
      const isReadingChanged =
        Number(currentReading) !== Number(initialValues.reading);

      const isDateChanged = !dayjs(readingDate).isSame(
        dayjs(initialValues.date, ["DD/MM/YYYY", "DD-MM-YYYY"]),
        "day"
      );

      if (!isReadingChanged && !isDateChanged) {
        setApiError("No changes detected");
        return;
      }
    }


    if (hasError) return;

    const payload = {
      hostelId: activeHostelId,
      reading: Number(currentReading),
      readingDate: dayjs(readingDate).format("DD-MM-YYYY"),
      roomId: roomData?.roomId,
      floorId: roomData?.floorId,
      readingId: editReadingData?.ebId,
    };

    const res = isEditMode
      ? await UpdateRoomReading(payload)
      : await AddRoomReading(payload);

    console.log("res", res);


    if (res.success) {
      GetEBRoomReading(activeHostelId);
      ParticularRoomReadingDetails(activeHostelId, roomData?.roomId);

      setModalType("success");
      setMessage(isEditMode ? "Reading Updated" : "Reading Added");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        closeSheet();
        setIsEditMode(false);
        setEditReadingData(null);
        setCurrentReading("");
        setReadingDate(null);
      }, 800);
    } else {
      setApiError(res.message || "Something went wrong");
    }
  };

  // const handleDeleteRoomReading = (data) => {
  //   if (!data?.readingId) return;

  //   setDeleteData(data);
  //   setShowDeleteModal(true);
  //   setShowActionMenu(false);
  // };


  const handleDeleteRoomReading = (data) => {

    console.log("deletedata", data);
    console.log("deletedata", matchedRoomData);

    if (!data) {
      console.log("Invalid delete data", data);
      return;
    }

    setDeleteData(data);
    setShowDeleteModal(true);
    setShowActionMenu(false);
  };


  console.log("deleteData", deleteData);

  const formatDateRange = (start, end) => {
  if (!start) return "--";

  const startDate = dayjs(start, ["DD/MM/YYYY", "DD-MM-YYYY"]);
  const endDate = end
    ? dayjs(end, ["DD/MM/YYYY", "DD-MM-YYYY"])
    : null;

  // If no end date → show single date
  if (!endDate) {
    return startDate.format("DD MMM");
  }

  // Same day
  if (startDate.isSame(endDate, "day")) {
    return startDate.format("DD MMM");
  }

  // Same month
  if (
    startDate.month() === endDate.month() &&
    startDate.year() === endDate.year()
  ) {
    return `${startDate.format("DD")} - ${endDate.format("DD")} ${endDate.format("MMMM")}`;
  }

  // Different month
  return `${startDate.format("DD MMM")} - ${endDate.format("DD MMM")}`;
};


  const handleConfirmReadingDelete = async () => {
    const res = await DeleteRoomReading({
      hostelId: activeHostelId,
      // readingId: deleteData?.ebId,
      readingId: deleteData?.readingId || deleteData?.ebId,

    })
    console.log("res", res);


    if (res.success) {
      setShowDeleteModal(false);
      GetEBRoomReading(activeHostelId);
      ParticularRoomReadingDetails(activeHostelId, roomData?.roomId);

      setModalType("success");
      setMessage("Deleted successfully");
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 1200);
    }
    else {
      console.log("res", res.message);
      setModalType("warning");
      setMessage(res?.message || "something went wrong");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1200);
    }
  }

  console.log("roomRed",EbRoomReading)


  //  const handleSubmit = async () => {
  //   let hasError = false;

  //   setReadingError("");
  //   setReadingDateError("");
  //   setApiError("");

  //   if (!readingDate) {
  //     setReadingDateError("Please Select Reading Date");
  //     hasError = true;
  //   }

  //   if (!currentReading || Number(currentReading) <= 0) {
  //     setReadingError("Please Enter Valid Current Reading");
  //     hasError = true;
  //   }

  //   if (hasError) return;

  //   const payload = {
  //     hostelId: activeHostelId,
  //     reading: Number(currentReading),
  //     readingDate: dayjs(readingDate).format("DD-MM-YYYY"),
  //     roomId: roomData?.roomId,
  //     floorId: roomData?.floorId,
  //   };

  //   const res = await AddRoomReading(payload);

  //   console.log("response", res);


  //   if (res.success) {
  //     ParticularRoomReadingDetails(activeHostelId, roomData?.roomId);
  //     setModalType("success");
  //     setMessage(res.data || "Reading Added successfully");
  //     setShowSuccess(true);

  //     setTimeout(() => {
  //       setShowSuccess(false);
  //       closeSheet();
  //       setCurrentReading("");
  //       setReadingDate(null);
  //     }, 800);
  //   } else {

  //     setApiError(res.message || "Something went wrong");
  //   }
  // };


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
  // setModalType("success");
  // setMessage(res.data || "Reading added successfully");
  // setShowSuccess(true);

  // setTimeout(() => {
  //    setShowSuccess(false);
  // }, 1000);
  //     setCurrentReading("");
  //     setReadingDate(null);
  //   } else {
  //     Alert.alert("Error", res.message || "Something went wrong");
  //   }
  // };
  console.log("binthu",occupants,readings)


  return (
    <>
      {loading && <Loader />}
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={BackIcon} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Room Overview</Text>
        </View>

        {/* Room Card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconCircle}>
              <Image source={RoomIcon} style={styles.iconImg} />
            </View>

            <View>
              <Text style={styles.roomName}> {roomData?.roomName}</Text>
              <Text style={styles.floorText}>{roomData?.floorName}</Text>
            </View>

            <TouchableOpacity
              style={[styles.addBtn,
              !canWriteElectricity && { opacity: 0.4 }]}
              disabled={!canWriteElectricity}
              onPress={openSheet}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={Add} style={styles.AddPeple} />
                <Text style={styles.addText}>Add</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              ref={(ref) => (dotsRefs.current["room"] = ref)}
              disabled={!hasReading}
              // onPress={() => {
              //   dotsRefs.current["room"]?.measureInWindow((x, y, width, height) => {
              //     setPopupPosition({
              //       x: x + width,
              //       y: y + height,
              //     });
              //     setShowActionMenu(true);
              //   });
              // }}

              onPress={() => {
                if (!hasReading || !currentReadingData) return;

                dotsRefs.current["room"]?.measureInWindow((x, y, width, height) => {
                  setPopupPosition({
                    x: x + width,
                    y: y + height,
                  });
                  setShowActionMenu(true);
                });
              }}

              activeOpacity={hasReading ? 0.6 : 1}
            >
              <Image
                source={Dots}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: hasReading ? "#1E45E1" : "#BDBDBD",
                  opacity: hasReading ? 1 : 0.4,
                  marginLeft: 20,
                }}
              />
            </TouchableOpacity>

           

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
                        // style={styles.popupRow}
                        style={[styles.popupRow,
                        !canUpdateElectricity && { opacity: 0.4 }]}
                        disabled={!canUpdateElectricity}
                        onPress={() => {
                          setShowActionMenu(false);
                          setShowResetEbSheet(true)
                        }}
                      >
                        <Image source={ResetIcon} style={[styles.popupIcon,{tintColor:'#1E45E1'}]} />
                        <Text style={styles.popupText}>Reset EB</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        // style={styles.popupRow}
                        style={[styles.popupRow,
                        !canUpdateElectricity && { opacity: 0.4 }]}
                        disabled={!canUpdateElectricity}
                        onPress={() => {
                          setShowActionMenu(false);
                          handleEditRoomReading(matchedRoomData);
                        }}
                      >
                        <Image source={EditIcon} style={styles.popupIcon} />
                        <Text style={styles.popupText}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        // style={styles.popupRow}
                        style={[styles.popupRow,
                        !canDeleteElectricity && { opacity: 0.4 }]}
                        disabled={!canDeleteElectricity}
                        onPress={() => {
                          setShowActionMenu(false);
                          handleDeleteRoomReading(matchedRoomData);
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


            {/* {showActionMenu && (
  <TouchableOpacity
    activeOpacity={1}
    onPress={() => setShowActionMenu(false)}
    style={styles.popupOverlay}
  >
    <View
      style={[
        styles.popupBox,
        { top: popupPosition.y - 120, left: popupPosition.x - 180 },
      ]}
    >
 

      <TouchableOpacity style={styles.popupRow}    onPress={() => handleEditRoomReading(roomData)}>
           <Image  source={EditIcon} style={styles.popupIcon}/>
        <Text style={styles.popupText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.popupRow}
  onPress={() => handleDeleteRoomReading(roomData)}
    
      >
           <Image  source={DeleteIcon} style={styles.popupIcon}/>
        <Text style={styles.popupText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
)} */}

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








          </View>

           <View style={{height:1,backgroundColor:'#EFEFEF',marginTop:8,marginBottom:8}}/>

          <View style={styles.detailsRow}>
            <View>
              <Text style={styles.label}>Previous</Text>
              <Text style={styles.value}>{matchedRoomData?.previousReading}</Text>
            </View>

            <View>
              <Text style={styles.label}>Current</Text>
              <Text style={styles.value}>{matchedRoomData?.currentReading}</Text>
            </View>

            <View>
              <Text style={styles.label}>Total Units</Text>
              <Text style={styles.value}>{matchedRoomData?.consumption}</Text>
            </View>


          </View>
          <View style={styles.detailsRow}>




            {/* Middle : People Count + Month */}
            <View style={styles.middleBoxRow}>

              {/* People Count box */}
              <View style={styles.peopleBox}>
                <Image source={UserProfile} style={styles.peopleIcon} />
                <Text style={styles.peopleText}>{matchedRoomData?.noOfTenants}</Text>
              </View>

              {/* Month Box */}
              <View style={styles.monthBox}>
                <Image source={calendarCheck} style={styles.calendarIcon} />
                <Text style={styles.monthText}> {formatApiMonth(matchedRoomData?.entryDate)}</Text>
                {/* <Text style={styles.date}>
  {formatDateRange(matchedRoomData?.startDate, matchedRoomData?.endDate)}
</Text> */}
              </View>

            </View>


            <View>
              <Text style={styles.value}>₹ {matchedRoomData?.totalPrice}</Text>
            </View>
          </View>

        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {["Previous Reading", "Occupants"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabBtn}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabActive,
                ]}
                onLayout={(event) => {
                  if (activeTab === tab) {
                    setUnderlineWidth(event.nativeEvent.layout.width);
                  }
                }}
              >
                {tab}
              </Text>

              {activeTab === tab && (
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



          {/* ===== PREVIOUS READING TAB ===== */}
          {activeTab === "Previous Reading" && (
            <>
              {readings && readings.length > 0 ? (
                <FlatList
                  data={readings}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <View key={index} style={styles.listRow}>
                      <View style={styles.arrowCircle}>
                        <Text style={{ color: "#3F6AFF" }}>➤</Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.monthText}>{formatApiMonth(item?.entryDate)}</Text>
                        <View style={styles.unitTag}>
                          <Text style={styles.unitText}>
                            {item?.consumption} Units
                          </Text>
                        </View>
                      </View>

                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.price}>
                          ₹ {item?.amount ?? 0}
                        </Text>
                       <Text style={styles.date}>
  {formatDateRange(item?.startDate, item?.endDate)}
</Text>
                      </View>
                    </View>
                  )} />
              ) : (
                activeTab === "Previous Reading" && (
                  <View style={styles.centerContainer}>
                    <Image source={EmptyState} style={styles.image} />
                    <Text style={styles.noFloorText}>No Room Reading Found!</Text>
                  </View>
                )

              )}
            </>
          )}


          {/* ===== OCCUPANTS TAB ===== */}
          {activeTab === "Occupants" && (
            occupants && occupants.length > 0 ? (
              <FlatList
                data={occupants} 
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom:120}}
                renderItem={({ item, index }) =>
                (

                  <View key={index} style={styles.listRow}>
                    {/* <Image source={ProfileIcon} style={styles.avatar} /> */}
                    <View>
                    {item?.profilePic ? <Image source={{uri:item?.profilePic}} style={styles.avatar} /> : 
                      <View style={[styles.avatar,{alignItems:'center',justifyContent:'center',backgroundColor:'#e6e7eb'}]}>
                        <Text style={{fontSize:16,fontFamily:'Gilroy-Bold'}}>{item?.initials}</Text>
                      </View>}
                      </View>

                    <View style={{ flex: 1, paddingLeft: 10 }}>
                      <Text style={styles.monthText}>{item?.fullName}</Text>

                      <View style={styles.occRow}>
                        <Image source={BedIcon} style={styles.smallIcon} />
                        <Text style={styles.bedText}>{item?.bedName}</Text>

                        <View style={styles.unitTag2}>
                          <Text style={styles.unitText}>{item?.totalUnits} Units</Text>
                        </View>
                      </View>
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.price}>₹ {item?.totalAmount}</Text>
                      {/* <Text style={styles.date}>{item?.billingDate}</Text> */}
                      <Text style={styles.date}>
                  {formatDateRange(item?.startDate || item?.billingDate, item?.endDate)}
                  </Text>
                    </View>
                  </View>
                )} />
            ) : (

              <View style={styles.centerContainer}>
                <Image source={EmptyState} style={styles.image} />
                <Text style={styles.noFloorText}> No Occupants Found!</Text>


              </View>
            )
          )}



        {/* <TouchableOpacity
          style={[styles.fab,
          !canReadElectricity && { opacity: 0.4 }]}
          disabled={!canReadElectricity}
        >
          <Image source={FilterIcon} style={styles.fabIcon} />
        </TouchableOpacity> */}
      </View>


      {/* {showAddSheet && (
  <View style={styles.sheetOverlay}>
    
    <TouchableOpacity style={styles.overlayTouchable} onPress={closeSheet} />

    <Animated.View
      style={[styles.sheetContainer, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.sheetHandle} />

      <Text style={styles.sheetTitle}>{isEditMode ? "Edit Room Reading" : "Add Room Reading"}</Text>
      

      <View style={styles.sheetRoomRow}>
        <Image source={RoomIcon} style={styles.sheetRoomIcon} />
        <View>
          <Text style={styles.sheetRoomName}>{particular_EbRoomReading?.roomInfo?.roomName}</Text>
          <Text style={styles.sheetFloor}>{particular_EbRoomReading?.roomInfo?.floorName}</Text>
        </View>

       
      </View>

  
   
 <Text style={styles.sheetLabel}>
  Reading Date <Text style={{ color: "red" }}>*</Text>
</Text>

<View style={styles.dateInputWrapper}>
  <TextInput
    style={styles.dateInput}
    placeholder="DD-MM-YYYY"
    value={readingDate ? dayjs(readingDate).format("DD-MM-YYYY") : ""}
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
            ? dayjs(readingDate).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD")
        }
        onDayPress={(day) => {
          if (readingMarkedDates[day.dateString]?.disabled) return;

          setReadingDate(day.dateString);
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
    <Text style={styles.lastReading}>Last Reading : {roomData?.currentReading} </Text>
  </TouchableOpacity>
</View>

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
)} */}

      <AddRoomReadingForm
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        isEditMode={isEditMode}
        roomInfo={{
          roomName: roomData?.roomName,
          floorName: roomData?.floorName,
        }}
        reading={currentReading}
        setReading={setCurrentReading}
        readingDate={readingDate}
        setReadingDate={setReadingDate}
        readingError={readingError}
        dateError={readingDateError}
        apiError={apiError}
        setApiError={setApiError}
        initialValues={matchedRoomData}
      />

      <ResetEBAmount
       visible={showResetEbSheet}
       onClose={()=>setShowResetEbSheet(false)}
       roomInfo={roomData}/> 

    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15, paddingTop: 45, fontFamily: 'Gilroy-Semibold' },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backIcon: { width: 22, height: 22, marginRight: 10 },
  title: { fontSize: 18, fontWeight: "700" },

  card: {
    backgroundColor: "#F8F9FF",
    padding: 15,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardRow: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: "#E9F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconImg: { width: 26, height: 26, tintColor: "#3F6AFF" },

  roomName: { fontSize: 16, fontWeight: "700" },
  floorText: { fontSize: 12, color: "#666", marginTop: 4 },

  addBtn: {
    backgroundColor: "#E4E4E4",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: "auto",
  },
  addText: { color: "#4B4B4B", fontWeight: "600" },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  label: { fontSize: 12, color: "#6B7280" },
  value: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  amount: { fontSize: 18, fontWeight: "700", color: "#000" },

  /* Tabs */
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tabText: { fontSize: 15, color: "#777" },
  activeTab: { color: "#1E45E1", fontWeight: "700" },
  underline: {
    height: 3,
    backgroundColor: "#1E45E1",
    marginTop: 6,
    borderRadius: 10,
  },

  /* List */
  listRow: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#EBF3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  monthText: { fontSize: 15, fontWeight: "700", fontFamily: 'sans-serif' },
  unitTag: {
    backgroundColor: "#FFF4D7",
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  unitText: { fontSize: 11, color: "#A47E00", fontWeight: "600" },

  price: { fontSize: 16, fontWeight: "700", color: "#000" },
  date: { fontSize: 12, color: "#6B7280", marginTop: 5 },

  avatar: { width: 42, height: 42, borderRadius: 25 },

  occRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  smallIcon: { width: 16, height: 16, tintColor: "#3F6AFF" },
  bedText: { marginLeft: 4, marginRight: 10, fontWeight: "600" },

  unitTag2: {
    backgroundColor: "#FFF4D7",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  unitText2: { color: "#A47E00", fontSize: 11 },

  fab: {
    position: "absolute",
    bottom: 120,
    right: 30,
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
    shadowOffset: { width: 0, height: 2 },
  },
  fabIcon: { width: 30, height: 30 },
  middleBoxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    width: 16,
    height: 16,
    marginRight: 6,
  },
  AddPeple: {
    width: 12,
    height: 12,
    marginRight: 8,
  },

  peopleText: {
    fontSize: 14,
    color: "#8A5A00",
    fontWeight: "600",
  },

  monthBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9EDFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  calendarIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: "#1E45E1",
  },

  sheetOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
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
    paddingBottom: 60,
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
    fontWeight: "700",
    marginBottom: 20,
    color: "#000",
  },

  sheetRoomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  sheetRoomIcon: { width: 40, height: 40, marginRight: 12 },

  sheetRoomName: { fontSize: 16, fontWeight: "700" },
  sheetFloor: { color: "#777", marginTop: 3 },

  sheetDateLabel: { color: "#555", fontSize: 12 },
  sheetDateValue: { fontSize: 14, fontWeight: "700", color: "#000" },

  sheetLabel: {
    fontSize: 14,
    fontWeight: "600",
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

  lastReading: { color: "#1E45E1", fontWeight: "600" },

  sheetBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
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

  sheetCancelTxt: { color: "#000", fontSize: 16, fontWeight: "600" },
  sheetAddTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
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
    fontWeight: "600",
    marginTop: 4,                // aligns exactly like Figma
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#9CA3AF",
    fontSize: 14,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 15,
  },

  tabBtn: {
    alignItems: "center",
  },

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

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
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

  /* Calendar modal */

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
    fontWeight: "600",
    color: "#1E45E1",
  },

  deleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF0000",
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
    fontFamily: 'Gilroy-Semibold'
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
    fontFamily:'Gilroy-Medium',
    color: "#333",
  },


  actionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },


});
