import React, { useRef, useState,useEffect , useContext , useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Image,
    Animated,
    PanResponder,
    ScrollView,
    BackHandler
} from "react-native";
import Calendar from "../../../Assets/Images/calendar.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import { AssetContext } from "../../../Context/AssetContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { BankingContext } from "../../../Context/BankingContext";
import { VendorContext } from "../../../Context/VendorContext";
import { useFocusEffect } from '@react-navigation/native';

export default function AddAssetSheet({ onClose, title = "Add Assets",  asset: currentItem, }) {

  const { addAsset, loading, errorMsg , handleUpdateAsset , getAllAssets} = useContext(AssetContext);
      const { activeHostelId } = useContext(CommonContexts);
        const {bankList, getBankListByHostel } = useContext(BankingContext);
         const {
            vendorList,
            getVendorList,
            addVendor,
            updateVendor,
            deleteVendor,
          } = useContext(VendorContext);

           console.log("vendorList", vendorList);

           const isEdit = !!currentItem;

           const [initialState, setInitialState] = useState(null);


 useEffect(() => {
  if (currentItem) {
    setAssetName(currentItem.assetName || "");
    setProductName(currentItem.productName || "");
    setBrandName(currentItem.brandName || "");
    setSerialNumber(currentItem.serialNumber || "");
    setPrice(String(currentItem.price || ""));
    setSelectedVendorId(currentItem.vendorId || null);
    setSelectedMode(currentItem.bankingId || "");

    setPurchaseDate(
      currentItem.purchaseDate
        ? dayjs(currentItem.purchaseDate, "DD-MM-YYYY").toDate()
        : null
    );

    setInitialState({
      assetName: currentItem.assetName || "",
      productName: currentItem.productName || "",
      brandName: currentItem.brandName || "",
      serialNumber: currentItem.serialNumber || "",
      price: String(currentItem.price || ""),
      vendorId: currentItem.vendorId || null,
      bankingId: currentItem.bankingId || "",
      purchaseDate: currentItem.purchaseDate
        ? dayjs(currentItem.purchaseDate, "DD-MM-YYYY")
        : null,
    });
  }
}, [currentItem]);


const isChanged = () => {
  if (!initialState) return true;

  return (
    initialState.assetName !== assetName ||
    initialState.productName !== productName ||
    initialState.brandName !== brandName ||
    initialState.serialNumber !== serialNumber ||
    Number(initialState.price) !== Number(price) ||
    initialState.vendorId !== selectedVendorId ||
    (
      initialState.purchaseDate &&
      purchaseDate &&
      !dayjs(initialState.purchaseDate).isSame(purchaseDate, "day")
    )
  );
};




      
    const translateY = useRef(new Animated.Value(0)).current;
    const vendors = ["Vendor 1", "Vendor 2", "Vendor 3", "Vendor 4", "Vendor 5"];
    const [vendorOpen, setVendorOpen] = useState(false);
    const [vendorSelected, setVendorSelected] = useState("Select a Vendor");
    const [openDatePicker, setOpenDatePicker] = useState(false);

    const [selectedVendorId, setSelectedVendorId] = useState(null);
const [showVendorDropdown, setShowVendorDropdown] = useState(false);

    // const [purchaseDate, setPurchaseDate] = useState(dayjs());
    const [purchaseDate, setPurchaseDate] = useState(null);
    


    const [brandName, setBrandName] = useState("");
const [serialNumber, setSerialNumber] = useState("");



    const [assetName, setAssetName] = useState("");
const [productName, setProductName] = useState("");
const [price, setPrice] = useState("");
const [paymentMode, setPaymentMode] = useState("");
const [paymentOpen, setPaymentOpen] = useState(false);
const [selectedMode, setSelectedMode] = useState("");
const [showPaymentMode, setShowPaymentMode] = useState(false);
const [modeError, setModeError] = useState("");

const [showSuccessModal, setShowSuccessModal] = useState(false);
const [modalMessage, setModalMessage] = useState("");
const [modalType, setModalType] = useState("success");

const paymentModes = ["Cash", "UPI", "Card", "Bank Transfer"];



const [errors, setErrors] = useState({});

    useEffect(() => {
  if (activeHostelId) {
    getBankListByHostel(activeHostelId);
  }
}, [activeHostelId]);

  useFocusEffect(
    useCallback(() => {
      if (activeHostelId) {
        getVendorList(activeHostelId);
      }
    }, [activeHostelId])
  );

useEffect(() => {
  const backAction = () => {
    onClose();   
    return true;
  };

  const handler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => handler.remove();
}, [onClose]);

const vendorOptions = (vendorList || [])?.map((v) => ({
  label: v?.fullName,
  value: v?.id,
}));


const transactionOptions = (bankList || [])?.map((item) => ({
  label: `${item?.accountHolderName || "Account"} - ${item?.accountType}`,
  value: item?.bankingId,
}));


const clearApiError = () => {
  if (errors.api) {
    setErrors((prev) => ({ ...prev, api: "" }));
  }
};


const validateForm = () => {
  let newErrors = {};

  if (!assetName.trim()) {
    newErrors.assetName = "Please Enter Asset Name"
  }

  if (!productName.trim()) {
    newErrors.productName = "Please Enter Product Name"
  }

  if (!purchaseDate) {
    newErrors.purchaseDate = "Please Select Purchase date"
  }

  if (!price.trim()) {
    newErrors.price = "Please Enter Price"
  } else if (isNaN(price)) {
    newErrors.price = "Price must be a number"
  }

 if (!isEdit && !selectedMode) {
  newErrors.paymentMode = "Please Select Transaction mode";
}


  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
};

 const todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999);


const handleSubmit = async () => {
  if (!validateForm()) return;

  if (isEdit && !isChanged()) {
    setErrors({ api: "No Changes Detected" });
    return;
  }

const payload = {
  hostelId: activeHostelId,
  assetName,
  productName,
  vendorId: selectedVendorId || undefined,
  brandName,
  serialNumber,
  purchaseDate: dayjs(purchaseDate).format("DD-MM-YYYY"),
  price,
}

if (!isEdit) {
  payload.bankingId = selectedMode;
}

if (isEdit) {
  payload.assetId = currentItem.assetId;
}


if (isEdit) {
  const res = await handleUpdateAsset(payload);

  if (res?.success) {
    setModalType("success");
    setModalMessage("Asset updated successfully");
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      onClose();
    }, 1500);

    return;
  }

  setModalType("warning");
  setModalMessage(res?.message || "Something went wrong");
  setShowSuccessModal(true);

  setTimeout(() => {
    setShowSuccessModal(false);
  }, 1500);

  return;
}

  // ✅ ADD FLOW
  const res = await addAsset(payload);

  if (res?.success) {
    setModalType("success");
    setModalMessage(res?.message || "Asset added successfully");
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      onClose();
    }, 1500);
  } else {
    setErrors({ api: res?.message });
  }
};





    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) translateY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 120) {
                    Animated.timing(translateY, {
                        toValue: 600,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(onClose);
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
     
      <>
      
                <SuccessModal
  visible={showSuccessModal}
  onClose={() => setShowSuccessModal(false)}
  message={modalMessage}
  type={modalType}
/>

        <View style={styles.overlay}>

            <TouchableWithoutFeedback onPress={onClose}>
                <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <Animated.View
                style={[styles.sheet, { transform: [{ translateY }] }]}
                {...panResponder.panHandlers}
            >
                <View style={styles.handle} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    scrollEnabled={!vendorOpen}
                    nestedScrollEnabled={true}
                >

                    <Text style={styles.title}>{title}</Text>


                    <Text style={styles.label}>Asset Name  <Text style={{ color: "red" }}>*</Text></Text>
                   <TextInput
  style={[styles.input, ]}
  placeholder="Enter Asset"
  value={assetName}
  onChangeText={(t) => {
    setAssetName(t);
    setErrors({ ...errors, assetName: "" });
     clearApiError();
  }}
/>
  {errors.assetName && (
                    <ErrorMessage message={errors.assetName} type="error" />
                                )}


                    <Text style={styles.label}>Product Name  <Text style={{ color: "red" }}>*</Text></Text>
                 <TextInput
  style={[styles.input,]}
  placeholder="Enter Product name"
  value={productName}
  onChangeText={(t) => {
    setProductName(t);
    setErrors({ ...errors, productName: "" });
     clearApiError();
  }}
/>

  {errors.productName && (
                    <ErrorMessage message={errors.productName} type="error" />
                                )}


              <Text style={styles.label}>Vendor Name</Text>

<TouchableOpacity
  style={styles.inputBox}
  onPress={() => setShowVendorDropdown((v) => !v)}
>
  <Text style={{ fontSize: 15 }}>
    {selectedVendorId
      ? vendorOptions.find(v => v.value === selectedVendorId)?.label
      : "Select a Vendor"}
  </Text>

  <Image
    source={DownArrow}
    style={{ width: 18, height: 18, tintColor: "#555" }}
  />
</TouchableOpacity>

{showVendorDropdown && (
  <View style={styles.transactiondropdown}>
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      scrollEnabled={vendorOptions.length > 3}
    >
      {vendorOptions.length > 0 ? (
        vendorOptions.map((opt) => {
          const isSelected = selectedVendorId === opt.value;

          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.dropdownRow,
                isSelected && styles.dropdownRowSelected,
              ]}
              onPress={() => {
                setSelectedVendorId(opt.value);
                setShowVendorDropdown(false);
                 clearApiError();
              }}
            >
              <Text
                style={
                  isSelected
                    ? styles.dropdownTextSelected
                    : styles.dropdownText
                }
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={{ padding: 12, color: "#777" }}>
          No vendors available
        </Text>
      )}
    </ScrollView>
  </View>
)}



                    <Text style={styles.label}>Brand name</Text>
                   <TextInput
  style={styles.input}
  placeholder="Enter Brand Name"
  value={brandName}
onChangeText={(t) => {
  setBrandName(t);
  clearApiError();
}}
/>


                    <Text style={styles.label}>Serial number</Text>
                  <TextInput
  style={styles.input}
  placeholder="Enter Serial Number"
  value={serialNumber}
onChangeText={(t) => {
  setSerialNumber(t);
  clearApiError();
}}
/>



                   <Text style={styles.label}>
  Purchase Date <Text style={{ color: "red" }}>*</Text>
</Text>

<TouchableOpacity
  style={styles.dateBox}
  onPress={() => setOpenDatePicker(true)}
>
  <Text style={styles.placeholder}>
    {purchaseDate
      ? dayjs(purchaseDate).format("DD-MM-YYYY")
      : "DD-MM-YYYY"}
  </Text>

  <Image source={Calendar} style={styles.calendarIcon} />
</TouchableOpacity>

{errors.purchaseDate && (
  <ErrorMessage message={errors.purchaseDate} type="error" />
)}




  




                    <Text style={styles.label}>Price  <Text style={{ color: "red" }}>*</Text></Text>
                  <TextInput
  style={[styles.input, ]}
  placeholder="Enter price"
  keyboardType="numeric"
  value={price}
  onChangeText={(t) => {
    setPrice(t);
    setErrors({ ...errors, price: "" });
     clearApiError();
  }}
/>
  {errors.price && (
                    <ErrorMessage message={errors.price} type="error" />
                                )}
{/* {errors.price && <Text style={styles.errorText}>{errors.price}</Text>} */}


    
  {!isEdit && (
  <>
    <Text style={styles.label}>
      Transaction Mode <Text style={{ color: "red" }}>*</Text>
    </Text>

    <TouchableOpacity
      style={styles.inputBox}
      onPress={() => {
        setModeError("");
        setShowPaymentMode((v) => !v);
      }}
    >
      <Text style={{ fontSize: 15 }}>
        {selectedMode
          ? transactionOptions.find(o => o.value === selectedMode)?.label
          : "Select mode"}
      </Text>

      <Image
        source={DownArrow}
        style={{ width: 18, height: 18, tintColor: "#555" }}
      />
    </TouchableOpacity>

    {showPaymentMode && (
      <View style={styles.transactiondropdown}>
        <ScrollView nestedScrollEnabled>
          {transactionOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => {
                setSelectedMode(opt.value);
                setShowPaymentMode(false);
                   clearApiError();
              }}
            >
              <Text>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}

    {errors.paymentMode && (
      <ErrorMessage message={errors.paymentMode} type="error" />
    )}
  </>
)}


{errors.api && (
  <ErrorMessage message={errors.api} type="error" />
)}

{errorMsg && (
  <ErrorMessage message={errorMsg} type="error" />
)}


 {/* {modeError && (
                    <ErrorMessage message={modeError} type="error" />
                                )}



{errors.api && (
  <ErrorMessage message={errors.api} type="error" />
)}

{errorMsg ? (
  <ErrorMessage message={errorMsg} type="error" />
) : null} */}



                    <View style={styles.footerBtnRow}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancel}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.addBtn} onPress={handleSubmit}>
                            <Text style={styles.addBtnText}>{title}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </Animated.View>
{openDatePicker && (
  <View style={styles.sheetOverlay}>
    <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>

    <View style={styles.datePickerBox}>


<DatePicker
  mode="single"
  value={purchaseDate}          // Date | null
  maximumDate={todayEnd}        // ✅ future dates FULLY disabled
  onChange={(params) => {
    if (params?.date) {
      setPurchaseDate(params.date);   // JS Date
      setErrors({ ...errors, purchaseDate: "" });
    }
    setOpenDatePicker(false);
  }}
/>




    </View>
  </View>
)}

        </View>

         </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        maxHeight: "88%",
    },
    handle: {
        width: 60,
        height: 5,
        backgroundColor: "#d1d1d1",
        alignSelf: "center",
        borderRadius: 20,
        marginBottom: 15,
        marginTop: 8
    },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 18 },

    label: { fontSize: 14, color: "#444", marginBottom: 6, marginTop: 12 },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 12,
        paddingHorizontal: 12,
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

    selectText: { color: "#555" },
    arrow: { width: 18, height: 18, tintColor: "#777" },

    dateBox: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        borderRadius: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    placeholder: { color: "#555" },
    calendarIcon: { width: 20, height: 20, tintColor: "#444" },

    footerBtnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        marginBottom: 10
    },

    cancel: {
        fontSize: 16,
        color: "#777",
    },

    addBtn: {
        backgroundColor: "#1E45E1",
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 12,
    },
    addBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    dropdownMenu: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        zIndex: 999,
        elevation: 10,
    },

    option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    optionText: {
        fontSize: 15,
        color: "#000",
    },


    datePickerBox: {
        backgroundColor: "#fff",
        width: "80%",

        borderRadius: 20,
        padding: 10,
        marginBottom: 90
    },

    fullDateOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 10,

        justifyContent: "flex-end",
        zIndex: 9999,
        elevation: 20,
    },

    datePickerPopup: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
        width: "100%",
    },
    sheetOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
errorText: {
  color: "red",
  fontSize: 12,
  marginTop: 4,
},

errorInput: {
  borderColor: "red",
},


inputBox: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
transactiondropdown: {
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E6E6E6",
  backgroundColor: "#fff",
  marginTop: 2,
  overflow: "hidden",

  // default → multiple items ku
  // minHeight: 130,
  maxHeight: 130,

  ...Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    android: { elevation: 3 },
  }),
},


dropdownRow: {
  paddingVertical: 12,
  paddingHorizontal: 14,
},

dropdownRowSelected: {
  backgroundColor: "#1E45E1", 
},

dropdownText: {
  color: "#111",
  fontSize: 15,
},

dropdownTextSelected: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
},


arrow: { fontSize: 18, color: "#555" },

});
