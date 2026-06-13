import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,Image
} from "react-native";

// import MobileIcon from "../../../Assets/Images/mobile.png";
import ExpensesIcon from "../../../Assets/Images/direct-right.png";

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

export default function ExpensesTransactions() {
  return (
    <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
           <View style={styles.iconCircle}>
                   <Image source={ExpensesIcon} style={{ height: 24, width: 24 }} />
                 </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {item.type}
            </Text>

            <Text style={styles.status}>
              ✓ {item.status}
              {item.txn ? ` • ${item.txn}` : ""}
            </Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.amount}>
              {item.amount}
            </Text>

            <Text style={styles.date}>
              {item.date}
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
});