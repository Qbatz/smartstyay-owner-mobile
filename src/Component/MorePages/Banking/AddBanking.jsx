import React, { useState, useEffect, useContext , useCallback , useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
  BackHandler,
  ScrollView,
  Image,Animated , PanResponder
} from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";

import CloseIcon from "../../../Assets/Images/remove.png";

  


export default function AddBankingModal({ visible, onClose, mode, editTab }) {

    const { activeHostelId } = useContext(CommonContexts);
  const { bankList, addBanking,  editBanking, errorMsg, getBankListByHostel } =
    useContext(BankingContext);

  // COMMON
  const [errors, setErrors] = useState({});

    console.log("bankinglist", bankList );

  // BANK TAB
  const [beneficiary, setBeneficiary] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [description , setDescription] = useState("")

  // UPI TAB
  const [upiBank, setUpiBank] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [upiBankOpen, setUpiBankOpen] = useState(false);

  // CARD TAB
  const [cardBank, setCardBank] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [cardNo, setCardNo] = useState("");
  const [cardBankOpen, setCardBankOpen] = useState(false);
  const [cardTypeOpen, setCardTypeOpen] = useState(false);

  // CASH TAB
  const [cashName, setCashName] = useState("");


  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const [initialData, setInitialData] = useState(null);


    const sheetY = useRef(new Animated.Value(700)).current;

    const [isInputFocused, setIsInputFocused] = useState(false);



      useEffect(() => {
    if (activeHostelId) {
      getBankListByHostel(activeHostelId);
    }
  }, [activeHostelId]);

  const [activeTab, setActiveTab] = useState("Bank");
  useEffect(() => {
    if (!visible && mode === "add") {
      setActiveTab("Bank");
    }
  }, [visible, mode]);

  useEffect(() => {
  if (mode === "add" && visible) {
    resetForm();
  }
}, [mode, visible]);





useEffect(() => {
  if (mode === "edit" && editTab?.raw) {
    const d = editTab.raw;

    console.log("editvalue", d);
    setInitialData(d);

    if (d.accountType === "BANK") {
      setActiveTab("Bank");
      setBeneficiary(d.accountHolderName || "");
      setAccountNo(d.accountNumber || "");
      setBankName(d.bankName || "");
      setIfsc(d.ifscCode || "");
      setDescription(d.description || "");
    }



    if (d.accountType === "UPI") {
  setActiveTab("UPI");

  const matchedBank = bankOptions.find(
    (b) => b.id === d.bankingId
  )

  setUpiBank(matchedBank || null);
  setUpiId(d.upiId || "");
  setDescription(d.description || "");
}


 if (d.accountType === "CARD") {
  setActiveTab("Card");

  const matchedBank = bankOptions.find(
    (b) => b.id === d.bankingId
  );

  setCardBank(matchedBank || null);
  setCardNo(d.creditCardNumber || d.debitCardNumber || "");
  setCardType({ name: d.cardType?.toLowerCase() });
  setDescription(d.description || "");
}


    if (d.accountType === "CASH") {
      setActiveTab("Cash");
      setCashName(d.accountHolderName || "");
      setDescription(d.description || "");
    }
  }
}, [mode, editTab]);




  useEffect(() => {
    const backAction = () => {
      if (visible) {
        handleClose();
        return true;
      }
      return false;
    };

    const back = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => back.remove();
  }, [visible]);

  const resetForm = () => {
  setBeneficiary("");
  setBankName("");
  setAccountNo("");
  setIfsc("");
  setDescription("");

  setUpiBank(null);
  setUpiId("");
  setUpiBankOpen(false);

  setCardBank(null);
  setCardType(null);
  setCardNo("");
  setCardBankOpen(false);
  setCardTypeOpen(false);

  setCashName("");

  setErrors({});
  setInitialData(null);
  setActiveTab("Bank");
};

const handleClose = () => {
  resetForm();
  onClose();
};


   

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     () => {
  //       navigation.goBack();
  //       return true;
  //     }
  //   );

  //   return () => backHandler.remove();
  // }, []);


const bankOptions = Array.isArray(bankList)
  ? bankList.map((b) => ({
      id: b?.bankingId,
      name: `${b?.accountHolderName} - ${b?.accountType}`,
    }))
  : [];



  // CARD TYPE LIST
  const cardTypeOptions = [
    { id: 1, name: "debit" },
    { id: 2, name: "credit" },
  ];

  console.log("cardtype", cardType);

const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
onMoveShouldSetPanResponder: (_, g) => {
  if (isInputFocused) return false;  
  return Math.abs(g.dy) > 20 && Math.abs(g.dx) < 10;
},

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(translateY, {
            toValue: 700,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            handleClose();
            translateY.setValue(0);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  

   useEffect(() => {
      const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
        Animated.timing(translateY, {
          toValue: -e.endCoordinates.height + 60,
          duration: 180,
          useNativeDriver: true,
        }).start();
      });
  
      const hideSub = Keyboard.addListener("keyboardDidHide", () => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start();
      });
  
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);
  

  const Dropdown = ({ label, selected, open, setOpen, list, onSelect, error }) => (
  <>
    <Text style={styles.label}>{label}<Text style={{color:'red'}}> *</Text></Text>

    <TouchableOpacity
      style={styles.dropdownBox}
      onPress={() => setOpen(!open)}
    >
      <Text style={{ color: selected ? "#000" : "#9CA3AF" }}>
        {selected?.name || "Select"}
      </Text>
      <Text>⌄</Text>
    </TouchableOpacity>

    {open && (
      <View style={styles.dropdownMenu}>
        <ScrollView>
          {list.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.option}
              onPress={() => {
                onSelect(item);
                setOpen(false);
              }}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}

    {error && <ErrorMessage message={error} type="error" />}
  </>
);

const isOnlyNumbers = (v) => /^\d+$/.test(v);

const isAccountNoValid = (v) => {
  if (!v) return "Please Enter Account No";
  if (/^0+$/.test(v)) return "Account Number cannot be zeros";
  if (v.length < 9 || v.length > 18)
    return "Account Number Must Be 9–18 Digits";
  return "";
};

const isValidUpi = (v) => {
  const regex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
  if (!v) return "Please Enter UPI ID";
  if (!regex.test(v)) return "Invalid UPI ID";
  return "";
};




const validate = () => {
  let err = {};

  if (activeTab === "Bank") {
    if (!beneficiary.trim())
      err.beneficiary = "Please Enter Beneficiary Name";

    const accErr = isAccountNoValid(accountNo);
    if (accErr) err.accountNo = accErr;
  }

  if (activeTab === "UPI") {
    if (!upiBank)
      err.upiBank = "Please Select Bank";

    const upiErr = isValidUpi(upiId);
    if (upiErr) err.upiId = upiErr;
  }

  if (activeTab === "Card") {
    if (!cardBank)
      err.cardBank = "Please Select Bank";

    if (!cardType)
      err.cardType = "Please Select Card Type";
  }

  if (activeTab === "Cash") {
    if (!cashName.trim())
      err.cashName = "Please Enter Beneficiary Name";
  }

  setErrors(err);
  return Object.keys(err).length === 0;
};


// const isChanged =
//   beneficiary !== initial.beneficiary ||
//   accountNo !== initial.accountNo ||
//   description !== initial.description;

// if (!isChanged) {
//   setErrors({ common: "No Changes Detected" });
//   return;
// }


const hasChanges = () => {
  if (!initialData) return true;

  if (activeTab === "Cash") {
    return (
      cashName.trim() !== (initialData.accountHolderName || "").trim() ||
      description.trim() !== (initialData.description || "").trim()
    );
  }

  if (activeTab === "UPI") {
    return (
      upiId !== initialData.upiId ||
      description !== initialData.description
    );
  }

  if (activeTab === "Card") {
    return (
      cardNo !== (initialData.creditCardNumber || initialData.debitCardNumber) ||
      cardType?.name?.toUpperCase() !== initialData.cardType ||
      description !== initialData.description
    );
  }

  if (activeTab === "Bank") {
    return (
      beneficiary !== initialData.accountHolderName ||
      accountNo !== initialData.accountNumber ||
      bankName !== initialData.bankName ||
      ifsc !== initialData.ifscCode ||
      description !== initialData.description
    );
  }

  return true;
};




const handleAdd = async () => {
  if (!validate()) return;

    if (mode === "edit" && !hasChanges()) {
    setErrors({ common: "No changes detected" });
    return;
  }

  let payload = null;

  if (activeTab === "Bank") {
    payload = {
      accountType: "BANK",
      holderName: beneficiary,
      accountNo: Number(accountNo),
      bankName,
      ifscCode: ifsc,
      description,
      branchName: "",
      branchCode: "",
      isDefault: true,
      upiId: "",
      cardType: "",
      cardNumber: "",
    };
  }

  if (activeTab === "UPI") {
    payload = {
      accountType: "UPI",
      holderName: upiBank.name.split(" - ")[0],
      accountNo: "",
      bankName: "",
      ifscCode: "",
      description,
      branchName: "",
      branchCode: "",
      isDefault: true,
      upiId,
      cardType: "",
      cardNumber: "",
    };
  }

  if (activeTab === "Card") {
    payload = {
      accountType: "CARD",
      holderName: cardBank.name.split(" - ")[0],
      accountNo: "",
      bankName: "",
      ifscCode: "",
      description,
      branchName: "",
      branchCode: "",
      isDefault: true,
      upiId: "",
      cardType: cardType.name.toUpperCase(),
      cardNumber: cardNo,
    };
  }

  if (activeTab === "Cash") {
    payload = {
      accountType: "CASH",
      holderName: cashName,
      accountNo: "",
      bankName: "",
      ifscCode: "",
      description,
      branchName: "",
      branchCode: "",
      isDefault: true,
      upiId: "",
      cardType: "",
      cardNumber: "",
    };
  }

  const res =
    mode === "edit"
      ? await editBanking(activeHostelId, editTab?.bankId, payload)
      : await addBanking(activeHostelId, payload);

  if (res?.success) {
    setModalType("success");
    setModalMessage(`${activeTab} ${mode === "edit" ? "Updated" : "Added"} Successfully`);
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      handleClose();
      getBankListByHostel(activeHostelId);
    }, 1200);
  }
};


const TabButton = ({ title }) => {
  const disabled = mode === "edit" && title !== activeTab;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.tabBtn,
        activeTab === title && styles.activeTab,
        disabled && { opacity: 0.3 }
      ]}
      onPress={() => setActiveTab(title)}
    >
      <Text style={styles.tabText}>{title}</Text>
    </TouchableOpacity>
  );
};



  // const TabButton = ({ title }) => {
  //   const disabled = mode === "edit" && title !== editTab;

  //   return (
  //     <TouchableOpacity
  //       disabled={disabled}
  //       style={[
  //         styles.tabBtn,
  //         activeTab === title && styles.activeTab,
  //         disabled && { opacity: 0.3 }
  //       ]}
  //       onPress={() => !disabled && setActiveTab(title)}
  //     >
  //       <Text
  //         style={[
  //           styles.tabText,
  //           activeTab === title && { color: "#1D5DFF", fontWeight: "700" },
  //         ]}
  //       >
  //         {title}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };


  const RenderForm = () => {
    switch (activeTab) {
      case "Bank":
        return (
          <>
   <Text style={styles.label}>Beneficiary Name <Text style={{color:'red'}}> *</Text></Text>
<TextInput
  style={styles.input}
  placeholder="Enter Beneficiary Name"
  value={beneficiary}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
  // autoFocus
  onChangeText={(v) => {
    setBeneficiary(v);
    setErrors({ ...errors, beneficiary: "" , common: ""});
  }}
/>
{errors.beneficiary && <ErrorMessage message={errors.beneficiary} type="error" />}

<Text style={styles.label}>Bank Name</Text>
<TextInput
  style={styles.input}
  placeholder="Enter Bank Name"
  value={bankName}
  // onChangeText={setBankName}
     onChangeText={(v) => {
    setBankName(v);
    setErrors(prev => ({ ...prev, bankName: "", common: "" }));
  }}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
/>

<Text style={styles.label}>Account No <Text style={{color:'red'}}> *</Text></Text>
<TextInput
  style={styles.input}
  placeholder="Enter Account Number"
  keyboardType="number-pad"
  maxLength={18}
  value={accountNo}
  onChangeText={(v) => {
    const onlyNum = v.replace(/[^0-9]/g, "");
    setAccountNo(onlyNum);
    setErrors({ ...errors, accountNo: "" , common: "" });
  }}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
/>

{errors.accountNo && <ErrorMessage message={errors.accountNo} type="error" />}

            <Text style={styles.label}>IFSC Code</Text>
            <TextInput
  style={styles.input}
  placeholder="Enter IFSC Code"
  value={ifsc}
  // onChangeText={setIfsc}
         onChangeText={(v) => {
    setIfsc(v);
    setErrors(prev => ({ ...prev, ifsc: "", common: "" }));
  }}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
/>

            <Text style={styles.label}>Description</Text>
                      <TextInput
  style={styles.input}
  placeholder="Enter Description"
  value={description}
  // onChangeText={setDescription}
       onChangeText={(v) => {
    setDescription(v);
    setErrors(prev => ({ ...prev, description: "", common: "" }));
  }}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
/>
          </>
        );

      case "UPI":
        return (
          <>
            {activeTab === "UPI" && (
  <>
<Dropdown
  label="Bank"
  selected={upiBank}
  open={upiBankOpen}
  setOpen={setUpiBankOpen}
  list={bankOptions}
  onSelect={(item) => {
    setUpiBank(item);
    setErrors({ ...errors, upiBank: "", common: "" });
  }}
  error={errors.upiBank}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
/>


    <Text style={styles.label}>UPI ID <Text style={{color:'red'}}> *</Text></Text>
    <TextInput
      style={styles.input}
      placeholder="Enter UPI ID"
      value={upiId}
    onChangeText={(v) => {
    setUpiId(v);
    setErrors(prev => ({ ...prev, upiId: "", common: "" }));
  }}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
    />

    {errors.upiId && <ErrorMessage message={errors.upiId} type="error" />}
  </>
)}




            <Text style={styles.label}>Description</Text>
                           <TextInput
  style={styles.input}
  placeholder="Enter Description"
  value={description}
     onChangeText={(v) => {
    setDescription(v);
    setErrors(prev => ({ ...prev, description: "", common: "" }));
  }}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
/>
          </>
        );

      case "Card":
        return (
          <>
       {activeTab === "Card" && (
  <>
    <Dropdown
      label="Bank"
      selected={cardBank}
      open={cardBankOpen}
      setOpen={setCardBankOpen}
      list={bankOptions}
  onSelect={(item) => {
    setCardBank(item);
    setErrors({ ...errors, cardBank: "" , common: ""});
  }}
  error={errors.cardBank}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
    />

    <Dropdown
      label="Card Type"
      selected={cardType}
      open={cardTypeOpen}
      setOpen={setCardTypeOpen}
      list={cardTypeOptions}
      // onSelect={setCardType}
        onSelect={(item) => {
    setCardType(item);
    setErrors({ ...errors, cardType: "" , common: ""});
  }}
      error={errors.cardType}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
    />

    <Text style={styles.label}>Card Number</Text>
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      placeholder="XXXX XXXX XXXX"
      value={cardNo}
      onChangeText={(v) => {
    setCardNo(v);
    setErrors(prev => ({ ...prev, cardNo: "", common: "" }));
  }}
      
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
    />
  </>
)}


            <Text style={styles.label}>Description</Text>
                               <TextInput
  style={styles.input}
  placeholder="Enter Description"
  value={description}
    onChangeText={(v)=> {
    setDescription(v)
    setErrors(prev => ({ ...prev,  common: "" }))
  }}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
/>
          </>
        );

      case "Cash":
        return (
          <>
             <Text style={styles.label}>Beneficiary Name <Text style={{color:'red'}}> *</Text></Text>
  <TextInput
  style={styles.input}
  placeholder="Enter Beneficiary Name"
  value={cashName}
  onChangeText={(v) => {
    setCashName(v);
    setErrors(prev => ({ ...prev, cashName: "", common: "" }));
  }}
  onFocus={() => setIsInputFocused(true)}
  // onBlur={() => setIsInputFocused(false)}
/>

{errors.cashName && (
  <ErrorMessage message={errors.cashName} type="error" />
)}



            <Text style={styles.label}>Description</Text>
                               <TextInput
  style={styles.input}
  placeholder="Enter Description"
  value={description}
  onChangeText={(v)=> {
    setDescription(v)
    setErrors(prev => ({ ...prev,  common: "" }))
  }}
  
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
/>
          </>
        );

      default:
        return null;
    }
  };

  return (

    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType} />

  {visible && (
  <View style={styles.sheetOverlay}>
    {/* BACKDROP */}
    <TouchableWithoutFeedback   onPress={() => {
    if (!isInputFocused) handleClose();
  }}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>
    

    {/* SHEET */}
    <Animated.View
      style={[
        styles.sheet,
        { transform: [{ translateY }] }
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.sheetHandle} />

      {/* HEADER */}
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>
          {mode === "edit" ? `Edit ${activeTab}` : `Add ${activeTab}`}
        </Text>

        <TouchableOpacity onPress={handleClose}>
          <Image source={CloseIcon} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabsRow}>
        <TabButton title="Bank" />
        <TabButton title="UPI" />
        <TabButton title="Card" />
        <TabButton title="Cash" />
      </View>

      {/* FORM */}
      <ScrollView
        // keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
           keyboardShouldPersistTaps="always"
             keyboardDismissMode="none"
      >
        {RenderForm()} 
      </ScrollView>

      {errors.common && (
  <ErrorMessage message={errors.common} type="error" />
)}


      {/* BUTTON */}
      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={styles.addBtnText}>
          {mode === "edit" ? "Update" : "Add"}
        </Text>
      </TouchableOpacity>

    </Animated.View>
  </View>
)}




      {/* <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <Pressable style={styles.overlay} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {mode === "edit"
                ? `Edit ${activeTab}`
                : `Add ${activeTab}`}
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Image source={CloseIcon} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>


          <View style={styles.tabsRow}>
            <TabButton title="Bank" />
            <TabButton title="UPI" />
            <TabButton title="Card" />
            <TabButton title="Cash" />
          </View>

          <ScrollView style={{ maxHeight: 350 }}   keyboardShouldPersistTaps="handled">
            <RenderForm />
          </ScrollView>

{errorMsg ? (
  <View style={{ marginTop: 8 }}>
    <ErrorMessage message={errorMsg} type="error" />
  </View>
) : null}

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>
              {mode === "edit" ? "Update" : "Add"}
            </Text>
          </TouchableOpacity>

        </View>
      </Modal> */}
    </>

  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    elevation: 10,
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  closeIcon: {
    height: 12, width: 12,
    color: "#000",
  },

  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#1D5DFF",
  },

  tabText: {
    fontSize: 14,
    color: "#555",
  },

  label: {
    fontSize: 13,
    marginBottom: 6,
    marginTop: 10,
    color: "#444",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    padding: 10,
  },

  addBtn: {
    backgroundColor: "#1D5DFF",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dropdownBox: {
  borderWidth: 1,
  borderColor: "#D9D9D9",
  borderRadius: 10,
  padding: 12,
  marginTop: 6,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff",
},

dropdownMenu: {
  borderWidth: 1,
  borderColor: "#D9D9D9",
  borderRadius: 10,
  marginTop: 6,
  backgroundColor: "#fff",
  maxHeight: 160,
  elevation: 6,
},

option: {
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#EEE",
},
sheetOverlay: {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
  zIndex: 9999,
},

sheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  paddingBottom: 30,
  minHeight: "77%",  },

sheetHandle: {
  width: 60,
  height: 5,
  backgroundColor: "#ccc",
  alignSelf: "center",
  borderRadius: 30,
  marginBottom: 15,
},


});
