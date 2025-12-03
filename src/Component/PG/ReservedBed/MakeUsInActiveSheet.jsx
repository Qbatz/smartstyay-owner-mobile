import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  StyleSheet,PanResponder
} from "react-native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

import Calendar from "../../../Assets/Images/calendar.png"; 

export default function InactiveTenantSheet({ visible, onClose }) {
  const translateY = useRef(new Animated.Value(400)).current;
  const [joiningDate, setJoiningDate] = useState(dayjs());
  const [comments, setComments] = useState("");

   const [openJoinDatePic, setOpenJoinDatePic] = useState("");
  


useEffect(() => {
  Animated.timing(translateY, {
    toValue: visible ? 0 : 400,
    duration: 250,
    useNativeDriver: true,
  }).start();
}, [visible]);

const panResponder = PanResponder.create({
  onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
  onPanResponderMove: (_, g) => {
    if (g.dy > 0) translateY.setValue(g.dy);
  },
  onPanResponderRelease: (_, g) => {
    if (g.dy > 120) onClose();
    else Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
  },
});


  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 400,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <>
    <View style={styles.overlay}>
  <TouchableWithoutFeedback onPress={onClose}>
    <View style={{ flex: 1 }} />
  </TouchableWithoutFeedback>

  <Animated.View
    style={[styles.sheet, { transform: [{ translateY }] }]}
    {...panResponder.panHandlers}
  >
        
        <Text style={styles.title}>Tenant Inactive ?</Text>
        <Text style={styles.subTitle}>
          Are you sure you want to inactive this tenant?
        </Text>

        {/* Joining Date */}
        <Text style={styles.label}>Joining Date *</Text>

        <TouchableOpacity
          style={styles.dateBox}
        onPress={() => setOpenJoinDatePic(true)}
        >
         <Text style={styles.placeholder}>
                          {joiningDate ? dayjs(joiningDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                        </Text>
          <Image source={Calendar} style={{ width: 22, height: 22 }} />
        </TouchableOpacity>

      

        {/* Comments */}
        <Text style={[styles.label, { marginTop: 12 }]}>Reason (Comments)</Text>

        <TextInput
          style={styles.textArea}
          multiline
          placeholder="Enter comments..."
          value={comments}
          onChangeText={setComments}
        />

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.confirmBtn}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
     {openJoinDatePic && (
                <View style={styles.sheetOverlay}>
                  <TouchableWithoutFeedback onPress={() => setOpenJoinDatePic(false)}>
                    <View style={{ flex: 1 }} />
                  </TouchableWithoutFeedback>

                  <View style={styles.datePickerBox}>
                    <DatePicker
                      mode="single"
                      date={joiningDate}
                      onChange={(p) => {
                        setJoiningDate(p.date || dayjs());
                        setOpenJoinDatePic(false);
                      }}
                    />
                  </View>
                </View>
              )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end"
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  subTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4
  },

  label: {
    marginTop: 15,
    fontWeight: "600",
    color: "#333",
  },

  dateBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    height: 100,
    marginTop: 6,
    textAlignVertical: "top",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  cancelBtn: {
    width: "48%",
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
  },

  cancelText: {
    textAlign: "center",
    fontSize: 15,
    color: "#555",
  },

  confirmBtn: {
    width: "48%",
    paddingVertical: 14,
    backgroundColor: "#1E45E1",
    borderRadius: 10,
  },

  confirmText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
   sheetOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "flex-end",
     backgroundColor: "rgba(0,0,0,0.4)",

  },
    datePickerBox: {
    backgroundColor: "#fff",
    width: "80%",
    borderColor: "#DCDCDC",
    borderRadius: 30,
    padding: 5,
    marginBottom: 120,
    borderWidth: 0.5,
  },
});
