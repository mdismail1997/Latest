import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

//import {useNavigation} from '@react-navigation/native';
import {navigate} from '../NotifyNavigator';

class FcmService {
  //navigation = useNavigation();

  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          // User has permission
          this.getToken(onRegister);
        } else {
          // User doesn't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {
        console.log('FCM permission rejected===>', error);
      });
  };
  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        // console.warn('Fcm token===>', fcmToken);
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('User does not have a device token');
        }
      })
      .catch(error => {
        console.log('Token Rejected', error);
      });
  };
  requestPermission = onRegister => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {
        console.log('FCM request permission rejected', error);
      });
  };

  deleteToken = () => {
    console.log('FCM service delete token ');
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('FCM delete token error ', error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    //const navigation = useNavigation();
    // when the application is running , but in background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused to open');
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        onOpenNotification(notification);
        //this.props.navigation.navigate('Chat');
      }
    });
    // when the application is opened from a quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('Initial Notification caused to open');
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
          // this.props.navigation.navigate('Chat');
        }
      });

    // Foreground state messages
    this.messageListener = messaging().onMessage(async remoteMessage => {
      console.log('A FCM new message received', remoteMessage);
      if (remoteMessage) {
        // let notification = null;
        // if (Platform.OS === 'ios') {
        //   notification = remoteMessage.data.notification;
        // } else {
        //   notification = remoteMessage.notification;
        // }
        let notification = remoteMessage.notification;
        onNotification(notification);
      }
    });

    // Triggered when have new token
    messaging().onTokenRefresh(fcmToken => {
      console.log('New refresh token ', fcmToken);
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };
}

export const fcmService = new FcmService();
