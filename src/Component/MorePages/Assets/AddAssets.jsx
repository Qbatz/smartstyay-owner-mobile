import React, { useRef, useState,useEffect } from "react";
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


export default function AddAssetSheet({ onClose, title = "Add Assets" }) {
      
    const translateY = useRef(new Animated.Value(0)).current;
    const vendors = ["Vendor 1", "Vendor 2", "Vendor 3", "Vendor 4", "Vendor 5"];
    const [vendorOpen, setVendorOpen] = useState(false);
    const [vendorSelected, setVendorSelected] = useState("Select a Vendor");
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [purchaseDate, setPurchaseDate] = useState(dayjs());


    const [assetName, setAssetName] = useState("");
const [productName, setProductName] = useState("");
const [price, setPrice] = useState("");
const [paymentMode, setPaymentMode] = useState("");
const [paymentOpen, setPaymentOpen] = useState(false);

const paymentModes = ["Cash", "UPI", "Card", "Bank Transfer"];


const [errors, setErrors] = useState({});


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

  if (!paymentMode) {
    newErrors.paymentMode = "Please Select Payment mode"
  }
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
};


const handleSubmit = () => {
  if (!validateForm()) return;
  console.log("Form submitted");
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


                    <Text style={styles.label}>Asset Name</Text>
                   <TextInput
  style={[styles.input, ]}
  placeholder="Asset 1"
  value={assetName}
  onChangeText={(t) => {
    setAssetName(t);
    setErrors({ ...errors, assetName: "" });
  }}
/>
  {errors.assetName && (
                    <ErrorMessage message={errors.assetName} type="error" />
                                )}


                    <Text style={styles.label}>Product Name</Text>
                 <TextInput
  style={[styles.input,]}
  placeholder="Enter Product name"
  value={productName}
  onChangeText={(t) => {
    setProductName(t);
    setErrors({ ...errors, productName: "" });
  }}
/>

  {errors.productName && (
                    <ErrorMessage message={errors.productName} type="error" />
                                )}


                    <Text style={styles.label}>Vendor name</Text>

                    <View style={{ position: "relative" }}>
                        <TouchableOpacity
                            style={styles.select}
                            onPress={() => setVendorOpen(!vendorOpen)}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.selectText}>{vendorSelected}</Text>
                            <Image source={DownArrow} style={styles.arrow} />
                        </TouchableOpacity>

                        {vendorOpen && (
                            <View style={styles.dropdownMenu}>
                                <ScrollView style={{ maxHeight: 160 }}>
                                    {vendors.map((v, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.option}
                                            onPress={() => {
                                                setVendorSelected(v);
                                                setVendorOpen(false);
                                            }}
                                        >
                                            <Text style={styles.optionText}>{v}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>


                    <Text style={styles.label}>Brand name</Text>
                    <TextInput style={styles.input} placeholder="Vendor 1" />

                    <Text style={styles.label}>Serial number</Text>
                    <TextInput style={styles.input} placeholder="Vendor 1" />


                    <Text style={styles.label}>Purchase Date</Text>

                    <TouchableOpacity
                        style={styles.dateBox}
                        onPress={() => setOpenDatePicker(true)}
                    >
                        <Text style={styles.placeholder}>
                            {purchaseDate ? dayjs(purchaseDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                        </Text>
                        <Image source={Calendar} style={styles.calendarIcon} />
                    </TouchableOpacity>



   {errors.purchaseDate && (
                    <ErrorMessage message={errors.purchaseDate} type="error" />
                                )}




                    <Text style={styles.label}>Price</Text>
                  <TextInput
  style={[styles.input, ]}
  placeholder="Enter price"
  keyboardType="numeric"
  value={price}
  onChangeText={(t) => {
    setPrice(t);
    setErrors({ ...errors, price: "" });
  }}
/>
  {errors.price && (
                    <ErrorMessage message={errors.price} type="error" />
                                )}
{/* {errors.price && <Text style={styles.errorText}>{errors.price}</Text>} */}


     <TouchableOpacity
  style={[styles.select, ]}
  onPress={() => setPaymentOpen(!paymentOpen)}
>
  <Text>{paymentMode || "Select Payment Mode"}</Text>
</TouchableOpacity>

{paymentOpen && (
  <View style={styles.dropdownMenu}>
    {paymentModes.map((m) => (
      <TouchableOpacity
        key={m}
        style={styles.option}
        onPress={() => {
          setPaymentMode(m);
          setPaymentOpen(false);
          setErrors({ ...errors, paymentMode: "" });
        }}
      >
        <Text>{m}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}

  {errors.paymentMode && (
                    <ErrorMessage message={errors.paymentMode} type="error" />
                                )}






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
  date={purchaseDate}
  maxDate={dayjs()}  
  onChange={(p) => {
    setPurchaseDate(p.date);
    setErrors({ ...errors, purchaseDate: "" });
    setOpenDatePicker(false);
  }}
/>

                    </View>
                </View>
            )}
        </View>
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



});
