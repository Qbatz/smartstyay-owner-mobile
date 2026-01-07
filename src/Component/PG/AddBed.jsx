import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  Animated, PanResponder, Keyboard, TouchableWithoutFeedback, StyleSheet,ScrollView
} from "react-native";
import { useFloor } from "../../Context/PayingGuestContext";
import { CommonContexts } from "../../Context/CommonContext";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../ToastFile/ToastPage";

export default function AddBedBottomSheet({ visible, onClose, selectedRoomId, onBedAdded,editBedData }) {
  const translateY = useRef(new Animated.Value(300)).current;
  const isEdit = !!editBedData;
  console.log("editBedData",editBedData)
 



const amountRef = useRef(null);

  const { addBed, getAllBedsByRoom,updateBed  } = useFloor();

  const { activeHostelId } = useContext(CommonContexts);


  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const safeKeyboardHeight = keyboardHeight > 0 ? 240 : 0;
  const [bedName, setBedName] = useState("");
  const [amount, setAmount] = useState("");
  const [bedNameError, setBedNameError] = useState("")
  const [amountError, setAmountError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [bedId,setBedId] = useState("")
  const [initialBedName, setInitialBedName] = useState("");
const [initialAmount, setInitialAmount] = useState("");



  const isDisabled =
  !bedName?.trim() || !String(amount)?.trim();



 useEffect(() => {
  if (isEdit && editBedData) {
    const name = editBedData.bedName ?? "";
    const amt = String(editBedData?.rentAmount ?? "");

    setBedName(name);
    setAmount(amt);
    setBedId(editBedData?.bedId);

    setInitialBedName(name.trim());
    setInitialAmount(amt.trim());
  }
}, [editBedData]);


  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setBedName("");
        setAmount("");
        setBedNameError("")
      });
    }
  }, [visible]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) onClose();
      else
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
    },
  });
  useEffect(() => {
    if (!visible) return;

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
  }, [visible]);



  if (!visible) return null;
  const handleSaveBed = async () => {
  let valid = true;

  const trimmedBedName = bedName.trim();
  const trimmedAmount = amount.trim();

  if (!trimmedBedName) {
    setBedNameError("Bed name is required");
    valid = false;
  } else {
    setBedNameError("");
  }

  if (!trimmedAmount) {
    setAmountError("Amount is required");
    valid = false;
  } else {
    setAmountError("");
  }

  if (!valid) return;

  let res;

  if (isEdit) {
    // ✅ EDIT BED
    if (
    trimmedBedName === initialBedName &&
    trimmedAmount === initialAmount
  ) {
    setModalType("warning");
    setMessage("No changes detected");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 800);

    return;
  }
    res = await updateBed({
      bedId: bedId,
      bedName: trimmedBedName,
      amount: trimmedAmount,
    });
  } else {
    // ✅ ADD BED
    res = await addBed({
      bedName: trimmedBedName,
      roomId: selectedRoomId,
      hostelId: activeHostelId,
      amount: trimmedAmount,
    });
  }

  if (res.success) {
    setModalType("success");
    setMessage(
      isEdit ? "Bed Updated Successfully" : "Bed Added Successfully"
    );
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onBedAdded(selectedRoomId); 
      onClose();
    }, 800);
  } else {
    console.log("resbed",res)
    setBedNameError(res.message);
  }
};


  return (
    <>
      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}

      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />
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

<ScrollView
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: 30,
  }}
>

    <View style={styles.handle} />

    <Text style={styles.title}> {isEdit ? "Edit Bed" : "Add Bed"}</Text>

    <Text style={styles.label}>Bed Name or No <Text  style={{color:"red"}}>*</Text></Text>
   <TextInput
  style={styles.input}
  placeholder="Enter Bed Name or No"
  value={bedName}
  returnKeyType="next"
  onSubmitEditing={() => amountRef.current?.focus()}
  onChangeText={(t) => {
    setBedName(t);
    setBedNameError("");
  }}
/>
    {bedNameError && <ErrorMessage message={bedNameError} type="error" />}

    <Text style={styles.label}>Amount <Text style={{color:"red"}}>*</Text></Text>
    
    <TextInput
     ref={amountRef}  
  style={styles.input}
  placeholder="Enter Amount"
  value={amount}
  keyboardType="numeric"
  returnKeyType="done"     
  blurOnSubmit={false}
  onSubmitEditing={() => {
    if (!isDisabled) {
      handleSaveBed();     
    }
  }}
  onChangeText={(text) => {
    setAmount(text);
    setAmountError("");
  }}
/>

    {amountError && <ErrorMessage message={amountError} type="error" />}

    <TouchableOpacity
      style={styles.addButton}
      // disabled={isDisabled}
      onPress={handleSaveBed}
    >
      <Text style={styles.addButtonText}> {isEdit ? "Update Bed" : "Add Bed"}</Text>
    </TouchableOpacity>
  </ScrollView>
</Animated.View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",

  },
  overlayTouch: { flex: 1 },
  sheet: {
    // height: 360,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  handle: {
    width: 60, height: 5, backgroundColor: "#ccc",
    alignSelf: "center", borderRadius: 3, marginBottom: 15,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  label: { marginTop: 10, fontWeight: "600", color: "#444" },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  addButton: {
    marginTop: 25,
    backgroundColor: "#1E45E1",
    paddingVertical: 14,
    borderRadius: 12,
  },

  addButtonDisabled: {
    backgroundColor: "#BFD3FF",
  },

  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});
