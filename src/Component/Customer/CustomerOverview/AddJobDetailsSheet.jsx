import React, { useRef, useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    PanResponder,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput, KeyboardAvoidingView, Platform, ScrollView, Keyboard, Image
} from "react-native";
import { useCustomer } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import DownArrow from "../../../Assets/Images/direction-down.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import ClockIcon from "../../../Assets/Images/timer.png";

const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.80;

export default function JobDetailsSheet({
    visible,
    onClose,
    customerDetails, onSuccess,
}) {
    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const { UpdateJobDetails } = useCustomer();
    const { activeHostelId } = useContext(CommonContexts);

    const scrollRef = useRef(null);

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [mobile, setMobile] = useState("")
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [firstNameError, setFirstNameError] = useState("")
    const [mobileError, setMobileNumberError] = useState("")
    const [initialFirstName, setInitialFirstName] = useState("");
    const [initialLastName, setInitialLastName] = useState("");
    const [initialEmail, setInitialEmail] = useState("");
    const [initialMobileNo, setInitialMobileNo] = useState("");
    const [initialCountryCode, setInitialCountryCode] = useState("");
    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [countryCode, setCountryCode] = useState("")


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

    const [openStartTime, setOpenStartTime] = useState(false);
    const [openEndTime, setOpenEndTime] = useState(false);

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const formatTime = (date) => {
        if (!date) return "";

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };



    // const convertTimeToDate = (time) => {
    //     if (!time || typeof time !== "string") {
    //         return null;
    //     }

    //     const value = time.trim().toUpperCase();

    //     const parts = value.split(" ");
    //     if (parts.length !== 2) {
    //         return null;
    //     }

    //     const [timePart, meridian] = parts;

    //     const values = timePart.split(":");
    //     if (values.length !== 2) {
    //         return null;
    //     }

    //     let [hours, minutes] = values.map(Number);

    //     if (isNaN(hours) || isNaN(minutes)) {
    //         return null;
    //     }

    //     if (meridian === "PM" && hours !== 12) hours += 12;
    //     if (meridian === "AM" && hours === 12) hours = 0;

    //     const date = new Date();
    //     date.setHours(hours);
    //     date.setMinutes(minutes);
    //     date.setSeconds(0);

    //     return date;
    // };



    const convertTimeToDate = (time) => {
        if (!time) return null;

        const match = time
            .trim()
            .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

        if (!match) return null;

        let [, hh, mm, meridian] = match;

        let hours = parseInt(hh, 10);
        const minutes = parseInt(mm, 10);

        meridian = meridian.toUpperCase();

        if (meridian === "PM" && hours !== 12) hours += 12;
        if (meridian === "AM" && hours === 12) hours = 0;

        const date = new Date();

        date.setHours(hours, minutes, 0, 0);

        return date;
    };


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

    const splitShiftTiming = (timing) => {
        if (!timing) {
            return {
                start: null,
                end: null,
            };
        }

        const match = timing.match(
            /(\d{1,2}:\d{2}\s*[APap][Mm]).*?(\d{1,2}:\d{2}\s*[APap][Mm])/
        );

        if (!match) {
            return {
                start: null,
                end: null,
            };
        }

        return {
            start: convertTimeToDate(match[1]),
            end: convertTimeToDate(match[2]),
        };
    };

    const resetForm = () => {
        // Values
        setCompanyName("");
        setEmploymentStatus(null);
        setJobRole(null);
        setWorkLocations("");
        setShiftType(null);
        setStartTime(null);
        setEndTime(null);

        // Dropdowns
        setEmploymentOpen(false);
        setJobRoleOpen(false);
        setShiftOpen(false);

        // Time Picker
        setShowStartPicker(false);
        setShowEndPicker(false);

        // Errors
        setCompanyError("");
        setEmploymentError("");
        setJobRoleError("");
        setWorkLocationError("");
        setShiftTypeError("");
        setStartTimeError("");
        setEndTimeError("");
    };



    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const safeKeyboardHeight = keyboardHeight > 0 ? 260 : 0;
    Keyboard.addListener("keyboardDidShow", (e) => {
        setKeyboardHeight(e.endCoordinates.height);
    });
    Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardHeight(0);
    })


    useEffect(() => {
        if (visible && customerDetails) {
            console.log(customerDetails)
            const f = customerDetails.firstName || "";
            const l = customerDetails.lastName || "";
            const e = customerDetails.emailId || "";
            const m = customerDetails.mobileNo || "";
            const c = customerDetails.countryCode || "";

            setFirstName(f);
            setLastName(l);
            setEmail(e);
            setMobile(m)
            setCountryCode(c)

            // 🔥 store initial values
            setInitialFirstName(f.trim());
            setInitialLastName(l.trim());
            setInitialEmail(e.trim().toLowerCase());
            setInitialMobileNo(m)
            setInitialCountryCode(c)
        }
    }, [visible, customerDetails]);


    useEffect(() => {
        if (visible && customerDetails?.jobDetails) {
            const job = customerDetails?.jobDetails;

            setCompanyName(job?.organizationName || "");
            setEmploymentStatus(
                jobOptions?.find(x => x?.value === job?.employmentStatus) || null
            );
            setJobRole(
                jobRoleOptions.find(x => x.value === job?.role) || null
            );
            setWorkLocations(job?.workLocation || "");
            setShiftType(
                shiftTypeOptions?.find(x => x?.value === job?.shiftType) || null
            );
            const { start, end } = splitShiftTiming(job?.shiftTiming);



            setStartTime(start);
            setEndTime(end);

            console.log("shiftTiming =>", job?.shiftTiming);


            console.log("start =>", start);
            console.log("end =>", end);
        }
    }, [visible, customerDetails]);



    useEffect(() => {
        if (visible) {
            Animated.timing(translateY, {
                toValue: 0,               // 🔥 FULLY OPEN
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    // const closeSheet = () => {
    //     Animated.timing(translateY, {
    //         toValue: SHEET_HEIGHT,
    //         duration: 250,
    //         useNativeDriver: true,
    //     }).start(onClose);
    // };

    const closeSheet = () => {
        Animated.timing(translateY, {
            toValue: SHEET_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            resetForm();
            onClose();
        });
    };


    // const panResponder = useRef(
    //     PanResponder.create({
    //         onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
    //         onPanResponderMove: (_, g) => {
    //             if (g.dy > 0) {
    //                 translateY.setValue(g.dy);
    //             }
    //         },
    //         onPanResponderRelease: (_, g) => {
    //             g.dy > 120
    //                 ? closeSheet()
    //                 : Animated.spring(translateY, {
    //                     toValue: 0,
    //                     useNativeDriver: true,
    //                 }).start();
    //         },
    //     })
    // ).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) =>
                Math.abs(gestureState.dy) > 5,

            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },

            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 120) {
                    closeSheet();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    if (!visible) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const hasJobDetails = Boolean(
        customerDetails?.jobDetails?.organizationName ||
        customerDetails?.jobDetails?.employmentStatus ||
        customerDetails?.jobDetails?.role ||
        customerDetails?.jobDetails?.workLocation ||
        customerDetails?.jobDetails?.shiftType ||
        customerDetails?.jobDetails?.shiftTiming
    );



    const validateJobDetails = () => {
        let valid = true;

        setCompanyError("");
        setEmploymentError("");
        setJobRoleError("");
        setWorkLocationError("");
        setShiftTypeError("");
        setStartTimeError("");
        setEndTimeError("");

        const hasJobData =
            companyName.trim() ||
            employmentStatus ||
            jobRole ||
            worklocation.trim() ||
            shiftType ||
            startTime ||
            endTime;

        if (!hasJobData) {
            return true;
        }

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

        if (!startTime) {
            setStartTimeError("Please select Shift From");
            valid = false;
        }

        if (!endTime) {
            setEndTimeError("Please select Shift To");
            valid = false;
        }

        return valid;
    };

    // const handleUpdate = async () => {



    //     const currentPayload = {
    //         employmentStatus: employmentStatus?.value || "",
    //         organizationName: companyName.trim(),
    //         role: jobRole?.value || "",
    //         workLocation: worklocation.trim(),
    //         shiftType: shiftType?.value || "",
    //         shiftStartsFrom: startTime ? formatTime(startTime) : "",
    //         shiftEndsAt: endTime ? formatTime(endTime) : "",
    //     };

    //     const oldPayload = {
    //         employmentStatus: customerDetails?.jobDetails?.employmentStatus || "",
    //         organizationName: customerDetails?.jobDetails?.organizationName || "",
    //         role: customerDetails?.jobDetails?.role || "",
    //         workLocation: customerDetails?.jobDetails?.workLocation || "",
    //         shiftType: customerDetails?.jobDetails?.shiftType || "",
    //         shiftStartsFrom: splitShiftTiming(customerDetails?.jobDetails?.shiftTiming).start
    //             ? formatTime(splitShiftTiming(customerDetails?.jobDetails?.shiftTiming).start)
    //             : "",
    //         shiftEndsAt: splitShiftTiming(customerDetails?.jobDetails?.shiftTiming).end
    //             ? formatTime(splitShiftTiming(customerDetails?.jobDetails?.shiftTiming).end)
    //             : "",
    //     };

    //     if (JSON.stringify(currentPayload) === JSON.stringify(oldPayload)) {
    //         setMessage("No changes detected");
    //         setModalType("warning"); 
    //         setShowSuccess(true);

    //         setTimeout(() => {
    //             setShowSuccess(false);
    //         }, 1200);

    //         return;
    //     }




    //     const res = await UpdateJobDetails(
    //         activeHostelId,
    //         customerDetails.customerId,
    //         currentPayload
    //     );

    //     if (res?.success) {
    //         setMessage("Saved Successfully");
    //         setModalType("success");
    //         setShowSuccess(true);

    //         setTimeout(() => {
    //             setShowSuccess(false);
    //             onSuccess?.();
    //             closeSheet();
    //         }, 1500);

    //     }
    //     else {
    //         setMessage(res?.message || "job Details update Failed");
    //         setModalType("error");
    //         setShowSuccess(true);

    //         setTimeout(() => {
    //             setShowSuccess(false);
    //         }, 1200);
    //     }
    // };


    const handleUpdate = async () => {

        const currentPayload = {
            employmentStatus: employmentStatus?.value || "",
            organizationName: companyName.trim(),
            role: jobRole?.value || "",
            workLocation: worklocation.trim(),
            shiftType: shiftType?.value || "",
            shiftStartsFrom: startTime ? formatTime(startTime) : "",
            shiftEndsAt: endTime ? formatTime(endTime) : "",
        };

        // ✅ only compare in Edit mode
        if (hasJobDetails) {
            const oldPayload = {
                employmentStatus: customerDetails?.jobDetails?.employmentStatus || "",
                organizationName: customerDetails?.jobDetails?.organizationName || "",
                role: customerDetails?.jobDetails?.role || "",
                workLocation: customerDetails?.jobDetails?.workLocation || "",
                shiftType: customerDetails?.jobDetails?.shiftType || "",
                shiftStartsFrom: splitShiftTiming(customerDetails?.jobDetails?.shiftTiming).start
                    ? formatTime(splitShiftTiming(customerDetails?.jobDetails?.shiftTiming).start)
                    : "",
                shiftEndsAt: splitShiftTiming(customerDetails?.jobDetails?.shiftTiming).end
                    ? formatTime(splitShiftTiming(customerDetails?.jobDetails?.shiftTiming).end)
                    : "",
            };

            if (JSON.stringify(currentPayload) === JSON.stringify(oldPayload)) {
                setMessage("No changes detected");
                setModalType("warning");
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 1200);
                return;
            }
        }

        const res = await UpdateJobDetails(
            activeHostelId,
            customerDetails.customerId,
            currentPayload
        );

        if (res?.success) {
            setMessage(hasJobDetails ? "Updated Successfully" : "Saved Successfully");
            setModalType("success");
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
                onSuccess?.();
                closeSheet();
            }, 2000);

        } else {
            setMessage(res?.message || "Job Details update Failed");
            setModalType("error");
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
            }, 1200);
        }
    };



    return (
        <>
            <SuccessModal visible={showSuccess} message={message} type={modalType} />
            <View style={styles.root} pointerEvents="box-none">
                {/* FULL SCREEN OVERLAY */}
                <TouchableWithoutFeedback onPress={closeSheet}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>

                {/* BOTTOM SHEET */}


                <Animated.View
                    {...(panResponder?.panHandlers || {})}
                    style={[
                        styles.sheet,
                        {
                            transform: [
                                {
                                    translateY: Animated.subtract(
                                        translateY,
                                        new Animated.Value(safeKeyboardHeight)
                                    ),
                                },
                            ],
                        },
                    ]}
                >


                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 30 }}
                            ref={scrollRef}
                        >
                            <View style={styles.handle} />
                            <Text style={styles.title}>
                                {hasJobDetails ? "Edit Job Details" : "Add Job Details"}
                            </Text>

                            <Text style={styles.label}>Company / College Name </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter name"
                                value={companyName}
                                // onChangeText={(t) => {

                                //     const cleaned = t.replace(/[^A-Za-z\s]/g, "");

                                //     setCompanyName(cleaned);

                                // }}
                                onChangeText={(t) => {
                                    const cleaned = t.replace(/[^A-Za-z\s]/g, "");

                                    setCompanyName(cleaned);

                                    if (cleaned.trim()) {
                                        setCompanyError("");
                                    }
                                }}

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
                                // onChangeText={(t) => {
                                //     const cleaned = t.replace(/[^A-Za-z\s]/g, "");
                                //     setWorkLocations(cleaned);
                                // }}
                                onChangeText={(t) => {
                                    const cleaned = t.replace(/[^A-Za-z\s]/g, "");

                                    setWorkLocations(cleaned);

                                    if (cleaned.trim()) {
                                        setWorkLocationError("");
                                    }
                                }}
                                onFocus={() => {
                                    setTimeout(() => {
                                        scrollRef.current?.scrollTo({
                                            y: 250,
                                            animated: true,
                                        });
                                    }, 150);
                                }}

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
                                    onPress={() => setShowStartPicker(true)}
                                >
                                    <Text
                                        style={[
                                            styles.timeText,
                                            !startTime && styles.placeholder,
                                        ]}
                                    >
                                        {startTime ? formatTime(startTime) : "From"}
                                    </Text>

                                    <Image source={ClockIcon} style={styles.clockIcon} />
                                </TouchableOpacity>


                                <TouchableOpacity
                                    style={styles.shiftInput}
                                    onPress={() => setShowEndPicker(true)}
                                >
                                    <Text
                                        style={[
                                            styles.timeText,
                                            !endTime && styles.placeholder,
                                        ]}
                                    >
                                        {endTime ? formatTime(endTime) : "To"}
                                    </Text>

                                    <Image source={ClockIcon} style={styles.clockIcon} />
                                </TouchableOpacity>
                            </View>
                            {startTimeError ? <ErrorMessage message={startTimeError} /> : null}
                            {endTimeError ? <ErrorMessage message={endTimeError} /> : null}

                            <View style={styles.footer}>
                                <TouchableOpacity onPress={closeSheet}>
                                    <Text style={[styles.cancel, { marginRight: 20 }]}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
                                    <Text style={styles.updateText}> {hasJobDetails ? "Update" : "Save"}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Animated.View>
            </View>


            {showStartPicker && (
                <DateTimePicker
                    value={startTime || new Date()}
                    mode="time"
                    display="default"
                    is24Hour={false}
                    onChange={(event, date) => {
                        setShowStartPicker(false);

                        if (date) {
                            setStartTime(date);
                            setStartTimeError("");
                        }
                    }}
                />
            )}

            {showEndPicker && (
                <DateTimePicker
                    value={endTime || new Date()}
                    mode="time"
                    display="default"
                    is24Hour={false}
                    onChange={(event, date) => {
                        setShowEndPicker(false);

                        if (date) {
                            setEndTime(date);
                            setEndTimeError("");
                        }
                    }}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: { ...StyleSheet.absoluteFillObject, zIndex: 999 },
    root: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,          // 🔥 VERY IMPORTANT
        elevation: 9999,      // 🔥 Android
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,  // 🔥 FULL SCREEN
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    sheet: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,            // 🔥 IMPORTANT
        height: SHEET_HEIGHT,
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: "#D1D5DB",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 12,
    },
    title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
    label: { fontSize: 12, marginTop: 10, marginBottom: 5, fontFamily: "Gilroy-Semibold", },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        padding: 12,
        marginTop: 6,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
        alignItems: 'center'

    },
    cancel: { fontSize: 14, color: "#374151" },
    updateBtn: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 10,
    },
    updateText: { color: "#fff", fontWeight: "600" },
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
    arrow: { width: 18, height: 18, tintColor: "#444" },
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
    shiftRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },

    shiftInput: {
        width: "48%",
        height: 56,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },

    timeText: {
        fontSize: 16,
        color: "#222",
        fontFamily: "Gilroy-Medium",
    },

    placeholder: {
        color: "#9CA3AF",
    },

    clockIcon: {
        width: 22,
        height: 22,
        tintColor: "#222",
    },

});
