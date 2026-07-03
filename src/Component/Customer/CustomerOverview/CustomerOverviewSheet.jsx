import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity, TouchableWithoutFeedback,
  Image, BackHandler,
  NativeModules, Animated, Linking
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useCustomer } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { BillContext } from "../../../Context/BillsContext";
import { PGContext } from "../../../Context/PGContext";
import EditBasicDetailsSheet from "./EditBasicDetails";
import EditManualAddressSheet from "./EditAdressDetails";
import EditJoiningDateSheet from "./EditJoiningDateSheet";
import EditRentalAmountSheet from "./EditMonthlyRentSheet";
import EditAdvanceAmountSheet from "./EditAdvanceSheet"
import OverviewTab from "./OverviewTab";
import EBReadingTab from "./EBReadingTab";
import BillTab from "./BillTab";
import ComplaintsTab from "./ComplaintsTab";
import AssignAmenitiesSheet from "./AssignAmenitiesSheet"
import ProfileImg from "../../../Assets/Images/profile.png";
import Dots from "../../../Assets/Images/3dots.png";
import RoomIcon from "../../../Assets/Images/profile.png";
// import BedIcon from "../../../Assets/Images/profile.png";
import StayHistorySheet from "./StayHistory"
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Alert } from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import SuccessModal from "../../../ToastFile/ToastPage";
import VerifiedIcon from "../../../Assets/Images/verify.png"
import BedIcon from "../../../Assets/Images/bed.png"
import Room_Icon from "../../../Assets/Images/Room_Icon.png"
import MoreDot from "../../../Assets/Images/moreDot.png"
import EmptyState from "../../../Assets/Images/Empty_state.png";
import CheckinIcon from "../../../Assets/Images/Checkin_Icon.png";
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import CustomerTransaction from "./CustomerTransaction"
import ReAssignIcon from "../../../Assets/Images/ReAssign.png";
import WhatsappGreenIcon from "../../../Assets/Images/whatsapp.png";
import Call from "../../../Assets/Images/call.png";
import StayIcon from "../../../Assets/Images/swap.png"
import ReassignBedSheet from "../ReAssignBed";
import MoveNoticeSheet from "../MoveToNoticePeriod";
import InactiveTenantSheet from "../../PG/ReservedBed/MakeUsInActiveSheet";
import CheckoutBottomSheet from "../Checkout/CheckoutTenant";
import RecheckInIcon from "../../../Assets/Images/recheckinIcon.png"
import MakeCheckInIcon from "../../../Assets/Images/blue_circle.png";
import MoveToNoticeIcon from "../../../Assets/Images/Logout.png";
import CheckoutIcon from "../../../Assets/Images/checkout_red.png"
import Generate from "../../../Assets/Images/fsi.png"
import AdditionalContactBottomSheet from "./AdditionalContactBottomSheet"
import BillDetailsSheet from "../../MorePages/Bills/BillDetails"
import ImagePickerSheet from "./ImagePickerSheet"
import AddIcon from "../../../Assets/Images/add-circle.png";
import FloorIcon from "../../../Assets/Images/Room_bed.png"
import Bed_NewIcon from "../../../Assets/Images/bed_NewIcon.png"
import Room_NewIcon from "../../../Assets/Images/room_NewIcon.png"
import Loader from "../../Loader/Loader"
import TransactionDetailSheet from "../../../Component/Customer/CustomerOverview/TransactionDetailSheet"
import KYCPendingSheet from "./KYCPendingSheet"




export default function CustomerOverviewScreen({ route, navigation }) {
  const { customer, customerId } = route.params || {};
  const { activeHostelId } = useContext(CommonContexts)
  const { getParticularHostelDetails, PGDetails } = useContext(PGContext);
    const { BillDetails, GetAllBillDetails,
      RecordPayment, GetInitializeRefundDetails, CreateRefund, refundError
      , GetRecurringBills, recurringBills, BillPdfdetails, getBillsPdfDetails, getReceiptPdfDetails, downloadReceipt, DeleteReceipt,
      downloadBill, shareBillOnWhatsapp, shareReceiptOnWhatsapp, GetReceiptsList, receiptsList, MarkBillAsUnpaid, GetAdvanceCreditDetails, GetInitializeAdvanceRedeem } = useContext(BillContext);
  const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel, changeBedCustomer, getCustomerDetails, editBasicDetails, loading } = useCustomer();
  console.log("customer", customer)
  const [activeTab, setActiveTab] = useState("Overview");
  const [customerDetails, setCustomerDetails] = useState("")
  const [showEdit, setShowEdit] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showEditJoiningDate, setShowEditJoiningDate] = useState(false)
  const [showEditRent, setShowEditRent] = useState(false);
  const [showEditAdvance, setShowEditAdvance] = useState(false)
  const [showAssignAmenities, setShowAssignAmenities] = useState(false)
  const [showStayHistory, setShowStayHistory] = useState(false)
  const [profileImage, setProfileImage] = useState(null);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showReAssignbed, setShowReAssignBed] = useState(false)
  const [reassignCustomer, setReassignCustomer] = useState(null);

  const [selectedBill, setSelectedBill] = useState(null);

  const [showNotice, setShowNotice] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [reason, setReason] = useState("");
  const [environment, setEnvironment] = useState("")

  const { CommonModule } = NativeModules;

  const [showInactiveSheet, setShowInactiveSheet] = useState(false)
  const [showContactSheet, setShowContactSheet] = useState(false);
  const [BillDetailshow, setBillDetailsShow] = useState(false)
  const[transactionDetailShow,setTransactionDetailsShow]=useState(false);
  const[transactionDetail,setTransactionDetail]=useState("")
  const [showPendingAction,setShowPendingAction]=useState(false)

    const [showkycPendingSheet, setShowKYCPendingSheet] = useState(false);


  const scrollY = useRef(new Animated.Value(0)).current;
  const [showHeader, setShowHeader] = useState(false);

  const translateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -150],
    extrapolate: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [-60, 0], // header slide down
    extrapolate: "clamp",
  });

  useEffect(() => {
    CommonModule.fetchEnvironment().then(r => {
      setEnvironment(r)
    })
  }, [])



  useEffect(() => {
    if (activeHostelId) {
      getParticularHostelDetails(activeHostelId);
    }
  }, [activeHostelId])



  const {
    canWriteModule: canWriteTenant,
    canReadModule: canReadTenant,
    canUpdateModule: canUpdateTenant,
    canDeleteModule: canDeleteTenant,
  } = useHasPermission("Customers");

  console.log("custosus",customerId)


  const isValidSubscription = PGDetails?.isSubscriptionActive;
  const isSubscriptionAllow = isValidSubscription && canUpdateTenant;
  const isSubscriptionReadAllow = isValidSubscription && canReadTenant;

  console.log("customerDetails", customerDetails)
  useEffect(() => {
    if (customer?.customerId || customerId) {
      fetchCustomerDetails();
    }
  }, [customer, customerId]);
  const handleEditBasicDetails = () => {
    setShowEdit(true)
  }
  const handleEditAdressDetails = () => {
    setShowEditSheet(true)
  }
  const handleEditJoining = () => {
    setShowEditJoiningDate(true)
  }
  const handleEditMonthlyRent = () => {
    setShowEditRent(true);
  };
  const handleEditAdvance = () => {
    setShowEditAdvance(true);
  };
  const handleShowAmenities = () => {
    setShowAssignAmenities(true);
  };
  const closeEditMonthlyRent = () => {
    setShowEditRent(false);
  };

  const handleshowKYCPendingSheet = () => {
    setShowKYCPendingSheet(true)
  }

  const fetchCustomerDetails = async () => {
    const res = await getCustomerDetails(customer.customerId || customerId);
    console.log("fetchCustomerDetails", res)
    if (res.success) {
      setCustomerDetails(res.data)
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (customer?.customerId || customerId) {
        fetchCustomerDetails();
      }
    }, [customer?.customerId, customerId])
  );


  const [showProfileSheet, setShowProfileSheet] = useState(false);

  const handleProfilePress = () => {
    setShowProfileSheet(true);
  };

  // const handleProfilePress = () => {
  //   Alert.alert(
  //     "Change Profile Picture",
  //     "Choose an option",
  //     [
  //       {
  //         text: "Camera",
  //         onPress: () => openCamera(),
  //       },
  //       {
  //         text: "Gallery",
  //         onPress: () => openGallery(),
  //       },
  //       {
  //         text: "Cancel",
  //         style: "cancel",
  //       },
  //     ]
  //   );
  // };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: "photo",
        quality: 0.7,
      },
      async (response) => {
        if (response.didCancel) return;
        if (response.assets && response.assets.length > 0) {
          const image = response.assets[0];

          //            let fileUri = image.uri;

          // // 🔥 Fix for Redmi (content URI issue)
          // if (fileUri.startsWith("content://")) {
          //   fileUri = image.uri; // keep as is (React Native supports it)
          // } else if (!fileUri.startsWith("file://")) {
          //   fileUri = `file://${fileUri}`;
          // }

          // const file = {
          //   uri: fileUri,
          //   type: image.type || "image/jpeg",
          //   name: image.fileName || `photo_${Date.now()}.jpg`,
          // };
          setProfileImage(image);

          const res = await editBasicDetails(
            customerDetails.customerId,
            {
              firstName: customerDetails?.firstName || "",
              lastName: customerDetails?.lastName || "",
              mailId: customerDetails?.emailId || "",
              phoneNumber: customerDetails?.phoneNumber || "",
            },
            image
          );

          if (res.success) {
            setModalType("success");
            setMessage(res.data);
            setShowSuccess(true);


            setTimeout(() => {
              setShowSuccess(false);

            }, 900);
            fetchCustomerDetails();
          } else {
            setModalType("error");
            setMessage(res?.message);
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
            }, 1500);
            // alert(res.message);
          }

        }
      }
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.7 },
      async (response) => {
        if (response.didCancel) return;

        if (response.assets?.length > 0) {
          const image = response.assets[0];
          setProfileImage(image); // UI update

          const res = await editBasicDetails(
            customerDetails.customerId,
            {
              firstName: customerDetails?.firstName || "",
              lastName: customerDetails?.lastName || "",
              mailId: customerDetails?.emailId || "",
              phoneNumber: customerDetails?.phoneNumber || "",
            },
            image
          );

          if (res.success) {
            setModalType("success");
            setMessage(res.data);
            setShowSuccess(true);


            setTimeout(() => {
              setShowSuccess(false);

            }, 800);
            fetchCustomerDetails();
          } else {
            setModalType("error");
            setMessage(res?.message);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 1500);
            // alert(res.message);
          }
        }
      }
    );
  };



  const handleCallPhone = (mobile) => {
    console.log("mobile", mobile)
    if (mobile?.mobileNo) {
      CommonModule.makeCall(mobile?.mobileNo)
    }
  }



  const handleOpenWhatsapp = (item) => {
    console.log("mobile", item);
    if (!item) return;

    let mobile = item?.mobileNo || item?.mobile;
    let countryCode = item?.countryCode || "91";

    if (!mobile) {
      setModalType("warning");
      setMessage("Mobile number not available");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
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
      setMessage("WhatsApp not installed");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    });
  };

  // const openGallery = () => {
  //   launchImageLibrary(
  //     {
  //       mediaType: "photo",
  //       quality: 0.7,
  //     },
  //     (response) => {
  //       if (response.didCancel) return;
  //       if (response.assets && response.assets.length > 0) {
  //         setProfileImage(response.assets[0]);
  //       }
  //     }
  //   );
  // };

  //  const openGallery = () => {
  //   launchImageLibrary(
  //     { mediaType: "photo", quality: 0.7 },
  //     async (response) => {
  //       if (response.didCancel) return;

  //       if (response.assets?.length > 0) {
  //         const image = response.assets[0];

  //         setProfileImage(image); // UI update

  //         // 🔥 CALL API IMMEDIATELY
  //         const res = await editBasicDetails(
  //           customerDetails.customerId,
  //           {},              // no other payload change
  //           image            // send image
  //         );

  //         if (res.success) {
  //           fetchCustomerDetails(); // refresh profile
  //         } else {
  //           alert(res.message);
  //         }
  //       }
  //     }
  //   );
  // };
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

      const res = getBillsPdfDetails(item?.hostelId, item?.invoiceId);

    setMenuVisible(true);
  };

  const handleShowReAssignBed = () => {
    setShowReAssignBed(true)
    setMenuVisible(false)
  };
  const handlecloseReAssignbed = () => {
    setShowReAssignBed(false)
  }
  const fetchCustomers = async () => {
    const data = await getCustomersByHostel(activeHostelId);
    // setCustomers(data || []);
  };

  const handleCheckoutSuccess = async () => {
    await fetchCustomerDetails()
    await fetchCustomers();
    setShowCheckout(false);
  }

  //   const handleRedirectTenant = () => {
  //   navigation.getParent()?.navigate("Tenant");
  // };

  const handleMakeUsInActive = () => {
    // setShowDetailsMenu(false);
    setShowInactiveSheet(true)
    setMenuVisible(false)
    // setShowDetailModal(false)

  }

  // const handleShowTennantCheckin = () => {
  //   navigation.navigate("BookingCheckIn", {
  //     customerId: selectedItem.customerId,
  //     customer: selectedItem,
  //   });

  //       onSuccess: async () => {
  //     closeDetailSheet(); 

  //     await fetchCustomers(); 

  //     setShowDetailsMenu(false);
  //     setMenuVisible(false);
  //   },

  //   setMenuVisible(false)
  // }

  const handleShowTennantCheckin = () => {

    navigation.navigate("BookingCheckIn", {
      customerId: selectedItem.customerId,
      customer: selectedItem,



      onSuccess: async () => {
        await fetchCustomers()
        setShowDetailsMenu(false);
        setMenuVisible(false);
      },
    })

    setMenuVisible(false)

    console.log("selectedItem", selectedItem);
  };
  const handleShowFinalSettlement = () => {

    setMenuVisible(false)
    navigation.navigate("FinalSettlement", {
      selectedItem: selectedItem
      // selectedBed?.currentTenantInfo?.[0]?.tenetId,
    });
  };

  const handleShowFinalNew = () => {

    setMenuVisible(false)
    navigation.navigate("FinalSettlementScreen", {
      selectedItem: selectedItem
      // selectedBed?.currentTenantInfo?.[0]?.tenetId,
    });
  };

  const handleShowCancelNotice = () => {
    setMenuVisible(false)
    navigation.navigate("CancelNotice", {
      selectedItem: selectedItem,
    });
  };







  useEffect(() => {
    const backAction = () => {


      if (showEdit) {
        setShowEdit(false);
        return true;
      }

      if (showEditSheet) {
        setShowEditSheet(false);
        return true;
      }

      if (showEditJoiningDate) {
        setShowEditJoiningDate(false);
        return true;
      }

      if (showEditRent) {
        setShowEditRent(false);
        return true;
      }

      if (showEditAdvance) {
        setShowEditAdvance(false);
        return true;
      }

      if (showAssignAmenities) {
        setShowAssignAmenities(false);
        return true;
      }

      if (activeTab === "Transactions") {
        setActiveTab("Complaints");
        return true;
      }

      if (activeTab === "Complaints") {
        setActiveTab("Bill");
        return true;
      }

      if (activeTab === "Bill") {
        setActiveTab("EB Reading");
        return true;
      }

      if (activeTab === "EB Reading") {
        setActiveTab("Overview");
        return true;
      }
      if (showStayHistory) {
        setShowStayHistory(false);
        return true;
      }

      navigation.goBack();
      return true;
    };


    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => handler.remove();
  }, [
    activeTab,
    showEdit,
    showEditSheet,
    showEditJoiningDate,
    showEditRent,
    showEditAdvance,
    showAssignAmenities, showStayHistory
  ]);


  const NoReadAccess = () => (
    <View style={styles.emptyContainer}>
      {/* <Text style={styles.emptyIcon}>⚠️</Text> */}
      {/* <Text style={styles.emptyTitle}>Access Restricted</Text> */}
      <Image source={EmptyState} style={styles.image} />
      <Text style={styles.emptyText}>
        You don’t have permission to view Tenants.
      </Text>
    </View>
  );




  console.log("customerDetails", customerDetails)


  // const renderTab = () => {
  //   switch (activeTab) {
  //     case "EB Reading":
  //       return <EBReadingTab customerDetails={customerDetails} />;
  //     case "Bill":
  //       return <BillTab customerDetails={customerDetails} />;
  //     case "Complaints":
  //       return <ComplaintsTab customerDetails={customerDetails} />;
  //     default:
  //       return <OverviewTab customerDetails={customerDetails} handleEditBasicDetails={handleEditBasicDetails} handleEditAdressDetails={handleEditAdressDetails} handleEditJoining={handleEditJoining} handleEditMonthlyRent={handleEditMonthlyRent} handleEditAdvance={handleEditAdvance} handleShowAmenities={handleShowAmenities} />;
  //   }
  // }

  const {
    canWriteModule: canWriteInvoice,
    canReadModule: canReadInvoice,
    canUpdateModule: canUpdateInvoice,
    canDeleteModule: canDeleteInvoice,
  } = useHasPermission("Bills")

  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  };


  const requestedLeavingDate =
    customerDetails?.checkoutInfo?.requestedLeavingDate;

  const leavingDateObj = parseDate(requestedLeavingDate);
  const today = new Date();

  const isAfterLeavingDate =
    leavingDateObj && today > leavingDateObj;


  const status = customerDetails?.customerCurrentStatus;

  const disableFinancialEdit =
    status === "BOOKED" ||
    status === "VACATED" ||
    status === "CANCELLED_BOOKING" ||
    status === "SETTLEMENT_GENERATED" || status === "INACTIVE"
  // (status === "NOTICE" && isAfterLeavingDate);

  const renderTab = () => {
    if (!canReadTenant) {
      return <NoReadAccess />;
    }

    switch (activeTab) {
      case "EB Reading":
        return <EBReadingTab customerDetails={customerDetails} />;

      case "Bill":
        return <BillTab customerDetails={customerDetails}
         ShowBillsDetails={(bill) => {
    setSelectedBill(bill);
    setBillDetailsShow(true);
  }}
        // ShowBillsDetails={(bill) => {
        //   selectedBill={bill}
        //   setBillDetailsShow(true)
        // }
        // }
         />;

      // case "Complaints":
      //   return <ComplaintsTab customerDetails={customerDetails} />;

      case "Transactions":
        return <CustomerTransaction customerDetails={customerDetails} 
        showTransactionDetails={()=>setTransactionDetailsShow(true)} selectedTransaction={setTransactionDetail}/>;

      default:
        return (
          <OverviewTab
            customerDetails={customerDetails}
            handleEditBasicDetails={handleEditBasicDetails}
            handleEditAdressDetails={handleEditAdressDetails}
            handleEditJoining={handleEditJoining}
            handleEditMonthlyRent={handleEditMonthlyRent}
            handleEditAdvance={handleEditAdvance}
            handleShowAmenities={handleShowAmenities}
            openAdditionalContact={() => setShowContactSheet(true)}
            handleshowKYCPendingSheet={handleshowKYCPendingSheet}
          />
        );
    }
  };
  const handleCreateBill = () => {
    if (!canWriteInvoice) return;
    navigation.navigate("CreateBills", { mode: "addBill", customerDetails })
  }

  const tabs = ["Overview", "EB Reading", "Bill", "Complaints", "Amenities"];

  return (
    <>
      {loading && <Loader />}
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <View style={styles.container}>

        <View style={{ flex: 1 }}>


          {showHeader && (
            <Animated.View style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 60,
              backgroundColor: "#fff",
              // justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
              // elevation: 10,
              borderBottomWidth: 0.5,
              borderColor: "#ddd",
              display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
              transform: [{ translateY: headerTranslateY }],
            }}>
              {/* <View style={{flexDirection:'row',backgroundColor:'red',flex:1}}> */}
              <TouchableOpacity onPress={() => navigation.goBack()}>
                {/* <Text style={styles.back}>←</Text> */}
                <Image source={BackIcon} style={{ height: 20, width: 20, marginRight: 3 }} />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, fontWeight: "600", textAlign: 'center', flex: 1 }} numberOfLines={2}>
                {customerDetails?.fullName}
              </Text>
              {/* </View> */}

              {(customerDetails?.customerCurrentStatus != "VACATED" && customerDetails?.customerCurrentStatus != "CANCELLED_BOOKING") && (
                <TouchableOpacity onPress={(e) => {
                  openMenu(e, customerDetails);
                }}>
                  <Image
                    source={MoreDot}
                    style={{ width: 20, height: 20, }}
                  />

                </TouchableOpacity>

              )}
            </Animated.View>
          )}

          <Animated.ScrollView
            onScroll={(event) => {
              const y = event.nativeEvent.contentOffset.y;

              if (y > 80 && !showHeader) {
                setShowHeader(true);
              } else if (y <= 80 && showHeader) {
                setShowHeader(false);
              }

              scrollY.setValue(y);
            }}
            scrollEventThrottle={16}
            stickyHeaderIndices={[2]}
            contentContainerStyle={{ paddingBottom: 100 }}
            stickyHeaderHiddenOnScroll={false}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}



            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                {/* <Text style={styles.back}>←</Text> */}
                <Image source={BackIcon} style={{ height: 20, width: 20, marginRight: 15 }} />
              </TouchableOpacity>



              {(customerDetails?.customerCurrentStatus != "VACATED" && customerDetails?.customerCurrentStatus != "CANCELLED_BOOKING") && (
                <TouchableOpacity onPress={(e) => {
                  openMenu(e, customerDetails);
                }}>
                  <Image
                    source={MoreDot}
                    style={{ width: 20, height: 20, }}
                  />

                </TouchableOpacity>

              )}
            </View>


            <Animated.View style={[
              styles.profileCard,
              {
                transform: [{ translateY }],
                opacity
              }
            ]}>


              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  // alignItems: 'center',
                }}
              >
                <View style={{ flex: 1, alignItems: 'center', paddingLeft: 10 }}>
                  <TouchableOpacity onPress={handleProfilePress}
                  disabled={(customerDetails?.customerCurrentStatus == "VACATED" || customerDetails?.customerCurrentStatus == "CANCELLED_BOOKING")}>
                    <View style={{ width: 95, height: 95 }}>
                      {profileImage?.uri || customerDetails?.profilePic ? (
                        <Image
                          source={{
                            uri: profileImage?.uri || customerDetails?.profilePic,
                          }}
                          style={styles.avatar}
                        />
                      ) : (
                        <View style={{
                          width: 95, height: 95, borderRadius: 17.08, backgroundColor: "#E5E7EB",
                          alignItems: "center", justifyContent: "center"
                        }}>
                          <Text style={{
                            fontSize: 20, fontWeight: "600", color: "#374151",
                          }}>
                            {customerDetails?.initials}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* <Image
                  source={
                    profileImage?.uri
                      ? { uri: profileImage.uri }
                      : customerDetails?.profilePic
                        ? { uri: customerDetails.profilePic }
                        : ProfileImg
                  }
                  style={styles.avatar}
                /> */}
                  </TouchableOpacity>
                </View>

                {/* {customerDetails?.customerCurrentStatus != "VACATED" && (
              <TouchableOpacity onPress={(e) => {
                openMenu(e, customerDetails);
              }}>
                <Image
                  source={MoreDot}
                  style={{ width: 20, height: 20, }}
                />

              </TouchableOpacity>

            )} */}


              </View>


              {/* NAME */}
              <View style={[styles.nameRowCenter, { marginTop: 4 }]}>
                <Text style={styles.name}>
                  {customerDetails?.fullName}
                </Text>

                {
                  (customerDetails?.customerCurrentStatus != "VACATED" && customerDetails?.customerCurrentStatus != "CANCELLED_BOOKING") && (
                    <Image source={VerifiedIcon} style={{ width: 20, height: 20 }} />
                  )
                }


                {/* <Text style={styles.verified}>✔</Text> */}
              </View>

              {customerDetails?.customerCurrentStatus == "VACATED" && 
              <View style={{paddingHorizontal:8,backgroundColor:'#ffcfd3',paddingVertical:5,flexDirection:'row',
                          alignItems:'center',marginBottom:8,borderRadius:5,marginLeft:5}}>
                <View style={{width:8,height:8,borderRadius:4,backgroundColor:'#da252a',marginRight:5}}/>
                  <Text style={{fontSize:14, fontFamily:'Gilroy-Medium',color:'#da252a'}}>
                    {customerDetails?.customerCurrentStatus}</Text>
                </View>}

              {/* ROOM DETAILS */}

              <View style={styles.metaRowCenter}>
                {/* <View style={styles.floorBadge}> */}
                <Image source={FloorIcon} style={[styles.icon, { tintColor: '#1E45E1' }]} />
                <Text style={styles.floorText}>
                  {customerDetails?.hostelInfo?.floorName}
                </Text>
                {/* </View> */}

                <Image source={Room_NewIcon} style={styles.icon} />
                <Text style={styles.metaText}>
                  {customerDetails?.hostelInfo?.roomName}
                </Text>

                <Image source={Bed_NewIcon} style={styles.icon} />
                <Text style={styles.metaText}>
                  {customerDetails?.hostelInfo?.bedName}
                </Text>
              </View>


              <View style={styles.actionRow}>

                <TouchableOpacity
                  style={[styles.reminderBtn, !isSubscriptionReadAllow && { opacity: 0.4 }]}
                  disabled={!isSubscriptionReadAllow}
                  onPress={() => handleOpenWhatsapp(customerDetails)}
                >
                  <Image source={WhatsappGreenIcon} style={styles.actionIcon} />
                  <Text style={styles.reminderText}>Chat </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.callBtn, !isSubscriptionReadAllow && { opacity: 0.4 }]}
                  disabled={!isSubscriptionReadAllow}
                  onPress={() => {
                    handleCallPhone(customerDetails)
                  }}
                >
                  <Image source={Call} style={styles.actionIcon} />
                  <Text style={styles.callText}>Call</Text>
                </TouchableOpacity>

              </View>



              {/* {
            customerDetails?.customerCurrentStatus == "VACATED" && (
              <View style={{
                paddingVertical: 8, paddingHorizontal: 10, backgroundColor: "#fbd5d2", borderRadius: 10,
                flexDirection: 'row', alignItems: 'center', marginBottom: 10
              }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f00800', marginRight: 4 }} />
                <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Bold', color: '#f00800' }}>Vacated</Text>
              </View>
            )
          }


         
          {
            customerDetails?.customerCurrentStatus !== "VACATED" && (
              <View style={styles.actionRow}>
                {
                  environment !== "PROD" && (
                    <TouchableOpacity style={styles.walletBtn}>
                      <Text style={styles.walletText}>Wallet</Text>
                    </TouchableOpacity>
                  )
                }


                <TouchableOpacity
                  style={styles.stayBtn}
                  onPress={() => setShowStayHistory(true)}
                >
                  <Text style={styles.stayText}>Stay History</Text>
                </TouchableOpacity>
              </View>
            )
          }

          {
            customerDetails?.customerCurrentStatus == "VACATED" && (
              <View style={{display:'flex', flexDirection:'row'}}>
              <TouchableOpacity
              
              style={{
                backgroundColor: '#1E45E1', paddingVertical: 12, alignItems: 'center', width:'48%',
                borderRadius: 12, flexDirection: 'row', justifyContent: 'center', marginTop: 12 , marginRight:5
              }}
                disabled>
                <Image source={RecheckInIcon} style={{ width: 20, height: 20 }} />
                <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', color: '#ffffff', marginLeft: 5 }}>Re Check in</Text>
              </TouchableOpacity>

                              <TouchableOpacity
                  style={{    backgroundColor: "#E6ECFF",paddingVertical: 12, alignItems: 'center', width:'48%',
                borderRadius: 12, flexDirection: 'row', justifyContent: 'center', marginTop: 12}}
                  onPress={() => setShowStayHistory(true)}
                >
                  <Text style={styles.stayText}>Stay History</Text>
                </TouchableOpacity>
                </View>
            )
          } */}


            </Animated.View>



            {/* TABS */}
            <View>

              <View style={{
                backgroundColor: "#fff",
                zIndex: 5, paddingTop: showHeader ? 70 : 0
              }}>
                <View style={styles.tabRow}>
                  {["Overview", "EB Reading", "Bill", "Transactions"].map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={styles.tabBtn}
                      >
                        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                          {tab}
                        </Text>
                        {isActive && <View style={styles.activeLine} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* CONTENT */}
            <View style={{ flex: 1, }}>
              {renderTab()}
            </View>

          </Animated.ScrollView>

          {activeTab == "Bill" && (
            <TouchableOpacity
              //  style={[ styles.addBtn, !canWriteInvoice && { opacity: 0.4 }]}
              style={[
                styles.addBtn,
                (!canWriteInvoice || disableFinancialEdit) && { opacity: 0.4 }
              ]}
              //  disabled={!canWriteInvoice}
              disabled={disableFinancialEdit || !canWriteInvoice}
              onPress={handleCreateBill}>
              <Image source={AddIcon} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          )}

        </View>

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
                    selectedItem && selectedItem.customerCurrentStatus === "CHECK_IN" &&
                    <>
                      <TouchableOpacity
                        // style={styles.popupRow}
                        style={[
                          styles.popupRow,
                          !canUpdateTenant && { opacity: 0.4 }]}
                        disabled={!canUpdateTenant}
                        onPress={() => {
                          setReassignCustomer(selectedItem);
                          handleShowReAssignBed();
                        }}
                      >

                        <Image
                          source={ReAssignIcon}
                          style={styles.popupIcon}
                        />
                        <Text style={styles.popupText}>Change Bed</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.popupRow,
                          !canUpdateTenant && { opacity: 0.4 }]}
                        disabled={!canUpdateTenant}

                        onPress={() => {
                          // setSelectedCustomer(selectedItem);
                          // setShowMenu(false);
                          setMenuVisible(false)
                          setShowNotice(true);
                        }}

                      >
                        <Image
                          source={MoveToNoticeIcon}
                          style={styles.popupIcon}
                        />
                        <Text style={styles.popupText}>Move to Notice Period</Text>
                      </TouchableOpacity>
                    </>

                  }
                  {
                    selectedItem && selectedItem.customerCurrentStatus === "BOOKED" &&
                    <>
                      <TouchableOpacity
                        // style={styles.popupRow}
                        style={[
                          styles.popupRow,
                          !canUpdateTenant && { opacity: 0.4 }]}
                        disabled={!canUpdateTenant}
                        onPress={handleMakeUsInActive}
                      >
                        <Image source={ReAssignIcon} style={styles.popupIcon} />
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
                        <Image source={MakeCheckInIcon} style={styles.popupIcon} />
                        <Text style={styles.popupText}>Checkin</Text>
                      </TouchableOpacity>
                    </>
                  }
                  {selectedItem &&
                    !["CHECK_IN", "SETTLEMENT_GENERATED", "BOOKED"].includes(selectedItem.customerCurrentStatus) && (

                      <>
                        {/* <TouchableOpacity
                        // style={styles.popupRow}
                        style={[
                          styles.popupRow,
                          !canUpdateTenant && { opacity: 0.4 }]}
                        disabled={!canUpdateTenant}
                      onPress={handleShowFinalSettlement}
                      >
                        <Image
                          source={ReAssignIcon}
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
                          <Image source={Generate} style={styles.popupIcon} />
                          <Text style={styles.popupText}>Generate</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          // style={styles.popupRow} 
                          style={[
                            styles.popupRow,
                            !canUpdateTenant && { opacity: 0.4 }]}
                          disabled={!canUpdateTenant}
                          onPress={handleShowCancelNotice}
                        >
                          <Image
                            source={require("../../../Assets/Images/ReAssign.png")}
                            style={styles.popupIcon}
                          />
                          <Text style={styles.popupText}>Cancel Check-out</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  {selectedItem &&
                    !["CHECK_IN", "NOTICE", "BOOKED"].includes(selectedItem.customerCurrentStatus) && (
                      <TouchableOpacity
                        style={[
                          styles.popupRow,
                          !canUpdateTenant && { opacity: 0.4 }]}
                        disabled={!canUpdateTenant}
                        onPress={() => {
                          setShowCheckout(true);
                          setMenuVisible(false)
                        }}
                      >
                        <Image source={CheckoutIcon} style={styles.popupIcon} />
                        <Text style={styles.popupText}>Checkout</Text>
                      </TouchableOpacity>

                    )}

                  {selectedItem &&
                    !["BOOKED"].includes(selectedItem.customerCurrentStatus) && (
                      <TouchableOpacity
                        style={[
                          styles.popupRow,
                          !canUpdateTenant && { opacity: 0.4 }]}
                        disabled={!canUpdateTenant}
                        onPress={() => {
                          setShowStayHistory(true)
                          setMenuVisible(false)
                        }}
                      >
                        <Image source={StayIcon} style={styles.popupIcon} />
                        <Text style={styles.popupText}>Stay History</Text>
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



        {
          showReAssignbed &&
          <ReassignBedSheet visible={showReAssignbed} onClose={handlecloseReAssignbed} customer={reassignCustomer} onSuccess={fetchCustomerDetails} />

        }

        {showNotice && (
          <MoveNoticeSheet
            visible={showNotice}
            onClose={() => setShowNotice(false)}
            customer={selectedItem}
            onSuccess={handleCheckoutSuccess}
          />
        )}
        <InactiveTenantSheet
          visible={showInactiveSheet}
          onClose={() => setShowInactiveSheet(false)}
          selectedItem={selectedItem}
          onSuccess={handleCheckoutSuccess}
        // RedirectionSuccess = {handleRedirectTenant}
        />

        {
          showCheckout &&
          <CheckoutBottomSheet
            visible={showCheckout}
            onClose={() => {
              fetchCustomerDetails()
              setShowCheckout(false)
            }}
            reason={reason}
            setReason={setReason}
            selectedItem={selectedItem}
            onSuccess={handleCheckoutSuccess}

          />
        }


        <ImagePickerSheet
          visible={showProfileSheet}
          onClose={() => setShowProfileSheet(false)}
          title="Change Profile Picture"
          options={[
            {
              label: "Take Picture",
              icon: require("../../../Assets/Images/CameraIcon.png"),
              showArrow: true,
              onPress: openCamera,
            },
            {
              label: "Select from Gallery",
              icon: require("../../../Assets/Images/GalleryIcon.png"),
              showArrow: true,
              onPress: openGallery,
            },
            {
              label: "Remove Picture",
              icon: require("../../../Assets/Images/DeleteIcon.png"),
              showArrow: false,
              onPress: () => console.log("remove"),
            },
          ]}
        />

        <EditBasicDetailsSheet
          visible={showEdit}
          onClose={() => setShowEdit(false)}
          customerDetails={customerDetails}
          onSuccess={fetchCustomerDetails}
        />
        <EditManualAddressSheet
          visible={showEditSheet}
          onClose={() => setShowEditSheet(false)}
          customerDetails={customerDetails}
          onSuccess={fetchCustomerDetails}
        />
        <EditJoiningDateSheet
          visible={showEditJoiningDate}
          onClose={() => setShowEditJoiningDate(false)}
          customerDetails={customerDetails}
          onSuccess={fetchCustomerDetails} />
        <EditRentalAmountSheet
          visible={showEditRent}
          onClose={() => setShowEditRent(false)}
          customerDetails={customerDetails}
          onSuccess={fetchCustomerDetails}
        />
        <EditAdvanceAmountSheet
          visible={showEditAdvance}
          onClose={() => setShowEditAdvance(false)}
          customerDetails={customerDetails}
          onSuccess={fetchCustomerDetails}
        />
        <AssignAmenitiesSheet
          visible={showAssignAmenities}
          onClose={() => setShowAssignAmenities(false)}
          customerDetails={customerDetails}
          onSuccess={fetchCustomerDetails}
        />
        <StayHistorySheet
          visible={showStayHistory}
          onClose={() => setShowStayHistory(false)}
          customerDetails={customerDetails}
        />

        <AdditionalContactBottomSheet
          visible={showContactSheet}
          onClose={() => setShowContactSheet(false)}
        // onSave={async (payload) => {
        //   await saveAdditionalContact(activeHostelId, customerId, payload);
        //   setShowContactSheet(false);
        // }}
        />
        <BillDetailsSheet
          visible={BillDetailshow}
          onClose={() => {
            fetchCustomerDetails();
            setBillDetailsShow(false)
          }}
          selectedBill={selectedBill}
        // bill={selectedBill}
        />

        <TransactionDetailSheet
        visible={transactionDetailShow}
        onClose={()=>{setTransactionDetailsShow(false)}}
        selectedTransaction={transactionDetail}/>


            <KYCPendingSheet
    visible={showkycPendingSheet}
    onClose={() => setShowKYCPendingSheet(false)}
    customerDetails={customerDetails}
/>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    marginBottom: 14,

  },
  back: { fontSize: 22, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "600", flex: 1 },
  // notificationDot: {
  //   width: 10,
  //   height: 10,
  //   borderRadius: 5,
  //   backgroundColor: "red",
  // },

  profileCard: {
    flexDirection: "column",
    backgroundColor: "#fff",
    // borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",
    // backgroundColor:'#f1f4ff'

    // ✅ Border
    // borderWidth: 1,
    // borderColor: "#E5E7EB",

    // ✅ Shadow (iOS)
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 8,

    // ✅ Shadow (Android)
    // elevation: 3,
  },


  avatar: {
    width: 95,
    height: 95,
    borderRadius: 17.08,
    marginBottom: 12,
  },
  nameRowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  metaRowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 18,
  },


  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: { fontSize: 16, fontFamily: "Gilroy-Semibold", textAlign: 'center' },
  verified: { color: "green", marginLeft: 6 },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  floorBadge: {
    backgroundColor: "#F1F5FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  floorText: { fontSize: 12, fontFamily: "Gilroy-Semibold" },

  icon: { width: 17, height: 17, marginHorizontal: 4 },
  metaText: { fontSize: 12, color: "#444", fontFamily: "Gilroy-Semibold" },

  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
    gap: 10
  },

  tabBtn: {
    marginRight: 20,
    paddingBottom: 8,
  },

  tabText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "Gilroy-Semibold"
  },

  activeTabText: {
    color: "#2563EB",
    fontWeight: "600",
    fontFamily: "Gilroy-Semibold"
  },

  activeLine: {
    height: 2,
    backgroundColor: "#2563EB",
    marginTop: 6,
    borderRadius: 10,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },

  walletBtn: {
    flex: 1,
    backgroundColor: "#E6F4EA",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",

  },

  walletText: {
    color: "#1B873F",
    fontSize: 13,
    fontWeight: "600",
  },

  stayBtn: {
    flex: 1,
    backgroundColor: "#c0caec",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  stayText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "600",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#111827",
  },

  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  image: {
    width: 250,
    height: 180,
    resizeMode: "contain",
    opacity: 0.9,
  },

  addBtn: {

    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#1D5DFF",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  // ---
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
  actionRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10
  },

  reminderBtn: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#E8F7EE",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1
  },

  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#E8F0FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1
  },

  reminderText: {
    color: "#00A653",
    fontFamily: "Gilroy-Semibold",
    marginLeft: 6
  },

  callText: {
    color: "#1E45E1",
    fontFamily: "Gilroy-Semibold",
    marginLeft: 6
  },

  actionIcon: {
    width: 18,
    height: 18
  },

});
