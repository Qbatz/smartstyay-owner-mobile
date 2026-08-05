import React, { useState, useEffect, useContext } from "react";
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
import { useRoute } from "@react-navigation/native";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";

export default function AddPaymentMethod() {

  const { activeHostelId } = useContext(CommonContexts);
  const { bankList, addBanking, editBanking,
    errorMsg, getBankListByHostel, upiAppList,
    getQrCardTypeList, createPaymentMethod } =
    useContext(BankingContext);

    const route = useRoute();

const { bankDetails, bankId } = route.params || {}

console.log("bankDetails", bankDetails);


  const [openPurchaseDate, setOpenPurchaseDate] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(null);

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
    getQrCardTypeList("UPI");
  }, []);

  const handleTypeChange = async (value) => {
    setType(value);
    setSelectedUpi(null);

    const apiType = value === "upi" ? "UPI" : "CARD";

    await getQrCardTypeList(apiType);
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
  );
  const selectedUpiData = upiAppList.find(
    x => x.id === selectedupi
  );

  const [minDate, setMinDate] = useState(null)


  const today = dayjs();

  const isDisabledDate = (d) => {
    if (!d) return false;

    if (d.isAfter(today, "day")) return true;

    if (minDate && d.isBefore(minDate, "day")) return true;

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

    if (!form.bankId)
      err.bankId = "Please Select Linked Bank";


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

      if (type === "credit") {

        if (!form.creditLimit)
          err.creditLimit = "Please Enter Credit Limit";

        if (!purchaseDate)
          err.billingCycle = "Please Select Billing Cycle";
      }
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  }



  const handleCreate = async () => {

    if (!validate()) return


    const payload = {
      paymentMethod:
        type === "upi"
          ? "UPI"
          : type === "credit"
            ? "CREDIT_CARD"
            : "DEBIT_CARD",

      upiId: form.upiId,

      upiApp: selectedupi,

      displayName: form.displayName,

      description: form.description,

      cardNumber: form.cardNumber,

      cardNetwork: selectedupi,

      cardHolderName: form.cardHolderName,

      creditLimit:
        type === "credit"
          ? Number(form.creditLimit)
          : undefined,

      billingCycle:
        type === "credit"
          ? purchaseDate
          : undefined,

      linkedUpiId:
        type === "debit"
          ? form.upiId
          : undefined,
    }

    const res = await createPaymentMethod(
      activeHostelId,
      form.bankId,
      payload,
      form.qrImage
    );

    if (res?.success) {
      navigation.goBack();
    }
  };



  return (
    <>
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
              <TouchableOpacity
                style={styles.upload}
              >
                <Text>Choose  Image to upload</Text>
              </TouchableOpacity>

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
                Billing Cycle
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                // disabled={isEditMode}
                onPress={() => {
                  // if (!isEditMode)
                  setOpenPurchaseDate(true);
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
              {errors.billingCycle && (
                <ErrorMessage message={errors.billingCycle} />
              )}
            </>
          )}

          {/* Debit */}

          {type === "debit" && (
            <>
              <Text style={styles.label}>Linked Bank <Text style={{ color: "red", fontSize: 19 }}>*</Text></Text>
              <TextInput
                placeholder="Select Bank"
                style={styles.input}
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
                {errors.upiApp && (
                  <ErrorMessage message={errors.upiApp} />
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
            <TouchableOpacity
              style={styles.cancelBtn}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn} onPress={handleCreate}
            >
              <Text style={{ color: "#fff" }}>
                Create Method
              </Text>
            </TouchableOpacity>
          </View>
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
                // setDateErr("");
                // setErrors(prev => ({ ...prev, expenseDate: "" }))
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
});