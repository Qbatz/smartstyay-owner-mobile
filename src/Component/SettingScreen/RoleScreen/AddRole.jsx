// AddCategorySheet.js
import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    PanResponder,
    ScrollView,
    Image,
    TextInput,BackHandler
} from "react-native";
import DownArrow from "../../../Assets/Images/direction-down.png";

export default function AddCategorySheet({ onClose, editData }) {
    const translateY = useRef(new Animated.Value(600)).current;
    const [roleOpen, setRoleOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const roles = ["Accounts Manager", "Office Admin", "Hostel Manager", "Staff"];

    
// 🔥 Close Sheet When Android Back Button Pressed
useEffect(() => {
  const backAction = () => {
    handleClose();  // close bottom sheet
    return true;    // prevent default exit
  };

  const handler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => handler.remove();
}, []);


    const permissions = [
        "Dashboard",
        "Announcement",
        "Updates",
        "All customers",
        "Bookings",
        "Checkout",
        "Walk on",
        "Asset",
        "Vendor",
        "Bills",
        "Recurring Bills",
        "Customer Reading",
    ];

    // ==== STATE FOR CHECKBOXES ====
    const [permState, setPermState] = useState(
        permissions.map(() => ({
            add: false,
            read: false,
            edit: false,
            del: false,
        }))
    );

    const toggle = (rowIndex, key) => {
        setPermState((prev) => {
            const updated = [...prev];
            updated[rowIndex][key] = !updated[rowIndex][key];
            return updated;
        });
    };

    // ==== TICKBOX COMPONENT ====
    const TickBox = ({ checked, onPress }) => {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={[
                    styles.tickBox,
                    {
                        borderColor: checked ? "#1DBF73" : "#AFAFAF",
                        backgroundColor: checked ? "#1DBF73" : "white",
                    },
                ]}
            >
                {checked && <Text style={styles.tickMark}>✓</Text>}
            </TouchableOpacity>
        );
    };

    // ====== ANIMATION ======
    useEffect(() => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleClose = () => {
        Animated.timing(translateY, {
            toValue: 600,
            duration: 220,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
        onPanResponderMove: (_, g) => {
            if (g.dy > 0) translateY.setValue(g.dy);
        },
        onPanResponderRelease: (_, g) => {
            if (g.dy > 120) handleClose();
            else Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        },
    });

    return (
        <View style={styles.overlay}>
            <Animated.View
                style={[styles.sheet, { transform: [{ translateY }] }]}
                {...panResponder.panHandlers}
            >
                <View style={styles.handle} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>{editData ? "Edit Categotry" : "Add Categotry"}</Text>

                    {/* ROLE NAME */}
                    <Text style={styles.label}>Role *</Text>

                    <TouchableOpacity
                        style={styles.dropdownBox}
                        onPress={() => setRoleOpen(!roleOpen)}
                    >
                        <Text style={{ color: selectedRole ? "#000" : "#9CA3AF" }}>
                            {selectedRole || "Select a role"}
                        </Text>

                        <Image
                            source={DownArrow}
                            style={styles.arrowIcon}
                        />
                    </TouchableOpacity>
                    {roleOpen && (
                        <View style={styles.dropdownMenu}>
                            <ScrollView style={{ maxHeight: 150 }}>
                                {roles.map((v, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.option}
                                        onPress={() => {
                                            setSelectedRole(v);
                                            setRoleOpen(false);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{v}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                 
                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Manage all except Banking & Finance"
                        multiline
                    />

                    {/* PERMISSION TABLE */}
                    <View style={styles.tableWrapper}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View>
                                {/* HEADER */}
                                <View style={styles.headerRow}>
                                    <Text style={styles.permissionFixedHeader}>Permission</Text>

                                    <View style={styles.headerRight}>
                                        <View style={styles.headerCell}><Text style={styles.headerLabel}>Add</Text></View>
                                        <View style={styles.headerCell}><Text style={styles.headerLabel}>Read</Text></View>
                                        <View style={styles.headerCell}><Text style={styles.headerLabel}>Edit</Text></View>
                                        <View style={styles.headerCell}><Text style={styles.headerLabel}>Delete</Text></View>
                                    </View>
                                </View>

                                {/* BODY */}
                                <ScrollView style={{ maxHeight: 380 }}>
                                    {permissions.map((p, i) => (
                                        <View key={i} style={styles.row}>
                                            {/* FIXED LEFT COLUMN */}
                                            <Text style={styles.permissionFixed}>{p}</Text>

                                            {/* SCROLLABLE CHECKBOXES */}
                                            <View style={styles.rightRow}>
                                                <TickBox
                                                    checked={permState[i].add}
                                                    onPress={() => toggle(i, "add")}
                                                />
                                                <TickBox
                                                    checked={permState[i].read}
                                                    onPress={() => toggle(i, "read")}
                                                />
                                                <TickBox
                                                    checked={permState[i].edit}
                                                    onPress={() => toggle(i, "edit")}
                                                />
                                                <TickBox
                                                    checked={permState[i].del}
                                                    onPress={() => toggle(i, "del")}
                                                />
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>

                    {/* SAVE BUTTON */}
                    <TouchableOpacity style={styles.saveBtn}>
                        <Text style={styles.saveText}>Save Category</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Animated.View>
        </View>
    );
}

// ====== STYLES ======
const styles = StyleSheet.create({
    overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
    sheet: { backgroundColor: "#fff", borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, height: "92%" },
    handle: { width: 60, height: 5, backgroundColor: "#ccc", borderRadius: 4, alignSelf: "center", marginBottom: 15 },
    title: { fontSize: 18, fontWeight: "700" },

    label: { marginTop: 18, fontSize: 14, fontWeight: "600" },
    inputBox: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14, marginTop: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    downIcon: { width: 18, height: 18, tintColor: "#666" },

    textArea: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14, height: 70, marginTop: 6 },

    /* TABLE */
    tableWrapper: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 12, marginTop: 20, overflow: "hidden" },
    headerRow: { flexDirection: "row", backgroundColor: "#E8ECFF", paddingVertical: 12, paddingHorizontal: 10, alignItems: "center" },
    permissionFixedHeader: { width: 150, fontSize: 13, fontWeight: "700", color: "#555" },

    headerRight: { flexDirection: "row" },
    headerCell: { width: 90, alignItems: "center", paddingRight: 15 },
    headerLabel: { fontSize: 13, fontWeight: "600" },

    row: { flexDirection: "row", paddingVertical: 14, borderBottomWidth: 1, borderColor: "#f1f1f1" },
    permissionFixed: { width: 150, fontSize: 14, color: "#333", paddingHorizontal: 10 },

    rightRow: { flexDirection: "row", alignItems: "center" },

    tickBox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30,
    },
    tickMark: { fontSize: 16, color: "#fff", fontWeight: "bold" },

    saveBtn: { backgroundColor: "#1D5BEE", paddingVertical: 14, borderRadius: 10, marginTop: 20 },
    saveText: { textAlign: "center", color: "#fff", fontSize: 16, fontWeight: "600" },


    dropdownBox: {
        borderWidth: 1,
        borderColor: "#D4D4D4",
        borderRadius: 10,
        padding: 14,
        marginTop: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    arrowIcon: {
        width: 18,
        height: 18,
        tintColor: "#6A6A6A",
    },

    dropdownList: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 10,
        backgroundColor: "#fff",
        overflow: "hidden",
    },

    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    dropdownText: {
        fontSize: 15,
    },
    dropdownMenu: {
        position: "absolute",
        left: 0,
        right: 0,
        top: "17%",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        zIndex: 999,
        elevation: 10,
    },


    option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    optionText: {
        fontSize: 15,
        color: "#000",
    },

});
