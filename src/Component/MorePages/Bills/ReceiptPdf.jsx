import React, { useContext } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

import { BillContext } from "../../../Context/BillsContext";
import HostelImage from "../../../Assets/Images/PgImg.png";
import PaymentReceivedIcon from "../../../Assets/Images/paymentreceived_image.png";
import RefundIcon from "../../../Assets/Images/Refund_image.png";
import SigantureIcon from "../../../Assets/Images/signature.png";

const ReceiptPdfViewer = () => {
  const { ReceiptPdfdetails } = useContext(BillContext);
  const navigation = useNavigation();

  console.log("receiptpdfdetails", ReceiptPdfdetails);
  

   useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();   
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [navigation])
  );

  if (!ReceiptPdfdetails) return null;





  const {
    configurations,
    stayInfo,
    customerInfo,
    receiptInfo,
    invoiceNumber,
    invoiceDate,
    invoiceAmount,
    accountDetails,
    emailId,
    mobile,
    countryCode,
  } = ReceiptPdfdetails;

  const receiptType = configurations?.receiptType;

  const receiptTitleMap = {
    Rent: "Payment Receipt",
    Advance: "Security Deposit Receipt",
    Booking: "Security Deposit Receipt",
    Settlement: "Final Settlement Receipt",
  };
  const receiptTitle = receiptTitleMap[receiptType] || "Payment Receipt";

  const isRefund = Number(invoiceAmount) < 0;
  const amountValue = Math.abs(receiptInfo?.paidAmount || 0);

  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.receiptCard}>

       

         <View style={styles.header}>
                  <Image
          source={
              configurations?.hostelLogo
                ? { uri: configurations.hostelLogo }
                : HostelImage
            }
            style={styles.logo}
          />
                  
                  <View style={{ }}>
                       <Text style={styles.hostelName}>{stayInfo?.hostelName}</Text>
                    <Text style={styles.address}>{configurations?.address}</Text>
                  </View>
                </View>
        

        <Text style={styles.title}>{receiptTitle}</Text>

        <View style={styles.row}>
        <View style={styles.leftColumn}>
  <Text style={styles.sectionHeader}>Receipt to:</Text>

  <View style={styles.receiptRow}>
    <Text style={styles.icon}>👤</Text>
    <Text style={styles.colon}>:</Text>
    <Text style={styles.valueText}>{customerInfo?.fullName}</Text>
  </View>

  <View style={styles.receiptRow}>
    <Text style={styles.icon}>📞</Text>
    <Text style={styles.colon}>:</Text>
    <Text style={styles.valueText}>
      +{customerInfo?.countryCode} {customerInfo?.customerMobileNo}
    </Text>
  </View>

  <View style={styles.receiptRow}>
    <Text style={styles.icon}>🛏</Text>
    <Text style={styles.colon}>:</Text>
    <Text style={styles.valueText}>
      {stayInfo?.floorName}, {stayInfo?.roomName} - {stayInfo?.bedName}
    </Text>
  </View>

  <View style={styles.receiptRow}>
    <Text style={styles.icon}>📍</Text>
    <Text style={styles.colon}>:</Text>
    <Text style={styles.valueText}>
      {customerInfo?.fullAddress || "—"}
    </Text>
  </View>
</View>


         <View style={styles.rightColumn}>
  <View style={styles.rightRow}>
    <Text style={styles.rightLabel}>Receipt No</Text>
    <Text style={styles.colon}> :</Text>
    <Text style={styles.rightValue}>{receiptInfo?.receiptNumber}</Text>
  </View>

  <View style={styles.rightRow}>
    <Text style={styles.rightLabel}>Date</Text>
    <Text style={styles.colon}> :</Text>
    <Text style={styles.rightValue}>{receiptInfo?.transactionDate}</Text>
  </View>

  <View style={styles.rightRow}>
    <Text style={styles.rightLabel}>Time</Text>
    <Text style={styles.colon}> :</Text>
    <Text style={styles.rightValue}>{receiptInfo?.transactionTime}</Text>
  </View>

  <View style={styles.rightRow}>
    <Text style={styles.rightLabel}>Payment Mode</Text>
    <Text style={styles.colon}> :</Text>
    <Text style={styles.rightValue}>
      {accountDetails?.bankName || "—"}
    </Text>
  </View>

  <View style={styles.rightRow}>
    <Text style={styles.rightLabel}>Transaction ID</Text>
    <Text style={styles.colon}> :</Text>
    <Text style={styles.rightValue}>{receiptInfo?.transactionId}</Text>
  </View>
</View>

        </View>

        <View style={styles.amountBox}>
          <View style={{ flex: 1 , alignItems:'center', justifyContent:'center'}}>
            <Text style={styles.amountTitle}>
              {isRefund ? "TOTAL REFUNDED AMOUNT" : "TOTAL PAID AMOUNT"}
            </Text>
            {(receiptType === "Advance" || receiptType === "Booking") && (
              <Text style={styles.subTitle}>Security Deposit (Advance)- Deductions</Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.amountValueBox}>
              <View
                style={[
                  styles.amountBar,
                  { backgroundColor: isRefund ? "#FF0000" : "#00A651" },
                ]}
              />
              <Text style={styles.amount}>₹ {amountValue}</Text>
            </View>
            <Text style={styles.amountWords}>
              {convertNumberToWords(amountValue)} Only
            </Text>
          </View>
        </View>


        <View style={styles.ackRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ackTitle}>Acknowledgement</Text>
            <Text style={styles.ackText}>
              Thanks for choosing {stayInfo?.hostelName}
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Image source={SigantureIcon} style={styles.signature} />
            <Text>Authorized Signature</Text>
          </View>
        </View>

        <Image
          source={isRefund ? RefundIcon : PaymentReceivedIcon}
          style={styles.stamp}
        /> 

     {(receiptType === "Advance" || receiptType === "Booking") && (
  <SimpleTable
    headers={["Invoice No", "Description", "Amount / INR"]}
    rows={[
      [
        invoiceNumber,
        "Security Deposit (Advance)",
        `₹ ${Math.abs(receiptInfo?.paidAmount || 0)}`,
      ],
    ]}
    showTotal
    totalAmount={Math.abs(receiptInfo?.paidAmount || 0)}
  />
)}


      {receiptType === "Rent" && (
  <SimpleTable
    headers={[
      "Invoice No",
      "Invoice Date",
      "Invoice Amount",
      "Payment Amount",
    ]}
    rows={[
      [
        invoiceNumber,
        invoiceDate,
        `₹ ${Math.abs(invoiceAmount || 0)}`,
        `₹ ${Math.abs(receiptInfo?.paidAmount || 0)}`,
      ],
    ]}
    showTotal
    totalAmount={Math.abs(receiptInfo?.paidAmount || 0)}
  />
)}


    {receiptType === "Settlement" && (
  <SimpleTable
    headers={["S.NO", "DESCRIPTION", "AMOUNT / INR"]}
    rows={[
      [
        "1",
        "Settlement",
        `Rs. ${invoiceAmount}`,
      ],
    ]}
    showTotal
    totalAmount={Math.abs(receiptInfo?.paidAmount || 0)}
  />
)}



      

        <View style={styles.footer}>
          <Text>Email : {emailId || "N/A"}</Text>
          <Text>
            Contact : +{countryCode} {mobile}
          </Text>
        </View>

      </View>
    </ScrollView>
  );
};

const SimpleTable = ({ headers, rows, showTotal = false, totalAmount }) => (
  <View style={styles.tableWrapper}>
    
    {/* Header */}
    <View style={[styles.tableRow, styles.tableHeader]}>
      {headers.map((h, i) => (
        <Text
          key={i}
          style={[
            styles.cell,
            { flex: 1, fontWeight: "700" },
            i === headers.length - 1 && { textAlign: "right" },
          ]}
        >
          {h}
        </Text>
      ))}
    </View>

    {/* Rows */}
    {rows.map((r, i) => (
      <View key={i} style={styles.tableRow}>
        {r.map((c, j) => (
          <Text
            key={j}
            style={[
              styles.cell,
              { flex: 1 },
              j === r.length - 1 && { textAlign: "right" },
            ]}
          >
            {c}
          </Text>
        ))}
      </View>
    ))}

    {/* Total */}
    {showTotal && (
      <View style={styles.tableTotalRow}>
        <Text
          style={[
            styles.cell,
            { flex: headers.length - 1, fontWeight: "700" },
          ]}
        >
          Total
        </Text>
        <Text
          style={[
            styles.cell,
            { flex: 1, textAlign: "right", fontWeight: "700" },
          ]}
        >
          ₹ {totalAmount}
        </Text>
      </View>
    )}
  </View>
);



function convertNumberToWords(num) {
  if (!num) return "Zero";
  const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen",
    "Seventeen","Eighteen","Nineteen"];
  const b = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

  let str = "";
  if (num >= 1000) {
    str += a[Math.floor(num / 1000)] + " Thousand ";
    num %= 1000;
  }
  if (num >= 100) {
    str += a[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }
  if (num > 19) {
    str += b[Math.floor(num / 10)] + " " + a[num % 10];
  } else {
    str += a[num];
  }
  return str.trim();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FC" , paddingTop:30, },
  receiptCard: { margin: 12, backgroundColor: "#fff", padding: 12, borderRadius: 8 , paddingBottom:50},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop:20,
  },
  logo: { height: 50, width: 50, borderRadius: 6, paddingLeft: 15 },
  hostelName: { fontSize: 14, fontWeight: "bold", color: "#2B2B2B" },
  address: { fontSize: 12, color: "#4B4B4B", flexWrap: "wrap", width: 150 },
  title: { textAlign: "center", fontSize: 16, fontWeight: "700", marginVertical: 10 },
  row: { flexDirection: "row", marginTop: 10 },
  leftColumn: { flex: 1 },
 rightColumn: {
  flex: 1,
  alignItems: "flex-end",
},

rightRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 6,
},

rightLabel: {
  width: 95,         
  fontSize: 12,
  color: "#555",
  textAlign: "right",
},

rightValue: {
  flex: 1,
  fontSize: 10,
  color: "#000",
  fontWeight: "600",
},

  sectionHeader: { fontStyle: "italic", color: "#1E45E1" },
  item: { fontSize: 12, marginBottom: 4 },

  receiptRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 6,
},

icon: {
  width: 18,
  fontSize: 13,
},

colon: {
  width: 10,
  fontSize: 12,
},

valueText: {
  flex: 1,
  fontSize: 12,
  color: "#000",
  lineHeight: 16,
},

amountBox: {
  flexDirection: "row",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  overflow: "hidden",
  marginTop: 15,
  marginBottom: 10,
  height:80
},

  amountTitle: { fontWeight: "700", fontSize: 10 },
  subTitle: { fontSize: 10, color: "#666" , marginLeft:20},
  amountValueBox: { flexDirection: "row", backgroundColor: "#F1FFF5", padding: 8 },
  amountBar: { width: 3, marginRight: 8 },
  amount: { fontSize: 18, fontWeight: "700" },
  amountWords: { fontSize: 11, color: "#555" },
  table: { borderWidth: 0.7, marginTop: 15,  borderColor: "grey"  },
  // tableRow: { flexDirection: "row", padding: 8, borderBottomWidth: 0.7 ,borderColor: "grey"},
  // tableHeader: { backgroundColor: "#f9f9f9" },
  ackRow: { flexDirection: "row", marginTop: 20 },
  ackTitle: { fontWeight: "700" },
  ackText: { fontSize: 12 },
  signature: { width: 100, height: 50 },
  stamp: { width: 140, height: 60, alignSelf: "flex-end", marginTop: 10 },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  tableWrapper: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  overflow: "hidden",
  marginTop: 15,
},

tableHeader: {
  backgroundColor: "#F3F6FB",
},

tableRow: {
  flexDirection: "row",
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderBottomWidth: 1,
  borderColor: "#eee",
},

tableTotalRow: {
  flexDirection: "row",
  paddingVertical: 12,
  paddingHorizontal: 12,
  backgroundColor: "#FAFBFF",
},

cell: {
  fontSize: 12,
  color: "#000",
},

});

export default ReceiptPdfViewer;
