import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
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
import { ExpensesContext } from "../../../Context/ExpensesContext";
// import { VendorContext } from "../../../Context/VendorContext";
import { CustomerContext } from "../../../Context/CustomerContext";
import Loader from "../../../Component/Loader/Loader"
import SuccessModal from "../../../ToastFile/ToastPage";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import SearchIcon from "../../../Assets/Images/Asset_search.png";
import AvatarPlaceholder from "../../../Assets/Images/Avatar.png";
import DotsIcon from "../../../Assets/Images/3dots.png";
import FilterIcon from "../../../Assets/Images/filter.png";
import AddIcon from "../../../Assets/Images/TenantAdd.png";
import BackIcon from "../../../Assets/Images/Arrow_left.png";


import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import DownArrow from "../../../Assets/Images/direction-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import { useHasPermission } from "../../../Utils/useHasPermission";
import EmailPic from "../../../Assets/Images/gmail.png"
import CallIcon from "../../../Assets/Images/call.png"
import LocationPic from "../../../Assets/Images/location.png"
import RevenueIcon from "../../../Assets/Images/MoneyRecive.png";
import PeopleIcon from "../../../Assets/Images/People.png";
import RupeeIcon from "../../../Assets/Images/Rupees.png";
import CategoryIcon from "../../../Assets/Images/Category.png";
import DirectionImage from "../../../Assets/Images/direction-down.png"
import Filter from "../../../Assets/Images/filter.png";
import OutstandingIcon from "../../../Assets/Images/Outstanding.png"
import GreenRupees from "../../../Assets/Images/RupeesBlue.png"
import LocationIcon from "../../../Assets/Images/LocatIcon.png";
import TickIcon from "../../../Assets/Images/tickgreen.png";



const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.44

export default function ExpensesList({ navigation }) {

    // const {
    //   vendorList,
    //   loading,
    //   getVendorList,
    //   addVendor,
    //   updateVendor,
    //   deleteVendor,
    // } = useContext(VendorContext);

    const { vendorList, getVendorList, deleteVendor } = useContext(CustomerContext);;
    const { expensesList, GetExpenseList, loading, IntializeexpensesList, GetInitializeExpense,
        DeleteExpense
    } = useContext(ExpensesContext);

    const { activeHostelId } = useContext(CommonContexts)

    const {
        canReadModule: canReadVendor,
        canWriteModule: canWriteVendor,
        canUpdateModule,
        canDeleteModule,
    } = useHasPermission("Vendor");


    useFocusEffect(
        useCallback(() => {
            if (activeHostelId) {
                GetExpenseList(activeHostelId);
            }
        }, [activeHostelId])
    );

    useEffect(() => {
        if (activeHostelId) {
            GetInitializeExpense(activeHostelId)
        }

    }, [activeHostelId])


    const handleSearch = async (text) => {
        if (!text?.trim()) {
            return GetExpenseList(activeHostelId);
        }

        return GetExpenseList(activeHostelId, {
            name: text,
            categoryId: selectedCategoryId || null,
            page: 1,
            size: 10,
        });
    };

    const handleClearSearch = async () => {
        setSearchText("");
        setSearchOpen(false);

        await GetExpenseList(activeHostelId);
    };

    const categoryList = IntializeexpensesList?.listExpenses || [];

    const Expensesdata =
        expensesList?.expenses || [];
    console.log("expenses", Expensesdata);

    console.log("expenses", expensesList);


    const horizontalRef = useRef(null);

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

    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    const [searchText, setSearchText] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);

    const staticExpenses = [
        {
            id: "1",
            title: "Vegetables 70 KG",
            amount: "5,000",
            date: "18 July 2026",
            status: "Paid",
            statusColor: "#16A34A",
        },
        {
            id: "2",
            title: "PVC valve Repairs",
            amount: "5,100",
            date: "18 July 2026",
            status: "Unpaid",
            statusColor: "#FF3B30",
        },
        {
            id: "3",
            title: "Milk 10 liters",
            amount: "600",
            date: "18 July 2026",
            status: "Paid",
            statusColor: "#16A34A",
            vendor: "Kural kaikai Angadi- Salem",
        },
        {
            id: "4",
            title: "Kitchen rack modular kitchen S...",
            amount: "8,100",
            date: "18 July 2026",
            status: "Partially paid",
            statusColor: "#FF8A00",
        },
        {
            id: "5",
            title: "3 Gas",
            amount: "2,700",
            date: "18 July 2026",
            status: "Paid",
            statusColor: "#16A34A",
            vendor: "Indane Gas Agencies- Thuraiyur",
        },
    ];

    const filteredExpenses = staticExpenses.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
    );

    useFocusEffect(
        useCallback(() => {
            if (activeHostelId) {
                getVendorList(activeHostelId);
            }
        }, [activeHostelId])
    );



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

    console.log("Search =>", searchText);



    const handleAddExpenses = () => {
        if (!activeHostelId) {
            setModalType("warning");
            setModalMessage("Please add a hostel first");
            setShowSuccessModal(true);

            setTimeout(() => setShowSuccessModal(false), 1500);
            return;
        }

        if (categoryList?.length === 0) {
            setModalType("warning");
            setModalMessage("Please add a Expense Category option in Settings");
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 1500);
            return;
        }
        navigation.navigate("AddExpensesPage", {
            //   vendor: item,
        })

    };

    const totalExpense =
        Expensesdata?.reduce(
            (sum, item) => sum + Number(item.totalAmount || 0),
            0
        ) || 0;

    const paidAmount =
        Expensesdata
            ?.filter(
                (item) =>
                    item?.paymentStatus?.toLowerCase() === "full"
            )
            ?.reduce(
                (sum, item) =>
                    sum + Number(item.totalAmount || 0),
                0
            ) || 0;


    const unpaidAmount = totalExpense - paidAmount;


    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "full":
                return "#16A34A";

            case "partial":
                return "#FF8A00";

            case "pending":
                return "#FF3B30";

            default:
                return "#6B7280";
        }
    };

    const SummaryCard = ({
        icon,
        title,
        value,
        prefix,
        suffix,
        valueColor = "#111827",
    }) => (
        <View style={styles.summaryCard}>
            <View style={styles.cardTopRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{title}</Text>

                    <Text style={[styles.cardValue, { color: valueColor }]}>
                        {prefix && <Text>{prefix}</Text>}
                        <AnimatedNumber value={value} />
                        {suffix && <Text>{suffix}</Text>}
                    </Text>
                </View>

                <View style={styles.iconBox}>
                    <Image source={icon} style={styles.cardIcon} />
                </View>
            </View>
        </View>
    );

    const AnimatedNumber = ({ value, duration = 800 }) => {
        const animatedValue = useRef(new Animated.Value(0)).current;
        const [displayValue, setDisplayValue] = useState(0);

        useEffect(() => {
            animatedValue.setValue(0);

            Animated.timing(animatedValue, {
                toValue: Number(value) || 0,
                duration,
                useNativeDriver: false,
            }).start();

            const listener = animatedValue.addListener(({ value }) => {
                setDisplayValue(Math.floor(value));
            });

            return () => {
                animatedValue.removeListener(listener);
            };
        }, [value]);

        return <Text>{displayValue}</Text>;
    };



    // const renderExpensesItem = ({ item }) => (
    //     <TouchableOpacity
    //         activeOpacity={0.8}
    //         onPress={() =>
    //             navigation.navigate("ExpensesDetails", {
    //                 expense: item,
    //             })
    //         }
    //     >
    //         <View>
    //             <View style={styles.expenseCard}>
    //                 <View style={{ flex: 1 }}>
    //                     <Text style={styles.expenseTitle}>
    //                         {item.title}
    //                     </Text>

    //                     <Text style={styles.expenseMeta}>
    //                         EXP 001 • {item.date}
    //                     </Text>
    //                 </View>

    //                 <View style={{ alignItems: "flex-end" }}>
    //                     <Text style={styles.expenseAmount}>
    //                         ₹ {item.amount}
    //                     </Text>

    //                     <Text
    //                         style={[
    //                             styles.statusText,
    //                             { color: item.statusColor },
    //                         ]}
    //                     >
    //                         {item.status}
    //                     </Text>
    //                 </View>
    //             </View>

    //             {item.vendor && (
    //                 <View style={styles.vendorBadge}>
    //                     <Image
    //                         source={LocationIcon}
    //                         style={styles.locationIcon}
    //                     />

    //                     <Text style={styles.vendorBadgeText}>
    //                         {item?.vendor ||
    //                             "Kural kaikai Angadi- Salem"}
    //                     </Text>
    //                 </View>
    //             )}
    //         </View>
    //     </TouchableOpacity>
    // );

    const renderExpensesItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
                navigation.navigate("ExpensesDetails", {
                    expense: item,
                })
            }
        >
            <View>
                <View style={styles.expenseCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.expenseTitle}>
                            {item?.title || "N/A"}
                        </Text>

                        <Text style={styles.expenseMeta}>
                            {item?.referenceNumber} • {item?.transactionDate}
                        </Text>
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.expenseAmount}>
                            ₹ {Number(item?.totalAmount || 0).toLocaleString("en-IN")}
                        </Text>

                        <Text
                            style={[
                                styles.statusText,
                                {
                                    color: getStatusColor(item?.paymentStatus),
                                },
                            ]}
                        >
                            {item?.paymentStatus}
                        </Text>
                    </View>
                </View>

                {/* {item?.vendorId && (
                    <View style={styles.vendorBadge}>
                        <Image
                            source={LocationIcon}
                            style={styles.locationIcon}
                        />

                        <Text style={styles.vendorBadgeText}>
                            Vendor Expense
                        </Text>
                    </View>
                )} */}
            </View>
        </TouchableOpacity>
    );

    if (!canReadVendor && !loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack?.()}>
                        <Image source={BackIcon} style={styles.backArrow} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Expenses</Text>
                </View>
                <View style={styles.emptyContainer}>

                    <Image source={EmptyState} style={styles.emptyImage} />
                    <Text style={styles.emptyText}>
                        You do not have access to view Expenses
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
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={BackIcon} style={styles.backArrow} />
                    </TouchableOpacity>

                    {!searchOpen ? (
                        <>
                            <Text style={styles.headerTitle}>Expenses</Text>

                            {/* <TouchableOpacity
                                style={styles.searchBtn}
                                onPress={() => setSearchOpen(true)}
                            >
                                <Image source={SearchIcon} style={styles.headerSearchIcon} />
                            </TouchableOpacity> */}

                            {Expensesdata?.length > 0 && (
                                <TouchableOpacity
                                    style={styles.searchBtn}
                                    onPress={() => setSearchOpen(true)}
                                >
                                    <Image
                                        source={SearchIcon}
                                        style={styles.headerSearchIcon}
                                    />
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <View style={styles.searchWrapper}>
                            <TextInput
                                placeholder="Search Expenses"
                                value={searchText}
                                onChangeText={(text) => {
                                    setSearchText(text);
                                    handleSearch(text);
                                }}
                                style={styles.searchInput}
                                placeholderTextColor="#9CA3AF"
                                autoFocus
                            />

                            <TouchableOpacity
                                onPress={handleClearSearch}
                            >
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>



                {!loading && Expensesdata?.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Image
                            source={EmptyState}
                            style={styles.emptyImage}
                        />
                        <Text style={styles.emptyText}>
                            No Expenses are there!
                        </Text>

                        <TouchableOpacity style={[
                            styles.addVendorBtn,
                            !canWriteVendor && { opacity: 0.7 }
                        ]}
                            disabled={!canWriteVendor} onPress={handleAddExpenses}>
                            <Text style={styles.addVendorText}>+ Add Expenses</Text>
                        </TouchableOpacity>
                    </View>
                ) : (

                    <>
                        {!loading && Expensesdata?.length > 0 &&
                            (
                                <>
                                    {/* <View style={styles.searchWrapper}>
  <Image source={SearchIcon} style={styles.searchIcon} />
  <TextInput
    placeholder="Search Vendors"
    value={searchText}
    onChangeText={setSearchText}
    placeholderTextColor="#9CA3AF"
    style={styles.searchInput}
  />
</View> */}
                                    {/* 
                                    <ScrollView
                                        horizontal
                                        ref={horizontalRef}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.cardRow}
                                        style={{ marginBottom: 4 }}


                                    >
                                        <SummaryCard
                                            icon={RevenueIcon}
                                            title="Total Vendors"
                                            value={300}
                                            prefix="₹ "
                                        />

                                        <SummaryCard
                                            icon={RupeeIcon}
                                            title="Total Purchase"
                                            value={2000}
                                            prefix="₹ "
                                        />

                                        <SummaryCard
                                            icon={PeopleIcon}
                                            title="Outstanding"
                                            value={50}
                                        />



                                    </ScrollView> */}
                                </>
                            )

                        }


                        {/* <FlatList
                            //   data={vendorList}
                            data={filteredVendors}
                            keyExtractor={(item) => item?.id.toString()}
                            renderItem={renderVendor}
                            contentContainerStyle={{
                                paddingTop: 0,
                                paddingHorizontal: 16,
                                paddingBottom: 200,
                            }}
                            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                            showsVerticalScrollIndicator={false}
                        /> */}




                        <FlatList
                            data={Expensesdata || []}
                            keyExtractor={(item) => item?.expenseId}
                            renderItem={renderExpensesItem}
                            ListHeaderComponent={() => (
                                <>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.cardRow}
                                    >
                                        <SummaryCard
                                            title="Total Expense Amount"
                                            value={expensesList?.expenseSummary?.totalExpenseAmount}
                                            icon={GreenRupees}
                                        />

                                        <SummaryCard
                                            title="Paid"
                                            value={expensesList?.expenseSummary?.totalPaidAmount}
                                            icon={TickIcon}
                                            valueColor="#00A651"
                                        />

                                        <SummaryCard
                                            title="UnPaid"
                                            value={expensesList?.expenseSummary?.totalUnPaidAmount}
                                            icon={RupeeIcon}
                                        />

                                        <SummaryCard
                                            title="Partially Paid"
                                            value={expensesList?.expenseSummary?.totalPartialPaidAmount}
                                            icon={RupeeIcon}
                                        />

                                    </ScrollView>

                                    <View style={styles.filterRow}>
                                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                                            <TouchableOpacity style={styles.filterChipActive}>
                                                <Text style={styles.filterChipTextActive}>All</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.filterChip}>
                                                <Text style={styles.filterChipText}>Category</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.filterIconBtn}
                                            onPress={() => setShowFilter(true)}
                                        >
                                            <Image source={FilterIcon} style={{ width: 18, height: 18 }} />
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                            contentContainerStyle={{
                                paddingHorizontal: 20,
                                paddingBottom: 120
                            }}
                        />

                    </>
                )}


                {!loading && Expensesdata?.length > 0 && (
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
                            onPress={handleAddExpenses}
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
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 10,
    },


    headerTitle: {
        flex: 1,
        fontSize: 22,
        color: "#111827",
        fontFamily: "Gilroy-Semibold",
    },

    searchBtn: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },

    headerSearchIcon: {
        width: 24,
        height: 24,
    },

    searchWrapper: {
        flex: 1,
        height: 46,
        borderWidth: 1,
        borderColor: "#DDE3F0",
        borderRadius: 24,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginLeft: 10,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },

    closeIcon: {
        fontSize: 20,
        color: "#6B7280",
        fontWeight: "600",
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
    // headerTitle: { fontSize: 18, fontFamily: "Gilroy-Bold", color: "#111" },

    // searchWrapper: {
    //     flex: 1,
    //     height: 50,
    //     backgroundColor: "#fff",
    //     borderWidth: 1,
    //     borderColor: "#E5E7EB",
    //     borderRadius: 25,
    //     flexDirection: "row",
    //     alignItems: "center",
    //     paddingHorizontal: 15,
    //     marginLeft: 10,
    // },
    // searchIcon: { width: 18, height: 18, tintColor: "#9CA3AF" },
    // searchInput: { marginLeft: 10, flex: 1, fontSize: 14, color: "#111" },

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
    companyText: { color: "#A47E00", fontSize: 12, fontFamily: "Gilroy-Semibold" },

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
        borderRadius: 20,

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
    applyBtnText: { color: "#fff", fontFamily: "Gilroy-Bold" },

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
    statsRow: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginBottom: 16,
        justifyContent: "space-between",
    },

    statCard: {
        width: "48%",
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        padding: 16,
    },

    statLabel: {
        color: "#64748B",
        fontSize: 13,
    },

    statValue: {
        fontSize: 26,
        fontFamily: "Gilroy-Bold",
        color: "#111827",
        marginTop: 6,
    },

    vendorCard: {
        backgroundColor: "#fff",
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    vendorLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    vendorAvatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        marginRight: 12,
    },

    avatarCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#E0F2FE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    avatarText: {
        color: "#0284C7",
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
    },

    vendorTitle: {
        fontSize: 16,
        fontFamily: "Gilroy-Bold",
        color: "#111827",
    },

    vendorCode: {
        color: "#6B7280",
        marginTop: 4,
        fontSize: 12,
    },

    tag: {
        marginTop: 6,
        alignSelf: "flex-start",
        backgroundColor: "#FEF3C7",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginLeft: 8
    },

    tagText: {
        color: "#B45309",
        fontSize: 12,
    },
    amountContainer: {
        alignItems: "flex-end",
    },

    amountText: {
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
        color: "#111827",
    },

    outstandingText: {
        fontSize: 13,
        color: "#9CA3AF",
        marginTop: 4,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        padding: 18,
        marginHorizontal: 4,
    },

    statValue: {
        marginTop: 10,
        fontSize: 20,
        fontFamily: "Gilroy-Bold",
    },
    cardRow: {
        paddingLeft: 10,
        paddingTop: 8,
        // paddingBottom: 0,
    },

    // summaryCard: {
    //     width: CARD_WIDTH,
    //     height: 95, 
    //     backgroundColor: "#FFFFFF",
    //     borderRadius: 14,
    //     paddingHorizontal: 14,
    //     paddingVertical: 10,
    //     marginRight: 10,

    //     borderWidth: 1,
    //     borderColor: "#EEF2F6",

    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.04,
    //     shadowRadius: 4,
    //     elevation: 2,
    //     marginBottom:10,
    //     marginTop:10

    // },
    summaryCard: {
        width: CARD_WIDTH,
        height: 90,
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,

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

    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#fff",

        justifyContent: "center",
        alignItems: "center",

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
    filterRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 14,
        paddingHorizontal: 2,
    },

    filterChip: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 22,
        paddingHorizontal: 18,
        paddingVertical: 10,
        marginLeft: 8
    },

    filterChipActive: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAF2FF",
        borderRadius: 22,
        paddingHorizontal: 18,
        paddingVertical: 10,
    },

    filterChipText: {
        fontSize: 13,
        color: "#374151",
    },

    filterChipTextActive: {
        fontSize: 13,
        color: "#2D6CDF",
        fontFamily: "Gilroy-Semibold",
    },

    filterIconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        // backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    chipContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    chipArrow: {
        width: 14,
        height: 14,
        marginLeft: 6,
    },

    expenseCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",

        paddingVertical: 18,

        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },

    expenseTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Semibold",
        color: "#111827",
    },

    expenseMeta: {
        marginTop: 8,
        color: "#6B7280",
        fontSize: 13,
    },

    expenseAmount: {
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
        color: "#111827",
    },

    statusText: {
        marginTop: 8,
        fontSize: 14,
        color: "#16A34A",
    },
    vendorRow: {
        alignItems: "flex-end",
        marginTop: -8,
        marginBottom: 12,
    },

    // vendorBadge: {
    //   alignSelf: "flex-end",
    //   marginTop: 10,
    //   backgroundColor: "#1E3A8A",
    //   borderRadius: 20,
    //   paddingHorizontal: 12,
    //   paddingVertical: 6,
    // },
    // vendorText: {
    //   fontSize: 14,
    //   color:"#fff"
    // },


    vendorBadge: {
        marginLeft: 10,
        backgroundColor: "#1E2FA3",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
    },

    locationIcon: {
        width: 22,
        height: 22,
        tintColor: "#FFFFFF",
        marginRight: 10,
    },

    vendorBadgeText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontFamily: "Gilroy-Medium",
    },
})


