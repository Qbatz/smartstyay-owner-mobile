import React, { useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity,Dimensions } from "react-native";
import Sm_logo from "../../Assets/Images/Sm_Icon.png";
import { useNavigation } from "@react-navigation/native";
import { LoginContexts } from "../../Context/LoginContext";

const { width } = Dimensions.get("window");

const CreateMpin = (props) => {

    const navigation=useNavigation();




    const [createMpin, setCreateMpin] = useState(["", "", "", ""])
    const [mPinNo,setmPinNo]=useState(null);
    const inputs = useRef([])
    const isFilled = createMpin.every((n) => n !== "");

    console.log(createMpin)

    const handlePinChange = async (text, index) => {
        const newPin = [...createMpin];
        newPin[index] = text;
        setCreateMpin(newPin);

        if (text && index < 3) {
            inputs.current[index + 1].focus();
        }

        if(newPin.every((digit)=>digit !== "")){
            const pinNumber=newPin.join("");
            setmPinNo(pinNumber)
            console.log(pinNumber)
        }
    }

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && createMpin[index] === "" && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const nextClick=()=>{
        navigation.navigate('ConfirmMPin',{mPinNumber:mPinNo})
        console.log("mpin", mPinNo);
        
    }

  

    return <View style={{ paddingHorizontal: 20,flex:1}}>
        <View>
             <Image source={Sm_logo} style={style.logo} />

        <Text style={style.createText}>Create mPIN</Text>

        <Text style={style.subtitle}>Create your 4-digit unique mPin for smooth signin</Text>

        <View style={style.pinContainer}>
            {createMpin.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => (inputs.current[index] = ref)}
                    keyboardType="number-pad"
                    style={style.pinBox}
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handlePinChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                />
            ))}
        </View>

        </View>

       

        <TouchableOpacity onPress={nextClick} style={[style.nextButton, !isFilled && style.disabledButton]}
        disabled={!isFilled}>
            <Text style={style.nextText}>Next</Text>
        </TouchableOpacity>


    </View>

}

const style = StyleSheet.create({
    logo: { width: 151, height: 28.22, marginTop: 70, },
    createText: { fontSize: 27, fontWeight: 600, color: '#222222', marginTop: 20 },
    subtitle: { fontSize: 14, fontWeight: 400, color: '#4B4B4B', marginTop: 15 },
    pinContainer: { flexDirection: 'row',justifyContent:'space-between',paddingTop:20,paddingLeft:20,paddingRight:80 },
    pinBox: {
        width: 50, heiht: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, textAlign: "center",
        fontSize: 20, color: "#000"
    },
    nextButton:{backgroundColor: "#1A73E8",
        borderRadius: 10,
        paddingVertical: 14,
        marginTop: 250,
        alignItems: "center",},
    nextText:{color:'#ffffff',fontSize:16,fontWeight:600},
    disabledButton: {
        backgroundColor: "#A8C1FF",
    },

})

export default CreateMpin;