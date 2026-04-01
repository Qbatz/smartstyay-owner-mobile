import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Animated,
  PanResponder,
  BackHandler,
} from "react-native";

export default function ImagePickerSheet({
  visible,
  onClose,
  options = [],
  title,
}) {
  const translateY = useRef(new Animated.Value(300)).current;

  // 🔥 Open animation
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
  }).start(() => {
    onClose();
  });
};

  // 🔥 Back button close
useEffect(() => {
  const backAction = () => {
    if (visible) {
      onClose();
      return true;
    }
    return false;
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, [visible, onClose]);

  // 🔥 Swipe down close
 const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onMoveShouldSetPanResponder: (_, gesture) => {
      return Math.abs(gesture.dy) > 5;
    },

    onPanResponderMove: (_, gesture) => {
      if (gesture.dy > 0) {
        translateY.setValue(gesture.dy);
      }
    },

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy > 120) {
        handleClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  })
).current;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleClose} >
      <View style={styles.overlay}>
  <TouchableWithoutFeedback onPress={handleClose}>
    <View style={{ flex: 1 }} />
  </TouchableWithoutFeedback>

  <Animated.View
    style={[
      styles.sheet,
      { transform: [{ translateY }] },
    ]}
    {...panResponder.panHandlers}
  >
              {/* 🔥 Handle bar */}
              <View style={styles.handle} />

              {/* Title */}
              {title && <Text style={styles.title}>{title}</Text>}

              <View style={styles.divider} />

              {/* Options */}
              {options.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionRow}
                  onPress={() => {
                    item.onPress();
                    onClose();
                  }}
                >
                  {/* Left Icon */}
                  <View style={styles.left}>
                    {item.icon && (
                      <Image
                        source={item.icon}
                        style={styles.icon}
                      />
                    )}
                    <Text style={styles.optionText}>
                      {item.label}
                    </Text>
                  </View>

                  {/* Right Arrow */}
                  {item.showArrow && (
                    <Text style={styles.arrow}>›</Text>
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          </View>
  
       
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 10,
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },

  optionText: {
    fontSize: 16,
  },

  arrow: {
    fontSize: 20,
    color: "#999",
  },
});