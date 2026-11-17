import React, { useRef, useEffect, useState, useContext, useCallback } from "react";
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
  PanResponder, KeyboardAvoidingView, Platform, findNodeHandle
} from "react-native";
import dayjs from "dayjs";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { useCustomer } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useFocusEffect } from "@react-navigation/native";
import { BankingContext } from "../../../Context/BankingContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import { Calendar } from "react-native-calendars";
import customParseFormat from "dayjs/plugin/customParseFormat";
import InputComponent from "../../MorePages/InputComponent"
import BankIcon from "../../../Assets/Images/bankBlue.png";
import CashIcon from "../../../Assets/Images/Cash_Icon.png";
import CardIcon from "../../../Assets/Images/Cardorange.png";

export default function NewBookingSheet({ visible, onClose, room, bed, selectedBed, onBedAdded }) {
  // const { getCustomersByHostel, deleteCustomer, loading, checkInCustomer, bookCustomer, getCustomerDetails } = useCustomer();
  const {
    getCustomersByHostel,
    deleteCustomer,
    loading,
    checkInCustomer,
    bookCustomer,
    getCustomerDetails,
    getBedsByHostelAndDate,
  } = useCustomer();
  const { activeHostelId } = useContext(CommonContexts);
  const { bankList, getBankListByHostel } = useContext(BankingContext);
  const translateY = useRef(new Animated.Value(500)).current;
  const [sheetHeight, setSheetHeight] = useState(0);
  dayjs.extend(customParseFormat);
  const [bookingDate, setBookingDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [joiningDate, setJoiningDate] = useState(null);
  const [showJoinDatePicker, setShowJoinDatePicker] = useState(false);

  const [BookingTenants, setBookingTenants] = useState([])
  const [BookingTenantsOpen, setBookingTenantsopen] = useState(false);
  const [BookingTenantsSelected, setBookTenantsSelected] = useState(null);

  const [AccountsList, setAccountList] = useState([]);
  const [accountOpen, setAccountopen] = useState(false);
  const [accountSelected, setAccountSelected] = useState(null);
  const [bookingAmount, setBookingAmount] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [tenentsError, setTenantsError] = useState("")
  const [bookingDateError, setBookingDateError] = useState("")
  const [joiningDateError, setJoiningDateError] = useState("")
  const [BookingAmountError, setBookingAmountError] = useState("")
  const [bankIdError, setBankIdError] = useState("")
  const [customerDetails, setCustomerDetails] = useState("")
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const amountRef = useRef(null);
  const txnRef = useRef(null);
  const txnWrapRef = useRef(null);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    if (selectedBed?.currentTenantInfo[0]?.tenetId) {
      fetchCustomerDetails();
    }
  }, [selectedBed?.currentTenantInfo[0]?.tenetId]);

  const fetchCustomerDetails = async () => {
    const res = await getCustomerDetails(selectedBed?.currentTenantInfo[0]?.tenetId);
    console.log("fetchCustomerDetails", res)
    if (res.success) {
      setCustomerDetails(res.data)

    } else {
      setModalType("error");
      setMessage(res?.message);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 800)
      // alert(res.message);
    }
  };
  console.log("customerDetails", customerDetails)
  const CustomerOverView = customerDetails?.checkoutInfo?.noticeDate;
  console.log("CustomerOverView", CustomerOverView)
  const today = dayjs().startOf("day");

  const minBookingDate = CustomerOverView
    ? dayjs(CustomerOverView, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).startOf("day")
    : null;


  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const scrollToInput = (wrapRef) => {
    if (!wrapRef?.current || !scrollRef.current) return;

    wrapRef.current.measure((fx, fy, width, height, px, py) => {
      // py = screen Y position
      // ✅ convert screenY -> scroll position by subtracting some offset
      scrollRef.current.scrollTo({
        y: Math.max(0, py - 250),
        animated: true,
      });
    });
  };



  const resetForm = () => {
    // values
    setBookTenantsSelected(null);
    setBookingAmount("");
    setReferenceNumber("");
    setAccountSelected(null);

    setBookingDate(null);
    setJoiningDate(null);


    setBookingTenantsopen(false);
    setAccountopen(false);


    setTenantsError("");
    setBookingDateError("");
    setJoiningDateError("");
    setBookingAmountError("");
    setBankIdError("");
  };

  const handleCloseSheet = () => {
    resetForm();
    onClose();
  };



  useFocusEffect(
    useCallback(() => {
      fetchWalkinCustomers();
    }, [activeHostelId])
  );

  const fetchWalkinCustomers = async () => {
    if (activeHostelId) {
      const data = await getCustomersByHostel(
        activeHostelId,
        "",
        "Inactive"
      );
      setBookingTenants(data?.listCustomers || []);
    }
  };




  // const fetchBankingList = async () => {
  //   const data = await getBankListByHostel(activeHostelId);
  //   setAccountList(data.data);
  // };

  // useEffect(() => {
  //   if (activeHostelId) {
  //     fetchBankingList(activeHostelId);
  //   }
  // }, [activeHostelId]);

  const loadBookingInitialize = async (date) => {
    if (!activeHostelId || !date) return;

    try {
      const formattedDate = dayjs(date).format("DD-MM-YYYY");

      const res = await getBedsByHostelAndDate(
        activeHostelId,
        formattedDate
      );

      console.log("NoticeToBooking Initialize Response:", res);

      if (res?.success) {
        const bankDetails = res?.data?.bankDetails || [];

        const mappedAccounts = bankDetails.map((bank, index) => {
          const accountType = String(bank?.accountType || "BANK")
            .trim()
            .toUpperCase()
            .replace(/[\s-]+/g, "_");

          const holderName = bank?.accountHolderName || "";
          const displayName = bank?.displayName || "";
          const bankName = bank?.bankName || "";

          const subtitle = bank?.isBank
            ? [bankName, displayName].filter(Boolean).join(" - ")
            : [accountType, displayName].filter(Boolean).join(" - ");

          return {
            id: bank?.bankId || `account-${index}`,
            bankId: bank?.bankId,
            value: bank?.bankId,

            displayName,
            holderName,
            accountHolderName: holderName,
            bankName,

            accountType,
            iconType: accountType,

            isCash: accountType === "CASH",
            isUpi: accountType === "UPI",
            isBank: bank?.isBank || false,

            upiIcon: bank?.upiIcon || null,

            title: holderName,
            subLabel: subtitle,
            badge: accountType,

            data: bank,
          };
        });

        setAccountList(mappedAccounts);

        setAccountSelected((previous) => {
          if (!previous) return null;

          return (
            mappedAccounts.find(
              (item) => item.bankId === previous.bankId
            ) || null
          );
        });
      } else {
        setAccountList([]);
        setAccountSelected(null);
      }
    } catch (error) {
      console.log("NoticeToBooking Initialize Error:", error);
      setAccountList([]);
      setAccountSelected(null);
    }
  };


  useEffect(() => {
    if (!visible || !activeHostelId || !joiningDate) return;

    loadBookingInitialize(joiningDate);
  }, [visible, activeHostelId, joiningDate]);


  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 500,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);


  // useEffect(() => {
  //   const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
  //     Animated.timing(translateY, {
  //       toValue: -e.endCoordinates.height + 80,
  //       duration: 200,
  //       useNativeDriver: true,
  //     }).start();
  //   });

  //   const hideSub = Keyboard.addListener("keyboardDidHide", () => {
  //     Animated.timing(translateY, {
  //       toValue: 0,
  //       duration: 200,
  //       useNativeDriver: true,
  //     }).start();
  //   });

  //   return () => {
  //     showSub.remove();
  //     hideSub.remove();
  //   };
  // }, []);

  const paymentOptions = Array.isArray(AccountsList)
    ? AccountsList
    : [];


  const getPaymentIcon = (item) => {
    switch (item?.iconType) {
      case "CASH":
        return CashIcon;
      case "CARD":
        return CardIcon;
      case "UPI":
        return item?.upiIcon
          ? { uri: item.upiIcon }
          : BankIcon;
      default:
        return BankIcon;
    }
  };

  const getPaymentIconBg = (type) => {
    switch (type) {
      case "CASH":
        return styles.cashIconBg;
      case "CARD":
        return styles.cardIconBg;
      case "UPI":
        return styles.upiIconBg;
      default:
        return styles.bankIconBg;
    }
  };

  const getPaymentBadgeBg = (type) => {
    switch (type) {
      case "CASH":
        return styles.cashBadge;
      case "CARD":
        return styles.cardBadge;
      case "UPI":
        return styles.upiBadge;
      default:
        return styles.bankBadge;
    }
  };

  const getPaymentBadgeText = (type) => {
    switch (type) {
      case "CASH":
        return styles.cashText;
      case "CARD":
        return styles.cardText;
      case "UPI":
        return styles.upiText;
      default:
        return styles.bankText;
    }
  };


  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) {
        handleCloseSheet();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });
  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  if (!visible) return null;



  const validateForm = () => {
    let valid = true;

    setTenantsError("");
    setBookingDateError("");
    setJoiningDateError("");
    setBookingAmountError("");
    setBankIdError("");

    if (!BookingTenantsSelected) {
      setTenantsError("Please select tenant");
      valid = false;
    }

    if (!bookingDate) {
      setBookingDateError("Please select booking date");
      valid = false;
    }

    if (!joiningDate) {
      setJoiningDateError("Please select joining date");
      valid = false;
    }

    if (!bookingAmount || Number(bookingAmount) <= 0) {
      setBookingAmountError("Enter valid booking amount");
      valid = false;
    }

    if (!accountSelected) {
      setBankIdError("Please Select Mode Of Transaction");
      valid = false;
    }

    return valid;
  };


  console.log("selectedBed", selectedBed)


  const handleBooking = async () => {
    if (!validateForm()) return;

    const payload = {
      joiningDate: dayjs(joiningDate).format("DD-MM-YYYY"),
      bookingDate: dayjs(bookingDate).format("DD-MM-YYYY"),
      bookingAmount: Number(bookingAmount || 0),

      floorId: selectedBed.floorId,
      roomId: selectedBed.roomId,
      bedId: selectedBed.bedId,

      customerId: BookingTenantsSelected.customerId || BookingTenantsSelected.id,
      // bankId: accountSelected.bankingId,
      bankId: accountSelected.bankId,
      referenceNumber: referenceNumber || "",
    };



    const res = await bookCustomer(activeHostelId, payload);

    if (res.success) {

      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onBedAdded(selectedBed.roomId);
        handleCloseSheet();
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


  return (
    <>
      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}

      />
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleCloseSheet}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          {/* HANDLE */}
          <View style={styles.handle} />

          {/* HEADER */}
          <Text style={styles.title}>Tenant Booking</Text>
          <Text style={styles.subTitle}>
            {selectedBed?.floorName} | {selectedBed?.roomName} | {selectedBed?.bedName}
          </Text>

          {/* ✅ FORM SCROLL AREA */}
          <View style={{ flex: 1 }}>

            <ScrollView
              ref={scrollRef}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: keyboardHeight + 24,
              }}
            >

              <Text style={styles.label}>
                Select Tenant <Text style={{ color: "red" }}>*</Text>
              </Text>

              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  // style={styles.select}
                  style={[
                    styles.select,
                    {
                      borderColor: BookingTenantsOpen ? "#0085FF" : "#D9D9D9",
                      borderWidth: BookingTenantsOpen ? 1.5 : 1,
                    },

                  ]}
                  onPress={() => setBookingTenantsopen(!BookingTenantsOpen)}
                >
                  <Text style={styles.selectText}>
                    {BookingTenantsSelected?.fullName || "Select Tenant"}
                  </Text>
                  <Image source={DownArrow} style={styles.arrow} />
                </TouchableOpacity>

                {tenentsError && <ErrorMessage message={tenentsError} type="error" />}

                {BookingTenantsOpen && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView
                      style={{ maxHeight: 160 }}
                      nestedScrollEnabled={true}   // ✅ Android
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                    >
                      {BookingTenants.map((v, i) => (
                        <TouchableOpacity
                          key={i}
                          style={styles.option}
                          onPress={() => {
                            setBookTenantsSelected(v);
                            setBookingTenantsopen(false);
                            setTenantsError("");
                          }}
                        >
                          <Text style={styles.optionText}>{v.fullName}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Booking Date */}
              <Text style={styles.label}>
                Booking Date <Text style={{ color: "red" }}>*</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss()
                  setShowDatePicker(true)
                }}
                // style={styles.inputBox}
                style={[
                  styles.inputBox,
                  {
                    borderColor: showDatePicker ? "#0085FF" : "#D9D9D9",
                    borderWidth: showDatePicker ? 1.5 : 1,
                  },

                ]}
              >
                <Text style={{ color: bookingDate ? "#000" : "#999" }}>
                  {bookingDate ? bookingDate.format("DD/MM/YYYY") : "DD/MM/YYYY"}
                </Text>
                <Image
                  source={require("../../../Assets/Images/calendar.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
              {bookingDateError && <ErrorMessage message={bookingDateError} type="error" />}

              {/* Booking Amount */}
              <Text style={styles.label}>
                Booking Amount <Text style={{ color: "red" }}>*</Text>
              </Text>
              {/* <TextInput
                placeholder="Enter Amount"
                placeholderTextColor="#999"
                value={bookingAmount}
                onFocus={() => {
                  setTimeout(() => {
                    scrollRef.current?.scrollTo({ y: 200, animated: true });
                  }, 150);
                }}
                onChangeText={(t) => {
                  const onlyNumbers = t.replace(/[^0-9]/g, "");
                  setBookingAmount(onlyNumbers);
                  setBookingAmountError("");
                }}
                keyboardType="numeric"
                style={styles.inputBox}
              /> */}

              <InputComponent
                placeholder="Enter Amount"
                value={bookingAmount}
                onFocus={() => {
                  setTimeout(() => {
                    scrollRef.current?.scrollTo({ y: 200, animated: true });
                  }, 150);
                }}
                onChangeText={(t) => {
                  const onlyNumbers = t.replace(/[^0-9]/g, "");
                  setBookingAmount(onlyNumbers);
                  setBookingAmountError("");
                }}
                keyboardType="numeric"
                error={!!BookingAmountError}

              />


              {BookingAmountError && <ErrorMessage message={BookingAmountError} type="error" />}

              {/* Joining Date */}
              <Text style={styles.label}>
                Joining Date <Text style={{ color: "red" }}>*</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setShowJoinDatePicker(true)
                }}
                // style={styles.inputBox}
                style={[
                  styles.inputBox,
                  {
                    borderColor: showJoinDatePicker ? "#0085FF" : "#D9D9D9",
                    borderWidth: showJoinDatePicker ? 1.5 : 1,
                  },

                ]}
              >
                <Text style={{ color: joiningDate ? "#000" : "#999" }}>
                  {joiningDate ? joiningDate.format("DD/MM/YYYY") : "DD/MM/YYYY"}
                </Text>
                <Image
                  source={require("../../../Assets/Images/calendar.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
              {joiningDateError && <ErrorMessage message={joiningDateError} type="error" />}

              {/* Account */}
              <Text style={styles.label}>
                Mode Of Transaction <Text style={{ color: "red" }}>*</Text>
              </Text>

              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  onPress={() => {
                    setBookingTenantsopen(false);
                    setAccountopen(!accountOpen);

                    setTimeout(() => {
                      scrollRef.current?.scrollTo({
                        y: 350,
                        animated: true,
                      });
                    }, 100);
                  }}
                  // style={styles.inputBox}
                  style={[
                    styles.inputBox,
                    {
                      borderColor: accountOpen ? "#0085FF" : "#D9D9D9",
                      borderWidth: accountOpen ? 1.5 : 1,
                    },

                  ]}
                >
                  <View style={styles.selectedPaymentContainer}>
                    {accountSelected ? (
                      <>
                        <View
                          style={[
                            styles.paymentMethodIcon,
                            getPaymentIconBg(accountSelected.iconType),
                          ]}
                        >
                          <Image
                            source={getPaymentIcon(accountSelected)}
                            style={styles.paymentMethodIconImage}
                            resizeMode="contain"
                          />
                        </View>

                        <View style={styles.paymentMethodDetails}>
                          <Text style={styles.paymentMethodName} numberOfLines={1}>
                            {accountSelected.title}
                          </Text>

                          <Text style={styles.paymentMethodSubText} numberOfLines={1}>
                            {accountSelected.subLabel}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.paymentTypeBadge,
                            getPaymentBadgeBg(accountSelected.iconType),
                          ]}
                        >
                          <Text
                            style={[
                              styles.paymentTypeText,
                              getPaymentBadgeText(accountSelected.iconType),
                            ]}
                          >
                            {accountSelected.accountType}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <Text style={{ color: "#999", fontSize: 15 }}>
                        Select Bank
                      </Text>
                    )}
                  </View>

                  <Image source={DownArrow} style={styles.arrow} />
                </TouchableOpacity>

                {bankIdError && <ErrorMessage message={bankIdError} type="error" />}

                {accountOpen && (
                  <View style={styles.paymentDropdownMenu}>
                    <ScrollView
                      style={styles.paymentDropdownScroll}
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="always"
                      showsVerticalScrollIndicator
                    >
                      {paymentOptions?.map((item, index) => {
                        const isSelected =
                          accountSelected?.bankId === item?.bankId;

                        return (
                          <TouchableOpacity
                            key={item?.bankId || index}
                            activeOpacity={0.7}
                            style={[
                              styles.paymentMethodRow,
                              isSelected && styles.paymentMethodRowSelected,
                            ]}
                            onPress={() => {
                              setAccountSelected(item);
                              setAccountopen(false);
                              setBankIdError("");
                            }}
                          >
                            <View
                              style={[
                                styles.paymentMethodIcon,
                                getPaymentIconBg(item.iconType),
                              ]}
                            >
                              <Image
                                source={getPaymentIcon(item)}
                                style={styles.paymentMethodIconImage}
                                resizeMode="contain"
                              />
                            </View>

                            <View style={styles.paymentMethodDetails}>
                              <Text
                                style={styles.paymentMethodName}
                                numberOfLines={1}
                              >
                                {item.title}
                              </Text>

                              <Text
                                style={styles.paymentMethodSubText}
                                numberOfLines={1}
                              >
                                {item.subLabel}
                              </Text>
                            </View>

                            <View
                              style={[
                                styles.paymentTypeBadge,
                                getPaymentBadgeBg(item.iconType),
                              ]}
                            >
                              <Text
                                style={[
                                  styles.paymentTypeText,
                                  getPaymentBadgeText(item.iconType),
                                ]}
                              >
                                {item.accountType}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Transaction */}
              <Text style={styles.label}>Transaction Id</Text>

              {/* <TextInput
                placeholder="Enter Transaction Id"
                placeholderTextColor="#999"
                value={referenceNumber}
                onPressIn={() => {
                
                  Keyboard.dismiss();

                  setTimeout(() => {
                    txnRef.current?.focus();
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }, 150);
                }}
                onChangeText={(text) => {
                  const noEmojis = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "");
                  setReferenceNumber(noEmojis)
                }
                }
                style={styles.inputBox}
              /> */}

              <InputComponent
                // multiline={true}
                type="text"
                placeholder="Enter Transaction Id"
                placeholderTextColor="#999"
                value={referenceNumber}
                onPressIn={() => {
                  // ✅ every time tap works
                  Keyboard.dismiss();

                  setTimeout(() => {
                    txnRef.current?.focus();
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }, 150);
                }}
                onChangeText={(text) => {
                  const noEmojis = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "");
                  setReferenceNumber(noEmojis)
                }
                }

              />


            </ScrollView>

          </View>

          {/* ✅ FOOTER FIXED */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCloseSheet}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleBooking}>
              <Text style={styles.submitText}>Book</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </View>


      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <Calendar
              // ✅ minDate = noticeDate (CustomerOverView)
              minDate={minBookingDate ? minBookingDate.format("YYYY-MM-DD") : undefined}

              // ✅ maxDate = today (no future)
              maxDate={today.format("YYYY-MM-DD")}

              onDayPress={(day) => {
                const selected = dayjs(day.dateString);

                // ✅ extra safety check
                if (minBookingDate && selected.isBefore(minBookingDate, "day")) return;
                if (selected.isAfter(today, "day")) return;

                setBookingDate(selected);
                setBookingDateError("");
                setShowDatePicker(false);

                // ✅ joining date auto adjust if needed
                if (joiningDate && joiningDate.isBefore(selected)) {
                  setJoiningDate(selected);
                }
              }}

              markedDates={
                bookingDate
                  ? {
                    [bookingDate.format("YYYY-MM-DD")]: {
                      selected: true,
                      selectedColor: "#1D5DFF",
                    },
                  }
                  : {}
              }
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

            <Calendar
              minDate={
                bookingDate
                  ? bookingDate.format("YYYY-MM-DD")
                  : "2100-01-01"   // far future
              }
              maxDate={
                bookingDate
                  ? undefined
                  : "1900-01-01"  // far past
              }
              onDayPress={(day) => {
                if (!bookingDate) return; // extra safety

                setJoiningDate(dayjs(day.dateString));
                setJoiningDateError("");
                setShowJoinDatePicker(false);
              }}
              markedDates={
                joiningDate
                  ? {
                    [joiningDate.format("YYYY-MM-DD")]: {
                      selected: true,
                      selectedColor: "#1D5DFF",
                    },
                  }
                  : {}
              }
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

    height: "80%",     // ✅ fixed height
    maxHeight: "80%",  // ✅ always stays inside screen
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
    zIndex: 9999,
    elevation: 15,
    maxHeight: 180,
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
    marginHorizontal: 20,
    marginBottom: 60,  // ✅ keep only bottom
  },
  arrow: { width: 18, height: 18, tintColor: "#444" },
  icon: { width: 20, height: 20, tintColor: "#1E45E1" },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginTop: 25,
    marginBottom: 35
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
  paymentMethodIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  paymentMethodIconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  selectedPaymentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  paymentMethodDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  paymentMethodName: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
    color: "#202637",
  },

  paymentMethodSubText: {
    fontSize: 13,
    fontFamily: "Gilroy-Medium",
    color: "#74809A",
    marginTop: 4,
  },

  paymentTypeBadge: {
    minWidth: 68,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  paymentTypeText: {
    fontSize: 12,
    fontFamily: "Gilroy-Semibold",
  },

  cashIconBg: { backgroundColor: "#D9F8E9" },
  cardIconBg: { backgroundColor: "#FFF0D9" },
  upiIconBg: { backgroundColor: "#F3E5FF" },
  bankIconBg: { backgroundColor: "#DCE9FF" },

  cashBadge: { backgroundColor: "#D5F7E7" },
  cardBadge: { backgroundColor: "#FFF0D9" },
  upiBadge: { backgroundColor: "#F3E5FF" },
  bankBadge: { backgroundColor: "#D8E7FF" },

  cashText: { color: "#009B42" },
  cardText: { color: "#E84B00" },
  upiText: { color: "#9C27F0" },
  bankText: { color: "#2457E6" },
  paymentDropdownMenu: {
    position: "relative",
    width: "100%",
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9DDE5",
    borderRadius: 14,
    overflow: "hidden",
    zIndex: 10,
    elevation: 5,
  },

  paymentDropdownScroll: {
    maxHeight: 180,
  },
  footer: {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: 15,
  marginTop: 15,
  marginBottom: Platform.OS === "ios" ? 20 : 12,
  paddingTop: 10,
  backgroundColor: "#FFFFFF",
},
paymentMethodRow: {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  paddingHorizontal: 12,
  paddingVertical: 12,
  gap: 10,
  backgroundColor: "#FFFFFF",
  borderBottomWidth: 1,
  borderBottomColor: "#F0F0F0",
},

paymentMethodRowSelected: {
  backgroundColor: "#F5F8FF",
},

paymentMethodIcon: {
  width: 46,
  height: 46,
  borderRadius: 23,
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
},

paymentMethodIconImage: {
  width: 24,
  height: 24,
  resizeMode: "contain",
},

paymentMethodDetails: {
  flex: 1,
  minWidth: 0,
  marginLeft: 2,
},

paymentMethodName: {
  fontSize: 15,
  fontFamily: "Gilroy-Semibold",
  color: "#202637",
},

paymentMethodSubText: {
  fontSize: 13,
  fontFamily: "Gilroy-Medium",
  color: "#74809A",
  marginTop: 4,
},

paymentTypeBadge: {
  minWidth: 75,
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 24,
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "center",
  flexShrink: 0,
},

paymentTypeText: {
  fontSize: 12,
  fontFamily: "Gilroy-Semibold",
},

});
