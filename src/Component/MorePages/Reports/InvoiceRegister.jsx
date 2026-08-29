import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity, Image, Modal,
  Animated,
  PanResponder,
  BackHandler,
  Dimensions,
} from "react-native";
import { StatusBar, Platform } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { PGContext } from "../../../Context/PGContext";
import { useHasPermission } from "../../../Utils/useHasPermission";
import { NativeModules } from "react-native";
import Loader from "../../../Component/Loader/Loader"
import MultiSelectDropdown from "../Bills/MultiSelectDropdown"
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import DownArrow from "../../../Assets/Images/direction-down.png";
import FilterBottomSheet from "./FilterBottomSheet";
import RupeeIcon from "../../../Assets/Images/Rupees.png";
import ReceiptsIcon from "../../../Assets/Images/Receipts.png";
import ReportsAllFilterBottomSheet from "./ReportsAllFilterBottomSheet"
import dayjs from "dayjs";
import FilterIcon from "../../../Assets/Images/filter.png";






const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.44

const InvoiceRegister = ({ navigation }) => {
  const { CommonModule } = NativeModules;
  const { loading, Reportsdetails, GetInvoiceReports, invoiceReports, downloadInvoiceReport } = UseSetting();
  const { activeHostelId } = useContext(CommonContexts);
  const { getParticularHostelDetails, PGDetails } = useContext(PGContext);

  const [billStatus, setBillStatus] = useState([]);
  const [type, setType] = useState([]);
  const [mode, setMode] = useState([]);
  const [filterError, setFilterError] = useState("");
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [typeSheetOpen, setTypeSheetOpen] = useState(false);

  const [tempStatus, setTempStatus] = useState([]);
  const [tempType, setTempType] = useState([]);

  const [monthSheetOpen, setMonthSheetOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [tempMonth, setTempMonth] = useState("");
  const [allFilterSheet, setAllFilterSheet] = useState(false)

  const [selectedBillStatus, setSelectedBillStatus] = useState(null)
  const [allSelectedMonth, setAllSelectedMonth] = useState(null)
  const [selectedInvoiceType, setSelectedInvoiceType] = useState(null)
  const [selectedCreatedBy, setCreatedByValue] = useState(null)
  const [selectedInvoiceMode, setSelectedModeValue] = useState(null)
  const [startDateValue, setStartDateValue] = useState(null)
  const [endDateValue, setEndDateValue] = useState(null)
  const [minPaidValue, setMinPaidValue] = useState("")
  const [maxPaidValue, setMaxPaidValue] = useState("")

  const slideAnim = useState(new Animated.Value(500))[0];

  const {
    canWriteModule: canWriteReports,
    canReadModule: canReadReports,
    canUpdateModule: canUpdateReports,
    canDeleteModule: canDeleteReports,
  } = useHasPermission("Reports")




  // useEffect(() => {
  //   if (activeHostelId) {
  //     GetInvoiceReports(activeHostelId); 
  //   }
  // }, [activeHostelId]);


  useEffect(() => {
    if (!activeHostelId) return;
    console.log("useEffect running");
    console.log(activeHostelId)


    const fetchInvoices = async () => {
      const filters = {
        page: 1,
        size: 10,
      };
      const response = await GetInvoiceReports(activeHostelId, filters
      )
      console.log("response", response);

    }

    fetchInvoices();
  }, [activeHostelId,])

  // useEffect(() => {
  //   if (activeHostelId) {
  //     getParticularHostelDetails(activeHostelId);
  //   }
  // }, [activeHostelId])


  useEffect(() => {
    const backAction = () => {
      if (statusSheetOpen) {
        closeSheet();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [statusSheetOpen]);

  const filterOptions = invoiceReports?.filterOptions;

  const billStatusOptions = filterOptions?.paymentStatus?.map(i => ({
    label: i?.name,
    value: i?.type,
  }));

  const typeOptions = filterOptions?.invoiceTypes?.map(i => ({
    label: i?.name,
    value: i?.type,
  }));

  const modeOptions = filterOptions?.invoiceModes?.map(i => ({
    label: i?.name,
    value: i?.mode,
  }));

  const monthOptions =
    filterOptions?.periods?.map((item) => ({
      label: item,
      value: item,
    })) || [];

  const openSheet = () => {
    setStatusSheetOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setStatusSheetOpen(false));
  }




  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        slideAnim.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 120) {
        closeSheet();
      } else {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  // const buildFilters = () => {
  //   return {
  //     period: selectedMonth || undefined,
  //     paymentStatus: billStatus.length > 0 ? billStatus : undefined,
  //     invoiceTypes: type.length > 0 ? type : undefined,
  //   };
  // };
  // const applyFilters = (
  //   newMonth = selectedMonth,
  //   newStatus = billStatus,
  //   newType = type
  // ) => {
  //   const filters = {
  //     period: newMonth ? newMonth : undefined,
  //     paymentStatus: newStatus?.length ? newStatus : undefined,
  //     invoiceTypes: newType?.length ? newType : undefined,
  //   };

  //   GetInvoiceReports(activeHostelId, filters);
  // };
  const formatBackendDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };

  const applyFilters = (
    newMonth = selectedMonth ?? allSelectedMonth,
    newStatus = billStatus ?? selectedBillStatus,
    newType = type ?? selectedInvoiceType,
    newCreated = selectedCreatedBy,
    newMode = selectedInvoiceMode,
    newStartDate = startDateValue,
    newEndDate = endDateValue,
    newMinPaid = minPaidValue,
    newMaxPaid = maxPaidValue
  ) => {

    let finalStartDate = newStartDate;
    let finalEndDate = newEndDate;

    const hasCustomDate =
      !!newStartDate && !!newEndDate;

    // Period based date calculation
    // Only calculate dates when Custom Date is NOT selected
    if (!hasCustomDate && newMonth === "Last 3 Months") {
      finalStartDate = dayjs()
        .subtract(2, "month")
        .startOf("month");

      finalEndDate = dayjs()
        .endOf("month");
    }

    if (!hasCustomDate && newMonth === "Last 6 Months") {
      finalStartDate = dayjs()
        .subtract(5, "month")
        .startOf("month");

      finalEndDate = dayjs()
        .endOf("month");
    }

    if (!hasCustomDate && newMonth === "Last Month") {
      finalStartDate = dayjs()
        .subtract(1, "month")
        .startOf("month");

      finalEndDate = dayjs()
        .subtract(1, "month")
        .endOf("month");
    }

    if (!hasCustomDate && newMonth === "This Month") {
      finalStartDate = dayjs()
        .startOf("month");

      finalEndDate = dayjs()
        .endOf("month");
    }

    if (newMonth === "All") {
      finalStartDate = undefined;
      finalEndDate = undefined;
    }
    const filters = {
      page: 1,
      size: 10,

      period: hasCustomDate
        ? undefined
        : newMonth || undefined,

      paymentStatus:
        newStatus?.length > 0
          ? newStatus
          : undefined,

      invoiceTypes:
        newType?.length > 0
          ? newType
          : undefined,

      createdBy:
        newCreated?.length > 0
          ? newCreated
          : undefined,

      invoiceModes:
        newMode?.length > 0
          ? newMode
          : undefined,

      startDate: finalStartDate
        ? formatBackendDate(finalStartDate)
        : undefined,

      endDate: finalEndDate
        ? formatBackendDate(finalEndDate)
        : undefined,

      minPaidAmount:
        newMinPaid
          ? Number(newMinPaid)
          : undefined,

      maxPaidAmount:
        newMaxPaid
          ? Number(newMaxPaid)
          : undefined,
    };

    console.log("Invoice Filters =>", filters);

    GetInvoiceReports(activeHostelId, filters);
  };

  // const applyFilters = (
  //   newMonth = selectedMonth ?? allSelectedMonth,
  //   newStatus = billStatus ?? selectedBillStatus,
  //   newType = type ?? selectedInvoiceType,
  //   newCreated=selectedCreatedBy,
  //   newMode = selectedInvoiceMode,
  //   newStartDate= startDateValue,
  //   newEndDate=endDateValue,
  //   newMinPaid=minPaidValue,
  //   newMaxPaid=maxPaidValue
  // ) => {


  //   const filters = {
  //     page: 1,
  //     size: 10,

  //     period: newMonth || undefined,

  //     paymentStatus:
  //       newStatus?.length > 0
  //         ? newStatus
  //         : undefined,

  //     invoiceTypes:
  //       newType?.length > 0
  //         ? newType
  //         : undefined,

  //     createdBy: newCreated?.length > 0 ? newCreated : undefined,

  //     invoiceModes: newMode?.length >0 ? newMode : undefined,
  //     startDate: newStartDate ? formatBackendDate(newStartDate) : undefined,
  //     endDate: newEndDate ? formatBackendDate(newEndDate) : undefined,
  //     minPaidAmount: newMinPaid ? Number(newMinPaid) : undefined,
  //     maxPaidAmount: newMaxPaid ? Number(newMaxPaid) : undefined
  //   };


  //   console.log("Invoice Filters =>", filters);

  //  const res= GetInvoiceReports(activeHostelId, filters);
  //  console.log("karti",res)
  // };

  // const handleDownloadInvoiceReport = async () => {

  //    const finalMonth =
  //     allSelectedMonth !== undefined ? allSelectedMonth : selectedMonth ;

  //   const finalStatus= selectedBillStatus !=undefined ? selectedBillStatus : billStatus;

  //   const finalType= selectedInvoiceType !=undefined ? selectedInvoiceType : type;

  //   const filters = {
  //     page: 1,
  //     size: 10,
  //     period: finalMonth || undefined,
  //     paymentStatus:
  //       finalStatus?.length > 0 ? finalStatus : undefined,
  //     invoiceTypes:
  //       finalType?.length > 0 ? finalType : undefined,

  //     createdBy: selectedCreatedBy?.length > 0 ? selectedCreatedBy : undefined,
  //     invoiceModes: selectedInvoiceMode?.length > 0 ? selectedInvoiceMode : undefined,
  //     startDate: startDateValue ?  formatBackendDate(startDateValue) : undefined,
  //     endDate: endDateValue ? formatBackendDate(endDateValue) : undefined,
  //     minPaidAmount: minPaidValue || undefined,
  //     maxPaidAmount: maxPaidValue || undefined,
  //   };



  //   const res = await downloadInvoiceReport(activeHostelId, filters);

  //   if (res?.success && res?.url) {
  //     await CommonModule.downloadAndViewDocument(res.url);
  //   }
  // };

  const handleDownloadInvoiceReport = async () => {
    const finalMonth =
      allSelectedMonth !== undefined && allSelectedMonth !== null
        ? allSelectedMonth
        : selectedMonth;

    const finalStatus =
      selectedBillStatus !== undefined && selectedBillStatus !== null
        ? selectedBillStatus
        : billStatus;

    const finalType =
      selectedInvoiceType !== undefined && selectedInvoiceType !== null
        ? selectedInvoiceType
        : type;

    const finalCreatedBy =
      selectedCreatedBy?.length > 0
        ? selectedCreatedBy
        : undefined;

    const finalMode =
      selectedInvoiceMode?.length > 0
        ? selectedInvoiceMode
        : undefined;

    // -----------------------------------
    // Custom Date check
    // -----------------------------------

    const hasCustomDate =
      !!startDateValue && !!endDateValue;

    let finalStartDate = startDateValue;
    let finalEndDate = endDateValue;

    // -----------------------------------
    // Period dates
    // Only calculate when custom date
    // is NOT selected
    // -----------------------------------

    if (!hasCustomDate && finalMonth === "Last 3 Months") {
      finalStartDate = dayjs()
        .subtract(2, "month")
        .startOf("month");

      finalEndDate = dayjs()
        .endOf("month");
    }

    if (!hasCustomDate && finalMonth === "Last 6 Months") {
      finalStartDate = dayjs()
        .subtract(5, "month")
        .startOf("month");

      finalEndDate = dayjs()
        .endOf("month");
    }

    if (!hasCustomDate && finalMonth === "Last Month") {
      finalStartDate = dayjs()
        .subtract(1, "month")
        .startOf("month");

      finalEndDate = dayjs()
        .subtract(1, "month")
        .endOf("month");
    }

    if (!hasCustomDate && finalMonth === "This Month") {
      finalStartDate = dayjs()
        .startOf("month");

      finalEndDate = dayjs()
        .endOf("month");
    }

    // -----------------------------------
    // Build export filters
    // -----------------------------------

    const filters = {
      page: 1,
      size: 10,

      // IMPORTANT:
      // Custom date -> don't send period
      period: hasCustomDate
        ? undefined
        : finalMonth || undefined,

      paymentStatus:
        finalStatus?.length > 0
          ? finalStatus
          : undefined,

      invoiceTypes:
        finalType?.length > 0
          ? finalType
          : undefined,

      createdBy: finalCreatedBy,

      invoiceModes: finalMode,

      startDate: finalStartDate
        ? formatBackendDate(finalStartDate)
        : undefined,

      endDate: finalEndDate
        ? formatBackendDate(finalEndDate)
        : undefined,

      minPaidAmount:
        minPaidValue
          ? Number(minPaidValue)
          : undefined,

      maxPaidAmount:
        maxPaidValue
          ? Number(maxPaidValue)
          : undefined,
    };

    console.log(
      "EXPORT INVOICE FILTERS =>",
      filters
    );

    const res = await downloadInvoiceReport(
      activeHostelId,
      filters
    );

    if (res?.success && res?.url) {
      await CommonModule.downloadAndViewDocument(res.url);
    }
  };
  console.log("invoiceReports", invoiceReports);


  const isValidSubscription = PGDetails?.isSubscriptionActive;
  const isExportAllow = isValidSubscription && canReadReports;
  const insets = useSafeAreaInsets()

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
  prefix,
  suffix,
  showRupee = true,
  valueColor = "#111827",
  linearcolor
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
          style={styles.cardIcon}
        />
      </View>
    </View>
  </LinearGradient>
);


  // const SummaryCard = ({
  //   icon,
  //   title,
  //   value,
  //   prefix,
  //   suffix,
  //   valueColor = "#111827",
  //   linearcolor
  // }) => (
  //   <LinearGradient
  //     colors={["#FFFFFF", linearcolor]}
  //     start={{ x: 0, y: 0 }}
  //     end={{ x: 1, y: 1 }}
  //     style={styles.summaryCard}
  //   >
  //     <View style={styles.cardTopRow}>
  //       <View style={styles.cardContent}>
  //         <Text style={styles.cardTitle}>
  //           {title}
  //         </Text>

  //         <Text style={[styles.cardValue, { color: valueColor }]}>
  //           ₹ {prefix && <Text>{prefix}</Text>}

  //           <AnimatedNumber value={value} />

  //           {suffix && <Text>{suffix}</Text>}
  //         </Text>
  //       </View>

  //       <View style={styles.iconBox}>
  //         <Image
  //           source={icon}
  //           style={styles.cardIcon}
  //         />
  //       </View>
  //     </View>
  //   </LinearGradient>
  // );


  return (
    <>
      {loading && <Loader />}
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        edges={["left", "right", "bottom"]}
      >
        {/* <View style={styles.container}> */}
        <View style={[styles.container, {
          paddingTop: Platform.OS === "android"
            ? StatusBar.currentHeight + 10
            : 20
        }]}>



          <View style={styles.headerRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={ArrowLeft} style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.title}>Invoices</Text>
            </View>

            <TouchableOpacity
              style={styles.monthBtn}
              onPress={() => {
                setTempMonth(selectedMonth);
                setMonthSheetOpen(true);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.monthText}>  {selectedMonth || "Select Month"}</Text>
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
    <Text style={styles.label}>Total Amount</Text>
    <Text style={styles.totalValue}>₹ {invoiceReports?.totalAmount || 0}</Text>
  </View>
<View style={styles.divider} />
  <View style={styles.row}>
    <Text style={styles.label}>Paid</Text>
    <Text style={styles.value}>₹ {invoiceReports?.paidAmount || 0}</Text>
  </View>

  <View style={styles.row}>
    <Text style={styles.label}>Outstanding</Text>
    <Text style={styles.value}>₹ {invoiceReports?.outStandingAmount || 0}</Text>
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
                title="Total Invoice"
                value={invoiceReports?.totalInvoices}
                icon={ReceiptsIcon}
                linearcolor="#FFF4F4"
                 showRupee={false}
              />

              <SummaryCard
                title="Total Amount"
                value={invoiceReports?.totalAmount}
                icon={RupeeIcon}
                valueColor="#00A651"
                linearcolor="#F4FFF7"
              />

              <SummaryCard
                title="Paid Amount"
                value={invoiceReports?.paidAmount}
                icon={RupeeIcon}
                linearcolor="#FFF4F4"
              />

              <SummaryCard
                title="Outstanding"
                value={invoiceReports?.outStandingAmount}
                icon={RupeeIcon}
                linearcolor="#FFF4F4"
              />
            </ScrollView>
          </View>


          <View style={styles.filterRow}>

            {/* <TouchableOpacity
              style={[
                styles.filterBox,
              ]}
              onPress={() => {
                setAllFilterSheet(true)
              }}
            >
              <Text
                style={[
                  styles.filterText,
                ]}
              > 
                  All
              </Text>
              <Image source={DownArrow} style={{ width: 16, height: 16, marginLeft: 6 }} />
            </TouchableOpacity> */}

            {/* STATUS BUTTON */}

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={[
                  styles.filterBox,
                  billStatus.length > 0 && styles.filterBoxActive,
                ]}
                onPress={() => {
                  setTempStatus(billStatus);
                  setStatusSheetOpen(true);
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    billStatus.length > 0 && styles.filterTextActive,
                  ]}
                >
                  {billStatus.length === 0
                    ? "Status"
                    : `${billStatus[0]} ${billStatus.length > 1 ? `+${billStatus.length - 1} more` : ""
                    }`}
                </Text>
                <Image source={DownArrow} style={{ width: 16, height: 16, marginLeft: 6 }} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterBox,
                  type.length > 0 && styles.filterBoxActive,
                ]}
                onPress={() => {
                  setTempType(type);
                  setTypeSheetOpen(true);
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    type.length > 0 && styles.filterTextActive,
                  ]}
                >
                  {type.length === 0
                    ? "Type"
                    : `${type[0]} ${type.length > 1 ? `+${type.length - 1} more` : ""
                    }`}
                </Text>
                <Image source={DownArrow} style={{ width: 16, height: 16, marginLeft: 6 }} />
              </TouchableOpacity>

            </View>


            <TouchableOpacity
              style={styles.filterIconBtn}
              onPress={() => setAllFilterSheet(true)}
            >
              <Image source={FilterIcon} style={{ width: 18, height: 18 }} />
            </TouchableOpacity>
          </View>






          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
          >
            {/* SUMMARY CARD */}


            {/* FILTER */}


            {/* LIST */}
            {!loading && invoiceReports?.invoiceList?.map((item, index) => (
              <View key={item?.invoiceId || index} style={styles.listItem}>
                <View>
                  <Text style={styles.name}>  {item.fullName?.trim() || item.firstName}</Text>
                  <Text style={styles.sub}>{item.invoiceNumber}</Text>
                </View>
                <Text style={styles.amount}>₹ {item.invoiceAmount}</Text>
              </View>
            ))}

            {!loading && invoiceReports && invoiceReports?.invoiceList?.length === 0 && (
              <View style={styles.emptyContainer}>
                <Image source={EmptyState} style={styles.emptyImage} />
                <Text style={styles.emptyText}>No Invoices are there!</Text>
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
            style={[styles.exportBtn, !isExportAllow && { opacity: 0.4 }]}
            disabled={!isExportAllow}
            // style={styles.exportBtn}
            onPress={handleDownloadInvoiceReport}>
            <Text style={styles.exportText}>Export PDF</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>

      {/* 
    {statusSheetOpen && (
  <View style={styles.sheetOverlay}>
    <View style={styles.sheet}>
      <Text style={styles.sheetTitle}>Payment Status</Text>

      {billStatusOptions?.map((item) => {
        const checked = tempStatus.includes(item.value);
        return (
          <TouchableOpacity
            key={item.value}
            style={styles.sheetRow}
            onPress={() => {
              if (checked) {
                setTempStatus(tempStatus.filter(v => v !== item.value));
              } else {
                setTempStatus([...tempStatus, item.value]);
              }
            }}
          >
            <Text style={styles.sheetText}>{item.label}</Text>
            <View style={[styles.radio, checked && styles.radioActive]} />
          </TouchableOpacity>
        );
      })}

      <View style={styles.sheetButtons}>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => setTempStatus([])}
        >
          <Text style={{ color: "#1D4ED8" }}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => {
            setBillStatus(tempStatus);
            setStatusSheetOpen(false);
          }}
        >
          <Text style={{ color: "#fff" }}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)} */}

      <FilterBottomSheet
        visible={monthSheetOpen}
        title="Select Month"
        options={monthOptions}
        selectedValues={tempMonth ? [tempMonth] : []}
        setSelectedValues={(val) => setTempMonth(val[0])}
        isSingleSelect={true}

        onReset={() => {
          setTempMonth("");
          setSelectedMonth("");
          setMonthSheetOpen(false);

          applyFilters("", billStatus, type);
        }}

        // onApply={() => {
        //   setSelectedMonth(tempMonth);
        //   setMonthSheetOpen(false);

        //   applyFilters(tempMonth, billStatus, type);
        // }}

        onApply={() => {
          setSelectedMonth(tempMonth);

          setStartDateValue(null);
          setEndDateValue(null);

          setAllSelectedMonth(tempMonth);

          setMonthSheetOpen(false);

          applyFilters(
            tempMonth,
            billStatus,
            type,
            selectedCreatedBy,
            selectedInvoiceMode,
            null,
            null,
            minPaidValue,
            maxPaidValue
          );
        }}

        onClose={() => setMonthSheetOpen(false)}
      />


      <FilterBottomSheet
        visible={statusSheetOpen}
        title="Payment Status"
        options={billStatusOptions || []}
        selectedValues={tempStatus}
        setSelectedValues={setTempStatus}

        onReset={() => {
          setTempStatus([]);
          setBillStatus([]);
          setStatusSheetOpen(false);

          applyFilters(selectedMonth, [], type);
        }}

        onApply={() => {
          setBillStatus(tempStatus);
          setStatusSheetOpen(false);

          applyFilters(selectedMonth, tempStatus, type);
        }}

        onClose={() => setStatusSheetOpen(false)}
      />

      <FilterBottomSheet
        visible={typeSheetOpen}
        title="Invoice Type"
        options={typeOptions || []}
        selectedValues={tempType}
        setSelectedValues={setTempType}

        onReset={() => {
          setTempType([]);
          setType([]);
          setTypeSheetOpen(false);

          applyFilters(selectedMonth, billStatus, []);
        }}

        onApply={() => {
          setType(tempType);
          setTypeSheetOpen(false);

          applyFilters(selectedMonth, billStatus, tempType);
        }}

        onClose={() => setTypeSheetOpen(false)}
      />

      <ReportsAllFilterBottomSheet
        visible={allFilterSheet}
        filters={filterOptions}
        reportType="invoice"
        // selectedFilters={ }
        setSelectedBillStatus={setSelectedBillStatus}
        setSelectedMonth={setAllSelectedMonth}
        setSelectedInvoiceType={setSelectedInvoiceType}
        setCreatedByValue={setCreatedByValue}
        setSelectedModeValue={setSelectedModeValue}
        setHeaderSelectedMonth={setSelectedMonth}
        // setTenantValue={setTenantValue}
        setStartDateValue={setStartDateValue}
        setEndDateValue={setEndDateValue}
        setMinPaidValue={setMinPaidValue}
        setMaxPaidValue={setMaxPaidValue}

        onReset={() => {
          setSelectedBillStatus(null), setAllSelectedMonth(""), setSelectedInvoiceType(null),
            setCreatedByValue(null), setSelectedModeValue(null), setStartDateValue(null),
            setEndDateValue(null), setMaxPaidValue(""), setMinPaidValue("")
          // setAllFilterSheet(false)
          applyFilters("", [], [], [], [], "", "", "", "")
        }}
        onApply={() => {
          setAllFilterSheet(false)
          applyFilters(allSelectedMonth, selectedBillStatus, selectedInvoiceType, selectedCreatedBy,
            selectedInvoiceMode, startDateValue, endDateValue, minPaidValue, maxPaidValue)
        }}
        onClose={() => setAllFilterSheet(false)}
      />


    </>


  );
};

export default InvoiceRegister;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    //  paddingTop: insets.top,
    // paddingTop: 60,
    backgroundColor: "#fff",
  },


  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },


  headerRow: {
    // height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 10,
    // marginTop: 10,
  },
  monthBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
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

  // summaryCard: {
  //   borderRadius: 14,
  //   paddingVertical: Platform.OS === "android"
  //     ? 16 : 1,
  //   paddingHorizontal: Platform.OS === "android"
  //     ? 16 : 1,
  //   marginBottom: 14,
  // },

  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 2,
    marginBottom: 4
  },

  totalValue: {
    fontSize: 20,
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
    flexDirection: "row", alignItems: 'center', justifyContent: 'space-between',
    marginTop: 10,
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

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
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
    marginLeft: 8
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
    // flex: 1,
    // padding: 12,width:100,
    // borderRadius: 12,
    // borderWidth: 1,
    // borderColor: "#E5E7EB",
    // marginRight: 8,
    // backgroundColor: "#fff",
    // flexDirection: "row", justifyContent: "center", alignItems: "center"
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
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

  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "75%",
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },

  sheetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  sheetText: {
    fontSize: 16,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },

  radioActive: {
    borderColor: "#1D4ED8",
    backgroundColor: "#1D4ED8",
  },

  sheetButtons: {
    flexDirection: "row",
    marginTop: 20,
  },

  resetBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    marginRight: 10,
    alignItems: "center",
  },

  applyBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
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

});
