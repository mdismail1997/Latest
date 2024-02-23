import React from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    AlertIOS,
    Alert,
    Image,
    TextInput,
    ScrollView,
    Keyboard,
    Platform,
    TouchableWithoutFeedback
} from "react-native";
import * as Updates from 'expo-updates';
import { Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { getBackground, getLogo } from "../../api/Assets";
// import Router from "../../navigation/Router";
import {
    fetchTechniciansData,
    fetchBusinesshours,
    fetchServices,
    fetchBlockedTime,
    fetchTechniciansWorkingHour,
    fetchListCombo,
    getCurrentLocation,
    getSwitchMode
} from "../../api/fetchdata";

import {
    jwtToken,
    getUserData
} from "../../helpers/authenticate";
import moment from 'moment';
import SpinnerLoader from "../../helpers/spinner";
import layout from "../../assets/styles/layout_checkin";
import Colors from "../../constants/Colors_checkin";
import SubmitLoader from "../../helpers/submitloader";
import AlertLoader from "../../helpers/loaderalert";
import setting from "../../constants/Setting";
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenSaver from './ScreenSaver';
import { formatPhone } from "../../helpers/Utils";
import { getUSState2Digit, get_time_zone, getCountry2Digit } from "../../helpers/Utils";
import "../../helpers/timezone";
import Prompt from "../../components_checkin/Prompt";
import SwitchCheckIn from "../../components_checkin/switchcheckin";
import ModalBarCode from "../../components_checkin/ModalBarCode";
import ProfileTechnicianCheckIn from "../../components_checkin/ProfileTechnicianCheckIn";
import MailModal from "../../components/MailModal";
import { array } from "prop-types";
import { color } from "../../assets/colors/colors";
import { images } from "../../components/Images";
import { gStrings } from "../../components/staticStrings";
import { api } from "../../api/api";
var { height, width } = Dimensions.get('window');
var widthRight = width * 0.7;
var scrollviewpadding = 0;
let checkinfontsize = 35;
if (width > 768) {
    checkinfontsize = 40;
}
export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.mailmodalRef = React.createRef();
    }
    static navigationOptions = {
        title: 'Details',
    };
    static route = {
        navigationBar: {
            visible: false
        }
    };
    background_app = '';
    logo_app = '';
    logo_width = 0;
    logo_height = 0;
    technicians = [];
    clients = [];
    availablehours = [];
    services = [];
    blockedTime = [];
    categories = [];
    listCategories = [];
    listcombo = [];
    TechniciansWorkingHour = [];
    userData = {};
    YM = moment().format('YMM');
    loadedYM = {};
    isLoaded = false;
    sized = false;
    state = {
        appIsReady: false,
        search: '',
        maxLength: 10000
    };
    isShowStaffCheckIn = false;
    intervalCount = 0;
    isOnScreenSaver = false;
    isAvoidKeyBoard = false;
    keyboardheight = 0;
    opening_hours = [];
    checkintext = 'Check In';
    qrCodePermissionStatus = false;
    businessname = '';
    isswitchmode = true;
    arrMailDefault = ["gmail.com", "hotmail.com", "yahoo.com", "yahoo.com.vn", "mail.com", "live.com", "rocketmail.com", "msn.com", "thepronails.com", "outlook.com"];
    async UNSAFE_componentWillMount() {
        // if(Platform.OS != "ios"){
        //     await  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
        // }
        // if(Platform.OS === "ios"){
        //     await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        // }
        const { status } = await Camera.requestCameraPermissionsAsync();
        this.qrCodePermissionStatus = (status === 'granted');
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));

        this.businessname = this.props.route.params.businessname;
        if (typeof (this.props.route.params.isShowStaffCheckIn) != 'undefined') {
            this.isShowStaffCheckIn = this.props.route.params.isShowStaffCheckIn;
        }
        // this.isswitchmode = await getSwitchMode();
        // if(!this.isswitchmode){
        //     this.checkintext = 'Express Check-In';
        // }
        this.isswitchmode = true;
        var screen = Dimensions.get('window');
        width = screen.width;
        height = screen.height;
        widthRight = width * 0.7;
        if (width > 768) {
            checkinfontsize = 40;
        } else {
            checkinfontsize = 35;
        }
        if (typeof (this.props.route.params.isBooked) != 'undefined') {
            if (typeof (this.props.route.params.logo_app) != 'undefined') {
                this.logo_app = this.props.route.params.logo_app;
            }
            if (typeof (this.props.route.params.isDisableBooking) != 'undefined') {
                this.checkintext = 'Search';
            }

            this.setState({ appIsReady: true });
            await this.loadData(true);
        } else {
            await this.loadData(false);
        }

        let _this = this;
        Dimensions.addEventListener('change', function () {
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;
            widthRight = width * 0.7;
            if (width > 768) {
                checkinfontsize = 40;
            } else {
                checkinfontsize = 35;
            }

            _this.setState({ appIsReady: true });
        })
        if (!this.userData.isDisableHowItWork) {
            this.keepawake();
        }
    }

    async loadData(isReady) {
        let logo_app = await getLogo();
        let background_app_link = '';
        if (background_app_link != '' && background_app_link != null) {
            this.background_app = background_app_link;
        }

        if (logo_app != '' && logo_app != null) {
            this.logo_app = logo_app;
        }

        this.token = await jwtToken();
        this.userData = await getUserData();
        this.stateData = getUSState2Digit(this.userData.state);
        let country = getCountry2Digit(this.userData.country);
        this.timezone = get_time_zone(country, this.stateData);
        this.technicians = [];
        this.location = await getCurrentLocation();
        this.locationId = 0;
        if (typeof (this.location) != 'undefined' && typeof (this.location.id) != 'undefined') {
            this.multipleLocation = true;
            this.locationId = this.location.id;
        }

        if (typeof (this.userData.showLessServicesWhenDisableCheckInBooking) != 'undefined') {
            if (this.userData.showLessServicesWhenDisableCheckInBooking) {
                this.userData.isDisableCheckInAppBooking = 0;
            }
        }

        if (this.userData.isDisableCheckInAppBooking) {
            this.checkintext = 'Search';
        }

        if (!this.userData.isManageTurn) {
            this.technicians = await fetchTechniciansData(this.token, this.locationId);
        } else {
            this.isShowStaffCheckIn = true;
        }
        this.availablehours = await fetchBusinesshours(this.token);
        this.opening_hours = this.availablehours.opening_hours;


        this.blockedTime = await fetchBlockedTime(this.token, this.YM);
        this.TechniciansWorkingHour = await fetchTechniciansWorkingHour(this.token);
        this.loadedYM[this.YM] = this.YM;




        //opening_hours

        this.services = await fetchServices(this.token, this.locationId);
        let service_custom_app_checkin = [];
        if (typeof (this.userData.service_app_checkin) != undefined && this.userData.service_app_checkin != '' && this.userData.service_app_checkin != null) {
            let _thisService = this.services;
            this.userData.service_app_checkin.forEach(function (itemID) {
                let item_service = _thisService.filter(function (item_filter_service) {
                    return item_filter_service.id == itemID
                });
                if (item_service.length > 0) {
                    service_custom_app_checkin.push(item_service[0]);
                }
            });
            this.services = service_custom_app_checkin;
        }
        let _this = this;
        let categoriesDisplay = [];
        let tempCategory = [];
        this.services.forEach(function (item) {
            let category = tempCategory.filter(function (itemCategory) {
                if (typeof (item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != '') {
                    return itemCategory == item.category_customname;
                } else {
                    return itemCategory == item.category_name;
                }

            });

            if (!category.length) {
                let cat_name = item.category_name;
                if (typeof (item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != '') {

                    cat_name = item.category_customname;
                }
                tempCategory.push(cat_name);
                let categoriesDisplayData = {};
                categoriesDisplayData.name = cat_name;
                categoriesDisplayData.ordering = item.category_ordering;
                categoriesDisplayData.id = item.category_id;
                categoriesDisplayData.originname = item.category_name;
                categoriesDisplayData.category_backgroundcolor = item.category_backgroundcolor
                categoriesDisplay.push(categoriesDisplayData);

            }
        });

        categoriesDisplay = categoriesDisplay.sort(function (a, b) {
            if (a.ordering < b.ordering) return -1;
            else if (a.ordering > b.ordering) return 1;
            return 0;
        });

        categoriesDisplay.forEach(function (item) {
            _this.categories.push(item.name);
        })

        this.listCategories = categoriesDisplay;

        if (this.userData.isDisableCheckInAppBooking) {
            let categoryCheckIn = [];
            this.listCategories.forEach((itemCategory) => {
                let serviceInCategories = this.services.filter(function (item) {
                    if (typeof (item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != '') {
                        return item.category_customname == itemCategory.name && item.status == 'YES';
                    } else {
                        return item.category_name == itemCategory.name && item.status == 'YES';
                    }

                });
                if (serviceInCategories.length) {
                    categoryCheckIn.push(itemCategory);
                }
            })

            this.listCategories = categoryCheckIn;
        } else {
            if (typeof (this.userData.showLessServicesWhenDisableCheckInBooking) != 'undefined') {
                if (this.userData.showLessServicesWhenDisableCheckInBooking) {
                    let categoryCheckIn = [];
                    this.listCategories.forEach((itemCategory) => {
                        let serviceInCategories = this.services.filter(function (item) {
                            if (typeof (item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != '') {
                                return item.category_customname == itemCategory.name && item.status == 'YES';
                            } else {
                                return item.category_name == itemCategory.name && item.status == 'YES';
                            }

                        });
                        if (serviceInCategories.length) {
                            categoryCheckIn.push(itemCategory);
                        }
                    })

                    this.listCategories = categoryCheckIn;
                }
            }
        }
        /*
      _this.categories = _this.categories.sort(function (a, b) {
          if (a < b) return -1;
          else if (a > b) return 1;
          return 0;
        });*/
        this.listcombo = await fetchListCombo(this.token);

        this.isLoaded = true;
        if (!isReady) {
            this.setState({ appIsReady: true });
        }
    }

    async checkin() {
        if (!this.isLoaded) {
            this.refs.SpinnerLoader.setState({ visible: true });
            await this.loadData(false);
        }
        this.props.navigation.push('checkin', {
            clients: this.clients,
            technicians: this.technicians,
            availablehours: this.availablehours.available_hours,
            services: this.services,
            token: this.token,
            blockedTime: this.blockedTime,
            TechniciansWorkingHour: this.TechniciansWorkingHour,
            userData: this.userData,
            blockedTimeYM: this.loadedYM,
            listcombo: this.listcombo,
            categories: this.categories,
            isShowStaffCheckIn: this.isShowStaffCheckIn,
            logo_app: this.logo_app,
            listCategories: this.listCategories,
            timezone: this.timezone
        });
    }

    checkincustomer = async () => {
        if (!this.isLoaded) {
            this.refs.SpinnerLoader.setState({ visible: true });
            await this.loadData(false);
        }
        this.props.navigation.push('CustomerCheckIn', {
            clients: this.clients,
            token: this.token,
            businessname: this.businessname,
            logo_app: this.logo_app
        });
    }

    cancelSetting = () => {
        this.keepawake();
        this.isOnScreenSaver = false;
    }

    openSetting = () => {
        // this.isOnScreenSaver = true;
        // this.refs.logout.show();
        /*
        AlertIOS.prompt(this.props.route.params.businessname,'Enter your merchant account password to access setting section',[
            {text: 'Cancel', style: 'cancel', onPress: this.cancelSetting},
            {text: 'OK', onPress: async password => await this.checkAuthorized(password)},
          ],'secure-text');*/
        this.props.navigation.push('setting', { businessname: this.props.route.params.businessname, token: this.token });
    }
    switchMode = () => {
        this.refs.switchmode.show();
    }

    async switchcheckin(mode) {
        if (mode) {
            AsyncStorage.setItem('switchmode', JSON.stringify({ mode: "express-checkin" }));
        } else {
            AsyncStorage.setItem('switchmode', JSON.stringify({ mode: "checkin" }));
        }
        Updates.reloadAsync();
    }

    async openSalon() {
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'tab' }],
        });
    }

    onClosePrompt = () => {
        this.keepawake();
        this.isOnScreenSaver = false;
    }

    cancelStaffCheckIn = () => {
        this.keepawake();
        this.isOnScreenSaver = false;
    }

    openStaffCheckIn = () => {

        this.isOnScreenSaver = true;
        this.refs.prompt.show();
        /*
        AlertIOS.prompt('Staff Check In','Enter your passcode to check in',[
            {text: 'Cancel', style: 'cancel', onPress: this.cancelStaffCheckIn},
            {text: 'OK', onPress: async password => await this.checkInWithPassCode(password)},
          ],'secure-text');  */
    }

    checkInWithPassCode = async (password, type) => {
        //this.refs.prompt.setState({animationType:'none'});
        this.keepawake();
        this.isOnScreenSaver = false;
        if (String.prototype.trim.call(password) == '') {
            Alert.alert('Error', 'Please enter passcode');
        } else {
            this.refs.authenticateLoader.setState({ visible: true });

            this.refs.prompt.close();
            let _this = this;
            let isSuccess = await fetch(setting.apiUrl + api.technicianCheckin, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.token
                },
                body: JSON.stringify({
                    passcode: password,
                    type: type
                })
            }).then((response) => response.json()).then((responseJson) => {
                if (!responseJson.success) {
                    setTimeout(function () {
                        _this.refs.authenticateLoader.setState({ visible: false });
                        setTimeout(function () {
                            Alert.alert('Error', responseJson.message);
                        }, 200);
                    }, 1000)

                    return false;
                } else {
                    setTimeout(function () {
                        _this.refs.authenticateLoader.setState({ visible: false });

                        _this.refs.ProfileTechnicianCheckIn.setState({
                            name: responseJson.name,
                            phone: responseJson.phone,
                            email: responseJson.email,
                            message: responseJson.message,
                            datecheckin: responseJson.datecheckin,
                            datecheckout: responseJson.datecheckout,
                        });
                        _this.refs.ProfileTechnicianCheckIn.show();
                        setTimeout(function () {
                            _this.refs.CheckInLoader.setState({
                                visible: false
                            });


                        }, 2000);
                    }, 1000)

                    return true;
                }

            }).catch((error) => {
                console.error(error);
            });

        }
    }

    async checkAuthorized(password, type) {
        this.keepawake();
        this.isOnScreenSaver = false;
        if (String.prototype.trim.call(password) == '') {
            Alert.alert('Error', 'Please enter password');
        } else {
            this.refs.authenticateLoader.setState({ visible: true });
            if (typeof (type) != "undefined" && type == "salonpage") {
                this.refs.salonpage.close();
            } else {
                this.refs.logout.close();
            }
            let _this = this;
            let isSuccess = await fetch(setting.apiUrl + api.authorizeCheck, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.token
                },
                body: JSON.stringify({
                    password: password
                })
            }).then((response) => response.json()).then((responseJson) => {
                if (!responseJson.success) {
                    setTimeout(function () {
                        _this.refs.authenticateLoader.setState({ visible: false });
                        setTimeout(function () {
                            Alert.alert('Error', responseJson.message);
                        }, 200);
                    }, 1000)

                    return false;
                } else {
                    return true;
                }

            }).catch((error) => {
                console.error(error);
            });
            if (isSuccess) {
                if (typeof (type) != "undefined" && type == "salonpage") {
                    AsyncStorage.setItem('salonlogin', JSON.stringify({ login: true }));
                    clearInterval(this.intervalCount);
                    setTimeout(function () {
                        _this.refs.authenticateLoader.setState({ visible: false });
                        _this.props.navigation.push('rootNavigation', { language: "en-US" });
                    }, 1000)
                } else {
                    setTimeout(function () {
                        _this.refs.authenticateLoader.setState({ visible: false });
                        _this.props.navigation.push('setting', { businessname: _this.props.route.params.businessname, token: _this.token });
                    }, 100)

                }

            }
        }

    }

    closeScreenSaver = () => {
        this.keepawake();
        this.isOnScreenSaver = false;
    }

    keepawake = () => {
        if (!this.userData.isDisableHowItWork) {
            clearInterval(this.intervalCount);
            let _this = this;
            this.intervalCount = setInterval(function () {
                if (_this.props.route.name == 'home' && !_this.isOnScreenSaver) {
                    _this.isOnScreenSaver = true;
                    // _this.refs.ScreenSaver.show();
                }
                //},0);      
            }, 60 * 3000);
        }
        // 60 * 3000

    }

    onFocus = (isScroll) => {
        this.keepawake();
        this.isOnScreenSaver = true;
        this.isAvoidKeyBoard = true;
        this.mailmodalRef.current.customTop(210);
        if (isScroll) {
            if (Platform.OS === 'ios') {

            } else {
                this.setState({ rerender: true });
            }

        }

    }

    onBlur = () => {

        this.keepawake();
        this.isOnScreenSaver = false;
        this.isAvoidKeyBoard = false;
        this.mailmodalRef.current.customTop(150);
        if (Platform.OS === 'ios') {
            this.refs.scrollview.scrollTo({ x: 0, y: 0, animated: true });
        }

        this.setState({ rerender: true });
    }

    _keyboardDidShow(e) {
        //let keyboardHeight = Dimensions.get('window').height - e.endCoordinates.height;
        this.keyboardheight = e.endCoordinates.height;
        if (this.isAvoidKeyBoard) {
            this.onFocus(true);
            this.setState({ rerender: true });
        }

    }

    changeSearch = (value) => {
        var _this = this;
        value = String.prototype.trim.call(value);
        value = value.replace('(', '');
        value = value.replace(')', '');
        value = value.replace(' ', '');
        value = value.replace('-', '');
        if (value.length >= 3 && !isNaN(value)) {
            let formatValue = formatPhone(value);
            _this.setState({ search: formatValue, maxLength: 14 });
        }
        else {
            _this.setState({ search: value, maxLength: 10000 });
        }
        var str = value;
        var arr = str.split("@");
        this.mailmodalRef.current.customTop(210);
        if (arr.length > 1 && arr[1] == "") {
            this.mailmodalRef.current.show(this.arrMailDefault, true, 370);
        } else if (arr.length > 1 && arr[1] != "") {
            let arrmailFilter = this.arrMailDefault.filter(function (el) {
                return el.toLowerCase().indexOf(arr[1]) !== -1;
            });
            if (arrmailFilter.length == 0) {
                this.mailmodalRef.current.show([], false, 370);
            } else {
                this.mailmodalRef.current.show(arrmailFilter, true, 370);
            }
        } else this.mailmodalRef.current.show([], false, 370);
    }
    _onSelectedMail = (mail) => {
        var value = this.state.search;
        var arr = value.split("@");
        value = arr[0] + "@" + mail;
        this.setState({ search: value, maxLength: 10000 });
        this.mailmodalRef.current.show([], false);
    }
    validate = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        return expression.test(String(email).toLowerCase())
    }
    searchdata = async (isExpress) => {
        let inputData = this.state.search;
        inputData = inputData.replace('(', '');
        inputData = inputData.replace(')', '');
        inputData = inputData.replace(' ', '');
        inputData = inputData.replace('-', '');

        if (String.prototype.trim.call(this.state.search) == '') {
            Alert.alert('Error', 'Please input Phone or Email');
        } else if (!isNaN(inputData) && this.state.search.length != 14) {
            Alert.alert('Error', 'Please input an valid Phone');
        } else if (isNaN(inputData) && !this.validate(String.prototype.trim.call(this.state.search))) {
            Alert.alert('Error', 'Please input an valid Email');
        } else {
            let isPhone = !isNaN(inputData) && this.state.search.length == 14;
            let _this = this;
            this.refs.authenticateLoader.setState({ visible: true });
            let clientData = { email: '', phone: '' };
            if (isPhone) {
                clientData.phone = this.state.search;
            } else clientData.email = this.state.search;
            let isClientExists = false;
            let appointments = [];
            let isNewCheckIn = true;
            await fetch(setting.apiUrl + api.checkinClientSearch + inputData, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + this.token
                }
            })
                .then(response => response.json())
                .then(responseJson => {
                    if (responseJson.success) {
                        isClientExists = true;
                        clientData = responseJson.data;
                    }
                })
                .catch(error => {
                    console.error(error);
                });

            if (!this.isLoaded) {
                await this.loadData(false);
                if (!isClientExists) {
                    this.refs.authenticateLoader.setState({ visible: false });
                }
            } else if (!isClientExists) {
                this.refs.authenticateLoader.setState({ visible: false });
            }
            if (isClientExists) {
                var isSuccess = await fetch(setting.apiUrl + api.checkinGetID + clientData.id, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + this.token
                    }
                })
                    .then(response => response.json())
                    .then(responseJson => {
                        if (!responseJson.success) {
                            return true;
                        } else {
                            appointments = responseJson.data;
                            return true;
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        return false;
                    });
                this.refs.authenticateLoader.setState({ visible: false });
                if (isSuccess) {
                    if (appointments.length) {
                        let listAppointmentAvailable = [];
                        appointments.forEach(function (item) {
                            let diff = moment.tz(item.startdatetime, _this.timezone).diff(moment().tz(_this.timezone), 'minutes');
                            let isValidTime = false;
                            if (diff >= -20) {
                                isValidTime = true;
                            }
                            if (item.isCheckedIn != 1 && isValidTime) {
                                listAppointmentAvailable.push(item);
                            }
                        });
                        if (listAppointmentAvailable.length) {
                            isNewCheckIn = false;
                            clearInterval(this.intervalCount);
                            this.props.navigation.push('Appointments', {
                                appointments: appointments,
                                client: clientData,
                                clients: this.clients,
                                token: this.token,
                                businessname: this.businessname,
                                isShowStaffCheckIn: this.isShowStaffCheckIn,
                                opening_hours: this.opening_hours,
                                technicians: this.technicians,
                                availablehours: this.availablehours.available_hours,
                                services: this.services,
                                blockedTime: this.blockedTime,
                                TechniciansWorkingHour: this.TechniciansWorkingHour,
                                userData: this.userData,
                                blockedTimeYM: this.loadedYM,
                                listcombo: this.listcombo,
                                categories: this.categories,
                                isClientExists: isClientExists,
                                clientData: clientData,
                                logo_app: this.logo_app,
                                listCategories: this.listCategories,
                                timezone: this.timezone
                            });
                        }
                    }

                }
            }

            if (!this.userData.isDisableCheckInAppBooking) {
                if (isNewCheckIn && !isExpress) {
                    clearInterval(this.intervalCount);
                    _this.props.navigation.push('checkin', {
                        clients: this.clients,
                        technicians: this.technicians,
                        availablehours: this.availablehours.available_hours,
                        services: this.services,
                        token: this.token,
                        blockedTime: this.blockedTime,
                        TechniciansWorkingHour: this.TechniciansWorkingHour,
                        userData: this.userData,
                        blockedTimeYM: this.loadedYM,
                        listcombo: this.listcombo,
                        categories: this.categories,
                        isShowStaffCheckIn: this.isShowStaffCheckIn,
                        isClientExists: isClientExists,
                        clientData: clientData,
                        opening_hours: this.opening_hours,
                        logo_app: this.logo_app,
                        listCategories: this.listCategories,
                        timezone: this.timezone
                    });
                } else if (isExpress && isNewCheckIn) {
                    clearInterval(this.intervalCount);
                    _this.props.navigation.push('ExpressCheckin', {
                        clients: this.clients,
                        token: this.token,
                        userData: this.userData,
                        isClientExists: isClientExists,
                        clientData: clientData,
                        logo_app: this.logo_app,
                        isShowStaffCheckIn: this.isShowStaffCheckIn,
                        timezone: this.timezone
                    });
                }
            } else {
                clearInterval(this.intervalCount);
                _this.props.navigation.push('checkinwithoutbooking', {
                    token: _this.token,
                    userData: _this.userData,
                    listcombo: _this.listcombo,
                    categories: _this.listCategories,
                    isClientExists: isClientExists,
                    clientData: clientData,
                    logo_app: _this.logo_app,
                    timezone: _this.timezone
                });
            }





        }
    }

    scanQrcode = async () => {


        if (this.qrCodePermissionStatus) {
            clearInterval(this.intervalCount);
            let orien = width > height ? 'lanscape' : 'portrait';
            this.refs.ModalBarCode.show(orien);
        }
    }

    refresh = () => {
        Updates.reloadAsync();
    }

    scannedBarCode = async (appointmentId) => {
        this.refs.ModalBarCode.close();
        setTimeout(async () => {
            let appointment = {};
            let clientData = {};
            let errMessage = '';
            this.refs.authenticateLoader.setState({ visible: true });
            var isSuccess = await fetch(setting.apiUrl + api.checkinGetQRCode + appointmentId, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + this.token
                }
            })
                .then(response => response.json())
                .then(responseJson => {
                    if (!responseJson.success) {
                        errMessage = responseJson.msg;
                        return true;
                    } else {
                        appointment = responseJson.data;
                        clientData = responseJson.client;
                        return true;
                    }
                })
                .catch(error => {
                    console.error(error);
                    return false;
                });
            this.refs.authenticateLoader.setState({ visible: false });
            if (isSuccess) {
                if (typeof (appointment.id) != 'undefined') {
                    let listAppointmentAvailable = [];
                    let diff = moment.tz(appointment.startdatetime, this.timezone).diff(moment().tz(this.timezone), 'minutes');
                    let isValidTime = false;
                    if (diff >= -20) {
                        isValidTime = true;
                    }
                    if (appointment.isCheckedIn != 1 && isValidTime) {
                        listAppointmentAvailable.push(appointment);
                    }
                    if (listAppointmentAvailable.length) {
                        isNewCheckIn = false;
                        clearInterval(this.intervalCount);
                        this.props.navigation.push('Appointments', {
                            appointments: [appointment],
                            client: clientData,
                            clients: this.clients,
                            token: this.token,
                            businessname: this.businessname,
                            isShowStaffCheckIn: this.isShowStaffCheckIn,
                            opening_hours: this.opening_hours,

                            technicians: this.technicians,
                            availablehours: this.availablehours.available_hours,
                            services: this.services,

                            blockedTime: this.blockedTime,
                            TechniciansWorkingHour: this.TechniciansWorkingHour,
                            userData: this.userData,
                            blockedTimeYM: this.loadedYM,
                            listcombo: this.listcombo,
                            categories: this.categories,
                            isClientExists: true,
                            clientData: clientData,
                            logo_app: this.logo_app,
                            listCategories: this.listCategories,
                            timezone: this.timezone
                        });
                    } else if (!isValidTime) {
                        setTimeout(() => {
                            Alert.alert('Error', gStrings.lateCheck);
                        }, 100)
                    }
                } else {
                    setTimeout(() => {
                        Alert.alert('Error', errMessage);
                    }, 100)
                }

            }
        }, 100);

    }

    closeBarCode = () => {
        this.keepawake();
    }

    render() {
        let logostyle = styles.logofont;
        if (this.businessname.indexOf('&') >= 0) {
            logostyle = styles.logofontAngel;
        }

        let styleAvoid = styles.noavoid;
        if (this.isAvoidKeyBoard && Platform.OS === 'ios') {
            styleAvoid = styles.avoid;
        }

        let styleByKeyBoard = styles.contanerIos;
        let plmargintop = styles.plmargintop;
        if (this.isAvoidKeyBoard) {
            styleByKeyBoard = styles.contanerAndroid;
            plmargintop = styles.plmargintopandroid;
        }

        if (this.state.appIsReady) {
            return (
                <View style={{ flex: 1 }}>


                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', position: 'relative', }}>
                        <LinearGradient start={[0, 0]} end={[1, 1.0]} colors={[color.reddish, color.reddish]} style={{ width: '30%', height: height }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <View style={styles.logoLeftTop} >
                                    {this.logo_app != ''
                                        &&
                                        <Animatable.Image
                                            animation="bounceIn"
                                            duraton="1500"
                                            source={{ uri: this.logo_app }}
                                            style={{ width: 200, height: 59 }}
                                            resizeMode="stretch" />
                                    }
                                    {this.logo_app == ''
                                        &&
                                        <Text style={[styles.logofontdefault, logostyle]}>{this.props.route.params.businessname}</Text>
                                    }
                                </View>

                                <TouchableOpacity activeOpacity={1} underlayColor={color.whiteRGB05}
                                    style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 0 }]}
                                    onPress={async () => { await this.scanQrcode() }}>
                                    <Animatable.Image
                                        animation="bounceIn"
                                        duraton="1500"
                                        source={images.qrCode}
                                        style={{ width: 200, height: 200 }}
                                        resizeMode="stretch" />
                                </TouchableOpacity>

                                <View style={{ marginBottom: 25, alignItems: 'center', justifyContent: 'center', }} >
                                    <Text style={styles.copyright}>Powered by Thepronails.com</Text>
                                    <Text style={styles.copyrightPhone}>(302) 543-2014</Text>
                                </View>
                            </View>
                        </LinearGradient>
                        <View activeOpacity={1} onPress={this.keepawake} style={{ flex: 1, position: "relative", width: "70%" }}>
                            <View style={{ flex: 1 }}>
                                <View>
                                    <Image
                                        source={images.bg}

                                        style={[styles.backgroundFullscreen, { width: widthRight, height: height }]}
                                    />
                                </View>
                                <ScrollView style={{ flex: 1, position: 'relative', zIndex: 10 }}
                                    contentContainerStyle={styleByKeyBoard} keyboardShouldPersistTaps='always' ref='scrollview' >
                                    <View style={[styleAvoid, { justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text style={[styles.lblcheckin, plmargintop, { fontSize: 35 }]}>Please CHECK-IN here</Text>
                                        <LinearGradient start={[0, 0]} end={[1, 0]} colors={["rgba(236,111,160, 0)", "rgba(249,193,152, 0)"]} style={[styles.txtLoginFormborder]}>
                                            <TextInput
                                                style={[styles.txtSearch]}
                                                placeholder='Enter your Phone or Email'
                                                placeholderTextColor={color.brownish}
                                                onChangeText={(search) => this.changeSearch(search)}
                                                value={this.state.search}
                                                underlineColorAndroid={'transparent'}
                                                onFocus={() => this.onFocus(false)}
                                                onBlur={this.onBlur}
                                                autoCapitalize={'none'}
                                                maxLength={this.state.maxLength}
                                            />
                                        </LinearGradient>
                                        <MailModal
                                            ref={this.mailmodalRef}
                                            onSelectedMail={this._onSelectedMail}
                                            top={210}
                                            width={370}
                                        />
                                        {
                                            this.userData.disable_button_checkin == 0 &&
                                            <TouchableOpacity activeOpacity={0} underlayColor={color.whiteRGB05}
                                                style={styles.btnSearch}
                                                onPress={async () => { await this.searchdata(false) }}>

                                                <LinearGradient
                                                    start={[0, 0]}
                                                    end={[1, 0]}
                                                    colors={[color.pelorous, color.pelorous]}
                                                    style={styles.btnLinear}
                                                >
                                                    <Text style={styles.txtsearchbtn}>Check-in</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        }
                                        {
                                            this.userData.disable_button_express == 0 &&
                                            <TouchableOpacity activeOpacity={0} underlayColor={color.whiteRGB05}
                                                style={styles.btnSearch}
                                                onPress={async () => { await this.searchdata(true) }}>

                                                <LinearGradient
                                                    start={[0, 0]}
                                                    end={[1, 0]}
                                                    colors={[color.pelorous, color.pelorous]}
                                                    style={styles.btnLinear}
                                                >
                                                    <Text style={styles.txtsearchbtn}>Express Check-in</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        }

                                    </View>
                                </ScrollView>

                            </View>
                            <View style={{ alignItems: 'center', position: 'absolute', zIndex: 20, top: 0, width: widthRight, height: 70 }}>
                                <TouchableOpacity activeOpacity={1} style={styles.btnSetting} onPress={this.openSetting}>
                                    <Animatable.Image
                                        animation="bounceIn"
                                        duraton="1500"
                                        source={images.settingIcon}
                                        style={{ width: 25, height: 25 }}
                                        resizeMode="stretch" />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} style={styles.btnRefresh} onPress={this.refresh}>
                                    <Animatable.Image
                                        animation="bounceIn"
                                        duraton="1500"
                                        source={images.refreshIcon}
                                        style={{ width: 30, height: 30 }}
                                        resizeMode="stretch" />
                                </TouchableOpacity>
                                {this.isShowStaffCheckIn == true &&
                                    <TouchableOpacity activeOpacity={1} style={[styles.btnSettingStaffCheckIn]} onPress={this.openStaffCheckIn}>

                                        <Text style={styles.btnSettingText}>Staff Check In</Text>
                                    </TouchableOpacity>
                                }

                                {/* <TouchableOpacity  activeOpacity={1} style={styles.btnSwitchMode} onPress={this.switchMode}>
                                <Text style={styles.btnSettingText}>Switch Mode</Text>
                            </TouchableOpacity> */}
                                <TouchableOpacity activeOpacity={1} style={styles.btnBack} onPress={async () => { await this.openSalon() }}>
                                    <Text style={styles.btnSettingText}>Salon</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <SpinnerLoader
                            visible={false}
                            textStyle={layout.textLoaderScreen}
                            overlayColor={"rgba(255,255,255,0.9)"}
                            textContent={"Loading..."}
                            color={Colors.spinnerLoaderColor}
                            ref='SpinnerLoader'
                        />

                        <SubmitLoader
                            ref="authenticateLoader"
                            visible={false}
                            textStyle={layout.textLoaderScreenSubmit}
                            textContent={"Processing..."}
                            color={Colors.spinnerLoaderColorSubmit}
                        />

                        <AlertLoader
                            ref="CheckInLoader"
                            visible={false}
                            textStyle={layout.textLoaderScreenSubmit}
                            textContent={"Welcome James Nguyen"}
                            color={Colors.spinnerLoaderColorSubmit}
                        />

                        <ScreenSaver ref='ScreenSaver' logo_app={this.logo_app} businessname={this.props.route.params.businessname} close={this.closeScreenSaver} />
                        <Prompt title='Enter your passcode to check in' type='password2' ref='prompt' checkin={true} stype='number'
                            header='Staff Check In' submittext='Check In' errorMessage='Please enter passcode'
                            onSubmit={async (value, type) => { await this.checkInWithPassCode(value, type); }} onClose={this.onClosePrompt} />

                        {/* <SwitchCheckIn ref='switchmode' checkin={this.isswitchmode}
                        header={this.props.route.params.businessname}
                        onSubmit={async (value) => {await this.switchcheckin(value);}} onClose={this.onClosePrompt}/>  */}

                        <Prompt title='Enter your merchant account password to access setting section' type='password' ref='logout' checkin={false}
                            header={this.props.route.params.businessname} submittext='Authorize' errorMessage='Please enter password'
                            onSubmit={async (value) => { await this.checkAuthorized(value); }} onClose={this.onClosePrompt} />

                        <Prompt title='Enter your merchant account password to access salon' type='password' ref='salonpage' checkin={false}
                            header={this.props.route.params.businessname} submittext='Authorize' errorMessage='Please enter password'
                            onSubmit={async (value) => { await this.checkAuthorized(value, "salonpage"); }} onClose={this.onClosePrompt} />


                        <ModalBarCode ref='ModalBarCode' closeBarCode={this.closeBarCode} scanned={this.scannedBarCode} />

                        <ProfileTechnicianCheckIn title='' type='password' ref='ProfileTechnicianCheckIn' checkin={true}
                            header='Profile Staff' submittext='Check In' errorMessage='Please enter passcode'
                            onSubmit={async (value, type) => { await this.checkInWithPassCode(value, type); }} onClose={this.onClosePrompt} />

                    </View>
                </View>
            )
        } else {
            return (
                <LinearGradient start={[0, 0]} end={[1, 1.0]} colors={[color.reddish, color.carrot]} style={[styles.containerGradient]}>
                    <View style={{ width: "35%" }}>
                        <Image source={images.loginImg} style={{ width: "100%", height: height }} />
                    </View>
                    <View style={{ width: "65%" }}>
                        <View style={styles.maincontainer}>
                            <View style={{ alignItems: 'center', marginBottom: 70 }}>
                                <Image source={images.logo} style={{ width: 400, height: 58 }} />
                            </View>
                            <View style={styles.contentscontainer}>

                                <Text style={styles.loadingText1}>Welcome to</Text>
                                {/* <View style={styles.underline}></View> */}
                                {/* <Text style={styles.loadingText}>Now loading data for</Text> */}
                                <Text style={styles.loadingText}>{this.props.route.params.businessname}</Text>
                                <ActivityIndicator
                                    color={color.white}
                                    size={'small'}
                                    style={{ marginTop: 10 }}
                                />
                            </View>
                        </View>

                        <SubmitLoader
                            ref="authenticateLoader"
                            visible={false}
                            textStyle={layout.textLoaderScreenSubmit}
                            textContent={"Processing..."}
                            color={Colors.spinnerLoaderColorSubmit}
                        />
                    </View>



                </LinearGradient>
            )
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    welcome: {
        fontSize: 18,
        backgroundColor: 'transparent',
        color: '#595c68',
        fontFamily: 'futuralight',
        marginBottom: 0,
        position: 'absolute', top: 30, left: 50
    },
    copyright: {
        fontSize: 16,
        backgroundColor: 'transparent',
        color: color.white,
        fontFamily: 'Futura',
        bottom: 10,
        zIndex: 2,
    },
    copyrightPhone: {
        fontSize: 16,
        backgroundColor: 'transparent',
        color: color.white,
        fontFamily: 'Futura',
        bottom: 10,
        zIndex: 2,
    },
    maincontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentscontainer: {
        // backgroundColor:'rgba(255,255,255,0.2)',
        // paddingTop:20,
        // paddingBottom:20,
        // paddingLeft:20,
        // paddingRight:20,
        // borderRadius:10,
        alignItems: 'center',
    },
    containerGradient: {
        // flex: 1,
        // position:'absolute',
        // top:0,
        // bottom:0,
        // flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        // zIndex:1
        flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'
    },
    syncData: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: 220,
        height: 200
    },
    loadingText: {
        color: color.white,
        fontSize: 35,
        fontFamily: 'Futura',
        fontWeight: "bold"
    },
    loadingText1: {
        color: color.white,
        fontSize: 20,
        marginTop: -5,
        fontFamily: 'Futura',
        marginBottom: 30
    },
    underline: {
        width: 100,
        height: 1,
        backgroundColor: color.white,
        marginTop: 10,
        marginBottom: 10
    },
    backgroundFullscreen: {
        position: 'absolute',
        zIndex: 1
    },
    logofontdefault: {
        backgroundColor: 'transparent',
        color: color.white,
        fontSize: 30,
        marginBottom: 30,
        textAlign: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    logofont: {
        fontFamily: 'Futura'
    },
    logofontAngel: {
        fontFamily: 'Futura'
    },
    btnHome: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 10,
        borderRadius: 40,
        height: 70,
        alignItems: 'center',
        width: 380,
        marginBottom: 40,
        flexDirection: 'row'
    },
    iconmain: {
        marginRight: 10,
        //marginTop:4,
        backgroundColor: 'transparent'
    },
    btnHomeText: {
        color: color.lightishPink,
        fontSize: 24,
        fontFamily: 'Futura'
    },
    btnSetting: {
        position: 'absolute',
        top: 35,
        right: 35,
        zIndex: 2
    },
    btnSettingText: {
        fontSize: 18,
        backgroundColor: 'transparent',
        color: '#595c68',
        fontFamily: 'Futura',
        zIndex: 2
    },

    btnSettingStaffCheckIn: {
        position: 'absolute',
        top: 37,
        right: 220,
        zIndex: 2
    },
    btnRefresh: {
        position: 'absolute',
        top: 33,
        right: 85,
        zIndex: 2
    },
    btnSwitchMode: {
        position: 'absolute',
        top: 37,
        right: 220,
        zIndex: 2
    },
    btnBack: {
        position: 'absolute',
        top: 37,
        right: 140,
        zIndex: 2
    },
    logo: {
        marginBottom: 30
    },
    lblcheckin: {
        color: color.pelorous,
        backgroundColor: 'transparent',
        marginBottom: 40,
        fontFamily: 'Futura',

    },
    plmargintop: {
        marginTop: 0,
        marginLeft: 0
    },
    plmargintopandroid: {
        marginTop: 60
    },
    txtSearchBlur: {
        borderRadius: 0,
    },
    txtSearch: {
        height: 60,
        backgroundColor: 'transparent',
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 0,
        borderRadius: 0,
        width: 370,
        fontSize: 20,
        fontFamily: 'Futura',
        // borderBottomWidth: 1
        // borderBottomColor: color.brownish
        borderBottomColor: color.brownish,
        borderBottomWidth: 2,
        marginBottom: 30,
    },
    btnSearch: {
        //backgroundColor:{color.whiteRGB05},
        //height:70,
        //borderRadius:50,
        alignItems: 'center',
        justifyContent: 'center',
        //width:400,
        marginTop: 20
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",

        borderRadius: 0,
        padding: 5,
        height: 54,
        width: 370,

    },
    txtsearchbtn: {
        fontSize: 25,
        fontFamily: 'Futura',
        color: color.white,
        backgroundColor: 'transparent',
    },
    avoid: {
        position: 'absolute',
        top: 20
    },
    contanerIos: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10
    },
    contanerAndroid: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        paddingTop: 10
    },
    txtLoginFormborder: {
        borderRadius: 0,
        height: 64,
        padding: 2,
    },
    logoLeftTop: {
        marginTop: 35
    }
});
