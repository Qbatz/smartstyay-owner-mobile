import React, { useState, useContext, useCallback, useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Modal, Dimensions, Keyboard
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFloor } from "../../Context/PayingGuestContext";
import Delete from "../../Assets/Images/remove.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useCustomer } from "../../Context/CustomerContext";
import { CommonContexts } from "../../Context/CommonContext";
import { BankingContext } from "../../Context/BankingContext";
import { useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import customParseFormat from "dayjs/plugin/customParseFormat";
import SuccessModal from "../../ToastFile/ToastPage";
import ArrowLeft from "../../Assets/Images/Arrow_left.png"
import SearchIcon from "../../Assets/Images/Asset_search.png";
import ProfileImage from "../../Assets/Images/User.png";
import BedIcon from "../../Assets/Images/bed_NewIcon.png";
import UplodIcon from "../../Assets/Images/upload.png";
import Profile from "../../Assets/Images/Tenant_inactive.png";
import PlusIcon from "../../Assets/Images/add-circle.png";
import DirectionBottom from "../../Assets/Images/directionbottom.png"
import RemoveIcon from "../../Assets/Images/remove.png"
import { Switch } from "react-native";
import ImagePickerSheet from "./CustomerOverview/ImagePickerSheet";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ValidatedInput from "../MorePages/ValidatedInput"
import BedDetailsSheet from "./BedDetailsBottomsheet"
// import DatePicker from "react-native-date-picker";


export default function AddTenantNewform({ navigation, route }) {
    const { selectedBed, onBedAdded } = route.params || {};
    const insets = useSafeAreaInsets();

    const { AddTenantDraft, UpdateTenantDraft, TenantCheckIn, SearchCustomer,
        handleGetDraftDetails, resetDraftDetails, draftDetails,
        getCustomersByHostel, checkInCustomer, bookCustomer, getBedsByHostelAndDate,
        changeBedCustomer, getCustomerDetails, UpdateAdditionalDraftDetails } = useCustomer();
    const { activeHostelId } = useContext(CommonContexts);
    const { getAllFloorsByHostel, getAllRoomsByFloor, getAllBedsByRoom } = useFloor();

    const [draftCustomerId, setDraftCustomerId] = useState(null);

    const { getBankListByHostel } = useContext(BankingContext);

    const isSubmittingRef = useRef(false);

    const customer = route.params?.customer;
    // const isEditMode = route.params?.isEdit;

    const isEditMode = route?.params?.mode === "EDIT";
    const isAddMode = route?.params?.mode === "Add";

    console.log("MODE", route?.params?.mode);
    console.log("DRAFT", draftDetails);


    console.log(route.params);
    console.log(customer);


    const currentScrollY = useRef(0);
    // const tabBarHeight = useBottomTabBarHeight();

    const [currentStep, setCurrentStep] = useState(1);
    const [activeTab, setActiveTab] = useState("CheckIn");
    const [openDatePicker, setOpenDatePicker] = useState(false);
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
    const maintenanceAlreadyUsed = extraCharges?.some(c => c?.type === "Maintenance");
    const onetimepaymentmaintenanceAlreadyUsed = onetimepaymentcharges?.some(c => c?.type === "Maintenance");
    const [tenentsError, setTenantsError] = useState("")
    const [rentalError, setRentalError] = useState("")
    const [advanceError, setAdvanceError] = useState("")
    const [checkJoinDateError, setCheckJoinDateError] = useState("")
    const [stayTypeError, setStayTypeError] = useState("")
    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [AccountsList, setAccountList] = useState([]);
    const [accountOpen, setAccountopen] = useState(false);
    const [accountSelected, setAccountSelected] = useState(null);
    const [referenceNumber, setReferenceNumber] = useState("")
    const [bookingDateError, setBookingDateError] = useState("");
    const [joiningDateError, setJoiningDateError] = useState("");
    const [bookingAmountError, setBookingAmountError] = useState("");
    const [bankError, setBankError] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [activeDateField, setActiveDateField] = useState(null);
    const CALENDAR_HEIGHT = 340;
    const { height: SCREEN_HEIGHT } = Dimensions.get("window");
    const scrollRef = useRef(null);
    const transactionRef = useRef(null);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [showProfileSheet, setShowProfileSheet] = useState(false);

    const [showBedSheet, setShowBedSheet] = useState(false);
    const [selectedBedDetails, setSelectedBedDetails] = useState(null);

    const [searchText, setSearchText] = useState("");
    const [tenantList, setTenantList] = useState([]);
    const [showTenantList, setShowTenantList] = useState(false);

    const [nameError, setNameError] = useState("")
    const [mobileError, setMobileError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [pincodeError, setPincodeError] = useState("");
    const [doItLater, setDoItLater] = useState(false);
    const [proceedbook, setProceedBook] = useState(false);
    const [proceedcheckin, setProceedCheckin] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({ code: "+91", label: "India", });




    const [date, setDate] = useState(null);

    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([]);
    const [sameAsCurrent, setSameAsCurrent] = useState(false);
    const [floorSelected, setFloorSelected] = useState(null);
    const [roomSelected, setRoomSelected] = useState(null);
    const [bedSelected, setBedSelected] = useState(null);
    const [dateError, setDateError] = useState("")
    const [floorError, setFloorError] = useState("")
    const [roomError, setRoomError] = useState("")
    const [bedError, setBedError] = useState("")
    const [rentError, setRentError] = useState("")
    const [disableSheetDrag, setDisableSheetDrag] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [disableSheetScroll, setDisableSheetScroll] = useState(false);
    const [rentAmount, setRentAmount] = useState("")
    //   const isFloorDisabled = !date;
    const isRoomDisabled = !floorSelected;
    const isBedDisabled = !floorSelected || !roomSelected;
    const [currentFloorName, setCurrentFloorName] = useState("")
    const [currentRoomName, setCurrentRoomName] = useState("")
    const [currentBedName, setCurrentBedName] = useState("")

    const [aadhaarattachments, setAadhaarAttachments] = useState([]);
    const [pancardattachments, setPanCardAttachments] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [aadhaarImage, setAadhaarImage] = useState(null);
    const [pancardImage, setPanCardImage] = useState(null);
    const [refuseAdvanceAmount, setRefuseAdvanceAmount] = useState(false);

    const [ShowIdproofType, setShowIdProofType] = useState(false);
    const [IdproofType, setIdProofType] = useState("");
    const [IdprooNumber, setIdProofNumber] = useState("");

    const [guardians, setGuardians] = useState([]);

    console.log("roomSelected", roomSelected);



    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [basicDetails, setBasicDetails] = useState({
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
    })


    console.log("basicDetails", basicDetails);

    const [countryCode, setCountryCode] = useState("91");

    const [addressDetails, setAddressDetails] = useState({
        flat: "",
        area: "",
        landmark: "",
        pincode: "",
        city: "",
        state: "",
    })



    const [collectFullRent, setCollectFullRent] = useState(false);

    const [showCustomRentEditor, setShowCustomRentEditor] = useState(false);

    const [customRentAmount, setCustomRentAmount] = useState("");

    const [savedCustomRent, setSavedCustomRent] = useState("");

    const [isCustomRentSaved, setIsCustomRentSaved] = useState(false);

    const [customRentError, setCustomRentError] = useState("");

    console.log("savedCustomRent", savedCustomRent);




    const handleSetCustomRent = () => {

        if (!customRentAmount) {
            setCustomRentError("Please enter custom rent amount");
            return;
        }

        if (Number(customRentAmount) <= 0) {
            setCustomRentError("Amount should be greater than 0");
            return;
        }

        // if (Number(customRentAmount) > Number(checkinrentalAmount)) {
        //     setCustomRentError("Custom rent cannot exceed total rent");
        //     return;
        // }

        setSavedCustomRent(customRentAmount);
        setIsCustomRentSaved(true);
        setShowCustomRentEditor(false);
        setCustomRentError("");
    };

    const handleEditCustomRent = () => {
        setShowCustomRentEditor(true);
        setIsCustomRentSaved(false);
    };



    const [openStartTime, setOpenStartTime] = useState(false);
    const [openEndTime, setOpenEndTime] = useState(false);

    const [startTime, setStartTime] = useState("00:00 AM");
    const [endTime, setEndTime] = useState("00:00 PM");

    console.log("time", startTime, endTime);



    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const formatTimeInput = (text) => {
        let value = text.toUpperCase();

        // numbers, :, space, A,M,P mattum
        value = value.replace(/[^0-9APM: ]/g, "");

        // HHMM format
        const digits = value.replace(/\D/g, "").slice(0, 4);

        let result = "";

        if (digits.length >= 2) {
            result = digits.slice(0, 2);
        } else {
            result = digits;
        }

        if (digits.length > 2) {
            result += ":" + digits.slice(2);
        }

        // AM / PM
        if (value.includes("PM")) {
            result
        } else {
            result
        }

        return result;
    };

    const updateTime = (text, currentValue) => {
        // delete panna allow panna koodathu
        if (text.length < currentValue.length) {
            return currentValue;
        }

        let value = text.toUpperCase();

        value = value.replace(/[^0-9APM: ]/g, "");

        if (value.length > 8) {
            value = value.substring(0, 8);
        }

        return value;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const idProofOptions = [
        { value: "Aadhar Card", label: "Aadhar Card" },
        { value: "PAN Card", label: "PAN Card" },
        { value: "Passport", label: "Passport" },
        { value: "Driving License", label: "Driving License" },
    ];

    const relationOptions = [
        { value: "Father", label: "Father" },
        { value: "Mother", label: "Mother" },
        { value: "Brother", label: "Brother" },
        { value: "Sister", label: "Sister" },
        { value: "Husband", label: "Husband" },
        { value: "Husband", label: "Husband" },
        { value: "Son", label: "Son" },
        { value: "Daughter", label: "Daughter" },
        { value: "Grandfather", label: "Grandfather" },
        { value: "Grandfather", label: "Grandfather" },
        { value: "Uncle", label: "Uncle" },
        { value: "Aunt", label: "Aunt" },
        { value: "Cousin", label: "Cousin" },
        { value: "Guardian", label: "Guardian" },
        { value: "Friend", label: "Friend" },
        { value: "Relative", label: "Relative" },
        { value: "Other", label: "Other" },
    ];

    const shiftTypeOptions = [
        { value: "Day Shift", label: "Day Shift" },
        { value: "Night Shift", label: "Night Shift" },
        { value: "Rotational Shift", label: "Rotational Shift" },
        { value: "Flexible Shift", label: "Flexible Shift" },
        { value: "General Shift", label: "General Shift" },
    ];

    const jobRoleOptions = [
        { value: "Software Engineer", label: "Software Engineer" },
        { value: "Developer", label: "Developer" },
        { value: "Tester", label: "Tester" },
        { value: "Designer", label: "Designer" },
        { value: "Manager", label: "Manager" },
        { value: "Accountant", label: "Accountant" },
        { value: "Teacher", label: "Teacher" },
        { value: "Doctor", label: "Doctor" },
        { value: "Nurse", label: "Nurse" },
        { value: "Lawyer", label: "Lawyer" },
        { value: "Sales Executive", label: "Sales Executive" },
        { value: "Marketing Executive", label: "Marketing Executive" },
        { value: "Student", label: "Student" },
        { value: "Other", label: "Other" },
    ];

    const jobOptions = [
        { value: "Employed", label: "Employed" },
        { value: "Self Employed", label: "Self Employed" },
        { value: "Student", label: "Student" },
        { value: "Business Owner", label: "Business Owner" },
        { value: "Freelancer", label: "Freelancer" },
        { value: "Government Employee", label: "Government Employee" },
        { value: "Private Employee", label: "Private Employee" },
        { value: "Intern", label: "Intern" },
        { value: "Retired", label: "Retired" },
        { value: "Unemployed", label: "Unemployed" },
        { value: "Other", label: "Other" },
    ];


    const dummyTenants = [
        {
            id: 1,
            name: "Charles C",
            mobile: "7604921098",
            email: "charles@example.com",
            image: ProfileImage,
        },
        {
            id: 2,
            name: "Rajesh K",
            mobile: "9876547604",
            email: "",
            image: null,
        },
    ];

    const handleSearchCustomer = async (value) => {
        setSearchText(value);

        if (value.length < 4) {
            setTenantList([]);
            setShowTenantList(false);
            return;
        }

        setShowTenantList(true);

        const res = await SearchCustomer(activeHostelId, value);

        if (res.success) {
            setTenantList(res?.data);
        } else {
            setTenantList([]);
        }
    };

    const highlightText = (text, keyword) => {
        if (!keyword) return <Text>{text}</Text>;

        const index = text.indexOf(keyword);

        if (index === -1) {
            return <Text>{text}</Text>;
        }

        return (
            <Text style={styles.info}>
                {text.substring(0, index)}
                <Text
                    style={{
                        backgroundColor: "#F4F59C",
                        fontFamily: "Gilroy-SemiBold",
                    }}>
                    {keyword}
                </Text>
                {text.substring(index + keyword.length)}
            </Text>
        );
    };

    const filteredTenants = dummyTenants.filter(item =>
        item.mobile.includes(searchText)
    );

    const [hasVehicle, setHasVehicle] = useState(true);

    const vehicleTypes = [
        "2-Wheeler",
        "3-Wheeler",
        "4-Wheeler",
    ];

    const [vehicleType, setVehicleType] = useState("2-Wheeler");
    const [vehicleDropdown, setVehicleDropdown] = useState(false);

    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");



    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
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



    const scrollToY = (y = 300) => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                y,
                animated: true,
            });
        }, 120);
    };


    const [fullName, setFullName] = useState("");
    const [relationship, setRelationship] = useState("");
    const [occupation, setOccupation] = useState("");
    const [mobile, setMobile] = useState("");
    const [error, setError] = useState("");




    const [showRelationDropdown, setShowRelationDropdown] = useState(false);
    const [showOccupationDropdown, setShowOccupationDropdown] = useState(false);

    const [isRelationOther, setIsRelationOther] = useState(false);
    const [isOccupationOther, setIsOccupationOther] = useState(false);

    const [nameErr, setNameErr] = useState("");
    const [relationErr, setRelationErr] = useState("");
    const [occupationErr, setOccupationErr] = useState("");
    const [mobileErr, setMobileErr] = useState("");
    const [formErr, setFormErr] = useState("");

    const [initialState, setInitialState] = useState(null);
    const [isSubmitClicked, setIsSubmitClicked] = useState(false);

    const [companyName, setCompanyName] = useState("")
    const [employementstatus, setEmployementStatus] = useState("")
    //   const [jobrole, setJobRole] = useState("")
    const [worklocation, setWorkLocations] = useState("")
    //   const [shifttype, setShiftType] = useState("")

    const [employmentOpen, setEmploymentOpen] = useState(false);
    const [jobRoleOpen, setJobRoleOpen] = useState(false);
    const [shiftOpen, setShiftOpen] = useState(false);

    const [employmentStatus, setEmploymentStatus] = useState(null);
    const [jobRole, setJobRole] = useState(null);
    const [shiftType, setShiftType] = useState(null);

    const [aadhaarError, setAadhaarError] = useState("");
    const [panError, setPanError] = useState("")


    const [companyError, setCompanyError] = useState("");
    const [employmentError, setEmploymentError] = useState("");
    const [jobRoleError, setJobRoleError] = useState("");
    const [workLocationError, setWorkLocationError] = useState("");
    const [shiftTypeError, setShiftTypeError] = useState("");
    const [startTimeError, setStartTimeError] = useState("");
    const [endTimeError, setEndTimeError] = useState("");

    const [guardianErrors, setGuardianErrors] = useState([]);

    const relationshipOptions = [
        "Father",
        "Mother",
        "Brother",
        "Sister",
        "Uncle",
        "Other",
    ];

    const occupationOptions = [
        "Govt Employee",
        "Private Employee",
        "Business / Self-employed",
        "Farmer",
        "Daily Wage / Labour",
        "Homemaker",
        "Retired Employee",
        "Abroad (Working Overseas)",
        "Other",
    ];

    //  const scrollInputIntoView = (ref) => {
    //   if (!ref?.current || !scrollRef?.current) return;

    //   setTimeout(() => {
    //     ref.current.focus();

    //     scrollRef.current.scrollResponderScrollNativeHandleToKeyboard(
    //       ref.current,
    //       200,   // extra offset above keyboard
    //       true
    //     );
    //   }, 150);
    // };


    const loadFloors = async () => {
        if (!activeHostelId) return;

        try {
            const res = await getAllFloorsByHostel(activeHostelId);

            if (res?.success && Array.isArray(res?.data)) {
                setFloors(res?.data);
            } else {
                setFloors([]);
            }
        } catch (e) {

            setFloors([])
        }
    }


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

    useEffect(() => {
        if (activeHostelId) {
            loadFloors()
        }
    }, [activeHostelId])

    // useEffect(() => {
    //     if (draftCustomerId) {
    //         handleGetDraftDetails(draftCustomerId);
    //     }
    // }, [draftCustomerId]);




    console.log("DraftDetails", draftDetails);


    const getValue = (value, defaultValue = "") => {
        if (
            value === null ||
            value === undefined ||
            value === "null" ||
            value === "undefined"
        ) {
            return defaultValue;
        }

        return typeof value === "string" ? value.trim() : value;
    };






    useFocusEffect(
        useCallback(() => {
            if (route?.params?.mode === "EDIT") {
                handleGetDraftDetails(route.params.customerId);
            } else {
                resetDraftDetails();

                setDraftCustomerId(null);
                setSelectedImage(null);

                setBasicDetails({
                    firstName: "",
                    lastName: "",
                    mobile: "",
                    email: "",
                });

                setAddressDetails({
                    flat: "",
                    area: "",
                    landmark: "",
                    city: "",
                    pincode: "",
                });

                setPurchaseDate(null);
                setJoiningDate(null);

                setBookingAmount("");
                setAdvanceAmount("");
                setCheckinRentalAmount("");

                setFloorSelected(null);
                setRoomSelected(null);
                setBedSelected(null);

                setEmploymentStatus("");
                setCompanyName("");
                setJobRole("");
                setWorkLocations("");
                setShiftType("");

                setGuardians([]);
                setExtraCharges([]);
                setOneTimePaymentCharges([]);

                setAadhaarImage(null);
                setPanCardImage(null);

                setReferenceNumber("");
                setCurrentStep(1);
                setActiveTab("CheckIn");
            }
        }, [route?.params?.mode, route?.params?.customerId])
    );

    useEffect(() => {
        if (!draftDetails) return;

        const {
            address = {},
            jobDetails = {},
            hostelInfo = {},
            vehicleDetails = {},
            guardians = [],
            deductions = [],
        } = draftDetails;

        setDraftCustomerId(draftDetails?.customerId)

        setBasicDetails({
            firstName: getValue(draftDetails?.firstName),
            lastName: getValue(draftDetails?.lastName),
            mobile: getValue(draftDetails?.mobileNo || draftDetails?.mobile),
            email: getValue(draftDetails?.emailId),
        });

        setCountryCode(getValue(draftDetails?.countryCode, "91"));

        setSelectedImage(
            getValue(draftDetails?.profilePic)
                ? { uri: draftDetails.profilePic }
                : null
        );

        setAddressDetails({
            flat: getValue(
                draftDetails?.address?.flat || draftDetails?.address?.house
            ),
            area: getValue(
                draftDetails?.address?.area || draftDetails?.address?.street
            ),
            landmark: getValue(draftDetails?.address?.landmark),
            pincode: getValue(draftDetails?.address?.pincode),
            city: getValue(draftDetails?.address?.city),
        });

        setSelectedState(getValue(draftDetails?.address?.state));

        setIdProofType(getValue(draftDetails?.idProof?.type));
        setIdProofNumber(getValue(draftDetails?.idProof?.number));

        setPurchaseDate(
            getValue(draftDetails?.bookingInfo?.bookingDate)
                ? dayjs(draftDetails.bookingInfo?.bookingDate, "DD-MM-YYYY")
                : null
        );

        setJoiningDate(
            getValue(draftDetails?.booking?.joiningDateTentative)
                ? dayjs(draftDetails.booking?.joiningDateTentative, "DD-MM-YYYY")
                : null
        );

        setBookingAmount(String(getValue(draftDetails?.bookingInfo?.bookingAmount, 0)));

        setReferenceNumber(getValue(draftDetails?.referenceNumber));

        setAdvanceAmount(String(getValue(draftDetails?.advanceAmount, 0)));

        setCheckinRentalAmount(
            String(getValue(draftDetails?.rentalAmount, 0))
        );


        setFloorSelected(
            draftDetails?.hostelInfo?.floorId
                ? {
                    id: draftDetails.hostelInfo.floorId,
                    name: getValue(draftDetails.hostelInfo.floorName),
                }
                : null
        );

        setRoomSelected(
            draftDetails?.hostelInfo?.roomId
                ? {
                    id: draftDetails.hostelInfo.roomId,
                    name: getValue(draftDetails.hostelInfo.roomName),
                }
                : null
        );

        setBedSelected(
            draftDetails?.hostelInfo?.bedId
                ? {
                    bedId: draftDetails.hostelInfo.bedId,
                    bedName: getValue(draftDetails.hostelInfo.bedName),
                    floorId: draftDetails.hostelInfo.floorId,
                    roomId: draftDetails.hostelInfo.roomId,
                }
                : null
        );

        const job = draftDetails?.jobDetails || {};

        setEmploymentStatus(
            jobOptions.find(
                item => item.value === job.employmentStatus
            ) || null
        );

        setJobRole(
            jobRoleOptions.find(
                item => item.value === job.jobRole
            ) || null
        );

        setShiftType(
            shiftTypeOptions.find(
                item => item.value === job.shiftType
            ) || null
        );
        setCompanyName(getValue(job.companyName));
        setWorkLocations(getValue(job.workLocation));
        setStartTime(getValue(job.shiftFrom));
        setEndTime(getValue(job.shiftTo));

        setGuardians(
            Array.isArray(draftDetails?.guardians)
                ? draftDetails.guardians.map(item => ({
                    fullName: getValue(item.guardianFullName),
                    relationship: getValue(item.relationshipToTenant),
                    occupation: getValue(item.guardianOccupation),
                    mobile: getValue(item.mobileNo),
                }))
                : []
        );

        setExtraCharges(
            Array.isArray(draftDetails?.deductions)
                ? draftDetails.deductions.map((item, index) => ({
                    id: index + 1,
                    type: item.type === "Maintenance" ? "Maintenance" : "Others",
                    title: item.type === "Maintenance" ? "" : getValue(item.type),
                    amount: String(getValue(item.amount, 0)),
                }))
                : []
        );

        if (draftDetails?.aadharPic) {
            const aadhaarFile = {
                uri: draftDetails.aadharPic,
                fileName: draftDetails.aadharPic.split("/").pop(),
                fileSize: 0,
                type: "image/jpeg",
            };

            setAadhaarImage(aadhaarFile);
            setAadhaarAttachments([aadhaarFile]);
        } else {
            setAadhaarImage(null);
            setAadhaarAttachments([]);
        }

        if (draftDetails?.panPic) {
            const panFile = {
                uri: draftDetails.panPic,
                fileName: draftDetails.panPic.split("/").pop(),
                fileSize: 0,
                type: "image/jpeg",
            };

            setPanCardImage(panFile);
            setPanCardAttachments([panFile]);
        } else {
            setPanCardImage(null);
            setPanCardAttachments([]);
        }

        const vehicle = draftDetails?.vehicleDetails || {};

        setHasVehicle(vehicle?.isParkingSpaceRequired ?? false);
        setVehicleType(getValue(vehicle?.vehicleType));
        setVehicleNumber(getValue(vehicle?.vehicleNumber));


    }, [draftDetails]);


    // useEffect(() => {
    //     if (!draftDetails) return;

    //     setBasicDetails({
    //         firstName: draftDetails?.firstName || "",
    //         lastName: draftDetails?.lastName || "",
    //         mobile: draftDetails?.mobileNo?.replace("+91 ", "") || "",
    //         email: draftDetails?.emailId || "",
    //     });

    //     setIdProofNumber(draftDetails?.idProof?.number || "",)
    //     setIdProofType(draftDetails?.idProof?.type || "",)

    //     setSelectedImage(
    //         draftDetails?.profilePic
    //             ? { uri: draftDetails.profilePic }
    //             : null
    //     );


    //     setAddressDetails({
    //         flat: draftDetails?.address?.flat || draftDetails?.address?.house || "",
    //         area: draftDetails?.address?.area || draftDetails?.address?.street || "",
    //         landmark: draftDetails?.address?.landmark || "",
    //         pincode: draftDetails?.address?.pincode || "",
    //         city: draftDetails?.address?.city || "",
    //     });

    //     setSelectedState(draftDetails?.address?.state || "");


    //     setEmploymentStatus(
    //         draftDetails?.jobDetails?.employmentStatus || ""
    //     );
    //     setCompanyName(
    //         draftDetails?.jobDetails?.companyName || ""
    //     );
    //     setJobRole(
    //         draftDetails?.jobDetails?.jobRole || ""
    //     );
    //     setWorkLocations(
    //         draftDetails?.jobDetails?.workLocation || ""
    //     );
    //     setShiftType(
    //         draftDetails?.jobDetails?.shiftType || ""
    //     );
    //     setStartTime(
    //         draftDetails?.jobDetails?.shiftFrom || ""
    //     );
    //     setEndTime(
    //         draftDetails?.jobDetails?.shiftTo || ""
    //     );


    //     setGuardians(
    //         draftDetails?.guardians || []
    //     );

    // }, [draftDetails]);


    const loadBedsByDate = async (selectedDate) => {
        if (!activeHostelId || !selectedDate) return;

        const formattedDate = dayjs(selectedDate).format("DD-MM-YYYY");


        try {
            const res = await getBedsByHostelAndDate(
                activeHostelId,
                formattedDate
            );

            if (res?.success) {
                setBeds(res?.data?.listBeds || [])

            } else {
                setBeds([]);
            }
        } catch (err) {

            setBeds([]);
        }
    };


    console.log(beds)

    const filteredBeds = beds?.filter((bed) => {
        if (!floorSelected || !roomSelected) return false;

        return (
            bed?.floorId === floorSelected?.id &&
            bed?.roomId === roomSelected?.id &&
            (
                bed?.currentStatus === "VACANT" ||
                bed?.currentStatus === "NOTICE"
            )
        );
    });


    console.log(filteredBeds)

    const hasRooms = rooms && rooms?.length > 0;
    const hasBeds = filteredBeds && filteredBeds?.length > 0;

    // const scrollInputIntoView = (refOrNode) => {
    //     if (!scrollRef?.current) return;

    //     const input =
    //         refOrNode?.current ? refOrNode.current : refOrNode;

    //     if (!input || typeof input.focus !== "function") return;

    //     setTimeout(() => {
    //         input.focus();

    //         scrollRef.current.scrollResponderScrollNativeHandleToKeyboard(
    //             input,
    //             200,
    //             true
    //         );
    //     }, 150);
    // };

    // const scrollInputIntoView = (refOrNode) => {
    //     const input =
    //         refOrNode?.current ? refOrNode.current : refOrNode;

    //     if (!input) return;

    //     setTimeout(() => {
    //         if (!scrollRef.current) return;

    //         input.focus?.();

    //         scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard?.(
    //             input,
    //             200,
    //             true
    //         );
    //     }, 150);
    // };

    const scrollInputIntoView = (refOrEvent) => {
        // Support both ref.current and direct event.target
        const input = refOrEvent?.current
            ? refOrEvent.current
            : refOrEvent?.target
                ? refOrEvent.target
                : refOrEvent;

        if (!input || !scrollRef.current) return;

        setTimeout(() => {
            input.measureInWindow?.((x, y, width, height) => {
                const kbHeight = keyboardHeight || 300;
                const footerHeight = 90;
                const visibleBottom = SCREEN_HEIGHT - kbHeight - footerHeight;

                if (y + height <= visibleBottom && y >= 0) return;

                const offset = (y + height) - visibleBottom + 20;

                scrollRef.current.scrollTo({
                    y: currentScrollY.current + offset,
                    animated: true,
                });
            });
        }, Platform.OS === "ios" ? 250 : 350);
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

    const TYPE_OPTIONS = ["Maintenance", "Others"];






    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const mobileRegex = /^[1-9][0-9]{9}$/;

    const isBasicValid =
        basicDetails.firstName.trim().length > 0 &&
        mobileRegex.test(basicDetails.mobile);



    const isAddressValid =

        addressDetails.flat.trim() ||
        addressDetails.area.trim() ||
        addressDetails.landmark.trim() ||
        addressDetails.city.trim() ||
        addressDetails.pincode.trim().length === 6 ||
        selectedState !== "Select State";


    const hasAnyAddress =
        addressDetails.flat.trim().length > 0 ||
        addressDetails.area.trim().length > 0 ||
        addressDetails.landmark.trim().length > 0 ||
        addressDetails.city.trim().length > 0 ||
        addressDetails.pincode.trim().length > 0 ||
        selectedState !== "Select State";

    const [selectedState, setSelectedState] = useState(""); // final value
    const [stateQuery, setStateQuery] = useState("");       // typing value



    const [stateOpen, setStateOpen] = useState(false);
    const stateList = [
        { label: "Andhra Pradesh", value: "Andhra Pradesh" },
        { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
        { label: "Assam", value: "Assam" },
        { label: "Bihar", value: "Bihar" },
        { label: "Chhattisgarh", value: "Chhattisgarh" },
        { label: "Goa", value: "Goa" },
        { label: "Gujarat", value: "Gujarat" },
        { label: "Haryana", value: "Haryana" },
        { label: "Himachal Pradesh", value: "Himachal Pradesh" },
        { label: "Jharkhand", value: "Jharkhand" },
        { label: "Karnataka", value: "Karnataka" },
        { label: "Kerala", value: "Kerala" },
        { label: "Madhya Pradesh", value: "Madhya Pradesh" },
        { label: "Maharashtra", value: "Maharashtra" },
        { label: "Manipur", value: "Manipur" },
        { label: "Meghalaya", value: "Meghalaya" },
        { label: "Mizoram", value: "Mizoram" },
        { label: "Nagaland", value: "Nagaland" },
        { label: "Odisha", value: "Odisha" },
        { label: "Punjab", value: "Punjab" },
        { label: "Rajasthan", value: "Rajasthan" },
        { label: "Sikkim", value: "Sikkim" },
        { label: "Tamil Nadu", value: "Tamil Nadu" },
        { label: "Telangana", value: "Telangana" },
        { label: "Tripura", value: "Tripura" },
        { label: "Uttar Pradesh", value: "Uttar Pradesh" },
        { label: "Uttarakhand", value: "Uttarakhand" },
        { label: "West Bengal", value: "West Bengal" },
    ];
    const filteredStateList = stateList
        .filter((s) =>
            s.label.toLowerCase().includes(stateQuery.toLowerCase())
        )
        .sort((a, b) => {
            const aStart = a.label.toLowerCase().startsWith(stateQuery.toLowerCase());
            const bStart = b.label.toLowerCase().startsWith(stateQuery.toLowerCase());
            return bStart - aStart;
        });

    const isEmailValid =
        !basicDetails.email ||
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(basicDetails.email);

    const toggleDropdown = (type) => {
        setOpenDropdown((prev) => (prev === type ? null : type));
    };


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

    }

    const handleshowBedDetailsheet = () => {
        // if (!checkJoiningDate || !joiningDate) return
        setShowBedSheet(true);
    }


    const openCamera = () => {
        launchCamera(
            {
                mediaType: "photo",
                quality: 0.7,
            },
            (response) => {
                if (response.didCancel) return;
                if (response.assets && response.assets.length > 0) {
                    //   setProfileImage(response.assets[0]);
                    const source = { uri: response.assets[0].uri };
                    setSelectedImage(source);
                }
            }
        );
    };
    const openGallery = () => {
        console.log("Gallery Pressed");
        launchImageLibrary(
            { mediaType: "photo", quality: 0.7 },
            async (response) => {
                if (response.didCancel) return;

                if (response.assets?.length > 0) {
                    //   const image = response.assets[0];
                    //   setProfileImage(image); // UI update
                    const source = { uri: response.assets[0].uri };
                    setSelectedImage(source);

                }
            }
        );
    };


    useFocusEffect(
        useCallback(() => {
            fetchWalkinCustomers();
        }, [activeHostelId])
    );

    const fetchWalkinCustomers = async () => {
        const data = await getCustomersByHostel(
            activeHostelId,
            "",
            "Inactive"
        );
        // setCheckinTenants(data?.listCustomers || []);
        const list = data?.listCustomers || [];
        // setCheckinTenants(list);
        // if (list?.length === 0) {
        //   setModalType("error");
        //   setMessage("Please Create a New Tenant");
        //   setShowSuccess(true);

        //   setTimeout(() => {
        //     setShowSuccess(false);
        //   }, 2000);
        // };
    }
    console.log("setCheckinTenants", CheckinTenants)

    const loadRooms = async (floorId) => {
        const res = await getAllRoomsByFloor(floorId);
        if (res.success) {
            console.log("RoomData", res.data);

            setRooms(res.data);
        } else {
            setRooms([]);
        }
    };

    useEffect(() => {
        if (!activeHostelId || !joiningDate) return;

        loadBeds(joiningDate);
    }, [activeHostelId, joiningDate]);

    //   useEffect(() => {
    //     if (!activeHostelId || !checkJoiningDate) return;

    //     loadBeds(checkJoiningDate);
    // }, [activeHostelId, checkJoiningDate]);

    useEffect(() => {
        if (!activeHostelId || !checkJoiningDate) return;

        loadBeds(checkJoiningDate);
    }, [activeHostelId, checkJoiningDate]);


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

    const selectType = (id, type) => {

        if (type === "Maintenance" && maintenanceAlreadyUsed) return;

        setExtraCharges(prev =>
            prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "", typeError: "" } : i))
        )

        setOpenDropdownId(null)
    }

    const selectOntimeType = (id, type) => {


        if (type === "Maintenance" && onetimepaymentmaintenanceAlreadyUsed) return;

        setOneTimePaymentCharges(prev =>
            prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "", typeError: "" } : i))
        );

        setOpenDropdownId(null);
    };

    const fetchBankingList = async () => {
        const data = await getBankListByHostel(activeHostelId);
        setAccountList(data.data);
    };

    useEffect(() => {
        if (activeHostelId) {
            fetchBankingList(activeHostelId);
        }
    }, [activeHostelId]);



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
        )
    }

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

    // const updateAmount = (id, amount) => {
    //   setExtraCharges(prev =>
    //     prev.map(i => (i.id === id ? { ...i, amount } : i))
    //   );
    // };


    const updateAmount = (id, amount) => {
        const onlyNum = amount.replace(/[^0-9]/g, "");

        setExtraCharges((prev) =>
            prev.map((i) =>
                i.id === id
                    ? { ...i, amount: onlyNum, amountError: "" }
                    : i
            )
        )
    }

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


    const clearAllStates = () => {
        resetDraftDetails();

        setDraftCustomerId(null);

        setBasicDetails({
            firstName: "",
            lastName: "",
            mobile: "",
            email: "",
        });

        setAddressDetails({
            flat: "",
            area: "",
            landmark: "",
            city: "",
            pincode: "",
        });

        setSelectedImage(null);
        setAadhaarImage(null);
        setPanCardImage(null);

        setPurchaseDate(null);
        setJoiningDate(null);
        setcheckJoiningDate(null);

        setBookingAmount("");
        setAdvanceAmount("");
        setCheckinRentalAmount("");
        setReferenceNumber("");

        setFloorSelected(null);
        setRoomSelected(null);
        setBedSelected(null);

        setEmploymentStatus(null);
        setCompanyName("");
        setJobRole(null);
        setWorkLocations("");
        setShiftType(null);

        setGuardians([]);
        setExtraCharges([]);
        setOneTimePaymentCharges([]);

        setCurrentStep(1);
        setActiveTab("CheckIn");
    };

    useEffect(() => {
        return () => {
            clearAllStates();
        };
    }, []);

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
        else {
            navigation.goBack();
        }
    }



    const validateStepOne = () => {
        let valid = true;

        setNameError("");
        setMobileError("");
        setEmailError("");
        setPincodeError("");

        // First Name
        if (!basicDetails.firstName.trim()) {
            setNameError("Please Enter First Name");
            valid = false;
        }

        // Mobile
        if (!/^[1-9]\d{9}$/.test(basicDetails.mobile)) {
            setMobileError("Enter Valid Mobile Number");
            valid = false;
        }

        // Email (optional)
        if (
            basicDetails.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(basicDetails.email)
        ) {
            setEmailError("Enter Valid Email");
            valid = false;
        }

        // Pincode (optional)
        if (addressDetails.pincode.trim() !== "") {
            if (!/^[1-9][0-9]{5}$/.test(addressDetails.pincode)) {
                setPincodeError("Enter Valid Pincode");
                valid = false;
            }
        }

        return valid;
    };

    const isStepOneValid = () => {
        const mobileValid = /^[6-9]\d{9}$/.test(basicDetails.mobile);

        const emailValid =
            !basicDetails.email ||
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(basicDetails.email);

        const pincodeValid =
            !addressDetails.pincode ||
            /^[1-9][0-9]{5}$/.test(addressDetails.pincode);

        return (
            basicDetails.firstName.trim() &&
            mobileValid &&
            emailValid &&
            pincodeValid
        );
    };


    const handleBasicNext = async () => {

        if (!validateStepOne()) {
            return;
        }

        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        try {

            const payload = {
                request: {
                    firstName: basicDetails.firstName,
                    lastName: basicDetails.lastName,
                    mobile: basicDetails.mobile,
                    emailId: basicDetails.email,

                    // joiningDate: "",
                    // bookingDate: "",
                    // bookingAmount: 0,

                    // floorId: null,
                    // roomId: null,
                    // bedId: null,

                    // bankId: "",
                    // referenceNumber: "",

                    // advanceAmount: 0,
                    // rentalAmount: 0,

                    // stayType: "",

                    // deductions: [],

                    // proRate: false,

                    idProof: {
                        type: IdproofType || "",
                        number: IdprooNumber || "",
                    },

                    address: {
                        flat: addressDetails.flat,
                        house: "",
                        building: "",
                        company: "",
                        apartment: "",
                        area: addressDetails.area,
                        street: "",
                        sector: "",
                        village: "",
                        landmark: addressDetails.landmark,
                        pincode: addressDetails.pincode,
                        city: addressDetails.city,
                        state: selectedState,
                    },

                    // booking: {
                    //   joiningDateTentative: "",
                    //   refuseAdvanceAmount: false,
                    // },

                    jobDetails: {
                        employmentStatus: "",
                        companyName: "",
                        collegeName: "",
                        jobRole: "",
                        workLocation: "",
                        shiftType: "",
                        shiftFrom: "",
                        shiftTo: "",
                    },

                    guardians: [],

                    vehicleDetails: {
                        vehicleType: "",
                        vehicleNumber: "",
                        isParkingSpaceRequired: false,
                    },
                },
            };
            console.log("savedraftpayload", payload);

            const profileImage = selectedImage

            const res = await AddTenantDraft(
                activeHostelId,
                payload,
                profileImage,
                aadhaarImage,
                pancardImage
            );

            console.log("addtenantdraftresponse", res);


            if (res?.success) {
                setModalType("success");
                setMessage(res?.data?.message);
                setShowSuccess(true);

                setDraftCustomerId(res?.data?.customerId)

                setTimeout(() => {
                    setCurrentStep(2);
                    setShowSuccess(false);
                    setIsSubmitClicked(false)
                }, 800);
            }
            else {
                const mobileMsg = res?.MobilenoError || "";
                const emailMsg = res?.EmailError || "";

                console.log("mobileMsg", mobileMsg);


                setMobileError(mobileMsg);
                setEmailError(emailMsg);
                setIsSubmitClicked(false)

                // if (mobileMsg || emailMsg) {
                //     setStep(1);
                // }
            }
        }

        finally {
            isSubmittingRef.current = false;
        }
    };

    const UpdateDraft = async () => {

        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        try {
            const payload = {
                request: {
                    // Basic Details
                    firstName: basicDetails.firstName,
                    lastName: basicDetails.lastName,
                    mobile: basicDetails.mobile,
                    emailId: basicDetails.email,

                    // Booking
                    joiningDate: joiningDate
                        ? dayjs(joiningDate).format("DD-MM-YYYY")
                        : "",

                    bookingDate: purchaseDate
                        ? dayjs(purchaseDate).format("DD-MM-YYYY")
                        : "",

                    bookingAmount: Number(bookingAmount || 0),

                    floorId: floorSelected?.id || null,
                    roomId: roomSelected?.id || null,
                    bedId: bedSelected?.bedId || null,

                    bankId: accountSelected?.bankingId || "",
                    referenceNumber: referenceNumber || "",

                    advanceAmount: Number(advanceAmount || 0),
                    rentalAmount: Number(checkinrentalAmount || rentalAmount || 0),

                    stayType: "LONG",

                    deductions: extraCharges.map(item => ({
                        type:
                            item.type === "Others"
                                ? item.title
                                : item.type,
                        amount: Number(item?.amount || 0),
                    })),

                    proRate: false,

                    idProof: {
                        type: IdproofType || "",
                        number: IdprooNumber || "",
                    },

                    address: {
                        flat: addressDetails.flat || "",
                        house: "",
                        building: "",
                        company: "",
                        apartment: "",
                        area: addressDetails.area || "",
                        street: "",
                        sector: "",
                        village: "",
                        landmark: addressDetails?.landmark || "",
                        pincode: addressDetails?.pincode || "",
                        city: addressDetails?.city || "",
                        state: selectedState || "",
                    },

                    booking: {
                        joiningDateTentative: joiningDate
                            ? dayjs(joiningDate).format("DD-MM-YYYY")
                            : "",
                        refuseAdvanceAmount: refuseAdvanceAmount,
                    },

                    jobDetails: {
                        employmentStatus: employmentStatus || "",
                        companyName: companyName || "",
                        collegeName: "",
                        jobRole: jobRole || "",
                        workLocation: worklocation || "",
                        shiftType: shiftType || "",
                        shiftFrom: startTime || "",
                        shiftTo: endTime || "",
                    },

                    guardians: guardians.map(item => ({
                        guardianFullName: item?.fullName || "",
                        relationshipToTenant: item?.relationship || "",
                        guardianOccupation: item?.occupation || "",
                        mobileNo: item?.mobile || "",
                    })),

                    vehicleDetails: {
                        vehicleType: hasVehicle ? vehicleType : "",
                        vehicleNumber: hasVehicle ? vehicleNumber : "",
                        isParkingSpaceRequired: hasVehicle,
                    },
                },
            };

            console.log("UPDATE DRAFT PAYLOAD", JSON.stringify(payload, null, 2));

            const res = await UpdateTenantDraft(
                activeHostelId,
                draftCustomerId,
                payload,
                selectedImage,
                aadhaarImage,
                pancardImage
            );

            console.log("res", res, draftCustomerId);


            if (res.success) {
                setModalType("success");
                setMessage(res?.data?.message || "Draft updated successfully");
                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false)
                    if (currentStep === 1) {
                        setCurrentStep(2)
                    }
                    if (currentStep === 2) {
                        // setCurrentStep(3)
                        navigation.goBack();
                    }

                    if (currentStep === 3) {
                        navigation.goBack();
                    }


                }, 800);
            } else {
                setModalType("error");
                setMessage(res?.message || "Draft update failed");
                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false);
                }, 800);
            }
        }
        finally {
            isSubmittingRef.current = false;
        }
    };

    const validateBooking = () => {
        let valid = true;

        setBookingDateError("");
        setJoiningDateError("");
        setBookingAmountError("");
        setBankError("");


        // if (!CheckinTenantSelected) {
        //     setTenantsError("Please Select Tenant");
        //     valid = false;
        // }

        if (!purchaseDate) {
            setBookingDateError("Please Select Booking Date");
            valid = false;
        }

        if (!joiningDate) {
            setJoiningDateError("Please Select Joining Date");
            valid = false;
        }

        if (!bookingAmount || Number(bookingAmount) <= 0) {
            setBookingAmountError("Enter Valid Booking Amount");
            valid = false;
        }
        if (!floorSelected) {
            setFloorError("Please Select Floor");
            valid = false;
        }

        if (!roomSelected) {
            setRoomError("Please Select Room");
            valid = false;
        }

        if (!bedSelected) {
            setBedError("Please Select Bed");
            valid = false;
        }

        if (!accountSelected) {
            setBankError("Please Select Mode Of Transaction");
            valid = false;
        }

        return valid;
    };
    console.log("selectedbed", floorSelected);
    console.log("selectedbed", roomSelected);
    console.log("selectedbed", bedSelected);




    const handleBookingSubmit = async () => {
        if (!validateBooking()) return;
        // if (isCheckingIn) return;
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;


        try {
            setIsCheckingIn(true)



            const payload = {
                customerId: draftCustomerId,

                bookingDate: dayjs(purchaseDate).format("DD-MM-YYYY"),
                joiningDate: dayjs(joiningDate).format("DD-MM-YYYY"),

                bookingAmount: Number(bookingAmount),

                floorId: floorSelected?.id,
                roomId: roomSelected?.id,
                bedId: bedSelected?.bedId,

                // rentalAmount: Number(
                //     rentalAmount || bedSelected?.rentAmount || 0
                // ),

                bankId: accountSelected?.bankingId,
                referenceNumber: referenceNumber?.trim() || "",
            };

            console.log("BookingPayload", payload);


            const res = await bookCustomer(activeHostelId, payload);

            console.log("Bookingresponse", res);


            if (res.success) {
                setModalType("success");
                setMessage(res.data);
                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false);
                    navigation.goBack();
                }, 800);
            } else {
                setModalType("error");
                setMessage(res?.message || "Booking failed");
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                }, 800)
                // alert(res.message || "Booking failed");
            }
        } catch (error) {
            console.log(error)
            setIsCheckingIn(false)
        }
        finally {
            isSubmittingRef.current = false;
        }
    };

    const hideBookingSaveDraft = !!accountSelected;
    const hideCheckInSaveDraft = checkinrentalAmount?.trim()?.length > 0;

    const validateStepThree = () => {
        let valid = true;

        // Clear Errors
        setCompanyError("");
        setEmploymentError("");
        setJobRoleError("");
        setWorkLocationError("");
        setShiftTypeError("");
        setStartTimeError("");
        setEndTimeError("");

        const guardianValidation = [];

        /* -------------------------------
            JOB DETAILS
        --------------------------------*/

        const hasJobData =
            companyName.trim() ||
            employmentStatus ||
            jobRole ||
            worklocation.trim() ||
            shiftType ||
            startTime.trim() ||
            endTime.trim();

        if (hasJobData) {
            if (!companyName.trim()) {
                setCompanyError("Please enter Company / College Name");
                valid = false;
            }

            if (!employmentStatus) {
                setEmploymentError("Please select Employment Status");
                valid = false;
            }

            if (!jobRole) {
                setJobRoleError("Please select Job Role");
                valid = false;
            }

            if (!worklocation.trim()) {
                setWorkLocationError("Please enter Work Location");
                valid = false;
            }

            if (!shiftType) {
                setShiftTypeError("Please select Shift Type");
                valid = false;
            }

            if (!startTime.trim()) {
                setStartTimeError("Please enter Shift From");
                valid = false;
            }

            if (!endTime.trim()) {
                setEndTimeError("Please enter Shift To");
                valid = false;
            }
        }

        /* -------------------------------
            GUARDIAN DETAILS
        --------------------------------*/

        guardians.forEach((item, index) => {
            const errors = {};

            const hasGuardianData =
                item.fullName?.trim() ||
                item.relationship ||
                item.occupation ||
                item.mobile?.trim();

            if (!hasGuardianData) {
                guardianValidation[index] = {};
                return;
            }

            if (!item.fullName?.trim()) {
                errors.fullName = "Please enter Guardian Name";
                valid = false;
            }

            if (!item.relationship) {
                errors.relationship = "Please select Relationship";
                valid = false;
            }

            if (!item.occupation) {
                errors.occupation = "Please select Occupation";
                valid = false;
            }

            if (!item.mobile?.trim()) {
                errors.mobile = "Please enter Mobile Number";
                valid = false;
            } else if (!/^[6-9]\d{9}$/.test(item.mobile)) {
                errors.mobile = "Enter valid Mobile Number";
                valid = false;
            }

            guardianValidation[index] = errors;
        });

        setGuardianErrors(guardianValidation);

        return valid;
    }
    const updateGuardian = (index, field, value) => {
        setGuardians(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return updated;
        });

        setGuardianErrors(prev => {
            const updated = [...prev];

            updated[index] = {
                ...(updated[index] || {}),
                [field]: "",
            };

            return updated;
        });
    }


    console.log("AADHAAR URI", aadhaarImage);
    console.log("PAN URI", pancardImage);


    const handleStepThree = async () => {
        if (!validateStepThree()) {
            return;
        }

        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;


        try {

            // const payload = {
            //     request: {
            //         firstName: basicDetails.firstName,
            //         lastName: basicDetails.lastName,
            //         mobile: basicDetails.mobile,
            //         emailId: basicDetails.email,

            //         joiningDate: joiningDate
            //             ? dayjs(joiningDate).format("DD-MM-YYYY")
            //             : "",

            //         bookingDate: purchaseDate
            //             ? dayjs(purchaseDate).format("DD-MM-YYYY")
            //             : "",

            //         bookingAmount: Number(bookingAmount || 0),

            //         floorId: floorSelected?.id || null,
            //         roomId: roomSelected?.id || null,
            //         bedId: bedSelected?.bedId || null,

            //         bankId: accountSelected?.bankingId || "",
            //         referenceNumber: referenceNumber || "",

            //         advanceAmount: Number(advanceAmount || 0),
            //         rentalAmount: Number(checkinrentalAmount || rentalAmount || 0),

            //         stayType: "LONG",

            //         deductions: extraCharges.map(item => ({
            //             type:
            //                 item.type === "Others"
            //                     ? item.title
            //                     : item.type,
            //             amount: Number(item.amount || 0),
            //         })),

            //         proRate: false,

            //         idProof: {
            //             type: IdproofType || "",
            //             number: IdprooNumber || "",
            //         },

            //         address: {
            //             flat: addressDetails.flat,
            //             house: "",
            //             building: "",
            //             company: "",
            //             apartment: "",
            //             area: addressDetails.area,
            //             street: "",
            //             sector: "",
            //             village: "",
            //             landmark: addressDetails.landmark,
            //             pincode: addressDetails.pincode,
            //             city: addressDetails.city,
            //             state: selectedState,
            //         },

            //         booking: {
            //             joiningDateTentative: "",
            //             refuseAdvanceAmount: refuseAdvanceAmount,
            //         },

            //         jobDetails: {
            //             employmentStatus: employmentStatus?.value || "",
            //             companyName: companyName || "",
            //             collegeName: "",
            //             jobRole: jobRole?.value || "",
            //             workLocation: worklocation || "",
            //             shiftType: shiftType?.value || "",
            //             shiftFrom: startTime || "",
            //             shiftTo: endTime || "",
            //         },

            //         guardians: guardians.map(item => ({
            //             guardianFullName: item.fullName,
            //             relationshipToTenant: item.relationship,
            //             guardianOccupation: item.occupation,
            //             mobileNo: item.mobile,
            //         })),

            //         shouldCollectFullRent: collectFullRent,
            //         customRent: Number(savedCustomRent || 0),
            //         oneTimeDeduction: [],

            //         vehicleDetails: {
            //             vehicleType: hasVehicle ? vehicleType : "",
            //             vehicleNumber: hasVehicle ? vehicleNumber : "",
            //             isParkingSpaceRequired: hasVehicle,
            //         },
            //     },
            // }

            const payload = {
                additionalData: {
                    jobDetails: {
                        employmentStatus: employmentStatus?.value || "",
                        companyName: companyName || "",
                        collegeName: companyName || "",
                        jobRole: jobRole?.value || "",
                        workLocation: worklocation || "",
                        shiftType: shiftType?.value || "",
                        shiftFrom: startTime || "",
                        shiftTo: endTime || "",
                    },

                    guardians: guardians.map(item => ({
                        guardianFullName: item.fullName || "",
                        relationshipToTenant: item.relationship || "",
                        guardianOccupation: item.occupation || "",
                        mobileNo: item.mobile || "",
                    })),
                },
            };



            // console.log("UPDATE", guardians);
            // console.log("UPDATE DRAFT", typeof hasVehicle, hasVehicle);
            // console.log("UPDATE DRAFT", typeof collectFullRent, collectFullRent);

            console.log("UPDATE DRAFT PAYLOAD", JSON.stringify(payload, null, 2));
            console.log("UPDATE DRAFT PAYLOAD", draftCustomerId)


            // const res = await UpdateAdditionalDraftDetails(
            //     activeHostelId,
            //     draftCustomerId,
            //     payload,
            // );

            const res = await UpdateAdditionalDraftDetails(
                activeHostelId,
                draftCustomerId,
                payload,
                aadhaarImage,
                pancardImage
            );

            console.log("updateres", res);


            if (res.success) {
                setModalType("success");
                setMessage(res?.data?.message || "Draft updated successfully");
                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false);
                    navigation.goBack();
                }, 800);
            } else {
                setModalType("error");
                setMessage(res?.message || "Draft update failed");
                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false);
                }, 800);
            }

        }
        finally {
            isSubmittingRef.current = false;
        }

    };


    const renderFooterButtons = () => {

        // STEP 1
        if (currentStep === 1) {
            return (

                <View style={styles.row}>

                    {isEditMode ?
                        <TouchableOpacity
                            style={[
                                styles.primaryBtn,

                            ]}
                            onPress={() => setCurrentStep(2)}
                        >
                            <Text style={styles.primaryText}>Next</Text>
                        </TouchableOpacity>
                        :
                        <View style={{ flex: 1 }}></View>
                    }




                    <TouchableOpacity
                        style={[
                            styles.primaryBtn,
                            isSubmittingRef.current && {
                                opacity: 0.5,
                            },
                        ]}
                        onPress={isEditMode ? UpdateDraft : handleBasicNext}
                    >
                        <Text style={styles.primaryText}>
                            {isEditMode ? "Update Draft" : "Save & Next"}
                        </Text>
                    </TouchableOpacity>
                </View>

            );
        }

        // STEP 2 BOOKING
        if (currentStep === 2 && activeTab === "Booking") {
            return (
                <View style={styles.row}>

                    {!hideBookingSaveDraft && (
                        <TouchableOpacity style={styles.secondaryBtn} onPress={UpdateDraft}>
                            <Text>Save Draft</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.primaryBtn,
                            hideBookingSaveDraft && { flex: 1 },
                            !proceedbook && styles.disabledBtn,
                        ]}
                        disabled={!proceedbook}
                        onPress={handleBookingSubmit}
                    >
                        <Text style={styles.primaryText}>Book</Text>
                    </TouchableOpacity>

                </View>
            );
        }

        // STEP 2 CHECKIN
        if (currentStep === 2 && activeTab === "CheckIn") {
            return (
                <View style={styles.row}>

                    {!hideCheckInSaveDraft && (
                        <TouchableOpacity style={styles.secondaryBtn} onPress={UpdateDraft}>
                            <Text>Save Draft</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.primaryBtn,
                            hideCheckInSaveDraft && { flex: 1 },
                            !proceedcheckin && styles.disabledBtn,
                        ]}
                        disabled={!proceedcheckin}
                        onPress={handleNextThird}
                    >
                        <Text style={styles.primaryText}>Next</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.primaryBtn,
                            hideCheckInSaveDraft && { flex: 1 },
                            !proceedcheckin && styles.disabledBtn,
                        ]}
                        disabled={!proceedcheckin}
                        onPress={handleCheckIn}
                    >
                        <Text style={styles.primaryText}>Check In</Text>
                    </TouchableOpacity>

                </View>
            );
        }

        // STEP 3
        return (
            <>


                <View style={styles.row}>
                    <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
                        <Text> Do it Later</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.primaryBtn,
                            isSubmittingRef.current && {
                                opacity: 0.5,
                            },
                        ]}
                        onPress={handleStepThree}

                    >
                        <Text style={styles.primaryText}>
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </>
        );
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

        setExtraCharges(updated);
        return valid;
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

    console.log('bedSelected', floorSelected);


    const handleNextThird = async () => {



        if (isCheckingIn) return;
        const chargeValid = validateExtraCharges();
        // const onetimechargevalid = validateOneTimeCharges()
        if (!chargeValid) return;
        // const customerId = CheckinTenantSelected?.customerId;


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
            if (!advanceAmount) {
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
            // const payload = {
            //     floorId: selectedBed.floorId,
            //     roomId: selectedBed.roomId,
            //     bedId: selectedBed.bedId,

            //     joiningDate: dayjs(checkJoiningDate).format("DD-MM-YYYY"),

            //     advanceAmount: Number(advanceAmount),
            //     rentalAmount: Number(rentalAmount),

            //     stayType: "SHORT",


            //     deductions: extraCharges.map((e) => ({
            //         type:
            //             e.type === "Others"
            //                 ? e.title.trim().toLowerCase()
            //                 : e.type.toLowerCase(),
            //         amount: Number(e.amount),
            //     })),
            // }

            const payload = {
                floorId: bedSelected?.floorId || floorSelected?.id,
                roomId: bedSelected?.roomId || roomSelected?.id,
                bedId: bedSelected?.bedId,

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

            const res = await TenantCheckIn(
                activeHostelId,
                draftCustomerId,
                payload
            );

            console.log("checkined", res)

            if (res.success) {
                setModalType("success");
                setMessage(res.data);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onBedAdded && onBedAdded(selectedBed.roomId)
                    setCurrentStep(3)
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



    const handleCheckIn = async () => {



        if (isCheckingIn) return;
        const chargeValid = validateExtraCharges();
        // const onetimechargevalid = validateOneTimeCharges()
        if (!chargeValid) return;
        // const customerId = CheckinTenantSelected?.customerId;


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
            if (!advanceAmount) {
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
            // const payload = {
            //     floorId: selectedBed.floorId,
            //     roomId: selectedBed.roomId,
            //     bedId: selectedBed.bedId,

            //     joiningDate: dayjs(checkJoiningDate).format("DD-MM-YYYY"),

            //     advanceAmount: Number(advanceAmount),
            //     rentalAmount: Number(rentalAmount),

            //     stayType: "SHORT",


            //     deductions: extraCharges.map((e) => ({
            //         type:
            //             e.type === "Others"
            //                 ? e.title.trim().toLowerCase()
            //                 : e.type.toLowerCase(),
            //         amount: Number(e.amount),
            //     })),
            // }

            const payload = {
                // floorId: bedSelected?.floorId,
                // roomId: bedSelected?.roomId,
                // bedId: bedSelected?.bedId,

                floorId: bedSelected?.floorId || floorSelected?.id,
                roomId: bedSelected?.roomId || roomSelected?.id,
                bedId: bedSelected?.bedId,
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

            const res = await TenantCheckIn(
                activeHostelId,
                draftCustomerId,
                payload
            );

            console.log("checkined", res)

            if (res.success) {
                setModalType("success");
                setMessage(res.data);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onBedAdded && onBedAdded(selectedBed.roomId)
                    navigation.goBack();
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

    const pickAadhaarImage = () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: "photo",
                selectionLimit: 0, // multiple images
            },
            (response) => {
                if (response.didCancel) return;

                if (response.assets?.length) {
                    const newFiles = response.assets;

                    setAadhaarAttachments((prev) => [
                        ...prev,
                        ...newFiles,
                    ]);

                    if (!aadhaarImage) {
                        setAadhaarImage(newFiles[0]);
                    }
                }
            }
        );
    }

    console.log("aadhaarImage", aadhaarImage);



    const pickPancardImage = () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: "photo",
                selectionLimit: 0, // multiple images
            },
            (response) => {
                if (response.didCancel) return;

                if (response.assets?.length) {
                    const newFiles = response.assets;

                    setPanCardAttachments((prev) => [
                        ...prev,
                        ...newFiles,
                    ]);

                    if (!pancardImage) {
                        setPanCardImage(newFiles[0]);
                    }
                }
            }
        );
    };

    const removeAadhaarImage = (index) => {
        const updated = aadhaarattachments.filter(
            (_, i) => i !== index
        );

        setAadhaarAttachments(updated);

        if (aadhaarImage?.uri === aadhaarattachments[index]?.uri) {
            setAadhaarImage(updated[0] || null);
        }
    }

    const removePancardImage = (index) => {
        const updated = pancardattachments.filter(
            (_, i) => i !== index
        );

        setPanCardAttachments(updated);

        if (pancardImage?.uri === pancardattachments[index]?.uri) {
            setPanCardImage(updated[0] || null);
        }
    }


    const today = dayjs();

    const isDisabledCheckInDate = (d) => {
        if (!d) return false;

        if (d.isAfter(today, "day")) return true;

        return false;
    };

    const checkInMarkedDates = {};

    for (let i = -90; i <= 90; i++) {
        const d = dayjs().add(i, "day");
        const key = d.format("YYYY-MM-DD");

        if (isDisabledCheckInDate(d)) {
            checkInMarkedDates[key] = {
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


    const isBookingDateDisabled = (d) => {
        if (!d) return false;

        if (d.isAfter(today, "day")) return true;

        return false;
    };

    const bookingMarkedDates = {};

    for (let i = -180; i <= 180; i++) {
        const d = dayjs().add(i, "day");
        const key = d.format("YYYY-MM-DD");

        if (isBookingDateDisabled(d)) {
            bookingMarkedDates[key] = {
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
    const isJoiningDateDisabled = (d) => {
        if (!d) return false;

        if (!purchaseDate) return true;

        if (d.isBefore(dayjs(purchaseDate), "day")) return true;

        return false;
    };
    const joiningMarkedDates = {};

    for (let i = -180; i <= 180; i++) {
        const d = dayjs().add(i, "day");
        const key = d.format("YYYY-MM-DD");

        if (isJoiningDateDisabled(d)) {
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
    const clearAllErrors = () => {
        // common
        setTenantsError("");

        // Booking errors
        setBookingDateError("");
        setJoiningDateError("");
        setBookingAmountError("");
        setBankError("");

        // CheckIn errors
        setRentalError("");
        setAdvanceError("");
        setCheckJoinDateError("");
        setStayTypeError("");
        setFloorError("");
        setRoomError("");
        setBedError("");
    };

    useEffect(() => {
        if (currentStep === 2) {
            clearAllErrors();
        }
    }, [currentStep]);

    const resetBookingState = () => {
        setPurchaseDate(null);
        setJoiningDate(null);
        setBookingAmount("");
        setAccountSelected(null);
        setReferenceNumber("");

        setCheckinTenantSelected(null);
        setCheckinTenantsopen(false);

        setOpenDropdownId(null);
    };
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
    };


    const summaryAdvanceAmount = Number(advanceAmount || 0);

    const deductionTotal = [...extraCharges].reduce(
        (total, item) => total + Number(item.amount || 0), 0)

    const summaryRent = Number(checkinrentalAmount || 0)

    const summaryAmount = summaryAdvanceAmount + deductionTotal + summaryRent;
    console.log(searchText);
    console.log(showTenantList);
    console.log(tenantList);




    return (
        <>
            <SuccessModal visible={showSuccess} message={message} type={modalType} />
            <View style={styles.container}>


                <View style={styles.header}>

                    <View style={{ flexDirection: 'row', }} >
                        <TouchableOpacity
                            onPress={handleBack} style={{ marginRight: 10, marginTop: 4 }}
                        >

                            <Image source={ArrowLeft} style={{ width: 20, height: 20 }} />

                        </TouchableOpacity>

                        <View>

                            <Text style={styles.headerTitle}>
                                {
                                    currentStep === 1
                                        ? "Basic Details"
                                        : currentStep === 2
                                            ? "Onboard"
                                            : "Documents & Job Details"
                                }
                            </Text>

                            <Text style={styles.subTitle}>
                                {
                                    currentStep === 1
                                        ? "Next : Onboard"
                                        : currentStep === 2
                                            ? "Next : Documents & Job Details"
                                            : ""
                                }
                            </Text>

                        </View>
                    </View>


                    <View style={styles.stepCircle}>
                        <Text>
                            {currentStep} / 3
                        </Text>
                    </View>

                </View>


                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    // behavior={Platform.OS === "ios" ? "padding" : undefined}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}


                >

                    <ScrollView
                        ref={scrollRef}
                        onScroll={(e) => {
                            currentScrollY.current = e.nativeEvent.contentOffset.y;
                        }}
                        scrollEventThrottle={16}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={!checkinTenantsOpen}


                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingHorizontal: 16,
                            paddingBottom: 80,
                        }}
                    >


                        {
                            currentStep === 1 && (


                                <View>
                                    <Text style={styles.label}>
                                        Search Mobile Number
                                    </Text>

                                    <View style={styles.searchBox}>

                                        <Image
                                            source={SearchIcon}
                                            style={styles.searchIcon}
                                        />

                                        <Text style={styles.country}>
                                            +91
                                        </Text>

                                        <ValidatedInput
                                            type="mobile"
                                            inputType="numeric"
                                            keyboardType="numeric"
                                            placeholder="Enter Mobile Number"
                                            value={searchText}
                                            onFocus={() => setShowTenantList(true)}
                                            onChangeText={(t) => {
                                                const value = t.replace(/[^0-9]/g, "").slice(0, 10)
                                                handleSearchCustomer(value);
                                            }}
                                            maxLength={10}
                                             style={{
                                            paddingHorizontal: 12,
                                            height: 50, fontSize: 14,  marginBottom: 1,
                                        }}
                                        />

                                    </View>
                                    {showTenantList && (
                                        <View style={styles.searchResultCard}>

                                            {tenantList.length > 0 ? (

                                                tenantList.map((item, index) => (

                                                    <View key={index}>
                                                        <TouchableOpacity
                                                            style={styles.tenantRow}
                                                            activeOpacity={0.8}
                                                            onPress={() => {
                                                                setShowTenantList(false);
                                                                setSearchText("");

                                                                setBasicDetails(prev => ({
                                                                    ...prev,
                                                                    firstName: item.firstName,
                                                                    lastName: item.lastName,
                                                                    mobile: item.mobile.replace("+91 ", ""),
                                                                    email: item.emailId,
                                                                }));
                                                                setSelectedImage(
                                                                    item?.profilePic
                                                                        ? { uri: item?.profilePic }
                                                                        : null
                                                                )

                                                                // setCustomerId(item.customerId);
                                                            }}>
                                                            {item.profilePic ? (
                                                                <Image
                                                                    source={{ uri: item.profilePic }}
                                                                    style={styles.avatar}
                                                                />
                                                            ) : (
                                                                <View style={styles.avatarPlaceholder}>
                                                                    <Text style={styles.avatarLetter}>
                                                                        {item.initials || item.fullName?.charAt(0)}
                                                                    </Text>
                                                                </View>
                                                            )}

                                                            <View style={{ flex: 1 }}>

                                                                <Text style={styles.name}>
                                                                    {item.fullName}
                                                                </Text>

                                                                <View style={{ marginTop: 6 }}>
                                                                    {highlightText(item?.mobile, searchText)}
                                                                </View>

                                                                <Text
                                                                    style={styles.info}
                                                                    numberOfLines={1}
                                                                >
                                                                    {item.emailId || "---"}
                                                                </Text>

                                                            </View>

                                                            {index !== filteredTenants.length - 1 && (
                                                                <View style={styles.divider} />
                                                            )}
                                                        </TouchableOpacity>
                                                    </View>

                                                ))

                                            ) : (

                                                <View style={styles.emptyContainer}>
                                                    <Text style={styles.emptyText}>
                                                        No Tenants are Exists using this Mobile Number
                                                    </Text>
                                                </View>

                                            )}

                                        </View>
                                    )}


                                    <Text style={{ fontSize: 13, color: '#747686', fontFamily: "Gilroy-Regular", marginTop: 10 }}>
                                        Search existing tenants in the Property flow ecosystem to auto-fill details.
                                    </Text>

                                    <View style={{ flexDirection: 'row', marginTop: 15 }}>

                                        <View style={styles.blueBar} />

                                        <Text style={styles.headerTitle}>
                                            Tenant Information
                                        </Text>

                                    </View>

                                    <View style={styles.profileSection}>


                                        <View style={styles.profileWrapper}>
                                            <Image
                                                source={selectedImage ? selectedImage : Profile}
                                                style={styles.profileImage}
                                            />

                                            <TouchableOpacity style={styles.editIconWrapper} onPress={() => setShowProfileSheet(true)}>
                                                <Image
                                                    source={require("../../Assets/Images/edit.png")}
                                                    style={styles.editIcon}
                                                />
                                            </TouchableOpacity>

                                        </View>

                                        {/* RIGHT SIDE - TEXT */}
                                        <View style={styles.profileTextBox}>
                                            <Text style={styles.profileTitle}>Profile Photo</Text>
                                            <Text style={styles.profileSub}>
                                                Add Profile Image of Vendor/Business.{"\n"}
                                                Max size of image 2 MB
                                            </Text>
                                        </View>

                                    </View>

                                    <Text style={styles.label}>First Name <Text style={{ color: "red" }}>*</Text></Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, paddingHorizontal: 12,
                                            height: 50, fontSize: 14, backgroundColor: "#fff", marginBottom: 1,
                                        }}
                                        placeholder="Enter First Name"
                                        placeholderTextColor="#A1A1A1"
                                        value={basicDetails.firstName}
                                        onFocus={(e) => scrollInputIntoView(e)}
                                        onChangeText={(t) => {
                                            const onlyLetters = t.replace(/[^a-zA-Z\s]/g, "");
                                            setBasicDetails({ ...basicDetails, firstName: onlyLetters });
                                            setNameError("")
                                        }}
                                    />
                                    {nameError && <ErrorMessage message={nameError} type="error" />}
                                    <Text style={[styles.label, { marginTop: 12 }]}>Last Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Last Name"
                                        placeholderTextColor="#A1A1A1"
                                        value={basicDetails.lastName}
                                        onChangeText={(t) => {
                                            const onlyLetters = t.replace(/[^a-zA-Z\s]/g, "");
                                            setBasicDetails({ ...basicDetails, lastName: onlyLetters });
                                        }}
                                        onFocus={(e) => scrollInputIntoView(e)}
                                    />

                                    <Text style={styles.label}>Mobile Number <Text style={{ color: "red" }}>*</Text></Text>
                                    <View style={styles.mobileWrapper}>
                                        <View style={{ position: "relative" }}>
                                            <TouchableOpacity
                                                style={styles.countryDropdown}
                                                onPress={() => setCountryOpen(!countryOpen)}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={styles.countryCodeText}>
                                                    {selectedCountry.code}
                                                </Text>
                                                <Image source={DownArrow} style={styles.countryArrow} />
                                            </TouchableOpacity>


                                        </View>

                                        <TextInput
                                            // style={styles.mobileInput}
                                                style={{
                                            paddingHorizontal: 12,
                                            height: 50, fontSize: 14,  marginBottom: 1,
                                        }}
                                            keyboardType="number-pad"
                                            placeholder="Enter Mobile Number"
                                            placeholderTextColor="#A1A1A1"
                                            maxLength={10}
                                            value={basicDetails.mobile}
                                            onChangeText={(t) => {
                                                setBasicDetails({
                                                    ...basicDetails,
                                                    mobile: t.replace(/[^0-9]/g, ""),
                                                });
                                                setMobileError("");
                                            }}
                                            onFocus={(e) => scrollInputIntoView(e)}

                                        />

                                    </View>
                                    {mobileError && <ErrorMessage message={mobileError} type="error" />}
                                    <Text style={[styles.label, { marginTop: 12 }]}>Email ID</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Email ID"
                                        placeholderTextColor="#A1A1A1"
                                        value={basicDetails.email}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        onChangeText={(text) => {
                                            const sanitized = text
                                                .toLowerCase()
                                                .replace(/[^a-z0-9@._+-]/g, "").replace(/\.{2,}/g, ".");

                                            setBasicDetails(prev => ({ ...prev, email: sanitized }));

                                            if (!sanitized) {
                                                setEmailError("");
                                            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(sanitized)) {
                                                setEmailError("Enter a valid email address");
                                            } else {
                                                setEmailError("");
                                            }
                                        }}
                                        onFocus={(e) => scrollInputIntoView(e)}
                                    />

                                    {emailError && <ErrorMessage message={emailError} type="error" />}



                                    <View style={{ position: "relative" }}>
                                        <Text style={styles.label}>
                                            ID Proof Type
                                        </Text>

                                        {/* INPUT */}
                                        <TouchableOpacity
                                            style={styles.inputBox}
                                            onPress={() => {
                                                setShowIdProofType(v => !v);
                                            }}
                                        >
                                            <Text style={{ fontSize: 15 }}>
                                                {IdproofType
                                                    ? idProofOptions.find(o => o.value === IdproofType)?.label
                                                    : "Select ID Proof"}
                                            </Text>

                                            <Image
                                                source={DownArrow}
                                                style={{ width: 18, height: 18, tintColor: "#555" }}
                                            />
                                        </TouchableOpacity>

                                        {/* DROPDOWN */}
                                        {ShowIdproofType && (
                                            <View style={styles.transactiondropdown}>
                                                <ScrollView
                                                    nestedScrollEnabled
                                                    scrollEnabled={idProofOptions.length > 3}
                                                    showsVerticalScrollIndicator={false}
                                                >
                                                    {idProofOptions.map(opt => {
                                                        const isSelected = IdproofType === opt.value;

                                                        return (
                                                            <TouchableOpacity
                                                                key={opt.value}
                                                                style={[
                                                                    styles.dropdownRow,
                                                                    isSelected && styles.dropdownRowSelected,
                                                                ]}
                                                                onPress={() => {
                                                                    setIdProofType(opt.value);
                                                                    setShowIdProofType(false);
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

                                    </View>

                                    <Text style={styles.label}>
                                        ID Proof No
                                    </Text>

                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter Number"
                                        placeholderTextColor="#9CA3AF"
                                        value={IdprooNumber}
                                        onChangeText={(t) => {
                                            const sanitized = t.replace(/[^a-zA-Z0-9\s]/g, "");
                                            setIdProofNumber(sanitized)
                                        }}
                                        onFocus={(e) => scrollInputIntoView(e)}
                                    />


                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginTop: 30,
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <View style={styles.blueBar} />

                                            <Text style={styles.headerTitle}>
                                                Address Details
                                            </Text>
                                        </View>

                                        {/* <TouchableOpacity
                                            style={styles.doLaterContainer}
                                            activeOpacity={0.8}
                                            onPress={() => setDoItLater(!doItLater)}
                                        >
                                            <View
                                                style={[
                                                    styles.checkbox,
                                                    doItLater && styles.checkboxSelected,
                                                ]}
                                            >
                                                {doItLater && (
                                                    <Text style={styles.tick}>✓</Text>
                                                )}
                                            </View>

                                            <Text style={styles.doLater}>
                                                Do it Later
                                            </Text>
                                        </TouchableOpacity> */}
                                    </View>


                                    <View style={styles.form}>
                                        <Text style={styles.label}>Flat, House no., Building </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Flat, House no., Building..."
                                            placeholderTextColor="#9CA3AF"
                                            value={addressDetails.flat}
                                            onChangeText={(t) => {
                                                const sanitized = t.replace(/[^a-zA-Z0-9\s\-&/]/g, "");
                                                setAddressDetails({ ...addressDetails, flat: sanitized });
                                            }}
                                            onFocus={(e) => scrollInputIntoView(e)}
                                        />
                                        <Text style={styles.label}>Area , Street , Sector , Village</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Area"
                                            placeholderTextColor="#9CA3AF"
                                            value={addressDetails.area}
                                            onChangeText={(t) => {
                                                const sanitized = t.replace(/[^a-zA-Z0-9\s\-/]/g, "");
                                                setAddressDetails({ ...addressDetails, area: sanitized })
                                            }}
                                            onFocus={(e) => scrollInputIntoView(e)}
                                        />


                                        <Text style={styles.label}>Landmark</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Ex : Near SBI Bank"
                                            placeholderTextColor="#9CA3AF"
                                            value={addressDetails.landmark}
                                            onChangeText={(t) => {
                                                const sanitized = t.replace(/[^a-zA-Z0-9\s]/g, "");
                                                setAddressDetails({ ...addressDetails, landmark: sanitized })
                                            }}
                                            onFocus={(e) => scrollInputIntoView(e)}
                                        />

                                        <Text style={styles.label}>Pincode</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="123456"
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            value={addressDetails.pincode}
                                            onFocus={(e) => scrollInputIntoView(e)}
                                            onChangeText={(t) => {
                                                const value = t.replace(/[^0-9]/g, "");
                                                setAddressDetails({
                                                    ...addressDetails,
                                                    pincode: value,
                                                });

                                                if (!value) {
                                                    setPincodeError("");
                                                } else if (value.startsWith("0")) {
                                                    setPincodeError("Pincode should not start with 0");
                                                } else if (value.length !== 6) {
                                                    setPincodeError("Pincode must be 6 digits");
                                                } else {
                                                    setPincodeError("");
                                                }
                                            }}
                                        // onChangeText={(t) => {
                                        //     const value = t.replace(/[^0-9]/g, "");

                                        //     setAddressDetails({
                                        //         ...addressDetails,
                                        //         pincode: value,
                                        //     });


                                        //     if (!value) {
                                        //         setPincodeError("");
                                        //     } else if (value.startsWith("0")) {
                                        //         setPincodeError("Pincode should not start with 0");
                                        //     } else if (value.length < 6) {
                                        //         setPincodeError("Pincode must be 6 digits");
                                        //     } else {
                                        //         setPincodeError("");
                                        //     }
                                        // }}

                                        />
                                        {pincodeError && <ErrorMessage message={pincodeError} type="error" />}

                                        <Text style={styles.label}>City</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Your City Name"
                                            placeholderTextColor="#9CA3AF"
                                            value={addressDetails.city}
                                            onChangeText={(t) => {
                                                const sanitized = t.replace(/[^a-zA-Z\s]/g, "");
                                                setAddressDetails({ ...addressDetails, city: sanitized })
                                            }}
                                            onFocus={(e) => scrollInputIntoView(e)}
                                        />


                                        <Text style={styles.label}>State</Text>

                                        <View style={{ position: "relative" }}>
                                            <TextInput
                                                style={styles.select}
                                                placeholder="Select state"
                                                placeholderTextColor="#9CA3AF"
                                                value={stateOpen ? stateQuery : selectedState}

                                                onFocus={(e) => {
                                                    scrollInputIntoView(e)
                                                    setStateOpen(true);
                                                    setStateQuery("");   // 🔥 cursor focus panna fresh search
                                                }}
                                                onChangeText={(t) => {
                                                    const sanitized = t.replace(/[^a-zA-Z\s]/g, "");
                                                    setStateQuery(sanitized);    // 🔥 typing always search
                                                    setStateOpen(true);
                                                }}

                                            />


                                            <TouchableOpacity
                                                style={styles.arrowTouch}
                                                activeOpacity={0.7}
                                                onPress={() => {
                                                    Keyboard.dismiss();  // ✅ keyboard hide
                                                    setStateOpen((prev) => !prev);

                                                    // ✅ close pannumbothu query reset
                                                    if (stateOpen) setStateQuery("");
                                                }}
                                            >
                                                <Image source={DownArrow} style={styles.arrowIconImg} />
                                            </TouchableOpacity>


                                            {stateOpen && (
                                                <>
                                                    <TouchableWithoutFeedback
                                                        onPress={() => {
                                                            setStateOpen(false);
                                                            setStateQuery("");
                                                        }}
                                                    >
                                                        <View style={{
                                                            position: "absolute",
                                                            top: -1000,
                                                            left: -1000,
                                                            right: -1000,
                                                            bottom: -1000,
                                                            backgroundColor: "transparent",
                                                            zIndex: 999,
                                                        }} />
                                                    </TouchableWithoutFeedback>

                                                    <View style={{
                                                        borderWidth: 1,
                                                        borderColor: "#ddd",
                                                        borderRadius: 12,
                                                        zIndex: 1000,
                                                        marginTop: 6,
                                                        maxHeight: 250,
                                                        backgroundColor: "#fff",
                                                    }}>
                                                        <ScrollView
                                                            keyboardShouldPersistTaps="always"
                                                            nestedScrollEnabled={true}
                                                            showsVerticalScrollIndicator={true}
                                                        >
                                                            {filteredStateList.length > 0 ? (
                                                                filteredStateList.map((v, index) => (
                                                                    <TouchableOpacity
                                                                        key={index}
                                                                        style={[styles.option, selectedState === v.label
                                                                            && { backgroundColor: "#E6F0FF" }]}
                                                                        onPress={() => {
                                                                            setSelectedState(v.label);
                                                                            setStateQuery("");
                                                                            setStateOpen(false);
                                                                        }}
                                                                    >
                                                                        {console.log(v)}
                                                                        <Text style={styles.optionText}>{v.label}</Text>
                                                                    </TouchableOpacity>
                                                                ))
                                                            ) : (
                                                                <Text style={styles.noResult}>No state found</Text>
                                                            )}

                                                            {/* 🔴 CLEAR OPTION */}
                                                            {selectedState && (
                                                                <TouchableOpacity
                                                                    style={{ padding: 12, alignItems: "center" }}
                                                                    onPress={() => {
                                                                        setSelectedState("");
                                                                        setStateQuery("");
                                                                        setStateOpen(false);
                                                                    }}
                                                                >
                                                                    <Text style={{ color: "red", fontFamily: "Gilroy-Semibold" }}>
                                                                        Clear selection
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            )}
                                                        </ScrollView>
                                                    </View>
                                                </>
                                            )}

                                        </View>







                                    </View>



                                    {/* <View style={styles.btnRow}>
                                            <TouchableOpacity
                                                style={styles.secondaryBtn}
                                                onPress={() => setStep(1)}
                                            >
                                                <Text style={styles.secondaryText}>Previous</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    styles.primaryBtn,
                                                    !isAddressValid && styles.primaryBtnDisabled
                                                ]}
                                                disabled={!isAddressValid || isSubmitClicked}
                                                onPress={handleCreateTenant}
                                            >

                                                <Text
                                                    style={[styles.primaryText,]}
                                                >
                                                   Save & Next
                                                </Text>
                                            </TouchableOpacity>
                                        </View> */}



                                </View>

                            )
                        }

                        {
                            currentStep === 2 && (
                                <>

                                    <View style={styles.tabRow}>

                                        <TouchableOpacity
                                            style={[styles.tab, activeTab === "Booking" && styles.tabActive]}
                                            onPress={() => {
                                                setActiveTab("Booking");
                                                setCheckinTenantSelected(null);
                                                setCheckinTenantsopen(false);
                                                setTenantsError("")
                                                setcheckJoiningDate(null)
                                                setCheckinRentalAmount("")
                                                setAdvanceAmount("");
                                                clearAllErrors();
                                                resetCheckInState();
                                                clearAllErrors();
                                                setFloorSelected(null)
                                                setRoomSelected(null)
                                                setBedSelected(null)

                                            }}

                                        >
                                            <Text style={[styles.tabText, activeTab === "Booking" && styles.tabTextActive]}>
                                                Booking
                                            </Text>
                                        </TouchableOpacity>


                                        <TouchableOpacity
                                            style={[styles.tab, activeTab === "CheckIn" && styles.tabActive]}
                                            onPress={() => {
                                                setActiveTab("CheckIn");
                                                setCheckinTenantSelected(null);
                                                setCheckinTenantsopen(false);
                                                setJoiningDate(null)
                                                setRentalAmount("")
                                                setCheckinRentalAmount("")
                                                setAdvanceAmount("");
                                                setTenantsError("")
                                                clearAllErrors();
                                                resetBookingState();
                                                clearAllErrors();
                                                setFloorSelected(null)
                                                setRoomSelected(null)
                                                setBedSelected(null)
                                            }}

                                        >
                                            <Text style={[styles.tabText, activeTab === "CheckIn" && styles.tabTextActive]}>
                                                Check-In
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                    {activeTab === "Booking" && (
                                        <>


                                            <Text style={styles.label}>Booking Date <Text style={{ color: "red" }}>*</Text></Text>
                                            <View ref={bookingDateRef} collapsable={false}>
                                                <TouchableOpacity
                                                    style={styles.dateBox}
                                                    onPress={() => {
                                                        Keyboard.dismiss();   // 🔥 keyboard close
                                                        setOpenDropdownId(null);
                                                        setCheckinTenantsopen(false);

                                                        setTimeout(() => {
                                                            bookingDateRef.current.measureInWindow((x, y, w, h) => {
                                                                setDatePickerTop(getSafeCalendarTop(y, h));
                                                                setActiveDateField("booking");
                                                                setShowCalendar(true);
                                                            });
                                                        }, 150); // 🔥 keyboard animation wait
                                                    }}

                                                >
                                                    <Text style={styles.placeholder}>
                                                        {purchaseDate ? dayjs(purchaseDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                                                    </Text>
                                                    <Image source={require("../../Assets/Images/calendar.png")} style={styles.icon} />
                                                </TouchableOpacity>
                                            </View>

                                            {bookingDateError && (
                                                <ErrorMessage message={bookingDateError} type="error" />
                                            )}
                                            <Text style={styles.label}>Booking Amount <Text style={{ color: "red" }}>*</Text></Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter Amount"
                                                keyboardType="numeric"
                                                value={bookingAmount}
                                                // onChangeText={setBookingAmount}
                                                onChangeText={(text) => {
                                                    const onlyNum = text.replace(/[^0-9]/g, "");
                                                    setBookingAmount(onlyNum);
                                                    setBookingAmountError("");
                                                }}
                                                onFocus={(e) => scrollInputIntoView(e)}
                                            />
                                            {bookingAmountError && (
                                                <ErrorMessage message={bookingAmountError} type="error" />
                                            )}

                                            <Text style={styles.label}>Joining Date <Text style={{ color: "red" }}>*</Text></Text>
                                            <View ref={joiningDateRef} collapsable={false}>
                                                <TouchableOpacity
                                                    style={styles.dateBox}
                                                    onPress={() => {
                                                        Keyboard.dismiss();        // 🔥 keyboard close
                                                        setOpenDropdownId(null);
                                                        setCheckinTenantsopen(false);

                                                        setTimeout(() => {
                                                            joiningDateRef.current.measureInWindow((x, y, w, h) => {
                                                                setDatePickerTop(getSafeCalendarTop(y, h));
                                                                setActiveDateField("joining");
                                                                setShowCalendar(true);
                                                            });
                                                        }, 150);                  // 🔥 wait for keyboard animation
                                                    }}
                                                >
                                                    <Text style={styles.placeholder}>
                                                        {joiningDate ? dayjs(joiningDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                                                    </Text>
                                                    <Image source={require("../../Assets/Images/calendar.png")} style={styles.icon} />
                                                </TouchableOpacity>
                                            </View>

                                            {joiningDateError && (
                                                <ErrorMessage message={joiningDateError} type="error" />
                                            )}

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' }}>
                                                <Text>Select Stay Details <Text style={{ color: "red" }}>*</Text></Text>
                                                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#EDF3FF', padding: 10, paddingHorizontal: 10 }}
                                                    onPress={handleshowBedDetailsheet}>

                                                    <Image source={BedIcon} style={{ height: 20, width: 20, marginRight: 10 }} />

                                                    <Text style={{ color: '#1E45E1' }}>Bed Layout View</Text>
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
                                                                    onPress={() => {

                                                                        setFloorSelected(f);
                                                                        setOpenDropdown(null);

                                                                        setRoomSelected(null);
                                                                        setBedSelected(null);
                                                                        setRooms([]);

                                                                        setFloorError("")
                                                                        loadRoomsByFloor(f?.id);
                                                                        loadRooms(f?.id);
                                                                    }}


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
                                                                        onPress={() => {
                                                                            setRoomSelected(r);
                                                                            setOpenDropdown(null);
                                                                            setBedSelected(null);
                                                                            setRoomError("")
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


                                            {/* <Text style={styles.label}>Total Rent <Text style={{ color: "red" }}>*</Text></Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={
                                                    selectedBed?.rentAmount
                                                        ? String(selectedBed.rentAmount)
                                                        : "Enter Amount"
                                                }
                                                placeholderTextColor="#9CA3AF"
                                                keyboardType="numeric"
                                                value={rentalAmount}
                                                onChangeText={(text) => {
                                                    const onlyNum = text.replace(/[^0-9]/g, "");
                                                    setRentalAmount(onlyNum);
                                                    setRentalError("");
                                                }}

                                            />
                                            {rentalError && (
                                                <ErrorMessage message={rentalError} type="error" />
                                            )} */}






                                            <Text style={styles.label}>Mode Of Transaction <Text style={{ color: "red" }}>*</Text></Text>
                                            <View style={{ position: "relative" }}>
                                                <TouchableOpacity
                                                    onPress={() => setAccountopen(!accountOpen)}
                                                    style={styles.inputBox}
                                                >

                                                    <Text style={styles.selectText}>
                                                        {accountSelected
                                                            ? `${accountSelected.accountHolderName} - ${accountSelected.accountType}`
                                                            : "Select Bank"}
                                                    </Text>
                                                    <Image source={DownArrow} style={styles.arrow} />
                                                </TouchableOpacity>
                                                {bankError && (
                                                    <ErrorMessage message={bankError} type="error" />
                                                )}


                                                {accountOpen && (
                                                    <View style={styles.dropdownMenu}>
                                                        <ScrollView style={{ maxHeight: 150 }}>
                                                            {AccountsList.map((v, i) => (
                                                                <TouchableOpacity
                                                                    key={i}
                                                                    style={styles.option}
                                                                    onPress={() => {
                                                                        setAccountSelected(v);
                                                                        setAccountopen(false);
                                                                        setBankError("")
                                                                    }}
                                                                >
                                                                    <Text style={styles.optionText}>{v.accountHolderName}-{v.accountType}</Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </ScrollView>
                                                    </View>
                                                )}


                                                <Text style={styles.label}>Transaction Id</Text>

                                                <TextInput
                                                    ref={transactionRef}
                                                    style={styles.inputBox}
                                                    placeholder="Enter Transaction Id"
                                                    value={referenceNumber}
                                                    // onFocus={() => scrollInputIntoView(transactionRef)}

                                                    onChangeText={(text) => {

                                                        const noEmojis = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "");
                                                        setReferenceNumber(noEmojis);
                                                    }}
                                                    onFocus={(e) => scrollInputIntoView(e)}
                                                />


                                                <TouchableOpacity
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center", marginTop: 10
                                                    }}
                                                    activeOpacity={0.8}
                                                    onPress={() => setProceedBook(prev => !prev)}
                                                >
                                                    <View
                                                        style={[
                                                            styles.checkbox,
                                                            proceedbook && styles.checkboxSelected,
                                                        ]}
                                                    >
                                                        {proceedbook && (
                                                            <Text style={styles.tick}>✓</Text>
                                                        )}
                                                    </View>

                                                    <Text style={styles.doLater}>
                                                        Everything is Correct – Proceed to Book
                                                    </Text>
                                                </TouchableOpacity>


                                            </View>




                                        </>

                                    )}


                                    {activeTab === "CheckIn" && (
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
                                                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#EDF3FF', padding: 10, paddingHorizontal: 10 }}
                                                    onPress={handleshowBedDetailsheet} >

                                                    <Image source={BedIcon} style={{ height: 20, width: 20, marginRight: 10 }} />

                                                    <Text style={{ color: '#1E45E1' }}>Bed Layout View</Text>
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
                                                                    onPress={() => {

                                                                        setFloorSelected(f);
                                                                        setOpenDropdown(null);

                                                                        setRoomSelected(null);
                                                                        setBedSelected(null);
                                                                        setRooms([]);

                                                                        setFloorError("")
                                                                        loadRoomsByFloor(f?.id);
                                                                        loadRooms(f?.id);
                                                                    }}


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
                                                                        onPress={() => {
                                                                            setRoomSelected(r);
                                                                            setOpenDropdown(null);
                                                                            setBedSelected(null);
                                                                            setRoomError("")
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
                                                <Text style={styles.switchLabel}>
                                                    Do you want to refuse advance amount?
                                                </Text>

                                                <Switch
                                                    value={refuseAdvanceAmount}
                                                    onValueChange={(value) => {
                                                        setRefuseAdvanceAmount(value);

                                                        // Optional: refuse ON na amount clear pannalam
                                                        if (value) {
                                                            setAdvanceAmount("");
                                                            setAdvanceError("");
                                                            setExtraCharges([]);
                                                            setOpenDropdownId(null)
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
                                                onFocus={(e) => scrollInputIntoView(e)}
                                            />
                                            {/* <TextInput
                                                style={styles.input}
                                                placeholder="Enter Amount"
                                                placeholderTextColor="#9CA3AF"
                                                keyboardType="numeric"
                                                value={advanceAmount}
                                                onChangeText={(text) => {
                                                    const onlyNum = text.replace(/[^0-9]/g, "");
                                                    setAdvanceAmount(onlyNum);
                                                    setAdvanceError("");
                                                }}
                                            /> */}
                                            {advanceError && (
                                                <ErrorMessage message={advanceError} type="error" />
                                            )}
                                        </>
                                    )}

                                    {activeTab === "CheckIn" && (

                                        <>
                                            <View style={styles.nonRefund}>
                                                <View style={styles.extraHeader}>
                                                    <Text style={{ fontWeight: "600", color: "#444", marginBottom: 1 }}>Deductions</Text>

                                                    {/* <TouchableOpacity style={styles.addBtn} onPress={addCharge}>
                                                        <Text style={{ color: "#fff", fontWeight: "600" }}>Add</Text>
                                                    </TouchableOpacity> */}
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
                                                                    onFocus={(e) => {
                                                                        setOpenDropdownId(null);
                                                                        // scrollInputIntoView(inputRefs.current[`reason-${item.id}`]);
                                                                        scrollInputIntoView(e)
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
                                                                    onFocus={(e) => {
                                                                        setOpenDropdownId(null);
                                                                        scrollInputIntoView(e)
                                                                        // scrollInputIntoView(inputRefs.current[`amount-${item.id}`]);
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

                                                    disabled={refuseAdvanceAmount}
                                                    style={[
                                                        styles.addNewButton,
                                                        refuseAdvanceAmount && { opacity: 0.5 }
                                                    ]}
                                                    // style={styles.addNewButton}
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
                                                {/* Note : This amount sets your current opening balance. Double-check this figure, as an incorrect balance will miscalculate the final total. */}
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
                                                onFocus={(e) => scrollInputIntoView(e)}

                                            />
                                            {rentalError && (
                                                <ErrorMessage message={rentalError} type="error" />
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
                                                        <Image source={(showCustomRentEditor || isCustomRentSaved) ? RemoveIcon : DirectionBottom} style={{ height: 8, width: 8, marginLeft: 13 }} />
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
                                                                            onFocus={(e) => scrollInputIntoView(e)}
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
                                                    style={styles.addNewButton}
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

                                        </>
                                    )}





                                    {/* <View style={styles.footer}>
                                        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                                            <Text style={styles.cancelText}>Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={[styles.submitBtn, isCheckingIn && { opacity: 0.4 }]}
                                            //  onPress={handleCheckIn}
                                            disabled={isCheckingIn}
                                            onPress={activeTab === "Booking" ? handleBookingSubmit : handleCheckIn}

                                        >
                                            <Text style={styles.submitText}>
                                                {activeTab === "Booking" ? "Book" : "Check-In"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View> */}

                                </>
                            )
                        }

                        {
                            currentStep === 3 && (
                                <>
                                    <View>
                                        <View style={styles.sectionHeader}>
                                            <View style={styles.blueBar} />
                                            <Text style={styles.headerTitle}>
                                                Upload Documents
                                            </Text>
                                        </View>


                                        {aadhaarattachments.length === 0 ? (
                                            // <TouchableOpacity
                                            //   style={styles.uploadBox}
                                            //   onPress={pickImage}
                                            // >
                                            //   <Text style={styles.uploadText}>
                                            //    Aadhaar Card
                                            //   </Text>
                                            //    <Text style={styles.uploadText}>
                                            //   PDF , JPG UPTO 3 MB
                                            //   </Text>
                                            // </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.uploadCard}
                                                activeOpacity={0.8}
                                                onPress={pickAadhaarImage}
                                            >

                                                <View style={styles.uploadIconBox}>
                                                    <Image
                                                        source={UplodIcon}
                                                        style={styles.uploadIcon}
                                                    />
                                                </View>

                                                <Text style={styles.uploadTitle}>
                                                    Aadhaar Card
                                                </Text>

                                                <Text style={styles.uploadSubTitle}>
                                                    PDF, JPG UP TO 3MB
                                                </Text>

                                            </TouchableOpacity>
                                        ) : (
                                            <>
                                                {/* Main Preview */}

                                                <View style={styles.previewCard}>
                                                    <Image
                                                        source={{ uri: aadhaarImage?.uri }}
                                                        style={styles.previewImage}
                                                    />

                                                    <View style={styles.fileInfoRow}>
                                                        <View>
                                                            <Text style={styles.fileName}>
                                                                {aadhaarImage?.fileName}
                                                            </Text>

                                                            <Text style={styles.fileSize}>
                                                                {(
                                                                    (aadhaarImage?.fileSize || 0) /
                                                                    1024
                                                                ).toFixed(0)}{" "}
                                                                KB
                                                            </Text>
                                                        </View>

                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                const index =
                                                                    aadhaarattachments.findIndex(
                                                                        (item) =>
                                                                            item.uri ===
                                                                            aadhaarImage.uri
                                                                    );

                                                                removeAadhaarImage(index);
                                                            }}
                                                            style={styles.deleteBtn}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: "#FF4D4F",
                                                                    fontSize: 20,
                                                                }}
                                                            >
                                                                ✕
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                                {/* Thumbnail List */}

                                                {/* <View style={styles.thumbnailRow}>
                                                    <ScrollView
                                                        horizontal
                                                        showsHorizontalScrollIndicator={
                                                            false
                                                        }
                                                    >
                                                        {aadhaarattachments.map(
                                                            (item, index) => (
                                                                <TouchableOpacity
                                                                    key={index}
                                                                    onPress={() =>
                                                                        setAadhaarImage(item)
                                                                    }
                                                                >
                                                                    <Image
                                                                        source={{
                                                                            uri: item.uri,
                                                                        }}
                                                                        style={[
                                                                            styles.thumbImage,
                                                                            aadhaarImage?.uri ===
                                                                            item.uri && {
                                                                                borderColor:
                                                                                    "#2D5BFF",
                                                                                borderWidth: 2,
                                                                            },
                                                                        ]}
                                                                    />
                                                                </TouchableOpacity>
                                                            )
                                                        )}
                                                    </ScrollView>

                                                    <TouchableOpacity
                                                        onPress={pickAadhaarImage}
                                                    >
                                                        <Text style={styles.addMore}>
                                                            + Add more Files
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View> */}
                                            </>
                                        )}

                                        {pancardattachments.length === 0 ? (
                                            <TouchableOpacity
                                                style={styles.uploadCard}
                                                activeOpacity={0.8}
                                                onPress={pickPancardImage}
                                            >

                                                <View style={styles.uploadIconBox}>
                                                    <Image
                                                        source={UplodIcon}
                                                        style={styles.uploadIcon}
                                                    />
                                                </View>

                                                <Text style={styles.uploadTitle}>
                                                    Pancard Copy
                                                </Text>

                                                <Text style={styles.uploadSubTitle}>
                                                    PDF, JPG UP TO 3MB
                                                </Text>

                                            </TouchableOpacity>
                                        ) : (
                                            <>
                                                {/* Main Preview */}

                                                <View style={styles.previewCard}>
                                                    <Image
                                                        source={{ uri: pancardImage?.uri }}
                                                        style={styles.previewImage}
                                                    />

                                                    <View style={styles.fileInfoRow}>
                                                        <View>
                                                            <Text style={styles.fileName}>
                                                                {pancardImage?.fileName}
                                                            </Text>

                                                            <Text style={styles.fileSize}>
                                                                {(
                                                                    (pancardImage?.fileSize || 0) /
                                                                    1024
                                                                ).toFixed(0)}{" "}
                                                                KB
                                                            </Text>
                                                        </View>

                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                const index =
                                                                    pancardattachments.findIndex(
                                                                        (item) =>
                                                                            item.uri ===
                                                                            pancardImage.uri
                                                                    );

                                                                removePancardImage(index);
                                                            }}
                                                            style={styles.deleteBtn}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: "#FF4D4F",
                                                                    fontSize: 20,
                                                                }}
                                                            >
                                                                ✕
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                                {/* Thumbnail List */}

                                                {/* <View style={styles.thumbnailRow}>
                                                    <ScrollView
                                                        horizontal
                                                        showsHorizontalScrollIndicator={
                                                            false
                                                        }
                                                    >
                                                        {pancardattachments.map(
                                                            (item, index) => (
                                                                <TouchableOpacity
                                                                    key={index}
                                                                    onPress={() =>
                                                                        setPanCardImage(item)
                                                                    }
                                                                >
                                                                    <Image
                                                                        source={{
                                                                            uri: item.uri,
                                                                        }}
                                                                        style={[
                                                                            styles.thumbImage,
                                                                            pancardImage?.uri ===
                                                                            item.uri && {
                                                                                borderColor:
                                                                                    "#2D5BFF",
                                                                                borderWidth: 2,
                                                                            },
                                                                        ]}
                                                                    />
                                                                </TouchableOpacity>
                                                            )
                                                        )}
                                                    </ScrollView>

                                                    <TouchableOpacity
                                                        onPress={pickPancardImage}
                                                    >
                                                        <Text style={styles.addMore}>
                                                            + Add more Files
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View> */}
                                            </>
                                        )}

                                        <View style={styles.infoCard}>

                                            <Image
                                                source={require("../../Assets/Images/InfoIcon.png")}
                                                style={styles.infoIcon}
                                            />

                                            <View style={{ flex: 1 }}>

                                                <Text style={styles.infoText}>
                                                    Identity documents are encrypted and stored securely.
                                                </Text>

                                                <Text style={[styles.infoText, { marginTop: 4 }]}>
                                                    Verification typically takes 2–4 hours after submission.
                                                </Text>

                                            </View>

                                        </View>


                                        <View style={styles.sectionHeader}>
                                            <View style={styles.blueBar} />
                                            <Text style={styles.headerTitle}>
                                                Parent/Guardian Details
                                            </Text>
                                        </View>



                                        {guardians.map((item, index) => (
                                            <View
                                                key={index}
                                                style={styles.guardianCard}
                                            >
                                                {/* Header */}

                                                <View style={styles.cardHeader}>
                                                    <Text style={styles.cardTitle}>
                                                        Item {String(index + 1).padStart(2, "0")}
                                                    </Text>

                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setGuardians(prev =>
                                                                prev.filter(x => x.id !== item.id)
                                                            )
                                                        }
                                                    >
                                                        <Image
                                                            source={require("../../Assets/Images/DeleteIcon.png")}
                                                            style={{ width: 18, height: 18 }}
                                                        />
                                                    </TouchableOpacity>
                                                </View>


                                                <Text style={styles.label}>Guardian Full Name </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter name"
                                                    value={item.fullName}
                                                    onChangeText={(text) => {
                                                        updateGuardian(
                                                            index,
                                                            "fullName",
                                                            text.replace(/[^A-Za-z\s]/g, "")
                                                        );
                                                    }}
                                                    onFocus={(e) => scrollInputIntoView(e)}

                                                />

                                                {guardianErrors[index]?.fullName && (
                                                    <ErrorMessage message={guardianErrors[index].fullName} />
                                                )}







                                                <Text style={styles.label}>Relationship </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setShowRelationDropdown(!showRelationDropdown);
                                                        setShowOccupationDropdown(false);
                                                    }}
                                                >
                                                    <View style={{
                                                        borderWidth: 1,
                                                        borderColor: "#E5E7EB",
                                                        borderRadius: 10,
                                                        paddingHorizontal: 12,
                                                        height: 50,
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        fontFamily: "Gilroy-Regular"
                                                    }}>
                                                        <TextInput
                                                            placeholder="Select Relationship"
                                                            value={item.relationship}
                                                            editable={isRelationOther}
                                                            onChangeText={(text) => {
                                                                updateGuardian(index, "relationship", text);
                                                            }}
                                                            onFocus={(e) => scrollInputIntoView(e)}
                                                            style={{ flex: 1 }}
                                                        />
                                                        <Image
                                                            source={DownArrow}
                                                            style={[
                                                                styles.arrowIcon,
                                                                showRelationDropdown && { transform: [{ rotate: "180deg" }] }
                                                            ]}
                                                        />
                                                    </View>
                                                </TouchableOpacity>

                                                {guardianErrors[index]?.relationship && (
                                                    <ErrorMessage message={guardianErrors[index].relationship} />
                                                )}

                                                {showRelationDropdown && (
                                                    <View style={styles.additinaldropdown}>
                                                        <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                                                            {relationshipOptions.map((item) => (
                                                                <TouchableOpacity
                                                                    key={item}
                                                                    style={styles.dropdownItem}
                                                                    onPress={() => {
                                                                        if (item === "Other") {
                                                                            updateGuardian(index, "relationship", item);
                                                                            setIsRelationOther(true);
                                                                            setRelationship(""); // empty for typing
                                                                            setRelationErr("")
                                                                        } else {
                                                                            updateGuardian(index, "relationship", item);
                                                                            setIsRelationOther(false);
                                                                            setRelationship(item);
                                                                            setRelationErr("")
                                                                        }
                                                                        setShowRelationDropdown(false);
                                                                    }}
                                                                >
                                                                    <Text>{item}</Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </ScrollView>
                                                    </View>
                                                )}

                                                <Text style={styles.label}>Guardian Occupation </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setShowOccupationDropdown(!showOccupationDropdown);
                                                        setShowRelationDropdown(false);
                                                    }}
                                                >
                                                    <View style={{
                                                        borderWidth: 1,
                                                        borderColor: "#E5E7EB",
                                                        borderRadius: 10,
                                                        paddingHorizontal: 12,
                                                        height: 50,
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        fontFamily: "Gilroy-Regular"
                                                    }}>
                                                        <TextInput
                                                            placeholder="Select Occupation"
                                                            value={item.occupation}
                                                            editable={isOccupationOther}
                                                            onChangeText={(t) => {
                                                                const cleaned = t
                                                                    .replace(/[^A-Za-z\s]/g, "")
                                                                    .replace(/\s+/g, " ");

                                                                updateGuardian(index, "occupation", cleaned);
                                                                setOccupationErr("");
                                                                setFormErr("");
                                                            }}
                                                            onFocus={(e) => scrollInputIntoView(e)}
                                                            style={{ flex: 1 }}
                                                        />



                                                        <Image
                                                            source={DownArrow}
                                                            style={[
                                                                styles.arrowIcon,
                                                                showOccupationDropdown && { transform: [{ rotate: "180deg" }] }
                                                            ]}
                                                        />

                                                    </View>
                                                </TouchableOpacity>
                                                {guardianErrors[index]?.occupation && (
                                                    <ErrorMessage message={guardianErrors[index].occupation} />
                                                )}

                                                {showOccupationDropdown && (
                                                    <View style={styles.additinaldropdown}>
                                                        <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                                                            {occupationOptions.map((item) => (
                                                                <TouchableOpacity
                                                                    key={item}
                                                                    style={styles.dropdownItem}
                                                                    onPress={() => {
                                                                        if (item === "Other") {
                                                                            setIsOccupationOther(true);

                                                                            updateGuardian(index, "occupation", "");
                                                                        } else {
                                                                            setIsOccupationOther(false);

                                                                            updateGuardian(index, "occupation", item);
                                                                        }

                                                                        setOccupationErr("");
                                                                        setShowOccupationDropdown(false);
                                                                    }}
                                                                >
                                                                    <Text>{item}</Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </ScrollView>
                                                    </View>
                                                )}

                                                {/* Mobile */}
                                                <Text style={styles.label}>Mobile Number </Text>
                                                <View style={{
                                                    borderWidth: 1,
                                                    borderColor: "#E5E7EB",
                                                    borderRadius: 10,
                                                    paddingHorizontal: 12,
                                                    height: 50,
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    fontFamily: "Gilroy-Regular"
                                                }}>
                                                    {/* Country Code */}
                                                    <Text style={{ marginRight: 8, fontSize: 14 }}>+91</Text>
                                                    <View style={styles.divider} />
                                                    {/* Mobile Input */}
                                                    <TextInput
                                                        placeholder="Enter Mobile Number"
                                                        keyboardType="number-pad"
                                                        maxLength={10}
                                                        value={item.mobile}
                                                        // onChangeText={(t) => {
                                                        //     const validmobile = t.replace(/[^0-9]/g, "");
                                                        //     setMobile(validmobile);
                                                        //     setMobileErr("");
                                                        //     setFormErr("");
                                                        // }}
                                                        onChangeText={(text) =>
                                                            updateGuardian(
                                                                index,
                                                                "mobile",
                                                                text.replace(/[^0-9]/g, "")
                                                            )
                                                        }
                                                        onFocus={(e) => scrollInputIntoView(e)}
                                                        style={{ flex: 1 }}
                                                    />
                                                </View>


                                                {guardianErrors[index]?.mobile && (
                                                    <ErrorMessage message={guardianErrors[index].mobile} />
                                                )}

                                            </View>
                                        ))}


                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end', marginTop: 10
                                        }}>
                                            <View></View>

                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: 'row',
                                                    backgroundColor: "#2D6CDF",
                                                    paddingHorizontal: 18,
                                                    paddingVertical: 8,
                                                    borderRadius: 8,
                                                    alignItems: 'center'
                                                }}
                                                onPress={() => {
                                                    setGuardians(prev => [
                                                        ...prev,
                                                        {
                                                            id: Date.now(),
                                                            fullName: "",
                                                            relationship: "",
                                                            occupation: "",
                                                            mobile: "",
                                                        },
                                                    ]);
                                                }}
                                            >
                                                <Image source={PlusIcon} style={{ width: 20, height: 20, marginRight: 5 }} />

                                                <Text style={{ color: '#fff', fontSize: 12, fontFamily: "Gilroy-Semibold", }}>
                                                    Additional
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.sectionHeader}>
                                            <View style={styles.blueBar} />
                                            <Text style={styles.headerTitle}>
                                                Job Details
                                            </Text>
                                        </View>



                                        <Text style={styles.label}>Company / College Name </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter name"
                                            value={companyName}
                                            onChangeText={(t) => {

                                                const cleaned = t.replace(/[^A-Za-z\s]/g, "");
                                                setCompanyName(cleaned);
                                                setCompanyError("");
                                            }}
                                            onFocus={(e) => scrollInputIntoView(e)}

                                        />

                                        {companyError ? <ErrorMessage message={companyError} /> : null}








                                        <Text style={styles.label}>Employment Status</Text>

                                        <View style={{ zIndex: employmentOpen ? 30 : 1 }}>
                                            <TouchableOpacity
                                                style={styles.dropdown}
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    setEmploymentOpen(!employmentOpen);
                                                    setJobRoleOpen(false);
                                                    setShiftOpen(false);
                                                }}>
                                                <Text
                                                    style={[
                                                        styles.dropdownText,
                                                        !employmentStatus && { color: "#9CA3AF" },
                                                    ]}>
                                                    {employmentStatus?.label || "Select Employment Status"}
                                                </Text>

                                                <Image
                                                    source={DownArrow}
                                                    style={[
                                                        styles.arrow,
                                                        employmentOpen && { transform: [{ rotate: "180deg" }] },
                                                    ]}
                                                />
                                            </TouchableOpacity>

                                            {employmentOpen && (
                                                <View style={styles.dropdownList}>
                                                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                                                        {jobOptions.map(item => (
                                                            <TouchableOpacity
                                                                key={item.value}
                                                                style={styles.option}
                                                                onPress={() => {
                                                                    setEmploymentStatus(item);
                                                                    setEmploymentOpen(false);
                                                                    setEmploymentError("");
                                                                }}>
                                                                <Text style={styles.optionText}>{item.label}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}
                                        </View>
                                        {employmentError ? <ErrorMessage message={employmentError} /> : null}

                                        <Text style={styles.label}>Job Role </Text>
                                        <View style={{ zIndex: jobRoleOpen ? 30 : 1 }}>
                                            <TouchableOpacity
                                                style={styles.dropdown}
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    setJobRoleOpen(!jobRoleOpen);
                                                    // setJobRoleOpen(false);
                                                    setShiftOpen(false);
                                                }}>
                                                <Text

                                                    style={[
                                                        styles.dropdownText,
                                                        // !jobRoleOpen && { color: "#9CA3AF" },
                                                    ]}>
                                                    {jobRole?.label || "Select Job Role"}
                                                </Text>

                                                <Image
                                                    source={DownArrow}
                                                    style={[
                                                        styles.arrow,
                                                        jobRoleOpen && { transform: [{ rotate: "180deg" }] },
                                                    ]}
                                                />
                                            </TouchableOpacity>

                                            {jobRoleOpen && (
                                                <View style={styles.dropdownList}>
                                                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                                                        {jobRoleOptions.map(item => (
                                                            <TouchableOpacity
                                                                key={item.value}
                                                                style={styles.option}
                                                                onPress={() => {
                                                                    setJobRole(item);
                                                                    setJobRoleOpen(false);
                                                                    setJobRoleError("");
                                                                }}>
                                                                <Text style={styles.optionText}>{item.label}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}
                                        </View>
                                        {jobRoleError ? <ErrorMessage message={jobRoleError} /> : null}


                                        <Text style={styles.label}>Work Location </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter name"
                                            value={worklocation}
                                            onChangeText={(t) => {
                                                const cleaned = t.replace(/[^A-Za-z\s]/g, "");
                                                setWorkLocations(cleaned);
                                                setWorkLocationError("");
                                            }}
                                                 onFocus={(e) => scrollInputIntoView(e)} 

                                        />
                                        {workLocationError ? <ErrorMessage message={workLocationError} /> : null}


                                        <Text style={styles.label}>Shift Type </Text>
                                        <View style={{ zIndex: shiftOpen ? 30 : 1 }}>
                                            <TouchableOpacity
                                                style={styles.dropdown}
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    setShiftOpen(!shiftOpen);
                                                    setJobRoleOpen(false);
                                                }}>
                                                <Text
                                                    style={[
                                                        styles.dropdownText,
                                                        !employmentStatus && { color: "#9CA3AF" },
                                                    ]}>
                                                    {shiftType?.label || "Select Shift Type"}
                                                </Text>

                                                <Image
                                                    source={DownArrow}
                                                    style={[
                                                        styles.arrow,
                                                        shiftOpen && { transform: [{ rotate: "180deg" }] },
                                                    ]}
                                                />
                                            </TouchableOpacity>

                                            {shiftOpen && (
                                                <View style={styles.dropdownList}>
                                                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                                                        {shiftTypeOptions.map(item => (
                                                            <TouchableOpacity
                                                                key={item.value}
                                                                style={styles.option}
                                                                onPress={() => {
                                                                    setShiftType(item);
                                                                    setShiftOpen(false);
                                                                    setShiftTypeError("");
                                                                }}>
                                                                <Text style={styles.optionText}>{item.label}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}
                                        </View>
                                        {shiftTypeError ? <ErrorMessage message={shiftTypeError} /> : null}

                                        <Text style={styles.label}>Shift Timing</Text>

                                        <View style={styles.shiftRow}>
                                            <TouchableOpacity
                                                style={styles.shiftInput}
                                                activeOpacity={1}
                                            >
                                                <TextInput
                                                    style={styles.timeInput}
                                                    value={startTime}
                                                    onChangeText={(text) => {
                                                        setStartTime(formatTimeInput(text))
                                                        setStartTimeError("")
                                                    }
                                                    }
                                                    keyboardType="number-pad"
                                                    placeholder="00:00 AM"
                                                         onFocus={(e) => scrollInputIntoView(e)} 
                                                />

                                                <Image
                                                    source={require("../../Assets/Images/calendar.png")}
                                                    style={styles.calendarIcon}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.shiftInput}
                                                activeOpacity={1}
                                            >
                                                <TextInput
                                                    style={styles.timeInput}
                                                    value={endTime}
                                                    onChangeText={(text) => {
                                                        setEndTime(formatTimeInput(text))
                                                        setEndTimeError("")
                                                    }

                                                    }
                                                    keyboardType="number-pad"
                                                    placeholder="00:00 PM"
                                                         onFocus={(e) => scrollInputIntoView(e)} 
                                                />

                                                <Image
                                                    source={require("../../Assets/Images/calendar.png")}
                                                    style={styles.calendarIcon}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {startTimeError ? <ErrorMessage message={startTimeError} /> : null}
                                        {endTimeError ? <ErrorMessage message={endTimeError} /> : null}



                                        {/* <Text style={styles.label}>Have a Vehicle ?</Text>

                                        <View style={styles.switchRow}>
                                            <Text style={styles.subText}>
                                                For a Parking Allocation Purpose
                                            </Text>

                                            <Switch
                                                value={hasVehicle}
                                                onValueChange={setHasVehicle}
                                                trackColor={{
                                                    false: "#D9D9D9",
                                                    true: "#4B5EFF",
                                                }}
                                                thumbColor="#fff"
                                                ios_backgroundColor="#D9D9D9"
                                            />
                                        </View>

                                        {hasVehicle && (
                                            <>
                                                <Text style={styles.label}>
                                                    Vehicle Type <Text style={{ color: "red" }}>*</Text>
                                                </Text>

                                                <View style={{ position: "relative" }}>
                                                    <TouchableOpacity
                                                        style={styles.dropdown}
                                                        onPress={() => setVehicleDropdown(!vehicleDropdown)}
                                                    >
                                                        <Text style={styles.dropdownText}>
                                                            {vehicleType}
                                                        </Text>

                                                        <Image
                                                            source={DownArrow}
                                                            style={styles.arrow}
                                                        />
                                                    </TouchableOpacity>

                                                    {vehicleDropdown && (
                                                        <View style={styles.dropdownMenu}>
                                                            {vehicleTypes.map((item) => (
                                                                <TouchableOpacity
                                                                    key={item}
                                                                    style={styles.option}
                                                                    onPress={() => {
                                                                        setVehicleType(item);
                                                                        setVehicleDropdown(false);
                                                                    }}
                                                                >
                                                                    <Text style={styles.optionText}>
                                                                        {item}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </View>
                                                    )}
                                                </View>

                                                <Text style={styles.label}>
                                                    Vehicle Number
                                                </Text>

                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Help us to Identify on the parking..."
                                                    placeholderTextColor="#A3A3A3"
                                                    autoCapitalize="characters"
                                                    value={vehicleNumber}
                                                    onChangeText={(text) =>
                                                        setVehicleNumber(text.toUpperCase())
                                                    }
                                                />

                                                <Text style={styles.label}>
                                                    Vehicle Model
                                                </Text>

                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter Vehicle Model"
                                                    placeholderTextColor="#A3A3A3"
                                                    value={vehicleModel}
                                                    onChangeText={setVehicleModel}
                                                />
                                            </>
                                        )} */}

                                    </View>
                                </>
                            )
                        }






                        <View style={{ height: 60 }} />
                    </ScrollView>
                </KeyboardAvoidingView>

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

                                    if (activeDateField === "booking") {
                                        setPurchaseDate(day.dateString);
                                        setJoiningDate(null);
                                        setBookingDateError("");
                                    }

                                    if (activeDateField === "joining") {
                                        setJoiningDate(day.dateString);
                                        setJoiningDateError("");
                                    }

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

                <ImagePickerSheet
                    visible={showProfileSheet}
                    onClose={() => setShowProfileSheet(false)}
                    title="Change Profile Picture"
                    options={[
                        {
                            label: "Take Picture",
                            icon: require("../../Assets/Images/CameraIcon.png"),
                            showArrow: true,
                            onPress: openCamera,
                        },
                        {
                            label: "Select from Gallery",
                            icon: require("../../Assets/Images/GalleryIcon.png"),
                            showArrow: true,
                            onPress: openGallery,
                        },
                        {
                            label: "Remove Picture",
                            icon: require("../../Assets/Images/DeleteIcon.png"),
                            showArrow: false,
                            onPress: () => console.log("remove"),
                        },
                    ]}
                />


                {openJoinDatePic && (
                    <View style={styles.sheetOverlay}>
                        <TouchableWithoutFeedback onPress={() => setOpenJoinDatePic(false)}>
                            <View style={{ flex: 1 }} />
                        </TouchableWithoutFeedback>

                        <View style={styles.datePickerBox}>
                            <Calendar
                                markingType="custom"
                                markedDates={joiningMarkedDates}
                                onDayPress={(day) => {
                                    if (joiningMarkedDates[day.dateString]?.disabled) return;

                                    setJoiningDate(day.dateString);
                                    setOpenJoinDatePic(false);
                                    setJoiningDateError("")
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
                {openDatePicker && (
                    <View style={styles.sheetOverlay}>
                        <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
                            <View style={{ flex: 1 }} />
                        </TouchableWithoutFeedback>

                        <View style={styles.datePickerBox}>
                            <Calendar
                                markingType="custom"
                                markedDates={bookingMarkedDates}
                                onDayPress={(day) => {
                                    if (bookingMarkedDates[day.dateString]?.disabled) return;

                                    setPurchaseDate(day.dateString);
                                    setJoiningDate(null);
                                    setOpenDatePicker(false);
                                    setBookingDateError("")
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
                {openCheckJoinDatePic && (

                    <View style={styles.sheetOverlay}>
                        <TouchableWithoutFeedback onPress={() => setOpenCheckJoinDatePic(false)}>
                            <View style={{ flex: 1 }} />
                        </TouchableWithoutFeedback>

                        <View style={styles.datePickerBox}>
                            <Calendar
                                markingType="custom"
                                markedDates={checkInMarkedDates}
                                current={dayjs(checkJoiningDate).format("YYYY-MM-DD")}
                                onDayPress={(day) => {
                                    if (checkInMarkedDates[day.dateString]?.disabled) return;

                                    setcheckJoiningDate(day.dateString);
                                    setOpenCheckJoinDatePic(false);
                                    setCheckJoinDateError("")
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

                <View
                    style={[
                        styles.bottomFooter,
                        {
                            bottom: insets.bottom > 0 ? insets.bottom : 0,
                        },
                    ]}
                >
                    {renderFooterButtons()}
                </View>

                <BedDetailsSheet
                    visible={showBedSheet}
                    type={activeTab === "CheckIn" ? "checkIn" : "booking"}
                    joiningDate={joiningDate || checkJoiningDate}
                    onClose={() => setShowBedSheet(false)}
                    onSelect={(data) => {
                        console.log("Selected Bed =>", data);

                        setSelectedBedDetails(data);

                        const floor = floors.find(f => f?.id === data?.floorId);
                        if (floor) {
                            setFloorSelected(floor);
                        }

                        loadRoomsByFloor(data?.floorId).then(async () => {

                            const room = {
                                id: data?.roomId,
                                name: data?.roomName,
                            };
                            setRoomSelected(room);

                            await getAllBedsByRoom(data?.roomId);

                            setBedSelected({
                                bedId: data?.bedId,
                                bedName: data?.bedName,
                                rentAmount: data?.rentAmount,
                            });

                            setCheckinRentalAmount(String(data?.rentAmount));
                        });
                    }}
                />

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 ,  borderRadius: 10,
  overflow: "visible",},

    backArrow: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 4
        // marginBottom: 5,
    },

    roomText: {
        fontSize: 13,
        color: "#1E45E1",
        marginBottom: 15,
    },

    tabRow: {
        flexDirection: "row",
        backgroundColor: "#E9ECF7",
        padding: 4,
        borderRadius: 10,
    },

    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: "#ffff",
    },
    tabText: {
        textAlign: "center",
        fontSize: 14,
        color: "#000000",
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

    tabTextActive: {
        color: "#1D5DFF",
        fontWeight: "700",
    },

    label: {
        marginTop: 18,
        marginBottom: 5,
        fontFamily: "Gilroy-Semibold",
        color: "#444",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 20,
        justifyContent: 'space-between'
    },

    headerTitle: {
        fontSize: 20,
        fontFamily: "Gilroy-Bold"
    },

    headerSub: {
        fontSize: 14,
        color: "#667085",
        marginTop: 4
    },

    stepCircle: {
        backgroundColor: '#F4F8FF',
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 1,
        borderColor: "#2D6CDF",
        justifyContent: "center",
        alignItems: "center"
    },

    searchBox: {
        height: 52,
        borderRadius: 14,
        backgroundColor: "#F5F6FA",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        marginTop: 10
    },

    sectionTitle: {
        fontSize: 22,
        fontFamily: "Gilroy-SemiBold"
    },

    blueBar: {
        width: 4,
        height: 28,
        backgroundColor: "#2D6CDF",
        borderRadius: 2,
        marginRight: 10
    },

    profileRow: {
        flexDirection: "row",
        marginTop: 20,
        alignItems: "center"
    },

    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15
    },

    input: {
        height: 54,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 15,
        marginTop: 8
    },

    dropdown: {
        height: 54,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 15,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginTop: 8
    },

    additinaldropdown: {

        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        marginTop: 6,
        maxHeight: 180,
        backgroundColor: "#fff",
        zIndex: 999,
        elevation: 5,

    },
    footer: {
        marginVertical: 30,
        alignItems: "flex-end"
    },

    nextBtn: {
        backgroundColor: "#2D5BFF",
        width: 170,
        height: 52,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    },

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

    // input: {
    //     borderWidth: 1,
    //     borderColor: "#ddd",
    //     borderRadius: 10,
    //     padding: 12,
    //     marginTop: 4,
    // },
    disabledInput: {
        backgroundColor: "#F5F5F5",
        color: "#9CA3AF",
        opacity: 0.7,
    },

    icon: { width: 20, height: 20 },

    extraHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 18,
        marginBottom: 18,
        alignItems: "flex-end",

    },

    addBtn: {
        backgroundColor: "#2D6CDF",
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 8,
    },


    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 15,
        marginTop: 25,
    },


    cancelBtn: {
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,


        width: "40%"
    },

    cancelText: {
        textAlign: "center",
        color: "#333",
    },

    submitBtn: {
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
        backgroundColor: "#1D5DFF",
        width: "35%"
    },

    submitText: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "700",
    },

    arrow: { width: 18, height: 18, tintColor: "#444" },

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

    dropdownItem: {
        padding: 12,
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dropdownMenuone: {
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

        maxHeight: 220,   // ✅ முக்கியம்
        overflow: "hidden" // ✅ scroll clean ஆகும்
    },


    // dropdownMenuone: {
    //   position: "absolute",
    //   top: 50,
    //   left: 0,
    //   right: 0,
    //   backgroundColor: "#fff",
    //   borderWidth: 1,
    //   borderColor: "#ddd",
    //   borderRadius: 12,
    //   zIndex: 999,
    //   elevation: 10,
    // },

    option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    selectText: { color: "#555" },
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
    placeholder: { color: "#555" },


    optionText: {
        fontSize: 15,
        color: "#000",
        fontFamily: "Gilroy-Regular",
    },
    disabledSelect: {
        backgroundColor: "#f2f2f2",
        opacity: 0.6,
    }, emptyOption: {
        paddingVertical: 14,
        alignItems: "center",
    },

    emptyText: {
        color: "#999",
        fontStyle: "italic",
        fontSize: 14,
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

    datePickerBox1: {
        backgroundColor: "#fff",
        width: "80%",
        borderColor: "#DCDCDC",
        borderRadius: 30,
        padding: 5,
        marginBottom: 300,
        borderWidth: 0.5,
    },
    sheetOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
    },

    //   sheetOverlay: {
    //  position: "absolute",
    //   top: 40,
    //   left: 0,
    //   right: 0,
    //   bottom: 0,
    //   backgroundColor: "rgba(0,0,0,0.2)",

    //   },



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
    nonRefund: {
        backgroundColor: "#F7F9FF",
        padding: 10,
        marginTop: 10,
        borderRadius: 20,

    },
    inputBox: {
        borderColor: "#e1e1e1",
        padding: 14,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1
    },
    transactiondropdown: {
        position: "absolute",
        top: 77,          // 👈 input height
        left: 0,
        right: 0,

        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        zIndex: 9999,
        elevation: 20,

        maxHeight: 160,
    },

    dropdownRow: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },

    dropdownRowSelected: {
        backgroundColor: "#2563EB",
    },

    dropdownText: {
        color: "#111",
        fontFamily: "Gilroy-Medium",
    },

    dropdownTextSelected: {
        color: "#fff",
        fontWeight: "700",
    },

    searchIcon: {
        width: 18,
        height: 18,
        marginRight: 8,
    },
    searchResultCard: {
        marginTop: 18,
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#ECECEC",
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },

    tenantRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 20,
    },

    avatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
    },

    avatarPlaceholder: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#DCE4F5",
        justifyContent: "center",
        alignItems: "center",
    },

    name: {
        fontSize: 18,
        fontFamily: "Gilroy-SemiBold",
        color: "#222",
    },

    info: {
        fontSize: 15,
        color: "#676767",
        marginTop: 6,
        fontFamily: "Gilroy-Regular",
    },

    divider: {
        height: 1,
        backgroundColor: "#ECECEC",
        marginLeft: 92,
    },

    emptyContainer: {
        paddingVertical: 30,
        alignItems: "center",
    },

    emptyText: {
        fontSize: 14,
        textAlign: "center",
        color: "#444",
        fontFamily: "Gilroy-SemiBold",
    },


    mobileWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        height: 50,
        marginBottom: 2,
    },

    countryDropdown: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderRightWidth: 1,
        borderRightColor: "#E5E7EB",
        height: "100%",
    },

    countryCodeText: {
        fontSize: 14,
        fontFamily: "Gilroy-Medium",
        color: "#111",
        marginRight: 4,
    },

    countryArrow: {
        width: 14,
        height: 14,
        tintColor: "#6B7280",
    },

    countryDropdownMenu: {
        position: "absolute",
        top: 52,
        left: 0,
        width: 180,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        elevation: 10,
        zIndex: 9999,
        maxHeight: 200,
    },

    countryOption: {
        paddingVertical: 12,
        paddingHorizontal: 12,
    },

    countryOptionText: {
        fontSize: 14,
        color: "#111",
    },


    countryCode: {
        fontSize: 14,
        color: "#111",
        marginRight: 10,
        fontFamily: "Gilroy-Medium",
    },

    mobileInput: {
        flex: 1,
        fontSize: 14,
        color: "#111",
    },
    form: {
        marginBottom: 10,
    },
    arrowTouch: {
        position: "absolute",
        right: 12,
        top: 12,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },

    arrowIconImg: {
        width: 18,
        height: 18,
        tintColor: "#777",
    },
    // dropdownOverlay: {
    //     position: "absolute",
    //     top: -1000,
    //     left: -1000,
    //     right: -1000,
    //     bottom: -1000,
    //     backgroundColor: "transparent",
    //     zIndex: 999,
    // },

    dropdownOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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

    uploadCard: {
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#E4E7EC",
        borderRadius: 16,
        paddingVertical: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
        marginTop: 10,
        backgroundColor: "#fff",
    },

    uploadIconBox: {
        width: 72,
        height: 72,
        borderRadius: 18,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 3,
        marginBottom: 16,
    },

    uploadIcon: {
        width: 34,
        height: 34,
        resizeMode: "contain",
    },

    uploadTitle: {
        fontSize: 18,
        color: "#202020",
        fontFamily: "Gilroy-Semibold",
    },

    uploadSubTitle: {
        marginTop: 6,
        fontSize: 14,
        color: "#667085",
        fontFamily: "Gilroy-Regular",
    },

    infoCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#FFF6EB",
        borderRadius: 10,
        padding: 16,
        paddingHorizontal: 5,
        marginTop: 8,
    },

    infoIcon: {
        width: 22,
        height: 22,
        tintColor: "#8A5A00",
        marginRight: 12,
        marginTop: 2,
    },

    infoText: {
        color: "#653E00",
        fontSize: 11,
        //   lineHeight: 22,
        fontFamily: "Gilroy-Medium",
    },

    previewCard: {
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#FFF",
    },

    previewImage: {
        width: "100%",
        height: 220,
        resizeMode: "cover",
    },

    fileInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
    },

    fileName: {
        fontSize: 10,
        fontFamily: "Gilroy-Semibold",
    },

    fileSize: {
        color: "#6B7280",
        marginTop: 4,
    },

    deleteBtn: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: "#FFF1F0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 30
    },

    thumbnailRow: {
        marginTop: 12,
        marginHorizontal: 16,
    },

    thumbImage: {
        width: 90,
        height: 70,
        borderRadius: 8,
        marginRight: 10,
    },

    addMore: {
        color: "#2D5BFF",
        marginTop: 10,
        textAlign: "right",
        fontFamily: "Gilroy-Semibold",
    },
    arrowIcon: {
        marginLeft: 5,
        width: 23,
        height: 23,
        // tintColor: "#6B7280",
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

    dropdown: {
        height: 58,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
    },

    // dropdownText: {
    //     fontSize: 18,
    //     color: "#222",
    //     fontFamily: "Gilroy-Medium",
    // },



    dropdownList: {
        position: "absolute",
        top: 56,
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        maxHeight: 220,
        elevation: 6,
        zIndex: 999,
    },

    // option: {
    //   paddingVertical: 14,
    //   paddingHorizontal: 16,
    //   borderBottomWidth: 1,
    //   borderBottomColor: "#F3F4F6",
    // },



    dropdownMenu: {
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        zIndex: 100,
        elevation: 6,
    },

    option: {
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    // optionText: {
    //     fontSize: 16,
    //     fontFamily: "Gilroy-Regular",
    // },

    // input: {
    //     height: 58,
    //     borderWidth: 1,
    //     borderColor: "#E5E7EB",
    //     borderRadius: 12,
    //     paddingHorizontal: 16,
    //     fontSize: 16,
    //     color: "#222",
    //     backgroundColor: "#fff",
    // },
    //     label: {
    //   fontSize: 16,
    //   color: "#202020",
    //   fontFamily: "Gilroy-Semibold",
    //   marginBottom: 10,
    // },

    // shiftRow: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    // },

    // shiftInput: {
    //     width: "48%",
    //     height: 54,
    //     borderWidth: 1,
    //     borderColor: "#DADADA",
    //     borderRadius: 14,
    //     paddingHorizontal: 14,
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: "space-between",
    //     backgroundColor: "#FFF",
    // },

    // shiftText: {
    //     fontSize: 18,
    //     color: "#202020",
    //     fontFamily: "Gilroy-Medium",
    // },

    // placeholderText: {
    //     color: "#A3A3A3",
    // },

    calendarIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    bottomFooter: {
        position: "absolute",
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderColor: "#ECECEC",

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        elevation: 10,
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },

    primaryBtn: {
        flex: 1,
        height: 48,
        backgroundColor: "#2F54EB",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    secondaryBtn: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
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

    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    checkboxText: {
        marginLeft: 8,
        fontSize: 15,
        color: "#4B5563",
    },
    // disabledBtn: {
    //     backgroundColor: "#B7C4F7",
    // },
    doLaterContainer: {
        flexDirection: "row",
        alignItems: "center",
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

    doLater: {
        fontSize: 14,
        color: "#111827",
        fontFamily: "Gilroy-Medium",
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 25,
    },

    profileWrapper: {
        width: 75,
        height: 75,
        borderRadius: 75 / 2,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },

    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 75 / 2,
    },

    editIconWrapper: {
        position: "absolute",
        alignSelf: "center",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 3,
        opacity: 6

    },

    editIcon: {
        width: 24,
        height: 24,

    },

    profileTitle: {
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
        color: "#111827",
    },
    profileSub: {
        fontSize: 12,
        color: "#6B7280",
        lineHeight: 16,
        width: 220,
        marginTop: 4,
        fontFamily: "Gilroy-Regular"
    },
    guardianCard: {
        marginTop: 18,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        backgroundColor: "#fff",
        padding: 16,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },

    cardTitle: {
        fontSize: 17,
        fontFamily: "Gilroy-SemiBold",
        color: "#111827",
    },
    shiftRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },

    shiftInput: {
        width: "48%",
        height: 54,
        borderWidth: 1,
        borderColor: "#DADADA",
        borderRadius: 14,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
    },

    timeInput: {
        flex: 1,
        fontSize: 16,
        color: "#202020",
        fontFamily: "Gilroy-Medium",
    },

    // calendarIcon: {
    //   width: 22,
    //   height: 22,
    //   resizeMode: "contain",
    // },

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
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center'
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
});