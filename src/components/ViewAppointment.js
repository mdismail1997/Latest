import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Platform,
    TextInput,
    Alert,
    ScrollView,
    AsyncStorage,
    Dimensions,
    Keyboard,
    SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import ScrollableTabView from "react-native-scrollable-tab-view";
import HideTabBar from "../components/HideTabBar";
import FloatLabelTextInput from "../components/FloatTextInput";
import FloatLabelSelect from "../components/FloatSelectInput";
import ClientSearchList from "../components/ClientSearchList";
import ClientSearchModal from "../components/ClientSearchModal";
import ServiceSearchList from "../components/ServiceSearchList";
import AppointmentSelectTime from "../components/AppointmentSelectTime";
import ButtonAddService from "../components/ButtonAddService";
import AppointmentSelectedService from "../components/AppointmentSelectedServiceForTech";
import moment from "moment";
import AppointmentTechnicianSearchList from "../components/AppointmentTechnicianSearchList";
import StatusSearchList from "../components/StatusSearchList";
import SubmitLoader from "../helpers/submitloader";
import IconLoader from "../helpers/iconloader";
import Colors from "../constants/Colors";
import SpinnerLoader from "../helpers/spinner";
import FloatLabelSelectPrice from "../components/FloatSelectInputPrice";
import PaymentCash from "../components/PaymentCash";
import PaymentCreditCard from "../components/PaymentCreditCard";
import AppointmentPaymentTotal from "../components/AppointmentPaymentTotal";
import AppointmentPaymentRemaining from "../components/AppointmentPaymentRemaining";
import { getDeviceId } from "../helpers/authenticate";
import { formatPhone } from "../helpers/Utils";

import FloatLabelInput from "../components/FloatLabelInput";
import { color } from "../assets/colors/colors";

export default class ViewAppointment extends React.Component {
    clientName = "";
    technicianName = "";
    statusName = "";
    selectedTime = "";
    selectedTechnician = 0;


    appointmentDate = "";
    appointmentHour = "";
    selectServices = {};

    isShowLoaderAppointmentDetails = false;
    title = this.props.title;


    state = {
        modalVisible: false,
        clientSelected: 0,
        serviceSelected: 0,
        appointmentId: 0
    };

    async UNSAFE_componentWillMount() {
        this.selectServices = this.props.selectServices;
    }

    close() {
        //this.resetService();
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
        //this.refs.appointmentdetailloader.setState({visible:true});
        //this.clearForm();
        this.title = "Appointment Details";
        this.setState({ modalVisible: true });
    };
   

    render() {

        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
            >
                <SafeAreaView style={{flex: 1}}>
                <View style={{ flex: 1 }}>
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
                                        
                                    </View>
                                </LinearGradient>
                            </View>
                            <ScrollView style={{flex:1}} keyboardShouldPersistTaps='always'>
                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        Details
                                    </Text>
                                </View>
                                <View style={layout.floatGroup}>
                                    <FloatLabelInput
                                        placeholder={"Client Phone or Email"}
                                        value={this.clientName}
                                    />
                                </View>
                                
                                <View style={layout.floatGroup}>
                                    <FloatLabelInput
                                        placeholder={"Time"}
                                        value={this.selectedTime}
                                    />
                                </View>

                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        Services
                                    </Text>
                                </View>

                                <AppointmentSelectedService
                                    ref="AppointmentSelectedService"
                                    selectServices={this.selectServices}
                                />

                              

                                <View style={layout.floatGroupSeperate} />

                                <View style={layout.floatGroup}>
                                    <FloatLabelInput
                                        placeholder={"Status"}
                                        value={this.statusName}
                                    />
                                   
                                </View>

                                
                            </ScrollView>  
                        </View>
                        



                        
                    </ScrollableTabView>

                    <SpinnerLoader
                        visible={this.isShowLoaderAppointmentDetails}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={color.white}
                        textContent={"Loading Appointment Details..."}
                        color={Colors.spinnerLoaderColor}
                        ref="appointmentdetailloader"
                    />
                </View>
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
        zIndex:1
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
        fontSize: 24
    }
});
