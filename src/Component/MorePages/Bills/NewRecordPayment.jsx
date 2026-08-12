import React, { useContext, useRef, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image, TextInput, ScrollView, TouchableWithoutFeedback } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import Profile from "../../../Assets/Images/profile.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { useNavigation } from "@react-navigation/native";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { BankingContext } from "../../../Context/BankingContext";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import Loader from "../../Loader/Loader";
import SuccessModal from "../../../ToastFile/ToastPage";
import EditConfigure from "../../../Assets/Images/Edit_Configure.png"
import ActiveIcon from "../../../Assets/Images/switch_hostel.png";
import LeavePageScreen from "../../../ToastFile/LeavePageScreen"



const NewRecordPayment = ({ route }) => {

    const navigation = useNavigation();
    const isTriggeredRef = useRef(false)
    const { selectedBill, BillPdfdetails, onPaymentSuccess } = route?.params
    const [paidDate, setPaidDate] = useState("");
    const [openPaidDate, setOpenPaidDate] = useState(false);
    const [tenantName, setTenantName] = useState("");
    const [paidAmount, setPaidAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [description,setDescription]=useState("")
    const [error, setError] = useState("");
    const [showPaymentMode, setShowPaymentMode] = useState(false);
    const [selectedMode, setSelectedMode] = useState("");
    const [showTransferAcnt, setShowTransferAcnt] = useState(false);
    const [selectedTransferAcnt, setSelectedTransferAcnt] = useState("")
    const { GetAdvanceCreditDetails, RecordPayment, GetAllBillDetails, loading, InitializeRecordPaymentDetails } = useContext(BillContext);
    const { activeHostelId } = useContext(CommonContexts);
    const { bankList, getBankListByHostel } = useContext(BankingContext);
    const [amountError, setAmountError] = useState("");
    const [dateError, setDateError] = useState("");
    const [modeError, setModeError] = useState("");
    const [balanceAmount, setBalanceAmount] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");
    const [recordLoading, setRecordLoading] = useState(false)
    const [showLeavePageScreen,setShowLeavePageScreen]=useState(false)

    console.log("InitializeRecordPaymentDetails", InitializeRecordPaymentDetails);


    console.log(selectedBill)

   

    const today = dayjs();
    const invoiceDate = dayjs(selectedBill?.invoiceDate, "DD-MM-YYYY");

    const handleLeaveScreen=()=>{
        if(paidAmount.trim() || paidDate || selectedMode || transactionId.trim() ){
            setShowLeavePageScreen(true)
        }else{
            navigation.goBack();
        }
    }

    const handleBookingApplyInvoices = async () => {

        navigation.navigate("BillsApplyInvoices");

        const AdvanceCredits = await GetAdvanceCreditDetails({
            hostelId: activeHostelId,
            invoiceId: selectedBill?.invoiceId,
            type: "Credit", // booking invoice
        })
        // setShowMenu(false);
        // setShowBillDetails(false)

    }

    const handlePaidAmountChange = (text) => {
        setAmountError("");

        let cleaned = text.replace(/[^0-9.]/g, "");

        const parts = cleaned.split(".");
        if (parts.length > 2) {
            cleaned = parts[0] + "." + parts[1];
        }

        if (parts[1]?.length > 2) {
            cleaned = parts[0] + "." + parts[1].slice(0, 2);
        }

        let num = parseFloat(cleaned);
        if (isNaN(num)) num = 0;


        if (num > (InitializeRecordPaymentDetails?.pendingAmount || 0)) {
            num = InitializeRecordPaymentDetails?.pendingAmount || 0;
            cleaned = String(num);
        }

        setPaidAmount(cleaned);
        setBalanceAmount((InitializeRecordPaymentDetails?.pendingAmount || 0) - num)

        // if (num > (selectedBill?.dueAmount || 0)) {
        //     num = selectedBill?.dueAmount || 0;
        //     cleaned = String(num);
        // }

        // setPaidAmount(cleaned);
        // setBalanceAmount((selectedBill?.dueAmount || 0) - num);
    };

    const transactionOptions = (bankList || []).map((item) => ({
        label: `${item.accountHolderName || "Account"} - ${item.accountType}`,
        value: item.bankingId,
    }));

    const isDisabledPaidDate = (d) => {
        if (!d) return false;

        if (invoiceDate && d.isBefore(invoiceDate, "day")) return true;
        if (d.isAfter(today, "day")) return true;

        return false;
    };


    const paidMarkedDates = {};

    for (let i = -365; i <= 365; i++) {
        const d = dayjs().add(i, "day");
        const key = d.format("YYYY-MM-DD");

        if (isDisabledPaidDate(d)) {
            paidMarkedDates[key] = {
                disabled: true,
                disableTouchEvent: true,
                customStyles: {
                    container: {
                        backgroundColor: "#F3F4F6",
                        opacity: 0.4,
                        borderRadius: 8,
                    },
                    text: {
                        color: "#9CA3AF",
                    },
                },
            };
        }
    }

    const formatDateForPayload = (date) => {
        if (!date) return null;

        // works for dayjs & Date
        return dayjs(date).format("DD-MM-YYYY");
    };

    const handleSaveRecordPayment = async () => {
        if (isTriggeredRef.current) return;
        isTriggeredRef.current = true;
        let isValid = true;

        setAmountError("");
        setDateError("");
        setModeError("");

        const formattedPaidDate = formatDateForPayload(paidDate);

        if (!paidAmount || Number(paidAmount) <= 0) {
            setAmountError("Please Enter Amount");
            isValid = false;
        }

        if (!formattedPaidDate) {
            setDateError("Please Select Date");
            isValid = false;
        } else {
            const billDate = dayjs(selectedBill?.invoiceDate, "DD/MM/YYYY");
            const paid = dayjs(formattedPaidDate, "DD-MM-YYYY");

            if (paid.isBefore(billDate, "day")) {
                setDateError("Paid date should not be before Bill date");
                isValid = false;
            }
        }

        if (!selectedMode) {
            setModeError("Please Select Transaction Type");
            isValid = false;
        }

        if (!isValid) {
            isTriggeredRef.current = false;
            return;
        };


        try {
            // setRecordLoading(true);

            const res = await RecordPayment({
                hostelId: activeHostelId,
                invoiceId: selectedBill?.invoiceId,
                data: {
                    bankId: selectedMode,
                    paymentDate: formattedPaidDate,
                    referenceId: transactionId,
                    amount: Number(paidAmount),
                },
            });

            console.log("PayRecord", res)

            if (res.success) {
                await GetAllBillDetails(activeHostelId);
                //   setShowBillDetails(false)
                //   setShowRecordPayment(false);
                if (onPaymentSuccess) {
                    onPaymentSuccess();
                }

                setModalType("success");
                setModalMessage(res?.data || "Payment recorded successfully");
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false)
                    navigation.goBack();
                }, 1500);
            } else if (res.payableAmount) {
                setModalType("warning");
                setModalMessage(res.payableAmount);
                setShowSuccessModal(true);
                setTimeout(() => setShowSuccessModal(false), 1500);
            } else {
                throw new Error();
            }
        } catch {
            setModalType("warning");
            setModalMessage("Something went wrong");
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 1500);
        } finally {
            setRecordLoading(false);
            isTriggeredRef.current = false;
        }
    };

    return (
        <>
            {(loading || recordLoading) && <Loader />}
            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={modalMessage}
                type={modalType}
            />
            <View style={styles.mainheadPage}>


                  <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginRight: 5 }}
                        onPress={handleLeaveScreen} >
                        <Image source={ArrowLeft} style={{ width: 22, height: 22 }} />
                    </TouchableOpacity>
                    <Text style={styles.pageHead}>Payment for {BillPdfdetails?.invoiceNumber || selectedBill?.invoiceNumber}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                    <Text style={styles.tntNameTxt}>Tenant Name <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    {/* <TextInput
                        style={styles.txtInputBox}
                        placeholder="Enter name"
                        value={tenantName}
                        onChangeText={(text) => {
                            const filtered = text.replace(/[^a-zA-Z0-9\s]/g, "");
                            setTenantName(filtered)
                        }} /> */}

                    <View style={[styles.txtInputBox, { justifyContent: 'center' }]}>
                        {/* <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Medium', }}>
                            {BillPdfdetails?.customerInfo?.fullName}</Text> */}
                        <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Medium' }}>
                            {InitializeRecordPaymentDetails?.customerInfo?.fullName}
                        </Text>
                    </View>

                    <View style={{ backgroundColor: '#F9FAFB', borderRadius: 10, padding: 14, marginTop: 10 }}>
                        <View style={styles.prflField}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                {/* <Image source={Profile} style={{ width: 50, height: 50, borderRadius: 25 }} /> */}

                                {/* {BillPdfdetails?.customerInfo?.profilePic ?
                                    <Image source={{ uri: BillPdfdetails?.customerInfo?.profilePic }}
                                        style={{ width: 50, height: 50, borderRadius: 25 }} />
                                    :
                                    <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#e1e8f0', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Bold' }}>
                                            {BillPdfdetails?.customerInfo?.initials}</Text>
                                    </View>} */}

                                {InitializeRecordPaymentDetails?.customerInfo?.profilePic ? (
                                    <Image
                                        source={{
                                            uri: InitializeRecordPaymentDetails?.customerInfo?.profilePic,
                                        }}
                                        style={{ width: 50, height: 50, borderRadius: 25 }}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            backgroundColor: "#e1e8f0",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={{ fontSize: 16, fontFamily: "Gilroy-Bold" }}>
                                            {InitializeRecordPaymentDetails?.customerInfo?.initials}
                                        </Text>
                                    </View>
                                )}

                                <View style={{ marginLeft: 8, flex: 1 }}>
                                    {/* <Text style={[styles.tntName, { marginRight: 6 }]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail">{BillPdfdetails?.customerInfo?.fullName}</Text> */}

                                    <Text
                                        style={[styles.tntName, { marginRight: 6 }]}
                                        numberOfLines={1}
                                    >
                                        {InitializeRecordPaymentDetails?.customerInfo?.fullName}
                                    </Text>

                                    {/* <Text style={styles.hstlDtl}>
                                        {BillPdfdetails?.stayInfo?.floorName} || {BillPdfdetails?.stayInfo?.roomName} || {BillPdfdetails?.stayInfo?.bedName}
                                    </Text> */}

                                    <Text style={styles.hstlDtl}>
                                        {InitializeRecordPaymentDetails?.stayInfo?.floorName}{" | "}
                                        {InitializeRecordPaymentDetails?.stayInfo?.roomName}{" | "}
                                        {InitializeRecordPaymentDetails?.stayInfo?.bedName}
                                    </Text>
                                </View>
                            </View>

                            <Image source={ActiveIcon} style={{ width: 20, height: 20, marginRight: 4 }} />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', }}>Build to</Text>
                            <Image source={EditConfigure} style={{ width: 15, height: 15, marginLeft: 5 }} />
                        </View>

                        {/* <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#5E6470', marginTop: 12 }}>
                            Plot No
                        </Text> */}

                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#5E6470', marginTop: 5, lineHeight: 20 }}>
                            {BillPdfdetails?.customerInfo?.fullAddress || "N/A"}
                        </Text>

                        {/* <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#5E6470', marginTop: 4 }}>
                            Chennai -60007</Text> */}

                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold', color: '#5E6470', marginTop: 10 }}>
                            {BillPdfdetails?.customerInfo?.countryCode} {BillPdfdetails?.customerInfo?.customerMobileNo}</Text>

                    </View>

                    <Text style={styles.txtinputhead}>Paid Amount(INR) <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TextInput
                        style={styles.txtInputBox}
                        placeholder="Enter Paid Amount"
                        value={paidAmount}
                        keyboardType="number-pad"
                        // onChangeText={(text) => {
                        //     if (text > totalAmount) return;
                        //     setPaidAmount(text)
                        // }} 
                        onChangeText={handlePaidAmountChange}
                    />

                    {amountError && <ErrorMessage message={amountError} type="error" />}

                    <View style={styles.crdtsBox}>
                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular' }}>Credits Available: {" "}
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>
                                ₹ {BillPdfdetails?.invoiceInfo?.avilableAmountToRedeem ?
                                    BillPdfdetails?.invoiceInfo?.avilableAmountToRedeem : "N/A"}</Text></Text>
                        <TouchableOpacity onPress={handleBookingApplyInvoices}
                            disabled={!BillPdfdetails?.invoiceInfo?.canRedeem}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#338BFF' }}>
                                Apply Now
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* <Text style={styles.txtinputhead}>Balance Payable If</Text>

                    <TextInput
                        style={styles.blncpyablBox}
                        placeholder="₹ 0.00" /> */}

                    <Text style={styles.txtinputhead}>Paid Date <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TouchableOpacity style={styles.paidDateBox}
                        onPress={() => {
                            setDateError("");
                            setOpenPaidDate(true);
                        }}>
                        {/* <Text>{paidDate ? paidDate : "DD/MM/YYYY"}</Text> */}
                        <Text>
                            {paidDate ? dayjs(paidDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
                        </Text>
                        <Image
                            source={CalendarIcon}
                            style={{ width: 22, height: 22, tintColor: "#444" }}
                        />
                    </TouchableOpacity>
                    {dateError && <ErrorMessage message={dateError} type="error" />}

                    <View style={styles.spltBoxField}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={styles.txtinputhead}>Payment method <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                            <TouchableOpacity onPress={() => setShowPaymentMode(!showPaymentMode)}
                                style={[styles.paidDateBox, { marginRight: 4 }]}>
                                <Text>
                                    {/* {selectedMode ? selectedMode : "Enter Mode"} */}
                                    {selectedMode
                                        ? transactionOptions.find(o => o.value === selectedMode)?.label
                                        : "Select payment mode"}
                                </Text>

                                <Image
                                    source={DownArrow}
                                    style={{ width: 18, height: 18, tintColor: "#555" }}
                                />
                            </TouchableOpacity>


                            {/* {showPaymentMode && (
                                <>
                                    <TouchableWithoutFeedback onPress={() => setShowPaymentMode(false)}>
                                        <View style={styles.dropdownOverlay} />
                                    </TouchableWithoutFeedback>
                                    <View style={styles.dropdownMenu}>
                                        <ScrollView keyboardShouldPersistTaps="always"
                                            nestedScrollEnabled={true}
                                            showsVerticalScrollIndicator={true}>
                                            {paymentModeTypes.map(i => (
                                                <TouchableOpacity key={i.id}
                                                    style={{ paddingVertical: 12, paddingHorizontal: 14 }}
                                                    onPress={() => setSelectedMode(i.lable)}>
                                                    <Text>{i.lable}</Text>
                                                </TouchableOpacity>

                                            ))}
                                        </ScrollView>
                                    </View>
                                </>

                            )} */}
                            {showPaymentMode && (
                                <View style={styles.transactiondropdown}>
                                    <ScrollView
                                        nestedScrollEnabled
                                        scrollEnabled={transactionOptions.length > 3}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        {transactionOptions.map(opt => {
                                            const isSelected = selectedMode === opt.value;

                                            return (
                                                <TouchableOpacity
                                                    key={opt.value}
                                                    style={[
                                                        styles.dropdownRow,
                                                        isSelected && styles.dropdownRowSelected,
                                                    ]}
                                                    onPress={() => {
                                                        setSelectedMode(opt.value);
                                                        setShowPaymentMode(false);
                                                        setModeError("");
                                                    }}
                                                >
                                                    <Text
                                                        style={
                                                            isSelected
                                                                ? styles.dropdownTextSelected
                                                                : styles.dropdownText
                                                        }
                                                    >
                                                        {opt.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            )}

                            {modeError && <ErrorMessage message={modeError} type="error" />}




                        </View>

                        {/* <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={styles.txtinputhead}>Transferring Account <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                            <TouchableOpacity onPress={()=>setShowTransferAcnt(!showTransferAcnt)}
                             style={styles.paidDateBox}>
                                <Text>{selectedTransferAcnt?selectedTransferAcnt:"Enter Account"}</Text>

                                <Image
                                    source={DownArrow}
                                    style={{ width: 18, height: 18, tintColor: "#555" }}
                                />
                            </TouchableOpacity>

                             {showTransferAcnt && (
                                <>
                                    <TouchableWithoutFeedback onPress={() => setShowTransferAcnt(false)}>
                                        <View style={styles.dropdownOverlay} />
                                    </TouchableWithoutFeedback>
                                    <View style={styles.dropdownMenu}>
                                        <ScrollView keyboardShouldPersistTaps="always"
                                            nestedScrollEnabled={true}
                                            showsVerticalScrollIndicator={true}>
                                            {TransferAcntTypes.map(i => (
                                                <TouchableOpacity key={i.id}
                                                 style={{paddingVertical:12,paddingHorizontal:14}}
                                                 onPress={()=>setSelectedTransferAcnt(i.lable)}>
                                                    <Text>{i.lable}</Text>
                                                </TouchableOpacity>

                                            ))}
                                        </ScrollView>
                                    </View>
                                </>

                            )}
                        </View> */}

                    </View>

                    <Text style={styles.txtinputhead}>Transaction ID</Text>

                    <TextInput
                        style={styles.txtInputBox}
                        value={transactionId}
                        placeholder="Enter Transaction ID"
                        onChangeText={(text) => {
                            const filteredText = text.replace(
                                /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/
                                , ""
                            );

                            setTransactionId(filteredText);
                        }} />

                    <Text style={styles.txtinputhead}>Notes/Description</Text>

                    <TextInput
                        style={styles.descTxtBox}
                        value={description}
                        placeholder="Enter Description" 
                        onChangeText={(text)=>{
                            const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                            setDescription(onlyLetters)
                        }}/>

                    <View style={styles.sumryBox}>
                        <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Bold', color: '#FFFFFF99' }}>SUMMARY</Text>

                        <Text style={styles.amntTxt}>₹ {InitializeRecordPaymentDetails?.pendingAmount ?? 0}</Text>

                        <View style={{ borderColor: '#FFFFFF1A', marginVertical: 14, borderWidth: 0.8 }} />

                        <View style={styles.spcebtn}>
                            <Text style={styles.paidBlncAmtHeadTxt}>Paid Amount</Text>
                            <Text style={styles.pidBlncAmntTxt}>₹ {paidAmount ? paidAmount : "0.00"}</Text>
                        </View>

                        <View style={[styles.spcebtn, { marginTop: 10 }]}>
                            <Text style={styles.paidBlncAmtHeadTxt}>Balance Amount(Outstanding)</Text>
                            <Text style={styles.pidBlncAmntTxt}>₹ {balanceAmount}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 20, alignItems: 'center', alignSelf: 'flex-end', flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginRight: 8 }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSaveRecordPayment}
                            style={{
                                borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#1E45E1',
                                marginLeft: 5
                            }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', color: '#FFFFFF' }}>
                                Record {paidAmount ? `₹ ${paidAmount} →` : ""}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            {openPaidDate && (
                <View style={styles.dateOverlay}>
                    <TouchableWithoutFeedback onPress={() => setOpenPaidDate(false)}>
                        <View style={styles.overlayBg} />
                    </TouchableWithoutFeedback>

                    <View style={styles.calendarContainer}>
                        <Calendar
                            markingType="custom"
                            markedDates={paidMarkedDates}
                            current={
                                paidDate
                                    ? dayjs(paidDate).format("YYYY-MM-DD")
                                    : today.format("YYYY-MM-DD")
                            }
                            onDayPress={(day) => {
                                if (paidMarkedDates[day.dateString]?.disabled) return;

                                setPaidDate(new Date(day.dateString))
                                setOpenPaidDate(false);
                            }}
                            theme={{
                                todayTextColor: "#2563EB",
                                selectedDayBackgroundColor: "#2563EB",
                                selectedDayTextColor: "#FFFFFF",
                                textDisabledColor: "#9CA3AF",
                                arrowColor: "#111827",
                            }}
                        />
                    </View>
                </View>
            )}

            <LeavePageScreen 
            visible={showLeavePageScreen}
            onClose={()=>setShowLeavePageScreen(false)}
            discardClose={()=>{             
                setShowLeavePageScreen(false)
                setTimeout(() => {
                    navigation.goBack()
                }, 300);               
            }}/>
        </>
    )

}

const styles = StyleSheet.create({
    mainheadPage: {
        backgroundColor: '#ffffff',
        flex: 1,
        padding: 20,
        paddingTop: 50
    },
    pageHead: {
        fontSize: 20,
        fontFamily: 'Gilroy-Semibold'
    },
    tntNameTxt: {
        fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 24,
    },
    txtInputBox: {
        borderWidth: 1, borderColor: '#D9D9D9',
        borderRadius: 12, height: 50, paddingHorizontal: 12,
        marginTop: 10, fontSize: 14, fontFamily: 'Gilroy-Regular'
    },
    tntName: {
        fontSize: 18, fontFamily: 'Gilroy-Semibold',
    },
    hstlDtl: {
        fontSize: 12, fontFamily: 'Gilroy-Medium', color: "#616161",
        marginTop: 7
    },
    prflField: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    txtinputhead: {
        fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 12,
    },
    crdtsBox: {
        backgroundColor: '#FBFBFB', justifyContent: 'space-between',
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 14, paddingVertical: 15, borderRadius: 12,
        marginTop: 12
    },
    blncpyablBox: {
        borderWidth: 1, borderColor: '#C7C7C7', backgroundColor: '#F6F6F6',
        borderRadius: 12, height: 50, paddingHorizontal: 12,
        marginTop: 10
    },
    paidDateBox: {
        borderWidth: 1, borderColor: '#D9D9D9', flexDirection: 'row',
        borderRadius: 12, height: 50, paddingHorizontal: 14, paddingVertical: 10,
        marginTop: 10, justifyContent: 'space-between', alignItems: 'center'
    },
    spltBoxField: {
        flexDirection: 'row',
        flex: 1, justifyContent: 'space-between',
        marginTop: 14
    },
    descTxtBox: {
        borderWidth: 1, borderColor: '#D9D9D9',
        borderRadius: 12, height: 80, paddingHorizontal: 12,
        marginTop: 10, textAlignVertical: 'top',fontSize:14,fontFamily:'Gilroy-Regular'
    },
    sumryBox: {
        backgroundColor: '#2633A0', borderRadius: 10, padding: 14,
        marginTop: 16
    },
    spcebtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    amntTxt: {
        fontSize: 24, fontFamily: 'Gilroy-Bold', color: '#FFFFFF', marginTop: 10
    },
    paidBlncAmtHeadTxt: {
        fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#FFFFFF'
    },
    pidBlncAmntTxt: {
        fontSize: 14, fontFamily: 'Gilroy-Semibold', color: '#FFFFFF'
    },
    dropdownMenu: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        zIndex: 1000,
        marginTop: 5,

        maxHeight: 150,
    },
    transactiondropdown: {
        position: "absolute",
        top: 100,          // 👈 input height
        left: 0,
        right: 0,

        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        zIndex: 9999,
        elevation: 8,

        maxHeight: 160,
    },
    dropdownRow: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    dropdownRowSelected: {
        backgroundColor: "#1E45E1",
    },

    dropdownText: {
        color: "#111",
        fontSize: 15,
    },

    dropdownTextSelected: {
        color: "#fff", // 👈 WHITE
        fontSize: 15,
        fontFamily: "Gilroy-Semibold",
    },
    dateOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },

    overlayBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },

    calendarContainer: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 10,
        width: "85%",
        elevation: 10,
    },

})
export default NewRecordPayment;