import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

export default function GeneralDetailsScreen({ navigation }) {
  const users = [
    {
      name: "Rajkumar M",
      email: "rajkumar001a@gmail.com",
      phone: "+91 98765 43210",
      address: "203, E block, Nivas Nagar, Chennai 2145602",
      image: require("../../Assets/Images/profile.png"),
    },
    {
      name: "Muthu Raja S",
      email: "muthuraja002@gmail.com",
      phone: "+91 98765 43210",
      address: "203, E block, Nivas Nagar, Chennai 2145602",
      image: require("../../Assets/Images/profile.png"),
    },
    
  ];

  const renderUserCard = (u, index) => (
    <View key={index} style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Image source={u.image} style={styles.profileImage} />

        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{u.name}</Text>

          <TouchableOpacity>
            <Text style={styles.changePassword}>Change Password</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require("../../Assets/Images/3dots.png")}
          style={styles.dotsIcon}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Details</Text>

        <View style={styles.infoRow}>
          <Image source={require("../../Assets/Images/sms.png")} style={styles.infoIcon} />
          <Text style={styles.infoText}>{u.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Image source={require("../../Assets/Images/call.png")} style={styles.infoIcon} />
          <Text style={styles.infoText}>{u.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Image source={require("../../Assets/Images/buildings.png")} style={styles.infoIcon} />
          <Text style={styles.infoText}>{u.address}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../Assets/Images/right_direction.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>General</Text>

        <TouchableOpacity style={styles.masterButton}>
          <Text style={styles.masterText}>+ Master</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
        {users.map((u, index) => renderUserCard(u, index))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16,paddingTop:30 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },

  backIcon: { width: 20, height: 20, tintColor: "#000" },

  headerTitle: {
    flex: 1,
    textAlign: "left",
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },

  masterButton: {
    backgroundColor: "#4466F2",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  masterText: { color: "#FFF", fontWeight: "600" },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 30,
    marginRight: 12,
  },

  userName: { fontSize: 17, fontWeight: "600", color: "#000" },

  changePassword: {
    color: "#4D77FF",
    fontSize: 13,
    marginTop: 2,
  },

  dotsIcon: { width: 18, height: 18 },

  section: { marginTop: 10 },

  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#666" },

  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },

  infoIcon: { width: 18, height: 18, marginRight: 8 },

  infoText: { fontSize: 14, color: "#333", flex: 1 },
});
