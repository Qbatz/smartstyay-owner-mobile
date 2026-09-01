import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Image, TouchableWithoutFeedback, Keyboard, BackHandler
} from 'react-native';
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import AddCircle from "../../Assets/Images/add-circle.png";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import CalendarImage from "../../Assets/Images/calendar.png";
import { useFloor } from "../../Context/PayingGuestContext";
import { CommonContexts } from "../../Context/CommonContext";
import { useCustomer } from '../../Context/CustomerContext';
import Delete from "../../Assets/Images/remove.png";
import ErrorMessage from '../ErrorMessagr/Errormessagestyle';
import SuccessModal from '../../ToastFile/ToastPage';
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import ListView from "../../Assets/Images/listview.png";
import RoomView from "../../Assets/Images/Roomview.png";
import LeavePageScreen from "../../ToastFile/LeavePageScreen";



export default function TenantCheckIn({ navigation, route }) {
  const { customerId, customer } = route.params || {};
  const [tab, setTab] = useState("long");
  const { activeHostelId } = useContext(CommonContexts);
  const { getAllFloorsByHostel, getAllRoomsByFloor, getAllBedsByRoom } = useFloor();
  const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel } = useCustomer();

  const [floors, setFloors] = useState([]);
  const [floorOpen, setFloorOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomOpen, setRoomOpen] = useState(false);

  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [beds, setBeds] = useState([]);
  const [bedOpen, setBedOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [floorError, setFloorError] = useState("")
  const [roomError, setRoomError] = useState("")
  const [bedError, setBedError] = useState('')
  const [advanceError, setAdvanceError] = useState("")
  const [rentError, setRentError] = useState("")
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [joiningDate, setJoiningDate] = useState(new Date());
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [rentalAmount, setRentalAmount] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [extraCharges, setExtraCharges] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const scrollRef = React.useRef(null);
  const [isCheckinClick, setIsCheckInClick] = useState(false)

  const [showLeavePageScreen, setShowLeavePageScreen] = useState(false);

  const scrollToInput = (y = 200) => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y,
        animated: true,
      });
    }, 150); // keyboard animation wait
  }


  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", e => {
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
  const titleRefs = useRef({});
  const amountRefs = useRef({});




  const scrollToInputRef = (ref) => {
    if (!ref || !scrollRef.current) return;

    ref.measureInWindow((x, y) => {
      scrollRef.current?.scrollTo({
        y: y - 140,   // 🔥 gap (adjust panna 160 / 180)
        animated: true,
      });
    });
  };


  console.log("selectedBed", customer)

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


  const loadRooms = async (floorId) => {
    const res = await getAllRoomsByFloor(floorId);
    if (res.success) {
      console.log("RoomData", res.data);

      setRooms(res.data);
    } else {
      setRooms([]);
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

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        handleLeaveCheckInScreen();
        return true;
      };

      const handler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => handler.remove();
    }, [
      navigation,
      selectedFloor,
      selectedRoom,
      selectedBed,
      advanceAmount,
      rentalAmount,
    ])
  );


  useEffect(() => {
    if (!activeHostelId || !joiningDate) return;

    loadBeds(joiningDate);
  }, [activeHostelId]);


  const loadBeds = async (date) => {
    if (!activeHostelId) return;

    const formattedDate = dayjs(date).format("DD-MM-YYYY");

    const res = await getBedsByHostelAndDate(
      activeHostelId,
      formattedDate
    );
    console.log("beds", res);


    if (res.success) {
      setBeds(res?.data?.listBeds);
    } else {
      setBeds([]);
    }
  };

  // const filteredBeds = beds.filter(bed => {
  //   if (!selectedFloor || !selectedRoom) return false;

  //   return (
  //     bed.floorId === selectedFloor.id &&
  //     bed.roomId === selectedRoom.id &&
  //     bed.currentStatus === "VACANT"
  //   );
  // });

  const filteredBeds = beds.filter((bed) => {
    if (!selectedFloor || !selectedRoom) return false;

    return (
      bed.floorId === selectedFloor.id &&
      bed.roomId === selectedRoom.id &&
      (bed.currentStatus === "VACANT" ||
        bed.currentStatus === "NOTICE")
    );
  });

  console.log("filteredBeds", filteredBeds);


  const maintenanceAlreadyUsed = extraCharges.some(c => c.type === "Maintenance");


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

  const selectType = (id, type) => {


    if (type === "Maintenance" && maintenanceAlreadyUsed) return;

    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "", typeError: "" } : i))
    );

    setOpenDropdownId(null);
  };





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

  const updateAmount = (id, amount) => {
    // setExtraCharges(prev =>
    //   prev.map(i => (i.id === id ? { ...i, amount } : i))
    // );
    setExtraCharges(prev =>
      prev.map(i =>
        i.id === id
          ? { ...i, amount, amountError: "" }
          : i
      )
    );
  };

  useEffect(() => {
    if (openCalendar) {
      Keyboard.dismiss();
    }
  }, [openCalendar]);
  const blurAllInputs = () => {
    Object.values(titleRefs.current).forEach(ref => ref?.blur?.());
    Object.values(amountRefs.current).forEach(ref => ref?.blur?.());
  };
  const advanceRef = useRef(null);
  const rentalRef = useRef(null);
  const scrollToField = (ref) => {
    if (!ref?.current || !scrollRef.current) return;

    ref.current.measureLayout(
      scrollRef.current,
      (x, y) => {
        scrollRef.current.scrollTo({
          y: y - 100,
          animated: true,
        });
      },
      () => { }
    );
  };


  const onFloorChange = (v) => {
    setSelectedFloor(v);
    const r = rooms[v][0];
    const b = beds[r][0];
    setSelectedRoom(r);
    setSelectedBed(b);
  };
  const validateLongStay = () => {
    let valid = true;

    // reset errors
    setFloorError("");
    setRoomError("");
    setBedError("");
    setAdvanceError("");
    setRentError("");

    if (!selectedFloor) {
      setFloorError("Please select a floor");
      valid = false;
    }

    if (!selectedRoom) {
      setRoomError("Please select a room");
      valid = false;
    }

    if (!selectedBed) {
      setBedError("Please select a bed");
      valid = false;
    }

    if (!advanceAmount) {
      setAdvanceError("Please Enter Advance amount");
      valid = false;
    }

    if (!rentalAmount || Number(rentalAmount) <= 0) {
      setRentError("Please Enter Rental amount");
      valid = false;
    }

    return valid;
  };
  const validateExtraCharges = () => {
    let valid = true;

    const updated = extraCharges.map((e) => {
      let titleError = "";
      let amountError = "";
      let typeError = "";

      const titleFilled = e.title?.trim()?.length > 0;
      const amountFilled = e.amount !== "" && e.amount !== null && e.amount !== undefined;

      const amt = Number(e.amount);

      // case 1: if not selected type --show error message
      if (!e.type) {
        typeError = "Please select type";
        valid = false;

        return { ...e, typeError, titleError: "", amountError: "" };
      }

      // ✅ CASE 1: type not selected -> ignore row (no validation)
      // if (!e.type) {
      //   return { ...e, titleError: "", amountError: "" };
      // }

      // ✅ CASE 2: Maintenance -> amount mandatory
      if (e.type === "Maintenance") {
        if (!amountFilled) {
          amountError = "Please enter amount";
          valid = false;
        } else if (isNaN(amt) || amt <= 0) {
          amountError = "Amount must be greater than 0";
          valid = false;
        }

        return { ...e, typeError, titleError: "", amountError };
      }

      // ✅ CASE 3: Others -> reason + amount both mandatory
      if (e.type === "Others") {
        // both empty -> ok (optional row)
        // if (!titleFilled && !amountFilled) {
        //   return { ...e, titleError: "", amountError: "" };
        // }

        // if (!titleFilled && !amountFilled) {
        //   titleError = "Please enter reason";
        //   valid = false;
        // }
        typeError = "";

        if (!titleFilled) {
          titleError = "Please enter reason";
          valid = false;
        }

        else if (!amountFilled) {
          amountError = "Please enter amount";
          valid = false;
        } else if (isNaN(amt) || amt <= 0) {
          amountError = "Amount must be greater than 0";
          valid = false;
        }

        return { ...e, typeError, titleError, amountError };
      }

      return { ...e, typeError, titleError: "", amountError: "" };
    });

    setExtraCharges(updated);
    return valid;
  };


  const handleLeaveCheckInScreen = () => {
    const hasMandatoryValue =
      selectedFloor !== null ||
      selectedRoom !== null ||
      selectedBed !== null ||
      advanceAmount.trim() !== "" ||
      rentalAmount.trim() !== "";

    if (hasMandatoryValue) {
      setShowLeavePageScreen(true);
      return;
    }

    navigation.goBack();
  };

  const submitLongStay = async () => {

    if (isCheckinClick) return;
    const isValid = validateLongStay();

    if (!isValid) return;

    const chargeValid = validateExtraCharges();
    if (!chargeValid) return;

    try {
      setIsCheckInClick(true)
      const payload = {
        floorId: selectedFloor.id,
        roomId: selectedRoom.id,
        bedId: selectedBed.bedId,
        joiningDate: dayjs(joiningDate).format("DD-MM-YYYY"),
        advanceAmount: Number(advanceAmount),
        rentalAmount: Number(rentalAmount),
        stayType: "LONG",

        deductions: extraCharges.map((e) => ({
          type:
            e.type === "Others"
              ? e.title.trim().toLowerCase()
              : e.type.toLowerCase(),
          amount: Number(e.amount),
        })),
      };

      const res = await checkInCustomer(customerId, payload);
      console.log("checking", res)
      console.log(res?.message)

      if (res.success) {
        setModalType("success");
        setMessage(res.data);
        setShowSuccess(true);

        await getAllBedsByRoom(selectedRoom.id);
        navigation.goBack();
        setTimeout(() => {
          setShowSuccess(false);

        }, 800);

      } else {
        setModalType("error");
        setMessage(res.message || "Checkin Failed");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false)
          setIsCheckInClick(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error)
      setIsCheckInClick(false)
    }
  };





  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          // behavior={Platform.OS === "ios" ? "padding" : undefined}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <View style={styles.header}>
            <TouchableOpacity
             onPress={handleLeaveCheckInScreen}
              style={styles.backBtn}
            >
              <Image source={ArrowLeft} style={{ height: 20, width: 20 }} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tenant Check-In</Text>
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', alignItems: 'center' }}>
            <View>
              {customer?.profilePic ? <Image source={{ uri: customer?.profilePic }} style={{ width: 50, height: 50, borderRadius: 25 }} /> :
                <View style={{ width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e6e7eb' }}>
                  <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Bold' }}>{customer?.initials}</Text>
                </View>}
            </View>

            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold' }}>{customer?.fullName}</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Medium', color: '#4B4B4B', marginTop: 8 }}>
                +{customer?.countryCode} {customer?.mobile || N / A}</Text>
            </View>

          </View>

          <View style={styles.segmentRow}>
            <TouchableOpacity
              style={[styles.segment, tab === "long" && styles.segmentActive]}
              onPress={() => setTab("long")}
            >
              <Text
                style={[
                  styles.segmentText,
                  tab === "long" && styles.segmentTextActive,
                ]}
              >
                Long Stay
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.segment, tab === "short" && styles.segmentActive]}
              onPress={() => setTab("short")}
            >
              <Text
                style={[
                  styles.segmentText,
                  tab === "short" && styles.segmentTextActive,
                ]}
              >
                Short Stay
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollRef}
            style={{ paddingHorizontal: 16 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            // nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              // paddingBottom: keyboardHeight > 0 ? keyboardHeight + 50 : 150,
              // padding: 15,
              flexGrow: 1,
              paddingBottom: 80,
            }}
          >




            {tab === "long" && (
              <View>
                <Text style={styles.label}>Joining Date <Text style={{ color: "red" }}>*</Text></Text>

                <TouchableOpacity
                  style={styles.dateBox}
                  onPress={() => {
                    Keyboard.dismiss();     // 1️⃣ close keyboard
                    blurAllInputs();        // 2️⃣ blur all focused inputs

                    setTimeout(() => {
                      setOpenCalendar(true);  // 3️⃣ open calendar
                    }, 180);                 // small delay
                  }}

                >
                  <Text style={styles.placeholder}>
                    {joiningDate ? dayjs(joiningDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                  </Text>
                  <Image source={CalendarImage} style={styles.calendarIcon} />
                </TouchableOpacity>

                <Text style={styles.label}>Floor  <Text style={{ color: "red" }}>*</Text></Text>

                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => {
                      setFloorOpen(!floorOpen)
                      setRoomOpen(false);
                      setBedOpen(false)
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
                      <ScrollView style={{ maxHeight: 160 }}
                        nestedScrollEnabled={true}>

                        {floors?.length === 0 ? (
                          <View style={{ padding: 12 }}>
                            <Text style={{ color: "#999", textAlign: "center" }}>
                              No Floors Available
                            </Text>
                          </View>
                        ) : (
                          floors?.map((v) => (

                            <TouchableOpacity
                              key={v.id}
                              style={[styles.option, selectedFloor?.id === v.id && { backgroundColor: '#E6F0FF' }]}
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
                          ))
                        )}
                      </ScrollView>
                    </View>
                  )}
                </View>
                {floorError && (
                  <ErrorMessage message={floorError} type="error" />
                )}


                <Text style={styles.label}>Room <Text style={{ color: "red" }}>*</Text></Text>

                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => {
                      setFloorOpen(false)
                      setRoomOpen(!roomOpen)
                      setBedOpen(false)
                    }

                    }
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
                      <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}>
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
                              style={[styles.option, selectedRoom?.id === r.id && { backgroundColor: '#E6F0FF' }]}
                              onPress={() => {
                                setSelectedRoom(r);
                                setRoomOpen(false);
                                setRoomError("")
                                setSelectedBed(null);
                              }}

                            >
                              {console.log(r)}
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.optionText}> {r.name}  </Text>
                                <View style={{ backgroundColor: '#dee3f2', borderRadius: 10, padding: 3, }}>
                                  <Text style={styles.optionText}> {r?.sharingType} </Text>
                                </View>
                              </View>
                              {/* <Text style={styles.optionText}> {r.name} - {r?.sharingType} </Text> */}
                            </TouchableOpacity>
                          ))
                        )}
                      </ScrollView>
                    </View>
                  )}
                </View>
                {roomError && (
                  <ErrorMessage message={roomError} type="error" />
                )}
                <Text style={styles.label}>Bed  <Text style={{ color: "red" }}>*</Text></Text>

                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={styles.select}
                    onPress={() => {
                      setFloorOpen(false)
                      setRoomOpen(false)
                      setBedOpen(!bedOpen)
                    }
                    }
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
                      <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}>
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
                              style={[styles.option, selectedBed?.bedId === b.bedId && { backgroundColor: '#E6F0FF' }]}
                              onPress={() => {
                                setSelectedBed(b);
                                setBedOpen(false);
                                setBedError("")
                                //  setRentalAmount(String(b.rentAmount));
                              }}
                            >
                              {console.log(b)}
                              {console.log(selectedBed)}
                              <Text style={styles.optionText}>
                                {b.bedName}
                              </Text>
                            </TouchableOpacity>
                          ))
                        )}
                      </ScrollView>
                    </View>
                  )}
                </View>
                {bedError && (
                  <ErrorMessage message={bedError} type="error" />
                )}
                {selectedBed?.shouldShowError && (
                  <ErrorMessage
                    message={selectedBed.errorMessage}
                    type="error"
                  />
                )}



                <View ref={advanceRef} style={{ marginBottom: 1, marginTop: 8 }}>
                  <Text style={styles.label}>Advance Amount  <Text style={{ color: "red" }}>*</Text></Text>
                  <TextInput
                    // ref={advanceRef}
                    style={styles.input}
                    keyboardType="numeric"
                    value={advanceAmount}
                    placeholder="Enter AdvanceAmount"
                    onChangeText={(text) => {
                      const onlyNumbers = text.replace(/[^0-9]/g, "");
                      setAdvanceAmount(onlyNumbers);
                      setAdvanceError("");
                    }}
                    onFocus={() => {
                      setTimeout(() => {
                        scrollToField(advanceRef);
                      }, 200);
                    }}
                  />

                </View>
                {advanceError && (
                  <ErrorMessage message={advanceError} type="error" />
                )}

                <View ref={rentalRef} style={{ marginBottom: 2, marginTop: 12 }}>
                  <Text style={styles.label}>Rental Amount  <Text style={{ color: "red" }}>*</Text></Text>
                  <TextInput
                    // ref={rentalRef}
                    style={styles.input}
                    keyboardType="numeric"
                    value={rentalAmount}
                    placeholder={
                      selectedBed?.rentAmount
                        ? String(selectedBed.rentAmount)
                        : "Enter Rental Amount"
                    }
                    onChangeText={(text) => {
                      const onlyNumbers = text.replace(/[^0-9]/g, "");
                      setRentalAmount(onlyNumbers);
                      setRentError("");
                    }}
                    onFocus={() => {
                      setTimeout(() => {
                        scrollToField(rentalRef);
                      }, 200);
                    }}
                  />


                </View>
                {rentError && (
                  <ErrorMessage message={rentError} type="error" />
                )}

                <View style={styles.nonRefund}>
                  <View style={styles.extraHeader}>
                    <Text style={styles.label}>Non Refundable Amount</Text>

                    <TouchableOpacity style={styles.addBtn} onPress={addCharge}>
                      <Text style={{ color: "#fff", fontFamily: "Gilroy-Semibold" }}>Add</Text>
                    </TouchableOpacity>
                  </View>

                  {extraCharges.map((item) => (
                    <View
                      key={item.id}
                      style={styles.figmaRowWrapper}

                    >

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
                            <Text style={{ color: "#777", fontFamily: "Gilroy-Semibold" }}>Select...</Text>
                            <Image source={DownArrow} style={styles.arrow} />
                          </TouchableOpacity>
                        ) : item.type === "Others" ? (
                          <TextInput
                            ref={(r) => (titleRefs.current[item.id] = r)}
                            style={styles.figmaLeftBox}
                            placeholder="Enter reason"
                            value={item.title}
                            onFocus={() => {
                              setOpenDropdownId(null);

                              setTimeout(() => {
                                scrollToInputRef(titleRefs.current[item.id]);
                              }, 300);
                            }}
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
                            ref={(r) => (amountRefs.current[item.id] = r)}
                            style={styles.figmaRightBox}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={item.amount}
                            onFocus={() => {
                              setTimeout(() => {
                                scrollToInputRef(amountRefs.current[item.id]);
                              }, 300);
                            }}
                            onChangeText={(t) => {
                              // const onlyNumbers = t.replace(/[^0-9]/g, "");
                              // const onlyNumbers = t.replace(/[^0-9]/g, "").replace(/^0+/, "");

                              let cleaned = t.replace(/[^0-9.]/g, "");

                              const parts = cleaned.split(".");

                              if (parts.length > 2) {
                                cleaned = parts[0] + "." + parts[1];
                              }

                              if (parts[1]?.length > 2) {
                                cleaned = parts[0] + "." + parts[1].slice(0, 2);
                              }

                              updateAmount(item.id, cleaned)
                            }
                            }
                          />



                        )}

                      </View>
                      {/* {item.titleError ? (
  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
    {item.titleError}
  </Text>
) : null} */}
                      {item.titleError && (
                        <ErrorMessage message={item.titleError} type="error" />
                      )}

                      {item.typeError && (
                        <ErrorMessage message={item.typeError} type="error" />
                      )}
                      {/* {item.amountError ? (
  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
    {item.amountError}
  </Text>
) : null} */}
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


                <View style={styles.BtnRow}>
                  <TouchableOpacity style={styles.CancelBtn} onPress={handleLeaveCheckInScreen}>
                    <Text style={{ color: "grey", fontFamily: "Gilroy-Semibold" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.submitBtn, isCheckinClick && { opacity: 0.4 }]}
                    onPress={submitLongStay}
                    disabled={isCheckinClick}>
                    <Text style={styles.submitText}>Check-In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {tab === "short" && (

              <View><Text>Comming Soon</Text></View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {openCalendar && (
        <View style={styles.sheetOverlay}>

          {/* outside click close */}
          <TouchableWithoutFeedback onPress={() => setOpenCalendar(false)}>
            <View style={{ ...StyleSheet.absoluteFillObject }} />
          </TouchableWithoutFeedback>

          {/* calendar box */}
          <View style={styles.calendarBox}>
            <Calendar
              current={dayjs(joiningDate).format("YYYY-MM-DD")}
              maxDate={dayjs().format("YYYY-MM-DD")}   // ✅ future date block
              onDayPress={(day) => {
                const selected = dayjs(day.dateString).toDate();
                setJoiningDate(selected);

                setOpenCalendar(false);

                // ✅ reset selection after date change (same as ur logic)
                setSelectedFloor(null);
                setSelectedRoom(null);
                setSelectedBed(null);
                setRooms([]);
                setBeds([]);

                loadBeds(selected);
              }}
              markedDates={{
                [dayjs(joiningDate).format("YYYY-MM-DD")]: {
                  selected: true,
                  selectedColor: "#2B6CF6",
                },
              }}
            />
          </View>
        </View>
      )}


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

    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 32,
  },

  backBtn: { padding: 6, marginRight: 8 },

  headerTitle: { fontSize: 18, fontFamily: "Gilroy-Semibold" },

  segmentRow: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#EEF2F7",
    borderRadius: 8,
    padding: 4,
  },

  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentActive: { backgroundColor: "#2B6CF6" },

  segmentText: { color: "#4B5563", fontFamily: "Gilroy-Semibold" },

  segmentTextActive: { color: "#fff", fontFamily: "Gilroy-Semibold" },

  container: { paddingHorizontal: 16 },

  field: { marginBottom: 12 },

  label: { color: "#4B4B4B", marginBottom: 6, fontFamily: "Gilroy-Semibold" },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontFamily: "Gilroy-Regular"
  },

  pickerWrap: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  nonRefundContainer: {
    marginTop: 10,
    backgroundColor: "#F7F7FA",
    padding: 10,
    borderRadius: 10,
  },

  nonRefundHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  nonRefundRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },

  inputBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
  },

  fixedLabel: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Gilroy-Semibold"
  },

  closeInside: {
    position: "absolute",
    right: -6,
    top: -6,
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 20,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E5BFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },



  iconImage: {
    height: 16,
    width: 16,
    marginRight: 6
  },

  addText: { color: "#fff", fontSize: 12, fontFamily: "Gilroy-Semibold" },

  BtnRow: {
    flexDirection: "row",
    width: "99%",
    marginTop: 18,
    gap: 10,
  },

  CancelBtn: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  submitBtn: {
    flex: 1,
    backgroundColor: "#2B6CF6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  submitText: { color: "#fff", fontFamily: "Gilroy-Semibold" },




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
  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",

    justifyContent: "center",
    alignItems: "center",
  },

  datePickerBox: {
    backgroundColor: "#fff",
    width: "80%",

    borderRadius: 20,
    padding: 10,

  },

  nonRefund: {
    backgroundColor: "#F7F9FF",
    padding: 10,
    marginTop: 16,
    borderRadius: 20
  },

  addBtn: {
    backgroundColor: "#2D6CDF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  extraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
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
    fontFamily: "Gilroy-Regular"
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
    marginRight: 20,
    fontFamily: "Gilroy-Regular"
  },

  figmaCloseBtn: {
    position: "absolute",
    right: 8,
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
  dropdownMenuone: {
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
  calendarBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 10,
    elevation: 10,
  },



});
