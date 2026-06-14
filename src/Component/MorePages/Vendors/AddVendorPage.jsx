import React, { useRef, useState, useEffect, useContext } from "react";
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
  Dimensions, BackHandler, Keyboard
} from "react-native";
import { CustomerContext } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ProfilePlaceholder from "../../../Assets/Images/userAdd.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import ArrowLeft from "../../../Assets/Images/directionleft.png";
import ValidatedInput from "../ValidatedInput"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import { useCustomer } from "../../../Context/CustomerContext";
import ImagePickerSheet from "../../Customer/CustomerOverview/ImagePickerSheet";

export default function AddVendorSheet({  vendorData , navigation}) {

 const { addVendor, updateVendor, getVendorList } = useContext(CustomerContext);;
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
  const [countryCode, setCountryCode] = useState("+91");
  const [countryCodeOpen, setCountryCodeOpen] = useState(false);



  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [initialData, setInitialData] = useState(null);
  const [noChangeError, setNoChangeError] = useState("");

  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code:vendorData?.countryCode || "+91",
    label: "India",
  });
  const [isSubmitClicked, setIsSubmitClicked]=useState(false)

  const scrollRef = useRef(null);
  const mobileRef = useRef(null);
  const emailRef = useRef(null);
  const businessnameRef = useRef(null);
  const flatRef = useRef(null);
  const landmarkRef = useRef(null);
  const cityRef = useRef(null)
  const pincodeRef = useRef(null)
  const stateRef = useRef(null);
  const countryRef = useRef(null);

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
      countryCode: vendorData.countryCode,
    };
    if (vendorData.countryId === 1) {
      setCountryLabel("India");   // UI
      setCountryValue(1);         // API
    }

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
    setSelectedCountry(snapshot?.countryCode)


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

  console.log('stat', filteredStateList)

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

  const [vendorCategory, setVendorCategory] = useState("");
const [contactPerson, setContactPerson] = useState("");

const [description, setDescription] = useState("");

const [gstNumber, setGstNumber] = useState("");
const [panNumber, setPanNumber] = useState("");

const [allowCredit, setAllowCredit] = useState(false);
const [creditLimit, setCreditLimit] = useState("");
const [creditPeriod, setCreditPeriod] = useState("");

return(

   
  <View style={styles.container}>

    {/* Header */}
   <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Image source={ArrowLeft} style={{height:18, width:18}}/>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>
        Add new Vendor
      </Text>
    </View>


    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >

      {/* Vendor Information */}
       

      <View style={styles.sectionHeader}>
        <View style={styles.blueBar} />
        <Text style={styles.sectionTitle}>
          Vendor Information
        </Text>
      </View>
<Text style={styles.label}>
  Vendor / Business Name <Text style={{ color: "red" }}>*</Text>
</Text>

<ValidatedInput
  type="name"
  inputType="text"
  value={businessName}
  onChangeText={setBusinessName}
  placeholder="Enter Vendor Name"
  placeholderTextColor="#9CA3AF"
  style={styles.input}
/>

<Text style={styles.note}>
  Note : Max 50 Characters
</Text>

<Text style={styles.label}>
  Vendor Category <Text style={{ color: "red" }}>*</Text>
</Text>

<TouchableOpacity style={styles.select}>
  <Text>
    {vendorCategory || "Food & Groceries"}
  </Text>

  <Image
    source={DownArrow}
    style={styles.arrow}
  />
</TouchableOpacity>

<Text style={styles.label}>
  Business Mob Number <Text style={{ color: "red" }}>*</Text>
</Text>

<View style={styles.mobileWrapper}>
<ValidatedInput
  type="mobile"
  inputType="numeric"
  value={mobile}
  onChangeText={setMobile}
  placeholder="98765 43210"
  placeholderTextColor="#9CA3AF"
  style={styles.mobileInput}
/>
</View>

<Text style={styles.label}>
 Proprietor / Contact Person Name <Text style={{ color: "red" }}>*</Text>
</Text>

<ValidatedInput
  type="name"
  inputType="text"
  value={contactPerson}
  onChangeText={setContactPerson}
  placeholder="Enter Name"
  placeholderTextColor="#9CA3AF"
  style={styles.input}
/>

<Text style={styles.label}>
 Mob Number <Text style={{ color: "red" }}>*</Text>
</Text>

<View style={styles.mobileWrapper}>
 
<ValidatedInput
  type="email"
  inputType="email"
  value={email}
  onChangeText={setEmail}
  placeholder="+91"
  placeholderTextColor="#9CA3AF"
  style={styles.input}
/>

</View>

<Text style={styles.label}>
 Email Address
</Text>

<ValidatedInput
  type="email"
  inputType="email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter Mail ID"
  placeholderTextColor="#9CA3AF"
  style={styles.input}
/>

<Text style={styles.label}>
 Commercial Address *
</Text>

<ValidatedInput
  type="description"
  inputType="text"
  multiline
  value={street}
  onChangeText={setStreet}
  placeholder="Enter Address"
  placeholderTextColor="#9CA3AF"
  style={styles.textArea}
/>


<View style={styles.row}>
  <View style={styles.half}>
    <Text style={styles.label}>
      Landmark
    </Text>

    <TextInput
      style={styles.input}
      value={landmark}
      onChangeText={setLandmark}
      placeholder="Near ICICI Bank"
    />
  </View>

  <View style={styles.half}>
    <Text style={styles.label}>
      City <Text style={{ color: "red" }}>*</Text>
    </Text>

   <ValidatedInput
  type="name"
  inputType="text"
  value={city}
  onChangeText={setCity}
  placeholder="Enter City"
  placeholderTextColor="#9CA3AF"
  style={styles.input}
/>
  </View>
</View>

<View style={styles.row}>
  <View style={styles.half}>
   <Text style={styles.label}>
      State <Text style={{ color: "red" }}>*</Text>
    </Text>

   <ValidatedInput
  type="pincode"
  inputType="numeric"
  value={pinCode}
  onChangeText={setPinCode}
  placeholder="Select State"
  placeholderTextColor="#9CA3AF"
  style={styles.input}
/>
  </View>

  <View style={styles.half}>
    <Text style={styles.label}>
      Pincode <Text style={{ color: "red" }}>*</Text>
    </Text>

   <ValidatedInput
  type="pincode"
  inputType="numeric"
  value={pinCode}
  onChangeText={setPinCode}
  placeholder="Enter Pincode"
  placeholderTextColor="#9CA3AF"
  style={styles.input}
/>
  </View>
</View>

<Text style={styles.label}>
 Description
</Text>

<TextInput
  multiline
  numberOfLines={4}
  style={styles.textArea}
  value={description}
  onChangeText={setDescription}
  placeholder="Ex : Wifi Bill Paid for May"
/>

<View style={styles.sectionHeader}>
  <View style={styles.blueBar} />
  <Text style={styles.sectionTitle}>
    Business Details
  </Text>
</View>

<Text style={styles.label}>
 GST IN Number (Optional)
</Text>

<ValidatedInput
  type="description"
  inputType="text"
  value={gstNumber}
  onChangeText={setGstNumber}
  placeholder="Enter GSTIN"
  autoCapitalize="characters"
  style={styles.input}
/>

<Text style={styles.label}>
 PAN Number (Optional)
</Text>

<ValidatedInput
  type="description"
  inputType="text"
  value={panNumber}
  onChangeText={(text) =>
    setPanNumber(text.toUpperCase())
  }
  placeholder="Enter PAN Number"
  autoCapitalize="characters"
  style={styles.input}
/>

<Text style={styles.label}>
 Vendor Code
</Text>

<TextInput
  editable={false}
  value="VEN 006"
  style={[
    styles.input,
    { backgroundColor: "#F8F9FA" }
  ]}
/>

<TouchableOpacity
  style={styles.creditRow}
  onPress={() => setAllowCredit(!allowCredit)}
>
  <View
    style={[
      styles.checkbox,
      allowCredit &&
      styles.checkboxActive
    ]}
  >
    {allowCredit && (
      <Text style={{color:"#FFF"}}>
        ✓
      </Text>
    )}
  </View>

  <View style={{flex:1}}>
    <Text style={styles.creditTitle}>
      Allow Credit Purchases
    </Text>

    <Text style={styles.creditSub}>
      It's like similar to debt purchase and will pay later
    </Text>
  </View>
</TouchableOpacity>

{allowCredit && (
  <>
    <Text style={styles.label}>
      Credit Limit ₹ INR
    </Text>

    <TextInput
      style={styles.input}
      value={creditLimit}
      onChangeText={setCreditLimit}
      keyboardType="numeric"
      placeholder="Enter Amount Limit"
    />

    <Text style={styles.label}>
      Credit Period
    </Text>

    <TextInput
      style={styles.input}
      value={creditPeriod}
      onChangeText={setCreditPeriod}
      keyboardType="numeric"
      placeholder="Enter Days"
    />

    <Text style={styles.creditNote}>
      Note : Create the Credit limit for the Vendor which avoids the exemption of the Credit Balance.
    </Text>
  </>
)}

      <View style={styles.footerRow}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={{fontFamily: "Gilroy-Bold",  
  fontSize: 16,}}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitBtn}
        >
          <Text style={styles.submitText}>
            Add Vendor
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>

  </View>

)


}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#FFF",
  paddingTop:50
},

header: {
  height: 60,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: "#F1F5F9",
},

backBtn: {
  width: 18,
  height: 18,
  borderRadius: 8,
  backgroundColor: "#F5F7FB",
  justifyContent: "center",
  alignItems: "center",
},

headerTitle: {
  fontSize: 20,
  fontFamily: "Gilroy-Bold",
  marginLeft: 16,
},

content: {
  padding: 20,
  paddingBottom: 60,
  paddingTop:10
},

  title: { fontSize: 20,     fontFamily: "Gilroy-Bold", marginBottom: 20 },

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
       fontFamily: "Gilroy-Bold",
    color: "#000",
  },

  profileTitle: {
    fontSize: 14,
       fontFamily: "Gilroy-Bold",
    color: "#000",
  },

  profileSub: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    lineHeight: 16,
  },


  profileImg: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#737373", },


  profileText: { fontSize: 14,     fontFamily: "Gilroy-Bold", },
  subText: { color: "#777", fontSize: 12, lineHeight: 16, marginTop: 4 },

//  label: {
//   fontSize: 15,
//   color: "#111827",
//   marginBottom: 10,
//   marginTop: 18,
//   fontFamily: "Gilroy-Medium",
// },
// input: {
//   height: 58,
//   borderWidth: 1,
//   borderColor: "#E5E7EB",
//   borderRadius: 14,
//   paddingHorizontal: 16,
//   fontSize: 16,
//   backgroundColor: "#FFF",
// },
// textArea: {
//   height: 110,
//   borderWidth: 1,
//   borderColor: "#DCE3F1",
//   borderRadius: 14,
//   padding: 16,
//   textAlignVertical: "top",
//   fontSize: 16,
// },
input: {
  height: 56,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  paddingHorizontal: 16,
  backgroundColor: "#FFFFFF",
  fontSize: 16,
  fontFamily: "Gilroy-Medium",
  color: "#111827",
},

textArea: {
  minHeight: 110,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingTop: 16,
  backgroundColor: "#FFFFFF",
  textAlignVertical: "top",
  fontSize: 16,
  fontFamily: "Gilroy-Medium",
  color: "#111827",
},

label: {
  fontSize: 15,
  fontFamily: "Gilroy-Medium",
  color: "#111827",
  marginBottom: 8,
  marginTop: 16,
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
  marginTop: 30,
},

cancelBtn: {
  width: 110,
  height: 52,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 14,
},

submitBtn: {
  width: 160,
  height: 52,
  borderRadius: 12,
  backgroundColor: "#2457FF",
  justifyContent: "center",
  alignItems: "center",
},

submitText: {
  color: "#FFF",
  fontSize: 16,
  fontFamily: "Gilroy-Bold",
},
  noChangeWrapper: {
    width: "100%",
    alignItems: "center",
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
  },

  noChangeInner: {
    width: "50%",
    alignItems: "center",
    justifyContent: 'center'
  },


  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    // paddingRight:28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "98.5%",
  },


  cancel: { color: "#777", fontSize: 16 , fontFamily: "Gilroy-Bold", },
  addBtn: {
    backgroundColor: "#4662FF",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addBtnText: { color: "#fff", fontSize: 16,     fontFamily: "Gilroy-Bold",},
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
    fontFamily: "Gilroy-Regular"
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
    // position: "absolute",
    top: 5,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 9999,
    elevation: 2,
    minHeight: 150,
    maxHeight: 200,
  },
  CountrydropdownMenu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 9999,
    elevation: 4,
    minHeight: 50,
    maxHeight: 120,
  },

  selectedOption: {
    backgroundColor: "#E3EEFF",
    borderRadius:7
  },

  selectedOptionText: {
    color: "#2D6CDF",
       fontFamily: "Gilroy-Bold",
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

  mobileWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    height: 48,
    overflow: "hidden",
  },

  countryCodeBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: "#e1e1e1",
    // backgroundColor: "#F9FAFB",
  },

  countryCodeText: {
    fontSize: 14,
    fontWeight: "600",
  },

  countryArrow: {
    width: 14,
    height: 14,
    marginLeft: 6,
    tintColor: "#555",
  },

  mobileInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },

  countryDropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 10,
    zIndex: 9999,
  },

  dropdownOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},

countryDropdownMenu: {
  position: "absolute",
  top: 355,
  left: 0,
  width: 180,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 10,
  elevation: 10,
  zIndex: 9999,
  maxHeight: 250,
},
countryOption: {
  paddingVertical: 12,
  paddingHorizontal: 12,
},

countryOptionText: {
  fontSize: 14,
  color: "#111",
},

sectionHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 15,
  marginBottom: 20,
},

blueBar: {
  width: 4,
  height: 28,
  backgroundColor: "#2457FF",
  borderRadius: 10,
  marginRight: 12,
},

sectionTitle: {
  fontSize: 18,
  fontFamily: "Gilroy-Bold",
  color: "#111827",
},

row: {
  flexDirection: "row",
  justifyContent: "space-between",
},

half: {
  width: "48%",
},



note: {
  color: "#64748B",
  marginTop: 6,
},

creditRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginTop: 20,
},

checkbox: {
  width: 24,
  height: 24,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: "#6D4AFF",
  marginRight: 12,
  justifyContent: "center",
  alignItems: "center",
},

checkboxActive: {
  backgroundColor: "#6D4AFF",
},

creditTitle: {
  fontSize: 18,
   fontFamily: "Gilroy-Semibold"
},

creditSub: {
  marginTop: 5,
  color: "#64748B",
  fontFamily: "Gilroy-Regular"
},

creditNote: {
  color: "#64748B",
  marginTop: 10,
  lineHeight: 22,
},
});