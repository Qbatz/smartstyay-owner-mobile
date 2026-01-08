import React, { useState, useEffect , useContext} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
  BackHandler ,Modal , TouchableWithoutFeedback
} from "react-native";
import { CommonContexts } from "../../../Context/CommonContext";
import { ExpensesContext } from "../../../Context/ExpensesContext";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";


export default function AddExpenses({ navigation, route }) {


     const {fetchExpenses ,IntializeexpensesList, GetInitializeExpense, expenses, expensesList, GetExpenseList, loading , AddExpense } = useContext(ExpensesContext);
     const { activeHostelId } = useContext(CommonContexts);

  const editData = route?.params?.editData || null;

  console.log("IntializeexpensesList", IntializeexpensesList);
  

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");

  // STATES
  // const [openDatePicker, setOpenDatePicker] = useState(false);
const [openPurchaseDate, setOpenPurchaseDate] = useState(false);
const [purchaseDate, setPurchaseDate] = useState(null);


  const [category, setCategory] = useState(editData?.category || "");
  const [unitCount, setUnitCount] = useState(editData?.unitCount || "");

  const [perUnit, setPerUnit] = useState(editData?.perUnit || "");
  const [purchaseAmount, setPurchaseAmount] = useState(editData?.amount || "");
  const [description, setDescription] = useState(editData?.description || "");

 

  // Dropdown states
  const [unitCountOpen, setUnitCountOpen] = useState(false);
  // CATEGORY
const [categoryOpen, setCategoryOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState(null);

// SUB CATEGORY
const [subCategoryOpen, setSubCategoryOpen] = useState(false);
const [selectedSubCategory, setSelectedSubCategory] = useState(null);
const [selectedMode, setSelectedMode] = useState(null)
// const [subCategoryList, setSubCategoryList] = useState([]);

// PAYMENT
const [modePaymentOpen, setModePaymentOpen] = useState(false);
const [modePayment, setModePayment] = useState(null);

const categoryList = IntializeexpensesList?.listExpenses || [];


const subCategoryList = selectedCategory?.subCategories || [];



  // OPTIONS
  const categoryOptions = [];
  const unitCountOptions = [];

  const [categoryErr, setCategoryErr] = useState("");
const [subCategoryErr, setSubCategoryErr] = useState("");
const [dateErr, setDateErr] = useState("");
const [amountErr, setAmountErr] = useState("");
const [modeErr, setModeErr] = useState("");

const paymentOptions =
  IntializeexpensesList?.banks?.map((b) => ({
    id: b?.bankId,
    name: `${b?.holderName} - ${b?.bankName}`,
  })) || [];



  useEffect(() => {
    if (activeHostelId) {
      fetchExpenses(activeHostelId);
    }
   
  }, [activeHostelId]);

    useEffect(() => { 
    if (activeHostelId) {
      GetInitializeExpense(activeHostelId)
    }
   
  }, [activeHostelId]);

  useEffect(() => {
  const amount = Number(purchaseAmount);
  const units = Number(unitCount);

  if (amount > 0 && units > 0) {
    const per = amount / units;
    setPerUnit(per.toString());
  } else {
    setPerUnit("");
  }
}, [purchaseAmount, unitCount]);



  // BACK HANDLER
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  // CLOSE ALL DROPDOWNS
  const closeAll = () => {
    setCategoryOpen(false);
    setUnitCountOpen(false);
    setModePaymentOpen(false);
    setOpenDatePicker(false);
  };

  // REUSABLE DROPDOWN FIELD
  const renderSelectField = (label, selected, open, setOpen, list, onSelect) => (
    <View style={{ marginBottom: 6 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.select}
        onPress={() => {
          closeAll();
          setOpen(!open);
        }}
      >
        <Text style={styles.selectText}>{selected}</Text>
        <Text style={styles.caret}>⌄</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownBox}>
          <ScrollView
            style={{ maxHeight: 180 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {list.map((item, i) => {
              const isSelected = selected === item;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    isSelected && styles.dropdownItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      isSelected && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const handleSaveExpense = async () => {
  let hasError = false;

  setCategoryErr("");
  setSubCategoryErr("");
  setDateErr("");
  setAmountErr("");
  setModeErr("");

  if (!selectedCategory) {
  setCategoryErr("Please Select Category")
  hasError = true;
}

if (subCategoryList.length > 0 && !selectedSubCategory) {
  setSubCategoryErr("Please select sub category");
  hasError = true;
}

if (!purchaseDate) {
  setDateErr("Please Select Purchase Date");
  hasError = true;
}

if (!purchaseAmount || Number(purchaseAmount) <= 0) {
  setAmountErr("Enter Valid Amount");
  hasError = true;
}

if (!selectedMode) {
  setModeErr("Please Select Mode of Transaction");
  hasError = true;
}


  if (hasError) return

const payload = {
  categoryId: selectedCategory.categoryId,
  subCategory: selectedSubCategory
    ? selectedSubCategory.subCategoryId
    : null,
  purchaseDate: dayjs(purchaseDate).format("DD-MM-YYYY"),
  count: Number(unitCount) || 1,
  totalAmount: Number(purchaseAmount),
  description,
  bankId: selectedMode.id,
  hostelId: activeHostelId,
}

  const res = await AddExpense(payload);

  if (res.success) {
    await GetExpenseList(activeHostelId);

    setModalType("success");
    setModalMessage("Expense Added successfully");
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.goBack();
    }, 1500);
  } else {
    setModalType("error");
    setModalMessage(res?.message || "Something went wrong");
    setShowSuccessModal(true);

    setTimeout(() => setShowSuccessModal(false), 2000);
  }
};



  return (

     <>
       <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}/>
    

    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editData ? "Edit Expense" : "Add Expense"}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >

     <Text style={styles.label}>
  Category <Text style={{ color: "red" }}>*</Text>
</Text>

<TouchableOpacity
  style={styles.expensesDropdownBox}
  onPress={() => {
    setCategoryOpen(!categoryOpen)
    setSubCategoryOpen(false);
    setModePaymentOpen(false);
  }}
>
  <Text style={{ color: selectedCategory ? "#000" : "#9CA3AF" }}>
   {selectedCategory?.categoryName || "Select Category"}
  </Text>
  <Image source={DownArrow} style={styles.expensesArrowIcon} />
</TouchableOpacity>

{categoryOpen && (
  <View style={styles.expensesDropdownMenu}>
    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
      {categoryList.length === 0 ? (
        <Text style={styles.expensesNoDataText}>
          No category found
        </Text>
      ) : (
    categoryList.map((item) => {
  const isSelected =
    selectedCategory?.categoryId === item.categoryId;

  return (
    <TouchableOpacity
      key={item.categoryId}
      style={[
        styles.expensesOption,
        isSelected && styles.expensesOptionSelected,
      ]}
      onPress={() => {
        setSelectedCategory(item);
        setSelectedSubCategory(null);
        setCategoryErr("");
        setCategoryOpen(false);
      }}
      
    >
      <Text
        style={[
          styles.expensesOptionText,
          isSelected && styles.expensesOptionTextSelected,
        ]}
      >
        {item.categoryName}
      </Text>
    </TouchableOpacity>
  )
})


      )}
    </ScrollView>
  </View>
)}

{categoryErr ? (
  <ErrorMessage message={categoryErr} type="error" />
) : null}




 <Text style={styles.label}>
  Sub Category
  {subCategoryList.length > 0 && (
    <Text style={{ color: "red" }}> *</Text>
  )}
</Text>

<TouchableOpacity
  style={[
    styles.expensesDropdownBox,
    subCategoryList.length === 0 && { backgroundColor: "#F3F4F6" },
  ]}
  disabled={subCategoryList.length === 0}
  onPress={() => {
    setSubCategoryOpen(!subCategoryOpen);
    setCategoryOpen(false);
    setModePaymentOpen(false);
  }}

>
  <Text style={{ color: selectedSubCategory ? "#000" : "#9CA3AF" }}>
   {selectedSubCategory?.subCategoryName || "Select Sub Category"}

  </Text>
  <Image source={DownArrow} style={styles.expensesArrowIcon} />
</TouchableOpacity>

{subCategoryOpen && (
  <View style={styles.expensesDropdownMenu}>
    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
      {subCategoryList.length === 0 ? (
        <Text style={styles.expensesNoDataText}>
          No sub category found
        </Text>
      ) : (
 subCategoryList.map((item) => {
  const isSelected =
    selectedSubCategory?.subCategoryId === item.subCategoryId;

  return (
    <TouchableOpacity
      key={item.subCategoryId}
      style={[
        styles.expensesOption,
        isSelected && styles.expensesOptionSelected,
      ]}
      onPress={() => {
        setSelectedSubCategory(item);
        setSubCategoryErr("");
        setSubCategoryOpen(false);
      }}

    >
      <Text
        style={[
          styles.expensesOptionText,
          isSelected && styles.expensesOptionTextSelected,
        ]}
      >
        {item.subCategoryName}
      </Text>
    </TouchableOpacity>
  )
})


      )}
    </ScrollView>
  </View>
)}

{subCategoryErr ? (
  <ErrorMessage message={subCategoryErr} type="error" />
) : null}


<Text style={styles.label}>
  Purchase Date <Text style={{ color: "red" }}>*</Text>
</Text>

<TouchableOpacity
  activeOpacity={0.8}
  onPress={() => setOpenPurchaseDate(true)}
>
  <View style={styles.dateInputWrapper}>
    <TextInput
      style={styles.dateInput}
      placeholder="DD-MM-YYYY"
      value={
        purchaseDate
          ? dayjs(purchaseDate).format("DD-MM-YYYY")
          : ""          // 👈 empty until user selects
      }
      editable={false}
      pointerEvents="none"
    />

    <Image source={CalendarIcon} style={{ width: 20, height: 20 }} />
  </View>
</TouchableOpacity>

{dateErr && <ErrorMessage message={dateErr} type="error" />}


        <Text style={styles.label}>Total amount <Text style={{ color: "red" }}>*</Text></Text>
         <TextInput
          style={styles.inputBox}
          placeholder="Enter Amount"
          value={purchaseAmount}
          keyboardType="numeric"
          onChangeText={(v) => {
          setPurchaseAmount(v);
          setAmountErr("");
          }}
        />
        
{amountErr ? <ErrorMessage message={amountErr} type="error" /> : null}


      <Text style={styles.label}>Unit Count</Text>
<TextInput
  style={styles.inputBox}
  keyboardType="numeric"
  value={unitCount}
  onChangeText={(v) => setUnitCount(v)}
  placeholder="Enter unit count"
/>


        

        {/* Per Unit */}
        <Text style={styles.label}>Per Unit Amount</Text>
<TextInput
  style={[
    styles.inputBox,
    { backgroundColor: "#EAF2FF" } 
  ]}
  value={perUnit}
  editable={false}
  placeholder="0"
/>


 
<Text style={styles.label}>
  Mode of Transaction <Text style={{ color: "red" }}>*</Text>
</Text>

<TouchableOpacity
  style={styles.expensesDropdownBox}
  onPress={() => {
    setModePaymentOpen(!modePaymentOpen);
    setCategoryOpen(false);
    setSubCategoryOpen(false);
  }}
>
  <Text style={{ color: selectedMode ? "#000" : "#9CA3AF" }}>
    {selectedMode?.name || "Select Mode"}
  </Text>
  <Image source={DownArrow} style={styles.expensesArrowIcon} />
</TouchableOpacity>

{modePaymentOpen  && (
  <View style={styles.expensesDropdownMenu}>
    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
      {paymentOptions.length === 0 ? (
        <Text style={styles.expensesNoDataText}>
          No mode found
        </Text>
      ) : (
        paymentOptions.map((item) => {
          const isSelected =
            selectedMode?.id === item.id;

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
                setModePaymentOpen(false)
              }}
            >
              <Text
                style={[
                  styles.expensesOptionText,
                  isSelected &&
                    styles.expensesOptionTextSelected,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  </View>
)}

{modeErr ? (
  <ErrorMessage message={modeErr} type="error" />
) : null}




        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textarea}
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Add a short description"
          placeholderTextColor="#999"
        />

        {/* BUTTONS */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSaveExpense}
          >
            <Text style={styles.saveText}>{editData ? "Update" : "Save"}</Text>
          </TouchableOpacity>
        </View>

 <Modal
  transparent
  visible={openPurchaseDate}
  animationType="fade"
  onRequestClose={() => setOpenPurchaseDate(false)}
>
  <View style={styles.datePickerOverlay}>
    <TouchableOpacity
      style={styles.outsideTouch}
      activeOpacity={1}
      onPress={() => setOpenPurchaseDate(false)}
    />

    <View style={styles.datePickerBox}>
      <TouchableWithoutFeedback>
        <View>
        
          <DatePicker
  mode="single"
  date={purchaseDate ?? new Date()}   
  maxDate={new Date()}                
  onChange={(d) => {
    setPurchaseDate(d.date);
    setDateErr("");
    setOpenPurchaseDate(false);
  }}

/>

        </View>
      </TouchableWithoutFeedback>
    </View>
  </View>
</Modal>

      </ScrollView>
    </SafeAreaView>
     </>
  );
}

/* ============================= STYLES ============================= */




const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", paddingTop: 30 },

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  backIcon: { width: 20, height: 20, marginRight: 12, tintColor: "#222" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111" },

  container: { paddingHorizontal: 20 },

  label: {
    fontSize: 14,
    color: "#222",
    marginTop: 18,
    marginBottom: 6,
    fontWeight: "500",
  },

  select: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  selectText: { fontSize: 15, color: "#000" },
  caret: { fontSize: 18, color: "#444" },

  inputBox: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  inputText: { color: "#111" },

  textarea: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    fontSize: 15,
    textAlignVertical: "top",
  },

  calendarIcon: { width: 22, height: 22, tintColor: "#676767" },

  dropdownBox: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#fff",
    overflow: "hidden",
    maxHeight: 180,
    zIndex: 999,
    elevation: 8,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  dropdownItemSelected: {
    backgroundColor: "#1D5BEE",
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#111",
  },

  dropdownItemTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
  },

  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },

  cancelText: {
    color: "#6B7280",
    fontSize: 15,
  },

  saveBtn: {
    backgroundColor: "#2B6CF6",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
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

 datePickerOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},
outsideTouch: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
datePickerBox: {
  width: "90%",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 12,
  elevation: 10,
  zIndex: 999,
},
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
});
