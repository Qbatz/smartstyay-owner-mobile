import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Keyboard } from "react-native";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { launchImageLibrary } from 'react-native-image-picker';
import ProfilePlaceholder from "../../../Assets/Images/userAdd.png";
import LeftArrow from "../../../Assets/Images/Arrow_left.png";
import plusIcon from "../../../Assets/Images/plusIcon.png";
import Edit from "../../../Assets/Images/edit.png";
import Eye from "../../../Assets/Images/Eye.png";
import EyeClose from "../../../Assets/Images/EyeIcon.png";
import { useGeneral } from "../../../Context/GeneralContext";
import SuccessModal from "../../../ToastFile/ToastPage"





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
      setStateSelected(editData.state || "Select State");
      setSelectedImage(editData.profilePic ? { uri: editData.profilePic } : null);
    }
  }, [editData]);
  // const handleSubmit = async () => {
  //   let newErrors = {};

  //   if (!firstName.trim()) newErrors.firstName = "Please Enter First Name";
  //   if (!mobile.trim()) newErrors.mobile = "Please Enter Mobile Number";
  //   if (!password.trim()) newErrors.password = "Please Enter Password";
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
  //   console.log("RES:", res);


  //   if (!res.success) {
  //     const errMsg =

  //       res.data.mobileStatus ||
  //       res.data.message ||
  //       "Something went wrong";

  //     setEmailError(res.data.emailStatus);
  //     setPhoneError(  res.data.mobileStatus)
  //     setModalType("error");
  //     // setShowSuccessModal(true);

  //     setTimeout(() => setShowSuccessModal(false), 2000);
  //     return;
  //   }

  //   setModalMessage("General Added Successfully");
  //   setModalType("success");
  //   setShowSuccessModal(true);

  //   await getAdminList();

  //   setTimeout(() => {
  //     setShowSuccessModal(false);
  //     navigation.goBack();
  //   }, 1500);
  // };
  // 1
  // const handleSubmit = async () => {
  //   let newErrors = {};

  //   if (!firstName.trim()) newErrors.firstName = "Please Enter First Name";
  //   if (!mobile.trim()) newErrors.mobile = "Please Enter Mobile Number";
  //   if (!password.trim()) newErrors.password = "Please Enter Password";
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
  //   console.log("ADD RESPONSE:", res);

  //   // 🔥 Handle API error safely 
  //   if (!res.success) {
  //     const apiError = res.data;

  //     if (apiError.emailStatus) setEmailError(apiError.emailStatus);
  //     if (apiError.mobileStatus) setPhoneError(apiError.mobileStatus);
  //     if (apiError.message) setTopWarning(apiError.message);

  //     return; 
  //   }


  //   setModalMessage("General Added Successfully");
  //   setModalType("success");
  //   setShowSuccessModal(true);

  //   await getAdminList();

  //   setTimeout(() => {
  //     setShowSuccessModal(false);
  //     navigation.goBack();
  //   }, 1500);
  // };

  const handleSubmit = async () => {
    let newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "Please Enter First Name";
    if (!mobile.trim()) newErrors.mobile = "Please Enter Mobile Number";
    if (!email.trim()) newErrors.email = "Please Enter Email ID";
    if (!password.trim()) newErrors.password = "Please Enter Password";
    if (!pincode.trim()) newErrors.pincode = "Please Enter Pincode";
    if (!city.trim()) newErrors.city = "Please Enter City";
    if (StateSelected === "Select State") newErrors.state = "Please Select State";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
      state: StateSelected,
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

    const res = await addGeneral(formData);
    console.log("ADD RESPONSE:", res);


    if (res.success === false) {
      const apiError = res.data;

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
  const hasChanges = () => {
    if (!editData) return true;

    return !(
      editData.firstName === firstName &&
      editData.lastName === lastName &&
      editData.mobileNo == mobile &&                 // ✔ fixed
      editData.mailId === email &&
      editData.houseNo === flat &&
      editData.street === street &&
      editData.landmark === landmark &&
      editData.city === city &&
      String(editData.pincode) === String(pincode) &&
      editData.state === StateSelected &&            // ✔ matches your API
      !selectedImage                                 // image unchanged
    );
  };
  const [topWarning, setTopWarning] = useState("");


  const handleUpdate = async () => {
    let newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "Please Enter First Name";
    if (!mobile.trim()) newErrors.mobile = "Please Enter Mobile Number";
    if (!email.trim()) newErrors.email = "Please Enter Email ID";
    if (!pincode.trim()) newErrors.pincode = "Please Enter Pincode";
    if (!city.trim()) newErrors.city = "Please Enter City";
    if (StateSelected === "Select State") newErrors.state = "Please Select State";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    if (!hasChanges()) {
      setTopWarning("No Changes Detected");
      setModalType("warning");



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
    state: StateSelected
  };

  const formData = new FormData();
  const jsonBase64 = btoa(JSON.stringify(payloadForApi));
console.log("payloadForApi",payloadForApi)
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

    if (res) {
      setModalMessage("General Updated Successfully");
      setModalType("success");
      setShowSuccessModal(true);

      await getAdminList();

      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.goBack();
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




  useEffect(() => {
    if (editData) {
      console.log("Editing user:", editData);
    }
  }, []);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [StateOpen, setStateOpen] = useState(false);
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!StateOpen}
          contentContainerStyle={{
            paddingBottom: keyboardOpen ? 0 : 0,
            flexGrow: keyboardOpen ? 0 : 1,
          }}
        >




          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={LeftArrow}
                style={styles.backIcon}
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Add General</Text>
          </View>


          <TouchableOpacity
            style={styles.profileSection}
            onPress={pickImage}
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




          <Text style={styles.label}>First Name  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Enter First name" value={firstName}
            onChangeText={(t) => {
              setFirstName(t);
              setErrors({ ...errors, firstName: "" });
            }} />
          {errors.firstName && (
            <Text style={styles.errText}>{errors.firstName}</Text>
          )}

          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} placeholder="Enter last Name" value={lastName}
            onChangeText={setLastName} />

          <Text style={styles.label}>Mobile Number  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>
          <TextInput style={styles.input} placeholder="+91" keyboardType="numeric" value={mobile}
            onChangeText={(t) => {
              const cleaned = t.replace(/[^0-9]/g, "").slice(0, 10);
              setMobile(cleaned);
              setErrors({ ...errors, mobile: "" });
              setPhoneError("")
            }} />
          {errors.mobile && (
            <Text style={styles.errText}>{errors.mobile}</Text>
          )}
          {phoneError !== "" && (
            <Text style={styles.errText}>{phoneError}</Text>
          )}

          <Text style={styles.label}>Email ID  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Enter Email" value={email}
            onChangeText={(t) => {
              setEmail(t);
              setErrors({ ...errors, email: "" });
              setEmailError("");
            }}
          />
          {emailError !== "" && (
            <Text style={styles.errText}>{emailError}</Text>
          )}
          {errors.email && (
            <Text style={styles.errText}>{errors.email}</Text>
          )}
          {!editData && (
            <>
              <Text style={styles.label}>Password  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>

              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter Password"
                  secureTextEntry={!showPassword}   // 👁 show / hide logic
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
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
                <Text style={styles.errText}>{errors.password}</Text>
              )}
            </>
          )}
          <Text style={styles.label}>Flat, House no, Building...</Text>
          <TextInput style={styles.input} placeholder="Enter House No" value={flat}
            onChangeText={setFlat} />

          <Text style={styles.label}>Area, Street, Sector...</Text>
          <TextInput style={styles.input} placeholder="Enter Street" value={street}
            onChangeText={setStreet} />

          <Text style={styles.label}>Landmark</Text>
          <TextInput style={styles.input} placeholder="Eg: Near SBI" value={landmark}
            onChangeText={setLandmark} />

          <Text style={styles.label}>Pincode  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Enter Pincode" value={pincode}
             onChangeText={(t) => {
    
    const cleaned = t.replace(/[^0-9]/g, "").slice(0, 6);
    setPincode(cleaned);
    setErrors({ ...errors, pincode: "" });
  }} />
          {errors.pincode && (
            <Text style={styles.errText}>{errors.pincode}</Text>
          )}

          <Text style={styles.label}>Town/City  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>
          <TextInput style={styles.input} placeholder="Enter City" value={city}
            onChangeText={(t) => {
              setCity(t);
              setErrors({ ...errors, city: "" });
            }} />
          {errors.city && (
            <Text style={styles.errText}>{errors.city}</Text>
          )}


          <Text style={styles.label}>State  <Text style={{ color: "red", fontWeight: "700" }}>*</Text></Text>

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
          </View>
          {errors.state && (
            <Text style={styles.errText}>{errors.state}</Text>
          )}



          {topWarning !== "" && (
            <Text style={styles.errText}>{topWarning}</Text>
          )}



          <TouchableOpacity style={styles.submitBtn}
            onPress={editData ? handleUpdate : handleSubmit}
          >
            <Text style={styles.submitText}>
              {loading ? "Saving..." : "Add General"}
            </Text>
          </TouchableOpacity>

          {errorMsg !== "" && (
            <Text style={{ color: "red", textAlign: "center", marginTop: 5 }}>
              {errorMsg}
            </Text>
          )}
          {/* {successMsg !== "" && (
    <Text style={{ color: "green", marginTop: 8 }}>{successMsg}</Text>
  )} */}



          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backIcon: { width: 22, height: 22, tintColor: "#000" },
  headerTitle: { fontSize: 20, fontWeight: "600", marginLeft: 10 },

  profileSection: { flexDirection: "row", alignItems: "center", marginBottom: 20 },

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
    backgroundColor: "#7B8CFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
    marginBottom: 70
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
    marginTop: 10
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


});
