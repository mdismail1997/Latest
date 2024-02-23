import React, { useEffect, useDidMountEffect, useState,useRef } from 'react';
import { View, ActivityIndicator, Text, Button, TouchableOpacity, SafeAreaView, Platform, AppState } from 'react-native';
import { 
  NavigationContainer, 
} from '@react-navigation/native';
import { 
  Provider as PaperProvider, 
} from 'react-native-paper';
import RootStackScreen from './navigation/RootStackScreen';
import {AuthContext} from './components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';
import setting from "./constants/Setting";
import cacheAssetsAsync from "./utilities/cacheAssetsAsync";
import { isLogged, refreshJWTtoken, jwtToken, getUserData } from "./helpers/authenticate";
import { getLanguage } from "./helpers/language";
import * as Updates from 'expo-updates';
import registerForPushNotificationsAsync from "./api/registerForPushNotificationsAsync";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
const BACKGROUND_FETCH_TASK = 'background-fetch';
// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  // Be sure to return the successful result type!
  return BackgroundFetch.Result.NewData;
});

// 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

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
  const [isRegistered, setIsRegistered] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<BackgroundFetch.Status | null>(null);

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
  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };
  useEffect(() => {
    checkStatusAsync();
    AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        Updates.reloadAsync();
          // console.log(counter);
          // BackgroundTimer.stop();
      }else{
        // onStart();
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
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
          images: [require("./assets/images/expo-wordmark.png")],
          fonts: [
              {
                  "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
              },                    
              {
                  "heavenmatters": require("./assets/fonts/heavenmatters.ttf")
              },
              {
                  "NeotericcRegular": require("./assets/fonts/NeotericcRegular.ttf")
              },
              {
                  "Futura": require("./assets/fonts/Futura3.ttf")
              },
              {
                  "futuralight": require("./assets/fonts/FuturaStdLight.ttf")
              },
              {
                  "angel": require("./assets/fonts/AngelTears.ttf")
              }
          ]
      });
      } catch(e) {
         console.log(e);
      }
       dispatch({ type: 'RETRIEVE_TOKEN', token: userToken, businessname: businessname, id: idBusiness, languageKey: languageKeyDefault, appStarred: tokenApp, role: role});
    }, 500);
  }, []);

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
