import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Modal, Animated, BackHandler, PanResponder,
  NativeModules, Linking, Platform
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { useHasPermission } from "../../Utils/useHasPermission";
import Profile from "../../Assets/Images/profile.png";
import Filter from "../../Assets/Images/filter.png";
import SearchIcon from "../../Assets/Images/Asset_search.png";
import InProfile from "../../Assets/Images/inActiveuser.png";
import ActiveCheckout from "../../Assets/Images/Active_checkout.png";
import CheckoutIcon from "../../Assets/Images/checkout.png";
import ActiveWalkin from "../../Assets/Images/ActiveWalkin.png";
import WalkinIcon from "../../Assets/Images/walkin.png";
import TenAntAdd from "../../Assets/Images/TenantAdd.png";
import PlusIcon from "../../Assets/Images/add-circle.png";
import Dots from "../../Assets/Images/3dots.png";
import CallIcon from "../../Assets/Images/call_black_icon.png";
import WhatsappIcon from "../../Assets/Images/whatsapp.png";
import MobileIcon from "../../Assets/Images/mobile.png";
import MoveNoticeSheet from '../Customer/MoveToNoticePeriod';
import ReassignBedSheet from '../Customer/ReAssignBed';
import CheckoutList from '../Customer/Checkout/CheckoutList';
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import WalkinScreen from '../Customer/WalkIn/WalkinList'
import Call from "../../Assets/Images/call.png";
import Sms from "../../Assets/Images/sms.png";
import dateImg from "../../Assets/Images/home-link.png";
import room from "../../Assets/Images/PG_active.png";
import Bed from "../../Assets/Images/bed.png";
import { Dimensions } from "react-native";
import CheckoutBottomSheet from './Checkout/CheckoutTenant';
import { CommonContexts } from "../../Context/CommonContext";
import { PGContext } from "../../Context/PGContext";
import { useCustomer } from "../../Context/CustomerContext";
import EmptyState from "../../Assets/Images/Empty_state.png";
import Loader from "../Loader/Loader";
import InactiveTenantSheet from "../PG/ReservedBed/MakeUsInActiveSheet";
import CustomerOverviewScreen from "./CustomerOverview/CustomerOverviewSheet";
import moment from "moment";
import RentMoney from "../../Assets/Images/RentMoney.png"
import DirectionImage from "../../Assets/Images/direction-down.png"
import SuccessModal from "../../ToastFile/ToastPage";
import { useHideTabbarOnScroll } from "../../Utils/useHideTabbarOnScroll";
import ListView from "../../Assets/Images/listview.png";
import RoomView from "../../Assets/Images/Roomview.png";
import RoomIcon from "../../Assets/Images/Room_Icon.png"

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.60;

// onPress={() =>
//               navigation.navigate("AddTenant", {
//                 refreshWalkins: walkinCustomers,
//                  mode: "Add",
//               })
//             }

export default function TenantsScreen({ route }) {
  const { setShowTabBar } = route.params;
  const screenWidth = Dimensions.get("window").width;
  const { activeHostelId } = useContext(CommonContexts);
  const { getCustomersByHostel, loading, GetParticularCustomerDetails } = useCustomer();
  const { getParticularHostelDetails, PGDetails } = useContext(PGContext);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const detailDotsRef = useRef(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [reassignCustomer, setReassignCustomer] = useState(null);
  const [showInactiveSheet, setShowInactiveSheet] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [overviewScreen, setOverviewScreen] = useState(false)
  const [searchText, setSearchText] = useState("");
  const { CommonModule } = NativeModules;

  const [tenantFilter, setTenantFilter] = useState("All");
  const [viewType, setViewType] = useState("Room View");
  const [tenantStatus, setTenantStatus] = useState("All");
  const [period, setPeriod] = useState("All");
  const [sharingType, setSharingType] = useState("All");

  const [activeDropdown, setActiveDropdown] = useState(null);

  console.log("activeHostelId", activeHostelId)
  console.log("reassignCustomer", reassignCustomer);

  const { handleScroll } = useHideTabbarOnScroll(setShowTabBar);


  const sheetTranslateY = useRef(
    new Animated.Value(SHEET_HEIGHT)
  ).current;

  const handleOverViewScrren = (item) => {
    setOverviewScreen(true)
    navigation.navigate("CustomerOverviewScreen", {
      customer: item,
    });
  }

  const {
    canWriteModule: canWriteTenant,
    canReadModule: canReadTenant,
    canUpdateModule: canUpdateTenant,
    canDeleteModule: canDeleteTenant,
  } = useHasPermission("Customers");


  useEffect(() => {
    if (showDetailModal) {
      sheetTranslateY.setValue(SHEET_HEIGHT);

      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [showDetailModal]);


  const detailPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dy) > Math.abs(g.dx) && g.dy > 5,

      // 👉 ONLY MOVE SHEET WITH FINGER
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          sheetTranslateY.setValue(g.dy);
        }
      },

      // 👉 DECISION HERE
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1.2) {
          Animated.timing(sheetTranslateY, {
            toValue: SHEET_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            closeDetailSheet();
          });
        } else {
          Animated.spring(sheetTranslateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;


  const closeDetailSheet = () => {
    Animated.timing(sheetTranslateY, {
      toValue: SHEET_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      sheetTranslateY.setValue(SHEET_HEIGHT);
      setShowDetailModal(false);
      setShowDetailsMenu(false);
    });
  };



  console.log("customers", customers)
  useFocusEffect(
    useCallback(() => {
      if (activeHostelId) {
        fetchCustomers();
      }
    }, [activeHostelId])
  );

  useEffect(() => {
    if (activeHostelId) {
      getParticularHostelDetails(activeHostelId);
    }
  }, [activeHostelId])

  useFocusEffect(
    useCallback(() => {
      setSearchText("");
    }, [])
  );


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
  const isExportAllow = isValidSubscription && canReadTenant;

  const handleCallPhone = (mobile) => {
    console.log("mobile", mobile)
    if (mobile) {
      CommonModule.makeCall(mobile)
    }

  }

  console.log("selectedCustomer", selectedCustomer);


  const fetchCustomers = async () => {
    if (activeHostelId) {
      const data = await getCustomersByHostel(activeHostelId);
      setCustomers(data || []);
    }
  };
  const handleCheckoutSuccess = async () => {
    await fetchCustomers();
    setShowCheckout(false);
  };



  const [activeTab, setActiveTab] = useState("Tenants");
  const navigation = useNavigation();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showReAssignbed, setShowReAssignBed] = useState(false)
  const [showNotice, setShowNotice] = useState(false);

  const [reason, setReason] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDetailsMenu, setShowDetailsMenu] = useState(false);
  const [deleteTenants, setDeleteTenants] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null);
  const [customerExpectedJoiningDate, setexpectedJoiiningDate] = useState()
  console.log("selectedCustomer", selectedCustomer)
  const handleWalkinFilter = () => {
    setShowFilter(true);
  };

  const filterTranslateY = useRef(new Animated.Value(500)).current;

  const isSettlement =
    selectedCustomer?.customerCurrentStatus === "SETTLEMENT_GENERATED";




  useEffect(() => {
    Animated.timing(filterTranslateY, {
      toValue: showFilter ? 0 : 500,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [showFilter]);


  const filterPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) filterTranslateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) setShowFilter(false);
      else {
        Animated.spring(filterTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });
  const handleMakeUsInActive = () => {
    setShowDetailsMenu(false);
    setShowInactiveSheet(true)
    setMenuVisible(false)
    setShowDetailModal(false)

  }

  console.log("selectedItem", selectedItem);


  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const dotsRef = useRef(null);

  const openMenu = (event, item) => {
    event.stopPropagation();

    const { pageX, pageY } = event.nativeEvent;


    if (menuVisible && selectedItem?.customerId === item.customerId) {
      setMenuVisible(false);
      setSelectedItem(null);
      return;
    }

    setSelectedItem(item);

    setMenuPosition({
      x: Math.max(10, pageX - 180),
      y: pageY + 8,
    });

    setMenuVisible(true);
  };

  const DeleteMenu = () => {
    setDeleteTenants(true)
  }
  const CloseDelete = () => {
    setDeleteTenants(false)
  }

  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");

  const isTabBarVisible = useRef(true);





  // useLayoutEffect(() => {
  //   setShowTabBar(!showDetailModal && !showFilter && !showCheckout && !showNotice && !showInactiveSheet,!showReAssignbed);
  // }, [showDetailModal, showFilter, showCheckout, showNotice,showInactiveSheet,showReAssignbed]);

  // useLayoutEffect(() => {
  //   setShowTabBar(
  //     !showDetailModal &&
  //     !showFilter &&
  //     !showCheckout &&
  //     !showNotice &&
  //     !showInactiveSheet &&
  //     !showReAssignbed
  //   );
  // }, [
  //   showDetailModal,
  //   showFilter,
  //   showCheckout,
  //   showNotice,
  //   showInactiveSheet,
  //   showReAssignbed
  // ]);


  useLayoutEffect(() => {
    if (
      showDetailModal ||
      showFilter ||
      showCheckout ||
      showNotice ||
      showInactiveSheet ||
      showReAssignbed
    ) {
      setShowTabBar(false);
    } else {
      setShowTabBar(isTabBarVisible.current);
    }
  }, [showDetailModal,
    showFilter,
    showCheckout,
    showNotice,
    showInactiveSheet,
    showReAssignbed]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (navigation.canGoBack()) {

          setShowTabBar(true);
          isTabBarVisible.current = true;

          navigation.goBack();
        }
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);


  useLayoutEffect(() => {
    const backAction = () => {

      // ✅ 1) First close sheets / modals (your existing)
      if (showDetailModal) {
        closeDetailSheet();
        return true;
      }

      if (showInactiveSheet) {
        setShowInactiveSheet(false);
        return true;
      }

      if (showReAssignbed) {
        setShowReAssignBed(false);
        return true;
      }

      if (showFilter) {
        setShowFilter(false);
        return true;
      }

      if (showCheckout) {
        setShowCheckout(false);
        return true;
      }

      if (showNotice) {
        setShowNotice(false);
        return true;
      }

      // ✅ 2) Tab navigation back order
      if (activeTab === "Walk-In") {
        setActiveTab("Checkout");
        return true;
      }

      if (activeTab === "Checkout") {
        setActiveTab("Tenants");
        return true;
      }


      return false;
    };

    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => handler.remove();
  }, [
    showDetailModal,
    showInactiveSheet,
    showFilter,
    showCheckout,
    showNotice,
    activeTab, showReAssignbed
  ]);


  //   useLayoutEffect(() => {
  //     const backAction = () => {
  //       if (showDetailModal) {
  //         setShowDetailModal(false);
  //         return true;
  //       }
  //       if(showInactiveSheet){
  // setShowInactiveSheet(false)
  // return true;
  //       }

  //       if (showFilter) {
  //         setShowFilter(false);
  //         return true;
  //       }
  //       if (showCheckout) {
  //         setShowCheckout(false);
  //         return true;
  //       }
  //       if (showNotice) {
  //         setShowNotice(false);
  //         return true;
  //       }



  //       return false;
  //     };

  //     const handler = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       backAction
  //     );

  //     return () => handler.remove();
  //   }, [showDetailModal, showFilter, showCheckout, showNotice,showInactiveSheet]);


  //   const lastScrollY = useRef(0);
  // const isTabBarVisible = useRef(true);


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

  const handleApply = () => {
    console.log({
      tenantFilter,
      viewType,
      tenantStatus,
      period,
      sharingType,
    });

    setShowFilter(false);
  };

  const viewIcons = {
    "List View": ListView,
    "Room View": RoomView,
  };

  const renderDropdown = (label, value, setValue, options, keyName) => (
    <>
      <Text style={styles.label}>{label}</Text>

      <View style={{ position: "relative" }}>
        <TouchableOpacity
          style={styles.dropdownBox}
          onPress={() =>
            setActiveDropdown(activeDropdown === keyName ? null : keyName)
          }
        >
          <Text style={styles.dropdownText}>{value}</Text>
          <Text style={styles.arrow}>⌄</Text>
        </TouchableOpacity>

        {activeDropdown === keyName && (
          <View style={styles.dropdownMenu}>
            <ScrollView nestedScrollEnabled>
              {options.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[
                    styles.dropdownItem,
                    value === v && styles.activeItem
                  ]}
                  onPress={() => {
                    setValue(v);
                    setActiveDropdown(null);
                  }}
                >
                  {keyName === "view" && viewIcons[v] && (
                    <Image source={viewIcons[v]} style={styles.viewIcon} />
                  )}

                  <Text
                    style={[
                      styles.dropdownItemText,
                      value === v && { fontWeight: "600", color: "#1E45E1" }
                    ]}
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );

  const tabs = [
    { key: "Tenants", active: Profile, inactive: InProfile },
    { key: "Checkout", active: ActiveCheckout, inactive: CheckoutIcon },
    { key: "Walk-In", active: ActiveWalkin, inactive: WalkinIcon },
  ];


  const openCustomerDetails = async (customer) => {

    setShowDetailsMenu(false);
    const res = await GetParticularCustomerDetails(customer.customerId)
    console.log("customerfull", res)
    console.log("roman", customer)
    setexpectedJoiiningDate(customer)
    setSelectedCustomer(res?.data)
    setSelectedItem(customer)
    setShowDetailModal(true);
  };


  console.log("selecteditem", selectedItem);
  console.log("selectedcustomer", selectedCustomer);

  const handleShowReAssignBed = () => {
    setShowReAssignBed(true)
    setMenuVisible(false)
  }

  // const handlecloseReAssignbed = () => {
  //   setShowReAssignBed(false)
  // }

  const handlecloseReAssignbed = async () => {
    await fetchCustomers();
    setShowReAssignBed(false);
  };

  const handleShowFinalSettlement = () => {
    setShowDetailModal(false)
    setShowDetailsMenu(false)
    setMenuVisible(false)
    navigation.navigate("FinalSettlement", {
      selectedItem: selectedItem
      // selectedBed?.currentTenantInfo?.[0]?.tenetId,
    });
  }


  const handleShowFinalNew = () => {
    setShowDetailModal(false)
    setShowDetailsMenu(false)
    setMenuVisible(false)
    navigation.navigate("FinalSettlementScreen", {
      selectedItem: selectedItem
      // selectedBed?.currentTenantInfo?.[0]?.tenetId,
    });
  }
  const handleShowFinalSettlementNotice = (item) => {
    setSelectedItem(item)
    setMenuVisible(false)
    setShowDetailModal(false)
    setShowDetailsMenu(false)
    navigation.navigate("FinalSettlement", {
      selectedItem: selectedItem

    });
  }
  const handleShowTennantCheckin = () => {
    setShowDetailsMenu(false);
    setShowDetailModal(false);
    setMenuVisible(false)
    // navigation.navigate("TenantCheckin")
    navigation.navigate("BookingCheckIn", {
      customerId: selectedItem.customerId,
      customer: selectedItem,
    });

    console.log("selectedItem", selectedItem);



  }

  const handleShowAddBooking = () => {
    navigation.navigate("AddBooking")
  }

  const handleShowCancelNotice = () => {
    setMenuVisible(false)
    setShowDetailsMenu(false);
    setShowDetailModal(false);
    navigation.navigate("CancelNotice", {
      selectedItem: selectedItem,
    });
  };
  const filteredTenants = customers?.listCustomers?.filter((item) => {
    const search = searchText.trim().toLowerCase();

    return (
      item?.fullName?.toLowerCase().includes(search) ||
      item?.mobile?.toString().includes(search) ||
      item?.roomName?.toLowerCase().includes(search) ||
      item?.bedName?.toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Checked In":
        return "#00A32E"; // Green
      case "Booked":
        return "#1E45E1"; // Blue
      case "Notice Period":
      case "Settlement Generated":
        return "#FF0000"; // Red
      default:
        return "#D1D5DB"; // Grey fallback
    }
  };




  const customerList = [
    {
      id: 1,
      name: "Rajkumar M",
      img: Profile,
      floor: "Ground Floor",
      room: "203",
      bed: "03",
      email: "rajkumar001@gmail.com",
      phone: "+91 98765 43210",
      joinDate: "10 July 2025",
    },
  ];

  // if (!canReadTenant && !loading) {
  //       return (
  //          <View style={styles.container}>

  //         <View style={{ alignItems: "center", marginTop: 180 }}>

  //           <Image source={EmptyState} style={{ width: 250, height: 180, }}/>
  //           <Text style={{ marginTop: 12, fontSize: 16, color: "#888" }}>
  //             You do not have access to view Tenant
  //           </Text>
  //         </View>
  //         </View>
  //       )
  //     }

  return (
    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />

      {loading && <Loader />}

      <SafeAreaView style={styles.container}>
        <View style={{ paddingHorizontal: 16 }}>

          <View style={styles.searchContainer}>
            <Image source={SearchIcon} style={styles.searchIcon} />

            <TextInput
              // style={styles.searchInput}
              style={[styles.searchInput, !canReadTenant && { opacity: 0.4 }]}
              disabled={!canReadTenant}
              placeholder="Search Tenants"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={(t) => {
                // ✅ emoji remove + only normal text
                const cleanText = t.replace(/[^\p{L}\p{N}\s]/gu, "");
                setSearchText(cleanText);
              }}
            />
          </View>


          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                onPress={() => {
                  setActiveTab(tab.key);
                  setSearchText("");
                }}
              >
                <View style={styles.tabContent}>
                  {/* <Image
                  source={activeTab === tab.key ? tab.active : tab.inactive}
                  style={styles.tabIcon}
                /> */}
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.key && styles.activeText,
                    ]}
                  >
                    {tab.key}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </View>

        {activeTab === "Tenants" && (



          <View style={{ flex: 1 }}>

            {!canReadTenant && !loading && (
              <View style={styles.emptyContainer}>
                <Image source={EmptyState} style={styles.emptyImage} />
                <Text style={styles.emptyText}>
                  You don’t have permission to view Tenants.
                </Text>
              </View>
            )}

            {canReadTenant && (
              <>
                {!loading && (customers?.listCustomers?.length ?? 0) === 0 && (
                  <View style={styles.emptyContainer}>
                    <Image source={EmptyState} style={styles.emptyImage} />
                    <Text style={styles.emptyText}>
                      No Tenant available{"\n"}
                      There are no tenant added.
                    </Text>

                    <TouchableOpacity
                      style={[styles.addBtnAdd, !canWriteTenant && { opacity: 0.4 }]}
                      disabled={!canWriteTenant}
                      onPress={() =>
                        navigation.navigate("AddTenantNew", {
                          mode: "Add",
                        })
                      }
                    // onPress={}
                    >
                      <Text style={styles.addBtnText}>
                        + Add Tenant
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* <ScrollView horizontal
                  style={{ flexGrow: 0 }} contentContainerStyle={{ paddingLeft: 16, paddingRight: 12 }}>
                  <>
                    {customers?.listCustomers?.length > 0 && (
                      <View style={styles.filterRow}>
                        <TouchableOpacity style={styles.filterChipActive}>
                          <Text style={styles.filterChipTextActive}>All</Text>
                          <Image
                            source={DirectionImage}
                            style={styles.chipArrow}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.filterChip}>
                          <View style={styles.chipContent}>
                            <Text style={styles.filterChipText}>Type</Text>
                            <Image
                              source={DirectionImage}
                              style={styles.chipArrow}
                              resizeMode="contain"
                            />
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.filterChip}>
                          <View style={styles.chipContent}>
                            <Text style={styles.filterChipText}>Status</Text>
                            <Image
                              source={DirectionImage}
                              style={styles.chipArrow}
                              resizeMode="contain"
                            />
                          </View>
                        </TouchableOpacity>


                        <TouchableOpacity style={[styles.filterIconBtn, { marginLeft: 5 }]} disabled={!canReadTenant}
                          onPress={() => setShowFilter(true)}>
                          <Image source={Filter} style={{ width: 18, height: 18 }} />
                        </TouchableOpacity>
                      </View>
                    )
                    }
                  </>
                </ScrollView> */}



                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 50,
                    paddingHorizontal: 16,
                  }}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}

                >


                  {/* {
                    customers?.listCustomers?.length > 0 &&
                    <Text style={styles.sectionTitle}>This Month</Text>
                  } */}

                  {/* {
          customers.map((item)=>{
<View style={styles.tenantRow}>
        <TouchableOpacity  onPress={() => openCustomerDetails(item.customerId)}>
          <Image source={Profile} style={styles.profileImg} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.fullName} {item.lastName}</Text>
            <View style={styles.detailRow}>
              <View style={styles.floorBadge}>
                <Text style={styles.floorText}>{item.floorName}</Text>
              </View>
              <Image source={room} style={styles.iconSmall} />
              <Text style={styles.detailText}>{item.roomName}</Text>
              <Image source={Bed} style={styles.iconSmall} />
              <Text style={styles.detailText}>{item.bedName}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
          

      
<TouchableOpacity ref={dotsRef} onPress={() => openMenu(customerList[0])}>

  <Image
    source={Dots}
    style={{ width: 30, height: 30, transform: [{ rotate: "90deg" }] }}
  />
</TouchableOpacity>


            <Text style={styles.dateText}>01/06</Text>
            
          </View>
        
        </View>
          })
        } */}

                  {filteredTenants?.map((item) => (
                    // <View key={item.customerId} style={styles.tenantRow}>

                    //   <TouchableOpacity onPress={() => openCustomerDetails(item)}>
                    //     <Image source={Profile} style={styles.profileImg} />
                    //   </TouchableOpacity>

                    //   <View style={{ flex: 1 }}>
                    //     <Text style={styles.name}>
                    //       {item.fullName}
                    //     </Text>

                    //     <View style={styles.detailRow}>
                    //       {item.floorName && (
                    //         <View style={styles.floorBadge}>
                    //           <Text style={styles.floorText}>{item.floorName}</Text>
                    //         </View>
                    //       )}

                    //       {item.roomName && (
                    //         <>
                    //           <Image source={room} style={styles.iconSmall} />
                    //           <Text style={styles.detailText}>{item.roomName}</Text>
                    //         </>
                    //       )}

                    //       {item.bedName && (
                    //         <>
                    //           <Image source={Bed} style={styles.iconSmall} />
                    //           <Text style={styles.detailText}>{item.bedName}</Text>
                    //         </>
                    //       )}
                    //     </View>
                    //   </View>

                    //   <View style={styles.rightSection}>
                    //     <TouchableOpacity ref={dotsRef} onPress={(e) => openMenu(e, item)}>
                    //       <Image
                    //         source={Dots}
                    //         style={{ width: 30, height: 30, transform: [{ rotate: "90deg" }] }}
                    //       />
                    //     </TouchableOpacity>

                    //     <Text style={styles.dateText}>
                    //       {item.bookedAt || "--"}
                    //     </Text>
                    //   </View>

                    // </View>
                    //                 <TouchableOpacity
                    //   key={item.customerId}
                    //   style={styles.tenantRow}
                    //   activeOpacity={0.7}
                    //   onPress={() => openCustomerDetails(item)}   
                    // >

                    //   <Image source={Profile} style={styles.profileImg} />


                    //   <View style={{ flex: 1 }}>
                    //     <Text style={styles.name}>{item.fullName}</Text>

                    //     <View style={styles.detailRow}>
                    //       {item.floorName && (
                    //         <View style={styles.floorBadge}>
                    //           <Text style={styles.floorText}>{item.floorName}</Text>
                    //         </View>
                    //       )}

                    //       {item.roomName && (
                    //         <>
                    //           <Image source={room} style={styles.iconSmall} />
                    //           <Text style={styles.detailText}>{item.roomName}</Text>
                    //         </>
                    //       )}

                    //       {item.bedName && (
                    //         <>
                    //           <Image source={Bed} style={styles.iconSmall} />
                    //           <Text style={styles.detailText}>{item.bedName}</Text>
                    //         </>
                    //       )}
                    //     </View>
                    //   </View>


                    //   <View style={styles.rightSection}>
                    //     <TouchableOpacity
                    //       onPress={(e) => {
                    //         e.stopPropagation();        
                    //         openMenu(e, item);          
                    //       }}
                    //       hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    //     >
                    //       <Image
                    //         source={Dots}
                    //         style={{ width: 30, height: 30, transform: [{ rotate: "90deg" }] }}
                    //       />
                    //     </TouchableOpacity>

                    //     <Text style={styles.dateText}>
                    //       {item.bookedAt || "--"}
                    //     </Text>
                    //   </View>
                    // </TouchableOpacity>
                    <View key={item.customerId}>
                      <TouchableOpacity key={item.customerId} style={styles.tenantRow} activeOpacity={0.7}
                        onPress={() => openCustomerDetails(item)}>





                        <TouchableOpacity
                          activeOpacity={0.7}
                          // onPress={() => openCustomerDetails(item)}
                          style={{ position: "relative" }}
                        >
                          {item?.profilePic ? (
                            <Image
                              source={{ uri: item.profilePic }}
                              style={styles.profileImg}
                            />
                          ) : (
                            <View style={styles.initialCircle}>
                              <Text style={styles.initialText}>
                                {item?.initials ||
                                  item?.fullName?.slice(0, 2)?.toUpperCase() ||
                                  "--"}
                              </Text>
                            </View>
                          )}

                          {/* ✅ STATUS DOT */}
                          <View
                            style={[
                              styles.statusDot,
                              { backgroundColor: getStatusColor(item.currentStatus) },
                            ]}
                          />
                        </TouchableOpacity>






                        {/* 2️⃣ CENTER ROW CLICK (Overview screen) */}
                        <View
                          style={{ flex: 1 }}
                        // activeOpacity={0.7}
                        // onPress={() => handleOverViewScrren(item)}
                        >
                          <Text style={styles.name} numberOfLines={1}
                            ellipsizeMode="tail">{item.fullName}</Text>

                          <View style={styles.detailRow}>
                            {item.floorName && (
                              <View style={[styles.floorBadge, { flex: 1, alignItems: 'center' }]}>
                                <Text style={[styles.floorText]} numberOfLines={1}
                                  ellipsizeMode="tail">{item.floorName}</Text>
                              </View>
                            )}

                            {item.roomName && (
                              <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>
                                <Image source={room} style={styles.iconSmall} />
                                <Text style={[styles.detailText, { flexShrink: 1 }]} numberOfLines={1}
                                  ellipsizeMode="tail">{item.roomName}</Text>

                              </View>

                            )}

                            {item.bedName && (
                              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Bed} style={styles.iconSmall} />
                                <Text style={[styles.detailText, { flexShrink: 1 }]} numberOfLines={1}
                                  ellipsizeMode="tail">{item.bedName}</Text>
                              </View>
                            )}
                          </View>
                        </View >

                        <View style={styles.rightSection}>
                          {/* <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();   
                            openMenu(e, item);
                          }}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Image
                            source={Dots}
                            style={{ width: 30, height: 30, transform: [{ rotate: "90deg" }] }}
                          />
                        </TouchableOpacity> */}

                          <TouchableOpacity
                            style={[!isExportAllow && { opacity: 0.4 }]}
                            disabled={!isExportAllow}
                            onPress={() => {
                              handleCallPhone(item.mobile)
                            }}>
                            <Image
                              source={CallIcon}
                              style={{ width: 20, height: 20, }}
                            />
                          </TouchableOpacity>


                          {/* <Text style={styles.dateText}>
                          {item?.actualJoining && item.actualJoining !== "0000-00-00"
                            ? item.actualJoining
                            : item?.expectedJoiningDate && item.expectedJoiningDate !== "0000-00-00"
                              ? item.expectedJoiningDate
                              : item?.RecheckIn_Date && item.RecheckIn_Date !== "0000-00-00"
                                ? item.RecheckIn_Date
                                : "-"
                          }
                        </Text> */}



                        </View>

                      </TouchableOpacity>
                      <View style={styles.dividerLine} />
                    </View>
                  ))}



                </ScrollView>

              </>
            )}

            {customers?.listCustomers?.length > 0 &&
              <>
                <TouchableOpacity
                  style={[styles.addBtn, !canWriteTenant && { opacity: 0.4 }]}
                  disabled={!canWriteTenant}
                  onPress={() =>
                    navigation.navigate("AddTenantNew", {
                      mode: "Add",
                    })
                  }
                >
                  <Image source={PlusIcon} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
              </>
            }

            {/* {customers?.listCustomers?.length > 0 &&
              <TouchableOpacity
                style={[
                  styles.editButton,
                  !canReadTenant && { opacity: 0.4 }
                ]}
                disabled={!canReadTenant}
                onPress={() => setShowFilter(true)}>
                <Image source={Filter} style={{ width: 30, height: 30 }} />
              </TouchableOpacity>
            } */}



          </View>
        )}

        {activeTab === "Checkout" && (
          <CheckoutList searchText={searchText} setShowTabBar={setShowTabBar} />
        )}
        {activeTab === "Walk-In" && (
          <WalkinScreen setShowTabBar={setShowTabBar} navigation={navigation}
            handleWalkinFilter={handleWalkinFilter} searchText={searchText} />
        )}

        {showDetailModal && (
          <View style={styles.modalOverlay}>

            {/* outside close */}
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={closeDetailSheet}
            />

            <Animated.View
              style={[
                styles.bottomSheet,
                {
                  // height: isSettlement ? 440 : SHEET_HEIGHT,
                  maxHeight: '90%',
                  transform: [{ translateY: sheetTranslateY }],
                },
              ]}
              {...detailPanResponder.panHandlers}
            >

              <View style={styles.modalHandle} />


              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tenant Details</Text>
                {/* <TouchableOpacity onPress={() => setShowDetailsMenu(true)}>
            <Image
              source={Dots}
              style={{ width: 24, height: 24, transform: [{ rotate: "90deg" }] }}
            />
          </TouchableOpacity> */}


                <TouchableOpacity
                  ref={detailDotsRef}
                  onPress={() => {
                    //  setSelectedItem(selectedCustomer); 
                    detailDotsRef.current.measureInWindow((x, y, w, h) => {
                      setPopupPosition({ x, y, w, h });
                      setShowDetailsMenu(true);
                    });
                  }}
                >
                  <Image source={Dots} style={{ width: 24, height: 24, transform: [{ rotate: "90deg" }] }} />
                </TouchableOpacity>

              </View>

              <View style={styles.divider} />




              <View style={styles.modalProfileRow}>
                {/* <Image source={Profile} style={styles.modalProfileImg} /> */}
                {selectedCustomer?.profilePic ? (
                  <Image
                    source={{ uri: selectedCustomer.profilePic }}
                    style={styles.modalProfileImg}
                  />
                ) : (
                  <View style={styles.modalInitialCircle}>
                    <Text style={styles.modalInitialText}>
                      {selectedCustomer?.initials ||
                        `${selectedCustomer?.firstName?.[0] || ""}${selectedCustomer?.lastName?.[0] || ""}`.toUpperCase() ||
                        "--"}
                    </Text>
                  </View>
                )}


                <View style={{ marginLeft: 12, flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => {
                      closeDetailSheet();
                      navigation.navigate("CustomerOverviewScreen", {
                        customer: selectedCustomer,
                      });
                    }}
                  >
                    <Text style={styles.modalName} numberOfLines={1}
                      ellipsizeMode="tail">
                      {selectedCustomer?.fullName}
                    </Text>
                  </TouchableOpacity>
                  {/* <Text style={styles.modalName}>{selectedCustomer?.fullName} </Text> */}

                  <View style={styles.detailRow}>
                    <View style={styles.floorBadge}>
                      <Text style={[styles.floorText, { flexShrink: 1 }]}
                        numberOfLines={1}
                        ellipsizeMode="tail">{selectedCustomer?.hostelInfo?.floorName}</Text>
                    </View>
                    <Image source={room} style={{ width: 18, height: 18, marginRight: 4 }} />
                    <Text style={[styles.detailText, { flexShrink: 1 }]}
                      numberOfLines={1}
                      ellipsizeMode="tail">{selectedCustomer?.hostelInfo?.roomName}</Text>
                    <Image source={Bed} style={{ width: 18, height: 18, marginLeft: 8, marginRight: 4 }} />
                    <Text style={[styles.detailText, { flexShrink: 1 }]}
                      numberOfLines={1}
                      ellipsizeMode="tail">{selectedCustomer?.hostelInfo?.bedName}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.infoLabel}>Email ID</Text>
              {/* <Text style={styles.infoValue}> <Image source={Call} style={{width:15,height:15,marginRight:5}} />{selectedCustomer?.email}</Text> */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={Sms}
                  style={{ width: 15, height: 15, marginRight: 5 }}
                  resizeMode="contain"
                />
                <Text style={styles.infoValue}>{selectedCustomer?.emailId ? selectedCustomer?.emailId : "N/A"}</Text>
              </View>


              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // marginTop: 15,
                }}
              >
                {/* LEFT SIDE */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Contact Number</Text>

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
                  // style={{
                  //   padding: 10,
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  // }}

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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ marginTop: 10, }}>
                  <Text style={{ fontSize: 13, color: "#6B7280", fontFamily: "Gilroy-Semibold" }}>
                    {selectedCustomer?.customerCurrentStatus == "BOOKED" ? "Joining Date (Tentative)" : "Joined Date"}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={dateImg}
                      style={{ width: 15, height: 15, marginRight: 5 }}
                      resizeMode="contain"
                    />
                    <Text style={styles.infoValue}>
                      {customerExpectedJoiningDate?.expectedJoiningDate || selectedCustomer?.hostelInfo?.joiningDate}</Text>
                  </View>
                </View>


              </View>

              {
                selectedCustomer?.customerCurrentStatus == "BOOKED" && (
                  <View style={{ marginTop: 10, }}>
                    <Text style={{ fontSize: 13, color: "#6B7280", fontFamily: "Gilroy-Semibold" }}>Booking Date</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={dateImg}
                        style={{ width: 15, height: 15, marginRight: 5 }}
                        resizeMode="contain"
                      />
                      <Text style={{ fontSize: 14, color: "#111", marginTop: 1, fontFamily: "Gilroy-Bold" }}>
                        {selectedCustomer?.bookingInfo?.bookingDate}
                      </Text>
                    </View>
                  </View>

                )
              }

              {
                ["CHECK_IN", "OCCUPIED", "NOTICE"].includes(selectedCustomer?.customerCurrentStatus) && (
                  <View style={{ flexDirection: 'column', }}>
                    <View style={{ marginTop: 10, }}>
                      <Text style={{ fontSize: 13, color: "#6B7280", fontFamily: "Gilroy-Semibold" }}>
                        Rental Amount
                        {/* {selectedCustomer?.customerCurrentStatus == "BOOKED" ? "Joining Date" : "Joined Date"} */}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image
                          source={RentMoney}
                          style={{ width: 15, height: 15, marginRight: 5 }}
                          resizeMode="contain"
                        />
                        <Text style={{ fontSize: 14, color: "#111", marginTop: 1, fontFamily: "Gilroy-Bold" }}>
                          ₹{new Intl.NumberFormat('en-IN').format(selectedCustomer?.hostelInfo?.monthlyRent)}</Text>
                      </View>
                    </View>

                    <View style={{ marginTop: 10, }}>
                      <Text style={{ fontSize: 13, color: "#6B7280", fontFamily: "Gilroy-Semibold" }}>Advance Amount</Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image
                          source={dateImg}
                          style={{ width: 15, height: 15, marginRight: 5 }}
                          resizeMode="contain"
                        />
                        <Text style={{ fontSize: 14, color: "#111", marginTop: 1, fontFamily: "Gilroy-Bold" }}>
                          ₹{new Intl.NumberFormat('en-IN').format(selectedCustomer?.advanceInfo?.advanceAmount)}
                        </Text>
                      </View>
                    </View>

                  </View>
                )
              }

              {
                selectedCustomer?.customerCurrentStatus == "BOOKED" && (
                  <View style={{ marginTop: 10, }}>
                    <Text style={{ fontSize: 13, color: "#6B7280", }}>
                      Booking Amount
                      {/* {selectedCustomer?.customerCurrentStatus == "BOOKED" ? "Joining Date" : "Joined Date"} */}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={RentMoney}
                        style={{ width: 15, height: 15, marginRight: 5 }}
                        resizeMode="contain"
                      />
                      <Text style={{ fontSize: 14, color: "#111", marginTop: 1, fontFamily: "Gilroy-Bold" }}>
                        ₹{new Intl.NumberFormat('en-IN').format(selectedCustomer?.bookingInfo?.bookingAmount)}</Text>
                    </View>
                  </View>
                )
              }



              <TouchableOpacity style={[styles.unassignBtn, {
                backgroundColor: selectedCustomer?.customerCurrentStatus === "BOOKED" ? "#1E45E10D" :
                  selectedCustomer?.customerCurrentStatus === "CHECK_IN" ? "#00A32E0F" :
                    selectedCustomer?.customerCurrentStatus === "NOTICE" ? "#FFF9F9" :
                      selectedCustomer?.customerCurrentStatus === "SETTLEMENT_GENERATED" ? "#1E45E10D" :
                        selectedCustomer?.customerCurrentStatus === "DRAFT" ? "#FFF8EB" :
                          ["INACTIVE", "IN_ACTIVE", "InActive"].includes(selectedCustomer?.customerCurrentStatus) ? "#FFF8EB" : "#FFF9F9"
              }]}>
                {/* <Text style={styles.unassignText}>Un Assigned</Text> */}
                {/* <Text style={[styles.unassignText, {
                  color: selectedCustomer?.customerCurrentStatus === "BOOKED" ? "#1E45E1" :
                    selectedCustomer?.customerCurrentStatus === "CHECK_IN" ? "#00A32E" :
                      selectedCustomer?.customerCurrentStatus === "NOTICE" ? "#FF0000" :
                        selectedCustomer?.customerCurrentStatus === "SETTLEMENT_GENERATED" ? "#1E45E1" :
                          ["INACTIVE", "IN_ACTIVE", "InActive"].includes(selectedCustomer?.customerCurrentStatus) ? "#FF9500" : "#FF0000"
                }]}>
                  {selectedCustomer?.customerCurrentStatus === "BOOKED" ? "Reserved"
                    : selectedCustomer?.customerCurrentStatus === "CHECK_IN" ? "Occupied"
                      : selectedCustomer?.customerCurrentStatus === "NOTICE" ? "Notice Period"
                        : selectedCustomer?.customerCurrentStatus === "SETTLEMENT_GENERATED" ? "Settlement Generated"
                          : ["INACTIVE", "IN_ACTIVE", "InActive"].includes(selectedCustomer?.customerCurrentStatus) ? "InActive" : "Write_Off"}
                </Text> */}

                <Text
                  style={[
                    styles.unassignText,
                    {
                      color:
                        selectedCustomer?.customerCurrentStatus === "BOOKED"
                          ? "#1E45E1"
                          : selectedCustomer?.customerCurrentStatus === "CHECK_IN"
                            ? "#00A32E"
                            : selectedCustomer?.customerCurrentStatus === "NOTICE"
                              ? "#FF0000"
                              : selectedCustomer?.customerCurrentStatus === "SETTLEMENT_GENERATED"
                                ? "#1E45E1"
                                : selectedCustomer?.customerCurrentStatus === "DRAFT"
                                  ? "#FF9500"
                                  : ["INACTIVE", "IN_ACTIVE", "InActive"].includes(
                                    selectedCustomer?.customerCurrentStatus
                                  )
                                    ? "#FF9500"
                                    : "#FF0000",
                    },
                  ]}
                >
                  {selectedCustomer?.customerCurrentStatus === "BOOKED"
                    ? "Reserved"
                    : selectedCustomer?.customerCurrentStatus === "CHECK_IN"
                      ? "Occupied"
                      : selectedCustomer?.customerCurrentStatus === "NOTICE"
                        ? "Notice Period"
                        : selectedCustomer?.customerCurrentStatus === "SETTLEMENT_GENERATED"
                          ? "Settlement Generated"
                          : selectedCustomer?.customerCurrentStatus === "DRAFT"
                            ? "Draft"
                            : ["INACTIVE", "IN_ACTIVE", "InActive"].includes(
                              selectedCustomer?.customerCurrentStatus
                            )
                              ? "Inactive"
                              : "Write Off"}
                </Text>


              </TouchableOpacity>
            </Animated.View>

          </View>
        )}

        {showDetailModal && showDetailsMenu && (
          <>
            <TouchableOpacity
              style={styles.menuBackdrop}
              onPress={() => setShowDetailsMenu(false)}
            />

            <View
              style={[
                styles.popupBox,
                {
                  top: popupPosition.y + popupPosition.h + 8,
                  left:
                    popupPosition.x + 200 > screenWidth
                      ? popupPosition.x - 200 + popupPosition.w
                      : popupPosition.x,
                },
              ]}
            >
              {["Checked In", "Check In", "Checkedin", "CHECK_IN"].includes(
                selectedCustomer?.customerCurrentStatus
              ) &&
                <>
                  <TouchableOpacity
                    // style={styles.popupRow}
                    style={[
                      styles.popupRow,
                      !canUpdateTenant && { opacity: 0.4 }]}
                    disabled={!canUpdateTenant}
                    onPress={() => {
                      setReassignCustomer(selectedCustomer)
                      setShowDetailsMenu(false);
                      setShowReAssignBed(true);
                    }}
                  >
                    <Image source={require("../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
                    <Text style={styles.popupText}>Re-Assign Bed</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    // style={styles.popupRow}
                    style={[
                      styles.popupRow,
                      !canUpdateTenant && { opacity: 0.4 }]}
                    disabled={!canUpdateTenant}
                    onPress={() => {
                      setShowDetailsMenu(false);
                      setShowNotice(true);
                    }}
                  >
                    <Image source={require("../../Assets/Images/Logout.png")} style={styles.popupIcon} />
                    <Text style={styles.popupText}>Move to Notice Period</Text>
                  </TouchableOpacity>
                </>
              }
              {
                selectedCustomer?.customerCurrentStatus === "SETTLEMENT_GENERATED" &&
                <TouchableOpacity
                  // style={styles.popupRow}
                  style={[
                    styles.popupRow,
                    !canUpdateTenant && { opacity: 0.4 }]}
                  disabled={!canUpdateTenant}
                  onPress={() => {
                    setShowMenu(false);
                    setShowCheckout(true);
                    setMenuVisible(false)
                    setShowDetailModal(false)
                  }}
                >
                  <Image source={require("../../Assets/Images/checkout_red.png")} style={styles.popupIcon} />
                  <Text style={styles.popupText}>Checkout</Text>
                </TouchableOpacity>
              }

              {selectedCustomer?.customerCurrentStatus === "DRAFT" &&
                <>
                  <TouchableOpacity
                    // style={styles.popupRow}
                    style={[
                      styles.popupRow,
                      !canUpdateTenant && { opacity: 0.4 }]}
                    disabled={!canUpdateTenant}
                    onPress={() => {

                      navigation.navigate("AddTenantNew", {
                        customerId: selectedCustomer?.customerId,
                        customer: selectedCustomer,
                        mode: "EDIT",
                      })
                      setShowDetailsMenu(false);
                      setShowDetailModal(false);
                      setMenuVisible(false)
                    }}
                  >
                    <Image source={require("../../Assets/Images/blue_circle.png")} style={styles.popupIcon} />
                    <Text style={styles.popupText}>Draft Continue</Text>
                  </TouchableOpacity>


                </>

              }

              {selectedCustomer?.customerCurrentStatus === "BOOKED" &&
                <>
                  <TouchableOpacity
                    // style={styles.popupRow}
                    style={[
                      styles.popupRow,
                      !canUpdateTenant && { opacity: 0.4 }]}
                    disabled={!canUpdateTenant}
                    onPress={handleShowTennantCheckin}
                  >
                    <Image source={require("../../Assets/Images/blue_circle.png")} style={styles.popupIcon} />
                    <Text style={styles.popupText}>Check-in</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    // style={styles.popupRow}
                    style={[
                      styles.popupRow,
                      !canUpdateTenant && { opacity: 0.4 }]}
                    disabled={!canUpdateTenant}
                    onPress={handleMakeUsInActive}
                  >
                    <Image source={require("../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
                    <Text style={styles.popupText}>Make as Inactive</Text>
                  </TouchableOpacity>
                </>

              }
              {
                selectedCustomer?.customerCurrentStatus === "NOTICE" &&
                <>
                  {/* <TouchableOpacity
                    style={[
                      styles.popupRow,
                      !canUpdateTenant && { opacity: 0.4 }]}
                    disabled={!canUpdateTenant}
                    onPress={handleShowFinalSettlement}
                  >
                    <Image source={require("../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
                    <Text style={styles.popupText}>Generate</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    // style={styles.popupRow}
                    style={[
                      styles.popupRow,
                      !canUpdateTenant && { opacity: 0.4 }]}
                    disabled={!canUpdateTenant}
                    onPress={handleShowFinalNew}
                  >
                    <Image source={require("../../Assets/Images/fsi.png")} style={styles.popupIcon} />
                    <Text style={styles.popupText}>Generate </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    // style={styles.popupRow}
                    style={[
                      styles.popupRow,
                      !canUpdateTenant && { opacity: 0.4 }]}
                    disabled={!canUpdateTenant}
                    onPress={handleShowCancelNotice}
                  >
                    <Image source={require("../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
                    <Text style={styles.popupText}>Cancel Check-out</Text>
                  </TouchableOpacity>
                </>
              }




            </View>
          </>
        )}



        {menuVisible && (
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.menuOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.menuBox,
                    {
                      top: menuPosition.y,
                      left: menuPosition.x,
                    },
                  ]}
                >

                  {
                    selectedItem && selectedItem?.customerCurrentStatus === "CHECK_IN" &&
                    <>
                      <TouchableOpacity
                        // style={styles.popupRow}
                        style={[
                          styles.popupRow,
                          !canUpdateTenant && { opacity: 0.4 }]}
                        disabled={!canUpdateTenant}
                        onPress={() => {
                          console.log("allwin", selectedItem);

                          setReassignCustomer(selectedItem);
                          handleShowReAssignBed();
                        }}
                      >

                        <Image
                          source={require("../../Assets/Images/ReAssign.png")}
                          style={styles.popupIcon}
                        />
                        <Text style={styles.popupText}>Change Bed</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        // style={styles.popupRow}
                        style={[
                          styles.popupRow,
                          !canUpdateTenant && { opacity: 0.4 }]}
                        disabled={!canUpdateTenant}

                        onPress={() => {
                          // setSelectedCustomer(selectedItem);
                          setShowMenu(false);
                          setMenuVisible(false)
                          setShowNotice(true);
                        }}

                      >
                        <Image
                          source={require("../../Assets/Images/Logout.png")}
                          style={styles.popupIcon}
                        />
                        <Text style={styles.popupText}>Move to Notice Period</Text>
                      </TouchableOpacity>
                    </>

                  }
                  {
                    selectedItem && selectedItem?.customerCurrentStatus === "BOOKED" &&
                    <>
                      <TouchableOpacity
                        // style={styles.popupRow}
                        style={[
                          styles.popupRow,
                          !canUpdateTenant && { opacity: 0.4 }]}
                        disabled={!canUpdateTenant}
                        onPress={handleMakeUsInActive}
                      >
                        <Image source={require("../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
                        <Text style={styles.popupText}>Make Us InActive</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        // style={styles.popupRow}
                        style={[
                          styles.popupRow,
                          !canUpdateTenant && { opacity: 0.4 }]}
                        disabled={!canUpdateTenant}
                        onPress={handleShowTennantCheckin}
                      // onPress={() => {
                      //   setShowDetailsMenu(false);
                      //   // setShowNotice(true);
                      // }}
                      >
                        <Image source={require("../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
                        <Text style={styles.popupText}>Checkin</Text>
                      </TouchableOpacity>
                    </>
                  }
                  {selectedItem &&
                    !["CHECK_IN", "SETTLEMENT_GENERATED", "BOOKED"].includes(selectedItem?.customerCurrentStatus) && (

                      <>
                        {/* <TouchableOpacity
                          style={[
                            styles.popupRow,
                            !canUpdateTenant && { opacity: 0.4 }]}
                          disabled={!canUpdateTenant}
                          onPress={handleShowFinalSettlement} >
                          <Image
                            source={require("../../Assets/Images/ReAssign.png")}
                            style={styles.popupIcon}
                          />
                          <Text style={styles.popupText}>Generate</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                          // style={styles.popupRow}
                          style={[
                            styles.popupRow,
                            !canUpdateTenant && { opacity: 0.4 }]}
                          disabled={!canUpdateTenant}
                          onPress={handleShowFinalNew}
                        >
                          <Image source={require("../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
                          <Text style={styles.popupText}>Generate </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          // style={styles.popupRow} 
                          style={[
                            styles.popupRow,
                            !canUpdateTenant && { opacity: 0.4 }]}
                          disabled={!canUpdateTenant}
                          onPress={handleShowCancelNotice} >
                          <Image
                            source={require("../../Assets/Images/ReAssign.png")}
                            style={styles.popupIcon}
                          />
                          <Text style={styles.popupText}>Cancel Check-out</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  {selectedItem &&
                    !["CHECK_IN", "SETTLEMENT_GENERATED", "BOOKED"].includes(selectedItem?.customerCurrentStatus) && (
                      <TouchableOpacity
                        // style={styles.popupRow}
                        style={[
                          styles.popupRow,
                          !canUpdateTenant && { opacity: 0.4 }]}
                        disabled={!canUpdateTenant}
                        onPress={() => {
                          setShowMenu(false);
                          setShowCheckout(true);
                          setMenuVisible(false)
                        }}
                      >
                        <Image source={require("../../Assets/Images/Checkout_icon.png")} style={styles.popupIcon} />
                        <Text style={styles.popupText}>Checkout</Text>
                      </TouchableOpacity>

                    )}




                  {/* <TouchableOpacity
  style={styles.popupRow}
  onPress={() => {
    setShowMenu(false);
    setDeleteTenants(true);
  }}
>
  <Image
    source={require("../../Assets/Images/trash.png")}
    style={styles.popupIcon}
  />
  <Text style={styles.popupText}>Delete</Text>
</TouchableOpacity> */}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}


        {/* {showMenu && (
  <TouchableOpacity
    activeOpacity={1}
    onPress={() => setShowMenu(false)}
    style={styles.popupOverlay}
  >
    <View
      style={[
        styles.popupBox,
        { top: popupPosition.y + 10, left: popupPosition.x - 180 },
      ]}
    >

     <TouchableOpacity style={styles.popupRow} onPress={handleShowAddBooking} >
        <Image
          source={require("../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Add Booking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.popupRow} onPress={handleShowTennantCheckin} >
        <Image
          source={require("../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Tenant Check-in</Text>
      </TouchableOpacity>
    
      <TouchableOpacity style={styles.popupRow} onPress={handleShowReAssignBed} >
        <Image
          source={require("../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Re-Assign Bed</Text>
      </TouchableOpacity>

        <TouchableOpacity style={styles.popupRow} onPress={handleShowFinalSettlement} >
        <Image
          source={require("../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Final Settlemnent</Text>
      </TouchableOpacity>

      
    <TouchableOpacity
  style={styles.popupRow}
  onPress={() => {
    setShowMenu(false);
    setShowNotice(true); 
  }}
>
  <Image
    source={require("../../Assets/Images/ReAssign.png")}
    style={styles.popupIcon}
  />
  <Text style={styles.popupText}>Move to Notice Period</Text>
</TouchableOpacity>


  <TouchableOpacity
  style={styles.popupRow}
  onPress={() => {
    setShowMenu(false);
    setShowCheckout(true);
  }}
>
  <Image source={require("../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
  <Text style={styles.popupText}>Checkout</Text>
</TouchableOpacity>




  <TouchableOpacity style={styles.popupRow} onPress={handleShowCancelNotice} >
        <Image
          source={require("../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Cancel Notice Period</Text>
      </TouchableOpacity>

 <TouchableOpacity
  style={styles.popupRow}
  onPress={() => {
    setShowMenu(false);
    setDeleteTenants(true);
  }}
>
  <Image
    source={require("../../Assets/Images/trash.png")}
    style={styles.popupIcon}
  />
  <Text style={styles.popupText}>Delete</Text>
</TouchableOpacity>
    </View>
  </TouchableOpacity>
)} */}


        {showFilter && (
          <View style={styles.filterOverlay}>

            {/* Close on outside touch */}
            <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

            {/* SWIPEABLE SHEET */}
            <Animated.View
              style={[styles.filterSheet, { transform: [{ translateY: filterTranslateY }] }]}
              {...filterPanResponder.panHandlers}
            >
              {/* Handle Bar */}
              <View style={styles.filterHandle} />

              {/* Header */}
              <View style={styles.filterHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={Filter}
                    style={{ width: 35, height: 35, marginRight: 8 }}
                  />
                  <Text style={styles.filterTitle}>Filter by</Text>
                </View>
              </View>



              {renderDropdown(
                "View",
                viewType,
                setViewType,
                ["List View", "Room View"],
                "view"
              )}

              {renderDropdown(
                "Tenant Status",
                tenantStatus,
                setTenantStatus,
                ["All", "Checkin", "Booking", "Checked Out", "Notice"],
                "status"
              )}

              {renderDropdown(
                "Period",
                period,
                setPeriod,
                ["Today", "This Week", "This Month", "Last Month"],
                "period"
              )}

              {renderDropdown(
                "Sharing Type",
                sharingType,
                setSharingType,
                ["Single", "Double", "Triple"],
                "sharing"
              )}






              {/* Buttons */}
              <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.resetBtn}>
                  <Text style={styles.resetText}>Reset All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyBtn}>
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              </View>

            </Animated.View>
          </View>
        )}


        <Modal
          transparent
          visible={openFrom}
          animationType="fade"
          onRequestClose={() => setOpenFrom(false)}
        >
          <View style={styles.datePickerOverlay}>
            <TouchableOpacity
              style={styles.outsideTouch}
              activeOpacity={1}
              onPress={() => setOpenFrom(false)}
            />
            <View style={styles.datePickerBox}>
              <TouchableWithoutFeedback>
                <View>
                  <DatePicker
                    mode="single"
                    date={fromDate}
                    onChange={(d) => {
                      setFromDate(d.date);
                      setOpenFrom(false);
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>

          </View>
        </Modal>


        <Modal
          transparent
          visible={openTo}
          animationType="fade"
          onRequestClose={() => setOpenTo(false)}
        >
          <View style={styles.datePickerOverlay}>

            <TouchableOpacity
              style={styles.outsideTouch}
              activeOpacity={1}
              onPress={() => setOpenTo(false)}
            />

            <View style={styles.datePickerBox}>
              <TouchableWithoutFeedback>
                <View>
                  <DatePicker
                    mode="single"
                    date={toDate}
                    onChange={(d) => {
                      setToDate(d.date);
                      setOpenTo(false);
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>

          </View>
        </Modal>


        {deleteTenants && (
          <Modal
            transparent
            animationType="fade"
            visible={deleteTenants}
            onRequestClose={() => setDeleteTenants(false)}
          >
            <View style={styles.deleteOverlay}>
              <View style={styles.deleteBox}>

                <Text style={styles.deleteTitle}>Delete Customer?</Text>
                <Text style={styles.deleteSub}>
                  Are you sure you want to delete this Customer?
                </Text>

                <View style={styles.deleteBtnRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setDeleteTenants(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => {

                      setDeleteTenants(false);
                    }}
                  >
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>
        )}



        {showNotice && (
          <MoveNoticeSheet
            visible={showNotice}
            onClose={() => {
              setShowDetailModal(false);
              setShowNotice(false)
            }}
            customer={selectedItem}
            onSuccess={handleCheckoutSuccess}






          />
        )}




      </SafeAreaView>
      {
        showReAssignbed &&
        <ReassignBedSheet visible={showReAssignbed} onClose={handlecloseReAssignbed} customer={reassignCustomer} onSuccess={closeDetailSheet} />

      }
      <InactiveTenantSheet
        visible={showInactiveSheet}
        onClose={() => setShowInactiveSheet(false)}
        selectedItem={selectedItem}
        onSuccess={handleCheckoutSuccess}
      />
      {
        showCheckout &&
        <CheckoutBottomSheet
          visible={showCheckout}
          onClose={() => setShowCheckout(false)}
          customer={selectedCustomer}
          reason={reason}
          setReason={setReason}
          checkoutDate="22/10/2024"
          noticeDays={30}
          onCheckout={() => {
            setShowCheckout(false);
          }}
          setShowTabBar={setShowTabBar}
          selectedItem={selectedItem}
          onSuccess={handleCheckoutSuccess}

        />
      }
      {/* {overviewScreen && (
  <CustomerOverviewScreen
    visible={overviewScreen}
    customer={selectedCustomer}
    onClose={() => setOverviewScreen(false)}
  />
)} */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: 16,
    // paddingVertical: 50,
    paddingTop: 50,
    // paddingBottom: 30

  },
  // searchContainer: {
  // flexDirection: "row",
  //   alignItems: "center",
  //   borderWidth: 1,
  //   borderColor: "#D9D9D9",
  //   borderRadius: 30,
  //   paddingHorizontal: 14,
  //   paddingVertical: 2,
  //   marginBottom: 10,

  // },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 30,
    paddingHorizontal: 14,
    height: 44,
  },

  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  // searchInput: {
  //   flex: 1,
  //   fontSize: 15,
  //   color: "#111827",
  // },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",

    paddingVertical: 0,

    ...(Platform.OS === "ios" && {
      height: 40,
    }),
  },
  outsideTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 6,
  },


  // dropdownMenu: {
  //   backgroundColor: "#fff",
  //   borderRadius: 10,
  //   marginTop: 5,
  //   borderWidth: 1,
  //   borderColor: "#E5E7EB",
  //   overflow: "hidden",
  //   elevation: 5,
  // },
  dropdownMenu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 7,
    zIndex: 9999,
    maxHeight: 130,
    overflow: "hidden",
  },
  menuBackdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 9999
  },

  datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  datePickerBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    elevation: 10,
    zIndex: 999,
  },



  calIcon: { width: 20, height: 20 },






  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  dropdownItemText: {
    fontSize: 14,
    color: "#111",
    flex: 1,
  },


  tab: {
    alignItems: "center",
    paddingBottom: 6,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2D6CDF",
  },

  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  tabIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },

  tabText: {
    fontSize: 16,
    color: "#6B7280",
  },

  activeText: {
    color: "#2D6CDF",
    fontSize: 18,
    fontFamily: "Gilroy-Semibold",
  },

  sectionTitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginVertical: 10,
  },
  tenantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  profileImg: {
    width: 55,
    height: 55,
    borderRadius: 25,
    marginRight: 5,
  },
  name: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
    color: "#111827",
    marginRight: 8
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  floorBadge: {
    backgroundColor: "#FFEFCF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  floorText: {
    fontSize: 11,
    color: "#222222",
    fontFamily: "Gilroy-Medium"
  },
  iconSmall: {
    width: 18,
    height: 18,
    marginHorizontal: 3,
  },
  detailText: {
    fontSize: 12,
    color: "#4B5563",
    fontFamily: "Gilroy-Medium"
  },
  rightSection: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 3,
  },
  dots: {
    fontSize: 22,
    color: "#6B7280",
  },
  addButton: {
    position: "absolute",
    right: 10,
    bottom: 50,
  },

  editButton: {
    position: "absolute",
    bottom: 130,
    right: 13,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // height: SHEET_HEIGHT,
    // paddingBottom:20
  },

  modalHandle: {
    width: 60,
    height: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 100,
    marginBottom: 15,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#111",
  },

  modalProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  modalProfileImg: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },

  modalName: {
    fontSize: 17,
    fontFamily: "Gilroy-Semibold",
    color: "#111",
  },

  infoLabel: {
    marginTop: 15,
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Gilroy-Semibold"
  },

  infoValue: {
    fontSize: 14,
    color: "#111",
    marginTop: 3,
    fontFamily: "Gilroy-Bold"
  },

  unassignBtn: {
    // borderWidth: 1,
    // borderColor: "#111",
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 12,
    alignItems: "center",
  },

  unassignText: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
  },
  popupOverlay: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },

  // popupBox: {
  //   position: "absolute",
  //   width: 200,
  //   backgroundColor: "#fff",
  //   borderRadius: 12,
  //   elevation: 20,
  //   paddingVertical: 10,
  //   zIndex: 10000,
  // },
  popupBox: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 8,
    width: 200,
    zIndex: 10000,

    elevation: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
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
    fontFamily: "Gilroy-Regular"
  },


  filterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  filterSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  filterHandle: {
    width: 60,
    height: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 50,
    marginBottom: 20,
  },

  filterHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
  },

  filterTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
    marginTop: 10,
  },

  // dropdownBox: {
  //   borderWidth: 1,
  //   borderColor: "#E5E7EB",
  //   padding: 12,
  //   borderRadius: 10,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },

  dropdownBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },


  dropdownText: {
    color: "#111",
    fontSize: 15,
  },

  arrow: { fontSize: 18, color: "#555" },

  dateRow: { flexDirection: "row", marginTop: 10 },


  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: "#fff",
  },



  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  quickBtn: {
    backgroundColor: "#F8F9FA",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  quickText: { color: "#111", fontFamily: "Gilroy-Medium" },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30
  },

  resetBtn: {
    backgroundColor: "#F2F3FF",
    paddingVertical: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },

  resetText: {
    color: "#2D6CDF",
    fontFamily: "Gilroy-Semibold",
  },

  applyBtn: {
    backgroundColor: "#2D6CDF",
    paddingVertical: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },

  applyText: {
    color: "#fff",
    fontFamily: "Gilroy-Semibold",
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
    fontFamily: "Gilroy-Bold",
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
    fontFamily: "Gilroy-Semibold",
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
    fontFamily: "Gilroy-Semibold",
    color: "#fff",
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },


  menuBox: {
    position: "absolute",
    width: 190,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 6,
    elevation: 15,
  },


  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  menuIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  menuText: {
    fontSize: 14,
    color: "#111",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60

  },

  emptyImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    opacity: 0.8
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
  initialCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 3
  },

  initialText: {
    fontSize: 13,
    fontFamily: "Gilroy-Bold",
    color: "#374151",
  },
  modalInitialCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  modalInitialText: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#374151",
  },
  statusDot: {
    position: "absolute",
    // bottom: 2,
    top: 3,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 8,
  },

  filterChip: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginLeft: 4
  },

  filterChipActive: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: "#E6F0FF",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },

  filterChipText: {
    fontSize: 13,
    color: "#374151",
  },

  filterChipTextActive: {
    fontSize: 13,
    color: "#2D6CDF",
    fontFamily: "Gilroy-Semibold",
  },

  filterIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    // backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  chipContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  chipArrow: {
    width: 14,
    height: 14,
    marginLeft: 6,
  },
  divider: {
    height: 0.4,
    backgroundColor: "#E5E7EB",
    marginBottom: 4,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 55,

    // marginVertical: 8,
  },
  activeItem: {
    backgroundColor: "#EEF2FF", // light blue
    borderLeftWidth: 3,
    borderLeftColor: "#1E45E1",
  },
  viewIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  addBtn: {
    position: "absolute",
    bottom: 0,
    right: 20,
    backgroundColor: "#00A32E",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },


  plus: { fontSize: 30, color: "#fff", marginTop: -3 },
  addBtnAdd: {
    backgroundColor: "#1E45E1",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,    // 🔥 reduced
  },

  addBtnText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "Gilroy-Semibold"
  },
});