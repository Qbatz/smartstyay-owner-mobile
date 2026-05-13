import React, { useState, useEffect , useContext , useRef  , useCallback} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  BackHandler,Modal , TouchableWithoutFeedback , Animated , Keyboard
} from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";

import { useNavigation, useRoute , useFocusEffect } from "@react-navigation/native";
import { CommonContexts } from "../../Context/CommonContext";
import { ComplaintContext } from "../../Context/ComplaintContext";
import { CustomerContext } from "../../Context/CustomerContext";

import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../ToastFile/ToastPage";
import { Calendar } from "react-native-calendars";

import CalendarIcon from "../../Assets/Images/calendar.png";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

const ITEM_HEIGHT = 14;
const MIN_ITEMS = 3;
const MAX_ITEMS = 6;


export default function AddComplaint() {

  const { AddComplaint , loading , fetchComplaintTypes ,complaintTypes , EditComplaint} = useContext(ComplaintContext);

   const { activeHostelId } = useContext(CommonContexts);

   const { getCustomersByHostel} = useContext(CustomerContext)

   console.log("complainttype", complaintTypes);


  const navigation = useNavigation();
  const route = useRoute();
  const { mode, data } = route.params || {};

      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modalMessage, setModalMessage] = useState("");
      const [modalType, setModalType] = useState("success");

      const [selectedCustomer, setSelectedCustomer] = useState(null);
      
    const [CustomerOptions , setCustomerOptions] = useState([])





    



  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [openDate, setOpenDate] = useState(false);
const [complaintDate, setComplaintDate] = useState(null);

    const [openComplaintDatePic, setComplaintDatePic] = useState(false);
    const [userErrmsg, setUserErrmsg] = useState("");
const [complaintTypeErrmsg, setComplaintTypeErrmsg] = useState("");
const [dateErrmsg, setDateErrmsg] = useState("");
const [totalErrmsg, setTotalErrmsg] = useState("");

const [ctypeOpen, setCtypeOpen] = useState(false);
const [selectedComplaintType, setSelectedComplaintType] = useState(null);
const [initialEditState, setInitialEditState] = useState(null);

  const [customerOpen, setCustomerOpen] = useState(false);
  const [customer, setCustomer] = useState(null);

  const [complaintType, setComplaintType] = useState(null);

  const [description, setDescription] = useState("");
  const [isDescFocused, setIsDescFocused] = useState(false);

  const scrollRef = useRef(null);
  const descriptionRef = useRef(null);

  const isSubmittingRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    () => {}
  );
};


    const blockedStatus = [
  "Vacated",
  "Booked",
  "Inactive",
  "Settlement Generated",
];

 const sheetY = useRef(new Animated.Value(0)).current;


    // useEffect(() => {
    //   const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
    //     Animated.timing(sheetY, {
    //       toValue: -e.endCoordinates.height + 20,
    //       duration: 180,
    //       useNativeDriver: true,
    //     }).start();
    //   });
  
    //   const hideSub = Keyboard.addListener("keyboardDidHide", () => {
    //     Animated.timing(sheetY, {
    //       toValue: 0,
    //       duration: 180,
    //       useNativeDriver: true,
    //     }).start();
    //   });
  
    //   return () => {
    //     showSub.remove();
    //     hideSub.remove();
    //   };
    // }, []);

  const closeAll = () => {
    setCustomerOpen(false);
    setCtypeOpen(false);
  };

  // useEffect(() => {
  //   if (mode === "edit" && data) {
  //     setCustomer(data.customer);
  //     setComplaintType(data.complaintType);
  //     setDescription(data.description);
  //     setDate(new Date(data.date));
  //   }
  // }, [mode, data]);


 useEffect(() => {
  if (mode === "edit" && data) {

    const formattedDate = data.complaintDate
      ? dayjs(data.complaintDate, "DD/MM/YYYY").format("YYYY-MM-DD")
      : null;

    // CUSTOMER
    setSelectedCustomer({
      customerId: data.customerId,
      fullName: data.customerName,
      floorId: data.floorId,
      floorName: data.floorName,
      roomId: data.roomId,
      roomName: data.roomName,
      bedId: data.bedId,
      bedName: data.bedName,
      actualJoining: data.complaintDate,
    });

    // COMPLAINT TYPE
    const matchedType = complaintTypes?.find(
      (t) => t.raw.complaintTypeId === data.complaintTypeId
    );
    setSelectedComplaintType(matchedType || null);

    // DATE + DESC
    setComplaintDate(formattedDate);
    setDescription(data.description || "");

    // ✅ INITIAL STATE (VERY IMPORTANT)
    setInitialEditState({
      complaintDate: formattedDate,
      description: data.description || "",
    });
  }
}, [mode, data, complaintTypes]);


const hasEditChanges = () => {
  if (!initialEditState) return false;

  const currentDate = complaintDate || "";
  const currentDesc = description?.trim() || "";

  const initialDate = initialEditState.complaintDate || "";
  const initialDesc = initialEditState.description?.trim() || "";

  return currentDate !== initialDate || currentDesc !== initialDesc;
};


const handleDateChange = (dateString) => {
  setComplaintDate(dateString);
  setDateErrmsg("");

  if (totalErrmsg) setTotalErrmsg("");
};


const handleDescriptionChange = (text) => {
  setDescription(text);

  if (totalErrmsg) setTotalErrmsg("");
};



   useFocusEffect(
      useCallback(() => {
        if (activeHostelId) {
          fetchCustomers();
        }
      }, [activeHostelId])
    );
  

// const fetchCustomers = async () => {
//   const data = await getCustomersByHostel(activeHostelId);

//   const filtered = Array.isArray(data?.listCustomers)
//     ? data?.filter(
//         (u) =>
//           u.floorId &&
//           u.roomId &&
//           !blockedStatus.includes(u.currentStatus)
//       )
//     : [];

//   setCustomerOptions(filtered);
// }

const fetchCustomers = async () => {
  const res = await getCustomersByHostel(activeHostelId);

  const list = Array.isArray(res?.listCustomers)
    ? res.listCustomers
    : [];

  const filtered = list.filter(
    (u) =>
      u.floorId &&
      u.roomId &&
      !blockedStatus.includes(u.currentStatus)
  );

  setCustomerOptions(filtered);
};


    useEffect(()=> {
    if(activeHostelId){
      fetchComplaintTypes(activeHostelId)
    }
  },[activeHostelId])

     console.log("CustomerOptions", CustomerOptions);

  useEffect(() => {
    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
    return () => back.remove();
  }, []);





  const handleSubmit = () => {
    console.log("Submitted");
    navigation.goBack();
  };

    const today = dayjs();
  
      const isDisabledReadingDate = (d) => {
    if (!d) return false;
  
    if (d.isAfter(today, "day")) return true;
  
    return false;
  };
  
  
     const readingMarkedDates = {};
  
  for (let i = -180; i <= 180; i++) {
    const d = dayjs().add(i, "day");
    const key = d.format("YYYY-MM-DD");
  
    if (isDisabledReadingDate(d)) {
      readingMarkedDates[key] = {
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

 const isDateDisabled = (dateString) => {
  const current = dayjs(dateString, "YYYY-MM-DD");

  if (!selectedCustomer) return true;

  if (current.isAfter(dayjs(), "day")) return true;

  if (selectedCustomer.actualJoining) {
    const joining = dayjs(
      selectedCustomer.actualJoining,
      "DD/MM/YYYY"
    );
    if (current.isBefore(joining, "day")) return true;
  }

  return false;
};


const markedDates = {};

for (let i = -365; i <= 365; i++) {
  const d = dayjs().add(i, "day");
  const key = d.format("YYYY-MM-DD");

  if (isDateDisabled(key)) {
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


  const onSelectCustomer = (item) => {
  setCustomer(item.customerName);
  setSelectedCustomer(item); 
  setUserErrmsg("");
};




  


const handleSubmitComplaint = async () => {

  if(isSubmittingRef.current) return;
  isSubmittingRef.current = true;
  setIsSubmitting(true)

  setUserErrmsg("");
  setComplaintTypeErrmsg("");
  setDateErrmsg("");
  setTotalErrmsg("");

  // ---------------- EDIT MODE ----------------
  if (mode === "edit") {

    // ❌ NO CHANGES
    if (!hasEditChanges()) {
      setTotalErrmsg("No changes detected");
      return;
    }

    // ❌ DATE REQUIRED
    if (!complaintDate) {
      setDateErrmsg("Please select complaint date");
      return;
    }

    const updatePayload = {
      complaintId: data.complaintId,
      complaintDate: dayjs(complaintDate).format("DD/MM/YYYY"),
      description: description || "",
      hostelId: activeHostelId,
    };

    try{
    const res = await EditComplaint(updatePayload);

    if (res.success) {
      setModalType("success");
      setModalMessage(res.message || "Complaint updated successfully");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.goBack();
      }, 800);
    } else {
      setTotalErrmsg(res.message || "Something went wrong");
    }
    }catch(error){
      console.log(error)
    }finally{
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }

    return;
  }

  // ---------------- ADD MODE ----------------
  let isValid = true;

  if (!selectedCustomer) {
    setUserErrmsg("Please select customer");
    isValid = false;
  }

  if (!selectedComplaintType) {
    setComplaintTypeErrmsg("Please select complaint type");
    isValid = false;
  }

  if (!complaintDate) {
    setDateErrmsg("Please select complaint date");
    isValid = false;
  }

  if (!isValid) return;

  const payload = {
    customerId: selectedCustomer.customerId,
    complaintTypeId: selectedComplaintType.raw.complaintTypeId,
    floorId: selectedCustomer.floorId,
    roomId: selectedCustomer.roomId,
    bedId: selectedCustomer.bedId,
    complaintDate: dayjs(complaintDate).format("DD/MM/YYYY"),
    description: description || "",
    hostelId: activeHostelId,
  };

  try{
  const res = await AddComplaint(payload);

  if (res.success) {
    setModalType("success");
    setModalMessage(res.message || "Complaint added successfully");
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.goBack();
    }, 800);
  } else {
    setTotalErrmsg(res.message);
  }
  }catch(error){
    console.log(error)
  }finally{
    isSubmittingRef.current = false;
      setIsSubmitting(false);
  }
};





  const renderDropdown = (label, selected, open, setOpen, list, onSelect) => (
    <>
      <View style={{ flexDirection: "row", marginTop: 18 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={{ color: "red" }}>*</Text>
      </View>

      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => {
          closeAll();
          setOpen(!open);
        }}
      >
        <Text style={styles.selectedText}>
          {selected || `Select ${label}`}
        </Text>
        <Text style={styles.arrow}>⌄</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownMenu}>
          <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
            {list.map((item, index) => {
              const isSelected = item === selected;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownOption,
                    isSelected && styles.dropdownOptionSelected,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
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
    </>
  );

  return (

    <>
    {loading && <Loader/>}
        <SuccessModal
  visible={showSuccessModal}
  onClose={() => setShowSuccessModal(false)}
  message={modalMessage}
  type={modalType}
/>
   
    {/* <KeyboardAvoidingView
     style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={0}
     > */}
       <View style={{ flex: 1 }}>
  
  {/* HEADER - FIXED */}
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image source={ArrowLeft} style={styles.backIcon} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>
      {mode === "edit" ? "Edit Complaint" : "Add Complaint"}
    </Text>
  </View>

      <ScrollView
  style={{ flex: 1 }}
          scrollEnabled={!customerOpen && !ctypeOpen} 
            ref={scrollRef}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="on-drag"
  contentContainerStyle={{ paddingBottom: 180 , paddingRight:15 , padding:20}}
      >
   


{/* {customerOpen && (
  <View style={styles.dropdownMenu}>
    <ScrollView nestedScrollEnabled>
     {CustomerOptions.map((item) => {
  const isSelected =
    selectedCustomer?.customerId === item.customerId;

  return (
    <TouchableOpacity
      key={item.customerId}
      style={[
        styles.dropdownOption,
        isSelected && styles.dropdownOptionSelected,
      ]}
      onPress={() => {
        setSelectedCustomer(item);
        setCustomerOpen(false);
        setUserErrmsg("");
      }}
    >
      <Text
        style={[
          styles.optionText,
          isSelected && styles.optionTextSelected,
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
    Tenant <Text style={{ color: "red" }}>*</Text>
  </Text>

  <TouchableOpacity
    style={styles.selectBox}
    disabled={mode === "edit"}
    onPress={() => {
      setCustomerOpen(!customerOpen);
      setCtypeOpen(false);
    }}
  >
    <Text style={styles.selectedText}>
      {selectedCustomer?.fullName || "Select Tenant"}
    </Text>
    <Text style={styles.arrow}>⌄</Text>
  </TouchableOpacity>

  {customerOpen && (
    <View
      style={[
        styles.dropdownMenu,
       
      ]}
    >
      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
        {CustomerOptions.length > 0 ? (
          CustomerOptions.map((item) => (
            <TouchableOpacity
              key={item.customerId}
              style={[
                styles.dropdownOption,
                selectedCustomer?.customerId === item.customerId &&
                  styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                setSelectedCustomer(item);
                setCustomerOpen(false);
                setUserErrmsg("");
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedCustomer?.customerId === item.customerId &&
                    styles.optionTextSelected,
                ]}
              >
                {item.fullName}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No customer available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )}




{userErrmsg && <ErrorMessage message={userErrmsg} type="error" />}



      

  <Text style={styles.label}>
    Complaint Type <Text style={{ color: "red" }}>*</Text>
  </Text>

  <TouchableOpacity
    style={styles.selectBox}
    disabled={mode === "edit"}
    onPress={() => {
      setCtypeOpen(!ctypeOpen);
      setCustomerOpen(false);
    }}
  >
    <Text style={styles.selectedText}>
      {selectedComplaintType?.raw?.complaintTypeName ||
        "Select Complaint Type"}
    </Text>
    <Text style={styles.arrow}>⌄</Text>
  </TouchableOpacity>

  {ctypeOpen && (
    <View
      style={[
        styles.dropdownMenu,

      ]}
    >
      <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
        {complaintTypes.length > 0 ? (
          complaintTypes.map((item) => (
            <TouchableOpacity
              key={item.raw.complaintTypeId}
              style={[
                styles.dropdownOption,
                selectedComplaintType?.raw?.complaintTypeId ===
                  item.raw.complaintTypeId &&
                  styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                setSelectedComplaintType(item);
                setCtypeOpen(false);
                setComplaintTypeErrmsg("");
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedComplaintType?.raw?.complaintTypeId ===
                    item.raw.complaintTypeId &&
                    styles.optionTextSelected,
                ]}
              >
                {item.raw.complaintTypeName}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              No complaint type available
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )}


{complaintTypeErrmsg && (
  <ErrorMessage message={complaintTypeErrmsg} type="error" />
)}


<Text style={styles.label}>Floor<Text style={{ color: "red" }}> *</Text></Text>
<TextInput
  style={styles.inputBox}
  value={selectedCustomer?.floorName || ""}
  editable={false}
  placeholder=" Floor"
/>

<Text style={styles.label}>Room<Text style={{ color: "red" }}> *</Text></Text>
<TextInput
  style={styles.inputBox}
  value={selectedCustomer?.roomName || ""}
  editable={false}
  placeholder=" Room"
/>

<Text style={styles.label}>Bed<Text style={{ color: "red" }}> *</Text></Text>
<TextInput
  style={styles.inputBox}
  value={selectedCustomer?.bedName || ""}
  editable={false}
  placeholder=" Bed"
/>


 <Text style={styles.sheetLabel}>
 Complaint Date  <Text style={{ color: "red" }}>*</Text>
</Text>

<TouchableOpacity
  activeOpacity={0.8}
  onPress={() => setComplaintDatePic(true)}
>
  <View style={styles.dateInputWrapper}>
    <TextInput
      style={styles.dateInput}
      placeholder="DD-MM-YYYY"
      value={
        complaintDate
          ? dayjs(complaintDate).format("DD-MM-YYYY")
          : ""
      }
      editable={false}
      pointerEvents="none"
    />

    <Image
      source={CalendarIcon}
      style={{ width: 20, height: 20 }}
    />
  </View>
</TouchableOpacity>



{dateErrmsg && <ErrorMessage message={dateErrmsg} type="error" />}


 
 





  <Text style={styles.label}>Description</Text>
{/* 
  <TextInput
    style={styles.descriptionBox}
    placeholder="Enter Description"
    placeholderTextColor="#C3C3C3"
    multiline
    textAlignVertical="top"
    value={description}
    onChangeText={handleDescriptionChange}
  /> */}
   <View ref={descriptionRef}>
  <TextInput
  style={styles.descriptionBox}
  placeholder="Enter Description"
  placeholderTextColor="#C3C3C3"
  multiline
  textAlignVertical="top"
  value={description}
  onChangeText={handleDescriptionChange}
  onFocus={() => scrollToField(descriptionRef)}
/>
</View>
 {totalErrmsg && <ErrorMessage message={totalErrmsg} type="error" />}

  <View style={styles.footer}>
    <TouchableOpacity
      style={styles.submitBtn}
      onPress={handleSubmitComplaint}
      disabled={isSubmitting}
    >
      <Text style={styles.submitText}>
        {mode === "edit" ? "Update Complaint" : "Add Complaint"}
      </Text>
    </TouchableOpacity>
  </View>


      {/* <Text style={styles.label}>Description</Text>

<TextInput
  style={styles.descriptionBox}
  placeholder="Enter Description"
  placeholderTextColor="#C3C3C3"
  multiline
  textAlignVertical="top"
  value={description}
  onChangeText={handleDescriptionChange}
/>


        <View style={{ height: 160 }} /> */}
      </ScrollView>
    </View>

         <Modal
  transparent
  visible={openDate}
  animationType="fade"
  onRequestClose={() => setOpenDate(false)}
>
  <View style={styles.datePickerOverlay}>
    <TouchableOpacity
      style={styles.outsideTouch}
      activeOpacity={1}
      onPress={() => setOpenDate(false)}
    />

    <View style={styles.datePickerBox}>
      <TouchableWithoutFeedback>
        <View>
          <DatePicker
            mode="single"
            date={complaintDate}
            onChange={(d) => {
              setComplaintDate(d.date);
              setOpenDate(false);
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  </View>
</Modal>

{openComplaintDatePic && (
  <View style={styles.dateOverlay}>
    <TouchableWithoutFeedback onPress={() => setComplaintDatePic(false)}>
      <View style={styles.overlayBg} />
    </TouchableWithoutFeedback>

    <View style={styles.calendarContainer}>
      <Calendar
        markingType="custom"
        markedDates={markedDates}
        current={
          complaintDate
            ? dayjs(complaintDate).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD")
        }
        
        // onDayPress={(day) => {
        //   if (isDateDisabled(day.dateString)) return;

        //   setComplaintDate(day.dateString);
        //   setComplaintDatePic(false);
        //   setDateErrmsg("");
        // }}

        onDayPress={(day) => {
  if (isDateDisabled(day.dateString)) return;

  handleDateChange(day.dateString);
  setComplaintDatePic(false);
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
 
     </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 5, marginTop: Platform.OS === "ios" ?  60 : 40, marginLeft:20 },
  backIcon: { width: 22, height: 22, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },

   selectWrapper: { position: "relative", width: "100%", marginBottom: 18 },

  selectBox: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: 5
  },

  selectedText: { color: "#000", fontSize: 15 },

  downArrow: { width: 18, height: 18, tintColor: "#5E5E5E" },

  // dropdownMenu: {
  //   position: "absolute",
  //   top: 52,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: "#fff",
  //   borderWidth: 1,
  //   borderColor: "#E5E7EB",
  //   borderRadius: 10,
  //   zIndex: 999,
  // },

  option: { padding: 14 },
  optionText: { fontSize: 15, color: "#000" },




  arrow: { fontSize: 18, color: "#666" },

  // dropdownMenu: {
  //   position: "absolute",
  //   top: 54,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: "#fff",
  //   borderWidth: 1,
  //   borderRadius: 12,
  //   borderColor: "#DDDDDD",
  //   elevation: 10,
  //   zIndex: 999,
  //   overflow: "hidden",
  // },

  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  dropdownOptionSelected: {
    backgroundColor: "#1D5BEE",
  },

  optionText: { fontSize: 15, color: "#111" },

  optionTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },


  

  inputBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
    // marginBottom:10
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
    // marginBottom:10
  },

  descriptionBox: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    marginTop: 5,
  },

footer: {
  marginTop: 10,
  marginBottom: 30,
  backgroundColor: "#fff",
},


dimOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0,0,0,0.35)",
  zIndex: 8,
},

  submitBtn: {
    backgroundColor: "#1D5BEE",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
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


  dateInputWrapper: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  height: 48,
  paddingHorizontal: 12,
  marginTop: 6,
  // marginBottom:10
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

emptyBox: {
  height: ITEM_HEIGHT * MIN_ITEMS,
  justifyContent: "center",
  alignItems: "center",
},

emptyText: {
  color: "#9CA3AF",
  fontSize: 14,
},

dropdownMenu: {
  marginTop: 4,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 6,
    zIndex: 999,
},


newDropdownMenu: {
  position: "absolute",
  top: 52,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#DDDDDD",
  borderRadius: 10,
  overflow: "hidden",  
  maxHeight: 180,      
  zIndex: 9999,
  elevation: 10,
},


newOption: {
  paddingVertical: 12,
  paddingHorizontal: 14,
},

newOptionSelected: {
  backgroundColor: "#1D5BEE",  
},

newOptionText: {
  fontSize: 15,
  color: "#111",
},

newOptionTextSelected: {
  color: "#fff",
  fontWeight: "600",
},



});
