import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Modal
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

  const [activeTab, setActiveTab] = useState("Booking");
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
    setCheckinTenants(data);
  };

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
    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, title } : i))
    );
  };

  const updateAmount = (id, amount) => {
    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, amount } : i))
    );
  };

  const validateBooking = () => {
    let valid = true;

    setBookingDateError("");
    setJoiningDateError("");
    setBookingAmountError("");
    setBankError("");


    if (!CheckinTenantSelected) {
      setTenantsError("Please select tenant");
      valid = false;
    }

    if (!purchaseDate) {
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
      setBankError("Please select bank account");
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


  const handleCheckIn = async () => {
    const customerId = CheckinTenantSelected?.customerId;


    let hasError = false;


    setTenantsError("");
    setRentalError("");
    setAdvanceError("");
    setCheckJoinDateError("");
    setStayTypeError("")


    if (!CheckinTenantSelected) {
      setTenantsError("Please select tenant");
      hasError = true;
    }


    if (!rentalAmount || Number(rentalAmount) <= 0) {
      setRentalError("Enter valid rental amount");
      hasError = true;
    }
    if (!StayTypeSelected || StayTypeSelected === "Stay Type") {
      setStayTypeError("Please select stay type");
      hasError = true;
    }

    if (!advanceAmount || Number(advanceAmount) < 0) {
      setAdvanceError("Enter valid advance amount");
      hasError = true;
    }


    if (!checkJoiningDate) {
      setCheckJoinDateError("Please select joining date");
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
            style={[styles.tab, activeTab === "Booking" && styles.tabActive]}
            onPress={() => {
              setActiveTab("Booking");
              setCheckinTenantSelected(null);
              setCheckinTenantsopen(false);
              setTenantsError("")
              clearAllErrors();
            }}

          >
            <Text style={[styles.tabText, activeTab === "Booking" && styles.tabTextActive]}>
              Booking
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "CheckIn" && styles.tabActive]}
            // onPress={() => setActiveTab("CheckIn")}
            onPress={() => {
              setActiveTab("CheckIn");
              setCheckinTenantSelected(null);
              setCheckinTenantsopen(false);
              setTenantsError("")
              clearAllErrors();
            }}

          >
            <Text style={[styles.tabText, activeTab === "CheckIn" && styles.tabTextActive]}>
              Check In
            </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
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

                  {checkinTenantsOpen && (
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
                  )}
                </View>

                <Text style={styles.label}>Booking Date</Text>
                <TouchableOpacity style={styles.dateBox} onPress={() => setOpenDatePicker(true)}>
                  <Text style={styles.placeholder}>
                    {purchaseDate ? dayjs(purchaseDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                  </Text>
                  <Image
                    source={require("../../Assets/Images/calendar.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                {bookingDateError && (
                  <ErrorMessage message={bookingDateError} type="error" />
                )}
                <Text style={styles.label}>Booking Amount</Text>
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
                <Text style={styles.label}>Joining Date *</Text>
                <TouchableOpacity style={styles.dateBox} onPress={() => setOpenJoinDatePic(true)}>
                  <Text style={styles.placeholder}>
                    {joiningDate ? dayjs(joiningDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                  </Text>
                  <Image
                    source={require("../../Assets/Images/calendar.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                {joiningDateError && (
                  <ErrorMessage message={joiningDateError} type="error" />
                )}
                <Text style={styles.label}>Transferred Account <Text style={{ color: "red" }}>*</Text></Text>
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
                  )}
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

                <TouchableOpacity
                  style={styles.dateBox}
                  onPress={() => setOpenCheckJoinDatePic(true)}
                >
                  <Text style={styles.placeholder}>
                    {checkJoiningDate
                      ? dayjs(checkJoiningDate).format("DD-MM-YYYY")
                      : "DD-MM-YYYY"}
                  </Text>

                  <Image
                    source={require("../../Assets/Images/calendar.png")}
                    style={styles.icon}
                  />
                </TouchableOpacity>
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
                          style={styles.figmaLeftBox}
                          placeholder="Enter reason"
                          value={item.title}
                          onChangeText={(t) => updateTitle(item.id, t)}
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
                          style={styles.figmaRightBox}
                          placeholder="Enter amount"
                          keyboardType="numeric"
                          value={item.amount}
                          onChangeText={(t) => updateAmount(item.id, t)}
                        />
                      )}

                    </View>


                    {openDropdownId === item.id && item.type === "" && (
                      <View style={styles.dropdownMenu}>
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
                  {activeTab === "Booking" ? "Book" : "Check In"}
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

            <View style={styles.datePickerBox1}>
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
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 30 },

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
  },

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
    backgroundColor: "#fff",
    width: "80%",
    borderColor: "#DCDCDC",
    borderRadius: 30,
    padding: 5,
    marginBottom: 90,
    borderWidth: 0.5,
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
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "flex-end",

  },



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

