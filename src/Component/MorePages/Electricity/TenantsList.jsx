// TenantsList.js
import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import ProfileIcon from "../../../Assets/Images/profile.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";

export default function TenantsList() {
  const tenants = [
    { name: "Arun Kumar R", floor: "Ground Floor", room: "003", bed: "03", amount: "330", month: "August" },
    { name: "Alex", floor: "First Floor", room: "103", bed: "01", amount: "330", month: "August" },
    { name: "Ashok Kumar", floor: "Ground Floor", room: "005", bed: "01", amount: "340", month: "August" },
    { name: "Bala Chandran", floor: "Second Floor", room: "005", bed: "01", amount: "340", month: "August" },
    { name: "David", floor: "Ground Floor", room: "002", bed: "02", amount: "420", month: "August" },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {tenants.map((item, index) => (
        <View key={index} style={styles.row}>
          
          {/* Profile Image */}
          <Image source={ProfileIcon} style={styles.profileImg} />

          {/* Middle Content */}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>

            <View style={styles.inline}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.floor}</Text>
              </View>

              <View style={styles.inline}>
                <Image source={RoomIcon} style={styles.icon} />
                <Text style={styles.value}>{item.room}</Text>
              </View>

              <View style={styles.inline}>
                <Image source={RoomIcon} style={styles.icon} />
                <Text style={styles.value}>{item.bed}</Text>
              </View>
            </View>
          </View>

          {/* Right Price */}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.amount}>₹ {item.amount}</Text>
            <Text style={styles.month}>{item.month}</Text>
          </View>

        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  profileImg: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },

  name: { fontSize: 16, fontWeight: "700", color: "#000" },

  inline: { flexDirection: "row", alignItems: "center", marginTop: 4 },

  tag: {
    backgroundColor: "#FFF4D7",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
  },

  tagText: {
    color: "#A47E00",
    fontSize: 12,
    fontWeight: "600",
  },

  icon: { width: 16, height: 16, tintColor: "#3D6AE8", marginRight: 4 },

  value: { color: "#3D6AE8", fontWeight: "600", marginRight: 10 },

  amount: { fontSize: 16, fontWeight: "700", color: "#000" },
  month: { fontSize: 13, color: "#555", marginTop: 3 },
});
