import React,{useState} from "react";
import { View, Image, } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";


import HomeScreen from "../Dashboard/DashboardPage";
import Tenant from "../Customer/Tenants";
import Complaints from "../Complaints/Complaints";
import PGList from "../PG/PGList";
import MoreDesign from "../MorePages/MoreDesign";

import HomeActive from "../../Assets/Images/home_active_icon.png";
import HomeInActive from "../../Assets/Images/home_inactive.png";
import TenantActive from "../../Assets/Images/Tenant_active.png";
import TenantInActive from "../../Assets/Images/Tenant_inactive.png";
import PGActive from "../../Assets/Images/PG_active.png";
import PGInActive from "../../Assets/Images/PG_Inactive.png";
import ComplaintActive from "../../Assets/Images/Complaint_active.png";
import ComplaintInActive from "../../Assets/Images/complaint_Inactive.png";
import MoreActive from "../../Assets/Images/More_Active.png";
import MoreInActive from "../../Assets/Images/More_Inactive.png";

const Tab = createBottomTabNavigator();

const icons = {
  Home: { active: HomeActive, inactive: HomeInActive },
  customer: { active: TenantActive, inactive: TenantInActive },
  PG: { active: PGActive, inactive: PGInActive },
  Complaints: { active: ComplaintActive, inactive: ComplaintInActive },
  More: { active: MoreActive, inactive: MoreInActive },
};

function MyTabBar({ state, descriptors, navigation }) {
  const { buildHref } = useLinkBuilder();

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 10,
        }}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          return (
            <PlatformPressable
              key={route.key}
              href={buildHref(route.name, route.params)}
              onPress={() => navigation.navigate(route.name)}
              android_ripple={{ color: "#EAF0FF" }}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={
                  isFocused
                    ? icons[route.name].active
                    : icons[route.name].inactive
                }
                style={{ width: 26, height: 26 }}
              />

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: isFocused ? "#1E45E1" : "#999",
                  fontWeight: isFocused ? "600" : "400",
                }}
              >
                {route.name}
              </Text>
            </PlatformPressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}


export default function MyTabs() {
    const [showTabBar, setShowTabBar] = useState(true);
 return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{ headerShown: false }}
      tabBar={(props) =>
        showTabBar ? <MyTabBar {...props} /> : null
      }
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ setShowTabBar }}
      />
      <Tab.Screen 
        name="customer" 
        component={Tenant} 
        initialParams={{ setShowTabBar }}
      />
      
      <Tab.Screen name="PG" component={PGList}   initialParams={{ setShowTabBar }} />
      <Tab.Screen name="Complaints" component={Complaints}  initialParams={{ setShowTabBar }}/>
      <Tab.Screen name="More" component={MoreDesign}   initialParams={{ setShowTabBar }}/>
    </Tab.Navigator>
  );
}
