import React, {
    useMemo,
    useState,
    useContext,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    useWindowDimensions,
    Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { CommonContexts } from "../../../Context/CommonContext";
import { BillContext } from "../../../Context/BillsContext";
import SuccessModal from "../../../ToastFile/ToastPage";

import ArrowLeft from "../../../Assets/Images/Arrow_left.png";

const GenerateSelectedInvoices = ({
    route,
}) => {
    const params = route?.params || {};

    const {
        selectedInvoiceIds = [],
        selectedCount = 0,
        totalAmount = 0,
        billingPeriod = "",
    } = params;

      const navigation = useNavigation();

    const { width } = useWindowDimensions();

    const [isReviewed, setIsReviewed] = useState(false);

      const insets = useSafeAreaInsets();

    const {
        loading,
        GenerateAllRecurringInvoices,
        GetRecurringInvoicesForReview,
    } = useContext(BillContext);

    const { activeHostelId } = useContext(CommonContexts);

        const [showSuccessModal, setShowSuccessModal] = useState(false);
        const [modalMessage, setModalMessage] = useState("");
        const [modalType, setModalType] = useState("success");

    const formattedAmount = useMemo(() => {
        return Number(totalAmount || 0).toLocaleString("en-IN");
    }, [totalAmount]);



    const handleClose = () => {
        setIsReviewed(false);
        navigation.goBack();
    };

  

   const handleGenerate = async () => {
    if (!isReviewed) return;

    if (!selectedInvoiceIds?.length) {
        setModalType("error");
        setModalMessage("Please select at least one invoice");
        setShowSuccessModal(true);

        setTimeout(() => {
            setShowSuccessModal(false);
        }, 1500);

        return;
    }

    if (!activeHostelId) {
        setModalType("error");
        setModalMessage("Hostel ID is missing");
        setShowSuccessModal(true);

        setTimeout(() => {
            setShowSuccessModal(false);
        }, 1500);

        return;
    }

    try {
        console.log(
            "GENERATING SELECTED INVOICE IDS:",
            selectedInvoiceIds
        );

        const result = await GenerateAllRecurringInvoices(
            activeHostelId,
            selectedInvoiceIds
        );

        console.log("GENERATE RESULT:", result);

        // =========================
        // ERROR RESPONSE
        // =========================
        if (!result?.success) {
            setModalType("error");
            setModalMessage(
                result?.message || "Failed to generate invoices"
            );
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 1500);

            return;
        }

        // =========================
        // SUCCESS
        // =========================
        setModalType("success");
        setModalMessage(
            `${selectedCount} invoice${
                selectedCount > 1 ? "s" : ""
            } generated successfully`
        );
        setShowSuccessModal(true);

        await GetRecurringInvoicesForReview(activeHostelId);

        // Toast show ஆக கொஞ்சம் time விடுறோம்
        setTimeout(() => {
            setShowSuccessModal(false);
             handleClose()
        }, 1500);

    } catch (error) {
        console.log(
            "GENERATE SELECTED INVOICES ERROR:",
            error
        );

        setModalType("error");
        setModalMessage(
            error?.message ||
            "Something went wrong while generating invoices"
        );
        setShowSuccessModal(true);

        setTimeout(() => {
            setShowSuccessModal(false);
        }, 1500);
    }
};

    return (
        <>
        
         <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={modalMessage}
                type={modalType}
            />
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <View style={styles.header}>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleClose}
                        style={styles.backButton}
                    >
                        <Image
                            source={ArrowLeft}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>

                    <Text
                        style={styles.headerTitle}
                        numberOfLines={1}
                    >
                        Generate {selectedCount} Invoice
                        {selectedCount > 1 ? "s" : ""}?
                    </Text>

                </View>

                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <View style={styles.content}>

                    <Text style={styles.description}>
                        These invoices will be generated and become
                        {"\n"}
                        available to the respective tenants.
                    </Text>

                    {/* =================================================
                        SUMMARY CARD
                    ================================================= */}

                    <View style={styles.summaryCard}>

                        {/* Selected invoices */}

                        <View style={styles.summaryRow}>
                            <Text style={styles.label}>
                                Selected invoices
                            </Text>

                            <Text style={styles.value}>
                                {selectedCount}
                            </Text>
                        </View>

                        {/* Ready to generate */}

                        <View style={styles.summaryRow}>
                            <Text style={styles.label}>
                                Ready to generate
                            </Text>

                            <Text style={styles.value}>
                                {selectedCount}
                            </Text>
                        </View>

                        {/* Divider */}

                        <View style={styles.divider} />

                        {/* Total */}

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>
                                Total Amount
                            </Text>

                            <Text style={styles.totalAmount}>
                                ₹{formattedAmount}
                            </Text>
                        </View>

                        {/* Billing Period */}

                        <View style={styles.billingRow}>
                            <Text style={styles.label}>
                                Billing Period
                            </Text>

                            {!!billingPeriod && (
                                <Text
                                    style={styles.billingValue}
                                    numberOfLines={1}
                                >
                                    {billingPeriod}
                                </Text>
                            )}
                        </View>

                    </View>

                    {/* =================================================
                        REVIEW CHECKBOX
                    ================================================= */}

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.checkboxContainer}
                        onPress={() =>
                            setIsReviewed((prev) => !prev)
                        }
                    >

                        <View
                            style={[
                                styles.checkbox,
                                isReviewed &&
                                styles.checkboxSelected,
                            ]}
                        >
                            {isReviewed && (
                                <Text style={styles.checkmark}>
                                    ✓
                                </Text>
                            )}
                        </View>

                        <Text style={styles.checkboxText}>
                            I have reviewed the selected
                            {"\n"}
                            invoice calculations.
                        </Text>

                    </TouchableOpacity>

                </View>

                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <View  style={[
        styles.footer,
        {
            paddingBottom: 10 + insets.bottom,
        },
    ]}>

                    {/* Cancel */}

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.cancelButton}
                        onPress={handleClose}
                    >
                        <Text style={styles.cancelText}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    {/* Generate */}

                    <TouchableOpacity
                        activeOpacity={
                            isReviewed ? 0.8 : 1
                        }
                        disabled={!isReviewed || loading}
                        style={[
                            styles.generateButton,
                            isReviewed &&
                            !loading &&
                            styles.generateButtonActive,
                        ]}
                        onPress={handleGenerate}
                    >
                        <Text style={styles.generateText}>
                            {loading
                                ? "Generating..."
                                : `Generate ${selectedCount} Invoice${
                                    selectedCount > 1
                                        ? "s"
                                        : ""
                                }`}
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>
        </SafeAreaView>
        </>
    );
};

export default GenerateSelectedInvoices;


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop:40
    },

    /* =====================================================
       HEADER
    ===================================================== */

    header: {
        height: 68,
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 30,

        borderBottomWidth: 1,
        borderBottomColor: "#EEF0F4",

        backgroundColor: "#FFFFFF",
    },

    backButton: {
        width: 32,
        height: 32,

        justifyContent: "center",
        alignItems: "flex-start",

        marginRight: 14,
    },

    backIcon: {
        width: 19,
        height: 19,

        resizeMode: "contain",
    },

    headerTitle: {
        flex: 1,

        fontSize: 18,
        lineHeight: 30,

         fontFamily: "Gilroy-Bold" ,

        color: "#081021",

        letterSpacing: -0.4,
    },

    /* =====================================================
       CONTENT
    ===================================================== */

    content: {
        flex: 1,

        paddingHorizontal: 30,
        paddingTop: 32,
    },

    description: {
        fontSize: 14,
        lineHeight: 20,

        color: "#737B8C",

      fontFamily: "Gilroy-Regular" 
    },

    /* =====================================================
       SUMMARY CARD
    ===================================================== */

    summaryCard: {
        marginTop: 26,

        backgroundColor: "#F7F8FC",

        borderRadius: 20,

        paddingHorizontal: 25,
        paddingVertical: 20,
    },

    summaryRow: {
        minHeight: 40,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",
    },

    label: {
        fontSize: 15,
        lineHeight: 24,

        color: "#737B8C",
fontFamily: "Gilroy-Regular" 
    },

    value: {
        fontSize: 18,

        color: "#111827",

        fontWeight: "600",
    },

    /* =====================================================
       DIVIDER
    ===================================================== */

    divider: {
        height: 1,

        backgroundColor: "#E1E4EA",

        marginTop: 10,
        marginBottom: 10,
    },

    /* =====================================================
       TOTAL
    ===================================================== */

    totalRow: {
        minHeight: 40,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",
    },

    totalLabel: {
        fontSize: 18,

        color: "#101828",

        fontFamily: "Gilroy-Bold"
    },

    totalAmount: {
        fontSize: 18,

        color: "#2452E8",

        fontFamily: "Gilroy-Bold"
    },

    /* =====================================================
       BILLING PERIOD
    ===================================================== */

    billingRow: {
        minHeight: 38,

        marginTop: 6,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",
    },

    billingValue: {
        maxWidth: "60%",

        fontSize: 13,

        color: "#344054",

          fontFamily: "Gilroy-Regular" ,

        textAlign: "right",
    },

    /* =====================================================
       CHECKBOX
    ===================================================== */

    checkboxContainer: {
        marginTop: 28,

        flexDirection: "row",

        alignItems: "flex-start",
    },

    checkbox: {
        width: 25,
        height: 25,

        borderRadius: 5,

        borderWidth: 2,

        borderColor: "#D4D9E1",

        backgroundColor: "#FFFFFF",

        justifyContent: "center",
        alignItems: "center",

        marginRight: 15,
    },

    checkboxSelected: {
        backgroundColor: "#2452E8",

        borderColor: "#2452E8",
    },

    checkmark: {
        color: "#FFFFFF",

        fontSize: 16,

        fontWeight: "700",
    },

    checkboxText: {
        flex: 1,

        fontSize: 15,

        lineHeight: 20,

        color: "#505968",

       fontFamily: "Gilroy-Regular" ,

        marginTop: -2,
    },

    /* =====================================================
       FOOTER
    ===================================================== */

    footer: {
        minHeight: 96,

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 30,

        paddingTop: 16,


        gap: 16,

        backgroundColor: "#FFFFFF",

        borderTopWidth: 1,

        borderTopColor: "#EEF0F4",
    },

    /* =====================================================
       CANCEL
    ===================================================== */

    cancelButton: {
        flex: 1,

        height: 50,

        borderRadius: 11,

        borderWidth: 1,

        borderColor: "#D9DDE5",

        backgroundColor: "#FFFFFF",

        justifyContent: "center",

        alignItems: "center",
    },

    cancelText: {
        fontSize: 14,

        color: "#444A55",

       fontFamily: "Gilroy-Semibold",
    },

    /* =====================================================
       GENERATE
    ===================================================== */

    generateButton: {
        flex: 1,

        height: 50,

        borderRadius: 11,

        backgroundColor: "#CBD0D8",

        justifyContent: "center",

        alignItems: "center",
    },

    generateButtonActive: {
        backgroundColor: "#2452E8",
    },

    generateText: {
        fontSize: 14,

        color: "#FFFFFF",

       fontFamily: "Gilroy-Semibold",

        textAlign: "center",
    },
});