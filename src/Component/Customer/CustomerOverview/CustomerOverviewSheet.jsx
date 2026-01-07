import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import OverviewTab from "./OverviewTab";
import EBReadingTab from "./EBReadingTab";
import BillTab from "./BillTab";
import ComplaintsTab from "./ComplaintsTab";

import ProfileImg from "../../../Assets/Images/profile.png";
import Dots from "../../../Assets/Images/3dots.png";
import RoomIcon from "../../../Assets/Images/profile.png";
import BedIcon from "../../../Assets/Images/profile.png";

export default function CustomerOverviewScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Overview");

  const renderTab = () => {
    switch (activeTab) {
      case "EB Reading":
        return <EBReadingTab />;
      case "Bill":
        return <BillTab />;
      case "Complaints":
        return <ComplaintsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Profile</Text>
        <View style={styles.notificationDot} />
      </View>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <Image source={ProfileImg} style={styles.avatar} />

        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>Daniel Balaji M</Text>
            <Text style={styles.verified}>✔</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.floorBadge}>
              <Text style={styles.floorText}>Ground Floor</Text>
            </View>

            <Image source={RoomIcon} style={styles.icon} />
            <Text style={styles.metaText}>203</Text>

            <Image source={BedIcon} style={styles.icon} />
            <Text style={styles.metaText}>03</Text>
          </View>
        </View>

        <TouchableOpacity>
          <Image
            source={Dots}
            style={{ width: 22, height: 22, transform: [{ rotate: "90deg" }] }}
          />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabRow}>
        {["Overview", "EB Reading", "Bill", "Complaints"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabBtn}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
              {isActive && <View style={styles.activeLine} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {renderTab()}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  back: { fontSize: 22, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "600", flex: 1 },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },

  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    elevation: 3,
    marginBottom: 14,
    alignItems: "center",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "600" },
  verified: { color: "green", marginLeft: 6 },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  floorBadge: {
    backgroundColor: "#F1F5FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  floorText: { fontSize: 12, color: "#2563EB" },

  icon: { width: 16, height: 16, marginHorizontal: 4 },
  metaText: { fontSize: 12, color: "#444" },

  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },

  tabBtn: {
    marginRight: 20,
    paddingBottom: 8,
  },

  tabText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  activeTabText: {
    color: "#2563EB",
    fontWeight: "600",
  },

  activeLine: {
    height: 2,
    backgroundColor: "#2563EB",
    marginTop: 6,
    borderRadius: 10,
  },
});
