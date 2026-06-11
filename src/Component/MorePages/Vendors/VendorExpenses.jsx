import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const DATA = [
  {
    id: "1",
    title: "Wiring Replacement",
    amount: "₹ 50,000.00",
    status: "Paid",
    date: "03 June 2026",
    code: "EXP-1045",
    items: [
      {
        name: "Tubelight (LED)",
        quantity: 20,
        unit: "Nos",
        rate: 150,
        amount: 3000,
      },
      {
        name: "Electrical Wire Roll (90m)",
        quantity: 2,
        unit: "Nos",
        rate: 1750,
        amount: 3500,
      },
      {
        name: "Modular Switches",
        quantity: 20,
        unit: "Nos",
        rate: 80,
        amount: 1600,
      },
    ],
  },

  {
    id: "2",
    title: "Electrical Repair",
    amount: "₹ 5,000.00",
    status: "Paid",
    date: "31 May 2026",
    code: "EXP-1047",
    items: [
      {
        name: "Switch Board Repair",
        quantity: 5,
        unit: "Nos",
        rate: 500,
        amount: 2500,
      },
      {
        name: "MCB Replacement",
        quantity: 5,
        unit: "Nos",
        rate: 500,
        amount: 2500,
      },
    ],
  },

  {
    id: "3",
    title: "Electric Products",
    amount: "₹ 8,100.00",
    status: "PartiallyPaid",
    date: "26 May 2026",
    code: "EXP-1042",
    items: [
      {
        name: "Tubelight (LED)",
        quantity: 20,
        unit: "Nos",
        rate: 150,
        amount: 3000,
      },
      {
        name: "Electrical Wire Roll (90m)",
        quantity: 2,
        unit: "Nos",
        rate: 1750,
        amount: 3500,
      },
      {
        name: "Modular Switches",
        quantity: 20,
        unit: "Nos",
        rate: 80,
        amount: 1600,
      },
    ],
  },
];

export default function VendorExpenses({
  onExpensePress = () => {},
}) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onExpensePress(item)}
      style={styles.expenseCard}
    >
      <View style={styles.leftSection}>
        <Text style={styles.expenseTitle}>
          {item.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.expenseCode}>
            {item.code}
          </Text>

          <Text style={styles.dot}>•</Text>

          <Text
            style={[
              styles.statusText,
              item.status === "Paid"
                ? styles.paidText
                : styles.partialText,
            ]}
          >
            ✓ {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.amountText}>
          {item.amount}
        </Text>

        <Text style={styles.dateText}>
          {item.date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 120,
  },

  expenseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingVertical: 18,

    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",

    backgroundColor: "#FFFFFF",
  },

  leftSection: {
    flex: 1,
    paddingRight: 15,
  },

  rightSection: {
    alignItems: "flex-end",
  },

  expenseTitle: {
    fontSize: 15,
    fontFamily: "Gilroy-Bold",
    color: "#262626",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  expenseCode: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Gilroy-Medium",
  },

  dot: {
    marginHorizontal: 8,
    color: "#D1D5DB",
    fontSize: 16,
  },

  statusText: {
    fontSize: 12,
    fontFamily: "Gilroy-Medium",
  },

  paidText: {
    color: "#16A34A",
  },

  partialText: {
    color: "#F59E0B",
  },

  amountText: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#262626",
  },

  dateText: {
    marginTop: 10,
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Gilroy-Medium",
  },
});