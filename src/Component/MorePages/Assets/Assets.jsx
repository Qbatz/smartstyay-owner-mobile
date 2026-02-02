import React, { useLayoutEffect, useState, useEffect, useCallback, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  BackHandler,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  PanResponder, Animated
} from "react-native";
import DatePicker from "react-native-ui-datepicker";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { AssetContext } from "../../../Context/AssetContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useFloor } from "../../../Context/PayingGuestContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import Loader from "../../../Component/Loader/Loader"
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import MenuDots from "../../../Assets/Images/3dots.png";
import AddIcon from "../../../Assets/Images/TenantAddBlue.png";
import AssetIcon from "../../../Assets/Images/Asset.png";
import SearchIcon from "../../../Assets/Images/Asset_search.png";
import ButtonTag from "../../../Assets/Images/tag.png";
import FilterIcon from "../../../Assets/Images/filter.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import EditIcon from "../../../Assets/Images/editIcon.png";
import TrashIcon from "../../../Assets/Images/trash.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import AddAssetSheet from "../Assets/AddAssets";
import { useFocusEffect } from '@react-navigation/native';
import EmptyStateImage from "../../../Assets/Images/Empty_state.png"

export default function Assets({ navigation }) {

    const { activeHostelId } = useContext(CommonContexts);
  const { getAllAssets, assetList, loading , deleteAsset  , assignAsset} = useContext(AssetContext);
   const { getAllFloorsByHostel, getAllRoomsByFloor,  } = useFloor();

        const [floors, setFloors] = useState([]);
        const [rooms, setRooms] = useState([]);
        const [floorError, setFloorError] = useState("")
        const [roomError, setRoomError] = useState("")
        const [assigndateError, setAssignDateError] = useState("")
        const [floorOpen, setFloorOpen] = useState(false);
        const [selectedFloor, setSelectedFloor] = useState(null);
        const [roomOpen, setRoomOpen] = useState(false);
        const [selectedRoom, setSelectedRoom] = useState(null);

useEffect(() => {
  if(activeHostelId){
  getAllAssets(activeHostelId);
  }
}, [activeHostelId]);


  useEffect(() => {
    if (!activeHostelId) return;

    loadFloors();
  }, [activeHostelId]);

  const loadFloors = async () => {
    const res = await getAllFloorsByHostel(activeHostelId);
    if (res.success) {
      setFloors(res.data);
    }
  }

    const loadRooms = async (floorId) => {
    const res = await getAllRoomsByFloor(floorId);
    if (res.success) {
      setRooms(res.data);
    } else {
      setRooms([]);
    }
  };

console.log("assetlist", assetList);

const [showSuccessModal, setShowSuccessModal] = useState(false);
const [modalMessage, setModalMessage] = useState("");
const [modalType, setModalType] = useState("success");



  const [showSheet, setShowSheet] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [showAssignSheet, setShowAssignSheet] = useState(false);
  const [assignDate, setAssignDate] = useState(null);
  const [openAssignDate, setOpenAssignDate] = useState(false);

  // const floorOptions = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"];

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const handleAddAsset = () => {
     if (!activeHostelId) {
    setModalType("warning");
    setModalMessage("Please Add a Hostel First");
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 1500);
    return;
  }

    setIsEdit(false);
    setSelectedAsset(null);
    setShowAddAsset(true);
  }

  
const handleDeleteAsset = async () => {
  if (!selectedAsset?.assetId) return;

  const res = await deleteAsset(
    selectedAsset.assetId,
    activeHostelId
  );

  setShowDeletePopup(false);
  setShowSheet(false);

  if (res?.success) {
    setModalType("success");
    setModalMessage(res?.message || "Asset deleted successfully");
  } else {
    setModalType("error");
    setModalMessage(res?.message || "Failed to delete asset");
  }

  setShowSuccessModal(true);

  setTimeout(() => {
    setShowSuccessModal(false);
    setSelectedAsset(null);
  }, 1500);
};


const EmptyState = () => (
  <View style={{ alignItems: "center", marginTop: 180 }}>
    <Image
      source={EmptyStateImage}
      style={{ width: 250, height: 180, }}
    />
    <Text style={{ marginTop: 12, fontSize: 16, color: "#888" }}>
      No assets found
    </Text>

    
          <TouchableOpacity
  style={styles.emptystateBtn}
  onPress={handleAddAsset}
>
  <Text style={styles.emptystateText}>
    + Add Asset
  </Text>
</TouchableOpacity>

  </View>
);


  // const roomOptions = ["Room 101", "Room 102", "Room 201", "Room 202", "Room 301", "Room 302"];






  const translateY = useRef(new Animated.Value(0)).current;
  const detailsY = useRef(new Animated.Value(0)).current;
  const assignTranslateY = useRef(new Animated.Value(0)).current;
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

  const detailsPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) detailsY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(detailsY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setShowSheet(false);
            detailsY.setValue(0);
          });
        } else {
          Animated.spring(detailsY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const assignPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) assignTranslateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          Animated.timing(assignTranslateY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
              resetAssignState();
            setShowAssignSheet(false);
            assignTranslateY.setValue(0);
          });
        } else {
          Animated.spring(assignTranslateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;





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
  ]

  const [amountSelected, setAmountSelected] = useState(amountOptions[0]);
  const [amountDropdownVisible, setAmountDropdownVisible] = useState(false);

  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");

 const floorOptions = [
  { id: 1, name: "Ground Floor" },
  { id: 2, name: "1st Floor" },
];

const roomOptions = [  { id: 1, name: "Room 101" },
  { id: 2, name: "Room 102"},]


const isAssignDateDisabled = (dateString) => {
  const current = dayjs(dateString);
  const today = dayjs().endOf("day");

  if (current.isAfter(today, "day")) return true;

  if (selectedAsset?.purchaseDate) {
    const purchaseDate = dayjs(
      selectedAsset.purchaseDate,
      "DD/MM/YYYY"
    );

    if (current.isBefore(purchaseDate, "day")) return true;
  }

  return false;
};



const assignMarkedDates = {};

for (let i = -365; i <= 365; i++) {
  const d = dayjs().add(i, "day");
  const key = d.format("YYYY-MM-DD");

  if (isAssignDateDisabled(key)) {
    assignMarkedDates[key] = {
      disabled: true,
      disableTouchEvent: true,
      customStyles: {
        container: {
          backgroundColor: "#F3F4F6",
          borderRadius: 8,
        },
        text: {
          color: "#9CA3AF",
        },
      },
    };
  }
}

const selectedAssignDate = assignDate
  ? dayjs(assignDate).format("YYYY-MM-DD")
  : null;

  const resetAssignState = () => {
  setSelectedFloor(null);
  setSelectedRoom(null);
  setRooms([]);
  setFloorOpen(false);
  setRoomOpen(false);
  setAssignDate(null);
  setFloorError("");
  setRoomError("");
  setAssignDateError("")
};





const handleAssignAsset = async () => {
  if (!selectedAsset?.assetId) return;

  setFloorError("");
  setRoomError("");
  setAssignDateError("")

  let valid = true;

  if (!selectedFloor) {
    setFloorError("Please Select Floor");
    valid = false;
  }

  if (!selectedRoom) {
    setRoomError("Please Select Room");
    valid = false;
  }

  if (!assignDate) {
    setAssignDateError("Please select date");
    valid = false;
  }

  if (!valid) return;

  const payload = {
    assetId: selectedAsset.assetId,
    hostelId: activeHostelId,
    floorId: selectedFloor.id, 
    roomId: selectedRoom.id,  
    assignedAt: dayjs(assignDate).format("DD/MM/YYYY"),
    
  };

  const res = await assignAsset(payload);

  setShowAssignSheet(false);

  if (res?.success) {
    setModalType("success");
    setModalMessage(res.message || "Asset assigned successfully");
  } else {
    setModalType("error");
    setModalMessage(res?.message || "Assign failed");
  }

  setShowSuccessModal(true);

  setTimeout(() => {
    setShowSuccessModal(false);
  }, 1500);
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


  useEffect(() => {
    const onBackPress = () => {
      if (amountDropdownVisible) {
        setAmountDropdownVisible(false);
        return true;
      }
       if (showDeletePopup) {
        setShowDeletePopup(false);
        return true;
      }
      if (openFrom) {
        setOpenFrom(false);
        return true;
      }
      if (openTo) {
        setOpenTo(false);
        return true;
      }
      if (showFilter) {
        setShowFilter(false);
        return true;
      }
      if (showSheet) {
        setShowSheet(false);
        return true;
      }
      
      return false;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [showSheet, showFilter, openFrom, openTo, amountDropdownVisible,showDeletePopup]);


  const openDetails = (asset) => {
    setSelectedAsset(asset);
    setShowSheet(true);
  };


  const toggleAmountDropdown = () => {
    setAmountDropdownVisible((v) => !v);
  };

  return (

    <>
       { loading && <Loader />}
            <SuccessModal
  visible={showSuccessModal}
  onClose={() => setShowSuccessModal(false)}
  message={modalMessage}
  type={modalType}
/> 

    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Assets</Text>

        <View style={{ width: 30 }} />
      </View>

      {
        !loading && assetList?.length > 0 && (
      <View style={styles.searchBox}>
        <Image source={SearchIcon} style={styles.searchIcon} />
        <TextInput
          placeholder="Search Assets"
          placeholderTextColor="#8a8a8a"
          style={styles.searchInput}
        />
      </View>
        )}


    <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 120 }}
>
  { !loading && assetList?.length > 0 ? (
    assetList.map((item) => (
    <TouchableOpacity
  key={item.assetId}
  style={styles.card}
  activeOpacity={0.8}
  onPress={() => openDetails(item)}
>
  <View style={styles.iconCircle}>
    <Image source={AssetIcon} style={styles.assetIcon} />
  </View>

  <View style={{ flex: 1 }}>
    <Text style={styles.assetTitle}>
      {item.assetName || "N/A"}
    </Text>

    <Text style={styles.assetSub}>
      {item.serialNumber || "N/A"}
      {"  •  "}
      {item.productName || "N/A"}
      {"  •  "}
      ₹{item.price ?? "--"}
    </Text>
  </View>

  <Image source={MenuDots} style={styles.dotsIcon} />
</TouchableOpacity>

    ))
  ) : (
    !loading && <EmptyState />
  )}
</ScrollView>

      {
        !loading && assetList?.length > 0 && (
  <TouchableOpacity style={styles.Filterfab} onPress={() => setShowFilter(true)} accessibilityLabel="Open filters">
        <Image source={FilterIcon} style={styles.fabIcon} />
      </TouchableOpacity>
        )
      }

    

      {
        !loading && assetList?.length > 0 && (
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setIsEdit(false);          
          setSelectedAsset(null);
          setShowAddAsset(true);
          setShowSheet(false);
          setShowFilter(false);
          setShowAssignSheet(false);
        }}
      >
        <Image source={AddIcon} style={styles.fabIconAdd} />
      </TouchableOpacity>
        )
      }




      {showAddAsset && (
        <AddAssetSheet
          onClose={() => setShowAddAsset(false)}
          title={isEdit ? "Edit Assets" : "Add Assets"}  
          asset={selectedAsset}
        />
      )}






      {showSheet && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowSheet(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: detailsY }] }
            ]}
            {...detailsPan.panHandlers}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetTitle}>{selectedAsset?.assetName || "N/A"}</Text>

              <View style={styles.topActions}>
                <TouchableOpacity
                  onPress={() => {
                    setIsEdit(true);            
                    setSelectedAsset(selectedAsset);
                    setShowAddAsset(true);
                    setShowSheet(false);
                  }}
                >
                  <Image source={EditIcon} style={styles.headerIcon} />
                </TouchableOpacity>



<TouchableOpacity onPress={() => setShowDeletePopup(true)}>
  <Image source={TrashIcon} style={[styles.headerIcon, { marginLeft: 12 }]} />
</TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.twoColRow}>
              <View style={styles.colLeft}>
                <Text style={styles.label}>Serial No:</Text>
                <Text style={styles.value}> {selectedAsset?.serialNumber || "N/A"}</Text>
              </View>

              <View style={styles.colRight}>
                <Text style={styles.label}>Brand Name</Text>
                <Text style={styles.value}> {selectedAsset?.brandName || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.twoColRow}>
              <View style={styles.colLeft}>
                <Text style={styles.label}>Product Name</Text>
                <Text style={styles.value}>{selectedAsset?.productName || "N/A"}</Text>
              </View>

              <View style={styles.colRight}>
                <Text style={styles.label}>Purchase Date</Text>
                <Text style={styles.value}>{selectedAsset?.purchaseDate || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.twoColRow}>
              <View style={styles.colLeft}>
                <Text style={styles.label}>Vendor Name</Text>
                <Text style={styles.value}> {selectedAsset?.vendorName || "N/A"}</Text>
              </View>

              <View style={styles.colRight}>
                <Text style={styles.label}>Price</Text>
                <Text style={styles.value}>₹{selectedAsset?.price ?? "00"}</Text>
              </View>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={styles.label}>Mode of Payment</Text>
              <Text style={styles.value}>CASH</Text>
            </View>


            <TouchableOpacity
              style={styles.assignBtn}
              onPress={() => {
                setShowSheet(false);
                setShowAssignSheet(true);
              }}
            >
              <Image source={ButtonTag} style={styles.assignIcon} />
              <Text style={styles.assignText}>Assign Asset</Text>
            </TouchableOpacity>


          </Animated.View>
        </View>
      )}



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
                <Image source={FilterIcon} style={{ width: 30, height: 30 }} />
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
      {showAssignSheet && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback   onPress={() => {
    resetAssignState();
    setShowAssignSheet(false);
  }}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[styles.assignSheet, { transform: [{ translateY: assignTranslateY }] }]}
            {...assignPan.panHandlers}
          >
            <View style={styles.sheetHandle} />

            <Text style={styles.assignTitle}>Assign Asset</Text>


          <Text style={styles.label}>Floor <Text style={styles.star}>*</Text></Text>

      
            <TouchableOpacity
              style={styles.select}
              onPress={() => setFloorOpen(!floorOpen)}
              activeOpacity={0.9}
            >
              <Text >
                {selectedFloor ? selectedFloor.name : "Select a Floor"}
              </Text>
              <Image source={DownArrow} style={styles.arrow} />
            </TouchableOpacity>

            {floorOpen && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                  {floors.map((v) => (

                    <TouchableOpacity
                      key={v.id}
                      style={styles.option}
                      onPress={() => {
                        setSelectedFloor(v);
                        setFloorOpen(false);
                        setSelectedRoom(null);
                        setRooms([]);
                        loadRooms(v.id);
                        setFloorError("")
                      }}
                    >
                      <Text style={styles.optionText}>{v.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          
          {floorError && <ErrorMessage message={floorError} type="error" />}

          <Text style={styles.label}>Room <Text style={styles.star}>*</Text></Text>

       
            <TouchableOpacity
              style={styles.select}
              onPress={() => setRoomOpen(!roomOpen)}
              activeOpacity={0.9}
              disabled={!rooms.length}
            >
              <Text >
                {selectedRoom ? selectedRoom.name : "Select a Room"}
              </Text>
              <Image source={DownArrow} style={styles.arrow} />
            </TouchableOpacity>

            {roomOpen && rooms.length > 0 && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                  {rooms.map((r) => (
                    <TouchableOpacity
                      key={r.id}
                      style={styles.option}
                      onPress={() => {
                        setSelectedRoom(r);
                        setRoomOpen(false);
                        setRoomError("")
                      }}
                    >
                      <Text style={styles.optionText}>{r.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
        
          {roomError && <ErrorMessage message={roomError} type="error" />}

            <Text style={[styles.label, { marginTop: 15 }]}>Date <Text style={styles.star}>*</Text></Text>
            <TouchableOpacity style={styles.selectBox} onPress={() => setOpenAssignDate(true)}>
             <Text style={!assignDate && styles.placeholderText}>
  {assignDate
    ? dayjs(assignDate).format("DD-MM-YYYY")
    : "Select Date"}
</Text>
              <Image source={CalendarIcon} style={styles.calIcon} />
            </TouchableOpacity>

                {assigndateError && <ErrorMessage message={assigndateError} type="error" />}


            <View style={styles.assignButtonRow}>
              <TouchableOpacity style={styles.cancelBtn}   onPress={() => {
    resetAssignState();
    setShowAssignSheet(false);
  }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyBtn}   onPress={handleAssignAsset}>
                <Text style={styles.applyBtnText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

{openAssignDate && (
  <View style={styles.dateOverlay}>
    <TouchableWithoutFeedback onPress={() => setOpenAssignDate(false)}>
      <View style={styles.overlayBg} />
    </TouchableWithoutFeedback>

    <View style={styles.calendarContainer}>
      <Calendar
        markingType="custom"
        markedDates={{
          ...assignMarkedDates,
          ...(selectedAssignDate && {
            [selectedAssignDate]: {
              selected: true,
              customStyles: {
                container: {
                  backgroundColor: "#2563EB",
                  borderRadius: 8,
                },
                text: {
                  color: "#FFFFFF",
                  fontWeight: "700",
                },
              },
            },
          }),
        }}
        current={dayjs().format("YYYY-MM-DD")}  // scroll only
        onDayPress={(day) => {
          if (assignMarkedDates[day.dateString]?.disabled) return;

          setAssignDate(day.dateString); // ✅ user selection
          setOpenAssignDate(false);
          setAssignDateError("")
        }}
        theme={{
          todayTextColor: "#2563EB",
          arrowColor: "#111827",
          textDisabledColor: "#9CA3AF",
        }}
      />
    </View>
  </View>
)}



      {/* {openAssignDate && (
  <View style={styles.sheetOverlay}>
    <TouchableWithoutFeedback onPress={() => setOpenAssignDate(false)}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>

    <View style={styles.datePickerBox}>
      <DatePicker
        mode="single"
        date={assignDate}
        markingType="custom"
        markedDates={assignMarkedDates}
        current={
          assignDate
            ? dayjs(assignDate).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD")
        }
        onChange={(p) => {
          if (!p?.date) return;

          // ❌ double safety
          if (isAssignDateDisabled(p.date)) return;

          setAssignDate(p.date);
          setOpenAssignDate(false);
        }}
        theme={{
          todayTextColor: "#1E45E1",
          selectedDayBackgroundColor: "#1E45E1",
          selectedDayTextColor: "#FFFFFF",
          textDisabledColor: "#9CA3AF",
          arrowColor: "#111827",
        }}
      />
    </View>
  </View>
)} */}

{showDeletePopup && (
  <View style={styles.popupOverlay}>
    <View style={styles.popupBox}>

      <Text style={styles.popupTitle}>Delete Assets?</Text>
      <Text style={styles.popupSubtitle}>
        Are you sure you want to delete this Assets?
      </Text>

      <View style={styles.popupBtnRow}>
        <TouchableOpacity 
          style={styles.cancelBtn}
          onPress={() => setShowDeletePopup(false)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteBtn}
          onPress={handleDeleteAsset}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

    </View>
  </View>
)}


    </View>
       </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingTop: Platform.OS === "ios" ? 50 : 40 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backIcon: { width: 22, height: 22 },
  pageTitle: { fontSize: 20, fontWeight: "700", color: "#000" , marginLeft:15},
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 14, padding: 12, marginBottom: 20 },
  searchIcon: { width: 20, height: 20, tintColor: "#9E9E9E" },
  searchInput: { flex: 1, marginLeft: 10 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 14, marginBottom: 12 },
  iconCircle: { width: 46, height: 46, backgroundColor: "#EEF4FF", borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 14 },
  assetIcon: { width: 26, height: 26, tintColor: "#3F6AFF" },
  assetTitle: { fontSize: 16, fontWeight: "700" },
  assetSub: { fontSize: 13, color: "#696969", marginTop: 2 },
  dotsIcon: { width: 18, height: 18, tintColor: "#999" },

  fab: { position: "absolute", bottom: 65, right: 25, width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  Filterfab: {  position: "absolute",
    bottom: 130,
    right: 30,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    elevation: 5, },
  fabIcon: { width: 30, height: 30 },
fabIconAdd:{
width: 60, height: 60 
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
    arrow: { width: 18, height: 18, tintColor: "#777" },

  label: { fontSize: 13, color: "#7A7A7A", marginBottom: 6 },
  value: { fontSize: 15, fontWeight: "600", color: "#000" },

  assignBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#1E45E1", paddingVertical: 14, borderRadius: 12, marginTop: 20, marginBottom:30 },
  assignIcon: { width: 18, height: 18, tintColor: "#fff", marginRight: 8 },
  assignText: { color: "#fff", fontSize: 16, fontWeight: "700" },
   star: {
    color: "red",
  },

  // filter sheet
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
  downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },

    select: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownMenu: {
   marginTop: 4,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 6,
    zIndex: 999,
  },

  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  quickBtn: { width: "32%", paddingVertical: 12, borderRadius: 12, backgroundColor: "#F5F6FA", alignItems: "center" },
  quickText: { color: "#111", fontWeight: "600" },

  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 42 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontWeight: "700" },
  applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontWeight: "700" },

  datePickerBox: { width: "90%", backgroundColor: "#fff", padding: 12, borderRadius: 15, alignSelf: "center", marginBottom: 30 },
  assignSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: "60%",
  },


  assignTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },

  placeholderText: {
    color: "#A0A0A0",
    fontSize: 15,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  cancelBtn: {
    width: "48%",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
  },

  cancelText: { color: "#000", fontWeight: "600" },

  assignSubmitBtn: {
    width: "48%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#1E45E1",
    alignItems: "center",
  },

  assignSubmitText: { color: "#fff", fontWeight: "700" },
  assignButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: "#fff",
  },

  dropdown: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    zIndex: 999,
    elevation: 10,
  },

  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,

  },

  optionText: {
    fontSize: 15,
    color: "#000",
  },
  popupOverlay: {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 25
},

popupBox: {
  width: "100%",
  backgroundColor: "#fff",
  borderRadius: 18,
  paddingVertical: 25,
  paddingHorizontal: 20,
  elevation: 10
},

popupTitle: {
  fontSize: 18,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 8
},

popupSubtitle: {
  fontSize: 14,
  color: "#555",
  textAlign: "center",
  marginBottom: 25
},

popupBtnRow: {
  flexDirection: "row",
  justifyContent: "space-between",
},

cancelBtn: {
  width: "48%",
  borderWidth: 1,
  borderColor: "#1E45E1",
  paddingVertical: 12,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center"
},

cancelText: {
  color: "#1E45E1",
  fontSize: 16,
  fontWeight: "600"
},


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
deleteBtn: {
  width: "48%",
  backgroundColor: "#1E45E1",
  paddingVertical: 12,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center"
},

deleteText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700"
},

  emptystateBtn: {
    marginTop: 20,
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },

  emptystateText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

});
