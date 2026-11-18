import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Modal,
  FlatList, Animated, PanResponder, Pressable, NativeModules, Linking,
  ActivityIndicator
} from "react-native";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

import Profile from "../../../Assets/Images/profile.png";
import Dots from "../../../Assets/Images/3dots.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";
import BedIcon from "../../../Assets/Images/Bed_Icon.png";
import EmailIcon from "../../../Assets/Images/sms.png";
import PhoneIcon from "../../../Assets/Images/profile.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import AmountIcon from "../../../Assets/Images/profile.png";
import Loader from "../../Loader/Loader";
import SuccessModal from "../../../ToastFile/ToastPage";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import CallIcon from "../../../Assets/Images/call_black_icon.png";
import WhatsappIcon from "../../../Assets/Images/whatsapp.png";
import MobileIcon from "../../../Assets/Images/mobile.png";
import { useHasPermission } from "../../../Utils/useHasPermission";
import { CommonContexts } from "../../../Context/CommonContext";
import { PGContext } from "../../../Context/PGContext";
import { useCustomer } from "../../../Context/CustomerContext";
import { useNavigation } from "@react-navigation/native";

export default function CheckoutList({ searchText  }) {
  const { activeHostelId } = useContext(CommonContexts);
  const { getCheckoutCustomersByHostel, loading, GetParticularCustomerDetails } = useCustomer();
  const { getParticularHostelDetails, PGDetails } = useContext(PGContext);

  const [checkoutCustomer, setCheckoutCustomer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fetchingRef = useRef(false);
  // Page tracking from each response (refs, so load-more never reads stale state)
  const pageRef = useRef(1);
  const hasMoreRef = useRef(false);
  const requestIdRef = useRef(0);
  const searchRef = useRef("");
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const navigation = useNavigation();

  const { CommonModule } = NativeModules;

  const {
    canWriteModule: canWriteCheckout,
    canReadModule: canReadCheckout,
    canUpdateModule: canUpdateCheckout,
    canDeleteModule: canDeleteCheckout,
  } = useHasPermission("Checkout");

  const lastScrollY = useRef(0);
const isTabBarVisible = useRef(true);

// const handleScroll = (event) => {
//   const currentY = event.nativeEvent.contentOffset.y;
//   const diff = currentY - lastScrollY.current;

//   if (Math.abs(diff) < 10) return;

//   if (diff > 0 && currentY > 50) {
//     if (isTabBarVisible.current) {
//       setShowTabBar(false);  
//       isTabBarVisible.current = false;
//     }
//   } else if (diff < 0) {
//     if (!isTabBarVisible.current) {
//       setShowTabBar(true);  
//       isTabBarVisible.current = true;
//     }
//   }

//   lastScrollY.current = currentY;
// };

  const translateY = useRef(new Animated.Value(500)).current;
  console.log("selectedCustomer", selectedCustomer)
  useEffect(() => {
    if (showCustomerModal) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [showCustomerModal]);

  const closeModalWithAnimation = () => {
    Animated.timing(translateY, {
      toValue: 500,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowCustomerModal(false);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dy) > 5;
      },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          closeModalWithAnimation();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;



  // Debounced server-side search; also handles the initial load and hostel change.
  const isFirstLoadRef = useRef(true);
  useEffect(() => {
    if (!activeHostelId) return;

    const query = searchText?.trim() || "";
    searchRef.current = query;

    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      fetchCheckoutCustomers(1, false, true);
      return;
    }

    const timer = setTimeout(() => {
      fetchCheckoutCustomers(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHostelId, searchText]);

  const fetchCheckoutCustomers = async (
    page = 1,
    isRefresh = false,
    showFullLoader = false
  ) => {
    const isFirstPage = page === 1;

    // A new page-1 request (search/refresh) supersedes anything in flight;
    // load-more requests must wait their turn.
    if (!isFirstPage && fetchingRef.current) return;
    fetchingRef.current = true;

    const requestId = ++requestIdRef.current;
    const name = searchRef.current;

    if (!isFirstPage) setLoadingMore(true);
    if (isRefresh) setRefreshing(true);

    try {
      const data = await getCheckoutCustomersByHostel(
        activeHostelId,
        name,
        page,
        PAGE_SIZE,
        showFullLoader
      );

      console.log("CheckoutListDetail",data)

      // Ignore responses from outdated requests (e.g. user kept typing).
      if (requestId !== requestIdRef.current) return;

      const list = Array.isArray(data?.checkoutCustomers)
        ? data.checkoutCustomers
        : [];

      // API may send pagination top-level or nested, as totalPages or totalPage.
      // Without it: a full page means there may be more.
      const pagination = data?.pagination || data?.paginationSummary || data;
      const respPage = Number(pagination?.currentPage) || page;
      const respTotalPages = Number(pagination?.totalPages ?? pagination?.totalPage);

      if (isFirstPage || list.length > 0) pageRef.current = respPage;
      hasMoreRef.current =
        Number.isFinite(respTotalPages) && respTotalPages > 0
          ? respPage < respTotalPages
          : list.length >= PAGE_SIZE;

      setCheckoutCustomer((prev) => {
        if (isFirstPage) return list;
        const existing = new Set(prev.map((c) => c.customerId));
        return [...prev, ...list.filter((c) => !existing.has(c.customerId))];
      });
      setCurrentPage(pageRef.current);
      setTotalPages(Number.isFinite(respTotalPages) && respTotalPages > 0 ? respTotalPages : 1);
    } finally {
      if (requestId === requestIdRef.current) {
        fetchingRef.current = false;
        setLoadingMore(false);
        setRefreshing(false);
      }
    }
  };

  // No momentum gate: it only reset on a fling, so normal drags (and lists too
  // short to scroll) never loaded the next page. fetchingRef blocks duplicates.
  const handleLoadMore = () => {
    if (
      !activeHostelId ||
      loading ||
      fetchingRef.current ||
      !hasMoreRef.current ||
      checkoutCustomer.length === 0
    ) {
      return;
    }
    fetchCheckoutCustomers(pageRef.current + 1);
  };

  const handleRefresh = () => {
    fetchCheckoutCustomers(1, true);
  };

  const openCustomerDetails = async (item) => {


    const res = await GetParticularCustomerDetails(item.customerId);
    console.log(res)
    setSelectedCustomer(res.data);
    setShowCustomerModal(true);

  };

  // Filtering is done server-side via the `name` query param.
  const filteredCheckout = checkoutCustomer;



  const handleOpenWhatsapp = (item) => {
    console.log("mobile", item);
    if (!item) return;

    let mobile = item?.mobileNo || item?.mobile;
    let countryCode = item?.countryCode || "91";

    if (!mobile) {
      setModalType("warning");
      setModalMessage("Mobile number not available");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
      return;
    }

    mobile = mobile.toString().replace(/\D/g, "");

    if (mobile.startsWith(countryCode)) {
      mobile = mobile.slice(countryCode.length);
    }

    const phoneNumber = `${countryCode}${mobile}`;
    const url = `https://wa.me/${phoneNumber}`;

    console.log("url", url);

    Linking.openURL(url).catch(() => {
      setModalType("warning");
      setModalMessage("WhatsApp not installed");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
    });
  };

  const isValidSubscription = PGDetails?.isSubscriptionActive;
  const isExportAllow = isValidSubscription && canReadCheckout;

  const handleCallPhone = (mobile) => {
    console.log("mobile", mobile)
    if (mobile) {
      CommonModule.makeCall(mobile)
    }

  }



  if (!canReadCheckout && !loading) {
    return (
      <View style={styles.container}>

        <View style={{ alignItems: "center", marginTop: 180 }}>

          <Image source={EmptyState} style={{ width: 250, height: 180, }} />
          <Text style={{ marginTop: 12, fontSize: 16, color: "#888" }}>
            You do not have access to view Checkout
          </Text>
        </View>
      </View>
    )
  }

  const handleOverViewScrren = (item) => {
    // setOverviewScreen(true)
    navigation.navigate("CustomerOverviewScreen", {
      customer: item,
    });
    setShowCustomerModal(false)
  }

  const renderItem = ({ item }) => {
    const isMenuVisible = menuVisibleId === item.customerId;
    console.log("checkout", item)

     const isValidImageUrl = (url) => {
    return typeof url === "string" && /^https?:\/\//i.test(url.trim());
  };

  console.log("CheckoutList",filteredCheckout)

    return (
      <>
        <SuccessModal
          visible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message={modalMessage}
          type={modalType}
        />

        <TouchableOpacity style={styles.card} onPress={() => openCustomerDetails(item)}>
          <View style={styles.leftRow}>
            <View  style={{ position: "relative" }}>
              {/* {item?.profilePic ? <Image source={{ uri: item.profilePic }} style={{ width: 55, height: 55, borderRadius: 25 }} /> :
                <View style={{ width: 55, height: 55, borderRadius: 25, backgroundColor: '#eef1ff', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>{item?.initials}</Text>
                </View>} */}

                   {isValidImageUrl(item?.profilePic) ? (
                                                <Image
                                                  source={{ uri: item?.profilePic }}
                                                  style={styles.profileImg}
                                                />
                                              ) : (
                                                <View style={{ width: 55, height: 55, borderRadius: 25, backgroundColor: '#eef1ff', justifyContent: 'center', alignItems: 'center' }}>
                                                  <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>
                                                    {item?.initials ||
                                                      item?.fullName?.slice(0, 2)?.toUpperCase() ||
                                                      "--"}
                                                  </Text>
                                                </View>
                                              )}
            </View>

            <View style={[styles.info,{flex:1}]}>
              <View style={{ flexShrink: 1}}>

                <Text style={styles.name} numberOfLines={1} ellipsizeMode="clip">{item.firstName} {item.lastName}</Text>

                <View style={styles.row}>
                  <View style={styles.floorBadge}>
                    <Text style={styles.floorText} numberOfLines={1} ellipsizeMode="clip">{item.floorName}</Text>
                  </View>

                  <View style={styles.iconRow}>
                    <Image source={RoomIcon} style={styles.icon} />
                    <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="clip">{item.roomName}</Text>
                  </View>

                  <View style={styles.iconRow}>
                    <Image source={BedIcon} style={styles.icon} />
                    <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="clip">{item.bedName}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.rightCol}>
            {/* <TouchableOpacity
            onPress={() =>
              setMenuVisibleId(isMenuVisible ? null : item.customerId)
            }
          >
            <Image
              source={Dots}
              style={{
                width: 26,
                height: 26,
                transform: [{ rotate: "90deg" }],
              }}
            />
          </TouchableOpacity> */}

            <Text style={styles.date}>{item.checkoutDate}</Text>

            {isMenuVisible && (
              <View style={styles.popup}>
                <TouchableOpacity style={styles.popupItem}>
                  <Text style={styles.popupText}>Re-Assign Bed</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.popupItem}>
                  <Text style={styles.popupText}>Move to Notice Period</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <>
      <View style={{ flex: 1 , paddingRight:15}}>


        {/* ✅ Menu open iruntha outside click la close pannum */}
        {menuVisibleId && (
          <TouchableWithoutFeedback onPress={() => setMenuVisibleId(null)}>
            <View style={styles.menuOverlay} />
          </TouchableWithoutFeedback>
        )}

        {!loading && filteredCheckout.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image source={EmptyState} style={styles.emptyImage} />
            <Text style={styles.emptyText}>
              No Checkout Tenant available{"\n"}
              There are no checkout tenant added
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredCheckout}
            keyExtractor={(item) => item.customerId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 60 }}
            showsVerticalScrollIndicator={false}
              // onScroll={handleScroll}
             scrollEventThrottle={16}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={
              loadingMore ? (
                <View style={{ paddingVertical: 16 }}>
                  <ActivityIndicator size="small" color="#1E45E1" />
                </View>
              ) : null
            }
          />
        )}





        <Modal visible={showCustomerModal} transparent animationType="fade">
          <View style={styles.overlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeModalWithAnimation}
            />

            <Animated.View
              // onStartShouldSetResponder={() => true}
              style={[styles.sheet, { transform: [{ translateY }] }]}
              {...panResponder.panHandlers}
            >
              <View style={styles.handle} />

              <Text style={styles.title}>Tenant Details</Text>

              <View style={{height: 0.8,backgroundColor: "#E5E7EB",marginTop:10}}/>

              <View style={styles.profileRow}>
                {selectedCustomer?.profilePic ? <Image source={{ uri: selectedCustomer.profilePic }} style={styles.profileImg} /> :
                  <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#eef1ff', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>{selectedCustomer?.initials}</Text>
                  </View>}

                <View style={styles.info}>
                  <View
                    style={{ flex: 1 }}

                  >
                    <TouchableOpacity onPress={() => handleOverViewScrren(selectedCustomer)}>
                      <Text style={styles.profileName}>
                        {selectedCustomer?.fullName}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.row}>
                      <View style={styles.floorBadge}>
                        <Text style={styles.floorText}>{selectedCustomer?.hostelInfo?.floorName}</Text>
                      </View>

                      <View style={styles.iconRow}>
                        <Image source={RoomIcon} style={styles.icon} />
                        <Text style={styles.detailText}>{selectedCustomer?.hostelInfo?.roomName}</Text>
                      </View>

                      <View style={styles.iconRow}>
                        <Image source={BedIcon} style={styles.icon} />
                        <Text style={styles.detailText}>{selectedCustomer?.hostelInfo?.bedName}</Text>
                      </View>
                    </View>
                  </View>
                </View>


              </View>

              <View style={styles.divider}/>

              <Text style={styles.label}>Email</Text>
              <View style={styles.infoRow}>
                <Image source={EmailIcon} style={styles.infoIcon} />
                <Text style={{ fontFamily: "Gilroy-Bold" }}>{selectedCustomer?.emailId || "N/A"}</Text>
              </View>

              {/* <Text style={styles.label}>Mobile</Text>
              <View style={styles.infoRow}>
                <Image source={PhoneIcon} style={styles.infoIcon} />
                <Text style={{fontFamily: "Gilroy-Bold" }}>{selectedCustomer?.mobileNo}</Text>
              </View> */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // marginTop: 15,
                }}
              >
                {/* LEFT SIDE */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Mobile</Text>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={MobileIcon}
                      style={{ width: 15, height: 15, marginRight: 5 }}
                      resizeMode="contain"
                    />
                    <Text style={styles.infoValue}>
                     +{selectedCustomer?.countryCode} {selectedCustomer?.mobileNo}
                    </Text>
                  </View>
                </View>

                {/* RIGHT SIDE ICON */}

                <TouchableOpacity

                  onPress={() =>
                    handleOpenWhatsapp(selectedCustomer)
                  }


                  style={[
                    {
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    !isExportAllow && { opacity: 0.4 },
                  ]}
                  disabled={!isExportAllow}
                >
                  <Image
                    source={WhatsappIcon}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCallPhone(selectedCustomer?.mobileNo)}

                  style={[
                    {
                      padding: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    !isExportAllow && { opacity: 0.4 },
                  ]}
                  disabled={!isExportAllow}
                >
                  <Image
                    source={CallIcon}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Checkout Date</Text>
              <View style={styles.infoRow}>
                <Image source={CalendarIcon} style={styles.infoIcon} />
                <Text style={{ fontFamily: "Gilroy-Bold" }}>{selectedCustomer?.checkoutInfo?.checkoutDate}</Text>
              </View>

              {/* <Text style={styles.label}>Amount</Text>
              <View style={styles.infoRow}>
                <Image source={AmountIcon} style={styles.infoIcon} />
                <Text>₹ {selectedCustomer?.amount}</Text>
              </View> */}

              <TouchableOpacity style={[styles.unassignBtn, {
                backgroundColor: selectedCustomer?.customerCurrentStatus === "BOOKED" ? "#1E45E10D" :
                  selectedCustomer?.customerCurrentStatus === "CHECK_IN" ? "#00A32E0F" :
                    selectedCustomer?.customerCurrentStatus === "NOTICE" ? "#FFF9F9" :
                      selectedCustomer?.customerCurrentStatus === "VACATED" ? "#FFF9F9" :
                        selectedCustomer?.customerCurrentStatus === "SETTLEMENT_GENERATED" ? "#1E45E10D" :
                          ["INACTIVE", "IN_ACTIVE", "InActive"].includes(selectedCustomer?.customerCurrentStatus) ? "#FFF8EB" : "#FFF9F9"
              }]}>
                {/* <Text style={styles.unassignText}>Un Assigned</Text> */}
                <Text style={[styles.unassignText, {
                  color: selectedCustomer?.customerCurrentStatus === "BOOKED" ? "#1E45E1" :
                    selectedCustomer?.customerCurrentStatus === "CHECK_IN" ? "#00A32E" :
                      selectedCustomer?.customerCurrentStatus === "NOTICE" ? "#FF0000" :
                        selectedCustomer?.customerCurrentStatus === "VACATED" ? "#FF0000" :
                          selectedCustomer?.customerCurrentStatus === "SETTLEMENT_GENERATED" ? "#1E45E1" :
                            ["INACTIVE", "IN_ACTIVE", "InActive"].includes(selectedCustomer?.customerCurrentStatus) ? "#FF9500" : "#FF0000"
                }]}>
                  {selectedCustomer?.customerCurrentStatus === "BOOKED" ? "Reserved"
                    : selectedCustomer?.customerCurrentStatus === "CHECK_IN" ? "Occupied"
                      : selectedCustomer?.customerCurrentStatus === "NOTICE" ? "Notice Period" :
                        selectedCustomer?.customerCurrentStatus === "VACATED" ? "Vacated"
                          : selectedCustomer?.customerCurrentStatus === "SETTLEMENT_GENERATED" ? "Settlement Generated"
                            : ["INACTIVE", "IN_ACTIVE", "InActive"].includes(selectedCustomer?.customerCurrentStatus) ? "InActive" : "Write_Off"}
                </Text>


              </TouchableOpacity>
            </Animated.View>

            {/* ✅ outside click close (this should be behind sheet) */}
            {/* <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeModalWithAnimation}
            /> */}
          </View>
        </Modal>



      </View>
    </>
  );
}

const styles = StyleSheet.create({
  
  card: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'flex-start',
    // backgroundColor: "#fff",
    // marginHorizontal: 10,
    // marginVertical: 6,
    // borderRadius: 12,
    // elevation: 2,
  },

  leftRow: { flexDirection: "row",flex:1, marginRight: 8,  },
  avatar: { width: 45, height: 45, borderRadius: 25 },

  info: { marginLeft: 12 },
  name: { fontFamily: "Gilroy-Bold", fontSize: 15 },

  row: { flexDirection: "row", marginTop: 4, alignItems: "center" },

  floorBadge: { backgroundColor: "#FFEFCF", padding: 5, borderRadius: 6 },
  floorText: { color: "#222222", fontSize: 11, fontFamily: "Gilroy-Medium" },

  iconRow: { flexDirection: "row", marginLeft: 6, alignItems: "center" },
  icon: { width: 16, height: 16, marginRight: 3 },
  detailText: { fontSize: 12, fontFamily: "Gilroy-Regular" },

  rightCol: { alignItems: "flex-end", paddingRight: 10,justifyContent:'space-between' },
  date: { color: "#999", fontSize: 11, marginTop: 4, fontFamily: "Gilroy-Regular" },

  popup: {
    position: "absolute",
    top: 35,
    right: 0,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    width: 170,
    elevation: 10,
    zIndex: 999,
  },

  popupItem: { paddingVertical: 10 },
  popupText: { fontSize: 14, color: "#111", fontFamily: "Gilroy-Medium" },

  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 50,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingBottom: 0,   // ✅ extra gap avoid
  },


  sheet: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,   // ✅ big padding remove
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },


  handle: {
    width: 60,
    height: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 50,
    marginBottom: 15,
  },

  title: { fontSize: 18, fontFamily: "Gilroy-Bold" },

  profileRow: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },

  profileImg: { width: 55, height: 55, borderRadius: 30 },
  profileName: { fontSize: 17, fontFamily: "Gilroy-Bold", },
  divider: {
  height: 0.4,
  backgroundColor: "#E5E7EB", 
  marginBottom: 4,
  marginTop:9
},

  label: { fontSize: 13, color: "#6B7280", marginTop: 12, fontFamily: "Gilroy-Regular" },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 4, },
  infoIcon: { width: 16, height: 16, marginRight: 6 },
  unassignBtn: {
    // borderWidth: 1,
    // borderColor: "#111",
    borderRadius: 15,
    marginTop: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  unassignText: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold"
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },

  emptyImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    opacity: 0.8,
  },

  emptyText: {
    fontSize: 14,
    fontFamily: "Gilroy-Medium",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 20,
  },
});
