import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert, 
    Platform
} from "react-native";
import layout from "../assets/styles/layout";
import Colors from "../constants/Colors";
import SpinnerLoader from "../helpers/spinner";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import {
    fetchTechniciansData,
    fetchBusinesshours,
    fetchBlockedTimeDetail,
    fetchBlockedTime
} from "../helpers/fetchdata";
import {
    isLogged,
    jwtToken,
    getUserData,
    getDeviceId
} from "../helpers/authenticate";
import collect from "collect.js";
import CalendarBlockedTimeTitleNav from "../components/CalendarBlockedTimeTitleNav";
import NavigationBarBackground from "../components/navigationBarBG";
import ScrollableTabView from "react-native-scrollable-tab-view";
import BlockedTimeListByDay from "../components/BlockedTimeList";
import BlockedTimeListByWeek from "../components/BlockedTimeList";
import AppointmentSelectDay from "../components/AppointmentSelectDay";
import CalendarStrip from "react-native-calendar-strip";
import CalendarStripHeader from "../components/CalendarStripHeader";
import moment from "moment";
import ModalCalendar from "../components/ModalCalendar";
import DefaultTabBar from "../components/DefaultTabBar";
import AddBlockedTime from "../components/AddBlockedTime";
import { formatPhone, getUSState2Digit, get_time_zone, getCountry2Digit } from "../helpers/Utils";
import { color } from "../assets/colors/colors";
export default class BlocedTimeScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: false,
            elevation: 0,
            renderBackground: () => {
                return <NavigationBarBackground />;
            },
            renderTitle: route => {
                return (
                    <CalendarBlockedTimeTitleNav
                        onSelectTechnician={route.params.onSelectTechnician}
                        onRefreshAppointment={async () => { await route.params.onRefreshAppointment() }}
                        onPressNotificationAppointment={async () => { await route.params.onPressNotificationAppointment() }}
                        technicianList={route.params.technicianList}
                        badge={route.params.badge}
                        language={route.params.language}
                    />
                );
            },
            renderLeft: () => {
                return false;
            }
        }
    };
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
    Blockedtimes = [];
    BlockedtimeByDay = [];
    BlockedtimeByWeek = [];
    filter = { technician: 0 };
    startDateWeek = moment().startOf("week").add(0, "days");
    endDateWeek = moment().startOf("week").add(6, "days");
    isTabDay = true;
    newAppointmentTitle = getTextByKey(this.languageKey,'newblockedtimetitle');
    addAppointmentTitle = this.newAppointmentTitle;
    isToday = true;
    byDayText = moment().format("ll");
    state = {
        appIsReady: false
    };
    focusedDay = moment();
    userData = {};
    isLoadedBlockedTime = false;
    appointmentPushDataId = 0;


    stateData = '';
    timezone = '';
    async UNSAFE_componentWillMount() {
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn) {
            this.token = await jwtToken();
            this.userData = await getUserData();
            this.deviceid = await getDeviceId();
            let stateData = getUSState2Digit(this.userData.state);
            let country = getCountry2Digit(this.userData.country);
            let timezone = get_time_zone(country,stateData);
            this.timezone = timezone;
            this.byDayDate = moment().tz(timezone);
            this.today = moment().tz(timezone);
            this.currentYYYYMMDD = moment().tz(timezone).format("YYYY-MM-DD");
            this.startDateWeek = moment().tz(timezone).startOf("week").add(0, "days");
            this.endDateWeek = moment().tz(timezone).startOf("week").add(6, "days");
            this.byDayText = moment().tz(timezone).format("ll");
            this.focusedDay = moment().tz(timezone);
            this.languageKey = await getLanguage();
            let TechniciansData = [];
            let TechniciansDataNav = [];
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
            // this.props.route.params.badge = 0;
            // this.props.route.config.navigationBar.visible = true;
            // this.props.navigator.updateCurrentRouteParams({
            //     technicianList: TechniciansDataNav
            // });

            var blockedtimeData = await fetchBlockedTime(
                this.token,
                this.currentYM
            );

            var collectBlockedTime = collect(blockedtimeData["blockedtime"]);
            this.loadedMonths[this.currentYM] = collectBlockedTime;
            if(Platform.OS === 'ios'){
                this.Blockedtimes = collect([...this.loadedMonths[this.currentYM]]);
            }else{
                this.Blockedtimes = this.loadedMonths[this.currentYM];
            }
            this.isLoadedBlockedTime = true;
            //fetch businesshours
            var businesshours = await fetchBusinesshours(this.token);
            this.availablehours = businesshours.available_hours;

            this.setState({ appIsReady: true });   
            this.displayBlockedTimeByDay(true, false);         
        } else {
            this.props.navigation.push("login");
        }
    }
   
    onRefreshAppointment = async () => {
        this.fetchMonthData();
        
    }

    onPressNotificationAppointment = async () => {
        this.refs.modalNotification.show();
        //doi cap nhat
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
            _this.refs.tabAppointment.goToPage(1);
        }, 0);

 
    }

    getAppointmentDataByTechnicianId = (techId,BlockedTimeCurrentSelectedDay) => {

        let sectionBlockedTime = {};
        sectionBlockedTime.key = techId;

        let apptsByTech = BlockedTimeCurrentSelectedDay.filter(
            function(itemAppt) {
                return itemAppt.techid == techId;
            }
        );

        if(apptsByTech.count()){
            return apptsByTech.toArray();        
        }else{
            return [{ id: 0 }];
        }
    }

    displayBlockedTimeByDay = (isRefresh = true, isRefreshDay = true) => {
        this.BlockedtimeByDay = [];
        var startTimeCurrentSelectedDate =
            this.byDayDate.format("Y-MM-DD") + " 00:00:00";
        var endTimeCurrentSelectedDate =
            this.byDayDate.format("Y-MM-DD") + " 23:59:59";

        let YM = this.byDayDate.format("YMM");
        
        if(Platform.OS === 'ios'){
            this.Blockedtimes = collect([...this.loadedMonths[YM]]);
        }else{
            this.Blockedtimes = this.loadedMonths[YM];
        }
        var BlockedTimeCurrentSelectedDayv1 = this.Blockedtimes
            .where("start_time", ">", startTimeCurrentSelectedDate)
            .where("start_time", "<", endTimeCurrentSelectedDate);

        var BlockedTimeCurrentSelectedDayv2  = this.Blockedtimes
        .where("start_time", ">", startTimeCurrentSelectedDate)
        .where("start_time", "<", endTimeCurrentSelectedDate)
        .where("end_time", ">", endTimeCurrentSelectedDate);

        var BlockedTimeCurrentSelectedDayv3  = this.Blockedtimes
        .where("end_time", ">", startTimeCurrentSelectedDate)
        .where("end_time", "<", endTimeCurrentSelectedDate);

        var BlockedTimeCurrentSelectedDayv4  = this.Blockedtimes
        .where("start_time", "<", endTimeCurrentSelectedDate)
        .where("end_time", ">", endTimeCurrentSelectedDate); 

        var BlockedTimeCurrentSelectedDay = BlockedTimeCurrentSelectedDayv1;
        if(BlockedTimeCurrentSelectedDayv2.items.length > 0){
            BlockedTimeCurrentSelectedDay = BlockedTimeCurrentSelectedDay.merge(BlockedTimeCurrentSelectedDayv2.items);
        }
        if(BlockedTimeCurrentSelectedDayv3.items.length > 0){
            BlockedTimeCurrentSelectedDay = BlockedTimeCurrentSelectedDay.merge(BlockedTimeCurrentSelectedDayv3.items);
        }
        if(BlockedTimeCurrentSelectedDayv4.items.length > 0){
            BlockedTimeCurrentSelectedDay = BlockedTimeCurrentSelectedDay.merge(BlockedTimeCurrentSelectedDayv4.items);
        }

        BlockedTimeCurrentSelectedDay = BlockedTimeCurrentSelectedDay.unique();


            BlockedTimeCurrentSelectedDay = BlockedTimeCurrentSelectedDay.sortBy(
            "start_time"
        );
        let apptTechExists = [];   
        let _this = this;

        if (this.filter.technician > 0){
            let sectionBlockedTime = {};
            sectionBlockedTime.key = this.filter.technician;
            sectionBlockedTime.data =this.getAppointmentDataByTechnicianId(this.filter.technician,BlockedTimeCurrentSelectedDay);
            this.BlockedtimeByDay.push(sectionBlockedTime);
        }else{
            this.technicians.map((item,i) => {
                //ignore any technician

                let sectionBlockedTime = {};
                sectionBlockedTime.key = item.id;
                sectionBlockedTime.data = this.getAppointmentDataByTechnicianId(item.id,BlockedTimeCurrentSelectedDay);
                this.BlockedtimeByDay.push(sectionBlockedTime);
                
            })
        }
 
        if (isRefresh) {
            if (typeof this.refs.BlockedTimeListByDay != "undefined") {
                this.refs.BlockedTimeListByDay.setState({
                    visible: true,
                    byday: true,
                    data: this.BlockedtimeByDay
                });
            }

            //this.setState({ apptByDay: true, apptByWeek: false });
        }
        if (isRefreshDay) {
            if (this.byDayDate.isSame(this.today, "day")) {
                this.refs.BlockedTimeSelectDay.setState({
                    byDayText: this.byDayDate.format("ll"),
                    isToday: true
                });
            } else {
                this.refs.BlockedTimeSelectDay.setState({
                    byDayText: this.byDayDate.format("ll"),
                    isToday: false
                });
            }
        }

        //this.props.appointmentsByDay = this.appointmentsByDay;
        //console.log(this.props.appointmentsByDay);
    };

    async displayBlockedTimeByWeek(isRefresh = true, isRefreshStrip = true) {
        let _this = this;
        this.BlockedtimeByWeek = [];
        var startTimeCurrentSelectedDate =
            this.startDateWeek.format("Y-MM-DD") + " 00:00:00";
        var endTimeCurrentSelectedDate =
            this.endDateWeek.format("Y-MM-DD") + " 23:59:59";
        let YMStart = this.startDateWeek.format("YMM");
        let YMEnd = this.endDateWeek.format("YMM");

        if (YMStart != YMEnd) {
            this.refs.tabappointmentloader.setState({ visible: true });
            if (typeof this.loadedMonths[YMStart] == "undefined") {
                var blockedtimeData = await fetchBlockedTime(this.token, YMStart);
                var collectBlockedTime = collect(blockedtimeData["blockedtime"]);
                this.loadedMonths[YMStart] = collectBlockedTime;
            }

            if (typeof this.loadedMonths[YMEnd] == "undefined") {
                var blockedtimeData = await fetchBlockedTime(this.token, YMEnd);
                var collectBlockedTime = collect(blockedtimeData["blockedtime"]);
                this.loadedMonths[YMEnd] = collectBlockedTime;
            }
            
            if(Platform.OS === 'ios'){
                this.Blockedtimes = collect([...this.loadedMonths[YMStart]]);
            }else{
                this.Blockedtimes = this.loadedMonths[YMStart];
            }
            this.loadedMonths[YMEnd].each(function(item) {
                _this.Blockedtimes.push(item);
            });
            this.refs.tabappointmentloader.setState({ visible: false });

        } else {
            if(Platform.OS === 'ios'){
                this.Blockedtimes = collect([...this.loadedMonths[YMStart]]);
            }else{
                this.Blockedtimes = this.loadedMonths[YMStart];
            }
        }
        //console.log(this.appointments);

        for (let i = 0; i < 7; i++) {
            let cloneStart = this.startDateWeek.clone();
            let startKey = cloneStart.add(i, "days").format("Y-MM-DD");
            let startTimeCurrentSelectedDate = startKey + " 00:00:00";
            let endTimeCurrentSelectedDate = startKey + " 23:59:59";
            let sectionAppointment = {};
            sectionAppointment.key = startKey;
            var BlockedTimesCurrentSelectedWeekv1 = this.Blockedtimes
            .where("start_time", ">", startTimeCurrentSelectedDate)
            .where("start_time", "<", endTimeCurrentSelectedDate);

            var BlockedTimesCurrentSelectedWeekv2  = this.Blockedtimes
            .where("start_time", ">", startTimeCurrentSelectedDate)
            .where("start_time", "<", endTimeCurrentSelectedDate)
            .where("end_time", ">", endTimeCurrentSelectedDate);

            var BlockedTimesCurrentSelectedWeekv3  = this.Blockedtimes
            .where("end_time", ">", startTimeCurrentSelectedDate)
            .where("end_time", "<", endTimeCurrentSelectedDate);

            var BlockedTimesCurrentSelectedWeekv4  = this.Blockedtimes
            .where("start_time", "<", endTimeCurrentSelectedDate)
            .where("end_time", ">", endTimeCurrentSelectedDate); 

            var BlockedTimesCurrentSelectedWeek = BlockedTimesCurrentSelectedWeekv1;
            if(BlockedTimesCurrentSelectedWeekv2.items.length > 0){
                BlockedTimesCurrentSelectedWeek = BlockedTimesCurrentSelectedWeek.merge(BlockedTimesCurrentSelectedWeekv2.items);
            }
            if(BlockedTimesCurrentSelectedWeekv3.items.length > 0){
                BlockedTimesCurrentSelectedWeek = BlockedTimesCurrentSelectedWeek.merge(BlockedTimesCurrentSelectedWeekv3.items);
            }
            if(BlockedTimesCurrentSelectedWeekv4.items.length > 0){
                BlockedTimesCurrentSelectedWeek = BlockedTimesCurrentSelectedWeek.merge(BlockedTimesCurrentSelectedWeekv4.items);
            }

            BlockedTimesCurrentSelectedWeek = BlockedTimesCurrentSelectedWeek.unique();
            BlockedTimesCurrentSelectedWeek = BlockedTimesCurrentSelectedWeek.sortBy(
                "start_time"
            );
            if (this.filter.technician > 0) {
                var currentSelectedTechnician = this.filter.technician;
                BlockedTimesCurrentSelectedWeek = BlockedTimesCurrentSelectedWeek.filter(
                    function(item) {
                        return item.techid == currentSelectedTechnician;
                    }
                );
            }

            if (BlockedTimesCurrentSelectedWeek.items.length > 0) {
                sectionAppointment.data = BlockedTimesCurrentSelectedWeek.items;
            } else {
                sectionAppointment.data = [{ id: 0 }];
            }

            this.BlockedtimeByWeek.push(sectionAppointment);
            
        }
        
        if (isRefreshStrip) {
            setTimeout(function() {
                _this.refs.CalendarStripByWeek.setState({
                    selectedDate: _this.focusedDay.clone(),
                    startingDate: _this.focusedDay.clone().startOf("week")
                });
            }, 0);
        }
        if (isRefresh) {
            if (typeof this.refs.BlockedTimeListByWeek != "undefined") {
                let sectionIndex = this.focusedDay.day();
                //console.log(sectionIndex);
                this.refs.BlockedTimeListByWeek.setState({
                    visible: true,
                    byday: false,
                    data: this.BlockedtimeByWeek,
                    sectionIndex: sectionIndex,
                    itemIndex: 0
                });

                this.refs.BlockedTimeListByWeek.scrollTo();
            }
            //this.setState({ apptByDay: false, apptByWeek: true });
        }
    }

    onSelectTechnician = id => {
        this.filter.technician = id;
        if (this.isTabDay) {
            this.displayBlockedTimeByDay();
        }else{
            this.displayBlockedTimeByWeek();
        }
    };

    async fetchMonthData() {
        this.refs.tabappointmentloader.setState({ visible: true });
        if (this.isTabDay) {
            if (this.byDayDate.isSame(this.today, "day")) {
                this.refs.BlockedTimeSelectDay.setState({
                    byDayText: this.byDayDate.format("ll"),
                    isToday: true
                });
            } else {
                this.refs.BlockedTimeSelectDay.setState({
                    byDayText: this.byDayDate.format("ll"),
                    isToday: false
                });
            }
        }
        var blockedtimeData = await fetchBlockedTime(
            this.token,
            this.currentYM
        );

        var collectBlockedTime = collect(blockedtimeData["blockedtime"]);
        this.loadedMonths[this.currentYM] = collectBlockedTime;
        
        if(Platform.OS === 'ios'){
            this.Blockedtimes = collect([...this.loadedMonths[this.currentYM]]);
        }else{
            this.Blockedtimes = this.loadedMonths[this.currentYM];
        }
        if (this.isTabDay) {
            this.displayBlockedTimeByDay(true, false);
        } else this.displayBlockedTimeByDay(true);
        this.refs.tabappointmentloader.setState({ visible: false });
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
            if(Platform.OS === 'ios'){
                this.Blockedtimes = collect([...this.loadedMonths[this.currentYM]]);
            }else{
                this.Blockedtimes = this.loadedMonths[this.currentYM];
            }
            this.displayBlockedTimeByDay(true);
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
        //this.refs.CalendarStripByWeek.setSelectedDate(this.focusedDay);
        let YM = this.byDayDate.format("YMM");
        if (typeof this.loadedMonths[YM] == "undefined") {
            this.currentYM = YM;
            this.fetchMonthData();
        } else {
            this.currentYM = YM;
            
            if(Platform.OS === 'ios'){
                this.Blockedtimes = collect([...this.loadedMonths[this.currentYM]]);
            }else{
                this.Blockedtimes = this.loadedMonths[this.currentYM];
            }
            this.displayBlockedTimeByWeek(true);
        }

        //startDateWeek
        //this.refs.CalendarStripByWeek.setSelectedDate(date);
        //this.focusedDay = date;
    };

    _today = () => {
        if (!this.byDayDate.isSame(this.today, "day")) {
            this.byDayDate = moment();
            this.focusedDay = moment();
            this.startDateWeek = this.focusedDay.clone().startOf("week");
            this.endDateWeek = this.focusedDay.clone().endOf("week");
            this.displayBlockedTimeByDay(true);
        }
    };

    toDayWeek = () => {
        if (!this.focusedDay.isSame(this.today, "day")) {
            this.byDayDate = moment();
            this.focusedDay = moment();
            this.startDateWeek = this.focusedDay.clone().startOf("week");
            this.endDateWeek = this.focusedDay.clone().endOf("week");
            /*
            if (typeof this.refs.CalendarStripByWeek != "undefined") {
                this.refs.CalendarStripByWeek.setSelectedDate(moment());
            }*/
            this.displayBlockedTimeByWeek(true);
        }
    };

    changeTab = index => {
        if (index.i == 0) {
            if (!this.isTabDay) {
                this.isTabDay = true;
                this.displayBlockedTimeByDay(true);
            }
        } else {
            if (this.isTabDay) {
                this.isTabDay = false;
            }
            this.displayBlockedTimeByWeek(true);
        }
    };

    addAppointment = async key => {
        this.addAppointmentTitle = this.newAppointmentTitle;
        this.refs["addAppointment"].clearForm();
        this.refs["addAppointment"].isShowLoaderAppointmentDetails = false;

        this.refs["addAppointment"].title = this.addAppointmentTitle;
        if (this.isTabDay) {
            this.refs["addAppointment"].technicianSelectid = key;
            let selectedTech = this.technicians.first(function(item) {
                return item.id == key;
            });
            this.refs["addAppointment"].technicianSelectName = selectedTech.fullname;
        } else {
            this.refs["addAppointment"].technicianSelectid = 0;
            this.refs["addAppointment"].technicianSelectName = '';
            this.refs["addAppointment"].selectedDate = moment(key);
            let dayname = moment(key).format("dddd").toLowerCase();
            let availablehours = this.availablehours[dayname];
            if (availablehours.length) {
                this.refs["addAppointment"].selectedHour = availablehours[0];
                this.refs["addAppointment"].appointmentDate = moment(
                    key
                ).format("DD-MM-Y");
                this.refs[
                    "addAppointment"
                ].appointmentHour = this.convertTo24Hour(availablehours[0]);
                this.refs["addAppointment"].selectedTime =
                    moment(key).format("MM-DD-Y") + " " + availablehours[0];
            }
        }

        this.refs["addAppointment"].setState({
            modalVisible: true,
            blockedtimeId: 0
        });
    };

    async _onPressAppointment(id) {

        this.refs["addAppointment"].showLoaderAppointmentDetail();
        this.token = await jwtToken();
        let BlockedtimeDetails = await fetchBlockedTimeDetail(this.token, id);
        //set technician
        this.refs["addAppointment"].titleblockedtime = BlockedtimeDetails.title;
        this.refs["addAppointment"].technicianSelectid = BlockedtimeDetails.techid;
        this.refs["addAppointment"].technicianSelectName = BlockedtimeDetails.fullname;
        //set time
        let starttime = moment(BlockedtimeDetails.start_time);
        this.refs["addAppointment"].startday = starttime;
        this.refs["addAppointment"].starttime = starttime.format("hh:mm A");
        this.refs["addAppointment"].startdateTime = starttime.format("DD-MM-Y hh:mm A");

        let endtime = moment(BlockedtimeDetails.end_time);
        this.refs["addAppointment"].endday = endtime;
        this.refs["addAppointment"].endtime = endtime.format("hh:mm A");
        this.refs["addAppointment"].enddateTime = endtime.format("DD-MM-Y hh:mm A");
        this.refs["addAppointment"].isShowLoaderAppointmentDetails = false;
        this.refs["addAppointment"].setState({
            modalVisible: true,
            blockedtimeId: id
        });
    }

    async _onViewAppointment(id) {
        this.refs["viewAppointment"].showLoaderAppointmentDetail();
        this.token = await jwtToken();
        let AppointmentDetails = await getAppointmentDetails(this.token, id);
        
        //set time
        let starttime = moment(AppointmentDetails.start_time);
       
        this.refs["viewAppointment"].selectedTime =
            starttime.format("MM-DD-Y") + " " + starttime.format("hh:mm A");
        //set client
        this.refs["viewAppointment"].clientName = String.prototype.trim.call(AppointmentDetails.client.fullname);
        let x = AppointmentDetails.client;
        if(typeof x.phone != 'undefined' && x.phone != '' && x.phone != null){
            let displayPhone = formatPhone(x.phone)
            if(this.userData.role == 9){
                let displayphoneSplit = displayPhone.split('-');
                if(displayphoneSplit.length > 1){
                    displayPhone = '(xxx) xxx-' + displayphoneSplit[1];
                }       
            }
            this.refs["viewAppointment"].clientName = displayPhone;
        }else if(typeof x.email != 'undefined' && x.email != '' && x.email != null){
            this.refs["viewAppointment"].clientName = x.email;
        }    


        //set Status
        this.refs["viewAppointment"].statusName = collect(
            this.listAppointmentStatus
        ).first(function(item) {
            return item.id == AppointmentDetails.status;
        }).title;
       
        //set services
        this.refs["viewAppointment"].selectServices = {};
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
            _this.refs["viewAppointment"].selectServices[
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
            _this.refs["viewAppointment"].selectServices[
                "service_" + countService
            ] = service;
            countService++;
            
        });

        this.refs["viewAppointment"].refs.AppointmentSelectedService.setState({
            selectServices: this.refs["viewAppointment"].selectServices
        });
        //set payments
        
        this.refs["viewAppointment"].isShowLoaderAppointmentDetails = false;

        

        this.refs["viewAppointment"].setState({
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
        //console.log(this.refs.CalendarStripByWeek.getSelectedDate());
        //console.log(this.refs.CalendarStripByWeek.getSelectedDate());
        //this.refs.modalCalendarByWeek.props.date = this.refs.CalendarStripByWeek.getSelectedDate();
        this.refs.modalCalendarByWeek.show(
            this.refs.CalendarStripByWeek.getSelectedDate()
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
        //this.refs.CalendarStripByWeek.setSelectedDate(date);
        this.focusedDay = moment(date).clone();
        this.byDayDate = moment(date).clone();
        this.startDateWeek = this.focusedDay.clone().startOf("week");
        this.endDateWeek = this.focusedDay.clone().endOf("week");

        this.displayBlockedTimeByWeek(true);
        //console.log(moment(date));
        //console.log(date);
    };

    calendarStripSelectedDate = date => {
        //this.setState({ dateselect: date })
        this.focusedDay = date.clone();
        this.byDayDate = date.clone();
        this.displayBlockedTimeByWeek(true, false);

        //if (!this.isTabDay) {
        //this.displayAppointmentByWeek(true);
        // console.log(date.day());
        /*    
            this.refs.AppointmentListByWeek.setState({
                byday: false,
                sectionIndex: date.day(),
                itemIndex: 0,
                delay: 50
            });*/

        //console.log('yes');
        //}
    };

    SaveAppointmentSuccess = (Id, data, type) => {
        if(typeof(type) != "undefined" && type == "delete"){
           this.refs.addAppointment.close();
            let YM = moment(data.start_time).format("YMM");
            if(Platform.OS === 'ios'){
                this.loadedMonths[YM] = collect([
                    ...this.loadedMonths[YM]
                ]).reject(function(item) {
                    return item.id == Id;
                });
            }else{
                this.loadedMonths[YM] = this.loadedMonths[YM].reject(function(item) {
                    return item.id == Id;
                });
            }

        }else{
            this.refs.addAppointment.close();
            this.refreshData(
                moment(data.start_time),
                Id,
                data
            );
        }
        if (
            this.isTabDay &&
            this.byDayDate.isSame(moment(data.start_time), "day")
        ) {
            this.displayBlockedTimeByDay(true);
        } else {
           
            this.focusedDay = moment(data.start_time);
            this.byDayDate = moment(data.start_time).clone();
            this.startDateWeek = this.focusedDay.clone().startOf("week");
            this.endDateWeek = this.focusedDay.clone().endOf("week");
            if (this.isTabDay) {
                this.refs.tabAppointment.goToPage(1);
            }
            this.displayBlockedTimeByWeek(true);
        }
    };

    refreshData = (starttime, Id, data) => {
        let YM = starttime.format("YMM");
        if (typeof this.loadedMonths[YM] != "undefined") {
            if(Platform.OS === 'ios'){
                if (Id == 0) {
                    this.loadedMonths[YM] = collect([
                        ...this.loadedMonths[YM]
                    ]).push(data);
                } else {
                    this.loadedMonths[YM] = collect([
                        ...this.loadedMonths[YM]
                    ]).reject(function(item) {
                        return item.id == Id;
                    });
                    this.loadedMonths[YM] = collect([
                        ...this.loadedMonths[YM]
                    ]).push(data);
                }
            }else{
                if (Id == 0) {
                    this.loadedMonths[YM] = this.loadedMonths[YM].push(data);
                } else {
                    this.loadedMonths[YM] = this.loadedMonths[YM].reject(function(item) {
                        return item.id == Id;
                    });
                    this.loadedMonths[YM] = this.loadedMonths[YM].push(data);
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
                        ref="tabAppointment"
                    >
                        <View tabLabel={getTextByKey(this.languageKey,'byday')} style={{ flex: 1 }}>
                            <AppointmentSelectDay
                                changeDate={this.changeDate}
                                today={this._today}
                                isToday={this.isToday}
                                byDayText={this.byDayText}
                                ref="BlockedTimeSelectDay"
                                language={this.languageKey}
                            />
                            <View style={styles.tabContents}>
                                <BlockedTimeListByDay
                                    ref="BlockedTimeListByDay"
                                    visible={false}
                                    addAppointment={async (key) => {await this.addAppointment(key)}}
                                    byday={true}
                                    sectiondata={this.technicians}
                                    data={this.appointmentsByDay}
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
                        <View tabLabel={getTextByKey(this.languageKey,'byweek')} style={{ flex: 1 }}>
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
                                    ref="CalendarStripByWeek"
                                    onDateSelected={
                                        this.calendarStripSelectedDate
                                    }
                                    onWeekChanged={this.changeWeek}
                                />
                            </View>
                            <View style={styles.tabContents}>
                                <BlockedTimeListByWeek
                                    ref="BlockedTimeListByWeek"
                                    addAppointment={async (key) => {await this.addAppointment(key)}}
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
                    </ScrollableTabView>


                   <AddBlockedTime
                        clients={this.clients}
                        technicians={this.techniciansWithSearch}
                        title={this.addAppointmentTitle}
                        ref={"addAppointment"}
                        availablehours={this.availablehours}
                        token={this.token}
                        SaveAppointmentSuccess={this.SaveAppointmentSuccess}
                        deviceid={this.deviceid}
                        userData={this.userData}
                        language={this.languageKey}
                        timezone={this.timezone}
                    />
                    <ModalCalendar
                        ref="modalCalendarByWeek"
                        onPress={this.onSelectDateModalByWeek}
                    />

                    <SpinnerLoader
                        visible={false}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={color.white}
                        textContent={getTextByKey(this.languageKey,'loading')}
                        color={Colors.spinnerLoaderColor}
                        ref="tabappointmentloader"
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
                        textContent={getTextByKey(this.languageKey,'loading')}
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
