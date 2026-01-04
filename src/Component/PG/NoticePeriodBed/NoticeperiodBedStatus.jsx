import React, { useRef, useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  PanResponder, BackHandler
} from "react-native";
import Profile from "../../../Assets/Images/Avatar.png";
import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";
import { useFocusEffect } from "@react-navigation/native";


export default function NoticePeriodBedSheet({
  visible,
  onClose,
  bed,
  room,
  tenant, onClick, onFinalSheet, cancelNoticePeriod, handleEditBed, selectedBed, handleNoticeToCheckout
}) {
  const translateY = useRef(new Animated.Value(500)).current;
  const { activeHostelId } = useContext(CommonContexts);
  const { getCustomersByHostel, loading } = useCustomer();
  const [menuVisible, setMenuVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
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
  console.log("customers123", customers)
  const matchedCustomer = customers.find(
    c => c.customerId === selectedBed?.currentTenantInfo[0]?.tenetId
  );
console.log("matchedCustomer",matchedCustomer)
 

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


  if (!visible) return null;

  return (
    <>

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
            <View style={styles.dropdown}>


              {matchedCustomer?.currentStatus === "Settlement Generated" ? (
                <TouchableOpacity style={styles.menuItem} onPress={handleCheckoutSheet}>
                  <Image
                    source={require("../../../Assets/Images/NewBook.png")}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>Checkout</Text>
                </TouchableOpacity>
              ) : (
                <>
                  {/* Normal menu items */}
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleNoticeToBooking}
                  >
                    <Image
                      source={require("../../../Assets/Images/NewBook.png")}
                      style={styles.menuIcon}
                    />
                    <Text style={styles.menuText}>New Booking</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleCancelNoticePeriod}
                  >
                    <Image
                      source={require("../../../Assets/Images/calendarremove.png")}
                      style={styles.menuIcon}
                    />
                    <Text style={styles.menuText}>Cancel Notice period</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleFinalSettledment}
                  >
                    <Image
                      source={require("../../../Assets/Images/receipttext.png")}
                      style={styles.menuIcon}
                    />
                    <Text style={styles.menuText}>Generate FS</Text>
                  </TouchableOpacity>


                </>
              )}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleEdit}
              >
                <Image
                  source={require("../../../Assets/Images/editIcon.png")}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}


          <Text style={styles.label}>Occupied by</Text>

          <View style={styles.profileRow}>
            <Image source={Profile} style={styles.profileImg} />
            <View>
              <Text style={styles.tenantName}>{selectedBed.currentTenantInfo[0]?.tenantFullName}</Text>
              <Text style={styles.tenantPhone}>+91{selectedBed.currentTenantInfo[0]?.mobile}</Text>
            </View>
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
            <Text style={styles.dateText}>{selectedBed.currentTenantInfo[0]?.joiningDate}</Text>
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
    paddingBottom: 40,
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

  title: { fontSize: 18, fontWeight: "700" },

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

  tagText: { fontSize: 12, fontWeight: "600", color: "#333" },

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
    backgroundColor: "transparent",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    right: 20,
    top: 105,
    backgroundColor: "#fff",
    width: 190,
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  menuIcon: { width: 18, height: 18, marginRight: 10 },

  menuText: { fontSize: 14, color: "#333" },

  label: { fontSize: 14, color: "#666", marginTop: 12 },

  profileRow: { flexDirection: "row", marginTop: 6, alignItems: "center" },

  profileImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eee",
    marginRight: 10,
  },

  tenantName: { fontSize: 16, fontWeight: "700" },

  tenantPhone: { fontSize: 13, color: "#666" },

  amount: { fontSize: 17, fontWeight: "700", marginTop: 4 },

  dateRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },

  icon: { width: 18, height: 18, marginRight: 8 },

  dateText: { fontSize: 14, fontWeight: "600" },

  noticeBtn: {
    backgroundColor: "#FFE5E5",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
  },

  noticeText: { color: "#D9534F", fontSize: 15, fontWeight: "700" },
});
