import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet, TouchableWithoutFeedback,
  Modal, Animated,
  PanResponder,
  BackHandler, TextInput, ScrollView, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { useHasPermission } from "../../../Utils/useHasPermission";
import DatePicker from "react-native-ui-datepicker";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import SuccessModal from "../../../ToastFile/ToastPage";
import { s, vs } from "../../../Utils/rnScale";
import ProfileImage from "../../../Assets/Images/Avatar.png";
import FilterIcon from "../../../Assets/Images/filter.png";
import DueIcon from "../../../Assets/Images/Due_Icon.png";
import MoneyCheckIcon from "../../../Assets/Images/money_check.png";
import PreviewIcon from "../../../Assets/Images/View_Icon.png";
import WriteOffDueIcon from "../../../Assets/Images/writeoff_due_icon.png";
import Dots from "../../../Assets/Images/3dots.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import Bills_Black_Icon from "../../../Assets/Images/Bills_Black_Icon.png";
import EmptyFloor from "../../../Assets/Images/Empty_state.png"
import CalendarIcon from "../../../Assets/Images/calendar.png";
import CalendarBlueIcon from "../../../Assets/Images/calendar_blue.png";
import Download from "../../../Assets/Images/download.png";
import DownArrow from "../../../Assets/Images/direction-down.png";

const RecurringBills = () => {


  const { BillDetails, loading, GetAllBillDetails, RecordPayment, GetInitializeRefundDetails, CreateRefund, refundError,
    GetRecurringBills, recurringBills, UpdateTenantRecurringStatus } = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);

  console.log("recurringBills", recurringBills);

  const {
    canWriteModule: canWriteRecurringBills,
    canReadModule: canReadRecurringBills,
    canUpdateModule: canUpdateRecurringBills,
    canDeleteModule: canDeleteRecurringBills,
  } = useHasPermission("Recurring bills")

  // styles ==>

  // fontSize / padding / margin / width / height → s()
  // marginTop / bottom / modal height → vs()

  const [stayType, setStayType] = useState("Long Stay");
  const [openDropdown, setOpenDropdown] = useState(false);
  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");

  const [selectedBill, setSelectedBill] = useState(null);

  dayjs.extend(customParseFormat);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);

  const detailsY = useRef(new Animated.Value(0)).current;
  const detailsSheetY = useRef(new Animated.Value(0)).current;

  const amountOptions = [
    "Low to High (Lowest First)",
    "High to Low (Highest First)",
    "Newest First",
    "Oldest First",
  ];

  const [amountSelected, setAmountSelected] = useState(amountOptions[0]);
  const [amountDropdownVisible, setAmountDropdownVisible] = useState(false);

  const formatApiDate = (date) =>
    date
      ? dayjs(date, "DD/MM/YYYY").format("DD MMM YYYY")
      : "--";


  //  useEffect(() => {
  //   if (activeHostelId) {
  //     GetRecurringBills(activeHostelId);
  //   }
  // }, [activeHostelId]);

  useEffect(() => {
    if (activeHostelId && canReadRecurringBills) {
      GetRecurringBills(activeHostelId);
    }
  }, [activeHostelId, canReadRecurringBills]);


  console.log("canReadRecurringBills", canReadRecurringBills);



  useLayoutEffect(() => {
    const backAction = () => {

      if (showFilter) {
        setShowFilter(false);
        return true;
      }

      if (showBillDetails) {
        setShowBillDetails(false);
        return true;
      }





      return false;
    };

    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => handler.remove();
  }, [showBillDetails, showFilter]);

  useEffect(() => {
    const onBackPress = () => {
      if (amountDropdownVisible) {
        setAmountDropdownVisible(false);
        return true;
      }

      if (openFrom) {
        setOpenFrom(false);
        return true;
      }
      if (openTo) {
        setOpenTo(false);
        return true;
      }
      if (showFilter) {
        setShowFilter(false);
        return true;
      }




      return false;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [showFilter, openFrom, openTo, amountDropdownVisible]);

  const billDetailsPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) detailsSheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(detailsSheetY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setShowBillDetails(false);
            detailsSheetY.setValue(0);
          });
        } else {
          Animated.spring(detailsSheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;


  const detailsfilter = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) detailsY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(detailsY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setShowFilter(false);
            detailsY.setValue(0);
          });
        } else {
          Animated.spring(detailsY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const toggleAmountDropdown = () => {
    setAmountDropdownVisible((v) => !v);
  };

  const handleBillDetails = () => {
    setShowBillDetails(true)
  }


  const toggleSwitch = (id) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const handleToggleRecurring = async (item) => {
    if (!canUpdateRecurringBills) return;
    const newStatus = !item.currentStatus;

    const res = await UpdateTenantRecurringStatus({
      hostelId: activeHostelId,
      customerId: item.customerId,
      status: newStatus,
    });

    console.log("res", res);


    if (res.success) {
      setModalType("success");
      setModalMessage(res?.data);
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 1500);
    } else {
      setModalType("success");
      setModalMessage(res?.message || "Failed to update status");
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 1500);
      // alert(res.message || "Failed to update status");
    }
  };
  ;

  const EmptyRecurringState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={EmptyFloor}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyText}>
        No Recurring Bills Found
      </Text>
    </View>
  );


  const renderItem = ({ item }) => {
    const isActive = item.currentStatus;

    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => {
          if (!canReadRecurringBills) return;
          setSelectedBill(item);
          setShowBillDetails(true);
        }}>


          {item.profilePic ? (
            <Image
              source={{ uri: item.profilePic }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.initialCircle}>
              <Text style={styles.initialText}>
                {item.initials}
              </Text>
            </View>
          )}

        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.fullName}</Text>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: vs(3) }}>
            <View style={styles.tagBox}>
              <Text style={styles.tag}>Recurring Inv</Text>
            </View>

            <Image
              source={Bills_Black_Icon}
              style={{ width: 12, height: 12, marginTop: vs(3), marginRight: s(5) }}
            />

            <Text style={styles.bill}>
              {item.lastInvoiceNumber || "--"}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.labelOn}>
              {isActive ? "On" : "Off"}
            </Text>

            <TouchableOpacity
              onPress={() => handleToggleRecurring(item)}
              disabled={!canUpdateRecurringBills}
              style={{ opacity: canUpdateRecurringBills ? 1 : 0.4 }}
            >
              <View
                style={[
                  styles.switch,
                  { backgroundColor: isActive ? "#3562FF" : "#A68DE3" },
                ]}
              >
                <View
                  style={[
                    styles.knob,
                    { transform: [{ translateX: isActive ? s(18) : 0 }] },
                  ]}
                >
                  <Text style={{ fontSize: 10, fontWeight: "700" }}>
                    {isActive ? "✓" : "✕"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.date}>
            {formatApiDate(item?.lastInvoiceDate)}
          </Text>
        </View>
      </View>
    );
  };

  return (

    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />


      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.monthText}>This Month</Text>

          <View style={{ position: "relative" }}>
            <TouchableOpacity
              onPress={() => setOpenDropdown(!openDropdown)}
              style={styles.dropButton}
            >
              <Text style={styles.dropButtonText}>{stayType}</Text>

              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            {openDropdown && (
              <View style={styles.dropCard}>
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    setStayType("Long Stay");
                    setOpenDropdown(false);
                  }}
                >
                  <Text style={styles.optionText}>Long Stay</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    setStayType("Short Stay");
                    setOpenDropdown(false);
                  }}
                >
                  <Text style={styles.optionText}>Short Stay</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </View>

        {/* <FlatList
  data={recurringBills?.customers || []}
  renderItem={renderItem}
  keyExtractor={(item) => item.customerId}
  showsVerticalScrollIndicator={false}
  overScrollMode="never"
  contentContainerStyle={{
    flexGrow: 1,              
    paddingBottom: vs(120),
  }}
  ListEmptyComponent={!loading && <EmptyRecurringState />}
/> */}


        {!canReadRecurringBills && !loading ? (
          <View style={styles.emptyContainer}>
            <Image source={EmptyFloor} style={styles.emptyImage} />
            <Text style={styles.emptyText}>
              You don’t have permission to view recurring bills
            </Text>
          </View>
        ) : (
          <FlatList
            data={recurringBills?.customers || []}
            renderItem={renderItem}
            keyExtractor={(item) => item.customerId}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: vs(120),
            }}
            ListEmptyComponent={!loading && <EmptyRecurringState />}
          />
        )}




        {!loading && recurringBills?.customers?.length > 0 && (
          <TouchableOpacity
            style={[styles.filterButton, !canReadRecurringBills && { opacity: 0.4 }]}
            disabled={!canReadRecurringBills}
            onPress={() => setShowFilter(true)} >
            <Image source={FilterIcon} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>

        )}





        {showBillDetails && (
          <View style={styles.sheetOverlay}>

            <TouchableWithoutFeedback onPress={() => setShowBillDetails(false)}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

            <Animated.View
              style={[
                styles.transactionSheet,
                { minHeight: vs(280), maxHeight: vs(420), transform: [{ translateY: detailsSheetY }] }
              ]}
              {...billDetailsPan.panHandlers}
            >
              <View style={styles.sheetHandle} />

              <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.billHeaderRow}>
                  <Text style={styles.billHeaderText}>Bill Details</Text>


                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    {/* <Image
                source={Download}
                style={{ width: 23, height: 23, marginRight:10 }}
              /> */}


                    {/* <TouchableOpacity>
              <Image
                source={Dots}
                style={{ width: 28, height: 28,  }}
              />
            </TouchableOpacity> */}
                  </View>
                </View>

                <View style={styles.userRow}>

                  {selectedBill.profilePic ? (
                    <Image
                      source={{ uri: selectedBill.profilePic }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.initialCircle}>
                      <Text style={styles.initialText}>
                        {selectedBill.initials}
                      </Text>
                    </View>
                  )}



                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.userName}>{selectedBill?.fullName || "--"}</Text>

                    <View style={{ flexDirection: "row", marginTop: vs(4) }}>
                      <View style={styles.invTypeBadge}>
                        <Text style={styles.invTypeText}>Recurring Inv</Text>
                      </View>

                      <Image source={Bills_Black_Icon} style={{
                        width: 12,
                        height: 12, marginTop: vs(5), marginRight: s(5)
                      }} />
                      <Text style={styles.billNumber}> #{selectedBill?.lastInvoiceNumber || "--"}</Text>
                    </View>
                  </View>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(10) }}>
                  <View><Text style={{ fontSize: 16, fontWeight: 500 }}>Recurring</Text></View>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                    <Text style={styles.labelOn}>
                      {selectedBill?.currentStatus ? "On" : "Off"}
                    </Text>

                    <TouchableOpacity>
                      <View
                        style={[
                          styles.switch,
                          { backgroundColor: selectedBill?.currentStatus ? "#3562FF" : "#A68DE3" },
                        ]}
                      >
                        <View
                          style={[
                            styles.knob,
                            { transform: [{ translateX: selectedBill?.currentStatus ? s(18) : 0 }] },
                          ]}
                        >
                          <Text style={{ fontSize: 10, fontWeight: "700" }}>
                            {selectedBill?.currentStatus ? "✓" : "✕"}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>



                  </View>
                </View>

                <View style={styles.twoColRow}>
                  <View style={styles.colItem}>
                    <Text style={styles.label}>Last Invoice date</Text>
                    <View style={styles.rowAlign}>
                      <Image source={CalendarBlueIcon} style={styles.iconSmall} />
                      <Text style={styles.value}> {formatApiDate(selectedBill?.lastInvoiceDate)}</Text>
                    </View>
                  </View>

                  <View style={styles.colItem}>
                    <Text style={styles.label}>Next Invoice date</Text>
                    <View style={styles.rowAlign}>
                      <Image source={CalendarBlueIcon} style={styles.iconSmall} />
                      <Text style={styles.value}> {formatApiDate(selectedBill?.nextInvoiceDate)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.twoColRow}>
                  <View style={styles.colItem}>
                    <Text style={styles.label}>Amount</Text>
                    <View style={styles.rowAlign}>
                      <Image source={MoneyCheckIcon} style={{
                        width: 18,
                        height: 18, marginTop: vs(5), marginRight: s(5)
                      }} />
                      <Text style={styles.amountValue}>₹{selectedBill?.invoiceAmount ?? "--"}</Text>
                    </View>
                  </View>


                </View>

                {/* <TouchableOpacity style={styles.previewBtn} >
            <View style={{display:'flex', flexDirection:'row'}}>
                       <Image source={PreviewIcon} style={{   width: 18,
            height: 18, marginTop:3 , marginRight:12
          }} />
            <Text style={styles.previewText}>Preview</Text>
            </View>
          </TouchableOpacity> */}

              </ScrollView>


            </Animated.View>
          </View>
        )}


        {showFilter && (
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
                  <Image source={FilterIcon} style={{ width: 40, height: 40 }} />
                  <Text style={styles.filterTitle}>  Filter by</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.label}>Date Range</Text>
                <TouchableOpacity
                  onPress={() => {
                    setFromDate(dayjs());
                    setToDate(dayjs());
                    setAmountSelected(amountOptions[0]);
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
                  <Text style={styles.quickText}>Today</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickBtn} onPress={() => { setFromDate(dayjs().startOf("week")); setToDate(dayjs().endOf("week")); }}>
                  <Text style={styles.quickText}>This Week</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickBtn} onPress={() => { setFromDate(dayjs().startOf("month")); setToDate(dayjs().endOf("month")); }}>
                  <Text style={styles.quickText}>This Month</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { marginTop: vs(18) }]}>Type</Text>

              <View
                style={styles.selectWrapper}
                onLayout={(event) => {
                  const { y, height } = event.nativeEvent.layout;
                  const screenHeight = Dimensions.get("window").height;
                  const bottomSpace = screenHeight - (y + height);

                  setOpenUpward(bottomSpace < 250);
                }}
              >
                <TouchableOpacity style={styles.selectBox} onPress={toggleAmountDropdown}>
                  <Text style={styles.selectedText}>{amountSelected}</Text>
                  <Image source={DownArrow} style={styles.downArrow} />
                </TouchableOpacity>

                {amountDropdownVisible && (
                  <View style={[styles.dropdownMenu, openUpward ? { bottom: 58 } : { top: 58 }]}>
                    <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled showsVerticalScrollIndicator={true}>
                      {amountOptions.map((opt) => (
                        <TouchableOpacity key={opt} style={styles.option}
                          onPress={() => {
                            setAmountSelected(opt);
                            setAmountDropdownVisible(false);
                          }}
                        >
                          <Text style={styles.optionText}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.resetBtn}
                  onPress={() => {
                    setFromDate(dayjs());
                    setToDate(dayjs());
                    setAmountSelected(amountOptions[0]);
                  }}
                >
                  <Text style={styles.resetBtnText}>Reset All</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilter(false)}>
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        )}
      </View>
    </>
  );
};

export default RecurringBills;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(15),
    backgroundColor: "#fff",
    position: "relative",
    zIndex: 1,
  },


  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: vs(10),
    marginBottom: vs(10),
    zIndex: 1000,
  },

  monthText: { fontSize: s(16), fontWeight: "600" },

  dropButton: {
    borderWidth: 1,
    borderColor: "#C9C9C9",
    paddingHorizontal: 12,
    paddingVertical: vs(6),
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  initialCircle: {
    width: s(40),
    height: s(40),
    borderRadius: 25,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(12),
  },

  initialText: {
    fontSize: s(16),
    fontWeight: "700",
    color: "#4B5563",
  },


  dropButtonText: {
    fontSize: s(14),
    color: "#000",
    marginRight: s(6),
  },

  arrow: {
    fontSize: s(12),
    color: "#444",
  },

  dropCard: {
    position: "absolute",
    top: vs(40),
    right: 0,
    width: s(150),
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: vs(8),
    elevation: 10,
    zIndex: 9999,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
  },


  optionRow: {
    paddingVertical: vs(8),
    paddingHorizontal: 12,
  },

  optionText: {
    fontSize: s(14),
    color: "#000",
  },


  row: {
    flexDirection: "row",
    paddingVertical: vs(14),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  avatar: {
    width: s(40),
    height: s(40),
    borderRadius: 30,
    marginRight: s(12),
  },

  name: { fontSize: s(16), fontWeight: "700", color: "#000" },

  tagBox: {
    backgroundColor: "#FFE69C",
    paddingHorizontal: 8,
    paddingVertical: vs(3),
    borderRadius: 6,
    marginRight: s(6),
  },

  tag: { fontSize: s(12), fontWeight: "600", color: "#976600" },

  bill: { fontSize: s(10), color: "#777" },

  labelOn: { fontSize: s(12), color: "#3562FF", marginBottom: 2, marginRight: s(5) },

  switch: {
    width: s(42),
    height: s(24),
    borderRadius: 20,
    padding: s(3),
    justifyContent: "center",
  },

  knob: {
    width: s(18),
    height: s(18),
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  date: {
    marginTop: vs(4),
    fontSize: s(11),
    color: "#878787",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyImage: {
    width: s(250),
    height: vs(180),
  },

  emptyText: {
    marginTop: vs(12),
    fontSize: s(14),
    color: "#777",
  },


  filterButton: {
    position: "absolute",
    bottom: vs(70),
    right: s(55),
    backgroundColor: "#fff",
    padding: s(10),
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
  transactionSheet: {
    backgroundColor: "#fff",
    padding: s(20),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: vs(30),
    minHeight: vs(280),
    maxHeight: vs(420),
  },
  sheetHandle: {
    width: s(60),
    height: s(5),
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 30,
    marginBottom: 15,
  },
  billHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },

  billHeaderText: {
    fontSize: s(20),
    fontWeight: "700",
    color: "#000",
  },

  statusBadge: {
    backgroundColor: "#D7FFD7",
    paddingHorizontal: 14,
    paddingVertical: vs(6),
    borderRadius: 20,
  },

  statusText: {
    color: "#2E8B2E",
    fontWeight: "700",
    fontSize: s(13),
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vs(15),
  },

  userImg: {
    width: s(55),
    height: s(55),
    borderRadius: 30,
  },

  userName: {
    fontSize: s(17),
    fontWeight: "700",
    color: "#000",
  },

  invTypeBadge: {
    backgroundColor: "#FFE6C7",
    paddingHorizontal: 10,
    paddingVertical: vs(4),
    borderRadius: 8,
    marginRight: s(8),
  },

  invTypeText: {
    color: "#C67506",
    fontWeight: "600",
    fontSize: s(12),
  },

  billNumber: {
    color: "#555",
    fontSize: s(13),
    alignSelf: "center",
  },

  twoColRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: vs(25),
  },

  colItem: {
    width: "48%",
  },

  label: {
    color: "#777",
    fontSize: s(14),
    marginBottom: 5,
  },

  rowAlign: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconSmall: {
    width: s(18),
    height: s(18),
    marginRight: s(6),
  },

  value: {
    fontSize: s(16),
    fontWeight: "600",
    color: "#000",
  },

  amountValue: {
    fontSize: s(16),
    fontWeight: "700",
    color: "#000",
  },

  dueValue: {
    fontSize: s(16),
    fontWeight: "700",
    color: "red",
  },

  previewBtn: {
    backgroundColor: "#1E45E1",
    paddingVertical: vs(14),
    borderRadius: 12,
    marginTop: vs(39),
    alignItems: "center",
  },

  previewText: {
    color: "#fff",
    fontSize: s(16),
    fontWeight: "700",
  },

  filterHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  option: { paddingVertical: vs(12), paddingHorizontal: 14 },
  optionText: { fontSize: s(15), color: "#000" },

  filterTitle: { fontSize: s(20), fontWeight: "700" },
  resetTextSmall: { color: "#2D6CDF", fontWeight: "600" },

  dateRow: { flexDirection: "row", justifyContent: "space-between", marginTop: vs(8) },
  dateBox: { width: "48%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ddd", padding: s(12), borderRadius: 12 },
  dateText: { color: "#111" },
  calIcon: { width: s(20), height: s(20) },

  selectWrapper: { position: "relative", width: "100%", marginTop: vs(8) },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: s(50),
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  selectedText: { fontSize: s(15), color: "#000", flex: 1 },
  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: vs(16) },
  quickBtn: { width: "32%", paddingVertical: vs(12), borderRadius: 12, backgroundColor: "#F5F6FA", alignItems: "center" },
  quickText: { color: "#111", fontWeight: "600" },
  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: vs(32) },
  resetBtn: { width: "48%", paddingVertical: vs(14), borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontWeight: "700" },
  applyBtn: { width: "48%", paddingVertical: vs(14), borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontWeight: "700" },
  downArrow: { width: s(18), height: s(18), tintColor: "#6F6F6F" },
  dropdownMenu: {
    position: "absolute",
    top: vs(52),
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 7,
    zIndex: 9999,
    maxHeight: 150,
    overflow: "hidden",
  },
});
