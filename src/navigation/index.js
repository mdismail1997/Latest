import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import NotFoundScreen from '../screens/NotFoundScreen';
import BottomTabNavigator from './BottomTabNavigator';
// import LinkingConfiguration from './LinkingConfiguration';
//checkin app screen
import HomeScreen from '../screens/checkinapp/HomeScreen';
import SettingScreen from '../screens/checkinapp/SettingScreen';
import CheckInScreen from '../screens/checkinapp/CheckInScreen';
import CheckInWithoutBookingScreen from '../screens/checkinapp/CheckInWithoutBooking';
import BookingSuccessScreen from '../screens/checkinapp/BookingSuccessScreen';
import CustomerCheckInScreen from '../screens/checkinapp/CustomerCheckIn';
import AppointmentsScreen from '../screens/checkinapp/AppointmentsScreen';
import CheckInSucccessScreen from '../screens/checkinapp/CheckInSuccessScreen'; 
import BlockedScreen from '../screens/checkinapp/Blocked'; 
import WithoutBookingSuccessScreen from '../screens/checkinapp/WithoutBookingSuccessScreen';
import BlockedMultipleLocationScreen from '../screens/checkinapp/BlockedMultipleLocation';
import ExpreeeCheckInScreen from '../screens/checkinapp/ExpressCheckin';
import ApplyLanguageScreen from '../screens/ApplyLanguage';
import SelectAppScreen from '../screens/SelectAppScreen';
const Stack = createStackNavigator();
export default function Navigation({userData}) {

  let defaultRoute = 'selectapp';
  switch(userData.appStarred){
    case 'checkinapp':
      defaultRoute = 'home';
    break;
    case 'merchantapp':
      defaultRoute = 'tab';
    break;
  }
  if(typeof(userData.role) != "undefined" && userData.role == 9){
    defaultRoute = 'tab';
  }
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={defaultRoute}>
      <Stack.Screen name="selectapp" initialParams={userData} component={SelectAppScreen} />
      <Stack.Screen name="tab" initialParams={userData} component={BottomTabNavigator} />
      <Stack.Screen name="home" initialParams={userData} component={HomeScreen} />
      <Stack.Screen name="setting" initialParams={userData} component={SettingScreen} />
      <Stack.Screen name="checkin" initialParams={userData} component={CheckInScreen} />
      <Stack.Screen name="checkinwithoutbooking" initialParams={userData} component={CheckInWithoutBookingScreen} />
      <Stack.Screen name="bookingSuccess" initialParams={userData} component={BookingSuccessScreen} />
      <Stack.Screen name="CustomerCheckIn" initialParams={userData} component={CustomerCheckInScreen} />
      <Stack.Screen name="Appointments" initialParams={userData} component={AppointmentsScreen} />
      <Stack.Screen name="CheckInSuccess" initialParams={userData} component={CheckInSucccessScreen} />
      <Stack.Screen name="blocked" initialParams={userData} component={BlockedScreen} />
      <Stack.Screen name="WithoutBookingSuccessScreen" initialParams={userData} component={WithoutBookingSuccessScreen} />
      <Stack.Screen name="BlockedMultipleLocation" initialParams={userData} component={BlockedMultipleLocationScreen} />
      <Stack.Screen name="ExpressCheckin" initialParams={userData} component={ExpreeeCheckInScreen} />
      <Stack.Screen name="applyLanguage" component={ApplyLanguageScreen}  /> 

    </Stack.Navigator>
  );
}




// import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import * as React from 'react';
// import { ColorSchemeName } from 'react-native';

// import NotFoundScreen from '../screens/NotFoundScreen';
// import { RootStackParamList } from '../types';
// import BottomTabNavigator from './BottomTabNavigator';
// import LinkingConfiguration from './LinkingConfiguration';

// // If you are not familiar with React Navigation, we recommend going through the
// // "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
// export default function Navigation() {
//   return (
//     <NavigationContainer
//       linking={LinkingConfiguration}
//       >
//       <RootNavigator />
//     </NavigationContainer>
//   );
// }

// // A root stack navigator is often used for displaying modals on top of all other content
// // Read more here: https://reactnavigation.org/docs/modal
// const Stack = createStackNavigator();

// function RootNavigator() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
//     </Stack.Navigator>
//   );
// }
