import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView, BackHandler, Modal, Pressable,
} from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import { Calendar } from "react-native-calendars";
import SampleAvatar from "../../../Assets/Images/Avatar.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";
import BedIcon from "../../../Assets/Images/Bed_Icon.png";
import DatePicker from "react-native-ui-datepicker";
import DownArrow from "../../../Assets/Images/direction-down.png";
import dayjs from "dayjs";
import { useFocusEffect } from '@react-navigation/native';
import { useCustomer } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import InputComponent from "../../MorePages/InputComponent"
import DropdownComponent from "../../MorePages/DropdownComponent";
import DatePickerComponent from "../../MorePages/DatePickerComponent";

export default function CancelNotice({ navigation, route }) {
  const { selectedItem, selectedBed } = route.params || {};
  const { activeHostelId } = useContext(CommonContexts);
  const { cancelCheckout, initializeCancelCheckout, getCustomerDetails } = useCustomer();
  const [openDate, setOpenDate] = useState(false);
  const [checkInDate, setCheckInDate] = useState();
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [reCheckinSameBed, setReCheckinSameBed] = useState("")
  const bedData = selectedBed || selectedItem;
  const data = selectedItem || selectedBed;
  const [customerDetails, setCustomerDetails] = useState("")
  const [checkInDateError, setcheckInDateError] = useState("")
  const [reasonError, setReasonError] = useState("")

  const [stayType, setStayType] = useState("Long stay");

  const stayTypeOptions = [
    { label: "Long stay", value: "Long stay" },
    { label: "Short stay", value: "Short stay" },
  ];

  const bedId =
    data?.bedId;

  const tenantId =
    data?.customerId ||
    data?.currentTenantInfo?.[0]?.tenetId;

  useEffect(() => {
    if (tenantId) {
      fetchCustomerDetails();
    }
  }, [tenantId]);

  const fetchCustomerDetails = async () => {
    const res = await getCustomerDetails(tenantId);
    console.log("fetchCustomerDetails", res)
    if (res.success) {
      setCustomerDetails(res.data)

    } else {
      alert(res.message);
    }
  };
  console.log("customerDetails", customerDetails)
  console.log("selectedItem", selectedItem)
  console.log("selectedBed", selectedBed)
  useFocusEffect(
    useCallback(() => {
      if (activeHostelId && tenantId) {
        initCancel();
      }
    }, [activeHostelId, tenantId])
  );

  const initCancel = async () => {
    const res = await initializeCancelCheckout(activeHostelId, tenantId);

    if (res?.success) {
      console.log("INIT CANCEL CHECKOUT DATA ✅", res.data);
      setReCheckinSameBed(res.data)
      setcheckInDateError("")
      // Example: set default date
      // setCheckInDate(dayjs(res.data?.reCheckInDate, "DD-MM-YYYY").toDate());
      // setReason(res.data?.reason || "");
    } else {
      setModalType("warning");
      setMessage(res?.message)
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1200);
      // alert(res?.message);
    }
  };
  const canCheckin = reCheckinSameBed?.canRecheckinSameBed === true;

  const requestedLeavingDate =
    customerDetails?.checkoutInfo?.noticeDate;

  const minSelectableDate = requestedLeavingDate
    ? dayjs(requestedLeavingDate, "DD/MM/YYYY").format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");

  const maxSelectableDate = dayjs().format("YYYY-MM-DD"); // ✅ future disable

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {


        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }

        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [navigation])
  );



  const handleCancelNotice = async () => {
    setcheckInDateError("")
    setReasonError("")

    let hasError = false;
    const data = selectedItem || selectedBed;

    const bedId = data?.bedId || data?.hostelInfo?.bedId
    const tenantId =
      data?.customerId ||
      data?.currentTenantInfo?.[0]?.tenetId;


    console.log("bedid", bedId)
    console.log("tenantId", tenantId);


    if (!activeHostelId || !bedId || !tenantId) {
      return;
    }

    if (!checkInDate) {
      setcheckInDateError("Please Select Re Check-in Date");
      hasError = true;
    }
    if (!reason) {
      setReasonError("Please enter a reason");
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      bedId: bedId,
      reCheckInDate: dayjs(checkInDate).format("DD-MM-YYYY"),
      reason: reason || "Cancelled from app",
    };

    console.log("CANCEL NOTICE PAYLOAD", payload);



    const res = await cancelCheckout(
      activeHostelId,
      tenantId,
      payload
    );

    if (res?.success) {

      setModalType("success");
      setMessage(res.data);
      setShowSuccess(true);
      setcheckInDateError("")

      const data = await getCustomerDetails(tenantId)
      console.log("data", data);


      setTimeout(() => {
        navigation.goBack()
        setShowSuccess(false)
      }, 800);

    }
    else {
      setModalType("warning");
      setMessage(res?.message || "Cancel notice failed");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 1200);
    }
  };




  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 30 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Cancel Check-out</Text>
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >

          {/* Tenant Details */}
          <View style={styles.tenantRow}>
            {console.log("kaja", selectedItem)}

            {selectedItem?.profilePic || selectedBed?.currentTenantInfo[0]?.profilePic ?
              <Image source={{ uri: selectedItem?.profilePic || selectedBed?.currentTenantInfo[0]?.profilePic }} style={styles.avatar} />
              :
              <View style={[styles.avatar, { alignItems: 'center', backgroundColor: "#E5E7EB", justifyContent: 'center' }]}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#374151" }}>
                  {selectedItem?.initials || selectedBed?.currentTenantInfo[0]?.tenantInitials}
                </Text>
              </View>}
            {/* <Image source={SampleAvatar} style={styles.avatar} /> */}

            <View style={{ marginLeft: 14, marginRight: 50 }}>
              <Text style={styles.tenantName}>{selectedItem?.fullName || selectedBed?.currentTenantInfo[0]?.tenantFullName}</Text>

              <View style={styles.smallRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{selectedItem?.floorName || selectedBed?.floorName || selectedItem?.hostelInfo?.floorName}</Text>
                </View>

                <Image source={RoomIcon} style={styles.smallIcon} />
                <Text style={styles.badgeLabel}>{selectedItem?.roomName || selectedBed?.roomName || selectedItem?.hostelInfo?.roomName}</Text>

                <Image source={BedIcon} style={styles.smallIcon} />
                <Text style={styles.badgeLabel}>{selectedItem?.bedName || selectedBed?.bedName || selectedItem?.hostelInfo?.bedName}</Text>
              </View>
            </View>
          </View>


          <DropdownComponent
            label="Stay Type"
            options={stayTypeOptions}
            value={stayType}
            placeholder="Select Stay Type"
            onChange={(value) => setStayType(value)}
             disabled={true}
          />

          <DatePickerComponent
            label="Re Check-In Date"
            required
            selectedDate={
              checkInDate
                ? dayjs(checkInDate).format("YYYY-MM-DD")
                : null
            }
            onSelect={(date) => {
              setCheckInDate(date);
              setcheckInDateError("");
            }}
            minDate={minSelectableDate}
            maxDate={maxSelectableDate}
            placeholder="DD/MM/YYYY"
            displayFormat="DD/MM/YYYY"
            error={checkInDateError}
          />

          {/* {checkInDateError && <ErrorMessage message={checkInDateError} type="error" />} */}


          {/* Reason */}
          <InputComponent
            label="Reason (Comments)"
            type="description"
            required
            value={reason}
            onChangeText={(text) => {
              const filtered = text.replace(/[^a-zA-Z0-9 ]/g, "");

              setReason(filtered);

              if (filtered.trim()) {
                setReasonError("");
              }
            }}
            placeholder="Add reason..."
            multiline
            inputHeight={150}
            error={reasonError}
          />
        </ScrollView>

        {/* {openDate && (
        <View style={styles.dropdownBox}>
          <DatePicker
            mode="single"
            date={checkInDate}
            onChange={(v) => {
              setCheckInDate(v.date || new Date());
              setOpenDate(false);
            }}
          />
        </View>
      )} */}


        {/* {openDate && (
          <View style={styles.dropdownBox}>
            <Calendar
              current={dayjs(checkInDate).format("YYYY-MM-DD")}
              minDate={minSelectableDate}
              maxDate={maxSelectableDate}
              onDayPress={(day) => {
                setCheckInDate(new Date(day.dateString));
                setOpenDate(false);
              }}
              markedDates={{
                [dayjs(checkInDate).format("YYYY-MM-DD")]: {
                  selected: true,
                  selectedColor: "#2B6CF6",
                },
              }}
              theme={{
                todayTextColor: "#2B6CF6",
                arrowColor: "#2B6CF6",
              }}
            />
          </View>
        )} */}

        <Modal
          visible={openDate}
          transparent
          animationType="fade"
          onRequestClose={() => setOpenDate(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setOpenDate(false)}
          >
            <Pressable
              style={styles.dropdownBox}
              onPress={(e) => e.stopPropagation()}
            >
              <Calendar
                current={
                  checkInDate
                    ? dayjs(checkInDate).format("YYYY-MM-DD")
                    : dayjs().format("YYYY-MM-DD")
                }
                minDate={minSelectableDate}
                maxDate={maxSelectableDate}
                onDayPress={(day) => {
                  setCheckInDate(new Date(day.dateString));
                  setOpenDate(false);
                  setcheckInDateError("")
                }}
                markedDates={{
                  [dayjs(checkInDate).format("YYYY-MM-DD")]: {
                    selected: true,
                    selectedColor: "#2B6CF6",
                  },
                }}
                theme={{
                  todayTextColor: "#2B6CF6",
                  arrowColor: "#2B6CF6",
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>


        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={[styles.addBtn2, !canCheckin && styles.disabledBtn]}
            onPress={handleCancelNotice}
            disabled={!canCheckin}
          >
            <Text style={[styles.addBtnText, !canCheckin && styles.disabledText]}>
              Check-In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20
  },
  backIcon: { width: 20, height: 20, tintColor: "#222", marginRight: 12 },
  headerText: { fontSize: 18, fontWeight: "700", color: "#000" },

  tenantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 35,
  },
  tenantName: { fontSize: 18, fontWeight: "700", color: "#111" },

  badgeRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  badge: {
    backgroundColor: "#FBE9C7",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  badgeText: { fontSize: 12, color: "#8F6B00" },
  roomText: { fontSize: 14, marginRight: 10, color: "#222" },
  bedText: { fontSize: 14, color: "#222" },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 16,
  },

  inputBox: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: { fontSize: 15, color: "#111" },
  calendarIcon: { width: 22, height: 22, tintColor: "#676767" },

  dropdownBox: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 16,
    padding: 10,
    alignSelf: "center",
    elevation: 6,
    marginBottom: 120
  },

  textarea: {
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fff",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,

  },

  cancelBtn: {
    fontSize: 16,
    color: "#666",
  },

  checkBtn: {
    backgroundColor: "#2B6CF6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  checkBtnText: { fontSize: 16, color: "#fff", fontWeight: "700" },
  smallRow: { flexDirection: "row", alignItems: "center" },
  badge: { backgroundColor: "#FFEFCF", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 8 },
  badgeText: { color: "black", fontSize: 12 },
  smallIcon: { width: 16, height: 16, marginHorizontal: 4 },
  badgeLabel: { fontSize: 13 },

  btnRow: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: 45,
    paddingHorizontal: 12,
  },

  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },

  cancelText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
  },

  addBtn2: {
    backgroundColor: "#2B6CF6",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  addBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  dropBox: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F5F7FF",  // screenshot mathiri light blue
    borderWidth: 1,
    borderColor: "#E6E9F5",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },

  dropText: {
    fontSize: 15,
    color: "#000",
  },

  dropIcon: {
    width: 16,
    height: 16,
    tintColor: "#555",
  },
  disabledBtn: {
    backgroundColor: "#CBD5E1", // grey
  },
  disabledText: {
    color: "#6B7280",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  dropdownBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    elevation: 6,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

});
