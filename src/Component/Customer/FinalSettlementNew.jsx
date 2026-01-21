import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  Image,
  SafeAreaView,
} from "react-native";
import Delete from "../../Assets/Images/remove.png";
import dayjs from "dayjs";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import { useCustomer } from "../../Context/CustomerContext";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";

export default function FinalSettlementScreen({ navigation, route }) {
  const { selectedItem, selectedBed } = route.params || {};

  const [openUnpaid, setOpenUnpaid] = useState(true);
  const [openRefundRent, setOpenRefundRent] = useState(false);
  const [openEBill, setOpenEBill] = useState(true);

  const [extraCharges, setExtraCharges] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [settlementDetails, setSettlementDetails] = useState("");

  const [actualCheckoutDate, setActualCheckoutDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );

  const TYPE_OPTIONS = ["Maintenance", "Others"];
  const { getSettlementByCustomerId } = useCustomer();

  const maintenanceAlreadyUsed = extraCharges.some(
    (c) => c.type === "Maintenance" && c.isDefault === false
  );

  // ✅ ARROW ANIMATION (3 Accordions)
  const unpaidRotate = useRef(new Animated.Value(openUnpaid ? 1 : 0)).current;
  const rentRotate = useRef(new Animated.Value(openRefundRent ? 1 : 0)).current;
  const ebRotate = useRef(new Animated.Value(openEBill ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(unpaidRotate, {
      toValue: openUnpaid ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [openUnpaid]);

  useEffect(() => {
    Animated.timing(rentRotate, {
      toValue: openRefundRent ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [openRefundRent]);

  useEffect(() => {
    Animated.timing(ebRotate, {
      toValue: openEBill ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [openEBill]);

  const unpaidArrow = unpaidRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const rentArrow = rentRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const ebArrow = ebRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // ✅ API CALL (Same as your code)
  useEffect(() => {
    if (!selectedItem && !selectedBed) return;

    const fetchSettlement = async () => {
      const customerId =
        selectedItem?.customerId || selectedBed?.currentTenantInfo?.[0]?.tenetId;

      const leavingDate = actualCheckoutDate || dayjs().format("DD-MM-YYYY");

      const res = await getSettlementByCustomerId(customerId, leavingDate);

      if (res.success) {
        setSettlementDetails(res.data);
      } else {
        alert(res.message || "Failed to load settlement");
      }
    };

    fetchSettlement();
  }, [selectedItem, selectedBed, actualCheckoutDate]);

  // ✅ Map default deductions
  useEffect(() => {
    if (!settlementDetails?.customerInfo?.listDeductions?.length) return;

    const mappedCharges = settlementDetails.customerInfo.listDeductions.map(
      (item) => {
        const isMaintenance = item.type?.toLowerCase() === "maintenance";

        return {
          id: Date.now() + Math.random(),
          type: isMaintenance ? "Maintenance" : "Others",
          title: isMaintenance ? "" : item.type,
          amount: String(item.amount),
          isDefault: true,
        };
      }
    );

    setExtraCharges(mappedCharges);
  }, [settlementDetails]);

  // ✅ Add Non Refund charge
  const addCharge = () => {
    setExtraCharges((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "",
        title: "",
        amount: "",
        isDefault: false,
      },
    ]);
  };

  const updateTitle = (id, title) => {
    setExtraCharges((prev) =>
      prev.map((i) => (i.id === id ? { ...i, title, titleError: "" } : i))
    );
  };

  const updateAmount = (id, amount) => {
    const onlyNum = amount.replace(/[^0-9]/g, "");
    setExtraCharges((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, amount: onlyNum, amountError: "" } : i
      )
    );
  };

  const removeCharge = (id) => {
    setExtraCharges((prev) => prev.filter((i) => i.id !== id));
  };

  const selectType = (id, type) => {
    const maintenanceExists = extraCharges.some(
      (c) => c.type === "Maintenance" && c.isDefault === false
    );

    if (type === "Maintenance" && maintenanceExists) return;

    setExtraCharges((prev) =>
      prev.map((i) => (i.id === id ? { ...i, type, title: "", amount: "" } : i))
    );

    setOpenDropdownId(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ✅ HEADER */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Final Settlement</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        {/* ✅ TOP CUSTOMER CARD */}
        <View style={styles.customerCard}>
          <Text style={styles.customerName}>Rajesh Kumar</Text>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.smallLabel}>Joined Date</Text>
              <Text style={styles.value}>22/10/2024</Text>
            </View>
            <View>
              <Text style={styles.smallLabel}>Req Checkout Date</Text>
              <Text style={styles.value}>24/08/2025</Text>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.smallLabel}>Advance Amount</Text>
              <Text style={styles.value}>₹ 8,000</Text>
            </View>
            <View>
              <Text style={styles.smallLabel}>Monthly Rent</Text>
              <Text style={styles.value}>₹ 4,000</Text>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.smallLabel}>Booking Amount</Text>
              <Text style={styles.value}>₹ 500</Text>
            </View>
            <View>
              <Text style={styles.smallLabel}>Advance paid</Text>
              <Text style={styles.value}>₹ 6,000</Text>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.smallLabel}>Actual Checkout Date</Text>
              <Text style={styles.value}>30/11/2025</Text>
            </View>
            <View>
              <Text style={styles.smallLabel}>Status</Text>
              <Text style={styles.refundText}>Refund</Text>
            </View>
          </View>
        </View>

        {/* ✅ UNPAID INVOICES (INLINE ACCORDION) */}
        <View style={styles.accordionCard}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setOpenUnpaid(!openUnpaid)}
            activeOpacity={0.8}
          >
            <Animated.Image
              source={DownArrow}
              style={[styles.arrowImg, { transform: [{ rotate: unpaidArrow }] }]}
            />
            <Text style={styles.cardTitle}>Unpaid Invoices</Text>
            <Text style={styles.amountText}>₹ 1,200</Text>
          </TouchableOpacity>

          {openUnpaid && (
            <View style={styles.accordionBody}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 1 }]}>INVOICE.NO</Text>
                <Text style={[styles.th, { flex: 1 }]}>TYPE</Text>
                <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>
                  INVOICE AMOUNT
                </Text>
              </View>

              <View style={styles.invoiceRow}>
                <Text style={[styles.invText, { flex: 1, color: "#1D4ED8" }]}>
                  INV001
                </Text>
                <Text style={[styles.invText, { flex: 1 }]}>Manual</Text>
                <Text style={[styles.invText, { flex: 1, textAlign: "right" }]}>
                  ₹ 500.00
                </Text>
              </View>

              <View style={styles.invoiceRow}>
                <Text style={[styles.invText, { flex: 1, color: "#1D4ED8" }]}>
                  INV654
                </Text>
                <Text style={[styles.invText, { flex: 1 }]}>Manual</Text>
                <Text style={[styles.invText, { flex: 1, textAlign: "right" }]}>
                  ₹ 700.00
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ✅ REFUNDABLE RENT (INLINE ACCORDION) */}
        <View style={styles.accordionCard}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setOpenRefundRent(!openRefundRent)}
            activeOpacity={0.8}
          >
            <Animated.Image
              source={DownArrow}
              style={[styles.arrowImg, { transform: [{ rotate: rentArrow }] }]}
            />
            <Text style={styles.cardTitle}>Refundable Rent</Text>
            <Text style={styles.amountText}>₹ 3,200</Text>
          </TouchableOpacity>

          {openRefundRent && (
            <View style={styles.accordionBody}>
              <Text style={styles.sectionLabel}>Rent Details</Text>
              <Text style={styles.descText}>
                Refundable rent amount calculated.
              </Text>
            </View>
          )}
        </View>

        {/* ✅ ELECTRICITY BILL (INLINE ACCORDION) */}
        <View style={styles.accordionCard}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setOpenEBill(!openEBill)}
            activeOpacity={0.8}
          >
            <Animated.Image
              source={DownArrow}
              style={[styles.arrowImg, { transform: [{ rotate: ebArrow }] }]}
            />
            <Text style={styles.cardTitle}>Electricity Bill</Text>
            <Text style={styles.amountText}>₹ 300</Text>
          </TouchableOpacity>

          {openEBill && (
            <View style={styles.accordionBody}>
              <Text style={styles.sectionLabel}>Missed Electricity</Text>

              <View style={styles.ebRow}>
                <Text style={styles.ebLeft}>Ground Floor | G005 - B03</Text>
                <Text style={styles.ebRight}>₹ 170</Text>
              </View>

              <View style={styles.ebRow}>
                <Text style={styles.ebLeft}>First Floor | F002 - B01</Text>
                <Text style={styles.ebRight}>₹ 130</Text>
              </View>

              <Text style={[styles.sectionLabel, { marginTop: 12 }]}>
                Pending invoices
              </Text>

              <View style={styles.pendingRow}>
                <Text style={{ flex: 1 }}>First Floor | F002 - B01</Text>
                <Text style={styles.addText}>+ Add</Text>
              </View>
            </View>
          )}
        </View>

        {/* ✅ NON REFUNDABLE AMOUNT */}
        <View style={styles.nonRefund}>
          <View style={styles.extraHeader}>
            <Text style={styles.label}>Non Refundable Amount</Text>

            <TouchableOpacity style={styles.addBtn} onPress={addCharge}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Add</Text>
            </TouchableOpacity>
          </View>

          {extraCharges.map((item) => (
            <View key={item.id} style={styles.figmaRowWrapper}>
              {!item.isDefault && (
                <TouchableOpacity
                  onPress={() => removeCharge(item.id)}
                  style={styles.figmaCloseBtn}
                >
                  <Image source={Delete} style={styles.figmaCloseText} />
                </TouchableOpacity>
              )}

              <View style={styles.figmaRow}>
                {item.type === "" ? (
                  <TouchableOpacity
                    disabled={item.isDefault}
                    style={[
                      styles.figmaLeftBox,
                      item.isDefault && { opacity: 0.6 },
                    ]}
                    onPress={() =>
                      setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                    }
                  >
                    <Text style={{ color: "#777" }}>Select...</Text>
                    <Image source={DownArrow} style={styles.smallArrow} />
                  </TouchableOpacity>
                ) : item.type === "Others" ? (
                  <TextInput
                    style={styles.figmaLeftBox}
                    placeholder="Enter reason"
                    value={item.title}
                    onChangeText={(t) => updateTitle(item.id, t)}
                  />
                ) : (
                  <View
                    style={[
                      styles.figmaLeftBox,
                      { backgroundColor: "#EFEFEF" },
                    ]}
                  >
                    <Text>Maintenance</Text>
                  </View>
                )}

                {item.type === "" ? (
                  <View style={[styles.figmaRightBox, { opacity: 0.4 }]}>
                    <Text style={{ color: "#999" }}>Enter amount</Text>
                  </View>
                ) : (
                  <TextInput
                    editable={!item.isDefault}
                    style={[
                      styles.figmaRightBox,
                      item.isDefault && { backgroundColor: "#F1F1F1" },
                    ]}
                    value={item.amount}
                    placeholder="Enter Amount"
                    keyboardType="numeric"
                    onChangeText={(t) => updateAmount(item.id, t)}
                  />
                )}
              </View>

              {item.titleError && (
                <ErrorMessage message={item.titleError} type="error" />
              )}

              {item.amountError && (
                <ErrorMessage message={item.amountError} type="error" />
              )}

              {openDropdownId === item.id && item.type === "" && (
                <View style={styles.nonRefundDropdown}>
                  {TYPE_OPTIONS.map((t) => {
                    const disabled = t === "Maintenance" && maintenanceAlreadyUsed;

                    return (
                      <TouchableOpacity
                        key={t}
                        disabled={disabled}
                        onPress={() => !disabled && selectType(item.id, t)}
                        style={{ opacity: disabled ? 0.3 : 1 }}
                      >
                        <Text style={styles.dropdownItem}>{t}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* ✅ TOTAL REFUND */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Refund Payable</Text>
          <Text style={styles.totalValue}>₹ 6,300</Text>
        </View>
      </ScrollView>

      {/* ✅ FIXED BOTTOM BUTTONS */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelTxt}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.generateBtn}>
          <Text style={styles.generateTxt}>Generate Bill</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },

  backIcon: { width: 18, height: 18, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "700" },

  customerCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 16,
  },

  customerName: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  smallLabel: { fontSize: 12, color: "#6B7280" },
  value: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  refundText: { fontSize: 14, fontWeight: "700", color: "green", marginTop: 4 },

  accordionCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginHorizontal: 16,
  },

  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    justifyContent: "space-between",
  },

  arrowImg: { width: 18, height: 18, tintColor: "#111", marginRight: 10 },

  cardTitle: { flex: 1, fontSize: 14, fontWeight: "700" },
  amountText: { fontSize: 14, fontWeight: "700" },

  accordionBody: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 14,
  },

  tableHeader: { flexDirection: "row", marginBottom: 10 },
  th: { fontSize: 12, fontWeight: "700", color: "#6B7280" },
  invoiceRow: { flexDirection: "row", paddingVertical: 10 },
  invText: { fontSize: 13, color: "#111" },

  sectionLabel: { fontSize: 13, fontWeight: "700", marginBottom: 8 },
  descText: { fontSize: 13, color: "#6B7280" },

  ebRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  ebLeft: { flex: 1, fontSize: 13 },
  ebRight: { fontSize: 13, fontWeight: "700" },

  pendingRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  addText: { color: "#1D4ED8", fontWeight: "700" },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginHorizontal: 16,
  },

  totalLabel: { fontSize: 13, color: "#6B7280" },
  totalValue: { fontSize: 18, fontWeight: "800" },

  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: "row",
    gap: 12,
  },

  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  cancelTxt: { fontSize: 15, fontWeight: "600" },

  generateBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#1D4ED8",
  },

  generateTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },

  // ✅ NON REFUND
  nonRefund: {
    backgroundColor: "#F7F9FF",
    padding: 10,
    marginTop: 10,
    borderRadius: 20,
    marginHorizontal: 16,
  },

  extraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  label: { fontWeight: "700" },

  addBtn: {
    backgroundColor: "#2D6CDF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },

  figmaRowWrapper: {
    marginTop: 20,
    position: "relative",
  },

  figmaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  figmaLeftBox: {
    width: "48%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  figmaRightBox: {
    width: "45%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    justifyContent: "center",
    marginRight: 20,
  },

  figmaCloseBtn: {
    position: "absolute",
    right: 5,
    top: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E1E1E1",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  figmaCloseText: {
    width: 10,
    height: 10,
  },

  smallArrow: { width: 18, height: 18, tintColor: "#444" },

  dropdownItem: {
    padding: 12,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  nonRefundDropdown: {
    position: "absolute",
    top: 55,
    left: 0,
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 12,
    zIndex: 20,
    elevation: 10,
  },
});
