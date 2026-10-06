import React, { useRef, useState, useEffect, useContext, useCallback } from "react";
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
  BackHandler, Keyboard
} from "react-native";
import CalendarImg from "../../../Assets/Images/calendar.png";
import { Calendar } from "react-native-calendars";
import DownArrow from "../../../Assets/Images/direction-down.png";
import BankIcon from "../../../Assets/Images/bankBlue.png";
import CashIcon from "../../../Assets/Images/Cash_Icon.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import { AssetContext } from "../../../Context/AssetContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { BankingContext } from "../../../Context/BankingContext";
import { VendorContext } from "../../../Context/VendorContext";
import { useFocusEffect } from '@react-navigation/native';
import LeavePageScreen from "../../../ToastFile/LeavePageScreen";

export default function AddAssetSheet({ onClose, title = "Add Assets", asset: currentItem, }) {

  const { addAsset, loading, errorMsg, handleUpdateAsset, getAllAssets } = useContext(AssetContext);
  const { activeHostelId } = useContext(CommonContexts);
  const { bankList, getBankListByHostel } = useContext(BankingContext);
  const {
    vendorList,
    getVendorList,
    addVendor,
    updateVendor,
    deleteVendor, initializeVendorList , vendorInitialize
  } = useContext(VendorContext);

  console.log("vendorList", vendorList);

  const isEdit = !!currentItem;

  const [initialState, setInitialState] = useState(null);
  const [showLeavePageScreen, setShowLeavePageScreen] = useState(false);



  useEffect(() => {
    if (currentItem) {
      setAssetName(currentItem.assetName || "");
      setProductName(currentItem.productName || "");
      setBrandName(currentItem.brandName || "");
      setSerialNumber(currentItem.serialNumber || "");
      setPrice(String(currentItem.price || ""));
      setSelectedVendorId(currentItem.vendorId || null);
      setSelectedMode(currentItem.bankingId || "");

      // setPurchaseDate(
      //   currentItem.purchaseDate
      //     ? dayjs(currentItem.purchaseDate, "DD-MM-YYYY").toDate()
      //     : null
      // );

      setPurchaseDate(
        currentItem.purchaseDate
          ? dayjs(currentItem.purchaseDate, "DD-MM-YYYY").format("YYYY-MM-DD")
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
  }, [currentItem])

  useEffect(() => {
    if (activeHostelId) {
      const res = initializeVendorList(activeHostelId)
    }
  }, [activeHostelId])

  console.log("assetinitialize",vendorInitialize);
  


  const validatePrice = (value) => {
    if (!value || value.trim() === "") {
      return "Please Enter Price";
    }

    // remove leading zeros like 000, 00
    const num = Number(value);

    if (isNaN(num)) {
      return "Price must be a number";
    }

    if (num <= 0) {
      return "Price must be greater than 0";
    }

    return "";
  };



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



  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // useEffect(() => {
  //   const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
  //     setKeyboardHeight(e.endCoordinates.height);
  //   });

  //   const hideSub = Keyboard.addListener("keyboardDidHide", () => {
  //     setKeyboardHeight(0);
  //   });

  //   return () => {
  //     showSub.remove();
  //     hideSub.remove();
  //   };
  // }, []);

  const translateY = useRef(new Animated.Value(0)).current;
  const [isInputFocused, setIsInputFocused] = useState(false);

  //  useEffect(() => {
  //   const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
  //     if (!isInputFocused) return; 

  //     Animated.timing(translateY, {
  //       toValue: -e.endCoordinates.height + 80,
  //       duration: 180,
  //       useNativeDriver: true,
  //     }).start();
  //   });

  //   const hideSub = Keyboard.addListener("keyboardDidHide", () => {
  //     Animated.timing(translateY, {
  //       toValue: 0,
  //       duration: 180,
  //       useNativeDriver: true,
  //     }).start();

  //     setIsInputFocused(false);
  //   });

  //   return () => {
  //     showSub.remove();
  //     hideSub.remove();
  //   };
  // }, [isInputFocused]);






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

  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

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

  // useEffect(() => {
  //   const backAction = () => {
  //     onClose();
  //     return true;
  //   };

  //   const handler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => handler.remove();
  // }, [onClose]);

  const vendorOptions = (vendorList?.vendors || [])?.map((v) => ({
    label: v?.fullName,
    value: v?.id,
  }));


 const transactionOptions = (bankList || []).map((item, index) => {
  const isCash =
    item?.accountType?.toUpperCase() === "CASH";

  return {
    id: item?.bankingId || `account-${index}`,
    bankingId: item?.bankingId,
    name: item?.accountHolderName || "Account",
    displayName: item?.accountHolderName || "Account",
    accountHolderName: item?.accountHolderName || "Account",
    accountType: item?.accountType || "BANK",
    isCash,
    subLabel: item?.accountType || "Bank Account",
  };
});


  const clearApiError = () => {
    if (errors.api) {
      setErrors((prev) => ({ ...prev, api: "" }));
    }
  };


  const handleLeavePage = useCallback(() => {
    const hasMandatoryValue =
      !!assetName?.trim() ||
      !!productName?.trim() ||
      !!purchaseDate ||
      !!price?.trim() ||
      (!isEdit && !!selectedMode);

    if (hasMandatoryValue) {
      setShowLeavePageScreen(true);
    } else {
      onClose();
    }
  }, [
    assetName,
    productName,
    purchaseDate,
    price,
    selectedMode,
    isEdit,
    onClose,
  ]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        handleLeavePage();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => subscription.remove();
    }, [handleLeavePage])
  );


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

    const priceError = validatePrice(price);
    if (priceError) {
      newErrors.price = priceError;
    }


    if (!isEdit && !selectedMode) {
      newErrors.paymentMode = "Please Select Transaction mode";
    }


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  };

  console.log("selectedMode", selectedMode);
  

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);


  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (isEdit && !isChanged()) {
      setErrors({ api: "No Changes Detected" });
      return;
    }

    if (isSubmitClicked) return;
    setIsSubmitClicked(true)

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


    try {
      if (isEdit) {
        const res = await handleUpdateAsset(payload);

        if (res?.success) {
          setModalType("success");
          setModalMessage("Asset updated successfully");
          setShowSuccessModal(true);

          setTimeout(() => {
            setShowSuccessModal(false);
            onClose();
            setIsSubmitClicked(false)
          }, 1500);

          return;
        }

        setModalType("warning");
        setModalMessage(res?.message || "Something went wrong");
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          setIsSubmitClicked(false)
        }, 1500);

        return;
      }
    } catch (error) {
      console.log(error)
      setIsSubmitClicked(false)
    }

    // ✅ ADD FLOW
    try {
      const res = await addAsset(payload);

      if (res?.success) {
        setModalType("success");
        setModalMessage(res?.message || "Asset added successfully");
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          onClose();
          setIsSubmitClicked(false)
        }, 1500);
      } else {
        setErrors({ api: res?.message });
        setIsSubmitClicked(false)
      }
    } catch (error) {
      setIsSubmitClicked(false)
    }
  };



  const scrollRef = useRef(null);
  const serialRef = useRef(null);
  const brandRef = useRef(null);
  const vendorRef = useRef(null);
  const purchaseRef = useRef(null);
  const priceRef = useRef(null);
  const paymentRef = useRef(null);

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


  //  useEffect(() => {
  //     const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
  //       Animated.timing(translateY, {
  //         toValue: -e.endCoordinates.height + 60,
  //         duration: 180,
  //         useNativeDriver: true,
  //       }).start();
  //     });

  //     const hideSub = Keyboard.addListener("keyboardDidHide", () => {
  //       Animated.timing(translateY, {
  //         toValue: 0,
  //         duration: 180,
  //         useNativeDriver: true,
  //       }).start();
  //     });

  //     return () => {
  //       showSub.remove();
  //       hideSub.remove();
  //     };
  //   }, []);

  const today = dayjs();

  const isDisabledDate = (d) => {
    if (!d) return false;
    return d.isAfter(today, "day")
  };



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

  const removeEmoji = (text) => {
    return text
      .replace(/[\u{1F600}-\u{1F64F}]/gu, "") // 😀😅🙂
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // 🌍🌟🎉
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // 🚗✈️🚀
      .replace(/[\u{2600}-\u{26FF}]/gu, "")   // ☀️⚡✅
      .replace(/[\u{2700}-\u{27BF}]/gu, "");  // ✂️✏️✔️
  };



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
          <Text style={styles.title}>{title}</Text>


          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingBottom: 210, paddingRight: 15 }}
          >




            <Text style={styles.label}>Asset Name  <Text style={{ color: "red" }}>*</Text></Text>
            <TextInput
              style={[styles.input,]}

              placeholder="Enter Asset"
              value={assetName}
              onChangeText={(t) => {
                const cleaned = removeEmoji(t);
                setAssetName(cleaned);
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
                const cleaned = removeEmoji(t);
                setProductName(cleaned);
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
            <View ref={brandRef}>
              <TextInput
                style={styles.input}

                placeholder="Enter Brand Name"
                value={brandName}
                onChangeText={(t) => {
                  const cleaned = removeEmoji(t);
                  setBrandName(cleaned);
                  clearApiError();
                }}
                onFocus={() => scrollToField(brandRef)}
              />
            </View>

            <Text style={styles.label}>Serial number</Text>
            <View ref={serialRef}>
              <TextInput
                style={styles.input}
                placeholder="Enter Serial Number"
                value={serialNumber}
                onChangeText={(t) => {
                  const cleaned = removeEmoji(t);

                  setSerialNumber(cleaned);
                  clearApiError();
                }}
                onFocus={() => scrollToField(serialRef)}
              />
            </View>





            <Text style={styles.label}>
              Purchase Date <Text style={{ color: "red" }}>*</Text>
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setOpenDatePicker(true)}
            >
              <View style={styles.dateInputWrapper}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD-MM-YYYY"
                  value={purchaseDate ? dayjs(purchaseDate).format("DD-MM-YYYY") : ""}
                  editable={false}   // 🔒 keyboard open aagathu
                  pointerEvents="none"
                />

                <Image
                  source={require("../../../Assets/Images/calendar.png")}
                  style={styles.calendarIcon}
                />
              </View>
            </TouchableOpacity>

            {errors.purchaseDate && (
              <ErrorMessage message={errors.purchaseDate} type="error" />
            )}


            <Text style={styles.label}>Price  <Text style={{ color: "red" }}>*</Text></Text>
            <View ref={priceRef}>
              <TextInput
                style={[styles.input,]}
                placeholder="Enter price"
                keyboardType="numeric"
                value={price}
                onChangeText={(t) => {
                  let cleaned = t.replace(/[^0-9.]/g, "");

                  const parts = cleaned.split(".");

                  if (parts.length > 2) {
                    cleaned = parts[0] + "." + parts[1];
                  }

                  if (parts[1]?.length > 2) {
                    cleaned = parts[0] + "." + parts[1].slice(0, 2);
                  }
                  setPrice(cleaned);
                  setErrors((prev) => ({ ...prev, price: "" }));
                  clearApiError();
                }}
                onFocus={() => scrollToField(priceRef)}
              />

            </View>
            {errors.price && (
              <ErrorMessage message={errors.price} type="error" />
            )}
            {/* {errors.price && <Text style={styles.errorText}>{errors.price}</Text>} */}



            {!isEdit && (
  <>
    <Text style={styles.label}>
      Transaction Mode <Text style={{ color: "red" }}>*</Text>
    </Text>

    <View style={styles.paymentDropdownWrapper}>
      <TouchableOpacity
        style={styles.paymentSelectBox}
        activeOpacity={0.8}
        onPress={() => {
          setModeError("");
          setShowPaymentMode((v) => !v);
        }}
      >
        {selectedMode ? (
          (() => {
            const selectedPayment = transactionOptions.find(
              (item) => item.id === selectedMode
            );

            return (
              <View style={styles.selectedPaymentContainer}>

                {/* ICON */}
                <View
                  style={[
                    styles.paymentMethodIcon,
                    selectedPayment?.isCash
                      ? styles.cashIconBg
                      : styles.bankIconBg,
                  ]}
                >
                  <Image
                    source={
                      selectedPayment?.isCash
                        ? CashIcon
                        : BankIcon
                    }
                    style={styles.paymentMethodIconImage}
                  />
                </View>

                {/* DETAILS */}
                <View style={styles.selectedPaymentDetails}>
                  <Text
                    style={styles.paymentMethodName}
                    numberOfLines={1}
                  >
                    {selectedPayment?.displayName}
                  </Text>

                  <Text
                    style={styles.paymentMethodSubText}
                    numberOfLines={1}
                  >
                    {selectedPayment?.subLabel}
                  </Text>
                </View>

                {/* BADGE */}
                <View
                  style={[
                    styles.paymentTypeBadge,
                    selectedPayment?.isCash
                      ? styles.cashBadge
                      : styles.bankBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.paymentTypeText,
                      selectedPayment?.isCash
                        ? styles.cashText
                        : styles.bankText,
                    ]}
                  >
                    {selectedPayment?.isCash ? "CASH" : "BANK"}
                  </Text>
                </View>
              </View>
            );
          })()
        ) : (
          <Text style={styles.paymentPlaceholder}>
            Select Transaction Mode
          </Text>
        )}

        <Image
          source={DownArrow}
          style={styles.paymentArrow}
        />
      </TouchableOpacity>

      {/* DROPDOWN */}
      {showPaymentMode && (
        <View style={styles.transactionPaymentDropdown}>
          <ScrollView
            style={{ maxHeight: 220 }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {transactionOptions.length > 0 ? (
              transactionOptions.map((opt) => {
                const isSelected = selectedMode === opt.id;

                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.7}
                    style={[
                      styles.paymentMethodRow,
                      isSelected &&
                        styles.paymentMethodRowSelected,
                    ]}
                    onPress={() => {
                      setSelectedMode(opt.id);
                      setShowPaymentMode(false);
                      setModeError("");

                      setErrors((prev) => ({
                        ...prev,
                        paymentMode: "",
                      }));
                    }}
                  >
                    {/* ICON */}
                    <View
                      style={[
                        styles.paymentMethodIcon,
                        opt.isCash
                          ? styles.cashIconBg
                          : styles.bankIconBg,
                      ]}
                    >
                      <Image
                        source={
                          opt.isCash
                            ? CashIcon
                            : BankIcon
                        }
                        style={styles.paymentMethodIconImage}
                      />
                    </View>

                    {/* DETAILS */}
                    <View style={styles.paymentMethodDetails}>
                      <Text
                        style={styles.paymentMethodName}
                        numberOfLines={1}
                      >
                        {opt.displayName}
                      </Text>

                      <Text
                        style={styles.paymentMethodSubText}
                        numberOfLines={1}
                      >
                        {opt.subLabel}
                      </Text>
                    </View>

                    {/* BADGE */}
                    <View
                      style={[
                        styles.paymentTypeBadge,
                        opt.isCash
                          ? styles.cashBadge
                          : styles.bankBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.paymentTypeText,
                          opt.isCash
                            ? styles.cashText
                            : styles.bankText,
                        ]}
                      >
                        {opt.isCash ? "CASH" : "BANK"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.noPaymentMethod}>
                <Text style={styles.noPaymentText}>
                  No Payment Methods Available
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>

    {errors.paymentMode && (
      <ErrorMessage
        message={errors.paymentMode}
        type="error"
      />
    )}
  </>
)}


            {errors.api && (
              <ErrorMessage message={errors.api} type="error" />
            )}

            {/* {errorMsg && (
              <ErrorMessage message={errorMsg} type="error" />
            )} */}


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
              <TouchableOpacity onPress={handleLeavePage}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.addBtn, isSubmitClicked && { opacity: 0.4 }]} onPress={handleSubmit}
                disabled={isSubmitClicked}>
                <Text style={styles.addBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </Animated.View>

        {openDatePicker && (
          <View style={styles.dateOverlay}>
            <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
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
                  setOpenDatePicker(false);
                  setErrors((p) => ({ ...p, purchaseDate: "" }));
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
      </View>

      <LeavePageScreen
        visible={showLeavePageScreen}
        onClose={() => setShowLeavePageScreen(false)}
        discardClose={() => {
          setShowLeavePageScreen(false);

          setTimeout(() => {
            onClose()
          }, 300);
        }}
      />

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
    maxHeight: "98%",
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
  title: { fontSize: 20, fontFamily: "Gilroy-Bold", marginBottom: 18 },

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
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    gap: 20,
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
    fontFamily: "Gilroy-Bold",
  },
 paymentDropdownWrapper: {
  position: "relative",
  zIndex: 9999,
},

paymentSelectBox: {
  minHeight: 64,
  borderWidth: 1,
  borderColor: "#D9DDE5",
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 8,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#FFFFFF",
},

selectedPaymentContainer: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  minWidth: 0,
},

selectedPaymentDetails: {
  flex: 1,
  minWidth: 0,
  marginLeft: 10,
  marginRight: 8,
},

paymentPlaceholder: {
  flex: 1,
  color: "#4B4B4B",
  fontSize: 14,
  fontFamily: "Gilroy-Regular",
},

paymentArrow: {
  width: 18,
  height: 18,
  resizeMode: "contain",
  tintColor: "#555555",
},

transactionPaymentDropdown: {
  marginTop: 6,
  // marginHorizontal: 4,
  borderWidth: 1,
  borderColor: "#D9DDE5",
  borderRadius: 14,
  backgroundColor: "#FFFFFF",
  overflow: "hidden",
  maxHeight: 220,
  zIndex: 9999,
  elevation: 10,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.12,
  shadowRadius: 8,
},

paymentMethodRow: {
  minHeight: 78,
  paddingHorizontal: 14,
  paddingVertical: 10,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderBottomWidth: 1,
  borderBottomColor: "#EEF0F4",
},

paymentMethodRowSelected: {
  backgroundColor: "#F7F9FC",
},

paymentMethodIcon: {
  width: 42,
  height: 42,
  borderRadius: 21,
  alignItems: "center",
  justifyContent: "center",
},

paymentMethodIconImage: {
  width: 20,
  height: 20,
  resizeMode: "contain",
},

cashIconBg: {
  backgroundColor: "#D9F8E9",
},

bankIconBg: {
  backgroundColor: "#DCE9FF",
},

paymentMethodDetails: {
  flex: 1,
  minWidth: 0,
  marginLeft: 12,
  marginRight: 10,
},

paymentMethodName: {
  fontSize: 15,
  fontFamily: "Gilroy-Semibold",
  color: "#202637",
},

paymentMethodSubText: {
  fontSize: 13,
  fontFamily: "Gilroy-Medium",
  color: "#74809A",
  marginTop: 3,
},

paymentTypeBadge: {
  minWidth: 74,
  paddingHorizontal: 14,
  paddingVertical: 9,
  borderRadius: 22,
  alignItems: "center",
  justifyContent: "center",
},

cashBadge: {
  backgroundColor: "#D5F7E7",
},

bankBadge: {
  backgroundColor: "#D8E7FF",
},

paymentTypeText: {
  fontSize: 12,
  fontFamily: "Gilroy-Semibold",
},

cashText: {
  color: "#009B42",
},

bankText: {
  color: "#2457E6",
},

noPaymentMethod: {
  padding: 20,
  alignItems: "center",
},

noPaymentText: {
  color: "#9CA3AF",
  fontSize: 13,
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
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transactiondropdown: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    marginTop: 6,
    overflow: "hidden",
    maxHeight: 180,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.10,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
    }),
  },

  dropdownRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  dropdownRowSelected: {
    backgroundColor: "#2563EB",
  },

  dropdownText: {
    fontSize: 15,
    color: "#111827",
  },

  dropdownTextSelected: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "Gilroy-Bold",
  },


  arrow: { fontSize: 18, color: "#555" },

  datePickerBox: {
    backgroundColor: "#fff",
    width: "80%",
    borderColor: "#DCDCDC",
    borderRadius: 30,
    padding: 5,
    marginBottom: 100,
    borderWidth: 0.5,
  },

  sheetLabel: {
    fontSize: 14,
    fontFamily: "Gilroy-Semibold",
    color: "#000",
    marginBottom: 8,
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
  },


  dateInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  calendarIconWrapper: {
    padding: 6,
  },

  calendarIcon: {
    width: 20,
    height: 20,
    tintColor: "#6B7280",
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
  dropdownRowInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  checkMark: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },


});
