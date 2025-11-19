import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
} from "react-native";
import OtpRectangle from "../../Assets/Images/OtpRectangle.png";
import LottieView from "lottie-react-native";


const { width } = Dimensions.get("window");

const VerifyAccountScreen = ({ navigation }) => {

    const [showPopup, setShowPopup] = useState(false);
    const scale = useRef(new Animated.Value(0.6)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(80)).current;

    const showSuccessPopup = () => {
        setShowPopup(true);


        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                friction: 6,
                tension: 80,
                useNativeDriver: true,
            }),

            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),

            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(scale, {
                    toValue: 0.6,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 80,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => setShowPopup(false));
            navigation.navigate("MyTabs");
        }, 2000);

    };


    const [otp, setOtp] = useState(["", "", "", ""]);
    const [activeIndex, setActiveIndex] = useState(null);
    const inputsRef = useRef([]);
    const isFilled = otp.every((n) => n !== "");

    const handleInputChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text !== "" && index < 3) {
            inputsRef.current[index + 1].focus();
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.contentBox}>
                <Text style={styles.title}>Verify Your Account</Text>

                <Image
                    source={require("../../Assets/Images/email.png")}
                    style={styles.mailIcon}
                />

                <View style={styles.contentText}>
                    <Text style={styles.subTitle}>Check your inbox.</Text>
                    <Text style={styles.smallText}>
                        We’ve sent you an email with Confirmation
                    </Text>
                    <Text style={styles.emailText}>arunkumar77@gmail.com</Text>
                </View>

                <View style={styles.labelWrap}>
                    <Text style={styles.label}>Confirmation Code</Text>
                </View>


                <View style={styles.otpContainer}>
                    {otp.map((value, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputsRef.current[index] = ref)}
                            style={[
                                styles.otpBox,
                                { borderColor: activeIndex === index ? "#4A7EFF" : "#ddd" },
                            ]}
                            keyboardType="numeric"
                            maxLength={1}
                            value={value}
                            onFocus={() => setActiveIndex(index)}
                            onBlur={() => setActiveIndex(null)}
                            onChangeText={(text) => handleInputChange(text, index)}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[
                        styles.verifyBtn,
                        !isFilled && styles.disabledButton,
                    ]}
                    disabled={!isFilled}
                    onPress={showSuccessPopup}
                >
                    <Text style={styles.verifyText}>Verify</Text>
                </TouchableOpacity>


                <View style={styles.bottomTextRow}>
                    <TouchableOpacity>
                        <Text style={styles.resend}>Resend Code</Text>
                    </TouchableOpacity>
                    <Text style={styles.orText}> or </Text>
                    <TouchableOpacity>
                        <Text style={styles.logout}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>


            <Image source={OtpRectangle} style={styles.bottomGradient} />


            {showPopup && (
                <View style={styles.popupContainer}>
                    <Animated.View
                        style={[
                            styles.popupBox,
                            {
                                transform: [{ translateY }, { scale }],
                                opacity: opacity,
                            },
                        ]}
                    >
                        <LottieView
                            source={require("../../Assets/animations/success.json")}
                            autoPlay
                            loop={false}
                            style={{ width: 250, height: 150 }}
                        />

                        <Text style={styles.popupText}>You're all set!</Text>
                        <Text style={styles.popupSubText}>Viewing latest data now</Text>
                    </Animated.View>
                </View>
            )}


        </View>
    );
};

export default VerifyAccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    popupSubText: {
        fontSize: 14,
        color: "#777",
        marginTop: 6,
    },

    contentBox: {
        flex: 1,
        alignItems: "center",
        paddingTop: 150,
    },

    contentText: {
        width: "100%",
        alignSelf: "flex-start",
        paddingHorizontal: 60,
        marginTop: 20,
    },

    labelWrap: {
        alignSelf: "flex-start",
        paddingHorizontal: 62,
        marginTop: 30,
    },

    disabledButton: {
        backgroundColor: "#A8C1FF",
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#333",
    },

    mailIcon: {
        width: 65,
        height: 65,
        marginTop: 30,
        resizeMode: "contain",
    },

    subTitle: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: "400",
    },

    smallText: {
        fontSize: 12,
        marginTop: 4,
        color: "#777",
    },

    emailText: {
        fontSize: 16,
        marginTop: 6,
        color: "#555",
    },

    label: {
        fontSize: 14,
        fontWeight: "500",
    },

    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15,
        width: "80%",
    },

    otpBox: {
        width: 55,
        height: 55,
        borderWidth: 1,
        borderRadius: 10,
        textAlign: "center",
        fontSize: 22,
        marginHorizontal: 10,
    },

    verifyBtn: {
        backgroundColor: "#1A73E8",
        borderRadius: 10,
        paddingVertical: 14,
        width: width * 0.75,
        marginTop: 25,
        alignItems: "center",
    },

    verifyText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },

    bottomTextRow: {
        flexDirection: "row",
        marginTop: 20,
    },

    resend: {
        fontSize: 14,
        fontWeight: "400",
        color: "#202020",
        borderBottomWidth: 1,
        borderBottomColor: "#202020",
        paddingBottom: 3,
    },

    orText: {
        color: "#666",
        marginHorizontal: 5,
    },

    logout: {
        fontSize: 14,
        fontWeight: "400",
        color: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#202020",
        paddingBottom: 3,
    },

    bottomGradient: {
        width: "110%",
        height: 240,
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        resizeMode: "stretch",
    },

    popupContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },

    popupBox: {
        width: 220,
        backgroundColor: "#fff",
        paddingVertical: 25,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignItems: "center",
        elevation: 10,
    },

    popupText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginTop: 5,
    },
});
