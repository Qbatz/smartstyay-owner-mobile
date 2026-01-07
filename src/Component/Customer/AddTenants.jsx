import React, { useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, BackHandler,KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import Profile from "../../Assets/Images/Avatar.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import { launchImageLibrary } from 'react-native-image-picker';
import { useCustomer } from "../../Context/CustomerContext";
import { CommonContexts } from "../../Context/CommonContext";
import SuccessModal from "../../ToastFile/ToastPage";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";



export default function AddTenant() {
    const { addCustomer } = useCustomer();
    const { activeHostelId } = useContext(CommonContexts);
    const navigation = useNavigation();
    const [step, setStep] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [nameError, setNameError] = useState("")
    const [mobileError, setMobileError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [pincodeError, setPincodeError] = useState("");
    const [stateSearch, setStateSearch] = useState("");






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
    console.log("basicDetails", basicDetails)
    const [addressDetails, setAddressDetails] = useState({
        flat: "",
        area: "",
        landmark: "",
        pincode: "",
        city: "",
        state: "",
    });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const mobileRegex = /^[6-9][0-9]{9}$/;

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


    const handleCreateTenant = async () => {
        let valid = true;


        if (!basicDetails.firstName) {
            setNameError("Please enter first name");
            valid = false;
        }


     if (!basicDetails.mobile) {
  setMobileError("Please enter mobile number");
  valid = false;
} else if (!mobileRegex.test(basicDetails.mobile)) {
  setMobileError("Enter a valid 10 digit mobile number");
  valid = false;
}



        if (!valid) return;


        if (basicDetails.email && emailError) {
            setStep(1);
            return;
        }
        if (!isEmailValid) {
            setEmailError("Enter a valid email address");
            setStep(1);
            return;
        }

        if (
            addressDetails.pincode &&
            (addressDetails.pincode.length !== 6 || addressDetails.pincode.startsWith("0"))
        ) {
            setPincodeError(
                addressDetails.pincode.startsWith("0")
                    ? "Pincode should not start with 0"
                    : "Pincode must be 6 digits"
            );
            return;

        }

        const payloads = {

            customerInfo: {
                firstName: basicDetails.firstName,
                mobileNumber: basicDetails.mobile,
                type: 1,

                lastName: basicDetails.lastName || "",
                emailId: basicDetails.email || "",
            },
        };
        if (hasAnyAddress) {
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



        console.log("FINAL PAYLOAD 👉", payloads);

        const res = await addCustomer(activeHostelId, payloads, selectedImage);

        if (res?.data) {
            setModalType("success");
            setMessage(res.data);
            setShowSuccess(true);
            navigation.goBack();
            setTimeout(() => {
                setShowSuccess(false);

            }, 800);
        }

        else {
            const mobileMsg = res?.message?.mobileStatus || "";
            const emailMsg = res?.message?.emailStatus || "";

            setMobileError(mobileMsg);
            setEmailError(emailMsg);

            // 🔥 IMPORTANT: Go back to step 1 if basic error
            if (mobileMsg || emailMsg) {
                setStep(1);
            }
        }
    };




    return (
        <>
            <SuccessModal visible={showSuccess} message={message} type={modalType} />
           <SafeAreaView style={styles.container}>
             <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={ArrowLeft} style={styles.backIcon} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Add Tenant</Text>
                    </View>


                    <View style={styles.stepContainer}>

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
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "android" ? 0 : 0}
  >
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >

                   

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
                                <Text style={styles.label}>First Name <Text style={{ color: "red" }}>*</Text></Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter First Name"
                                    placeholderTextColor="#A1A1A1"
                                    value={basicDetails.firstName}
                                    onChangeText={(t) => {
                                        const onlyLetters = t.replace(/[^a-zA-Z\s]/g, "");
                                        setBasicDetails({ ...basicDetails, firstName: onlyLetters });
                                        setNameError("")
                                    }}
                                />
                                {nameError && <ErrorMessage message={nameError} type="error" />}
                                <Text style={styles.label}>Last Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Last Name"
                                    placeholderTextColor="#A1A1A1"
                                    value={basicDetails.lastName}
                                    onChangeText={(t) => {
                                        const onlyLetters = t.replace(/[^a-zA-Z\s]/g, "");
                                        setBasicDetails({ ...basicDetails, lastName: onlyLetters });
                                    }}
                                />

                                <Text style={styles.label}>Mobile Number <Text style={{ color: "red" }}>*</Text></Text>
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
                                            setBasicDetails({
                                                ...basicDetails,
                                                mobile: t.replace(/[^0-9]/g, ""),
                                            });
                                            setMobileError("");
                                        }}

                                    />

                                </View>
                                {mobileError && <ErrorMessage message={mobileError} type="error" />}


                                <Text style={styles.label}>Email ID</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Email ID"
                                    placeholderTextColor="#A1A1A1"
                                    value={basicDetails.email}
                                    onChangeText={(t) => {
                                        setBasicDetails({ ...basicDetails, email: t });

                                        if (!t) {
                                            setEmailError("");
                                        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)) {
                                            setEmailError("Enter a valid email address");
                                        } else {
                                            setEmailError("");
                                        }
                                    }}


                                />
                                {emailError && <ErrorMessage message={emailError} type="error" />}
                            </View>


                            <View style={styles.btnRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.secondaryBtn,

                                    ]}

                                    onPress={handleCreateTenant}  >
                                    <Text
                                        style={[
                                            styles.secondaryText

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
                                    onPress={() => setStep(2)}
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
                                        <Text style={styles.label}>Flat, House no., Building </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Flat, House no., Building..."
                                            placeholderTextColor="#9CA3AF"
                                            value={addressDetails.flat}
                                            onChangeText={(t) =>
                                                setAddressDetails({ ...addressDetails, flat: t })
                                            }
                                        />
                                        <Text style={styles.label}>Area , Street , Sector , Village</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Area"
                                            placeholderTextColor="#9CA3AF"
                                            value={addressDetails.area}
                                            onChangeText={(t) =>
                                                setAddressDetails({ ...addressDetails, area: t })
                                            }
                                        />

                                        <Text style={styles.label}>State</Text>

                                        <View style={{ position: "relative" }}>
                                            <TextInput
                                                style={styles.select}
                                                placeholder="Select state"
                                                placeholderTextColor="#9CA3AF"
                                                value={stateQuery || selectedState}
                                                onFocus={() => {
                                                    setStateOpen(true);
                                                    setStateQuery("");   // 🔥 cursor focus panna fresh search
                                                }}
                                                onChangeText={(t) => {
                                                    setStateQuery(t);    // 🔥 typing always search
                                                    setStateOpen(true);
                                                }}
                                            />


                                            <Image source={DownArrow} style={styles.arrowIcon} />

                                            {stateOpen && (
                                                <View style={styles.dropdownMenu}>
                                                    <ScrollView keyboardShouldPersistTaps="handled">
                                                        {filteredStateList.length > 0 ? (
                                                            filteredStateList.map((v, index) => (
                                                                <TouchableOpacity
                                                                    key={index}
                                                                    style={styles.option}
                                                                    onPress={() => {
                                                                        setSelectedState(v.label); // final value
                                                                        setStateQuery("");        // clear search
                                                                        setStateOpen(false);
                                                                    }}
                                                                >
                                                                    <Text style={styles.optionText}>{v.label}</Text>
                                                                </TouchableOpacity>

                                                            ))
                                                        ) : (
                                                            <Text style={styles.noResult}>No state found</Text>
                                                        )}
                                                    </ScrollView>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.label}>Landmark</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Ex : Near SBI Bank"
                                            placeholderTextColor="#9CA3AF"
                                            value={addressDetails.landmark}
                                            onChangeText={(t) =>
                                                setAddressDetails({ ...addressDetails, landmark: t })
                                            }
                                        />

                                        <Text style={styles.label}>Pincode</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="123456"
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            value={addressDetails.pincode}
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
                                                } else if (value.length < 6) {
                                                    setPincodeError("Pincode must be 6 digits");
                                                } else {
                                                    setPincodeError("");
                                                }
                                            }}

                                        />
                                        {pincodeError && <ErrorMessage message={pincodeError} type="error" />}

                                        <Text style={styles.label}>City</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Your City Name"
                                            placeholderTextColor="#9CA3AF"
                                            value={addressDetails.city}
                                            onChangeText={(t) =>
                                                setAddressDetails({ ...addressDetails, city: t })
                                            }
                                        />










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
                                            disabled={!isAddressValid}
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
        </>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 30
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
        zIndex: 9999,      // 🔥 important
        elevation: 20,     // 🔥 Android
        maxHeight: 200,    // 🔥 enable scrolling
    },

    // dropdownMenu: {
    //     position: "absolute",
    //     top: 50,
    //     left: 0,
    //     right: 0,
    //     backgroundColor: "#fff",
    //     borderWidth: 1,
    //     borderColor: "#ddd",
    //     borderRadius: 12,
    //     zIndex: 999,
    //     elevation: 10,
    // },

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
    searchInput: {
        height: 45,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 12,
        fontSize: 14,
        color: "#111827",
    },

    arrowIcon: {
        position: "absolute",
        right: 12,
        top: 14,
        width: 18,
        height: 18,
        tintColor: "#777",
    },

    noResult: {
        padding: 12,
        textAlign: "center",
        color: "#6B7280",
    },



});
