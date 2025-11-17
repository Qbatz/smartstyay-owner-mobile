import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    Modal,
} from "react-native";

import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

import CalendarIcon from "../../Assets/Images/calendar.png";
import Profile from "../../Assets/Images/profile.png";

export default function MoveNoticeModal({
    visible,
    onClose,
    onMove,
    tenant,
    requestDate,
    checkoutDate,
    reason,
    setRequestDate,
    setCheckoutDate,
    setReason,
}) {
    if (!tenant) return null;

    const [openRequestPicker, setOpenRequestPicker] = useState(false);
    const [openCheckoutPicker, setOpenCheckoutPicker] = useState(false);

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}   
            >
                <View style={styles.overlay}>
                    <View style={styles.sheet}>
                        <View style={styles.handle} />

                        <Text style={styles.title}>Move to Notice Period?</Text>

                        <Text style={styles.noticeDays}>
                            Notice Days : <Text style={{ color: "#2D6CDF" }}>30</Text>
                        </Text>

                        {/* Tenant Info */}
                        <View style={styles.profileRow}>
                            <Image source={tenant.img || Profile} style={styles.profileImg} />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={styles.name}>{tenant.name}</Text>
                                <View style={styles.badgeRow}>
                                    <View style={styles.badgeYellow}>
                                        <Text style={styles.badgeText}>{tenant.floor}</Text>
                                    </View>
                                    <View style={styles.badgeRed}>
                                        <Text style={styles.badgeText}>
                                            {tenant.room} - {tenant.bed}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                           
                            <Text style={styles.label}>Request Date</Text>

                            <TouchableOpacity
                                style={styles.inputBox}
                                onPress={() => setOpenRequestPicker(true)}
                            >
                                <Text style={styles.textInput}>
                                    {requestDate || "Select Request Date"}
                                </Text>
                                <Image source={CalendarIcon} style={styles.calendarIcon} />
                            </TouchableOpacity>

                            {/* Checkout Date Input */}
                            <Text style={styles.label}>Checkout Date</Text>

                            <TouchableOpacity
                                style={styles.inputBox}
                                onPress={() => setOpenCheckoutPicker(true)}
                            >
                                <Text style={styles.textInput}>
                                    {checkoutDate || "Select Checkout Date"}
                                </Text>
                                <Image source={CalendarIcon} style={styles.calendarIcon} />
                            </TouchableOpacity>


                            <Text style={styles.label}>Reason (Comments)</Text>
                            <TextInput
                                style={styles.textArea}
                                value={reason}
                                placeholder="Enter Reason"
                                onChangeText={setReason}
                                multiline
                            />
                        </ScrollView>

                        {/* Buttons */}
                        <View style={styles.footer}>
                            <TouchableOpacity onPress={onClose}>
                                <Text style={styles.cancel}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.moveBtn} onPress={onMove}>
                                <Text style={styles.moveText}>Move</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* ----------- Request Date Calendar ----------- */}
                <Modal visible={openRequestPicker} transparent animationType="fade">
                    <View style={styles.calendarOverlay}>
                        <View style={styles.calendarBox}>
                            <DatePicker
                                mode="single"
                                date={dayjs()}
                                onChange={(p) => {
                                    setRequestDate(dayjs(p.date).format("DD/MM/YYYY"));
                                    setOpenRequestPicker(false);
                                }}
                            />
                        </View>
                    </View>
                </Modal>

                {/* ----------- Checkout Date Calendar ----------- */}
                <Modal visible={openCheckoutPicker} transparent animationType="fade">
                    <View style={styles.calendarOverlay}>
                        <View style={styles.calendarBox}>
                            <DatePicker
                                mode="single"
                                date={dayjs()}
                                onChange={(p) => {
                                    setCheckoutDate(dayjs(p.date).format("DD/MM/YYYY"));
                                    setOpenCheckoutPicker(false);
                                }}
                            />
                        </View>
                    </View>

                </Modal>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        maxHeight: "80%",
    },
    handle: {
        width: 60,
        height: 4,
        backgroundColor: "#D1D5DB",
        alignSelf: "center",
        borderRadius: 50,
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
    },
    noticeDays: {
        fontSize: 14,
        color: "#6B7280",
        marginVertical: 10,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 15,
    },
    profileImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    name: { fontSize: 16, fontWeight: "600" },
    badgeRow: { flexDirection: "row", marginTop: 5 },
    badgeYellow: {
        backgroundColor: "#FFF6CC",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 6,
    },
    badgeRed: {
        backgroundColor: "#FFD6D6",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: { fontSize: 12, color: "#111" },
    label: {
        fontSize: 13,
        color: "#111",
        marginTop: 12,
        marginBottom: 5,
    },
    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 48,
    },
    textInput: { flex: 1, fontSize: 14, color: "#111" },
    calendarIcon: { width: 20, height: 20 },
    textArea: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        padding: 12,
        minHeight: 80,
        fontSize: 14,
        textAlignVertical: "top",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    cancel: {
        fontSize: 16,
        color: "#6B7280",
        paddingVertical: 10,
    },
    moveBtn: {
        backgroundColor: "#2D6CDF",
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 10,
    },
    moveText: { color: "#fff", fontSize: 16, fontWeight: "600" },

    /* Calendar Popup */
    calendarOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 20,
    },
    calendarBox: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 10,
    },
});
