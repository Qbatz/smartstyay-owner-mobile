import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    Modal,BackHandler
} from "react-native";

import Profile from "../../../Assets/Images/profile.png";
import Dots from "../../../Assets/Images/3dots.png";
import RoomIcon from "../../../Assets/Images/room.png";
import BedIcon from "../../../Assets/Images/bed.png";

import EmailIcon from "../../../Assets/Images/email.png";
import PhoneIcon from "../../../Assets/Images/profile.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import AmountIcon from "../../../Assets/Images/profile.png";

export default function CheckoutList() {
    const [menuVisibleId, setMenuVisibleId] = useState(null);


    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [detailMenuVisible, setDetailMenuVisible] = useState(false);


    const customers = [
        {
            id: 1,
            month: "This Month",
            name: "Daniel Jebakumar",
            floor: "Ground Floor",
            room: "203",
            bed: "03",
            date: "01/06",
            img: Profile,
            email: "jebakumar001@gmail.com",
            phone: "+91 98765 43210",
            joinDate: "10 July 2025",
            bookingDate: "10 July 2025",
            amount: "500",
        },
    ];

    const sections = useMemo(() => {
        const map = {};
        customers.forEach((c) => {
            if (!map[c.month]) map[c.month] = [];
            map[c.month].push(c);
        });
        return Object.keys(map).map((month) => ({
            title: month,
            data: map[month],
        }));
    }, [customers]);

    const openCustomerDetails = (item) => {
        setSelectedCustomer(item);
        setShowCustomerModal(true);
    };

    const renderItem = ({ item }) => {
        const isMenuVisible = menuVisibleId === item.id;

        return (
            <View style={styles.card}>
                <View style={styles.leftRow}>
                    <TouchableOpacity onPress={() => openCustomerDetails(item)}>
                        <Image source={item.img} style={styles.avatar} />
                    </TouchableOpacity>

                    <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>

                        <View style={styles.row}>
                            <View style={styles.floorBadge}>
                                <Text style={styles.floorText}>{item.floor}</Text>
                            </View>

                            <View style={styles.iconRow}>
                                <Image source={RoomIcon} style={styles.icon} />
                                <Text style={styles.detailText}>{item.room}</Text>
                            </View>

                            <View style={styles.iconRow}>
                                <Image source={BedIcon} style={styles.icon} />
                                <Text style={styles.detailText}>{item.bed}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.rightCol}>
                    <TouchableOpacity
                        onPress={() =>
                            setMenuVisibleId(menuVisibleId === item.id ? null : item.id)
                        }
                    >
                        <Image
                            source={Dots}
                            style={{ width: 28, height: 28, transform: [{ rotate: "90deg" }] }}
                        />
                    </TouchableOpacity>


                    <Text style={styles.date}>{item.date}</Text>

                    {isMenuVisible && (
                        <View style={styles.popup}>
                            <TouchableOpacity
                                style={styles.popupItem}
                                onPress={() => setMenuVisibleId(null)}
                            >
                                <Text style={styles.popupText}>Re-Assign Bed</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.popupItem}
                                onPress={() => setMenuVisibleId(null)}
                            >
                                <Text style={styles.popupText}>Move to Notice Period</Text>
                            </TouchableOpacity>
                        </View>
                    )}


                </View>
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={() => setMenuVisibleId(null)}>
            <View style={{ flex: 1 }}>
                <SectionList
                    sections={sections}
                    renderItem={renderItem}
                    keyExtractor={(i) => i.id}
                    renderSectionHeader={({ section }) => (
                        <Text style={styles.monthText}>{section.title}</Text>
                    )}
                />
                <Modal
                    visible={showCustomerModal}
                    transparent
                    animationType="slide"
                >
                    <TouchableOpacity
                        style={styles.overlay}
                        activeOpacity={1}
                        onPress={() => setShowCustomerModal(false)}
                    >
                        <TouchableWithoutFeedback>
                            <View style={styles.sheet}>
                                <View style={styles.handle} />

                                <View style={styles.headerRow}>
                                    <Text style={styles.title}>Customer Details</Text>

                                    <TouchableOpacity style={styles.checkInBtn}>
                                        <Text style={styles.checkInText}>Check In</Text>

                                    </TouchableOpacity>
                                    {/* <TouchableOpacity
  onPress={() => setDetailMenuVisible(!detailMenuVisible)}
>
  <Image
    source={Dots}
    style={{ width: 24, height: 24, transform: [{ rotate: "90deg" }] }}
  />
</TouchableOpacity> */}

                                    {detailMenuVisible && (
                                        <TouchableWithoutFeedback onPress={() => setDetailMenuVisible(false)}>
                                            <View style={styles.outsideArea}>
                                                <TouchableWithoutFeedback>
                                                    <View style={styles.detailPopup}>
                                                        <TouchableOpacity style={styles.popupItem}>
                                                            <Text style={styles.popupText}>Cancel Notice</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity style={styles.popupItem}>
                                                            <Text style={styles.popupText}>Generate FI</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )}




                                </View>

                                {/* Profile */}
                                <View style={styles.profileRow}>
                                    <Image
                                        source={selectedCustomer?.img}
                                        style={styles.profileImg}
                                    />

                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={styles.profileName}>
                                            {selectedCustomer?.name}
                                        </Text>

                                        <View style={styles.badgeRow}>
                                            <View style={styles.badge}>
                                                <Text style={styles.badgeText}>
                                                    {selectedCustomer?.floor}
                                                </Text>
                                            </View>

                                            <View style={styles.iconInline}>
                                                <Image source={RoomIcon} style={styles.inlineIcon} />
                                                <Text>{selectedCustomer?.room}</Text>
                                            </View>

                                            <View style={styles.iconInline}>
                                                <Image source={BedIcon} style={styles.inlineIcon} />
                                                <Text>{selectedCustomer?.bed}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <Text style={styles.label}>Email ID</Text>
                                <View style={styles.infoRow}>
                                    <Image source={EmailIcon} style={styles.infoIcon} />
                                    <Text style={styles.value}>{selectedCustomer?.email}</Text>
                                </View>

                                <Text style={styles.label}>Contact Number</Text>
                                <View style={styles.infoRow}>
                                    <Image source={PhoneIcon} style={styles.infoIcon} />
                                    <Text style={styles.value}>{selectedCustomer?.phone}</Text>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.rowBetween}>
                                    <View>
                                        <Text style={styles.label}>Joining Date (Tentative)</Text>
                                        <View style={styles.infoRow}>
                                            <Image source={CalendarIcon} style={styles.infoIcon} />
                                            <Text style={styles.value}>
                                                {selectedCustomer?.joinDate}
                                            </Text>
                                        </View>
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Booking Date</Text>
                                        <View style={styles.infoRow}>
                                            <Image source={CalendarIcon} style={styles.infoIcon} />
                                            <Text style={styles.value}>
                                                {selectedCustomer?.bookingDate}
                                            </Text>
                                        </View>
                                    </View>
                                </View>


                                <Text style={styles.label}>Booking Amount</Text>
                                <View style={styles.infoRow}>
                                    <Image source={AmountIcon} style={styles.infoIcon} />
                                    <Text style={styles.value}>₹ {selectedCustomer?.amount}</Text>
                                </View>


                                <Text style={styles.statusBtn}>In Active</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
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
    }


});
