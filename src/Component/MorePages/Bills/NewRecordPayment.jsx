import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image, TextInput, ScrollView, TouchableWithoutFeedback } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import Profile from "../../../Assets/Images/profile.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { useNavigation } from "@react-navigation/native";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";




const NewRecordPayment = () => {

    const navigation = useNavigation();
    const [paidDate, setPaidDate] = useState("");
    const [tenantName, setTenantName] = useState("");
    const [paidAmount, setPaidAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [error, setError] = useState("");
    const [showPaymentMode, setShowPaymentMode] = useState(false);
    const [selectedMode, setSelectedMode] = useState("");
    const [showTransferAcnt,setShowTransferAcnt]=useState(false);
    const [selectedTransferAcnt, setSelectedTransferAcnt]=useState("")

    const totalAmount = 15000;

    const balanceAmount = totalAmount - paidAmount;

    const paymentModeTypes = [{ id: 0, lable: "Gpayf" }, { id: 1, lable: "phonepay" }, { id: 2, lable: "Cash" }]

     const TransferAcntTypes = [{ id: 0, lable: "HHtb" }, { id: 1, lable: "BTT Acn" }, { id: 2, lable: "Gpytt" }]
    return (
        <>
            <View style={styles.mainheadPage}>


                <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginRight: 5 }}
                        onPress={() => navigation.goBack()} >
                        <Image source={ArrowLeft} style={{ width: 22, height: 22 }} />
                    </TouchableOpacity>
                    <Text style={styles.pageHead}>Record Payment</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                    <Text style={styles.tntNameTxt}>Tenant Name <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TextInput
                        style={styles.txtInputBox}
                        placeholder="Enter name"
                        value={tenantName}
                        onChangeText={(text) => {
                            const filtered = text.replace(/[^a-zA-Z0-9\s]/g, "");
                            setTenantName(filtered)
                        }} />

                    <View style={{ backgroundColor: '#F9FAFB', borderRadius: 10, padding: 14, marginTop: 10 }}>
                        <View style={styles.prflField}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Profile} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                <View style={{ marginLeft: 8 }}>
                                    <Text style={styles.tntName}>Mithuraj</Text>

                                    <Text style={styles.hstlDtl}>G-FLoor | Room 103 | Bed02</Text>
                                </View>
                            </View>

                            <Image source={ArrowLeft} style={{ width: 20, height: 20 }} />
                        </View>

                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 14 }}>Build To</Text>

                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#5E6470', marginTop: 12 }}>
                            Plot No
                        </Text>

                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#5E6470', marginTop: 5 }}>
                            Ramsay Nager, 4th nager, chennai
                        </Text>

                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#5E6470', marginTop: 4 }}>
                            Chennai -60007</Text>

                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold', color: '#5E6470', marginTop: 10 }}>
                            03434934-34</Text>

                    </View>

                    <Text style={styles.txtinputhead}>Paid Amount(INR) <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TextInput
                        style={styles.txtInputBox}
                        placeholder="₹ 1700"
                        value={paidAmount}
                        onChangeText={(text) => {
                            if (text > totalAmount) return;
                            setPaidAmount(text)
                        }} />

                    {error && <ErrorMessage message={error} type="error" />}

                    <View style={styles.crdtsBox}>
                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular' }}>Credits Available: {" "}
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>₹ 10000</Text></Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#338BFF' }}>Apply Now</Text>
                    </View>

                    <Text style={styles.txtinputhead}>Balance Payable If</Text>

                    <TextInput
                        style={styles.blncpyablBox}
                        placeholder="₹ 0.00" />

                    <Text style={styles.txtinputhead}>Paid Date <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TouchableOpacity style={styles.paidDateBox}>
                        <Text>{paidDate ? paidDate : "DD/MM/YYYY"}</Text>

                        <Image
                            source={CalendarIcon}
                            style={{ width: 22, height: 22, tintColor: "#444" }}
                        />
                    </TouchableOpacity>

                    <View style={styles.spltBoxField}>
                        <View style={{ flex: 1,marginRight:5 }}>
                            <Text style={styles.txtinputhead}>Mode of Transaction <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                            <TouchableOpacity onPress={() => setShowPaymentMode(!showPaymentMode)}
                                style={[styles.paidDateBox, { marginRight: 4 }]}>
                                <Text>{selectedMode?selectedMode:"Enter Mode"}</Text>

                                <Image
                                    source={DownArrow}
                                    style={{ width: 18, height: 18, tintColor: "#555" }}
                                />
                            </TouchableOpacity>


                            {showPaymentMode && (
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
                                                 style={{paddingVertical:12,paddingHorizontal:14}}
                                                 onPress={()=>setSelectedMode(i.lable)}>
                                                    <Text>{i.lable}</Text>
                                                </TouchableOpacity>

                                            ))}
                                        </ScrollView>
                                    </View>
                                </>

                            )}


                        </View>

                        <View style={{ flex: 1, marginLeft: 5 }}>
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
                        </View>

                    </View>

                    <Text style={styles.txtinputhead}>Transaction ID</Text>

                    <TextInput
                        style={styles.txtInputBox}
                        placeholder="Enter Transaction ID" />

                    <Text style={styles.txtinputhead}>Notes/Description</Text>

                    <TextInput
                        style={styles.descTxtBox}
                        placeholder="Enter Description" />

                    <View style={styles.sumryBox}>
                        <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Bold', color: '#FFFFFF99' }}>SUMMARY</Text>

                        <Text style={styles.amntTxt}>₹ {totalAmount}</Text>

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

                        <TouchableOpacity style={{ borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#1E45E1', marginLeft: 5 }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', color: '#FFFFFF' }}>
                                Record</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </>
    )

}

const styles = StyleSheet.create({
    mainheadPage: {
        backgroundColor: '#ffffff',
        flex: 1,
        padding: 20
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
        marginTop: 10
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
        marginTop: 10, textAlignVertical: 'top'
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
    }

})
export default NewRecordPayment;