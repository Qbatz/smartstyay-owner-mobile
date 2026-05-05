import React, { useRef, useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  PanResponder, BackHandler , NativeModules , Linking
} from "react-native";
import Profile from "../../../Assets/Images/Avatar.png";
import CheckoutIcon from "../../../Assets/Images/checkout_red.png";
import ReserveIcon from "../../../Assets/Images/user-square.png";
import WhatsappGreenIcon from "../../../Assets/Images/whatsapp.png";
import Call from "../../../Assets/Images/call.png";
import { CommonContexts } from "../../../Context/CommonContext";
import { PGContext } from "../../../Context/PGContext";
import { useCustomer } from "../../../Context/CustomerContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import SuccessModal from "../../../ToastFile/ToastPage";

export default function NoticePeriodBedSheet({
  visible,
  onClose,
  bed,
  room,
  tenant, onClick, onFinalSheet, cancelNoticePeriod, handleEditBed, selectedBed, handleNoticeToCheckout
}) {
  const translateY = useRef(new Animated.Value(500)).current;
   const {CommonModule}=NativeModules;
  const { activeHostelId } = useContext(CommonContexts);
       const { getParticularHostelDetails, PGDetails } = useContext(PGContext);
  const { getCustomersByHostel, loading } = useCustomer();
  const [menuVisible, setMenuVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
   const navigation = useNavigation();

      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modalMessage, setModalMessage] = useState("");
      const [modalType, setModalType] = useState("success");


  console.log("selectedBed", selectedBed)
  const handleEdit = () => {
    if (!handleEditBed || !selectedBed) return;
    handleEditBed(selectedBed);
  };
  const handleCheckoutSheet = () => {
    setMenuVisible(false);
    handleNoticeToCheckout()
    onClose();
  }

  useFocusEffect(
    useCallback(() => {
      if (activeHostelId) {
        fetchCustomers();
      }
    }, [activeHostelId])
  );

  


  const fetchCustomers = async () => {
    const data = await getCustomersByHostel(activeHostelId);
    setCustomers(data?.listCustomers || []);
  };

     useEffect(() => {
                 if (activeHostelId) {
                   getParticularHostelDetails(activeHostelId);
                 }
               }, [activeHostelId])

  console.log("customers123", customers)
  const matchedCustomer = customers.find(
    c => c.customerId === selectedBed?.currentTenantInfo[0]?.tenetId
  );
  console.log("matchedCustomer", matchedCustomer)


  // console.log("filteredTenants", filteredTenants);
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 500,
      duration: 250,
      useNativeDriver: true,
    }).start();

    if (!visible) setMenuVisible(false);
  }, [visible]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 130) onClose();
      else
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
    },
  });

  const handleNoticeToBooking = () => {
    setMenuVisible(false)
    onClose()
    onClick()
  }
  const handleFinalSettledment = () => {
    setMenuVisible(false);
    onFinalSheet();
    onClose();
  };
  const handleCancelNoticePeriod = () => {
    setMenuVisible(false);
    cancelNoticePeriod();
    onClose();
  };

      const handleCallPhone=(mobile)=>{
    console.log("mobile",mobile)
    if(mobile){
      CommonModule.makeCall(mobile)
    }
    
  }

  const {
    canWriteModule: canWriteCustomers,
    // canReadModule: canReadPayingGuests,
    // canUpdateModule: canUpdatePayingGuests,
    // canDeleteModule: canDeletePayingGuests,
  } = useHasPermission("Customers");


     const {
           canReadModule: canReadPayingGuests,
          canUpdateModule: canUpdatePayingGuests,
          // canDeleteModule: canDeletePayingGuests,
  
      } = useHasPermission("Paying Guests");


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
const isSubscriptionAllow = isValidSubscription && canReadPayingGuests;

  if (!visible) return null;

  return (
    <>
     <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />

      <View style={styles.overlay}>
        <TouchableWithoutFeedback
          onPress={() => {
            setMenuVisible(false);
            onClose();
          }}
        >
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet */}
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>Bed Status</Text>

          {/* Tags Row */}
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {selectedBed.floorName}
              </Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {selectedBed.roomName} - {selectedBed.bedName}
              </Text>
            </View>

            {/* 3-Dot Menu */}
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <Text style={{ fontSize: 24 }}>⋮</Text>
            </TouchableOpacity>
          </View>


          {/* {menuVisible && (
            <View style={styles.dropdown}>
                
              <TouchableOpacity style={styles.menuItem}  onPress={handleNoticeToBooking}>
                <Image
                  source={require("../../../Assets/Images/NewBook.png")}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>New Booking</Text>
              </TouchableOpacity>
               <TouchableOpacity style={styles.menuItem}  >
                <Image
                  source={require("../../../Assets/Images/NewBook.png")}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Checkout</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleCancelNoticePeriod}>
                <Image
                  source={require("../../../Assets/Images/calendarremove.png")}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Cancel Notice period</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleFinalSettledment}>
                <Image
                  source={require("../../../Assets/Images/receipttext.png")}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Generate FS</Text>
              </TouchableOpacity>
               <TouchableOpacity style={styles.menuItem} 
             onPress={handleEdit}>
                <Image
                  source={require("../../../Assets/Images/editIcon.png")}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )} */}
          {menuVisible && (
            <>
              {/* {menuVisible && (
  <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
    <View style={styles.menuOverlay} />
  </TouchableWithoutFeedback>
)} */}
              <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                <View style={StyleSheet.absoluteFillObject} />
              </TouchableWithoutFeedback>

              <View style={styles.dropdown}>

                <TouchableOpacity
                  // style={styles.menuItem}
                  disabled={!canUpdatePayingGuests}
                  style={[styles.menuItem, !canUpdatePayingGuests && { opacity: 0.4 }]}
                  onPress={handleEdit}
                >
                  <Image
                    source={require("../../../Assets/Images/editIcon.png")}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>Edit</Text>
                </TouchableOpacity>
                {matchedCustomer?.currentStatus === "Settlement Generated" ? (
                  <TouchableOpacity
                    //  style={styles.menuItem}
                    disabled={!canWriteCustomers}
                    style={[styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
                    onPress={handleCheckoutSheet}>
                    <Image
                      source={CheckoutIcon}
                      style={styles.menuIcon}
                    />
                    <Text style={styles.menuText}>Checkout</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    {/* Normal menu items */}
                    <TouchableOpacity
                      // style={styles.menuItem}
                      disabled={!canWriteCustomers}
                      style={[styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
                      onPress={handleNoticeToBooking}
                    >
                      <Image
                        source={ReserveIcon}
                        style={styles.menuIcon}
                      />
                      <Text style={styles.menuText}>New Booking</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      // style={styles.menuItem}
                      disabled={!canWriteCustomers}
                      style={[styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
                      onPress={handleCancelNoticePeriod}
                    >
                      <Image
                        source={require("../../../Assets/Images/calendarremove.png")}
                        style={styles.menuIcon}
                      />
                      <Text style={styles.menuText}>Cancel Check-out</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      // style={styles.menuItem}
                      disabled={!canWriteCustomers}
                      style={[styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
                      onPress={handleFinalSettledment}
                    >
                      <Image
                        source={require("../../../Assets/Images/receipttext.png")}
                        style={styles.menuIcon}
                      />
                      <Text style={styles.menuText}>Generate</Text>
                    </TouchableOpacity>


                  </>
                )}

              </View>


            </>
          )}

   <View style={styles.divider} />
          <Text style={{  color: "#000000",
        fontSize: 14,
          fontFamily: "Gilroy-Semibold",marginBottom:10}}>Occupied by</Text>

          <View style={styles.profileRow}>
            {/* <Image source={Profile} style={styles.profileImg} /> */}
            {selectedBed?.currentTenantInfo?.[0]?.profilePic ? (
              <Image
                source={{ uri: selectedBed.currentTenantInfo[0].profilePic }}
                style={styles.profileImg}
              />
            ) : (
              <View style={[styles.initialCircle, { width: 42, height: 42, borderRadius: 21 }]}>
                <Text style={styles.initialText}>
                  {selectedBed?.currentTenantInfo?.[0]?.tenantFullName
                    ?.split(" ")
                    ?.map(w => w[0])
                    ?.join("")
                    ?.slice(0, 2)
                    ?.toUpperCase() || "--"}
                </Text>
              </View>
            )}

            <View>
              {console.log("haha",selectedBed)}
              <TouchableOpacity   onPress={() =>
                        navigation.navigate("CustomerOverviewScreen", {
                          customerId: selectedBed.currentTenantInfo[0]?.tenetId,
                          customer: selectedBed.currentTenantInfo[0],
                        })
                      }>
                    <Text style={styles.tenantName}>{selectedBed.currentTenantInfo[0]?.tenantFullName}</Text>
              </TouchableOpacity>
              
              <Text style={styles.tenantPhone}>+91{selectedBed.currentTenantInfo[0]?.mobile}</Text>
            </View>
          </View>

            <View style={styles.actionRow}>
                      
                                            <TouchableOpacity  
                                             style={[styles.chatBtn, !isSubscriptionAllow && { opacity: 0.4 }]}
                                             disabled={!isSubscriptionAllow}
                                            onPress={() =>handleOpenWhatsapp(selectedBed?.currentTenantInfo[0])}>
                                              <Image source={WhatsappGreenIcon} style={styles.actionIcon} />
                                              <Text style={styles.chatText}>Chat</Text>
                                            </TouchableOpacity>
                      
                                            <TouchableOpacity
                                              style={[styles.callBtn, !isSubscriptionAllow && { opacity: 0.4 }]}
                                    disabled={!isSubscriptionAllow}
                                        onPress={()=>handleCallPhone(selectedBed?.currentTenantInfo[0]?.mobile)}>
                                              <Image source={Call} style={styles.actionIcon} />
                                              <Text style={styles.callText}>Call</Text>
                                            </TouchableOpacity>
                      
                                          </View>

          <Text style={styles.label}>Rental Amount</Text>

          <View style={styles.dateRow}>
            <Image
              source={require("../../../Assets/Images/money.png")}
              style={styles.icon}
            />
            <Text style={styles.dateText}> ₹ {selectedBed.currentTenantInfo[0]?.rentAmount}</Text>
          </View>

          <Text style={styles.label}>Checkout Date</Text>
          <View style={styles.dateRow}>
            <Image
              source={require("../../../Assets/Images/calendar_blue.png")}
              style={styles.icon}
            />
            <Text style={styles.dateText}>{selectedBed.currentTenantInfo[0]?.leavingDate}</Text>
          </View>

          <Text style={styles.label}>Request Date</Text>
          <View style={styles.dateRow}>
            <Image
              source={require("../../../Assets/Images/calendar_blue.png")}
              style={styles.icon}
            />
            <Text style={styles.dateText}>{selectedBed.currentTenantInfo[0]?.noticeDate || "N/A" }</Text>
          </View>

          <TouchableOpacity style={styles.noticeBtn}>
            <Text style={styles.noticeText}>Notice Period</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  handle: {
    width: 55,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 14,
  },

  title: { fontSize: 18, fontFamily: "Gilroy-Bold" },

  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },

  tag: {
    backgroundColor: "#FFF3C9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },

  tagText: { fontSize: 12, fontFamily: "Gilroy-Semibold", color: "#333" },

  menuButton: {
    marginLeft: "auto",
    padding: 6,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },

  dropdown: {
    position: "absolute",
    right: 20,
    top: 105,
    backgroundColor: "#fff",
    width: 190,
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 999,
  },


  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  menuIcon: { width: 18, height: 18, marginRight: 10 },

  menuText: { fontSize: 14, color: "#333" , fontFamily: "Gilroy-Medium" },

  label: { fontSize: 14, color: "#666", marginTop: 12,fontFamily: "Gilroy-Regular" },

  profileRow: { flexDirection: "row", marginTop: 6, alignItems: "center" },

  profileImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eee",
    marginRight: 10,
  },

  tenantName: { fontSize: 16, fontFamily: "Gilroy-Bold" },

  tenantPhone: { fontSize: 13, color: "#666" , fontFamily: "Gilroy-Semibold"},

  amount: { fontSize: 17, fontFamily: "Gilroy-Bold" , marginTop: 4 },

  dateRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },

  icon: { width: 18, height: 18, marginRight: 8 },

  dateText: { fontSize: 14, fontFamily: "Gilroy-Semibold" },

  noticeBtn: {
    backgroundColor: "#FFE5E5",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
  },

  noticeText: { color: "#D9534F", fontSize: 15, fontFamily: "Gilroy-Bold"  },
  initialCircle: {
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5
  },

  initialText: {
    fontSize: 16,
   fontFamily: "Gilroy-Bold" ,
    color: "#374151",
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10
  },

  chatBtn: {
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

  chatText: {
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
  divider: {
  height: 0.6,
  backgroundColor: "#E5E7EB", 
  marginBottom: 4,
  marginTop:10
},

});
