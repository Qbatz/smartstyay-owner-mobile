import React, { useContext, useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import { useNavigation } from "@react-navigation/native";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import RepeatIcon from "../../../Assets/Images/RepeatIcon.png"
import AddCircle from "../../../Assets/Images/add-circle.png"
import SearchIcon from "../../../Assets/Images/SearchIcon.png"
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import { CustomerContext } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { BillContext } from "../../../Context/BillsContext";
import Loader from "../../Loader/Loader";
import SuccessModal from "../../../ToastFile/ToastPage";
import { useRoute } from "@react-navigation/native";
import ValidatedInput from "../ValidatedInput"



const NewRetainerInvoiceSheet = ({ }) => {

    const navigation = useNavigation();
    const { retainerCustomerList } = useContext(CustomerContext)
    const { activeHostelId } = useContext(CommonContexts);
    const { createRetainderInvoice, loading, GetAdvanceBookingBills } = useContext(BillContext)

    const route = useRoute();
    const { customerDetails: passedCustomer } = route.params || {};

    const [isTenantLocked, setIsTenantLocked] = useState(false);

    const [paidDate, setPaidDate] = useState("")
    const [openPaidDate, setOpenPaidDate] = useState(false);
    const [selectedRetainerType, setSelectedRetainerType] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const emptyItem = {
        itemDetail: "",
        retainerType: "",
        amount: "",
    }
    const [description, setDescription] = useState("")
    const [items, setItems] = useState([emptyItem]);
    const [showTenantName, setShowTenantName] = useState(false);
    const [selectedName, setSelectedName] = useState("")
    const [selectedTenant, setSelectedTenant] = useState("")
    const [receivedFrom, setReceivedFrom] = useState("")
    const tenantNamelist = [{ id: 0, name: "Karthi" }, { id: 1, name: "Mooly" }, { id: 2, name: "Siinu" }, { id: 3, name: "Nona" }, { id: 4, name: "Sila" }]
    console.log(items)
    console.log(emptyItem)
    const [stateQuery, setStateQuery] = useState("");
    const [showPaymentMode, setShowPaymentMode] = useState(false);
    const [selectedMode, setSelectedMode] = useState("");
    const [selectedBankId, setSelectedBankId] = useState("")
    const [transactionId, setTransactionId] = useState("")
    const [errors, setErrors] = useState("")
    const [retainerList, setReatinerList] = useState([])
    const [retainerBankList, setRetainerBankList] = useState([])
    const [guardianOpen, setGuardianOpen] = useState(false)
    const [selectedGuardian, setSelectedGuardian] = useState("")
    const [retainerType, setRetainerTypeList] = useState()
    const [openRetainerType, setOpenRetainerType] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    const [modalType, setModalType] = useState("")
    const [isSubmitClicked, setIsSubmitClicked] = useState(false)

    const retainerTypeList = [{ id: 1, retainerType: "AMOUNT_HOLDING" }, { id: 2, retainerType: "EB_HOLDING" }]

    console.log("selectedTenant", selectedTenant)
    console.log("paidDate", dayjs(paidDate).format("DD/MM/YYYY"))

    const paymentModeTypes = [{ id: 0, lable: "Gpayf" }, { id: 1, lable: "phonepay" }, { id: 2, lable: "Cash" }]

    // useEffect(() => {
    //     const fetchCustomerRetainerList = async () => {
    //         const res = await retainerCustomerList(activeHostelId)
    //         console.log("retainerList", res)
    //         setReatinerList(res?.data?.customersLists)
    //         setRetainerBankList(res?.data?.listBanks)
    //     }

    //     fetchCustomerRetainerList();
    // }, [])

    console.log("retainlist", retainerList)

    // setItems({emptyItem.itemDetail})

    const handleRepeatRow = (index) => {
        console.log(index)

        const seletedItem = items[index];
        console.log(seletedItem)

        if (!seletedItem?.itemDetail && !seletedItem?.retainerType && !seletedItem?.amount) {
            setItems(prev => [...prev, { ...emptyItem }])
        } else {
            // setItems(seletedItem)
            setItems(prev => [...prev, { ...seletedItem }]);
        }


    }

    const handleDescriptionChange = (text) => {
        const filteredText = text.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/g,
            ""
        );

        setDescription(filteredText);
    };


    const handleAddRow = () => {
        setItems(prev => [...prev, { ...emptyItem }])
    }

    const handleDeleteRow = (index) => {
        console.log(index)
        setItems(prev =>
            prev.filter((_, i) => i !== index));
        // setItems(prev=> 
        // [prev.filter((_,i)=>{i.index == index})] 

        // )
    }
    const handleChange = (index, key, value) => {

        const updated = [...items];
        console.log(updated)
        updated[index][key] = value;
        setItems(updated);
    };

    // let total = 0;

    // for (i = 0; i < items.length; i++) {
    //     const totalamount = total + Number(items[i].amount || 0);

    //     console.log(totalamount)


    // }

    useEffect(() => {
        const fetchCustomerRetainerList = async () => {
            const res = await retainerCustomerList(activeHostelId)
            console.log("retainerList", res)

            const list = res?.data?.customersLists || [];
            setReatinerList(list)
            setRetainerBankList(res?.data?.listBanks)

            if (passedCustomer?.customerId) {
                const matched = list.find(
                    (c) => c.customerId === passedCustomer.customerId
                );

                if (matched) {
                    setSelectedName(matched.fullName);
                    setSelectedTenant(matched);
                    setIsTenantLocked(true);
                }
            }
        }

        fetchCustomerRetainerList();
    }, [])


    const totalRetainerAmount = items.reduce((sum, item) => {
        console.log(sum)
        console.log(item)
        return sum + Number(item.amount || 0);
    }, 0);


    const filterList = retainerList?.filter((i) => i.fullName.toLowerCase().includes(stateQuery.toLowerCase())).sort((a, b) => {
        const aStart = a.fullName.toLowerCase().startsWith(stateQuery.toLowerCase());
        const bStart = b.fullName.toLowerCase().startsWith(stateQuery.toLowerCase());
        return bStart - aStart;
    }
    )
    console.log("filterlist", filterList)

    const today = dayjs();

    const invoiceDate = dayjs("DD-MM-YYYY");

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

    //     console.log( "sorru",i)
    //    return text == i.name;


    console.log("filterl", filterList)

    console.log(errors)


    const savegenerate = async () => {


        let newErrors = {};

        if (!selectedName.trim()) {
            newErrors.name = "Please Select Name"
        }
        if (!paidDate) {
            newErrors.paidDate = "Please Select Date"
        }
        if (!selectedMode) {
            newErrors.payMode = "Please Select Mode"
        }
        if (!totalRetainerAmount) {
            newErrors.retainerAmount = "Please Enter Amount"
        }

        setErrors(newErrors)

        if (newErrors.length > 0) {
            return;
        }

        if (isSubmitClicked) return;

        console.log("itemsList", items[0]?.retainerType)
        console.log(totalRetainerAmount)
        const invoiceCreatedDate = dayjs(paidDate).format("DD/MM/YYYY")
        const payload = {
            paymentDate: invoiceCreatedDate,
            mobile: selectedTenant?.mobile,
            relationName: selectedGuardian?.guardianName || receivedFrom,
            description: items[0]?.itemDetail,
            detailedDescription: description,
            invoiceType: items[0]?.retainerType,
            amount: totalRetainerAmount,
            bankId: selectedBankId,
            referenceNumber: transactionId,
        }

        if (selectedGuardian?.guardianId) {
            payload.relationId = selectedGuardian?.guardianId;
        }

        console.log("payload", payload)

        try {
            setIsSubmitClicked(true);

            const res = await createRetainderInvoice(activeHostelId, selectedTenant?.customerId, payload)
            console.log("retainerInovice", res)
            if (res.success) {
                setShowSuccessModal(true)
                setModalMessage(res?.data)
                setModalType("success")
                setTimeout(() => {
                    setShowSuccessModal(false)
                    GetAdvanceBookingBills(activeHostelId);
                    navigation.goBack();
                    setTimeout(() => {
                        setIsSubmitClicked(false)
                    }, 300);
                }, 1000);
            } else {
                setShowSuccessModal(true)
                setModalMessage(res?.message)
                setModalType("error")
                setTimeout(() => {
                    setShowSuccessModal(false)
                    setIsSubmitClicked(false)
                }, 1000);
            }
        } catch (error) {
            console.log(error)
            setIsSubmitClicked(false)
        }


    }

    return (
        <>

            <View style={styles.mainSheet}>
                {loading && <Loader />}
                <SuccessModal
                    visible={showSuccessModal}
                    message={modalMessage}
                    type={modalType} />

                <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginRight: 5 }}
                        onPress={() => navigation.goBack()} >
                        <Image source={ArrowLeft} style={{ width: 22, height: 22 }} />
                    </TouchableOpacity>
                    <Text style={styles.pageHead}>New Retainer Invoice</Text>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>


                    <Text style={styles.tntNameTxt}>
                        Tenant Name <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <View style={[styles.container, isTenantLocked && { backgroundColor: "#F3F4F6" }]}>
                        <TextInput
                            placeholder="Add or Search Tenant"
                            style={styles.input}
                            value={showTenantName ? stateQuery || selectedName : selectedName}
                            placeholderTextColor="#B5B5B5"
                            editable={!isTenantLocked}
                            onPressIn={() => {
                                if (isTenantLocked) return;
                                setShowTenantName(!showTenantName)
                                setErrors(prev => ({ ...prev, name: "" }))
                            }}
                            onChangeText={(text) => {
                                if (isTenantLocked) return;
                                const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                setStateQuery(onlyLetters)
                                setErrors(prev => ({ ...prev, name: "" }))
                                setReceivedFrom("")
                                setSelectedGuardian("")
                                setSelectedName("")
                            }}
                        />

                        <TouchableOpacity onPress={() => {
                            if (isTenantLocked) return;
                            setShowTenantName(!showTenantName)
                            setErrors(prev => ({ ...prev, name: "" }))
                        }}
                            style={styles.arrowContainer}
                            disabled={isTenantLocked}
                        >
                            <Image
                                source={DownArrow}
                                style={styles.arrow}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.searchButton}>
                            <Image
                                source={SearchIcon}
                                style={styles.searchIcon}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>

                    {errors.name && <ErrorMessage message={errors.name} type="error" />}


                    {showTenantName && (
                        <>
                            <TouchableWithoutFeedback onPress={() => {
                                setShowTenantName(false)
                                setStateQuery("")
                            }}>
                                <View style={styles.dropdownOverlay} />
                            </TouchableWithoutFeedback>
                            <View style={styles.dropdownMenu}>
                                <ScrollView keyboardShouldPersistTaps="always"
                                    nestedScrollEnabled={true}
                                    showsVerticalScrollIndicator={true}>
                                    {filterList.map((i, index) => (
                                        <TouchableOpacity key={index}
                                            style={{ paddingVertical: 8, paddingHorizontal: 14 }}
                                            onPress={() => {
                                                setSelectedName(i.fullName)
                                                setSelectedTenant(i)
                                                setStateQuery("");
                                                setShowTenantName(false)
                                                setReceivedFrom("")
                                                setSelectedGuardian("")
                                            }}>
                                            <Text>{i.fullName}</Text>
                                        </TouchableOpacity>

                                    ))}
                                </ScrollView>
                            </View>
                        </>

                    )}


                    <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Medium', marginTop: 12, lineHeight: 16 }}
                    >Search existing tenants in the property flow ecosystem to auto-fill details</Text>


                    <Text style={styles.headerTxt}>Received from <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>


                    <TouchableOpacity onPress={() => setGuardianOpen(!guardianOpen)}
                        style={[styles.inputBox, { marginTop: 10 }]}>
                        <TextInput

                            placeholder="Enter/Select the Respective Person"
                            value={guardianOpen ? receivedFrom || selectedGuardian?.guardianName : selectedGuardian?.guardianName}
                            onPressIn={() => setGuardianOpen(!guardianOpen)}
                            onChangeText={(text) => {
                                const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                setReceivedFrom(onlyLetters)
                                setSelectedGuardian("")
                            }}
                        />

                        <Image
                            source={DownArrow}
                            style={{ width: 18, height: 18, tintColor: "#555" }}
                        />
                    </TouchableOpacity>

                    {guardianOpen && (
                        selectedTenant?.guardiansList?.length > 0 ? (
                            <>
                                <TouchableWithoutFeedback onPress={() => {
                                    setGuardianOpen(false)
                                    // setStateQuery("")
                                }}>
                                    <View style={styles.dropdownOverlay} />
                                </TouchableWithoutFeedback>
                                <View style={styles.dropdownMenu}>
                                    <ScrollView keyboardShouldPersistTaps="always"
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={true}>
                                        {selectedTenant?.guardiansList.map((i, index) => (
                                            <TouchableOpacity key={index}
                                                style={{ paddingVertical: 8, paddingHorizontal: 14 }}
                                                onPress={() => {
                                                    // setSelectedName(i.guardianName)
                                                    setSelectedGuardian(i)
                                                    setStateQuery("");
                                                    setGuardianOpen(false)
                                                }}>
                                                <Text>{i.guardianName}</Text>
                                            </TouchableOpacity>

                                        ))}
                                    </ScrollView>
                                </View>
                            </>

                        ) : (
                            <View style={[styles.dropdownMenu, { minHeight: 50, justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular' }}>
                                    No guardian Details Available
                                </Text>
                            </View>
                        )
                    )}

                    <Text style={styles.headerTxt}>Invoice Date <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TouchableOpacity onPress={() => {
                        setOpenPaidDate(true)
                        setErrors(prev => ({ ...prev, paidDate: "" }))
                    }}
                        style={[styles.inputBox, { marginTop: 10 }]}>

                        <Text>
                            {paidDate ? dayjs(paidDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
                        </Text>

                        <Image
                            source={CalendarIcon}
                            style={{ width: 22, height: 22, tintColor: "#444" }}
                        />
                    </TouchableOpacity>

                    {errors.paidDate && <ErrorMessage message={errors.paidDate} type="error" />}

                    {/* <Text style={styles.headerTxt}>Reference No</Text>

                    <TouchableOpacity style={[styles.inputBox, { marginTop: 10 }]}>
                        <TextInput
                            placeholder="EX:TU89" />

                        <Image
                            source={DownArrow}
                            style={{ width: 18, height: 18, tintColor: "#555" }}
                        />
                    </TouchableOpacity> */}

                    <View style={{ marginTop: 15 }}>
                        <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold' }}>
                            Description</Text>
                    </View>


                    {items?.map((item, index) => {
                        return (
                            <View style={[styles.itemBox, { position: 'relative' }]} key={index}>
                                <View style={styles.itemHealine}>
                                    <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>Item  </Text>

                                    {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => { handleRepeatRow(index) }}>
                                            <Image source={RepeatIcon} style={{ width: 16, height: 16 }} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => handleDeleteRow(index)}
                                            style={{ backgroundColor: '#FFF3F3', marginLeft: 10 }}>
                                            <Text style={styles.closeIcon}>X</Text>
                                        </TouchableOpacity>
                                    </View> */}
                                </View>

                                <Text style={styles.itemdetailTxt}>Item Detail
                                    {" "}<Text style={{ color: "red", fontSize: 19 }}>*</Text>
                                </Text>

                                <TextInput
                                    style={styles.itemTxtInpt}
                                    value={item.itemDetail}
                                    placeholder="Enter Item"
                                    onChangeText={(text) => {
                                        // setItems(items.itemDetail(text))
                                        const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                        handleChange(index, "itemDetail", onlyLetters)
                                    }} />


                                <Text style={styles.itemdetailTxt}>Retainer Type {" "}<Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                                <TouchableOpacity onPress={() => setOpenRetainerType(!openRetainerType)}
                                    style={styles.retainTypeBox}>
                                    <Text>{item.retainerType ? item?.retainerType : "Select Type"}</Text>

                                    <Image
                                        source={DownArrow}
                                        style={{ width: 18, height: 18, tintColor: "#555" }}
                                    />
                                </TouchableOpacity>

                                {openRetainerType && (
                                    <View style={[styles.dropdownMenu, {
                                        position: 'absolute', maxHeight: 150, top: 200,
                                        width: '100%', left: 14, right: 20
                                    }]}>
                                        {retainerTypeList.map((i) => (
                                            <TouchableOpacity onPress={() => {
                                                handleChange(index, "retainerType", i.retainerType)
                                                setOpenRetainerType(false)
                                            }}
                                                style={{ paddingVertical: 8, paddingHorizontal: 14 }}
                                                key={i.id}>
                                                <Text>{i?.retainerType}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#3C3C4399', marginTop: 12 }}>
                                    Amount {" "}<Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                                <ValidatedInput
                                    keyboardType="numeric"
                                    type="numberOnly"
                                    inputType="numeric"
                                    style={styles.itemAmountBox}
                                    placeholder="Enter Amount"
                                    value={item.amount}
                                    onChangeText={(text) => {
                                        handleChange(index, "amount", text)
                                        setErrors(prev => ({ ...prev, retainerAmount: "" }))
                                    }} />

                            </View>)
                    })}

                    {/* <TouchableOpacity style={styles.addRowField} onPress={handleAddRow}>
                        <Image source={AddCircle} style={{ width: 17.35, height: 17.35, tintColor: '#1E45E1' }} />
                        <Text style={styles.addRowTxt}>Add New Row</Text>
                    </TouchableOpacity> */}

                    <View style={styles.totlRtnAmntFiel}>
                        <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Semibold', color: '#505F76' }}>
                            Total Retainer Amount</Text>
                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>₹ {totalRetainerAmount ? totalRetainerAmount : "0.00"} </Text>
                    </View>
                    {errors.retainerAmount && <ErrorMessage message={errors.retainerAmount} type="error" />}

                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 18 }}>
                        Payment Method <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                    <TouchableOpacity onPress={() => {
                        setShowPaymentMode(!showPaymentMode)
                        setErrors(prev => ({ ...prev, payMode: "" }))
                    }}
                        style={[styles.inputBox, { marginTop: 10 }]}>
                        <Text style={styles.pymentMthdTxt}>
                            {selectedMode ? selectedMode : "Select Payment Method"}
                        </Text>

                        <Image source={DownArrow} style={{ width: 18, height: 18, tintColor: "#555" }} />
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
                                    {retainerBankList.map((i, index) => (
                                        <TouchableOpacity key={index}
                                            style={{ paddingVertical: 12, paddingHorizontal: 14 }}
                                            onPress={() => {
                                                setSelectedMode(i?.bankName)
                                                setSelectedBankId(i?.bankId)
                                                setShowPaymentMode(false)
                                            }}>
                                            <Text>{i.bankName}</Text>
                                        </TouchableOpacity>

                                    ))}
                                </ScrollView>
                            </View>
                        </>

                    )}
                    {errors.payMode && <ErrorMessage message={errors.payMode} type="error" />}

                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 12 }}>
                        Transaction ID
                    </Text>

                    {/* <TouchableOpacity style={[styles.inputBox, { marginTop: 10 }]}> */}
                    <TextInput
                        style={[styles.inputBox, { marginTop: 10 }]}
                        // style={{fontSize:14,fontFamily:'Gilroy-Medium'}}
                        placeholder="Enter Transaction ID"
                        onChangeText={(text) =>
                            setTransactionId(text)
                        } />

                    {/* <Image source={DownArrow} style={{ width: 18, height: 18, tintColor: "#555" }} /> */}
                    {/* </TouchableOpacity> */}

                    <Text style={styles.dscptTxt}>Description</Text>

                    <TextInput
                        style={styles.dscpBox}
                        placeholder="Enter Description"
                        value={description}
                        onChangeText={handleDescriptionChange}
                    />

                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', marginTop: 22 }}>
                        <TouchableOpacity style={{ marginRight: 8 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Gilroy-Medium' }}>
                                Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={savegenerate}
                            style={[{ backgroundColor: '#1E45E1', padding: 10, borderRadius: 8, marginLeft: 8 }, isSubmitClicked && { opacity: 0.4 }]}>
                            <Text style={{ color: '#ffffff', fontSize: 15, fontFamily: 'Gilroy-Medium' }}>
                                Save & Generate</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            {console.log("slected", selectedTenant)}

            {openPaidDate && (
                <View style={styles.dateOverlay}>
                    <TouchableWithoutFeedback onPress={() => setOpenPaidDate(false)}>
                        <View style={styles.overlayBg} />
                    </TouchableWithoutFeedback>

                    <View style={styles.calendarContainer}>
                        <Calendar
                            markingType="custom"
                            markedDates={paidMarkedDates}
                            minDate={
                                selectedTenant?.joiningDate ? dayjs(
                                        selectedTenant.joiningDate,"DD/MM/YYYY"
                                    ).format("YYYY-MM-DD"): undefined
                            }
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
        </>
    )
}

const styles = StyleSheet.create({
    mainSheet: {
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
        fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 14,
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
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        height: 52,
        borderWidth: 1,
        marginTop: 10,
        borderColor: "#D9D9D9",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#FFF",
    },

    input: {
        flex: 1,
        paddingHorizontal: 15,
        fontSize: 15,
        fontFamily: "Gilroy-Regular",
    },

    arrowContainer: {
        width: 45,
        justifyContent: "center",
        alignItems: "center",
    },

    arrow: {
        width: 18,
        height: 18,
        tintColor: "#444",
    },

    searchButton: {
        width: 42,
        height: "100%",
        backgroundColor: "#2952FF",
        justifyContent: "center",
        alignItems: "center",
    },

    searchIcon: {
        width: 18,
        height: 18,
        tintColor: "#FFF",
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

export default NewRetainerInvoiceSheet;