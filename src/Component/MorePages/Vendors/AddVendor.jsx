import React, { useRef, useState, useEffect , useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions, BackHandler , Keyboard
} from "react-native";
import { CustomerContext } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ProfilePlaceholder from "../../../Assets/Images/userAdd.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { launchImageLibrary } from 'react-native-image-picker';
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import { useCustomer } from "../../../Context/CustomerContext";

export default function AddVendorSheet({ onClose, vendorData }) {

  const getCurrentData = () => ({
  firstName,
  lastName,
  mobile,
  email,
  businessName,
  houseNo,
  street,
  landmark,
  city,
  stateName,
  country,
  pinCode,
});



const isSameData = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};


  const {  addVendor,updateVendor , getVendorList } = useContext(CustomerContext);;
  const { activeHostelId } = useContext(CommonContexts);

  const translateY = useRef(new Animated.Value(0)).current;

  const [selectedImage, setSelectedImage] = useState(null);
  const [initialImage, setInitialImage] = useState(null);


  const [stateOpen, setStateOpen] = useState(false);
const [stateQuery, setStateQuery] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");

  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");
  const [pinCode, setPinCode] = useState("");

  const countryOptions = [{ label: "India", value: "India" }];
const [countryOpen, setCountryOpen] = useState(false);

const [countryLabel, setCountryLabel] = useState("");
const [countryValue, setCountryValue] = useState(null);



    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [initialData, setInitialData] = useState(null);
const [noChangeError, setNoChangeError] = useState("");


useEffect(() => {
  if (!vendorData) return;

  const phone = vendorData.mobile || "";
  const mobileOnly = phone.slice(-10);

  const snapshot = {
    firstName: vendorData.firstName || "",
    lastName: vendorData.lastName || "",
    mobile: mobileOnly,
    email: vendorData.emailId || "",
    businessName: vendorData.businessName || "",
    houseNo: vendorData.houseNo || "",
    street: vendorData.area || "",
    landmark: vendorData.landMark || "",
    city: vendorData.city || "",
    stateName: vendorData.state || "",
    country: vendorData.countryId || "",
    pinCode: vendorData.pinCode ? String(vendorData.pinCode) : "",
  };

  // set form values
  setFirstName(snapshot.firstName);
  setLastName(snapshot.lastName);
  setMobile(snapshot.mobile);
  setEmail(snapshot.email);
  setBusinessName(snapshot.businessName);
  setHouseNo(snapshot.houseNo);
  setStreet(snapshot.street);
  setLandmark(snapshot.landmark);
  setCity(snapshot.city);
  setStateName(snapshot.stateName);
  setCountry(snapshot.country);
  setPinCode(snapshot.pinCode);

 
  if (vendorData.profilePic) {
  setSelectedImage({ uri: vendorData.profilePic });
  setInitialImage(vendorData.profilePic);
}


  // save initial snapshot
  setInitialData(snapshot);
}, [vendorData]);

const isImageChanged = () => {
  if (!initialImage && selectedImage) return true;
  if (initialImage && !selectedImage) return true;
  if (
    initialImage &&
    selectedImage &&
    selectedImage.uri !== initialImage
  )
    return true;

  return false;
};


 const vendors = [
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


const stateList = vendors; // reuse your vendors array


const filteredStateList = stateList?.filter((s) =>
    s.label.toLowerCase().includes(stateQuery.toLowerCase())
  )
  .sort((a, b) => {
    const aStart = a.label.toLowerCase().startsWith(stateQuery.toLowerCase());
    const bStart = b.label.toLowerCase().startsWith(stateQuery.toLowerCase());
    return bStart - aStart;
  });


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validatePincode = (value) => {
  if (!value) return "Please Enter Pincode";
  if (!/^\d+$/.test(value)) return "Pincode must contain only numbers";
  if (value.length !== 6) return "Pin Code must be exactly 6 digits";
  if (value === "000000") return "Pin Code cannot be all zeros";
  if (value[0] === "0") return "Pin Code cannot start with 0";
  if (value.slice(-3) === "000") return "Last 3 digits cannot be 000";
  return "";
};



//   const validate = () => {
//   let newErrors = {};

//   if (!firstName.trim()) {
//     newErrors.firstName = "Please Enter First Name";
//   }

//   if (!mobile.trim()) {
//     newErrors.mobile = "Please Enter Mobile Number";
//   } else if (mobile.length !== 10) {
//     newErrors.mobile = "Mobile number must be 10 digits";
//   }

//   if (email && !emailRegex.test(email)) {
//     newErrors.email = "Please Enter Valid Email ID";
//   }

//   const pinError = validatePincode(pinCode);
//   if (pinError) {
//     newErrors.pinCode = pinError;
//   }

//   if (!country) {
//     newErrors.country = "Please Select Country";
//   }

//   setErrors(newErrors);
//   return Object.keys(newErrors).length === 0;
// };


const validate = () => {
if (vendorData && initialData) {
  const currentData = getCurrentData();
  const dataSame = isSameData(initialData, currentData);
  const imageSame = !isImageChanged();

  if (dataSame && imageSame) {
    setNoChangeError("No changes detected");
    return false;
  }
}

  let newErrors = {};

  if (!firstName.trim()) {
    newErrors.firstName = "Please Enter First Name";
  }

if (!mobile.trim()) {
  newErrors.mobile = "Please Enter Mobile Number";
} else if (mobile.length !== 10) {
  newErrors.mobile = "Mobile number must be 10 digits";
} else if (mobile[0] === "0") {
  newErrors.mobile = "Mobile number cannot start with 0";
} else if (/^0+$/.test(mobile)) {
  newErrors.mobile = "Mobile number cannot be all zeros";
}

  if (!businessName.trim()) {
    newErrors.businessName = "Please Enter Business Name";
  }

  if (!city.trim()) {
    newErrors.city = "Please Enter City";
  }

  const pinError = validatePincode(pinCode);
  if (pinError) {
    newErrors.pinCode = pinError;
  }

  if (!stateName) {
    newErrors.stateName = "Please Select State";
  }

  if (!countryValue) {
  newErrors.country = "Please Select Country";
}


  if (email && !emailRegex.test(email)) {
    newErrors.email = "Please Enter Valid Email ID";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



  useEffect(() => {
    const backAction = () => {
      onClose();
      return true;
    };

    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => handler.remove();
  }, [onClose]);

  console.log("vendorData", vendorData);



  const pickImage = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.7,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("Cancelled");
      } else if (response.errorMessage) {
        console.log("Error:", response.errorMessage);
      } else {
        setSelectedImage(response.assets[0]);
        setNoChangeError("");
      }
    });
  };
  const handleSubmit = async () => {
  if (!validate()) return;

  setLoading(true);

  const payload = {
    hostelId: activeHostelId,
    firstName,
    lastName,
    mobile: `91${mobile}`,
    mailId: email,
    businessName,
    // country: Number(country), 
    country: Number(countryValue),
    houseNo,
    pinCode,
    area: street,
    landmark,
    city,
    state: stateName,
  };

  let res;

  try {
    if (vendorData) {
      // ✅ UPDATE
      res = await updateVendor(vendorData.id, payload, selectedImage);
    } else {
      // ✅ ADD
      res = await addVendor(payload, selectedImage);
    }
  } catch (err) {
    console.log("❌ API ERROR 👉", err?.response?.data || err);
    res = { success: false, message: "Something went wrong" };
  }

  setLoading(false);

  if (res?.success) {
    setModalType("success");
    setModalMessage(vendorData ? "Vendor Updated Successfully" : "Vendor Added Successfully");
    setShowSuccessModal(true);
     await getVendorList(activeHostelId);

    setTimeout(() => {
      setShowSuccessModal(false);
      onClose();
    }, 1500);
  } else {
   
    setModalType("error");
    setModalMessage(res?.message || "Something went wrong");
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
    }, 1500);
  }
};

// const handleSubmit = async () => {
//   if (!validate()) return;

//   setLoading(true);

//   const payload = {
//     hostelId: activeHostelId,
//     firstName,
//     lastName,
//     mobile: `91${mobile}`,
//     mailId: email,
//     businessName,
//     country: Number(country),
//     houseNo,
//     pinCode,
//     area: street,
//     landmark,
//     city,
//     state: stateName,
//   };

//   let res;

//   try {
//     if (vendorData) {
      
//     res = await updateVendor(vendorData.id, payload, selectedImage);

//     } else {
     
//       res = await addVendor(payload, selectedImage);
//     }

    
//   } catch (err) {
//     console.log("❌ API ERROR 👉", err?.response?.data || err);
//     res = { success: false, message: "Something went wrong" };
//   }

//   setLoading(false);

//   if (res?.success) {
//     setModalType("success");
//     setModalMessage(vendorData ? "Vendor Updated Successfully" : "Vendor Added Successfully");
//     setShowSuccessModal(true);

//     setTimeout(() => {
//       setShowSuccessModal(false);
//       onClose();
//     }, 1500);
//   } else {
//     console.log("❌ API FAIL RESPONSE:", res);
//     setModalType("error");
//     setModalMessage(res?.message || "Something went wrong");
//     setShowSuccessModal(true);

//     setTimeout(() => {
//       setShowSuccessModal(false);
//     }, 1500);
//   }
// };



//  const handleSubmit = async () => {
//   if (!validate()) return;

//   setLoading(true);

// const payload = {
//   firstName,
//   lastName,
//   mobile: `91${mobile}`,
//   mailId: email,
//   businessName,
//   country: Number(country),
//   houseNo,
//   pinCode,
//   area: street,
//   landmark,
//   city,
//   state: stateName,
// };


//   let res;

//   if (vendorData) {
//     // EDIT
//     // res = await updateVendor({
//     //   profilePic: selectedImage?.uri
//     //     ? {
//     //         uri: selectedImage.uri,
//     //         name: "vendor.jpg",
//     //         type: "image/jpeg",
//     //       }
//     //     : null,
//     //   updateVendor: {
//     //     ...payload,
//     //     vendorId: vendorData.id,
//     //   },
//     //   hostelId: activeHostelId,
//     // });
//     res = await updateVendor({
//   profilePic: imageFile,
//   updateVendor: {
//     ...payload,
//     vendorId: vendorData.id,
//   },
//   hostelId: activeHostelId,
// });

//   } else {
//     // ADD
//     // res = await addVendor({
//     //   profilePic: selectedImage?.uri
//     //     ? {
//     //         uri: selectedImage.uri,
//     //         name: "vendor.jpg",
//     //         type: "image/jpeg",
//     //       }
//     //     : null,
//     //   payLoads: {
//     //     ...payload,
//     //     hostelId: activeHostelId,
//     //   },
//     //   hostelId: activeHostelId,
//     // });
//     res = await addVendor({
//   profilePic: imageFile,
//   payLoads: {
//     ...payload,
//     hostelId: activeHostelId,
//   },
//   hostelId: activeHostelId,
// });

//   }

//   setLoading(false);

//   console.log("response", res);
  

//   if (res?.success) {
//     setModalType("success");
//     setModalMessage(
//       vendorData
//         ? "Vendor Updated Successfully"
//         : "Vendor Added Successfully"
//     );
//     setShowSuccessModal(true);

//     setTimeout(() => {
//       setShowSuccessModal(false);
//       onClose();
//     }, 1500);
//   } else {
//     setModalType("error");
//     setModalMessage("Something went wrong");
//     setShowSuccessModal(true);
//       setTimeout(() => {
//       setShowSuccessModal(false);
//     }, 1500);
//   }
// };




  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  //  const vendors = ["Vendor 1", "Vendor 2", "Vendor 3", "Vendor 4", "Vendor 5"];
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorSelected, setVendorSelected] = useState("Select a Vendor");
 


  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > SCREEN_HEIGHT * 0.20) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            onClose();   // ← correct place
          });
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
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height + 60,
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



  return (

     <>
     
           <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType} />
    

    <View style={styles.overlay}>
      <TouchableWithoutFeedback
        onPress={() => {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start(() => onClose());
        }}
      >

        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.handle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          scrollEnabled={!stateOpen}    
          keyboardShouldPersistTaps="handled"
        >

          <Text style={styles.title}>
            {vendorData ? "Edit Vendor" : "Add Vendor"}
          </Text>



          <View style={styles.profileRow}>
            <TouchableOpacity style={styles.profileContainer} onPress={pickImage}>
              <View style={styles.profileCircle}>


                <Image
                  source={selectedImage ? { uri: selectedImage.uri } : ProfilePlaceholder}
                  style={styles.profileImg}
                />

               {selectedImage && (
  <View style={styles.editBadge}>
    <Image
      source={require("../../../Assets/Images/edit.png")}
      style={styles.editIcon}
    />
  </View>
)}


              </View>
            </TouchableOpacity>

            <View style={{ marginLeft: 14 }}>
              <Text style={styles.profileTitle}>Profile Photo</Text>
              <Text style={styles.profileSub}>
                Add Profile Image of Vendor / Business.{"\n"}Max size 2MB
              </Text>
            </View>
          </View>



          {/* Form Fields */}
          <Text style={styles.label}>First Name <Text style={{ color: "red" }}>*</Text></Text>
          <TextInput
            value={firstName}
                    onChangeText={(t) => {
            setFirstName(t.replace(/[^a-zA-Z\s]/g, ""));
           setErrors({ ...errors, firstName: "" });
           setNoChangeError("");
          }}
            // onChangeText={(t) => setFirstName(t.replace(/[^a-zA-Z\s]/g, ""))}
            placeholder="Enter First Name"
            style={styles.input}
          />
           {errors.firstName && (
  <ErrorMessage message={errors.firstName} type="error" />
)}



          <Text style={styles.label}>Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={(t) =>  {
              setLastName(t.replace(/[^a-zA-Z\s]/g, ""))
              setNoChangeError("")
            }
            }
            style={styles.input}
            placeholder="Enter last Name"
          />

          <Text style={styles.label}>Mobile Number <Text style={{ color: "red" }}>*</Text></Text>
       <TextInput
  value={mobile}
  keyboardType="numeric"
  onChangeText={(t) => {
    const cleaned = t.replace(/[^0-9]/g, "").slice(0, 10);
    setMobile(cleaned);
    setErrors({ ...errors, mobile: "" })
     setNoChangeError("")
  }}
  style={styles.input}
  placeholder="Enter Mobile No"
/>

          {errors.mobile && (
  <ErrorMessage message={errors.mobile} type="error" />
)}

          <Text style={styles.label}>Email ID</Text>
        <TextInput
  value={email}
  onChangeText={(t) => {
    setEmail(t.toLowerCase());
    setErrors({ ...errors, email: "" })
     setNoChangeError("")
  }}
  style={styles.input}
  placeholder="Enter Email"
/>


          <Text style={styles.label}>Business Name <Text style={{ color: "red" }}>*</Text></Text>
          <TextInput
            value={businessName}
            onChangeText={(t) => {
            setBusinessName(t.replace(/[^a-zA-Z\s]/g, ""));
           setErrors({ ...errors, businessName: "" })
            setNoChangeError("")
          }}
            style={styles.input}
            placeholder="Enter Business Name"
            
          />

          {errors.businessName && (
  <ErrorMessage message={errors.businessName} type="error" />
)}


          <Text style={styles.label}>Flat, House No., Building...</Text>
        <TextInput
  value={street}
  onChangeText={(t) => {
    setStreet(t.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, ""))
    setNoChangeError("");
  }}
  style={styles.input}
  placeholder="Enter Street"
/>



          <Text style={styles.label}>Landmark</Text>
          <TextInput
            value={landmark}
            onChangeText={(t) =>{
            setLandmark(t.replace(/[^a-zA-Z\s]/g, ""))
            setNoChangeError("")
            }
              }
            style={styles.input}
            placeholder="Enter Landmark"
          />

          <Text style={styles.label}>Town/City <Text style={{ color: "red" }}>*</Text></Text>
           <TextInput
            value={city}
               onChangeText={(t) => {
            setCity(t.replace(/[^a-zA-Z\s]/g, ""));
           setErrors({ ...errors, city: "" })
              setNoChangeError("")
          }}
            style={styles.input}
            placeholder="Enter City"
          />
          {errors.city && (
  <ErrorMessage message={errors.city} type="error" />
)}


          <Text style={styles.label}>Pincode <Text style={{ color: "red" }}>*</Text></Text>
           <TextInput
  value={pinCode}
  keyboardType="numeric"
  onChangeText={(text) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
    setPinCode(cleaned);

    const errorMsg = validatePincode(cleaned);
    setErrors({ ...errors, pinCode: errorMsg })
       setNoChangeError("")
  }}
  style={styles.input}
  placeholder="Enter Pincode"
/>

{errors.pinCode && (
  <ErrorMessage message={errors.pinCode} type="error" />
)}


      

          {/* <Text style={styles.label}>State <Text style={{ color: "red" }}>*</Text></Text>

          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={styles.select}
              onPress={() => setVendorOpen(!vendorOpen)}
              activeOpacity={0.9}
            >
              <Text style={styles.selectText}>
  {stateName || "Select State"}
</Text>

              <Image source={DownArrow} style={styles.arrow} />
            </TouchableOpacity>

            {vendorOpen && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={{ maxHeight: 160 }}>
                  {vendors.map((v, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.option}
                     onPress={() => {
  setStateName(v.value);
  setVendorOpen(false);
  setErrors({ ...errors, stateName: "" })
     setNoChangeError("")
}}

                    >
                      <Text style={styles.optionText}>{v.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {errors.stateName && (
  <ErrorMessage message={errors.stateName} type="error" />
)} */}

<Text style={styles.label}>
  State <Text style={{ color: "red" }}>*</Text>
</Text>

<View style={{ position: "relative", marginBottom: 6 }}>
  <TextInput
    style={styles.select}
    placeholder="Select State"
    placeholderTextColor="#9CA3AF"
    value={stateOpen ? stateQuery : stateName}
    editable={true}
    onFocus={() => {
      setStateOpen(true);
      setStateQuery("");
    }}
    onChangeText={(t) => {
      setStateQuery(t);
      setStateOpen(true);
    }}
  />

  <Image source={DownArrow} style={styles.arrowIcon} />

 {stateOpen && (
  <View style={styles.dropdownMenu}>
    <ScrollView
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
    >
      {filteredStateList.length > 0 ? (
        filteredStateList.map((v, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              stateName === v.label && styles.selectedOption,
            ]}
            onPress={() => {
              setStateName(v.label);
              setStateQuery("");
              setStateOpen(false);
              setErrors({ ...errors, stateName: "" });
              setNoChangeError("");
            }}
          >
            <Text
              style={[
                styles.optionText,
                stateName === v.label && styles.selectedOptionText,
              ]}
            >
              {v.label}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noResult}>No state found</Text>
      )}
    </ScrollView>
  </View>
)}

</View>

{errors.stateName && (
  <ErrorMessage message={errors.stateName} type="error" />
)}





        {/* <Text style={styles.label}>Country <Text style={{ color: "red" }}>*</Text></Text>

<View style={{ position: "relative" }}>
  <TouchableOpacity
    style={styles.select}
    onPress={() => setCountryOpen(!countryOpen)}
  >
    <Text style={styles.selectText}>
      {country || "Select Country"}
    </Text>
    <Image source={DownArrow} style={styles.arrow} />
  </TouchableOpacity>

  {countryOpen && (
    <View style={styles.dropdownMenu}>
      <TouchableOpacity
        style={styles.option}
       onPress={() => {
  setCountry(1);
  setCountryOpen(false);
  setErrors({ ...errors, country: "" })
     setNoChangeError("")
}}
      >
        <Text style={styles.optionText}>India</Text>
      </TouchableOpacity>
    </View>
  )}
</View>

{errors.country && <ErrorMessage message={errors.country} type="error" />} */}

<Text style={styles.label}>
  Country <Text style={{ color: "red" }}>*</Text>
</Text>

<View style={{ position: "relative" }}>
  <TouchableOpacity
    style={styles.select}
    onPress={() => setCountryOpen(!countryOpen)}
  >
    <Text style={styles.selectText}>
      {countryLabel || "Select Country"}
    </Text>
    <Image source={DownArrow} style={styles.arrow} />
  </TouchableOpacity>

  {countryOpen && (
    <View style={styles.CountrydropdownMenu}>
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          setCountryLabel("India"); // ✅ UI text
          setCountryValue(1);       // ✅ API value
          setCountryOpen(false);
          setErrors({ ...errors, country: "" });
          setNoChangeError("");
        }}
      >
        <Text style={styles.optionText}>India</Text>
      </TouchableOpacity>
    </View>
  )}
</View>

{errors.country && (
  <ErrorMessage message={errors.country} type="error" />
)}


{noChangeError !== "" && (
  <View style={styles.noChangeWrapper}>
    <View style={styles.noChangeInner}>
      <ErrorMessage message={noChangeError} type="warning" />
    </View>
  </View>
)}



          {/* Footer Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addBtn} onPress={handleSubmit}>
  <Text style={styles.addBtnText}>
    {vendorData ? "Save Changes" : "Add Vendor"}
  </Text>
</TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
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
  handle: {
    width: 80,
    height: 5,
    backgroundColor: "#CFCFCF",
    alignSelf: "center",
    borderRadius: 20,
    marginBottom: 15,
  },

  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
  },


  profileCircle: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },


  profileIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: "cover",
  },

  plusBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,

    borderWidth: 1,
    borderColor: "#D6D6D6",
    justifyContent: "center",
    alignItems: "center",
  },

  plusText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },

  profileTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },

  profileSub: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    lineHeight: 16,
  },


  profileImg: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#737373", },


  profileText: { fontSize: 14, fontWeight: "700" },
  subText: { color: "#777", fontSize: 12, lineHeight: 16, marginTop: 4 },

  label: { marginTop: 18, marginBottom: 6, fontSize: 14, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
  },

  selectBox: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: { color: "#444" },
  arrow: { width: 18, height: 18, tintColor: "#444" },

 footerRow: {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  marginTop: 20,
  marginBottom: 10,
  gap: 20,  
},
noChangeWrapper: {
  width: "100%",
  alignItems: "center",
  textAlign:'center',
  marginTop: 12,
  marginBottom: 12,
},

noChangeInner: {
  width: "50%",        
  alignItems: "center",
  justifyContent:'center'
},


  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "88%",
  },


  cancel: { color: "#777", fontSize: 16 },
  addBtn: {
    backgroundColor: "#4662FF",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  profileCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E6E6E6",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  profileImg: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
  },

  editBadge: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -16 }, { translateY: -16 }],
    elevation: 0
  },


  editIcon: {
    width: 20,
    height: 20,

  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 12,
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
 arrowIcon: {
  position: "absolute",
  right: 12,
  top: 14,
  width: 18,
  height: 18,
  tintColor: "#777",
},

dropdownMenu: {
  position: "absolute",
  bottom: 52,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  zIndex: 9999,
  elevation: 20,
  minHeight: 150,
  maxHeight: 200,
},
CountrydropdownMenu: {
  position: "absolute",
  bottom: 32,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  zIndex: 9999,
  elevation: 20,
  minHeight: 50,
  maxHeight: 120,
},

selectedOption: {
  backgroundColor: "#E3EEFF",
},

selectedOptionText: {
  color: "#2D6CDF",
  fontWeight: "700",
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


});
