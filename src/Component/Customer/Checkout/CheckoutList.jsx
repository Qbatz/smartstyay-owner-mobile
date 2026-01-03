import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
} from "react-native";

import Profile from "../../../Assets/Images/profile.png";
import Dots from "../../../Assets/Images/3dots.png";
import RoomIcon from "../../../Assets/Images/room.png";
import BedIcon from "../../../Assets/Images/bed.png";
import EmailIcon from "../../../Assets/Images/email.png";
import PhoneIcon from "../../../Assets/Images/profile.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import AmountIcon from "../../../Assets/Images/profile.png";
import Loader from "../../Loader/Loader";
import EmptyState from "../../../Assets/Images/Empty_state.png";

import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";

export default function CheckoutList() {
  const { activeHostelId } = useContext(CommonContexts);
  const { getCheckoutCustomersByHostel, loading } = useCustomer();

  const [checkoutCustomer, setCheckoutCustomer] = useState([]);
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    if (activeHostelId) {
      fetchCheckoutCustomers();
    }
  }, [activeHostelId]);

  const fetchCheckoutCustomers = async () => {
    const data = await getCheckoutCustomersByHostel(activeHostelId);
    setCheckoutCustomer(data?.checkoutCustomers || []);
  };

  const openCustomerDetails = (item) => {
    setSelectedCustomer(item);
    setShowCustomerModal(true);
  };

  return (
    <>
      {loading && <Loader />}
    <TouchableWithoutFeedback onPress={() => setMenuVisibleId(null)}>
      <View style={{ flex: 1 }}>

      

        {!loading && checkoutCustomer.length === 0 && (
         <View style={styles.emptyContainer}>
                          <Image source={EmptyState} style={styles.emptyImage} />
                          <Text style={styles.emptyText}>No Data Found</Text>
                        </View>
        )}

        <ScrollView>
          {checkoutCustomer.map((item) => {
            const isMenuVisible = menuVisibleId === item.customerId;

            return (
              <View key={item.customerId} style={styles.card}>
                <View style={styles.leftRow}>
                  <TouchableOpacity onPress={() => openCustomerDetails(item)}>
                    <Image source={Profile} style={styles.avatar} />
                  </TouchableOpacity>

                  <View style={styles.info}>
                    <Text style={styles.name}>{item.firstName}</Text>

                    <View style={styles.row}>
                      <View style={styles.floorBadge}>
                        <Text style={styles.floorText}>
                          {item.floorName}
                        </Text>
                      </View>

                      <View style={styles.iconRow}>
                        <Image source={RoomIcon} style={styles.icon} />
                        <Text style={styles.detailText}>
                          {item.roomName}
                        </Text>
                      </View>

                      <View style={styles.iconRow}>
                        <Image source={BedIcon} style={styles.icon} />
                        <Text style={styles.detailText}>
                          {item.bedName}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.rightCol}>
                  <TouchableOpacity
                    onPress={() =>
                      setMenuVisibleId(
                        isMenuVisible ? null : item.customerId
                      )
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
                  </TouchableOpacity>

                  <Text style={styles.date}>
                    {item.checkoutDate}
                  </Text>

                  {isMenuVisible && (
                    <View style={styles.popup}>
                      <TouchableOpacity style={styles.popupItem}>
                        <Text style={styles.popupText}>
                          Re-Assign Bed
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.popupItem}>
                        <Text style={styles.popupText}>
                          Move to Notice Period
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* CUSTOMER DETAILS MODAL */}
        <Modal visible={showCustomerModal} transparent animationType="slide">
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setShowCustomerModal(false)}
          >
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <View style={styles.handle} />

                <Text style={styles.title}>Customer Details</Text>

                <View style={styles.profileRow}>
                  <Image source={Profile} style={styles.profileImg} />
                  <Text style={styles.profileName}>
                    {selectedCustomer?.customerName}
                  </Text>
                </View>

                <Text style={styles.label}>Email</Text>
                <View style={styles.infoRow}>
                  <Image source={EmailIcon} style={styles.infoIcon} />
                  <Text>{selectedCustomer?.email}</Text>
                </View>

                <Text style={styles.label}>Mobile</Text>
                <View style={styles.infoRow}>
                  <Image source={PhoneIcon} style={styles.infoIcon} />
                  <Text>{selectedCustomer?.mobile}</Text>
                </View>

                <Text style={styles.label}>Checkout Date</Text>
                <View style={styles.infoRow}>
                  <Image source={CalendarIcon} style={styles.infoIcon} />
                  <Text>{selectedCustomer?.checkoutDate}</Text>
                </View>

                <Text style={styles.label}>Amount</Text>
                <View style={styles.infoRow}>
                  <Image source={AmountIcon} style={styles.infoIcon} />
                  <Text>₹ {selectedCustomer?.amount}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
    </>
  );
}


const styles = StyleSheet.create({
    monthText: { marginLeft: 6, color: "#9CA3AF", marginVertical: 10 },
    card: { padding: 12, flexDirection: "row", justifyContent: "space-between" },
    leftRow: { flexDirection: "row" },
    avatar: { width: 45, height: 45, borderRadius: 25 },
    info: { marginLeft: 12 },
    name: { fontWeight: "700", fontSize: 15 },
    row: { flexDirection: "row", marginTop: 4 },
    floorBadge: { backgroundColor: "#F1F5FF", padding: 5, borderRadius: 6 },
    floorText: { color: "#2D6CDF", fontSize: 11 },
    iconRow: { flexDirection: "row", marginLeft: 6 },
    icon: { width: 16, height: 16, marginRight: 3 },
    detailText: { fontSize: 12 },
    rightCol: { alignItems: "flex-end" },
    date: { color: "#999", fontSize: 11, marginTop: 5 },
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

    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    sheet: {
        backgroundColor: "#fff",
        padding: 20,
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

    headerRow: { flexDirection: "row", justifyContent: "space-between" },
    title: { fontSize: 18, fontWeight: "700" },

    checkInBtn: {
        backgroundColor: "#2D6CDF",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    checkInText: {
        color: "#fff",
        fontSize: 13,
    },

    profileRow: {
        flexDirection: "row",
        marginTop: 20,
        alignItems: "center",
    },
    profileImg: { width: 55, height: 55, borderRadius: 30 },
    profileName: { fontSize: 17, fontWeight: "700" },

    badgeRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
    badge: {
        backgroundColor: "#F1F5FF",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,
    },
    badgeText: { color: "#2D6CDF", fontSize: 12 },
    inlineIcon: {
        width: 14,
        height: 14,
        marginRight: 4,
    },
    iconInline: { flexDirection: "row", alignItems: "center", marginRight: 8 },

    label: { fontSize: 13, color: "#6B7280", marginTop: 12 },
    infoRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    infoIcon: { width: 16, height: 16, marginRight: 6 },
    value: { fontSize: 14, color: "#111" },

    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginVertical: 20,
    },

    rowBetween: { flexDirection: "row", justifyContent: "space-between" },

    statusBtn: {
        borderWidth: 1,
        borderColor: "#FF8A00",
        color: "#FF8A00",
        padding: 12,
        marginTop: 20,
        textAlign: "center",
        fontWeight: "600",
        borderRadius: 12,
    },
    detailPopup: {
        position: "absolute",
        right: 0,
        top: 40,
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        elevation: 10,
        zIndex: 999,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        width: 160
    },
    outsideArea: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 999,
        justifyContent: "flex-start",
        alignItems: "flex-end",
    },


    popupItem: {
        paddingVertical: 10,
    },

    popupText: {
        fontSize: 14,
        color: "#111",
        fontWeight: "500",
    },
    menuOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "transparent",
        zIndex: 50,
    },
     emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150,
  },

  emptyImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    opacity: 0.8
  },

  emptyText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
  },



});
