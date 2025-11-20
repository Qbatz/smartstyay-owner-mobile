import React, { useLayoutEffect,useState,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  BackHandler

} from "react-native";

import BackIcon from "../../../Assets/Images/Arrow_left.png";
import MenuDots from "../../../Assets/Images/3dots.png";
import AddIcon from "../../../Assets/Images/TenantAddBlue.png";
import AssetIcon from "../../../Assets/Images/Asset.png";
import SearchIcon from "../../../Assets/Images/Asset_search.png";
import ButtonTag from "../../../Assets/Images/tag.png"
import Filter from "../../../Assets/Images/EditPin.png"

export default function Assets({ navigation }) {
  const [showSheet, setShowSheet] = useState(false);
const [selectedAsset, setSelectedAsset] = useState(null);

useEffect(() => {
  const backAction = () => {
    if (showSheet) {
      setShowSheet(false);
      return true; // prevent app from closing
    }
    return false; // allow default back behavior
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, [showSheet]);


  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" }
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          paddingVertical: 12,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "#fff",
          elevation: 8,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
      });
    };
  }, [navigation]);

  const dummyData = [
    { name: "Refrigerator", model: "6987165476", brand: "Whirlpool", price: "₹16,500" },
    { name: "Refrigerator", model: "6987165476", brand: "Whirlpool", price: "₹16,500" },
    { name: "Ceiling Fan", model: "SB-989543", brand: "Crompton", price: "₹2,500" },
    { name: "Mattresses", model: "SB-989543", brand: "CURL ON", price: "₹7,500" },
    
  ];

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Assets</Text>

        <View style={{ width: 30 }} />
      </View>

      <View style={styles.searchBox}>
        <Image source={SearchIcon} style={styles.searchIcon} />
        <TextInput placeholder="Search Assets" placeholderTextColor="#8a8a8a" style={styles.searchInput} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {dummyData.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.iconCircle}>
              <Image source={AssetIcon} style={styles.assetIcon} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.assetTitle}>{item.name}</Text>
              <Text style={styles.assetSub}>
                {item.model}{"  •  "}{item.brand}{"  •  "}{item.price}
              </Text>
            </View>

          <TouchableOpacity
  onPress={() => {
    setSelectedAsset(item);
    setShowSheet(true);
  }}
>
  <Image source={MenuDots} style={styles.dotsIcon} />
</TouchableOpacity>

          </View>
        ))}
      </ScrollView>
        <TouchableOpacity style={styles.Filterfab}>
        <Image source={Filter} style={styles.fabIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.fab}>
        <Image source={AddIcon} style={styles.fabIcon} />
      </TouchableOpacity>



      {showSheet && (
  <View style={styles.sheetOverlay}>
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={1}
      onPress={() => setShowSheet(false)}
    />

    <View style={styles.bottomSheet}>
      <View style={styles.sheetHandle} />

      

    
      <View style={styles.sheetHeaderRow}>
  <Text style={styles.sheetTitle}>{selectedAsset?.name}</Text>

  <View style={styles.topActions}>
    <TouchableOpacity>
      <Image source={require('../../../Assets/Images/editIcon.png')} style={styles.headerIcon} />
    </TouchableOpacity>

    <TouchableOpacity>
      <Image source={require('../../../Assets/Images/trash.png')} style={styles.headerIcon} />
    </TouchableOpacity>
  </View>
</View>

<View style={styles.divider} />

<View style={styles.twoColRow}>
  <View style={styles.colLeft}>
    <Text style={styles.label}>Serial No:</Text>
    <Text style={styles.value}>{selectedAsset?.model}</Text>
  </View>

  <View style={styles.colRight}>
    <Text style={styles.label}>Brand Name</Text>
    <Text style={styles.value}>{selectedAsset?.brand}</Text>
  </View>
</View>

<View style={styles.twoColRow}>
  <View style={styles.colLeft}>
    <Text style={styles.label}>Product Name</Text>
    <Text style={styles.value}>Fridge</Text>
  </View>

  <View style={styles.colRight}>
    <Text style={styles.label}>Purchase Date</Text>
    <Text style={styles.value}>16-05-2025</Text>
  </View>
</View>

<View style={styles.twoColRow}>
  <View style={styles.colLeft}>
    <Text style={styles.label}>Vendor Name</Text>
    <Text style={styles.value}>Ram Kumar</Text>
  </View>

  <View style={styles.colRight}>
    <Text style={styles.label}>Price</Text>
    <Text style={styles.value}>{selectedAsset?.price}.00</Text>
  </View>
</View>

<View style={{ marginTop: 20 }}>
  <Text style={styles.label}>Mode of Payment</Text>
  <Text style={styles.value}>CASH</Text>
</View>

{/* <TouchableOpacity style={styles.assignBtn}>
     <Image source={ButtonTag} style={styles.headerIcon} />
  <Text style={styles.assignText}>Assign Asset</Text>
</TouchableOpacity> */}
<TouchableOpacity style={styles.assignBtn}>
  <Image source={ButtonTag} style={styles.assignIcon} />
  <Text style={styles.assignText}>Assign Asset</Text>
</TouchableOpacity>


    </View>
  </View>
)}

    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingTop: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  backIcon: { width: 22, height: 22 },
  pageTitle: { fontSize: 20, fontWeight: "700", color: "#000" },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 14, padding: 12, marginBottom: 20 },
  searchIcon: { width: 20, height: 20, tintColor: "#9E9E9E" },
  searchInput: { flex: 1, marginLeft: 10 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 14, marginBottom: 12 },
  iconCircle: { width: 46, height: 46, backgroundColor: "#EEF4FF", borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 14 },
  assetIcon: { width: 26, height: 26, tintColor: "#3F6AFF" },
  assetTitle: { fontSize: 16, fontWeight: "700" },
  assetSub: { fontSize: 13, color: "#696969", marginTop: 2 },
  dotsIcon: { width: 18, height: 18, tintColor: "#999" },
  fab: { position: "absolute", bottom: 25, right: 25, width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  Filterfab:{position: "absolute", bottom: 90, right: 25, width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center"},
  fabIcon: { width:60, height:60 },
  sheetOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
},

bottomSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
},

sheetHandle: {
  width: 60,
  height: 4,
  backgroundColor: "#D1D5DB",
  alignSelf: "center",
  borderRadius: 20,
  marginBottom: 15,
},

sheetTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#000",
  marginBottom: 10,
},

topActions: {
  position: "absolute",
  right: 20,
  top: 20,
  flexDirection: "row",
  gap: 15,
},

sheetContent: {
  marginTop: 20,
},

label: { fontSize: 13, color: "#7A7A7A", marginTop: 10 },
value: { fontSize: 15, fontWeight: "600", color: "#000" },

assignBtn: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1E45E1",
  paddingVertical: 14,
  borderRadius: 12,
  marginTop: 30,
},

assignIcon: {
  width: 18,
  height: 18,
  tintColor: "#fff",
  marginRight: 8,
},

assignText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
},ntWeight: "700",

sheetHeaderRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

headerIcon: {
  width: 20,
  height: 20,
  marginLeft: 18,
},

divider: {
  height: 1,
  backgroundColor: "#E8E8E8",
  marginVertical: 15,
},

twoColRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 15,
},

colLeft: { width: "48%" },
colRight: { width: "48%" },

});
