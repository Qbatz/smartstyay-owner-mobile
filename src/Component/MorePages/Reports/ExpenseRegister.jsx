import React ,{useState , useEffect , useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,Image
} from "react-native";
import { StatusBar , Platform } from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import { NativeModules } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native";
import { UseSetting } from "../../../Context/SettingContext";
import { PGContext } from "../../../Context/PGContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png"; 
import EmptyState from "../../../Assets/Images/Empty_state.png"
import Loader from "../../../Component/Loader/Loader"
import DownArrow from "../../../Assets/Images/direction-down.png";
import FilterBottomSheet from "./FilterBottomSheet";

const ExpenseRegister = ({navigation}) => {

    const { CommonModule } = NativeModules;
  const {loading,  Reportsdetails , GetExpenseRegisterReport , downloadExpenseReport} = UseSetting();
 const { getParticularHostelDetails, PGDetails } = useContext(PGContext);
  // const { getExpenseRegisterReport } = UseSetting();
const { activeHostelId } = useContext(CommonContexts)
const [expenseData, setExpenseData] = useState(null)

const [selectedMonth, setSelectedMonth] = useState("");
const [tempMonth, setTempMonth] = useState("");

const [selectedCategory, setSelectedCategory] = useState([]);
const [tempCategory, setTempCategory] = useState([]);

const [selectedPayment, setSelectedPayment] = useState([]);
const [tempPayment, setTempPayment] = useState([]);

const [monthSheetOpen, setMonthSheetOpen] = useState(false);
const [categorySheetOpen, setCategorySheetOpen] = useState(false);
const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);



useEffect(() => {
  if (!activeHostelId) return;

  const fetchExpenses = async () => {
    const response = await GetExpenseRegisterReport(activeHostelId, {
      // startDate: startDate,
      // endDate: endDate,
      page: 0,
      size: 10,
    });

    if (response.success) {
      setExpenseData(response?.data);
    }
  };

  fetchExpenses();
}, [activeHostelId, ]);

console.log("expensesdata", expenseData);



        const {
          canWriteModule: canWriteReports,
          canReadModule: canReadReports,
          canUpdateModule: canUpdateReports,
          canDeleteModule: canDeleteReports,
        } = useHasPermission("Reports")


        const filterOptions = expenseData?.filtersData;

const monthOptions =
  filterOptions?.period?.map(i => ({
    label: i.label,
    value: i.id,
  })) || [];

const categoryOptions =
  filterOptions?.category?.map(i => ({
    label: i.categoryName,
    value: i.categoryId,
  })) || [];

const paymentOptions =
  filterOptions?.paymentMode?.map(i => ({
    label: i,
    value: i,
  })) || [];

  const applyExpenseFilters = (
  month = selectedMonth,
  category = selectedCategory,
  payment = selectedPayment
) => {
  const filters = {
    period: month || undefined,
    category: category.length ? category : undefined,
    paymentMode: payment.length ? payment : undefined,
    page: 0,
    size: 10,
  };

  GetExpenseRegisterReport(activeHostelId, filters)
    .then(res => {
      if (res.success) {
        setExpenseData(res.data);
      }
    });
};

const expenseList = [
  {
    title: "Plumbing",
    sub: "Plumbing repair - A Block",
    amount: "₹ 9,300",
  },
  {
    title: "Basic Utilities",
    sub: "Water bill - January",
    amount: "₹ 5,100",
  },
  {
    title: "Electricity",
    sub: "Electricity bill - March",
    amount: "₹ 1,100",
  },
  {
    title: "Electricity",
    sub: "Electricity bill - March",
    amount: "₹ 1,100",
  },
  {
    title: "Food",
    sub: "Vegetables 5 Kgs",
    amount: "₹ 5,100",
  },
  {
    title: "Food",
    sub: "Vegetables 5 Kgs",
    amount: "₹ 1,100",
  },
  {
    title: "Basic Utilities",
    sub: "Cleaning supplies",
    amount: "₹ 1,100",
  },
  {
    title: "Food",
    sub: "Meat 5 Kgs Chicken",
    amount: "₹ 5,100",
  },
  {
    title: "Food",
    sub: "Meat 5 Kgs Chicken",
    amount: "₹ 1,100",
  },
];

const handleDownloadExpenseReport = async () => {
  const res = await downloadExpenseReport(activeHostelId)

  if (res?.success && res?.url) {
    await CommonModule.downloadAndViewDocument(res.url)
  }
}

  const isValidSubscription = PGDetails?.isSubscriptionActive;
const isExportAllow = isValidSubscription && canReadReports;


  return (
         <>
           {loading && <Loader />}
<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
         <View style={styles.container}>
          <View style={styles.headerRow}>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image source={ArrowLeft} style={styles.backIcon} />
    </TouchableOpacity>
    <Text style={styles.title}>Expense Register</Text>
  </View>

             <TouchableOpacity
  style={styles.monthBtn}
  onPress={() => {
    setTempMonth(selectedMonth);
    setMonthSheetOpen(true);
  }}
>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={styles.monthText}> {selectedMonth
    ? monthOptions.find(m => m?.value === selectedMonth)?.label
    : "Select Month"}</Text>
    <Image
      source={DownArrow}
      style={{ width: 14, height: 14, marginLeft: 5 }}
    />
  </View>
</TouchableOpacity>
</View>

           <LinearGradient
  colors={["#E7F1FF", "#FFFFFF"]}
  start={{ x: 1, y: 0 }}
  end={{ x: 0, y: 1 }}
  style={styles.summaryCard}
>
  <View style={styles.row}>
    <Text style={styles.label}>Total Expense Amount</Text>
    <Text style={styles.totalValue}>₹ {Reportsdetails?.expense?.totalExpenseAmount}</Text>
  </View>
<View style={styles.divider} />
  <View style={styles.row}>
    <Text style={styles.label}>Total Expenses</Text>
    <Text style={styles.value}>{Reportsdetails?.expense?.totalExpenses}</Text>
  </View>


</LinearGradient>

 <View style={styles.filterRow}>

  {/* Payment */}
  <TouchableOpacity
    style={[
      styles.filterBtn,
      selectedPayment.length > 0 && styles.activeFilter
    ]}
    onPress={() => {
      setTempPayment(selectedPayment);
      setPaymentSheetOpen(true);
    }}
  >
    <Text style={selectedPayment.length ? styles.activeFilterText : styles.filterText}>
   {selectedPayment.length === 0
  ? "Payment"
  : `${selectedPayment[0]} ${
      selectedPayment.length > 1
        ? `+${selectedPayment.length - 1} more`
        : ""
    }`}
    </Text>
          <Image source={DownArrow} style={{ width: 16, height: 16, marginLeft: 6 }} />
  </TouchableOpacity>

  {/* Category */}
  <TouchableOpacity
    style={[
      styles.filterBtn,
      selectedCategory.length > 0 && styles.activeFilter
    ]}
    onPress={() => {
      setTempCategory(selectedCategory);
      setCategorySheetOpen(true);
    }}
  >
    <Text style={selectedCategory.length ? styles.activeFilterText : styles.filterText}>
    {selectedCategory.length === 0
  ? "Category"
  : `${
      categoryOptions.find(
        c => c.value === selectedCategory[0]
      )?.label
    } ${
      selectedCategory.length > 1
        ? `+${selectedCategory.length - 1} more`
        : ""
    }`}
    </Text>
          <Image source={DownArrow} style={{ width: 16, height: 16, marginLeft: 6 }} />
  </TouchableOpacity>

</View>

    <ScrollView
  showsVerticalScrollIndicator={false}
   contentContainerStyle={{ paddingBottom: 140 }}
    >
      {/* SUMMARY CARD */}


      {/* FILTER */}
    

      {/* LIST */}
  {expenseData?.expenseLists?.map((item, index) => (
  <View key={index} style={styles.listItem}>
    <View style={{ flex: 1, paddingRight: 10 }}>
      <Text style={styles.name}>  {item?.expenseCategory}</Text>
      <Text style={styles.sub}>{item?.description || "N/A"}</Text>
    </View>

    <Text style={styles.amount}> ₹ {item.amount}</Text>
  </View>
))}

{expenseData?.expenseLists?.length === 0 && (
   <View style={styles.emptyContainer}>
           <Image source={EmptyState} style={styles.emptyImage} />
           <Text style={styles.emptyText}>No Expenses are there!</Text>
         </View>
)}



      {/* EXPORT */}
    
    </ScrollView>
      {/* <TouchableOpacity style={styles.exportBtn}>
        <Text style={styles.exportText}>Export PDF</Text>
      </TouchableOpacity> */}
    </View>

      <View style={styles.exportWrapper}>
    <TouchableOpacity
    //  style={styles.exportBtn}
      style={[styles.exportBtn, !isExportAllow && { opacity: 0.4 }]}
      disabled={!isExportAllow}
      onPress={handleDownloadExpenseReport}>
      <Text style={styles.exportText}>Export PDF</Text>
    </TouchableOpacity>
  </View>

    </SafeAreaView>

    <FilterBottomSheet
  visible={monthSheetOpen}
  title="Select Period"
  options={monthOptions}
  selectedValues={tempMonth ? [tempMonth] : []}
  setSelectedValues={(val) => setTempMonth(val[0])}
  isSingleSelect={true}
  onReset={() => {
    setTempMonth("");
    setSelectedMonth("");
    setMonthSheetOpen(false);
    applyExpenseFilters("", selectedCategory, selectedPayment);
  }}
  onApply={() => {
    setSelectedMonth(tempMonth);
    setMonthSheetOpen(false);
    applyExpenseFilters(tempMonth, selectedCategory, selectedPayment);
  }}
  onClose={() => setMonthSheetOpen(false)}
/>

<FilterBottomSheet
  visible={categorySheetOpen}
  title="Category"
  options={categoryOptions}
  selectedValues={tempCategory}
  setSelectedValues={setTempCategory}
  onReset={() => {
    setTempCategory([]);
    setSelectedCategory([]);
    setCategorySheetOpen(false);
    applyExpenseFilters(selectedMonth, [], selectedPayment);
  }}
  onApply={() => {
    setSelectedCategory(tempCategory);
    setCategorySheetOpen(false);
    applyExpenseFilters(selectedMonth, tempCategory, selectedPayment);
  }}
  onClose={() => setCategorySheetOpen(false)}
/>

<FilterBottomSheet
  visible={paymentSheetOpen}
  title="Payment Mode"
  options={paymentOptions}
  selectedValues={tempPayment}
  setSelectedValues={setTempPayment}
  onReset={() => {
    setTempPayment([]);
    setSelectedPayment([]);
    setPaymentSheetOpen(false);
    applyExpenseFilters(selectedMonth, selectedCategory, []);
  }}
  onApply={() => {
    setSelectedPayment(tempPayment);
    setPaymentSheetOpen(false);
    applyExpenseFilters(selectedMonth, selectedCategory, tempPayment);
  }}
  onClose={() => setPaymentSheetOpen(false)}
/>
      </>
  );
};

export default ExpenseRegister;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
 container: {
  flex: 1,
  paddingHorizontal: 16,
    paddingTop: Platform.OS === "android"
    ? StatusBar.currentHeight + 10
    : 20 ,
  backgroundColor: "#fff",
},


  headerRow: {
    // height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between',
    marginBottom:6
  },
  monthBtn: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
      borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
},

monthText: {
  fontSize: 13,
  color: "#374151",
  fontWeight: "500",
},


  backIcon: { width: 22, height: 22, marginRight: 10 },

  title: { fontSize: 18, fontWeight: "700" },

  /* SUMMARY */
//   summaryCard: {
//     backgroundColor: "#F8FAFC",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 14,
//   },

  summaryCard: {
  borderRadius: 14,
  // padding: 16,
  padding: Platform.OS === "android" ? 16 : 1,
  marginBottom: 14,
//   shadowColor: "#000",
//   shadowOpacity: 0.04,
//   shadowRadius: 8,
//   elevation: 5,
},

divider: {
  height: 1,
  backgroundColor: "rgba(0,0,0,0.06)", // 🔥 figma subtle line
  marginVertical: 2,
},

totalValue: {
  fontSize: 20,        // figma-la konjam perusa irukkum
  fontWeight: "700",
  color: "#111827",
},

sub: {
  fontSize: 12,
  color: "#9CA3AF",
  marginTop: 4,
  marginLeft:9
},


  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  /* FILTER */
  filterRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  filterBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
    backgroundColor: "#fff",
      flexDirection: "row", justifyContent: "center", alignItems: "center" 
  },

  activeFilter: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },

  filterText: {
    fontSize: 13,
    color: "#374151",
  },

  activeFilterText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },

  /* LIST */
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,   // 🔥 compact like figma
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  // sub: {
  //   fontSize: 12,
  //   color: "#6B7280",
  //   marginTop: 2,
  // },

  amount: {
    fontSize: 14,
    fontWeight: "600",
  },

 emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyImage: {
    width: 250,
    height: 180,
    resizeMode: "contain",
    opacity: 0.9,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },

  /* EXPORT */

exportWrapper: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  paddingHorizontal: 16,
  paddingBottom: 45, 
  backgroundColor: "#fff",
},

exportBtn: {
  backgroundColor: "#1D4ED8",
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: "center",
},



  exportText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

    filterBox: {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  marginRight: 8,
  backgroundColor: "#fff",
  flexDirection: "row", justifyContent: "center", alignItems: "center" 
},

filterBoxActive: {
  backgroundColor: "#1D4ED8",
  borderColor: "#1D4ED8",
},

filterText: {
  textAlign: "center",
  color: "#374151",
},

filterTextActive: {
  color: "#fff",
},
});
