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
import AddTransaction from "./src/Component/MorePages/Banking/AddTransaction";
import ForgotPassword from "./src/Component/ForgotPassword/ForgotPasswordScreen";
import OtpVerification from './src/Component/ForgotPassword/ForgotVerifyOtp';
import SetNewPassword from './src/Component/ForgotPassword/NewPasswordChange';
import SucessUpdatePassword from './src/Component/ForgotPassword/SuccessUpdatePassword'
import AddComplaint from "./src/Component/Complaints/AddComplaints";
import ComplaintDetails from "./src/Component/Complaints/ViewCompliance";
import MoreDesign from './src/Component/MorePages/MoreDesign';
import Assets from './src/Component/MorePages/Assets/Assets';
import Banking from './src/Component/MorePages/Banking/BankingList';
import Electricity from './src/Component/MorePages/Electricity/ElectricityList';
import Expenses from './src/Component/MorePages/Expenses/Expenses'
import AddExpenses from './src/Component/MorePages/Expenses/AddExpenses'
import RoomDetails from './src/Component/MorePages/Electricity/RoomDetails';
import CustomerReading from './src/Component/MorePages/Electricity/CustomerReadingDetails';
import TenantsList from './src/Component/MorePages/Electricity/TenantsList';
import VendorsList from './src/Component/MorePages/Vendors/VendorsList'
import CancelNotice from './src/Component/Customer/Checkout/CancelNotice'


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

              <Navigation.Screen name="ForgotPassword" component={ForgotPassword} />
                <Navigation.Screen name="OtpVerification" component={OtpVerification} />
                 <Navigation.Screen name="SetNewPassword" component={SetNewPassword} />
                  <Navigation.Screen name="SucessUpdatePassword" component={SucessUpdatePassword} />
                    <Navigation.Screen name="ComplaintDetails" component={ComplaintDetails} />
                    <Navigation.Screen name="AddComplaint" component={AddComplaint} />
                     <Navigation.Screen name="MoreDesign" component={MoreDesign} />
                    <Navigation.Screen name="Assets" component={Assets} />
              <Navigation.Screen name="Banking" component={Banking} />
              <Navigation.Screen name="AddTransaction" component={AddTransaction} />
               <Navigation.Screen name="Electricity" component={Electricity} />
               <Navigation.Screen name="RoomDetails" component={RoomDetails} />
               <Navigation.Screen name="Expenses" component={Expenses} />
                <Navigation.Screen name="AddExpenses" component={AddExpenses} />
                 <Navigation.Screen name="TenantsList" component={TenantsList} />
                <Navigation.Screen name="CustomerReading" component={CustomerReading} />
                  <Navigation.Screen name="VendorsList" component={VendorsList} />
                <Navigation.Screen name="CancelNotice" component={CancelNotice} />


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
