import React, {
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  useWindowDimensions, Image, Pressable
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
// import Ionicons from "react-native-vector-icons/Ionicons";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import BillGenerateIcon from "../../../Assets/Images/BillGenerateIcon.png";
import GenerateBillsSheet from "./GenerateBillsDetails";
import SuccessModal from "../../../ToastFile/ToastPage";

const ReviewBillsScreen = ({
  navigation,
  route,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmallDevice = width < 360;

  const [showGenerateSheet, setShowGenerateSheet] = useState(false);
  const {
    loading,
    GetRecurringInvoicesForReview,
    GenerateAllRecurringInvoices,
    availablerecurringInvoices,
  } = useContext(BillContext);
  const { activeHostelId } = useContext(CommonContexts);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const invoices = useMemo(() => {
    return availablerecurringInvoices?.invoicesList || [];
  }, [availablerecurringInvoices]);


  const currentSelectedInvoice = useMemo(() => {
    if (!selectedInvoice?.invoiceId) return null;

    return invoices.find(
      (invoice) =>
        Number(invoice?.invoiceId) ===
        Number(selectedInvoice?.invoiceId)
    ) || null;
  }, [invoices, selectedInvoice]);


  const formatReviewDate = (date, includeYear = false) => {
    if (!date) return "--";

    const [day, month, year] = date.split("/");

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthName = months[Number(month) - 1];

    if (!monthName) return "--";

    return includeYear
      ? `${day} ${monthName} ${year}`
      : `${day} ${monthName}`;
  };

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

  const handleGenerateAll = async () => {
    if (!activeHostelId) {
      console.log("Missing hostelId");
      return;
    }

    try {
      console.log(
        "GENERATING ALL RECURRING INVOICES:",
        activeHostelId
      );

      const result = await GenerateAllRecurringInvoices(
        activeHostelId
      );

      console.log(
        "GENERATE ALL RECURRING RESULT:",
        result
      );

      if (!result?.success) {
        console.log(
          "Generate failed:",
          result?.message
        );

        setModalType("error");
        setModalMessage(
          result?.message || "Failed to generate invoices"
        );
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500);

        return;
      }

      setModalType("success");
      setModalMessage("All invoices generated successfully");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1500);

 

      // Refresh review list
      await GetRecurringInvoicesForReview(
        activeHostelId
      );

    } catch (error) {
      console.log(
        "HANDLE GENERATE ALL ERROR:",
        error
      );

      setModalType("error");
      setModalMessage(
        error?.message || "Something went wrong"
      );
      setShowSuccessModal(true);
    }
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

  const handleInvoicePress = (invoice) => {
    console.log("🔥 INVOICE ROW CLICKED:", invoice?.invoiceId);
    console.log("Selected Invoice:", invoice);

    if (!invoice) return;

    setSelectedInvoice(invoice);
    setShowGenerateSheet(true);
  };

  const renderInvoice = ({ item, index }) => {
    const customerName =
      item?.customerInfo?.fullName || "Unknown Tenant";

    const initials =
      item?.customerInfo?.initials ||
      customerName
        .split(" ")
        .filter(Boolean)
        .map((name) => name?.[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const profilePic = item?.customerInfo?.profilePic;

    const floorName =
      item?.stayInfo?.floorName || "";

    const roomName =
      item?.stayInfo?.roomName || "";

    const amount =
      Number(item?.invoiceAmount || 0);

    return (
      <Pressable
        onPress={() => handleInvoicePress(item)}
        style={({ pressed }) => [
          styles.invoiceRow,
          index === 0 && styles.firstInvoiceRow,
          pressed && styles.invoiceRowPressed,
        ]}
      >

        {/* PROFILE */}
        <View style={styles.initialCircle}>
          {profilePic ? (
            <Image
              source={{ uri: profilePic }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={styles.initialText}>
              {initials}
            </Text>
          )}
        </View>

        {/* TENANT INFORMATION */}
        <View style={styles.tenantInfo}>

          <View style={styles.nameRow}>

            <Text
              style={[
                styles.tenantName,
                isSmallDevice && styles.tenantNameSmall,
              ]}
              numberOfLines={1}
            >
              {customerName}
            </Text>

            {item?.isEdited && (
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
            {floorName} / {roomName} · Rent ·{" "}
            {formatReviewDate(item?.invoiceStartDate, true)}
          </Text>

        </View>

        {/* AMOUNT + STATUS */}
        <View style={styles.amountSection}>

          <Text
            style={[
              styles.amountText,
              isSmallDevice &&
              styles.amountTextSmall,
            ]}
          >
            ₹{formatAmount(amount)}
          </Text>

          {renderStatus(item?.status)}

        </View>

      </Pressable>
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
                {`${formatReviewDate(
                  availablerecurringInvoices?.billingStartDate
                )} – ${formatReviewDate(
                  availablerecurringInvoices?.billingEndDate,
                  true
                )}`}
              </Text>

            </View>

            <View style={styles.generationItem}>
              <Text style={styles.periodLabel}>
                Gen. Date:
              </Text>

              <Text style={styles.periodValue}>
                {formatReviewDate(
                  availablerecurringInvoices?.invoiceDate,
                  true
                )}
              </Text>
            </View>
          </View>


          {/* <View style={styles.selectAllContainer}>
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
          </View> */}

          {/* 
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
          /> */}
          <FlatList
            data={invoices}
            keyExtractor={(item, index) =>
              String(item?.invoiceId ?? index)
            }
            renderItem={renderInvoice}
            showsVerticalScrollIndicator={false}
            bounces={true}
            contentContainerStyle={[
              styles.listContent,
              invoices.length === 0 && styles.emptyListContent,
            ]}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>
                    No invoices available
                  </Text>

                  <Text style={styles.emptyDescription}>
                    There are no recurring invoices available
                    for review.
                  </Text>
                </View>
              ) : null
            }
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
                  availablerecurringInvoices?.totalInvoices
                ).padStart(2, "0")}{" "}
                invoices are
              </Text>

              <Text style={styles.bottomSubText}>
                ready to generate
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={loading}
              onPress={handleGenerateAll}
              style={[
                styles.generateButton,
                loading && styles.generateButtonDisabled,
              ]}
            >
              <Image
                source={BillGenerateIcon}
                style={{ height: 12, width: 12 }}
              />

              <Text style={styles.generateButtonText}>
                {loading ? "Generating..." : "Generate All"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {showGenerateSheet && (
        <GenerateBillsSheet
          visible={showGenerateSheet}
          onClose={() => {
            setShowGenerateSheet(false);
            setSelectedInvoice(null);
          }}
          invoices={
            currentSelectedInvoice
              ? [currentSelectedInvoice]
              : []
          }

          onGenerate={(payload) => {
            console.log(
              "FINAL GENERATE PAYLOAD:",
              payload
            );

            console.log(
              "GENERATING INVOICE:",
              selectedInvoice
            );

            setShowGenerateSheet(false);
            setSelectedInvoice(null);
          }}
        />
      )}
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
  emptyListContent: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 80,
  },

  emptyTitle: {
    fontSize: 17,
    color: "#172033",
    fontFamily: "Gilroy-Medium",
    textAlign: "center",
  },

  emptyDescription: {
    marginTop: 6,
    fontSize: 13,
    color: "#7B8495",
    fontFamily: "Gilroy-Regular",
    textAlign: "center",
  },
  generateSingleButton: {
    marginTop: 5,
    minWidth: 68,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: "#008C4A",
    alignItems: "center",
    justifyContent: "center",
  },

  generateSingleButtonText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontFamily: "Gilroy-Medium",
  },
  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  invoiceRowPressed: {
    opacity: 0.65,
  },

})