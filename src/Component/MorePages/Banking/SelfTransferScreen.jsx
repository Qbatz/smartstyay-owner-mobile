//this is old design 
import React, {
    useRef,
    useEffect,
    useState,
    useContext,
} from "react";

import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";
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
    KeyboardAvoidingView,
    Platform,
    StyleSheet as RNStyleSheet, Keyboard,
    Dimensions
} from "react-native";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";

export default function SelfTransferSheet({ visible, onClose, selfDetails, }) {
    if (!visible) return null;

    const { activeHostelId } = useContext(CommonContexts);

    const {
        transferoldbankInitialize,
        getoldbankingTransferInitialize, oldBankSelfTransfer,
    } = useContext(BankingContext);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");

    const translateY = useRef(new Animated.Value(0)).current;
    const [selectedBank, setSelectedBank] = useState(null);
    const [amount, setAmount] = useState("");
    const [transferData, setTransferData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [amountError, setAmountError] = useState("");
    const [bankError, setBankError] = useState("");

    const scrollRef = useRef(null);
    const amountInputRef = useRef(null);

    const [keyboardHeight, setKeyboardHeight] = useState(0);


    useEffect(() => {
        translateY.setValue(0);
    }, [visible]);

    useEffect(() => {
        if (visible && activeHostelId && selfDetails?.bankingId) {
            console.log(
                "SELF TRANSFER INITIALIZE",
                activeHostelId,
                selfDetails?.bankingId
            )
            getoldbankingTransferInitialize(activeHostelId, selfDetails.bankingId)
        }
    }, [visible, activeHostelId, selfDetails?.bankingId,])

    // useEffect(() => {
    //     const keyboardShowListener = Keyboard.addListener(
    //         "keyboardDidShow",
    //         (e) => {
    //             setKeyboardHeight(e.endCoordinates.height);
    //         }
    //     );

    //     const keyboardHideListener = Keyboard.addListener(
    //         "keyboardDidHide",
    //         () => {
    //             setKeyboardHeight(0);
    //         }
    //     );

    //     return () => {
    //         keyboardShowListener.remove();
    //         keyboardHideListener.remove();
    //     };
    // }, []);

    const scrollInputIntoView = (refOrNode) => {
        if (!scrollRef.current) return;

        const input = refOrNode?.current
            ? refOrNode.current
            : refOrNode;

        if (!input) return;

        setTimeout(() => {
            input.measureInWindow?.((x, y, width, inputHeight) => {
                const screenHeight = Dimensions.get("window").height;

                const kbHeight = keyboardHeight || 300;

                const visibleBottom =
                    screenHeight - kbHeight - 30;

                if (
                    y >= 0 &&
                    y + inputHeight <= visibleBottom
                ) {
                    return;
                }

                const offset =
                    y + inputHeight - visibleBottom + 30;

                scrollRef.current?.scrollTo({
                    y: Math.max(0, offset),
                    animated: true,
                });
            });
        }, Platform.OS === "ios" ? 250 : 350);
    };

    const scrollToField = (y) => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                y,
                animated: true,
            });
        }, 250);
    };

    console.log("transferoldbankInitialize", transferoldbankInitialize);



    const handleTransfer = async () => {
        // Clear previous errors
        setBankError("");
        setAmountError("");

        let isValid = true;

        // -------------------------
        // TO BANK VALIDATION
        // -------------------------

        if (!selectedBank) {
            setBankError("Please select a bank to transfer");
            isValid = false;
        }

        // -------------------------
        // AMOUNT VALIDATION
        // -------------------------

        if (!amount || amount.trim() === "") {
            setAmountError("Please enter amount");
            isValid = false;
        } else if (amount.startsWith("0") || amount.startsWith(".")) {
            setAmountError("Amount must be greater than 0");
            isValid = false;
        } else {
            const dotCount = (amount.match(/\./g) || []).length;

            if (dotCount > 1) {
                setAmountError("Only one decimal point is allowed");
                isValid = false;
            } else {
                const transferAmount = Number(amount);

                if (
                    !Number.isFinite(transferAmount) ||
                    transferAmount <= 0
                ) {
                    setAmountError("Amount must be greater than 0");
                    isValid = false;
                } else {
                    const availableBalance = Number(
                        transferoldbankInitialize?.fromBank?.accountBalance || 0
                    );

                    if (transferAmount > availableBalance) {
                        setAmountError(
                            `Amount cannot exceed available balance ₹${availableBalance.toLocaleString(
                                "en-IN"
                            )}`
                        );
                        isValid = false;
                    }
                }
            }
        }

        // IMPORTANT:
        // Don't continue API call if any validation failed
        if (!isValid) {
            return;
        }

        // -------------------------
        // FROM ACCOUNT VALIDATION
        // -------------------------

        const fromBankId =
            transferoldbankInitialize?.fromBank?.bankingId;

        if (!fromBankId) {
            setBankError("From account details not available");
            return;
        }

        if (fromBankId === selectedBank) {
            setBankError("From and To account cannot be same");
            return;
        }

        // -------------------------
        // API CALL
        // -------------------------

        try {
            setLoading(true);

            const transferAmount = Number(amount);

            const payload = {
                fromBankId: fromBankId,
                toBankId: selectedBank,
                balance: transferAmount,
            };

            console.log(
                "OLD BANK SELF TRANSFER PAYLOAD =>",
                payload
            );

            const response = await oldBankSelfTransfer(
                activeHostelId,
                payload
            );

            console.log(
                "OLD BANK SELF TRANSFER RESPONSE =>",
                response
            );

            if (!response?.success) {
                const errorMessage =
                    response?.message ||
                    "Failed to transfer amount";

                setError(errorMessage);

                setModalType("error");
                setModalMessage(errorMessage);
                setShowSuccessModal(true);

                return;
            }

            setAmount("");
            setSelectedBank(null);
            setAmountError("");
            setBankError("");

            setModalType("success");
            setModalMessage(
                response?.data?.message ||
                response?.message ||
                "Amount transferred successfully"
            );
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
                onClose();
            }, 1200);

        } catch (error) {
            console.log(
                "SELF TRANSFER ERROR =>",
                error?.response?.data
            );

            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Something went wrong";

            setError(errorMessage);

            setModalType("error");
            setModalMessage(errorMessage);
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 1200);

        } finally {
            setLoading(false);
        }
    };


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
        <>


            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={modalMessage}
                type={modalType}
            />

            <View style={styles.overlay}>


                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={RNStyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[styles.sheet, { transform: [{ translateY }] }]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.handle} />

                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
                    >
                        <ScrollView
                            ref={scrollRef}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="on-drag"
                            contentContainerStyle={{
                                paddingBottom: 140,
                                flexGrow: 1,
                            }}
                        >

                            <Text style={styles.title}>Self Transfer</Text>


                            <Text style={styles.sectionTitle}>From</Text>
                            <View style={styles.bankCard}>
                                <Image
                                    source={require("../../../Assets/Images/bankBlue.png")}
                                    style={styles.bankIcon}
                                />

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.bankName}>
                                        {transferoldbankInitialize?.fromBank?.bankName ||
                                            transferoldbankInitialize?.fromBank?.accountType ||
                                            "-"}
                                    </Text>

                                    {transferoldbankInitialize?.fromBank?.accountNumber && (
                                        <Text style={styles.bankNumber}>
                                            {transferoldbankInitialize?.fromBank?.accountNumber}
                                        </Text>
                                    )}

                                    <Text style={styles.bankType}>
                                        {transferoldbankInitialize?.fromBank?.accountType || ""}
                                    </Text>
                                </View>

                                <View style={{ alignItems: "flex-end" }}>
                                    <Text style={styles.personName}>
                                        {transferoldbankInitialize?.fromBank?.accountHolderName || "-"}
                                    </Text>

                                    <Text style={styles.balance}>
                                        Avl Bal : ₹{" "}
                                        {Number(
                                            transferoldbankInitialize?.fromBank?.accountBalance || 0
                                        ).toLocaleString("en-IN")}
                                    </Text>
                                </View>
                            </View>


                            <Text style={styles.sectionTitle}>To</Text>

                            {(transferoldbankInitialize?.toBanks || []).map((bank) => {
                                const isSelected =
                                    selectedBank === bank?.bankingId;

                                return (
                                    <TouchableOpacity
                                        key={bank?.bankingId}
                                        style={[
                                            styles.bankCard,
                                            isSelected && styles.selectedBankCard,
                                        ]}
                                        onPress={() => {
                                            setSelectedBank(bank?.bankingId);
                                            setBankError("");
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            source={require("../../../Assets/Images/bankBlue.png")}
                                            style={styles.bankIcon}
                                        />

                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.bankName}>
                                                {bank?.bankName ||
                                                    bank?.accountType ||
                                                    "-"}
                                            </Text>

                                            {bank?.accountNumber && (
                                                <Text style={styles.bankNumber}>
                                                    {bank.accountNumber}
                                                </Text>
                                            )}

                                            <Text style={styles.bankType}>
                                                {bank?.accountType || ""}
                                            </Text>
                                        </View>

                                        <View style={{ alignItems: "flex-end" }}>
                                            <Text style={styles.personName}>
                                                {bank?.accountHolderName || "-"}
                                            </Text>

                                            <Text style={styles.balance}>
                                                Avl Bal : ₹{" "}
                                                {Number(
                                                    bank?.accountBalance || 0
                                                ).toLocaleString("en-IN")}
                                            </Text>
                                        </View>

                                        <View style={styles.radioOuter}>
                                            {isSelected && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}

                            {bankError ? (
                                <ErrorMessage message={bankError} />
                            ) : null}

                            <Text style={styles.sectionTitle}>Enter Amount</Text>
                            <TextInput
                                ref={amountInputRef}
                                placeholder="Please Enter Amount"
                                style={styles.input}
                                keyboardType="decimal-pad"
                                onFocus={() => scrollToField(360)}

                                value={amount}
                                onChangeText={(value) => {
                                    if (value === "") {
                                        setAmount("");
                                        setAmountError("");
                                        return;
                                    }

                                    if (!/^\d*\.?\d*$/.test(value)) {
                                        return;
                                    }

                                    const dotCount = (value.match(/\./g) || []).length;

                                    if (dotCount > 1) {
                                        setAmountError("Only one decimal point is allowed");
                                        return;
                                    }

                                    if (value.startsWith("0") || value.startsWith(".")) {
                                        setAmountError("Amount must be greater than 0");
                                        return;
                                    }

                                    const numericValue = Number(value);

                                    const availableBalance = Number(
                                        transferoldbankInitialize?.fromBank?.accountBalance || 0
                                    );

                                    if (numericValue > availableBalance) {
                                        setAmountError(
                                            `Amount cannot exceed available balance ₹${availableBalance.toLocaleString(
                                                "en-IN"
                                            )}`
                                        );
                                        return;
                                    }

                                    setAmount(value);
                                    setAmountError("");
                                }}
                            />


                            {amountError ? (
                                <ErrorMessage message={amountError} />
                            ) : null}


                            <View style={styles.row}>
                                <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.btnTransfer,
                                        (loading) && {
                                            opacity: 0.5,
                                        },
                                    ]}
                                    disabled={
                                        loading
                                    }
                                    onPress={handleTransfer}
                                >
                                    <Text style={styles.transferText}>
                                        {loading ? "Transferring..." : "Transfer"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
                </Animated.View>
            </View>
        </>
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
    selectedBankCard: {
        backgroundColor: "#F5F8FF",
        borderRadius: 12,
        paddingHorizontal: 10,
    },
    errorText: {
        color: "#E53935",
        fontSize: 12,
        marginTop: 6,
        fontWeight: "500",
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
});
