import React, { useRef, useEffect,useState,useCallback } from "react";
import {
 View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Modal, BackHandler, TouchableWithoutFeedback, Animated,
  PanResponder,

} from "react-native";

import CalendarIcon from "../../Assets/Images/calendar.png";
import Profile from "../../Assets/Images/profile.png";
import QuestionIcon from "../../Assets/Images/help.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useFocusEffect } from "@react-navigation/native";

export default function MoveNoticeSheet({
  visible, onClose, onMove, tenant, requestDate, checkoutDate, reason, setRequestDate, setCheckoutDate, setReason,
}) {
  if (!visible || !tenant) return null;
  const [openRequestPicker, setOpenRequestPicker] = useState(false);
  const [openCheckoutPicker, setOpenCheckoutPicker] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

   useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {

        console.log("Back Pressed - Modal Visible:", visible);

        if (visible) {
          onClose();
          return true;
        }

        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [visible])
  );

  const translateY = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 160) {
          Animated.timing(translateY, {
            toValue: 600,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
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
    <>
    <View style={styles.overlay}>

      {/* Tap outside to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.handle} />

        <Text style={styles.title}>Move to Notice Period?</Text>
        <Text style={styles.noticeDays}>
          Notice Days : <Text style={{ color: "#2D6CDF" }}>30</Text>
        </Text>

        {/* CUSTOMER INFO */}
        <View style={styles.profileRow}>
          <Image source={tenant.img || Profile} style={styles.profileImg} />

          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>{tenant.name}</Text>

            <View style={styles.badgeRow}>
              <View style={styles.badgeYellow}>
                <Text style={styles.badgeText}>{tenant.floor}</Text>
              </View>

              <View style={styles.badgeRed}>
                <Text style={styles.badgeText}>
                  {tenant.room} - {tenant.bed}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
              {/* Request Date */}
              <Text style={styles.label}>Request Date</Text>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setOpenRequestPicker(true)}
              >
                <Text style={styles.textInput}>
                  {requestDate || "Select Request Date"}
                </Text>
                <Image source={CalendarIcon} style={styles.calendarIcon} />
              </TouchableOpacity>

              {/* Checkout Date */}
              <Text style={styles.label}>Checkout Date</Text>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setOpenCheckoutPicker(true)}
              >
                <Text style={styles.textInput}>
                  {checkoutDate || "Select Checkout Date"}
                </Text>
                <Image source={CalendarIcon} style={styles.calendarIcon} />
              </TouchableOpacity>

              {/* Reason */}
              <Text style={styles.label}>Reason (Comments)</Text>
              <TextInput
                style={styles.textArea}
                value={reason}
                onChangeText={setReason}
                placeholder="Enter Reason"
                multiline
              />
            </ScrollView>

        {/* Footer */}
         <View style={styles.footer}>
              <TouchableOpacity onPress={onClose} style={styles.CancelBtn}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
  style={styles.moveBtn}
  onPress={() => setShowNoticeModal(true)}
>
  <Text style={styles.moveText}>Move</Text>
</TouchableOpacity>

            </View>
      </Animated.View>
    </View>
    <Modal
        visible={openRequestPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenRequestPicker(false)}
      >
        <View style={styles.calendarOverlay}>
          <TouchableOpacity
            style={styles.outsideTouch}
            onPress={() => setOpenRequestPicker(false)}
          />
          <View style={styles.calendarBox}>
            <DatePicker
              mode="single"
              date={dayjs()}
              onChange={(p) => {
                setRequestDate(dayjs(p.date).format("DD/MM/YYYY"));
                setOpenRequestPicker(false);
              }}
            />
          </View>
        </View>
      </Modal>
     <Modal
        visible={openCheckoutPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenCheckoutPicker(false)}
      >
        <View style={styles.calendarOverlay}>
          <TouchableOpacity
            style={styles.outsideTouch}
            onPress={() => setOpenCheckoutPicker(false)}
          />
          <View style={styles.calendarBox}>
            <DatePicker
              mode="single"
              date={dayjs()}
              onChange={(p) => {
                setCheckoutDate(dayjs(p.date).format("DD/MM/YYYY"));
                setOpenCheckoutPicker(false);
              }}
            />
          </View>
        </View>
      </Modal>
  <Modal
  visible={showNoticeModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowNoticeModal(false)}
>
  <View style={styles.confirmOverlay}>
    <View style={styles.confirmBox}>
      
      {/* Title Row */}
      <View style={styles.confirmTitleRow}>
        <Image source={QuestionIcon} style={styles.confirmIcon} />
        <Text style={styles.confirmTitle}>Move to Notice period?</Text>
      </View>

      {/* Message */}
      <Text style={styles.confirmMessage}>
        Are you sure you want to move this tenant to the notice period?
      </Text>

      {/* Buttons */}
      <View style={styles.confirmButtons}>
        <TouchableOpacity
          style={styles.cancelConfirmBtn}
          onPress={() => setShowNoticeModal(false)}
        >
          <Text style={styles.cancelConfirmText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.okConfirmBtn}
          onPress={() => {
            setShowNoticeModal(false);
            onMove(); 
          }}
        >
          <Text style={styles.okConfirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>

    </View>
  </View>
</Modal> 

    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: "82%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  handle: {
    width: 60,
    height: 4,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 15,
  },

  title: { fontSize: 18, fontWeight: "700", color: "#111" },
  noticeDays: { fontSize: 14, color: "#6B7280", marginVertical: 10 },

  profileRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  profileImg: { width: 50, height: 50, borderRadius: 25 },
  name: { fontSize: 16, fontWeight: "600" },

  badgeRow: { flexDirection: "row", marginTop: 5 },
  badgeYellow: {
    backgroundColor: "#FFF6CC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
  },
  badgeRed: {
    backgroundColor: "#FFD6D6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12 },

  label: { fontSize: 13, marginTop: 12 },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },

  textInput: { fontSize: 14 },
  calendarIcon: { width: 20, height: 20 },

  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    height: 80,
    marginTop: 5,
  },

 footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    paddingBottom: 50,
},


  cancel: { fontSize: 18, color: "#6B7280" },
  CancelBtn: { padding: 12, marginRight: 10 },

  moveBtn: {
    backgroundColor: "#2D6CDF",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },

  moveText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  calendarOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  outsideTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  calendarBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
  },
 
    confirmOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},

confirmBox: {
  width: "90%",
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 16,
  elevation: 10,
},

confirmTitleRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},

confirmIcon: { width: 22, height: 22, marginRight: 8 },

confirmTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#111",
},

confirmMessage: {
  fontSize: 14,
  color: "#555",
  marginBottom: 20,
  lineHeight: 20,
},

confirmButtons: {
  flexDirection: "row",
  justifyContent: "flex-end",
},

cancelConfirmBtn: {
  borderWidth: 1,
  borderColor: "#C7C7CC",
  paddingHorizontal: 22,
  paddingVertical: 10,
  borderRadius: 10,
  marginRight: 10,
},

cancelConfirmText: {
  fontSize: 15,
  color: "#555",
  fontWeight: "600",
},

okConfirmBtn: {
  backgroundColor: "#2D6CDF",
  paddingHorizontal: 25,
  paddingVertical: 10,
  borderRadius: 10,
},

okConfirmText: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "700",
},
});
