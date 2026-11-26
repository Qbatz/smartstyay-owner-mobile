import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView, Modal, TouchableWithoutFeedback,
  Animated,
  PanResponder,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import dayjs from "dayjs";
import DateRangePicker from "../DateRangePickerComponent";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import { VendorContext } from "../../../Context/VendorContext";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import ThreeDots from "../../../Assets/Images/3dots.png";
import DotsIcon from "../../../Assets/Images/3dots.png";
import VendorInfo from "./VendorInfo";
import VendorTransactions from "./VendorTransactions";
import VendorExpenses from "./VendorExpenses";
import VendorComments from "./VendorComments";
import VendorExpenseDetailsSheet from "./VendorExpenseDetails"
import { useHasPermission } from "../../../Utils/useHasPermission"
import { CustomerContext } from "../../../Context/CustomerContext"
import { CommonContexts } from "../../../Context/CommonContext";
import Loader from "../../../Component/Loader/Loader"
import SuccessModal from "../../../ToastFile/ToastPage";
import FilterIcon from "../../../Assets/Images/filter.png";
import FilterDropdown from "../Reports/FilterDropdown";



export default function VendorDetails({ route, navigation }) {
  const { vendor } = route.params;

  const { getVendorDetails, vendorDetails, getVendorSettlementInitialize } = useContext(VendorContext);

  const { vendorList, loading, getVendorList, deleteVendor, } = useContext(CustomerContext)
  const { activeHostelId } = useContext(CommonContexts)


  const {
    canReadModule: canReadVendor,
    canWriteModule: canWriteVendor,
    canUpdateModule,
    canDeleteModule,
  } = useHasPermission("Vendor")

  const [activeTab, setActiveTab] = useState("Info");

  const [showExpenseSheet, setShowExpenseSheet] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editVendor, setEditVendor] = useState(null);
  const [deleteVendordata, setDeleteVendorData] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false)

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
   const detailsY = useRef(new Animated.Value(0)).current;

  const [showExpenseFilter,setShowExpenseFilter]=useState(false)
  const [dropdownResetKey, setDropdownResetKey] = useState(0);

  // Values being edited inside the filter sheet (applied only on "Apply")
  const [selectedCategory,setSelectedCategory]=useState(null)   // filterOptions.category item
  const [selectedPayment,setSelectedPayment]=useState(null)     // filterOptions.status item
  const [startDate,setStartDate]=useState(null)                 // "YYYY-MM-DD" from DateRangePicker
  const [endDate,setEndDate]=useState(null)
  const [minAmount,setMinAmount]=useState("")
  const [maxAmount,setMaxAmount]=useState("")
  const [filterError, setFilterError] = useState("")

  // Filters currently applied to the expense list (null = none)
  const [appliedExpenseFilters, setAppliedExpenseFilters] = useState(null)

   const {
      getVendorExpenses,
      vendorExpenses,
      vendorExpensesLoading,
      vendorExpenseFilterOptions,
      getVendorExpensePayments,
      vendorExpensePayments,
    } = useContext(VendorContext);

  console.log("vendorDetails", vendorDetails);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (vendor?.id) {
        getVendorDetails(vendor?.id);
      }
    });

    return unsubscribe; // cleanup
  }, [navigation, vendor?.id]);

  useEffect(() => {
      // getVendorExpenses(vendor?.id);
      getVendorExpensePayments(vendor?.id);
    }, [])

  const handleEdit = async (vendor) => {
    console.log("vendor", vendor);

    const res = await getVendorDetails(vendor?.id)

    if (!canUpdateModule) return;
    navigation.navigate("AddVendorPage", {
      vendorData: vendor,
    });
  }

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

            setShowExpenseFilter(false);
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


  const handleDelete = async () => {
    if (!canDeleteModule) {
      setModalType("warning");
      setModalMessage("You do not have permission to delete vendor");
      setShowSuccessModal(true);
      return;
    }
    const res = await deleteVendor(deleteVendordata?.id, activeHostelId)

    console.log("vendordelete", res);

    setDeletePopup(false)
    if (res?.success) {
      setModalType("success");
      setModalMessage(res?.message);
      setShowSuccessModal(true);

      setTimeout(() => {
        navigation.goBack()
        setShowSuccessModal(false);
        setDeletePopup(false)
      }, 1500)
    }


    else {
      setModalType("error");
      setModalMessage(res?.message || "Something went wrong");
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 2000);
    }

  }

  const handlesettlePayment = async () => {
    console.log("vendordetails", vendorDetails);

    const res = await getVendorSettlementInitialize(activeHostelId, vendor?.id)
    navigation.navigate("VendorSettlePayment", {
      type: "vendor",
      vendor: vendorDetails,
    })

  }


  // FilterDropdown identifies items by id/type and shows name/label, so pass the
  // raw filterOptions items (mapping to {label, value} broke the selected tick).
  const expenseFilterOptions = vendorExpenseFilterOptions || vendorExpenses?.filterOptions || {};
  const categoryOptions = expenseFilterOptions?.category || [];
  const paymentStatusOption = expenseFilterOptions?.status || [];

  // Date format sent to /v2/vendors/expenses (same as the Expenses list API)
  const API_DATE_FORMAT = "DD-MM-YYYY";

  const getOptionValue = (item) =>
    item?.id ?? item?.categoryId ?? item?.type ?? item?.value ?? undefined;

  // UI filter values -> API params
  const toApiExpenseFilters = (f) => {
    if (!f) return {};
    return {
      startDate: f.startDate ? dayjs(f.startDate).format(API_DATE_FORMAT) : undefined,
      endDate: f.endDate ? dayjs(f.endDate).format(API_DATE_FORMAT) : undefined,
      categoryId: getOptionValue(f.category),
      paymentStatus: getOptionValue(f.paymentStatus),
      minAmount: f.minAmount !== "" && f.minAmount != null ? Number(f.minAmount) : undefined,
      maxAmount: f.maxAmount !== "" && f.maxAmount != null ? Number(f.maxAmount) : undefined,
    };
  };

  const appliedApiFilters = useMemo(
    () => toApiExpenseFilters(appliedExpenseFilters),
    [appliedExpenseFilters]
  );

  const openExpenseFilter = () => {
    // Show what is currently applied; drop unapplied edits from last time
    const f = appliedExpenseFilters;
    setSelectedCategory(f?.category ?? null);
    setSelectedPayment(f?.paymentStatus ?? null);
    setStartDate(f?.startDate ?? null);
    setEndDate(f?.endDate ?? null);
    setMinAmount(f?.minAmount ?? "");
    setMaxAmount(f?.maxAmount ?? "");
    setFilterError("");
    setDropdownResetKey((k) => k + 1);
    detailsY.setValue(0);
    setShowExpenseFilter(true);
  };

  const isValidAmount = (v) => v === "" || (!isNaN(Number(v)) && Number(v) >= 0);

  const handleApplyFilter = async () => {
    const min = String(minAmount ?? "").trim();
    const max = String(maxAmount ?? "").trim();

    if (startDate && !endDate) {
      setFilterError("Please select End Date");
      return;
    }
    if (!isValidAmount(min) || !isValidAmount(max)) {
      setFilterError("Please enter a valid amount");
      return;
    }
    if (min !== "" && max !== "" && Number(min) > Number(max)) {
      setFilterError("Min amount cannot be greater than Max amount");
      return;
    }

    const next = {
      category: selectedCategory || null,
      paymentStatus: selectedPayment || null,
      startDate: startDate || null,
      endDate: endDate || null,
      minAmount: min,
      maxAmount: max,
    };

    const hasAny =
      next.category || next.paymentStatus || next.startDate || next.endDate ||
      next.minAmount !== "" || next.maxAmount !== "";

    if (!hasAny) {
      setFilterError("Please select at least one filter");
      return;
    }

    setFilterError("");
    setAppliedExpenseFilters(next);
    setShowExpenseFilter(false);

    // Filter change -> restart pagination from page 1
    await getVendorExpenses(vendor?.id, toApiExpenseFilters(next), 1);
  };

  const handleResetExpenseFilter = async () => {
    setSelectedCategory(null);
    setSelectedPayment(null);
    setStartDate(null);
    setEndDate(null);
    setMinAmount("");
    setMaxAmount("");
    setFilterError("");
    setDropdownResetKey((k) => k + 1);
    setAppliedExpenseFilters(null);
    setShowExpenseFilter(false);

    // Back to the unfiltered list, page 1
    await getVendorExpenses(vendor?.id, {}, 1);
  };


  const tabs = [
    "Info",
    "Transactions",
    "Expenses",
    "Comments",
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Info":
        return <VendorInfo vendor={vendorDetails} />;

      case "Transactions":
        return <VendorTransactions vendor={vendorDetails} />;

      case "Expenses":
        return (
          <>
  <VendorExpenses
            vendor={vendorDetails}
            vendorId={vendor?.id}
            filters={appliedApiFilters}
            onExpensePress={(expense) => {
              setSelectedExpense(expense);
              setShowExpenseSheet(true);
            }}
          />

           <TouchableOpacity
                      style={[styles.filterButton, appliedExpenseFilters && styles.filterButtonActive]}
                      onPress={openExpenseFilter}
                      >
                      <Image source={FilterIcon} style={{ width: 30, height: 30 }} />
                      {appliedExpenseFilters ? <View style={styles.filterActiveDot} /> : null}
                    </TouchableOpacity>
          
          </>
        

          
        );

      case "Comments":
        return <VendorComments vendor={vendorDetails} />;

      default:
        return null;
    }
  };

  console.log("DELETE DATA", deleteVendordata);

  console.log("allPaymentStatus",selectedPayment)



  return (
    <>
      {(loading || vendorExpensesLoading) && <Loader />}

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType} />

      <View style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>

         <Text
  style={styles.headerTitle}
  numberOfLines={2}
  ellipsizeMode="tail"
>
  {vendorDetails?.businessName ||
    vendorDetails?.fullName ||
    vendorDetails?.firstName ||
    "Vendor"}
</Text>


          <TouchableOpacity
            onPress={() =>
              setActiveMenu(
                activeMenu === vendor.id ? null : vendor.id
              )
            }
          >
            <Image
              source={DotsIcon}
              style={styles.dotsIcon}
            />
          </TouchableOpacity>
        </View>


        <View style={styles.summaryCard}>

          <View style={styles.badgeRow}>
            <View style={styles.vendorCode}>
              <Text style={styles.vendorCodeText}>
                {vendor?.vendorCode}
              </Text>
            </View>

            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>
                {vendor?.paymentStatus}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                Total Paid
              </Text>

              <Text style={styles.statValue}>
                ₹{vendorDetails?.summary?.totalPaid || 0}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                Total Expenses
              </Text>

              <Text style={styles.statValue}>
                ₹{vendorDetails?.summary?.totalExpense || 0}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                Outstanding
              </Text>

              <Text
                style={[
                  styles.statValue,
                  { color: "#F97316" },
                ]}
              >
                ₹{vendorDetails?.summary?.outstanding || 0}
              </Text>
            </View>

          </View>

          {Number(vendorDetails?.summary?.outstanding) > 0 && (
            <TouchableOpacity
              style={styles.settleBtn}
              onPress={handlesettlePayment}
            >
              <Text style={styles.settleText}>
                Settle Payment →
              </Text>
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity style={styles.settleBtn}
            onPress={handlesettlePayment}
          >
            <Text style={styles.settleText}>
              Settle Payment →
            </Text>
          </TouchableOpacity> */}

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

      {activeMenu === vendor?.id && (
        <>
          <TouchableWithoutFeedback
            onPress={() => setActiveMenu(null)}
          >
            <View style={styles.menuOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.menuBox}>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setActiveMenu(null);
                handleEdit(vendor);
              }}
            >
              <Image
                source={require("../../../Assets/Images/editIcon.png")}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setDeleteVendorData(vendor);
                setDeletePopup(true);
                setActiveMenu(null);
              }}
            >
              <Image
                source={require("../../../Assets/Images/trash.png")}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuText, { color: "red" }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={deletePopup}
        onRequestClose={() => setDeletePopup(false)}
      >
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteBox}>
            <Text style={styles.deleteTitle}>
              Delete Vendor?
            </Text>

            <Text style={styles.deleteSub}>
              Are you sure you want to delete this vendor?
            </Text>

            <View style={styles.deleteBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDeletePopup(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDelete}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <VendorExpenseDetailsSheet
        visible={showExpenseSheet}
        expense={selectedExpense}
        onClose={() => setShowExpenseSheet(false)}
      />


       <Modal
        visible={showExpenseFilter}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowExpenseFilter(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowExpenseFilter(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[styles.transactionSheet, { transform: [{ translateY: detailsY }] }]}
          >
            {/* Drag only from the handle/header so the form can scroll and inputs get touches */}
            <View {...detailsfilter.panHandlers}>
              <View style={styles.sheetHandle} />

              <View style={styles.filterHeaderRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={FilterIcon} style={{ width: 30, height: 30 }} />
                  <Text style={styles.filterTitle}>  Filter by</Text>
                </View>
              </View>
            </View>

            <ScrollView
              style={{ maxHeight: 460 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              <Text style={styles.label}>Category</Text>
              <FilterDropdown
                key={`category-${dropdownResetKey}`}
                options={categoryOptions}
                value={selectedCategory}
                multiSelect={false}
                onSelect={(value) => {
                  setSelectedCategory(value);
                  setFilterError("");
                }}
                placeholder="Select Category"
              />

              <Text style={styles.label}>Payment Status</Text>
              <FilterDropdown
                key={`status-${dropdownResetKey}`}
                options={paymentStatusOption}
                value={selectedPayment}
                multiSelect={false}
                onSelect={(value) => {
                  setSelectedPayment(value);
                  setFilterError("");
                }}
                placeholder="Select Payment Status"
              />

              <Text style={styles.label}>Date Range</Text>
              <DateRangePicker
                startLabel="Start"
                endLabel="End"
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(date) => {
                  setStartDate(date);
                  setFilterError("");
                }}
                onEndDateChange={(date) => {
                  setEndDate(date);
                  setFilterError("");
                }}
              />

              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountRow}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="Min Amount"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={String(minAmount ?? "")}
                  onChangeText={(t) => {
                    setMinAmount(t.replace(/[^0-9.]/g, ""));
                    setFilterError("");
                  }}
                />
                <Text style={styles.amountSeparator}>-</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="Max Amount"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={String(maxAmount ?? "")}
                  onChangeText={(t) => {
                    setMaxAmount(t.replace(/[^0-9.]/g, ""));
                    setFilterError("");
                  }}
                />
              </View>

              {filterError ? <ErrorMessage message={filterError} type="error" /> : null}
            </ScrollView>

            <View style={styles.bottomButtons}>
              <TouchableOpacity style={styles.resetBtn} onPress={handleResetExpenseFilter}>
                <Text style={styles.resetBtnText}>Reset All</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilter}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
        </KeyboardAvoidingView>
      </Modal>
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
  minHeight: 60,
  paddingHorizontal: 16,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F8F9FF",
},
headerTitle: {
  flex: 1,
  marginHorizontal: 12,
  fontSize: 18,
  fontFamily: "Gilroy-Semibold",
  color: "#111827",

  textAlign: "center",  
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
    justifyContent: "center",
    alignItems: "center",
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
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  menuBox: {
    position: "absolute",
    top: 90,
    right: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 8,
    paddingVertical: 5,
    minWidth: 130,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  menuIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  menuText: {
    fontSize: 14,
    color: "#111",
  },
  deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },

  deleteTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: '#111',
    textAlign: 'center',
  },

  deleteSub: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },

  deleteBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    color: '#444',
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
  },

  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#2D6CDF",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Gilroy-Bold"
  },
  filterButton: {
    position: "absolute",
    right: 30,
    bottom: 80,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
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
    marginTop: 20,
    marginBottom: 10
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: "Gilroy-Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  amountSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
    color: "#71717A",
  },
  filterButtonActive: {
    borderWidth: 1,
    borderColor: "#2D6CDF",
  },
  filterActiveDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2D6CDF",
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


});