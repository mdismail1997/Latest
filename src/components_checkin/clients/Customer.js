import React from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
    Keyboard,
    TouchableOpacity,
    Image,
    Text
} from "react-native";

import { formatPhone, inputBirthDate } from "../../helpers/Utils";
import ReturnCustomer from './ReturnCustomer';
import EditClient from "./editClient";
import NewClient from "./NewClient";
import { color } from "../../assets/colors/colors";
import { images } from "../../components/Images";
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var columnWidth = width / 2;
var iPadPro = false;
if (width > 1024) {
    iPadPro = true;
}

var screenOrientation = 'PORTRAIT';
if (width > height) {
    screenOrientation = 'LANDSCAPE';
}

export default class Customer extends React.Component {
    stata = {
        appIsReady: false
    }

    clientData = {
        id: 0,
        firstname: "",
        lastname: "",
        email: this.props.clientSearchData.email,
        phone: this.props.clientSearchData.phone,
        birthdate: "",
        month: "",
        day: ""
    };

    clientSearchData = this.props.clientSearchData;
    isShowEdit = false;
    UNSAFE_componentWillMount() {

        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

        width = Dimensions.get('window').width;
        height = Dimensions.get('window').height;
        columnWidth = width / 2;

        if (width > height) {
            screenOrientation = 'LANDSCAPE';
        } else {
            screenOrientation = 'PORTRAIT'
        }

        let _this = this;
        Dimensions.addEventListener('change', function () {

            var screen = Dimensions.get('window');
            width = screen.width;
            //height = screen.height;
            columnWidth = width / 2;

            height = screen.height;
            if (width > height) {
                screenOrientation = 'LANDSCAPE';
            } else {
                screenOrientation = 'PORTRAIT'
            }

            if (typeof (_this.refs.scrollnewcustomer) != 'undefined') {
                setTimeout(function () {
                    _this.refs.scrollnewcustomer.scrollTo({ x: 0, y: 0, animated: true });
                }, 2000);
            }

            _this.setState({ appIsReady: true });
        })
    }



    UNSAFE_componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        Dimensions.removeEventListener("change", () => { });
    }

    _keyboardDidHide() {
        if (!iPadPro) {
            if (screenOrientation == 'LANDSCAPE' && typeof (this.refs.scrollnewcustomer) != 'undefined') {
                this.refs.scrollnewcustomer.scrollTo({ x: 0, y: 0, animated: true });
            }
        }

    }

    changeFirstName = (firstname) => {
        this.clientData.firstname = firstname;
    }

    changeLastName = (lastname) => {
        this.clientData.lastname = lastname;
    }

    changePhone = (value) => {
        let formatValue = formatPhone(value);
        if (formatValue == "(") formatValue = "";
        var _this = this;
        _this.refs.txtphoneinputd.setState({ text: formatValue });
        _this.clientData.phone = formatValue;
    }

    changeEmail = (email) => {
        this.clientData.email = email;
    }
    onChangeOptOutSMS = () => {
        let value = this.clientData.OptOutSMS == 1 ? true : false;
        this.refs.txtOptOutSMS.setState({ text: !value });
        this.clientData.OptOutSMS = !value == true ? 1 : 0;
    }
    onChangeOptOutMAIL = () => {
        let value = this.clientData.OptOutMAIL == 1 ? true : false;
        this.refs.txtOptOutMAIL.setState({ text: !value });
        this.clientData.OptOutMAIL = !value == true ? 1 : 0;
    }

    changeBirthdate = (value) => {
        let formatValue = inputBirthDate(value);
        if (formatValue != "" && parseInt(formatValue) > 12) formatValue = "12";
        this.refs.txtmonthinput.setState({ text: formatValue });
        this.clientData.birthdate = formatValue;

        let birthdate = formatValue.split('/');
        this.clientData.month = birthdate[0];
        if (birthdate.length > 1) {
            this.clientData.day = birthdate[1];
        }
    }


    saveClient = (client) => {
        this.props.onPress(client);
    }

    clientSelected = (data) => {
        this.props.onPress(data);
    }

    onPressEdit = (data) => {
        this.isShowEdit = true;
        this.setState({ rerender: true });
        let _this = this;
        setTimeout(function () {
            _this.refs.EditClient.setData(data);
        }, 0)
    }

    onPressTab = (tabIndex) => {
        this.refs.tabs.goToPage(tabIndex);
    }

    onBack = () => {
        this.isShowEdit = false;
        this.setState({ rerender: true });
        /*
        this.refs.tabs.goToPage(0);
        */
    }

    clientUpdated = (client) => {
        //this.refs.tabs.goToPage(0);
        /*
        this.refs.ReturnCustomer.setState({data: client});
        this.props.onClientUpdated(client);
        let _this = this;
        setTimeout(function(){
            _this.refs.tabs.goToPage(0);
        },1000)*/

        this.props.onClientUpdated(client);
        this.isShowEdit = false;
        this.setState({ rerender: true });
        let _this = this;
        setTimeout(function () {
            _this.refs.ReturnCustomer.setState({ data: client });
        }, 1000)
    }

    onFocus = (refname) => {
        if (!iPadPro && screenOrientation == 'LANDSCAPE') {
            if (refname == 'firstname' || refname == 'lastname') {
                this.refs.scrollnewcustomer.scrollTo({ x: 0, y: 10, animated: false });
            }

            if (refname == 'phone' || refname == 'email') {
                this.refs.scrollnewcustomer.scrollTo({ x: 0, y: 85, animated: true });
            }

            if (refname == 'birthdate') {
                this.refs.scrollnewcustomer.scrollTo({ x: 0, y: 150, animated: true });
            }
        }
    }
    nextChooseService = () => {
        var _this = this;
        if (this.props.isClientExists && !this.isShowEdit) {
            _this.refs.ReturnCustomer.nextChooseService();
        } else if (this.props.isClientExists && this.isShowEdit) {
            _this.refs.EditClient.nextChooseService();
        } else if (!this.props.isClientExists) {
            _this.refs.NewClient.nextChooseService();
        }
    }
    close = () => {
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'home' }],
        });
    }
    render() {

        return (
            <View style={styles.container}>

                <View style={styles.containerTab}>
                    {/*
                    <ClientTabs onPress={this.onPressTab} />
                    */}

                    {this.props.express == 'expresscheckin' &&
                        <TouchableOpacity style={styles.closebtn} activeOpacity={1}
                            onPress={this.close}>
                            <Image
                                source={images.backIcon}
                                style={[styles.backgroundFullscreen, { width: 40, height: 40 }]} />
                        </TouchableOpacity>
                    }
                    {this.props.isClientExists && !this.isShowEdit &&
                        <View style={styles.tabviewscontainer}>
                            <ScrollView style={styles.TabContent} keyboardShouldPersistTaps='always' key={1} tabLabel="React">
                                <ReturnCustomer clientSearchData={this.clientSearchData} ref='ReturnCustomer' userData={this.props.userData} express={this.props.express} clients={this.props.clients} token={this.props.token} onPress={this.clientSelected} onPressEdit={this.onPressEdit} />
                            </ScrollView>
                        </View>

                    }

                    {this.props.isClientExists && this.isShowEdit &&
                        <View style={styles.tabviewscontainer}>
                            <ScrollView style={styles.TabContent} keyboardShouldPersistTaps='always' key={2} tabLabel="React 1">
                                <EditClient ref='EditClient' onBack={this.onBack} userData={this.props.userData} token={this.props.token} clients={this.props.clients} onUpdated={this.clientUpdated} />
                            </ScrollView>
                        </View>

                    }

                    {!this.props.isClientExists &&
                        <View style={styles.tabviewscontainer}>
                            <ScrollView style={[styles.TabContent]} keyboardShouldPersistTaps='always' ref='scrollnewcustomer'>

                                <NewClient ref='NewClient' onBack={this.onBack} token={this.props.token} userData={this.props.userData} client={this.props.clientSearchData} providerid={this.props.providerid} onPress={this.saveClient} />
                            </ScrollView>
                        </View>
                    }

                    <View style={{ height: 20 }}></View>
                </View>



            </View>
        )
    }
}

const styles = StyleSheet.create({
    closebtn: {
        position: 'absolute',
        right: 70,
        backgroundColor: 'transparent',
        top: 30,
        zIndex: 2
    },
    backgroundFullscreen: {
        position: 'absolute',
        zIndex: 1
    },
    container: {
        flex: 1,
        backgroundColor: color.reddish,
        // justifyContent: "center",
        // alignItems: "center"
        paddingLeft: 50,
        paddingRight: 50
    },
    tabviewscontainer: {
        flex: 1,
    },
    TabContent: {

        //backgroundColor:color.white,
        //paddingLeft:20,
        //paddingRight:20,
        // width:560,
        // marginLeft:20
    },
    containerTab: {
        // width:600,
        flex: 1,
        marginTop: 20
    },
    twocolumns: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    title: {
        fontSize: 22,
        fontFamily: 'Futura',
        textAlign: 'center',
        color: color.blackish
    },
    column: {
        paddingTop: 30,
        flex: 1
    },
    contentsWrapperLeft: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white,
        marginLeft: 20,
        marginRight: 10
    },
    labelStyle: {
        fontSize: 16
    },
    textbox: {
        fontSize: 20,
        height: 45
    },
    contentsWrapperRight: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white,
        marginLeft: 10,
        marginRight: 20
    },
    btnSave: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15
    },
    btnSaveText: {
        color: color.white,
        fontSize: 20,
        zIndex: 1,
        backgroundColor: "transparent"
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    vertical: {
        width: 1,
        height: 400,
        backgroundColor: color.whitishBorder,
        position: 'absolute',
        top: 75
    },
    floatGroup: {
        height: 50,
        marginTop: 10
    },
})