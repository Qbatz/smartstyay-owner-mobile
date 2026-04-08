import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { Modal } from "react-native";
import { BackHandler } from "react-native";
import { PanResponder } from "react-native";
import { BillContext } from "../../Context/BillsContext";
import { CommonContexts } from "../../Context/CommonContext";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";

export default function FinalSettlementDiscountSheet({
  visible,
  onClose,
  selectedBill,
  onSuccess,
}) {
  const { ApplyBillDiscount, UpdateBillDiscount } = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);

  const translateY = useRef(new Animated.Value(300)).current;

  const [discountType, setDiscountType] = useState("Amount");
  const [discount, setDiscount] = useState("");
  const [reason, setReason] = useState("");

  const [discountErr, setDiscountErr] = useState("");
  const [reasonErr, setReasonErr] = useState("");

  const [showReasonDropdown, setShowReasonDropdown] = useState(false);

const reasons = [
  "Loyalty Discount",
  "Promotional Offer",
  "Service Issue",
  "Partial Stay",
  "Special Approval",
];

  const invoiceAmount = Number(selectedBill?.totalAmount || 0);

  const discountValue =
    discountType === "Percentage"
      ? (invoiceAmount * Number(discount || 0)) / 100
      : Number(discount || 0);

  const total = invoiceAmount - discountValue;

  const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 10; // swipe down detect
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 120) {
        handleClose(); // 👈 close sheet
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  })
).current;



useEffect(() => {
  if (!visible) return;

  const backAction = () => {
    handleClose();
    return true; // prevent default back
  };

  const subscription = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => subscription.remove();
}, [visible]);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const isValidNumber = (val) => {
    const num = Number(val);
    return val && !isNaN(num) && num > 0;
  };

  const handleApply = async () => {
    let hasError = false;

    setReasonErr("");
    setDiscountErr("");

    if (!reason) {
      setReasonErr("Please select reason");
      hasError = true;
    }

    if (!isValidNumber(discount)) {
      setDiscountErr("Enter valid discount");
      hasError = true;
    }

    if (discountType === "Percentage" && Number(discount) > 100) {
      setDiscountErr("Percentage cannot exceed 100%");
      hasError = true;
    }

    if (discountType === "Amount" && Number(discount) > invoiceAmount) {
      setDiscountErr("Discount cannot exceed amount");
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      hostelId: activeHostelId,
      invoiceId: selectedBill?.invoiceId,
      reason,
      ...(discountType === "Amount" && {
        discountAmount: Number(discount),
      }),
      ...(discountType === "Percentage" && {
        discountPercentage: Number(discount),
      }),
    };

    const res = await ApplyBillDiscount(payload);

    if (res?.success) {
      handleClose();
      if (onSuccess) onSuccess();
    }
  };

  if (!visible) return null;

  return (
  <Modal transparent
  visible={visible}
  animationType="fade"
  onRequestClose={handleClose}>
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>

      <Animated.View
        {...panResponder.panHandlers}
  style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.handle} />

        <ScrollView>

          <Text style={styles.title}>Discount Settlement</Text>

          {/* Amount */}
          <View style={styles.card}>
            <Text>Amount Outstanding</Text>
            <Text style={styles.amount}>
              ₹ {invoiceAmount.toFixed(2)}
            </Text>
          </View>

          {/* Reason */}
        <Text style={styles.label}>Reason *</Text>

<TouchableOpacity
  style={styles.customerdropdownBox}
  onPress={() => setShowReasonDropdown((v) => !v)}
>
  <Text style={{ color: reason ? "#000" : "#9CA3AF" }}>
    {reason || "Select Reason"}
  </Text>
</TouchableOpacity>

{showReasonDropdown && (
  <View style={styles.customerDropdownMenu}>
    <ScrollView style={{ maxHeight: 150 }}>
      {reasons.map((item, index) => {
        const isSelected = reason === item;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.customerOption,
              isSelected && styles.customerOptionSelected,
            ]}
            onPress={() => {
              setReason(item);
              setShowReasonDropdown(false);
              setReasonErr("");
            }}
          >
            <Text
              style={[
                styles.customerOptionText,
                isSelected && styles.customerOptionTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
)}
          {reasonErr && <ErrorMessage message={reasonErr} />}

          {/* Discount */}
          <Text style={styles.label}>Discount *</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputField}
              keyboardType="numeric"
              value={discount}
             onChangeText={(text) => {
  let cleaned = text.replace(/[^0-9.]/g, "");

  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts[1];
  }

  setDiscount(cleaned);

  const num = Number(cleaned);

  if (cleaned && !isNaN(num) && num > 0) {
    setDiscountErr("");
  }

  if (cleaned && (isNaN(num) || num <= 0)) {
    setDiscountErr("Enter valid discount");
  }
}}
            />

           <View style={styles.toggle}>
  <TouchableOpacity
    style={[
      styles.toggleBtn,
      discountType === "Amount" && styles.activeToggle,
    ]}
    onPress={() => {
  setDiscount("");
  setDiscountType("Amount");
  setDiscountErr("");
}}
  >
    <Text
      style={
        discountType === "Amount"
          ? styles.activeText
          : styles.inactiveText
      }
    >
      ₹
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.toggleBtn,
      discountType === "Percentage" && styles.activeToggle,
    ]}
  onPress={() => {
  setDiscount("");
  setDiscountType("Percentage");
  setDiscountErr("");
}}
  >
    <Text
      style={
        discountType === "Percentage"
          ? styles.activeText
          : styles.inactiveText
      }
    >
      %
    </Text>
  </TouchableOpacity>
</View>
          </View>

          {discountErr && <ErrorMessage message={discountErr} />}

          {/* Summary */}
    <View style={styles.summaryBox}>
  
  {/* Amount Outstanding */}
  <View style={styles.rowBetween}>
    <Text style={styles.summaryLabel}>Amount Outstanding</Text>
    <Text style={styles.summaryValue}>
      ₹ {invoiceAmount.toFixed(2)}
    </Text>
  </View>

  {/* Amount Applied */}
  <View style={styles.rowBetween}>
    <Text style={styles.summaryLabel}>Amount Applied</Text>
    <Text style={styles.appliedValue}>
      - ₹ {discountValue.toFixed(2)}
    </Text>
  </View>

  {/* Divider */}
  <View style={styles.divider} />

  {/* Total Payable */}
  <View style={styles.rowBetween}>
    <Text style={styles.totalText}>Total Payable</Text>
    <Text style={styles.totalText}>
      ₹ {total.toFixed(2)}
    </Text>
  </View>

</View>

          {/* Buttons */}
          <View style={styles.row}>
            <TouchableOpacity style={styles.cancel} onPress={handleClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.apply} onPress={handleApply}>
              <Text style={{ color: "#fff" }}>Apply Changes</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </Animated.View>
    </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    zIndex: 9999,
    elevation: 9999,
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: "85%",
  },

  handle: {
    width: 60,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontFamily: "Gilroy-Semibold",
    marginBottom: 15,
    color: "#111",
  },

  card: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  amount: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#111",
  },

  label: {
    fontSize: 13,
    fontFamily: "Gilroy-Medium",
    marginBottom: 6,
    color: "#4B5563",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontFamily: "Gilroy-Regular",
  },

  inputWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#1E45E1",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  inputField: {
    flex: 1,
    padding: 12,
    fontFamily: "Gilroy-Regular",
  },

  toggle: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginRight: 6,
  },

  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  activeToggle: {
    backgroundColor: "#1E45E1",
  },

  activeText: {
    color: "#fff",
    fontFamily: "Gilroy-Bold",
  },

  inactiveText: {
    color: "#000",
  },

  summary: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  cancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  apply: {
    flex: 1,
    backgroundColor: "#1E45E1",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  customerdropdownBox: {
  borderWidth: 1,
  borderColor: "#D4D4D4",
  borderRadius: 10,
  padding: 14,
  marginTop: 6,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

customerDropdownMenu: {
  marginTop: 4,
  borderWidth: 1,
  borderColor: "#DDDDDD",
  borderRadius: 10,
  backgroundColor: "#fff",
},

customerOption: {
  paddingVertical: 10,
  paddingHorizontal: 14,
},

customerOptionSelected: {
  backgroundColor: "#1D5BEE",
},

customerOptionText: {
  fontSize: 14,
},

customerOptionTextSelected: {
  color: "#fff",
},
summaryBox: {
  backgroundColor: "#F3F4F6",
  borderRadius: 12,
  padding: 14,
  marginTop: 10,
  marginBottom: 20,
},

rowBetween: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: 6,
},

summaryLabel: {
  fontSize: 13,
  color: "#6B7280",
  fontFamily: "Gilroy-Medium",
},

summaryValue: {
  fontSize: 14,
  fontFamily: "Gilroy-Semibold",
  color: "#111",
},

appliedValue: {
  fontSize: 14,
  fontFamily: "Gilroy-Semibold",
  color: "#111", // or "#EF4444" if red venum
},

divider: {
  height: 1,
  backgroundColor: "#E5E7EB",
  marginVertical: 8,
},

totalText: {
  fontSize: 15,
  fontFamily: "Gilroy-Bold",
  color: "#111",
},
});