import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";

import BackIcon from "../../../Assets/Images/Arrow_left.png";
import SearchIcon from "../../../Assets/Images/Asset_search.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";
import ProfileIcon from "../../../Assets/Images/profile.png";
import FilterIcon from "../../../Assets/Images/EditPin.png";
import TenantsList from "./TenantsList";


export default function Electricity({ navigation }) {
  const [activeTab, setActiveTab] = useState("Room Reading");
  const [underlineWidth, setUnderlineWidth] = useState(0);
   

  const tabs = [
    { key: "Room Reading" },
    { key: "Tenant Reading" },
  ];

  const dummy = [
    { room: "Room 001", floor: "Ground Floor", users: 3, amount: "1,500.00", month: "August" },
    { room: "Room 002", floor: "Ground Floor", users: 4, amount: "2,400.00", month: "August" },
    { room: "Room 003", floor: "Ground Floor", users: 2, amount: "1,400.00", month: "August" },
    { room: "Room 004", floor: "Ground Floor", users: 2, amount: "1,200.00", month: "August" },
    { room: "Room 005", floor: "Ground Floor", users: 4, amount: "1,450.00", month: "August" },
    
  ];

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Image source={SearchIcon} style={styles.searchIcon} />
          <TextInput
            placeholder="Search Electricity"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabsRow}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={styles.tabBtn}
            onPress={() => setActiveTab(t.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === t.key && styles.tabActive,
              ]}
              onLayout={(event) => {
                if (activeTab === t.key) {
                  setUnderlineWidth(event.nativeEvent.layout.width);
                }
              }}
            >
              {t.key}
            </Text>

            {activeTab === t.key && (
              <View style={[styles.tabUnderline, { width: underlineWidth }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>

     {activeTab === "Room Reading" &&
     <>
     <ScrollView showsVerticalScrollIndicator={false}>
        {dummy.map((item, index) => (
          <View key={index} style={styles.row}>

            {/* ICON */}
            <View style={styles.iconCircle}>
              <Image source={RoomIcon} style={styles.iconImg} />
            </View>

            {/* MIDDLE */}
            <View style={{ flex: 1 }}>
              {/* <Text style={styles.roomName}>{item.room}</Text> */}
              <TouchableOpacity onPress={() => navigation.navigate("RoomDetails", { roomData: item })}>
  <Text style={styles.roomName}>{item.room}</Text>
</TouchableOpacity>


              <View style={styles.subRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.floor}</Text>
                </View>

                <View style={styles.people}>
                  <Image source={ProfileIcon} style={styles.peopleIcon} />
                  <Text style={styles.peopleText}>{item.users}</Text>
                </View>
              </View>
            </View>

            {/* RIGHT */}
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.price}>₹ {item.amount}</Text>
              <Text style={styles.month}>{item.month}</Text>
            </View>

          </View>
        ))}
      </ScrollView>

      {/* Floating Filter Button */}
      <TouchableOpacity style={styles.fab}>
        <Image source={FilterIcon} style={styles.fabIcon} />
      </TouchableOpacity>
     </>
     }
      
  {activeTab === "Tenant Reading" &&
  <TenantsList/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15, marginTop: 40 },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backIcon: { width: 22, height: 22, marginRight: 10 },

  searchBox: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 50,
  },

  searchIcon: { width: 18, height: 18, tintColor: "#9CA3AF" },
  searchInput: { flex: 1, marginLeft: 8, color: "#000" },

  /* TABS */
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    marginBottom: 10,
  },

  tabBtn: { alignItems: "center" },

  tabText: {
    fontSize: 16,
    color: "#7A7A7A",
    fontWeight: "600",
  },

  tabActive: {
    color: "#1E45E1",
  },

  tabUnderline: {
    marginTop: 6,
    height: 3,
    backgroundColor: "#1E45E1",
    borderRadius: 10,
  },

  /* LIST ROW */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 50,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  iconImg: { width: 26, height: 26, tintColor: "#3F6AFF" },

  roomName: { fontSize: 16, fontWeight: "700", color: "#000" },

  subRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },

  tag: {
    backgroundColor: "#FFF4D7",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 12,
  },

  tagText: { fontSize: 12, fontWeight: "600", color: "#A47E00" },

  people: { flexDirection: "row", alignItems: "center" },
  peopleIcon: { width: 16, height: 16},
  peopleText: { marginLeft: 4, color: "#3D6AE8", fontWeight: "600" },

  price: { fontSize: 16, fontWeight: "700", color: "#000" },
  month: { color: "#6B7280", fontSize: 13, marginTop: 4 },

  fab: {
    position: "absolute",
    bottom: 85,
    right: 25,
    width: 55,
    height: 55,
    borderRadius: 30,
    
    justifyContent: "center",
    alignItems: "center",
   
  },

  fabIcon: { width: 60, height: 60 },
});
