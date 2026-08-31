import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, BackHandler , NativeModules } from "react-native";
import Calendar from "../../../Assets/Images/calendar.png";
import { useFocusEffect } from '@react-navigation/native';
import StatusIcon from "../../../Assets/Images/StatusIcon.png";
import Arrow from "../../../Assets/Images/Arrow_left.png";
import crown from "../../../Assets/Images/crownIcon.png";
import PremiumIcon from "../../../Assets/Images/crown.png";
import BillingIcon from "../../../Assets/Images/direct-right.png";
import ChecksIcon from "../../../Assets/Images/checks.png";
import { StatusBar, Platform } from "react-native";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useHasPermission } from "../../../Utils/useHasPermission";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import LinearGradient from "react-native-linear-gradient";


export default function PlanDetailsScreen({ route, navigation }) {

  const { getCurrentHostelPlan, currentPlan , downloadSubscriptionBill } = UseSetting();
  const { activeHostelId } = useContext(CommonContexts);

    const { CommonModule } = NativeModules;

  // const [currentPlan, setCurrentPlan] = useState(null);

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

  useEffect(() => {
    if (activeHostelId) {
      fetchCurrentPlan();
    }
  }, [activeHostelId]);
  console.log("currentPlan", currentPlan)


  const fetchCurrentPlan = async () => {
    const res = await getCurrentHostelPlan(activeHostelId);

    if (res.success) {
      console.log("Current Plan →", res.data);
      // setCurrentPlan(res.data);
    }
  };

  // const { planId } = route.params;

  // const isPremium = planId === 1;
  const isExpired = currentPlan?.numberOfDaysRemaining <= 0;
  const isPremium = currentPlan?.planId === 1;
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const {
    canWriteModule: canWriteProfile,
    canReadModule: canReadProfile,
    canUpdateModule: canUpdateProfile,
    canDeleteModule: canDeleteProfile,
  } = useHasPermission("Subscription")

  const planData = isPremium
    ? {
      title: "Premium Plan",
      price: "₹999/month",
      active: true,
      renewal: "Dec 8, 2025",
      method: "UPI Auto Debit",
      status: "Active",
      billingTag: "Premium",
    }
    : {
      title: "Basic Plan",
      price: "₹599/month",
      active: true,
      renewal: "Dec 8, 2025",
      method: "UPI Auto Debit",
      status: "Active",
      billingTag: "Basic",
    };

    const handleDownloadInvoice = async (subscriptionId) => {
  const res = await downloadSubscriptionBill(activeHostelId, subscriptionId);

  if (res?.success && res?.url) {
      await CommonModule.downloadAndViewDocument(res.url);
    } 
   else {
    // error toast/modal
    console.log("Invoice download failed", res?.message);
  }
};


  console.log(currentPlan?.billingHistory)

  return (
    <View style={{
      flex: 1, backgroundColor: "#fff", paddingTop: Platform.OS === "android"
        ? StatusBar.currentHeight
        : 40,
    }}>
       <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {/* <Text style={styles.backArrow}>←</Text> */}
            <Image source={Arrow} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.header}>Subscription plans</Text>
        </View>
      <ScrollView style={{ paddingHorizontal: 16 }} contentContainerStyle={{ flexGrow: 1 }}>


       


        {currentPlan ? (<>

          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.planTitle}>Current Plan</Text>


              <View style={{ flexDirection: 'column' }}>
                <View style={[styles.activeBadge, { backgroundColor: isExpired ? "#EB6617" : "#00A32E" }]}>
                  {/* <View style={styles.greenDot} /> */}
                  <Text style={{ color: '#fff' }}>{isExpired ? "Plan Expired" : "Active"}</Text>
                </View>
                {!isExpired && (
                  <Text style={styles.expiryText}>
                    Expires in {currentPlan?.numberOfDaysRemaining} days
                  </Text>
                )}
              </View>
            </View>

            <Text style={styles.price}>{currentPlan?.planAmount}</Text>

            {/* <TouchableOpacity style={styles.changeBtn}
              onPress={() => navigation.navigate("SubscriptionPlans")}>
              <Text style={styles.changeBtnText}>Change Plan</Text>
            </TouchableOpacity> */}

            {/* Buttons */}

            {isExpired ? (

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate("SubscriptionPlans")}
              >
                <Text style={styles.primaryBtnText}>
                  Renew Now
                </Text>
              </TouchableOpacity>

            ) : (

              <View style={styles.buttonRow}>
                {
                  Platform.OS === 'ios' ? null : <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => navigation.navigate("SubscriptionPlans")}
                >
                  <Text style={styles.secondaryBtnText}>
                    {isPremium ? "Change Plan" : "Upgrade Plan"}
                  </Text>
                </TouchableOpacity>
                }
                

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => handleDownloadInvoice(currentPlan?.subscriptionId)}
                >
                  <Text style={styles.primaryBtnText}>
                    Get Invoice
                  </Text>
                </TouchableOpacity>

              </View>

            )}

            {isExpired ? (

              <>
                <View style={styles.detailsRow}>
                  <Text style={styles.leftLabel}>Expired on</Text>
                  <Text style={styles.rightValue}>
                    {currentPlan?.renewalDate || "-"}
                  </Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.leftLabel}>Status</Text>
                  <Text style={[styles.rightValue, { color: "#222" }]}>
                    Expired
                  </Text>
                </View>
              </>

            ) : (

              <>
                <View style={styles.detailsRow}>
                  <Text style={styles.leftLabel}>Plan start date</Text>
                  <Text style={styles.rightValue}>
                    {currentPlan?.planStartDate || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.leftLabel}>Plan end date</Text>
                  <Text style={styles.rightValue}>
                    {currentPlan?.renewalDate || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.leftLabel}>Payment mode</Text>
                  <Text style={styles.rightValue}>
                    {currentPlan?.paymentMethod || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.leftLabel}>Ref No</Text>
                  <Text style={styles.rightValue}>
                    {currentPlan?.referenceNumber || "N/A"}
                  </Text>
                </View>
              </>

            )}


            {/* <View style={styles.infoRow}>
              <Image source={Calendar} style={styles.icon} />
              <View>
                <Text style={styles.infoLabel}>Renewal Date</Text>
                <Text style={styles.infoValue}>{currentPlan?.renewalDate}</Text>
              </View>
            </View>


            <View style={styles.infoRow}>
              <Image source={Calendar} style={styles.icon} />
              <View>
                <Text style={styles.infoLabel}>Payment Method</Text>
                <Text style={styles.infoValue}>{currentPlan?.paymentMethod}</Text>
              </View>
            </View>


            <View style={styles.infoRow}>
              <Image source={StatusIcon} style={styles.icon} />
              <View>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.statusBlue}>{isExpired ? "Plan Expired" : currentPlan?.status}</Text>
              </View>
            </View> */}


          </View>


          {/* {currentPlan?.planName !== "Advance" && (


            <LinearGradient
              colors={["#5053A6", "#2E2F86", "#14156E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.upgradeCard}
            >
              <Image source={crown} style={styles.crownWatermark} />

              <Image source={StatusIcon} style={styles.planIcon} />

              <Text style={styles.upgradeTitle}>
                Upgrade to Premium Plan
              </Text>

              <Text style={styles.upgradeSubtitle}>
                Features to get add on
              </Text>

              <View style={styles.featureRow}>
                <Image source={ChecksIcon} style={styles.tick} />
                <Text style={styles.featureText}>
                  WhatsApp Integration
                </Text>
              </View>

              <View style={styles.featureRow}>
                <Image source={ChecksIcon} style={styles.tick} />
                <Text style={styles.featureText}>
                  Digital KYC
                </Text>
              </View>

              <View style={styles.featureRow}>
                <Image source={ChecksIcon} style={styles.tick} />
                <Text style={styles.featureText}>
                  Legal E-Sign
                </Text>
              </View>

              <View style={styles.bottomContainer}>

                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={styles.priceText}>₹999</Text>
                  <Text style={styles.monthText}> /month</Text>
                </View>

                <TouchableOpacity
                  style={styles.upgradeButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.upgradeButtonText}>
                    Upgrade Now
                  </Text>
                </TouchableOpacity>

              </View>

            </LinearGradient>

      
          )} */}


          <Text style={styles.billingHeader}>Billing History</Text>

          {!currentPlan.isTrial && currentPlan?.billingHistory.length > 0 ?
            currentPlan?.billingHistory.map((item, idx) => (
              // <View key={idx} style={styles.billCard}>
              //   <View style={{ flexDirection: "row", alignItems: "center" }}>
              //     <View style={{ backgroundColor: '#1E45E10F', borderRadius: 24, justifyContent: 'center', alignItems: 'center', width: 48, height: 48, marginRight: 10 }}>
              //       <Image
              //         source={BillingIcon}
              //         style={styles.billIcon}
              //       />
              //     </View>
              //     <View>
              //       <Text style={styles.billTitle}>Invoice {item?.invoiceNumber || "-"}</Text>

              //       <View style={styles.premiumChip}>
              //         <Text style={styles.premiumChipText}>{item.planName}</Text>
              //       </View>
              //     </View>
              //   </View>

              //   <View style={{ alignItems: "flex-end" }}>
              //     <Text style={styles.billAmount}>₹ {item?.totalAmount}</Text>
              //     <Text style={styles.billDate}>{item?.createdAt}</Text>
              //   </View>
              // </View>
              <View key={idx} style={styles.billCard}>

                {/* Header */}
                <View style={styles.billTop}>

                  <View style={{ flex: 1 }}>

                    <Text style={styles.billPrice}>
                      ₹ {item.totalAmount}
                    </Text>

                    <Text style={styles.purchaseText}>
                      Purchased on {item.createdAt}
                    </Text>

                  </View>

                  <View style={styles.planChip}>
                    <Image
                      source={PremiumIcon}
                      style={styles.planChipIcon}
                    />

                    <Text style={styles.planChipText}>
                      {item.planName}
                    </Text>

                  </View>

                </View>

                <View style={styles.billDivider} />

                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>
                    Payment mode
                  </Text>

                  <Text style={styles.billValue}>
                    {item?.paymentMethod || "N/A"}
                  </Text>
                </View>

                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>
                    Ref No
                  </Text>

                  <Text style={styles.billValue}>
                    {item.referenceNumber}
                  </Text>
                </View>

                {expandedIndex === idx && (

                  <>

                    <View style={styles.billRow}>
                      <Text style={styles.billLabel}>
                        Plan start date
                      </Text>

                      <Text style={styles.billValue}>
                        {item.planStartDate}
                      </Text>
                    </View>

                    <View style={styles.billRow}>
                      <Text style={styles.billLabel}>
                        Plan end date
                      </Text>

                      <Text style={styles.billValue}>
                        {item.planEndDate}
                      </Text>
                    </View>

                    <TouchableOpacity style={styles.invoiceButton}
                      onPress={() => handleDownloadInvoice(item.historyId)}>
                      <Text style={styles.invoiceText}>
                        Get Invoice
                      </Text>
                    </TouchableOpacity>

                  </>

                )}

                <TouchableOpacity
                  onPress={() => handleToggle(idx)}
                >

                  <Text style={styles.viewText}>
                    {expandedIndex === idx
                      ? "View less"
                      : "View more"}
                  </Text>

                </TouchableOpacity>

              </View>
            ))
            : <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium', color: '#b3b6bb' }}>No Billing History</Text>
            </View>
          }
        </>
        ) : (
          <>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={EmptyState} style={styles.emptyImage} />
              <Text style={{ fontSize: 20, fontFamily: 'Gilroy-Semibold', color: 'black' }}>No Data Found</Text>
              <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Medium', color: '#4B4B4B', marginTop: 10 }}>
                No Subscription Found Yet</Text>
            </View>
          </>)
        }

      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12, marginTop: 20 , paddingHorizontal: 16 },
  backArrow: { marginRight: 8, width: 20, height: 20 },
  header: { fontSize: 20, fontWeight: "700" },

  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDE2FF",
    backgroundColor: "#fff",
    marginBottom: 18,
  },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  planTitle: { fontSize: 18, fontWeight: "700" },
  price: { fontSize: 15, color: "#555", marginTop: 4 },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },

  greenDot: { width: 8, height: 8, backgroundColor: "green", borderRadius: 50, marginRight: 6 },

  activeText: { color: "green", fontWeight: "600" },

  changeBtn: {
    backgroundColor: "#3562FF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 14,
  },

  changeBtnText: { color: "#fff", fontWeight: "700" },

  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },

  icon: { width: 20, height: 20, marginRight: 12, tintColor: "#555" },

  infoLabel: { fontSize: 13, color: "#777" },
  infoValue: { fontSize: 14, fontWeight: "600" },
  statusBlue: { fontSize: 14, color: "#3562FF", fontWeight: "700" },

  // Upgrade card
  upgradeCard: {
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    position: "relative",
  },

  crownWatermark: {
    position: "absolute",
    right: -10,
    top: -5,
    width: 120,
    height: 120,
    opacity: 1,
    resizeMode: "contain",
  },

  planIcon: {
    width: 34,
    height: 34,
    tintColor: "#FFFFFF",
  },

  upgradeTitle: {
    marginTop: 18,
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
  },

  upgradeSubtitle: {
    marginTop: 8,
    marginBottom: 18,
    color: "rgba(255,255,255,0.70)",
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  tick: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 12,
  },

  featureText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Gilroy-SemiBold"
  },

  bottomContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  priceText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontFamily: "Gilroy-Bold",
  },

  monthText: {
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 4,
    fontFamily: "Gilroy-Regular",
  },

  upgradeButton: {
    backgroundColor: "#2F54EB",
    height: 48,
    width: 165,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },

  upgradeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Gilroy-SemiBold",
  },
  planUpgradeTitle: { fontSize: 16, fontWeight: "700" },

  featureRow: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  tick: { height: 16, width: 16, marginRight: 10 },
  featureText: { fontSize: 14, color: '#fff' },

  upgradePrice: { fontSize: 20, fontWeight: "700" },

  upgradeNowBtn: {
    backgroundColor: "#3562FF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  upgradeNowText: { color: "#fff", fontWeight: "700" },

  billingHeader: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

 billCard: {
  backgroundColor: "#FFF",
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "#ECECEC",
  padding: 18,
  marginBottom: 16,
},

  billIcon: { width: 34, height: 34, },
  billTitle: { fontSize: 14, fontWeight: "700" },

  // premiumChip: {
  //   backgroundColor: "#FFE7C2",
  //   paddingHorizontal: 10,
  //   paddingVertical: 3,
  //   borderRadius: 6,
  //   marginTop: 4,
  // },

  premiumChipText: { fontSize: 11, fontWeight: "700", color: "#A56A00" },

  billAmount: { fontSize: 16, fontWeight: "700" },
  billDate: { fontSize: 12, color: "#777" },
  emptyImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    opacity: 0.8
  },

  emptyText: {
    marginTop: 14,
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
    color: "#777",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 18,
  },

  primaryBtn: {
    flex: 1,
    height: 46,
    backgroundColor: "#2F54EB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  secondaryBtn: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#FFF",
  },

  primaryBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Gilroy-SemiBold",
  },

  secondaryBtnText: {
    color: "#333",
    fontSize: 16,
    fontFamily: "Gilroy-Medium",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  leftLabel: {
    fontSize: 16,
    color: "#9A9A9A",
    fontFamily: "Gilroy-Regular",
  },

  rightValue: {
    fontSize: 16,
    color: "#222",
    fontFamily: "Gilroy-SemiBold",
  },
  expiryText: {
    marginTop: 6,
    textAlign: "right",
    fontSize: 15,
    color: "#4B4B4B",
    fontFamily: "Gilroy-Italic",
  },
  billHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  planLabel: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Gilroy-Regular",
  },

  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginVertical: 18,
  },

  invoiceBtn: {
    marginTop: 20,
    height: 48,
    backgroundColor: "#2F54EB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  invoiceBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Gilroy-SemiBold",
  },

  viewMore: {
    textAlign: "center",
    color: "#2F54EB",
    fontSize: 16,
    fontFamily: "Gilroy-SemiBold",
  },

  chipIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },

  premiumChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4E5",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  billTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },

  billDivider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginVertical: 18
  },

  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14
  },

  billLabel: {
    fontSize: 13,
    color: "#A3A3A3",
    fontFamily: "Gilroy-Regular"
  },

  billValue: {
    fontSize: 16,
    color: "#222",
    fontFamily: "Gilroy-SemiBold"
  },

  billPrice: {
    fontSize: 24,
    fontFamily: "Gilroy-Bold",
    color: "#202020"
  },

  purchaseText: {
    marginTop: 10,
    fontSize: 13,
    color: "#444",
    fontFamily: "Gilroy-Regular"
  },

  planChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3DF",
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 18
  },

  planChipIcon: {
    width: 18,
    height: 18,
    // marginRight: 6
  },

  planChipText: {
    fontSize: 15,
    fontFamily: "Gilroy-Medium"
  },

  invoiceButton: {
    marginTop: 10,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#2F54EB",
    justifyContent: "center",
    alignItems: "center"
  },

  invoiceText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Gilroy-SemiBold"
  },

  viewText: {
    marginTop: 18,
    textAlign: "center",
    color: "#1E45E1",
    fontSize: 14,
    fontFamily: "Gilroy-SemiBold"
  }

});

