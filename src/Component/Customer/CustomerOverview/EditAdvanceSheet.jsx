import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  TextInput,
  Keyboard,
  ScrollView,
  BackHandler,
} from "react-native";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import { useCustomer } from "../../../Context/CustomerContext";

const SHEET_HEIGHT = 320;

export default function EditAdvanceAmountSheet({
  visible,
  onClose,
  customerDetails,
  onSuccess,
}) {
    const { editAdvanceAmount } = useCustomer();
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [amountError, setAmountError] = useState("");
  const [error, setError] = useState("");

 
  const resetState = () => {
    setAmount("");
    setReason("");
    setAmountError("");
    setError("");
    onClose();
  };

  /* ================= BACK HANDLER ================= */
  useEffect(() => {
    if (!visible) return;

    const backAction = () => {
      resetState();
      return true;
    };

    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => sub.remove();
  }, [visible]);

  /* ================= KEYBOARD AVOID ================= */
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(keyboardOffset, {
        toValue: e.endCoordinates.height - 20,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  /* ================= OPEN / CLOSE ================= */
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  /* ================= PAN ================= */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Keyboard.dismiss();
          resetState();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

 
const handleUpdate = async () => {
  let valid = true;
 
  setError("");

  // 1️⃣ Empty / invalid
  if (!amount || Number(amount) <= 0) {
    setAmountError("Please enter new advance amount");
    valid = false;
  }

  if (!valid) return;

 
  const oldAmount = Number(
    customerDetails?.advanceInfo?.advanceAmount || 0
  );
  const newAmount = Number(amount);

  if (oldAmount === newAmount) {
    setError("No changes detected in Advance Amount");
    return;
  }

  // 3️⃣ API payload
  const payload = {
    advanceAmount: newAmount,
    reason,
  };

  const res = await editAdvanceAmount(
    customerDetails.hostelId,
    customerDetails.bookingId,
    payload
  );

  if (res?.success) {
    onSuccess?.();      
    resetState();         
  } else {
    setError(res?.message || "Update failed");
  }
};
  return (
    <>
      <SuccessModal visible={false} />
<View style={styles.wrapper} pointerEvents="box-none">
      {/* BACKDROP */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={resetState}
      />

      {/* SHEET */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sheet,
          {
            transform: [
              { translateY },
              { translateY: Animated.multiply(keyboardOffset, -1) },
            ],
          },
        ]}
      >
        <View style={styles.handle} />

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <Text style={styles.title}>Edit Advance Amount</Text>

          {/* AMOUNT */}
          <Text style={styles.label}>
            New Advance Amount <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter New Advance Amount"
            value={amount}
            onChangeText={(t) => {
               const onlyNum = t.replace(/[^0-9]/g, "").replace(/^0+/, "");
              setAmount(onlyNum);
              setAmountError("");
            }}
          />
          {amountError && <ErrorMessage message={amountError} />}

          {/* REASON */}
          <Text style={[styles.label,{marginTop:15}]}>Reason</Text>
          <TextInput
            style={[styles.input, { height: 90,marginBottom:10}]}
            multiline
            placeholder="Enter your reason"
            value={reason}
            onChangeText={setReason}
          />

          {error && <ErrorMessage message={error} />}

          {/* ACTIONS */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={resetState} style={{borderWidth:1,marginRight:10,borderColor:"#1D4ED8",paddingHorizontal: 36,
                              paddingVertical: 12,borderRadius: 22,}}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.updateBtn}
              onPress={handleUpdate}
            >
              <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  wrapper: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        zIndex: 1000,
    },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  handle: {
    width: 60,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    // marginBottom: 16,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
  },

  cancel: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },

  updateBtn: {
    backgroundColor: "#1D4ED8",
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 22,
  },

  updateText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
