import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Platform,
    TextInput,
    ScrollView,
    Dimensions,
    Alert,
    SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import FloatLabelTextField from "../components/FloatTextInput";
import { TextInputMask } from "react-native-masked-text";
import { formatPhone, formatMonth, emailRegx } from "../helpers/Utils";
import Colors from "../constants/Colors";
import SubmitLoader from "../helpers/submitloader";
import IconLoader from "../helpers/iconloader";
import setting from "../constants/Setting";
import { getTextByKey } from "../helpers/language";
import FloatSwitch from "../components/FloatSwitch";
import { color } from "../assets/colors/colors";
import { api } from "../api/api";
export default class AddClient extends React.Component {
    state = {
        modalVisible: this.props.visible
    };

    title = "";
    clientData = {};
    columnWidth = Dimensions.get("window").width / 2;

    resetData = () => {
        this.clientData.id = 0;
        this.clientData.firstname = "";
        this.clientData.lastname = "";
        this.clientData.email = "";
        this.clientData.phone = "";
        this.clientData.month = "";
        this.clientData.day = "";
        this.clientData.rewardpoint = "";
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
    onChangeTextreward = value => {
        this.refs.txtrewardinput.setState({ text: value });
        this.clientData.rewardpoint = value;
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
    
    ChangeOptOutMAIL= () =>{
        let displaystaff = this.clientData.OptOutMAIL == 1 ? true : false;
        this.refs.txtOptOutMAIL.setState({ text: !displaystaff });
        this.clientData.OptOutMAIL = !displaystaff == true ? 1 : 0;
    }
    ChangeOptOutSMS= () =>{
        let displaystaff = this.clientData.OptOutSMS == 1 ? true : false;
        this.refs.txtOptOutSMS.setState({ text: !displaystaff });
        this.clientData.OptOutSMS = !displaystaff == true ? 1 : 0;
    }
    saveClient = () => {
        let isValid = true;
        if (String.prototype.trim.call(this.clientData.firstname) == "") {
            isValid = false;
            Alert.alert("Error", this.getText('addclientfirstnamerequire'));
        }
       /* if (String.prototype.trim.call(this.clientData.firstname) == "") {
            isValid = false;
            Alert.alert("Error", this.getText('addclientfirstnamerequire'));
        } else if (String.prototype.trim.call(this.clientData.lastname) == "") {
            isValid = false;
            Alert.alert("Error", this.getText('addclientlastnamerequire'));
        } */
       /* else if (String.prototype.trim.call(this.clientData.email) == "") {
            isValid = false;
            Alert.alert("Error", this.getText('addclientemailrequire'));
        } */
        if (String.prototype.trim.call(this.clientData.email) != "") {
            if(!emailRegx.test(String.prototype.trim.call(this.clientData.email))){
                isValid = false;
                Alert.alert("Error", this.getText('addclientemailvalidrequire'));
            }
        } else if (
            String.prototype.trim.call(this.clientData.phone) != "" &&
            this.clientData.phone.length != 14
        ) {
            isValid = false;
            Alert.alert(
                "Error",
                this.getText('addclientphonevalidrequire')
            );
        } else if (
            String.prototype.trim.call(this.clientData.month) != "" ||
            String.prototype.trim.call(this.clientData.day) != ""
        ) {
            if (String.prototype.trim.call(this.clientData.month) == "") {
                isValid = false;
                Alert.alert("Error", this.getText('addclientmonthrequire'));
            } else if (String.prototype.trim.call(this.clientData.day) == "") {
                isValid = false;
                Alert.alert("Error", this.getText('addclientdayrequire'));
            }
        }else if(String.prototype.trim.call(this.clientData.email) == "" && String.prototype.trim.call(this.clientData.phone) == ""){
            isValid = false;
            Alert.alert("Error", this.getText('addclientemailorphonerequire'));
        }
        if (isValid) {
            var formdata = {};
            formdata.id = this.clientData.id;
            formdata.rewardpoint = this.clientData.rewardpoint;
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
            if (
                String.prototype.trim.call(this.clientData.month) != "" &&
                String.prototype.trim.call(this.clientData.day) != ""
            ) {
                formdata.birthdate =
                    this.clientData.month + "/" + this.clientData.day;
            }
            formdata.OptOutMAIL = this.clientData.OptOutMAIL;
            formdata.OptOutSMS = this.clientData.OptOutSMS;
            this.refs.clientLoader.setState({ visible: true });   
            fetch(setting.apiUrl + api.clientUpdate, {
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
                        this.refs.clientLoader.setState({ visible: false });   
                        let _this = this;
                        setTimeout(function() {
                            _this.fetchError(responseJson);
                        }, 100);
                    } else {
                        this.refs.clientLoader.setState({ visible: false });   
                        let successMessage = this.getText('clientsavedlbl');
                        if (formdata.id > 0) {
                            successMessage = this.getText('clientupdatedlbl');
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

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
            >
                <SafeAreaView style={{flex:1}}>
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
                                    {this.getText(this.title)}
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
                    <View style={[layout.floatGroup, styles.twocolumn, {marginBottom:20}]}>
                        <FloatLabelTextField
                            placeholder={this.getText('clientmonthlbl')}
                            value={this.clientData.month}
                            onChangeTextValue={this.onChangeTextMonth}
                            underlineColorAndroid="transparent"
                            ref="txtmonthinput"
                            style={[{ width: this.columnWidth - 1 }]}
                        />
                        <View style={styles.seperatecolumn} />
                        <FloatLabelTextField
                            placeholder={this.getText('clientdaylbl')}
                            value={this.clientData.day}
                            onChangeTextValue={this.onChangeTextDay}
                            underlineColorAndroid="transparent"
                            ref="txtdayinput"
                            style={[{ width: this.columnWidth }]}
                        />
                    </View>
                    
                    
            
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder="Add/Deduct reward point"
                            value=""
                            onChangeTextValue={this.onChangeTextreward}
                            underlineColorAndroid="transparent"
                            ref="txtrewardinput"
                        />
                    </View>
                    <FloatSwitch
                            placeholder={'Marketing Opt-Out: Email'}
                            value={this.clientData.OptOutMAIL == 1 ? true : false}
                            onPress={this.ChangeOptOutMAIL}
                            ref="txtOptOutMAIL"  
                        />
                        <FloatSwitch
                            placeholder={'Marketing Opt-Out: SMS'}
                            value={this.clientData.OptOutSMS == 1 ? true : false}
                            onPress={this.ChangeOptOutSMS}
                            ref="txtOptOutSMS"
                        />
                    <View style={styles.btnSave}>
                        <TouchableOpacity
                            activeOpacity={1}
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
        flexDirection: "row",
        flexWrap: "wrap"
    },
    seperatecolumn: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderColor: color.whitishBorder,
        backgroundColor: "red",
        height: 45
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
        right: 15
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    }
});
