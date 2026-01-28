import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
} from "react-native";

const { height } = Dimensions.get("window");

const SubscriptionFullScreenAlert = ({
  visible,
  title,
  amount,
  subtitle,
  primaryText = "Renew now",
  onPrimary,
  onClose,
}) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

useEffect(() => {
  if (!visible) return;

  const onBackPress = () => {
    onClose();      // close modal
    return true;    // consume back press
  };

  const subscription = BackHandler.addEventListener(
    "hardwareBackPress",
    onBackPress
  );

  return () => {
    subscription.remove();   // ✅ THIS IS THE KEY
  };
}, [visible, onClose]);



  // 🎬 Animation
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY }] },
        ]}
      >
        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🔔</Text>
        </View>
         <View style={styles.OverDueBtn}>
        <Text style={styles.overdue}>OVERDUE</Text>
         </View>

        <Text style={styles.title}>{title}</Text>

        {amount && (
          <Text style={styles.amount}>₹{amount}</Text>
        )}

        <Text style={styles.subtitle}>{subtitle}</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={onClose}>
          <Text style={styles.primaryText}>{primaryText}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.secondaryText}>Later</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default SubscriptionFullScreenAlert;
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  closeText: {
    fontSize: 20,
    color: "#374151",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    fontSize: 34,
  },
  OverDueBtn : {
    marginTop: 10,
    backgroundColor: "#DC2626",
    paddingVertical: 4,
    paddingHorizontal: 7  ,
    borderRadius: 8,
  },
  overdue: {
    color: "#fff",
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#DC2626",
    textAlign: "center",
  },
  amount: {
    fontSize: 32,
    fontWeight: "900",
    color: "#DC2626",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 22,
    marginTop:15
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryText: {
    marginTop: 14,
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
  },
});
