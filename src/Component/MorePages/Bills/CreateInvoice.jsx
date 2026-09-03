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
import Profile from "../../../Assets/Images/profile.png";
import ActiveIcon from "../../../Assets/Images/switch_hostel.png";
import EditConfigure from "../../../Assets/Images/Edit_Configure.png"

const CreateInvoice = ({ }) => {

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
    const [items, setItems] = useState([]);
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
    const [openDetailIndex, setOpenDetailIndex] = useState(null)

    // Invoice item rules:
    // - Advance is exclusive: selecting it removes all other rows.
    // - Room Rent and EB can each be selected only once.
    // - Other can be selected multiple times and uses a manual item name.
    const detailOptions = [
        "Advance",
        "Room Rent",
        "EB",
        "Other",
    ]

    const getDetailOptions = (currentIndex) => {
        const hasAdvance = items.some(
            (item, index) => index !== currentIndex && item?.itemDetail === "Advance"
        );

        if (hasAdvance) {
            return [];
        }

        const hasRoomRent = items.some(
            (item, index) => index !== currentIndex && item?.itemDetail === "Room Rent"
        );

        const hasEB = items.some(
            (item, index) => index !== currentIndex && item?.itemDetail === "EB"
        );

        return detailOptions.filter(option => {
            if (option === "Room Rent") return !hasRoomRent;
            if (option === "EB") return !hasEB;
            return true; // Advance + Other
        });
    }
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    const [modalType, setModalType] = useState("")
    const [isSubmitClicked, setIsSubmitClicked] = useState(false)
    const scrollRef = useRef(null);
    const descriptionRef = useRef(null);
    const transactionRef = useRef(null)

    const [discount, setDiscount] = useState("");
    const [discountType, setDiscountType] = useState("amount"); // amount | percentage
    const [discountError, setDiscountError] = useState("")


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


    // Advance is a standalone invoice type.
    // Once Advance is selected, no additional row can be added.
    const handleAddRow = () => {
        const hasAdvance = items.some(
            item => item?.itemDetail === "Advance"
        );

        if (hasAdvance) {
            return;
        }

        setItems(prev => [...prev, { ...emptyItem }]);
        setErrors({});
    }

    const handleDetailChange = (index, value) => {
        // Advance must be the only invoice row.
        if (value === "Advance") {
            setItems(prev => [{
                ...prev[index],
                itemDetail: "Advance",
                retainerType: "",
            }]);
            setOpenDetailIndex(null);
            setErrors({});
            return;
        }

        // Prevent duplicate Room Rent / EB even if state changes unexpectedly.
        const duplicate = items.some(
            (item, itemIndex) =>
                itemIndex !== index && item?.itemDetail === value &&
                ["Room Rent", "EB"].includes(value)
        );

        if (duplicate) {
            return;
        }

        setItems(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                itemDetail: value,
                ...(value !== "Other" ? { retainerType: "" } : {}),
            };
            return updated;
        });

        setOpenDetailIndex(null);
        setErrors(prev => ({
            ...prev,
            [`itemDetail_${index}`]: "",
        }));
    };

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
            const res = await retainerCustomerList( activeHostelId, "BILL")
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
        // if (!totalRetainerAmount) {
        //     newErrors.retainerAmount = "Please Enter Amount"
        // }

        items.forEach((item, index) => {

            if (!item?.itemDetail) {
                newErrors[`itemDetail_${index}`] =
                    "Please Select Detail";
            } else if (
                item.itemDetail === "Other" &&
                !String(item?.am_name || "").trim()
            ) {
                newErrors[`itemDetail_${index}`] =
                    "Please Enter Item Name";
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
        if (items.length === 0) {
            newErrors.items = "Please Add New Row";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
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
            detailedDescription: items[0]?.description || description,
            invoiceType: items[0]?.itemDetail,
            amount: totalRetainerAmount,
            items: items.map(item => ({
                detail:
                    item.itemDetail === "Other"
                        ? (item.am_name || "").trim()
                        : item.itemDetail,
                invoiceItem: item.itemDetail,
                description: item.description || "",
                amount: Number(item.amount || 0),
            })),
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

                <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ marginRight: 5 }}
                        onPress={() => navigation.goBack()} >
                        <Image source={ArrowLeft} style={{ width: 22, height: 22 }} />
                    </TouchableOpacity>
                    <Text style={styles.pageHead}>New Invoice</Text>
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

                        {selectedTenant?.customerId && (
                            <View style={styles.tenantProfileCard}>

                                {/* TOP PROFILE ROW */}
                                <View style={styles.profileTopRow}>
                                    <View style={styles.profileLeftSection}>
                                        {selectedTenant?.profilePic ? (
                                            <Image
                                                source={{ uri: selectedTenant.profilePic }}
                                                style={styles.tenantProfileImage}
                                            />
                                        ) : (
                                            <View style={styles.tenantInitialCircle}>
                                                <Text style={styles.tenantInitialText}>
                                                    {selectedTenant?.initials ||
                                                        selectedTenant?.fullName?.charAt(0)?.toUpperCase() ||
                                                        "?"}
                                                </Text>
                                            </View>
                                        )}

                                        <View style={styles.profileTextSection}>
                                            <Text
                                                style={styles.tntName}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {selectedTenant?.fullName || "-"}
                                            </Text>

                                            <Text
                                                style={styles.hstlDtl}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {selectedTenant?.stayInfo?.floorName || "-"} {" | "}
                                                {selectedTenant?.stayInfo?.roomName || "-"} {" | "}
                                                {selectedTenant?.stayInfo?.bedName || "-"}
                                            </Text>
                                        </View>
                                    </View>

                                    <Image
                                        source={ActiveIcon}
                                        style={styles.activeIcon}
                                    />
                                </View>

                                {/* BILLED TO */}
                                <View style={styles.billedToRow}>
                                    <Text style={styles.billedToLabel}>Billed to</Text>

                                    <Image
                                        source={EditConfigure}
                                        style={styles.billedEditIcon}
                                    />
                                </View>

                                {/* ADDRESS */}
                                <Text style={styles.tenantAddressText}>
                                    {[
                                        selectedTenant?.addressInfo?.houseNo,
                                        selectedTenant?.addressInfo?.street,
                                        selectedTenant?.addressInfo?.landmark,
                                        selectedTenant?.addressInfo?.city,
                                        selectedTenant?.addressInfo?.state,
                                        selectedTenant?.addressInfo?.pincode &&
                                        String(selectedTenant.addressInfo.pincode),
                                    ]
                                        .filter(
                                            value =>
                                                value !== null &&
                                                value !== undefined &&
                                                String(value).trim()
                                        )
                                        .join(", ") || "N/A"}
                                </Text>

                                {/* MOBILE */}
                                {!!selectedTenant?.mobile && (
                                    <Text style={styles.tenantMobileText}>
                                        +91 {selectedTenant.mobile}
                                    </Text>
                                )}
                            </View>
                        )}

                        <Text style={styles.headerTxt}>Invoice Number </Text>
                        <TextInput
                            ref={transactionRef}
                            value={transactionId}
                            style={[styles.inputBox, { marginTop: 10 }]}
                            // style={{fontSize:14,fontFamily:'Gilroy-Medium'}}
                            placeholder="Enter Invoice Number"
                            onFocus={() => scrollToField(transactionRef)}
                            onChangeText={(text) => {
                                const filteredText = text.replace(
                                    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/
                                    , ""
                                );
                                setTransactionId(filteredText)
                            }

                            } />




                        <Text style={styles.headerTxt}>Invoice Date <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>

                        <TouchableOpacity onPress={() => {
                            setOpenPaidDate(true)
                            setErrors(prev => ({ ...prev, paidDate: "" }))
                        }}
                            style={[styles.inputBox, { marginTop: 10 }]}>

                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium' }}>
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
                            <Text style={styles.descriptionTitle}>Description</Text>
                        </View>

                        {items.map((item, index) => (
                            <View style={styles.itemBox} key={index}>
                                <View style={styles.itemHealine}>
                                    <Text style={styles.itemTitle}>
                                        Item - {String(index + 1).padStart(2, "0")}
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() => handleDeleteRow(index)}
                                        style={styles.deleteItemButton}
                                    >
                                        <Text style={styles.closeIcon}>×</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.itemdetailTxt}>Detail</Text>

                                {item.itemDetail === "Other" ? (
                                    <View style={styles.otherItemInputRow}>
                                        <TextInput
                                            style={styles.otherItemInput}
                                            value={item.am_name || ""}
                                            placeholder="Enter Item Name"
                                            placeholderTextColor="#A0A0A0"
                                            autoFocus
                                            onChangeText={value => {
                                                handleChange(index, "am_name", value);
                                                setErrors(prev => ({
                                                    ...prev,
                                                    [`itemDetail_${index}`]: "",
                                                }));
                                            }}
                                        />

                                        <TouchableOpacity
                                            onPress={() => {
                                                handleChange(index, "itemDetail", "");
                                                handleChange(index, "am_name", "");
                                                setErrors(prev => ({
                                                    ...prev,
                                                    [`itemDetail_${index}`]: "",
                                                }));
                                            }}
                                            style={styles.otherClearButton}
                                        >
                                            <Text style={styles.closeIcon}>×</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setOpenDetailIndex(
                                                    openDetailIndex === index ? null : index
                                                );
                                                setOpenRetainerType(false);
                                                setErrors(prev => ({
                                                    ...prev,
                                                    [`itemDetail_${index}`]: "",
                                                }));
                                            }}
                                            style={styles.retainTypeBox}
                                        >
                                            <Text
                                                style={[
                                                    styles.detailValueText,
                                                    !item.itemDetail && styles.detailPlaceholder,
                                                ]}
                                            >
                                                {item.itemDetail || "Select Detail"}
                                            </Text>

                                            <Image
                                                source={DownArrow}
                                                style={styles.detailArrow}
                                            />
                                        </TouchableOpacity>

                                        {openDetailIndex === index && (
                                            <View style={styles.detailDropdownMenu}>
                                                {getDetailOptions(index).map(option => (
                                                    <TouchableOpacity
                                                        key={option}
                                                        onPress={() => handleDetailChange(index, option)}
                                                        style={styles.detailOption}
                                                    >
                                                        <Text style={styles.detailOptionText}>
                                                            {option}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </>
                                )}

                                {errors[`itemDetail_${index}`] && (
                                    <ErrorMessage
                                        message={errors[`itemDetail_${index}`]}
                                        type="error"
                                    />
                                )}

                                <TextInput
                                    style={styles.itemDescriptionInput}
                                    value={item.description || ""}
                                    placeholder="Add a description to your item"
                                    placeholderTextColor="#A0A0A0"
                                    multiline
                                    onChangeText={value =>
                                        handleChange(index, "description", value)
                                    }
                                />

                                <Text style={styles.itemdetailTxt}>
                                    Amount{" "}
                                    <Text style={{ color: "red", fontSize: 19 }}>*</Text>
                                </Text>

                                <ValidatedInput
                                    keyboardType="numeric"
                                    type="numberOnly"
                                    inputType="numeric"
                                    style={styles.itemAmountBox}
                                    placeholder="Enter Amount"
                                    value={item.amount}
                                    onChangeText={value => {
                                        const onlyNumbers = value.replace(/[^0-9]/g, "");
                                        handleChange(index, "amount", onlyNumbers);
                                        setErrors(prev => ({
                                            ...prev,
                                            [`amount_${index}`]: "",
                                        }));
                                    }}
                                />

                                {errors[`amount_${index}`] && (
                                    <ErrorMessage
                                        message={errors[`amount_${index}`]}
                                        type="error"
                                    />
                                )}
                            </View>
                        ))}

                        <TouchableOpacity
                            style={styles.addRowField}
                            onPress={() => {
                                setOpenDetailIndex(null);
                                setOpenRetainerType(false);
                                handleAddRow();
                            }}
                        >
                            <Image source={AddCircle} style={styles.addRowIcon} />
                            <Text style={styles.addRowTxt}>Add New Row</Text>
                        </TouchableOpacity>


                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold", }}>
                                    Sub Total
                                </Text>

                                <Text style={{
                                    fontSize: 16,
                                    fontFamily: "Gilroy-Bold",
                                    color: "#111827",
                                }}>
                                    ₹ {totalRetainerAmount.toLocaleString("en-IN")}
                                </Text>
                            </View>



                            <View style={styles.summaryInputRow}>


                                <View style={styles.discountRow}>

                                    <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold", }}>
                                        Discount
                                    </Text>
                                    <View style={styles.discountToggle}>
                                        <TouchableOpacity
                                            style={[
                                                styles.discountBtn,
                                                discountType === "amount" &&
                                                styles.discountBtnActive,
                                            ]}
                                            onPress={() => {
                                                setDiscountType("amount")
                                                setDiscountError("")
                                            }}
                                        >
                                            <Text style={{ color: discountType === "amount" ? "#fff" : "#00000" }}>₹</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styles.discountBtn,
                                                discountType === "percentage" &&
                                                styles.discountBtnActive,
                                            ]}
                                            onPress={() => {
                                                setDiscountType("percentage")
                                                setDiscountError("")
                                            }}
                                        >
                                            <Text style={{ color: discountType === "percentage" ? "#fff" : "#00000" }}>%</Text>
                                        </TouchableOpacity>
                                    </View>


                                    <ValidatedInput
                                        type="numberOnly"
                                        inputType="numeric"
                                        value={discount}
                                        onChangeText={(text) => {

                                            if (discountType === "percentage" && Number(text) > 100) {
                                                setDiscountError("Discount percentage cannot exceed 100%")
                                                return;
                                            }
                                            // else if (discountType === "amount" && Number(text) > amount) {
                                            //     setDiscountError("Discount amount cannot exceed total amount")
                                            //     return;
                                            // }
                                            setDiscount(text)
                                            setDiscountError("")
                                        }}
                                        placeholder="₹ 0.00"
                                        style={styles.discountInput}
                                    />
                                </View>
                                {discountError && <ErrorMessage message={discountError} type="error" />}
                            </View>

                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>
                                    TOTAL AMOUNT
                                </Text>
                                <Text style={styles.totalValue}>
                                    ₹
                                </Text>
                            </View>
                        </View>

                        {/* <View style={styles.totlRtnAmntFiel}>
                            <Text style={{ fontSize: 13, fontFamily: 'Gilroy-Semibold', color: '#505F76' }}>
                                Total  Amount</Text>
                            <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>₹ {totalRetainerAmount ? totalRetainerAmount : "0.00"} </Text>
                        </View> */}
                        {errors.retainerAmount && <ErrorMessage message={errors.retainerAmount} type="error" />}




                        <Text style={styles.dscptTxt}>Terms and Conditions</Text>

                        <TextInput
                            ref={descriptionRef}
                            style={styles.dscpBox}
                            placeholder="Enter terms and condition for this invoice"
                            value={description}
                            onFocus={() => scrollToField(descriptionRef)}
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
    descriptionTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Semibold",
        color: "#111827",
    },

    itemBox: {
        borderWidth: 1,
        borderColor: "#E2E2E2",
        borderRadius: 14,
        padding: 18,
        marginTop: 15,
        backgroundColor: "#FFFFFF",
    },

    itemTitle: {
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
        color: "#202020",
    },

    deleteItemButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "#FFF3F3",
        alignItems: "center",
        justifyContent: "center",
    },
    itemHealine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    closeIcon: {
        color: "#FF0000",
        fontSize: 24,
        lineHeight: 24,
    },

    detailValueText: {
        fontSize: 14,
        fontFamily: "Gilroy-Medium",
        color: "#202020",
    },

    detailPlaceholder: {
        color: "#8E8E93",
    },

    detailArrow: {
        width: 18,
        height: 18,
        tintColor: "#2952FF",
    },

    detailDropdownMenu: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginTop: 5,
        paddingVertical: 7,
        zIndex: 2000,
        elevation: 8,
    },

    detailOption: {
        paddingVertical: 9,
        paddingHorizontal: 14,
    },

    detailOptionText: {
        color: "black",
        fontSize: 14,
        fontFamily: "Gilroy-Medium",
    },

    itemDescriptionInput: {
        minHeight: 70,
        borderWidth: 1,
        borderColor: "#E2E2E2",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginTop: 12,
        fontFamily: "Gilroy-Regular",
        fontSize: 14,
        textAlignVertical: "top",
        backgroundColor: "#FAFAFA",
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

    otherItemInputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },

    otherItemInput: {
        flex: 1,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E2E2E2",
        paddingHorizontal: 14,
        backgroundColor: "#fff",
        fontFamily: "Gilroy-Medium",
        fontSize: 14,
    },

    otherClearButton: {
        width: 32,
        height: 32,
        marginLeft: 6,
        borderRadius: 8,
        backgroundColor: "#FFF3F3",
        alignItems: "center",
        justifyContent: "center",
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EAEEFF",
        marginTop: 12,
        paddingVertical: 12,
        borderRadius: 6,
    },

    addRowIcon: {
        width: 18,
        height: 18,
        tintColor: "#1E45E1",
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

    summaryCard: {
        backgroundColor: "#F7F7F8",
        borderRadius: 20,
        marginTop: 20,
        overflow: "hidden",
        paddingTop: 10,
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 18,
    },

    summaryInputRow: {
        paddingHorizontal: 18,
        marginBottom: 20,
    },

    rightInputWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },

    taxInput: {
        width: 150,
        height: 54,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 13,
        backgroundColor: "#FFF",
        paddingLeft: 15,
    },

    discountInput: {
        width: 150,
        height: 54,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 13,
        backgroundColor: "#FFF",
        paddingLeft: 15
    },

    totalContainer: {
        marginTop: 10,
        backgroundColor: "#EEF1F5",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 22,
        paddingVertical: 14,
    },

    totalLabel: {
        fontSize: 15,
        fontFamily: "Gilroy-Bold",
        color: "#475569",
    },

    totalValue: {
        fontSize: 20,
        fontFamily: "Gilroy-Bold",
        color: "#111827",
    },

    discountRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    discountToggle: {
        flexDirection: "row",
        backgroundColor: "#E9EEFF",
        borderRadius: 10,
        padding: 4,
        width: 85,
        height: 40,
    },

    discountBtn: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },

    discountBtnActive: {
        backgroundColor: "#2952FF",
    },

    discountBtnText: {
        color: "#1E1E1E",
        fontFamily: "Gilroy-Bold",
    },

    discountBtnTextActive: {
        color: "#FFFFFF",
        fontFamily: "Gilroy-Bold",
    },


    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderColor: "#E2E8F0",
        paddingTop: 16
    },
    prflField: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    txtinputhead: {
        fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 12,
    },
    tntName: {
        fontSize: 18, fontFamily: 'Gilroy-Semibold',
    },
    hstlDtl: {
        fontSize: 12, fontFamily: 'Gilroy-Medium', color: "#616161",
        marginTop: 7
    },
    tenantProfileCard: {
        backgroundColor: "#F9FAFB",
        borderRadius: 14,
        padding: 14,
        marginTop: 10,
    },

    profileTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    profileLeftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 10,
    },

    profileTextSection: {
        flex: 1,
        marginLeft: 10,
    },

    tenantProfileImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },

    tenantInitialCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E1E8F0",
        alignItems: "center",
        justifyContent: "center",
    },

    tenantInitialText: {
        fontSize: 16,
        fontFamily: "Gilroy-Bold",
        color: "#334155",
    },

    tntName: {
        fontSize: 17,
        fontFamily: "Gilroy-Semibold",
        color: "#111827",
    },

    hstlDtl: {
        fontSize: 12,
        fontFamily: "Gilroy-Medium",
        color: "#616161",
        marginTop: 5,
    },

    activeIcon: {
        width: 20,
        height: 20,
    },

    billedToRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
    },

    billedToLabel: {
        fontSize: 14,
        fontFamily: "Gilroy-Medium",
        color: "#111827",
    },

    billedEditIcon: {
        width: 15,
        height: 15,
        marginLeft: 6,
    },

    tenantAddressText: {
        fontSize: 13,
        fontFamily: "Gilroy-Medium",
        color: "#5E6470",
        marginTop: 6,
        lineHeight: 19,
    },

    tenantMobileText: {
        fontSize: 13,
        fontFamily: "Gilroy-Semibold",
        color: "#5E6470",
        marginTop: 8,
    },
    prflField: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
})


export default CreateInvoice;