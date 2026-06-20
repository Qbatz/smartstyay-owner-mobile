import React , {useState , useEffect , useContext} from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,Image
} from "react-native";
import { VendorContext } from "../../../Context/VendorContext";
import { useHasPermission } from "../../../Utils/useHasPermission"
import { CustomerContext } from "../../../Context/CustomerContext"
import { CommonContexts } from "../../../Context/CommonContext";
import Loader from "../../../Component/Loader/Loader"
import SuccessModal from "../../../ToastFile/ToastPage";
// import MobileIcon from "../../../Assets/Images/mobile.png";
import ExpensesIcon from "../../../Assets/Images/direct-right.png";
import EmptyState from "../../../Assets/Images/Empty_state.png"

const DATA = [
  {
    id: "1",
    type: "CASH",
    amount: "₹12,530",
    status: "Paid",
    date: "17 Feb 2025",
  },
  {
    id: "2",
    type: "UPI",
    amount: "₹330",
    status: "Paid",
    date: "30 Dec 2025",
    txn: "TNX897554",
  },
  {
    id: "3",
    type: "UPI",
    amount: "₹330",
    status: "Paid",
    date: "17 Nov 2025",
    txn: "TNX898794",
  },
];

export default function VendorTransactions({vendor ,}) {
  
   


     const {
    getVendorExpenses,
    vendorExpenses,
    getVendorExpensePayments,
    vendorExpensePayments,loading
  } = useContext(VendorContext);
  
  useEffect(() => {
    // getVendorExpenses(vendor?.id);
    getVendorExpensePayments(vendor?.id);
  }, [])

  console.log("vendorExpensePayments", vendorExpensePayments);

  return (

    <>
 {/* {loading && <Loader />} */}

   <FlatList
  data={vendorExpensePayments?.payments || []}
  keyExtractor={(item) => item.id?.toString()}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Image
          source={ExpensesIcon}
          style={{ height: 24, width: 24 }}
        />
      </View>

      <View
        style={{
          flex: 1,
          marginLeft: 12,
        }}
      >
        <Text style={styles.title}>
          {item?.paymentMethod || "Payment"}
        </Text>

        <Text style={styles.status}>
          ✓ Paid
          {item?.transactionId
            ? ` • ${item.transactionId}`
            : ""}
        </Text>

        {!!item?.notes && (
          <Text
            style={{
              color: "#6B7280",
              marginTop: 4,
              fontSize: 12,
            }}
          >
            {item.notes}
          </Text>
        )}
      </View>

      <View
        style={{
          alignItems: "flex-end",
        }}
      >
        <Text style={styles.amount}>
          ₹{" "}
          {Number(
            item?.paidAmount || 0
          ).toLocaleString()}
        </Text>

        <Text style={styles.date}>
          {item?.paymentDate}
        </Text>
      </View>
    </View>
  )}
  ListEmptyComponent={
<View style={styles.emptyContainer}>
    <Image
      source={EmptyState}
      style={styles.emptyIcon}
      resizeMode="contain"
    />

    <Text style={styles.emptyTitle}>
      No Transaction
    </Text>

    <Text style={styles.emptySubTitle}>
      No Transaction have been added yet.
    </Text>
  </View>
  }
/>
</>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  leftIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  title: {
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
  },

  status: {
    color: "#16A34A",
    marginTop: 8,
  },

  amount: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
  },

  date: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 12,
  },
   iconCircle: {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: "#E7EDFF",
    alignItems: "center",
    justifyContent: "center",
  },
   emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
  marginTop: 20,
},

emptyIcon: {
  width: 200,
  height: 100,
  // opacity: 0.5,
},

emptyTitle: {
  marginTop: 4,
  fontSize: 18,
  color: "#111827",
  fontFamily: "Gilroy-Bold",
},

emptySubTitle: {
  marginTop: 6,
  fontSize: 14,
  color: "#6B7280",
  textAlign: "center",
},
});