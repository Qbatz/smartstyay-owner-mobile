import React, { useState, useEffect, useContext , useRef} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView, Modal, TouchableWithoutFeedback
} from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import DotsIcon from "../../../Assets/Images/3dots.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import ThreeDots from "../../../Assets/Images/3dots.png";
import LocationIcon from "../../../Assets/Images/LocatIcon.png";
import TransferIcon from "../../../Assets/Images/arrow-transfer.png"
import BankOverview from "./BankOverview";
import BankLinkedMethods from "./BankLinkedMethods"
import BankLedger from "./BankLedger"
// import ExpensesItems from "./ExpensesItems";
// import ExpensesComments from "./ExpensesComments";

import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { ExpensesContext } from "../../../Context/ExpensesContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import BankIcon from "../../../Assets/Images/bankBlue.png";
import Location from "../../../Assets/Images/Locations.png";
import TransactionSheet from "./TransactionSheet"


export default function BankDetails({  }) {
    // const { expense } = route.params;

    // console.log("expense", expense);

    const navigation = useNavigation()

      const route = useRoute();

  const { bankDetails, bankId } = route.params || {};

    //   const {
    //     canWriteModule: canWriteExpense,
    //     canReadModule: canReadExpense,
    //     canUpdateModule: canUpdateExpense,
    //     canDeleteModule: canDeleteExpense,
    //   } = useHasPermission("Expense");

    const {
        canWriteModule: canWriteBanking,
        canReadModule: canReadBanking,
        canUpdateModule: canUpdateBanking,
        canDeleteModule: canDeleteBanking,
    } = useHasPermission("Banking")

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");

    const [showTransactionSheet, setShowTransactionSheet] = useState(false);


    const [activeTab, setActiveTab] = useState("Overview")

 
    const { bankList, transactionList, loading, errorMsg, getBankListByHostel, AddBankAmount } =
        useContext(BankingContext);
    const { activeHostelId } = useContext(CommonContexts);




    const [activeMenu, setActiveMenu] = useState(null);
    const [deleteVendordata, setDeleteVendorData] = useState(null);
    const [deletePopup, setDeletePopup] = useState(false)






    //   const handleDelete = async () => {
    //     if (!canDeleteBanking) {
    //       setModalType("warning");
    //       setModalMessage("You do not have permission to delete Banking");
    //       setShowSuccessModal(true);
    //       return;
    //     }

    //     if (!expense?.expenseId) {
    //       setModalType("error");
    //       setModalMessage("Invalid expense id");
    //       setShowSuccessModal(true);
    //       return;
    //     }

    //     const res = await DeleteExpense(activeHostelId, expense.expenseId);

    //    if (res?.success) {
    //   setDeletePopup(false);  

    //   setTimeout(() => {
    //     setModalType("success");
    //     setModalMessage("Expense deleted successfully");
    //     setShowSuccessModal(true);
    //   }, 200);

    //   setTimeout(async () => {
    //     setShowSuccessModal(false);
    //     await GetExpenseList(activeHostelId);
    //     navigation.goBack();
    //   }, 1700);
    // } 
    //     else {
    //       setModalType("error");
    //       setModalMessage(res?.message || "Something went wrong");
    //       setShowSuccessModal(true);

    //       setTimeout(() => {
    //         setShowSuccessModal(false);
    //       }, 2000);
    //     }
    //   };

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
        "Overview",
        "Linked Methods",
        "Ledger",
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "Overview":
                return <BankOverview />

            case "Linked Methods":
                return <BankLinkedMethods />

            case "Ledger":
                return (
                    <BankLedger
                    />
                );



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

                <View style={styles.bankHeader}>
                      <TouchableOpacity onPress={() => navigation.goBack()}>
    <Image source={ArrowLeft} style={styles.backIcon} />
  </TouchableOpacity>

                   <View style={styles.topHeader}>


  <View style={styles.bankInfoRow}>
    <Image source={BankIcon} style={styles.bankIcon} />

    <View style={{ flex: 1, marginLeft: 18 }}>
      <Text style={styles.bankName}>
        {/* {bankDetails?.bankName} */}
        Canara Bank
      </Text>

      <View style={styles.locationRow}>
        <Text style={styles.accountType}>Bank Account</Text>

        <Image
          source={Location}
          style={styles.smallLocation}
        />

        <Text style={styles.locationText}>
          Navalur
        </Text>
      </View>
    </View>
  </View>

  <TouchableOpacity>
    <Image source={ThreeDots} style={styles.menuIcon}/>
  </TouchableOpacity>
</View>



                    <View style={styles.actionRow}>

                        <TouchableOpacity style={styles.addBtn}    onPress={() => setShowTransactionSheet(true)}>
                            <Text style={styles.addBtnText}>
                                ＋ Add Transaction
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.transferBtn} onPress={()=> navigation.navigate("BankTransfer")}>
                            <Image source={TransferIcon} style={{height:18, width:18, marginRight:10}} />
                            <Text style={styles.transferText}>
                                 Transfer
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>



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
                <TransactionSheet
  visible={showTransactionSheet}
  onClose={() => setShowTransactionSheet(false)}
   navigation={navigation}
/>

            </View>

         
{/* 
            <Modal
                transparent
                animationType="fade"
                visible={deletePopup}
                onRequestClose={() => setDeletePopup(false)}
            >
                <View style={styles.deleteOverlay}>
                    <View style={styles.deleteBox}>
                        <Text style={styles.deleteTitle}>
                            Delete Bank?
                        </Text>

                        <Text style={styles.deleteSub}>
                            Are you sure you want to delete this Bank?
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
            </Modal> */}


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
        alignItems: "center",
        marginBottom: 20,
    },

    expCodeBadge: {
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
        justifyContent: "center",
        marginRight: 10,
        flexShrink: 0,
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

   tabWrapper:{
  borderBottomWidth:1,
  borderBottomColor:"#ECECEC",
  marginTop:20,
},

tabItem:{
  width:140,
  alignItems:"center",
  paddingBottom:14,
},
    // tabItem: {
    //     marginHorizontal: 18,
    //     paddingVertical: 14,
    //     alignItems: "center",
    // },

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

    // expCodeBadge: {
    //   backgroundColor: "#EEF2FF",
    //   paddingHorizontal: 10,
    //   paddingVertical: 6,
    //   borderRadius: 4,
    //   justifyContent: 'center'
    // },

    expCodeText: {
        color: "#0D1B8E",
        fontSize: 12,
        fontFamily: "Gilroy-Semibold",
    },

    vendorBadge: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#141497",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 0,
    },

    locationIcon: {
        width: 22,
        height: 22,
        tintColor: "#FFFFFF",
        marginRight: 10,
    },

    vendorBadgeText: {
        flex: 1,
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
    bankHeader: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingBottom: 18
    },

    // bankInfoRow: {
    //     flexDirection: "row",
    //     alignItems: "center"
    // },

    // bankIcon: {
    //     width: 56,
    //     height: 56,
    //     borderRadius: 16
    // },

    // bankName: {
    //     fontSize: 28,
    //     fontFamily: "Gilroy-Bold",
    //     color: "#1A1A1A"
    // },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },

    accountType: {
        fontSize: 15,
        color: "#666"
    },

    smallLocation: {
        width: 14,
        height: 14,
        marginHorizontal: 6,
        tintColor: "#B8860B", 
    },

    locationText: {
        fontSize: 15,
        color: "#A36D00",
        fontFamily: "Gilroy-Semibold"
    },

    actionRow: {
        flexDirection: "row",
        marginTop: 22
    },

    // addBtn: {
    //     backgroundColor: "#2949E8",
    //     paddingVertical: 14,
    //     paddingHorizontal: 24,
    //     borderRadius: 28,
    //     marginRight: 12
    // },

    addBtnText: {
        color: "#fff",
        fontSize: 14,
        fontFamily: "Gilroy-Semibold"
    },

    // transferBtn: {
    //     borderWidth: 1,
    //     borderColor: "#D9D9D9",
    //     paddingVertical: 14,
    //     paddingHorizontal: 26,
    //     borderRadius: 28,
    //     backgroundColor: "#fff"
    // },

    transferText: {
        color: "#2949E8",
        fontSize: 14,
        fontFamily: "Gilroy-Semibold"
    },
    topHeader:{
  flexDirection:"row",
  alignItems:"center",
  justifyContent:"space-between",
  marginBottom:26,
},

bankInfoRow:{
  flex:1,
  flexDirection:"row",
  alignItems:"center",
  marginHorizontal:8,
  marginTop:14
},

bankIcon:{
  width:42,
  height:42,
  borderRadius:22,
},

bankName:{
  fontSize:18,
  fontFamily:"Gilroy-Bold",
  color:"#232323",
},

accountType:{
  fontSize:15,
  color:"#6E6E6E",
  fontFamily:"Gilroy-Medium",
},

locationText:{
  fontSize:13,
  color:"#A56C00",
  fontFamily:"Gilroy-Semibold",
},

// smallLocation:{
//   width:18,
//   height:18,
//   marginHorizontal:8,
// },

menuIcon:{
  width:34,
  height:34,
},

actionRow:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginTop:12,
},

addBtn:{
  width:"55%",
  height:40,
  backgroundColor:"#2F49E7",
  borderRadius:30,
  justifyContent:"center",
  alignItems:"center",
},

transferBtn:{
  width:"40%",
  height:40,
  borderRadius:30,
  borderWidth:1,
  borderColor:"#D9D9D9",
  justifyContent:"center",
  alignItems:"center",
  backgroundColor:"#fff",
  flexDirection:'row'
},
});