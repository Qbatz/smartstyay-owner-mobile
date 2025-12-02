import React , {useEffect}from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,BackHandler ,
} from "react-native";

import HostelImg from "../../../Assets/Images/PgImg.png";
import PgRooms from "../../../Assets/Images/pgrooms.png";
import call from "../../../Assets/Images/call.png";
import sms from "../../../Assets/Images/sms.png";
import Building from "../../../Assets/Images/buildings.png";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";

export default function SettingsPG({ navigation }) {

   useEffect(() => {
                const backHandler = BackHandler.addEventListener(
                  "hardwareBackPress",
                  () => {
                    navigation.goBack();  
                    return true;
                  }
                );
              
                return () => backHandler.remove();
              }, [])


              const handleAddPG = () => {
                navigation.navigate("AddPG")
              }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {/* <Text style={styles.backArrow}>←</Text> */}
            <Image source={ArrowLeft} style={styles.backArrow}/>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage PG</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddPG}>
          <Text style={styles.addBtnText}>+ PG</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN PG CARD */}
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" , justifyContent:"space-between" }}>
            <View style={{display:'flex', flexDirection:"row"}}>
          <Image source={HostelImg} style={styles.hostelImg} />
          <View style={{marginLeft:10}}>
            <Text style={styles.hostelName}>Royal Grand Hostel</Text>
            <Text style={styles.badge}>Paying Guest</Text>
          </View>
          </View>
          <View>
              <Text style={styles.dots}>⋮</Text>
          </View>
         
        </View>

        {/* STATS */}
        <View style={styles.rowBox}>
          <View style={styles.col}>
            <Text style={styles.label}>Available Beds</Text>
            <Text style={styles.num}>210</Text>
      
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Total Rooms</Text>
            <Text style={styles.num}>45</Text>
          
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Occupied Beds</Text>
            <Text style={styles.num}>192</Text>
           
          </View>
        </View>

        {/* IMAGES */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[PgRooms, PgRooms, PgRooms, PgRooms].map((x, i) => (
            <Image key={i} source={x} style={styles.roomImg} />
          ))}
        </ScrollView>

        {/* CONTACT INFO */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.infoTitle}>Email ID</Text>
          <View style={styles.infoRow}>
            <Image source={sms} style={styles.infoIcon} />
            <Text style={styles.infoText}>rajkumar001@gmail.com</Text>
          </View>

          <Text style={styles.infoTitle}>Contact Number</Text>
          <View style={styles.infoRow}>
            <Image source={call} style={styles.infoIcon} />
            <Text style={styles.infoText}>+91 98765 43210</Text>
          </View>

          <Text style={styles.infoTitle}>Address</Text>
          <View style={styles.infoRow}>
            <Image source={Building} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              203, E block, Nivas Nagar, Chennai 2145602
            </Text>
          </View>
        </View>
      </View>

      {/* OTHER HOSTELS */}
      <Text style={styles.sectionTitle}>Other Hostels</Text>

      <View style={styles.otherCard}>
        <Image source={HostelImg} style={styles.otherImg} />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.otherName}>SS Men's Hostel</Text>
          <Text style={styles.otherBadge}>PG - Dormitory</Text>
        </View>

        <Text style={styles.dots}>⋮</Text>
      </View>

      <View style={styles.otherCard}>
        <Image source={HostelImg} style={styles.otherImg} />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.otherName}>Annai Hostel</Text>
          <Text style={styles.otherBadge}>PG - Dormitory</Text>
        </View>

        <Text style={styles.dots}>⋮</Text>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

/* ====================  STYLES  ===================== */

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  backArrow: {
   height:22 , width:22 , marginRight:10
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  addBtn: {
    backgroundColor: "#2D6CDF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  addBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  /* PG Card */
  card: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EAEFFC",
  },

  hostelImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  hostelName: {
    fontSize: 18,
    fontWeight: "700",
  },

  badge: {
    backgroundColor: "#F6EEDA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    marginTop: 4,
  },

  rowBox: {
    backgroundColor: "#F4F7FF",
    borderRadius: 12,
    flexDirection: "row",
    padding: 14,
    marginTop: 16,
  },

  col: { flex: 1, alignItems: "center" },

  num: {
    fontSize: 20,
    fontWeight: "700",
  },

  label: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },

  roomImg: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginTop: 14,
    borderRadius: 8,
  },

  infoTitle: {
    marginTop: 12,
    fontWeight: "700",
    fontSize: 14,
    color: "#000",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  infoIcon: {
    width: 17,
    height: 17,
    marginRight: 10,
  },

  infoText: {
    fontSize: 14,
    color: "black",
    fontWeight:600,
    flex: 1,
    lineHeight: 20,
  },

  /* OTHER HOSTELS */

  sectionTitle: {
    marginLeft: 18,
    marginTop: 6,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  otherCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    flexDirection: "row",
    alignItems: "center",
    marginTop:5
  },

  otherImg: {
    width: 52,
    height: 52,
    borderRadius: 10,
  },

  otherName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  otherBadge: {
    backgroundColor: "#FFF3CE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    color: "#A1761F",
    marginTop: 4,
    alignSelf: "flex-start",
    fontWeight: "600",
  },

  dots: {
    fontSize: 22,
    marginLeft: 10,
    color: "#4B5563",
    fontWeight: "700",
  },
});
