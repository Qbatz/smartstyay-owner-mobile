import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  ScrollView, Keyboard, Platform
} from "react-native";
import { useFloor } from "../../Context/PayingGuestContext";
import { CommonContexts } from "../../Context/CommonContext";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../ToastFile/ToastPage";

export default function AddRoomSheet({
  visible,
  onClose,
  floorId,
  onSuccess,
  editRoomData,
}) {
  const translateY = useRef(new Animated.Value(300)).current;
  const isEdit = !!editRoomData;

  const [roomName, setRoomName] = useState("");
  const [roomError, setRoomError] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const { addRoom, updateRoom } = useFloor();
  const { activeHostelId } = useContext(CommonContexts);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
const safeKeyboardHeight =
  keyboardHeight > 0 ? 150 : 0;




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


  useEffect(() => {
    if (visible) {
      if (editRoomData) setRoomName(editRoomData.name);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setRoomName("");
        setRoomError("");
      });
    }
  }, [visible]);
  


  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
      onPanResponderMove: (_, g) => g.dy > 0 && translateY.setValue(g.dy),
      onPanResponderRelease: (_, g) => {
        g.dy > 120
          ? onClose()
          : Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
      },
    })
  ).current;
  const finalTranslateY = Animated.add(
  translateY,
  new Animated.Value(-safeKeyboardHeight)
);

  if (!visible) return null;

  /* ---------------- SAVE ---------------- */
  const handleAddRoom = async () => {
    const trimmed = roomName.trim();

    if (!trimmed) {
      setRoomError("Please Enter Room Name");
      return;
    }

    if (
      isEdit &&
      trimmed.toLowerCase() === editRoomData.name.trim().toLowerCase()
    ) {
      setModalType("warning");
      setMessage("No changes detected");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 800);
      return;
    }

    let res;
    if (isEdit) {
      res = await updateRoom({
        roomId: editRoomData.id,
        hostelId: editRoomData.hostelId,
        roomName: trimmed,
      });
    } else {
      res = await addRoom({
        hostelId: activeHostelId,
        floorId,
        roomName: trimmed,
      });
    }

    if (res?.success) {
      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onSuccess && onSuccess();
        onClose();
      }, 800);
    } else {
      setRoomError(res?.message);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />

      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
<Animated.View
  {...panResponder.panHandlers}
  style={[
    styles.sheet,
    {
      transform: [{ translateY }],
      marginBottom: safeKeyboardHeight, // ✅ ONLY THIS
    },
  ]}
>


 
<ScrollView
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: safeKeyboardHeight + 0,
  }}
>
    <View style={styles.handle} />

    <Text style={styles.title}>{isEdit ? "Edit Room" : "Add Room"}</Text>

    <Text style={styles.label}>
      Room Name / No <Text style={{ color: "red" }}>*</Text>
    </Text>

    <TextInput
      style={styles.input}
      placeholder="Enter Room Name"
      value={roomName}
      returnKeyType="done"
      onSubmitEditing={handleAddRoom}   // ✔ keyboard save
      onChangeText={(t) => {
        setRoomName(t);
        setRoomError("");
      }}
    />

    {roomError && <ErrorMessage message={roomError} type="error" />}
  </ScrollView>

  {/* 🔥 STICKY BUTTON */}
  <View style={styles.footer}>
    <TouchableOpacity style={styles.addBtn} onPress={handleAddRoom}>
      <Text style={styles.addBtnText}>{isEdit ? "Edit Room" : "Add Room"}</Text>
    </TouchableOpacity>
  </View>

</Animated.View>

      </View>
    </>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom:30
  },
  handle: {
    width: 45,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
footer: {
  borderTopWidth: 1,
  borderColor: "#eee",
  paddingTop: 10,
  paddingBottom: 20,
  backgroundColor: "#fff",
},

addBtn: {
  backgroundColor: "#1E45E1",
  paddingVertical: 14,
  borderRadius: 12,
},

addBtnText: {
  color: "#fff",
  textAlign: "center",
  fontWeight: "600",
},

});
