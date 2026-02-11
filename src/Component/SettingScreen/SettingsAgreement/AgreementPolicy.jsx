import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  BackHandler,
} from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import RentalIcon from "../../../Assets/Images/security-safe.png";     
import HostelIcon from "../../../Assets/Images/triangle.png";      
import EmptyState from "../../../Assets/Images/Empty_state.png";
import RentalAgreement from "./RentalAgreement";
// import HostelRulesAgreement from "./HostelRulesAgreement";

export default function AgreementPolicy({ navigation }) {
  const [screen, setScreen] = useState("main");

  const {
    canWriteModule: canWriteAgreement,
    canReadModule: canReadAgreement,
    canUpdateModule: canUpdateAgreement,
    // canDeleteModule: canDeleteAgreement,
  } = useHasPermission("Agreement");

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (screen !== "main") {
          setScreen("main");
          return true;
        }
        return false;
      }
    );

    return () => subscription.remove();
  }, [screen]);



  if (screen === "rental") {
    return <RentalAgreement onBack={() => setScreen("main")} />;
  }

//   if (screen === "hostel") {
//     return <HostelRulesAgreement onBack={() => setScreen("main")} />;
//   }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agreement & Policy</Text>
      </View>

            {!canReadAgreement &&  (
               <View style={styles.emptyContainer}>
                 <Image source={EmptyState} style={styles.emptyImage} />
                 <Text style={styles.emptyText}>
                   You do not have access to view Agreement
                 </Text>
               </View>
             )}
      
   {canReadAgreement && (

       <>
      <TouchableOpacity
        style={styles.cardBox}
        onPress={() => setScreen("rental")}
      >
        <View style={[styles.iconBox,]}>
          <Image source={RentalIcon} style={styles.icon} />
        </View>

        <View style={styles.textBox}>
          <Text style={styles.title}>Rental Agreement</Text>
          <Text style={styles.subtitle}>
            Friendly, short-term agreement highlighting stay rules and payments.
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardBox}
        onPress={() => setScreen("hostel")}
      >
        <View style={[styles.iconBox, ]}>
          <Image source={HostelIcon} style={styles.icon} />
        </View>

        <View style={styles.textBox}>
          <Text style={styles.title}>Hostel Rules Agreement</Text>
          <Text style={styles.subtitle}>
            Granting license to occupy without full tenancy rights — ensuring owner protection.
          </Text>
        </View>
      </TouchableOpacity>
</>
 )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 40, flex: 1 },
  
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 10,
  },

  backIcon: { width: 22, height: 22, marginRight: 12, resizeMode: "contain" },

  headerTitle: { fontSize: 20, fontWeight: "600", color: "#1E1E1E" },

  cardBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 18,
    elevation: 4,
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  icon: { width: 26, height: 26 },

  textBox: { flex: 1 },

  title: { fontSize: 17, fontWeight: "600" },

  subtitle: { fontSize: 14, marginTop: 4, color: "#8E8E93" },
  
  emptyContainer: {
  alignItems: "center",
  justifyContent: "center",
  marginTop: 150,
},
emptyImage: {
  width: 180,
  height: 180,
  resizeMode: "contain",
  opacity: 0.8
},

emptyText: {
  marginTop: 14,
  fontSize: 16,
  fontWeight: "600",
  color: "#777",
},
});
