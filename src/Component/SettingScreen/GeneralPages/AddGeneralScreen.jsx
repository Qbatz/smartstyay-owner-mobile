import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from "react-native";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ProfilePlaceholder from "../../../Assets/Images/userAdd.png";
import LeftArrow from "../../../Assets/Images/Arrow_left.png";
import plusIcon from "../../../Assets/Images/plusIcon.png";
import Edit from "../../../Assets/Images/edit.png";
import Eye from "../../../Assets/Images/Eye.png";
import EyeClose from "../../../Assets/Images/EyeIcon.png";
import { useGeneral } from "../../../Context/GeneralContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import ImagePickerSheet from "../../Customer/CustomerOverview/ImagePickerSheet";





export default function AddGeneralScreen({ navigation, route }) {
  const editData = route?.params?.editData || null;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [flat, setFlat] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const { addGeneral, getAdminList, loading, errorMsg, successMsg, updateGeneral, mailError } = useGeneral();
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);




  // inside AddGeneralScreen
  // const handleSubmit = async () => {
  //   const payload = {
  //     firstName,
  //     lastName,
  //     mobile,
  //     mailId: email,
  //     houseNo: flat,
  //     street,
  //     landmark,
  //     city,
  //     pincode,
  //     state: StateSelected,
  //     password: "Test@123",
  //   };

  //   console.log("Payload JSON =", payload);

  //   const formData = new FormData();

  //   // Convert accountInfo JSON → Base64
  //   const jsonBase64 = btoa(JSON.stringify(payload));

  //   formData.append("accountInfo", {
  //     uri: "data:application/json;base64," + jsonBase64,
  //     type: "application/json",
  //     name: "account.json",
  //   });

  //   // IMAGE FORMAT (Same as your working sample)
  //   if (selectedImage) {
  //     formData.append("profilePic", {
  //       uri: selectedImage.uri,
  //       name: selectedImage.fileName || `photo_${Date.now()}.jpg`,
  //       type: selectedImage.type || "image/jpeg",
  //     });
  //   }

  //   console.log("FORM PARTS ===>", formData);

  //   const res = await addGeneral(formData);
  //   if (res) navigation.goBack();
  // };



  // const handleSubmit = async () => {

  //   // 🔍 REQUIRED FIELD VALIDATION
  //   if (!firstName.trim()) return alert("First Name is required");
  //   if (!mobile.trim()) return alert("Mobile Number is required");
  //   if (!pincode.trim()) return alert("Pincode is required");
  //   if (!city.trim()) return alert("City is required");
  //   if (StateSelected === "Select State") return alert("Please select a State");

  //   const payload = {
  //     firstName,
  //     lastName,
  //     mobile,
  //     mailId: email,
  //     houseNo: flat,
  //     street,
  //     landmark,
  //     city,
  //     pincode,
  //     state: StateSelected,
  //     password: "Test@123",
  //   };

  //   console.log("Payload JSON =", payload);

  //   const formData = new FormData();

  //   const jsonBase64 = btoa(JSON.stringify(payload));

  //   formData.append("accountInfo", {
  //     uri: "data:application/json;base64," + jsonBase64,
  //     type: "application/json",
  //     name: "account.json",
  //   });

  //   if (selectedImage) {
  //     formData.append("profilePic", {
  //       uri: selectedImage.uri,
  //       name: selectedImage.fileName || `photo_${Date.now()}.jpg`,
  //       type: selectedImage.type || "image/jpeg",
  //     });
  //   }

  //   console.log("FORM PARTS ===>", formData);

  //   const res = await addGeneral(formData);
  //   if (res) navigation.goBack();
  // };
  useEffect(() => {
    if (editData) {
      setFirstName(editData.firstName || "");
      setLastName(editData.lastName || "");
      setMobile(editData.mobileNo || "");
      setEmail(editData.mailId || "");
      setFlat(editData.houseNo || "");
      setStreet(editData.street || "");
      setLandmark(editData.landmark || "");
      setCity(editData.city || "");
      setPincode(String(editData.pincode || ""));
      setSelectedState(editData.state || "Select State");
      setSelectedImage(editData.profilePic ? { uri: editData.profilePic } : null);
    }
  }, [editData]);

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const validatePincode = (pin) => {
    if (!pin.trim()) return "Please Enter Pincode";
    if (!/^[1-9][0-9]{5}$/.test(pin.trim()))
      return "Please Enter Valid 6-digit Pincode";
    return "";
  };

  const handleSubmit = async () => {
   
    let newErrors = {};



    if (!firstName.trim()) newErrors.firstName = "Please Enter First Name";
    // if (!mobile.trim()) newErrors.mobile = "Please Enter Mobile Number";
    if (!mobile.trim()) {
      newErrors.mobile = "Please Enter Mobile Number";
    }
    else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      newErrors.mobile = "Please Enter Valid 10-digit Mobile Number";
    }
    else if (/^(\d)\1+$/.test(mobile.trim())) {
      newErrors.mobile = "Invalid Mobile Number";
    }

    if (!email.trim()) {
      newErrors.email = "Please Enter Email ID";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please Enter Valid Email ID";
    }
    if (!password.trim()) {
      newErrors.password = "Please Enter Password";
    }
    else if (!strongPasswordRegex.test(password)) {
      newErrors.password =
        "Password must be 8 chars, include A-Z, a-z, 0-9 & a special character";
    }

    // if (!pincode.trim()) newErrors.pincode = "Please Enter Pincode";
    const pinError = validatePincode(pincode);
    if (pinError) newErrors.pincode = pinError;

    if (!city.trim()) newErrors.city = "Please Enter City";
    // if (selectedState === "Select State") newErrors.selectedState = "Please Select State";
    if (!selectedState || selectedState === "Select State") {
      newErrors.selectedState = "Please Select State";
    }


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // isSubmittingRef.current = false;
      return;
    }

    setErrors({});
     if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setErrors({});

    const payload = {
      firstName,
      lastName,
      mobile,
      mailId: email,
      houseNo: flat,
      street,
      landmark,
      city,
      pincode,
      state: selectedState,
      password: "Test@123",
    };

    const formData = new FormData();
    const jsonBase64 = btoa(JSON.stringify(payload));

    formData.append("accountInfo", {
      uri: "data:application/json;base64," + jsonBase64,
      type: "application/json",
      name: "account.json",
    });

    if (selectedImage) {
      formData.append("profilePic", {
        uri: selectedImage.uri,
        name: selectedImage.fileName || `photo_${Date.now()}.jpg`,
        type: selectedImage.type || "image/jpeg",
      });
    }

    try { 
    const res = await addGeneral(formData);
    console.log("ADD RESPONSE:", res);


    if (res.success === false) {
      const apiError = res.data || res?.message;

      if (apiError.emailStatus) setEmailError(apiError.emailStatus);
      if (apiError.mobileStatus) setPhoneError(apiError.mobileStatus);


      return;
    }


    setModalMessage("General Added Successfully");
    setModalType("success");
    setShowSuccessModal(true);

    await getAdminList();

    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.goBack();
    }, 1500);
    }catch(error){
      console.log(error)
    }finally{
       isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // const handleSubmit = async () => {
  //   let newErrors = {};

  //   if (!firstName.trim()) newErrors.firstName = "Please Enter First Name";
  //   if (!mobile.trim()) newErrors.mobile = "Please Enter Mobile Number";
  //    if (!password.trim()) newErrors.password = "Please Enter Password";
  //   if (!pincode.trim()) newErrors.pincode = "Please Enter Pincode";
  //   if (!city.trim()) newErrors.city = "Please Enter City";
  //   if (StateSelected === "Select State") newErrors.state = "Please Select State";


  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }


  //   setErrors({});

  //   const payload = {
  //     firstName,
  //     lastName,
  //     mobile,
  //     mailId: email,
  //     houseNo: flat,
  //     street,
  //     landmark,
  //     city,
  //     pincode,
  //     state: StateSelected,
  //     password: "Test@123",
  //   };

  //   const formData = new FormData();
  //   const jsonBase64 = btoa(JSON.stringify(payload));

  //   formData.append("accountInfo", {
  //     uri: "data:application/json;base64," + jsonBase64,
  //     type: "application/json",
  //     name: "account.json",
  //   });

  //   if (selectedImage) {
  //     formData.append("profilePic", {
  //       uri: selectedImage.uri,
  //       name: selectedImage.fileName || `photo_${Date.now()}.jpg`,
  //       type: selectedImage.type || "image/jpeg",
  //     });
  //   }

  //   const res = await addGeneral(formData);
  // console.log("res.email",res.errorMsg.data.emailStatus)
  // if (res) {
  //   setModalMessage("General Added Successfully");
  //   setModalType("success");

  //   setShowSuccessModal(true);

  //   await getAdminList();  

  //   setTimeout(() => {
  //     setShowSuccessModal(false);
  //     navigation.goBack();
  //   }, 1500);
  // }


  // };
  // const hasChanges = () => {
  //   if (!editData) return true;

  //   return !(
  //     editData.firstName === firstName &&
  //     editData.lastName === lastName &&
  //     editData.mobileNo == mobile &&                 // ✔ fixed
  //     editData.mailId === email &&
  //     editData.houseNo === flat &&
  //     editData.street === street &&
  //     editData.landmark === landmark &&
  //     editData.city === city &&
  //     String(editData.pincode) === String(pincode) &&
  //     editData.state === selectedState &&            // ✔ matches your API
  //     !selectedImage                                 // image unchanged
  //   );
  // };
  const hasChanges = () => {
    if (!editData) return true;

    const imageChanged =
      selectedImage &&
      selectedImage.uri &&
      selectedImage.uri !== editData.profilePic;

    return !(
      editData.firstName === firstName &&
      editData.lastName === lastName &&
      String(editData.mobileNo) === String(mobile) &&
      editData.mailId === email &&
      editData.houseNo === flat &&
      editData.street === street &&
      editData.landmark === landmark &&
      editData.city === city &&
      String(editData.pincode) === String(pincode) &&
      editData.state === selectedState &&
      !imageChanged
    );
  };

  const [topWarning, setTopWarning] = useState("");



  const handleUpdate = async () => {
    let newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "Please Enter First Name";
    // if (!mobile.trim()) newErrors.mobile = "Please Enter Mobile Number";
    // if (!email.trim()) newErrors.email = "Please Enter Email ID";
    if (!mobile.trim()) {
      newErrors.mobile = "Please Enter Mobile Number";
    }
    else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      newErrors.mobile = "Please Enter Valid 10-digit Mobile Number";
    }
    else if (/^(\d)\1+$/.test(mobile.trim())) {
      newErrors.mobile = "Invalid Mobile Number";
    }

    if (!email.trim()) {
      newErrors.email = "Please Enter Email ID";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please Enter Valid Email ID";
    }
    // if (!pincode.trim()) newErrors.pincode = "Please Enter Pincode";
    const pinError = validatePincode(pincode);
    if (pinError) newErrors.pincode = pinError;



    if (!city.trim()) newErrors.city = "Please Enter City";
    if (selectedState === "Select State") newErrors.state = "Please Select State";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    if (!hasChanges()) {
      setModalMessage("No Changes Detected");
      setModalType("warning");
      //  setModalMessage("General Updated Successfully");
      // setModalType("success");
      setShowSuccessModal(true);


      setTimeout(() => {
        setShowSuccessModal(false);
        setTopWarning("");
      }, 1500);
      return;
    }

    setErrors({});
    const payloadForApi = {
      firstName,
      lastName,
      mobile,
      mailId: email,
      houseNo: flat,
      street,
      landmark,
      city,
      pincode: Number(pincode),
      state: selectedState
    };

    const formData = new FormData();
    const jsonBase64 = btoa(JSON.stringify(payloadForApi));
    console.log("payloadForApi", payloadForApi)
    formData.append("payload", {
      uri: "data:application/json;base64," + jsonBase64,
      type: "application/json",
      name: "payload.json",
    });

    if (selectedImage?.uri) {
      formData.append("profilePic", {
        uri: selectedImage.uri,
        name: selectedImage.fileName || `photo_${Date.now()}.jpg`,
        type: selectedImage.type || "image/jpeg",
      });
    }



    const res = await updateGeneral(editData.userId, formData);
    console.log("updateGeneral", res)

    if (res.status === 200) {
      setModalMessage("General Updated Successfully");
      setModalType("success");
      setShowSuccessModal(true);

      await getAdminList();

      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.goBack();
      }, 1500);
    } else {
      setModalMessage(res?.emailStatus || res?.message || res?.mobileStatus);
      setModalType("error");
      setShowSuccessModal(true);

      await getAdminList();

      setTimeout(() => {
        setShowSuccessModal(false);
        // navigation.goBack();
      }, 1500);
    }
  };


  // const handleUpdate = async () => {
  //   let newErrors = {};

  //   if (!firstName.trim()) newErrors.firstName = "Please Enter First Name";
  //   if (!mobile.trim()) newErrors.mobile = "Please Enter Mobile Number";
  //   if (!pincode.trim()) newErrors.pincode = "Please Enter Pincode";
  //   if (!city.trim()) newErrors.city = "Please Enter City";
  //   if (StateSelected === "Select State") newErrors.state = "Please Select State";

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   setErrors({});

  //   // 🌟 Create correct payload
  //   const payloadForApi = {
  //     payload: {
  //       firstName,
  //       lastName,
  //       mobile,
  //       mailId: email,
  //       houseNo: flat,
  //       street,
  //       landmark,
  //       city,
  //       pincode: Number(pincode),
  //       state: StateSelected
  //     }
  //   };

  //   const formData = new FormData();

  //   // Convert payload → base64 JSON
  //   const jsonBase64 = btoa(JSON.stringify(payloadForApi));

  //   formData.append("payload", {
  //     uri: "data:application/json;base64," + jsonBase64,
  //     type: "application/json",
  //     name: "payload.json",
  //   });


  //   if (selectedImage?.uri) {
  //     formData.append("profilePic", {
  //       uri: selectedImage.uri,
  //       name: selectedImage.fileName || `photo_${Date.now()}.jpg`,
  //       type: selectedImage.type || "image/jpeg",
  //     });
  //   }

  //   // 🔥 Send update request with adminId
  //   const res = await updateGeneral(editData.userId, formData);

  //   if (res) {
  //     setModalMessage("General Updated Successfully");
  //     setModalType("success");
  //     setShowSuccessModal(true);

  //     await getAdminList();

  //     setTimeout(() => {
  //       setShowSuccessModal(false);
  //       navigation.goBack();
  //     }, 1500);
  //   }
  // };

  const cleanPassword = (text) => {
    return text.replace(/[^A-Za-z0-9@$!%*?&^#]/g, "");
  };


  useEffect(() => {
    if (editData) {
      console.log("Editing user:", editData);
    }
  }, []);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [StateSelected, setStateSelected] = useState("Select State");
  const [selectedImage, setSelectedImage] = useState(null);
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
      }
    });
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: "photo",
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.assets && response.assets.length > 0) {
          setSelectedImage(response.assets[0]);
        }
      }
    );
  };
  const openGallery = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.7 },
      async (response) => {
        if (response.didCancel) return;

        if (response.assets?.length > 0) {
          const image = response.assets[0];
          setSelectedImage(image); // UI update

        }
      }
    );
  };

  const StateName = [
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

  const [stateQuery, setStateQuery] = useState("");



  const [selectedState, setSelectedState] = useState(""); // final value

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

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return (
    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />

      <View style={styles.mainContainer}>

        {/* ✅ FIXED HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={LeftArrow} style={styles.backIcon} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {editData ? "Edit General" : "Add General"}
          </Text>
        </View>

        {/* ✅ FIXED PROFILE SECTION */}
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => setShowProfileSheet(true)}
          activeOpacity={0.8}
        >
          <View style={styles.profileCircle}>
            <Image
              source={selectedImage ? { uri: selectedImage.uri } : ProfilePlaceholder}
              style={styles.profileImg}
            />

            {!selectedImage && (
              <View style={styles.addBadge}>
                <Image source={plusIcon} style={{ width: 16, height: 16 }} />
              </View>
            )}

            {selectedImage && (
              <View style={styles.centerEditBadge}>
                <Image source={Edit} style={{ width: 20, height: 20 }} />
              </View>
            )}
          </View>

          <View style={{ marginLeft: 16 }}>
            <Text style={styles.profileLabel}>Profile Photo</Text>
            <Text style={styles.profileSub}>
              Add Profile Image of Vendor/Business.{"\n"}Max size of image 2 MB
            </Text>
          </View>
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!stateOpen}
          contentContainerStyle={{ paddingBottom: 50 }}
        > */}

          {/* <ScrollView
  style={styles.formContainer}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="always"
  contentContainerStyle={{ paddingBottom: 250 }}
> */}
          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ paddingBottom: 20 }}
          >







            <Text style={styles.label}>First Name  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>
            <TextInput style={styles.input} placeholder="Enter First name" value={firstName}
              // onChangeText={(t) => {
              //   setFirstName(t);
              //   setErrors({ ...errors, firstName: "" });
              // }} 
              onChangeText={(t) => {
                const cleaned = t.replace(/[^A-Za-z\s]/g, "");

                setFirstName(cleaned);
                setErrors({ ...errors, firstName: "" });
              }}
            />

            {errors.firstName && (
              <ErrorMessage message={errors.firstName} type="error" />
            )}

            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} placeholder="Enter last Name" value={lastName}
              onChangeText={(t) => {
                const cleaned = t.replace(/[^A-Za-z\s]/g, "");
                setLastName(cleaned);
              }}
            />

            {/* <Text style={styles.label}>Mobile Number  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>
            <TextInput style={styles.input} placeholder="+91" keyboardType="numeric" value={mobile}
              onChangeText={(t) => {
                const cleaned = t.replace(/[^0-9]/g, "").slice(0, 10);
                setMobile(cleaned);
                setErrors({ ...errors, mobile: "" });
                setPhoneError("")
              }} /> */}
            <Text style={styles.label}>
              Mobile Number <Text style={{ color: "red", fontWeight: "700" }}>*</Text>
            </Text>

            <View style={styles.phoneContainer}>
              <Text style={styles.countryCode}>+91</Text>

              <TextInput
                style={styles.phoneInput}
                placeholder="Enter mobile number"
                keyboardType="number-pad"
                value={mobile}
                maxLength={10}
                onChangeText={(t) => {
                  const cleaned = t.replace(/[^0-9]/g, "").slice(0, 10);
                  setMobile(cleaned);
                  setErrors({ ...errors, mobile: "" });
                  setPhoneError("");
                }}
              />
            </View>

            {/* {errors.mobile && (
            <Text style={styles.errText}>{errors.mobile}</Text>
          )} */}

            {errors.mobile && (
              <ErrorMessage message={errors.mobile} type="error" />
            )}
            {/* {phoneError !== "" && (
            <Text style={styles.errText}>{phoneError}</Text>
          )} */}
            {phoneError !== "" && (
              <ErrorMessage message={phoneError} type="error" />
            )}

            <Text style={styles.label}>Email ID  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>
            <TextInput style={styles.input} placeholder="Enter Email" value={email}
              // onChangeText={(t) => {
              //   setEmail(t);
              //   setErrors({ ...errors, email: "" });
              //   setEmailError("");
              // }}
              onChangeText={(t) => {
                const cleaned = t
                  .replace(/\s/g, "")                 // ✅ space remove
                  .replace(/[^a-zA-Z0-9@._-]/g, "");  // ✅ valid email chars மட்டும்

                setEmail(cleaned);
                setErrors({ ...errors, email: "" });
                setEmailError("");
              }}
            />
            {/* {emailError !== "" && (
            <Text style={styles.errText}>{emailError}</Text>
          )} */}
            {emailError !== "" && (
              <ErrorMessage message={emailError} type="error" />
            )}
            {/* {errors.email && (
            <Text style={styles.errText}>{errors.email}</Text>
          )} */}
            {errors.email && (
              <ErrorMessage message={errors.email} type="error" />
            )}
            {!editData && (
              <>
                <Text style={styles.label}>Password  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>

                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter Password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(t) => {
                      setPassword(cleanPassword(t));
                      // setPassword(t);
                      setErrors({ ...errors, password: "" });
                    }}
                  />

                  <TouchableOpacity
                    style={styles.eyeIconBox}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      source={showPassword ? Eye : EyeClose}
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>

                {errors.password && (
                  <ErrorMessage message={errors.password} type="error" />
                )}
              </>
            )}
            <Text style={styles.label}>Flat, House no, Building...</Text>
            <TextInput style={styles.input} placeholder="Enter House No" value={flat}
              // onChangeText={setFlat} 
              onChangeText={(t) => {
                const cleaned = t.replace(/[^a-zA-Z0-9\s/#,-]/g, "");
                setFlat(cleaned);
              }}
            />

            <Text style={styles.label}>Area, Street, Sector...</Text>
            <TextInput style={styles.input} placeholder="Enter Street" value={street}
              // onChangeText={setStreet} 
              onChangeText={(t) => {
                const cleaned = t.replace(/[^a-zA-Z0-9\s/#,-]/g, "");
                setStreet(cleaned);
              }}
            />

            <Text style={styles.label}>Landmark</Text>
            <TextInput style={styles.input} placeholder="Eg: Near SBI" value={landmark}
              // onChangeText={setLandmark} 
              onChangeText={(t) => {
                const cleaned = t.replace(/[^a-zA-Z0-9\s/#,-]/g, "");
                setLandmark(cleaned);
              }}
            />

            <Text style={styles.label}>Pincode  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>
            <TextInput style={styles.input} placeholder="Enter Pincode" value={pincode} keyboardType="number-pad"
              onChangeText={(t) => {

                const cleaned = t.replace(/[^0-9]/g, "").slice(0, 6);
                setPincode(cleaned);
                setErrors({ ...errors, pincode: "" });
              }} />
            {/* {errors.pincode && (
            <Text style={styles.errText}>{errors.pincode}</Text>
          )} */}
            {errors.pincode && (
              <ErrorMessage message={errors.pincode} type="error" />
            )}

            <Text style={styles.label}>Town/City  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>
            <TextInput style={styles.input} placeholder="Enter City" value={city}

              onChangeText={(t) => {
                const cleaned = t.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");
                setCity(cleaned);
                setErrors({ ...errors, city: "" });
              }}
            />

            {errors.city && (
              <ErrorMessage message={errors.city} type="error" />
            )}

            {/* <Text style={styles.label}>State  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>

          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={styles.select}
              onPress={() => setStateOpen(!StateOpen)}
              activeOpacity={0.9}
            >
              <Text style={styles.selectText}>
                {StateSelected || "Select a Vendor"}
              </Text>
              <Image source={DownArrow} style={styles.arrow} />
            </TouchableOpacity>

            {StateOpen && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={{ maxHeight: 160 }}>
                  {StateName.map((v, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.option}
                      // onPress={() => {
                      //     setStateSelected(v.label);
                      //     setStateOpen(false);
                      // }}
                      onPress={() => {
                        setStateSelected(v.label);
                        setErrors({ ...errors, state: "" });
                        setStateOpen(false);
                      }}
                    >
                      <Text style={styles.optionText}>{v.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View> */}




            <Text style={styles.label}>State <Text style={{ color: "red" }}>*</Text></Text>

            <View style={{ position: "relative", marginBottom: 6 }}>

              <TextInput
                style={styles.select}
                placeholder="Select State"
                placeholderTextColor="#9CA3AF"
                value={stateOpen ? stateQuery : selectedState}
                editable={true}
                showSoftInputOnFocus={true}

                onFocus={() => {
                  setStateOpen(true);
                  setStateQuery("");
                }}
                onPressIn={() => {
                  setStateOpen(true);
                }}


                onChangeText={(t) => {
                  setStateQuery(t);
                  setStateOpen(true);
                  setErrors({ ...errors, selectedState: "" });
                }}


              />

              <Image source={DownArrow} style={styles.arrowIcon} />

              {stateOpen && (

                <>
                  <TouchableOpacity

                    style={{
                      position: "absolute",
                      top: -1000,
                      bottom: -1000,
                      left: -1000,
                      right: -1000,
                    }}
                    activeOpacity={1}
                    onPress={() => setStateOpen(false)}
                  />
                  <View style={styles.dropdownMenu}>
                    <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}
                      style={{ flex: 1 }}
                    >
                      {filteredStateList.length > 0 ? (
                        filteredStateList.map((v, index) => (
                          <TouchableOpacity key={index}
                            style={[
                              styles.option,
                              selectedState === v.label && styles.selectedOption
                            ]}
                            onPress={() => {
                              setSelectedState(v.label);
                              setStateQuery("");
                              setStateOpen(false);
                              setErrors({ ...errors, selectedState: "" });
                            }}
                          >
                            <Text
                              style={[
                                styles.optionText,
                                selectedState === v.label && styles.selectedOptionText
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

                  <TouchableOpacity />
                </>
              )}
            </View>



            {errors.selectedState && (
              <ErrorMessage message={errors.selectedState} type="error" />
            )}


            {/* {topWarning !== "" && (
            <Text style={styles.errText}>{topWarning}</Text>
          )} */}
            {topWarning !== "" && (
              <ErrorMessage
                message={topWarning}
                type="error"
                containerStyle={styles.centerWarning}
              />
            )}



            {/* 
          <TouchableOpacity style={styles.submitBtn}
            onPress={editData ? handleUpdate : handleSubmit}
          >
            <Text style={styles.submitText}>
               {loading ? "Saving..." : editData ? "Save Changes" : "Add General"}
            </Text>
          </TouchableOpacity> */}
            <View style={styles.fixedBtnWrapper}>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={editData ? handleUpdate : handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.submitText}>
                  {loading ? "Saving..." : editData ? "Save Changes" : "Add General"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* {errorMsg !== "" && (
            <Text style={{ color: "red", textAlign: "center", marginTop: 5 }}>
              {errorMsg}
            </Text>
          )} */}
            {errorMsg !== "" && (
              <ErrorMessage message={errorMsg} type="error" />
            )}
            {/* {successMsg !== "" && (
    <Text style={{ color: "green", marginTop: 8 }}>{successMsg}</Text>
  )} */}



            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        <ImagePickerSheet
          visible={showProfileSheet}
          onClose={() => setShowProfileSheet(false)}
          title="Change Profile Picture"
          options={[
            {
              label: "Take Picture",
              icon: require("../../../Assets/Images/CameraIcon.png"),
              showArrow: true,
              onPress: openCamera,
            },
            {
              label: "Select from Gallery",
              icon: require("../../../Assets/Images/GalleryIcon.png"),
              showArrow: true,
              onPress: openGallery,
            },
            {
              label: "Remove Picture",
              icon: require("../../../Assets/Images/DeleteIcon.png"),
              showArrow: false,
              onPress: () => console.log("remove"),
            },
          ]}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 50 },
  // header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backIcon: { width: 22, height: 22, tintColor: "#000" },
  headerTitle: { fontSize: 20, fontWeight: "600", marginLeft: 10 },

  // profileSection: { flexDirection: "row", alignItems: "center", marginBottom: 20 },


  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },

  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  profileCircle: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  addBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,

    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  centerEditBadge: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],

  },


  profileLabel: { fontSize: 14, fontWeight: "700" },
  profileSub: { fontSize: 12, color: "#888", lineHeight: 17 },

  label: { marginTop: 15, fontSize: 14, color: "#000" },

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
    marginTop: 8,
  },

  submitBtn: {
    backgroundColor: "#1D5DFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
    marginBottom: 0
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
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
  // select: {
  //   height: 48,
  //   borderWidth: 1,
  //   borderColor: "#e1e1e1",
  //   borderRadius: 12,
  //   paddingHorizontal: 12,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginTop: 10
  // },
  dropdownMenu: {
    position: "absolute",
    top: 62,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 1000,

    maxHeight: 130,        // 🔥 increase
  },

  // dropdownMenu: {
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

  optionText: {
    fontSize: 15,
    color: "#000",
  },
  arrow: { width: 18, height: 18, tintColor: "#444" },
  profileImg: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
  },

  errText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },

  passwordInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
    paddingRight: 45,    // space for eye icon
    marginTop: 8,
  },

  eyeIconBox: {
    position: "absolute",
    right: 12,
    top: 20,
  },

  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: "#999",
  },
  centerWarning: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    display: "flex"
  },
  arrowIcon: {
    position: "absolute",
    right: 12,
    top: 14,
    width: 18,
    height: 18,
    tintColor: "#777",
  },
  fixedBtnWrapper: {
    paddingHorizontal: 0,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  arrowTouchable: {
    position: "absolute",
    right: 12,
    top: 14,
    // padding: 10,   // ✅ easy click area
    zIndex: 2000,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },

  countryCode: {
    fontSize: 15,
    color: "#000",
    marginRight: 8,
  },

  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
  },




});
