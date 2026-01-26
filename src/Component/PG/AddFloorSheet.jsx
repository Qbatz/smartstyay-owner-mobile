import React, { useRef, useState, useEffect,useContext} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  PanResponder,
  Keyboard,
  TouchableWithoutFeedback, KeyboardAvoidingView, Platform,ScrollView
} from "react-native";
import { CommonContexts } from "../../Context/CommonContext";
import { useFloor } from "../../Context/PayingGuestContext";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../ToastFile/ToastPage";

export default function AddFloorSheet({ visible, onClose,onSuccess,editFloorData }) {
  const translateY = useRef(new Animated.Value(300)).current;
  const isEdit = !!editFloorData;
  console.log("editFloorData",editFloorData)
const [keyboardHeight, setKeyboardHeight] = useState(0);

useEffect(() => {
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
}, []);
const safeKeyboardHeight =
  keyboardHeight > 0
    ? Math.min(keyboardHeight * 0.85, 300)
    : 0;



  const [floorName, setFloorName] = useState("");
  const [floorNameError, setFloorNameError] = useState("");

  const inputRef = useRef(null);
  const scrollRef = useRef(null)
  const { activeHostelId } = useContext(CommonContexts);
  const {addFloor,updateFloor } = useFloor();
    const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");

useEffect(() => {
  if (visible && editFloorData) {
    setFloorName(
      editFloorData.floorName || editFloorData.name || ""
    );
  }
}, [visible, editFloorData]);

useEffect(() => {
  if (!visible) {
    setFloorName("");
    setFloorNameError("");
  }
}, [visible]);

  const openSheet = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 260,
      useNativeDriver: false,
    }).start();
  };

  
  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
   
      setFloorName("");
      onClose();
    });
  };

 useEffect(() => {
  if (!visible) {
    setFloorName("");
    setFloorNameError("");
   
  }
}, [visible]);

  useEffect(() => {
    if (visible) openSheet();
  }, [visible]);

 
  // useEffect(() => {
  //   if (!visible) return;

  //   const timer = setTimeout(() => {
  //     inputRef.current?.focus();
  //   }, 350); 

  //   return () => clearTimeout(timer);
  // }, [visible]);

 
 
 
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 4,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeSheet();
        else openSheet();
      },
    })
  ).current;

  if (!visible) return null;
  const handleAddFloor = async () => {
const trimmedName = floorName.trim();

  if (!trimmedName) {
    setFloorNameError("Please Enter Floor Name");
    return;
  }


  if (
    isEdit &&
    trimmedName ===
      (editFloorData.floorName || editFloorData.name || "")
  ) {

     setModalType("warning");
    setMessage("No changes detected");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    
    }, 800);
    return;
  }

  let res;

 if (isEdit) {
  res = await updateFloor(editFloorData.id, {
    floorName: trimmedName,
    isActive: true,
  });
}else {
    // ➕ ADD FLOOR
    res = await addFloor({
      hostelId: activeHostelId,
      floorName:trimmedName,
    });
  }

  if (res?.success) {
    setModalType("success");
    setMessage(res.data || "Floor updated successfully");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onSuccess && onSuccess();
      onClose();
    }, 800);
  } else {
    setFloorNameError(res?.message || "Operation failed");
  }
};
//  const handleAddFloor = async () => {

//     let valid = true;
//   if (!floorName.trim()) {
//       setFloorNameError("Please Enter FloorName");
//       valid = false;
//     }
//      if (!valid) return;
//   const res = await addFloor({
//     hostelId: activeHostelId,
//     floorName: floorName.trim(),
//   });

//   if (res.success) {
//      setModalType("success");
//   setMessage(res.data);
//   setShowSuccess(true);

//   setTimeout(() => {
//     setShowSuccess(false);
//     onSuccess && onSuccess();
//     onClose();  
//   }, 800);
//   } else {
//     setFloorNameError(res.message)
    
//   }
// };

const sheetContent = (
<Animated.View
  {...panResponder.panHandlers}
  style={[
    styles.sheet,
    {
      transform: [{ translateY }],
      marginBottom: safeKeyboardHeight, // 🔥 FIX
    },
  ]}
>
    <View style={styles.handle} />
     <ScrollView
    ref={scrollRef}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 30 }}
  >

    <Text style={styles.title}>
      {isEdit ? "Edit Floor" : "Add Floor"}
    </Text>

    <Text style={styles.label}>
      Floor Name or No <Text style={{ color: "red" }}>*</Text>
    </Text>

  <TextInput
  ref={inputRef}
  placeholder="Enter floor Name or No"
  style={styles.input}
  value={floorName}
  returnKeyType="done"
  blurOnSubmit={true}
  onSubmitEditing={handleAddFloor}
  onFocus={() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 100, animated: true });
    }, 200);
  }}
  onChangeText={(text) => {
    const cleaned = text
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
      .replace(/[^a-zA-Z0-9 _-]/g, "");

    setFloorName(cleaned);
    setFloorNameError("");
  }}
/>


  <View style={{padding:10}}>
      {floorNameError && (
      <ErrorMessage message={floorNameError} type="error" />
    )}
  </View>

    {/* 🔥 BUTTON ALWAYS JUST BELOW INPUT */}
    <TouchableOpacity style={styles.addBtn} onPress={handleAddFloor}>
      <Text style={styles.addBtnText}>
        {isEdit ? "Update Floor" : "Add Floor"}
      </Text>
    </TouchableOpacity>
    </ScrollView>
  </Animated.View>
);


 return (
  <>
    <SuccessModal visible={showSuccess} message={message} type={modalType} />

    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={closeSheet}>
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>

      
          {sheetContent}
    
    </View>
  </>
);

}

/* ------------------------------------------
 * STYLES
 * ----------------------------------------- */
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
    // paddingBottom:20
  },

sheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  maxHeight: "85%",
  paddingBottom:40   
},

  handle: {
    width: 45,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },

addBtn: {
  backgroundColor: "#1E45E1",
  paddingVertical: 14,
  borderRadius: 12,
  marginBottom: 10,    // 🔥 reduced
},

  addBtnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
  ErrorFloor:{
    paddingBottom:30
  }
});
