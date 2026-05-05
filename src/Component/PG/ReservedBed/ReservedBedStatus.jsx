import React, { useRef, useEffect, useState , useContext} from "react";
import {
    View,
    Text,
    Animated,
    PanResponder,
    TouchableOpacity,
    Image,
    StyleSheet, TouchableWithoutFeedback, BackHandler,ScrollView , NativeModules , Linking
} from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import Profile from "../../../Assets/Images/Avatar.png";
import Calendar from "../../../Assets/Images/calendar_blue.png";
import Money from "../../../Assets/Images/money.png";
import Checkin from "../../../Assets/Images/add-circle.png";
import MakeUs from "../../../Assets/Images/ReAssign.png";
import Dots from "../../../Assets/Images/3dots.png";
import WhatsappGreenIcon from "../../../Assets/Images/whatsapp.png";
import Call from "../../../Assets/Images/call.png";
import InactiveTenantSheet from "../ReservedBed/MakeUsInActiveSheet";
import { useNavigation } from "@react-navigation/native";
import { PGContext } from "../../../Context/PGContext";
import { CommonContexts } from "../../../Context/CommonContext";
import SuccessModal from "../../../ToastFile/ToastPage";

export default function ReservedBedBottomSheet({ visible, onClose, selectTap, handleEditBed, selectedBed,onBedAdded,handleMakeUsInActive }) {
    const navigation = useNavigation();
    const {CommonModule}=NativeModules;

     const { getParticularHostelDetails, PGDetails } = useContext(PGContext);
     const { activeHostelId } = useContext(CommonContexts);

    console.log("selectedBedTHIFDGDGFG",selectedBed)
    const translateY = useRef(new Animated.Value(300)).current;
    const [menuOpen, setMenuOpen] = useState(false);
    const [showInactiveSheet, setShowInactiveSheet] = useState(false)
    const [bookedItems,setBookedItems] = useState("")
    const [bookDetails,setBookDetails] = useState("")

      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modalMessage, setModalMessage] = useState("");
      const [modalType, setModalType] = useState("success");

    console.log("bookedItemsbookedItems",bookedItems)
    useEffect(() => {
        if (selectTap) {
            selectTap(!showInactiveSheet);
        }
    }, [showInactiveSheet]);
    const handleEdit = () => {
        if (!handleEditBed || !selectedBed) return;
        handleEditBed(selectedBed);
    };

    useEffect(() => {
        const onBack = () => {
            if (showInactiveSheet) {
                setShowInactiveSheet(false);

                return true;
            }
            if (menuOpen) {
                setMenuOpen(false)
                return true;
            }


            return false;
        };
        const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
        return () => sub.remove();
    }, [showInactiveSheet, menuOpen]);


      useEffect(() => {
               if (activeHostelId) {
                 getParticularHostelDetails(activeHostelId);
               }
             }, [activeHostelId])

    useEffect(() => {
        if (visible) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: 300,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible])



    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
        onPanResponderMove: (_, g) => {
            if (g.dy > 0) translateY.setValue(g.dy);
        },
        onPanResponderRelease: (_, g) => {
            if (g.dy > 120) onClose();
            else Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        },
    });

       const {
        canWriteModule: canWriteCustomers,
        // canUpdateModule: canUpdatePayingGuests,
        // canDeleteModule: canDeletePayingGuests,
    } = useHasPermission("Customers");



    const {
         canReadModule: canReadPayingGuests,
        canUpdateModule: canUpdatePayingGuests,
        // canDeleteModule: canDeletePayingGuests,

    } = useHasPermission("Paying Guests");

    if (!visible) {
        return (
            <InactiveTenantSheet
                visible={showInactiveSheet}
                onClose={() => setShowInactiveSheet(false)}
                bookedItems={bookedItems}
                selectedBed={selectedBed}
                onBedAdded={onBedAdded}
            />
        );
    }
    const handleOuterClick = () => {
        onClose()
        setMenuOpen(false)
    }
    const handlemake=()=>{
        handleMakeUsInActive()
        onClose()
    }
    const handleCheckIn = (details) => {
        setMenuOpen(false)
        onClose()
        setBookDetails(details)
      navigation.navigate("ReserveToCheckin", {
     selectedBedReserv: details,
     selectedBed:selectedBed

  });
    }

      const handleCallPhone=(mobile)=>{
    console.log("mobile",mobile)
    if(mobile){
      CommonModule.makeCall(mobile)
    }
    
  }

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

    return (
        <>
         <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.overlayTouch} onPress={handleOuterClick} />

                {/* <Animated.View
                    style={[styles.sheet, { transform: [{ translateY }] }]}
                    {...panResponder.panHandlers}
                > */}
  <Animated.View
  style={[
    styles.sheet,
    {
      transform: [{ translateY }],
      maxHeight: "80%",   
    },
  ]}
  {...panResponder.panHandlers}  
>


                    <View style={styles.handle} />


                    <View style={styles.headerRow}>
                        <Text style={styles.title}>Bed Status</Text>                     
                    </View>
<View style={styles.tagRow}>
      <View style={[styles.tag, { backgroundColor: "#FDEBC8" }]}>
        <Text style={styles.tagText}>{selectedBed.floorName}</Text>
      </View>
      <View style={[styles.tag, { backgroundColor: "#FFD6D6" }]}>
        <Text style={styles.tagText}>{selectedBed.roomName} - {selectedBed.bedName}</Text>
      </View>
    </View>

                  

<ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 20 }}
>
{selectedBed?.newTenantInfo?.map((item, index) => (
  <View key={index}>
   

   {/* <View style={styles.reservedRow}>
  <Text style={styles.sub}>Reserved by</Text>

  <View style={{ position: "relative" }}>
    <TouchableOpacity onPress={() => setMenuOpen(index)}>
      <Image source={Dots} style={styles.dots} />
    </TouchableOpacity>

    {menuOpen === index && (
         <TouchableWithoutFeedback onPress={() => setMenuOpen(null)}>
    <View style={styles.menuOverlay}>
      <View style={styles.dotMenu}>
        <TouchableOpacity onPress={()=>handleCheckIn(item)} style={styles.menuItem}>
          <Image source={Checkin} style={styles.menuIcon} />
          <Text style={styles.menuText}>Check-In</Text>
        </TouchableOpacity>

      <TouchableOpacity
  style={styles.menuItem}
  onPress={() => {
    setMenuOpen(null);

    // ✅ send item to PGPageFull
    handleMakeUsInActive(item);

    // ✅ close reserved sheet
    onClose();
  }}
>
  <Image source={MakeUs} style={styles.menuIcon} />
  <Text style={styles.menuText}>Make as Inactive</Text>
</TouchableOpacity>


        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setMenuOpen(null);
            handleEdit();
          }}
        >
          <Image source={Checkin} style={styles.menuIcon} />
          <Text style={styles.menuText}>Edit</Text>
        </TouchableOpacity>
      </View>
      </View>
      </TouchableWithoutFeedback>
    )}
  </View>
</View> */}

   <View style={styles.divider} />
<View style={styles.reservedRow}>
  
  <Text style={styles.sub}>Reserved by</Text>

  <TouchableOpacity
    onPress={() => setMenuOpen(menuOpen === index ? null : index)}
  >
    <Image source={Dots} style={styles.dots} />
  </TouchableOpacity>
</View>

{/* ✅ FULL SCREEN OUTSIDE CLICK CLOSE */}
{menuOpen === index && (
  <TouchableWithoutFeedback onPress={() => setMenuOpen(null)}>
    <View style={styles.menuOverlay}>
      {/* ✅ MENU BOX INSIDE CLICK PREVENT CLOSE */}
      <TouchableWithoutFeedback>
        <View style={styles.dotMenu}>
          <TouchableOpacity
            onPress={() => handleCheckIn(item)}
            // style={styles.menuItem}
            disabled={!canWriteCustomers}
            style={[ styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
          >
            <Image source={Checkin} style={styles.menuIcon} />
            <Text style={styles.menuText}>Check-In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // style={styles.menuItem}
            disabled={!canWriteCustomers}
            style={[ styles.menuItem, !canWriteCustomers && { opacity: 0.4 }]}
            onPress={() => {
              setMenuOpen(null);
              handleMakeUsInActive(item);
              setBookedItems(item)
              onClose();
            }}
          >
            <Image source={MakeUs} style={styles.menuIcon} />
            <Text style={styles.menuText}>Make as Inactive</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // style={styles.menuItem}
            disabled={!canUpdatePayingGuests}
            style={[ styles.menuItem, !canUpdatePayingGuests && { opacity: 0.4 }]}
            onPress={() => {
              setMenuOpen(null);
              handleEdit();
            }}
          >
            <Image source={require("../../../Assets/Images/editIcon.png")} style={styles.menuIcon} />
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
)}



    {/* <View style={styles.userRow}>
      <Image source={Profile} style={styles.userImg} />

      <View>
        <Text style={styles.userName}>{item.tenantFullName}</Text>
        <Text style={styles.phone}>+91 {item.mobile}</Text>
      </View>
    </View> */}
    <View style={styles.userRow}>
  {item.profilePic ? (
    <Image
      source={{ uri: item.profilePic }}
      style={styles.userImg}
    />
  ) : (
    <View style={styles.initialsCircle}>
      <Text style={styles.initialsText}>
        {item.tenantInitials || item.tenantFullName?.charAt(0)}
      </Text>
    </View>
  )}

  <View>
  <TouchableOpacity onPress={() =>
                      navigation.navigate("CustomerOverviewScreen", {
                        customerId: item.tenetId,
                        customer: item,
                      })
                    }>
                      <Text style={styles.userName}>{item.tenantFullName}</Text>
                    </TouchableOpacity>
    <Text style={styles.phone}>+91 {item.mobile}</Text>
  </View>
</View>

    <View style={styles.actionRow}>
             
                                   <TouchableOpacity
                                    // style={styles.chatBtn}  
                                       style={[styles.chatBtn, !isSubscriptionAllow && { opacity: 0.4 }]}
                                       disabled={!isSubscriptionAllow}
                                       onPress={() =>handleOpenWhatsapp(item)}>
                                     <Image source={WhatsappGreenIcon} style={styles.actionIcon} />
                                     <Text style={styles.chatText}>Chat</Text>
                                   </TouchableOpacity>
             
                                   <TouchableOpacity
                                    style={[styles.callBtn, !isSubscriptionAllow && { opacity: 0.4 }]}
                                    disabled={!isSubscriptionAllow}
                                  //  style={styles.callBtn}
                                    onPress={()=>handleCallPhone(item?.mobile)}>
                                     <Image source={Call} style={styles.actionIcon} />
                                     <Text style={styles.callText}>Call</Text>
                                   </TouchableOpacity>
             
                                 </View>


    <View style={{ marginTop: 15 }}>
      <Text style={styles.infoLabel}>Booked Date</Text>
      <View style={styles.amountRow}>
        <Image source={Calendar} style={styles.amountIcon} />
        <Text style={styles.amountText}>{item.bookingDate}</Text>
      </View>
    </View>

    <View style={{ marginTop: 15 }}>
      <Text style={styles.infoLabel}>Booking Amount</Text>
      <View style={styles.amountRow}>
        <Image source={Money} style={styles.amountIcon} />
        <Text style={styles.amountText}>₹ {item.bookingAmount}</Text>
      </View>
    </View>

    <View style={{ marginTop: 15 }}>
      <Text style={styles.infoLabel}>Joining Date (Tentative)</Text>
      <View style={styles.amountRow}>
        <Image source={Calendar} style={styles.amountIcon} />
        <Text style={styles.amountText}>{item.joiningDate}</Text>
      </View>
    </View>
  </View>
))}
</ScrollView>
                  

                   

                    <TouchableOpacity style={styles.reservedBtn}>
                        <Text style={styles.resText}>Reserved</Text>
                    </TouchableOpacity>
      
                </Animated.View>
            </View>
            <InactiveTenantSheet
                visible={showInactiveSheet}
                onClose={() => setShowInactiveSheet(false)}
                bookedItems={bookedItems}
                selectedBed={selectedBed}
                onBedAdded={onBedAdded}
            />

        </>
    );
}


const styles = StyleSheet.create({
    overlay: {

      position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
        // position: "absolute",
        // left: 0, right: 0, top: 0,
        // backgroundColor: "rgba(0,0,0,0.4)",
        // justifyContent: "flex-end",
    },

    overlayTouch: {
        flex: 1,
    },

    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30
    },

    handle: {
        width: 60,
        height: 5,
        backgroundColor: "#ccc",
        alignSelf: "center",
        borderRadius: 3,
        marginBottom: 15,
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    title: {
        fontSize: 20,
        fontFamily: "Gilroy-Bold" ,
    },

    dots: {
        width: 30,
        height: 30
    },

    popupMenu: {
        marginTop: 60,
        marginRight: 20,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 12,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },

    popupItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
    },

    iconCheck: {
        width: 20,
        height: 20,
        marginRight: 10,
        resizeMode: "contain",
        tintColor: "#1E45E1"
    },

    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
        resizeMode: "contain",
    },

    popupText: {
        fontSize: 15,
        color: "#000",
    },


    tagRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 15,
    },

    tag: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
    },


    tagText: {
        fontSize: 12,
        color: "#444",
    },

    sub: {
        // marginTop: 20,
        color: "#000000",
        fontSize: 14,
          fontFamily: "Gilroy-Semibold",
    },

    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        gap: 12,
    },

    userImg: {
        width: 50, height: 50, borderRadius: 25,
    },

    userName: { fontSize: 16, fontWeight: "800" },
    phone: { fontSize: 12, color: "#555" },





    infoLabel: { fontSize: 12, color: "#777" },


    reservedBtn: {
        marginTop: 10,
        marginBottom:30,
        backgroundColor: "#EAF0FF",
        paddingVertical: 14,
        borderRadius: 20,
    },

    resText: {
        fontSize: 16,
        textAlign: "center",
        color: "#1E45E1",
      fontFamily: "Gilroy-Semibold",
    },
    amountRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },

    amountIcon: {
        width: 18,
        height: 18,
        tintColor: "#1E45E1",
        marginRight: 8,
    },

    amountText: {
        fontSize: 15,
       fontFamily: "Gilroy-Semibold",
        color: "#000",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    overlayMenu: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.0)",
    },
    menuWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        zIndex: 999,
    },
    reservedRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
},
dotMenu: {
  position: "absolute",
  top: 50,      
  right: 20,
  backgroundColor: "#fff",
  borderRadius: 12,
  paddingVertical: 6,
  width: 180,
  elevation: 10,
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 10,
},
menuItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 12,
},
menuIcon: {
  width: 18,
  height: 18,
  marginRight: 10,
  tintColor: "#1E45E1",
},

menuText: {
  fontSize: 14,
  color: "#000",
},
menuOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999,
},
initialsCircle: {
  width: 50,
  height: 50,
  borderRadius: 25,
   backgroundColor: "#E5E7EB",
  justifyContent: "center",
  alignItems: "center",
},

initialsText: {
   color: "#374151", 
  fontSize: 18,
   fontFamily: "Gilroy-Bold" ,
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
