import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView
} from "react-native";

import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import DownloadIcon from "../../../Assets/Images/upload.png";

export default function RentalAgreement({ onBack }) {
  const editorRef = useRef();

  return (
    <View style={styles.container}>
      
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Rental Agreement</Text>

        <TouchableOpacity style={styles.downloadBtn}>
          <Image source={DownloadIcon} style={{ width: 22, height: 22 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.editorBox}>

        <RichToolbar
          editor={editorRef}
          style={styles.toolbar}
          iconTint="#4A4A4A"
          selectedIconTint="#3562FF"
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.setStrikethrough,
            actions.setFontSize,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.heading1,
            actions.heading2,
            actions.heading3,
            actions.heading4,
            actions.heading5,
          ]}
          iconMap={{
            [actions.heading1]: () => <Text style={styles.hBtn}>H1</Text>,
            [actions.heading2]: () => <Text style={styles.hBtn}>H2</Text>,
            [actions.heading3]: () => <Text style={styles.hBtn}>H3</Text>,
            [actions.heading4]: () => <Text style={styles.hBtn}>H4</Text>,
            [actions.heading5]: () => <Text style={styles.hBtn}>H5</Text>,
          }}
        />

        <RichEditor
          ref={editorRef}
          placeholder="Edit your agreement…"
          initialHeight={450}
          editorStyle={{
            backgroundColor: "#F6F8FF",
            padding: 16,
            color: "#000",
          }}
          initialContentHTML={`
            <p><strong>Tenant Name:</strong> Rajkumar M</p>
            <p><strong>Hostel Address:</strong> Ground Floor</p>
            <p><strong>Room No:</strong> 103, 3-Bed Sharing</p>
            <p><strong>Advance Paid:</strong> ₹20,000</p>
            <p><strong>Monthly Rent:</strong> ₹8,000</p>
            <p><strong>Rent Due Date:</strong> 5th of Every Month</p>
            <p><strong>Tenant’s Occupation:</strong> HCL Technologies</p>

            <h3>Terms & Conditions:</h3>
            <ol>
              <li>Tenant must pay the rent before 5th of every month.</li>
              <li>Advance amount refundable after checkout.</li>
              <li>Maintain cleanliness of the room.</li>
              <li>Violation of rules may lead to cancellation.</li>
              <li>Management may revise terms anytime.</li>
            </ol>
          `}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 20 , paddingTop:40 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between",
  },

  backIcon: { width: 22, height: 22 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#000" },

  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },

  editorBox: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#D8E5FF",
    backgroundColor: "#F6F8FF",
    overflow: "hidden",
  },

  toolbar: {
    backgroundColor: "#EDF2FF",
    borderBottomColor: "#D8E5FF",
    borderBottomWidth: 1,
  },

  hBtn: {
    fontWeight: "700",
    fontSize: 14,
    marginHorizontal: 6,
  },
});
