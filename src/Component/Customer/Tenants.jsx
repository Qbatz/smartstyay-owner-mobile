import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

import Profile from "../../Assets/Images/profile.png";
import EditPin from "../../Assets/Images/EditPin.png";
import SearchIcon from "../../Assets/Images/Asset_search.png";
import InProfile from "../../Assets/Images/inActiveuser.png";
import ActiveCheckout from "../../Assets/Images/ActiveCheckout.png";
import ActiveWalkin from "../../Assets/Images/ActiveWalkin.png";
import CheckoutIcon from "../../Assets/Images/checkout.png";
import WalkinIcon from "../../Assets/Images/walkin.png";
import TenAntAdd from "../../Assets/Images/TenantAdd.png";

export default function Tenants() {
  const [activeTab, setActiveTab] = useState("Tenants");

  const tenants = [
    {
      id: 1,
      name: "Rajkumar M",
      floor: "Ground Floor",
      room: "203",
      bed: "03",
      date: "01/06",
      profile: Profile,
    },
    {
      id: 2,
      name: "Ajmal Muhammed",
      floor: "Ground Floor",
      room: "203",
      bed: "03",
      date: "01/06",
      profile: Profile,
    },
    {
      id: 3,
      name: "Lokesh",
      floor: "",
      room: "--",
      bed: "--",
      date: "",
      profile: InProfile,
    },
    {
      id: 4,
      name: "Ajay Kannan R",
      floor: "",
      room: "--",
      bed: "--",
      date: "01/06/25",
      profile: InProfile,
    },
  ];

  const checkouts = [
    { id: 1, name: "Karthik R", room: "105", date: "02/06/25" },
    { id: 2, name: "Sundar V", room: "205", date: "03/06/25" },
  ];

  const walkins = [
    { id: 1, name: "Mani R", date: "Today" },
    { id: 2, name: "Ashok P", date: "Yesterday" },
  ];

  // --- RENDER TAB BUTTONS ---
  const renderTab = (label, activeIcon, inactiveIcon) => (
    <TouchableOpacity
      key={label}
      onPress={() => setActiveTab(label)}
      style={styles.tabButton}
      activeOpacity={0.7}
    >
      <View style={styles.tabInner}>
        <Image
          source={activeTab === label ? activeIcon : inactiveIcon}
          style={styles.tabIcon}
        />
        <Text
          style={[
            styles.tabText,
            { color: activeTab === label ? "#2D4EF5" : "#9CA3AF" },
          ]}
        >
          {label}
        </Text>
      </View>
      {activeTab === label && <View style={styles.activeUnderline} />}
    </TouchableOpacity>
  );

  // --- RENDER TAB CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      case "Tenants":
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>This Month</Text>
            {tenants.map((item) => (
              <View key={item.id} style={styles.tenantCard}>
                <Image source={item.profile} style={styles.profileImg} />
                <View style={styles.tenantInfo}>
                  <Text style={styles.tenantName}>{item.name}</Text>
                  <View style={styles.tenantDetails}>
                    {item.floor ? (
                      <Text style={styles.floorText}>{item.floor}</Text>
                    ) : null}
                    <Image source={EditPin} style={styles.iconSmall} />
                    <Text style={styles.detailText}>{item.room}</Text>
                    <Text style={styles.detailText}>{item.bed}</Text>
                  </View>
                </View>
                {item.date ? (
                  <Text style={styles.dateText}>{item.date}</Text>
                ) : null}
              </View>
            ))}
          </ScrollView>
        );

      case "Checkout":
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Recent Checkouts</Text>
            {checkouts.map((item) => (
              <View key={item.id} style={styles.checkoutCard}>
                <Text style={styles.checkoutName}>{item.name}</Text>
                <Text style={styles.checkoutRoom}>Room {item.room}</Text>
                <Text style={styles.checkoutDate}>{item.date}</Text>
              </View>
            ))}
          </ScrollView>
        );

      case "Walkin":
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Recent Walk-ins</Text>
            {walkins.map((item) => (
              <View key={item.id} style={styles.walkinCard}>
                <Text style={styles.walkinName}>{item.name}</Text>
                <Text style={styles.walkinDate}>{item.date}</Text>
              </View>
            ))}
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchBar}>
        <Image source={SearchIcon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Customers"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* TAB BAR */}
      <View style={styles.tabContainer}>
        {renderTab("Tenants", Profile, InProfile)}
        {renderTab("Checkout", ActiveCheckout, CheckoutIcon)}
        {renderTab("Walkin", ActiveWalkin, WalkinIcon)}
      </View>

      {/* TAB CONTENT */}
      <View style={{ flex: 1 }}>{renderContent()}</View>

      {/* ADD BUTTON */}
      {activeTab === "Tenants" && (
        <TouchableOpacity style={styles.addButton}>
          <Image source={TenAntAdd} style={styles.addIcon} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginTop: 15,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#9CA3AF",
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#000",
    fontSize: 15,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabButton: {
    alignItems: "center",
    paddingBottom: 8,
  },
  tabInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeUnderline: {
    height: 2,
    width: "100%",
    backgroundColor: "#2D4EF5",
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 20,
    marginBottom: 10,
  },

  tenantCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  profileImg: {
    width: 45,
    height: 45,
    borderRadius: 30,
    marginRight: 10,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  tenantDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  floorText: {
    fontSize: 11,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  iconSmall: {
    width: 13,
    height: 13,
    tintColor: "#2D4EF5",
    marginHorizontal: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#111827",
    marginHorizontal: 2,
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  // Checkout
  checkoutCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  checkoutName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  checkoutRoom: {
    fontSize: 13,
    color: "#6B7280",
  },
  checkoutDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },

 
  walkinCard: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  walkinName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  walkinDate: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  addButton: {
    position: "absolute",
    bottom: 25,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  addIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
