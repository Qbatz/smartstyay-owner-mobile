import React, { useState , useContext , useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity , Image
} from "react-native";
import { StatusBar, Platform } from "react-native";
import { Switch } from "react-native-switch";
import { useHasPermission } from "../../../Utils/useHasPermission";
import { CommonContexts } from "../../../Context/CommonContext";
import { UseSetting } from "../../../Context/SettingContext";
import { useFocusEffect } from "@react-navigation/native";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import Loader from "../../../Component/Loader/Loader"
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import LongStayIcon from "../../../Assets/Images/shield-tick.png";
import ShortStayIcon from "../../../Assets/Images/Shortstay.png";
// import { Ionicons } from "@expo/vector-icons";



export default function BillingRule({ navigation }) {

     const {activeHostelId } = useContext(CommonContexts);
     const {getBillingConfig , loading} = UseSetting();

       const [billingData,setBillingData] = useState("")

     const [longStay, setLongStay] = useState(true);
     const [shortStay, setShortStay] = useState(false);


     useEffect(() => {
       if (activeHostelId) {
         loadBilling(activeHostelId);
       }
     }, [activeHostelId]);
     
     const loadBilling = async (id) => {
       const res = await getBillingConfig(id);
       console.log("Billing Data →", res);
       setBillingData(res.data)
     };
     
     useFocusEffect(
       React.useCallback(() => {
         if (activeHostelId) {
           loadBilling(activeHostelId);  // Always refresh when screen open
         }
       }, [activeHostelId])
     );

       const {
         canWriteModule: canWriteBills,
         canReadModule: canReadRecurring,
       } = useHasPermission("Bills");

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
         <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Billing Rule</Text>
        </View>

       
      </View>

           {!canReadRecurring && !loading && (
                       <View style={styles.emptyContainer}>
                         <Image
                           source={EmptyState}
                           style={styles.emptyImage}
                         />
                         <Text style={styles.emptyText}>
                           You do not have access to view Billing Rule
                         </Text>           
                       </View>
                )}
         
             {canReadRecurring && !loading && billingData?.length === 0 && (
                       <View style={styles.emptyContainer}>
                         <Image
                           source={EmptyState}
                           style={styles.emptyImage}
                         />
                         <Text style={styles.emptyText}>
                           No Records Found
                         </Text>       
                       </View>
                     ) }
      
      {/* Long Stay */}

           {billingData && canReadRecurring  && (
            <>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("LongStay")}>
        <View style={styles.row}>
          
          <View style={styles.iconContainer}>
             <Image source={LongStayIcon} style={styles.LongstayIcon} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Long Stay Recurring</Text>
            <Text style={styles.subtitle}>
              Set your Monthly Recurring Bill Period
            </Text>
          </View>

  <Switch
  value={longStay}
  onValueChange={setLongStay}
  circleSize={20}
  barHeight={25}
  circleBorderWidth={0}
  backgroundActive={"#2F5BFF"}
  backgroundInactive={"#D9D9D9"}
  circleActiveColor={"#fff"}
  circleInActiveColor={"#fff"}
  changeValueImmediately={true}
  innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
  renderActiveText={false}
  renderInActiveText={false}
/>

        </View>
      </TouchableOpacity>


<View style={styles.card}>
        <View style={styles.row}>

          <View style={styles.iconContainer}>
                <Image source={ShortStayIcon} style={styles.LongstayIcon} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Short Stay Recurring</Text>
            <Text style={styles.subtitle}>
              Fill the template form with details you'd like to customize.
            </Text>
          </View>

  <Switch
  value={shortStay}
  onValueChange={setShortStay}
  circleSize={20}
  barHeight={24}
  circleBorderWidth={0}
  backgroundActive={"#2F5BFF"}
  backgroundInactive={"#D9D9D9"}
  circleActiveColor={"#fff"}
  circleInActiveColor={"#fff"}
  renderActiveText={false}
  renderInActiveText={false}
/>

        </View>
      </View>
      </>
           )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

 container: {
  flex: 1,
  backgroundColor: "#F4F6F8",
  paddingHorizontal: 16,
//   paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
},

   headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 30 : 30,
    paddingBottom: 30,
  },


  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  backIcon: { width: 20, height: 20, marginRight: 10 , marginLeft:8},

  headerTitle: { fontSize: 20, fontWeight: "700", color: "#000" },

LongstayIcon: {
  width: 28,
  height: 28,
  tintColor: "#3562FF"
},
 card: {
  backgroundColor: "#fff",
  padding: 18,
  borderRadius: 8,
  marginBottom: 16,

  shadowColor: "#0000000D",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 6,

  elevation: 3
},
row: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between"
},

  iconContainer: {
    marginRight: 12
  },

  title: {
    fontSize: 16,
    fontWeight: "600"
  },

  subtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 3
  },
    emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  emptyImage: {
    width: 250,
    height: 180,
    resizeMode: "contain",
    opacity: 0.9,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },

});