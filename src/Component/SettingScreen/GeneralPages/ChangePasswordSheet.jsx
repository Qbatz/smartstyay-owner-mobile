import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  PanResponder
} from "react-native";

export default function ChangePasswordSheet({ visible, onClose }) {
  const sheetY = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const closeSheet = () => {
    Animated.timing(sheetY, {
      toValue: 400,
      duration: 200,
      useNativeDriver: true,
    }).start(onClose);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1.5) closeSheet();
        else Animated.spring(sheetY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* tap outside to close */}
      <TouchableOpacity style={styles.touchArea} onPress={closeSheet} />

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}
      >
        <View style={styles.handle} />

        <Text style={styles.title}>Change Password</Text>

        <Text style={styles.label}>Old Password *</Text>
        <TextInput style={styles.input} placeholder="Enter old password" />

        <Text style={styles.label}>New Password *</Text>
        <TextInput style={styles.input} placeholder="Enter new password" />

        <Text style={styles.label}>Confirm New Password *</Text>
        <TextInput style={styles.input} placeholder="Enter confirm password" />

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.updateBtn}>
            <Text style={styles.updateText}>Update</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  touchArea: { flex: 1 },
  sheet: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 45,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    color: "#555",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#000",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cancelBtn: {
    width: "45%",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#4466F2",
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#4466F2",
    fontWeight: "700",
  },
  updateBtn: {
    width: "45%",
    paddingVertical: 12,
    backgroundColor: "#4466F2",
    borderRadius: 10,
    alignItems: "center",
  },
  updateText: {
    color: "#fff",
    fontWeight: "700",
  },
});
