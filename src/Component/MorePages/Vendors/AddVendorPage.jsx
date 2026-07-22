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
  Dimensions, BackHandler, Keyboard , KeyboardAvoidingView , Platform
} from "react-native";
import { CustomerContext } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { VendorContext } from "../../../Context/VendorContext";
import ProfilePlaceholder from "../../../Assets/Images/userAdd.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import ArrowLeft from "../../../Assets/Images/directionleft.png";
import ValidatedInput from "../ValidatedInput"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import { useCustomer } from "../../../Context/CustomerContext";
import ImagePickerSheet from "../../Customer/CustomerOverview/ImagePickerSheet";

export default function AddVendorSheet({ route, navigation }) {

  const { addVendor, updateVendor, getVendorList } = useContext(CustomerContext);;
  const { activeHostelId } = useContext(CommonContexts);

  const translateY = useRef(new Animated.Value(0)).current;
  const isApplyTriggeredRef = useRef(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [initialImage, setInitialImage] = useState(null);


  const [stateOpen, setStateOpen] = useState(false);
  const [stateQuery, setStateQuery] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessmobile, setBusinessMobile] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [vendorName, setvendorName] = useState("");
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
    code: vendorData?.countryCode || "+91",
    label: "India",
  });
  const [isSubmitClicked, setIsSubmitClicked] = useState(false)


  const [vendorCategory, setVendorCategory] = useState("");
  const [contactPerson, setContactPerson] = useState("");

  const [description, setDescription] = useState("");

  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");

  const [allowCredit, setAllowCredit] = useState(false);
  const [creditLimit, setCreditLimit] = useState("");
  const [creditPeriod, setCreditPeriod] = useState("");

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryErr, setCategoryErr] = useState("");
  const [nochangeErr, setNochangeErr] = useState("");

  const countryList = [
    { label: "India", code: "+91" },
    { label: "United States", code: "+1" },
    { label: "United Kingdom", code: "+44" },
    { label: "Australia", code: "+61" },
    { label: "Singapore", code: "+65" },
  ];


  const {
    vendorCategories,
    getVendorCategories, getVendorDetails, vendorDetails
  } = useContext(VendorContext);

  console.log("vendorCategories", vendorCategories);



  const vendorData = vendorDetails

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
    getVendorCategories(activeHostelId);
  }, []);


  console.log("vendorData", vendorData);


  useEffect(() => {
    if (!vendorData) return;
    setvendorName(vendorData?.firstName || "");
    setBusinessName(vendorData?.businessName || "");

    setContactPerson(vendorData.contactPerson || "");

    setBusinessMobile(vendorData.mobile || "");

    setMobile(vendorData.contactPersonMobile || "");

    setEmail(vendorData.emailId || "");

    setStreet(vendorData.houseNo || "");
    setLandmark(vendorData?.landMark || "")

    setCity(vendorData.city || "");

    setStateName(vendorData.state || "");

    setPinCode(
      vendorData.pinCode
        ? String(vendorData.pinCode)
        : ""
    );

    setDescription(vendorData.description || "");

    setGstNumber(vendorData.gst || "");

    setPanNumber(vendorData.pan || "");

    setAllowCredit(vendorData.allowCredit || false);

    setCreditLimit(
      vendorData.creditLimit
        ? String(vendorData.creditLimit)
        : ""
    );

    setCreditPeriod(
      vendorData.creditPeriod
        ? String(vendorData.creditPeriod)
        : ""
    );

    setSelectedCategory({
      label: vendorData.vendorCategoryName,
      value: vendorData.vendorCategoryId,
    });
  }, [vendorData]);


  useEffect(() => {
    if (!vendorData) return;

    const snapshot = {
      vendorName: vendorData.firstName || "",
      businessName: vendorData.businessName || "",
      contactPerson: vendorData.contactPerson || "",
      businessmobile: vendorData.mobile || "",
      mobile: vendorData.contactPersonMobile || "",
      email: vendorData.emailId || "",
      street: vendorData.houseNo || "",
      landmark : vendorData?.landMark || "",
      city: vendorData.city || "",
      stateName: vendorData.state || "",
      pinCode: vendorData.pinCode
        ? String(vendorData.pinCode)
        : "",
      description: vendorData.description || "",
      gstNumber: vendorData.gst || "",
      panNumber: vendorData.pan || "",
      allowCredit: vendorData.allowCredit || false,
      creditLimit: vendorData.creditLimit
        ? String(vendorData.creditLimit)
        : "",
      creditPeriod: vendorData.creditPeriod
        ? String(vendorData.creditPeriod)
        : "",
      categoryId: vendorData.vendorCategoryId,
    };

    setInitialData(snapshot);
  }, [vendorData]);

  const getCurrentData = () => ({
    vendorName,
    businessName,
    contactPerson,
    businessmobile,
    mobile,
    email,
    street,
    city,
    landmark,
    stateName,
    pinCode,
    description,
    gstNumber,
    panNumber,
    allowCredit,
    creditLimit,
    creditPeriod,
    categoryId: selectedCategory?.value,
  });

  const isSameData = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

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




  const categoryOptions = vendorCategories.map(item => ({
    label: item?.categoryName,
    value: item?.id,
  }));


  // const validate = () => {
  //   if (vendorData && initialData) {
  //     const currentData = getCurrentData();
  //     const dataSame = isSameData(initialData, currentData);
  //     const imageSame = !isImageChanged();

  //     if (dataSame && imageSame) {
  //       setNoChangeError("No changes detected");
  //       return false;
  //     }
  //   }

  //   let newErrors = {};

  //   if (!firstName.trim()) {
  //     newErrors.firstName = "Please Enter First Name";
  //   }

  //   if (!mobile.trim()) {
  //     newErrors.mobile = "Please Enter Mobile Number";
  //   } else if (mobile.length !== 10) {
  //     newErrors.mobile = "Mobile number must be 10 digits";
  //   } else if (mobile[0] === "0") {
  //     newErrors.mobile = "Mobile number cannot start with 0";
  //   } else if (/^0+$/.test(mobile)) {
  //     newErrors.mobile = "Mobile number cannot be all zeros";
  //   }

  //   if (!businessName.trim()) {
  //     newErrors.businessName = "Please Enter Business Name";
  //   }

  //   if (!city.trim()) {
  //     newErrors.city = "Please Enter City";
  //   }

  //   const pinError = validatePincode(pinCode);
  //   if (pinError) {
  //     newErrors.pinCode = pinError;
  //   }

  //   if (!stateName) {
  //     newErrors.stateName = "Please Select State";
  //   }

  //   if (!countryValue) {
  //     newErrors.country = "Please Select Country";
  //   }


  //   if (email && !emailRegex.test(email)) {
  //     newErrors.email = "Please Enter Valid Email ID";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;



  const validate = () => {
    let newErrors = {};

    if (!vendorName.trim()) {
      newErrors.vendorName = "Please enter vendor name";
    }

    if (!businessName.trim()) {
      newErrors.businessName = "Please enter business name";
    }

    if (!selectedCategory) {
      newErrors.category = "Please select vendor category";
    }

    if (!businessmobile) {
      newErrors.businessmobile = "Please enter business mobile number";
    } else if (businessmobile.length !== 10) {
      newErrors.businessmobile = "Business mobile number must be 10 digits";
    } else if (businessmobile[0] === "0") {
      newErrors.businessmobile = "Mobile number cannot start with 0";
    }

    if (mobile) {
      if (mobile.length !== 10) {
        newErrors.mobile = "Mobile number must be 10 digits";
      } else if (mobile[0] === "0") {
        newErrors.mobile =
          "Mobile number cannot start with 0";
      }
    }

    // if (!mobile) {
    //   newErrors.mobile = "Please enter mobile number";
    // } else if (mobile.length !== 10) {
    //   newErrors.mobile = "Mobile number must be 10 digits";
    // } else if (mobile[0] === "0") {
    //   newErrors.mobile = "Mobile number cannot start with 0";
    // }

    if (email && !emailRegex.test(email)) {
      newErrors.email = "Please enter valid email address";
    }

    if (!street.trim()) {
      newErrors.street = "Please enter commercial address";
    }

    if (!city.trim()) {
      newErrors.city = "Please enter city";
    }

    if (!stateName) {
      newErrors.stateName = "Please select state";
    }

    const pinError = validatePincode(pinCode);
    if (pinError) {
      newErrors.pinCode = pinError;
    }

    if (
      gstNumber &&
      !gstRegex.test(
        gstNumber.trim().toUpperCase()
      )
    ) {
      newErrors.gstNumber =
        "Please enter valid GST number";
    }

    if (
      panNumber &&
      !panRegex.test(
        panNumber.trim().toUpperCase()
      )
    ) {
      newErrors.panNumber =
        "Please enter valid PAN number";
    }

    // if (allowCredit) {
    //   if (!creditLimit) {
    //     newErrors.creditLimit = "Please enter credit limit";
    //   }

    //   if (!creditPeriod) {
    //     newErrors.creditPeriod = "Please enter credit period";
    //   }
    // }

    if (allowCredit) {
      if (!creditLimit) {
        newErrors.creditLimit =
          "Please enter credit limit";
      } else if (Number(creditLimit) <= 0) {
        newErrors.creditLimit =
          "Credit limit must be greater than 0";
      }
    }

    if (allowCredit) {
      if (!creditPeriod) {
        newErrors.creditPeriod =
          "Please enter credit period";
      } else if (Number(creditPeriod) <= 0) {
        newErrors.creditPeriod =
          "Credit period must be greater than 0";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // const payLoads = {
  //   firstName: contactPerson || "",
  //   lastName: "",

  //   countryCode: selectedCountry?.code || "+91",

  //   mobile: businessmobile,

  //   mailId: email,

  //   houseNo: street,

  //   landmark,


  //   pinCode: Number(pinCode),

  //   city,

  //   state: stateName,

  //   businessName,

  //   hostelId: activeHostelId,

  //   vendorCategory: selectedCategory?.value,

  //   contactPerson,

  //   contactPersonMobile: mobile,

  //   description,

  //   gst: gstNumber,

  //   pan: panNumber,

  //   allowCredit,

  //   creditLimit: allowCredit
  //     ? Number(creditLimit)
  //     : 0,

  //   creditPeriod: allowCredit
  //     ? Number(creditPeriod)
  //     : 0,
  // };

  const payLoads = {
    firstName: vendorName || "",
    lastName: "",

    countryCode: selectedCountry?.code || "+91",

    businessMobileCode: selectedCountry?.code || "+91",
    mobile: businessmobile,

    mailId: email,

    houseNo: street,
    landmark,
    area: "",

    pinCode: Number(pinCode),

    city,
    state: stateName,

    businessName,
    hostelId: activeHostelId,

    vendorCategory: selectedCategory?.value,

    contactPerson: contactPerson || "",

    contactPersonMobileCode:
      selectedCountry?.code || "+91",

    contactPersonMobile: mobile || "",

    description,

    gst: gstNumber,
    pan: panNumber,

    allowCredit,

    creditLimit: allowCredit
      ? Number(creditLimit)
      : 0,

    creditPeriod: allowCredit
      ? Number(creditPeriod)
      : 0,
  };

  //   const updatePayload = {
  //   firstName: contactPerson,
  //   lastName: "",
  //   countryCode: selectedCountry?.code || "+91",
  //   mobile: businessmobile,
  //   mailId: email,
  //   houseNo: street,
  //   landmark,
  //   pinCode: Number(pinCode),

  //  vendorId: vendorData?.id,
  //   country: vendorData?.countryId || 1,

  //   city,
  //   state: stateName,
  //   businessName,

  //   vendorCategory: selectedCategory?.value,
  //   contactPerson,
  //   description,

  //   vendorCode: vendorData?.vendorCode || "",

  //   gst: gstNumber,
  //   pan: panNumber,

  //   allowCredit,
  //   creditLimit: allowCredit ? Number(creditLimit) : 0,
  //   creditPeriod: allowCredit ? Number(creditPeriod) : 0,
  // };

  const updatePayload = {
    firstName: vendorName || "",
    lastName: "",

    countryCode:
      selectedCountry?.code || "+91",

    mobile: businessmobile || "",

    businessMobileCode:
      selectedCountry?.code || "+91",

    contactPersonMobile:
      mobile || "",

    contactPersonMobileCode:
      selectedCountry?.code || "+91",

    mailId: email || "",

    houseNo: street || "",

    landmark: landmark || "",

    area: "",

    pinCode: Number(pinCode),

    vendorId: vendorData?.id,

    country:
      vendorData?.countryId || 1,

    city: city || "",

    state: stateName || "",

    businessName: businessName || "",

    vendorCategory:
      selectedCategory?.value,

    contactPerson:
      contactPerson || "",

    description:
      description || "",

    vendorCode:
      vendorData?.vendorCode || "",

    gst: gstNumber || "",

    pan: panNumber || "",

    allowCredit,

    creditLimit: allowCredit
      ? Number(creditLimit)
      : 0,

    creditPeriod: allowCredit
      ? Number(creditPeriod)
      : 0,
  };

  console.log("payloads", payLoads);


  const handleSubmit = async () => {


    if (!validate()) return;

    if (isApplyTriggeredRef.current) return
    isApplyTriggeredRef.current = true


      try {
     if (vendorData && initialData) {
      const currentData = getCurrentData();

      const dataSame =
        JSON.stringify(initialData) ===
        JSON.stringify(currentData);

      if (dataSame) {
        setModalType("error");
        setModalMessage("No Changes Detected");
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500);

        return;
      }
    }



    let response;

    if (vendorData?.id) {
      response = await updateVendor(
        vendorData?.id,
        updatePayload,
        selectedImage
      );
    } else {
      response = await addVendor(
        payLoads,
        selectedImage
      );
    }



    console.log("response", response);

    if (response?.success) {
      setModalType("success");
      setModalMessage(vendorData ? "Vendor Updated Successfully" : "Vendor Added Successfully");
      setShowSuccessModal(true);
      // await getVendorList(activeHostelId);

      setTimeout(() => {
        const res = getVendorDetails(vendorData?.id)
        setShowSuccessModal(false);
        navigation.goBack();
      }, 1500);

    } else {

      setModalType("error");
      setModalMessage(response?.message || "Something went wrong");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1500);
    }
  } 
  catch (error) {
    console.log(error);
  } finally {
    isApplyTriggeredRef.current = false;
  }

  
  };


  return (
    <>


      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType} />

<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={20}
>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Image source={ArrowLeft} style={{ height: 18, width: 18 }} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {vendorData ? "Edit Vendor" : "Add New Vendor"}
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
            Vendor Name <Text style={{ color: "red" }}>*</Text>
          </Text>

          <ValidatedInput
            type="name"
            inputType="text"
            value={vendorName}
            onChangeText={(text) => {
              setvendorName(text);
              setErrors(prev => ({
                ...prev,
                vendorName: ""
              }));
            }}
            placeholder="Enter Vendor Name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          {errors.vendorName && (
            <ErrorMessage
              message={errors.vendorName}
              type="error"
            />
          )}



          <Text style={styles.label}>
            Business Name <Text style={{ color: "red" }}>*</Text>
          </Text>

          <ValidatedInput
            type="name"
            inputType="text"
            value={businessName}
            onChangeText={(text) => {
              setBusinessName(text);
              setErrors(prev => ({
                ...prev,
                businessName: ""
              }));
            }}
            placeholder="Enter Vendor Name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          {errors.businessName && (
            <ErrorMessage
              message={errors.businessName}
              type="error"
            />
          )}

          <Text style={styles.note}>
            Note : Max 50 Characters
          </Text>



          <Text style={styles.label}>
            Vendor   Category <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TouchableOpacity
            style={styles.expensesDropdownBox}
            onPress={() => {
              setCategoryOpen(!categoryOpen)
            }}
          >
            <Text style={{ color: selectedCategory ? "#000" : "#9CA3AF" }}>
              {selectedCategory?.label || "Select Category"}

            </Text>
            <Image source={DownArrow} style={styles.expensesArrowIcon} />
          </TouchableOpacity>

          {categoryOpen && (
            <View style={styles.expensesDropdownMenu}>
              <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                {categoryOptions.length === 0 ? (
                  <Text style={styles.expensesNoDataText}>
                    No category found
                  </Text>
                ) : (
                  categoryOptions.map((item, index) => {
                    const isSelected =
                      selectedCategory?.value === item?.value;

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.expensesOption,
                          isSelected && styles.expensesOptionSelected,
                        ]}
                        onPress={() => {
                          setSelectedCategory(item);
                          setCategoryErr("");
                          setNochangeErr("");
                          setCategoryOpen(false);
                          setErrors(prev => ({ ...prev, category: "" }))
                        }}

                      >
                        <Text
                          style={[
                            styles.expensesOptionText,
                            isSelected && styles.expensesOptionTextSelected,
                          ]}
                        >
                          {item?.label}
                        </Text>
                      </TouchableOpacity>
                    )
                  })


                )}
              </ScrollView>
            </View>
          )}

          {errors.category && (
            <ErrorMessage
              message={errors.category}
              type="error"
            />
          )}

          <Text style={styles.label}>
            Business Mob Number <Text style={{ color: "red" }}>*</Text>
          </Text>

          <View style={styles.mobileWrapper}>
            <TouchableOpacity
              style={styles.countryCodeBox}
              onPress={() => setCountryCodeOpen(!countryCodeOpen)}
            >
              <Text style={styles.countryCodeText}>
                {selectedCountry?.code || selectedCountry || "+91"}</Text>
              <Image source={DownArrow} style={styles.countryArrow} />
            </TouchableOpacity>

            <View ref={mobileRef}>
              <ValidatedInput
                style={styles.mobileInput}
                type="mobile"
                inputType="numeric"
                keyboardType="numeric"
                placeholder="Enter Mobile Number"
                placeholderTextColor="#9CA3AF"
                value={businessmobile}
                onChangeText={(t) => {
                  const cleaned = t.replace(/[^0-9]/g, "").slice(0, 10)
                  setBusinessMobile(cleaned)
                  setErrors({ ...errors, businessmobile: "" })
                  setNoChangeError("")
                }}
                onFocus={() => scrollToField(mobileRef)}
              />

            </View>

          </View>


          {errors.businessmobile && (
            <ErrorMessage
              message={errors.businessmobile}
              type="error"
            />
          )}
          {countryCodeOpen && (
            <>
              <TouchableWithoutFeedback onPress={() => setCountryCodeOpen(false)}>
                <View style={styles.dropdownOverlay} />
              </TouchableWithoutFeedback>

              <View style={styles.countryDropdownMenu}>
                <ScrollView>
                  {countryList.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.countryOption}
                      onPress={() => {
                        setSelectedCountry(item);
                        setCountryCodeOpen(false);
                      }}
                    >
                      <Text style={styles.countryOptionText}>
                        {item?.label} ({item?.code})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          <Text style={styles.label}>
            Proprietor / Contact Person Name 
          </Text>

          <ValidatedInput
            type="name"
            inputType="text"
            value={contactPerson}
            // onChangeText={setContactPerson}
            onChangeText={(t) => {
              // const sanitized = t.toLowerCase().replace(/[^a-z0-9@._\-+!#%&'*?^`{|}~]/g, "");
              setContactPerson(t);
              setErrors({ ...errors, contactPerson: "" })
              setNoChangeError("")
            }}
            placeholder="Enter Name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          {errors.contactPerson && (
            <ErrorMessage
              message={errors.contactPerson}
              type="error"
            />
          )}

          <Text style={styles.label}>
            Mob Number 
          </Text>

          <View style={styles.mobileWrapper}>
            <TouchableOpacity
              style={styles.countryCodeBox}
              onPress={() => setCountryCodeOpen(!countryCodeOpen)}
            >
              <Text style={styles.countryCodeText}>
                {selectedCountry?.code || selectedCountry || "+91"}</Text>
              <Image source={DownArrow} style={styles.countryArrow} />
            </TouchableOpacity>

            <View ref={mobileRef}>
              <ValidatedInput
                style={styles.mobileInput}
                type="mobile"
                inputType="numeric"
                keyboardType="numeric"
                placeholder="Enter Mobile Number"
                placeholderTextColor="#9CA3AF"
                value={mobile}
                onChangeText={(t) => {
                  const cleaned = t.replace(/[^0-9]/g, "").slice(0, 10)
                  setMobile(cleaned)
                  setErrors({ ...errors, mobile: "" })
                  setNoChangeError("")
                }}
                onFocus={() => scrollToField(mobileRef)}
              />
            </View>

          </View>


          <ErrorMessage message={errors.mobile} type="error" />
          {countryCodeOpen && (
            <>
              <TouchableWithoutFeedback onPress={() => setCountryCodeOpen(false)}>
                <View style={styles.dropdownOverlay} />
              </TouchableWithoutFeedback>

              <View style={styles.countryDropdownMenu}>
                <ScrollView>
                  {countryList.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.countryOption}
                      onPress={() => {
                        setSelectedCountry(item);
                        setCountryCodeOpen(false);
                      }}
                    >
                      <Text style={styles.countryOptionText}>
                        {item?.label} ({item?.code})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          <Text style={styles.label}>
            Email Address
          </Text>

          {/* <ValidatedInput
          type="email"
          inputType="email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter Mail ID"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        /> */}

          <View ref={emailRef}>
            <ValidatedInput
              type="email"
              inputType="email"
              value={email}
              onChangeText={(t) => {
                const sanitized = t.toLowerCase().replace(/[^a-z0-9@._\-+!#%&'*?^`{|}~]/g, "");
                setEmail(sanitized);
                setErrors({ ...errors, email: "" })
                setNoChangeError("")
              }}
              style={styles.input}
              placeholder="Enter Email"
              onFocus={() => scrollToField(emailRef)}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {errors.email && (
            <ErrorMessage message={errors.email} type="error" />
          )}

          <Text style={styles.label}>
            Commercial address (No,Area/Street, Sector )  <Text style={{ color: "red" }}>*</Text>
          </Text>

          <ValidatedInput
            type="description"
            inputType="text"
            multiline
            value={street}
            onChangeText={(t) => {
              // const sanitized = t.toLowerCase().replace(/[^a-z0-9@._\-+!#%&'*?^`{|}~]/g, "");
              setStreet(t);
              setErrors({ ...errors, street: "" })
              setNoChangeError("")
            }}
            // onChangeText={setStreet}
            placeholder="Enter Address"
            placeholderTextColor="#9CA3AF"
            style={styles.textArea}
          />

          {errors.street && (
            <ErrorMessage
              message={errors.street}
              type="error"
            />
          )}


          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>
                Landmark
              </Text>


              <ValidatedInput
                value={landmark}
                onChangeText={(t) => {
                  setLandmark(t.replace(/[^a-zA-Z\s]/g, ""))
                  setNoChangeError("")
                }}
                style={styles.input}
                placeholder="Enter Landmark"
                onFocus={() => scrollToField(landmarkRef)}
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
                onChangeText={(t) => {
                  setCity(t.replace(/[^a-zA-Z\s]/g, ""));
                  setErrors({ ...errors, city: "" })
                  setNoChangeError("")
                }}
                style={styles.input}
                placeholder="Enter City"
                placeholderTextColor="#9CA3AF"
                onFocus={() => scrollToField(cityRef)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>
                State <Text style={{ color: "red" }}>*</Text>
              </Text>

              <View style={{ position: "relative", marginBottom: 6 }}>
                <View ref={stateRef}>
                  <TextInput
                    style={styles.select}
                    placeholder="Select State"
                    placeholderTextColor="#9CA3AF"
                    value={stateOpen ? stateQuery : stateName}
                    editable={true}
                    // onFocus={() => {
                    //   setStateOpen(true);
                    //   setStateQuery("");
                    //    setIsInputFocused(true);
                    // }}
                    onChangeText={(t) => {
                      setStateQuery(t);
                      setStateOpen(true);
                    }}
                    onFocus={() => {
                      if (!stateOpen) {
                        setStateOpen(true);
                        Keyboard.dismiss()
                      }
                      else {
                        setStateOpen(false)
                      }

                      setStateQuery("")
                      scrollToField(stateRef)
                    }}

                  // onBlur={() => {
                  //   setIsInputFocused(false);
                  // }}
                  />
                </View>

                <Image source={DownArrow} style={styles.arrowIcon} />

                {stateOpen && (

                  <View style={styles.dropdownMenu}>
                    <TouchableWithoutFeedback onPress={() => setStateOpen(false)}>
                      <View style={{ flex: 1 }} />
                    </TouchableWithoutFeedback>
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
            </View>

            <View style={styles.half}>
              <Text style={styles.label}>
                Pincode <Text style={{ color: "red" }}>*</Text>
              </Text>

              {/* <ValidatedInput
              type="pincode"
              inputType="numeric"
              value={pinCode}
              onChangeText={setPinCode}
              placeholder="Enter Pincode"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            /> */}

              <ValidatedInput
                type="pincode"
                inputType="numeric"
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
                placeholderTextColor="#9CA3AF"
                onFocus={() => scrollToField(pincodeRef)}
              />
              {errors.pinCode && (
                <ErrorMessage message={errors.pinCode} type="error" />
              )}
            </View>
          </View>

          <Text style={styles.label}>
            Description
          </Text>

          <ValidatedInput
            type="description"
            inputType="text"
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
            type="gst"
            inputType="text"
            value={gstNumber}
            onChangeText={(text) => {
              setGstNumber(text);
              setErrors(prev => ({
                ...prev,
                gstNumber: "",
              }));
            }}
            placeholder="Enter GSTIN"
            autoCapitalize="characters"
            style={styles.input}
          />
          {errors.gstNumber && (
            <ErrorMessage
              message={errors.gstNumber}
              type="error"
            />
          )}


          <Text style={styles.label}>
            PAN Number (Optional)
          </Text>


          <ValidatedInput
            type="pan"
            inputType="text"
            value={panNumber}
            onChangeText={(text) => {
              setPanNumber(text);
              setErrors(prev => ({
                ...prev,
                panNumber: "",
              }));
            }}
            placeholder="Enter PAN Number"
            autoCapitalize="characters"
            style={styles.input}
          />
          {errors.panNumber && (
            <ErrorMessage
              message={errors.panNumber}
              type="error"
            />
          )}

          {vendorData && (
            <>
              <Text style={styles.label}>
                Vendor Code
              </Text>

              <TextInput
                editable={false}
                value={vendorData?.vendorCode || ""}
                style={[
                  styles.input,
                  { backgroundColor: "#F8F9FA" }
                ]}
              />
            </>
          )}

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
                <Text style={{ color: "#FFF" }}>
                  ✓
                </Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
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

              <ValidatedInput
                style={styles.input}
                value={creditLimit}
                onChangeText={setCreditLimit}
                keyboardType="numeric"
                type="numberOnly"
                inputType="numeric"
                placeholder="Enter Amount Limit"
              />

              {errors.creditLimit && (
                <ErrorMessage
                  message={errors.creditLimit}
                  type="error"
                />
              )}



              <Text style={styles.label}>
                Credit Period
              </Text>

              <ValidatedInput
                style={styles.input}
                value={creditPeriod}
                onChangeText={setCreditPeriod}
                keyboardType="numeric"
                type="numberOnly"
                inputType="numeric"
                placeholder="Enter Days"
              />

              {errors.creditPeriod && (
                <ErrorMessage
                  message={errors.creditPeriod}
                  type="error"
                />
              )}

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
              <Text style={{
                fontFamily: "Gilroy-Bold",
                fontSize: 16,
              }}>
                Cancel
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={[styles.submitBtn, isApplyTriggeredRef.current && { opacity: 0.6 }]}
              disabled={isApplyTriggeredRef.current}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>
                {vendorData ? "Update Vendor" : "Add Vendor"}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </View>
      </KeyboardAvoidingView>

    </>

  )


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 50
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
    paddingTop: 10
  },

  title: { fontSize: 20, fontFamily: "Gilroy-Bold", marginBottom: 20 },

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


  profileText: { fontSize: 14, fontFamily: "Gilroy-Bold", },
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


  cancel: { color: "#777", fontSize: 16, fontFamily: "Gilroy-Bold", },
  addBtn: {
    backgroundColor: "#4662FF",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addBtnText: { color: "#fff", fontSize: 16, fontFamily: "Gilroy-Bold", },
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
    borderRadius: 7
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

  // countryDropdownMenu: {
  //   position: "absolute",
  //   top: 355,
  //   left: 0,
  //   width: 180,
  //   backgroundColor: "#fff",
  //   borderWidth: 1,
  //   borderColor: "#E5E7EB",
  //   borderRadius: 10,
  //   elevation: 10,
  //   zIndex: 9999,
  //   maxHeight: 250,
  // },
  // countryOption: {
  //   paddingVertical: 12,
  //   paddingHorizontal: 12,
  // },

  // countryOptionText: {
  //   fontSize: 14,
  //   color: "#111",
  // },

  // mobileInput: {
  //   flex: 1,
  //   paddingHorizontal: 12,
  //   fontSize: 14,
  // },

  countryDropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 10,
    zIndex: 9999,
  },

  //   dropdownOverlay: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  // },

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

  expensesDropdownBox: {
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  expensesArrowIcon: {
    width: 18,
    height: 18,
    tintColor: "#6A6A6A",
  },

  expensesDropdownMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 6,
    zIndex: 999,
  },

  expensesOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  expensesOptionSelected: {
    backgroundColor: "#1D5BEE",
  },

  expensesOptionText: {
    fontSize: 15,
    color: "#111",
  },

  expensesOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },

  expensesNoDataText: {
    paddingVertical: 14,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
  },

});