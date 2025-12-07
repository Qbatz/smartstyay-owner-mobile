import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

const EditIcon = require("../../../Assets/Images/edit.png");
const UploadIcon = require("../../../Assets/Images/upload.png");

export default function SecurityDepositTemplate() {
  const [contactNumber, setContactNumber] = useState("9876543210");
  const [email, setEmail] = useState("sriramkumar@gmail.com");

  const [prefix, setPrefix] = useState("Inv");
  const [suffix, setSuffix] = useState("001");
  const previewInvoice = `${prefix}${suffix}`;

  const [tax, setTax] = useState("12");

  const [notes, setNotes] = useState(
    `"Your comfort is our priority – See you again at Smart Stay!"`
  );
  const [terms, setTerms] = useState(
    "Tenants must pay all dues on or before the due date, maintain cleanliness, and follow PG rules; failure may lead to penalties or termination of stay."
  );

  const [logoUri, setLogoUri] = useState(null);
  const [qrUri, setQrUri] = useState(null);

  const presetColors = ["#1E45E1", "#3562FF", "#FF6B6B", "#34C759", "#FFB800"];
  const [selectedColor, setSelectedColor] = useState("#1E45E1");

  const pickImage = async (setter) => {
    const res = await launchImageLibrary({ mediaType: "photo" });
    if (res?.assets?.[0]?.uri) setter(res.assets[0].uri);
  };

  return (
   
    <View style={{ flex: 1,   position: "relative"  }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 150 }}>

        {/* SECTION TITLE */}
        <Text style={styles.sectionTitle}>Inherited Global Details</Text>

        {/* CONTACT NUMBER */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Contact Number</Text>
            <Image source={EditIcon} style={styles.iconSmall} />
          </View>

          <View style={styles.row}>
            <View style={styles.countryBox}>
              <Text style={styles.countryText}>+91</Text>
            </View>

            <TextInput
              style={styles.lightInput}
              value={contactNumber}
              keyboardType="number-pad"
              maxLength={10}
              onChangeText={(t) => setContactNumber(t.replace(/\D/g, ""))}
            />
          </View>
        </View>

        {/* EMAIL */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>E-Mail Address</Text>
            <Image source={EditIcon} style={styles.iconSmall} />
          </View>

          <TextInput
            style={styles.lightInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>


{/* LOGO UPLOAD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Hostel/PG Logo</Text>
               <Image source={EditIcon} style={styles.iconSmall} />
          </View>

          <View style={styles.logoBox}>
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={styles.logoPreview} />
            ) : (
              <Image source={UploadIcon} style={styles.uploadIcon} />
            )}
             <TouchableOpacity onPress={() => pickImage(setLogoUri)}>
              <Text style={[styles.linkText, { color: selectedColor }]}>Choose file</Text>
            </TouchableOpacity>
            <Text style={styles.smallNote}>Must be PNG (600 × 300)</Text>
          </View>
        </View>

<View style={styles.card}>
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
</View>

        {/* FORM SPECIFIC */}
        <Text style={styles.sectionTitle}>Form Specific Details</Text>
        <Text style={styles.sectionSub}>Fill the form with details you'd like to customize.</Text>

        {/* INVOICE */}
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

        {/* PG TAX PAYABLE */}
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
{/* ---------------- ACCOUNT DETAILS (BANK LIST) ---------------- */}
<View style={styles.card}>
  <View style={styles.bankHeaderRow}>
    <Text style={styles.boxTitle}>Account Details</Text>

    <TouchableOpacity style={styles.addBankBtn}>
      <Text style={styles.addBankText}>Add</Text>
    </TouchableOpacity>
  </View>

  <View style={styles.divider} />

  {/* SCROLLABLE BANK LIST */}
  <View style={{ maxHeight: 200 }}>
    <ScrollView showsVerticalScrollIndicator>
      {[
        { id: 1, name: "Bank Name", holder: "test" },
        { id: 2, name: "Bank Name", holder: "test" },
        { id: 3, name: "SBI", holder: "test" },
      ].map((item) => (
        <TouchableOpacity key={item.id} style={styles.bankRow}>
          
          {/* Radio */}
          <View style={styles.radioOuter}>
            <View style={styles.radioInner} />
          </View>

          {/* Icon */}
          <View style={styles.bankIconCircle}>
            <Image
              source={require("../../../Assets/Images/bank.png")}
              style={styles.bankIcon}
            />
          </View>

          {/* Labels */}
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.bankName}>{item.name}</Text>
            <Text style={styles.bankSub}>{item.holder} / Savings A/C</Text>
          </View>

        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
</View>





        

        {/* NOTES */}
        <View style={styles.card}>
          <Text style={styles.boxTitle}>Notes</Text>

          <Text style={styles.label}>Add Notes</Text>

          <View style={styles.notesBox}>
            <TextInput
              multiline
              value={notes}
              onChangeText={setNotes}
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
          <Text style={styles.boxTitle}>Template Theme</Text>

          <View style={styles.colorRow}>
            <View style={[styles.themePreview, { backgroundColor: selectedColor }]} />
            <Text style={{ marginLeft: 10, color: "#555" }}>{selectedColor}</Text>
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

      </ScrollView>

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

});

