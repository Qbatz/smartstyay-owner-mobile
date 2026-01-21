import React, { useState, useRef, useEffect ,useContext } from "react";
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
  ScrollView, BackHandler ,
} from "react-native";
import { ExpensesContext } from "../../../Context/ExpensesContext";
import { CommonContexts } from "../../../Context/CommonContext";
import Loader from "../../../Component/Loader/Loader"
import SuccessModal from "../../../ToastFile/ToastPage";

import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import EmptyExpense from "../../../Assets/Images/Empty_state.png"; 
import Dots from "../../../Assets/Images/3dots.png";
import EditIcon from "../../../Assets/Images/editIcon.png";
import TrashIcon from "../../../Assets/Images/trash.png";
import AddIcon from "../../../Assets/Images/add-circle.png";



export default function ExpensesSettings({ navigation }) {

  const { activeHostelId } = useContext(CommonContexts);
const {
  expenses,
  loading,
  fetchExpenses,
  addExpenseCategory,
  addSubCategory,
  setExpenses,
} = useContext(ExpensesContext);


  // const [expenses, setExpenses] = useState([
  //   {
  //     id: "1",
  //     title: "EB Bill",
  //     subcategories: [
  //       { id: "a1", name: "Category A1" },
  //       { id: "a2", name: "Category A2" },
  //       { id: "a3", name: "Category A3" },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     title: "Building Rent",
  //     subcategories: [],
  //   },
  // ]);

  const [showExpenseSheet, setShowExpenseSheet] = useState(false);
  const expenseSheetY = useRef(new Animated.Value(700)).current;
  const [expenseText, setExpenseText] = useState("");
  const [isExpenseEdit, setIsExpenseEdit] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); 


  const [showSubSheet, setShowSubSheet] = useState(false);
  const subSheetY = useRef(new Animated.Value(700)).current;
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [subSheetTitle, setSubSheetTitle] = useState("");

  const [showSubAddSheet, setShowSubAddSheet] = useState(false);
  const subAddSheetY = useRef(new Animated.Value(700)).current;
  const [subName, setSubName] = useState("");
  const [isSubAddEdit, setIsSubAddEdit] = useState(false);
  const [editingSubId, setEditingSubId] = useState(null);

  const [showDeleteExpenseConfirm, setShowDeleteExpenseConfirm] = useState(false);
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);

  const [showDeleteSubConfirm, setShowDeleteSubConfirm] = useState(false);
  const [deleteSubId, setDeleteSubId] = useState(null);

  const [showMenuId, setShowMenuId] = useState(null);
    const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const dotsRefs = useRef({});

  useEffect(() => {
  if (activeHostelId) {
    fetchExpenses(activeHostelId);
  }
  else {
    setExpenses([]);
  }
}, [activeHostelId]);

useEffect(() => {
  if (showSuccessModal) {
    const t = setTimeout(() => {
      setShowSuccessModal(false);
    }, 1500);

    return () => clearTimeout(t);
  }
}, [showSuccessModal]);





  const expensePan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) expenseSheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeExpenseSheet();
        else
          Animated.spring(expenseSheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
      },
    })
  ).current;

  const subPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) subSheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeSubSheet();
        else
          Animated.spring(subSheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
      },
    })
  ).current;

  const subAddPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) subAddSheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeSubAddSheet();
        else
          Animated.spring(subAddSheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
      },
    })
  ).current;

useEffect(() => {
  const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
    const keyboardHeight = e.endCoordinates.height;

    if (showSubAddSheet) {
      Animated.timing(subAddSheetY, {
        toValue: -keyboardHeight -30, 
        duration: 180,
        useNativeDriver: true,
      }).start();
    } 
    else if (showSubSheet) {
      Animated.timing(subSheetY, {
        toValue: -keyboardHeight  -20,
        duration: 180,
        useNativeDriver: true,
      }).start();
    } 
    else if (showExpenseSheet) {
      Animated.timing(expenseSheetY, {
        toValue: -keyboardHeight -20,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  });

  const hideSub = Keyboard.addListener("keyboardDidHide", () => {
    Animated.timing(subAddSheetY, { toValue: 0, duration: 160, useNativeDriver: true }).start();
    Animated.timing(subSheetY, { toValue: 0, duration: 160, useNativeDriver: true }).start();
    Animated.timing(expenseSheetY, { toValue: 0, duration: 160, useNativeDriver: true }).start();
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, [showExpenseSheet, showSubSheet, showSubAddSheet]);


     useEffect(() => {
                 const backHandler = BackHandler.addEventListener(
                   "hardwareBackPress",
                   () => {
                     navigation.goBack();  
                     return true;
                   }
                 );
               
                 return () => backHandler.remove();
               }, [])

  const openExpenseSheet = (edit = false, item = null) => {
      if (!activeHostelId) {
    setModalType("warning");
    setModalMessage("Please add a hostel first");
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 1500);
    return;
  }
    expenseSheetY.setValue(700);
    setIsExpenseEdit(edit);
    if (edit && item) {
      setExpenseText(item.title);
      setEditingExpenseId(item.id);
    } else {
      setExpenseText("");
      setEditingExpenseId(null);
    }
    setShowExpenseSheet(true);
    Animated.timing(expenseSheetY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeExpenseSheet = () => {
    Animated.timing(expenseSheetY, {
      toValue: 700,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowExpenseSheet(false);
      setExpenseText("");
      setIsExpenseEdit(false);
      setEditingExpenseId(null);
    });
  };

  const openSubSheet = (expenseId) => {
    const parent = expenses.find((e) => e.id === expenseId);
    if (!parent) return;
    subSheetY.setValue(700);
    setSelectedExpenseId(expenseId);
    setSubSheetTitle(parent.title);
    setShowSubSheet(true);
    Animated.timing(subSheetY, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const closeSubSheet = () => {
    Animated.timing(subSheetY, {
      toValue: 700,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSubSheet(false);
      setSelectedExpenseId(null);
      setSubSheetTitle("");
    });
  };

  const openSubAddSheet = (edit = false, subItem = null) => {
    subAddSheetY.setValue(700);
    setIsSubAddEdit(edit);
    if (edit && subItem) {
      setSubName(subItem.name);
      setEditingSubId(subItem.id);
    } else {
      setSubName("");
      setEditingSubId(null);
    }
    setShowSubAddSheet(true);
    Animated.timing(subAddSheetY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeSubAddSheet = () => {
    Animated.timing(subAddSheetY, {
      toValue: 700,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSubAddSheet(false);
      setSubName("");
      setIsSubAddEdit(false);
      setEditingSubId(null);
    });
  };

const saveExpense = async () => {
  const value = expenseText.trim();
  if (!value) return;

  const res = await addExpenseCategory({
    hostelId: activeHostelId,
    categoryName: value,
  });

  if (!res.success) {
    setModalMessage(res.message || "Failed to add category");
    setModalType("error");
    setShowSuccessModal(true);
    return;
  }

  setModalMessage("Expense category added successfully");
  setModalType("success");
  setShowSuccessModal(true);

  closeExpenseSheet();
};



  const confirmDeleteExpense = (id) => {
    setDeleteExpenseId(id);
    setShowDeleteExpenseConfirm(true);
  };

  const deleteExpense = () => {
    setExpenses((prev) => prev.filter((p) => p.id !== deleteExpenseId));
    setShowDeleteExpenseConfirm(false);
    setDeleteExpenseId(null);
  };

  const getSelectedExpense = () => expenses.find((e) => e.id === selectedExpenseId) || null;

  const saveSubcategory = async () => {
  const value = subName.trim();
  if (!value || !selectedExpenseId) return;

  const res = await addSubCategory({
    hostelId: activeHostelId,
    categoryId: selectedExpenseId,
    subCategory: value,
  });

  if (!res.success) {
    setModalMessage(res.message || "Failed to add sub category");
    setModalType("error");
    setShowSuccessModal(true);
    return;
  }

  setModalMessage("Sub category added successfully");
  setModalType("success");
  setShowSuccessModal(true);

  closeSubAddSheet();
};

  const confirmDeleteSub = (subId) => {
    setDeleteSubId(subId);
    setShowDeleteSubConfirm(true);
  };

  const deleteSub = () => {
    if (!selectedExpenseId || !deleteSubId) {
      setShowDeleteSubConfirm(false);
      setDeleteSubId(null);
      return;
    }
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === selectedExpenseId ? { ...exp, subcategories: exp.subcategories.filter((s) => s.id !== deleteSubId) } : exp
      )
    );
    setShowDeleteSubConfirm(false);
    setDeleteSubId(null);
  };




  const renderExpense = ({ item }) => (
    <View style={{ position: "relative" }}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => openSubSheet(item.id)}>
        <View style={styles.card}>
          <Text style={styles.cardText}>{item.title}</Text>

        <TouchableOpacity
  ref={(ref) => (dotsRefs.current[item.id] = ref)}
  onPress={() => {
    dotsRefs.current[item.id]?.measureInWindow((x, y, width, height) => {
      setPopupPos({
        x: x - 160,   
        y: y + height + 8, 
      });
    });
    setShowMenuId(item.id);
  }}
>
  <Image source={Dots} style={styles.dots} />
</TouchableOpacity>

        </View>
      </TouchableOpacity>

    </View>
  );

  const renderSubItem = ({ item }) => (
    <View style={styles.subCard}>
      <Text style={styles.subText}>{item.name}</Text>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            setSubName(item.name);
            setIsSubAddEdit(true);
            setEditingSubId(item.id);
            openSubAddSheet(true, item);
          }}
          style={styles.iconBtn}
        >
          <Image source={EditIcon} style={styles.iconSmall} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            confirmDeleteSub(item.id);
          }}
          style={styles.iconBtn}
        >
          <Image source={TrashIcon} style={[styles.iconSmall, { tintColor: "red" }]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
     <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType}
      />
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => setShowMenuId(null)}>
          <View style={[styles.container, { backgroundColor: showExpenseSheet || showSubSheet || showSubAddSheet ? "transparent" : "#fff" }]}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={ArrowLeft} style={styles.backIcon} />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Expenses</Text>

          
            </View>

            {loading ? (
 <Loader />
) : expenses.length === 0 ? (
  <View style={styles.emptyContainer}>
    <Image source={EmptyExpense} style={styles.emptyImg} />
    <Text style={styles.emptyTitle}>No Expenses are there!</Text>

    <TouchableOpacity
      style={styles.addButtonEmpty}
      onPress={() => openExpenseSheet(false)}
    >
      <Text style={styles.addBtnText}>Add Expenses</Text>
    </TouchableOpacity>
  </View>
) : (
  <FlatList
    data={expenses}
    keyExtractor={(i) => i.id}
    renderItem={renderExpense}
    contentContainerStyle={{ paddingBottom: 140 }}
  />
)}


            {/* {expenses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Image source={EmptyExpense} style={styles.emptyImg} />
                <Text style={styles.emptyTitle}>No Expenses are there!</Text>

                <TouchableOpacity style={styles.addButtonEmpty} onPress={() => openExpenseSheet(false)}>
                  <Text style={styles.addBtnText}>Add Expenses</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList data={expenses} keyExtractor={(i) => i.id} renderItem={renderExpense} contentContainerStyle={{ paddingBottom: 140 }} />
            )} */}

            {!loading && expenses?.length > 0 && (
              <TouchableOpacity style={styles.floatingBtn} onPress={() => openExpenseSheet(false)}>
                <Image source={AddIcon} style={{ width: 26, height: 26, tintColor: "#fff" }} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>

        {showExpenseSheet && (
          <View style={styles.sheetOverlay}>
            <TouchableWithoutFeedback onPress={closeExpenseSheet}>
              <View style={styles.dimLayer} />
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.sheet, { transform: [{ translateY: expenseSheetY }] }]}>
              <View style={styles.handleWrapper} {...expensePan.panHandlers}>
                <View style={styles.sheetHandle} />
              </View>

              <ScrollView contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
                <Text style={styles.sheetTitle}>{isExpenseEdit ? "Edit Expense" : "Add Expense"}</Text>

                <Text style={styles.inputLabel}>
                  Expense Name <Text style={{ color: "red" }}>*</Text>
                </Text>

                <TextInput style={styles.inputBox} placeholder="Enter" value={expenseText} onChangeText={setExpenseText} />
              </ScrollView>

              <TouchableOpacity style={[styles.addTypeBtn, { opacity: expenseText.trim() ? 1 : 0.4 }]} disabled={!expenseText.trim()} onPress={saveExpense}>
                <Text style={styles.addTypeText}>{isExpenseEdit ? "Save Changes" : "Save"}</Text>
              </TouchableOpacity>

              <View style={styles.bottomMask} />
            </Animated.View>
          </View>
        )}

        {showSubSheet && (
          <View style={styles.sheetOverlay}>
            <TouchableWithoutFeedback onPress={closeSubSheet}>
              <View style={styles.dimLayer} />
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.sheet, { transform: [{ translateY: subSheetY }] }]}>
              <View style={styles.handleWrapper} {...subPan.panHandlers}>
                <View style={styles.sheetHandle} />
              </View>

              <View style={styles.subHeaderRow}>
                <View>
                  <Text style={styles.subHeading}>Sub Categories</Text>
                  <Text style={styles.subParentTitle}>{subSheetTitle}</Text>
                </View>
                   {getSelectedExpense() && getSelectedExpense().subcategories && getSelectedExpense().subcategories.length > 0 && 
                <TouchableOpacity
                  style={styles.subAddBtn}
                  onPress={() => {
                    setSubName("");
                    setIsSubAddEdit(false);
                    setEditingSubId(null);
                    openSubAddSheet(false, null);
                  }}
                >
                  <Text style={styles.subAddText}>Add +</Text>
                </TouchableOpacity>
}

              </View>

             {getSelectedExpense()?.subcategories?.length > 0 ? (
  <FlatList
    data={getSelectedExpense().subcategories}
    keyExtractor={(s) => s.id}
    renderItem={renderSubItem}
    contentContainerStyle={{ paddingBottom: 80 }}
  />
) : (
  <View style={styles.subEmpty}>
    <Image source={EmptyExpense} style={{ width: 180, height: 140, marginBottom: 12 }} />
    <Text style={{ fontSize: 14, color: "#444", marginBottom: 12, textAlign: "center" }}>
      No Sub Categories added yet for "{subSheetTitle}"
    </Text>

    <TouchableOpacity
      style={styles.addButtonEmpty}
      onPress={() => openSubAddSheet(false, null)}
    >
      <Text style={styles.addBtnText}>Add +</Text>
    </TouchableOpacity>
  </View>
)}


              <View style={styles.bottomMask} />
            </Animated.View>
          </View>
        )}

        {showSubAddSheet && (
          <View style={[styles.sheetOverlay, { zIndex: 9999 }]}>
            <TouchableWithoutFeedback onPress={closeSubAddSheet}>
              <View style={styles.dimLayer} />
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.sheet, { transform: [{ translateY: subAddSheetY }] }]}>
              <View style={styles.handleWrapper} {...subAddPan.panHandlers}>
                <View style={styles.sheetHandle} />
              </View>

              <ScrollView contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
                <Text style={styles.sheetTitle}>{isSubAddEdit ? "Edit Sub Category" : "Add Sub Category"}</Text>

                <Text style={styles.inputLabel}>
                  Sub Category <Text style={{ color: "red" }}>*</Text>
                </Text>

                <TextInput style={styles.inputBox} placeholder="Enter sub category" value={subName} onChangeText={setSubName} />
              </ScrollView>

              <TouchableOpacity style={[styles.addTypeBtn, { opacity: subName.trim() ? 1 : 0.4 }]} disabled={!subName.trim()} onPress={saveSubcategory}>
                <Text style={styles.addTypeText}>{isSubAddEdit ? "Save Changes" : "Save"}</Text>
              </TouchableOpacity>

              <View style={styles.bottomMask} />
            </Animated.View>
          </View>
        )}

        {showDeleteExpenseConfirm && (
          <Modal transparent visible animationType="fade">
            <View style={styles.deleteOverlay}>
              <View style={styles.deleteBox}>
                <Text style={styles.deleteTitle}>Delete Expense?</Text>
                <Text style={styles.deleteSub}>Are you sure you want to delete this expense?</Text>

                <View style={styles.deleteBtnRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowDeleteExpenseConfirm(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteBtn} onPress={deleteExpense}>
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {showDeleteSubConfirm && (
          <Modal transparent visible animationType="fade">
            <View style={styles.deleteOverlay}>
              <View style={styles.deleteBox}>
                <Text style={styles.deleteTitle}>Delete Sub Category?</Text>
                <Text style={styles.deleteSub}>Are you sure you want to delete this sub category?</Text>

                <View style={styles.deleteBtnRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowDeleteSubConfirm(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteBtn} onPress={deleteSub}>
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        
 {showMenuId && (
          <TouchableWithoutFeedback onPress={() => setShowMenuId(null)}>
            <View style={styles.globalPopupOverlay}>
              <View style={[styles.globalPopup, { top: popupPos.y, left: popupPos.x  }]}>
                <TouchableOpacity
                  style={styles.popupItem}
                  onPress={() => {
                    const item = expenses.find((e) => e.id === showMenuId);
                    setShowMenuId(null);
                    openExpenseSheet(true, item);
                  }}
                >
                  <Image source={EditIcon} style={styles.popupIcon} />
                  <Text style={styles.popupText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.popupItem}
                  onPress={() => {
                    setShowMenuId(null);
                    confirmDeleteExpense(showMenuId);
                  }}
                >
                  <Image source={TrashIcon} style={[styles.popupIcon, { tintColor: "red" }]} />
                  <Text style={[styles.popupText, { color: "red" }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backIcon: { width: 20, height: 20, marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: "700", flex: 1 },

  topAddBtn: {
    backgroundColor: "#1D5DFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  topAddText: { color: "#fff", fontWeight: "700" },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyImg: { width: 200, height: 160, marginBottom: 10 },
  emptyTitle: { fontSize: 16, color: "#444", marginBottom: 15 },

  addButtonEmpty: {
    backgroundColor: "#1E45E1",
    paddingHorizontal: 45,
    paddingVertical: 14,
    borderRadius: 10,
  },
  addBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    position:'relative'
  },
  cardText: { fontSize: 15, color: "#111", fontWeight: "600" },
  dots: { width: 24, height: 24 },


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
  popupItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  popupIcon: { width: 18, height: 18, marginRight: 10 },
  popupText: { fontSize: 15, color: "#000" },

  floatingBtn: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#1D5DFF",
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  /* sheet common */
  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  dimLayer: { flex: 1, backgroundColor: "transparent" },

  sheet: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
  },

  handleWrapper: { alignItems: "center", paddingVertical: 12 },
  sheetHandle: { width: 50, height: 5, borderRadius: 8, backgroundColor: "#ccc" },

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
    backgroundColor: "#1D5DFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  addTypeText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  bottomMask: {
    position: "absolute",
    bottom: -220,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: "#fff",
  },

  /* Sub sheet header */
  subHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  subHeading: { fontSize: 16, fontWeight: "700" },
  subParentTitle: { fontSize: 14, color: "#1D5DFF", marginTop: 4 , fontWeight:700},
  subAddBtn: { backgroundColor: "#1D5DFF", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  subAddText: { color: "#fff", fontWeight: "700" },

  subCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  subText: { fontSize: 14, fontWeight: "600" },

  subEmpty: { alignItems: "center", paddingVertical: 20 },

  subForm: { marginTop: 10, paddingTop: 6 },

  /* icons */
  iconBtn: { marginLeft: 12 },
  iconSmall: { width: 18, height: 18 },

  /* delete popup */
  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBox: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 12, alignItems: "center" },
  deleteTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  deleteSub: { color: "#666", marginBottom: 12, textAlign: "center" },

  deleteBtnRow: { flexDirection: "row", width: "100%" },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: "#1D5DFF", marginRight: 8, alignItems: "center" },
  cancelText: { color: "#1D5DFF", fontWeight: "700" },
  deleteBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: "#1D5DFF", alignItems: "center" },
  deleteBtnText: { color: "#fff", fontWeight: "700" },

  
		 /* Global Popup */
  globalPopupOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
  },
  globalPopup: {
    position: "absolute",
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  popupItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  popupIcon: { width: 18, height: 18, marginRight: 10 },
  popupText: { fontSize: 15, color: "#000" },
});


