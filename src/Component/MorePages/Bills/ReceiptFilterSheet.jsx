import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  BackHandler,
  PanResponder,
  StyleSheet,
  Image,Modal
} from "react-native";
import dayjs from "dayjs"
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import MultiSelectDropdown from "./MultiSelectDropdown"
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { Calendar } from "react-native-calendars";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import DatePicker from "react-native-ui-datepicker";
import { useHasPermission } from "../../../Utils/useHasPermission";
import FilterIcon from "../../../Assets/Images/filter.png";


const ReceiptFilterSheet = ({
  visible,
  onClose,
  onApply,
}) => {

 
 const { BillDetails, loading, GetAllBillDetails,
    RecordPayment, GetInitializeRefundDetails, CreateRefund, refundError
    , GetRecurringBills, recurringBills, BillPdfdetails, getBillsPdfDetails, getReceiptPdfDetails, downloadReceipt, DeleteReceipt,
    downloadBill, shareBillOnWhatsapp, shareReceiptOnWhatsapp, GetReceiptsList, receiptsList, MarkBillAsUnpaid,
    GetAdvanceCreditDetails, advanceCreditDetails, GetInitializeAdvanceRedeem } = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);


    const {
      canWriteModule: canWriteReceipt,
      canReadModule: canReadReceipt,
      canUpdateModule: canUpdateReceipt,
      canDeleteModule: canDeleteReceipt,
    } = useHasPermission("Receipt")

    const [billStatus, setBillStatus] = useState([]);
    const [type, setType] = useState([]);
    const [paymentmode, setPaymentMode] = useState([]);
    const [collectedBy, setCollectedBy] = useState([]);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [filterError, setFilterError] = useState("");
    const [showUnpaidModal, setShowUnpaidModal] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null);

      const [fromDate, setFromDate] = useState(null);
      const [toDate, setToDate] = useState(null);
    
    
      const [openFrom, setOpenFrom] = useState(false);
      const [openTo, setOpenTo] = useState(false);
      const [openUpward, setOpenUpward] = useState(false);

      

     const formatDate = (d) => {
        if (!d) return "Select Date";
        return dayjs(d).format("DD-MM-YYYY");
      };

  const amountOptions = [
    "Low to High (Lowest First)",
    "High to Low (Highest First)",
    "Newest First",
    "Oldest First",
  ];

  const filterOptions = BillDetails?.filterOptions;

const billStatusOptions =
  filterOptions?.paymentStatus?.map(i => ({
    label: i?.name,
    value: i?.type,
  })) || [];

const typeOptions =
  filterOptions?.invoiceTypes?.map(i => ({
    label: i?.name,
    value: i?.type,
  })) || [];

const modeOptions =
  filterOptions?.invoiceModes?.map(i => ({
    label: i?.name,
    value: i?.mode,
  })) || [];

const createdByOptions =
  filterOptions?.createdBy?.map(i => ({
    label: i?.name,
    value: i?.userId,
  })) || [];

  const [amountSelected, setAmountSelected] =
    useState(amountOptions[0]);

  const [amountDropdownVisible, setAmountDropdownVisible] =
    useState(false);

  const detailsY = useRef(
    new Animated.Value(0)
  ).current;

  const detailsfilter = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          detailsY.setValue(g.dy);
        }
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(detailsY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            detailsY.setValue(0);
          });
        } else {
          Animated.spring(detailsY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => sub.remove();
  }, [visible]);

  const handleApplyFilter = async () => {
     if (!canReadReceipt) return;
     if (!fromDate && toDate) {
       setFilterError("Please select Start Date");
       return;
     }
 
     const filters = {
       startDate: fromDate ? dayjs(fromDate).format("DD/MM/YYYY") : null,
       endDate: toDate ? dayjs(toDate).format("DD/MM/YYYY") : null,
       paymentStatus: billStatus,
       type: type,
       modes: paymentmode,
       collectedBy: collectedBy,
     };
 
     const hasAnyFilter =
       filters.startDate ||
       filters.endDate ||
       (filters.paymentStatus && filters.paymentStatus.length > 0) ||
       (filters.type && filters.type.length > 0) ||
       (filters.modes && filters.modes.length > 0) ||
       (filters.collectedBy && filters.collectedBy.length > 0);
 
     if (!hasAnyFilter) {
       setFilterError("Please select at least one filter");
       return;
     }
 
     await GetReceiptsList(activeHostelId, filters);
 
     setAppliedFilters(filters);
 
    onClose();
   };
 
 
 
   const handleResetFilters = async () => {
     if (!canReadReceipt) return;
     setFromDate(null);
     setToDate(null);
     setBillStatus([]);
     setType([]);
     setPaymentMode([]);
     setCollectedBy([]);
 
     setAppliedFilters(null);
     setFilterError("")
 
     await GetReceiptsList(activeHostelId);
   };

  if (!visible) return null;

  return (

    <>
  
    <View style={styles.sheetOverlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.transactionSheet,
          {
            transform: [
              { translateY: detailsY }
            ],
          },
        ]}
        {...detailsfilter.panHandlers}
      >
         <View style={styles.sheetHandle} />

                <View style={styles.filterHeaderRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={FilterIcon} style={{ width: 30, height: 30 }} />
                    <Text style={styles.filterTitle}>  Filter by</Text>
                  </View>
                </View>


                <MultiSelectDropdown
                  label="Type"
                  dropdownKey="type"
                  placeholder="Select Type"
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                  options={typeOptions}
                  selected={type}
                  onChange={(values) => {
                    setType(values);
                    setFilterError("");
                  }}
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.label}>From </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setFromDate(null);
                      setToDate(null);
                      setFilterError("")
                    }}
                  >
                    <Text style={styles.resetTextSmall}>Reset</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.dateRow}>
                  <TouchableOpacity style={styles.dateBox} onPress={() => setOpenFrom(true)}>
                    <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
                    <Image source={CalendarIcon} style={styles.calIcon} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.dateBox} onPress={() => setOpenTo(true)}>
                    <Text style={styles.dateText}>{formatDate(toDate)}</Text>
                    <Image source={CalendarIcon} style={styles.calIcon} />
                  </TouchableOpacity>
                </View>

                


                <View style={styles.quickRow}>
                  <TouchableOpacity style={styles.quickBtn} onPress={() => { setFromDate(dayjs()); setToDate(dayjs()); }}>
                    <Text style={styles.quickText}>This Month</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickBtn} onPress={() => { setFromDate(dayjs().startOf("week")); setToDate(dayjs().endOf("week")); }}>
                    <Text style={styles.quickText}>Last Month</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickBtn} onPress={() => { setFromDate(dayjs().startOf("month")); setToDate(dayjs().endOf("month")); }}>
                    <Text style={styles.quickText}>Last 3 Months</Text>
                  </TouchableOpacity>
                </View>



                <MultiSelectDropdown
                  label="Bill Status"
                  dropdownKey="billStatus"
                  placeholder="Select Bill Status"
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                  options={billStatusOptions}
                  selected={billStatus}
                  onChange={(values) => {
                    setBillStatus(values);
                    setFilterError("");
                  }}
                />




                <MultiSelectDropdown
                  label="payment mode"
                  dropdownKey="paymentmode"
                  placeholder="Select Paymentmode"
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                  options={modeOptions}
                  selected={paymentmode}
                  onChange={(values) => {
                    setPaymentMode(values);
                    setFilterError("");
                  }}
                />




                <MultiSelectDropdown
                  label="Collected By"
                  dropdownKey="CollectedBy"
                  placeholder="Select User"
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                  options={createdByOptions}
                  selected={collectedBy}
                  onChange={(values) => {
                    setCollectedBy(values);
                    setFilterError("");
                  }}
                />





                {filterError && (
                  <ErrorMessage message={filterError} type="error" />
                )}


                <View style={styles.bottomButtons}>
                  <TouchableOpacity style={styles.resetBtn}
                    onPress={() => {
                      setFromDate(null);
                      setToDate(null);
                      setCollectedBy([]);
                      setBillStatus([]);
                      setType([]);
                      setPaymentMode([]);
                      setFilterError("")
                    }}
                  >
                    <Text style={styles.resetBtnText}>Reset All</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilter}>
                    <Text style={styles.applyBtnText}>Apply</Text>
                  </TouchableOpacity>
                </View>

      </Animated.View>
    </View>

     <Modal
            transparent
            visible={openFrom}
            animationType="fade"
            onRequestClose={() => setOpenFrom(false)}
          >
            <View style={styles.datePickerOverlay}>
              <TouchableOpacity
                style={styles.outsideTouch}
                activeOpacity={1}
                onPress={() => setOpenFrom(false)}
              />
              <View style={styles.datePickerBox}>
                <TouchableWithoutFeedback>
                  <View>
                    <DatePicker
                      mode="single"
                      date={fromDate ? dayjs(fromDate) : dayjs()}
                      onChange={(d) => {
                        setFromDate(d.date);
                        setOpenFrom(false);
                        setFilterError("")
                      }}
                    />

                  </View>
                </TouchableWithoutFeedback>
              </View>

            </View>
          </Modal>


          <Modal
            transparent
            visible={openTo}
            animationType="fade"
            onRequestClose={() => setOpenTo(false)}
          >
            <View style={styles.datePickerOverlay}>

              <TouchableOpacity
                style={styles.outsideTouch}
                activeOpacity={1}
                onPress={() => setOpenTo(false)}
              />

              <View style={styles.datePickerBox}>
                <TouchableWithoutFeedback>
                  <View>
                    <DatePicker
                      mode="single"
                      date={toDate ? dayjs(toDate) : dayjs()}
                      onChange={(d) => {
                        setToDate(d.date);
                        setOpenTo(false);
                        setFilterError("")
                      }}
                    />

                  </View>
                </TouchableWithoutFeedback>
              </View>

            </View>
          </Modal>
            </>
  );
};

export default ReceiptFilterSheet;

const styles = StyleSheet.create({
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

  sheetTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    marginBottom: 20,
  },
  downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },

  dropdownMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    elevation: 15,
    zIndex: 1000,
    paddingVertical: 8,
    height: 100
  },
  filterSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: "55%",             // ⭐ increase height here
  }, filterHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },
 label: {
    color: "#777",
    fontSize: 14,
    marginBottom: 5,
  },
  filterTitle: { fontSize: 20, fontFamily: "Gilroy-Bold", },
  resetTextSmall: { color: "#2D6CDF", fontFamily: "Gilroy-Semibold", marginLeft: 10 },

  dateRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  dateBox: { width: "48%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 12 },
  // dateText: { color: "#111" },
  calIcon: { width: 20, height: 20 },

  selectWrapper: { position: "relative", width: "100%", marginTop: 8 },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 50,   // 🔥 consistent height
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  selectedText: { fontSize: 15, color: "#000", flex: 1 },
  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  quickBtn: { width: "32%", paddingVertical: 12, borderRadius: 12, backgroundColor: "#F5F6FA", alignItems: "center" },
  quickText: { color: "#111", fontFamily: "Gilroy-Medium" },
  //  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 72 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontFamily: "Gilroy-Bold" },
  applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontFamily: "Gilroy-Bold" },
    bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 5
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

  applyBtn: {
    backgroundColor: "#2D6CDF",
    paddingVertical: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },

  applyText: {
    color: "#fff",
    fontFamily: "Gilroy-Semibold",
  },
   datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  datePickerBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    elevation: 10,
    zIndex: 999,
  },
   outsideTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },


})