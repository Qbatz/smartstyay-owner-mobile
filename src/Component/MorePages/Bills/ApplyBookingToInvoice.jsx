import React, { useState, useRef, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    SafeAreaView, ScrollView,
    KeyboardAvoidingView, Platform, StatusBar,
    TouchableWithoutFeedback,
    Animated,
    PanResponder
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
import MessageQuestion from "../../../Assets/Images/MessageQuestion.png"
import TickGreenIcon from "../../../Assets/Images/tickgreen.png"
import LeavePageScreen from "../../../ToastFile/LeavePageScreen";


export default function ApplyBookingToInvoice({ route }) {

    const navigation = useNavigation();
    // const route = useRoute();

    console.log("ponammale", route)

    const onSuccess = route?.params?.onSuccess;
    const type = route?.params?.type

    const { BillDetails, loading, GetAllBillDetails, GetAdvanceBookingBills, RecordPayment, GetInitializeRefundDetails,
        refundError, GetRecurringBills, recurringBills, BillPdfdetails, getBillsPdfDetails, getReceiptPdfDetails,
        downloadReceipt, downloadBill, GetReceiptsList, receiptsList, MarkBillAsUnpaid, UpdateBillDiscount, ApplyBillDiscount, InitializebookingBills, ApplyAdvanceToInvoices,
        advanceCreditDetails, getRetainerInvoiceDetail, retainerInvoiceDetail, ApplyRetainerToInvoices } = useContext(BillContext);
    const { activeHostelId } = useContext(CommonContexts);

     const [showLeavePageScreen, setShowLeavePageScreen] = useState(false);

    const isApplyTriggeredRef = useRef(false);
    const instructionSheetRef = useRef(new Animated.Value(0)).current;

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");

    const [initialDiscount, setInitialDiscount] = useState("");
    const [initialReason, setInitialReason] = useState("");
    const [initialType, setInitialType] = useState("");

    const bill = route?.params?.bill

    console.log("advanceCreditDetails", advanceCreditDetails);

    const discountAmountParam = route?.params?.discountAmount;
    const discountPercentageParam = route?.params?.discountPercentage;
    const totalamount = route?.params?.totalAmount
    const reasonParam = route?.params?.DiscountReason;


    const customer =
        advanceCreditDetails?.customerInfo || {};

    const invoicesList =
        advanceCreditDetails?.currentInvoiceInfo
            ? [advanceCreditDetails.currentInvoiceInfo]
            : [];

    const advanceInfo =
        advanceCreditDetails?.advanceInfo || {};






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

    const [showAmountField, setShowAmountField] = useState({})
    const [instructionSheet, setInstructionSheet] = useState(false)


    console.log("tempSinValue", tempValue)
    console.log(appliedAmounts)
    console.log(showAmountField)

    const bookingData = InitializebookingBills?.data;

    // const customer = InitializebookingBills?.customerInfo || {};
    // const invoicesList = InitializebookingBills?.listInvoices || [];
    // const advanceInfo = InitializebookingBills?.advanceInfo || {};

    console.log("invoicesList", invoicesList);

    const fetchRetainerDetail = async () => {
        const response = await getRetainerInvoiceDetail(activeHostelId, BillPdfdetails?.invoiceInfo?.invoiceId)
    }

    useEffect(() => {
        fetchRetainerDetail();
    }, [])


    const instructionSheetPan = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) instructionSheetRef.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 120) {
                    Animated.timing(instructionSheetRef, {
                        toValue: 700,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        setInstructionSheet(false);
                        instructionSheetRef.setValue(0);
                    });
                } else {
                    Animated.spring(instructionSheetRef, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;


    const totalApplied = Object.values(appliedAmounts).reduce(
        (sum, val) => sum + Number(val || 0),
        0
    );

    // const bookingAmount = advanceInfo?.availableBalance || 0;


    const customerInfo = retainerInvoiceDetail?.customerInfo;
    const currentInvoiceInfo = retainerInvoiceDetail?.currentInvoiceInfo;
    const advanceInfoList = retainerInvoiceDetail?.advanceInfo;
    const pendingAmount = retainerInvoiceDetail?.currentInvoiceInfo?.pendingAmount || 0;


    // const bookingAmount = (advanceInfo || []).reduce(
    //     (sum, item) => sum + Number(item.availableBalance || 0),
    //     0
    // );
    const bookingAmount = advanceInfo?.availableBalance


    const remainingBalance = bookingAmount - totalApplied;


    // console.log("customerSeethainfo", customerInfo)
    // console.log("advanceInfoList", advanceInfoList)
    // console.log(bookingAmount)








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
        console.log(value, maxAmount, invoiceId)

        // remove spaces
        const trimmedValue = value?.trim();

        // validation for 0,00,0000
        if (!trimmedValue || Number(trimmedValue) <= 0) {
            setModalType("warning");
            setModalMessage("Please Enter  valid Amount");
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000);

            return;
        }

        let amount = Number(trimmedValue);

        if (amount > maxAmount) {
            amount = maxAmount;
        }

        setAppliedAmounts((prev) => ({
            ...prev,
            [invoiceId]: amount,
        }));
    };

    const isValidNumber = (val) => {
        if (!val) return false;

        const num = Number(val);

        if (isNaN(num) || num <= 0) return false;

        return true;
    };



    console.log({
        discountType,
        discountAmount:
            discountType === "Amount" ? Number(discount) : 0,
        discountPercentage:
            discountType === "Percentage" ? Number(discount) : 0,
    });


    const sendpayload = {
        hostelId: bill?.hostelId,
        invoiceId: bill?.invoiceId,
        reason: reason || "",
        ...(discountType === "Amount" && {
            discountAmount: Number(discount),
        }),
        ...(discountType === "Percentage" && {
            discountPercentage: Number(discount),
        }),
    };

    console.log("sendpayload", sendpayload);

    const isEdit = route?.params?.isEdit;

    console.log("advancedtails", advanceInfo);



    console.log("ADVANCEid", advanceInfo?.advanceInvoiceId);



    // const handleApply = async () => {
    //     if (isApplyTriggeredRef.current) return;
    //     isApplyTriggeredRef.current = true;

    //     try {
    //         const bookingAmount = advanceInfo?.availableBalance || 0;

    //         const totalApplied = Object.values(appliedAmounts).reduce(
    //             (sum, val) => sum + Number(val || 0),
    //             0
    //         );

    //         if (totalApplied <= 0) {
    //             setModalType("warning");
    //             setModalMessage("Please Enter valid Amount");
    //             setShowSuccessModal(true);

    //             setTimeout(() => {
    //                 setShowSuccessModal(false);
    //             }, 2000);

    //             isApplyTriggeredRef.current = false;
    //             return;
    //         }

    //         if (totalApplied > bookingAmount) {
    //             setModalType("warning");
    //             setModalMessage("Applied amount exceeds booking amount");
    //             setShowSuccessModal(true);

    //             setTimeout(() => {
    //                 setShowSuccessModal(false);
    //             }, 2000);

    //             isApplyTriggeredRef.current = false;
    //             return;
    //         }

    //         const listItems = Object.entries(appliedAmounts).map(
    //             ([invoiceId, amount]) => ({
    //                 invoiceId,
    //                 amount: Number(amount),
    //             })
    //         );

    //         const res = await ApplyAdvanceToInvoices({
    //             hostelId: activeHostelId,
    //             invoiceId: advanceInfo?.invoiceId,
    //             listItems,
    //         });

    //         if (res?.success) {
    //             await GetAllBillDetails(activeHostelId);
    //             await GetAdvanceBookingBills(activeHostelId);
    //             await getBillsPdfDetails(activeHostelId, advanceInfo?.invoiceId)
    //             setModalType("success");
    //             setModalMessage("Applied successfully");
    //             setShowSuccessModal(true);

    //             setTimeout(() => {
    //                 navigation.goBack();
    //                 setShowSuccessModal(false);

    //                 setTimeout(() => {
    //                     isApplyTriggeredRef.current = false;
    //                 }, 2000)

    //             }, 1500);

    //         } else {

    //             setModalType("warning");
    //             setModalMessage(res?.message || "Something went wrong");
    //             setShowSuccessModal(true);

    //             setTimeout(() => {
    //                 setShowSuccessModal(false);
    //                 isApplyTriggeredRef.current = false;
    //             }, 2500);
    //         }
    //         // success / error logic

    //     } catch (error) {
    //         isApplyTriggeredRef.current = false;
    //     }

    //     finally {
    //         isApplyTriggeredRef.current = false;
    //     }
    // };

    // const handleApply = async () => {
    //     if (isApplyTriggeredRef.current) return;
    //     isApplyTriggeredRef.current = true;

    //     try {
    //         // const bookingAmount = advanceInfo?.availableBalance || 0;

    //         const totalApplied = Object.values(appliedAmounts).reduce(
    //             (sum, val) => sum + Number(val || 0),
    //             0
    //         );

    //         if (totalApplied <= 0) {
    //             setModalType("warning");
    //             setModalMessage("Please Enter valid Amount");
    //             setShowSuccessModal(true);

    //             setTimeout(() => {
    //                 setShowSuccessModal(false);
    //             }, 2000);

    //             isApplyTriggeredRef.current = false;
    //             return;
    //         }

    //         // if (totalApplied > bookingAmount) {
    //         //     setModalType("warning");
    //         //     setModalMessage("Applied amount exceeds booking amount");
    //         //     setShowSuccessModal(true);

    //         //     setTimeout(() => {
    //         //         setShowSuccessModal(false);
    //         //     }, 2000);

    //         //     isApplyTriggeredRef.current = false;
    //         //     return;
    //         // }

    //         const listItems = Object.entries(appliedAmounts).map(
    //             ([invoiceId, amount]) => ({
    //                 invoiceId,
    //                 amount: Number(amount),
    //             })
    //         );

    //         const retainersBreakup = Object.entries(appliedAmounts).
    //             filter(([_, amount]) => Number(amount) > 0).map(
    //                 ([invoiceId, amount]) => ({ invoiceId, amount: Number(amount) })
    //             );

    //         const payload = {
    //             appliedAmount: "",
    //             retainersBreakup: retainersBreakup
    //         }

    //         console.log("retainerPayload", payload)

    //         const res = await ApplyRetainerToInvoices({
    //             hostelId: activeHostelId,
    //             invoiceId: currentInvoiceInfo?.invoiceId,
    //             payload,
    //         });

    //         if (res?.success) {
    //             const res = await GetAllBillDetails(activeHostelId);
    //             console.log("getRetainerAllBill", res)
    //             await GetAdvanceBookingBills(activeHostelId);
    //             // await getBillsPdfDetails(activeHostelId, currentInvoiceInfo?.invoiceId)
    //             setShowSuccessModal(true);
    //             setModalType("success");
    //             setModalMessage("Applied successfully");


    //             setTimeout(() => {
    //                 navigation.goBack();
    //                 setShowSuccessModal(false);

    //                 setTimeout(() => {
    //                     isApplyTriggeredRef.current = false;
    //                 }, 2000)

    //             }, 1500);

    //         } else {
    //             setShowSuccessModal(true);
    //             setModalType("warning");
    //             setModalMessage(res?.message || "Something went wrong");


    //             setTimeout(() => {
    //                 setShowSuccessModal(false);
    //                 isApplyTriggeredRef.current = false;
    //             }, 2500);
    //         }
    //         // success / error logic

    //     } catch (error) {
    //         isApplyTriggeredRef.current = false;
    //     }

    // };

    const handleApply = async () => {

        if (isApplyTriggeredRef.current) return
        isApplyTriggeredRef.current = true

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

            console.log("Kandpayload", payload);
            console.log("ID", activeHostelId, advanceInfo?.invoiceId,);



            const res = await ApplyAdvanceToInvoices({
                hostelId: activeHostelId,
                invoiceId: advanceInfo?.invoiceId,
                listItems,
            });


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

                setShowSuccessModal(true);
                setModalType("warning");
                setModalMessage(res?.message || "Something went wrong");
                

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


    const invoicesLists = [{ id: 0, invoiceId: 'I2223', invoiceType: 'Booking', pendingAmount: '200', invoiceNumber: "INV-009" },
    { id: 1, invoiceId: 'I2224', invoiceType: 'Rent', pendingAmount: '300', invoiceNumber: "INV-010" },
    { id: 2, invoiceId: 'I2225', invoiceType: 'Advance', pendingAmount: '400', invoiceNumber: "INV-011" }
    ]


    const clickedRetainAmntField = (invoiceId) => {
        setShowAmountField(prev => ({ ...prev, [invoiceId]: !prev[invoiceId], }))
    }






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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={ArrowLeft} style={styles.backIcon} />
                        </TouchableOpacity>
                        {/* <Text style={styles.headerTitle}>Apply Booking to Invoice</Text> */}

                        <Text style={styles.headerTitle}>Apply Booking To InVoice</Text>
                    </View>
                    <TouchableOpacity onPress={() => setInstructionSheet(!instructionSheet)}>
                        <Image source={MessageQuestion} style={{ width: 22, height: 22, tintColor: '#292D32' }} />
                    </TouchableOpacity>
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
                                                {customer?.floorName || "Ground Floor"}
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
                                <Text style={styles.bookingLabel}>Booking Amount</Text>
                                <Text style={styles.bookingAmount}>
                                    ₹ {advanceInfo?.availableBalance || 0}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 5 }}>
                                <Text style={{
                                    backgroundColor: '#FFEFCF', fontSize: 12, fontFamily: 'Gilroy-Medium', borderRadius: 8,
                                    paddingHorizontal: 8, paddingVertical: 4, marginRight: 5
                                }}>
                                    Rental Inv</Text>

                                <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Medium', color: '#1E45E1', marginLeft: 4 }}>
                                    {advanceInfo?.invoiceNumber}</Text>
                            </View>

                        </View>



                        {/* Invoice Card */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Unpaid Invoice</Text>

                            {/* <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#4B4B4B', marginTop: 4 }}>
                                Unpaid Invoice</Text> */}

                            {invoicesList?.map((item, index) => (
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

                                    {/* <View style={styles.rowBetween}>
                                        <Text style={styles.label}>Due Date</Text>
                                        <Text style={styles.valueText}>
                                            {item?.dueDate || "--"}
                                        </Text>
                                    </View>

                                    <View style={styles.rowBetween}>
                                        <Text style={styles.label}>Mode</Text>
                                        <Text style={styles.valueText}>
                                            {"--"}
                                        </Text>
                                    </View> */}

                                    <View style={{ borderWidth: 0.8, borderColor: '#F2F2F2', marginVertical: 8 }} />

                                    {/* Input */}

                                    {showAmountField[item.invoiceId] ? (
                                        <>
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
                                                        // Allow clearing
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

                                                        // Only allow digits
                                                        if (!/^\d+$/.test(text)) {
                                                            return;
                                                        }

                                                        // Don't allow 0 as first digit
                                                        if (text.startsWith("0")) {
                                                            return;
                                                        }

                                                        let amount = Number(text);

                                                        // Safety check
                                                        if (!Number.isFinite(amount)) {
                                                            return;
                                                        }

                                                        const appliedWithoutCurrent = Object.entries(appliedAmounts)
                                                            .filter(([invoiceId]) => invoiceId !== item.invoiceId)
                                                            .reduce(
                                                                (sum, [, value]) => sum + Number(value || 0),
                                                                0
                                                            );

                                                        const availableBalance = Number(
                                                            advanceInfo?.availableBalance || 0
                                                        );

                                                        const pendingAmount = Number(
                                                            item?.pendingAmount || 0
                                                        );

                                                        const remainingBalance =
                                                            availableBalance - appliedWithoutCurrent;

                                                        const maxAllowed = Math.min(
                                                            remainingBalance,
                                                            pendingAmount
                                                        );

                                                        if (amount > maxAllowed) {
                                                            amount = Math.max(maxAllowed, 0);
                                                        }

                                                        setTempValue((prev) => ({
                                                            ...prev,
                                                            [item.invoiceId]: String(amount),
                                                        }));

                                                        setAppliedAmounts((prev) => ({
                                                            ...prev,
                                                            [item.invoiceId]: amount,
                                                        }));
                                                    }}
                                                />

                                                {/* <TouchableOpacity
                                                    style={styles.setBtn}
                                                    onPress={() =>
                                                        handleSetAmount(
                                                            item.invoiceId,
                                                            tempValue?.[item.invoiceId],
                                                            Math.min(
                                                                item.pendingAmount,
                                                                remainingBalance + (appliedAmounts[item.invoiceId] || 0)
                                                            )
                                                        )
                                                    }
                                                >
                                                    <Text style={{ color: "#1E45E1" }}>Set</Text>
                                                </TouchableOpacity> */}
                                            </View>
                                        </>
                                    ) : <TouchableOpacity style={{
                                        alignSelf: 'flex-end', backgroundColor: '#1E45E1', paddingHorizontal: 14,
                                        paddingVertical: 6, borderRadius: 28, marginTop: 3, marginRight: 4, flexDirection: 'row', alignItems: 'center'
                                    }}
                                        onPress={() => clickedRetainAmntField(item.invoiceId)}>
                                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Medium', color: '#FFFFFF', marginRight: 5 }}>
                                            Retain</Text>

                                        <Image source={ArrowLeft} style={{ width: 18, height: 18, tintColor: '#FFFFFF', transform: [{ rotate: "180deg" }], }} />
                                    </TouchableOpacity>}



                                </View>
                            ))}




                        </View>



                        {/* Summary */}
                        <View style={styles.summary}>
                            <View style={styles.rowBetween}>
                                <Text style={{ fontFamily: "Gilroy-Medium" }}>Amount Applied </Text>
                                <Text style={{ fontFamily: "Gilroy-Bold" }}> ₹ {totalApplied.toFixed(2)}</Text>
                            </View>

                            <View style={styles.rowBetween}>
                                <Text style={{ fontFamily: "Gilroy-Medium" }}>
                                    Available Balance
                                </Text>
                                <Text style={{ fontFamily: "Gilroy-Bold" }}>
                                    ₹ {remainingBalance.toFixed(2)}
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
                {instructionSheet && (
                    <View style={styles.sheetOverlay}>

                        <TouchableWithoutFeedback onPress={() => {
                            setInstructionSheet(false)
                        }}
                        >
                            <View style={{ flex: 1 }} />
                        </TouchableWithoutFeedback>

                        <Animated.View
                            style={[
                                styles.sheet,
                                {
                                    // height: isPaid ? "60%" : isPartial ? "80%" : "60%",
                                    maxHeight: '95%',
                                    transform: [{ translateY: instructionSheetRef }]
                                }
                            ]}
                            {...instructionSheetPan.panHandlers}
                        >
                            <View style={styles.sheetHandle} />

                            <View style={{ marginBottom: 50 }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={TickGreenIcon} style={{ width: 24, height: 24, marginRight: 6 }} />
                                    <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', color: '#1F2633' }}>
                                        How it works</Text>
                                </View>

                                <View style={{ borderWidth: 0.8, borderColor: '#E7E7E7', marginVertical: 20 }} />

                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#3A3A3A', marginRight: 4, marginTop: 2 }}>1.</Text>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', lineHeight: 21, color: '#3A3A3A' }}>
                                        Your available retainer balance can be used to pay outstanding invoices.</Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#3A3A3A', marginRight: 4, marginTop: 2 }}>2.</Text>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', lineHeight: 21, color: '#3A3A3A' }}>
                                        Select one or more invoices and choose the amount to adjust. The adjusted amount will be
                                        deducted from your retainer balance and applied to the selected invoices.</Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', color: '#3A3A3A', marginRight: 4, marginTop: 2 }}>
                                        3.</Text>
                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Regular', lineHeight: 21, color: '#3A3A3A' }}>
                                        Any remaining invoice balance can be paid separately using your preferred payment method.</Text>
                                </View>




                                {/* <Text style={{fontSize:14,fontFamily:'Gilroy-Regular',lineHeight:20,color:'#3A3A3A',marginTop:10}}>
                                2.
                                </Text>

                                <Text style={{fontSize:14,fontFamily:'Gilroy-Regular',lineHeight:20,color:'#3A3A3A',marginTop:10}}>
                                3.</Text> */}
                            </View>
                        </Animated.View>
                    </View>
                )}
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
        marginBottom: 20, justifyContent: 'space-between'
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
    sheet: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30,
        // minHeight: 400,
    },
    sheetOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
        zIndex: 9999,
    },
    sheetHandle: {
        width: 60,
        height: 5,
        backgroundColor: "#ccc",
        alignSelf: "center",
        borderRadius: 30,
        marginBottom: 15,
    },



});