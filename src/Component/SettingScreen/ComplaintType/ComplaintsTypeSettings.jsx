import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
  Keyboard,
  Modal,
  ScrollView,
} from "react-native";

import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import EmptyComplaint from "../../../Assets/Images/Empty_complaint.png";
import Dots from "../../../Assets/Images/3dots.png";
import ComplaintIcon from "../../../Assets/Images/chat.png";
import AddIcon from "../../../Assets/Images/add-circle.png";

export default function ComplaintsSettings({ navigation }) {
  const [complaints, setComplaints] = useState([]);
  const [showSheet, setShowSheet] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [complaintText, setComplaintText] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const sheetY = useRef(new Animated.Value(700)).current;

  /* ---------------------------------------------------------
     OPEN / CLOSE BOTTOMSHEET
  --------------------------------------------------------- */
  const openSheet = (edit = false, item = null) => {
    sheetY.setValue(700);

    setIsEdit(edit);

    if (edit && item) {
      setComplaintText(item.title);
      setEditingId(item.id);
    } else {
      setComplaintText("");
      setEditingId(null);
    }

    setShowSheet(true);

    Animated.timing(sheetY, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetY, {
      toValue: 700,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setShowSheet(false);
      setComplaintText("");
      setEditingId(null);
      setIsEdit(false);
    });
  };

  /* ---------------------------------------------------------
     SWIPE HANDLER — SWIPE ONLY FROM HANDLE
  --------------------------------------------------------- */
  const sheetPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10,

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > 140) {
          closeSheet();
        } else {
          Animated.spring(sheetY, {
            toValue: 0,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  /* ---------------------------------------------------------
     KEYBOARD ANIMATION (FOLLOWS EXPENSES SHEET LOGIC)
  --------------------------------------------------------- */
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      const height = e.endCoordinates.height;

      Animated.timing(sheetY, {
        toValue: -height + 60,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(sheetY, {
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

  /* ---------------------------------------------------------
     DELETE CONFIRM
  --------------------------------------------------------- */
  const confirmDelete = () => {
    setComplaints((prev) => prev.filter((i) => i.id !== deleteId));
    setShowDeleteConfirm(false);
  };

  /* ---------------------------------------------------------
     SAVE
  --------------------------------------------------------- */
  const handleSave = () => {
    if (isEdit) {
      setComplaints((prev) =>
        prev.map((i) =>
          i.id === editingId ? { ...i, title: complaintText } : i
        )
      );
    } else {
      setComplaints((prev) => [
        ...prev,
        { id: Date.now().toString(), title: complaintText.trim() },
      ]);
    }

    closeSheet();
  };

  /* ---------------------------------------------------------
     POPUP MENU
  --------------------------------------------------------- */
  const renderPopupMenu = (item) => {
    if (showMenuId !== item.id) return null;

    return (
      <TouchableWithoutFeedback onPress={() => setShowMenuId(null)}>
        <View style={styles.popupOverlayArea}>
          <View style={styles.popupMenu}>
            <TouchableOpacity
              style={styles.popupItem}
              onPress={() => {
                setShowMenuId(null);
                openSheet(true, item);
              }}
            >
              <Image
                source={require("../../../Assets/Images/editIcon.png")}
                style={styles.popupIcon}
              />
              <Text style={styles.popupText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.popupItem}
              onPress={() => {
                setDeleteId(item.id);
                setShowMenuId(null);
                setShowDeleteConfirm(true);
              }}
            >
              <Image
                source={require("../../../Assets/Images/trash.png")}
                style={[styles.popupIcon, { tintColor: "red" }]}
              />
              <Text style={[styles.popupText, { color: "red" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  /* ---------------------------------------------------------
     LIST ITEM
  --------------------------------------------------------- */
  const renderComplaint = ({ item }) => (
    <View style={{ position: "relative" }}>
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Image source={ComplaintIcon} style={styles.icon} />
          <Text style={styles.cardText}>{item.title}</Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            setShowMenuId((prev) => (prev === item.id ? null : item.id))
          }
        >
          <Image source={Dots} style={styles.dots} />
        </TouchableOpacity>
      </View>

      {renderPopupMenu(item)}
    </View>
  );

  /* ---------------------------------------------------------
     UI
  --------------------------------------------------------- */
  return (
    <>
      {/* MAIN SCREEN */}
      <View
        style={{
          flex: 1,
          backgroundColor: showSheet ? "transparent" : "#FFFFFF",
          padding: 20,
          paddingTop: 40,
        }}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complaints</Text>
        </View>

        <TouchableWithoutFeedback onPress={() => setShowMenuId(null)}>
          <View style={{ flex: 1 }}>
            {complaints.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Image source={EmptyComplaint} style={styles.emptyImg} />
                <Text style={styles.emptyTitle}>No Complaints are there!</Text>

                <TouchableOpacity
                  style={styles.addButtonEmpty}
                  onPress={() => openSheet(false)}
                >
                  <Text style={styles.addBtnText}>+ Complaints</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={complaints}
                renderItem={renderComplaint}
                keyExtractor={(i) => i.id}
                contentContainerStyle={{ paddingBottom: 90 }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>

        {complaints.length > 0 && (
          <TouchableOpacity style={styles.addBtn} onPress={() => openSheet(false)}>
            <Image source={AddIcon} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        )}
      </View>

      {/* DELETE POPUP */}
      {showDeleteConfirm && (
        <Modal visible transparent animationType="fade">
          <View style={styles.deleteOverlay}>
            <View style={styles.deleteBox}>
              <Text style={styles.deleteTitle}>Delete Complaint Type?</Text>
              <Text style={styles.deleteSub}>
                Are you sure you want to delete this Complaint Type?
              </Text>

              <View style={styles.deleteBtnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* BOTTOM SHEET */}
      {showSheet && (
        <View style={styles.sheetOverlay} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={closeSheet}>
            <View style={styles.sheetDim} />
          </TouchableWithoutFeedback>

          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>

            {/* SWIPE ONLY FROM HANDLE */}
            <View style={styles.handleWrapper} {...sheetPan.panHandlers}>
              <View style={styles.sheetHandle} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
              <Text style={styles.sheetTitle}>
                {isEdit ? "Edit Complaint Type" : "Add Complaint Type"}
              </Text>

              <Text style={styles.inputLabel}>
                Complaint Type <Text style={{ color: "red" }}>*</Text>
              </Text>

              <TextInput
                style={styles.inputBox}
                placeholder="Enter"
                value={complaintText}
                onChangeText={setComplaintText}
              />
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.addTypeBtn,
                { opacity: complaintText.trim() ? 1 : 0.4 },
              ]}
              disabled={!complaintText.trim()}
              onPress={handleSave}
            >
              <Text style={styles.addTypeText}>
                {isEdit ? "Update Type" : "Add Type"}
              </Text>
            </TouchableOpacity>

            {/* <View style={styles.bottomMask} /> */}
          </Animated.View>
        </View>
      )}
    </>
  );
}

/* ---------------------------------------------------------
     STYLES — unchanged except swipe improvements
--------------------------------------------------------- */
const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backIcon: { width: 20, height: 20, marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: "700" },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyImg: { width: 200, height: 160, marginBottom: 10 },
  emptyTitle: { fontSize: 16, color: "#444", marginBottom: 15 },

  addButtonEmpty: {
    backgroundColor: "#1E45E1",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLeft: { flexDirection: "row", alignItems: "center" },
  icon: { width: 20, height: 20, marginRight: 12 },
  dots: { width: 24, height: 24 },
  cardText: { fontSize: 15, color: "#111", fontWeight: "600" },

  popupOverlayArea: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  popupMenu: {
    position: "absolute",
    right: 10,
    top: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    width: 160,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  popupItem: { flexDirection: "row", alignItems: "center", padding: 12 },
  popupIcon: { width: 18, height: 18, marginRight: 10 },
  popupText: { color: "#000", fontSize: 15 },

  addBtn: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#1E45E1",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteBox: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
  },

  deleteTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  deleteSub: { fontSize: 14, color: "#666", marginBottom: 20, textAlign: "center" },

  deleteBtnRow: { flexDirection: "row", width: "100%", justifyContent: "space-between" },

  cancelBtn: {
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1E45E1",
    paddingVertical: 12,
    alignItems: "center",
  },

  cancelText: { fontSize: 16, color: "#1E45E1", fontWeight: "600" },

  deleteBtn: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    alignItems: "center",
  },

  deleteBtnText: { fontSize: 16, color: "#fff", fontWeight: "600" },

  /* ----- Bottomsheet ----- */
  sheetOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
  },

  sheetDim: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },

  sheet: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
  },

  sheetHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 20,
    marginBottom: 12,
  },

  handleWrapper: {
    alignItems: "center",
    paddingVertical: 12,
  },

//   bottomMask: {
//     position: "absolute",
//     bottom: -200,
//     left: 0,
//     right: 0,
//     height: 200,
//     backgroundColor: "#fff",
//   },

  sheetTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },

  inputLabel: { fontSize: 14, fontWeight: "600", marginBottom: 6 },

  inputBox: {
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },

  addTypeBtn: {
    backgroundColor: "#1E45E1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  addTypeText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
