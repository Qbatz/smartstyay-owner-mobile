// DoubleStatusSheet.js  (NO MODAL VERSION)
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function DoubleStatusSheet({
  visible,
  onClose,
  bed,
  room,
  onPressNotice,
  handleShowFinalSettlement,
  handleNoticeToBookin,
  handleReAssignBed,handleMakeUsInActive,handleCheckIn
}) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
   const navigation = useNavigation();

  const [showOccupiedMenu, setShowOccupiedMenu] = useState(false);
  const [showReservedMenu, setShowReservedMenu] = useState(false);

  const roomChip = room?.room_no ? `${room.room_no} - ${bed?.label || ""}` : "Room";

  /* ---------------- OPEN ---------------- */
  const openSheet = () => {
    translateY.setValue(SCREEN_HEIGHT);
    overlayOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();

    setShowOccupiedMenu(false);
    setShowReservedMenu(false);
  };
  const handleNewReserve=()=>{
    handleNoticeToBookin()
  }
  const handleFinalSettled = ()=>{
    handleShowFinalSettlement()
  }
const handleCancelNotice=()=>{
    handleReAssignBed()
}
const handleMakeUsIn=()=>{
  handleMakeUsInActive()
}
const handleBookToCheckin=()=>{
  handleCheckIn()
}

  /* ---------------- CLOSE ---------------- */
  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  useEffect(() => {
    if (visible) openSheet();
  }, [visible]);

  /* ---------------- SWIPE DOWN ---------------- */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          translateY.setValue(g.dy);
          overlayOpacity.setValue(1 - g.dy / SCREEN_HEIGHT);
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1) closeSheet();
        else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();

          Animated.timing(overlayOpacity, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <View style={styles.absoluteContainer} pointerEvents="box-none">
      
      {/* DIM BACKGROUND */}
      <TouchableWithoutFeedback onPress={closeSheet}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      {/* SHEET */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        {/* TITLE */}
        <Text style={styles.title}>Bed Status</Text>

        {/* CHIPS */}
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Ground Floor</Text>
          </View>
          <View style={[styles.chip, styles.chipSoft]}>
            <Text style={[styles.chipText, styles.chipSoftText]}>{roomChip}</Text>
          </View>
        </View>

        {/* OCCUPIED SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Occupied by</Text>

          <View style={styles.headerRow}>
            <View style={styles.personRow}>
              <Image
                source={require("../../../Assets/Images/Avatar.png")}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.name}>Daniel Jebakumar</Text>
                <Text style={styles.phone}>+91 98765 43210</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.dotsButton}
              onPress={() => {
                setShowOccupiedMenu(!showOccupiedMenu);
                setShowReservedMenu(false);
              }}
            >
              <Text style={styles.dots}>⋯</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Rental Amount</Text>
            <Text style={styles.value}>₹ 5,500</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Checkout Date</Text>
            <Text style={styles.value}>10 June 2024</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Last Invoice</Text>
            <Text style={styles.link}>INV-563 & 2 more</Text>
          </View>

          {showOccupiedMenu && (
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem} onPress={handleNewReserve}>
                <Image style={styles.menuIcon} source={require("../../../Assets/Images/NewBook.png")} />
                <Text style={styles.menuText}>New Booking</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleCancelNotice}>
                <Image style={styles.menuIcon} source={require("../../../Assets/Images/calendarremove.png")} />
                <Text style={styles.menuText}>Cancel Notice period</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleFinalSettled}>
                <Image style={styles.menuIcon} source={require("../../../Assets/Images/receipttext.png")} />
                <Text style={styles.menuText}>Generate FS</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* RESERVED SECTION */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={styles.sectionTitle}>Reserved by</Text>

          <View style={styles.headerRow}>
            <View style={styles.personRow}>
              <Image
                source={require("../../../Assets/Images/profile.png")}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.name}>Xavier</Text>
                <Text style={styles.phone}>+91 98765 43210</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.dotsButton}
              onPress={() => {
                setShowReservedMenu(!showReservedMenu);
                setShowOccupiedMenu(false);
              }}
            >
              <Text style={styles.dots}>⋯</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Booking Amount</Text>
            <Text style={styles.value}>₹ 5,500</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Check-In Date</Text>
            <Text style={styles.value}>10 June 2024</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Last Invoice</Text>
            <Text style={styles.link}>BK-563</Text>
          </View>

          {showReservedMenu && (
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem} onPress={handleBookToCheckin}>
                <Image style={styles.menuIconAdd} source={require("../../../Assets/Images/add-circle.png")} />
                <Text style={styles.menuText}>Check-in</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleMakeUsIn}>
                <Image style={styles.menuIcon} source={require("../../../Assets/Images/Logout.png")} />
                <Text style={styles.menuText}>Make as Inactive</Text>
              </TouchableOpacity>

            </View>
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.noticeBtn}>
            <Text style={styles.noticeText}>Notice Period</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reservedBtn}>
            <Text style={styles.reservedText}>Reserved</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.92,
  },

  handle: {
    width: 60,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 12,
  },

  title: { fontSize: 18, fontWeight: "700" },

  chipRow: { flexDirection: "row", marginTop: 10, marginBottom: 10, gap: 8 },

  chip: {
    backgroundColor: "#FFF3D9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  chipText: { fontSize: 11, fontWeight: "600", color: "#A0602C" },

  chipSoft: { backgroundColor: "#FFEAE8" },
  chipSoftText: { color: "#BF5555" },

  section: {
    marginTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },

  sectionTitle: { fontSize: 13, fontWeight: "600", marginBottom: 8, color: "#555" },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },

  personRow: { flexDirection: "row", alignItems: "center", flex: 1 },

  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },

  name: { fontSize: 15, fontWeight: "600" },

  phone: { fontSize: 12, color: "#666" },

  dotsButton: { paddingHorizontal: 8 },
  dots: { fontSize: 20, color: "#777" },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },

  label: { fontSize: 12, color: "#555" },
  value: { fontSize: 13, fontWeight: "600" },
  link: { fontSize: 13, fontWeight: "600", color: "#3562FF" },

  menuCard: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E9F0",
    elevation: 6,
    paddingVertical: 6,
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

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
   
  },

  noticeBtn: {
    flex: 1,
    backgroundColor: "#FFECEC",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginRight: 8,
  },

  noticeText: { color: "#E4503D", fontWeight: "700", fontSize: 14 },

  reservedBtn: {
    flex: 1,
    backgroundColor: "#EAF0FF",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginLeft: 8,
  },

  reservedText: { color: "#1E45E1", fontWeight: "700", fontSize: 14 },
});
