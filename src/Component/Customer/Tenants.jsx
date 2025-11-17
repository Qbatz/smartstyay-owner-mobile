import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Profile from "../../Assets/Images/profile.png";
import EditPin from "../../Assets/Images/EditPin.png";
import SearchIcon from "../../Assets/Images/Asset_search.png";
import InProfile from "../../Assets/Images/inActiveuser.png";
import ActiveCheckout from "../../Assets/Images/ActiveCheckout.png";
import CheckoutIcon from "../../Assets/Images/checkout.png";
import ActiveWalkin from "../../Assets/Images/ActiveWalkin.png";
import WalkinIcon from "../../Assets/Images/walkin.png";
import TenAntAdd from "../../Assets/Images/TenantAdd.png";
import Dots from "../../Assets/Images/3dots.png";


export default function TenantsScreen() {
  const [activeTab, setActiveTab] = useState("Tenants");
  const navigation = useNavigation();
  
  const tabs = [
    { key: "Tenants", active: InProfile, inactive: Profile },
    { key: "Checkout", active: ActiveCheckout, inactive: CheckoutIcon },
    { key: "Walkin", active: ActiveWalkin, inactive: WalkinIcon },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <Image source={SearchIcon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Customers"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      
      <View style={styles.tabContainer}>
  {tabs.map((tab) => (
    <TouchableOpacity
      key={tab.key}
      style={[styles.tab, activeTab === tab.key && styles.activeTab]}
      onPress={() => setActiveTab(tab.key)}
    >
      <View style={styles.tabContent}>
        <Image
          source={activeTab === tab.key ? tab.active : tab.inactive}
          style={styles.tabIcon}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === tab.key && styles.activeText,
          ]}
        >
          {tab.key}
        </Text>
      </View>
    </TouchableOpacity>
  ))}
</View>

 {activeTab === "Tenants" && (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>This Month</Text>

        <View style={styles.tenantRow}>
          <Image source={Profile} style={styles.profileImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Rajkumar M</Text>
            <View style={styles.detailRow}>
              <View style={styles.floorBadge}>
                <Text style={styles.floorText}>Ground Floor</Text>
              </View>
              <Image source={EditPin} style={styles.iconSmall} />
              <Text style={styles.detailText}>203</Text>
              <Image source={EditPin} style={styles.iconSmall} />
              <Text style={styles.detailText}>03</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            {/* <Text style={styles.dots}>⋯</Text> */}

             <Image
          source={Dots}
          style={{width:30,height:30,transform: [{ rotate: "90deg" }],}}
        />
            <Text style={styles.dateText}>01/06</Text>
            
          </View>
        </View>
      </ScrollView>

      {/* Floating Buttons only for Tenants */}
      <TouchableOpacity style={styles.editButton}>
        <Image source={EditPin} style={{ width: 60, height: 60 }} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton}  onPress={() => navigation.navigate("AddTenant")}>
        <Image source={TenAntAdd} style={{ width: 60, height: 60 }} />
      </TouchableOpacity>
    </View>
  )}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical:50
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderRadius: 40,
    paddingHorizontal: 12,
    marginTop: 10,
    height: 55,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
tabContainer: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 14,
  borderBottomWidth: 1,
  borderBottomColor: "#E5E7EB",
  paddingBottom: 6,
},

tab: {
  alignItems: "center",
  paddingBottom: 6,
},

activeTab: {
  borderBottomWidth: 2,
  borderBottomColor: "#2D6CDF",
},

tabContent: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6, 
},

tabIcon: {
  width: 25,
  height: 25,
  resizeMode: "contain",
},

tabText: {
  fontSize: 16,
  color: "#6B7280",
},

activeText: {
  color: "#2D6CDF",
  fontWeight: "600",
},

  sectionTitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginVertical: 10,
  },
  tenantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  profileImg: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  floorBadge: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  floorText: {
    fontSize: 11,
    color: "#2D6CDF",
    fontWeight: "500",
  },
  iconSmall: {
    width: 13,
    height: 13,
    marginHorizontal: 3,
  },
  detailText: {
    fontSize: 12,
    color: "#4B5563",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 3,
  },
  dots: {
    fontSize: 22,
    color: "#6B7280",
  },
  addButton: {
    position: "absolute",
    right: 10,
    bottom: 50,
  },
   editButton: {
    position: "absolute",
    right: 10,
    bottom:110,
  },
});
