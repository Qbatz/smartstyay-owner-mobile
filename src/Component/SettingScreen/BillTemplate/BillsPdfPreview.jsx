import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, BackHandler } from "react-native";
import RoomSerach from '../../../Assets/Images/roomsearch_logo.png';
import Qr from '../../../Assets/Images/pdfImage/QRimg.png';
import paytm from '../../../Assets/Images/pdfImage/Paytmimg.png';
import phonepe from '../../../Assets/Images/pdfImage/PhonepeImg.png'
import gpay from '../../../Assets/Images/pdfImage/GPayimg.png'
import signature from '../../../Assets/Images/signature.png'


const BillsPdfDesign = ({ onBack, billsDataChanged }) => {

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      onBack;
      return true;
    });

    return () => handler.remove();
  }, []);

  console.log(billsDataChanged, "billdar")

  const billsDataColor = `rgba(${billsDataChanged?.color.r}, ${billsDataChanged?.color.g}, ${billsDataChanged?.color.b}, ${billsDataChanged?.color.a})`

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <View>
          <Image
            source={billsDataChanged?.logoUri ? {uri:billsDataChanged?.logoUri} :   RoomSerach}
            style={styles.logo}
          />
        </View>
        <View style={styles.invoiceMonth}>
          <Text style={styles.headerText}>roomsearch.in</Text>
          <Text style={styles.headerSub}>8th Avenue Rd,{"\n"}Sameeshwara Nagar,{"\n"}Chennai, Tamilnadu - 600 006</Text>
        </View>
      </View>


      <View style={styles.receiptTitleContainer}>
        <Text style={[styles.receiptTitle,{color: billsDataColor}]}>Payment Invoice</Text>
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
            <Text style={[styles.sectionTitle,{color:billsDataColor}]}>Bill to</Text>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.label}>RoomNo</Text>
            <Text style={styles.label}>Address</Text>
          </View>
          <View style={styles.valueColumn}>
            <Text style={styles.sectionTitle}>:</Text>
            <Text style={styles.name}>: Muthuraj M</Text>
            <Text style={styles.info}>: +91 85437 84231</Text>
            <Text style={styles.info}>: G-Floor, 103 - 02</Text>
            <Text style={styles.info}>: 8th Main Rd,{"\n"}   Sameeshwar Nagar,{"\n"}   Bengaluru, Karnataka 560071</Text>
          </View>
        </View>

        <View style={styles.invStyle}>

          <Text style={styles.invSty}>
            Invoice : {' '}
            <Text style={styles.bold}>#{billsDataChanged?.prefix || "_"}{billsDataChanged?.suffix || "_"}</Text>
          </Text>

          <Text style={styles.invSty}>
            Date : {' '}
            <Text style={styles.bold}>31 March 2025</Text>
          </Text>

          <Text style={styles.invSty}>
            Joining Date: {' '}
            <Text style={styles.bold}>02 Mar 2025</Text>
          </Text>

          <Text style={styles.invSty}>
            Time: {' '}
            <Text style={styles.bold}>11:56:24 AM</Text>
          </Text>

          <Text style={styles.invSty}>
            Rental Period: {' '}
            <Text style={styles.bold}>Mar 02 - Apr 01</Text>
          </Text>
        </View>
      </View>


      <View style={styles.paymentSummarySection}>
        <Text style={[styles.paymentSummaryTitle, {color: `rgba(${billsDataChanged?.color.r}, ${billsDataChanged?.color.g}, ${billsDataChanged?.color.b}, ${billsDataChanged?.color.a})`}]}>
          Payment Summary</Text>
        <View style={styles.table}>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colInvNo]}>INV NO</Text>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>DESCRIPTION</Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>AMOUNT / INR</Text>
          </View>


          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colInvNo]}>INV-007</Text>
            <Text style={[styles.tableCell, styles.colDesc]}>Rent</Text>
            <Text style={[styles.tableCell, styles.colAmount]}>₹ 8,334</Text>
          </View>


          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colInvNo]}></Text>
            <Text style={[styles.tableCell, styles.colDesc, styles.totalText]}>Total</Text>
            <Text style={[styles.tableCell, styles.colAmount, styles.totalText]}>₹ 8,334</Text>
          </View>
        </View>


        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalAmount}>₹ 8334</Text>
        </View>
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
          <Text style={[styles.accountTitle,{color:billsDataColor}]}>ACCOUNT DETAILS</Text>
          <Text style={styles.accountText}>Account No: <Text style={styles.bold}>8745210876</Text></Text>
          <Text style={styles.accountText}>IFSC Code: <Text style={styles.bold}>SBIN0017975</Text></Text>
          <Text style={styles.accountText}>Bank Name: <Text style={styles.bold}>State Bank of India</Text></Text>
          <Text style={styles.accountText}>UPI ID: <Text style={styles.bold}>Net Banking</Text></Text>
        </View>

        <View style={styles.accountRight}>
          <Image
            source={Qr}
            style={[styles.qr,{tintColor:billsDataColor}]}
          />
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
          <Text style={[styles.termsTitle,{color:billsDataColor}]}>Terms and Conditions</Text>
          <Text style={styles.termsText}>
            {billsDataChanged?.terms}
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <Image
            source={billsDataChanged?.signatureImage}
            style={styles.signature}
          />
          <Text style={styles.authText} numberOfLines={1}>Authorized Signature</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>email : {billsDataChanged?.email || "N/A"}</Text>
        <Text style={styles.footerText}>Contact : +91 {billsDataChanged?.contactNumber || "N/A"}</Text>
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
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain"
  },
  headerText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700"
  },
  headerSub: {
    color: "#000000",
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right'
  },
  label: {
    fontSize: 12,
    fontFamily: "Gilroy",
    fontWeight: 500
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
    flexDirection: "row"
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
    fontWeight: "600",
    fontSize: 10
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
    fontWeight: 600
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
    // color: "#1E45E1",
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
    paddingLeft: 70
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
    whiteSpace: "nowrap"

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
  tableRow12: {
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
});

export default BillsPdfDesign;