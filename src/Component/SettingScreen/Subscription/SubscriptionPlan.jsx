import React, { useState,useCallback} from "react";
import {View,Text,TouchableOpacity,StyleSheet,Image,ScrollView,BackHandler} from "react-native";
import FreeTrial from "../../../Assets/Images/NewBook.png";
import Calendar from "../../../Assets/Images/calendar.png";
import SubscriptionPlan from "../../../Assets/Images/SubscriptionPlan.png";
import { useFocusEffect } from '@react-navigation/native';
import Arrow from "../../../Assets/Images/Arrow_left.png";
import LinearGradient from "react-native-linear-gradient";


export default function SubscriptionPlans({navigation}) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [billingType, setBillingType] = useState("monthly");

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
         }, [ navigation])
       );

  const handleExpand = (id) => {
    setExpandedPlan(expandedPlan === id ? null : id);
  };

  const Plans = [
    {
      id: 1,
      name: "Premium Plan",
      priceMonthly: "₹999",
      priceYearly: "₹799",
      tag: "Most Popular",
      short: [
        "Dashboard & Property Management",
        "Tenant & Room Management",
        "Asset & Expenses Management",
        "Auto Recurring Invoices",
      ],
      full: [
        "Dashboard & Property Management",
        "Tenant & Room Management",
        "Asset & Expenses Management",
        "Auto Recurring Invoices",
        "Complaint Management",
        "Due Reminders",
        "EB Calculation",
        "Rent Collection Tracking",
        "Reports & Insights",
        "Secure Cloud Storage",
        "Unlimited Staff Access",
        "WhatsApp Integration",
        "Digital KYC",
        "Rental Agreement + E-Sign",
        "Online Payment Gateway",
      ],
    },
    {
      id: 2,
      name: "Basic Plan",
      priceMonthly: "₹599",
      priceYearly: "₹499",
      short: [
        "Dashboard & Property Management",
        "Tenant & Room Management",
        "Asset & Expenses Management",
        "Auto Recurring Invoices",
      ],
      full: [
        "Dashboard & Property Management",
        "Tenant & Room Management",
        "Asset & Expenses Management",
        "Auto Recurring Invoices",
        "Complaint Management",
        "Due Reminders",
        "EB Calculation",
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

   


        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center",marginLeft:10, paddingTop:60}}  onPress={() => navigation.goBack()}>
          <Image source={Arrow} style={styles.backArrow}/>
          <Text style={styles.screenTitle}>Subscription plans</Text>
        </TouchableOpacity>
   <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 16 }}>

 <View style={styles.card}>

      <View style={styles.rowBetween}>
        <Text style={styles.title}>Free Trial</Text>

        <View style={styles.badge}>
          <Image
            source={FreeTrial}
            style={styles.badgeIcon}
          />
          <Text style={styles.badgeText}>17 Days Left</Text>
        </View>
      </View>

      <Text style={styles.desc}>
        You are in 30 days Free Trial,
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
          <Text style={styles.dateValue}>Nov 18, 2025</Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Image
          source={Calendar}
          style={styles.calendarIcon}
        />
        <View>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>Dec 17, 2025</Text>
        </View>
      </View>

    </View>
      
        <Text style={styles.chooseTitle}>Choose a Plan</Text>
        <Text style={styles.chooseSubText}>
          Select a Subscription Plan to Unlock the Functionality of the Application
        </Text>

        {/* Billing Switch */}
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

        {/* Plans */}
        {Plans.map((item) => {
          const expanded = expandedPlan === item.id;
          const selected = selectedPlan === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, selected && styles.cardSelected]}
              activeOpacity={0.9}
              onPress={() => setSelectedPlan(item.id)}
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

              <Text style={styles.monthlyText}>Monthly</Text>

              <Text style={styles.includeTitle}>Which Includes</Text>

              {(expanded ? item.full : item.short).map((f, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Text style={styles.tick}>✔</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.seeMoreBtn}
                onPress={() => handleExpand(item.id)}
              >
                <Text style={styles.seeMoreText}>{expanded ? "See less →" : "See more →"}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

   <TouchableOpacity
  disabled={!selectedPlan}
  style={[styles.continueBtn, !selectedPlan && styles.disabledBtn]}
  onPress={() => {
    navigation.navigate("PlanDetailsScreen", {
      planId: selectedPlan  
    });
  }}
>
  <Text style={styles.continueText}>Continue →</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  backArrow: {marginRight: 8,width:20,height:20 },
  screenTitle: { fontSize: 20, fontWeight: "700" , paddingBottom:0},

  expiredCard: {
    borderRadius: 14,
    padding: 16,
    borderColor: "#FFD9C5",
    borderWidth: 1,
    marginTop: 10,
  },
  expireImage: { width: "100%", height: 120, resizeMode: "contain" },
  expireTitle: { fontSize: 18, fontWeight: "700", textAlign: "center", marginTop: 6 },
  expireSubtitle: { textAlign: "center", color: "#777", marginTop: 4 },

  chooseTitle: { fontSize: 22, fontWeight: "700", marginTop: 20, textAlign: "center",justifyContent:"center",display:"flex" },
  chooseSubText: { color: "#777", textAlign: "center", marginBottom: 18,display:"flex",justifyContent:"center",marginLeft:50,marginRight:50},

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
  switchText: { color: "#555", fontWeight: "600" },
  switchTextActive: { color: "#fff" },

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
    fontWeight: "700",
    marginBottom: 6,
  },

  rowBetween: { flexDirection: "row", justifyContent: "space-between" },

  planName: { fontSize: 19, fontWeight: "700" },
  planPrice: { fontSize: 22, fontWeight: "700" },
  monthlyText: { color: "#777", marginBottom: 10 },

  includeTitle: { fontWeight: "700", marginBottom: 6 },

  featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  tick: { color: "green", fontSize: 16, marginRight: 6 },
  featureText: { color: "#444" },

  seeMoreBtn: {
    marginTop: 10,
    backgroundColor: "#EAF0FF",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  seeMoreText: { color: "#4A6CFF", fontWeight: "700" },

  continueBtn: {
    backgroundColor: "#4A6CFF",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#AAB4DD",
  },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 16 },
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
  fontWeight: "700",
  fontSize: 12,
},



  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
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
    fontWeight: "700",
    fontSize: 12,
  },

  desc: {
    fontSize: 13,
    color: "#555",
    marginTop: 6,
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
    fontWeight: "600",
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
  },

  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
    color: "#000",
  },
});
