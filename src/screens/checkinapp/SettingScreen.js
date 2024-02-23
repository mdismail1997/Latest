import React, {useEffect} from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    Platform,

    Button,

} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../../assets/styles/layout";
import Colors from "../../constants/Colors";
import SubmitLoader from "../../helpers/submitloader";
import setting from "../../constants/Setting";
import SpinnerLoader from "../../helpers/spinner";
var {height, width} = Dimensions.get('window');
import { AuthContext } from '../../components/context';
import { color } from "../../assets/colors/colors";
const SettingScreen = ({navigation, route}) =>{
    const initialState = {
        isLoading: false
    }
    const [state, setState] = React.useState(initialState);
    const { signOut } = React.useContext(AuthContext);
        let logostyle = styles.logofont;
        if(route.params.businessname.indexOf('&') >= 0){
            logostyle = styles.logofontAngel;
        }
    useEffect(() => {
        setTimeout(async() => {
            setState({isLoading: true});
            }, 500);

        }, []);
    const changeapp = () =>{
        navigation.reset({
            index: 0,
            routes: [{ name: 'selectapp' }],
            });
    }
          if(state.isLoading){
            return(
                <View style={{flex:1}}>
                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={styles.containerHeaderSteps}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>Setting</Text>
                        </View>
                    </LinearGradient>  
    
                    <View style={styles.container}>
                        <View style={[styles.row,{width: width - 70}]}>
                            {/* <Text style={[styles.logofontdefault]}>{route.params.businessname}</Text>     */}
                            <View style={styles.confirmbtn}>
                                <View style={styles.btnSave}>
                                <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.btnSaveWrapercus}
                                        onPress={() => {changeapp()}}
                                    >
                                        <LinearGradient
                                            start={[0, 0]}
                                            end={[1, 0]}
                                            colors={[color.reddish, color.reddish]}
                                            style={styles.btnLinear}
                                        >
                                            <Text style={styles.btnSaveText}>Change App</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.btnSaveWraper}
                                        onPress={() => {signOut()}}
                                    >
                                        <LinearGradient
                                            start={[0, 0]}
                                            end={[1, 0]}
                                            colors={[color.reddish, color.reddish]}
                                            style={styles.btnLinear}
                                        >
                                            <Text style={styles.btnSaveText}>Logout</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>        
                            </View>
                  
                        </View>
                    </View> 
                </View>
                
            )
          }else{
              return(
                <View style={styles.containercus}>
                <SpinnerLoader
                    visible={true}
                    textStyle={layout.textLoaderScreen}
                    overlayColor={"transparent"}
                    textContent={"Loading..."}
                    color={Colors.spinnerLoaderColor}
                />
            </View>
              )
          }
}
export default SettingScreen;
const styles = StyleSheet.create({
    containercus: {
        flex: 1,
        backgroundColor: color.lightWhite
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:-45
    },
    row:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer:{
        height:90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle:{
        color: color.white,
        backgroundColor:'transparent',
        fontSize:22,
        fontFamily:'Futura',
        marginTop:10
    },
    confirmbtn:{
        justifyContent: "center",
        alignItems: "center",
        width: 350
    },
    btnSave: {
        height: 45,
        width: 230,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15
    },
    btnSaveText: {
        color:  color.white,
        fontSize: 20,
        zIndex: 1,
        backgroundColor: "transparent"
    },
    btnSaveWrapercus: {
        position: "absolute",
        top: -70,
        bottom: 0,
        left: 0,
        right: 0,
        height:45
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    logofontdefault:{
        backgroundColor:'transparent',
        color: color.silver,
        fontSize:40,
        marginBottom:40
    },
    logofont:{
        fontFamily: 'heavenmatters'
    },
    logofontAngel:{
        fontFamily: 'angel'
    },
});
