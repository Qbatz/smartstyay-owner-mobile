import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput, Image, TouchableWithoutFeedback
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { CustomerContext } from "../../../Context/CustomerContext";
import { useRoute } from "@react-navigation/native";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import * as ImagePicker from "react-native-image-picker";
import UploadIcon from "../../../Assets/Images/upload.png";

export default function AddPaymentMethod() {

  const { activeHostelId } = useContext(CommonContexts);
  const { bankList, addBanking, editBanking,
    errorMsg, getBankListByHostel, upiAppList,
    getQrCardTypeList, getBankMethod } =
    useContext(BankingContext);

  const { createPaymentMethod } = useContext(CustomerContext)

  const isApplyTriggeredRef = useRef(false);

  const route = useRoute();

  const { bankDetails, bankId } = route.params || {}

  console.log("bankDetails", bankDetails);
  console.log("upiAppList", upiAppList);

  // const [openPurchaseDate, setOpenPurchaseDate] = useState(false);
  // const [purchaseDate, setPurchaseDate] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [qrAttachments, setQrAttachments] = useState([]);
  const [qrImage, setQrImage] = useState(null);

  const [type, setType] = useState("upi");
  const navigation = useNavigation()

  const [form, setForm] = useState({
    bankId: "",
    upiId: "",
    displayName: "",
    description: "",
    qrImage: null,

    cardNetwork: "",
    cardHolderName: "",
    cardNumber: "",
    creditLimit: "",
    billingCycle: "",
  });

  const [errors, setErrors] = useState({});

  const [upiApps, setUpiApps] = useState([]);
  const [showupiapp, setShowUPIApp] = useState(false)
  const [selectedupi, setSelectedUpi] = useState(null)

  useEffect(() => {
    getQrCardTypeList("UPI")
  }, [])



  const handleTypeChange = async (value) => {
    setType(value);
    setSelectedUpi(null);

    const apiType = value === "upi" ? "UPI" : "CARD";

    await getQrCardTypeList(apiType);
  };

  const pickQrImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel) return;

        if (response.assets?.length) {
          const file = response.assets[0];

          setQrAttachments([file]);
          setQrImage(file);

          handleChange("qrImage", file);
        }
      }
    );
  };

  const removeQrImage = () => {
    setQrAttachments([]);
    setQrImage(null);

    handleChange("qrImage", null);
  };


  const Radio = ({ value, label }) => (
    <TouchableOpacity
      style={styles.accountTypeItem}
      onPress={() => handleTypeChange(value)}
    >
      <View style={styles.radioOuter}>
        {type === value && <View style={styles.radioInner} />}
      </View>

      <Text style={styles.accountTypeText}>
        {label}
      </Text>
    </TouchableOpacity>
  )
  const selectedUpiData = upiAppList.find(
    x => x.id === selectedupi
  )





  const handleChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [key]: "",
    }));
  };

  const validate = () => {
    let err = {};

    // if (!form.bankId)
    //   err.bankId = "Please Select Linked Bank";


    if (type === "upi") {

      if (!selectedupi)
        err.upiApp = "Please Select UPI App";

      if (!form.upiId.trim())
        err.upiId = "Please Enter UPI ID";

      else if (
        !/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(form.upiId.trim())
      )
        err.upiId = "Please Enter Valid UPI ID";

      if (!form.displayName.trim())
        err.displayName = "Please Enter Display Name";

      if (!form.qrImage)
        err.qrImage = "Please Upload QR Image";
    }

    /////////

    if (type === "credit" || type === "debit") {

      if (!selectedupi)
        err.cardNetwork = "Please Select Card Network";

      if (!form.cardHolderName.trim())
        err.cardHolderName = "Please Enter Card Holder Name";

      if (!form.cardNumber)
        err.cardNumber = "Please Enter Last 4 Digits";

      else if (!/^\d{4}$/.test(form.cardNumber))
        err.cardNumber = "Card Number must be 4 digits";

      if (!form.displayName.trim())
        err.displayName = "Please Enter Display Name";

      /////////

      // if (type === "credit") {

      //   if (!form.creditLimit)
      //     err.creditLimit = "Please Enter Credit Limit";

      //   if (!purchaseDate)
      //     err.billingCycle = "Please Select Billing Cycle";
      // }
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  }


  const handleCreate = async () => {
    if (!validate()) return;

    if (isApplyTriggeredRef.current) return
    isApplyTriggeredRef.current = true


    try {

      const payload = {
        paymentMethod:
          type === "upi"
            ? "UPI"
            : type === "credit"
              ? "Credit Card"
              : "Debit Card",

        // UPI
        upiId: type === "upi" ? form.upiId.trim() : "",
        upiApp: type === "upi" ? selectedupi : "",
        linkedUpiId: "",

        // Common
        displayName: form.displayName.trim(),
        description: form.description.trim(),

        // Card
        cardNumber: type !== "upi" ? Number(form.cardNumber) : "",
        cardNetwork: type !== "upi" ? selectedupi : 0,
        cardHolderName: type !== "upi" ? form.cardHolderName.trim() : "",

        // Credit only
        creditLimit:
          type === "credit"
            ? (Number(form.creditLimit) || "")
            : "",

        billingCycle:
          type === "credit"
            ? ("06/08/2026" || "")
            // ? (form.billingCycle || "")
            : "",
      };

      console.log("HOSTEL ID =>", activeHostelId);
      console.log("BANK ID =>", bankId);
      console.log("PAYLOAD =>", payload);
      console.log("QR IMAGE =>", qrImage);

      const res = await createPaymentMethod(
        activeHostelId,
        bankId,
        payload,
        type === "upi" ? qrImage : null
      );

      if (res.success) {
        await getBankMethod(activeHostelId, bankId);

        setModalType("success");
        setModalMessage(res?.message || "Payment Method Added Successfully");
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }, 1500);
      } else {
        setModalType("error");
        setModalMessage(
          res?.message || "Failed to add payment method"
        );
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500);
      }
    }
    catch (error) {
      console.log(error);
    } finally {
      isApplyTriggeredRef.current = false;
    }

  }



  return (
    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />
      <View style={styles.container}>
        {/* <Text style={styles.title}>Add Payment Method</Text> */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>

          <Text style={styles.title}>Add Payment Method</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>
            Select Type <Text style={{ color: "red", fontSize: 19 }}>*</Text>
          </Text>

          <Radio value="upi" label="UPI" />
          <Radio value="credit" label="Credit Card" />
          <Radio value="debit" label="Debit Card" />
          {/* <Radio value="qr" label="QR Code" /> */}

          {/* UPI */}

          {type === "upi" && (
            <>
              <Text style={styles.label}>Linked Bank <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>
              <TextInput
                placeholder="Select Bank"
                style={styles.input}
                value={bankDetails?.bankName || "N/A"}
                editable={false}
              />
              {errors.bankId && (
                <ErrorMessage message={errors.bankId} />
              )}

              <View style={{ position: "relative" }}>
                <Text style={styles.label}>
                  UPI App   <Text style={{ color: "red", fontSize: 19 }}>*</Text>
                </Text>

                <TouchableOpacity
                  style={styles.inputBox}
                  onPress={() => setShowUPIApp(v => !v)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {selectedUpiData ? (
                      <>
                        {selectedUpiData.image ? (
                          <Image
                            source={{ uri: selectedUpiData.image }}
                            style={styles.logo}
                          />
                        ) : (
                          <View style={styles.initialCircle}>
                            <Text style={styles.initialText}>
                              {selectedUpiData.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}

                        <Text style={styles.selectedText}>
                          {selectedUpiData.name}
                        </Text>
                      </>
                    ) : (
                      <Text style={{ color: "#777" }}>
                        Select UPI App
                      </Text>
                    )}
                  </View>

                  <Image
                    source={DownArrow}
                    style={{ width: 18, height: 18 }}
                  />
                </TouchableOpacity>

                {showupiapp && (
                  <View style={styles.transactiondropdown}>
                    <ScrollView
                      nestedScrollEnabled
                      scrollEnabled={upiAppList.length > 3}
                      showsVerticalScrollIndicator={false}
                    >


                      {upiAppList.map((item) => {
                        const isSelected = selectedupi === item.id;

                        return (
                          <TouchableOpacity
                            key={item.id}
                            style={[
                              styles.dropdownRow,
                              isSelected && styles.dropdownRowSelected,
                            ]}
                            onPress={() => {
                              setSelectedUpi(item.id);
                              setShowUPIApp(false);
                            }}
                          >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              {item.image ? (
                                <Image
                                  source={{ uri: item.image }}
                                  style={styles.logo}
                                />
                              ) : (
                                <View style={styles.initialCircle}>
                                  <Text style={styles.initialText}>
                                    {item.name.charAt(0).toUpperCase()}
                                  </Text>
                                </View>
                              )}

                              <Text
                                style={
                                  isSelected
                                    ? styles.dropdownTextSelected
                                    : styles.dropdownText
                                }
                              >
                                {item.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}

                {errors.upiApp && (
                  <ErrorMessage message={errors.upiApp} />
                )}

                {/* {modeError && <ErrorMessage message={modeError} type="error" />} */}
              </View>

              <Text style={styles.label}>UPI ID <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>
              <TextInput
                placeholder="smartstay@oksbi"
                style={styles.input}
                value={form.upiId}
                onChangeText={(text) => handleChange("upiId", text)}
              />

              {errors.upiId && (
                <ErrorMessage message={errors.upiId} />
              )}


              <Text style={styles.label}>Display Name <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>
              <TextInput
                placeholder="Gpay UPI"
                style={styles.input}
                value={form.displayName}
                onChangeText={(text) => handleChange("displayName", text)}
              />

              {errors.displayName && (
                <ErrorMessage message={errors.displayName} />
              )}

              <Text style={styles.label}>Add QR Image <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>
              {qrAttachments.length === 0 ? (
                <TouchableOpacity
                  style={styles.uploadCard}
                  activeOpacity={0.8}
                  onPress={pickQrImage}
                >
                  <View style={styles.uploadIconBox}>
                    <Image
                      source={UploadIcon}
                      style={styles.uploadIcon}
                    />
                  </View>

                  <Text style={styles.uploadTitle}>
                    Choose Image to Upload
                  </Text>

                  <Text style={styles.uploadSubTitle}>
                    JPG, PNG UP TO 3MB
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.previewCard}>
                  <Image
                    source={{ uri: qrImage?.uri }}
                    style={styles.previewImage}
                  />

                  <View style={styles.fileInfoRow}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={styles.fileName}
                        numberOfLines={1}
                      >
                        {qrImage?.fileName}
                      </Text>

                      <Text style={styles.fileSize}>
                        {((qrImage?.fileSize || 0) / 1024).toFixed(0)} KB
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={removeQrImage}
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
              )}

              {errors.qrImage && (
                <ErrorMessage message={errors.qrImage} />
              )}



            </>
          )}

          {/* Credit */}

          {type === "credit" && (
            <>
              <Text style={styles.label}>Linked Bank <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>
              <TextInput
                placeholder="Select Bank"
                style={styles.input}
                value={bankDetails?.bankName || "N/A"}
                editable={false}
              />

              {errors.bankId && (
                <ErrorMessage message={errors.bankId} />
              )}


              <View style={{ position: "relative" }}>
                <Text style={styles.label}>
                  Card Network  <Text style={{ color: "red", fontSize: 19 }}>*</Text>
                </Text>


                <TouchableOpacity
                  style={styles.inputBox}
                  onPress={() => setShowUPIApp(v => !v)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {selectedUpiData ? (
                      <>
                        {selectedUpiData.image ? (
                          <Image
                            source={{ uri: selectedUpiData.image }}
                            style={styles.logo}
                          />
                        ) : (
                          <View style={styles.initialCircle}>
                            <Text style={styles.initialText}>
                              {selectedUpiData.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}

                        <Text style={styles.selectedText}>
                          {selectedUpiData.name}
                        </Text>
                      </>
                    ) : (
                      <Text style={{ color: "#777" }}>
                        Select UPI App
                      </Text>
                    )}
                  </View>

                  <Image
                    source={DownArrow}
                    style={{ width: 18, height: 18 }}
                  />
                </TouchableOpacity>

                {showupiapp && (
                  <View style={styles.transactiondropdown}>
                    <ScrollView
                      nestedScrollEnabled
                      scrollEnabled={upiAppList.length > 3}
                      showsVerticalScrollIndicator={false}
                    >


                      {upiAppList.map((item) => {
                        const isSelected = selectedupi === item.id;

                        return (
                          <TouchableOpacity
                            key={item.id}
                            style={[
                              styles.dropdownRow,
                              isSelected && styles.dropdownRowSelected,
                            ]}
                            onPress={() => {
                              setSelectedUpi(item.id);
                              setShowUPIApp(false);
                            }}
                          >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              {item.image ? (
                                <Image
                                  source={{ uri: item.image }}
                                  style={styles.logo}
                                />
                              ) : (
                                <View style={styles.initialCircle}>
                                  <Text style={styles.initialText}>
                                    {item.name.charAt(0).toUpperCase()}
                                  </Text>
                                </View>
                              )}

                              <Text
                                style={
                                  isSelected
                                    ? styles.dropdownTextSelected
                                    : styles.dropdownText
                                }
                              >
                                {item.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}

                {errors.cardNetwork && (
                  <ErrorMessage message={errors.cardNetwork} />
                )}
                {/* {modeError && <ErrorMessage message={modeError} type="error" />} */}
              </View>

              <Text style={styles.label}>Card Holder Name <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>
              <TextInput
                placeholder="Holder Name"
                style={styles.input}
                value={form.cardHolderName}
                onChangeText={(text) =>
                  handleChange("cardHolderName", text)
                }
              />

              {errors.cardHolderName && (
                <ErrorMessage message={errors.cardHolderName} />
              )}

              <Text style={styles.label}>
                Card Number (Last 4 Digits) <Text style={{ color: "red", fontSize: 19 }}>*</Text>
              </Text>
              <TextInput
                placeholder="1234"
                style={styles.input}
                keyboardType="number-pad"
                maxLength={4}
                value={form.cardNumber}
                onChangeText={(text) =>
                  handleChange(
                    "cardNumber",
                    text.replace(/[^0-9]/g, "")
                  )
                }
              />
              {errors.cardNumber && (
                <ErrorMessage message={errors.cardNumber} />
              )}

              <Text style={styles.label}>
                Display Name <Text style={{ color: "red", fontSize: 19 }}>*</Text>
              </Text>
              <TextInput
                placeholder="Hostel Credit Card"
                style={styles.input}
                value={form.displayName}
                onChangeText={(text) =>
                  handleChange("displayName", text)
                }
              />

              {errors.displayName && (
                <ErrorMessage message={errors.displayName} />
              )}

              <Text style={styles.label}>
                Credit Limit
              </Text>
              <TextInput
                placeholder="Enter Credit Limit"
                style={styles.input}
                keyboardType="number-pad"
                value={form.creditLimit}
                onChangeText={(text) =>
                  handleChange(
                    "creditLimit",
                    text.replace(/[^0-9]/g, "")
                  )
                }
              />

              {errors.creditLimit && (
                <ErrorMessage message={errors.creditLimit} />
              )}

              <Text style={styles.label}>
                Billing Cycle (Days)
                {/* <Text style={{ color: "red", fontSize: 19 }}>*</Text> */}
              </Text>

              <TextInput
                placeholder="Enter Billing Cycle in Days"
                style={styles.input}
                keyboardType="number-pad"
                value={form.billingCycle}
                onChangeText={(text) =>
                  handleChange(
                    "billingCycle",
                    text.replace(/[^0-9]/g, "")
                  )
                }
              />

              {/* {errors.billingCycle && (
                <ErrorMessage message={errors.billingCycle} />
              )} */}

            </>
          )}

          {/* Debit */}

          {type === "debit" && (
            <>
              <Text style={styles.label}>Linked Bank <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>
              <TextInput
                placeholder="Select Bank"
                style={styles.input}
                value={bankDetails?.bankName || "N/A"}
                editable={false}
              />

              {errors.bankId && (
                <ErrorMessage message={errors.bankId} />
              )}


              <View style={{ position: "relative" }}>
                <Text style={styles.label}>
                  Card Network  <Text style={{ color: "red", fontSize: 19 }}>*</Text>
                </Text>

                <TouchableOpacity
                  style={styles.inputBox}
                  onPress={() => setShowUPIApp(v => !v)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {selectedUpiData ? (
                      <>
                        {selectedUpiData.image ? (
                          <Image
                            source={{ uri: selectedUpiData.image }}
                            style={styles.logo}
                          />
                        ) : (
                          <View style={styles.initialCircle}>
                            <Text style={styles.initialText}>
                              {selectedUpiData.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}

                        <Text style={styles.selectedText}>
                          {selectedUpiData.name}
                        </Text>
                      </>
                    ) : (
                      <Text style={{ color: "#777" }}>
                        Select UPI App
                      </Text>
                    )}
                  </View>

                  <Image
                    source={DownArrow}
                    style={{ width: 18, height: 18 }}
                  />
                </TouchableOpacity>

                {showupiapp && (
                  <View style={styles.transactiondropdown}>
                    <ScrollView
                      nestedScrollEnabled
                      scrollEnabled={upiAppList.length > 3}
                      showsVerticalScrollIndicator={false}
                    >


                      {upiAppList.map((item) => {
                        const isSelected = selectedupi === item.id;

                        return (
                          <TouchableOpacity
                            key={item.id}
                            style={[
                              styles.dropdownRow,
                              isSelected && styles.dropdownRowSelected,
                            ]}
                            onPress={() => {
                              setSelectedUpi(item.id);
                              setShowUPIApp(false);
                            }}
                          >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              {item.image ? (
                                <Image
                                  source={{ uri: item.image }}
                                  style={styles.logo}
                                />
                              ) : (
                                <View style={styles.initialCircle}>
                                  <Text style={styles.initialText}>
                                    {item.name.charAt(0).toUpperCase()}
                                  </Text>
                                </View>
                              )}

                              <Text
                                style={
                                  isSelected
                                    ? styles.dropdownTextSelected
                                    : styles.dropdownText
                                }
                              >
                                {item.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
                {errors.cardNetwork && (
                  <ErrorMessage message={errors.cardNetwork} />
                )}
                {/* {modeError && <ErrorMessage message={modeError} type="error" />} */}
              </View>

              <Text style={styles.label}>Card Holder Name <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>
              <TextInput
                placeholder="Holder Name"
                style={styles.input}
                value={form.cardHolderName}
                onChangeText={(text) =>
                  handleChange("cardHolderName", text)
                }
              />
              {errors.cardHolderName && (
                <ErrorMessage message={errors.cardHolderName} />
              )}

              <Text style={styles.label}>
                Card Number (Last 4 Digits)<Text style={{ color: "red", fontSize: 19 }}>*</Text>
              </Text>
              <TextInput
                placeholder="1234"
                style={styles.input}
                keyboardType="number-pad"
                maxLength={4}
                value={form.cardNumber}
                onChangeText={(text) =>
                  handleChange(
                    "cardNumber",
                    text.replace(/[^0-9]/g, "")
                  )
                }
              />

              {errors.cardNumber && (
                <ErrorMessage message={errors.cardNumber} />
              )}

              <Text style={styles.label}>
                Display Name<Text style={{ color: "red", fontSize: 19 }}>*</Text>
              </Text>
              <TextInput
                placeholder="Hostel Credit Card"
                style={styles.input}
                value={form.displayName}
                onChangeText={(text) =>
                  handleChange("displayName", text)
                }
              />

              {errors.displayName && (
                <ErrorMessage message={errors.displayName} />
              )}
            </>
          )}

          {/* QR */}



          <Text style={styles.label}>
            Description
          </Text>

          <TextInput
            multiline
            numberOfLines={5}
            style={styles.textArea}
            placeholder="Enter Description"
            value={form.description}
            onChangeText={(text) =>
              handleChange("description", text)
            }
          />

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.goBack()}
              style={styles.cancelBtn}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                isApplyTriggeredRef.current && { opacity: 0.6 },
              ]}
              disabled={isApplyTriggeredRef.current}
              onPress={handleCreate}
            >
              <Text style={{ color: "#fff" }}>
                Create Method
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>


    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 15
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    // marginBottom: 20,
    marginLeft: 15
  },

  label: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "500",
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#D6D6D6",
    marginRight: 10,
  },

  radioActive: {
    borderColor: "#2F54EB",
    backgroundColor: "#2F54EB",
  },

  radioText: {
    fontSize: 15,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 15,
  },

  upload: {
    height: 80,
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  textArea: {
    height: 110,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 30,
    marginBottom: 30,
  },

  cancelBtn: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight: 10,
  },

  saveBtn: {
    backgroundColor: "#2F54EB",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backIcon: { width: 20, height: 20, marginRight: 10 },
  accountTypeRow: {
    flexDirection: "column",
    marginBottom: 5,
  },

  accountTypeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  accountTypeText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: "Gilroy-Medium",
    color: "#222",
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#2F5BFF",
    alignItems: "center",
    justifyContent: "center",
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#2F5BFF",
  },
  inputBox: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    // marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 160,
  },
  transactiondropdown: {
    position: "absolute",
    top: 97,          // 👈 input height
    left: 0,
    right: 0,

    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 9999,
    elevation: 20,

    maxHeight: 160,
  },

  dropdownRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  dropdownRowSelected: {
    backgroundColor: "#2563EB",
  },

  dropdownText: {
    color: "#111",
  },

  dropdownTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 10,
  },

  initialCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2F5BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  initialText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  selectedText: {
    fontSize: 15,
    color: "#222",
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
  uploadCard: {
    height: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  uploadIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
  },

  uploadIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  uploadTitle: {
    marginTop: 10,
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
    color: "#111827",
  },

  uploadSubTitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  previewCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
  },

  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    resizeMode: "cover",
  },

  fileInfoRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  fileName: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
    color: "#111827",
  },

  fileSize: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },

  deleteBtn: {
    padding: 6,
  },
});