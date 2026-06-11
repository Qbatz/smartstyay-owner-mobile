import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";

import CategoryIcon from "../../../Assets/Images/Category.png";
import CallIcon from "../../../Assets/Images/call.png";
import LocationIcon from "../../../Assets/Images/LocationIcon.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import MobileIcon from "../../../Assets/Images/mobile.png";

export default function VendorInfo({ vendor }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <InfoItem
        label="Vendor Name"
        value={`${vendor?.firstName || ""} ${vendor?.lastName || ""}`}
      />

      <InfoItem
        label="Category"
        value={vendor?.businessName || "Electrical"}
        icon={CategoryIcon}
      />

      <InfoItem
        label="Mobile No"
        value={`+91 ${vendor?.mobileNo || ""}`}
        icon={MobileIcon}
      />

      <InfoItem
        label="Business Location/Address"
        value={`${vendor?.area || ""}, ${vendor?.city || ""}`}
        icon={LocationIcon}
      />

      <InfoItem
        label="Last Transaction"
        value="18 July 2025"
        icon={CalendarIcon}
      />

      <InfoItem
        label="Credit Limit"
        value="₹ 15,000.00"
        icon={CalendarIcon}
      />
    </ScrollView>
  );
}

const InfoItem = ({ label, value, icon }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>

    {icon ? (
      <View style={styles.valueRow}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.value}>{value}</Text>
      </View>
    ) : (
      <Text style={styles.value}>{value}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },

  item: {
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Gilroy-Medium",
    marginBottom: 8,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 18,
    height: 18,
    marginRight: 10,
    tintColor: "#64748B",
  },

  value: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Gilroy-Medium",
  },
});