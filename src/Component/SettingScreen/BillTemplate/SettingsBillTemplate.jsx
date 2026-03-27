import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, BackHandler } from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import BillIcon from "../../../Assets/Images/Global_Bill_Icon.png";
import TemplateIcon from "../../../Assets/Images/Bill_Template_Icon.png";
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import GlobalBillSettings from "./GlobalBillSettings";
import TemplateSettings from "./Templates";

export default function BillTemplateSettings({navigation}) {
  const [screen, setScreen] = useState("main");

    const {
    // canWriteModule: canWriteProfile,
    canReadModule: canReadInvoice,
    canUpdateModule: canUpdateInvoice,
    // canDeleteModule: canDeleteProfile,
  } = useHasPermission("Bills");

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screen !== "main") {
        setScreen("main");
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [screen]);

   useEffect(() => {
                    const backHandler = BackHandler.addEventListener(
                      "hardwareBackPress",
                      () => {
                        navigation.goBack();  
                        return true;
                      }
                    );
                  
                    return () => backHandler.remove();
                  }, [])



  // 🔥 If user selects Global bill screen
  if (screen === "global") {
    return <GlobalBillSettings onBack={() => setScreen("main")} />;
  }

  // 🔥 If user selects Template screen
  if (screen === "template") {
    return <TemplateSettings onBack={() => setScreen("main")} />;
  }

  // 🔥 Main UI
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={()=> navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Templates</Text>
      </View>

       {!canReadInvoice &&  (
                     <View style={styles.emptyContainer}>
                       <Image source={EmptyState} style={{ width: 250, height: 160, marginBottom: 16 }}  />
                       <Text style={styles.emptyText}>
                         You do not have access to view Bill Templates
                       </Text>
                     </View>
                   )}


        {canReadInvoice &&  (
          <>
      <TouchableOpacity style={styles.cardBox} onPress={() => setScreen("global")}>
        <View style={[styles.iconBox, { backgroundColor: "#E7F7EC" }]}>
          <Image source={BillIcon} style={styles.icon} />
        </View>

        <View style={styles.textBox}>
          <Text style={styles.title}>Global Bill Settings</Text>
          <Text style={styles.subtitle}>Add your basic billing details here</Text>
        </View>
      </TouchableOpacity>

  
      <TouchableOpacity style={styles.cardBox} onPress={() => setScreen("template")}>
        <View style={[styles.iconBox, { backgroundColor: "#F3E8FF" }]}>
          <Image source={TemplateIcon} style={styles.icon} />
        </View>

        <View style={styles.textBox}>
          <Text style={styles.title}>Templates</Text>
          <Text style={styles.subtitle}>Fill the template form with details you'd like to customize.</Text>
        </View>
      </TouchableOpacity>
      </>
        )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 10,
  },
  backIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 20,
   fontFamily:"Gilroy-Bold",
    color: "#1E1E1E",
  },
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
  icon: {
    width: 26,
    height: 26,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontFamily:'Gilroy-Semibold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily:"Gilroy-Medium",
    marginTop: 4,
    color: "#8E8E93",
  },
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
  fontFamily:'Gilroy-Medium',
  color: "#777",
},
});
