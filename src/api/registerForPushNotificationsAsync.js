import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
// import * as Permissions from 'expo-permissions';
import {Alert } from "react-native";
import setting from "../constants/Setting";
import { jwtToken } from "../helpers/authenticate";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Example server, implemented in Rails: https://git.io/vKHKv
//const PUSH_ENDPOINT = 'https://exponent-push-server.herokuapp.com/tokens';
const PUSH_ENDPOINT = setting.apiUrl + 'expo/tokens';

export default (async function registerForPushNotificationsAsync() {
  // const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  // let finalStatus = existingStatus;
  // if (existingStatus !== 'granted') {
  //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //   finalStatus = status;
  // }
  // if (finalStatus !== 'granted') {
  //   return;
  // }
  // const token = (await Notifications.getExpoPushTokenAsync()).data;
   let usertoken = await jwtToken();
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // alert('Failed to get push token for push notification!');
      // return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);
  } else {
    // alert('Must use physical device for Push Notifications');
  }
  // POST the token to our backend so we can use it to send pushes from there
  if(typeof token != 'undefined' && token != null && token != ""){
    return await fetch(PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + usertoken,
      },
      body: JSON.stringify({
        token: token,
        appname: "thepronails-merchant"
      }),
    }).then((response) => response.json()).then((responseJson) => {
        if(responseJson.success){
          AsyncStorage.setItem(setting.deviceid,responseJson.deviceid.toString());
        }
    });
  }
  
});
