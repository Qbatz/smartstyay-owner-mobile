import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView, Modal, TouchableWithoutFeedback
} from "react-native";
import { VendorContext } from "../../../Context/VendorContext";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import ThreeDots from "../../../Assets/Images/3dots.png";
import DotsIcon from "../../../Assets/Images/3dots.png";
import VendorInfo from "./VendorInfo";
import VendorTransactions from "./VendorTransactions";
import VendorExpenses from "./VendorExpenses";
import VendorComments from "./VendorComments";
import VendorExpenseDetailsSheet from "./VendorExpenseDetails"
import { useHasPermission } from "../../../Utils/useHasPermission"
import { CustomerContext } from "../../../Context/CustomerContext"
import { CommonContexts } from "../../../Context/CommonContext";
import Loader from "../../../Component/Loader/Loader"
import SuccessModal from "../../../ToastFile/ToastPage";


export default function VendorDetails({ route, navigation }) {
  const { vendor } = route.params;

  const { getVendorDetails, vendorDetails, getVendorSettlementInitialize } = useContext(VendorContext);

  const { vendorList, loading, getVendorList, deleteVendor, } = useContext(CustomerContext)
  const { activeHostelId } = useContext(CommonContexts)

  const {
    canReadModule: canReadVendor,
    canWriteModule: canWriteVendor,
    canUpdateModule,
    canDeleteModule,
  } = useHasPermission("Vendor")

  const [activeTab, setActiveTab] = useState("Info");

  const [showExpenseSheet, setShowExpenseSheet] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editVendor, setEditVendor] = useState(null);
  const [deleteVendordata, setDeleteVendorData] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false)

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
   const {
      getVendorExpenses,
      vendorExpenses,
      getVendorExpensePayments,
      vendorExpensePayments,
    } = useContext(VendorContext);

  console.log("vendorDetails", vendorDetails);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (vendor?.id) {
        getVendorDetails(vendor?.id);
      }
    });

    return unsubscribe; // cleanup
  }, [navigation, vendor?.id]);

  useEffect(() => {
      // getVendorExpenses(vendor?.id);
      getVendorExpensePayments(vendor?.id);
    }, [])

  const handleEdit = async (vendor) => {
    console.log("vendor", vendor);

    const res = await getVendorDetails(vendor?.id)

    if (!canUpdateModule) return;
    navigation.navigate("AddVendorPage", {
      vendorData: vendor,
    });
  }

  const handleDelete = async () => {
    if (!canDeleteModule) {
      setModalType("warning");
      setModalMessage("You do not have permission to delete vendor");
      setShowSuccessModal(true);
      return;
    }
    const res = await deleteVendor(deleteVendordata?.id, activeHostelId)

    console.log("vendordelete", res);

    setDeletePopup(false)
    if (res?.success) {
      setModalType("success");
      setModalMessage(res?.message);
      setShowSuccessModal(true);

      setTimeout(() => {
        navigation.goBack()
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

  const handlesettlePayment = async () => {
    console.log("vendordetails", vendorDetails);

    const res = await getVendorSettlementInitialize(activeHostelId, vendor?.id)
    navigation.navigate("VendorSettlePayment", {
      type: "vendor",
      vendor: vendorDetails,
    })

  }


  const tabs = [
    "Info",
    "Transactions",
    "Expenses",
    "Comments",
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Info":
        return <VendorInfo vendor={vendorDetails} />;

      case "Transactions":
        return <VendorTransactions vendor={vendorDetails} />;

      case "Expenses":
        return (
          <VendorExpenses
            vendor={vendorDetails}
            onExpensePress={(expense) => {
              setSelectedExpense(expense);
              setShowExpenseSheet(true);
            }}
          />
        );

      case "Comments":
        return <VendorComments vendor={vendorDetails} />;

      default:
        return null;
    }
  };

  console.log("DELETE DATA", deleteVendordata);

  return (
    <>
      {loading && <Loader />}

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType} />

      <View style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>

         <Text
  style={styles.headerTitle}
  numberOfLines={2}
  ellipsizeMode="tail"
>
  {vendorDetails?.businessName ||
    vendorDetails?.fullName ||
    vendorDetails?.firstName ||
    "Vendor"}
</Text>


          <TouchableOpacity
            onPress={() =>
              setActiveMenu(
                activeMenu === vendor.id ? null : vendor.id
              )
            }
          >
            <Image
              source={DotsIcon}
              style={styles.dotsIcon}
            />
          </TouchableOpacity>
        </View>


        <View style={styles.summaryCard}>

          <View style={styles.badgeRow}>
            <View style={styles.vendorCode}>
              <Text style={styles.vendorCodeText}>
                {vendor?.vendorCode}
              </Text>
            </View>

            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>
                {vendor?.paymentStatus}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                Total Paid
              </Text>

              <Text style={styles.statValue}>
                ₹{vendorDetails?.summary?.totalPaid || 0}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                Total Expenses
              </Text>

              <Text style={styles.statValue}>
                ₹{vendorDetails?.summary?.totalExpense || 0}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                Outstanding
              </Text>

              <Text
                style={[
                  styles.statValue,
                  { color: "#F97316" },
                ]}
              >
                ₹{vendorDetails?.summary?.outstanding || 0}
              </Text>
            </View>

          </View>

          {Number(vendorDetails?.summary?.outstanding) > 0 && (
            <TouchableOpacity
              style={styles.settleBtn}
              onPress={handlesettlePayment}
            >
              <Text style={styles.settleText}>
                Settle Payment →
              </Text>
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity style={styles.settleBtn}
            onPress={handlesettlePayment}
          >
            <Text style={styles.settleText}>
              Settle Payment →
            </Text>
          </TouchableOpacity> */}

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

      {activeMenu === vendor?.id && (
        <>
          <TouchableWithoutFeedback
            onPress={() => setActiveMenu(null)}
          >
            <View style={styles.menuOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.menuBox}>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setActiveMenu(null);
                handleEdit(vendor);
              }}
            >
              <Image
                source={require("../../../Assets/Images/editIcon.png")}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setDeleteVendorData(vendor);
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
              Delete Vendor?
            </Text>

            <Text style={styles.deleteSub}>
              Are you sure you want to delete this vendor?
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

      <VendorExpenseDetailsSheet
        visible={showExpenseSheet}
        expense={selectedExpense}
        onClose={() => setShowExpenseSheet(false)}
      />
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
  minHeight: 60,
  paddingHorizontal: 16,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F8F9FF",
},
headerTitle: {
  flex: 1,
  marginHorizontal: 12,
  fontSize: 18,
  fontFamily: "Gilroy-Semibold",
  color: "#111827",

  textAlign: "center",  
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
    justifyContent: "center",
    alignItems: "center",
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