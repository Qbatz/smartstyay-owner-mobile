import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    PanResponder,
    Dimensions,
    BackHandler,
    Image,
    TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import FilterDropdown from "./FilterDropdown"
import DownArrow from "../../../Assets/Images/direction-down.png";
import { Calendar } from "react-native-calendars";
import CalenderIcon from "../../../Assets/Images/calendar.png"
import dayjs from "dayjs";




const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ReportsAllFilterBottomSheet({
    visible,
    reportType,
    filters,
    selectedFilters,
    onClose, onApply, onReset,
    setSelectedSharingValue, setSelectedTenantStatus, setSelectedFloorValue,
    setSelectedRoomValue, tenantList, setTenantValue,
    setSelectedMonth,

    setSelectedBillStatus, setSelectedInvoiceType,
    setCreatedByValue, setSelectedModeValue,
    setStartDateValue, setEndDateValue,
    setMinPaidValue, setMaxPaidValue,

    setVendorValue, setAllSelectedMonth,
    setPaymentStatusValue, setCategoryValue, setSubCategoryValue,
    setPaymentModeValue

}) {

    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const [selectedTenants, setSelectedTenants] = useState("")
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedSharing, setSelectedSharing] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [minAmount, setMinAmount] = useState(null)
    const [maxAmount, setMaxAmount] = useState(null)

    // invoice filter


    const [selectedType, setSelectedType] = useState(null)
    const [selectedCreatedBy, setSelectedCreatedBy] = useState(null)
    const [selectedMode, setSelectedMode] = useState(null)

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selecting, setSelecting] = useState("start");

    const [showInvoiceSystemFilter, setShowInvoiceSystemFilter] = useState(true)
    const [showInvoiceMoreFilter, setShowInvoiceMoreFilter] = useState(true)

    // const [paymentStatus, setPaymentStatus] = useState("")
    const [category, setCategory] = useState([])
    const [subCategory, setSubcategory] = useState([])
    const [vendor, setVendor] = useState("")


    const [error, setError] = React.useState("");
    const [errorMsg, setErrorMsg] = useState("")

    const openSheet = () => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    const closeSheet = () => {
        Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
        }).start(onClose);
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) translateY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 120) closeSheet();
                else openSheet();
            },
        })
    ).current;

    useEffect(() => {
        if (visible) {
            setError("");
            openSheet();

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                () => {
                    closeSheet();
                    return true;
                }
            );

            return () => backHandler.remove();
        }
    }, [visible]);

    const isInvoice = reportType === "invoice";
    const isReceipt = reportType === "receipt";
    const isTenant = reportType === "tenant";
    const isExpense = reportType === "expense"

    //     const filteredRooms = (filters?.room || []).filter(room =>
    //     selectedFloor?.some(floor => floor.id === room.floorId)
    // );
    const filteredRooms =
        selectedFloor?.length > 0
            ? (filters?.room || []).filter(room =>
                selectedFloor.some(
                    floor => String(floor.id) === String(room.floorId)
                )
            )
            : (filters?.room || []);

    const filteredSubCategory =
        category?.length > 0
            ? (filters?.subCategory || []).filter(subCat =>
                category.some(
                    item =>
                        String(item?.categoryId) ===
                        String(subCat?.categoryId)
                )
            )
            : (filters?.subCategory || []);

    console.log("startdate", startDate)

    const getMarkedDates = () => {
        if (!startDate) {
            return {};
        }

        if (!endDate) {
            return {
                [startDate]: {
                    startingDay: true,
                    endingDay: true,
                    color: "#2196F3",
                    textColor: "#fff",
                },
            };
        }

        const marked = {};

        let current = dayjs(startDate);
        const end = dayjs(endDate);

        while (
            current.isBefore(end, "day") ||
            current.isSame(end, "day")
        ) {
            const date = current.format("YYYY-MM-DD");

            marked[date] = {
                color: "#DCEEFF",
                textColor: "#222",
            };

            if (date === startDate) {
                marked[date] = {
                    startingDay: true,
                    color: "#2196F3",
                    textColor: "#fff",
                };
            }

            if (date === endDate) {
                marked[date] = {
                    endingDay: true,
                    color: "#2196F3",
                    textColor: "#fff",
                };
            }

            current = current.add(1, "day");
        }

        return marked;
    };


    if (!visible) return null;

    return (
        <>
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={closeSheet}
            />

            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    styles.sheet,
                    {
                        transform: [{ translateY }],
                        paddingBottom: 20 + insets.bottom
                    }
                ]}
            >
                <View style={styles.dragIndicator} />

                {/* <Text style={styles.title}>{title}</Text> */}

                {/* HEADER */}

                <View style={styles.header}>

                    <Text style={styles.headerTitle}>
                        Filter
                    </Text>

                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeButton}>
                            ×
                        </Text>
                    </TouchableOpacity>

                </View>


                <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    contentContainerStyle={{
                        paddingBottom: 50
                    }}
                >

                    {/* ================= INVOICE ================= */}

                    {isInvoice && (
                        <>
                            <TouchableOpacity onPress={() => setShowInvoiceSystemFilter(!showInvoiceSystemFilter)}
                                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 18, marginBottom: 8, }}>
                                <Text style={styles.sectionTitle}>
                                    System Filter
                                </Text>

                                <Image source={DownArrow} style={{ width: 20, height: 20, marginLeft: 8 }} />
                            </TouchableOpacity>

                            {showInvoiceSystemFilter && (
                                <>

                                    <Text style={styles.label}>Bill Status</Text>

                                    <FilterDropdown
                                        options={filters?.paymentStatus}
                                        value={selectedStatus}
                                        multiSelect={true}
                                        onSelect={(value) => {
                                            console.log("dropdow", value.id)
                                            setSelectedStatus(value)
                                            const statusIds = value.map(item => item?.type);

                                            setSelectedBillStatus(statusIds);

                                        }}
                                        placeholder="Select Status"
                                    />

                                    <Text style={styles.label}>Period</Text>

                                    <FilterDropdown
                                        options={filters?.periods}
                                        value={selectedPeriod}
                                        onSelect={(value) => {
                                            console.log("Perioddropdow", value?.id)
                                            setSelectedPeriod(value)
                                            setSelectedMonth(value?.id || value)
                                        }}
                                        placeholder="Select "
                                    />

                                    <Text style={styles.label}>Custom Date</Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={[styles.dateField, { marginRight: 5 }]}
                                            onPress={() => {
                                                setSelecting("start");
                                                setShowCalendar(true);
                                            }}
                                        >
                                            <Text style={{ color: startDate ? "#222" : "#999" }}>
                                                {startDate
                                                    ? dayjs(startDate).format("DD MMM YYYY")
                                                    : "Start"}
                                            </Text>

                                            <Image source={CalenderIcon} style={{ width: 16.5, height: 17, tintColor: '#28303F' }} />
                                        </TouchableOpacity>


                                        {/* END */}
                                        <TouchableOpacity
                                            style={[styles.dateField, { marginLeft: 5 }]}
                                            onPress={() => {
                                                setSelecting("end");
                                                setShowCalendar(true);
                                            }}
                                        >
                                            <Text style={{ color: endDate ? "#222" : "#999" }}>
                                                {endDate
                                                    ? dayjs(endDate).format("DD MMM YYYY")
                                                    : "End"}
                                            </Text>

                                            <Image source={CalenderIcon} style={{ width: 16.5, height: 17, tintColor: '#28303F' }} />
                                        </TouchableOpacity>


                                    </View>


                                    <Text style={styles.label}>Type</Text>

                                    <FilterDropdown
                                        options={filters?.invoiceTypes}
                                        value={selectedType}
                                        multiSelect={true}
                                        onSelect={(value) => {
                                            setSelectedType(value)
                                            const statusIds = value.map(item => item.type);
                                            setSelectedInvoiceType(statusIds)
                                        }}
                                        placeholder="Select Invoice type"
                                    />

                                    <Text style={styles.label}>Created By</Text>

                                    <FilterDropdown
                                        options={filters?.createdBy}
                                        value={selectedCreatedBy}
                                        multiSelect={true}
                                        onSelect={(value) => {
                                            setSelectedCreatedBy(value)

                                            const statusIds = value.map(item => item?.userId);
                                            setCreatedByValue(statusIds)
                                        }}
                                        placeholder="Select User"
                                    />

                                    <Text style={styles.label}>Mode</Text>
                                    <FilterDropdown
                                        options={filters?.invoiceModes}
                                        value={selectedMode}
                                        multiSelect={true}
                                        onSelect={(value) => {
                                            setSelectedMode(value)

                                            const statusIds = value.map(item => item.type);
                                            setSelectedModeValue(statusIds)
                                        }}
                                        placeholder="Select Mode"
                                    />
                                </>
                            )}

                            <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
                                More Filters
                            </Text>

                            <Text style={styles.label}>Amount Range</Text>

                            <View style={styles.amountRow}>

                                {/* Minimum Amount */}
                                <View style={[styles.amountInputContainer, { marginRight: 5 }]}>
                                    <Text style={styles.currency}>₹</Text>

                                    <TextInput
                                        value={minAmount}
                                        onChangeText={(text) => {
                                            if (text > maxAmount) {
                                                setErrorMsg("Min Amount should not be greater than max")
                                            } else {
                                                setErrorMsg("")
                                            }
                                            const cleanText = text.replace(/[^0-9]/g, "");
                                            setMinAmount(cleanText)
                                            setMinPaidValue(cleanText)
                                        }}
                                        placeholder="Min"
                                        placeholderTextColor="#999"
                                        keyboardType="numeric"
                                        style={styles.amountInput}
                                    />
                                </View>

                                {/* Maximum Amount */}
                                <View style={[styles.amountInputContainer, { marginLeft: 5 }, !minAmount && { opacity: 0.4 }]}>
                                    <Text style={styles.currency}>₹</Text>

                                    <TextInput
                                        value={maxAmount}
                                        editable={minAmount ? true : false}
                                        onChangeText={(text) => {
                                            if (minAmount > text) {
                                                setErrorMsg("Min Amount should not be greater than max")
                                            } else {
                                                setErrorMsg("")
                                            }
                                            const cleanText = text.replace(/[^0-9]/g, "");
                                            setMaxAmount(cleanText)
                                            setMaxPaidValue(cleanText)
                                        }}
                                        placeholder="Max"
                                        placeholderTextColor="#999"
                                        keyboardType="numeric"
                                        style={styles.amountInput}
                                    />
                                </View>
                            </View>
                            {errorMsg && <ErrorMessage message={errorMsg} type="error" />}

                        </>
                    )}


                    {/* ================= RECEIPT ================= */}

                    {isReceipt && (
                        <>

                            <Text style={styles.sectionTitle}>
                                System Filter
                            </Text>

                            <FilterDropdown
                                title="Period"
                                options={
                                    filters?.period
                                }
                                value={
                                    selectedFilters?.period
                                }
                                onChange={(value) =>
                                    setSelectedFilters(prev => ({
                                        ...prev,
                                        period: value
                                    }))
                                }
                            />


                            <FilterDropdown
                                title="Payment Mode"
                                options={
                                    filters?.paymentMode
                                }
                                value={
                                    selectedFilters?.paymentMode
                                }
                                multiple
                                onChange={(value) =>
                                    setSelectedFilters(prev => ({
                                        ...prev,
                                        paymentMode: value
                                    }))
                                }
                            />


                            <FilterDropdown
                                title="Invoice Type"
                                options={
                                    filters?.invoiceType
                                }
                                value={
                                    selectedFilters?.invoiceType
                                }
                                onChange={(value) =>
                                    setSelectedFilters(prev => ({
                                        ...prev,
                                        invoiceType: value
                                    }))
                                }
                            />


                            <FilterDropdown
                                title="Collected By"
                                options={
                                    filters?.collectedBy
                                }
                                value={
                                    selectedFilters?.collectedBy
                                }
                                multiple
                                onChange={(value) =>
                                    setSelectedFilters(prev => ({
                                        ...prev,
                                        collectedBy: value
                                    }))
                                }
                            />

                        </>
                    )}


                    {/* ================= TENANT ================= */}

                    {isTenant && (
                        <>

                            <Text style={styles.label}> Tenants</Text>

                            <FilterDropdown
                                options={tenantList}
                                value={selectedTenants}
                                onSelect={(value) => {
                                    setSelectedTenants(value)
                                    setTenantValue(value?.name)
                                }}
                                placeholder="Select Tenants"
                            />

                            <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
                                System Filter
                            </Text>

                            <Text style={styles.label}>Tenant Status</Text>

                            <FilterDropdown
                                options={filters?.tenantStatus}
                                value={selectedStatus}
                                multiSelect={true}
                                onSelect={(value) => {
                                    console.log("dropdow", value.id)
                                    setSelectedStatus(value)
                                    const statusIds = value.map(item => item.id);

                                    setSelectedTenantStatus(statusIds);

                                }}
                                placeholder="Select Status"
                            />

                            <Text style={styles.label}>Period</Text>

                            <FilterDropdown
                                options={filters?.period}
                                value={selectedPeriod}
                                onSelect={(value) => {
                                    console.log("Perioddropdow", value.id)
                                    setSelectedPeriod(value)
                                    setSelectedMonth(value?.id)
                                }}
                                placeholder="Select "
                            />

                            <Text style={styles.label}>Sharing Type</Text>

                            <FilterDropdown
                                options={filters?.sharingType}
                                value={selectedSharing}
                                multiSelect={true}
                                onSelect={(value) => {
                                    setSelectedSharing(value)
                                    const statusIds = value.map(item => item.id);
                                    setSelectedSharingValue(statusIds)
                                }}
                                placeholder="Select Sharing type"
                            />

                            <Text style={styles.label}>Floor</Text>

                            <FilterDropdown
                                options={filters?.floor}
                                value={selectedFloor}
                                multiSelect={true}
                                onSelect={(value) => {
                                    setSelectedFloor(value)
                                    // const statusIds = value.map(item => item.id);
                                    // setSelectedSharingValue(value)

                                    const floorIds = value.map(item => item.id);

                                    setSelectedRoom(prev =>
                                        prev?.filter(room => floorIds.includes(room.floorId))
                                    );
                                    const statusIds = value.map(item => item.id);
                                    setSelectedFloorValue(statusIds)
                                }}
                                placeholder="Select Floor"
                            />

                            <Text style={styles.label}>Room</Text>

                            <FilterDropdown
                                options={filteredRooms}
                                value={selectedRoom}
                                multiSelect={true}
                                onSelect={(value) => {
                                    setSelectedRoom(value)
                                    const statusIds = value.map(item => item.id);
                                    setSelectedRoomValue(value)
                                }}
                                placeholder="Select Room"
                            />







                        </>
                    )}

                    {isExpense && (
                        <>


                            <Text style={styles.sectionTitle}>
                                System Filter
                            </Text>

                            <Text style={styles.label}>Category</Text>

                            <FilterDropdown
                                options={filters?.category}
                                value={category}
                                multiSelect={true}
                                onSelect={(value) => {
                                    console.log("dropdow", value.categoryId)
                                    setCategory(value)
                                    const statusIds = value.map(item => item?.categoryId);

                                    setCategoryValue(statusIds);

                                }}
                                placeholder="Select Category"
                            />

                            <Text style={styles.label}>SubCategory</Text>

                            <FilterDropdown
                                options={filteredSubCategory}
                                value={subCategory}
                                multiSelect={true}
                                onSelect={(value) => {
                                    setSubcategory(value)
                                    const statusIds = value.map(item => item?.subCategoryId);
                                    setSubCategoryValue(statusIds)
                                }}
                                placeholder="Select subcategory type"
                            />

                            <Text style={styles.label}>Period</Text>

                            <FilterDropdown
                                options={filters?.period}
                                value={selectedPeriod}
                                onSelect={(value) => {
                                    console.log("Perioddropdow", value.id)
                                    setSelectedPeriod(value)
                                    setSelectedMonth(value?.id)
                                }}
                                placeholder="Select "
                            />

                            <Text style={styles.label}>Payment Mode</Text>

                            <FilterDropdown
                                options={filters?.paymentMode}
                                value={selectedMode}
                                multiSelect={true}
                                onSelect={(value) => {
                                    setSelectedMode(value)
                                    const statusIds = value.map(item => item.id);
                                    setPaymentModeValue(value)
                                }}
                                placeholder="Select mode"
                            />

                            <Text style={styles.label}>Paid to</Text>

                            <FilterDropdown
                                options={filters?.vendors}
                                value={vendor}
                                onSelect={(value) => {
                                    setVendor(value)
                                    // const statusIds = value.map(item => item.id);
                                    setVendorValue(value)

                                    // const floorIds = value.map(item => item.id);

                                    // setSelectedRoom(prev =>
                                    //     prev?.filter(room => floorIds.includes(room.floorId))
                                    // );
                                    // const statusIds = value.map(item => item.id);
                                    // setSelectedFloorValue(statusIds)
                                }}
                                placeholder="Select vendor"
                            />

                            <Text style={styles.label}>Created by</Text>

                            <FilterDropdown
                                options={filters?.createdBy}
                                value={selectedCreatedBy}
                                multiSelect={true}
                                onSelect={(value) => {
                                    setSelectedCreatedBy(value)
                                    const statusIds = value.map(item => item?.userId);
                                    setCreatedByValue(statusIds)
                                }}
                                placeholder="Select createdby"
                            />

                        </>
                    )}

                </ScrollView>



                <View style={styles.bottomButtons}>

                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={() => {
                            setSelectedTenants("")
                            setSelectedFloor(null)
                            setSelectedRoom(null)
                            setSelectedSharing(null)
                            setSelectedStatus(null)
                            setSelectedPeriod(null)
                            setMaxAmount("")
                            setMinAmount("")
                            setCategory([])
                            setSubcategory([])
                            setVendor("")
                            setSelectedMode(null)
                            onReset()
                        }}
                    >
                        <Text style={styles.resetText}>
                            Reset
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={onApply}
                    >
                        <Text style={styles.applyText}>
                            Apply
                        </Text>
                    </TouchableOpacity>

                </View>





                {/* {error ? (
                    <ErrorMessage message={error} type="error" />
                ) : null}

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={[
                            styles.resetBtn,
                            (!selectedValues || selectedValues.length === 0) && styles.resetDisabled
                        ]}
                        disabled={!selectedValues || selectedValues.length === 0}
                        onPress={onReset}
                    >
                        <Text style={{ color: "#1D4ED8" }}>Reset</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() => {
                            if (!selectedValues || selectedValues.length === 0) {
                                setError("Please select at least one option");
                                return;
                            }

                            setError("");
                            onApply();
                        }}
                    >
                        <Text style={{ color: "#fff" }}>Apply</Text>
                    </TouchableOpacity>
                </View> */}
            </Animated.View>
            {showCalendar && (
                <View style={styles.dateOverlay}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setShowCalendar(false)}
                    />

                    <View style={styles.datePickerBox}>
                        <Calendar
                            markingType="period"
                            minDate={
                                selecting === "end" && startDate
                                    ? startDate
                                    : undefined
                            }
                            markedDates={getMarkedDates()}
                            onDayPress={(day) => {

                                if (selecting === "start") {
                                    setStartDate(day.dateString);
                                    setEndDate(null);
                                    setStartDateValue(day.dateString)

                                    // Same calendar remains open
                                    setSelecting("end");

                                } else {
                                    if (
                                        startDate &&
                                        day.dateString >= startDate
                                    ) {
                                        setEndDate(day.dateString);
                                        setEndDateValue((day.dateString))

                                        // Close the ONE calendar
                                        setShowCalendar(false);
                                    }
                                }

                            }}
                        />
                    </View>
                </View>
            )}
        </>
    );
}

const styles = {
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    sheet: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 20,
        maxHeight: "95%",
    },
    dragIndicator: {
        width: 40,
        height: 5,
        backgroundColor: "#ccc",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 15,
    },

    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 15,
        // borderBottomWidth: 1,
        // borderBottomColor: "#E5E7EB",
    },

    headerTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Semibold",
        color: "#111827",
    },

    closeButton: {
        fontSize: 28,
        color: "#EF4444",
        fontFamily: "Gilroy-Regular",
    },

    sectionTitle: {
        fontSize: 15,
        fontFamily: "Gilroy-Bold",
        color: "#111827",

    },

    /* DROPDOWN */

    dropdownContainer: {
        marginBottom: 13,
    },

    filterLabel: {
        fontSize: 12,
        fontFamily: "Gilroy-Medium",
        color: "#475569",
        marginBottom: 6,
    },

    dropdownButton: {
        height: 42,
        borderWidth: 1,
        borderColor: "#D9DEE7",
        borderRadius: 7,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
    },

    dropdownText: {
        flex: 1,
        fontSize: 13,
        fontFamily: "Gilroy-Medium",
        color: "#1E293B",
    },

    placeholderText: {
        color: "#94A3B8",
    },

    arrow: {
        fontSize: 17,
        color: "#475569",
        marginLeft: 8,
    },

    dropdownMenu: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 7,
        backgroundColor: "#FFFFFF",
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        overflow: "hidden",
    },

    dropdownItem: {
        minHeight: 40,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    dropdownItemSelected: {
        backgroundColor: "#F1F5FF",
    },

    dropdownItemText: {
        fontSize: 13,
        fontFamily: "Gilroy-Medium",
        color: "#334155",
    },

    dropdownItemTextSelected: {
        color: "#1E45E1",
        fontFamily: "Gilroy-Semibold",
    },

    check: {
        fontSize: 16,
        color: "#1E45E1",
        fontFamily: "Gilroy-Bold",
    },

    noOptions: {
        padding: 15,
        textAlign: "center",
        fontSize: 13,
        color: "#94A3B8",
    },



    moreFilter: {
        fontSize: 13,
        fontFamily: "Gilroy-Semibold",
        color: "#334155",
        marginTop: 12,
        marginBottom: 5,
    },

    /* BOTTOM BUTTONS */

    bottomButtons: {
        flexDirection: "row",
        gap: 10,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        backgroundColor: "#FFFFFF",
    },

    resetButton: {
        flex: 1,
        height: 42,
        borderWidth: 1,
        borderColor: "#D9DEE7",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    resetText: {
        fontSize: 14,
        fontFamily: "Gilroy-Semibold",
        color: "#334155",
    },

    applyButton: {
        flex: 1,
        height: 42,
        borderRadius: 8,
        backgroundColor: "#1E45E1",
        alignItems: "center",
        justifyContent: "center",
    },

    applyText: {
        fontSize: 14,
        fontFamily: "Gilroy-Semibold",
        color: "#FFFFFF",
    },

    buttons: {
        flexDirection: "row",
        marginTop: 20,
    },

    resetBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#EEF2FF",
        marginRight: 10,
        alignItems: "center",
    },

    applyBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#1D4ED8",
        alignItems: "center",
    },
    errorText: {
        color: "#DC2626",
        fontSize: 13,
        marginTop: 10,
        marginBottom: 5
    },

    resetDisabled: {
        backgroundColor: "#E5E7EB"
    },
    label: {
        fontSize: 14, fontFamily: 'Gilroy-Medium', marginTop: 16, marginBottom: 10
    },
    dateField: {
        flex: 1, borderColor: "#E5E7EB", borderWidth: 1, borderRadius: 8, flexDirection: 'row',
        alignItems: 'center', justifyContent: "space-between", paddingVertical: 12,
        paddingHorizontal: 10
    },
    dateOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center", zIndex: 9999
    },

    datePickerBox: {
        backgroundColor: "#fff",
        width: "90%",
        alignSelf: "center",
        borderRadius: 20,
        padding: 10,
        marginBottom: 120,
    },
    amountRow: {
        flexDirection: "row",
        marginTop: 8
    },

    amountInputContainer: {
        flex: 1,
        height: 42,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 9,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
    },

    currency: {
        fontSize: 16,
        color: "#999",
        marginRight: 6,
    },

    amountInput: {
        flex: 1,
        fontSize: 16,
        color: "#222",
        paddingVertical: 0,
    },

};