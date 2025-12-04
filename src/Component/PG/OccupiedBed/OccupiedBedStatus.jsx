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

export default function OccupiedBedSheet({ visible, onClose, bed, room , onMoveToNotice ,onReAssign }) {
    const translateY = useRef(new Animated.Value(300)).current;
    
    // const [showNotice, setShowNotice] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
// const [reqDate, setReqDate] = useState("31/07/2025");
// const [outDate, setOutDate] = useState("30/08/2025");
// const [reason, setReason] = useState("");

const handleMoveClick = () => {
  setMenuOpen(false);
  onClose();          // close occupied sheet
  onMoveToNotice();   // tell parent to open notice period
};

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

         
            <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>

                <View style={styles.handle} />

              
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Bed Status</Text>

                    <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
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
                        </View>
                    </View>
                )}

                {/* FLOOR + BED TAG */}
                <View style={styles.tagRow}>
                    <View style={[styles.tag, { backgroundColor: "#FDEBC8" }]}>
                        <Text style={styles.tagText}>Ground Floor</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: "#FFD6D6" }]}>
                        <Text style={styles.tagText}>{room?.room_no} - {bed?.label}</Text>
                    </View>
                </View>

                {/* Occupied By */}
                <Text style={styles.sub}>Occupied by</Text>

                <View style={styles.userRow}>
                    <Image source={Profile} style={styles.userImg} />
                    <View>
                        <Text style={styles.userName}>Daniel Jebakumar</Text>
                        <Text style={styles.phone}>+91 98765 43210</Text>
                    </View>
                </View>

                {/* RENTAL AMOUNT */}
                <Text style={styles.label}>Rental Amount</Text>
                <View style={styles.rowInfo}>
                    <Image source={Money} style={styles.icon} />
                    <Text style={styles.value}>₹ 5,500</Text>
                </View>

                {/* JOINED DATE */}
                <Text style={styles.label}>Joined Date</Text>
                <View style={styles.rowInfo}>
                    <Image source={Calendar} style={styles.icon} />
                    <Text style={styles.value}>10 June 2024</Text>
                </View>

              
                <Text style={styles.label}>Last Invoice</Text>
                <View style={styles.rowInfo}>
                    <Image source={Invoice} style={styles.icon} />
                    <Text style={styles.value}>INV-563 & 2 more</Text>
                </View>

                <TouchableOpacity style={styles.statusBtn}>
                    <Text style={styles.statusText}>Occupied</Text>
                </TouchableOpacity>

            </Animated.View>
        </View>
     

  
         
      
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
    }
});
