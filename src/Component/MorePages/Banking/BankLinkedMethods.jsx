import React, { useState, useEffect, useRef, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Image,
    ScrollView, Platform, FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function BankLinkedMethods() {

    const navigation = useNavigation()

    const paymentMethods = [
        {
            id: 1,
            title: "Gpay UPI",
            value: "smartstay@oksbi",
            type: "UPI",
            icon: require("../../../Assets/Images/GpayIcon.png"),
        },
        {
            id: 2,
            title: "Phonepe UPI",
            value: "smartstay@oksbi",
            type: "UPI",
            icon: require("../../../Assets/Images/PhonepeSymbol.png"),
        },
        {
            id: 3,
            title: "SBI Debit Card",
            value: "3247 **** **** 9878",
            type: "Debit Card",
            icon: require("../../../Assets/Images/Cardblue.png"),
        },
        {
            id: 4,
            title: "Imman Credit Card",
            value: "6487 **** **** 5476",
            type: "Credit Card",
            payable: "₹18,160",
            icon: require("../../../Assets/Images/Cardorange.png"),
        },
    ];

    const PaymentItem = ({ item }) => (
        <View style={styles.card}>

            <View style={styles.iconContainer}>
                <Image source={item.icon} style={styles.icon} />
            </View>

            <View style={styles.content}>

                <Text style={styles.title}>
                    {item.title}
                </Text>

                <Text style={styles.subtitle}>
                    {item.value}
                </Text>

            </View>

            <View style={styles.rightSection}>

                <View
                    style={[
                        styles.badge,
                        item.type === "UPI"
                            ? styles.upi
                            : item.type === "Debit Card"
                                ? styles.debit
                                : styles.credit
                    ]}
                >

                    <Text
                        style={[
                            styles.badgeText,
                            item.type === "UPI"
                                ? { color: "#1D4ED8" }
                                : item.type === "Debit Card"
                                    ? { color: "#8B5CF6" }
                                    : { color: "#F97316" }
                        ]}
                    >
                        {item.type}
                    </Text>

                </View>

                {item.payable && (

                    <Text style={styles.payable}>
                        Payable{" "}
                        <Text style={styles.amount}>
                            {item.payable}
                        </Text>
                    </Text>

                )}

            </View>

            <TouchableOpacity>

                <Image
                    source={require("../../../Assets/Images/3dots.png")}
                    style={styles.menu}
                />

            </TouchableOpacity>

        </View>
    );

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <Text style={styles.heading}>
                    Linked Payment methods
                </Text>

                <TouchableOpacity style={styles.addBtn} onPress={()=> navigation.navigate("AddPaymentMethod")}>
                    <Text style={styles.addBtnText}>
                        ＋ Add Method
                    </Text>
                </TouchableOpacity>

            </View>

            <FlatList
                data={paymentMethods}
                keyExtractor={(item) => item?.id.toString()}
                renderItem={({ item }) => <PaymentItem item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            />

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 18,
        marginBottom: 30,
    },
    heading: {
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
        color: "#111827"
    },

    addBtn: {
        height: 40,
        paddingHorizontal: 22,
        borderRadius: 12,
        backgroundColor: "#2648E8",
        justifyContent: "center",
        alignItems: "center",
    },

    addBtnText: {
        fontSize: 14,
        fontFamily: "Gilroy-Semibold",
        color: "#fff"
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 34,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },

    icon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },

    content: {
        flex: 1,
        marginLeft: 16
    },

    title: {
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
        color: "#202020"
    },

    subtitle: {
        marginTop: 6,
        fontSize: 14,
        fontFamily: "Gilroy-Medium",
        color: "#718096"
    },

    rightSection: {
        alignItems: "flex-end",
        marginRight: 14
    },

    badge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10
    },

    upi: {
        backgroundColor: "#EEF2FF"
    },

    debit: {
        backgroundColor: "#F6F0FF"
    },

    credit: {
        backgroundColor: "#FFF5EC"
    },

    badgeText: {
        fontSize: 13,
        fontFamily: "Gilroy-Semibold"
    },

    payable: {
        marginTop: 12,
        fontSize: 12,
        fontFamily: "Gilroy-Medium",
        color: "#6B7280"
    },

    amount: {
        fontSize: 15,
        fontFamily: "Gilroy-Bold",
        color: "#111827"
    },
    menu: {
        width: 18,
        height: 18,
        resizeMode: "contain",
        marginTop: 8,
    },

})