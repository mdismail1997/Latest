import React from "react";
import {
    StyleSheet,
    View,
    Alert,
    Platform,
    Dimensions,
    Linking,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Steps from "../../components_checkin/steps/steps";
import ScrollableTabView from "react-native-scrollable-tab-view";
import HideTabBar from "../../components_checkin/scrolltab/HideTabBar";
import Listservices from "../../components_checkin/services/Listservices";
import ListTechnician from "../../components_checkin/technicians/ListTechnician";
import TimePicker from "../../components_checkin/calendar/TimePicker";
import Customer from "../../components_checkin/clients/Customer";
import Summary from "../../components_checkin/summary";
import moment from 'moment';
import layout from "../../assets/styles/layout_checkin";
import Colors from "../../constants/Colors_checkin";
import RightLayoutCheckIn from "../../components_checkin/RightLayoutCheckIn";
import SubmitLoader from "../../helpers/submitloader";
import setting from "../../constants/Setting";
import { getDeviceId } from "../../helpers/authenticate";
import ListCategories from "../../components_checkin/services/ListCategories";
import ListServicesInCategory from "../../components_checkin/services/ListServicesInCategory";
import {
    fetchCategoriesData,
    fetchTechniciansDataIsManageTurn
} from "../../helpers/fetchdata";
import collect from "collect.js";
// import * as Print from 'expo-print';
var { height, width } = Dimensions.get('window');
var widthRight = width * 0.3;
//import {fetchTimeout, abortFetch} from 'whatwg-fetch-timeout';

import {
    getCurrentLocation
} from "../../api/fetchdata";
import { color } from "../../assets/colors/colors";
import { gStrings } from "../../components/staticStrings";
import { api } from "../../api/api";

export default class CheckInScreen extends React.Component {
    constructor(props) {
        super(props);
        this.stepsRef = React.createRef();
        this.customerRef = React.createRef();
        this.tabsRef = React.createRef();
        this.summaryRef = React.createRef();
        this.rightLayoutRef = React.createRef();
        this.appointmentLoaderRef = React.createRef();
        this.ListCategoriesRef = React.createRef();
        this.timepickerRef = React.createRef();
        this.technicianRef = React.createRef();
        this.ListServicesInCategoryRef = React.createRef();
        this.listserviceRef = React.createRef();

    }
    static route = {
        navigationBar: {
            visible: false
        }
    };

    serviceId = 0;

    selectedDay = '';
    selectedHour = '';
    clientData = '';
    serviceData = '';
    deviceid = 0;
    selectServices = [];
    //techniciansFiltered = [];
    techniciansSelected = {};
    techniciansByService = {};
    userData = this.props.route.params.userData;
    isClientExists = this.props.route.params.isClientExists;
    clientSearchData = this.props.route.params.clientData;
    isGiftLoaded = false;
    giftBalance = {};
    giftCodes = [];
    isLoadedCoupon = false;
    coupon = {};
    appointemntId = 0;
    prerenderingSiblingsNumber = 0;
    categories_reminder = [];
    technicians = this.props.route.params.technicians;
    stepNumberChange = 1;
    async UNSAFE_componentWillMount() {
        this.deviceid = await getDeviceId();
        this.categories_reminder = await fetchCategoriesData(this.props.route.params.token);
        this.location = await getCurrentLocation();
        this.locationId = 0;
        if (typeof (this.location.id) != 'undefined') {
            this.multipleLocation = true;
            this.locationId = this.location.id;
        }
        if (this.userData.isManageTurn == 1) {
            //this.technicians = await fetchTechniciansDataIsManageTurn(this.props.route.params.token, this.locationId);
            var validTechsTurns = await fetchTechniciansDataIsManageTurn(this.props.route.params.token, this.locationId);

            validTechsTurns = collect(validTechsTurns);
            var sortedTechsTurns = [];
            var techNoneTurnCount = validTechsTurns.where('TurnBook', '=', 0);
            if (techNoneTurnCount.count()) {
                techNoneTurnCount.sortBy('time').each(function (itemTech) {
                    sortedTechsTurns.push(itemTech);
                });
            }

            var techHaveTurnCount = validTechsTurns.where('TurnBook', '>', 0);
            if (techHaveTurnCount.count()) {
                let max = techHaveTurnCount.max('TurnBook');
                for (var i = 0.25; i <= max; i = i + 0.25) {
                    let techWithTurn = techHaveTurnCount.where('TurnBook', '=', i);
                    if (typeof (techWithTurn) != 'undefined') {
                        techWithTurn.sortBy('time').each(function (itemTech) {
                            sortedTechsTurns.push(itemTech);
                        });
                    }

                }
            }

            var techNotCheckedInList = validTechsTurns.where('TurnBook', '=', 10000);
            if (techNotCheckedInList.count()) {
                techNotCheckedInList.each(function (item) {
                    sortedTechsTurns.push(item);
                })
            }

            this.technicians = sortedTechsTurns;
        }

        if (typeof (this.props.route.params.isEdit) == 'undefined') {
            if (this.isClientExists) {
                this.loadeGift();
            } else if (this.clientSearchData.email != '') {
                this.loadeGiftForGuest();
            }
        }

        var screen = Dimensions.get('window');
        width = screen.width;
        height = screen.height;
        widthRight = width * 0.3;
        let _this = this;
        Dimensions.addEventListener('change', function () {
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;
            widthRight = width * 0.3;

            _this.setState({ appIsReady: true });
        })
    }

    UNSAFE_componentDidMount() {
        if (typeof (this.props.route.params.isEdit) != 'undefined') {
            //this.isShowStaffCheckIn = this.props.route.params.isShowStaffCheckIn;

            this.clientData = this.props.route.params.clientData;
            this.selectServices = this.props.route.params.selectServices;
            this.techniciansSelected = this.props.route.params.techniciansSelected;
            this.selectedHour = this.props.route.params.hourTimePicker;
            this.selectedDay = moment(this.props.route.params.startdatetime);
            this.hourTimePicker = this.props.route.params.hourTimePicker;
            this.appointemntId = this.props.route.params.appointemntId;
            this.isSetService = true;
            this.isSetTime = true;
            this.processServiceTechnician();
        }
    }

    setServices = () => {
        setTimeout(() => {
            if (typeof (this.isSetService) != 'undefined' && this.isSetService) {
                this.listserviceRef.current.setServices(this.selectServices);
                this.isSetService = false;
            }
        }, 100)
    }

    loadPromotions = () => {
        this.appointmentLoaderRef.current.setState({ visible: true });
        let dayname = this.selectedDay.format('dddd').toLowerCase();
        var dayformat = this.selectedDay.format('Y-MM-DD');
        let clientid = 0;
        if (typeof (this.clientSearchData.id) != 'undefined') {
            clientid = this.clientSearchData.id;
        }
        let postData = {
            clientid: clientid,
            dayofweek: dayname,
            bookingday: dayformat
        };
        fetch(setting.apiUrl + api.getPromotions, {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                Authorization: "Bearer " + this.props.route.params.token
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(responseJson => {
                this.appointmentLoaderRef.current.setState({ visible: false });
                if (responseJson.coupons.length) {
                    this.coupon = responseJson.coupons[0];
                } else this.coupon = [];
                /*
                this.giftCodes = responseJson.giftcode;
                this.giftBalance = responseJson.gift;
                if(this.giftCodes.length){
                    if(typeof(this.giftBalance.id) == 'undefined'){
                        this.giftBalance.balance = 0;
                        this.giftBalance.id = 0;             
                    }
                    let _this = this;
                    this.giftBalance.codeids = [];
                    this.giftCodes.forEach(function(item){
                        _this.giftBalance.codeids.push(item.id);
                        _this.giftBalance.balance = parseFloat(_this.giftBalance.balance) +  parseFloat(item.balance);
                    })
                }else if(typeof(this.giftBalance.id) != 'undefined'){
                    this.giftBalance.codeids = [];
                }
                
                this.isLoadedCoupon = true;*/
            })
            .catch(error => {
                console.error(error);
            });
    }

    loadeGift = () => {
        fetch(setting.apiUrl + api.giftGetByClient + this.clientSearchData.id, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + this.props.route.params.token
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                this.giftCodes = responseJson.giftcode;
                this.giftBalance = responseJson.gift;
                if (this.giftCodes.length) {
                    if (typeof (this.giftBalance.id) == 'undefined') {
                        this.giftBalance.balance = 0;
                        this.giftBalance.id = 0;
                    }
                    let _this = this;
                    this.giftBalance.codeids = [];
                    this.giftCodes.forEach(function (item) {
                        _this.giftBalance.codeids.push(item.id);
                        _this.giftBalance.balance = parseFloat(_this.giftBalance.balance) + parseFloat(item.balance);
                    })
                } else if (typeof (this.giftBalance.id) != 'undefined') {
                    this.giftBalance.codeids = [];
                }

                this.isGiftLoaded = true;
            })
            .catch(error => {
                console.error(error);
            });
    }

    loadeGiftForGuest = () => {
        fetch(setting.apiUrl + api.giftGetByGuestEmail + this.clientSearchData.email, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + this.props.route.params.token
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                this.giftCodes = responseJson.giftcode;
                if (this.giftCodes.length) {
                    if (typeof (this.giftBalance.id) == 'undefined') {
                        this.giftBalance.balance = 0;
                        this.giftBalance.id = 0;
                    }
                    let _this = this;
                    this.giftBalance.codeids = [];
                    this.giftCodes.forEach(function (item) {
                        _this.giftBalance.codeids.push(item.id);
                        _this.giftBalance.balance = parseFloat(_this.giftBalance.balance) + parseFloat(item.balance);
                    })
                } else if (typeof (this.giftBalance.id) != 'undefined') {
                    this.giftBalance.codeids = [];
                }

                this.isGiftLoaded = true;
            })
            .catch(error => {
                console.error(error);
            });
    }

    setAvailableTechnician = (category, service) => {
        let _this = this;
        let techniciansData = [];
        if (this.userData.isAllowGuestBookAvailableTechnician == 1) {
            techniciansData = _this.technicians.filter(function (item) {
                let idService = service.id.split('_')[1];
                let skills = item.skillsToServices;
                return _this.in_array(idService, skills);
            });
        }

        if (this.userData.isAcceptAnyTechnician == 1) {
            let techData = {
                email: "",
                firstname: "Any",
                fullname: "Any Technician",
                id: 0,
                lastname: "Technician",
                phone: "",
                picture: "",
                skills: "",
                status: true,
            }
            if (techniciansData.length) {
                techniciansData.splice(0, 0, techData);
            } else {
                techniciansData.push(techData);
            }
        }
        return techniciansData;
    }

    processServiceTechnician = () => {
        let _this = this;
        //this.techniciansFiltered = [];
        this.techniciansByService = {};
        for (var key in _this.selectServices) {
            let service = _this.selectServices[key];
            if (service.id.indexOf('service') >= 0) {
                let category = service.category_name;
                this.techniciansByService[service.id] = _this.setAvailableTechnician(category, service);
            } else {
                for (var keyService in service.services) {
                    var serviceCombo = service.services[keyService];

                    let serviceComboData = this.props.route.params.services.filter(function (item) {
                        if (item.id.toString().indexOf('service') >= 0) {
                            return 'service_' + serviceCombo.serviceid == item.id;
                        }
                        return serviceCombo.serviceid == item.id;
                    });

                    if (serviceComboData.length) {
                        let category = serviceComboData[0].category_name;
                        let keyService = serviceComboData[0].id;
                        if (keyService.toString().indexOf('service') < 0) {
                            keyService = 'service_' + keyService;
                        }
                        this.techniciansByService[keyService] = _this.setAvailableTechnician(category, serviceComboData[0]);
                    }

                }
            }
        }
    }

    isValidTechnicians = () => {
        let valid = true;
        let _this = this;
        if (Object.keys(this.techniciansSelected).length) {
            Object.keys(this.techniciansSelected).every(function (key) {
                let itemData = _this.techniciansSelected[key];

                if (key.indexOf('service') >= 0) {
                    if (!Object.keys(itemData).length) {
                        let serviceData = _this.props.route.params.services.filter(function (item) {
                            return key == item.id;
                        });
                        let servicename = '';
                        if (serviceData.length) servicename = serviceData[0].service_name;
                        valid = false;
                        Alert.alert('Error', 'Please select technician for service ' + servicename);
                        return false;
                    }

                } else {
                    if (!Object.keys(itemData).length) {
                        let comboData = _this.props.route.params.listcombo.filter(function (item) {
                            return key == item.id;
                        });
                        let servicename = '';
                        if (comboData.length) servicename = comboData[0].comboname;
                        valid = false;
                        Alert.alert('Error', 'Please select technicians for combo ' + servicename);
                        return false;
                    }
                }
                return true;
            });
        } else {
            Alert.alert('Error', 'Please choose service');
            valid = false;
        }

        return valid;
    }

    setTechnicianByService = () => {
        let _this = this;
        this.processServiceTechnician();
        let newListTechniciansSelected = {};

        for (var key in _this.selectServices) {
            let service = _this.selectServices[key];
            if (typeof (_this.techniciansSelected[service.id]) == 'undefined') {
                if (service.id.indexOf('service') >= 0) {
                    newListTechniciansSelected[service.id] = {};
                } else {
                    newListTechniciansSelected[service.id] = {};
                }
            } else {
                newListTechniciansSelected[service.id] = _this.techniciansSelected[service.id];
            }
        }
        _this.techniciansSelected = newListTechniciansSelected;

        //this.isValidTechnicians();
        /*    
        let _this = this;
        this.techniciansFiltered = [];
        setTimeout(function(){
            for (var key in _this.selectServices) {
                let service = _this.selectServices[key];
                let category = service.category_name;
                let techniciansData = _this.props.route.params.technicians.filter(function(item){
                    let skills = item.skills.split(',');
                    return _this.in_array(category,skills);
                });

                techniciansData.forEach(function(item) {
                    let data = _this.techniciansFiltered.filter(function(techItem){
                        return techItem.id == item.id;
                    });
                    if(!data.length){
                        _this.techniciansFiltered.push(item);
                    }
                });
            }
            let techniciansSelected = _this.techniciansFiltered.filter(function(item){
                return item.id == _this.technicianId;
            });
            if(!techniciansSelected.length){
                _this.technicianId = 0;
            }
          
            
        },0) */
    }

    goToTimePickerTab = () => {
        let duration = 0;
        Object.values(this.selectServices).map(data => {
            duration += parseInt(data.duration);
        });
        let listServiceForTimePicker = [];
        this.selectServices.forEach(function (service) {
            if (service.id.indexOf('service') >= 0) {
                listServiceForTimePicker.push(service.id);
            } else {
                Object.keys(service.services).forEach(function (service_key) {

                    listServiceForTimePicker.push('service_' + service.services[service_key].serviceid);
                })
            }
        })

        let _this = this;
        this.stepsRef.current.setStep(3);
        this.tabsRef.current.goToPage(2);
        this.rightLayoutRef.current.setStepNumber(3);
        setTimeout(function () {
            if (typeof (_this.isSetTime) != 'undefined' && _this.isSetTime) {
                _this.timepickerRef.current.setServices(_this.techniciansByService, listServiceForTimePicker);
                _this.timepickerRef.current.setTime(_this.selectedDay, _this.hourTimePicker, _this.appointemntId);
                _this.isSetTime = false;
            } else {
                _this.timepickerRef.current.setTechnicianAndServiceDuraion(_this.techniciansByService, duration, listServiceForTimePicker);
            }

        }, 0)


    }

    setTimePickerServices = () => {

        let listServiceForTimePicker = [];
        this.selectServices.forEach(function (service) {
            if (service.id.indexOf('service') >= 0) {
                listServiceForTimePicker.push(service.id);
            } else {
                Object.keys(service.services).forEach(function (service_key) {
                    listServiceForTimePicker.push('service_' + service.services[service_key].serviceid);
                })
            }
        })



        let _this = this;
        this.timepickerRef.current.setServices(_this.techniciansByService, listServiceForTimePicker);

    }



    onPressService = (services) => {


        this.selectServices = services;
        this.setTechnicianByService();
    }

    onPressTechnician = (technician, oncase = '') => {
        this.techniciansSelected = technician;
        if (oncase != '') {
            this.stepsRef.current.setStep(5);
            this.tabsRef.current.goToPage(4);
            this.rightLayoutRef.current.setStepNumber(5);
            let _this = this;
            setTimeout(function () {
                _this.setSummaryData(_this);
            }, 0);
        }

    }

    checkValidHour = (hour, service, quantity, duration_config = 0) => {
        let dayname = this.selectedDay.format('dddd').toLowerCase();
        var dayformat = this.selectedDay.format('Y-MM-DD');
        let data = this.timepickerRef.current.isValidHour(hour, dayformat, dayname, service.id, quantity, duration_config);
        return data;
    }

    onPressTime = async (day, hour, arrTechniciansAndHours) => {
        this.isLoadedCoupon = false;
        this.selectedDay = day;
        this.selectedHour = hour;
        await this.loadPromotions();

        this.stepsRef.current.setStep(4);
        this.tabsRef.current.goToPage(3);
        this.rightLayoutRef.current.setStepNumber(4);

        let _this = this;

        setTimeout(function () {
            _this.technicianRef.current.setData(arrTechniciansAndHours, _this.techniciansSelected, _this.selectServices, hour);
        }, 0)
    }

    onPressTimeReset = () => {
        this.selectedHour = '';
    }

    onPressClient = (client) => {
        this.clientData = client;
        this.stepsRef.current.setStep(2);
        this.tabsRef.current.goToPage(1);
        this.rightLayoutRef.current.setStepNumber(2);
        this.rightLayoutRef.current.setClient(client);
        this.setServices();
    }

    onClientUpdated = (client) => {
        this.clientData = client;
        this.stepsRef.current.setStep(2);
        this.tabsRef.current.goToPage(1);
        this.rightLayoutRef.current.setStepNumber(2);
        this.setServices();
    }

    setSummaryData = (_this) => {
        _this.summaryRef.current.setClient(_this.clientData, _this.props.route.params.userData);
        _this.summaryRef.current.setCoupon(this.coupon);
        _this.summaryRef.current.setGifts(this.giftBalance);
        _this.summaryRef.current.setService(_this.selectServices, this.props.route.params.services);
        _this.summaryRef.current.setTechnician(this.techniciansSelected);
        let hourformat = _this.convertTo24Hour(_this.selectedHour).replace(' ', '');
        _this.summaryRef.current.setTime(moment(this.selectedDay.format('Y-MM-DD') + ' ' + hourformat + ':00').format('dddd, MMMM DD, h:mm A'),
            hourformat, this.selectedDay.format('dddd'), this.selectedDay.format('Y-MM-DD'));
        _this.summaryRef.current.setReady();

    }

    async onPressStep(stepNumber, currentStep) {
        switch (stepNumber) {
            case 1:
                this.stepsRef.current.setStep(1);
                this.tabsRef.current.goToPage(0);
                this.rightLayoutRef.current.setStepNumber(1);
                break;
            case 2:
                if (currentStep == 1) {
                    this.customerRef.current.nextChooseService();
                } else {
                    this.stepsRef.current.setStep(2);
                    this.tabsRef.current.goToPage(1);
                    this.rightLayoutRef.current.setStepNumber(2);
                    this.setServices();
                }

                break;
            case 3:
                let isValid = Object.keys(this.selectServices).length;
                if (!isValid) {
                    Alert.alert('Error', 'Please choose service');
                } else {
                    //this.gotoTechnicianTab();
                    this.goToTimePickerTab();
                    this.rightLayoutRef.current.setStepNumber(3);
                }
                break;
            case 4:
                if (this.selectedHour == '' || (this.selectedHour != '' && typeof (this.isSetTime) != 'undefined' && this.isSetTime)) {
                    Alert.alert('Error', 'Please choose time');
                } else {
                    let _this = this;
                    this.setTimePickerServices();

                    this.stepsRef.current.setStep(4);
                    this.tabsRef.current.goToPage(3);
                    this.rightLayoutRef.current.setStepNumber(4);

                    setTimeout(function () {
                        _this.technicianRef.current.setData([], _this.techniciansSelected, _this.selectServices, _this.selectedHour);
                    }, 0)
                }
                break;
            case 5:
                if (this.isValidTechnicians()) {
                    this.stepsRef.current.setStep(5);
                    this.tabsRef.current.goToPage(4);
                    this.rightLayoutRef.current.setStepNumber(5);
                    let _this = this;
                    setTimeout(function () {
                        _this.setSummaryData(_this);
                    }, 0);
                }
                break;
            case 6:
                this.summaryRef.current.saveAppointment();
                break;
        }

    }

    sleep(ms = 0) {
        return new Promise(r => setTimeout(r, ms));
    }

    convertTo24Hour(time) {
        time = time.toLowerCase();
        var hours = time.substr(0, 2);
        if (time.length == 7) {
            hours = time.substr(0, 1);
        }
        if (time.indexOf("am") != -1 && hours == 12) {
            time = time.replace("12", "0");
        }
        if (time.indexOf("pm") != -1 && parseInt(hours) < 12) {
            time = time.replace(hours, parseInt(hours) + 12);
        }
        return time.replace(/(am|pm)/, "");
    }

    getTimeFromMins(mins) {
        if (mins >= 24 * 60 || mins < 0) {
            throw new RangeError(gStrings.validTimeMins);
        }
        var h = mins / 60 | 0,
            m = mins % 60 | 0;
        return (h * 100) + m;
    }

    getEndHourFormat(startHour, duration) {
        var startInHour = startHour.split(':')[0] + "00";
        var startInMinute = startHour.split(':')[1];
        var totalMinute = parseInt(startInMinute) + parseInt(duration);

        var calculateEndHour = parseInt(startInHour) + parseInt(this.getTimeFromMins(totalMinute));

        var hour, minute, prefix;
        if (calculateEndHour.toString().length == 4) {
            hour = calculateEndHour.toString().substring(0, 2);
            minute = calculateEndHour.toString().substring(2, 4);
        } else {
            hour = calculateEndHour.toString().substring(0, 1);
            minute = calculateEndHour.toString().substring(1, 3);
        }
        return hour + ':' + minute;
        //return this.formatHour(hour + ':' + minute);
    }

    getEndHour(startHour, duration) {
        var startInHour = startHour.split(':')[0] + "00";
        var startInMinute = startHour.split(':')[1];
        var totalMinute = parseInt(startInMinute) + parseInt(duration);
        var calculateEndHour = parseInt(startInHour) + parseInt(this.getTimeFromMins(totalMinute));
        return calculateEndHour;
    }

    formatHourFromNumber(calculateEndHour) {
        let prefix = '';
        if (calculateEndHour.toString().length == 4) {
            hour = calculateEndHour.toString().substring(0, 2);
            minute = calculateEndHour.toString().substring(2, 4);
        } else {
            hour = calculateEndHour.toString().substring(0, 1);
            minute = calculateEndHour.toString().substring(1, 3);
            prefix = '0';
        }
        return prefix + hour + ':' + minute;
    }

    formatHour(hour) {
        var prefix = '';
        var split = hour.split(':');
        hour = parseInt(split[0]);
        minute = split[1];
        var hourformat = 'AM';
        if (parseInt(hour) >= 12) {
            if (parseInt(hour) > 12) {
                hour = parseInt(hour) - 12;
            }
            hourformat = 'PM';
        }

        if (hour.toString().length == 2) {
            prefix = '';
        } else {
            prefix = "0";
        }

        return prefix + hour + ":" + minute + " " + hourformat;
    }

    calculateEndHour = () => {
        let arrTechEndHour = {};
        let end = 0;
        let _this = this;
        Object.keys(this.techniciansSelected).forEach(function (itemkeySerivice) {
            let ListServiceSelected = _this.techniciansSelected[itemkeySerivice];
            Object.keys(ListServiceSelected).forEach(function (itemkey) {
                let item = ListServiceSelected[itemkey];
                if (typeof (arrTechEndHour[item.id]) == 'undefined') {
                    arrTechEndHour[item.id] = parseInt(item.end.replace(':', ''));
                } else {
                    arrTechEndHour[item.id] = _this.getEndHour(_this.formatHourFromNumber(arrTechEndHour[item.id]), item.duration);
                }
                if (end < arrTechEndHour[item.id]) {
                    end = arrTechEndHour[item.id];
                }
            })

        })
        return this.formatHourFromNumber(end);
    }
    roundprice = (num) => {
        return Math.round(num * 100) / 100;
    }
    createURI = (html) => {
        var passprnt_uri;
        passprnt_uri = "starpassprnt://v1/print/nopreview?html=" + html;
    }
    saveAppointment = (promotionsData) => {
        this.appointmentLoaderRef.current.setState({ visible: true });
        let submitData = {};
        submitData.promotions = promotionsData;
        submitData.locationid = this.locationId;
        submitData.client_id = this.clientData.id;
        submitData.appointemntId = this.appointemntId;
        if (this.clientData.id == 0) {
            submitData.client_data = this.clientData;
        }

        submitData.appointment_hour = String.prototype.trim.call(
            this.convertTo24Hour(this.selectedHour)
        );
        submitData.appointment_endhour = this.calculateEndHour();
        submitData.appointment_day = this.selectedDay.format("DD-MM-Y");
        let rewardpoint = 0;
        let services = [];
        Object.values(this.selectServices).map(data => {
            let dataid = data.id;
            rewardpoint += parseFloat(data.rewardpoint);
            let quantity = 1;
            if (typeof (data.quantity) != 'undefined') {
                quantity = data.quantity;
            }
            let submitDataService = {
                serviceid: data.id.replace('service_', '').replace('combo_', ''),
                price: data.price,
                rewardpoint: data.rewardpoint,
                quantity: quantity,
                rewardpointvip: data.rewardpointvip
            };



            if (dataid.indexOf('combo') >= 0) {
                if (typeof (data.appointment_combo_id) != 'undefined') {
                    submitDataService.appointment_combo_id = data.appointment_combo_id;
                } else {
                    submitDataService.appointment_combo_id = 0;
                }


                let startTime = '';
                let serviceTechnicians = this.techniciansSelected[dataid];
                submitDataService.isCombo = true;
                submitDataService.services = data.services;
                submitDataService.services.map(dataService => {
                    //dataService.technician = serviceTechnicians[submitData.appointment_hour + '_service_' + dataService.serviceid];                    

                    Object.keys(serviceTechnicians).map((techdatakey, i) => {
                        let arr = techdatakey.split('_');
                        arr.shift();
                        if (arr.join('_') == 'service_' + dataService.serviceid) {
                            let technician = serviceTechnicians[techdatakey];
                            if (startTime == '') {
                                startTime = technician.start;
                            }
                            dataService.technicianId = technician.id;
                            if (submitDataService.quantity > 1) {
                                let endTime = this.getEndHourFormat(startTime, dataService.duration);
                                dataService.startTime = startTime;
                                dataService.endTime = endTime;
                                startTime = endTime;

                            } else {
                                dataService.startTime = technician.start;
                                dataService.endTime = technician.end;
                            }

                            dataService.id = dataService.serviceid;
                        }
                    })
                })
                services.push(submitDataService);

                if (submitDataService.quantity > 1) {
                    for (let i = 1; i < submitDataService.quantity; i++) {
                        let cloneService = { ...submitDataService };

                        let servicesClone = [...cloneService.services];
                        cloneService.services = [];
                        servicesClone.map(datasv => {
                            let sv = { ...datasv };
                            Object.keys(serviceTechnicians).map((techdatakey, i) => {
                                let arr = techdatakey.split('_');
                                arr.shift();
                                if (arr.join('_') == 'service_' + sv.serviceid) {

                                    let endTime = this.getEndHourFormat(startTime, sv.duration);
                                    sv.startTime = startTime;
                                    sv.endTime = endTime;
                                    startTime = endTime;
                                    cloneService.services.push(sv);
                                }
                            })
                        })
                        services.push(cloneService);
                    }
                }
            } else {
                submitDataService.appointment_service_id = 0;
                if (typeof (data.appointment_service_id) != 'undefined') {
                    submitDataService.appointment_service_id = data.appointment_service_id;
                }
                submitDataService.isCombo = false;
                //submitDataService.technician = this.techniciansSelected[dataid][submitData.appointment_hour + '_' + dataid];
                let techs = this.techniciansSelected[dataid];
                Object.keys(techs).map((techdatakey, i) => {
                    let technician = techs[techdatakey];
                    submitDataService.technicianId = technician.id;
                    submitDataService.startTime = technician.start;
                    submitDataService.endTime = technician.end;



                    //submitDataService.technician = techs[techdatakey];
                })

                if (submitDataService.quantity > 1) {
                    submitDataService.endTime = this.getEndHourFormat(submitDataService.startTime, data.duration);
                    let startTime = submitDataService.endTime;
                    for (let i = 1; i < submitDataService.quantity; i++) {
                        let cloneService = { ...submitDataService };
                        cloneService.startTime = startTime;
                        cloneService.endTime = this.getEndHourFormat(startTime, data.duration);
                        startTime = cloneService.endTime;
                        services.push(cloneService);
                    }

                }
                services.push(submitDataService);
            }


        });
        submitData.services = services;
        submitData.device_id = this.deviceid;
        var _this = this;
        fetch(setting.apiUrl + api.bookAppointmentCheckin, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.props.route.params.token
            },
            body: JSON.stringify(submitData),
        }, 'checkin')
            .then(response => response.json())
            .then(responseJson => {
                if (!responseJson.success) {
                    this.appointmentLoaderRef.current.setState({
                        visible: false
                    });
                    let _this = this;
                    setTimeout(function () {
                        _this.fetchError(responseJson);
                    }, 0);

                    //Alert.alert('Error', responseJson.message);
                    //return [];
                } else {
                    /*
                    if(this.clientData.id == 0){
                        submitData.client_data.id = responseJson.clientId;   
                        let clients = this.props.route.params.clients;     
                        let clientDataFilter = clients.filter(function(itemClient){
                            return itemClient.id == submitData.client_data.id;       
                        });
                        if(!clientDataFilter.length){
                            submitData.client_data.reward_point = rewardpoint;
                            clients.push(submitData.client_data);     
                            AsyncStorage.setItem('list-client', JSON.stringify(clients)); 
                        }
                    }else{
                        let clients = this.props.route.params.clients;     
                        let clientDataFilter = clients.filter(function(itemClient){
                            return itemClient.id != submitData.client_id;       
                        });
                        this.clientData.reward_point += parseInt(rewardpoint); 
                        clientDataFilter.push(this.clientData);
                        AsyncStorage.setItem('list-client', JSON.stringify(clientDataFilter)); 
                    }*/

                    var _this = this;
                    setTimeout(function () {
                        if (_this.userData.PrintOut) {
                            // let letprinter = '';
                            // let printer = Print.selectPrinterAsync();   
                            // letprinter =   printer.url;
                            let listservice = _this.props.route.params.services;
                            let subtotalp = 0;
                            let totalp = 0
                            let html = '<html style="width:388px;">';
                            html += '<table style="background:000;width:388px" cellpadding="0" cellspacing="0">';
                            html += '<tr>';
                            html += '<td style="width:100%;vertical-align:top;color: #787878;border-bottom:2px;border-bottom-style: dashed;padding-bottom:5px" colspan="2" >';
                            html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:30px;margin-top:10px;font-weight:bolder;padding:10px;text-align:center;">' + _this.userData.businessname + ' </div>';
                            html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:24px;margin-top:10px;">Client: ' + responseJson.name + '</div> ';
                            html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:24px;margin-top:10px;">Date & Time: ' + moment(_this.selectedDay.format('Y-MM-DD') + ' ' + submitData.appointment_hour + ':00').format('dddd, MMMM DD YYYY, h:mm A') + '</div> ';
                            html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:24px;margin-top:10px;">Booking Channel: Walk-Ins</div> ';
                            html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:24px;margin-top:10px;">Check-In #: ' + responseJson.checkInNumber + '</div> ';

                            html += '</td>';
                            html += '</tr> ';

                            html += '<tr style="border-style:dashed;border-radius:10px;border-color:#269562;height:1px">';
                            html += '<td style="padding-top:5px" colspan="2" >';
                            html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:24px;margin-top:10px;">Service: </div>';
                            html += '</td>';
                            html += '</tr>';
                            Object.values(_this.selectServices).map(data => {
                                let dataid = data.id;
                                if (dataid.indexOf('combo') >= 0) {
                                    let price = data.price;
                                    let quantity = 1;
                                    if (typeof (data.quantity) != 'undefined') {
                                        price = parseFloat(data.price) * parseInt(data.quantity);
                                        quantity = parseInt(data.quantity);
                                    }
                                    subtotalp += price;
                                    let serviceTechnicians = _this.techniciansSelected[dataid];
                                    html += ' <tr>';
                                    html += '<td style="vertical-align:top;color: #787878;">';
                                    html += '<div style="line-height:25px;font-size:24px;margin-top:10px;">' + data.comboname + ' (x' + quantity + ') $' + price + '</div> ';
                                    //html += '</td>';
                                    //html += '<td style="vertical-align:top;color: #787878;">';
                                    html += '</td>';
                                    html += '</tr>';

                                    data.services.map(dataService => {
                                        Object.keys(serviceTechnicians).map((techdatakey, i) => {
                                            let arr = techdatakey.split('_');
                                            arr.shift();
                                            if (arr.join('_') == 'service_' + dataService.serviceid) {
                                                let technician = serviceTechnicians[techdatakey];
                                                let serviceItemData = listservice.filter(function (item) {
                                                    return item.id == 'service_' + dataService.serviceid;
                                                });
                                                let serviceItem = serviceItemData[0];
                                                html += ' <tr>';
                                                html += '<td style="vertical-align:top;color: #787878;">';
                                                html += '<div style="line-height:25px;font-size:24px;margin-top:10px;">' + serviceItem.service_name + ' -- ' + technician.fullname + '</div> ';
                                                // html += '</td>';
                                                // html += '<td style="vertical-align:top;color: #787878;">';
                                                html += '</td>';
                                                html += '</tr>';
                                            }
                                        })
                                    })
                                } else {
                                    let techs = _this.techniciansSelected[dataid];
                                    let technician = '';
                                    Object.keys(techs).map((techdatakey, i) => {
                                        technician = techs[techdatakey];
                                    });
                                    if (technician == '') {
                                        technician = {};
                                        technician.fullname = "Any Technician";
                                    }
                                    let price = data.price;
                                    let quantity = 1;
                                    if (typeof (data.quantity) != 'undefined') {
                                        price = parseFloat(data.price) * parseInt(data.quantity);
                                        quantity = parseInt(data.quantity);
                                    }
                                    subtotalp += price;
                                    html += ' <tr>';
                                    html += '<td style="vertical-align:top;color: #787878;">';
                                    html += '<div style="line-height:25px;font-size:24px;margin-top:10px;">' + data.service_name + ' (x' + quantity + ') $' + price + '</div> ';
                                    html += '<div style="line-height:25px;font-size:24px;margin-top:10px;">Staff: ' + technician.fullname + '</div>';
                                    // html += '</td>';
                                    // html += '<td style="vertical-align:top;color: #787878;">';
                                    html += '</td>';
                                    html += '</tr>';
                                }
                            })


                            // html += '<tr>';
                            // html += '<td style="vertical-align:top;color: #787878;"> ';
                            // html += '<div style="line-height:25px;margin-top:10px;font-size:24px;margin-top:10px;">Add-on service:</div>';
                            // //html += '</td>';
                            // //html += '<td style="vertical-align:top;color: #787878;">';
                            // html += '<div style="line-height:25px;margin-top:10px; font-size:24px;margin-top:10px;"></div>';
                            // html += '</td>';
                            // html += '</tr>';

                            html += '<tr><td colspan="2"  style="padding: 5px 0;"></td></tr>';
                            html += '<tr><td colspan="2"  style="width:100%;vertical-align:top;color: #787878;border-top:2px;border-top-style: dashed;padding: 5px 0;"></td></tr>';

                            // html += '<tr>';
                            // html += '<td style="vertical-align:top;color: #787878;"> ';
                            // html += '<div style="line-height:25px;margin-top:10px;font-size:24px;margin-top:10px;">Tips:</div>';
                            // //html += '</td>';
                            // //html += '<td style="vertical-align:top;color: #787878;">';
                            // html += '<div style="line-height:25px;margin-top:10px; "></div>';
                            // html += '</td>';
                            // html += '</tr>';

                            html += '<tr>';
                            html += '<td style="vertical-align:top;color: #787878;">';
                            html += '<div style="line-height:25px;font-size:24px;margin-top:10px;">Subtotal: $' + subtotalp + '</div>';
                            //html += '</td>';
                            //html += '<td style="vertical-align:top;color: #787878;">';
                            // html += '<div style="line-height:25px;margin-top:10px; font-size:24px;margin-top:10px;"></div>';
                            html += '</td>';
                            html += '</tr>';
                            totalp = subtotalp;
                            if (submitData.promotions.length > 0) {
                                submitData.promotions.map(data => {
                                    totalp -= data.appliedAmount;
                                    let lbl = '';
                                    switch (data.type) {
                                        case 'rewardpoint':
                                            lbl = 'Applied Reward Point';
                                            break;
                                        case 'gift':
                                            lbl = 'Applied Gift';
                                            break;
                                        default:
                                            lbl = 'Applied Coupon';
                                    }
                                    html += '<tr>';
                                    html += '<td style="vertical-align:top;color: #787878;">';
                                    html += '<div style="line-height:25px;font-size:24px;margin-top:10px;">' + lbl + ': -$' + data.appliedAmount + '</div>';
                                    // html += '</td>';
                                    // html += '<td style="vertical-align:top;color: #787878;">';
                                    // html += '<div style="line-height:25px;margin-top:10px; font-size:24px;margin-top:10px;"></div>';
                                    html += '</td>';
                                    html += '</tr>';
                                })
                            }
                            if (parseFloat(totalp) < 0) {
                                totalp = 0;
                            }
                            totalp = _this.roundprice(totalp);
                            html += '<tr>';
                            html += '<td style="vertical-align:top;color: #787878;">';
                            html += '<div style="line-height:25px;font-size:24px;margin-top:10px;">Total: $' + totalp + '</div>';
                            // html += '</td>';
                            // html += '<td style="vertical-align:top;color: #787878;">';
                            // html += '<div style="line-height:25px;margin-top:10px; font-size:24px;margin-top:10px;">$'+totalp+'</div>';
                            html += '</td>';
                            html += '</tr>';

                            html += ' </table>';
                            html += '<html>';

                            let options = {
                                html: html
                            }
                            var printTemp = html;
                            var passprnt_uri = 'starpassprnt://v1/print/nopreview?html=' + encodeURIComponent(html) + '&popup=enable&back=' + encodeURIComponent("exp://");
                            Linking.openURL(passprnt_uri).catch((err) => console.error('An error occurred', err));

                        }
                    }, 0);

                    this.appointmentLoaderRef.current.setState({
                        visible: false
                    });
                    let category_id = this.selectServices[0].category_id;
                    let reminder_day = 3;
                    let reminder = this.categories_reminder.filter(function (item) {
                        return item.id == category_id;
                    });
                    if (reminder.length > 0) {
                        reminder_day = reminder[0].reminder == 0 ? 3 : reminder[0].reminder
                    }


                    var starttime = moment(_this.selectedDay).add(reminder_day, 'days').format("YYYY-MM-DD HH:mm");
                    _this.props.navigation.push('bookingSuccess', {
                        isEdit: true,
                        clientData: _this.clientData,
                        services: _this.props.route.params.services,
                        startdatetime: starttime,
                        hour: submitData.appointment_hour,
                        hourTimePicker: _this.selectedHour,
                        selectServices: _this.selectServices,
                        techniciansSelected: _this.techniciansSelected,
                        clients: _this.props.route.params.clients,
                        technicians: _this.technicians,
                        availablehours: _this.props.route.params.availablehours,
                        token: _this.props.route.params.token,
                        blockedTime: _this.props.route.params.blockedTime,
                        TechniciansWorkingHour: _this.props.route.params.TechniciansWorkingHour,
                        userData: _this.props.route.params.userData,
                        blockedTimeYM: _this.props.route.params.blockedTimeYM,
                        listcombo: _this.props.route.params.listcombo,
                        categories: _this.props.route.params.categories,
                        isShowStaffCheckIn: _this.props.route.params.isShowStaffCheckIn,
                        isClientExists: true,
                        opening_hours: _this.props.route.params.opening_hours,
                        logo_app: _this.props.route.params.logo_app
                    });
                    //Alert.alert("Error", 'Yay Success');
                }
            })
            .catch(error => {
                console.error(error);
                this.appointmentLoaderRef.current.setState({
                    visible: false
                });

                setTimeout(() => {
                    Alert.alert('Error', 'Operation time out. Please try again');
                }, 100)
            });


    }

    fetchError(responseJson) {
        if (
            responseJson.message == "token_expired" ||
            responseJson.message == "token_invalid"
        ) {
            this.props.navigation.push('login');
        } else {
            Alert.alert("Error", responseJson.message);
        }
    }

    in_array(needle, haystack, argStrict) {
        var key = ''
        var strict = !!argStrict
        if (strict) {
            for (key in haystack) {
                if (haystack[key] === needle) {
                    return true
                }
            }
        } else {
            for (key in haystack) {
                if (haystack[key] == needle) {
                    return true
                }
            }
        }
        return false
    }

    close = () => {
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'home' }],
        });
    }

    onPressCategory = (categories, selectedCategory) => {
        this.ListServicesInCategoryRef.current.show(selectedCategory.name);
    }

    onSelectedServicesInCategory = () => {
        this.ListServicesInCategoryRef.current.close();
        this.ListCategoriesRef.current.reload(this.selectServices);
    }

    closeServicesInCategory = () => {
        this.ListCategoriesRef.current.reload(this.selectServices);
    }
    onPressDataRightLayout = (service) => {
        this.rightLayoutRef.current.setTextService(service);
    }
    render() {
        let containerHeaderStepsStyle = styles.containerHeaderSteps;
        let headerStyle = styles.headerContainer;
        if (Platform.OS != 'ios') {
            headerStyle = styles.headerContainerAndroid;
            containerHeaderStepsStyle = styles.containerHeaderStepsAndroid;
        }
        return (
            <View style={styles.container}>
                <View style={{ width: "70%" }}>
                    <LinearGradient start={[0, 0]} end={[1, 1]} colors={[color.reddish, color.reddish]} style={containerHeaderStepsStyle}>
                        <Steps step={1} ref={this.stepsRef} close={this.close} headerStyle={headerStyle} onPress={async (stepNumber, currentStep) => { await this.onPressStep(stepNumber, currentStep) }} />
                    </LinearGradient>

                    <View style={styles.containerTabs}>
                        <ScrollableTabView
                            ref={this.tabsRef}
                            renderTabBar={() => <HideTabBar />}
                            locked={true}>
                            <View style={{ flex: 1 }}>
                                <Customer ref={this.customerRef} userData={this.props.route.params.userData} clientSearchData={this.clientSearchData} isClientExists={this.isClientExists} clients={this.props.route.params.clients} onPress={this.onPressClient} token={this.props.route.params.token} providerid={this.props.route.params.userData.id} onClientUpdated={this.onClientUpdated} />
                            </View>
                            <View style={{ flex: 1 }}>
                                {typeof (this.userData.showLessServicesWhenDisableCheckInBooking) != 'undefined' && this.userData.showLessServicesWhenDisableCheckInBooking == 1
                                    &&
                                    <ListCategories
                                        onPress={this.onPressCategory}
                                        //onSelectedServices={this.goToTimePickerTab} 
                                        listcombo={this.props.route.params.listcombo}
                                        categories={this.props.route.params.listCategories}
                                        onSave={this.goToTimePickerTab}
                                        userData={this.userData}
                                        isBooking={true}
                                        ref={this.ListCategoriesRef}
                                    />
                                }

                                {(typeof (this.userData.showLessServicesWhenDisableCheckInBooking) == 'undefined' || (typeof (this.userData.showLessServicesWhenDisableCheckInBooking) != 'undefined'
                                    && this.userData.showLessServicesWhenDisableCheckInBooking == 0))
                                    &&
                                    <Listservices services={this.props.route.params.services} onPress={this.onPressService} onSelectedServices={this.goToTimePickerTab}
                                        listcombo={this.props.route.params.listcombo} categories={this.props.route.params.categories} ref={this.listserviceRef}
                                        userData={this.userData} listCategories={this.props.route.params.listCategories}
                                        onPressDataRightLayout={this.onPressDataRightLayout}
                                    />
                                }

                            </View>

                            <View style={{ flex: 1 }}>
                                <TimePicker availablehours={this.props.route.params.availablehours} onPress={async (day, hour, arrTechniciansAndHours) => { await this.onPressTime(day, hour, arrTechniciansAndHours); }}
                                    onPressTimeReset={this.onPressTimeReset}
                                    blockedTime={this.props.route.params.blockedTime}
                                    TechniciansWorkingHour={this.props.route.params.TechniciansWorkingHour}
                                    userData={this.props.route.params.userData}
                                    loadedDataYM={this.props.route.params.blockedTimeYM}
                                    token={this.props.route.params.token}
                                    services={this.props.route.params.services}
                                    opening_hours={this.props.route.params.opening_hours}
                                    timezone={this.props.route.params.timezone}
                                    ref={this.timepickerRef} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <ListTechnician ref={this.technicianRef} technicians={this.technicians} onPress={this.onPressTechnician} providerData={this.userData}
                                    services={this.props.route.params.services} showSummary={() => { this.onPressStep(5) }}
                                    onCheckValidHour={this.checkValidHour}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Summary ref={this.summaryRef} onPress={this.saveAppointment} token={this.props.token} />
                            </View>
                        </ScrollableTabView>
                        <SubmitLoader
                            ref={this.appointmentLoaderRef}
                            visible={false}
                            textStyle={layout.textLoaderScreenSubmit}
                            textContent={"Processing..."}
                            color={Colors.spinnerLoaderColorSubmit}
                        />

                        {typeof (this.userData.showLessServicesWhenDisableCheckInBooking) != 'undefined' && this.userData.showLessServicesWhenDisableCheckInBooking == 1
                            &&
                            <ListServicesInCategory services={this.props.route.params.services} onPress={this.onPressService}
                                onSelectedServices={this.onSelectedServicesInCategory}
                                listcombo={this.props.route.params.listcombo} categories={this.props.route.params.categories}
                                userData={this.userData} ref={this.ListServicesInCategoryRef} close={this.closeServicesInCategory}
                            />
                        }
                    </View>
                </View>

                <RightLayoutCheckIn step={1} ref={this.rightLayoutRef} userData={this.props.route.params.userData} logo_app={this.props.route.params.logo_app} close={this.close} onPress={async (stepNumber, currentStep) => { await this.onPressStep(stepNumber, currentStep) }} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', position: 'relative',
    },
    containerTabs: {
        flex: 1,
        backgroundColor: color.reddish
    },
    containerHeaderSteps: {
        height: 170,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerHeaderStepsAndroid: {
        height: 185
    },
    headerContainer: {
        height: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerContainerAndroid: {
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    headerTitle: {
        color: color.white,
        backgroundColor: 'transparent',
        fontSize: 24,
        fontFamily: 'Futura'
    },
    closebtn: {
        position: 'absolute',
        right: 20,
        backgroundColor: 'transparent',
        top: 30
    },
    businessname_right: {
        fontSize: 26,
        backgroundColor: 'transparent',
        color: color.reddish,
        fontFamily: 'Futura',
        bottom: 30,
        zIndex: 2,
    },
    copyright: {
        fontSize: 16,
        backgroundColor: 'transparent',
        color: color.reddish,
        fontFamily: 'Futura',
        bottom: 10,
        zIndex: 2,
    },
    copyrightPhone: {
        fontSize: 16,
        backgroundColor: 'transparent',
        color: color.reddish,
        fontFamily: 'Futura',
        bottom: 10,
        zIndex: 2,

    },
    backgroundFullscreen: {
        position: 'absolute',
        zIndex: 1
    },
})