import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Animated,
    PanResponder,
    Keyboard,
    TouchableWithoutFeedback,
    useWindowDimensions,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";


const GenerateBillsSheet = ({
    visible,
    onClose,
    invoices = [],
    onGenerate,
}) => {
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const sheetY = useRef(new Animated.Value(0)).current;

    const [adjustments, setAdjustments] = useState([]);
    const [editingRow, setEditingRow] = useState(null);

    const [draftType, setDraftType] = useState("");
    const [draftAmount, setDraftAmount] = useState("");


    // =====================================================
    // RESET WHEN SHEET OPENS
    // =====================================================

    useEffect(() => {
        if (!visible) return;

        setAdjustments([]);
        setEditingRow(null);
        setDraftType("");
        setDraftAmount("");

        sheetY.setValue(height);

        Animated.spring(sheetY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 22,
            stiffness: 180,
            mass: 0.8,
        }).start();
    }, [visible]);


    // =====================================================
    // KEYBOARD
    // =====================================================

    useEffect(() => {
        const keyboardShow = Keyboard.addListener(
            "keyboardDidShow",
            () => {
                Animated.spring(sheetY, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 180,
                }).start();
            }
        );

        const keyboardHide = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                Animated.spring(sheetY, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 180,
                }).start();
            }
        );

        return () => {
            keyboardShow.remove();
            keyboardHide.remove();
        };
    }, []);


    // =====================================================
    // SHEET SWIPE
    // =====================================================

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => {
                return Math.abs(gesture.dy) > 5;
            },

            onPanResponderMove: (_, gesture) => {
                // Only allow downward movement.
                // Sheet cannot move above its 85% top boundary.
                if (gesture.dy > 0) {
                    sheetY.setValue(gesture.dy);
                } else {
                    sheetY.setValue(0);
                }
            },

            onPanResponderRelease: (_, gesture) => {
                // Swipe down enough -> close
                if (
                    gesture.dy > 120 ||
                    gesture.vy > 1.2
                ) {
                    Animated.timing(sheetY, {
                        toValue: height,
                        duration: 220,
                        useNativeDriver: true,
                    }).start(() => {
                        sheetY.setValue(0);
                        onClose?.();
                    });

                    return;
                }

                // Small swipe -> return to top position
                Animated.spring(sheetY, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 180,
                    mass: 0.8,
                }).start();
            },
        })
    ).current;


    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose = () => {
        Keyboard.dismiss();

        Animated.timing(sheetY, {
            toValue: height,
            duration: 220,
            useNativeDriver: true,
        }).start(() => {
            sheetY.setValue(0);
            onClose?.();
        });
    };


    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {
        setEditingRow({
            id: Date.now(),
        });

        setDraftType("");
        setDraftAmount("");
    };


    // =====================================================
    // SAVE NEW ROW
    // =====================================================

    const handleSaveRow = () => {
        if (
            !draftType.trim() ||
            !draftAmount.trim()
        ) {
            return;
        }

        const newRow = {
            id: Date.now(),
            type: draftType.trim(),
            amount: Number(draftAmount || 0),
        };

        setAdjustments((prev) => [
            ...prev,
            newRow,
        ]);

        setEditingRow(null);
        setDraftType("");
        setDraftAmount("");

        Keyboard.dismiss();
    };


    // =====================================================
    // REMOVE ADJUSTMENT
    // =====================================================

    const handleRemoveAdjustment = (id) => {
        setAdjustments((prev) =>
            prev.filter(
                (item) => item.id !== id
            )
        );
    };


    // =====================================================
    // INVOICE AMOUNT
    // =====================================================

    const getInvoiceAmount = (invoice) => {
        return Number(
            invoice?.amount ||
            invoice?.totalAmount ||
            invoice?.finalAmount ||
            0
        );
    };


    const totalInvoiceAmount = invoices.reduce(
        (sum, invoice) =>
            sum + getInvoiceAmount(invoice),
        0
    );


    const adjustmentTotal = adjustments.reduce(
        (sum, item) =>
            sum + Number(item.amount || 0),
        0
    );


    const finalTotal =
        totalInvoiceAmount +
        adjustmentTotal;


    // =====================================================
    // GENERATE
    // =====================================================

    const handleGenerate = () => {
        const payload = {
            invoiceIds: invoices.map(
                (item) =>
                    item.id ||
                    item.invoiceId
            ),

            adjustments: adjustments.map(
                (item) => ({
                    type: item.type,
                    amount: Number(
                        item.amount || 0
                    ),
                })
            ),
        };

        console.log(
            "GENERATE BILL PAYLOAD:",
            payload
        );

        onGenerate?.(payload);
    };


    // =====================================================
    // HIDE
    // =====================================================

    if (!visible) {
        return null;
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <View style={styles.sheetOverlay}>

            {/* BACKDROP */}

            <TouchableWithoutFeedback
                onPress={handleClose}
            >
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>


            {/* BOTTOM SHEET */}

            <Animated.View
                style={[
                    styles.sheet,
                    {
                        height:
                            height * 0.85,

                        maxHeight:
                            height * 0.85,

                        transform: [
                            {
                                translateY:
                                    sheetY,
                            },
                        ],
                    },
                ]}
                {...panResponder.panHandlers}
            >

                {/* HANDLE */}

                <View style={styles.handleArea}>
                    <View
                        style={
                            styles.sheetHandle
                        }
                    />
                </View>


                {/* HEADER */}

                <View style={styles.header}>

                    <View>
                        <Text
                            style={
                                styles.headerTitle
                            }
                        >
                            Bill Details
                        </Text>

                        <Text
                            style={
                                styles.headerSubtitle
                            }
                        >
                            Review before generating
                        </Text>
                    </View>


                    <View
                        style={
                            styles.readyBadge
                        }
                    >
                        <Text
                            style={
                                styles.readyBadgeText
                            }
                        >
                            {String(
                                invoices.length
                            ).padStart(2, "0")}{" "}
                            Bills
                        </Text>
                    </View>

                </View>


                {/* CONTENT */}

                <ScrollView
                    showsVerticalScrollIndicator={
                        false
                    }
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        paddingBottom:
                            120 +
                            insets.bottom,
                    }}
                >

                    {/* TENANTS */}

                    {invoices.map(
                        (invoice, index) => {
                            const amount =
                                getInvoiceAmount(
                                    invoice
                                );

                            return (
                                <View
                                    key={
                                        invoice.id ||
                                        invoice.invoiceId ||
                                        index
                                    }
                                    style={[
                                        styles.tenantCard,
                                        index > 0 && {
                                            marginTop: 10,
                                        },
                                    ]}
                                >

                                    <View
                                        style={
                                            styles.avatar
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.avatarText
                                            }
                                        >
                                            {invoice.initials ||
                                                invoice.name
                                                    ?.substring(
                                                        0,
                                                        2
                                                    )
                                                    ?.toUpperCase() ||
                                                "TN"}
                                        </Text>
                                    </View>


                                    <View
                                        style={
                                            styles.tenantInfo
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.tenantName
                                            }
                                            numberOfLines={
                                                1
                                            }
                                        >
                                            {invoice.name ||
                                                invoice.fullName ||
                                                "Tenant"}
                                        </Text>


                                        <Text
                                            style={
                                                styles.tenantDetails
                                            }
                                            numberOfLines={
                                                1
                                            }
                                        >
                                            {invoice.room ||
                                                "--"}{" "}
                                            ·{" "}
                                            {invoice.type ||
                                                "Rent"}{" "}
                                            ·{" "}
                                            {invoice.period ||
                                                ""}
                                        </Text>

                                    </View>


                                    <Text
                                        style={
                                            styles.tenantAmount
                                        }
                                    >
                                        ₹
                                        {Number(
                                            amount
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </Text>

                                </View>
                            );
                        }
                    )}


                    {/* CALCULATION CARD */}

                    <View
                        style={
                            styles.calculationCard
                        }
                    >

                        {/* CALCULATION HEADER */}

                        <View
                            style={
                                styles.calculationHeader
                            }
                        >

                            <Text
                                style={
                                    styles.calculationTitle
                                }
                            >
                                CALCULATION{" "}
                                BREAKDOWN
                            </Text>


                            <View
                                style={
                                    styles.manualBadge
                                }
                            >

                                <View
                                    style={
                                        styles.manualDot
                                    }
                                />

                                <Text
                                    style={
                                        styles.manualText
                                    }
                                >
                                    Manually Edited
                                </Text>

                            </View>

                        </View>


                        {/* MONTHLY RENT */}

                        <View
                            style={
                                styles.breakdownRow
                            }
                        >

                            <Text
                                style={
                                    styles.breakdownLabel
                                }
                            >
                                Monthly Rent
                            </Text>

                            <Text
                                style={
                                    styles.breakdownAmount
                                }
                            >
                                ₹
                                {Number(
                                    totalInvoiceAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </Text>

                        </View>


                        {/* APPLICABLE DAYS */}

                        <View
                            style={
                                styles.breakdownRow
                            }
                        >

                            <View
                                style={
                                    styles.labelWithBadge
                                }
                            >

                                <Text
                                    style={
                                        styles.breakdownLabel
                                    }
                                >
                                    Applicable Days
                                </Text>

                                <View
                                    style={
                                        styles.editedBadge
                                    }
                                >
                                    <Text
                                        style={
                                            styles.editedText
                                        }
                                    >
                                        EDITED
                                    </Text>
                                </View>

                            </View>


                            <Text
                                style={
                                    styles.breakdownAmount
                                }
                            >
                                25 days
                            </Text>

                        </View>


                        {/* PRORATED RENT */}

                        <View
                            style={
                                styles.breakdownRow
                            }
                        >

                            <Text
                                style={
                                    styles.breakdownLabel
                                }
                            >
                                Prorated Rent
                            </Text>

                            <Text
                                style={
                                    styles.breakdownAmount
                                }
                            >
                                ₹
                                {Number(
                                    totalInvoiceAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </Text>

                        </View>


                        {/* DISCOUNT */}

                        <View
                            style={
                                styles.breakdownRow
                            }
                        >

                            <View
                                style={
                                    styles.labelWithBadge
                                }
                            >

                                <Text
                                    style={
                                        styles.breakdownLabel
                                    }
                                >
                                    Discount
                                </Text>

                                <View
                                    style={
                                        styles.editedBadge
                                    }
                                >
                                    <Text
                                        style={
                                            styles.editedText
                                        }
                                    >
                                        EDITED
                                    </Text>
                                </View>

                            </View>


                            <Text
                                style={
                                    styles.breakdownAmount
                                }
                            >
                                —
                            </Text>

                        </View>


                        {/* TAX */}

                        <View
                            style={
                                styles.breakdownRow
                            }
                        >

                            <View
                                style={
                                    styles.labelWithBadge
                                }
                            >

                                <Text
                                    style={
                                        styles.breakdownLabel
                                    }
                                >
                                    Tax
                                </Text>

                                <View
                                    style={
                                        styles.editedBadge
                                    }
                                >
                                    <Text
                                        style={
                                            styles.editedText
                                        }
                                    >
                                        EDITED
                                    </Text>
                                </View>

                            </View>


                            <Text
                                style={
                                    styles.breakdownAmount
                                }
                            >
                                ₹0
                            </Text>

                        </View>


                        {/* ADD */}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleAdd}
                            style={
                                styles.addButton
                            }
                        >
                            <Text
                                style={
                                    styles.addButtonText
                                }
                            >
                                ＋ Add
                            </Text>
                        </TouchableOpacity>


                        {/* NEW ROW */}

                        {editingRow && (
                            <View
                                style={
                                    styles.editRow
                                }
                            >

                                {/* TYPE */}

                                <View
                                    style={
                                        styles.editField
                                    }
                                >

                                    <Text
                                        style={
                                            styles.editFieldLabel
                                        }
                                    >
                                        Type
                                    </Text>

                                    <TextInput
                                        value={
                                            draftType
                                        }
                                        onChangeText={
                                            setDraftType
                                        }
                                        placeholder="Enter type"
                                        placeholderTextColor="#A2A7B0"
                                        style={
                                            styles.editInput
                                        }
                                    />

                                </View>


                                {/* AMOUNT */}

                                <View
                                    style={
                                        styles.editField
                                    }
                                >

                                    <Text
                                        style={
                                            styles.editFieldLabel
                                        }
                                    >
                                        Amount
                                    </Text>

                                    <TextInput
                                        value={
                                            draftAmount
                                        }
                                        onChangeText={(
                                            value
                                        ) =>
                                            setDraftAmount(
                                                value.replace(
                                                    /[^0-9.]/g,
                                                    ""
                                                )
                                            )
                                        }
                                        placeholder="₹ 0.00"
                                        placeholderTextColor="#A2A7B0"
                                        keyboardType="numeric"
                                        style={
                                            styles.editInput
                                        }
                                    />

                                </View>


                                {/* CANCEL NEW ROW */}

                                <TouchableOpacity
                                    onPress={() => {
                                        setEditingRow(
                                            null
                                        );
                                        setDraftType(
                                            ""
                                        );
                                        setDraftAmount(
                                            ""
                                        );
                                    }}
                                    style={
                                        styles.removeButton
                                    }
                                >
                                    <Text
                                        style={
                                            styles.removeIcon
                                        }
                                    >
                                        ×
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        )}


                        {/* SAVED ADJUSTMENTS */}

                        {adjustments.map(
                            (item) => (
                                <View
                                    key={
                                        item.id
                                    }
                                    style={
                                        styles.savedRow
                                    }
                                >

                                    <View
                                        style={
                                            styles.savedRowLeft
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.savedType
                                            }
                                        >
                                            {item.type}
                                        </Text>

                                        <Text
                                            style={
                                                styles.savedAmount
                                            }
                                        >
                                            ₹
                                            {Number(
                                                item.amount
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </Text>

                                    </View>


                                    <TouchableOpacity
                                        onPress={() =>
                                            handleRemoveAdjustment(
                                                item.id
                                            )
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.removeSavedIcon
                                            }
                                        >
                                            ×
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            )
                        )}


                        {/* CLOSE + SAVE */}

                        {editingRow && (
                            <View
                                style={
                                    styles.actionRow
                                }
                            >

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setEditingRow(
                                            null
                                        );
                                        setDraftType(
                                            ""
                                        );
                                        setDraftAmount(
                                            ""
                                        );
                                    }}
                                    style={
                                        styles.closeButton
                                    }
                                >
                                    <Text
                                        style={
                                            styles.closeButtonText
                                        }
                                    >
                                        Close
                                    </Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={
                                        handleSaveRow
                                    }
                                    disabled={
                                        !draftType.trim() ||
                                        !draftAmount.trim()
                                    }
                                    style={[
                                        styles.saveButton,
                                        (
                                            !draftType.trim() ||
                                            !draftAmount.trim()
                                        ) &&
                                            styles.saveButtonDisabled,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.saveButtonText
                                        }
                                    >
                                        ✓ Save
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        )}


                        {/* TOTAL */}

                        <View
                            style={
                                styles.totalRow
                            }
                        >

                            <Text
                                style={
                                    styles.totalLabel
                                }
                            >
                                Invoice Total
                            </Text>

                            <Text
                                style={
                                    styles.totalAmount
                                }
                            >
                                ₹
                                {Number(
                                    finalTotal
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </Text>

                        </View>

                    </View>


                    {/* REVIEW WARNING */}

                    <View
                        style={
                            styles.reviewCard
                        }
                    >

                        <View
                            style={
                                styles.reviewTitleRow
                            }
                        >

                            <Text
                                style={
                                    styles.warningIcon
                                }
                            >
                                ⚠
                            </Text>

                            <Text
                                style={
                                    styles.reviewTitle
                                }
                            >
                                Needs Review
                            </Text>

                        </View>


                        <Text
                            style={
                                styles.reviewText
                            }
                        >
                            Please verify the
                            calculated amount before
                            generating the invoice.
                        </Text>

                    </View>

                </ScrollView>


                {/* BOTTOM ACTION BAR */}

                <View
                    style={[
                        styles.bottomBar,
                        {
                            paddingBottom:
                                Math.max(
                                    insets.bottom,
                                    12
                                ),
                        },
                    ]}
                >

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleClose}
                        style={
                            styles.bottomCancel
                        }
                    >
                        <Text
                            style={
                                styles.bottomCancelText
                            }
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={
                            handleGenerate
                        }
                        style={
                            styles.generateButton
                        }
                    >
                        <Text
                            style={
                                styles.generateButtonText
                            }
                        >
                            Generate Bills
                        </Text>
                    </TouchableOpacity>

                </View>

            </Animated.View>

        </View>
    );
};


export default GenerateBillsSheet;


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    sheetOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor:
            "rgba(0,0,0,0.38)",
    },


    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },


    sheet: {
        width: "100%",
        height: "85%",
        maxHeight: "85%",
        backgroundColor: "#FFFFFF",

        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,

        overflow: "hidden",
    },


    handleArea: {
        height: 42,
        alignItems: "center",
        justifyContent: "center",
    },


    sheetHandle: {
        width: 44,
        height: 5,
        borderRadius: 5,
        backgroundColor: "#C8CCD4",
    },


    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",

        paddingHorizontal: 22,
        paddingBottom: 15,

        borderBottomWidth: 1,
        borderBottomColor: "#EEF0F4",
    },


    headerTitle: {
        fontSize: 22,
        color: "#252832",
        fontFamily:
            "Gilroy-Semibold",
    },


    headerSubtitle: {
        marginTop: 3,
        fontSize: 12,
        color: "#8A91A0",
        fontFamily:
            "Gilroy-Regular",
    },


    readyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: "#FFF0D7",
    },


    readyBadgeText: {
        fontSize: 11,
        color: "#B66A00",
        fontFamily:
            "Gilroy-Medium",
    },


    tenantCard: {
        marginHorizontal: 22,
        marginTop: 15,
        padding: 13,

        borderRadius: 14,
        backgroundColor: "#F7F8FC",

        flexDirection: "row",
        alignItems: "center",
    },


    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,

        backgroundColor: "#172AA0",

        alignItems: "center",
        justifyContent: "center",
    },


    avatarText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontFamily:
            "Gilroy-Medium",
    },


    tenantInfo: {
        flex: 1,
        marginLeft: 12,
        minWidth: 0,
    },


    tenantName: {
        fontSize: 16,
        color: "#242832",
        fontFamily:
            "Gilroy-Semibold",
    },


    tenantDetails: {
        marginTop: 4,
        fontSize: 12,
        color: "#7B8495",
        fontFamily:
            "Gilroy-Regular",
    },


    tenantAmount: {
        fontSize: 15,
        color: "#18202F",
        fontFamily:
            "Gilroy-Bold",
        marginLeft: 8,
    },


    calculationCard: {
        marginHorizontal: 22,
        marginTop: 16,

        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,

        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },


    calculationHeader: {
        minHeight: 55,
        paddingHorizontal: 16,

        backgroundColor: "#F6F7FA",

        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
    },


    calculationTitle: {
        fontSize: 12,
        color: "#737C8D",
        fontFamily:
            "Gilroy-Medium",
    },


    manualBadge: {
        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#FFB45A",
        borderRadius: 14,

        paddingHorizontal: 9,
        paddingVertical: 5,
    },


    manualDot: {
        width: 7,
        height: 7,
        borderRadius: 4,

        backgroundColor: "#FF9700",
        marginRight: 5,
    },


    manualText: {
        fontSize: 10,
        color: "#E98500",
        fontFamily:
            "Gilroy-Medium",
    },


    breakdownRow: {
        minHeight: 40,
        paddingHorizontal: 18,

        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
    },


    breakdownLabel: {
        fontSize: 14,
        color: "#747D8D",
        fontFamily:
            "Gilroy-Regular",
    },


    breakdownAmount: {
        fontSize: 15,
        color: "#18202F",
        fontFamily:
            "Gilroy-Semibold",
    },


    labelWithBadge: {
        flexDirection: "row",
        alignItems: "center",
    },


    editedBadge: {
        marginLeft: 7,
        paddingHorizontal: 6,
        paddingVertical: 2,

        borderWidth: 1,
        borderColor: "#FF9B62",
        borderRadius: 4,
    },


    editedText: {
        fontSize: 8,
        color: "#FF7043",
        fontFamily:
            "Gilroy-Medium",
    },


    addButton: {
        height: 38,
        marginHorizontal: 18,
        marginTop: 8,
        marginBottom: 12,

        borderRadius: 7,
        backgroundColor: "#E9EDFF",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },


    addButtonText: {
        fontSize: 15,
        color: "#1747F5",
        fontFamily:
            "Gilroy-Medium",
    },


    editRow: {
        marginHorizontal: 18,
        marginBottom: 8,
        padding: 10,

        borderRadius: 10,
        backgroundColor: "#F7F8FC",

        flexDirection: "row",
        alignItems: "flex-end",

        gap: 8,
    },


    editField: {
        flex: 1,
    },


    editFieldLabel: {
        marginBottom: 5,
        fontSize: 11,
        color: "#6E7685",
        fontFamily:
            "Gilroy-Medium",
    },


    editInput: {
        height: 43,
        paddingHorizontal: 12,

        borderWidth: 1,
        borderColor: "#AFC0FF",
        borderRadius: 8,

        backgroundColor: "#FFFFFF",

        color: "#252832",
        fontSize: 14,

        fontFamily:
            "Gilroy-Regular",
    },


    removeButton: {
        width: 30,
        height: 43,

        alignItems: "center",
        justifyContent: "center",
    },


    removeIcon: {
        fontSize: 26,
        color: "#A3A8B2",
        lineHeight: 28,
    },


    savedRow: {
        marginHorizontal: 18,
        marginBottom: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,

        borderRadius: 8,
        backgroundColor: "#F8F9FC",

        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
    },


    savedRowLeft: {
        flex: 1,

        flexDirection: "row",
        justifyContent:
            "space-between",

        marginRight: 10,
    },


    savedType: {
        fontSize: 13,
        color: "#4E5665",
        fontFamily:
            "Gilroy-Medium",
    },


    savedAmount: {
        fontSize: 13,
        color: "#202633",
        fontFamily:
            "Gilroy-Semibold",
    },


    removeSavedIcon: {
        fontSize: 24,
        color: "#A3A8B2",
        lineHeight: 26,
    },


    actionRow: {
        flexDirection: "row",
        justifyContent:
            "flex-end",
        alignItems: "center",

        paddingHorizontal: 18,
        marginBottom: 10,

        gap: 12,
    },


    closeButton: {
        height: 40,
        minWidth: 90,

        paddingHorizontal: 18,

        borderWidth: 1,
        borderColor: "#DDDFE5",
        borderRadius: 8,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#FFFFFF",
    },


    closeButtonText: {
        fontSize: 15,
        color: "#565B64",
        fontFamily:
            "Gilroy-Regular",
    },


    saveButton: {
        height: 40,
        minWidth: 105,

        paddingHorizontal: 17,

        borderRadius: 8,
        backgroundColor: "#009447",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },


    saveButtonDisabled: {
        opacity: 0.45,
    },


    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontFamily:
            "Gilroy-Medium",
    },


    totalRow: {
        marginTop: 2,
        paddingHorizontal: 18,

        minHeight: 58,

        borderTopWidth: 1,
        borderTopColor: "#E8EAF0",

        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
    },


    totalLabel: {
        fontSize: 16,
        color: "#263040",
        fontFamily:
            "Gilroy-Semibold",
    },


    totalAmount: {
        fontSize: 20,
        color: "#202633",
        fontFamily:
            "Gilroy-Bold",
    },


    reviewCard: {
        marginHorizontal: 22,
        marginTop: 15,

        paddingHorizontal: 15,
        paddingVertical: 13,

        borderWidth: 1,
        borderColor: "#FFD36A",
        borderRadius: 10,

        backgroundColor: "#FFFBEF",
    },


    reviewTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },


    warningIcon: {
        fontSize: 16,
        color: "#FF9F00",
    },


    reviewTitle: {
        marginLeft: 7,
        fontSize: 15,
        color: "#B56B00",
        fontFamily:
            "Gilroy-Semibold",
    },


    reviewText: {
        marginTop: 7,
        marginLeft: 26,

        fontSize: 12,
        lineHeight: 18,

        color: "#C36F00",

        fontFamily:
            "Gilroy-Regular",
    },


    bottomBar: {
        paddingHorizontal: 22,
        paddingTop: 10,

        borderTopWidth: 1,
        borderTopColor: "#E7E9EE",

        backgroundColor: "#FFFFFF",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",

        elevation: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },


    bottomCancel: {
        height: 45,
        paddingHorizontal: 20,

        alignItems: "center",
        justifyContent: "center",
    },


    bottomCancelText: {
        fontSize: 15,
        color: "#343943",
        fontFamily:
            "Gilroy-Medium",
    },


    generateButton: {
        height: 45,
        paddingHorizontal: 22,

        borderRadius: 9,
        backgroundColor: "#2149E8",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        marginLeft: 8,
    },


    generateButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontFamily:
            "Gilroy-Medium",
    },

});