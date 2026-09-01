import React, { useContext } from "react";
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
import PeopleIcon from "../../../Assets/Images/peopleIcon.png"
import { CustomerContext } from "../../../Context/CustomerContext";

export default function ExpenseInfo({ expense }) {

   const { vendorList, getVendorList, deleteVendor } = useContext(CustomerContext);;
   console.log(vendorList)

   const vendorName= vendorList?.vendors?.find((item)=>item.id == expense?.vendorId)?.fullName

   console.log(vendorName)
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <InfoItem
        label="Expenses Title"
        value={expense?.title || "N/A"} 
      />

      <InfoItem
        label="Category"
        value={expense?.categoryName || "N/A"}
        icon={CategoryIcon}
      />


      <InfoItem
        label="sub catgeory"
        value={expense?.subCategoryName || "N/A"}
        icon={MobileIcon}
      />

       <InfoItem
        label="Vendor"
        value={ vendorName || "N/A"}
       icon={PeopleIcon}
      />

      <InfoItem
        label="Business Location/Address"
        value={ expense?.vendorAddress || "N/A"}
        icon={LocationIcon}
      />


     

      <InfoItem
        label="Description"
        value={expense?.note || "N/A"}
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

        <Text
          style={styles.value}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
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
  alignItems: "flex-start",
},

icon: {
  width: 18,
  height: 18,
  marginRight: 10,
  tintColor: "#64748B",
  marginTop: 2,
  flexShrink: 0,
},

value: {
  flex: 1,
  fontSize: 16,
  color: "#111827",
  fontFamily: "Gilroy-Medium",
  flexWrap: "wrap",
},
});