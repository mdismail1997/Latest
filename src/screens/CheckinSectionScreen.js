import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    AsyncStorage,
    Alert,
    ScrollView
} from "react-native";


import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import layout from "../assets/styles/layout";
import NavigationBarBackground from "../components/navigationBarBG";
import NavigationBarTitle from "../components/navigationBarTitle";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import LanguageModal from "../components/LanguageModal";
import IconLoader from "../helpers/iconloader";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import CalendarStripHeader from "../components/CalendarStripHeader";
import {
    fetchCustomercheckins,
    fetchCategoriesData,
    fetchCustomercheckinsDetail
} from "../helpers/fetchdata";
import {
    isLogged,
    jwtToken,
    getUserData,
    getDeviceId
} from "../helpers/authenticate";
import { formatPhone, get_time_zone, getUSState2Digit } from "../helpers/Utils";
import collect from "collect.js";
import CustomerCheckinList from "../components/CustomerCheckinList";
import ModalCalendar from "../components/ModalCalendar";
import AddCustomerCheckIn from "../components/AddCustomerCheckIn";
import { color } from "../assets/colors/colors";

export default class CheckinSectionScreen extends React.Component {
    languageKey = typeof(this.props.route.params.language) != 'undefined' ? this.props.route.params.language : 'en-US';

    static route = {
        navigationBar: {
            visible: true,
            elevation: 0,
            renderBackground: () => {
                return <NavigationBarBackground />;
            },
            renderTitle: route => {
                return (
                    <NavigationBarTitle
                        title={'checkinnav'}
                        language={route.params.language}
                    />
                );
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
    filter = { technician: 0 };
    startDateWeek = moment().startOf("week").add(0, "days");
    endDateWeek = moment().startOf("week").add(6, "days");
    isTabDay = true;
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
    timezone = '';
    languageName = '';
    customercheckins = [];
    customercheckinByWeek = [];
    async componentWillMount() {
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn) {
            this.token = await jwtToken();
            this.userData = await getUserData();
            this.deviceid = await getDeviceId();
            this.languageKey = await getLanguage();
            var CustomercheckinData = await fetchCustomercheckins(
                this.token,
                this.currentYM
            );

            var customercheckins = CustomercheckinData.checkins;
            let _this = this;
            customercheckins.forEach(function(checkin){
                checkin.client = String.prototype.trim.call(checkin.client_full_name);

                if(typeof checkin.phone != 'undefined' && checkin.phone != '' && checkin.phone != null){
                    if(typeof checkin.client_full_name != 'undefined' && String.prototype.trim.call(checkin.client_full_name) != '' 
                        && checkin.client_full_name != null){
                            checkin.client += ' - ';
                    }
                    let displayPhone = formatPhone(checkin.phone);
                    if(_this.userData.role == 9){
                        let displayphoneSplit = displayPhone.split('-');
                        if(displayphoneSplit.length > 1){
                            displayPhone = '(xxx) xxx-' + displayphoneSplit[1];
                        }       
                    }
                    checkin.client += displayPhone;
                }else if(typeof checkin.email != 'undefined' && checkin.email != '' && checkin.email != null){
                    if(typeof checkin.client_full_name != 'undefined' && String.prototype.trim.call(checkin.client_full_name) != '' 
                        && checkin.client_full_name != null){
                            checkin.client += ' - ';
                    }
                    checkin.client += checkin.email;
                }
    
                checkin.categories = CustomercheckinData.category.filter(function (item) {
                    return item.customer_checkin_id == checkin.id;
                });
                let point = CustomercheckinData.payment.filter(function (item) {
                    return item.customer_checkin_id == checkin.id;
                });

                if(point.length > 0){
                    checkin.applypoint = point[0].applypoint;
                }else{
                    checkin.applypoint = 0;
                }

            });

            var collectCustomercheckin = collect(customercheckins);
            this.loadedMonths[this.currentYM] = collectCustomercheckin;
            //this.customercheckins = collect([...this.loadedMonths[this.currentYM]]);
            if(Platform.OS === 'ios') {
                this.customercheckins = collect([...this.loadedMonths[this.currentYM]]);
             } else {
                this.customercheckins = this.loadedMonths[this.currentYM];
            } 
            this.isLoadedAppointment = true;

            //fetch clients
            this.clients = [];

            //fetch services
            this.categories = await fetchCategoriesData(this.token);

          
            // let firstService = {
            //     id: 0,
            //     service_name: getTextByKey(this.languageKey,'selectserviceappointment'),
            //     price: 0,
            //     technicianId: 0,
            //     technicianName: getTextByKey(this.languageKey,'selecttechnicianappointment'),
            //     isCombo: false,
            //     rewardpoint: 0
            // };

            // this.selectServices["service_0"] = firstService;
            
            this.setState({ appIsReady: true });
            this.displayAppointmentByWeek(true, false);
            if (typeof this.props.route.params.showTabWeek != "undefined") {
                await _this.showNotificationAppointment(
                    this.props.route.params.notificationData.data,
                    this
                );
            }
        }else {
            this.props.navigator.push("login");
        }
        this.setState({ appIsReady: true });
    }

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
    calendarStripHeaderPress = () => {
        this.refs.modalCalendarByWeek.show(
            this.refs.CalendarStripByWeek.getSelectedDate()
        );
    };
    onSelectDateModalByWeek = date => {
        //this.refs.CalendarStripByWeek.setSelectedDate(date);
        this.focusedDay = moment(date).clone();
        this.byDayDate = moment(date).clone();
        this.startDateWeek = this.focusedDay.clone().startOf("week");
        this.endDateWeek = this.focusedDay.clone().endOf("week");

        this.displayAppointmentByWeek(true);
        //console.log(moment(date));
        //console.log(date);
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
    calendarStripSelectedDate = date => {
        this.focusedDay = date.clone();
        this.byDayDate = date.clone();
        this.displayAppointmentByWeek(true, false);
    };
    async displayAppointmentByWeek(isRefresh = true, isRefreshStrip = true) {
        let _this = this;
        this.customercheckinByWeek = [];
        var startTimeCurrentSelectedDate =
            this.startDateWeek.format("Y-MM-DD") + " 00:00:00";
        var endTimeCurrentSelectedDate =
            this.endDateWeek.format("Y-MM-DD") + " 23:59:59";
        let YMStart = this.startDateWeek.format("YMM");
        let YMEnd = this.endDateWeek.format("YMM");
        if (YMStart != YMEnd) {
            this.refs.tabappointmentloader.setState({ visible: true });
            if (typeof this.loadedMonths[YMStart] == "undefined") {
                var CustomercheckinData = await fetchCustomercheckins(this.token,YMStart);
                var customerchecks = this.fillData(CustomercheckinData);
                this.loadedMonths[YMStart] = collect(customerchecks);
            }

            if (typeof this.loadedMonths[YMEnd] == "undefined") {
                var CustomercheckinData = await fetchCustomercheckins(this.token,YMEnd);
                var customerchecks = this.fillData(CustomercheckinData);
                this.loadedMonths[YMEnd] = collect(customerchecks);
            }
            //this.customercheckins = collect([...this.loadedMonths[YMStart]]);
            if(Platform.OS === 'ios') {
                this.customercheckins = collect([...this.loadedMonths[YMStart]]);
             } else {
                this.customercheckins = this.loadedMonths[YMStart]
            } 
            this.loadedMonths[YMEnd].each(function(item) {
                _this.customercheckins.push(item);
            });
            this.refs.tabappointmentloader.setState({ visible: false });
        } else {
            //this.customercheckins = collect([...this.loadedMonths[YMStart]]);
            if(Platform.OS === 'ios') {
                this.customercheckins = collect([...this.loadedMonths[YMStart]]);
             } else {
                this.customercheckins = this.loadedMonths[YMStart]
            } 
        }

        var appointmentsCurrentSelectedWeek = this.customercheckins
            .where("checkinDate", ">", startTimeCurrentSelectedDate)
            .where("checkinDate", "<", endTimeCurrentSelectedDate);


        appointmentsCurrentSelectedWeek = appointmentsCurrentSelectedWeek.sortBy(
            "checkinDate"
        );
        appointmentsCurrentSelectedWeek = appointmentsCurrentSelectedWeek.groupBy(
            function(item, key) {
                return item.checkinDate.substring(0, 10);
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
            this.customercheckinByWeek.push(sectionAppointment);
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
            if (typeof this.refs.CustomerCheckinListByWeek != "undefined") {
                let sectionIndex = this.focusedDay.day();
                this.refs.CustomerCheckinListByWeek.setState({
                    visible: true,
                    byday: false,
                    data: this.customercheckinByWeek,
                    sectionIndex: sectionIndex,
                    itemIndex: 0
                });
            }
        }
    }
    fillData = (CustomercheckinData) => {
        let _this = this;
        var customercheckins = CustomercheckinData.checkins;
        customercheckins.forEach(function(checkin){
            checkin.client = String.prototype.trim.call(checkin.client_full_name);

            if(typeof checkin.phone != 'undefined' && checkin.phone != '' && checkin.phone != null){
                if(typeof checkin.client_full_name != 'undefined' && String.prototype.trim.call(checkin.client_full_name) != '' 
                    && checkin.client_full_name != null){
                        checkin.client += ' - ';
                }
                let displayPhone = formatPhone(checkin.phone);
                if(_this.userData.role == 9){
                    let displayphoneSplit = displayPhone.split('-');
                    if(displayphoneSplit.length > 1){
                        displayPhone = '(xxx) xxx-' + displayphoneSplit[1];
                    }       
                }
                checkin.client += displayPhone;
            }else if(typeof checkin.email != 'undefined' && checkin.email != '' && checkin.email != null){
                if(typeof checkin.client_full_name != 'undefined' && String.prototype.trim.call(checkin.client_full_name) != '' 
                    && checkin.client_full_name != null){
                        checkin.client += ' - ';
                }
                checkin.client += checkin.email;
            }

            checkin.categories = CustomercheckinData.category.filter(function (item) {
                return item.customer_checkin_id == checkin.id;
            });
        });
        return customercheckins;
    }
    changeWeek = week => {
        this.startDateWeek = week.clone();
        this.endDateWeek = week.clone().add(6, "days");
        this.focusedDay = this.startDateWeek
            .clone()
            .add(this.focusedDay.day(), "days");
        this.byDayDate = this.focusedDay.clone();
        this.displayAppointmentByWeek(true);
    };
    async _onPressViewCustomerCheckin(data){
        let token = await jwtToken();
        this.refs["viewcustomercheckin"].isShowLoaderAppointmentDetails = true;
        var CustomercheckinData = await fetchCustomercheckinsDetail(token, data.id);
        let starttime = moment(CustomercheckinData.checkins.checkinDate);
        this.refs["viewcustomercheckin"].selectedTime = starttime.format("MM-DD-Y") + " " + starttime.format("hh:mm A");
        this.refs["viewcustomercheckin"].clientName = data.client;
        this.refs["viewcustomercheckin"].categories = CustomercheckinData.category;
        this.refs["viewcustomercheckin"].selectedClient = CustomercheckinData.checkins.clientid;
        this.refs["viewcustomercheckin"].totalBill = CustomercheckinData.checkins.totalBill != null ? CustomercheckinData.checkins.totalBill: 0;
        this.refs["viewcustomercheckin"].dataDefault = data;
        let pointuse = 0;
        if(CustomercheckinData.payment.length > 0){
            pointuse = CustomercheckinData.payment[0].applypoint;
        }
        this.refs["viewcustomercheckin"].appliedpoint = pointuse;
        let rewardpoint = CustomercheckinData.checkins.rewardpoint != null ? CustomercheckinData.checkins.rewardpoint: 0;
        rewardpoint += parseFloat(pointuse);
        this.refs["viewcustomercheckin"].rewardpoint = rewardpoint;
        this.refs["viewcustomercheckin"].isShowLoaderAppointmentDetails = false;
        this.refs["viewcustomercheckin"].setState({
            modalVisible: true,
            customercheckid: data.id
        });
    }
    SaveCheckinSuccess = (id, data) => {
        this.refs.viewcustomercheckin.close();
        let YM = moment(data.checkinDate).format("YMM");
        if (typeof this.loadedMonths[YM] != "undefined") {
            if(Platform.OS === 'ios') {
                this.loadedMonths[YM] = collect([
                    ...this.loadedMonths[YM]
                ]).reject(function(item) {
                    return item.id == id;
                });
                this.loadedMonths[YM] = collect([
                    ...this.loadedMonths[YM]
                ]).push(data);
             } else {
                this.loadedMonths[YM] = this.loadedMonths[YM].reject(function(item) {
                    return item.id == id;
                });
                this.loadedMonths[YM] = this.loadedMonths[YM].push(data);
            } 

        }

        this.displayAppointmentByWeek(true);        
    };
    render() {
        if (this.state.appIsReady) {
            return (
                <View style={styles.container}>
                    <ScrollView style={styles.container}>
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
                                <CustomerCheckinList
                                    ref="CustomerCheckinListByWeek"
                                    visible={false}
                                    byday={false}
                                    sectiondata={""}
                                    data={this.customercheckinByWeek}
                                    userData={this.userData}
                                    token={this.token}
                                    onPressItem={async data => {
                                        await this._onPressViewCustomerCheckin(data);
                                    }}
                                    onViewItem={async id => {
                                        await this._onViewAppointment(id);
                                    }}
                                    refresh={this.refreshData}
                                    language={this.languageKey}
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <AddCustomerCheckIn
                        clients={this.clients}
                        title={"Customer check-in"}
                        ref={"viewcustomercheckin"}
                        token={this.token}
                        SaveCheckinSuccess={this.SaveCheckinSuccess}
                        deviceid={this.deviceid}
                        userData={this.userData}
                        categories={this.categories}
                        language={this.languageKey}
                    />
                    <ModalCalendar
                        ref="modalCalendarByWeek"
                        onPress={this.onSelectDateModalByWeek}
                    />
                   <SpinnerLoader
                        visible={false}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={color.white}
                        textContent={getTextByKey(this.languageKey,'loadingappointment')}
                        color={Colors.spinnerLoaderColor}
                        ref="tabappointmentloader"
                    />
                    <LanguageModal 
                        visible={false} 
                        ref="LanguageModal"
                        onPress={this.onSelectLanguage}
                    />   

                    <IconLoader
                        ref="appointmentSuccessLoader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmitSucccess}
                        textContent={"Appointment Booked"}
                        color={Colors.spinnerLoaderColorSubmit}
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
        flex: 1,
        backgroundColor:color.white
    },
    profilepicture: {
        /*backgroundColor:'navy',*/
        marginTop: 30
    },
    btnLogout: {
        height:50,
        backgroundColor:color.white,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 25,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
    },
    btnLogoutText:{
        color: color.reddish
    },
    btniconleft:{
        position:'absolute',
        left:5,
        backgroundColor:'transparent'
    },
    iconleftview:{
        paddingLeft:35,
        
    },
    btniconleftcontainer:{
        justifyContent:'center'
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
    highlightDateNumberStyleText: {
        color: color.white,
        fontSize: 14,
        fontWeight: "normal"
    },
    highlightDateNumberStyle: {
        width: 24,
        height: 24,
        borderRadius: 24,
        backgroundColor:  color.reddish,

        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
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
        color:  color.reddish,
        fontWeight: "normal",
        fontSize: 14
    },
    tabContents: {
        flex: 1
    },
});
