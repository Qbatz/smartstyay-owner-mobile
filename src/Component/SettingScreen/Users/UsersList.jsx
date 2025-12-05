import React,{useCallback} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,BackHandler
} from "react-native";

import MenuIcon from "../../../Assets/Images/3dots.png";
import PlusIcon from "../../../Assets/Images/TenantAddBlue.png";
import { useFocusEffect } from '@react-navigation/native';
import BackArrow from "../../../Assets/Images/Arrow_left.png"

export default function UsersScreen({navigation}) {
  const users = [
    { name: "Kavitha", role: "Accounts Manager", email: "kavitha@gmail.com", phone: "+91 98765 43210" },
    { name: "Vishwa", role: "Accounts Manager", email: "vishwa@gmail.com", phone: "+91 98765 43210" },
    { name: "Mukesh", role: "Accounts Manager", email: "mukesh@gmail.com", phone: "+91 98765 43210" },
    { name: "Sri Dharan", role: "Office Admin", email: "mukesh@gmail.com", phone: "+91 98765 43210" },
    
  ];
   useFocusEffect(
       useCallback(() => {
         const onBackPress = () => {
         
     
           if (navigation.canGoBack()) {
             navigation.goBack();
             return true;
           }
     
           return false;
         };
     
         const subscription = BackHandler.addEventListener(
           "hardwareBackPress",
           onBackPress
         );
     
         return () => subscription.remove();
       }, [ navigation])
     );

  return (
    <View style={styles.container}>
      
 
      <View style={styles.header}>
       <TouchableOpacity onPress={() => navigation.goBack()}>

  <Image source={BackArrow} style={styles.backArrow}/>
</TouchableOpacity>
        <Text style={styles.headerTitle}>Users</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {users.map((u, i) => (
          <View key={i} style={styles.card}>
            
            {/* Top row */}
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.name}>{u.name}</Text>
                <Text style={styles.role}>{u.role}</Text>
              </View>

              <TouchableOpacity style={styles.menuIconWrap}>
                <Image source={MenuIcon} style={styles.menuIcon} />
              </TouchableOpacity>
            </View>

            {/* info rows */}
            <View style={styles.rowBetween}>
              <View style={{ width: "50%" }}>
                <Text style={styles.label}>Email ID</Text>
                <Text style={styles.value}>{u.email}</Text>
              </View>

              <View>
                <Text style={styles.label}>Contact Number</Text>
                <Text style={styles.value}>{u.phone}</Text>
              </View>
            </View>

          </View>
        ))}
      </ScrollView>

    
      <TouchableOpacity style={styles.fab}>
        <Image source={PlusIcon} style={styles.fabIcon} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    paddingTop:20
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  backArrow: {
  width:20,
  height:20,
  marginRight:8
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
  },

  role: {
    fontSize: 14,
    color: "#1E9C4B",
    marginTop: 2,
  },

  label: {
    fontSize: 12,
    color: "#777",
  },

  value: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },

  menuIconWrap: {
    padding: 6,
  },

  menuIcon: {
    width: 20,
    height: 20,
  },

  fab: {
    position: "absolute",
    bottom: 64,
    right: 24,
    
  
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
   
  },

  fabIcon: {
    width: 44,
    height: 44,
   
  },
});
