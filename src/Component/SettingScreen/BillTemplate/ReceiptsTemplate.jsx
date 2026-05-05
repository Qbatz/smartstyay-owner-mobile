import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { CommonContexts } from "../../../Context/CommonContext";
import { BillContext } from "../../../Context/BillsContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import ColorPicker, { HueSlider, OpacitySlider, Panel1 } from "reanimated-color-picker";
import { runOnJS } from "react-native-reanimated";
import tinycolor from "tinycolor2"
import QuestionMarkHelp from "../../../Assets/Images/QuestionMarkHelp.png"


const EditIcon = require("../../../Assets/Images/edit.png");
const UploadIcon = require("../../../Assets/Images/upload.png");

export default function ReceiptTemplate({onChange}) {
  const { activeHostelId } = useContext(CommonContexts)
  const { getGlobalBillPdfDetail, postGlobalBilPdfDetails } = useContext(BillContext)
  const [contactNumber, setContactNumber] = useState("9876543210");
  const [email, setEmail] = useState("sriramkumar@gmail.com");

  const [logoCustomize, setLogoCustomize] = useState(false);
  const [contactCustomize, setContactCustomize] = useState(false);
  const [emailCustomize, setEmailCustomize] = useState(false);
  const [signCustomize, setSignCustomize] = useState(false);

  const [globalMobileNo, setGlobalMobileNo] = useState("");
  const [globalEmailId, setGlobalEmailId] = useState("")

  const [prefix, setPrefix] = useState("Inv");
  const [suffix, setSuffix] = useState("001");
  const previewInvoice = `${prefix}${suffix}`;

  const [tax, setTax] = useState("");
  const [typeId, setTypeId] = useState("")

  const [receiptNotes, setReceiptNotes] = useState(
    `"Your comfort is our priority – See you again at Smart Stay!"`
  );
  const [terms, setTerms] = useState(
    "Tenants must pay all dues on or before the due date, maintain cleanliness, and follow PG rules; failure may lead to penalties or termination of stay."
  );

  const [logoUri, setLogoUri] = useState(null);
  const [qrUri, setQrUri] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);

  const presetColors = ["#1E45E1", "#3562FF", "#FF6B6B", "#34C759", "#FFB800"];
  const [selectedColor, setSelectedColor] = useState("#1E45E1");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [message, setmessage] = useState("")
  const [errorType, setErrorType] = useState("")


const [color,setColor]=useState({hex: "#E0911D",r: 224,g: 145,b: 29,a: 1,})

const [isEditable,setIsEditable]=useState(false)
    const [editPopup,setEditPopUp]=useState(false)

  useEffect(() => {

    getGlobalBillPdfDetail(activeHostelId).then(r => {
      console.log(r)
      setContactNumber(r?.data?.templates[1]?.receiptMobileNumber || r.data?.mobile)
      setEmail(r?.data?.templates[1]?.receiptMailId || r.data?.emailId)
      setLogoUri(r?.data?.templates[1]?.receiptLogoUrl)
      setSignatureImage(r?.data?.templates[1]?.receiptSignatureUrl)
      setColor()
      setLogoCustomize(r?.data?.isLogoCustomized)
      setEmailCustomize(r?.data?.isMailIdCustomized)
      setContactCustomize(r?.data?.isMobileCustomized)
      setSignCustomize(r?.data?.isSignatureCustomized)

      const apiColor = r?.data?.templates[1]?.receiptTemplateColor;

      setColor(parseRGBA(apiColor));

      // setPrefix(r?.data?.templates[1]?.prefix || null)
      // setSuffix(r?.data?.templates[1]?.suffix || null)

      setReceiptNotes(r?.data?.templates[1]?.receiptNotes || null)
      setTerms(r?.data?.templates[1]?.receiptTermsAndCondition || null)
      setTypeId(r?.data?.templates[1]?.typeId)

      setGlobalMobileNo(r.data?.mobile)
      setGlobalEmailId(r.data?.emailId)
    })

  }, [])

   const parseRGBA = (rgbaString) => {
      if (!rgbaString) return null;
  
      const tc = tinycolor(rgbaString);
      const rgb = tc.toRgb();
  
      return {
        hex: tc.toHexString(),
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: rgb.a,
      };
    };

  useEffect(() => {
    const data = {
      contactNumber,email,receiptNotes,terms,logoUri,
      qrUri,signatureImage,color,
    };
  
    onChange && onChange(data);
  }, [
    contactNumber,email,receiptNotes,terms,logoUri,qrUri,signatureImage,
    color,
  ]);

  const pickImage = async (setter) => {
    const res = await launchImageLibrary({ mediaType: "photo" });
    if (res?.assets?.[0]?.uri) setter(res.assets[0].uri);
  };


  const handleSaveTemplate = async () => {


    const queryPayload = {
      hostelId: activeHostelId,
      mobile: globalMobileNo,
      email: globalEmailId,
      isMobileCustomized: contactCustomize,
      isEmailCustomized: emailCustomize,
      isLogoCustomized: logoCustomize,
      isSignatureCustomized: signCustomize,
    }

    const payload = {
      templateTypeId: typeId,
      receiptNotes: receiptNotes,
      receiptTermsAndCondition: terms,
      receiptTemplateColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a })`,
      receiptPhoneNumber: contactNumber,
      receiptMailId: email,
    }

    const formData = new FormData();

    const jsonBase64 = btoa(JSON.stringify(payload));

    formData.append("request", {
      uri: "data:application/json;base64," + jsonBase64,
      type: "application/json",
      name: "payload.json",
    });

    if (logoUri) {
      formData.append("receiptLogo", {
        uri: logoUri,
        type: "image/jpeg",
        name: "receiptLogo.jpg",
      });
    }

    if (signatureImage) {
      formData.append("receiptSign", {
        uri: signatureImage,
        type: "image/jpeg",
        name: "receiptSign.jpg",
      });
    }



    const res = await postGlobalBilPdfDetails(activeHostelId, queryPayload, formData)


    if (res.status === 200) {
      setShowSuccessModal(true)
      setmessage(res.data || "updated Successfully")
      setErrorType("success")

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 1000);
    } else {
      setShowSuccessModal(true)
      setmessage(res.message || "Not uploaded"),
        setErrorType("error")

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 1000);
    }
  }

  const Box = ({ label, value }) => (
    <View style={{marginTop:10,alignItems:'center'}}>
      <View style={styles.box}>
         <Text style={styles.boxValue}>{value}</Text>
      </View>
     
      <Text style={styles.boxLabel}>{label}</Text>
    </View>
  );
  
  const handleColorChange = (c) => {
    const tc = tinycolor(c.hex);
    const rgb = tc.toRgb();
  
    const alpha = c?.alpha ?? rgb.a ?? 1; // ✅ define it
    setColor({
      hex: c.hex,
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      a: Math.round(alpha * 100),
      // Math.round(c.alpha * 100),
    });
  };
  

  return (

    <View style={{ flex: 1, position: "relative" }}>
      <SuccessModal visible={showSuccessModal} message={message} type={errorType} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 150 }}>

        {/* SECTION TITLE */}
        <Text style={styles.sectionTitle}>Inherited Global Details</Text>

        {/* CONTACT NUMBER */}

        {
          contactCustomize && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Contact Number</Text>
                <TouchableOpacity onPress={()=>setEditPopUp(true)}>
                    <Image source={EditIcon} style={styles.iconSmall} />
                </TouchableOpacity>              
              </View>

              <View style={styles.row}>
                <View style={styles.countryBox}>
                  <Text style={styles.countryText}>+91</Text>
                </View>

                <TextInput
                  style={styles.lightInput}
                  value={contactNumber}
                  editable={isEditable}
                  keyboardType="number-pad"
                  maxLength={10}
                  onChangeText={(t) => setContactNumber(t.replace(/\D/g, ""))}
                />
              </View>
            </View>

          )
        }


        {/* EMAIL */}

        {
          emailCustomize && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>E-Mail Address</Text>
                <TouchableOpacity onPress={()=>setEditPopUp(true)}>
                    <Image source={EditIcon} style={styles.iconSmall} />
                </TouchableOpacity>  
              </View>

              <TextInput
                style={styles.lightInput}
                value={email}
                editable={isEditable}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
          )
        }



        {/* LOGO UPLOAD */}

        {
          logoCustomize && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Hostel/PG Logo</Text>
                <TouchableOpacity onPress={()=>setEditPopUp(true)}>
                    <Image source={EditIcon} style={styles.iconSmall} />
                </TouchableOpacity>  
              </View>

              <View style={styles.logoBox}>
                {logoUri ? (
                  <Image source={{ uri: logoUri }} style={styles.logoPreview} />
                ) : (
                  <Image source={UploadIcon} style={styles.uploadIcon} />
                )}
                <TouchableOpacity onPress={() => pickImage(setLogoUri)} disabled={!isEditable}>
                  <Text style={[styles.linkText, { color: selectedColor }]}>Choose file</Text>
                </TouchableOpacity>
                <Text style={styles.smallNote}>Must be PNG (600 × 300)</Text>
              </View>
            </View>
          )
        }


        {/* ---upload Signature-- */}

        {
          signCustomize && (
            <View>
              <Text style={styles.fieldTitle}>Digital Signature Upload</Text>

              <TouchableOpacity
                style={styles.signatureBox}
                onPress={() => pickImage(setSignatureImage)}
              disabled={!isEditable}>
                {signatureImage ? (
                  <Image source={{ uri: signatureImage }} style={styles.signaturePreview} />
                ) : (
                  <Text style={styles.signaturePlaceholder}>Upload Signature</Text>
                )}
              </TouchableOpacity>
            </View>
          )
        }


        {/* <View style={styles.card}>
    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
  <Text style={styles.boxTitle}>Upload QR</Text>
 <Image source={EditIcon} style={styles.iconSmall} />
 </View>
  <View style={styles.divider} />

  <Text style={styles.smallNote}>Valid UPI QR Code for Payment Easy</Text>

  <TouchableOpacity style={styles.qrUploadBox} onPress={() => pickImage(setQrUri)}>
    {qrUri ? (
      <Image source={{ uri: qrUri }} style={styles.qrUploadedImage} />
    ) : (
      <View style={{ alignItems: "center" }}>
        <Image source={UploadIcon} style={styles.uploadIconBlue} />

        <View style={{ flexDirection: "row", marginTop: 4 }}>
          <Text style={styles.blueLink}>Choose file</Text>
          <Text style={{ color: "#6B7280" }}> to Upload</Text>
        </View>

        <Text style={styles.qrNote}>JPG SVG PNG (150px × 150px)</Text>
      </View>
    )}
  </TouchableOpacity>
</View> */}

        {/* <Text style={styles.sectionTitle}>Form Specific Details</Text>
        <Text style={styles.sectionSub}>Fill the form with details you'd like to customize.</Text>

        <View style={styles.card}>
          <Text style={styles.boxTitle}>Invoice No</Text>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Prefix</Text>
              <TextInput style={styles.whiteInput} value={prefix} onChangeText={setPrefix} />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Suffix</Text>
              <TextInput style={styles.whiteInput} value={suffix} onChangeText={setSuffix} />
            </View>
          </View>

          <Text style={[styles.label, { marginTop: 10 }]}>Preview</Text>
          <View style={styles.lightInput}>
            <Text style={styles.previewText}>{previewInvoice}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.boxTitle}>PG Tax Payable</Text>
          <Text style={styles.label}>Add the Tax payable GST in Percentage %</Text>

          <TextInput
            style={styles.whiteInput}
            value={tax}
            keyboardType="numeric"
            onChangeText={(t) => setTax(t.replace(/\D/g, ""))}
          />
        </View>
<View style={styles.card}>
  <View style={styles.bankHeaderRow}>
    <Text style={styles.boxTitle}>Account Details</Text>

    <TouchableOpacity style={styles.addBankBtn}>
      <Text style={styles.addBankText}>Add</Text>
    </TouchableOpacity>
  </View>

  <View style={styles.divider} />

  <View style={{ maxHeight: 200 }}>
    <ScrollView showsVerticalScrollIndicator>
      {[
        { id: 1, name: "Bank Name", holder: "test" },
        { id: 2, name: "Bank Name", holder: "test" },
        { id: 3, name: "SBI", holder: "test" },
      ].map((item) => (
        <TouchableOpacity key={item.id} style={styles.bankRow}>
          
          <View style={styles.radioOuter}>
            <View style={styles.radioInner} />
          </View>

          <View style={styles.bankIconCircle}>
            <Image
              source={require("../../../Assets/Images/bank.png")}
              style={styles.bankIcon}
            />
          </View>

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.bankName}>{item.name}</Text>
            <Text style={styles.bankSub}>{item.holder} / Savings A/C</Text>
          </View>

        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
</View> */}



        <Text style={{ fontSize: 16.7, fontFamily: 'Gilroy-Semibold', marginTop: 18 }}>Form Specific Detials</Text>

        <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 13, color: '#9C9C9C', marginTop: 10 }}>Fill the form with details you'd like customize</Text>



        {/* NOTES */}
        <View style={styles.card}>
          <Text style={styles.boxTitle}>Notes</Text>

          <Text style={styles.label}>Add Notes</Text>

          <View style={styles.notesBox}>
            <TextInput
              multiline
              value={receiptNotes}
              onChangeText={setReceiptNotes}
              style={styles.notesInput}
            />
          </View>
        </View>

        {/* TERMS & CONDITION */}
        <View style={styles.card}>
          <Text style={styles.boxTitle}>Terms & Condition</Text>

          <Text style={styles.label}>Add T&C</Text>

          <View style={styles.notesBox}>
            <TextInput
              multiline
              value={terms}
              onChangeText={setTerms}
              style={styles.notesInput}
            />
          </View>
        </View>

        {/* THEME */}
        <View style={styles.card}>
          <Text style={[styles.boxTitle,{marginBottom:20}]}>Template Theme</Text>

          {/* <View style={styles.colorRow}>
            <View style={[styles.themePreview, { backgroundColor: selectedColor }]} />
            <Text style={{ marginLeft: 10, color: "#555" }}>{selectedColor}</Text>
          </View> */}

          <ColorPicker
           key={color.hex}
          value={color.hex}
          onComplete={(c)=>{
            'worklet';

           
            runOnJS(handleColorChange)(c);
          }}
          >
            <Panel1 style={{ height: 180,borderRadius: 12,}}/>

            <HueSlider style={{ marginTop: 12,}}/>

            <OpacitySlider style={{ marginTop: 12,}}/>
          
          </ColorPicker>

          

          <View style={{ flexDirection: "row",justifyContent: "space-between",marginTop: 15,}}>
              <Box label="Hex" value={color.hex}/>
              <Box label="R" value={color.r}/>
              <Box label="G" value={color.g}/>
              <Box label="B" value={color.b}/>
              <Box label="A" value={color.a}/>
          </View>

          <View style={styles.swatchContainer}>
            {presetColors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.swatch, { backgroundColor: c }]}
                onPress={() => setSelectedColor(c)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity onPress={handleSaveTemplate}
          style={{ alignSelf: 'flex-end', marginTop: 20, padding: 15, backgroundColor: '#2044e2', borderRadius: 8 }}>
          <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold', color: '#ffffff' }}>Save Template</Text>
        </TouchableOpacity>

      </ScrollView>

       <Modal 
                  visible={editPopup}
                  transparent={true}
                  animationType="fade">
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:"rgba(0,0,0,0.5)"}}>
                        <View style={{backgroundColor: "#fff",borderRadius: 12,padding: 20,marginHorizontal:15}}>
                        
                        <View style={{flexDirection:'row'}}>
                          <Image source={QuestionMarkHelp} style={{width:22,height:22}} />
                          <Text style={{fontSize:16,fontFamily:'Gilroy-Semibold',marginLeft:5}}>Override Global Value</Text>
                        </View>
            
                        <Text style={{fontSize:13,fontFamily:'Gilroy-Regular',marginTop:15,lineHeight:22}}>
                          You're changing this field only for this bill. It won't affect the main settings</Text>
            
                           <View style={{alignSelf:'flex-end',flexDirection:'row',alignItems:'center',marginTop:18}}>
                            <TouchableOpacity onPress={()=>setEditPopUp(false)}
                            style={{padding:12,borderWidth:1,borderRadius:10,marginRight:5}}>
                                <Text style={{fontFamily:'Gilroy-Semibold',fontSize:13,color:'#6F6C8F'}}>Cancel</Text>
                            </TouchableOpacity>
            
                            <TouchableOpacity onPress={()=>{
                              setIsEditable(true)
                              setEditPopUp(false)}}
                            style={{padding:12,borderRadius:10,backgroundColor:'#1E45E1',marginLeft:5}}> 
                                <Text style={{fontFamily:'Gilroy-Semibold',fontSize:13,color:'#FFFFFF'}}>Edit Anyway</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                  </Modal>

      {/* STICKY PREVIEW BUTTON */}
      {/* <TouchableOpacity style={styles.previewBtn }>
        <Text style={styles.previewBtnText}>Preview</Text>
      </TouchableOpacity>
     */}
    </View>




  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 14 },
  sectionSub: { color: "#666", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 14,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  cardLabel: { fontWeight: "600", fontSize: 14 },
  iconSmall: { width: 18, height: 18, tintColor: "#666" },

  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  col: { flex: 1 },

  countryBox: {
    backgroundColor: "#E8EDFF",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  countryText: { fontWeight: "700" },

  lightInput: {
    flex: 1,
    backgroundColor: "#E8EDFF",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  whiteInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },

  previewText: { fontWeight: "600", fontSize: 15 },

  logoBox: { alignItems: "center", marginTop: 14 },
  logoPreview: { width: 140, height: 70, resizeMode: "contain" },
  uploadIcon: { width: 40, height: 40, tintColor: "#999" },
  smallNote: { fontSize: 12, color: "#666", marginTop: 6 },
  linkText: { fontWeight: "600" },

  fieldTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
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
    marginBottom: 10,
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

  notesBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    minHeight: 90,
    flexDirection: "row",
  },

  notesInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    textAlignVertical: "top",
  },

  notesEditIcon: {
    width: 20,
    height: 20,
    tintColor: "#666",
    marginLeft: 6,
    marginTop: 6,
  },

  colorRow: { flexDirection: "row", marginTop: 12, alignItems: "center" },

  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  swatchContainer: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 14,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  qrBox: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  qrPreview: { width: 80, height: 80 },

  previewBtn: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 85,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#1E45E1",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  previewBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  /* BANK LIST */
  bankHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addBankBtn: {
    backgroundColor: "#1E45E1",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addBankText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1E45E1",
  },

  bankIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1E45E1",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  bankIcon: { width: 22, height: 22, tintColor: "#fff" },

  bankName: { fontSize: 14, fontWeight: "600", color: "#111" },
  bankSub: { fontSize: 12, color: "#6B7280" },

  /* QR UPLOAD */
  qrUploadBox: {
    marginTop: 14,
    backgroundColor: "#F8F9FB",
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  qrNote: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  blueLink: { color: "#1E45E1", fontWeight: "600" },

  uploadIconBlue: {
    width: 40,
    height: 40,
    tintColor: "#1E45E1",
  },
  qrUploadedImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  box: {
    backgroundColor: "#eee",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  boxValue: {
    fontWeight: "bold",
  },
  boxLabel: {
    fontSize: 12,
    color: "#666",
    marginTop:4
  },

});

