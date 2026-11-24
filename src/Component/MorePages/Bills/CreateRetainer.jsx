import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback } from "react-native";
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
import LeavePageScreen from "../../../ToastFile/LeavePageScreen";
import BankIcon from "../../../Assets/Images/bankBlue.png";
import CashIcon from "../../../Assets/Images/Cash_Icon.png";
import CardIcon from "../../../Assets/Images/Cardorange.png";
import InputComponent from "../InputComponent"
import DropdownComponent from "../DropdownComponent";
import DatePickerComponent from "../DatePickerComponent";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat)


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
    const scrollRef = useRef(null);
    const descriptionRef = useRef(null);
    const transactionRef = useRef(null)
    const [showLeavePageScreen, setShowLeavePageScreen] = useState(false)


    //   const scrollToField = (ref) => {
    //     if (!ref?.current || !scrollRef.current) return;

    //     ref.current.measureLayout(
    //       scrollRef.current,
    //       (x, y) => {
    //         scrollRef.current.scrollTo({
    //           y: y - 100,
    //           animated: true,
    //         });
    //       },
    //       () => { }
    //     );
    //   };
    const scrollToField = (ref) => {
        if (!ref?.current || !scrollRef.current) {
            return;
        }

        setTimeout(() => {
            scrollRef.current.scrollResponderScrollNativeHandleToKeyboard(
                ref.current,
                120,
                true
            );
        }, 100);
    };

    const retainerTypeList = [{ id: 1, retainerType: "AMOUNT_HOLDING" }, { id: 2, retainerType: "EB_HOLDING" }]

    const tenantOptions = (retainerList || [])?.map((t) => ({
        label: t?.fullName,
        value: t?.customerId,
    }));

    const guardianOptions = (selectedTenant?.guardiansList || [])?.map((g) => ({
        label: g?.guardianName,
        value: g?.guardianId ?? g.guardianName,
    }));

    const retainerTypeOptions = retainerTypeList?.map((t) => ({
        label: t?.retainerType,
        value: t?.retainerType,
    }));


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
            // const res = await retainerCustomerList(activeHostelId)
            const res = await retainerCustomerList(activeHostelId, "ADVANCE_HOLDING")
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


    const paymentOptionsV1 = (retainerBankList || []).map((bank, index) => {
        const accountType = String(bank?.accountType || "BANK")
            .trim()
            .toUpperCase()
            .replace(/[\s-]+/g, "_");

        const iconType = ["CASH", "UPI"].includes(accountType)
            ? accountType
            : ["CARD", "DEBIT_CARD", "CREDIT_CARD"].includes(accountType)
                ? "CARD"
                : "BANK";

        const displayName = bank?.displayName || "";
        const holderName = bank?.accountHolderName || "";
        const bankName = bank?.bankName || "";

        return {
            id: bank?.bankId || `account-${index}`,
            bankId: bank?.bankId,
            value: bank?.bankId,

            accountType,
            iconType,

            displayName,
            holderName,
            bankName,

            title: iconType === "CASH"
                ? holderName || displayName
                : holderName || displayName,

            subLabel: iconType === "CASH"
                ? `CASH - ${displayName}`
                : [bankName, displayName].filter(Boolean).join(" - "),

            upiAppIcon: bank?.upiAppIcon || null,
            isBank: bank?.isBank || false,
            isUpi: bank?.isUpi || iconType === "UPI",
            isCash: iconType === "CASH",

            data: bank,
            badgeLabel: iconType === "CARD" ? "CARD" : accountType,
        };
    });

    const getPaymentIcon = (item) => {
        switch (item?.iconType) {
            case "CASH":
                return CashIcon;

            case "UPI":
                return item?.upiAppIcon
                    ? { uri: item.upiAppIcon }
                    : BankIcon;

            case "CARD":
                return CardIcon;

            case "BANK":
            default:
                return BankIcon;
        }
    };

    const getPaymentIconBg = (type) => {
        switch (type) {
            case "CASH":
                return styles.cashIconBg;
            case "UPI":
                return styles.upiIconBg;
            case "CARD":
                return styles.cardIconBg;
            default:
                return styles.bankIconBg;
        }
    };

    const getPaymentBadgeBg = (type) => {
        switch (type) {
            case "CASH":
                return styles.cashBadge;
            case "UPI":
                return styles.upiBadge;
            case "CARD":
                return styles.cardBadge;
            default:
                return styles.bankBadge;
        }
    };

    const getPaymentBadgeText = (type) => {
        switch (type) {
            case "CASH":
                return styles.cashText;
            case "UPI":
                return styles.upiText;
            case "CARD":
                return styles.cardText;
            default:
                return styles.bankText;
        }
    };



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
        // if (!totalRetainerAmount) {
        //     newErrors.retainerAmount = "Please Enter Amount"
        // }

        items.forEach((item, index) => {

            if (!item?.retainerType) {
                newErrors[`retainerType_${index}`] =
                    "Please Select Retainer Type";
            }

            if (!item?.amount || Number(item.amount) <= 0) {
                newErrors[`amount_${index}`] =
                    "Please Enter Amount";
            }

        });
        if (!String(selectedGuardian || "").trim() && !receivedFrom) {
            newErrors.guardianName = "Please Enter Guardian Name";
        }

        setErrors(newErrors)

        // if (newErrors.length > 0) {
        //     return;
        // }
        if (Object.keys(newErrors).length > 0) {
            return false;
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

    const handleLeaveScreen = () => {

        console.log(totalRetainerAmount)

        if (selectedTenant || selectedGuardian?.guardianName || receivedFrom || items[0]?.retainerType ||
            transactionId || totalRetainerAmount || transactionId || selectedBankId) {
            setShowLeavePageScreen(true)
        } else {
            navigation.goBack();
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

                <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginRight: 5 }}
                        onPress={() => navigation.goBack()} >
                        <Image source={ArrowLeft} style={{ width: 22, height: 22 }} />
                    </TouchableOpacity>
                    <Text style={styles.pageHead}>New Retainer Invoice</Text>
                </View>
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: "#fff" }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}   // ✅ change here
                    keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                >
                    <ScrollView
                        ref={scrollRef}
                        contentContainerStyle={{ paddingBottom: 50 }}
                        showsVerticalScrollIndicator={false}
                        keyboardDismissMode="on-drag">


                        {/* <Text style={styles.tntNameTxt}>
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
                                        {filterList.length > 0 ?
                                            filterList.map((i, index) => (
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

                                            )) :
                                            <View>
                                                <Text style={{ paddingVertical: 8, paddingHorizontal: 14, fontSize: 12, fontFamily: 'Gilroy-Medium' }}>
                                                    No Options available</Text>
                                            </View>
                                        }
                                    </ScrollView>
                                </View>
                            </>

                        )} */}

                        <View style={styles.tenantRow}>
                            <View style={{ flex: 1 }}>
                                <DropdownComponent
                                    label="Tenant Name"
                                    required
                                    placeholder="Add or Search Tenant"
                                    options={tenantOptions}
                                    value={selectedTenant?.customerId || null}
                                    disabled={isTenantLocked}
                                    searchable
                                    searchPlaceholder="Search Tenant..."
                                    emptyText="No Options available"
                                    error={!!errors.name}
                                    onChange={(value) => {
                                        const tenant = retainerList.find(
                                            (t) => String(t.customerId) === String(value)
                                        );
                                        if (!tenant) return;

                                        setSelectedName(tenant.fullName);
                                        setSelectedTenant(tenant);
                                        setReceivedFrom("");
                                        setSelectedGuardian("");
                                        setErrors((prev) => ({ ...prev, name: "" }));
                                    }}
                                />
                            </View>

                            <View style={[styles.tenantSearchButton, isTenantLocked && { opacity: 0.5 }]}>
                                <Image source={SearchIcon} style={styles.searchIcon} resizeMode="contain" />
                            </View>
                        </View>

                        {errors.name ? <ErrorMessage message={errors.name} type="error" /> : null}


                        <Text style={{ fontSize: 12, fontFamily: 'Gilroy-Medium', marginTop: 12, lineHeight: 16 }}
                        >Search existing tenants in the property flow ecosystem to auto-fill details</Text>

                        {/* 
                        <Text style={styles.headerTxt}>Received from <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>


                        <TouchableOpacity onPress={() => {
                            setGuardianOpen(!guardianOpen)
                        }}
                            style={[styles.inputBox, { marginTop: 10 }]}>
                            <TextInput
                                style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}
                                placeholder="Enter/Select the Respective Person"
                                value={guardianOpen ? receivedFrom || selectedGuardian?.guardianName : selectedGuardian?.guardianName}
                                onPressIn={() => setGuardianOpen(!guardianOpen)}
                                onChangeText={(text) => {
                                    const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                    setReceivedFrom(onlyLetters)
                                    setSelectedGuardian("")
                                    setGuardianOpen(false)
                                    setErrors(prev => ({ ...prev, guardianName: "" }))
                                }}
                            />

                            <Image
                                source={DownArrow}
                                style={{ width: 18, height: 18, tintColor: "#555" }}
                            />
                        </TouchableOpacity>
                        {errors.guardianName && <ErrorMessage message={errors.guardianName} type="error" />}

                        {guardianOpen && (
                            selectedTenant?.guardiansList?.length > 0 ? (
                                <>
                                    <TouchableWithoutFeedback onPress={() => {
                                        setGuardianOpen(false)
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
                                                        setSelectedGuardian(i)
                                                        setStateQuery("");
                                                        setGuardianOpen(false)
                                                        setErrors(prev => ({ ...prev, guardianName: "" }))
                                                    }}>
                                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>
                                                        {i.guardianName}</Text>
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
                        )} */}

                        <DropdownComponent
                            label="Received from"
                            required
                            placeholder="Enter/Select the Respective Person"
                            options={guardianOptions}
                            value={selectedGuardian?.guardianName || receivedFrom || null}
                            searchable
                            allowCustomValue
                            searchPlaceholder="Search Guardian..."
                            customValueLabel="Add"
                            emptyText="No guardian Details Available"
                            error={!!errors.guardianName}
                            onChange={(val) => {
                                const guardian = (selectedTenant?.guardiansList || []).find(
                                    // (g) => String(g.guardianId ?? g.guardianName) === String(val)
                                    (g) => String(g.guardianName) === String(val)
                                );

                                if (guardian) {
                                    setSelectedGuardian(guardian);
                                    setReceivedFrom("");
                                } else {
                                    // typed custom name
                                    setSelectedGuardian("");
                                    setReceivedFrom(String(val).replace(/[^A-Za-z\s]/g, ""));
                                }
                                setErrors((prev) => ({ ...prev, guardianName: "" }));
                            }}
                        />
                        {errors.guardianName ? (
                            <ErrorMessage message={errors.guardianName} type="error" />
                        ) : null}
                        <DatePickerComponent
                            label="Invoice Date"
                            required
                            selectedDate={paidDate ? dayjs(paidDate).format("YYYY-MM-DD") : null}
                            placeholder="DD/MM/YYYY"
                            displayFormat="DD/MM/YYYY"
                            minDate={
                                selectedTenant?.joiningDate
                                    ? dayjs(selectedTenant.joiningDate, "DD/MM/YYYY").format("YYYY-MM-DD")
                                    : undefined
                            }
                            maxDate={dayjs().format("YYYY-MM-DD")}
                            error={errors.paidDate}
                            onSelect={(date) => {
                                setPaidDate(dayjs(date).toDate());
                                setErrors((prev) => ({ ...prev, paidDate: "" }));
                            }}
                        />

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

                                    <Text style={styles.itemdetailTxt}>Item Detail</Text>

                                    {/* <TextInput
                                        style={styles.itemTxtInpt}
                                        value={item.itemDetail}
                                        placeholder="Enter Item"
                                        onChangeText={(text) => {
                                            const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                            handleChange(index, "itemDetail", onlyLetters)

                                        }} /> */}

                                    <InputComponent
                                        value={item.itemDetail}
                                        placeholder="Enter Item"
                                        onChangeText={(text) => {
                                            // setItems(items.itemDetail(text))
                                            const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
                                            handleChange(index, "itemDetail", onlyLetters)

                                        }}
                                    />


                                    {/* <Text style={styles.itemdetailTxt}>Retainer Type {" "}<Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                                    <TouchableOpacity onPress={() => {
                                        setErrors(prev => ({
                                            ...prev,
                                            [`retainerType_${index}`]: "",
                                        }));
                                        setOpenRetainerType(!openRetainerType)

                                    }}
                                        style={styles.retainTypeBox}>
                                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>
                                            {item.retainerType ? item?.retainerType : "Select Type"}</Text>

                                        <Image
                                            source={DownArrow}
                                            style={{ width: 18, height: 18, tintColor: "#555" }}
                                        />
                                    </TouchableOpacity>

                                    {errors[`retainerType_${index}`] && (
                                        <ErrorMessage
                                            message={errors[`retainerType_${index}`]}
                                            type="error"
                                        />
                                    )}

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
                                                    <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>
                                                        {i?.retainerType}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )} */}

                                    <DropdownComponent
                                        label="Retainer Type"
                                        required
                                        placeholder="Select Type"
                                        options={retainerTypeOptions}
                                        value={item.retainerType || null}
                                        error={!!errors[`retainerType_${index}`]}
                                        onChange={(val) => {
                                            handleChange(index, "retainerType", val);
                                            setErrors((prev) => ({ ...prev, [`retainerType_${index}`]: "" }));
                                        }}
                                    />
                                    {errors[`retainerType_${index}`] ? (
                                        <ErrorMessage message={errors[`retainerType_${index}`]} type="error" />
                                    ) : null}

                                    <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Regular', color: '#3C3C4399', marginTop: 12 }}>
                                        Amount {" "}<Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                                    {/* <ValidatedInput
                                        keyboardType="numeric"
                                        type="numberOnly"
                                        inputType="numeric"
                                        style={styles.itemAmountBox}
                                        placeholder="Enter Amount"
                                        value={item.amount}
                                        onChangeText={(text) => {
                                            const onlyNumbers = text.replace(/[^0-9\s]/g, "")
                                            handleChange(index, "amount", onlyNumbers)
                                            setErrors(prev => ({
                                                ...prev,
                                                [`amount_${index}`]: "",
                                            }));
                                        }} /> */}

                                    <InputComponent
                                        type="number"
                                        placeholder="Enter  Amount"
                                        // keyboardType="numeric"
                                        keyboardType="number-pad"
                                        value={item.amount}
                                        onChangeText={(text) => {
                                            const onlyNumbers = text.replace(/[^0-9\s]/g, "")
                                            handleChange(index, "amount", onlyNumbers)
                                            // setErrors(prev => ({ ...prev, retainerAmount: "" }))
                                            setErrors(prev => ({
                                                ...prev,
                                                [`amount_${index}`]: "",
                                            }));
                                        }}
                                        error={!!errors[`amount_${index}`]}
                                    />

                                    {errors[`amount_${index}`] && (
                                        <ErrorMessage
                                            message={errors[`amount_${index}`]}
                                            type="error"
                                        />
                                    )}

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

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                setShowPaymentMode(!showPaymentMode);
                                setErrors(prev => ({ ...prev, payMode: "" }));
                            }}
                            style={[
                                styles.inputBox,
                                { marginTop: 10 },
                            ]}
                        >
                            <View style={styles.selectedPaymentContainer}>
                                {selectedMode ? (() => {
                                    const selected = paymentOptionsV1.find(
                                        item => item.id === selectedMode
                                    );

                                    if (!selected) {
                                        return (
                                            <Text style={styles.pymentMthdTxt}>
                                                Select Payment Method
                                            </Text>
                                        );
                                    }

                                    return (
                                        <>
                                            <View
                                                style={[
                                                    styles.paymentMethodIcon,
                                                    getPaymentIconBg(selected.iconType),
                                                ]}
                                            >
                                                <Image
                                                    source={getPaymentIcon(selected)}
                                                    style={styles.paymentMethodIconImage}
                                                    resizeMode="contain"
                                                />
                                            </View>

                                            <View style={styles.paymentMethodDetails}>
                                                <Text
                                                    style={styles.paymentMethodName}
                                                    numberOfLines={1}
                                                >
                                                    {selected.title}
                                                </Text>

                                                <Text
                                                    style={styles.paymentMethodSubText}
                                                    numberOfLines={1}
                                                >
                                                    {selected.subLabel}
                                                </Text>
                                            </View>

                                            <View
                                                style={[
                                                    styles.paymentTypeBadge,
                                                    getPaymentBadgeBg(selected.iconType),
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.paymentTypeText,
                                                        getPaymentBadgeText(selected.iconType),
                                                    ]}
                                                >
                                                    {selected.badgeLabel}
                                                </Text>
                                            </View>
                                        </>
                                    );
                                })() : (
                                    <Text style={styles.pymentMthdTxt}>
                                        Select Payment Method
                                    </Text>
                                )}
                            </View>

                            <Image
                                source={DownArrow}
                                style={{ width: 18, height: 18, tintColor: "#555" }}
                            />
                        </TouchableOpacity>


                        {showPaymentMode && (
                            <View style={styles.paymentDropdownMenu}>
                                <ScrollView
                                    style={styles.paymentDropdownScroll}
                                    keyboardShouldPersistTaps="always"
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator
                                >
                                    {paymentOptionsV1.length > 0 ? (
                                        paymentOptionsV1.map((opt) => {
                                            const isSelected = selectedMode === opt.id;

                                            return (
                                                <TouchableOpacity
                                                    key={opt.id}
                                                    activeOpacity={0.7}
                                                    style={[
                                                        styles.paymentMethodRow,
                                                        isSelected && styles.paymentMethodRowSelected,
                                                    ]}
                                                    onPress={() => {
                                                        setSelectedMode(opt.id);
                                                        setSelectedBankId(opt.bankId);
                                                        setShowPaymentMode(false);
                                                    }}
                                                >
                                                    <View
                                                        style={[
                                                            styles.paymentMethodIcon,
                                                            getPaymentIconBg(opt.iconType),
                                                        ]}
                                                    >
                                                        <Image
                                                            source={getPaymentIcon(opt)}
                                                            style={styles.paymentMethodIconImage}
                                                            resizeMode="contain"
                                                        />
                                                    </View>

                                                    <View style={styles.paymentMethodDetails}>
                                                        <Text
                                                            style={styles.paymentMethodName}
                                                            numberOfLines={1}
                                                        >
                                                            {opt.title}
                                                        </Text>

                                                        <Text
                                                            style={styles.paymentMethodSubText}
                                                            numberOfLines={1}
                                                        >
                                                            {opt.subLabel}
                                                        </Text>
                                                    </View>

                                                    <View
                                                        style={[
                                                            styles.paymentTypeBadge,
                                                            getPaymentBadgeBg(opt.iconType),
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.paymentTypeText,
                                                                getPaymentBadgeText(opt.iconType),
                                                            ]}
                                                        >
                                                            {opt?.badgeLabel}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })
                                    ) : (
                                        <Text style={{ padding: 15, color: "#777" }}>
                                            No payment methods available
                                        </Text>
                                    )}
                                </ScrollView>
                            </View>
                        )}
                        {errors.payMode && <ErrorMessage message={errors.payMode} type="error" />}

                        <View ref={transactionRef}>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 12 }}>
                                Transaction ID
                            </Text>

                            {/* <TouchableOpacity style={[styles.inputBox, { marginTop: 10 }]}> */}
                            {/* <TextInput
                                ref={transactionRef}
                                value={transactionId}
                                style={[styles.inputBox, { marginTop: 10 }]}
                                placeholder="Enter Transaction ID"
                                onFocus={() => scrollToField(transactionRef)}
                                onChangeText={(text) => {
                                    const filteredText = text.replace(
                                        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/
                                        , ""
                                    );
                                    setTransactionId(filteredText)
                                }

                                } /> */}

                            <InputComponent
                                placeholder="Enter Transaction Id"
                                ref={transactionRef}
                                value={transactionId}
                                onFocus={() => scrollToField(transactionRef)}
                                onChangeText={(text) => {
                                    const filteredText = text.replace(
                                        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/
                                        , ""
                                    );
                                    setTransactionId(filteredText)
                                }

                                }
                            />
                        </View>

                        {/* <Image source={DownArrow} style={{ width: 18, height: 18, tintColor: "#555" }} /> */}
                        {/* </TouchableOpacity> */}

                        <View ref={descriptionRef}>
                            <Text style={styles.dscptTxt}>Description</Text>
                            <InputComponent
                                type="description"
                                value={description}
                                placeholder="Enter Description"
                                multiline
                                inputHeight={100}
                                onFocus={() => scrollToField(descriptionRef)}
                                onChangeText={handleDescriptionChange}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', marginTop: 22 }}>
                            <TouchableOpacity onPress={handleLeaveScreen}
                                style={{ marginRight: 8 }}>
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
                </KeyboardAvoidingView>
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
                                    selectedTenant.joiningDate, "DD/MM/YYYY"
                                ).format("YYYY-MM-DD") : undefined
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
            <LeavePageScreen
                visible={showLeavePageScreen}
                onClose={() => setShowLeavePageScreen(false)}
                discardClose={() => {
                    setShowLeavePageScreen(false)
                    setTimeout(() => {
                        navigation.goBack()
                    }, 300);
                }} />
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
        marginTop: 10, fontFamily: 'Gilroy-Medium', fontSize: 14
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
    // paymentMethodRow: {
    //     minHeight: 72,
    //     flexDirection: "row",
    //     alignItems: "center",
    //     paddingHorizontal: 14,
    //     paddingVertical: 10,
    //     borderBottomWidth: 1,
    //     borderBottomColor: "#F1F2F4",
    // },
    // paymentMethodIcon: {
    //     width: 40,
    //     height: 40,
    //     borderRadius: 22,
    //     justifyContent: "center",
    //     alignItems: "center",
    //     marginRight: 12,
    // },
    cashIconBg: {
        backgroundColor: "#DDF8E8",
    },
    bankIconBg: {
        backgroundColor: "#DCE9FF",
    },
    // paymentMethodDetails: {
    //     flex: 1,
    // },
    // paymentMethodName: {
    //     fontSize: 15,
    //     color: "#222",
    //     fontFamily: "Gilroy-Semibold",
    // },
    // paymentMethodSubText: {
    //     fontSize: 13,
    //     color: "#687083",
    //     marginTop: 3,
    //     fontFamily: "Gilroy-Medium",
    // },
    // paymentTypeBadge: {
    //     paddingHorizontal: 14,
    //     paddingVertical: 8,
    //     borderRadius: 18,
    // },
    cashBadge: {
        backgroundColor: "#DDF8E8",
    },
    bankBadge: {
        backgroundColor: "#DCE9FF",
    },
    paymentTypeText: {
        fontSize: 12,
        fontFamily: "Gilroy-Semibold",
    },
    cashText: {
        color: "#15803D",
    },
    bankText: {
        color: "#2563EB",
    },
    paymentDropdownMenu: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E2E2",
        borderRadius: 14,
        marginTop: 5,
        overflow: "hidden",
        zIndex: 1000,
        elevation: 5,
    },

    paymentDropdownScroll: {
        maxHeight: 240,
    },

    paymentMethodRow: {
        minHeight: 82,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F2F4",
        gap: 12,
    },

    paymentMethodRowSelected: {
        backgroundColor: "#F2F3F5",
    },

    selectedPaymentContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        minWidth: 0,
    },

    paymentMethodIcon: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
    },

    paymentMethodIconImage: {
        width: 25,
        height: 25,
        resizeMode: "contain",
    },

    paymentMethodDetails: {
        flex: 1,
        minWidth: 0,
    },

    paymentMethodName: {
        fontSize: 15,
        color: "#222222",
        fontFamily: "Gilroy-Semibold",
    },

    paymentMethodSubText: {
        fontSize: 13,
        color: "#687083",
        marginTop: 4,
        fontFamily: "Gilroy-Medium",
    },

    paymentTypeBadge: {
        minWidth: 68,
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },

    paymentTypeText: {
        fontSize: 12,
        fontFamily: "Gilroy-Semibold",
    },

    cashIconBg: {
        backgroundColor: "#DDF8E8",
    },
    upiIconBg: {
        backgroundColor: "#F3E5FF",
    },
    bankIconBg: {
        backgroundColor: "#DCE9FF",
    },
    cardIconBg: {
        backgroundColor: "#FFF0D9",
    },

    cashBadge: {
        backgroundColor: "#DDF8E8",
    },
    upiBadge: {
        backgroundColor: "#F3E5FF",
    },
    bankBadge: {
        backgroundColor: "#DCE9FF",
    },
    cardBadge: {
        backgroundColor: "#FFF0D9",
    },

    cashText: {
        color: "#15803D",
    },
    upiText: {
        color: "#9C27F0",
    },
    bankText: {
        color: "#2563EB",
    },
    cardText: {
        color: "#E84B00",
    },
    tenantRow: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    tenantSearchButton: {
        width: 48,
        height: 48,
        marginBottom: 6,
        marginLeft: -10,
        backgroundColor: "#2952FF",
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },

})

export default NewRetainerInvoiceSheet;