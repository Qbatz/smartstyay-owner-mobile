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
    TextInput, KeyboardAvoidingView, Platform, ScrollView, Keyboard
} from "react-native";
import { useCustomer } from "../../../Context/CustomerContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";

const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.50;

export default function EditBasicDetailsSheet({
    visible,
    onClose,
    customerDetails, onSuccess,

}) {
    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const { editBasicDetails } = useCustomer();

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [mobile, setMobile] = useState("")
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [firstNameError, setFirstNameError] = useState("")
    const [initialFirstName, setInitialFirstName] = useState("");
    const [initialLastName, setInitialLastName] = useState("");
    const [initialEmail, setInitialEmail] = useState("");
    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");



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
            const f = customerDetails.firstName || "";
            const l = customerDetails.lastName || "";
            const e = customerDetails.emailId || "";

            setFirstName(f);
            setLastName(l);
            setEmail(e);

            // 🔥 store initial values
            setInitialFirstName(f.trim());
            setInitialLastName(l.trim());
            setInitialEmail(e.trim().toLowerCase());
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

    const closeSheet = () => {
        Animated.timing(translateY, {
            toValue: SHEET_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(onClose);
    };


    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) {
                    translateY.setValue(g.dy);
                }
            },
            onPanResponderRelease: (_, g) => {
                g.dy > 120
                    ? closeSheet()
                    : Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
            },
        })
    ).current;

    if (!visible) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const handleUpdate = async () => {
        let valid = true;

        if (!firstName.trim()) {
            setFirstNameError("Please Enter First Name");
            valid = false;
        } else {
            setFirstNameError("");
        }

        if (email.trim() && !emailRegex.test(email.trim())) {
            setEmailError("Please enter a valid email address");
            valid = false;
        } else {
            setEmailError("");
        }

        if (!valid) return;

        // 🔥 NO CHANGES DETECTED CHECK
        if (
            firstName.trim() === initialFirstName &&
            (lastName?.trim() || "") === initialLastName &&
            (email?.trim().toLowerCase() || "") === initialEmail
        ) {
            // alert("No changes detected");
            setModalType("warning");
            setMessage("No changes detected");
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);


            }, 800);
            return;
        }

        const payloads = {
            firstName: firstName.trim(),
            lastName: lastName ? lastName.trim() : "",
            mailId: email ? email.trim().toLowerCase() : "",
        };

        console.log("payload", payloads);

        const res = await editBasicDetails(
            customerDetails.customerId,
            payloads
        );

        if (res.success) {
            // alert("Basic details updated successfully ✅");
            // await onSuccess();
            // closeSheet();
            setModalType("success");
            setMessage(res.data);
            setShowSuccess(true);
            await onSuccess();
            setTimeout(() => {
                setShowSuccess(false);
                closeSheet();

            }, 800);

        } else {
            const emailMsg = res?.message?.emailStatus || "";
            setEmailError(emailMsg);
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
                    {...panResponder.panHandlers}
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
                        >
                            <View style={styles.handle} />
                            <Text style={styles.title}>Edit Basic Details</Text>

                            <Text style={styles.label}>First Name <Text style={{ color: "red" }}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter FirstName"
                                value={firstName}
                                // onChangeText={(text) => {
                                //     setFirstName(text);
                                //     setFirstNameError("");
                                // }}
onChangeText={(text) => {
  const cleanText = text.replace(/[^a-zA-Z ]/g, "");
  setFirstName(cleanText);
  setFirstNameError("");
}}


                            />
                            {firstNameError && <ErrorMessage message={firstNameError} type="error" />}
                            <Text style={styles.label}>Last Name </Text>
                            <TextInput
                                style={styles.input}
                                value={lastName}
                                placeholder="Enter LastName"
                                // onChangeText={setLastName}
                                onChangeText={(text) => {
  const cleanText = text.replace(/[^a-zA-Z ]/g, "");
  setLastName(cleanText);
 
}}
                            />

                            {/* <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          style={styles.input}
          editable={false}
         value={
    countryCode
      ? `+${countryCode} ${mobile}`
      : mobile
  }
  onChangeText={setMobile}
        /> */}

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Email Id"
                                value={email}
                               onChangeText={(text) => {
  const cleanText = text
    .replace(/[^a-zA-Z0-9@._-]/g, "")
    .toLowerCase();

  setEmail(cleanText);
  setEmailError("");
}}

                            />
                            {emailError && <ErrorMessage message={emailError} type="error" />}

                            <View style={styles.footer}>
                                <TouchableOpacity onPress={closeSheet}>
                                    <Text style={styles.cancel}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
                                    <Text style={styles.updateText}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Animated.View>


            </View>
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
    label: { fontSize: 12, color: "#6B7280", marginTop: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        padding: 12,
        marginTop: 6,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        
    },
    cancel: { fontSize: 14, color: "#374151" },
    updateBtn: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 10,
    },
    updateText: { color: "#fff", fontWeight: "600" },
});
