import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    Animated,
    PanResponder,
    TouchableOpacity,
    Image,
    StyleSheet, TouchableWithoutFeedback,BackHandler
} from "react-native";
import Profile from "../../../Assets/Images/Avatar.png";
import Calendar from "../../../Assets/Images/calendar_blue.png";
import Money from "../../../Assets/Images/money.png";
import Checkin from "../../../Assets/Images/add-circle.png";
import MakeUs from "../../../Assets/Images/Logout.png";
import Dots from "../../../Assets/Images/3dots.png";
import InactiveTenantSheet from "../ReservedBed/MakeUsInActiveSheet";
import { useNavigation } from "@react-navigation/native";


export default function ReservedBedBottomSheet({ visible, onClose,selectTap }) {
     const navigation = useNavigation();
    const translateY = useRef(new Animated.Value(300)).current;
    const [menuOpen, setMenuOpen] = useState(false);
    const [showInactiveSheet,setShowInactiveSheet] =useState(false)
      useEffect(() => {
        if (selectTap) {
         selectTap(!showInactiveSheet);
        }
      }, [showInactiveSheet]);

      useEffect(() => {
          const onBack = () => {
            if (showInactiveSheet) {
              setShowInactiveSheet(false);
              return true;
            }
           
      
          
            return false;
          };
          const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
          return () => sub.remove();
        }, [showInactiveSheet]);

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
    }, [visible]);


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

   if (!visible) {
  return (
    <InactiveTenantSheet
      visible={showInactiveSheet}
      onClose={() => setShowInactiveSheet(false)}
    />
  );
}


    return (
        <>
        <View style={styles.overlay}>
            <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />

            <Animated.View
                style={[styles.sheet, { transform: [{ translateY }] }]}
                {...panResponder.panHandlers}
            >

                <View style={styles.handle} />


                <View style={styles.headerRow}>
                    <Text style={styles.title}>Bed Status</Text>


                    <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>

                        <Image source={Dots} style={styles.dots} />
                    </TouchableOpacity>
                </View>


                {menuOpen && (
                    <View style={styles.menuWrapper} pointerEvents="box-none">

                        {/* BACKDROP CLICK → CLOSE */}
                        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
                            <View style={styles.overlayMenu} />
                        </TouchableWithoutFeedback>

                        {/* POPUP */}
                        <View style={styles.popupMenu}>
                            <TouchableOpacity style={styles.popupItem} onPress={() => navigation.navigate("ReserveToCheckin")}>
                                <View style={styles.row}>
                                    <Image source={Checkin} style={styles.iconCheck} />
                                    <Text style={styles.popupText}>Check-In</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.popupItem}  onPress={() => {
  setMenuOpen(false);

  // Step 1: Close Reserved Sheet
  onClose();

  // Step 2: Open Inactive sheet after animation delay
  setTimeout(() => {
    setShowInactiveSheet(true);
  }, 250); // same as animation duration
}}
>
                                <View style={styles.row}>
                                    <Image source={MakeUs} style={styles.icon} />
                                    <Text style={styles.popupText}>Make as Inactive</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}



                {/* TAGS */}
                <View style={styles.tagRow}>
                    <View style={[styles.tag, { backgroundColor: "#FDEBC8" }]}>
                        <Text style={styles.tagText}>Ground Floor</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: "#FFD6D6" }]}>
                        <Text style={styles.tagText}>002 - F</Text>
                    </View>
                </View>

                <Text style={styles.sub}>Reserved by</Text>


                <View style={styles.userRow}>
                    <Image
                        source={Profile}
                        style={styles.userImg}
                    />

                    <View>
                        <Text style={styles.userName}>Daniel Jebakumar</Text>
                        <Text style={styles.phone}>+91 98765 43210</Text>
                    </View>
                </View>


                <View style={{ marginTop: 15 }}>
                    <Text style={styles.infoLabel}>Booked Date</Text>

                    <View style={styles.amountRow}>
                        <Image source={Calendar} style={styles.amountIcon} />
                        <Text style={styles.amountText}>10 June 2024</Text>
                    </View>
                </View>


                <View style={{ marginTop: 15 }}>
                    <Text style={styles.infoLabel}>Booking Amount</Text>

                    <View style={styles.amountRow}>
                        <Image source={Money} style={styles.amountIcon} />
                        <Text style={styles.amountText}>₹ 500</Text>
                    </View>
                </View>



                <View style={{ marginTop: 15 }}>
                    <Text style={styles.infoLabel}>Joining Date</Text>

                    <View style={styles.amountRow}>
                        <Image source={Calendar} style={styles.amountIcon} />
                        <Text style={styles.amountText}>10 June 2024</Text>
                    </View>
                </View>


                <TouchableOpacity style={styles.reservedBtn}>
                    <Text style={styles.resText}>Reserved</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
        <InactiveTenantSheet
  visible={showInactiveSheet}
  onClose={() => setShowInactiveSheet(false)}
/>

        </>
    );
}


const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        left: 0, right: 0, top: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },

    overlayTouch: {
        flex: 1,
    },

    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
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
        fontWeight: "700",
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
        marginTop: 20,
        color: "#000000",
        fontSize: 14,
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
        marginTop: 25,
        backgroundColor: "#EAF0FF",
        paddingVertical: 14,
        borderRadius: 20,
    },

    resText: {
        fontSize: 16,
        textAlign: "center",
        color: "#1E45E1",
        fontWeight: "600",
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
        fontWeight: "600",
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



});
