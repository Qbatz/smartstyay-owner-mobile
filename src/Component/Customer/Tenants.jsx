import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

export default function Tenants() {
  const dummyCustomers = [
    {
      id: "1",
      name: "Arun Kumar",
      email: "arun@mail.com",
      mobile: "+91 98765 43210",
      image: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: "2",
      name: "Priya S",
      email: "priya@mail.com",
      mobile: "+91 91234 56789",
      image: "https://i.pravatar.cc/100?img=2",
    },
    {
      id: "3",
      name: "Rahul D",
      email: "rahul@mail.com",
      mobile: "+91 99887 66554",
      image: "https://i.pravatar.cc/100?img=3",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.avatar} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.mobile}>{item.mobile}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Customers</Text>

      <FlatList
        data={dummyCustomers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#1A1A1A",
  },
  card: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  email: {
    fontSize: 13,
    color: "#666",
  },
  mobile: {
    fontSize: 13,
    color: "#888",
    marginTop: 3,
  },
});
