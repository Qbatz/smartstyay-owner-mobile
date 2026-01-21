import React,{useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler
} from "react-native";

import HostelImage from "../../Assets/Images/PgImg.png"
import SettingsImage from "../../Assets/Images/setting.png"

import Assetsimage from "../../Assets/Images/star.png"
import Bankingimage from "../../Assets/Images/bank.png"
import Billsimage from "../../Assets/Images/bill.png"
import Electricityimage from "../../Assets/Images/electricity.png"
import Expensesimage from "../../Assets/Images/Expenses.png"
import Reportsimage from "../../Assets/Images/Reports.png"
import Vendorimage from "../../Assets/Images/vendor.png"

import RightArrow from "../../Assets/Images/right_direction.png"


export default function MoreDesign({ navigation }) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.navigate("MyTabs");
        return true; 
      }
    );
  
    return () => backHandler.remove();
  }, []);

  const menuItems = [
    { title: "Assets", icon: Assetsimage, bg: "#FF4EB5", screen: "Assets" },
    { title: "Banking", icon: Bankingimage, bg: "#0F6EFF", screen: "Banking" },
    { title: "Bills", icon: Billsimage, bg: "#00C4FF", screen: "Bills" },
    { title: "Electricity", icon: Electricityimage, bg: "#FF2E2E", screen: "Electricity" },
    { title: "Expenses", icon: Expensesimage, bg: "#16C25B", screen: "Expenses" },
    { title: "Reports", icon: Reportsimage, bg: "#A92EFF", screen: "Reports" },
    { title: "Vendor", icon: Vendorimage, bg: "#FF7A00", screen: "VendorsList" },
    { title: "Settings", icon: SettingsImage, bg: "#1E45E1", screen: "SettingsScreen" },
  ];

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={HostelImage} style={styles.profileImg} />
          <Text style={styles.headerTitle}>More</Text>
        </View>

        {/* <TouchableOpacity onPress={() => navigation.replace("SettingsScreen")}>
          <Image source={SettingsImage} style={styles.settingsIcon} />
        </TouchableOpacity> */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.row}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
              <Image source={item.icon} style={styles.leftIcon} />
            </View>

            <Text style={styles.itemText}>{item.title}</Text>

            <Image source={RightArrow} style={styles.arrow} />
          </TouchableOpacity>
        ))}
      </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 30,
    paddingTop:60
   
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  profileImg: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginLeft:10
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 20,
    color: "#000",
  },

  settingsIcon: {
    width: 22,
    height: 22,
    tintColor: "#000",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  leftIcon: {
    width: 22,
    height: 22,
    tintColor: "#fff",
  },

  itemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },

  arrow: {
    width: 20,
    height: 20,
  },
});
