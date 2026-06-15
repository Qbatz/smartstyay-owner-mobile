import React, { useRef, useState, useEffect, useContext } from "react";
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
import { CustomerContext } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ProfilePlaceholder from "../../../Assets/Images/userAdd.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import ArrowLeft from "../../../Assets/Images/directionleft.png";
import ValidatedInput from "../ValidatedInput"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import { useCustomer } from "../../../Context/CustomerContext";
import ImagePickerSheet from "../../Customer/CustomerOverview/ImagePickerSheet";
import CalendarIcon from "../../../Assets/Images/calendar.png";

export default function AddExpensesPage({ vendorData, navigation }) {

    const { addVendor, updateVendor, getVendorList } = useContext(CustomerContext);;
    const { activeHostelId } = useContext(CommonContexts);

    const translateY = useRef(new Animated.Value(0)).current;

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
};


const handleCloneRow = (index) => {
  const clonedItem = {
    ...items[index],
  };

  const updated = [...items];
  updated.splice(index + 1, 0, clonedItem);

  setItems(updated);
};

const handleDeleteRow = (index) => {
  if (items.length === 1) {
    setItems([emptyItem]);
    return;
  }

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
    const [creditPeriod, setCreditPeriod] = useState("");

    return (


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
                    onChangeText={setExpenseTitle}
                    placeholder="Vegetables 70 KG"
                    maxLength={50}
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                />

                <Text style={styles.note}>
                    Note : Max 50 Characters
                </Text>

                <View style={{
                    flexDirection: "row",
                    gap: 10, marginTop: 10, marginBottom: 5
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>
                            Category <Text style={{ color: "red" }}>*</Text>
                        </Text>

                        <TouchableOpacity style={styles.select}>
                            <Text>
                                {vendorCategory || "Food & Groceries"}
                            </Text>

                            <Image
                                source={DownArrow}
                                style={styles.arrow}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>
                            Sub Category <Text style={{ color: "red" }}>*</Text>
                        </Text>

                        <TouchableOpacity style={styles.select}>
                            <Text>
                                {subCategory || "Vegetables"}
                            </Text>

                            <Image
                                source={DownArrow}
                                style={styles.arrow}
                            />
                        </TouchableOpacity>
                    </View>
                </View>


                <Text style={styles.label}>
                    Amount (INR)
                    <Text style={styles.required}> *</Text>
                </Text>

                <ValidatedInput
                    type="amount"
                    inputType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="₹ 5,500"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                />


                <Text style={styles.label}>
                    Expense Date <Text style={styles.required}>*</Text>
                </Text>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row', justifyContent: 'space-between', height: 56,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        backgroundColor: "#FFFFFF",
                        fontSize: 16,
                        fontFamily: "Gilroy-Medium", alignItems: 'center',
                        color: "#111827",
                    }}


                >
                    <Text>
                        {expenseDate || "10 July 2026"}
                    </Text>

                    <Image
                        source={CalendarIcon}
                        style={{ height: 14, width: 14 }}
                    />
                </TouchableOpacity>

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
      height: 48,
      backgroundColor: "#EEF2FF",
      borderRadius: 14,
      padding: 6,
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
                            Payment method <Text style={styles.required}>*</Text>
                        </Text>

                        <TouchableOpacity style={styles.select}>
                            <Text>G Pay UPI (smartstay@oksbi)</Text>
                            <Image source={DownArrow} style={styles.arrow} />
                        </TouchableOpacity>

                        <Text style={styles.label}>Transaction ID</Text>

                        <TouchableOpacity style={styles.select}>
                            <Text>1328H202511</Text>
                            <Image source={DownArrow} style={styles.arrow} />
                        </TouchableOpacity>
                    </>
                )}


                {linkVendor && (
                    <>
                        <Text style={styles.label}>
                            Vendor <Text style={styles.required}>*</Text>
                        </Text>

                        <TouchableOpacity style={styles.select}>
                            <Text>Kural Kaikani Angadi</Text>
                            <Image source={DownArrow} style={styles.arrow} />
                        </TouchableOpacity>

                        <Text style={styles.label}>
                            Payment Status <Text style={styles.required}>*</Text>
                        </Text>

                        <View style={{ marginTop: 10 }}>
                            {[
                                "Fully Paid",
                                "Partially Paid",
                                "Credit / Pending",
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
        styles.label,
        {
          height: 52,
          textAlignVertical: "top",
        },
      ]}
    >
      Paid Amount (INR)
      <Text style={{ color: "red" }}> *</Text>
    </Text>

    <ValidatedInput
      value={paidAmount}
      onChangeText={setPaidAmount}
      placeholder="₹ 2,500"
      type="amount"
      style={styles.input}
    />
  </View>

  <View style={{ width: "48%" }}>
    <Text
      style={[
        styles.label,
        {
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
    />
  </View>
</View>
)}

                        <Text style={styles.label}>
                            Payment method <Text style={{ color: "red" }}>*</Text>
                        </Text>

                        <TouchableOpacity style={styles.select}>
                            <Text>G Pay UPI (smartstay@oksbi)</Text>
                            <Image source={DownArrow} style={styles.arrow} />
                        </TouchableOpacity>

                        <Text style={styles.label}>
                            Transaction ID
                        </Text>

                        <TouchableOpacity style={styles.select}>
                            <Text>1328H202511</Text>
                            <Image source={DownArrow} style={styles.arrow} />
                        </TouchableOpacity>

                        <Text style={styles.label}>
                            Attachments/Proofs (If any)
                        </Text>

                        <TouchableOpacity style={styles.uploadBox}>
                            <Text style={styles.uploadText}>
                                Choose Image
                            </Text>

                            <Text style={styles.uploadSub}>
                                JPG/JPEG Format
                            </Text>
                        </TouchableOpacity>
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
    <Text style={styles.cloneIcon}>⧉</Text>
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
      value={item.itemDetail}
      onChangeText={(text) =>
        updateItem(index, "itemDetail", text)
      }
      placeholder="LED Tube Light"
                          placeholderTextColor="#9CA3AF"
                    style={styles.input}
    />

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
          type="amount"
          value={item.quantity}
          onChangeText={(text) =>
            updateItem(index, "quantity", text)
          }
          placeholder="0"
                              placeholderTextColor="#9CA3AF"
                    style={styles.input}
        />
      </View>

      <View style={{ width: "48%" }}>
        <Text style={styles.label}>
          Unit
        </Text>

        <TouchableOpacity style={styles.select}>
          <Text>
            {item.unit || "Nos"}
          </Text>

          <Image
            source={DownArrow}
            style={styles.arrow}
          />
        </TouchableOpacity>
      </View>
    </View>

    <Text style={styles.label}>
      Per Unit price (INR)
    </Text>

    <ValidatedInput
      type="amount"
      value={item.unitPrice}
      onChangeText={(text) =>
        updateItem(index, "unitPrice", text)
      }
      placeholder="₹ 150"
                          placeholderTextColor="#9CA3AF"
                    style={styles.input}
    />

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
    <Text style={styles.summaryLabel}>
      Sub Total
    </Text>

    <Text style={styles.summaryValue}>
      ₹ 1,600.00
    </Text>
  </View>

  <View style={styles.summaryInputRow}>
    <Text style={styles.summaryLabel}>
      Tax Optional
    </Text>

    <ValidatedInput
      type="amount"
      placeholder="₹ 0.00"
      style={styles.summaryInput}
    />
  </View>

  <View style={styles.summaryInputRow}>
    <Text style={styles.summaryLabel}>
      Discount
    </Text>

    <View style={styles.discountRow}>
      <View style={styles.discountToggle}>
        <TouchableOpacity
          style={[
            styles.discountBtn,
            styles.discountBtnActive,
          ]}
        >
          <Text style={styles.discountBtnTextActive}>
            ₹
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.discountBtn}
        >
          <Text style={styles.discountBtnText}>
            %
          </Text>
        </TouchableOpacity>
      </View>

      <ValidatedInput
        type="amount"
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
      ₹ 1,600.00
    </Text>
  </View>
</View>

                <View style={styles.footerRow}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitBtn}>
                        <Text style={{ color: "#FFF" }}>
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
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Gilroy-Medium",
        color: "#111827",
    },

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

    cancelBtn: {
        width: 110,
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    submitBtn: {
        width: 160,
        height: 52,
        borderRadius: 12,
        backgroundColor: "#2457FF",
        justifyContent: "center",
        alignItems: "center",
    },

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
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 12,
        paddingHorizontal: 12,
        fontFamily: "Gilroy-Regular"
    },

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
  backgroundColor: "#F8F9FB",
  borderRadius: 16,
  overflow: "hidden",
  marginTop: 20,
},

summaryRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingTop: 20,
  paddingBottom: 10,
},

summaryInputRow: {
  paddingHorizontal: 16,
  marginTop: 10,
},

summaryLabel: {
  fontSize: 16,
  color: "#1E1E1E",
  fontFamily: "Gilroy-Medium",
  marginBottom: 12,
},

summaryValue: {
  fontSize: 18,
  color: "#1E1E1E",
  fontFamily: "Gilroy-Bold",
},

summaryInput: {
  height: 56,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  backgroundColor: "#FFF",
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
  width: 115,
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

discountInput: {
  width: "58%",
  height: 56,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  backgroundColor: "#FFF",
},

totalContainer: {
  marginTop: 20,
  backgroundColor: "#EEF1F5",
  paddingHorizontal: 16,
  paddingVertical: 20,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

totalLabel: {
  fontSize: 16,
  color: "#475569",
  fontFamily: "Gilroy-Bold",
},

totalValue: {
  fontSize: 20,
  color: "#111827",
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
        justifyContent: "space-between",
        marginTop: 24
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

    label: {
        fontSize: 16,
        fontFamily: "Gilroy-Medium",
        color: "#1E1E1E",
        marginBottom: 8
    },

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
  backgroundColor: "#F8FAFC",
},

deleteBtn: {
  backgroundColor: "#FFF1F2",
},

cloneIcon: {
  fontSize: 18,
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
});