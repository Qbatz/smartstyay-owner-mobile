import React,{useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ProfileDrawer({ visible, onClose }) {
  const slideX = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideX, {
        toValue: SCREEN_WIDTH * 0.25,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideX, {
        toValue: SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.background} onPress={onClose} />

      <Animated.View style={[styles.panel, { transform: [{ translateX: slideX }] }]}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Smartstay</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileRow}>
          <Image
            source={require("../../Assets/Images/profile.png")}
            style={styles.profileImg}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.profileName}>Muthuram K</Text>
            <Text style={styles.changePassword}>Change Password</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuRow}>
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow}>
          <Text style={styles.menuText}>Help & Information</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutRow}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
 overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 70,            // bottom tab height
  backgroundColor: "rgba(0,0,0,0.3)",
  flexDirection: "row",
},


  background: {
    flex: 1,
  },

 panel: {
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingTop: 40,
    height: Dimensions.get("window").height - 70,  // ⭐ REQUIRED FIX
    overflow: "hidden",
  },

  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: "700" },
  close: { fontSize: 22, fontWeight: "600" },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: { fontSize: 16, fontWeight: "600" },
  changePassword: { color: "#2F80ED", marginTop: 3 },

  menuRow: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  menuText: { fontSize: 16, color: "#333" },

  logoutRow: {
    backgroundColor: "#FFECEC",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "700",
  },
});
