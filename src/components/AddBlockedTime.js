import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Platform,
    Alert,
    ScrollView,
    SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import ScrollableTabView from "react-native-scrollable-tab-view";
import HideTabBar from "../components/HideTabBar";
import FloatLabelTextInput from "../components/FloatTextInput";
import FloatLabelSelect from "../components/FloatSelectInput";
import AppointmentSelectTime from "../components/AppointmentSelectTime";
import moment from "moment";
import BlockedTimeTechnician from "../components/BlockedTimeTechnician";
import SubmitLoader from "../helpers/submitloader";
import IconLoader from "../helpers/iconloader";
import Colors from "../constants/Colors";
import setting from "../constants/Setting";
import SpinnerLoader from "../helpers/spinner";
import { getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";
import { gStrings } from "./staticStrings";
import { api } from "../api/api";
export default class AddBlockedTime extends React.Component {

    titleblockedtime = "";
    startday = "";
    endday = "";
    starttime = "";
    endtime = "";
    startdateTime = "";
    enddateTime = "";
    technicianSelectid = 0;
    technicianSelectName = '';
    selectedDate = moment().tz(this.props.timezone);
    isShowLoaderAppointmentDetails = false;
    state = {
        modalVisible: false,
        blockedtimeId: 0
    };

    close() {
        this.setState({ modalVisible: false });
    }

    show = () => {
        this.setState({ modalVisible: true });
    };

    showLoaderAppointmentDetail = () => {
        if (typeof (this.refs.appointmentdetailloader == "undefined")) {
            this.isShowLoaderAppointmentDetails = true;
        } else {
        }
        this.clearForm();
        this.title = getTextByKey(this.props.language, 'editblockedtimetitle');
        this.setState({ modalVisible: true });
    };

    clearForm = () => {
        this.titleblockedtime = "";
        this.startday = "";
        this.endday = "";
        this.starttime = "";
        this.endtime = "";
        this.startdateTime = "";
        this.enddateTime = "";
        this.technicianSelectid = 0;
        this.technicianSelectName = '';
        this.selectedDate = moment().tz(this.props.timezone);
        this.state = {
            modalVisible: false,
            blockedtimeId: 0
        };
    };

    onCloseModalTechnicianList = () => {
        this.refs.tabs.goToPage(0);
    };

    _onSelectedTechnician = (id, name) => {
        this.technicianSelectid = id;
        this.technicianSelectName = name;
        this.refs.TechnicianInput.setState({ text: name });
        this.refs.technicianlist.setState({ modalVisible: false });
        this.refs.tabs.goToPage(0);
    };


    onPressStartTime = () => {
        var _this = this;
        _this.refs.tabs.goToPage(1);
        if (typeof _this.refs.selecttime != "undefined") {
            _this.refs.selecttime.setState({
                hourselect: _this.starttime,
                dateselect: _this.startday == '' ? _this.selectedDate : _this.startday
            }); 

            _this.refs.selecttime.show("start");
        }else{
            setTimeout(function () {
                _this.refs.selecttime.setState({
                    //modalVisible: false,
                    hourselect: _this.starttime,
                    dateselect: _this.startday == '' ? _this.selectedDate : _this.startday
                }); 
    
                _this.refs.selecttime.show("start");
            }, 0);
        }
    };
    onPressEndTime = () => {
        var _this = this;
        _this.refs.tabs.goToPage(1);
        if (typeof _this.refs.selecttime != "undefined") {
            _this.refs.selecttime.setState({
                //modalVisible: false,
                hourselect: _this.endtime,
                dateselect: _this.endday == '' ? _this.selectedDate : _this.endday
            }); 
            _this.refs.selecttime.show("end");
        }else{
            _this.refs.selecttime.setState({
                //modalVisible: false,
                hourselect: _this.endtime,
                dateselect: _this.endday == '' ? _this.selectedDate : _this.endday
            }); 
            _this.refs.selecttime.show("end");
        }
    };



    onCloseSelectTime = () => {
        this.refs.tabs.goToPage(0);
    };

    onPressTechnicianService = () => {
        this.refs.tabs.goToPage(2);
        let _this = this;
        if (typeof this.refs.technicianlist != "undefined") {
            this.refs.technicianlist.setState({
                selected: _this.technicianSelectid,
            });
            this.refs.technicianlist.show(_this.technicianSelectid);
        } else {
            setTimeout(function () {
                _this.refs.technicianlist.setState({
                    selected: _this.technicianSelectid,
                });
                _this.refs.technicianlist.show(_this.technicianSelectid);
            }, 0);
        }

    }

    onSelectedTime = (apptDate, apptHour, istime) => {
        if(istime == "start"){
            this.refs.StartTimeInput.setState({
                text: apptDate.format("MM-DD-Y") + " " + apptHour
            });
            this.startday = apptDate;
            this.starttime = apptHour;
        }else{
            this.refs.EndTimeInput.setState({
                text: apptDate.format("MM-DD-Y") + " " + apptHour
            });
            this.endday = apptDate;
            this.endtime = apptHour;
        }
/*         this.appointmentDate = apptDate.format("DD-MM-Y");
        this.appointmentHour = this.convertTo24Hour(apptHour); */
        this.refs.selecttime.close();
        this.refs.tabs.goToPage(0);
    };
    setTextTitle = value => {
        this.refs.TitleInput.setState({ text: value });
        this.titleblockedtime = value;
    };
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

    getText(key) {

        return getTextByKey(this.props.language, key);
    }


    getTimeFromMins(mins) {
        if (mins >= 24 * 60 || mins < 0) {
            throw new RangeError(gStrings.validTimeMins);
        }
        var h = mins / 60 | 0,
            m = mins % 60 | 0;
        return (h * 100) + m;
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

    submitAppointment = () => {
        let isValid = true;
        if (this.titleblockedtime == '') {
            isValid = false;
            Alert.alert("Error", this.getText('titleblockedtimerequire'));
        } else if (this.startday == "" || this.endday == "") {
            isValid = false;
            Alert.alert("Error", this.getText('timeblockedtimerequire'));
        } else if (this.technicianSelectName == "") {
            isValid = false;
            Alert.alert("Error", this.getText('technicianrequire'));
        }else if(this.startday != "" && this.endday != ""){
            let start = moment(this.startday.format("MM-DD-Y") + " " + String.prototype.trim.call(this.convertTo24Hour(this.starttime)), "MM-DD-YYYY HH:mm");
            let end = moment(this.endday.format("MM-DD-Y") + " " + String.prototype.trim.call(this.convertTo24Hour(this.endtime)), "MM-DD-YYYY HH:mm");
            if(end <= start){
                isValid = false;
                Alert.alert("Error", this.getText('invalidtimerequire'));
            }
        } 
        if(isValid) {
            let submitData = {};
            submitData.id = this.state.blockedtimeId;
            submitData.title = this.titleblockedtime;
            submitData.technicianSelectid = this.technicianSelectid;
            submitData.startday = this.startday.format("MM-DD-Y");
            submitData.starttime = String.prototype.trim.call(
                this.convertTo24Hour(this.starttime)
            );
            submitData.endday = this.endday.format("MM-DD-Y");
            submitData.endtime = String.prototype.trim.call(
                this.convertTo24Hour(this.endtime)
            );
            this.refs.appointmentLoader.setState({ visible: true });
            fetch(setting.apiUrl + api.blockedTimeUpdate, {
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
                    if (!responseJson.success) {
                        let _this = this;
                        this.refs.appointmentLoader.setState({
                            visible: false
                        });
                        setTimeout(function () {
                            _this.fetchError(responseJson);
                        }, 100);
                    } else {
                        this.refs.appointmentLoader.setState({
                            visible: false
                        });
                        let successMessage = this.getText('newblockedtimemessage');
                        if (submitData.id > 0) {
                            successMessage = this.getText('updatedblockedtimemessage');
                        }
                        this.refs.appointmentSuccessLoader.setState({
                            textContent: successMessage,
                            visible: true
                        }); 
                        let _this = this;
                        setTimeout(function () {
                            _this.refs.appointmentSuccessLoader.setState({
                                visible: false
                            });
                            _this.props.SaveAppointmentSuccess(
                                _this.state.blockedtimeId,
                                responseJson.data
                            );
                        }, 2000);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    fetchError(responseJson) {
        if (
            responseJson.message == "token_expired" ||
            responseJson.message == "token_invalid"
        ) {
            let rootNavigator = this.props.navigation.getNavigator("root");
            rootNavigator.replace("login");
        } else {
            Alert.alert("Error", responseJson.message);
        }
    }
    onDelete = () =>{
        let submitData = {id:this.state.blockedtimeId};
        this.refs.appointmentLoader.setState({ visible: true });
        fetch(setting.apiUrl + api.blockedTimeDelete, {
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
                if (!responseJson.success) {
                    let _this = this;
                    this.refs.appointmentLoader.setState({
                        visible: false
                    });
                    setTimeout(function () {
                        _this.fetchError(responseJson);
                    }, 100);
                } else {
                    this.refs.appointmentLoader.setState({
                        visible: false
                    });
                    let successMessage = this.getText('deleteblockedtimemessage');
                    this.refs.appointmentSuccessLoader.setState({
                        textContent: successMessage,
                        visible: true
                    }); 
                    let _this = this;
                    setTimeout(function () {
                        _this.refs.appointmentSuccessLoader.setState({
                            visible: false
                        });
                        _this.props.SaveAppointmentSuccess(
                            _this.state.blockedtimeId,
                            responseJson.data,
                            "delete"
                        );
                    }, 2000);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollableTabView
                        ref="tabs"
                        renderTabBar={() => <HideTabBar />}
                        locked={true}
                    >
                        <View style={{ flex: 1 }}>
                            <View
                                style={
                                    Platform.OS === "android"
                                        ? layout.headercontainerAndroid
                                        : layout.headercontainer
                                }
                            >
                                <LinearGradient
                                    start={[0, 0]}
                                    end={[1, 0]}
                                    colors={[color.reddish, color.reddish]}
                                    style={
                                        Platform.OS === "android"
                                            ? layout.headerAndroid
                                            : layout.header
                                    }
                                >
                                    <View style={layout.headercontrols}>
                                        <TouchableOpacity
                                            style={
                                                layout.headerNavLeftContainer
                                            }
                                            activeOpacity={1}
                                            onPress={() => this.close()}
                                        >
                                            <View style={layout.headerNavLeft}>
                                                <Icon
                                                    name={"close"}
                                                    size={30}
                                                    color={
                                                    color.whiteRBG1
                                                    }
                                                    style={
                                                        Platform.OS ===
                                                            "android"
                                                            ? layout.navIcon
                                                            : layout.navIconIOS
                                                    }
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                        >
                                            <Text style={layout.headertitle}>
                                                {this.title}
                                            </Text>
                                        </View>
                                        {
                                            this.state.blockedtimeId > 0 &&
                                            <TouchableOpacity
                                            style={layout.headerNavRightContainer}
                                            activeOpacity={1}
                                            onPress={this.onDelete}
                                            >
                                                <View
                                                    style={
                                                        Platform.OS === "android"
                                                            ? layout.headerNavRightProfileAndroidModal
                                                            : layout.headerNavRightProfileModal
                                                    }
                                                >
                                                    <Text style={layout.headerNavText}>
                                                        {this.getText('delete')}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        }

                                    </View>
                                </LinearGradient>
                            </View>
                            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        Enter blocked time
                                    </Text>
                                </View>

                                <View style={layout.floatGroup}>
                                    <FloatLabelTextInput
                                        placeholder={"Title"}
                                        value={this.titleblockedtime}
                                        onChangeTextValue={(value) => this.setTextTitle(value)}
                                        //onPress={async () => {await this.onPressClient()}}
                                        ref="TitleInput"
                                    />
                                </View>
                                <View style={layout.floatGroup}>
                                    <FloatLabelSelect
                                        placeholder={"Start time"}
                                        value={this.startdateTime}
                                        onPress={this.onPressStartTime}
                                        ref="StartTimeInput"
                                    />
                                </View>
                                <View style={layout.floatGroup}>
                                    <FloatLabelSelect
                                        placeholder={"End time"}
                                        value={this.enddateTime}
                                        onPress={this.onPressEndTime}
                                        ref="EndTimeInput"
                                    />
                                </View>
                                <View style={layout.floatGroup}>
                                    <FloatLabelSelect
                                        placeholder={"Select technician"}
                                        value={this.technicianSelectName}
                                        onPress={this.onPressTechnicianService}
                                        ref="TechnicianInput"
                                    />
                                </View>
 
                                <View style={layout.floatGroupSeperate} />
                                <View style={styles.btnSave}>
                                    <TouchableOpacity
                                        activeOpacity={0}
                                        style={styles.btnSaveWraper}
                                        onPress={this.submitAppointment}
                                    >
                                        <LinearGradient
                                            start={[0, 0]}
                                            end={[1, 0]}
                                            colors={[color.reddish, color.reddish]}
                                            style={styles.btnLinear}
                                        >
                                            <Text style={styles.btnSaveText}>
                                                {this.getText('saveblockedtime')}
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>




                        <View style={{ flex: 1 }}>
                            <AppointmentSelectTime
                                selectedDate={this.selectedDate}
                                onPress={this.onSelectedTime}
                                selectedHour={this.selectedHour}
                                data={this.props.availablehours}
                                ref="selecttime"
                                onClose={this.onCloseSelectTime}
                                language={this.props.language}
                                timezone = {this.props.timezone}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                             <BlockedTimeTechnician
                                ref={"technicianlist"}
                                data={this.props.technicians}
                                selected={this.selectedTechnician}
                                onSelected={this._onSelectedTechnician}
                                onClose={this.onCloseModalTechnicianList}
                                userData={this.userData}
                                language={this.props.language}
                            /> 
                        </View>


                    </ScrollableTabView>

                    <SubmitLoader
                        ref="appointmentLoader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmit}
                        textContent={this.getText('processing')}
                        color={Colors.spinnerLoaderColorSubmit}
                    />

                    <IconLoader
                        ref="appointmentSuccessLoader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmitSucccess}
                        textContent={"Blocked time"}
                        color={Colors.spinnerLoaderColorSubmit}
                    />

                    <SpinnerLoader
                        visible={this.isShowLoaderAppointmentDetails}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={color.white}
                        textContent={this.getText('loadingappointment')}
                        color={Colors.spinnerLoaderColor}
                        ref="appointmentdetailloader"
                    />
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //height: 110
    },
    plusservicecontainer: {
        justifyContent: "center",
        borderBottomWidth: 1 / 2,
        borderColor: color.grayishBlue,
        paddingLeft: 15
    },
    plusservice: {
        color: color.reddish
    },
    btnSave: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 15
    },
    btnSaveText: {
        color: color.white,
        fontSize: 16,
        zIndex: 1,
        backgroundColor: "transparent"
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 15,
        right: 15,
        zIndex: 1
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    summaryTotalContainer: {
        height: 60,
        //backgroundColor: "red",
        flexDirection: "row",
        flexWrap: "wrap",
        borderWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: color.whitishBorder
        //marginTop: 10
    },
    summaryTotalLeft: {
        justifyContent: "center",
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderColor: color.whitishBorder,
        alignItems: "center"
    },
    summaryTotalRight: {
        justifyContent: "center",
        alignItems: "center"
    },
    summaryTotalLeftTitle: {
        fontSize: 14
    },
    summaryTotalLeftValue: {
        color: color.reddish,
        fontSize: 24
    },
    summaryTotalRightValue: {
        fontSize: 24
    },
    paymenthistoryrow: {
        height: 50,
        flexDirection: "row",
        justifyContent: "center",
        borderWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: color.whitishBorder
    },
    paymenthistoryrowleft: {
        paddingLeft: 15,
        justifyContent: "center"
    },
    paymenthistoryrowright: {
        paddingRight: 15,
        justifyContent: "center"
    },
    paymenthistoryrowdate: {
        color: color.grayChateu,
        fontSize: 14
    },
    paymenthistoryrowprice: {
        textAlign: "right",
        fontSize: 22
    }
});
