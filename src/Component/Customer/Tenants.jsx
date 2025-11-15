import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";


export default function Tenants() {
  const tenants = [
    {
      id: 1,
      name: "Rajkumar M",
      floor: "Ground Floor",
      room: "203",
      bed: "03",
      date: "01/06",
      avatar: require("../../Assets/Images/profile.png"),
      status: "active",
      month: "This Month",
    },
    {
      id: 2,
      name: "Ajmal Muhammed",
      floor: "Ground Floor",
      room: "203",
      bed: "03",
      date: "01/06",
      avatar: require("../../Assets/Images/profile.png"),
      status: "active",
      month: "This Month",
    },
    {
      id: 3,
      name: "Lokesh",
      room: "--",
      bed: "--",
      date: "01/06",
      avatar: require("../../Assets/Images/profile.png"),
      status: "inactive",
      month: "This Month",
    },
    {
      id: 4,
      name: "Ajay Kannan R",
      room: "--",
      bed: "--",
      date: "01/06/25",
      avatar: require("../../Assets/Images/profile.png"),
      status: "inactive",
      month: "May 2025",
    },
    {
      id: 5,
      name: "Francis Xavier",
      room: "203",
      bed: "03",
      date: "01/06/25",
      avatar: require("../../Assets/Images/profile.png"),
      status: "active",
      month: "May 2025",
    },
  ];

  const grouped = tenants.reduce((acc, item) => {
    (acc[item.month] = acc[item.month] || []).push(item);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        {/* <Ionicons name="search-outline" size={20} color="#6B7280" /> */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search Customers"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {[
          { label: "Tenants", icon: "people-outline" },
          { label: "Checkout", icon: "log-out-outline" },
          { label: "Walkin", icon: "walk-outline" },
        ].map((tab, index) => (
          <TouchableOpacity key={index} style={styles.tab}>
            {/* <Ionicons
              name={tab.icon}
              size={18}
              color={tab.label === "Tenants" ? "#3B82F6" : "#6B7280"}
            /> */}
            <Text
              style={[
                styles.tabText,
                tab.label === "Tenants" && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            {tab.label === "Tenants" && <View style={styles.activeBar} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tenants List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(grouped).map(([month, list]) => (
          <View key={month}>
            <Text style={styles.sectionTitle}>{month}</Text>
            {list.map((item) => (
              <View key={item.id} style={styles.row}>
                <View style={styles.avatarWrapper}>
                  <Image source={item.avatar} style={styles.avatar} />
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: item.status === "active" ? "#22C55E" : "#EF4444" },
                    ]}
                  />
                </View>

                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.floor && (
                    <View style={styles.floorTag}>
                      <Text style={styles.floorText}>{item.floor}</Text>
                    </View>
                  )}
                  <View style={styles.iconRow}>
                    {/* <Ionicons name="home-outline" size={16} color="#3B82F6" /> */}
                    <Text style={styles.iconText}>{item.room}</Text>
                    {/* <Ionicons
                      name="bed-outline"
                      size={16}
                      color="#3B82F6"
                      style={{ marginLeft: 8 }}
                    /> */}
                    <Text style={styles.iconText}>{item.bed}</Text>
                  </View>
                </View>

                <Text style={styles.date}>{item.date}</Text>
                {/* <Feather name="more-vertical" size={18} color="#6B7280" /> */}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Floating Buttons */}
      <TouchableOpacity style={styles.filterButton}>
        {/* <Ionicons name="options-outline" size={22} color="#3B82F6" /> */}
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton}>
        {/* <Ionicons name="add" size={26} color="#fff" /> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFF", padding: 12 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 6,
    color: "#111827",
  },

  tabRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  tab: { alignItems: "center", position: "relative" },
  tabText: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  activeTabText: { color: "#3B82F6", fontWeight: "600" },
  activeBar: {
    height: 2,
    backgroundColor: "#3B82F6",
    width: 20,
    borderRadius: 4,
    marginTop: 4,
  },

  sectionTitle: { fontSize: 13, fontWeight: "700", color: "#6B7280", marginTop: 10, marginBottom: 4 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 4,
    elevation: 1,
  },

  avatarWrapper: { position: "relative" },
  avatar: { width: 45, height: 45, borderRadius: 25 },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 2,
    right: 2,
  },

  info: { flex: 1, marginLeft: 10 },
  name: { fontSize: 14, fontWeight: "600", color: "#111827" },
  floorTag: {
    backgroundColor: "#F4EAD7",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  floorText: { fontSize: 10, color: "#8B5E34" },

  iconRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  iconText: { fontSize: 12, color: "#374151", marginLeft: 4 },

  date: { fontSize: 12, color: "#6B7280", marginRight: 6 },

  filterButton: {
    position: "absolute",
    right: 20,
    bottom: 100,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 30,
    elevation: 4,
  },

  addButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    backgroundColor: "#22C55E",
    padding: 16,
    borderRadius: 30,
    elevation: 4,
  },
});
