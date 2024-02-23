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
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
// import Router from "../navigation/Router";
import layout from "../assets/styles/layout_checkin";
import Colors from "../constants/Colors_checkin";
import SubmitLoader from "../helpers/submitloader";
import setting from "../constants/Setting";
import NavigationBarBackground from "../components/navigationBarBG";
import NavigationBarStaff from "../components/navigationBarStaff";
import SpinnerLoader from "../helpers/spinner";
import {
    isLogged,
    jwtToken,
    getUserData
} from "../helpers/authenticate";
import { getUSState2Digit, get_time_zone, getCountry2Digit } from "../helpers/Utils";
import { color } from "../assets/colors/colors";

var {height, width} = Dimensions.get('window');

export default class SmsMarketingScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: true,
            elevation: 0,
            renderBackground: () => {
                return <NavigationBarBackground />;
            },
            renderTitle: route => {
                return (
                    <NavigationBarStaff
                        title={"smsmarketingnav"}
                        language={route.params.language}
                    />
                );
            }
        }
    };
    state = {
        appIsReady: false,
        showCloseSearchBoxClient: false,
        search:'',
    }
    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }
    
   async UNSAFE_componentWillMount(){
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn){
            this.token = await jwtToken();
            this.userData = await getUserData();
            this.stateData = getUSState2Digit(this.userData.state);
            let country = getCountry2Digit(this.userData.country);
            this.timezone = get_time_zone(country,this.stateData);
        }
        this.setState({ appIsReady: true });
    }

    render() {
        if(this.state.appIsReady){
            return(
                <View style={styles.container}>
                    <WebView
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        javaScriptEnabled={true}
                        renderLoading={this.renderLoading}
                        source={{
                            uri: setting.smsmarketingUrl,
                            headers: { Authorization: "Bearer " + this.token }
                        }}
                        style={styles.container}
                    />

                </View>
            )
        }else{
            return (
                <View style={styles.container}>
                    <SpinnerLoader
                        visible={true}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={"transparent"}
                        textContent={"Loading..."}
                        color={Colors.spinnerLoaderColor}
                    />
                </View>
            );
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    sectionheader: {
        height: 35,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: color.lightWhite
    },
    sectionheadertext: {
        marginLeft: 15,
        flexDirection: "row"
    },
    sectionheadertextcontainer: {
        height: 35,
        justifyContent: "center",
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sectionheadertextcontent: {
        color: color.silver,
        fontSize:16,
        width:"33.33333333333%"
    },
    searchContainer:{
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder
    },

    //ITEM SMS
    itemContainer: {
        height:50,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: color.cream,
        borderBottomWidth: 0.5,
        paddingLeft:10,
        paddingRight:10
    },
    statusname:{
        marginLeft:5,
        color: color.gray42,
        fontSize:16
    },
    statusdata:{
        position:'absolute',
        right:15,
        color: color.gray42,
        fontSize:16
    },
    //header sms total
    totalrow:{
        flexDirection:'row',
        backgroundColor: color.white,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        position:'relative',
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    totalrow_tiem:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalrow_text:{
        color:'red',
        marginTop:5
    },
    bookingrow:{
        position:'relative', 
    }
});
