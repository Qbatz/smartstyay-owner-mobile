import React, { useState, useEffect } from "react";
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
    { icon: General, title: "General", screen: "GeneralDetailsScreen" },
    { icon: Manage, title: "Manage PG", screen: "SettingsPG" },
    { icon: Security, title: "Security", screen: "SettingsSecurity" },
    { icon: Subscription, title: "Subscription", screen: "PlanDetailsScreen" },
    { icon: Integration, title: "Integration", screen: "Integration" },
  ];


  const pgItems = [

    { icon: Electricity, title: "Electricity", screen: "SettingsElectricity" },
    // { icon: BillingRule, title: "Billing Rule old", screen:"BillingRuleScreen" },
    { icon: BillingRule, title: "Billing Rule", screen: "BillingRule" },
    { icon: BillTemplate, title: "Bill Templates", screen: "BillTemplate" },
    { icon: Expense, title: "Expenses", screen: "ExpensesCategory" },
    { icon: Complaints, title: "Complaints", screen: "ComplaintType" },
    { icon: Complaints, title: "Vendors", screen: "SettingsVendors" },
    { icon: Amenity, title: "Amenities", screen: "SettingsAmenity" },
    { icon: UserIcon, title: "Staff", screen: "UsersScreen" },
    { icon: RoleIcon, title: "Role", screen: "RolesScreen" },
    { icon: AgreementIcon, title: "Agreement & Policy", screen: "Agreement" },
  ];

  const [search, setSearch] = useState("");
  const [showSearchList, setShowSearchList] = useState(false);

  const allSettings = [...mainItems, ...pgItems];

  const filteredSettings =
    search.trim() === ""
      ? []
      : allSettings.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );

  const handleSearch = (text) => {
    const filtered = text.replace(/[^A-Za-z\s]/g, "");

    setSearch(filtered);
    setShowSearchList(filtered.trim().length > 0);
  };

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
    <TouchableOpacity style={styles.itemRow} onPress={() => navigation.navigate(item.screen)}>
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

        <View style={{ flex: 1 }}>
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
        {/* <TouchableOpacity>
    <Image source={FilterIcon} style={styles.settingsIcon} />
  </TouchableOpacity> */}
      </View>


      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        {/* Search box */}

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Image
              source={SearchIcon}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search"
              value={search}
              onChangeText={handleSearch}
              autoCorrect={false}
              autoCapitalize="words"
              maxLength={30}
            />
          </View>


        </View>

      

          <ScrollView showsVerticalScrollIndicator={false}>

            {mainItems.map((item, index) => (
              <View key={index} >{renderItem(item)}</View>
            ))}

            <Text style={styles.sectionTitle}>PG Settings</Text>

            {/* PG Items */}
            {pgItems.map((item, index) => (
              <View key={index}>{renderItem(item)}</View>
            ))}
          </ScrollView>

  {showSearchList && (
<View style={styles.searchModal}>
  <ScrollView
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
  >
    {filteredSettings.length > 0 ? (
              filteredSettings?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.searchItem,
                    index === 0 && styles.firstSearchItem
                  ]}
                  onPress={() => {
                    setSearch("");
                    setShowSearchList(false);
                    navigation.navigate(item.screen);
                  }}
                >

                  {index === 0 && (
                    <View style={styles.activeLine} />
                  )}

                  <Image
                    source={item.icon}
                    style={styles.searchItemIcon}
                  />

                  <Text style={styles.searchItemText}>
                    {item.title}
                  </Text>

                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResult}>No results found</Text>
            )}
  </ScrollView>
</View>
 )}
        
         
       
      {/* </ScrollView> */}

</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 40,
    marginBottom: 30
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
    fontFamily: "Gilroy-Bold",
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

    zIndex: 1001,
 ...Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.04,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),
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
    color: "#9C9C9C",
    fontFamily: "Gilroy-Regular"
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
    fontSize: 16,
    color: "#222222",
    fontFamily: "Gilroy-Medium"
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
    fontFamily: "Gilroy-Semibold",
    color: "#4B4B4B",
  },
  // searchModal: {
  //   position: "absolute",
  //   left: 16,
  //   right: 16,

  //   top: 78,

  //   backgroundColor: "#fff",
  //   borderRadius: 22,
  //   maxHeight: 350,

  //   paddingVertical: 12,

  //   zIndex: 999,
  //   elevation: 10,

  //   shadowColor: "#000",
  //   shadowOpacity: 0.08,
  //   shadowRadius: 12,
  // },

searchModal: {
  position: "absolute",
  top: 122,
  left: 16,
  right: 16,
  maxHeight: 200,

  backgroundColor: "#FFF",
  borderRadius: 14,

  borderWidth: 1,
  borderColor: "#F2F2F2",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.08,
  shadowRadius: 16,

  elevation: 12,

  overflow: "hidden",
},

  // searchItem: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   paddingVertical: 16,
  //   paddingHorizontal: 20,
  // },

  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    // borderRadius: 10,
    // marginHorizontal: 10,
    marginBottom: 6,
  },

  firstSearchItem: {
    backgroundColor: "#F6F8FF",
  },

  activeLine: {
    width: 3,
    height: 18,
    backgroundColor: "#2F54EB",
    borderRadius: 10,
    marginRight: 18,
  },

  searchItemIcon: {
    width: 28,
    height: 28,
    marginRight: 14,
    resizeMode: "contain",
  },

  searchItemText: {
    fontSize: 18,
    color: "#444",
    fontFamily: "Gilroy-Medium",
  },

  noResult: {
    padding: 20,
    textAlign: "center",
    color: "red",
    fontFamily: "Gilroy-Regular",
  },
});
