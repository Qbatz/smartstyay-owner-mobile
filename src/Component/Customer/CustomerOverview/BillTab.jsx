import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BillTab({ customerDetails }) {
  const invoiceList = customerDetails?.invoiceResponseList || [];

  console.log("customerDetailsBillTab", invoiceList);

  return (
    <View style={{ paddingBottom: 30 }}>
      {invoiceList.map((item, index) => (
        <View key={index} style={styles.row}>
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
          </View>

          {/* RIGHT */}
          <View style={styles.rightBox}>
            <Text style={styles.amount}>₹{item.totalAmount}</Text>
            <Text style={styles.date}>on {item.dueDate}</Text>
          </View>
        </View>
      ))}
    </View>
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
