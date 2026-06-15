// ExpenseItems.js

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function ExpenseItems() {
  const expenseItems = [
    {
      id: 1,
      name: "Beetroot",
      quantity: 20,
      unit: "Kgs",
      price: 80,
      amount: 1600,
    },
    {
      id: 2,
      name: "Tomato",
      quantity: 30,
      unit: "Kgs",
      price: 60,
      amount: 1800,
    },
    {
      id: 3,
      name: "Brinjal",
      quantity: 20,
      unit: "Kgs",
      price: 75,
      amount: 1500,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary Card */}
    

      {/* Expense Items */}
      {expenseItems.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <Text style={styles.itemTitle}>{item.name}</Text>

          <View style={styles.line} />

          <View style={styles.row}>
            <Text style={styles.label}>Quantity</Text>
            <Text style={styles.value}>{item.quantity}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Unit</Text>
            <Text style={styles.value}>{item.unit}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Per Unit price</Text>
            <Text style={styles.value}>₹ {item.price}.00</Text>
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>
              ₹{item.amount.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },

  summaryLabel: {
    fontSize: 16,
    color: "#60646C",
    fontWeight: "500",
  },

  summaryValue: {
    fontSize: 18,
    color: "#1A1D29",
    fontWeight: "700",
  },

  discountValue: {
    fontSize: 18,
    color: "#FF3B30",
    fontWeight: "700",
  },

  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    overflow: "hidden",
    marginBottom: 16,
  },

  itemTitle: {
    fontSize: 20,
      fontFamily: "Gilroy-Bold",
    color: "#20242D",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },

  line: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  label: {
    fontSize: 12,
    color: "#8D93A1",
    fontFamily: "Gilroy-Semibold",

  },

  value: {
    fontSize: 14,
    color: "#20242D",
     fontFamily: "Gilroy-Semibold" 
  },

  amountSection: {
    marginTop: 8,
    backgroundColor: "#F5F6FA",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  amountLabel: {
    fontSize: 14,
    color: "#5D6B82",
     fontFamily: "Gilroy-Semibold" 
  },

  amountValue: {
    fontSize: 16,
    color: "#1A1D29",
    fontFamily: "Gilroy-Bold",
  },
});