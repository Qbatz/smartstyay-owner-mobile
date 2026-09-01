import React, { useEffect, useRef, useState , useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  BackHandler,
} from "react-native";
import { ComplaintContext } from "../../Context/ComplaintContext";
import { CommonContexts } from "../../Context/CommonContext";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../ToastFile/ToastPage";

import DownArrow from "../../Assets/Images/direction-down.png";
import CloseIcon from "../../Assets/Images/remove.png";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ChangeStatus({
  visible,
  onClose,
  complaint,
  onStatusUpdate,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);


  const { changeComplaintStatus } = useContext(ComplaintContext);
  const { activeHostelId } = useContext(CommonContexts);

   const [showSuccessModal, setShowSuccessModal] = useState(false);
   const [modalMessage, setModalMessage] = useState("");
   const [modalType, setModalType] = useState("success");

 const STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "Resolved", value: "RESOLVED" },
];



const [selectedStatus, setSelectedStatus] = useState(null);
const [statusError, setStatusError] = useState("");

const normalizeStatus = (status) => {
  if (!status) return null;

  return status.toString().toUpperCase();
};


useEffect(() => {
  if (!visible || !complaint) return;

  const normalized = normalizeStatus(complaint.status);

  const match = STATUS_OPTIONS.find(
    (s) => s.value === normalized
  );

  console.log("RAW STATUS:", complaint.status);
  console.log("NORMALIZED:", normalized);
  console.log("MATCHED:", match);

  setSelectedStatus(match || null);
  setStatusError("");
}, [visible, complaint?.status]);





const handleStatusUpdate = async () => {
  const prevStatus = complaint?.status;

  if (!selectedStatus) {
    setStatusError("Please Select Status");
    return;
  }

  if (selectedStatus.value === prevStatus) {
    setStatusError("No Changes Detected");
    return;
  }

  setStatusError("");

  const res = await changeComplaintStatus({
    complaintId: complaint.complaintId,
    status: selectedStatus.value,
    hostelId: activeHostelId,
  });

  if (res.success) {
      setModalType("success");
      setModalMessage(res.data || "Status Updated successfully");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
         onClose();
      }, 800);
  } else {
    setStatusError(res?.message || "something went wrong");
  }
};





  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) handleClose();
        else openSheet();
      },
    })
  ).current;

  const openSheet = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  useEffect(() => {
    if (visible) {
      openSheet();

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          handleClose();
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [visible]);

  const isSelected = (item) => {
  return selectedStatus?.value === item.value;
};


  if (!visible) return null;



  return (
    <>
           <SuccessModal
           visible={showSuccessModal}
           onClose={() => setShowSuccessModal(false)}
           message={modalMessage}
           type={modalType}
          />

      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      />

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.headerLine} />

        <View style={styles.header}>
          <Text style={styles.title}>Change Status</Text>

          <TouchableOpacity onPress={handleClose}>
            <Image source={CloseIcon} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

      <Text style={styles.selectedText}>
    Change Status <Text style={{ color: "red" }}>*</Text>
  </Text>
        {/* SELECT BOX */}
        <View style={{ zIndex: 50 }}>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
           <Text style={styles.label}>
  {selectedStatus?.label || "Select Status"}
</Text>

            <Image source={DownArrow} style={styles.downArrow} />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
   {STATUS_OPTIONS.map((item) => {
  const active = isSelected(item);

  return (
    <TouchableOpacity
      key={item.value}
      style={[
        styles.option,
        active && styles.optionActive, // ✅ blue bg
      ]}
      onPress={() => {
        setSelectedStatus(item);
        setDropdownVisible(false);
        setStatusError("");
      }}
    >
      <Text
        style={[
          styles.optionText,
          active && styles.optionTextActive, // ✅ white text
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
})}



              </ScrollView>
            </View>
          )}
        </View>

{statusError ? (
  <ErrorMessage message={statusError} type="error" />
) : null}
        <View style={styles.footerBtnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.cancelBtn]}
            
              onPress={handleClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.updateBtn]}
            onPress={handleStatusUpdate}
          >
            <Text style={styles.updateText}>Change Status</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  headerLine: {
    width: 60,
    height: 5,
    backgroundColor: "#D5D5D5",
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
  },

  title: { fontSize: 18,   fontFamily: "Gilroy-Bold", color: "#000" },
  closeIcon: { width: 18, height: 18 },

  label: { fontSize: 14, color: "#666", marginBottom: 10 , fontFamily: "Gilroy-Semibold"  },

  selectBox: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  selectedText: { fontSize: 15, color: "#000",  fontFamily: "Gilroy-Semibold" },
  downArrow: { width: 18, height: 18, tintColor: "#6F6F6F" },

  dropdownMenu: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    elevation: 10,
    zIndex: 999,
    maxHeight: 140,
    overflow: "hidden",
  },

  option: { paddingVertical: 10, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#000",  fontFamily: "Gilroy-Regular"  },

  footerBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },

  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelBtn: {
    backgroundColor: "#F0F0F0",
    marginRight: 10,
  },

  updateBtn: {
    backgroundColor: "#1D5DFF",
  },

  cancelText: { fontSize: 16, fontFamily: "Gilroy-Medium", color: "#333" },
  updateText: { fontSize: 16,fontFamily: "Gilroy-Semibold", color: "#fff" },
  optionActive: {
  backgroundColor: "#1D5DFF",
},

optionTextActive: {
  color: "#fff",
  fontFamily: "Gilroy-Semibold"
},
option: {
  paddingVertical: 10,
  paddingHorizontal: 14,
},

});
