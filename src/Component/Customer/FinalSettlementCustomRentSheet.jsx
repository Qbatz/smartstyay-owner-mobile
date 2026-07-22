import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    TextInput,
    StyleSheet,
    PanResponder,
    Keyboard,
} from "react-native";
import ValidatedInput from "../MorePages/ValidatedInput"
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function SettlementCustomRentSheet({
    visible,
    onClose,
    mode,
    rentAmount,
    onSet,
}) {
    const [amount, setAmount] = useState("");
    const [rentError, setRentError] = useState("");
    const [finalAmountSetClicked, setFinalAmountSetClicked] = useState(false);

    const insets = useSafeAreaInsets();
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




    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) translateY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 120) closeSheet();
                else openSheet();
            },
        })
    ).current;

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        if (!visible) return;

        const showSub = Keyboard.addListener(
            "keyboardDidShow",
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );

        const hideSub = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [visible]);


    // useEffect(() => {
    //     const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
    //         Animated.timing(translateY, {
    //             toValue: -e.endCoordinates.height + 70,
    //             duration: 180,
    //             useNativeDriver: true,
    //         }).start();
    //     });

    //     const hideSub = Keyboard.addListener("keyboardDidHide", () => {
    //         Animated.timing(translateY, {
    //             toValue: 0,
    //             duration: 180,
    //             useNativeDriver: true,
    //         }).start();
    //     });

    //     return () => {
    //         showSub.remove();
    //         hideSub.remove();
    //     };
    // }, []);

    const openSheet = () => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
        setRentError("")
    };


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

            <View style={styles.root}>
                <TouchableOpacity style={styles.overlay} onPress={closeSheet} />

                {/* <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.sheet,
                        {
                            transform: [{ translateY }],
                            paddingBottom: 20 + insets.bottom,
                        },
                    ]}
                > */}
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.sheet,
                        {
                            paddingBottom: 20 + insets.bottom,
                            transform: [
                                {
                                    translateY: Animated.subtract(
                                        translateY,
                                        new Animated.Value(
                                            keyboardHeight > 0 ? 240 : 0
                                        )
                                    ),
                                },
                            ],
                        },
                    ]}
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
                    {console.log("maad", mode)}

                    <Text
                        style={{
                            fontSize: 15,
                            color: "#4B4B4B",
                            marginBottom: 16,
                        }}
                    >
                        {mode === "edit" ? "Edit Amount" : "Enter the amount you want to collect ?"}
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
                            // marginBottom: 10,

                        }}
                        placeholder="₹ 0.00"
                        value={amount}
                        // onChangeText={setAmount}
                        onChangeText={(text) => {
                            setAmount(text);
                            if (rentError) {
                                setRentError("");
                            }
                        }}
                        maxLength={7}

                    />
                      <View>
                        <Text style={styles.note}>
                            Note: The specified amount covers rent exclusively. All other charges are added with this amount. eg: Other charges
                        </Text>
                    </View>
                    {rentError ? (
                        <ErrorMessage message={rentError} type="error" />
                    ) : null}

                  


                    <View
                        style={{
                            flexDirection: "row",
                            gap: 12,
                            marginTop:40
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
                            // onPress={() => {
                            //     if (!amount || Number(amount) <= 0) {
                            //         setRentError("Please enter rent amount");
                            //         return;
                            //     }

                            //     setRentError("");

                            //     onSet(Number(amount));
                            //     closeSheet();
                            // }}

                            onPress={() => {

                                if (!amount) {
                                    setRentError("Please enter rent amount");
                                    return;
                                }

                                if (Number(amount) <= 0) {
                                    setRentError("Amount must be greater than 0");
                                    return;
                                }

                                if (/^0+$/.test(amount) && amount !== "0") {
                                    setRentError("Invalid rent amount");
                                    return;
                                }

                                // if (Number(amount) > Number(rentAmount)) {
                                //     setRentError(
                                //         `Amount should not exceed ₹${rentAmount}`
                                //     );
                                //     return;
                                // }

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

            </View>

            {/* <TouchableOpacity
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
                    // onChangeText={setAmount}
                    onChangeText={(text) => {
                        setAmount(text);
                        if (rentError) {
                            setRentError("");
                        }
                    }}
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
                        // onPress={() => {
                        //     if (!amount || Number(amount) <= 0) {
                        //         setRentError("Please enter rent amount");
                        //         return;
                        //     }

                        //     setRentError("");

                        //     onSet(Number(amount));
                        //     closeSheet();
                        // }}

                        onPress={() => {

                            if (!amount) {
                                setRentError("Please enter rent amount");
                                return;
                            }

                            if (Number(amount) <= 0) {
                                setRentError("Amount must be greater than 0");
                                return;
                            }

                            if (/^0+$/.test(amount) && amount !== "0") {
                                setRentError("Invalid rent amount");
                                return;
                            }

                            // if (Number(amount) > Number(rentAmount)) {
                            //     setRentError(
                            //         `Amount should not exceed ₹${rentAmount}`
                            //     );
                            //     return;
                            // }

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
            </Animated.View> */}
        </>
    );
}

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,          // 🔥 VERY IMPORTANT
        elevation: 9999,      // 🔥 Android
    },
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    sheet: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: "85%",

    },
 note: {
        color: "#505F76",
        marginTop: 10,
        marginBottom:10,
        lineHeight: 18,
        fontSize: 12,
          fontFamily: "Gilroy-Regular",
    },
})