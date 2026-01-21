import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useState } from "react";
import { View } from "react-native";

import MyTabs from '../src/Component/Tabs/BottomTabs'
import AddTenant from "../src/Component/Customer/AddTenants";
import TenantCheckIn from "../src/Component/Customer/TenantCheckIn";
import AddWalkin from "../src/Component/Customer/AddWalkin";
import FinalSettlement from "../src/Component/Customer/FinalSettlement";
import ForgotPassword from "../src/Component/ForgotPassword/ForgotPasswordScreen";
import OtpVerification from "../src/Component/ForgotPassword/ForgotVerifyOtp";
import SetNewPassword from "../src/Component/ForgotPassword/NewPasswordChange";
import SucessUpdatePassword from "../src/Component/ForgotPassword/SuccessUpdatePassword";
import ComplaintDetails from "../src/Component/Complaints/ViewCompliance";
import AddComplaint from "../src/Component/Complaints/AddComplaints";
import MoreDesign from "../src/Component/MorePages/MoreDesign";
import Assets from "../src/Component/MorePages/Assets/Assets";
import BankingScreen from "../src/Component/MorePages/Banking/BankingList";
import AddTransaction from "../src/Component/MorePages/Banking/AddTransaction";
import Electricity from "../src/Component/MorePages/Electricity/ElectricityList";
import RoomDetails from "../src/Component/MorePages/Electricity/RoomDetails";
import ExpensesScreen from "../src/Component/MorePages/Expenses/Expenses";
import AddExpenses from "../src/Component/MorePages/Expenses/AddExpenses";
import TenantsList from "../src/Component/MorePages/Electricity/TenantsList";
import CustomerReading from "../src/Component/MorePages/Electricity/CustomerReadingDetails";
import VendorsList from "../src/Component/MorePages/Vendors/VendorsList";
import CancelNotice from "../src/Component/Customer/Checkout/CancelNotice";
import SettingsScreen from "../src/Component/SettingScreen/SettingScreen";
import GeneralDetailsScreen from "../src/Component/SettingScreen/GeneralPages/General";
import BillsDesign from "../src/Component/MorePages/Bills/Bills";
import AddGeneralScreen from "../src/Component/SettingScreen/GeneralPages/AddGeneralScreen";
import NotificationDetails from "../src/Component/Dashboard/Notification";
import ChangeHostelScreen from "../src/Component/Dashboard/ChangeHostel";
import ProfileDrawer from "../src/Component/Dashboard/ProfileClickScreen";
import ProfileScreen from "../src/Component/Dashboard/ChangeProfile";
import CreateBill from "./Component/MorePages/Bills/CreateBill";
import BillsPdfDesign from "./Component/MorePages/Bills/BillsPdf";
import AssignTenant from "../src/Component/PG/AssignTenants";
import ReceiptPdfViewer from "../src/Component/MorePages/Bills/ReceiptPdf";
import SettingsPG from "../src/Component/SettingScreen/SettingsPG/SettingsPGList";
import AddPG from "../src/Component/SettingScreen/SettingsPG/AddPG";
import SecuritySettings from "../src/Component/SettingScreen/Security/SettingSecurity";
import CreateReceipt from "../src/Component/MorePages/Bills/CreateReceipt";
import ElectricitySettings from "../src/Component/SettingScreen/SettingsElectricity/SettingsElectricity";
import ReserveToCheckin from "../src/Component/PG/ReservedBed/ReservedToCheckin";
import ComplaintsSettings from "../src/Component/SettingScreen/ComplaintType/ComplaintsTypeSettings";
import ReassignBedScreen from "../src/Component/PG/OccupiedBed/ReAssignBed";
import ExpensesSettings from "../src/Component/SettingScreen/ExpensesCategory/SettingsExpenses";
import Integration from "../src/Component/SettingScreen/Integration/Integration";
import UsersScreen from "../src/Component/SettingScreen/Users/UsersList";
import AmenitySettings from "../src/Component/SettingScreen/Amenity/AmenitySettings";
import BillingRuleScreen from "../src/Component/SettingScreen/BillingRule/BillingRuleList";
import LongStayRecurring from "../src/Component/SettingScreen/BillingRule/LongStayRecurring";
import RolesScreen from "../src/Component/SettingScreen/RoleScreen/RoleList";
import BillTemplateSettings from "../src/Component/SettingScreen/BillTemplate/SettingsBillTemplate";
import SubscriptionPlans from "../src/Component/SettingScreen/Subscription/SubscriptionPlan";
import PlanDetailsScreen from "../src/Component/SettingScreen/Subscription/PlanDetailsScreen";
import AgreementPolicy from "../src/Component/SettingScreen/SettingsAgreement/AgreementPolicy";
import BookingCheckIn from "../src/Component/Customer/BookingToCheckin";
import PGPageFull from "../src/Component/PG/PGList";
import AddBookingScreen from "../src/Component/Customer/AddBooking";
import EnterMPin from "../src/Component/CreateAccount/EnterPin";
import { LoginContexts } from "./Context/LoginContext";
import CreateMpin from "../src/Component/CreateAccount/CreatePin";
import ConfirmMPin from "../src/Component/CreateAccount/ConfirmPin";
import CustomerOverviewScreen from "../src/Component/Customer/CustomerOverview/CustomerOverviewSheet"
import Reports from  "../src/Component/MorePages/Reports/Reports";
import FinalSettlementScreen from "../src/Component/Customer/FinalSettlementNew"

const SuccessFlow = (props) => {

    const Navigation = createStackNavigator();
    const [isMpinVerified, setMpinVerified] = useState(false);
    const loginContext = useContext(LoginContexts)

    const verifiedMpin = () => {
        setMpinVerified(true)
    }

    return <View style={{ flex: 1 }}>

        
        {console.log(loginContext.pinVerifid,loginContext.getRoute)}
        

       

        {loginContext.getRoute === "ConfirmMpin" || loginContext.pinVerifid ?

            <NavigationContainer>
                <Navigation.Navigator screenOptions={{headerShown:false}}>

                    <Navigation.Screen name="MyTabs" component={MyTabs} />
                    <Navigation.Screen name="AddTenant" component={AddTenant} />
                    <Navigation.Screen name="TenantCheckin" component={TenantCheckIn} />
                    <Navigation.Screen name="AddBooking" component={AddBookingScreen} />
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
                    <Navigation.Screen name="Banking" component={BankingScreen} />
                    <Navigation.Screen name="AddTransaction" component={AddTransaction} />
                    <Navigation.Screen name="Electricity" component={Electricity} />
                    <Navigation.Screen name="RoomDetails" component={RoomDetails} />
                    <Navigation.Screen name="Expenses" component={ExpensesScreen} />
                    <Navigation.Screen name="AddExpenses" component={AddExpenses} />
                    <Navigation.Screen name="TenantsList" component={TenantsList} />
                    <Navigation.Screen name="CustomerReading" component={CustomerReading} />
                    <Navigation.Screen name="VendorsList" component={VendorsList} />
                    <Navigation.Screen name="CancelNotice" component={CancelNotice} />
                    <Navigation.Screen name="SettingsScreen" component={SettingsScreen} />
                    <Navigation.Screen name="GeneralDetailsScreen" component={GeneralDetailsScreen} />
                    <Navigation.Screen name="Bills" component={BillsDesign} />
                    <Navigation.Screen name="AddGeneralScreen" component={AddGeneralScreen} />
                    <Navigation.Screen name="NotificationDetails" component={NotificationDetails} />
                    <Navigation.Screen name="ChangeHostelScreen" component={ChangeHostelScreen} />
                    <Navigation.Screen name="ProfileDrawer" component={ProfileDrawer} />
                    <Navigation.Screen name="ProfileScreen" component={ProfileScreen} />
                    <Navigation.Screen name="CreateBills" component={CreateBill} />
                    <Navigation.Screen name="BillsPdf" component={BillsPdfDesign} />

                    <Navigation.Screen name="AssignTenant" component={AssignTenant} />

                    <Navigation.Screen name="ReceiptPdf" component={ReceiptPdfViewer} />
                    <Navigation.Screen name="SettingsPG" component={SettingsPG} />
                    <Navigation.Screen name="AddPG" component={AddPG} />
                    <Navigation.Screen name="SettingsSecurity" component={SecuritySettings} />
                    <Navigation.Screen name="CreateReceipt" component={CreateReceipt} />
                    <Navigation.Screen name="SettingsElectricity" component={ElectricitySettings} />
                    <Navigation.Screen name="ReserveToCheckin" component={ReserveToCheckin} />
                    <Navigation.Screen name="ComplaintType" component={ComplaintsSettings} />
                    <Navigation.Screen name="ReassignBedScreen" component={ReassignBedScreen} />
                    <Navigation.Screen name="ExpensesCategory" component={ExpensesSettings} />
                    <Navigation.Screen name="Integration" component={Integration} />
                    <Navigation.Screen name="UsersScreen" component={UsersScreen} />
                    <Navigation.Screen name="SettingsAmenity" component={AmenitySettings} />
                    <Navigation.Screen name="BillingRuleScreen" component={BillingRuleScreen} />
                    <Navigation.Screen name="LongStayRecurring" component={LongStayRecurring} />
                    <Navigation.Screen name="RolesScreen" component={RolesScreen} />
                    <Navigation.Screen name="BillTemplate" component={BillTemplateSettings} />
                    <Navigation.Screen name="SubscriptionPlans" component={SubscriptionPlans} />
                    <Navigation.Screen name="PlanDetailsScreen" component={PlanDetailsScreen} />
                    <Navigation.Screen name="Agreement" component={AgreementPolicy} />
                    <Navigation.Screen name="BookingCheckIn" component={BookingCheckIn} />
                    <Navigation.Screen name="PG" component={PGPageFull} />
                    <Navigation.Screen name="Reports" component={Reports} />
                     <Navigation.Screen name="CustomerOverviewScreen" component={CustomerOverviewScreen} />
                      <Navigation.Screen name="FinalSettlementScreen" component={FinalSettlementScreen} />

                </Navigation.Navigator>
            </NavigationContainer>

             :

            <NavigationContainer>
                <Navigation.Navigator screenOptions={{headerShown:false}}>
                    <Navigation.Screen name="EnterMpin" component={EnterMPin}/>
                      <Navigation.Screen name="CreateMpin" component={CreateMpin} />
           <Navigation.Screen name="ConfirmMPin" component={ConfirmMPin} />
                </Navigation.Navigator>
            </NavigationContainer>}

    </View>

}
export default SuccessFlow;