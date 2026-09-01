import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

// import * as ImagePicker from "expo-image-picker";
import { launchImageLibrary } from "react-native-image-picker";

import BackIcon from "../../../Assets/Images/Arrow_left.png";
import UploadIcon from "../../../Assets/Images/upload.png";
import TickIcon from "../../../Assets/Images/check_switch.png";
import { CommonContexts } from "../../../Context/CommonContext";
import { BillContext } from "../../../Context/BillsContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import RemoveIcon from "../../../Assets/Images/remove.png";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function GlobalBillSettings({ onBack }) {

  const navigation = useNavigation();
  const route = useRoute();
  const { activeHostelId } = useContext(CommonContexts)
  const { getGlobalBillPdfDetail, postGlobalBilPdfDetails, deleteTemplateImage } = useContext(BillContext)
  const [logoCustomize, setLogoCustomize] = useState(false);
  const [contactCustomize, setContactCustomize] = useState(true);
  const [emailCustomize, setEmailCustomize] = useState(true);
  const [signCustomize, setSignCustomize] = useState(false);
  const [templateId, setTemplateId] = useState(null);

  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);

  const [originalLogo, setOriginalLogo] = useState(null); // API logo
  const [isLogoDeleted, setIsLogoDeleted] = useState(false); // mark delete

  const [isSignatureDeleted, setIsSignatureDeleted] = useState(false);

  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [message, setmessage] = useState("")
  const [errorType, setErrorType] = useState("")

  const [mobileError, setMobileError] = useState("")
  const [mailError, setMailError] = useState("")
  const [signError, setSignError] = useState("")


  useEffect(() => {

    getGlobalBillPdfDetail(activeHostelId).then(r => {
      console.log("billglobal", r)
      setMobile(r.data?.mobile)
      setEmail(r.data?.emailId)
      setUploadedLogo(r.data?.logo)
      setOriginalLogo(r.data?.logo)
      setSignatureImage(r.data?.signature)
      setLogoCustomize(r?.data?.isLogoCustomized)
      setEmailCustomize(r?.data?.isMailIdCustomized)
      setContactCustomize(r?.data?.isMobileCustomized)
      setSignCustomize(r?.data?.isSignatureCustomized)
      setTemplateId(r?.data?.templateId)
    })

  }, [])

  //  useEffect(() => {
  //   if (route.params?.signature !== undefined) {
  //     setSignatureImage(route.params.signature);
  //     setIsSignatureDeleted(false);
  //   }

  //   if (route.params?.isDeleted) {
  //     setSignatureImage(null);
  //     setIsSignatureDeleted(true);
  //   }
  // }, [route.params]);


  console.log("routes", route);
  console.log("signatureImage", signatureImage);




  /* ---------------- IMAGE PICK FUNCTION ---------------- */
  async function pickImage(setFunction) {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    console.log("images", result)

    if (!result.canceled) {
      setFunction(result.assets[0].uri);
    }
  }



  async function pickImage(setFunction) {
    const options = {
      mediaType: "photo",
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      console.log(response)
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setFunction(uri);
      }
    });
  }




  const handleDeleteLogo = async () => {
    if (uploadedLogo && uploadedLogo !== originalLogo) {
       setShowSuccessModal(true),
          setmessage("Logo deleted Successfully"),
          setErrorType("success")

        setTimeout(() => {
          setShowSuccessModal(false)
        }, 1000);
      // local
      setUploadedLogo(null);

    } else {
      const res = await deleteTemplateImage({
        hostelId: activeHostelId,
        templateId: templateId,
        type: "logo",
      });

      console.log("deletedlogo", res);


      if (res.success) {
        setShowSuccessModal(true),
          setmessage("Logo deleted Successfully"),
          setErrorType("success")

        setTimeout(() => {
          setShowSuccessModal(false)
        }, 1000);
        setUploadedLogo(null);
        setIsLogoDeleted(true);
      }
    }
  };



  /* ---------------- VALIDATION ---------------- */
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateMobile = (num) => num.length === 10;

  async function handleSave() {
    if (!validateMobile(mobile)) {
      setMobileError("Please enter valid 10 digit number")
      return;
    }

    console.log(mobile, 'bilmail')
    // if (!validateEmail(email)) {
    //   return Alert.alert("Invalid Email", "Please enter a valid email address");
    // }

    // Alert.alert("Success", "Changes Saved Successfully!");

    const payload = {
      hostelId: activeHostelId,
      mobile: mobile,
      email: email,
      isMobileCustomized: contactCustomize,
      isEmailCustomized: emailCustomize,
      isLogoCustomized: logoCustomize,
      isSignatureCustomized: signCustomize,
    };

    const formData = new FormData();

    //  const jsonBase64= btoa(JSON.stringify(requestBody))



    // formData.append("request", JSON.stringify(jsonBase64));

    //  

    console.log(uploadedLogo)
    if (uploadedLogo) {

      formData.append("hostelLogo", {
        uri: uploadedLogo,
        type: "image/jpeg",
        name: "hostelLogo.jpg",
      });
    }
    if (isSignatureDeleted) {
      payload.deleteSignature = true;
    }
    if (signatureImage) {
      formData.append("billSignature", {
        uri: signatureImage,
        type: "image/jpeg",
        name: "receiptSign.jpg",
      });
    }




    //   formData.append("request[invoicePhoneNumber]", mobile);
    // formData.append("request[invoiceMailId]", email);

    //    formData.append("receiptPhoneNumber", mobile);
    //   formData.append("invoiceMailId", email);


    const res = await postGlobalBilPdfDetails(activeHostelId, payload, formData)

    if (res.status == 200) {
      setShowSuccessModal(true),
        setmessage(res.data),
        setErrorType("success")

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 1000);
    } else {
      setShowSuccessModal(true),
        setmessage(res.message || "Not uploaded"),
        setErrorType("error")

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 1000);
    }
  }

  function handleReset() {
    setUploadedLogo(null);
    setSignatureImage(null);
    setMobile("");
    setEmail("");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F8FB", paddingTop: 40 }}>
      <SuccessModal visible={showSuccessModal} message={message} type={errorType} />
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Global Bill Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}>

        <Text style={styles.description}>
          Add your basic billing details here. These will appear on all invoices.
        </Text>

        <Text style={styles.fieldTitle}>Hostel / PG Logo</Text>
        <Text style={styles.fieldSubtitle}>This will appear in Bill Template</Text>

        <View style={styles.checkboxRow}>
          <CustomCheckbox value={logoCustomize} onChange={setLogoCustomize} />
          <Text style={styles.customizeText}>Customize in Specific Templates</Text>
        </View>

        <TouchableOpacity
          style={styles.uploadRow}
          onPress={() => pickImage(setUploadedLogo)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Image source={UploadIcon} style={styles.uploadIcon} />
            <View>
              <Text style={styles.uploadTitle}>Choose file  <Text style={styles.uploadSubtitle}>to Upload</Text></Text>

              <Text style={styles.uploadNote}>PNG Format (600px * 300px)</Text>
            </View>
          </View>

          {uploadedLogo && (
            <Image
              source={{ uri: uploadedLogo }}
              style={styles.logoPreview}
            />
          )}
          {uploadedLogo && (
            <TouchableOpacity onPress={handleDeleteLogo} style={styles.deleteIcon}>
              <Image source={RemoveIcon} style={{ width: 14, height: 14 }} />
            </TouchableOpacity>
          )}


        </TouchableOpacity>






        <Text style={styles.fieldTitle}>Contact Number</Text>

        <View style={styles.checkboxRow}>
          <CustomCheckbox value={contactCustomize} onChange={setContactCustomize} />
          <Text style={styles.customizeText}>Customize in Specific Templates</Text>
        </View>

        <View style={styles.phoneBox}>
          <Text style={styles.countryCode}>+91 ▾</Text>
          <TextInput
            style={styles.phoneInput}
            keyboardType="number-pad"
            value={mobile}
            placeholder="9876543210"
            maxLength={10}
            onChangeText={(val) => {
              setMobile(val.replace(/[^0-9]/g, ""))
              setMobileError("")
            }
            }
          />
        </View>
        {mobileError && <ErrorMessage message={mobileError} type="error" />}

        <Text style={[styles.fieldTitle, { marginTop: 15 }]}>Email Address</Text>

        <View style={styles.checkboxRow}>
          <CustomCheckbox value={emailCustomize} onChange={setEmailCustomize} />
          <Text style={styles.customizeText}>Customize in Specific Templates</Text>
        </View>

        <TextInput
          style={styles.input}
          value={email}
          placeholder="Enter mail address"
          keyboardType="email-address"
          onChangeText={(t) => {
            const noEmojis = t.replace(
              /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "");
            setEmail(noEmojis)
          }
          }
        />

        <Text style={styles.fieldTitle}>Digital Signature Upload</Text>
        <Text style={styles.fieldSubtitle}>Add a respected person's signature</Text>

        <View style={styles.checkboxRow}>
          <CustomCheckbox value={signCustomize} onChange={setSignCustomize} />
          <Text style={styles.customizeText}>Customize in Specific Templates</Text>
        </View>

        {/* <TouchableOpacity
          style={styles.signatureBox}
          onPress={() => {
            pickImage(setSignatureImage)
            setSignError("")
          }}
        >
          {signatureImage ? (
            <Image source={{ uri: signatureImage }} style={styles.signaturePreview} />
          ) : (
            <Text style={styles.signaturePlaceholder}>Upload Signature</Text>
          )}
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.signatureBox}
          onPress={() =>
            navigation.navigate("SignatureUpload", {
              signature: signatureImage,
              templateId: templateId,
              onGoBack: (data) => {
                if (data?.signature === null) {
                  setSignatureImage(null);
                  setIsSignatureDeleted(true); // ✅ IMPORTANT
                } else {
                  setSignatureImage(data?.signature);
                  setIsSignatureDeleted(false);
                }
              },
            })
          }
        >
          {/* {signatureImage ? (
    <Image source={{ uri: signatureImage }} style={styles.signaturePreview} />
  ) : (
    <Text style={styles.signaturePlaceholder}>Tap to Sign</Text>
  )} */}
          {signatureImage ? (
            <Image
              source={{
                uri: signatureImage.startsWith("data:image")
                  ? signatureImage // base64
                  : signatureImage, // normal uri
              }}
              style={styles.signaturePreview}
            />
          ) : (
            <Text style={styles.signaturePlaceholder}>Tap to Sign</Text>
          )}

        </TouchableOpacity>
        {signError && <ErrorMessage message={signError} type="error" />}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >


          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SignatureUpload", {
                signature: signatureImage,
                templateId: templateId,
                onGoBack: (data) => {
                  if (data?.signature === null) {
                    setSignatureImage(null);
                    setIsSignatureDeleted(true);
                  } else {
                    setSignatureImage(data?.signature);
                    setIsSignatureDeleted(false);
                  }
                },
              })
            }
          >
            <Text style={styles.footerClear}>Choose file to Upload</Text>
          </TouchableOpacity>

          <View style={styles.signatureActions}>
            <TouchableOpacity onPress={() => setSignatureImage(null)}>
              <Text style={styles.footerClear}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!signatureImage) {
                  setSignError("Please upload a signature first");
                  // Alert.alert("Success", "Signature uploaded!");
                } else {
                  setSignError("")
                }
              }}
            >
              <Text style={styles.footerDone}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomActionRow}>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetBtn}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveBtn}>Save Changes</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const CustomCheckbox = ({ value, onChange }) => (
  <TouchableOpacity
    onPress={() => onChange(!value)}
    style={[styles.checkboxBase, value && styles.checkboxChecked]}
  >
    {value && <Image source={TickIcon} style={{ width: 14, height: 14, tintColor: "#fff" }} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backIcon: { width: 22, height: 22, marginRight: 10 },
  headerTitle: { fontSize: 22, fontWeight: "700" },

  description: { color: "#616161", fontSize: 14, marginBottom: 10 },

  fieldTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  fieldSubtitle: { color: "#9C9C9C", fontSize: 12 },

  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  customizeText: { color: "#1E45E1", marginLeft: 10 },

  checkboxBase: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#C8C8C8",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#3562FF", borderColor: "#3562FF" },

  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    padding: 18,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    position: 'relative'
  },
  uploadIcon: { width: 25, height: 25, marginRight: 15 },
  uploadTitle: { color: "#3562FF", fontWeight: "600", fontSize: 15 },
  uploadSubtitle: { color: "#777", marginLeft: 8 },
  uploadNote: { color: "#9A9A9A", fontSize: 12 },

  logoPreview: {
    width: 70,
    height: 70,
    borderRadius: 10,
    resizeMode: "contain",
    marginLeft: 10,
  },

  previewImage: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },

  phoneBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    height: 50,
    paddingHorizontal: 12,
    marginBottom: 3,
  },
  countryCode: { marginRight: 12, fontSize: 16 },
  phoneInput: { flex: 1, fontSize: 16 },

  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  signatureBox: {
    height: 140,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D9D9D9",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginBottom: 3,
  },
  signaturePlaceholder: {
    fontSize: 20,
    color: "#6AA0FF",
    fontStyle: "italic",
  },
  signaturePreview: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
  },

  signatureActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginBottom: 20, marginTop: 8
  },

  footerClear: { color: "#444", fontSize: 14 },
  footerDone: { color: "#3562FF", fontSize: 15, fontWeight: "700" },

  bottomActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 20,
  },
  resetBtn: {
    color: "#fff",
    backgroundColor: "red",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    fontWeight: "700",
  },
  saveBtn: {
    color: "#fff",
    backgroundColor: "#3562FF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    fontWeight: "700",
  },
  deleteIcon: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    padding: 4,
    elevation: 3,
  },
});
