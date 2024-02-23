import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import routes from './routes';
import MyBottomTabs from './BottomNav';
import ChangePassword from '../Screen/AfterLogin/changePassword';
import Cart from '../Screen/AfterLogin/Cart/Cart';
import RatingReview from '../Screen/RatingReview/RatingReview';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      defaultScreenOptions={{
        drawerStyle: {
          width: Dimensions.get('window').width * 0.85,
        },
      }}
      screenOptions={{
        drawerStyle: {
          width: Dimensions.get('window').width * 0.85,
        },
        headerShown: false,
      }}>
      <Drawer.Screen name={routes.Bottomtab} component={MyBottomTabs} />
      <Drawer.Screen name={routes.ChangePassword} component={ChangePassword} />
      <Drawer.Screen name={routes.Cart} component={Cart} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
