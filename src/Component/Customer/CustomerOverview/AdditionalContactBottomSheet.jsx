import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  TextInput,
  ScrollView,
  BackHandler, Keyboard , Image
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import DownArrow from "../../../Assets/Images/direction-down.png";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function AdditionalContactBottomSheet({
  visible,
  onClose,
  onSave,
}) {

  const { ParticularcustomerDetails, AddAdditionalContacts,
    GetParticularCustomerDetails, } = useCustomer();
  const { activeHostelId } = useContext(CommonContexts);

  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [occupation, setOccupation] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");


  const [showRelationDropdown, setShowRelationDropdown] = useState(false);
  const [showOccupationDropdown, setShowOccupationDropdown] = useState(false);

  const [isRelationOther, setIsRelationOther] = useState(false);
  const [isOccupationOther, setIsOccupationOther] = useState(false);

  const [nameErr, setNameErr] = useState("");
  const [relationErr, setRelationErr] = useState("");
  const [occupationErr, setOccupationErr] = useState("");
  const [mobileErr, setMobileErr] = useState("");
  const [formErr, setFormErr] = useState("");

  const [initialState, setInitialState] = useState(null);

  const relationshipOptions = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Uncle",
    "Other",
  ];

  const occupationOptions = [
    "Govt Employee",
    "Private Employee",
    "Business / Self-employed",
    "Farmer",
    "Daily Wage / Labour",
    "Homemaker",
    "Retired Employee",
    "Abroad (Working Overseas)",
    "Other",
  ];

const openSheet = () => {
  Animated.spring(translateY, {
    toValue: 0,
    useNativeDriver: true,
  }).start();
      setFullName("");
    setRelationship("");
    setOccupation("");
    setMobile("");

    setNameErr("");
    setRelationErr("");
    setOccupationErr("");
    setMobileErr("");
    setFormErr("");
};


 const closeSheet = () => {
  Animated.timing(translateY, {
    toValue: SCREEN_HEIGHT,
    duration: 200,
    useNativeDriver: true,
  }).start(() => {
    // ✅ reset AFTER close animation
    setFullName("");
    setRelationship("");
    setOccupation("");
    setMobile("");

    setNameErr("");
    setRelationErr("");
    setOccupationErr("");
    setMobileErr("");
    setFormErr("");

    onClose();
  });
};

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeSheet();
        else openSheet();
      },
    })
  ).current;


  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height + 70,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);


  useEffect(() => {
    if (ParticularcustomerDetails?.additionalContact) {
      const data = ParticularcustomerDetails.additionalContact;

      setFullName(data.fullName || "");
      setRelationship(data.relationship || "");
      setOccupation(data.occupation || "");
      setMobile(data.mobile || "");

      setInitialState({
        fullName: data.fullName || "",
        relationship: data.relationship || "",
        occupation: data.occupation || "",
        mobile: data.mobile || "",
      });
    }
  }, [ParticularcustomerDetails]);

useEffect(() => {
  if (visible) {
    openSheet();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        closeSheet();
        return true;
      }
    );

    return () => backHandler.remove();
  }
}, [visible]);

  if (!visible) return null;


  const validateForm = () => {
    let valid = true;

    if (!fullName.trim()) {
      setNameErr("Enter Guardian Name");
      valid = false;
    } else {
      setNameErr("");
    }

    // if (!relationship.trim()) {
    //   setRelationErr("Select Relationship");
    //   valid = false;
    // } else {
    //   setRelationErr("");
    // }

    // if (!occupation.trim()) {
    //   setOccupationErr("Select Occupation");
    //   valid = false;
    // } else {
    //   setOccupationErr("");
    // }

    if (!mobile) {
      setMobileErr("Enter Mobile Number");
      valid = false;
    } else if (mobile.length !== 10) {
      setMobileErr("Invalid Mobile Number");
      valid = false;
    }
    else if (mobile === "0000000000") {
  setMobileErr("All digits cannot be zero");
  valid = false;
}
     else {
      setMobileErr("");
    }

    return valid;
  };

  const isChanged = () => {
  if (!initialState) return true;

  return (
    fullName.trim() !== initialState.fullName ||
    relationship.trim() !== initialState.relationship ||
    occupation.trim() !== initialState.occupation ||
    mobile.trim() !== initialState.mobile
  );
};


console.log("occupation", occupation)
console.log("relationship", relationship)


  const handleSave = async () => {
    setFormErr("");

    if (!validateForm()) return;

    if (!isChanged()) {
      setFormErr("No Changes Detected");
      return;
    }

    const payload = {
      fullName,
      relationship,
      occupation,
      mobile,
    };

    console.log("payload", payload);
    

    const res = await AddAdditionalContacts(
      activeHostelId,
      ParticularcustomerDetails?.customerId,
      payload
    );

    if (res.success) {
      setMessage("Saved Successfully");
      setModalType("success");
      setShowSuccess(true);

      await GetParticularCustomerDetails(
        ParticularcustomerDetails?.customerId
      );

      setTimeout(() => {
        setShowSuccess(false);
        closeSheet();
      }, 1200);
    } else {
      setMessage("Contact Add Failed");
      setModalType("error");
      setShowSuccess(true);

            setTimeout(() => {
        setShowSuccess(false);
      }, 1200);

    }
  };

  //   const handleSaveAdditionalContact = async () => {
  //   const payload = {
  //     fullName: guardianName,
  //     relationship: relationship,
  //     occupation: occupation,
  //     mobile: mobile,
  //   };

  //   const res = await AddAdditionalContacts(activeHostelId, customerId, payload);

  //   if (res.success) {
  //     console.log("Saved successfully ✅");
  //     closeSheet();
  //   } else {
  //     console.log(res.message);
  //   }
  // };

  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <TouchableOpacity style={styles.overlay} onPress={closeSheet} />

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
            paddingBottom: 20 + insets.bottom,
          },
        ]}
      >
        <View style={styles.dragIndicator} />

        <Text style={styles.title}>Add Parent / Guardian</Text>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" >

          {/* Name */}
          <Text style={styles.label}>Guardian Full Name <Text style={{ color: "red" }}>*</Text></Text>
          <TextInput
            placeholder="Enter name"
            value={fullName}
            onChangeText={(t) =>{ 
              setFullName(t)
              setNameErr("")
              setFormErr("")
            }}
            style={styles.input}
          />

          {nameErr ? <ErrorMessage message={nameErr} type="error" /> : null}

          <Text style={styles.label}>Relationship </Text>
          <TouchableOpacity
            onPress={() => {
              setShowRelationDropdown(!showRelationDropdown);
              setShowOccupationDropdown(false);
            }}
          >
            <View style={styles.input}>
              <TextInput
                placeholder="Select Relationship"
                value={relationship}
                editable={isRelationOther} // 🔥 only editable if "Other"
               onChangeText={(t) => {
  setRelationship(t);
  setRelationErr("");
  setFormErr("");
}}
                style={{ flex: 1 }}
              />
               <Image
                              source={DownArrow}
                              style={[
                                styles.arrowIcon,
                                showRelationDropdown && { transform: [{ rotate: "180deg" }] }
                              ]}
                            />
            </View>
          </TouchableOpacity>

          {relationErr ? <ErrorMessage message={relationErr} type="error" /> : null}

          {showRelationDropdown && (
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                {relationshipOptions.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      if (item === "Other") {
                        setIsRelationOther(true);
                        setRelationship(""); // empty for typing
                        setRelationErr("")
                      } else {
                        setIsRelationOther(false);
                        setRelationship(item);
                        setRelationErr("")
                      }
                      setShowRelationDropdown(false);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <Text style={styles.label}>Guardian Occupation </Text>
          <TouchableOpacity
            onPress={() => {
              setShowOccupationDropdown(!showOccupationDropdown);
              setShowRelationDropdown(false);
            }}
          >
            <View style={styles.input}>
              <TextInput
                placeholder="Select Occupation"
                value={occupation}
                editable={isOccupationOther}
               onChangeText={(t) => {
  setOccupation(t);
  setOccupationErr("");
  setFormErr("");
}}
                style={{ flex: 1 }}
              />


                            <Image
                              source={DownArrow}
                              style={[
                                styles.arrowIcon,
                                showOccupationDropdown  && { transform: [{ rotate: "180deg" }] }
                              ]}
                            />

            </View>
          </TouchableOpacity>
          {occupationErr ? <ErrorMessage message={occupationErr} type="error" /> : null}

          {showOccupationDropdown && (
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                {occupationOptions.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      if (item === "Other") {
                        setIsOccupationOther(true);
                        setOccupation("");
                        setOccupationErr("")
                      } else {
                        setIsOccupationOther(false);
                        setOccupation(item);
                        setOccupationErr("")
                      }
                      setShowOccupationDropdown(false);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Mobile */}
          <Text style={styles.label}>Mobile Number <Text style={{ color: "red" }}>*</Text></Text>
          <TextInput
            placeholder="Enter Mobile Number"
            keyboardType="number-pad"
            maxLength={10}
            value={mobile}
            onChangeText={(t) => {
              const validmobile = t.replace(/[^0-9]/g, "")
              setMobile(validmobile)
              setMobileErr("")
              setFormErr("")
            }}
            style={styles.input}
          />

          {mobileErr ? <ErrorMessage message={mobileErr} type="error" /> : null}
          {formErr ? <ErrorMessage message={formErr} type="error" /> : null}

        </ScrollView>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={closeSheet}>
            <Text style={{fontFamily: "Gilroy-Semibold"}}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addBtn} onPress={handleSave}>
            <Text style={{ color: "#fff", fontFamily: "Gilroy-Semibold" }}>Add</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = {
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "85%",

  },

  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
   fontFamily: "Gilroy-Bold" ,
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Gilroy-Semibold"
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Gilroy-Regular"
  },

  error: {
    color: "red",
    marginTop: 10,
  },

  buttons: {
    flexDirection: "row",
    marginTop: 20,
  },

  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    marginRight: 10,
    alignItems: "center",
  },

  addBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 6,
    maxHeight: 180,
    backgroundColor: "#fff",
    zIndex: 999,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
arrowIcon: {
  marginLeft:5,
  width: 23,
  height: 23,
  // tintColor: "#6B7280",
},
};