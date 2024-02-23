import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import { LinearGradient } from 'expo-linear-gradient';
import moment from "moment";
import CalendarStrip from 'react-native-calendar-strip';
import CalendarStripHeader from "./CalendarStripHeader";
import ModalCalendar from './ModalCalendar';
import SpinnerLoader from "../../helpers/spinner";
import Colors from "../../constants/Colors_checkin";
import {
    fetchBlockedTime
} from "../../api/fetchdata";
import setting from "../../constants/Setting";
import { getUSState2Digit, get_time_zone, getCountry2Digit } from "../../helpers/Utils";
import "../../helpers/timezone";
import { color } from "../../assets/colors/colors";
import { gStrings } from "../../components/staticStrings";
import { api } from "../../api/api";

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').width.height;
var widthLeft = width * 0.7;
var columnWidth = parseInt(widthLeft / 4);
var hourHeight = 75;
var orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
if (orientation == 'LANDSCAPE') {
    hourHeight = 100;
}

export default class TimePicker extends React.Component {



    loadedYM = this.props.loadedDataYM;
    blockedTimeData = this.props.blockedTime;
    //loadedAppointmentBusyHour = {};
    //technicianhour = [];
    duration = 0;
    loadedAvailableTechiciansByDay = {};
    techniciansAvailablehour = [];
    availableTechniciansServices = {};
    selectServices = [];
    stateData = getUSState2Digit(this.props.userData.state);
    country = getCountry2Digit(this.props.userData.country);
    timezone = get_time_zone(this.country, this.stateData);

    servicesProp = this.props.services;
    startDateWeek = moment().tz(this.timezone).startOf('week');
    arrTechniciansAndHours = {};
    focusedDay = moment().tz(this.timezone);
    fullhourcalculate = '';
    maxhourcalculate = 0;
    opening_hours = this.props.opening_hours;
    state = {
        dateselect: moment().tz(this.timezone),
        hourselect: '',
        //technicianId: 0
    }
    appointemntId = 0;

    UNSAFE_componentWillUnmount() {
        Dimensions.removeEventListener("change", () => { });
    }

    async UNSAFE_componentWillMount() {
        //load available hour of technicias
        width = Dimensions.get('window').width;
        height = Dimensions.get('window').width.height;
        widthLeft = width * 0.7;
        columnWidth = parseInt(widthLeft / 4);
        hourHeight = 75;
        orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
        if (orientation == 'LANDSCAPE') {
            hourHeight = 100;
        }

        let _this = this;
        Dimensions.addEventListener('change', function () {
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;

            orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
            if (orientation == 'LANDSCAPE') {
                hourHeight = 100;
            }
            widthLeft = width * 0.7;
            columnWidth = widthLeft / 4;
            _this.setState({ appIsReady: true });
        })
    }

    async loadBusyTime() {
        var dayselect = this.focusedDay.format('Y-MM-DD');
        if (dayselect in this.loadedAvailableTechiciansByDay && this.appointemntId == 0) {
            this.techniciansAvailablehour = this.loadedAvailableTechiciansByDay[dayselect];
        } else {
            this.refs.SpinnerLoader.setState({ visible: true });
            await fetch(setting.apiUrl + api.getAvailableTechnician + this.appointemntId + "&dayselect=" + this.focusedDay.format('Y-MM-DD'), {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + this.props.token
                }
            })
                .then(response => response.json())
                .then(responseJson => {
                    this.refs.SpinnerLoader.setState({ visible: false });
                    if (responseJson.success) {
                        this.loadedAvailableTechiciansByDay[dayselect] = responseJson.data;
                        this.techniciansAvailablehour = responseJson.data;
                    }
                })
                .catch(error => {
                    console.error(error);
                    //return [];
                });
            // if(!this.props.userData.isManageTurn){


            // }else{
            //     this.loadedAvailableTechiciansByDay[dayselect] = [];
            //     this.techniciansAvailablehour = [];
            // }

        }
    }

    setServices = (technicianList, selectServices) => {
        this.selectServices = selectServices;
        this.availableTechniciansServices = technicianList;
    }

    async setTechnicianAndServiceDuraion(technicianList, duration, selectServices) {
        this.duration = duration;
        this.availableTechniciansServices = technicianList;
        this.selectServices = selectServices;
        await this.loadBusyTime();
        this.setState({ reload: true });
        //console.log(this.techniciansAvailablehour);
        //await this.loadBusyTime(technicianId);
        //this.setState({technicianId : technicianId});
    }


    calendarHeader = (title) => {
        return (
            <CalendarStripHeader toDayOnPress={async () => { await this.toDayOnPress() }} onPress={this.calendarStripHeaderPress} headerTitle={title} />
        )
    }

    async toDayOnPress() {
        this.focusedDay = moment().tz(this.timezone);
        await this.loadBusyTime();
        this.props.onPressTimeReset();
        this.setState({ dateselect: moment().tz(this.timezone), hourselect: '' })
    }

    async setTime(time, hour, appointemntId) {
        //console.log(hour);
        this.appointemntId = appointemntId;
        this.focusedDay = moment.tz(time, this.timezone);
        await this.loadBusyTime();
        this.setState({ dateselect: moment.tz(time, this.timezone), hourselect: hour })
    }

    async fetchBlockedTimeByYM(YM) {
        this.refs.SpinnerLoader.setState({ visible: true });
        let blockedTime = await fetchBlockedTime(this.props.token, YM);
        this.blockedTimeData = this.mergeBlockedTime(this.blockedTimeData, blockedTime);
        this.loadedYM[YM] = YM;
    }

    calendarStripHeaderPress = () => {
        //console.log(this.refs.CalendarStripByWeek.getSelectedDate().format('Y-M-D'));
        this.refs.modalCalendarByWeek.show(this.refs.CalendarStripByWeek.getSelectedDate());
    }

    async calendarStripSelectedDate(date) {
        this.focusedDay = date;
        await this.loadBusyTime();
        this.props.onPressTimeReset();
        this.setState({ dateselect: date, hourselect: '' })
    }

    async onSelectDateModalByWeek(date) {
        //console.log(date.format('YYYY-MM-DD HH:mm'));
        let datewithzone = moment.tz(date, this.timezone);
        this.focusedDay = datewithzone;
        //console.log(datewithzone.format('YYYY-MM-DD HH:mm'));
        let YM = this.focusedDay.format('YMM');
        if (typeof (this.loadedYM[YM]) == 'undefined') {
            await this.fetchBlockedTimeByYM(this.focusedDay.format('YMM'));
        }
        await this.loadBusyTime();
        this.props.onPressTimeReset();
        //console.log(moment(date).format('YYYY-MM-DD HH:mm'));
        this.setState({ dateselect: datewithzone, hourselect: '' })
    }

    async changeWeek(week) {
        this.startDateWeek = week.clone();

        this.focusedDay = this.startDateWeek
            .clone()
            .add(this.focusedDay.day(), "days");

        let startYM = this.startDateWeek.format('YMM');
        let endYM = this.startDateWeek.clone().add(6, "days").format('YMM');

        if (typeof (this.loadedYM[startYM]) == 'undefined') {
            await this.fetchBlockedTimeByYM(startYM);
        }
        if (typeof (this.loadedYM[endYM]) == 'undefined') {
            await this.fetchBlockedTimeByYM(endYM);
        }

        await this.loadBusyTime();

        this.refs.CalendarStripByWeek.setSelectedDate(this.focusedDay);
    };

    ontestchoi() {

    }

    onPressTime = async (hour) => {
        //console.log(this.arrTechniciansAndHours);
        this.fullhourcalculate = String.prototype.trim.call(this.convertTo24Hour(hour));
        let dayname = this.state.dateselect.format('dddd').toLowerCase();
        var dayformat = this.focusedDay.format('Y-MM-DD');

        //this.isValidHour(this.fullhourcalculate,dayformat,this.maxhourcalculate,dayname,0);

        //console.log(this.arrTechniciansAndHours);
        //this.props.onPress(this.state.dateselect,hour,this.arrTechniciansAndHours);
        await this.props.onPress(this.state.dateselect, hour, []);
        this.setState({ hourselect: hour });
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

    mergeBlockedTime(destinationArr, sourceArr) {
        let _this = this;
        Object.keys(sourceArr).forEach(function (key) {
            let value = sourceArr[key];
            if (typeof (destinationArr[key]) != 'undefined') {
                destinationArr[key] = _this.array_merge(destinationArr[key], value);
            } else {
                destinationArr[key] = value;
            }
        });

        return destinationArr;
    }

    getClass(object) {
        return Object.prototype.toString.call(object).slice(8, -1);
    };

    isValidCollection(obj) {
        try {
            return (
                typeof obj !== "undefined" &&	// Element exists
                getClass(obj) !== "String" &&	// weed out strings for length check
                getClass(obj.length) === "Number" &&	// Is an indexed element
                !obj.tagName &&	// Element is not an HTML node
                !obj.alert &&	// Is not window
                typeof obj[0] !== "undefined"	// Has at least one element
            );
        } catch (e) {
            return false;
        }
    }

    array_merge(arr1, arr2) {
        // Variable declarations
        var arr1Class, arr2Class, i, il;

        // Save class names for arguments
        arr1Class = this.getClass(arr1);
        arr2Class = this.getClass(arr2);

        if (arr1Class === "Array" && this.isValidCollection(arr2)) {  // Array-like merge
            if (arr2Class === "Array") {
                arr1 = arr1.concat(arr2);
            } else {  // Collections like NodeList lack concat method
                for (i = 0, il = arr2.length; i < il; i++) {
                    arr1.push(arr2[i]);
                }
            }
        } else if (arr1Class === "Object" && arr1Class === arr2Class) {  // Object merge
            for (i in arr2) {
                if (i in arr1) {
                    if (this.getClass(arr1[i]) === this.getClass(arr2[i])) {  // If properties are same type
                        if (typeof arr1[i] === "object") {  // And both are objects
                            arr1[i] = this.array_merge(arr1[i], arr2[i]);  // Merge them
                        } else {
                            arr1[i] = arr2[i];  // Otherwise, replace current
                        }
                    }
                } else {
                    arr1[i] = arr2[i];  // Add new property to arr1
                }
            }
        }
        return arr1;
    }



    loadAvailableHour = (hoursOfDay, dayname) => {
        //console.log(hoursOfDay + ' - ' + dayname);
        //calculate min minute
        let minServiceDuration = 9000;
        let _this = this;
        this.selectServices.forEach(function (serviceid) {
            let serviceDurationItem = _this.servicesProp.filter(function (servicePropItem) {
                return serviceid == servicePropItem.id;
            })
            if (serviceDurationItem.length) {
                let serviceDuration = serviceDurationItem[0].duration;
                if (serviceDuration < minServiceDuration) {
                    minServiceDuration = serviceDuration;
                }
            }
        });
        this.arrTechniciansAndHours = {};
        let availableHours = [];
        var dayformat = this.focusedDay.format('Y-MM-DD');

        var maxHour = -1;
        var maxMinute = -1;
        var blockedTimeSalonByDay = this.getBlockedTimeByUserId(this.props.userData.id, dayformat);
        for (var i = 0; i < hoursOfDay.length; i++) {
            var hourDisplay = hoursOfDay[i];

            var toHour = hourDisplay.split(":")[0];
            var toMinute = hourDisplay.split(":")[1];

            if (maxHour <= toHour) {
                if (parseInt(maxHour) == parseInt(toHour)) {
                    if (parseInt(maxMinute) < parseInt(toMinute)) {
                        maxMinute = parseInt(toMinute);
                    }
                } else {
                    maxHour = toHour;
                    maxMinute = toMinute;
                }
            }
        }
        if (maxMinute < 0) maxMinute = 0;
        maxHour = parseInt(maxHour * 100) + parseInt(this.getTimeFromMins(maxMinute));

        this.maxhourcalculate = maxHour;

        for (var i = 0; i < hoursOfDay.length; i++) {

            var hourDisplay = hoursOfDay[i];

            var businessHour = parseInt(hourDisplay.split(':')[0]);
            var businessMinute = parseInt(hourDisplay.split(':')[1]);
            var time_minute = parseInt(hoursOfDay[i].split(':')[1]);
            if (businessMinute == 30) {
                businessHour = businessHour + 0.5;
            }
            if (businessMinute == 15) {
                businessHour = businessHour + 0.25;
            }
            if (businessMinute == 45) {
                businessHour = businessHour + 0.75;
            }
            var hourformat = 'AM'
            var fullhour = businessHour;
            //console.log(fullhour);
            if (businessHour >= 12) {
                hourformat = 'PM';
                if (businessHour > 12.75) {
                    businessHour = businessHour - 12;
                }
            }
            hourDisplay = businessHour;
            if (hourDisplay.toString().length == 1) hourDisplay = "0" + hourDisplay;
            if (hourDisplay.toString().length > 2) {

                if (time_minute == 15) hourDisplay = parseInt(hourDisplay) + ":15";
                if (time_minute == 30) hourDisplay = parseInt(hourDisplay) + ":30";
                if (time_minute == 45) hourDisplay = parseInt(hourDisplay) + ":45";
            }
            if (hourDisplay.toString().length == 2) hourDisplay = parseInt(hourDisplay) + ":00";
            //if (hourDisplay.toString().length == 1) hourDisplay = parseInt(hourDisplay) + ":00";
            if (hourDisplay.toString().length == 4) hourDisplay = "0" + hourDisplay;

            if (fullhour.toString().length == 1) fullhour = "0" + fullhour;
            if (fullhour.toString().length > 2) fullhour = parseInt(fullhour) + ":30";
            if (fullhour.toString().length > 2) {

                if (time_minute == 15) fullhour = parseInt(fullhour) + ":15";
                if (time_minute == 30) fullhour = parseInt(fullhour) + ":30";
                if (time_minute == 45) fullhour = parseInt(fullhour) + ":45";
            }
            if (fullhour.toString().length == 2) fullhour = parseInt(fullhour) + ":00";
            if (fullhour.toString().length == 4) fullhour = "0" + fullhour;

            if (fullhour.indexOf('PM') >= 0) {
                let splitFullHour = fullhour.split(':');
                if (parseInt(splitFullHour[0]) != 12) {
                    fullhour = parseInt(splitFullHour[0]) + 12;
                    fullhour += ':' + splitFullHour[1].split(' ')[0];
                }
            }
            //console.log(moment().tz(this.timezone).format('YYYY-MM-DD HH:mm'));    
            let isValidTime = moment().tz(this.timezone).isBefore(moment.tz(dayformat + ' ' + fullhour + ':00', this.timezone));
            //console.log(fullhour);
            //console.log(moment().tz(this.timezone).format('Y-MM-DD HH:mm'));
            //console.log(moment.tz(dayformat + ' ' + fullhour + ':00',this.timezone).format('Y-MM-DD HH:mm'));
            if (!isValidTime) continue;

            var isInTimeSalon = this.checkTechnicianHourValidForOpenHour(blockedTimeSalonByDay, fullhour, maxHour, true, 0);

            if (!isInTimeSalon) {

                availableHours.push(hourDisplay + ' ' + hourformat);
                /*
                if(this.isValidHour(fullhour,dayformat,maxHour,dayname,minServiceDuration)){
                    availableHours.push(hourDisplay + ' ' + hourformat);       
                }*/
            }

        }

        return availableHours;
    }

    isValidHour = (hour, dayformat, dayname, serviceid, quantity, duration_config = 0) => {
        this.arrTechniciansAndHours = {};
        let _this = this;
        let isAllServiceValidTime = true;
        let opening_hours_available = this.opening_hours[dayname];
        let isValid = false;
        let serviceDuration = 0;
        let serviceDurationItem = _this.servicesProp.filter(function (servicePropItem) {
            return serviceid == servicePropItem.id;
        })
        if (serviceDurationItem.length && duration_config == 0) {
            serviceDuration = serviceDurationItem[0].duration;
            if (typeof (quantity) != 'undefined') {
                serviceDuration = serviceDuration * quantity;
            }
        } else {
            serviceDuration = duration_config;
            if (typeof (quantity) != 'undefined') {
                serviceDuration = serviceDuration * quantity;
            }
        }
        let listTechnician = _this.availableTechniciansServices[serviceid];
        if (typeof (listTechnician) != 'undefined') {
            for (var i = 0; i < listTechnician.length; i++) {
                var technician = listTechnician[i];
                if (technician.id == 0) {
                    let technicianResult = {};
                    technicianResult.id = technician.id;
                    technicianResult.fullname = technician.fullname;
                    technicianResult.picture = technician.picture;
                    technicianResult.start = hour;
                    technicianResult.end = _this.getEndHourFormat(hour, serviceDuration);
                    technicianResult.duration = serviceDuration;
                    technicianResult.checkinid = technician.checkinid;
                    technicianResult.checkout = technician.checkout;
                    technicianResult.TurnBook = technician.TurnBook;
                    if (typeof (_this.arrTechniciansAndHours[hour + '_' + serviceid]) == 'undefined') {
                        _this.arrTechniciansAndHours[hour + '_' + serviceid] = [];
                    }
                    _this.arrTechniciansAndHours[hour + '_' + serviceid].push(technicianResult);
                    isValid = true;
                    continue;
                }

                var blockedTimeTechnicianByDay = _this.getBlockedTimeByUserId(technician.id, dayformat);
                let isInTime = true;
                if (typeof (_this.props.TechniciansWorkingHour[technician.id]) != 'undefined') {

                    let list_hour = _this.props.TechniciansWorkingHour[technician.id][dayname];

                    let isHourInList = list_hour.filter(function (hour_in_list) {
                        var ArrOpeningHours = hour_in_list.split('-');
                        if (ArrOpeningHours.length) {
                            return parseInt(ArrOpeningHours[0].replace(':', '')) <= parseInt(hour.replace(':', ''))
                                && parseInt(ArrOpeningHours[1].replace(':', '')) >= parseInt(hour.replace(':', ''));
                        } else {
                            return false;
                        }
                    });
                    if (isHourInList.length) {
                        isInTime = false;
                    }
                }
                if (!isInTime) {
                    isInTime = _this.checkTechnicianHourValidForOpenHour(blockedTimeTechnicianByDay, hour, _this.maxhourcalculate, false, 0);
                }
                if (!isInTime) {
                    if (typeof (_this.techniciansAvailablehour[technician.id]) != 'undefined') {
                        isInTime = _this.checkTechnicianHourValidForOpenHour(_this.techniciansAvailablehour[technician.id], hour, _this.maxhourcalculate, false, serviceDuration);
                    }
                }

                let technicianResult = {};
                technicianResult.id = technician.id;
                technicianResult.fullname = technician.fullname;
                technicianResult.picture = technician.picture;
                technicianResult.checkinid = technician.checkinid;
                technicianResult.checkout = technician.checkout;
                technicianResult.TurnBook = technician.TurnBook;
                if (typeof (_this.arrTechniciansAndHours[hour + '_' + serviceid]) == 'undefined') {

                    _this.arrTechniciansAndHours[hour + '_' + serviceid] = [];
                }
                if (!isInTime) {
                    let isExists = false;
                    _this.arrTechniciansAndHours[hour + '_' + serviceid].forEach(function (itemInarrTechniciansAndHours) {
                        if (technicianResult.id == itemInarrTechniciansAndHours.id) {
                            isExists = true;
                        }
                    })
                    if (!isExists) {
                        technicianResult.start = hour;
                        technicianResult.end = _this.getEndHourFormat(hour, serviceDuration);
                        technicianResult.duration = serviceDuration;
                        _this.arrTechniciansAndHours[hour + '_' + serviceid].push(technicianResult);
                    }
                }
            }
        }
        hour = _this.formatHourApp24Hour(_this.getEndHourFormat(hour, serviceDuration));
        return {
            data: this.arrTechniciansAndHours,
            hour: hour
        };
    }

    formatHourApp24Hour(hour) {
        var prefix = '';
        var split = hour.split(':');
        hour = parseInt(split[0]);
        minute = split[1];


        if (hour.toString().length == 2) {
            prefix = '';
        } else {
            prefix = "0";
        }

        return prefix + hour + ":" + minute;
    }

    getBlockedTimeByUserId(technicianId, dayformat) {
        var blockedTimeByDayData = [];
        var BlockedTimes = this.blockedTimeData;
        if (typeof (BlockedTimes[technicianId]) != 'undefined') {
            if (typeof (BlockedTimes[technicianId][dayformat]) != 'undefined') {
                blockedTimeByDayData = BlockedTimes[technicianId][dayformat];
            }
        }
        return blockedTimeByDayData;
    }

    getTimeFromMins(mins) {
        if (mins >= 24 * 60 || mins < 0) {
            throw new RangeError(gStrings.validTimeMins);
        }
        var h = mins / 60 | 0,
            m = mins % 60 | 0;
        return (h * 100) + m;
    }

    checkTechnicianHourValidForOpenHour(schedulehours, startHour, maxHour, isSalon, duration) {
        var endInHour = this.getEndHour(startHour, duration);
        var startInHour = parseInt(startHour.replace(':', ''));

        var isInTime = false;
        if (typeof (schedulehours) != 'undefined') {
            for (var i = 0; i < schedulehours.length; i++) {
                var scheduleStartTime = parseInt(schedulehours[i].start_time.replace(':', ''));
                var scheduleEndTime = parseInt(schedulehours[i].end_time.replace(':', ''));

                //check startTime not in slot
                if (!isSalon) {

                    if ((startInHour >= scheduleStartTime && startInHour < scheduleEndTime) ||
                        (endInHour > scheduleStartTime && endInHour <= scheduleEndTime)
                        // || (endInHour >= scheduleStartTime && endInHour >= scheduleEndTime)
                        || (startInHour < scheduleStartTime && (endInHour > scheduleEndTime || endInHour > scheduleStartTime))
                        || (endInHour > maxHour)) {
                        //trick for process old conflict data
                        isInTime = true;

                        break;
                    }
                } else {//console.log(maxHour);console.log(scheduleEndTime);
                    if ((startInHour >= scheduleStartTime && startInHour < scheduleEndTime) ||
                        (endInHour >= scheduleStartTime && endInHour <= scheduleEndTime)
                        || (endInHour >= scheduleStartTime && endInHour >= scheduleEndTime && maxHour <= scheduleEndTime)
                        || (startInHour < scheduleStartTime && (endInHour > scheduleEndTime || endInHour > scheduleStartTime))) {
                        isInTime = true;


                        break;
                    }
                }
            }
        }

        return isInTime;
    }

    isTechnicianEndHourValidInRange(schedulehours, endHour, maxHour, duration, startHour) {
        var endInHour = parseInt(endHour.replace(':', ''));
        var startInHour = parseInt(startHour.replace(':', ''));
        var isValid = false;
        let scheduleEndTimeValid = '';
        let endInHourOfDay = '';
        let result = {};
        if (typeof (schedulehours) != 'undefined') {
            for (var i = 0; i < schedulehours.length; i++) {
                //var scheduleStartTime = parseInt(schedulehours[i].start_time.replace(':', ''));
                scheduleEndTimeValid = parseInt(schedulehours[i].end_time.replace(':', ''));
                endInHourOfDay = this.getEndHour(schedulehours[i].end_time, duration);
                //console.log(scheduleEndTime + ' - ' + endInHour + ' - ' + endInHourOfDay);
                if (scheduleEndTimeValid < endInHour && endInHourOfDay <= maxHour && scheduleEndTimeValid >= startInHour) {
                    isValid = true;
                    break;
                }
            }
        }
        if (isValid) {
            //console.log(scheduleEndTime + ' - ' + endInHourOfDay);
            for (var i = 0; i < schedulehours.length; i++) {
                var scheduleStartTime = parseInt(schedulehours[i].start_time.replace(':', ''));
                var scheduleEndTime = parseInt(schedulehours[i].end_time.replace(':', ''));

                if ((scheduleEndTimeValid >= scheduleStartTime && scheduleEndTimeValid < scheduleEndTime) ||
                    (endInHourOfDay > scheduleStartTime && endInHourOfDay <= scheduleEndTime)
                    // || (endInHour >= scheduleStartTime && endInHour >= scheduleEndTime)
                    || (scheduleEndTimeValid < scheduleStartTime && (endInHourOfDay > scheduleEndTime || endInHourOfDay > scheduleStartTime))) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                result.start = this.formatHourFromNumber(scheduleEndTimeValid);
                result.end = this.formatHourFromNumber(endInHourOfDay);
                //console.log(scheduleEndTimeValid + ' - ' + endInHourOfDay);
            }
        }
        return result;
        //return isInTime;
    }

    getEndHour(startHour, duration) {
        var startInHour = startHour.split(':')[0] + "00";
        var startInMinute = startHour.split(':')[1];
        var totalMinute = parseInt(startInMinute) + parseInt(duration);
        var calculateEndHour = parseInt(startInHour) + parseInt(this.getTimeFromMins(totalMinute));
        return calculateEndHour;
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

    formatHourFromNumber(calculateEndHour) {
        if (calculateEndHour.toString().length == 4) {
            hour = calculateEndHour.toString().substring(0, 2);
            minute = calculateEndHour.toString().substring(2, 4);
        } else {
            hour = calculateEndHour.toString().substring(0, 1);
            minute = calculateEndHour.toString().substring(1, 3);
        }
        return hour + ':' + minute;
    }

    render() {
        let dayname = this.state.dateselect.format('dddd').toLowerCase();
        let availablehours = [...this.props.availablehours[dayname]];
        var firsthour = availablehours[0];
        let hourSelected = this.state.hourselect;
        let cloneavailablehours = [...availablehours];
        if (availablehours.length > 0) {
            let lasttimestr = cloneavailablehours.pop();
            let lasttime = parseInt(lasttimestr.split(":")[0]);
            switch (lasttimestr.split(":")[1]) {
                case "00":
                    availablehours.push(parseInt(lasttime) + ":15");
                    availablehours.push(parseInt(lasttime) + ":30");
                    availablehours.push(parseInt(lasttime) + ":45");
                    break;
                case "15":
                    availablehours.push(parseInt(lasttime) + ":30");
                    availablehours.push(parseInt(lasttime) + ":45");
                    break;
                case "30":
                    availablehours.push(parseInt(lasttime) + ":45");
                    break;
            }
            for (let i = 0; i < 2; i++) {
                lasttime += 1;
                if (lasttime < 22) {
                    availablehours.push(parseInt(lasttime) + ":00");
                    availablehours.push(parseInt(lasttime) + ":15");
                    availablehours.push(parseInt(lasttime) + ":30");
                    availablehours.push(parseInt(lasttime) + ":45");
                }
            }
        }
        //console.log(availablehours);
        //this.getHoursOfDays(availablehours);
        /*
        if(this.state.technicianId > 0){
            availablehours = this.loadAvailableHour(availablehours,dayname);
        }*/
        var dayselected = this.state.dateselect.format('YYYY-MM-DD');

        if (typeof (firsthour) == 'undefined') {
            firsthour = '00:00';
        }
        var business_first = moment(dayselected + ' ' + firsthour).format('YYYY-MM-DD HH:mm');
        var business_current = moment().tz(this.props.timezone).format('YYYY-MM-DD HH:mm');
        if (this.selectServices.length) {
            availablehours = this.loadAvailableHour(availablehours, dayname);
        }
        var current_time = false;
        if (moment(business_first) <= moment(business_current)) {
            availablehours.unshift(moment(business_current).format('hh:mm A'));
            current_time = true;
        }
        // console.log('availablehours', availablehours);
        let appointmentHours = availablehours.map((x, i) => {
            let hourstyle = hourSelected == x ? styles.hourSelected : styles.hours;
            let hourTextstyle = hourSelected == x ? styles.hourTextSelected : styles.hoursText;
            return (
                <TouchableOpacity key={x} activeOpacity={1} onPress={async () => { await this.onPressTime(x) }}>
                    <View style={[hourstyle, { width: columnWidth, height: hourHeight }]}>
                        {(() => {
                            if (current_time && i == 0) {
                                return (
                                    <Text style={hourTextstyle}>
                                        Current Time
                                    </Text>
                                )
                            } else {
                                return (
                                    <Text style={hourTextstyle}>
                                        {x}
                                    </Text>
                                );
                            }
                        })()}
                    </View>
                </TouchableOpacity>
            )
        }
        )
        return (
            <View style={styles.container}>
                <View style={[styles.calendarcontainer, { width: width }]}>
                    <View style={{ width: 640, height: 150, paddingTop: 0 }}>
                        <CalendarStrip
                            startingDate={this.startDateWeek}
                            useIsoWeekday={false}
                            calendarHeaderFormat="MMM Y" style={{ flex: 1 }}
                            dateNameStyle={styles.dateNameStyle}
                            dateNumberStyle={styles.dateNumberStyle}
                            dateNumberStyleText={styles.dateNumberStyleText}
                            calendarHeaderStyle={styles.calendarHeaderStyle}
                            selectedDate={this.state.dateselect}
                            highlightDateNameStyle={styles.selectedDate}
                            highlightDateNumberStyle={styles.highlightDateNumberStyle}
                            highlightDateNumberStyleText={styles.highlightDateNumberStyleText}
                            calendarHeader={this.calendarHeader}
                            onDateSelected={async (date) => { await this.calendarStripSelectedDate(date); }}
                            onWeekChanged={async (week) => { await this.changeWeek(week); }}
                            ref="CalendarStripByWeek" />
                    </View>
                </View>
                {/* <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: color.white,fontSize:20, fontFamily:'Futura' }}>Available Hours</Text>
                </View> */}
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.hourscontainer} keyboardShouldPersistTaps="always">
                        {appointmentHours}
                    </ScrollView>
                </View>
                <ModalCalendar ref="modalCalendarByWeek" timezone={this.timezone} onPress={async (date) => { await this.onSelectDateModalByWeek(date) }} />

                <SpinnerLoader
                    visible={false}
                    textStyle={layout.textLoaderScreen}
                    overlayColor={"rgba(255,255,255,0.9)"}
                    textContent={"Loading Available Time..."}
                    color={Colors.spinnerLoaderColor}
                    ref='SpinnerLoader'
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    calendarcontainer: {
        height: 150,
        paddingTop: 0,
        paddingBottom: 0,
        borderWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateNameStyle: {
        color: color.white,
        fontWeight: 'normal',
        fontSize: 20,
        fontFamily: 'Futura'
    },
    dateNumberStyle: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',


    },
    dateNumberStyleText: {
        color: color.white,
        fontWeight: 'normal',
        fontSize: 20,

    },
    calendarHeaderStyle: {
        color: color.white,
        fontWeight: 'normal',
        fontSize: 20
    },
    selectedDate: {
        color: color.brownish,
        fontWeight: 'normal',
        fontSize: 20,
        fontFamily: 'Futura'
    },
    highlightDateNumberStyle: {
        width: 34,
        height: 34,
        borderRadius: 34,
        backgroundColor: color.cylindricalCoordinate,

        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    highlightDateNumberStyleText: {
        color: color.white,
        fontSize: 20,
        fontWeight: 'normal',
    },
    hourscontainer: {

        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    hours: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        //borderRightWidth: 0,
        borderColor: color.white,
    },
    hourSelected: {

        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: color.white,

    },
    hourTextSelected: {
        color: color.brownish,
        fontSize: 22
    },
    hoursText: {
        color: color.white,
        fontSize: 22
    }

})