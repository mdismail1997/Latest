import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  View
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import TabBar from '../navigation/TabBar';
import CalendarScreen from '../screens/CalendarScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SalesReportScreen from '../screens/SalesReportScreen';
import SmsMarketingScreen from '../screens/SmsMarketingScreen';
import WaitListScreen from '../screens/WaitListScreen';
import ClientsScreen from '../screens/ClientsScreen';
import StaffScreen from '../screens/StaffScreen';
import BlockedTimeScreen from '../screens/BlockedTimeScreen';
import ServiceScreen from '../screens/ServiceScreen';

import ManageEgiftScreen from '../screens/ManageEgiftScreen';
import SmsTrackingScreen from '../screens/SmsTrackingScreen';
import ChargedNewClientScreen from '../screens/ChargedNewClientScreen';
import MoreScreen from '../screens/MoreScreen';
import ScanBarCodeScreen from '../screens/ScanBarCodeScreen';

import DailyReportsScreen from '../screens/DailyReportsScreen';
import WeeklyReportsScreen from '../screens/WeeklyReportsScreen';
import MonthlyReportsScreen from '../screens/MonthlyReportsScreen';
import { color } from '../assets/colors/colors';
// import CheckinSectionScreen from '../screens/CheckinSectionScreen';

// import PayoutScreen from '../screens/PayoutScreen';
const Tab = createBottomTabNavigator();
const CalendarStack = createStackNavigator();
const DashboardStack = createStackNavigator();
const SalesReportStack = createStackNavigator();
const SmsMarketingStack = createStackNavigator();
const WaitListScreenStack = createStackNavigator();
const ClientsStack = createStackNavigator();
const StaffScreenStack = createStackNavigator();
const BlockedTimeScreenStack = createStackNavigator();
const ServiceScreenStack = createStackNavigator();
const ManageEgiftStack = createStackNavigator();
const SmsTrackingStack = createStackNavigator();
const ChargedNewClientStack = createStackNavigator();
const MoreStack = createStackNavigator();
const ScanbarcodeStack = createStackNavigator();
const ApplyLanguageStack = createStackNavigator();
const DailyReportsStack = createStackNavigator();
const WeeklyReportsStack = createStackNavigator();
const MonthlyReportsStack = createStackNavigator();
let widthScreen = Dimensions.get("window").width;
let widthTab = widthScreen / 7
;
if(widthTab < 100){
  widthTab = 100;
}
const BottomTabNavigator = ({navigation, route}) => {
  return(
    <Tab.Navigator initialRouteName="calendar" tabBar={props => <TabBar {...props} />}>
  {route.params.role == 4 &&
        <Tab.Screen
        name="dashboard"
        initialParams={route.params}
        component={DashboardStackScreen}
      />
  }
        
    <Tab.Screen
        name="calendar"
        initialParams={route.params}
        component={CalendarStackScreen}
      />
      {route.params.role == 4 &&
            <Tab.Screen
              name="waitlist"
              initialParams={route.params}
              component={WaitListStackScreen}
            />
      }
      {route.params.role == 9 &&
      <Tab.Screen
        name="clients"
        initialParams={route.params}
        component={ClientsStackScreen}
      />
      }
      {route.params.role == 9 &&
            <Tab.Screen
        name="blockedtime"
        initialParams={route.params}
        component={BlockedTimeStackScreen}
      />
      }
      <Tab.Screen
        name="more"
        initialParams={route.params}
        component={MoreStackScreen}
      />
      {route.params.role == 9 &&
            <Tab.Screen
        name="dailyreports"
        initialParams={route.params}
        component={DailyReportsStackScreen}
      />
      }
      {route.params.role == 9 &&
        <Tab.Screen
        name="weeklyreports"
        initialParams={route.params}
        component={WeeklyReportsStackScreen}
      />
      }
      {route.params.role == 9 &&
      <Tab.Screen
        name="monthlyreports"
        initialParams={route.params}
        component={MonthlyReportsStackScreen}
      />
      }
      {route.params.role == 4 &&
      <Tab.Screen
        name="smsmarketing"
        initialParams={route.params}
        component={SmsMarketingStackScreen}
      />
      }
      {route.params.role == 4 &&
      <Tab.Screen
        name="salesreport"
        initialParams={route.params}
        component={SalesReportStackScreen}
      />}
      {route.params.role == 4 &&
        <Tab.Screen
        name="clients"
        initialParams={route.params}
        component={ClientsStackScreen}
      />}
      {route.params.role == 4 &&
        <Tab.Screen
        name="staff"
        initialParams={route.params}
        component={StaffStackScreen}
      />}
      {route.params.role == 4 &&
      <Tab.Screen
        name="blockedtime"
        initialParams={route.params}
        component={BlockedTimeStackScreen}
      />}
      {route.params.role == 4 &&
      <Tab.Screen
        name="service"
        initialParams={route.params}
        component={ServiceStackScreen}
      />}
      {route.params.role == 4 &&
      <Tab.Screen
        name="ManageEgift"
        initialParams={route.params}
        component={ManageEgiftStackScreen}
      />
}
{route.params.role == 4 &&
      <Tab.Screen
        name="sms"
        initialParams={route.params}
        component={SmsTrackingStackScreen}
      />
}
{route.params.role == 4 &&
      <Tab.Screen
        name="charged"
        initialParams={route.params}
        component={ChargedNewClientStackScreen}
      />
}
      <Tab.Screen
        name="scanbarcode"
        initialParams={route.params}
        component={ScanBarCodeStackScreen}
      />
    </Tab.Navigator>

)};

export default BottomTabNavigator;

const CalendarStackScreen = ({navigation, route}) => {
  return(
    <CalendarStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <CalendarStack.Screen name={getTextByKey(route.params.languageKey, "calendartab")} initialParams={route.params} component={CalendarScreen}  />
    </CalendarStack.Navigator>
)};
const DashboardStackScreen = ({navigation, route}) => {
  return(
    <DashboardStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}} >
            <DashboardStack.Screen name={getTextByKey(route.params.languageKey, "dashboardtab")} initialParams={route.params} component={DashboardScreen}  />
    </DashboardStack.Navigator>
)};

const SalesReportStackScreen = ({navigation, route}) => {
  return(
    <SalesReportStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <SalesReportStack.Screen name={getTextByKey(route.params.languageKey, "salesreporttab")} initialParams={route.params} component={SalesReportScreen}  />
    </SalesReportStack.Navigator>
)};
const SmsMarketingStackScreen = ({navigation, route}) => {
  return(
    <SmsMarketingStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <SmsMarketingStack.Screen name={getTextByKey(route.params.languageKey, "smsmarketingtab")} initialParams={route.params} component={SmsMarketingScreen}  />
    </SmsMarketingStack.Navigator>
)};
const WaitListStackScreen = ({navigation, route}) => {
  return(
    <WaitListScreenStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <WaitListScreenStack.Screen name={getTextByKey(route.params.languageKey, "waitlisttab")} initialParams={route.params} component={WaitListScreen}  />
    </WaitListScreenStack.Navigator>
)};
const ClientsStackScreen = ({navigation, route}) => {
  return(
    <ClientsStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <ClientsStack.Screen name={getTextByKey(route.params.languageKey, "clientstab")} initialParams={route.params} component={ClientsScreen}  />
    </ClientsStack.Navigator>
)};
const StaffStackScreen = ({navigation, route}) => {
  return(
    <StaffScreenStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <StaffScreenStack.Screen name={getTextByKey(route.params.languageKey, "stafftab")} initialParams={route.params} component={StaffScreen}  />
    </StaffScreenStack.Navigator>
)};
const BlockedTimeStackScreen = ({navigation, route}) => {
  return(
    <BlockedTimeScreenStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <BlockedTimeScreenStack.Screen name={getTextByKey(route.params.languageKey, "blockedtimetab")} initialParams={route.params} component={BlockedTimeScreen}  />
    </BlockedTimeScreenStack.Navigator>
)};
const ServiceStackScreen = ({navigation, route}) => {
  return(
    <ServiceScreenStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <ServiceScreenStack.Screen name={getTextByKey(route.params.languageKey, "servicetab")} initialParams={route.params} component={ServiceScreen}  />
    </ServiceScreenStack.Navigator>
)};

const ManageEgiftStackScreen = ({navigation, route}) => {
  return(
    <ManageEgiftStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <ManageEgiftStack.Screen name={getTextByKey(route.params.languageKey, "manageEgifttab")} initialParams={route.params} component={ManageEgiftScreen}  />
    </ManageEgiftStack.Navigator>
)};

const SmsTrackingStackScreen = ({navigation, route}) => {
  return(
    <SmsTrackingStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <SmsTrackingStack.Screen name={getTextByKey(route.params.languageKey, "smstab")} initialParams={route.params} component={SmsTrackingScreen}  />
    </SmsTrackingStack.Navigator>
)};
const ChargedNewClientStackScreen = ({navigation, route}) => {
  return(
    <ChargedNewClientStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <ChargedNewClientStack.Screen name={getTextByKey(route.params.languageKey, "chargedtab")} initialParams={route.params} component={ChargedNewClientScreen}  />
    </ChargedNewClientStack.Navigator>
)};
const MoreStackScreen = ({navigation, route}) => {
  return(
    <MoreStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <MoreStack.Screen name="Settings" initialParams={route.params} component={MoreScreen}  />
    </MoreStack.Navigator>
)};

const ScanBarCodeStackScreen = ({navigation, route}) => {
  return(
    <ScanbarcodeStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <ScanbarcodeStack.Screen name="Scan Barcode" initialParams={route.params} component={ScanBarCodeScreen}  />
    </ScanbarcodeStack.Navigator>
)};
const DailyReportsStackScreen = ({navigation, route}) => {
  return(
    <DailyReportsStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <DailyReportsStack.Screen name="Daily Reports" initialParams={route.params} component={DailyReportsScreen}  />
    </DailyReportsStack.Navigator>
)};
const WeeklyReportsStackScreen = ({navigation, route}) => {
  return(
    <WeeklyReportsStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <WeeklyReportsStack.Screen name="Weekly Reports" initialParams={route.params} component={WeeklyReportsScreen}  />
    </WeeklyReportsStack.Navigator>
)};
const MonthlyReportsStackScreen = ({navigation, route}) => {
  return(
    <MonthlyReportsStack.Navigator screenOptions={{headerStyle: {backgroundColor: color.reddish,},headerTintColor: color.white,headerTitleStyle: {fontWeight: 'bold'}}}>
            <MonthlyReportsStack.Screen name="Monthly Reports" initialParams={route.params} component={MonthlyReportsScreen}  />
    </MonthlyReportsStack.Navigator>
)};