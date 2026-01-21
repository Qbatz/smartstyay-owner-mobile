import React, { useState , useEffect , useRef,useContext} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image, BackHandler,
} from "react-native";
import { KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import Shield from "../../../Assets/Images/Shield.png";
import Confiqure from "../../../Assets/Images/arrow-transfer.png";
import { CommonContexts } from "../../../Context/CommonContext";
import { UseSetting } from "../../../Context/SettingContext";
import { useFocusEffect } from "@react-navigation/native";

export default function BillingRuleScreen({ navigation }) {

 const {activeHostelId } = useContext(CommonContexts);
  const {getBillingConfig} = UseSetting();
 

  const [showEditSheet, setShowEditSheet] = useState(false)
  const [billingData,setBillingData] = useState("")
  const editY = useRef(new Animated.Value(700)).current;


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
console.log("billingData", billingData);
 useEffect(() => {
  const backPress = BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      if (showEditSheet) {
        closeEditSheet();
        return true; // handled
      }

      navigation.goBack();
      return true; // handled
    }
  );

  return () => backPress.remove();
}, [showEditSheet]);




useEffect(() => {
  const showSub = Keyboard.addListener("keyboardDidShow", () => {
    Animated.timing(editY, {
      toValue: -120,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });

  const hideSub = Keyboard.addListener("keyboardDidHide", () => {
    Animated.timing(editY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);








const closeEditSheet = () => {
  Animated.timing(editY, {
    toValue: 700,
    duration: 220,
    useNativeDriver: true,
  }).start(() => {
    setShowEditSheet(false);
  });
};







 const CustomSwitch = ({ value }) => {
  return (
    <View
      style={[
        styles.switch,
        { backgroundColor: "#3562FF" }, 
      ]}
    >
      <Animated.View
        style={[
          styles.knob,
          { transform: [{ translateX: 18 }] }, // Always ON position
        ]}
      >
        <Text style={styles.knobText}>✓</Text>
      </Animated.View>
    </View>
  );
};




  

  return (
     <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <View style={styles.container}>
     
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Billing Rule</Text>
        </View>

       
      </View>

   
      {billingData && (
        <View style={styles.card}>
       
<View style={styles.titleRow}>
  <Text style={styles.cardTitle}>Long Stay Recurring</Text>

  <View style={styles.shieldBox}>
    <Image source={Shield} style={styles.shieldIcon} />
  </View>
</View>
<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>Bill Start Date:</Text>
  <Text style={styles.infoValue}>{billingData.billStartDate}</Text>
</View>

<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>Bill Due Days:</Text>
  <Text style={styles.infoValue}>{billingData.billDueDate}</Text>
</View>

<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>Notice Period:</Text>
  <Text style={styles.infoValue}>{billingData.noticePeriod} days</Text>
</View>
<View style={styles.infoRow}>
  <Text style={styles.infoLabel}>Starts From:</Text>
  <Text style={styles.infoValue}>{billingData.startsFrom || "_"}</Text>
</View>


         
             <View style={styles.cardborder} />
       

          <View style={styles.row}>
           
            <TouchableOpacity style={styles.configureBtn}  onPress={() => navigation.navigate("LongStayRecurring")}
>
  <View style={styles.configureRow}>
    <Image
      source={Confiqure} 
      style={styles.configureIcon}
    />
    <Text style={styles.configureText}>Configure</Text>
  </View>
</TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
              </Text>
              <CustomSwitch
              value={true}
              />
            </View>
          </View>

        
        </View>
      )}

      




    </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7FA", padding: 20, paddingTop:60 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
  },


  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  backIcon: { width: 20, height: 20, marginRight: 10 },

  headerTitle: { fontSize: 20, fontWeight: "700", color: "#000" },

 



  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  cardTitle: { fontSize: 16, fontWeight: "700", color: "#222" },
  

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 14,
    alignItems: "center",
  },

  label: { fontSize: 14, color: "#444" },
  value: { fontSize: 15, fontWeight: "700" },

  switchRow: { flexDirection: "row", alignItems: "center", gap: 12 },

  switchText: { fontSize: 14, fontWeight: "600", color: "#3562FF" },

  switch: {
    width: 42,
    height: 24,
    borderRadius: 20,
    padding: 3,
    justifyContent: "center",
  },

  knob: {
    width: 18,
    height: 18,
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  knobText: { fontSize: 10, fontWeight: "700" },
sheetOverlay: {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
  zIndex: 9999,
},


cardborder: {
  width: 310,
  height: 0.3,
  backgroundColor: "#ccc",
  borderRadius: 4,
  alignSelf: "center",
  marginTop:15
//   marginBottom: 14,
},


configureBtn: {
  backgroundColor: "#1D5BEE",
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
},

configureRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
},

configureIcon: {
  width: 18,
  height: 18,
  tintColor:"#FFFFFF",
 transform : 'rotate(90deg)'
 
},

configureText: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "600",
},
titleRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},



shieldBox: {
  width: 34,
  height: 34,
  borderRadius: 10,

 
  justifyContent: "center",
  alignItems: "center",
 
},

shieldIcon: {
  width: 40,
  height: 40,
  tintColor: "#3562FF", 
},
infoRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 14,
},

infoLabel: {
  fontSize: 13,
  color: "#7A7A7A",
  letterSpacing: 0.3,
},

infoValue: {
  fontSize: 14,
  fontWeight: "600",
  color: "#000",
},



});
