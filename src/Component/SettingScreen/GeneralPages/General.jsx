import React,{useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable
} from "react-native";
import Dots from "../../../Assets/Images/3dots.png";
import Sms from "../../../Assets/Images/sms.png";
import Call from "../../../Assets/Images/call.png";
import Buildings from "../../../Assets/Images/buildings.png";
import Edit from "../../../Assets/Images/editIcon.png";
import Delete from "../../../Assets/Images/trash.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";

export default function GeneralDetailsScreen({ navigation }) {
const [activeMenu, setActiveMenu] = useState(null);

  const users = [
    {
      name: "Rajkumar M",
      email: "rajkumar001a@gmail.com",
      phone: "+91 98765 43210",
      address: "203, E block, Nivas Nagar, Chennai 2145602",
      image: require("../../../Assets/Images/profile.png"),
      id:"1"
    },
    {
      name: "Muthu Raja S",
      email: "muthuraja002@gmail.com",
      phone: "+91 98765 43210",
      address: "203, E block, Nivas Nagar, Chennai 2145602",
      image: require("../../../Assets/Images/profile.png"),
      id:"2"
    },
    
  ];

  const renderUserCard = (u, index) => (
   <View key={u.id} style={styles.card}>

  <View style={styles.cardHeader}>
    <Image source={u.image} style={styles.profileImage} />

    <View style={{ flex: 1 }}>
      <Text style={styles.userName}>{u.name}</Text>
      <TouchableOpacity>
        <Text style={styles.changePassword}>Change Password</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity onPress={() => setActiveMenu(activeMenu === u.id ? null : u.id)}>
      <Image
        source={Dots}
        style={styles.dotsIcon}
      />
    </TouchableOpacity>
  </View>

  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Contact Details</Text>
    <View style={styles.infoRow}>
      <Image source={Sms} style={styles.infoIcon}/>
      <Text style={styles.infoText}>{u.email}</Text>
    </View>

    <View style={styles.infoRow}>
      <Image source={Call} style={styles.infoIcon}/>
      <Text style={styles.infoText}>{u.phone}</Text>
    </View>

    <View style={styles.infoRow}>
      <Image source={Buildings} style={styles.infoIcon}/>
      <Text style={styles.infoText}>{u.address}</Text>
    </View>
  </View>


  {activeMenu === u.id && (
    <View style={styles.menuBox}>
     
      <TouchableOpacity 
  style={styles.menuRow} 
  onPress={() => {
    setActiveMenu(null);
    navigation.navigate("AddGeneralScreen", { editData: u });
  }}
>
  <Image
    source={Edit}
    style={styles.menuIcon}
  />
  <Text style={styles.menuText}>Edit</Text>
</TouchableOpacity>


      <TouchableOpacity style={styles.menuRow}>
        <Image
          source={Delete}
          style={[styles.menuIcon, { tintColor: "red" }]}
        />
        <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  )}

</View>

    
  );

  return (
<Pressable style={{ flex: 1 }} onPress={() => setActiveMenu(null)}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={ArrowLeft}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>General</Text>

        <TouchableOpacity style={styles.masterButton}  onPress={() => navigation.navigate("AddGeneralScreen")}>
          <Text style={styles.masterText}>+ Master</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
        {users.map((u, index) => renderUserCard(u, index))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
    </Pressable>
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
  position: "relative",  
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
