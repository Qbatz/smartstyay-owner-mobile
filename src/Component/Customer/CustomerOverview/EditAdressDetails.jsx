import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView, Image, TouchableWithoutFeedback, Keyboard, PanResponder
} from "react-native";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { useCustomer } from "../../../Context/CustomerContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../../Loader/Loader";
const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.85;

const STATES = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
];

export default function EditManualAddressSheet({
  visible,
  onClose,
  customerDetails,
  onSuccess,
}) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const { editBasicDetails,loading } = useCustomer();

  const [flat, setFlat] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [selectedState, setSelectedState] = useState(""); // final value
  const [stateQuery, setStateQuery] = useState("");
  const [stateOpen, setStateOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [initialAddress, setInitialAddress] = useState(null);
  const [formError, setFormError] = useState("");
  const pincodeRef = useRef(null);
  const cityRef = useRef(null);
  const [pincodeError, setPincodeError] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");

  const stateList = [
    { label: "Andhra Pradesh", value: "Andhra Pradesh" },
    { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
    { label: "Assam", value: "Assam" },
    { label: "Bihar", value: "Bihar" },
    { label: "Chhattisgarh", value: "Chhattisgarh" },
    { label: "Goa", value: "Goa" },
    { label: "Gujarat", value: "Gujarat" },
    { label: "Haryana", value: "Haryana" },
    { label: "Himachal Pradesh", value: "Himachal Pradesh" },
    { label: "Jharkhand", value: "Jharkhand" },
    { label: "Karnataka", value: "Karnataka" },
    { label: "Kerala", value: "Kerala" },
    { label: "Madhya Pradesh", value: "Madhya Pradesh" },
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Manipur", value: "Manipur" },
    { label: "Meghalaya", value: "Meghalaya" },
    { label: "Mizoram", value: "Mizoram" },
    { label: "Nagaland", value: "Nagaland" },
    { label: "Odisha", value: "Odisha" },
    { label: "Punjab", value: "Punjab" },
    { label: "Rajasthan", value: "Rajasthan" },
    { label: "Sikkim", value: "Sikkim" },
    { label: "Tamil Nadu", value: "Tamil Nadu" },
    { label: "Telangana", value: "Telangana" },
    { label: "Tripura", value: "Tripura" },
    { label: "Uttar Pradesh", value: "Uttar Pradesh" },
    { label: "Uttarakhand", value: "Uttarakhand" },
    { label: "West Bengal", value: "West Bengal" },
  ];
  const filteredStateList = stateList
    .filter((s) =>
      s.label.toLowerCase().includes(stateQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aStart = a.label.toLowerCase().startsWith(stateQuery.toLowerCase());
      const bStart = b.label.toLowerCase().startsWith(stateQuery.toLowerCase());
      return bStart - aStart;
    });
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const safeKeyboardHeight = keyboardHeight > 0 ? keyboardHeight - 40 : 0;





  useEffect(() => {
    if (!visible) return;

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
  }, [visible]);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 5,

      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          closeSheet(); // swipe down → close
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;


  useEffect(() => {
    if (visible && customerDetails?.address && !initialized) {
      const a = customerDetails.address;

      const init = {
        houseNo: a.houseNo || "",
        street: a.streetName || "",
        landmark: a.landmark || "",
        city: a.city || "",
        pincode: a.pincode ? String(a.pincode) : "",
        state: a.state || "",
      };

      // 🔥 SET CURRENT VALUES
      setFlat(init.houseNo);
      setArea(init.street);
      setLandmark(init.landmark);
      setCity(init.city);
      setPincode(init.pincode);
      setSelectedState(init.state);

      // 🔥 STORE INITIAL SNAPSHOT (THIS WAS MISSING)
      setInitialAddress(init);

      setInitialized(true);
    }

    if (!visible) {
      setInitialized(false);
      setInitialAddress(null);
      setFormError("");
      setPincodeError("");
      setCityError("");
      setStateError("")
      setStateOpen(false)
    }
  }, [visible]);


  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const closeSheet = () => {
    Keyboard.dismiss()
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(onClose);
  };

  // const handleSave = () => {
  //   const payload = {
  //     houseNo: flat,
  //     streetName: area,
  //     landmark,
  //     city,
  //     pincode,
  //     state: selectedState, 
  //   };

  //   console.log("Manual Address Payload 👉", payload);

  //   // 👉 API call here
  //   onSuccess?.();
  //   closeSheet();
  // };
  const handleSave = async () => {
    let focused = false;
    let hasError = false;
    setFormError("");

    if (!city) {
      setCityError("Please enter City");
      if (!focused) {
        cityRef.current?.focus();
        focused = true;
      }
      hasError = true;
    } else {
      setCityError("")
    }

    const pinString = String(pincode || "").trim();

    // 🔴 PINCODE VALIDATION
    if (pinString && pinString.length !== 6) {
      setPincodeError("Pin Code must be exactly 6 digits");
      if (!focused) {
        pincodeRef.current?.focus();
        focused = true;
      }
      hasError = true;
    } else if (!pinString) {
      setPincodeError("Pin Code is required");
      if (!focused) {
        pincodeRef.current?.focus();
        focused = true;
      }
      hasError = true;
    }
    else if (pinString === "000000") {
      setPincodeError("Pin Code cannot be all zeros");
      if (!focused) {
        pincodeRef.current?.focus();
        focused = true;
      }
      hasError = true;
    } else if (pinString.startsWith("0")) {
      setPincodeError("Pin Code cannot start with 0");
      if (!focused) {
        pincodeRef.current?.focus();
        focused = true;
      }
      hasError = true;
    } else if (pinString.slice(-3) === "000") {
      setPincodeError("Last 3 digits cannot be 000");
      if (!focused) {
        pincodeRef.current?.focus();
        focused = true;
      }
      hasError = true;
    } else {
      setPincodeError("");
    }

    // if (!stateError) {
    //   setStateError("Please select state")
    //   if (!focused) {
    //     focused = true;
    //   }
    //   hasError = true;
    // } else {
    //   setStateError("")
    // }

    if (!selectedState?.trim()) {
  setStateError("Please select state");
  if (!focused) {
    focused = true;
  }
  hasError = true;
} else {
  setStateError("");
}

    if (hasError) return;


    if (initialAddress) {
      const noChanges =
        flat === initialAddress.houseNo &&
        area === initialAddress.street &&
        landmark === initialAddress.landmark &&
        city === initialAddress.city &&
        pinString === initialAddress.pincode &&
        selectedState === initialAddress.state;

      if (noChanges) {

        setModalType("warning");
        setMessage("No changes detected");
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);


        }, 800);
        return;
      }
    }


    const payload = {
      houseNo: flat || "",
      street: area || "",
      landmark: landmark || "",
      city: city || "",
      pincode: pinString || "",
      state: selectedState || "",
    };


    const res = await editBasicDetails(
      customerDetails?.customerId,
      payload
    );

    if (res.success) {

      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);
      await onSuccess();
      setTimeout(() => {
        setShowSuccess(false);
        closeSheet();

      }, 800);
    } else {
      setFormError(res.message || "Update failed");
    }
  };


  if (!visible) return null;

  return (
    <>
    {loading && <Loader/>}
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <View style={styles.root} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={closeSheet}>
                            <View style={styles.overlay} />
                        </TouchableWithoutFeedback>
        <TouchableOpacity style={{ flex: 1 }} onPress={closeSheet} />

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.sheet,
            {
              transform: [
                {
                  translateY: Animated.subtract(
                    translateY,
                    new Animated.Value(safeKeyboardHeight)
                  ),
                },
              ],
            },
          ]}
        >
           <View style={styles.handle} />
          <SafeAreaView >

           
            <Text style={styles.title}>Edit Manual Address</Text>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 100,   // 🔥 IMPORTANT
              }}
            >
              <Text style={styles.label}>Flat , House no , Building , Company , Apartment</Text>
              <TextInput
                style={styles.input}
                placeholder="House No / Apartment"
                value={flat}
                onChangeText={(text) => {
                  const filtered = text.replace(/[^a-zA-Z0-9\s.,\-/&]/g, "");
                  setFlat(filtered);
                }}
              />
              <Text style={styles.label}>Area , Street , Sector , Village</Text>
              <TextInput
                style={styles.input}
                placeholder="Street / Area"
                value={area}
                onChangeText={(text) => {
                  const filtered = text.replace(/[^a-zA-Z0-9\s.,\-/]/g, "");
                  setArea(filtered);
                }}
              />
              <Text style={styles.label}>Landmark</Text>
              <TextInput
                style={styles.input}
                placeholder="Landmark"
                value={landmark}
                onChangeText={(text) => {
                  const filtered = text.replace(/[^a-zA-Z0-9\s.,\-/]/g, "");
                  setLandmark(filtered)
                }}
              />
              <Text style={styles.label}>City<Text style={{ marginRight: 3, color: "red", }}>*</Text></Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, padding: 12, }}
                placeholder="City"
                value={city}
                onChangeText={(text) => {
                  const filtered = text.replace(/[^a-zA-Z0-9\s]/g, "");
                  setCity(filtered);
                  if (filtered.trim()) {
                    setCityError("");
                  }
                }}
              />
              {cityError && <ErrorMessage message={cityError} type="error" />}

              <Text style={[styles.label, { marginTop: 12 }]}>Pincode  <Text style={{ marginRight: 3, color: "red", }}>*</Text></Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, padding: 12, }}
                placeholder="Pincode"
                keyboardType="numeric"
                value={pincode}
                onChangeText={(text) => {
                  const numeric = text.replace(/[^0-9]/g, "");
                  if (numeric.length <= 6) {
                    setPincode(numeric);
                  }
                  setPincodeError("")
                }}

              />
              {pincodeError && <ErrorMessage message={pincodeError} type="error" />}

              {/* STATE DROPDOWN */}
              <Text style={[styles.label, { marginTop: 12 }]}>State<Text style={{ marginRight: 3, color: "red", }}>*</Text></Text>

              <View style={{ position: "relative" }}>
                <TextInput
                  style={styles.select}
                  placeholder="Select state"
                  placeholderTextColor="#9CA3AF"
                  value={stateOpen ? stateQuery || selectedState : selectedState}
                  // onFocus={() => setStateOpen(true)}
                   onPressIn={() => setStateOpen(prev => !prev)}
                  onChangeText={(t) => {
                    setStateQuery(t);
                    setStateOpen(true);
                    if(t){
                      setStateError("")
                    }
                  }}
                />
                



                <Image source={DownArrow} style={styles.arrowIcon} />

                {stateOpen && (
                  <>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setStateOpen(false);
                        setStateQuery("");
                      }}
                    >
                      <View style={styles.dropdownOverlay} />
                    </TouchableWithoutFeedback>

                    <View style={styles.dropdownMenu}>
                      <ScrollView
                        keyboardShouldPersistTaps="always"
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                      >
                        {filteredStateList.length > 0 ? (
                          filteredStateList.map((v, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.option}
                              onPress={() => {
                                setSelectedState(v.label);
                                setStateQuery("");
                                setStateOpen(false);
                                setStateError("")
                              }}
                            >
                              <Text style={styles.optionText}>{v.label}</Text>
                            </TouchableOpacity>
                          ))
                        ) : (
                          <Text style={styles.noResult}>No state found</Text>
                        )}

                        {/* 🔴 CLEAR OPTION */}
                        {selectedState && (
                          <TouchableOpacity
                            style={{ padding: 12, alignItems: "center" }}
                            onPress={() => {
                              setSelectedState("");
                              setStateQuery("");
                              setStateOpen(false);
                            }}
                          >
                            <Text style={{ color: "red", fontWeight: "600" }}>
                              Clear selection
                            </Text>
                          </TouchableOpacity>
                        )}
                      </ScrollView>
                    </View>
                  </>
                )}
                {stateError && <ErrorMessage message={stateError} type="error" />}

              </View>
              {formError && <ErrorMessage message={formError} type="error" />}
              <View style={styles.footer}>
                <TouchableOpacity style={[styles.saveBtn, { marginRight: 14 }]} onPress={closeSheet}>
                  <Text style={styles.saveText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveText}>Update</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  root: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,          // 🔥 VERY IMPORTANT
        elevation: 9999,      // 🔥 Android
    },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  saveBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14, paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  footer: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
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
    // top: 52,
    // left: 0,
    // right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 1000,
    marginTop: 5,

    maxHeight: 150,        // 🔥 increase
  },
  arrowIcon: {
    position: "absolute",
    right: 12,
    top: 14,
    width: 18,
    height: 18,
    tintColor: "#777",
  },

  noResult: {
    padding: 12,
    textAlign: "center",
    color: "#6B7280",
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  optionText: {
    fontSize: 15,
    color: "#000",
  },
  label: {
    marginBottom: 10
  }
});
