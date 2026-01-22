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
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import General from "../../Assets/Images/General.png";
import Manage from "../../Assets/Images/Manage.png";
import Security from "../../Assets/Images/security.png";
import Subscription from "../../Assets/Images/subscription.png";
import Integration from "../../Assets/Images/integration.png";
import Electricity from "../../Assets/Images/Electricityimg.png";
import BillingRule from "../../Assets/Images/BillingRule.png";
import BillTemplate from "../../Assets/Images/BillTempl.png";
import Expense from "../../Assets/Images/Expense.png";
import Complaints from "../../Assets/Images/compliance.png";
import Amenity from "../../Assets/Images/Amenitie.png";
import RightArrow from "../../Assets/Images/right_direction.png";
import BackArrow from "../../Assets/Images/Arrow_left.png";
import SearchIcon from "../../Assets/Images/Asset_search.png";
import FilterIcon from "../../Assets/Images/filter.png";
import UserIcon from "../../Assets/Images/userImage.png";
import RoleIcon from "../../Assets/Images/RoleImage.png";
import AgreementIcon from "../../Assets/Images/AgreementImg.png";

export default function SettingsScreen({ navigation }) {
  const mainItems = [
    { icon: General, title: "General" , screen: "GeneralDetailsScreen" },
    { icon: Manage, title: "Manage PG" ,screen: "SettingsPG"  },
    { icon: Security, title: "Security",screen: "SettingsSecurity" },
    { icon: Subscription, title: "Subscription",screen: "SubscriptionPlans" },
    { icon: Integration, title: "Integration",screen: "Integration" },
  ];

 
  const pgItems = [

  { icon: Electricity, title: "Electricity", screen: "SettingsElectricity" },
  { icon: BillingRule, title: "Billing Rule", screen:"BillingRuleScreen" },
  { icon: BillTemplate, title: "Bill Templates", screen:"BillTemplate" },
  { icon: Expense, title: "Expenses", screen: "ExpensesCategory" },
  { icon: Complaints, title: "Complaints", screen: "ComplaintType" },
  { icon: Amenity, title: "Amenities", screen: "SettingsAmenity" },
  { icon: UserIcon, title: "User", screen: "UsersScreen" },
  { icon: RoleIcon, title: "Role", screen:"RolesScreen" },
  { icon: AgreementIcon, title: "Agreement & Policy",screen:"Agreement"  },
];

// useEffect(() => {
//   const backHandler = BackHandler.addEventListener(
//     "hardwareBackPress",
//     () => {
//       navigation.navigate("MoreDesign");
//       return true; 
//     }
//   );

//   return () => backHandler.remove();
// }, []);



useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      if (navigation.canGoBack()) {
        navigation.goBack()
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => sub.remove();
  }, [navigation])
);




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
      source={RightArrow}
      style={styles.arrow}
    />
  </TouchableOpacity>
);


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
   <View style={styles.header}>
  {/* LEFT SIDE */}
  <View style={styles.headerLeft}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image source={BackArrow} style={styles.backIcon} />
    </TouchableOpacity>

    <Text style={styles.headerText}>Settings</Text>
  </View>

  {/* RIGHT SIDE */}
  <TouchableOpacity>
    <Image source={FilterIcon} style={styles.settingsIcon} />
  </TouchableOpacity>
</View>


      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search box */}
        <View style={styles.searchBox}>
          <Image
            source={SearchIcon}
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
  justifyContent: "space-between",
  paddingHorizontal: 16,
  height: 60,
},

headerLeft: {
  flexDirection: "row",
  alignItems: "center",
},

headerText: {
  marginLeft: 12,
  fontSize: 18,
  fontWeight: "600",
  color: "#000",
},

backIcon: {
  width: 22,
  height: 22,
  tintColor: "#000",
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
