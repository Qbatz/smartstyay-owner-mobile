import React, { useState, useEffect, useContext } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity, Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { VendorContext } from "../../../Context/VendorContext";
import { useHasPermission } from "../../../Utils/useHasPermission"
import { CustomerContext } from "../../../Context/CustomerContext"
import { CommonContexts } from "../../../Context/CommonContext";
import { ExpensesContext } from "../../../Context/ExpensesContext";
import Loader from "../../../Component/Loader/Loader"
import SuccessModal from "../../../ToastFile/ToastPage";
import EmptyState from "../../../Assets/Images/Empty_state.png"

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



export default function VendorExpenses({ vendor,
  onExpensePress = () => { },
}) {

  const { loading,
    getVendorExpenses,
    vendorExpenses,
    getVendorExpensePayments,
    vendorExpensePayments, 
  } = useContext(VendorContext);
 
      const { expensesList, GetExpenseList, IntializeexpensesList, GetInitializeExpense,
          DeleteExpense
      } = useContext(ExpensesContext);

    const { activeHostelId } = useContext(CommonContexts)

     const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modalMessage, setModalMessage] = useState("");
      const [modalType, setModalType] = useState("success");


  const navigation = useNavigation()



  useEffect(() => {
    getVendorExpenses(vendor?.id);
    // getVendorExpensePayments(vendor?.id);
  }, [])

  useEffect(() => {
    if (activeHostelId) {
      const res = GetInitializeExpense(activeHostelId)
      console.log("res", res);
    }
  }, [activeHostelId])



  const categoryList = IntializeexpensesList?.listExpenses || [];


  const handleAddExpenses = () => {
    if (categoryList?.length === 0) {
      setModalType("warning");
      setModalMessage("Please add a Expense Category option in Settings");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
      return;
    }

    navigation.navigate("AddExpensesPage", {
      vendorData: vendor
    })

  }


  console.log("vendorExpenses", vendorExpenses);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        onExpensePress({
          id: item.expenseId,
          title: item.categoryName,
          amount: item.totalAmount,
          date: item.transactionDate,
          code: item.referenceNumber,
          status: item.paymentStatus,
          items: (item.expenseItems || []).map(
            (expenseItem) => ({
              name: expenseItem.item,
              quantity: expenseItem.quantity,
              unit: expenseItem.unit,
              rate: expenseItem.unitPrice,
              amount: expenseItem.totalAmount,
            })
          ),
          payments: item.expensePayments || [],
        })
      }
      style={styles.expenseCard}
    >
      <View style={styles.leftSection}>
        <Text style={styles.expenseTitle}>
          {item?.categoryName || "Expense"}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.expenseCode}>
            {item?.referenceNumber}
          </Text>

          <Text style={styles.dot}>•</Text>

          <Text
            style={[
              styles.statusText,
              item?.paymentStatus === "Full"
                ? styles.paidText
                : styles.partialText,
            ]}
          >
            ✓ {item?.paymentStatus}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.amountText}>
          ₹ {Number(item?.totalAmount || 0).toLocaleString()}
        </Text>

        <Text style={styles.dateText}>
          {item?.transactionDate}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    // <FlatList
    //   data={vendorExpenses?.expenses || []}
    //   keyExtractor={(item) => item.id}
    //   renderItem={renderItem}
    //   showsVerticalScrollIndicator={false}
    //   contentContainerStyle={styles.listContainer}
    // />
    <>
      {/* {loading && <Loader />} */}

      {/* <FlatList
  data={vendorExpenses?.expenses || []}
  keyExtractor={(item) => item?.expenseId}
  renderItem={renderItem}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.listContainer}
  ListEmptyComponent={
    <View style={styles.emptyContainer}>
       <Image
         source={EmptyState}
         style={styles.emptyIcon}
         resizeMode="contain"
       />
   
       <Text style={styles.emptyTitle}>
         No Expenses
       </Text>
   
       <Text style={styles.emptySubTitle}>
         No Expenses have been added yet.
       </Text>
     </View>
  }
/> */}

<>
 <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType} />



      <View style={styles.container}>

        <TouchableOpacity
          style={styles.addExpenseBtn}
          onPress={handleAddExpenses}
        >
          <Text style={styles.addExpenseText}>+ Add Expense</Text>
        </TouchableOpacity>

        <FlatList
          data={vendorExpenses?.expenses || []}
          keyExtractor={(item) => item?.expenseId?.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={EmptyState}
                style={styles.emptyIcon}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>No Expenses</Text>
              <Text style={styles.emptySubTitle}>
                No Expenses have been added yet.
              </Text>
            </View>
          }
        />
      </View>
      </>
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  listContainer: {
    paddingTop: 60, // button overlap avoid
    paddingBottom: 120,
  },

  addExpenseBtn: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 100,

    backgroundColor: "#2F54EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 38,

    justifyContent: "center",
    alignItems: "center",

    elevation: 5,
  },

  addExpenseText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
  },
  // listContainer: {
  //   backgroundColor: "#FFFFFF",
  //   paddingBottom: 120,
  // },

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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },

  emptyIcon: {
    width: 200,
    height: 100,
    // opacity: 0.5,
  },

  emptyTitle: {
    marginTop: 4,
    fontSize: 18,
    color: "#111827",
    fontFamily: "Gilroy-Bold",
  },

  emptySubTitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});