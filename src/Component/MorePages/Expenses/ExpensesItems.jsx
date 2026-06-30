// ExpenseItems.js

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function ExpenseItems({expense}) {
   const expenseItems = expense?.expenseItems || [];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
     {/* Summary Card */}
<View style={styles.summaryCard}>
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>Subtotal</Text>
    <Text style={styles.summaryValue}>
      ₹ {Number(expense?.subTotal || 0).toLocaleString("en-IN")}
    </Text>
  </View>

  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>Discount</Text>
    <Text style={styles.discountValue}>
      -₹ {Number(expense?.discount || 0).toLocaleString("en-IN")}
    </Text>
  </View>
</View>
    

      {/* Expense Items */}
      {expenseItems.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <Text style={styles.itemTitle}>{item?.item}</Text>

          <View style={styles.line} />

          <View style={styles.row}>
            <Text style={styles.label}>Quantity</Text>
            <Text style={styles.value}>{item?.quantity}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Unit</Text>
            <Text style={styles.value}>{item.unit}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Per Unit price</Text>
            <Text style={styles.value}> ₹ {Number(item.unitPrice || 0).toLocaleString("en-IN")}</Text>
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>
              ₹ {Number(item.totalAmount || 0).toLocaleString("en-IN")}
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
   backgroundColor: "#F8F8F8",
  borderRadius: 14,
  paddingVertical: 14,
  paddingHorizontal: 16,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: "#ECECEC",

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 1,
},

summaryRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: 4,
},

summaryLabel: {
  fontSize: 15,
  color: "#60646C",
  fontFamily: "Gilroy-Medium",
},

summaryValue: {
  fontSize: 18,
  color: "#20242D",
  fontFamily: "Gilroy-Bold",
},

discountValue: {
  fontSize: 18,
  color: "#FF3B30",
  fontFamily: "Gilroy-Bold",
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