import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Platform,
    ScrollView,
    Dimensions,
    Alert,
    SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import FloatLabelTextField from "../components/FloatTextInput";
import FloatSwitch from "../components/FloatSwitch";
import { formatPhone, formatMonth, formatpercent, emailRegx } from "../helpers/Utils";
import Colors from "../constants/Colors";
import SubmitLoader from "../helpers/submitloader";
import IconLoader from "../helpers/iconloader";
import setting from "../constants/Setting";
import CheckBox from 'react-native-check-box';
import { getTextByKey } from "../helpers/language";
import collect from "collect.js";
import { color } from "../assets/colors/colors";
import { api } from "../api/api";
export default class EditStaff extends React.Component {
    state = {
        modalVisible: this.props.visible,
        displaynotify:'',
        displayskills:''
    };

    title = "Update Staff";
    clientData = {};
    password = "";
    confirmpassword = "";
    columnWidth = Dimensions.get("window").width / 2;

    resetData = () => {
        this.clientData.id = 0;
        this.clientData.firstname = "";
        this.clientData.lastname = "";
        this.clientData.email = "";
        this.clientData.phone = "";
        this.clientData.month = "";
        this.clientData.day = "";
    };

    close() {
        //this.props.onClose();
        this.setState({ modalVisible: false });
    }

    show = () => {
        this.setState({ modalVisible: true });
    };

    onChangeTextFirstName = value => {
        this.refs.txtfirstnameinput.setState({ text: value });
        this.clientData.firstname = value;
    };

    onChangeTextLastName = value => {
        this.refs.txtlastnameinput.setState({ text: value });
        this.clientData.lastname = value;
    };
    onChangeTextstate_issued = value => {
        this.refs.txtstateissuedinput.setState({ text: value });
        this.clientData.state_issued = value;
    };
    onChangeTextdetails= value => {
        this.refs.txtdetailsinput.setState({ text: value });
        this.clientData.details = value;
    };
    onChangeTextEmail = value => {
        this.refs.txtemailinput.setState({ text: value });
        this.clientData.email = value;
    };

    onChangeTextPhone = value => {
        let formatValue = formatPhone(value);
        if (formatValue == "(") formatValue = "";
        this.refs.txtphoneinput.setState({ text: formatValue });
        this.clientData.phone = formatValue;
    };
    onChangeTextNewPassword = value => {
        this.refs.txtnewpasswordinput.setState({ text: value });
        this.password = value;
    };
    onChangeTextConfirmPassword = value => {
        this.refs.txtconfirmpasswordinput.setState({ text: value });
        this.confirmpassword = value;
    };
    
    onChangeTextMonth = value => {
        let formatValue = formatMonth(value);
        if (formatValue != "" && parseInt(formatValue) > 12) formatValue = "12";
        this.refs.txtmonthinput.setState({ text: formatValue });
        this.clientData.month = formatValue;
    };

    onChangeTextDay = value => {
        let formatValue = formatMonth(value);
        if (formatValue != "" && parseInt(formatValue) > 31) formatValue = "31";
        this.refs.txtdayinput.setState({ text: formatValue });
        this.clientData.day = formatValue;
    };
    onChangeCommissioncredit = value =>{
        let formatValue = formatpercent(value);
        if (formatValue != "" && parseInt(formatValue) > 100) formatValue = "100";
        this.refs.txtcommissioncreditinput.setState({ text: formatValue });
        this.clientData.commissioncredit = formatValue;
    }
    onChangeCommissionCash = value =>{
        let formatValue = formatpercent(value);
        if (formatValue != "" && parseInt(formatValue) > 100) formatValue = "100";
        this.refs.txtcommissioncashinput.setState({ text: formatValue });
        this.clientData.commissioncash = formatValue;
    }
    onChangeCommissionEgift = value =>{
        let formatValue = formatpercent(value);
        if (formatValue != "" && parseInt(formatValue) > 100) formatValue = "100";
        this.refs.txtcommissionegiftinput.setState({ text: formatValue });
        this.clientData.commissionegift = formatValue;
    }
    onChangeCommissionMember = value =>{
        let formatValue = formatpercent(value);
        if (formatValue != "" && parseInt(formatValue) > 100) formatValue = "100";
        this.refs.txtcommissionmemberinput.setState({ text: formatValue });
        this.clientData.commissionmember = formatValue;
    }
    ChangeDisplayStaff = () =>{
        let displaystaff = this.clientData.display_staff == 1 ? true : false;
        this.refs.txtdisplaystaffinput.setState({ text: !displaystaff });
        this.clientData.display_staff = !displaystaff == true ? 1 : 0;
    }
    Changeview_customer_information= () =>{
        let displaystaff = this.clientData.view_customer_information == 1 ? true : false;
        this.refs.txtview_customer_informationinput.setState({ text: !displaystaff });
        this.clientData.view_customer_information = !displaystaff == true ? 1 : 0;
    }
    ChangeisPrimaryUser = ()=>{
        let displaystaff = this.clientData.isPrimaryUser == 1 ? true : false;
        this.refs.txtisPrimaryUserinput.setState({ text: !displaystaff });
        this.clientData.isPrimaryUser = !displaystaff == true ? 1 : 0;
    }
    ChangedisableTechnicianBookingOnline = ()=>{
        let displaystaff = this.clientData.disableTechnicianBookingOnline == 1 ? true : false;
        this.refs.txtdisableTechnicianBookingOnlineinput.setState({ text: !displaystaff });
        this.clientData.disableTechnicianBookingOnline = !displaystaff == true ? 1 : 0;
    }
    ChangeisStartAppointment = ()=>{
        let displaystaff = this.clientData.isStartAppointment == 1 ? true : false;
        this.refs.txtisStartAppointmentinput.setState({ text: !displaystaff });
        this.clientData.isStartAppointment = !displaystaff == true ? 1 : 0;
    }
    ChangeisCheckoutAppointment = ()=>{
        let displaystaff = this.clientData.isCheckoutAppointment == 1 ? true : false;
        this.refs.txtisCheckoutAppointmentinput.setState({ text: !displaystaff });
        this.clientData.isCheckoutAppointment = !displaystaff == true ? 1 : 0;
    }
    ChangeisAddAppointment = ()=>{
        let displaystaff = this.clientData.isAddAppointment == 1 ? true : false;
        this.refs.txtisAddAppointmentinput.setState({ text: !displaystaff });
        this.clientData.isAddAppointment = !displaystaff == true ? 1 : 0;
    }
    ChangeisEditAppointment = ()=>{
        let displaystaff = this.clientData.isEditAppointment == 1 ? true : false;
        this.refs.txtisEditAppointmentinput.setState({ text: !displaystaff });
        this.clientData.isEditAppointment = !displaystaff == true ? 1 : 0;
    }
    saveClient = () => {
        let isValid = true;
        if (String.prototype.trim.call(this.clientData.firstname) == "") {
            isValid = false;
            Alert.alert("Error", this.getText('addclientfirstnamerequire'));
        } else if (String.prototype.trim.call(this.clientData.lastname) == "") {
            isValid = false;
            Alert.alert("Error", this.getText('addclientlastnamerequire'));
        } else if (String.prototype.trim.call(this.clientData.email) == "") {
            isValid = false;
            Alert.alert("Error", this.getText('addclientemailrequire'));
        } else if (!emailRegx.test(String.prototype.trim.call(this.clientData.email))) {
            isValid = false;
            Alert.alert("Error", this.getText('addclientemailvalidrequire'));
        } else if ( String.prototype.trim.call(this.clientData.phone) != "" && this.clientData.phone.length != 14 ) {
            isValid = false;
            Alert.alert(
                "Error",
                this.getText('addclientphonevalidrequire')
            );
        }else if(String.prototype.trim.call(this.password) != ""){
            
            if(String.prototype.trim.call(this.password).length < 8){
                isValid = false;
                Alert.alert("Error",'Password must be 8 characters long.' );
            }else if(String.prototype.trim.call(this.password) != String.prototype.trim.call(this.confirmpassword)){
                isValid = false;
                Alert.alert("Error",'Confirm password is incorrect.' );
            }
        }
        
        if (isValid) {
            var formdata = {};
            formdata.id = this.clientData.id;
            formdata.firstname = String.prototype.trim.call(
                this.clientData.firstname
            );
            formdata.lastname = String.prototype.trim.call(
                this.clientData.lastname
            );
            formdata.email = String.prototype.trim.call(this.clientData.email);
            if (
                String.prototype.trim.call(this.clientData.phone) != "" &&
                this.clientData.phone.length == 14
            ) {
                formdata.phone = this.clientData.phone;
            }
            formdata.state_issued = this.clientData.state_issued;
            formdata.details = this.clientData.details;
            formdata.commissioncredit = this.clientData.commissioncredit;
            formdata.commissionmember = this.clientData.commissionmember;
            formdata.commissioncash = this.clientData.commissioncash;
            formdata.commissionegift = this.clientData.commissionegift;
            formdata.display_staff = this.clientData.display_staff;
            formdata.view_customer_information = this.clientData.view_customer_information;
            formdata.isPrimaryUser = this.clientData.isPrimaryUser;
            formdata.disableTechnicianBookingOnline = this.clientData.disableTechnicianBookingOnline;
            formdata.isStartAppointment = this.clientData.isStartAppointment;
            formdata.isCheckoutAppointment = this.clientData.isCheckoutAppointment;
            formdata.isAddAppointment = this.clientData.isAddAppointment;
            formdata.isEditAppointment = this.clientData.isEditAppointment;
            formdata.technician_notify_appointment = this.clientData.technician_notify_appointment;
            formdata.skillsToServices = this.clientData.skillsToServices;
            formdata.password = this.password;
            this.refs.clientLoader.setState({ visible: true });  
            fetch(setting.apiUrl + api.updatetechnicianMerchant, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + this.props.token
                },
                body: JSON.stringify(formdata)
            })
                .then(response => response.json())
                .then(responseJson => {
                    if (!responseJson.success) {
                        this.fetchError(responseJson);
                        //console.log(responseJson);
                        this.refs.clientLoader.setState({ visible: false });   
                        //Alert.alert('Error', responseJson.message);
                        //return [];
                    } else {
                        this.refs.clientLoader.setState({ visible: false });   

                        let successMessage = this.getText('teachnicianupdatedlbl');
                        if (formdata.id > 0) {
                            successMessage = this.getText('teachnicianupdatedlbl');
                        }
                        this.refs.clientSuccessLoader.setState({
                            textContent: successMessage,
                            visible: true
                        });

                        let _this = this;
                        setTimeout(function() {
                            _this.refs.clientSuccessLoader.setState({
                                visible: false
                            });
                            _this.props.SaveClientSuccess(
                                _this.clientData.id,
                                responseJson.data
                            );
                        }, 2000);

                        //Alert.alert("OK", "Appointment Booked");
                    }
                })
                .catch(error => {
                    console.error(error);
                    //return [];
                });
        }
    };

    fetchError(responseJson) {
        if (
            responseJson.message == "token_expired" ||
            responseJson.message == "token_invalid"
        ) {
            
            let rootNavigator = this.props.navigation.getNavigator('root'); 
            rootNavigator.replace('login');
        } else {
            Alert.alert("Error", responseJson.message);
        }
    }

    getText(key){
        return getTextByKey(this.props.language,key);
    }

    onChecked = (key, isChecked) => {
        let arr = [];
        if(typeof(this.clientData.technician_notify_appointment) != 'undefined' && this.clientData.technician_notify_appointment != ''){
            arr = JSON.parse(this.clientData.technician_notify_appointment);
        }
        if(isChecked){
            arr = collect(arr);
            arr = arr.filter(function(item){
                return item != key;
            }).all();
        }else{
            arr.push(key);
        }
        this.clientData.technician_notify_appointment = JSON.stringify(arr);
        this.setState({displaynotify: this.renderCheckboxnotify})
    }
    onCheckedSkills = (key, isChecked) => {
        let arr = [];
        if(typeof(this.clientData.skillsToServices) != 'undefined' && this.clientData.skillsToServices != ''){
            arr = this.clientData.skillsToServices;
        }
        if(isChecked){
            arr = collect(arr);
            arr = arr.filter(function(item){
                return item != key;
            }).all();
        }else{
            arr.push(key);
        }
        this.clientData.skillsToServices = arr;
        this.setState({displayskills: this.renderCheckboxSkills})
    }
    renderCheckboxnotify = () =>{
        let data = {email:'Email', sms:'Sms'};
        let arr = [];
        if(typeof(this.clientData.technician_notify_appointment) != 'undefined' && this.clientData.technician_notify_appointment != ''){
            arr = JSON.parse(this.clientData.technician_notify_appointment);
        }
        let displaynotify = Object.keys(data).map((key) => {
            let isChecked = false;
            if(arr.indexOf(key) >= 0){
                isChecked = true;
            }
            return(
                <CheckBox key={key}
                style={{width: 150,padding: 10}}
                onClick={()=>this.onChecked(key,isChecked)}
                isChecked={isChecked}
                rightText={key}
                rightTextStyle={{fontSize:13,color: color.silver}}
                disabled={false}
            />
            )
        })
        return displaynotify
    }
    inArray(needle,haystack){
        var count=haystack.length;
        for(var i=0;i<count;i++)
        {
            if(haystack[i]===needle){return true;}
        }
        return false;
    }
    renderCheckboxSkills= () =>{
        let arr = [];
        if(typeof(this.clientData.skillsToServices) != 'undefined' && this.clientData.skillsToServices != ''){
            arr = this.clientData.skillsToServices;
        }
        let displaynotify = this.props.services.map((item, key) => {
            let isChecked = false;
            if(this.inArray(item.id, arr)){
                isChecked = true;
            }
            return(
                <CheckBox key={key}
                style={{padding: 10, width:200}}
                onClick={()=>this.onCheckedSkills(item.id,isChecked)}
                isChecked={isChecked}
                rightText={item.name}
                rightTextStyle={{fontSize:13,color: color.silver}}
                disabled={false}
            />
            )
        })
        return displaynotify
    }
    render() {
        this.state.displaynotify = this.renderCheckboxnotify();
        this.state.displayskills = this.renderCheckboxSkills();
        return (
            <Modal animationType={"slide"} transparent={false} visible={this.state.modalVisible} onRequestClose={() => this.close()}>
                <SafeAreaView style={{flex:1}}>
                <View style={ Platform.OS === "android" ? layout.headercontainerAndroid : layout.headercontainer }>
                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={ Platform.OS === "android" ? layout.headerAndroid : layout.header }>
                        <View style={layout.headercontrols}>
                            <TouchableOpacity
                                style={layout.headerNavLeftContainer}
                                activeOpacity={1}
                                onPress={() => this.close()}
                            >
                                <View style={layout.headerNavLeft}>
                                    <Icon
                                        name={"close"}
                                        size={30}
                                        color={color.whiteRBG1}
                                        style={
                                            Platform.OS === "android"
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
                                    Update Staff
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={this.getText('clientfirstname')}
                            value={this.clientData.firstname}
                            onChangeTextValue={this.onChangeTextFirstName}
                            underlineColorAndroid="transparent"
                            ref="txtfirstnameinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={this.getText('clientlastname')}
                            value={this.clientData.lastname}
                            onChangeTextValue={this.onChangeTextLastName}
                            underlineColorAndroid="transparent"
                            ref="txtlastnameinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Email"}
                            value={this.clientData.email}
                            onChangeTextValue={this.onChangeTextEmail}
                            underlineColorAndroid="transparent"
                            ref="txtemailinput"
                        />
                    </View>
                
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={this.getText('clientphonelbl')}
                            value={this.clientData.phone}
                            onChangeTextValue={this.onChangeTextPhone}
                            underlineColorAndroid="transparent"
                            ref="txtphoneinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"New Password"}
                            value={""}
                            onChangeTextValue={this.onChangeTextNewPassword}
                            underlineColorAndroid="transparent"
                            ref="txtnewpasswordinput"
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Confirm Password"}
                            value={""}
                            onChangeTextValue={this.onChangeTextConfirmPassword}
                            underlineColorAndroid="transparent"
                            ref="txtconfirmpasswordinput"
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={'State issued'}
                            value={this.clientData.state_issued}
                            onChangeTextValue={this.onChangeTextstate_issued}
                            underlineColorAndroid="transparent"
                            ref="txtstateissuedinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={'About me'}
                            value={this.clientData.details}
                            onChangeTextValue={this.onChangeTextdetails}
                            underlineColorAndroid="transparent"
                            ref="txtdetailsinput"
                        />
                    </View>
                    <View style={[layout.floatGroup, styles.twocolumn,{ marginBottom: 20}]}>
                        <FloatLabelTextField
                            placeholder={'Commission Credit Card %'}
                            value={this.clientData.commissioncredit}
                            onChangeTextValue={this.onChangeCommissioncredit}
                            underlineColorAndroid="transparent"
                            ref="txtcommissioncreditinput"
                            style={[{ width: this.columnWidth - 1 }]}
                        />
                        <View style={styles.seperatecolumn} />
                        <FloatLabelTextField
                            placeholder={'Commission Membership %'}
                            value={this.clientData.commissionmember}
                            onChangeTextValue={this.onChangeCommissionMember}
                            underlineColorAndroid="transparent"
                            ref="txtcommissionmemberinput"
                            style={[{ width: this.columnWidth }]}
                        />
                    </View>

                    <View style={[layout.floatGroup, styles.twocolumn]}>
                        <FloatLabelTextField
                            placeholder={'Commission Cash %'}
                            value={this.clientData.commissioncash}
                            onChangeTextValue={this.onChangeCommissionCash}
                            underlineColorAndroid="transparent"
                            ref="txtcommissioncashinput"
                            style={[{ width: this.columnWidth - 1 }]}
                        />
                        <View style={styles.seperatecolumn} />
                        <FloatLabelTextField
                            placeholder={'Commission Egift %'}
                            value={this.clientData.commissionegift}
                            onChangeTextValue={this.onChangeCommissionEgift}
                            underlineColorAndroid="transparent"
                            ref="txtcommissionegiftinput"
                            style={[{ width: this.columnWidth }]}
                        />
                    </View>
                <View style={{marginBottom:15}} />
                        <FloatSwitch
                            placeholder={'Display staff'}
                            value={this.clientData.display_staff == 1 ? true : false}
                            onPress={this.ChangeDisplayStaff}
                            ref="txtdisplaystaffinput"  
                        />
                        <FloatSwitch
                            placeholder={'View customer information'}
                            value={this.clientData.view_customer_information == 1 ? true : false}
                            onPress={this.Changeview_customer_information}
                            ref="txtview_customer_informationinput"
                        />
                        <FloatSwitch
                            placeholder={'Primary User'}
                            value={this.clientData.isPrimaryUser == 1 ? true : false}
                            onPress={this.ChangeisPrimaryUser}
                            ref="txtisPrimaryUserinput"
    
                        />
                        <FloatSwitch
                            placeholder={'Disable technician booking online'}
                            value={this.clientData.disableTechnicianBookingOnline == 1 ? true : false}
                            onPress={this.ChangedisableTechnicianBookingOnline}
                            ref="txtdisableTechnicianBookingOnlineinput"
       
                        />
                        <FloatSwitch
                            placeholder={'Start Appointment'}
                            value={this.clientData.isStartAppointment == 1 ? true : false}
                            onPress={this.ChangeisStartAppointment}
                            ref="txtisStartAppointmentinput"
                        />
                        <FloatSwitch
                            placeholder={'Checkout Appointment'}
                            value={this.clientData.isCheckoutAppointment == 1 ? true : false}
                            onPress={this.ChangeisCheckoutAppointment}
                            ref="txtisCheckoutAppointmentinput"
                        />
                        <FloatSwitch
                            placeholder={'Add Appointment'}
                            value={this.clientData.isAddAppointment == 1 ? true : false}
                            onPress={this.ChangeisAddAppointment}
                            ref="txtisAddAppointmentinput"
                            style={[{ width: this.columnWidth - 1 }]}
                        />
                        <FloatSwitch
                            placeholder={'Edit Appointment'}
                            value={this.clientData.isEditAppointment == 1 ? true : false}
                            onPress={this.ChangeisEditAppointment}
                            ref="txtisEditAppointmentinput"
                            style={[{ width: this.columnWidth}]}
                        />
                    <View style={[layout.floatGroup, { marginTop:15, marginBottom:15}]}>
                        <Text style={styles.fieldLabel}>How would you like to notify technician of new appointments</Text>
                        <View style={{flexDirection: "row", }}>
                            {this.state.displaynotify}
                        </View>
                    </View>
                    <View style={[{marginTop:15, marginBottom:15}]}>
                        <Text style={[styles.fieldLabel]}>Skills</Text>
                        <View style={{flexDirection:'row', flexWrap:'wrap', flex: 1, justifyContent: 'space-between'}}>
                            {this.state.displayskills}
                        </View>
                    </View>
                    <View style={styles.btnSave}>
                        <TouchableOpacity
                            activeOpacity={0}
                            style={styles.btnSaveWraper}
                            onPress={this.saveClient}
                        >
                            <LinearGradient
                                start={[0, 0]}
                                end={[1, 0]}
                                colors={[color.reddish, color.reddish]}
                                style={styles.btnLinear}
                            >
                                <Text style={styles.btnSaveText}>{this.getText('clientsavelbl')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <SubmitLoader
                        ref="clientLoader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmit}
                        textContent={this.getText('processing')}
                        color={Colors.spinnerLoaderColorSubmit}
                    />
                <IconLoader
                    ref="clientSuccessLoader"
                    visible={false}
                    textStyle={layout.textLoaderScreenSubmitSucccess}
                    textContent={this.getText('clientsavedlbl')}
                    color={Colors.spinnerLoaderColorSubmit}
                />
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    twocolumn: {
        flexDirection:'row', flexWrap:'wrap', flex: 1, justifyContent: 'space-between'

    },
    // seperatecolumn: {
    //     borderWidth: 1,
    //     borderTopWidth: 0,
    //     borderBottomWidth: 0,
    //     borderLeftWidth: 0,
    //     borderColor: "#ddd",
    //     backgroundColor: "red",
    //     height: 45
    // },
    btnSave: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 150
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
        right: 15
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    fieldLabel: {
        fontSize: 16,
        color: color.reddish,
        paddingLeft:15,
    },
});
