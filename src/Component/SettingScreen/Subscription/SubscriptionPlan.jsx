import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";

export default function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [billingType, setBillingType] = useState("monthly");

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

      {/* Scroll Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 16 }}>

        {/* Back + Heading */}
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.screenTitle}>Subscription plans</Text>
        </TouchableOpacity>

        {/* Trial Expired Card */}
        <View style={styles.expiredCard}>
          <Image
            source={require("../../../Assets/Images/profile.png")}
            style={styles.expireImage}
          />
          <Text style={styles.expireTitle}>Your Trial got expired!</Text>
          <Text style={styles.expireSubtitle}>
            Your free trial has ended. Subscribe now to continue accessing all features.
          </Text>
        </View>

        {/* Choose Plan */}
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
              {item.tag && <Text style={styles.tag}>Most Popular</Text>}

              {/* Plan Header */}
              <View style={styles.rowBetween}>
                <Text style={styles.planName}>{item.name}</Text>
                <Text style={styles.planPrice}>
                  {billingType === "monthly" ? item.priceMonthly : item.priceYearly}
                </Text>
              </View>

              <Text style={styles.monthlyText}>Monthly</Text>

              {/* Feature List */}
              <Text style={styles.includeTitle}>Which Includes</Text>

              {(expanded ? item.full : item.short).map((f, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Text style={styles.tick}>✔</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}

              {/* See More */}
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

      {/* Continue Button */}
      <TouchableOpacity
        disabled={!selectedPlan}
        style={[styles.continueBtn, !selectedPlan && styles.disabledBtn]}
      >
        <Text style={styles.continueText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backArrow: { fontSize: 22, marginRight: 8 },
  screenTitle: { fontSize: 20, fontWeight: "700" },

  expiredCard: {
    backgroundColor: "#FFF8F2",
    borderRadius: 14,
    padding: 16,
    borderColor: "#FFD9C5",
    borderWidth: 1,
    marginTop: 10,
  },
  expireImage: { width: "100%", height: 120, resizeMode: "contain" },
  expireTitle: { fontSize: 18, fontWeight: "700", textAlign: "center", marginTop: 6 },
  expireSubtitle: { textAlign: "center", color: "#777", marginTop: 4 },

  chooseTitle: { fontSize: 18, fontWeight: "700", marginTop: 20, textAlign: "center" },
  chooseSubText: { color: "#777", textAlign: "center", marginBottom: 18 },

  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#E8EDFF",
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
});
