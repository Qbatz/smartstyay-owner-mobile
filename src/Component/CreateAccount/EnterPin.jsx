import React, { useContext, useRef, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Animated, NativeModules, Platform } from "react-native";
import Sm_logo from "../../Assets/Images/Sm_Icon.png";
import { useNavigation } from "@react-navigation/native";
import SuccessModal from "../../ToastFile/ToastPage";
import { LoginContexts } from "../../Context/LoginContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

import WaveIcon from "../../Assets/Images/login_Rectangle.png";
import { updateFcmToken } from "../../Action/LoginAction";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";


const EnterMPin = (props) => {

    const { verifyMpin, updatePinSetupStatus } = useContext(LoginContexts)
    const navigation = useNavigation()
    const [createMpin, setCreateMpin] = useState(["", "", "", ""])
    const [mPinNumber, setmPinNumber] = useState(null)
    const inputs = useRef([])

    const { NotificationModule } = NativeModules;


    const [hostelList, setHostelList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("success");

    const insets = useSafeAreaInsets();
    const [showPopup, setShowPopup] = useState(false);
    const scale = useRef(new Animated.Value(0.6)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(80)).current;
    const BOTTOM_IMAGE_HEIGHT = 200;
    const [fcmToken, setFcmToken] = useState();
    const [enterPinError, setEnterPinError] = useState()

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
            ]).start(() => {
                setShowPopup(false);
                updatePinSetupStatus(true)
                //   navigation.replace("MyTabs");
            });
        }, 2000);
    };

    const fetchFcmTokenAsync = () => {
        NotificationModule.fetchFcmToken().then(r => {
            console.log(r)
            setFcmToken(r)
        })
        .catch(error => {
            console.log(error)
            setFcmToken(null)
        })
    }

    useEffect(() => {
        if (Platform.OS === "android") {
            fetchFcmTokenAsync();
        }
    }, [])



    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(rotation, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const rotateInterpolate = rotation.interpolate({
        inputRange: [-1, 1],
        outputRange: ["0deg", "10deg"], // waving angle
    });


    const handlePinChange = async (text, index) => {
        const cleanText = text.replace(/[^0-9]/g, "");
        const newPin = [...createMpin];
        newPin[index] = cleanText;
        setCreateMpin(newPin);

        if (cleanText && index < 3) {
            inputs.current[index + 1].focus();
        }

        if (newPin.every((digit) => digit !== "")) {
            const pinNumber = newPin.join("");
            setmPinNumber(pinNumber)
            console.log(pinNumber)
        }
    }

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && createMpin[index] === "" && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

     const validateForm=()=>{
        let valid=true;

        setEnterPinError("")

        const isValid = createMpin.every(digit => digit !== "");

        if (!isValid) {
            setEnterPinError("Please enter a valid 4-digit MPIN");
            return false;
        }
        return valid;        
    }

    const enterPinClick = async () => {
        if(!validateForm()) return;
        const res = await verifyMpin(Number(mPinNumber));
        console.log(res)

        if (res.status == 200) {
            fetchFcmToken(res.data)
            setType("success");
            setMessage("Login Successfully");
            setShowModal(true);
            showSuccessPopup()

            setTimeout(() => {
                setShowModal(false);

            }, 500);
        } else {
            setType("error");
            setMessage("Incorrect MPIN");
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
            }, 1500);
        }
    };

    const fetchFcmToken = async (authToken) => {
        try {
            if (fcmToken) {
                await updateFcmToken(fcmToken, authToken);
            }
        } catch (e) {
            console.log('fetchFcmToken failed:', e);
        }
    };






    const forgotMpinClick = () => {
        navigation.navigate('CreateMpin')
    }

    return <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <SuccessModal visible={showModal} message={message} type={type} />
        <View style={{ paddingTop: 70 }} >
            <Image source={Sm_logo} style={style.logo} />

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 15 }}>
                <Text style={style.title}>Welcome Back</Text>

                <Animated.Image
                    source={WaveIcon}
                    style={[
                        style.hand,
                        {
                            width: 25,
                            height: 25,
                            marginTop: 8,
                            marginLeft: 5,
                            transform: [{ rotate: rotateInterpolate }],
                        },
                    ]}
                />

            </View>

            <Text style={style.createText}>Enter mPIN</Text>

            <Text style={style.subtitle}>Please enter the mPIN </Text>

            <View style={style.pinContainer}>
                {createMpin.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputs.current[index] = ref)}
                        keyboardType="number-pad"
                        style={style.pinBox}
                        maxLength={1}
                        value={digit}
                        
                        onChangeText={(text) => {
  handlePinChange(text, index);
  setEnterPinError("");
}}

                        onKeyPress={(e) => handleKeyPress(e, index)}
                    />
                ))}
            </View>
            {enterPinError && <ErrorMessage message={enterPinError} type="error"/>}
            <View style={{ alignItems: 'flex-end', paddingTop: 20, paddingRight: 20 }}>
                <TouchableOpacity onPress={forgotMpinClick}
                >
                    <Text style={{ color: '#1E45E1', fontSize: 14, fontWeight: 400, textDecorationLine: 'underline', }}>
                        Forgot Mpin</Text>
                </TouchableOpacity>
            </View>



        </View>


        <View style={{ flex: 1, justifyContent: "center", }}>
            <TouchableOpacity onPress={enterPinClick} style={style.nextButton}>
                <Text style={style.nextText}>Enter mPIN</Text>
            </TouchableOpacity>
        </View>

        {showPopup && (
            <View style={style.popupContainer}>
                <Animated.View
                    style={[
                        style.popupBox,
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

                    <Text style={style.popupText}>You're all set!</Text>
                    <Text style={style.popupSubText}>Viewing latest data now</Text>
                </Animated.View>
            </View>
        )}



    </View>

}

const style = StyleSheet.create({
    logo: { width: 151, height: 28.22 },
    createText: { fontSize: 27, fontWeight: 600, color: '#222222', marginTop: 20 },
    subtitle: { fontSize: 14, fontWeight: 400, color: '#4B4B4B', marginTop: 15 },
    pinContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20, paddingLeft: 10, paddingRight: 10 },
    pinBox: {
        width: 60, heiht: 70, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, textAlign: "center",
        fontSize: 20, color: "#000"
    },
    nextButton: { backgroundColor: '#1A73E8', borderRadius: 8, paddingVertical: 20, alignItems: 'center' },
    nextText: { color: '#ffffff', fontSize: 16, fontWeight: 600 },
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginTop: 10,
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
    popupSubText: {
        fontSize: 14,
        color: "#777",
        marginTop: 6,
    },


})

export default EnterMPin