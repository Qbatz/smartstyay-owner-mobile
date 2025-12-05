import React,{useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  BackHandler, Platform
} from "react-native";

export default function SettingsScreen({ navigation }) {
  const mainItems = [
    { icon: require("../../Assets/Images/General.png"), title: "General" , screen: "GeneralDetailsScreen" },
    { icon: require("../../Assets/Images/Manage.png"), title: "Manage PG" ,screen: "SettingsPG"  },
    { icon: require("../../Assets/Images/security.png"), title: "Security",screen: "SettingsSecurity" },
    { icon: require("../../Assets/Images/subscription.png"), title: "Subscription",screen: "Assets" },
    { icon: require("../../Assets/Images/integration.png"), title: "Integration",screen: "Assets" },
  ];

  const pgItems = [
    { icon: require("../../Assets/Images/Electricityimg.png"), title: "Electricity" ,screen: "SettingsElectricity"},
    { icon: require("../../Assets/Images/BillingRule.png"), title: "Billing Rule" },
    { icon: require("../../Assets/Images/BillTempl.png"), title: "Bill Templates" },
    { icon: require("../../Assets/Images/Expense.png"), title: "Expenses" ,screen : "ExpensesCategory" },
    { icon: require("../../Assets/Images/compliance.png"), title: "Complaints",screen : "ComplaintType" },
    { icon: require("../../Assets/Images/Amenitie.png"), title: "Amenities" ,screen : "SettingsAmenity"},
    { icon: require("../../Assets/Images/Expense.png"), title: "User" ,screen: "UsersScreen"},
    { icon: require("../../Assets/Images/Expense.png"), title: "Role" },
    { icon: require("../../Assets/Images/Expense.png"), title: "Agreement & Policy" },
  ];
useEffect(() => {
  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      navigation.navigate("MoreDesign");
      return true; 
    }
  );

  return () => backHandler.remove();
}, []);
const renderItem = (item) => (
  <TouchableOpacity style={styles.itemRow}  onPress={() => navigation.navigate(item.screen)}>
    <View style={styles.itemLeft}>
      <Image 
        source={item.icon}
        style={[styles.itemIcon, { width: 35, height: 35 }]}
      />
      <Text style={styles.itemText}>{item.title}</Text>
    </View>

    <Image
      source={require("../../Assets/Images/right_direction.png")}
      style={styles.arrow}
    />
  </TouchableOpacity>
);


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace("MoreDesign")}>
          <Image
            source={require("../../Assets/Images/Arrow_left.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerText}>Settings</Text>

        <Image
          source={require("../../Assets/Images/filter.png")}
          style={styles.settingsIcon}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search box */}
        <View style={styles.searchBox}>
          <Image
            source={require("../../Assets/Images/Asset_search.png")}
            style={styles.searchIcon}
          />
          <TextInput placeholder="Search" style={styles.searchInput} />
        </View>

        
        {mainItems.map((item, index) => (
          <View key={index} >{renderItem(item)}</View>
        ))}

   
        <Text style={styles.sectionTitle}>PG Settings</Text>

        {/* PG Items */}
        {pgItems.map((item, index) => (
          <View key={index}>{renderItem(item)}</View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#FFF",
  paddingTop:40,
  marginBottom:30
},

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
  },

  backIcon: {
    width: 22,
    height: 22,
    tintColor: "#000",
  },

  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  settingsIcon: {
    width: 22,
    height: 22,
    tintColor: "#000",
  },

  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    paddingHorizontal: 12,
     borderColor: "#ECECEC",
    height: 48,
    marginTop: 12,
    marginBottom: 18,
    borderWidth: 1,
  },

  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#999",
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 10,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },

  itemText: {
    fontSize: 15,
    color: "#000",
  },

  arrow: {
    width: 20,
    height: 20,
  
  },

  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
});
