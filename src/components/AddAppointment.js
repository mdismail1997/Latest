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
import ClientSearchModal from "../components/ClientSearchModal";
import ServiceSearchList from "../components/ServiceSearchList";
import AppointmentSelectTime from "../components/AppointmentSelectTime";
import ButtonAddService from "../components/ButtonAddService";
import CouponAppointment from "../components/CouponAppointment";
import AppointmentSelectedService from "../components/AppointmentSelectedService";
import moment from "moment";
import AppointmentTechnicianSearchList from "../components/AppointmentTechnicianSearchList";
import StatusSearchList from "../components/StatusSearchList";
import SubmitLoader from "../helpers/submitloader";
import IconLoader from "../helpers/iconloader";
import Colors from "../constants/Colors";
import setting from "../constants/Setting";
import SpinnerLoader from "../helpers/spinner";
import FloatLabelSelectPrice from "../components/FloatSelectInputPrice";
import PaymentCash from "../components/PaymentCash";
import PaymentCreditCard from "../components/PaymentCreditCard";
import Paymentphysical from "../components/PaymentPhysical";
import AppointmentPaymentTotal from "../components/AppointmentPaymentTotal";
import AppointmentPaymentRemaining from "../components/AppointmentPaymentRemaining";
import { formatPhone } from "../helpers/Utils";
import emailvalidator from "email-validator";
import { getTextByKey } from "../helpers/language";
import { fetchLoadingCouponAvailable } from "../helpers/fetchdata";
import { fetchClientsDataByID } from "../api/fetchdata";
import CheckBox from 'react-native-check-box';
import AddClient from "../components/AddClient";
import { color } from "../assets/colors/colors";
import { gStrings } from "./staticStrings";
import { api } from "../api/api";
import { apiHeader } from "../api/apiHeader";
export default class AddAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.DescriptionInputRef = React.createRef();
        this.tabsRef = React.createRef();
        this.clientInputRef = React.createRef();
        this.clientlistmodalRef = React.createRef();
        this.timeInputRef = React.createRef();
        this.AppointmentSelectedServiceRef = React.createRef();
        this.btnAddServiceRef = React.createRef();
        this.statusInputRef = React.createRef();
        this.rewardpointInputRef = React.createRef();
        this.applygiftInputRef = React.createRef();
        this.couponRef = React.createRef();
        this.selecttimeRef = React.createRef();
        this.servicelistRef = React.createRef();
        this.technicianlistRef = React.createRef();
        this.statuslistRef = React.createRef();
        this.tabspaymentRef = React.createRef();
        this.tabpaymenthistoryRef = React.createRef();
        this.AppointmentHistoryPaymentTotalRef = React.createRef();
        this.AppointmentHistoryPaymentRemainingRef = React.createRef();
        this.tabnewpaymentRef = React.createRef();
        this.AppointmentNewPaymentTotalRef = React.createRef();
        this.AppointmentNewPaymentRemainingRef = React.createRef();
        this.cashInputRef = React.createRef();
        this.creditcardInputRef = React.createRef();
        this.physicalInputRef = React.createRef();
        this.paymentCashInputRef = React.createRef();
        this.paymentCreditCardInputRef = React.createRef();
        this.paymentPhysicalInputRef = React.createRef();
        this.appointmentLoaderRef = React.createRef();
        this.appointmentLoader_physical_Ref = React.createRef();
        this.appointmentSuccessLoaderRef = React.createRef();
        this.appointmentdetailloaderRef = React.createRef();
        this.addClientRef = React.createRef();

    }
    propsServices = this.props.services;
    clientName = "";
    technicianName = "";
    statusName = "";
    selectedTime = "";
    selectedClient = 0;
    selectedTechnician = 0;
    selectedStatus = "";
    selectedDate = moment().tz(this.props.timezone);
    selectedHour = "";
    appointmentDate = "";
    appointmentHour = "";
    selectServices = {};
    combos = this.props.combos;
    payments = [];
    total = 0;
    remaining = 0;
    paid_total = 0;
    newPaymentAnimation = "none";
    cashAmount = "";
    creditcardAmount = "";
    physicalAmount = "";
    ccnumber = "";
    ccholdername = "";
    ccexpiredate = "";
    cccvv = "";
    ccnumberCN = "";
    ccholdernameCN = "";
    ccexpiredateCN = "";
    replyid = '';
    reply_status = '';
    Description = '';
    isRequested = false;
    isShowLoaderAppointmentDetails = false;
    title = this.props.title;
    columnWidth = Dimensions.get("window").width / 2;
    fullWidth = Dimensions.get("window").width;
    deviceid = this.props.deviceid;
    userData = this.props.userData;
    clients = this.props.clients;
    isClientPhone = false;
    isValidClient = false;
    turns = [];
    promotions = {};
    promotionsApplied = {};
    paidcoupon = 0;
    state = {
        modalVisible: false,
        clientSelected: 0,
        serviceSelected: 0,
        appointmentId: 0
    };
    promocodegiftapply = "";
    giftcodeapply = {};
    rewardpointsalon = "";

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
        this.isShowLoaderAppointmentDetails = true;
        if (this.appointmentdetailloaderRef.current != null) {
            this.isShowLoaderAppointmentDetails = true;
        } else {
        }
        this.clearForm();
        this.title = getTextByKey(this.props.language, 'editappointmenttitle');
        this.setState({ modalVisible: true });
    };

    clearForm = () => {
        this.Description = '';
        this.isRequested = false;
        this.replyid = '';
        this.reply_status = '';
        this.clientName = "";
        this.selectedTime = "";
        this.selectedClient = 0;
        this.selectedDate = moment().tz(this.props.timezone);
        this.selectedHour = "";
        this.appointmentDate = "";
        this.appointmentHour = "";
        this.payments = [];
        this.remaining = 0;
        this.total = 0;
        this.paid_total = 0;
        this.newPaymentAnimation = "none";
        this.cashAmount = "";
        this.creditcardAmount = "";
        this.physicalAmount = "";
        this.ccnumber = "";
        this.ccholdername = "";
        this.ccexpiredate = "";
        this.cccvv = "";
        this.ccnumberCN = "";
        this.ccholdernameCN = "";
        this.ccexpiredateCN = "";
        this.paidcoupon = 0;
        let firstService = {
            id: 0,
            service_name: getTextByKey(this.props.language, 'selectserviceappointment'),
            price: 0,
            technicianId: 0,
            technicianName: getTextByKey(this.props.language, 'anytech'),
            isCombo: false,
            rewardpoint: 0
        };
        this.promocodegiftapply = "";
        this.rewardpointsalon = "";
        this.giftcodeapply = {};
        this.promotions = {};
        this.promotionsApplied = {};
        this.selectServices = {};
        this.selectServices["service_0"] = firstService;
        if (this.userData.role == 9) {
            this.selectedTechnician = this.userData.id;
        }
    };

    onCloseModalClientList = () => {
        this.tabsRef.current.goToPage(0);
    };

    onCloseModalServiceList = () => {
        this.tabsRef.current.goToPage(0);
    };


    _onSelectedClient = (client, lbl) => {
        let fullinfo = client.fullname + " - " + lbl;
        this.clientInputRef.current.setState({ text: fullinfo });
        Keyboard.dismiss();
        this.clientlistmodalRef.current.show([], false, false, false, '');
        this.selectedClient = client.id;
        if (this.appointmentDate != "") {
            this._onGetCoupon();
        }
    }
    _onAppliedCoupon = (price, promotion) => {
        this.paidcoupon = price;
        this.promotionsApplied = promotion;
    }
    _onGetCoupon = async () => {
        if (this.appointmentDate != '' && this.selectedClient != "") {
            var coupon = await fetchLoadingCouponAvailable(this.appointmentDate, this.selectedClient);

            this.promotions = {};
            if (coupon.membership.length > 0) {
                let _this = this;
                coupon.membership.forEach(function (item) {
                    let membershipitem = item;
                    if (typeof (_this.promotions['membership-' + membershipitem.id]) == 'undefined') {
                        _this.promotions['membership-' + membershipitem.id] = {
                            id: 'membership-' + membershipitem.id,
                            checked: false,
                            services: membershipitem.services,
                            name: membershipitem.title
                        }
                    }
                })
            }
            if (coupon.discount.length > 0) {
                let _this = this;
                coupon.discount.forEach(function (item) {
                    let couponitem = item;
                    if (typeof (_this.promotions['coupon-' + couponitem.code]) == 'undefined') {
                        _this.promotions['coupon-' + couponitem.code] = {
                            id: 'coupon-' + couponitem.code,
                            checked: false,
                            discountvalue: parseFloat(couponitem.amount),
                            discounttype: couponitem.discounttype,
                            code: couponitem.code,
                            service_type: couponitem.service_type,
                            services: couponitem.services
                        }
                    }
                })
            }
            if (parseFloat(coupon.rewardpoint) > 0) {
                if (this.userData.total_points_redeem_online !== null && this.userData.total_points_redeem_online !== 0) {
                    coupon.rewardpoint = this.userData.total_points_redeem_online;
                }

                if (typeof (this.promotions['reward_point']) == 'undefined') {
                    this.promotions['reward_point'] = {
                        id: 'rewardpoint',
                        amount: parseFloat(coupon.rewardpoint),
                        checked: false
                    }
                }
            }

            if (coupon.giftcodes.length > 0) {
                let _this = this;
                coupon.giftcodes.forEach(function (item) {
                    var item_gift_code = item;
                    if (typeof (_this.promotions['giftcode-' + item_gift_code.code]) == 'undefined') {
                        _this.promotions['giftcode-' + item_gift_code.code] = {
                            id: 'giftcode-' + item_gift_code.code,
                            checked: false,
                            amount: item_gift_code.amount,
                            giftid: item_gift_code.id,
                            code: item_gift_code.code
                        }
                    }
                })

            }
            let gift = coupon.giftbalance;
            if (parseFloat(gift) > 0) {
                if (typeof (this.promotions['gift']) == 'undefined') {
                    this.promotions['gift'] = {
                        id: 'gift',
                        checked: false,
                        amount: parseFloat(gift),
                    }
                }
            }


            this.couponRef.current.setDataCoupon(this.promotions);
        }
    }

    createAsNewClient = (value) => {
        this.clientName = value;
        this.selectedClient = 0;
        this.clientlistmodalRef.current.show([], false, false, false, '');
    }

    refreshClients = async () => {
        return true;
        var clientList = await fetch(setting.apiUrl + api.getClients, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.props.token,
            }
        }).then((response) => response.json()).then((responseJson) => {

            if (responseJson.success) {
                AsyncStorage.setItem('list-client', JSON.stringify(responseJson.data));
                return responseJson.data;
            } else {
                Alert.alert('Error', responseJson.message);
                return [];
            }
        }).catch((error) => {
            return [];
        });

        if (clientList.length) {
            this.clients = clientList;
        }

        this.setTextClient(this.clientName);
    }

    setTextClient = async (value) => {
        value = String.prototype.trim.call(value);
        value = value.replace('(', '');
        value = value.replace(')', '');
        value = value.replace(' ', '');
        value = value.replace('-', '');
        let isPhone = false;
        if (value.length >= 3 && !isNaN(value)) {
            let formatValue = formatPhone(value);
            this.clientInputRef.current.setState({ text: formatValue });
            isPhone = true;
            value = formatValue.replace(/[^\d]+/g, '');
        }
        this.clientName = value;
        if (value.length == 4 || value.length == 6 || value.length == 8 || value.length >= 10) {
            let clientsFiltered = [];
            let isActive = false;
            let _this = this;
            if (isPhone) {
                isActive = value.length == 10;
            } else {
                isActive = emailvalidator.validate(String.prototype.trim.call(value));
            }
            let searchData = {};
            searchData.search = value;
            searchData.clientid = '';
            clientsFiltered = await fetchClientsDataByID(searchData, _this.props.token);
            this.isClientPhone = isPhone;
            this.isValidClient = isActive;
            this.clientlistmodalRef.current.show(clientsFiltered.slice(0, 5), isPhone, true, isActive, value);
        } else if (value.length == 0) {
            this.isClientPhone = false;
            this.clientName = '';
            this.isValidClient = false;
            this.clientlistmodalRef.current.show([], false, false, false, value);
        }


    }


    onPressStatus = () => {
        var _this = this;
        this.tabsRef.current.goToPage(4);
        if (this.statuslistRef.current != null) {
            this.statuslistRef.current.setState({ selected: this.selectedStatus });
            this.statuslistRef.current.show();
        } else {
            setTimeout(function () {
                _this.statuslistRef.current.setState({ selected: _this.selectedStatus });
                _this.statuslistRef.current.show();
            }, 0);
        }
    };
    onChecked_Requested_Tech = () => {
        if (this.isRequested) {
            this.isRequested = false;
        } else {
            this.isRequested = true;
        }
        this.setState({ rerender: true });
    }
    onCloseModalTechnicianList = () => {
        this.tabsRef.current.goToPage(0);
    };

    onCloseModalStatusList = () => {
        this.tabsRef.current.goToPage(0);
    };

    _onSelectedStatus = (id, name) => {
        this.statusInputRef.current.setState({ text: this.getText(name) });
        this.statusName = name;
        this.statuslistRef.current.setState({ modalVisible: false });
        this.selectedStatus = id;
        this.tabsRef.current.goToPage(0);
    };

    _onSelectedTechnician = (id, name, keyInList) => {
        let serviceId = 0;
        let serviceName = getTextByKey(this.props.language, 'selectserviceappointment');
        let price = 0;
        let duration = 0;
        let rewardpoint = 0;
        let isCombo = keyInList.indexOf('@combo') >= 0;
        if (!isCombo) {
            if (typeof this.selectServices[keyInList] != 'undefined') {
                serviceId = this.selectServices[keyInList].id;
                serviceName = this.selectServices[keyInList].service_name;
                price = this.selectServices[keyInList].price;
                duration = this.selectServices[keyInList].duration;
                rewardpoint = this.selectServices[keyInList].rewardpoint;
            }
            //console.log(keyInList);
            let selectedData = {
                id: serviceId,
                service_name: serviceName,
                price: price,
                technicianId: id,
                technicianName: name,
                isCombo: false,
                duration: duration,
                rewardpoint: rewardpoint
            };
            this.selectServices[keyInList] = selectedData;
        } else {
            let keydata = keyInList.split('@combo')[0];
            let serviceItemId = keyInList.split('@combo')[1];
            let servicesData = [];
            if (typeof this.selectServices[keydata] != 'undefined') {
                serviceId = this.selectServices[keydata].id;
                serviceName = this.selectServices[keydata].service_name;
                price = this.selectServices[keydata].price;
                servicesData = this.selectServices[keydata].servicesIncombo;
            }

            let selectedData = {
                id: serviceId,
                service_name: serviceName,
                price: price,
                technicianId: id,
                technicianName: name,
                isCombo: true,
                duration: duration,
                rewardpoint: rewardpoint
            };

            let _this = this;
            let comboSelected = this.combos.filter(function (item) {
                return 'combo_' + item.id == serviceId;
            });

            if (comboSelected.length) {
                selectedData.servicesIncombo = comboSelected[0].services;
                selectedData.servicesIncombo.forEach(function (itemService) {
                    let serviceCombo = _this.props.services.filter(function (serviceData) {
                        return serviceData.id == 'service_' + itemService.serviceid;
                    });

                    if (serviceCombo.length) {
                        itemService.servicename = serviceCombo[0].service_name;
                        itemService.duration = serviceCombo[0].duration;
                        if ('service_' + serviceItemId == serviceCombo[0].id) {
                            itemService.technicianId = id;
                            itemService.technicianName = name;

                            let serviceItemComboSelected = servicesData.filter(function (serviceData) {
                                return 'service_' + serviceData.serviceid == serviceCombo[0].id;
                            });
                            if (serviceItemComboSelected.length) {
                                itemService.duration = serviceItemComboSelected[0].duration;
                            }
                            //itemService.duration = 
                        } else {
                            //'service_' + itemService.serviceid;
                            let serviceItemComboSelected = servicesData.filter(function (serviceData) {
                                return 'service_' + serviceData.serviceid == serviceCombo[0].id;
                            });

                            if (serviceItemComboSelected.length) {
                                itemService.technicianId = serviceItemComboSelected[0].technicianId;
                                itemService.technicianName = serviceItemComboSelected[0].technicianName;
                            } else {
                                itemService.technicianId = 0;
                                itemService.technicianName = getTextByKey(this.props.language, 'anytech');
                            }

                        }

                    }
                })
            }
            this.selectServices[keydata] = selectedData;
        }

        this.AppointmentSelectedServiceRef.current.setState({
            selectServices: this.selectServices
        });
        this.couponRef.current.setServices(this.selectServices);
        this.technicianlistRef.current.setState({ modalVisible: false });
        this.tabsRef.current.goToPage(0);

    };

    _onSelectedService = (id, name, price, duration, isCombo, keyInList, rewardpoint) => {
        let technicianId = 0;
        let technicianName = getTextByKey(this.props.language, 'anytech');
        if (typeof this.selectedTechnician != 'undefined' && this.selectedTechnician != 0) {
            technicianId = this.selectedTechnician;
            technicianName = this.technicianName;
        } else if (typeof this.selectServices[keyInList] != 'undefined') {
            technicianId = this.selectServices[keyInList].technicianId;
            technicianName = this.selectServices[keyInList].technicianName;
        }
        let selectedData = {
            id: id,
            service_name: name,
            price: price,
            technicianId: technicianId,
            technicianName: technicianName,
            isCombo: isCombo,
            duration: duration,
            rewardpoint: rewardpoint
        };
        let technicianName1 = getTextByKey(this.props.language, 'anytech');
        if (isCombo) {
            let _this = this;
            let comboSelected = this.combos.filter(function (item) {
                return 'combo_' + item.id == id;
            });
            if (comboSelected.length) {
                selectedData.servicesIncombo = comboSelected[0].services;
                selectedData.servicesIncombo.forEach(function (itemService) {
                    let serviceCombo = _this.props.services.filter(function (serviceData) {
                        return serviceData.id == 'service_' + itemService.serviceid;
                    });
                    if (serviceCombo.length) {
                        itemService.servicename = serviceCombo[0].service_name;
                        itemService.duration = itemService.duration;
                        itemService.price = serviceCombo[0].price;
                        itemService.technicianId = 0;
                        itemService.technicianName = technicianName1;
                    }
                })
            }
        }
        this.selectServices[keyInList] = selectedData;
        this.AppointmentSelectedServiceRef.current.setState({
            selectServices: this.selectServices
        });
        this.couponRef.current.setServices(this.selectServices);

        this.servicelistRef.current.close();
        if (this.technicianlistRef.current != null) {
            this.technicianlistRef.current.close();
        }
        this.tabsRef.current.goToPage(0);
        this.btnAddServiceRef.current.setState({
            isShowPlusService: true,
            count: this.btnAddServiceRef.current.state.count + 1
        });
    };

    removeService = keyInList => {
        var services = {};
        var count = 0;
        for (var key in this.selectServices) {
            if (key != keyInList) {
                count++;
                services[key] = this.selectServices[key];
            }
        }
        this.selectServices = services;

        if (!count) {
            let firstService = {
                id: 0,
                service_name: getTextByKey(this.props.language, 'selectserviceappointment'),
                price: 0,
                technicianId: 0,
                technicianName: getTextByKey(this.props.language, 'anytech'),
                isCombo: false,
                rewardpoint: 0
            };

            this.selectServices["service_0"] = firstService;
            this.btnAddServiceRef.current.setState({
                isShowPlusService: false,
                count: 0
            });
        } else {
            this.btnAddServiceRef.current.setState({
                isShowPlusService: true,
                count: this.btnAddServiceRef.current.state.count - 1
            });
        }

        this.AppointmentSelectedServiceRef.current.setState({
            selectServices: this.selectServices
        });
        this.couponRef.current.setServices(this.selectServices);
        this.servicelistRef.current.close();
        this.tabsRef.current.goToPage(0);

        /*
        if(this.selectServices.length > 1){

        }*/
    };

    onPressSelectTime = () => {
        this.tabsRef.current.goToPage(1);
        if (this.selecttimeRef.current != null) {
            this.selecttimeRef.current.show();
        }
    };

    onPressSelectCash = () => {
        //this.newRemaining = this.creditcardAmount
        if (this.creditcardAmount != "") {
            this.newRemaining =
                parseFloat(this.remaining) - parseFloat(this.creditcardAmount);
        } else if (this.physicalAmount != "") {
            this.newRemaining =
                parseFloat(this.remaining) - parseFloat(this.physicalAmount);
        } else {
            this.newRemaining = this.remaining;
        }

        this.paymentCashInputRef.current.amount = this.cashAmount;
        this.paymentCashInputRef.current.setState({
            modalVisible: true,
            value: this.cashAmount,
            remaining: this.newRemaining
        });
    };
    onPressSelectPhyshical = () => {
        if (this.creditcardAmount != "") {
            this.newRemaining =
                parseFloat(this.remaining) - parseFloat(this.creditcardAmount);
        } else if (this.cashAmount != "") {
            this.newRemaining =
                parseFloat(this.remaining) - parseFloat(this.cashAmount);
        } else {
            this.newRemaining = this.remaining;
        }
        this.paymentPhysicalInputRef.current.amount = this.physicalAmount;
        this.paymentPhysicalInputRef.current.setState({
            modalVisible: true,
            value: this.physicalAmount,
            remaining: this.newRemaining,
            ccnumber: this.ccnumberCN,
            ccholdername: this.ccholdernameCN,
            ccexpiredate: this.ccexpiredateCN,
        });
    };
    onPressSelectCreditCard = () => {
        if (this.cashAmount != "") {
            this.newRemaining =
                parseFloat(this.remaining) - parseFloat(this.cashAmount);
        } else if (this.physicalAmount != "") {
            this.newRemaining =
                parseFloat(this.remaining) - parseFloat(this.physicalAmount);
        } else {
            this.newRemaining = this.remaining;
        }
        this.paymentCreditCardInputRef.current.amount = this.creditcardAmount;
        this.paymentCreditCardInputRef.current.ccnumber = this.ccnumber;
        this.paymentCreditCardInputRef.current.ccholdername = this.ccholdername;
        this.paymentCreditCardInputRef.current.ccexpiredate = this.ccexpiredate;
        this.paymentCreditCardInputRef.current.cccvv = this.cccvv;
        this.paymentCreditCardInputRef.current.setState({
            modalVisible: true,
            value: this.creditcardAmount,
            remaining: this.newRemaining
        });
    };

    onCloseSelectTime = () => {
        this.tabsRef.current.goToPage(0);
    };

    onPressService = (id, refdata) => {
        if (this.appointmentDate == '') {
            Alert.alert('Error', 'Please select Time');
            return true;
        }
        this.tabsRef.current.goToPage(2);
        let _this = this;
        if (this.servicelistRef.current != null) {
            _this.servicelistRef.current.show(refdata, id);
        } else {
            setTimeout(function () {
                _this.servicelistRef.current.show(refdata, id);
            }, 10);
        }
    };

    onPressTechnicianService = (id, refdata) => {
        if (this.appointmentDate == '' && this.userData.isManageTurn) {
            Alert.alert('Error', 'Please select Time to calculate technicians turn');
        } else {
            this.tabsRef.current.goToPage(3);
            let _this = this;
            if (this.technicianlistRef.current != null) {
                this.technicianlistRef.current.setState({
                    selected: id,
                    currentService: refdata
                });
                this.technicianlistRef.current.show(_this.selectServices, _this.appointmentDate, id, refdata);
            } else {
                setTimeout(function () {
                    _this.technicianlistRef.current.setState({
                        selected: id,
                        currentService: refdata
                    });
                    _this.technicianlistRef.current.show(_this.selectServices, _this.appointmentDate, id, refdata);
                }, 0);
            }
        }

    }

    onSelectedTime = (apptDate, apptHour) => {
        this.timeInputRef.current.setState({
            text: apptDate.format("MM-DD-Y") + " " + apptHour
        });
        this.selecttimeRef.current.setState({
            modalVisible: false,
            hourselect: apptHour,
            dateselect: apptDate
        });
        //this.setState({clientSelected: id});
        this.selectedDate = apptDate;
        this.selectedHour = apptHour;
        this.appointmentDate = apptDate.format("DD-MM-Y");
        this.appointmentHour = this.convertTo24Hour(apptHour);
        this.tabsRef.current.goToPage(0);
        if (this.selectedClient != "") {
            this._onGetCoupon();
        }
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

    showPayment = () => {
        let isValid = false;
        if (this.selectedClient == 0 && !this.isValidClient) {
            Alert.alert("Error", this.getText('clientappointmentrequire'));
        } else if (this.selectedHour == "") {
            Alert.alert("Error", this.getText('timeappointmentrequire'));
        } else if (this.selectedStatus == "") {
            Alert.alert("Error", this.getText('statusappointmentrequire'));
        } else {
            isValid = true;
            this.total = 0;
            /*
            Object.values(this.selectServices).map(data => {
                if (data.id > 0) {
                    isValid = true;
                    this.total += parseFloat(data.price);
                    //return;
                }
            });*/


            Object.values(this.selectServices).map(data => {
                let dataId = parseInt(data.id.toString().replace('service_', '').replace('combo_', ''));
                if (dataId > 0) {
                    this.total += parseFloat(data.price);
                } else {
                    isValid = false;
                }
            });

            this.remaining = this.total - parseFloat(this.paid_total) - parseFloat(this.paidcoupon);
            this.remaining = this.remaining.toFixed(2).replace('.00', '');
            //remaining

            if (!isValid) {
                Alert.alert("Error", getTextByKey(this.props.language, 'requireservicesappointment'));
            }
        }
        if (isValid) {
            this.tabsRef.current.goToPage(5);
            let _this = this;
            if (this.payments.length) {
                setTimeout(function () {
                    _this.tabspaymentRef.current.goToPage(0);
                    _this.AppointmentHistoryPaymentTotalRef.current.setState({
                        total: _this.total
                    });
                    _this.AppointmentHistoryPaymentRemainingRef.current.setState({
                        total: _this.remaining
                    });
                }, 0);
            } else {

                setTimeout(function () {
                    _this.tabspaymentRef.current.goToPage(1);
                    _this.AppointmentNewPaymentTotalRef.current.setState({
                        total: _this.total
                    });
                    _this.AppointmentNewPaymentRemainingRef.current.setState({
                        total: _this.remaining
                    });
                }, 0);
            }
        }
    };

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
        let hour = '';
        let minute = '';
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

    calculateEndHour = (start) => {
        let arrTechEndHour = {};
        let end = 0;
        let _this = this;

        Object.values(this.selectServices).map(data => {
            if (!data.isCombo) {
                if (typeof (arrTechEndHour[data.technicianId]) == 'undefined') {
                    let EndTimeService = this.formatHourFromNumber(this.getEndHour(start, data.duration));
                    arrTechEndHour[data.technicianId] = parseInt(EndTimeService.replace(':', ''));
                } else {
                    arrTechEndHour[data.technicianId] = this.getEndHour(this.formatHourFromNumber(arrTechEndHour[data.technicianId]), data.duration);
                }
                if (end < arrTechEndHour[data.technicianId]) {
                    end = arrTechEndHour[data.technicianId];
                }
            } else {

                data.servicesIncombo.forEach(function (itemService) {
                    if (typeof (arrTechEndHour[itemService.technicianId]) == 'undefined') {
                        let EndTimeService = _this.formatHourFromNumber(_this.getEndHour(start, itemService.duration));
                        arrTechEndHour[itemService.technicianId] = parseInt(EndTimeService.replace(':', ''));
                    } else {
                        arrTechEndHour[itemService.technicianId] = _this.getEndHour(_this.formatHourFromNumber(arrTechEndHour[itemService.technicianId]), itemService.duration);
                    }
                    if (end < arrTechEndHour[itemService.technicianId]) {
                        end = arrTechEndHour[itemService.technicianId];
                    }
                });
            }

        });
        return this.formatHourFromNumber(end);
    }
    create_transaction_mx = async (amount, providerid) => {
        var submitData = { amount: amount, providerid: providerid };
        fetch(setting.apiUrl + api.mxcCreateTransaction, {
            method: "POST",
            headers: apiHeader,
            body: JSON.stringify(submitData)
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.success) {
                    this.replyid = responseJson.id;
                    this.callback_transaction_mxmerchant(responseJson.url, responseJson.token, this.callback_transaction_mxmerchant);
                } else {
                    Alert.alert("Error", responseJson.message);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    callback_transaction_mxmerchant = async (url, token, doCallback) => {
        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == 'SENTTOTERMINAL') {
                    setTimeout(async () => {
                        await doCallback(url, token, this.callback_transaction_mxmerchant);
                    }, 1500);
                } else if (responseJson.status == 'APPROVED') {
                    this.reply_status = 'APPROVED';
                    this.submitAppointment('isPhysicalCallback');
                } else {
                    this.replyid = '';
                    this.reply_status = '';
                    var _this = this;
                    Alert.alert("Message", 'Transaction cancelled', [
                        {
                            text: 'OK',
                            onPress: () => { _this.appointmentLoader_physical_Ref.current.setState({ visible: false }); }
                        },
                    ]);

                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    submitAppointment = () => {

        if (this.selectedClient == 0 && !this.isValidClient) {
            Alert.alert("Error", this.getText('clientappointmentrequire'));
        } else if (this.selectedHour == "") {
            Alert.alert("Error", this.getText('timeappointmentrequire'));
        } else if (this.selectedStatus == "") {
            Alert.alert("Error", this.getText('statusappointmentrequire'));
        } else {
            let isValid = true;
            let isValidTech = true;
            Object.values(this.selectServices).map(data => {
                let dataId = parseInt(data.id.toString().replace('service_', '').replace('combo_', ''));
                if (dataId > 0) {
                    /*
                    if(!data.isCombo){
                        if(data.technicianId == 0){
                            isValidTech = false;
                        }        
                    }else{
                        data.servicesIncombo.forEach(function(itemService){
                            if(itemService.technicianId == 0){
                                isValidTech = false;
                            } 
                        })
                    }*/

                } else {
                    isValid = false;
                }
            });

            if (!isValid) {
                Alert.alert("Error", getTextByKey(this.props.language, 'requireservicesappointment'));
            } else {
                if (this.userData.role == 4 && this.physicalAmount != "" && this.userData.GatewayPayment == 'mxmerchant' && this.reply_status == '') {
                    this.appointmentLoader_physical_Ref.current.setState({ visible: true, textContent: 'Please complete this transaction on the terminal.' });
                    this.create_transaction_mx(this.physicalAmount, this.userData.id);
                    return true;
                }

                let submitData = {};
                submitData.promotions = this.promotionsApplied;
                submitData.isClientPhone = this.isClientPhone ? 1 : 0;
                submitData.clientName = this.clientName;
                submitData.appointment_id = this.state.appointmentId;
                submitData.client_id = this.selectedClient;

                submitData.appointment_hour = String.prototype.trim.call(
                    this.convertTo24Hour(this.selectedHour)
                );

                submitData.appointment_day = this.appointmentDate;
                submitData.appointment_status = this.selectedStatus;
                submitData.technician_id = this.selectedTechnician;
                submitData.appointment_endhour = this.calculateEndHour(submitData.appointment_hour);
                submitData.rewardpointsalon = this.rewardpointsalon == "" ? 0 : this.rewardpointsalon;
                submitData.Description = this.Description;
                submitData.isRequested = this.isRequested;
                let services = [];
                let _this = this;
                var end_time_cus = '';
                var start_time_cus = '';
                let EndTimeService = '';
                Object.values(this.selectServices).map(data => {
                    let dataid = parseInt(data.id.toString().replace('service_', '').replace('combo_', ''))
                    if (!data.isCombo) {
                        if (this.userData.notcalculatorServiceDuration == 1) {
                            start_time_cus = submitData.appointment_hour;
                            EndTimeService = this.formatHourFromNumber(this.getEndHour(start_time_cus, data.duration));
                        } else {
                            if (end_time_cus == '') {
                                end_time_cus = submitData.appointment_hour;
                            }
                            if (start_time_cus == '') {
                                start_time_cus = submitData.appointment_hour;
                            } else start_time_cus = end_time_cus;

                            EndTimeService = this.formatHourFromNumber(this.getEndHour(end_time_cus, data.duration));

                            if (end_time_cus != '') {
                                end_time_cus = EndTimeService;
                            }
                        }


                        let submitDataService = {
                            serviceid: dataid,
                            price: data.price,
                            isCombo: 0,
                            technicianId: data.technicianId,
                            endTime: EndTimeService,
                            startTime: start_time_cus,
                            rewardpoint: data.rewardpoint,
                            rewardpointvip: data.rewardpointvip
                        };
                        if (this.state.appointmentId > 0) {
                            if (typeof data.appointment_service_id == "undefined")
                                data.appointment_service_id = 0;
                            submitDataService.appointment_service_id = data.appointment_service_id;
                        }


                        if (this.userData.role == 9 && data.technicianId == 0) {
                            submitDataService.technicianId = this.userData.id;
                        }
                        services.push(submitDataService);
                    } else {
                        let submitDataService = {
                            comboid: dataid,
                            price: data.price,
                            isCombo: 1,
                            services: [],
                            rewardpoint: data.rewardpoint
                        };

                        if (this.state.appointmentId > 0) {
                            if (typeof data.appointment_combo_id == "undefined")
                                data.appointment_combo_id = 0;
                            submitDataService.appointment_combo_id = data.appointment_combo_id;
                        }

                        data.servicesIncombo.forEach(function (itemService) {
                            if (this.userData.notcalculatorServiceDuration == 1) {
                                start_time_cus = submitData.appointment_hour;
                                EndTimeService = this.formatHourFromNumber(this.getEndHour(start_time_cus, data.duration));
                            } else {
                                if (end_time_cus == '') {
                                    end_time_cus = submitData.appointment_hour;
                                }
                                if (start_time_cus == '') {
                                    start_time_cus = submitData.appointment_hour;
                                } else start_time_cus = end_time_cus;
                                EndTimeService = _this.formatHourFromNumber(_this.getEndHour(end_time_cus, itemService.duration));
                                end_time_cus = EndTimeService;
                            }

                            let serviceSubmit = {
                                id: itemService.serviceid,
                                price: itemService.price,
                                technicianId: itemService.technicianId,
                                startTime: start_time_cus,
                                endTime: EndTimeService
                            };
                            if (_this.state.appointmentId > 0) {
                                if (typeof itemService.appointment_service_id == "undefined")
                                    itemService.appointment_service_id = 0;
                                serviceSubmit.appointment_service_id = itemService.appointment_service_id;
                            }

                            if (_this.userData.role == 9 && itemService.technicianId == 0) {
                                serviceSubmit.technicianId = _this.userData.id;
                            }

                            submitDataService.services.push(serviceSubmit);
                        });

                        if (this.userData.role == 9 && data.technicianId == 0) {
                            submitDataService.technicianId = this.userData.id;
                        }
                        services.push(submitDataService);
                    }

                });
                submitData.services = services;
                if (this.cashAmount != "") {
                    submitData.isCash = "true";
                    submitData.cashAmount = this.cashAmount;
                }
                if (this.creditcardAmount != "") {
                    submitData.isCreditCard = "true";
                    submitData.ccAmount = this.creditcardAmount;
                    submitData.expireDate = this.ccexpiredate;
                    submitData.cardnumber = this.ccnumber;
                    submitData.Cardholdername = this.ccholdername;
                    submitData.cvc = this.cccvv;
                }
                if (this.physicalAmount != "") {
                    submitData.isPhysical = "true";
                    submitData.ccAmount = this.physicalAmount;
                    submitData.ccexpiredateCN = this.ccexpiredateCN;
                    submitData.ccnumberCN = this.ccnumberCN;
                    submitData.ccholdernameCN = this.ccholdernameCN;
                    submitData.replayId = this.replyid;

                }
                let deviceid = this.deviceid;
                submitData.device_id = deviceid;
                if (typeof (isPhysicalCallback) == "undefined") {
                    this.appointmentLoaderRef.current.setState({ visible: true });
                }
                fetch(setting.apiUrl + api.bookAppointment, {
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
                            if (typeof (isPhysicalCallback) == "undefined") {
                                this.appointmentLoaderRef.current.setState({ visible: false });
                            } else {
                                this.appointmentLoader_physical_Ref.current.setState({ visible: false });
                            }
                            setTimeout(function () {
                                _this.fetchError(responseJson);
                            }, 100);

                        } else {
                            if (typeof (isPhysicalCallback) == "undefined") {
                                this.appointmentLoaderRef.current.setState({ visible: false });
                            } else {
                                this.appointmentLoader_physical_Ref.current.setState({ visible: false });
                            }
                            let successMessage = this.getText('bookedappointmentmessage');
                            if (submitData.appointment_id > 0) {
                                successMessage = this.getText('updatedappointmentmessage');
                            }
                            this.appointmentSuccessLoaderRef.current.setState({
                                textContent: successMessage,
                                visible: true
                            });
                            let _this = this;
                            setTimeout(function () {
                                _this.appointmentSuccessLoaderRef.current.setState({
                                    visible: false
                                });
                                _this.props.SaveAppointmentSuccess(
                                    _this.state.appointmentId,
                                    responseJson.data
                                );
                            }, 2000);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
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
            //console.log(responseJson.message);
        }
    }

    takeNewPayment = () => {
        this.tabspaymentRef.current.goToPage(1);
        this.total = 0;
        Object.values(this.selectServices).map(data => {
            if (parseInt(data.id.toString().replace('service_', '').replace('combo_', '')) > 0) {
                isValid = true;
                this.total += parseFloat(data.price);
                //return;
            }
        });

        this.remaining = this.total - parseFloat(this.paid_total) - parseFloat(this.paidcoupon);
        this.remaining = this.remaining.toFixed(2).replace('.00', '');
        let _this = this;
        setTimeout(function () {
            _this.AppointmentNewPaymentTotalRef.current.setState({
                total: _this.total
            });

            _this.AppointmentNewPaymentRemainingRef.current.setState({
                total: _this.remaining
            });
        }, 0);
    };

    closePaymentHistory = () => {
        this.tabsRef.current.goToPage(0);
    };

    closeNewPayment = () => {
        if (this.payments.length) {
            this.tabspaymentRef.current.goToPage(0);
        } else {
            this.tabsRef.current.goToPage(0);
        }
    };

    _onSaveCash = amount => {
        this.paymentCashInputRef.current.setState({ modalVisible: false });
        this.tabspaymentRef.current.goToPage(1);

        if (amount != "") {
            this.cashInputRef.current.setState({ text: "Cash", placeholder: amount });
            amount = amount.replace("$", "");
            amount = amount.replace(",", "");
        } else {
            this.cashInputRef.current.setState({ text: "", placeholder: "Cash" });
        }
        this.cashAmount = amount;
    };

    _onSavePhysical = (
        amount
    ) => {
        this.paymentPhysicalInputRef.current.setState({ modalVisible: false });
        this.tabspaymentRef.current.goToPage(1);

        if (amount != "") {
            this.physicalInputRef.current.setState({
                text: "Physical",
                placeholder: amount
            });
            amount = amount.replace("$", "");
            amount = amount.replace(",", "");
        } else {
            this.physicalInputRef.current.setState({
                text: "",
                placeholder: "Physical"
            });
        }
        this.physicalAmount = amount;
    };
    _onSaveCreditCard = (
        amount,
        ccnumber,
        ccholdername,
        ccexpiredate,
        cccvv
    ) => {
        this.paymentCreditCardInputRef.current.setState({ modalVisible: false });
        this.tabspaymentRef.current.goToPage(1);

        if (amount != "") {
            this.creditcardInputRef.current.setState({
                text: "Credit Card",
                placeholder: amount
            });
            amount = amount.replace("$", "");
            amount = amount.replace(",", "");
        } else {
            this.creditcardInputRef.current.setState({
                text: "",
                placeholder: "Credit Card"
            });
        }
        this.creditcardAmount = amount;
        this.ccnumber = ccnumber;
        this.ccholdername = ccholdername;
        this.ccexpiredate = ccexpiredate;
        this.cccvv = cccvv;
    };

    setapplygift = (value) => {
        value = String.prototype.trim.call(value);
        this.promocodegiftapply = value;
    }
    setrewardpoint = (value) => {
        value = String.prototype.trim.call(value);
        this.rewardpointsalon = value;
    }
    setDescription = (value) => {
        this.Description = value;
        this.setState({
            text: value
        });
    }
    checkCode = async () => {
        let isvalid = true;
        if (String.prototype.trim.call(this.promocodegiftapply) == '') {
            Alert.alert('Error', 'Please enter code');
            isvalid = false;
        } else if (this.selectedClient == 0 && !this.isValidClient) {
            Alert.alert("Error", this.getText('clientappointmentrequire'));
            isvalid = false;
        } else if (this.selectedHour == "") {
            Alert.alert("Error", this.getText('timeappointmentrequire'));
            isvalid = false;
        }

        if (isvalid) {
            let code = this.promocodegiftapply;
            this.appointmentLoaderRef.current.setState({ visible: true });
            let providerid = this.userData.id;
            if (this.userData.role == 9) {
                providerid = serviceprovider_id;
            }
            let postData = {
                clientid: this.selectedClient,
                code: code,
                providerid: providerid
            };

            await fetch(setting.apiUrl + api.promocodeCheck, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.props.token
                },
                body: JSON.stringify(postData)
            }).then((response) => response.json()).then((responseJson) => {
                this.appointmentLoaderRef.current.setState({ visible: false });
                if (!responseJson.success) {
                    setTimeout(function () {
                        Alert.alert('Error', 'Invalid Code');
                    }, 100);

                } else {
                    let isReloadGift = false;
                    if (typeof (this.promotions['giftcode-' + responseJson.code]) == 'undefined') {
                        this.promotions['giftcode-' + responseJson.code] = {
                            id: 'giftcode-' + responseJson.code,
                            checked: false,
                            amount: responseJson.amount,
                            giftid: responseJson.id,
                            code: responseJson.code
                        }
                        isReloadGift = true;
                    }
                    if (isReloadGift) {
                        this.couponRef.current.setDataCoupon(this.promotions);
                    }
                }

            }).catch((error) => {
                console.error(error);
            });
        }
    }
    open_modal_add_client = () => {
        this.addClientRef.current.title = "addnewclient";
        this.addClientRef.current.clientData = {};
        this.addClientRef.current.resetData();
        this.addClientRef.current.setState({ modalVisible: true });
    }
    SaveClientSuccess = (id, x) => {
        this.addClientRef.current.setState({ modalVisible: false });
        let lbl = '';
        let lblResult = '';
        if (typeof x.phone != 'undefined' && x.phone != '' && x.phone != null) {
            lblResult = formatPhone(x.phone);
            lbl += lblResult;
        } else if (typeof x.email != 'undefined' && x.email != '' && x.email != null) {
            lblResult = x.email;
            lbl += lblResult;
        }
        this._onSelectedClient(x, lbl);

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
                        ref={this.tabsRef}
                        renderTabBar={() => <HideTabBar />}
                        locked={true}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={Platform.OS === "android" ? layout.headercontainerAndroid : layout.headercontainer}>
                                <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={Platform.OS === "android" ? layout.headerAndroid : layout.header} >
                                    <View style={layout.headercontrols}>
                                        <TouchableOpacity style={layout.headerNavLeftContainer} activeOpacity={1} onPress={() => this.close()}>
                                            <View style={layout.headerNavLeft}>
                                                <Icon name={"close"} size={20} color={color.whiteRBG1} style={Platform.OS === "android" ? layout.navIcon : layout.navIconIOS} />
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                            <Text style={layout.headertitle}>
                                                {this.title}
                                            </Text>
                                        </View>
                                        <TouchableOpacity style={layout.headerNavRightContainer} activeOpacity={1} onPress={() => this.showPayment()} >
                                            <View style={layout.headerNavRight}>
                                                <Text style={layout.headerNavText}>
                                                    {this.getText('payment')}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            </View>
                            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always'>
                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        {getTextByKey(this.props.language, 'detailappointmenttitle')}
                                    </Text>
                                </View>
                                <View style={layout.floatGroup}>
                                    <FloatLabelTextInput
                                        placeholder={getTextByKey(this.props.language, 'clientphoneoremail')}
                                        value={this.clientName}
                                        onChangeTextValue={(value) => this.setTextClient(value)}
                                        ref={this.clientInputRef}
                                    />
                                </View>
                                <ClientSearchModal
                                    ref={this.clientlistmodalRef}
                                    onSelectedClient={this._onSelectedClient}
                                    createAsNewClient={this.createAsNewClient}
                                    token={this.props.token}
                                    refresh={async () => { await this.refreshClients() }}
                                    open_add_client={this.open_modal_add_client}
                                    language={this.props.language}
                                />
                                <AddClient
                                    visible={false}
                                    ref={this.addClientRef}
                                    token={this.props.token}
                                    SaveClientSuccess={this.SaveClientSuccess}
                                    language={this.props.language}

                                />
                                <View style={layout.floatGroup}>
                                    <FloatLabelSelect
                                        placeholder={this.getText('time')}
                                        value={this.selectedTime}
                                        onPress={this.onPressSelectTime}
                                        ref={this.timeInputRef}
                                    />
                                </View>
                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        {getTextByKey(this.props.language, 'servicesappointmenttitle')}
                                    </Text>
                                </View>

                                <AppointmentSelectedService
                                    ref={this.AppointmentSelectedServiceRef}
                                    selectServices={this.selectServices}
                                    onPress={this.onPressService}
                                    onPressTechnician={this.onPressTechnicianService}
                                    userData={this.userData}
                                    services={this.services}
                                    combos={this.combos}

                                />

                                <ButtonAddService
                                    ref={this.btnAddServiceRef}
                                    onPress={this.onPressService}
                                    language={this.props.language}
                                />

                                <View style={layout.floatGroupSeperate} />

                                <View style={layout.floatGroup}>
                                    <FloatLabelSelect
                                        placeholder={this.getText('status')}
                                        value={this.getText(this.statusName)}
                                        onPress={this.onPressStatus}
                                        ref={this.statusInputRef}
                                    />
                                </View>
                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        Note
                                    </Text>
                                </View>
                                <View style={layout.floatGroup}>

                                    <TextInput
                                        multiline={true}
                                        numberOfLines={6}
                                        style={[styles.textarea]}
                                        placeholder='Enter note'
                                        placeholderTextColor={color.placeHolderColor}
                                        onChangeText={(value) => this.setDescription(value)}
                                        ref={this.DescriptionInputRef}
                                        value={this.Description}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        Requested Technician
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <CheckBox
                                        style={{ flex: 1, padding: 10 }}
                                        onClick={() => this.onChecked_Requested_Tech()}
                                        isChecked={this.isRequested}
                                        rightText={'Requested'}
                                        rightTextStyle={{ fontSize: 13, color: color.silver }}
                                        disabled={false}
                                    />
                                </View>

                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        Reward point
                                    </Text>
                                </View>

                                <View style={layout.floatGroup}>
                                    <TextInput
                                        style={[styles.textbox]}
                                        placeholder='Enter reward point'
                                        placeholderTextColor={color.placeHolderColor}
                                        onChangeText={(value) => this.setrewardpoint(value)}
                                        ref={this.rewardpointInputRef}
                                        // value={this.rewardpointsalon} 
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        {getTextByKey(this.props.language, 'redeemgiftcode')}
                                    </Text>
                                </View>


                                <View style={[styles.searchContainer, { width: "100%", alignSelf: 'stretch', }]} >
                                    <TextInput
                                        style={[styles.textbox]}
                                        placeholder='Enter gift card code'
                                        placeholderTextColor={color.placeHolderColor}
                                        onChangeText={value => this.setapplygift(value)}
                                        ref={this.applygiftInputRef}
                                        // value={this.promocodegiftapply} 
                                        underlineColorAndroid={'transparent'}
                                    />

                                    <TouchableOpacity style={styles.searchbox} activeOpacity={1} onPress={async () => { await this.checkCode() }}>
                                        <LinearGradient
                                            start={[0, 0]}
                                            end={[1, 0]}
                                            colors={[color.reddish, color.reddish]}
                                            style={[styles.btnLinearPromo, styles.active]}
                                        >
                                            <Text style={styles.txtsearchtext}> {getTextByKey(this.props.language, 'applygiftcode')}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>


                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        {getTextByKey(this.props.language, 'coupon')}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <CouponAppointment ref={this.couponRef} language={this.props.language} paid_total={this.paid_total} payments={this.payments} selectServices={this.selectServices} onPress={this._onAppliedCoupon} />
                                </View>

                                <View style={layout.floatGroupSeperate} />
                                <View style={styles.btnSave}>
                                    <TouchableOpacity activeOpacity={1} style={styles.btnSaveWraper} onPress={this.submitAppointment}>
                                        <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={styles.btnLinear} >
                                            <Text style={styles.btnSaveText}>
                                                {this.getText('saveappointment')}
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
                                ref={this.selecttimeRef}
                                timezone={this.props.timezone}
                                onClose={this.onCloseSelectTime}
                                language={this.props.language}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <ServiceSearchList
                                ref={this.servicelistRef}
                                data={this.propsServices}
                                combos={this.combos}
                                //selected={this.state.serviceSelected}
                                currentService={"service_0"}
                                onSelected={this._onSelectedService}
                                onClose={this.onCloseModalServiceList}
                                onDelete={this.removeService}
                                categories={this.props.categories}
                                language={this.props.language}
                            />

                        </View>
                        <View style={{ flex: 1 }}>
                            <AppointmentTechnicianSearchList
                                ref={this.technicianlistRef}
                                data={this.props.technicians}
                                currentService={"service_0"}
                                selected={this.selectedTechnician}
                                onSelected={this._onSelectedTechnician}
                                onClose={this.onCloseModalTechnicianList}
                                turns={this.turns}
                                services={this.propsServices}
                                userData={this.userData}
                                language={this.props.language}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <StatusSearchList
                                ref={this.statuslistRef}
                                data={this.props.listStatus}
                                selected={this.selectedStatus}
                                onSelected={this._onSelectedStatus}
                                onClose={this.onCloseModalStatusList}
                                language={this.props.language}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <ScrollableTabView ref={this.tabspaymentRef} renderTabBar={() => <HideTabBar />} locked={true} >
                                <View style={{ flex: 1 }} tabLabel="tab1" ref={this.tabpaymenthistoryRef} >
                                    <View style={Platform.OS === "android" ? layout.headercontainerAndroid : layout.headercontainer} >
                                        <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={Platform.OS === "android" ? layout.headerAndroid : layout.header} >
                                            <View style={layout.headercontrols}>
                                                <TouchableOpacity style={layout.headerNavLeftContainer} activeOpacity={1} onPress={() => this.closePaymentHistory()}>
                                                    <View style={layout.headerNavLeft}>
                                                        <Icon name={"chevron-left"} size={30} color={color.whiteRBG1} style={Platform.OS === "android" ? layout.navIcon : layout.navIconIOS} />
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                                    <Text style={layout.headertitle}>
                                                        {this.getText('paymenthistory')}
                                                    </Text>
                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <ScrollView keyboardShouldPersistTaps='always'>
                                            <View style={styles.summaryTotalContainer}>
                                                <View style={[styles.summaryTotalLeft, { width: this.columnWidth }]} >
                                                    <Text style={styles.summaryTotalLeftTitle}>
                                                        {this.getText('paymenttotal')}
                                                    </Text>
                                                    <AppointmentPaymentTotal total={this.total} ref={this.AppointmentHistoryPaymentTotalRef} />
                                                </View>
                                                <View style={[styles.summaryTotalRight, { width: this.columnWidth }]} >
                                                    <Text style={styles.summaryTotalRightTitle}>
                                                        {this.getText('paymentremaining')}
                                                    </Text>
                                                    <AppointmentPaymentRemaining total={this.remaining} ref={this.AppointmentHistoryPaymentRemainingRef} />
                                                </View>
                                            </View>
                                            {this.payments.map(
                                                (data, index) => {
                                                    if (data.payment_method == 'cash' && data.amount == 0) {
                                                        return false;
                                                    }
                                                    return (
                                                        <View key={data.id} style={styles.paymenthistoryrow}>
                                                            <View style={[styles.paymenthistoryrowleft, { width: this.fullWidth - 110 }]} >
                                                                <Text>{data.description}</Text>
                                                                <Text style={styles.paymenthistoryrowdate}>{data.date}</Text>
                                                            </View>
                                                            <View style={[styles.paymenthistoryrowright, { width: 110 }]} >
                                                                <Text style={styles.paymenthistoryrowprice}>
                                                                    ${data.amount}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    );
                                                }
                                            )}

                                            <View style={styles.btnSave}>
                                                <TouchableOpacity activeOpacity={1} style={styles.btnSaveWraper} onPress={this.takeNewPayment}>
                                                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={styles.btnLinear} >
                                                        <Text style={styles.btnSaveText}>
                                                            {this.getText('takenewpayment')}
                                                        </Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View>

                                <View style={{ flex: 1 }} tabLabel="tab2" ref={this.tabnewpaymentRef} >
                                    <View style={Platform.OS === "android" ? layout.headercontainerAndroid : layout.headercontainer} >
                                        <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={Platform.OS === "android" ? layout.headerAndroid : layout.header} >
                                            <View style={layout.headercontrols}>
                                                <TouchableOpacity style={layout.headerNavLeftContainer} activeOpacity={1} onPress={() => this.closeNewPayment()} >
                                                    <View style={layout.headerNavLeft}>
                                                        <Icon name={"chevron-left"} size={30} color={color.whiteRBG1} style={Platform.OS === "android" ? layout.navIcon : layout.navIconIOS} />
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                                    <Text style={layout.headertitle}>
                                                        {this.getText('takenewpayment')}
                                                    </Text>
                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <View style={styles.summaryTotalContainer} >
                                            <View style={[styles.summaryTotalLeft, { width: this.columnWidth }]} >
                                                <Text style={styles.summaryTotalLeftTitle}>
                                                    {this.getText('paymenttotal')}
                                                </Text>
                                                <AppointmentPaymentTotal
                                                    total={this.total}
                                                    ref={this.AppointmentNewPaymentTotalRef}
                                                />
                                            </View>
                                            <View style={[styles.summaryTotalRight, { width: this.columnWidth }]} >
                                                <Text style={styles.summaryTotalRightTitle}>
                                                    {this.getText('paymentremaining')}
                                                </Text>
                                                <AppointmentPaymentRemaining
                                                    total={this.remaining}
                                                    ref={this.AppointmentNewPaymentRemainingRef}
                                                />
                                            </View>
                                        </View>
                                        <ScrollView keyboardShouldPersistTaps='always'>
                                            <View style={layout.floatGroupsection} >
                                                <Text style={{ color: color.silver }}> {this.getText('paymentmethod')} </Text>
                                            </View>
                                            <View style={layout.floatGroup}>
                                                <FloatLabelSelectPrice
                                                    placeholder={this.getText('paymentcash')}
                                                    value={""}
                                                    onPress={
                                                        this.onPressSelectCash
                                                    }
                                                    ref={this.cashInputRef}
                                                />
                                            </View>
                                            <View style={layout.floatGroup}>
                                                <FloatLabelSelectPrice
                                                    placeholder={this.getText('paymentcreditcard')}
                                                    value={""}
                                                    onPress={this.onPressSelectCreditCard}
                                                    ref={this.creditcardInputRef}
                                                />
                                            </View>
                                            <View style={layout.floatGroup}>
                                                <FloatLabelSelectPrice
                                                    placeholder={this.getText('paymentphysical')}
                                                    value={""}
                                                    onPress={this.onPressSelectPhyshical}
                                                    ref={this.physicalInputRef}
                                                />
                                            </View>
                                            <View style={styles.btnSave}>
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    style={styles.btnSaveWraper}
                                                    onPress={this.submitAppointment}>
                                                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={styles.btnLinear} >
                                                        <Text style={styles.btnSaveText}>
                                                            {this.getText('savepaymentandcharge')}
                                                        </Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View>
                            </ScrollableTabView>
                            <PaymentCash
                                visible={false}
                                ref={this.paymentCashInputRef}
                                onSave={this._onSaveCash}
                                value={""}
                                remaining={""}
                                language={this.props.language}

                            />
                            <PaymentCreditCard
                                visible={false}
                                ref={this.paymentCreditCardInputRef}
                                onSave={this._onSaveCreditCard}
                                value={""}
                                remaining={""}
                                language={this.props.language}
                            />
                            <Paymentphysical
                                visible={false}
                                ref={this.paymentPhysicalInputRef}
                                onSave={this._onSavePhysical}
                                value={""}
                                remaining={""}
                                language={this.props.language}

                            />

                        </View>
                    </ScrollableTabView>

                    <SubmitLoader
                        ref={this.appointmentLoaderRef}
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmit}
                        textContent={this.getText('processing')}
                        color={Colors.spinnerLoaderColorSubmit}
                    />
                    <SubmitLoader
                        ref={this.appointmentLoader_physical_Ref}
                        visible={false}
                        textContent={this.getText('processing')}
                        physical=""

                    />

                    <IconLoader
                        ref={this.appointmentSuccessLoaderRef}
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmitSucccess}
                        textContent={"Appointment Booked"}
                        color={Colors.spinnerLoaderColorSubmit}
                    />

                    <SpinnerLoader
                        visible={this.isShowLoaderAppointmentDetails}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={color.white}
                        textContent={this.getText('loadingappointment')}
                        color={Colors.spinnerLoaderColor}
                        ref={this.appointmentdetailloaderRef}
                    />
                </SafeAreaView>
            </Modal>
        );
    }
}


const styles = StyleSheet.create({
    container: {
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
    },
    searchContainer: {
        height: 40,
        justifyContent: 'flex-end'
    },
    textarea: {
        color: color.black,
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 13,
        backgroundColor: color.white,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
    },
    textbox: {
        height: 40,
        color: color.black,
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 16,
        backgroundColor: color.white,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        fontFamily: 'Futura'
    },
    searchbox: {
        position: 'absolute',
        zIndex: 1,
        right: 0,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnLinearPromo: {
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        width: 100,
        height: 40,

        borderBottomRightRadius: 5,
        borderTopRightRadius: 5
    },
    txtsearchtext: {
        color: color.white
    }
});
