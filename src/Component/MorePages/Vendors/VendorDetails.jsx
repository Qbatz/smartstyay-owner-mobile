import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import ThreeDots from "../../../Assets/Images/3dots.png";

import VendorInfo from "./VendorInfo";
import VendorTransactions from "./VendorTransactions";
import VendorExpenses from "./VendorExpenses";
import VendorComments from "./VendorComments";
import VendorExpenseDetailsSheet from "./VendorExpenseDetails"

export default function VendorDetails({ route, navigation }) {
  const { vendor } = route.params;

  const [activeTab, setActiveTab] = useState("Info");

  const [showExpenseSheet, setShowExpenseSheet] = useState(false);
const [selectedExpense, setSelectedExpense] = useState(null);

  const tabs = [
    "Info",
    "Transactions",
    "Expenses",
    "Comments",
  ];

  const renderContent = () => {
    switch (activeTab) {
    case "Info":
  return <VendorInfo vendor={vendor} />;

case "Transactions":
  return <VendorTransactions />;

case "Expenses":
  return (
    <VendorExpenses
      onExpensePress={(expense) => {
        setSelectedExpense(expense);
        setShowExpenseSheet(true);
      }}
    />
  );

case "Comments":
  return <VendorComments />;

      default:
        return null;
    }
  };

  return (
    <>
   
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {vendor?.firstName || "Vendor"}
        </Text>

        <TouchableOpacity>
          <Image source={ThreeDots} style={styles.dotsIcon} />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}

      <View style={styles.summaryCard}>

        <View style={styles.badgeRow}>
          <View style={styles.vendorCode}>
            <Text style={styles.vendorCodeText}>
              VEN {vendor?.id}
            </Text>
          </View>

          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>
              Active
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>
              Total Paid
            </Text>

            <Text style={styles.statValue}>
              ₹83,000
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>
              Total Expenses
            </Text>

            <Text style={styles.statValue}>
              ₹85,000
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>
              Outstanding
            </Text>

            <Text
              style={[
                styles.statValue,
                { color: "#F97316" },
              ]}
            >
              ₹2,000
            </Text>
          </View>

        </View>

        <TouchableOpacity style={styles.settleBtn}>
          <Text style={styles.settleText}>
            Settle Payment →
          </Text>
        </TouchableOpacity>

      </View>

      {/* Tabs */}

      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab &&
                    styles.activeTabText,
                ]}
              >
                {tab}
              </Text>

              {activeTab === tab && (
                <View
                  style={styles.activeIndicator}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}

      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

    </View>

 <VendorExpenseDetailsSheet
  visible={showExpenseSheet}
  expense={selectedExpense}
  onClose={() => setShowExpenseSheet(false)}
/>
 </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },

  header: {
    height: 55,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
      backgroundColor: "#F8F9FF",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Gilroy-Semibold",
  },

  backIcon: {
    width: 22,
    height: 22,
  },

  dotsIcon: {
    width: 25,
    height: 25,
  },

  summaryCard: {
    backgroundColor: "#F8F9FF",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  badgeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  vendorCode: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },

  vendorCodeText: {
    fontSize: 11,
  },

  activeBadge: {
    backgroundColor: "#16A34A",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  activeText: {
    color: "#fff",
    fontSize: 11,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statBox: {
    flex: 1,
    alignItems: "center",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  statValue: {
    fontSize: 20,
    marginTop: 8,
    fontFamily: "Gilroy-Bold",
  },

  settleBtn: {
    marginTop: 18,
    backgroundColor: "#2D5BFF",
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  settleText: {
    color: "#fff",
    fontFamily: "Gilroy-Semibold",
  },

  tabWrapper: {
    backgroundColor: "#fff",
  },

  tabItem: {
    marginHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  tabText: {
    fontSize: 14,
    color: "#666",
  },

  activeTabText: {
    color: "#2D5BFF",
    fontFamily: "Gilroy-Semibold",
  },

  activeIndicator: {
    height: 2,
    width: "100%",
    backgroundColor: "#2D5BFF",
    marginTop: 8,
  },
});