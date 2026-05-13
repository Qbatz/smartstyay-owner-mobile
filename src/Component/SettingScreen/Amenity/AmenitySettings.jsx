import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
  Keyboard,
  Modal,
  ScrollView,
  BackHandler,
  Dimensions,
} from "react-native";
import { CommonContexts } from "../../../Context/CommonContext";
import { AmenityContext } from "../../../Context/AmenityContext";
import { useHasPermission } from "../../../Utils/useHasPermission";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import Loader from "../../../Component/Loader/Loader"
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import EmptyAmenity from "../../../Assets/Images/Empty_state.png";
import Dots from "../../../Assets/Images/3dots.png";
import EditIcon from "../../../Assets/Images/editIcon.png";
import TrashIcon from "../../../Assets/Images/trash.png";
import AddIcon from "../../../Assets/Images/add-circle.png";
import LinkIcon from "../../../Assets/Images/link.png";
import Arrowup from "../../../Assets/Images/arrow_up_white.png";
import Arrowdown from "../../../Assets/Images/arrow_down_white.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png"
import BedIcon from "../../../Assets/Images/Bed_Icon.png"
import { useCustomer } from "../../../Context/CustomerContext";
import DownArrow from "../../../Assets/Images/direction-down.png";


const sampleUsersInit = [
  {
    id: "u1",
    name: "Maharajan.k",
    floor: "Ground Floor",
    room: "203",
    bed: "03",
    assigned: false,
  },
  {
    id: "u2",
    name: "Revanth",
    floor: "Ground Floor",
    room: "205",
    bed: "11",
    assigned: false,
  },
  {
    id: "u3",
    name: "Bharath",
    floor: "First Floor",
    room: "205",
    bed: "11",
    assigned: true,
  },
];
const SCREEN_HEIGHT = Dimensions.get("window").height;
export default function AmenitySettings({ navigation }) {



  const { activeHostelId } = useContext(CommonContexts);

  const {
    amenities,
    amenityDetail,
    loading,
    GetAllAmenities,
    ParticularAmenityDetails,
    addAmenity,
    updateAmenity,
    deleteAmenity,
    assignAmenity,
    unAssignAmenity,
  } = useContext(AmenityContext);

  console.log("amenity", amenities, amenityDetail, addAmenity);


  const { getCustomersByHostel, GetParticularCustomerDetails } = useCustomer();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");


  const [showMenu, setShowMenu] = useState(false);
  const [menuAmenityId, setMenuAmenityId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const [showSheet, setShowSheet] = useState(false);
  const sheetY = useRef(new Animated.Value(700)).current;


  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialAmenityState, setInitialAmenityState] = useState(null);
  const [noChangeError, setNoChangeError] = useState("");

  const [amenityName, setAmenityName] = useState("");
  const [amenityPriceText, setAmenityPriceText] = useState("");
  const [amenityToggle, setAmenityToggle] = useState(true);

  const [amenityError, setAmenityError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectAmenityError, setSelectAmenityError] = useState("")
  const [showUnassigned, setShowUnassigned] = useState(true);
  const [showAssigned, setShowAssigned] = useState(true);



  useEffect(() => {
    if (activeHostelId) {
      GetAllAmenities(activeHostelId);
      fetchCustomers();
    }
  }, [activeHostelId]);

  const fetchCustomers = async () => {
    const data = await getCustomersByHostel(activeHostelId);
    setCustomers(data.listCustomers || []);
  };

  const {
    canWriteModule: canWriteAmenities,
    canReadModule: canReadAmenities,
    canUpdateModule: canUpdateAmenities,
    canDeleteModule: canDeleteAmenities,
  } = useHasPermission("Amenities");


  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      const h = e.endCoordinates?.height || 280;
      Animated.timing(sheetY, {
        toValue: -h + 80,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [sheetY]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (showSheet) {
        closeSheet();
        return true;
      }
      if (showAssign) {
        setShowAssign(false)
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [showSheet, showAssign]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [])

  const sheetPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeSheet();
        else
          Animated.spring(sheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
      },
    })
  ).current;

  const openSheet = (edit = false, item = null) => {
    sheetY.setValue(700);
    setIsEdit(edit);

    if (edit && item) {
      setAmenityName(item.name);
      setAmenityPriceText(String(item.amount));
      setAmenityToggle(item.proRate);
      setEditingId(item.id);

      // ✅ STORE INITIAL STATE
      setInitialAmenityState({
        name: item.name,
        amount: Number(item.amount),
        proRate: item.proRate,
      });
    } else {
      setAmenityName("");
      setAmenityPriceText("");
      setAmenityToggle(true);
      setEditingId(null);
      setInitialAmenityState(null);
    }

    setAmenityError("");
    setPriceError("");
    setNoChangeError("");

    setShowSheet(true);
    Animated.timing(sheetY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const handleShowAmenity = () => {
    if (!activeHostelId) {
      setModalType("warning");
      setModalMessage("Please Add a Hostel First");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
      return;
    }
    openSheet(false)
  }



  const closeSheet = () => {
    Animated.timing(sheetY, { toValue: 700, duration: 200, useNativeDriver: true }).start(() => {
      setShowSheet(false);
      setAmenityName("");
      setAmenityPriceText("");
      setAmenityToggle(true);
      setIsEdit(false);
      setEditingId(null);
      setAmenityError("")
      setPriceError("")
      setNoChangeError("");
    });
  };

  // const saveAmenity = async () => {
  //   let valid = true;

  //   const name = amenityName.trim();
  //   const amount = Number(amenityPriceText);

  //   // RESET ERRORS
  //   setAmenityError("");
  //   setPriceError("");
  //   setNoChangeError("");

  //   if (!name) {
  //     setAmenityError("Please Enter Amenity Name");
  //     valid = false;
  //   }

  //   if (!amenityPriceText) {
  //     setPriceError("Please Enter Price");
  //     valid = false;
  //   } else if (isNaN(amount)) {
  //     setPriceError("Price Must Be a Number");
  //     valid = false;
  //   } else if (amount <= 0) {
  //     setPriceError("Price Must Be Greater Than 0");
  //     valid = false;
  //   }

  //   if (isEdit && initialAmenityState) {
  //     const isChanged =
  //       initialAmenityState.name !== name ||
  //       initialAmenityState.amount !== amount ||
  //       initialAmenityState.proRate !== amenityToggle;

  //     if (!isChanged) {
  //       setNoChangeError("No Changes Detected");
  //       valid = false;
  //     }
  //   }

  //   if (!valid) return;

  //   if (isEdit && editingId) {
  //     await updateAmenity({
  //       hostelId: activeHostelId,
  //       amenityId: editingId,
  //       payload: {
  //         amenityName: name,
  //         amount: amount,
  //         proRate: amenityToggle,
  //       },
  //     });
  //   } else {
  //     await addAmenity({
  //       hostelId: activeHostelId,
  //       payload: {
  //         amenityName: name,
  //         amount: amount,
  //         proRate: amenityToggle,
  //       },
  //     });
  //   }

  //   closeSheet();
  // };


  const saveAmenity = async () => {
    let valid = true;

    const name = amenityName.trim();
    const amount = Number(amenityPriceText);

    setAmenityError("");
    setPriceError("");
    setNoChangeError("");

    if (!name) {
      setAmenityError("Please Enter Amenity Name");
      valid = false;
    }

    if (!amenityPriceText) {
      setPriceError("Please Enter Price");
      valid = false;
    } else if (isNaN(amount)) {
      setPriceError("Price Must Be a Number");
      valid = false;
    } else if (amount <= 0) {
      setPriceError("Price Must Be Greater Than 0");
      valid = false;
    }

    if (isEdit && initialAmenityState) {
      const isChanged =
        initialAmenityState.name !== name ||
        initialAmenityState.amount !== amount ||
        initialAmenityState.proRate !== amenityToggle;

      if (!isChanged) {
        setNoChangeError("No Changes Detected");
        valid = false;
      }
    }

    if (!valid) return;

    let res;

    if (isEdit && editingId) {
      res = await updateAmenity({
        hostelId: activeHostelId,
        amenityId: editingId,
        payload: {
          amenityName: name,
          amount: amount,
          proRate: amenityToggle,
        },
      });
    } else {
      res = await addAmenity({
        hostelId: activeHostelId,
        payload: {
          amenityName: name,
          amount: amount,
          proRate: amenityToggle,
        },
      });
    }

    if (!res?.success) {
      setModalType("warning");
      setModalMessage(res?.message || "Something went wrong");
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 1500);
      return;
    }

    setModalType("success");
    setModalMessage(res.message);
    setShowSuccessModal(true);

    setTimeout(() => setShowSuccessModal(false), 1500);

    closeSheet();
  };




  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };


  //  const doDelete = async () => {
  //   if (!deleteId) return;

  //   await deleteAmenity({
  //     hostelId: activeHostelId,
  //     amenityId: deleteId,
  //   });

  //   setShowDeleteConfirm(false);
  //   setDeleteId(null);
  // };

  const doDelete = async () => {
    if (!deleteId) return;

    const res = await deleteAmenity({
      hostelId: activeHostelId,
      amenityId: deleteId,
    });

    if (!res?.success) {
      setModalType("warning");
      setModalMessage(res?.message || "Unable to delete amenity");
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 1500);
      return;
    }

    setModalType("success");
    setModalMessage(res.message);
    setShowSuccessModal(true);

    setTimeout(() => setShowSuccessModal(false), 1500);

    setShowDeleteConfirm(false);
    setDeleteId(null);
  };



  const toggleActive = async (item) => {
    const newValue = !item.proRate;

    await updateAmenity({
      hostelId: activeHostelId,
      amenityId: item.id,
      payload: {
        amenityName: item.name,
        amount: item.amount,
        proRate: newValue,
      },
    });
  };



  const [showAssign, setShowAssign] = useState(false);
  const assignY = useRef(new Animated.Value(900)).current;
  const assignPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) assignY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeAssign();
        else Animated.spring(assignY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  const [sampleUsers, setSampleUsers] = useState(sampleUsersInit.map((u) => ({ ...u, selected: false })));
  const [currentAmenityId, setCurrentAmenityId] = useState(null);

  const openAssign = async (amenityId) => {
    setCurrentAmenityId(amenityId);

    const res = await ParticularAmenityDetails({
      hostelId: activeHostelId,
      amenityId,
    });

    if (res?.success) {
      const assigned = res.data.assigned.map((u) => ({
        ...u,
        assigned: true,
        selected: false,
        id: u.customerId,
        name: u.customerName,
        floor: "",
        room: "",
        bed: "",
      }));

      const unAssigned = res.data.unAssigned.map((u) => ({
        ...u,
        assigned: false,
        selected: false,
        id: u.customerId,
        name: u.customerName,
        floor: "",
        room: "",
        bed: "",
      }));

      setSampleUsers([...unAssigned, ...assigned]);
    }

    assignY.setValue(900);
    setShowAssign(true);
    Animated.timing(assignY, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  };


  const closeAssign = () => {
    Animated.timing(assignY, { toValue: 900, duration: 200, useNativeDriver: true }).start(() => {
      setShowAssign(false);
      setSampleUsers((prev) => prev.map((u) => ({ ...u, selected: false })));
      setCurrentAmenityId(null);
    });
  };

  const toggleUserSelect = (id) => {
    setSampleUsers((prev) => prev.map((u) => (u.id === id ? { ...u, selected: !u.selected } : u)));
  };


  const moveDownSelected = async () => {
    console.log("cholo")
    const customers = sampleUsers
      .filter((u) => !u.assigned && u.selected)
      .map((u) => u.id);

    if (customers.length === 0) return;

   const res= await assignAmenity({
      hostelId: activeHostelId,
      amenityId: currentAmenityId,
      customers,
    });

    if(res.success === true){
      setModalType("success");
      setShowSuccessModal(true);
      setModalMessage(res?.message)

      setTimeout(() => {
        setShowSuccessModal(false)
        // onClose();
          setShowAssign(false)
      }, 1500);
    }else{
      setModalType("warning");
      setShowSuccessModal(true);
      setModalMessage(res?.message || "Something Went Wrong")

      setTimeout(() => {
        setShowSuccessModal(false)
      
      }, 1500);
    }

    console.log("amenityyy",res)

    // openAssign(currentAmenityId);
  };


  const moveUpSelected = async () => {
    const customers = sampleUsers
      .filter((u) => u.assigned && u.selected)
      .map((u) => u.id);

    if (customers.length === 0) return;

   const res= await unAssignAmenity({
      hostelId: activeHostelId,
      amenityId: currentAmenityId,
      customers,
    });

     if(res.success === true){
      setModalType("success");
      setShowSuccessModal(true);
      setModalMessage(res?.message)

      setTimeout(() => {
        setShowSuccessModal(false)
        setShowAssign(false)
      }, 1500);
    }else{
      setModalType("warning");
      setShowSuccessModal(true);
      setModalMessage(res?.message || "Something Went Wrong")

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 1500);
    }

    // openAssign(currentAmenityId)
  };



  const UserRow = ({ user }) => {
    console.log(user)
    return (
      <View style={styles.userRow}>
        <View style={styles.userLeft}>
          <View style={styles.avatar}>
            {/* <Text style={styles.avatarText}>{user.name?.[0] ?? "U"}</Text> */}
            {user?.profilePic ? <Image source={{uri:user?.profilePic}} style={{width:36,height:36,borderRadius:18}}/> :
            <Text style={styles.avatarText}>{user?.initials}</Text>}
          </View>

          <View style={{ marginLeft: 10, flex: 1, marginRight: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              <Text style={styles.userName}>{user.name}</Text>
              {!user.canAssign && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'red', marginLeft: 4 }} />}
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
                marginRight: 12
              }}
            >
              {/* Floor Badge */}
              <View style={styles.floorBadge}>
                <Text style={styles.floorBadgeText}>
                  {user.floorName}
                </Text>
              </View>

              {/* Room */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 4,
                  marginRight: 4

                }}
              >
                <Image
                  source={RoomIcon}
                  style={{ width: 21, height: 17, resizeMode: "contain" }}
                />
                <Text
                  style={[styles.metaText, { marginLeft: 2, flexShrink: 1 ,fontFamily: "Gilroy-Semibold" }]}
                >
                  {user.roomName}
                </Text>
              </View>

              {/* Separator */}
              {/* <Text style={{ color: "#666", marginHorizontal: 6 }}>
              |
            </Text> */}

              {/* Bed */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={BedIcon}
                  style={{ width: 21, height: 17, resizeMode: "contain" }}
                />
                <Text
                  style={[styles.metaText, { marginLeft: 4, flexShrink: 1 ,fontFamily: "Gilroy-Semibold" }]}
                >
                  {user.bedName}
                </Text>
              </View>
            </View>
          </View>

        </View>


        {
          user.canAssign == true ? <TouchableOpacity style={styles.checkbox} onPress={() => toggleUserSelect(user.id)}>
            {user.selected ? <Text style={styles.tick}>✓</Text> : null}
          </TouchableOpacity> : null
        }


      </View>
    );
  };

  const UserAssignedRow = ({ user }) => {
    console.log(user)
    return (
      <View style={styles.userRow}>
        <View style={styles.userLeft}>
          <View style={styles.avatar}>
            {/* <Text style={styles.avatarText}>{user.name?.[0] ?? "U"}</Text> */}
            {user?.profilePic ? <Image source={{uri:user?.profilePic}} style={{width:36,height:36,borderRadius:18}}/> :
            <Text style={styles.avatarText}>{user?.initials}</Text>}
          </View>

          <View style={{ marginLeft: 10, flex: 1, marginRight: 12 }}>

            <Text style={styles.userName}>{user.name}</Text>


            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
                marginRight: 12
              }}
            >
              {/* Floor Badge */}
              <View style={styles.floorBadge}>
                <Text style={styles.floorBadgeText}>
                  {user.floorName}
                </Text>
              </View>

              {/* Room */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 4,
                  marginRight: 4

                }}
              >
                <Image
                  source={RoomIcon}
                  style={{ width: 21, height: 17, resizeMode: "contain" }}
                />
                <Text
                  style={[styles.metaText, { marginLeft: 2, flexShrink: 1 ,fontFamily: "Gilroy-Semibold" }]}
                >
                  {user.roomName}
                </Text>
              </View>

              {/* Separator */}
              {/* <Text style={{ color: "#666", marginHorizontal: 6 }}>
              |
            </Text> */}

              {/* Bed */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={BedIcon}
                  style={{ width: 21, height: 17, resizeMode: "contain" }}
                />
                <Text
                  style={[styles.metaText, { marginLeft: 4, flexShrink: 1 ,fontFamily: "Gilroy-Semibold" }]}
                >
                  {user.bedName}
                </Text>
              </View>
            </View>
            {user.ending &&
              <Text style={{ fontSize: 12, fontWeight: 40, color: 'red', marginTop: 4 }}>Ending on: {user?.endDate}</Text>}

          </View>



        </View>


        <TouchableOpacity style={styles.checkbox} onPress={() => toggleUserSelect(user.id)}
          disabled={user?.ending}>
          {user.selected ? <Text style={styles.tick}>✓</Text> : null}
        </TouchableOpacity>



      </View>
    );
  };

  const unassigned = sampleUsers.filter((u) => !u.assigned);
  const assigned = sampleUsers.filter((u) => u.assigned);
  const anyUnassignedSelected = unassigned.some((u) => u.selected);
  const anyAssignedSelected = assigned.some((u) => u.selected);

  console.log("assigned", assigned)
  console.log("unassigned", unassigned)
  //  const CustomSwitch = ({ value, onToggle }) => {
  //     return (
  //          <View style={styles.switchRow}>
  //                    <Text style={[styles.switchLabel, { color: value ? "#3562FF" : "#A68DE3" }]}>
  //       {value ? "On" : "Off"}
  //     </Text>
  //       <TouchableOpacity onPress={() => onToggle(!value)}>
  //         <View
  //           style={[
  //             styles.switch,
  //             { backgroundColor: value ? "#3562FF" : "#A68DE3" },
  //           ]}
  //         >

  //           <Animated.View
  //             style={[
  //               styles.knob,
  //               { transform: [{ translateX: value ? 18 : 0 }] },
  //             ]}
  //           >
  //             <Text style={styles.knobText}>{value ? "✓" : "✕"}</Text>
  //           </Animated.View>
  //         </View>
  //       </TouchableOpacity>
  //       </View>
  //     );
  //   };







  const CustomSwitch = ({ value, onToggle, disabled }) => {
    return (
      <View style={styles.switchRow}>
        <Text
          style={[
            styles.switchLabel,
            { color: value ? "#3562FF" : "#A68DE3" },
            disabled && { opacity: 0.4 },
          ]}
        >
          {value ? "On" : "Off"}
        </Text>

        <TouchableOpacity
          disabled={disabled}
          onPress={() => !disabled && onToggle(!value)}
          style={{ opacity: disabled ? 0.4 : 1 }}
        >
          <View
            style={[
              styles.switch,
              { backgroundColor: value ? "#3562FF" : "#A68DE3" },
            ]}
          >
            <Animated.View
              style={[
                styles.knob,
                { transform: [{ translateX: value ? 18 : 0 }] },
              ]}
            >
              <Text style={styles.knobText}>{value ? "✓" : "✕"}</Text>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAmenity = ({ item }) => (
    <View style={{ marginBottom: 14 }}>
      <View style={styles.amenityCard}>
        <View style={styles.cardTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.priceRow}>
              ₹ {item.amount ?? 0}.00
              <Text style={styles.perMonth}>/month</Text>
            </Text>
          </View>

          <View style={styles.rightIcons}>
            <TouchableOpacity
              onPress={() => {
                openAssign(item.id);
              }}
              disabled={!canWriteAmenities}
              style={{ marginRight: 10, opacity: canWriteAmenities ? 1 : 0.4 }}
            >
              <Image source={LinkIcon} style={styles.linkIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={(e) => {
                e.target.measure((fx, fy, width, height, px, py) => {
                  setMenuPosition({ x: px, y: py });
                  setMenuAmenityId(item.id);
                  setShowMenu(true);
                });
              }}
            >
              <Image source={Dots} style={styles.dots} />
            </TouchableOpacity>


          </View>
        </View>

        <View style={styles.line} />

        <View style={styles.bottomRow}>
          <Text style={styles.prorateLabel}>Pro-Rate</Text>


          <CustomSwitch
            value={item.proRate}
            disabled={!canWriteAmenities}
            onToggle={() => toggleActive(item)}
          />

        </View>
      </View>
    </View>
  );



  return (
    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />

      {loading && <Loader />}

      <View style={[styles.container, { backgroundColor: showSheet || showAssign ? "transparent" : "#fff" }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Amenities</Text>
        </View>

        {/* ROLE BASED EMPTY STATE */}
        {!canReadAmenities && !loading && (
          <View style={styles.emptyContainer}>
            <Image source={EmptyAmenity} style={styles.emptyImg} />
            <Text style={styles.emptyTitle}>
              You do not have access to view Amenities
            </Text>
          </View>
        )}

        {canReadAmenities && (
          <View style={{ flex: 1 }}>
            {!loading && amenities.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Image source={EmptyAmenity} style={styles.emptyImg} />
                <Text style={styles.emptyTitle}>No Amenities are there!</Text>

                <TouchableOpacity
                  //  style={styles.addButtonEmpty} 
                  style={[
                    styles.addButtonEmpty,
                    !canWriteAmenities && { opacity: 0.4 }
                  ]}
                  disabled={!canWriteAmenities}
                  onPress={handleShowAmenity}>
                  <Text style={styles.addBtnText}>+  Add Amenity</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={amenities}
                keyExtractor={(i) => i.id}
                renderItem={renderAmenity}
                contentContainerStyle={{ paddingBottom: 140 }}
              />
            )}

            {!loading && amenities.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.floatingBtn,
                  !canWriteAmenities && { opacity: 0.4 }
                ]}
                disabled={!canWriteAmenities}
                onPress={() => openSheet(false)}>
                <Image source={AddIcon} style={{ width: 26, height: 26, tintColor: "#fff" }} />
              </TouchableOpacity>
            )}
          </View>
        )}

      </View>
      {showMenu && (
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.menuOverlay}>

            <View
              style={[
                styles.menuBox,
                {
                  top: menuPosition.y + 20,
                  left: menuPosition.x - 120,
                },
              ]}
            >

              {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            const amenity = amenities.find((a) => a.id === menuAmenityId);
            setShowMenu(false);
            openSheet(true, amenity);
          }} */}

              <TouchableOpacity
                disabled={!canUpdateAmenities}
                style={[styles.menuItem, { opacity: canUpdateAmenities ? 1 : 0.4 }]}
                onPress={() => {
                  const amenity = amenities.find((a) => a.id === menuAmenityId);
                  setShowMenu(false);
                  openSheet(true, amenity);
                }}
              >

                <Image
                  source={require("../../../Assets/Images/editIcon.png")}
                  style={styles.popupIcon}
                />
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={[styles.menuItem, { opacity: canDeleteAmenities ? 1 : 0.4 }]}
                disabled={!canDeleteAmenities}
                onPress={() => {
                  setShowMenu(false);
                  confirmDelete(menuAmenityId);
                }}
              >
                <Image
                  source={require("../../../Assets/Images/trash.png")}
                  style={[styles.popupIcon, { tintColor: "red" }]}
                />
                <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
              </TouchableOpacity>

            </View>
          </View>
        </TouchableWithoutFeedback>
      )}



      {showDeleteConfirm && (
        <Modal transparent visible animationType="fade">
          <View style={styles.deleteOverlay}>
            <View style={styles.deleteBox}>
              <Text style={styles.deleteTitle}>Delete Amenity?</Text>
              <Text style={styles.deleteSub}>Are you sure you want to delete this amenity?</Text>

              <View style={styles.deleteBtnRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowDeleteConfirm(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={doDelete}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showSheet && (
        <View style={styles.sheetOverlay} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={closeSheet}>
            <View style={styles.sheetOverlayDim} />
          </TouchableWithoutFeedback>

          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
            <View style={styles.handleWrapper} {...sheetPan.panHandlers}>
              <View style={styles.sheetHandle} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 80 }} keyboardShouldPersistTaps="handled">
              <Text style={styles.sheetTitle}>{isEdit ? "Edit Amenity" : "Add Amenity"}</Text>

              <Text style={styles.inputLabel}>
                Amenity <Text style={{ color: "red" }}>*</Text>
              </Text>

              <TextInput
                style={[styles.inputBox]}
                placeholder="Enter Amenity"
                value={amenityName}
                onChangeText={(t) => {

                  const onlyLetters = t.replace(/[^a-zA-Z\s]/g, "");

                  setAmenityName(onlyLetters);

                  if (amenityError) setAmenityError("");
                  setNoChangeError("");
                }}
              />




              {amenityError && (
                <ErrorMessage message={amenityError} type="error" />
              )}


              <Text style={[styles.inputLabel, { marginTop: 12 }]}>
                Price <Text style={{ color: "red" }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.inputBox,]}
                placeholder="Enter Price"
                keyboardType="number-pad"
                value={amenityPriceText}
                onChangeText={(t) => {
                  setAmenityPriceText(t.replace(/[^0-9]/g, ""));
                  if (priceError)
                    setPriceError("")
                  setNoChangeError("")
                }}
              />



              {priceError && (
                <ErrorMessage message={priceError} type="error" />
              )}



              {noChangeError && (
                <ErrorMessage message={noChangeError} type="error" />
              )}


            </ScrollView>

            <TouchableOpacity
              style={styles.addTypeBtn}
              onPress={saveAmenity}
            >
              <Text style={styles.addTypeText}>
                {isEdit ? "Save Changes" : "Add Amenity"}
              </Text>
            </TouchableOpacity>

          </Animated.View>
        </View>
      )}

      {showAssign && (
        <View style={styles.sheetOverlay} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={closeAssign}>
            <View style={styles.sheetOverlayDim} />
          </TouchableWithoutFeedback>

          <Animated.View style={[styles.assignSheet, { transform: [{ translateY: assignY }] }]}>

            <View style={styles.assignHandleWrapper} {...assignPan.panHandlers}>
              <View style={styles.assignHandle} />
            </View>

            <FlatList
              data={[{ type: "header" }]} showsVerticalScrollIndicator={false}
              keyExtractor={(_, i) => String(i)}
              style={{ marginBottom: 100 }}
              renderItem={() => (
                <>
                  <Text style={styles.assignTitle}>Assign Amenities</Text>

                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionLabel}>Un Assigned</Text>


                    <TouchableOpacity
                      onPress={() => setShowUnassigned(!showUnassigned)}
                    >
                      <Image
                        source={DownArrow}
                        style={[
                          styles.dropdownIcon,
                          { transform: [{ rotate: showUnassigned ? "0deg" : "-180deg" }] },
                        ]}
                      />
                    </TouchableOpacity>

                  </View>



                  {showUnassigned && (
                    <FlatList
                      data={unassigned}
                      keyExtractor={(u) => u.id}
                      renderItem={({ item }) => <UserRow user={item} />}
                      scrollEnabled={false}
                      ListEmptyComponent={
                        <Text style={{ padding: 16, color: "#666" ,fontFamily: "Gilroy-Semibold"}}>
                          No unassigned users
                        </Text>
                      }
                    />
                  )}



                  {/* <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
                    <View style={styles.assignActionsRow}>
                      <TouchableOpacity
                        // disabled={!anyUnassignedSelected}
                        onPress={() => {
                          if (!anyUnassignedSelected) {
                            setSelectAmenityError("Please select at least one user");
                          }
                          moveDownSelected
                        }}
                        style={[styles.downBtn, { opacity: anyUnassignedSelected ? 1 : 0.45 }]}
                      >
                        <Image source={Arrowdown} style={{ height: 22, width: 22 }} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.assignActionsRow}>
                      <TouchableOpacity
                        // disabled={!anyAssignedSelected}
                        onPress={()=>{
                          // if (!anyAssignedSelected) {
                          //   setSelectAmenityError("Please select at least one user");
                          // }
                          moveUpSelected
                        }}
                        style={[styles.upBtn, { opacity: anyAssignedSelected ? 1 : 0.45 }]}
                      >
                        <Image source={Arrowup} style={{ height: 22, width: 22 }} />
                      </TouchableOpacity>
                    </View>

                  </View> */}

                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionLabel}>Assigned</Text>

                    <TouchableOpacity
                      onPress={() => setShowAssigned(!showAssigned)}
                    >
                      <Image
                        source={DownArrow}
                        style={[
                          styles.dropdownIcon,
                          { transform: [{ rotate: showAssigned ? "0deg" : "-180deg" }] },
                        ]}
                      />
                    </TouchableOpacity>
                  </View>

                  {showAssigned && (
                    <FlatList
                      data={assigned}
                      keyExtractor={(u) => u.id}
                      renderItem={({ item }) => <UserAssignedRow user={item} />}
                      scrollEnabled={false}
                      ListEmptyComponent={
                        <Text style={{ padding: 16, color: "#666" ,fontFamily: "Gilroy-Semibold"}}>
                          No assigned users
                        </Text>
                      }
                    />
                  )}


                  {/* <FlatList
                    data={assigned}
                    keyExtractor={(u) => u.id}
                    renderItem={({ item }) => <UserAssignedRow user={item} />}
                    scrollEnabled={false}
                    style={{ paddingBottom: 50 }}
                    ListEmptyComponent={<Text style={{ padding: 16, color: "#666" }}>No assigned users</Text>}
                  /> */}

                </>
              )}
            />

            {/* {selectAmenityError && <ErrorMessage message={selectAmenityError} type="error" />} */}
            {
              <View style={{
                position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff",
                flexDirection: "row", padding: 15, borderTopWidth: 1,
                borderColor: "#EAEAEA", shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08,
                shadowRadius: 6, elevation: 8,
              }}>

                <View style={styles.assignActionsRow}>
                  <TouchableOpacity
                    // disabled={!anyUnassignedSelected}
                    onPress={() => {
                      if (!anyUnassignedSelected) {
                        setSelectAmenityError("Please select at least one user");
                        return;
                      }
                      moveDownSelected();
                    }}
                    style={[styles.downBtn, { opacity: anyUnassignedSelected ? 1 : 0.45 }]}
                  >
                    <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold",  color: '#ffffff' }}>Assign</Text>
                    <Image source={Arrowdown} style={{ height: 20, width: 20 , marginLeft:5}} />
                  </TouchableOpacity>
                </View>

                <View style={styles.assignActionsRow}>
                  <TouchableOpacity
                    // disabled={!anyAssignedSelected}
                    onPress={() => {
                      if (!anyAssignedSelected) {
                        setSelectAmenityError("Please select at least one user");
                        return;
                      }
                      moveUpSelected();
                    }}
                    style={[styles.upBtn, { opacity: anyAssignedSelected ? 1 : 0.45 }]}
                  >
                    <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold", color: '#ffffff' }}>UnAssign</Text>
                    <Image source={Arrowup} style={{ height: 20, width: 20 , marginLeft:5}} />
                  </TouchableOpacity>
                </View>
              </View>
            }
          </Animated.View>

        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#fff" },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backIcon: { width: 20, height: 20, marginRight: 10 },
  headerTitle: { fontSize: 20, fontFamily: "Gilroy-Bold" , flex: 1 },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyImg: { width: 200, height: 160, marginBottom: 10 },
  emptyTitle: { fontSize: 16, color: "#444", marginBottom: 15 ,fontFamily: "Gilroy-Bold" },
  addButtonEmpty: { backgroundColor: "#1E45E1", paddingHorizontal: 45, paddingVertical: 14, borderRadius: 10 },
  addBtnText: { color: "#fff", fontSize: 15, fontFamily: "Gilroy-Bold"  },

  amenityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    marginBottom: 14,
    elevation: 2,
    position: "relative",
  },

  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 17, fontFamily: "Gilroy-Bold" , color: "#000" },
  priceRow: { fontSize: 15, color: "#111", marginTop: 4, fontFamily: "Gilroy-Semibold"},
  perMonth: { fontSize: 14, color: "#737373" },

  rightIcons: { flexDirection: "row", alignItems: "center" },
  linkIcon: { width: 20, height: 20, tintColor: "#000", marginRight: 6 },
  dots: { width: 24, height: 24, marginLeft: 6 },

  line: { height: 1, backgroundColor: "#E6E6E6", marginVertical: 14 },

  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  prorateLabel: { fontSize: 16, fontFamily: "Gilroy-Semibold", color: "#555" },
  onOffText: { fontSize: 14, marginRight: 6, color: "#3562FF", fontFamily: "Gilroy-Semibold"},

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  switchLabel: {
    fontSize: 14,
   fontFamily: "Gilroy-Semibold"
  },
  switch: {
    width: 40,
    height: 22,
    borderRadius: 30,
    padding: 2,
    justifyContent: "center",
  },
  knob: {
    width: 18,
    height: 18,
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  knobText: { fontSize: 10, fontFamily: "Gilroy-Bold" },

  floatingBtn: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#1D5DFF",
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  /* delete modal */
  deleteOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  deleteBox: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 12, alignItems: "center" },
  deleteTitle: { fontSize: 18, fontFamily: "Gilroy-Bold" , marginBottom: 6 },
  deleteSub: { color: "#666", marginBottom: 12, textAlign: "center" },
  deleteBtnRow: { flexDirection: "row", width: "100%" },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: "#1D5DFF", marginRight: 8, alignItems: "center" },
  cancelText: { color: "#1D5DFF", fontFamily: "Gilroy-Bold"  },
  deleteBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: "#1D5DFF", alignItems: "center" },
  deleteBtnText: { color: "#fff", fontFamily: "Gilroy-Bold" },

  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 2000,
  },
  sheetOverlayDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  handleWrapper: { alignItems: "center", paddingVertical: 12 },
  sheetHandle: { width: 50, height: 5, borderRadius: 8, backgroundColor: "#ccc" },
  sheetTitle: { fontSize: 18, fontFamily: "Gilroy-Bold" , marginBottom: 16 },
  inputLabel: { fontSize: 14, fontFamily: "Gilroy-Semibold", marginBottom: 6 },
  inputBox: { borderWidth: 1, borderColor: "#E4E4E7", borderRadius: 12, padding: 12, fontSize: 15 ,fontFamily: "Gilroy-Regular"},
  addTypeBtn: { backgroundColor: "#1D5DFF", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginBottom: 10 },
  addTypeText: { color: "#fff", fontSize: 16, fontFamily: "Gilroy-Bold"  },

  assignSheet: {
    width: "100%",
    maxHeight: SCREEN_HEIGHT * 0.95,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  assignHandleWrapper: { alignItems: "center", paddingVertical: 8 },
  assignHandle: { width: 50, height: 5, borderRadius: 8, backgroundColor: "#ccc", marginBottom: 8 },

  assignTitle: { fontSize: 18, fontFamily: "Gilroy-Bold" , marginBottom: 6 },
  sectionLabel: { color: "#333", fontFamily: "Gilroy-Bold" , marginTop: 8, marginBottom: 6 },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#F1F1F1",
    borderBottomWidth: 1,
  },
  userLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E8EAF6", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#1D3BFF", fontFamily: "Gilroy-Bold"  },
  userName: { fontFamily: "Gilroy-Bold" , fontSize: 15, flexShrink: 1 },
  floorBadge: { backgroundColor: "#FDE7A8", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginRight: 8 },
  floorBadgeText: { fontSize: 12, fontFamily: "Gilroy-Bold" , color: "#6b4a00" },
  metaText: { color: "#666", marginLeft: 6 },


  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  tick: {
    fontSize: 16,
    color: "#1D5DFF",
    fontWeight: "900",
  },
  assignActionsRow: { flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  downBtn: {
    flex: 1, borderRadius: 10, backgroundColor: "#1D5DFF", alignItems: "center", justifyContent: "center", marginHorizontal: 6,
    flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, elevation: 2, shadowColor: "#000", shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  upBtn: {
    flex: 1, borderRadius: 10, backgroundColor: "#E53935", alignItems: "center", justifyContent: "center",
    marginHorizontal: 6, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, elevation: 2, shadowColor: "#000", shadowOpacity: 0.25,
    shadowRadius: 6
  },

  userListEmpty: { padding: 12, color: "#777" },

  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  menuBox: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 10,
    paddingVertical: 4,
    paddingHorizontal: 10

  },




  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 22,
    paddingLeft: 4
  },
  popupIcon: { width: 18, height: 18, marginRight: 10, marginTop: 4 },

  menuText: {
    fontSize: 16,
   fontFamily: "Gilroy-Semibold",
    color: "#000",
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  dropdownIcon: {
    width: 22,
    height: 22,
    tintColor: "#444",
  },



});
