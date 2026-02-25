import React ,{useState , useEffect , useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,Image
} from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import Loader from "../../../Component/Loader/Loader"

const ExpenseRegister = ({navigation}) => {

  const {loading,  Reportsdetails , GetExpenseRegisterReport} = UseSetting();

  // const { getExpenseRegisterReport } = UseSetting();
const { activeHostelId } = useContext(CommonContexts);

const [expenseData, setExpenseData] = useState(null);

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

  <TouchableOpacity style={styles.monthBtn}>
    <Text style={styles.monthText}>This Month ▼</Text>
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
        <TouchableOpacity style={[styles.filterBtn, styles.activeFilter]}>
          <Text style={styles.activeFilterText}>Cash ▼</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Category ▼</Text>
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
    <TouchableOpacity style={styles.exportBtn}>
      <Text style={styles.exportText}>Export PDF</Text>
    </TouchableOpacity>
  </View>

    </SafeAreaView>
      </>
  );
};

export default ExpenseRegister;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
 container: {
  flex: 1,
  paddingHorizontal: 16,
  paddingTop: 60,
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
  padding: 16,
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
});
