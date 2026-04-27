import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions, BackHandler, Modal, KeyboardAvoidingView
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";
import { BillContext } from "../../../Context/BillsContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";
import DatePicker from "react-native-ui-datepicker";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import DownArrow from "../../../Assets/Images/direction-down.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import RemoveIcon from "../../../Assets/Images/remove-circle.png";



export default function CreateBill({ navigation }) {


  const { getCustomersByHostel,
    GetParticularCustomerDetails,
    ParticularcustomerDetails,
    resetParticularCustomer,
    loading,
    errorMsg, } = useCustomer();
  const { activeHostelId } = useContext(CommonContexts);

  const { CreateManualBill, GetAllBillDetails, UpdateBill, GetBillDetailsById
    // loading: billLoading,
    // errorMsg: billError,
  } = useContext(BillContext);

  const scrollRef = useRef(null);
  const inputRefs = useRef([]);


  const scrollToInput = (ref) => {
    if (!ref?.current || !scrollRef.current) return;

    ref.current.measureLayout(
      scrollRef.current.getInnerViewNode(),
      (x, y) => {
        scrollRef.current.scrollTo({
          y: y - 20,
          animated: true,
        });
      },
      () => { }
    );
  };



  const itemOptions = ["Room rent", "EB", "Others"];

  const route = useRoute();
  const { mode, data, customerDetails } = route.params || {};
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  //   const [invoiceDate, setInvoiceDate] = useState("");
  //   const [dueDate, setDueDate] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [customerOpen, setCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [openUpward, setOpenUpward] = useState(false);
  const [openInvoiceDate, setOpenInvoiceDate] = useState(false);
  const [openDueDate, setOpenDueDate] = useState(false);

  const [invoiceDate, setInvoiceDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);


  const [invoiceDateErr, setInvoiceDateErr] = useState("");
  const [dueDateErr, setDueDateErr] = useState("");
  const [customerErr, setCustomerErr] = useState("");
  const [itemErr, setItemErr] = useState("");

  const removeEmojis = (text) =>
    text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF])/g,
      ""
    );



  // useEffect(() => {
  //   if (customerDetails?.customerId) {
  //     setSelectedCustomer({
  //       id: customerDetails.customerId,
  //       name: customerDetails.fullName,
  //     });

  //     setCustomerOpen(false);
  //     setCustomerErr("");

  //     setInvoiceDate(null);
  //     setDueDate(null);
  //   }
  // }, [customerDetails?.customerId]);


  useEffect(() => {
    if (!customerDetails?.customerId) return;

    setSelectedCustomer({
      id: customerDetails.customerId,
      name: customerDetails.fullName,
    });

    setCustomerOpen(false);
    setCustomerErr("");

    setInvoiceDate(null);
    setDueDate(null);
    setInvoiceDateErr("");
    setDueDateErr("");
  }, [customerDetails?.customerId]);


  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");


  // const selectedTypes = items.map((i) => i.type);
  //   const selectedTypes = items.map((i) =>
  //   i.type?.toLowerCase().trim()
  // );

  const selectedTypes = items.map((i) =>
    i.type?.toLowerCase().replace(/\s/g, "")
  );

  // const filteredOptions = itemOptions.filter((op) => {
  //   if (op === "Others") return true;

  //   return !selectedTypes.includes(op.toLowerCase().trim());
  // });

  const filteredOptions = itemOptions.filter((op) => {
    if (op === "Others") return true;

    return !selectedTypes.includes(
      op.toLowerCase().replace(/\s/g, "")
    );
  });
  // const filteredOptions = itemOptions.filter(
  //   (op) => op === "Others" || !selectedTypes.includes(op)
  // );


  // { id, name }

  console.log(items)
  const CustomerOptions = ["Suresh", "Kumar", "Ruban", "Rajesh"];


  useEffect(() => {
    if (activeHostelId) {
      fetchCustomers();
    }
  }, [activeHostelId])

  //   useEffect(() => {
  //   if (selectedCustomer && items.length === 0) {
  //     setItems([
  //       {
  //         type: "Room rent",
  //         description: "",
  //         amount: "",
  //         isExisting: false,
  //       },
  //     ]);
  //   }
  // }, [selectedCustomer]);
  useEffect(() => {
    if (!selectedCustomer) return;
    if (items.length > 0) return;
    if (!filteredOptions?.length) return;

    const firstOption = filteredOptions[0];

    setItems([
      {
        type: firstOption,
        description: firstOption === "Others" ? "" : firstOption,
        amount: "",
        isExisting: false,
      },
    ]);
  }, [selectedCustomer, filteredOptions]);


  const fetchCustomers = async () => {
    const data = await getCustomersByHostel(activeHostelId);
    setCustomers(data?.listCustomers || []);
  };

  const fetchCustomersDetails = async () => {
    if (!selectedCustomer?.id) return;
    await GetParticularCustomerDetails(selectedCustomer.id);
  };

  console.log("selectedCustomer?.id", selectedCustomer?.id)


  useEffect(() => {
    if (selectedCustomer?.id) {
      fetchCustomersDetails();
    }
  }, [selectedCustomer?.id]);

  useEffect(() => {
    const fetchBillDetails = async () => {
      if (mode !== "edit" || !data?.invoiceId) return;

      const res = await GetBillDetailsById({
        hostelId: activeHostelId,
        invoiceId: data.invoiceId,
      });

      if (!res?.success) {
        console.log("Bill details error", res?.message);
        return;
      }

      const bill = res.data;

      console.log("BILL DETAILS API", bill);


      setSelectedCustomer({
        id: data.customerId,
        name: data.fullName,
      });


      setInvoiceNo(bill.invoiceNumber || "");


      setInvoiceDate(
        bill.startDate ? dayjs(bill.startDate, "DD/MM/YYYY") : null
      );

      setDueDate(
        bill.dueDate ? dayjs(bill.dueDate, "DD/MM/YYYY") : null
      );


      setItems(
        (bill.invoiceItems || []).map((item) => {
          let type = item.description;

          // 🔥 FIX
          if (type?.toLowerCase() === "rent") {
            type = "Room rent";
          }
          if (type?.toLowerCase() === "electricity" || type?.toLowerCase() === "eb") {
            type = "EB";
          }

          return {
            type,
            description: type,
            amount: String(item.amount),
            isExisting: true,
          };
        })
      );
    };

    fetchBillDetails();
  }, [mode, data?.invoiceId]);

  // useEffect(() => {
  //   const fetchBillDetails = async () => {
  //     if (mode !== "edit" || !data?.invoiceId) return;

  //     const res = await GetBillDetailsById({
  //       hostelId: activeHostelId,
  //       invoiceId: data.invoiceId,
  //     });

  //     const bill = res.data;

  //     setItems(
  //       (bill.invoiceItems || []).map((item) => {
  //         let type = item.description;

  //         // 🔥 FIX
  //         if (type?.toLowerCase() === "rent") {
  //           type = "Room rent";
  //         }
  //         if (type?.toLowerCase() === "electricity" || type?.toLowerCase() === "eb") {
  //           type = "EB";
  //         }

  //         return {
  //           type,
  //           description: type,
  //           amount: String(item.amount),
  //           isExisting: true,
  //         };
  //       })
  //     );
  //   };

  //   fetchBillDetails();
  // }, [mode, data?.invoiceId]);

  console.log("selectedCustomer", selectedCustomer, ParticularcustomerDetails);

  const today = dayjs();

  const getJoiningDate = () => {
    const jd = ParticularcustomerDetails?.hostelInfo?.joiningDate;
    return jd ? dayjs(jd, "DD/MM/YYYY") : null;
  };


  const isDisabledInvoiceDate = (d) => {
    if (!d) return false;

    const joiningDate = getJoiningDate();

    if (d.isAfter(today, "day")) return true;
    if (joiningDate && d.isBefore(joiningDate, "day")) return true;

    return false;
  };


  const invoiceMarkedDates = {};

  for (let i = -365; i <= 365; i++) {
    const d = dayjs().add(i, "day");
    const key = d.format("YYYY-MM-DD");

    if (isDisabledInvoiceDate(d)) {
      invoiceMarkedDates[key] = {
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


  const isDisabledDueDate = (d) => {
    if (!d) return true;

    // 🔥 Invoice date mandatory
    if (!invoiceDate) return true;

    const joiningDate = getJoiningDate();
    const inv = dayjs(invoiceDate);

    if (d.isAfter(today, "day")) return true;
    if (joiningDate && d.isBefore(joiningDate, "day")) return true;
    if (d.isBefore(inv, "day")) return true;

    return false;
  };


  const dueMarkedDates = {};

  for (let i = -365; i <= 365; i++) {
    const d = dayjs().add(i, "day");
    const key = d.format("YYYY-MM-DD");

    if (isDisabledDueDate(d)) {
      dueMarkedDates[key] = {
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




  console.log("customers", customers);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  //  this is dummy data store for edit 
  //  useEffect(() => {
  //   if (mode === "edit" && data) {
  //     setCustomer(data?.customer);
  //     setInvoiceNo(data?.invoiceno);
  //     setInvoiceDate(data?.invoice_date);
  //     setDueDate(new Date(data?.dueDate));
  //   }
  // }, [mode, data]); 

  const getRoomRentAmount = () => {
    return Number(ParticularcustomerDetails?.hostelInfo?.monthlyRent || 0);
  };


  // useEffect(() => {
  //   if (!ParticularcustomerDetails) return;

  //   const rent = getRoomRentAmount();
  //   if (!rent) return;

  //   setItems((prev) => {
  //     const index = prev.findIndex((i) => i.type === "Room rent");


  //     if (index !== -1) {
  //       const updated = [...prev];
  //       updated[index] = {
  //         ...updated[index],
  //         amount: String(rent),
  //       };
  //       return updated;
  //     }


  //     return [
  //       {
  //         type: "Room rent",
  //         description: "Room rent",
  //         amount: String(rent),
  //       },
  //       ...prev,
  //     ];
  //   });
  // }, [ParticularcustomerDetails]);


  // useEffect(() => {
  //   if (!selectedCustomer || !ParticularcustomerDetails) return;

  //   const rent = getRoomRentAmount();

  //   setItems((prev) =>
  //     prev.map((item) =>
  //       item.type === "Room rent"
  //         ? { ...item, amount: String(rent) }
  //         : item
  //     ))



  // }, [selectedCustomer?.id, ParticularcustomerDetails]);


  useEffect(() => {
    if (!selectedCustomer || !ParticularcustomerDetails) return;

    if (mode === "edit") return;

    const rent = getRoomRentAmount();

    setItems((prev) =>
      prev.map((item) =>
        item.type === "Room rent"
          ? { ...item, amount: String(rent) }
          : item
      )
    );
  }, [selectedCustomer?.id, ParticularcustomerDetails]);

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      const amt = Number(item.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    setTotalAmount(total);
  }, [items]);



  const handleInvoiceDateChange = (date) => {
    setInvoiceDateErr("");

    if (!date) {
      setInvoiceDateErr("Please Select Invoice Date");
      return;
    }

    const selected = dayjs(date);

    if (selected.isAfter(dayjs(), "day")) {
      setInvoiceDateErr("Future date not allowed");
      return;
    }

    const joiningDate = getJoiningDate();
    if (joiningDate && selected.isBefore(joiningDate)) {
      setInvoiceDateErr("Before join date not allowed");
      return;
    }

    if (dueDate && dayjs(dueDate).isBefore(selected)) {
      setDueDateErr("Due date cannot be before invoice date");
    } else {
      setDueDateErr("");
    }

    setInvoiceDate(date);
  };


  const handleDueDateChange = (date) => {
    setDueDateErr("");

    if (!date) {
      setDueDateErr("Please Select Due Date");
      return;
    }

    const joiningDate = getJoiningDate();
    const selected = dayjs(date);

    if (joiningDate && selected.isBefore(joiningDate)) {
      setDueDateErr("Before join date not allowed");
      return;
    }

    if (invoiceDate && selected.isBefore(dayjs(invoiceDate))) {
      setDueDateErr("Due date cannot be before invoice date");
      return;
    }

    setDueDate(date);
  };



  const handleSelectItem = (type) => {
    let amount = "";

    if (type === "Room rent") {
      amount = selectedCustomer
        ? String(getRoomRentAmount())
        : "0";
    }

    // const newCard = {
    //   type,
    //   description: type === "Others" ? "" : type,
    //   amount,
    // };

    const newCard = {
      type,
      description: type === "Others" ? "" : type,
      amount,
      isExisting: false,
    };

    setItems((prev) => [...prev, newCard]);
    setDropdownOpen(false);
    setItemErr("");
  };


  // const updateCard = (index, key, value) => {
  //   const updated = [...items];
  //   updated[index][key] = value;
  //   setItems(updated);
  //   setItemErr("")
  // };

  const updateCard = (index, key, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [key]: value, isExisting: false }
          : item
      )
    );
    setItemErr("");
  };

  const removeCard = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const allowOnlyNumbers = (text) => {
    return text.replace(/[^0-9]/g, "")
  };


  const toggleAmountDropdown = () => {
    setCustomerDropdownVisible((v) => !v);
  };

  const validateAndSubmit = async () => {
    let hasError = false;

    setCustomerErr("");
    setInvoiceDateErr("");
    setDueDateErr("");
    setItemErr("");

    if (!selectedCustomer) {
      setCustomerErr("Please Select Customer");
      hasError = true;
    }

    if (!invoiceDate) {
      setInvoiceDateErr("Please Select Invoice Date");
      hasError = true;
    }

    // if (!dueDate) {
    //   setDueDateErr("Please Select Due Date");
    //   hasError = true;
    // }

    if (!items.length) {
      setItemErr("Please add at least one item");
      hasError = true;
    } else if (
      items.some(
        (i) =>
          !i.description?.trim() ||
          !i.amount ||
          isNaN(i.amount) ||
          Number(i.amount) <= 0
      )
    ) {
      setItemErr("Fill all item details & amount > 0");
      hasError = true;
    }

    if (hasError) return;

    // 🔥 SAME AS WEBSITE
    const payload = {
      customerId: selectedCustomer.id,
      invoiceDate: dayjs(invoiceDate).format("DD-MM-YYYY"),
      // dueDate: dayjs(dueDate).format("DD-MM-YYYY"),
      invoiceNumber: invoiceNo,
      total_amount: totalAmount,
      items: items.map((i) => ({
        invoiceItem: i.description,
        amount: Number(i.amount),
      })),
    };

    console.log("FINAL PAYLOAD", payload);
    let res;

    if (mode === "edit") {

      //   const changedItems = items.map((i) => ({
      //   type: i.description,
      //   amount: Number(i.amount),
      // }));

      const changedItems = items
        .filter((i) => !i.isExisting)
        .map((i) => ({
          type: i.description,
          amount: Number(i.amount),
        }));

      console.log("changesitems", changedItems);


      if (mode === "edit" && changedItems?.length === 0) {
        setModalType("warning");
        setModalMessage("No changes detected");
        setShowSuccessModal(true);

        setTimeout(() => setShowSuccessModal(false), 1500);
        return;
      }

      res = await UpdateBill({
        hostelId: activeHostelId,
        invoiceId: data?.invoiceId,
        payload: changedItems,
      });

      console.log("edit bill", payload);
      // res = await UpdateBill({
      //   hostelId: activeHostelId,
      //   invoiceId: data?.invoiceId,
      //   payload,
      // });
    } else {
      res = await CreateManualBill(payload);
      console.log("addbill", payload);

    }


    console.log("billres", res);

    if (!res?.success) {
      setModalType("warning");
      setModalMessage(res?.message || "Something went wrong");
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 1500);
      return;
    }


    setModalType("success");

    if (mode === "edit") {
      setModalMessage("Bill updated successfully");
    } else {
      setModalMessage(res?.data || "Bill Created successfully");
    }

    setShowSuccessModal(true);
    await GetAllBillDetails(activeHostelId);

    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.goBack();
    }, 1500);


    // if (res.success) {
    //   alert("Bill created successfully");

    // } else {
    //   alert(res.message || "Unable to create bill");
    // }
  };




  return (
    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff", }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>  {mode === "edit" ? "Edit Bill" : " Create New Bill"} </Text>
        </View>




        <ScrollView
          style={styles.container} scrollEnabled={!customerOpen}
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120,   // 🔥 keyboard space
            flexGrow: 1,
          }}
        >


          {/* <Text style={styles.label}>Customer <Text style={{color:'red'}}>*</Text></Text>

<TouchableOpacity
  style={styles.customerdropdownBox}
  onPress={() => setCustomerOpen((v) => !v)}
>
  <Text style={{ color: selectedCustomer ? "#000" : "#9CA3AF" }}>
    {selectedCustomer?.name || "Select Customer"}
  </Text>

  <Image source={DownArrow} style={styles.arrowIcon} />
</TouchableOpacity>


{customerOpen && (
  <View style={styles.customerDropdownMenu}>
    <ScrollView
      style={{ maxHeight: 120 }}
      nestedScrollEnabled={true}  
    >
      {customers.map((item) => {
        const isSelected = selectedCustomer?.id === item.customerId;

        return (
          <TouchableOpacity
            key={item.customerId}
            style={[
              styles.customerOption,
              isSelected && styles.customerOptionSelected,
            ]}
            onPress={() => {
              setSelectedCustomer({
                id: item.customerId,
                name: item.fullName,
              });
              setCustomerOpen(false)
              setInvoiceDate(null)
              setDueDate(null)
              setCustomerErr("")
              // setItems([]); 
            }}
          >
            <Text
              style={[
                styles.customerOptionText,
                isSelected && styles.customerOptionTextSelected,
              ]}
            >
              {item.fullName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
)} */}

          <Text style={styles.label}>
            Customer <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TouchableOpacity
            style={styles.customerdropdownBox}
            onPress={() => {
              if (mode === "edit") return;
              setCustomerOpen((v) => !v);
            }}
          // onPress={() => setCustomerOpen((v) => !v)}
          >
            <Text style={{ color: selectedCustomer ? "#000" : "#9CA3AF" }}>
              {selectedCustomer?.name || "Select Customer"}
            </Text>

            <Image source={DownArrow} style={styles.arrowIcon} />
          </TouchableOpacity>

          {customerOpen && (
            <View style={styles.customerDropdownMenu}>
              <ScrollView style={{ maxHeight: 120 }} nestedScrollEnabled={true}>
                {customers.map((item) => {
                  const isSelected = selectedCustomer?.id === item.customerId;

                  return (
                    <TouchableOpacity
                      key={item.customerId}
                      style={[
                        styles.customerOption,
                        isSelected && styles.customerOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedCustomer({
                          id: item.customerId,
                          name: item.fullName,
                        });


                        setCustomerOpen(false);
                        setCustomerErr("");
                        setInvoiceDate(null);
                        setDueDate(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.customerOptionText,
                          isSelected && styles.customerOptionTextSelected,
                        ]}
                      >
                        {item.fullName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {customerErr ? <ErrorMessage message={customerErr} type="error" /> : null}




          <Text style={{ fontSize: 15, marginBottom: 6, marginTop: 7 }}>Invoice No</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Invoice Number"
            value={invoiceNo}
            onChangeText={(text) => {
              const cleaned = removeEmojis(text);
              setInvoiceNo(cleaned);
            }}
            editable={mode !== "edit"}
          />

          <Text style={styles.label}>
            Invoice Date <Text style={{ color: "red" }}>*</Text>
          </Text>

          {/* <TouchableOpacity
  style={styles.dateBox}
  onPress={() => setOpenInvoiceDate(true)}
>
 <Text style={styles.inputText}>
  {invoiceDate
    ? dayjs(invoiceDate).format("DD-MM-YYYY")
    : "DD/MM/YYYY"}
</Text>

  <Image source={CalendarIcon} style={{ width: 20, height: 20 }} />
</TouchableOpacity> */}

          <TouchableOpacity
            // style={[
            //   styles.dateBox,
            //   !selectedCustomer && { opacity: 0.5 },
            // ]}
            // disabled={!selectedCustomer}

            style={[
              styles.dateBox,
              (!selectedCustomer || mode === "edit") && { opacity: 0.5 },
            ]}
            disabled={!selectedCustomer || mode === "edit"}
            onPress={() => setOpenInvoiceDate(true)}
          >
            <Text style={styles.inputText}>
              {invoiceDate
                ? dayjs(invoiceDate).format("DD-MM-YYYY")
                : "DD/MM/YYYY"}
            </Text>

            <Image source={CalendarIcon} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>


          {/* <Modal
  transparent
  visible={openInvoiceDate}
  animationType="fade"
  onRequestClose={() => setOpenInvoiceDate(false)}
>
  <View style={styles.datePickerOverlay}>
    <TouchableOpacity
      style={styles.outsideTouch}
      activeOpacity={1}
      onPress={() => setOpenInvoiceDate(false)}
    />

    <View style={styles.datePickerBox}>
  <DatePicker
  mode="single"
  date={invoiceDate || new Date()}
  maxDate={new Date()}   
  onChange={(d) => {
    handleInvoiceDateChange(d.date);
    setOpenInvoiceDate(false);
  }}
/>

    </View>
  </View>
</Modal> */}



          {invoiceDateErr && (
            <ErrorMessage message={invoiceDateErr} type="error" />
          )}


          {/* 
     <Text style={styles.label}>
  Due Date <Text style={{ color: "red" }}>*</Text>
</Text>

<TouchableOpacity
  style={styles.dateBox}
  onPress={() => setOpenDueDate(true)}
>
<Text style={styles.inputText}>
  {dueDate
    ? dayjs(dueDate).format("DD-MM-YYYY")
    : "DD/MM/YYYY"}
</Text>

  <Image source={CalendarIcon} style={{ width: 20, height: 20 }} />
</TouchableOpacity>





      {dueDateErr && (
                    <ErrorMessage message={dueDateErr} type="error" />
                                )} */}



          <Text style={styles.label}>Items <Text style={{ color: 'red' }}>*</Text></Text>

          <TouchableOpacity
            style={styles.ItemdropdownBox}
            onPress={() => setDropdownOpen(!dropdownOpen)}
          >
            <Text style={{ color: "#9CA3AF" }}>
              Select Item Type
            </Text>
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.itemDropdownMenu}>
              <ScrollView style={{ maxHeight: 180 }}>
                {filteredOptions.map((op, index) => {
                  const isSelected = false;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.itemOption,
                        isSelected && styles.itemOptionSelected,
                      ]}
                      onPress={() => handleSelectItem(op)}
                    >
                      <Text
                        style={[
                          styles.itemOptionText,
                          isSelected && styles.itemOptionTextSelected,
                        ]}
                      >
                        {op}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}


          {items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIndex}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <TouchableOpacity onPress={() => !item.isExisting && removeCard(index)}>
                  <Image source={RemoveIcon} style={{ height: 18, width: 18 }} />
                </TouchableOpacity>
              </View>

              <Text style={styles.smallLabel}>Description</Text>
              <TextInput
                style={styles.input}
                value={item.description}
                editable={item.type !== "Room rent"}
                // editable={item.type !== "Room rent" && item.type === "Others"}
                // editable={item.type === "Others"}
                // onChangeText={(txt) => updateCard(index, "description", txt)}
                onChangeText={(txt) => {
                  const cleanedText = removeEmojis(txt);
                  updateCard(index, "description", cleanedText);
                }}
                ref={(r) => (inputRefs.current[`desc-${index}`] = r)}
                onFocus={() => scrollToInput(inputRefs.current[`desc-${index}`])}
                placeholder="Enter Description"

              />

              <Text style={styles.smallLabel}>Total Amount</Text>
              <TextInput
                // style={styles.input}
                style={[
                  styles.input,
                  item.type === "Room rent" && mode === "edit" && {
                    backgroundColor: "#F3F4F6"
                  }
                ]}
                keyboardType="numeric"
                value={item.amount}
                placeholder="Enter Amount"
                editable={mode !== "edit" || item.type !== "Room rent"}
                // editable={item.type !== "Room rent"}
                // editable={item.type !== "Room rent"} 
                // onChangeText={(txt) => updateCard(index, "amount", txt)}
                onChangeText={(txt) => {
                  const cleaned = allowOnlyNumbers(txt);
                  updateCard(index, "amount", cleaned);
                }}
                ref={(r) => (inputRefs.current[`amt-${index}`] = r)}
                onFocus={() => scrollToInput(inputRefs.current[`amt-${index}`])}

              />
            </View>
          ))}


          {itemErr && (
            <ErrorMessage message={itemErr} type="error" />
          )}

          <View style={{ marginTop: 10, marginBottom: 6 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                textAlign: "right",
                color: "#111",
              }}
            >
              Total Amount: ₹ {totalAmount.toLocaleString("en-IN")}
            </Text>
          </View>


          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={validateAndSubmit}
            >
              <Text style={styles.saveText}> {mode === "edit" ? "Update Bill" : " Create Bill"}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {openInvoiceDate && (
          <View style={styles.dateOverlay}>
            <TouchableOpacity
              style={styles.outsideTouch}
              onPress={() => setOpenInvoiceDate(false)}
            />

            <View style={styles.calendarContainer}>
              <Calendar
                markingType="custom"
                markedDates={invoiceMarkedDates}
                current={
                  invoiceDate
                    ? dayjs(invoiceDate).format("YYYY-MM-DD")
                    : today.format("YYYY-MM-DD")
                }
                onDayPress={(day) => {
                  if (invoiceMarkedDates[day.dateString]?.disabled) return;

                  setInvoiceDate(dayjs(day.dateString));
                  setInvoiceDateErr("");
                  setDueDate(null); // 🔥 reset due date
                  setOpenInvoiceDate(false);
                }}
                theme={{
                  todayTextColor: "#2563EB",
                  selectedDayBackgroundColor: "#2563EB",
                  selectedDayTextColor: "#FFFFFF",
                  textDisabledColor: "#9CA3AF",
                  arrowColor: "#111827",
                }}
              />
            </View>
          </View>
        )}


        {openDueDate && (
          <View style={styles.dateOverlay}>
            <TouchableOpacity
              style={styles.outsideTouch}
              onPress={() => setOpenDueDate(false)}
            />

            <View style={styles.calendarContainer}>
              <Calendar
                markingType="custom"
                markedDates={dueMarkedDates}
                current={
                  (dueDate
                    ? dayjs(dueDate)
                    : invoiceDate
                      ? dayjs(invoiceDate)
                      : dayjs()
                  ).format("YYYY-MM-DD")
                }
                onDayPress={(day) => {
                  if (dueMarkedDates[day.dateString]?.disabled) return;

                  setDueDate(dayjs(day.dateString));
                  setDueDateErr("");
                  setOpenDueDate(false);
                }}
              />

            </View>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* <TouchableOpacity
  style={[
    styles.dateBox,
    !invoiceDate && { opacity: 0.5 },
  ]}
  disabled={!invoiceDate}
  onPress={() => setOpenDueDate(true)}
>
  <Text style={styles.inputText}>
    {dueDate
      ? dayjs(dueDate).format("DD-MM-YYYY")
      : "Select a date"}
  </Text>
  <Image source={CalendarIcon} style={{ width: 20, height: 20 }} />
</TouchableOpacity> */}

    </>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 35,
    backgroundColor: 'white'
    // marginBottom: 8,
  },

  backIcon: { width: 20, height: 20, marginRight: 12, tintColor: "#222" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111" },
  container: { padding: 20, backgroundColor: 'white', flex: 1, },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 25 },

  label: { fontSize: 15, marginBottom: 6 },

  ItemdropdownBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    justifyContent: "space-between",
    marginBottom: 12,
  },

  itemDropdownMenu: {
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  itemOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  itemOptionSelected: {
    backgroundColor: "#1D5BEE",
  },

  itemOptionText: {
    fontSize: 15,
    color: "#111",
  },

  itemOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },

  placeholder: { color: "#777" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
  },

  dateField: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  calendarIcon: { fontSize: 18, paddingLeft: 10 },

  dropdownList: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  itemCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardIndex: {
    color: "#4A63FF",
    fontWeight: "700",
    fontSize: 16,
  },
  deleteBtn: { fontSize: 22, color: "red" },
  smallLabel: { fontWeight: "600", marginTop: 10, marginBottom: 5 },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelBtn: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelText: { fontSize: 16, color: "#555" },

  createBtn: {
    backgroundColor: "#2E5BFF",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  createText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  selectWrapper: { position: "relative", width: "100%", marginTop: 8 },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 50,   // 🔥 consistent height
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", },
  selectedText: { fontSize: 15, color: "#000", flex: 1 },
  downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },
  arrowIcon: {
    width: 18,
    height: 18,
    tintColor: "#6A6A6A",
  },
  dropdownMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "17%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    zIndex: 999,
    elevation: 10,
  },
  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000" },

  inputBox: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 14,
    justifyContent: "center",
    backgroundColor: "#fff",
    fontSize: 15,
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  customerdropdownBox: {
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  customerDropdownMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  customerOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  customerOptionSelected: {
    backgroundColor: "#1D5BEE",   // SAME BLUE HIGHLIGHT
  },

  customerOptionText: {
    fontSize: 15,
    color: "#111",
  },

  customerOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },


  calendarIcon: { width: 22, height: 22, tintColor: "#676767" },

  /* Inline dropdown box (full width under field) */
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // shadow for iOS / elevation for Android
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
    }),
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  dropdownItemText: { fontSize: 15, color: "#222" },

  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
    alignItems: "center",
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

  dateBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
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
