import React, { useState, useRef, useEffect , useContext} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { BillContext } from "../../../Context/BillsContext";
import RoomSerach from '../../../Assets/Images/roomsearch_logo.png';
import Qr from '../../../Assets/Images/pdfImage/QRimg.png';
import paytm from '../../../Assets/Images/pdfImage/Paytmimg.png';
import phonepe from '../../../Assets/Images/pdfImage/PhonepeImg.png'
import gpay from '../../../Assets/Images/pdfImage/GPayimg.png'
import signature from '../../../Assets/Images/signature.png'


const InvoiceDesign = () => {

    const {  BillPdfdetails  } = useContext(BillContext);
    console.log("BillPdfdetails", BillPdfdetails);
  const navigation = useNavigation();

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

    if (!BillPdfdetails) return null;


     const {
    invoiceNumber,
    invoiceDate,
    dueDate,
    emailId,
    mobile,
    countryCode,
    customerInfo,
    stayInfo,
    invoiceInfo,
    configurations,
    accountDetails,
    invoiceType
  } = BillPdfdetails;


  const totalDeductions =
  invoiceInfo?.listDeductions?.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  ) || 0;

const format = (n) =>
  `₹ ${Number(n || 0).toLocaleString("en-IN")}`;



  return (
    <ScrollView style={styles.container}>
    
  

 <View style={styles.header}>
          <Image
    source={
      configurations?.hostelLogo
        ? { uri: configurations.hostelLogo }
        : RoomSerach
    }
    style={styles.logo}
  />
          
          <View style={{ }}>
               <Text style={styles.hostelName}>{stayInfo?.hostelName}</Text>
            <Text style={styles.address}>{configurations?.address}</Text>
          </View>
        </View>



     
      <View style={styles.receiptTitleContainer}>
        <Text style={styles.receiptTitle}> {
                        invoiceType === 'SETTLEMENT'
                          ? "Final Settlement Invoice"
                          : configurations?.invoiceType === 'Advance'
                            ? "Security Deposit"
                            : configurations?.invoiceType === 'Rent'
                              ? "Payment Bills"
                              : "Invoice"
                      }</Text>
      </View>

      
      {/* <View style={styles.invoiceInfo}>
        <View style={styles.billToSection}>
         <View>
             <Text style={styles.sectionTitle}>Bill to:</Text>
          <Text style={styles.info}>Name   </Text>
          <Text style={styles.info}>Phone  </Text>
          <Text style={styles.info}>RoomNo     </Text>
          <Text style={styles.info}>
          Address
          </Text>
         </View>
         <View>
             <Text style={styles.sectionTitle}></Text>
          <Text style={styles.name}>Muthuraj M</Text>
          <Text style={styles.info}> +91 85437 84231</Text>
          <Text style={styles.info}>G-Floor, 103 - 02</Text>
          <Text style={styles.info}>
          8th Main Rd,{"\n"}Sameeshwar Nagar,{"\n"}Bengaluru, Karnataka 560071
          </Text>
         </View>
        </View>

        <View style={styles.invStyle}>
          <Text style={styles.invSty}>Invoice : <Text style={styles.bold}>#INV001</Text></Text>
          <Text style={styles.invSty}>Date: <Text>31 March 2025</Text></Text>
          <Text style={styles.invSty}>Joining Date: <Text>02 Mar 2025</Text></Text>
          <Text style={styles.invSty}>Time: 11:56:24 AM</Text>
          <Text style={styles.invSty}>Rental Period: Mar 02 - Apr 01</Text>
        </View>
      </View> */}
      <View style={styles.invoiceInfo}>
  <View style={styles.billToSection}>
    <View style={styles.labelColumn}>
      <Text style={styles.sectionTitle}>Bill to</Text>
      <Text style={styles.label}>Name</Text>
      <Text style={styles.label}>Phone</Text>
      <Text style={styles.label}>RoomNo</Text>
      <Text style={styles.label}>Address</Text>
    </View>
    <View style={styles.valueColumn}>
      <Text style={styles.sectionTitle}>:</Text>
      <Text style={styles.name}>: {customerInfo?.fullName}</Text>
      <Text style={styles.info}>: +{customerInfo?.countryCode} {customerInfo?.customerMobileNo}</Text>
      <Text style={styles.info}>: {stayInfo?.floorName}, {stayInfo?.roomName} - {stayInfo?.bedName}</Text>
      <Text style={styles.info}>: {customerInfo?.fullAddress || "—"}</Text>
    </View>
  </View>

  <View style={styles.invStyle}>
  
    <Text style={styles.invSty}>
  Invoice : {' '}
  <Text style={styles.bold}>{invoiceNumber}</Text>
</Text>
   
     <Text style={styles.invSty}>
 Invoice Date : {' '}
  <Text style={styles.bold}>{invoiceDate}</Text>
</Text>

   <Text style={styles.invSty}>
 Due Date : {' '}
  <Text style={styles.bold}>{dueDate}</Text>
</Text>
   
      <Text style={styles.invSty}>
  Joining Date: {' '}
  <Text style={styles.bold}>{customerInfo?.joiningDate}</Text>
</Text>
   
       {/* <Text style={styles.invSty}>
  Time: {' '}
  <Text style={styles.bold}>11:56:24 AM</Text>
</Text> */}
   
   {configurations?.invoiceType === "Rent" && invoiceType !== 'SETTLEMENT'&& (
     <Text style={styles.invSty}>
              Rental Period :{" "}
              <Text style={styles.bold}>
                {invoiceInfo?.invoicePeriod}
              </Text>
            </Text> 
          )}
  </View>
</View>

  <View style={styles.paymentSummarySection}>
  <Text style={styles.paymentSummaryTitle}>Payment Summary</Text>

  {/* ================= FINAL SETTLEMENT ================= */}
  {invoiceType === "SETTLEMENT" && (
    <>
      <View style={styles.settlementCard}>
        {/* Refund */}
        <View style={styles.halfBox}>
          <View style={styles.headRow}>
            <Text style={styles.headText}>Refund</Text>
            <Text style={styles.headText}>AMOUNT / INR</Text>
          </View>

          {invoiceInfo?.invoiceItems?.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.cell}>{item.description}</Text>
              <Text style={styles.amount}>{format(item.amount)}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {format(invoiceInfo?.subTotal)}
            </Text>
          </View>
        </View>

        {/* Deductions */}
        <View style={styles.halfBox}>
          <View style={styles.headRow}>
            <Text style={styles.headText}>Deductions</Text>
            <Text style={styles.headText}>AMOUNT / INR</Text>
          </View>

          {invoiceInfo?.listDeductions?.length ? (
            invoiceInfo.listDeductions.map((item, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.cell}>{item.type}</Text>
                <Text style={styles.amount}>{format(item.amount)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDeduction}>No Deductions</Text>
          )}

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: "red" }]}>
              Total Deductions
            </Text>
            <Text style={styles.totalValue}>{format(totalDeductions)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.grandCard}>
        <Text style={styles.grandLabel}>Grand Total</Text>
        <Text style={styles.grandValue}>
          {format(invoiceInfo?.totalAmount)}
        </Text>
      </View>
    </>
  )}

  {/* ================= SECURITY DEPOSIT ================= */}
  {configurations?.invoiceType === "Advance" && (
    <>
      <View style={styles.card}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.sno}>S.NO</Text>
          <Text style={styles.desc}>DESCRIPTION</Text>
          <Text style={styles.amt}>AMOUNT / INR</Text>
        </View>

        {invoiceInfo?.invoiceItems?.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.sno}>{i + 1}</Text>
            <Text style={styles.desc}>Security Deposit (Advance)</Text>
            <Text style={styles.amt}>{format(item.amount)}</Text>
          </View>
        ))}

        <View style={styles.tableTotalRow}>
          <Text style={styles.desc}>Total</Text>
          <Text style={styles.amt}>
            {format(invoiceInfo?.subTotal)}
          </Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text>Grand Total</Text>
          <Text>{format(invoiceInfo?.totalAmount)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Payment Made</Text>
          <Text style={{ color: "green" }}>
            {format(invoiceInfo?.paidAmount)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Balance Due</Text>
          <Text style={{ color: "red" }}>
            {format(invoiceInfo?.balanceAmount)}
          </Text>
        </View>
      </View>
    </>
  )}

  {/* ================= PAYMENT BILLS ================= */}
  {invoiceType !== "SETTLEMENT" &&
    configurations?.invoiceType !== "Advance" && (
      <>
        <View style={styles.card}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.inv}>INV NO</Text>
            <Text style={styles.desc}>DESCRIPTION</Text>
            <Text style={styles.amt}>AMOUNT / INR</Text>
          </View>

          {invoiceInfo?.invoiceItems?.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.inv}>{item.invoiceNo}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.amt}>{format(item.amount)}</Text>
            </View>
          ))}

          <View style={styles.tableTotalRow}>
            <Text style={styles.desc}>Total</Text>
            <Text style={styles.amt}>
              {format(invoiceInfo?.subTotal)}
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text>Grand Total</Text>
            <Text>{format(invoiceInfo?.totalAmount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Payment Made</Text>
            <Text style={{ color: "green" }}>
              {format(invoiceInfo?.paidAmount)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Balance Due</Text>
            <Text style={{ color: "red" }}>
              {format(invoiceInfo?.balanceAmount)}
            </Text>
          </View>
        </View>
      </>
    )}
</View>





       {/* <View style={styles.paymentSummarySection}>
        <Text style={styles.paymentSummaryTitle}>Payment Summary</Text>
        <View style={styles.table}>
      
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colInvNo]}>S.NO</Text>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>DESCRIPTION</Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>AMOUNT / INR</Text>
          </View>

       
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colInvNo]}>1</Text>
            <Text style={[styles.tableCell, styles.colDesc]}>Advance</Text>
            <Text style={[styles.tableCell, styles.colAmount]}>₹ 8,334</Text>
          </View>

         
          <View style={styles.tableRow12}>
            <Text style={[styles.tableCell, styles.colInvNo]}></Text>
            <Text style={[styles.tableCell, styles.colDesc, styles.totalText]}>Total</Text>
            <Text style={[styles.tableCell, styles.colAmount, styles.totalText]}>₹ 8,334</Text>
          </View>
        </View>

       
      
      </View> */}

      {/* QR + Account Details */}
      <View style={styles.accountSection}>
        <View style={styles.accountLeft}>
          <Text style={styles.accountTitle}>ACCOUNT DETAILS</Text>
          <Text style={styles.accountText}>Account No: <Text style={styles.bold}>{accountDetails?.accountNo || "N/A"}</Text></Text>
          <Text style={styles.accountText}>IFSC Code: <Text style={styles.bold}>{accountDetails?.ifscCode || "N/A"}</Text></Text>
          <Text style={styles.accountText}>Bank Name: <Text style={styles.bold}>{accountDetails?.bankName || "N/A"}</Text></Text>
          <Text style={styles.accountText}>UPI ID: <Text style={styles.bold}>{accountDetails?.upiId || "N/A"}</Text></Text>
        </View>

        <View style={styles.accountRight}>
           {accountDetails?.qrCode && (
            <Image source={{ uri: accountDetails.qrCode }} style={styles.qr} />
          )}

          <Text style={styles.qrText}>Scan QR for payment</Text>
          <View style={styles.paymentLogos}>
            <Image
              source={gpay}
              style={styles.payIcon}
            />
            <Image
              source={paytm}
              style={styles.payIcon}
            />
            <Image
              source={phonepe}
              style={styles.payIcon}
            />
          </View>
        </View>
      </View>

      {/* Terms and Conditions & Signature in same line */}
      <View style={styles.termsAndSignatureRow}>
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms and Conditions</Text>
          <Text style={styles.termsText}>
               {configurations?.termAndCondition}
          </Text>
        </View>

        <View style={styles.signatureSection}>
           {configurations?.signatureUrl && (
            <Image
              source={{ uri: configurations.signatureUrl }}
              style={styles.signature}
            />
          )}
          <Text style={styles.authText} numberOfLines={1}>Authorized Signature</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>email : {emailId || "N/A"}</Text>
        <Text style={styles.footerText}>Contact : +{countryCode} {mobile}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
    marginTop: 40 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop:20,
  },
  logo: { height: 60, width: 120, borderRadius: 6, marginLeft: 25 },
  hostelName: { fontSize: 14, fontWeight: "bold", color: "#2B2B2B" },
  address: { fontSize: 12, color: "#4B4B4B", flexWrap: "wrap", width: 150 },



  label:{
fontSize:12,
fontFamily:"Gilroy",
fontWeight:500
  },
  invoiceMonth: { 
    alignItems: "flex-end",
    justifyContent: "center",
  },
  receiptTitleContainer: {
    alignItems: "center", 
    marginTop: 5,
    marginBottom: 10,
  },
  receiptTitle: {
    fontSize: 18, 
    fontWeight: "bold", 
    
  },
//   invoiceInfo: {
//     flexDirection: "row",
//     padding: 20,
//     paddingTop:10,
    
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//   },
invoiceInfo: {
  flexDirection: "row",
  justifyContent: "space-between", // Important for end line alignment
  padding: 20,
  paddingTop: 10,
  borderBottomWidth: 1,
  borderColor: "#eee",
},
  billToSection: {
    flex: 1,
    flexDirection:"row"
  },
  invoiceDetailsRight: {
    flex: 1,
    alignItems: "flex-end",
  },
//   invStyle:{marginTop:20,marginLeft:5},
invStyle: {
  alignItems: "flex-end", // This aligns content to right end
  marginLeft: 20, // Add some space between left and right sections
  minWidth: 150, // Ensure it has enough width
},
//   invSty:{
// fontSize:12,

//   },
invSty: {
  fontSize: 12,
  marginBottom: 2,
//   textAlign: "right", // Right align text within each line
//   width: '100%', // Ensure full width for right alignment
},
bold: { 
    fontWeight: "600" ,
    fontSize:10
  },
  sectionTitle: { 
    fontWeight: "700", 
    marginBottom: 6,
    fontSize: 13,
     color: "#1E45E1", 
  },
  name: { 
    fontWeight: "600", 
    fontSize: 10, 
    marginBottom: 4,
    

  },
  info: { 
    color: "#333", 
    fontSize: 10,
    marginBottom: 2,
    fontWeight:600
  },
  infoRight: { 
    color: "#333", 
    fontSize: 13, 
    marginBottom: 3,
    textAlign: "right"
  },
  
  accountSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  accountLeft: { 
    flex: 1 
  },
  accountTitle: { 
    color: "#1E45E1", 
    fontWeight: "700", 
    marginBottom: 10,
    fontSize: 12
  },
  accountText: { 
    color: "#333", 
    fontSize: 11, 
    marginBottom: 4 
  },
  accountRight: { 
    alignItems: "center" 
  },
  qr: { 
    width: 100, 
    height: 100, 
    marginBottom: 8 
  },
  qrText: {
    fontSize: 10,
    color: "#666",
    marginBottom: 8,
  },
  paymentLogos: { 
    flexDirection: "row",
  },
  payIcon: { 
    width: 40, 
    height: 30, 
    resizeMode: "contain", 
    marginHorizontal: 3 
  },
  termsAndSignatureRow: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "flex-start",
  },
  termsSection: {
    flex: 2,
    paddingRight: 15,
  },
  termsTitle: { 
    fontWeight: "700", 
    marginBottom: 4,
    fontSize: 12,
    color: "#1E45E1",
  },
  termsText: { 
    color: "#444", 
    fontSize: 11, 
    lineHeight: 18 
  },
  signatureSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft:70
  },
  signature: { 
    width: 100, 
    height: 50, 
    resizeMode: "contain",
    marginBottom: 5,
  },
  authText: { 
    fontSize: 10, 
    color: "#444",
    textAlign: "center",
    whiteSpace:"nowrap"
    
  },
  paymentSummarySection: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  paymentSummaryTitle: {
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 15,
     color: "#1E45E1", 
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f6fb",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#000",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
          tableRow12:{
 backgroundColor: "#f8f9fa",
   flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
          },

  tableCell: {
    fontSize: 12,
    color: "#333",
  },
  totalText: {
    fontWeight: "600",
  },
  colInvNo: {
    flex: 1,
    textAlign: "left",
  },
  colDesc: {
    flex: 2,
    textAlign: "left",
  },
  colAmount: {
    flex: 1,
    textAlign: "right",
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  grandTotalAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#001F60",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#001F60",
    padding: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  footerText: { 
    color: "#fff", 
    fontSize: 12 
  },

settlementCard: {
  flexDirection: "row",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  overflow: "hidden",
},

halfBox: {
  flex: 1,
  padding: 12,
  borderRightWidth: 1,
  borderColor: "#eee",
},

headRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 8,
},

headText: {
  fontSize: 12,
  fontWeight: "700",
},

row: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 6,
},

cell: {
  fontSize: 12,
},

amount: {
  fontSize: 12,
  fontWeight: "600",
},

totalRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  borderTopWidth: 1,
  borderColor: "#eee",
  marginTop: 8,
  paddingTop: 8,
},

totalLabel: {
  fontWeight: "600",
},

totalValue: {
  fontWeight: "700",
},

noDeduction: {
  textAlign: "center",
  color: "#777",
  marginVertical: 10,
},

grandCard: {
  marginTop: 12,
  padding: 14,
  borderRadius: 10,
  backgroundColor: "#F9FAFB",
  flexDirection: "row",
  justifyContent: "space-between",
},

grandLabel: {
  fontWeight: "700",
  fontSize: 14,
},

grandValue: {
  fontWeight: "700",
  fontSize: 14,
},

card: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  overflow: "hidden",
},

tableHeaderRow: {
  flexDirection: "row",
  backgroundColor: "#F3F6FB",
  padding: 12,
},

tableRow: {
  flexDirection: "row",
  padding: 12,
  borderTopWidth: 1,
  borderColor: "#eee",
},

tableTotalRow: {
  flexDirection: "row",
  padding: 12,
  backgroundColor: "#FAFBFF",
  justifyContent: "space-between",
},

sno: { flex: 1 },
inv: { flex: 1 },
desc: { flex: 2 },
amt: { flex: 1, textAlign: "right" },

summaryCard: {
  marginTop: 12,
  padding: 14,
  backgroundColor: "#FAFBFF",
  borderRadius: 12,
},

summaryRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 6,
},


  settlementWrapper: {
  flexDirection: "row",
  gap: 10,
},

settlementBox: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 10,
},

settlementHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 8,
},

settlementTitle: {
  fontSize: 12,
  fontWeight: "700",
  color: "#222",
},

settlementRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 6,
},

settlementText: {
  fontSize: 12,
  color: "#333",
},

settlementAmount: {
  fontSize: 12,
  fontWeight: "600",
},

noData: {
  textAlign: "center",
  fontSize: 12,
  color: "#666",
  marginTop: 10,
},

summaryBox: {
  flexDirection: "row",
  justifyContent: "space-between",
  padding: 12,
  backgroundColor: "#FAFBFF",
  borderRadius: 6,
  marginTop: 10,
},

});

export default InvoiceDesign;