// Assets.jsx
import React, { useLayoutEffect, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  BackHandler,
  TouchableWithoutFeedback,
  Platform,
  Dimensions 
} from "react-native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

import BackIcon from "../../../Assets/Images/Arrow_left.png";
import MenuDots from "../../../Assets/Images/3dots.png";
import AddIcon from "../../../Assets/Images/TenantAddBlue.png";
import AssetIcon from "../../../Assets/Images/Asset.png";
import SearchIcon from "../../../Assets/Images/Asset_search.png";
import ButtonTag from "../../../Assets/Images/tag.png";
import FilterIcon from "../../../Assets/Images/EditPin.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import EditIcon from "../../../Assets/Images/editIcon.png";
import TrashIcon from "../../../Assets/Images/trash.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";

export default function Assets({ navigation }) {
  // sheet + filter state
  const [showSheet, setShowSheet] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [showFilter, setShowFilter] = useState(false);

  // date picker state
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);


  // amount dropdown inside filter
  const amountOptions = [
    "Low to High (Lowest First)",
    "High to Low (Highest First)",
    "Newest First",
    "Oldest First",
  ];
  const [amountSelected, setAmountSelected] = useState(amountOptions[0]);
  const [amountDropdownVisible, setAmountDropdownVisible] = useState(false);

  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");

  // sample data
  const dummyData = [
    { name: "Refrigerator", model: "6987165476", brand: "Whirlpool", price: "₹16,500" },
    { name: "Refrigerator", model: "6987165476", brand: "Whirlpool", price: "₹16,500" },
    { name: "Ceiling Fan", model: "SB-989543", brand: "Crompton", price: "₹2,500" },
    { name: "Mattresses", model: "SB-989543", brand: "CURL ON", price: "₹7,500" },
  ];

  // hide tab bar while inside this screen (if using bottom tabs)
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          paddingVertical: 12,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "#fff",
          elevation: 8,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
      });
    };
  }, [navigation]);

  // hardware back handling — closes open overlays before letting system handle back
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
      if (showSheet) {
        setShowSheet(false);
        return true;
      }
      return false; // allow default behavior
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [showSheet, showFilter, openFrom, openTo, amountDropdownVisible]);

  // helper to open details sheet
  const openDetails = (asset) => {
    setSelectedAsset(asset);
    setShowSheet(true);
  };

  // toggle amount dropdown
  const toggleAmountDropdown = () => {
    setAmountDropdownVisible((v) => !v);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Assets</Text>

        <View style={{ width: 30 }} />
      </View>

    
      <View style={styles.searchBox}>
        <Image source={SearchIcon} style={styles.searchIcon} />
        <TextInput
          placeholder="Search Assets"
          placeholderTextColor="#8a8a8a"
          style={styles.searchInput}
        />
      </View>

     
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {dummyData.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.iconCircle}>
              <Image source={AssetIcon} style={styles.assetIcon} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.assetTitle}>{item.name}</Text>
              <Text style={styles.assetSub}>
                {item.model}{"  •  "}{item.brand}{"  •  "}{item.price}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => openDetails(item)}
              accessibilityLabel={`Open ${item.name} details`}
            >
              <Image source={MenuDots} style={styles.dotsIcon} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>


      <TouchableOpacity style={styles.Filterfab} onPress={() => setShowFilter(true)} accessibilityLabel="Open filters">
        <Image source={FilterIcon} style={styles.fabIcon} />
      </TouchableOpacity>

      {/* Add FAB */}
      <TouchableOpacity style={styles.fab} accessibilityLabel="Add asset">
        <Image source={AddIcon} style={styles.fabIcon} />
      </TouchableOpacity>

      {/* ========== Details Bottom Sheet ========== */}
      {showSheet && (
        <View style={styles.sheetOverlay}>
          {/* outside touch — close */}
          <TouchableWithoutFeedback onPress={() => setShowSheet(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetTitle}>{selectedAsset?.name}</Text>

              <View style={styles.topActions}>
                <TouchableOpacity onPress={() => { /* handle edit */ }}>
                  <Image source={EditIcon} style={styles.headerIcon} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { /* handle delete */ }}>
                  <Image source={TrashIcon} style={[styles.headerIcon, { marginLeft: 12 }]} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.twoColRow}>
              <View style={styles.colLeft}>
                <Text style={styles.label}>Serial No:</Text>
                <Text style={styles.value}>{selectedAsset?.model}</Text>
              </View>

              <View style={styles.colRight}>
                <Text style={styles.label}>Brand Name</Text>
                <Text style={styles.value}>{selectedAsset?.brand}</Text>
              </View>
            </View>

            <View style={styles.twoColRow}>
              <View style={styles.colLeft}>
                <Text style={styles.label}>Product Name</Text>
                <Text style={styles.value}>Fridge</Text>
              </View>

              <View style={styles.colRight}>
                <Text style={styles.label}>Purchase Date</Text>
                <Text style={styles.value}>16-05-2025</Text>
              </View>
            </View>

            <View style={styles.twoColRow}>
              <View style={styles.colLeft}>
                <Text style={styles.label}>Vendor Name</Text>
                <Text style={styles.value}>Ram Kumar</Text>
              </View>

              <View style={styles.colRight}>
                <Text style={styles.label}>Price</Text>
                <Text style={styles.value}>{selectedAsset?.price}.00</Text>
              </View>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={styles.label}>Mode of Payment</Text>
              <Text style={styles.value}>CASH</Text>
            </View>

            <TouchableOpacity style={styles.assignBtn} onPress={() => { /* handle assign */ }}>
              <Image source={ButtonTag} style={styles.assignIcon} />
              <Text style={styles.assignText}>Assign Asset</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

  
      {showFilter && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.filterSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.filterHeaderRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={FilterIcon} style={{ width: 50, height: 50 }} />
                <Text style={styles.filterTitle}>  Filter by</Text>
              </View>

            
            </View>
            
            <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.label}>Date Range</Text>
              <TouchableOpacity onPress={() => {
                setFromDate(dayjs());
                setToDate(dayjs());
                setAmountSelected(amountOptions[0]);
              }}>
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

              <TouchableOpacity style={styles.selectBox} onPress={toggleAmountDropdown} activeOpacity={0.9}>
                <Text style={styles.selectedText}>{amountSelected}</Text>
                <Image source={DownArrow} style={styles.downArrow} />
              </TouchableOpacity>

              {amountDropdownVisible && (
              <View style={[
  styles.dropdownMenu,
  openUpward ? { bottom: 58, top: 'auto' } : { top: 58 }
]}>
                  <ScrollView
                    style={{ maxHeight: 160 }}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                  >
                    {amountOptions.map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={styles.option}
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
              <TouchableOpacity style={styles.resetBtn} onPress={() => {
                setFromDate(dayjs()); setToDate(dayjs()); setAmountSelected(amountOptions[0]);
              }}>
                <Text style={styles.resetBtnText}>Reset All</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyBtn} onPress={() => {
                // apply filters (emit event or call API)
                setShowFilter(false);
              }}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* FROM date picker modal-like */}
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

      {/* TO date picker */}
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingTop: Platform.OS === "ios" ? 50 : 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  backIcon: { width: 22, height: 22 },
  pageTitle: { fontSize: 20, fontWeight: "700", color: "#000" },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 14, padding: 12, marginBottom: 20 },
  searchIcon: { width: 20, height: 20, tintColor: "#9E9E9E" },
  searchInput: { flex: 1, marginLeft: 10 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 14, marginBottom: 12 },
  iconCircle: { width: 46, height: 46, backgroundColor: "#EEF4FF", borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 14 },
  assetIcon: { width: 26, height: 26, tintColor: "#3F6AFF" },
  assetTitle: { fontSize: 16, fontWeight: "700" },
  assetSub: { fontSize: 13, color: "#696969", marginTop: 2 },
  dotsIcon: { width: 18, height: 18, tintColor: "#999" },

  fab: { position: "absolute", bottom: 25, right: 25, width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  Filterfab: { position: "absolute", bottom: 100, right: 25, width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  fabIcon: { width: 60, height: 60 },

  sheetOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  sheetHandle: { width: 60, height: 4, backgroundColor: "#D1D5DB", alignSelf: "center", borderRadius: 20, marginBottom: 15 },

  sheetTitle: { fontSize: 20, fontWeight: "700", color: "#000" },

  topActions: { flexDirection: "row", alignItems: "center" },
  headerIcon: { width: 20, height: 20, marginLeft: 12 },

  divider: { height: 1, backgroundColor: "#E8E8E8", marginVertical: 12 },

  twoColRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  colLeft: { width: "48%" },
  colRight: { width: "48%" },

  label: { fontSize: 13, color: "#7A7A7A", marginBottom: 6 },
  value: { fontSize: 15, fontWeight: "600", color: "#000" },

  assignBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#1E45E1", paddingVertical: 14, borderRadius: 12, marginTop: 20 },
  assignIcon: { width: 18, height: 18, tintColor: "#fff", marginRight: 8 },
  assignText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // filter sheet
filterSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  height: "55%",             // ⭐ increase height here
},  filterHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
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
  height: 50,   // 🔥 consistent height
  paddingHorizontal: 12,
  borderRadius: 12,
},
  selectedText: { fontSize: 15, color: "#000", flex: 1 },
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
  zIndex:1000,
  paddingVertical: 8,
  height:100
},

  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  quickBtn: { width: "32%", paddingVertical: 12, borderRadius: 12, backgroundColor: "#F5F6FA", alignItems: "center" },
  quickText: { color: "#111", fontWeight: "600" },

  bottomButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 72 },
  resetBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1E45E1", alignItems: "center" },
  resetBtnText: { color: "#1E45E1", fontWeight: "700" },
  applyBtn: { width: "48%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#1E45E1", alignItems: "center" },
  applyBtnText: { color: "#fff", fontWeight: "700" },

  datePickerBox: { width: "90%", backgroundColor: "#fff", padding: 12, borderRadius: 15, alignSelf: "center", marginBottom: 30 },
});
