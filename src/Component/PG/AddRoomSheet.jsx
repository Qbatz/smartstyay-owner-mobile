import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  PanResponder,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useFloor } from "../../Context/PayingGuestContext";
import { CommonContexts } from "../../Context/CommonContext";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../ToastFile/ToastPage";

export default function AddRoomSheet({ visible, onClose, floorId, onSuccess,onSuccessFloor,editRoomData }) {
  const translateY = useRef(new Animated.Value(300)).current;
  const isEdit = !!editRoomData;

  const [roomName, setRoomName] = useState("");
  const [roomError, setRoomError] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef(null);

  const { addRoom,updateRoom  } = useFloor();
  const { activeHostelId } = useContext(CommonContexts);
   const [modalType, setModalType] = useState("success");
      const [showSuccess, setShowSuccess] = useState(false);
      const [message, setMessage] = useState("");
useEffect(() => {
  if (visible && editRoomData) {
    setRoomName(editRoomData.name); 
  }
}, [visible, editRoomData]);

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
      setRoomName("");
      setRoomError("");
      setKeyboardHeight(0);
      onClose();
    });
  };

  useEffect(() => {
    if (visible) openSheet();
  }, [visible]);

  
   useEffect(() => {
    if (!visible) {
      setRoomError("");
      setRoomName("");
      setKeyboardHeight(0);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const show = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height - 20)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0)
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 4,
      onPanResponderMove: (_, g) => g.dy > 0 && translateY.setValue(g.dy),
      onPanResponderRelease: (_, g) => {
        g.dy > 120 ? closeSheet() : openSheet();
      },
    })
  ).current;

  if (!visible) return null;

  const handleAddRoom = async () => {
  const trimmedName = roomName.trim();


  if (!trimmedName) {
    setRoomError("Please Enter Room Name");
    return;
  }


  if (
    isEdit &&
    trimmedName.toLowerCase() === editRoomData.name.trim().toLowerCase()
  ) {
    // setRoomError("No changes detected");
    
        setModalType("error");
  setMessage("No changes detected");
  setShowSuccess(true);

  setTimeout(() => {
    setShowSuccess(false);
  }, 800);
    return;
  }

  let res;


  if (isEdit) {
    res = await updateRoom({
      roomId: editRoomData.id,
      hostelId: editRoomData.hostelId,
      roomName: trimmedName,
    });
  }

  else {
    res = await addRoom({
      hostelId: activeHostelId,
      floorId,
      roomName: trimmedName,
    });
  }
  if (res?.success) {
  
        setModalType("success");
  setMessage(res.data);
  setShowSuccess(true);

  setTimeout(() => {
    setShowSuccess(false);
    onSuccess && onSuccess();
   closeSheet();
  }, 800);
  }

  else {
    setRoomError(res?.message);
  }
};

// const handleAddRoom = async () => {
//   const trimmedName = roomName.trim();

//   if (!trimmedName) {
//     setRoomError("Please enter room name");
//     return;
//   }

//   let res;

//   if (isEdit) {
//     res = await updateRoom({
//       roomId: editRoomData.id,
//       hostelId: editRoomData.hostelId,
//       roomName: trimmedName,
//     });
//   } else {
//     res = await addRoom({
//       hostelId: activeHostelId,
//       floorId,
//       roomName: trimmedName,
//     });
//   }

//   if (res.success) {
//     onSuccess && onSuccess();
//     closeSheet();
//   } else {
//     console.log("res",res)
//     setRoomError(res.message);
//   }
// };

 
  // const handleAddRoom = async () => {
  //   if (!roomName.trim()) {
  //     setRoomError("Please enter room name");
  //     return;
  //   }

  //   const res = await addRoom({
  //     hostelId: activeHostelId,
  //     floorId,
  //     roomName: roomName.trim(),
  //   });

  //   if (res.success) {
  //     onSuccess && onSuccess();
     
  //     closeSheet();
  //   } else {
  //     setRoomError(res.message);
  //     console.log("res.message",res.message)
  //   }
  // };

  return (
    <>
      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}

      />
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={closeSheet}>
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          { marginBottom: keyboardHeight, transform: [{ translateY }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        <Text style={styles.title}>Add Room</Text>

        <Text style={styles.label}>
          Room Name / No <Text style={{ color: "red" }}>*</Text>
        </Text>

        <TextInput
          ref={inputRef}
          placeholder="Enter Room Name"
          style={styles.input}
          value={roomName}
          onChangeText={(t) => {
            setRoomName(t);
            setRoomError("");
          }}
        />
  <View style={styles.ErrorFloor}>
        {roomError && (
              <ErrorMessage message={roomError} type="error" />
            )}
            </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddRoom}>
          <Text style={styles.addBtnText}>Add Room</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  handle: {
    width: 45,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },

  addBtn: {
    backgroundColor: "#1E45E1",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 30,
  },
  addBtnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
   ErrorFloor:{
    paddingBottom:30
  }
});
