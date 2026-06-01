import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Modal,
} from "react-native";
import { StatusBar, Platform } from "react-native";
import { CommonContexts } from "../../../Context/CommonContext";
import { PGContext } from "../../../Context/PGContext";
import { LoginContexts } from "../../../Context/LoginContext";
import { getHostels } from "../../../Action/HostelAction";
import SuccessModal from "../../../ToastFile/ToastPage";
import { useHasPermission } from "../../../Utils/useHasPermission";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { UIContext } from "../../Tabs/UIContext";
import HostelImg from "../../../Assets/Images/PgImg.png";
import PgRooms from "../../../Assets/Images/pgrooms.png";
import call from "../../../Assets/Images/call.png";
import sms from "../../../Assets/Images/sms.png";
import Building from "../../../Assets/Images/buildings.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import Dots from "../../../Assets/Images/3dots.png";
import DeleteIcon from "../../../Assets/Images/trash.png";
import EditIcon from "../../../Assets/Images/editIcon.png";
import ActiveIcon from "../../../Assets/Images/switch_hostel.png";
import EmptyIcon from "../../../Assets/Images/Empty_state.png";
import PlusIcon from "../../../Assets/Images/blue_circle.png"
import OrangeLocationIcon from "../../../Assets/Images/OrangeLocationIcon.png"

export default function SettingsPG({ navigation }) {
  const { hostelList, updateHostelList, setActiveHostelId, activeHostelId } = useContext(CommonContexts);
  console.log("Settings PG — API Hostels:", hostelList);
  const { deletePG } = useContext(PGContext);
  const login = useContext(LoginContexts);

  const {
    canWriteModule: canWritePayingGuests,
    canReadModule: canReadPayingGuests,
    canUpdateModule: canUpdatePayingGuests,
    canDeleteModule: canDeletePayingGuests,
  } = useHasPermission("Paying Guests");

  const { tabBarHeight } = useContext(UIContext);


  const dotRefs = useRef({});
  const [visiblePopup, setVisiblePopup] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  const [isSwitchVisible, setIsSwitchVisible] = useState(false);
  const [switchHostel, setSwitchHostel] = useState(null);
  const sheetY = useRef(new Animated.Value(300)).current;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showHeader, setShowHeader] = useState(false);

  const [deletePGShow, setDeletePG] = useState(false);
  const cardDotRef = useRef(null);

  const clean = (text) => (text ? text.toString().trim() : "");


  const formatHostels = hostelList?.map((h, index) => ({
    id: h.hostelId ?? h.id ?? `hostel_${index}`,
    name: clean(h.name),
    type: "Paying Guest",
    email: clean(h.emailId),
    phone: clean(h.mobile),
    address: [
      clean(h.houseNo),
      clean(h.street),
      clean(h.city)
    ].filter(Boolean).join(", "),
    totalRooms: h.noOfRooms,
    availableBeds: h.noOfAvailableBeds,
    profilePhoto: h.mainImage ? { uri: h.mainImage } : null,
    profileIntials: h.initials,
    images: h.images?.length
      ? h.images.map((i) => ({ uri: i }))
      : [],

  }));



  const mainHostel = formatHostels?.[0];
  const otherHostels =
    formatHostels?.length > 1 ? formatHostels.slice(1) : [];

  console.log("mainHostel", mainHostel);



  // const openPopup = (id) => {
  //   const pos = dotRefs.current[id];
  //   if (!pos) return;

  //   setPopupPos({
  //     x: pos.x - 130,
  //     y: pos.y + pos.height + 5,
  //   });
  //   setVisiblePopup(id);
  // };



  const openSheet = () => {
    Animated.timing(sheetY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetY, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsSwitchVisible(false));
  };

  const handleSwitchHostel = (hostel) => {
    setSwitchHostel(hostel);
    setIsSwitchVisible(true);
    openSheet();
  };

  // const handleActivate = (id) => {
  //   closeSheet();
  // };

  const reorderHostels = (list, activeId) => {
    const selected = list.find(h => (h.hostelId ?? h.id) === activeId);
    const others = list.filter(h => (h.hostelId ?? h.id) !== activeId);

    return selected ? [selected, ...others] : list;
  };

  const hasFetched = useRef(false);

  // useEffect(() => {
  //   if (!login.getToken || !activeHostelId || hasFetched.current) return;

  //   hasFetched.current = true;

  //   getHostels(login.getToken).then((res) => {
  //     const reordered = reorderHostels(res.data, activeHostelId);
  //     updateHostelList(reordered);
  //   });
  // }, [login.getToken, activeHostelId]);

  console.log("activhostelid", activeHostelId);


  useEffect(() => {
    if (!activeHostelId || hasFetched.current) return;

    hasFetched.current = true;

    getHostels().then((res) => {
      if (res?.data) {
        const reordered = reorderHostels(res.data, activeHostelId);
        updateHostelList(reordered);
      }
    });
  }, [activeHostelId]);


  // useEffect(() => {
  //   if (!login.getToken) return;
  //   if(activeHostelId){
  //   getHostels(login.getToken).then((res) => {
  //     const reordered = reorderHostels(res.data, activeHostelId);
  //     updateHostelList(reordered);
  //   });
  //   }
  // }, [login.getToken, activeHostelId]);


  const handleActivate = (id) => {
    const selected = hostelList.find(h => (h.hostelId ?? h.id) === id);
    const others = hostelList.filter(h => (h.hostelId ?? h.id) !== id);

    updateHostelList([selected, ...others]);
    setActiveHostelId(id);
    closeSheet();
  };;

  const activeHostel =
    hostelList?.find(h => (h.hostelId ?? h.id) === activeHostelId) ??
    hostelList?.[0] ??
    null;

  console.log("activehostel", hostelList, activeHostel)



  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) sheetY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) closeSheet();
      else openSheet();
    },
  });

  const scrollY = useRef(new Animated.Value(0)).current;

  const HEADER_MAXHEIGHT = 500;
  const HEADER_MINHEIGHT = 50;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAXHEIGHT - HEADER_MINHEIGHT],
    outputRange: [HEADER_MAXHEIGHT, HEADER_MINHEIGHT],
    extrapolate: "clamp",
  })


  const handleEdit = (id) => {
    const HostelDetails = hostelList.find((h) => h.hostelId === id);

    const HostelData = {
      hostelId: HostelDetails.hostelId,
      name: HostelDetails.name,
      emailId: HostelDetails.emailId,
      mobile: HostelDetails.mobile,
      houseNo: HostelDetails.houseNo,
      street: HostelDetails.street,
      city: HostelDetails.city,
      state: HostelDetails.state,
      pincode: HostelDetails.pincode,
      landmark: HostelDetails.landmark,
      type: "Paying Guest",
      mainImage: HostelDetails.mainImage,
      images: HostelDetails.images || [],
      noOfRooms: HostelDetails.noOfRooms,
      noOfBeds: HostelDetails.noOfBeds,
      noOfAvailableBeds: HostelDetails.noOfAvailableBeds,
    };

    navigation.navigate("AddPG", {
      mode: "edit",
      data: HostelData,
    });

    setVisiblePopup(null);
  };


  const handleDelete = () => {
    setDeletePG(true);
  };

  const handleDeletePG = async () => {
    const selectedHostel = hostelList.find(
      (h) => h.hostelId === visiblePopup
    );

    if (!selectedHostel) return

    const deletedId = selectedHostel.hostelId

    try {
      const res = await deletePG(deletedId)
      console.log("DeletedSus",res)

      if (res?.status === 400) {
        setModalMessage("This hostel cannot be deleted because rooms or beds already exist.");
        setModalType("warning");
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500)
        return
      }

      if (res?.status !== 200) {
        setModalMessage("This hostel cannot be deleted because rooms or beds already exist.");
        setModalType("warning");
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500)
        return
      }

      const updated = hostelList.filter(
        (h) => h.hostelId !== deletedId
      );
      console.log(updated)

      updateHostelList(updated)

      if (activeHostelId === deletedId) {
        if (updated.length > 0) {
          setActiveHostelId(updated[0].hostelId);
        } else {
          setActiveHostelId(null);
        }
      }
      setModalMessage(res?.message || "Deleted successfully");
      setModalType("success");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1500);

      console.log("PG Deleted Successfully!");
    } catch (err) {
      setModalMessage("Something went wrong while deleting PG.");
      setModalType("error")
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1500);
      // alert("Something went wrong while deleting PG.");
    } finally {
      setDeletePG(false);
      setVisiblePopup(null);
    }
  };

  console.log("hostelimage", mainHostel?.images?.map(i => i?.uri?.id));



  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isSwitchVisible) {
          closeSheet();
          return true;
        }
        if (visiblePopup) {
          setVisiblePopup(null);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [isSwitchVisible, visiblePopup]);

  // if (!mainHostel)
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //        <Image source={EmptyIcon} style={{width: 200, height: 160, marginBottom: 10}} />
  //       <Text>No PG Data Found</Text>
  //     </View>
  //   );


  const formatAddressLines = (hostel) => {
    if (!hostel) return { line1: "", line2: "" };

    const line1 = [
      hostel?.houseNo,
      hostel?.street,
      hostel?.landmark,
    ]
      .filter(v => v && String(v).trim() !== "")
      .join(", ");

    const line2 = [
      hostel?.city,
      hostel?.state,
      hostel?.pincode,
    ]
      .filter(v => v && String(v).trim() !== "")
      .join(", ");

    return { line1, line2 };
  };

  const { line1, line2 } = formatAddressLines(activeHostel);



  if (!hostelList || hostelList?.length === 0) {
    return (

      <>
        <View style={{
          paddingHorizontal: 16, paddingTop: 40, paddingBottom: 12, flexDirection: "row",
          alignItems: "center", backgroundColor: '#fff'
        }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage PG</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Image
            source={EmptyIcon}
            style={{ width: 250, height: 160, marginBottom: 16 }}
          />

          <Text
            style={{
              fontSize: 18,
              fontFamily: "Gilroy-Bold",
              marginBottom: 20,
            }}
          >
            No PG Available
          </Text>

          {/* <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "90%",
              paddingVertical: 14,
              backgroundColor: "#F4F7FF",
              borderRadius: 14,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: "#2D6CDF",
              opacity: canWritePayingGuests ? 1 :  0.4
            }}
              disabled={!canWritePayingGuests}
              onPress={() => navigation.navigate("AddPG")}
          >
            <Image
              source={PlusIcon}
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 16,
                color: "#2D6CDF",
                fontWeight: "600",
              }}
            >
              Add New PG
            </Text>
          </TouchableOpacity> */}
        </View>

      </>
    );
  }

  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerTranslate = scrollY.interpolate({
  inputRange: [0, 80],
  outputRange: [-60, 0],
  extrapolate: "clamp",
});


  
  const openPopup = (id, ref) => {
    if (!ref) return;

    ref.measureInWindow((x, y, width, height) => {
      setPopupPos({
        x: x - 130,
        y: y + height + 5,
      });

      setVisiblePopup(id);
    });
  };

  return (

    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />


      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage PG</Text>
        </View>

        {/* {!canReadPayingGuests && (
  <View  style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}>
    <Image source={EmptyState} style={{ width: 250, height: 160, marginBottom: 16 }} />
    <Text style={{
              fontSize: 18,
              fontFamily: "Gilroy-Bold",
              marginBottom: 20,
            }}>
      You do not have access to view Paying Guests
    </Text>
  </View>
)} */}

        {showHeader && (
           <Animated.View
          style={{
           
            height: 100,
            // flexDirection: "row",
            // alignItems: "center",
            // paddingHorizontal: 16,
            // backgroundColor: "red",
            // borderBottomWidth: 0.5,
            borderColor: "#ddd",
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
            zIndex: 10,
            // elevation:6

          }}
        >
          <View >
            {/* <View style={[styles.header]}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={ArrowLeft} style={styles.backArrow} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Manage PG</Text>
            </View> */}
            <View style={{ backgroundColor: '#fff', }}>
              <View style={{
                flexDirection: 'row', borderWidth: 1, padding: 20, borderRadius: 10, alignItems: 'center',
                backgroundColor: "#fff", borderColor: "#E8ECF8", marginHorizontal: 16,
              }}>
                <View style={styles.topRow}>
                  <View style={{ flexDirection: "row", paddingRight: 40, flex: 1 }}>
                    {mainHostel?.profilePhoto ? (
                      <Image
                        source={mainHostel.profilePhoto}
                        style={styles.hostelImg}
                      />
                    ) : (
                      <View style={{
                        width: 50, height: 50, borderRadius: 25, backgroundColor: "#E6EEF9", alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "#3B82F6", }}>
                          {mainHostel?.profileIntials}
                        </Text>
                      </View>
                    )}


                    {/* <Image source={mainHostel?.profilePhoto} style={styles.hostelImg} /> */}
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text style={styles.hostelName}>{mainHostel?.name}</Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}>
                          <Image source={OrangeLocationIcon} style={{ width: 15, height: 15 }} />
                          <Text style={{ fontFamily: "Gilroy-Medium", fontSize: 14, marginLeft: 4 }}>
                            {activeHostel?.city}</Text>
                        </View>

                        <Text style={styles.badge}>{mainHostel?.type}</Text>
                      </View>

                    </View>
                  </View>

                  <View style={styles.dotsWrapper}>
                    <TouchableOpacity
                      ref={cardDotRef}
                      onPress={() => openPopup(mainHostel?.id, cardDotRef.current)}
                    >
                      <Image source={Dots} style={styles.dotsIcon} />
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
              {/* <View style={{
                backgroundColor: '#fff', shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
              }}>
                <Text style={styles.sectionTitle}>Other Hostels</Text>
              </View> */}
            </View>
          </View>


        </Animated.View>


        )}

       
        {/* {canReadPayingGuests && ( */}
        <Animated.ScrollView contentContainerStyle={{ paddingBottom: 100 }}
          stickyHeaderIndices={[1]}
          // onScroll={Animated.event(
          //   [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          //   { useNativeDriver: false }
          // )}
          onScroll={(event) => {
            const y = event.nativeEvent.contentOffset.y;

            if (y > 20 && !showHeader) {
              setShowHeader(true);
            } else if (y <= 20 && showHeader) {
              setShowHeader(false);
            }

            scrollY.setValue(y);
          }}
          scrollEventThrottle={16}
        >

          <Animated.View style={[styles.card, { overflow: 'hidden' }]}>
            <View style={styles.topRow}>
              <View style={{ flexDirection: "row", paddingRight: 40, flex: 1 }}>
                {mainHostel?.profilePhoto ? (
                  <Image
                    source={mainHostel.profilePhoto}
                    style={styles.hostelImg}
                  />
                ) : (
                  <View style={{
                    width: 50, height: 50, borderRadius: 25, backgroundColor: "#E6EEF9", alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "#3B82F6", }}>
                      {mainHostel?.profileIntials}
                    </Text>
                  </View>
                )}


                {/* <Image source={mainHostel?.profilePhoto} style={styles.hostelImg} /> */}
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.hostelName}>{mainHostel?.name}</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}>
                      <Image source={OrangeLocationIcon} style={{ width: 15, height: 15 }} />
                      <Text style={{ fontFamily: "Gilroy-Medium", fontSize: 14, marginLeft: 4 }}>
                        {activeHostel?.city}</Text>
                    </View>

                    <Text style={styles.badge}>{mainHostel?.type}</Text>
                  </View>

                </View>
              </View>

              <View style={styles.dotsWrapper}>
                <TouchableOpacity
                  ref={(ref) => {
                    if (ref) dotRefs.current[mainHostel?.id] = ref;
                  }}
                  onPress={() => {
                    const ref = dotRefs.current[mainHostel?.id];
                    if (!ref) return;

                    ref.measureInWindow((x, y, width, height) => {
                      setPopupPos({
                        x: x - 130,
                        y: y + height + 5,
                      });
                      setVisiblePopup(mainHostel?.id);
                    });
                  }}
                >
                  <Image source={Dots} style={styles.dotsIcon} />
                </TouchableOpacity>
              </View>

            </View>


            <View style={styles.rowBox}>
              <View style={styles.col}>
                <Text style={styles.label}>Total Rooms</Text>
                <Text style={styles.num}>{mainHostel?.totalRooms}</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Available Beds</Text>
                <Text style={styles.num}>{mainHostel?.availableBeds}</Text>
              </View>
            </View>

            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mainHostel?.images?.map((i , index) => {
              return <Image  key={`${i?.uri?.id || "img"}-${index}`} source={i?.uri?.image} style={styles.roomImg} />
          }
          )}
        </ScrollView> */}
            {console.log(mainHostel)}

            {mainHostel?.images?.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {mainHostel.images.map((i, index) => (
                  <Image
                    key={`${i?.uri}-${index}`}
                    source={{ uri: i?.uri?.image }}
                    style={styles.roomImg}
                  />
                ))}
              </ScrollView>
            )}


            <Text style={styles.infoTitle}>Email ID</Text>
            <View style={styles.infoRow}>
              <Image source={sms} style={styles.infoIcon} />
              <Text style={styles.infoText}>{mainHostel?.email}</Text>
            </View>

            <Text style={styles.infoTitle}>Contact Number</Text>
            <View style={styles.infoRow}>
              <Image source={call} style={styles.infoIcon} />
              <Text style={styles.infoText}>{mainHostel?.phone}</Text>
            </View>

            <Text style={styles.infoTitle}>Address</Text>

            <View style={styles.infoRow}>
              <Image source={Building} style={styles.infoIcon} />

              <View style={{ flex: 1 }}>
                {line1 !== "" && (
                  <Text style={styles.infoText}>{line1}</Text>
                )}

                {line2 !== "" && (
                  <Text
                    style={[
                      styles.infoText,
                      line1 !== "" && { marginTop: 2 }
                    ]}
                  >
                    {line2}
                  </Text>
                )}
              </View>
            </View>
          </Animated.View>

          <View style={{backgroundColor:'#fff'}}>
            <Text style={styles.sectionTitle}>Other Hostels</Text>
          </View>

          {/* <View style={{ height: 600, marginBottom: 20 }}> */}
          <View
          // nestedScrollEnabled
          // showsVerticalScrollIndicator
          // scrollIndicatorInsets={{ right: 6 }}
          // style={{ paddingHorizontal: 0, maxHeight: 250, }}
          // contentContainerStyle={{ paddingBottom: 20 }}
          >
            {otherHostels && otherHostels.filter(Boolean).map((hostel) => (
              <View key={hostel.id} style={styles.otherCard}>
                {/* <Image source={hostel.profilePhoto} style={styles.otherImg} /> */}
                {hostel.profilePhoto ? (
                  <Image
                    source={hostel.profilePhoto}
                    style={styles.hostelImg}
                  />
                ) : (
                  <View style={{
                    width: 50, height: 50, borderRadius: 25, backgroundColor: "#E6EEF9", alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "#3B82F6", }}>
                      {hostel?.profileIntials}
                    </Text>
                  </View>
                )}

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.otherName}>{hostel.name}</Text>
                  <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 100 }}>
                      <Image source={OrangeLocationIcon} style={{ width: 15, height: 15 }} />
                      <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Medium', marginLeft: 4, marginRight: 6, flexShrink: 1 }}
                        numberOfLines={1}>
                        {hostel?.address}</Text>
                    </View>

                    <Text style={[styles.otherBadge, { flexShrink: 1 }]}>{hostel.type}</Text>
                  </View>

                </View>

                <TouchableOpacity onPress={() => handleSwitchHostel(hostel)}>
                  <Image source={ActiveIcon} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {/* </View> */}
        </Animated.ScrollView>
        {/* // )} */}

        {hostelList && hostelList?.length > 0 &&
          (
            <View style={[
              styles.fixedAddBtnWrapper,
              { bottom: tabBarHeight - 50 }
            ]}>
              <TouchableOpacity
                // style={styles.figAddBtn}
                style={[styles.figAddBtn, !canWritePayingGuests && { opacity: 0.4 },]}
                disabled={!canWritePayingGuests}
                onPress={() => navigation.navigate("AddPG")}
              >
                <Image
                  source={PlusIcon}
                  style={styles.figAddIcon}
                />
                <Text style={styles.figAddText}>Add New PG</Text>
              </TouchableOpacity>
            </View>
          )
        }


        {visiblePopup && (
          <Modal transparent animationType="none">
            <TouchableWithoutFeedback onPress={() => setVisiblePopup(null)}>
              <View style={styles.popupOverlay}>
                <View
                  style={[
                    styles.popupBox,
                    { top: popupPos.y, left: popupPos.x },
                  ]}
                >
                  <TouchableOpacity
                    // style={styles.popupItem}
                    style={[styles.popupItem, !canUpdatePayingGuests && { opacity: 0.4 },]}
                    disabled={!canUpdatePayingGuests}
                    onPress={() => handleEdit(visiblePopup)}
                  >
                    <Image source={EditIcon} style={styles.popupIcon} />
                    <Text style={styles.popupText}>Edit</Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  <TouchableOpacity
                    // style={styles.popupItem}
                    style={[styles.popupItem, !canDeletePayingGuests && { opacity: 0.4 },]}
                    disabled={!canDeletePayingGuests}
                    onPress={handleDelete}
                  >
                    <Image source={DeleteIcon} style={styles.popupIcon} />
                    <Text style={[styles.popupText, { color: "red" }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}

        {isSwitchVisible && (
          <TouchableWithoutFeedback onPress={closeSheet}>
            <View style={styles.switchOverlay}>
              <Animated.View
                style={[styles.switchBox, { transform: [{ translateY: sheetY }] }]}
                {...panResponder.panHandlers}
              >
                <View style={styles.handleBar} />

                <Text style={styles.switchTitle}>Switch to</Text>

                <View style={styles.switchCard}>
                  {switchHostel.profilePhoto ? (
                    <Image
                      source={switchHostel.profilePhoto}
                      style={styles.hostelImg}
                    />
                  ) : (
                    <View style={{
                      width: 50, height: 50, borderRadius: 25, backgroundColor: "#E6EEF9", alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Text style={{ fontSize: 18, fontWeight: "600", color: "#3B82F6", }}>
                        {switchHostel?.profileIntials}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.otherName}>{switchHostel?.name}</Text>
                    <Text style={styles.otherBadge} numberOfLines={1}>{switchHostel?.type}</Text>

                  </View>
                </View>

                <View style={styles.switchActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={closeSheet}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.continueBtn}
                    onPress={() => handleActivate(switchHostel.id)}
                  >
                    <Text style={styles.continueText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        )}

        {deletePGShow && (
          <Modal transparent animationType="fade">
            <View style={styles.deleteOverlay}>
              <View style={styles.deleteBox}>
                <Text style={styles.deleteTitle}>Delete PG?</Text>
                <Text style={styles.deleteSub}>
                  Are you sure you want to delete this PG?
                </Text>

                <View style={styles.deleteBtnRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setDeletePG(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={handleDeletePG}
                  >
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android"
  ? StatusBar.currentHeight + 20
  : 70 ,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  backArrow: { width: 22, height: 22, marginRight: 10 },
  headerTitle: { fontSize: 20, fontFamily:'Gilroy-Bold'},

  card: {
    margin: 16,
    marginBottom: 7,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8ECF8",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  hostelName: {
    fontSize: 19,
    fontFamily:'Gilroy-Semibold',
    flexWrap: "wrap",
  },

  dotsWrapper: {
    width: 40,
    alignItems: "flex-end",
    paddingTop: 4,
  },

  dotsIcon: { width: 26, height: 26 },
  hostelImg: { width: 50, height: 50, borderRadius: 25 },
  // hostelName: { fontSize: 18, fontWeight: "700" },

  badge: {
    backgroundColor: "#FFF3C6",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    fontFamily: "Gilroy-Medium"
  },

  rowBox: {
    flexDirection: "row",
    backgroundColor: "#F4F7FF",
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
  },

  col: { flex: 1, alignItems: "center" },
  label: { fontSize: 12, color: "#6B7280",fontFamily:'Gilroy-Medium' },
  num: { fontSize: 18, fontFamily:'Gilroy-Semibold', marginTop: 4 },

  roomImg: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 12,
  },

  infoTitle: { marginTop: 14, fontFamily:'Gilroy-Medium'},
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  infoIcon: { width: 18, height: 18, marginRight: 10 },
  infoText: { fontSize: 14, fontFamily:'Gilroy-Semibold', width: 240 },

  sectionTitle: {
    marginLeft: 16,
    marginTop: 10,
    fontSize: 18,
    fontFamily:'Gilroy-Semibold',
  },

  otherCard: {
    marginHorizontal: 16,
    marginTop: 10,
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },

  otherImg: { width: 52, height: 52, borderRadius: 10 },
  otherName: { fontSize: 16, fontFamily:'Gilroy-Semibold'},

  otherBadge: {
    backgroundColor: "#FFF3CF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: "flex-start",
    fontFamily: "Gilroy-Medium"
  },


  fixedAddBtnWrapper: {
    position: "absolute",
    // bottom: 20,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff"
  },

  figAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingVertical: 14,
    backgroundColor: "#F4F7FF",
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#2D6CDF",
  },

  figAddIcon: { width: 23, height: 23, marginRight: 8, tintColor: "#2D6CDF" },
  figAddText: { fontSize: 16, fontFamily:'Gilroy-Semibold', color: "#2D6CDF" },

  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 999,
  },

  popupBox: {
    position: "absolute",
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    elevation: 20,
    zIndex: 1000,
  },

  popupItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  popupIcon: { width: 18, height: 18, marginRight: 10 },
  popupText: { fontSize: 15, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#EAEAEA" },

  switchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    zIndex: 999,
    elevation: 999
  },

  switchBox: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 34,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
  },

  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: "#CCC",
    borderRadius: 6,
    alignSelf: "center",
    marginBottom: 15,
  },
  switchTitle: {
    fontSize: 15,
    marginBottom: 5
  },

  switchCard: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#F4F7FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE4F0",
    alignItems: "center",
    marginBottom: 25,
  },

  switchImg: { width: 60, height: 60, borderRadius: 10 },

  switchActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },

  continueBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#2D6CDF",
    borderRadius: 10,
    alignItems: "center",
  },

  cancelText: { fontSize: 15, color: "#444" },
  continueText: { fontSize: 15, color: "#fff", fontWeight: "700" },

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
  },

  deleteTitle: { fontSize: 18, fontWeight: "700" },
  deleteSub: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 25 },

  deleteBtnRow: { flexDirection: "row", width: "100%" },

  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#2D6CDF",
    borderRadius: 10,
    alignItems: "center",
  },

  deleteBtnText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});
