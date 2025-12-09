import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import HostelImage from "../../../Assets/Images/Hostel_Image.png";
import QRCode from "../../../Assets/Images/pdfImage/QRimg.png";
import SigantureIcon from "../../../Assets/Images/signature.png";
import PaytmIcon from "../../../Assets/Images/pdfImage/Paytmimg.png";
import GooglePayIcon from "../../../Assets/Images/pdfImage/GPayimg.png";
import PhonepeIcon from "../../../Assets/Images/pdfImage/PhonepeImg.png";

const NOCBillPdf = ({ route }) => {
  const { pdfDetails } = route.params || {};
  const receiptname = "PaymentReceipt";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.receiptCard}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={HostelImage} style={styles.logo} />
          <View>
            <Text style={styles.hostelName}>Annai Hostel</Text>
            <Text style={styles.address}>
              7/96, main road, Athisayapuram, Tenkasi, Tamilnadu-627861
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            marginTop: 20,
            marginBottom: 15,
          }}
        >
          <Text style={styles.title}>Final Settlement Invoice</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.sectionHeader}>Bill to:</Text>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Tenant Name :</Text>
              <Text style={styles.value}>Muthuraja M</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Mobile No :</Text>
              <Text style={styles.value}>8564786274</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Room No :</Text>
              <Text style={styles.value}>G 103-02</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Address :</Text>
              <Text style={[styles.value, { flex: 1 }]}>
                9, 8th Main Rd, Someshwara Nagar, Bengaluru, Karnataka 560011
              </Text>
            </View>
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Invoice :</Text>
              <Text style={styles.value}>#RSIN001</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Invoice Date :</Text>
              <Text style={styles.value}>29 Aug 2025</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Due Date :</Text>
              <Text style={styles.value}>31 Aug 2025</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Rental Period :</Text>
              <Text style={[styles.value, { color: "#1E45E1" }]}>46 days</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>

          <View style={styles.summaryTable}>
            <View style={[styles.summaryRow, styles.summaryHeader]}>
              <Text style={[styles.summaryCell, { flex: 1, fontWeight:800 }]}>Refund</Text>
              <Text
                style={[styles.summaryCell, { flex: 1, textAlign: "right" , fontWeight:800 }]}
              >
                AMOUNT / INR
              </Text>
              <Text style={[styles.summaryCell, { flex: 1 , paddingLeft:15 , fontWeight:800 }]}>Deductions</Text>
              <Text
                style={[styles.summaryCell, { flex: 1, textAlign: "right" , fontWeight:800 }]}
              >
                AMOUNT / INR
              </Text> 
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryCell, { flex: 1 }]}>SETTLEMENT</Text>
              <Text
                style={[styles.summaryCell, { flex: 1, textAlign: "right" }]}
              >
                ₹ 3584
              </Text>
              <Text style={[styles.summaryCell, { flex: 1 , paddingLeft:15}]}>Total</Text>
              <Text
                style={[styles.summaryCell, { flex: 1, textAlign: "right" }]}
              >
                ₹ 0
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.totalSummaryRow]}>
              <Text
                style={[
                  styles.summaryCell,
                  { flex: 1, fontWeight: "600", color: "#000" },
                ]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.summaryCell,
                  { flex: 1, textAlign: "right", fontWeight: "600" },
                ]}
              >
                ₹ 3584
              </Text>
              <Text style={[styles.summaryCell, { flex: 1 }]}></Text>
              <Text style={[styles.summaryCell, { flex: 1 }]}></Text>
            </View>
          </View>
        </View>

        <View style={styles.acknowledgementRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ackTitle}>Account Details</Text>
          <View style={styles.rightColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Account No :</Text>
              <Text style={styles.value}>N/A</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>IFSC code :</Text>
              <Text style={styles.value}>N/A</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Bank Name :</Text>
              <Text style={styles.value}>N/A</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>UPI Details :</Text>
              <Text style={[styles.value, { color: "black" }]}>N/A</Text>
            </View>
          </View>
          </View>

          <View style={{ flex: 1 , marginTop:20}}>
            <View>
            <Image
              source={QRCode}
              style={styles.QRIcon}
              resizeMode="contain"
            />
            <Text style={styles.signText}>Scan QR for Payment</Text>
            </View>
            <View style={{display:'flex', flexDirection:'row', marginLeft:30}}>
              <Image
              source={GooglePayIcon}
              style={styles.PaymentIcon}
              resizeMode="contain"
            />
             <Image
              source={PhonepeIcon}
              style={styles.PaymentIcon}
              resizeMode="contain"
            />
             <Image
              source={PaytmIcon}
              style={styles.PaymentIcon}
              resizeMode="contain"
            />
           
            </View>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 15,
            marginBottom: 10,
          }}
        >
         <View style={{flex:2}}>
             <Text style={styles.ackTitle}>Terms and Conditions</Text>
             <Text style={styles.ackDescription}>
               This payment confirms your dues till the mentioned period. Final settlement
               during checkout will be calculated based on services utilized and advance paid.
             </Text>
           </View>
          <View style={{ flex: 1, paddingLeft: 40 }}>
            <Image
              source={SigantureIcon}
              style={styles.signature}
              resizeMode="contain"
            />
             <Text style={styles.signText}>Authorized Signature</Text>
          </View>
        </View>

        

        <View style={styles.footerContainer}>
          <Text style={styles.footerLeft}>
            email : <Text style={styles.highlight}>contact@roomsearch.in</Text>
          </Text>
          <Text style={styles.footerRight}>
            Contact : <Text style={styles.highlight}>+91 88994 56611</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FC", paddingTop: 40 },
  receiptCard: {
    margin: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { height: 40, width: 40, borderRadius: 6, marginRight: 10 },
  hostelName: { fontSize: 14, fontWeight: "bold", color: "#2B2B2B" },
  address: { fontSize: 12, color: "#4B4B4B", flexWrap: "wrap", width: 150 },
  title: { fontSize: 16, fontWeight: "bold", color: "#171717" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  leftColumn: { flex: 1, paddingRight: 10 },
  rightColumn: { flex: 1, paddingLeft: 10, paddingTop: 20 },
  sectionHeader: {
    color: "#1E45E1",
    fontStyle: "italic",
    fontSize: 12,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  label: { fontSize: 11, color: "#4B4B4B", width: 80 },
  value: { fontSize: 12, fontWeight: "600", color: "#171717", flexShrink: 1 },
  acknowledgementRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },
  ackTitle: { fontWeight: "700", fontSize: 12, color: "#1E45E1", marginBottom: 4 },
  ackDescription: { fontSize: 10, color: "#333" },
  signature: { height: 60, width: 100, marginBottom: 4, marginLeft: 20 },
  QRIcon: { height: 60, width: 80, marginBottom: 4, marginLeft: 60 },
  PaymentIcon: { height: 40, width: 40, marginBottom: 4, marginLeft: 10 },
  signText: { fontSize: 11, color: "#000", textAlign: "center" },

  summaryTable: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
//   summaryHeader: { color:"black", fontWeight:800 },
  summaryCell: { fontSize: 11, color: "#000" },
  totalSummaryRow: { backgroundColor: "rgba(249, 249, 249, 1)" },

  sectionTitle: {
    fontSize: 13,
    color: "#1E45E1",
    fontWeight: "500",
    marginBottom: 8,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 20,
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  footerLeft: { fontSize: 11, color: "#555" },
  footerRight: { fontSize: 11, color: "#555" },
  highlight: { fontWeight: "600", color: "#000" },
});

export default NOCBillPdf;
