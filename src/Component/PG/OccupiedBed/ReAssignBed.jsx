import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import Profile from "../../../Assets/Images/profile.png";
import BedGreen from "../../../Assets/Images/OccubiedBedImg.png";
import BedEmpty from "../../../Assets/Images/EmptyBed.png";
import Tick from "../../../Assets/Images/tick.png";
import ConfirmReassignSheet from "./ReAssignBottomSheet";


export default function ReassignBedScreen({ route, navigation }) {
  const { tenant, floors } = route.params;
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedNewBed, setSelectedNewBed] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
console.log("tenant",tenant)
  const selectedDetails =
  selectedNewBed
    ? {
        roomNo: floors[selectedFloor].rooms.find(r => r.id === selectedNewBed.roomId)?.room_no,
        bedLabel: floors[selectedFloor].rooms
          .find(r => r.id === selectedNewBed.roomId)
          ?.beds.find(b => b.id === selectedNewBed.bedId)?.label,
        sharing: floors[selectedFloor].rooms.find(r => r.id === selectedNewBed.roomId)?.sharing
      }
    : null;


  return (
    <>
    <View style={styles.container}>

      {/* HEADER */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
        <Text style={styles.headerText}>← Re Assign Bed</Text>
      </TouchableOpacity>

      {/* PROFILE */}
      <View style={styles.profileRow}>
        <Image source={Profile} style={styles.profileImg} />
        <View>
          <Text style={styles.profileName}>Rajkumar M</Text>
          <Text style={styles.profileSub}>
            Ground Floor • {tenant.room?.room_no} • {tenant.bed?.label}
          </Text>
        </View>
      </View>

    <View>
      <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingLeft: 18, gap: 12 }}
  >
        {floors.map((f, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelectedFloor(i)}
            style={[
              styles.floorCard,
              selectedFloor === i && styles.floorCardActive
            ]}
          >
            <View
              style={[
                styles.floorCircle,
                selectedFloor === i && styles.floorCircleActive
              ]}
            >
              <Text
                style={[
                  styles.floorCircleText,
                  selectedFloor === i && styles.floorCircleTextActive
                ]}
              >
                F
              </Text>
            </View>
            <Text
              style={[
                styles.floorLabel,
                selectedFloor === i && styles.floorLabelActive
              ]}
            >
              {f.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
</View>
   
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={styles.availableDot} />
          <Text style={styles.legendText}>Available</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={styles.occupiedDot} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
      </View>

      {/* ROOMS */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 18 }}>
        {floors[selectedFloor].rooms.map((room) => (
          <View key={room.id} style={styles.roomCard}>

            <Text style={styles.roomTitle}>Room No {room.room_no}</Text>
            <Text style={styles.roomSub}>{room.sharing}</Text>

            <View style={styles.bedsRow}>
              {room.beds
                .filter((b) => b.status === "available") // ONLY AVAILABLE BEDS
                .map((b) => (
                  <TouchableOpacity
                    key={b.id}
                   onPress={() =>
  setSelectedNewBed({
    floorId: floors[selectedFloor].id,
    roomId: room.id,
    bedId: b.id,
  })
}

                    style={{ alignItems: "center" }}
                  >
                    {/* <Image
                      source={BedEmpty}
                      style={[
                        styles.bedImg,
                        selectedNewBed?.bed?.id === b.id && styles.bedSelected
                      ]}
                    /> */}
  {/* <Image
  source={BedEmpty}
  style={[
    styles.bedImg,
    selectedNewBed?.floorId === floors[selectedFloor].id &&
    selectedNewBed?.roomId === room.id &&
    selectedNewBed?.bedId === b.id
      ? styles.bedSelected
      : null
  ]}
/> */}
{/* <View style={{ position: "relative" }}>
  <Image
    source={BedEmpty}
    style={[
      styles.bedImg,
      selectedNewBed?.floorId === floors[selectedFloor].id &&
      selectedNewBed?.roomId === room.id &&
      selectedNewBed?.bedId === b.id
        ? styles.bedSelected
        : null
    ]}
  />


  {selectedNewBed?.floorId === floors[selectedFloor].id &&
  selectedNewBed?.roomId === room.id &&
  selectedNewBed?.bedId === b.id && (
    <View style={styles.tickBadge}>
     <Image source={Tick} style={styles.tickText}/>
    </View>
  )}
</View> */}
<View style={{ position: "relative", alignItems: "center" }}>
  <Image
    source={BedEmpty}
    style={styles.bedImg}
  />

  {selectedNewBed?.floorId === floors[selectedFloor].id &&
    selectedNewBed?.roomId === room.id &&
    selectedNewBed?.bedId === b.id && (
      <View style={styles.tickBadge}>
        <Image source={Tick} style={styles.tickText} />
      </View>
  )}
</View>




                    <Text>{b.label}</Text>
                  </TouchableOpacity>
                ))}
            </View>

          </View>
        ))}
      </ScrollView>

      {/* CONTINUE BUTTON */}
      {/* {selectedNewBed && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ConfirmReassign", { tenant, selectedNewBed })
          }
          style={styles.continueBtn}
        >
          <Text style={styles.continueText}>Continue →</Text>
        </TouchableOpacity>
      )} */}
      {/* FIXED BOTTOM BAR */}
{selectedNewBed && (
  <View style={styles.bottomBar}>
    
    {/* LEFT SIDE DETAILS */}
    <View>
      <Text style={styles.bottomLabel}>Bed No  |  {selectedDetails?.sharing}</Text>
      <Text style={styles.bottomValue}>
        {selectedDetails?.roomNo}, {selectedDetails?.bedLabel}
      </Text>
    </View>

    {/* RIGHT SIDE BUTTON */}
    {/* <TouchableOpacity
      style={styles.bottomButton}
      onPress={() =>
        navigation.navigate("ConfirmReassign", { tenant, selectedNewBed })
      }
    >
      <Text style={styles.bottomButtonText}>Continue →</Text>
    </TouchableOpacity> */}
     <TouchableOpacity
        //   onPress={() =>
        //     navigation.navigate("ConfirmReassign", { tenant, selectedNewBed })
        //   }
         onPress={() => setShowConfirm(true)}
          style={styles.continueBtn}
        >
          <Text style={styles.continueText}>Continue →</Text>
        </TouchableOpacity>

  </View>
)}

    </View>
<ConfirmReassignSheet
  visible={showConfirm}
  onClose={() => setShowConfirm(false)}
  current={{
    room: tenant.room?.room_no,
    bed: tenant.bed?.label,
  }}
  next={{
    floor: selectedFloor + 1 + " Floor",
    room: selectedNewBed?.roomId,
    bed: selectedNewBed?.bedId,
  }}
/>

</>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff",paddingBottom:25 ,paddingTop:20},

  headerBack: { padding: 20 },
  headerText: { fontSize: 16, fontWeight: "500" },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10
  },

  profileImg: { width: 50, height: 50, borderRadius: 25 },
  profileName: { fontSize: 18, fontWeight: "700" },
  profileSub: { color: "#777" },


 floorCard: {
  paddingVertical: 6,    
  paddingHorizontal: 10,
  borderRadius: 12,
  backgroundColor: "#F5F5F5",
  alignItems: "center",
  width: 85,              
  height: 85,             
  justifyContent: "center",
},

floorCardActive: {
  backgroundColor: "#EAF0FF",
  borderColor: "#1E45E1",
  borderWidth: 1
},


floorCircle: {
  width: 28,              // ↓ reduced
  height: 28,
  borderRadius: 14,
  backgroundColor: "#FFF5E6",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 4,
},

floorCircleActive: {
  backgroundColor: "#1E45E1",
},

floorCircleText: {
  fontSize: 13,           // ↓ smaller text
  fontWeight: "700",
  color: "#333",
},

floorCircleTextActive: {
  color: "#fff",
},

floorLabel: {
  fontSize: 11,           // ↓ smaller
  marginTop: 2,
  color: "#777",
},

floorLabelActive: {
  color: "#1E45E1",
  fontWeight: "700",
},

 

  /* LEGEND */
  legendRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginVertical: 15,
    gap: 20
  },

  legendItem: { flexDirection: "row", alignItems: "center" },
  availableDot: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: "#444",
    borderRadius: 7
  },

  occupiedDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#31A24C"
  },

  legendText: { marginLeft: 5, fontSize: 14 },

  /* ROOMS */
  roomCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EDEDED",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18
  },

  roomTitle: { fontSize: 16, fontWeight: "700" },
  roomSub: { color: "#777", fontSize: 12 },

  bedsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 12
  },

  bedImg: { width: 40, height: 38 },
 

  continueBtn: {
    backgroundColor: "#1E45E1",
    padding: 12,
    borderRadius: 12,
    margin: 20,
    alignItems: "center"
  },

  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  tickBadge: {
  position: "absolute",
  top: -6,
  right: -6,
  backgroundColor: "#1E45E1",
  width: 22,
  height: 22,
  borderRadius: 11,
  justifyContent: "center",
  alignItems: "center",
  elevation: 6
},

tickText: {
  width:10,
  height:10,
  resizeMode: "contain"
},
bottomBar: {
  position: "absolute",
  bottom: 20,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  elevation: 10,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 8,
},
bottomValue:{
color:"#1E45E1"
},



});
