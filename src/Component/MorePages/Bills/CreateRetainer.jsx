import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, TextInput } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import { useNavigation } from "@react-navigation/native";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import RepeatIcon from "../../../Assets/Images/RepeatIcon.png"




const NewRetainerInvoiceSheet = ({ }) => {

    const navigation = useNavigation();

    const [paidDate, setPaidDate] = useState("")
    const [selectedRetainerType, setSelectedRetainerType] = useState("")




    return (
        <>

            <View style={styles.mainSheet}>
                <ScrollView>
                    <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginRight: 5 }}
                            onPress={() => navigation.goBack()} >
                            <Image source={ArrowLeft} style={{ width: 22, height: 22 }} />
                        </TouchableOpacity>
                        <Text style={styles.pageHead}>New Retainer Invoice</Text>
                    </View>

                    <Text>Tenant Name <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TextInput
                        placeholder="Add or Search Tenant"
                    />


                    <Text>Search existing tenants in the property flow ecosystem to auto-fill details</Text>


                    <Text>Received from</Text>


                    <View style={styles.inputBox}>

                        <TextInput

                            placeholder="Enter/Select the Respective Person"
                        />
                    </View>

                    <Text>Invoice Date</Text>

                    <TouchableOpacity style={[styles.inputBox, {}]}>

                        <Text>{paidDate ? paidDate : "DD/MM/YYYY"}</Text>

                        <Image
                            source={CalendarIcon}
                            style={{ width: 22, height: 22, tintColor: "#444" }}
                        />
                    </TouchableOpacity>

                    <Text>Reference No</Text>

                    <TouchableOpacity style={[styles.inputBox, {}]}>
                        <TextInput
                            placeholder="EX:TU89" />

                        <Image
                            source={DownArrow}
                            style={{ width: 18, height: 18, tintColor: "#555" }}
                        />
                    </TouchableOpacity>

                    <View style={{ marginTop: 15 }}>
                        <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold' }}>
                            Description</Text>
                    </View>

                    <View style={styles.itemBox}>
                        <View style={styles.itemHealine}>
                            <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>Item</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity>
                                    <Image source={RepeatIcon} style={{ width: 16, height: 16 }} />
                                </TouchableOpacity>

                                <TouchableOpacity style={{ backgroundColor: '#FFF3F3', marginLeft: 10 }}>
                                    <Text style={styles.closeIcon}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.itemdetailTxt}>Item Detail</Text>

                        <TextInput
                            style={styles.itemTxtInpt}
                            placeholder="Enter Item" />


                        <Text style={styles.itemdetailTxt}>Retainer Type</Text>

                        <TouchableOpacity style={styles.retainTypeBox}>
                            <Text>{selectedRetainerType ? selectedRetainerType : "Enter Type"}</Text>

                            <Image
                                source={DownArrow}
                                style={{ width: 18, height: 18, tintColor: "#555" }}
                            />
                        </TouchableOpacity>

                        <Text style={{fontSize:12,fontFamily:'Gilroy-Regular',marginTop:12}}>
                            Amount</Text>

                        <TextInput
                        style={styles.itemAmountBox}
                        placeholder="₹ 1700"/>

                    </View>
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    mainSheet: {
        backgroundColor: '#ffffff',
        flex: 1,
        padding: 20
    },
    pageHead: {
        fontSize: 20,
        fontFamily: 'Gilroy-Semibold'
    },
    inputBox: {
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E2E2E2",
        paddingHorizontal: 14,
        backgroundColor: "#fff",
        justifyContent: "center",
        // marginBottom: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemBox: {
        borderWidth: 1,
        borderColor: "#E2E2E2",
        borderRadius: 14,
        padding: 15, marginTop: 15
    },
    itemHealine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    closeIcon: {
        paddingVertical: 1, paddingHorizontal: 3,
        color: "#FF0000",
    },
    itemdetailTxt: {
        marginTop: 14,
        fontSize: 14,
        fontFamily: "Gilroy-Medium", color: '#4B4B4B'
    },
    itemTxtInpt: {
        height: 40, paddingHorizontal: 10,
        borderWidth: 1, borderRadius: 10,
        borderColor: '#E2E2E2', marginTop: 10,
        fontFamily: 'Gilroy-Medium', fontSize: 14
    },
    retainTypeBox: {
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E2E2E2",
        paddingHorizontal: 14,
        backgroundColor: "#fff",
        justifyContent: "center",
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemAmountBox:{
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E2E2E2",
        paddingHorizontal: 14,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginTop:10
        
    }
})

export default NewRetainerInvoiceSheet;