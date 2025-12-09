import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  BackHandler,
} from "react-native";

import DownArrow from "../../Assets/Images/direction-down.png";
import CloseIcon from "../../Assets/Images/remove.png";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function AssignBottomSheet({
  visible,
  onClose,
  selectedUser,
  setSelectedUser,
  onAssignDone,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  /** PAN HANDLER */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) handleClose();
        else openSheet();
      },
    })
  ).current;

  /** OPEN SHEET */
  const openSheet = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  /** CLOSE SHEET */
  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  /** On visible change */
  useEffect(() => {
    if (visible) {
      openSheet();

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          handleClose();
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      />

      {/* SHEET */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.headerLine} />

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Assign complaint</Text>

          <TouchableOpacity onPress={handleClose}>
            <Image source={CloseIcon} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Assign</Text>

        {/* SELECT USER DROPDOWN */}
        <View style={styles.selectWrapper}>
          <TouchableOpacity style={styles.selectBox} onPress={toggleDropdown}>
            <Text style={styles.selectedText}>{selectedUser}</Text>
            <Image source={DownArrow} style={styles.downArrow} />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              <ScrollView
                style={{ maxHeight: 150 }}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                {["Raja", "Kannan", "Arun", "Vijay", "Sarath", "Pravin"].map(
                  (item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.option}
                      onPress={() => {
                        setSelectedUser(item);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* SUBMIT */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => {
            onAssignDone();
            handleClose();
          }}
        >
          <Text style={styles.submitText}>Assign complaint</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  headerLine: {
    width: 60,
    height: 5,
    backgroundColor: "#D5D5D5",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  closeIcon: { width: 15, height: 15 },

  label: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
    marginTop: 10,
  },

  selectWrapper: { position: "relative", width: "100%" },

  selectBox: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  selectedText: { fontSize: 15, color: "#000" },
  downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },

  dropdownMenu: {
    position: "absolute",
    top: 58,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    elevation: 8,
    zIndex: 999,
    paddingVertical: 8,
  },

  option: { paddingVertical: 14, paddingHorizontal: 16 },
  optionText: { fontSize: 15, color: "#000" },

  submitBtn: {
    backgroundColor: "#1D5DFF",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 85,
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
