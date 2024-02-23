import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Alert
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import moment from "moment";
// import Router from "../../navigation/Router";
import SubmitLoader from "../../helpers/submitloader";
import Colors from "../../constants/Colors_checkin";
import setting from "../../constants/Setting";
import ModalEditClient from "../../components_checkin/clients/ModalEditClient";
import { color } from "../../assets/colors/colors";
import { api } from "../../api/api";

var width = Dimensions.get('window').width;
var columnWidth = width / 2;
var itemWidth = columnWidth - 23.5;
var lineWidth = columnWidth - 60;
var btnWidth = width - 30;

export default class AppointmentsScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: false
        }
    };

    appointments = this.props.route.params.appointments;
    clientData = this.props.route.params.client;
    time = '';

    isStart = false;
    //appointmentData = {}; 
    appointmentData = this.appointments[0];
    services = [];
    combos = [];
    total = 0;
    appointmentId = 0;

    UNSAFE_componentWillUnmount() {
        Dimensions.removeEventListener("change", () => { });
    }

    UNSAFE_componentWillMount() {
        let _this = this;
        /*
        _this.appointments.forEach(function(item){
            if(item.isCheckedIn != 1 && _this.isStart){
                _this.isStart = false;
                _this.appointmentData = item;
                _this.total = item.grandTotal;
                _this.time = moment(item.startdatetime).format('MM-DD-Y hh:mm A');
                _this.appointmentId = item.id;
                if(item.services.length){
                    _this.services = item.services;
                }   
                if(item.combos.length){
                    _this.combos = item.combos;
                } 
                
            }
        })
        if(_this.isStart && _this.appointments.length){
            item = _this.appointments[0];
            _this.appointmentData = item;
            _this.total = item.grandTotal;
            _this.time = moment(item.startdatetime).format('MM-DD-Y hh:mm A');
            _this.appointmentId = item.id;
            if(item.services.length){
                _this.services = item.services;
            }   
            if(item.combos.length){
                _this.combos = item.combos;
            } 
        }*/

        _this.total = this.appointmentData.grandTotal;
        _this.time = moment(this.appointmentData.startdatetime).format('MM-DD-Y hh:mm A');
        _this.appointmentId = this.appointmentData.id;
        if (this.appointmentData.services.length) {
            _this.services = this.appointmentData.services;
        }
        if (this.appointmentData.combos.length) {
            _this.combos = this.appointmentData.combos;
        }

        //console.log(this.appointmentData);

        width = Dimensions.get('window').width;
        columnWidth = width / 2;
        itemWidth = columnWidth - 23.5;
        lineWidth = columnWidth - 60;
        btnWidth = width - 30;
        Dimensions.addEventListener('change', function () {
            var screen = Dimensions.get('window');
            width = screen.width;
            columnWidth = width / 2;
            itemWidth = columnWidth - 23.5;
            lineWidth = columnWidth - 60;
            btnWidth = width - 30;
            _this.setState({ isReady: true });
        })
    }

    async checkin() {
        this.refs.authenticateLoader.setState({ visible: true });
        let checkinNumber = 0;
        var isSuccess = await fetch(setting.apiUrl + api.checkedIn + this.appointmentId, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + this.props.route.params.token
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                if (!responseJson.success) {
                    return false;
                } else {
                    return true;
                    checkinNumber = responseJson.checkinNumber;
                }
            })
            .catch(error => {
                console.error(error);
                return false;
            });
        this.refs.authenticateLoader.setState({ visible: false });
        if (isSuccess) {
            var points = 0;
            if (typeof (this.props.route.params.clientData.reward_point) != 'undefined') {
                points = this.props.route.params.clientData.reward_point
            }
            this.props.navigation.push('CheckInSuccess', {
                logo_app: this.props.route.params.logo_app,
                userData: this.props.route.params.userData,
                clientSearchData: this.props.route.params.clientData,
                checkinNumber: checkinNumber,
                points: points
            });
        } else {
            setTimeout(function () {
                Alert.alert(
                    "Error",
                    "Check in failed. Please contact administrator."
                );
            }, 100)
        }
    }

    back = () => {
        this.props.navigation.push('home', {
            clients: this.props.route.params.clients,
            token: this.props.route.params.token,
            businessname: this.props.route.params.businessname,
            isShowStaffCheckIn: this.props.route.params.isShowStaffCheckIn,
            logo_app: this.props.route.params.logo_app
        });
    }

    backtohome = () => {
        this.props.navigation.push('home', {
            businessname: this.props.route.params.businessname, isBooked: true, isShowStaffCheckIn: this.props.route.params.isShowStaffCheckIn,
            logo_app: this.props.route.params.logo_app
        });
    }

    editclient = () => {
        this.refs.ModalEditClient.show(this.clientData);
    }

    onUpdatedClient = (client) => {
        this.clientData = client;
        this.refs.ModalEditClient.close();
        this.setState({ rerender: true });
    }

    startAppointment = () => {
        this.props.navigation.push('checkin', {
            clients: this.props.route.params.clients,
            technicians: this.props.route.params.technicians,
            availablehours: this.props.route.params.availablehours,
            services: this.props.route.params.services,
            token: this.props.route.params.token,
            blockedTime: this.props.route.params.blockedTime,
            TechniciansWorkingHour: this.props.route.params.TechniciansWorkingHour,
            userData: this.props.route.params.userData,
            blockedTimeYM: this.props.route.params.loadedYM,
            listcombo: this.props.route.params.listcombo,
            categories: this.props.route.params.categories,
            isShowStaffCheckIn: this.props.route.params.isShowStaffCheckIn,
            isClientExists: this.props.route.params.isClientExists,
            clientData: this.props.route.params.clientData,
            opening_hours: this.props.route.params.opening_hours,
            logo_app: this.props.route.params.logo_app,
            timezone: this.props.route.params.timezone
        });
    }

    editAppointment = () => {
        //console.log(this.appointmentData);
        //console.log(this.clientData);
        /*
        [{
    "category_customname": "Vi Pedicures 1",
    "category_id": "2",
    "category_name": "Pedicures",
    "category_ordering": 1,
    "duration": 20,
    "happyhour": true,
    "id": "service_15",
    "isAddOn": 0,
    "name": "The Pronails Pedicures 02",
    "price": 24,
    "rewardpoint": 0,
    "service_name": "The Pronails Pedicures 02",
    "supply_cost": 0,
    "turn": 0,
}]
        */
        let listCategories = this.props.route.params.listCategories;

        let selectServices = [];
        let techniciansSelected = {};
        this.appointmentData.services.forEach(function (item) {
            let itemService = {};
            itemService.id = 'service_' + item.serviceid;
            itemService.price = parseFloat(item.price);
            itemService.rewardpoint = item.rewardpoint == 0 ? 0 : item.rewardpoint_amount;
            itemService.rewardpoint = itemService.rewardpoint == '' ? 0 : parseFloat(itemService.rewardpoint);
            itemService.service_name = item.name;
            itemService.appointment_service_id = item.id;
            let category = listCategories.filter(function (itemCategory) {
                return itemCategory.id == item.category;
            })[0];

            if (typeof (category) != 'undefined') {
                itemService.category_name = category.originname;
                itemService.category_id = item.category;
            }

            selectServices.push(itemService);


            techniciansSelected[itemService.id] = {};
            let childKey = moment(item.estimatedStartTime).format('HH:mm') + '_' + itemService.id;
            techniciansSelected[itemService.id][childKey] = {};
            techniciansSelected[itemService.id][childKey].start = moment(item.estimatedStartTime).format('HH:mm');
            techniciansSelected[itemService.id][childKey].end = moment(item.estimatedEndTime).format('HH:mm');
            techniciansSelected[itemService.id][childKey].duration = moment(item.estimatedEndTime).diff(moment(item.estimatedStartTime), 'minutes');
            techniciansSelected[itemService.id][childKey].fullname = '';
            techniciansSelected[itemService.id][childKey].id = item.technicianId;
            if (item.technicianId > 0) {
                techniciansSelected[itemService.id][childKey].fullname = item.firstname + ' ' + item.lastname;
            }
        })

        //let combos = [];
        this.appointmentData.combos.forEach(function (item) {
            let itemCombo = {};
            itemCombo.id = 'combo_' + item.comboid;
            itemCombo.price = parseFloat(item.price);
            itemCombo.rewardpoint = item.rewardpoint == 0 || item.rewardpoint == '' ? 0 : parseFloat(item.rewardpoint);
            itemCombo.services = [];
            itemCombo.comboname = item.comboname;
            itemCombo.appointment_combo_id = item.id;
            techniciansSelected[itemCombo.id] = {};
            if (typeof (item.servicesInCombo) != 'undefined') {
                let selectServicesInCombo = [];
                item.servicesInCombo.forEach(function (itemInCombo) {
                    let itemService = {};
                    itemService.id = itemInCombo.serviceid;
                    itemService.serviceid = itemInCombo.serviceid;
                    itemService.technician = itemInCombo.technicianId;
                    itemService.service_name = itemInCombo.name;
                    itemService.appointment_service_id = itemInCombo.id;
                    itemService.price = itemInCombo.price;
                    let category = listCategories.filter(function (itemCategory) {
                        return itemCategory.id == itemInCombo.category;
                    })[0];

                    if (typeof (category) != 'undefined') {
                        itemService.category_name = category.originname;
                        itemService.category_id = itemInCombo.category;
                    }
                    selectServicesInCombo.push(itemService);

                    let childKey = moment(itemInCombo.estimatedStartTime).format('HH:mm') + '_service_' + itemInCombo.serviceid;
                    techniciansSelected[itemCombo.id][childKey] = {};
                    techniciansSelected[itemCombo.id][childKey].start = moment(itemInCombo.estimatedStartTime).format('HH:mm');
                    techniciansSelected[itemCombo.id][childKey].end = moment(itemInCombo.estimatedEndTime).format('HH:mm');
                    techniciansSelected[itemCombo.id][childKey].duration = moment(itemInCombo.estimatedEndTime).diff(moment(itemInCombo.estimatedStartTime), 'minutes');
                    techniciansSelected[itemCombo.id][childKey].fullname = '';
                    techniciansSelected[itemCombo.id][childKey].id = itemInCombo.technicianId;
                    if (itemInCombo.technicianId > 0) {
                        techniciansSelected[itemCombo.id][childKey].fullname = itemInCombo.firstname + ' ' + itemInCombo.lastname;
                    }
                })
                itemCombo.services = selectServicesInCombo;
            }

            selectServices.push(itemCombo);



        })

        //console.log(selectServices);
        //return false;

        let routeParams = {
            isEdit: true,
            clientData: this.clientData,
            services: this.props.route.params.services,
            startdatetime: this.appointmentData.startdatetime,
            hour: moment(this.appointmentData.startdatetime).format('HH:mm'),
            hourTimePicker: moment(this.appointmentData.startdatetime).format('hh:mm A'),
            selectServices: selectServices,
            techniciansSelected: techniciansSelected,
            clients: this.props.route.params.clients,
            technicians: this.props.route.params.technicians,
            availablehours: this.props.route.params.availablehours,
            token: this.props.route.params.token,
            blockedTime: this.props.route.params.blockedTime,
            TechniciansWorkingHour: this.props.route.params.TechniciansWorkingHour,
            userData: this.props.route.params.userData,
            blockedTimeYM: this.props.route.params.blockedTimeYM,
            listcombo: this.props.route.params.listcombo,
            categories: this.props.route.params.categories,
            isShowStaffCheckIn: this.props.route.params.isShowStaffCheckIn,
            isClientExists: true,
            opening_hours: this.props.route.params.opening_hours,
            logo_app: this.props.route.params.logo_app,
            appointemntId: this.appointmentData.id
            //listCategories: this.props.route.params.listCategories
        };
        //console.log(routeParams);
        this.props.navigation.push('checkin', routeParams);


        /*
        clients: this.clients,
        technicians: this.technicians,
        availablehours: this.availablehours.available_hours,
        services: this.services,
        token:this.token,
        blockedTime: this.blockedTime,
        TechniciansWorkingHour: this.TechniciansWorkingHour,
        userData: this.userData,
        blockedTimeYM: this.loadedYM,
        listcombo: this.listcombo,
        categories: this.categories,
        isShowStaffCheckIn: this.isShowStaffCheckIn,
        isClientExists: isClientExists,
        clientData: clientData,
        opening_hours:this.opening_hours,
        logo_app: this.logo_app
        */
    }

    render() {

        let phone = '';
        if (this.clientData != '') {

            if (typeof this.clientData.phone != 'undefined' && this.clientData.phone != '' && this.clientData.phone != null) {
                phone = this.clientData.phone.toString().replace(/[^\d]+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
        }

        let servicesDisplay = this.services.map((x, i) => {
            return (
                <View key={x.id + 'service'}>
                    {i > 0 &&
                        <View style={[styles.line, { width: lineWidth }]}></View>
                    }
                    <View style={styles.clientrow}>
                        <Text style={styles.clientlblservice}>{x.name}</Text>
                        <Text style={styles.clientvalue}>{'$' + x.price}</Text>
                    </View>
                </View>
            )
        });

        let combosDisplay = this.combos.map((x, i) => {
            return (
                <View key={x.id + 'combo'}>
                    {i > 0 &&
                        <View style={[styles.line, { width: lineWidth }]}></View>
                    }
                    <View style={styles.clientrow}>
                        <Text style={styles.clientlblservice}>{x.comboname}</Text>
                        <Text style={styles.clientvalue}>{'$' + x.price}</Text>
                    </View>
                </View>
            )
        });

        return (
            <View style={{ flex: 1, backgroundColor: color.lightWhite }}>
                <SubmitLoader
                    ref="authenticateLoader"
                    visible={false}
                    textStyle={layout.textLoaderScreenSubmit}
                    textContent={"Processing..."}
                    color={Colors.spinnerLoaderColorSubmit}
                />
                <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Appointment Detail</Text>
                        {/*
                        <TouchableOpacity style={styles.closebtn} activeOpacity={1}
                            onPress={this.back}>
                            <Icon
                                name={'chevron-left'}
                                size={30}
                                color={color.whiteRBG1} style={styles.navIconIOS}
                            />
                        </TouchableOpacity>*/}
                        <TouchableOpacity style={styles.closebtn} activeOpacity={1}
                            onPress={this.backtohome}>
                            <Icon
                                name={'chevron-left'}
                                size={30}
                                color={color.whiteRBG1} style={styles.navIconIOS}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.closebtnright} activeOpacity={1}
                            onPress={this.startAppointment}>
                            <Icon
                                name={'calendar-plus'}
                                size={30}
                                color={color.whiteRBG1} style={styles.navIconIOSWithLBL}
                            />
                            <Text style={styles.closebtnrightlbl}>New Appointment</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                <View style={styles.rowWrap}>
                    <ScrollView contentContainerStyle={styles.container} style={{ width: columnWidth }} keyboardShouldPersistTaps="always">
                        <View style={[styles.columnWraperLeft, { width: itemWidth }]}>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlblheader}>CUSTOMER INFORMATION</Text>
                                <TouchableOpacity style={styles.editclientbtn} activeOpacity={1}
                                    onPress={this.editclient}>
                                    <Text style={styles.editclientlabel}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.line, { width: lineWidth }]}></View>
                            <View style={[styles.clientrow]}>
                                <Text style={styles.clientlbl}>First Name</Text>
                                <Text style={styles.clientvalue}>{this.clientData.firstname}</Text>
                            </View>
                            <View style={[styles.line, { width: lineWidth }]}></View>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlbl}>Last Name</Text>
                                <Text style={styles.clientvalue}>{this.clientData.lastname}</Text>
                            </View>
                            <View style={[styles.line, { width: lineWidth }]}></View>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlbl}>Phone</Text>
                                <Text style={styles.clientvalue}>{phone}</Text>
                            </View>
                            <View style={[styles.line, { width: lineWidth }]}></View>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlbl}>Email</Text>
                                <Text style={styles.clientvalue}>{this.clientData.email}</Text>
                            </View>


                        </View>
                    </ScrollView>
                    <ScrollView contentContainerStyle={styles.container} style={{ width: columnWidth }} keyboardShouldPersistTaps="always">

                        <View style={[styles.columnWraperRight, { width: itemWidth }]}>
                            {
                                this.services.length > 0 &&
                                <View>
                                    <View style={styles.clientrow}>
                                        <Text style={styles.clientlblheader}>SERVICES</Text>
                                    </View>
                                    <View style={[styles.line, { width: lineWidth }]}></View>
                                    {servicesDisplay}
                                </View>
                            }

                            {
                                this.services.length > 0 && this.combos.length > 0 &&
                                <View style={[styles.line, { width: lineWidth }]}></View>
                            }

                            {
                                this.combos.length > 0 &&
                                <View>
                                    <View style={styles.clientrow}>
                                        <Text style={styles.clientlblheader}>COMBO</Text>
                                    </View>
                                    <View style={[styles.line, { width: lineWidth }]}></View>
                                    {combosDisplay}
                                </View>
                            }
                            <View style={[styles.line, { width: lineWidth }]}></View>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlblheader}>DETAILS</Text>
                            </View>
                            <View style={[styles.line, { width: lineWidth }]}></View>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlbl}>Time</Text>
                                <Text style={styles.clientvalue}>{this.time}</Text>
                            </View>
                            <View style={[styles.line, { width: lineWidth }]}></View>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlbl}>Total</Text>
                                <Text style={styles.clientvalue}>${this.total}</Text>
                            </View>
                        </View>



                    </ScrollView>
                </View>
                {
                    this.isStart &&
                    this.appointments.length &&
                    <Text style={styles.checkedinlbl}>Already checked in</Text>
                }

                {
                    !this.isStart &&
                    this.appointments.length &&
                    <View style={styles.btnBlockContainer}>
                        <View style={[styles.btnBlockWraper, { width: btnWidth / 2 - 10 }]}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={[styles.btnEditAppt]}
                                onPress={async () => { await this.editAppointment() }}
                            >
                                <Text style={styles.btnSaveText}>Edit Appointment</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.btnBlockWraper, { width: btnWidth / 2 - 10 }]}>

                            <TouchableOpacity
                                activeOpacity={1}
                                style={[styles.btnSaveWraper]}
                                onPress={async () => { await this.checkin() }}
                            >
                                <LinearGradient
                                    start={[0, 0]}
                                    end={[1, 0]}
                                    colors={[color.reddish, color.reddish]}
                                    style={styles.btnLinear}
                                >
                                    <Text style={styles.btnSaveText}>Check In</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                }


                <ModalEditClient ref="ModalEditClient" onUpdated={this.onUpdatedClient} token={this.props.route.params.token} />
            </View>



        )

    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20

    },
    editclientbtn: {
        position: 'absolute',
        right: 15,
        top: 15
    },
    editclientlabel: {
        fontSize: 18,
        color: color.reddish,

    },
    columnWraperLeft: {

        //backgroundColor:color.white,
        marginLeft: 15,
        marginRight: 7.5,
        borderWidth: 0.5,
        borderColor: color.whitishBorder,
        marginBottom: 15
    },
    columnWraperRight: {

        //backgroundColor:color.white,
        marginLeft: 7.5,
        marginRight: 15,
        borderWidth: 0.5,
        borderColor: color.whitishBorder,
        marginBottom: 15
    },
    rowWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: color.lightWhite,
        marginBottom: 20
    },
    row: {
        marginTop: 30
    },
    clientTitle: {
        fontSize: 22,
        marginBottom: 15,
        fontFamily: 'Futura',
        marginLeft: 15,
        marginRight: 15
    },
    clientrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: color.white,

        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    clienttoprow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: color.white,

        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
    },
    clientbottomrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: color.white,

        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
        paddingTop: 10
    },
    clientlbl: {
        fontSize: 18,
        width: 100,
        color: color.blackish
    },
    clientlblservice: {
        fontSize: 18,
        color: color.blackish
    },
    clientlblheader: {
        fontSize: 18,
        color: color.reddish,
    },
    clientlbldot: {
        fontSize: 18,
        color: color.blackish
    },
    clientvalue: {
        color: color.silver,
        fontSize: 18,
        textAlign: 'right'
    },
    confirmbtn: {
        justifyContent: "center",
        alignItems: "center",
        width: 400
    },
    btnSave: {
        height: 45,
        width: 200,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15
    },
    btnSaveText: {
        color: color.white,
        fontSize: 22,
        zIndex: 1,
        backgroundColor: "transparent"
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: color.lightWhite
    },
    btnEditAppt: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1,
        backgroundColor: color.placeHolderColor
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    line: {
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
        marginLeft: 15
    },
    btnBlockWraper: {
        height: 60,
        marginLeft: 15,
        marginBottom: 15,
        backgroundColor: color.lightWhite

    },
    btnBlockContainer: {
        flexDirection: 'row'
    },
    headerContainer: {
        height: 90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle: {
        color: color.white,
        backgroundColor: 'transparent',
        fontSize: 22,
        fontFamily: 'Futura',
        marginTop: 10
    },
    closebtn: {
        position: 'absolute',
        left: 20,
        backgroundColor: 'transparent',
        top: 35
    },
    closebtnright: {
        position: 'absolute',
        right: 20,
        backgroundColor: 'transparent',
        top: 35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closebtnrightlbl: {
        fontFamily: 'Futura',
        fontSize: 20,
        color: color.white,
        marginLeft: 5,

        justifyContent: 'center',
        alignItems: 'center'
    },
    checkedinlbl: {
        fontSize: 26,
        fontFamily: 'Futura',
        textAlign: 'center',
        color: color.reddish,
        marginBottom: 20
    },
    navIconIOSWithLBL: {
        marginTop: 3
    }


})
