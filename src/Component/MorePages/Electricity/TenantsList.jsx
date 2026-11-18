// TenantsList.js
import React, { useState,useRef,useEffect , useContext } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import ProfileIcon from "../../../Assets/Images/profile.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";
import BedIcon from "../../../Assets/Images/Bed_Icon.png"
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
            ParticularTenantReadingDetails,
            LoadMoreEBTenantReading,
            tenantReadingLoadingMore } = useContext(ElectricityContext);

  const readingList = Array.isArray(EbTenantReading?.readingList)
    ? EbTenantReading.readingList
    : [];

  
  const userHasScrolledRef = useRef(false);
  const pendingEndReachedRef = useRef(false);

  useEffect(() => {
    // Page 1 (re)loading: wait for a fresh drag again
    if (loading) {
      userHasScrolledRef.current = false;
      pendingEndReachedRef.current = false;
    }
  }, [loading]);

  // Duplicate / last-page calls are blocked inside LoadMoreEBTenantReading.
  const handleLoadMoreTenantReadings = () => {
    if (!activeHostelId || loading || tenantReadingLoadingMore) return;
    if (readingList.length === 0) return;

    if (!userHasScrolledRef.current) {
      pendingEndReachedRef.current = true;
      return;
    }

    pendingEndReachedRef.current = false;
    LoadMoreEBTenantReading(activeHostelId);
  };

  const handleScrollBeginDrag = () => {
    userHasScrolledRef.current = true;
    if (pendingEndReachedRef.current) {
      handleLoadMoreTenantReadings();
    }
  };

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

  console.log("tenantReading",EbTenantReading)
  const handleCustomerReading = (item) => {
    console.log("item", item);
    
     navigation.navigate("CustomerReading", { tenant: item })
     ParticularTenantReadingDetails(activeHostelId, item.customerId)
  }


  const formatApiMonth = (date) => {
    if (!date || date === "N/A") return "--";
  
    return dayjs(date, ["DD/MM/YYYY", "D/MM/YYYY"]).format("MMMM");
  };



  return (

    <>
       {/* { loading && <Loader />} */}
   <FlatList
    data={loading ? [] : readingList}
    keyExtractor={(item, index) => `${item?.customerId ?? "reading"}-${index}`}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
    flexGrow: 1,
    justifyContent:
      !loading && readingList.length === 0 ? "center" : "flex-start",
      paddingBottom:30,
  }}
    onScrollBeginDrag={handleScrollBeginDrag}
    onEndReached={handleLoadMoreTenantReadings}
    onEndReachedThreshold={0.5}
    renderItem={({ item }) => (
        <TouchableOpacity
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
                <Image source={BedIcon} style={styles.icon} />
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
    )}
    ListEmptyComponent={
      !loading ? (
            <View style={styles.centerContainer}>
              <Image source={EmptyState} style={styles.image} />
              <Text style={styles.noFloorText}>No Tenant Readings are there!</Text>
      
              
            </View>
      ) : null
    }
    ListFooterComponent={
      tenantReadingLoadingMore ? (
        <View style={{ paddingVertical: 16 }}>
          <ActivityIndicator size="small" color="#1E45E1" />
        </View>
      ) : null
    }
   />
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
