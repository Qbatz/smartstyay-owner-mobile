import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  BackHandler
} from "react-native";

import CloseIcon from "../../Assets/Images/remove.png";
import Profile from "../../Assets/Images/Avatar.png";
import Comments from "../../Assets/Images/send.png";

export default function CommentBottomSheet({ visible, onClose }) {

  useEffect(() => {
    if (visible) {
      const backAction = () => {
        onClose();
        return true;
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => sub.remove();
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Top Drag Line */}
          <View style={styles.dragLine} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.commentsTitle}>Comments</Text>

            {/* Header User */}
            <View style={styles.mainUserRow}>
              <Image source={Profile} style={styles.mainUserImg} />
              <View>
                <Text style={styles.mainUserName}>Parthiban M</Text>
                <Text style={styles.mainUserDate}>20 Mar 2025</Text>
              </View>
            </View>

            <View style={styles.separator} />

            {/* First Message */}
            <View style={styles.msgRow}>
              <Image source={Profile} style={styles.msgUserImg} />
              <View style={{ flex: 1 }}>
                <View style={styles.msgHeader}>
                  <Text style={styles.msgUserName}>Parthiban</Text>
                  <Text style={styles.msgTime}>20 Mar 2025 – 12:45 PM</Text>
                </View>

                <Text style={styles.msgText}>When will the complaint be solved?</Text>
              </View>
            </View>

            {/* Second Message */}
            <View style={styles.msgRow}>
              <Image source={Profile} style={styles.msgUserImg} />
              <View style={{ flex: 1 }}>
                <View style={styles.msgHeader}>
                  <Text style={styles.msgUserName}>Priya</Text>
                  <Text style={styles.msgTime}>20 Mar 2025 – 02:26 PM</Text>
                </View>

                <Text style={styles.msgText}>
                  Complaint Assigned and will be rectify in Few Hours
                </Text>
              </View>
            </View>

            {/* Third Message */}
            <View style={styles.msgRow}>
              <Image source={Profile} style={styles.msgUserImg} />
              <View style={{ flex: 1 }}>
                <View style={styles.msgHeader}>
                  <Text style={styles.msgUserName}>Parthiban</Text>
                  <Text style={styles.msgTime}>20 Mar 2025 – 04:05 PM</Text>
                </View>

                <Text style={styles.msgText}>Thank you!</Text>
              </View>
            </View>

            {/* Reply Input */}
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
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
    marginLeft:20
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
