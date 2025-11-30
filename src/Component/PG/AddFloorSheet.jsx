import React, { useRef, useState, useEffect } from "react";
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

export default function AddFloorSheet({ visible, onClose }) {
  const translateY = useRef(new Animated.Value(300)).current;
  const [floorName, setFloorName] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef(null);

  /** -------------------------------------
   *  OPEN SHEET ANIMATION
   * ------------------------------------- */
  const openSheet = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 260,
      useNativeDriver: false,
    }).start();
  };

  /** -------------------------------------
   *  CLOSE SHEET ANIMATION
   * ------------------------------------- */
  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setKeyboardHeight(0);
      setFloorName("");
      onClose();
    });
  };

  /** -------------------------------------
   *  WHEN visible changes → OPEN SHEET
   * ------------------------------------- */
  useEffect(() => {
    if (visible) openSheet();
  }, [visible]);

  /** -------------------------------------
   *  FOCUS INPUT AFTER ANIMATION
   * ------------------------------------- */
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 350); // ensures animation fully ends first

    return () => clearTimeout(timer);
  }, [visible]);

  /** -------------------------------------
   *  KEYBOARD LISTENERS
   * ------------------------------------- */
  useEffect(() => {
    if (!visible) return;

    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height - 20);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [visible]);

  /** -------------------------------------
   *  SWIPE DOWN TO CLOSE
   * ------------------------------------- */
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

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={closeSheet}>
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            marginBottom: keyboardHeight,
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        <Text style={styles.title}>Ad Floor</Text>

        <Text style={styles.label}>
          Floor Name or No <Text style={{ color: "red" }}>*</Text>
        </Text>

        <TextInput
          ref={inputRef}
          placeholder="Enter floor Name or No"
          style={styles.input}
          value={floorName}
          onChangeText={setFloorName}
        />

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>Add Floor</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
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
    marginBottom: 40,
  },

  addBtnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
});
