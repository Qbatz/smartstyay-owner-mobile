import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import FilterIcon from "../../../Assets/Images/filter.png";
import AddIcon from "../../../Assets/Images/add-circle.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";

export default function BankingScreen() {
  const navigation = useNavigation();

  const [selectedBank, setSelectedBank] = useState(null);


  const bankList = [
    {
      id: 1,
      title: "Canara Bank",
      subtitle: "Savings A/C",
      name: "Immanuel",
      acc: "4561 2013 6210 6540",
      balance: "₹2,500",
    },
    {
      id: 2,
      title: "UPI",
      subtitle: "Net Banking",
      name: "Immanuel",
      acc: "imman@oksbi",
      balance: "₹2,100",
    },
    {
      id: 3,
      title: "Cash",
      subtitle: "Petty Cash",
      name: "Immanuel",
      acc: "",
      balance: "₹4,320",
    },
  ];

  const transactions = [
    { id: 1, type: "income", title: "Record Payment", category: "Rent Income", amount: "+ ₹7,500.00", date: "12 May 2025" },
    { id: 2, type: "expense", title: "Asset Purchase", category: "Capital Expenditure", amount: "- ₹12,500.00", date: "12 May 2025" },
    { id: 3, type: "expense", title: "Checkout Refund", category: "Checkout", amount: "- ₹1,250.00", date: "12 May 2025" },
    { id: 4, type: "income", title: "Bills", category: "Income", amount: "+ ₹1,250.00", date: "12 May 2025" },
    { id: 5, type: "expense", title: "Checkout", category: "Checkout", amount: "- ₹1,200.00", date: "12 May 2025" },
    { id: 6, type: "expense", title: "Assest", category: "Checkout", amount: "- ₹1,100.00", date: "12 May 2025" },
    { id: 7, type: "expense", title: "Checkout", category: "Checkout", amount: "- ₹1,200.00", date: "12 May 2025" },
    { id: 8, type: "expense", title: "Assest", category: "Checkout", amount: "- ₹1,100.00", date: "12 May 2025" },
        { id: 9, type: "expense", title: "Assest", category: "Checkout", amount: "- ₹1,100.00", date: "12 May 2025" },
    { id: 10, type: "expense", title: "Checkout", category: "Checkout", amount: "- ₹1,200.00", date: "12 May 2025" },
    { id: 11, type: "expense", title: "Assest", category: "Checkout", amount: "- ₹1,100.00", date: "12 May 2025" },
  ];

    // SCROLL ANIMATION STATE
  const scrollY = useState(new Animated.Value(0))[0];

  // BANK LIST COLLAPSE ANIMATION
  const bankListHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [165, 0],
    extrapolate: "clamp",
  });

  const bankListOpacity = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });


  return (
    <View style={styles.container}>

      <View style={styles.stickyHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.heading}>Banking</Text>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/622/622669.png" }}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#A1A1A1"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* ACTUAL SCREEN CONTENT */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 130 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >

        {/* BANK LIST TITLE */}
        <Animated.View style={{ opacity: bankListOpacity }}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Bank List</Text>

            <TouchableOpacity style={styles.addBankBtn}>
              <Text style={styles.addBankText}>Add Bank</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* BANK LIST (COLLAPSIBLE) */}
        <Animated.View style={{ height: bankListHeight, opacity: bankListOpacity }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {bankList.map((item) => (
              <View key={item.id} style={styles.bankCard}>
                <TouchableOpacity
                  style={styles.moreIcon}
                  onPress={() => setSelectedBank(item)}
                >
                  <Text style={{ fontSize: 20 }}>⋮</Text>
                </TouchableOpacity>

                <Text style={styles.bankTitle}>{item.title}</Text>
                <Text style={styles.bankSub}>{item.subtitle}</Text>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.acc}>{item.acc}</Text>
                </View>

                <View style={styles.balanceRow}>
                  <Text style={styles.balanceText}>Balance</Text>
                  <Text style={styles.balanceAmount}>{item.balance}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ALL TRANSACTIONS */}
        <View style={[styles.rowBetween, { marginBottom: 15 }]}>
          <Text style={styles.sectionTitle}>All Transactions</Text>
        </View>

        {/* TRANSACTION LIST */}
        {transactions.map((t) => (
          <View key={t.id} style={styles.transCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[
                  styles.iconArrow,
                  { backgroundColor: t.type === "income" ? "#E4FFE8" : "#FFE8E8" },
                ]}
              >
                <Text style={{ color: t.type === "income" ? "green" : "red" }}>
                  {t.type === "income" ? "↑" : "↓"}
                </Text>
              </View>

              <View>
                <Text style={styles.transTitle}>{t.title}</Text>
                <Text style={styles.category}>{t.category}</Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.date}>{t.date}</Text>
              <Text
                style={[
                  styles.amount,
                  { color: t.type === "income" ? "green" : "red" },
                ]}
              >
                {t.amount}
              </Text>
            </View>
          </View>
        ))}

      </Animated.ScrollView>

      {/* FLOATING FILTER BUTTON */}
      <TouchableOpacity style={styles.filterBtn}>
        <Image source={FilterIcon} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>

      {/* FLOATING ADD BUTTON */}
      <TouchableOpacity style={styles.addBtn}>
        <Image source={AddIcon} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>

      {/* POPUP MENU */}
      <Modal transparent visible={!!selectedBank} animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedBank(null)}
        >
          <View style={styles.popupCard}>
            <TouchableOpacity style={styles.popupItem}>
              <Text style={styles.popupBlue}>⇅ Self Transfer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupItem}>
              <Text style={styles.popupBlue}>✎ Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupItem}>
              <Text style={styles.popupRed}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* TOP STICKY HEADER */
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#fff",
    zIndex: 999,
    // elevation: 6,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  backIcon: { width: 20, height: 20, marginRight: 10 },

  heading: {
    fontSize: 22,
    fontWeight: "700",
  },

  /* SEARCH BAR */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 6,
  },

  searchIcon: { width: 20, height: 20, tintColor: "#9B9B9B", marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#000" },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal:16,
    alignItems: "center",
    marginTop: 20,
  },

  addBankBtn: {
    backgroundColor: "#3D6DFF",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
  },

  addBankText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  /* BANK CARD */
  bankCard: {
    width: 220,
    padding: 16,
    height: 165,
    backgroundColor: "#F7F8FF",
    borderRadius: 18,
    marginHorizontal: 16,
    position: "relative",
  },

  moreIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },

  bankTitle: { fontSize: 17, fontWeight: "700" },
  bankSub: { color: "#777" },
  name: { fontSize: 15, fontWeight: "600" },
  acc: { fontSize: 13, color: "#666" },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  balanceText: { color: "#777" },
  balanceAmount: { fontWeight: "700" },

  /* TRANSACTION CARD */
  transCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
  },

  iconArrow: {
    height: 36,
    width: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  transTitle: { fontSize: 16, fontWeight: "600" },
  category: { fontSize: 13, color: "#666" },
  date: { fontSize: 12, color: "#777" },
  amount: { fontSize: 16, fontWeight: "700" },

  /* FLOATING BUTTONS */
  filterBtn: {
    position: "absolute",
    bottom: 140,
    right: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 6,
  },

  addBtn: {
    position: "absolute",
    bottom: 70,
    right: 20,
    backgroundColor: "#1D5DFF",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  /* POPUP */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupCard: {
    width: 180,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    elevation: 8,
  },

  popupItem: { paddingVertical: 12 },
  popupBlue: { color: "#3D6DFF", fontSize: 15 },
  popupRed: { color: "red", fontSize: 15 },
});
