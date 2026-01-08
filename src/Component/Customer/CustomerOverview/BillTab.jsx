import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const BILL_DATA = [
  {
    id: "IMADV-005",
    type: "Advance",
    amount: "₹2,200",
    status: "Overdue",
    date: "05/11/2025",
  },
  {
    id: "IMINV-985",
    type: "Rent",
    amount: "₹7,200",
    status: "Overdue",
    date: "05/11/2025",
  },
  {
    id: "IMINV-985",
    type: "Rent",
    amount: "₹7,200",
    status: "Paid",
    date: "05/11/2025",
  },
  {
    id: "SSADV-8764",
    type: "Advance",
    amount: "₹3,100",
    status: "Paid",
    date: "05/09/2025",
  },
];

export default function BillTab() {
  return (
    <FlatList
      data={BILL_DATA}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
      renderItem={({ item }) => (
        <View style={styles.row}>
          {/* LEFT */}
          <View>
            <Text style={styles.billId}>{item.id}</Text>

            <View style={styles.subRow}>
              <Text style={styles.billType}>{item.type}</Text>

              <View
                style={[
                  styles.statusBadge,
                  item.status === "Paid"
                    ? styles.paidBadge
                    : styles.overdueBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === "Paid"
                      ? styles.paidText
                      : styles.overdueText,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>

          {/* RIGHT */}
          <View style={styles.rightBox}>
            <Text style={styles.amount}>{item.amount}</Text>
            <Text style={styles.date}>on {item.date}</Text>
          </View>
        </View>
      )}
    />
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
    fontWeight: "600",
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
    fontWeight: "500",
  },

  overdueText: {
    color: "#D97706",
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
    fontWeight: "600",
    color: "#111827",
  },

  date: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
  },
});
