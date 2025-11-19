import React,{useState} from "react";
import { View, Image } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../Dashboard/DashboardPage";
import Tenant from "../Customer/Tenants";
import Complaints from "../Complaints/Complaints";
import PGList from "../PG/PGList";
import MoreStack from "../MorePages/MoreMainPage";

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
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  

  return (
   <View
  style={{
    flexDirection: "row",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#fff",
    elevation: 8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  }}
>

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            onPress={() => navigation.navigate(route.name)}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={isFocused ? icons[route.name].active : icons[route.name].inactive}
              style={{ width: 26, height: 26 }}
            />

            <Text style={{ marginTop: 4, fontSize: 12, color: isFocused ? "#1E45E1" : "#999" }}>
              {route.name}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
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
      
      <Tab.Screen name="PG" component={PGList} />
      <Tab.Screen name="Complaints" component={Complaints}  initialParams={{ setShowTabBar }}/>
      <Tab.Screen name="More" component={MoreStack}   initialParams={{ setShowTabBar }}/>
    </Tab.Navigator>
  );
}
