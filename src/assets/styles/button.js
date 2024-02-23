import { StyleSheet } from 'react-native';
import { color } from '../colors/colors';
export default StyleSheet.create({
    login: {
        backgroundColor: color.white,
        height:55,
        borderRadius:40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginsocial: {
        height:38,
        borderRadius:20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: color.white,
        borderWidth:1,
    },
    txtLogin: {
        color: color.lightishPink,
        fontSize:20
    },
    txtLoginSocial: {
        color: color.white
    },
    txtSignUp: {
        color: color.white,
        fontSize:12
    }
});
