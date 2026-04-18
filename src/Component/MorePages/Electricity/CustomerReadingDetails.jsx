import React, { useState,useEffect,useRef , useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,BackHandler
} from "react-native";
import {ElectricityContext} from "../../../Context/ElectricityContext";
import { CommonContexts } from "../../../Context/CommonContext";
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";
import BedIcon from "../../../Assets/Images/Bed_Icon.png"
import ProfileIcon from "../../../Assets/Images/profile.png";
import calendarCheck from "../../../Assets/Images/calendarcheck.png";
import UserProfile from "../../../Assets/Images/profileElec.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

export default function CustomerReading({ route, navigation }) {

    const { activeHostelId } = useContext(CommonContexts);
    const { EbRoomReading , 
              EbTenantReading,
              loading,
              error, 
              errorMsg,
              GetEBRoomReading,
              GetEBTenantReading , ParticularRoomReadingDetails , particular_EbRoomReading , particular_EbTenantReading } = useContext(ElectricityContext);
  
       console.log("particular_EbRoomReading", particular_EbTenantReading);

  const { tenant } = route.params;
  console.log("tenant", tenant);

  const [readings , setReadings] = useState([])

    useEffect(()=> {
      if(particular_EbTenantReading?.electricityHistory?.length> 0){
        setReadings(particular_EbTenantReading?.electricityHistory)
      }
    },[particular_EbTenantReading])
  


  

     useEffect(() => {
                const backHandler = BackHandler.addEventListener(
                  "hardwareBackPress",
                  () => {
                    navigation.goBack();  
                    return true;
                  }
                );
              
                return () => backHandler.remove();
              }, []);

             const formatApiMonth = (date) => {
  if (!date || date === "N/A") return "--";

  return dayjs(date, ["DD/MM/YYYY", "D/MM/YYYY", "DD-MM-YYYY"])
    .format("MMMM YYYY");
};

const formatDateRange = (start, end) => {
  if (!start || !end) return "--";

  const startDate = dayjs(start, ["DD/MM/YYYY", "D/MM/YYYY"]);
  const endDate = dayjs(end, ["DD/MM/YYYY", "D/MM/YYYY"]);

  // Same month & year
  if (startDate.month() === endDate.month() && startDate.year() === endDate.year()) {
    return `${startDate.format("DD")} - ${endDate.format("DD")} ${endDate.format("MMMM")}`;
  }

  // Different month
  return `${startDate.format("DD MMM")} - ${endDate.format("DD MMM")}`;
};

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EB Bill Overview</Text>
      </View>

      {/* TOP CARD */}
      <View style={styles.card}>
        
        <View style={styles.cardRow}>

          <Image source={ProfileIcon} style={styles.avatar} />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{tenant?.fullName}</Text>

            <View style={styles.inline}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{tenant?.floorName}</Text>
              </View>

              <Image source={RoomIcon} style={styles.icon} />
              <Text style={styles.roomText}>{tenant?.roomName}</Text>

              <Image source={BedIcon} style={styles.icon} />
              <Text style={styles.roomText}>{tenant?.bedName}</Text>
            </View>
          </View>

        
        </View>

        
     
<View style={styles.rowBetween}>

  
  <View style={{display:"flex",flexDirection:"row"}}>
  <View style={styles.unitBox}>
    <Image source={UserProfile} style={styles.unitIcon} />
    <Text style={styles.unitLabel}>Units{tenant?.totalUnits} </Text>
   
  </View>
   {/* <View style={styles.dateBox}>
    <Image source={calendarCheck} style={styles.calIcon} />
    <Text style={styles.dateLabel}>Aug 01 - 31</Text>
  </View> */}
  </View>

 
  <Text style={styles.priceBig}>₹ {tenant?.totalAmount} </Text>

</View>

      </View>

      <Text style={styles.listTitle}>Readings</Text>

   
      <ScrollView showsVerticalScrollIndicator={false}>
        {readings.map((item, index) => (
          <View key={index} style={styles.listRow}>
            
            <View style={styles.greenDot} />

            <View style={{ flex: 1 }}>
              <Text style={styles.monthText}> {formatApiMonth(item?.startDate)}</Text>

              <View style={styles.inline}>
                <View style={styles.tagSmall}>
                  <Text style={styles.tagSmallText}>{item?.floorName}</Text>
                </View>

                <Image source={RoomIcon} style={styles.icon} />
                <Text style={styles.bedText}>{item?.roomName}</Text>

                <Image source={BedIcon} style={styles.icon} />
                <Text style={styles.bedText}>{item?.bedName}</Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.amount}>₹{item?.amount}</Text>
           <Text style={styles.dateSmall}>
         {formatDateRange(item?.startDate, item?.endDate)}
          </Text>
            </View>

          </View>
        ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15, paddingTop:40 },


  header: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  backIcon: { width: 22, height: 22, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "700" },

 
  card: {
   
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },

  cardRow: { flexDirection: "row", alignItems: "center" },

  avatar: { width: 42, height: 42, borderRadius: 25, marginRight: 12 },

  name: { fontSize: 16, fontWeight: "700" },

  inline: { flexDirection: "row", alignItems: "center", marginTop: 4 },

  tag: {
    backgroundColor: "#FFECC2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  tagText: { color: "#A47E00", fontSize: 12, fontWeight: "600" },

  icon: { width: 16, height: 16, tintColor: "#3D6AE8", marginRight: 4 },
  roomText: { fontWeight: "600", color: "#3D6AE8", marginRight: 12 },

  priceBig: { fontSize: 20, fontWeight: "700" },

 rowBetween: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 12,
},
 unitBox: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFEFD1",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 8,
},
  unitIcon: { width: 16, height: 16, marginRight: 6 },
  unitLabel: { color: "#8A6300", fontWeight: "600" },

  dateBox: {
    flexDirection: "row",
    backgroundColor: "#E9EDFF",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginLeft:10
  },
  calIcon: { width: 16, height: 16, tintColor: "#1E45E1" },
  dateLabel: { marginLeft: 6, color: "#1E45E1", fontWeight: "600" },

  /** LIST **/
  listTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },

  listRow: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  greenDot: {
    width: 10,
    height: 10,
    backgroundColor: "green",
    borderRadius: 6,
    marginRight: 12,
    marginTop: 5,
  },

  monthText: { fontSize: 15, fontWeight: "700", marginBottom: 4 },

  tagSmall: {
    backgroundColor: "#FFECC2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 10,
  },
  tagSmallText: {
    color: "#A47E00",
    fontSize: 11,
    fontWeight: "600",
  },

  bedText: { color: "#3D6AE8", marginRight: 12, fontWeight: "600" },

  amount: { fontSize: 16, fontWeight: "700" },

  dateSmall: { fontSize: 12, color: "#777", marginTop: 4 },
});
