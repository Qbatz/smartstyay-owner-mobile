import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,Image , TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// import MobileIcon from "../../../Assets/Images/mobile.png";
import ExpensesIcon from "../../../Assets/Images/direct-right.png";
import SettleIcon from "../../../Assets/Images/SettleIcon.png";


export default function ExpensesTransactions({expense}) {

    const navigation = useNavigation();
     const payments = expense?.expensePayments || [];
  return (
  <FlatList
  data={payments}
  keyExtractor={(item) => item?.id?.toString()}
  ListHeaderComponent={
    expense?.balanceAmount > 0 ? (
      <View style={styles.settlementCard}>
        <View style={styles.settlementHeader}>
          <Image
            source={SettleIcon}
            style={styles.settlementIcon}
          />

          <Text style={styles.settlementTitle}>
            Complete Settlement
          </Text>
        </View>

        <Text style={styles.settlementSubTitle}>
          Remaining payment settlement Due ₹{" "}
          {Number(expense?.balanceAmount || 0).toLocaleString("en-IN")}
        </Text>

        <TouchableOpacity
          style={styles.settlementBtn}
          onPress={() =>
            navigation.navigate("VendorSettlePayment", {
              type: "expense",
              expense,
            })
          }
        >
          <Text style={styles.settlementBtnText}>
            Settle Payment
          </Text>

          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
    ) : null
  }
  renderItem={({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Image
          source={ExpensesIcon}
          style={{ height: 24, width: 24 }}
        />
      </View>

      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={styles.title}>
          {item.paymentMethodName || "Payment"}
        </Text>

        <Text style={styles.status}>
          ✓ Paid
          {item.transactionId
            ? ` • ${item.transactionId}`
            : ""}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.amount}>
          ₹{Number(item.paidAmount || 0).toLocaleString("en-IN")}
        </Text>

        <Text style={styles.date}>
          {item.paymentDate}
        </Text>
      </View>
    </View>
  )}
/>
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
  settlementCard: {
  margin: 16,
  padding: 18,
  borderRadius: 16,
  backgroundColor: "#141497",
},

settlementHeader: {
  flexDirection: "row",
  alignItems: "center",
},

settlementIcon: {
  width: 28,
  height: 28,
  tintColor: "#FFFFFF",
  marginRight: 12,
},

settlementTitle: {
  color: "#FFFFFF",
  fontSize: 20,
  fontFamily: "Gilroy-Bold",
},

settlementSubTitle: {
  color: "#D7DBFF",
  fontSize: 15,
  marginTop: 12,
  fontFamily: "Gilroy-Medium",
  lineHeight: 22,
},

settlementBtn: {
  marginTop: 22,
  alignSelf: "flex-end",
  backgroundColor: "#FFFFFF",
  height: 48,
  borderRadius: 24,
  paddingHorizontal: 22,
  flexDirection: "row",
  alignItems: "center",
},

settlementBtnText: {
  color: "#2457FF",
  fontSize: 15,
  fontFamily: "Gilroy-SemiBold",
},

arrowText: {
  marginLeft: 10,
  color: "#2457FF",
  fontSize: 18,
  fontFamily: "Gilroy-Bold",
},

card: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 20,
  borderBottomWidth: 1,
  borderBottomColor: "#EEF2F7",
},

iconCircle: {
  height: 48,
  width: 48,
  borderRadius: 24,
  backgroundColor: "#EEF2FF",
  alignItems: "center",
  justifyContent: "center",
},

title: {
  fontSize: 18,
  fontFamily: "Gilroy-Bold",
  color: "#111827",
},

status: {
  color: "#22C55E",
  marginTop: 8,
  fontSize: 15,
  fontFamily: "Gilroy-Medium",
},

amount: {
  fontSize: 18,
  fontFamily: "Gilroy-Bold",
  color: "#111827",
},

date: {
  marginTop: 10,
  color: "#6B7280",
  fontSize: 14,
  fontFamily: "Gilroy-Medium",
},
});