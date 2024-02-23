import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { color } from '../assets/colors/colors';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import { images } from '../components/Images';

const SplashScreen = ({navigation, route}) => {
    const { colors } = useTheme();
    // console.log(route);
    return (
      <View style={styles.container}>
          <FocusAwareStatusBar />
        <View style={styles.header}>
            <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
            source={images.logo}
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
            }]}>Stay connected with everyone!</Text>
            <Text style={styles.text}>Sign in with account</Text>
            <View style={styles.button}>
            <TouchableOpacity onPress={()=>navigation.navigate('login')}>
                <LinearGradient
                    colors={[color.lightCyan, color.hsl]}
                    style={styles.signIn}
                >
                    <Text style={styles.textSign}>Get Started</Text>
                    <Icon 
                        name="navigate-next"
                        color={color.white}
                        size={20}
                    />
                </LinearGradient>
            </TouchableOpacity>
            </View>
        </Animatable.View>
      </View>
    );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: color.darkCyan
  },
  header: {
      flex: 2,
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
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:5
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  },
  signIn: {
      width: 150,
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

