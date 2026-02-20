import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  BackHandler,
  TouchableWithoutFeedback
} from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import PhoneIcon from "../../../Assets/Images/call.png";
import MenuDots from "../../../Assets/Images/3dots.png";
import UserIcon from "../../../Assets/Images/profile.png";
import FilterIcon from "../../../Assets/Images/filter.png";
import PlusIcon from "../../../Assets/Images/add-circle.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import { useCustomer } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import Loader from "../../Loader/Loader";


import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function WalkinScreen({ setShowTabBar, handleWalkinFilter, navigation, searchText }) {
  const { getCustomersByHostel, deleteCustomer, loading } = useCustomer();
  const { activeHostelId } = useContext(CommonContexts);

  const {
    canWriteModule: canWriteWalkin,
    canReadModule: canReadWalkin,
    // canUpdateModule: canUpdateWalkin,
    canDeleteModule: canDeleteWalkin,
  } = useHasPermission("Walk in");

  const {
    canWriteModule: canWriteTenant,
    canReadModule: canReadTenant,
    canUpdateModule: canUpdateTenant,
    canDeleteModule: canDeleteTenant,
  } = useHasPermission("Customers");

  const [walkinCustomers, setWalkinCustomers] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTenants, setDeleteTenants] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState("")
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const DeleteMenu = () => {
    setDeleteTenants(true)
    setMenuVisible(false)
  }
  const CloseDelete = () => {
    setDeleteTenants(false)
  }
  const handleDeleteCustomer = async () => {
    if (!deleteUserId) return;

    const res = await deleteCustomer(activeHostelId, deleteUserId);

    if (res.success) {
      setModalType("success");
      setMessage("Deleted Successful");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setDeleteTenants(false);
        setMenuVisible(false);
      }, 800);

      fetchWalkinCustomers(); // refresh
    } else {
      alert(res.message);
    }
  };


  const dotsRef = useRef(null);

  const openMenu = (event, item) => {
    const { pageX, pageY } = event.nativeEvent;

    // SAME ITEM → toggle
    if (menuVisible && selectedItem?.customerId === item.customerId) {
      setMenuVisible(false);
      return;
    }
    setDeleteUserId(item.customerId)
    // DIFFERENT ITEM → move menu
    setMenuPosition({
      x: pageX - 190,
      y: pageY - 140,
    });

    setSelectedItem(item);
    setMenuVisible(true);
  };

  // const openMenu = (event, item) => {
  //   const { pageX, pageY } = event.nativeEvent;

  //   setMenuPosition({
  //     x: pageX - 190,   
  //     y: pageY + -140,   
  //   });

  //   setSelectedItem(item);
  //   setMenuVisible(true);
  // };

  const handleShowTennantCheckin = () => {
    // navigation.navigate("TenantCheckin")
    navigation.navigate("TenantCheckin", {
      customerId: selectedItem.customerId,
      customer: selectedItem, // full details (optional)
    });

    setMenuVisible(false)
  }
  const handleShowAddBooking = () => {
    // navigation.navigate("AddBooking")
    navigation.navigate("AddBooking", {
      selectedItem: selectedItem,
    });

    setMenuVisible(false)
  }

  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");
  useLayoutEffect(() => {
    setShowTabBar(!showFilter);
  }, [showFilter]);


  const filteredWalkins = walkinCustomers.filter((item) => {
    const search = searchText.trim().toLowerCase();
    return (
      item?.fullName?.toLowerCase().includes(search) ||
      item?.mobile?.toString().includes(search)
    );
  });
  useFocusEffect(
    useCallback(() => {
      fetchWalkinCustomers();
    }, [activeHostelId])
  );

  const fetchWalkinCustomers = async () => {
    const data = await getCustomersByHostel(
      activeHostelId,
      "",
      "Inactive"
    );
    setWalkinCustomers(data?.listCustomers || []);
  };

  console.log("setWalkinCustomers", walkinCustomers)

  useLayoutEffect(() => {
    const backAction = () => {
      if (showFilter) {
        setShowFilter(false);
        setShowStatusDropdown(false)
        return true;
      }
      return false;
    };

    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => handler.remove();
  }, [showFilter]);

  const handleAddTenant = () => {
    if (!activeHostelId) {
      setModalType("warning");
      setMessage("Please add a hostel first");
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 2000);
      return;
    }

    navigation.navigate("AddTenant", {
      refreshWalkins: walkinCustomers,
    });
  };


  if (!canReadWalkin && !loading) {
    return (
      <View style={styles.container}>

        <View style={{ alignItems: "center", marginTop: 180 }}>

          <Image source={EmptyState} style={{ width: 250, height: 180, }} />
          <Text style={{ marginTop: 12, fontSize: 16, color: "#888" }}>
            You do not have access to view Walkin
          </Text>
        </View>
      </View>
    )
  }


  return (
    <>
      {loading && <Loader />}
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <View style={styles.container}>
        {
          walkinCustomers?.length > 0 &&
          <Text style={styles.monthHeading}>This Month</Text>
        }

        {!loading && walkinCustomers.length === 0 &&
          <View style={styles.emptyContainer}>
            <Image source={EmptyState} style={styles.emptyImage} />
            <Text style={styles.emptyText}>
              Add new tenants to start tracking{"\n"}
              bookings and check-ins.
            </Text>

            <TouchableOpacity
              style={[styles.addBtnAdd, !canWriteWalkin && { opacity: 0.4 }]}
              disabled={!canWriteWalkin}
              onPress={handleAddTenant}>
              <Text style={styles.addBtnText}>
                + Add Tenant
              </Text>
            </TouchableOpacity>
          </View>
        }


        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >

{console.log("boys",filteredWalkins)}

          {filteredWalkins.map((item) => (
            <View key={item.customerId} style={styles.row}>
              {/* <View style={styles.avatarBox}>
                <Image source={UserIcon} style={styles.avatar} />
              </View> */}
              <View style={styles.avatarBox}>
                {item?.profilePic ? (
                  <Image
                    source={{ uri: item.profilePic }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.initialCircle}>
                    <Text style={styles.initialText}>
                      {item?.initials || item?.fullName?.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>


              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.fullName}</Text>

                <View style={styles.phoneRow}>
                  <Image source={PhoneIcon} style={styles.phoneIcon} />
                  <Text style={styles.phoneText}>+ {item.countryCode} {item.mobile}</Text>
                </View>
              </View>

              <View style={styles.right}>
                <TouchableOpacity onPress={(e) => openMenu(e, item)}>
                  <Image source={MenuDots} style={styles.dotIcon} />
                </TouchableOpacity>

                <Text style={styles.date}>{item.bookedAt}</Text>
              </View>
            </View>
          ))}


        </ScrollView>

        {menuVisible && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.menuOverlay}
            onPressOut={() => setMenuVisible(false)}
          >
            <View
              style={[
                styles.menuBox,
                {
                  top: menuPosition.y,
                  left: menuPosition.x,
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.menuRow, !canWriteWalkin && { opacity: 0.4 }]}
                disabled={!canWriteWalkin}
                onPress={handleShowTennantCheckin}>
                <Image source={CalendarIcon} style={styles.menuIcon} />
                <Text style={styles.menuText}>Check-In</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={[styles.menuRow, !canWriteWalkin && { opacity: 0.4 }]}
                disabled={!canWriteWalkin}
                onPress={handleShowAddBooking}>
                <Image source={CalendarIcon} style={styles.menuIcon} />
                <Text style={styles.menuText}>Add booking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuRow, !canDeleteWalkin && { opacity: 0.4 }]}
                disabled={!canDeleteWalkin}
                onPress={DeleteMenu}>
                <Image source={require("../../../Assets/Images/trash.png")} style={styles.menuIcon} />
                <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {walkinCustomers?.length > 0 &&
          <>
            <TouchableOpacity
              style={[styles.filterBtn, !canReadWalkin && { opacity: 0.4 }]}
              disabled={!canReadWalkin}
              onPress={handleWalkinFilter}>
              <Image source={FilterIcon} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>


            <TouchableOpacity
              style={[styles.addBtn, !canWriteTenant && { opacity: 0.4 }]}
              disabled={!canWriteTenant}
              onPress={() =>
                navigation.navigate("AddTenant", {
                  refreshWalkins: walkinCustomers,
                })
              }>
              <Image source={PlusIcon} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          </>
        }


        {showFilter && (
          <TouchableOpacity
            style={styles.filterOverlay}
            activeOpacity={1}
            onPress={() => {
              setShowFilter(false);
              setShowStatusDropdown(false);
            }}

          >
            <TouchableWithoutFeedback>
              <View style={styles.filterSheet}>
                <View style={styles.filterHandle} />


                <View style={styles.filterHeader}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={FilterIcon}
                      style={{ width: 35, height: 35, marginRight: 8 }}
                    />
                    <Text style={styles.filterTitle}>Filter by</Text>
                  </View>
                </View>


                <Text style={styles.label}>Status</Text>

                <Text style={styles.label}>Status</Text>

                <View style={{ position: "relative" }}>

                  <TouchableOpacity
                    style={styles.dropdownBox}
                    onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <Text style={styles.dropdownText}>{status}</Text>
                    <Text style={styles.arrow}>⌄</Text>
                  </TouchableOpacity>

                  {showStatusDropdown && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView nestedScrollEnabled={true}>
                        {["All", "Active", "In-Active", "Checked Out", "Notice"].map((v) => (
                          <TouchableOpacity
                            key={v}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setStatus(v);
                              setShowStatusDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>{v}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                </View>





                <View style={styles.dateRow}>


                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>From</Text>

                    <TouchableOpacity
                      style={styles.dateBox}
                      onPress={() => setOpenFrom(true)}
                    >
                      <Text>{formatDate(fromDate)}</Text>
                      <Image
                        source={require("../../../Assets/Images/calendar.png")}
                        style={styles.calIcon}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{ width: 15 }} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>To</Text>

                    <TouchableOpacity
                      style={styles.dateBox}
                      onPress={() => setOpenTo(true)}
                    >
                      <Text>{formatDate(toDate)}</Text>
                      <Image
                        source={require("../../../Assets/Images/calendar.png")}
                        style={styles.calIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>


                <View style={styles.quickRow}>
                  <TouchableOpacity style={styles.quickBtn}>
                    <Text style={styles.quickText}>Today</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickBtn}>
                    <Text style={styles.quickText}>This Week</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.quickBtn}>
                    <Text style={styles.quickText}>This Month</Text>
                  </TouchableOpacity>
                </View>


                <View style={styles.bottomButtons}>
                  <TouchableOpacity style={styles.resetBtn}>
                    <Text style={styles.resetText}>Reset All</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.applyBtn}>
                    <Text style={styles.applyText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        )}
        {/* FROM DATE PICKER */}
        <Modal transparent visible={openFrom} animationType="fade">
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
                    date={fromDate}
                    onChange={(d) => {
                      setFromDate(d.date);
                      setOpenFrom(false);
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>

        {/* TO DATE PICKER */}
        <Modal transparent visible={openTo} animationType="fade">
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
                    date={toDate}
                    onChange={(d) => {
                      setToDate(d.date);
                      setOpenTo(false);
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>
        <Modal
          transparent
          animationType="fade"
          visible={deleteTenants}
          onRequestClose={() => setDeleteTenants(false)}
        >
          <View style={styles.deleteOverlay}>
            <View style={styles.deleteBox}>

              <Text style={styles.deleteTitle}>Delete Customer?</Text>
              <Text style={styles.deleteSub}>
                Are you sure you want to delete this Customer?
              </Text>

              <View style={styles.deleteBtnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setDeleteTenants(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={handleDeleteCustomer}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>

      </View>
    </>
  );
}



const styles = StyleSheet.create({
  filterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#111",
  },
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
  }

  ,

  datePickerBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
  },

  outsideTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  filterSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  filterHandle: {
    width: 60,
    height: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 50,
    marginBottom: 20,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,
  },


  monthHeading: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 8,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatar: { width: 28, height: 28, },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  phoneIcon: { width: 16, height: 16 },

  phoneText: {
    marginLeft: 6,
    color: "#6B7280",
    fontSize: 13,
  },

  right: { alignItems: "flex-end" },

  dotIcon: { width: 26, height: 26, transform: [{ rotate: "90deg" }] },

  date: { fontSize: 11, color: "#6B7280", marginTop: 4 },

  filterBtn: {
    position: "absolute",
    bottom: 60,
    right: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },

  addBtn: {
    position: "absolute",
    bottom: 0,
    right: 20,
    backgroundColor: "#00A32E",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },


  plus: { fontSize: 30, color: "#fff", marginTop: -3 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  filterCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  handle: {
    width: 60,
    height: 5,
    borderRadius: 50,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 18,
  },

  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  filterSmallIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
    tintColor: "#2563EB",
  },

  filterTitle: { fontSize: 18, fontWeight: "700" },

  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    color: "#444",
  },

  dropdownBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


  dropdownText: { fontSize: 15, color: "#111" },

  arrow: { fontSize: 18, color: "#111" },

  dateRow: { flexDirection: "row", marginTop: 10 },

  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: "#fff",
  },

  calIcon: { width: 18, height: 18 },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  quickBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  quickText: { fontSize: 14, color: "#111" },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  resetBtn: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    paddingVertical: 14,
    alignItems: "center",
  },

  resetText: { color: "#2563EB", fontSize: 15, fontWeight: "600" },

  applyBtn: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    alignItems: "center",
  },

  applyText: { color: "#fff", fontSize: 15, fontWeight: "600" },



  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },

  menuBox: {
    position: "absolute",
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 6,
    elevation: 15,
  },


  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60


  },

  emptyImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    opacity: 0.8
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  addBtnAdd: {
    backgroundColor: "#1E45E1",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,    // 🔥 reduced
  },

  addBtnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },

  initialCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  initialText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },


});
