import React, { useState,useRef ,  useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    SafeAreaView, ScrollView,
    KeyboardAvoidingView, Platform, StatusBar
} from "react-native";
import { BackHandler } from "react-native";
import { useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import room from "../../../Assets/Images/PG_active.png";
import Bed from "../../../Assets/Images/bed.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import InvoiceLinkIcon from "../../../Assets/Images/Invoice_Link.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import Loader from "../../Loader/Loader";
import ValidatedInput from "../ValidatedInput"

export default function BookingToInvoice() {


    const navigation = useNavigation();
    const route = useRoute();

    const onSuccess = route?.params?.onSuccess;
    const source = route?.params?.source;

    const { BillDetails, loading, GetAllBillDetails, GetAdvanceBookingBills,
        RecordPayment, GetInitializeRefundDetails, CreateRefund, refundError
        , GetRecurringBills, recurringBills, BillPdfdetails, getBillsPdfDetails, getReceiptPdfDetails, downloadReceipt, DeleteReceipt,
        downloadBill, shareBillOnWhatsapp, shareReceiptOnWhatsapp, GetReceiptsList, receiptsList, MarkBillAsUnpaid,
        UpdateBillDiscount,
        ApplyBillDiscount, InitializebookingBills, ApplyAdvanceToInvoices } = useContext(BillContext);
    const { activeHostelId } = useContext(CommonContexts);

    const isApplyTriggeredRef = useRef(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");

    const [initialDiscount, setInitialDiscount] = useState("");
    const [initialReason, setInitialReason] = useState("");
    const [initialType, setInitialType] = useState("");

    const bill = route?.params?.bill

    

    console.log("BillPdfdetails", BillPdfdetails);

    const discountAmountParam = route?.params?.discountAmount;
    const discountPercentageParam = route?.params?.discountPercentage;
    const totalamount = route?.params?.totalAmount
    const reasonParam = route?.params?.DiscountReason;


    const [discountType, setDiscountType] = useState("Amount");
    const [discount, setDiscount] = useState("");
    const [reason, setReason] = useState("");
    const [showReasonDropdown, setShowReasonDropdown] = useState(false);
    const [isCustomReason, setIsCustomReason] = useState(false);

    const [reasonErr, setReasonErr] = useState("")
    const [discountErr, setDiscountErr] = useState("")

    const [isFocused, setIsFocused] = useState(false);
    const [tempValue, setTempValue] = useState("")
    const [finalValue, setFinalValue] = useState("")

    const [appliedAmounts, setAppliedAmounts] = useState({});

    const bookingData = InitializebookingBills?.data;

    const customer = InitializebookingBills?.customerInfo || {};
    const invoicesList = InitializebookingBills?.listInvoices || [];
    const advanceInfo = InitializebookingBills?.advanceInfo || {};

    console.log("invoicesList", invoicesList);

    const totalApplied = Object.values(appliedAmounts).reduce(
        (sum, val) => sum + Number(val || 0),
        0
    );

    const bookingAmount =
        Number(
            advanceInfo?.availableBalance ||
            advanceInfo?.advanceBalanceAmount ||
            0
        );

    const remainingBalance = bookingAmount - totalApplied;





    const reasons = [
        "Loyalty Discount",
        "Promotional Offer",
        "Service Issue",
        "Partial Stay",
        "Special Approval",
        "Other",
    ];

    const invoiceAmount = Number(
        BillPdfdetails?.invoiceInfo?.subTotal || totalamount
    );

    const discountValue =
        discountType === "Percentage"
            ? (invoiceAmount * Number(discount || 0)) / 100
            : Number(discount || 0);

    const total = invoiceAmount - discountValue;


    const today = new Date();

    const dueDateStr = BillPdfdetails?.dueDate;

    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split("/");
        return new Date(`${year}-${month}-${day}`);
    };

    const dueDate = parseDate(dueDateStr);

    const isOverdue = dueDate && today > dueDate;


    useEffect(() => {
        if (route?.params?.isEdit) {

            const subTotal =
                BillPdfdetails?.invoiceInfo?.subTotal || totalamount;

            const amount =
                discountAmountParam > 0
                    ? discountAmountParam
                    : (subTotal * Number(discountPercentageParam || 0)) / 100;

            const formattedAmount = String(Number(amount));

            setDiscountType("Amount");
            setDiscount(formattedAmount);

            setInitialDiscount(formattedAmount);
            setInitialType("Amount");


            if (reasonParam) {
                setReason(reasonParam);
                setInitialReason(reasonParam);


                if (!reasons.includes(reasonParam)) {
                    setIsCustomReason(true)
                } else {
                    setIsCustomReason(false);
                }
            }
        }
    }, [discountAmountParam, discountPercentageParam, reasonParam]);

    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [])


    // const handleSetAmount = (invoiceId, value, maxAmount) => {
    //     let amount = Number(value);

    //     if (isNaN(amount) || amount <= 0) return;

    //     if (amount > maxAmount) {
    //         amount = maxAmount;
    //     }

    //     setAppliedAmounts((prev) => ({
    //         ...prev,
    //         [invoiceId]: amount,
    //     }));
    // };


    const handleSetAmount = (invoiceId, value, maxAmount) => {

        let amount = Number(value);

        if (isNaN(amount) || amount <= 0) return;

        // current invoice exclude pannitu calculate
        const currentAppliedWithoutThis =
            Object.entries(appliedAmounts)
                .filter(([id]) => id !== invoiceId)
                .reduce((sum, [, val]) => sum + Number(val || 0), 0);

        // available booking balance
        const bookingAmount = Number(
            advanceInfo?.availableBalance ||
            advanceInfo?.advanceBalanceAmount ||
            0
        );

        // remaining balance
        const remainingBalance =
            bookingAmount - currentAppliedWithoutThis;

        // final allowed amount
        const maxAllowed = Math.min(
            remainingBalance,
            Number(maxAmount || 0)
        );

        // if entered more than allowed
        if (amount > maxAllowed) {
            amount = maxAllowed;
        }

        setAppliedAmounts((prev) => ({
            ...prev,
            [invoiceId]: amount,
        }));

        // input value update
        setTempValue((prev) => ({
            ...prev,
            [invoiceId]: String(amount),
        }));
    };

    const isValidNumber = (val) => {
        if (!val) return false;

        const num = Number(val);

        if (isNaN(num) || num <= 0) return false;

        return true;
    };







    const isEdit = route?.params?.isEdit;

    console.log("advancedtails", advanceInfo);



    console.log("ADVANCEid", advanceInfo?.advanceInvoiceId);

    const totalApplieds = Object.values(appliedAmounts).reduce(
        (sum, val) => sum + Number(val || 0),
        0
    );

    console.log("totalApplieds", totalApplieds);



    const handleApply = async () => {

         if (isApplyTriggeredRef.current) return;
    isApplyTriggeredRef.current = true;

    try {
        const bookingAmount =
            Number(
                advanceInfo?.availableBalance ||
                advanceInfo?.advanceBalanceAmount ||
                0
            );

        const totalApplied = Object.values(appliedAmounts).reduce(
            (sum, val) => sum + Number(val || 0),
            0
        );

        if (totalApplied <= 0) {
            setModalType("warning");
            setModalMessage("Please Enter valid Amount");
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000);

            //    isApplyTriggeredRef.current = false;
    return
        }

        if (totalApplied > bookingAmount) {
            setModalType("warning");
            setModalMessage("Applied amount exceeds booking amount");
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000);
// isApplyTriggeredRef.current = false;
            return;
        }

        const listItems = Object.entries(appliedAmounts).map(
            ([invoiceId, amount]) => ({
                invoiceId,
                amount: Number(amount),
            })
        )

        console.log("listitems", listItems);


        const payload = {
            // reason: "Advance Applied",
            // date: new Date().toISOString(),
            listItems,
        }

        console.log("payload", payload);
        console.log("ID", activeHostelId, advanceInfo?.advanceInvoiceId,);



        const res = await ApplyAdvanceToInvoices({
            hostelId: activeHostelId,
            invoiceId: advanceInfo?.advanceInvoiceId,
            listItems,
        });

        console.log("res", res);


        if (res?.success) {
            await GetAllBillDetails(activeHostelId);
            await GetAdvanceBookingBills(activeHostelId);
            await getBillsPdfDetails(activeHostelId, advanceInfo?.advanceInvoiceId)
            setModalType("success");
            setModalMessage("Applied successfully");
            setShowSuccessModal(true);

            setTimeout(() => {
                navigation.goBack();
                setShowSuccessModal(false);
            }, 1500);

        } else {

            setModalType("warning");
            setModalMessage(res?.message || "Something went wrong");
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 2500);
        }
    }
    catch {
        console.log("error");
        
    }
    finally {
        isApplyTriggeredRef.current = false;
    }
    };









    return (

        <>
            {loading && <Loader />}
            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={modalMessage}
                type={modalType}
            />
            <SafeAreaView style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={ArrowLeft} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {source === "bill"
                            ? "Adjust invoice from advance"
                            : "Apply Retainer to Invoice"}
                    </Text>
                </View>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "padding"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 120 }}>

                        <View style={styles.userCard}>

                            {/* TOP CONTENT */}
                            <View style={{ flexDirection: "row", alignItems: "center" }}>

                                {customer?.profilePic ? (
                                    <Image source={{ uri: customer.profilePic }} style={styles.userImg} />
                                ) : (
                                    <View style={styles.initialCircle}>
                                        <Text style={styles.initialText}>
                                            {customer?.initials || "M"}
                                        </Text>
                                    </View>
                                )}

                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.name}>
                                        {customer?.fullName || "--"}
                                    </Text>

                                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>
                                                {BillPdfdetails?.stayInfo?.floorName || "Ground Floor"}
                                            </Text>
                                        </View>

                                        <Image source={room} style={{ width: 18, height: 18, marginHorizontal: 4 }} />
                                        <Text style={styles.detailText}>
                                            {customer?.roomName || "--"}
                                        </Text>

                                        <Image source={Bed} style={{ width: 18, height: 18, marginHorizontal: 4 }} />
                                        <Text style={styles.detailText}>
                                            {customer?.bedName || "--"}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* DIVIDER */}
                            <View style={styles.innerDivider} />

                            {/* BOOKING AMOUNT */}
                            <View style={styles.bookingRowInside}>
                                <Text style={styles.bookingLabel}>
                                    {source === "bill"
                                        ? "Balance advance Amount"
                                        : "Retainer Amount of"}
                                </Text>
                                <View style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Text style={styles.bookingAmount}>
                                        {/* ₹ {advanceInfo?.advanceBalanceAmount || 0} */}
                                        ₹ {
                                            advanceInfo?.availableBalance ||
                                            advanceInfo?.advanceBalanceAmount ||
                                            0
                                        }
                                    </Text>
                                    {source === "bill" &&
                                        (
                                            <View style={{ display: 'flex', flexDirection: 'row' , marginTop:3}}>
                                              
                                                <Text style={styles.smallText}>
                                                    {advanceInfo?.advanceInvoiceNumber}
                                                </Text>
                                                  <Image
                                                    source={InvoiceLinkIcon}
                                                    style={{ height: 14, width: 14, marginLeft: 3 }}
                                                />
                                            </View>
                                        )}
                                </View>
                            </View>

                        </View>



                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>All Unpaid Invoices</Text>

                            {invoicesList?.length > 0 ? (
                                invoicesList.map((item, index) => (
                                    <View key={item?.invoiceId || index} style={styles.innerCard}>

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.amount}>
                                                {item?.invoiceType}
                                            </Text>

                                            <Text style={styles.amount}>
                                                ₹ {item?.invoiceAmount || 0}
                                            </Text>
                                        </View>

                                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                                           
                                            <Text style={styles.smallText}>
                                                {item?.invoiceNumber}
                                            </Text>
                                             <Image
                                                source={InvoiceLinkIcon}
                                                style={{ height: 14, width: 14, marginLeft: 5 }}
                                            />
                                        </View>

                                        {source === "bill" && (
                                            <View style={styles.rowBetween}>
                                                <Text style={styles.label}>Invoice Date</Text>
                                                <Text style={styles.valueText}>
                                                    {item?.invoiceDate || "N/A"}
                                                </Text>
                                            </View>
                                        )}

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.label}>Due Date</Text>
                                            <Text style={styles.valueText}>
                                                {item?.dueDate || "N/A"}
                                            </Text>
                                        </View>

                                        <View style={styles.rowBetween}>
                                            <Text style={styles.label}>Due</Text>
                                            <Text style={styles.valueText}>{item?.pendingAmount ? item?.pendingAmount : "N/A"}</Text>
                                        </View>

                                        <Text style={styles.inputLabel}>
                                            Amount to apply
                                        </Text>

                                        <View style={styles.inputWrapper}>
                                            <ValidatedInput
                                                type="numberOnly"
                                                inputType="numeric"
                                                style={styles.inputField}
                                                placeholder="₹ 0.00"
                                                value={tempValue?.[item.invoiceId] || ""}
                                                maxLength={7}
                                                onChangeText={(text) => {

                                                    if (text === "") {
                                                        setTempValue((prev) => ({
                                                            ...prev,
                                                            [item.invoiceId]: "",
                                                        }));

                                                        setAppliedAmounts((prev) => ({
                                                            ...prev,
                                                            [item.invoiceId]: 0,
                                                        }));

                                                        return;
                                                    }

                                                    let amount = Number(text);

                                                    const bookingAmount =
                                                        Number(
                                                            advanceInfo?.availableBalance ||
                                                            advanceInfo?.advanceBalanceAmount ||
                                                            0
                                                        );

                                                    const currentAppliedWithoutThis =
                                                        Object.entries(appliedAmounts)
                                                            .filter(([id]) => id !== item.invoiceId)
                                                            .reduce(
                                                                (sum, [, val]) => sum + Number(val || 0),
                                                                0
                                                            );

                                                    const remainingBalance =
                                                        bookingAmount - currentAppliedWithoutThis;

                                                    const pendingAmount =
                                                        Number(item?.pendingAmount || 0);

                                                    const maxAllowed = Math.min(
                                                        remainingBalance,
                                                        pendingAmount
                                                    );

                                                    if (amount > maxAllowed) {

                                                        setModalType("warning");
                                                        setModalMessage(
                                                            `Maximum allowed amount is ₹ ${maxAllowed}`
                                                        );
                                                        setShowSuccessModal(true);

                                                        setTimeout(() => {
                                                            setShowSuccessModal(false);
                                                        }, 1500);

                                                        text = String(maxAllowed);
                                                        amount = maxAllowed;
                                                    }

                                                    setTempValue((prev) => ({
                                                        ...prev,
                                                        [item.invoiceId]: text,
                                                    }));

                                                    setAppliedAmounts((prev) => ({
                                                        ...prev,
                                                        [item.invoiceId]: amount,
                                                    }));
                                                }}
                                            />

                                            <TouchableOpacity
                                                style={styles.setBtn}
                                                onPress={() =>
                                                    handleSetAmount(
                                                        item.invoiceId,
                                                        tempValue?.[item.invoiceId],
                                                        item.pendingAmount
                                                    )
                                                }
                                            >
                                                <Text style={{ color: "#1E45E1" }}>Set</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyCard}>
                                    <Text style={styles.emptyText}>
                                        No pending invoices found
                                    </Text>
                                </View>
                            )}

                            {/* {invoicesList.map((item, index) => (
                                <View key={item?.invoiceId || index} style={styles.innerCard}>

                                    <View style={styles.rowBetween}>

                                        <Text style={styles.amount}>
                                            {item?.invoiceType}
                                        </Text>


                                        <Text style={styles.amount}>
                                            ₹ {item?.pendingAmount || 0}
                                        </Text>
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', }}>
                                        <Image source={InvoiceLinkIcon} style={{ height: 14, width: 14, marginRight: 5 }} />
                                        <Text style={styles.smallText}>
                                            {item?.invoiceNumber}
                                        </Text>
                                    </View>

                                    {source === "bill" && (
                                    <View style={styles.rowBetween}>
                                        <Text style={styles.label}>Invoice Date</Text>
                                        <Text style={styles.valueText}>
                                            {item?.invoiceDate || "N/A"}
                                        </Text>
                                    </View>

                                    )}

                                    <View style={styles.rowBetween}>
                                        <Text style={styles.label}>Due Date</Text>
                                        <Text style={styles.valueText}>
                                            {item?.dueDate || "N/A"}
                                        </Text>
                                    </View>

                                    <View style={styles.rowBetween}>
                                        <Text style={styles.label}>Mode</Text>
                                        <Text style={styles.valueText}>
                                            {"--"}
                                        </Text>
                                    </View>

                                    <Text style={styles.inputLabel}>
                                        Amount to apply
                                    </Text>

                                    <View style={styles.inputWrapper}>
                                      
                                  <ValidatedInput
    type="numberOnly"
    inputType="numeric"
    style={styles.inputField}
    placeholder="₹ 0.00"
    value={tempValue?.[item.invoiceId] || ""}
    maxLength={7}
    onChangeText={(text) => {

        if (text === "") {
            setTempValue((prev) => ({
                ...prev,
                [item.invoiceId]: "",
            }));

            setAppliedAmounts((prev) => ({
                ...prev,
                [item.invoiceId]: 0,
            }));

            return;
        }

        let amount = Number(text);

        const bookingAmount =
            Number(
                advanceInfo?.availableBalance ||
                advanceInfo?.advanceBalanceAmount ||
                0
            );

        const currentAppliedWithoutThis =
            Object.entries(appliedAmounts)
                .filter(([id]) => id !== item.invoiceId)
                .reduce(
                    (sum, [, val]) => sum + Number(val || 0),
                    0
                );

        const remainingBalance =
            bookingAmount - currentAppliedWithoutThis;

        const pendingAmount =
            Number(item?.pendingAmount || 0);

        const maxAllowed = Math.min(
            remainingBalance,
            pendingAmount
        );

        if (amount > maxAllowed) {

            setModalType("warning");
            setModalMessage(
                `Maximum allowed amount is ₹ ${maxAllowed}`
            );
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 1500);

            text = String(maxAllowed);
            amount = maxAllowed;
        }

        setTempValue((prev) => ({
            ...prev,
            [item.invoiceId]: text,
        }));

        setAppliedAmounts((prev) => ({
            ...prev,
            [item.invoiceId]: amount,
        }));
    }}
/>

                                        <TouchableOpacity
                                            style={styles.setBtn}
                                            onPress={() =>
                                                handleSetAmount(
                                                    item.invoiceId,
                                                    tempValue?.[item.invoiceId],
                                                    item.pendingAmount
                                                )
                                            }
                                        >
                                            <Text style={{ color: "#1E45E1" }}>Set</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            ))} */}




                        </View>



                        {/* Summary */}
                        <View style={styles.summary}>
                            <View style={styles.rowBetween}>
                                {/* <Text style={{ fontFamily: "Gilroy-Medium" }}>Amount Applied ({BillPdfdetails?.invoiceNumber})</Text> */}
                                <Text style={{ fontFamily: "Gilroy-Medium" }}>
                                    {source === "bill"
                                        ? `Amount Applied (${advanceInfo?.advanceInvoiceNumber || "ADV"})`
                                        : "Amount Applied (Booking)"}
                                </Text>
                                <Text style={{ fontFamily: "Gilroy-Bold" }}>₹ {totalApplied.toFixed(2)}</Text>
                            </View>

                            <View style={styles.rowBetween}>
                                <Text style={{ fontFamily: "Gilroy-Medium" }}>
                                    Available Balance
                                </Text>
                                <Text style={{ fontFamily: "Gilroy-Bold", }}>
                                    - ₹ {remainingBalance.toFixed(2)}
                                </Text>
                            </View>






                        </View>

                        {/* Bottom Buttons */}
                        <View style={styles.bottomBar}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={{ fontFamily: "Gilroy-Medium" }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                   style={[
        styles.applyBtn,
        isApplyTriggeredRef.current && { opacity: 0.6 }
    ]}
    onPress={handleApply}
    disabled={isApplyTriggeredRef.current}
                            >
                                <Text style={{ color: "#fff", fontFamily: "Gilroy-Medium" }}>Apply →</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    // header: {
    //   flexDirection: "row",
    //   alignItems: "center",
    //   padding: 16,
    //   paddingTop: 50
    // },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: Platform.OS === "android"
            ? StatusBar.currentHeight + 20
            : 20,
        marginBottom: 20,
    },

    headerTitle: {
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
        marginLeft: 10,
    },
    backIcon: { width: 22, height: 22, marginRight: 10 },

    userRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 10,
        backgroundColor: '#FAFAFD',
        padding: 10,
        paddingVertical: 20
    },

    avatar: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: "#4F46E5",
        justifyContent: "center",
        alignItems: "center",
    },

    userImg: {
        width: 55,
        height: 55,
        borderRadius: 30,
    },
    initialCircle: {
        width: 45,
        height: 45,
        borderRadius: 21,
        backgroundColor: "#E5E7EB",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 5
    },

    initialText: {
        fontSize: 13,
        fontFamily: "Gilroy-Bold",
        color: "#4B5563",
    },

    name: {
        fontSize: 15,
        fontFamily: "Gilroy-Semibold",
    },

    badge: {
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },

    badgeText: {
        fontSize: 11,
        color: "#92400E",
    },

    card: {
        paddingHorizontal: 16,
        marginTop: 10,
    },

    sectionTitle: {
        fontSize: 14,
        marginBottom: 4,
        fontFamily: "Gilroy-Semibold"
    },

    innerCard: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        padding: 12,
        marginTop: 15
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,
    },

    label: {
        fontSize: 13,
        color: "#6B7280",
        fontFamily: "Gilroy-Regular"
    },

    valueText: {
        fontSize: 13,
        fontFamily: "Gilroy-Medium"
    },

    amount: {
        fontSize: 15,
        fontFamily: "Gilroy-Semibold",
    },

    smallText: {
        fontSize: 12,
        color: "#9CA3AF",
        marginBottom: 8,
        fontFamily: "Gilroy-Semibold"
    },

    inputLabel: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 10,
        fontFamily: "Gilroy-Medium"
    },

    input: {
        borderWidth: 1,
        borderColor: "#4F46E5",
        borderRadius: 8,
        padding: 12,
        marginTop: 6,
        fontFamily: "Gilroy-Regular"
    },

    summary: {
        backgroundColor: "#F8F8F8",
        margin: 16,
        marginBottom: 2,
        padding: 12,
        borderRadius: 10,
    },

    totalLabel: {
        fontFamily: "Gilroy-Bold"
    },

    bottomBar: {
        flexDirection: "row",
        padding: 16,
        marginTop: 4,
        marginBottom: 45
    },

    cancelBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginRight: 10,
    },

    applyBtn: {
        flex: 1,
        backgroundColor: "#1E45E1",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },

    dropdownList: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 10,
        elevation: 3,
    },

    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    inputWrapper: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#4F46E5",
        borderRadius: 10,
        marginTop: 6,
    },

    inputField: {
        flex: 1,
        padding: 12,
        fontFamily: "Gilroy-Regular",
    },

    toggleBox: {
        flexDirection: "row",
        backgroundColor: "#E5E7EB",
        borderRadius: 8,
        margin: 6,
    },

    toggleBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },

    activeToggle: {
        backgroundColor: "#1E45E1",
    },

    activeText: {
        color: "#fff",
        fontFamily: "Gilroy-Bold",
    },

    inactiveText: {
        color: "#000",
    },
    customerdropdownBox: {
        borderWidth: 1,
        borderColor: "#D4D4D4",
        borderRadius: 10,
        padding: 14,
        marginTop: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    customerDropdownMenu: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 10,
        backgroundColor: "#fff",
        overflow: "hidden",
    },

    customerOption: {
        paddingVertical: 10,
        paddingHorizontal: 14,
    },

    customerOptionSelected: {
        backgroundColor: "#1D5BEE",
    },

    customerOptionText: {
        fontSize: 15,
        color: "#111",
    },

    customerOptionTextSelected: {
        color: "#fff",
        fontWeight: "600",
    },

    arrowIcon: {
        width: 18,
        height: 18,
        tintColor: "#6A6A6A",
    },
    customInputBox: {
        borderWidth: 1,
        borderColor: "#D4D4D4",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginTop: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    inputWrapper: {
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 6,
        alignItems: "center",
    },

    setBtn: {
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 6,
        marginRight: 8,
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginHorizontal: 16,
    },

    userCard: {
        backgroundColor: "#FAFAFD",
        padding: 16,
        borderRadius: 12,
        //   marginHorizontal: 16,
        marginBottom: 10,
    },

    innerDivider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 12,
    },

    bookingRowInside: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    bookingLabel: {
        fontSize: 14,
        fontFamily: "Gilroy-Medium",
        color: "#374151",
    },

    bookingAmount: {
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
    },

    emptyCard: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingVertical: 40,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        backgroundColor: "#fff",
    },

    emptyText: {
        fontSize: 15,
        color: "red",
        fontFamily: "Gilroy-Medium",
    },

});