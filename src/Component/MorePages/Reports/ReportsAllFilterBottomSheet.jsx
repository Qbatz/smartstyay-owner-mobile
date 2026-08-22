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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import FilterDropdown from "./FilterDropdown"


const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ReportsAllFilterBottomSheet({
    visible,
    reportType,
    filters,
    selectedFilters,
    onClose,
    onApply,
    onReset,
    setSelectedSharingValue,
    setSelectedMonth,
    setSelectedTenantStatus,
    setSelectedFloorValue,
    setSelectedRoomValue,
    tenantList,
    setTenantValue
}) {

    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const [selectedTenants, setSelectedTenants] = useState("")
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedSharing, setSelectedSharing] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null)

    const [error, setError] = React.useState("");

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

                            <Text style={styles.sectionTitle}>
                                System Filter
                            </Text>

                            <FilterDropdown
                                title="Bill Status"
                                options={
                                    filters?.paymentStatus
                                }
                                value={
                                    selectedFilters?.paymentStatus
                                }
                                multiple
                                onChange={(value) =>
                                    setSelectedFilters(prev => ({
                                        ...prev,
                                        paymentStatus: value
                                    }))
                                }
                            />


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
                                title="Type"
                                options={
                                    filters?.invoiceTypes
                                }
                                value={
                                    selectedFilters?.invoiceTypes
                                }
                                multiple
                                onChange={(value) =>
                                    setSelectedFilters(prev => ({
                                        ...prev,
                                        invoiceTypes: value
                                    }))
                                }
                            />


                            <FilterDropdown
                                title="Created By"
                                options={
                                    filters?.createdBy
                                }
                                value={
                                    selectedFilters?.createdBy
                                }
                                multiple
                                onChange={(value) =>
                                    setSelectedFilters(prev => ({
                                        ...prev,
                                        createdBy: value
                                    }))
                                }
                            />


                            <Text style={styles.moreFilter}>
                                More Filters
                            </Text>

                            <AmountRange
                                selectedFilters={selectedFilters}
                                setSelectedFilters={
                                    setSelectedFilters
                                }
                            />

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

                            <Text style={styles.sectionTitle}>
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
        marginTop: 18,
        marginBottom: 8,
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

    /* AMOUNT */

    amountContainer: {
        marginTop: 8,
        marginBottom: 20,
    },

    amountRow: {
        flexDirection: "row",
        gap: 8,
    },

    amountInput: {
        flex: 1,
        height: 42,
        borderWidth: 1,
        borderColor: "#D9DEE7",
        borderRadius: 7,
        paddingHorizontal: 12,
        fontSize: 13,
        fontFamily: "Gilroy-Medium",
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
    }
};