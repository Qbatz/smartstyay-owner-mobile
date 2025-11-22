import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import BackIcon from "../../../Assets/Images/Arrow_left.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";
import ProfileIcon from "../../../Assets/Images/profile.png";
import FilterIcon from "../../../Assets/Images/EditPin.png";
import UserProfile from "../../../Assets/Images/profileElec.png";
import calendarCheck from "../../../Assets/Images/calendarcheck.png";
import Add from "../../../Assets/Images/ElectricityAdd.png";
import Dots from "../../../Assets/Images/3dots.png";

export default function RoomDetails({ navigation }) {
  const [activeTab, setActiveTab] = useState("Previous Reading");

  const readings = [
    { month: "July 2025", units: "250 Units", price: "2,500", date: "01 – 30 June" },
    { month: "June 2025", units: "270 Units", price: "2,700", date: "01 – 31 May" },
    { month: "May 2025", units: "120 Units", price: "1,200", date: "18 – 30 April" },
    { month: "May 2025", units: "160 Units", price: "1,600", date: "01 – 17 April" },
  ];

  const occupants = [
    { name: "Xavier Britto", bed: "03", units: "45 Units", price: "450", date: "16 – 30 Aug" },
    { name: "Ramesh", bed: "03", units: "45 Units", price: "450", date: "01 – 14 Aug" },
    { name: "Rajesh", bed: "02", units: "105 Units", price: "1,050", date: "01 – 30 Aug" },
  ];

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Room Overview</Text>
      </View>

      {/* Room Card */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.iconCircle}>
            <Image source={RoomIcon} style={styles.iconImg} />
          </View>

          <View>
            <Text style={styles.roomName}>Room 001</Text>
            <Text style={styles.floorText}>Ground Floor</Text>
          </View>

        <TouchableOpacity style={styles.addBtn}>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Image source={Add} style={styles.AddPeple} />
    <Text style={styles.addText}>Add</Text>
      
  </View>
</TouchableOpacity>
 <Image source={Dots} style={{width:25,height:25}} />

        </View>

        <View style={styles.detailsRow}>
          <View>
            <Text style={styles.label}>Previous</Text>
            <Text style={styles.value}>100</Text>
          </View>

          <View>
            <Text style={styles.label}>Current</Text>
            <Text style={styles.value}>400</Text>
          </View>

          <View>
            <Text style={styles.label}>Total Units</Text>
            <Text style={styles.value}>300</Text>
          </View>

         
        </View>
       <View style={styles.detailsRow}>
  
 


  {/* Middle : People Count + Month */}
  <View style={styles.middleBoxRow}>

    {/* People Count box */}
    <View style={styles.peopleBox}>
      <Image source={UserProfile} style={styles.peopleIcon} />
      <Text style={styles.peopleText}>3</Text>
    </View>

    {/* Month Box */}
    <View style={styles.monthBox}>
      <Image source={calendarCheck} style={styles.calendarIcon} />
      <Text style={styles.monthText}>Aug</Text>
    </View>

  </View>

 
  <View>
    <Text style={styles.value}>300</Text>
  </View>
</View>

      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab("Previous Reading")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "Previous Reading" && styles.activeTab,
            ]}
          >
            Previous Reading
          </Text>
          {activeTab === "Previous Reading" && <View style={styles.underline} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("Occupants")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "Occupants" && styles.activeTab,
            ]}
          >
            Occupants
          </Text>
          {activeTab === "Occupants" && <View style={styles.underline} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView>
        {activeTab === "Previous Reading" &&
          readings.map((item, index) => (
            <View key={index} style={styles.listRow}>
              <View style={styles.arrowCircle}>
                <Text style={{ color: "#3F6AFF" }}>➤</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.monthText}>{item.month}</Text>
                <View style={styles.unitTag}>
                  <Text style={styles.unitText}>{item.units}</Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.price}>₹ {item.price}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
          ))}

        {activeTab === "Occupants" &&
          occupants.map((item, index) => (
            <View key={index} style={styles.listRow}>
              <Image source={ProfileIcon} style={styles.avatar} />

              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={styles.name}>{item.name}</Text>

                <View style={styles.occRow}>
                  <Image source={RoomIcon} style={styles.smallIcon} />
                  <Text style={styles.bedText}>{item.bed}</Text>

                  <View style={styles.unitTag2}>
                    <Text style={styles.unitText2}>{item.units}</Text>
                  </View>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.price}>₹ {item.price}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
          ))}
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab}>
        <Image source={FilterIcon} style={styles.fabIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15, marginTop: 40 },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backIcon: { width: 22, height: 22, marginRight: 10 },
  title: { fontSize: 18, fontWeight: "700" },

  card: {
    backgroundColor: "#F8F9FF",
    padding: 15,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardRow: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: "#E9F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconImg: { width: 26, height: 26, tintColor: "#3F6AFF" },

  roomName: { fontSize: 16, fontWeight: "700" },
  floorText: { fontSize: 12, color: "#666", marginTop: 4 },

  addBtn: {
    backgroundColor: "#E4E4E4",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: "auto",
  },
  addText: { color: "#4B4B4B", fontWeight: "600" },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  label: { fontSize: 12, color: "#6B7280" },
  value: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  amount: { fontSize: 18, fontWeight: "700", color: "#000" },

  /* Tabs */
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tabText: { fontSize: 15, color: "#777" },
  activeTab: { color: "#1E45E1", fontWeight: "700" },
  underline: {
    height: 3,
    backgroundColor: "#1E45E1",
    marginTop: 6,
    borderRadius: 10,
  },

  /* List */
  listRow: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#EBF3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  monthText: { fontSize: 15, fontWeight: "700" },
  unitTag: {
    backgroundColor: "#FFF4D7",
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  unitText: { fontSize: 11, color: "#A47E00", fontWeight: "600" },

  price: { fontSize: 16, fontWeight: "700", color: "#000" },
  date: { fontSize: 12, color: "#6B7280", marginTop: 5 },

  avatar: { width: 42, height: 42, borderRadius: 25 },

  occRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  smallIcon: { width: 16, height: 16, tintColor: "#3F6AFF" },
  bedText: { marginLeft: 4, marginRight: 10, fontWeight: "600" },

  unitTag2: {
    backgroundColor: "#FFF4D7",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  unitText2: { color: "#A47E00", fontSize: 11 },

  fab: {
    position: "absolute",
    bottom: 40,
    right: 25,
  },
  fabIcon: { width: 60, height: 60 },
  middleBoxRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},

peopleBox: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFF3D6",
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 10,
},

peopleIcon: {
  width: 16,
  height: 16,
  marginRight: 6,
},
AddPeple:{
 width: 12,
  height: 12,
  marginRight: 8,
},

peopleText: {
  fontSize: 14,
  color: "#8A5A00",
  fontWeight: "600",
},

monthBox: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#E9EDFF",
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 10,
},

calendarIcon: {
  width: 16,
  height: 16,
  marginRight: 6,
  tintColor: "#1E45E1",
},



});
