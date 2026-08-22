import React, { useContext, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Platform } from "react-native";
import Sm_logo from "../../Assets/Images/Sm_Icon.png";
import { useNavigation } from "@react-navigation/native";
import SuccessModal from "../../ToastFile/ToastPage";
import { LoginContexts } from "../../Context/LoginContext";
import { storeData } from "../../Utils/Storage";
import { LOGGEDIN } from "../../Utils/Constant";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";

const ConfirmMPin = ({ route }) => {
  const navigation = useNavigation();
  const { CreateMpin, } = useContext(LoginContexts);
  const loginContext = useContext(LoginContexts)

  const [pinArr, setPinArr] = useState(["", "", "", ""]);
  const [pin, setPin] = useState("");
  const [mPinNo, setmPinNo] = useState(null);
  const inputs = useRef([]);

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [enterPinError, setEnterPinError] = useState()

  const handleChange =async(text, index) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    const newArr = [...pinArr];
    newArr[index] = cleanText;
    setPinArr(newArr);

    if (cleanText && index < 3) inputs.current[index + 1].focus();

    if (newArr.every(v => v !== "")) {
      setPin(newArr.join(""));
    }
  };

  console.log(pinArr)
  // const handleChange = async (text, index) => {
  //       const cleanText = text.replace(/[^0-9]/g, "");
  //       const newPin = [...pinArr];
  //       newPin[index] = cleanText;
  //       setPinArr(newPin);

  //       if (cleanText && index < 3) {
  //           inputs.current[index + 1].focus();
  //       }

  //       if(newPin.every((digit)=>digit !== "")){
  //           const pinNumber=newPin.join("");
  //           setPin(pinNumber)
  //           console.log(pinNumber)
  //       }
  //   }


  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && pinArr[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  }

  console.log("mpin", route.params.mPinNumber, pin);

  const validateForm = () => {
    let valid = true;

    setEnterPinError("")

    const isValid = pinArr.every(digit => digit !== "");

    if (!isValid) {
      setEnterPinError("Please enter a valid 4-digit MPIN");
      return false;
    }
    return valid;
  }

  const savePinClick = async () => {
    if (!validateForm()) return;
    if (route.params.mPinNumber !== pin) {
      setType("error");
      setMessage("MPIN mismatch");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
      return;
    }
    const data = {
      pin: Number(pin),
      platform: Platform.OS,
    }


    const res = await CreateMpin(data);

    console.log("response", res);


    if (res.status == 200) {
      //  loginContext.updatePinSetupStatus(false)
      loginContext.updateRoute("ConfirmMpin")
      storeData(LOGGEDIN, "true")
      loginContext.loggedin('true')
      setType("success");
      setMessage("MPIN Created Successfully");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);

        // navigation.replace("EnterMPin");
      }, 1500);
    } else {
      // loginContext.updatePinSetupStatus(true)
      setType("error");
      setMessage("MPIN creation failed");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false)
      }, 1500);

    }
  };

  return (
    <View style={{ paddingHorizontal: 20, flex: 1 }}>
      <SuccessModal visible={showModal} message={message} type={type} />

      <Image source={Sm_logo} style={styles.logo} />
      <Text style={styles.createText}>Confirm mPIN</Text>

      <View style={styles.pinContainer}>
        {pinArr.map((d, i) => (
          <TextInput
            key={i}
            ref={ref => (inputs.current[i] = ref)}
            style={styles.pinBox}
            keyboardType="number-pad"
            maxLength={1}
            value={d}
            onChangeText={(t) => {
              handleChange(t, i)
              setEnterPinError("")
            }}
            onKeyPress={(e) => handleKeyPress(e, i)}
          />
        ))}
      </View>
      {enterPinError && <ErrorMessage message={enterPinError} type="error" />}

      <TouchableOpacity onPress={savePinClick} style={styles.nextButton}>
        <Text style={styles.nextText}>Save mPIN</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  logo: { width: 151, height: 28.22, marginTop: 70, },
  createText: { fontSize: 27, fontWeight: 600, color: '#222222', marginTop: 20 },
  subtitle: { fontSize: 14, fontWeight: 400, color: '#4B4B4B', marginTop: 15 },
   pinContainer: {
        width: "100%", flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20,
        paddingLeft: 10, paddingRight: 10, height: 60, marginTop: 18
    },
    pinBox: {
        width: 60, height: 60, borderWidth: 1, borderColor: "#ccc", borderRadius: 12, textAlign: "center",
        fontSize: 20, color: "#000"
    },
  nextButton: { backgroundColor: '#00A32E', borderRadius: 8, paddingVertical: 20, alignItems: 'center', marginTop: 250 },
  nextText: { color: '#ffffff', fontSize: 16, fontWeight: 600 }

})

export default ConfirmMPin;


