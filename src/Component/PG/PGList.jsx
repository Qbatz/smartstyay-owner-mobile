// PGPageFull.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Animated,
  PanResponder,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
} from "react-native";
import AddFloorSheet from './AddFloorSheet'

/*
  Replace these with your actual image imports
*/
const EmptyFloor = require("../../Assets/Images/Empty_floor.png");
const AddIcon = require("../../Assets/Images/Empty_floor.png");
const BedAvailable = require("../../Assets/Images/Empty_floor.png"); // placeholder
const BedOccupied = require("../../Assets/Images/Empty_floor.png");
const BedReserved = require("../../Assets/Images/Empty_floor.png");
const BedOverdue = require("../../Assets/Images/Empty_floor.png");

/*
  SAMPLE DATA — replace with API response
*/
const SAMPLE_FLOORS = [
  // {
  //   id: "f1",
  //   name: "Floor 1",
  //   rooms: [
  //     {
  //       id: "r1",
  //       room_no: "001",
  //       sharing: "10 Sharing",
  //       beds: [
  //         { id: "b1", label: "A", status: "available" },
  //         { id: "b2", label: "B", status: "overdue" },
  //         { id: "b3", label: "C", status: "occupied" },
  //         { id: "b4", label: "D", status: "available" },
  //         { id: "b5", label: "E", status: "reserved" },
  //       ],
  //     },
  //     {
  //       id: "r2",
  //       room_no: "002",
  //       sharing: "6 Sharing",
  //       beds: [
  //         { id: "b1", label: "A", status: "available" },
  //         { id: "b2", label: "B", status: "overdue" },
  //         { id: "b3", label: "C", status: "occupied" },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "f2",
  //   name: "Floor 2",
  //   rooms: [
  //     {
  //       id: "r3",
  //       room_no: "101",
  //       sharing: "3 Sharing",
  //       beds: [
  //         { id: "b1", label: "A", status: "available" },
  //         { id: "b2", label: "B", status: "available" },
  //       ],
  //     },
  //   ],
  // },
];

export default function PGPageFull({ route }) {
 
  const [floors, setFloors] = useState(SAMPLE_FLOORS);
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [showAddFloor, setShowAddFloor] = useState(false);

  useEffect(() => {
  
    if (route?.params?.setShowTabBar) {
      route.params.setShowTabBar(!showAddFloor);
    }
  }, [showAddFloor]);

  // BackHandler: if bottom sheet open, close it
  useEffect(() => {
    const onBack = () => {
      if (showAddFloor) {
        setShowAddFloor(false);
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [showAddFloor]);

  const bedIcons = {
    available: BedAvailable,
    occupied: BedOccupied,
    reserved: BedReserved,
    overdue: BedOverdue,
  };

  const handleAddFloor = (floorName) => {
    if (!floorName?.trim()) return;
    const newFloor = {
      id: `f${Date.now()}`,
      name: floorName,
      rooms: [],
    };
    setFloors((s) => [newFloor, ...s]);
    setActiveFloorIndex(0); // open newly added floor
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Royal Grand Hostel</Text>
        <TouchableOpacity
          style={styles.floorButton}
          onPress={() => setShowAddFloor(true)}
          accessibilityLabel="+ Floor"
        >
          <Text style={styles.floorButtonText}>+ Floor</Text>
        </TouchableOpacity>
      </View>

      {/* Floor Tabs */}
      <View style={{ paddingVertical: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {floors.map((f, i) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.floorTab, activeFloorIndex === i && styles.floorTabActive]}
              onPress={() => setActiveFloorIndex(i)}
            >
              <Text style={[styles.floorTabText, activeFloorIndex === i && styles.floorTabTextActive]}>
                {f.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* If no floors show empty illustration */}
      {floors.length === 0 ? (
        <View style={styles.centerContainer}>
          <Image source={EmptyFloor} style={styles.image} />
          <Text style={styles.noFloorText}>No floors are there!</Text>
          <TouchableOpacity style={styles.addFloorBtn} onPress={() => setShowAddFloor(true)}>
            <Text style={styles.addFloorText}>+ Add Floor</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Rooms list for active floor
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
          data={floors[activeFloorIndex]?.rooms || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.roomCard}>
              <View style={styles.roomHeader}>
                <View>
                  <Text style={styles.roomTitle}>Room No {item.room_no}</Text>
                  <Text style={styles.roomSubtitle}>{item.sharing}</Text>
                </View>

                <TouchableOpacity style={styles.addRoomBtn}>
                  <Image source={AddIcon} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
              </View>

              {/* Beds row: dynamic rendering */}
              <View style={styles.bedsRow}>
                {item.beds && item.beds.length > 0 ? (
                  item.beds.map((b) => (
                    <View key={b.id} style={styles.bedItem}>
                      <Image source={bedIcons[b.status] || BedAvailable} style={styles.bedIcon} />
                      <Text style={styles.bedLabel}>{b.label}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.noBedsRow}>
                    <Text style={{ color: "#777" }}>No Beds are there!</Text>
                  </View>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyRoomCard}>
              <Text style={{ color: "#666" }}>No rooms available on this floor.</Text>
              <TouchableOpacity style={styles.addRoomFloating}>
                <Image source={AddIcon} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

   
      <AddFloorSheet
     visible={showAddFloor}
        onClose={() => setShowAddFloor(false)}

        onSave={(name) => {
          handleAddFloor(name);
          setShowAddFloor(false);
        }}
      />
    </View>
  );
}

/* ---------- AddFloorSheet component (in-file) ---------- */

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: Platform.OS === "ios" ? 50 : 24 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: "700", marginLeft: 4 },
  floorButton: { backgroundColor: "#1E45E1", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  floorButtonText: { color: "#fff", fontWeight: "600" },

  floorTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#eee", marginRight: 10 },
  floorTabActive: { backgroundColor: "#EAF0FF", borderColor: "#1E45E1" },
  floorTabText: { color: "#333" },
  floorTabTextActive: { color: "#1E45E1", fontWeight: "700" },

  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 250, height: 180, resizeMode: "contain", opacity: 0.9 },
  noFloorText: { marginTop: 10, color: "#666" },
  addFloorBtn: { marginTop: 20, backgroundColor: "#1E45E1", paddingVertical: 12, paddingHorizontal: 28, borderRadius: 12 },
  addFloorText: { color: "#fff", fontWeight: "700" },

  roomCard: { backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 14, elevation: 2, borderWidth: 1, borderColor: "#F2F4F8" },
  roomHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  roomTitle: { fontSize: 16, fontWeight: "700" },
  roomSubtitle: { fontSize: 12, color: "#888" },
  addRoomBtn: { backgroundColor: "#F3F7FF", padding: 8, borderRadius: 8 },

  bedsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  bedItem: { width: 60, alignItems: "center", marginRight: 8, marginBottom: 8 },
  bedIcon: { width: 44, height: 34, marginBottom: 6, resizeMode: "contain" },
  bedLabel: { fontSize: 12, color: "#333" },

  noBedsRow: { paddingVertical: 18, alignItems: "center", justifyContent: "center" },

  emptyRoomCard: { height: 140, borderRadius: 12, borderWidth: 1, borderColor: "#eee", justifyContent: "center", alignItems: "center", position: "relative" },
  addRoomFloating: { position: "absolute", right: 16, bottom: 16, backgroundColor: "#1E45E1", width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});

/* ---------- Sheet styles ---------- */
const sheetStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  handle: { width: 50, height: 5, backgroundColor: "#E0E0E0", alignSelf: "center", borderRadius: 10, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  label: { color: "#444", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#E8E8E8", borderRadius: 10, padding: 12, marginBottom: 18 },
  addBtn: { backgroundColor: "#1E45E1", paddingVertical: 14, borderRadius: 12, marginBottom: Platform.OS === "ios" ? 30 : 12 },
  addBtnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
