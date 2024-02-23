import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Platform,
    SafeAreaView
} from "react-native";
import layout from "../assets/styles/layout";
import Colors from "../constants/Colors";
import SpinnerLoader from "../helpers/spinner";
import {
    fetchTechniciansData,
    fetchAppointments,
    fetch_appointments_cache,
    fetchBusinesshours,
    fetchServices,
    fetchListCombo,
    fetchTurns
} from "../helpers/fetchdata";
import {
    isLogged,
    jwtToken,
    getUserData,
    getDeviceId
} from "../helpers/authenticate";
import moment from "moment";
import NavigationBarBackground from "../components/navigationBarBG";
import CarlendarTitleNav from "../components/CalendarTitleNav";
import collect from "collect.js";
import ScrollableTabView from "react-native-scrollable-tab-view";
import DefaultTabBar from "../components/DefaultTabBar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AppointmentListByDay from "../components/AppointmentList";
import AppointmentListByWeek from "../components/AppointmentList";
import CalendarStrip from "react-native-calendar-strip";
import AddAppointment from "../components/AddAppointment";
import ViewAppointment from "../components/ViewAppointment";
import CalendarStripHeader from "../components/CalendarStripHeader";
import ModalCalendar from "../components/ModalCalendar";
import ModalNotification from "../components/ModalNotification";
import { getListAppointmentStatus, getListAppointmentStatusForCreate } from "../helpers/Utils";
import AppointmentSelectDay from "../components/AppointmentSelectDay";
import { getAppointmentDetails } from "../api/getAppointmentDetails";
import { formatPhone, getUSState2Digit, get_time_zone, getCountry2Digit } from "../helpers/Utils";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import MQTTConnection from '../helpers/MQTTConnection';
import * as Notifications from 'expo-notifications';
import { array } from "prop-types";
import { color } from "../assets/colors/colors";
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
export default class CalendarScreen extends React.Component {
    constructor(props) {
        super(props);
        this.tabAppointmentRef = React.createRef();
        this.AppointmentSelectDayRef = React.createRef();
        this.AppointmentListByDayRef = React.createRef();
        // this.AppointmentSelectDayListRef = React.createRef();
        this.AppointmentListByDayListRef = React.createRef();
        this.CalendarStripByWeekRef = React.createRef();
        this.AppointmentListByWeekRef = React.createRef();
        this.modalNotificationRef = React.createRef();
        this.addAppointmentRef = React.createRef();
        this.modalCalendarByWeekRef = React.createRef();
        this.tabappointmentloaderRef = React.createRef();

    }

    componentDidMount() {
        // this._registerForPushNotifications(
        //     this
        // );
        // Notifications.addNotificationReceivedListener(this._handleNotification);
        Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
        this.props.navigation.setOptions({
            headerTitle: "Calendar",
            headerLeft: () => (
                <TouchableOpacity
                    activeOpacity={1}
                    style={layout.headerNavLeftContainer}
                    onPress={() => this.onPressNotificationAppointment()}
                >
                    <View style={layout.headerNavLeft}>
                        <Icon
                            name={"bell-outline"}
                            size={25}
                            color={color.whiteRGB}
                            style={layout.navIcon}
                        />
                        {this.state.badge > 0 &&
                            <View style={styles.badgecontainer}>
                                <Text style={styles.badgetext}>{this.state.badge}</Text>
                            </View>
                        }

                    </View>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => this.onRefreshAppointment()}
                    activeOpacity={1}
                    style={layout.headerNavRightContainer}
                >
                    <View style={layout.headerNavLeft}>
                        <Icon
                            name={"refresh"}
                            size={25}
                            color={color.whiteRGB}
                            style={layout.navIcon}
                        />
                    </View>
                </TouchableOpacity>
            ),
        });
    }
    languageKey = typeof (this.props.route.params.language) != 'undefined' ? this.props.route.params.language : 'en-US';
    token = "";
    deviceid = 0;
    isLoggedIn = false;
    currentYYYYMMDD = moment.utc().format("YYYY-MM-DD");
    loadedMonths = {};
    today = moment();
    byDayDate = moment();
    technicians = [];
    techniciansWithSearch = [];
    clients = [];
    availablehours = [];
    appointments = [];
    appointmentsByDay = [];
    appointmentsByDayList = [];
    appointmentsByWeek = [];
    listAppointmentStatus = getListAppointmentStatus();
    listAppointmentStatusForCreate = getListAppointmentStatusForCreate();
    services = [];
    combos = [];
    selectServices = {};
    filter = { technician: 0 };
    startDateWeek = moment().startOf("week").add(0, "days");
    endDateWeek = moment().startOf("week").add(6, "days");
    isTabDay = true;
    isTabDayList = false;
    newAppointmentTitle = getTextByKey(this.languageKey, 'newappointmenttitle');
    addAppointmentTitle = this.newAppointmentTitle;
    isToday = true;
    express_checkin_data = [];
    byDayText = moment().format("ll");
    state = {
        appIsReady: false,
        badge: 0
    };
    focusedDay = moment();
    userData = {};
    isLoadedAppointment = false;
    appointmentPushDataId = 0;
    categories = [];
    turns = [];

    liststatus = ['pending', 'confirmed', 'completed', 'canceled'];
    stateData = '';
    timezone = '';

    _registerForPushNotifications = (_this) => {
        this._notificationSubscription = Notifications.addNotificationResponseReceivedListener(data => {
            // console.log('Listener');
            // Alert.alert('Listener', 1);
            this._handleNotification(data);
        });
    }
    _handleNotification(notification) {
        //console.log('handle');
        // Alert.alert('handle', 2);
        // if(typeof(notification.notification.request.content.data.id) != 'undefined'){
        //     this._onPressAppointment(notification.notification.request.content.data.id);
        // }
    }
    _handleNotificationResponse = response => {
        //console.log("response", response);
        // Alert.alert('response', 'abcjsj');
        let _this = this;
        setTimeout(function () {
            if (typeof (response.notification.request.content.data.id) != 'undefined') {
                _this._onPressAppointment(response.notification.request.content.data.id);
            }
        }, 3000);

    };
    UNSAFE_componentWillUnmount() {
        this._notificationSubscription &&
            this._notificationSubscription.remove();
    }

    async UNSAFE_componentWillMount() {
        this.mqttConnect = new MQTTConnection();
        this.mqttConnect.onMQTTConnect = this.onMQTTConnect;
        this.mqttConnect.onMQTTLost = this.onMQTTLost;
        this.mqttConnect.onMQTTMessageArrived = this.onMQTTMessageArrived;
        this.mqttConnect.onMQTTMessageDelivered = this.onMQTTMessageDelivered;
        this.mqttConnect.connect('104.131.179.241', 80)
        // this.mqttConnect.close();
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn) {
            this.token = await jwtToken();
            this.userData = await getUserData();
            let stateData = getUSState2Digit(this.userData.state);
            let country = getCountry2Digit(this.userData.country);
            let timezone = get_time_zone(country, stateData);
            this.timezone = timezone;
            this.byDayDate = moment().tz(timezone);
            this.today = moment().tz(timezone);
            this.currentYYYYMMDD = moment().tz(timezone).format("YYYY-MM-DD");
            this.startDateWeek = moment().tz(timezone).startOf("week").add(0, "days");
            this.endDateWeek = moment().tz(timezone).startOf("week").add(6, "days");
            this.byDayText = moment().tz(timezone).format("ll");
            this.focusedDay = moment().tz(timezone);
            this.deviceid = await getDeviceId();
            this.languageKey = await getLanguage();
            //fetch appointment
            var appointmentsData = await fetch_appointments_cache(
                this.token,
                this.currentYYYYMMDD,
                'day'
            );
            let _this = this;
            //fetch technicians
            let TechniciansData = [];
            let TechniciansDataNav = [];

            TechniciansData = await fetchTechniciansData(this.token);
            if (this.userData.role == 4) {
                TechniciansDataNav = [...TechniciansData];
                TechniciansDataNav.map((x, i) => {
                    let filterTechCount = appointmentsData.appointments.filter(function (techItem) {
                        return techItem.technicianId == x.id;
                    }).length;
                    x.sortTech = filterTechCount;
                });
                this.technicians = collect(TechniciansData);
                let allTechnician = {
                    id: 0,
                    fullname: getTextByKey(this.languageKey, 'anytech'),
                    picture: '',
                    sortTech: 100
                };
                TechniciansData.splice(0, 0, allTechnician);

                this.techniciansWithSearch = TechniciansData;

                let allTechnicianNav = {
                    id: 0,
                    fullname: getTextByKey(this.languageKey, 'anytechnav'),
                    picture: '',
                    sortTech: 100
                };
                TechniciansDataNav.splice(0, 0, allTechnicianNav);
                this.technicians = this.technicians.sortByDesc('sortTech');

            }

            if (this.userData.role == 9) {
                var __this = this;
                TechniciansData = TechniciansData.filter(function (item) {
                    return item.id == __this.userData.id
                })

                this.filter.technician = this.userData.id;
                let techDefault = {};
                techDefault.id = this.userData.id;
                techDefault.firstname = this.userData.firstname;
                techDefault.lastname = this.userData.lastname;
                techDefault.fullname = this.userData.fullname;
                if (TechniciansData.length > 0) techDefault.skillsToServices = TechniciansData[0].skillsToServices;
                TechniciansData.push(techDefault);
                this.technicians = collect(TechniciansData);
                this.techniciansWithSearch = TechniciansData;
                TechniciansDataNav = [...TechniciansData];
            }
            if (appointmentsData.express_checkin.length > 0) {
                appointmentsData.express_checkin.forEach(function (item_express) {
                    item_express.id = item_express.id;
                    item_express.status = 1;
                    item_express.technicianId = 0;
                    item_express.start = item_express.checkedDate;
                    item_express.end = item_express.checkedDate;
                    item_express.schedulerid = item_express.id;
                    item_express.channel = item_express.appointment_resource;
                    item_express.bookingcode = '******';
                    item_express.name = 'No select service';
                    appointmentsData.appointments.push(item_express);
                    _this.express_checkin_data.push(item_express);
                })
            }
            var collectAppointment = collect(appointmentsData.appointments);
            this.loadedMonths[this.currentYYYYMMDD] = collectAppointment;

            if (Platform.OS === 'ios') {
                this.appointments = collect([...this.loadedMonths[this.currentYYYYMMDD]]);
            } else {
                this.customercheckins = this.loadedMonths[this.currentYYYYMMDD];
            }
            this.isLoadedAppointment = true;
            //fetch clients
            this.clients = [];
            //fetch businesshours
            var businesshours = await fetchBusinesshours(this.token);
            this.availablehours = businesshours.available_hours;
            //fetch combos
            this.combos = await fetchListCombo(this.token);
            //fetch services
            this.services = await fetchServices(this.token);
            this.services.forEach(function (item) {
                item.isCombo = false;
                item.idDefault = item.id;
                item.id = 'service_' + item.id;
                let category = _this.categories.filter(function (itemCategory) {
                    if (typeof (item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != '') {
                        return itemCategory == item.category_customname;
                    } else {
                        return itemCategory == item.category_name;
                    }
                });
                if (!category.length) {
                    if (typeof (item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != '') {
                        _this.categories.push(item.category_customname);
                    } else {
                        _this.categories.push(item.category_name);
                    }
                }
            });
            this.categories = this.categories.sort(function (a, b) {
                if (a < b) return -1;
                else if (a > b) return 1;
                return 0;
            });
            this.categories.push('Combo');
            this.combos.forEach(function (item) {
                let serviceData = {
                    duration: 0,
                    happyhour: false,
                    id: 'combo_' + item.id,
                    isCombo: true,
                    price: item.price,
                    rewardpoint: item.rewardpoint,
                    service_name: item.comboname
                }
                _this.services.push(serviceData);
            });
            let firstService = {
                id: 0,
                service_name: getTextByKey(this.languageKey, 'selectserviceappointment'),
                price: 0,
                technicianId: 0,
                technicianName: getTextByKey(this.languageKey, 'selecttechnicianappointment'),
                isCombo: false,
                rewardpoint: 0
            };
            this.selectServices["service_0"] = firstService;
            this.setState({ appIsReady: true });
            this.displayAppointmentByDay(true, false);
            if (typeof this.props.route.params.showTabWeek != "undefined") {
                await _this.showNotificationAppointment(
                    this.props.route.params.notificationData.data,
                    this
                );
            }
        } else {
            this.props.navigation.push("login");
        }
    }

    onMQTTConnect = () => {
        // console.log('App onMQTTConnect');
        this.mqttConnect.subscribeChannel('backgroupautorefresh_' + this.userData.id);
    }

    onMQTTLost = () => {
        // console.log('App onMQTTLost');
    }

    onMQTTMessageArrived = (message) => {
        this.onRefreshAppointment();
    }

    onMQTTMessageDelivered = (message) => {
        // console.log('App onMQTTMessageDelivered: ', message);
    }

    onRefreshAppointment = async () => {
        this.fetchMonthData();
    }

    onPressNotificationAppointment = async () => {
        this.modalNotificationRef.current.show();
        //      //doi cap nhat
        // this.props.navigator.updateCurrentRouteParams({
        //     badge: 0
        // });
    }

    onPressNotificationItem = (id) => {
        this._onPressAppointment(id);
    }

    async showNotificationAppointment(data, _this) {
        let isLoaded = false;
        for (let loadedApptByYMkey in _this.loadedMonths) {
            let loadedList = _this.loadedMonths[loadedApptByYMkey];
            if (loadedList.where("id", data.id).count() > 0) {
                isLoaded = true;
                break;
            }
        }
        if (!isLoaded) {
            let AppointmentDetails = await getAppointmentDetails(
                _this.token,
                data.id
            );
            let appointmentDataFormat = {};
            appointmentDataFormat.id = AppointmentDetails.id;
            appointmentDataFormat.status = AppointmentDetails.status;
            appointmentDataFormat.booking_code =
                AppointmentDetails.booking_code;
            appointmentDataFormat.total = AppointmentDetails.total;
            appointmentDataFormat.start_time = AppointmentDetails.start_time;
            appointmentDataFormat.end_time = AppointmentDetails.end_time;
            appointmentDataFormat.technician_id =
                AppointmentDetails.technician_id;
            appointmentDataFormat.technician_fullname =
                AppointmentDetails.technician_fullname;
            appointmentDataFormat.client = AppointmentDetails.client.fullname;
            let YM = moment(AppointmentDetails.start_time).format("YMM");
            if (typeof _this.loadedMonths[YM] != "undefined") {
                _this.loadedMonths[YM].push(appointmentDataFormat);
            }
        }
        _this.byDayDate = moment(data.starttime);
        _this.focusedDay = moment(data.starttime);
        _this.startDateWeek = this.focusedDay.clone().startOf("week");
        _this.endDateWeek = this.focusedDay.clone().endOf("week");

        setTimeout(function () {
            _this.tabAppointmentRef.current.goToPage(1);
        }, 0);
    }


    getAppointmentDataByTechnicianId = (techId, appointmentsCurrentSelectedDay) => {
        let sectionAppointment = {};
        sectionAppointment.key = techId;
        let apptsByTech = appointmentsCurrentSelectedDay.filter(function (itemAppt) {
            return itemAppt.technicianId == techId;
        }
        );
        if (apptsByTech.count()) {
            return apptsByTech.toArray();
        } else {
            return [{ id: 0 }];
        }
    }

    async displayAppointmentByDay(isRefresh = true, isRefreshDay = true) {
        this.appointmentsByDay = [];
        var startTimeCurrentSelectedDate =
            this.byDayDate.format("Y-MM-DD") + " 00:00:00";
        var endTimeCurrentSelectedDate =
            this.byDayDate.format("Y-MM-DD") + " 23:59:59";
        let YMD = this.byDayDate.format("YYYY-MM-DD");
        this.tabappointmentloaderRef.current.setState({ visible: true });
        if (typeof this.loadedMonths[YMD] == "undefined") {
            let _this = this;
            _this.express_checkin_data = [];
            var appointmentsData = await fetch_appointments_cache(this.token, YMD, 'day');
            var appointments = this.fillData(appointmentsData);
            if (appointmentsData.express_checkin.length > 0) {
                appointmentsData.express_checkin.forEach(function (item_express) {
                    item_express.id = item_express.id;
                    item_express.status = 1;
                    item_express.technicianId = 0;
                    item_express.start = item_express.checkedDate;
                    item_express.end = item_express.checkedDate;
                    item_express.schedulerid = item_express.id;
                    item_express.channel = item_express.appointment_resource;
                    item_express.bookingcode = '******';
                    item_express.name = 'No select service';
                    appointments.push(item_express);
                    _this.express_checkin_data.push(item_express);
                })
            }
            this.loadedMonths[YMD] = collect(appointments);
        }
        if (Platform.OS === 'ios') {
            this.appointments = collect([...this.loadedMonths[YMD]]);
        } else {
            this.appointments = this.loadedMonths[YMD];
        }
        this.tabappointmentloaderRef.current.setState({ visible: false });
        var appointmentsCurrentSelectedDay = this.appointments
            .where("start", ">", startTimeCurrentSelectedDate)
            .where("start", "<", endTimeCurrentSelectedDate).where("status", "!=", 3);

        appointmentsCurrentSelectedDay = appointmentsCurrentSelectedDay.sortBy(
            "start"
        );
        let apptTechExists = [];
        let _this = this;
        if (this.filter.technician > 0) {
            let sectionAppointment = {};
            sectionAppointment.key = this.filter.technician;
            sectionAppointment.data = this.getAppointmentDataByTechnicianId(this.filter.technician, appointmentsCurrentSelectedDay);
            this.appointmentsByDay.push(sectionAppointment);
        } else {
            this.technicians.map((item, i) => {
                let sectionAppointment = {};
                sectionAppointment.key = item.id;
                sectionAppointment.data = this.getAppointmentDataByTechnicianId(item.id, appointmentsCurrentSelectedDay);
                this.appointmentsByDay.push(sectionAppointment);
            })
        }
        // console.log('isRefresh', this.appointmentsByDay);
        if (isRefresh) {
            if (this.AppointmentListByDayRef.current != null) {
                this.AppointmentListByDayRef.current.setState({
                    visible: true,
                    byday: true,
                    data: this.appointmentsByDay
                });
            }
        }
        if (isRefreshDay) {
            if (this.byDayDate.isSame(this.today, "day")) {
                this.AppointmentSelectDayRef.current.setState({
                    byDayText: this.byDayDate.format("ll"),
                    isToday: true
                });
            } else {
                this.AppointmentSelectDayRef.current.setState({
                    byDayText: this.byDayDate.format("ll"),
                    isToday: false
                });
            }
        }
    };
    _search_appointment_by_day = (searchtext, isRefresh = true, isRefreshDay = true) => {
        this.search_appointment_by_day_process(searchtext, isRefresh);
    };
    async search_appointment_by_day_process(searchtext, isRefresh = true, isRefreshDay = true) {
        this.appointmentsByDay = [];
        var startTimeCurrentSelectedDate =
            this.byDayDate.format("Y-MM-DD") + " 00:00:00";
        var endTimeCurrentSelectedDate =
            this.byDayDate.format("Y-MM-DD") + " 23:59:59";
        let YMD = this.byDayDate.format("YYYY-MM-DD");
        this.tabappointmentloaderRef.current.setState({ visible: true });
        if (typeof this.loadedMonths[YMD] == "undefined") {
            let _this = this;
            _this.express_checkin_data = [];
            var appointmentsData = await fetch_appointments_cache(this.token, YMD, 'day');
            var appointments = this.fillData(appointmentsData);
            if (appointmentsData.express_checkin.length > 0) {
                appointmentsData.express_checkin.forEach(function (item_express) {
                    item_express.id = item_express.id;
                    item_express.status = 1;
                    item_express.technicianId = 0;
                    item_express.start = item_express.checkedDate;
                    item_express.end = item_express.checkedDate;
                    item_express.schedulerid = item_express.id;
                    item_express.channel = item_express.appointment_resource;
                    item_express.bookingcode = '******';
                    item_express.name = 'No select service';
                    appointments.push(item_express);
                    _this.express_checkin_data.push(item_express);
                })
            }
            this.loadedMonths[YMD] = collect(appointments);
        }
        if (Platform.OS === 'ios') {
            this.appointments = collect([...this.loadedMonths[YMD]]);
        } else {
            this.appointments = this.loadedMonths[YMD];
        }
        this.tabappointmentloaderRef.current.setState({ visible: false });
        var appointmentsCurrentSelectedDay = this.appointments
            .where("start", ">", startTimeCurrentSelectedDate)
            .where("start", "<", endTimeCurrentSelectedDate).where("status", "!=", 3);

        appointmentsCurrentSelectedDay = appointmentsCurrentSelectedDay.sortBy(
            "start"
        );
        let search_app_by_day = [];
        let technician_search = [];
        if (searchtext != '') {
            let SearchData = appointmentsCurrentSelectedDay.items;
            search_app_by_day = SearchData.filter(function (itemsearch) {
                let phone = '';
                if (typeof itemsearch.phone != 'undefined' && itemsearch.phone != '' && itemsearch.phone != null) {
                    phone = itemsearch.phone.replace(/[^\d]+/g, '');
                }
                return (typeof (itemsearch.email) != 'undefined' && itemsearch.email.indexOf(searchtext.toLowerCase()) >= 0) ||
                    (typeof (itemsearch.client_full_name) != 'undefined' && (itemsearch.client_full_name).toLowerCase().indexOf(searchtext.toLowerCase())) >= 0 ||
                    phone.indexOf(searchtext) >= 0;
            });
            this.technicians.map((item, i) => {
                let length_service = search_app_by_day.filter(function (item_s) {
                    return item_s.technicianId == item.id
                }).length;
                if (length_service > 0) {
                    if (item.id == 0) {
                        item.sortTech = 100;
                    } else item.sortTech = length_service;

                    technician_search.push(item);
                }
            })
            appointmentsCurrentSelectedDay = collect(search_app_by_day);
        }
        let apptTechExists = [];
        let _this = this;
        if (this.filter.technician > 0) {
            let sectionAppointment = {};
            sectionAppointment.key = this.filter.technician;
            sectionAppointment.data = this.getAppointmentDataByTechnicianId(this.filter.technician, appointmentsCurrentSelectedDay);
            this.appointmentsByDay.push(sectionAppointment);
        } else {
            if (technician_search.length > 0) {
                technician_search = collect(technician_search).sortByDesc('sortTech');
                technician_search.map((item, i) => {
                    let sectionAppointment = {};
                    sectionAppointment.key = item.id;
                    sectionAppointment.data = this.getAppointmentDataByTechnicianId(item.id, appointmentsCurrentSelectedDay);
                    this.appointmentsByDay.push(sectionAppointment);
                })
            } else {
                this.technicians.map((item, i) => {
                    let sectionAppointment = {};
                    sectionAppointment.key = item.id;
                    sectionAppointment.data = this.getAppointmentDataByTechnicianId(item.id, appointmentsCurrentSelectedDay);
                    this.appointmentsByDay.push(sectionAppointment);
                })
            }

        }
        // console.log('isRefresh', this.appointmentsByDay);
        if (isRefresh) {
            if (this.AppointmentListByDayRef.current != null) {
                this.AppointmentListByDayRef.current.setState({
                    visible: true,
                    byday: true,
                    data: this.appointmentsByDay
                });
            }
        }
        if (isRefreshDay) {
            if (this.byDayDate.isSame(this.today, "day")) {
                this.AppointmentSelectDayRef.current.setState({
                    byDayText: this.byDayDate.format("ll"),
                    isToday: true
                });
            } else {
                this.AppointmentSelectDayRef.current.setState({
                    byDayText: this.byDayDate.format("ll"),
                    isToday: false
                });
            }
        }
    };

    async displayAppointmentByDayList(isRefresh = true, isRefreshDay = true) {
        this.appointmentsByDayList = [];
        var startTimeCurrentSelectedDate =
            this.byDayDate.format("Y-MM-DD") + " 00:00:00";
        var endTimeCurrentSelectedDate =
            this.byDayDate.format("Y-MM-DD") + " 23:59:59";
        let YMD = this.byDayDate.format("YYYY-MM-DD");
        this.tabappointmentloaderRef.current.setState({ visible: true });
        if (typeof this.loadedMonths[YMD] == "undefined") {
            let _this = this;
            _this.express_checkin_data = [];
            var appointmentsData = await fetch_appointments_cache(this.token, YMD, 'day');
            var appointments = this.fillData(appointmentsData);
            if (appointmentsData.express_checkin.length > 0) {
                appointmentsData.express_checkin.forEach(function (item_express) {
                    item_express.id = item_express.id;
                    item_express.status = 1;
                    item_express.technicianId = 0;
                    item_express.start = item_express.checkedDate;
                    item_express.end = item_express.checkedDate;
                    item_express.schedulerid = item_express.id;
                    item_express.channel = item_express.appointment_resource;
                    item_express.bookingcode = '******';
                    item_express.name = 'No select service';
                    appointments.push(item_express);
                    _this.express_checkin_data.push(item_express);
                })
            }
            this.loadedMonths[YMD] = collect(appointments);
        }
        if (Platform.OS === 'ios') {
            this.appointments = collect([...this.loadedMonths[YMD]]);
        } else {
            this.appointments = this.loadedMonths[YMD];
        }
        this.tabappointmentloaderRef.current.setState({ visible: false });
        var appointmentsCurrentSelectedDay = this.appointments
            .where("start", ">", startTimeCurrentSelectedDate)
            .where("start", "<", endTimeCurrentSelectedDate);

        appointmentsCurrentSelectedDay = appointmentsCurrentSelectedDay.sortBy(
            "start"
        );
        let apptTechExists = [];
        let _this = this;
        if (this.filter.technician > 0) {
            let sectionAppointment = {};
            sectionAppointment.key = this.filter.technician;
            sectionAppointment.data = this.getAppointmentDataByTechnicianId(this.filter.technician, appointmentsCurrentSelectedDay);
            this.appointmentsByDayList.push(sectionAppointment);
        } else {
            let sectionAppointment = {};
            sectionAppointment.key = 0;
            let apptsByList = appointmentsCurrentSelectedDay;
            if (apptsByList.count()) {
                apptsByList = apptsByList.toArray();
            } else {
                apptsByList = [{ id: 0 }];
            }
            sectionAppointment.data = apptsByList;
            this.appointmentsByDayList.push(sectionAppointment);
        }
        if (isRefresh) {
            if (this.AppointmentListByDayListRef.current != null) {
                this.AppointmentListByDayListRef.current.setState({
                    visible: true,
                    byday: true,
                    data: this.appointmentsByDayList,
                    propsdata: this.appointmentsByDayList
                });
            }
        }
        // if (isRefreshDay) {
        //     if (this.byDayDate.isSame(this.today, "day")) {
        //         this.AppointmentSelectDayListRef.current.setState({
        //             byDayText: this.byDayDate.format("ll"),
        //             isToday: true
        //         });
        //     } else {
        //         this.AppointmentSelectDayListRef.current.setState({
        //             byDayText: this.byDayDate.format("ll"),
        //             isToday: false
        //         });
        //     }
        // }
    };
    async displayAppointmentByWeek(isRefresh = true, isRefreshStrip = true) {
        let _this = this;
        this.appointmentsByWeek = [];
        var startTimeCurrentSelectedDate =
            this.startDateWeek.format("Y-MM-DD") + " 00:00:00";
        var endTimeCurrentSelectedDate =
            this.endDateWeek.format("Y-MM-DD") + " 23:59:59";
        let YMStart = this.startDateWeek.format("YYYY-MM-DD");
        let YMEnd = this.endDateWeek.format("YYYY-MM-DD");
        var time_start_end = YMStart + '_' + YMEnd;

        this.tabappointmentloaderRef.current.setState({ visible: true });
        if (typeof this.loadedMonths[time_start_end] == "undefined") {
            var appointmentsData = await fetch_appointments_cache(this.token, YMStart, 'week');
            var appointments = this.fillData(appointmentsData);
            this.loadedMonths[time_start_end] = collect(appointments);
        }
        if (Platform.OS === 'ios') {
            this.appointments = collect([...this.loadedMonths[time_start_end]]);
        } else {
            this.appointments = this.loadedMonths[time_start_end];
        }
        this.tabappointmentloaderRef.current.setState({ visible: false });

        var appointmentsCurrentSelectedWeek = this.appointments
            .where("start", ">", startTimeCurrentSelectedDate)
            .where("start", "<", endTimeCurrentSelectedDate).where("status", "!=", 3);
        if (this.filter.technician > 0) {
            var currentSelectedTechnician = this.filter.technician;
            appointmentsCurrentSelectedWeek = appointmentsCurrentSelectedWeek.filter(function (item) {
                return item.technicianId == currentSelectedTechnician;
            }
            );
        }
        appointmentsCurrentSelectedWeek = appointmentsCurrentSelectedWeek.sortBy(
            "start"
        );
        appointmentsCurrentSelectedWeek = appointmentsCurrentSelectedWeek.groupBy(
            function (item, key) {
                return item.start.substring(0, 10);
            }
        );

        var appointmentsByWeekData = appointmentsCurrentSelectedWeek.all();
        for (let i = 0; i < 7; i++) {
            let cloneStart = this.startDateWeek.clone();
            let startKey = cloneStart.add(i, "days").format("Y-MM-DD");

            let sectionAppointment = {};
            sectionAppointment.key = startKey;
            if (typeof appointmentsByWeekData[startKey] != "undefined") {
                sectionAppointment.data = appointmentsByWeekData[startKey];
            } else {
                sectionAppointment.data = [{ id: 0 }];
            }
            this.appointmentsByWeek.push(sectionAppointment);
        }
        if (isRefreshStrip) {
            setTimeout(function () {
                if (_this.CalendarStripByWeekRef.current != null) {
                    _this.CalendarStripByWeekRef.current.setState({
                        selectedDate: _this.focusedDay.clone(),
                        startingDate: _this.focusedDay.clone().startOf("week")
                    });
                }
            }, 0);
        }
        if (isRefresh) {

            if (this.AppointmentListByWeekRef.current != null) {
                setTimeout(function () {
                    let sectionIndex = _this.focusedDay.day();
                    _this.AppointmentListByWeekRef.current.setState({
                        visible: true,
                        byday: false,
                        data: _this.appointmentsByWeek,
                        sectionIndex: sectionIndex,
                        itemIndex: 0
                    });
                    _this.AppointmentListByWeekRef.current.scrollTo();
                }, 100);

            }
        }
    }
    fillData = (appointmentsData) => {
        let _this = this;
        let appointments = appointmentsData.appointments;
        return appointments;
    }
    onSelectTechnician = id => {
        this.filter.technician = id;
        if (this.isTabDay) {
            this.displayAppointmentByDay();
        } else {
            this.displayAppointmentByWeek();
        }
    };
    async fetchMonthData() {
        if (this.isTabDay) {
            let YMD = this.byDayDate.format("YYYY-MM-DD");
            delete this.loadedMonths[YMD];
            this.displayAppointmentByDay(true, false);
        } else if (this.isTabDayList) {
            let YMD = this.byDayDate.format("YYYY-MM-DD");
            delete this.loadedMonths[YMD];
            this.displayAppointmentByDayList(true, false);
        } else {
            let YMStart = this.startDateWeek.format("YYYY-MM-DD");
            let YMEnd = this.endDateWeek.format("YYYY-MM-DD");
            var time_start_end = YMStart + '_' + YMEnd;
            delete this.loadedMonths[time_start_end];
            this.displayAppointmentByWeek(true);
        }
    }
    changeDate = option => {
        if (option == "prev") {
            this.byDayDate.subtract(1, "day");
            this.focusedDay.subtract(1, "day");
        } else {
            this.byDayDate.add(1, "day");
            this.focusedDay.add(1, "day");
        }
        let YYYYMMDD = this.byDayDate.format("YYYY-MM-DD");
        if (this.isTabDay) {
            this.currentYYYYMMDD = YYYYMMDD;
            this.displayAppointmentByDay(true);
        }
        this.startDateWeek = this.focusedDay.clone().startOf("week");
        this.endDateWeek = this.focusedDay.clone().endOf("week");
    };
    changeDateList = option => {
        if (option == "prev") {
            this.byDayDate.subtract(1, "day");
            this.focusedDay.subtract(1, "day");
        } else {
            this.byDayDate.add(1, "day");
            this.focusedDay.add(1, "day");
        }
        let YYYYMMDD = this.byDayDate.format("YYYY-MM-DD");
        this.currentYYYYMMDD = YYYYMMDD;
        this.displayAppointmentByDayList(true);
        this.startDateWeek = this.focusedDay.clone().startOf("week");
        this.endDateWeek = this.focusedDay.clone().endOf("week");
    };
    changeWeek = week => {
        this.startDateWeek = week.clone();
        this.endDateWeek = week.clone().add(6, "days");
        this.focusedDay = this.startDateWeek
            .clone()
            .add(this.focusedDay.day(), "days");
        this.byDayDate = this.focusedDay.clone();
        this.displayAppointmentByWeek(true);
    };

    _today = () => {
        if (!this.byDayDate.isSame(this.today, "day")) {
            this.byDayDate = moment().tz(this.timezone);
            this.focusedDay = moment().tz(this.timezone);
            this.startDateWeek = this.focusedDay.clone().startOf("week");
            this.endDateWeek = this.focusedDay.clone().endOf("week");
            this.displayAppointmentByDay(true);
        }
    };
    _todaylist = () => {
        if (!this.byDayDate.isSame(this.today, "day")) {
            this.byDayDate = moment().tz(this.timezone);
            this.focusedDay = moment().tz(this.timezone);
            this.startDateWeek = this.focusedDay.clone().startOf("week");
            this.endDateWeek = this.focusedDay.clone().endOf("week");
            this.displayAppointmentByDayList(true);
        }
    };
    toDayWeek = () => {
        if (!this.focusedDay.isSame(this.today, "day")) {
            this.byDayDate = moment().tz(this.timezone);
            this.focusedDay = moment().tz(this.timezone);
            this.startDateWeek = this.focusedDay.clone().startOf("week");
            this.endDateWeek = this.focusedDay.clone().endOf("week");
            this.displayAppointmentByWeek(true);
        }
    };


    changeTab = index => {
        if (index.i == 0) {
            if (!this.isTabDay) {
                this.isTabDay = true;
                this.isTabDayList = false
                this.displayAppointmentByDay(true);
            }
        } else if (index.i == 2) {
            this.isTabDay = false;
            this.isTabDayList = true
            this.displayAppointmentByDayList(true);
        } else {
            if (this.isTabDay) {
                this.isTabDay = false;
            }
            this.isTabDayList = false;
            this.displayAppointmentByWeek(true);
        }
    };
    isInt(value) {
        if (isNaN(value)) {
            return false;
        }
        var x = parseFloat(value);
        return (x | 0) === x;
    }
    addAppointment = async key => {
        this.isInt(key);
        this.addAppointmentTitle = this.newAppointmentTitle;
        this.addAppointmentRef.current.isShowLoaderAppointmentDetails = false;
        this.addAppointmentRef.current.clearForm();
        this.addAppointmentRef.current.title = this.addAppointmentTitle;
        this.addAppointmentRef.current.statusName = 'confirmed';
        this.addAppointmentRef.current.selectedStatus = 'confirmed';

        if (this.isTabDay) {
            this.addAppointmentRef.current.selectedTechnician = key;
            let selectedTech = this.technicians.first(function (item) {
                return item.id == key;
            });
            this.addAppointmentRef.current.technicianName = selectedTech.fullname;
            let services = collect(this.services);
            let serviceSkill = this.services;
            if (typeof selectedTech.skillsToServices != 'undefined') {
                serviceSkill = services.whereIn('idDefault', selectedTech.skillsToServices).toArray();
            }
            this.addAppointmentRef.current.propsServices = serviceSkill;
        } else {
            this.addAppointmentRef.current.propsServices = this.services;
            this.addAppointmentRef.current.selectedDate = moment(key);
            let dayname = moment(key).format("dddd").toLowerCase();
            let availablehours = this.availablehours[dayname];
            if (availablehours.length) {
                this.addAppointmentRef.current.selectedHour = availablehours[0];
                this.addAppointmentRef.current.appointmentDate = moment(
                    key
                ).format("DD-MM-Y");
                this.addAppointmentRef.current.appointmentHour = this.convertTo24Hour(availablehours[0]);
                this.addAppointmentRef.current.selectedTime =
                    moment(key).format("MM-DD-Y") + " " + availablehours[0];
            }
        }

        //load turn
        this.addAppointmentRef.current.turns = [];
        if (this.userData.isManageTurn) {
            this.addAppointmentRef.current.showLoaderAppointmentDetail();
            this.addAppointmentRef.current.turns = await fetchTurns(this.token);
            this.addAppointmentRef.current.isShowLoaderAppointmentDetails = false;
        }
        this.addAppointmentRef.current.setState({
            modalVisible: true,
            appointmentId: 0
        });
    };
    add_express_Appointment = async (id_express) => {
        let key = 0;
        let filter_express = this.express_checkin_data.filter(function (item_exp) {
            return item_exp.id == id_express;
        });
        if (filter_express.length > 0) {
            this.addAppointmentRef.current.showLoaderAppointmentDetail();
            filter_express = filter_express[0];
            this.addAppointmentTitle = this.newAppointmentTitle;
            this.addAppointmentRef.current.isShowLoaderAppointmentDetails = false;
            this.addAppointmentRef.current.title = this.addAppointmentTitle;
            this.addAppointmentRef.current.statusName = 'confirmed';
            this.addAppointmentRef.current.selectedStatus = 'confirmed';
            //set time
            let starttime = moment().tz(this.timezone);
            this.addAppointmentRef.current.selectedDate = starttime;
            this.addAppointmentRef.current.selectedHour = starttime.format("hh:mm A");
            this.addAppointmentRef.current.appointmentDate = starttime.format(
                "DD-MM-Y"
            );
            this.addAppointmentRef.current.appointmentHour = starttime.format("H:mm");
            this.addAppointmentRef.current.selectedTime =
                starttime.format("MM-DD-Y") + " " + starttime.format("hh:mm A");
            //set client

            this.addAppointmentRef.current.clientName = String.prototype.trim.call(filter_express.client_full_name);
            let x = filter_express;
            if (typeof x.phone != 'undefined' && x.phone != '' && x.phone != null) {
                let displayPhone = formatPhone(x.phone)
                if (this.userData.role == 9) {
                    let displayphoneSplit = displayPhone.split('-');
                    if (displayphoneSplit.length > 1) {
                        displayPhone = '(xxx) xxx-' + displayphoneSplit[1];
                    }
                }
                this.addAppointmentRef.current.clientName = x.client_full_name + " - " + displayPhone;

            } else if (typeof x.email != 'undefined' && x.email != '' && x.email != null) {
                this.addAppointmentRef.current.clientName = x.fullname + " - " + x.email;
            }

            this.addAppointmentRef.current.selectedClient = filter_express.clientid
            if (this.isTabDay) {
                this.addAppointmentRef.current.selectedTechnician = key;
                let selectedTech = this.technicians.first(function (item) {
                    return item.id == key;
                });
                this.addAppointmentRef.current.technicianName = selectedTech.fullname;
                let services = collect(this.services);
                let serviceSkill = this.services;
                if (typeof selectedTech.skillsToServices != 'undefined') {
                    serviceSkill = services.whereIn('idDefault', selectedTech.skillsToServices).toArray();
                }
                this.addAppointmentRef.current.propsServices = serviceSkill;
            } else {
                this.addAppointmentRef.current.propsServices = this.services;
                this.addAppointmentRef.current.selectedDate = moment(key);
                let dayname = moment(key).format("dddd").toLowerCase();
                let availablehours = this.availablehours[dayname];
                if (availablehours.length) {
                    this.addAppointmentRef.current.selectedHour = availablehours[0];
                    this.addAppointmentRef.current.appointmentDate = moment(
                        key
                    ).format("DD-MM-Y");
                    this.addAppointmentRef.current.appointmentHour = this.convertTo24Hour(availablehours[0]);
                    this.addAppointmentRef.current.selectedTime =
                        moment(key).format("MM-DD-Y") + " " + availablehours[0];
                }
            }

            //load turn
            this.addAppointmentRef.current.turns = [];
            if (this.userData.isManageTurn) {
                this.addAppointmentRef.current.turns = await fetchTurns(this.token);
                this.addAppointmentRef.current.isShowLoaderAppointmentDetails = false;
            }
            this.addAppointmentRef.current.setState({
                modalVisible: true,
                appointmentId: 0
            });
        } else {
            Alert.alert('Error', 'Not found express check-in');
        }


    };


    async _onPressAppointment(id, type) {
        if (type == 'express') {
            this.add_express_Appointment(id);
        } else {
            this.addAppointmentRef.current.showLoaderAppointmentDetail();
            this.token = await jwtToken();
            let AppointmentDetails = await getAppointmentDetails(this.token, id);
            this.addAppointmentRef.current.propsServices = this.services;
            //set technician
            this.addAppointmentRef.current.isRequested = AppointmentDetails.isRequested;
            this.addAppointmentRef.current.Description = AppointmentDetails.Description;
            this.addAppointmentRef.current.selectedTechnician =
                AppointmentDetails.technician_id;
            this.addAppointmentRef.current.technicianName =
                AppointmentDetails.technician_fullname;
            //set time
            let starttime = moment(AppointmentDetails.start_time);
            this.addAppointmentRef.current.selectedDate = starttime;
            this.addAppointmentRef.current.selectedHour = starttime.format("hh:mm A");
            this.addAppointmentRef.current.appointmentDate = starttime.format(
                "DD-MM-Y"
            );
            this.addAppointmentRef.current.appointmentHour = starttime.format("H:mm");
            let name = '';
            if (AppointmentDetails.client.fullname != null) {
                name = AppointmentDetails.client.fullname
            } else {
                name = AppointmentDetails.client.firstname != null ? AppointmentDetails.client.firstname : '';
                name + AppointmentDetails.client.lastname != null ? AppointmentDetails.client.lastname : '';
            }
            this.addAppointmentRef.current.selectedTime = starttime.format("MM-DD-Y") + " " + starttime.format("hh:mm A");
            //set client
            this.addAppointmentRef.current.clientName = String.prototype.trim.call(name);
            let x = AppointmentDetails.client;
            if (typeof x.phone != 'undefined' && x.phone != '' && x.phone != null) {
                let displayPhone = formatPhone(x.phone)
                if (this.userData.role == 9) {
                    let displayphoneSplit = displayPhone.split('-');
                    if (displayphoneSplit.length > 1) {
                        displayPhone = '(xxx) xxx-' + displayphoneSplit[1];
                    }
                }
                this.addAppointmentRef.current.clientName = name + " - " + displayPhone;
            } else if (typeof x.email != 'undefined' && x.email != '' && x.email != null) {
                this.addAppointmentRef.current.clientName = name + " - " + x.email;
            }

            this.addAppointmentRef.current.selectedClient =
                AppointmentDetails.client.id;
            //set Status
            this.addAppointmentRef.current.statusName = collect(
                this.listAppointmentStatus
            ).first(function (item) {
                return item.id == AppointmentDetails.status;
            }).title;
            this.addAppointmentRef.current.selectedStatus = AppointmentDetails.status;
            //set services
            this.addAppointmentRef.current.selectServices = {};
            let serviceList = collect(this.services);
            let _this = this;
            let countService = 0;
            AppointmentDetails.services.map((dataservice, i) => {
                let servicedata = serviceList.first(function (item) {
                    return item.id == 'service_' + dataservice.service_id;
                });
                let techName = getTextByKey(this.languageKey, 'selecttechnicianappointment');
                let technicianData = this.techniciansWithSearch.filter(function (itemTech) {
                    return itemTech.id == dataservice.technicianId;
                });
                if (technicianData.length) {
                    techName = technicianData[0].fullname;
                }

                let service = {
                    id: 'service_' + dataservice.service_id,
                    service_name: servicedata.service_name,
                    price: dataservice.price,
                    technicianId: dataservice.technicianId,
                    technicianName: techName,
                    duration: servicedata.duration,
                    rewardpoint: servicedata.rewardpoint,
                    isCombo: false,
                    appointment_service_id: dataservice.appointment_service_id
                };
                _this.addAppointmentRef.current.selectServices[
                    "service_" + countService
                ] = service;
                countService++;
            });
            AppointmentDetails.combos.map((dataservice, i) => {
                let comboname = '';
                let rewardpoint = 0;
                let combodata = this.combos.filter(function (item) {
                    return item.id == dataservice.comboid;
                });
                if (combodata.length) {
                    comboname = combodata[0].comboname;
                    rewardpoint = combodata[0].rewardpoint;
                }
                let service = {
                    id: 'combo_' + dataservice.comboid,
                    service_name: comboname,
                    price: dataservice.price,
                    technicianId: 0,
                    technicianName: '',
                    duration: 0,
                    rewardpoint: rewardpoint,
                    isCombo: true,
                    appointment_combo_id: dataservice.appointment_combo_id
                };

                service.servicesIncombo = dataservice.servicesInCombo;

                service.servicesIncombo.forEach(function (itemService) {
                    itemService.sp_combo_id = dataservice.comboid;
                    let serviceCombo = serviceList.first(function (serviceData) {
                        return serviceData.id == 'service_' + itemService.serviceid;
                    });

                    let techName = getTextByKey(this.languageKey, 'selecttechnicianappointment');
                    let technicianData = _this.techniciansWithSearch.filter(function (itemTech) {
                        return itemTech.id == itemService.technicianId;
                    });
                    if (technicianData.length) {
                        techName = technicianData[0].fullname;
                    }

                    if (serviceCombo) {
                        itemService.servicename = serviceCombo.service_name;
                        itemService.duration = serviceCombo.duration;
                        itemService.price = itemService.price;
                        itemService.technicianId = itemService.technicianId;
                        itemService.technicianName = techName;
                        itemService.appointment_service_id = itemService.appointment_service_id
                    }
                })

                //console.log(service);
                _this.addAppointmentRef.current.selectServices[
                    "service_" + countService
                ] = service;
                countService++;

            });

            _this.addAppointmentRef.current.btnAddServiceRef.current.setState({
                isShowPlusService: true,
                count: countService
            });

            this.addAppointmentRef.current.AppointmentSelectedServiceRef.current.setState({
                selectServices: this.addAppointmentRef.current.selectServices
            });
            this.addAppointmentRef.current.couponRef.current.setState({
                DataserviceSelect: this.addAppointmentRef.current.selectServices
            });
            //set payments
            this.addAppointmentRef.current.payments = AppointmentDetails.payments;
            this.addAppointmentRef.current.newPaymentAnimation = "slide";
            this.addAppointmentRef.current.total = AppointmentDetails.total;
            this.addAppointmentRef.current.remaining =
                AppointmentDetails.remaining_payment;
            this.addAppointmentRef.current.paid_total = AppointmentDetails.paid_total;
            this.addAppointmentRef.current.isShowLoaderAppointmentDetails = false;
            this.addAppointmentRef.current._onGetCoupon();
            this.addAppointmentRef.current.setState({
                modalVisible: true,
                appointmentId: id
            });
        }

    }

    async _onViewAppointment(id) {
        this.addAppointmentRef.current.showLoaderAppointmentDetail();
        this.token = await jwtToken();
        let AppointmentDetails = await getAppointmentDetails(this.token, id);
        //set time
        let starttime = moment(AppointmentDetails.start_time);

        this.addAppointmentRef.current.selectedTime =
            starttime.format("MM-DD-Y") + " " + starttime.format("hh:mm A");
        //set client
        this.addAppointmentRef.current.clientName = String.prototype.trim.call(AppointmentDetails.client.fullname);
        let x = AppointmentDetails.client;
        if (typeof x.phone != 'undefined' && x.phone != '' && x.phone != null) {
            let displayPhone = formatPhone(x.phone)
            if (this.userData.role == 9) {
                let displayphoneSplit = displayPhone.split('-');
                if (displayphoneSplit.length > 1) {
                    displayPhone = '(xxx) xxx-' + displayphoneSplit[1];
                }
            }
            this.addAppointmentRef.current.clientName = displayPhone;
        } else if (typeof x.email != 'undefined' && x.email != '' && x.email != null) {
            this.addAppointmentRef.current.clientName = x.email;
        }


        //set Status
        this.addAppointmentRef.current.statusName = collect(
            this.listAppointmentStatus
        ).first(function (item) {
            return item.id == AppointmentDetails.status;
        }).title;

        //set services
        this.addAppointmentRef.current.selectServices = {};
        let serviceList = collect(this.services);
        let _this = this;
        let countService = 0;
        AppointmentDetails.services.map((dataservice, i) => {
            let servicedata = serviceList.first(function (item) {
                return item.id == 'service_' + dataservice.service_id;
            });
            let techName = getTextByKey(this.languageKey, 'selecttechnicianappointment');
            let technicianData = this.techniciansWithSearch.filter(function (itemTech) {
                return itemTech.id == dataservice.technicianId;
            });
            if (technicianData.length) {
                techName = technicianData[0].fullname;
            }

            let service = {
                id: 'service_' + dataservice.service_id,
                service_name: servicedata.service_name,
                price: dataservice.price,
                technicianId: dataservice.technicianId,
                technicianName: techName,
                duration: servicedata.duration,
                rewardpoint: servicedata.rewardpoint,
                isCombo: false,
                appointment_service_id: dataservice.appointment_service_id
            };
            _this.addAppointmentRef.current.selectServices[
                "service_" + countService
            ] = service;
            countService++;
        });

        AppointmentDetails.combos.map((dataservice, i) => {
            let comboname = '';
            let rewardpoint = 0;
            let combodata = this.combos.filter(function (item) {
                return item.id == dataservice.comboid;
            });

            if (combodata.length) {
                comboname = combodata[0].comboname;
                rewardpoint = combodata[0].rewardpoint;
            }

            let service = {
                id: 'combo_' + dataservice.comboid,
                service_name: comboname,
                price: dataservice.price,
                technicianId: 0,
                technicianName: '',
                duration: 0,
                rewardpoint: rewardpoint,
                isCombo: true,
                appointment_combo_id: dataservice.appointment_combo_id
            };

            service.servicesIncombo = dataservice.servicesInCombo;
            service.servicesIncombo.forEach(function (itemService) {
                itemService.sp_combo_id = dataservice.comboid;
                let serviceCombo = serviceList.first(function (serviceData) {
                    return serviceData.id == 'service_' + itemService.serviceid;
                });

                let techName = getTextByKey(this.languageKey, 'selecttechnicianappointment');
                let technicianData = _this.techniciansWithSearch.filter(function (itemTech) {
                    return itemTech.id == itemService.technicianId;
                });
                if (technicianData.length) {
                    techName = technicianData[0].fullname;
                }

                if (serviceCombo) {
                    itemService.servicename = serviceCombo.service_name;
                    itemService.duration = serviceCombo.duration;
                    itemService.price = itemService.price;
                    itemService.technicianId = itemService.technicianId;
                    itemService.technicianName = techName;
                    itemService.appointment_service_id = itemService.appointment_service_id
                }
            })
            _this.addAppointmentRef.current.selectServices[
                "service_" + countService
            ] = service;
            countService++;

        });

        this.addAppointmentRef.current.AppointmentSelectedServiceRef.current.setState({
            selectServices: this.addAppointmentRef.current.selectServices
        });
        // if(typeof(this.addAppointmentRef.current.refs.AppointmentSelectedServiceRef.current) != 'undefined'){
        //     this.addAppointmentRef.current.refs.AppointmentSelectedServiceRef.current.setState({
        //         selectServices: this.addAppointmentRef.current.selectServices
        //     });
        // }else{
        //     setTimeout(function() {
        //         this.addAppointmentRef.current.refs.AppointmentSelectedServiceRef.current.setState({
        //             selectServices: this.addAppointmentRef.current.selectServices
        //         });
        //     }, 100);
        // }

        //set payments
        this.addAppointmentRef.current.isShowLoaderAppointmentDetails = false;
        this.addAppointmentRef.current.setState({
            modalVisible: true,
            appointmentId: id
        });
    }

    convertTo24Hour(time) {
        time = time.toLowerCase();
        var hours = time.substr(0, 2);
        if (time.indexOf("am") != -1 && hours == 12) {
            time = time.replace("12", "0");
        }
        if (time.indexOf("pm") != -1 && parseInt(hours) < 12) {
            time = time.replace(hours, parseInt(hours) + 12);
        }
        return time.replace(/(am|pm)/, "");
    }

    calendarStripHeaderPress = () => {
        this.modalCalendarByWeekRef.current.show(
            this.CalendarStripByWeekRef.current.getSelectedDate()
        );
    };

    calendarHeader = title => {
        return (
            <CalendarStripHeader
                onPress={this.calendarStripHeaderPress}
                headerTitle={title}
                toDayOnPress={this.toDayWeek}
                language={this.languageKey}
            />
        );
    };

    onSelectDateModalByWeek = date => {
        this.focusedDay = moment(date).clone();
        this.byDayDate = moment(date).clone();
        this.startDateWeek = this.focusedDay.clone().startOf("week");
        this.endDateWeek = this.focusedDay.clone().endOf("week");
        this.displayAppointmentByWeek(true);
    };

    calendarStripSelectedDate = date => {
        this.focusedDay = date.clone();
        this.byDayDate = date.clone();
        this.displayAppointmentByWeek(true, false);
    };

    SaveAppointmentSuccess = (appointmentId, data) => {
        this.addAppointmentRef.current.close();
        this.fetchMonthData();
        // this.refreshData(
        //     moment(data.start_time),
        //     appointmentId,
        //     data
        // );
        // if (
        //     this.isTabDay &&
        //     this.byDayDate.isSame(moment(data.start_time), "day")
        // ) {
        //     this.displayAppointmentByDay(true);
        // } else {

        //     this.focusedDay = moment(data.start_time);
        //     this.byDayDate = moment(data.start_time).clone();
        //     this.startDateWeek = this.focusedDay.clone().startOf("week");
        //     this.endDateWeek = this.focusedDay.clone().endOf("week");
        //     if (this.isTabDay) {
        //         this.tabAppointmentRef.current.goToPage(1);
        //     }
        //     this.displayAppointmentByWeek(true);
        // }
    };

    refreshData = (starttime, appointmentId, appointmentDataFormat) => {
        let YMD = starttime.format("YYYY-MM-DD");
        console.log('appointmentId', appointmentId);
        if (typeof this.loadedMonths[YMD] != "undefined") {
            if (Platform.OS === 'ios') {
                if (appointmentId == 0) {
                    this.loadedMonths[YMD] = collect([
                        ...this.loadedMonths[YMD]
                    ]).push(appointmentDataFormat);
                    console.log('typeof', this.loadedMonths)
                } else {
                    this.loadedMonths[YMD] = collect([
                        ...this.loadedMonths[YMD]
                    ]).reject(function (item) {
                        return item.id == appointmentId;
                    });
                    this.loadedMonths[YMD] = collect([
                        ...this.loadedMonths[YMD]
                    ]).push(appointmentDataFormat);
                }
            } else {
                if (appointmentId == 0) {
                    this.loadedMonths[YMD] = this.loadedMonths[YMD].push(appointmentDataFormat);
                } else {
                    this.loadedMonths[YMD] = this.loadedMonths[YMD].reject(function (item) {
                        return item.id == appointmentId;
                    });
                    this.loadedMonths[YMD] = this.loadedMonths[YM].push(appointmentDataFormat);
                }
            }
        }
    };

    render() {
        if (this.state.appIsReady) {
            return (
                <View style={styles.container}>
                    <ScrollableTabView
                        renderTabBar={() => <DefaultTabBar />}
                        onChangeTab={this.changeTab}
                        locked={true}
                        ref={this.tabAppointmentRef}
                    >
                        <View tabLabel={getTextByKey(this.languageKey, 'byday')} style={{ flex: 1 }}>
                            <AppointmentSelectDay
                                changeDate={this.changeDate}
                                today={this._today}
                                isToday={this.isToday}
                                byDayText={this.byDayText}
                                ref={this.AppointmentSelectDayRef}
                                language={this.languageKey}
                                search_appointment_by_day={this._search_appointment_by_day}
                                isCalendar={true}
                            />
                            <View style={styles.tabContents}>
                                <AppointmentListByDay
                                    ref={this.AppointmentListByDayRef}
                                    visible={false}
                                    addAppointment={async (key) => { await this.addAppointment(key) }}
                                    byday={true}
                                    bylist={false}
                                    sectiondata={this.technicians}
                                    data={this.appointmentsByDay}
                                    propsdata={this.appointmentsByDay}
                                    userData={this.userData}
                                    token={this.token}
                                    onPressItem={async (id, type) => {
                                        await this._onPressAppointment(id, type);
                                    }}
                                    onViewItem={async id => {
                                        await this._onViewAppointment(id);
                                    }}
                                    refresh={this.refreshData}
                                    language={this.languageKey}
                                />
                            </View>
                        </View>
                        <View tabLabel={getTextByKey(this.languageKey, 'byweek')} style={{ flex: 1 }}>
                            <View style={styles.calendarcontainer}>
                                <CalendarStrip
                                    startingDate={this.startDateWeek.clone()}
                                    useIsoWeekday={false}
                                    calendarHeaderFormat="MMM Y"
                                    style={{ flex: 1 }}
                                    dateNameStyle={styles.dateNameStyle}
                                    dateNumberStyle={styles.dateNumberStyle}
                                    dateNumberStyleText={
                                        styles.dateNumberStyleText
                                    }
                                    calendarHeaderStyle={
                                        styles.calendarHeaderStyle
                                    }
                                    selectedDate={this.focusedDay.clone()}
                                    highlightDateNameStyle={styles.selectedDate}
                                    highlightDateNumberStyle={
                                        styles.highlightDateNumberStyle
                                    }
                                    highlightDateNumberStyleText={
                                        styles.highlightDateNumberStyleText
                                    }
                                    calendarHeader={this.calendarHeader}
                                    ref={this.CalendarStripByWeekRef}
                                    onDateSelected={
                                        this.calendarStripSelectedDate
                                    }
                                    onWeekChanged={this.changeWeek}
                                />
                            </View>
                            <View style={styles.tabContents}>
                                <AppointmentListByWeek
                                    ref={this.AppointmentListByWeekRef}
                                    addAppointment={async (key) => { await this.addAppointment(key) }}
                                    visible={false}
                                    byday={false}
                                    sectiondata={this.technicians}
                                    data={this.appointmentsByWeek}
                                    userData={this.userData}
                                    token={this.token}
                                    onPressItem={async id => {
                                        await this._onPressAppointment(id);
                                    }}
                                    onViewItem={async id => {
                                        await this._onViewAppointment(id);
                                    }}
                                    refresh={this.refreshData}
                                    language={this.languageKey}
                                />
                            </View>
                        </View>
                        <View tabLabel='List' style={{ flex: 1 }}>
                            {/* <AppointmentSelectDay
                                changeDate={this.changeDateList}
                                today={this._todaylist}
                                isToday={this.isToday}
                                byDayText={this.byDayText}
                                ref={this.AppointmentSelectDayListRef}
                                language={this.languageKey}
                            /> */}
                            <View style={styles.tabContents}>
                                <AppointmentListByDay
                                    ref={this.AppointmentListByDayListRef}
                                    visible={false}
                                    addAppointment={async (key) => { await this.changestatus(key) }}
                                    byday={true}
                                    sectiondata={this.technicians}
                                    data={this.appointmentsByDayList}
                                    propsdata={this.appointmentsByDayList}
                                    bylist={true}
                                    userData={this.userData}
                                    token={this.token}
                                    onPressItem={async (id, type) => {
                                        await this._onPressAppointment(id, type);
                                    }}
                                    onViewItem={async id => {
                                        await this._onViewAppointment(id);
                                    }}
                                    refresh={this.refreshData}
                                    language={this.languageKey}
                                    byDayDate={this.byDayDate}
                                />
                            </View>
                        </View>
                    </ScrollableTabView>

                    <ModalNotification ref={this.modalNotificationRef} onPress={this.onPressNotificationItem} language={this.languageKey} token={this.token} />
                    <AddAppointment
                        clients={this.clients}
                        technicians={this.techniciansWithSearch}
                        title={this.addAppointmentTitle}
                        ref={this.addAppointmentRef}
                        availablehours={this.availablehours}
                        selectServices={this.selectServices}
                        token={this.token}
                        services={this.services}
                        listStatus={this.listAppointmentStatusForCreate}
                        SaveAppointmentSuccess={this.SaveAppointmentSuccess}
                        deviceid={this.deviceid}
                        userData={this.userData}
                        combos={this.combos}
                        categories={this.categories}
                        language={this.languageKey}
                        timezone={this.timezone}
                    />
                    <ModalCalendar
                        ref={this.modalCalendarByWeekRef}
                        onPress={this.onSelectDateModalByWeek}
                    />
                    <SpinnerLoader
                        visible={false}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={color.white}
                        textContent={getTextByKey(this.languageKey, 'loadingappointment')}
                        color={Colors.spinnerLoaderColor}
                        ref={this.tabappointmentloaderRef}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <SpinnerLoader
                        visible={true}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={"transparent"}
                        textContent={getTextByKey(this.languageKey, 'loadingappointment')}
                        color={Colors.spinnerLoaderColor}
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white
    },
    mainTab: {
        backgroundColor: "red"
    },
    tabContents: {
        flex: 1
    },
    bydaytext: {
        fontSize: 18
    },
    calendarcontainer: {
        height: 93,
        paddingTop: 10,
        paddingBottom: 0,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder
    },
    dateNameStyle: {
        color: color.blackish,
        fontWeight: "normal",
        fontSize: 14
    },
    dateNumberStyle: {
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    dateNumberStyleText: {
        color: color.blackish,
        fontWeight: "normal",
        fontSize: 14
    },
    calendarHeaderStyle: {
        color: color.blackish,
        fontWeight: "normal",
        fontSize: 16
    },
    selectedDate: {
        color: color.reddish,
        fontWeight: "normal",
        fontSize: 14
    },
    highlightDateNumberStyle: {
        width: 24,
        height: 24,
        borderRadius: 24,
        backgroundColor: color.reddish,

        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    highlightDateNumberStyleText: {
        color: color.white,
        fontSize: 14,
        fontWeight: "normal"
    }
});
