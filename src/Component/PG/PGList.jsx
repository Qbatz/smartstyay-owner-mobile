import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import EmptyFloor from "../../Assets/Images/Empty_floor.png"

export default function PGPage() {
  return (
    <View style={styles.container}>

      {/* ---------- TOP HEADER ---------- */}
      <View style={styles.header}>
        <Text style={styles.title}>Royal Grand Hostel</Text>

        <TouchableOpacity style={styles.floorButton}>
          <Text style={styles.floorButtonText}>+ Floor</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- EMPTY ILLUSTRATION ---------- */}
      <View style={styles.centerContainer}>
        <Image
          source={EmptyFloor}
          style={styles.image}
        />
        <Text style={styles.noFloorText}>No floors are there!</Text>

        <TouchableOpacity style={styles.addFloorBtn}>
          <Text style={styles.addFloorText}>+ Add Floor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  /* ---------- HEADER ---------- */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },

  floorButton: {
    backgroundColor: "#1E45E1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  floorButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },

  /* ---------- CENTER CONTENT ---------- */
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 250,
    height: 180,
    resizeMode: "contain",
    opacity: 0.9,
  },

  noFloorText: {
    fontSize: 16,
    color: "#777",
    marginTop: 10,
  },

  addFloorBtn: {
    marginTop: 20,
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },

  addFloorText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
