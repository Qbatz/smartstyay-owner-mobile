
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView , 
} from "react-native";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import ExpiryImg from "../Assets/Images/subscription_expiry.png"; 


export default function SubscriptionExpired() {


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


return (

<View style={{flex:1,backgroundColor:"#fff"}}>

<View style={{flexDirection:"row",justifyContent:"space-between",padding:20}}>
<Text style={{fontSize:20,fontWeight:"700"}}>Smartstay</Text>

<TouchableOpacity onPress={() =>
    navigation.reset({
      index: 0,
      routes: [{ name: "MyTabs" }],
    })
  }>
<Text style={{fontSize:22}}>✕</Text>
</TouchableOpacity>

</View>

<View style={{flex:1,justifyContent:"center",alignItems:"center",padding:20}}>

<Image
source={ExpiryImg}
style={{width:260,height:260}}

/>

<Text style={{fontSize:26,fontWeight:"800",textAlign:"center",marginTop:20}}>
Your Smartstay Plan{"\n"}has Expired !
</Text>

<Text style={{textAlign:"center",marginTop:10,color:"#6B7280"}}>
Renew your plan Now to continue managing the property operations.
</Text>

<TouchableOpacity
style={{
backgroundColor:"#1E40AF",
paddingVertical:16,
borderRadius:14,
marginTop:30,
width:"100%",
alignItems:"center"
}}
>
<Text style={{color:"#fff",fontWeight:"700",fontSize:16}}>
Renew Now →
</Text>
</TouchableOpacity>

</View>

</View>

)

}