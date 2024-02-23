import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal, Platform, TextInput, FlatList, Dimensions, ScrollView, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import moment from "moment";
import CalendarStrip from 'react-native-calendar-strip';
import CalendarStripHeader from "../components/CalendarStripHeader";
import ModalCalendar from '../components/ModalCalendar';
import { getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class AppointmentSelectTime extends React.Component {
    state = {
        modalVisible: true,
        dateselect: this.props.selectedDate,
        hourselect: this.props.selectedHour,
        istime: ''
    }
    columnWidth = Dimensions.get('window').width / 3;
    startDateWeek = moment().tz(this.props.timezone).startOf('week');
    focusedDay = this.props.selectedDate;
    close() {
        this.props.onClose();
        this.setState({ modalVisible: false });
    }

    show = (istime) => {

        this.setState({ modalVisible: true,  istime: istime});
    }

    calendarHeader = (title) => {
        return (
            <CalendarStripHeader toDayOnPress={this.toDayOnPress} onPress={this.calendarStripHeaderPress} headerTitle={title} />
        )
    }

    toDayOnPress = () => {
        this.focusedDay = moment().tz(this.props.timezone);
        this.setState({ dateselect: moment().tz(this.props.timezone) })
    }

    calendarStripHeaderPress = () => {
        //console.log(this.refs.CalendarStripByWeek.getSelectedDate());
        //console.log(this.refs.CalendarStripByWeek.getSelectedDate());
        //this.refs.modalCalendarByWeek.props.date = this.refs.CalendarStripByWeek.getSelectedDate();
        this.refs.modalCalendarByWeek.show(this.refs.CalendarStripByWeek.getSelectedDate());
    }

    onSelectDateModalByWeek = (date) => {
        //this.refs.CalendarStripByWeek.setSelectedDate(date);
        this.focusedDay = moment(date);
        this.setState({ dateselect: moment(date) })
        //console.log(date);
    }

    calendarStripSelectedDate = (date) => {
        this.focusedDay = date;
        this.setState({ dateselect: date })
    }

    onPressTime = (hour) => {
        this.props.onPress(this.state.dateselect,hour, this.state.istime);
    }

    changeWeek = week => {
        this.startDateWeek = week.clone();
        this.focusedDay = this.startDateWeek
            .clone()
            .add(this.focusedDay.day(), "days");
  
        this.refs.CalendarStripByWeek.setSelectedDate(this.focusedDay);
    
    };

    
    getText(key){
        return getTextByKey(this.props.language,key);
    }

    render() {
        let dayname = this.state.dateselect.format('dddd').toLowerCase();
        let availablehours = this.props.data[dayname];
        let hourSelected = this.state.hourselect;
        let appointmentHours = availablehours.map((x, i) => {
            let hourstyle = hourSelected == x ? styles.hourSelected : styles.hours;
            let hourTextstyle = hourSelected == x ? styles.hourTextSelected : styles.hoursText;
            return (
                <TouchableOpacity key={x} activeOpacity={1} onPress={() => {this.onPressTime(x)}}>
                    <View style={[hourstyle, { width: this.columnWidth  }]}>
                        <Text style={hourTextstyle}>{x}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        )
        return (
            <Modal
                animationType={"none"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}

            >
                <SafeAreaView  style={{ flex: 1 }}>
                <View style={(Platform.OS === 'android' ? layout.headercontainerAndroid : layout.headercontainer)}>
                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]}
                        style={(Platform.OS === 'android' ? layout.headerAndroid : layout.header)}>
                        <View style={layout.headercontrols}>
                            <TouchableOpacity style={layout.headerNavLeftContainer} activeOpacity={1}
                                onPress={() => this.close()}>
                                <View style={layout.headerNavLeft}>
                                    <Icon
                                        name={'close'}
                                        size={20}
                                        color={color.whiteRBG1} style={(Platform.OS === 'android' ? layout.navIcon : layout.navIconIOS)}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={layout.headertitle}>{this.getText('selecttimetitle')}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <View style={{ flex: 1 }}>
                    <View style={styles.calendarcontainer}>
                        <CalendarStrip 
                        //datesWhitelist={this.datesWhitelist}
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
                            onDateSelected={this.calendarStripSelectedDate}
                            onWeekChanged={this.changeWeek}
                            ref="CalendarStripByWeek" />
                    </View>
                    <View style={{ height: 35, alignItems: 'center', backgroundColor: color.lightWhite, justifyContent: 'center' }}>
                        <Text style={{ color: color.silver, }}>{this.getText('availablehours')}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <ScrollView contentContainerStyle={styles.hourscontainer}>
                            {appointmentHours}
                        </ScrollView>
                    </View>
                </View>
                <ModalCalendar ref="modalCalendarByWeek" onPress={this.onSelectDateModalByWeek} />
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    calendarcontainer: {
        height: 93,
        paddingTop: 10,
        paddingBottom: 0,
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
    },
    dateNameStyle: {
        color:  color.blackish,
        fontWeight: 'normal',
        fontSize: 14
    },
    dateNumberStyle: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    dateNumberStyleText: {
        color:  color.blackish,
        fontWeight: 'normal',
        fontSize: 14,
    },
    calendarHeaderStyle: {
        color:  color.blackish,
        fontWeight: 'normal',
        fontSize: 16
    },
    selectedDate: {
        color: color.reddish,
        fontWeight: 'normal',
        fontSize: 14
    },
    highlightDateNumberStyle: {
        width: 24,
        height: 24,
        borderRadius: 24,
        backgroundColor: color.reddish,

        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    highlightDateNumberStyleText: {
        color: color.white,
        fontSize: 14,
        fontWeight: 'normal',
    },
    hourscontainer: {
       
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    hours: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        //borderRightWidth: 0,
        borderColor: color.whitishBorder,
    },
    hourSelected:{
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        backgroundColor: color.reddish,
        borderColor: color.whitishBorder,
        
    },
    hourTextSelected:{
        color:color.white
    },
    hoursText:{
        color: color.blackish
    }
});
