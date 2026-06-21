import React, { useState , useEffect , useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,Modal , TouchableWithoutFeedback
} from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import DotsIcon from "../../../Assets/Images/3dots.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import ThreeDots from "../../../Assets/Images/3dots.png";
import LocationIcon from "../../../Assets/Images/LocatIcon.png";
import ExpensesInfo from "./ExpensesInfo";
import ExpensesTransactions from "./ExpensesTransaction";
import ExpensesItems from "./ExpensesItems";
import ExpensesComments from "./ExpensesComments";
import { CommonContexts } from "../../../Context/CommonContext";
import { ExpensesContext } from "../../../Context/ExpensesContext";
import SuccessModal from "../../../ToastFile/ToastPage";
// import VendorExpenseDetailsSheet from "./VendorExpenseDetails"

export default function ExpensesDetails({ route, navigation }) {
  const { expense } = route.params;

  console.log("expense", expense);


    const {
      canWriteModule: canWriteExpense,
      canReadModule: canReadExpense,
      canUpdateModule: canUpdateExpense,
      canDeleteModule: canDeleteExpense,
    } = useHasPermission("Expense");

        const [showSuccessModal, setShowSuccessModal] = useState(false);
        const [modalMessage, setModalMessage] = useState("");
        const [modalType, setModalType] = useState("success");
  

  const [activeTab, setActiveTab] = useState("Info")

      const { expensesList, GetExpenseList, loading, IntializeexpensesList, GetInitializeExpense,
          DeleteExpense ,  expenseoverviewDetails , GetExpenseById
      } = useContext(ExpensesContext);
        const { activeHostelId } = useContext(CommonContexts);


  const [showExpenseSheet, setShowExpenseSheet] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [activeMenu, setActiveMenu] = useState(null);
  const [deleteVendordata, setDeleteVendorData] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false)

  console.log("deleteVendordata", deleteVendordata);
    console.log("expenseoverviewDetails", expenseoverviewDetails);

  useEffect(() => {
  const fetchDetails = async () => {
    const result = await GetExpenseById(activeHostelId, expense?.expenseId);
    if (result.success) {
      console.log("Expense Details =>", result.data);
      // setExpenseDetail(result.data)
    }
  };
  fetchDetails();
}, [activeHostelId, expense?.expenseId]);

    const handleDelete = async () => {
        if (!canDeleteExpense) {
            setModalType("warning");
            setModalMessage("You do not have permission to delete expenses");
            setShowSuccessModal(true);
            return;
        }
  const res = await DeleteExpense(
  activeHostelId,
  expense?.expenseId
);
        console.log("deleteexpenses", res);
        
        setDeletePopup(false)
        if (res?.success) {
            setModalType("success");
            setModalMessage(res.message);
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
                setDeletePopup(false)
            }, 1500)
        }


        else {
            setModalType("error");
            setModalMessage(res?.message || "Something went wrong");
            setShowSuccessModal(true);

            setTimeout(() => setShowSuccessModal(false), 2000);
        }

    }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "full":
        return "#16A34A";

      case "partial":
        return "#F97316";

      case "pending":
        return "#DC2626";

      default:
        return "#6B7280";
    }
  };

  const tabs = [
    "Info",
    "Transactions",
    "Expenses",
    "Comments",
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Info":
        return <ExpensesInfo expense={expenseoverviewDetails} />;

      case "Transactions":
        return <ExpensesTransactions  expense={expenseoverviewDetails} />;

      case "Expenses":
        return (
          <ExpensesItems
          expense={expenseoverviewDetails} 
          //   onExpensePress={(expense) => {
          //     setSelectedExpense(expense);
          //     setShowExpenseSheet(true);
          //   }}
          />
        );

      case "Comments":
        return <ExpensesComments  expense={expenseoverviewDetails} />;

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


      <View style={styles.container}>

        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>

          {/* <Text style={styles.headerTitle}>
  {expense?.title || "Vegetables 50 KG"}
</Text> */}

          <TouchableOpacity
           onPress={() =>
             setActiveMenu(
               activeMenu === expense?.expenseId ? null : expense?.expenseId
             )
           }

          >
            <Image
              source={DotsIcon}
              style={styles.dotsIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Summary Card */}

        <View style={styles.summaryCard}>


          <Text style={styles.expenseMainTitle}>
            {expense?.categoryName || "-"}
          </Text>

          <View style={styles.badgeRow}>
            <View style={styles.expCodeBadge}>

              <Text style={styles.expCodeText}>
                {expense?.referenceNumber || "-"}
              </Text>
            </View>




            {expense?.vendorId && (
              <View style={styles.vendorBadge}>
                <Image
                  source={LocationIcon}
                  style={styles.locationIcon}
                />

                <Text style={styles.vendorBadgeText}>
                  {expense?.vendor ||
                    "Kural kaikai Angadi- Salem"}
                </Text>
              </View>
            )}

          </View>

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>
              Expense Amount
            </Text>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.amountValue}>
                ₹ {Number(expense?.totalAmount || 0).toLocaleString("en-IN")}
              </Text>

              <View
                style={[
                  styles.partialBadge,
                  {
                    backgroundColor:
                      expense?.paymentStatus === "Full"
                        ? "#ECFDF5"
                        : "#FFF7ED",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.partialText,
                    {
                      color: getStatusColor(
                        expense?.paymentStatus
                      ),
                    },
                  ]}
                >
                  ● {expense?.paymentStatus || "-"}
                </Text>
              </View>
            </View>
          </View>

        </View>

        {/* Tabs */}

        <View style={styles.tabWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={styles.tabItem}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab &&
                    styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>

                {activeTab === tab && (
                  <View
                    style={styles.activeIndicator}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}

        <View style={{ flex: 1 }}>
          {renderContent()}
        </View>

      </View>

       {activeMenu === expense?.expenseId && (
        <>
          <TouchableWithoutFeedback
            onPress={() => setActiveMenu(null)}
          >
            <View style={styles.menuOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.menuBox}>
            {/* <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setActiveMenu(null);
                handleEdit(expense);
              }}
            >
              <Image
                source={require("../../../Assets/Images/editIcon.png")}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setDeleteVendorData(expense);
                setDeletePopup(true);
                setActiveMenu(null);
              }}
            >
              <Image
                source={require("../../../Assets/Images/trash.png")}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuText, { color: "red" }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={deletePopup}
        onRequestClose={() => setDeletePopup(false)}
      >
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteBox}>
            <Text style={styles.deleteTitle}>
              Delete expense?
            </Text>

            <Text style={styles.deleteSub}>
              Are you sure you want to delete this expense?
            </Text>

            <View style={styles.deleteBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDeletePopup(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDelete}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> 

      {/* <VendorExpenseDetailsSheet
  visible={showExpenseSheet}
  expense={selectedExpense}
  onClose={() => setShowExpenseSheet(false)}
/> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },


  header: {
    height: 55,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: "#F8F9FF",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Gilroy-Semibold",
  },

  backIcon: {
    width: 22,
    height: 22,
  },

  dotsIcon: {
    width: 25,
    height: 25,
  },

  summaryCard: {
    backgroundColor: "#F8F9FF",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  badgeRow: {
    flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "center",
    marginBottom: 20,
  },

  vendorCode: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },

  vendorCodeText: {
    fontSize: 11,
  },

  activeBadge: {
    backgroundColor: "#16A34A",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  activeText: {
    color: "#fff",
    fontSize: 11,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statBox: {
    flex: 1,
    alignItems: "center",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  statValue: {
    fontSize: 20,
    marginTop: 8,
    fontFamily: "Gilroy-Bold",
  },

  settleBtn: {
    marginTop: 18,
    backgroundColor: "#2D5BFF",
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  settleText: {
    color: "#fff",
    fontFamily: "Gilroy-Semibold",
  },

  tabWrapper: {
    backgroundColor: "#fff",
  },

  tabItem: {
    marginHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  tabText: {
    fontSize: 14,
    color: "#666",
  },

  activeTabText: {
    color: "#2D5BFF",
    fontFamily: "Gilroy-Semibold",
  },

  activeIndicator: {
    height: 2,
    width: "100%",
    backgroundColor: "#2D5BFF",
    marginTop: 8,
  },
  expenseMainTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#111827",
    marginBottom: 14,
  },

  expCodeBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: 'center'
  },

  expCodeText: {
    color: "#0D1B8E",
    fontSize: 12,
    fontFamily: "Gilroy-Semibold",
  },

  vendorBadge: {
    marginLeft: 10,
    backgroundColor: "#141497",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  locationIcon: {
    width: 22,
    height: 22,
    tintColor: "#FFFFFF",
    marginRight: 10,
  },

  vendorBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Gilroy-Medium",
  },


  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 14,
  },

  amountLabel: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "Gilroy-Semibold",
  },

  amountValue: {
    fontSize: 18,
    color: "#111827",
    fontFamily: "Gilroy-Bold",
  },

  partialBadge: {
    marginTop: 8,
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
  },

  partialText: {
    color: "#F97316",
    fontSize: 12,
    fontFamily: "Gilroy-Semibold",
  },
   menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  menuBox: {
    position: "absolute",
    top: 90,
    right: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 8,
    paddingVertical: 5,
    minWidth: 130,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  menuIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  menuText: {
    fontSize: 14,
    color: "#111",
  },
    deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },

  deleteTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: '#111',
    textAlign: 'center',
  },

  deleteSub: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },

  deleteBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    color: '#444',
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
  },

  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#2D6CDF",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBtnText: {
    color: '#fff',
    fontSize: 16,
   fontFamily: "Gilroy-Bold"
  },
});