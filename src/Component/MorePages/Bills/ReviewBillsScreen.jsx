import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  useWindowDimensions, Image
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import Ionicons from "react-native-vector-icons/Ionicons";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import BillGenerateIcon from "../../../Assets/Images/BillGenerateIcon.png";
import GenerateBillsSheet from "./GenerateBillsDetails";

const ReviewBillsScreen = ({
  navigation,
  route,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmallDevice = width < 360;

  const [showGenerateSheet, setShowGenerateSheet] = useState(false);

  /*
   * You can replace this with API data.
   */
  const [invoices, setInvoices] = useState([
    {
      id: "1",
      name: "Arun Kumar",
      initials: "AK",
      room: "G2 / B-204",
      type: "Rent",
      period: "Sep 2026",
      amount: 8000,
      status: "READY",
      selected: true,
      edited: false,
    },
    {
      id: "2",
      name: "Rahul Sharma",
      initials: "RS",
      room: "G1 / B-102",
      type: "Rent",
      period: "Sep 2026",
      amount: 6667,
      status: "READY",
      selected: true,
      edited: true,
    },
    {
      id: "3",
      name: "Karthik R",
      initials: "KR",
      room: "G3 / B-301",
      type: "Rent",
      period: "Sep 2026",
      amount: 8000,
      status: "READY",
      selected: true,
      edited: false,
    },
    {
      id: "4",
      name: "Suresh Babu",
      initials: "SB",
      room: "G1 / B-103",
      type: "Rent",
      period: "Sep 2026",
      amount: 7500,
      status: "READY",
      selected: true,
      edited: false,
    },
    {
      id: "5",
      name: "Priya Menon",
      initials: "PM",
      room: "G4 / B-401",
      type: "Rent",
      period: "Sep 2026",
      amount: 7500,
      status: "NEEDS_REVIEW",
      selected: false,
      edited: false,
    },
    {
      id: "6",
      name: "Vijay Anand",
      initials: "VA",
      room: "G2 / B-206",
      type: "Rent",
      period: "Sep 2026",
      amount: 7500,
      status: "READY",
      selected: true,
      edited: false,
    },
    {
      id: "7",
      name: "Vijay Anand",
      initials: "VA",
      room: "G2 / B-206",
      type: "Rent",
      period: "Sep 2026",
      amount: 7500,
      status: "READY",
      selected: true,
      edited: false,
    },
    {
      id: "8",
      name: "Anitha Rajan",
      initials: "AR",
      room: "G4 / B-402",
      type: "Rent",
      period: "Sep 2026",
      amount: 7500,
      status: "GENERATED",
      selected: false,
      edited: false,
    },
  ]);

  /*
   * Ready invoices
   */
  const readyInvoices = useMemo(() => {
    return invoices.filter(
      (item) => item.status === "READY"
    );
  }, [invoices]);

  /*
   * Selected + Ready invoices
   */
  const selectedReadyInvoices = useMemo(() => {
    return invoices.filter(
      (item) =>
        item.status === "READY" &&
        item.selected
    );
  }, [invoices]);

  const readyCount = readyInvoices.length;

  /*
   * Select all READY invoices
   */
  const allEligibleSelected =
    readyInvoices.length > 0 &&
    readyInvoices.every((item) => item.selected);

  const toggleInvoice = (id) => {
    setInvoices((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        /*
         * Don't allow selection for
         * Needs Review / Generated
         */
        if (
          item.status !== "READY"
        ) {
          return item;
        }

        return {
          ...item,
          selected: !item.selected,
        };
      })
    );
  };

  const toggleSelectAll = () => {
    setInvoices((prev) =>
      prev.map((item) => {
        if (item.status !== "READY") {
          return item;
        }

        return {
          ...item,
          selected: !allEligibleSelected,
        };
      })
    );
  };

  const handleGenerateAll = () => {
    // if (selectedReadyInvoices?.length === 0) {
    //   return;
    // }

    console.log(
      "Generate invoices:",
      selectedReadyInvoices
    );

    setShowGenerateSheet(true);
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  const renderCheckbox = ({
    checked,
    disabled = false,
    onPress,
  }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          disabled && styles.checkboxDisabled,
        ]}
      >
        {checked && (
          <Text style={styles.checkboxTick}>
            ✓
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  //   const renderCheckbox = ({
  //     checked,
  //     disabled = false,
  //     onPress,
  //   }) => {
  //     return (
  //       <TouchableOpacity
  //         activeOpacity={0.8}
  //         disabled={disabled}
  //         onPress={onPress}
  //         style={[
  //           styles.checkbox,
  //           checked && styles.checkboxChecked,
  //           disabled && styles.checkboxDisabled,
  //         ]}
  //       >
  //         {checked && (
  //           <Ionicons
  //             name="checkmark"
  //             size={14}
  //             color="#FFFFFF"
  //           />
  //         )}
  //       </TouchableOpacity>
  //     );
  //   };

  const renderStatus = (status) => {
    if (status === "READY") {
      return (
        <View
          style={[
            styles.statusBadge,
            styles.readyBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              styles.readyText,
            ]}
          >
            READY
          </Text>
        </View>
      );
    }

    if (status === "NEEDS_REVIEW") {
      return (
        <View
          style={[
            styles.statusBadge,
            styles.reviewBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              styles.reviewText,
            ]}
          >
            Needs review
          </Text>
        </View>
      );
    }

    if (status === "GENERATED") {
      return (
        <View
          style={[
            styles.statusBadge,
            styles.generatedBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              styles.generatedText,
            ]}
          >
            GENERATED
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderInvoice = ({ item, index }) => {
    const isReady = item.status === "READY";
    const isGenerated =
      item.status === "GENERATED";

    return (
      <View
        style={[
          styles.invoiceRow,
          index === 0 && styles.firstInvoiceRow,
        ]}
      >
        {/* Checkbox */}
        <View style={styles.checkboxContainer}>
          {renderCheckbox({
            checked: item.selected,
            disabled: !isReady,
            onPress: () =>
              toggleInvoice(item.id),
          })}
        </View>

        {/* Initial Circle */}
        <View style={styles.initialCircle}>
          <Text style={styles.initialText}>
            {item.initials}
          </Text>
        </View>

        {/* Tenant Information */}
        <View style={styles.tenantInfo}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.tenantName,
                isSmallDevice &&
                styles.tenantNameSmall,
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>

            {item.edited && (
              <View style={styles.editedBadge}>
                <Text style={styles.editedText}>
                  EDITED
                </Text>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.tenantDetails,
              isSmallDevice &&
              styles.tenantDetailsSmall,
            ]}
            numberOfLines={1}
          >
            {item.room} · {item.type} ·{" "}
            {item.period}
          </Text>
        </View>

        {/* Amount + Status */}
        <View style={styles.amountSection}>
          <Text
            style={[
              styles.amountText,
              isSmallDevice &&
              styles.amountTextSmall,
            ]}
          >
            ₹{formatAmount(item.amount)}
          </Text>

          {renderStatus(item.status)}
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <View style={styles.container}>
          {/* ================= HEADER ================= */}

          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation?.goBack?.()
              }
              style={styles.backButton}
            >
              {/* <Ionicons
              name="chevron-back"
              size={24}
              color="#1D2638"
            /> */}

              <Image source={ArrowLeft} style={{ height: 12, width: 12 }} />
            </TouchableOpacity>

            <Text
              style={[
                styles.headerTitle,
                isSmallDevice &&
                styles.headerTitleSmall,
              ]}
            >
              Review & Generate Bills
            </Text>
          </View>

          {/* ================= DESCRIPTION ================= */}

          <View style={styles.descriptionContainer}>
            <Text
              style={[
                styles.description,
                isSmallDevice &&
                styles.descriptionSmall,
              ]}
            >
              Review calculated invoices before generating
              them for tenants.
            </Text>
          </View>

          {/* ================= PERIOD ================= */}

          <View style={styles.periodRow}>
            <View style={styles.periodItem}>
              <Text style={styles.periodLabel}>
                Period:
              </Text>

              <Text style={styles.periodValue}>
                01 Sep – 30 Sep 2026
              </Text>
            </View>

            <View style={styles.generationItem}>
              <Text style={styles.periodLabel}>
                Gen. Date:
              </Text>

              <Text style={styles.periodValue}>
                01 Sep 2026
              </Text>
            </View>
          </View>

          {/* ================= SELECT ALL ================= */}

          <View style={styles.selectAllContainer}>
            <View style={styles.selectAllLeft}>
              {renderCheckbox({
              checked: allEligibleSelected,
              disabled:
                readyInvoices.length === 0,
              onPress: toggleSelectAll,
            })}

              <Text style={styles.selectAllText}>
                Select All Eligible
              </Text>
            </View>

            <Text style={styles.readyCountText}>
              {String(readyCount).padStart(2, "0")} of{" "}
              {String(invoices.length).padStart(2, "0")} ready
            </Text>
          </View>

          {/* ================= INVOICE LIST ================= */}

          <FlatList
            data={invoices}
            keyExtractor={(item) => item.id}
            renderItem={renderInvoice}
            showsVerticalScrollIndicator={false}
            bounces={true}
            contentContainerStyle={[
              styles.listContent,
              {
                paddingBottom:
                  90 + insets.bottom,
              },
            ]}
            ItemSeparatorComponent={() => (
              <View style={styles.separator} />
            )}
          />

          {/* ================= BOTTOM ACTION ================= */}

          <View
            style={[
              styles.bottomBar,
              {
                paddingBottom:
                  Math.max(insets.bottom, 10),
              },
            ]}
          >
            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomCountText}>
                {String(
                  selectedReadyInvoices.length
                ).padStart(2, "0")}{" "}
                invoices are
              </Text>

              <Text style={styles.bottomSubText}>
                ready to generate
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={
                selectedReadyInvoices.length === 0
              }
              onPress={handleGenerateAll}
              style={[
                styles.generateButton,
                selectedReadyInvoices.length ===
                0 &&
                styles.generateButtonDisabled,
              ]}
            >
              {/* <Ionicons
              name="sync-outline"
              size={18}
              color="#FFFFFF"
            /> */}

              <Image source={BillGenerateIcon} style={{ height: 12, width: 12 }} />

              <Text style={styles.generateButtonText}>
                Generate All Eligible
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <GenerateBillsSheet
        visible={showGenerateSheet}
        onClose={() => {
          setShowGenerateSheet(false);
        }}
        invoices={selectedReadyInvoices}
        onGenerate={(payload) => {
          console.log(
            "FINAL GENERATE PAYLOAD:",
            payload
          );

          setShowGenerateSheet(false);

          // API call இங்கே:
          // generateInvoices(payload);
        }}
      />
    </>
  );
};

export default ReviewBillsScreen;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* ================= HEADER ================= */

  header: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F3",
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#F5F7FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },

  headerTitle: {
    flex: 1,
    fontSize: 21,
    color: "#111827",
    fontFamily: "Gilroy-Bold",
    marginLeft: 2,
  },

  headerTitleSmall: {
    fontSize: 18,
  },

  /* ================= DESCRIPTION ================= */

  descriptionContainer: {
    paddingHorizontal: 30,
    paddingTop: 2,
    paddingBottom: 12,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#7B8495",
    fontFamily: "Gilroy-Regular",
  },

  descriptionSmall: {
    fontSize: 13,
    lineHeight: 19,
  },

  /* ================= PERIOD ================= */

  periodRow: {
    flexDirection: "row",
    // alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 13,
  },

  periodItem: {
    flex: 1,
    flexDirection: "row",
    // alignItems: "center",
  },

  generationItem: {
    flex: 1,
    flexDirection: "row",
    // alignItems: "center",
    marginLeft: 12,
  },

  periodLabel: {
    fontSize: 12,
    color: "#30343B",
    fontFamily: "Gilroy-Medium",
  },

  periodValue: {
    flexShrink: 1,
    fontSize: 11,
    color: "#7B8495",
    fontFamily: "Gilroy-Regular",
    marginLeft: 4,
  },

  /* ================= SELECT ALL ================= */

  selectAllContainer: {
    minHeight: 48,
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 43,
  },

  selectAllLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  selectAllText: {
    fontSize: 13,
    color: "#555B65",
    fontFamily: "Gilroy-Medium",
    marginLeft: 8,
  },

  readyCountText: {
    fontSize: 13,
    color: "#7D8491",
    fontFamily: "Gilroy-Regular",
    marginLeft: 8,
  },

  /* ================= CHECKBOX ================= */

  // checkboxContainer: {
  //   width: 31,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },

  // checkbox: {
  //   width: 18,
  //   height: 18,
  //   borderRadius: 4,
  //   borderWidth: 1,
  //   borderColor: "#CBD1DB",
  //   backgroundColor: "#FFFFFF",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },

  // checkboxChecked: {
  //   backgroundColor: "#1835A5",
  //   borderColor: "#1835A5",
  // },

  // checkboxDisabled: {
  //   opacity: 0.45,
  // },

  /* ================= LIST ================= */

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 0,
  },

  invoiceRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },

  firstInvoiceRow: {
    paddingTop: 14,
  },

  separator: {
    height: 1,
    backgroundColor: "#F0F1F4",
    marginLeft: 0,
  },

  /* ================= INITIAL ================= */

  initialCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#152AA0",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 9,
  },

  initialText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "Gilroy-Medium",
  },

  /* ================= TENANT ================= */

  tenantInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  tenantName: {
    flexShrink: 1,
    fontSize: 16,
    color: "#172033",
    fontFamily: "Gilroy-Medium",
  },

  tenantNameSmall: {
    fontSize: 14,
  },

  tenantDetails: {
    marginTop: 3,
    fontSize: 12,
    color: "#7B8495",
    fontFamily: "Gilroy-Regular",
  },

  tenantDetailsSmall: {
    fontSize: 10.5,
  },

  /* ================= EDITED ================= */

  editedBadge: {
    borderWidth: 1,
    borderColor: "#FF7043",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
  },

  editedText: {
    fontSize: 8,
    color: "#FF7043",
    fontFamily: "Gilroy-Medium",
  },

  /* ================= AMOUNT ================= */

  amountSection: {
    width: 82,
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 6,
  },

  amountText: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Gilroy-Bold",
  },

  amountTextSmall: {
    fontSize: 14,
  },

  /* ================= STATUS ================= */

  statusBadge: {
    marginTop: 5,
    minWidth: 52,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  readyBadge: {
    backgroundColor: "#008C4A",
  },

  reviewBadge: {
    backgroundColor: "#F36B21",
    minWidth: 85,
  },

  generatedBadge: {
    backgroundColor: "#3185E8",
  },

  statusText: {
    fontSize: 8,
    fontFamily: "Gilroy-Medium",
  },

  readyText: {
    color: "#FFFFFF",
  },

  reviewText: {
    color: "#FFFFFF",
  },

  generatedText: {
    color: "#FFFFFF",
  },

  /* ================= BOTTOM BAR ================= */

  bottomBar: {
    minHeight: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8E9EC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 9,

    /*
     * Android shadow
     */
    elevation: 8,

    /*
     * iOS shadow
     */
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity:
      Platform.OS === "ios" ? 0.08 : 0,
    shadowRadius: 5,
  },

  bottomTextContainer: {
    flex: 1,
    justifyContent: "center",
  },

  bottomCountText: {
    fontSize: 16,
    color: "#5D626C",
    fontFamily: "Gilroy-Regular",
  },

  bottomSubText: {
    fontSize: 16,
    color: "#5D626C",
    fontFamily: "Gilroy-Regular",
    marginTop: 1,
  },

  generateButton: {
    minHeight: 41,
    paddingHorizontal: 15,
    borderRadius: 9,
    backgroundColor: "#2149E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  generateButtonDisabled: {
    opacity: 0.45,
  },

  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Gilroy-Medium",
    marginLeft: 7,
  },
  checkboxContainer: {
  width: 30,
  alignItems: "center",
  justifyContent: "center",
},

checkbox: {
  width: 28,
  height: 28,
  borderRadius: 7,
  borderWidth: 2,
  borderColor: "#D4D8E0",
  backgroundColor: "#FFFFFF",
  alignItems: "center",
  justifyContent: "center",
},

checkboxChecked: {
  backgroundColor: "#2864E8",
  borderColor: "#2864E8",
},

checkboxTick: {
  color: "#FFFFFF",
  fontSize: 18,
  lineHeight: 24,
  fontFamily: "Gilroy-Bold",
},

checkboxDisabled: {
  opacity: 0.45,
},
});