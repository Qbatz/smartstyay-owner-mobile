import React, { useEffect, useRef, useState, useContext, useMemo, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    PanResponder,
    TextInput,
    Keyboard,
    ScrollView,
    Image,
    FlatList,
    Pressable,
    Dimensions,
    ActivityIndicator, Platform,
    BackHandler,
} from "react-native";
import dayjs from "dayjs";
// import DownArrow from "../../Assets/Images/direction-down.png";
// import CloseIcon from "../../Assets/Images/remove.png";
import Dots from "../../Assets/Images/3dots.png";
// import { AmenityContext } from "../../../Context/AmenityContext";
import { CommonContexts } from "../../Context/CommonContext";
import { useFloor } from "../../Context/PayingGuestContext";
import { useCustomer } from "../../Context/CustomerContext";
// import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../ToastFile/ToastPage";
import { useHasPermission } from "../../Utils/useHasPermission"
import { useHideTabbarOnScroll } from "../../Utils/useHideTabbarOnScroll"
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";



// import AddFloorSheet from "./AddFloorSheet";
// import AddRoomSheet from "./AddRoomSheet";
// import HostelImg from "../../Assets/Images/PgImg.png";
// import AddFloorIcon from "../../Assets/Images/TenantAdd.png";
// import AddBedBottomSheet from "./AddBed";
// import ManageBedBottomSheet from "./AvailableBedBottomSheet";
// import ReservedBedBottomSheet from "./ReservedBed/ReservedBedStatus";
// import OccupiedBedSheet from "./OccupiedBed/OccupiedBedStatus";
// import MoveNoticeSheet from ".././Customer/MoveToNoticePeriod";
// import NoticePeriodBedSheet from "../PG/NoticePeriodBed/NoticeperiodBedStatus";
// import NewBookingSheet from "./NoticePeriodBed/NoticePeriodToBooking";
// import DoubleStatusSheet from "./NoticePeriodBed/DoupleStatusSheet";
// import InactiveTenantSheet from "./ReservedBed/MakeUsInActiveSheet"

// import EditIcon from "../../Assets/Images/editIcon.png";
// import DeleteIcon from "../../Assets/Images/trash.png";

// import CheckoutBottomSheet from '../Customer/Checkout/CheckoutTenant';
// import OccupiedAndReservedBedSheet from "../PG/OccupiedAndReservedStatus";
// import Loader from "../Loader/Loader";

// import { UIContext } from "../Tabs/UIContext";


const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.88;
const EmptyFloor = require("../../Assets/Images/Empty_floor.png");
const AddIcon = require("../../Assets/Images/PGAddButton.png");
const BedEmpty = require("../../Assets/Images/EmptyBed.png");
const BedGreen = require("../../Assets/Images/OccubiedBedImg.png");
const BedBlue = require("../../Assets/Images/BluebedIcon.png");

const TickIcon = require("../../Assets/Images/tickgreen.png");

const IconCalendar = require("../../Assets/Images/Reservedbed.png");
const IconRupee = require("../../Assets/Images/overdueImage.png");
const IconNotice = require("../../Assets/Images/Noticeperiodimg.png");

export default function BedDetailsSheet({
    visible,
    onClose,
    type,
    joiningDate,
    onSelect,
    //   onSuccessRefresh,onSuccess 
}) {
    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const keyboardOffset = useRef(new Animated.Value(0)).current;
    // const [modalType, setModalType] = useState("success");
    // const [showSuccess, setShowSuccess] = useState(false);
    // const [message, setMessage] = useState("");

    const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel, TenantCheckIn } = useCustomer();

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState(null);

    const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef(null);

    const [amenityError, setAmenityError] = useState("");
    // const [loading, setLoading] = useState(false);

    console.log("joiningDate", joiningDate);
    console.log("activetabview",type)




    const [selectedFloor, setSelectedFloor] = useState(null);

    const [selectedRoom, setSelectedRoom] = useState(null);

    const [availableBeds, setAvailableBeds] = useState([]);
    const [lastActiveTab,setLastActiveTab]=useState("")



    useEffect(() => {
        if (!visible || !activeHostelId || !joiningDate) return;

        loadAvailableBeds(joiningDate);
    }, [visible, activeHostelId, joiningDate]);

    const loadAvailableBeds = async (date) => {
        const formattedDate = dayjs(date).format("DD-MM-YYYY");

        const res = await getBedsByHostelAndDate(
            activeHostelId,
            formattedDate
        );

        if (res.success) {
            setAvailableBeds(res.data?.listBeds || []);
        } else {
            setAvailableBeds([]);
        }
    };


    console.log("lastactivetab",lastActiveTab)


    const resetState = () => {
        onClose?.()
        setLastActiveTab(type)
    }

    useEffect(()=>{
        if(type != lastActiveTab){
            setSelectedBed(null)
        }
    },[visible])



    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
            Animated.timing(keyboardOffset, {
                toValue: e.endCoordinates.height - 20,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });

        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            Animated.timing(keyboardOffset, {
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

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : SHEET_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => {
                if (showDropdown) return false;
                return g.dy > 10;
            },
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) translateY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 140) {
                    Keyboard.dismiss();
                    resetState();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const navigation = useNavigation();
    const { activeHostelId, hostelList } = useContext(CommonContexts);
    const { getAllFloorsByHostel, loading, getAllRoomsByFloor, getAllBedsByRoom, deleteRoom, deleteBed, deleteFloor, getBedById } = useFloor();
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

    const [showOccupiedReservedSheet, setShowOccupiedReservedSheet] = useState(false);
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
    const [showInactiveSheet, setShowInactiveSheet] = useState(false)
    const [floors, setFloors] = useState([]);
    const [selectedFloorId, setSelectedFloorId] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [beds, setBeds] = useState([]);
    const [selectedBedRoomId, setSelectedBedRoomId] = useState("")
    //   const [bedsByRoom, setBedsByRoom] = useState({});
    const [openMenuRoomId, setOpenMenuRoomId] = useState(null);
    const [editRoomData, setEditRoomData] = useState(null);
    const [deletePopup, setDeletePopup] = useState(false)
    const [deleteRoomId, setDeleteRoomId] = useState(null);
    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [showFloorMenu, setShowFloorMenu] = useState(false);
    const [editFloorData, setEditFloorData] = useState(null);
    const [deleteFloorId, setDeleteFloorId] = useState(null);
    const [floordeletePopup, setFloorDeletePopup] = useState(false)
    const [bedUserDetails, setBedUserDetails] = useState("")
    const [showCheckout, setShowCheckout] = useState(false);
    const [inactiveTenant, setInactiveTenant] = useState(null);
    // const [matchedBed, setMatchedBed] = useState(null);

    // const[showFloorBar,setShowFloorBar]=useState(true)

    //    const { setShowTabBar } = route.params

    //   const {handleScroll} =useHideTabbarOnScroll(setShowTabBar);



    const {
        canWriteModule: canWritePayingGuests,
        canReadModule: canReadPayingGuests,
        canUpdateModule: canUpdatePayingGuests,
        canDeleteModule: canDeletePayingGuests,
    } = useHasPermission("Paying Guests");


    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", () => {
            setIsKeyboardOpen(true);
        });
        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyboardOpen(false);
        });
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const isAnySheetOpen =
        isKeyboardOpen ||
        showAddFloor ||
        showAddRoom ||
        showAddBed ||
        showManageBed ||
        showReservedSheet ||
        showOccupiedSheet ||
        showNoticePeriodSheet ||
        showNewBooking ||
        showDoubleStatus ||
        showInactiveSheet ||
        showActionSheet;

    const [editBedData, setEditBedData] = useState(null);

    console.log("bedsByRoom", bedsByRoom)
    const handleEditBed = (bed) => {
        setEditBedData(bed);
        setShowAddBed(true);
        setShowManageBed(false);
        setShowNoticePeriodSheet(false)
        setShowOccupiedSheet(false)
        setShowReservedSheet(false)
    };
    const activeHostelName = hostelList?.find(
        (item) => item.hostelId === activeHostelId
    );

    console.log("Active Hostel Name:", activeHostelName);

    const handleDelete = (roomId) => {
        setDeletePopup(true)
        setOpenMenuRoomId(null)
        setDeleteRoomId(roomId)
    }
    const handleFloorDelete = (FloorId) => {
        setFloorDeletePopup(true)
        setOpenMenuRoomId(null)
        setDeleteFloorId(FloorId)
    }
    const handleDeleteFloor = async (floorId) => {

        const res = await deleteFloor(floorId);

        if (res.success) {
            setModalType("success");
            setMessage("Floor deleted successfully");
            setShowSuccess(true);

            if (selectedFloorId === floorId) {
                setSelectedFloorId(null);   // 👈 triggers effect
            }


            setTimeout(() => {
                setShowSuccess(false);
                loadFloors();
            }, 800);
        } else {
            setModalType("warning");
            setMessage(res.message);
            setShowSuccess(true);

            setTimeout(() => setShowSuccess(false), 800);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteRoomId) return;

        const res = await deleteRoom(deleteRoomId);

        if (res?.success) {

            setModalType("success");
            setMessage(res.data);
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
                setDeletePopup(false);
                setDeleteRoomId(null);
                refreshRooms();
            }, 800);

        } else {
            setModalType("warning");
            setMessage(res?.message || "Room delete failed");
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
            }, 800);
        }
    };
    const matchedBed = selectedBed?.roomId
        ? bedsByRoom?.[selectedBed.roomId]?.find(
            bed => bed.id === selectedBed?.id
        )
        : null;

    console.log("Matched Bed 👉", matchedBed);

    const getBedStatus = (bed) => {
        const statuses = [];

        if (bed.isBooked) statuses.push("reserved");
        if (bed.onNotice) statuses.push("noticeperiod");
        if (bed.overDue) statuses.push("overdue");
        if (bed.isOccupied) statuses.push("occupied");

        return statuses.length ? statuses.join(",") : "available";
    };




    //   const getStatusArray = (bed) => {
    //   const arr = [];

    //   if (bed.isBooked) arr.push("reserved");
    //   if (bed.onNotice) arr.push("notice");
    //   if (bed.overDue) arr.push("overdue");

    //   return arr;
    // };

    //     const handleBedPress = (bed) => {
    //     onSelect?.(bed);
    //     onClose?.();
    // };

    const handleBedPress = (bed, room) => {
        const floor = floors[activeFloorIndex];

        setSelectedBed({
            ...bed,

            floorId: floor?.id,
            floorName: floor?.name,

            roomId: room?.id,
            roomName: room?.name,

            bedId: bed?.bedId,
            bedName: bed?.bedName,

            rentAmount: bed?.rentAmount,
            sharing: (bedsByRoom[room?.id] || []).length,
        });

        // setSelectedBed({
        //     floorId: floor.id,
        //     floorName: floor.name,

        //     roomId: room.id,
        //     roomName: room.name,

        //     bedId: bed.bedId,
        //     bedName: bed.bedName,

        //     rentAmount: bed.rentAmount,
        //     sharing: (bedsByRoom[room.id] || []).length,

        //     ...bed,
        // });
    };

    // const handleBedPress = async (bed, room) => {
    //     const res = await getBedById(bed.id);
    //     if (!res.success) return;

    //     const freshBed = res.data;
    //     console.log("freshbed", freshBed)

    //     const matchedBed =
    //         bedsByRoom[room.id]?.find(b => b.id === bed.id);

    //     console.log("mathc", matchedBed)
    //     console.log("fresh", freshBed)

    //     if (!matchedBed) return;

    //     const status = getBedStatus(matchedBed);


    //     if (
    //         freshBed.isOnNotice &&
    //         freshBed.isBooked &&
    //         freshBed.isOccupied
    //     ) {
    //         setSelectedDouble({ bed: freshBed, room });
    //         setShowDoubleStatus(true);
    //         setSelectedBed(freshBed);
    //         return;
    //     }

    //     if (matchedBed.onNotice && matchedBed.isOccupied) {
    //         setNoticeData({ bed: freshBed, room });
    //         setSelectedBed(freshBed);
    //         setSelectedBedRoomId(room.id);
    //         setShowNoticePeriodSheet(true);
    //         return;
    //     }


    //     if (matchedBed.overDue && matchedBed.isOccupied) {
    //         setSelectedBed(freshBed);
    //         setSelectedOccupied({ bed: freshBed, room });
    //         setShowOccupiedSheet(true);
    //         return;
    //     }

    //     if (matchedBed.isOccupied && matchedBed.isBooked) {
    //         setSelectedBed(freshBed);
    //         setSelectedBedRoomId(room.id);
    //         setSelectedOccupied({ bed: freshBed, room });
    //         setShowOccupiedSheet(true);
    //         return;
    //     }


    //     if (matchedBed.isBooked) {
    //         setSelectedBed(freshBed);
    //         setSelectedReserved({ bed: freshBed, room });
    //         setShowReservedSheet(true);
    //         return;
    //     }

    //     if (status === "occupied") {
    //         setSelectedBed(freshBed);
    //         setSelectedBedRoomId(room.id);
    //         setSelectedOccupied({ bed: freshBed, room });
    //         setShowOccupiedSheet(true);
    //         return;
    //     }

    //     if (status === "available") {
    //         setSelectedBed(freshBed);
    //         setSelectedBedRoomId(room.id);
    //         setShowManageBed(true);
    //     }
    // };

    // const handleBedPress = async (bed, room) => {
    //   const res = await getBedById(bed.id);

    //   if (!res.success) return;

    //   const freshBed = res.data;
    //   const status = getBedStatus(freshBed);

    //   const statuses = splitStatus(status);

    //   console.log("status", status)

    //   if (
    //     matchedBed.isOnNotice &&
    //     matchedBed.isBooked &&
    //     matchedBed.isOccupied
    //   ) {
    //     setSelectedDouble({ bed: freshBed, room });
    //     setShowDoubleStatus(true);
    //     setSelectedBed(freshBed);
    //     return;
    //   }


    //   if (freshBed.isOnNotice && freshBed.isOccupied) {
    //     setNoticeData({ bed: freshBed, room });
    //     setSelectedBed(freshBed);
    //     setSelectedBedRoomId(room.id);
    //     setShowNoticePeriodSheet(true);
    //     return;
    //   }


    //   if (freshBed.overDue && freshBed.isOccupied) {
    //     setSelectedBed(freshBed);
    //     setSelectedOccupied({ bed: freshBed, room });
    //     setShowOccupiedSheet(true);
    //     return;
    //   }
    //   if (freshBed.isOccupied && freshBed.isBooked) {
    //     setSelectedBed(freshBed);
    //     setSelectedBedRoomId(room.id);
    //     setSelectedOccupied({ bed: freshBed, room });
    //     setShowOccupiedSheet(true);
    //     return;
    //   }


    //   if (freshBed.isBooked) {
    //     setSelectedBed(freshBed);
    //     setSelectedReserved({ bed: freshBed, room });
    //     setShowReservedSheet(true);
    //     return;
    //   }


    //   if (status === "occupied") {
    //     setSelectedBed(freshBed);
    //     setSelectedBedRoomId(room.id);
    //     setSelectedOccupied({ bed: freshBed, room });
    //     setShowOccupiedSheet(true);
    //     return;
    //   }

    //   if (status === "available") {
    //     setSelectedBed(freshBed);
    //     setSelectedBedRoomId(room.id);
    //     setShowManageBed(true);
    //   }
    // };



    const fetchBedDetails = async (bedId) => {
        const res = await getBedById(bedId);

        if (res.success) {

            setBedUserDetails(res.data);
        } else {
            console.log("ERROR 👉", res.message);
        }
    };





    const loadFloors = async () => {
        const res = await getAllFloorsByHostel(activeHostelId);
        if (res.success) {
            setFloors(res.data);
            setActiveFloorIndex(0);
            setSelectedFloorId(res.data[0]?.id);

        }
    };

    console.log("Floors", floors)

    useEffect(() => {
        const loadRooms = async () => {
            if (!selectedFloorId) {
                setRooms([])
                return;
            }


            const res = await getAllRoomsByFloor(selectedFloorId);
            if (res.success) {
                setRooms(res.data);
            }
            else {
                setRooms([])
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




    const bedsByRoom = useMemo(() => {
        return availableBeds.reduce((acc, bed) => {
            if (!acc[bed.roomId]) {
                acc[bed.roomId] = [];
            }

            acc[bed.roomId].push(bed);

            return acc;
        }, {});
    }, [availableBeds])

    // const roomBeds = bedsByRoom[item.id] || [];


    useEffect(() => {
        if (!activeHostelId) return;

        // 🔥 RESET OLD HOSTEL DATA
        setFloors([]);
        setRooms([]);
        // setBedsByRoom({});
        setSelectedFloorId(null);
        setActiveFloorIndex(0);

        // 🔥 LOAD NEW HOSTEL DATA
        loadFloors();

    }, [activeHostelId]);

    // const handleBedAdded = async (roomId) => {
    //     const res = await getAllBedsByRoom(roomId);
    //     if (res.success) {

    //         setBedsByRoom(prev => ({
    //             ...prev,
    //             [roomId]: res.data,
    //         }));
    //     }
    // };
    // useFocusEffect(
    //     React.useCallback(() => {
    //         rooms.forEach(async (room) => {
    //             const res = await getAllBedsByRoom(room.id);
    //             if (res.success) {
    //                 setBedsByRoom(prev => ({
    //                     ...prev,
    //                     [room.id]: res.data,
    //                 }));
    //             }
    //         });
    //     }, [rooms])
    // );



    useEffect(() => {
        setShowFloorMenu(false);
    }, [activeFloorIndex, selectedFloorId]);

    //   useFocusEffect(
    //     useCallback(() => {
    //       route?.params?.setShowTabBar?.(!isAnySheetOpen);
    //     }, [isAnySheetOpen])
    //   );

    useFocusEffect(
        React.useCallback(() => {
            setShowFloorMenu(false);
            setOpenMenuRoomId(null);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            setShowFloorMenu(false);
            setOpenMenuRoomId(null);
            setShowActionSheet(false);
            setShowAddBed(false);
            setShowManageBed(false);
        }, [])
    )

    // useFocusEffect(
    //   useCallback(()=>{
    //     return()=>{
    //       setShowTabBar(true);
    //     }
    //   },[])
    // )



    // const getBedStatus = (bed) => {
    //   const statuses = [];

    //   if (bed.isBooked) statuses.push("reserved");
    //   if (bed.onNotice) statuses.push("noticeperiod");
    //   if (bed.overDue) statuses.push("overdue");
    //   if (bed.isOccupied) statuses.push("occupied");

    //   return statuses.length ? statuses.join(",") : "available";
    // };
    // useEffect(() => {
    //   if (!rooms.length) return;

    //   rooms.forEach(room => {
    //     handleBedAdded(room.id);
    //   });
    // }, [rooms]);


    // useEffect(() => {
    //   if (!rooms.length) return;

    //   rooms.forEach(async (room) => {
    //     const res = await getAllBedsByRoom(room.id);
    //     if (res.success) {
    //       setBedsByRoom(prev => ({
    //         ...prev,
    //         [room.id]: res.data,
    //       }));
    //     }
    //   });
    // }, [rooms]);



    //   const translateY = React.useRef(new Animated.Value(300)).current;


    const splitStatus = (status) => {
        if (!status) return [];
        return status.split(",").map((s) => s.trim());
    };


    const getPrimaryStatus = (status) => {
        if (!status) return "";
        const statuses = splitStatus(status);

        if (statuses.includes("noticeperiod")) return "noticeperiod";
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

    //   const panResponder = PanResponder.create({
    //     onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
    //     onPanResponderMove: (_, gestureState) => {
    //       if (gestureState.dy > 0) {
    //         translateY.setValue(gestureState.dy);
    //       }
    //     },
    //     onPanResponderRelease: (_, gestureState) => {
    //       if (gestureState.dy > 120) {
    //         setShowActionSheet(false);
    //       } else {
    //         Animated.spring(translateY, {
    //           toValue: 0,
    //           useNativeDriver: true,
    //         }).start();
    //       }
    //     },
    //   });


    // useEffect(() => {
    //   if (route?.params?.setShowTabBar) {
    //     route.params.setShowTabBar(
    //       !showAddFloor &&
    //       !showActionSheet &&
    //       !showAddRoom &&
    //       !showAddBed &&
    //       !showManageBed &&
    //       !showReservedSheet &&
    //       !showOccupiedSheet &&
    //       !showNoticePeriodSheet &&
    //       !showNewBooking &&
    //       !showDoubleStatus &&
    //       !showInactiveSheet &&
    //       !showNotice &&
    //       !showCheckout
    //     );
    //   }
    // }, [
    //   showAddFloor,
    //   showActionSheet,
    //   showAddRoom,
    //   showAddBed,
    //   showManageBed,
    //   showReservedSheet,
    //   showOccupiedSheet,
    //   showNoticePeriodSheet,
    //   showNewBooking, showDoubleStatus,
    //   route, showInactiveSheet,showNotice,showCheckout
    // ]);






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
            if (showInactiveSheet) {
                setShowInactiveSheet(false)
                return true;
            }
            if (showNotice) {
                setShowNotice(false)
                return true;

            }
            if (showCheckout) {
                setShowCheckout(false)
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
        showNewBooking, showDoubleStatus, showInactiveSheet, showNotice, showCheckout
    ]);

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
            rooms: rooms,
            selectedBed

        });

        setShowOccupiedSheet(false);
        setShowDoubleStatus(false)
    };

    const handleNoticeToBookin = () => {
        setShowNoticePeriodSheet(false);
        setShowNewBooking(true);
        setShowDoubleStatus(false)
    };
    const handleNoticeToCheckout = () => {
        setShowCheckout(true)
        setShowNoticePeriodSheet(false);
        setShowDoubleStatus(false)
    }

    const handleShowFinalSettlement = () => {
        setShowNoticePeriodSheet(false);
        // navigation.navigate("FinalSettlement");
        navigation.navigate("FinalSettlementScreen", {
            selectedBed: selectedBed
            // selectedBed?.currentTenantInfo?.[0]?.tenetId,
        });
        setShowDoubleStatus(false)
    };

    const handleShowCancelNotice = () => {
        setShowNoticePeriodSheet(false);
        navigation.navigate("CancelNotice", {
            selectedBed: selectedBed,
        });
        setShowDoubleStatus(false)
    };
    // const handleMakeUsInActive = () => {
    //   setShowDoubleStatus(false)
    //   setShowInactiveSheet(true)
    // }
    const handleMakeUsInActive = (item) => {
        setInactiveTenant(item);
        setShowDoubleStatus(false);
        setShowInactiveSheet(true);
    };

    // const handleCheckIn = () => {
    //     setShowDoubleStatus(false)
    //     setShowReservedSheet(false)

    //     navigation.navigate("ReserveToCheckin", {
    //         selectedBed: selectedBed,
    //         onBedAdded: handleBedAdded
    //     });
    // }
    const handleAddBed = (roomId) => {
        setShowFloorMenu(false);
        setOpenMenuRoomId(null);
        setSelectedBedRoomId(roomId);
        setShowAddBed(true);

    };
    const activeFloor = floors[activeFloorIndex];

    const getFloorLabel = (name = "") => {
        const trimmed = name.trim();

        // if name starts with number → return full number part
        if (/^\d+/.test(trimmed)) {
            return trimmed.match(/^\d+/)[0]; // "11" → "11"
        }

        // else return first letter
        return trimmed.charAt(0).toUpperCase();
    };


    const showReadBlockedState = activeHostelId && !canReadPayingGuests;

    const floorAccumulator = useRef(0);
    const [showFloorBar, setShowFloorBar] = useState(true);
    const lastScrollY = useRef(0);
    const isHiddenRef = useRef(false);
    const floorAnim = useRef(new Animated.Value(1)).current;
    const [floorHeight, setFloorHeight] = useState(0);
    const scrollAccumulator = useRef(0);
    const ticking = useRef(false);


    // const onScroll = (e) => {
    //     handleScroll(e);
    //     handleFloorScroll(e);
    // };



    const triggerPoint = useRef(0);



    const handleFloorScroll = (event) => {
        const y = event.nativeEvent.contentOffset.y;

        if (y < 0) return;

        const diff = y - lastScrollY.current;

        if (Math.abs(diff) < 10) {
            lastScrollY.current = y;
            return;
        }



        if (diff > 0) {
            if (!isHiddenRef.current) {
                isHiddenRef.current = true;
                setShowFloorBar(false);
            }
        }

        else if (diff < 0) {
            if (isHiddenRef.current) {
                isHiddenRef.current = false;
                setShowFloorBar(true);
            }
        }

        lastScrollY.current = y;
    };






    if (!visible) return null;



    return (
        <>
            <SuccessModal visible={showSuccess} message={message} type={modalType} />
            <View style={styles.wrapper} pointerEvents="box-none">
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={() => {
                        Keyboard.dismiss();
                        resetState();
                    }}
                />

                {showDropdown && (
                    <Pressable
                        style={styles.dropdownBackdrop}
                        onPress={() => setShowDropdown(false)}
                    />
                )}

                <Animated.View
                    {...(!showDropdown ? panResponder.panHandlers : {})}
                    style={[
                        styles.sheet,
                        {
                            transform: [
                                { translateY },
                                { translateY: Animated.multiply(keyboardOffset, -1) },
                            ],
                        },
                    ]}
                >
                    <View style={styles.handle} />

                    {/* <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 40,
                            paddingTop: 6
                        }}
                    > */}
                    <View style={styles.container} pointerEvents={isAnySheetOpen ? "none" : "auto"}>


                        <View style={{ paddingVertical: 5 }}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                            ></ScrollView>
                        </View>


                        {!showReadBlockedState && showFloorBar && (

                            <View style={{ flexDirection: "row", marginLeft: 10 }}>
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
                                            // onPress={() => {
                                            //   setActiveFloorIndex(i);
                                            //   setSelectedFloorId(f.id);
                                            //    setOpenMenuRoomId(null);


                                            // }}
                                            onPressIn={() => {
                                                setShowFloorMenu(false);   // 👈 menu close immediately
                                            }}
                                            onPress={() => {
                                                setActiveFloorIndex(i);
                                                setSelectedFloorId(f.id);
                                                setOpenMenuRoomId(null)

                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 8,
                                                    width: "100%",
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
                                                        {getFloorLabel(f.name)}
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
                        )
                        }

                        {showReadBlockedState && (
                            <View style={styles.centerContainer}>
                                <Image source={EmptyFloor} style={styles.image} />
                                <Text style={styles.noFloorText}>
                                    You don’t have permission to view PG details
                                </Text>
                            </View>
                        )}


                        {!loading && !showReadBlockedState && floors.length === 0 && (
                            <View style={styles.centerContainer}>
                                <Image source={EmptyFloor} style={styles.image} />
                                <Text style={styles.noFloorText}>No floors are there!</Text>


                            </View>
                        )}


                        {!loading && !showReadBlockedState && floors.length > 0 && rooms.length === 0 && (
                            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 40, }}>
                                <Image source={EmptyFloor} style={styles.image} />
                                <Text style={styles.noFloorText}>No Rooms are there!</Text>


                            </View>
                        )}

                        {console.log('haha', rooms)}
                        {!showReadBlockedState && (
                            <FlatList
                                contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
                                data={rooms}
                                scrollEnabled={!isAnySheetOpen && !isKeyboardOpen}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode="none"
                                // onScroll={onScroll}
                                bounces={false}
                                scrollEventThrottle={16}

                                // keyExtractor={(item) => item.id}
                                keyExtractor={(item) => String(item?.id)}
                                renderItem={({ item }) => {

                                    //   const bedCount = bedsByRoom[item.id]?.length || 0;
                                    const bedCount = (bedsByRoom[item.id] || []).length;
                                    return (
                                        <View style={styles.roomCard}>
                                            <TouchableOpacity
                                                style={styles.roomHeader}
                                                activeOpacity={0.8}
                                                onPress={() => {

                                                    setSelectedRoomId(item.roomId);
                                                }}
                                            >
                                                <View>
                                                    <Text style={styles.roomTitle}>{item.name}</Text>

                                                </View>

                                                <Text style={styles.roomSubtitle}>{bedCount} Sharing</Text>

                                                {/* <TouchableOpacity
                      style={styles.addRoomBtn}
                      onPress={() => {
                        setShowFloorMenu(false);
                        setOpenMenuRoomId(
                          openMenuRoomId === item.id ? null : item.id
                        );
                      }}
                    >
                      <Image source={Dots} style={{ width: 22, height: 22 }} />
                    </TouchableOpacity> */}
                                            </TouchableOpacity>



                                            <View style={styles.bedsRow}>

                                                {bedsByRoom[item?.id]?.map((b) => {

                                                    console.log("bedds",
                                                        bedsByRoom[item.id].map(b => ({
                                                            id: b.id,
                                                            bedId: b.bedId,
                                                            bedName: b.bedName,
                                                        }))
                                                    );
                                                    const status = getBedStatus(b);
                                                    console.log("bedsByRoom..b", b)
                                                    let statusArray = [];
                                                    let statusCount = 0;

                                                    // Website exact logic match
                                                    if (b.isBooked && b?.onNotice) {
                                                        statusCount = (b?.overDue) ? 3 : 2;

                                                        if (b?.isBooked) statusArray.push("reserved");
                                                        if (b?.onNotice) statusArray.push("noticeperiod");
                                                        if (b?.overDue) statusArray.push("overdue");
                                                    }
                                                    else if (b?.overDue && b?.onNotice) {
                                                        statusCount = (b?.overDue) ? 2 : 3;

                                                        if (b?.onNotice) statusArray.push("noticeperiod");
                                                        if (b?.overDue) statusArray.push("overdue");
                                                    }
                                                    else if (b?.overDue && b?.isBooked) {
                                                        statusArray = ["overdue"];
                                                        statusCount = 2;
                                                    }
                                                    else if (b?.overDue && !b?.isBooked && !b?.onNotice) {
                                                        statusArray = ["overdue"];
                                                        statusCount = 1;
                                                    }
                                                    else if (b?.isBooked && !b?.onNotice) {
                                                        statusArray = ["reserved"];
                                                        statusCount = 1;
                                                    }
                                                    else if (b?.onNotice && !b?.isBooked) {
                                                        statusArray = ["noticeperiod"];
                                                        statusCount = 1;
                                                    }


                                                    return (
                                                        <TouchableOpacity
                                                            // key={b?.id}
                                                            key={`${item.id}-${b.bedId}`}
                                                            style={styles.bedItem}
                                                            onPress={() => handleBedPress(b, item)}
                                                        >
                                                            <View style={styles.bedWrapper}>

                                                                <Image
                                                                    source={
                                                                        selectedBed?.bedId === b?.bedId
                                                                            ? BedBlue      // blue bed
                                                                            : BedEmpty         // white bed
                                                                    }
                                                                    style={styles.bedIcon}
                                                                />

                                                                {/* Existing status icons */}
                                                                {statusCount > 1 ? (
                                                                    <View style={styles.multiBadge}>
                                                                        <Text style={styles.multiBadgeText}>
                                                                            {statusCount}
                                                                        </Text>
                                                                    </View>
                                                                ) : statusCount === 1 ? (
                                                                    <Image
                                                                        source={overlayIcons[statusArray[0]]}
                                                                        style={styles.overlayIcon}
                                                                    />
                                                                ) : null}

                                                                {/* Tick only for selected bed */}
                                                                {selectedBed?.bedId === b?.bedId && (
                                                                    <Image
                                                                        source={TickIcon}
                                                                        style={styles.tickIcon}
                                                                    />
                                                                )}

                                                            </View>

                                                            <Text style={styles.bedLabel}>
                                                                {b.bedName}
                                                            </Text>

                                                        </TouchableOpacity>
                                                    );
                                                })}




                                                {bedsByRoom[item.id] && bedsByRoom[item.id].length === 0 && (
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 14, fontWeight: '400', color: '#222222' }}>No Beds are there</Text>

                                                    </View>

                                                )}

                                            </View>
                                        </View>
                                    )


                                }}
                            />
                        )}
                    </View>

                    {selectedBed && (
                        <View style={styles.bottomCard}>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.bottomTitle}>
                                    {selectedBed.roomName} | {selectedBed.bedName}
                                </Text>

                                <Text style={styles.bottomSub}>
                                    {selectedBed.sharing} Sharing | ₹{selectedBed.rentAmount}/Month
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.continueBtn}
                                onPress={() => {
                                    onSelect?.(selectedBed);
                                    onClose?.();
                                    setLastActiveTab(type)
                                }}
                            >
                                <Text style={styles.continueTxt}>Continue</Text>

                                <Image
                                    source={require("../../Assets/Images/ArrowRight.png")}
                                    style={{
                                        width: 18,
                                        height: 18,
                                        marginLeft: 8,
                                        tintColor: "#fff",
                                    }}
                                />
                            </TouchableOpacity>

                        </View>
                    )}



                    {/* </ScrollView> */}
                </Animated.View>
            </View>


        </>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    wrapper: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        zIndex: 1000,
        elevation: 1000,
    },

    dropdownBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "transparent",
        zIndex: 9998,
    },

    sheet: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: SHEET_HEIGHT,
        backgroundColor: "#fff",
        paddingHorizontal: 14,
        paddingTop: 8,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        zIndex: 1001,
        elevation: 1001,
    },

    handle: {
        // width: 60,
        // height: 5,
        // borderRadius: 3,
        // backgroundColor: "#D1D5DB",
        // alignSelf: "center",
        // marginBottom: 12,

        width: 64,
        height: 6,
        borderRadius: 10,
        backgroundColor: "#D1D5DB",
        marginBottom: 26,
        alignSelf: "center",
    },

    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "ios" ? 10 : 14,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        fontSize: 24,
        fontFamily: "Gilroy-Bold",
        color: "#232323",
    },

    closeBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    closeIcon: {
        width: 16,
        height: 16,
        tintColor: "#111827",
    },

    divider: {
        height: 1,
        backgroundColor: "#ECECEC",
        // marginBottom: 8,
        marginTop: 10,
    },

    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    avatarText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#374151",
    },

    userName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 6,
    },

    chipRow: {
        flexDirection: "row",
        gap: 10,
    },

    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },

    chipText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#111827",
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 6,
    },

    dropdownInput: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
        backgroundColor: "#fff",
    },

    dropdownText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#111827",
    },

    arrow: {
        width: 18,
        height: 18,
        tintColor: "#9CA3AF",
    },

    dropdownBoxOverlay: {
        position: "absolute",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        overflow: "hidden",
        zIndex: 9999,
        elevation: 20,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },

    dropdownItem: {
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },

    dropdownItemText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#111827",
    },

    amountInput: {
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#F3F4F6",
        fontSize: 16,
        color: "#111827",
        marginBottom: 18,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 22,
        marginTop: 8,
    },

    cancelText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6B7280",
    },

    assignButton: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 26,
        paddingVertical: 12,
        borderRadius: 14,
        minWidth: 110,
        alignItems: "center",
        justifyContent: "center",
    },

    assignButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },

    errorText: {
        color: "red",
        fontSize: 13,
        marginBottom: 10,
        fontWeight: "500",
    },


    actionCard: {
        marginTop: 26,
        backgroundColor: "#fff",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        paddingHorizontal: 22,
        paddingVertical: 22,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },

    progressTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Medium",
        color: "#353535",
    },

    progressBackground: {
        height: 14,
        borderRadius: 20,
        backgroundColor: "#E9EDF3",
        overflow: "hidden",
    },

    progressFill: {
        height: 14,
        width: "70%",
        backgroundColor: "#FF8A00",
        borderRadius: 20,
    },

    percentBadge: {
        backgroundColor: "#FFF4DD",
        borderRadius: 30,
        height: 44,
        minWidth: 72,
        justifyContent: "center",
        alignItems: "center",
    },

    percentText: {
        color: "#F58A07",
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
    },
    // percentBadge:{
    //     backgroundColor:"#FFF3DD",
    //     borderRadius:18,
    //     paddingHorizontal:12,
    //     paddingVertical:6,
    // },

    // percentText:{
    //     color:"#EB6617",
    //     fontFamily:"Gilroy-Bold",
    // },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    cardTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
        color: "#232323",
    },
    description: {
        fontSize: 14,
        // lineHeight:31,
        color: "#4B4B4B",
        fontFamily: "Gilroy-Regular",
    },

    addText: {
        marginLeft: 18,
        color: "#00A32E",
        fontSize: 15,
        fontFamily: "Gilroy-Medium",
    },

    reminderBtn: {
        marginTop: 24,
        alignSelf: "flex-end",

        width: 180,
        height: 46,

        borderRadius: 13,
        backgroundColor: "#2952E8",

        justifyContent: "center",
        alignItems: "center",
    },

    reminderText: {
        fontSize: 15,
        color: "#fff",
        fontFamily: "Gilroy-SemiBold",
    },
    pendingText: {
        fontSize: 20,
        color: "#1F2937",
        fontFamily: "Gilroy-Bold",
    },

    pendingCount: {
        fontFamily: "Gilroy-Bold",
    },
    requestedBtn: {
        backgroundColor: "#E8F1FF",
    },

    completedBtn: {
        backgroundColor: "#E8F8EE",
    },

    completedText: {
        color: "#16A34A",
    },

    floorTab: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        width: 110,
    },

    floorLabel: {
        fontSize: 12,
        color: "#777",
        fontFamily: "Gilroy-Semibold",
        textAlign: "center",
        width: "100%",
        flexShrink: 1,
        lineHeight: 17,
    },

    floorLabelActive: {
        color: "#1E45E1",
        fontFamily: "Gilroy-Bold",
        textAlign: "center",
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
        fontSize: 15,
        fontFamily: "Gilroy-Bold",
        textAlign: "center",
    },

    circleTextActive: {
        color: "#fff",
    },

    // floorLabel: {
    //   fontSize: 12,
    //   color: "#777",
    //   fontFamily: "Gilroy-Semibold"
    // },

    // floorLabelActive: {
    //   color: "#1E45E1",
    //  fontFamily: "Gilroy-Bold" ,
    // },
    roomCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,

        elevation: 2,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },

        borderWidth: Platform.OS === "ios" ? 3 : 1,
        borderColor: "#E5E7EB",
    },

    // roomCard: {
    //   backgroundColor: "#fff",
    //   borderRadius: 12,
    //   padding: 14,
    //   marginBottom: 14,
    //   elevation: 2,
    //   borderWidth: 1,
    //   borderColor: "#F2F4F8",
    // },

    // roomHeader: {
    //   flexDirection: "row",
    //   justifyContent: "space-between",
    //   marginBottom: 12,
    //   backgroundColor:"red"
    // },
    roomHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        backgroundColor: "#EAF2FF",
        paddingHorizontal: 14,
        paddingVertical: 8,

        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,

        marginLeft: -14,
        marginRight: -14,
        marginTop: -14,

        marginBottom: 12,
    },

    roomTitle: { fontSize: 16, fontFamily: "Gilroy-Bold" },
    roomSubtitle: { fontSize: 12, color: "#888", fontFamily: "Gilroy-Semibold" },

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

    bedLabel: { fontSize: 12, fontFamily: "Gilroy-Medium" },

    centerContainer: {
        // flex: 3,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 150,
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
        fontFamily: "Gilroy-Semibold",
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
        fontFamily: "Gilroy-Semibold"
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
        fontFamily: "Gilroy-Semibold"
    },

    multiBadge: {
        position: "absolute",
        top: -6,
        right: 6,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#00A32E",
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },

    multiBadgeText: {
        color: "#00A32E",
        fontSize: 11,
        fontWeight: "700",
    },
    menuBox: {
        position: "absolute",
        top: 50,
        right: 16,
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
    menuBox1: {
        position: "absolute",
        top: 150,
        right: 16,
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


    // menuBox: {
    //   position: "absolute",
    //   top: 45,
    //   right: 10,
    //   backgroundColor: "#fff",
    //   borderRadius: 10,
    //   paddingVertical: 6,
    //   width: 120,
    //   elevation: 6,
    //   shadowColor: "#000",
    //   shadowOpacity: 0.1,
    //   shadowRadius: 10,
    //   zIndex: 999,
    // },

    menuItem: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 14,
    },

    menuText: {
        fontSize: 14,
        color: "#333",
        fontFamily: "Gilroy-Semibold"
    },
    deleteOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    deleteBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 22,
        paddingHorizontal: 18,
    },

    deleteTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
        color: '#111',
        textAlign: 'center',
    },

    deleteSub: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 20,
    },

    deleteBtnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 22,
    },

    cancelBtn: {
        flex: 1,
        paddingVertical: 12,
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cancelText: {
        color: '#444',
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
    },

    deleteBtn: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: "#2D6CDF",
        alignItems: "center",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    deleteBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    addBedBox: {
        width: 50,
        alignItems: "start",
        justifyContent: "center",
    },

    addIconBox: {
        width: 50,
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",

    },

    addIconImg: {
        width: 30,
        height: 30,

    },

    bedWrapper: {
        position: "relative",
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
    },

    bedIcon: {
        width: 38,
        height: 35,
    },

    tickIcon: {
        position: "absolute",
        top: -4,
        right: -4,
        width: 18,
        height: 18,
        zIndex: 100,
    },

    overlayIcon: {
        position: "absolute",
        top: -4,
        right: -4,
        width: 18,
        height: 18,
    },

    multiBadge: {
        position: "absolute",
        top: -4,
        right: -4,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#00A32E",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    bottomCard: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: Platform.OS === "ios" ? 28 : 18,

        backgroundColor: "#FFFFFF",

        borderTopWidth: 1,
        borderTopColor: "#EAEAEA",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,

        elevation: 10,
    },

    bottomTitle: {
        fontSize: 20,
        color: "#2952E8",
        fontFamily: "Gilroy-Bold",
    },

    bottomSub: {
        marginTop: 6,
        fontSize: 15,
        color: "#555",
        fontFamily: "Gilroy-Medium",
    },

    continueBtn: {
        marginLeft: 16,

        width: 150,
        height: 54,

        borderRadius: 14,
        backgroundColor: "#2952E8",

        justifyContent: "center",
        alignItems: "center",

        flexDirection: "row",
    },

    continueTxt: {
        color: "#FFFFFF",
        fontSize: 17,
        fontFamily: "Gilroy-Bold",
    },

});
