import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  PanResponder,
  TouchableOpacity,
  StyleSheet,Image,
  ScrollView,
} from "react-native";
import Chat from "../../../Assets/Images/chat-notification.png"


export default function StayHistorySheet({ visible, onClose, customerDetails = [] }) {

  const translateY = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 400,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      Math.abs(gesture.dy) > 10,

    onPanResponderMove: (_, gesture) => {
      if (gesture.dy > 0) {
        translateY.setValue(gesture.dy);
      }
    },

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy > 120) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onClose}
      />

      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        <Text style={styles.title}>Stay History</Text>

        {/* 🔥 IMPORTANT */}
       <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 40 }}
>
  {customerDetails?.bedHistory?.map((item, index) => (
    <View key={index} style={styles.historyRow}>

      {/* LEFT TIMELINE */}
      <View style={styles.timelineContainer}>
        {/* <View style={styles.circle} /> */}
       <Image source={Chat} style={styles.chatimg}/>
        {index !== customerDetails.bedHistory.length - 1 && (
          <View style={styles.verticalLine} />
        )}
      </View>

      {/* RIGHT CONTENT */}
      <View style={styles.contentContainer}>
        <Text style={styles.dateText}>
          {item.startDate} - {item.endDate || "Present"}
        </Text>

        <Text style={styles.reasonText}>
          {item.reason || item.type}
        </Text>

        <Text style={styles.roomText}>
          {item.roomName} / {item.bedName} - ₹ {item.rentAmount}
        </Text>
      </View>

    </View>
  ))}
</ScrollView>

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
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: "75%",   // 🔥 FIXED HEIGHT
  },

  handle: {
    width: 60,
    height: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 3,
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  card: {
    marginBottom: 20,
  },

  date: {
    fontWeight: "700",
    fontSize: 15,
  },

  sub: {
    color: "#555",
    marginTop: 4,
  },

  room: {
    color: "#888",
    marginTop: 4,
  },
  historyRow: {
  flexDirection: "row",
  marginBottom: 25,
},

timelineContainer: {
  alignItems: "center",
  marginRight: 15,
},

circle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#EEF2FF",
  borderWidth: 1,
  borderColor: "#DCE3FF",
},
chatimg:{
 width: 30,
  height: 30,
},

verticalLine: {
  width: 2,
  flex: 1,
  backgroundColor: "#E5E7EB",
  marginTop: 5,
},

contentContainer: {
  flex: 1,
},

dateText: {
  fontSize: 15,
  fontWeight: "700",
  color: "#111",
},

reasonText: {
  fontSize: 14,
  color: "#444",
  marginTop: 6,
},

roomText: {
  fontSize: 13,
  color: "#8A8A8A",
  marginTop: 6,
},

});
