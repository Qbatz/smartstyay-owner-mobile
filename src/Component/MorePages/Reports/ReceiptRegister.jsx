import React, {useState ,useContext , useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,Image
} from "react-native";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useHasPermission } from "../../../Utils/useHasPermission";
import Loader from "../../../Component/Loader/Loader"
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import { NativeModules } from "react-native";
import DownArrow from "../../../Assets/Images/direction-down.png";
import FilterBottomSheet from "./FilterBottomSheet";

const ReceiptRegister = ({navigation}) => {

    const { CommonModule } = NativeModules;
 
    const {loading,  getReceiptRegisterReport , downloadReceiptReport} = UseSetting();
    const { activeHostelId } = useContext(CommonContexts);
    const [receiptData, setReceiptData] = useState(null);
      const {
        canWriteModule: canWriteReports,
        canReadModule: canReadReports,
        canUpdateModule: canUpdateReports,
        canDeleteModule: canDeleteReports,
      } = useHasPermission("Reports")

      const [selectedMonth, setSelectedMonth] = useState("");
const [tempMonth, setTempMonth] = useState("");

const [selectedType, setSelectedType] = useState([]);
const [tempType, setTempType] = useState([]);

const [selectedPayment, setSelectedPayment] = useState([]);
const [tempPayment, setTempPayment] = useState([]);

const [monthSheetOpen, setMonthSheetOpen] = useState(false);
const [typeSheetOpen, setTypeSheetOpen] = useState(false);
const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);

  useEffect(() => {
  if (activeHostelId) {
    loadReceipts();
  }
}, [activeHostelId]);

const loadReceipts = async () => {
  const res = await getReceiptRegisterReport(activeHostelId);

  if (res?.success) {
    setReceiptData(res.data);
  }
  else{
    setReceiptData(null)
  }
}

const filterOptions = receiptData?.filters;

const monthOptions =
  filterOptions?.period?.map(i => ({
    label: i.label,
    value: i.id,
  })) || [];

const typeOptions =
  filterOptions?.invoiceType?.map(i => ({
    label: i.label,
    value: i.id,
  })) || [];

  const firstTypeLabel =
  typeOptions?.find(t => t.value === selectedType?.[0])?.label || "";


const paymentOptions =
  filterOptions?.paymentMode?.map(i => ({
    label: i.label,
    value: i.id, 
  })) || [];

const firstPaymentLabel =
  paymentOptions?.find(p => p.value === selectedPayment?.[0])?.label || "";

  const selectedPaymentValue =
  typeof selectedPayment?.[0] === "object"
    ? selectedPayment?.[0]?.value
    : selectedPayment?.[0];

// const firstPaymentLabel =
//   paymentOptions?.find(p => p.value === selectedPaymentValue)?.label || "";

  console.log(selectedType)
console.log(typeOptions)

console.log("selectpayment", selectedPayment);


  const applyReceiptFilters = (
  month = selectedMonth,
  type = selectedType,
  payment = selectedPayment
) => {
const filters = {
  period: month || undefined,
  invoiceType: type?.length ? type[0] : undefined,
 paymentMode: payment?.length ? payment : undefined,
};
  getReceiptRegisterReport(activeHostelId, filters)
    .then(res => {
      if (res?.success) {
        setReceiptData(res.data);
      }
    });
};

const handleDownloadReceiptReport = async () => {
  const res = await downloadReceiptReport(activeHostelId);

  if (res?.success && res?.url) {
    await CommonModule.downloadAndViewDocument(res.url);
  }
};

console.log("receiptData", receiptData);


  return (
         <>
          {loading && <Loader />}
<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
         <View style={styles.container}>
             {/* <View style={styles.headerRow}>
                   <TouchableOpacity  onPress={() => {navigation.goBack()}}>
                     <Image source={ArrowLeft} style={styles.backIcon} />
                   </TouchableOpacity>
                   <Text style={styles.title}> Invoices
           </Text>
                 </View> */}


                         <View style={styles.headerRow}>
                   <View style={{ flexDirection: "row", alignItems: "center" }}>
                     <TouchableOpacity onPress={() => navigation.goBack()}>
                       <Image source={ArrowLeft} style={styles.backIcon} />
                     </TouchableOpacity>
                     <Text style={styles.title}>Receipt Register</Text>
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
    <Text style={styles.label}>Total Receipts</Text>
    <Text style={styles.totalValue}>₹ {receiptData?.pagination?.totalRecords || 0}</Text>
  </View>
<View style={styles.divider} />
  <View style={styles.row}>
    <Text style={styles.label}>Collected Amount</Text>
    <Text style={styles.value}>₹ {receiptData?.summary?.receivedAmount || 0}</Text>
  </View>

  {/* <View style={styles.row}>
    <Text style={styles.label}>Outstanding</Text>
    <Text style={styles.value}>₹ {invoiceReports?.outStandingAmount || 0}</Text>
  </View> */}
</LinearGradient>

  <View style={styles.filterRow}>
      <TouchableOpacity
  style={[
    styles.filterBtn,
    selectedType.length > 0 && styles.activeFilter
  ]}
  onPress={() => {
    setTempType(selectedType);
    setTypeSheetOpen(true);
  }}
>
  <Text style={selectedType.length ? styles.activeFilterText : styles.filterText}>
  {selectedType.length === 0
    ? "Type"
    : `${firstTypeLabel}${
        selectedType.length > 1
          ? ` +${selectedType.length - 1} more`
          : ""
      }`}
</Text>
  <Image source={DownArrow} style={{ width: 16, height: 16, marginLeft: 6 }} />
</TouchableOpacity>

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
    : `${firstPaymentLabel}${
        selectedPayment.length > 1
          ? ` +${selectedPayment.length - 1} more`
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
  {!loading && receiptData?.data?.map((item, index) => (
  <View key={index} style={styles.listItem}>
    <View>
      <Text style={styles.name}>
        {item?.customerName}
      </Text>
      <Text style={styles.sub}>{item?.invoiceNumber}</Text>
    </View>
    <Text style={styles.amount}>₹ {item?.paymentMade}</Text>
  </View>
))}


      {!loading && receiptData && receiptData?.data?.length === 0 && (
  <View style={styles.emptyContainer}>
          <Image source={EmptyState} style={styles.emptyImage} />
          <Text style={styles.emptyText}>No Receipts are there!</Text>
        </View>
)}


      {/* EXPORT */}
    
    </ScrollView>
      {/* <TouchableOpacity style={styles.exportBtn}>
        <Text style={styles.exportText}>Export PDF</Text>
      </TouchableOpacity> */}
    </View>

      <View style={styles.exportWrapper}>
    <TouchableOpacity style={styles.exportBtn} onPress={handleDownloadReceiptReport}>
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
    applyReceiptFilters("", selectedType, selectedPayment);
  }}
  onApply={() => {
    setSelectedMonth(tempMonth);
    setMonthSheetOpen(false);
    applyReceiptFilters(tempMonth, selectedType, selectedPayment);
  }}
  onClose={() => setMonthSheetOpen(false)}
/>


<FilterBottomSheet
  visible={typeSheetOpen}
  title="Invoice Type"
  options={typeOptions}
  selectedValues={tempType}
  setSelectedValues={setTempType}
  onReset={() => {
    setTempType([]);
    setSelectedType([]);
    setTypeSheetOpen(false);
    applyReceiptFilters(selectedMonth, [], selectedPayment);
  }}
  onApply={() => {
    setSelectedType(tempType);
    setTypeSheetOpen(false);
    applyReceiptFilters(selectedMonth, tempType, selectedPayment);
  }}
  onClose={() => setTypeSheetOpen(false)}
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
    applyReceiptFilters(selectedMonth, selectedType, []);
  }}
  onApply={() => {
    setSelectedPayment(tempPayment);
    setPaymentSheetOpen(false);
    applyReceiptFilters(selectedMonth, selectedType, tempPayment);
  }}
  onClose={() => setPaymentSheetOpen(false)}
/>
      </>
  );
};

export default ReceiptRegister;

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
    marginBottom:4
},

totalValue: {
  fontSize: 20,        // figma-la konjam perusa irukkum
  fontWeight: "700",
  color: "#111827",
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

  sub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    marginLeft:2
  },

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
  paddingBottom: 45, // 🔥 Android navigation bar safe
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
