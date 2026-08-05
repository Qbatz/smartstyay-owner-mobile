import React, { useState, useRef, useContext, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Image,
    ScrollView, Platform, FlatList
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


const BankLedger = () => {

     const [showFilter, setShowFilter] = useState(false);

        const route = useRoute();
       const { bankDetails, bankId } = route.params || {};

     const {
  getBankTransactionHistory,
  bankTransactionHistory,
} = useContext(BankingContext);
 const { activeHostelId } = useContext(CommonContexts);

useEffect(() => {
  if (activeHostelId && bankId) {
    getBankTransactionHistory(activeHostelId, bankId);
  }
}, [activeHostelId, bankId]);

console.log("bankTransactionHistory", bankTransactionHistory);


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

  const d = new Date(date.replace(" ", "T"));

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAmount = (amount) => {
  return `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;
};

    return (
        <>
            <View style={styles.filterRow}>
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
            </View>


            <View style={{ paddingHorizontal: 20 }}>
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

                {bankTransactionHistory?.length > 0 ? (
  bankTransactionHistory.map((item) => {
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
  })
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
    todayText:{
    fontSize:18,
    fontFamily:"Gilroy-SemiBold",
    color:"#1A1A1A",
    marginBottom:18,
},

transactionCard:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingVertical:18,
    borderBottomWidth:1,
    borderBottomColor:"#ECECEC",
},

leftSection:{
    flexDirection:"row",
    flex:1,
},

iconContainer: {
  width: 56,
  height: 56,
  borderRadius: 28,
  justifyContent: "center",
  alignItems: "center",
},

transactionIcon: {
  width: 26,
  height: 26,
  resizeMode: "contain",
  tintColor: "#FFFFFF", // white icon
},

transactionTitle:{
    fontSize:18,
    color:"#222",
    fontFamily:"Gilroy-SemiBold",
},

transactionDate:{
    fontSize:14,
    color:"#777",
    marginTop:8,
    fontFamily:"Gilroy-Regular",
},

rightSection:{
    alignItems:"flex-end",
},

transactionAmount:{
    fontSize:18,
    color:"#222",
    fontFamily:"Gilroy-Bold",
},

transferRow:{
    flexDirection:"row",
    alignItems:"center",
    marginTop:10,
},

smallIcon:{
    width:26,
    height:26,
    resizeMode:"contain",
},

arrow:{
    marginHorizontal:8,
    fontSize:18,
    color:"#777",
},

})

