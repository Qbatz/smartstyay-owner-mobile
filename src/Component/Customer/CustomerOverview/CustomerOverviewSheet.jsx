import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity, TouchableWithoutFeedback,
  Image, BackHandler
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCustomer } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
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
import ReassignBedSheet from "../ReAssignBed";
import MoveNoticeSheet from "../MoveToNoticePeriod";
import InactiveTenantSheet from "../../PG/ReservedBed/MakeUsInActiveSheet";
import CheckoutBottomSheet from "../Checkout/CheckoutTenant";
import RecheckInIcon from "../../../Assets/Images/recheckinIcon.png"

export default function CustomerOverviewScreen({ route, navigation }) {
  const { customer, customerId } = route.params || {};
  const { activeHostelId } = useContext(CommonContexts);
  const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel, changeBedCustomer, getCustomerDetails, editBasicDetails } = useCustomer();
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

  const [showNotice, setShowNotice] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [reason, setReason] = useState("");

  const [showInactiveSheet, setShowInactiveSheet] = useState(false)



  const {
    canWriteModule: canWriteTenant,
    canReadModule: canReadTenant,
    canUpdateModule: canUpdateTenant,
    canDeleteModule: canDeleteTenant,
  } = useHasPermission("Customers");

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

  const fetchCustomerDetails = async () => {
    const res = await getCustomerDetails(customer.customerId || customerId);
    console.log("fetchCustomerDetails", res)
    if (res.success) {
      setCustomerDetails(res.data)
    }
  }
  const handleProfilePress = () => {
    Alert.alert(
      "Change Profile Picture",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
        },
        {
          text: "Gallery",
          onPress: () => openGallery(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: "photo",
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.assets && response.assets.length > 0) {
          setProfileImage(response.assets[0]);
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

          // ✅ Send existing details as payload
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
            alert(res.message);
          }
        }
      }
    );
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
    await fetchCustomers();
    setShowCheckout(false);
  };

  const handleMakeUsInActive = () => {
    // setShowDetailsMenu(false);
    setShowInactiveSheet(true)
    setMenuVisible(false)
    // setShowDetailModal(false)

  }

  const handleShowTennantCheckin = () => {
    // navigation.navigate("TenantCheckin")
    navigation.navigate("BookingCheckIn", {
      customerId: selectedItem.customerId,
      customer: selectedItem,
    });

    setMenuVisible(false)
  }
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



  const renderTab = () => {
    if (!canReadTenant) {
      return <NoReadAccess />;
    }

    switch (activeTab) {
      case "EB Reading":
        return <EBReadingTab customerDetails={customerDetails} />;

      case "Bill":
        return <BillTab customerDetails={customerDetails} />;

      // case "Complaints":
      //   return <ComplaintsTab customerDetails={customerDetails} />;

      case "Transactions":
        return <CustomerTransaction customerDetails={customerDetails} />;

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
          />
        );
    }
  };

  const tabs = ["Overview", "EB Reading", "Bill", "Complaints", "Amenities"];

  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {/* <Text style={styles.back}>←</Text> */}
            <Image source={BackIcon} style={{ height: 20, width: 20, marginRight: 15 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tenant Profile</Text>
          <Image source={CheckinIcon} style={{ height: 25, width: 22 }} />
          {/* <View style={styles.notificationDot} /> */}
        </View>

        {/* PROFILE CARD */}
        {/* <View style={styles.profileCard}>
        <Image source={ProfileImg} style={styles.avatar} />

        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{customerDetails?.fullName}</Text>
            <Text style={styles.verified}>✔</Text>
            <TouchableOpacity onPress={() => setShowStayHistory(true)}>
  <Text style={[styles.verified, { color: "#2563EB" }]}>
    Stay
  </Text>
</TouchableOpacity>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.floorBadge}>
              <Text style={styles.floorText}>{customerDetails?.hostelInfo?.floorName}</Text>
            </View>

            <Image source={RoomIcon} style={styles.icon} />
            <Text style={styles.metaText}>{customerDetails?.hostelInfo?.roomName}</Text>

            <Image source={BedIcon} style={styles.icon} />
            <Text style={styles.metaText}>{customerDetails?.hostelInfo?.bedName}</Text>
          </View>
        </View>

        
      </View> */}
        <View style={styles.profileCard}>

          {/* PROFILE IMAGE */}
          {/* <Image source={ProfileImg} style={styles.avatar} /> */}
          {/* <TouchableOpacity onPress={handleProfilePress}>
  <Image
    source={
      profileImage?.uri
        ? { uri: profileImage.uri }
        : ProfileImg
    }
    style={styles.avatar}
  />
</TouchableOpacity> */}
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              // alignItems: 'center',
            }}
          >
            <View style={{ flex: 1, alignItems: 'center', paddingLeft: 10 }}>
              <TouchableOpacity onPress={handleProfilePress}>
                <View style={{ width: 90, height: 90 }}>
                  {profileImage?.uri || customerDetails?.profilePic ? (
                    <Image
                      source={{
                        uri: profileImage?.uri || customerDetails?.profilePic,
                      }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={{
                      width: 90, height: 90, borderRadius: 45, backgroundColor: "#E5E7EB",
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

            {customerDetails?.customerCurrentStatus != "VACATED" && (
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


          {/* NAME */}
          <View style={styles.nameRowCenter}>
            <Text style={styles.name}>
              {customerDetails?.fullName}
            </Text>

            <Image source={VerifiedIcon} style={{ width: 20, height: 20 }} />
            {/* <Text style={styles.verified}>✔</Text> */}
          </View>

          {/* ROOM DETAILS */}
          {
            customerDetails?.customerCurrentStatus !== "VACATED" && (
              <View style={styles.metaRowCenter}>
                <View style={styles.floorBadge}>
                  <Text style={styles.floorText}>
                    {customerDetails?.hostelInfo?.floorName}
                  </Text>
                </View>

                <Image source={Room_Icon} style={styles.icon} />
                <Text style={styles.metaText}>
                  {customerDetails?.hostelInfo?.roomName}
                </Text>

                <Image source={BedIcon} style={styles.icon} />
                <Text style={styles.metaText}>
                  {customerDetails?.hostelInfo?.bedName}
                </Text>
              </View>

            )
          }

          {
            customerDetails?.customerCurrentStatus == "VACATED" && (
              <View style={{paddingVertical:8,paddingHorizontal:10,backgroundColor:"#fbd5d2",borderRadius:10,
                          flexDirection:'row',alignItems:'center',marginBottom:10}}>
                <View style={{width: 8,height: 8,borderRadius: 4,backgroundColor:'#f00800',marginRight:4}}/>
                <Text style={{fontSize:13,fontFamily:'Gilroy-Bold',color:'#f00800'}}>Vacated</Text>
              </View>
            )
          }


          {/* BUTTON ROW */}

          {
             customerDetails?.customerCurrentStatus !== "VACATED" && (
              <View style={styles.actionRow}>
            <TouchableOpacity style={styles.walletBtn}>
              <Text style={styles.walletText}>Wallet</Text>
            </TouchableOpacity>

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
              <TouchableOpacity style={{backgroundColor:'#1E45E1',paddingVertical: 12,alignItems:'center',width:"100%",
                                       borderRadius: 12,flexDirection:'row',justifyContent:'center',marginTop:12}}
                                       disabled>
                <Image source={RecheckInIcon} style={{width:20,height:20}}/>
                <Text style={{fontSize:16,fontFamily:'Gilroy-Medium',color:'#ffffff',marginLeft:5}}>Re Check in</Text>
              </TouchableOpacity>
            )
          }
          

        </View>



        {/* TABS */}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
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
          </ScrollView>
        </View>

        {/* CONTENT */}
        <View style={{ flex: 1, }}>
          {renderTab()}
        </View>




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
                      <Text style={styles.popupText}>Change_Bed</Text>
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
                        source={ReAssignIcon}
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
                      <Image source={ReAssignIcon} style={styles.popupIcon} />
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
                        <Image source={require("../../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
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
                      <Image source={require("../../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
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

      {
        showReAssignbed &&
        <ReassignBedSheet visible={showReAssignbed} onClose={handlecloseReAssignbed} customer={reassignCustomer} onSuccess={fetchCustomers} />

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
      />

      {
        showCheckout &&
        <CheckoutBottomSheet
          visible={showCheckout}
          onClose={() => setShowCheckout(false)}
          reason={reason}
          setReason={setReason}
          selectedItem={selectedItem}
          onSuccess={handleCheckoutSuccess}

        />
      }

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
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",

    // ✅ Border
    borderWidth: 1,
    borderColor: "#E5E7EB",

    // ✅ Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    // ✅ Shadow (Android)
    elevation: 3,
  },


  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
  name: { fontSize: 16, fontWeight: "600", textAlign: 'center' },
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
  floorText: { fontSize: 12, color: "#2563EB" },

  icon: { width: 17, height: 17, marginHorizontal: 4 },
  metaText: { fontSize: 12, color: "#444" },

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
  },

  activeTabText: {
    color: "#2563EB",
    fontWeight: "600",
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
    backgroundColor: "#E6ECFF",
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

});
