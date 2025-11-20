import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";

import BackIcon from "../../../Assets/Images/Arrow_left.png";
import MenuDots from "../../../Assets/Images/3dots.png";
import AddIcon from "../../../Assets/Images/add-circle.png";
import AssetIcon from "../../../Assets/Images/Asset.png";
import SearchIcon from "../../../Assets/Images/Asset_search.png";

export default function Assets({ navigation }) {

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

            <TouchableOpacity>
              <Image source={MenuDots} style={styles.dotsIcon} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Image source={AddIcon} style={styles.fabIcon} />
      </TouchableOpacity>
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
  fab: { position: "absolute", bottom: 25, right: 25, backgroundColor: "#1E45E1", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  fabIcon: { width: 25, height: 25, tintColor: "#fff" },
});
