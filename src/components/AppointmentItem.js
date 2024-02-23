import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { getStatus, getStatusToNumber, getStatusColor, getUSState2Digit, get_time_zone, getCountry2Digit } from "../helpers/Utils";
import Swipeable from 'react-native-swipeable';
//import layout from "../assets/styles/layout";
import "../helpers/timezone";
import setting from "../constants/Setting";
import SubmitLoader from "../helpers/submitloader";
import layout from "../assets/styles/layout";
import IconLoader from "../helpers/iconloaderlongtext";
import Colors from "../constants/Colors";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";
import { gStrings } from "./staticStrings";
import { api } from "../api/api";
export default class AppointmentItem extends React.Component {

    stateData = getUSState2Digit(this.props.userData.state);
    country = getCountry2Digit(this.props.userData.country);
    timezone = get_time_zone(this.country, this.stateData);
    isDone = false;
    data = this.props.data;
    rightbtntext = 'Check Out';
    isCheckOut = true;
    SwipeableRef = '';
    _onPress = (params, type, data) => {
        if (this.props.isEdit) {
            this.props.onPressItem(params, type, data);
        } else {
            this.props.onViewItem(params, type);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.data = nextProps.data;
    }

    onPressRightButton = (data) => {
        if (this.isCheckOut) {
            this.checkOut(data);
        } else {
            this.start(data);
        }
    }

    start = (data) => {

        let isValidTime = moment().tz(this.timezone).isAfter(moment.tz(data.start_time, this.timezone));
        if (!isValidTime) {
            let isToday = moment().tz(this.timezone).isSame(moment.tz(data.start_time, this.timezone), 'day');
            if (isToday) {
                this.refs.appointmentLoader.setState({ visible: true });
                let _this = this;
                let submitData = {};
                submitData.id = data.id;
                submitData.technicianid = this.props.userData.id;
                fetch(setting.apiUrl + api.startAppointment, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + this.props.token
                    },
                    body: JSON.stringify(submitData)
                })
                    .then(response => response.json())
                    .then(responseJson => {
                        //console.log(responseJson);    

                        _this.refs.appointmentLoader.setState({
                            visible: false
                        });

                        _this.refs.appointmentSuccessLoader.setState({
                            textContent: 'Started Successfully',
                            visible: true
                        });

                        _this.rightbtntext = 'Start';
                        _this.isCheckOut = false;
                        _this.SwipeableRef.recenter();
                        setTimeout(function () {
                            _this.refs.appointmentSuccessLoader.setState({
                                visible: false
                            });

                            //_this.disable = true;
                            //_this.setState({render:true});
                            _this.isDone = true;
                            //_this.swipeable.recenter();

                            _this.props.refreshData(moment(responseJson.data.start_time), submitData.id, responseJson.data);
                            _this.data = responseJson.data;
                            _this.setState({ render: true });
                        }, 2000);
                    })
                    .catch(error => {
                        _this.refs.appointmentLoader.setState({ visible: false });
                        console.error(error);
                    });
            } else {
                Alert.alert('Error', gStrings.cancelNotStart);
            }
        }

    }

    checkOut = (data) => {
        let isValidTime = moment().tz(this.timezone).isAfter(moment.tz(data.start_time, this.timezone));

        if (!isValidTime) {
            let checkedInDate = '';
            let userData = this.props.userData;
            let techService = this.data.services.filter(function (item) {
                return item.technicianId == userData.id && item.checkedInDate != '' && item.checkedInDate != null;
            });
            if (techService.length) {
                checkedInDate = techService[0].checkedInDate;
            }


            if (checkedInDate != '') {
                isValidTime = true;
            }
        }

        if (!isValidTime) {
            Alert.alert('Error', gStrings.appNotStarted);
        } else {
            let isToday = moment().tz(this.timezone).isSame(moment.tz(data.start_time, this.timezone), 'day');
            if (isToday) {
                this.refs.appointmentLoader.setState({ visible: true });

                let _this = this;
                let submitData = {};
                submitData.id = data.id;
                fetch(setting.apiUrl + api.checkoutAppointment, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + this.props.token
                    },
                    body: JSON.stringify(submitData)
                })
                    .then(response => response.json())
                    .then(responseJson => {

                        _this.refs.appointmentLoader.setState({
                            visible: false
                        });

                        _this.refs.appointmentSuccessLoader.setState({
                            textContent: 'Checked Out Successfully',
                            visible: true
                        });
                        _this.SwipeableRef.recenter();
                        setTimeout(function () {
                            _this.refs.appointmentSuccessLoader.setState({
                                visible: false
                            });

                            //_this.disable = true;
                            //_this.setState({render:true});
                            _this.isDone = true;
                            //_this.swipeable.recenter();

                            _this.props.refreshData(moment(responseJson.data.start_time), submitData.id, responseJson.data);
                            _this.data = responseJson.data;
                            _this.setState({ render: true });
                        }, 2000);
                    })
                    .catch(error => {
                        _this.refs.appointmentLoader.setState({ visible: false });
                        console.error(error);
                    });
            } else {
                Alert.alert('Error', gStrings.checkout);
            }

        }
    }

    onSwipeStart = (data) => {

        let isValidTime = moment().tz(this.timezone).isAfter(moment.tz(data.start_time, this.timezone));

        if (!isValidTime && !data.isStart) {
            let checkedInDate = '';
            let userData = this.props.userData;
            let techService = data.services.filter(function (item) {
                return item.technicianId == userData.id && item.checkedInDate != '' && item.checkedInDate != null;
            });
            if (techService.length) {
                checkedInDate = techService[0].checkedInDate;
            }

            if (this.isCheckOut && checkedInDate == '' && this.props.isStart) {
                this.rightbtntext = 'Start';
                this.isCheckOut = false;
                this.setState({ render: true });
            } else {

                if (checkedInDate != '' && this.props.isCheckout) {
                    this.rightbtntext = 'Check Out';
                    this.isCheckOut = true;
                    this.setState({ render: true });
                }
            }
        } else {
            /*
            if(!this.isCheckOut){
                
            }*/

            this.rightbtntext = 'Check Out';
            this.isCheckOut = true;
            this.setState({ render: true });
        }
        this.props.onSwipe(false);
    }

    onSwipeRelease = () => {
        this.props.onSwipe(true);
    }

    render() {

        let isCheckedOut = false;
        var status = getStatusToNumber(this.data.status);
        var statusColor = getStatusColor(status);
        var displayService = '';
        let _this = this;
        let height = 70;
        if (this.props.data.id > 0) {
            height = 105;
            var info_client = '';
            if (this.data.client_full_name != '') {
                info_client += this.data.client_full_name;
            }
            if (this.data.firstname != '' && this.data.client_full_name == '') {
                info_client += this.data.firstname;
            }
            if (this.data.lastname != '' && this.data.client_full_name == '') {
                info_client += this.data.lastname;
            }

            if (this.data.phone != '') {
                info_client += ' - ' + this.data.phone;
            } else if (this.data.email != '') {
                info_client += ' - ' + this.data.email;
            }
            // console.log(info_client);
            // console.log('this.props.id', this.props.id);

            // if(this.props.byday){
            //     let techServices = this.data.services.filter(function(item){
            //         return item.technicianId == _this.props.techId;      
            //     });

            //     if(techServices.length){
            //         if(techServices.length > 1){
            //             displayService = techServices.length + ' services';
            //         } else{
            //             displayService = techServices[0].name 
            //         } 

            //         if(this.props.userData.role == 9 && this.props.userData.isManageTurn){
            //             if(!this.isDone){
            //                 let firstService = techServices[0];

            //                 if(firstService.checkedOutDate != null && String.prototype.trim.call(firstService.checkedOutDate) != ''){
            //                     isCheckedOut = true;
            //                 }
            //             }else{
            //                 isCheckedOut = true;
            //             }

            //         }
            //     }
            // }else {
            //     let countService = this.data.services.length;
            //     if(countService){
            //         if(countService > 1){
            //             displayService = countService + ' services';
            //         } else{
            //             displayService = this.data.services[0].name;
            //         }   
            //     }
            // }
        }
        let displayCheckOut = false;
        if (isCheckedOut) {
            displayCheckOut = (
                <Icon
                    name={"check"}
                    size={20}
                    color={
                        color.blackRGB
                    }
                    style={styles.checkouticon}
                />
            );
        }

        let childcontent = (
            <View style={{ flex: 1 }}>
                {this.props.id > 0 &&
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ flex: 1 }}
                        onPress={() => this._onPress(this.props.id, this.data.type, this.data)}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={styles.itemrowTop}>
                                <Text style={styles.itemTopLeft}>
                                    {moment(this.data.start).format(
                                        "hh:mm A"
                                    )}
                                </Text>
                                <Text style={styles.itemTopRight}>
                                    {info_client}
                                </Text>
                            </View>
                            <View style={styles.itemrowBottomcode}>
                                <Text
                                    style={[styles.itemTopLeft]}>
                                    {this.data.bookingcode}
                                </Text>
                                <Text style={styles.itemBottomRight}>
                                    {this.data.channel}
                                </Text>
                                {(this.data.isRequested === 1 || this.data.isRequestedTechnician === 1) &&
                                    <Text style={styles.itemBottomRightRequire}>
                                        (R)
                                    </Text>
                                }

                            </View>
                            <View style={styles.itemrowBottom}>
                                <Text
                                    style={[
                                        styles.itemBottomLeft,
                                        { color: statusColor }
                                    ]}>
                                    {getTextByKey(this.props.language, status)}
                                </Text>
                                <Text style={styles.itemBottomRight}>
                                    {this.data.name}
                                </Text>
                            </View>
                            {displayCheckOut}
                        </View>
                    </TouchableOpacity>}
                {(this.props.id == 0 || typeof (this.props.id) == 'undefined') &&
                    <View style={styles.sectionheaderempty}>
                        <Text style={styles.sectionheaderemptytext}>
                            {getTextByKey(this.props.language, 'noappointment')}
                        </Text>
                    </View>}
            </View>
        )
        let canSwipe = false;
        if (this.props.id && this.props.userData.role == 9 && !isCheckedOut && (this.props.isStart || this.props.isCheckout)) {
            canSwipe = true;

            let checkedInDate = '';
            let checkedOutDate = '';
            let userData = this.props.userData;
            let techService = this.data.services.filter(function (item) {
                return item.technicianId == userData.id && item.checkedInDate != '' && item.checkedInDate != null;
            });

            let techServiceCheckedOut = this.data.services.filter(function (item) {
                return item.technicianId == userData.id && item.checkedOutDate != '' && item.checkedOutDate != null;
            });

            if (techService.length) {
                checkedInDate = techService[0].checkedInDate;
            }

            if (techServiceCheckedOut.length) {
                checkedOutDate = techServiceCheckedOut[0].checkedOutDate;
            }

            if (checkedInDate != '' && !this.props.isCheckout) {
                canSwipe = false;
            }

            if (canSwipe && checkedOutDate != '') {
                canSwipe = false;
            }

        }

        let rightButtons = [
            <TouchableOpacity activeOpacity={1} style={styles.checkoutbtn} onPress={() => this.onPressRightButton(this.data)}>
                <Text style={styles.checkoutbtnText}>{this.rightbtntext}</Text>
            </TouchableOpacity>
        ];
        return (
            <View style={[styles.itemContainer, { height: height }]}>
                {canSwipe &&
                    <Swipeable onRef={ref => this.SwipeableRef = ref} rightButtons={rightButtons} style={{ flex: 1 }} rightButtonWidth={90} onSwipeStart={() => { this.onSwipeStart(this.data); }} onSwipeRelease={this.onSwipeRelease}>
                        {childcontent}
                    </Swipeable>
                }

                {!canSwipe && childcontent}

                <SubmitLoader
                    ref="appointmentLoader"
                    visible={false}
                    textStyle={layout.textLoaderScreenSubmit}
                    textContent={"Processing..."}
                    color={Colors.spinnerLoaderColorSubmit}
                />
                <IconLoader
                    ref="appointmentSuccessLoader"
                    visible={false}
                    textStyle={layout.textLoaderScreenSubmitSucccess}
                    textContent={"Checked Out"}
                    color={Colors.spinnerLoaderColorSubmit}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    checkoutbtn: {
        height: 70,
        backgroundColor: color.reddish,
        justifyContent: 'center',
        paddingRight: 10,
        position: 'absolute',
        alignItems: "center",
        width: 100

    },
    checkoutbtnText: {
        color: color.white
    },
    itemContainer: {
        height: 105,
        borderBottomColor: color.cream,
        borderBottomWidth: 0.5
    },
    itemrowTop: {
        flex: 1,
        flexDirection: "row",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: 35,
        alignItems: "center",
        paddingTop: 8
    },

    itemrowBottom: {
        flex: 1,
        flexDirection: "row",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: 35,
        alignItems: "center",
        paddingBottom: 8
    },
    itemrowBottomcode: {
        flex: 1,
        flexDirection: "row",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: 35,
        alignItems: "center",
        paddingBottom: 0
    },
    itemTopLeft: {
        paddingLeft: 15,
        width: 110
    },
    itemBottomLeft: {
        paddingLeft: 15,
        width: 110,
        color: color.silver
    },
    itemTopRight: {
        //paddingLeft:15
    },
    itemBottomRight: {
        color: color.silver
        // paddingLeft:15
    },
    itemBottomRightRequire: {
        color: "#ff102f",
        marginLeft: 15
    },
    sectionheaderempty: {
        paddingLeft: 15,
        justifyContent: "center",
        flex: 1
    },
    sectionheaderemptytext: {
        color: color.silver
    },
    checkouticon: {
        position: 'absolute',
        top: 25,
        right: 15
    }
});
