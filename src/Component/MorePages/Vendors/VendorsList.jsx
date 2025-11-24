import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Platform,
} from "react-native";

import SearchIcon from "../../../Assets/Images/Asset_search.png";
import AvatarPlaceholder from "../../../Assets/Images/Avatar.png";
import DotsIcon from "../../../Assets/Images/3dots.png";
import FilterIcon from "../../../Assets/Images/EditPin.png";
import AddIcon from "../../../Assets/Images/TenantAddBlue.png";
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import AddVendorSheet from "./AddVendor"

export default function VendorsList({ navigation }) {
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const vendors = [
    {
      id: "1",
      name: "Ram Kumar M",
      company: "S3 Remotica Technologies",
      email: "ramkumar@gmail.com",
      contact: "+91 98732 16540",
      address: "No 17, Church Street, Bangalore, Karnataka, India. 568974",
      avatar: AvatarPlaceholder,
    },
    {
      id: "2",
      name: "Priya Raghuraman",
      company: "ABC Technologies",
      email: "priyaraghu@gmail.com",
      contact: "+91 98732 16540",
      address: "No 17, Church Street, Bangalore, Karnataka, India. 568974",
      avatar: AvatarPlaceholder,
    },

  ];

  const renderVendor = ({ item }) => (
    <>
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.leftRow}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.vendorName}>{item.name}</Text>
              <View style={styles.companyBadge}>
                <Text style={styles.companyText}>{item.company}</Text>
              </View>
            </View>
          </View>

         <TouchableOpacity
  style={styles.dotsTouchable}
  onPress={() =>
    setActiveMenu(activeMenu === item.id ? null : item.id)
  }
>
  <Image source={DotsIcon} style={styles.dotsIcon} />
</TouchableOpacity>

        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Mail ID</Text>
            <Text style={styles.infoValue}>{item.email}</Text>
          </View>
          <View style={[styles.infoCol, { alignItems: "flex-end" }]}>
            <Text style={styles.infoLabel}>Contact</Text>
            <Text style={styles.infoValue}>{item.contact}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, { marginTop: 10 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={[styles.infoValue, { marginTop: 6 }]} numberOfLines={2}>
              {item.address}
            </Text>
          </View>
        </View>
      </View>
           {activeMenu === item.id && (
  <View style={styles.menuBox}>
    <TouchableOpacity style={styles.menuRow}>
      <Image
        source={require("../../../Assets/Images/editIcon.png")}
        style={styles.menuIcon}
      />
      <Text style={styles.menuText}>Edit</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.menuRow}>
      <Image
        source={require("../../../Assets/Images/trash.png")}
        style={styles.menuIcon}
      />
      <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
    </TouchableOpacity>
  </View>
)}

    </>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack?.()}>
            <Image source={BackIcon} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vendors</Text>
        </View>

        <View style={styles.searchWrapper}>
          <Image source={SearchIcon} style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        <FlatList
          data={vendors}
          keyExtractor={(i) => i.id}
          renderItem={renderVendor}
          contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
        />


        <TouchableOpacity style={styles.filterFab} onPress={() => {/* open filter */ }}>
          <Image source={FilterIcon} style={styles.filterIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addFab}
          onPress={() => setShowAddVendor(true)}
        >
          <Image source={AddIcon} style={styles.addIcon} />
        </TouchableOpacity>
      </View>

 

      {showAddVendor && (
        <AddVendorSheet onClose={() => setShowAddVendor(false)} />
      )}
    </>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backArrow: { width: 22, height: 22 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111" },

  searchWrapper: {
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { width: 18, height: 18, tintColor: "#9CA3AF" },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 14, color: "#111" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  leftRow: { flexDirection: "row", alignItems: "center", flex: 1 },

  avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: "#fff" },

  vendorName: { fontSize: 16, fontWeight: "700", color: "#111" },
  companyBadge: {
    marginTop: 6,
    backgroundColor: "#FFF6E6",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  companyText: { color: "#A47E00", fontSize: 12, fontWeight: "600" },

  dotsTouchable: { padding: 6, marginLeft: 8 },
  dotsIcon: { width: 20, height: 20, tintColor: "#9CA3AF" },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  infoCol: { flex: 1 },
  infoLabel: { color: "#9CA3AF", fontSize: 12 },
  infoValue: { color: "#111", fontSize: 14, marginTop: 6 },

  // FABs
  filterFab: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 48,
    height: 48,
    borderRadius: 24,

    borderWidth: 1,
    borderColor: "#E6E6E6",
    justifyContent: "center",
    alignItems: "center",

  },
  filterIcon: { width: 60, height: 60 },

  addFab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,

    justifyContent: "center",
    alignItems: "center",

  },
  addIcon: { width: 60, height: 60, },
  menuBox: {
  position: "absolute",
  top: 40,
  right: 10,
  backgroundColor: "#fff",
  padding: 12,
  width: 150,
  borderRadius: 10,
  elevation: 8,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  borderWidth: 1,
  borderColor: "#F0F0F0",
  zIndex: 999,
},

menuRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 8,
},

menuIcon: {
  width: 18,
  height: 18,
  marginRight: 10,
},

menuText: {
  fontSize: 14,
  fontWeight: "600",
  color: "#000",
},

});
