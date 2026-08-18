import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    Image, TouchableWithoutFeedback
} from 'react-native';

import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import AddCircle from "../../Assets/Images/add-circle.png";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import CalendarImg from "../../Assets/Images/calendar.png";
import { useFloor } from "../../Context/PayingGuestContext";
import { CommonContexts } from "../../Context/CommonContext";
import { useCustomer } from '../../Context/CustomerContext';
import Delete from "../../Assets/Images/remove.png";
import ErrorMessage from '../ErrorMessagr/Errormessagestyle';
import SuccessModal from '../../ToastFile/ToastPage';
import { Calendar } from "react-native-calendars";
import customParseFormat from "dayjs/plugin/customParseFormat";
import CommingSoon from "../../Assets/Images/Coming_soon.png"
import BedIcon from "../../Assets/Images/bed_NewIcon.png";
import { Switch } from "react-native";
import BedDetailsSheet from "./BedDetailsBottomsheet"





export default function BookingCheckIn({ navigation, route }) {


    const { customerId, customer, onSuccess, selectedBedReserv, PGselectedBed, isDashboardCheckIn = false, } = route.params || {};
    // const { customerId, customer, selectedBedReserv, selectedBed, onSuccess} = route.params || {};
    console.log("customerten", customerId)
    console.log("customer", customer);

    const isPGBooking = !!selectedBedReserv && !!PGselectedBed;

    const [tab, setTab] = useState("long");
    const { activeHostelId } = useContext(CommonContexts);
    const { getAllFloorsByHostel, getAllRoomsByFloor, getAllBedsByRoom } = useFloor();
    const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel,
        initializeCheckIn, bookedCheckInCustomer,
        BookedTenantCheckIn } = useCustomer();

    const isSubmittingRef = useRef(false);
    const [floors, setFloors] = useState([]);
    const [floorOpen, setFloorOpen] = useState(false);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [roomOpen, setRoomOpen] = useState(false);

    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");


    const [selectedRoom, setSelectedRoom] = useState(null);

    const [showBedSheet, setShowBedSheet] = useState(false);
    const [selectedBedDetails, setSelectedBedDetails] = useState(null);

    const [beds, setBeds] = useState([]);
    const [bedOpen, setBedOpen] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const [floorError, setFloorError] = useState("")
    const [roomError, setRoomError] = useState("")
    const [bedError, setBedError] = useState('')
    const [advanceError, setAdvanceError] = useState("")
    const [rentError, setRentError] = useState("")
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [joiningDate, setJoiningDate] = useState(new Date());
    const [advanceAmount, setAdvanceAmount] = useState("");
    const [rentalAmount, setRentalAmount] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [extraCharges, setExtraCharges] = useState([]);
    const [bookingDetails, setBookingDetails] = useState("")
    const [bookingDetailsError, setBookingDetailsError] = useState("")
    const [onetimepaymentcharges, setOneTimePaymentCharges] = useState([]);
    const onetimepaymentmaintenanceAlreadyUsed = onetimepaymentcharges?.some(c => c?.type === "Maintenance");


    const [refuseAdvanceAmount, setRefuseAdvanceAmount] = useState(false);
    const [collectFullRent, setCollectFullRent] = useState(false);
    const [showCustomRentEditor, setShowCustomRentEditor] = useState(false);
    const [customRentAmount, setCustomRentAmount] = useState("");
    const [savedCustomRent, setSavedCustomRent] = useState("");
    const [isCustomRentSaved, setIsCustomRentSaved] = useState(false);
    const [customRentError, setCustomRentError] = useState("");

    const [proceedcheckin, setProceedCheckin] = useState(false);

    const [availableBeds, setAvailableBeds] = useState([]);

    console.log("bookingDetails", bookingDetails)

    useEffect(() => {
        if (!activeHostelId) return;

        loadFloors();
    }, [activeHostelId]);

    const loadFloors = async () => {
        const res = await getAllFloorsByHostel(activeHostelId);
        if (res.success) {
            setFloors(res.data);


        }
    };


    const loadRooms = async (floorId) => {
        const res = await getAllRoomsByFloor(floorId);
        if (res.success) {
            setRooms(res.data);
        } else {
            setRooms([]);
        }
    };
    const checkInCustomerId = customerId || selectedBedReserv?.tenetId;

    useEffect(() => {
        if (!activeHostelId || !checkInCustomerId) return;

        const initCheckIn = async () => {
            const res = await initializeCheckIn(activeHostelId, checkInCustomerId);
            console.log("initCheckIn", res)
            if (res?.success) {
                setBookingDetails(res.data);
                if (res?.data?.bedName === null) {
                    setBookingDetailsError("Bed is Unavailable")

                    await loadBeds(joiningDate);
                    setSelectedFloor(null);
                    setSelectedRoom(null);
                    setSelectedBed(null);
                }
            }
            else {

                setBookingDetailsError(res?.message);

                await loadBeds(joiningDate);

                setSelectedFloor(null);
                setSelectedRoom(null);
                setSelectedBed(null);
            }
        };

        initCheckIn();
    }, [activeHostelId, checkInCustomerId]);




    const isAssignDisabled = !!bookingDetailsError;



    useEffect(() => {
        if (!activeHostelId || !joiningDate) return;

        loadBeds(joiningDate);
    }, [activeHostelId]);


    const loadBeds = async (date = joiningDate) => {
        if (!activeHostelId) return;

        const formattedDate = dayjs(date).format("DD-MM-YYYY");

        const res = await getBedsByHostelAndDate(
            activeHostelId,
            formattedDate
        );

        console.log("avaolblebeds", res);

        if (res.success) {
            const list = res.data?.listBeds || [];

            setBeds(list);

            // Floor options
            const floorList = [
                ...new Map(
                    list.map(item => [
                        item.floorId,
                        {
                            id: item.floorId,
                            name: item.floorName,
                        },
                    ])
                ).values(),
            ];

            setFloors(floorList);

        } else {
            setBeds([]);
        }
    };


    const displayName = isPGBooking
        ? selectedBedReserv.tenantFullName
        : customer?.fullName;

    const countryCode =
        isPGBooking
            ? selectedBedReserv?.countryCode
            : customer?.countryCode;

    const displayMobile = isPGBooking
        ? selectedBedReserv?.mobile
        : customer?.mobile || customer?.mobileNo

    const bookingDate = isPGBooking
        ? selectedBedReserv.bookingDate
        : bookingDetails?.bookedDate || customer?.bookedAt;

    const defaultRent = isPGBooking
        ? PGselectedBed?.rentAmount
        : bookingDetails?.rent;

    const profilePic =
        isPGBooking
            ? selectedBedReserv?.profilePic
            : customer?.profilePic;


    // const filteredBeds = beds.filter(bed => {
    //     if (!selectedFloor || !selectedRoom) return false;

    //     return (
    //         bed.floorId === selectedFloor.id &&
    //         bed.roomId === selectedRoom.id &&
    //         bed.currentStatus === "VACANT"
    //     );
    // });

    const handleshowBedDetailsheet = () => {
        if (!joiningDate) return
        setShowBedSheet(true);
    }

    const filteredBeds = beds.filter(item =>
        item.floorId === selectedFloor?.id &&
        item.roomId === selectedRoom?.id &&
        item.currentStatus === "VACANT"
    );

    const maintenanceAlreadyUsed = extraCharges.some(c => c.type === "Maintenance");


    const TYPE_OPTIONS = ["Maintenance", "Others"];


    const addCharge = () => {
        setExtraCharges(prev => [
            ...prev,
            { id: Date.now(), type: "", title: "", amount: "" }
        ]);
    };

    const removeCharge = (id) => {
        setExtraCharges(prev => prev.filter(i => i.id !== id));

    };

    const selectType = (id, type) => {


        if (type === "Maintenance" && maintenanceAlreadyUsed) return;

        setExtraCharges(prev =>
            prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "" } : i))
        );

        setOpenDropdownId(null);
    };


    // useEffect(() => {
    //     if (!customer) return;


    //     setSelectedFloor({
    //         id: customer.floorId,
    //         name: customer.floorName || customer?.bookingInfo?.bookedFloor,
    //     });


    //     setSelectedRoom({
    //         id: customer.roomId,
    //         name: customer.roomName || customer?.bookingInfo?.bookedRoom,
    //     });


    //     setSelectedBed({
    //         bedId: customer.bedId,
    //         bedName: customer.bedName || customer?.bookingInfo?.bookedBed,
    //     });




    // }, [customer]);


    useEffect(() => {

        if (isPGBooking) {

            setSelectedFloor({
                id: PGselectedBed.floorId,
                name: PGselectedBed.floorName,
            });

            setSelectedRoom({
                id: PGselectedBed.roomId,
                name: PGselectedBed.roomName,
            });

            setSelectedBed({
                bedId: PGselectedBed.bedId,
                bedName: PGselectedBed.bedName,
            });

            return;
        }

        if (customer) {
            setSelectedFloor({
                id: customer.floorId,
                name: customer.floorName || customer?.bookingInfo?.bookedFloor,
            });


            setSelectedRoom({
                id: customer.roomId,
                name: customer.roomName || customer?.bookingInfo?.bookedRoom,
            });


            setSelectedBed({
                bedId: customer.bedId,
                bedName: customer.bedName || customer?.bookingInfo?.bookedBed,
            });

        }

    }, [customer, selectedBedReserv, PGselectedBed]);






    const updateTitle = (id, title) => {
        // setExtraCharges(prev =>
        //     prev.map(i => (i.id === id ? { ...i, title } : i))
        // );
        setExtraCharges(prev =>
            prev.map(i =>
                i.id === id
                    ? { ...i, title, titleError: "" }
                    : i
            )
        );
    };

    const selectOntimeType = (id, type) => {


        if (type === "Maintenance" && onetimepaymentmaintenanceAlreadyUsed) return;

        setOneTimePaymentCharges(prev =>
            prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "", typeError: "" } : i))
        );

        setOpenDropdownId(null);
    };


    const OneTimeupdateTitle = (id, title) => {
        // setExtraCharges(prev =>
        //   prev.map(i => (i.id === id ? { ...i, title } : i))
        // );
        setOneTimePaymentCharges(prev =>
            prev.map(i =>
                i.id === id
                    ? { ...i, title, titleError: "" }
                    : i
            )
        );
    };

    const OneTimeupdateAmount = (id, amount) => {
        const onlyNum = amount.replace(/[^0-9]/g, "");

        setOneTimePaymentCharges((prev) =>
            prev.map((i) =>
                i.id === id
                    ? { ...i, amount: onlyNum, amountError: "" }
                    : i
            )
        )
    }

    const AddOnetimeCharge = () => {
        setOneTimePaymentCharges(prev => [
            ...prev,
            { id: Date.now(), type: "", title: "", amount: "" }
        ]);
    };

    const removeOnetimeCharge = (id) => {
        setOneTimePaymentCharges(prev => prev.filter(i => i.id !== id));

    };

    const validateOneTimeCharges = () => {
        let valid = true;

        const updated = onetimepaymentcharges.map((e) => {
            let titleError = "";
            let amountError = "";
            let typeError = "";

            const titleFilled = e.title?.trim()?.length > 0;
            const amountFilled = e.amount !== "" && e.amount !== null && e.amount !== undefined;

            const amt = Number(e.amount);


            if (!e.type) {
                typeError = "Please select type";
                valid = false;
                return { ...e, typeError, titleError: "", amountError: "" };
            }


            if (e.type === "Maintenance") {
                if (!amountFilled) {
                    amountError = "Please enter amount";
                    valid = false;
                } else if (isNaN(amt) || amt <= 0) {
                    amountError = "Amount must be greater than 0";
                    valid = false;
                }

                return { ...e, typeError: "", titleError: "", amountError };
            }

            // ✅ CASE 3: Others -> reason + amount both mandatory
            if (e.type === "Others") {
                // both empty -> ok (optional row)
                // if (!titleFilled && !amountFilled) {
                //   return { ...e, titleError: "", amountError: "" };
                // }

                if (!titleFilled && !amountFilled) {
                    titleError = "Please enter reason";
                    valid = false;
                }

                else if (!titleFilled) {
                    titleError = "Please enter reason";
                    valid = false;
                }

                else if (!amountFilled) {
                    amountError = "Please enter amount";
                    valid = false;
                } else if (isNaN(amt) || amt <= 0) {
                    amountError = "Amount must be greater than 0";
                    valid = false;
                }

                return { ...e, typeError, titleError, amountError };
            }

            return { ...e, typeError: "", titleError: "", amountError: "" };
        });

        setOneTimePaymentCharges(updated);
        return valid;
    };

    const updateAmount = (id, amount) => {
        const onlyNum = amount.replace(/[^0-9]/g, "");

        setExtraCharges((prev) =>
            prev.map((i) =>
                i.id === id
                    ? { ...i, amount: onlyNum, amountError: "" }
                    : i
            )
        );
    };

    const bookedAtDate = dayjs(bookingDetails?.bookedDate, "DD/MM/YYYY");
    const today = dayjs();
    dayjs.extend(customParseFormat);
    const isDisabledJoiningDate = (date) => {
        if (!date) return false;

        if (date.isBefore(bookedAtDate, "day")) return true;

        if (date.isAfter(today, "day")) return true;

        return false;
    };

    const joiningMarkedDates = {};

    for (let i = -365; i <= 365; i++) {
        const d = dayjs().add(i, "day");
        const key = d.format("YYYY-MM-DD");

        if (isDisabledJoiningDate(d)) {
            joiningMarkedDates[key] = {
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




    const onFloorChange = (v) => {
        setSelectedFloor(v);
        const r = rooms[v][0];
        const b = beds[r][0];
        setSelectedRoom(r);
        setSelectedBed(b);
    };
    const validateLongStay = () => {
        let valid = true;
        setFloorError("");
        setRoomError("");
        setBedError("");
        setAdvanceError("");
        setRentError("");

        if (!selectedFloor) {
            setFloorError("Please Select a Floor");
            valid = false;
        }

        if (!selectedRoom) {
            setRoomError("Please Select a Room");
            valid = false;
        }

        if (!selectedBed) {
            setBedError("Please Select a Bed");
            valid = false;
        }

        if (!refuseAdvanceAmount && !advanceAmount) {
            setAdvanceError("Please Enter Advance Amount");
            valid = false;
        }

        if (!rentalAmount || Number(rentalAmount) <= 0) {
            setRentError("Please Enter Rental Amount");
            valid = false;
        }

        return valid;
    };
    const validateExtraCharges = () => {
        let valid = true;

        const updated = extraCharges.map((e) => {
            let titleError = "";
            let amountError = "";

            const titleFilled = e.title?.trim()?.length > 0;
            const amountFilled = e.amount !== "" && e.amount !== null && e.amount !== undefined;

            const amt = Number(e.amount);


            if (!e.type) {
                return { ...e, titleError: "", amountError: "" };
            }


            if (e.type === "Maintenance") {
                if (!amountFilled) {
                    amountError = "Please enter maintenance amount";
                    valid = false;
                } else if (isNaN(amt) || amt <= 0) {
                    amountError = "Amount must be greater than 0";
                    valid = false;
                }

                return { ...e, titleError: "", amountError };
            }

            // ✅ CASE 3: Others -> reason + amount both mandatory
            if (e.type === "Others") {
                // both empty -> ok (optional row)
                // if (!titleFilled && !amountFilled) {
                //     return { ...e, titleError: "", amountError: "" };
                // }

                if (!titleFilled && !amountFilled) {
                    titleError = "Please enter reason";
                    valid = false;
                }

                else if (!titleFilled) {
                    titleError = "Please enter reason";
                    valid = false;
                }

                else if (!amountFilled) {
                    amountError = "Please enter amount";
                    valid = false;
                } else if (isNaN(amt) || amt <= 0) {
                    amountError = "Amount must be greater than 0";
                    valid = false;
                }

                return { ...e, titleError, amountError };
            }

            return { ...e, titleError: "", amountError: "" };
        });

        setExtraCharges(updated);
        return valid;
    }


    console.log("Selected Bed", selectedBed);

    console.log("bookingtocheckincustomerId", customerId, selectedBedReserv?.tenetId)

    const submitLongStay = async () => {
        const isValid = validateLongStay();

        if (!isValid) return;
        const chargeValid = validateExtraCharges();
        // const onetimechargevalid = validateOneTimeCharges()
        // if (!chargeValid || !onetimechargevalid) return;
        if (!chargeValid) return;
        //  if(!checkInCustomerId) return

        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        try {

            const payload = {
                floorId: selectedFloor?.id,
                roomId: selectedRoom?.id,
                bedId: selectedBed?.bedId,

                joiningDate: dayjs(joiningDate).format("DD-MM-YYYY"),

                refundableAmount: refuseAdvanceAmount
                    ? 0
                    : Number(advanceAmount || 0),

                rentalAmount: Number(rentalAmount || 0),

                stayType: "LONG",

                deductions: extraCharges.map(item => ({
                    type:
                        item.type === "Others"
                            ? item.title.trim()
                            : item.type,
                    amount: Number(item.amount || 0),
                })),

                shouldCollectFullRent: collectFullRent,

                customRent:
                    collectFullRent && savedCustomRent
                        ? Number(savedCustomRent)
                        : 0,

                oneTimeDeduction: onetimepaymentcharges.map(item => ({
                    type:
                        item.type === "Others"
                            ? item.title.trim()
                            : item.type,
                    amount: Number(item.amount || 0),
                })),
            }

            console.log("bookingtocheckincustomerId", checkInCustomerId)
            console.log("bookingtocheckinpayload", payload)

            // const checkInCustomerId = customerId || selectedBedReserv?.tenantId;

            const res = await BookedTenantCheckIn(
                activeHostelId,
                checkInCustomerId,
                payload
            );

            console.log("bookingtocheckinres", res);


            if (res?.success) {
                setModalType("success");
                setMessage(res.data);
                setShowSuccess(true);
                navigation.goBack();

                if (onSuccess) {
                    await onSuccess();
                }


                await getAllBedsByRoom(selectedRoom.id);

                setTimeout(() => {
                    setShowSuccess(false);
                }, 800);

            } else {
                setModalType("error");
                setMessage(res?.message);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                }, 800);
            }

        }
        finally {
            isSubmittingRef.current = false;
        }

    }

    const summaryAdvanceAmount = Number(advanceAmount || 0);

    const deductionTotal = [...extraCharges].reduce(
        (total, item) => total + Number(item.amount || 0), 0)

    const summaryRent = Number(rentalAmount || 0)

    const summaryAmount = summaryAdvanceAmount + deductionTotal + summaryRent;




    return (
        <>
            <SuccessModal visible={showSuccess} message={message} type={modalType} />
            <SafeAreaView style={styles.safe}>
                {/* <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : undefined}
> */}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation?.goBack?.()}
                            style={styles.backBtn}
                        >
                            <Image source={ArrowLeft} style={{ height: 20, width: 20 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Tenant Check-Info</Text>
                    </View>

                    <View style={styles.segmentRow}>
                        <TouchableOpacity
                            style={[styles.segment, tab === "long" && styles.segmentActive]}
                            onPress={() => setTab("long")}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    tab === "long" && styles.segmentTextActive,
                                ]}
                            >
                                Long Stay
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.segment, tab === "short" && styles.segmentActive]}
                            onPress={() => setTab("short")}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    tab === "short" && styles.segmentTextActive,
                                ]}
                            >
                                Short Stay
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* <ScrollView
  style={styles.container}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: 60,  
  }}
> */}
                    <ScrollView
                        style={styles.container}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 80, // ✅ button row height + extra space
                        }}
                    >




                        {tab === "long" && (
                            <View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                                    {profilePic ? <Image source={{ uri: profilePic }} style={{ width: 45, height: 45, borderRadius: 22.5, }} /> :

                                        <View style={{
                                            width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#e6e7eb',
                                            justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold' }}>{customer?.initials || selectedBedReserv?.tenantInitials}</Text>

                                        </View>
                                    }

                                    <View style={{ marginLeft: 8 }}>
                                        <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>{displayName}</Text>
                                        <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 4 }}>
                                            +{countryCode} {displayMobile}</Text>
                                    </View>
                                </View>

                                <Text style={styles.label}>Booking Date</Text>

                                <TouchableOpacity
                                    // style={styles.dateBox}
                                    // style={[
                                    //     styles.dateBox,
                                    //     bookingDetails?.bookedDate && { backgroundColor: "#F3F4F6" }
                                    // ]}
                                    // disabled={!!bookingDetails?.bookedDate}
                                    style={[
                                        styles.dateBox,
                                        (bookingDate) && {
                                            backgroundColor: "#F3F4F6",
                                        },
                                    ]}
                                    disabled={!!(bookingDate)}
                                >
                                    <Text style={styles.placeholder}>
                                        {/* {bookingDetails?.bookedDate} */}
                                        {bookingDate || "DD-MM-YYYY"}
                                    </Text>
                                    <Image source={CalendarImg} style={styles.calendarIcon} />
                                </TouchableOpacity>

                                <Text style={styles.label}>Joining Date <Text style={{ color: "red" }}>*</Text></Text>

                                <TouchableOpacity
                                    style={styles.dateBox}
                                    onPress={() => setOpenDatePicker(true)}
                                >
                                    <Text style={styles.placeholder}>
                                        {joiningDate ? dayjs(joiningDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                                    </Text>
                                    <Image source={CalendarImg} style={styles.calendarIcon} />
                                </TouchableOpacity>


                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' }}>
                                    <Text>Select Stay Details <Text style={{ color: "red" }}>*</Text></Text>
                                    <TouchableOpacity style={{
                                        flexDirection: 'row', backgroundColor: '#EDF3FF', padding: 10, paddingHorizontal: 10,
                                        opacity: isDashboardCheckIn || bookingDetails?.bedName !=null && styles.disabledSelect ? 0.5 : 1,
                                    }}
                                        onPress={handleshowBedDetailsheet}
                                        disabled={isDashboardCheckIn ||bookingDetails?.bedName !=null}
                                    >

                                        <Image source={BedIcon} style={{ height: 20, width: 20, marginRight: 10 }} />

                                        <Text style={{ color: '#1E45E1' }}>Bed Layout View</Text>
                                    </TouchableOpacity>

                                </View>



                                <Text style={styles.label}>Floor</Text>

                                <View style={{ position: "relative" }}>
                                    <TouchableOpacity
                                        // style={[
                                        //     styles.select,
                                        // ]}
                                        style={[
                                            styles.select,
                                            isDashboardCheckIn || bookingDetails?.bedName !=null && styles.disabledSelect,
                                        ]}
                                        onPress={() => setFloorOpen(!floorOpen)}
                                        disabled={isDashboardCheckIn || bookingDetails?.bedName !=null}
                                    // disabled={!!customer}
                                    >
                                        <Text style={styles.selectText}>
                                            {selectedFloor?.name || "Select a Floor"}
                                        </Text>
                                        <Image source={DownArrow} style={styles.arrow} />
                                    </TouchableOpacity>


                                    {floorOpen && (
                                        <View style={styles.dropdownMenu}>
                                            <ScrollView style={{ maxHeight: 160 }}>
                                                {floors.map((v) => (

                                                    <TouchableOpacity
                                                        key={v.id}
                                                        style={styles.option}
                                                        onPress={() => {
                                                            setSelectedFloor(v);
                                                            setFloorOpen(false);

                                                            const roomList = [
                                                                ...new Map(
                                                                    beds
                                                                        .filter(item => item.floorId === v.id)
                                                                        .map(item => [
                                                                            item.roomId,
                                                                            {
                                                                                id: item.roomId,
                                                                                name: item.roomName,
                                                                            },
                                                                        ])
                                                                ).values(),
                                                            ];

                                                            setRooms(roomList);

                                                            setSelectedRoom(null);
                                                            setSelectedBed(null);
                                                        }}
                                                    >
                                                        <Text style={styles.optionText}>{v.name}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>
                                {floorError && (
                                    <ErrorMessage message={floorError} type="error" />
                                )}


                                <Text style={styles.label}>Room</Text>

                                <View style={{ position: "relative" }}>
                                    <TouchableOpacity
                                        // style={[
                                        //     styles.select,
                                        // ]}
                                        style={[
                                            styles.select,
                                            isDashboardCheckIn || bookingDetails?.bedName !=null && styles.disabledSelect,
                                        ]}
                                        disabled={isDashboardCheckIn || bookingDetails?.bedName !=null}
                                        onPress={() => {
                                            if (selectedFloor) {
                                                setRoomOpen(!roomOpen);
                                            }
                                        }}
                                    // disabled={!!customer}
                                    >
                                        <Text style={styles.selectText}>
                                            {selectedRoom?.name || "Select a Room"}
                                        </Text>
                                        <Image source={DownArrow} style={styles.arrow} />
                                    </TouchableOpacity>

                                    {roomOpen && rooms.length > 0 && (
                                        <View style={styles.dropdownMenu}>
                                            <ScrollView style={{ maxHeight: 160 }}>
                                                {rooms.map((r) => (
                                                    <TouchableOpacity
                                                        key={r.id}
                                                        style={styles.option}
                                                        onPress={() => {
                                                            setSelectedRoom(r);
                                                            setRoomOpen(false);
                                                            setSelectedBed(null);
                                                        }}
                                                    >
                                                        <Text style={styles.optionText}>{r.name}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>
                                {roomError && (
                                    <ErrorMessage message={roomError} type="error" />
                                )}
                                <Text style={styles.label}>Bed</Text>

                                <View style={{ position: "relative" }}>
                                    <TouchableOpacity
                                        style={[
                                            styles.select,
                                            isDashboardCheckIn || bookingDetails?.bedName !=null && styles.disabledSelect,
                                        ]}
                                        disabled={isDashboardCheckIn || bookingDetails?.bedName !=null}
                                        onPress={() => {
                                            if (selectedRoom) {
                                                setBedOpen(!bedOpen);
                                            }
                                        }}
                                    // disabled={!!customer}
                                    >
                                        <Text style={styles.selectText}>
                                            {selectedBed?.bedName || "Select a Bed"}
                                        </Text>
                                        <Image source={DownArrow} style={styles.arrow} />
                                    </TouchableOpacity>


                                    {bedOpen && filteredBeds.length > 0 && (
                                        <View style={styles.dropdownMenu}>
                                            <ScrollView style={{ maxHeight: 160 }}>
                                                {/* {filteredBeds.map((b) => (
                                                    <TouchableOpacity
                                                        key={b.bedId}
                                                        style={styles.option}
                                                        onPress={() => {
                                                            setSelectedBed(b);
                                                            setBedOpen(false);

                                                        }}
                                                    >
                                                        <Text style={styles.optionText}>
                                                            {b.bedName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))} */}
                                                {filteredBeds.map(item => (
                                                    <TouchableOpacity
                                                        key={item.bedId}
                                                        style={styles.option}
                                                        onPress={() => {
                                                            setSelectedBed(item);
                                                            setBedOpen(false);
                                                            setBookingDetailsError("")
                                                        }}
                                                    >
                                                        <Text style={styles.optionText}>{item.bedName}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>
                                {bedError && (
                                    <ErrorMessage message={bedError} type="error" />
                                )}

                                {bookingDetailsError && (
                                    <ErrorMessage message={bookingDetailsError} type="error" style={{ alignSelf: "center" }} />
                                )}






                                <View style={styles.switchRow}>
                                    <Text style={styles.switchLabel}>
                                        Do you want to refuse advance amount?
                                    </Text>

                                    <Switch
                                        value={refuseAdvanceAmount}
                                        onValueChange={(value) => {
                                            setRefuseAdvanceAmount(value);

                                            if (value) {
                                                setAdvanceAmount("");
                                                setAdvanceError("");
                                                setExtraCharges([]);
                                                setOpenDropdownId(null)
                                            }
                                        }}
                                    />
                                </View>

                                <View style={styles.field}>
                                    <Text style={styles.label}>Advance Amount <Text style={{ color: "red" }}>*</Text></Text>
                                    <TextInput
                                        // style={styles.input}
                                        style={[
                                            styles.input,
                                            refuseAdvanceAmount && styles.disabledInput,
                                        ]}
                                        keyboardType="numeric"
                                        value={advanceAmount}
                                        editable={!refuseAdvanceAmount}
                                        selectTextOnFocus={!refuseAdvanceAmount}
                                        placeholder='Enter AdvanceAmount'
                                        // onChangeText={setAdvanceAmount}
                                        onChangeText={(text) => {
                                            const onlyNumbers = text.replace(/[^0-9]/g, "");
                                            setAdvanceAmount(onlyNumbers);
                                            setAdvanceError("");
                                        }}

                                    />
                                </View>
                                {advanceError && (
                                    <ErrorMessage message={advanceError} type="error" />
                                )}


                                <View style={styles.nonRefund}>
                                    <View style={styles.extraHeader}>
                                        <Text style={styles.label}>Non Refundable Amount</Text>

                                        <TouchableOpacity
                                            disabled={refuseAdvanceAmount}
                                            style={[
                                                styles.addBtn,
                                                refuseAdvanceAmount && { opacity: 0.5 }
                                            ]}
                                            // style={styles.addBtn} 
                                            onPress={addCharge}>
                                            <Text style={{ color: "#fff", fontFamily: "Gilroy-Semibold" }}>Add</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {extraCharges.map((item) => (
                                        <View key={item.id} style={styles.figmaRowWrapper}>

                                            {/* CLOSE BTN */}
                                            <TouchableOpacity
                                                onPress={() => removeCharge(item.id, item.type)}
                                                style={styles.figmaCloseBtn}
                                            >

                                                <Image
                                                    source={Delete}
                                                    style={styles.figmaCloseText}
                                                />
                                            </TouchableOpacity>


                                            <View style={styles.figmaRow}>


                                                {item.type === "" ? (
                                                    <TouchableOpacity
                                                        style={styles.figmaLeftBox}
                                                        onPress={() =>
                                                            setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                                                        }
                                                    >
                                                        <Text style={{ color: "#777" }}>Select...</Text>
                                                        <Image source={DownArrow} style={styles.arrow} />
                                                    </TouchableOpacity>
                                                ) : item.type === "Others" ? (
                                                    <TextInput
                                                        style={styles.figmaLeftBox}
                                                        placeholder="Enter reason"
                                                        value={item.title}
                                                        // onChangeText={(t) => updateTitle(item.id, t)}
                                                        onChangeText={(t) => {
                                                            const onlyLetters = t.replace(/[^a-zA-Z\s]/g, "");
                                                            updateTitle(item.id, onlyLetters);
                                                        }}
                                                    />
                                                ) : (
                                                    <View style={[styles.figmaLeftBox, { backgroundColor: "#EFEFEF" }]}>
                                                        <Text>Maintenance</Text>
                                                    </View>
                                                )}

                                                {/* RIGHT BOX ALWAYS VISIBLE (disabled until type selected) */}
                                                {item.type === "" ? (
                                                    <View style={[styles.figmaRightBox, { opacity: 0.4 }]}>
                                                        <Text style={{ color: "#999" }}>Enter amount</Text>
                                                    </View>
                                                ) : (
                                                    <TextInput
                                                        style={styles.figmaRightBox}
                                                        placeholder="Enter amount"
                                                        keyboardType="numeric"
                                                        value={item.amount}
                                                        onChangeText={(t) => {

                                                            let cleaned = t.replace(/[^0-9.]/g, "");

                                                            const parts = cleaned.split(".");

                                                            if (parts.length > 2) {
                                                                cleaned = parts[0] + "." + parts[1];
                                                            }

                                                            if (parts[1]?.length > 2) {
                                                                cleaned = parts[0] + "." + parts[1].slice(0, 2);
                                                            }
                                                            updateAmount(item.id, cleaned)
                                                        }
                                                        }

                                                    />
                                                )}

                                            </View>
                                            {item.titleError && (
                                                <ErrorMessage message={item.titleError} type="error" />
                                            )}
                                            {item.amountError && (
                                                <ErrorMessage message={item.amountError} type="error" />
                                            )}

                                            {openDropdownId === item.id && item.type === "" && (
                                                <View style={styles.nonRefundDropdown}>
                                                    {TYPE_OPTIONS.map((t) => {

                                                        const disabled = t === "Maintenance" && maintenanceAlreadyUsed;

                                                        return (
                                                            <TouchableOpacity
                                                                key={t}
                                                                disabled={disabled}
                                                                onPress={() => !disabled && selectType(item.id, t)}
                                                                style={{ opacity: disabled ? 0.3 : 1 }}
                                                            >
                                                                <Text style={styles.dropdownItem}>{t}</Text>
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}

                                        </View>
                                    ))}





                                </View>

                                <View style={styles.field}>
                                    <Text style={styles.label}>Total Rent <Text style={{ color: "red" }}>*</Text></Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={rentalAmount}
                                        placeholder={
                                            defaultRent
                                                ? `Selected Bed Rent is ${defaultRent}`
                                                : "Enter Rental Amount"
                                        }
                                        placeholderTextColor="#9CA3AF"
                                        // onChangeText={setRentalAmount}
                                        onChangeText={(text) => {
                                            const onlyNumbers = text.replace(/[^0-9]/g, "");
                                            setRentalAmount(onlyNumbers);
                                            setRentError("");
                                        }}

                                    />

                                </View>
                                {rentError && (
                                    <ErrorMessage message={rentError} type="error" />
                                )}

                                <View style={styles.fullRentRow}>
                                    <TouchableOpacity
                                        style={[
                                            styles.checkbox,
                                            collectFullRent && styles.checkboxSelected,
                                        ]}
                                        onPress={() => {
                                            const value = !collectFullRent;

                                            setCollectFullRent(value);

                                            if (!value) {
                                                setShowCustomRentEditor(false);
                                                setCustomRentAmount("");
                                                setSavedCustomRent("");
                                                setIsCustomRentSaved(false);
                                                setCustomRentError("");
                                            }
                                        }}
                                    >
                                        {collectFullRent && <Text style={styles.tick}>✓</Text>}
                                    </TouchableOpacity>

                                    <Text style={styles.fullRentText}>
                                        Do you want to collect Full Rent for current month?
                                    </Text>
                                </View>

                                {collectFullRent && (
                                    <>
                                        <TouchableOpacity
                                            style={[
                                                styles.customRentBtn,
                                                (showCustomRentEditor || isCustomRentSaved) && styles.closeBtn,
                                            ]}
                                            onPress={() => {

                                                if (showCustomRentEditor || isCustomRentSaved) {
                                                    setShowCustomRentEditor(false);
                                                    setIsCustomRentSaved(false)
                                                } else {
                                                    setShowCustomRentEditor(true);
                                                }
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.customRentBtnText,
                                                    (showCustomRentEditor || isCustomRentSaved) && { color: "#fff" },
                                                ]}
                                            >
                                                {(showCustomRentEditor || isCustomRentSaved) ? "Close" : "Add Custom Rent"}
                                            </Text>
                                        </TouchableOpacity>

                                        {(showCustomRentEditor || isCustomRentSaved) && (
                                            <View style={styles.customRentCard}>

                                                <Text style={styles.customRentTitle}>
                                                    Custom Rent Amount
                                                </Text>

                                                <Text style={styles.customRentSubTitle}>
                                                    This amount reflects First month Rent only.
                                                </Text>

                                                {!isCustomRentSaved ? (

                                                    <>
                                                        <View style={styles.amountRow}>

                                                            <TextInput
                                                                style={styles.amountInput}
                                                                placeholder="₹ 0.00"
                                                                keyboardType="numeric"
                                                                value={customRentAmount}
                                                                onChangeText={(text) => {
                                                                    setCustomRentAmount(
                                                                        text.replace(/[^0-9]/g, "")
                                                                    );
                                                                    setCustomRentError("");
                                                                }}
                                                            />

                                                            <TouchableOpacity
                                                                style={styles.setBtn}
                                                                onPress={() => {

                                                                    if (!customRentAmount) {
                                                                        setCustomRentError(
                                                                            "Please enter custom rent amount"
                                                                        );
                                                                        return;
                                                                    }

                                                                    if (Number(customRentAmount) <= 0) {
                                                                        setCustomRentError(
                                                                            "Amount should be greater than zero"
                                                                        );
                                                                        return;
                                                                    }

                                                                    // if (
                                                                    //     Number(customRentAmount) >
                                                                    //     Number(checkinrentalAmount || 0)
                                                                    // ) {
                                                                    //     setCustomRentError(
                                                                    //         "Custom rent cannot exceed total rent"
                                                                    //     );
                                                                    //     return;
                                                                    // }

                                                                    setSavedCustomRent(customRentAmount);

                                                                    setIsCustomRentSaved(true);

                                                                    setShowCustomRentEditor(false);

                                                                    setCustomRentError("");
                                                                }}
                                                            >
                                                                <Text style={styles.setBtnText}>
                                                                    ✓ Set
                                                                </Text>
                                                            </TouchableOpacity>

                                                        </View>

                                                        {customRentError ? (
                                                            <ErrorMessage message={customRentError} />
                                                        ) : null}
                                                    </>

                                                ) : (

                                                    <View style={styles.savedRow}>

                                                        <Text style={styles.savedAmount}>
                                                            ₹ {Number(savedCustomRent).toLocaleString("en-IN")}
                                                        </Text>

                                                        <TouchableOpacity
                                                            onPress={() => {

                                                                setCustomRentAmount(savedCustomRent);

                                                                setIsCustomRentSaved(false);

                                                                setShowCustomRentEditor(true);

                                                            }}
                                                        >
                                                            <Image
                                                                source={require("../../Assets/Images/edit.png")}
                                                                style={{
                                                                    width: 24,
                                                                    height: 24,
                                                                    tintColor: "#6B7280",
                                                                }}
                                                            />
                                                        </TouchableOpacity>

                                                    </View>

                                                )}

                                            </View>
                                        )}
                                    </>
                                )}


                                {/* <View style={styles.nonRefund}>
                                    <View style={styles.extraHeader}>
                                        <Text style={{ fontWeight: "600", color: "#444", marginBottom: 1 }}>Add Onetime Payment </Text>

                                    
                                    </View>

                                    {onetimepaymentcharges.map((item) => (
                                        <View key={item.id} style={styles.figmaRowWrapper}>

                                            <TouchableOpacity
                                                onPress={() => removeOnetimeCharge(item.id, item.type)}
                                                style={styles.figmaCloseBtn}
                                            >

                                                <Image
                                                    source={Delete}
                                                    style={styles.figmaCloseText}
                                                />
                                            </TouchableOpacity>


                                            <View style={styles.figmaRow}>


                                                {item.type === "" ? (
                                                    <TouchableOpacity
                                                        style={styles.figmaLeftBox}
                                                        onPress={() =>
                                                            setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                                                        }
                                                    >
                                                        <Text style={{ color: "#777" }}>Select...</Text>
                                                        <Image source={DownArrow} style={styles.arrow} />
                                                    </TouchableOpacity>
                                                ) : item.type === "Others" ? (
                                                    <TextInput
                                                        ref={(r) => {
                                                            inputRefs.current[`reason-${item.id}`] = r;
                                                        }}
                                                        style={styles.figmaLeftBox}
                                                        placeholder="Enter reason"

                                                        value={item.title}
                                                        onFocus={() => {
                                                            setOpenDropdownId(null);
                                                            scrollInputIntoView(inputRefs.current[`reason-${item.id}`]);
                                                        }}

                                                        onChangeText={(t) => {
                                                            const onlyLetters = t.replace(/[^a-zA-Z\s]/g, "");
                                                            OneTimeupdateTitle(item.id, onlyLetters);
                                                        }}
                                                    />
                                                ) : (
                                                    <View style={[styles.figmaLeftBox, { backgroundColor: "#EFEFEF" }]}>
                                                        <Text>Maintenance</Text>
                                                    </View>
                                                )}

                                                {item.type === "" ? (
                                                    <View style={[styles.figmaRightBox, { opacity: 0.4 }]}>
                                                        <Text style={{ color: "#999" }}>Enter amount</Text>
                                                    </View>
                                                ) : (
                                                    <TextInput
                                                        ref={(r) => {
                                                            inputRefs.current[`amount-${item.id}`] = r;
                                                        }}
                                                        style={styles.figmaRightBox}
                                                        placeholder="Enter amount"
                                                        keyboardType="numeric"
                                                        value={item.amount}
                                                        onFocus={() => {
                                                            setOpenDropdownId(null);
                                                            scrollInputIntoView(inputRefs.current[`amount-${item.id}`]);
                                                        }}

                                                        onChangeText={(t) => {

                                                            let cleaned = t.replace(/[^0-9.]/g, "");

                                                            const parts = cleaned.split(".");

                                                            if (parts.length > 2) {
                                                                cleaned = parts[0] + "." + parts[1];
                                                            }

                                                            if (parts[1]?.length > 2) {
                                                                cleaned = parts[0] + "." + parts[1].slice(0, 2);
                                                            }

                                                            OneTimeupdateAmount(item.id, cleaned)
                                                        }

                                                        }
                                                    />
                                                )}

                                            </View>

                                            {item.titleError && (
                                                <ErrorMessage message={item.titleError} type="error" />
                                            )}

                                            {item.typeError && (
                                                <ErrorMessage message={item.typeError} type="error" />
                                            )}

                                            {item.amountError && (
                                                <ErrorMessage message={item.amountError} type="error" />
                                            )}
                                            {openDropdownId === item.id && item.type === "" && (
                                                <View style={styles.nonRefundDropdown}>
                                                    {TYPE_OPTIONS.map((t) => {

                                                        const disabled = t === "Maintenance" && onetimepaymentmaintenanceAlreadyUsed;

                                                        return (
                                                            <TouchableOpacity
                                                                key={t}
                                                                disabled={disabled}
                                                                onPress={() => !disabled && selectOntimeType(item.id, t)}
                                                                style={{ opacity: disabled ? 0.3 : 1 }}
                                                            >
                                                                <Text style={styles.dropdownItem}>{t}</Text>
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}

                                        </View>
                                    ))}

                                    <TouchableOpacity
                                        disabled={!refuseAdvanceAmount}
                                        style={[
                                            styles.addNewButton,
                                            !refuseAdvanceAmount && { opacity: 0.5 }
                                        ]}
                                        onPress={AddOnetimeCharge}
                                    >
                                        <View style={styles.addNewContent}>
                                            <View style={styles.plusCircle}>
                                                <Text style={styles.plusText}>+</Text>
                                            </View>

                                            <Text style={styles.addNewText}>
                                                Add
                                            </Text>
                                        </View>
                                    </TouchableOpacity>







                                </View> */}

                                {/* <View style={styles.summaryCard}>
                                    <Text
                                        style={styles.summaryTitle}
                                    >
                                        SUMMARY
                                    </Text>

                                    <Text
                                        style={styles.summaryAmount}
                                    >
                                        ₹ {summaryAmount.toLocaleString("en-IN")}

                                    </Text>

                                    <View
                                        style={styles.divider}
                                    />

                                    <View
                                        style={styles.summaryRow}
                                    >
                                        <Text
                                            style={styles.summaryText}
                                        >
                                            1. Advance Amount
                                        </Text>

                                        <Text
                                            style={styles.summaryText}
                                        >
                                            ₹ {summaryAdvanceAmount.toLocaleString("en-IN")}

                                        </Text>
                                    </View>

                                    <View
                                        style={styles.summaryRow}
                                    >
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text
                                                style={styles.summaryText}
                                            >
                                                2. Non Refundable Amount

                                            </Text>
                                            <Text style={styles.summaryText}>  (Deduted from Advance 1)</Text>
                                        </View>
                                        <Text
                                            style={styles.summaryText}
                                        >
                                            - ₹ {deductionTotal.toLocaleString("en-IN")}

                                        </Text>
                                    </View>
                                    <View
                                        style={styles.summaryRow}
                                    >
                                        <Text
                                            style={styles.summaryText}
                                        >
                                            3. Base Rent (Pro Rate)
                                        </Text>

                                        <Text
                                            style={styles.summaryText}
                                        >
                                            - ₹ {summaryRent.toLocaleString("en-IN")}

                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.note}>
                                    Note: System automatically generates a separate invoices for Advance & Base Rent
                                </Text> */}


                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center", marginTop: 10
                                    }}
                                    activeOpacity={0.8}
                                    onPress={() => setProceedCheckin(prev => !prev)}
                                >
                                    <View
                                        style={[
                                            styles.checkbox,
                                            proceedcheckin && styles.checkboxSelected,
                                        ]}
                                    >
                                        {proceedcheckin && (
                                            <Text style={styles.tick}>✓</Text>
                                        )}
                                    </View>

                                    <Text style={styles.doLater}>
                                        Everything is Correct – Proceed to Check-In
                                    </Text>
                                </TouchableOpacity>

                                {/* <View style={styles.centerError}>
                                    {bookingDetailsError && (
                                        <ErrorMessage message={bookingDetailsError} type="error" style={{ alignSelf: "center" }} />
                                    )}
                                </View> */}


                            </View>
                        )}

                        {tab === "short" && (

                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <Image source={CommingSoon} style={{ width: 315, height: 220, resizeMode: 'contain' }} />
                                <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>Comming Soon</Text></View>
                        )}
                    </ScrollView>
                    {tab === "long" && (
                        <View style={styles.BtnRow}>
                            <TouchableOpacity style={styles.CancelBtn} onPress={() => navigation.goBack()}>
                                <Text style={{ color: "grey", fontFamily: "Gilroy-Semibold" }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.submitBtn,
                                    (!proceedcheckin || isSubmittingRef.current) && { backgroundColor: "#9CA3AF" }
                                ]}
                                disabled={!proceedcheckin || isSubmittingRef.current}
                                //           style={[
                                //     styles.primaryBtn,
                                //     hideCheckInSaveDraft && { flex: 1 },
                                //     !proceedcheckin && styles.disabledBtn,
                                // ]}
                                onPress={submitLongStay}
                            >
                                <Text style={styles.submitText}>Check-In</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>

            <BedDetailsSheet
                visible={showBedSheet}
                joiningDate={joiningDate}
                onClose={() => setShowBedSheet(false)}
                onSelect={(data) => {
                    console.log("Selected Bed =>", data);

                    setSelectedBedDetails(data);

                    setSelectedFloor({
                        id: data.floorId,
                        name: data.floorName,
                    });

                    const room = {
                        id: data.roomId,
                        name: data.roomName,
                    };

                    setSelectedRoom(room);

                    setRooms([
                        {
                            id: data.roomId,
                            name: data.roomName,
                        },
                    ]);

                    setSelectedBed({
                        bedId: data.bedId,
                        bedName: data.bedName,
                        rentAmount: data.rentAmount,
                    });

                    setRentalAmount(String(data.rentAmount));

                    setFloorError("");
                    setRoomError("");
                    setBedError("");
                    setBookingDetailsError("");

                    setShowBedSheet(false);
                }}
            />

            {openDatePicker && (
                <View style={styles.sheetOverlay}>
                    <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
                        <View style={{ flex: 1 }} />
                    </TouchableWithoutFeedback>

                    <View style={styles.datePickerBox}>
                        <Calendar
                            markingType="custom"
                            markedDates={joiningMarkedDates}
                            current={dayjs(joiningDate).format("YYYY-MM-DD")}
                            // onDayPress={(day) => {
                            //     const selected = dayjs(day.dateString);

                            //     if (isDisabledJoiningDate(selected)) return;

                            //     setJoiningDate(day.dateString);
                            //     // setCheckJoinDateError("");
                            // }}
                            onDayPress={(day) => {
                                const selected = dayjs(day.dateString);

                                if (isDisabledJoiningDate(selected)) return;

                                setJoiningDate(selected.toDate());
                                setOpenDatePicker(false);
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
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        // paddingTop: 32,
        paddingTop: Platform.OS === "ios" ? 10 : 40
    },

    backBtn: { padding: 6, marginRight: 8 },

    headerTitle: { fontSize: 18, fontFamily: "Gilroy-Semibold" },

    segmentRow: {
        flexDirection: "row",
        margin: 16,
        backgroundColor: "#EEF2F7",
        borderRadius: 8,
        padding: 4,
    },

    segment: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },

    segmentActive: { backgroundColor: "#2B6CF6" },

    segmentText: { color: "#4B5563" },

    segmentTextActive: { color: "#fff", fontFamily: "Gilroy-Semibold" },

    container: { paddingHorizontal: 16, },

    field: { marginBottom: 12 },

    label: { color: "#4B4B4B", marginBottom: 6 },

    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
    },

    pickerWrap: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#fff",
    },

    nonRefundContainer: {
        marginTop: 10,
        backgroundColor: "#F7F7FA",
        padding: 10,
        borderRadius: 10,
    },

    nonRefundHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    nonRefundRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        gap: 10,
    },

    inputBox: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        fontSize: 14,
    },

    fixedLabel: {
        fontSize: 14,
        color: "#000",
        fontFamily: "Gilroy-Semibold"
    },

    closeInside: {
        position: "absolute",
        right: -6,
        top: -6,
        padding: 6,
        backgroundColor: "#fff",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        zIndex: 20,
    },

    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E5BFF",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
    },



    iconImage: {
        height: 16,
        width: 16,
        marginRight: 6
    },

    addText: { color: "#fff", fontSize: 12, fontFamily: "Gilroy-Semibold" },

    BtnRow: {
        flexDirection: "row",
        gap: 10,
        padding: 16,
        backgroundColor: "#fff",


    },



    CancelBtn: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    submitBtn: {
        flex: 1,
        backgroundColor: "#2B6CF6",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    submitText: { color: "#fff", fontFamily: "Gilroy-Semibold" },




    select: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dropdownMenu: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        zIndex: 999,
        elevation: 10,
    },

    option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    optionText: {
        fontSize: 15,
        color: "#000",
    },
    arrow: { width: 18, height: 18, tintColor: "#777" },


    dateBox: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    placeholder: { color: "#555" },
    calendarIcon: { width: 20, height: 20, tintColor: "#444" },
    datePickerPopup: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
        width: "100%",
    },
    sheetOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    datePickerBox: {
        position: "absolute",
        left: "10%",
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 10,
        elevation: 10,
        bottom: 90
    },

    nonRefund: {
        backgroundColor: "#F7F9FF",
        padding: 10,
        marginTop: 10,
        borderRadius: 20
    },

    addBtn: {
        backgroundColor: "#2D6CDF",
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 8,
    },
    extraHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 18,
    },
    figmaRowWrapper: {
        marginTop: 20,
        position: "relative",
    },

    figmaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    figmaLeftBox: {
        width: "48%",
        height: 50,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#E3E3E3",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    figmaRightBox: {
        width: "45%",
        height: 50,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#E3E3E3",
        justifyContent: "center",
        marginRight: 20
    },

    figmaCloseBtn: {
        position: "absolute",
        right: 5,
        top: -10,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#E1E1E1",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    figmaCloseText: {
        width: 10,
        height: 10
    },
    dropdownMenuone: {
        marginTop: 6,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,

    },
    dropdownItem: {
        padding: 12,
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    centerError: {

        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        marginHorizontal: 120
    },
    nonRefundDropdown: {
        position: "absolute",
        top: 55,
        left: 0,
        width: "48%",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E3E3E3",
        borderRadius: 12,
        zIndex: 20,
        elevation: 10,
    },
    summaryCard: {
        margin: 5,
        backgroundColor: "#1F2BA8",
        borderRadius: 16,
        padding: 20,
    },

    summaryTitle: {
        color: "#BFC9FF",
        fontSize: 12,
        fontFamily: "Gilroy-Semibold"
    },

    summaryAmount: {
        color: "#fff",
        fontSize: 34,
        fontFamily: "Gilroy-Bold",
        marginTop: 10,
    },

    divider: {
        height: 1,
        backgroundColor: "#4A57D6",
        marginVertical: 15,
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    summaryText: {
        color: "#fff",
        fontFamily: "Gilroy-Semibold"
    },
    addNewButton: {
        marginTop: 12,
        backgroundColor: "#EEF2FF",
        borderRadius: 10,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
    },

    addNewContent: {
        flexDirection: "row",
        alignItems: "center",
    },

    plusCircle: {
        width: 24,
        height: 24,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: "#1D4ED8",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },

    plusText: {
        color: "#1D4ED8",
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
        lineHeight: 22,
    },

    addNewText: {
        color: "#1D4ED8",
        fontSize: 15,
        fontFamily: "Gilroy-Semibold",
    },


    fullRentRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: "#D1D5DB",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
        marginRight: 8,
    },

    checkboxSelected: {
        backgroundColor: "#1E45E1",
        borderColor: "#1E45E1",
    },

    tick: {
        color: "#FFF",
        fontSize: 13,
        fontWeight: "700",
    },

    fullRentText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#222",
        flex: 1,
        fontFamily: "Gilroy-Semibold"
    },

    customRentBtn: {
        marginTop: 15,
        backgroundColor: "#EEF2FF",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    closeBtn: {
        backgroundColor: "#1F2BA6",
    },

    customRentBtnText: {
        color: "#1E45E1",
        fontSize: 14,
        fontFamily: "Gilroy-Semibold"
    },

    customRentCard: {
        marginTop: 12,
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#C8D3FF",
        padding: 18,
    },

    customRentTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
        color: "#222",
    },

    customRentSubTitle: {
        marginTop: 6,
        color: "#6B7280",
        fontSize: 15,
        fontFamily: "Gilroy-Regular"
    },

    amountRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },

    amountInput: {
        flex: 1,
        height: 45,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 15,
        fontSize: 14,
        fontFamily: "Gilroy-Bold"
    },

    setBtn: {
        marginLeft: 10,
        backgroundColor: "#EEF2FF",
        borderRadius: 10,
        paddingHorizontal: 18,
        height: 45,
        justifyContent: "center",
    },

    setBtnText: {
        color: "#1E45E1",
        fontSize: 14,
        fontFamily: "Gilroy-Semibold"
    },

    savedRow: {
        marginTop: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    savedAmount: {
        fontSize: 17,
        fontFamily: "Gilroy-Bold",
        color: "#222",
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 5,
    },

    subText: {
        flex: 1,
        fontSize: 14,
        color: "#6B7280",
        fontFamily: "Gilroy-Regular",
    },
    disabledInput: {
        backgroundColor: "#F5F5F5",
        color: "#9CA3AF",
        opacity: 0.7,
    },

    doLater: {
        fontSize: 14,
        color: "#111827",
        fontFamily: "Gilroy-Medium",
    },
    disabledSelect: {
  backgroundColor: "#F3F4F6",
  opacity: 0.7,
},

});