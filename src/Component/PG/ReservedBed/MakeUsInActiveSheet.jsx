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
import DownArrow from "../../../Assets/Images/direction-down.png";
import BankIcon from "../../../Assets/Images/bankBlue.png";
import CashIcon from "../../../Assets/Images/Cash_Icon.png";
import CardIcon from "../../../Assets/Images/Cardorange.png";
import { CommonContexts } from "../../../Context/CommonContext";
import { useFloor } from "../../../Context/PayingGuestContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import InputComponent from "../../MorePages/InputComponent"
import DropdownComponent from "../../MorePages/DropdownComponent";
import DatePickerComponent from "../../MorePages/DatePickerComponent";

export default function InactiveTenantSheet({ visible, onClose, selectedBed, selectedItem, onSuccess, bookedItems, onBedAdded }) {
  const translateY = useRef(new Animated.Value(400)).current;
  const [joiningDate, setJoiningDate] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({})
  const [comments, setComments] = useState("");
  const { activeHostelId } = useContext(CommonContexts);
  const { getAllBedsByRoom } = useFloor();
  const { cancelCheckout, initializeCheckIn, initializeCancelBooking, cancelBooking, getCustomersByHostel } = useCustomer();
  const [openJoinDatePic, setOpenJoinDatePic] = useState(false);
  const [bankdetails, setBankDetails] = useState("")
  const [commentError, setCommentError] = useState("")
  const [joiningDateError, setJoiningDateError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [refundFromError, setRefundFromError] = useState("");
  const [refundFrom, setRefundFrom] = useState("");
  const [showRefundFrom, setShowRefundFrom] = useState(false);
  const [transactionId, setTransactionID] = useState("");

  console.log("tanId", transactionId)


  console.log("bookingDetails", bookingDetails)
  const today = dayjs().format("YYYY-MM-DD");
  const [customers, setCustomers] = useState([]);
  const scrollRef = useRef(null);
  const commentRef = useRef(null);

  // const minDate = bookingDetails?.bookedDate
  //   ? dayjs(bookingDetails.bookedDate, "DD-MM-YYYY").format("YYYY-MM-DD")
  //   : today;

  const normalizeDate = (value) => {
    if (!value) return today;

    const raw = String(value).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw;
    }

    const match = raw.match(
      /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
    );

    if (match) {
      const [, day, month, year] = match;

      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return dayjs(raw).isValid()
      ? dayjs(raw).format("YYYY-MM-DD")
      : today;
  };

  const minDate = normalizeDate(bookingDetails?.bookedDate);

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
    if (activeHostelId) {
      const data = await getCustomersByHostel(activeHostelId);
      setCustomers(data.listCustomers || []);
    }
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
        console.log("cancelbookres", res);

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
    setJoiningDateError("")
    setRefundFromError("")
    setRefundFrom("")
    setTransactionID("")
    setShowRefundFrom(false)
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


  console.log("dateopen", openJoinDatePic);

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


  const refundBankOptions = (bankdetails?.listBanks || []).map(
    (bank, index) => {
      const accountType = String(
        bank?.accountType || bank?.type || "BANK"
      ).toUpperCase();

      const displayName = bank?.displayName || "";
      const holderName =
        bank?.accountHolderName || bank?.holderName || "";

      let iconType = "BANK";

      if (accountType === "CASH") {
        iconType = "CASH";
      } else if (
        ["CARD", "DEBIT_CARD", "CREDIT_CARD"].includes(accountType)
      ) {
        iconType = "CARD";
      } else if (accountType === "UPI") {
        iconType = "UPI";
      }

      const title =
        accountType === "CASH" ? displayName : holderName;

      const subLabel =
        accountType === "CASH" || accountType === "CARD"
          ? `${accountType} - ${displayName}`
          : `${bank?.bankName || accountType} - ${displayName}`;

      return {
        id: bank?.bankId || `account-${index}`,
        value: bank?.bankId,
        bankId: bank?.bankId,
        displayName,
        holderName,
        bankName: bank?.bankName || "",
        accountType,
        iconType,
        iconUrl: bank?.upiIcons,
        title,
        subLabel,
        data: bank,
      };
    }
  );

  const getRefundIcon = (item) => {
    switch (item?.iconType) {
      case "CASH":
        return CashIcon;

      case "CARD":
        return CardIcon;

      case "UPI":
        return item?.iconUrl
          ? { uri: item.iconUrl }
          : BankIcon;

      default:
        return BankIcon;
    }
  };

  const getRefundIconBg = (type) => {
    switch (type) {
      case "CASH":
        return styles.refundCashIconBg;
      case "CARD":
        return styles.refundCardIconBg;
      case "UPI":
        return styles.refundUpiIconBg;
      default:
        return styles.refundBankIconBg;
    }
  };

  const getRefundBadgeBg = (type) => {
    switch (type) {
      case "CASH":
        return styles.refundCashBadge;
      case "CARD":
        return styles.refundCardBadge;
      case "UPI":
        return styles.refundUpiBadge;
      default:
        return styles.refundBankBadge;
    }
  };

  const getRefundBadgeText = (type) => {
    switch (type) {
      case "CASH":
        return styles.refundCashText;
      case "CARD":
        return styles.refundCardText;
      case "UPI":
        return styles.refundUpiText;
      default:
        return styles.refundBankText;
    }
  };

  const selectedRefundAccount = refundBankOptions.find(
    (item) => item.value === refundFrom
  );



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
      setJoiningDateError("Please select inactive date");
      valid = false;
    }
    if (!refundFrom) {
      setRefundFromError("Please Select Refund Account");
      valid = false;
    }


    if (!valid) return;

    const payload = {
      reason: comments,
      cancelDate: dayjs(joiningDate).format("DD-MM-YYYY"),
      bankId: refundFrom,
      referenceNumber: transactionId,
    };

    console.log("PAYLOAD", payload);

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
      setMessage(res?.message);
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
                  <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold" }}>{selectedItem?.initials || matchedCustomer?.initials}</Text>
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

            {/* <Text style={styles.label}>
              Date <Text style={{ color: "red" }}>*</Text>
            </Text>

            <TouchableOpacity
              style={[
                styles.dateBox,
                {
                  borderColor: openJoinDatePic ? "#0085FF" : "#D9D9D9",
                  borderWidth: openJoinDatePic ? 1.5 : 1,
                },
              ]}
              onPress={() => {
                Keyboard.dismiss();     
                setTimeout(() => {
                  setOpenJoinDatePic(true);
                }, 100);              
              }}
            >

              <Text style={styles.placeholder}>
                {joiningDate ? dayjs(joiningDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
              </Text>
              <Image source={CalendarImage} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>

            {joiningDateError && (
              <ErrorMessage message={joiningDateError} type="error" />
            )} */}



            <DatePickerComponent
              label="Date"
              required
              selectedDate={joiningDate}
              onSelect={(date) => {
                setJoiningDate(date);
                setJoiningDateError("");
              }}
              minDate={minDate}
              maxDate={today}
              placeholder="DD-MM-YYYY"
              displayFormat="DD-MM-YYYY"
              error={joiningDateError}
            />


            <View style={{ position: "relative" }}>
              <Text style={styles.label}>
                Refund From <Text style={{ color: "red" }}>*</Text>
              </Text>

              {/* Selected Account */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.refundSelectBox,
                  {
                    borderColor: showRefundFrom ? "#0085FF" : "#D9D9D9",
                  },
                ]}
                onPress={() => {
                  setRefundFromError("");
                  setShowRefundFrom((prev) => !prev);
                }}
              >
                {selectedRefundAccount ? (
                  <View style={styles.refundSelectedContainer}>
                    <View
                      style={[
                        styles.refundAccountIcon,
                        getRefundIconBg(selectedRefundAccount.iconType),
                      ]}
                    >
                      <Image
                        source={getRefundIcon(selectedRefundAccount)}
                        style={styles.refundAccountIconImage}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.refundAccountDetails}>
                      <Text
                        style={styles.refundAccountName}
                        numberOfLines={1}
                      >
                        {selectedRefundAccount.title}
                      </Text>

                      <Text
                        style={styles.refundAccountSubText}
                        numberOfLines={1}
                      >
                        {selectedRefundAccount.subLabel}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.refundAccountBadge,
                        getRefundBadgeBg(selectedRefundAccount.iconType),
                      ]}
                    >
                      <Text
                        style={[
                          styles.refundAccountBadgeText,
                          getRefundBadgeText(selectedRefundAccount.iconType),
                        ]}
                      >
                        {selectedRefundAccount.accountType}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.refundPlaceholder}>
                    Select bank
                  </Text>
                )}

                <Image
                  source={DownArrow}
                  style={styles.refundArrow}
                />
              </TouchableOpacity>

              {/* Dropdown Options */}
              {showRefundFrom && (
                <View style={styles.refundDropdown}>
                  <ScrollView
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: 260 }}
                  >
                    {refundBankOptions.length === 0 ? (
                      <Text style={styles.expensesNoDataText}>
                        No bank found
                      </Text>
                    ) : (
                      refundBankOptions.map((item) => {
                        const isSelected = refundFrom === item.value;

                        return (
                          <TouchableOpacity
                            key={String(item.bankId)}
                            activeOpacity={0.7}
                            style={[
                              styles.refundOptionRow,
                              isSelected && styles.refundOptionSelected,
                            ]}
                            onPress={() => {
                              setRefundFrom(item.value);
                              setShowRefundFrom(false);
                              setRefundFromError("");
                            }}
                          >
                            <View
                              style={[
                                styles.refundAccountIcon,
                                getRefundIconBg(item.iconType),
                              ]}
                            >
                              <Image
                                source={getRefundIcon(item)}
                                style={styles.refundAccountIconImage}
                                resizeMode="contain"
                              />
                            </View>

                            <View style={styles.refundAccountDetails}>
                              <Text
                                style={styles.refundAccountName}
                                numberOfLines={1}
                              >
                                {item.title}
                              </Text>

                              <Text
                                style={styles.refundAccountSubText}
                                numberOfLines={1}
                              >
                                {item.subLabel}
                              </Text>
                            </View>

                            <View
                              style={[
                                styles.refundAccountBadge,
                                getRefundBadgeBg(item.iconType),
                              ]}
                            >
                              <Text
                                style={[
                                  styles.refundAccountBadgeText,
                                  getRefundBadgeText(item.iconType),
                                ]}
                              >
                                {item.accountType}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {refundFromError && (
              <ErrorMessage
                message={refundFromError}
                type="error"
              />
            )}

            {/* {refundFromError && (
              <ErrorMessage message={refundFromError} type="error" />
            )} */}

            <Text style={styles.label}>Transaction ID</Text>

            {/* <TextInput
              placeholder="Enter Transaction ID"
              style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginTop: 10, paddingHorizontal: 12, fontFamily: "Gilroy-Regular", paddingVertical: 15 }}
              value={transactionId}
              onChangeText={(text) => {
                setTransactionID(text)
              }} /> */}

            <InputComponent
              // multiline={true}
              type="text"
              placeholder="Enter Transaction ID"
              // keyboardType="numeric"
              value={transactionId}
              onChangeText={(text) => {
                setTransactionID(text)
              }}

            />

            {/* <Text style={[styles.label, { marginTop: 12 }]}>
              Reason (Comments)
            </Text>

            <TextInput
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

            {commentError && <ErrorMessage message={commentError} type="error" />} */}


            {/* Reason (Comments) */}
            <InputComponent
              label="Reason (Comments)"
              type="description"
              value={comments}
              onChangeText={(text) => {
                setComments(text);
                setCommentError("");
              }}
              placeholder="Enter comments..."
              multiline
              inputHeight={120}
              containerStyle={{
                marginTop: 12,
              }}
              onFocus={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollToEnd({
                    animated: true,
                  });
                }, 200);
              }}
            />

            {commentError ? (
              <ErrorMessage
                message={commentError}
                type="error"
              />
            ) : null}


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

      {/* {openJoinDatePic && (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setOpenJoinDatePic(false);
          }}
        >
          <View style={[StyleSheet.absoluteFillObject, styles.calendarOverlay]}>

            <TouchableWithoutFeedback onPress={() => { setOpenJoinDatePic(false); }}>
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
      )} */}

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
    fontFamily: "Gilroy-Bold",
  },

  subTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 7,
    marginBottom: 5,
    fontFamily: "Gilroy-Semibold"
  },

  label: {
    marginTop: 15,
    fontFamily: "Gilroy-Semibold",
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
    fontFamily: "Gilroy-Regular"
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    height: 100,
    marginTop: 6,
    textAlignVertical: "top",
    fontFamily: "Gilroy-Regular"
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30
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
    fontFamily: "Gilroy-Bold",
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
    fontFamily: "Gilroy-Bold",
  },


  calendarOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
    elevation: 99999,
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
  name: { fontSize: 16, fontFamily: "Gilroy-Semibold" },

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
  badgeText: { fontSize: 12, fontFamily: "Gilroy-Regular" },
  inputBox: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    // marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Gilroy-Regular"
  },
  transactiondropdown: {
    position: "absolute",
    top: 77,          // 👈 input height
    left: 0,
    right: 0,

    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 9999,
    elevation: 20,

    maxHeight: 160,
    fontFamily: "Gilroy-Semibold"
  },




  dropdownContent: {
    // minHeight: 130,   
    height: 'auto',
    maxHeight: 130
  },

  dropdownRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  dropdownRowSelected: {
    backgroundColor: "#1E45E1",
  },

  dropdownText: {
    color: "#111",
    fontSize: 15,
    fontFamily: "Gilroy-Semibold"
  },

  dropdownTextSelected: {
    color: "#fff", // 👈 WHITE
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
  },


  arrow: { fontSize: 18, color: "#555" },
  refundSelectBox: {
    minHeight: 66,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D9D9D9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  refundPlaceholder: {
    fontSize: 15,
    color: "#777777",
    fontFamily: "Gilroy-Regular",
  },

  refundSelectedContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  refundAccountIcon: {
    width: 46,
    height: 46,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  refundAccountIconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  refundAccountDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  refundAccountName: {
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
    color: "#252525",
  },

  refundAccountSubText: {
    fontSize: 13,
    fontFamily: "Gilroy-Medium",
    color: "#74809A",
    marginTop: 4,
  },

  refundAccountBadge: {
    minWidth: 68,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  refundAccountBadgeText: {
    fontSize: 12,
    fontFamily: "Gilroy-Semibold",
  },

  refundCashIconBg: {
    backgroundColor: "#D9F8E9",
  },
  refundCardIconBg: {
    backgroundColor: "#FFF0D9",
  },
  refundUpiIconBg: {
    backgroundColor: "#F3E5FF",
  },
  refundBankIconBg: {
    backgroundColor: "#DCE9FF",
  },

  refundCashBadge: {
    backgroundColor: "#D5F7E7",
  },
  refundCardBadge: {
    backgroundColor: "#FFF0D9",
  },
  refundUpiBadge: {
    backgroundColor: "#F3E5FF",
  },
  refundBankBadge: {
    backgroundColor: "#D8E7FF",
  },

  refundCashText: {
    color: "#009B42",
  },
  refundCardText: {
    color: "#E84B00",
  },
  refundUpiText: {
    color: "#9C27F0",
  },
  refundBankText: {
    color: "#2457E6",
  },

  refundArrow: {
    width: 18,
    height: 18,
    tintColor: "#555555",
    marginLeft: 8,
  },

  refundDropdown: {
    position: "absolute",
    top: 78,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E3E8",
    borderRadius: 14,
    overflow: "hidden",
    zIndex: 9999,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  refundOptionRow: {
    minHeight: 82,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F4",
  },

  refundOptionSelected: {
    backgroundColor: "#F0F1F3",
  },
});
