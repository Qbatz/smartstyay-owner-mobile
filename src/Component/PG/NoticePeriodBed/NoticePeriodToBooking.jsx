import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  ScrollView,
  Keyboard,
  PanResponder,
} from "react-native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import DownArrow from "../../../Assets/Images/direction-down.png";

export default function NewBookingSheet({ visible, onClose, room, bed }) {
  const translateY = useRef(new Animated.Value(500)).current;
  const [sheetHeight, setSheetHeight] = useState(0);

  const [bookingDate, setBookingDate] = useState(dayjs());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [joiningDate, setJoiningDate] = useState(dayjs());
  const [showJoinDatePicker, setShowJoinDatePicker] = useState(false);

  const BookingTenants = ["priya", "Allwin", "Mathu", "Arputha", "Hepzi"];
  const [BookingTenantsOpen, setBookingTenantsopen] = useState(false);
  const [BookingTenantsSelected, setBookTenantsSelected] =
    useState("Select Tenant");

  const Accounts = ["SBI", "Canara", "TMP"];
  const [accountOpen, setAccountopen] = useState(false);
  const [accountSelected, setAccountSelected] = useState("Select Account");

  // ➤ OPEN/CLOSE SHEET
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 500,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // ➤ KEYBOARD MOVEMENT
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height + 80,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // ➤ SWIPE DOWN (PanResponder)
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 10, // Start drag down
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy); // Move sheet down
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) {
        onClose(); // Close sheet
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
    <>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
          onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
        >
          {/* SHEET HANDLE */}
          <View style={styles.handle} />

          <Text style={styles.title}>Tenant Booking</Text>
          <Text style={styles.subTitle}>
            Room No {room?.room_no} | {bed?.label}
          </Text>

          {/* SELECT TENANT */}
          <Text style={styles.label}>Select Tenant</Text>
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={styles.select}
              onPress={() => setBookingTenantsopen(!BookingTenantsOpen)}
            >
              <Text style={styles.selectText}>{BookingTenantsSelected}</Text>
              <Image source={DownArrow} style={styles.arrow} />
            </TouchableOpacity>

            {BookingTenantsOpen && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={{ maxHeight: 160 }}>
                  {BookingTenants.map((v, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.option}
                      onPress={() => {
                        setBookTenantsSelected(v);
                        setBookingTenantsopen(false);
                      }}
                    >
                      <Text style={styles.optionText}>{v}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* BOOKING DATE */}
          <Text style={styles.label}>Booking Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.inputBox}
          >
            <Text>{dayjs(bookingDate).format("DD/MM/YYYY")}</Text>
            <Image
              source={require("../../../Assets/Images/calendar.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* BOOKING AMOUNT */}
          <Text style={styles.label}>Booking Amount</Text>
          <TextInput
            placeholder="Enter Amount"
            placeholderTextColor="#999"
            keyboardType="numeric"
            style={styles.inputBox}
          />

          {/* JOINING DATE */}
          <Text style={styles.label}>Joining Date *</Text>
          <TouchableOpacity
            onPress={() => setShowJoinDatePicker(true)}
            style={styles.inputBox}
          >
            <Text>{dayjs(joiningDate).format("DD/MM/YYYY")}</Text>
            <Image
              source={require("../../../Assets/Images/calendar.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* ACCOUNT SELECT */}
          <Text style={styles.label}>Transferred Account *</Text>
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              onPress={() => setAccountopen(!accountOpen)}
              style={styles.inputBox}
            >
              <Text>{accountSelected}</Text>
              <Image source={DownArrow} style={styles.arrow} />
            </TouchableOpacity>

            {accountOpen && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={{ maxHeight: 150 }}>
                  {Accounts.map((v, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.option}
                      onPress={() => {
                        setAccountSelected(v);
                        setAccountopen(false);
                      }}
                    >
                      <Text style={styles.optionText}>{v}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* TRANSACTION ID */}
          <Text style={styles.label}>Transaction Id</Text>
          <TextInput
            placeholder="Enter Transaction Id"
            placeholderTextColor="#999"
            style={styles.inputBox}
          />

          
          <View style={styles.footer}>
                      <TouchableOpacity style={styles.cancelBtn}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
          
                      <TouchableOpacity style={styles.submitBtn}>
                        <Text style={styles.submitText}>
                        Book
                        </Text>
                      </TouchableOpacity>
                    </View>
        </Animated.View>
      </View>

      {/* DATE PICKERS */}
      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
              onChange={(d) => {
                setBookingDate(dayjs(d.date));
                setShowDatePicker(false);
              }}
            />
          </View>
        </View>
      )}

      {showJoinDatePicker && (
        <View style={styles.datePickerOverlay}>
          <TouchableWithoutFeedback
            onPress={() => setShowJoinDatePicker(false)}
          >
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
              onChange={(d) => {
                setJoiningDate(dayjs(d.date));
                setShowJoinDatePicker(false);
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subTitle: {
    marginTop: 4,
    marginBottom: 14,
    color: "#1E45E1",
    fontWeight: "600",
  },

  label: {
    marginTop: 14,
    marginBottom: 6,
    color: "#555",
  },

  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  select: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dropdownMenu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 1000,
    elevation: 10,
  },

  option: {
    padding: 12,
  },

  saveBtn: {
    backgroundColor: "#1E45E1",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  datePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  datePickerBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    margin: 20,
  },
    arrow: { width: 18, height: 18, tintColor: "#444" },
    icon: { width: 20, height: 20, tintColor: "#1E45E1" },
     footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginTop: 25,
  },


  cancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,


    width: "40%"
  },

  cancelText: {
    textAlign: "center",
    color: "#333",
  },

  submitBtn: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: "#1D5DFF",
    width: "35%"
  },

  submitText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
  },

});
