import React, { useState, useCallback, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView, BackHandler, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import Calendarimg from "../../../Assets/Images/calendar.png";
import Delete from "../../../Assets/Images/remove.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { useFocusEffect } from '@react-navigation/native';
import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import { Calendar } from "react-native-calendars";
import customParseFormat from "dayjs/plugin/customParseFormat";


export default function ReserveToCheckin({ route, navigation }) {

  const { selectedBed, selectedBedReserv, onBedAdded } = route.params || {};

  console.log("selectedBedReserv", selectedBedReserv)
  const [openJoinPicker, setOpenJoinPicker] = useState(false);
  const { activeHostelId } = useContext(CommonContexts);

  const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel, initializeCheckIn, bookedCheckInCustomer } = useCustomer();
  const [joinDate, setJoinDate] = useState(dayjs());
  const [extraCharges, setExtraCharges] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const StayType = ["LongStay"];
  const [StayTypeOpen, setStayTypeOpen] = useState(false);
  const [StayTypeSelected, setStayTypeSelected] = useState("Stay Type");
  const maintenanceAlreadyUsed = extraCharges.some(c => c.type === "Maintenance");
  const [bookingDetails, setBookingDetails] = useState("")
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [rentalAmount, setRentalAmount] = useState("");
  const [bookingDetailsError, setBookingDetailsError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [stayTypeError, setStayTypeError] = useState("")
  const [rentalError, setRentalError] = useState("")
  const [advanceError, setAdvanceError] = useState("")
  const [joiningDateError, setJoiningDateError] = useState("")

  const TYPE_OPTIONS = ["Maintenance", "Others"];
  const tenantId =
    selectedBedReserv?.tenetId ??
    selectedBed?.newTenantInfo?.[0]?.tenetId;


  // const tenantId =
  //   selectedBed?.newTenantInfo?.[0]?.tenetId || selectedBedReserv?.tenetId;

  useEffect(() => {
    if (!activeHostelId || !tenantId) return;

    const initCheckIn = async () => {
      const res = await initializeCheckIn(activeHostelId, tenantId);

      console.log("🔥 initCheckIn FULL RESPONSE 👉", res);
      console.log("📦 res.data 👉", res?.data);

      if (res.success) {
        setBookingDetails(res.data);
      }
      else {
        setBookingDetailsError(res.message)
      }
    };

    initCheckIn();
  }, [activeHostelId, tenantId]);
  const isAssignDisabled = !!bookingDetailsError;
  console.log("bookkk", bookingDetails)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {


        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }

        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [navigation])
  );

  const addCharge = () => {
    setExtraCharges(prev => [
      ...prev,
      { id: Date.now(), type: "", title: "", amount: "" }
    ]);
  };

  const removeCharge = (id) => {
    setExtraCharges(prev => prev.filter(i => i.id !== id));


  };

  const selectType = (id, type) => {


    if (type === "Maintenance" && maintenanceAlreadyUsed) return;

    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "",typeError:"" } : i))
    );

    setOpenDropdownId(null);
  };





  const updateTitle = (id, title) => {
    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, title,titleError:"" } : i))
    );
  };

  const updateAmount = (id, amount) => {
    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, amount, amountError: "" } : i))
    );
  };

  const convertToDeductions = (extraCharges) => {
    return extraCharges.map(item => ({
      type: item.type === "Others" ? item.title.toLowerCase() : "maintenance",
      amount: item.amount,
      showInput: item.type === "Others"
    }));
  };
  // const onSave = () => {
  //   const deductions = convertToDeductions(extraCharges);
  //   console.log("Final Deductions:", deductions);
  // };

   const validateExtraCharges = () => {
    let valid = true;

    const updated = extraCharges.map((e) => {
      let titleError = "";
      let amountError = "";
      let typeError = "";

      const titleFilled = e.title?.trim()?.length > 0;
      const amountFilled = e.amount !== "" && e.amount !== null && e.amount !== undefined;

      const amt = Number(e.amount);

      // ✅ CASE 1: type not selected -> ignore row (no validation)
      // if (!e.type) {
      //   return { ...e, titleError: "", amountError: "" };
      // }

      // case 1: if not selected type --show error message

       if (!e.type) {
        typeError = "Please select type";
        valid = false;

        return { ...e, typeError, titleError: "", amountError: "" };
      }

      // ✅ CASE 2: Maintenance -> amount mandatory
      if (e.type === "Maintenance") {
        if (!amountFilled) {
          amountError = "Please enter amount";
          valid = false;
        } else if (isNaN(amt) || amt <= 0) {
          amountError = "Amount must be greater than 0";
          valid = false;
        }

        return { ...e, titleError: "", amountError };
      }

      // ✅ CASE 3: Others -> reason + amount both mandatory
      if (e.type === "Others") {
        typeError="";
        // both empty -> ok (optional row)
        // if (!titleFilled && !amountFilled) {
        //   return { ...e,typeError, titleError: "", amountError: "" };
        // }

        if (!titleFilled) {
          titleError = "Please enter reason";
          valid = false;
        }else if (!amountFilled) {
          amountError = "Please enter amount";
          valid = false;
        } else if (isNaN(amt) || amt <= 0) {
          amountError = "Amount must be greater than 0";
          valid = false;
        }

        return { ...e,typeError, titleError, amountError };
      }

      return { ...e,typeError, titleError: "", amountError: "" };
    });

    setExtraCharges(updated);
    return valid;
  };

  const onSave = async () => {

    let valid = true;

     const chargeValid = validateExtraCharges();
    if (!chargeValid) return;

    // reset errors
    setStayTypeError("");
    setRentalError("");
    setAdvanceError("");
    setJoiningDateError("");


    if (!StayTypeSelected || StayTypeSelected === "Stay Type") {
      setStayTypeError("Please select stay type");
      valid = false;
    }


    if (!rentalAmount || Number(rentalAmount) <= 0) {
      setRentalError("Enter valid rental amount");
      valid = false;
    }


    if (!advanceAmount || Number(advanceAmount) < 0) {
      setAdvanceError("Enter valid advance amount");
      valid = false;
    }


    if (!joinDate) {
      setJoiningDateError("Please select joining date");
      valid = false;
    }

    if (bookingDetailsError) {
      valid = false;
    }

    if (!valid) return;


    const payload = {
      bookingId: bookingDetails?.bookingId,
      joiningDate: dayjs(joinDate).format("DD-MM-YYYY"),
      advanceAmount: Number(advanceAmount || 0),
      rentalAmount: Number(rentalAmount),
      stayType: "LONG",
      deductions: extraCharges.map(item => ({
        type:
          item.type === "Others"
            ? item.title.trim().toLowerCase()
            : "maintenance",
        amount: Number(item.amount)
      })),
      isAdvanceIncludedInBooking: true
    };

    console.log("payload", payload)

    const res = await bookedCheckInCustomer(tenantId, payload);

    if (res.success) {


      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);
      onBedAdded && onBedAdded(selectedBed.roomId)
      navigation.goBack();

      setTimeout(() => {
        setShowSuccess(false);

      }, 800);
    }
    else {
      alert(res.message || "Check-in failed ❌");
    }
  };

  const bookingDateObj = bookingDetails?.bookedDate
    ? dayjs(bookingDetails?.bookedDate, "DD-MM-YYYY")
    : null;

  return (
    <>
      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}

      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>← Check-In Tenant</Text>
          </TouchableOpacity>

          <Text style={styles.roomInfo}>
            {selectedBed?.floorName} | {" "}
             {selectedBed?.roomName} | {" "}
            {selectedBed?.bedName}
          </Text>

        </View>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>← Check-In Tenant</Text>
        </TouchableOpacity>
                <Text style={styles.roomInfo}>Room No {selectedBed?.roomName} | {selectedBed?.bedName}</Text> */}

        {/* <ScrollView showsVerticalScrollIndicator={false}> */}

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* <Text style={styles.label}>Tenant</Text>
            <View style={styles.box}>
              <Text>{selectedBed?.newTenantInfo[0]?.tenantFullName || selectedBedReserv?.tenantFullName}</Text>
            </View> */}

            <View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}>

              {selectedBedReserv?.profilePic ? <Image source={{uri:selectedBedReserv?.profilePic }} style={{width:50,height:50,borderRadius:25}} />
            :<View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: "#E5E7EB", alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{fontSize:16,fontFamily:'Gilroy-Bold',color: "#374151"}}>
                 {selectedBedReserv?.tenantInitials}</Text>
              </View>}

              <View style={{marginLeft:10,}}>
                <Text style={{fontSize:16,fontFamily:'Gilroy-Semibold'}}>{selectedBedReserv?.tenantFullName}</Text>
                <Text style={{fontSize:14,fontFamily:'Gilroy-Medium',marginTop:5}}>+91 {selectedBedReserv?.mobile}</Text>
              </View>

            </View>

            

            {/* Booking Date */}
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:16}}>
                <Text style={{fontSize: 14,fontWeight: "600",}}>
                  Booking Date</Text>
                 <Text style={styles.placeholder}>
                {bookingDetails?.bookedDate}
              </Text>
            </View>
            
            {/* <View style={styles.box}>
            <Text>{dayjs().format("DD/MM/YYYY")}</Text>
          </View> */}
            {/* <TouchableOpacity
              // style={styles.dateBox}
              style={[
                styles.dateBox,
                bookingDetails?.bookedDate && { backgroundColor: "#EEF2FF" }
              ]}
              disabled={!!bookingDetails?.bookedDate}
            >
              <Text style={styles.placeholder}>
                {bookingDetails?.bookedDate}
              </Text>
              <Image source={Calendarimg} style={styles.calendarIcon} />
            </TouchableOpacity> */}

            {/* Booking Amount */}
            <View style={{marginTop:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              <Text style={{ fontSize: 14,fontWeight: "600",color: "#333",}}>
                 Booking Amount</Text>
              <Text>₹{selectedBed?.newTenantInfo[0]?.bookingAmount || selectedBedReserv?.bookingAmount}</Text>
            </View>
           
            {/* <View style={styles.box}>
              <Text>₹{selectedBed?.newTenantInfo[0]?.bookingAmount || selectedBedReserv?.bookingAmount}</Text>
            </View> */}

            <Text style={styles.label}>Stay Type <Text style={{ color: "red" }}>*</Text></Text>

            <View style={{ position: "relative" }}>
              <TouchableOpacity
                style={styles.select}
                onPress={() => setStayTypeOpen(!StayTypeOpen)}
                activeOpacity={0.9}
              >
                <Text style={styles.selectText}>{StayTypeSelected}</Text>
                <Image source={DownArrow} style={styles.arrow} />
              </TouchableOpacity>
              {stayTypeError && <ErrorMessage message={stayTypeError} type="error" />}
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
                          setStayTypeError("")
                        }}
                      >
                        <Text style={styles.optionText}>{v}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Rental Amount */}
            <Text style={styles.label}>Rental Amount <Text style={{ color: "red" }}>*</Text></Text>
            <TextInput placeholder="Enter amount" style={styles.input} keyboardType="numeric" value={rentalAmount}
              onChangeText={(text) => {
                const onlyNum = text.replace(/[^0-9]/g, "")
                setRentalAmount(onlyNum);
                setRentalError("");
              }}
            />
            {rentalError && <ErrorMessage message={rentalError} type="error" />}
            {/* Advance Amount */}
            <Text style={styles.label}>Advance Amount <Text style={{ color: "red" }}>*</Text></Text>
            <TextInput placeholder="Enter amount" style={styles.input} keyboardType="numeric" value={advanceAmount}
              // onChangeText={setAdvanceAmount}
              onChangeText={(text) => {
                const onlyNum = text.replace(/[^0-9]/g, "")
                setAdvanceAmount(onlyNum);
                setAdvanceError("");
              }}
            />
            {advanceError && <ErrorMessage message={advanceError} type="error" />}

            {/* Joining Date */}
            <Text style={styles.label}>Joining Date <Text style={{ color: "red" }}>*</Text></Text>

            <TouchableOpacity
              style={styles.dateBoxJoi}
              onPress={() => {
                Keyboard.dismiss();
                setOpenJoinPicker(true)

              }
              }
            >
              <Text>
                {joinDate ? dayjs(joinDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
              </Text>
              <Image source={Calendarimg} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>

            {joiningDateError && <ErrorMessage message={joiningDateError} type="error" />}

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
                        style={styles.figmaRightBox}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                        value={item.amount}
                        onChangeText={(t) => {
                          // const onlyNum = t.replace(/[^0-9]/g, "")
                           const onlyNum = t.replace(/[^0-9]/g, "").replace(/^0+/, "");
                       
                          updateAmount(item.id, onlyNum)

                        }
                        }
                      />
                    )}

                  </View>

                   {item.titleError && (
                        <ErrorMessage message={item.titleError} type="error" />
                      )}

                      {item.typeError && (
                        <ErrorMessage message={item.typeError} type="error" />
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

            {/* Buttons */}
            <View style={styles.centerError}>
              {bookingDetailsError && (
                <ErrorMessage message={bookingDetailsError} type="error" style={{ alignSelf: "center" }} />
              )}
            </View>


            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                //  style={styles.checkBtn}
                style={[
                  styles.checkBtn,
                  isAssignDisabled && { backgroundColor: "#9CA3AF" }
                ]}
                onPress={onSave} disabled={isAssignDisabled}>
                <Text style={styles.checkText}>Check-In</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>

        {/* Date Picker Popup */}
        {openJoinPicker && (
          <View style={styles.overlay}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setOpenJoinPicker(false)}
            />

            <View style={styles.datePickerBox}>
              <Calendar
                minDate={
                  bookingDateObj
                    ? bookingDateObj.format("YYYY-MM-DD")
                    : undefined
                }
                maxDate={dayjs().format("YYYY-MM-DD")}   // 🚫 future blocked
                onDayPress={(day) => {
                  const selected = dayjs(day.dateString);

                  // extra safety check
                  if (
                    bookingDateObj &&
                    selected.isBefore(bookingDateObj, "day")
                  ) {
                    return;
                  }

                  setJoinDate(selected);
                  setJoiningDateError("");
                  setOpenJoinPicker(false);
                }}
                markedDates={
                  joinDate
                    ? {
                      [dayjs(joinDate).format("YYYY-MM-DD")]: {
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


      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    paddingTop: 40
  },

  backArrow: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  roomInfo: {
    color: "#1E45E1",
    marginBottom: 20,
    fontWeight: "600",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: "#333",
  },

  box: {
    backgroundColor: "#EEF2FF",
    padding: 14,
    borderRadius: 10,
  },

  selectBox: {
    borderWidth: 1,
    borderColor: "#DCDCDC",
    padding: 14,
    borderRadius: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#DCDCDC",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
  },
  calendarIcon: { width: 20, height: 20, tintColor: "#444" },

  dateBox: {
    backgroundColor: "#EEF2FF",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateBoxJoi: {

    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#DCDCDC",
    borderWidth: 1
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },

  addBtn: {
    backgroundColor: "#1E45E1",
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  addText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginTop: 25,
  },


  //   cancelBtn: {
  //     width: "48%",
  //     borderWidth: 1,
  //     borderColor: "#DCDCDC",
  //     paddingVertical: 14,
  //     borderRadius: 10,
  //   },
  cancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,


    width: "40%"
  },

  cancelText: {
    textAlign: "center",
    fontSize: 15,
    color: "#444",
    fontWeight: "600",
  },

  checkBtn: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: "#1D5DFF",
    width: "35%"
  },

  checkText: {
    textAlign: "center",
    fontSize: 15,
    color: "#fff",
    fontWeight: "700",
  },

  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  datePickerBox: {
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
    marginBottom: 60,
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
  arrow: { width: 18, height: 18, tintColor: "#444" },

  dropdownMenu: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,

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

  placeholder: { color: "#555" },


  optionText: {
    fontSize: 15,
    color: "#000",
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
  centerError: {

    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 120
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
});
