
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import ExpiryImg from "../Assets/Images/subscription_expiry.png";


export default function SubscriptionExpired({setTabBar,onClose}){


  const navigation = useNavigation()

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: "MyTabs" }],
        });
        return true;
      };

      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => sub.remove();
    }, [])
  );

  const handleSubscriptionPage = () => {
    navigation.navigate("SubscriptionPlans")  
  }


  return (

    <View style={{ flex: 1, position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical:30,
    zIndex: 999,
 }}>

  <View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>Smartstay</Text>

        <TouchableOpacity onPress={() =>{
         onClose()
         setTabBar()}
        }>
          <Text style={{ fontSize: 22 }}>✕</Text>
        </TouchableOpacity>

      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>

        <Image
          source={ExpiryImg}
          style={{ width: 260, height: 260 }}

        />

        <Text style={{ fontSize: 26, fontWeight: "800", textAlign: "center", marginTop: 20 }}>
          Your Smartstay Plan{"\n"}has Expired !
        </Text>

        <Text style={{ textAlign: "center", marginTop: 10, color: "#6B7280" }}>
          Renew your plan Now to continue managing the property operations.
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "#1E40AF",
            paddingVertical: 16,
            borderRadius: 14,
            marginTop: 30,
            width: "100%",
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }} onPress={handleSubscriptionPage} >
            Renew Now →
          </Text>
        </TouchableOpacity>

      </View>
      </View>

    </View>

  )

}