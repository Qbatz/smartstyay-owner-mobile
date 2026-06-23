import React, { useRef, useState, useEffect, useContext, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Image,
    ScrollView,
    Animated,
    PanResponder,
    Dimensions, BackHandler, Keyboard
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { useFocusEffect } from '@react-navigation/native';
import { CustomerContext } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { ExpensesContext } from "../../../Context/ExpensesContext";
import ProfilePlaceholder from "../../../Assets/Images/userAdd.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import ArrowLeft from "../../../Assets/Images/directionleft.png";
import RepeatIcon from "../../../Assets/Images/RepeatIcon.png";
import ValidatedInput from "../ValidatedInput"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import { useCustomer } from "../../../Context/CustomerContext";
import ImagePickerSheet from "../../Customer/CustomerOverview/ImagePickerSheet";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";

export default function AddExpensesPage({ route, vendorData, navigation }) {

    const { vendorList, addVendor, updateVendor, getVendorList, addExpense } = useContext(CustomerContext);;
    const { activeHostelId } = useContext(CommonContexts);
    const { expensesList, GetExpenseList, IntializeexpensesList, GetInitializeExpense, AddExpense,
        DeleteExpense, expenseUnits
    } = useContext(ExpensesContext)

    const translateY = useRef(new Animated.Value(0)).current;

     const isApplyTriggeredRef = useRef(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const [initialImage, setInitialImage] = useState(null);


    const [stateOpen, setStateOpen] = useState(false);
    const [stateQuery, setStateQuery] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [businessName, setBusinessName] = useState("");

    const [houseNo, setHouseNo] = useState("");
    const [street, setStreet] = useState("");
    const [landmark, setLandmark] = useState("");
    const [city, setCity] = useState("");
    const [stateName, setStateName] = useState("");
    const [country, setCountry] = useState("");
    const [pinCode, setPinCode] = useState("");

    const countryOptions = [{ label: "India", value: "India" }];
    const [countryOpen, setCountryOpen] = useState(false);

    const [countryLabel, setCountryLabel] = useState("");
    const [countryValue, setCountryValue] = useState(null);
    const [countryCode, setCountryCode] = useState("+91");
    const [countryCodeOpen, setCountryCodeOpen] = useState(false);




    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [initialData, setInitialData] = useState(null);
    const [noChangeError, setNoChangeError] = useState("");

    const [showProfileSheet, setShowProfileSheet] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({
        code: vendorData?.countryCode || "+91",
        label: "India",
    });
    const [isSubmitClicked, setIsSubmitClicked] = useState(false)


    const [expenseTitle, setExpenseTitle] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");

    const [amount, setAmount] = useState("");
    const [expenseDate, setExpenseDate] = useState("");

    const [linkVendor, setLinkVendor] = useState(false);
    const [vendor, setVendor] = useState("");

    // const [paymentStatus, setPaymentStatus] =
    //     useState("fully_paid");

    const [paidAmount, setPaidAmount] = useState("");
    const [balanceAmount, setBalanceAmount] = useState("");

    const [paymentMethod, setPaymentMethod] =
        useState("");

    const [transactionId, setTransactionId] =
        useState("");

    const [description, setDescription] =
        useState("");
    const [paymentStatus, setPaymentStatus] =
        useState("Partially Paid");

    const [creditType, setCreditType] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [subCategoryOpen, setSubCategoryOpen] = useState(false);
    const [vendorOpen, setVendorOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedMode, setSelectedMode] = useState(null)

    const [openPurchaseDate, setOpenPurchaseDate] = useState(false);
    const [purchaseDate, setPurchaseDate] = useState(null);

    const [modePaymentOpen, setModePaymentOpen] = useState(false);
    const [modePayment, setModePayment] = useState(null);

    const [unitsOpen, setUnitsOpen] = useState(false);
    const [selectedUnits, setSelectedUnits] = useState(null);
    const [categoryErr, setCategoryErr] = useState("");

    const [subCategoryErr, setSubCategoryErr] = useState("");
    const [dateErr, setDateErr] = useState("");

    const [selectedVendor, setSelectedVendor] = useState(null);
    const [vendorId, setVendorId] = useState(null);
    const [amountErr, setAmountErr] = useState("");
    const [unitcountErr, setUnitCountErr] = useState("")
    const [modeErr, setModeErr] = useState("");
    const [nochangeErr, setNochangeErr] = useState("")

    const [tax, setTax] = useState("");
    const [discount, setDiscount] = useState("");
    const [discountType, setDiscountType] = useState("amount"); // amount | percentage

    const categoryList = IntializeexpensesList?.listExpenses || [];


    const subCategoryList = selectedCategory?.subCategories || [];

    console.log("vendorlist", vendorList);




    const emptyItem = {
        itemDetail: "",
        quantity: "",
        unit: "",
        unitPrice: "",
        amount: "",
    };

    const [items, setItems] = useState([emptyItem]);

    const handleAddRow = () => {
        setItems((prev) => [
            ...prev,
            {
                itemDetail: "",
                quantity: "",
                unit: "",
                unitPrice: "",
                amount: "",
            },
        ]);
    }



    useEffect(() => {
        if (activeHostelId) {
            GetInitializeExpense(activeHostelId)
        }

    }, [activeHostelId])

    useFocusEffect(
        useCallback(() => {
            if (activeHostelId) {
                getVendorList(activeHostelId);
            }
        }, [activeHostelId])
    );


    const handleCloneRow = (index) => {
        const clonedItem = {
            ...items[index],
        };

        const updated = [...items];
        updated.splice(index + 1, 0, clonedItem);

        setItems(updated);
    };

    const handleDeleteRow = (index) => {
        setItems((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const updateItem = (
        index,
        field,
        value
    ) => {
        const updated = [...items];

        updated[index][field] = value;

        const qty =
            Number(updated[index].quantity) || 0;

        const price =
            Number(updated[index].unitPrice) || 0;

        updated[index].amount = qty * price;

        setItems(updated);
    };

    const scrollRef = useRef(null);
    const mobileRef = useRef(null);
    const emailRef = useRef(null);
    const businessnameRef = useRef(null);
    const flatRef = useRef(null);
    const landmarkRef = useRef(null);
    const cityRef = useRef(null)
    const pincodeRef = useRef(null)
    const stateRef = useRef(null);
    const countryRef = useRef(null);

    const scrollToField = (ref) => {
        if (!ref?.current || !scrollRef.current) return;

        ref.current.measureLayout(
            scrollRef.current,
            (x, y) => {
                scrollRef.current.scrollTo({
                    y: y - 100,
                    animated: true,
                });
            },
            () => { }
        );
    };

    const editData = route?.params?.editData || null;



    console.log("IntializeexpensesList", editData);
    const isEditMode = !!editData;


    const closeAll = () => {
        setCategoryOpen(false);
        setUnitsOpen(false);
        setModePaymentOpen(false);
        setOpenPurchaseDate(false);
    };


    const today = dayjs();

    const isDisabledDate = (d) => {
        if (!d) return false;

        if (d.isAfter(today, "day")) return true;

        if (isEditMode && minDate && d.isBefore(minDate, "day")) return true;

        return false;
    }





    const markedDates = {};

    for (let i = -365; i <= 365; i++) {
        const d = dayjs().add(i, "day");
        const key = d.format("YYYY-MM-DD");

        if (isDisabledDate(d)) {
            markedDates[key] = {
                disabled: true,
                disableTouchEvent: true,
                customStyles: {
                    container: {
                        backgroundColor: "#F3F4F6",
                        opacity: 0.4,
                        borderRadius: 8,
                    },
                    text: {
                        color: "#9CA3AF",
                    },
                },
            };
        }
    }


    useEffect(() => {
        if (!vendorData) return;

        const phone = vendorData.mobile || "";
        const mobileOnly = phone.slice(-10);

        const snapshot = {
            firstName: vendorData.firstName || "",
            lastName: vendorData.lastName || "",
            mobile: mobileOnly,
            email: vendorData.emailId || "",
            businessName: vendorData.businessName || "",
            houseNo: vendorData.houseNo || "",
            street: vendorData.area || "",
            landmark: vendorData.landMark || "",
            city: vendorData.city || "",
            stateName: vendorData.state || "",
            country: vendorData.countryId || "",
            pinCode: vendorData.pinCode ? String(vendorData.pinCode) : "",
            countryCode: vendorData.countryCode,
        };
        if (vendorData.countryId === 1) {
            setCountryLabel("India");   // UI
            setCountryValue(1);         // API
        }

        // set form values
        setFirstName(snapshot.firstName);
        setLastName(snapshot.lastName);
        setMobile(snapshot.mobile);
        setEmail(snapshot.email);
        setBusinessName(snapshot.businessName);
        setHouseNo(snapshot.houseNo);
        setStreet(snapshot.street);
        setLandmark(snapshot.landmark);
        setCity(snapshot.city);
        setStateName(snapshot.stateName);
        setCountry(snapshot.country);
        setPinCode(snapshot.pinCode);
        setSelectedCountry(snapshot?.countryCode)


        if (vendorData.profilePic) {
            setSelectedImage({ uri: vendorData.profilePic });
            setInitialImage(vendorData.profilePic);
        }


        // save initial snapshot
        setInitialData(snapshot);
    }, [vendorData]);

    const isImageChanged = () => {
        if (!initialImage && selectedImage) return true;
        if (initialImage && !selectedImage) return true;
        if (
            initialImage &&
            selectedImage &&
            selectedImage.uri !== initialImage
        )
            return true;

        return false;
    };


    const vendors = [
        { label: "Andhra Pradesh", value: "Andhra Pradesh" },
        { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
        { label: "Assam", value: "Assam" },
        { label: "Bihar", value: "Bihar" },
        { label: "Chhattisgarh", value: "Chhattisgarh" },
        { label: "Goa", value: "Goa" },
        { label: "Gujarat", value: "Gujarat" },
        { label: "Haryana", value: "Haryana" },
        { label: "Himachal Pradesh", value: "Himachal Pradesh" },
        { label: "Jharkhand", value: "Jharkhand" },
        { label: "Karnataka", value: "Karnataka" },
        { label: "Kerala", value: "Kerala" },
        { label: "Madhya Pradesh", value: "Madhya Pradesh" },
        { label: "Maharashtra", value: "Maharashtra" },
        { label: "Manipur", value: "Manipur" },
        { label: "Meghalaya", value: "Meghalaya" },
        { label: "Mizoram", value: "Mizoram" },
        { label: "Nagaland", value: "Nagaland" },
        { label: "Odisha", value: "Odisha" },
        { label: "Punjab", value: "Punjab" },
        { label: "Rajasthan", value: "Rajasthan" },
        { label: "Sikkim", value: "Sikkim" },
        { label: "Tamil Nadu", value: "Tamil Nadu" },
        { label: "Telangana", value: "Telangana" },
        { label: "Tripura", value: "Tripura" },
        { label: "Uttar Pradesh", value: "Uttar Pradesh" },
        { label: "Uttarakhand", value: "Uttarakhand" },
        { label: "West Bengal", value: "West Bengal" },
    ];


    const stateList = vendors; // reuse your vendors array

    // const unitsOptions = expenseUnits?.map(item => ({
    //     label: item?.unitName,
    //     value: item?.id,
    // }));

    const unitsOptions = [
        { value: "Nos", label: "Nos" },
        { value: "Kg", label: "Kg" },
        { value: "Litre", label: "Litre" },
        { value: "Packet", label: "Packet" },
        { value: "Box", label: "Box" },
        { value: "Bottle", label: "Bottle" },
        { value: "Can", label: "Can" },
        { value: "Bundle", label: "Bundle" },
        { value: "Meter", label: "Meter" },
        { value: "Piece", label: "Piece" },
        { value: "Set", label: "Set" },
        { value: "Day", label: "Day" },
        { value: "Month", label: "Month" },
        { value: "Hour Wage", label: "Hour Wage" },
    ];

    const paymentOptions =
        IntializeexpensesList?.banks?.map((b) => ({
            id: b?.bankId,
            name: `${b?.holderName} - ${b?.bankName}`,
        })) || [];


    console.log("paymentOptions", paymentOptions);

    const filteredStateList = stateList?.filter((s) =>
        s.label.toLowerCase().includes(stateQuery.toLowerCase())
    )
        .sort((a, b) => {
            const aStart = a.label.toLowerCase().startsWith(stateQuery.toLowerCase());
            const bStart = b.label.toLowerCase().startsWith(stateQuery.toLowerCase());
            return bStart - aStart;
        });

    console.log('stat', filteredStateList)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validatePincode = (value) => {
        if (!value) return "Please Enter Pincode";
        if (!/^\d+$/.test(value)) return "Pincode must contain only numbers";
        if (value.length !== 6) return "Pin Code must be exactly 6 digits";
        if (value === "000000") return "Pin Code cannot be all zeros";
        if (value[0] === "0") return "Pin Code cannot start with 0";
        if (value.slice(-3) === "000") return "Last 3 digits cannot be 000";
        return "";
    };



    //   const validate = () => {
    //   let newErrors = {};

    //   if (!firstName.trim()) {
    //     newErrors.firstName = "Please Enter First Name";
    //   }

    //   if (!mobile.trim()) {
    //     newErrors.mobile = "Please Enter Mobile Number";
    //   } else if (mobile.length !== 10) {
    //     newErrors.mobile = "Mobile number must be 10 digits";
    //   }

    //   if (email && !emailRegex.test(email)) {
    //     newErrors.email = "Please Enter Valid Email ID";
    //   }

    //   const pinError = validatePincode(pinCode);
    //   if (pinError) {
    //     newErrors.pinCode = pinError;
    //   }

    //   if (!country) {
    //     newErrors.country = "Please Select Country";
    //   }

    //   setErrors(newErrors);
    //   return Object.keys(newErrors).length === 0;
    // };

    const handleTransactionChange = (text) => {
        const filteredText = text.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/
            , ""
        );

        setTransactionId(filteredText);
    };


    const validate = () => {
        if (vendorData && initialData) {
            const currentData = getCurrentData();
            const dataSame = isSameData(initialData, currentData);
            const imageSame = !isImageChanged();

            if (dataSame && imageSame) {
                setNoChangeError("No changes detected");
                return false;
            }
        }

        let newErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = "Please Enter First Name";
        }

        if (!mobile.trim()) {
            newErrors.mobile = "Please Enter Mobile Number";
        } else if (mobile.length !== 10) {
            newErrors.mobile = "Mobile number must be 10 digits";
        } else if (mobile[0] === "0") {
            newErrors.mobile = "Mobile number cannot start with 0";
        } else if (/^0+$/.test(mobile)) {
            newErrors.mobile = "Mobile number cannot be all zeros";
        }

        if (!businessName.trim()) {
            newErrors.businessName = "Please Enter Business Name";
        }

        if (!city.trim()) {
            newErrors.city = "Please Enter City";
        }

        const pinError = validatePincode(pinCode);
        if (pinError) {
            newErrors.pinCode = pinError;
        }

        if (!stateName) {
            newErrors.stateName = "Please Select State";
        }

        if (!countryValue) {
            newErrors.country = "Please Select Country";
        }


        if (email && !emailRegex.test(email)) {
            newErrors.email = "Please Enter Valid Email ID";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [vendorCategory, setVendorCategory] = useState("");
    const [contactPerson, setContactPerson] = useState("");


    const [gstNumber, setGstNumber] = useState("");
    const [panNumber, setPanNumber] = useState("");

    const [allowCredit, setAllowCredit] = useState(false);
    const [creditLimit, setCreditLimit] = useState("");
    const [creditPeriod, setCreditPeriod] = useState("")

    const [attachments, setAttachments] = useState([]);

    const [minDate, setMinDate] = useState(null); // add this

    const pickImage = () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: "photo",
                selectionLimit: 0, // multiple images
            },
            (response) => {
                if (response.didCancel) return;

                if (response.assets?.length) {
                    const newFiles = response.assets;

                    setAttachments((prev) => [
                        ...prev,
                        ...newFiles,
                    ]);

                    if (!selectedImage) {
                        setSelectedImage(newFiles[0]);
                    }
                }
            }
        );
    };

    const removeImage = (index) => {
        const updated = attachments.filter(
            (_, i) => i !== index
        );

        setAttachments(updated);

        if (selectedImage?.uri === attachments[index]?.uri) {
            setSelectedImage(updated[0] || null);
        }
    };




    const validateExpenseForm = () => {
        let newErrors = {};

        if (!expenseTitle?.trim()) {
            newErrors.expenseTitle = "Please Enter Expense Title";
        }

        if (!selectedCategory) {
            newErrors.category = "Please Select Category";
        }

        if (
            selectedCategory?.subCategories?.length > 0 &&
            !selectedSubCategory
        ) {
            newErrors.subCategory =
                "Please Select Sub Category";
        }

        if (!amount?.trim()) {
            newErrors.amount = "Please Enter Amount";
        } else if (Number(amount) <= 0) {
            newErrors.amount = "Amount should be greater than 0";
        }

        if (!purchaseDate) {
            newErrors.expenseDate = "Please Select Expense Date";
        }

        // Vendor Validation
        if (linkVendor && !selectedVendor) {
            newErrors.vendor = "Please Select Vendor";
        }

        // Payment Method
        // if (!selectedMode) {
        //     newErrors.paymentMethod = "Please Select Payment Method";
        // }
        if (linkVendor) {

            if (!selectedVendor) {
                newErrors.vendor = "Please Select Vendor";
            }

            if (!paymentStatus) {
                newErrors.paymentStatus =
                    "Please Select Payment Status";
            }

            if (!selectedMode) {
                newErrors.paymentMethod =
                    "Please Select Payment Method";
            }

            if (paymentStatus === "Partially Paid") {

                if (!paidAmount?.trim()) {
                    newErrors.paidAmount =
                        "Please Enter Paid Amount";
                } else if (Number(paidAmount) <= 0) {
                    newErrors.paidAmount =
                        "Paid Amount should be greater than 0";
                } else if (
                    Number(paidAmount) > Number(amount)
                ) {
                    newErrors.paidAmount =
                        "Paid Amount cannot exceed Total Amount";
                }
            }
        }
        // Partial Payment Validation
        if (linkVendor && paymentStatus === "Partially Paid") {
            if (!paidAmount?.trim()) {
                newErrors.paidAmount = "Please Enter Paid Amount";
            } else if (Number(paidAmount) <= 0) {
                newErrors.paidAmount = "Paid Amount should be greater than 0";
            } else if (Number(paidAmount) > Number(amount)) {
                newErrors.paidAmount =
                    "Paid Amount cannot exceed Total Amount";
            }
        }

        if (paymentStatus === "Credit / Pending") {
            if (!creditType?.trim()) {
                newErrors.creditType =
                    "Please Enter Credit Type"
            }
        } else {
            if (!selectedMode) {
                newErrors.paymentMethod =
                    "Please Select Payment Method";
            }
        }
        const hasItems = items.some(
            item =>
                item.itemDetail?.trim() ||
                item.quantity ||
                item.unitPrice ||
                selectedUnits
        );

        if (hasItems) {
            items.forEach((item, index) => {
                if (!item.itemDetail?.trim()) {
                    newErrors[`itemDetail_${index}`] =
                        `Please Enter Item Detail for Item ${index + 1}`;
                }

                if (!item.quantity || Number(item.quantity) <= 0) {
                    newErrors[`quantity_${index}`] =
                        `Please Enter Quantity for Item ${index + 1}`;
                }

                if (!selectedUnits) {
                    newErrors.units = "Please Select Unit";
                }

                if (!item.unitPrice || Number(item.unitPrice) <= 0) {
                    newErrors[`unitPrice_${index}`] =
                        `Please Enter Unit Price for Item ${index + 1}`;
                }
            });
        }
        // const itemTotal = items.reduce(
        //     (sum, item) => sum + Number(item.amount || 0),
        //     0
        // );

        // if (Number(amount) !== itemTotal) {
        //     newErrors.amount =
        //         `Amount (${amount}) should match Item Total (${itemTotal})`;
        // }

        const itemTotal = items.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        if (hasItems && Number(amount) !== itemTotal) {
            newErrors.amount =
                `Amount (${amount}) should match Item Total (${itemTotal})`;
        }

        if (tax && Number(tax) < 0) {
            newErrors.tax = "Invalid Tax Amount";
        }

        if (discount && Number(discount) < 0) {
            newErrors.discount = "Invalid Discount";
        }

        if (
            discountType === "amount" &&
            Number(discount) > itemTotal
        ) {
            newErrors.discount =
                "Discount cannot exceed Item Total";
        }

        if (Number(tax) > itemTotal) {
            newErrors.tax =
                "Tax cannot exceed Item Total";
        }

        if (
            discountType === "percentage" &&
            Number(discount) > 100
        ) {
            newErrors.discount =
                "Discount percentage cannot exceed 100";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    useEffect(() => {
        if (paymentStatus === "Partially Paid") {
            const total = Number(amount || 0);
            const paid = Number(paidAmount || 0);

            setBalanceAmount(
                paid > total ? "0" : String(total - paid)
            );
        } else {
            setBalanceAmount("0");
        }
    }, [amount, paidAmount, paymentStatus])

    const itemTotal = items.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
    );

    const taxAmount = Number(tax || 0);

    const discountAmount =
        discountType === "percentage"
            ? (itemTotal * Number(discount || 0)) / 100
            : Number(discount || 0);

    const grandTotal =
        itemTotal + taxAmount - discountAmount;

    const datevalid = dayjs(purchaseDate).format("DD-MM-YYYY")
    console.log("purchaseDate", datevalid);


    const handleSubmit = async () => {
        if (!validateExpenseForm()) return;

              if (isApplyTriggeredRef.current) return
        isApplyTriggeredRef.current = true

        const totalAmount = Number(amount || 0);

        const paid =
            paymentStatus === "Fully Paid"
                ? totalAmount
                : Number(paidAmount || 0);

        const balance =
            paymentStatus === "Fully Paid"
                ? 0
                : totalAmount - paid;

        const payload = {
            images: attachments || [],

            expense: {
                categoryId: selectedCategory?.categoryId,
                subCategory: selectedSubCategory?.subCategoryId,
                purchaseDate: dayjs(purchaseDate).format("DD-MM-YYYY"),
                count: items.length,
                totalAmount,

                bankId: selectedMode?.id || "",

                description,
                title: expenseTitle,

                isVendorExpense: linkVendor,
                vendorId: linkVendor ? vendorId : null,

                paymentStatus:
                    paymentStatus === "Fully Paid"
                        ? "Full"
                        : paymentStatus === "Partially Paid"
                            ? "Partial"
                            : "Pending",

                paidAmount: paid,
                balanceAmount: balance,

                paymentMethod:
                    paymentStatus === "Credit / Pending"
                        ? ""
                        : selectedMode?.id,

                //                       creditType:
                // paymentStatus === "Credit / Pending"
                //   ? creditType
                //   : "",

                note: description || "",
                transactionId: transactionId || "",

                tax: Number(tax || 0),
                discount: Number(discount || 0),

                expenseItems: items.map((item) => ({
                    item: item.itemDetail,
                    quantity: Number(item.quantity || 0),
                    unit: selectedUnits?.label,
                    unitPrice: Number(item.unitPrice || 0),
                    totalAmount: Number(item.amount || 0),
                })),
            },
        };

        console.log("EXPENSE PAYLOAD =>", payload);

        const hostelId = activeHostelId

        const response = await addExpense(hostelId, payload.expense, attachments);

        console.log("response", response);


        if (response?.success) {
            setModalType("success");
            setModalMessage("Expense Added Successfully");
            setShowSuccessModal(true);

            setTimeout(() => {
                navigation.goBack();
            }, 1500);
        } else {
            setModalType("error");
            setModalMessage(
                response?.message || "Failed to add expense"
            );
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 1500);
        }

         isApplyTriggeredRef.current = false
    };

    return (

        <>
            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={modalMessage}
                type={modalType} />
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}
                        style={styles.backBtn}
                    >
                        <Image source={ArrowLeft} style={{ height: 18, width: 18 }} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Add Expenses
                    </Text>
                </View>


                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >

                    {/* Vendor Information */}


                    <View style={styles.sectionHeader}>
                        <View style={styles.blueBar} />
                        <Text style={styles.sectionTitle}>
                            Expenses Details
                        </Text>
                    </View>
                    <Text style={styles.label}>
                        Expenses Title <Text style={{ color: "red" }}>*</Text>
                    </Text>

                    {/* <ValidatedInput
                    type="name"
                    inputType="text"
                    value={businessName}
                    onChangeText={setBusinessName}
                    placeholder="Enter Vendor Name"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                /> */}


                    <ValidatedInput
                        type="name"
                        inputType="text"
                        value={expenseTitle}
                        onChangeText={(text) => {
                            setExpenseTitle(text);
                            setErrors(prev => ({
                                ...prev,
                                expenseTitle: ""
                            }));
                        }}
                        placeholder="Vegetables 70 KG"
                        maxLength={50}
                        placeholderTextColor="#9CA3AF"
                        style={styles.input}
                    />

                    <Text style={styles.note}>
                        Note : Max 50 Characters
                    </Text>
                    {errors.expenseTitle && (
                        <ErrorMessage
                            message={errors.expenseTitle}
                            type="error"
                        />
                    )}

                    <View style={{
                        flexDirection: "row",
                        gap: 10, marginTop: 10, marginBottom: 5
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>
                                Category <Text style={{ color: "red" }}>*</Text>
                            </Text>

                            <TouchableOpacity
                                style={styles.expensesDropdownBox}
                                onPress={() => {
                                    setCategoryOpen(!categoryOpen)
                                    setSubCategoryOpen(false);
                                    setModePaymentOpen(false);

                                }}
                            >
                                <Text style={{ color: selectedCategory ? "#000" : "#9CA3AF" }}>
                                    {selectedCategory?.categoryName || "Select Category"}
                                </Text>
                                <Image source={DownArrow} style={styles.expensesArrowIcon} />
                            </TouchableOpacity>

                            {categoryOpen && (
                                <View style={styles.expensesDropdownMenu}>
                                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                                        {categoryList?.length === 0 ? (
                                            <Text style={styles.expensesNoDataText}>
                                                No category found
                                            </Text>
                                        ) : (
                                            categoryList?.map((item) => {
                                                const isSelected =
                                                    selectedCategory?.categoryId === item.categoryId;

                                                return (
                                                    <TouchableOpacity
                                                        key={item.categoryId}
                                                        style={[
                                                            styles.expensesOption,
                                                            isSelected && styles.expensesOptionSelected,
                                                        ]}
                                                        onPress={() => {
                                                            setSelectedCategory(item);
                                                            setSelectedSubCategory(null);
                                                            setCategoryErr("");
                                                            setNochangeErr("");
                                                            setCategoryOpen(false);
                                                            setErrors(prev => ({
                                                                ...prev,
                                                                category: ""
                                                            }));
                                                        }}

                                                    >
                                                        <Text
                                                            style={[
                                                                styles.expensesOptionText,
                                                                isSelected && styles.expensesOptionTextSelected,
                                                            ]}
                                                        >
                                                            {item.categoryName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            })


                                        )}
                                    </ScrollView>
                                </View>
                            )}

                            {errors.category && (
                                <ErrorMessage
                                    message={errors.category}
                                    type="error"
                                />
                            )}

                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>
                                Sub Category
                                {selectedCategory?.subCategories?.length > 0 && (
                                    <Text style={{ color: "red" }}> *</Text>
                                )}
                            </Text>

                            <TouchableOpacity
                                style={[
                                    styles.expensesDropdownBox,
                                    subCategoryList.length === 0 && { backgroundColor: "#F3F4F6" },
                                ]}
                                disabled={subCategoryList.length === 0}
                                onPress={() => {
                                    setSubCategoryOpen(!subCategoryOpen);
                                    setCategoryOpen(false);
                                    setModePaymentOpen(false);


                                }}

                            >
                                <Text style={{ color: selectedSubCategory ? "#000" : "#9CA3AF" }}>
                                    {selectedSubCategory?.subCategoryName || "Select Sub Category"}

                                </Text>
                                <Image source={DownArrow} style={styles.expensesArrowIcon} />
                            </TouchableOpacity>

                            {subCategoryOpen && (
                                <View style={styles.expensesDropdownMenu}>
                                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                                        {subCategoryList.length === 0 ? (
                                            <Text style={styles.expensesNoDataText}>
                                                No sub category found
                                            </Text>
                                        ) : (
                                            subCategoryList.map((item) => {
                                                const isSelected =
                                                    selectedSubCategory?.subCategoryId === item.subCategoryId;

                                                return (
                                                    <TouchableOpacity
                                                        key={item.subCategoryId}
                                                        style={[
                                                            styles.expensesOption,
                                                            isSelected && styles.expensesOptionSelected,
                                                        ]}
                                                        onPress={() => {
                                                            setSelectedSubCategory(item);
                                                            setSubCategoryErr("");
                                                            setNochangeErr("");
                                                            setSubCategoryOpen(false);
                                                            setErrors(prev => ({
                                                                ...prev,
                                                                subCategory: ""
                                                            }))
                                                        }}

                                                    >
                                                        <Text
                                                            style={[
                                                                styles.expensesOptionText,
                                                                isSelected && styles.expensesOptionTextSelected,
                                                            ]}
                                                        >
                                                            {item.subCategoryName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            })


                                        )}
                                    </ScrollView>
                                </View>
                            )}
                            {errors.subCategory && (
                                <ErrorMessage
                                    message={errors.subCategory}
                                    type="error"
                                />
                            )}
                        </View>
                    </View>


                    <Text style={styles.label}>
                        Amount (INR)
                        <Text style={{ color: "red" }}>*</Text>
                    </Text>

                    <ValidatedInput
                        type="numberOnly"
                        inputType="numeric"
                        value={amount}
                        onChangeText={(text) => {
                            setAmount(text);
                            setErrors(prev => ({
                                ...prev,
                                amount: ""
                            }));
                        }}
                        placeholder="₹ 5,500"
                        placeholderTextColor="#9CA3AF"
                        style={styles.input}
                    />
                    {errors.amount && (
                        <ErrorMessage
                            message={errors.amount}
                            type="error"
                        />
                    )}

                    <Text style={styles.label}>
                        Expense Date <Text style={{ color: "red" }}>*</Text>
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        // disabled={isEditMode}
                        onPress={() => {
                            // if (!isEditMode)
                            setOpenPurchaseDate(true);
                            setNochangeErr("");
                        }}
                    >
                        <View style={styles.dateInputWrapper}>
                            <TextInput
                                style={styles.dateInput}
                                placeholder="DD-MM-YYYY"
                                value={purchaseDate ? dayjs(purchaseDate).format("DD-MM-YYYY") : ""}
                                editable={false}
                                pointerEvents="none"
                            />

                            <Image
                                source={require("../../../Assets/Images/calendar.png")}
                                style={styles.calendarIcon}
                            />
                        </View>
                    </TouchableOpacity>



                    {errors.expenseDate && (
                        <ErrorMessage
                            message={errors.expenseDate}
                            type="error"
                        />
                    )}

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 20,
                            marginBottom: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontFamily: "Gilroy-Medium",
                                color: "#1E1E1E",
                                width: "45%",
                                lineHeight: 24,
                            }}
                        >
                            Link this Expense to a Vendor?
                        </Text>

                        <View
                            style={{
                                width: "30%",
                                height: 42,
                                backgroundColor: "#EEF2FF",
                                borderRadius: 14,
                                padding: 1,
                                flexDirection: "row",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => setLinkVendor(false)}
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                    backgroundColor: !linkVendor
                                        ? "#2F54EB"
                                        : "transparent",
                                }}
                            >
                                <Text
                                    style={{
                                        color: !linkVendor ? "#FFF" : "#1E1E1E",
                                        fontSize: 13,
                                        fontFamily: !linkVendor
                                            ? "Gilroy-Bold"
                                            : "Gilroy-Medium",
                                    }}
                                >
                                    No
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setLinkVendor(true)}
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                    backgroundColor: linkVendor
                                        ? "#2F54EB"
                                        : "transparent",
                                }}
                            >
                                <Text
                                    style={{
                                        color: linkVendor ? "#FFF" : "#1E1E1E",
                                        fontSize: 13,
                                        fontFamily: linkVendor
                                            ? "Gilroy-Bold"
                                            : "Gilroy-Medium",
                                    }}
                                >
                                    Yes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    {!linkVendor && (
                        <>
                            <Text style={styles.label}>
                                Payment method <Text style={{ color: "red" }}>*</Text>
                            </Text>

                            <TouchableOpacity
                                // style={styles.expensesDropdownBox}

                                style={[
                                    styles.expensesDropdownBox,
                                    isEditMode && { opacity: 0.4 }
                                ]}
                                disabled={isEditMode}
                                onPress={() => {
                                    setModePaymentOpen(!modePaymentOpen);
                                    setCategoryOpen(false);
                                    setSubCategoryOpen(false);
                                }}
                            >
                                <Text style={{ color: selectedMode ? "#000" : "#9CA3AF" }}>
                                    {selectedMode?.name || "Select Mode"}
                                </Text>
                                <Image source={DownArrow} style={styles.expensesArrowIcon} />
                            </TouchableOpacity>

                            {modePaymentOpen && (
                                <View style={styles.expensesDropdownMenu}>
                                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                                        {paymentOptions.length === 0 ? (
                                            <Text style={styles.expensesNoDataText}>
                                                No mode found
                                            </Text>
                                        ) : (
                                            paymentOptions.map((item) => {
                                                const isSelected =
                                                    selectedMode?.id === item.id;

                                                return (
                                                    <TouchableOpacity
                                                        key={item.id}
                                                        style={[
                                                            styles.expensesOption,
                                                            isSelected && styles.expensesOptionSelected,
                                                        ]}
                                                        onPress={() => {
                                                            setSelectedMode(item)
                                                            setModeErr("")
                                                            setNochangeErr("");
                                                            setModePaymentOpen(false)
                                                            setErrors(prev => ({
                                                                ...prev,
                                                                paymentMethod: ""
                                                            }))
                                                        }}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.expensesOptionText,
                                                                isSelected &&
                                                                styles.expensesOptionTextSelected,
                                                            ]}
                                                        >
                                                            {item.name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })
                                        )}
                                    </ScrollView>
                                </View>
                            )}

                            {errors.paymentMethod && (
                                <ErrorMessage
                                    message={errors.paymentMethod}
                                    type="error"
                                />
                            )}

                            <Text style={styles.label}>Transaction ID</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter Transaction ID"
                                // keyboardType="numeric"
                                value={transactionId}
                                onChangeText={handleTransactionChange}

                            />
                        </>
                    )}


                    {linkVendor && (
                        <>
                            <Text style={styles.label}>
                                Vendor <Text style={styles.required}>*</Text>
                            </Text>




                            <TouchableOpacity
                                style={styles.expensesDropdownBox}
                                onPress={() => {
                                    setVendorOpen(!vendorOpen);
                                    setSubCategoryOpen(false);
                                    setModePaymentOpen(false);
                                    setCategoryOpen(false);
                                }}
                            >
                                <Text style={{ color: selectedVendor ? "#000" : "#9CA3AF" }}>
                                    {selectedVendor?.fullName || "Select Vendor"}
                                </Text>

                                <Image
                                    source={DownArrow}
                                    style={styles.expensesArrowIcon}
                                />
                            </TouchableOpacity>


                            {vendorOpen && (
                                <View style={styles.expensesDropdownMenu}>
                                    <ScrollView
                                        style={{ maxHeight: 150 }}
                                        nestedScrollEnabled
                                    >
                                        {vendorList?.vendors?.length === 0 ? (
                                            <Text style={styles.expensesNoDataText}>
                                                No Vendors Found
                                            </Text>
                                        ) : (
                                            vendorList?.vendors?.map((item) => {
                                                const isSelected = vendorId === item?.id;

                                                return (
                                                    <TouchableOpacity
                                                        key={item?.id}
                                                        style={[
                                                            styles.expensesOption,
                                                            isSelected &&
                                                            styles.expensesOptionSelected,
                                                        ]}
                                                        onPress={() => {
                                                            setSelectedVendor(item); // full object
                                                            setVendorId(item?.id);    // only id
                                                            setVendorOpen(false);
                                                            setErrors(prev => ({
                                                                ...prev,
                                                                vendor: ""
                                                            }));
                                                        }}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.expensesOptionText,
                                                                isSelected &&
                                                                styles.expensesOptionTextSelected,
                                                            ]}
                                                        >
                                                            {item.fullName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })
                                        )}
                                    </ScrollView>
                                </View>
                            )}



                            {errors.vendor && (
                                <ErrorMessage
                                    message={errors.vendor}
                                    type="error"
                                />
                            )}

                            <Text style={styles.label}>
                                Payment Status <Text style={{ color: "red" }}>*</Text>
                            </Text>

                            <View style={{ marginTop: 10 }}>
                                {[
                                    "Fully Paid",
                                    "Partially Paid",
                                    "Credit / Pending",
                                    // "Overdue",
                                ].map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        style={styles.radioRow}
                                        onPress={() => setPaymentStatus(status)}
                                    >
                                        <View
                                            style={[
                                                styles.radioOuter,
                                                paymentStatus === status &&
                                                styles.radioOuterActive,
                                            ]}
                                        >
                                            {paymentStatus === status && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </View>

                                        <Text style={styles.radioText}>
                                            {status}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {errors.paymentStatus && (
                                <ErrorMessage
                                    message={errors.paymentStatus}
                                    type="error"
                                />
                            )}

                            {paymentStatus === "Partially Paid" && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginTop: 8,
                                    }}
                                >
                                    <View style={{ width: "48%" }}>
                                        <Text
                                            style={[

                                                {
                                                    fontSize: 16,
                                                    fontFamily: "Gilroy-Medium",
                                                    color: "#1E1E1E",
                                                    marginBottom: 8,
                                                    height: 52,
                                                    textAlignVertical: "top",
                                                },
                                            ]}
                                        >
                                            Paid Amount (INR)
                                            <Text style={{ color: "red" }}> *</Text>
                                        </Text>

                                        <ValidatedInput
                                            keyboardType="numeric"
                                            type="numberOnly"
                                            inputType="numeric"
                                            value={paidAmount}
                                            onChangeText={(text) => {
                                                setPaidAmount(text);
                                                setErrors(prev => ({
                                                    ...prev,
                                                    paidAmount: ""
                                                }));
                                            }}
                                            placeholder="₹ 2,500"
                                            style={styles.input}
                                        />
                                        {errors.paidAmount && (
                                            <ErrorMessage
                                                message={errors.paidAmount}
                                                type="error"
                                            />
                                        )}



                                    </View>


                                    <View style={{ width: "48%" }}>
                                        <Text
                                            style={[

                                                {
                                                    fontSize: 16,
                                                    fontFamily: "Gilroy-Medium",
                                                    color: "#1E1E1E",
                                                    marginBottom: 8,
                                                    height: 52,
                                                    lineHeight: 24,
                                                },
                                            ]}
                                        >
                                            Balance Amount{"\n"}(Outstanding)
                                        </Text>

                                        <ValidatedInput
                                            editable={false}
                                            value={balanceAmount}
                                            placeholder="₹ 3,000"
                                            style={styles.input}
                                            keyboardType="numeric"
                                            type="numberOnly"
                                            inputType="numeric"
                                        />
                                    </View>
                                </View>
                            )}

                            {paymentStatus !== "Credit / Pending" && (
                                <>
                                    <Text style={styles.label}>
                                        Payment method <Text style={{ color: "red" }}>*</Text>
                                    </Text>


                                    <TouchableOpacity
                                        // style={styles.expensesDropdownBox}

                                        style={[
                                            styles.expensesDropdownBox,
                                            isEditMode && { opacity: 0.4 }
                                        ]}
                                        disabled={isEditMode}
                                        onPress={() => {
                                            setModePaymentOpen(!modePaymentOpen);
                                            setCategoryOpen(false);
                                            setSubCategoryOpen(false);
                                        }}
                                    >
                                        <Text style={{ color: selectedMode ? "#000" : "#9CA3AF" }}>
                                            {selectedMode?.name || "Select Mode"}
                                        </Text>
                                        <Image source={DownArrow} style={styles.expensesArrowIcon} />
                                    </TouchableOpacity>

                                    {modePaymentOpen && (
                                        <View style={styles.expensesDropdownMenu}>
                                            <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                                                {paymentOptions.length === 0 ? (
                                                    <Text style={styles.expensesNoDataText}>
                                                        No mode found
                                                    </Text>
                                                ) : (
                                                    paymentOptions.map((item) => {
                                                        const isSelected =
                                                            selectedMode?.id === item.id;

                                                        return (
                                                            <TouchableOpacity
                                                                key={item.id}
                                                                style={[
                                                                    styles.expensesOption,
                                                                    isSelected && styles.expensesOptionSelected,
                                                                ]}
                                                                onPress={() => {
                                                                    setSelectedMode(item)
                                                                    setModeErr("")
                                                                    setNochangeErr("");
                                                                    setModePaymentOpen(false)
                                                                }}
                                                            >
                                                                <Text
                                                                    style={[
                                                                        styles.expensesOptionText,
                                                                        isSelected &&
                                                                        styles.expensesOptionTextSelected,
                                                                    ]}
                                                                >
                                                                    {item.name}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        );
                                                    })
                                                )}
                                            </ScrollView>
                                        </View>
                                    )}

                                    {errors.paymentMethod && (
                                        <ErrorMessage
                                            message={errors.paymentMethod}
                                            type="error"
                                        />
                                    )}
                                </>)}

                            {paymentStatus === "Credit / Pending" && (
                                <>
                                    <Text style={styles.label}>
                                        Credit Period <Text style={{ color: "red" }}>*</Text>
                                    </Text>

                                    <ValidatedInput
                                        value={creditType}
                                        onChangeText={setCreditType}
                                        placeholder="Enter Credit Period"
                                        style={styles.input}
                                    />

                                    {errors.creditType && (
                                        <ErrorMessage
                                            message={errors.creditType}
                                            type="error"
                                        />
                                    )}
                                </>
                            )}

                            <Text style={styles.label}>
                                Transaction ID
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter Transaction ID"
                                // keyboardType="numeric"
                                value={transactionId}
                                onChangeText={handleTransactionChange}

                            />




                            <Text style={styles.label}>
                                Attachments / Proofs
                            </Text>

                            {attachments.length === 0 ? (
                                <TouchableOpacity
                                    style={styles.uploadBox}
                                    onPress={pickImage}
                                >
                                    <Text style={styles.uploadText}>
                                        Choose Image to Upload
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <>
                                    {/* Main Preview */}

                                    <View style={styles.previewCard}>
                                        <Image
                                            source={{ uri: selectedImage?.uri }}
                                            style={styles.previewImage}
                                        />

                                        <View style={styles.fileInfoRow}>
                                            <View>
                                                <Text style={styles.fileName}>
                                                    {selectedImage?.fileName}
                                                </Text>

                                                <Text style={styles.fileSize}>
                                                    {(
                                                        (selectedImage?.fileSize || 0) /
                                                        1024
                                                    ).toFixed(0)}{" "}
                                                    KB
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    const index =
                                                        attachments.findIndex(
                                                            (item) =>
                                                                item.uri ===
                                                                selectedImage.uri
                                                        );

                                                    removeImage(index);
                                                }}
                                                style={styles.deleteBtn}
                                            >
                                                <Text
                                                    style={{
                                                        color: "#FF4D4F",
                                                        fontSize: 20,
                                                    }}
                                                >
                                                    ✕
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Thumbnail List */}

                                    <View style={styles.thumbnailRow}>
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={
                                                false
                                            }
                                        >
                                            {attachments.map(
                                                (item, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() =>
                                                            setSelectedImage(item)
                                                        }
                                                    >
                                                        <Image
                                                            source={{
                                                                uri: item.uri,
                                                            }}
                                                            style={[
                                                                styles.thumbImage,
                                                                selectedImage?.uri ===
                                                                item.uri && {
                                                                    borderColor:
                                                                        "#2D5BFF",
                                                                    borderWidth: 2,
                                                                },
                                                            ]}
                                                        />
                                                    </TouchableOpacity>
                                                )
                                            )}
                                        </ScrollView>

                                        <TouchableOpacity
                                            onPress={pickImage}
                                        >
                                            <Text style={styles.addMore}>
                                                + Add more Files
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </>
                    )}




                    <Text style={styles.label}>
                        Description
                    </Text>

                    <TextInput
                        multiline
                        numberOfLines={4}
                        style={styles.textArea}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Ex : Wifi Bill Paid for May"
                    />

                    <View style={styles.sectionHeader}>
                        <View style={styles.blueBar} />
                        <View>
                            <Text style={styles.sectionTitle}>
                                Expense Items
                            </Text>

                            <Text style={styles.sectionSubTitle}>
                                Select retainer Balance to adjust with Bills
                            </Text>
                        </View>
                    </View>

                    {items.map((item, index) => (
                        <View key={index} style={styles.itemCard}>

                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontFamily: "Gilroy-Bold",
                                    }}
                                >
                                    Item - {String(index + 1).padStart(2, "0")}
                                </Text>

                                <View style={styles.itemActionRow}>
                                    <TouchableOpacity
                                        style={[styles.iconBtn, styles.cloneBtn]}
                                        onPress={() => handleCloneRow(index)}
                                    >
                                        <Image source={RepeatIcon} style={styles.cloneIcon} />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.iconBtn, styles.deleteBtn]}
                                        onPress={() => handleDeleteRow(index)}
                                    >
                                        <Text style={styles.deleteIcon}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={styles.label}>
                                Item Detail
                            </Text>

                            <ValidatedInput
                                type="name"
                                inputType="text"
                                value={item.itemDetail}
                                onChangeText={(text) =>
                                    updateItem(index, "itemDetail", text)
                                }
                                placeholder="LED Tube Light"
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                            />

                            {errors[`itemDetail_${index}`] && (
                                <ErrorMessage
                                    message={errors[`itemDetail_${index}`]}
                                    type="error"
                                />
                            )}

                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View style={{ width: "48%" }}>
                                    <Text style={styles.label}>
                                        Quantity
                                    </Text>

                                    <ValidatedInput
                                        keyboardType="numeric"
                                        type="numberOnly"
                                        inputType="numeric"
                                        value={item.quantity}
                                        onChangeText={(text) =>
                                            updateItem(index, "quantity", text)
                                        }
                                        placeholder="0"
                                        placeholderTextColor="#9CA3AF"
                                        style={styles.input}
                                    />
                                    {errors[`quantity_${index}`] && (
                                        <ErrorMessage
                                            message={errors[`quantity_${index}`]}
                                            type="error"
                                        />
                                    )}
                                </View>

                                <View style={{ width: "48%" }}>
                                    <Text style={styles.label}>
                                        Unit
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.expensesDropdownBox}
                                        onPress={() => {
                                            setUnitsOpen(!unitsOpen)
                                        }}
                                    >
                                        <Text style={{ color: selectedUnits ? "#000" : "#9CA3AF" }}>
                                            {selectedUnits?.label || "Select Category"}

                                        </Text>
                                        <Image source={DownArrow} style={styles.expensesArrowIcon} />
                                    </TouchableOpacity>


                                    {errors.units && (
                                        <ErrorMessage
                                            message={errors.units}
                                            type="error"
                                        />
                                    )}

                                    {unitsOpen && (
                                        <View style={styles.expensesDropdownMenu}>
                                            <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                                                {unitsOptions?.length === 0 ? (
                                                    <Text style={styles.expensesNoDataText}>
                                                        No Units found
                                                    </Text>
                                                ) : (
                                                    unitsOptions?.map((item, index) => {
                                                        const isSelected =
                                                            selectedUnits?.value === item?.value;

                                                        return (
                                                            <TouchableOpacity
                                                                key={index}
                                                                style={[
                                                                    styles.expensesOption,
                                                                    isSelected && styles.expensesOptionSelected,
                                                                ]}
                                                                onPress={() => {
                                                                    setSelectedUnits(item);
                                                                    setCategoryErr("");
                                                                    setNochangeErr("");
                                                                    setUnitsOpen(false);

                                                                }}

                                                            >
                                                                <Text
                                                                    style={[
                                                                        styles.expensesOptionText,
                                                                        isSelected && styles.expensesOptionTextSelected,
                                                                    ]}
                                                                >
                                                                    {item?.label}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )
                                                    })


                                                )}
                                            </ScrollView>
                                        </View>
                                    )}


                                </View>
                            </View>

                            <Text style={styles.label}>
                                Per Unit price (INR)
                            </Text>

                            <ValidatedInput
                                keyboardType="numeric"
                                type="numberOnly"
                                inputType="numeric"
                                value={item.unitPrice}
                                onChangeText={(text) =>
                                    updateItem(index, "unitPrice", text)
                                }
                                placeholder="₹ 150"
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                            />

                            {errors[`unitPrice_${index}`] && (
                                <ErrorMessage
                                    message={errors[`unitPrice_${index}`]}
                                    type="error"
                                />
                            )}

                            <Text style={styles.label}>
                                Amount
                            </Text>

                            <ValidatedInput
                                editable={false}
                                value={String(
                                    (Number(item.quantity) || 0) *
                                    (Number(item.unitPrice) || 0)
                                )}
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                                keyboardType="numeric"
                                type="numberOnly"
                                inputType="numeric"
                            />
                        </View>
                    ))}


                    <TouchableOpacity
                        style={styles.addRowBtn}
                        onPress={handleAddRow}
                    >
                        <Text
                            style={{
                                color: "#2952FF",
                                fontFamily: "Gilroy-Bold",
                            }}
                        >
                            + Add New Row
                        </Text>
                    </TouchableOpacity>






                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold", }}>
                                Sub Total
                            </Text>

                            <Text style={{
                                fontSize: 16,
                                fontFamily: "Gilroy-Bold",
                                color: "#111827",
                            }}>
                                ₹ {itemTotal.toFixed(2)}
                            </Text>
                        </View>

                        <View style={styles.summaryInputRow}>


                            <View style={styles.rightInputWrapper}>
                                <View>
                                    <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold", }}>
                                        Tax Optional
                                    </Text>
                                </View>
                                <View style={{ alignItems: "flex-end", }}>
                                    {/* <ValidatedInput
                                        type="amount"
                                        placeholder="₹ 0.00"
                                        style={styles.taxInput}
                                    /> */}
                                    <ValidatedInput
                                        type="numberOnly"
                                        inputType="numeric"
                                        value={tax}
                                        onChangeText={setTax}
                                        placeholder="₹ 0.00"
                                        style={styles.taxInput}
                                    />
                                </View>

                            </View>
                        </View>

                        <View style={styles.summaryInputRow}>


                            <View style={styles.discountRow}>

                                <Text style={{ fontSize: 16, fontFamily: "Gilroy-Semibold", }}>
                                    Discount
                                </Text>
                                <View style={styles.discountToggle}>
                                    <TouchableOpacity
                                        style={[
                                            styles.discountBtn,
                                            discountType === "amount" &&
                                            styles.discountBtnActive,
                                        ]}
                                        onPress={() => setDiscountType("amount")}
                                    >
                                        <Text style={{ color: discountType === "amount" ? "#fff" : "#00000" }}>₹</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.discountBtn,
                                            discountType === "percentage" &&
                                            styles.discountBtnActive,
                                        ]}
                                        onPress={() => setDiscountType("percentage")}
                                    >
                                        <Text style={{ color: discountType === "percentage" ? "#fff" : "#00000" }}>%</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* <ValidatedInput
                                    type="amount"
                                    placeholder="₹ 0.00"
                                    style={styles.discountInput}
                                /> */}
                                <ValidatedInput
                                    type="numberOnly"
                                    inputType="numeric"
                                    value={discount}
                                    onChangeText={setDiscount}
                                    placeholder="₹ 0.00"
                                    style={styles.discountInput}
                                />
                            </View>
                        </View>

                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>
                                TOTAL RETAINER AMOUNT
                            </Text>
                            <Text style={styles.totalValue}>
                                ₹ {grandTotal.toFixed(2)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.footerRow}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontFamily: "Gilroy-Medium",
                                    color: "#1E1E1E",
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.submitBtn, isApplyTriggeredRef.current && { opacity: 0.6 }]}
                          disabled={isApplyTriggeredRef.current}
                            onPress={handleSubmit}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontFamily: "Gilroy-Semibold",
                                    color: "#FFF",
                                }}
                            >
                                Save & Allocate
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* <View style={styles.footerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}
                        style={styles.cancelBtn}
                    >
                        <Text style={{
                            fontFamily: "Gilroy-Bold",
                            fontSize: 16,
                        }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.submitBtn}
                    >
                        <Text style={styles.submitText}>
                            Add Vendor
                        </Text>
                    </TouchableOpacity>
                </View> */}

                </ScrollView>

            </View>

            {openPurchaseDate && (
                <View style={styles.dateOverlay}>
                    <TouchableWithoutFeedback onPress={() => setOpenPurchaseDate(false)}>
                        <View style={styles.overlayBg} />
                    </TouchableWithoutFeedback>

                    <View style={styles.calendarContainer}>
                        <Calendar
                            markingType="custom"
                            markedDates={{
                                ...markedDates,
                                ...(purchaseDate && {
                                    [purchaseDate]: {
                                        selected: true,
                                        selectedColor: "#2563EB",
                                        customStyles: {
                                            container: {
                                                backgroundColor: "#2563EB",
                                                borderRadius: 8,
                                            },
                                            text: {
                                                color: "#FFFFFF",
                                            },
                                        },
                                    },
                                }),
                            }}
                            current={purchaseDate || dayjs().format("YYYY-MM-DD")}
                            onDayPress={(day) => {
                                // 🚫 STOP FUTURE DATE CLICK
                                if (markedDates[day.dateString]?.disabled) return;

                                setPurchaseDate(day.dateString);
                                setOpenPurchaseDate(false);
                                setDateErr("");
                                setErrors(prev => ({ ...prev, expenseDate: "" }))
                            }}
                            theme={{
                                todayTextColor: "#2563EB",
                                arrowColor: "#111827",
                                textDisabledColor: "#9CA3AF",
                            }}
                        />
                    </View>
                </View>
            )}
        </>

    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 50
    },

    header: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },

    backBtn: {
        width: 18,
        height: 18,
        borderRadius: 8,
        backgroundColor: "#F5F7FB",
        justifyContent: "center",
        alignItems: "center",
    },

    headerTitle: {
        fontSize: 20,
        fontFamily: "Gilroy-Bold",
        marginLeft: 16,
    },

    content: {
        padding: 20,
        paddingBottom: 60,
        paddingTop: 10
    },

    title: { fontSize: 20, fontFamily: "Gilroy-Bold", marginBottom: 20 },

    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },

    profileContainer: {
        justifyContent: "center",
        alignItems: "center",
    },


    profileCircle: {
        width: 75,
        height: 75,
        borderRadius: 75 / 2,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },


    profileIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        resizeMode: "cover",
    },

    plusBadge: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 22,
        height: 22,
        borderRadius: 11,

        borderWidth: 1,
        borderColor: "#D6D6D6",
        justifyContent: "center",
        alignItems: "center",
    },

    plusText: {
        fontSize: 16,
        fontFamily: "Gilroy-Bold",
        color: "#000",
    },

    profileTitle: {
        fontSize: 14,
        fontFamily: "Gilroy-Bold",
        color: "#000",
    },

    profileSub: {
        fontSize: 12,
        color: "#777",
        marginTop: 4,
        lineHeight: 16,
    },


    profileImg: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#737373", },


    profileText: { fontSize: 14, fontFamily: "Gilroy-Bold", },
    subText: { color: "#777", fontSize: 12, lineHeight: 16, marginTop: 4 },

    //  label: {
    //   fontSize: 15,
    //   color: "#111827",
    //   marginBottom: 10,
    //   marginTop: 18,
    //   fontFamily: "Gilroy-Medium",
    // },
    // input: {
    //   height: 58,
    //   borderWidth: 1,
    //   borderColor: "#E5E7EB",
    //   borderRadius: 14,
    //   paddingHorizontal: 16,
    //   fontSize: 16,
    //   backgroundColor: "#FFF",
    // },
    // textArea: {
    //   height: 110,
    //   borderWidth: 1,
    //   borderColor: "#DCE3F1",
    //   borderRadius: 14,
    //   padding: 16,
    //   textAlignVertical: "top",
    //   fontSize: 16,
    // },
    // input: {
    //     height: 56,
    //     borderWidth: 1,
    //     borderColor: "#E5E7EB",
    //     borderRadius: 12,
    //     paddingHorizontal: 16,
    //     backgroundColor: "#FFFFFF",
    //     fontSize: 16,
    //     fontFamily: "Gilroy-Medium",
    //     color: "#111827",
    // },

    textArea: {
        minHeight: 110,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
        backgroundColor: "#FFFFFF",
        textAlignVertical: "top",
        fontSize: 16,
        fontFamily: "Gilroy-Medium",
        color: "#111827",
    },

    label: {
        fontSize: 15,
        fontFamily: "Gilroy-Medium",
        color: "#111827",
        marginBottom: 8,
        marginTop: 16,
    },

    selectBox: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 12,
        height: 48,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    selectText: { color: "#444" },
    arrow: { width: 18, height: 18, tintColor: "#444" },

    // footerRow: {
    //     flexDirection: "row",
    //     justifyContent: "flex-end",
    //     marginTop: 30,
    // },



    submitText: {
        color: "#FFF",
        fontSize: 16,
        fontFamily: "Gilroy-Bold",
    },
    noChangeWrapper: {
        width: "100%",
        alignItems: "center",
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 12,
    },

    noChangeInner: {
        width: "50%",
        alignItems: "center",
        justifyContent: 'center'
    },


    sheet: {
        backgroundColor: "#fff",
        padding: 20,
        // paddingRight:28,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        maxHeight: "98.5%",
    },


    cancel: { color: "#777", fontSize: 16, fontFamily: "Gilroy-Bold", },
    addBtn: {
        backgroundColor: "#4662FF",
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 12,
    },
    addBtnText: { color: "#fff", fontSize: 16, fontFamily: "Gilroy-Bold", },
    profileCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#E6E6E6",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
    },

    profileImg: {
        width: "100%",
        height: "100%",
        borderRadius: 35,
    },

    editBadge: {
        position: "absolute",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -16 }, { translateY: -16 }],
        elevation: 0
    },


    editIcon: {
        width: 20,
        height: 20,

    },
    // input: {
    //     height: 48,
    //     borderWidth: 1,
    //     borderColor: "#e1e1e1",
    //     borderRadius: 12,
    //     paddingHorizontal: 12,
    //     fontFamily: "Gilroy-Regular"
    // },

    select: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    arrowIcon: {
        position: "absolute",
        right: 12,
        top: 14,
        width: 18,
        height: 18,
        tintColor: "#777",
    },

    dropdownMenu: {
        // position: "absolute",
        top: 5,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        zIndex: 9999,
        elevation: 2,
        minHeight: 150,
        maxHeight: 200,
    },
    CountrydropdownMenu: {
        position: "absolute",
        top: 52,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        zIndex: 9999,
        elevation: 4,
        minHeight: 50,
        maxHeight: 120,
    },

    selectedOption: {
        backgroundColor: "#E3EEFF",
        borderRadius: 7
    },

    selectedOptionText: {
        color: "#2D6CDF",
        fontFamily: "Gilroy-Bold",
    },

    noResult: {
        padding: 12,
        textAlign: "center",
        color: "#6B7280",
    },


    option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    optionText: {
        fontSize: 15,
        color: "#000",
    },

    mobileWrapper: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 12,
        height: 48,
        overflow: "hidden",
    },

    countryCodeBox: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: "#e1e1e1",
        // backgroundColor: "#F9FAFB",
    },

    countryCodeText: {
        fontSize: 14,
        fontWeight: "600",
    },

    countryArrow: {
        width: 14,
        height: 14,
        marginLeft: 6,
        tintColor: "#555",
    },

    mobileInput: {
        flex: 1,
        paddingHorizontal: 12,
        fontSize: 14,
    },

    countryDropdown: {
        position: "absolute",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginTop: 10,
        zIndex: 9999,
    },

    dropdownOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    countryDropdownMenu: {
        position: "absolute",
        top: 355,
        left: 0,
        width: 180,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        elevation: 10,
        zIndex: 9999,
        maxHeight: 250,
    },
    countryOption: {
        paddingVertical: 12,
        paddingHorizontal: 12,
    },

    countryOptionText: {
        fontSize: 14,
        color: "#111",
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 20,
    },

    blueBar: {
        width: 4,
        height: 28,
        backgroundColor: "#2457FF",
        borderRadius: 10,
        marginRight: 12,
    },

    sectionTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
        color: "#111827",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    half: {
        width: "48%",
    },



    note: {
        color: "#64748B",
        marginTop: 6,
    },

    creditRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 20,
    },

    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#6D4AFF",
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    checkboxActive: {
        backgroundColor: "#6D4AFF",
    },

    creditTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Semibold"
    },

    creditSub: {
        marginTop: 5,
        color: "#64748B",
        fontFamily: "Gilroy-Regular"
    },

    creditNote: {
        color: "#64748B",
        marginTop: 10,
        lineHeight: 22,
    },

    toggleContainer: {
        flexDirection: "row",
        backgroundColor: "#EEF2FF",
        borderRadius: 10,
        padding: 4
    },

    toggleBtn: {
        flex: 1,
        height: 40,
        justifyContent: "center",
        alignItems: "center"
    },

    activeBtn: {
        backgroundColor: "#2952FF",
        borderRadius: 8
    },

    activeText: {
        color: "#FFF",
        fontFamily: "Gilroy-SemiBold"
    },


    summaryCard: {
        backgroundColor: "#F7F7F8",
        borderRadius: 20,
        marginTop: 20,
        overflow: "hidden",
        paddingTop: 10,
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 18,
    },

    summaryInputRow: {
        paddingHorizontal: 18,
        marginBottom: 20,
    },

    rightInputWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },

    taxInput: {
        width: 150,
        height: 54,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 13,
        backgroundColor: "#FFF",
        paddingLeft: 15,
    },

    discountInput: {
        width: 150,
        height: 54,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 13,
        backgroundColor: "#FFF",
        paddingLeft: 15
    },

    totalContainer: {
        marginTop: 10,
        backgroundColor: "#EEF1F5",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 22,
        paddingVertical: 24,
    },

    totalLabel: {
        fontSize: 15,
        fontFamily: "Gilroy-Bold",
        color: "#475569",
    },

    totalValue: {
        fontSize: 20,
        fontFamily: "Gilroy-Bold",
        color: "#111827",
    },

    discountRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    discountToggle: {
        flexDirection: "row",
        backgroundColor: "#E9EEFF",
        borderRadius: 10,
        padding: 4,
        width: 85,
        height: 40,
    },

    discountBtn: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },

    discountBtnActive: {
        backgroundColor: "#2952FF",
    },

    discountBtnText: {
        color: "#1E1E1E",
        fontFamily: "Gilroy-Bold",
    },

    discountBtnTextActive: {
        color: "#FFFFFF",
        fontFamily: "Gilroy-Bold",
    },






    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderColor: "#E2E8F0",
        paddingTop: 16
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 20,
    },

    cancelBtn: {
        width: "26%",
        height: 54,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8
    },

    submitBtn: {
        width: "48%",
        height: 54,
        backgroundColor: "#2952FF",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },

    // cancelBtn: {
    //     flex: 1,
    //     height: 52,
    //     justifyContent: "center",
    //     alignItems: "center"
    // },

    // submitBtn: {
    //     flex: 1,
    //     height: 52,
    //     backgroundColor: "#2952FF",
    //     borderRadius: 12,
    //     marginLeft: 12
    // },
    //     sectionTitle:{
    //  fontSize:28,
    //  fontFamily:"Gilroy-Bold",
    //  color:"#1E1E1E"
    // },

    // label: {
    //     fontSize: 16,
    //     fontFamily: "Gilroy-Medium",
    //     color: "#1E1E1E",
    //     marginBottom: 8
    // },

    input: {
        height: 54,
        borderWidth: 1,
        borderColor: "#E4E4E7",
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: "#FFF"
    },

    select: {
        height: 54,
        borderWidth: 1,
        borderColor: "#E4E4E7",
        borderRadius: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
    ,
    itemCard: {
        borderWidth: 1,
        borderColor: "#ECECEC",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        backgroundColor: "#FFF"
    },
    vendorSection: {
        marginTop: 18,
    },

    vendorLabel: {
        fontSize: 16,
        fontFamily: "Gilroy-Medium",
        marginBottom: 12,
    },

    vendorToggle: {
        flexDirection: "row",
        backgroundColor: "#EEF2FF",
        borderRadius: 12,
        padding: 4,
    },

    vendorOption: {
        flex: 1,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },

    activeVendorOption: {
        backgroundColor: "#2952FF",
    },

    vendorOptionText: {
        color: "#111827",
        fontFamily: "Gilroy-Medium",
    },

    activeVendorOptionText: {
        color: "#FFFFFF",
        fontFamily: "Gilroy-Bold",
    },

    radioRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },

    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#D1D5DB",
        justifyContent: "center",
        alignItems: "center",
    },

    radioOuterActive: {
        borderColor: "#2952FF",
    },

    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#2952FF",
    },

    radioText: {
        marginLeft: 10,
        fontSize: 15,
        color: "#111827",
    },

    uploadBox: {
        height: 90,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
    },

    uploadText: {
        color: "#2952FF",
        fontFamily: "Gilroy-SemiBold",
    },

    uploadSub: {
        color: "#94A3B8",
        marginTop: 4,
        fontSize: 12,
    },
    sectionSubTitle: {
        fontSize: 14,
        color: "#64748B",
        marginTop: 2,
        fontFamily: "Gilroy-Regular",
    },

    itemCard: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        padding: 16,
        backgroundColor: "#FFFFFF",
        marginBottom: 16,
    },

    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    itemTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Bold",
        color: "#111827",
    },

    itemActionRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },

    cloneBtn: {
        backgroundColor: "#fff",
    },

    deleteBtn: {
        backgroundColor: "#FFF1F2",
    },

    cloneIcon: {
        height: 18, width: 18,
        color: "#111827",
    },

    deleteIcon: {
        fontSize: 18,
        color: "#EF4444",
    },

    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    halfField: {
        width: "48%",
    },

    amountBox: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: "#BFD0FF",
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
    },

    amountInput: {
        color: "#111827",
        fontFamily: "Gilroy-Bold",
    },

    addRowBtn: {
        height: 52,
        borderRadius: 12,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 20,
    },

    addRowText: {
        color: "#2952FF",
        fontSize: 16,
        fontFamily: "Gilroy-Bold",
    },

    expensesDropdownBox: {
        borderWidth: 1,
        borderColor: "#D4D4D4",
        borderRadius: 10,
        padding: 14,
        marginTop: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
    },

    expensesArrowIcon: {
        width: 18,
        height: 18,
        tintColor: "#6A6A6A",
    },

    expensesDropdownMenu: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 10,
        backgroundColor: "#fff",
        overflow: "hidden",
        elevation: 6,
        zIndex: 999,
    },

    expensesOption: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    expensesOptionSelected: {
        backgroundColor: "#1D5BEE",
    },

    expensesOptionText: {
        fontSize: 15,
        color: "#111",
    },

    expensesOptionTextSelected: {
        color: "#fff",
        fontWeight: "600",
    },

    expensesNoDataText: {
        paddingVertical: 14,
        textAlign: "center",
        color: "#9CA3AF",
        fontSize: 14,
    },
    calendarIcon: { width: 22, height: 22, tintColor: "#676767" },
    dateInputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        height: 48,
        paddingHorizontal: 12,
        marginTop: 6,
    },

    dateInput: {
        flex: 1,
        fontSize: 14,
        color: "#111827",
    },

    dateOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },

    overlayBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },

    calendarContainer: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 10,
        width: "85%",
        elevation: 10,
    },
    previewCard: {
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#FFF",
    },

    previewImage: {
        width: "100%",
        height: 220,
        resizeMode: "cover",
    },

    fileInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
    },

    fileName: {
        fontSize: 15,
        fontFamily: "Gilroy-Semibold",
    },

    fileSize: {
        color: "#6B7280",
        marginTop: 4,
    },

    deleteBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: "#FFF1F0",
        justifyContent: "center",
        alignItems: "center",
    },

    thumbnailRow: {
        marginTop: 12,
        marginHorizontal: 16,
    },

    thumbImage: {
        width: 90,
        height: 70,
        borderRadius: 8,
        marginRight: 10,
    },

    addMore: {
        color: "#2D5BFF",
        marginTop: 10,
        textAlign: "right",
        fontFamily: "Gilroy-Semibold",
    },

});