import React, { useState, useContext, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Modal, Dimensions, Keyboard
} from "react-native";
import Delete from "../../Assets/Images/remove.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useCustomer } from "../../Context/CustomerContext";
import { CommonContexts } from "../../Context/CommonContext";
import { BankingContext } from "../../Context/BankingContext";
import { useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import customParseFormat from "dayjs/plugin/customParseFormat";
import SuccessModal from "../../ToastFile/ToastPage";


export default function AssignTenant({ navigation, route }) {
  const { selectedBed, onBedAdded } = route.params || {};

  const { getCustomersByHostel, checkInCustomer, bookCustomer } = useCustomer();
  const { activeHostelId } = useContext(CommonContexts);
  const { getBankListByHostel } = useContext(BankingContext);

  const [activeTab, setActiveTab] = useState("CheckIn");
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(null);
  dayjs.extend(customParseFormat);
  const [openJoinDatePic, setOpenJoinDatePic] = useState("");
  const [joiningDate, setJoiningDate] = useState(null);
  const [openCheckJoinDatePic, setOpenCheckJoinDatePic] = useState("");
  const [checkJoiningDate, setcheckJoiningDate] = useState(dayjs());
  const [bookingAmount, setBookingAmount] = useState("");
  const [rentalAmount, setRentalAmount] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [extraCharges, setExtraCharges] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [CheckinTenants, setCheckinTenants] = useState([])
  const [checkinTenantsOpen, setCheckinTenantsopen] = useState(false);
  const [CheckinTenantSelected, setCheckinTenantSelected] = useState(null);
  const StayType = ["LongStay"];
  const [StayTypeOpen, setStayTypeOpen] = useState(false);
  const [StayTypeSelected, setStayTypeSelected] = useState("Stay Type");
  const maintenanceAlreadyUsed = extraCharges.some(c => c.type === "Maintenance");
  const [tenentsError, setTenantsError] = useState("")
  const [rentalError, setRentalError] = useState("")
  const [advanceError, setAdvanceError] = useState("")
  const [checkJoinDateError, setCheckJoinDateError] = useState("")
  const [stayTypeError, setStayTypeError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [AccountsList, setAccountList] = useState([]);
  const [accountOpen, setAccountopen] = useState(false);
  const [accountSelected, setAccountSelected] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("")
  const [bookingDateError, setBookingDateError] = useState("");
  const [joiningDateError, setJoiningDateError] = useState("");
  const [bookingAmountError, setBookingAmountError] = useState("");
  const [bankError, setBankError] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);
  const CALENDAR_HEIGHT = 340;
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const scrollRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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



  const scrollToY = (y = 300) => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y,
        animated: true,
      });
    }, 120);
  };
 
  const scrollInputIntoView = (ref) => {
    if (!ref?.current) return;

    setTimeout(() => {
      ref.current.measureInWindow((x, y, w, h) => {
        const visibleArea = SCREEN_HEIGHT - keyboardHeight;
        const inputBottom = y + h;

        if (inputBottom > visibleArea - 20) {
          scrollRef.current?.scrollTo({
            y: inputBottom - visibleArea + 40,
            animated: true,
          });
        }
      });
    }, 80);
  };

  const inputRefs = useRef({});
  const getSafeCalendarTop = (y, h) => {
    const belowSpace = SCREEN_HEIGHT - (y + h);


    if (belowSpace > CALENDAR_HEIGHT + 20) {
      return y + h + 8;
    }

    // இல்லனா → மேல open
    return Math.max(80, y - CALENDAR_HEIGHT - 8);
  };

  const [datePickerTop, setDatePickerTop] = useState(0);

  const bookingDateRef = useRef(null);
  const joiningDateRef = useRef(null);
  const checkinDateRef = useRef(null);

  const TYPE_OPTIONS = ["Maintenance", "Others"];


  const addCharge = () => {
    setExtraCharges(prev => [
      ...prev,
      { id: Date.now(), type: "", title: "", amount: "" }
    ]);
  };

  const removeCharge = (id) => {
    setExtraCharges(prev => prev.filter(i => i.id !== id));

  };
  useFocusEffect(
    useCallback(() => {
      fetchWalkinCustomers();
    }, [activeHostelId])
  );

  const fetchWalkinCustomers = async () => {
    const data = await getCustomersByHostel(
      activeHostelId,
      "",
      "Inactive"
    );
    // setCheckinTenants(data?.listCustomers || []);
    const list = data?.listCustomers || [];
    setCheckinTenants(list);
    if (list?.length === 0) {
      setModalType("error");
      setMessage("Please Create a New Tenant");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    };
  }
  console.log("setCheckinTenants", CheckinTenants)
  const selectType = (id, type) => {


    if (type === "Maintenance" && maintenanceAlreadyUsed) return;

    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "" } : i))
    );

    setOpenDropdownId(null);
  };

  const fetchBankingList = async () => {
    const data = await getBankListByHostel(activeHostelId);
    setAccountList(data.data);
  };

  useEffect(() => {
    if (activeHostelId) {
      fetchBankingList(activeHostelId);
    }
  }, [activeHostelId]);



  const updateTitle = (id, title) => {
    // setExtraCharges(prev =>
    //   prev.map(i => (i.id === id ? { ...i, title } : i))
    // );
      setExtraCharges(prev =>
    prev.map(i =>
      i.id === id
        ? { ...i, title, titleError: "" }
        : i
    )
  );
  };

  // const updateAmount = (id, amount) => {
  //   setExtraCharges(prev =>
  //     prev.map(i => (i.id === id ? { ...i, amount } : i))
  //   );
  // };
  const updateAmount = (id, amount) => {
  const onlyNum = amount.replace(/[^0-9]/g, "");

  setExtraCharges((prev) =>
    prev.map((i) =>
      i.id === id
        ? { ...i, amount: onlyNum, amountError: "" }
        : i
    )
  );
};


  const validateBooking = () => {
    let valid = true;

    setBookingDateError("");
    setJoiningDateError("");
    setBookingAmountError("");
    setBankError("");


    if (!CheckinTenantSelected) {
      setTenantsError("Please Select Tenant");
      valid = false;
    }

    if (!purchaseDate) {
      setBookingDateError("Please Select Booking Date");
      valid = false;
    }

    if (!joiningDate) {
      setJoiningDateError("Please Select Joining Date");
      valid = false;
    }

    if (!bookingAmount || Number(bookingAmount) <= 0) {
      setBookingAmountError("Enter Valid Booking Amount");
      valid = false;
    }

    if (!accountSelected) {
      setBankError("Please Select Mode Of Transaction");
      valid = false;
    }

    return valid;
  };
  const handleBookingSubmit = async () => {
    if (!validateBooking()) return;

    if (!selectedBed) {
      alert("Bed data missing");
      return;
    }

    const payload = {
      customerId: CheckinTenantSelected?.customerId,
      bookingDate: dayjs(purchaseDate).format("DD-MM-YYYY"),
      joiningDate: dayjs(joiningDate).format("DD-MM-YYYY"),
      bookingAmount: Number(bookingAmount),

      floorId: selectedBed.floorId,
      roomId: selectedBed.roomId,
      bedId: selectedBed.bedId,

      bankId: accountSelected.bankingId,
      referenceNumber: referenceNumber || "",
    };

    const res = await bookCustomer(activeHostelId, payload);

    if (res.success) {
      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigation.goBack();
      }, 800);
    } else {
      alert(res.message || "Booking failed");
    }
  };
    const validateExtraCharges = () => {
  let valid = true;

  const updated = extraCharges.map((e) => {
    let titleError = "";
    let amountError = "";

    const titleFilled = e.title?.trim()?.length > 0;
    const amountFilled = e.amount !== "" && e.amount !== null && e.amount !== undefined;

    const amt = Number(e.amount);

   
    if (!e.type) {
      return { ...e, titleError: "", amountError: "" };
    }

   
    if (e.type === "Maintenance") {
      if (!amountFilled) {
        amountError = "Please enter maintenance amount";
        valid = false;
      } else if (isNaN(amt) || amt <= 0) {
        amountError = "Amount must be greater than 0";
        valid = false;
      }

      return { ...e, titleError: "", amountError };
    }

    // ✅ CASE 3: Others -> reason + amount both mandatory
    if (e.type === "Others") {
      // both empty -> ok (optional row)
      if (!titleFilled && !amountFilled) {
        return { ...e, titleError: "", amountError: "" };
      }

      if (!titleFilled) {
        titleError = "Please enter reason";
        valid = false;
      }

      if (!amountFilled) {
        amountError = "Please enter amount";
        valid = false;
      } else if (isNaN(amt) || amt <= 0) {
        amountError = "Amount must be greater than 0";
        valid = false;
      }

      return { ...e, titleError, amountError };
    }

    return { ...e, titleError: "", amountError: "" };
  });

  setExtraCharges(updated);
  return valid;
};

  const handleCheckIn = async () => {
      const chargeValid = validateExtraCharges();
  if (!chargeValid) return;
    const customerId = CheckinTenantSelected?.customerId;


    let hasError = false;


    setTenantsError("");
    setRentalError("");
    setAdvanceError("");
    setCheckJoinDateError("");
    setStayTypeError("")


    if (!CheckinTenantSelected) {
      setTenantsError("Please Select Tenant");
      hasError = true;
    }


    if (!rentalAmount || Number(rentalAmount) <= 0) {
      setRentalError("Enter Valid Rental Amount");
      hasError = true;
    }
    if (!StayTypeSelected || StayTypeSelected === "Stay Type") {
      setStayTypeError("Please Select Stay Type");
      hasError = true;
    }

    if (!advanceAmount || Number(advanceAmount) < 0) {
      setAdvanceError("Enter Valid Advance Amount");
      hasError = true;
    }


    if (!checkJoiningDate) {
      setCheckJoinDateError("Please Select Joining Date");
      hasError = true;
    }

    if (hasError) return;

    if (!selectedBed) {
      alert("Bed data missing");
      return;
    }

    const payload = {
      floorId: selectedBed.floorId,
      roomId: selectedBed.roomId,
      bedId: selectedBed.bedId,

      joiningDate: dayjs(checkJoiningDate).format("DD-MM-YYYY"),

      advanceAmount: Number(advanceAmount),
      rentalAmount: Number(rentalAmount),

      stayType: "SHORT",


      deductions: extraCharges.map((e) => ({
        type:
          e.type === "Others"
            ? e.title.trim().toLowerCase()
            : e.type.toLowerCase(),
        amount: Number(e.amount),
      })),
    };

    const res = await checkInCustomer(
      customerId,
      payload
    );

    if (res.success) {
      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onBedAdded && onBedAdded(selectedBed.roomId)
        navigation.goBack();
      }, 800);


    } else {
      alert(res.message);
    }
  };
  const today = dayjs();

  const isDisabledCheckInDate = (d) => {
    if (!d) return false;

    if (d.isAfter(today, "day")) return true;

    return false;
  };

  const checkInMarkedDates = {};

  for (let i = -90; i <= 90; i++) {
    const d = dayjs().add(i, "day");
    const key = d.format("YYYY-MM-DD");

    if (isDisabledCheckInDate(d)) {
      checkInMarkedDates[key] = {
        disabled: true,
        disableTouchEvent: true,
        customStyles: {
          container: {
            backgroundColor: "#F3F4F6",
            opacity: 0.4,
            borderRadius: 8,
          },
          text: {
            color: "#9CA3AF",
          },
        },
      };
    }
  }


  const isBookingDateDisabled = (d) => {
    if (!d) return false;

    if (d.isAfter(today, "day")) return true;

    return false;
  };

  const bookingMarkedDates = {};

  for (let i = -180; i <= 180; i++) {
    const d = dayjs().add(i, "day");
    const key = d.format("YYYY-MM-DD");

    if (isBookingDateDisabled(d)) {
      bookingMarkedDates[key] = {
        disabled: true,
        disableTouchEvent: true,
        customStyles: {
          container: {
            backgroundColor: "#F3F4F6",
            opacity: 0.4,
            borderRadius: 8,
          },
          text: {
            color: "#9CA3AF",
          },
        },
      };
    }
  }
  const isJoiningDateDisabled = (d) => {
    if (!d) return false;

    if (!purchaseDate) return true;

    if (d.isBefore(dayjs(purchaseDate), "day")) return true;

    return false;
  };
  const joiningMarkedDates = {};

  for (let i = -180; i <= 180; i++) {
    const d = dayjs().add(i, "day");
    const key = d.format("YYYY-MM-DD");

    if (isJoiningDateDisabled(d)) {
      joiningMarkedDates[key] = {
        disabled: true,
        disableTouchEvent: true,
        customStyles: {
          container: {
            backgroundColor: "#F3F4F6",
            opacity: 0.4,
            borderRadius: 8,
          },
          text: {
            color: "#9CA3AF",
          },
        },
      };
    }
  }
  const clearAllErrors = () => {
    // common
    setTenantsError("");

    // Booking errors
    setBookingDateError("");
    setJoiningDateError("");
    setBookingAmountError("");
    setBankError("");

    // CheckIn errors
    setRentalError("");
    setAdvanceError("");
    setCheckJoinDateError("");
    setStayTypeError("");
  };
  const resetBookingState = () => {
    setPurchaseDate(null);
    setJoiningDate(null);
    setBookingAmount("");
    setAccountSelected(null);
    setReferenceNumber("");

    setCheckinTenantSelected(null);
    setCheckinTenantsopen(false);

    setOpenDropdownId(null);
  };
  const resetCheckInState = () => {
    setRentalAmount("");
    setAdvanceAmount("");
    setStayTypeSelected("Stay Type");
    setExtraCharges([]);

    setCheckinTenantSelected(null);
    setCheckinTenantsopen(false);

    setcheckJoiningDate(dayjs()); 
    setOpenDropdownId(null);
  };


  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <View style={styles.container}>


        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>← Assign Tenant</Text>
        </TouchableOpacity>

        <Text style={styles.roomText}>Room No :{selectedBed?.roomName} | Bed : {selectedBed?.bedName}</Text>


        <View style={styles.tabRow}>


          <TouchableOpacity
            style={[styles.tab, activeTab === "CheckIn" && styles.tabActive]}
            onPress={() => {
              setActiveTab("CheckIn");
              setCheckinTenantSelected(null);
              setCheckinTenantsopen(false);
              setTenantsError("")
              clearAllErrors();
              resetBookingState();
              clearAllErrors();
            }}

          >
            <Text style={[styles.tabText, activeTab === "CheckIn" && styles.tabTextActive]}>
              Check-In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Booking" && styles.tabActive]}
            onPress={() => {
              setActiveTab("Booking");
              setCheckinTenantSelected(null);
              setCheckinTenantsopen(false);
              setTenantsError("")
              clearAllErrors();
              resetCheckInState();
              clearAllErrors();
            }}

          >
            <Text style={[styles.tabText, activeTab === "Booking" && styles.tabTextActive]}>
              Booking
            </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
        {/* <ScrollView
  ref={scrollRef}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: keyboardHeight + 80,
  }}
> */}
<ScrollView
  ref={scrollRef}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  scrollEnabled={!checkinTenantsOpen}   // ✅ dropdown open = parent scroll OFF
  nestedScrollEnabled={true}
  contentContainerStyle={{
    paddingBottom: keyboardHeight + 80,
  }}
>

            {activeTab === "Booking" && (
              <>
                <Text style={styles.label}>Select Tenant <Text style={{ color: "red" }}>*</Text></Text>

                <View style={{ position: "relative" }}>

                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => setCheckinTenantsopen(!checkinTenantsOpen)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.selectText}>
                      {CheckinTenantSelected?.fullName || "Select Tenant"}

                    </Text>
                    <Image source={DownArrow} style={styles.arrow} />
                  </TouchableOpacity>

                  {tenentsError && (
                    <ErrorMessage message={tenentsError} type="error" />
                  )}
{/* {checkinTenantsOpen && (
  <View style={styles.dropdownMenuone}>
    <ScrollView
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ maxHeight: 200 }}
    >
      {CheckinTenants.map((v, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => {
            setCheckinTenantSelected(v);
            setCheckinTenantsopen(false);
            setTenantsError("");
          }}
        >
          <Text style={styles.optionText}>{v.fullName}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)} */}
{checkinTenantsOpen && (
  <View style={styles.dropdownMenuone}>
    <ScrollView
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ maxHeight: 160 }}
    >
      {CheckinTenants.map((v, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => {
            setCheckinTenantSelected(v);
            setCheckinTenantsopen(false);
            setTenantsError("");
          }}
        >
          <Text style={styles.optionText}>{v.fullName}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}


                  {/* {checkinTenantsOpen && (
                    <View style={styles.dropdownMenuone}>
                      <ScrollView style={{ maxHeight: 160 }}>
                        {CheckinTenants && CheckinTenants?.map((v, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.option}
                            onPress={() => {
                              setCheckinTenantSelected(v);
                              setCheckinTenantsopen(false);
                              setTenantsError("")
                            }}
                          >
                            <Text style={styles.optionText}>{v.fullName}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )} */}
                </View>

                <Text style={styles.label}>Booking Date <Text style={{ color: "red" }}>*</Text></Text>
                <View ref={bookingDateRef} collapsable={false}>
                  <TouchableOpacity
                    style={styles.dateBox}
                    onPress={() => {
                      bookingDateRef.current.measureInWindow((x, y, w, h) => {
                        setDatePickerTop(getSafeCalendarTop(y, h));
                        setActiveDateField("booking");
                        setShowCalendar(true);
                      });
                    }}
                  >
                    <Text style={styles.placeholder}>
                      {purchaseDate ? dayjs(purchaseDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                    </Text>
                    <Image source={require("../../Assets/Images/calendar.png")} style={styles.icon} />
                  </TouchableOpacity>
                </View>

                {bookingDateError && (
                  <ErrorMessage message={bookingDateError} type="error" />
                )}
                <Text style={styles.label}>Booking Amount <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  value={bookingAmount}
                  // onChangeText={setBookingAmount}
                  onChangeText={(text) => {
                    setBookingAmount(text);
                    setBookingAmountError("");
                  }}
                />
                {bookingAmountError && (
                  <ErrorMessage message={bookingAmountError} type="error" />
                )}
                <Text style={styles.label}>Joining Date <Text style={{ color: "red" }}>*</Text></Text>
                <View ref={joiningDateRef} collapsable={false}>
                  <TouchableOpacity
                    style={styles.dateBox}
                    onPress={() => {
                      joiningDateRef.current.measureInWindow((x, y, w, h) => {
                        setDatePickerTop(getSafeCalendarTop(y, h));
                        setActiveDateField("joining");
                        setShowCalendar(true);
                      });
                    }}
                  >
                    <Text style={styles.placeholder}>
                      {joiningDate ? dayjs(joiningDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                    </Text>
                    <Image source={require("../../Assets/Images/calendar.png")} style={styles.icon} />
                  </TouchableOpacity>
                </View>

                {joiningDateError && (
                  <ErrorMessage message={joiningDateError} type="error" />
                )}
                <Text style={styles.label}>Mode Of Transaction <Text style={{ color: "red" }}>*</Text></Text>
                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    onPress={() => setAccountopen(!accountOpen)}
                    style={styles.inputBox}
                  >

                    <Text style={styles.selectText}>
                      {accountSelected
                        ? `${accountSelected.accountHolderName} - ${accountSelected.accountType}`
                        : "Select Bank"}
                    </Text>
                    <Image source={DownArrow} style={styles.arrow} />
                  </TouchableOpacity>
                  {bankError && (
                    <ErrorMessage message={bankError} type="error" />
                  )}


                  {accountOpen && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView style={{ maxHeight: 150 }}>
                        {AccountsList.map((v, i) => (
                          <TouchableOpacity
                            key={i}
                            style={styles.option}
                            onPress={() => {
                              setAccountSelected(v);
                              setAccountopen(false);
                              setBankError("")
                            }}
                          >
                            <Text style={styles.optionText}>{v.accountHolderName}-{v.accountType}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                  <Text style={styles.label}>Transaction Id</Text>
                  <TextInput
                    placeholder="Enter Transaction Id"
                    placeholderTextColor="#999"
                    onChangeText={setReferenceNumber}
                    value={referenceNumber}
                    style={styles.inputBox}
                  />
                </View>




              </>

            )}


            {activeTab === "CheckIn" && (
              <>
                <Text style={styles.label}>Select Tenant <Text style={{ color: "red" }}>*</Text></Text>

                <View style={{ position: "relative" }}>

                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => setCheckinTenantsopen(!checkinTenantsOpen)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.selectText}>
                      {CheckinTenantSelected?.fullName || "Select Tenant"}

                    </Text>
                    <Image source={DownArrow} style={styles.arrow} />
                  </TouchableOpacity>

                  {tenentsError && (
                    <ErrorMessage message={tenentsError} type="error" />
                  )}
{checkinTenantsOpen && (
  <View style={styles.dropdownMenuone}>
    <ScrollView
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ maxHeight: 160 }}
    >
      {CheckinTenants.map((v, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => {
            setCheckinTenantSelected(v);
            setCheckinTenantsopen(false);
            setTenantsError("");
          }}
        >
          <Text style={styles.optionText}>{v.fullName}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}

                  {/* {checkinTenantsOpen && (
                    <View style={styles.dropdownMenuone}>
                      <ScrollView style={{ maxHeight: 160 }}>
                        {CheckinTenants.map((v, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.option}
                            onPress={() => {
                              setCheckinTenantSelected(v);
                              setCheckinTenantsopen(false);
                              setTenantsError("")
                            }}
                          >
                            <Text style={styles.optionText}>{v.fullName}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )} */}
                </View>
                <Text style={styles.label}>
                  Stay Type <Text style={{ color: "red" }}>*</Text>
                </Text>

                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => setStayTypeOpen(!StayTypeOpen)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.selectText}>{StayTypeSelected}</Text>
                    <Image source={DownArrow} style={styles.arrow} />
                  </TouchableOpacity>

                  {stayTypeError && (
                    <ErrorMessage message={stayTypeError} type="error" />
                  )}

                  {StayTypeOpen && (
                    <View style={styles.dropdownMenuone}>
                      <ScrollView style={{ maxHeight: 160 }}>
                        {StayType.map((v, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.option}
                            onPress={() => {
                              setStayTypeSelected(v);
                              setStayTypeOpen(false);
                              setStayTypeError(""); // 🔥 clear error
                            }}
                          >
                            <Text style={styles.optionText}>{v}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>



                <Text style={styles.label}>Rental Amount <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder={
                    selectedBed?.rentAmount
                      ? String(selectedBed.rentAmount)
                      : "Enter Amount"
                  }
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={rentalAmount}
                  onChangeText={(text) => {
                    setRentalAmount(text);
                    setRentalError("");
                  }}

                />
                {rentalError && (
                  <ErrorMessage message={rentalError} type="error" />
                )}


                <Text style={styles.label}>Advance Amount <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Amount"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={advanceAmount}
                  onChangeText={(text) => {
                    setAdvanceAmount(text);
                    setAdvanceError("");
                  }}

                />
                {advanceError && (
                  <ErrorMessage message={advanceError} type="error" />
                )}
                <Text style={styles.label}>Joining Date <Text style={{ color: "red" }}>*</Text></Text>

                <View ref={checkinDateRef} collapsable={false}>
                  <TouchableOpacity
                    style={styles.dateBox}
                    onPress={() => {
                      checkinDateRef.current.measureInWindow((x, y, w, h) => {
                        setDatePickerTop(getSafeCalendarTop(y, h));
                        setActiveDateField("checkin");
                        setShowCalendar(true);
                      });
                    }}
                  >
                    <Text style={styles.placeholder}>
                      {checkJoiningDate
                        ? dayjs(checkJoiningDate).format("DD-MM-YYYY")
                        : "DD-MM-YYYY"}
                    </Text>
                    <Image source={require("../../Assets/Images/calendar.png")} style={styles.icon} />
                  </TouchableOpacity>
                </View>

                {checkJoinDateError && (
                  <ErrorMessage message={checkJoinDateError} type="error" />
                )}

              </>
            )}

            {activeTab === "CheckIn" && (
              <View style={styles.nonRefund}>
                <View style={styles.extraHeader}>
                  <Text style={styles.label}>Non Refundable Amount</Text>

                  <TouchableOpacity style={styles.addBtn} onPress={addCharge}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Add</Text>
                  </TouchableOpacity>
                </View>

                {extraCharges.map((item) => (
                  <View key={item.id} style={styles.figmaRowWrapper}>

                    {/* CLOSE BTN */}
                    <TouchableOpacity
                      onPress={() => removeCharge(item.id, item.type)}
                      style={styles.figmaCloseBtn}
                    >

                      <Image
                        source={Delete}
                        style={styles.figmaCloseText}
                      />
                    </TouchableOpacity>


                    <View style={styles.figmaRow}>


                      {item.type === "" ? (
                        <TouchableOpacity
                          style={styles.figmaLeftBox}
                          onPress={() =>
                            setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                          }
                        >
                          <Text style={{ color: "#777" }}>Select...</Text>
                          <Image source={DownArrow} style={styles.arrow} />
                        </TouchableOpacity>
                      ) : item.type === "Others" ? (
                        <TextInput
                          ref={(r) => {
    inputRefs.current[`reason-${item.id}`] = r;
  }}
                          style={styles.figmaLeftBox}
                          placeholder="Enter reason"

                          value={item.title}
                          onFocus={() => {
    setOpenDropdownId(null);
    scrollInputIntoView(inputRefs.current[`reason-${item.id}`]);
  }}

                          // onChangeText={(t) => updateTitle(item.id, t)}
                          onChangeText={(t) => {
                            const onlyLetters = t.replace(/[^a-zA-Z\s]/g, "");
                            updateTitle(item.id, onlyLetters);
                          }}
                        />
                      ) : (
                        <View style={[styles.figmaLeftBox, { backgroundColor: "#EFEFEF" }]}>
                          <Text>Maintenance</Text>
                        </View>
                      )}

                      {/* RIGHT BOX ALWAYS VISIBLE (disabled until type selected) */}
                      {item.type === "" ? (
                        <View style={[styles.figmaRightBox, { opacity: 0.4 }]}>
                          <Text style={{ color: "#999" }}>Enter amount</Text>
                        </View>
                      ) : (
                        <TextInput
                         ref={(r) => {
    inputRefs.current[`amount-${item.id}`] = r;
  }}
                          style={styles.figmaRightBox}
                          placeholder="Enter amount"
                          keyboardType="numeric"
                          value={item.amount}
                          onFocus={() => {
    setOpenDropdownId(null);
    scrollInputIntoView(inputRefs.current[`amount-${item.id}`]);
  }}
                          onChangeText={(t) => updateAmount(item.id, t)}
                        />
                      )}

                    </View>

{item.titleError && (
                  <ErrorMessage message={item.titleError} type="error" />
                )}

 {item.amountError && (
                  <ErrorMessage message={item.amountError} type="error" />
                )}
                    {openDropdownId === item.id && item.type === "" && (
                      <View style={styles.nonRefundDropdown}>
                        {TYPE_OPTIONS.map((t) => {

                          const disabled = t === "Maintenance" && maintenanceAlreadyUsed;

                          return (
                            <TouchableOpacity
                              key={t}
                              disabled={disabled}
                              onPress={() => !disabled && selectType(item.id, t)}
                              style={{ opacity: disabled ? 0.3 : 1 }}
                            >
                              <Text style={styles.dropdownItem}>{t}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}

                  </View>
                ))}





              </View>
            )}


            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn}
                //  onPress={handleCheckIn}
                onPress={activeTab === "Booking" ? handleBookingSubmit : handleCheckIn}

              >
                <Text style={styles.submitText}>
                  {activeTab === "Booking" ? "Book" : "Check-In"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 60 }} />
          </ScrollView>
        </KeyboardAvoidingView>
        {/* {openCheckJoinDatePic && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenCheckJoinDatePic(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
              date={checkJoiningDate}
              onChange={(p) => {
                setcheckJoiningDate(p.date || dayjs());
                setOpenCheckJoinDatePic(false);
              }}
            />
          </View>
        </View>
      )} */}
        {showCalendar && (
          <View style={styles.sheetOverlay}>
            <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

            <View style={[styles.datePickerBox, { top: datePickerTop }]}>
              <Calendar
                minDate={
                  activeDateField === "joining" && purchaseDate
                    ? dayjs(purchaseDate).format("YYYY-MM-DD")
                    : undefined
                }
                maxDate={
                  activeDateField === "booking" || activeDateField === "checkin"
                    ? dayjs().format("YYYY-MM-DD")
                    : undefined
                }
                onDayPress={(day) => {
                  const selected = dayjs(day.dateString);

                  if (activeDateField === "booking") {
                    setPurchaseDate(day.dateString);
                    setJoiningDate(null);
                    setBookingDateError("");
                  }

                  if (activeDateField === "joining") {
                    setJoiningDate(day.dateString);
                    setJoiningDateError("");
                  }

                  if (activeDateField === "checkin") {
                    setcheckJoiningDate(day.dateString);
                    setCheckJoinDateError("");
                  }

                  setShowCalendar(false);
                  setActiveDateField(null);
                }}
                theme={{
                  todayTextColor: "#2563EB",
                  selectedDayBackgroundColor: "#2563EB",
                  selectedDayTextColor: "#FFFFFF",
                  textDisabledColor: "#9CA3AF",
                }}
              />

            </View>
          </View>
        )}

        {openJoinDatePic && (
          <View style={styles.sheetOverlay}>
            <TouchableWithoutFeedback onPress={() => setOpenJoinDatePic(false)}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

            <View style={styles.datePickerBox}>
              <Calendar
                markingType="custom"
                markedDates={joiningMarkedDates}
                onDayPress={(day) => {
                  if (joiningMarkedDates[day.dateString]?.disabled) return;

                  setJoiningDate(day.dateString);
                  setOpenJoinDatePic(false);
                  setJoiningDateError("")
                }}
                theme={{
                  todayTextColor: "#2563EB",
                  selectedDayBackgroundColor: "#2563EB",
                  selectedDayTextColor: "#FFFFFF",
                  textDisabledColor: "#9CA3AF",
                }}
              />

            </View>
          </View>
        )}
        {openDatePicker && (
          <View style={styles.sheetOverlay}>
            <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

            <View style={styles.datePickerBox}>
              <Calendar
                markingType="custom"
                markedDates={bookingMarkedDates}
                onDayPress={(day) => {
                  if (bookingMarkedDates[day.dateString]?.disabled) return;

                  setPurchaseDate(day.dateString);
                  setJoiningDate(null);
                  setOpenDatePicker(false);
                  setBookingDateError("")
                }}
                theme={{
                  todayTextColor: "#2563EB",
                  selectedDayBackgroundColor: "#2563EB",
                  selectedDayTextColor: "#FFFFFF",
                  textDisabledColor: "#9CA3AF",
                }}
              />

            </View>
          </View>
        )}
        {openCheckJoinDatePic && (

          <View style={styles.sheetOverlay}>
            <TouchableWithoutFeedback onPress={() => setOpenCheckJoinDatePic(false)}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

            <View style={styles.datePickerBox}>
              <Calendar
                markingType="custom"
                markedDates={checkInMarkedDates}
                current={dayjs(checkJoiningDate).format("YYYY-MM-DD")}
                onDayPress={(day) => {
                  if (checkInMarkedDates[day.dateString]?.disabled) return;

                  setcheckJoiningDate(day.dateString);
                  setOpenCheckJoinDatePic(false);
                  setCheckJoinDateError("")
                }}
                theme={{
                  todayTextColor: "#2563EB",
                  selectedDayBackgroundColor: "#2563EB",
                  selectedDayTextColor: "#FFFFFF",
                  textDisabledColor: "#9CA3AF",
                  arrowColor: "#111827",
                }}
              />
            </View>
          </View>

        )}

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },

  backArrow: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },

  roomText: {
    fontSize: 13,
    color: "#1E45E1",
    marginBottom: 15,
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#E9ECF7",
    padding: 4,
    borderRadius: 10,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#1D5DFF",
  },
  tabText: {
    textAlign: "center",
    fontSize: 14,
    color: "#000000",
  },
  nonRefundDropdown: {
    position: "absolute",
    top: 55,
    left: 0,
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 12,
    zIndex: 20,
    elevation: 10,
  },

  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  label: {
    marginTop: 18,
    marginBottom: 5,
    fontWeight: "600",
    color: "#444",
  },

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

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },

  icon: { width: 20, height: 20 },

  extraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  addBtn: {
    backgroundColor: "#2D6CDF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },


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

  arrow: { width: 18, height: 18, tintColor: "#444" },

  dropdownMenu: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 999,
    elevation: 10,
  },

  dropdownItem: {
    padding: 12,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
dropdownMenuone: {
  position: "absolute",
  top: 50,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  zIndex: 999,
  elevation: 10,

  maxHeight: 220,   // ✅ முக்கியம்
  overflow: "hidden" // ✅ scroll clean ஆகும்
},


  // dropdownMenuone: {
  //   position: "absolute",
  //   top: 50,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: "#fff",
  //   borderWidth: 1,
  //   borderColor: "#ddd",
  //   borderRadius: 12,
  //   zIndex: 999,
  //   elevation: 10,
  // },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  selectText: { color: "#555" },
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
  placeholder: { color: "#555" },


  optionText: {
    fontSize: 15,
    color: "#000",
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
    borderColor: "#DCDCDC",
    borderRadius: 30,
    padding: 5,
    marginBottom: 300,
    borderWidth: 0.5,
  },
  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  //   sheetOverlay: {
  //  position: "absolute",
  //   top: 40,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: "rgba(0,0,0,0.2)",

  //   },



  figmaRowWrapper: {
    marginTop: 20,
    position: "relative",
  },

  figmaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  figmaLeftBox: {
    width: "48%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  figmaRightBox: {
    width: "45%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    justifyContent: "center",
    marginRight: 20
  },

  figmaCloseBtn: {
    position: "absolute",
    right: 5,
    top: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E1E1E1",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  figmaCloseText: {
    width: 10,
    height: 10
  },
  nonRefund: {
    backgroundColor: "#F7F9FF",
    padding: 10,
    marginTop: 10,
    borderRadius: 20
  },
  inputBox: {
    borderColor: "#e1e1e1",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1
  },


});

