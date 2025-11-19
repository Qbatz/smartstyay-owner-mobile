/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// import LoginDesign from "./src/Component/Login.jsx"
// import CreateAccount from "./src/Component/CreateAccount.jsx"

import SplashScreen from './src/Component/WelcomScreen/SplashScreen';
import LandingScreen from './src/Component/WelcomScreen/LandingScreen'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashText from './src/Component/WelcomScreen/SplashText';
import CreateAccount from './src/Component/CreateAccount/CreateAccount';
import LoginDesign from './src/Component/CreateAccount/Login'
import VerifyAccountScreen from './src/Component/CreateAccount/VerifyOtp';
import MyTabs from "./src/Component/Tabs/BottomTabs";
import AddTenant from "./src/Component/Customer/AddTenants";
import TenantCheckin from  "./src/Component/Customer/TenantCheckIn";
import AddBooking from "./src/Component/Customer/AddBooking";
import AddWalkin from "./src/Component/Customer/AddWalkin";
import FinalSettlement from "./src/Component/Customer/FinalSettlement";
import AddComplaint from "./src/Component/Complaints/AddComplaints";

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {

  const Navigation = createStackNavigator();

  return (

    <View style={styles.container}>

      <NavigationContainer>
        <Navigation.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="MyTabs"
        >
          <Navigation.Screen name="SplashText" component={SplashText} />
          <Navigation.Screen name="SplashScreen" component={SplashScreen} />
          <Navigation.Screen name="LandingScreen" component={LandingScreen} />
           <Navigation.Screen name="CreateAccount" component={CreateAccount} />
             <Navigation.Screen name="LoginDesign" component={LoginDesign} />
              <Navigation.Screen name="VerifyAccountScreen" component={VerifyAccountScreen} />
                <Navigation.Screen name="MyTabs" component={MyTabs} />
                <Navigation.Screen name="AddTenant" component={AddTenant} />
                  <Navigation.Screen name="TenantCheckin" component={TenantCheckin} />
            <Navigation.Screen name="AddBooking" component={AddBooking} />
            <Navigation.Screen name="AddWalkin" component={AddWalkin} />
             <Navigation.Screen name="FinalSettlement" component={FinalSettlement} />
    <Navigation.Screen name="AddComplaint" component={AddComplaint} />
             
        </Navigation.Navigator>
      </NavigationContainer>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
