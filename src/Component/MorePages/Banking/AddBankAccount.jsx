import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView, Image, BackHandler
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { CustomerContext } from "../../../Context/CustomerContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import LeavePageScreen from "../../../ToastFile/LeavePageScreen";


export default function AddBankAccount() {

  const { activeHostelId } = useContext(CommonContexts);
  const { createBankAccount, responsiblePersonList, NewgetBankList, getAllTransactions,
    getResponsiblePersonList, bankList, addBanking, editBanking, errorMsg, getBankListByHostel, newtransactionList } = useContext(BankingContext);

  const { createPaymentMethod } = useContext(CustomerContext)
  const [accountType, setAccountType] = useState("bank")

  const navigation = useNavigation()

  const [showAccountType, setShowAccountType] = useState(false);
  const [showBankAccountType, setShowBankAccountType] = useState(false);
  const [showResponsibleperson, setShowResponsiblePerson] = useState(false);
  const [cashaccountType, setCashAccountType] = useState(null)
  const [responsibleperson, setResponsiblePerson] = useState(null)

  const [linkBank, setLinkBank] = useState(false);
  const isApplyTriggeredRef = useRef(false)
  const [showLeavePageScreen, setShowLeavePageScreen] = useState(false)

  const [showCardNetwork, setShowCardNetwork] = useState(false);
  const [showBillingCycle, setShowBillingCycle] = useState(false);
  const [showLinkedBank, setShowLinkedBank] = useState(false);

  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");


  const [form, setForm] = useState({
    displayName: "",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    branch: "",
    ifsc: "",
    accountCategory: "",
    cashType: "",
    responsiblePerson: "",
    openingBalance: "",
    description: "",

    cardNetwork: "",
    cardHolderName: "",
    cardLast4: "",
    creditLimit: "",
    billingCycle: "",
    linkedBankId: "",
  })

  const billingCycleOptions = [
    { label: "1st of every month", value: "1" },
    { label: "5th of every month", value: "5" },
    { label: "10th of every month", value: "10" },
    { label: "15th of every month", value: "15" },
    { label: "20th of every month", value: "20" },
    { label: "25th of every month", value: "25" },
    { label: "Last day of every month", value: "LAST" },
  ];

  const billingCycleDays = Array.from(
    { length: 31 },
    (_, i) => i + 1
  );

  const cardNetworkOptions = [
    { label: "Visa", value: "VISA" },
    { label: "Mastercard", value: "MASTERCARD" },
    { label: "RuPay", value: "RUPAY" },
    { label: "American Express", value: "AMEX" },
  ];

  const linkedBankOptions = (newtransactionList?.bankList || []).filter(
    (item) =>
      String(item?.accountType || "").toUpperCase() === "BANK"
  );



  useEffect(() => {
    if (activeHostelId) {
      getResponsiblePersonList(activeHostelId);
    }
  }, [activeHostelId]);

  const cashTypeOptions = [
    { label: "Petty Cash", value: "PETTY_CASH" },
    { label: "Office Cash", value: "OFFICE_CASH" },
  ];

  const bankAccountTypeOptions = [
    { label: "Savings", value: "SAVINGS" },
    { label: "Current", value: "CURRENT" },
  ];

  const resetCreditFields = () => {
    setForm((prev) => ({
      ...prev,
      cardNetwork: "",
      cardHolderName: "",
      cardLast4: "",
      creditLimit: "",
      billingCycle: "",
      linkedBankId: "",
    }));

    setLinkBank(false);

    setErrors((prev) => ({
      ...prev,
      cardNetwork: "",
      cardHolderName: "",
      cardLast4: "",
      creditLimit: "",
      billingCycle: "",
      linkedBankId: "",
    }));
  };

  //   const responsibleOptions = users?.map(item => ({
  //   label: `${item?.firstName ?? ""} ${item?.lastName ?? ""}`.trim(),
  //   value: item?.userId,
  // }));


  const bankNameRegex = /^[a-zA-Z.&\s]{3,50}$/;

  const isAccountNoValid = (v) => {
    if (!v) return "Please Enter Account Number";
    if (/^0+$/.test(v)) return "Account Number cannot be zeros";
    if (v.length < 9 || v.length > 18)
      return "Account Number must be 9-18 digits";
    return "";
  };


  const handleIfscChange = (value) => {
    let formatted = value.toUpperCase();

    formatted = formatted.replace(/[^A-Z0-9]/g, "");

    if (formatted.length > 11) return;

    if (formatted.length <= 4 && !/^[A-Z]*$/.test(formatted)) return;

    if (formatted.length === 5 && formatted[4] !== "0") return;

    setForm((prev) => ({
      ...prev,
      ifsc: formatted,
    }));

    setErrors((prev) => ({
      ...prev,
      ifsc: "",
    }));
  };

  const handleLeavePage = useCallback(() => {
    let hasMandatoryValue = false;

    if (accountType === "bank") {
      hasMandatoryValue =
        !!form.displayName?.trim() ||
        !!form.bankName?.trim() ||
        !!form.accountHolder?.trim() ||
        !!form.accountNumber?.trim() ||
        !!form.branch?.trim() ||
        !!form.ifsc?.trim() ||
        !!form.accountCategory?.trim() ||
        !!form.openingBalance?.trim();
    }

    if (accountType === "cash") {
      hasMandatoryValue =
        !!form.displayName?.trim() ||
        !!form.cashType?.trim() ||
        !!form.responsiblePerson?.trim() ||
        !!form.openingBalance?.trim();
    }

    if (hasMandatoryValue) {
      setShowLeavePageScreen(true);
    } else {
      navigation.goBack();
    }
  }, [
    accountType,
    form,
    navigation,
  ])

  useEffect(() => {
    const backAction = () => {
      handleLeavePage();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => subscription.remove();
  }, [handleLeavePage]);

  const validate = () => {
    let err = {};

    if (!form.displayName.trim())
      err.displayName = "Please Enter Account Name";

    if (accountType !== "Credit") {
      if (!form.openingBalance) {
        err.openingBalance = "Please Enter Opening Balance";
      } else if (/^0+$/.test(form.openingBalance)) {
        err.openingBalance = "Opening Balance must be greater than 0";
      }
    }

    if (accountType === "bank") {
      if (!form.bankName.trim()) {
        err.bankName = "Please Enter Bank Name";
      } else if (!bankNameRegex.test(form.bankName.trim())) {
        err.bankName = "Please Enter Valid Bank Name";
      }

      if (!form.accountHolder.trim())
        err.accountHolder = "Please Enter Account Holder Name";

      const accErr = isAccountNoValid(form.accountNumber);

      if (accErr)
        err.accountNumber = accErr;

      if (!form.branch.trim())
        err.branch = "Please Enter Branch Name";

      if (!form.branch.trim()) {
        err.branch = "Please Enter Branch Name";
      }

      if (!form.ifsc.trim()) {
        err.ifsc = "Please Enter IFSC Code";
      } else if (form.ifsc.length !== 11) {
        err.ifsc = "Please Enter Valid IFSC Code";
      }

      if (!form.accountCategory.trim()) {
        err.accountCategory = "Please Enter Account Type";
      }
    }

    if (accountType === "cash") {
      if (!form.cashType.trim())
        err.cashType = "Please Enter Cash Account Type";

      if (!form.responsiblePerson.trim())
        err.responsiblePerson = "Please Enter Responsible Person";
    }

    if (accountType === "Credit") {
      if (!form.cardNetwork) {
        err.cardNetwork = "Please Select Card Network";
      }

      if (!form.cardHolderName.trim()) {
        err.cardHolderName = "Please Enter Card Holder Name";
      }

      if (!form.cardLast4) {
        err.cardLast4 = "Please Enter Last 4 Digits";
      } else if (!/^\d{4}$/.test(form.cardLast4)) {
        err.cardLast4 = "Card Number must be 4 digits";
      }

      if (!form.displayName.trim()) {
        err.displayName = "Please Enter Display Name";
      }

      // if (!form.billingCycle) {
      //   err.billingCycle = "Please Select Billing Cycle";
      // }

      const selectedBankId = linkBank
        ? form.linkedBankId
        : "";

      if (linkBank && !selectedBankId) {
        setErrors(prev => ({
          ...prev,
          linkedBankId: "Please Select Bank Account",
        }));
        isApplyTriggeredRef.current = false;
        return;
      }

      // if (!selectedBankId) {
      //   setModalType("error");
      //   setModalMessage(
      //     "Credit Card API requires a Bank Account ID. Please link a bank account."
      //   );
      //   setShowSuccessModal(true);
      //   isApplyTriggeredRef.current = false;
      //   return;
      // }
    }

    // if (!form.creditLimit) {
    //     err.creditLimit = "Please Enter Credit Limit";
    // }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));

    setApiErr("");
  };

  const resetBankFields = () => {
    setForm((prev) => ({
      ...prev,
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      branch: "",
      ifsc: "",
      accountCategory: "",
    }));

    setErrors((prev) => ({
      ...prev,
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      branch: "",
      ifsc: "",
      accountCategory: "",
    }));
  };

  const resetCashFields = () => {
    setForm((prev) => ({
      ...prev,
      cashType: "",
      responsiblePerson: "",
    }));

    setErrors((prev) => ({
      ...prev,
      cashType: "",
      responsiblePerson: "",
    }));
  };

  const resetCommonFields = () => {
    setForm((prev) => ({
      ...prev,
      displayName: "",
      openingBalance: "",
      description: "",
    }));

    setErrors((prev) => ({
      ...prev,
      displayName: "",
      openingBalance: "",
    }));
  };

  const handleCreate = async () => {
    if (!validate()) return;

    if (isApplyTriggeredRef.current) return
    isApplyTriggeredRef.current = true


    try {


      if (accountType === "Credit") {
        const selectedBankId = form.linkedBankId;

        if (!selectedBankId) {
          setErrors(prev => ({
            ...prev,
            linkedBankId: "Please Select Bank Account",
          }));
          return;
        }

        const payload = {
          paymentMethod: "Credit Card",

          // Common fields
          displayName: form.displayName.trim(),
          description: form.description.trim(),

          // Card fields — same API payload structure
          cardNumber: Number(form.cardLast4),
          cardNetwork: form.cardNetwork,
          cardHolderName: form.cardHolderName.trim(),

          // Credit Card fields
          creditLimit: Number(form.creditLimit) || "",
          billingCycle: form.billingCycle,
        };

        console.log("creditcardpayload", payload , selectedBankId) ;
        

        try {
          const res = await createPaymentMethod(
            activeHostelId,
            selectedBankId,
            payload,
            null
          );

          if (res?.success) {
            await getBankMethod(
              activeHostelId,
              selectedBankId
            );

            await NewgetBankList(activeHostelId);
            await getAllTransactions(activeHostelId);

            setModalType("success");
            setModalMessage(
              res?.message ||
              "Credit Card Added Successfully"
            );
            setShowSuccessModal(true);

            setTimeout(() => {
              setShowSuccessModal(false);
              navigation.goBack();
            }, 1200);
          } else {
            setModalType("error");
            setModalMessage(
              res?.message || "Failed to add Credit Card"
            );
            setShowSuccessModal(true);

            setTimeout(() => {
              setShowSuccessModal(false);
            }, 1200);
          }
        } catch (error) {
          console.log("Credit Card API Error:", error);

          setModalType("error");
          setModalMessage(
            error?.message || "Failed to add Credit Card"
          );
          setShowSuccessModal(true)

          setTimeout(() => {
            setShowSuccessModal(false);
          }, 1200);
        } finally {
          isApplyTriggeredRef.current = false;
        }

        return;
      }



      const payload =
        accountType === "bank"
          ? {
            holderName: form.accountHolder,
            bankName: form.bankName,
            displayName: form.displayName,
            branchName: form.branch,
            accountNo: form.accountNumber,
            ifscCode: form.ifsc,
            description: form.description,
            isDefault: true,
            accountType: "BANK",
            bankAccountType: form.accountCategory,
            openingBalance: Number(form.openingBalance),
            cashAccountType: "",
            responsiblePerson: "",
          }
          : {
            holderName: "",
            bankName: "",
            displayName: form.displayName,
            branchName: "",
            accountNo: "",
            ifscCode: "",
            description: form.description,
            isDefault: true,
            accountType: "CASH",
            bankAccountType: "",
            openingBalance: Number(form.openingBalance),
            cashAccountType: form.cashType,
            responsiblePerson: form.responsiblePerson,
          };

      console.log("Payload =>", payload);

      const res = await createBankAccount(activeHostelId, payload);

      if (res.success) {
        setModalType("success");
        setModalMessage("Account Created Successfully");
        setShowSuccessModal(true);
        await NewgetBankList(activeHostelId);
        await getAllTransactions(activeHostelId);

        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }, 1200);
      } else {
        setModalType("error");
        setModalMessage(res.message);
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1200);
      }
    }
    catch (error) {
      console.log(error);
    } finally {
      isApplyTriggeredRef.current = false;
    }
  };

  return (

    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 22 }}>←</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={handleLeavePage}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>

          <Text style={styles.title}>Add New Account</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <Text style={{
            fontSize: 15,
            marginBottom: 20,
            marginTop: 15,
            color: "#222", fontFamily: "Gilroy-Semibold"
          }}>
            Select Type <Text style={{ color: "red" }}>*</Text>
          </Text>

          <View style={styles.accountTypeRow}>

            <TouchableOpacity
              style={styles.accountTypeItem}
              onPress={() => {
                setAccountType("bank");
                resetCashFields();
                resetCommonFields();
                resetCreditFields();
              }}
            >
              <View style={styles.radioOuter}>
                {accountType === "bank" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <Text style={styles.accountTypeText}>
                Bank Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accountTypeItem}
              onPress={() => {
                setAccountType("cash");
                resetBankFields();
                resetCommonFields();
                resetCreditFields();
              }}
            >
              <View style={styles.radioOuter}>
                {accountType === "cash" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <Text style={styles.accountTypeText}>
                Cash Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accountTypeItem}
              onPress={() => {
                setAccountType("Credit");
                resetBankFields();
                resetCreditFields();
              }}
            >
              <View style={styles.radioOuter}>
                {accountType === "Credit" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <Text style={styles.accountTypeText}>
                Credit Card
              </Text>
            </TouchableOpacity>


          </View>

          {accountType !== "Credit" && (
            <>

              <Text style={styles.label}>Account Name / Display Name <Text style={{ color: "red" }}>*</Text></Text>
              <TextInput
                value={form.displayName}
                placeholder="Enter Account Name"
                style={styles.input}


                onChangeText={(v) =>
                  handleChange(
                    "displayName",
                    v.replace(/[^a-zA-Z.&\s]/g, "")
                  )
                }
              />

              {errors.displayName && (
                <ErrorMessage
                  message={errors.displayName}
                  type="error"
                />
              )}

            </>
          )
          }

          {accountType === "bank" ? (
            <>
              <Text style={styles.label}>Bank Name <Text style={{ color: "red" }}>*</Text></Text>
              <TextInput
                value={form.bankName}
                placeholder="Enter Bank Name"
                style={styles.input}
                autoCapitalize="words"
                onChangeText={(v) =>
                  handleChange(
                    "bankName",
                    v.replace(/[^a-zA-Z.&\s]/g, "")
                  )
                }
              />

              {errors.bankName && (
                <ErrorMessage
                  message={errors.bankName}
                  type="error"
                />
              )}

              <Text style={styles.label}>Account Holder Name <Text style={{ color: "red" }}>*</Text></Text>
              <TextInput
                value={form.accountHolder}
                placeholder="Enter Holder Name"
                style={styles.input}
                onChangeText={(v) =>
                  handleChange(
                    "accountHolder",
                    v.replace(/[^a-zA-Z\s]/g, "")
                  )
                }
              />

              {errors.accountHolder && (
                <ErrorMessage
                  message={errors.accountHolder}
                  type="error"
                />
              )}

              <Text style={styles.label}>Account Number <Text style={{ color: "red" }}>*</Text></Text>
              <TextInput
                value={form.accountNumber}
                placeholder="Enter Account Number"
                keyboardType="number-pad"
                maxLength={18}
                style={styles.input}
                onChangeText={(v) =>
                  handleChange(
                    "accountNumber",
                    v.replace(/[^0-9]/g, "")
                  )
                }
              />

              {errors.accountNumber && (
                <ErrorMessage
                  message={errors.accountNumber}
                  type="error"
                />
              )}

              <Text style={styles.label}>Bank Branch <Text style={{ color: "red" }}>*</Text></Text>
              <TextInput
                value={form.branch}
                placeholder="Enter Branch"
                style={styles.input}
                onChangeText={(v) => handleChange("branch", v)}
              />

              {errors.branch && (
                <ErrorMessage message={errors.branch} />
              )}

              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.label}>IFSC Code <Text style={{ color: "red" }}>*</Text></Text>
                  <TextInput
                    value={form.ifsc}
                    placeholder="Enter Ifsc Code"
                    autoCapitalize="characters"
                    maxLength={11}
                    style={styles.input}
                    onChangeText={handleIfscChange}
                  />

                  {errors.ifsc && (
                    <ErrorMessage message={errors.ifsc} />
                  )}
                </View>
                <View
                  style={[
                    styles.half,
                    { zIndex: showBankAccountType ? 1000 : 1 }
                  ]}
                >
                  <Text style={styles.label}>
                    Account Type <Text style={{ color: "red" }}>*</Text>
                  </Text>

                  <TouchableOpacity
                    style={styles.inputBox}
                    activeOpacity={0.8}
                    onPress={() => {
                      setShowBankAccountType((prev) => !prev);
                      setShowAccountType(false);
                      setShowResponsiblePerson(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownInputText,
                        !form.accountCategory && styles.placeholderText,
                      ]}
                    >
                      {form.accountCategory
                        ? bankAccountTypeOptions.find(
                          (item) => item.value === form.accountCategory
                        )?.label
                        : "Select Account Type"}
                    </Text>

                    <Image
                      source={DownArrow}
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: "#555",
                      }}
                    />
                  </TouchableOpacity>

                  {showBankAccountType && (
                    <View style={styles.bankAccountDropdown}>
                      <ScrollView
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                      >
                        {bankAccountTypeOptions.map((option) => {
                          const isSelected =
                            form.accountCategory === option.value;

                          return (
                            <TouchableOpacity
                              key={option.value}
                              style={[
                                styles.dropdownRow,
                                isSelected && styles.dropdownRowSelected,
                              ]}
                              onPress={() => {
                                handleChange(
                                  "accountCategory",
                                  option.value
                                );

                                setShowBankAccountType(false);
                              }}
                            >
                              <Text
                                style={
                                  isSelected
                                    ? styles.dropdownTextSelected
                                    : styles.dropdownText
                                }
                              >
                                {option.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}

                  {errors.accountCategory && (
                    <ErrorMessage message={errors.accountCategory} />
                  )}
                </View>
              </View>


            </>
          ) : accountType === "cash" ? (
            <>


              <View style={{ position: "relative" }}>
                <Text style={styles.label}>
                  Cash Account Type <Text style={{ color: "red", fontSize: 19 }}>*</Text>
                </Text>

                {/* INPUT */}
                <TouchableOpacity
                  style={styles.inputBox}
                  onPress={() => {
                    // setModeError("");
                    setShowAccountType(v => !v);
                  }}
                >
                  {/* <Text style={{ fontSize: 15 }}>
                    {cashaccountType
                      ? transactionOptions.find(o => o.value === cashaccountType)?.label
                      : "Select Account Type "}
                  </Text> */}
                  <Text style={{ fontSize: 15 }}>
                    {cashaccountType
                      ? cashTypeOptions.find(x => x.value === cashaccountType)?.label
                      : "Select Cash Type"}
                  </Text>

                  <Image
                    source={DownArrow}
                    style={{ width: 18, height: 18, tintColor: "#555" }}
                  />
                </TouchableOpacity>

                {/* DROPDOWN */}
                {showAccountType && (
                  <View style={styles.transactiondropdown}>
                    <ScrollView
                      nestedScrollEnabled
                      scrollEnabled={cashTypeOptions.length > 3}
                      showsVerticalScrollIndicator={false}
                    >
                      {cashTypeOptions.map(opt => {
                        const isSelected = cashaccountType === opt.value;

                        return (
                          <TouchableOpacity
                            key={opt.value}
                            style={[
                              styles.dropdownRow,
                              isSelected && styles.dropdownRowSelected,
                            ]}
                            onPress={() => {
                              handleChange("cashType", opt.value);
                              setCashAccountType(opt.value);
                              setShowAccountType(false);
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
                      })}
                    </ScrollView>
                  </View>
                )}

                {/* {modeError && <ErrorMessage message={modeError} type="error" />} */}
              </View>

              <View style={{ position: "relative" }}>
                <Text style={styles.label}>
                  Responsible Person  <Text style={{ color: "red", fontSize: 19 }}>*</Text>
                </Text>

                {/* INPUT */}
                <TouchableOpacity
                  style={styles.inputBox}
                  onPress={() => {
                    // setModeError("");
                    setShowResponsiblePerson(v => !v);
                  }}
                >

                  <Text style={{ fontSize: 15 }}>
                    {responsibleperson
                      ? responsiblePersonList
                        .find(x => x.userId === responsibleperson)
                        ?.firstName +
                      " " +
                      (responsiblePersonList.find(
                        x => x.userId === responsibleperson
                      )?.lastName || "")
                      : "Select Responsible Person"}
                  </Text>

                  <Image
                    source={DownArrow}
                    style={{ width: 18, height: 18, tintColor: "#555" }}
                  />
                </TouchableOpacity>

                {/* DROPDOWN */}
                {showResponsibleperson && (
                  <View style={styles.transactiondropdown}>
                    <ScrollView
                      nestedScrollEnabled
                      scrollEnabled={responsiblePersonList.length > 3}
                      showsVerticalScrollIndicator={false}
                    >
                      {responsiblePersonList.map((item) => {
                        const label = `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim();
                        const isSelected = responsibleperson === item.userId;

                        return (
                          <TouchableOpacity
                            key={item.userId}
                            style={[
                              styles.dropdownRow,
                              isSelected && styles.dropdownRowSelected,
                            ]}
                            onPress={() => {
                              setResponsiblePerson(item.userId);

                              handleChange("responsiblePerson", item.userId);

                              setShowResponsiblePerson(false);
                            }}
                          >
                            <Text
                              style={
                                isSelected
                                  ? styles.dropdownTextSelected
                                  : styles.dropdownText
                              }
                            >
                              {label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}

                {/* {modeError && <ErrorMessage message={modeError} type="error" />} */}
              </View>
            </>
          ) : (
            <>
              {/* Card Network */}
              <Text style={styles.label}>
                Card Network
                <Text style={{ color: "red" }}> *</Text>
              </Text>

              <View style={{ position: "relative", zIndex: 3000 }}>
                <TouchableOpacity
                  style={styles.inputBox}
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowAccountType(false);
                    setShowResponsiblePerson(false);
                    setShowBankAccountType(false);
                    setShowCardNetwork(prev => !prev);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownInputText,
                      !form.cardNetwork && styles.placeholderText,
                    ]}
                  >
                    {form.cardNetwork
                      ? cardNetworkOptions.find(
                        x => x.value === form.cardNetwork
                      )?.label
                      : "Select Card Network"}
                  </Text>

                  <Image
                    source={DownArrow}
                    style={styles.dropdownArrow}
                  />
                </TouchableOpacity>

                {showCardNetwork && (
                  <View style={styles.creditDropdown}>
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={false}
                    >
                      {cardNetworkOptions.map(option => {
                        const selected =
                          form.cardNetwork === option.value;

                        return (
                          <TouchableOpacity
                            key={option.value}
                            style={[
                              styles.dropdownRow,
                              selected &&
                              styles.dropdownRowSelected,
                            ]}
                            onPress={() => {
                              handleChange(
                                "cardNetwork",
                                option.value
                              );
                              setShowCardNetwork(false);
                            }}
                          >
                            <Text
                              style={
                                selected
                                  ? styles.dropdownTextSelected
                                  : styles.dropdownText
                              }
                            >
                              {option.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>

              {errors.cardNetwork && (
                <ErrorMessage message={errors.cardNetwork} />
              )}


              {/* Card Holder */}
              <Text style={styles.label}>
                Card Holder Name
                <Text style={{ color: "red" }}> *</Text>
              </Text>

              <TextInput
                value={form.cardHolderName}
                placeholder="Enter Card Holder Name"
                style={styles.input}
                autoCapitalize="words"
                onChangeText={(v) =>
                  handleChange(
                    "cardHolderName",
                    v.replace(/[^a-zA-Z\s]/g, "")
                  )
                }
              />

              {errors.cardHolderName && (
                <ErrorMessage message={errors.cardHolderName} />
              )}


              {/* Last 4 Digits */}
              <Text style={styles.label}>
                Card Number (Last 4 Digits)
                <Text style={{ color: "red" }}> *</Text>
              </Text>

              <TextInput
                value={form.cardLast4}
                placeholder="Enter last 4 digits"
                style={styles.input}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry={false}
                onChangeText={(v) => {
                  const value = v.replace(/[^0-9]/g, "");

                  handleChange("cardLast4", value);
                }}
              />

              {errors.cardLast4 && (
                <ErrorMessage message={errors.cardLast4} />
              )}


              {/* Display Name */}
              <Text style={styles.label}>
                Display Name
                <Text style={{ color: "red" }}> *</Text>
              </Text>

              <TextInput
                value={form.displayName}
                placeholder="Enter Display Name"
                style={styles.input}
                onChangeText={(v) =>
                  handleChange(
                    "displayName",
                    v.replace(/[^a-zA-Z0-9.&\s-]/g, "")
                  )
                }
              />

              {errors.displayName && (
                <ErrorMessage message={errors.displayName} />
              )}


              {/* Credit Limit */}
              <Text style={styles.label}>
                Credit Limit
              </Text>

              <TextInput
                value={form.creditLimit}
                placeholder="Enter Credit Limit"
                style={styles.input}
                keyboardType="numeric"
                onChangeText={(v) => {
                  const value = v.replace(/[^0-9]/g, "");

                  if (value.length > 1 && value.startsWith("0")) {
                    return;
                  }

                  handleChange("creditLimit", value);
                }}
              />

              {errors.creditLimit && (
                <ErrorMessage message={errors.creditLimit} />
              )}


              {/* Billing Cycle */}
              <Text style={styles.label}>
                Billing Cycle
                {/* <Text style={{ color: "red" }}> *</Text> */}
              </Text>

              <TouchableOpacity
                style={styles.inputBox}
                activeOpacity={0.8}
                onPress={() => {
                  setShowBillingCycle(prev => !prev);

                  setShowCardNetwork(false);
                  setShowLinkedBank(false);
                  setShowAccountType(false);
                  setShowResponsiblePerson(false);
                  setShowBankAccountType(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownInputText,
                    !form.billingCycle && styles.placeholderText,
                  ]}
                >
                  {form.billingCycle
                    ? `${String(form.billingCycle).padStart(2, "0")}`
                    : "Select Billing Cycle"}
                </Text>

                <Image
                  source={DownArrow}
                  style={[
                    styles.dropdownArrow,
                    {
                      transform: [
                        {
                          rotate: showBillingCycle
                            ? "180deg"
                            : "0deg",
                        },
                      ],
                    },
                  ]}
                />
              </TouchableOpacity>

              {showBillingCycle && (
                <View style={styles.creditBillingDateGrid}>
                  {billingCycleDays.map((day) => {
                    const selected =
                      String(form.billingCycle) === String(day);

                    return (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.billingDateItem,
                          selected &&
                          styles.billingDateSelected,
                        ]}
                        onPress={() => {
                          handleChange(
                            "billingCycle",
                            String(day)
                          );

                          setShowBillingCycle(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.billingDateText,
                            selected && {
                              color: "#fff",
                            },
                          ]}
                        >
                          {day < 10
                            ? `0${day}`
                            : day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {errors.billingCycle && (
                <ErrorMessage
                  message={errors.billingCycle}
                  type="error"
                />
              )}


              {/* Link Bank */}
              <View style={styles.linkBankHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>
                    Link a bank account
                  </Text>

                  <Text style={styles.linkBankDescription}>
                    Link this card to a bank account used for
                    card payments.
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    linkBank && styles.checkboxActive,
                  ]}
                  onPress={() => {
                    setLinkBank(prev => !prev);

                    if (linkBank) {
                      handleChange("linkedBankId", "");
                    }
                  }}
                >
                  {linkBank && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              </View>


              {linkBank && (
                <>
                  <View
                    style={{
                      position: "relative",
                      zIndex: showLinkedBank ? 9999 : 1,
                      elevation: showLinkedBank ? 20 : 0,
                    }}
                  >
                    <Text style={styles.label}>
                      Select Bank
                      <Text style={{ color: "red" }}> *</Text>
                    </Text>

                    <TouchableOpacity
                      style={styles.inputBox}
                      activeOpacity={0.8}
                      onPress={() => {
                        setShowLinkedBank(prev => !prev);
                        setShowCardNetwork(false);
                        setShowBillingCycle(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownInputText,
                          !form.linkedBankId && styles.placeholderText,
                        ]}
                      >
                        {linkedBankOptions.find(
                          item => String(item.bankId) === String(form.linkedBankId)
                        )?.bankName || "Select Bank Account"}
                      </Text>

                      <Image
                        source={DownArrow}
                        style={styles.dropdownArrow}
                      />
                    </TouchableOpacity>

                    {showLinkedBank && (
                      <View style={styles.creditDropdown}>
                        <ScrollView
                          nestedScrollEnabled
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator={false}
                        >
                          {linkedBankOptions.map(item => (
                            <TouchableOpacity
                              key={item?.bankId}
                              style={styles.dropdownRow}
                              onPress={() => {
                                handleChange("linkedBankId", item?.bankId);
                                setShowLinkedBank(false);
                              }}
                            >
                              <Text style={styles.dropdownText}>
                                {item?.bankName || item?.displayName || "Unnamed Bank"}
                              </Text>
                            </TouchableOpacity>
                          ))}

                          {linkedBankOptions.length === 0 && (
                            <Text style={{ padding: 12, color: "#666" }}>
                              No bank accounts available
                            </Text>
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </>
              )}


{linkBank && errors.linkedBankId && (
  <ErrorMessage
    message={errors.linkedBankId}
    type="error"
  />
)}



              {/* <Text style={styles.label}>
                Description
              </Text>

              <TextInput
                multiline
                numberOfLines={4}
                value={form.description}
                placeholder="Describe the notes..."
                style={styles.textArea}
                onChangeText={(v) =>
                  handleChange("description", v)
                }
              /> */}


            </>
          )
          }



          {accountType !== "Credit" && (
            <>

              <Text style={styles.label}>Current Opening Balance <Text style={{ color: "red" }}>*</Text></Text>
              <TextInput
                value={form.openingBalance}
                placeholder="Enter Amount"
                keyboardType="numeric"
                style={styles.input}
                onChangeText={(v) => {
                  const value = v.replace(/[^0-9]/g, "");
                  if (value.length > 1 && value.startsWith("0")) {
                    return;
                  }
                  handleChange("openingBalance", value);
                }}
              />

              {errors.openingBalance && (
                <ErrorMessage
                  message={errors.openingBalance}
                  type="error"
                />
              )}

              <Text style={styles.note}>
                Important: This amount sets your current opening balance. Double-check this figure, as an incorrect balance will miscalculate the final total.
              </Text>

            </>
          )}



          <Text style={styles.label}>Description</Text>
          <TextInput
            multiline
            numberOfLines={5}
            placeholder="Enter the description"
            style={styles.textArea}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleLeavePage}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, isApplyTriggeredRef.current && { opacity: 0.6 }]}
              disabled={isApplyTriggeredRef.current}
              onPress={handleCreate}>
              <Text style={styles.submitText}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <LeavePageScreen
        visible={showLeavePageScreen}
        onClose={() => setShowLeavePageScreen(false)}
        discardClose={() => {
          setShowLeavePageScreen(false)

          setTimeout(() => {
            navigation.goBack()
          }, 300)
        }}
      />

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 15
  },

  title: {
    fontSize: 22,
    fontFamily: "Gilroy-Bold",
    marginLeft: 15,
  },

  label: {
    fontSize: 15,
    marginBottom: 8,
    marginTop: 18,
    color: "#222",
    fontFamily: "Gilroy-Semibold"
  },

  radioRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 35,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CFCFCF",
    marginRight: 8,
  },

  radioActive: {
    borderColor: "#2F49E7",
    backgroundColor: "#2F49E7",
  },

  radioText: {
    fontSize: 15,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    fontFamily: "Gilroy-Regular"
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  half: {
    width: "48%",
  },

  textArea: {
    height: 110,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    borderRadius: 12,
    padding: 14,
    textAlignVertical: "top",
  },

  note: {
    color: "#64748B",
    marginTop: 10,
    lineHeight: 20,
    fontSize: 13,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 30,
  },

  cancelBtn: {
    width: 110,
    height: 48,
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  cancelText: {
    fontSize: 16,
    fontFamily: "Gilroy-Semibold"
  },

  submitBtn: {
    width: 170,
    height: 48,
    backgroundColor: "#2F49E7",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Gilroy-Semibold"
  },
  backIcon: { width: 20, height: 20, marginRight: 10 },
  accountTypeRow: {
    flexDirection: "column",
    // alignItems: "center",
    marginBottom: 10, gap: 10
  },

  accountTypeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 35,
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
    height: 53,
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
  dropdownInputText: {
    fontSize: 13,
    color: "black",
    fontFamily: "Gilroy-Regular",
  },
  placeholderText: {
    color: "#777",
    fontFamily: "Gilroy-Regular",
  },
  bankAccountDropdown: {
    position: "absolute",
    top: 96,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 9999,
    elevation: 20,
    maxHeight: 120,
    overflow: "hidden",
  },
  dropdownArrow: {
    width: 18,
    height: 18,
    tintColor: "#555",
  },

  creditDropdown: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 9999,
    elevation: 20,
    maxHeight: 180,
    overflow: "hidden",
  },

  linkBankHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  linkBankDescription: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Gilroy-Regular",
    marginTop: -3,
    paddingRight: 15,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxActive: {
    backgroundColor: "#2F5BFF",
    borderColor: "#2F5BFF",
  },

  checkmark: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Gilroy-Bold",
  },
  creditBillingDateGrid: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,

    flexDirection: "row",
    flexWrap: "wrap",

    backgroundColor: "#fff",
  },

  billingDateItem: {
    width: "20%",
    height: 32,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 16,
  },

  billingDateSelected: {
    backgroundColor: "#2F5BFF",
  },

  billingDateText: {
    fontSize: 16,
    color: "#111",
    fontFamily: "Gilroy-Medium",
  },
});