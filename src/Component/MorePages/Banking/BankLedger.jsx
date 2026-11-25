import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView, Platform, FlatList,
  PanResponder,
  Animated,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator
} from "react-native";
import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useRoute } from "@react-navigation/native";
import FilterIcon from "../../../Assets/Images/filter.png";
import AddIcon from "../../../Assets/Images/add-circle.png";
import AddBankIcon from "../../../Assets/Images/plusIcon.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import BankIcon from "../../../Assets/Images/Expensebank.png";
import UpiIcon from "../../../Assets/Images/Upi_Icon.png";
import CardIcon from "../../../Assets/Images/card.png";
import CashIcon from "../../../Assets/Images/Cash_Icon.png";
import GooglePayIcon from "../../../Assets/Images/GpayIcon.png";
import DeleteIcon from "../../../Assets/Images/trash.png";
import EditIcon from "../../../Assets/Images/editIcon.png";
import SelfTransIcon from "../../../Assets/Images/arrow-transfer.png";
import InvestmentIcon from "../../../Assets/Images/Investment.png";
import ThreeDotsIcon from "../../../Assets/Images/3dots.png";
import MoneyPlus from "../../../Assets/Images/money_plus.png";
import MoneyMinus from "../../../Assets/Images/money-minus.png";
import ArrowUp from "../../../Assets/Images/arrow-up.png";
import ArrowDown from "../../../Assets/Images/arrow-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import SearchIcon from "../../../Assets/Images/SearchIcon.png";
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import MultiSelectDropdown from "../Bills/MultiSelectDropdown";
import FilterDropdown from "../Reports/FilterDropdown";
// import FilterIcon from "../../../Assets/Images/filter.png";



const BankLedger = () => {

  const [showFilter, setShowFilter] = useState(false);

  const route = useRoute();
  const { bankDetails, bankId } = route.params || {};

  const {
    getBankTransactionHistory,
    newtransactionList
  } = useContext(BankingContext);
  const { activeHostelId } = useContext(CommonContexts);
  const detailsY = useRef(new Animated.Value(0)).current;
  const [dropdownResetKey, setDropdownResetKey] = useState(0);

  // Selections inside the sheet (not applied until "Apply")
  const [selectedSource, setSelectedSource] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Filters currently applied to the list
  const [appliedFilters, setAppliedFilters] = useState({ source: [], period: null });

  // Pagination
  const PAGE_SIZE = 20;
  const [transactionList, setTransactionList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOptions, setFilterOptions] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const isFetching = useRef(false);
  const requestIdRef = useRef(0);
  const endReachedDuringMomentum = useRef(true);

  const toApiFilters = (filters) => ({
    source: (filters?.source || []).map((item) => item?.type).filter(Boolean),
    dateFilter: filters?.period?.type || null,
  });

  const fetchTransactions = async (page = 1, filters = appliedFilters) => {
    if (!activeHostelId || !bankId) return;

    
    const requestId = page === 1 ? ++requestIdRef.current : requestIdRef.current;
    isFetching.current = true;
    page === 1 ? setInitialLoading(true) : setPageLoading(true);

    try {
      const res = await getBankTransactionHistory(
        activeHostelId,
        bankId,
        page,
        PAGE_SIZE,
        toApiFilters(filters)
      );

      if (requestId !== requestIdRef.current) return;

      if (res?.success) {
        const data = res.response || {};
        const list = Array.isArray(data.transactions) ? data.transactions : [];

        setTransactionList((prev) => (page === 1 ? list : [...prev, ...list]));
        setCurrentPage(data.currentPage || page);
        setTotalPages(data.totalPages || 1);
        if (data.filterOptions) setFilterOptions(data.filterOptions);
      } else if (page === 1) {
        setTransactionList([]);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        isFetching.current = false;
        setInitialLoading(false);
        setPageLoading(false);
      }
    }
  };

  useEffect(() => {
    if (activeHostelId && bankId) {
      fetchTransactions(1, appliedFilters);
    }
  }, [activeHostelId, bankId]);

  const hasMore = currentPage < totalPages;

  const handleLoadMore = () => {
    if (
      endReachedDuringMomentum.current ||
      isFetching.current ||
      !hasMore
    ) return;
    endReachedDuringMomentum.current = true;
    fetchTransactions(currentPage + 1, appliedFilters);
  };

 
  const options = filterOptions || newtransactionList?.filterOptions;
  const sourceFilter = options?.source || [];
 
  const periodFilter = (options?.dateFilter || []).filter(
    (item) => item?.type !== "CUSTOM"
  );


  const detailsfilter = useMemo(() =>
    PanResponder.create({

      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) detailsY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1.2) {
          Animated.timing(detailsY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {

            setShowFilter(false);
          });
        } else {
          Animated.spring(detailsY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(detailsY, { toValue: 0, useNativeDriver: true }).start();
      },
    }),
    [detailsY]);


  const transactions = [
    {
      id: 1,
      type: "expense",
      title: "Expense",
      amount: "₹ 12,500.00",
      date: "18 July 2026, 10:30 AM",
      icon: ArrowDown,
      account: BankIcon,
    },
    {
      id: 2,
      type: "transfer",
      title: "Self transfer",
      amount: "₹ 2,700.00",
      date: "18 July 2026, 10:30 AM",
      icon: SelfTransIcon,
      from: GooglePayIcon,
      to: CardIcon,
    },
    {
      id: 3,
      type: "income",
      title: "Income",
      amount: "₹ 2,700.00",
      date: "18 July 2026, 10:30 AM",
      icon: ArrowUp,
      account: GooglePayIcon,
    },
    {
      id: 4,
      type: "investment",
      title: "Investment",
      amount: "₹ 27,000.00",
      date: "18 July 2026, 10:30 AM",
      icon: InvestmentIcon,
      account: GooglePayIcon,
    },
  ];

  const formatDate = (date) => {
    if (!date) return "-";

    let d;

    if (
      typeof date === "string" &&
      /^\d{2}\/\d{2}\/\d{4}$/.test(date)
    ) {
      const [day, month, year] = date.split("/");
      d = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
    } else {
      d = new Date(date);
    }

    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;
  };


  const openFilter = () => {
   
    setSelectedSource(appliedFilters.source);
    setSelectedMonth(appliedFilters.period);
    detailsY.setValue(0);
    setShowFilter(true);
  };

  const applyFilter = () => {
    const next = {
      source: Array.isArray(selectedSource) ? selectedSource : [],
      period: selectedMonth || null,
    };
    setAppliedFilters(next);
    setShowFilter(false);
    fetchTransactions(1, next);
  };

  const resetFilter = () => {
    const cleared = { source: [], period: null };
    setSelectedSource([]);
    setSelectedMonth(null);
    setAppliedFilters(cleared);
    setDropdownResetKey((k) => k + 1);
    setShowFilter(false);
    fetchTransactions(1, cleared);
  };

  return (
    <>
      {/* <View style={styles.filterRow}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.filterChipActive}>
                        <Text style={styles.filterChipTextActive}>All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterChipText}>Category</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.filterIconBtn}
                    onPress={() => setShowFilter(true)}
                >
                    <Image source={FilterIcon} style={{ width: 18, height: 18 }} />
                </TouchableOpacity>
            </View> */}


      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        {/* <Text style={styles.todayText}>Today</Text> */}

        {/* {transactions?.map((item) => (
                    <TouchableOpacity
                        key={item?.id}
                        style={styles.transactionCard}
                    >

                        <View style={styles.leftSection}>

                            <View
                                style={[
                                    styles.iconContainer,
                                    item.type === "expense" && { backgroundColor: "#EB2D2D" },
                                    item.type === "income" && { backgroundColor: "#05964B" },
                                    item.type === "transfer" && { backgroundColor: "#2F4DE0" },
                                    item.type === "investment" && { backgroundColor: "#5A2EA6" },
                                ]}
                            >
                                <Image source={item.icon} style={styles.transactionIcon} />
                            </View>

                            <View style={{ marginLeft: 18 }}>
                                <Text style={styles.transactionTitle}>
                                    {item.title}
                                </Text>

                                <Text style={styles.transactionDate}>
                                    {item.date}
                                </Text>
                            </View>

                        </View>

                        <View style={styles.rightSection}>

                            <Text style={styles.transactionAmount}>
                                {item.amount}
                            </Text>

                            {item.type === "transfer" ? (

                                <View style={styles.transferRow}>
                                    <Image source={item.from} style={styles.smallIcon} />
                                    <Text style={styles.arrow}>→</Text>
                                    <Image source={item.to} style={styles.smallIcon} />
                                </View>

                            ) : (

                                <Image
                                    source={item.account}
                                    style={styles.smallIcon}
                                />

                            )}

                        </View>

                    </TouchableOpacity>
                ))} */}

        {initialLoading && transactionList.length === 0 ? (
          <View style={{ paddingVertical: 80, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#1E45E1" />
          </View>
        ) : transactionList.length > 0 ? (
          <FlatList
            data={transactionList}
            keyExtractor={(item, index) => String(item?.transactionId ?? index)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            onMomentumScrollBegin={() => {
              endReachedDuringMomentum.current = false;
            }}
            ListFooterComponent={
              pageLoading ? (
                <ActivityIndicator size="small" color="#1E45E1" style={{ marginVertical: 16 }} />
              ) : null
            }
            renderItem={({ item, index }) => {
              const isCredit = item.type === "CREDIT";
              return (
                <TouchableOpacity
                  key={item.transactionId}
                  style={styles.transactionCard}
                >
                  <View style={styles.leftSection}>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: isCredit
                            ? "#05964B"
                            : "#EB2D2D",
                        },
                      ]}
                    >
                      <Image
                        source={isCredit ? ArrowUp : ArrowDown}
                        style={styles.transactionIcon}
                      />
                    </View>

                    <View style={{ marginLeft: 18 }}>
                      <Text style={styles.transactionTitle}>
                        {item.source || "Transaction"}
                      </Text>

                      <Text style={styles.transactionDate}>
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightSection}>
                    <Text style={styles.transactionAmount}>
                      {formatAmount(item.transactionAmount)}
                    </Text>

                    <Image
                      source={
                        item.bankAccountType
                          ? BankIcon
                          : item.cashAccountType
                            ? CashIcon
                            : CardIcon
                      }
                      style={styles.smallIcon}
                    />
                  </View>
                </TouchableOpacity>
              );
            }} />
          // bankTransactionHistory.map((item) => {
          //   const isCredit = item.type === "CREDIT";

          //   return (
          //     <TouchableOpacity
          //       key={item.transactionId}
          //       style={styles.transactionCard}
          //     >
          //       <View style={styles.leftSection}>
          //         <View
          //           style={[
          //             styles.iconContainer,
          //             {
          //               backgroundColor: isCredit
          //                 ? "#05964B"
          //                 : "#EB2D2D",
          //             },
          //           ]}
          //         >
          //           <Image
          //             source={isCredit ? ArrowUp : ArrowDown}
          //             style={styles.transactionIcon}
          //           />
          //         </View>

          //         <View style={{ marginLeft: 18 }}>
          //           <Text style={styles.transactionTitle}>
          //             {item.source || "Transaction"}
          //           </Text>

          //           <Text style={styles.transactionDate}>
          //             {formatDate(item.createdAt)}
          //           </Text>
          //         </View>
          //       </View>

          //       <View style={styles.rightSection}>
          //         <Text style={styles.transactionAmount}>
          //           {formatAmount(item.transactionAmount)}
          //         </Text>

          //         <Image
          //           source={
          //             item.bankAccountType
          //               ? BankIcon
          //               : item.cashAccountType
          //                 ? CashIcon
          //                 : CardIcon
          //           }
          //           style={styles.smallIcon}
          //         />
          //       </View>
          //     </TouchableOpacity>
          //   );
          // })
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 80,
            }}

          >
            <Image
              source={require("../../../Assets/Images/Empty_state.png")}
              style={{
                width: 130,
                height: 130,
                resizeMode: "contain",
              }}
            />

            <Text
              style={{
                marginTop: 15,
                fontSize: 16,
                color: "#6B7280",
                fontFamily: "Gilroy-Medium",
              }}
            >
              No Transactions Found
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.filterBtn}
        onPress={openFilter}
      >
        <Image source={FilterIcon} style={{ width: 20, height: 20 }} />
      </TouchableOpacity>


      <Modal
        visible={showFilter}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[styles.transactionSheet, { transform: [{ translateY: detailsY }] }]}
            {...detailsfilter.panHandlers}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.filterHeaderRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={FilterIcon} style={{ width: 30, height: 30 }} />
                <Text style={styles.filterTitle}>  Filter by</Text>
              </View>
            </View>



            <Text style={styles.label}>Source</Text>

            <FilterDropdown
              key={`source-${dropdownResetKey}`}
              options={sourceFilter}
              value={selectedSource}
              multiSelect={true}
              onSelect={(value) => setSelectedSource(Array.isArray(value) ? value : [])}
              placeholder="Select Source"
            />


            <Text style={styles.label}>Period</Text>

            <FilterDropdown
              key={`Period-${dropdownResetKey}`}
              options={periodFilter}
              value={selectedMonth}
              multiSelect={false}
              onSelect={(value) => setSelectedMonth(value)}
              placeholder="Select Period"
            />







            <View style={styles.bottomButtons}>
                        <TouchableOpacity style={styles.resetBtn} onPress={resetFilter}>
                          <Text style={styles.resetBtnText}>Reset All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
                          <Text style={styles.applyText}>Apply</Text>
                        </TouchableOpacity>
                      </View>
          </Animated.View>
        </View>
      </Modal>
    </>


  )

}
export default BankLedger

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 14,
    paddingHorizontal: 2,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginLeft: 8
  },

  filterChipActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF2FF",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  filterChipText: {
    fontSize: 13,
    color: "#374151",
  },

  filterChipTextActive: {
    fontSize: 13,
    color: "#2D6CDF",
    fontFamily: "Gilroy-Semibold",
  },

  filterIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    // backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  chipContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  chipArrow: {
    width: 14,
    height: 14,
    marginLeft: 6,
  },
  todayText: {
    fontSize: 18,
    fontFamily: "Gilroy-SemiBold",
    color: "#1A1A1A",
    marginBottom: 18,
  },

  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },

  leftSection: {
    flexDirection: "row",
    flex: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  transactionIcon: {
    width: 23,
    height: 23,
    resizeMode: "contain",
    tintColor: "#FFFFFF", // white icon
  },

  transactionTitle: {
    fontSize: 15,
    color: "#222",
    fontFamily: "Gilroy-SemiBold",
  },

  transactionDate: {
    fontSize: 14,
    color: "#777",
    marginTop: 8,
    fontFamily: "Gilroy-Regular",
  },

  rightSection: {
    alignItems: "flex-end",
  },

  transactionAmount: {
    fontSize: 18,
    color: "#222",
    fontFamily: "Gilroy-Bold",
  },

  transferRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  smallIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },

  arrow: {
    marginHorizontal: 8,
    fontSize: 18,
    color: "#777",
  },
  filterBtn: {
    position: "absolute",
    bottom: 110,
    right: 30,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    elevation: 5,

    borderWidth: 0.4,
    borderColor: '#D9D9D9',
    // borderRadius: 12,

    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },

    // Android
    elevation: 1,
  },
  sheetOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    zIndex: 9999,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  transactionSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 30,
    minHeight: 400,
  },
  sheetHandle: {
    width: 60,
    height: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 30,
    marginBottom: 15,
  },
  filterHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

  filterTitle: { fontSize: 20, fontFamily: "Gilroy-Bold", },
  label: {
    fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 16, marginBottom: 10
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 70,
    marginBottom: 25
  },

  resetBtn: {
    backgroundColor: "#F2F3FF",
    paddingVertical: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#2D6CDF",
    paddingVertical: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },


  resetText: {
    color: "#2D6CDF",
    fontFamily: "Gilroy-Semibold",
  },
  resetBtnText: { color: "#1E45E1", fontFamily: "Gilroy-Bold" },
   applyText: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "Gilroy-Semibold",
  },


})

