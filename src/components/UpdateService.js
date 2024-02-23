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
    TextInput,
    SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import FloatLabelTextField from "../components/FloatTextInput";
import FloatSwitch from "../components/FloatSwitch";
import { formatPhone, formatnumber, formatprice } from "../helpers/Utils";
import Colors from "../constants/Colors";
import SubmitLoader from "../helpers/submitloader";
import IconLoader from "../helpers/iconloader";
import setting from "../constants/Setting";
import CheckBox from 'react-native-check-box';
import { getTextByKey } from "../helpers/language";
import FloatLabelSelect from "../components/FloatSelectInput";
import SelectCategory from "../components/SelectCategory";
import SpinnerLoader from "../helpers/spinner";
import collect from "collect.js";
import { color } from "../assets/colors/colors";
import { api } from "../api/api";
export default class UpdateService extends React.Component {
    state = {
        modalVisible: this.props.visible,
        appIsReady: false
    };
    serviceData = [];
    categorySelectid = 0;
    categoryname = '';
    isShowLoaderAppointmentDetails = false;
    close() {
        //this.props.onClose();
        this.setState({ modalVisible: false });
    }

    show = () => {
        this.setState({ modalVisible: true });
    };
    getText(key){
        return getTextByKey(this.props.language,key);
    }
    _onSelectedCategory = (id, name) => {
        this.categorySelectid = id;
        this.categoryname = name;
        this.serviceData.category_name = name;
        this.serviceData.category_id = id;
        this.refs.CategoryInput.setState({ text: name });
        this.refs.selectcategory.setState({ modalVisible: false });
    };
    onPressCategory = () => {
        let _this = this;
        if (typeof this.refs.selectcategory != "undefined") {
            this.refs.selectcategory.setState({
                selected: _this.categorySelectid,
            });
            this.refs.selectcategory.show(_this.categorySelectid);
        } else {
            setTimeout(function () {
                _this.refs.selectcategory.setState({
                    selected: _this.categorySelectid,
                });
                _this.refs.selectcategory.show(_this.categorySelectid);
            }, 0);
        }
    }
    onChangeTextServicename = value => {
        this.refs.txtservicenameinput.setState({ text: value });
        this.serviceData.service_name = value;
    };
    onChangeTextDuration = value => {
        let formatValue = formatnumber(value);
        this.refs.txtdurationinput.setState({ text: formatValue });
        this.serviceData.duration = formatValue;
    }; 
    onChangeTextPrice = value => {
        let formatValue = formatprice(value);
        this.refs.txtpriceinput.setState({ text: formatValue });
        this.serviceData.price = formatValue;
    }; 
    onChangeTextpricefornew = value => {
        let formatValue = formatprice(value);
        this.refs.txtpricefornewinput.setState({ text: formatValue });
        this.serviceData.price = formatValue;
    }; 
    onChangeTextsupply_cost= value => {
        let formatValue = formatprice(value);
        this.refs.txtsupply_costinput.setState({ text: formatValue });
        this.serviceData.supply_cost = formatValue;
    }; 
    onChangeTextdiscountamtpercentage= value => {
        let formatValue = formatprice(value);
        this.refs.txtdiscountamtpercentageinput.setState({ text: formatValue });
        this.serviceData.discountamtpercentage = formatValue;
    }; 
    onChangeTextdiscountamtcash = value => {
        let formatValue = formatprice(value);
        this.refs.txtdiscountamtcashinput.setState({ text: formatValue });
        this.serviceData.discountamtcash = formatValue;
    }; 
    onChangeTextrewardpoint_amount = value => {
        let formatValue = formatnumber(value);
        this.refs.txtrewardpoint_amountinput.setState({ text: formatValue });
        this.serviceData.rewardpoint_amount = formatValue;
    }; 
    onChangerewardpoint = () =>{
        let value = this.serviceData.rewardpoint == 1 ? true : false;
        this.refs.txtrewardpointinput.setState({ text: !value });
        this.serviceData.rewardpoint = !value == true ? 1 : 0;
    }
    onChangehappyhours = () =>{
        let value = this.serviceData.happyhours == 1 ? true : false;
        this.refs.txthappyhoursinput.setState({ text: !value });
        this.serviceData.happyhours = !value == true ? 1 : 0;
    }
    onChangesenior_discount = () =>{
        let value = this.serviceData.senior_discount == 1 ? true : false;
        this.refs.txtsenior_discountinput.setState({ text: !value });
        this.serviceData.senior_discount = !value == true ? 1 : 0;
    }
    onChangestudent_discount = () =>{
        let value = this.serviceData.student_discount == 1 ? true : false;
        this.refs.txtstudent_discountinput.setState({ text: !value });
        this.serviceData.student_discount = !value == true ? 1 : 0;
    }
    onChangeisVaryPrice= () =>{
        let value = this.serviceData.isVaryPrice == 1 ? true : false;
        this.refs.txtisVaryPriceinput.setState({ text: !value });
        this.serviceData.isVaryPrice = !value == true ? 1 : 0;
    }
    onChangestatus= () =>{
        let value = this.serviceData.status == 1 ? true : false;
        this.refs.txtstatusinput.setState({ text: !value });
        this.serviceData.status = !value == true ? 1 : 0;
    }
    saveClient = () => {
        let isValid = true;
        if (isValid) {
            var formdata = {};
            formdata = this.serviceData;
            this.refs.clientLoader.setState({ visible: true });   
            fetch(setting.apiUrl + api.updateServiceMerchant, {
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
                        this.refs.clientLoader.setState({ visible: false });   
                    } else {
                        this.refs.clientLoader.setState({ visible: false });   

                        let successMessage = "Update Service";
                        this.refs.clientSuccessLoader.setState({
                            textContent: successMessage,
                            visible: true
                        });

                        let _this = this;
                        setTimeout(function() {
                            _this.refs.clientSuccessLoader.setState({
                                visible: false
                            });
                            _this.props.SaveServiceSuccess(
                                _this.serviceData.id,
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
            
            let rootNavigator = this.props.navigation.getNavigator('root'); 
            rootNavigator.replace('login');
        } else {
            Alert.alert("Error", responseJson.message);
        }
    }
    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
            >
                <SafeAreaView style={{flex: 1}}>
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
                                        size={20}
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
                                    {this.title}
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Service name"}
                            value={this.serviceData.service_name}
                            onChangeTextValue={this.onChangeTextServicename}
                            underlineColorAndroid="transparent"
                            ref="txtservicenameinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelSelect
                            placeholder={"Select Category"}
                            value={this.serviceData.category_name == '' ? this.serviceData.category_name : this.serviceData.category_name}
                            onPress={this.onPressCategory}
                            ref="CategoryInput"
                        />
                     </View>
                     <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Duration of Service(minutes)"}
                            value={this.serviceData.duration}
                            onChangeTextValue={this.onChangeTextDuration}
                            underlineColorAndroid="transparent"
                            ref="txtdurationinput"
                        />
                    </View>
                     <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Price For Existing Customer"}
                            value={this.serviceData.price}
                            onChangeTextValue={this.onChangeTextPrice}
                            underlineColorAndroid="transparent"
                            ref="txtpriceinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Price For New Customer"}
                            value={this.serviceData.pricefornew}
                            onChangeTextValue={this.onChangeTextpricefornew}
                            underlineColorAndroid="transparent"
                            ref="txtpricefornewinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Supply Cost"}
                            value={this.serviceData.supply_cost}
                            onChangeTextValue={this.onChangeTextsupply_cost}
                            underlineColorAndroid="transparent"
                            ref="txtsupply_costinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Discount Percent (%)"}
                            value={this.serviceData.discountamtpercentage}
                            onChangeTextValue={this.onChangeTextdiscountamtpercentage}
                            underlineColorAndroid="transparent"
                            ref="txtdiscountamtpercentageinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Discount Amount ($)"}
                            value={this.serviceData.discountamtcash}
                            onChangeTextValue={this.onChangeTextdiscountamtcash}
                            underlineColorAndroid="transparent"
                            ref="txtdiscountamtcashinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatSwitch
                                placeholder={'Enable Reward Point'}
                                value={this.serviceData.rewardpoint == 1 ? true : false}
                                onPress={this.onChangerewardpoint}
                                ref="txtrewardpointinput"
                            />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Reward Point For This Service"}
                            value={this.serviceData.rewardpoint_amount}
                            onChangeTextValue={this.onChangeTextrewardpoint_amount}
                            underlineColorAndroid="transparent"
                            ref="txtrewardpoint_amountinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatSwitch
                                placeholder={'Enable Happy Hours Discount'}
                                value={this.serviceData.happyhours == 1 ? true : false}
                                onPress={this.onChangehappyhours}
                                ref="txthappyhoursinput"
                            />
                    </View>
                    
                    <View style={layout.floatGroup}>
                        <FloatSwitch
                                placeholder={'Enable Senior Discount'}
                                value={this.serviceData.senior_discount == 1 ? true : false}
                                onPress={this.onChangesenior_discount}
                                ref="txtsenior_discountinput"
                            />
                    </View>
                    
                    <View style={layout.floatGroup}>
                        <FloatSwitch
                                placeholder={'Enable Student Discount'}
                                value={this.serviceData.student_discount == 1 ? true : false}
                                onPress={this.onChangestudent_discount}
                                ref="txtstudent_discountinput"
                            />
                    </View>
                    
                    <View style={layout.floatGroup}>
                        <FloatSwitch
                                placeholder={'Price Vary(use this option will show "Price Vary" text instead of specify price above)'}
                                value={this.serviceData.isVaryPrice == 1 ? true : false}
                                onPress={this.onChangeisVaryPrice}
                                ref="txtisVaryPriceinput"
                            />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatSwitch
                                placeholder={'Status'}
                                value={this.serviceData.status == 1 ? true : false}
                                onPress={this.onChangestatus}
                                ref="txtstatusinput"
                            />
                    </View>
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
                    <View style={{ flex: 1 }}>
                            <SelectCategory
                            ref={"selectcategory"}
                            data={this.categoryData}
                            selected={this.serviceData.category_id}
                            onSelected={this._onSelectedCategory}
                            language={this.props.language}
                        /> 
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
                <SpinnerLoader
                        visible={this.isShowLoaderAppointmentDetails}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={color.white}
                        textContent="Loading Service"
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
        flex: 1,
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
    },
    fieldLabel: {
        height: 15,
        fontSize: 10,
        color: color.reddish,
        paddingLeft:15
    },
});
