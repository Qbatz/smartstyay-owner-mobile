import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useHasPermission } from "../../../Utils/useHasPermission"
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import AddIcon from "../../../Assets/Images/add-circle.png";
import BillDetailsSheet from "../../MorePages/Bills/BillDetails"

export default function BillTab({ customerDetails, ShowBillsDetails }) {
  const invoiceList = customerDetails?.invoiceResponseList || [];
  const navigation = useNavigation();
  console.log("customerDetailsBillTab", invoiceList);
  const { BillDetails, loading, GetAllBillDetails,
    RecordPayment, GetInitializeRefundDetails, CreateRefund, refundError
    , GetRecurringBills, recurringBills, BillPdfdetails, getBillsPdfDetails, getReceiptPdfDetails, downloadReceipt, DeleteReceipt,
    downloadBill, shareBillOnWhatsapp, shareReceiptOnWhatsapp, GetReceiptsList, receiptsList, MarkBillAsUnpaid } = useContext(BillContext);

  const { activeHostelId } = useContext(CommonContexts);
  console.log(invoiceList)

  const [BillDetailshow, setBillDetailsShow] = useState(false)
  const [selectedBill, setSelectedBill] = useState(null);
  const {
    canWriteModule: canWriteTenant,
    canReadModule: canReadTenant,
    canUpdateModule: canUpdateTenant,
    canDeleteModule: canDeleteTenant,
  } = useHasPermission("Customers");

  const {
    canWriteModule: canWriteInvoice,
    canReadModule: canReadInvoice,
    canUpdateModule: canUpdateInvoice,
    canDeleteModule: canDeleteInvoice,
  } = useHasPermission("Bills")

  useEffect(() => {
    GetAllBillDetails(activeHostelId);
  }, [activeHostelId])

  console.log("customerDetails", customerDetails);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const requestedLeavingDate =
    customerDetails?.checkoutInfo?.requestedLeavingDate;

  const leavingDateObj = parseDate(requestedLeavingDate);
  const today = new Date();

  const isAfterLeavingDate =
    leavingDateObj && today > leavingDateObj;


  const status = customerDetails?.customerCurrentStatus;

  const disableFinancialEdit =
    status === "BOOKED" ||
    status === "VACATED" ||
    (status === "NOTICE" && isAfterLeavingDate);

  const handleOpenBillDetails = async (bill) => {
    console.log("bill", bill);

    ShowBillsDetails(bill)

    setSelectedBill(bill);
    // setBillDetailsShow(true);
    const res = await getBillsPdfDetails(activeHostelId, bill?.invoiceId);

    console.log("settlementresponse", res);
    
  };

  const handleCreateBill = () => {
    if (!canWriteInvoice) return;
    navigation.navigate("CreateBills", { mode: "add", customerDetails })
  }



  return (
    <>


      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }} >
          {invoiceList.map((item, index) => (
            <TouchableOpacity key={index} style={styles.row}
              onPress={() => handleOpenBillDetails(item)}
            >
              {/* LEFT */}
              <View>
                <Text style={styles.billId}>{item.invoiceNumber}</Text>

                <View style={styles.subRow}>
                  <Text style={styles.billType}>{item.invoiceType}</Text>

                  <View
                    style={[
                      styles.statusBadge,
                      item.paymentStatus === "Paid"
                        ? styles.paidBadge
                        : styles.overdueBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        item.paymentStatus === "Paid"
                          ? styles.paidText
                          : styles.overdueText,
                      ]}
                    >
                      {item.paymentStatus}
                    </Text>
                  </View>

                </View>
                {["Partially Paid", "Partial Payment"].includes(item.paymentStatus) && (
                  <Text style={styles.dueLabel}>Outstanding</Text>
                )}
              </View>

              {/* RIGHT */}
              <View style={styles.rightBox}>
                <Text style={styles.amount}>₹{item.totalAmount}</Text>
                <Text style={styles.date}>on {item.dueDate}</Text>
                {["Partially Paid", "Partial Payment"].includes(item.paymentStatus) && (
                  <Text style={styles.dueAmount}>   ₹ {item?.dueAmount || 0}</Text>
                )}
              </View>



            </TouchableOpacity>
          ))}
        </ScrollView>

      </View>
      {/* <BillDetailsSheet
  visible={BillDetailshow}
  onClose={() => setBillDetailsShow(false)}
  bill={selectedBill}
/> */}

      {/* <TouchableOpacity 
          //  style={[ styles.addBtn, !canWriteInvoice && { opacity: 0.4 }]}
                        style={[
      styles.addBtn,
      (!canWriteInvoice || disableFinancialEdit ) && { opacity: 0.4 }
    ]}
            //  disabled={!canWriteInvoice}
              disabled={disableFinancialEdit || !canWriteInvoice }
       onPress={handleCreateBill}>
            <Image source={AddIcon} style={{ width: 25, height: 25 }} />
          </TouchableOpacity> */}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  billId: {
    fontSize: 14,
    fontFamily: "Gilroy-Semibold",
    color: "#111827",
    marginBottom: 6,
  },

  subRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  billType: {
    fontSize: 12,
    color: "#6B7280",
    marginRight: 8,
    fontFamily: "Gilroy-Medium"
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  overdueBadge: {
    backgroundColor: "#FEF3C7",
  },

  paidBadge: {
    backgroundColor: "#DCFCE7",
  },

  statusText: {
    fontSize: 11,
    fontFamily: "Gilroy-Medium",
  },

  overdueText: {
    color: "#D97706",
  },
  dueLabel: {
    fontSize: 12,
    color: "#4B4B4B",
    marginRight: 6,
    marginTop: 5,
    fontFamily: "Gilroy-Medium"
  },
  dueAmount: {
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
    color: "#E02D2D",
    marginTop: 5
  },

  paidText: {
    color: "#15803D",
  },

  rightBox: {
    alignItems: "flex-end",
    justifyContent: "center",
  },

  amount: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
    color: "#111827",
  },

  date: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
    fontFamily: "Gilroy-Semibold"
  },
  addBtn: {
    // position: "absolute",
    // bottom: 0,
    // right: 10,
    // backgroundColor: "#1D5DFF",
    // width: 55,
    // height: 55,
    // borderRadius: 30,
    // justifyContent: "center",
    // alignItems: "center",
    // elevation: 6,

    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#1D5DFF",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  outstandingLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
    fontFamily: "Gilroy-Regular",
  },

  dueAmount: {
    fontSize: 13,
    color: "#DC2626", // red color
    marginTop: 4,
    fontFamily: "Gilroy-Semibold",
  },
});
