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

export default function ChangeStatus({
  visible,
  onClose,
  selectedStatus,
  setSelectedStatus,
  onStatusUpdate,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

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

  /** animate open */
  const openSheet = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  /** animate close */
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
      {/* OVERLAY */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      />

      {/* BOTTOM SHEET */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.headerLine} />

        <View style={styles.header}>
          <Text style={styles.title}>Change Status</Text>

          <TouchableOpacity onPress={handleClose}>
            <Image source={CloseIcon} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Change</Text>

        {/* SELECT BOX */}
        <View style={{ zIndex: 50 }}>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={styles.selectedText}>{selectedStatus}</Text>
            <Image source={DownArrow} style={styles.downArrow} />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                {["Pending", "In Progress", "Resolved"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.option}
                    onPress={() => {
                      setSelectedStatus(item);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* BUTTONS */}
        <View style={styles.footerBtnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.cancelBtn]}
            onPress={handleClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.updateBtn]}
            onPress={() => {
              onStatusUpdate();
              handleClose();
            }}
          >
            <Text style={styles.updateText}>Change Status</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  headerLine: {
    width: 60,
    height: 5,
    backgroundColor: "#D5D5D5",
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    alignItems: "center",
  },

  title: { fontSize: 18, fontWeight: "700", color: "#000" },
  closeIcon: { width: 18, height: 18 },

  label: { fontSize: 14, color: "#666", marginBottom: 10 },

  selectBox: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  selectedText: { fontSize: 15, color: "#000" },
  downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },

  dropdownMenu: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    elevation: 10,
    zIndex: 999,
    maxHeight: 140,
    overflow: "hidden",
  },

  option: { paddingVertical: 10, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

  footerBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },

  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelBtn: {
    backgroundColor: "#F0F0F0",
    marginRight: 10,
  },

  updateBtn: {
    backgroundColor: "#1D5DFF",
  },

  cancelText: { fontSize: 16, fontWeight: "500", color: "#333" },
  updateText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});
