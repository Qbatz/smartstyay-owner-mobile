import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image, TouchableWithoutFeedback
} from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ValidatedInput from "../ValidatedInput"
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";

export default function Transfer({ navigation }) {


  const { NewgetBankList ,  getBankOverview, getTransferInitialize, transferInitialize, moneyTransfer,
    bankOverview, bankList, transactionList, loading, errorMsg, getBankListByHostel, AddBankAmount } =
    useContext(BankingContext);
  const { activeHostelId } = useContext(CommonContexts);

    const isApplyTriggeredRef = useRef(false);

  console.log("transferInitialize", transferInitialize);

  const [amount, setAmount] = useState("");

  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);

  const [showFromList, setShowFromList] = useState(true);
  const [showToList, setShowToList] = useState(true);

  const [openTransferDate, setOpenTransferDate] = useState(false);
  const [transferDate, setTransferDate] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");


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


  const fromAccounts = transferInitialize?.fromBank
    ? [transferInitialize.fromBank]
    : [];

  const toAccounts = transferInitialize?.toBanks || [];

  const [errors, setErrors] = useState({
    from: "",
    to: "",
    amount: "",
    transferDate: "",
  });

  const validateTransfer = () => {
    let valid = true;

    const temp = {
      from: "",
      to: "",
      amount: "",
      transferDate: "",
    };

    if (!selectedFrom) {
      temp.from = "Please select From account";
      valid = false;
    }

    if (!selectedTo) {
      temp.to = "Please select To account";
      valid = false;
    }

    if (
      selectedFrom &&
      selectedTo &&
      selectedFrom.bankId === selectedTo.bankId &&
      selectedFrom.paymentMethodId === selectedTo.paymentMethodId
    ) {
      temp.to = "From and To account cannot be same";
      valid = false;
    }

    if (!amount || Number(amount) <= 0) {
      temp.amount = "Please enter valid amount";
      valid = false;
    }

    if (
      selectedFrom &&
      Number(amount) > Number(selectedFrom.balance || 0)
    ) {
      temp.amount = "Insufficient balance";
      valid = false;
    }

    if (!transferDate) {
      temp.transferDate = "Please select transfer date";
      valid = false;
    }

    setErrors(temp);

    return valid;
  };

  const handleMoneyTransfer = async () => {

    if (!validateTransfer()) return;

        if (isApplyTriggeredRef.current) return
    isApplyTriggeredRef.current = true


    try {

    const payload = {
      fromBankId: selectedFrom?.bankId,
      toBankId: selectedTo?.bankId,
      amount,
    };

    const res = await moneyTransfer(activeHostelId, payload);

    if (res?.success) {

      setModalType("success");
      setModalMessage(res?.message || "Money Transfered Successfully");
      setShowSuccessModal(true);

        await NewgetBankList(activeHostelId);

      setTimeout(() => {
        getBankOverview(activeHostelId, selectedFrom?.bankId)
        setShowSuccessModal(false);
        navigation.goBack();
      }, 1500);

    } else {
      setModalType("error");
      setModalMessage(
        res?.message || "Failed to add transfer"
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

  // const fromAccounts = [
  //   {
  //     id: 1,
  //     bank: "Canara Bank",
  //     type: "Bank Account",
  //     balance: "₹ 40,000.00",
  //   },
  //   {
  //     id: 2,
  //     bank: "State Bank of India",
  //     type: "Bank Account",
  //     balance: "₹ 2,000.00",
  //   },
  //   {
  //     id: 3,
  //     bank: "Petty Cash",
  //     type: "Cash Account",
  //     balance: "₹ 2,000.00",
  //   },
  // ];

  // const toAccounts = [
  //   {
  //     id: 4,
  //     bank: "State Bank of India",
  //     type: "Bank Account",
  //     balance: "₹ 2,000.00",
  //   },
  //   {
  //     id: 5,
  //     bank: "Imman Credit Card",
  //     type: "Credit Card",
  //     balance: "₹ 17,000.00",
  //   },
  //   {
  //     id: 6,
  //     bank: "Owner Cash",
  //     type: "Cash Account",
  //     balance: "₹ 2,000.00",
  //   },
  // ];

  const AccountCard = ({ item, selected, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <Image
            source={require("../../../Assets/Images/bankBlue.png")}
            style={styles.icon}
          />
        </View>

        <View>
          <Text style={styles.bank}>
            {item.bankName || item.cashAccountType || item.displayName}
          </Text>

          <Text style={styles.type}>
            {item.accountType === "BANK"
              ? "Bank Account"
              : `${item.accountType} Account`}
          </Text>

          <Text style={styles.balance}>
            Avl Bal : ₹ {Number(item.balance || 0).toLocaleString("en-IN")}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.radio,
          selected && styles.radioActive,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />

      <View style={styles.container}>

        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>

          <Text style={styles.header}>
            Self Transfer
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.sectionRow}>
            <Text style={styles.section}>From</Text>

            <TouchableOpacity
              onPress={() => setShowFromList(!showFromList)}
            >
              <Image
                source={
                  showFromList
                    ? require("../../../Assets/Images/direction-down.png")
                    : require("../../../Assets/Images/direction-down.png")
                }
                style={styles.arrow}
              />
            </TouchableOpacity>
          </View>

          {showFromList ? (
            fromAccounts.map((item) => (
              <AccountCard
                key={item.bankId}
                item={item}
                selected={selectedFrom?.bankId === item.bankId}
               

                onPress={() => {
                  setSelectedFrom(item);
                  setErrors(prev => ({
                    ...prev,
                    from: ""
                  }));
                  setShowFromList(false);
                }}
              />
            ))
          ) : (
            selectedFrom && (
              <AccountCard
                item={selectedFrom}
                selected={true}
                onPress={() => setShowFromList(true)}
              />
            )
          )}

        

           {errors.from  && (
              <ErrorMessage
                message={errors.from }
                type="error"
              />
            )}

          <View style={styles.sectionRow}>
            <Text style={styles.section}>To</Text>

            <TouchableOpacity
              onPress={() => setShowToList(!showToList)}
            >
              <Image
                source={
                  showToList
                    ? require("../../../Assets/Images/direction-down.png")
                    : require("../../../Assets/Images/direction-down.png")
                }
                style={styles.arrow}
              />
            </TouchableOpacity>
          </View>
          {showToList ? (
            toAccounts.map((item, index) => (
              <AccountCard
                key={item?.paymentMethodId || `${item?.bankId}-${index}`}
                item={item}
                selected={selectedTo?.bankId === item?.bankId}
              
                onPress={() => {
                  setSelectedTo(item);
                  setErrors(prev => ({
                    ...prev,
                    to: ""
                  }));
                  setShowToList(false);
                }}
              />
            ))
          ) : (
            selectedTo && (
              <AccountCard
                item={selectedTo}
                selected={true}
                onPress={() => setShowToList(true)}
              />
            )
          )}

         

            {errors.to  && (
              <ErrorMessage
                message={errors.to }
                type="error"
              />
            )}

          <Text style={styles.label}>
            Enter Amount to transfer <Text style={{ color: "red" }}>*</Text>
          </Text>

          <ValidatedInput
            keyboardType="numeric"
            type="numberOnly"
            inputType="numeric"
            placeholder="Enter Amount"
            style={styles.input}
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              setErrors(prev => ({
                ...prev,
                amount: ""
              }));
            }}
          />

        

           {errors.amount  && (
              <ErrorMessage
                message={errors.amount }
                type="error"
              />
            )}

          <Text style={styles.label}>
            Date <Text style={{ color: "red" }}>*</Text>
          </Text>


          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setOpenTransferDate(true);
            }}
          >
            <View style={styles.dateInputWrapper}>
              <TextInput
                style={styles.dateInput}
                placeholder="DD-MM-YYYY"
                value={transferDate ? dayjs(transferDate).format("DD-MM-YYYY") : ""}
                editable={false}
                pointerEvents="none"
              />

              <Image
                source={require("../../../Assets/Images/calendar.png")}
                style={styles.calendarIcon}
              />
            </View>
          </TouchableOpacity>

           {errors.transferDate  && (
              <ErrorMessage
                message={errors.transferDate }
                type="error"
              />
            )}

          <Text style={styles.label}>
            Description
          </Text>

          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Describe the notes..."
            style={styles.textArea}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleMoneyTransfer} 
            style={[styles.transferBtn, isApplyTriggeredRef.current && { opacity: 0.6 }]}
              disabled={isApplyTriggeredRef.current}
              >
              <Text style={styles.transferText}>
                Transfer
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </View>

      {openTransferDate && (
        <View style={styles.dateOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenTransferDate(false)}>
            <View style={styles.overlayBg} />
          </TouchableWithoutFeedback>

          <View style={styles.calendarContainer}>
            <Calendar
              markingType="custom"
              markedDates={{
                ...markedDates,
                ...(transferDate && {
                  [transferDate]: {
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
              current={transferDate || dayjs().format("YYYY-MM-DD")}
              onDayPress={(day) => {
                if (markedDates[day.dateString]?.disabled) return;

                setTransferDate(day.dateString);
                setErrors(prev => ({
                  ...prev,
                  transferDate: ""
                }));
                setOpenTransferDate(false);

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
    paddingHorizontal: 20,
    paddingTop: 60
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  backIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 16,
  },

  header: {
    fontSize: 24,
    fontFamily: "Gilroy-Bold",
    color: "#202020",
  },

  section: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },

  arrow: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  bank: {
    fontSize: 16,
    fontWeight: "600",
  },

  type: {
    color: "#666",
    marginTop: 2,
  },

  balance: {
    color: "#2952E8",
    marginTop: 4,
    fontSize: 13,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CFCFCF",
  },

  radioActive: {
    borderColor: "#2952E8",
    backgroundColor: "#2952E8",
  },

  label: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "500",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 10,
    paddingHorizontal: 14,
  },

  textArea: {
    height: 110,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 10,
    padding: 14,
    textAlignVertical: "top",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 30,
    marginBottom: 40,
  },

  cancelBtn: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginRight: 12,
  },

  cancelText: {
    fontSize: 16,
  },

  transferBtn: {
    backgroundColor: "#2952E8",
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },

  transferText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontFamily: "Gilroy-Medium",
    marginTop: 4,
    marginLeft: 2,
  },

});