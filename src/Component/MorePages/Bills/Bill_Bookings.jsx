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
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import customParseFormat from "dayjs/plugin/customParseFormat";
import SuccessModal from "../../../ToastFile/ToastPage";

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
import Telegram from "../../../Assets/Images/telegram.png";
import Payment from "../../../Assets/Images/payment.png";
import AddIcon from "../../../Assets/Images/add-circle.png";
import DeleteIcon from "../../../Assets/Images/trash.png"
import EditIcon from "../../../Assets/Images/editIcon.png"
import TickIcon from "../../../Assets/Images/tick-circle.png"
import CommingSoon from "../../../Assets/Images/Coming_soon.png"


const BillBookings = ({ onBookingDetailsShow }) => {

  const { BillDetails, loading, GetAllBillDetails, GetInitializeRefundDetails,
    UpdateTenantRecurringStatus, receiptsList, GetReceiptsList, DeleteReceipt, getReceiptPdfDetails, bookingBills, GetAdvanceBookingBills } = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);

  console.log("advanceBills", bookingBills);

  const dotsRefs = useRef({});
  const navigation = useNavigation();

  const [stayType, setStayType] = useState("Long Stay");
  const [openDropdown, setOpenDropdown] = useState(false);
  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");

  const [deleteReceipt, setDeleteReceipt] = useState(false)
  const [showMenu, setShowMenu] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [selectedCustomer, setSelectedCustomer] = useState(null);


  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [showBillDetails, setShowBillDetails] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);


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
  const [amountDropdownVisible, setAmountDropdownVisible] = useState(false)

  const Advancebookingbills = bookingBills?.advanceInvoiceList

  dayjs.extend(customParseFormat);

  const formatApiDate = (date) =>
    date
      ? dayjs(date, "DD/MM/YYYY").format("DD MMM YYYY")
      : "--";

  const dummyData = [
    {
      transactionId: "1",
      fullName: "Ajmal Muhammed",
      initials: "AM",
      invoiceNumber: "BK-001",
      paidAt: "01/12/2025",
      amount: 1500,
    },
    {
      transactionId: "2",
      fullName: "Mahadevan",
      initials: "M",
      invoiceNumber: "BK-426",
      paidAt: "01/12/2025",
      amount: 500,
    },
    {
      transactionId: "3",
      fullName: "Jobin",
      initials: "J",
      invoiceNumber: "BK-002",
      paidAt: "01/12/2025",
      amount: 1000,
    },
    {
      transactionId: "4",
      fullName: "Daniel Balaji M",
      initials: "DB",
      invoiceNumber: "BK-426",
      paidAt: "01/12/2025",
      amount: 500,
    },
    {
      transactionId: "5",
      fullName: "Muthuraja M",
      initials: "M",
      invoiceNumber: "BK-008",
      paidAt: "01/12/2025",
      amount: 500,
    },
    {
      transactionId: "6",
      fullName: "Albert",
      initials: "A",
      invoiceNumber: "BK-005",
      paidAt: "01/06/2025",
      amount: 2250,
    },
  ];





  useEffect(() => {
    if (activeHostelId) {
      GetAdvanceBookingBills(activeHostelId);
    }
  }, [activeHostelId]);

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

  const openMenu = (item, id) => {
    const ref = dotsRefs.current[id];

    if (!ref) return;

    ref.measureInWindow((px, py, width, height) => {
      setPopupPosition({ x: px, y: py });
      setSelectedCustomer(item);
      setShowMenu(true);
    });
  };

  console.log('selected', selectedCustomer, activeHostelId,
  );


  // const handleShowReceiptPdf = async () => {
  // navigation.navigate("ReceiptPdf")
  //   const res = await getReceiptPdfDetails(
  //       activeHostelId,
  //       selectedReceipt?.transactionId
  //     );
  //     console.log("res", res);
  // }


  const handleCreateBill = () => {
    navigation.navigate("CreateReceipt", { mode: "add" })
  }

  // const handleViewReceiptDetails = (item) => {
  //       setSelectedReceipt(item);
  //       setShowBillDetails(true);
  //     }

  const handleViewBookingDetails = (item) => {
    onBookingDetailsShow(item)
  }


  const handleEditBill = () => {

    navigation.navigate("CreateReceipt", {
      mode: "edit",
      // data: item,  
    });
    setShowMenu(false);
  }


  const handleDeleteReceipt = async () => {


    const res = await DeleteReceipt({
      hostelId: activeHostelId,
      receiptId: selectedCustomer?.transactionId,
    });



    if (res.success) {

      setModalType("success");
      setModalMessage("Deleted Successfully");
      setShowSuccessModal(true);
      setDeleteReceipt(false)

      setTimeout(() => setShowSuccessModal(false), 1500);
    } else {
      setModalType("warning");
      setModalMessage(res?.message || "Something went wrong");
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 1500);
    }
  };



  const toggleSwitch = (id) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const EmptyReceiptState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={EmptyFloor}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyText}>
        No Bookings Found
      </Text>
    </View>
  );


  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => handleViewBookingDetails(item)}
      >

        <View>
          <View style={styles.avatarWrapper}>
            {item?.profilePic ? (
              <Image source={{ uri: item?.profilePic }} style={styles.avatar} />
            ) : (
              <View style={styles.initialCircle}>
                <Text style={styles.initialText}>
                  {item?.initials || item?.fullName?.slice(0, 2)?.toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.tickWrapper}>
              <Image source={TickIcon} style={styles.tickIcon} />
            </View>
          </View>
        </View>



        <View style={{ flex: 1 }}>
          {/* <TouchableOpacity  > */}
          <Text style={styles.name}>{item.fullName}</Text>
          {/* </TouchableOpacity> */}

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>


            <Image
              source={Bills_Black_Icon}
              style={{ width: 12, height: 12, marginTop: 3, marginRight: 5 }}
            />

            <Text style={styles.bill}>{item?.invoiceNumber}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>


          <Text style={{ fontWeight: "700" }}>
            ₹ {item?.invoiceAmount}
          </Text>

          <Text style={styles.dateText}>
            {item?.invoiceDate}
            {/* {formatApiDate(item?.invoiceDate)} */}
          </Text>
        </View>
      </TouchableOpacity>
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


        <FlatList
          // data={[]}
          data={Advancebookingbills}
          renderItem={renderItem}
          // keyExtractor={(item) => item.transactionId}
          keyExtractor={(item, index) =>
            item?.invoiceId
              ? item.invoiceId.toString()
              : index.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 0,
            flexGrow: 1,
            paddingBottom: 120,
          }}
          ListEmptyComponent={
            !loading && <EmptyReceiptState />
          }
        />







        {showMenu && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
            style={styles.popupOverlay}
          >
            <View
              style={[
                styles.popupBox,
                { top: popupPosition.y - 120, left: popupPosition.x - 180 },
              ]}
            >
              <TouchableOpacity style={styles.popupRow}>
                <Image source={Download} style={styles.popupIcon} />
                <Text style={styles.popupText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.popupRow} onPress={handleEditBill}>
                <Image source={EditIcon} style={styles.popupIcon} />
                <Text style={styles.popupText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.popupRow}
                onPress={() => {
                  setShowMenu(false)
                  setDeleteReceipt(true)
                }
                }

              >
                <Image source={DeleteIcon} style={styles.popupIcon} />
                <Text style={styles.popupText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}



        {/* {showBillDetails && (
          <View style={styles.sheetOverlay}>
        
            <TouchableWithoutFeedback onPress={() => setShowBillDetails(false)}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
        
            <Animated.View
              style={[
                styles.transactionSheet,
                { height: "78%", transform: [{ translateY: detailsSheetY }] }
              ]}
              {...billDetailsPan.panHandlers}
            >
              <View style={styles.sheetHandle} />
        
              
        
              <ScrollView showsVerticalScrollIndicator={false}>
        
          <View style={styles.billHeaderRow}>
            <Text style={styles.billHeaderText}>Bill Details</Text>
        
        
            <View style={{display:'flex', flexDirection:'row'}}>
            <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Paid</Text>
              </View>

        
            <TouchableOpacity>
              <Image
                source={Dots}
                style={{ width: 28, height: 28,  }}
              />
            </TouchableOpacity>
            </View>
          </View>
        
          <View style={styles.userRow}>
            <Image source={ProfileImage} style={styles.userImg} />
        
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.userName}>  {selectedReceipt?.fullName || "--"}</Text>
        
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <View style={styles.invTypeBadge}>
                  <Text style={styles.invTypeText}>Checkout Inv</Text>
                </View>
         
                <Image source={Bills_Black_Icon} style={{   width: 12,
            height: 12, marginTop:5 , marginRight:5
          }} />
                <Text style={styles.billNumber}>#1212121212</Text>
              </View>
            </View>
          </View>

        
        
          <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.label}>Payment date</Text>
              <View style={styles.rowAlign}>
                <Image source={CalendarBlueIcon} style={styles.iconSmall} />
                <Text style={styles.value}>  {formatApiDate(selectedReceipt?.paidAt)}</Text>
              </View>
            </View>
        
            <View style={styles.colItem}>
              <Text style={styles.label}>Payment Mode</Text>
              <View style={styles.rowAlign}>
                <Image source={Payment} style={styles.iconSmall} />
                <Text style={styles.value}> {selectedReceipt?.invoiceMode || "--"}</Text>
              </View>
            </View>
          </View>

           <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.label}>Payment to</Text>
              <View style={styles.rowAlign}>
                    <Image source={Payment} style={{   width: 18,
            height: 18, marginTop:5 , marginRight:5
          }} />
                <Text style={styles.amountValue}>  {selectedReceipt?.bankName || "--"}</Text>
              </View>
            </View>
             </View>
        
          <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.rowAlign}>
                    <Image source={MoneyCheckIcon} style={{   width: 18,
            height: 18, marginTop:5 , marginRight:5
          }} />
                <Text style={styles.amountValue}> ₹{selectedReceipt?.paidAmount ?? "--"}</Text>
              </View>
            </View>
             <View style={styles.colItem}>
              <Text style={styles.label}>Transaction Id</Text>
              <View style={styles.rowAlign}>
                    <Image source={Telegram} style={{   width: 18,
            height: 18, marginTop:2 , marginRight:5
          }} />
                <Text style={styles.amountValue}>{selectedReceipt?.transactionNumber || "--"}</Text>
              </View>
            </View>
        
          
          </View>
        
          <TouchableOpacity style={styles.previewBtn} onPress={handleShowReceiptPdf} >
            <View style={{display:'flex', flexDirection:'row'}}>
                       <Image source={PreviewIcon} style={{   width: 18,
            height: 18, marginTop:3 , marginRight:12
          }} />
            <Text style={styles.previewText}>Preview</Text>
            </View>
          </TouchableOpacity>
        
        </ScrollView>
        
        
            </Animated.View>
          </View>
        )} */}


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

              <Text style={[styles.label, { marginTop: 18 }]}>Type</Text>

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

        {deleteReceipt && (
          <Modal
            transparent
            animationType="fade"
            visible={deleteReceipt}
            onRequestClose={() => setDeleteReceipt(false)}
          >
            <View style={styles.deleteOverlay}>
              <View style={styles.deleteBox}>

                <Text style={styles.deleteTitle}>Delete Receipt?</Text>
                <Text style={styles.deleteSub}>
                  Are you sure you want to delete this Receipt?
                </Text>

                <View style={styles.deleteBtnRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setDeleteReceipt(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteReceipt()}
                  >
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>
        )}

      </View>
    </>
  );
};

export default BillBookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    position: "relative",
    zIndex: 1,
  },


  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: 10,
    marginBottom: 10,
    zIndex: 1000,
  },

  monthText: { fontSize: 16, fontWeight: "600" },

  dropButton: {
    borderWidth: 1,
    borderColor: "#C9C9C9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  dropButtonText: {
    fontSize: 14,
    color: "#000",
    marginRight: 6,
  },

  arrow: {
    fontSize: 12,
    color: "#444",
  },

  dropCard: {
    position: "absolute",
    top: 40,
    right: 0,
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 10,
    zIndex: 9999,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
  },


  optionRow: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  optionText: {
    fontSize: 14,
    color: "#000",
  },


  row: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginRight: 6,
  },

  name: { fontSize: 16, fontWeight: "700", color: "#000" },

  tagBox: {
    backgroundColor: "#FFE69C",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },

  tag: { fontSize: 12, fontWeight: "600", color: "#976600" },

  bill: { fontSize: 10, color: "#777" },

  labelOn: { fontSize: 12, color: "#3562FF", marginBottom: 2, marginRight: 5 },

  switch: {
    width: 42,
    height: 24,
    borderRadius: 20,
    padding: 3,
    justifyContent: "center",
  },

  knob: {
    width: 18,
    height: 18,
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  date: {
    marginTop: 4,
    fontSize: 11,
    color: "#878787",
  },


  filterButton: {
    position: "absolute",
    bottom: 124,
    right: 50,
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
  billHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },

  billHeaderText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  statusBadge: {
    backgroundColor: "#D7FFD7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: "black",
    fontWeight: "700",
    fontSize: 13,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 12,
  },

  tickWrapper: {
    position: "absolute",
    top: -2,
    right: -1,
    backgroundColor: "#fff",   // white border effect
    borderRadius: 10,
    padding: 1,
  },

  tickIcon: {
    width: 16,
    height: 16,
  },


  userImg: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },

  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
  },

  invTypeBadge: {
    backgroundColor: "#FFE6C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },

  invTypeText: {
    color: "#C67506",
    fontWeight: "600",
    fontSize: 12,
  },

  billNumber: {
    color: "#555",
    fontSize: 13,
    alignSelf: "center",
  },

  twoColRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  colItem: {
    width: "48%",
  },

  label: {
    color: "#777",
    fontSize: 14,
    marginBottom: 5,
  },

  rowAlign: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconSmall: {
    width: 18,
    height: 18,
    marginRight: 6,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  amountValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },

  dueValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "red",
  },

  previewBtn: {
    backgroundColor: "#1E45E1",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 39,
    alignItems: "center",
  },

  previewText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  filterHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

  filterTitle: { fontSize: 20, fontWeight: "700" },
  resetTextSmall: { color: "#2D6CDF", fontWeight: "600" },

  dateRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  dateBox: { width: "48%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 12 },
  dateText: { color: "#111" },
  calIcon: { width: 20, height: 20 },

  selectWrapper: { position: "relative", width: "100%", marginTop: 8 },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 50,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  selectedText: { fontSize: 15, color: "#000", flex: 1 },
  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  quickBtn: { width: "32%", paddingVertical: 12, borderRadius: 12, backgroundColor: "#F5F6FA", alignItems: "center" },
  quickText: { color: "#111", fontWeight: "600" },
  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 72 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontWeight: "700" },
  applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontWeight: "700" },
  downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },
  dropdownMenu: {
    position: "absolute",
    top: 52,
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

  rightSection: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 3,
  },
  dots: {
    fontSize: 22,
    color: "#6B7280",
  },

  addBtn: {
    position: "absolute",
    bottom: 60,
    right: 45,
    backgroundColor: "#1D5DFF",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  popupOverlay: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },

  popupBox: {
    position: "absolute",
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 20,
    paddingVertical: 10,
    zIndex: 10000,
  },

  popupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  popupIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  popupText: {
    fontSize: 14,
    color: "#333",
  },



  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteBox: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    elevation: 10,
  },

  deleteTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },

  deleteSub: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
  },

  deleteBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2D6CDF",
    marginRight: 10,
    alignItems: "center",
  },

  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D6CDF",
  },

  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#2D6CDF",
    alignItems: "center",
  },

  deleteBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5
  },

  initialText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",  // dark grey
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyImage: {
    width: 250,
    height: 180,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#777",
  },


});
