import React, { useEffect, useRef, useState } from "react";


import {
    View,
    Text,
    Modal,
    Animated,
    TouchableWithoutFeedback,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";

import ThreeDots from "../../../Assets/Images/3dots.png";
// import ArrowUp from "../../../Assets/Images/up_arrow.png";
// import ArrowDown from "../../../Assets/Images/down_arrow.png";
import Arrow from "../../../Assets/Images/right_direction.png";

export default function VendorExpenseDetailsSheet({
    visible,
    onClose,
    expense,
}) {
    const translateY = useRef(
        new Animated.Value(600)
    ).current;

    const [showItems, setShowItems] = useState(true);

    useEffect(() => {
        if (visible) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        } else {
            translateY.setValue(600);
        }
    }, [visible]);

    if (!visible || !expense) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
        >
            <TouchableWithoutFeedback
                onPress={onClose}
            >
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <Animated.View
                style={[
                    styles.sheet,
                    {
                        transform: [
                            { translateY },
                        ],
                    },
                ]}
            >
                <View style={styles.handle} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>
                            {expense.title}
                        </Text>

                        <TouchableOpacity>
                            <Image
                                source={ThreeDots}
                                style={styles.dotsIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.heading}>
                            Total Amount
                        </Text>

                        <View>
                            <Text style={styles.amount}>
                                {expense.amount}
                            </Text>

                            <Text
                                style={{
                                    color:
                                        expense.status === "Paid"
                                            ? "#16A34A"
                                            : "#F59E0B",
                                    marginTop: 4,fontFamily: "Gilroy-Semibold"
                                    
                                }}
                            >
                                ✓ {expense.status}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Expense ID</Text>
                        <Text style={{  fontSize: 15,
         fontFamily: "Gilroy-Semibold"}}>{expense.code}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Date</Text>
                        <Text style={{  fontSize: 15,
         fontFamily: "Gilroy-Semibold"}}>{expense.date}</Text>
                    </View>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Expense Items
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                setShowItems(!showItems)
                            }
                        >
                            <Image
                                source={Arrow}
                                style={{  width: 18,
        height: 18,transform:showItems   ? 'rotate(270deg)' : 'rotate(90deg)'}}
                            />
                        </TouchableOpacity>
                    </View>

                    {showItems &&
                        expense.items?.map(
                            (item, index) => (
                                <View
                                    key={index}
                                    style={styles.itemCard}
                                >
                                    <Text
                                        style={styles.itemTitle}
                                    >
                                        {item.name}
                                    </Text>

                                    <View style={styles.itemDivider} />

                                    <View style={styles.itemRow}>
                                        <Text style={styles.label}>
                                            Quantity
                                        </Text>

                                        <Text style={styles.value}>
                                            {item.quantity}
                                        </Text>
                                    </View>

                                    <View style={styles.itemRow}>
                                        <Text style={styles.label}>
                                            Unit
                                        </Text>

                                        <Text style={styles.value}>
                                            {item.unit}
                                        </Text>
                                    </View>

                                    <View style={styles.itemRow}>
                                        <Text style={styles.label}>
                                            Per Unit Price
                                        </Text>

                                        <Text style={styles.value}>
                                            ₹ {item.rate}
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.amountFooter
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.amountLabel
                                            }
                                        >
                                            Amount
                                        </Text>

                                        <Text
                                            style={
                                                styles.amountValue
                                            }
                                        >
                                            ₹ {item.amount}
                                        </Text>
                                    </View>
                                </View>
                            )
                        )}
                </ScrollView>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor:
            "rgba(0,0,0,0.4)",
    },

    sheet: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "90%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
    },

    handle: {
        width: 60,
        height: 5,
        backgroundColor: "#D1D5DB",
        alignSelf: "center",
        borderRadius: 10,
        marginBottom: 20,
    },

    title: {
        fontSize: 20,
           fontFamily: "Gilroy-Bold",
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    dotsIcon: {
        width: 22,
        height: 22,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 25,
        marginBottom: 15,
    },

    arrowIcon: {
        width: 18,
        height: 18,
    },

    itemDivider: {
        height: 1,
        backgroundColor: "#ECECEC",
        marginHorizontal: 15,
    },

    label: {
        color: "#8A8A8A",
        fontSize: 15,
         fontFamily: "Gilroy-Semibold"
    },

    value: {
        color: "#222",
        fontSize: 15,
       fontFamily: "Gilroy-Regular"
    },

    amountLabel: {
        color: "#56627A",
        fontSize: 16,
        fontFamily: "Gilroy-Regular"
    },

    amountValue: {
        fontSize: 18,
            fontFamily: "Gilroy-Bold",
        color: "#111",
    },

    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 15,
    },

    row: {
        flexDirection: "row",
        justifyContent:
            "space-between",
    },

    heading: {
        fontSize: 15,
            fontFamily: "Gilroy-Bold",
    },

    amount: {
        fontSize: 15,
           fontFamily: "Gilroy-Bold",
    },

    infoRow: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        marginTop: 20,
    },

    sectionTitle: {
        fontSize: 18,
           fontFamily: "Gilroy-Bold",
        marginTop: 25,
        marginBottom: 15,
    },

    itemCard: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        marginBottom: 15,
        overflow: "hidden",
    },

    itemTitle: {
        fontSize: 16,
            fontFamily: "Gilroy-Bold",
        padding: 15,
    },

    itemRow: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    amountFooter: {
        backgroundColor: "#F3F4F6",
        flexDirection: "row",
        justifyContent:
            "space-between",
        padding: 15,
        
    },
});