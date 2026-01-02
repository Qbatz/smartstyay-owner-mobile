import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    Animated,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    PanResponder
} from "react-native";
import MoveNoticeSheet from '../../Customer/MoveToNoticePeriod';
import { useNavigation } from "@react-navigation/native";

import Profile from "../../../Assets/Images/Avatar.png";
import Calendar from "../../../Assets/Images/calendar_blue.png";
import Money from "../../../Assets/Images/money.png";
import Invoice from "../../../Assets/Images/invoice.png";
import Dots from "../../../Assets/Images/3dots.png";

import ReassignIcon from "../../../Assets/Images/ReAssign.png";
import NoticeIcon from "../../../Assets/Images/Logout.png";
import { ScrollView } from "react-native-gesture-handler";
import InactiveTenantSheet from "../ReservedBed/MakeUsInActiveSheet";

export default function OccupiedBedSheet({ visible, onClose, bed, room , onMoveToNotice ,onReAssign,handleEditBed,selectedBed,onBedAdded,handleMakeUsInActive,handleCheckIn }) {
    const translateY = useRef(new Animated.Value(300)).current;
    console.log("selectedBed",selectedBed)
    // const [showNotice, setShowNotice] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
// const [reqDate, setReqDate] = useState("31/07/2025");
// const [outDate, setOutDate] = useState("30/08/2025");
// const [reason, setReason] = useState("");
    const [bookedItems,setBookedItems] = useState("")
     const [showInactiveSheet, setShowInactiveSheet] = useState(false)

const handleMoveClick = () => {
  setMenuOpen(false);
  onClose();          // close occupied sheet
  onMoveToNotice();   // tell parent to open notice period
};
const handleMakeUsIn=(item)=>{
    setShowInactiveSheet(true)
//   handleMakeUsInActive()
  setBookedItems(item)
}
const handleBookToCheckin=()=>{
  handleCheckIn()
}
const handleEdit = () => {
  if (!handleEditBed || !selectedBed) return;
  handleEditBed(selectedBed);
};
 const [showOccupiedMenu, setShowOccupiedMenu] = useState(false);
  const [showReservedMenu, setShowReservedMenu] = useState(null);

const handleReAssignBed=()=>{
      setMenuOpen(false);
  onClose(); 
  onReAssign()
}


  
    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : 300,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [visible]);

   
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
        onPanResponderMove: (_, g) => {
            if (g.dy > 0) translateY.setValue(g.dy);
        },
        onPanResponderRelease: (_, g) => {
            if (g.dy > 120) onClose();
            else Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
    });

    if (!visible) return null;

    return (
        <>
        <View style={styles.overlay}>
        
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

         
          <Animated.View
           style={[
             styles.sheet,
             {
               transform: [{ translateY }],
               maxHeight: "70%",   
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
              showsHorizontalScrollIndicator={false}
              indicatorStyle="white"   
            >
                <Text style={styles.sub}>Occupied by</Text>

                {/* <View style={styles.userRow}>
                    <Image source={Profile} style={styles.userImg} />
                    <View>
                        <Text style={styles.userName}>{selectedBed.currentTenantInfo[0]?.tenantFullName}</Text>
                        <Text style={styles.phone}>+91 {selectedBed.currentTenantInfo[0]?.mobile}</Text>
                    </View>
                </View> */}
                <View style={styles.headerRow}>
                            <View style={styles.personRow}>
                              <Image
                                source={Profile}
                                style={styles.avatar}
                              />
                              <View>
                                <Text style={styles.name}>{selectedBed.currentTenantInfo[0]?.tenantFullName}</Text>
                                <Text style={styles.phone}>+91 {selectedBed.currentTenantInfo[0]?.mobile}</Text>
                              </View>
                            </View>
                
                            
                            <TouchableOpacity
                  style={styles.dotsButton}
                  onPress={() => setMenuOpen(!menuOpen)}
                >
                  <Image source={Dots} style={styles.dots} />
                </TouchableOpacity>
                
                          </View>
                           {menuOpen && (
                    <View style={styles.menuWrapper} pointerEvents="box-none">

                        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
                            <View style={styles.menuOverlay} />
                        </TouchableWithoutFeedback>

                        <View style={styles.popupMenu}>
                            <TouchableOpacity style={styles.popupItem} onPress={handleReAssignBed}>
                                <Image source={ReassignIcon} style={styles.menuIcon} />
                                <Text style={styles.popupText}>Re-Assign Bed</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.popupItem} onPress={handleMoveClick}>
                                <Image source={NoticeIcon} style={styles.menuIcon} />
                                <Text style={styles.popupText}>Move to Notice Period</Text>
                            </TouchableOpacity>
                             <TouchableOpacity style={styles.popupItem} onPress={handleEdit}>
                                <Image source={NoticeIcon} style={styles.menuIcon} />
                                <Text style={styles.popupText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* RENTAL AMOUNT */}
                <Text style={styles.label}>Rental Amount</Text>
                <View style={styles.rowInfo}>
                    <Image source={Money} style={styles.icon} />
                    <Text style={styles.value}>₹ {selectedBed.currentTenantInfo[0]?.rentAmount}</Text>
                </View>

                {/* JOINED DATE */}
                <Text style={styles.label}>Joined Date</Text>
                <View style={styles.rowInfo}>
                    <Image source={Calendar} style={styles.icon} />
                    <Text style={styles.value}>{selectedBed.currentTenantInfo[0]?.joiningDate}</Text>
                </View>

              
                <Text style={styles.label}>Last Invoice</Text>
                <View style={styles.rowInfo}>
                    <Image source={Invoice} style={styles.icon} />
                    <Text style={styles.value}>{selectedBed.currentTenantInfo[0]?.lastInvoiceNumber} & {selectedBed.currentTenantInfo[0]?.totalInvoices} more</Text>
                </View>



                 <View style={[styles.section, { borderBottomWidth: 0 }]}>
                          <Text style={styles.sectionTitle}>Reserved by</Text>
                
                          {
                            selectedBed.newTenantInfo.map((item,index)=>{
                              return(
                
                              
                <View style={{ position: "relative" }}  key={index}>
                 <View style={styles.headerRow}>
                            <View style={styles.personRow}>
                              <Image
                                source={require("../../../Assets/Images/profile.png")}
                                style={styles.avatar}
                              />
                              <View>
                                <Text style={styles.name}>{item.tenantFullName}</Text>
                                <Text style={styles.phone}>+91 {item.mobile}</Text>
                              </View>
                            </View>
                
                           
                            <TouchableOpacity
                  style={styles.dotsButton}
                  onPress={() => {
                    setShowReservedMenu(
                      showReservedMenu === index ? null : index
                    );
                    setShowOccupiedMenu(false);
                  }}
                >
                  <Image source={Dots} style={styles.dots} />
                </TouchableOpacity>
                
                          </View>
                
                          <View style={styles.infoRow}>
                            <Text style={styles.label}>Booking Amount</Text>
                            <Text style={styles.value}>₹  {item.bookingAmount}</Text>
                          </View>
                
                          <View style={styles.infoRow}>
                            <Text style={styles.label}>Check-In Date</Text>
                            <Text style={styles.value}> {item.joiningDate}</Text>
                          </View>
                
                          <View style={styles.infoRow}>
                            <Text style={styles.label}>Last Invoice</Text>
                            <Text style={styles.link}>{item.lastInvoiceNumber || "N/A"}
                </Text>
                          </View>
                           {showReservedMenu === index && (
                    <View style={styles.inlineMenu}>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleBookToCheckin}
                      >
                        <Image
                          style={styles.menuIconAdd}
                          source={require("../../../Assets/Images/add-circle.png")}
                        />
                        <Text style={styles.menuText}>Check-in</Text>
                      </TouchableOpacity>
                
                      <TouchableOpacity
                        style={styles.menuItem}
                      
                        onPress={() => handleMakeUsIn(item)}
                        
                        
                      >
                        <Image
                          style={styles.menuIcon}
                          source={require("../../../Assets/Images/Logout.png")}
                        />
                        <Text style={styles.menuText}>Make as Inactive</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                          
                </View>
                              )
                            })
                          }
                
                         
                
                         
                        </View>
                    </ScrollView>    

                <TouchableOpacity style={styles.statusBtn}>
                    <Text style={styles.statusText}>Occupied</Text>
                </TouchableOpacity>



            </Animated.View>
        </View>
     

   <InactiveTenantSheet
                  visible={showInactiveSheet}
                  onClose={() => setShowInactiveSheet(false)}
                  bookedItems={bookedItems}
              />
         
      
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute", left: 0, right: 0, top: 0, bottom: 25,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },

    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },

    handle: {
        width: 55,
        height: 5,
        backgroundColor: "#ccc",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 15,
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    title: { fontSize: 20, fontWeight: "700" },

    dots: { width: 28, height: 28 },

    // MENU POPUP
    menuWrapper: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        alignItems: "flex-end",
        zIndex: 10,
    },

    menuOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },

    popupMenu: {
        marginTop: 60,
        marginRight: 10,
        width: 200,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        elevation: 8,
    },

    popupItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        gap: 10,
    },

    menuIcon: { width: 20, height: 20 },

    popupText: { fontSize: 15, color: "#000" },

    // TAGS
    tagRow: { flexDirection: "row", gap: 10, marginTop: 15 },

    tag: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },

    tagText: { fontSize: 12, color: "#333" },

    sub: { marginTop: 20, color: "#000", fontSize: 14 },

    userRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10 },

    userImg: { width: 50, height: 50, borderRadius: 25 },

    userName: { fontSize: 16, fontWeight: "700" },

    phone: { fontSize: 13, color: "#555" },

    label: { marginTop: 15, fontSize: 12, color: "#777" },

    rowInfo: { flexDirection: "row", alignItems: "center", marginTop: 5 },

    icon: { width: 20, height: 20, marginRight: 8 },
    iconImg:{ width: 30, height: 30, marginRight: 8,},

    value: { fontSize: 15, fontWeight: "600", color: "#000" },

    statusBtn: {
        marginTop: 25,
        backgroundColor: "#E6F9EC",
        paddingVertical: 14,
        borderRadius: 15,
    },

    statusText: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "600",
        color: "#24A148",
    },
    inlineMenu: {
  position: "absolute",
  top: 48,     // instead of 40
  right: 0,
  backgroundColor: "#fff",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#E6E9F0",
  elevation: 6,
  paddingVertical: 6,
  zIndex: 999,
},
 menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  menuIcon: {
    width: 20,
    height: 20,
   
    marginRight: 10,
  },
  menuIconAdd:{
 width: 20,
    height: 20,
   tintColor:"#1E45E1",
    marginRight: 10,
  },

  menuText: { fontSize: 14, fontWeight: "500" },
   avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
     personRow: { flexDirection: "row", alignItems: "center", flex: 1 },
     name: { fontSize: 15, fontWeight: "600" },

  phone: { fontSize: 12, color: "#666" },

  dotsButton: { paddingHorizontal: 8 },
  section: {
    marginTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },

  sectionTitle: { fontSize: 13, fontWeight: "600", marginBottom: 8, color: "#555" },

 

});
