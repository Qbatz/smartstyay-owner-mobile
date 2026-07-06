import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";



export default function AddBankAccount() {

  const { activeHostelId } = useContext(CommonContexts);
  const { bankList, addBanking, editBanking, errorMsg, getBankListByHostel } = useContext(BankingContext);


  const [accountType, setAccountType] = useState("bank")

  const navigation = useNavigation()


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
  })

  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");


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

  const validate = () => {
    let err = {};

    if (!form.displayName.trim())
      err.displayName = "Please Enter Account Name";

    if (!form.openingBalance)
      err.openingBalance = "Please Enter Opening Balance";

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
    }

    if (accountType === "cash") {
      if (!form.cashType.trim())
        err.cashType = "Please Enter Cash Account Type";

      if (!form.responsiblePerson.trim())
        err.responsiblePerson = "Please Enter Responsible Person";
    }

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

  const handleCreate = async () => {
    if (!validate()) return;

    const payload = {
      accountType: accountType === "bank" ? "BANK" : "CASH",
      accountName: form.displayName,
      bankName: form.bankName,
      accountHolderName: form.accountHolder,
      accountNumber: form.accountNumber,
      branchName: form.branch,
      ifscCode: form.ifsc,
      openingBalance: Number(form.openingBalance),
      description: form.description,
      cashAccountType: form.cashType,
      responsiblePerson: form.responsiblePerson,
    };

    const res = await addBanking(activeHostelId, payload);

    if (res?.success) {
      setModalType("success");
      setModalMessage("Account Created Successfully");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.goBack();
      }, 1200);
    } else {
      setApiErr(res?.message);
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 22 }}>←</Text>
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

          <View style={styles.radioRow}>
            <TouchableOpacity
              style={styles.radioItem}
              onPress={() => setAccountType("bank")}
            >
              <View
                style={[
                  styles.radio,
                  accountType === "bank" && styles.radioActive,
                ]}
              />
              <Text style={styles.radioText}>Bank Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioItem}
              onPress={() => setAccountType("cash")}
            >
              <View
                style={[
                  styles.radio,
                  accountType === "cash" && styles.radioActive,
                ]}
              />
              <Text style={styles.radioText}>Cash Account</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Account Name / Display Name <Text style={{ color: "red" }}>*</Text></Text>
          <TextInput
            value={form.displayName}
            placeholder="Enter Account Name"
            style={styles.input}
            onChangeText={(v) => handleChange("displayName", v)}
          />

          {errors.displayName && (
            <ErrorMessage
              message={errors.displayName}
              type="error"
            />
          )}

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
                placeholder="Enter Branch"
                style={styles.input}
              />

              <View style={styles.row}>
                <View style={styles.half}>
                  <Text style={styles.label}>IFSC Code</Text>
                  <TextInput
                    value={form.ifsc}
                    placeholder="SBIN000000"
                    autoCapitalize="characters"
                    maxLength={11}
                    style={styles.input}
                    onChangeText={handleIfscChange}
                  />
                </View>

                <View style={styles.half}>
                  <Text style={styles.label}>Account Type</Text>
                  <TextInput
                    placeholder="Current"
                    style={styles.input}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>Cash Account Type <Text style={{ color: "red" }}>*</Text></Text>
              <TextInput
                placeholder="Petty Cash"
                style={styles.input}
              />

              <Text style={styles.label}>Responsible Person <Text style={{ color: "red" }}>*</Text></Text>
              <TextInput
                placeholder="Select User"
                style={styles.input}
              />
            </>
          )}

          <Text style={styles.label}>Current Opening Balance <Text style={{ color: "red" }}>*</Text></Text>
          <TextInput
            value={form.openingBalance}
            placeholder="₹"
            keyboardType="numeric"
            style={styles.input}
            onChangeText={(v) =>
              handleChange(
                "openingBalance",
                v.replace(/[^0-9.]/g, "")
              )
            }
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

          <Text style={styles.label}>Description</Text>

          <TextInput
            multiline
            numberOfLines={5}
            placeholder="Describe the notes..."
            style={styles.textArea}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
              <Text style={styles.submitText}>
                Create Account
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
});