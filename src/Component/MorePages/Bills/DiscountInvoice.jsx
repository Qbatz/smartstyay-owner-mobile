import React, { useState , useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,ScrollView
} from "react-native";
import { BackHandler } from "react-native";
import { useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import room from "../../../Assets/Images/PG_active.png";
import Bed from "../../../Assets/Images/bed.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";

export default function DiscountInvoiceScreen() {
  const navigation = useNavigation();
  const route = useRoute();

    const { BillDetails, loading, GetAllBillDetails,
      RecordPayment, GetInitializeRefundDetails, CreateRefund, refundError
      , GetRecurringBills, recurringBills, BillPdfdetails, getBillsPdfDetails, getReceiptPdfDetails, downloadReceipt, DeleteReceipt,
      downloadBill, shareBillOnWhatsapp, shareReceiptOnWhatsapp, GetReceiptsList, receiptsList, MarkBillAsUnpaid,
    ApplyBillDiscount  } = useContext(BillContext);
      const { activeHostelId } = useContext(CommonContexts);

        const [showSuccessModal, setShowSuccessModal] = useState(false);
        const [modalMessage, setModalMessage] = useState("");
        const [modalType, setModalType] = useState("success");

  const bill = route?.params?.bill

  console.log("BillPdfdetails", BillPdfdetails);
  

  const [discountType, setDiscountType] = useState("Amount"); 
const [discount, setDiscount] = useState("");
const [reason, setReason] = useState("");
const [showReasonDropdown, setShowReasonDropdown] = useState(false);

const [reasonErr, setReasonErr] = useState("")
const [discountErr, setDiscountErr] = useState("")

const reasons = [
  "Loyalty Discount",
  "Promotional Offer",
  "Service Issue",
  "Partial Stay",
  "Special Approval",
];

const invoiceAmount = Number(
  BillPdfdetails?.invoiceInfo?.totalAmount || 0
);

const discountValue =
  discountType === "Percentage"
    ? (invoiceAmount * Number(discount || 0)) / 100
    : Number(discount || 0);

const total = invoiceAmount - discountValue;


const today = new Date();

const dueDateStr = BillPdfdetails?.dueDate; // "11/03/2026"

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
};

const dueDate = parseDate(dueDateStr);

const isOverdue = dueDate && today > dueDate;

  useEffect(() => {
  const backAction = () => {
    navigation.goBack();
    return true; 
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, [])


const isValidNumber = (val) => {
  if (!val) return false;

  const num = Number(val);

  if (isNaN(num) || num <= 0) return false;

  return true;
};

//    const handleDiscountApply = async () => {
//   if (!reason) {
//     setReasonErr("Please select reason");
//     return;
//   }

//  if (!isValidNumber(discount)) {
//   setDiscountErr("Enter valid discount");
//   return;
// }

//   if (discountValue > invoiceAmount) {
//     setDiscountErr("Discount cannot exceed amount");
//     return;
//   }

//  if (discountType === "Percentage" && Number(discount) > 100) {
//   setDiscountErr("Percentage cannot exceed 100%");
//   return;
// }

//   const res = await ApplyBillDiscount({
//     hostelId: bill?.hostelId,
//     invoiceId: bill?.invoiceId,
//     discountAmount:
//       discountType === "Amount" ? discountValue : 0,
//     discountPercentage:
//       discountType === "Percentage" ? Number(discount) : 0,
//     reason,
//   });

//   if (res?.success) {
//       setModalType("success");
//       setModalMessage("Discount Added Successfully");
//       setShowSuccessModal(true);

     
//        setTimeout(() => {
//           navigation.goBack();
//          setShowSuccessModal(false)
//        }, 1500);

   
//   } else {
//       setModalType("warning");
//       setModalMessage(res?.message ||"Something went wrong");
//       setShowSuccessModal(true);

//       setTimeout(() => setShowSuccessModal(false), 3000);
//   }
//    }

console.log({
  discountType,
  discountAmount:
    discountType === "Amount" ? Number(discount) : 0,
  discountPercentage:
    discountType === "Percentage" ? Number(discount) : 0,
});


const sendpayload = {
  hostelId: bill?.hostelId,
  invoiceId: bill?.invoiceId,
  reason: reason || "",
  ...(discountType === "Amount" && {
    discountAmount: Number(discount),
  }),
  ...(discountType === "Percentage" && {
    discountPercentage: Number(discount),
  }),
};

console.log("sendpayload", sendpayload);


const handleDiscountApply = async () => {
  let hasError = false;

  setReasonErr("");
  setDiscountErr("");

  // ✅ Reason
  if (!reason) {
    setReasonErr("Please select reason");
    hasError = true;
  }

  // ❌ Empty / invalid
  if (!isValidNumber(discount)) {
    setDiscountErr("Enter valid discount");
    hasError = true;
  }

  // ✅ Percentage validation (MAIN FIX)
  if (discountType === "Percentage") {
    if (Number(discount) > 100) {
      setDiscountErr("Percentage cannot exceed 100%");
      hasError = true;
    }
  }

  // ✅ Amount validation
  if (discountType === "Amount") {
    if (Number(discount) > invoiceAmount) {
      setDiscountErr("Discount cannot exceed amount");
      hasError = true;
    }
  }

  if (hasError) return;

const payload = {
  hostelId: bill?.hostelId,
  invoiceId: bill?.invoiceId,
  reason: reason || "",
  ...(discountType === "Amount" && {
    discountAmount: Number(discount),
  }),
  ...(discountType === "Percentage" && {
    discountPercentage: Number(discount),
  }),
};

console.log("payload", payload);


const res = await ApplyBillDiscount(payload);

// const res = await ApplyBillDiscount({
//   hostelId: bill?.hostelId,
//   invoiceId: bill?.invoiceId,

//   discountAmount:
//     discountType === "Amount"
//       ? Number(discount)
//       : discountValue,

//   discountPercentage:
//     discountType === "Percentage"
//       ? Number(discount)
//       : 0,

//   reason,
// });

  if (res?.success) {
    setModalType("success");
    setModalMessage("Discount Added Successfully");
    setShowSuccessModal(true);

    setTimeout(() => {
      navigation.goBack();
      setShowSuccessModal(false);
    }, 1500);
  } else {
    setModalType("warning");
    setModalMessage(res?.message || "Something went wrong");
    setShowSuccessModal(true);

    setTimeout(() => setShowSuccessModal(false), 3000);
  }
};

  return (

    <>
      <SuccessModal
            visible={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={modalMessage}
            type={modalType}
          />
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
                              <Image source={ArrowLeft} style={styles.backIcon} />
                            </TouchableOpacity>
        <Text style={styles.headerTitle}>Discount Invoice</Text>
      </View>

      {/* User Section */}
      <View style={styles.userRow}>
        {/* <View style={styles.avatar}>
          <Text style={{ color: "#fff" }}>
            {BillPdfdetails?.customerInfo?.fullName.slice(0, 2)}
          </Text>
        </View> */}

            {BillPdfdetails?.customerInfo?.profilePic ? (
                              <Image
                                source={{ uri: BillPdfdetails?.customerInfo?.profilePic }}
                                style={styles.userImg}
                              />
                            ) : (
                              <View style={styles.initialCircle}>
                                <Text style={styles.initialText}>
                                  {BillPdfdetails?.customerInfo?.initials || BillPdfdetails?.customerInfo?.fullName?.slice(0, 2)?.toUpperCase()}
                                </Text>
                              </View>
                            )}

        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>{BillPdfdetails?.customerInfo?.fullName}</Text>




              <View style={{ flexDirection: "row", marginTop: 5, }}>
                             <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {BillPdfdetails?.stayInfo?.floorName}
              </Text>
            </View>
                              <Image source={room} style={{ width: 18, height: 18, marginRight:4 }} />
                              <Text style={styles.detailText}>{BillPdfdetails?.stayInfo?.roomName}</Text>
                              <Image source={Bed} style={{ width: 18, height: 18, marginLeft: 8 ,marginRight:4}} />
                              <Text style={styles.detailText}>{BillPdfdetails?.stayInfo?.bedName}</Text>
                            </View>
        </View>
      </View>

   <View style={{   paddingHorizontal: 16,}}>

      <Text style={styles.sectionTitle}>
  Reason for Discount <Text style={{ color: "red" }}>*</Text>
</Text>

<TouchableOpacity
  style={styles.customerdropdownBox}
  onPress={() => setShowReasonDropdown((v) => !v)}
>
  <Text style={{ color: reason ? "#000" : "#9CA3AF" }}>
    {reason || "Select Reason"}
  </Text>

  <Image source={DownArrow} style={styles.arrowIcon} />
</TouchableOpacity>

{showReasonDropdown && (
  <View style={styles.customerDropdownMenu}>
    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
      {reasons.map((item, index) => {
        const isSelected = reason === item;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.customerOption,
              isSelected && styles.customerOptionSelected,
            ]}
            onPress={() => {
              setReason(item);
              setShowReasonDropdown(false);
              setReasonErr("");
            }}
          >
            <Text
              style={[
                styles.customerOptionText,
                isSelected && styles.customerOptionTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
)}
 {reasonErr && (
                    <ErrorMessage message={reasonErr} type="error" />
                  )}
</View>
  

      {/* Invoice Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>For Invoice</Text>

        <View style={styles.innerCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.amount}>
              ₹ {invoiceAmount.toFixed(2)}
            </Text>
          </View>

          <Text style={styles.smallText}>
            {BillPdfdetails?.invoiceNumber}
          </Text>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Invoice date</Text>
            <Text style={styles.valueText}>
              {BillPdfdetails?.invoiceDate || "N/A"}
            </Text>
          </View>
        <View style={styles.rowBetween}>
  <Text style={styles.label}>
    {isOverdue ? "Overdue on" : "Overdue from"}
  </Text>

<Text
  style={[
    styles.valueText,
    isOverdue && { color: "#FF3B30" },
  ]}
>
  {BillPdfdetails?.dueDate || "N/A"}
</Text>
</View>

          {/* Input */}
          <Text style={styles.inputLabel}>
            {discountType} to apply (Discount)
          </Text>

        <View style={styles.inputWrapper}>
  <TextInput
    style={styles.inputField}
    placeholder={discountType === "Amount" ? "₹ 0.00" : "0 %"}
    keyboardType="numeric"
    value={discount}
    onChangeText={(text) => {
  // ✅ allow only numbers + dot
  let cleaned = text.replace(/[^0-9.]/g, "");

  // ✅ prevent multiple dots
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts[1];
  }

  setDiscount(cleaned);

  const num = Number(cleaned);

  if (cleaned && !isNaN(num) && num > 0) {
    setDiscountErr("");
  }

  if (cleaned && (isNaN(num) || num <= 0)) {
    setDiscountErr("Enter valid discount");
  }
}}
//    onChangeText={(text) => {
//   setDiscount(text);

//   const num = Number(text);

//   if (text && !isNaN(num) && num > 0) {
//     setDiscountErr("");
//   }

//   if (text && (isNaN(num) || num <= 0)) {
//     setDiscountErr("Enter valid discount");
//   }
// }}
  />

  <View style={styles.toggleBox}>
    <TouchableOpacity
      style={[
        styles.toggleBtn,
        discountType === "Amount" && styles.activeToggle,
      ]}
      onPress={() => {
        setDiscount("");
        setDiscountType("Amount");
        setDiscountErr("")
      }}
    >
      <Text
        style={
          discountType === "Amount"
            ? styles.activeText
            : styles.inactiveText
        }
      >
        ₹
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.toggleBtn,
        discountType === "Percentage" && styles.activeToggle,
      ]}
      onPress={() => {
        setDiscount("");
        setDiscountType("Percentage");
        setDiscountErr("");

      }}
    >
      <Text
        style={
          discountType === "Percentage"
            ? styles.activeText
            : styles.inactiveText
        }
      >
        %
      </Text>
    </TouchableOpacity>
  </View>
</View>
        </View>
         {discountErr && (
                    <ErrorMessage message={discountErr} type="error" />
                  )}

      </View>


     
      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.rowBetween}>
          <Text style={{fontFamily: "Gilroy-Medium" }}>Invoice Amount ({BillPdfdetails?.invoiceNumber})</Text>
          <Text style={{fontFamily: "Gilroy-Bold"}}>₹ {invoiceAmount.toFixed(2)}</Text>
        </View>

         {discountType === "Percentage" ? (
    <>
      <View style={styles.rowBetween}>
        <Text style={{ fontFamily: "Gilroy-Medium" }}>
          Applied Percentage
        </Text>
        <Text style={{ fontFamily: "Gilroy-Bold" }}>
          {discount || 0} %
        </Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={{ fontFamily: "Gilroy-Medium" }}>
          Percentage amount be
        </Text>
        <Text style={{ fontFamily: "Gilroy-Bold" }}>
          ₹ {discountValue.toFixed(2)}
        </Text>
      </View>
    </>
  ) : (
    <>
      <View style={styles.rowBetween}>
        <Text style={{ fontFamily: "Gilroy-Medium" }}>
          Discount Applied
        </Text>
        <Text style={{ fontFamily: "Gilroy-Bold",  }}>
          - ₹ {discountValue.toFixed(2)}
        </Text>
      </View>
    </>
  )}



        <View style={styles.rowBetween}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalLabel}>
            ₹ {total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={{fontFamily: "Gilroy-Medium" }}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.applyBtn}
          onPress={handleDiscountApply}
        >
          <Text style={{ color: "#fff", fontFamily: "Gilroy-Medium" }}>Apply →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop:50
  },

  headerTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
    marginLeft: 10,
  },
    backIcon: { width: 22, height: 22, marginRight: 10 },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor:'#FAFAFD',
    padding:10,
    paddingVertical:20
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },

    userImg: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },
    initialCircle: {
    width: 45,
    height: 45,
    borderRadius: 21,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5
  },

  initialText: {
    fontSize: 13,
    fontFamily: "Gilroy-Bold",
    color: "#4B5563",
  },

  name: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
  },

  badge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  badgeText: {
    fontSize: 11,
    color: "#92400E",
  },

  card: {
    paddingHorizontal: 16,
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "Gilroy-Semibold"
  },

  innerCard: {
     borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 8,
    padding: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Gilroy-Regular" 
  },

  valueText: {
    fontSize: 13,
    fontFamily: "Gilroy-Medium" 
  },

  amount: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
  },

  smallText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
    fontFamily: "Gilroy-Semibold"
  },

  inputLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 10,
  fontFamily: "Gilroy-Medium"
  },

  input: {
    borderWidth: 1,
    borderColor: "#4F46E5",
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
    fontFamily: "Gilroy-Regular" 
  },

  summary: {
    backgroundColor: "#F8F8F8",
    margin: 16,
    padding: 12,
    borderRadius: 10,
  },

  totalLabel: {
  fontFamily: "Gilroy-Bold"
  },

  bottomBar: {
    flexDirection: "row",
    padding: 16,
    marginTop: "auto",
    marginBottom:45
  },

  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },

  applyBtn: {
    flex: 1,
    backgroundColor: "#1E45E1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dropdown: {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 8,
  padding: 12,
  marginBottom: 10,
},

dropdownList: {
  backgroundColor: "#fff",
  borderRadius: 8,
  marginBottom: 10,
  elevation: 3,
},

dropdownItem: {
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},

inputWrapper: {
  flexDirection: "row",
  borderWidth: 1,
  borderColor: "#4F46E5",
  borderRadius: 10,
  marginTop: 6,
},

inputField: {
  flex: 1,
  padding: 12,
  fontFamily: "Gilroy-Regular",
},

toggleBox: {
  flexDirection: "row",
  backgroundColor: "#E5E7EB",
  borderRadius: 8,
  margin: 6,
},

toggleBtn: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
},

activeToggle: {
  backgroundColor: "#1E45E1",
},

activeText: {
  color: "#fff",
  fontFamily: "Gilroy-Bold",
},

inactiveText: {
  color: "#000",
},
customerdropdownBox: {
  borderWidth: 1,
  borderColor: "#D4D4D4",
  borderRadius: 10,
  padding: 14,
  marginTop: 6,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

customerDropdownMenu: {
  marginTop: 4,
  borderWidth: 1,
  borderColor: "#DDDDDD",
  borderRadius: 10,
  backgroundColor: "#fff",
  overflow: "hidden",
},

customerOption: {
  paddingVertical: 10,
  paddingHorizontal: 14,
},

customerOptionSelected: {
  backgroundColor: "#1D5BEE",
},

customerOptionText: {
  fontSize: 15,
  color: "#111",
},

customerOptionTextSelected: {
  color: "#fff",
  fontWeight: "600",
},

arrowIcon: {
  width: 18,
  height: 18,
  tintColor: "#6A6A6A",
},
});