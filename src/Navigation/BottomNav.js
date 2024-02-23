import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import routes from './routes';
import Home from '../Screen/AfterLogin/Home';
import {BottomFabBar} from '@phoenative/rn-bottom-bar';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import SignIn from '../Screen/Auth/SignIn';
import Slider from '../Screen/Slider/Slider';
import {colorSet, mainColor} from '../utils/Color';
import Shopping from '../Screen/AfterLogin/Shopping';
import Search from '../Screen/AfterLogin/Search';
import Account from '../Screen/AfterLogin/Account';

//import { TOKEN } from '../utils/Keyword';
import {ProfileContext} from '../Services/ProfileProvider';

const Tab = createBottomTabNavigator();

const tabBarIcon =
  name =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({focused, color, size}) =>
    <Icon name={name} size={28} color={focused ? 'white' : '#000'} />;

const MyBottomTabs = () => {
  const {token} = useContext(ProfileContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: mainColor,
        tabBarActiveBackgroundColor: '#fff',
        tabBarInactiveBackgroundColor: '#fff',
        tabBarInactiveTintColor: '#000',
        tabBarShowLabel: true,
        headerShown: false,
      }}
      tabBar={props => (
        <BottomFabBar
          mode={'default'}
          isRtl={false}
          // Add Shadow for active tab bar button
          focusedButtonStyle={{
            shadowColor: '#fff',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 14,
          }}
          // - You can add the style below to show screen content under the tab-bar
          // - It will makes the "transparent tab bar" effect.
          bottomBarContainerStyle={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
          {...props}
        />
      )}>
      <Tab.Screen
        options={{
          tabBarIcon: tabBarIcon('pentagon-outline'),
          tabBarLabel: 'Home',
        }}
        name={routes.Home}
        component={Home}
      />
      <Tab.Screen
        name={routes.Shopping}
        options={{
          tabBarIcon: tabBarIcon('shopping-outline'),
          tabBarLabel: 'Shopping',
        }}
        component={Shopping}
      />
      <Tab.Screen
        options={{
          tabBarIcon: tabBarIcon('card-search-outline'),
          tabBarLabel: 'Search',
        }}
        name={routes.SearchItem}
        component={Search}
      />
      <Tab.Screen
        options={{
          tabBarIcon: tabBarIcon('account-box-outline'),
          tabBarLabel: 'Account',
        }}
        name={routes.Account}
        component={Account}
        listeners={({navigation}) => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object

            if (token != null && token != undefined && token != '') {
              navigation.navigate(routes.Account);
            } else {
              navigation.navigate(routes.SignIn);
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default MyBottomTabs;
