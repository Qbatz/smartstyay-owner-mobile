import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image, TextInput, ScrollView } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import Profile from "../../../Assets/Images/profile.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { useNavigation } from "@react-navigation/native";




const NewRecordPayment = () => {

    const navigation = useNavigation();
    const [paidDate, setPaidDate] = useState("")

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
                        placeholder="Enter name" />

                    <View style={{ backgroundColor: '#F9FAFB', borderRadius: 10, padding: 14, marginTop: 10 }}>
                        <View style={styles.prflField}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Profile} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                <View>
                                    <Text>Mithuraj</Text>

                                    <Text>G-FLoor | Room 103 | Bed02</Text>
                                </View>
                            </View>

                            <Image source={ArrowLeft} style={{ width: 20, height: 20 }} />
                        </View>

                        <Text>Build To</Text>

                        <Text>Plot No</Text>

                        <Text>Ramsay Nager, 4th nager, chennai</Text>

                        <Text>Chennai -60007</Text>

                        <Text>03434934-34</Text>

                    </View>

                    <Text style={styles.txtinputhead}>Paid Amount(INR) <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TextInput
                        style={styles.txtInputBox}
                        placeholder="₹ 1700" />

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
                        <View style={{ flex: 1 }}>
                            <Text style={styles.txtinputhead}>Mode of Transaction <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                            <TouchableOpacity style={[styles.paidDateBox, { marginRight: 4 }]}>
                                <Text>Upi</Text>

                                <Image
                                    source={DownArrow}
                                    style={{ width: 18, height: 18, tintColor: "#555" }}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, marginLeft: 4 }}>
                            <Text style={styles.txtinputhead}>Transferring Account <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                            <TouchableOpacity style={styles.paidDateBox}>
                                <Text>Upi</Text>

                                <Image
                                    source={DownArrow}
                                    style={{ width: 18, height: 18, tintColor: "#555" }}
                                />
                            </TouchableOpacity>
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

                        <Text style={styles.amntTxt}>₹ 93000</Text>

                        <View style={{ borderColor: '#FFFFFF1A', marginVertical: 14, borderWidth: 0.8 }} />

                        <View style={styles.spcebtn}>
                            <Text style={styles.paidBlncAmtHeadTxt}>Paid Amount</Text>
                            <Text style={styles.pidBlncAmntTxt}>₹ 9300</Text>
                        </View>

                        <View style={[styles.spcebtn, { marginTop: 10 }]}>
                            <Text style={styles.paidBlncAmtHeadTxt}>Balance Amount(Outstanding)</Text>
                            <Text style={styles.pidBlncAmntTxt}>₹ 00</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 20, alignItems: 'center', alignSelf: 'flex-end', flexDirection: 'row' }}>
                        <TouchableOpacity style={{marginRight:8}}>
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#1E45E1',marginLeft:5 }}>
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
    }

})
export default NewRecordPayment;