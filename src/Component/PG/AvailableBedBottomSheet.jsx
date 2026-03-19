import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated, PanResponder, StyleSheet, Image, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFloor } from "../../Context/PayingGuestContext";
import SuccessModal from "../../ToastFile/ToastPage";
import { useHasPermission } from "../../Utils/useHasPermission";



export default function ManageBedBottomSheet({ visible, onClose, selectedBed, handleEditBed,onDeleteBed,onBedAdded }) {
  console.log("selectedBed", selectedBed)
  const { getAllFloorsByHostel,getAllRoomsByFloor,getAllBedsByRoom,deleteBed } = useFloor();
  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(300)).current;
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [modalType, setModalType] = useState("success");
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
  const handleEdit = () => {
    handleEditBed(selectedBed);
  }

  const handleDelete = () => {
    setShowDeletePopup(true)

  }


  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
    onPanResponderMove: (_, g) => g.dy > 0 && translateY.setValue(g.dy),
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) onClose();
      else Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
    },
  });
  const handleConfirmDelete = async () => {
  if (!selectedBed?.bedId) return;

  const res = await deleteBed(selectedBed.bedId);

  if (res?.success) {
     setModalType("success");
      setMessage("Bed Deleted successfully");
      setShowSuccess(true);
onBedAdded && onBedAdded(selectedBed.roomId)
      setTimeout(() => {
        setShowSuccess(false);
        setShowDeletePopup(false);
    onClose();
      }, 800);
   
  } else {
    // alert(res?.message || "Delete failed");
      setModalType("error");
      setMessage(res?.message);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
       
      }, 800);
  }
};

    const {
    canWriteModule: canWritePayingGuests,
    canReadModule: canReadPayingGuests,
    canUpdateModule: canUpdatePayingGuests,
    canDeleteModule: canDeletePayingGuests,
  } = useHasPermission("Paying Guests");


    const {
    canWriteModule: canWriteCustomers,
    //   canReadModule: canReadExpense,
    // canUpdateModule: canUpdateCustomers,
    //   canDeleteModule: canDeleteExpense,
  } = useHasPermission("Customers");


  if (!visible) return null;

  return (
    <>
      <SuccessModal visible={showSuccess} message={message} type={modalType} />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>Manage Bed</Text>


          <TouchableOpacity 
          disabled={!canWriteCustomers}
          style={[ styles.optionRow, !canWriteCustomers && { opacity: 0.4 }]}
          onPress={() => {
            navigation.navigate("AddTenant");
            onClose();
          }}
          >
            <Text style={styles.optionText}>Add Tenant</Text>
            <Image source={require("../../Assets/Images/addsquare.png")} style={styles.icon} />
          </TouchableOpacity>


          <TouchableOpacity
          //  style={styles.optionRow} 
          disabled={!canWriteCustomers}
          style={[ styles.optionRow, !canWriteCustomers && { opacity: 0.4 }]}
           onPress={() => {
            onClose();
            navigation.navigate("AssignTenant", {
              roomNo: "101",
              bedId: "A",
              selectedBed,
              onBedAdded
              
            });
          }}>
            <Text style={styles.optionText}>Assign Tenant</Text>
            <Image source={require("../../Assets/Images/Reports.png")} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity 
          // style={styles.deleteRow}
          disabled={!canUpdatePayingGuests}
          style={[ styles.deleteRow, !canUpdatePayingGuests && { opacity: 0.4 }]}
            onPress={handleEdit} >
            <Text style={styles.optionText}>Edit</Text>
            <Image source={require("../../Assets/Images/editIcon.png")} style={styles.deleteIcon} />
          </TouchableOpacity>
          <TouchableOpacity 
            disabled={!canDeletePayingGuests}
          style={[ styles.deleteRow, !canDeletePayingGuests && { opacity: 0.4 }]}
          onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
            <Image source={require("../../Assets/Images/trash.png")} style={styles.deleteIcon} />
          </TouchableOpacity>

        </Animated.View>
      </View>
      {showDeletePopup && (
        <TouchableWithoutFeedback onPress={() => setShowDeletePopup(false)}>
          <View style={styles.popupOverlay}>

            {/* STOP PROPAGATION so inside box won’t close */}
            <TouchableWithoutFeedback>
              <View style={styles.popupBox}>

                <Text style={styles.popupTitle}>Delete Bed?</Text>
                <Text style={styles.popupSubtitle}>
                  Are you sure you want to delete this Bed?
                </Text>

                <View style={styles.popupBtnRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setShowDeletePopup(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
               onPress={handleConfirmDelete}

                  >
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>
      )}

    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
   
  },
  overlayTouch: { flex: 1 },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 50,
  },
  handle: {
    width: 60, height: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 3,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Gilroy-Regular" 
  },
  deleteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    marginTop: 10,
  },
  deleteText: {
    fontSize: 16,
    color: "red",
  },
  deleteButton: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  icon: { width: 22, height: 22, tintColor: "#1E45E1" },
  deleteIcon: { width: 22, height: 22 },


  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },


  popupBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 25,
    paddingHorizontal: 20,
    elevation: 10
  },

  popupTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8
  },

  popupSubtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
    fontFamily: "Gilroy-Bold" 
  },

  popupBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#1E45E1",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },

  cancelText: {
    color: "#1E45E1",
    fontSize: 16,
    fontWeight: "600"
  },

  deleteBtn: {
    width: "48%",
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },


});
