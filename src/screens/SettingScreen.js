import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    Alert    
} from "react-native";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient';
import Router from "../../navigation/Router";
import layout from "../../assets/styles/layout_checkin";
import Colors from "../../constants/Colors_checkin";
import SubmitLoader from "../../helpers/submitloader";
import setting from "../../constants/Setting";
import { color } from "../assets/colors/colors";
import { api } from "../api/api";
var {height, width} = Dimensions.get('window');

export default class SettingScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: false
        }
    };
    UNSAFE_componentWillUnmount(){
        
        Dimensions.removeEventListener("change", () => {});
    }
    
    UNSAFE_componentWillMount(){
        this.businessname = this.props.route.params.businessname;

        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            _this.setState({ appIsReady: true });
        })
    }
    async logout () {

        this.refs.authenticateLoader.setState({ visible: true });
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
          );
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
        let expoToken = "";
        if (finalStatus === "granted") {
            expoToken = await Notifications.getExpoPushTokenAsync();
        } 

        var isSuccess = await fetch(setting.apiUrl + api.signOut, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.props.route.params.token
            },
            body: JSON.stringify({
                expoToken: ''
            })
        })
        .then(response => response.json())
        .then(responseJson => {
            if (!responseJson.success) {
                return false;
            } else {
                return true;
            }
        })
        .catch(error => {
            console.error(error);
            return [];
        });
        if(isSuccess){
            await AsyncStorage.clear();
        }
        this.refs.authenticateLoader.setState({ visible: false });
        if (isSuccess) {
            Notifications.setBadgeCountAsync(0);
            this.props.navigator.replace('login');
        } else {
            setTimeout(function(){
                Alert.alert(
                    "Error",
                    "Logout Failed. Please contact administrator."
                );
            },0)
        }
    }

    render() {
        let logostyle = styles.logofont;
        if(this.businessname.indexOf('&') >= 0){
            logostyle = styles.logofontAngel;
        }
        return(
            <View style={{flex:1}}>
                <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={styles.containerHeaderSteps}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Setting</Text>
                    </View>
                </LinearGradient>  
                <View style={styles.container}>
                    <View style={[styles.row,{width: width - 70}]}>
                        <Text style={[styles.logofontdefault,logostyle]}>{this.props.route.params.businessname}</Text>    
                        <View style={styles.confirmbtn}>
                            <View style={styles.btnSave}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.btnSaveWraper}
                                    onPress={async () => {await this.logout()}}
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
                
                <SubmitLoader
                        ref="authenticateLoader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmit}
                        textContent={"Logging out..."}
                        color={Colors.spinnerLoaderColorSubmit}
                    />
            </View>
            
        )
        
    }
}

const styles = StyleSheet.create({
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
        fontSize:80,
        marginBottom:40
    },
    logofont:{
        fontFamily: 'heavenmatters'
    },
    logofontAngel:{
        fontFamily: 'angel'
    },
});
