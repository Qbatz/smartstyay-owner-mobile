import React, { useRef, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image, TouchableWithoutFeedback
} from "react-native";
import ArrowLeft from "../../../Assets/Images/directionleft.png";
import * as ImagePicker from "react-native-image-picker";
import InvoiceLinkIcon from "../../../Assets/Images/Invoice_Link.png";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import Loader from "../../Loader/Loader";
import ValidatedInput from "../ValidatedInput"
import DownArrow from "../../../Assets/Images/direction-down.png";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { useHasPermission } from "../../../Utils/useHasPermission"
import { CustomerContext } from "../../../Context/CustomerContext"
import { CommonContexts } from "../../../Context/CommonContext";
import { VendorContext } from "../../../Context/VendorContext";
import { ExpensesContext } from "../../../Context/ExpensesContext";
import { BankingContext } from "../../../Context/BankingContext";



export default function Investment({
  navigation,
  route,
}) {

  const isApplyTriggeredRef = useRef(false);

  const { settleExpense, settleVendorPayment } = useContext(CustomerContext);;
  const { getVendorDetails, vendorDetails, getVendorSettlementInitialize, vendorSettlementInitialize, } = useContext(VendorContext)
  const { activeHostelId } = useContext(CommonContexts)

  const { expensesList, GetExpenseList, IntializeexpensesList, GetInitializeExpense,
    DeleteExpense, expenseoverviewDetails, GetExpenseById,
  } = useContext(ExpensesContext);

  const { addMoneyInvestment, getBankOverview, NewgetBankList,
    bankOverview, bankList, transactionList, loading, errorMsg, getBankListByHostel, AddBankAmount } =
    useContext(BankingContext);


  const [vendorAppliedAmounts, setVendorAppliedAmounts] = useState({});


  console.log("banklist", bankList);


  const dueAmount = 0

  const [transactionId, setTransactionId] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [description, setDescription] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [attachments, setAttachments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [tempValue, setTempValue] = useState("")
  const [finalValue, setFinalValue] = useState("")

  const [appliedAmounts, setAppliedAmounts] = useState({})

  const [modeErr, setModeErr] = useState("");
  const [nochangeErr, setNochangeErr] = useState("")
  const [errors, setErrors] = useState({});

  const [modePaymentOpen, setModePaymentOpen] = useState(false);
  const [modePayment, setModePayment] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null)

  const [openPurchaseDate, setOpenPurchaseDate] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [dateErr, setDateErr] = useState("");


  const paymentOptions =
    bankList?.map((item) => ({
      id: item?.bankId,
      bankId: item?.bankId,
      name: item?.accountHolderName,
    })) || [];



  useEffect(() => {
    const bank = route.params?.bankDetails;

    if (bank) {
      setSelectedMode({
        id: bank?.bankId,
        bankId: bank?.bankId,
        displayName: bank?.displayName,
        accountType: bank?.accountType,
        accountHolderName: bank?.accountHolderName,
      });

      setErrors((prev) => ({
        ...prev,
        paymentMethod: "",
      }));
    }
  }, [route.params?.bankDetails]);



  const today = dayjs();


  const isDisabledDate = (d) => {
    if (!d) return false;

    if (d.isAfter(today, "day")) return true;

    return false;
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


  const handleTransactionChange = (text) => {
    const filteredText = text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/
      , ""
    );

    setTransactionId(filteredText);
  };

  const balance =
    dueAmount -
    (Number(paidAmount) || 0);

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 0,
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
  }

  const validateForm = () => {
    let newErrors = {};

    if (!paidAmount || Number(paidAmount) <= 0) {
      newErrors.paidAmount = "Please enter paid amount";
    }

    if (!purchaseDate) {
      newErrors.purchaseDate = "Please select paid date";
    }

    // if (!selectedMode) {
    //   newErrors.paymentMethod = "Please select transferring account";
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (isApplyTriggeredRef.current) return;
    isApplyTriggeredRef.current = true;

    try {


      const payload = {
        bankId: selectedMode?.bankId,
        paymentMethodId: "",
        amount: Number(paidAmount),
        description: description?.trim(),
        transactionDate: dayjs(purchaseDate).format("YYYY-MM-DD"),
        transactionId: transactionId?.trim(),
        investorName: route.params?.bankDetails?.responsiblePersonName || "",
      };
      console.log("Investment Payload =>", payload);

      const response = await addMoneyInvestment(
        activeHostelId,
        payload
      );

      if (response?.success) {

        await getBankOverview(
          activeHostelId,
          route.params?.bankId
        );

        await NewgetBankList(activeHostelId);

        setModalType("success");
        setModalMessage("Investment Added Successfully");
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }, 1500);

      } else {

        setModalType("error");
        setModalMessage(
          response?.message || "Failed to add investment"
        );
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500);
      }

    } catch (error) {

      console.log("Investment Error =>", error);

      setModalType("error");
      setModalMessage(
        error?.message || "Something went wrong"
      );
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1500);

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

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Image
              source={ArrowLeft}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <Text style={styles.title}>
            Investment
          </Text>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >

          <Text style={styles.label}>
            Investment

          </Text>

          <View style={styles.inputBox}>
            <Text>
              test

            </Text>
          </View>


          <Text style={styles.label}>
            Amount (INR)  <Text style={{ color: "red" }}>*</Text>
          </Text>

          <View style={styles.amountRow}>


            <ValidatedInput
              placeholder="Enter Amount"
              keyboardType="numeric"
              type="numberOnly"
              inputType="numeric"
              value={paidAmount}
              onChangeText={(text) => {
                setPaidAmount(text);
                setErrors((prev) => ({
                  ...prev,
                  paidAmount: "",
                }));
              }}
              style={styles.amountInput}
            />



          </View>

          <View style={styles.errorWrapper}>
            {errors.paidAmount && (
              <ErrorMessage
                message={errors.paidAmount}
                type="error"
              />
            )}
          </View>






          <Text style={styles.label}>
            Invested Date  <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
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

          <View style={styles.errorWrapper}>
            {errors.purchaseDate && (
              <ErrorMessage
                message={errors.purchaseDate}
                type="error"
              />
            )}
          </View>




          <Text style={styles.label}>
            Payment Method  <Text style={{ color: "red" }}>*</Text>
          </Text>


          <TouchableOpacity
            disabled
            activeOpacity={1}
            style={[
              styles.expensesDropdownBox,
              styles.disabledDropdown,
            ]}
          >
            <View>
              <Text style={styles.accountName}>
                {selectedMode?.displayName || "-"}
              </Text>

              <Text style={styles.accountType}>
                {selectedMode?.accountType || "-"}
              </Text>
            </View>

            <Image
              source={DownArrow}
              style={styles.expensesArrowIcon}
            />
          </TouchableOpacity>


          {modePaymentOpen && (
            <View style={styles.expensesDropdownMenu}>
              <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                {paymentOptions?.length === 0 ? (
                  <Text style={styles.expensesNoDataText}>
                    No mode found
                  </Text>
                ) : (
                  paymentOptions?.map((item) => {
                    const isSelected =
                      selectedMode?.id === item?.id;

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

                          setErrors((prev) => ({
                            ...prev,
                            paymentMethod: "",
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
                          {item?.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>
          )}

          <View style={styles.errorWrapper}>
            {errors.paymentMethod && (
              <ErrorMessage
                message={errors.paymentMethod}
                type="error"
              />
            )}
          </View>


          <Text style={styles.label}>
            Transaction ID
          </Text>

          <TextInput
            style={styles.inputBox}
            placeholder="Enter Transaction ID"
            value={transactionId}
            onChangeText={handleTransactionChange}

          />

          <Text style={styles.label}>
            Description
          </Text>

          <ValidatedInput
            type="description"
            inputType="text"
            multiline
            value={description}
            onChangeText={
              setDescription
            }
            placeholder="Enter Description"
            style={
              styles.descriptionInput
            }
          />






          <View
            style={styles.footer}
          >
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ fontFamily: "Gilroy-Semibold" }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[
                styles.submitBtn,
                isApplyTriggeredRef.current && { opacity: 0.6 },
              ]}
              disabled={isApplyTriggeredRef.current}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Gilroy-Semibold",
                }}
              >
                Invest ₹{Number(paidAmount || 0).toFixed(0)}
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
                if (markedDates[day.dateString]?.disabled) return;

                setPurchaseDate(day.dateString);
                setOpenPurchaseDate(false);
                setDateErr("");
                setErrors((prev) => ({
                  ...prev,
                  purchaseDate: "",
                }));
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
    backgroundColor: "#FFF",
    paddingTop: 50,
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  title: {
    flex: 1,
    fontSize: 24,
    fontFamily: "Gilroy-Bold",
    marginLeft: 12,
  },

  backIcon: {
    width: 25,
    height: 25,
  },

  inputBox: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    justifyContent: "center",
    fontFamily: "Gilroy-Regular"
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    justifyContent: "center",
    fontFamily: "Gilroy-Regular"
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
  },

  amountInput: {
    flex: 1,
    height: 56,
  },

  setBtn: {
    backgroundColor: "#E8EEFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  dueText: {
    textAlign: "right",
    marginRight: 16,
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Gilroy-Semibold"
  },

  uploadBox: {
    height: 90,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  uploadText: {
    color: "#2D5BFF", fontFamily: "Gilroy-Semibold"
  },

  descriptionInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    textAlignVertical: "top",
  },

  summaryCard: {
    margin: 16,
    backgroundColor: "#1F2BA8",
    borderRadius: 16,
    padding: 20,
  },

  summaryTitle: {
    color: "#BFC9FF",
    fontSize: 12,
    fontFamily: "Gilroy-Semibold"
  },

  summaryAmount: {
    color: "#fff",
    fontSize: 34,
    fontFamily: "Gilroy-Bold",
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#4A57D6",
    marginVertical: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  summaryText: {
    color: "#fff",
    fontFamily: "Gilroy-Semibold"
  },

  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },

  cancelBtn: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  submitBtn: {
    flex: 1.5,
    height: 52,
    backgroundColor: "#2D5BFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
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
  card: {
    paddingHorizontal: 16,
    marginTop: 20,

  },
  cardheadingsection: {
    borderLeftWidth: 3,
    borderLeftColor: "#2D5BFF",
    paddingLeft: 12,
  },
  dueLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Gilroy-Regular",
  },

  dueValue: {
    fontSize: 13,
    fontFamily: "Gilroy-Semibold",
    color: "#111827",
  },

  applyLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Gilroy-Regular",
    marginTop: 10,
    marginBottom: 6,
  },

  applyInputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#2D5BFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 52,
  },

  rupeeSymbol: {
    fontSize: 15,
    color: "#111827",
    fontFamily: "Gilroy-Semibold",
    marginRight: 4,
  },

  applyInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
    color: "#111827",
  },

  sectionTitle: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "Gilroy-Semibold"
  },

  innerCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginTop: 15
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },



  valueText: {
    fontSize: 13,
    fontFamily: "Gilroy-Medium"
  },

  amount: {
    fontSize: 15,
    fontFamily: "Gilroy-Semibold",
  },

  smallText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Gilroy-Semibold"
  },

  label: {
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
    fontSize: 15,
    fontFamily: "Gilroy-Medium",
    color: "#111827",
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
    marginHorizontal: 16,
    paddingHorizontal: 16,
    height: 56
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
    height: 56,
    marginHorizontal: 16,
    paddingHorizontal: 16,
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
  errorWrapper: {
    marginHorizontal: 16,
    marginTop: 6,
    alignItems: "flex-start",
  },
  disabledDropdown: {
    backgroundColor: "#F9FAFB",
    opacity: 0.7,
  },
  accountName: {
    fontSize: 17,
    fontFamily: "Gilroy-Medium",
    color: "#111827",
  },

  accountType: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: "Gilroy-Regular",
    color: "#6B7280",
  },

});