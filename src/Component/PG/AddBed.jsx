import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  Animated, PanResponder, StyleSheet
} from "react-native";

export default function AddBedBottomSheet({ visible, onClose }) {
  const translateY = useRef(new Animated.Value(300)).current;

  const [bedName, setBedName] = useState("");
  const [amount, setAmount] = useState("");

  const isDisabled = bedName.trim() === "" || amount.trim() === "";

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

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />

      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        <Text style={styles.title}>Add Bed</Text>

        <Text style={styles.label}>Bed Name or No *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Bed Name or No"
          value={bedName}
          onChangeText={setBedName}
        />

        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.addButton, isDisabled && styles.addButtonDisabled]}
          disabled={isDisabled}
        >
          <Text style={styles.addButtonText}>Add Bed</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    marginBottom: 40
  },
  overlayTouch: { flex: 1 },
  sheet: {
    height: 340,
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
