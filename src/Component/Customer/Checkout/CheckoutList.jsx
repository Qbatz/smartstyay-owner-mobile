import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Modal,
  FlatList, Animated, PanResponder, Pressable ,   NativeModules , Linking 
} from "react-native";

import Profile from "../../../Assets/Images/profile.png";
import Dots from "../../../Assets/Images/3dots.png";
import RoomIcon from "../../../Assets/Images/room.png";
import BedIcon from "../../../Assets/Images/bed.png";
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

export default function CheckoutList({ searchText }) {
  const { activeHostelId } = useContext(CommonContexts);
  const { getCheckoutCustomersByHostel, loading, GetParticularCustomerDetails } = useCustomer();
      const { getParticularHostelDetails, PGDetails } = useContext(PGContext);

  const [checkoutCustomer, setCheckoutCustomer] = useState([]);
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
       const [showSuccessModal, setShowSuccessModal] = useState(false);
       const [modalMessage, setModalMessage] = useState("");
       const [modalType, setModalType] = useState("success");
  const navigation = useNavigation();

    const {CommonModule}=NativeModules;

  const {
    canWriteModule: canWriteCheckout,
    canReadModule: canReadCheckout,
    canUpdateModule: canUpdateCheckout,
    canDeleteModule: canDeleteCheckout,
  } = useHasPermission("Checkout");

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



  useEffect(() => {
    if (activeHostelId) {
      fetchCheckoutCustomers();
    }
  }, [activeHostelId]);

  const fetchCheckoutCustomers = async () => {
    const data = await getCheckoutCustomersByHostel(activeHostelId);
    setCheckoutCustomer(data?.checkoutCustomers || []);
    console.log("Thara",data)
  };

  const openCustomerDetails =async (item) => {
    

    const res=await GetParticularCustomerDetails(item.customerId);
    console.log(res)
    setSelectedCustomer(res.data);
    setShowCustomerModal(true);
    
  };

  const filteredCheckout = checkoutCustomer.filter((item) => {
    const search = searchText?.trim().toLowerCase();
    return (
      item?.firstName?.toLowerCase().includes(search) ||
      item?.mobile?.toString().includes(search) ||
      item?.roomName?.toLowerCase().includes(search) ||
      item?.bedName?.toLowerCase().includes(search)
    );
  });



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
  
    const handleCallPhone=(mobile)=>{
      console.log("mobile",mobile)
      if(mobile){
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
    console.log("checkout",item)

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
          <View>
            {item?.profilePic ? <Image source={{uri:item.profilePic}} style={styles.profileImg} /> : 
                <View style={{width:55,height:55,borderRadius:30,backgroundColor:'#eef1ff',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:16,fontFamily: "Gilroy-Semibold"}}>{item?.initials}</Text>
                </View>}
          </View>

          <View style={styles.info}>
            <View
                                style={{ flex: 1 }}
                          
                              >
            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>

            <View style={styles.row}>
              <View style={styles.floorBadge}>
                <Text style={styles.floorText}>{item.floorName}</Text>
              </View>

              <View style={styles.iconRow}>
                <Image source={RoomIcon} style={styles.icon} />
                <Text style={styles.detailText}>{item.roomName}</Text>
              </View>

              <View style={styles.iconRow}>
                <Image source={BedIcon} style={styles.icon} />
                <Text style={styles.detailText}>{item.bedName}</Text>
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
      <View style={{ flex: 1 }}>


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

              <View style={styles.profileRow}>
                {selectedCustomer?.profilePic ? <Image source={{uri:selectedCustomer.profilePic}} style={styles.profileImg} /> : 
                <View style={{width:50,height:50,borderRadius:25,backgroundColor:'#eef1ff',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:16,fontFamily: "Gilroy-Semibold"}}>{selectedCustomer?.initials}</Text>
                </View>}
             
                <View style={styles.info}>
            <View
                                style={{ flex: 1 }}
                          
                              >
   <TouchableOpacity  onPress={() => handleOverViewScrren(selectedCustomer)}>
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

              <Text style={styles.label}>Email</Text>
              <View style={styles.infoRow}>
                <Image source={EmailIcon} style={styles.infoIcon} />
                <Text style={{fontFamily: "Gilroy-Bold" }}>{selectedCustomer?.emailId || "N/A"}</Text>
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
                      {selectedCustomer?.mobileNo}
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
                <TouchableOpacity onPress={()=>handleCallPhone(selectedCustomer?.mobileNo)}
              
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
                <Text style={{fontFamily: "Gilroy-Bold" }}>{selectedCustomer?.checkoutInfo?.checkoutDate}</Text>
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
    // backgroundColor: "#fff",
    // marginHorizontal: 10,
    // marginVertical: 6,
    // borderRadius: 12,
    // elevation: 2,
  },

  leftRow: { flexDirection: "row" },
  avatar: { width: 45, height: 45, borderRadius: 25 },

  info: { marginLeft: 12 },
  name: { fontFamily: "Gilroy-Bold" , fontSize: 15 },

  row: { flexDirection: "row", marginTop: 4, alignItems: "center" },

  floorBadge: { backgroundColor: "#F1F5FF", padding: 5, borderRadius: 6 },
  floorText: { color: "#2D6CDF", fontSize: 11, fontFamily: "Gilroy-Regular" },

  iconRow: { flexDirection: "row", marginLeft: 6, alignItems: "center" },
  icon: { width: 16, height: 16, marginRight: 3 },
  detailText: { fontSize: 12 , fontFamily: "Gilroy-Regular"},

  rightCol: { alignItems: "flex-end" , paddingRight:10},
  date: { color: "#999", fontSize: 11, marginTop: 5, fontFamily: "Gilroy-Regular" },

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

  title: { fontSize: 18,fontFamily: "Gilroy-Bold" },

  profileRow: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },

  profileImg: { width: 55, height: 55, borderRadius: 30 },
  profileName: { fontSize: 17,fontFamily: "Gilroy-Bold" ,  },

  label: { fontSize: 13, color: "#6B7280", marginTop: 12 , fontFamily: "Gilroy-Regular"},
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 4 , },
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
    fontFamily: "Gilroy-Medium" ,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 20,
  },
});
