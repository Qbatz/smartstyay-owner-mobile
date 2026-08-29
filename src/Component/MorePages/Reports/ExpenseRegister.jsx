import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity, Image,
  Dimensions,
  Animated
} from "react-native";
import { StatusBar, Platform } from "react-native";
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
import RupeeIcon from "../../../Assets/Images/Rupees.png";
import ExpensesIcon from "../../../Assets/Images/Expenses.png";
import ReportsAllFilterBottomSheet from "./ReportsAllFilterBottomSheet";
import FilterIcon from "../../../Assets/Images/filter.png";


const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.44
const ExpenseRegister = ({ navigation }) => {

  const { CommonModule } = NativeModules;
  const { loading, Reportsdetails, GetExpenseRegisterReport, downloadExpenseReport } = UseSetting();
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

  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [tempSubCategory, setTempSubCategory] = useState([]);
  const [subCategorySheetOpen, setSubCategorySheetOpen] = useState(false);

  const [allFilterSheet, setAllFilterSheet] = useState(false)
  const [vendorValue, setVendorValue] = useState("")
  const [paymentStatus, setPaymentStatusValue] = useState("")
  const [categoryValue, setCategoryValue] = useState([])
  const [subCategoryValue, setSubCategoryValue] = useState([])
  const [allSelectedMonth, setAllSelectedMonth] = useState("")
  const [paymentModeValue, setPaymentModeValue] = useState([])
  const [createdValue, setCreatedByValue] = useState([])

  useEffect(() => {
    if (!activeHostelId) return;
    console.log("useEffect running");
    console.log(activeHostelId)


    const fetchExpenses = async () => {
      const filters = {
        // period: month || undefined,
        // category: category.length ? category : undefined,
        // paymentMode: payment.length ? payment : undefined,
        page: 1,
        size: 10,
      };
      const response = await GetExpenseRegisterReport(activeHostelId, filters
        // startDate: startDate,
        // endDate: endDate,
        // page: 1,
        // size: 10,
      );

      if (response.success) {
        setExpenseData(response?.data);
      }
    };

    fetchExpenses();
  }, [activeHostelId,]);

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

  const subCategoryOptions =
    filterOptions?.subCategory?.map(i => ({
      label: i.subCategoryName,
      value: i.subCategoryId,
      categoryId: i.categoryId,
    })) || [];

  const filteredSubCategoryOptions =
    selectedCategory.length === 0
      ? subCategoryOptions
      : subCategoryOptions.filter(item =>
        selectedCategory.includes(item.categoryId)
      );

  const paymentOptions =
    filterOptions?.paymentMode?.map(i => ({
      label: i,
      value: i,
    })) || [];

  //   const applyExpenseFilters = (
  //   month = selectedMonth,
  //   category = selectedCategory,
  //   payment = selectedPayment
  // ) => {
  //   const filters = {
  //     period: month || undefined,
  //     category: category.length ? category : undefined,
  //     paymentMode: payment.length ? payment : undefined,
  //     page: 1,
  //     size: 10,
  //   };

  //   GetExpenseRegisterReport(activeHostelId, filters)
  //     .then(res => {
  //       if (res.success) {
  //         setExpenseData(res.data);
  //       }
  //     });
  // };

  const applyExpenseFilters = (
    month = selectedMonth ?? allSelectedMonth,
    category = selectedCategory ?? categoryValue,
    subCategory = selectedSubCategory ?? subCategoryValue,
    payment = selectedPayment ?? paymentModeValue,
    createdBy = createdValue,
    paidTo = vendorValue,
  ) => {
    const filters = {
      period: month || undefined,
      category: category.length ? category : undefined,
      subCategory: subCategory.length ? subCategory : undefined,
      paymentMode: payment.length ? payment : undefined,
      createdBy: createdBy.length ? createdBy : undefined,
      paidTo: paidTo || undefined,
      page: 1,
      size: 10,
    };

    GetExpenseRegisterReport(activeHostelId, filters).then(res => {
      if (res.success) {
        setExpenseData(res?.data);
      }
    });
  }


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

    const finalMonth =
      allSelectedMonth !== undefined ? allSelectedMonth : selectedMonth;

    const finalCategory = categoryValue !== undefined ? categoryValue : selectedCategory;

    const finalSubCategory = subCategoryValue != undefined ? subCategoryValue : selectedSubCategory;

    const finalPaymentMode = paymentModeValue != undefined ? paymentModeValue : selectedPayment;

    const filters = {
      period: finalMonth || undefined,
      category: finalCategory.length ? finalCategory : undefined,
      subCategory: finalSubCategory.length ? finalSubCategory : undefined,
      paymentMode: finalPaymentMode.length ? finalPaymentMode : undefined,
      createdBy: createdValue.length ? createdValue : undefined,
      paidTo: vendorValue || undefined,
      page: 1,
      size: 10,
    };


    const res = await downloadExpenseReport(activeHostelId, filters)

    if (res?.success && res?.url) {
      await CommonModule.downloadAndViewDocument(res.url)
    }
  }

  const isValidSubscription = PGDetails?.isSubscriptionActive;
  const isExportAllow = isValidSubscription && canReadReports;

  const AnimatedNumber = ({ value, duration = 800 }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      animatedValue.setValue(0);

      Animated.timing(animatedValue, {
        toValue: Number(value) || 0,
        duration,
        useNativeDriver: false,
      }).start();

      const listener = animatedValue.addListener(({ value }) => {
        setDisplayValue(Math.floor(value));
      });

      return () => {
        animatedValue.removeListener(listener);
      };
    }, [value]);

    return <Text>{displayValue}</Text>;
  };


  const SummaryCard = ({
    icon,
    title,
    value,
    showRupee = true,
    prefix,
    suffix,
    valueColor = "#111827",
    linearcolor,
    tintColor
  }) => (
    <LinearGradient
      colors={["#FFFFFF", linearcolor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.summaryCard}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            {title}
          </Text>

          <Text style={[styles.cardValue, { color: valueColor }]}>
              {showRupee && "₹ "}
             {prefix && <Text>{prefix}</Text>}

            <AnimatedNumber value={value} />

            {suffix && <Text>{suffix}</Text>}
          </Text>
        </View>

        <View style={styles.iconBox}>
          <Image
            source={icon}
            style={[styles.cardIcon, { tintColor: tintColor }]}
          />
        </View>
      </View>
    </LinearGradient>
  );

  const hasActiveFilters =
    (paymentModeValue?.length ?? 0) > 0 ||
    (categoryValue?.length ?? 0) > 0 ||
    (subCategoryValue?.length ?? 0) > 0 ||
    !!allSelectedMonth ||
    !!vendorValue ||
    (createdValue?.length ?? 0) > 0;

  console.log(Reportsdetails)


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

          {/* <LinearGradient
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


          </LinearGradient> */}

          <View style={{ height: 110 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ height: 110 }}
              contentContainerStyle={styles.cardRow}
            >
              <SummaryCard
                title="Total Expenses"
                value={expenseData?.summary?.totalExpenses}
                icon={ExpensesIcon}
                tintColor="#1E45E1"
                linearcolor="#FFF4F4"
                 showRupee={false}
              />

              <SummaryCard
                title="Total Amount"
                value={expenseData?.summary?.totalAmount || 0}
                icon={RupeeIcon}
                valueColor="#00A651"
                linearcolor="#F4FFF7"
              />


            </ScrollView>
          </View>

          <View style={styles.filterRow}>

            {/* All */}

       
  {/* <View style={{flexDirection:'row'}}> */}
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
              <Text
                //  style={selectedPayment.length ? styles.activeFilterText : styles.filterText}
                style={[
                  selectedPayment.length
                    ? styles.activeFilterText
                    : styles.filterText,
                  {
                    flex: 1,
                    marginRight: 6,
                  },
                ]}

              >
                {selectedPayment.length === 0
                  ? "Payment"
                  : `${selectedPayment[0]} ${selectedPayment.length > 1
                    ? `+${selectedPayment.length - 1} more`
                    : ""
                  }`}
              </Text>
              <Image
                source={DownArrow}
                style={[
                  styles.arrowIcon,
                  selectedPayment.length > 0 && styles.activeArrow,
                ]}
              />
              {/* <Image source={DownArrow} style={{ width: 16, height: 16, marginLeft: 6 }} /> */}
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
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                // style={[
                //   selectedCategory.length
                //     ? styles.activeFilterText
                //     : styles.filterText,
                //   { flex: 1 }
                // ]}

                style={[
                  selectedCategory.length
                    ? styles.activeFilterText
                    : styles.filterText,
                  {
                    flex: 1,
                    marginRight: 6,
                  },
                ]}

              >
                {selectedCategory?.length === 0
                  ? "Category"
                  : `${categoryOptions.find(
                    c => c.value === selectedCategory[0]
                  )?.label
                  }${selectedCategory.length > 1
                    ? ` +${selectedCategory?.length - 1} more`
                    : ""
                  }`}
              </Text>

              <Image
                source={DownArrow}
                style={[
                  styles.arrowIcon,
                  selectedCategory.length > 0 && styles.activeArrow,
                ]}
              />
              {/* <Text style={selectedCategory.length ? styles.activeFilterText : styles.filterText}>
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
          <Image source={DownArrow} style={{ width: 16, height: 16, marginLeft: 6 }} /> */}
            </TouchableOpacity>
              <TouchableOpacity
                                                        style={styles.filterIconBtn}
                                                        onPress={() => setAllFilterSheet(true)}
                                                    >
                                                        <Image source={FilterIcon} style={{ width: 18, height: 18 }} />
                                                    </TouchableOpacity>
            {/* 
            <TouchableOpacity
             

              style={[
                styles.filterBtn,
                selectedSubCategory.length > 0 && styles.activeFilter,
              ]}
              onPress={() => {
                setTempSubCategory(selectedSubCategory);
                setSubCategorySheetOpen(true);
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  selectedSubCategory.length > 0
                    ? styles.activeFilterText
                    : styles.filterText,
                  {
                    flex: 1,
                    marginRight: 6,
                  },
                ]}
              >
                {selectedSubCategory.length === 0
                  ? "Sub Category"
                  : `${filteredSubCategoryOptions.find(
                    x => x.value === selectedSubCategory[0]
                  )?.label
                  }${selectedSubCategory.length > 1
                    ? ` +${selectedSubCategory.length - 1} more`
                    : ""
                  }`}
              </Text>

              <Image
                source={DownArrow}
                style={[
                  styles.arrowIcon,
                  selectedSubCategory.length > 0 && styles.activeArrow,
                ]}
              />         
            </TouchableOpacity> */}

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
        visible={subCategorySheetOpen}
        title="Sub Category"
        options={filteredSubCategoryOptions}
        selectedValues={tempSubCategory}
        setSelectedValues={setTempSubCategory}
        onReset={() => {
          setTempSubCategory([]);
          setSelectedSubCategory([]);
          setSubCategorySheetOpen(false);

          applyExpenseFilters(
            selectedMonth,
            selectedCategory,
            [],
            selectedPayment
          );
        }}
        onApply={() => {
          setSelectedSubCategory(tempSubCategory);
          setSubCategorySheetOpen(false);

          applyExpenseFilters(
            selectedMonth,
            selectedCategory,
            tempSubCategory,
            selectedPayment
          );
        }}
        onClose={() => setSubCategorySheetOpen(false)}
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

      <ReportsAllFilterBottomSheet
        visible={allFilterSheet}
        filters={filterOptions}
        reportType="expense"
        // selectedFilters={ }
        setVendorValue={setVendorValue}
        setSelectedMonth={setAllSelectedMonth}
        setPaymentStatusValue={setPaymentStatusValue}
        setCategoryValue={setCategoryValue}
        setSubCategoryValue={setSubCategoryValue}
        setPaymentModeValue={setPaymentModeValue}
        setCreatedByValue={setCreatedByValue}
        // setMaxPaidValue={setMaxPaidValue}

        onReset={() => {
          setAllSelectedMonth("")
          setCategoryValue([]), setSubCategoryValue([])
          setPaymentModeValue([]), setCreatedByValue([])
          setVendorValue("")
          setAllFilterSheet(false)
          applyExpenseFilters("", [], [], [], [], "")
        }}
        onApply={() => {
          setAllFilterSheet(false)
          applyExpenseFilters(allSelectedMonth, categoryValue, subCategoryValue, paymentModeValue, createdValue,
            vendorValue)
        }}
        onClose={() => setAllFilterSheet(false)}
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
      : 20,
    backgroundColor: "#fff",
  },


  headerRow: {
    // height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 6
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
    marginLeft: 9,
    fontFamily: "Gilroy-Semibold"
  },


  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Gilroy-Semibold"
  },

  value: {
    fontSize: 14,
    fontFamily: "Gilroy-Semibold",
    color: "#111827",
  },

  /* FILTER */
  // filterRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   marginBottom: 12, marginTop: 12,
  //   gap: 8,
  // },

   filterRow: {
    flexDirection: "row", alignItems: 'center', justifyContent:'space-between',
    marginTop: 10,
  },


  // filterBtn: {
  //   borderWidth: 1,
  //   borderColor: "#E5E7EB",
  //   borderRadius: 10,
  //   paddingHorizontal: 14,
  //   paddingVertical: 6,
  //   marginRight: 10,
  //   backgroundColor: "#fff",
  //     flexDirection: "row", justifyContent: "center", alignItems: "center" 
  // },
  filterBtn: {
    flex: 1,
    minWidth: 0,
    height: 32,

    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,

    paddingHorizontal: 8,
    backgroundColor: "#fff",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // gap:10
  },
  

  activeFilter: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },

  filterText: {
    fontSize: 12,
    color: "#374151",
    flexShrink: 1,
    fontFamily: "Gilroy-Semibold"
  },

  activeFilterText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
    flexShrink: 1,
    fontFamily: "Gilroy-Semibold"
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
    fontFamily: "Gilroy-Semibold",
    color: "#111827",
  },

  // sub: {
  //   fontSize: 12,
  //   color: "#6B7280",
  //   marginTop: 2,
  // },

  amount: {
    fontSize: 14,
    fontFamily: "Gilroy-Semibold",
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
    fontFamily: "Gilroy-Semibold"
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

  // filterText: {
  //   textAlign: "center",
  //   color: "#374151",
  // },

  filterTextActive: {
    color: "#fff",
  },

  arrowIcon: {
    width: 16,
    height: 16,
    tintColor: "#374151",
  },

  activeArrow: {
    tintColor: "#FFFFFF",
  },
  summaryCard: {
    width: CARD_WIDTH,
    height: 90,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,

    borderWidth: 1,
    borderColor: "#EEF2F6",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,

    marginRight: 12, marginTop: 5
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#fff",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: { width: 20, height: 20 },

  cardTitle: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "Gilroy-Medium",
  },

  cardValue: {
    marginTop: 12,
    fontSize: 18,
    color: "#111827",
    fontFamily: "Gilroy-Bold",
  },
  cardRow: {
    paddingLeft: 5,
    paddingTop: 8,
    // paddingBottom: 0,
    marginBottom: 5, alignItems: "flex-start",
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
});
