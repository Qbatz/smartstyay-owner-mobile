import React, { useRef, useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  StyleSheet, PanResponder, KeyboardAvoidingView, Platform, ScrollView, Keyboard
} from "react-native";

import DatePicker from "react-native-ui-datepicker";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { useCustomer } from "../../../Context/CustomerContext";
import CalendarImage from "../../../Assets/Images/calendar.png";
import { CommonContexts } from "../../../Context/CommonContext";
import { useFloor } from "../../../Context/PayingGuestContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function InactiveTenantSheet({ visible, onClose, selectedBed, selectedItem, onSuccess, bookedItems, onBedAdded }) {
  const translateY = useRef(new Animated.Value(400)).current;
  const [joiningDate, setJoiningDate] = useState(null);
  const [bookingDetails, setBookingDetails] = useState("")
  const [comments, setComments] = useState("");
  const { activeHostelId } = useContext(CommonContexts);
  const { getAllBedsByRoom } = useFloor();
  const { cancelCheckout, initializeCheckIn, initializeCancelBooking, cancelBooking, getCustomersByHostel } = useCustomer();
  const [openJoinDatePic, setOpenJoinDatePic] = useState("");
  const [bankdetails, setBankDetails] = useState("")
  const [commentError, setCommentError] = useState("")
  const [joiningDateError, setJoiningDateError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  console.log("bookingDetails", bookingDetails)
  const today = dayjs().format("YYYY-MM-DD");
  const [customers, setCustomers] = useState([]);
  const scrollRef = useRef(null);
  const commentRef = useRef(null);
  const minDate = bookingDetails?.bookedDate
    ? dayjs(bookingDetails.bookedDate, "DD-MM-YYYY").format("YYYY-MM-DD")
    : today;
  const customerId =
    selectedItem?.customerId || bookedItems?.tenetId;

  useEffect(() => {
    if (!activeHostelId || !customerId) return;

    const initCheckIn = async () => {
      const res = await initializeCheckIn(activeHostelId, customerId);

      if (res.success) {
        setBookingDetails(res.data);
      }
    };

    initCheckIn();
  }, [activeHostelId, customerId]);
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


  useFocusEffect(
    useCallback(() => {
      if (activeHostelId) {
        fetchCustomers();
      }
    }, [activeHostelId])
  );



  const fetchCustomers = async () => {
    const data = await getCustomersByHostel(activeHostelId);
    setCustomers(data.listCustomers || []);
  };
  console.log("setBookingDetails", bookingDetails)
  const matchedCustomer = customers?.find(
    (c) => String(c.customerId) === String(bookedItems?.tenetId)
  );

  console.log("matchedCustomer", matchedCustomer);

  useEffect(() => {
    if (!customerId) return;

    const loadCancelInit = async () => {
      const res = await initializeCancelBooking(customerId);
      if (res.success) {
        setBankDetails(res.data)
      }
    };

    loadCancelInit();
  }, [customerId]);

  useEffect(() => {
    if (!visible) {
      setComments("");
      setCommentError("");
      setJoiningDate(null);
      setOpenJoinDatePic(false);
    }
  }, [visible]);
  const handleClose = () => {
    setComments("");
    setCommentError("");
    setJoiningDate(null);
    setOpenJoinDatePic(false);
    onClose();
  };
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        commentRef.current?.focus();
      }, 400);
    }
  }, [visible]);
  console.log("bookedItems", bookedItems)
  console.log("selectedItempr", selectedItem)
  console.log(bookingDetails)
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
      if (g.dy > 120) handleClose();
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

  if (!visible && !showSuccess) return null;
  const handleConfirmCancel = async () => {
    let valid = true;
    if (!joiningDate) {
      setJoiningDateError("Please select joining date");
      valid = false;
    }


    if (!valid) return;

    const payload = {
      reason: comments,
      cancelDate: dayjs(joiningDate).format("DD-MM-YYYY"),
      bankId: bankdetails?.listBanks?.[0]?.bankId,

    };

    console.log("CANCEL PAYLOAD 👉", payload);

    const res = await cancelBooking(
      customerId,
      payload
    );

    if (res.success) {
      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);
      onSuccess && onSuccess();
      onBedAdded && onBedAdded(matchedCustomer?.roomId);

      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
      }, 800);



    } else {
      setModalType("warning");
      setMessage(res.message);
      setShowSuccess(true);


      setTimeout(() => {
        setShowSuccess(false);

      }, 800);
    }
  };


  // const handleConfirmCancel = async () => {
  //   if (!comments) {
  //     alert("Please enter reason");
  //     return;
  //   }

  //   const payload = {
  //     reason: comments,
  //     cancelDate: dayjs(joiningDate).format("DD-MM-YYYY"),
  //     bankId:bankdetails?.listBanks[0]?.bankId,

  //   };



  //   const res = await cancelBooking(selectedItem.selectedItem?.customerId, payload);

  //   if (res.success) {
  //     alert("Booking cancelled successfully");
  //     onClose();
  //   } else {
  //     alert(res.message);
  //   }
  // };



  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>


        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Tenant Inactive ?</Text>
            <Text style={styles.subTitle}>
              Are you sure you want to inactive this tenant?
            </Text>


            <View style={styles.profileRow}>
              {(selectedItem?.profilePic || matchedCustomer?.profilePic) ? <Image source={{ uri: selectedItem?.profilePic || matchedCustomer?.profilePic }} style={styles.profileImg} /> :
                <View style={[styles.profileImg, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#eef1ff' }]}>
                  <Text style={{ fontSize: 16, fontWeight: 600 }}>{selectedItem?.initials || matchedCustomer?.initials}</Text>
                </View>}


              <View style={{ marginLeft: 12 }}>
                <Text style={styles.name}>{selectedItem?.fullName || matchedCustomer?.fullName}</Text>

                <View style={styles.badgeRow}>
                  <View style={styles.badgeYellow}>
                    <Text style={styles.badgeText}>
                      {selectedItem?.floorName || matchedCustomer?.floorName || selectedItem?.hostelInfo?.floorName}</Text>
                  </View>

                  <View style={styles.badgeRed}>
                    <Text style={styles.badgeText}>
                      {selectedItem?.roomName || matchedCustomer?.roomName || selectedItem?.hostelInfo?.roomName} - 
                      {selectedItem?.bedName || matchedCustomer?.bedName || selectedItem?.hostelInfo?.bedName}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Joining Date */}
            <Text style={styles.label}>
              Date <Text style={{ color: "red" }}>*</Text>
            </Text>

            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => {
                Keyboard.dismiss();      // ✅ close keyboard first
                setTimeout(() => {
                  setOpenJoinDatePic(true);
                }, 100);                 // small delay for smooth close
              }}
            >

              <Text style={styles.placeholder}>
                {joiningDate ? dayjs(joiningDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
              </Text>
              <Image source={CalendarImage} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>

            {joiningDateError && (
              <ErrorMessage message={joiningDateError} type="error" />
            )}

            {/* Reason */}
            <Text style={[styles.label, { marginTop: 12 }]}>
              Reason (Comments)
            </Text>

            <TextInput
              ref={commentRef}
              style={styles.textArea}
              multiline
              placeholder="Enter comments..."
              value={comments}
              onFocus={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                }, 200);
              }}
              onChangeText={(text) => {
                setComments(text);
                setCommentError("");
              }}
            />

            {commentError && <ErrorMessage message={commentError} type="error" />}

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmCancel}>
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>

      </View>

      {openJoinDatePic && (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setOpenJoinDatePic(false);
          }}
        >
          <View style={styles.sheetOverlay}>

            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.datePickerBox}>
                <Calendar
                  minDate={minDate}
                  maxDate={today}
                  markedDates={
                    joiningDate
                      ? {
                        [dayjs(joiningDate).format("YYYY-MM-DD")]: {
                          selected: true,
                          selectedColor: "#1E45E1",
                        },
                      }
                      : {}
                  }
                  onDayPress={(day) => {
                    Keyboard.dismiss();
                    setJoiningDate(day.dateString);
                    setOpenJoinDatePic(false);
                    setJoiningDateError("");
                  }}
                />
              </View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>
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
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
  zIndex: 9999,     
  elevation: 9999,   
    // position: "absolute",
    // left: 0, right: 0, top: 0, bottom: 0,
    // backgroundColor: "rgba(0,0,0,0.4)",
    // justifyContent: "flex-end",
    // marginBottom: 25
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,   // 🔥 must be higher than overlay
    elevation: 10000

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





  datePickerBox: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 16,
    padding: 10,
    alignSelf: "center",
    elevation: 6,
    marginBottom: 120,
    borderWidth: 1,
    borderColor: "#5555",
  },
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

});
