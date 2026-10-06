import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform, TouchableWithoutFeedback, KeyboardAvoidingView, BackHandler, Keyboard, FlatList
} from "react-native";

import CalendarIcon from "../../Assets/Images/calendar.png";
import BackIcon from "../../Assets/Images/Arrow_left.png";
import UserImage from "../../Assets/Images/User.png";
import BankIcon from "../../Assets/Images/bankBlue.png";
import CashIcon from "../../Assets/Images/Cash_Icon.png";
import { useFloor } from "../../Context/PayingGuestContext";
import { CommonContexts } from "../../Context/CommonContext";
import { useCustomer } from '../../Context/CustomerContext';
import DownArrow from "../../Assets/Images/direction-down.png";
import { BankingContext } from "../../Context/BankingContext";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import dayjs from "dayjs";
import { Calendar } from "react-native-calendars";
import customParseFormat from "dayjs/plugin/customParseFormat";
import SuccessModal from "../../ToastFile/ToastPage";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LeavePageScreen from "../../ToastFile/LeavePageScreen";



export default function AddBookingScreen({ navigation, route }) {
  const { selectedItem } = route.params || {};
  dayjs.extend(customParseFormat);
  const { activeHostelId } = useContext(CommonContexts);
  const { getAllFloorsByHostel, getAllRoomsByFloor, getAllBedsByRoom } = useFloor();
  const { bankList, getBankListByHostel } = useContext(BankingContext);
  const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel, bookCustomer } = useCustomer();

  const [showLeavePageScreen, setShowLeavePageScreen] = useState(false);

  const [openDatePicker, setOpenDatePicker] = useState(false);
  // const [joiningDate, setJoiningDate] = useState(new Date());
  const [amount, setAmount] = useState("");
  const [AccountsList, setAccountList] = useState([]);
  const [accountOpen, setAccountopen] = useState(false);
  const [accountSelected, setAccountSelected] = useState(null);
  console.log("selectedItem", selectedItem)
  const [bookingDate, setBookingDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("")
  const [joiningDate, setJoiningDate] = useState(null);
  const [showJoinDatePicker, setShowJoinDatePicker] = useState(false);
  const [floorError, setFloorError] = useState("")
  const [roomError, setRoomError] = useState("")
  const [bedError, setBedError] = useState("")
  const [bankIdError, setBankIdError] = useState("")
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [openDrop, setOpenDrop] = useState("");
  const [floors, setFloors] = useState([]);
  const [floorOpen, setFloorOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [bedOpen, setBedOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [roomOpen, setRoomOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [bookingDateError, setBookingDateError] = useState("")
  const [joiningDateError, setJoiningDateError] = useState("")
  const [BookingAmountError, setBookingAmountError] = useState("")

  const bookingDateRef = useRef(null);
  const joiningDateRef = useRef(null);

  const accountRef = useRef(null);
  const [paymentDropdownPos, setPaymentDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const [datePickerPos, setDatePickerPos] = useState({ top: 0 });
  const [datePickerTop, setDatePickerTop] = useState(0);

  const [isSubmitClicked, setIsSubmitClicked] = useState(false)



  useEffect(() => {
    if (!activeHostelId) return;

    loadFloors();
  }, [activeHostelId]);

  const loadFloors = async () => {
    const res = await getAllFloorsByHostel(activeHostelId);
    if (res.success) {
      setFloors(res.data);


    }
  };


  // useFocusEffect(
  //   useCallback(() => {
  //     const backAction = () => {
  //       navigation.goBack();  
  //       return true;        
  //     };

  //     const handler = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       backAction
  //     );

  //     return () => handler.remove();
  //   }, [navigation])
  // );


  const loadRooms = async (floorId) => {
    const res = await getAllRoomsByFloor(floorId);
    if (res.success) {
      setRooms(res.data);
    } else {
      setRooms([]);
    }
  };




  useEffect(() => {
    if (!activeHostelId || !joiningDate) return;
    loadBeds(joiningDate);
  }, [activeHostelId, joiningDate]);



  const loadBeds = async (date) => {
    if (!activeHostelId) return;

    const formattedDate = dayjs(date).format("DD-MM-YYYY");

    const res = await getBedsByHostelAndDate(
      activeHostelId,
      formattedDate
    )

    console.log("bookinginiatizeResposne", res);


    if (res.success) {
      setAccountList(
        (res?.data?.bankDetails || []).map((item, index) => ({
          id: item?.bankId || `account-${index}`,
          bankId: item?.bankId,

          displayName: item?.holderName || "Account",
          accountHolderName: item?.holderName || "Account",

          bankName: item?.bankName || "",
          upiId: item?.upiId || "",
          type: item?.type || "BANK",
          accountType: item?.type || "BANK",
          isUpi: item?.isUpi || false,

          cashAccountType:
            item?.type === "CASH"
              ? item?.bankName || "Cash"
              : "",

          bankAccountType:
            item?.type !== "CASH"
              ? item?.bankName || "Bank Account"
              : "",

          paymentMethod: item?.type || "BANK",
        }))
      );
      setBeds(res?.data?.listBeds);
      console.log("Beds.......?????", beds)
    } else {
      setBeds([]);
    }
  };

  const filteredBeds = beds?.filter(bed => {
    if (!selectedFloor || !selectedRoom) return false;

    return (
      bed.floorId === selectedFloor.id &&
      bed.roomId === selectedRoom.id &&
      // bed.currentStatus === "VACANT"
      (bed?.currentStatus === "VACANT" ||
        bed?.currentStatus === "NOTICE")
    );
  });
  console.log("filteredBeds", filteredBeds)

  // const fetchBankingList = async () => {
  //   const data = await getBankListByHostel(activeHostelId);
  //   console.log("booking", data);

  // };

  // useEffect(() => {
  //   if (activeHostelId) {
  //     fetchBankingList(activeHostelId);
  //   }
  // }, [activeHostelId]);

  const validateForm = () => {
    let valid = true;


    setBookingDateError("");
    setJoiningDateError("");
    setBookingAmountError("");
    setBankIdError("");
    setFloorError("")
    setRoomError("")
    setBedError("")

    if (!selectedFloor) {
      setFloorError("Please select Floor");
      valid = false;
    }
    if (!selectedRoom) {
      setRoomError("Please select Room");
      valid = false;
    }
    if (!selectedBed) {
      setBedError("Please select Room");
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

    if (!amount || Number(amount) <= 0) {
      setBookingAmountError("Enter valid booking amount");
      valid = false;
    }

    if (!accountSelected) {
      setBankIdError("Please Select Mode Of Transaction");
      valid = false;
    }

    return valid;
  };


  const handleLeavePage = useCallback(() => {
    const hasMandatoryValue =
      !!bookingDate ||
      !!joiningDate ||
      !!amount?.trim() ||
      !!selectedFloor ||
      !!selectedRoom ||
      !!selectedBed ||
      !!accountSelected;

    if (hasMandatoryValue) {
      setShowLeavePageScreen(true);
    } else {
      navigation.goBack();
    }
  }, [
    bookingDate,
    joiningDate,
    amount,
    selectedFloor,
    selectedRoom,
    selectedBed,
    accountSelected,
    navigation,
  ]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        handleLeavePage();
        return true;
      };

      const handler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => handler.remove();
    }, [handleLeavePage])
  );


  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (isSubmitClicked) return;

    const selectedPayment = AccountsList.find(
      item => item?.bankId === accountSelected?.bankId
    );


    const payload = {
      bookingDate: bookingDate.format("DD-MM-YYYY"),
      joiningDate: joiningDate.format("DD-MM-YYYY"),
      bookingAmount: Number(amount),
      customerId: selectedItem.customerId,
      bankId: selectedPayment?.bankId,
      floorId: selectedFloor.id,
      roomId: selectedRoom.id,
      bedId: selectedBed.bedId,
      referenceNumber: referenceNumber || "",
    };

    try {

      setIsSubmitClicked(true)
      const res = await bookCustomer(activeHostelId, payload);

      if (res?.success) {

        setModalType("success");
        setMessage(res?.data);
        setShowSuccess(true);

        setTimeout(() => {
          navigation.goBack();
          setShowSuccess(false);
          setIsSubmitClicked(false)
        }, 1500);
      } else {
        setModalType("error");
        setMessage(res?.message || "Booking failed");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsSubmitClicked(false)
        }, 1500);
      }
    } catch (error) {
      console.log(error)
      setIsSubmitClicked(false)
    }
  };


  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      {/* <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 20 }}> */}
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}   // ✅ change here
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.page}>

          <View style={styles.header}>
            <TouchableOpacity onPress={handleLeavePage}>
              <Image source={BackIcon} style={styles.backIcon} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Add Booking </Text>

            <View style={{ width: 30 }} />
          </View>

          <View style={styles.userRow}>
            {selectedItem?.profilePic ? (
              <Image
                source={{ uri: selectedItem.profilePic }}
                style={styles.userImg}
              />
            ) : (
              <View style={styles.initialCircle}>
                <Text style={styles.initialText}>
                  {selectedItem?.initials || "?"}
                </Text>
              </View>
            )}

            <View>
              <Text style={styles.userName}>
                {selectedItem?.fullName}
              </Text>

              <Text style={{ marginTop: 4, fontFamily: 'Gilroy-Medium', fontSize: 14, color: '#4B4B4B' }}>
                +{selectedItem?.countryCode}  {selectedItem?.mobile}
              </Text>

            </View>

          </View>


          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            scrollEnabled={!accountOpen && !floorOpen && !roomOpen && !bedOpen}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 30,
              backgroundColor: "#fff",
            }}
            style={{ flex: 1, backgroundColor: "#fff" }}
          >

            <Text style={styles.label}>Booking Date <Text style={{ color: "red" }}>*</Text></Text>

            <TouchableOpacity
              ref={bookingDateRef}
              onPress={() => {
                Keyboard.dismiss();           // ✅ CLOSE KEYBOARD
                setTimeout(() => {            // ✅ wait keyboard animation
                  bookingDateRef.current.measureInWindow((x, y, width, height) => {
                    setDatePickerTop(y + height + 8);
                    setShowDatePicker(true);
                  });
                }, 150);
              }}

              style={styles.inputBox}
            >


              <Text style={{ color: bookingDate ? "#000" : "#999" }}>
                {bookingDate ? bookingDate.format("DD/MM/YYYY") : "DD/MM/YYYY"}
              </Text>
              <Image
                source={CalendarIcon}
                style={styles.icon}
              />
            </TouchableOpacity>
            {bookingDateError && <ErrorMessage message={bookingDateError} type="error" />}

            <Text style={styles.label}>Booking Amount <Text style={styles.star}>*</Text></Text>

            <TextInput
              style={styles.inputBox}
              placeholder="Enter Booking Amount"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={amount}
              // onChangeText={setAmount}
              onChangeText={(t) => {
                const filtered = t.replace(/[^0-9]/g, "");
                setAmount(filtered);
                setBookingAmountError("");

              }}
            />

            {BookingAmountError && <ErrorMessage message={BookingAmountError} type="error" />}

            <Text style={styles.label}>Joining Date (Tentative) <Text style={{ color: "red" }}>*</Text></Text>
            {/* <TouchableOpacity
            onPress={() => setShowJoinDatePicker(true)}
            style={styles.inputBox}
          > */}
            <TouchableOpacity
              ref={joiningDateRef}
              onPress={() => {
                Keyboard.dismiss();           // ✅ CLOSE KEYBOARD
                setTimeout(() => {
                  joiningDateRef.current.measureInWindow((x, y, width, height) => {
                    setDatePickerTop(y + height + 8);
                    setShowJoinDatePicker(true);
                  });
                }, 150);
              }}

              style={styles.inputBox}
            >



              <Text style={{ color: joiningDate ? "#000" : "#999" }}>
                {joiningDate ? joiningDate.format("DD/MM/YYYY") : "DD/MM/YYYY"}
              </Text>

              <Image
                source={CalendarIcon}
                style={styles.icon}
              />
            </TouchableOpacity>
            {joiningDateError && <ErrorMessage message={joiningDateError} type="error" />}
            <Text style={styles.label}>Floor <Text style={styles.star}>*</Text></Text>

            <View style={{ position: "relative" }}>
              <TouchableOpacity
                style={styles.select}
                // onPress={() => setFloorOpen(!floorOpen)}
                onPress={() => {
                  setFloorOpen(!floorOpen);
                  setRoomOpen(false);
                  setBedOpen(false);
                  setAccountopen(false);
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.selectText}>
                  {selectedFloor ? selectedFloor.name : "Select a Floor"}
                </Text>
                <Image source={DownArrow} style={styles.arrow} />
              </TouchableOpacity>

              {floorOpen && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}>

                    {floors?.length === 0 ? (
                      <View style={{ padding: 12 }}>
                        <Text style={{ color: "#999", textAlign: "center" }}>
                          No Floors Available
                        </Text>
                      </View>
                    ) :
                      (floors.map((v) => (

                        <TouchableOpacity
                          key={v.id}
                          style={[styles.option, selectedFloor?.id === v.id && { backgroundColor: "#E6F0FF" }]}
                          onPress={() => {
                            setSelectedFloor(v);
                            setFloorOpen(false);
                            setSelectedRoom(null);
                            setSelectedBed(null);
                            setRooms([]);
                            loadRooms(v.id);
                            setFloorError("")
                          }}
                        >
                          <Text style={styles.optionText}>{v.name}</Text>
                        </TouchableOpacity>
                      )))}
                  </ScrollView>
                </View>
              )}
            </View>
            {floorError && <ErrorMessage message={floorError} type="error" />}

            <Text style={styles.label}>Room <Text style={styles.star}>*</Text></Text>

            <View style={{ position: "relative" }}>
              <TouchableOpacity
                style={styles.select}
                // onPress={() => setRoomOpen(!roomOpen)}
                onPress={() => {
                  setFloorOpen(false);
                  setRoomOpen(!roomOpen);
                  setBedOpen(false);
                  setAccountopen(false);
                }}
                activeOpacity={0.9}
              // disabled={!rooms.length}
              >
                <Text style={styles.selectText}>
                  {selectedRoom ? selectedRoom.name : "Select a Room"}
                </Text>
                <Image source={DownArrow} style={styles.arrow} />
              </TouchableOpacity>
              {roomOpen && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}>
                    {rooms.length === 0 ? (
                      <View style={{ padding: 12 }}>
                        <Text style={{ color: "#999", textAlign: "center" }}>
                          No Rooms Available
                        </Text>
                      </View>

                    ) : (
                      rooms.map((r) => (
                        <TouchableOpacity
                          key={r.id}
                          style={[
                            styles.option,
                            selectedRoom?.id === r.id && { backgroundColor: "#E6F0FF" }
                          ]}
                          onPress={() => {
                            setSelectedRoom(r);
                            setRoomOpen(false);
                            setRoomError("");
                          }}
                        >
                          {/* <Text style={styles.optionText}>{r.name}</Text> */}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text style={styles.optionText}>
                              {r.name}
                            </Text>

                            <View
                              style={{
                                backgroundColor: "#dee3f2",
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                              }}
                            >
                              <Text style={styles.optionText}>
                                {r?.sharingType}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>






            {roomError && <ErrorMessage message={roomError} type="error" />}
            <Text style={styles.label}>Bed <Text style={styles.star}>*</Text></Text>

            <View style={{ position: "relative" }}>
              <TouchableOpacity
                style={styles.select}
                // onPress={() => setBedOpen(!bedOpen)}
                onPress={() => {
                  setFloorOpen(false);
                  setRoomOpen(false);
                  setBedOpen(!bedOpen);
                  setAccountopen(false);
                }}
                activeOpacity={0.9}
              // disabled={!filteredBeds.length}
              >
                <Text style={styles.selectText}>
                  {selectedBed ? selectedBed.bedName : "Select a Bed"}
                </Text>

                <Image source={DownArrow} style={styles.arrow} />
              </TouchableOpacity>

              {bedOpen && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}>
                    {filteredBeds.length === 0 ? (
                      <View style={{ padding: 12 }}>
                        <Text style={{ color: "#999", textAlign: "center" }}>
                          No Beds Available
                        </Text>
                      </View>
                    ) : (
                      filteredBeds.map((b) => (
                        <TouchableOpacity
                          key={b.bedId}
                          style={[styles.option, selectedBed?.bedId === b.bedId && { backgroundColor: "#E6F0FF" }]}
                          onPress={() => {
                            setSelectedBed(b);
                            setBedOpen(false);
                            setBedError("")

                          }}
                        >
                          <Text style={styles.optionText}>
                            {b.bedName}
                          </Text>
                        </TouchableOpacity>
                      )))}
                  </ScrollView>
                </View>
              )}
            </View>
            {bedError && <ErrorMessage message={bedError} type="error" />}
            {selectedBed?.shouldShowError && (
              <ErrorMessage
                message={selectedBed.errorMessage}
                type="error"
              />
            )}


            <Text style={styles.label}>
              Mode Of Transaction{" "}
              <Text style={{ color: "red" }}>*</Text>
            </Text>

            <View style={{ position: "relative", zIndex: 1000 }}>

              <TouchableOpacity
                ref={accountRef}
                style={styles.inputBox}
                activeOpacity={0.8}
                onPress={() => {
                  setFloorOpen(false);
                  setRoomOpen(false);
                  setBedOpen(false);
                  setBankIdError("");

                  if (accountOpen) {
                    setAccountopen(false);
                    return;
                  }

                  Keyboard.dismiss();
                  setTimeout(() => {
                    accountRef.current?.measureInWindow((x, y, width, height) => {
                      setPaymentDropdownPos({ top: y + height, left: x, width });
                      setAccountopen(true);
                    });
                  }, 150);
                }}
              >

                {accountSelected ? (
                  <View style={styles.selectedPaymentContainer}>

                    {/* PAYMENT ICON */}
                    <View
                      style={[
                        styles.paymentIcon,
                        accountSelected?.accountType === "CASH"
                          ? styles.cashIconBackground
                          : styles.bankIconBackground,
                      ]}
                    >
                      <Image
                        source={
                          accountSelected?.accountType === "CASH"
                            ? CashIcon
                            : BankIcon
                        }
                        style={styles.paymentIconImage}
                      />
                    </View>

                    {/* PAYMENT DETAILS */}
                    <View style={styles.selectedPaymentDetails}>

                      <Text
                        style={styles.selectedPaymentName}
                        numberOfLines={1}
                      >
                        {accountSelected?.displayName ||
                          accountSelected?.accountHolderName ||
                          "Account"}
                      </Text>

                      <Text
                        style={styles.selectedPaymentSubText}
                        numberOfLines={1}
                      >
                        {accountSelected?.accountType === "CASH"
                          ? accountSelected?.cashAccountType || "Petty Cash"
                          : accountSelected?.paymentMethod ||
                          accountSelected?.bankAccountType ||
                          accountSelected?.bankName ||
                          accountSelected?.accountType ||
                          "Bank"}
                      </Text>

                    </View>

                  </View>
                ) : (
                  <Text style={styles.placeholderText}>
                    Select Mode Of Transaction
                  </Text>
                )}

                <Image
                  source={DownArrow}
                  style={styles.arrow}
                />

              </TouchableOpacity>


              {accountOpen && (
                <View style={styles.paymentDropdown}>
                  <ScrollView
                    style={{ maxHeight: 220 }}
                    contentContainerStyle={{ flexGrow: 0 }}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                    persistentScrollbar={true}
                  >
                    {AccountsList?.length > 0 ? (
                      AccountsList.map((payment, index) => {
                        const isSelected =
                          accountSelected?.bankId === payment?.bankId;

                        const isCash = payment?.accountType === "CASH";

                        return (
                          <TouchableOpacity
                            key={`${payment?.bankId}-${payment?.paymentMethodId}-${index}`}
                            activeOpacity={0.7}
                            style={[
                              styles.paymentMethodRow,
                              isSelected && styles.paymentMethodRowSelected,
                            ]}
                            onPress={() => {
                              setAccountSelected(payment);
                              setAccountopen(false);
                              setBankIdError("");
                            }}
                          >
                            {/* ICON */}
                            <View
                              style={[
                                styles.paymentMethodIcon,
                                isCash
                                  ? styles.cashIconBg
                                  : styles.bankIconBg,
                              ]}
                            >
                              <Image
                                source={isCash ? CashIcon : BankIcon}
                                style={{
                                  width: 20,
                                  height: 20,
                                }}
                              />
                            </View>

                            {/* ACCOUNT DETAILS */}
                            <View style={styles.paymentMethodDetails}>
                              <Text
                                style={styles.paymentMethodName}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {payment?.displayName ||
                                  payment?.accountHolderName ||
                                  "Account"}
                              </Text>

                              <Text
                                style={styles.paymentMethodSubText}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {isCash
                                  ? payment?.cashAccountType || "Petty Cash"
                                  : payment?.bankName
                                    ? `${payment.bankName}${payment?.paymentMethod
                                      ? ` - ${payment.paymentMethod}`
                                      : ""
                                    }`
                                    : payment?.paymentMethod ||
                                    payment?.bankAccountType ||
                                    "Bank Account"}
                              </Text>
                            </View>

                            {/* CASH / BANK */}
                            <View
                              style={[
                                styles.paymentTypeBadge,
                                isCash
                                  ? styles.cashBadge
                                  : styles.bankBadge,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.paymentTypeText,
                                  isCash
                                    ? styles.cashText
                                    : styles.bankText,
                                ]}
                              >
                                {isCash ? "CASH" : "BANK"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <View style={{ padding: 15 }}>
                        <Text
                          style={{
                            color: "#999",
                            textAlign: "center",
                            fontFamily: "Gilroy-Medium",
                          }}
                        >
                          No Payment Methods Available
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}

            </View>

            {bankIdError && (
              <ErrorMessage
                message={bankIdError}
                type="error"
              />
            )}



            <Text style={styles.label}>Transaction Id</Text>
            <TextInput
              placeholder="Enter Transaction Id"
              placeholderTextColor="#999"
              onChangeText={(text) => {
                const filtered = text.replace(/[^A-Za-z0-9./#@!^&*() ]/g, "");
                setReferenceNumber(filtered)
              }}
              value={referenceNumber}
              style={styles.inputBox}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleLeavePage}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.bookBtn} onPress={handleSubmit} disabled={isSubmitClicked}>
                <Text style={styles.bookText}>Book</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <LeavePageScreen
        visible={showLeavePageScreen}
        onClose={() => setShowLeavePageScreen(false)}
        discardClose={() => {
          setShowLeavePageScreen(false);

          setTimeout(() => {
            navigation.goBack();
          }, 300);
        }}
      />


      {accountOpen && (
        <>
          <TouchableWithoutFeedback onPress={() => setAccountopen(false)}>
            <View style={styles.dropdownBackdrop} />
          </TouchableWithoutFeedback>

          <View
            style={[
              styles.paymentDropdown,
              {
                top: paymentDropdownPos.top,
                left: paymentDropdownPos.left,
                width: paymentDropdownPos.width,
              },
            ]}
          >
            <ScrollView
              style={{ maxHeight: 220 }}
              contentContainerStyle={{ flexGrow: 0 }}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}
            >
              {AccountsList?.length > 0 ? (
                AccountsList.map((payment, index) => {
                  const isSelected =
                    accountSelected?.bankId === payment?.bankId;

                  const isCash = payment?.accountType === "CASH";

                  return (
                    <TouchableOpacity
                      key={`${payment?.bankId}-${payment?.paymentMethodId}-${index}`}
                      activeOpacity={0.7}
                      style={[
                        styles.paymentMethodRow,
                        isSelected && styles.paymentMethodRowSelected,
                      ]}
                      onPress={() => {
                        setAccountSelected(payment);
                        setAccountopen(false);
                        setBankIdError("");
                      }}
                    >
                      <View
                        style={[
                          styles.paymentMethodIcon,
                          isCash ? styles.cashIconBg : styles.bankIconBg,
                        ]}
                      >
                        <Image
                          source={isCash ? CashIcon : BankIcon}
                          style={{ width: 20, height: 20 }}
                        />
                      </View>

                      <View style={styles.paymentMethodDetails}>
                        <Text style={styles.paymentMethodName} numberOfLines={1} ellipsizeMode="tail">
                          {payment?.displayName || payment?.accountHolderName || "Account"}
                        </Text>

                        <Text style={styles.paymentMethodSubText} numberOfLines={1} ellipsizeMode="tail">
                          {isCash
                            ? payment?.cashAccountType || "Petty Cash"
                            : payment?.bankName
                              ? `${payment.bankName}${payment?.paymentMethod ? ` - ${payment.paymentMethod}` : ""}`
                              : payment?.paymentMethod || payment?.bankAccountType || "Bank Account"}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.paymentTypeBadge,
                          isCash ? styles.cashBadge : styles.bankBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.paymentTypeText,
                            isCash ? styles.cashText : styles.bankText,
                          ]}
                        >
                          {isCash ? "CASH" : "BANK"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={{ padding: 15 }}>
                  <Text style={{ color: "#999", textAlign: "center", fontFamily: "Gilroy-Medium" }}>
                    No Payment Methods Available
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </>
      )}



      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View
            style={[
              styles.datePickerBox,
              { top: datePickerTop }
            ]}
          >
            <Calendar
              maxDate={dayjs().format("YYYY-MM-DD")}
              onDayPress={(day) => {
                const selected = dayjs(day.dateString);
                setBookingDate(selected);
                setBookingDateError("");
                setShowDatePicker(false);

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
          <TouchableWithoutFeedback onPress={() => setShowJoinDatePicker(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View
            style={[
              styles.datePickerBox,
              { top: datePickerTop }
            ]}
          >
            <Calendar
              minDate={
                bookingDate
                  ? bookingDate.format("YYYY-MM-DD")
                  : "2100-01-01"
              }
              onDayPress={(day) => {
                if (!bookingDate) return;
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
  header: {
    flexDirection: "row",
    alignItems: "left",
    padding: 25,
  },
  backIcon: { width: 22, height: 22 },
  headerTitle: {
    flex: 1,
    // textAlign: "center",
    marginLeft: 10,
    fontSize: 18,
    fontFamily: "Gilroy-Semibold",
    color: "#000",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  userImg: { width: 50, height: 50, borderRadius: 25 },
  userName: { marginLeft: 12, fontSize: 16, fontFamily: "Gilroy-Semibold" },

  label: { fontSize: 14, fontFamily: "Gilroy-Semibold", marginBottom: 6, marginTop: 12 },

  inputBox: {
    borderColor: "#e1e1e1",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    fontFamily: "Gilroy-Regular"
  },

  icon: { width: 20, height: 20, tintColor: "#555" },

  // dropdownMenu: {
  //   backgroundColor: "#fff",
  //   borderWidth: 1,
  //   borderColor: "#ddd",
  //   borderRadius: 10,
  //   maxHeight: 150,
  //   marginTop: 5,
  // },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  dropdownText: { fontSize: 15, color: "#000" },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  cancelText: { color: "#000", fontSize: 15, fontFamily: "Gilroy-Medium" },

  bookBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#1E45E1",
    marginLeft: 10,
  },
  bookText: { color: "#fff", fontSize: 15, fontFamily: "Gilroy-Semibold" },
  star: {
    color: "red",
  },


  select: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownMenu: {
    // position: "absolute",
    // top: 50,
    // left: 0,
    // right: 0,
    // backgroundColor: "#fff",
    // borderWidth: 1,
    // borderColor: "#ddd",
    // borderRadius: 12,
    // zIndex: 9999,
    // elevation: 20,
    // overflow: "hidden",
    position: "absolute",
    top: 50,          // 👈 input height
    left: 0,
    right: 0,

    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 9999,
    elevation: 20,

    maxHeight: 140,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  optionText: {
    fontSize: 15,
    color: "#000",
  },
  arrow: { width: 18, height: 18, tintColor: "#777" },
  dateBox: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholder: { color: "#555" },
  calendarIcon: { width: 20, height: 20, tintColor: "#444" },
  datePickerPopup: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    width: "100%",
  },
  datePickerOverlay: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  datePickerBox: {
    position: "absolute",
    left: "10%",
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    elevation: 10,

  },

  datePickerBox1: {
    backgroundColor: "#fff",
    width: "80%",

    borderRadius: 20,
    padding: 10,
    marginBottom: 350
  },
  page: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
    paddingBottom: 30
  },
  initialCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  initialText: {
    color: "#374151",
    fontSize: 18,
    fontFamily: "Gilroy-Bold"
  },
  selectedPaymentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  selectedPaymentDetails: {
    flex: 1,
    marginLeft: 10,
  },

  selectedPaymentName: {
    fontSize: 15,
    color: "#111",
    fontFamily: "Gilroy-Semibold",
  },

  selectedPaymentSubText: {
    fontSize: 12,
    color: "#737373",
    marginTop: 3,
    fontFamily: "Gilroy-Medium",
  },

  placeholderText: {
    color: "#777",
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
  },

  paymentDropdown: {
    position: "absolute",   // keep — but now top/left/width come dynamically
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9DDE5",
    borderRadius: 16,
    zIndex: 9999,
    elevation: 10,
    maxHeight: 220,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },


  dropdownBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
  },

  paymentOption: {
    minHeight: 70,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  paymentOptionSelected: {
    backgroundColor: "#F4F7FF",
  },

  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",
  },

  paymentIconImage: {
    width: 21,
    height: 21,
  },

  cashIconBackground: {
    backgroundColor: "#E2F7EA",
  },

  bankIconBackground: {
    backgroundColor: "#E5EEFF",
  },

  paymentDetails: {
    flex: 1,
    marginLeft: 11,
    minWidth: 0,
  },

  paymentName: {
    fontSize: 15,
    color: "#111",
    fontFamily: "Gilroy-Semibold",
  },

  paymentSubText: {
    fontSize: 12,
    color: "#737373",
    marginTop: 3,
    fontFamily: "Gilroy-Medium",
  },

  paymentTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },

  paymentMethodRow: {
    minHeight: 82,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 10,

    backgroundColor: "#FFFFFF",

    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F3",
  },

  paymentMethodRowSelected: {
    backgroundColor: "#F5F7FF",
  },

  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  cashIconBg: {
    backgroundColor: "#DDFBE8",
  },

  bankIconBg: {
    backgroundColor: "#DCE8FF",
  },

  paymentMethodDetails: {
    flex: 1,
    justifyContent: "center",
    marginRight: 8,
    minWidth: 0,
  },

  paymentMethodName: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
    color: "#222222",
  },

  paymentMethodSubText: {
    fontSize: 13,
    fontFamily: "Gilroy-Medium",
    color: "#697386",
    marginTop: 3,
  },

  paymentTypeBadge: {
    minWidth: 64,

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",
  },

  cashBadge: {
    backgroundColor: "#DDFBE8",
  },

  bankBadge: {
    backgroundColor: "#DCE8FF",
  },

  paymentTypeText: {
    fontSize: 11,
    fontFamily: "Gilroy-Semibold",
  },

  cashText: {
    color: "#07883C",
  },

  bankText: {
    color: "#2457E6",
  },

  cashBadge: {
    backgroundColor: "#E2F7EA",
  },

  bankBadge: {
    backgroundColor: "#E5EEFF",
  },

  paymentTypeText: {
    fontSize: 10,
    fontFamily: "Gilroy-Semibold",
  },

  cashText: {
    color: "#16803C",
  },

  bankText: {
    color: "#285FDB",
  },

});
