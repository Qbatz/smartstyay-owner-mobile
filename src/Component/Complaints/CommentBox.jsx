import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  BackHandler,
} from "react-native";

import Profile from "../../Assets/Images/Avatar.png";
import Comments from "../../Assets/Images/send.png";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function CommentBottomSheet({ visible, onClose }) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  /** SWIPE HANDLER */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeSheet();
        else openSheet();
      },
    })
  ).current;

  /** OPEN ANIMATION */
  const openSheet = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  /** CLOSE ANIMATION */
  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(onClose);
  };

  /** OPEN when visible changes */
  useEffect(() => {
    if (visible) {
      openSheet();

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          closeSheet();
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* DARK BACKDROP */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={closeSheet}
      />

      {/* SWIPEABLE BOTTOM SHEET */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.dragLine} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.commentsTitle}>Comments</Text>

          {/* MAIN USER */}
          <View style={styles.mainUserRow}>
            <Image source={Profile} style={styles.mainUserImg} />
            <View>
              <Text style={styles.mainUserName}>Parthiban M</Text>
              <Text style={styles.mainUserDate}>20 Mar 2025</Text>
            </View>
          </View>

          <View style={styles.separator} />

          {/* MESSAGE 1 */}
          <View style={styles.msgRow}>
            <Image source={Profile} style={styles.msgUserImg} />

            <View style={{ flex: 1 }}>
              <View style={styles.msgHeader}>
                <Text style={styles.msgUserName}>Parthiban</Text>
                <Text style={styles.msgTime}>
                  20 Mar 2025 – 12:45 PM
                </Text>
              </View>

              <Text style={styles.msgText}>
                When will the complaint be solved?
              </Text>
            </View>
          </View>

          {/* MESSAGE 2 */}
          <View style={styles.msgRow}>
            <Image source={Profile} style={styles.msgUserImg} />

            <View style={{ flex: 1 }}>
              <View style={styles.msgHeader}>
                <Text style={styles.msgUserName}>Priya</Text>
                <Text style={styles.msgTime}>
                  20 Mar 2025 – 02:26 PM
                </Text>
              </View>

              <Text style={styles.msgText}>
                Complaint Assigned and will be rectify in Few Hours
              </Text>
            </View>
          </View>

          {/* MESSAGE 3 */}
          <View style={styles.msgRow}>
            <Image source={Profile} style={styles.msgUserImg} />

            <View style={{ flex: 1 }}>
              <View style={styles.msgHeader}>
                <Text style={styles.msgUserName}>Parthiban</Text>
                <Text style={styles.msgTime}>
                  20 Mar 2025 – 04:05 PM
                </Text>
              </View>

              <Text style={styles.msgText}>Thank you!</Text>
            </View>
          </View>

          {/* REPLY INPUT */}
          <View style={styles.replyBox}>
            <TextInput
              placeholder="Post your Reply Here"
              placeholderTextColor="#8A8A8A"
              style={styles.input}
            />
            <TouchableOpacity style={styles.sendBtn}>
              <Image source={Comments} style={styles.sendIcon} />
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },

  dragLine: {
    width: 70,
    height: 4,
    backgroundColor: "#CFCFCF",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },

  commentsTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 15,
    color: "#000",
  },

  mainUserRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  mainUserImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 12,
  },

  mainUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  mainUserDate: {
    color: "#666",
    marginTop: 2,
  },

  separator: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginVertical: 15,
  },

  msgRow: {
    flexDirection: "row",
    marginBottom: 18,
  },

  msgUserImg: {
    width: 42,
    height: 42,
    borderRadius: 50,
    marginRight: 10,
  },

  msgHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  msgUserName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  msgTime: {
    fontSize: 11,
    color: "#999",
    marginLeft: 20,
  },

  msgText: {
    marginTop: 5,
    fontSize: 14,
    color: "#000",
  },

  replyBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 10,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },

  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  sendIcon: {
    width: 30,
    height: 30,
  },
});
