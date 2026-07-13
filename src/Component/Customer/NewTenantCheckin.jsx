import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
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
    Image, TouchableWithoutFeedback, Keyboard, BackHandler, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import AddCircle from "../../Assets/Images/add-circle.png";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import CalendarImage from "../../Assets/Images/calendar.png";
import { useFloor } from "../../Context/PayingGuestContext";
import { CommonContexts } from "../../Context/CommonContext";
import { useCustomer } from '../../Context/CustomerContext';
import Delete from "../../Assets/Images/remove.png";
import ErrorMessage from '../ErrorMessagr/Errormessagestyle';
import SuccessModal from '../../ToastFile/ToastPage';
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import ListView from "../../Assets/Images/listview.png";
import RoomView from "../../Assets/Images/Roomview.png";
import BedIcon from "../../Assets/Images/bed_NewIcon.png";
import ComingSoomImage from "../../Assets/Images/Coming_soon.png";
import UplodIcon from "../../Assets/Images/upload.png";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PlusIcon from "../../Assets/Images/add-circle.png";
import { Switch } from "react-native";
import BedDetailsSheet from "./BedDetailsBottomsheet"



export default function NewTenantCheckIn({ navigation, route }) {

    const insets = useSafeAreaInsets();
    const { customerId, customer } = route.params || {};
    const [tab, setTab] = useState("long");
    const { activeHostelId } = useContext(CommonContexts);
    const { getAllFloorsByHostel, getAllRoomsByFloor, getAllBedsByRoom } = useFloor();
    const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel, TenantCheckIn } = useCustomer();

    const [floors, setFloors] = useState([]);
    const [floorOpen, setFloorOpen] = useState(false);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [roomOpen, setRoomOpen] = useState(false);

    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [beds, setBeds] = useState([]);
    const [bedOpen, setBedOpen] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const [floorError, setFloorError] = useState("")
    const [roomError, setRoomError] = useState("")
    const [bedError, setBedError] = useState('')
    const [sameAsCurrent, setSameAsCurrent] = useState(false);
    const isSubmittingRef = useRef(false);
    // const [advanceError, setAdvanceError] = useState("")
    const [amount, setAmount] = useState("");
    const [rentError, setRentError] = useState("")
    const [openDatePicker, setOpenDatePicker] = useState(false)

    // const [joiningDate, setJoiningDate] = useState(new Date());
    // const [advanceAmount, setAdvanceAmount] = useState("");
    // const [rentalAmount, setRentalAmount] = useState("");
    // const [openDropdownId, setOpenDropdownId] = useState(null);
    // const [extraCharges, setExtraCharges] = useState([]);
    const [openCalendar, setOpenCalendar] = useState(false);
    // const scrollRef = React.useRef(null);
    const [isCheckinClick, setIsCheckInClick] = useState(false)
    const [openDropdown, setOpenDropdown] = useState(null);
    const scrollToInput = (y = 200) => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                y,
                animated: true,
            });
        }, 150); // keyboard animation wait
    }


    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", e => {
            setKeyboardHeight(e.endCoordinates.height);
        });

        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);
    const titleRefs = useRef({});
    const amountRefs = useRef({});




    const scrollToInputRef = (ref) => {
        if (!ref || !scrollRef.current) return;

        ref.measureInWindow((x, y) => {
            scrollRef.current?.scrollTo({
                y: y - 140,   // 🔥 gap (adjust panna 160 / 180)
                animated: true,
            });
        });
    };


    console.log("selectedBed", customer)

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

    const loadRoomsByFloor = async (floorId) => {
        if (!floorId) return

        try {
            const res = await getAllRoomsByFloor(floorId);

            if (res?.success && Array.isArray(res?.data)) {
                setRooms(res?.data)
            } else {
                setRooms([])
            }
        } catch (e) {
            setRooms([])
        }
    }




    //   const loadRooms = async (floorId) => {
    //     const res = await getAllRoomsByFloor(floorId);
    //     if (res.success) {
    //       console.log("RoomData", res.data);

    //       setRooms(res.data);
    //     } else {
    //       setRooms([]);
    //     }
    //   };

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                navigation.goBack();
                return true;
            };

            const handler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );

            return () => handler.remove();
        }, [navigation])
    );


    // useEffect(() => {
    //     if (!activeHostelId || !checkJoiningDate) return;

    //     loadBeds(checkJoiningDate);
    // }, [activeHostelId]);


    const loadBeds = async (date) => {
        if (!activeHostelId) return;

        const formattedDate = dayjs(date).format("DD-MM-YYYY");

        const res = await getBedsByHostelAndDate(
            activeHostelId,
            formattedDate
        );
        console.log("beds", res);


        if (res.success) {
            setBeds(res?.data?.listBeds);
        } else {
            setBeds([]);
        }
    };

    // const filteredBeds = beds.filter(bed => {
    //   if (!selectedFloor || !selectedRoom) return false;

    //   return (
    //     bed.floorId === selectedFloor.id &&
    //     bed.roomId === selectedRoom.id &&
    //     bed.currentStatus === "VACANT"
    //   );
    // });




    // const maintenanceAlreadyUsed = extraCharges.some(c => c.type === "Maintenance");


    const TYPE_OPTIONS = ["Maintenance", "Others"];


    // const addCharge = () => {
    //     setExtraCharges(prev => [
    //         ...prev,
    //         { id: Date.now(), type: "", title: "", amount: "" }
    //     ]);
    // };

    // const removeCharge = (id) => {
    //     setExtraCharges(prev => prev.filter(i => i.id !== id));

    // };

    const selectType = (id, type) => {


        if (type === "Maintenance" && maintenanceAlreadyUsed) return;

        setExtraCharges(prev =>
            prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "", typeError: "" } : i))
        );

        setOpenDropdownId(null);
    };

    const selectOntimeType = (id, type) => {


        if (type === "Maintenance" && onetimepaymentmaintenanceAlreadyUsed) return;

        setOneTimePaymentCharges(prev =>
            prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "", typeError: "" } : i))
        );

        setOpenDropdownId(null);
    };




    const updateTitle = (id, title) => {
        // setExtraCharges(prev =>
        //   prev.map(i => (i.id === id ? { ...i, title } : i))
        // );
        setExtraCharges(prev =>
            prev.map(i =>
                i.id === id
                    ? { ...i, title, titleError: "" }
                    : i
            )
        );
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


    const updateAmount = (id, amount) => {
        // setExtraCharges(prev =>
        //   prev.map(i => (i.id === id ? { ...i, amount } : i))
        // );
        setExtraCharges(prev =>
            prev.map(i =>
                i.id === id
                    ? { ...i, amount, amountError: "" }
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

    useEffect(() => {
        if (openCalendar) {
            Keyboard.dismiss();
        }
    }, [openCalendar]);
    const blurAllInputs = () => {
        Object.values(titleRefs.current).forEach(ref => ref?.blur?.());
        Object.values(amountRefs.current).forEach(ref => ref?.blur?.());
    };
    const advanceRef = useRef(null);
    const rentalRef = useRef(null);
    const scrollToField = (ref) => {
        if (!ref?.current || !scrollRef.current) return;

        ref.current.measureLayout(
            scrollRef.current,
            (x, y) => {
                scrollRef.current.scrollTo({
                    y: y - 100,
                    animated: true,
                });
            },
            () => { }
        );
    };


    const onFloorChange = (v) => {
        setSelectedFloor(v);
        const r = rooms[v][0];
        const b = beds[r][0];
        setSelectedRoom(r);
        setSelectedBed(b);
    };
    const validateLongStay = () => {
        let valid = true;

        // reset errors
        setFloorError("");
        setRoomError("");
        setBedError("");
        setAdvanceError("");
        setRentError("");

        if (!selectedFloor) {
            setFloorError("Please select a floor");
            valid = false;
        }

        if (!selectedRoom) {
            setRoomError("Please select a room");
            valid = false;
        }

        if (!selectedBed) {
            setBedError("Please select a bed");
            valid = false;
        }

        if (!advanceAmount) {
            setAdvanceError("Please Enter Advance amount");
            valid = false;
        }

        if (!rentalAmount || Number(rentalAmount) <= 0) {
            setRentError("Please Enter Rental amount");
            valid = false;
        }

        return valid;
    };
    const validateExtraCharges = () => {
        let valid = true;

        const updated = extraCharges.map((e) => {
            let titleError = "";
            let amountError = "";
            let typeError = "";

            const titleFilled = e.title?.trim()?.length > 0;
            const amountFilled = e.amount !== "" && e.amount !== null && e.amount !== undefined;

            const amt = Number(e.amount);

            // case 1: if not selected type --show error message
            if (!e.type) {
                typeError = "Please select type";
                valid = false;

                return { ...e, typeError, titleError: "", amountError: "" };
            }

            // ✅ CASE 1: type not selected -> ignore row (no validation)
            // if (!e.type) {
            //   return { ...e, titleError: "", amountError: "" };
            // }

            // ✅ CASE 2: Maintenance -> amount mandatory
            if (e.type === "Maintenance") {
                if (!amountFilled) {
                    amountError = "Please enter amount";
                    valid = false;
                } else if (isNaN(amt) || amt <= 0) {
                    amountError = "Amount must be greater than 0";
                    valid = false;
                }

                return { ...e, typeError, titleError: "", amountError };
            }

            // ✅ CASE 3: Others -> reason + amount both mandatory
            if (e.type === "Others") {
                // both empty -> ok (optional row)
                // if (!titleFilled && !amountFilled) {
                //   return { ...e, titleError: "", amountError: "" };
                // }

                // if (!titleFilled && !amountFilled) {
                //   titleError = "Please enter reason";
                //   valid = false;
                // }
                typeError = "";

                if (!titleFilled) {
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

            return { ...e, typeError, titleError: "", amountError: "" };
        });

        setExtraCharges(updated);
        return valid;
    };





    const submitLongStay = async () => {

        if (isCheckinClick) return;
        const isValid = validateLongStay();

        if (!isValid) return;

        const chargeValid = validateExtraCharges();
        if (!chargeValid) return;

        try {
            setIsCheckInClick(true)
            const payload = {
                floorId: selectedFloor.id,
                roomId: selectedRoom.id,
                bedId: selectedBed.bedId,
                joiningDate: dayjs(joiningDate).format("DD-MM-YYYY"),
                advanceAmount: Number(advanceAmount),
                rentalAmount: Number(rentalAmount),
                stayType: "LONG",

                deductions: extraCharges.map((e) => ({
                    type:
                        e.type === "Others"
                            ? e.title.trim().toLowerCase()
                            : e.type.toLowerCase(),
                    amount: Number(e.amount),
                })),
            };

            const res = await checkInCustomer(customerId, payload);
            console.log("checking", res)
            console.log(res?.message)

            if (res.success) {
                setModalType("success");
                setMessage(res.data);
                setShowSuccess(true);

                await getAllBedsByRoom(selectedRoom.id);
                navigation.goBack();
                setTimeout(() => {
                    setShowSuccess(false);

                }, 800);

            } else {
                setModalType("error");
                setMessage(res.message || "Checkin Failed");
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false)
                    setIsCheckInClick(false);
                }, 1000);
            }
        } catch (error) {
            console.log(error)
            setIsCheckInClick(false)
        }
    };





    //   new flow 

    const [purchaseDate, setPurchaseDate] = useState(null);
    dayjs.extend(customParseFormat);
    const [openJoinDatePic, setOpenJoinDatePic] = useState("");
    const [joiningDate, setJoiningDate] = useState(null);

    const [openCheckJoinDatePic, setOpenCheckJoinDatePic] = useState("");
    const [checkJoiningDate, setcheckJoiningDate] = useState(null);
    const [bookingAmount, setBookingAmount] = useState("");
    const [rentalAmount, setRentalAmount] = useState("");
    const [checkinrentalAmount, setCheckinRentalAmount] = useState("");
    const [advanceAmount, setAdvanceAmount] = useState("");
    const [extraCharges, setExtraCharges] = useState([]);
    const [onetimepaymentcharges, setOneTimePaymentCharges] = useState([]);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [CheckinTenants, setCheckinTenants] = useState([])
    const [checkinTenantsOpen, setCheckinTenantsopen] = useState(false);
    const [CheckinTenantSelected, setCheckinTenantSelected] = useState(null);
    const StayType = ["LongStay"];
    const [StayTypeOpen, setStayTypeOpen] = useState(false);
    const [StayTypeSelected, setStayTypeSelected] = useState("Stay Type");
    const [stayTypeError, setStayTypeError] = useState("")

    const maintenanceAlreadyUsed = extraCharges?.some(c => c?.type === "Maintenance");
    const onetimepaymentmaintenanceAlreadyUsed = onetimepaymentcharges?.some(c => c?.type === "Maintenance");
    const [tenentsError, setTenantsError] = useState("")
    const [rentalError, setRentalError] = useState("")
    const [advanceError, setAdvanceError] = useState("")
    const [checkJoinDateError, setCheckJoinDateError] = useState("")
    const [floorSelected, setFloorSelected] = useState(null);
    const [roomSelected, setRoomSelected] = useState(null);
    const [bedSelected, setBedSelected] = useState(null);
    const [collectFullRent, setCollectFullRent] = useState(false);
    const [showCustomRentEditor, setShowCustomRentEditor] = useState(false);
    const [customRentAmount, setCustomRentAmount] = useState("");
    const [savedCustomRent, setSavedCustomRent] = useState("");
    const [isCustomRentSaved, setIsCustomRentSaved] = useState(false);
    const [customRentError, setCustomRentError] = useState("");
    const [refuseAdvanceAmount, setRefuseAdvanceAmount] = useState(false);

    const [selectedBedDetails, setSelectedBedDetails] = useState(null);
    const [showBedSheet, setShowBedSheet] = useState(false);

    const [showCalendar, setShowCalendar] = useState(false);
    const [activeDateField, setActiveDateField] = useState(null);
    const CALENDAR_HEIGHT = 340;
    const { height: SCREEN_HEIGHT } = Dimensions.get("window");
    const scrollRef = useRef(null);
    const transactionRef = useRef(null);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [showProfileSheet, setShowProfileSheet] = useState(false);
    const [proceedcheckin, setProceedCheckin] = useState(false);

    const scrollInputIntoView = (refOrNode) => {
        const input =
            refOrNode?.current ? refOrNode.current : refOrNode;

        if (!input) return;

        setTimeout(() => {
            if (!scrollRef.current) return;

            input.focus?.();

            scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard?.(
                input,
                200,
                true
            );
        }, 150);
    };


    const inputRefs = useRef({});
    const getSafeCalendarTop = (y, h) => {
        const belowSpace = SCREEN_HEIGHT - (y + h);


        if (belowSpace > CALENDAR_HEIGHT + 20) {
            return y + h + 8;
        }

        // இல்லனா → மேல open
        return Math.max(80, y - CALENDAR_HEIGHT - 8);
    };


    const [datePickerTop, setDatePickerTop] = useState(0);

    const bookingDateRef = useRef(null);
    const joiningDateRef = useRef(null);
    const checkinDateRef = useRef(null);


    // useEffect(() => {
    //     if (selectedRoom && checkJoiningDate) {
    //         loadBeds(checkJoiningDate);
    //     }
    // }, [selectedRoom, checkJoiningDate])

    useEffect(() => {
        if (!activeHostelId || !checkJoiningDate) return;

        loadBeds(checkJoiningDate);
    }, [activeHostelId, checkJoiningDate]);



    console.log("beds", beds);


    console.log("filteredBeds", filteredBeds);

   const handleshowBedDetailsheet = () => {
    if (!checkJoiningDate) return;

    setShowBedSheet(true);
};

    const toggleDropdown = (type) => {
        setOpenDropdown((prev) => (prev === type ? null : type));
    };

    const filteredBeds = React.useMemo(() => {
        if (!floorSelected || !roomSelected) return [];

        return beds.filter(
            (bed) =>
                bed?.floorId === floorSelected?.id &&
                bed?.roomId === roomSelected?.id &&
                ["VACANT", "NOTICE"].includes(bed.currentStatus)
        );
    }, [beds, floorSelected, roomSelected]);

    const isRoomDisabled = !floorSelected;
    const isBedDisabled = !floorSelected || !roomSelected;

    const hasRooms = rooms && rooms?.length > 0;
    const hasBeds = filteredBeds && filteredBeds?.length > 0;


    const addCharge = () => {
        setExtraCharges(prev => [
            ...prev,
            { id: Date.now(), type: "", title: "", amount: "" }
        ]);
    };

    const removeCharge = (id) => {
        setExtraCharges(prev => prev.filter(i => i.id !== id));

    };

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

    const totalFixedCharges = extraCharges.reduce((total, item) => {
        const amount = Number(item.amount || 0);
        return total + amount;
    }, 0);

    const resetCheckInState = () => {
        setCheckinRentalAmount("");
        setAdvanceAmount("");
        setStayTypeSelected("Stay Type");
        setExtraCharges([]);
        setOneTimePaymentCharges([])

        setCheckinTenantSelected(null);
        setCheckinTenantsopen(false);

        setcheckJoiningDate(dayjs());
        setOpenDropdownId(null);
    }

    const isCurrentMonth = checkJoiningDate ? dayjs(checkJoiningDate).isSame(dayjs(), "month") : false;

    useEffect(() => {
        if (!checkJoiningDate) return;

        const currentMonth = dayjs(checkJoiningDate).isSame(dayjs(), "month");

        setCollectFullRent(currentMonth);

        if (!currentMonth) {
            setShowCustomRentEditor(false);
            setCustomRentAmount("");
            setSavedCustomRent("");
            setIsCustomRentSaved(false);
            setCustomRentError("");
        }
    }, [checkJoiningDate])

    const summaryAdvanceAmount = Number(advanceAmount || 0);

    const deductionTotal = [...extraCharges].reduce(
        (total, item) => total + Number(item.amount || 0), 0)

    const summaryRent = Number(checkinrentalAmount || 0)

    const summaryAmount = summaryAdvanceAmount + deductionTotal + summaryRent;


    const handleCheckIn = async () => {



        if (isCheckingIn) return;
        const chargeValid = validateExtraCharges();
        // const onetimechargevalid = validateOneTimeCharges()
        // if (!chargeValid || !onetimechargevalid) return;
        if (!chargeValid) return;


        let hasError = false;

        setFloorError("");
        setRoomError("");
        setBedError("");
        setRentalError("");
        setAdvanceError("");
        setCheckJoinDateError("");
        setStayTypeError("");

        // Joining Date
        if (!checkJoiningDate) {
            setCheckJoinDateError("Please Select Joining Date");
            hasError = true;
        }

        // Floor
        if (!floorSelected) {
            setFloorError("Please Select Floor");
            hasError = true;
        }

        // Room
        if (!roomSelected) {
            setRoomError("Please Select Room");
            hasError = true;
        }

        // Bed
        if (!bedSelected) {
            setBedError("Please Select Bed");
            hasError = true;
        }

        // Stay Type
        // if (!StayTypeSelected || StayTypeSelected === "Stay Type") {
        //     setStayTypeError("Please Select Stay Type");
        //     hasError = true;
        // }

        // Rental
        if (!checkinrentalAmount || Number(checkinrentalAmount) <= 0) {
            setRentalError("Please Enter Rental Amount");
            hasError = true;
        }

        // Advance
        if (!refuseAdvanceAmount) {
            if (!advanceAmount || Number(advanceAmount) <= 0) {
                setAdvanceError("Please Enter Advance Amount");
                hasError = true;
            }
        }

        if (hasError) return;

        if (!bedSelected) {
            setModalType("error");
            setMessage("Bed data missing");
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 800)
            return;
        }

        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;



        try {
            setIsCheckingIn(true)


            const payload = {
                floorId: floorSelected.id,
                roomId: roomSelected.id,
                bedId: bedSelected.bedId,

                joiningDate: dayjs(checkJoiningDate).format("DD-MM-YYYY"),

                refundableAmount: Number(advanceAmount),

                rentalAmount: Number(checkinrentalAmount),


                stayType: "long",
                // StayTypeSelected === "LongStay" ? "long" : "short",

                deductions: extraCharges.map((item) => ({
                    type:
                        item.type === "Others"
                            ? item.title.trim()
                            : item.type,
                    amount: Number(item.amount),
                })),

                shouldCollectFullRent: collectFullRent,

                // customRent: 0,
                customRent: savedCustomRent
                    ? Number(savedCustomRent)
                    : null,

                oneTimeDeduction: onetimepaymentcharges.map((item) => ({
                    type:
                        item.type === "Others"
                            ? item.title.trim()
                            : item.type,
                    amount: Number(item.amount),
                })),
            };

            console.log("checkinpayload", payload);
            console.log("customerId", customerId);

            const res = await TenantCheckIn(
                activeHostelId,
                customerId,
                payload
            );

            console.log("checkined", res)

            if (res.success) {
                setModalType("success");
                setMessage(res.data);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    // onBedAdded && onBedAdded(selectedBed.roomId)
                    navigation.goBack();
                    resetCheckInState()
                }, 800);


            } else {
                setModalType("error");
                setMessage(res?.message);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                }, 800)
            }
        } catch (error) {
            console.log(error)
            setIsCheckingIn(false)
        }
        finally {
            isSubmittingRef.current = false;
        }

    }


    console.log("joiningDate", checkJoiningDate);


    return (
        <>
            <SuccessModal visible={showSuccess} message={message} type={modalType} />
            <SafeAreaView style={styles.safe}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    // behavior={Platform.OS === "ios" ? "padding" : undefined}
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
                        <Text style={styles.headerTitle}>Tenant Check-In</Text>
                    </View>

                    <View style={{ paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                            {customer?.profilePic ? <Image source={{ uri: customer?.profilePic }} style={{ width: 50, height: 50, borderRadius: 25 }} /> :
                                <View style={{ width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e6e7eb' }}>
                                    <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Bold' }}>{customer?.initials}</Text>
                                </View>}
                        </View>

                        <View style={{ marginLeft: 8 }}>
                            <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold' }}>{customer?.fullName}</Text>
                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#4B4B4B', marginTop: 8 }}>
                                +{customer?.countryCode} {customer?.mobile || N / A}</Text>
                        </View>

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

                    <ScrollView
                        ref={scrollRef}
                        style={{ paddingHorizontal: 16 }}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        // nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            // paddingBottom: keyboardHeight > 0 ? keyboardHeight + 50 : 150,
                            // padding: 15,
                            flexGrow: 1,
                            paddingBottom: 80,
                        }}
                    >




                        {tab === "long" && (
                            <>






                                <Text style={styles.label}>Joining Date <Text style={{ color: "red" }}>*</Text></Text>

                                <View ref={checkinDateRef} collapsable={false}>
                                    <TouchableOpacity
                                        style={styles.dateBox}
                                        onPress={() => {
                                            Keyboard.dismiss();
                                            setOpenDropdownId(null);
                                            setCheckinTenantsopen(false);

                                            setTimeout(() => {
                                                checkinDateRef.current.measureInWindow((x, y, w, h) => {
                                                    setDatePickerTop(getSafeCalendarTop(y, h));
                                                    setActiveDateField("checkin");
                                                    setShowCalendar(true);
                                                });
                                            }, 150);
                                        }}

                                    >


                                        <Text style={styles.placeholder}>
                                            {checkJoiningDate
                                                ? dayjs(checkJoiningDate).format("DD-MM-YYYY")
                                                : "DD-MM-YYYY"}
                                        </Text>
                                        <Image source={require("../../Assets/Images/calendar.png")} style={styles.icon} />
                                    </TouchableOpacity>
                                </View>

                                {checkJoinDateError && (
                                    <ErrorMessage message={checkJoinDateError} type="error" />
                                )}


                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' }}>
                                    <Text>Select Stay Details <Text style={{ color: "red" }}>*</Text></Text>
                                    <TouchableOpacity
                                        style={[
                                            {
                                                flexDirection: "row",
                                                backgroundColor: checkJoiningDate ? "#EDF3FF" : "#F3F4F6",
                                                padding: 10,
                                                paddingHorizontal: 10,
                                                opacity: checkJoiningDate ? 1 : 0.5,
                                            },
                                        ]}
                                        disabled={!checkJoiningDate}
                                        onPress={handleshowBedDetailsheet}
                                    >
                                        <Image
                                            source={BedIcon}
                                            style={{
                                                height: 20,
                                                width: 20,
                                                marginRight: 10,
                                                tintColor: checkJoiningDate ? "#1E45E1" : "#9CA3AF",
                                            }}
                                        />

                                        <Text
                                            style={{
                                                color: checkJoiningDate ? "#1E45E1" : "#9CA3AF",
                                            }}
                                        >
                                            Bed Layout View
                                        </Text>
                                    </TouchableOpacity>

                                </View>


                                <Text style={styles.label}> Floor <Text style={{ color: "red" }}>*</Text></Text>

                                <View style={{ position: "relative" }}>
                                    <TouchableOpacity
                                        style={[styles.select,]}
                                        // disabled={isFloorDisabled}
                                        onPress={() => toggleDropdown("floor")}
                                    >
                                        <Text style={styles.selectText}>
                                            {floorSelected ? floorSelected.name : "Select a Floor"}
                                        </Text>
                                        <Image source={DownArrow} style={styles.arrow} />
                                    </TouchableOpacity>



                                    {openDropdown === "floor" && (
                                        <View style={styles.dropdownMenu}>
                                            {openDropdown && (
                                                <TouchableWithoutFeedback onPress={() => setOpenDropdown(null)}>
                                                    <View style={styles.dropdownOverlay} />
                                                </TouchableWithoutFeedback>
                                            )}
                                            <ScrollView
                                                style={{ maxHeight: 160 }}
                                                nestedScrollEnabled={true}          // ✅ Android fix
                                                keyboardShouldPersistTaps="handled"
                                                showsVerticalScrollIndicator={false}
                                            >
                                                {floors?.map((f) => (
                                                    <TouchableOpacity
                                                        key={f.id}
                                                        style={styles.option}
                                                        onPress={async () => {

                                                            setFloorSelected(f);
                                                            setRoomSelected(null);
                                                            setBedSelected(null);

                                                            setFloorError("");
                                                            setOpenDropdown(null);

                                                            await loadRoomsByFloor(f.id);

                                                        }}
                                                    // setFloorSelected(f);
                                                    // setOpenDropdown(null);

                                                    // setRoomSelected(null);
                                                    // setBedSelected(null);
                                                    // setRooms([]);


                                                    // loadRoomsByFloor(f?.id);
                                                    // loadRooms(f?.id);



                                                    >
                                                        <Text style={styles.optionText}>{f?.name}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>
                                {floorError && (
                                    <ErrorMessage message={floorError} type="error" />
                                )}
                                <Text style={styles.label}> Room <Text style={{ color: "red" }}>*</Text></Text>

                                <View style={{ position: "relative" }}>
                                    <TouchableOpacity
                                        style={[styles.select, isRoomDisabled && styles.disabledSelect]}
                                        disabled={isRoomDisabled}
                                        onPress={() => toggleDropdown("room")}
                                    >
                                        <Text style={styles.selectText}>
                                            {roomSelected ? roomSelected?.name : "Select a Room"}
                                        </Text>
                                        <Image source={DownArrow} style={styles.arrow} />
                                    </TouchableOpacity>




                                    {openDropdown === "room" && (
                                        <View style={styles.dropdownMenu}>
                                            {openDropdown && (
                                                <TouchableWithoutFeedback onPress={() => setOpenDropdown(null)}>
                                                    <View style={styles.dropdownOverlay} />
                                                </TouchableWithoutFeedback>
                                            )}

                                            <ScrollView
                                                style={{ maxHeight: 160 }}
                                                nestedScrollEnabled={true}          // ✅ Android fix
                                                keyboardShouldPersistTaps="handled"
                                                showsVerticalScrollIndicator={false}
                                            >

                                                {!hasRooms ? (
                                                    <View style={styles.emptyOption}>
                                                        <Text style={styles.emptyText}>No room available</Text>
                                                    </View>
                                                ) : (
                                                    rooms.map((r) => (
                                                        <TouchableOpacity
                                                            key={r.id}
                                                            style={styles.option}
                                                            onPress={async () => {

                                                                setRoomSelected(r);
                                                                setBedSelected(null);

                                                                setRoomError("");
                                                                setOpenDropdown(null);

                                                                await getAllBedsByRoom(r.id);

                                                            }}
                                                        >
                                                            <Text style={styles.optionText}>{r?.name}</Text>
                                                        </TouchableOpacity>
                                                    ))
                                                )}

                                            </ScrollView>
                                        </View>
                                    )}

                                </View>
                                {roomError && (
                                    <ErrorMessage message={roomError} type="error" />
                                )}
                                <Text style={styles.label}> Bed <Text style={{ color: "red" }}>*</Text></Text>

                                <View style={{ position: "relative" }}>
                                    <TouchableOpacity
                                        style={[styles.select, isBedDisabled && styles.disabledSelect]}
                                        disabled={isBedDisabled}
                                        onPress={() => toggleDropdown("bed")}
                                    >
                                        <Text style={styles.selectText}>
                                            {bedSelected ? bedSelected?.bedName : "Select a Bed"}
                                        </Text>
                                        <Image source={DownArrow} style={styles.arrow} />
                                    </TouchableOpacity>



                                    {openDropdown === "bed" && (
                                        <View style={styles.dropdownMenu}>
                                            {openDropdown && (
                                                <TouchableWithoutFeedback onPress={() => setOpenDropdown(null)}>
                                                    <View style={styles.dropdownOverlay} />
                                                </TouchableWithoutFeedback>
                                            )}
                                            {console.log("ballu", filteredBeds)}

                                            <ScrollView
                                                style={{ maxHeight: 160 }}
                                                nestedScrollEnabled={true}
                                                keyboardShouldPersistTaps="handled"
                                                showsVerticalScrollIndicator={false}
                                            >

                                                {!hasBeds ? (
                                                    <View style={styles.emptyOption}>
                                                        <Text style={styles.emptyText}>No bed available</Text>
                                                    </View>
                                                ) : (

                                                    filteredBeds.map((b) => (
                                                        <TouchableOpacity
                                                            key={b.bedId}
                                                            style={styles.option}

                                                            onPress={() => {
                                                                setBedSelected(b);
                                                                setOpenDropdown(null);
                                                                setBedError("");


                                                                if (!sameAsCurrent) {
                                                                    setAmount(String(b.rentAmount));
                                                                    setRentError("");
                                                                }
                                                            }}

                                                        >
                                                            <Text style={styles.optionText}>{b.bedName}</Text>
                                                        </TouchableOpacity>
                                                    ))
                                                )}

                                            </ScrollView>
                                        </View>
                                    )}

                                </View>
                                {bedError && (
                                    <ErrorMessage message={bedError} type="error" />
                                )}




                                <View style={styles.switchRow}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: "#111827",
                                        fontFamily: "Gilroy-Medium",
                                    }}>
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
                                            }
                                            else {
                                                setOneTimePaymentCharges([])
                                            }
                                        }}


                                    />
                                </View>
                                <Text style={styles.label}>Advance Amount <Text style={{ color: "red" }}>*</Text></Text>

                                <TextInput
                                    style={[
                                        styles.input,
                                        refuseAdvanceAmount && styles.disabledInput,
                                    ]}
                                    placeholder="Enter Amount"
                                    keyboardType="numeric"
                                    value={advanceAmount}
                                    editable={!refuseAdvanceAmount}
                                    selectTextOnFocus={!refuseAdvanceAmount}
                                    placeholderTextColor="#9CA3AF"
                                    onChangeText={(text) => {
                                        const onlyNum = text.replace(/[^0-9]/g, "");
                                        setAdvanceAmount(onlyNum);
                                        setAdvanceError("");
                                    }}


                                />

                                {advanceError && (
                                    <ErrorMessage message={advanceError} type="error" />
                                )}


                                <View style={styles.nonRefund}>
                                    <View style={styles.extraHeader}>
                                        <Text style={{ fontWeight: "600", color: "#444", marginBottom: 1 }}>Deductions</Text>


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

                                                            updateAmount(item.id, cleaned)
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

                                    <TouchableOpacity
                                        // style={styles.addNewButton}
                                        // onPress={addCharge}
                                        disabled={refuseAdvanceAmount}
                                        style={[
                                            styles.addNewButton,
                                            refuseAdvanceAmount && { opacity: 0.5 }
                                        ]}
                                        onPress={addCharge}
                                    >

                                        <View style={styles.addNewContent}>
                                            <View style={styles.plusCircle}>
                                                <Text style={styles.plusText}>+</Text>
                                            </View>

                                            <Text style={styles.addNewText}>
                                                Add New
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <View style={styles.fixedChargeFooter}>
                                        <Text style={styles.fixedChargeTitle}>
                                            TOTAL FIXED CHARGES
                                        </Text>

                                        <Text style={styles.fixedChargeAmount}>
                                            ₹ {totalFixedCharges.toLocaleString("en-IN")}
                                        </Text>
                                    </View>





                                </View>

                                <Text style={styles.note}>
                                    Note: These charges are deducted from the initial security deposit or collected at the time of check-in and are not refundable in any cost.
                                </Text>

                                <Text style={styles.label}>Total Rent (INR) <Text style={{ color: "red" }}>*</Text></Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={
                                        selectedBed?.rentAmount
                                            ? String(selectedBed.rentAmount)
                                            : "Enter Amount"
                                    }
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="numeric"
                                    value={checkinrentalAmount}
                                    onChangeText={(text) => {
                                        const onlyNum = text.replace(/[^0-9]/g, "");
                                        setCheckinRentalAmount(onlyNum);
                                        setRentalError("");
                                    }}

                                />
                                {rentalError && (
                                    <ErrorMessage message={rentalError} type="error" />
                                )}

                                {isCurrentMonth && (
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
                                )}

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
                                        onPress={AddOnetimeCharge}

                                        disabled={!refuseAdvanceAmount}
                                        style={[
                                            styles.addNewButton,
                                            !refuseAdvanceAmount && { opacity: 0.5 }
                                        ]}
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
                                            ₹ {deductionTotal.toLocaleString("en-IN")}
                                      
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
                                            ₹ {summaryRent.toLocaleString("en-IN")}
                                   
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


                                <View style={styles.row}>



                                    <TouchableOpacity
                                        style={[
                                            styles.primaryBtn,
                                            // hideCheckInSaveDraft && { flex: 1 },
                                            (!proceedcheckin || isSubmittingRef.current) && styles.disabledBtn,
                                        ]}
                                        disabled={!proceedcheckin || isSubmittingRef.current}
                                        onPress={handleCheckIn}
                                    >
                                        <Text style={styles.primaryText}>Check In</Text>
                                    </TouchableOpacity>


                                </View>



                            </>
                        )}

                        {tab === "short" && (

                             <View style={styles.shortstaycontainer}>
                                  <Image
                                    source={ComingSoomImage}
                                    style={styles.shortstayimage}
                                    resizeMode="contain"
                                  />
                            
                                  <Text style={styles.shortstaytitle}>
                                    We’re still working on this feature!
                                  </Text>
                            
                                  <Text style={styles.shortstaysubtitle}>
                                    Our team is building something helpful for you.
                                    {"\n"}Check back again shortly.
                                  </Text>
                            
                                  {/* <TouchableOpacity
                                    style={styles.button}
                                  >
                                    <Text style={styles.buttonText}>← Go Back</Text>
                                  </TouchableOpacity> */}
                                </View>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <BedDetailsSheet
                visible={showBedSheet}
                joiningDate={checkJoiningDate}
                onClose={() => setShowBedSheet(false)}
                onSelect={(data) => {
                    console.log("Selected Bed =>", data);

                    setSelectedBedDetails(data);

                    // Floor dropdown update
                    const floor = floors.find(f => f.id === data.floorId);
                    if (floor) {
                        setFloorSelected(floor);
                    }

                    // Load rooms for selected floor
                    loadRoomsByFloor(data.floorId).then(async () => {

                        // Room dropdown update
                        const room = {
                            id: data.roomId,
                            name: data.roomName,
                        };
                        setRoomSelected(room);

                        // Load beds for selected room
                        await getAllBedsByRoom(data.roomId);

                        // Bed dropdown update
                        setBedSelected({
                            bedId: data.bedId,
                            bedName: data.bedName,
                            rentAmount: data.rentAmount,
                        });

                        // Rent auto fill
                        setCheckinRentalAmount(String(data?.rentAmount));
                    });
                }}
            />

            {showCalendar && (
                <View style={styles.sheetOverlay}>
                    <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
                        <View style={{ flex: 1 }} />
                    </TouchableWithoutFeedback>

                    <View style={[styles.datePickerBox, { top: datePickerTop }]}>
                        <Calendar
                            minDate={
                                activeDateField === "joining" && purchaseDate
                                    ? dayjs(purchaseDate).format("YYYY-MM-DD")
                                    : undefined
                            }
                            maxDate={
                                activeDateField === "booking" || activeDateField === "checkin"
                                    ? dayjs().format("YYYY-MM-DD")
                                    : undefined
                            }
                            onDayPress={(day) => {
                                const selected = dayjs(day.dateString);

                                // if (activeDateField === "booking") {
                                //     setPurchaseDate(day.dateString);
                                //     setJoiningDate(null);
                                //     setBookingDateError("");
                                // }

                                // if (activeDateField === "joining") {
                                //     setJoiningDate(day.dateString);
                                //     setJoiningDateError("");
                                // }

                                if (activeDateField === "checkin") {
                                    setcheckJoiningDate(day.dateString);
                                    setCheckJoinDateError("");
                                }

                                setShowCalendar(false);
                                setActiveDateField(null);
                            }}
                            theme={{
                                todayTextColor: "#2563EB",
                                selectedDayBackgroundColor: "#2563EB",
                                selectedDayTextColor: "#FFFFFF",
                                textDisabledColor: "#9CA3AF",
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
        paddingTop: 32,
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

    segmentText: { color: "#4B5563", fontFamily: "Gilroy-Semibold" },

    segmentTextActive: { color: "#fff", fontFamily: "Gilroy-Semibold" },

    container: { paddingHorizontal: 16 },

    field: { marginBottom: 12 },

    label: { color: "#4B4B4B", marginBottom: 6, fontFamily: "Gilroy-Semibold" },

    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
        fontFamily: "Gilroy-Regular"
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

    icon: { width: 20, height: 20 },

    iconImage: {
        height: 16,
        width: 16,
        marginRight: 6
    },

    addText: { color: "#fff", fontSize: 12, fontFamily: "Gilroy-Semibold" },

    BtnRow: {
        flexDirection: "row",
        width: "99%",
        marginTop: 18,
        gap: 10,
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
    dropdownOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    optionText: {
        fontSize: 15,
        color: "#000",
    },

    disabledSelect: {
        backgroundColor: "#f2f2f2",
        opacity: 0.6,
    },
    selectText: { color: "#555" },
    emptyOption: {
        paddingVertical: 14,
        alignItems: "center",
    },


    emptyText: {
        color: "#999",
        fontStyle: "italic",
        fontSize: 14,
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",

        justifyContent: "center",
        alignItems: "center",
    },

    datePickerBox: {
        position: "absolute",
        left: "10%",
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 10,
        elevation: 10,

    },

    nonRefund: {
        backgroundColor: "#F7F9FF",
        padding: 10,
        marginTop: 16,
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
        fontFamily: "Gilroy-Regular"
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
        marginRight: 20,
        fontFamily: "Gilroy-Regular"
    },

    figmaCloseBtn: {
        position: "absolute",
        right: 8,
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
    calendarBox: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 10,
        elevation: 10,
    },
    fullRentRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
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
    doLaterContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    doLater: {
        fontSize: 14,
        color: "#111827",
        fontFamily: "Gilroy-Medium",
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
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 18,
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
    fixedChargeFooter: {
        marginTop: 12,
        backgroundColor: "#F4F6FA",
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#E7EAF0",
    },

    fixedChargeTitle: {
        fontSize: 13,
        color: "#64748B",
        fontFamily: "Gilroy-Semibold",
        textTransform: "uppercase",
    },

    fixedChargeAmount: {
        fontSize: 18,
        color: "#111827",
        fontFamily: "Gilroy-Bold",
    },
    note: {
        color: "#64748B",
        marginTop: 10,
        lineHeight: 20,
        fontSize: 13,
    },
    // bottomFooter: {
    //     position: "absolute",
    //     left: 0,
    //     right: 0,
    //     backgroundColor: "#fff",
    //     paddingHorizontal: 16,
    //     paddingTop: 12,
    //     paddingBottom: 16,
    //     borderTopWidth: 1,
    //     borderColor: "#ECECEC",

    //     shadowColor: "#000",
    //     shadowOpacity: 0.08,
    //     shadowRadius: 8,
    //     shadowOffset: {
    //         width: 0,
    //         height: -2,
    //     },
    //     elevation: 10,
    // },
    row: {
        flexDirection: "row",
        gap: 10,
        marginTop:20 
    },

    primaryBtn: {
        flex: 1,
        height: 48,
        backgroundColor: "#2F54EB",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    primaryText: {
        color: "#fff",
        fontSize: 15,
        fontFamily: "Gilroy-SemiBold",
    },

    disabledBtn: {
        backgroundColor: "#B7C4F7",
        opacity: 0.6,
    },
      shortstaycontainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  shortstayimage: {
    width: "100%",
    height: 230,
    marginBottom: 30,
  },
  shortstaytitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },
  shortstaysubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
});