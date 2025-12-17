// PGPageFull.js
import React, { useState, useEffect,useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Platform,
  ScrollView,
  BackHandler,
  Animated,
  PanResponder,
} from "react-native";
import AddFloorSheet from "./AddFloorSheet";
import AddRoomSheet from "./AddRoomSheet";
import HostelImg from "../../Assets/Images/PgImg.png";
import AddFloorIcon from "../../Assets/Images/TenantAdd.png";
import AddBedBottomSheet from "./AddBed";
import ManageBedBottomSheet from "./AvailableBedBottomSheet";
import ReservedBedBottomSheet from "./ReservedBed/ReservedBedStatus";
import OccupiedBedSheet from "./OccupiedBed/OccupiedBedStatus";
import MoveNoticeSheet from ".././Customer/MoveToNoticePeriod";
import NoticePeriodBedSheet from "../PG/NoticePeriodBed/NoticeperiodBedStatus";
import NewBookingSheet from "./NoticePeriodBed/NoticePeriodToBooking";
import DoubleStatusSheet from "./NoticePeriodBed/DoupleStatusSheet";
import InactiveTenantSheet from "./ReservedBed/MakeUsInActiveSheet"
import { useNavigation } from "@react-navigation/native";
import { useFloor } from "../../Context/PayingGuestContext";
import { CommonContexts } from "../../Context/CommonContext";
import Dots from "../../Assets/Images/3dots.png";

const EmptyFloor = require("../../Assets/Images/Empty_floor.png");
const AddIcon = require("../../Assets/Images/PGAddButton.png");
const BedEmpty = require("../../Assets/Images/EmptyBed.png");
const BedGreen = require("../../Assets/Images/OccubiedBedImg.png");

const IconCalendar = require("../../Assets/Images/Reservedbed.png");
const IconRupee = require("../../Assets/Images/overdueImage.png");
const IconNotice = require("../../Assets/Images/Noticeperiodimg.png");


export default function PGPageFull({ route }) {
  const navigation = useNavigation();
  // const [floors, setFloors] = useState([]);
const { activeHostelId } = useContext(CommonContexts);
const { getAllFloorsByHostel , loading,getAllRoomsByFloor,getAllBedsByRoom } = useFloor();
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [showAddFloor, setShowAddFloor] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddBed, setShowAddBed] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showManageBed, setShowManageBed] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [showReservedSheet, setShowReservedSheet] = useState(false);
  const [selectedReserved, setSelectedReserved] = useState(null);
  const [showOccupiedSheet, setShowOccupiedSheet] = useState(false);
  const [selectedOccupied, setSelectedOccupied] = useState(null);
  const [showNotice, setShowNotice] = useState(false);
  const [reqDate, setReqDate] = useState("31/07/2025");
  const [outDate, setOutDate] = useState("30/08/2025");
  const [reason, setReason] = useState("");
  const [showNoticePeriodSheet, setShowNoticePeriodSheet] = useState(false);
  const [noticeData, setNoticeData] = useState(null);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [showDoubleStatus, setShowDoubleStatus] = useState(false);
const [selectedDouble, setSelectedDouble] = useState(null);
const [showInactiveSheet,setShowInactiveSheet] =useState(false)
const [floors, setFloors] = useState([]);
const [selectedFloorId, setSelectedFloorId] = useState(null);
 const [rooms, setRooms] = useState([]);
 const [selectedRoomId, setSelectedRoomId] = useState(null);
const [beds, setBeds] = useState([]);
const [selectedBedRoomId,setSelectedBedRoomId] = useState("")
const [bedsByRoom, setBedsByRoom] = useState({});
const [openMenuRoomId, setOpenMenuRoomId] = useState(null);
const [editRoomData, setEditRoomData] = useState(null);




useEffect(() => {
  if (!activeHostelId) return;

  loadFloors();
}, [activeHostelId]);

const loadFloors = async () => {
  const res = await getAllFloorsByHostel(activeHostelId);
  if (res.success) {
    setFloors(res.data);
     setActiveFloorIndex(0);
    setSelectedFloorId(res.data[0].id);

  }
};


useEffect(() => {
  const loadRooms = async () => {
    if (!selectedFloorId) return;

    const res = await getAllRoomsByFloor(selectedFloorId);
    if (res.success) {
      setRooms(res.data); 
    }
  };

  loadRooms();
}, [selectedFloorId]);
const refreshRooms = async () => {
  if (!selectedFloorId) return;

  const res = await getAllRoomsByFloor(selectedFloorId);
  if (res.success) {
    setRooms(res.data); 
  }
};


const handleBedAdded = async (roomId) => {
  const res = await getAllBedsByRoom(roomId);
  if (res.success) {
    setBedsByRoom(prev => ({
      ...prev,
      [roomId]: res.data,
    }));
  }
};

// useEffect(() => {
//   const loadBeds = async () => {
  

//     const res = await getAllBedsByRoom(selectedRoomId);
//     if (res.success) {
//       console.log("res",res)
//       setBeds(res.data);
//     }
//   };

//   loadBeds();
// }, [selectedRoomId]);

const getBedStatus = (bed) => {
  const statuses = [];

  if (bed.isBooked) statuses.push("reserved");
  if (bed.onNotice) statuses.push("noticeperiod");
  if (bed.overDue) statuses.push("overdue");
  if (bed.isOccupied) statuses.push("occupied");

  return statuses.length ? statuses.join(",") : "available";
};

// useEffect(() => {
//   if (rooms.length > 0) {
//     setSelectedRoomId(rooms[0].id);
//   } else {
//     setSelectedRoomId(null);
//     setBeds([]);
//   }
// }, [rooms]);
useEffect(() => {
  if (!rooms.length) return;

  rooms.forEach(async (room) => {
    const res = await getAllBedsByRoom(room.id);
    if (res.success) {
      setBedsByRoom(prev => ({
        ...prev,
        [room.id]: res.data,
      }));
    }
  });
}, [rooms]);


  console.log("Selected Floor ID:", rooms);

console.log("floors",floors)
  const translateY = React.useRef(new Animated.Value(300)).current;


  const splitStatus = (status) => {
    if (!status) return [];
    return status.split(",").map((s) => s.trim());
  };

  
const getPrimaryStatus = (status) => {
  if (!status) return "";
  const statuses = splitStatus(status);

  if (statuses.includes("noticeperiod")) return "noticeperiod"; // 🔥 highest
  if (statuses.includes("overdue")) return "overdue";
  if (statuses.includes("reserved")) return "reserved";
  if (statuses.includes("occupied")) return "occupied";

  return statuses[0];
};


  const getStatusCount = (status) => {
    if (!status) return 0;
    return splitStatus(status).length;
  };

  const getBaseBed = (status) => {
    if (status === "available") return BedEmpty;
    if (status === "reserved") return BedEmpty;
    
    return BedGreen;
  };

  const overlayIcons = {
    reserved: IconCalendar,
    overdue: IconRupee,
    noticeperiod: IconNotice,
  };

  // ---------- Anim bottom sheet ----------
  useEffect(() => {
    if (showActionSheet) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [showActionSheet, translateY]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 120) {
        setShowActionSheet(false);
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  // ---------- Init dummy data ----------
  // useEffect(() => {
  //   setFloors(initialFloors);
  // }, []);

  // ---------- Hide TabBar when any sheet open ----------
  useEffect(() => {
    if (route?.params?.setShowTabBar) {
      route.params.setShowTabBar(
        !showAddFloor &&
          !showActionSheet &&
          !showAddRoom &&
          !showAddBed &&
          !showManageBed &&
          !showReservedSheet &&
          !showOccupiedSheet &&
          !showNoticePeriodSheet &&
          !showNewBooking &&
          !showDoubleStatus &&
          !showInactiveSheet
      );
    }
  }, [
    showAddFloor,
    showActionSheet,
    showAddRoom,
    showAddBed,
    showManageBed,
    showReservedSheet,
    showOccupiedSheet,
    showNoticePeriodSheet,
    showNewBooking,showDoubleStatus,
    route,showInactiveSheet
  ]);

  // ---------- Android Back Handler ----------
  useEffect(() => {
    const onBack = () => {
      if (showAddFloor) {
        setShowAddFloor(false);
        return true;
      }
      if (showActionSheet) {
        setShowActionSheet(false);
        return true;
      }
      if (showAddBed) {
        setShowAddBed(false);
        return true;
      }
      if (showAddRoom) {
        setShowAddRoom(false);
        return true;
      }
      if (showManageBed) {
        setShowManageBed(false);
        return true;
      }
      if (showReservedSheet) {
        setShowReservedSheet(false);
        return true;
      }
      if (showOccupiedSheet) {
        setShowOccupiedSheet(false);
        return true;
      }
      if (showNoticePeriodSheet) {
        setShowNoticePeriodSheet(false);
        return true;
      }
      if (showNewBooking) {
        setShowNewBooking(false);
        return true;
      }
        if (showDoubleStatus) {
        setShowDoubleStatus(false);
        return true;
      }
      if(showInactiveSheet){
setShowInactiveSheet(false)
return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [
    showAddFloor,
    showActionSheet,
    showAddRoom,
    showAddBed,
    showManageBed,
    showReservedSheet,
    showOccupiedSheet,
    showNoticePeriodSheet,
    showNewBooking,showDoubleStatus,showInactiveSheet
  ]);

  // ---------- Actions ----------
  const handleAddFloor = (floorName) => {
    if (!floorName?.trim()) return;
    const newFloor = {
      id: `f${Date.now()}`,
      name: floorName,
      rooms: [],
    };
    const updated = [newFloor, ...floors];
    setFloors(updated);
    setActiveFloorIndex(0);
  };

  const handleOpenNoticeSheet = () => {
    setShowOccupiedSheet(false);
    setSelectedOccupied(null);
    setShowNotice(true);
  };

  const handleReAssignBed = () => {
    if (!selectedOccupied) return;

    navigation.navigate("ReassignBedScreen", {
      tenant: selectedOccupied,
      floors: floors,
    });

    setShowOccupiedSheet(false);
    setShowDoubleStatus(false)
  };

  const handleNoticeToBookin = () => {
    setShowNoticePeriodSheet(false);
    setShowNewBooking(true);
    setShowDoubleStatus(false)
  };

  const handleShowFinalSettlement = () => {
    setShowNoticePeriodSheet(false);
    navigation.navigate("FinalSettlement");
      setShowDoubleStatus(false)
  };

  const handleShowCancelNotice = () => {
    setShowNoticePeriodSheet(false);
    navigation.navigate("CancelNotice");
    setShowDoubleStatus(false)
  };
const handleMakeUsInActive=()=>{
   setShowDoubleStatus(false)
   setShowInactiveSheet(true)
}

const handleCheckIn = ()=>{
   setShowDoubleStatus(false) 
   navigation.navigate("ReserveToCheckin") 
}
const handleAddBed = (roomId) => {
  setSelectedBedRoomId(roomId);
  setShowAddBed(true);
  console.log("roomId",roomId)
};
  
  return (
    <>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.navigate("SettingsPG")}
            >
              <Image source={HostelImg} style={styles.HostelImg} />
            </TouchableOpacity>
            <Text style={styles.title}>Royal Grand Hostel</Text>
          </View>

          <TouchableOpacity
            style={styles.floorButton}
            onPress={() => setShowAddFloor(true)}
          >
            <Text style={styles.floorButtonText}>+ Floor</Text>
          </TouchableOpacity>
        </View>

        {/* STATUS FILTER ROW */}
        <View style={{ flexDirection: "row", marginLeft: 13 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <View style={styles.filterItem}>
              <View style={styles.availableDot} />
              <Text style={styles.filterText}>Available</Text>
            </View>

            <View style={styles.filterItem}>
              <View style={styles.occupiedDot} />
              <Text style={styles.filterText}>Occupied</Text>
            </View>

            <View style={styles.filterItem}>
              <Image source={IconCalendar} style={styles.filterIcon} />
              <Text style={styles.filterText}>Reserved</Text>
            </View>

            <View style={styles.filterItem}>
              <Image source={IconRupee} style={styles.filterIcon} />
              <Text style={styles.filterText}>Overdue</Text>
            </View>

            <View style={styles.filterItem}>
              <Image source={IconNotice} style={styles.filterIcon} />
              <Text style={styles.filterText}>Notice Period</Text>
            </View>
          </ScrollView>
        </View>

        {/* just spacing row */}
        <View style={{ paddingVertical: 12 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          ></ScrollView>
        </View>

        {/* FLOOR TABS */}
        <View style={{ flexDirection: "row", marginLeft: 13 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 13, paddingRight: 20 }}
          >
            {floors.map((f, i) => (
            
              <TouchableOpacity
    key={f.id}
    style={[
      styles.floorTab,
      activeFloorIndex === i && styles.floorTabActive,
    ]}
    onPress={() => {
      setActiveFloorIndex(i);
      setSelectedFloorId(f.id);  

    
    }}
  >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <View
                    style={[
                      styles.floorCircle,
                      activeFloorIndex === i && styles.floorCircleActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.circleText,
                        activeFloorIndex === i && styles.circleTextActive,
                      ]}
                    >
                      F
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.floorLabel,
                      activeFloorIndex === i && styles.floorLabelActive,
                    ]}
                  >
                    {f.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* NO FLOOR */}
        {floors.length === 0 && (
          <View style={styles.centerContainer}>
            <Image source={EmptyFloor} style={styles.image} />
            <Text style={styles.noFloorText}>No floors are there!</Text>

            <TouchableOpacity
              style={styles.addFloorBtn}
              onPress={() => setShowAddFloor(true)}
            >
              <Text style={styles.addFloorText}>+ Add Floor</Text>
            </TouchableOpacity>
          </View>
        )}

      
  {floors.length > 0 && rooms.length === 0 && (
  <View style={styles.centerContainer}>
    <Image source={EmptyFloor} style={styles.image} />
    <Text style={styles.noFloorText}>No Rooms are there!</Text>

    <TouchableOpacity
      style={styles.addFloorBtn}
      onPress={() => setShowAddRoom(true)}
    >
      <Text style={styles.addFloorText}>+ Add Rooms</Text>
    </TouchableOpacity>
  </View>
)}


        {/* ROOMS + BEDS */}
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
//             <View style={styles.roomCard}>
//               <View style={styles.roomHeader}>
//                 <View>
//                   <Text style={styles.roomTitle}>Room No {item.name}</Text>
//                   <Text style={styles.roomSubtitle}>{item.sharing}</Text>
//                 </View>

//                 <TouchableOpacity
//                   style={styles.addRoomBtn}
//                   onPress={() => setShowAddBed(true)}
//                 >
//                   <Image source={AddIcon} style={{ width: 22, height: 22 }} />
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.bedsRow}>
//                 {/* {item.beds?.map((b) => (
//                   <TouchableOpacity
//                     key={b.id}
//                     style={styles.bedItem}
//                     onPress={() => {
//                       const statuses = splitStatus(b.status);

//                       // NOTICE + RESERVED together → Reserved sheet (priority B)
//                   if (
//   statuses.includes("noticeperiod") &&
//   statuses.includes("reserved")
// ) {
//   setSelectedDouble({ bed: b, room: item }); 
//   setShowDoubleStatus(true);
//   return;
// }


//                       // RESERVED only
//                       if (b.status === "reserved") {
//                         setSelectedReserved({ bed: b, room: item });
//                         setShowReservedSheet(true);
//                         return;
//                       }

//                       // AVAILABLE
//                       if (b.status === "available") {
//                         setSelectedBed(b);
//                         setShowManageBed(true);
//                         return;
//                       }

//                       // OCCUPIED
//                       if (b.status === "occupied") {
//                         setSelectedOccupied({ bed: b, room: item });
//                         setShowOccupiedSheet(true);
//                         return;
//                       }

//                       // NOTICE only
//                       if (b.status === "noticeperiod") {
//                         setNoticeData({ bed: b, room: item });
//                         setShowNoticePeriodSheet(true);
//                         return;
//                       }
//                     }}
//                   >
//                     <Image
//                       source={getBaseBed(b.status)}
//                       style={styles.bedIcon}
//                     />

              
//                     {overlayIcons[getPrimaryStatus(b.status)] && (
//                       <Image
//                         source={overlayIcons[getPrimaryStatus(b.status)]}
//                         style={styles.overlayIcon}
//                       />
//                     )}

                   
//                     {getStatusCount(b.status) > 1 && (
//                       <View style={styles.multiBadge}>
//                         <Text style={styles.multiBadgeText}>
//                           {getStatusCount(b.status)}
//                         </Text>
//                       </View>
//                     )}

//                     <Text style={styles.bedLabel}>{b.label}</Text>
//                   </TouchableOpacity>
//                 ))} */}
//                 {selectedRoomId === item.id &&
//   beds.map((b) => {
//     const status = getBedStatus(b);

//     return (
//       <TouchableOpacity
//         key={b.id}
//         style={styles.bedItem}
//         onPress={() => {
//           const statuses = splitStatus(status);

//           if (statuses.includes("noticeperiod") && statuses.includes("reserved")) {
//             setSelectedDouble({ bed: b, room: item });
//             setShowDoubleStatus(true);
//             return;
//           }

//           if (status === "reserved") {
//             setSelectedReserved({ bed: b, room: item });
//             setShowReservedSheet(true);
//             return;
//           }

//           if (status === "available") {
//             setSelectedBed(b);
//             setShowManageBed(true);
//             return;
//           }

//           if (status === "occupied") {
//             setSelectedOccupied({ bed: b, room: item });
//             setShowOccupiedSheet(true);
//             return;
//           }

//           if (status === "noticeperiod") {
//             setNoticeData({ bed: b, room: item });
//             setShowNoticePeriodSheet(true);
//           }
//         }}
//       >
//         <Image source={getBaseBed(status)} style={styles.bedIcon} />

//         {overlayIcons[getPrimaryStatus(status)] && (
//           <Image
//             source={overlayIcons[getPrimaryStatus(status)]}
//             style={styles.overlayIcon}
//           />
//         )}

//         {getStatusCount(status) > 1 && (
//           <View style={styles.multiBadge}>
//             <Text style={styles.multiBadgeText}>
//               {getStatusCount(status)}
//             </Text>
//           </View>
//         )}

//         <Text style={styles.bedLabel}>{b.bedName}</Text>
//       </TouchableOpacity>
//     );
//   })}

//               </View>
//             </View>
  <View style={styles.roomCard}>
           <TouchableOpacity
  style={styles.roomHeader}
  activeOpacity={0.8}
  onPress={() => {
    console.log("ROOM CLICKED:", item.roomId);
    setSelectedRoomId(item.roomId); // ✅ FIX
  }}
>
  <View>
    <Text style={styles.roomTitle}>Room No {item.name}</Text>
    <Text style={styles.roomSubtitle}>{item.sharing}</Text>
  </View>

 <TouchableOpacity
  style={styles.addRoomBtn}
  onPress={() => {
    setOpenMenuRoomId(
      openMenuRoomId === item.id ? null : item.id
    );
  }}
>
  <Image source={Dots} style={{ width: 22, height: 22 }} />
</TouchableOpacity>
</TouchableOpacity>

{openMenuRoomId === item.id && (
  <View style={styles.menuBox}>
    <TouchableOpacity
      style={styles.menuItem}
   
       onPress={() => {
    setOpenMenuRoomId(null);
    setEditRoomData(item);      // 👈 full room object
    setShowAddRoom(true);       // 👈 same sheet open
  }}
    
    >
      <Text style={styles.menuText}>Edit</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        setOpenMenuRoomId(null);
        console.log("DELETE ROOM", item.id);
        // 👉 delete confirmation
      }}
    >
      <Text style={[styles.menuText, { color: "red" }]}>
        Delete
      </Text>
    </TouchableOpacity>
  </View>
)}


              <View style={styles.bedsRow}>
               
    {bedsByRoom[item.id]?.map((b) => {
  const status = getBedStatus(b);

  return (
    <TouchableOpacity
      key={b.id}
      style={styles.bedItem}
      onPress={() => {
          const statuses = splitStatus(status);

          if (statuses.includes("noticeperiod") && statuses.includes("reserved")) {
            setSelectedDouble({ bed: b, room: item });
            setShowDoubleStatus(true);
            return;
          }

          if (status === "reserved") {
            setSelectedReserved({ bed: b, room: item });
            setShowReservedSheet(true);
            return;
          }

          if (status === "available") {
            setSelectedBed(b);
            setShowManageBed(true);
            return;
          }

          if (status === "occupied") {
            setSelectedOccupied({ bed: b, room: item });
            setShowOccupiedSheet(true);
            return;
          }
          //   if (status === "overdue") {
          //   setSelectedOccupied({ bed: b, room: item });
          //   setShowOccupiedSheet(true);
          //   return;
          // }
          if (b.overDue && b.isOccupied) {
  setSelectedOccupied({ bed: b, room: item });
  setShowOccupiedSheet(true);
  return;
}


          // if (status === "noticeperiod") {
          //   setNoticeData({ bed: b, room: item });
          //   setShowNoticePeriodSheet(true);
          // }
          if (b.onNotice && b.isOccupied) {
  setNoticeData({ bed: b, room: item });
  setShowNoticePeriodSheet(true);
  return;
}

        }}
    >
      <Image source={getBaseBed(status)} style={styles.bedIcon} />

      {overlayIcons[getPrimaryStatus(status)] && (
        <Image
          source={overlayIcons[getPrimaryStatus(status)]}
          style={styles.overlayIcon}
        />
      )}

      {b.onNotice && b.isBooked && (
        <View style={styles.multiBadge}>
          <Text style={styles.multiBadgeText}>2</Text>
        </View>
      )}

      <Text style={styles.bedLabel}>{b.bedName}</Text>
    </TouchableOpacity>
  );
})}

<TouchableOpacity
    style={styles.addRoomBtn}
  onPress={() => handleAddBed(item.id)}


  >
    <Image source={AddIcon} style={{ width: 22, height: 22 }} />
  </TouchableOpacity>

              </View>
            </View>
          )}
        />
      </View>

      {/* FLOATING ADD BUTTON */}
      {floors.length > 0 && (
        <TouchableOpacity
          style={styles.addFab}
          onPress={() => setShowActionSheet(true)}
        >
          <Image source={AddFloorIcon} style={styles.addIcon} />
        </TouchableOpacity>
      )}

      {/* ACTION SHEET (Floor / Room) */}
      {showActionSheet && (
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayTouch}
            onPress={() => setShowActionSheet(false)}
          />

          <Animated.View
            style={[styles.actionSheet, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetContent}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setShowAddFloor(true);
                  setShowActionSheet(false);
                }}
              >
                <View style={styles.iconBG}>
                  <Image
                    source={require("../../Assets/Images/FloorImg.png")}
                    style={styles.iconImg}
                  />
                </View>
                <Text style={styles.actionText}>Floor</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setShowAddRoom(true);
                  setShowActionSheet(false);
                }}
              >
                <View style={styles.iconRoom}>
                  <Image
                    source={require("../../Assets/Images/RoomImg.png")}
                    style={styles.iconRoomimg}
                  />
                </View>
                <Text style={styles.actionText}>Room</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* BOTTOM SHEETS */}
      <AddFloorSheet
        visible={showAddFloor}
        onClose={() => setShowAddFloor(false)}
        onSuccess={loadFloors}
        onSave={(name) => {
          handleAddFloor(name);
          setShowAddFloor(false);
        }}
      />

      {/* <AddRoomSheet
        visible={showAddRoom}
        onClose={() => setShowAddRoom(false)}
        onSuccess={refreshRooms}
        onSuccessFloor={loadFloors}
        floorId={selectedFloorId}
      /> */}
    <AddRoomSheet
  visible={showAddRoom}
  onClose={() => {
    setShowAddRoom(false);
    setEditRoomData(null);
  }}
  floorId={selectedFloorId}
  editRoomData={editRoomData}
  onSuccess={refreshRooms}   // 🔥 MUST
/>



      <AddBedBottomSheet
        visible={showAddBed}
        onClose={() => setShowAddBed(false)}
        selectedRoomId={selectedBedRoomId}
         onBedAdded={handleBedAdded}
      />

      <ManageBedBottomSheet
        visible={showManageBed}
        onClose={() => setShowManageBed(false)}
      />

      <ReservedBedBottomSheet
        visible={showReservedSheet}
        onClose={() => setShowReservedSheet(false)}
        bed={selectedReserved?.bed}
        room={selectedReserved?.room}
        selectTap={route?.params?.setShowTabBar}
      />

      <OccupiedBedSheet
        visible={showOccupiedSheet}
        onClose={() => {
          setShowOccupiedSheet(false);
          setSelectedOccupied(null);
        }}
        bed={selectedOccupied?.bed}
        room={selectedOccupied?.room}
        onMoveToNotice={handleOpenNoticeSheet}
        onReAssign={handleReAssignBed}
      />

      {showNotice && (
        <MoveNoticeSheet
          visible={showNotice}
          onClose={() => setShowNotice(false)}
          requestDate={reqDate}
          checkoutDate={outDate}
          reason={reason}
          setRequestDate={setReqDate}
          setCheckoutDate={setOutDate}
        />
      )}

      <NoticePeriodBedSheet
        visible={showNoticePeriodSheet}
        onClose={() => setShowNoticePeriodSheet(false)}
        bed={noticeData?.bed}
        room={noticeData?.room}
        tenant={noticeData?.tenant}
        setShowBar={route.params.setShowTabBar}
        onClick={handleNoticeToBookin}
        onFinalSheet={handleShowFinalSettlement}
        navigation={navigation}
        cancelNoticePeriod={handleShowCancelNotice}
      />

      <NewBookingSheet
        visible={showNewBooking}
        onClose={() => setShowNewBooking(false)}
        bed={selectedOccupied?.bed}
        room={selectedOccupied?.room}
      />
      <DoubleStatusSheet
    visible={showDoubleStatus}
    onClose={() => setShowDoubleStatus(false)}
    bed={selectedDouble?.bed}
    room={selectedDouble?.room}
    handleNoticeToBookin={handleNoticeToBookin}
    handleShowFinalSettlement={handleShowFinalSettlement}
    handleReAssignBed={handleShowCancelNotice}
    handleMakeUsInActive={handleMakeUsInActive}
    handleCheckIn={handleCheckIn}
/>
 <InactiveTenantSheet
      visible={showInactiveSheet}
      onClose={() => setShowInactiveSheet(false)}
    />

    </>
  );
}

// ================== STYLES ===================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 64,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  HostelImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  floorButton: {
    backgroundColor: "#1E45E1",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  floorButtonText: { color: "#fff", fontWeight: "600" },

  floorTab: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 10,
    alignItems: "center",
    width: 80,
  },

  floorTabActive: {
    borderColor: "#1E45E1",
    backgroundColor: "#EAF0FF",
  },

  floorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF5E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  floorCircleActive: {
    backgroundColor: "#1E45E1",
  },

  circleText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },

  circleTextActive: {
    color: "#fff",
  },

  floorLabel: {
    fontSize: 12,
    color: "#777",
  },

  floorLabelActive: {
    color: "#1E45E1",
    fontWeight: "700",
  },

  roomCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F2F4F8",
  },

  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  roomTitle: { fontSize: 16, fontWeight: "700" },
  roomSubtitle: { fontSize: 12, color: "#888" },

  addRoomBtn: {
    padding: 8,
    borderRadius: 0,
  },

  bedsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },

  bedItem: {
    width: 60,
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },

  bedIcon: { width: 38, height: 35, marginBottom: 6 },

  overlayIcon: {
    width: 18,
    height: 18,
    position: "absolute",
    top: 0,
    right: 12,
  },

  bedLabel: { fontSize: 12 },

  centerContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
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

  addFloorBtn: {
    marginTop: 20,
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },

  addFloorText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  addFab: {
    position: "absolute",
    right: 20,
    bottom: 78,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: { width: 60, height: 60 },

  filterScroll: {
    paddingLeft: 16,
    paddingRight: 30,
    gap: 18,
    marginBottom: 10,
  },

  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  availableDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#444",
  },

  occupiedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#31A24C",
  },

  filterIcon: {
    width: 14,
    height: 14,
    resizeMode: "contain",
  },

  filterText: {
    fontSize: 14,
    color: "#444",
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  overlayTouch: {
    flex: 1,
  },

  actionSheet: {
    height: 220,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  sheetHandle: {
    width: 60,
    height: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 3,
    marginBottom: 20,
  },

  sheetContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 30,
    marginLeft: 50,
  },

  actionItem: {
    alignItems: "center",
  },

  iconBG: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#00B7FF",
    alignItems: "center",
    justifyContent: "center",
  },

  iconImg: {
    width: 32,
    height: 32,
    tintColor: "#fff",
    resizeMode: "contain",
  },

  iconRoom: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#9747FF",
    alignItems: "center",
    justifyContent: "center",
  },

  iconRoomimg: {
    width: 32,
    height: 32,
    tintColor: "#fff",
    resizeMode: "contain",
  },

  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#00B7FF",
  },

  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },

  multiBadge: {
    position: "absolute",
    top: -6,
    right: 6,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#1E45E1",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  multiBadgeText: {
    color: "#1E45E1",
    fontSize: 11,
    fontWeight: "700",
  },
  menuBox: {
  position: "absolute",
  top: 45,
  right: 10,
  backgroundColor: "#fff",
  borderRadius: 10,
  paddingVertical: 6,
  width: 120,
  elevation: 6,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 10,
  zIndex: 999,
},

menuItem: {
  paddingVertical: 10,
  paddingHorizontal: 14,
},

menuText: {
  fontSize: 14,
  color: "#333",
},

});
