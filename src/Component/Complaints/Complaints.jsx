import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Profile from "../../Assets/Images/Avatar.png";
import FilterIcon from "../../Assets/Images/filter.png";
import AddComplaint from "../../Assets/Images/add-circle.png";

import ComplaintDetails from "../Complaints/ViewCompliance";
import AssignBottomSheet from "../Complaints/AssignCompliance";
import CommentBottomSheet from "../Complaints/CommentBox";
import ChangeStatus from "../Complaints/ComplianceStatus";

export default function Complaints({ route }) {
  const navigation = useNavigation();

  // ---------- STATES ----------
  const [showSheet, setShowSheet] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [selectedUser, setSelectedUser] = useState("Select");
  const [selectedStatus, setSelectedStatus] = useState("Pending");

  const [showAssignSheet, setShowAssignSheet] = useState(false);
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [showStatusSheet, setShowStatusSheet] = useState(false);


  const complaintsData = [
    {
      id: "1",
      title: "AC Problem",
      user: "Rajeshkumar-204-A",
      time: "02 Hours ago",
      status: "+ Assign",
      statusColor: "#1D5DFF",
    },
    {
      id: "2",
      title: "Water Leakage, Power Issue",
      user: "Parthiban-203-C",
      time: "Yesterday",
      status: "+ Assign",
      statusColor: "#1D5DFF",
    },
    {
      id: "3",
      title: "Washing machine Problem",
      user: "Meeran-103-C",
      time: "03 Jun 2025",
      status: "+ Assign",
      statusColor: "#1D5DFF",
    },
    {
      id: "4",
      title: "Washing machine Problem",
      user: "Meeran-103-C",
      time: "04 Jun 2025",
      status: "Pending",
      statusColor: "#D17800",
    },
    {
      id: "5",
      title: "Power Issue",
      user: "Meeran-103-C",
      time: "04 Jun 2025",
      status: "Resolved",
      statusColor: "#2BAE66",
    },
  ];

  // ---------- ITEM RENDER ----------
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              setSelectedComplaint(item);
              setShowSheet(true);
            }}
          >
            <Image source={Profile} style={styles.userIcon} />
          </TouchableOpacity>

          <Text style={styles.user}>{item.user}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <Text style={styles.time}>{item.time}</Text>

        <TouchableOpacity>
          <Text style={[styles.status, { color: item.statusColor }]}>
            {item.status}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* Search Box */}
      <View style={styles.searchBox}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/622/622669.png",
          }}
          style={styles.searchIcon}
        />

        <TextInput
          placeholder="Search Complaints"
          placeholderTextColor="#A1A1A1"
          style={styles.searchInput}
        />
      </View>

      {/* Listing */}
      <FlatList
        data={complaintsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* FILTER BTN */}
      <TouchableOpacity style={styles.filterBtn}>
        <Image source={FilterIcon} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>

      {/* ADD BTN */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddComplaint")}
      >
        <Image source={AddComplaint} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>

      {/* --- VIEW COMPLIANCE SHEET (Child Component) --- */}
      <ComplaintDetails
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        complaint={selectedComplaint}
        onOpenAssignSheet={() => setShowAssignSheet(true)}
        onOpenCommentSheet={() => setShowCommentSheet(true)}
        onOpenStatusSheet={() => setShowStatusSheet(true)}
      />

      {/* Assign Sheet */}
      <AssignBottomSheet
        visible={showAssignSheet}
        onClose={() => setShowAssignSheet(false)}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onAssignDone={() => {
          setShowAssignSheet(false);
          setTimeout(() => {
            setShowSheet(true);
          }, 150);
        }}
      />

      {/* Comment Sheet */}
      <CommentBottomSheet
        visible={showCommentSheet}
        onClose={() => setShowCommentSheet(false)}
      />

      {/* Status Sheet */}
      <ChangeStatus
        visible={showStatusSheet}
        onClose={() => setShowStatusSheet(false)}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onStatusUpdate={() => setShowStatusSheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 40 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },

  searchIcon: { width: 20, height: 20, tintColor: "#9B9B9B", marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#000" },

  card: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: { fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  userIcon: { width: 20, height: 20, marginRight: 6 },
  user: { color: "#555" },

  rightSection: { alignItems: "flex-end", justifyContent: "space-between" },
  time: { fontSize: 12, color: "#999" },
  status: { marginTop: 6, fontSize: 14, fontWeight: "600" },

  filterBtn: {
    position: "absolute",
    bottom: 150,
    right: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },

  addBtn: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#1D5DFF",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
