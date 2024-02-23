import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Slider from '../Screen/Slider/Slider';
import routes from './routes';
import SignIn from '../Screen/Auth/SignIn';
import SignUp from '../Screen/Auth/SignUp';
import DrawerNavigator from './DrawerNav';
import ProductDetails from '../Screen/AfterLogin/Product/ProductDetails';

import ForgetPassword from '../Screen/Auth/ForgetPassword';
import SizeDetails from '../Screen/AfterLogin/Product/SizeDetails';
import RatingReview from '../Screen/RatingReview/RatingReview';
import Notification from '../Screen/Notification/Notification';
import ShippingAddress from '../Screen/ShippingAddress/ShippingAddress';
import Payment from '../Screen/Payment/Payment';
import PaymentSuccess from '../Screen/Payment/PaymentSuccess';
import OrderDetails from '../Screen/OrderDetails/OrderDetails';
import TermsCondition from '../Screen/CMS/TermsCondition';
import HelpSupport from '../Screen/CMS/HelpSupport';
import Schedule from '../Screen/Schedule/Schedule';
import Wishlist from '../Screen/AfterLogin/Wishlist';
import Edit_product from '../Screen/AfterLogin/Seller_Product/Edit_Product';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={routes.Drawertab}
        screenOptions={{
          headerShown: false,
        }}>
        {/* <Stack.Screen name={routes.Slide} component={Slider} /> */}
        <Stack.Screen name={routes.Drawertab} component={DrawerNavigator} />
        <Stack.Screen name={routes.SignIn} component={SignIn} />
        <Stack.Screen name={routes.SignUp} component={SignUp} />
        <Stack.Screen name={routes.ForgetPassword} component={ForgetPassword} />
        <Stack.Screen name={routes.ProductDetails} component={ProductDetails} />
        <Stack.Screen name={routes.SizeDetails} component={SizeDetails} />

        <Stack.Screen name={routes.RatingReview} component={RatingReview} />
        <Stack.Screen name={routes.Notification} component={Notification} />
        <Stack.Screen name={routes.Payment} component={Payment} />
        <Stack.Screen name={routes.PaymentSuccess} component={PaymentSuccess} />
        <Stack.Screen name={routes.OrderDetails} component={OrderDetails} />
        <Stack.Screen name={routes.TermsCondition} component={TermsCondition} />
        <Stack.Screen name={routes.HelpSupport} component={HelpSupport} />
        <Stack.Screen name={routes.Schedule} component={Schedule} />
        <Stack.Screen name={routes.Wishlist} component={Wishlist} />
        <Stack.Screen name={routes.EditProduct} component={Edit_product} />
        <Stack.Screen
          name={routes.ShippingAddress}
          component={ShippingAddress}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
