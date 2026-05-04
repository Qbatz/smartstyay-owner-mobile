import React,{useCallback} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView,BackHandler} from "react-native";
import Calendar from "../../../Assets/Images/calendar.png";
import { useFocusEffect } from '@react-navigation/native';
import StatusIcon from "../../../Assets/Images/StatusIcon.png";
import Arrow from "../../../Assets/Images/Arrow_left.png";
import crown from "../../../Assets/Images/crown.png";
import BillingIcon from "../../../Assets/Images/direct-right.png";
import ChecksIcon from "../../../Assets/Images/checks.png";
import { StatusBar, Platform } from "react-native";

export default function PlanDetailsScreen({ route, navigation }) {
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
  
  const { planId } = route.params;

  const isPremium = planId === 1;

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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" ,     paddingTop: Platform.OS === "android"
  ? StatusBar.currentHeight 
  : 40 ,}}>
      <ScrollView style={{  paddingHorizontal:16}}>

      
        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {/* <Text style={styles.backArrow}>←</Text> */}
             <Image source={Arrow} style={styles.backArrow}/>
          </TouchableOpacity>
          <Text style={styles.header}>Subscription plans</Text>
        </View>

      
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.planTitle}>{planData.title}</Text>

            <View style={styles.activeBadge}>
              <View style={styles.greenDot} />
              <Text style={styles.activeText}>Active</Text>
            </View>
          </View>

          <Text style={styles.price}>{planData.price}</Text>

          <TouchableOpacity style={styles.changeBtn}>
            <Text style={styles.changeBtnText}>Change Plan</Text>
          </TouchableOpacity>

        
          <View style={styles.infoRow}>
            <Image source={Calendar} style={styles.icon} />
            <View>
              <Text style={styles.infoLabel}>Renewal Date</Text>
              <Text style={styles.infoValue}>{planData.renewal}</Text>
            </View>
          </View>

       
          <View style={styles.infoRow}>
            <Image source={Calendar} style={styles.icon} />
            <View>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>{planData.method}</Text>
            </View>
          </View>

         
          <View style={styles.infoRow}>
            <Image source={StatusIcon} style={styles.icon} />
            <View>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.statusBlue}>{planData.status}</Text>
            </View>
          </View>
        </View>

      
        {!isPremium && (
          <View style={styles.upgradeCard}>

            <View style={styles.rowBetween}>
              <Text style={styles.planUpgradeTitle}>Upgrade to Premium Plan</Text>
              <Image
                source={crown}
                style={{ width: 20, height: 20 }}
              />
            </View>

       
            <View style={styles.featureRow}>
              <Image
                source={ChecksIcon}
                style={styles.tick}
              />
              <Text style={styles.featureText}>WhatsApp Integration</Text>
            </View>

            <View style={styles.featureRow}>
            <Image
                source={ChecksIcon}
                style={styles.tick}
              />
              <Text style={styles.featureText}>Digital KYC</Text>
            </View>

            <View style={styles.featureRow}>
                <Image
                source={ChecksIcon}
                style={styles.tick}
              />

              <Text style={styles.featureText}>Legal E-Sign</Text>
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.upgradePrice}>₹999 /month</Text>

              <TouchableOpacity style={styles.upgradeNowBtn}>
                <Text style={styles.upgradeNowText}>Upgrade Now</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}

       
        <Text style={styles.billingHeader}>Billing History</Text>

        {["0876", "1312", "0342"].map((item, idx) => (
          <View key={idx} style={styles.billCard}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={BillingIcon}
                style={styles.billIcon}
              />
              <View>
                <Text style={styles.billTitle}>Invoice {item}</Text>

                <View style={styles.premiumChip}>
                  <Text style={styles.premiumChipText}>{planData.billingTag}</Text>
                </View>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.billAmount}>₹ {isPremium ? "999" : "599"}</Text>
              <Text style={styles.billDate}>12 Nov 2025</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12,marginTop:20 },
  backArrow: {marginRight: 8 ,width:20,height:20},
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
    backgroundColor: "#D7FFD7",
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
    borderWidth: 1,
    borderColor: "#4A6CFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  planUpgradeTitle: { fontSize: 16, fontWeight: "700" },

  featureRow: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  tick: {height:16, width:16, marginRight:10},
  featureText: { fontSize: 14 },

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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
  },

  billIcon: { width: 34, height: 34, marginRight: 10 },
  billTitle: { fontSize: 14, fontWeight: "700" },

  premiumChip: {
    backgroundColor: "#FFE7C2",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },

  premiumChipText: { fontSize: 11, fontWeight: "700", color: "#A56A00" },

  billAmount: { fontSize: 16, fontWeight: "700" },
  billDate: { fontSize: 12, color: "#777" },
});

