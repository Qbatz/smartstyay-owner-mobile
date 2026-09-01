import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, BackHandler, Linking } from "react-native";
import FreeTrial from "../../../Assets/Images/NewBook.png";
import Calendar from "../../../Assets/Images/calendar.png";
import SubscriptionPlan from "../../../Assets/Images/SubscriptionPlan.png";
import { useFocusEffect } from '@react-navigation/native';
import Arrow from "../../../Assets/Images/Arrow_left.png";
import LinearGradient from "react-native-linear-gradient";
import { useHasPermission } from "../../../Utils/useHasPermission";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import Loader from "../../../Component/Loader/Loader";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import ChecksIcon from "../../../Assets/Images/checks.png";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { initialize, showCheckout, canGoBack, goBack } from "zoho-payments-react-native-sdk"
import { PGContext } from "../../../Context/PGContext";



export default function SubscriptionPlans({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState({
    id: null,
    code: null,
  });
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [billingType, setBillingType] = useState("monthly")
  const [plans, setPlans] = useState([]);
  // const [currentPlan, setCurrentPlan] = useState(null);

  const { getHostelPlans, getCurrentHostelPlan, loading, postSubscription, verfiyPayment, currentPlan } = UseSetting();
  const { activeHostelId } = useContext(CommonContexts);
  const {getParticularHostelDetails}=useContext(PGContext)

  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const res = await getHostelPlans();

    if (res.success) {
      const formattedPlans = res.data.map((item, index) => ({
        id: item.planId,
        name: item.planName,
        planCode: item.planCode,
        priceMonthly: `₹${item.finalPrice}`,

        priceYearly: `₹${Math.floor(item.price * 0.8)}`,

        tag: index === 0 ? "Most Popular" : null,

        short: [...new Set(item.features)].slice(0, 4),

        full: [...new Set(item.features)],
      }));

      setPlans(formattedPlans);
    }
  };

  // useEffect(() => {
  //   if (activeHostelId) {
  //     fetchCurrentPlan();
  //   }
  // }, [activeHostelId]);
  useFocusEffect(
    useCallback(() => {
      if (activeHostelId) {
        fetchCurrentPlan();
      }
    }, [activeHostelId])
  )

  const fetchCurrentPlan = async () => {
    const res = await getCurrentHostelPlan(activeHostelId);

    if (res.success) {
      console.log("Current Plan →", res.data);
      // setCurrentPlan(res.data);
    }
  };






  const isExpired = currentPlan?.numberOfDaysRemaining <= 0;


  const {
    canWriteModule: canWriteSubscription,
    canReadModule: canReadSubscription,
  } = useHasPermission("Subscription");

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

  console.log("slectPlan", selectedPlan)

  const handleExpand = (id) => {
    setExpandedPlan(expandedPlan === id ? null : id);
  };

  const selectplan = async (planId) => {

    console.log(planId)

    const apiKey = "1003.b2a3acfd49c278e09485f9d3a07e6728.07ecfeb8627ef8e907173b524a161bee"
    const accountId = "60035196766"

    const payload = {
      planCode: planId,
      // discountAmount: "100",
    }

    const res = await postSubscription(activeHostelId, payload);

    console.log(res)
    console.log("can go back", canGoBack)

    if (res?.status == 200) {
      const apiKey = res?.data?.apiKey;
      const accountId = res?.data?.accountId;
      const sessionId = res?.data?.sessionId;
      const environment = res?.data?.environment;

      initialize(apiKey, accountId, "india", environment)

      console.log("sessionId", res?.data?.sessionId)
      try {
        const result = await showCheckout({
          paymentSessionId: res?.data?.sessionId,
          // paymentMethod: 'upi',
        });
        console.log(result)
        console.log('Payment ID:', result.paymentId);
        console.log('Signature:', result.signature);
        const paymentId = result.paymentId;

        if (result.mandateId) {
          console.log('Mandate ID:', result.mandateId);
        }
        if (result.status == "success") {
          const response = await verfiyPayment(activeHostelId, paymentId)
          console.log("verifypayment", response)

          if (response.status === 200) {
            console.log(response?.message)
            fetchPlans();
            // fetchCurrentPlan();
            await new Promise(resolve => setTimeout(resolve, 3000));
            await fetchCurrentPlan();
            await getParticularHostelDetails(activeHostelId);
          }
          else {
            console.log(response?.message)
          }
        }

      } catch (e) {
        console.log('Error Code:', e?.code);
        console.log('Error Message:', e?.message);
      }
    } else {
      console.log("API Error:", res?.data);

      alert(res?.data?.message || res?.message || "Something went wrong. Please try again.");
    }



  }
  // const Plans = [
  //   {
  //     id: 1,
  //     name: "Premium Plan",
  //     priceMonthly: "₹999",
  //     priceYearly: "₹799",
  //     tag: "Most Popular",
  //     short: [
  //       "Dashboard & Property Management",
  //       "Tenant & Room Management",
  //       "Asset & Expenses Management",
  //       "Auto Recurring Invoices",
  //     ],
  //     full: [
  //       "Dashboard & Property Management",
  //       "Tenant & Room Management",
  //       "Asset & Expenses Management",
  //       "Auto Recurring Invoices",
  //       "Complaint Management",
  //       "Due Reminders",
  //       "EB Calculation",
  //       "Rent Collection Tracking",
  //       "Reports & Insights",
  //       "Secure Cloud Storage",
  //       "Unlimited Staff Access",
  //       "WhatsApp Integration",
  //       "Digital KYC",
  //       "Rental Agreement + E-Sign",
  //       "Online Payment Gateway",
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Basic Plan",
  //     priceMonthly: "₹599",
  //     priceYearly: "₹499",
  //     short: [
  //       "Dashboard & Property Management",
  //       "Tenant & Room Management",
  //       "Asset & Expenses Management",
  //       "Auto Recurring Invoices",
  //     ],
  //     full: [
  //       "Dashboard & Property Management",
  //       "Tenant & Room Management",
  //       "Asset & Expenses Management",
  //       "Auto Recurring Invoices",
  //       "Complaint Management",
  //       "Due Reminders",
  //       "EB Calculation",
  //     ],
  //   },
  // ];

  return (

    <>
      {loading && <Loader />}
      <View style={{ flex: 1, backgroundColor: "#fff", position: "relative" }}>




        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginLeft: 10, paddingTop: 60 }} onPress={() => navigation.goBack()}>
          <Image source={Arrow} style={styles.backArrow} />
          <Text style={styles.screenTitle}>Subscription plans</Text>
        </TouchableOpacity>

        {!canReadSubscription && (
          <View style={styles.emptyContainer}>
            <Image source={EmptyState} style={styles.emptyImage} />
            <Text style={styles.emptyText}>
              You do not have access to view Subscription
            </Text>
          </View>
        )}

        {canReadSubscription && (
          <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 16 }} contentContainerStyle={{ paddingBottom: 140 }} >

            {isExpired ? (

              <View style={styles.expiredCard}>
                <Image
                  source={SubscriptionPlan}
                  style={styles.expireImage}
                />

                <Text style={styles.expireTitle}>
                  Your {currentPlan?.planName} got expired!
                </Text>

                <Text style={styles.expireSubtitle}>
                  Your {currentPlan?.planName} has ended. Subscribe now to continue accessing all features.
                </Text>
              </View>

            ) : (

              // 🟢 CURRENT PLAN CARD (existing one)
              <View style={styles.card}>

                <View style={styles.rowBetween}>
                  <Text style={styles.title}>
                    {currentPlan?.planName || "Free Trial"}
                  </Text>

                  <View style={styles.badge}>
                    <Image source={FreeTrial} style={styles.badgeIcon} />
                    <Text style={styles.badgeText}>
                      {currentPlan?.numberOfDaysRemaining || 0} Days Left
                    </Text>
                  </View>
                </View>

                <Text style={styles.desc}>
                  You are in {currentPlan?.planName} plan,
                </Text>

                <Text style={[styles.desc, { marginBottom: 14 }]}>
                  Upgrade to continue unlimited access once your trial ends.
                </Text>

                {/* <TouchableOpacity style={styles.upgradeBtn}>
                  <Text style={styles.upgradeText}>Upgrade to Premium</Text>
                </TouchableOpacity> */}

                <View style={styles.dateRow}>
                  <Image source={Calendar} style={styles.calendarIcon} />
                  <View>
                    <Text style={styles.dateLabel}>Start Date</Text>
                    <Text style={styles.dateValue}>
                      {currentPlan?.planStartDate || "-"}
                    </Text>
                  </View>
                </View>

                <View style={styles.dateRow}>
                  <Image source={Calendar} style={styles.calendarIcon} />
                  <View>
                    <Text style={styles.dateLabel}>End Date</Text>
                    <Text style={styles.dateValue}>
                      {currentPlan?.planEndDate || "-"}
                    </Text>
                  </View>
                </View>

              </View>

            )}

            {/* <View style={styles.card}>

      <View style={styles.rowBetween}>
        <Text style={styles.title}> {currentPlan?.planName || "Free Trial"}</Text>

        <View style={styles.badge}>
          <Image
            source={FreeTrial}
            style={styles.badgeIcon}
          />
          <Text style={styles.badgeText}>{currentPlan?.numberOfDaysRemaining || 0} Days Left</Text>
        </View>
      </View>

      <Text style={styles.desc}>
        You are in {currentPlan?.planName} plan,
      </Text>
      <Text style={[styles.desc, { marginBottom: 14 }]}>
        Upgrade to continue unlimited access once your trial ends.
      </Text>

      <TouchableOpacity style={styles.upgradeBtn}>
        <Text style={styles.upgradeText}>Upgrade to Premium</Text>
      </TouchableOpacity>

      <View style={styles.dateRow}>
        <Image
          source={Calendar}
          style={styles.calendarIcon}
        />
        <View>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateValue}> {currentPlan?.planStartDate || "-"}</Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Image
          source={Calendar}
          style={styles.calendarIcon}
        />
        <View>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>{currentPlan?.planEndDate || "-"}</Text>
        </View>
      </View>

    </View> */}

            <Text style={styles.chooseTitle}>Choose Your Plan</Text>
            <Text style={styles.chooseSubText}>
              Select a Subscription Plan to Unlock the Functionality of the Application
            </Text>


            <View style={styles.switchContainer}>
              <TouchableOpacity
                onPress={() => setBillingType("monthly")}
                style={[styles.switchBtn, billingType === "monthly" && styles.switchActive]}
              >
                <Text style={[styles.switchText, billingType === "monthly" && styles.switchTextActive]}>
                  Monthly
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setBillingType("yearly")}
                style={[styles.switchBtn, billingType === "yearly" && styles.switchActive]}
              >
                <Text style={[styles.switchText, billingType === "yearly" && styles.switchTextActive]}>
                  Yearly -20% off
                </Text>
              </TouchableOpacity>
            </View>


            {plans.map((item) => {
              const expanded = expandedPlan === item.id;
              // const selected = selectedPlan === item.id;
              const selected = selectedPlan.code === item.planCode;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.card, selected && styles.cardSelected]}
                  activeOpacity={0.9}
                  onPress={() =>
                    setSelectedPlan({
                      id: item?.id,
                      code: item?.planCode,
                    })
                  }
                >
                  {item.tag && (
                    <LinearGradient
                      colors={["#FFA73B", "#FF7A18"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.popularTag}
                    >
                      <Text style={styles.popularTagText}>Most Popular</Text>
                    </LinearGradient>
                  )}


                  <View style={styles.rowBetween}>
                    <Text style={styles.planName}>{item.name}</Text>
                    <Text style={styles.planPrice}>
                      {billingType === "monthly" ? item.priceMonthly : item.priceYearly}
                    </Text>
                  </View>

                  <Text style={styles.monthlyText}>{item?.frequency || "Monthly"}</Text>

                  <Text style={styles.includeTitle}>Which Includes</Text>

                  {(expanded ? item.full : item.short).map((f, idx) => (
                    <View key={idx} style={styles.featureRow}>
                      <Image
                        source={ChecksIcon}
                        style={styles.tick}
                      />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.seeMoreBtn}
                    // onPress={() => {
                    //   selectplan(item?.planCode)
                    // }}

                    onPress={() => handleExpand(item.id)}
                  >
                    <Text style={styles.seeMoreText}>{expanded ? "See less →" : "See more →"}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {canReadSubscription && (
          <TouchableOpacity
            disabled={!selectedPlan.code}
            // style={[styles.continueBtn, !selectedPlan && styles.disabledBtn]}
            style={[
              styles.continueBtn,
              { bottom: insets.bottom + 10 },
              !selectedPlan.code && styles.disabledBtn
            ]}
            // onPress={() => {
            //   navigation.navigate("PlanDetailsScreen", {
            //     planId: selectedPlan?.code
            //   });
            // }}
            onPress={() => selectplan(selectedPlan?.code)}
          >
            <Text style={styles.continueText}>Continue →</Text>
          </TouchableOpacity>
        )}

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backArrow: { marginRight: 8, width: 20, height: 20 },
  screenTitle: { fontSize: 20, fontFamily: "Gilroy-Bold", paddingBottom: 0 },

  expiredCard: {
    borderRadius: 14,
    padding: 16,
    borderColor: "#FFD9C5",
    borderWidth: 1,
    marginTop: 10,
  },
  expireImage: { width: "100%", height: 120, resizeMode: "contain" },
  expireTitle: { fontSize: 18, fontFamily: "Gilroy-Bold", textAlign: "center", marginTop: 6 },
  expireSubtitle: { textAlign: "center", color: "#777", marginTop: 4 },

  chooseTitle: { fontSize: 22, fontFamily: "Gilroy-Bold", marginTop: 20, textAlign: "center", justifyContent: "center", display: "flex" },
  chooseSubText: {
    color: "#777", textAlign: "center", marginBottom: 18,
    display: "flex", justifyContent: "center", marginLeft: 50, marginRight: 50, marginTop: 10,
    fontFamily: "Gilroy-Medium", fontSize: 14

  },

  switchContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 20,
    justifyContent: "center",
    marginBottom: 16,
  },
  switchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  switchActive: {
    backgroundColor: "#4A6CFF",
  },
  switchText: { color: "#555", fontFamily: "Gilroy-Semibold" },
  switchTextActive: { color: "#fff", fontFamily: "Gilroy-Semibold" },

  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  cardSelected: {
    borderColor: "#4A6CFF",
    borderWidth: 2,
  },

  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#FFEBCC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    color: "#FF8A00",
    fontFamily: "Gilroy-Bold",
    marginBottom: 6,
  },

  rowBetween: { flexDirection: "row", justifyContent: "space-between" },

  planName: { fontSize: 19, fontFamily: "Gilroy-Bold", },
  planPrice: { fontSize: 22, fontFamily: "Gilroy-Bold", },
  monthlyText: { color: "#777", marginBottom: 10, fontFamily: "Gilroy-Semibold" },

  includeTitle: { fontFamily: "Gilroy-Bold", marginBottom: 6 },

  featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  // tick: { color: "green", fontSize: 16, marginRight: 6 },
  featureText: { color: "#444", fontFamily: "Gilroy-Medium", fontSize: 15 },

  seeMoreBtn: {
    marginTop: 10,
    backgroundColor: "#EAF0FF",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  seeMoreText: { color: "#4A6CFF", fontFamily: "Gilroy-Bold", },

  continueBtn: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#4A6CFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#AAB4DD",
  },
  continueText: { color: "#fff", fontFamily: "Gilroy-Bold", fontSize: 16 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E3E8FF",
    padding: 16,
    marginTop: 5,
    position: "relative",
  },
  popularTag: {
    position: "absolute",
    top: -15,
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 10,
  },

  popularTagText: {
    color: "#fff",
    fontFamily: "Gilroy-Bold",
    fontSize: 12,
  },



  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontFamily: "Gilroy-Bold",
    color: "#000",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFB84D",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  badgeIcon: {
    width: 14,
    height: 14,
    tintColor: "#fff",
    marginRight: 5,
  },

  badgeText: {
    color: "#fff",
    fontFamily: "Gilroy-Bold",
    fontSize: 12,
  },

  desc: {
    fontSize: 13,
    color: "#555",
    marginTop: 6,
    fontFamily: "Gilroy-Semibold"
  },

  upgradeBtn: {
    backgroundColor: "#3562FF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 14,
  },

  upgradeText: {
    color: "#fff",
    fontFamily: "Gilroy-Semibold",
    fontSize: 14,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  calendarIcon: {
    width: 18,
    height: 18,
    tintColor: "#4B4B4B",
    marginRight: 10,
  },

  dateLabel: {
    fontSize: 12,
    color: "#777",
    fontFamily: "Gilroy-Semibold",
  },

  dateValue: {
    fontSize: 14,
    fontFamily: "Gilroy-Semibold",
    marginTop: 2,
    color: "#000",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150,
  },
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
  tick: { height: 16, width: 16, marginRight: 10 },
});







