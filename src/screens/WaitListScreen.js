import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Platform,
    AsyncStorage
} from "react-native";
import layout from "../assets/styles/layout";
import Colors from "../constants/Colors";
import SpinnerLoader from "../helpers/spinner";
import {
    fetchTechniciansData,
    fetchAppointmentsWaitList,
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
import AppointmentByDateWaitlist from "../components/AppointmentByDateWaitlist";
import AppointmentListByWeek from "../components/AppointmentList";
//import CalendarStrip from "../components/CalendarStrip";
import CalendarStrip from "react-native-calendar-strip";
import AddAppointment from "../components/AddAppointment";
import ViewAppointment from "../components/ViewAppointment";
import CalendarStripHeader from "../components/CalendarStripHeader";
import ModalCalendar from "../components/ModalCalendar";
import ModalNotification from "../components/ModalNotification";
import { getListAppointmentStatus, getListAppointmentStatusForCreate } from "../helpers/Utils";
import { getAppointmentDetails } from "../api/getAppointmentDetails";
import { formatPhone, get_time_zone, getUSState2Digit } from "../helpers/Utils";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";
export default class WaitListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.tabAppointmentRef = React.createRef();
        this.AppointmentSelectDayRef = React.createRef();
        this.AppointmentListByDayRef = React.createRef();
        this.CalendarStripByWeekRef = React.createRef();
        this.AppointmentListByWeekRef = React.createRef();
        this.modalNotificationRef = React.createRef();
        this.addAppointmentRef = React.createRef();
        this.modalCalendarByWeekRef = React.createRef();
        this.tabappointmentloaderRef = React.createRef();
        
    }
    componentDidMount() {
        this.props.navigation.setOptions({
            headerTitle: "Wait List",
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

    languageKey = typeof(this.props.route.params.language) != 'undefined' ? this.props.route.params.language : 'en-US';
    token = "";
    deviceid = 0;
    isLoggedIn = false;
    currentYM = moment.utc().format("YMM");
    loadedMonths = {};
    today = moment();
    byDayDate = moment();
    technicians = [];
    techniciansWithSearch = [];
    clients = [];
    availablehours = [];
    appointments = [];
    appointmentsByDay = [];
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
    newAppointmentTitle = getTextByKey(this.languageKey,'newappointmenttitle');
    addAppointmentTitle = this.newAppointmentTitle;
    isToday = true;
    byDayText = moment().format("ll");
    state = {
        appIsReady: false
    };
    focusedDay = moment();
    userData = {};
    isLoadedAppointment = false;
    appointmentPushDataId = 0;
    categories = [];
    turns = [];
    ExpressCheckin = [];
    liststatus = ['pending','confirmed','completed','canceled'];
    stateData = '';
    timezone = '';

    
    UNSAFE_componentWillUnmount() {
        this._notificationSubscription &&
            this._notificationSubscription.remove();
    }
    /*
    componentDidMount() {
        this._notificationSubscription = Notifications.addListener(
            this._handleNotification
        );
    }*/
    onRefreshWaitlist = (topic) =>{
        this.onRefreshAppointment();
    }

      

    async UNSAFE_componentWillMount() {
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn) {
            this.token = await jwtToken();
            this.userData = await getUserData();
            this.deviceid = await getDeviceId();

            this.languageKey = await getLanguage();
            this.stateData = getUSState2Digit(this.userData.state);
            this.timezone = get_time_zone('US',this.stateData);
            this.byDayDate = moment().tz(this.timezone);
            /*
            this.stateData = getUSState2Digit(this.userData.state);
            this.timezone = get_time_zone('US',this.stateData);
            this.startDateWeek = moment().tz(this.timezone).startOf('week');
            this.focusedDay = moment().tz(this.timezone);*/

            //console.log(this.userData);
            //fetch technicians
            let TechniciansData = [];
            let TechniciansDataNav = [];

            //TechniciansData = await fetchTechniciansData(this.token);

            if (this.userData.role == 4) {
                TechniciansData = await fetchTechniciansData(this.token);
                TechniciansDataNav = [...TechniciansData];
                this.technicians = collect(TechniciansData);
                let allTechnician = {
                    id: 0,
                    fullname: getTextByKey(this.languageKey,'anytech'),
                    picture: ''
                };
                TechniciansData.splice(0, 0, allTechnician);

                this.techniciansWithSearch = TechniciansData;

                let allTechnicianNav = {
                    id: 0,
                    fullname: getTextByKey(this.languageKey,'anytechnav'),
                    picture: ''
                };
                TechniciansDataNav.splice(0, 0, allTechnicianNav);
            } else {
                this.filter.technician = this.userData.id;
                let techDefault = {};
                techDefault.id = this.userData.id;
                techDefault.firstname = this.userData.firstname;
                techDefault.lastname = this.userData.lastname;
                techDefault.fullname = this.userData.fullname;
                TechniciansData.push(techDefault);
                this.technicians = collect(TechniciansData);
                this.techniciansWithSearch = TechniciansData;

                TechniciansDataNav = [...TechniciansData];
            }

            // this.props.route.params.onSelectTechnician = this.onSelectTechnician;
            // this.props.route.params.onRefreshAppointment = this.onRefreshAppointment;
            // this.props.route.params.onPressNotificationAppointment = this.onPressNotificationAppointment;
            // this.props.route.params.badge = 0;
            // this.props.route.config.navigationBar.visible = true;
            // this.props.navigator.updateCurrentRouteParams({
            //     technicianList: TechniciansDataNav
            // });

            
            /*
            //load turn
            if(this.userData.isManageTurn){
                this.turns = await fetchTurns(this.token);
                console.log(this.turns);
            }*/
            
            //fetch appointment
            var appointmentsData = await fetchAppointmentsWaitList(
                this.token,
                this.currentYM
            );
            var appointments = appointmentsData.appointments;
            this.ExpressCheckin = appointmentsData.expresscheckin;
            let _this = this;
            appointments.forEach(function(appointment){
                if(appointment.id.toString().indexOf("exp") >= 0){
                    appointment.client = appointment.client_full_name + " - " + appointment.phone;
                    appointment.resourceIds = ["0"];
                    appointment.services = [];
                }else{
                    appointment.status = _this.liststatus[appointment.status];
                    var clientdata = appointmentsData.clients.filter(function (item) {
                        return item.schedulerid == appointment.id;
                    });
                    if(clientdata.length){
                        let x = clientdata[0];
                        appointment.client = String.prototype.trim.call(x.client_full_name);
    
                        if(typeof x.phone != 'undefined' && x.phone != '' && x.phone != null){
                            if(typeof x.client_full_name != 'undefined' && String.prototype.trim.call(x.client_full_name) != '' 
                                && x.client_full_name != null){
                                appointment.client += ' - ';
                            }
                            let displayPhone = formatPhone(x.phone);
                            if(_this.userData.role == 9){
                                let displayphoneSplit = displayPhone.split('-');
                                if(displayphoneSplit.length > 1){
                                    displayPhone = '(xxx) xxx-' + displayphoneSplit[1];
                                }       
                            }
                            appointment.client += displayPhone;
                        }else if(typeof x.email != 'undefined' && x.email != '' && x.email != null){
                            if(typeof x.client_full_name != 'undefined' && String.prototype.trim.call(x.client_full_name) != '' 
                                && x.client_full_name != null){
                                appointment.client += ' - ';
                            }
                            appointment.client += x.email;
                        }
                    }
        
                    var technician_datalist = appointmentsData.resources.filter(function (item) {
                        return item.schedulerid == appointment.id;
                    });
    
                    if(technician_datalist.length){
                        let technician_datagroups = collect(technician_datalist).groupBy('technicianId');
                        appointment.resourceIds = technician_datagroups.keys().toArray();
                    }
    
                    appointment.services = appointmentsData.services.filter(function (item) {
                        return item.schedulerid == appointment.id;
                    });
                    
                }
            });

            var collectAppointment = collect(appointments);
            this.loadedMonths[this.currentYM] = collectAppointment;
            if(Platform.OS === 'ios') {
                this.appointments = collect([...this.loadedMonths[this.currentYM]]);
             } else {
                this.customercheckins = this.loadedMonths[this.currentYM];
            } 
            this.isLoadedAppointment = true;

            //fetch clients
            this.clients = [];

            //fetch businesshours
            var businesshours = await fetchBusinesshours(this.token);
            this.availablehours = businesshours.available_hours;
            Object.keys(
                this.availablehours
            ).map((x, i) => {
                this.availablehours[x];
                if(typeof this.availablehours[x] != undefined && this.availablehours[x].length > 0){

                        let lasttimestr =  this.availablehours[x].pop(); 
                        let lasttime = parseInt(lasttimestr.split(":")[0]);
                        switch (lasttimestr.split(":")[1]){
                            case "00":
                            this.availablehours[x].push(parseInt(lasttime) + ":15");
                            this.availablehours[x].push(parseInt(lasttime) + ":30");
                            this.availablehours[x].push(parseInt(lasttime) + ":45");
                            break;
                            case "15":
                            this.availablehours[x].push(parseInt(lasttime) + ":30");
                            this.availablehours[x].push(parseInt(lasttime) + ":45");
                            break;
                            case "30":
                            this.availablehours[x].push(parseInt(lasttime) + ":45");
                            break;
                        }
                        for(let i=0;i<2;i++){
                          lasttime += 1;
                          if(lasttime < 22){
                            this.availablehours[x].push(parseInt(lasttime) + ":00");
                            this.availablehours[x].push(parseInt(lasttime) + ":15");
                            this.availablehours[x].push(parseInt(lasttime) + ":30");
                            this.availablehours[x].push(parseInt(lasttime) + ":45");
                          }
                        }
                      
                }

            })
            //fetch combos
            this.combos = await fetchListCombo(this.token);

            //fetch services
            this.services = await fetchServices(this.token);
            this.services.forEach(function(item){
                item.isCombo = false;
                item.id = 'service_' + item.id;      
                
                let category = _this.categories.filter(function(itemCategory){
                    if(typeof(item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != ''){
                        return itemCategory == item.category_customname;
                    }else{
                        return itemCategory == item.category_name;
                    }
                    
                });
                if(!category.length){
                    if(typeof(item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != ''){
                        _this.categories.push(item.category_customname);    
                    }else{
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

            /*
            this.categories.forEach(function(item){
                console.log(item);        
            })*/

            /*
                let sectionAppointment = {};
                sectionAppointment.key = item.id;
                sectionAppointment.data = this.getAppointmentDataByTechnicianId(item.id,appointmentsCurrentSelectedDay);
                this.appointmentsByDay.push(sectionAppointment);
            */
            
            
            this.combos.forEach(function(item){
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
                service_name: getTextByKey(this.languageKey,'selectserviceappointment'),
                price: 0,
                technicianId: 0,
                technicianName: getTextByKey(this.languageKey,'selecttechnicianappointment'),
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
            this.props.navigator.push("login");
        }
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

        setTimeout(function() {
            _this.tabAppointmentRef.current.goToPage(1);
        }, 0);

    }
    getAppointmentDataByTechnicianId = (techId,appointmentsCurrentSelectedDay) => {
        let sectionAppointment = {};
        sectionAppointment.key = techId;
        let apptsByTech = appointmentsCurrentSelectedDay.filter(
            function(itemAppt) {
                if(typeof(itemAppt.resourceIds) != "undefined"){
                    let isExists = itemAppt.resourceIds.filter(function(itemTech){
                        return itemTech == techId;           
                    })
                    return isExists.length;
                }else{
                    return 0;
                }

            }
        );
        if(apptsByTech.count()){
            return apptsByTech.toArray();        
        }else{
            return [{ id: 0 }];
        }
    }

    displayAppointmentByDay = (isRefresh = true, isRefreshDay = true) => {
        this.appointmentsByDay = [];
        var startTimeCurrentSelectedDate =
            this.byDayDate.format("Y-MM-DD") + " 00:00:00";
        var endTimeCurrentSelectedDate =
            this.byDayDate.format("Y-MM-DD") + " 23:59:59";

        let YM = this.byDayDate.format("YMM");
        if(Platform.OS === 'ios') {
            this.appointments = collect([...this.loadedMonths[YM]]);
         } else {
            this.appointments = this.loadedMonths[YM];
        } 
        var appointmentsCurrentSelectedDay = this.appointments
            .where("start_time", ">", startTimeCurrentSelectedDate)
            .where("start_time", "<", endTimeCurrentSelectedDate);


        appointmentsCurrentSelectedDay = appointmentsCurrentSelectedDay.sortBy(
            "checkInNumber"
        );
    
        let apptTechExists = [];   
        let _this = this;
        //console.log(this.filter.technician);
        if (this.filter.technician > 0){
            let sectionAppointment = {};
            sectionAppointment.key = this.filter.technician;
            sectionAppointment.data =this.getAppointmentDataByTechnicianId(this.filter.technician,appointmentsCurrentSelectedDay);
            this.appointmentsByDay.push(sectionAppointment);
        }else{
            this.technicians.map((item,i) => {
                //ignore any technician
                /*
                if(item.id > 0){
                    
                }*/
                let sectionAppointment = {};
                sectionAppointment.key = item.id;
                sectionAppointment.data = this.getAppointmentDataByTechnicianId(item.id,appointmentsCurrentSelectedDay);

                this.appointmentsByDay.push(sectionAppointment);
                
            })
        }

        if (isRefresh) {
            if (this.AppointmentListByDayRef.current != null) {
                
                this.AppointmentListByDayRef.current.setState({
                    visible: true,
                    byday: true,
                    data: this.appointmentsByDay
                });
            }
        }
    };

    async displayAppointmentByWeek(isRefresh = true, isRefreshStrip = true) {
        let _this = this;
        this.appointmentsByWeek = [];
        var startTimeCurrentSelectedDate =
            this.startDateWeek.format("Y-MM-DD") + " 00:00:00";
        var endTimeCurrentSelectedDate =
            this.endDateWeek.format("Y-MM-DD") + " 23:59:59";
        let YMStart = this.startDateWeek.format("YMM");
        let YMEnd = this.endDateWeek.format("YMM");
        if (YMStart != YMEnd) {
            this.tabappointmentloaderRef.current.setState({ visible: true });
            if (typeof this.loadedMonths[YMStart] == "undefined") {
                var appointmentsData = await fetchAppointmentsWaitList(this.token, YMStart);
                var appointments = this.fillData(appointmentsData);
                this.loadedMonths[YMStart] = collect(appointments);
            }

            if (typeof this.loadedMonths[YMEnd] == "undefined") {
                var appointmentsData = await fetchAppointmentsWaitList(this.token, YMEnd);
                var appointments = this.fillData(appointmentsData);
                this.loadedMonths[YMEnd] = collect(appointments);
            }
            if(Platform.OS === 'ios') {
                this.appointments = collect([...this.loadedMonths[YMStart]]);
             } else {
                this.appointments = this.loadedMonths[YMStart];
            } 
            this.loadedMonths[YMEnd].each(function(item) {
                _this.appointments.push(item);
            });
            this.tabappointmentloaderRef.current.setState({ visible: false });
        } else {
            if(Platform.OS === 'ios') {
                this.appointments = collect([...this.loadedMonths[YMStart]]);
             } else {
                this.appointments = this.loadedMonths[YMStart];
            } 
        }
        var appointmentsCurrentSelectedWeek = this.appointments
            .where("start_time", ">", startTimeCurrentSelectedDate)
            .where("start_time", "<", endTimeCurrentSelectedDate);
        if (this.filter.technician > 0) {
            var currentSelectedTechnician = this.filter.technician;
            appointmentsCurrentSelectedWeek = appointmentsCurrentSelectedWeek.filter(
                function(item) {
                    let isExists = item.resourceIds.filter(function(itemTech){
                        return itemTech == currentSelectedTechnician;           
                    })
                    return isExists.length;
                    //return item.technician_id == currentSelectedTechnician;
                }
            );
            //console.log(appointmentsCurrentSelectedDay);
        }
        appointmentsCurrentSelectedWeek = appointmentsCurrentSelectedWeek.sortBy(
            "start_time"
        );
        appointmentsCurrentSelectedWeek = appointmentsCurrentSelectedWeek.groupBy(
            function(item, key) {
                return item.start_time.substring(0, 10);
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
                //console.log(startKey);
                //console.log(appointmentsByWeekData[startKey]);
            } else {
                //sectionAppointment.data = [];
                sectionAppointment.data = [{ id: 0 }];
            }
            this.appointmentsByWeek.push(sectionAppointment);
        }
        if (isRefreshStrip) {
            setTimeout(function() {
                _this.CalendarStripByWeekRef.current.setState({
                    selectedDate: _this.focusedDay.clone(),
                    startingDate: _this.focusedDay.clone().startOf("week")
                });
            }, 0);
        }
        if (isRefresh) {
            if (this.AppointmentListByWeekRef.current != null) {
                let sectionIndex = this.focusedDay.day();
                this.AppointmentListByWeekRef.current.setState({
                    visible: true,
                    byday: false,
                    data: this.appointmentsByWeek,
                    sectionIndex: sectionIndex,
                    itemIndex: 0
                });
            }
        }
    }

    fillData = (appointmentsData) => {
        let _this = this;
        let appointments = appointmentsData.appointments;
        appointments.forEach(function(appointment){
            if(appointment.id.toString().indexOf("exp") >= 0){
                appointment.client = appointment.client_full_name + " - " + appointment.phone;
                appointment.resourceIds = ["0"];
                appointment.services = [];
            }else{
                appointment.status = _this.liststatus[appointment.status];
                var clientdata = appointmentsData.clients.filter(function (item) {
                    return item.schedulerid == appointment.id;
                });
                if(clientdata.length){
                    let x = clientdata[0];
                    appointment.client = String.prototype.trim.call(x.client_full_name);
    
                    if(typeof x.phone != 'undefined' && x.phone != '' && x.phone != null){
                        if(typeof x.client_full_name != 'undefined' && String.prototype.trim.call(x.client_full_name) != '' 
                            && x.client_full_name != null){
                            appointment.client += ' - ';
                        }
                        let displayPhone = formatPhone(x.phone);
                        if(_this.userData.role == 9){
                            let displayphoneSplit = displayPhone.split('-');
                            if(displayphoneSplit.length > 1){
                                displayPhone = '(xxx) xxx-' + displayphoneSplit[1];
                            }       
                        }
                        appointment.client += displayPhone;
                    }else if(typeof x.email != 'undefined' && x.email != '' && x.email != null){
                        if(typeof x.client_full_name != 'undefined' && String.prototype.trim.call(x.client_full_name) != '' 
                            && x.client_full_name != null){
                            appointment.client += ' - ';
                        }
                        appointment.client += x.email;
                    }
                }
    
                var technician_datalist = appointmentsData.resources.filter(function (item) {
                    return item.schedulerid == appointment.id;
                });
    
                if(technician_datalist.length){
                    let technician_datagroups = collect(technician_datalist).groupBy('technicianId');
                    appointment.resourceIds = technician_datagroups.keys().toArray();
                }
    
                appointment.services = appointmentsData.services.filter(function (item) {
                    return item.schedulerid == appointment.id;
                });
            } 
        });
        return appointments;
    }

    onSelectTechnician = id => {
        this.filter.technician = id;
        if (this.isTabDay) {
            this.displayAppointmentByDay();
        }else{
            this.displayAppointmentByWeek();
        }
    };

    async fetchMonthData() {
        this.tabappointmentloaderRef.current.setState({ visible: true });

        var appointmentsData = await fetchAppointmentsWaitList(this.token, this.currentYM);
        var appointments = this.fillData(appointmentsData);

        var collectAppointment = collect(appointments);
        this.loadedMonths[this.currentYM] = collectAppointment;
        
        if(Platform.OS === 'ios') {
            this.appointments = collect([...this.loadedMonths[this.currentYM]]);
         } else {
            this.customercheckins = this.loadedMonths[this.currentYM];
        } 
        if (this.isTabDay) {
            this.displayAppointmentByDay(true, false);
        } else this.displayAppointmentByWeek(true);
        this.tabappointmentloaderRef.current.setState({ visible: false });
    }

    changeDate = option => {
        if (option == "prev") {
            this.byDayDate.subtract(1, "day");
            this.focusedDay.subtract(1, "day");
        } else {
            this.byDayDate.add(1, "day");
            this.focusedDay.add(1, "day");
        }
        let YM = this.byDayDate.format("YMM");
        if (typeof this.loadedMonths[YM] == "undefined") {
            this.currentYM = YM;
            this.fetchMonthData();
        } else {
            this.currentYM = YM;
            
            if(Platform.OS === 'ios') {
                this.appointments = collect([...this.loadedMonths[this.currentYM]]);
             } else {
                this.customercheckins = this.loadedMonths[this.currentYM];
            } 
            this.displayAppointmentByDay(true);
        }
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
            this.byDayDate = moment();
            this.focusedDay = moment();
            this.startDateWeek = this.focusedDay.clone().startOf("week");
            this.endDateWeek = this.focusedDay.clone().endOf("week");
            this.displayAppointmentByDay(true);
        }
    };

    toDayWeek = () => {
        if (!this.focusedDay.isSame(this.today, "day")) {
            this.byDayDate = moment();
            this.focusedDay = moment();
            this.startDateWeek = this.focusedDay.clone().startOf("week");
            this.endDateWeek = this.focusedDay.clone().endOf("week");
            this.displayAppointmentByWeek(true);
        }
    };

    changeTab = index => {
        if (index.i == 0) {
            if (!this.isTabDay) {
                this.isTabDay = true;
                this.displayAppointmentByDay(true);
            }
        } else {
            if (this.isTabDay) {
                this.isTabDay = false;
            }

            this.displayAppointmentByWeek(true);
        }
    };

    async addAppointment (key, clientexpress) {
        this.addAppointmentRef.current.showLoaderAppointmentDetail();
        //set technician
        this.addAppointmentRef.current.selectedTechnician = key;
        //set client
        let x = clientexpress;
        this.addAppointmentRef.current.clientName = String.prototype.trim.call(x.client_full_name);
        if(typeof x.phone != 'undefined' && x.phone != '' && x.phone != null){
            let displayPhone = formatPhone(x.phone)
            if(this.userData.role == 9){
                let displayphoneSplit = displayPhone.split('-');
                if(displayphoneSplit.length > 1){
                    displayPhone = '(xxx) xxx-' + displayphoneSplit[1];
                }       
            }
            this.addAppointmentRef.current.clientName = displayPhone;
        }else if(typeof x.email != 'undefined' && x.email != '' && x.email != null){
            this.addAppointmentRef.current.clientName = x.email;
        }    
        this.addAppointmentRef.current.selectedClient = x.clientid;
        //set Status
        this.addAppointmentRef.current.isShowLoaderAppointmentDetails = false;
        this.addAppointmentRef.current.setState({
            modalVisible: true,
            appointmentId: 0
        });
    };

    async _onPressAppointment(id) {
        this.addAppointmentRef.current.showLoaderAppointmentDetail();
        this.token = await jwtToken();
        let AppointmentDetails = await getAppointmentDetails(this.token, id);
        //set technician
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
        this.addAppointmentRef.current.selectedTime =
            starttime.format("MM-DD-Y") + " " + starttime.format("hh:mm A");
        //set client
        this.addAppointmentRef.current.clientName = String.prototype.trim.call(AppointmentDetails.client.fullname);
        let x = AppointmentDetails.client;
        if(typeof x.phone != 'undefined' && x.phone != '' && x.phone != null){
            let displayPhone = formatPhone(x.phone)
            if(this.userData.role == 9){
                let displayphoneSplit = displayPhone.split('-');
                if(displayphoneSplit.length > 1){
                    displayPhone = '(xxx) xxx-' + displayphoneSplit[1];
                }       
            }
            this.addAppointmentRef.current.clientName = displayPhone;
        }else if(typeof x.email != 'undefined' && x.email != '' && x.email != null){
            this.addAppointmentRef.current.clientName = x.email;
        }    

        this.addAppointmentRef.current.selectedClient =
            AppointmentDetails.client.id;
        //set Status
        this.addAppointmentRef.current.statusName = collect(
            this.listAppointmentStatus
        ).first(function(item) {
            return item.id == AppointmentDetails.status;
        }).title;
        this.addAppointmentRef.current.selectedStatus = AppointmentDetails.status;
        //set services
        this.addAppointmentRef.current.selectServices = {};
        let serviceList = collect(this.services);
        let _this = this;
        let countService = 0;
        AppointmentDetails.services.map((dataservice, i) => {
            let servicedata = serviceList.first(function(item) {
                return item.id == 'service_' + dataservice.service_id;
            });
            let techName = getTextByKey(this.languageKey,'selecttechnicianappointment');
            let technicianData = this.techniciansWithSearch.filter(function(itemTech){
                return itemTech.id == dataservice.technicianId;
            });
            if(technicianData.length){
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
            let combodata = this.combos.filter(function(item) {
                return item.id == dataservice.comboid;
            });

            if(combodata.length){
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
            service.servicesIncombo.forEach(function(itemService){
                itemService.sp_combo_id = dataservice.comboid;
                let serviceCombo = serviceList.first(function(serviceData){ 
                    return serviceData.id == 'service_' + itemService.serviceid;        
                });
                
                let techName = getTextByKey(this.languageKey,'selecttechnicianappointment');
                let technicianData = _this.techniciansWithSearch.filter(function(itemTech){
                    return itemTech.id == itemService.technicianId;
                });
                if(technicianData.length){
                    techName = technicianData[0].fullname;
                }

                if(serviceCombo){
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

    async _onViewAppointment(id) {
      return true;
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
        this.onRefreshAppointment();
    };

    refreshData = (starttime, appointmentId, appointmentDataFormat) => {
        let YM = starttime.format("YMM");
        if (typeof this.loadedMonths[YM] != "undefined") {
            if(Platform.OS === 'ios') {
                if (appointmentId == 0) {
                    this.loadedMonths[YM] = collect([
                        ...this.loadedMonths[YM]
                    ]).push(appointmentDataFormat);
                } else {
                    this.loadedMonths[YM] = collect([
                        ...this.loadedMonths[YM]
                    ]).reject(function(item) {
                        return item.id == appointmentId;
                    });
                    this.loadedMonths[YM] = collect([
                        ...this.loadedMonths[YM]
                    ]).push(appointmentDataFormat);
                }
             } else {
                if (appointmentId == 0) {
                    this.loadedMonths[YM] = this.loadedMonths[YM].push(appointmentDataFormat);
                } else {
                    this.loadedMonths[YM] = this.loadedMonths[YM].reject(function(item) {
                        return item.id == appointmentId;
                    });
                    this.loadedMonths[YM] = this.loadedMonths[YM].push(appointmentDataFormat);
                }
            } 
        }
        //console.log(this.loadedMonths[YM]);
    };

    render() {
        if (this.state.appIsReady) {
            return (
                <View style={styles.container}>
                    <ScrollableTabView
                        renderTabBar={() => <View />}
                        onChangeTab={this.changeTab}
                        locked={true}
                        ref={this.tabAppointmentRef}
                    >
                        <View tabLabel={"Wait List"} style={{ flex: 1 }}>
                            <View style={styles.tabContents}>
                                <AppointmentByDateWaitlist
                                    ref={this.AppointmentListByDayRef}
                                    visible={false}
                                    addAppointment={async (key) => {await this.addAppointment(key)}}
                                    byday={true}
                                    sectiondata={this.technicians}
                                    data={this.appointmentsByDay}
                                    expresscheckin={this.ExpressCheckin}
                                    userData={this.userData}
                                    token={this.token}
                                    onPressItemAdd={async (id, clientexpress) => {
                                        await this.addAppointment(id, clientexpress);
                                    }}
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
                        
                    </ScrollableTabView>
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
                    />

                    <ModalCalendar
                        ref={this.modalCalendarByWeekRef}
                        onPress={this.onSelectDateModalByWeek}
                    />
                    <SpinnerLoader
                        visible={false}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={color.white}
                        textContent={getTextByKey(this.languageKey,'loadingappointment')}
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
                        textContent={getTextByKey(this.languageKey,'loadingappointment')}
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
