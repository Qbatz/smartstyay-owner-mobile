import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    TextInput,
} from "react-native";
import ValidatedInput from "../MorePages/ValidatedInput"
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function SettlementCustomRentSheet({
    visible,
    onClose,
    rentAmount,
    onSet,
}) {
    const [amount, setAmount] = useState("");
    const [rentError, setRentError] = useState("");

    const translateY = useRef(
        new Animated.Value(SCREEN_HEIGHT)
    ).current;

    useEffect(() => {
        if (visible) {
            setAmount(String(rentAmount || ""));

            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const closeSheet = () => {
        Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
        }).start(onClose);
    };

    if (!visible) return null;

    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                onPress={closeSheet}
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 999,
                }}
            />

            <Animated.View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#FFF",
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    paddingHorizontal: 24,
                    paddingTop: 12,
                    paddingBottom: 30,
                    transform: [{ translateY }],
                    zIndex: 1000,
                }}
            >
                <View
                    style={{
                        width: 70,
                        height: 5,
                        borderRadius: 10,
                        backgroundColor: "#D1D5DB",
                        alignSelf: "center",
                        marginBottom: 30,
                    }}
                />

                <Text
                    style={{
                        fontSize: 22,
                        fontFamily: "Gilroy-Bold",
                        color: "#4B4B4B",
                        marginBottom: 30,
                    }}
                >
                    Tenant's last rent is ₹ {rentAmount} !
                </Text>

                <Text
                    style={{
                        fontSize: 15,
                        color: "#4B4B4B",
                        marginBottom: 16,
                    }}
                >
                    Enter the amount you want to collect ?
                </Text>

                <ValidatedInput
                    type="numberOnly"
                    inputType="numeric"
                    style={{
                        borderWidth: 1,
                        borderColor: "#B1C1FF",
                        borderRadius: 10,
                        paddingHorizontal: 18,
                        height: 50,
                        fontSize: 20,
                        fontFamily: "Gilroy-Bold",
                        marginBottom: 50,
                        
                    }}
                    placeholder="₹ 0.00"
                    value={amount}
                    onChangeText={setAmount}
                    maxLength={7}

                />
               {rentError ? (
    <ErrorMessage message={rentError} type="error" />
) : null}


                <View
                    style={{
                        flexDirection: "row",
                        gap: 12,
                    }}
                >
                    <TouchableOpacity
                        onPress={closeSheet}
                        style={{
                            flex: 1,
                            height: 50,
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                color: "#4B4B4B",
                                fontFamily: "Gilroy-Medium",
                            }}
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                       onPress={() => {

    if (!amount || Number(amount) <= 0) {
        setRentError("Please enter rent amount");
        return;
    }

    if (Number(amount) > Number(rentAmount)) {
        setRentError(
            `Amount should not exceed ₹${rentAmount}`
        );
        return;
    }

    setRentError("");

    onSet(Number(amount));
    closeSheet();
}}
                        style={{
                            flex: 1,
                            height: 50,
                            borderRadius: 14,
                            backgroundColor: "#2F54EB",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "#FFF",
                                fontSize: 18,
                                fontFamily: "Gilroy-Semibold",
                            }}
                        >
                            Set
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
}