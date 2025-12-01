// PGPageFull.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Platform,
  ScrollView,
  BackHandler,
} from "react-native";
import AddFloorSheet from "./AddFloorSheet";
import AddFloorIcon from "../../Assets/Images/TenantAdd.png";
const EmptyFloor = require("../../Assets/Images/Empty_floor.png");
const AddIcon = require("../../Assets/Images/PGAddButton.png");
const BedEmpty = require("../../Assets/Images/EmptyBed.png");           
const BedGreen = require("../../Assets/Images/OccubiedBedImg.png");    

// Top icons
const IconCalendar = require("../../Assets/Images/Reservedbed.png");      
const IconRupee = require("../../Assets/Images/overdueImage.png");       
const IconNotice = require("../../Assets/Images/Noticeperiodimg.png");   

const initialFloors = [
  {
    id: "f1",
    name: "Floor 1",
    rooms: [
      {
        id: "r1",
        room_no: "001",
        sharing: "10 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "overdue" },
          { id: "b3", label: "C", status: "occupied" },
          { id: "b4", label: "D", status: "available" },
          { id: "b5", label: "E", status: "reserved" },
          { id: "b6", label: "E", status: "noticeperiod" },
        ],
      },
      {
        id: "r2",
        room_no: "002",
        sharing: "6 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "overdue" },
          { id: "b3", label: "C", status: "occupied" },
        ],
      },
      {
        id: "r3",
        room_no: "002",
        sharing: "6 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "overdue" },
          { id: "b3", label: "C", status: "occupied" },
        ],
      },
      
    ],
  },
  {
    id: "f2",
    name: "Floor 2",
    rooms: [
      {
        id: "r3",
        room_no: "101",
        sharing: "3 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "occupied" },
        ],
      },
    ],
  },
   {
    id: "f3",
    name: "Floor 1",
    rooms: [
      {
        id: "r1",
        room_no: "001",
        sharing: "10 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "overdue" },
          { id: "b3", label: "C", status: "occupied" },
          { id: "b4", label: "D", status: "available" },
          { id: "b5", label: "E", status: "reserved" },
          { id: "b6", label: "E", status: "noticeperiod" },
        ],
      },
      {
        id: "r2",
        room_no: "002",
        sharing: "6 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "overdue" },
          { id: "b3", label: "C", status: "occupied" },
        ],
      },
      {
        id: "r3",
        room_no: "002",
        sharing: "6 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "overdue" },
          { id: "b3", label: "C", status: "occupied" },
        ],
      },
      
    ],
  },
  {
    id: "f4",
    name: "Floor 2",
    rooms: [
      {
        id: "r3",
        room_no: "101",
        sharing: "3 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "occupied" },
        ],
      },
    ],
  },
   {
    id: "f5",
    name: "Floor 1",
    rooms: [
      {
        id: "r1",
        room_no: "001",
        sharing: "10 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "overdue" },
          { id: "b3", label: "C", status: "occupied" },
          { id: "b4", label: "D", status: "available" },
          { id: "b5", label: "E", status: "reserved" },
          { id: "b6", label: "E", status: "noticeperiod" },
        ],
      },
      {
        id: "r2",
        room_no: "002",
        sharing: "6 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "overdue" },
          { id: "b3", label: "C", status: "occupied" },
        ],
      },
      {
        id: "r3",
        room_no: "002",
        sharing: "6 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "overdue" },
          { id: "b3", label: "C", status: "occupied" },
        ],
      },
      
    ],
  },
  {
    id: "f6",
    name: "Floor 2",
    rooms: [
      {
        id: "r3",
        room_no: "101",
        sharing: "3 Sharing",
        beds: [
          { id: "b1", label: "A", status: "available" },
          { id: "b2", label: "B", status: "occupied" },
        ],
      },
    ],
  },
];

export default function PGPageFull({ route }) {
  const [floors, setFloors] = useState([]);
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [showAddFloor, setShowAddFloor] = useState(false);

  useEffect(() => {
    setFloors(initialFloors);
  }, []);

  useEffect(() => {
    if (route?.params?.setShowTabBar) {
      route.params.setShowTabBar(!showAddFloor);
    }
  }, [showAddFloor]);

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

  // BASE BED SELECTION
  const getBaseBed = (status) => {
    if (status === "available") return BedEmpty;
    if (status === "reserved") return BedEmpty;
    return BedGreen; // occupied, overdue, noticeperiod
  };

  // TOP ICON OVERLAY
  const overlayIcons = {
    reserved: IconCalendar,
    overdue: IconRupee,
    noticeperiod: IconNotice,
  };

  const handleAddFloor = (floorName) => {
    if (!floorName?.trim()) return;

    const newFloor = {
      id: `f${Date.now()}`,
      name: floorName,
      rooms: [],
    };

    const updated = [newFloor, ...floors];
    setFloors(updated);
    setActiveFloorIndex(0);
  };

  return (
    <View style={styles.container}>

      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Royal Grand Hostel</Text>
        <TouchableOpacity
          style={styles.floorButton}
          onPress={() => setShowAddFloor(true)}
        >
          <Text style={styles.floorButtonText}>+ Floor</Text>
        </TouchableOpacity>
      </View>

    
 
      <View style={{ paddingVertical: 12 }}>

        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
         
        </ScrollView>

      </View>
 
 <View style={{display:'flex', flexDirection:'row' , marginLeft:13}}>
 <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingLeft: 13, paddingRight: 20 }}
>
  {floors.map((f, i) => (
    <TouchableOpacity
      key={f.id}
      style={[
        styles.floorTab,
        activeFloorIndex === i && styles.floorTabActive,
      ]}
      onPress={() => setActiveFloorIndex(i)}
    >
      <View style={{ flexDirection: "column", alignItems: "center", gap: 8 }}>
        {/* Circle */}
        <View
          style={[
            styles.floorCircle,
            activeFloorIndex === i && styles.floorCircleActive,
          ]}
        >
          <Text
            style={[
              styles.circleText,
              activeFloorIndex === i && styles.circleTextActive,
            ]}
          >
            F
          </Text>
        </View>

        {/* Floor Name */}
        <Text
          style={[
            styles.floorLabel,
            activeFloorIndex === i && styles.floorLabelActive,
          ]}
        >
          {f.name}
        </Text>
      </View>
    </TouchableOpacity>
  ))}
</ScrollView>

          </View>
                    {
  floors.length === 0 &&
  <View style={styles.centerContainer}>
        <Image
          source={EmptyFloor}
          style={styles.image}
        />
        <Text style={styles.noFloorText}>No floors are there!</Text>

        <TouchableOpacity style={styles.addFloorBtn}  onPress={() => setShowAddFloor(true)}>
          <Text style={styles.addFloorText}>+ Add Floor</Text>
        </TouchableOpacity>
      </View>
}
      {/* ROOMS LIST */}
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
                <Image source={AddIcon} style={{ width: 22, height: 22 }} />
              </TouchableOpacity>
            </View>

            {/* BEDS */}
            <View style={styles.bedsRow}>
              {item.beds?.map((b) => (
                <View key={b.id} style={styles.bedItem}>
                  
                  {/* BASE BED */}
                  <Image
                    source={getBaseBed(b.status)}
                    style={styles.bedIcon}
                  />

                  {/* TOP ICON */}
                  {overlayIcons[b.status] && (
                    <Image
                      source={overlayIcons[b.status]}
                      style={styles.overlayIcon}
                    />
                  )}

                  <Text style={styles.bedLabel}>{b.label}</Text>
                </View>
              ))}
            </View>
              
          </View>
          
        )}
      />

     
      <AddFloorSheet
        visible={showAddFloor}
        onClose={() => setShowAddFloor(false)}
        onSave={(name) => {
          handleAddFloor(name);
          setShowAddFloor(false);
        }}
      />
      <TouchableOpacity
                      style={styles.addFab}
                      // onPress={() => setShowAddVendor(true)}
                    >
                      <Image source={AddFloorIcon} style={styles.addIcon} />
                    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 64,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: "center",
  },

  title: { fontSize: 20, fontWeight: "700" },

  floorButton: {
    backgroundColor: "#1E45E1",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  floorButtonText: { color: "#fff", fontWeight: "600" },

  floorTab: {
  paddingVertical: 8,
  paddingHorizontal: 10,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#eee",
  marginRight: 10,
  alignItems: "center",
  width: 80,
 
},

floorTabActive: {
  borderColor: "#1E45E1",
  backgroundColor: "#EAF0FF",
},

floorCircle: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: "#FFF5E6",   // cream
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 4,
},

floorCircleActive: {
  backgroundColor: "#1E45E1",
},

circleText: {
  color: "#333",
  fontSize: 14,
  fontWeight: "600",
},

circleTextActive: {
  color: "#fff",
},

floorLabel: {
  fontSize: 12,
  color: "#777",
},

floorLabelActive: {
  color: "#1E45E1",
  fontWeight: "700",
},


  roomCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F2F4F8",
  },

  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  roomTitle: { fontSize: 16, fontWeight: "700" },
  roomSubtitle: { fontSize: 12, color: "#888" },

  addRoomBtn: {
   
    padding: 8,
    borderRadius: 0,
  },

  bedsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },

  bedItem: {
    width: 60,
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },

  bedIcon: { width: 38, height: 35, marginBottom: 6 },

  overlayIcon: {
    width: 18,
    height: 18,
    position: "absolute",
    top: 0,
    right: 12,
  },

  bedLabel: { fontSize: 12 },
   centerContainer: {
    flex: 3,
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
   addFab: {
    position: "absolute",
    right: 20,
    bottom: 78,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",

  },
  addIcon: { width: 60, height: 60, },
});
