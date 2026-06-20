import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, TextInput } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import { useNavigation } from "@react-navigation/native";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import RepeatIcon from "../../../Assets/Images/RepeatIcon.png"
import AddCircle from "../../../Assets/Images/add-circle.png"
import SearchIcon from "../../../Assets/Images/SearchIcon.png"



const NewRetainerInvoiceSheet = ({ }) => {

    const navigation = useNavigation();

    const [paidDate, setPaidDate] = useState("")
    const [selectedRetainerType, setSelectedRetainerType] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const emptyItem = {
        itemDetail: "",
        retainerType: "",
        amount: "",
    }
    const [items, setItems] = useState([emptyItem])
    console.log(items)

    // setItems({emptyItem.itemDetail})

    const handleRepeatRow=(index)=>{

        const seletedItem=items[index];
        console.log(seletedItem)

        setItems(prev=>[...prev,{...emptyItem}])
    }

    const handleAddRow=()=>{
         setItems(prev=>[...prev,{...emptyItem}])
    }

    const handleDeleteRow=(index)=>{
        console.log(index)
        setItems(prev => 
             prev.filter((_, i) => i !== index));
        // setItems(prev=> 
        // [prev.filter((_,i)=>{i.index == index})] 
            
        // )
    }



    return (
        <>

            <View style={styles.mainSheet}>

                <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginRight: 5 }}
                        onPress={() => navigation.goBack()} >
                        <Image source={ArrowLeft} style={{ width: 22, height: 22 }} />
                    </TouchableOpacity>
                    <Text style={styles.pageHead}>New Retainer Invoice</Text>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>


                    <Text style={styles.tntNameTxt}>
                        Tenant Name <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TouchableOpacity style={[styles.inputBox, { marginTop: 10 }]}>
                        <TextInput
                            placeholder="Add or Search Tenant"
                        />

                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={DownArrow}
                                style={{ width: 18, height: 18, tintColor: "#555" }}
                            />

                            <View style={{ backgroundColor: '#1E45E1' }}>
                                <Image source={SearchIcon} style={{ width: 15, height: 15 }} />
                            </View>
                        </View>
                    </TouchableOpacity>


                    <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Medium', marginTop: 12, lineHeight: 16 }}
                    >Search existing tenants in the property flow ecosystem to auto-fill details</Text>


                    <Text style={styles.headerTxt}>Received from</Text>


                    <TouchableOpacity style={[styles.inputBox, { marginTop: 10 }]}>

                        <TextInput

                            placeholder="Enter/Select the Respective Person"
                        />

                        <Image
                            source={DownArrow}
                            style={{ width: 18, height: 18, tintColor: "#555" }}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTxt}>Invoice Date <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TouchableOpacity style={[styles.inputBox, { marginTop: 10 }]}>

                        <Text>{paidDate ? paidDate : "DD/MM/YYYY"}</Text>

                        <Image
                            source={CalendarIcon}
                            style={{ width: 22, height: 22, tintColor: "#444" }}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTxt}>Reference No</Text>

                    <TouchableOpacity style={[styles.inputBox, { marginTop: 10 }]}>
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


                    {items.map((item,index) => {
                        return (
                            <View style={styles.itemBox} key={index}>
                                <View style={styles.itemHealine}>
                                    <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>Item</Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={()=>{handleRepeatRow(index)}}>
                                            <Image source={RepeatIcon} style={{ width: 16, height: 16 }} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={()=>handleDeleteRow(index)}
                                        style={{ backgroundColor: '#FFF3F3', marginLeft: 10 }}>
                                            <Text style={styles.closeIcon}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Text style={styles.itemdetailTxt}>Item Detail</Text>

                                <TextInput
                                    style={styles.itemTxtInpt}
                                    placeholder="Enter Item"
                                    onChangeText={(text)=>{
                                        setItems(item.amount(text))
                                    }} />


                                <Text style={styles.itemdetailTxt}>Retainer Type</Text>

                                <TouchableOpacity style={styles.retainTypeBox}>
                                    <Text>{item.retainerType ? item?.retainerType : "Enter Type"}</Text>

                                    <Image
                                        source={DownArrow}
                                        style={{ width: 18, height: 18, tintColor: "#555" }}
                                    />
                                </TouchableOpacity>

                                <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Regular', marginTop: 12 }}>
                                    Amount</Text>

                                <TextInput
                                    style={styles.itemAmountBox}
                                    placeholder="₹ 1700"
                                    value={item.value} />

                            </View>)
                    })}

                    <TouchableOpacity style={styles.addRowField} onPress={handleAddRow}>
                        <Image source={AddCircle} style={{ width: 17.35, height: 17.35, tintColor: '#1E45E1' }} />
                        <Text style={styles.addRowTxt}>Add New Row</Text>
                    </TouchableOpacity>

                    <View style={styles.totlRtnAmntFiel}>
                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Semibold', color: '#505F76' }}>
                            Total Retainer Amount</Text>
                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>₹ 1500</Text>
                    </View>

                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 18 }}>
                        Payment Method <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TouchableOpacity style={[styles.inputBox, { marginTop: 10 }]}>
                        <Text style={styles.pymentMthdTxt}>
                            {paymentMethod ? paymentMethod : "Enter Payment Method"}
                        </Text>

                        <Image source={DownArrow} style={{ width: 18, height: 18, tintColor: "#555" }} />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 12 }}>
                        Transaction ID
                    </Text>

                    <TouchableOpacity style={[styles.inputBox, { marginTop: 10 }]}>
                        <TextInput
                            // style={{fontSize:'14',fontFamily:'Gilroy-Medium'}}
                            placeholder="Enter Transaction ID" />

                        <Image source={DownArrow} style={{ width: 18, height: 18, tintColor: "#555" }} />
                    </TouchableOpacity>

                    <Text style={styles.dscptTxt}>Description</Text>

                    <TextInput
                        style={styles.dscpBox}
                        placeholder="Enter Description" />

                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', marginTop: 22 }}>
                        <TouchableOpacity style={{ marginRight: 8 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Medium' }}>
                                Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: '#1E45E1', padding: 10, borderRadius: 8, marginLeft: 8 }}>
                            <Text style={{ color: '#ffffff', fontSize: 15, fontFamily: 'Gilroy-Medium' }}>
                                Save & Generate</Text>
                        </TouchableOpacity>
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
    tntNameTxt: {
        fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 24,
    },
    headerTxt: {
        fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 12
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
    itemAmountBox: {
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E2E2E2",
        paddingHorizontal: 14,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    addRowField: {
        flexDirection: 'row',
        alignItems: 'center', backgroundColor: '#EAEEFF',
        marginTop: 12, justifyContent: 'center',
        padding: 12, borderRadius: 5,
    },
    addRowTxt: {
        fontSize: 14,
        fontFamily: 'Gilroy-Semibold',
        color: '#1E45E1', marginLeft: 6,
    },
    totlRtnAmntFiel: {
        flexDirection: "row",
        backgroundColor: '#F2F4F6',
        justifyContent: 'space-between', paddingHorizontal: 12,
        paddingVertical: 15, marginTop: 15, borderRadius: 5,
        alignItems: 'center'
    },
    pymentMthdTxt: {
        fontSize: 14, fontFamily: 'Gilroy-Medium'
    },
    dscptTxt: {
        fontSize: 14, fontFamily: "Gilroy-Medium", marginTop: 15
    },
    dscpBox: {
        height: 80,
        padding: 18, borderWidth: 1, borderColor: "#D9D9D9",
        borderRadius: 8, textAlignVertical: 'top', marginTop: 10
    }

})

export default NewRetainerInvoiceSheet;