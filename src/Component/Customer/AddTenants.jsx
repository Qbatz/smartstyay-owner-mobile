import React, { useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, BackHandler, KeyboardAvoidingView, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import Profile from "../../Assets/Images/Avatar.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import { launchImageLibrary } from 'react-native-image-picker';
import { useCustomer } from "../../Context/CustomerContext";
import { CommonContexts } from "../../Context/CommonContext";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";



export default function AddTenant({ route, navigation }) {

    const { refreshWalkins } = route.params || {};
    const { addCustomer } = useCustomer();
    const { activeHostelId } = useContext(CommonContexts);

    const [step, setStep] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [mobileError, setMobileError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [pincodeError, setPincodeError] = useState("")

    console.log("refreshWalkins", refreshWalkins)



    const isMobileDuplicate = (mobile) => {
        return refreshWalkins.some(
            (item) => item.mobile === mobile
        );
    };
    const isEmailDuplicate = (email) => {
        if (!email) return false;

        return refreshWalkins.some(
            (item) =>
                item.emailId &&
                item.emailId.toLowerCase() === email.toLowerCase()
        );
    };



    console.log(selectedImage)

    const pickImage = () => {
        let options = {
            mediaType: 'photo',
            maxWidth: 500,
            maxHeight: 500,
            quality: 0.7,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled');
            } else if (response.errorMessage) {
                console.log('Error:', response.errorMessage);
            } else {
                const source = { uri: response.assets[0].uri };
                setSelectedImage(source);
            }
        });
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (step === 2) {
                    setStep(1);
                    return true;
                } else if (navigation.canGoBack()) {
                    navigation.goBack();
                    return true;
                }
                return false;
            };

            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );

            return () => subscription.remove();
        }, [navigation, step])
    );

    const [basicDetails, setBasicDetails] = useState({
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
    });

    const [addressDetails, setAddressDetails] = useState({
        flat: "",
        area: "",
        landmark: "",
        pincode: "",
        city: "",
        state: "",
    });

    const isBasicValid =
        basicDetails.firstName.trim().length > 0 &&
        basicDetails.mobile.trim().length === 10;



    const isAddressValid =
        addressDetails.flat.trim() !== "" &&
        addressDetails.pincode.trim() !== "" &&
        addressDetails.city.trim() !== "" &&
        selectedState !== "Select State" &&
        addressDetails.landmark.trim() !== "";



    const [selectedState, setSelectedState] = useState("Select State");


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
    const validateMobile = (value) => {
        if (!value) return "Mobile number is required";
        if (value.length !== 10) return "Mobile number must be 10 digits";
        if (value.startsWith("0")) return "Mobile number cannot start with 0";
        return "";
    };

    const validatePincode = (value) => {

        if (!value) return "";

        if (value.length !== 6) return "Pincode must be 6 digits";
        if (value.startsWith("0")) return "Pincode cannot start with 0";

        return "";
    };
    const [apiError, setApiError] = useState(false);
    const handleNext = () => {
        // mobile basic validation
        const mobileErr = validateMobile(basicDetails.mobile);
        setMobileError(mobileErr);

        if (mobileErr) return;

        // 🔥 duplicate mobile check
        if (isMobileDuplicate(basicDetails.mobile)) {
            setMobileError("This mobile number already exists");
            return;
        }

        // 🔥 duplicate email check
        if (isEmailDuplicate(basicDetails.email)) {
            setEmailError("This email ID already exists");
            return;
        }

        // ✅ all good → go next step
        setStep(2);
    };


    const handleCreateTenant = async () => {
        const mobileErr = validateMobile(basicDetails.mobile);
        const pinErr = validatePincode(addressDetails.pincode);

        setMobileError(mobileErr);
        setPincodeError(pinErr);


        if (mobileErr || pinErr) return;
        const hasAddress =
            addressDetails.flat ||
            addressDetails.area ||
            addressDetails.landmark ||
            addressDetails.city ||
            addressDetails.pincode ||
            selectedState !== "Select State";

        const payloads = {
            customerInfo: {
                firstName: basicDetails.firstName,
                mobileNumber: basicDetails.mobile,
                type: 1,
                ...(basicDetails.lastName && { lastName: basicDetails.lastName }),
                ...(basicDetails.email && { emailId: basicDetails.email }),
            },
        };

        if (hasAddress) {
            payloads.customerInfo.address = {
                ...(addressDetails.flat && { houseNo: addressDetails.flat }),
                ...(addressDetails.area && { street: addressDetails.area }),
                ...(addressDetails.landmark && { landmark: addressDetails.landmark }),
                ...(addressDetails.city && { city: addressDetails.city }),
                ...(addressDetails.pincode && {
                    pincode: Number(addressDetails.pincode),
                }),
                ...(selectedState !== "Select State" && { state: selectedState }),
            };
        }

        const res = await addCustomer(activeHostelId, payloads, selectedImage);

        if (res?.data) {
            alert("Customer added successfully ✅");
            navigation.goBack();
        } else {

            console.log("res", res.message.mobileStatus)
            setMobileError(res.message.mobileStatus)
            setEmailError(res.message.emailStatus)
        }
    };

    console.log({
        flat: addressDetails.flat,
        area: addressDetails.area,
        landmark: addressDetails.landmark,
        city: addressDetails.city,
        pincode: addressDetails.pincode,
        selectedState,
        isAddressValid,
    });




    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 10}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={ArrowLeft} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Tenant</Text>
                </View>
                <View style={styles.stepContainer}>
                    {/* STEP 1 */}
                    <View style={styles.stepItem}>
                        <View
                            style={[
                                styles.stepCircle,
                                step === 1 && { backgroundColor: "#2D6CDF" },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.stepNumber,
                                    step === 1 && { color: "#fff" },
                                ]}
                            >
                                1
                            </Text>
                        </View>
                        <Text
                            style={[
                                styles.stepLabel,
                                step === 1 && { color: "#2D6CDF", fontWeight: "600" },
                            ]}
                        >
                            Basic Details
                        </Text>
                    </View>

                    {/* LINE IN CENTER */}
                    <View style={styles.stepLine} />

                    {/* STEP 2 */}
                    <View style={styles.stepItem}>
                        <View
                            style={[
                                styles.stepCircle,
                                step === 2 && { backgroundColor: "#2D6CDF" },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.stepNumber,
                                    step === 2 && { color: "#fff" },
                                ]}
                            >
                                2
                            </Text>
                        </View>
                        <Text
                            style={[
                                styles.stepLabel,
                                step === 2 && { color: "#2D6CDF", fontWeight: "600" },
                            ]}
                        >
                            Address Details
                        </Text>
                    </View>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 120 }}
                >



                    {/* STEPPER */}


                    {step === 1 && (
                        <>


                            <View style={styles.profileSection}>


                                <View style={styles.profileWrapper}>
                                    <Image
                                        source={selectedImage ? selectedImage : Profile}
                                        style={styles.profileImage}
                                    />


                                    {/* <TouchableOpacity style={styles.editIconWrapper}>
                                    <Image
                                        source={require("../../Assets/Images/edit.png")}
                                        style={styles.editIcon}
                                    />
                                </TouchableOpacity> */}
                                    <TouchableOpacity style={styles.editIconWrapper} onPress={pickImage}>
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



                            <View style={styles.form}>
                                <Text style={styles.label}>First Name *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter First Name"
                                    placeholderTextColor="#A1A1A1"
                                    value={basicDetails.firstName}
                                    onChangeText={(t) =>
                                        setBasicDetails({ ...basicDetails, firstName: t })
                                    }
                                />

                                <Text style={styles.label}>Last Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Last Name"
                                    placeholderTextColor="#A1A1A1"
                                    value={basicDetails.lastName}
                                    onChangeText={(t) =>
                                        setBasicDetails({ ...basicDetails, lastName: t })
                                    }
                                />

                                <Text style={styles.label}>Mobile Number *</Text>
                                <View style={styles.mobileWrapper}>
                                    <Text style={styles.countryCode}>+91</Text>
                                    <TextInput
                                        style={styles.mobileInput}
                                        keyboardType="number-pad"
                                        placeholder="9876543210"
                                        placeholderTextColor="#A1A1A1"
                                        maxLength={10}
                                        value={basicDetails.mobile}
                                        onChangeText={(t) => {
                                            const value = t.replace(/[^0-9]/g, "");

                                            setBasicDetails({
                                                ...basicDetails,
                                                mobile: value,
                                            });

                                            setMobileError("");
                                        }}

                                    />

                                </View>
                                {mobileError && (
                                    <ErrorMessage message={mobileError} type="error" />
                                )}
                                <Text style={styles.label}>Email ID</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Email ID"
                                    value={basicDetails.email}
                                    onChangeText={(t) => {
                                        setBasicDetails({ ...basicDetails, email: t });
                                        setEmailError("");
                                    }}
                                />
                            </View>
                            {emailError && (
                                <ErrorMessage message={emailError} type="error" />
                            )}

                            <View style={styles.btnRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.secondaryBtn,
                                        !isBasicValid && styles.secondaryBtnDisabled
                                    ]}
                                    disabled={!isBasicValid}
                                    onPress={handleCreateTenant}  >
                                    <Text
                                        style={[
                                            styles.secondaryText,
                                            !isBasicValid && styles.secondaryTextDisabled
                                        ]}
                                    >
                                        Save Info
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.primaryBtn,
                                        !isBasicValid && styles.primaryBtnDisabled
                                    ]}
                                    disabled={!isBasicValid}
                                    onPress={handleNext}
                                >
                                    <Text
                                        style={[
                                            styles.primaryText,
                                            !isBasicValid && styles.primaryTextDisabled
                                        ]}
                                    >
                                        Next
                                    </Text>
                                </TouchableOpacity>
                            </View>


                        </>
                    )}


                    {/* STEP 2 */}
                    {step === 2 && (
                        <>
                            <SafeAreaView style={styles.container1}>
                                <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

                                    <View style={styles.form}>
                                        <Text style={styles.label}>Flat, House no., Building *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Flat, House no., Building..."
                                            value={addressDetails.flat}
                                            onChangeText={(t) =>
                                                setAddressDetails({ ...addressDetails, flat: t })
                                            }
                                        />
                                        <Text style={styles.label}>Area , Street , Sector , Village *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Area"
                                            value={addressDetails.area}
                                            onChangeText={(t) =>
                                                setAddressDetails({ ...addressDetails, area: t })
                                            }
                                        />
                                        <Text style={styles.label}>Landmark *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Ex : Near SBI Bank"
                                            value={addressDetails.landmark}
                                            onChangeText={(t) =>
                                                setAddressDetails({ ...addressDetails, landmark: t })
                                            }
                                        />

                                        <Text style={styles.label}>Pincode *</Text>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="number-pad"
                                            placeholder="123 456"
                                            maxLength={6}
                                            value={addressDetails.pincode}
                                            onChangeText={(t) => {
                                                const value = t.replace(/[^0-9]/g, "");

                                                setAddressDetails({
                                                    ...addressDetails,
                                                    pincode: value,
                                                });

                                                setPincodeError(""); // ✅ clear error while typing
                                            }}
                                        />
                                        {pincodeError && (
                                            <ErrorMessage message={pincodeError} type="error" />
                                        )}
                                        <Text style={styles.label}>City *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Your City Name"
                                            value={addressDetails.city}
                                            onChangeText={(t) =>
                                                setAddressDetails({ ...addressDetails, city: t })
                                            }
                                        />






                                        <Text style={styles.label}>State</Text>

                                        <View style={{ position: "relative" }}>
                                            <TouchableOpacity
                                                style={styles.select}
                                                onPress={() => setStateOpen(!stateOpen)}
                                                activeOpacity={0.9}
                                            >
                                                <Text style={styles.selectText}>
                                                    {selectedState || "Select State"}
                                                </Text>
                                                <Image source={DownArrow} style={styles.arrow} />
                                            </TouchableOpacity>

                                            {stateOpen && (
                                                <View style={styles.dropdownMenu}>
                                                    <ScrollView style={{ maxHeight: 160 }}>
                                                        {stateList.map((v, index) => (
                                                            <TouchableOpacity
                                                                key={index}
                                                                style={styles.option}
                                                                onPress={() => {
                                                                    setSelectedState(v.label);
                                                                    setStateOpen(false);
                                                                }}
                                                            >
                                                                <Text style={styles.optionText}>{v.label}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}
                                        </View>



                                    </View>


                                    <View style={styles.btnRow}>
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

                                            // onPress={() => navigation.goBack()}
                                            onPress={handleCreateTenant}
                                        >
                                            <Text
                                                style={[styles.primaryText,]}
                                            >
                                                Create Tenant
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </SafeAreaView>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 50
    },
    container1: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 10
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 15,
    },
    backIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#111827",
    },
    stepContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: "#F4F8FF",
        padding: 13,
        borderRadius: 15
    },

    stepItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        marginBottom: 12,
        overflow: "hidden",
    },

    picker: {
        height: 50,
        color: "#111827",
    },

    stepLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E5E7EB",
        marginHorizontal: 10,
    },
    stepCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: "#2D6CDF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
    },
    stepNumber: {
        fontSize: 13,
        color: "#2D6CDF",
        fontWeight: "600",
    },
    stepLabel: {
        fontSize: 13,
        color: "#6B7280",
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
        fontWeight: "600",
        color: "#111827",
    },
    profileSub: {
        fontSize: 12,
        color: "#6B7280",
        lineHeight: 16,
        width: 220,
        marginTop: 4,
    },
    form: {
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        color: "#111827",
        marginBottom: 6,
        marginTop: 4,
    },

    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 50,
        fontSize: 14,
        backgroundColor: "#fff",
        marginBottom: 12,
    },

    mobileWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 12,
    },

    countryCode: {
        fontSize: 14,
        color: "#111",
        marginRight: 10,
        fontWeight: "500",
    },

    mobileInput: {
        flex: 1,
        fontSize: 14,
        color: "#111",
    },

    btnRow: {
        flexDirection: "row",
        justifyContent: "flex-end",   // ← centers the buttons
        alignItems: "center",
        marginTop: 20,
        marginBottom: 40,
    },


    primaryBtn: {
        borderWidth: 1,
        borderColor: "#2D6CDF",
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 8,
        backgroundColor: "#fff",
    },

    primaryText: {
        color: "#2D6CDF",
        fontSize: 15,
        fontWeight: "600",
    },

    secondaryBtn: {
        backgroundColor: "#2D6CDF",
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 8,
        marginRight: 12,
    },

    secondaryText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    secondaryBtnDisabled: {
        backgroundColor: "#A5B4FC",
    },

    secondaryTextDisabled: {
        color: "#E0E7FF",
    },


    primaryBtnDisabled: {
        borderColor: "#A5B4FC",
        backgroundColor: "transparent",
    },

    primaryTextDisabled: {
        color: "#A5B4FC",
    },







    dropdownInput: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 14,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    dropdownText: {
        fontSize: 14,
        color: "#111827",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "center",
        padding: 20,
    },

    modalBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        maxHeight: "70%",
    },

    modalItem: {
        paddingVertical: 12,
        borderBottomColor: "#E5E7EB",
        borderBottomWidth: 1,
    },

    modalItemText: {
        fontSize: 16,
        color: "#111",
    },

    modalCancel: {
        paddingVertical: 12,
        alignItems: "center",
    },


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
    // dropdownMenu: {
    //     position: "absolute",
    //     top: 50,
    //     left: 0,
    //     right: 0,
    //     backgroundColor: "#fff",
    //     borderWidth: 1,
    //     borderColor: "#ddd",
    //     borderRadius: 12,
    //     zIndex: 9999,   // 🔥 increase zIndex
    //     elevation: 10,
    //     maxHeight: 250, // 🔥 ensure scroll works
    // }



    selectedOption: {
        backgroundColor: "#1E45E1",
    },
    selectedOptionText: {
        color: "#fff",
        fontWeight: "600"
    },


});
