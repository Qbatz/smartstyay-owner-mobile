//this is old design 
import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TextInput,
    Image,
    Animated,
    PanResponder,
    TouchableOpacity,
    ScrollView,
    StyleSheet as RNStyleSheet
} from "react-native";

export default function SelfTransferSheet({ visible, onClose }) {
    if (!visible) return null;

    const translateY = useRef(new Animated.Value(0)).current;
    const [selectedBank, setSelectedBank] = useState(null);   // ⭐ FIXED (added missing state)

    useEffect(() => {
        translateY.setValue(0);
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) translateY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 120) {
                    Animated.timing(translateY, {
                        toValue: 700,
                        duration: 220,
                        useNativeDriver: true,
                    }).start(() => {
                        translateY.setValue(0);
                        onClose();
                    });
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View style={styles.overlay}>


            <TouchableWithoutFeedback onPress={onClose}>
                <View style={RNStyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>

            <Animated.View
                style={[styles.sheet, { transform: [{ translateY }] }]}
                {...panResponder.panHandlers}
            >
                <View style={styles.handle} />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <Text style={styles.title}>Self Transfer</Text>


                    <Text style={styles.sectionTitle}>From</Text>
                    <View style={styles.bankCard}>
                        <Image
                            source={require("../../../Assets/Images/bankBlue.png")}
                            style={styles.bankIcon}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.bankName}>Canara Bank</Text>
                            <Text style={styles.bankNumber}>4561 2013 6210 6540</Text>
                            <Text style={styles.bankType}>Savings A/C</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={styles.personName}>Immanuel</Text>
                            <Text style={styles.balance}>Avl Bal : 10,000.00</Text>
                        </View>
                    </View>


                    <Text style={styles.sectionTitle}>To</Text>


                    <TouchableOpacity
                        style={styles.bankCard}
                        onPress={() => setSelectedBank(1)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require("../../../Assets/Images/bankBlue.png")}
                            style={styles.bankIcon}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.bankName}>State Bank of India</Text>
                            <Text style={styles.bankNumber}>4561 2013 6210 6540</Text>
                            <Text style={styles.bankType}>Savings A/C</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={styles.personName}>Sriramkumar M</Text>
                            <Text style={styles.balance}>Avl Bal : 6,000.00</Text>
                        </View>


                        <View style={styles.radioOuter}>
                            {selectedBank === 1 && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.bankCard}
                        onPress={() => setSelectedBank(2)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require("../../../Assets/Images/bankBlue.png")}
                            style={styles.bankIcon}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.bankName}>ICICI</Text>
                            <Text style={styles.bankNumber}>4561 2013 6210 6540</Text>
                            <Text style={styles.bankType}>Savings A/C</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={styles.personName}>Smartstay PG</Text>
                            <Text style={styles.balance}>Avl Bal : 2,000.00</Text>
                        </View>


                        <View style={styles.radioOuter}>
                            {selectedBank === 2 && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>


                    <Text style={styles.sectionTitle}>Enter Amount</Text>
                    <TextInput
                        placeholder="₹ 0.00"
                        style={styles.input}
                        keyboardType="numeric"
                    />


                    <View style={styles.row}>
                        <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnTransfer}>
                            <Text style={styles.transferText}>Transfer</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
        zIndex: 9999,
    },

    sheet: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: "72%",
    },

    handle: {
        width: 55,
        height: 6,
        backgroundColor: "#cfcfcf",
        borderRadius: 20,
        alignSelf: "center",
        marginBottom: 20,
    },

    title: { fontSize: 22, fontWeight: "700", color: "#000" },

    sectionTitle: {
        marginTop: 15,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "600",
        color: "#1E55E6",
    },

    bankCard: {
        flexDirection: "row",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        alignItems: "center",
    },

    bankIcon: { width: 35, height: 35, marginRight: 12 },

    bankName: { fontSize: 16, fontWeight: "700" },
    bankNumber: { fontSize: 13, color: "#666" },
    bankType: { fontSize: 12, color: "#777" },

    personName: { fontSize: 14, fontWeight: "600" },
    balance: { fontSize: 12, color: "#1E55E6" },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 12,
        marginTop: 5,
        fontSize: 16,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 25,
    },

    btnCancel: {
        flex: 1,
        marginRight: 10,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
    },

    btnTransfer: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#577CFF",
        alignItems: "center",
    },

    cancelText: { fontSize: 16, color: "#000" },
    transferText: { fontSize: 16, color: "#fff", fontWeight: "700" },

    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#1E55E6",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },

    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: "#1E55E6",
    },
});
