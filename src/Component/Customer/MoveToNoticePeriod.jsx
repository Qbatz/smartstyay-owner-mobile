import React, { useRef, useEffect, useState, useCallback, useContext } from "react";
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
import { CommonContexts } from "../../Context/CommonContext";
import { useCustomer } from "../../Context/CustomerContext";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../ToastFile/ToastPage";
import { useFloor } from "../../Context/PayingGuestContext";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
export default function MoveNoticeSheet({
  visible, onClose, customer, onSuccess, selectedBed, onBedAdded, roomId
}) {
  if (!visible) return null;

  const [openRequestPicker, setOpenRequestPicker] = useState(false);
  const [openCheckoutPicker, setOpenCheckoutPicker] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const { activeHostelId } = useContext(CommonContexts);
  const { getCustomersByHostel, loading, moveToNoticePeriod } = useCustomer();
  const { getAllBedsByRoom } = useFloor();

  const [reason, setReason] = useState("");

  const [reqDate, setReqDate] = useState(null);
  const [outDate, setOutDate] = useState(null);
  const [reqDateError, setReqDateError] = useState("");
  const [outDateError, setOutDateError] = useState("");
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  console.log("customer", customer)
  console.log("selectedBed", selectedBed)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {



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

  const handleBedAdded = async () => {
    const res = await getAllBedsByRoom(customer.roomId);

  };

  const handleMoveNotice = async () => {
    let hasError = false;

    setReqDateError("");
    setOutDateError("");

    if (!reqDate) {
      setReqDateError("Please select request date");
      hasError = true;
    }

    if (!outDate) {
      setOutDateError("Please select checkout date");
      hasError = true;
    }

    const tenantId =
      customer?.customerId ||
      selectedBed?.currentTenantInfo?.tenetId;

    if (!tenantId) {
      alert("Customer not found");
      return;
    }

    if (hasError) return;

    const payload = {
      customerId: tenantId,
      requestDate: dayjs(reqDate).format("DD-MM-YYYY"),
      checkoutDate: dayjs(outDate).format("DD-MM-YYYY"),
      reason: reason || "",
    };

    const res = await moveToNoticePeriod(activeHostelId, payload);

    if (res.success) {
      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);
      onBedAdded && onBedAdded(roomId || customer.roomId);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 800);
    } else {
      alert(res.message || "Move to notice failed");
    }
  };
  const joiningDateRaw =
    customer?.actualJoining ||
    selectedBed?.currentTenantInfo?.joiningDate;

  const joiningDate = joiningDateRaw
    ? dayjs(joiningDateRaw, ["DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD"])
    : null;






  const getNoticeDays = () => {
    if (!reqDate || !outDate) return 0;

    const start = dayjs(reqDate);
    const end = dayjs(outDate);

    return end.diff(start, "day") + 1;
  };


  const isDisabledDate = (date) => {
    if (!date) return false;


    if (date.isAfter(dayjs(), "day")) return true;


    if (joiningDate && date.isBefore(joiningDate, "day")) return true;

    return false;
  };


  const isDisabledCheckoutDate = (date) => {
    if (!date) return false;

    if (reqDate && date.isBefore(dayjs(reqDate), "day")) return true;

    return false;
  };


  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <View style={styles.overlay}>


        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>


        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.sheet, { transform: [{ translateY }] }]}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>Move to Notice Period?</Text>
          <Text style={styles.noticeDays}>
            Notice Days : <Text style={{ color: "#2D6CDF" }}> {getNoticeDays()}</Text>
          </Text>


          <View style={styles.profileRow}>
            <Image source={Profile} style={styles.profileImg} />

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{customer?.fullName || selectedBed.currentTenantInfo.tenantFullName}</Text>

              <View style={styles.badgeRow}>
                <View style={styles.badgeYellow}>
                  <Text style={styles.badgeText}>{customer?.floorName || selectedBed.floorName}</Text>
                </View>

                <View style={styles.badgeRed}>
                  <Text style={styles.badgeText}>
                    {customer?.roomName || selectedBed?.roomName} - {customer?.bedName || selectedBed.bedName}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            <Text style={styles.label}>Request Date</Text>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setOpenRequestPicker(true)}
            >
              <Text style={styles.textInput}>
                {reqDate ? dayjs(reqDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
              </Text>
              <Image source={CalendarIcon} style={styles.calendarIcon} />
            </TouchableOpacity>
            {reqDateError && (
              <ErrorMessage message={reqDateError} type="error" />
            )}


            <Text style={styles.label}>Checkout Date</Text>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setOpenCheckoutPicker(true)}
            >
              <Text style={styles.textInput}>
                {outDate ? dayjs(outDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
              </Text>
              <Image source={CalendarIcon} style={styles.calendarIcon} />
            </TouchableOpacity>
            {outDateError && (
              <ErrorMessage message={outDateError} type="error" />
            )}

            <Text style={styles.label}>Reason (Comments)</Text>
            <TextInput
              style={styles.textArea}
              value={reason}
              onChangeText={setReason}
              placeholder="Enter Reason"
              multiline
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.CancelBtn}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moveBtn}
              onPress={handleMoveNotice}
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
              date={reqDate ?? undefined}

              onChange={(p) => {
                if (isDisabledDate(dayjs(p.date))) return;
                setReqDate(p.date);
                setReqDateError("");
                setOpenRequestPicker(false);
              }}

              dayStyle={(date) => {
                const disabled = isDisabledDate(dayjs(date));

                if (disabled) {
                  return {
                    backgroundColor: "#F3F4F6",
                    borderRadius: 8,
                  };
                }

                return {};
              }}

              dayTextStyle={(date) => {
                const disabled = isDisabledDate(dayjs(date));

                if (disabled) {
                  return {
                    color: "#9CA3AF",
                  };
                }

                return {
                  color: "#111827",
                };
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
              date={outDate ?? undefined}

              onChange={(p) => {
                if (isDisabledCheckoutDate(dayjs(p.date))) return; // 🔒 safety
                setOutDate(p.date);
                setOutDateError("");
                setOpenCheckoutPicker(false);
              }}

              dayStyle={(date) => {
                const disabled = isDisabledCheckoutDate(dayjs(date));

                if (disabled) {
                  return {
                    backgroundColor: "#F3F4F6",
                    borderRadius: 8,
                  };
                }
                return {};
              }}

              dayTextStyle={(date) => {
                const disabled = isDisabledCheckoutDate(dayjs(date));

                if (disabled) {
                  return {
                    color: "#9CA3AF",
                  };
                }
                return { color: "#111827" };
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


            <View style={styles.confirmTitleRow}>
              <Image source={QuestionIcon} style={styles.confirmIcon} />
              <Text style={styles.confirmTitle}>Move to Notice period?</Text>
            </View>


            <Text style={styles.confirmMessage}>
              Are you sure you want to move this tenant to the notice period?
            </Text>


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
