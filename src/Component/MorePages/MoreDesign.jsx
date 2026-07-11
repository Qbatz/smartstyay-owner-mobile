import React,{useState ,useContext, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler , NativeModules
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
import { CommonContexts } from "../../Context/CommonContext";


export default function MoreDesign({ navigation }) {

  const {hostelList,activeHostelId}=useContext(CommonContexts)

    const [environment, setEnvironment] = useState("")
  
    const { CommonModule } = NativeModules;

      useEffect(() => {
        CommonModule.fetchEnvironment().then(r => {
          setEnvironment(r)
        })
      }, [])

      console.log("Environment", environment);

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     () => {
  //       navigation.navigate("MyTabs");
  //       return true; 
  //     }
  //   );
  
  //   return () => backHandler.remove();
  // }, []);

    // useEffect(() => {
    //             const backHandler = BackHandler.addEventListener(
    //               "hardwareBackPress",
    //               () => {
    //                 navigation.goBack();  
    //                 return true;
    //               }
    //             );
              
    //             return () => backHandler.remove();
    //           }, [])

     
  // const menuItems = [
  //   { title: "Assets", icon: Assetsimage, bg: "#FF4EB5", screen: "Assets" },
  //   { title: "Banking", icon: Bankingimage, bg: "#0F6EFF", screen: "Banking" },
  //   { title: "Bills", icon: Billsimage, bg: "#00C4FF", screen: "Bills" },
  //   { title: "Electricity", icon: Electricityimage, bg: "#FF2E2E", screen: "Electricity" },
  //   { title: "Expenses", icon: Expensesimage, bg: "#16C25B", screen: "Expenses" },
  //     { title: "ExpensesList", icon: Expensesimage, bg: "#16C25B", screen: "ExpensesList" },
  //   { title: "Reports", icon: Reportsimage, bg: "#A92EFF", screen: "Reports" },
  //   { title: "Vendor", icon: Vendorimage, bg: "#FF7A00", screen: "VendorsList" },
  //    { title: "Vendor New", icon: Vendorimage, bg: "#FF7A00", screen: "Vendor" },
  //   { title: "Settings", icon: SettingsImage, bg: "#1E45E1", screen: "SettingsScreen" },
  // ];

  const menuItems = [
  { title: "Assets", icon: Assetsimage, bg: "#FF4EB5", screen: "Assets" },
  { title: "Banking", icon: Bankingimage, bg: "#0F6EFF", screen: "Banking" },
  
//   ...(environment !== "PROD"
//     ? [
//  { title: "New Banking", icon: Bankingimage, bg: "#0F6EFF", screen: "NewBankingScreen" },
//  ]
//     : []),

     ...(environment?.toUpperCase() !== "PROD"
    ? [
        {
          title: "New Banking",
          icon: Bankingimage,
          bg: "#0F6EFF",
          screen: "NewBankingScreen",
        },
      ]
    : []),
  
  { title: "Bills", icon: Billsimage, bg: "#00C4FF", screen: "Bills" },
  { title: "Electricity", icon: Electricityimage, bg: "#FF2E2E", screen: "Electricity" },
  // { title: "Expenses", icon: Expensesimage, bg: "#16C25B", screen: "Expenses" },

  // ...(environment !== "PROD"
  //   ? [
        {
          title: "Expenses",
          icon: Expensesimage,
          bg: "#16C25B",
          screen: "ExpensesList",
        },
    //   ]
    // : [])
    ,

  { title: "Reports", icon: Reportsimage, bg: "#A92EFF", screen: "Reports" },
  // { title: "Vendor", icon: Vendorimage, bg: "#FF7A00", screen: "VendorsList" },

  // ...(environment !== "PROD"
  //   ? [
        {
          title: "Vendor",
          icon: Vendorimage,
          bg: "#FF7A00",
          screen: "Vendor",
        },
    //   ]
    // : [])
    ,

  {
    title: "Settings",
    icon: SettingsImage,
    bg: "#1E45E1",
    screen: "SettingsScreen",
  },
];

  const activeHostel =
  hostelList?.find(h => (h.hostelId ?? h.id) === activeHostelId) ??
  hostelList?.[0] ??
  {};

  console.log(activeHostel)

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {activeHostel?.mainImage ? <Image source={{uri:activeHostel?.mainImage}} style={styles.profileImg}/> :
          <View style={[styles.profileImg,{ backgroundColor: "#E5E7EB",alignItems:'center',justifyContent:'center'}]}>
            <Text style={{fontSize:14, fontFamily: "Gilroy-Semibold"}}>{activeHostel?.initials}</Text>
          </View>
           }
          
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
    marginLeft:10,
    fontFamily: "Gilroy-Semibold"
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold" ,
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
    fontSize: 17,
    // fontWeight: "500",
  fontFamily: "Gilroy-Bold" ,
    color: "#222222",
  },

  arrow: {
    width: 20,
    height: 20,
  },
});
