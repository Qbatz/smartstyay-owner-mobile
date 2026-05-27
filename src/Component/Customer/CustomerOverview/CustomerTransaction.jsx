import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import EmptyState from "../../../Assets/Images/Empty_state.png";


export default function CustomerTransactions({ customerDetails,showTransactionDetails,selectedTransaction }) {

  const transactionList = customerDetails?.transactionList || []


  return (
    <>
      <View style={{ paddingBottom: 30 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>

          {
            !transactionList || transactionList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Image source={EmptyState} style={styles.image} resizeMode="contain" />
                <Text style={styles.emptyText}>
                  No Transactions found
                </Text>
              </View>
            ) : (
              transactionList.map((item, index) => (
                <TouchableOpacity key={item.id || index} style={styles.row}
                onPress={()=>{showTransactionDetails()
                  selectedTransaction(item)}
                } >
                  {/* LEFT */}
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.billId}>{item.billName}</Text>

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

                    <View style={styles.subRow}>
                      <Text style={styles.billType}>{item.paidTo}</Text>

                      <Text style={styles.statusText}>
                        {item.transactionReferenceNumber}
                      </Text>
                    </View>
                  </View>

                  {/* RIGHT */}
                  <View style={styles.rightBox}>
                    <Text style={styles.amount}>₹{item.amountPaid}</Text>
                    <Text style={styles.date}>on {item.transactionDate}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )
          }
        </ScrollView>

      </View>
    </>
  )
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
    marginTop: 10
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
    alignItems: 'center', justifyContent: 'center', marginLeft: 10
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
    marginTop: 11,
  },
  addBtn: {
    // position: "absolute",
    // bottom: 0,
    // right: 10,
    // backgroundColor: "#1D5DFF",
    // width: 55,
    // height: 55,
    // borderRadius: 30,
    // justifyContent: "center",
    // alignItems: "center",
    // elevation: 6,

    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#1D5DFF",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
   image: {
    width: 180,
    height: 180,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80, // little push to center nicely
  },

  emptyText: {
    marginTop: 20,
    fontSize: 15,
    color: "#6B7280",
  },
});