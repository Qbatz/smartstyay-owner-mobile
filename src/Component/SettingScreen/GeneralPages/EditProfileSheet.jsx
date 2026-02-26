import React, { useRef, useState, useEffect, useContext } from "react";
import {
    Animated, BackHandler, Keyboard, PanResponder, StyleSheet, Text, View,
    TouchableWithoutFeedback, ScrollView, TouchableOpacity, Image, TextInput
} from "react-native";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import EyeOpen from "../../../Assets/Images/Eye.png";
import EyeClose from "../../../Assets/Images/EyeIcon.png";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import { useGeneral } from "../../../Context/GeneralContext";
import { ExpensesContext } from "../../../Context/ExpensesContext";


export default function EditProfileSheet({ visible, onClose, profileData,onSuccess }) {


    const translateY = useRef(new Animated.Value(500)).current;
    const [keyboardHeight, setKeyboardHeight] = useState(0)

    const { activeHostelId } = useContext(CommonContexts);
    const { updateProfile } = useGeneral();
    const {GetProfileDetails}=useContext(ExpensesContext)
    const { getRoleByHostel, addUser, updateUser } = UseSetting();
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [roles, setRoles] = useState([])
    const [nameError, setNameError] = useState("")
    const [mobilError, setMobileError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [roleError, setRoleError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [initialData, setInitialData] = useState(null);
    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");

    const [countryOpen, setCountryOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({
        code: "+91",
        label: "India",
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[1-9]\d{9}$/;


    useEffect(() => {
        if (!visible) return;

        const backAction = () => {
            onClose();

            return true;
        };

        const handler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => handler.remove();
    }, [visible]);

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : 500,
            duration: 260,
            useNativeDriver: true,
        }).start();
    }, [visible]);


    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
        onPanResponderMove: (_, g) => {
            if (g.dy > 0) translateY.setValue(g.dy);
        },

        onPanResponderRelease: (_, g) => {
            if (g.dy > 120) {
                onClose();
                setNameError("");
                setEmailError("");
                setMobileError("");
                setPasswordError("");
                setRoleError("");
            } else {
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        },

    });
    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height - 40);
        });

        const hide = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    { console.log("profiledat", profileData) }
    useEffect(() => {
        if (!visible) return;

        if (profileData) {
            const init = {
                name: profileData?.firstName || "",
                lastName: profileData?.lastName || "",
                email: profileData?.mailId || "",
                mobile: profileData?.mobileNo || "",
            };

            setInitialData(init);

            setName(init.name);
            setLastName(init.lastName)
            setEmail(init.email);
            setMobile(init.mobile);
        } else {
            setInitialData(null);
            setName("");
            setLastName("")
            setEmail("");
            setMobile("");

        }
    }, [profileData, visible]);

    const isNoChangeDetected = () => {
        if (!initialData) return false;

        return (
            name.trim() === initialData.name.trim() &&
            lastName.trim() === initialData.lastName.trim() &&
            email.trim() === initialData.email.trim() &&
            mobile.trim() === initialData.mobile.trim()
        );
    };

    console.log({
        name,
        initialName: initialData?.name,
        lastName,
        initialLastName: initialData?.lastName,
        email,
        initialEmail: initialData?.email,
        mobile,
        initialMobile: initialData?.mobile,
    });


    const handleUpdateProfile = async () => {
        let valid = true;

        setNameError("");
        setEmailError("");
        setMobileError("");
        setPasswordError("");
        setRoleError("");

        if (!name.trim()) {
            setNameError("Please Enter Name");
            valid = false;
        }

        if (!email.trim()) {
            setEmailError("Please Enter Email ID");
            valid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError("Enter valid email");
            valid = false;
        }

        if (!mobile.trim()) {
            setMobileError("Please Enter Mobile Number");
            valid = false;
        } else if (mobile.length !== 10) {
            setMobileError("Mobile number must be 10 digits");
            valid = false;
        }

        if (!valid) return;

        if (isNoChangeDetected()) {

            setModalType("warning");
            setMessage("No changes detected");
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false)
            }, 800);
            return;

        }

        const payload = {
            firstName: name.trim(),
            lastName: lastName.trim(),
            emailId: email.trim(),
            mobile: String(mobile),

        };

        const formData = new FormData();

        const jsonBase64 = btoa(JSON.stringify(payload));

        formData.append("payloads", {
            uri: "data:application/json;base64," + jsonBase64,
            type: "application/json",
            name: "payload.json",
        })

        const res = await updateProfile(formData);

        if (res.success) {
            setModalType("success");
            setMessage(res.data);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false)
                onClose();

                 GetProfileDetails();
            }, 1500);
        } else {
            setModalType("warning");
            setMessage(res.data);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false)
            }, 1500);

        }

        console.log(res)



    }




    if (!visible) return null;


    return (
        <>

            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>


                <Animated.View
                    style={[
                        styles.sheet,
                        { transform: [{ translateY }], paddingBottom: keyboardHeight }
                    ]}
                    {...panResponder.panHandlers}
                >

                    <View style={styles.handle} />
                    <ScrollView
                        style={{ paddingHorizontal: 20 }}
                        contentContainerStyle={{ paddingBottom: 50 }}
                        showsVerticalScrollIndicator={false}
                    >

                        <Text style={styles.title}>Edit Profile</Text>


                        <Text style={styles.label}>First Name <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput style={styles.input} placeholder="Enter First Name" value={name}
                            onChangeText={(text) => {
                                const filtered = text.replace(/[^A-Za-z]/g, "");
                                setName(filtered);
                                setNameError("");
                            }} />
                        {nameError && (
                            <ErrorMessage message={nameError} type="error" />
                        )}

                        <Text style={styles.label}>Last Name</Text>
                        <TextInput style={styles.input} placeholder="Enter Last Name" value={lastName}
                            onChangeText={(text) => {
                                const filtered = text.replace(/[^A-Za-z]/g, "");
                                setLastName(filtered);
                                setNameError("");
                            }} />

                        <Text style={styles.label}>Email ID <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput style={styles.input} placeholder="Enter Email" value={email}
                            onChangeText={(text) => {
                                const filtered = text.toLowerCase().replace(/[^A-Za-z0-9@#./]/g, "");
                                setEmail(filtered);
                                setEmailError("");
                            }} />
                        {emailError && (
                            <ErrorMessage message={emailError} type="error" />
                        )}

                        <Text style={styles.label}>Mobile Number <Text style={{ color: 'red' }}>*</Text></Text>
                        {/* <TextInput style={styles.input} placeholder="+91 98765 43210" value={mobile}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={(text) => {
                const filtered = text.replace(/[^0-9]/g, "");
                setMobile(filtered);
                setMobileError("");
              }}
            /> */}
                        <View style={styles.mobileWrapper}>

                            {/* COUNTRY DROPDOWN */}
                            <View style={{ position: "relative" }}>
                                <TouchableOpacity
                                    style={styles.countryDropdown}
                                    onPress={() => setCountryOpen(!countryOpen)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.countryCodeText}>
                                        {selectedCountry.code}
                                    </Text>
                                    <Image
                                        source={require("../../../Assets/Images/direction-down.png")}
                                        style={styles.countryArrow}
                                    />
                                </TouchableOpacity>

                                {countryOpen && (
                                    <>
                                        <TouchableWithoutFeedback onPress={() => setCountryOpen(false)}>
                                            <View style={styles.dropdownOverlay} />
                                        </TouchableWithoutFeedback>

                                        <View style={styles.countryDropdownMenu}>
                                            <ScrollView>
                                                {countryList.map((item, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        style={styles.countryOption}
                                                        onPress={() => {
                                                            setSelectedCountry(item);
                                                            setCountryOpen(false);
                                                        }}
                                                    >
                                                        <Text style={styles.countryOptionText}>
                                                            {item.label} ({item.code})
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </>
                                )}
                            </View>

                            {/* MOBILE INPUT */}
                            <TextInput
                                style={styles.mobileInput}
                                placeholder="9876543210"
                                keyboardType="numeric"
                                maxLength={10}
                                value={mobile}
                                onChangeText={(text) => {
                                    const filtered = text.replace(/[^0-9]/g, "");
                                    setMobile(filtered);
                                    setMobileError("");
                                }}
                            />
                        </View>

                        {mobilError && (
                            <ErrorMessage message={mobilError} type="error" />
                        )}





                        {/* {roleError && (
                    <ErrorMessage message={roleError} type="error" />
                )} */}






                        {/* Buttons */}
                        <View style={styles.btnRow}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.addBtn} onPress={handleUpdateProfile}>
                                <Text style={styles.addText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </>
    )

}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    sheet: {
        maxHeight: "90%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 10,
    },
    handle: {
        width: 50,
        height: 5,
        backgroundColor: "#D6D6D6",
        borderRadius: 4,
        alignSelf: "center",
        marginBottom: 14,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 18,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 14,
    },

    input: {
        borderWidth: 1,
        borderColor: "#D4D4D4",
        borderRadius: 10,
        padding: 12,
        marginTop: 6,
        fontSize: 15,
    },
    mobileWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D4D4D4",
        borderRadius: 10,
        marginTop: 6,
    },

    countryDropdown: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderRightWidth: 1,
        borderRightColor: "#E5E7EB",
        height: 50,
    },

    countryCodeText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#111",
        marginRight: 4,
    },

    countryArrow: {
        width: 14,
        height: 14,
        tintColor: "#6A6A6A",
    },

    mobileInput: {
        flex: 1,
        paddingHorizontal: 12,
        fontSize: 15,
        height: 50,
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

    dropdownOverlay: {
        position: "absolute",
        top: -1000,
        left: -1000,
        right: -1000,
        bottom: -1000,
    },



    dropdownBox: {
        borderWidth: 1,
        borderColor: "#D4D4D4",
        borderRadius: 10,
        padding: 14,
        marginTop: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    arrowIcon: {
        width: 18,
        height: 18,
        tintColor: "#6A6A6A",
    },

    dropdownList: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 10,
        backgroundColor: "#fff",
        overflow: "hidden",
    },

    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    dropdownText: {
        fontSize: 15,
    },

    textarea: {
        borderWidth: 1,
        borderColor: "#D4D4D4",
        borderRadius: 10,
        padding: 14,
        marginTop: 6,
        height: 110,
        textAlignVertical: "top",
    },

    btnRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 28,
        marginBottom: 30,
    },

    cancelBtn: {
        paddingVertical: 12,
        paddingHorizontal: 32,
    },

    cancelText: {
        fontSize: 16,
        color: "#656565",
    },

    addBtn: {
        backgroundColor: "#1D5BEE",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
    },

    addText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    dropdownMenu: {
        position: "absolute",
        left: 0,
        right: 0,
        top: "67%",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
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

    passwordWrapper: {
        position: "relative",
        justifyContent: "center",
    },

    passwordInput: {
        borderWidth: 1,
        borderColor: "#D4D4D4",
        borderRadius: 10,
        padding: 12,
        paddingRight: 45,   // space for eye icon
        marginTop: 6,
        fontSize: 15,
    },

    eyeButton: {
        position: "absolute",
        right: 12,
        top: 22,  // perfect alignment
    },

    eyeIcon: {
        width: 20,
        height: 20,
        tintColor: "#6A6A6A",
    },
})