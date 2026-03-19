import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  BackHandler,
} from "react-native";

const BackIcon = require("../../../Assets/Images/Arrow_left.png");

// Import Screens
import BillsTemplate from "./BillsTemplate";
import SecurityDepositTemplate from "./SecurityDepositTemplate";
import ReceiptsTemplate from "./ReceiptsTemplate";

import BillsPdfPreview from "./BillsPdfPreview";
import SecurityDepositPdfPreview from "./SecurityDepositPreview";
import ReceiptPdfPreview from "./ReceiptPdfPreview";
import AddBankingModal from "../../MorePages/Banking/AddBanking";
import { useNavigation } from "@react-navigation/native";

export default function TemplatesScreen({ navigation, onBack }) {
  const [activeTab, setActiveTab] = useState("Bills");

  // Preview States
  const [showBillsPreview, setShowBillsPreview] = useState(false);
  const [showSecurityPreview, setShowSecurityPreview] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

  // Hide previews when switching tabs
  const resetPreviews = () => {
    setShowBillsPreview(false);
    setShowSecurityPreview(false);
    setShowReceiptPreview(false);
  };

  const [billTemplateData, setBillTemplateData] = useState({});
  const [advanceTemplateData,setAdvanceTemplateData]=useState({});
  const [receiptTemplateData, setReceiptTemplateDate]=useState({});
  /* -----------------------------------------------------------
      ANDROID BACK BUTTON HANDLER
     ----------------------------------------------------------- */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (showBillsPreview) {
          setShowBillsPreview(false);
          return true;
        }
        if (showSecurityPreview) {
          setShowSecurityPreview(false);
          return true;
        }
        if (showReceiptPreview) {
          setShowReceiptPreview(false);
          return true;
        }
        return false; // allow normal back if no preview
      }
    );

    return () => backHandler.remove();
  }, [showBillsPreview, showSecurityPreview, showReceiptPreview]);
  const [addbankingshow, setAddBankingShow] = useState(false)
  const [editMode, setEditMode] = useState({ mode: "add", tab: "Bank" });

  const PREVIEW_ACTIVE =
    showBillsPreview || showSecurityPreview || showReceiptPreview;

  const handleAddBanking = () => {
    setEditMode({ mode: "add", tab: "Bank", raw: null, bankId: null });
    setAddBankingShow(true);
  };

  const handleCloseAddBanking = () => {
    setAddBankingShow(false);
    setEditMode({ mode: "add", tab: "Bank", raw: null, bankId: null });
  };

  const handleBillsTemplateChange = (data) => {
    console.log("Received from child:", data);
    setBillTemplateData(data);
  };

  const handleAdvanceTemplateChange =(data)=>{
    setAdvanceTemplateData(data)
  }

  const handleReceiptTemplateChange =(data) =>{
    setReceiptTemplateDate(data)
  }

  return (
    <View style={styles.screen}>
      {/* ---------------- HEADER (Hide during preview) ---------------- */}
      {!PREVIEW_ACTIVE && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Image source={BackIcon} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Templates</Text>
        </View>
      )}

      {/* ---------------- TABS (Hide during preview) ---------------- */}
      {!PREVIEW_ACTIVE && (
        <View style={styles.tabsContainer}>
          {["Bills", "Security Deposit", "Receipts"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                resetPreviews();
                setActiveTab(t);
              }}
              style={[
                styles.tabButton,
                activeTab === t && { backgroundColor: "#1E45E1" },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === t && { color: "#fff" },
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ---------------- CONTENT AREA ---------------- */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* BILLS TAB */}
        {activeTab === "Bills" && !showBillsPreview && <BillsTemplate handleBank={handleAddBanking} onChange={handleBillsTemplateChange} />}
        {activeTab === "Bills" && showBillsPreview && (
          <BillsPdfPreview onBack={() => navigation.goBack()} billsDataChanged={billTemplateData}/>
        )}

        {/* SECURITY DEPOSIT TAB */}
        {activeTab === "Security Deposit" && !showSecurityPreview && (
          <SecurityDepositTemplate handleAddBank={handleAddBanking} onChange={handleAdvanceTemplateChange}/>
        )}
        {activeTab === "Security Deposit" && showSecurityPreview && (
          <SecurityDepositPdfPreview onBack={() => navigation.goBack()} advanceDataChanged={advanceTemplateData}/>
        )}

        {/* RECEIPTS TAB */}
        {activeTab === "Receipts" && !showReceiptPreview && (
          <ReceiptsTemplate onChange={handleReceiptTemplateChange}/>
        )}
        {activeTab === "Receipts" && showReceiptPreview && (
          <ReceiptPdfPreview onBack={() => navigation.goBack()} receiptDataChanged={receiptTemplateData}/>
        )}
      </ScrollView>

      {/* ---------------- PREVIEW BUTTONS ---------------- */}
      {!PREVIEW_ACTIVE && activeTab === "Bills" && (
        <TouchableOpacity
          style={styles.previewBtn}
          onPress={() => setShowBillsPreview(true)}
        >
          <Text style={styles.previewBtnText}>Preview</Text>
        </TouchableOpacity>
      )}

      {!PREVIEW_ACTIVE && activeTab === "Security Deposit" && (
        <TouchableOpacity
          style={styles.previewBtn}
          onPress={() => setShowSecurityPreview(true)}
        >
          <Text style={styles.previewBtnText}>Preview</Text>
        </TouchableOpacity>
      )}

      {!PREVIEW_ACTIVE && activeTab === "Receipts" && (
        <TouchableOpacity
          style={styles.previewBtn}
          onPress={() => setShowReceiptPreview(true)}
        >
          <Text style={styles.previewBtnText}>Preview</Text>
        </TouchableOpacity>
      )}

      {addbankingshow && (
        <AddBankingModal visible={addbankingshow} onClose={handleCloseAddBanking}
          mode={editMode.mode}
          editTab={editMode}
        />
      )

      }
    </View>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 54 : 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  backIcon: { width: 22, height: 22, marginRight: 10 },

  headerTitle: { fontSize: 18, fontWeight: "600" },

  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F6FF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 4,
    borderRadius: 40,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 30,
    alignItems: "center",
  },

  tabText: { color: "#1E45E1", fontWeight: "500" },

  previewBtn: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 120,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#1E45E1",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  previewBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});

