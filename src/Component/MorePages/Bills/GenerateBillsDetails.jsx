import React, { useContext, useEffect, useRef, useState, } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Animated,
    PanResponder,
    Keyboard,
    TouchableWithoutFeedback,
    useWindowDimensions,
    Image, Modal
} from "react-native";
import { BillContext } from "../../../Context/BillsContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EditIcon from "../../../Assets/Images/pencil.png";
import DeleteIcon from "../../../Assets/Images/trash.png"
import SuccessModal from "../../../ToastFile/ToastPage";
import { useHasPermission } from "../../../Utils/useHasPermission";
import ValidatedInput from "../ValidatedInput"


const GenerateBillsSheet = ({
    visible,
    onClose,
    invoices = [],
    onGenerate,
}) => {
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();


    const { loading, GetRecurringInvoicesForReview,
        availablerecurringInvoices, UpdateRecurringBillItem, DeleteRecurringBillItem,
        AddRecurringBillItem } = useContext(BillContext)
    const { activeHostelId } = useContext(CommonContexts);
    const sheetY = useRef(new Animated.Value(0)).current;

    const {
        canWriteModule: canWriteInvoice,
        canReadModule: canReadInvoice,
        canUpdateModule: canUpdateInvoice,
        canDeleteModule: canDeleteInvoice,
    } = useHasPermission("Bills")

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");

    const [adjustments, setAdjustments] = useState([]);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [editingRow, setEditingRow] = useState(null);

    const [draftType, setDraftType] = useState("");
    const [draftAmount, setDraftAmount] = useState("")
    const [isSaving, setIsSaving] = useState(false);
    const [deleteBillRow, setDeleteBillRow] = useState(false);
    const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);

    // =====================================================
    // SHEET OPEN ANIMATION
    // =====================================================

    useEffect(() => {
        if (!visible) return;

        sheetY.setValue(height);

        Animated.spring(sheetY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 22,
            stiffness: 180,
            mass: 0.8,
        }).start();
    }, [visible, height]);


    // =====================================================
    // UPDATE INVOICE ITEMS
    // =====================================================

    useEffect(() => {
        if (!visible) return;

        const selectedInvoice = invoices?.[0];

        const apiItems =
            selectedInvoice?.invoiceItems || [];

        setInvoiceItems(
            apiItems.map((item) => ({
                id: `api-${item.itemId}`,
                itemId: item.itemId,
                type: item.itemName || "",
                amount: Number(item.amount || 0),
                source: "api",
            }))
        );

        setEditingRow(null);
        setDraftType("");
        setDraftAmount("");
    }, [visible, invoices])






    useEffect(() => {
        const keyboardShow = Keyboard.addListener(
            "keyboardDidShow",
            () => {
                Animated.spring(sheetY, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 180,
                }).start();
            }
        );

        const keyboardHide = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                Animated.spring(sheetY, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 180,
                }).start();
            }
        );

        return () => {
            keyboardShow.remove();
            keyboardHide.remove();
        };
    }, []);


    // =====================================================
    // SHEET SWIPE
    // =====================================================

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => {
                return Math.abs(gesture.dy) > 5;
            },

            onPanResponderMove: (_, gesture) => {
                // Only allow downward movement.
                // Sheet cannot move above its 85% top boundary.
                if (gesture.dy > 0) {
                    sheetY.setValue(gesture.dy);
                } else {
                    sheetY.setValue(0);
                }
            },

            onPanResponderRelease: (_, gesture) => {
                // Swipe down enough -> close
                if (
                    gesture.dy > 120 ||
                    gesture.vy > 1.2
                ) {
                    Animated.timing(sheetY, {
                        toValue: height,
                        duration: 220,
                        useNativeDriver: true,
                    }).start(() => {
                        sheetY.setValue(0);
                        onClose?.();
                    });

                    return;
                }

                // Small swipe -> return to top position
                Animated.spring(sheetY, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 180,
                    mass: 0.8,
                }).start();
            },
        })
    ).current;


    const getApplicableDays = (invoice) => {
        if (
            !invoice?.invoiceStartDate ||
            !invoice?.invoiceEndDate
        ) {
            return 0;
        }

        const [startDay, startMonth, startYear] =
            invoice.invoiceStartDate.split("/").map(Number);

        const [endDay, endMonth, endYear] =
            invoice.invoiceEndDate.split("/").map(Number);

        const startDate = new Date(
            startYear,
            startMonth - 1,
            startDay
        );

        const endDate = new Date(
            endYear,
            endMonth - 1,
            endDay
        );

        const diff =
            endDate.getTime() -
            startDate.getTime();

        return Math.floor(
            diff / (1000 * 60 * 60 * 24)
        ) + 1;
    };


    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose = () => {
        Keyboard.dismiss();

        Animated.timing(sheetY, {
            toValue: height,
            duration: 220,
            useNativeDriver: true,
        }).start(() => {
            sheetY.setValue(0);
            onClose?.();
        });
    };


    // =====================================================
    // ADD
    // =====================================================

    const handleAdd = () => {
        setEditingRow({
            mode: "add",
            id: Date.now(),
        });

        setDraftType("");
        setDraftAmount("");
    };

    const handleEditItem = (item) => {
        setEditingRow({
            mode: "edit",
            id: item.id,
            source: item.source,
        });

        setDraftType(item.type);
        setDraftAmount(String(item.amount ?? ""));
    }




    const isEditingExisting =
        editingRow?.mode === "edit";

    const isAddingNew =
        editingRow?.mode === "add";


    const isValidAmount = (value) => {
        const amount = String(value || "").trim();

        if (!amount) return false;

        if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(amount)) {
            return false;
        }

        if (/^0\d+/.test(amount)) {
            return false;
        }

        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return false;
        }

        return true;
    };

    // const canSave =
    //     !isSaving &&
    //     (
    //         isEditingExisting
    //             ? isValidAmount(draftAmount)
    //             : !!draftType.trim() &&
    //             isValidAmount(draftAmount)
    //     )

    const editingItem = isEditingExisting
        ? invoiceItems.find(
            (item) => item.id === editingRow?.id
        )
        : null;

    const isEditingRent =
        isEditingExisting &&
        String(editingItem?.type || "")
            .trim()
            .toUpperCase() === "RENT";

    const canSave =
        !isSaving &&
        canUpdateInvoice &&
        isValidAmount(draftAmount) &&
        (
            !isEditingExisting ||
            isEditingRent ||
            !!draftType.trim()
        );



    const handleSaveRow = async () => {

        if (isSaving) {
            return;
        }

        if (editingRow?.mode === "edit" && !canUpdateInvoice) {
            return;
        }

        if (editingRow?.mode === "add" && !canUpdateInvoice) {
            return;
        }

        if (!isValidAmount(draftAmount)) {
            return;
        }

        setIsSaving(true);

        try {

            // =========================================
            // EDIT EXISTING ITEM
            // =========================================

            if (editingRow?.mode === "edit") {

                const item = invoiceItems.find(
                    (item) => item.id === editingRow.id
                );

                if (!item) {
                    return;
                }

                const isRentItem =
                    String(item?.type || "")
                        .trim()
                        .toUpperCase() === "RENT";

                const amount = Number(draftAmount);


                // API ITEM
                if (item.source === "api") {

                    const selectedInvoice = invoices?.[0];

                    const invoiceId =
                        selectedInvoice?.invoiceId ||
                        selectedInvoice?.id;

                    const itemId = item.itemId;

                    if (!invoiceId || !itemId) {
                        console.log(
                            "Missing invoiceId / itemId",
                            {
                                invoiceId,
                                itemId,
                            }
                        );

                        return;
                    }

                    const result =
                        await UpdateRecurringBillItem({
                            hostelId: activeHostelId,
                            invoiceId,
                            itemId,

                            // RENT → existing name
                            // Others → edited name
                            name: isRentItem
                                ? item.type
                                : draftType.trim(),

                            draftAmount: amount,
                        });


                    console.log(
                        "UPDATE RECURRING ITEM RESULT:",
                        result
                    );

                    if (!result?.success) {
                        setModalType("error");

                        setModalMessage(
                            result?.message ||
                            "Failed to update recurring amount"
                        );

                        setShowSuccessModal(true);

                        setTimeout(() => {
                            setShowSuccessModal(false);
                        }, 1500);

                        return;
                    }

                    const refreshResult =
                        await GetRecurringInvoicesForReview(
                            activeHostelId
                        );

                    const updatedInvoice =
                        refreshResult?.data?.invoicesList?.find(
                            (invoice) =>
                                Number(invoice?.invoiceId) ===
                                Number(invoiceId)
                        );

                    if (updatedInvoice?.invoiceItems) {
                        setInvoiceItems(
                            updatedInvoice.invoiceItems.map(
                                (apiItem) => ({
                                    id: `api-${apiItem.itemId}`,
                                    itemId: apiItem.itemId,
                                    type:
                                        apiItem.itemName || "",
                                    amount:
                                        Number(
                                            apiItem.amount || 0
                                        ),
                                    source: "api",
                                })
                            )
                        );
                    }

                    setModalType("success");

                    setModalMessage(
                        "Recurring amount updated successfully"
                    );

                    setShowSuccessModal(true);

                    setTimeout(() => {
                        setShowSuccessModal(false);
                    }, 1500);
                }

                // Local item update
                setInvoiceItems((prev) =>
                    prev.map((item) => {

                        if (item.id !== editingRow.id) {
                            return item;
                        }

                        return {
                            ...item,

                            type:
                                String(item.type || "")
                                    .trim()
                                    .toUpperCase() === "RENT"
                                    ? item.type
                                    : draftType.trim(),

                            amount,
                        };
                    })
                );

                setEditingRow(null);
                setDraftType("");
                setDraftAmount("");

                Keyboard.dismiss();

                return;
            }


            // =========================================
            // ADD NEW ITEM
            // =========================================

            if (
                !draftType.trim() ||
                !isValidAmount(draftAmount)
            ) {
                return;
            }

            const selectedInvoice = invoices?.[0];

            const invoiceId =
                selectedInvoice?.invoiceId ||
                selectedInvoice?.id;

            if (!activeHostelId || !invoiceId) {

                setModalType("error");

                setModalMessage(
                    "Invoice details are missing"
                );

                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 1500);

                return;
            }

            const amount = Number(draftAmount);

            // =========================================
            // ADD API
            // =========================================

            const result = await AddRecurringBillItem({
                hostelId: activeHostelId,
                invoiceId,
                name: draftType.trim(),
                amount,
            });

            console.log(
                "ADD RECURRING ITEM RESULT:",
                result
            );

            if (!result?.success) {

                setModalType("error");

                setModalMessage(
                    result?.message ||
                    "Failed to add recurring item"
                );

                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 1500);

                return;
            }

            // =========================================
            // REFRESH
            // =========================================

            const refreshResult =
                await GetRecurringInvoicesForReview(
                    activeHostelId
                );

            const updatedInvoice =
                refreshResult?.data?.invoicesList?.find(
                    (invoice) =>
                        Number(invoice?.invoiceId) ===
                        Number(invoiceId)
                );

            if (updatedInvoice?.invoiceItems) {

                setInvoiceItems(
                    updatedInvoice.invoiceItems.map(
                        (apiItem) => ({
                            id: `api-${apiItem.itemId}`,
                            itemId: apiItem.itemId,
                            type:
                                apiItem.itemName || "",
                            amount:
                                Number(
                                    apiItem.amount || 0
                                ),
                            source: "api",
                        })
                    )
                );
            }

            setEditingRow(null);
            setDraftType("");
            setDraftAmount("");

            Keyboard.dismiss();

            setModalType("success");

            setModalMessage(
                "Recurring item added successfully"
            );

            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 1500);

        } finally {

            // Unlock only after API completes
            setIsSaving(false);
        }
    };

    const handleRemoveItem = (item) => {
        if (!item) return;

        // Store which item user wants to delete
        setSelectedDeleteItem(item);

        // Open custom delete modal
        setDeleteBillRow(true);
    }


    const confirmDeleteItem = async (item) => {
        if (!item) return;

        // ==========================================
        // LOCAL ITEM
        // ==========================================

        if (item.source === "local") {
            setInvoiceItems((prev) =>
                prev.filter((row) => row.id !== item.id)
            );

            if (editingRow?.id === item.id) {
                setEditingRow(null);
                setDraftType("");
                setDraftAmount("");
            }

            // Close delete popup
            setSelectedDeleteItem(null);
            setDeleteBillRow(false);

            return;
        }

        // ==========================================
        // API ITEM
        // ==========================================

        if (item.source === "api") {
            if (!canDeleteInvoice) {
                return;
            }
            const selectedInvoice = invoices?.[0];

            const invoiceId =
                selectedInvoice?.invoiceId ||
                selectedInvoice?.id;

            const itemId = item.itemId;

            if (!activeHostelId || !invoiceId || !itemId) {
                console.log("Missing delete params:", {
                    activeHostelId,
                    invoiceId,
                    itemId,
                });

                return;
            }

            const result = await DeleteRecurringBillItem({
                hostelId: activeHostelId,
                invoiceId,
                itemId,
            });

            console.log(
                "DELETE RECURRING ITEM RESULT:",
                result
            );

            // ==========================================
            // DELETE FAILED
            // ==========================================

            if (!result?.success) {
                setModalType("error");

                setModalMessage(
                    result?.message ||
                    "Failed to delete recurring item"
                );

                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 1500);

                return;
            }

            // ==========================================
            // DELETE SUCCESS
            // ==========================================

            setInvoiceItems((prev) =>
                prev.filter((row) => row.id !== item.id)
            );

            if (editingRow?.id === item.id) {
                setEditingRow(null);
                setDraftType("");
                setDraftAmount("");
            }

            // Refresh API data
            await GetRecurringInvoicesForReview(
                activeHostelId
            );

            // Close delete popup
            setSelectedDeleteItem(null);
            setDeleteBillRow(false);
            // Success message
            setModalType("success");
            setModalMessage("Item deleted successfully"
            );

            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 1500);
        }
    };


    // =====================================================
    // INVOICE AMOUNT
    // =====================================================

    const getInvoiceAmount = (invoice) => {
        return Number(invoice?.invoiceAmount || 0);
    };

    const getRentAmount = (invoice) => {
        const rentItem = invoice?.invoiceItems?.find(
            (item) =>
                String(item?.itemName || "").toUpperCase() === "RENT"
        );

        return Number(rentItem?.amount || 0);
    };

    const getCustomerName = (invoice) => {
        return (
            invoice?.customerInfo?.fullName ||
            `${invoice?.customerInfo?.firstName || ""} ${invoice?.customerInfo?.lastName || ""
                }`.trim() ||
            "Tenant"
        );
    };

    const getInitials = (invoice) => {
        const customerInfo = invoice?.customerInfo;

        if (customerInfo?.initials) {
            return customerInfo.initials.toUpperCase();
        }

        const name = getCustomerName(invoice);

        return name
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const getRoomDetails = (invoice) => {
        const stayInfo = invoice?.stayInfo;

        return [
            stayInfo?.floorName,
            stayInfo?.roomName,
            stayInfo?.bedName,
        ]
            .filter(Boolean)
            .join(" / ");
    };

    const getInvoicePeriod = (invoice) => {
        if (!invoice?.invoiceStartDate) {
            return "";
        }

        return `${invoice.invoiceStartDate} - ${invoice?.invoiceEndDate || ""
            }`;
    };

    // const getInvoiceAmount = (invoice) => {
    //     return Number(
    //         invoice?.amount ||
    //         invoice?.totalAmount ||
    //         invoice?.finalAmount ||
    //         0
    //     );
    // };


    // const totalInvoiceAmount = invoices.reduce(
    //     (sum, invoice) =>
    //         sum + getInvoiceAmount(invoice),
    //     0
    // );


    // const adjustmentTotal = adjustments.reduce(
    //     (sum, item) =>
    //         sum + Number(item.amount || 0),
    //     0
    // );


    const finalTotal = invoiceItems.reduce(
        (sum, item) =>
            sum + Number(item.amount || 0),
        0
    );


    // =====================================================
    // GENERATE
    // =====================================================

    const handleGenerate = () => {
        const payload = {
            invoiceIds: invoices.map(
                (item) =>
                    item.id ||
                    item.invoiceId
            ),

            adjustments: adjustments.map(
                (item) => ({
                    type: item.type,
                    amount: Number(
                        item.amount || 0
                    ),
                })
            ),
        };

        console.log(
            "GENERATE BILL PAYLOAD:",
            payload
        );

        onGenerate?.(payload);
    };


    // =====================================================
    // HIDE
    // =====================================================

    if (!visible) {
        return null;
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <>

            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={modalMessage}
                type={modalType}
            />

            <View style={styles.sheetOverlay}>

                {/* BACKDROP */}

                <TouchableWithoutFeedback
                    onPress={handleClose}
                >
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>


                {/* BOTTOM SHEET */}

                <Animated.View
                    style={[
                        styles.sheet,
                        {
                            height:
                                height * 0.85,

                            maxHeight:
                                height * 0.85,

                            transform: [
                                {
                                    translateY:
                                        sheetY,
                                },
                            ],
                        },
                    ]}
                    {...panResponder.panHandlers}
                >

                    {/* HANDLE */}

                    <View style={styles.handleArea}>
                        <View
                            style={
                                styles.sheetHandle
                            }
                        />
                    </View>


                    {/* HEADER */}

                    <View style={styles.header}>

                        <View>
                            <Text
                                style={
                                    styles.headerTitle
                                }
                            >
                                Bill Details
                            </Text>

                            {/* <Text
                            style={
                                styles.headerSubtitle
                            }
                        >
                            Review before generating
                        </Text> */}
                        </View>


                        <View
                            style={
                                styles.readyBadge
                            }
                        >
                            <Text
                                style={
                                    styles.readyBadgeText
                                }
                            >
                                {/* {String(
                                invoices.length
                            ).padStart(2, "0")}{" "} */}
                                Recurring
                            </Text>
                        </View>

                    </View>


                    {/* CONTENT */}

                    <ScrollView
                        showsVerticalScrollIndicator={
                            false
                        }
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            paddingBottom:
                                120 +
                                insets.bottom,
                        }}
                    >

                        {/* TENANTS */}

                        {/* TENANTS */}

                        {invoices.map((invoice, index) => {
                            const amount = getInvoiceAmount(invoice);
                            const customerName = getCustomerName(invoice);
                            const initials = getInitials(invoice);
                            const profilePic = invoice?.customerInfo?.profilePic;

                            const roomDetails = getRoomDetails(invoice);

                            return (
                                <View
                                    key={
                                        invoice?.invoiceId ||
                                        invoice?.id ||
                                        index
                                    }
                                    style={[
                                        styles.tenantCard,
                                        index > 0 && {
                                            marginTop: 10,
                                        },
                                    ]}
                                >

                                    <View style={styles.avatar}>
                                        {profilePic ? (
                                            <Image
                                                source={{
                                                    uri: profilePic,
                                                }}
                                                style={styles.avatarImage}
                                            />
                                        ) : (
                                            <Text style={styles.avatarText}>
                                                {initials}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.tenantInfo}>

                                        <Text
                                            style={styles.tenantName}
                                            numberOfLines={1}
                                        >
                                            {customerName}
                                        </Text>

                                        <Text
                                            style={styles.tenantDetails}
                                            numberOfLines={1}
                                        >
                                            {roomDetails || "--"}
                                            {" · "}
                                            Rent
                                            {" · "}
                                            {invoice?.invoiceStartDate || ""}
                                        </Text>

                                    </View>



                                </View>
                            )
                        })}

                        {/* CALCULATION CARD */}

                        <View
                            style={
                                styles.calculationCard
                            }
                        >

                            {/* CALCULATION HEADER */}

                            <View style={styles.calculationHeader}>

                                <Text style={styles.calculationTitle}>
                                    CALCULATION BREAKDOWN
                                </Text>

                                {invoices?.[0]?.isEdited && (
                                    <View style={styles.manualBadge}>
                                        <View style={styles.manualDot} />

                                        <Text style={styles.manualText}>
                                            Manually Edited
                                        </Text>
                                    </View>
                                )}

                            </View>


                            {/* =========================================
    INVOICE ITEMS
========================================= */}

                            {invoiceItems.map((item) => {

                                const isEditing =
                                    editingRow?.mode === "edit" &&
                                    editingRow?.id === item.id;

                                const isRentItem =
                                    String(item?.type || "").trim().toUpperCase() === "RENT";

                                return (
                                    <View
                                        key={item.id}
                                        style={styles.itemRow}
                                    >

                                        {/* DESCRIPTION */}

                                        <View style={styles.itemNameContainer}>

                                            <Text
                                                style={styles.breakdownLabel}
                                                numberOfLines={1}
                                            >
                                                {item.type}
                                            </Text>

                                        </View>


                                        {/* RIGHT SIDE */}

                                        <View style={styles.itemRightContainer}>

                                            {/* EDIT */}



                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() =>
                                                    handleEditItem(item)
                                                }
                                                disabled={!canUpdateInvoice}
                                                style={[
                                                    styles.iconButton,
                                                    !canUpdateInvoice && styles.permissionDisabledIcon,
                                                ]}
                                            >
                                                <Image
                                                    source={EditIcon}
                                                    style={[
                                                        styles.actionIcon,
                                                        !canUpdateInvoice && styles.permissionDisabledIconImage,
                                                    ]}
                                                />
                                            </TouchableOpacity>




                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => {
                                                    if (isRentItem) return;

                                                    handleRemoveItem(item);
                                                }}
                                                disabled={
                                                    isRentItem ||
                                                    !canDeleteInvoice
                                                }
                                                style={[
                                                    styles.iconButton,
                                                    (isRentItem || !canDeleteInvoice) &&
                                                    styles.permissionDisabledIcon,
                                                ]}
                                            >
                                                <Image
                                                    source={DeleteIcon}
                                                    style={[
                                                        styles.actionIcon,
                                                        (isRentItem || !canDeleteInvoice) &&
                                                        styles.permissionDisabledIconImage,
                                                    ]}
                                                />
                                            </TouchableOpacity>


                                            {/* AMOUNT */}

                                            {/* {isEditing ? (
                                            <TextInput
                                                value={draftAmount}
                                                onChangeText={(value) =>
                                                    setDraftAmount(
                                                        value.replace(
                                                            /[^0-9.]/g,
                                                            ""
                                                        )
                                                    )
                                                }
                                                keyboardType="numeric"
                                                style={[
                                                    styles.inlineAmountInput,
                                                    {
                                                        width: 95,
                                                    },
                                                ]}
                                                autoFocus
                                            />
                                        ) : ( */}
                                            <Text
                                                style={
                                                    styles.breakdownAmount
                                                }
                                            >
                                                ₹
                                                {Number(
                                                    item.amount || 0
                                                ).toLocaleString("en-IN")}
                                            </Text>
                                            {/* )} */}

                                        </View>

                                    </View>
                                );
                            })}


                            {/* ADD */}

                            {/* CALCULATION HEADER */}




                            {/* EDIT / ADD FORM */}

                            {editingRow && (
                                <View style={styles.editRow}>

                                    {/* DESCRIPTION */}

                                    {(
                                        editingRow.mode === "add" ||
                                        editingRow.source === "local" ||
                                        !(
                                            editingRow.mode === "edit" &&
                                            editingRow.source === "api" &&
                                            String(
                                                invoiceItems.find(
                                                    (row) => row.id === editingRow.id
                                                )?.type || ""
                                            )
                                                .trim()
                                                .toUpperCase() === "RENT"
                                        )
                                    ) && (
                                            <View style={styles.editField}>
                                                <ValidatedInput
                                                    type="name"
                                                    inputType="text"
                                                    value={draftType}
                                                    onChangeText={setDraftType}
                                                    placeholder="Enter Description"
                                                    placeholderTextColor="#A2A7B0"
                                                    style={styles.editInput}
                                                />
                                            </View>
                                        )}


                                    {/* AMOUNT */}

                                    <View
                                        style={[
                                            styles.editField,
                                            editingRow.mode === "edit" &&
                                            editingRow.source === "api" && {
                                                flex: 1,
                                            },
                                        ]}
                                    >

                                        {/* <TextInput
                                            value={draftAmount}
                                            onChangeText={(value) =>
                                                setDraftAmount(
                                                    value.replace(
                                                        /[^0-9.]/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            placeholder="₹ 0.00"
                                            placeholderTextColor="#A2A7B0"
                                            keyboardType="numeric"
                                            style={styles.editInput}
                                            autoFocus
                                        /> */}

                                        <TextInput
                                            value={draftAmount}
                                            onChangeText={(value) => {
                                                // Only numbers + decimal point
                                                let cleaned = value.replace(/[^0-9.]/g, "");

                                                // Allow only one decimal point
                                                const parts = cleaned.split(".");

                                                if (parts.length > 2) {
                                                    cleaned = `${parts[0]}.${parts.slice(1).join("")}`;
                                                }

                                                // Don't allow leading zero
                                                // 0800 -> blocked
                                                // 0123 -> blocked
                                                // 00 -> blocked
                                                if (/^0\d/.test(cleaned)) {
                                                    return;
                                                }

                                                setDraftAmount(cleaned);
                                            }}
                                            placeholder="₹ 0.00"
                                            placeholderTextColor="#A2A7B0"
                                            keyboardType="decimal-pad"
                                            style={styles.editInput}
                                            autoFocus
                                        />

                                    </View>

                                </View>
                            )}

                            {!editingRow && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={handleAdd}
                                    style={[
                                        styles.addButton,
                                        !canWriteInvoice && styles.permissionDisabledButton,
                                    ]}
                                    disabled={!canWriteInvoice}
                                >
                                    <Text
                                        style={[
                                            styles.addButtonText,
                                            !canWriteInvoice && styles.permissionDisabledText,
                                        ]}
                                    >
                                        ＋ Add
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* {!editingRow && canWriteInvoice && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={handleAdd}
                                    style={styles.addButton}
                                    disabled={isEditingExisting}
                                >
                                    <Text style={styles.addButtonText}>
                                        ＋ Add
                                    </Text>
                                </TouchableOpacity>
                            )} */}

                            {editingRow && (
                                <View
                                    style={
                                        styles.actionRow
                                    }
                                >

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setEditingRow(
                                                null
                                            );
                                            setDraftType(
                                                ""
                                            );
                                            setDraftAmount(
                                                ""
                                            );
                                        }}
                                        style={
                                            styles.closeButton
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.closeButtonText
                                            }
                                        >
                                            Close
                                        </Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        activeOpacity={0.85}
                                        onPress={handleSaveRow}
                                        disabled={!canSave}
                                        style={[
                                            styles.saveButton,
                                            !canSave &&
                                            styles.saveButtonDisabled,
                                        ]}
                                    >
                                        <Text style={styles.saveButtonText}>
                                            {isSaving ? isEditingExisting ? "Updating..." : "Saving..."
                                                : isEditingExisting ? "✓ Update" : "✓ Save"}
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            )}


                            {/* TOTAL */}

                            <View
                                style={
                                    styles.totalRow
                                }
                            >

                                <Text
                                    style={
                                        styles.totalLabel
                                    }
                                >
                                    Invoice Total
                                </Text>

                                <Text
                                    style={
                                        styles.totalAmount
                                    }
                                >
                                    ₹
                                    {Number(
                                        finalTotal
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </Text>

                            </View>

                        </View>



                        {/* <View
                        style={
                            styles.reviewCard
                        }
                    >

                        <View
                            style={
                                styles.reviewTitleRow
                            }
                        >

                            <Text
                                style={
                                    styles.warningIcon
                                }
                            >
                                ⚠
                            </Text>

                            <Text
                                style={
                                    styles.reviewTitle
                                }
                            >
                                Needs Review
                            </Text>

                        </View>


                        <Text
                            style={
                                styles.reviewText
                            }
                        >
                            Please verify the
                            calculated amount before
                            generating the invoice.
                        </Text>

                    </View> */}

                    </ScrollView>


                    {/* BOTTOM ACTION BAR */}

                    <View
                        style={[
                            styles.bottomBar,
                            {
                                paddingBottom:
                                    Math.max(
                                        insets.bottom,
                                        12
                                    ),
                            },
                        ]}
                    >

                        {/* <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleClose}
                        style={
                            styles.bottomCancel
                        }
                    >
                        <Text
                            style={
                                styles.bottomCancelText
                            }
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity> */}


                        {/* <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={
                            handleGenerate
                        }
                        style={
                            styles.generateButton
                        }
                    >
                        <Text
                            style={
                                styles.generateButtonText
                            }
                        >
                            Mark As Ready
                        </Text>
                    </TouchableOpacity> */}

                    </View>

                </Animated.View>

            </View>

            {deleteBillRow && (
                <Modal
                    transparent
                    animationType="fade"
                    visible={deleteBillRow}
                    onRequestClose={() => setDeleteBillRow(false)}
                >
                    <View style={styles.deleteOverlay}>
                        <View style={styles.deleteBox}>

                            <Text style={styles.deleteTitle}>Delete Item?</Text>
                            <Text style={styles.deleteSub}>
                                Are you sure you want to delete this Item?
                            </Text>

                            <View style={styles.deleteBtnRow}>

                                <TouchableOpacity
                                    style={styles.ReceiptcancelBtn}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setDeleteBillRow(false);
                                        setSelectedDeleteItem(null);
                                    }}
                                >
                                    <Text style={styles.cancelText}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    style={styles.receiptDeleteBtn}
                                    activeOpacity={0.8}
                                    disabled={!selectedDeleteItem || loading}
                                    onPress={() => {
                                        if (!selectedDeleteItem) return;
                                        confirmDeleteItem(selectedDeleteItem);
                                    }}
                                >
                                    <Text style={styles.deleteBtnText}>
                                        {loading ? "Deleting..." : "Delete"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
};


export default GenerateBillsSheet;


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    sheetOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.38)",
        zIndex: 9999,
        elevation: 9999,
    },


    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },


    sheet: {
        width: "100%",
        height: "85%",
        maxHeight: "85%",
        backgroundColor: "#FFFFFF",

        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,

        overflow: "hidden",
    },


    handleArea: {
        height: 42,
        alignItems: "center",
        justifyContent: "center",
    },


    sheetHandle: {
        width: 44,
        height: 5,
        borderRadius: 5,
        backgroundColor: "#C8CCD4",
    },


    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",

        paddingHorizontal: 22,
        paddingBottom: 15,

        borderBottomWidth: 1,
        borderBottomColor: "#EEF0F4",
    },


    headerTitle: {
        fontSize: 22,
        color: "#252832",
        fontFamily:
            "Gilroy-Semibold",
    },


    headerSubtitle: {
        marginTop: 3,
        fontSize: 12,
        color: "#8A91A0",
        fontFamily:
            "Gilroy-Regular",
    },


    readyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: "#FFF0D7",
    },


    readyBadgeText: {
        fontSize: 11,
        color: "#B66A00",
        fontFamily:
            "Gilroy-Medium",
    },


    tenantCard: {
        marginHorizontal: 22,
        marginTop: 15,
        padding: 13,

        borderRadius: 14,
        // backgroundColor: "#F7F8FC",

        flexDirection: "row",
        alignItems: "center",
    },


    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,

        backgroundColor: "#172AA0",

        alignItems: "center",
        justifyContent: "center",
    },


    avatarText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontFamily:
            "Gilroy-Medium",
    },


    tenantInfo: {
        flex: 1,
        marginLeft: 12,
        minWidth: 0,
    },


    tenantName: {
        fontSize: 16,
        color: "#242832",
        fontFamily:
            "Gilroy-Semibold",
    },


    tenantDetails: {
        marginTop: 4,
        fontSize: 12,
        color: "#7B8495",
        fontFamily:
            "Gilroy-Regular",
    },


    tenantAmount: {
        fontSize: 15,
        color: "#18202F",
        fontFamily:
            "Gilroy-Bold",
        marginLeft: 8,
    },


    calculationCard: {
        marginHorizontal: 22,
        marginTop: 16,

        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,

        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },


    calculationHeader: {
        minHeight: 55,
        paddingHorizontal: 16,

        backgroundColor: "#F6F7FA",

        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
    },


    calculationTitle: {
        fontSize: 12,
        color: "#737C8D",
        fontFamily:
            "Gilroy-Medium",
    },


    manualBadge: {
        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#FFB45A",
        borderRadius: 14,

        paddingHorizontal: 9,
        paddingVertical: 5,
    },


    manualDot: {
        width: 7,
        height: 7,
        borderRadius: 4,

        backgroundColor: "#FF9700",
        marginRight: 5,
    },


    manualText: {
        fontSize: 10,
        color: "#E98500",
        fontFamily:
            "Gilroy-Medium",
    },


    breakdownRow: {
        minHeight: 40,
        paddingHorizontal: 18,

        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
    },


    breakdownLabel: {
        fontSize: 14,
        color: "#747D8D",
        fontFamily:
            "Gilroy-Regular",
    },


    breakdownAmount: {
        fontSize: 15,
        color: "#18202F",
        fontFamily:
            "Gilroy-Semibold",
    },


    labelWithBadge: {
        flexDirection: "row",
        alignItems: "center",
    },


    editedBadge: {
        marginLeft: 7,
        paddingHorizontal: 6,
        paddingVertical: 2,

        borderWidth: 1,
        borderColor: "#FF9B62",
        borderRadius: 4,
    },


    editedText: {
        fontSize: 8,
        color: "#FF7043",
        fontFamily:
            "Gilroy-Medium",
    },


    addButton: {
        height: 38,
        marginHorizontal: 18,
        marginTop: 8,
        marginBottom: 12,

        borderRadius: 7,
        backgroundColor: "#E9EDFF",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },


    addButtonText: {
        fontSize: 15,
        color: "#1747F5",
        fontFamily:
            "Gilroy-Medium",
    },


    editRow: {
        marginHorizontal: 18,
        marginBottom: 8,
        padding: 10,

        borderRadius: 10,
        backgroundColor: "#F7F8FC",

        flexDirection: "row",
        alignItems: "flex-end",

        gap: 8,
    },


    editField: {
        flex: 1,
    },


    editFieldLabel: {
        marginBottom: 5,
        fontSize: 11,
        color: "#6E7685",
        fontFamily:
            "Gilroy-Medium",
    },


    editInput: {
        height: 43,
        paddingHorizontal: 12,

        borderWidth: 1,
        borderColor: "#AFC0FF",
        borderRadius: 8,

        backgroundColor: "#FFFFFF",

        color: "#252832",
        fontSize: 14,

        fontFamily:
            "Gilroy-Regular",
    },


    removeButton: {
        width: 30,
        height: 43,

        alignItems: "center",
        justifyContent: "center",
    },


    removeIcon: {
        fontSize: 26,
        color: "#A3A8B2",
        lineHeight: 28,
    },


    savedRow: {
        marginHorizontal: 18,
        marginBottom: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,

        borderRadius: 8,
        backgroundColor: "#F8F9FC",

        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
    },


    savedRowLeft: {
        flex: 1,

        flexDirection: "row",
        justifyContent:
            "space-between",

        marginRight: 10,
    },


    savedType: {
        fontSize: 13,
        color: "#4E5665",
        fontFamily:
            "Gilroy-Medium",
    },


    savedAmount: {
        fontSize: 13,
        color: "#202633",
        fontFamily:
            "Gilroy-Semibold",
    },


    removeSavedIcon: {
        fontSize: 24,
        color: "#A3A8B2",
        lineHeight: 26,
    },


    actionRow: {
        flexDirection: "row",
        justifyContent:
            "flex-end",
        alignItems: "center",

        paddingHorizontal: 18,
        marginBottom: 10,

        gap: 12,
    },


    closeButton: {
        height: 40,
        minWidth: 90,

        paddingHorizontal: 18,

        borderWidth: 1,
        borderColor: "#DDDFE5",
        borderRadius: 8,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#FFFFFF",
    },


    closeButtonText: {
        fontSize: 15,
        color: "#565B64",
        fontFamily:
            "Gilroy-Regular",
    },


    saveButton: {
        height: 40,
        minWidth: 105,

        paddingHorizontal: 17,

        borderRadius: 8,
        backgroundColor: "#009447",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },


    saveButtonDisabled: {
        opacity: 0.45,
    },


    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontFamily:
            "Gilroy-Medium",
    },


    totalRow: {
        marginTop: 2,
        paddingHorizontal: 18,

        minHeight: 58,

        borderTopWidth: 1,
        borderTopColor: "#E8EAF0",

        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
    },


    totalLabel: {
        fontSize: 16,
        color: "#263040",
        fontFamily:
            "Gilroy-Semibold",
    },


    totalAmount: {
        fontSize: 20,
        color: "#202633",
        fontFamily:
            "Gilroy-Bold",
    },


    reviewCard: {
        marginHorizontal: 22,
        marginTop: 15,

        paddingHorizontal: 15,
        paddingVertical: 13,

        borderWidth: 1,
        borderColor: "#FFD36A",
        borderRadius: 10,

        backgroundColor: "#FFFBEF",
    },


    reviewTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },


    warningIcon: {
        fontSize: 16,
        color: "#FF9F00",
    },


    reviewTitle: {
        marginLeft: 7,
        fontSize: 15,
        color: "#B56B00",
        fontFamily:
            "Gilroy-Semibold",
    },


    reviewText: {
        marginTop: 7,
        marginLeft: 26,

        fontSize: 12,
        lineHeight: 18,

        color: "#C36F00",

        fontFamily:
            "Gilroy-Regular",
    },


    bottomBar: {
        paddingHorizontal: 22,
        paddingTop: 10,

        borderTopWidth: 1,
        borderTopColor: "#E7E9EE",

        backgroundColor: "#FFFFFF",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",

        elevation: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },


    bottomCancel: {
        height: 45,
        paddingHorizontal: 20,

        alignItems: "center",
        justifyContent: "center",
    },


    bottomCancelText: {
        fontSize: 15,
        color: "#343943",
        fontFamily:
            "Gilroy-Medium",
    },


    generateButton: {
        height: 45,
        paddingHorizontal: 22,

        borderRadius: 9,
        backgroundColor: "#2149E8",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        marginLeft: 8,
    },


    generateButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontFamily:
            "Gilroy-Medium",
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    itemRow: {
        minHeight: 52,
        paddingHorizontal: 18,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    itemNameContainer: {
        flex: 1,
        minWidth: 0,
        paddingRight: 10,
    },

    itemRightContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconButton: {
        width: 28,
        height: 35,

        alignItems: "center",
        justifyContent: "center",
    },

    actionIcon: {
        width: 15,
        height: 15,
        resizeMode: "contain",
    },

    inlineAmountInput: {
        height: 38,

        borderWidth: 1,
        borderColor: "#AFC0FF",
        borderRadius: 7,

        paddingHorizontal: 8,

        backgroundColor: "#FFFFFF",

        color: "#202633",
        fontSize: 14,

        fontFamily: "Gilroy-Semibold",

        textAlign: "right",
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
        gap: 10
    },

    deleteTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
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

    ReceiptcancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#2D6CDF",
        alignItems: "center",
        marginRight: 30,
    },
    receiptDeleteBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#2D6CDF",
        alignItems: "center",
    },



    cancelText: {
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
        color: "#2D6CDF",
    },

    deleteBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#2D6CDF",
        alignItems: "center",
        marginLeft: 10,
    },



    deleteBtnText: {
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
        color: "#fff",
    },
    permissionDisabledButton: {
        opacity: 0.45,
    },

    permissionDisabledText: {
        opacity: 0.6,
    },

    permissionDisabledIcon: {
        opacity: 0.45,
    },

    permissionDisabledIconImage: {
        opacity: 0.45,
    },


});