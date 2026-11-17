import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useHasPermission } from "../../../Utils/useHasPermission";

import FilterIcon from "../../../Assets/Images/filter.png";
import Bills_Black_Icon from "../../../Assets/Images/Bills_Black_Icon.png";
import EmptyFloor from "../../../Assets/Images/Empty_state.png";
import AddIcon from "../../../Assets/Images/add-circle.png";
import TickIcon from "../../../Assets/Images/tick-circle.png";
import RupeeIcon from "../../../Assets/Images/Rupees.png";
import TickGreenIcon from "../../../Assets/Images/tickgreen.png";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.44;

const SCROLL_DELTA = 10;
const HIDE_TAB_BAR_AFTER_Y = 50;

const keyExtractor = (item, index) =>
  item?.invoiceId ? String(item.invoiceId) : String(index);

// ---------------------------------------------------------------------------
// Presentational components (module level so their identity is stable across
// renders — otherwise every re-render remounts them and causes flicker).
// ---------------------------------------------------------------------------

const AnimatedNumber = memo(({ value, duration = 800 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    animatedValue.setValue(0);

    const listener = animatedValue.addListener(({ value: v }) => {
      setDisplayValue(Math.floor(v));
    });

    const animation = Animated.timing(animatedValue, {
      toValue: Number(value) || 0,
      duration,
      useNativeDriver: false,
    });
    animation.start();

    return () => {
      animation.stop();
      animatedValue.removeListener(listener);
    };
  }, [value, duration, animatedValue]);

  return <Text>{displayValue}</Text>;
});

const SummaryCard = memo(
  ({ icon, title, value, prefix, suffix, valueColor = "#111827", linearcolor }) => (
    <LinearGradient
      colors={["#FFFFFF", linearcolor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.summaryCard}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>

          <Text style={[styles.cardValue, { color: valueColor }]}>
            ₹ {prefix && <Text>{prefix}</Text>}
            <AnimatedNumber value={value} />
            {suffix && <Text>{suffix}</Text>}
          </Text>
        </View>

        <View style={styles.iconBox}>
          <Image source={icon} style={styles.cardIcon} />
        </View>
      </View>
    </LinearGradient>
  )
);

const BookingRow = memo(({ item, onPress }) => (
  <TouchableOpacity
    style={styles.row}
    activeOpacity={0.7}
    onPress={() => onPress(item)}
  >
    <View>
      <View style={styles.avatarWrapper}>
        {item?.profilePic ? (
          <Image source={{ uri: item.profilePic }} style={styles.avatar} />
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

    <View style={styles.nameCol}>
      <Text style={styles.name} numberOfLines={1}>
        {item?.fullName}
      </Text>

      <View style={styles.billRow}>
        <Image source={Bills_Black_Icon} style={styles.billIcon} />
        <Text style={styles.bill}>{item?.invoiceNumber}</Text>
      </View>
    </View>

    <View style={styles.rightSection}>
      <Text style={styles.amountText}>₹ {item?.availableAmount}</Text>
      <Text style={styles.dateText}>{item?.invoiceDate}</Text>
    </View>
  </TouchableOpacity>
));

const FilterChip = ({ text }) => (
  <View style={styles.filterChip}>
    <Text style={styles.filterChipText}>{text}</Text>
  </View>
);

const LabeledFilterChip = ({ label, value }) => (
  <View style={styles.filterChip}>
    <Text style={styles.filterChipLabel}>{label}</Text>
    <Text style={styles.filterChipValue}>{value}</Text>
  </View>
);

const AppliedFiltersBar = memo(({ filters, onReset }) => (
  <View style={styles.appliedFilterWrapper}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.appliedFilterScroll}
    >
      {!!filters?.startDate && <FilterChip text={`From : ${filters.startDate}`} />}
      {!!filters?.endDate && <FilterChip text={`To : ${filters.endDate}`} />}
      {!!filters?.status && <FilterChip text={`Status is : ${filters.status}`} />}
      {!!filters?.period && <FilterChip text={`Period is : ${filters.period}`} />}
      {!!filters?.floor && (
        <LabeledFilterChip label="Floor" value={filters?.floorName || filters?.floor} />
      )}
      {!!filters?.room && (
        <LabeledFilterChip label="Room" value={filters?.roomName || filters?.room} />
      )}
      {filters?.minAmount !== undefined && (
        <FilterChip text={`Min Amount : ₹ ${filters.minAmount}`} />
      )}
      {filters?.maxAmount !== undefined && (
        <FilterChip text={`Max Amount : ₹ ${filters.maxAmount}`} />
      )}
      {!!filters?.type && <FilterChip text={`Type : ${filters.type}`} />}
    </ScrollView>

    <TouchableOpacity
      onPress={onReset}
      activeOpacity={0.7}
      style={styles.topResetButton}
    >
      <Text style={styles.topResetText}>Reset</Text>
    </TouchableOpacity>
  </View>
));

const RetainerSummary = memo(({ summary }) => (
  <>
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Total Retainer Amount</Text>
      <Text style={styles.totalValue}>₹ {summary?.totalRetainerAmount || 0}</Text>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.cardRow}
    >
      <SummaryCard
        title="Booking"
        value={summary?.totalBookingAmount || 0}
        icon={TickGreenIcon}
        valueColor="#00A651"
        linearcolor="#F4FFF7"
      />
      <SummaryCard
        title="Advance"
        value={summary?.totalAdvanceAmount || 0}
        icon={RupeeIcon}
        linearcolor="#FFF4F4"
      />
      <SummaryCard
        title="Rent"
        value={summary?.totalRentAmount || 0}
        icon={RupeeIcon}
        linearcolor="#FFF4F4"
      />
      <SummaryCard
        title="EB"
        value={summary?.totalEbAmount || 0}
        icon={RupeeIcon}
        linearcolor="#FFF4F4"
      />
      <SummaryCard
        title="General"
        value={summary?.otherAmount || 0}
        icon={RupeeIcon}
        linearcolor="#FFF4F4"
      />
    </ScrollView>
  </>
));

const EmptyBookingsState = ({ message, onReset }) => (
  <View style={styles.emptyContainer}>
    <Image source={EmptyFloor} style={styles.emptyImage} resizeMode="contain" />
    <Text style={styles.emptyText}>{message}</Text>

    {!!onReset && (
      <TouchableOpacity
        style={styles.emptyResetButton}
        onPress={onReset}
        activeOpacity={0.8}
      >
        <Text style={styles.emptyResetText}>Reset</Text>
      </TouchableOpacity>
    )}
  </View>
);

const LoadMoreFooter = () => (
  <View style={styles.footerLoader}>
    <ActivityIndicator size="small" color="#1E45E1" />
  </View>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

const BillBookings = ({
  setShowTabBar,
  onBookingDetailsShow,
  showRetainerFiltersheet,
  appliedFilters,
  setAppliedFilters,
}) => {
  const {
    loading,
    bookingBills,
    setBookingBills,
    GetAdvanceBookingBills,
    LoadMoreAdvanceBookingBills,
    bookingLoadingMore,
  } = useContext(BillContext);
  const { activeHostelId, hostelList } = useContext(CommonContexts);

  const { canWriteModule: canWriteBooking, canReadModule: canReadBooking } =
    useHasPermission("Booking");

  const navigation = useNavigation();

  // Keep latest props/context functions in refs so callbacks below can stay
  // stable (and memoized rows don't re-render) without going stale.
  const latest = useRef({});
  latest.current = {
    setShowTabBar,
    onBookingDetailsShow,
    setAppliedFilters,
    GetAdvanceBookingBills,
    LoadMoreAdvanceBookingBills,
    activeHostelId,
    canReadBooking,
    loading,
    bookingLoadingMore,
  };

  const lastScrollY = useRef(0);
  const isTabBarVisible = useRef(true);
  const onEndReachedDuringMomentum = useRef(true);

  // ----- Derived data -----

  const bookings = useMemo(() => {
    if (Array.isArray(bookingBills?.advanceInvoiceList)) {
      return bookingBills.advanceInvoiceList;
    }
    return Array.isArray(bookingBills) ? bookingBills : [];
  }, [bookingBills]);

  const hasBookings = bookings.length > 0;
  const retainerSummary = bookingBills?.retainerSummary;

  const hasActiveBookingFilter = useMemo(
    () =>
      !!appliedFilters &&
      !!(
        appliedFilters.startDate ||
        appliedFilters.endDate ||
        appliedFilters.status ||
        appliedFilters.period ||
        appliedFilters.floor ||
        appliedFilters.room ||
        appliedFilters.minAmount !== undefined ||
        appliedFilters.maxAmount !== undefined ||
        (Array.isArray(appliedFilters.type) && appliedFilters.type.length > 0)
      ),
    [appliedFilters]
  );

  // ----- Data loading -----

  useEffect(() => {
    if (activeHostelId && canReadBooking) {
      GetAdvanceBookingBills(activeHostelId);
    } else {
      setBookingBills([]);
    }
    // Context functions are recreated every render; only refetch on these.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHostelId, canReadBooking]);

  // ----- Handlers (stable identities) -----

  const handleScroll = useCallback((event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (Math.abs(diff) < SCROLL_DELTA) return;

    const { setShowTabBar: setTabBar } = latest.current;

    if (diff > 0 && currentY > HIDE_TAB_BAR_AFTER_Y) {
      if (isTabBarVisible.current) {
        setTabBar?.(false);
        isTabBarVisible.current = false;
      }
    } else if (diff < 0 && !isTabBarVisible.current) {
      setTabBar?.(true);
      isTabBarVisible.current = true;
    }

    lastScrollY.current = currentY;
  }, []);

  const handleMomentumScrollBegin = useCallback(() => {
    onEndReachedDuringMomentum.current = false;
  }, []);

  const handleLoadMoreBookings = useCallback(() => {
    const l = latest.current;
    if (
      onEndReachedDuringMomentum.current ||
      !l.activeHostelId ||
      !l.canReadBooking ||
      l.loading ||
      l.bookingLoadingMore
    ) {
      return;
    }
    onEndReachedDuringMomentum.current = true;
    l.LoadMoreAdvanceBookingBills(l.activeHostelId);
  }, []);

  const handleViewBookingDetails = useCallback((item) => {
    latest.current.onBookingDetailsShow?.(item);
  }, []);

  const handleResetBookingFilters = useCallback(async () => {
    const l = latest.current;
    l.setAppliedFilters?.(null);

    if (!l.activeHostelId || !l.canReadBooking) return;

    await l.GetAdvanceBookingBills(l.activeHostelId);
  }, []);

  const handleAddRetainer = useCallback(() => {
    navigation.navigate("NewRetainerInvoiceSheet");
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }) => <BookingRow item={item} onPress={handleViewBookingDetails} />,
    [handleViewBookingDetails]
  );

  // ----- List chrome -----

  const listHeader = useMemo(
    () =>
      hasBookings ? (
        <>
          {hasActiveBookingFilter && (
            <AppliedFiltersBar
              filters={appliedFilters}
              onReset={handleResetBookingFilters}
            />
          )}
          <RetainerSummary summary={retainerSummary} />
        </>
      ) : null,
    [
      hasBookings,
      hasActiveBookingFilter,
      appliedFilters,
      retainerSummary,
      handleResetBookingFilters,
    ]
  );

  const listEmpty = useMemo(
    () =>
      loading ? null : (
        <EmptyBookingsState
          message={
            hasActiveBookingFilter
              ? "No bookings found for the selected filter"
              : "No Bookings Found"
          }
          onReset={hasActiveBookingFilter ? handleResetBookingFilters : undefined}
        />
      ),
    [loading, hasActiveBookingFilter, handleResetBookingFilters]
  );

  const hasHostels = hostelList?.length > 0;

  return (
    <View style={styles.container}>
      {!canReadBooking && !loading ? (
        <EmptyBookingsState message="You don’t have permission to view bookings" />
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          ListFooterComponent={bookingLoadingMore ? LoadMoreFooter : null}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onEndReached={handleLoadMoreBookings}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={handleMomentumScrollBegin}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={11}
          removeClippedSubviews={Platform.OS === "android"}
        />
      )}

      {!loading && hasHostels && (
        <TouchableOpacity
          style={[styles.addButton, !canWriteBooking && styles.disabled]}
          disabled={!canWriteBooking}
          onPress={handleAddRetainer}
        >
          <Image source={AddIcon} style={styles.addIcon} />
        </TouchableOpacity>
      )}

      {!loading && hasBookings && hasHostels && (
        <TouchableOpacity
          style={[styles.filterButton, !canReadBooking && styles.disabled]}
          disabled={!canReadBooking}
          onPress={showRetainerFiltersheet}
        >
          <Image source={FilterIcon} style={styles.filterIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BillBookings;

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 0,
    flexGrow: 1,
    paddingBottom: 120,
  },
  nameCol: {
    flex: 1,
    marginRight: 5,
  },
  billRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  billIcon: {
    width: 12,
    height: 12,
    marginTop: 3,
    marginRight: 5,
  },
  amountText: {
    fontWeight: "700",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 13,
    fontFamily: "Gilroy-Medium",
    color: "#64748B",
  },
  totalValue: {
    fontSize: 18,
    fontFamily: "Gilroy-Semibold",
  },
  footerLoader: {
    paddingVertical: 16,
  },
  addIcon: {
    width: 25,
    height: 25,
  },
  filterIcon: {
    width: 30,
    height: 30,
  },
  disabled: {
    opacity: 0.4,
  },
  container: {
    flex: 1,
    paddingHorizontal: 8,
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
    right: 10,
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
  emptyResetButton:{
      borderWidth:1,borderColor:'#1D5DFF',
      paddingVertical:10,paddingHorizontal:16,
      borderRadius:10,marginTop:10
  },
  emptyResetText:{
    fontSize:16,fontFamily:'Gilroy-Medium',
    color:'#1D5DFF'
  },
  cardRow: {
    paddingLeft: 5,
    paddingTop: 8,
    // paddingBottom: 0,
    marginBottom: 5
  },


  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#777",
  },
  addButton: {
    position: "absolute",
    bottom: 60,
    right: 10,
    backgroundColor: "#1D5DFF",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  summaryCard: {
    width: CARD_WIDTH,
    height: Platform.OS === "ios" ? 100 : 90,
    backgroundColor: "#fff",
    borderRadius: 16,
    // paddingHorizontal: 14,
    // paddingVertical: 12,
    paddingTop: Platform.OS === "ios" ? 0 : 5,
    paddingRight: Platform.OS === "ios" ? 0 : 15,
    paddingBottom: Platform.OS === "ios" ? 0 : 1,
    paddingLeft: Platform.OS === "ios" ? 0 : 15,

    borderWidth: 1,
    borderColor: "#EEF2F6",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,

    marginRight: 12,
    marginBottom: 10, marginTop: 5
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,

  },
  cardContent: {
    paddingLeft: Platform.OS === "ios" ? 12 : 0,
    paddingTop: Platform.OS === "ios" ? 5 : 0,
    paddingRight: Platform.OS === "ios" ? 18 : 15,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#fff",

    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,

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
  appliedFilterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    marginTop: 8,
    marginBottom: 10,
},

appliedFilterScroll: {
    flexGrow: 1,
    paddingRight: 6,
    gap: 8,
},

filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F7FF",
    borderWidth: 1,
    borderColor: "#D9E3FF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    marginRight: 6,
},

filterChipLabel: {
    fontSize: 12,
    fontFamily: "Gilroy-Medium",
    color: "#64748B",
    marginRight: 4,
},

filterChipValue: {
    fontSize: 13,
    fontFamily: "Gilroy-Semibold",
    color: "#1D5BEE",
},

topResetButton: {
    marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
},

topResetText: {
    fontSize: 13,
    fontFamily: "Gilroy-Semibold",
    color: "#1D5BEE",
},


});
