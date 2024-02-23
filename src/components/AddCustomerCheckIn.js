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
import { getTextByKey } from "../helpers/language";
import FloatLabelTextInput from "../components/FloatTextInput";
import layout from "../assets/styles/layout";
import FloatLabelSelect from "../components/FloatSelectInput";
import SubmitLoader from "../helpers/submitloader";
import IconLoader from "../helpers/iconloader";
import Colors from "../constants/Colors";
import setting from "../constants/Setting";
import SpinnerLoader from "../helpers/spinner";
import CustomercheckinSelectedCategory from "../components/CustomercheckinSelectedCategory";
import CategoryCheckin from "../components/CategoryCheckin";
import ButtonAddCategory from "../components/ButtonAddCategory";
import {formatprice } from "../helpers/Utils";
import { color } from "../assets/colors/colors";
import { api } from "../api/api";
export default class AddCustomerCheckIn extends React.Component {
   
    clientName = "";
    selectedTime = "";
    dataDefault = {};
    selectedClient = 0;
    categories = [];
    totalBill = 0;
    rewardpoint = 0;
    appliedpoint = 0;
    givepoints = 0;
    isShowLoaderAppointmentDetails = false;
    title = this.props.title;
    columnWidth = Dimensions.get("window").width / 2;
    fullWidth = Dimensions.get("window").width;
    deviceid = this.props.deviceid;
    userData = this.props.userData;
    clients = this.props.clients;
    isClientPhone = false;
    isValidClient = false;
    state = {
        modalVisible: false,
        customercheckid: 0
    };

    async UNSAFE_componentWillMount() {

    }
    close() {

        this.setState({ modalVisible: false });
    }

    show = () => {
        this.setState({ modalVisible: true });
    };
    getText(key){

        return getTextByKey(this.props.language,key);
    }
    onPressCategory = (id, refdata) => {
        let _this = this;
        if (typeof this.refs.CategoryCheckin == "undefined") {
            setTimeout(function() {
                _this.refs.CategoryCheckin.show(refdata,id);
            }, 10);
        } else {
            _this.refs.CategoryCheckin.show(refdata,id);
        }
    };
    _onSelectedCategory = (id, name, oldid) => {
        var _this = this;
        var newCategory = _this.props.categories.filter(function(item){
                return item.id == id;
        })
        if(oldid > 0){
            _this.categories.forEach(function(item){
                if(item.categoryid == oldid){
                    item.categoryid = newCategory[0].id;
                    item.customName = newCategory[0].name;
                    item.name = newCategory[0].namedefault;
                    item.reward_points = newCategory[0].rewardpoints;
                }
            });
        }else{
            let addcat = {};
            addcat.customer_checkin_id = 0;
            addcat.categoryid = newCategory[0].id;
            addcat.customName = newCategory[0].name;
            addcat.name = newCategory[0].namedefault;
            addcat.reward_points = newCategory[0].rewardpoints;
            _this.categories.push(addcat);
        }
        this.setgivepoints(0, true);
        this.refs.CategoryCheckin.setState({ modalVisible: false });
        this.refs.CustomercheckinSelectedCategory.setState({ selectCategory: _this.categories });
    };
    onDeleteCategory = (id) =>{
        var _this = this;
        _this.categories = _this.categories.filter(function(item){
            return item.categoryid != id; 
        });
        this.refs.CategoryCheckin.setState({ modalVisible: false });
        this.refs.CustomercheckinSelectedCategory.setState({ selectCategory: _this.categories });
    }
    setTotalBill = (value) => {
        let formatValue = formatprice(value);
        this.refs.totalbillInput.setState({ text: formatValue });
        this.totalBill = formatValue;
        if(this.totalBill != ""){
            this.setgivepoints(this.totalBill, true);
        }

    }
    setPointApply = (value) => {
        let formatValue = formatprice(value);
        if(formatValue > this.rewardpoint){
            Alert.alert('Error',getTextByKey(this.props.language,'msgerrorapplypointcheckin'));
            formatValue = "";
        }
        this.refs.appliedpointInput.setState({ text: formatValue });
        this.appliedpoint = formatValue;
    }
    setgivepoints = (total, isupdateState) => {
        let points_give = 0;
        let _this = this;
        if(_this.dataDefault.isrewardpoint){
            switch (_this.userData.rewardpointDailyCheckInType){
                case "bycategories":
                    _this.categories.forEach(function(item){
                        points_give += parseFloat(item.reward_points);
                    })
                    break;
                case "bydefaultpoint":
                    points_give = parseFloat(_this.userData.plusPointForDailyCheckInWhenDisableBooking);
                    break;
                case "bytotalbill":
                    if(this.totalBill != "" && this.totalBill > 0){
                        let datarwtotalbill = _this.userData.rewardpointtotalbillCheckin;
                        let calcPoint = 0;
                        for (var i = 0; i < datarwtotalbill.length; ++i) {
                            var item = datarwtotalbill[i];
                            if(parseFloat(total) >= parseFloat(item['price'])){
                                calcPoint = item['point'];
                                break;
                            }
                        }
                        if(calcPoint > 0){
                            points_give = calcPoint;
                            if(_this.userData.rewardpointTotalBillType == "bypercent"){
                                points_give = calcPoint / 100 * total;
                                points_give = Math.round(points_give * 100) / 100
                            }
                        }
                    }
                    break;
            }  
            if(isupdateState){
                this.refs.givepointsInput.setState({ text: points_give.toString() });
            }
        }
        this.givepoints = points_give;      
    }
    savecheckin = () =>{
        let submitData = {};
        submitData.id = this.state.customercheckid;
        submitData.categories = this.categories;
        submitData.totalbill = this.totalBill;
        submitData.applypoints = this.appliedpoint;
        this.refs.appointmentLoader.setState({ visible: true });
        fetch(setting.apiUrl + api.updateCustomerCheckin, {
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
                    setTimeout(function() {
                        _this.fetchError(responseJson);
                    }, 100);
                } else {
                    this.refs.appointmentLoader.setState({
                        visible: false
                    });

                    this.refs.appointmentSuccessLoader.setState({
                        textContent: this.getText('checkinsuccessful'),
                        visible: true
                    });   
                    let _this = this;
                    setTimeout(function() {
                        _this.refs.appointmentSuccessLoader.setState({
                            visible: false
                        });
                        
                        _this.dataDefault.categories = _this.categories;
                        _this.dataDefault.applypoint = _this.appliedpoint;
                        _this.dataDefault.totalBill = _this.totalBill;
                        if(responseJson.customerpoint != ""){
                            let point = parseFloat(_this.appliedpoint) + parseFloat(responseJson.customerpoint);
                            _this.dataDefault.rewardpoint = point;
                        }
                        _this.props.SaveCheckinSuccess(
                            _this.state.customercheckid,
                            _this.dataDefault
                        );
                    }, 2000);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
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
   
    render() {
       this.setgivepoints(this.totalBill, false);
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
            >
                <SafeAreaView style={{ flex: 1 }}>

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
                            <View style={{flex:1}}>

                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        { getTextByKey(this.props.language,'detailappointmenttitle') }
                                    </Text>
                                </View>
                                <View style={layout.floatGroup}>
                                    <FloatLabelTextInput
                                        placeholder={getTextByKey(this.props.language,'clientphoneoremail')}
                                        value={this.clientName}
                                        //onChangeTextValue={(value) => this.setTextClient(value)}
                                        ref="clientInput"
                                    />
                                </View>
                                <View style={layout.floatGroup}>
                                    <FloatLabelSelect
                                        placeholder={this.getText('time')}
                                        value={this.selectedTime}
                                        //onPress={this.onPressSelectTime}
                                        ref="timeInput"
                                    />
                                </View>
                                {
                                    this.userData.rewardpointDailyCheckInType == "bytotalbill" &&
                                    <View style={layout.floatGroup}>
                                    <FloatLabelTextInput
                                        placeholder={getTextByKey(this.props.language,'checkintotalbill')}
                                        value={this.totalBill}
                                        onChangeTextValue={(value) => this.setTotalBill(value)}
                                        ref="totalbillInput"
                                    />
                                </View>
                                }
                                <View style={layout.floatGroup}>
                                    <FloatLabelTextInput
                                        placeholder={getTextByKey(this.props.language,'checkinapplypoints') + " (" +getTextByKey(this.props.language,'checkincurentpoint') +" "+this.rewardpoint+")"}
                                        value={this.appliedpoint}
                                        onChangeTextValue={(value) => this.setPointApply(value)}
                                        ref="appliedpointInput"
                                    />
                                </View>
                                <View style={layout.floatGroup}>
                                    <FloatLabelTextInput
                                        placeholder={getTextByKey(this.props.language,'checkingivepoints')}
                                        value={this.givepoints}
                                        //onChangeTextValue={(value) => this.setgivepoints(value)}
                                        ref="givepointsInput"

                                    />
                                </View>
                                <View style={layout.floatGroupsection}>
                                    <Text style={{ color: color.silver }}>
                                        { getTextByKey(this.props.language,'categorycustomercheckintitle') }
                                    </Text>
                                </View>

                                <CustomercheckinSelectedCategory
                                    ref="CustomercheckinSelectedCategory"
                                    selectCategory={this.categories}
                                    onPress={this.onPressCategory}
                                    userData={this.userData}
                                    categories={this.props.categories}
                                    
                                />

                                <ButtonAddCategory
                                    ref="btnAddCategory"
                                    onPress={this.onPressCategory}
                                    language={this.props.language}
                                    userData={this.userData}
                                /> 

                              
                      
                                <View style={layout.floatGroupSeperate} />  
                                <View style={styles.btnSave}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.btnSaveWraper}
                                        onPress={this.savecheckin}
                                    >
                                        <LinearGradient
                                            start={[0, 0]}
                                            end={[1, 0]}
                                            colors={[color.reddish, color.reddish]}
                                            style={styles.btnLinear}
                                        >
                                            <Text style={styles.btnSaveText}>
                                                {this.getText('savecheckin')}
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                </View>
                                <View style={{ flex: 1 }}>
                            <CategoryCheckin
                                ref={"CategoryCheckin"}
                                data={this.props.categories}
                                onDeleteCategory={this.onDeleteCategory} 
                                selected={this.categories}
                                onSelected={this._onSelectedCategory}
                                userData={this.userData}
                                language={this.props.language}
                            />
                        </View>
                            </ScrollView>  
                        </View>
                        





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
                        textContent={"Check-In Successful"}
                        color={Colors.spinnerLoaderColorSubmit}
                    />

                    <SpinnerLoader
                        visible={this.isShowLoaderAppointmentDetails}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={color.white}
                        textContent={this.getText('loadingcustomercheckin')}
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
        fontSize: 22
    }
});
