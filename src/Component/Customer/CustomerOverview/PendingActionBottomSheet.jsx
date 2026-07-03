import React, { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { Dimensions } from "react-native";
import { PanResponder } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { StyleSheet } from "react-native";
import { View, Image, TouchableOpacity } from "react-native";
import SendIcon from "../../../Assets/Images/Frame.png";
import { useCustomer } from "../../../Context/CustomerContext";

const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.60;

export default function PendingActionBottomSheet({ visible, onClose, customerDetails }) {


    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const { requestKyc } = useCustomer();
    const customerId = customerDetails?.customerId;
    console.log(customerId)

    const percentwidth = "70%";


    useEffect(() => {
        if (visible) {
            Animated.timing(translateY, {
                toValue: 0,               // 🔥 FULLY OPEN
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const closeSheet = () => {
        Animated.timing(translateY, {
            toValue: SHEET_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(onClose);
    };


    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) {
                    translateY.setValue(g.dy);
                }
            },
            onPanResponderRelease: (_, g) => {
                g.dy > 120
                    ? closeSheet()
                    : Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
            },
        })
    ).current;

    const handleKycReminder = async () => {

        const res = await requestKyc(customerId)
        

    }

    if (!visible) return null;

    return (
        <View style={styles.root}>
            <TouchableWithoutFeedback onPress={closeSheet}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <Animated.View
                {...panResponder.panHandlers}
                style={[styles.sheet,
                {
                    transform: [{
                        translateY: translateY
                    }]
                }
                ]}>
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Semibold', marginTop: 10 }}>2 Pending Action(s)</Text>

                    <View style={styles.divider} />

                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>
                            Profile Completed</Text>

                        <Text style={styles.prcntTxt}>70%</Text>

                    </View>

                    <View style={styles.percentLine}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: percentwidth },
                            ]}
                        />
                    </View>

                    <View style={styles.actionBox}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.pndingTitle}>KYC Verification </Text>
                            <Text style={styles.addTxt}>Add 20 %</Text>
                        </View>

                        <Text style={styles.dscptionTxt}>Verify the tenants KYC Verification through Smartstay Tenant App</Text>

                        {["PENDING", "EXPIRED"].includes(customerDetails?.kycInfo?.status) ? (
                            <TouchableOpacity onPress={handleKycReminder}
                                style={styles.remndrBox}>
                                <Text style={styles.reminderTxt}>Send Reminder</Text>
                                <Image source={SendIcon} style={{ width: 13, height: 13, marginLeft: 8 }} />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.reminderSntfield}>
                                 <Image source={SendIcon} style={{ width: 13, height: 13, marginLeft: 8 }} />
                                <Text style={{fontSize: 15, fontFamily: 'Gilroy-Medium', color: '#6d7c8f'}}>
                                    Reminder Sent</Text>                            
                            </View>
                        )
                        }
                    </View>

                    <View style={styles.actionBox}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.pndingTitle}>Aggreement Process</Text>
                            <Text style={styles.addTxt}>Add 20 %</Text>
                        </View>

                        <Text style={styles.dscptionTxt}>Complete aggreement process through Smartstay Tenant App</Text>

                        <TouchableOpacity style={styles.remndrBox}>
                            <Text style={styles.reminderTxt}>Send Reminder</Text>
                            <Image source={SendIcon} style={{ width: 13, height: 13, marginLeft: 8 }} />
                        </TouchableOpacity>
                    </View>

                </View>

            </Animated.View >

        </View >
    )
}

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,          // 🔥 VERY IMPORTANT
        elevation: 9999,      // 🔥 Android
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,  // 🔥 FULL SCREEN
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    sheet: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,            // 🔥 IMPORTANT
        // height: SHEET_HEIGHT,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    divider: {
        borderWidth: 1, borderColor: '#E5E7EB',
        marginVertical: 16, marginHorizontal: 4
    },
    actionBox: {
        borderWidth: 1, borderColor: "#00000040", borderRadius: 10,
        paddingVertical: 15, paddingHorizontal: 14,
        shadowColor: "#000",
        backgroundColor: "#fff", marginTop: 10
    },
    prcntTxt: {
        paddingHorizontal: 6, paddingVertical: 3, color: '#FF9900',
        backgroundColor: '#FFF4DD', fontSize: 14, fontFamily: 'Gilroy-Semibold', borderRadius: 8
    },
    percentLine: {
        height: 8, marginTop: 18, borderRadius: 15,
        marginBottom: 14, width: '100%', backgroundColor: '#E5E7EB'
    },

    progressFill: {
        height: "100%",
        backgroundColor: "#FF9900", // Progress
        borderRadius: 4,
    },
    pndingTitle: {
        fontSize: 16, fontFamily: 'Gilroy-Semibold'
    },
    addTxt: {
        fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#00A32E', marginLeft: 8
    },
    dscptionTxt: {
        fontSize: 13, fontFamily: 'Giroy-Regular', color: '#4B4B4B', marginTop: 10, lineHeight: 20
    },
    remndrBox: {
        backgroundColor: '#1E45E1', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 19,
        alignSelf: 'flex-end', marginTop: 14, flexDirection: 'row', alignItems: 'center'
    },
    reminderTxt: {
        fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#FFFFFF'
    },
    reminderSntfield:{
        alignSelf: 'flex-end', marginTop: 14, flexDirection: 'row', alignItems: 'center',marginRight:8
    }
})