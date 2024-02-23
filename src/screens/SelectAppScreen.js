import React, {useEffect} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../components/context';
import { NavigationActions } from '@react-navigation/native';
import { color } from '../assets/colors/colors';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import { images } from '../components/Images';
const SelectAppScreen = ({navigation, route}) => {
    const { colors } = useTheme();
    const { chooseApp } = React.useContext(AuthContext);
    const chooseAppStarted = async(app) =>{
        await chooseApp(app);
        switch(app){
            case 'checkinapp':
              navigation.reset({
                index: 0,
                routes: [{ name: 'home' }],
              });
            break;
            case 'merchantapp':
              navigation.reset({
                index: 0,
                routes: [{ name: 'tab' }],
              });
            break;
          }
    }
    // useEffect(() => {
    //     setTimeout(async() => {
    //         await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    //     }, 500);
    //   }, []);
    //   useEffect(() => {
    //     let width =  Dimensions.get('window').width;
    //     if(width >= 767){
    //         changeScreenOrientation();
    //     }else{
    //         changeScreenToPotrait();
    //     }
    //   }, []);
    //   async function changeScreenOrientation() {
    //     await ScreenOrientation.lockAsync(
    //       ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    //     );
    //   }
    //   async function changeScreenToPotrait() {
    //     await ScreenOrientation.lockAsync(
    //       ScreenOrientation.OrientationLock.PORTRAIT
    //     );
    //   }
    return (
      <View style={styles.container}>
          <FocusAwareStatusBar />
        <View style={styles.header}>
            <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
            source={images.logo2x}
            style={styles.logo}
            resizeMode="stretch"
            />
        </View>
        <Animatable.View 
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
            animation="fadeInUpBig"
        >
            <Text style={[styles.title, {
                color: colors.text
            }]}>Select the app to get started!</Text>
                        <View style={styles.button}>
            <TouchableOpacity onPress={()=>chooseAppStarted('checkinapp')}>
                <LinearGradient
                    colors={[color.lightCyan, color.hsl]}
                    style={styles.signIn}
                >
                    <Text style={styles.textSign}>CheckIn App</Text>
                    <Icon 
                        name="navigate-next"
                        color={color.white}
                        size={20}
                    />
                </LinearGradient>
            </TouchableOpacity>
            </View>
            <View style={styles.button}>
            <TouchableOpacity onPress={()=>chooseAppStarted('merchantapp')}>
                <LinearGradient
                    colors={[color.lightCyan, color.hsl]}
                    style={styles.signIn}
                >
                    <Text style={styles.textSign}>Merchant App</Text>
                    <Icon 
                        name="navigate-next"
                        color={color.white}
                        size={20}
                    />
                </LinearGradient>
            </TouchableOpacity>

            </View>

        </Animatable.View>
        <View style={{alignItems: 'center',justifyContent: 'center', backgroundColor: colors.background,}} >
            <View style={{marginBottom: 25,alignItems: 'center',justifyContent: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>Powered by Thepronails.com</Text>
                <Text style={{fontWeight: 'bold'}}>(302) 543-2014</Text>
            </View>

            </View>
      </View>
    );
};

export default SelectAppScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: color.darkCyan
  },
  header: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: color.white,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: 300,
      height: 50
  },
  title: {
      color: '#05375a',
      fontSize: 25,
      fontWeight: 'bold',
      
  },
  text: {
      color: 'grey',
      marginTop:5
  },
  button: {
      alignItems: 'center',
      marginTop: 30
  },
  signIn: {
      width: 250,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  }
});

