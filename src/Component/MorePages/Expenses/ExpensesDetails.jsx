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
import ExpensesInfo from "./ExpensesInfo";
import ExpensesTransactions from "./ExpensesTransaction";
import ExpensesItems from "./ExpensesItems";
import ExpensesComments from "./ExpensesComments";
// import VendorExpenseDetailsSheet from "./VendorExpenseDetails"

export default function ExpensesDetails({ route, navigation }) {
  const { expense } = route.params;

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
  return <ExpensesInfo expense={expense} />;

case "Transactions":
  return <ExpensesTransactions />;

case "Expenses":
  return (
    <ExpensesItems
    //   onExpensePress={(expense) => {
    //     setSelectedExpense(expense);
    //     setShowExpenseSheet(true);
    //   }}
    />
  );

case "Comments":
  return <ExpensesComments />;

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

        {/* <Text style={styles.headerTitle}>
  {expense?.title || "Vegetables 50 KG"}
</Text> */}

        <TouchableOpacity>
          <Image source={ThreeDots} style={styles.dotsIcon} />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}

      <View style={styles.summaryCard}>

  <Text style={styles.expenseMainTitle}>
    {expense?.title || "Vegetables 50 KG"}
  </Text>

  <View style={styles.badgeRow}>
    <View style={styles.expCodeBadge}>
      <Text style={styles.expCodeText}>
        EXP 001
      </Text>
    </View>

    <View style={styles.vendorBadge}>
      <Text style={styles.vendorBadgeText}>
        {expense?.vendor || "Kural kaikai Angadi- Salem"}
      </Text>
    </View>
  </View>

  <View style={styles.amountRow}>
    <Text style={styles.amountLabel}>
      Expense Amount
    </Text>

    <View style={{ alignItems: "flex-end" }}>
      <Text style={styles.amountValue}>
        ₹ {expense?.amount || "6,200.00"}
      </Text>

      <View style={styles.partialBadge}>
        <Text style={styles.partialText}>
          ● Partially Paid
        </Text>
      </View>
    </View>
  </View>

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

 {/* <VendorExpenseDetailsSheet
  visible={showExpenseSheet}
  expense={selectedExpense}
  onClose={() => setShowExpenseSheet(false)}
/> */}
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
    justifyContent:'space-between',
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
    // justifyContent: "center",
    // alignItems: "center",
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
  expenseMainTitle: {
  fontSize: 18,
  fontFamily: "Gilroy-Bold",
  color: "#111827",
  marginBottom: 14,
},

expCodeBadge: {
  backgroundColor: "#EEF2FF",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 4,
},

expCodeText: {
  color: "#1D4ED8",
  fontSize: 12,
  fontFamily: "Gilroy-Semibold",
},

vendorBadge: {
  marginLeft: 8,
  backgroundColor: "#1E3A8A",
  borderRadius: 4,
  paddingHorizontal: 12,
  paddingVertical: 6,
},

vendorBadgeText: {
  color: "#fff",
  fontSize: 12,
},

amountRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginTop: 14,
},

amountLabel: {
  fontSize: 16,
  color: "#6B7280",
},

amountValue: {
  fontSize: 18,
  color: "#111827",
  fontFamily: "Gilroy-Bold",
},

partialBadge: {
  marginTop: 8,
  backgroundColor: "#FFF7ED",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 4,
},

partialText: {
  color: "#F97316",
  fontSize: 12,
},
});