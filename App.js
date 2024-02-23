import React, { useEffect, useDidMountEffect, useState,useRef } from 'react';
import { View, ActivityIndicator, Text, Button, TouchableOpacity, SafeAreaView, Platform, AppState } from 'react-native';
import { 
  NavigationContainer, 
} from '@react-navigation/native';
import { 
  Provider as PaperProvider, 
} from 'react-native-paper';
import RootStackScreen from './src/navigation/RootStackScreen';
import {AuthContext} from './src/components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import setting from "./src/constants/Setting";
import cacheAssetsAsync from "./src/utilities/cacheAssetsAsync";
import { isLogged, refreshJWTtoken, jwtToken, getUserData } from "./src/helpers/authenticate";
import { getLanguage } from "./src/helpers/language";
import * as Updates from 'expo-updates';
import registerForPushNotificationsAsync from "./src/api/registerForPushNotificationsAsync";

export default function App() {
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    businessname: '',
    languageKey:'en-US',
    appStarred:'',
    role:''
  };
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [appRefreshFirst, setappRefreshFirst] = useState(0);
  const [appRefreshLast, setappRefreshLast] = useState(0);
  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          businessname: action.businessname,
          userName: action.id,
          languageKey: action.languageKey,
          appStarred: action.appStarred,
          role: action.role
        };
      case 'LOGIN': 
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
          businessname: action.businessname,
          role: action.role
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
          languageKey: 'en-US',
          appStarred: ''
        };
      case 'REGISTER': 
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
        case 'Language': 
        return {
          ...prevState,
          languageKey: action.languageKey
        };
        case 'ChooseApp': 
        return {
          ...prevState,
          appStarred: action.appStarred
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
  const authContext = React.useMemo(() => ({
    signIn: async(foundUser) => {
      const userToken = String(foundUser.userToken);
      const userName = foundUser.id;
      try {
         await AsyncStorage.setItem('userToken', userToken);
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGIN', id: userName, token: userToken,  businessname: foundUser.businessname, role: foundUser.role});
    },
    signOut: async() => {
      try {
        await AsyncStorage.clear();
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    },
    changeLanguage: async(languageKey) =>{
      try {
        await AsyncStorage.setItem(setting.language, languageKey);
     } catch(e) {
       console.log(e);
     }
     dispatch({ type: 'Language', languageKey: languageKey});
     Updates.reloadAsync();
    },
    chooseApp: async(app)=>{
      try {
        await AsyncStorage.setItem('tokenApp', app);
     } catch(e) {
       console.log(e);
     }
     dispatch({ type: 'ChooseApp', appStarred: app});
    }
  }), []);

  onStart = () => {

    if (Platform.OS =="ios") {
      BackgroundTimer.start();
    }

    this._interval = BackgroundTimer.setInterval(() => {
      setCounter((counter) => counter + 1);
    }, 1000);
  }

  useEffect(() => {
    AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        //Updates.reloadAsync();
          let date = new Date();
          let hours = date.getFullYear() + date.getMonth()+ date.getDay()+ date.getHours();
          let minutes = date.getMinutes();
          let seconds = date.getSeconds();
          setappRefreshLast(hours + minutes);
      }else{
        let date = new Date();
        let hours = date.getFullYear() + date.getMonth()+ date.getDay()+ date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        setappRefreshFirst(hours + minutes);
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });
    setTimeout(async() => {
      let languageKeyDefault = await getLanguage();
      let tokenApp = await AsyncStorage.getItem('tokenApp').then(token => {return token;});
      if(tokenApp == null || tokenApp == '') tokenApp = '';
      let userToken;
      userToken = null;
      let businessname;
      businessname = '';
      let role = '';
      let idBusiness = null;
      let userData
      try {
         let isLoggedIn = await isLogged();
         let token = await jwtToken();
         if (isLoggedIn) {
          let refresh = await refreshJWTtoken(token);
          if(typeof(refresh) != 'undefined'){
              userToken = await jwtToken();
              userData = await getUserData();
              businessname = userData.businessname;
              role = userData.role;
              if(Platform.OS == 'ios'){
                await registerForPushNotificationsAsync(); 
              }
              
          }else await AsyncStorage.removeItem(setting.jwtkey);
        }else if(!isLoggedIn && token != null && token != ""){
          let refresh = await refreshJWTtoken(token);
          if(typeof(refresh) != 'undefined'){
              userToken = await jwtToken();
              userData = await getUserData();
              businessname = userData.businessname;
              role = userData.role;
          }else await AsyncStorage.removeItem(setting.jwtkey);
        }
        await cacheAssetsAsync({
          images: [require("./src/assets/images/expo-wordmark.png")],
          fonts: [
              {
                  "space-mono": require("./src/assets/fonts/SpaceMono-Regular.ttf")
              },                    
              {
                  "heavenmatters": require("./src/assets/fonts/heavenmatters.ttf")
              },
              {
                  "NeotericcRegular": require("./src/assets/fonts/NeotericcRegular.ttf")
              },
              {
                  "Futura": require("./src/assets/fonts/Futura3.ttf")
              },
              {
                  "futuralight": require("./src/assets/fonts/FuturaStdLight.ttf")
              },
              {
                  "angel": require("./src/assets/fonts/AngelTears.ttf")
              }
          ]
      });
      } catch(e) {
         console.log(e);
      }
       dispatch({ type: 'RETRIEVE_TOKEN', token: userToken, businessname: businessname, id: idBusiness, languageKey: languageKeyDefault, appStarred: tokenApp, role: role});
    }, 500);
  }, []);
  useEffect(() => {
    if(appStateVisible == 'active'){
      if((appRefreshLast - appRefreshFirst) >= 1){
        Updates.reloadAsync();
      }
    }
  });
  if(loginState.isLoading){
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator size="large" />
      </View>
    )
  }
    return (
      <PaperProvider>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            { loginState.userToken !== null ? (
              <SafeAreaProvider>
                <Navigation userData={loginState} />
                <StatusBar />
              </SafeAreaProvider>
            )
            :
            <RootStackScreen />
            }
        </NavigationContainer>
        </AuthContext.Provider>
      </PaperProvider>
    );

}
