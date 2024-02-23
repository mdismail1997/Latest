import React from "react";
import { StyleSheet, Text, View, TouchableOpacity,Dimensions, Keyboard, Alert } from "react-native";
import {
    emailRegx,
    inputCurrency
} from "../../helpers/Utils";
import {fetchClientsDataByID} from '../../api/fetchdata';
import { LinearGradient } from 'expo-linear-gradient';
import FloatLabelTextInput from "../FloatTextInput";
import FloatLabelTextField from "../FloatTextInput";
import { getTextByKey } from "../../helpers/language";
import { formatPhone } from "../../helpers/Utils";
import emailvalidator from "email-validator";
import ClientSearchModal from "../ClientSearchModal";
import setting from "../../constants/Setting";
import layout from "../../assets/styles/layout";
import Colors from "../../constants/Colors";
import IconLoader from "../../helpers/iconloader";
import SubmitLoader from "../../helpers/submitloader";
import ModalBarCode from "../../components/ModalBarCode";
import { Camera } from 'expo-camera';
import { color } from "../../assets/colors/colors";
import { api } from "../../api/api";
var width = Dimensions.get('window').width;
var amountWidth = (width - 30) / 5;
export default class GiftAmount extends React.Component {
    constructor(props) {
        super(props);
        this.clientlistmodalRef = React.createRef();
      }
    state = {
        valueOther: false
    }
    qrCodePermissionStatus = false;
    provider = this.props.provider;
    amount = 0;
    ApproxValue = 0;
    clientName = "";
    selectedClient = 0;
    isClientPhone = false;
    isValidClient = false;
    clients = this.props.clients;
    recipientname = "";
    recipientemail = "";
    code = '';
    async UNSAFE_componentWillMount() {
        const { status } = await Camera.requestCameraPermissionsAsync();
        this.qrCodePermissionStatus = (status === 'granted');
    }
    onChangeBtnCCAmount = value => {
        value = inputCurrency(value);
        this.amount = parseFloat(value.replace('$',''));
        let ApproxValue = parseFloat(value.replace('$',''));
        if(this.provider.percentPlusForGiftCard > 0){ 
            this.ApproxValue  = ApproxValue + (ApproxValue * this.provider.percentPlusForGiftCard / 100);
        }else{
            this.ApproxValue = 0;
        }
        this.props.onInputAmount(this.amount);
        this.setState({ valueOther: false});
    };
    getText(key){
        return getTextByKey(this.props.language,key);
    }
    clearForm = () => {
        this.amount = 0;
        this.ApproxValue = 0;
        this.clientName = "";
        this.selectedClient = 0;
        this.isClientPhone = false;
        this.isValidClient = false;
        this.recipientname = "";
        this.recipientemail = "";
        this.code = '';
        this.state = {
            valueOther: false
        }
    }
    otheramount=()=>{
        this.ApproxValue = 0;
        this.amount = 0;
        this.amountshow = '';
        this.setState({valueOther:true});
    }

    onChangeTextCCAmount = value => {
        value = inputCurrency(value);
        this.amountshow = value;
        this.amount = parseFloat(value.replace('$',''));
        let ApproxValue = parseFloat(value.replace('$',''));
        if(this.provider.percentPlusForGiftCard > 0 && this.amount){ 
            this.ApproxValue  = ApproxValue + (ApproxValue * this.provider.percentPlusForGiftCard / 100);
        }else{
            this.ApproxValue = 0;
        }
        this.props.onInputAmount(this.amount);
        this.refs.ccamountinput.setState({ text: value });
        this.setState({rerender:true});
    };
    onChangeTextRecipientName = (value) => {
        this.refs.RecipientName.setState({ text: value });
        this.recipientname = value;
    }
    onChangeTextCode = (value) => {
        this.refs.code.setState({ text: value });
        this.code = value;
    }
    onChangeTextRecipientEmail = (value) => {
        this.refs.RecipientEmail.setState({ text: value });
        this.recipientemail = value;
    }

    refreshClients = async () => {

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
        
        if(clientList.length){
            this.clients = clientList;
        }

        this.setTextClient(this.clientName);
    }
    setTextClient = async(value) => {

        value = String.prototype.trim.call(value);
        value = value.replace('(','');
        value = value.replace(')','');
        value = value.replace(' ','');
        value = value.replace('-','');
        let isPhone = false;
        if(value.length >= 3 && !isNaN(value)){
            let formatValue = formatPhone(value);
            this.refs.clientInput.setState({text: formatValue});
            isPhone = true;
            value = formatValue.replace(/[^\d]+/g, '');
        }
        this.clientName = value;
        if(value.length == 4 || value.length == 6 || value.length == 8 || value.length >= 10){
            let clientsFiltered = [];
            let isActive = false;
            let _this = this;
                if(isPhone){
                    isActive = value.length == 10;
                }else{
                    isActive = emailvalidator.validate(String.prototype.trim.call(value));
                }
            let searchData = {};
            searchData.search = value;
            searchData.clientid = '';
            clientsFiltered = await fetchClientsDataByID(searchData, _this.props.token);
            this.isClientPhone = isPhone;
            this.isValidClient = isActive;
            this.clientlistmodalRef.current.show(clientsFiltered.slice(0, 5),isPhone,true, isActive,value);
        }else if(value.length == 0){
            this.isClientPhone = false;
            this.clientName = '';
            this.isValidClient = false;
            this.clientlistmodalRef.current.show([],false,false,false,value);
        }
    }
    _onSelectedClient = (client, lbl) => {
        this.refs.clientInput.setState({text: lbl});
        Keyboard.dismiss();
        this.clientlistmodalRef.current.show([],false,false, false,'');
        this.selectedClient = client.id;
    }
    createAsNewClient = (value) => {
        this.clientName = value;
        this.selectedClient = 0;
        this.clientlistmodalRef.current.show([],false,false, false,'');
    }
    async savesell(){
        var isvalid = true;
        if(this.selectedClient == 0){
            Alert.alert('Error', "Please select client");
            isvalid = false;
        }else if(this.amount == 0){
            Alert.alert('Error', "Please select amount");
            isvalid = false;
        }else if(this.props.type == "giveagift"){
            if(String.prototype.trim.call(this.recipientname) == ''){
                Alert.alert('Error','Please enter Recipient\'s name');
                isvalid = false;
            }else if(String.prototype.trim.call(this.recipientemail) == ''){
                Alert.alert('Error','Please enter Recipient\'s email');
                isvalid = false;
            }else if(!emailRegx.test(String.prototype.trim.call(this.recipientemail))){
                Alert.alert('Error', 'Please enter a valid email');
                isvalid = false;
            }
        }
        if(isvalid){
            this.refs.saveLoader.setState({ visible: true });
            //call login api
           let isSuccess = await fetch(setting.apiUrl + api.seeEGift,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + this.props.token
                },
                body: JSON.stringify({
                    amount: this.amount,
                    clientid: this.selectedClient,
                    type: this.props.type,
                    recipientname:this.recipientname,
                    recipientemail:this.recipientemail,
                    code: this.code  
                })
            }).then((response) => response.json()).then((responseJson) => {
                if(!responseJson.success){
                    let _this = this;
                    Alert.alert('Error', responseJson.message);
                    return false;
                }else{
                    let _this = this;
                    _this.refs.saveLoader.setState({ visible: false });   
                    let successMessage = "Save success";
                    _this.refs.saveSuccessLoader.setState({
                        textContent: successMessage,
                        visible: true
                    });
                    setTimeout(function() {
                        _this.refs.saveSuccessLoader.setState({
                            visible: false
                        });
                        _this.refs.clientInput.setState({text: ""});
                        _this.clearForm();
                        _this.props.onPay();
                        _this.setState({ valueOther: false });
                    }, 3000);
                    return true; 
                }
                
            }).catch((error) => {
                console.error(error);
            });
             if(!isSuccess){
                 setTimeout(() => {
                    this.refs.saveLoader.setState({ visible: false }); 
                 }, 2000);
                
             }
        }
    };
    scanQrcode = async () => {
        if(this.qrCodePermissionStatus){
            clearInterval(0);
            let orien ='portrait';
            this.refs.ModalBarCode.show(orien);
        }
    }
    closeBarCode = () => {

    }
    scannedBarCode =  (data) => {
        this.refs.code.setState({ text: data });
        this.code = data;
        this.refs.ModalBarCode.close();
    }
    render() {

        return (
            <View>
                <View>
                    <View style={styles.clientrow}>
                        <Text style={styles.clientlbl}>Choose amount</Text>
                        
                        <View style={{  flexDirection:'row',marginTop:15}}>
                            <TouchableOpacity onPress={() => {this.onChangeBtnCCAmount('$10')}} 
                                style={[styles.btn_amount,this.amount == 10 && !this.state.valueOther ? styles.active : false,{borderTopLeftRadius: 4, borderBottomLeftRadius: 4}]}>
                                <Text style={[styles.amounttxt, this.amount == 10 && !this.state.valueOther ? styles.active : false]}>$10</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {this.onChangeBtnCCAmount('$30')}}
                                style={[styles.btn_amount,styles.btn_amount_on,this.amount == 30 && !this.state.valueOther ? styles.active : false ]}>
                                <Text style={[styles.amounttxt, this.amount == 30 && !this.state.valueOther ? styles.active : false]}>$30</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {this.onChangeBtnCCAmount('$50')}} 
                                style={[styles.btn_amount,styles.btn_amount_on,this.amount == 50 && !this.state.valueOther ? styles.active : false ]}>
                                <Text style={[styles.amounttxt, this.amount == 50 && !this.state.valueOther ? styles.active : false]}>$50</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {this.onChangeBtnCCAmount('$100')}} 
                                style={[styles.btn_amount,styles.btn_amount_on,this.amount == 100 && !this.state.valueOther ? styles.active : false ]}>
                                <Text style={[styles.amounttxt, this.amount == 100 && !this.state.valueOther ? styles.active : false]}>$100</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {this.otheramount()}} 
                                style={[styles.btn_amount,styles.btn_amount_on, this.state.valueOther ? styles.active : false,{borderTopRightRadius: 4, borderBottomRightRadius: 4} ]}>
                                <Text style={[styles.amounttxt, this.state.valueOther ? styles.active : false]}>Other</Text>
                            </TouchableOpacity>
                        </View>
                            {
                                this.state.valueOther == true &&
                                <View style={{marginTop:10}}>
                                    <FloatLabelTextField
                                        placeholder={"Other Amount"}
                                        value={this.amountshow}
                                        onChangeTextValue={this.onChangeTextCCAmount}
                                        underlineColorAndroid="transparent"
                                        ref="ccamountinput"
                                    />
                                </View>
                            }
                            
                    </View>
                </View> 
                {
                    this.ApproxValue > 0 && 
                    <View style={[styles.columnWraperLeft]}>
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlbl}>Approx Value: <Text style={{color:'red'}}>${this.ApproxValue}</Text></Text>
                        </View>
                    </View>
                }
                <View style={styles.blockseperate}></View>
                <View style={styles.clientrow2}>
                    <Text style={styles.clientlbl1}>Choose client</Text>
                    <FloatLabelTextInput
                            placeholder={getTextByKey(this.props.language,'clientphoneoremail')}
                            value={this.clientName}
                            onChangeTextValue={(value) => this.setTextClient(value)}
                            ref="clientInput"
                        />
                    <ClientSearchModal
                    ref={this.clientlistmodalRef}
                    onSelectedClient={this._onSelectedClient}
                    createAsNewClient={this.createAsNewClient}
                    token={this.props.token}
                    refresh={async () => { await this.refreshClients() }}
                    language={this.props.language}
                />
                </View>
                { this.props.type == "giveagift" &&
                <View style={{zIndex:-1}}>
                    <TouchableOpacity onPress={() => {this.scanQrcode()}} 
                                style={[{marginLeft:10,borderColor: color.whitishBorder, padding:10, borderWidth: 1, width: 200, alignItems:'center',borderTopLeftRadius: 4, borderBottomLeftRadius: 4}]}>
                                <Text style={[styles.amounttxt]}>Scan barcode</Text>
                            </TouchableOpacity>
                    <View style={styles.blockseperate}></View>
                    <View style={{paddingTop:15}}>
                        <Text style={styles.clientlbl1}>Recipient Info</Text>
                        <View style={[layout.floatGroup,{marginTop:5,marginBottom:5}]}>
                            <FloatLabelTextInput
                                placeholder={"Redeem Code"}
                                value={this.recipientname}
                                onChangeTextValue={this.onChangeTextCode}
                                underlineColorAndroid="transparent"
                                ref="code"
                            />
                        </View>
                        <View style={[layout.floatGroup,{marginTop:5,marginBottom:5}]}>
                            <FloatLabelTextInput
                                placeholder={"Recipient's name"}
                                value={this.recipientname}
                                onChangeTextValue={this.onChangeTextRecipientName}
                                underlineColorAndroid="transparent"
                                ref="RecipientName"
                            />
                        </View>
                        <View style={[layout.floatGroup,{marginTop:5,marginBottom:5}]}>
                            <FloatLabelTextInput
                                placeholder={"Recipient's email"}
                                value={this.recipientemail}
                                onChangeTextValue={this.onChangeTextRecipientEmail}
                                underlineColorAndroid="transparent"
                                ref="RecipientEmail"
                            />
                        </View>
                    </View>
                </View>
                }


                <TouchableOpacity
                    style={styles.btnLogout}
                    activeOpacity={1}
                    onPress={async () => await this.savesell()}
                >
                <LinearGradient
                    start={[0, 0]}
                    end={[1, 0]}
                    colors={[
                    color.darkCyan,
                    color.darkCyan]}
                    style={styles.btnLinear}>
                    <Text style={styles.btnLogoutText}>
                        Submit
                    </Text>
                </LinearGradient>
                </TouchableOpacity>
                <SubmitLoader
                        ref="saveLoader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmit}
                        textContent={this.getText('processing')}
                        color={Colors.spinnerLoaderColorSubmit}
                    />
                <IconLoader
                    ref="saveSuccessLoader"
                    visible={false}
                    textStyle={layout.textLoaderScreenSubmitSucccess}
                    textContent="Sell Success"
                    color={Colors.spinnerLoaderColorSubmit}
                />
                <ModalBarCode ref='ModalBarCode' closeBarCode={this.closeBarCode} scanned={this.scannedBarCode} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    clientrow:{
        backgroundColor: color.white,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        position:'relative'
    },   
    clientrow2:{
        backgroundColor: color.white,
        paddingTop:15,
        paddingBottom:5,
        position:'relative'
    }, 
     clientlbl:{
        flexDirection:'row',
        fontSize: 18
    },
    clientlbl1:{
        flexDirection:'row',
        fontSize: 18,
        paddingLeft:15,
        paddingRight:15,
        zIndex:-1
    },
    btn_amount:{
        borderColor: color.whitishBorder,
        padding:10,
        borderWidth: 1,
        width: amountWidth,
        alignItems:'center'
    },
    btn_amount_on:{
        borderLeftWidth:0, 
    },
    amounttxt:{
        fontSize:16
    },
    active:{
        backgroundColor:color.darkCyan,
        color:  color.white,
        fontWeight: 'bold'
    },
    blockseperate:{
        height:10,
        backgroundColor: color.lightWhite,
        zIndex:-1
    },
    btnLogout: {
        height:50,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 25,
        borderRadius: 25,
        borderColor: color.whitishBorder,
        zIndex:-1,
        marginBottom:100
    },
    btnLogoutText:{
        color: color.white,
        fontSize: 18
    },
        btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        overflow: "hidden",
        flex: 1,
        width: 300
    },
});
