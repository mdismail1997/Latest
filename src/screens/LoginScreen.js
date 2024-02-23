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
    AsyncStorage,
    Dimensions,
    Keyboard
} from "react-native";
import {Expo} from "expo";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import btn from "../assets/styles/button";
import layout from "../assets/styles/layout";
import BtnSpinner from "../helpers/btnloader";
import setting from "../constants/Setting";
// import Router from "../navigation/Router";
import registerForPushNotificationsAsync from "../api/registerForPushNotificationsAsync";
import {  getDeviceId } from "../helpers/authenticate";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";
import { images } from "../components/Images";
import { emailRegx } from "../helpers/Utils";
import { api } from "../api/api";
var {height, width} = Dimensions.get('window');
export default class LoginScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: false
        },
    };
    businessname = "";
    state = {
        username: '',
        password: '',
        btnLoginDisabled: false,
        btnLoginFacebookDisabled: false,
        btnLoginGoogleDisabled: false,
        btnLoginVisibleSpinner:false
    };
    isAvoidKeyBoard = false;
    keyboardheight = 0;
    languageKey = typeof(this.props.route.params.language) != 'undefined' ? this.props.route.params.language : 'en-US';
    UNSAFE_componentWillUnmount(){
        //console.log('ok');
        this.keyboardDidShowListener.remove();
        Dimensions.removeEventListener("change", () => {});
    }
    async componentWillMount(){
        this.languageKey = await getLanguage();
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
                btnLoginDisabled: isDisable,
                btnLoginFacebookDisabled:isDisable,
                btnLoginGoogleDisabled:isDisable
            }
        );
    };

    async login(){
        if(String.prototype.trim.call(this.state.username) == '')
        {
            Alert.alert('Error', getTextByKey(this.languageKey,'login_requireemail'));
        }else if(!emailRegx.test(String.prototype.trim.call(this.state.username)))
        {
            Alert.alert('Error', getTextByKey(this.languageKey,'login_requirevalidemail'));
        }else if(String.prototype.trim.call(this.state.password) == '')
        {
            Alert.alert('Error', getTextByKey(this.languageKey,'login_requirepassword'));
        }else
        {
            this.disableAllLoginBtn(true);
            this.setState({btnLoginVisibleSpinner:true});

            //call login api
            let isSuccess = await fetch(setting.apiUrl + api.authenticate,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: String.prototype.trim.call(this.state.username),
                    password: String.prototype.trim.call(this.state.password),
                })
            }).then((response) => response.json()).then((responseJson) => {
                if(!responseJson.success)
                {
                    Alert.alert('Error', responseJson.message);
                    return false;
                }else
                {
                  /*  let token = responseJson.data.token;
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
                    userData.isManageTurn = responseJson.data.isManageTurn;
                    userData.isPrimaryUser = responseJson.data.isPrimaryUser;
                    
                    userData.isTechnicianPermissionAppointment = responseJson.data.isTechnicianPermissionAppointment;
                    userData.TechnicianPermissionType = responseJson.data.TechnicianPermissionType;
                    userData.isStartAppointment = responseJson.data.isStartAppointment;
                    userData.isCheckoutAppointment = responseJson.data.isCheckoutAppointment;
                    userData.isAddAppointment = responseJson.data.isAddAppointment;
                    userData.isEditAppointment = responseJson.data.isEditAppointment;

                    userData.isStartAppointmentForTech = responseJson.data.isStartAppointmentForTech;
                    userData.isCheckoutAppointmentForTech = responseJson.data.isCheckoutAppointmentForTech;
                    userData.isAddAppointmentForTech = responseJson.data.isAddAppointmentForTech;
                    userData.isEditAppointmentForTech = responseJson.data.isEditAppointmentForTech;
                    userData.rewardpointDailyCheckInType =  responseJson.data.rewardpointDailyCheckInType;
                    userData.plusPointForDailyCheckInWhenDisableBooking = responseJson.data.plusPointForDailyCheckInWhenDisableBooking;
                    userData.rewardpointTotalBillType = responseJson.data.rewardpointTotalBillType;
                    if(userData.rewardpointDailyCheckInType == "bytotalbill"){
                        userData.rewardpointtotalbillCheckin = responseJson.data.rewardpointtotalbillCheckin;
                    }
                    AsyncStorage.setItem(setting.jwtkey,token);
                    AsyncStorage.setItem(setting.userkey,JSON.stringify(userData));
                   */

                    if(responseJson.data.status == 0){
                        this.props.navigator.push('blocked');
                    }

                    let token = responseJson.data.token;
                    let userData = {};
                    userData.email = responseJson.data.email;
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
                    userData.country = responseJson.data.country;
                    userData.isPrimaryUser = responseJson.data.isPrimaryUser;
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
                    userData.street_number = responseJson.data.street_number;
                    userData.street_name = responseJson.data.street_name;
                    userData.city = responseJson.data.city;
                    userData.zipcode = responseJson.data.zipcode;
                    userData.phone = responseJson.data.phone;
                    userData.domain = responseJson.data.domain;
                    userData.PrintOut = responseJson.data.PrintOut;
                    userData.covid19 = responseJson.data.covid19;
                    userData.showLessServiceCount = responseJson.data.showLessServiceCount;
                    if(responseJson.data.allow_multiple_location){
                        userData.locations = responseJson.data.locations;
                        isMultiLocation = true;
                        locations = responseJson.data.locations;
                        allow_multiple_location = responseJson.data.allow_multiple_location;
                    }
                    userData.isStartAppointmentForTech = responseJson.data.isStartAppointmentForTech;
                    userData.isCheckoutAppointmentForTech = responseJson.data.isCheckoutAppointmentForTech;
                    userData.isAddAppointmentForTech = responseJson.data.isAddAppointmentForTech;
                    userData.isEditAppointmentForTech = responseJson.data.isEditAppointmentForTech;
                    userData.rewardpointDailyCheckInType =  responseJson.data.rewardpointDailyCheckInType;
                    userData.plusPointForDailyCheckInWhenDisableBooking = responseJson.data.plusPointForDailyCheckInWhenDisableBooking;
                    userData.rewardpointTotalBillType = responseJson.data.rewardpointTotalBillType;
                    if(userData.rewardpointDailyCheckInType == "bytotalbill"){
                        userData.rewardpointtotalbillCheckin = responseJson.data.rewardpointtotalbillCheckin;
                    }
                    userData.rewardPointTotalBillBookingOnline = responseJson.data.rewardPointTotalBillBookingOnline;
                    userData.rewardPointTypePlusBookingOnline = responseJson.data.rewardPointTypePlusBookingOnline;
                    userData.rewardPointUseApplication = responseJson.data.rewardPointUseApplication;
                    userData.rewardPointBirthday = responseJson.data.rewardPointBirthday;
                    userData.rewardPointExpired = responseJson.data.rewardPointExpired;
                    userData.rewardPointPercentBookingOnline = responseJson.data.rewardPointPercentBookingOnline;
                    userData.rewardPointTypeBookingOnline = responseJson.data.rewardPointTypeBookingOnline;

                    userData.MonthUseRewardPoint = responseJson.data.MonthUseRewardPoint;
                    userData.isRewardPointTotalBill = responseJson.data.isRewardPointTotalBill;
                    userData.rewardpointtotalbill = responseJson.data.rewardpointtotalbill;
                    userData.checkinCategoryFontSize = responseJson.data.checkinCategoryFontSize;
 
                    userData.isTechnicianPermissionAppointment = responseJson.data.isTechnicianPermissionAppointment;
                    userData.TechnicianPermissionType = responseJson.data.TechnicianPermissionType;
                    userData.isStartAppointment = responseJson.data.isStartAppointment;
                    userData.isCheckoutAppointment = responseJson.data.isCheckoutAppointment;
                    userData.isAddAppointment = responseJson.data.isAddAppointment;
                    userData.isEditAppointment = responseJson.data.isEditAppointment;
                    userData.percentPlusForGiftCard = responseJson.data.percentPlusForGiftCard;
                    userData.planTotalCustomer = responseJson.data.planTotalCustomer;
                    userData.smsUsed = responseJson.data.smsUsed;
                    userData.MaximumApplyRewardPointType = responseJson.data.MaximumApplyRewardPointType;
                    userData.MaximumApplyRewardPointVip = responseJson.data.MaximumApplyRewardPointVip;
                    userData.MaximumApplyRewardPoint = responseJson.data.MaximumApplyRewardPoint;
                    userData.smsMarketingTotal = responseJson.data.smsMarketingTotal;
                    userData.smsMarketingUsed = responseJson.data.smsMarketingUsed;
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
                await registerForPushNotificationsAsync();    
                //let device = await getDeviceId();
               
                this.props.navigator.push('home',{language: this.languageKey, businessname:this.businessname});
            }
            this.disableAllLoginBtn(false);
            this.setState({btnLoginVisibleSpinner:false});    
            
        }
    };

    loginFacebook = () => {
        this.disableAllLoginBtn(true);
    };

    loginGoogle = () => {
        this.disableAllLoginBtn(true);
    };
/*
    isAvaiLableLogin = (loginCase) => {
        var check = false;
        switch(loginCase)
        {
            case 'email':
                check = (!this.state.btnLoginFacebookDisabled && !this.state.btnLoginGoogleDisabled);
                break;
            case 'facebook':console.log('ok');
                check = (!this.state.btnLoginDisabled && !this.state.btnLoginGoogleDisabled);
                break;
            case 'google':
                check = (!this.state.btnLoginDisabled && !this.state.btnLoginFacebookDisabled);
                break;
        }
        console.log(check);
        return check;
    };
*/

    render() {
        let styleByKeyBoard = styles.contanerIos;
        if(this.isAvoidKeyBoard){
            styleByKeyBoard = styles.contanerAndroid;
        }
        return (
            <LinearGradient start={[0, 0]} end={[1, 1.0]} colors={[color.reddish, color.carrot]} style={[styles.container, styleByKeyBoard ]}>
                <View style={{width:"35%", flex:1}}>
                <Image source={images.loginImg} style={{width: "100%", height:height}}/>
                </View>
                <View style={styles.formgroup}>
                    <View style={{width:400}}>
                    <View style={{alignItems: 'center', marginBottom: 70}}>
                        <Image source={images.logo} style={{width: 400, height: 58}}/>
                    </View>
                    <View style={{width:400, marginLeft:15}}>
                        <View >
                            <Icon name='email-outline' size={35} style={styles.inlineicon}/>
                            <TextInput
                                style={[styles.txtLoginForm, styles.paddingform]}
                                placeholder='Email' placeholderTextColor={color.white}
                                onChangeText={(username) => this.setState({username})}
                                value={this.state.username} underlineColorAndroid={'transparent'}
                                onFocus={() => this.onFocus(false)}
                                                    onBlur={this.onBlur}
                            />
                        </View>
                        <View>
                            <Icon name='lock-outline' size={35} style={styles.inlineicon}/>
                            <TextInput
                                style={[styles.txtLoginForm, styles.paddingform]}
                                placeholder={getTextByKey(this.languageKey,'password')} placeholderTextColor={color.white}
                                onChangeText={(password) => this.setState({password})}
                                value={this.state.password} underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                onFocus={() => this.onFocus(false)}
                                                    onBlur={this.onBlur}
                            />
                        </View>
                        <View>
                            <TouchableHighlight disabled={this.state.btnLoginDisabled} underlayColor={color.whiteRGB05}
                                                style={[styles.paddingform, btn.login]}
                                                onPress={async () => {await this.login()}}>
                                <View>
                                    <BtnSpinner visible={this.state.btnLoginVisibleSpinner}
                                                textStyle={btn.txtLogin} textContent={getTextByKey(this.languageKey,'login')}
                                                color={color.lightishPink} size='small'></BtnSpinner>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    
                    {/*
                    <View style={{alignItems: 'center', marginBottom: 35, marginTop: 25, justifyContent: 'center'}}>
                        <View style={styles.hrLeft}></View>
                        <Text style={styles.hrContent}>or</Text>
                        <View style={styles.hrRight}></View>
                    </View>

                    <View>
                        <TouchableHighlight disabled={this.state.btnLoginFacebookDisabled} underlayColor='rgba(255,255,255,0.8)' style={[btn.loginsocial]}
                                            onPress={() => this.loginFacebook()}>
                            <Text style={btn.txtLoginSocial}>Log In with Facebook</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={{marginTop: 15}}>
                        <TouchableHighlight underlayColor='rgba(255,255,255,0.8)' style={[btn.loginsocial]}
                                            onPress={() => this.loginGoogle()}>
                            <Text style={btn.txtLoginSocial}>Log In with Google</Text>
                        </TouchableHighlight>
                    </View>
                    */}
                    <View style={styles.forgotpass}>
                        {/*
                        <View style={{ height: 50}}>
                            <TouchableHighlight>
                                <Text style={btn.txtSignUp}>Sign Up</Text>
                            </TouchableHighlight>
                        </View>
                        
                        <View style={{ height: 50}}>
                            <TouchableHighlight>
                                <Text style={btn.txtSignUp}>Forgot Password?</Text>
                            </TouchableHighlight>
                        </View>
                        */}
                    </View>
                    </View>
                </View>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
    },
    formgroup: {
        width: "65%",
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
        color: color.whiteRGB05,
        position: 'absolute',
        top: 9,
        left: 10,
        backgroundColor: "transparent",
        zIndex: 1
    },
    txtLoginForm: {
        height: 55,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 40,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 55,
        paddingRight: 10,
        color: color.white,
        fontSize:20,
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
        marginTop: 0
    },
});
