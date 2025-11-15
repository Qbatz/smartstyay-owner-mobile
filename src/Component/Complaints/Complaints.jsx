import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";

export default function Complaints() {
  const complaintsData = [
    {
      id: "1",
      title: "AC Problem",
      user: "Rajeshkumar-204-A",
      time: "02 Hours ago",
      status: "Assign",
      statusColor: "#1D5DFF",
    },
    {
      id: "2",
      title: "Water Leakage, Power Issue",
      user: "Parthiban-203-C",
      time: "Yesterday",
      status: "Assign",
      statusColor: "#1D5DFF",
    },
    {
      id: "3",
      title: "Washing machine Problem",
      user: "Meeran-103-C",
      time: "03 Jun 2025",
      status: "Assign",
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.row}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.userIcon}
          />
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

      <FlatList
        data={complaintsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.filterBtn}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3524/3524659.png",
          }}
          style={{ width: 18, height: 18 }}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 100,
  },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#F3F3F3",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  searchIcon: { width: 18, height: 18, tintColor: "#888", marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15 },

  card: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 16, fontWeight: "600", color: "#000" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  userIcon: { width: 15, height: 15, tintColor: "#1D5DFF", marginRight: 6 },
  user: { color: "#555" },
  rightSection: { alignItems: "flex-end", justifyContent: "space-between" },
  time: { fontSize: 12, color: "#999" },
  status: { marginTop: 6, fontSize: 14, fontWeight: "600" },

  filterBtn: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
  addBtn: {
    position: "absolute",
    bottom: 35,
    right: 20,
    backgroundColor: "#1D5DFF",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  plus: { fontSize: 30, color: "#fff", marginTop: -3 },
});
