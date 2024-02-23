import React, {useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  LogBox,
} from 'react-native';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import Hud from './src/utils/hud';
import {store} from './src/reduxToolkit/Store';
import {NativeBaseProvider} from 'native-base';
import Navigation from './src/Navigation';
import {ProfileProvider} from './src/Services/ProfileProvider';

const App = () => {
  useEffect(() => {
    //SplashScreen.hide();
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);

  LogBox.ignoreLogs([
    'Animated: `useNativeDriver`',
    'EventEmitter.removeListener',
    'VirtualizedLists should never be nested',
    'Warning: Encountered two children with the same key',
  ]);

  return (
    <Provider store={store}>
      <ProfileProvider>
        <NativeBaseProvider>
          <Hud ref={(rid: any) => Hud.setHud(rid)} />
          <StatusBar
            backgroundColor={Platform.select({
              ios: 'white',
              android: '#020c26',
            })}
            barStyle={Platform.select({
              ios: 'dark-content',
              android: 'light-content',
            })}
          />
          <Navigation />
        </NativeBaseProvider>
      </ProfileProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
