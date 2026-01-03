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

import React, { useContext, useEffect, useState } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GeneralProvider } from './src/Context/GeneralContext';


// import LoginDesign from "./src/Component/Login.jsx"
// import CreateAccount from "./src/Component/CreateAccount.jsx"
import { LoginContexts } from './src/Context/LoginContext';
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
import TenantCheckin from "./src/Component/Customer/TenantCheckIn";
import BookingCheckIn from "./src/Component/Customer/BookingToCheckin"
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
import CancelNotice from './src/Component/Customer/Checkout/CancelNotice';
import SettingsScreen from './src/Component/SettingScreen/SettingScreen';
import Bills from './src/Component/MorePages/Bills/Bills';
import GeneralDetailsScreen from './src/Component/SettingScreen/GeneralPages/General';
import AddGeneralScreen from './src/Component/SettingScreen/GeneralPages/AddGeneralScreen';
import NotificationDetails from './src/Component/Dashboard/Notification';
import ChangeHostelScreen from './src/Component/Dashboard/ChangeHostel';
import ProfileDrawer from './src/Component/Dashboard/ProfileClickScreen';
import ProfileScreen from './src/Component/Dashboard/ChangeProfile';
import AssignTenant from './src/Component/PG/AssignTenants'

import CreateBills from './src/Component/MorePages/Bills/CreateBill';
import BillsPdf from './src/Component/MorePages/Bills/BillsPdf';
import ReceiptPdf from './src/Component/MorePages/Bills/ReceiptPdf';
import SettingsPG from './src/Component/SettingScreen/SettingsPG/SettingsPGList';
import AddPG from './src/Component/SettingScreen/SettingsPG/AddPG';
import SettingsSecurity from './src/Component/SettingScreen/Security/SettingSecurity';
import CreateReceipt from './src/Component/MorePages/Bills/CreateReceipt';
import SettingsElectricity from './src/Component/SettingScreen/SettingsElectricity/SettingsElectricity';
import ReserveToCheckin from './src/Component/PG/ReservedBed/ReservedToCheckin'
import ComplaintType from './src/Component/SettingScreen/ComplaintType/ComplaintsTypeSettings';
import ReassignBedScreen from './src/Component/PG/OccupiedBed/ReAssignBed'
import ExpensesCategory from './src/Component/SettingScreen/ExpensesCategory/SettingsExpenses';
import UsersScreen from './src/Component/SettingScreen/Users/UsersList'
import SettingsAmenity from './src/Component/SettingScreen/Amenity/AmenitySettings'
import BillingRuleScreen from './src/Component/SettingScreen/BillingRule/BillingRuleList';
import LongStayRecurring from './src/Component/SettingScreen/BillingRule/LongStayRecurring';
import RolesScreen from "./src/Component/SettingScreen/RoleScreen/RoleList"
import BillTemplate from "./src/Component/SettingScreen/BillTemplate/SettingsBillTemplate";
import SubscriptionPlans from './src/Component/SettingScreen/Subscription/SubscriptionPlan';
import PlanDetailsScreen from './src/Component/SettingScreen/Subscription/PlanDetailsScreen'
import Agreement from './src/Component/SettingScreen/SettingsAgreement/AgreementPolicy';
import PGPageFull from './src/Component/PG/PGList';
import LoginContext from './src/Context/LoginContext';
import CommonContext from './src/Context/CommonContext'
import PGContext from './src/Context/PGContext';
import ComplaintProvider from "./src/Context/ComplaintContext";
import { SettingProvider } from "./src/Context/SettingContext";
import ExpensesProvider from "./src/Context/ExpensesContext"
import AmenityProvider from "./src/Context/AmenityContext";
import { CustomerProvider } from "./src/Context/CustomerContext";

import BillsProvider from "./src/Context/BillsContext"

import { FloorProvider } from './src/Context/PayingGuestContext';
import BankingProvider from "./src/Context/BankingContext";
import ElectricityProvider from "./src/Context/ElectricityContext"
import CreateMpin from "./src/Component/CreateAccount/CreatePin"
import EnterMPin from "./src/Component/CreateAccount/EnterPin"
import ConfirmMPin from "./src/Component/CreateAccount/ConfirmPin"
import { retriveData } from './src/Utils/Storage';
import { LOGGEDIN, USER_ID } from './src/Utils/Constant';
import SuccessFlow from './src/SuccessFlow'


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const [userId, setUserId] = useState();

  useEffect(() => {
     retriveData(USER_ID).then(result => {
      console.log("app userId", result)
     setUserId(result)
    })
  }, [])

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'light-content'} backgroundColor={'#1A73E8F0'} />
      <LoginContext>
        <CommonContext>
          <GeneralProvider>
            <PGContext>
              <ComplaintProvider>
                <SettingProvider>
                  <ExpensesProvider>
                    <AmenityProvider>
                      <CustomerProvider>

                        <BillsProvider>
                          <FloorProvider>
                            <BankingProvider>
                              <ElectricityProvider>
                                <AppContent userId={userId}/>
                              </ElectricityProvider>
                            </BankingProvider>
                          </FloorProvider>
                        </BillsProvider>

                      </CustomerProvider>
                    </AmenityProvider>
                  </ExpensesProvider>
                </SettingProvider>
              </ComplaintProvider >
            </PGContext>
          </GeneralProvider>
        </CommonContext>
      </LoginContext>
    </SafeAreaProvider>
  );
}

function AppContent(props) {
  const loginContext = useContext(LoginContexts);

  const Navigation = createStackNavigator();
  const [isLoggedIn,setIsLoggedIn]=useState()
  const [pinVerify, setPinVerify] = useState()

  console.log(isLoggedIn)

  useEffect(()=>{
    retriveData(LOGGEDIN).then(r=>{
        setIsLoggedIn(r)
        console.log(r)
    })

   
  },[])

  useEffect(() => {
     if (props.userId) {
  console.log("props userId", props.userId)
  console.log("login context", loginContext)
      loginContext?.updateUserId(props.userId)
    }
  }, [props.userId, loginContext])


  console.log(loginContext)

  useEffect(() => {
    if (loginContext?.LoggedIN) {
      setIsLoggedIn('true')

    }
  }, [loginContext?.LoggedIN]) 

  useEffect(() => {
    if (!loginContext?.requiredPinSetup) {
        setPinVerify(true)
    }
    setPinVerify(false)
  }, [loginContext?.requiredPinSetup])



  return (

    <View style={styles.container}>


      {isLoggedIn === "true" ?  <SuccessFlow/>: 
      <NavigationContainer>
        <Navigation.Navigator screenOptions={{headerShown:false}}>
          <Navigation.Screen name="SplashText" component={SplashText} />
          <Navigation.Screen name="SplashScreen" component={SplashScreen} />
          <Navigation.Screen name="LandingScreen" component={LandingScreen} />
          <Navigation.Screen name="CreateAccount" component={CreateAccount} />
          <Navigation.Screen name="LoginDesign" component={LoginDesign} />
          <Navigation.Screen name="CreateMpin" component={CreateMpin} />
          
        </Navigation.Navigator>
        </NavigationContainer>}

      {/* <NavigationContainer>
        <Navigation.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="SplashText"
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
          <Navigation.Screen name="SettingsScreen" component={SettingsScreen} />
          <Navigation.Screen name="GeneralDetailsScreen" component={GeneralDetailsScreen} />
          <Navigation.Screen name="Bills" component={Bills} />
          <Navigation.Screen name="AddGeneralScreen" component={AddGeneralScreen} />
          <Navigation.Screen name="NotificationDetails" component={NotificationDetails} />
          <Navigation.Screen name="ChangeHostelScreen" component={ChangeHostelScreen} />
          <Navigation.Screen name="ProfileDrawer" component={ProfileDrawer} />
          <Navigation.Screen name="ProfileScreen" component={ProfileScreen} />
          <Navigation.Screen name="CreateBills" component={CreateBills} />
          <Navigation.Screen name="BillsPdf" component={BillsPdf} />

          <Navigation.Screen name="AssignTenant" component={AssignTenant} />

          <Navigation.Screen name="ReceiptPdf" component={ReceiptPdf} />
          <Navigation.Screen name="SettingsPG" component={SettingsPG} />
          <Navigation.Screen name="AddPG" component={AddPG} />
          <Navigation.Screen name="SettingsSecurity" component={SettingsSecurity} />
          <Navigation.Screen name="CreateReceipt" component={CreateReceipt} />
          <Navigation.Screen name="SettingsElectricity" component={SettingsElectricity} />
          <Navigation.Screen name="ReserveToCheckin" component={ReserveToCheckin} />
          <Navigation.Screen name="ComplaintType" component={ComplaintType} />
          <Navigation.Screen name="ReassignBedScreen" component={ReassignBedScreen} />
          <Navigation.Screen name="ExpensesCategory" component={ExpensesCategory} />
          <Navigation.Screen name="UsersScreen" component={UsersScreen} />
          <Navigation.Screen name="SettingsAmenity" component={SettingsAmenity} />
          <Navigation.Screen name="BillingRuleScreen" component={BillingRuleScreen} />
          <Navigation.Screen name="LongStayRecurring" component={LongStayRecurring} />
          <Navigation.Screen name="RolesScreen" component={RolesScreen} />
          <Navigation.Screen name="BillTemplate" component={BillTemplate} />
          <Navigation.Screen name="SubscriptionPlans" component={SubscriptionPlans} />
          <Navigation.Screen name="PlanDetailsScreen" component={PlanDetailsScreen} />
          <Navigation.Screen name="Agreement" component={Agreement} />
          <Navigation.Screen name="BookingCheckIn" component={BookingCheckIn} />
          <Navigation.Screen name="PG" component={PGPageFull} />

          <Navigation.Screen name="CreateMpin" component={CreateMpin} />
          <Navigation.Screen name="ConfirmMPin" component={ConfirmMPin} />
          <Navigation.Screen name="EnterMPin" component={EnterMPin} />

        </Navigation.Navigator>
      </NavigationContainer> */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
