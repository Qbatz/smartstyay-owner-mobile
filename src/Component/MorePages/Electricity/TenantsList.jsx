// TenantsList.js
import React, { useState,useRef,useEffect , useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView,TouchableOpacity} from "react-native";
import ProfileIcon from "../../../Assets/Images/profile.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";
import { useNavigation } from "@react-navigation/native";
import {ElectricityContext} from "../../../Context/ElectricityContext";
import { CommonContexts } from "../../../Context/CommonContext";
import Loader from "../../../Component/Loader/Loader"
import dayjs from "dayjs";
import EmptyState from "../../../Assets/Images/Empty_state.png"

export default function TenantsList() {

     const { activeHostelId } = useContext(CommonContexts);
    const {    EbRoomReading , 
            particular_EbRoomReading,
            EbTenantReading,
            particular_EbTenantReading,
            loading,
            error, 
            errorMsg,
            GetEBRoomReading,
            GetEBTenantReading,
            ParticularRoomReadingDetails,
            ParticularTenantReadingDetails } = useContext(ElectricityContext);

//    useEffect(() => {
//   if (activeHostelId) {
//     GetEBTenantReading(activeHostelId);
//   }
// }, [activeHostelId]);

  const navigation = useNavigation()

  // const tenants = [
  //   { name: "Arun Kumar R", floor: "Ground Floor", room: "003", bed: "03", amount: "330", month: "August" },
  //   { name: "Alex", floor: "First Floor", room: "103", bed: "01", amount: "330", month: "August" },
  //   { name: "Ashok Kumar", floor: "Ground Floor", room: "005", bed: "01", amount: "340", month: "August" },
  //   { name: "Bala Chandran", floor: "Second Floor", room: "005", bed: "01", amount: "340", month: "August" },
  //   { name: "David", floor: "Ground Floor", room: "002", bed: "02", amount: "420", month: "August" },
  // ];

  const handleCustomerReading = (item) => {
    console.log("item", item);
    
     navigation.navigate("CustomerReading", { tenant: item })
     ParticularTenantReadingDetails(activeHostelId, item.customerId)
  }


  const formatApiMonth = (date) => {
    if (!date || date === "N/A") return "--";
  
    return dayjs(date, ["DD/MM/YYYY", "D/MM/YYYY"]).format("MMMM");
  };

  console.log("pattit",EbTenantReading)


  return (

    <>
       {/* { loading && <Loader />} */}
   <ScrollView 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
    flexGrow: 1,
    justifyContent:
      !loading && EbTenantReading?.length === 0 ? "center" : "flex-start",
  }}>
      {!loading && EbTenantReading && EbTenantReading?.length > 0 &&  EbTenantReading?.map((item, index) => (
        
        <TouchableOpacity
          key={index}
          style={styles.row}
          onPress={()=> handleCustomerReading(item)}
        >
          {/* Profile Image */}
          

          {
            item?.profilePic ? <Image source={{uri: item?.profilePic }} style={styles.profileImg} /> : 
            <View style={[styles.profileImg,{backgroundColor:"#E5E7EB",alignItems:'center',justifyContent:'center'}]}>
                <Text style={{fontSize:16,fontFamily:'Gilroy-Semibold',color: "#374151"}}>{item?.initials}</Text>
            </View>
          }

          {/* Middle */}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item?.fullName}</Text>

            <View style={styles.inline}>
              <View style={[styles.tag,{flexShrink: 1, flex: 1}]}>
                <Text style={[styles.tagText,{flexShrink:1}]}
                numberOfLines={1}>{item?.floorName}</Text>
              </View>

              <View style={[styles.inline,{flexShrink:1}]}>
                <Image source={RoomIcon} style={styles.icon} />
                <Text style={[styles.value,{flexShrink:1}]}
                numberOfLines={1}>{item?.roomName}</Text>
              </View>

              <View style={[styles.inline,{flexShrink:1}]}>
                <Image source={RoomIcon} style={styles.icon} />
                <Text style={[styles.value,{flexShrink:1}]}
                numberOfLines={1}>{item?.bedName}</Text>
              </View>
            </View>
          </View>

          {/* Right */}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.amount}>₹ {item.totalAmount}</Text>
            <Text style={styles.month}>
               {formatApiMonth(item?.startDate)}
              </Text>
          </View>

        </TouchableOpacity>

      ))}

      {( 
         !loading && EbTenantReading && EbTenantReading.length === 0 &&
            <View style={styles.centerContainer}>
              <Image source={EmptyState} style={styles.image} />
              <Text style={styles.noFloorText}>No Tenant Readings are there!</Text>
      
              
            </View>
          )}

    </ScrollView>
      </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  profileImg: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },

  name: { fontSize: 16, fontWeight: "700", color: "#000" },

  inline: { flexDirection: "row", alignItems: "center", marginTop: 4,flex:1 },

  tag: {
    backgroundColor: "#FFF4D7",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
  },

  tagText: {
    color: "#A47E00",
    fontSize: 12,
    fontWeight: "600",
  },

  icon: { width: 16, height: 16, tintColor: "#3D6AE8", marginRight: 4 },

  value: { color: "#3D6AE8", fontWeight: "600", marginRight: 10 },

  amount: { fontSize: 16, fontWeight: "700", color: "#000" },
  month: { fontSize: 13, color: "#555", marginTop: 3 },
   centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
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
});
