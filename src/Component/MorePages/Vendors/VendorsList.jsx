import React, { useState, useRef, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Platform,
  Modal, PanResponder, Animated, TouchableWithoutFeedback, Dimensions, ScrollView, BackHandler
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { CommonContexts } from "../../../Context/CommonContext";
// import { VendorContext } from "../../../Context/VendorContext";
import { CustomerContext } from "../../../Context/CustomerContext";
import Loader from "../../../Component/Loader/Loader"
import SuccessModal from "../../../ToastFile/ToastPage";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import SearchIcon from "../../../Assets/Images/Asset_search.png";
import AvatarPlaceholder from "../../../Assets/Images/Avatar.png";
import DotsIcon from "../../../Assets/Images/3dots.png";
import FilterIcon from "../../../Assets/Images/filter.png";
import AddIcon from "../../../Assets/Images/TenantAddBlue.png";
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import AddVendorSheet from "./AddVendor";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import DownArrow from "../../../Assets/Images/direction-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import { useHasPermission } from "../../../Utils/useHasPermission";
import EmailPic from "../../../Assets/Images/gmail.png"
import CallIcon from "../../../Assets/Images/call.png"
import LocationPic from "../../../Assets/Images/location.png"



export default function VendorsList({ navigation }) {

  // const {
  //   vendorList,
  //   loading,
  //   getVendorList,
  //   addVendor,
  //   updateVendor,
  //   deleteVendor,
  // } = useContext(VendorContext);

  const { vendorList, loading, getVendorList, deleteVendor , getVendorDetails  , vendorDetails} = useContext(CustomerContext);;
  const {
    vendorCategories,
    getVendorCategories,
  } = useContext(VendorContext);
  const { activeHostelId } = useContext(CommonContexts)

  const {
    canReadModule: canReadVendor,
    canWriteModule: canWriteVendor,
    canUpdateModule,
    canDeleteModule,
  } = useHasPermission("Vendor")

  console.log("vendorList", vendorList);



  const [showAddVendor, setShowAddVendor] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editVendor, setEditVendor] = useState(null);
  const [deleteVendordata, setDeleteVendorData] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false)
  const [showFilter, setShowFilter] = useState(false);

  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [amountDropdownVisible, setAmountDropdownVisible] = useState(false);
  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");
  const toggleAmountDropdown = () => {
    setAmountDropdownVisible((v) => !v);
  };


  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  useFocusEffect(
    useCallback(() => {
      if (activeHostelId) {
        getVendorList(activeHostelId);
      }
    }, [activeHostelId])
  );

   useEffect(() => {
      if(activeHostelId){
    getVendorCategories(activeHostelId);
      }
    }, [activeHostelId]);



  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showFilter) {
          setShowFilter(false)
          return true;
        }

        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }

        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [navigation, showFilter])
  );
  const amountOptions = [
    "Low to High (Lowest First)",
    "High to Low (Highest First)",
    "Newest First",
    "Oldest First",
  ];
  const [amountSelected, setAmountSelected] = useState(amountOptions[0]);
  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          Animated.timing(translateY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setShowFilter(false);
            translateY.setValue(0);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleEdit = (vendor) => {
    if (!canUpdateModule) return;
    setEditVendor(vendor);
    setShowAddVendor(true);
    setActiveMenu(null)
  }

  const handleDelete = async () => {
    if (!canDeleteModule) {
      setModalType("warning");
      setModalMessage("You do not have permission to delete vendor");
      setShowSuccessModal(true);
      return;
    }
    const res = await deleteVendor(deleteVendordata?.id, activeHostelId)
    setDeletePopup(false)
    if (res?.success) {
      setModalType("success");
      setModalMessage(res.message);
      setShowSuccessModal(true);

      setTimeout(() => {
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


  const getVendorInitials = (firstName = "", lastName = "") => {
    const f = firstName?.trim();
    const l = lastName?.trim();

    if (f && l) {
      return (
        f.charAt(0).toUpperCase() +
        l.charAt(0).toUpperCase()
      );
    }

    if (f) {
      return f.charAt(0).toUpperCase();
    }

    if (l) {
      return l.charAt(0).toUpperCase();
    }

    return "";
  };


  const handleAddVendorClick = () => {
    if (!activeHostelId) {
      setModalType("warning");
      setModalMessage("Please add a hostel first");
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 1500);
      return;
    }

      if (vendorCategories?.length === 0 ) {
    setModalType("warning");
    setModalMessage("Please add a Vendor Category option in Settings");
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 1500);
    return;
  }

    setShowAddVendor(true);
  };


  const renderVendor = ({ item }) => {
    const fullName =
      `${item.firstName || ""} ${item.lastName || ""}`.trim();

    const address = [
      item.area,
      item.city,
      item.landMark,
      item.state,
      item.country,
      item.pinCode,
    ]
      .filter(Boolean)
      .join(", ");

    return (
      <>



        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.leftRow}>
              {item.profilePic && item.profilePic.trim() !== "" ? (
                <Image
                  source={{ uri: item.profilePic }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.initialCircle}>
                  <Text style={styles.initialText}>
                    {getVendorInitials(item.firstName, item.lastName)}
                  </Text>
                </View>
              )}


              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.vendorName}>
                  {fullName || "--"}
                </Text>

                {item.businessName ? (
                  <View style={styles.companyBadge}>
                    <Text style={styles.companyText}>
                      {item.businessName}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <TouchableOpacity
              style={styles.dotsTouchable}
              onPress={() =>
                setActiveMenu(
                  activeMenu === item.id ? null : item.id
                )
              }
            >
              <Image source={DotsIcon} style={styles.dotsIcon} />
            </TouchableOpacity>
          </View>

          <View style={{borderWidth:0.4,borderColor:'#E7E7E7',marginTop:15,marginHorizontal:5}}/>

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Mail ID</Text>
              <View style={{ flexDirection: 'row', marginTop: 6}}>
                <Image source={EmailPic} style={{ width: 16, height: 16 }} />
                <Text style={[styles.infoValue, { marginLeft: 5 }]}>
                  {item.emailId || "N/A"}
                </Text>
              </View>

            </View>

            <View style={[styles.infoCol, {alignItems:'flex-end'  }]}>
              <View style={{alignItems:'flex-start'}}>
              <Text style={styles.infoLabel}>Contact</Text>
              <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                <Image source={CallIcon} style={{ width: 16, height: 16 }} />
                <Text style={[styles.infoValue, { marginLeft: 5 }]}>
                  +{item.countryCode} {item.mobile || "--"}
                </Text>

              </View>
              </View>

            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: 10 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Address</Text>
              <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                <Image source={LocationPic} style={{ width: 16, height: 16 }} />
                <Text
                  style={[styles.infoValue, { marginLeft: 5 }]}
                  numberOfLines={2}
                >
                  {address || "N?A"}
                </Text>
              </View>

            </View>
          </View>
        </View>

        {activeMenu === item.id && (
          <>
            <TouchableWithoutFeedback onPress={() => setActiveMenu(null)}>
              <View style={styles.menuOverlay} />
            </TouchableWithoutFeedback>

            <View style={styles.menuBox}>
              <TouchableOpacity
                style={[
                  styles.menuRow,
                  !canUpdateModule && { opacity: 0.4 }
                ]}
                disabled={!canUpdateModule}
                onPress={() => handleEdit(item)}
              >
                <Image
                  source={require("../../../Assets/Images/editIcon.png")}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.menuRow,
                  !canDeleteModule && { opacity: 0.4 }
                ]}
                onPress={() => {
                  setDeleteVendorData(item);
                  setDeletePopup(true);
                  setActiveMenu(null);
                }}
                disabled={!canDeleteModule}
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

      </>
    );
  };


  if (!canReadVendor && !loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack?.()}>
            <Image source={BackIcon} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vendors</Text>
        </View>
        <View style={styles.emptyContainer}>

          <Image source={EmptyState} style={styles.emptyImage} />
          <Text style={styles.emptyText}>
            You do not have access to view Vendors
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      {loading && <Loader />}

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType} />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack?.()}>
            <Image source={BackIcon} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vendors</Text>
        </View>



        {!loading && vendorList?.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={EmptyState}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>
              No vendors are there!
            </Text>

            <TouchableOpacity style={[
              styles.addVendorBtn,
              !canWriteVendor && { opacity: 0.7 }
            ]}
              disabled={!canWriteVendor} onPress={handleAddVendorClick}>
              <Text style={styles.addVendorText}>+ Add Vendor</Text>
            </TouchableOpacity>
          </View>
        ) : (

          <>
            {!loading && vendorList?.length > 0 &&
              <View style={styles.searchWrapper}>
                <Image source={SearchIcon} style={styles.searchIcon} />
                <TextInput
                  placeholder="Search"
                  placeholderTextColor="#9CA3AF"
                  // style={styles.searchInput}
                  style={[
                    styles.searchInput,
                    !canReadVendor && { opacity: 0.5 }
                  ]}
                  editable={canReadVendor}
                />
              </View>
            }


            <FlatList
              data={vendorList}
              keyExtractor={(item) => item?.id.toString()}
              renderItem={renderVendor}
              contentContainerStyle={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                paddingBottom:200,
              }}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              showsVerticalScrollIndicator={false}
            />



          </>
        )}


        {!loading && vendorList?.length > 0 && (
          <>
            {/* <TouchableOpacity style={[
              styles.filterFab,
              !canReadVendor && { opacity: 0.4 }
            ]}
              disabled={!canReadVendor} onPress={() => setShowFilter(true)}>
              <Image source={FilterIcon} style={styles.filterIcon} />
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[
                styles.addFab,
                !canWriteVendor && { opacity: 0.7 }
              ]}
              disabled={!canWriteVendor}
              onPress={() => setShowAddVendor(true)}
            >
              <Image source={AddIcon} style={styles.addIcon} />
            </TouchableOpacity>
          </>
        )}


      </View>
      {showFilter && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[styles.filterSheet, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.filterHeaderRow} >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={FilterIcon} style={{ width: 30, height: 30 }} />
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

            <Text style={[styles.label, { marginTop: 18 }]}>Amount</Text>

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



      {openFrom && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenFrom(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
              date={fromDate}
              onChange={(p) => {
                setFromDate(p.date || dayjs());
                setOpenFrom(false);
              }}
            />
          </View>
        </View>
      )}


      {openTo && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenTo(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
              date={toDate}
              onChange={(p) => {
                setToDate(p.date || dayjs());
                setOpenTo(false);
              }}
            />
          </View>
        </View>
      )}

      {showAddVendor && (
        <AddVendorSheet
          onClose={() => {
            setShowAddVendor(false);
            setEditVendor(null);
          }}
          vendorData={editVendor}
        />
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


    </>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingTop: Platform.OS === "ios" ? 50 : 60, },

  header: {
    // paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backArrow: { width: 22, height: 22 },
  headerTitle: { fontSize: 18, fontFamily: "Gilroy-Bold", color: "#111" },

  searchWrapper: {
    margin: 16,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { width: 18, height: 18, tintColor: "#9CA3AF" },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 14, color: "#111" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  leftRow: { flexDirection: "row", alignItems: "center", flex: 1 },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  initialCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  initialText: {
    fontSize: 16,
   fontFamily: "Gilroy-Bold",
    color: "#4B5563",
  },


  vendorName: { fontSize: 16, fontFamily: "Gilroy-Bold", color: "#111" },
  companyBadge: {
    marginTop: 6,
    backgroundColor: "#FFF6E6",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  companyText: { color: "#A47E00", fontSize: 12, fontFamily: "Gilroy-Semibold"},

  dotsTouchable: { padding: 6, marginLeft: 8 },
  dotsIcon: { width: 25, height: 25, },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  infoCol: { flex: 1 },
  infoLabel: { color: "#9CA3AF", fontSize: 12, },
  infoValue: { color: "#111", fontSize: 14, },

  filterFab: {
    position: "absolute",
    bottom: 120,
    right: 25,
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },


  filterIcon: { width: 30, height: 30 },

  addFab: {
    position: "absolute",
    right: 20,
    bottom: 60,
    width: 56,
    height: 56,
    borderRadius: 28,

    justifyContent: "center",
    alignItems: "center",

  },
  addIcon: { width: 60, height: 60, },
  menuBox: {
    position: "absolute",
    top: 45,
    right: 45,
    backgroundColor: "#fff",
    padding: 12,
    width: 150,
    borderRadius: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: "#F0F0F0",
    zIndex: 999,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  menuIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  menuText: {
    fontSize: 14,
  fontFamily: "Gilroy-Semibold",
    color: "#000",
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



  selectedText: { fontSize: 15, color: "#000", flex: 1 },
  datePickerBox: { width: "90%", backgroundColor: "#fff", padding: 12, borderRadius: 15, alignSelf: "center", marginBottom: 30 },
  filterSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: "100%",
    minHeight: "42%",
    maxHeight: "75%",
    elevation: 30,
  },
  sheetHandle: {
    width: 60,
    height: 5,
    backgroundColor: "#D7D7D7",
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 14,
    marginTop: 6
  },
  filterHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14
  },

  filterTitle: {
    fontSize: 20,
   fontFamily: "Gilroy-Bold",
    marginLeft: 10
  },

  resetTextSmall: { color: "#2D6CDF", fontFamily: "Gilroy-Semibold" },
  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  quickBtn: { width: "32%", paddingVertical: 12, borderRadius: 12, backgroundColor: "#F5F6FA", alignItems: "center" },
  quickText: { color: "#111", fontFamily: "Gilroy-Semibold" },
  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 52, marginBottom: 20 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontFamily: "Gilroy-Bold" }, applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff",fontFamily: "Gilroy-Bold"},

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
  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    zIndex: 9999
  },

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
  downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },
  dateRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  dateBox: { width: "48%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 12 },


  dateText: { color: "#111" },
  calIcon: { width: 20, height: 20 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },
  addVendorBtn: {
    marginTop: 20,
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },

  addVendorText: {
    color: "#fff",
    fontSize: 15,
  fontFamily: "Gilroy-Semibold"
  },


});
