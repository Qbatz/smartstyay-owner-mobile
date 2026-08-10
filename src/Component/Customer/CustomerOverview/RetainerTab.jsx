import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useHasPermission } from "../../../Utils/useHasPermission"
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import AddIcon from "../../../Assets/Images/add-circle.png";
import BillDetailsSheet from "../../MorePages/Bills/BillDetails"
import EmptyState from "../../../Assets/Images/Empty_state.png";

export default function RetainerTab({ customerDetails, ShowBillsDetails }) {
  const invoiceList = customerDetails?.retainerInfo?.retainerList || [];
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
  {invoiceList?.length > 0 ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
    {invoiceList?.map((item, index) => {
  const isAvailable = item?.status === "Available";

  return (
    <TouchableOpacity
      key={item?.invoiceId || index}
      style={styles.row}
    //   onPress={() => handleOpenBillDetails(item)}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.subRow}>
          <Text style={styles.billType}>
            {item?.invoiceType?.replace("_", " ")}
          </Text>

          <View
            style={[
              styles.statusBadge,
              isAvailable
                ? styles.paidBadge
                : styles.overdueBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isAvailable
                  ? styles.paidText
                  : styles.overdueText,
              ]}
            >
              {item?.status || "Used"}
            </Text>
          </View>
        </View>

        <Text style={styles.billId}>
          {item?.invoiceNo}
        </Text>

        {/* <Text style={styles.date}>
          Payment Mode : {item?.paymentMode}
        </Text> */}

       
      </View>

      <View style={styles.rightBox}>
        <Text style={styles.amount}>
          ₹{item?.amount}
        </Text>

        <Text style={styles.date}>
          {item?.date}
        </Text>
         {item?.availableBalance > 0 && (
          <Text style={styles.dueAmount}>
            Available : ₹{item?.availableBalance}
          </Text>
        )}
      </View>
      
    </TouchableOpacity>
  );
})}
    </ScrollView>
  ) : (
     <View style={styles.emptyContainer}>
      <Image source={EmptyState} style={styles.emptyImage} />
      <Text style={styles.emptySubTitle}>
        No Retainer have been generated yet.
      </Text>
    </View>
   )} 
</View>

     
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
emptyContainer: {
  flex: 1,
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
},

emptyImage: {
  width: 180,
  height: 180,
  resizeMode: "contain",
},

emptyTitle: {
  marginTop: 16,
  fontSize: 18,
  fontFamily: "Gilroy-Semibold",
  color: "#111827",
},

emptySubTitle: {
  marginTop: 6,
  fontSize: 14,
  fontFamily: "Gilroy-Medium",
  color: "#6B7280",
  textAlign: "center",
},
});
