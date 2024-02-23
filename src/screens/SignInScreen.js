import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard, Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useTheme } from 'react-native-paper';
import { AuthContext } from '../components/context';
import Users from '../model/users';
import setting from "../constants/Setting";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BtnSpinner from "../helpers/btnloader";
import registerForPushNotificationsAsync from "../api/registerForPushNotificationsAsync";
import MailModal from "../components/MailModal";
import CheckBox from 'react-native-check-box';
import { color } from '../assets/colors/colors';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import { api } from '../api/api';
import { apiHeader } from '../api/apiHeader';
const SignInScreen = ({ navigation }) => {
    let mailmodalRef = React.createRef();
    let ModalConsentFormCovid19Ref = React.createRef();
    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        btnLoginVisibleSpinner: false,
        btnLoginDisabled: false,
        valueUsername: '',
        consentForm: false
    });
    // useEffect(() => {
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
    let arrMailDefault = ["gmail.com", "hotmail.com", "yahoo.com", "yahoo.com.vn", "mail.com", "live.com", "rocketmail.com", "msn.com", "thepronails.com", "outlook.com"];
    const { colors } = useTheme();
    const { signIn } = React.useContext(AuthContext);

    const textInputChange = (val) => {
        if (validate(val)) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true,
                valueUsername: val
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false,
                valueUsername: val
            });
        }

        var str = val;
        var arr = str.split("@");
        if (arr.length > 1 && arr[1] == "") {
            mailmodalRef.current.show(arrMailDefault, true);
        } else if (arr.length > 1 && arr[1] != "") {
            let arrmailFilter = arrMailDefault.filter(function (el) {
                return el.toLowerCase().indexOf(arr[1]) !== -1;
            });
            if (arrmailFilter.length == 0) {
                mailmodalRef.current.show([], false);
            } else {
                mailmodalRef.current.show(arrmailFilter, true);
            }
        } else mailmodalRef.current.show([], false);
        var str = val;
        var arr = str.split("@");
        if (arrMailDefault.includes(arr[1])) {
            mailmodalRef.current.show([], false);
        }

    }

    _onSelectedMail = (mail) => {
        // this.clientInputRef.current.setState({text: fullinfo});
        var value = data.username;
        var arr = value.split("@");
        value = arr[0] + "@" + mail;
        setData({
            ...data,
            username: value,
            check_textInputChange: true,
            isValidUser: true,
            valueUsername: value
        });
        mailmodalRef.current.show([], false);
    }
    const handlePasswordChange = (val) => {
        if (val.trim().length >= 8) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }
    const validate = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        return expression.test(String(email).toLowerCase())
    }
    const loginHandle = async (userName, password) => {
        if (data.username.length == 0 || data.password.length == 0) {
            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
                { text: 'Okay' }
            ]);
            return;
        }
        if (!data.isValidUser) {
            Alert.alert('Wrong Input!', 'Please enter a valid email address.', [
                { text: 'Okay' }
            ]);
            return;
        }
        if (!data.isValidPassword) {
            Alert.alert('Wrong Input!', 'Please enter a valid password.', [
                { text: 'Okay' }
            ]);
            return;
        }
        setData({
            ...data,
            btnLoginDisabled: true,
            btnLoginVisibleSpinner: true
        });
        let isSuccess = await fetch(setting.apiUrl + api.authenticate, {
            method: 'POST',
            headers: apiHeader,
            body: JSON.stringify({
                email: String.prototype.trim.call(data.username),
                password: String.prototype.trim.call(data.password),
            })
        }).then((response) => response.json()).then((responseJson) => {
            if (!responseJson.success) {
                Alert.alert('Invalid User!', 'Username or password is incorrect.');
                return false;
            } else {
                if (responseJson.data.status == 0) {
                    // this.props.navigation.push('blocked');
                    Alert.alert('Wrong Input!', 'User blocked! please contact admin.', [
                        { text: 'Okay' }
                    ]);
                    return;
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
                if (responseJson.data.allow_multiple_location) {
                    userData.locations = responseJson.data.locations;
                    isMultiLocation = true;
                    locations = responseJson.data.locations;
                    allow_multiple_location = responseJson.data.allow_multiple_location;
                }
                userData.isStartAppointmentForTech = responseJson.data.isStartAppointmentForTech;
                userData.isCheckoutAppointmentForTech = responseJson.data.isCheckoutAppointmentForTech;
                userData.isAddAppointmentForTech = responseJson.data.isAddAppointmentForTech;
                userData.isEditAppointmentForTech = responseJson.data.isEditAppointmentForTech;
                userData.rewardpointDailyCheckInType = responseJson.data.rewardpointDailyCheckInType;
                userData.plusPointForDailyCheckInWhenDisableBooking = responseJson.data.plusPointForDailyCheckInWhenDisableBooking;
                userData.rewardpointTotalBillType = responseJson.data.rewardpointTotalBillType;
                if (userData.rewardpointDailyCheckInType == "bytotalbill") {
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
                userData.GatewayPayment = responseJson.data.GatewayPayment;
                userData.notcalculatorServiceDuration = responseJson.data.notcalculatorServiceDuration;
                userData.disable_button_checkin = responseJson.data.disable_button_checkin;
                userData.disable_button_express = responseJson.data.disable_button_express;
                userData.service_app_checkin = responseJson.data.service_app_checkin;
                userData.fieldClient_app_checkin = responseJson.data.fieldClient_app_checkin;

                userData.TotalBillMoreThanOrEqualApplyRewardPoint = responseJson.data.TotalBillMoreThanOrEqualApplyRewardPoint;
                userData.total_points_redeem_online = responseJson.data.total_points_redeem_online;

                AsyncStorage.setItem(setting.jwtkey, token);
                AsyncStorage.setItem(setting.userkey, JSON.stringify(userData));
                AsyncStorage.setItem(setting.deviceid, "0");
                // if(Platform.OS != 'ios'){
                //     Updates.reloadAsync();
                // }
                return { id: userData.id, userToken: token, businessname: responseJson.data.businessname, role: responseJson.data.role };
            }

        }).catch((error) => {
            console.error(error);
        });
        if (typeof (isSuccess) != 'undefined' && isSuccess) {
            if (Platform.OS == 'ios') {
                await registerForPushNotificationsAsync();
            }
            let userData = isSuccess;
            signIn({ id: userData.id, userToken: userData.userToken, businessname: userData.businessname, role: userData.role });
        }
        setData({
            ...data,
            btnLoginDisabled: false,
            btnLoginVisibleSpinner: false
        });
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>


                <View style={styles.container}>
                <FocusAwareStatusBar />
                    <View style={styles.header}>
                        <Animatable.Image
                            animation="bounceIn"
                            duraton="1500"
                            source={require('../assets/images/logo2x.png')}
                            style={styles.logo}
                            resizeMode="stretch"
                        />
                    </View>
                    <Animatable.View
                        animation="fadeInUpBig"
                        style={[styles.footer, {
                            backgroundColor: colors.background
                        }]}
                    >
                        <Text style={[styles.text_footer, {
                            color: colors.text
                        }]}>Username</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color={colors.text}
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Username"
                                placeholderTextColor="#666666"
                                style={[styles.textInput, {
                                    color: colors.text
                                }]}
                                autoCapitalize="none"
                                onChangeText={(val) => textInputChange(val)}
                                onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                                value={data.valueUsername}
                            />
                            {data.check_textInputChange ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="green"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null}
                        </View>
                        <MailModal
                            ref={mailmodalRef}
                            onSelectedMail={this._onSelectedMail}
                            top={90}
                        />
                        {data.isValidUser ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Please enter a valid email address.</Text>
                            </Animatable.View>
                        }


                        <Text style={[styles.text_footer, {
                            color: colors.text,
                            marginTop: 35
                        }]}>Password</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color={colors.text}
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Password"
                                placeholderTextColor="#666666"
                                secureTextEntry={data.secureTextEntry ? true : false}
                                style={[styles.textInput, {
                                    color: colors.text
                                }]}
                                autoCapitalize="none"
                                onChangeText={(val) => handlePasswordChange(val)}
                            />
                            <TouchableOpacity
                                onPress={updateSecureTextEntry}
                            >
                                {data.secureTextEntry ?
                                    <Feather
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                    />
                                    :
                                    <Feather
                                        name="eye"
                                        color="grey"
                                        size={20}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                        {data.isValidPassword ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
                            </Animatable.View>
                        }


                        <TouchableOpacity>
                            <Text style={{ color: color.darkCyan, marginTop: 15 }}>Forgot password?</Text>
                        </TouchableOpacity>

                        <View style={styles.button}>
                            <TouchableOpacity
                                disabled={data.btnLoginDisabled}
                                style={styles.signIn}
                                onPress={() => { loginHandle(data.username, data.password) }}
                            >
                                <LinearGradient
                                    colors={[color.lightCyan, color.hsl]}
                                    style={styles.signIn}
                                >

                                    <BtnSpinner visible={data.btnLoginVisibleSpinner} textContent='Sign In' textStyle={styles.textSign} color={color.white} size='small' />
                                </LinearGradient>

                            </TouchableOpacity>

                            <TouchableOpacity
                                // onPress={() => navigation.navigate('SignUpScreen')}
                                style={[styles.signIn, {
                                    borderColor: color.darkCyan,
                                    borderWidth: 1,
                                    marginTop: 15
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: color.darkCyan
                                }]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.darkCyan
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: color.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: color.white,
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: color.lightWhite,
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: color.white
    },
    logo: {
        width: 300,
        height: 50,
    },
});
