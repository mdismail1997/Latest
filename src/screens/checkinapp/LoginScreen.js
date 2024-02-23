import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableHighlight,
    Alert,
    Dimensions,
    Platform,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Expo, Notifications} from "expo";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import btn from "../assets/styles/button";
import layout from "../assets/styles/layout";
import BtnSpinner from "../helpers/btnloader";
import emailvalidator from "email-validator";
import setting from "../constants/Setting";
import Router from "../navigation/Router";
import {  getDeviceId, getUserData } from "../helpers/authenticate";
import ModalLocation from '../components/ModalLocation';
import { color } from "../../assets/colors/colors";
import { images } from "../../components/Images";
import { emailRegx } from "../../helpers/Utils";
import { api } from "../../api/api";

var {height, width} = Dimensions.get('window');
export default class LoginScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: false
        },
    };

    state = {
        username: '',
        password: '',
        btnLoginDisabled: false,
        btnLoginVisibleSpinner:false
    };

    isAvoidKeyBoard = false;
    keyboardheight = 0;

    UNSAFE_componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        var screen = Dimensions.get('window');
        width = screen.width;
        height = screen.height;
        
        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;
            _this.setState({ appIsReady: true });
        })

        setTimeout(function(){
            //_this.refs.scrollview.scrollTo({x: 0, y: 250, animated: true});
        },2000)
        //this.setState({ appIsReady: true });
    }

    _keyboardDidShow(e) {
        
        //let keyboardHeight = Dimensions.get('window').height - e.endCoordinates.height;
        this.keyboardheight = e.endCoordinates.height;
        if(this.isAvoidKeyBoard){
            
            this.onFocus(true);
            this.setState({rerender:true});
        }
    }

    onFocus = (isScroll) => {
        this.isAvoidKeyBoard = true;
        if(isScroll){
            /*
            if(Platform.OS === 'ios'){
                this.refs.scrollview.scrollTo({x: 0, y: this.keyboardheight, animated: true});
            }else{
                
                this.setState({rerender: true});
            }   */ 
            this.setState({rerender: true});
        }
    }

    onBlur = () => {
        let _this = this;
        this.isAvoidKeyBoard = false;
        setTimeout(function(){
            if(!_this.isAvoidKeyBoard){
                _this.setState({rerender:true});
            }
        },100)
        
        /*
        if(Platform.OS === 'ios'){
            this.refs.scrollview.scrollTo({x: 0, y: 0, animated: true});
        }*/
        
        
    }

    disableAllLoginBtn = (isDisable) =>{
        this.setState(
            {
                btnLoginDisabled: isDisable
            }
        );
    };

    async login(){
        let isMultiLocation = false;
        let locations = [];
        let allow_multiple_location = false;
        if(String.prototype.trim.call(this.state.username) == '')
        {
            Alert.alert('Error', 'Please enter email');
        }else if(!emailRegx.test(String.prototype.trim.call(this.state.username)))
        {
            Alert.alert('Error', 'Please enter a valid email');
        }else if(String.prototype.trim.call(this.state.password) == '')
        {
            Alert.alert('Error', 'Please enter password');
        }else
        {
            this.disableAllLoginBtn(true);
            this.setState({btnLoginVisibleSpinner:true});
            let businessname = '';    
            //call login api
            //let devicetoken = await Notifications.getExpoPushTokenAsync();
            
            let isSuccess = await fetch(setting.apiUrl + api.authenticate,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: String.prototype.trim.call(this.state.username),
                    password: String.prototype.trim.call(this.state.password)
                    //devicetoken: devicetoken
                })
            }).then((response) => response.json()).then((responseJson) => {
                if(!responseJson.success)
                {
                    Alert.alert('Error', responseJson.message);
                    return false;
                }else
                {
                    if(responseJson.data.status == 0){
                        this.props.navigation.push(Router.getRoute('blocked'));
                    }

                    let token = responseJson.data.token;
                    let userData = {};
                    userData.id = responseJson.data.id;
                    userData.role = responseJson.data.role;
                    userData.serviceprovider_id = responseJson.data.serviceprovider_id;
                    userData.picture = responseJson.data.picture;
                    userData.firstname = responseJson.data.firstname;
                    userData.lastname = responseJson.data.lastname;
                    userData.fullname = responseJson.data.fullname;
                    userData.businessname = responseJson.data.businessname;
                    userData.view_customer_information = responseJson.data.view_customer_information;
                    userData.settings = responseJson.data.settings;
                    userData.state = responseJson.data.state;
                    userData.isAllowGuestBookAvailableTechnician = responseJson.data.isAllowGuestBookAvailableTechnician;
                    userData.isAcceptAnyTechnician = responseJson.data.isAcceptAnyTechnician;
                    userData.isManageTurn = responseJson.data.isManageTurn;
                    userData.isDisableCheckInAppBooking = responseJson.data.isDisableCheckInAppBooking;
                    userData.isDisableApplyRewardPointCheckIn = responseJson.data.isDisableApplyRewardPointCheckIn;
                    userData.isDisableHowItWork = responseJson.data.isDisableHowItWork;
                    userData.allow_multiple_location = responseJson.data.allow_multiple_location;
                    userData.serviceSortType = responseJson.data.serviceSortType;
                    userData.HideservicepriceApp = responseJson.data.HideservicepriceApp;
                    userData.showLessServicesWhenDisableCheckInBooking = responseJson.data.showLessServicesWhenDisableCheckInBooking;
                    userData.showLessServiceCount = responseJson.data.showLessServiceCount;
                    if(responseJson.data.allow_multiple_location){
                        userData.locations = responseJson.data.locations;
                        isMultiLocation = true;
                        locations = responseJson.data.locations;
                        allow_multiple_location = responseJson.data.allow_multiple_location;
                    }
                    

                    userData.isRewardPointTotalBill = responseJson.data.isRewardPointTotalBill;
                    userData.rewardpointtotalbill = responseJson.data.rewardpointtotalbill;
                    userData.checkinCategoryFontSize = responseJson.data.checkinCategoryFontSize;

                    AsyncStorage.setItem(setting.jwtkey,token);
                    AsyncStorage.setItem(setting.userkey,JSON.stringify(userData));
                    businessname = responseJson.data.businessname;
                    this.businessname = businessname;
                    //AsyncStorage.setItem(setting.deviceid,responseJson.data.deviceid.toString());
                    AsyncStorage.setItem(setting.deviceid,"0");
                    return true; 
                }
                
            }).catch((error) => {
                console.error(error);
            });
            
            if(isSuccess){
                //await registerForPushNotificationsAsync();    
                //let device = await getDeviceId();
                let isHome = true;
                if(isMultiLocation && !allow_multiple_location){
                    this.props.navigation.push(Router.getRoute('BlockedMultipleLocation'));        
                }

                if(isMultiLocation && locations.length == 1){
                    AsyncStorage.setItem('location',JSON.stringify(locations[0]));        
                }else if(isMultiLocation && locations.length > 1){
                    isHome = false;
                }else if(isMultiLocation && locations.length == 0){
                    this.props.navigation.push(Router.getRoute('BlockedMultipleLocation'));  
                }
                if(isHome){
                    this.props.navigation.replace(Router.getRoute('home',{businessname: businessname}));
                    
                }else{
                    this.refs.ModalLocation.show(locations);
                }
            }else{
                this.disableAllLoginBtn(false);
                this.setState({btnLoginVisibleSpinner:false});
            }
                
            
        }
    };

    applylocations = (selectedLocation) => {
        AsyncStorage.setItem('location',JSON.stringify(selectedLocation));  
        this.props.navigation.push(Router.getRoute('home',{businessname: this.businessname}));       
    }

    render() {
       
        let styleByKeyBoard = styles.contanerIos;
        if(this.isAvoidKeyBoard){
            styleByKeyBoard = styles.contanerAndroid;
        }

        return (
            <View style={{flex:1}}>

                <Image 
						source={images.nailsBGV2}
					 	style={{width:width,height:height}}
					/>
                <View  style={[styles.containerGradient,{width:width,height:height}]}>
                    <ScrollView style={{flex:1}} contentContainerStyle={styleByKeyBoard} keyboardShouldPersistTaps='always' ref='scrollview'>

                        <View style={layout.formgroupIpad} >
                            <View style={{alignItems: 'center', marginBottom: 15}}>
                                {
                                    Platform.OS === 'ios' && !this.isAvoidKeyBoard &&
                                    <Image source={require('../assets/images/logov2.png')} style={{width: 400, height: 61}}/>
                                }
                                {
                                    Platform.OS != 'ios' && !this.isAvoidKeyBoard &&
                                    <Image source={require('../assets/images/logov2.png')} style={{width: 400, height: 61}}/>
                                }
                            </View>
                        </View>
                        <View style={{width: 370}}>
                        <Text style={{color:"#333", fontSize:20, fontFamily:'Futura', textAlign:"center"}}>Salon Log In</Text>
                        <LinearGradient start={[0, 0]} end={[1, 0]} colors={["rgba(236,111,160, 0.6)", "rgba(249,193,152, 0.6)"]}  style={[styles.txtLoginFormborder]}>
                                    <Icon name='email-outline' size={24} style={styles.inlineicon}/>
                                    <TextInput
                                        style={[styles.txtLoginForm, styles.paddingform]}
                                        placeholder='Email' placeholderTextColor='#333'
                                        onChangeText={(username) => this.setState({username})}
                                        value={this.state.username} underlineColorAndroid={'transparent'}
                                        onFocus={() => this.onFocus(false)}
                                                onBlur={this.onBlur}
                                                autoCapitalize={'none'}
                                    />
                                </LinearGradient>
                                <LinearGradient start={[0, 0]} end={[1, 0]} colors={["rgba(236,111,160, 0.6)", "rgba(249,193,152, 0.6)"]}  style={[styles.txtLoginFormborder]}>
                                    <Icon name='lock-outline' size={24} style={styles.inlineicon}/>
                                    <TextInput
                                        style={[styles.txtLoginForm, styles.paddingform]}
                                        placeholder='Password' placeholderTextColor='#333'
                                        onChangeText={(password) => this.setState({password})}
                                        value={this.state.password} underlineColorAndroid={'transparent'}
                                        secureTextEntry={true}
                                        onFocus={() => this.onFocus(false)}
                                                onBlur={this.onBlur}
                                    />
                                </LinearGradient>
                                <LinearGradient                             
                                    start={[0, 0]}
                                    end={[1, 0]}
                                    colors={[color.reddish, color.reddish]}
                                    style={{height:55,  marginTop:15, borderRadius:50,}}
                                >
                                    <TouchableHighlight disabled={this.state.btnLoginDisabled} underlayColor={color.whiteRGB05}
                                                        style={[styles.paddingform, btn.login]}
                                                        onPress={async () => {await this.login()}}>
                                        <View>
                                            <BtnSpinner visible={this.state.btnLoginVisibleSpinner}
                                                        textStyle={btn.txtLogin} textContent='Login'
                                                        color={color.white} size='small'></BtnSpinner>
                                        </View>
                                    </TouchableHighlight>
                                </LinearGradient> 
                        </View>

                    </ScrollView>
                </View>

                <ModalLocation ref="ModalLocation" applylocations={this.applylocations}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerGradient: {
        flex: 1,
		position:'absolute',
		top:0,
		bottom:0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paddingform: {
        marginBottom: 15,
    },
    hrLeft: {
        borderBottomColor: color.white,
        borderBottomWidth: 0.5,
        //marginTop:10,
        position: 'absolute',
        zIndex: 1,
        width: 110,
        left: 10
    },
    hrRight: {
        borderBottomColor: color.white,
        borderBottomWidth: 0.5,
        //marginTop:10,
        position: 'absolute',
        zIndex: 1,
        width: 110,
        left: 150
    },
    hrContent: {
        position: 'absolute',
        zIndex: 2,
        fontSize: 13,
        paddingLeft: 5,
        paddingRight: 5,
        color: color.white,
        backgroundColor: 'transparent'
    },
    inlineicon: {
        color: color.whiteRBG1,
        position: 'absolute',
        top: 13,
        left: 10,
        backgroundColor: "transparent",
        zIndex: 1
    },
    txtLoginForm: {
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.4)', 
        borderRadius: 50,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 40,
        paddingRight: 10,
        color: '#333',
        fontFamily:'Futura'
    },
    txtLoginFormborder: {
        borderRadius: 50,
        height: 54,
        padding:2,
        marginTop:15,
    },
    loader: {
        flex: 1
    },
    forgotpass:{
        flex: 1, 
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:30
    },
    contanerIos:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    contanerAndroid:{
        flex:1,
        alignItems:'center',
        paddingTop:50
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
});
