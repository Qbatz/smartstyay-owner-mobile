import React, { useState, useRef, useEffect, useContext } from "react";
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
  BackHandler,
} from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import EmptyComplaint from "../../../Assets/Images/Empty_complaint.png";
import Dots from "../../../Assets/Images/3dots.png";
import ComplaintIcon from "../../../Assets/Images/chat.png";
import AddIcon from "../../../Assets/Images/add-circle.png";

import { ComplaintContext } from "../../../Context/ComplaintContext";
import { CommonContexts } from "../../../Context/CommonContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import Loader from "../../../Component/Loader/Loader"

export default function ComplaintsSettings({ navigation }) {
  const { activeHostelId } = useContext(CommonContexts);

  const {

    complaintTypes,
    loading,
    fetchComplaintTypes,
    addComplaintType,
    editComplaintType,
    deleteComplaintType,
  } = useContext(ComplaintContext);

  const {
    canWriteModule: canWriteComplaints,
    canReadModule: canReadComplaints,
    canUpdateModule: canUpdateComplaints,
    canDeleteModule: canDeleteComplaints,
  } = useHasPermission("Complaints");

  const insets = useSafeAreaInsets();

  const [showSheet, setShowSheet] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [complaintText, setComplaintText] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuComplaintId, setMenuComplaintId] = useState(null);
  const [originalComplaintName, setOriginalComplaintName] = useState("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");



  const sheetY = useRef(new Animated.Value(700)).current;

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeKeyboardHeight = keyboardHeight > 0 ? 240 : 0;

  console.log("complaintTypes", complaintTypes);


  // useEffect(() => {
  //   fetchComplaintTypes(activeHostelId);
  // }, []);

  useEffect(() => {
    async function loadData() {
      if (!activeHostelId) {
        return
      }

      await fetchComplaintTypes(activeHostelId);
    }

    loadData();
  }, [activeHostelId]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (showSheet) {
          Keyboard.dismiss();
          closeSheet();
          return true;
        }

        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
          return true;
        }

        if (showMenu) {
          setShowMenu(false);
          return true;
        }

        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [showSheet, showDeleteConfirm, showMenu]);


  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
  //     navigation.goBack();
  //     return true;
  //   });
  //   return () => backHandler.remove();
  // }, []);



  const sheetPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeSheet();
        else
          Animated.spring(sheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
      },
    })
  ).current;


  // const openSheet = (edit = false, item = null) => {
  //   sheetY.setValue(700);
  //   setIsEdit(edit);

  //   if (edit && item) {
  //     setComplaintText(item.title);
  //     setEditingId(item.id);
  //   } else {
  //     setComplaintText("");
  //     setEditingId(null);
  //   }

  //   setShowSheet(true);

  //   Animated.timing(sheetY, {
  //     toValue: 0,
  //     duration: 240,
  //     useNativeDriver: true,
  //   }).start();
  // };
  const openSheet = (edit = false, item = null) => {

    if (!activeHostelId) {
      setModalType("warning");
      setModalMessage("Please add a hostel first");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1500);
      return;
    }

    sheetY.setValue(700);
    setIsEdit(edit);

    if (edit && item) {
      setComplaintText(item.title);
      setOriginalComplaintName(item.title);
      setEditingId(item.id);
    } else {
      setComplaintText("");
      setOriginalComplaintName("");
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


  // useEffect(() => {
  //   const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
  //     Animated.timing(sheetY, {
  //       toValue: -e.endCoordinates.height + 60,
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

  useEffect(() => {
    if (!showSheet) return;

    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [showSheet]);


  const handleSave = async () => {
    const trimmedValue = complaintText.trim();

    if (!trimmedValue) {
      return;
    }

    if (isSubmitting) return;

    if (isEdit) {
      const oldValue = originalComplaintName.trim();

      if (trimmedValue === oldValue) {
        Keyboard.dismiss();

        setModalType("warning");
        setModalMessage("No changes detected");
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500);

        return;
      }
    }

    try {
      setIsSubmitting(true);

      Keyboard.dismiss();

      let res;

      if (isEdit) {
        res = await editComplaintType({
          id: editingId,
          complaintTypeName: trimmedValue,
          isActive: true,
          hostelId: activeHostelId,
        });
      } else {
        res = await addComplaintType({
          hostelId: activeHostelId,
          complaintTypeName: trimmedValue,
        });
      }

      if (!res.success) {
        setModalType("warning");
        setModalMessage(res.message);
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500);

        return;
      }

      setModalType("success");
      setModalMessage(
        res.message ||
        (isEdit
          ? "Complaint Type Updated Successfully"
          : "Complaint Type Added Successfully")
      );

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        closeSheet();
      }, 1000);

    } catch (error) {
      console.log("Complaint Type Save Error:", error);

      setModalType("warning");
      setModalMessage("Something went wrong");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1500);

    } finally {
      setIsSubmitting(false);
    }
  };


  // const handleSave = async () => {

  //   if (isEdit) {
  //     const newValue = complaintText.trim();
  //     const oldValue = originalComplaintName.trim();

  //     if (newValue === oldValue) {
  //       setModalType("warning");
  //       setModalMessage("No changes detected");
  //       setShowSuccessModal(true);

  //       setTimeout(() => setShowSuccessModal(false), 1500);
  //       return;
  //     }
  //   }


  //   let res;

  //   if (isEdit) {
  //     res = await editComplaintType({
  //       id: editingId,
  //       complaintTypeName: complaintText,
  //       isActive: true,
  //       hostelId: activeHostelId,
  //     });
  //   } else {
  //     res = await addComplaintType({
  //       hostelId: activeHostelId,
  //       complaintTypeName: complaintText,
  //     });
  //   }


  //   if (!res.success) {
  //     setModalType("warning");
  //     setModalMessage(res.message);
  //     setShowSuccessModal(true);

  //     setTimeout(() => setShowSuccessModal(false), 1500);
  //     return;
  //   }

  //   setModalType("success");
  //   setModalMessage(res.message);
  //   setShowSuccessModal(true);

  //   setTimeout(() => setShowSuccessModal(false), 1500);

  //   closeSheet();
  // }





  const confirmDelete = async () => {
    const res = await deleteComplaintType(deleteId, activeHostelId);

    if (!res.success) {
      setModalMessage(res.message);
      setModalType("warning");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1500);

      return;
    }

    setShowDeleteConfirm(false);

    setModalMessage(res.message || "Deleted successfully");
    setModalType("success");
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
    }, 1500);
  };



  const complaints = complaintTypes;

  const renderPopupMenu = (item) => {
    if (showMenuId !== item.id) return null;

    return (
      <View style={styles.popupOverlayArea}>

        <TouchableWithoutFeedback onPress={() => setShowMenuId(null)}>
          <View style={styles.menuOutsideArea} />
        </TouchableWithoutFeedback>

        <View style={styles.popupMenu}>
          <TouchableOpacity
            style={styles.popupItem}
            onPress={() => {
              setShowMenuId(null);
              openSheet(true, item);
            }}
          >
            <Image source={require("../../../Assets/Images/editIcon.png")} style={styles.popupIcon} />
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
            <Image source={require("../../../Assets/Images/trash.png")} style={[styles.popupIcon, { tintColor: "red" }]} />
            <Text style={[styles.popupText, { color: "red" }]}>Delete</Text>
          </TouchableOpacity>
        </View>

      </View>

    );
  };


  const renderComplaint = ({ item }) => (
    <View style={styles.cardWrapper}>

      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Image source={ComplaintIcon} style={styles.icon} />
          <Text style={styles.cardText}>{item.title}</Text>
        </View>



        <TouchableOpacity
          onPress={(e) => {
            e.target.measure((fx, fy, width, height, px, py) => {
              setMenuPosition({ x: px, y: py });
              setMenuComplaintId(item.id);
              setShowMenu(true);
            });
          }}
        >
          <Image source={Dots} style={styles.dots} />
        </TouchableOpacity>

      </View>

      {renderPopupMenu(item)}

    </View>
  );



  return (
    <>
      {loading && <Loader />}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: showSheet ? "transparent" : "#FFFFFF",
          padding: 20,
          paddingTop: 60,
        }}
      >


        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complaints</Text>
        </View>

        {!canReadComplaints && !loading && (
          <View style={styles.emptyContainer}>
            <Image source={EmptyComplaint} style={styles.emptyImg} />
            <Text style={styles.emptyTitle}>
              You do not have access to view Complaints
            </Text>
          </View>
        )}

        {canReadComplaints && (
          <View style={{ flex: 1 }}>
            {!loading && complaints.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Image source={EmptyComplaint} style={styles.emptyImg} />
                <Text style={styles.emptyTitle}>No Complaints are there!</Text>

                <TouchableOpacity
                  // style={styles.addButtonEmpty}
                  style={[
                    styles.addButtonEmpty,
                    !canWriteComplaints && { opacity: 0.4 },
                  ]}
                  disabled={!canWriteComplaints}
                  onPress={() => canWriteComplaints && openSheet(false)}
                >
                  <Text style={styles.addBtnText}>+ Complaints</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={complaints}
                renderItem={renderComplaint}
                keyExtractor={(i) => i.id.toString()}
                contentContainerStyle={{ paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        )}



        {canReadComplaints && !loading && complaints.length > 0 && (
          <TouchableOpacity
            style={[
              styles.addBtn,
              !canWriteComplaints && { opacity: 0.4 },
            ]}
            disabled={!canWriteComplaints}
            onPress={() => canWriteComplaints && openSheet(false)}>
            <Image source={AddIcon} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        )}
      </View>

      {showMenu && (
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.menuOverlay}>

            <View
              style={[
                styles.menuBox,
                {
                  top: menuPosition.y + 20,
                  left: menuPosition.x - 120,
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.menuItem, { opacity: canUpdateComplaints ? 1 : 0.4 }]}
                disabled={!canUpdateComplaints}
                onPress={() => {
                  const complaint = complaints.find((c) => c.id === menuComplaintId);
                  setShowMenu(false);
                  openSheet(true, complaint);
                }}
              >
                <Image source={require("../../../Assets/Images/editIcon.png")} style={styles.popupIcon} />
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={[styles.menuItem, { opacity: canDeleteComplaints ? 1 : 0.4 }]}
                disabled={!canDeleteComplaints}
                onPress={() => {
                  setShowMenu(false);
                  setDeleteId(menuComplaintId);
                  setShowDeleteConfirm(true);
                }}
              >
                <Image source={require("../../../Assets/Images/trash.png")} style={[styles.popupIcon, { tintColor: "red" }]} />
                <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
              </TouchableOpacity>

            </View>
          </View>
        </TouchableWithoutFeedback>
      )}


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

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={confirmDelete}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showSheet && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={closeSheet}>
            <View style={styles.dimLayer} />
          </TouchableWithoutFeedback>

          {/* <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}> */}
          <Animated.View
            style={[
              styles.sheet,
              {
                marginBottom: insets.bottom,

                transform: [
                  {
                    translateY: Animated.subtract(
                      sheetY,
                      new Animated.Value(safeKeyboardHeight)
                    ),
                  },
                ],
              },
            ]}
          >
            {/* Drag Handle */}
            <View style={styles.handleWrapper} {...sheetPan.panHandlers}>
              <View style={styles.sheetHandle} />
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
              <Text style={styles.sheetTitle}>
                {isEdit ? "Edit Complaint Type" : "Add Complaint Type"}
              </Text>

              <Text style={styles.inputLabel}>
                Complaint Type <Text style={{ color: "red" }}>*</Text>
              </Text>

              {/* <TextInput
                style={styles.inputBox}
                placeholder="Enter Complaint Type"
                value={complaintText}
                onChangeText={(t) => {
                  setComplaintText(t.replace(/[^a-zA-Z\s]/g, ""))
                }
                }
              /> */}

              <TextInput
                style={styles.inputBox}
                placeholder="Enter Complaint Type"
                value={complaintText}
                returnKeyType="done"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  if (complaintText.trim() && !isSubmitting) {
                    handleSave();
                  }
                }}
                onChangeText={(t) => {
                  const cleaned = t
                    .replace(/[^a-zA-Z\s]/g, "")
                    .replace(/\s{2,}/g, " ");

                  setComplaintText(cleaned);
                }}
              />

            </ScrollView>

            {/* <TouchableOpacity
              style={[
                styles.addTypeBtn,
                { opacity: complaintText.trim() ? 1 : 0.4 },
              ]}
              disabled={!complaintText.trim()}
              onPress={handleSave}
            >
              <Text style={styles.addTypeText}>
                {isEdit ? "Update Complaint  Type" : "Add Complaint  Type"}
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[
                styles.addTypeBtn,
                {
                  marginBottom: Math.max(insets.bottom, 10),
                  opacity:
                    complaintText.trim() && !isSubmitting
                      ? 1
                      : 0.4,
                },
              ]}
              disabled={!complaintText.trim() || isSubmitting}
              onPress={handleSave}
            >
              <Text style={styles.addTypeText}>
                {isEdit
                  ? "Update Complaint Type"
                  : "Add Complaint Type"}
              </Text>
            </TouchableOpacity>

            <View style={styles.bottomMask} />
          </Animated.View>

        </View>
      )}

    </>
  );
}




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
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },

  popupMenu: {
    position: "absolute",
    right: 10,
    top: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    width: 160,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 200,
    overflow: "visible",
  },


  menuOutsideArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  popupItem: { flexDirection: "row", alignItems: "center", padding: 12 },
  popupIcon: { width: 18, height: 18, marginRight: 10 },
  popupText: { color: "#000", fontSize: 15 },

  addBtn: {
    position: "absolute",
    bottom: 90,
    right: 40,
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

  sheetOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  dimLayer: {
    flex: 1,
    backgroundColor: "transparent",
  },

  sheetDim: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },

  // sheet: {
  //   backgroundColor: "#fff",
  //   width: "100%",
  //   padding: 20,
  //   borderTopLeftRadius: 22,
  //   borderTopRightRadius: 22,
  //   overflow: "hidden",
  // },
  sheet: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,

    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,

    overflow: "hidden",
  },

  handleWrapper: {
    alignItems: "center",
    paddingVertical: 12,
  },

  sheetHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 20,
    marginBottom: 12,
  },
  bottomMask: {
    position: "absolute",
    bottom: -180,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "#fff",
  },

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
  cardWrapper: {
    position: "relative",
    zIndex: 10,
    overflow: "visible",
  },

  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },

  menuBox: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
    paddingLeft: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
  },

  popupIcon: { width: 18, height: 18, marginRight: 10 },

  menuText: { fontSize: 16, fontWeight: "600", color: "#000" },

  menuDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },


});
