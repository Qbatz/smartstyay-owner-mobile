import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MoreDesign from "./MoreDesign.jsx";
import Assets from "../Assets/Assets.jsx";

const Stack = createStackNavigator();

export default function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="More" component={MoreDesign} />
      <Stack.Screen name="Assets" component={Assets} />
    </Stack.Navigator>
  );
}
