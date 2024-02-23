import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Alert,
    Keyboard
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import { LinearGradient } from 'expo-linear-gradient';
import TextField from 'react-native-md-textinput';
import { emailRegx, formatPhone, inputBirthDate } from "../../helpers/Utils";
import emailvalidator from "email-validator";
import SubmitLoader from "../../helpers/submitloader";
import Colors from "../../constants/Colors_checkin";
import FloatSwitch from "../../components/FloatSwitch";
import FloatLabelTextInput from "../../components/FloatTextInput";
import ClientSearchModal from "../../components/ClientSearchModal";
import MailModal from "../../components/MailModal";
import {
    fetchClientsDataByID,

} from "../../api/fetchdata";
import { color } from "../../assets/colors/colors";
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var iPadPro = false;
if(width > 1024){
    iPadPro = true;
}

var screenOrientation = 'PORTRAIT';
if(width > height){
    screenOrientation = 'LANDSCAPE';
}

export default class NewClient extends React.Component{
    constructor(props) {
        super(props);
        this.clientlistmodalRef = React.createRef();
        this.mailmodalRef = React.createRef();
      }
    state = {
        appIsReady: false,
        email: this.props.client.email
    }

    clientData = {
        id : 0,
        firstname : "",
        lastname : "",
        email : this.props.client.email,
        phone : this.props.client.phone,
        birthdate : "",
        month: "",
        day: "",
        clientSponsor: "",
    };
    arrMailDefault = ["gmail.com","hotmail.com","yahoo.com","yahoo.com.vn","mail.com","live.com","rocketmail.com","msn.com","thepronails.com","outlook.com"];
    clients = {};
    clientSponsor = '';
    async UNSAFE_componentWillMount(){
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    
        width = Dimensions.get('window').width;
        height = Dimensions.get('window').height;

        if(width > height){
            screenOrientation = 'LANDSCAPE';
        }else{
            screenOrientation = 'PORTRAIT'
        }

        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;
            if(width > height){
                screenOrientation = 'LANDSCAPE';
            }else{
                screenOrientation = 'PORTRAIT'
            }
            if(typeof(_this.refs.scrolleditcustomer) != 'undefined'){
                setTimeout(function(){
                    _this.refs.scrolleditcustomer.scrollTo({x: 0, y: 0, animated: true});  
                },1000);     
                      
            }
        })
        // var clients = await fetchClientsData(this.props.token);
        // this.clients = clients;
    }

    

    UNSAFE_componentWillUnmount () {
        this.keyboardDidHideListener.remove();
        Dimensions.removeEventListener("change", () => {});
      }

    _keyboardDidHide () {
        if(!iPadPro){
            if(screenOrientation == 'LANDSCAPE' && typeof(this.refs.scrolleditcustomer) != 'undefined'){
                this.refs.scrolleditcustomer.scrollTo({x: 0, y: 0, animated: true});        
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
        this.refs.txtphoneinput.setState({ text: formatValue });
        this.clientData.phone = formatValue;        
    }

    changeEmail = (email) => {
        this.clientData.email = email;
        var str = email;
        var arr = str.split("@");
        if(arr.length > 1 && arr[1] == ""){
            this.mailmodalRef.current.show(this.arrMailDefault, true);
        }else if(arr.length > 1 && arr[1] != ""){
            let arrmailFilter = this.arrMailDefault.filter(function(el){
                return el.toLowerCase().indexOf(arr[1]) !== -1;
            });
            if(arrmailFilter.length == 0){
                this.mailmodalRef.current.show([], false);
            }else{
                this.mailmodalRef.current.show(arrmailFilter, true);
            }
        }else this.mailmodalRef.current.show([], false);
    }
    _onSelectedMail = (mail) => {
        var value = this.clientData.email;
        var arr = value.split("@");
        value = arr[0] +"@" + mail;

        this.setState({appIsReady:true,  email: value});
        this.mailmodalRef.current.show([],false);
    }
    changeBirthdate = (value) => {
        let formatValue = inputBirthDate(value);
        if (formatValue != "" && parseInt(formatValue) > 12) formatValue = "12";
        this.refs.txtmonthinput.setState({ text: formatValue });
        this.clientData.birthdate = formatValue;

        let birthdate = formatValue.split('/');
        this.clientData.month = birthdate[0];
        if(birthdate.length > 1){
            this.clientData.day = birthdate[1];
        }
    }
    onChangeOptOutSMS = () =>{
        let value = this.clientData.OptOutSMS == 1 ? true : false;
        this.refs.txtOptOutSMS.setState({ text: !value });
        this.clientData.OptOutSMS = !value == true ? 1 : 0;
    }
    onChangeOptOutMAIL = () =>{
        let value = this.clientData.OptOutMAIL == 1 ? true : false;
        this.refs.txtOptOutMAIL.setState({ text: !value });
        this.clientData.OptOutMAIL = !value == true ? 1 : 0;
    }
    updateClient = async () => {
        let isValid = true;
        
       if (String.prototype.trim.call(this.clientData.firstname) == "") {
           isValid = false;
           Alert.alert("Error", "Please enter first name");
       } else if (String.prototype.trim.call(this.clientData.email) != "" && !emailRegx.test(String.prototype.trim.call(this.clientData.email))) {
           isValid = false;
           Alert.alert("Error", "Please enter valid email or leave empty");
       } else if (
           String.prototype.trim.call(this.clientData.phone) == "" &&
           this.clientData.phone.length != 14
       ) {
           isValid = false;
           Alert.alert(
               "Error",
               "Please enter a valid phone with mask (###) ###-####"
           );
       } else if (
           String.prototype.trim.call(this.clientData.month) != "" ||
           String.prototype.trim.call(this.clientData.day) != ""
       ) {
           if (String.prototype.trim.call(this.clientData.month) == "") {
               isValid = false;
               Alert.alert("Error", "Please enter birthdate with format MM / DD or leave empty");
           } else if (String.prototype.trim.call(this.clientData.day) == "") {
               isValid = false;
               Alert.alert("Error", "Please enter birthdate with format MM / DD or leave empty");
           }
       }
       if(isValid){
            if (
                String.prototype.trim.call(this.clientData.month) != "" &&
                String.prototype.trim.call(this.clientData.day) != ""
            ) {
                this.clientData.birthdate =
                    this.clientData.month + "/" + this.clientData.day;
            }
            this.props.onPress(this.clientData);
       }
    }

    back = () => {
        this.props.onBack();
    }

    onFocus = (refname) => {
        if(screenOrientation == 'LANDSCAPE' && !iPadPro){
            if(refname == 'firstname' || refname == 'lastname'){
                this.refs.scrolleditcustomer.scrollTo({x: 0, y: 85, animated: true});
            }
            if(refname == 'phone' || refname == 'birthdate'){
                this.refs.scrolleditcustomer.scrollTo({x: 0, y: 200, animated: true});
            }
            if( refname == 'email'){
                this.refs.scrolleditcustomer.scrollTo({x: 0, y: 300, animated: true});
            }
        }
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
        this.clientData.clientSponsor = client.id;

    }
    nextChooseService = () =>{
        this.updateClient();
    }
    render() {   
        let fieldClient_app_checkin = '';
        let field_firstname = 0;
        let field_lastname = 0;
        let field_phone = 0;
        let field_birthdate = 0;
        let field_email = 0;
        let field_optout_sms = 0;
        let field_optout_email = 0;
        if(typeof(this.props.userData.fieldClient_app_checkin) != 'undefined' && this.props.userData.fieldClient_app_checkin != '' && this.props.userData.fieldClient_app_checkin != null){
            fieldClient_app_checkin = this.props.userData.fieldClient_app_checkin;
            field_firstname = fieldClient_app_checkin['field_firstname'];
            field_lastname = fieldClient_app_checkin['field_lastname'];
            field_phone = fieldClient_app_checkin['field_phone'];
            field_birthdate = fieldClient_app_checkin['field_birthdate'];
            field_email = fieldClient_app_checkin['field_email'];
            field_optout_sms = fieldClient_app_checkin['field_optout_sms'];
            field_optout_email = fieldClient_app_checkin['field_optout_email'];
        }
        return (
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always' ref='scrolleditcustomer'>
                <View style={{flex: 1, flexDirection: 'row'}}> 
                    <Text style={styles.clientTitle}>Create New Client</Text>
                </View>

                {this.props.providerid == 9144 &&
                <View style={styles.twocolumns}>
                <View style={styles.column}>
                    <View style={styles.floatGroup}>
                        <FloatLabelTextInput
                            placeholder="Select a Sponsor (Search by phone or email)"
                            value=""
                            onChangeTextValue={(value) => this.setTextClient(value)}
                            //onPress={async () => {await this.onPressClient()}}
                            ref="clientInput"
                        />
                    </View>

                </View>
                </View>
                }
                <ClientSearchModal
                        ref={this.clientlistmodalRef}
                        //selected={this.selectedClient}
                        onSelectedClient={this._onSelectedClient}
                        createAsNewClient={this.createAsNewClient}
                        token={this.props.token}
                        refresh={async () => { await this.refreshClients() }}
                        language={this.props.language}
                        //onClose={this.onCloseModalClientList}
                        //token={this.props.token}
                    />
                <View style={styles.twocolumns}>
                    {
                        field_firstname == 0 &&
                        <View style={styles.column}>
                        <TextField label={'First Name'} 
                            onChangeText={(firstname) => this.changeFirstName(firstname)}
                            highlightColor={color.white}
                            textFocusColor={color.white} 
                            borderColor={color.white}
                            value={this.clientData.firstname}
                            labelStyle={StyleSheet.flatten(styles.labelStyle)}
                            inputStyle={StyleSheet.flatten([styles.textbox])}
                            onFocus={() => this.onFocus('firstname')}
                        />
                    </View>
                    }
                    {
                        field_lastname == 0 && 
                        <View style={styles.column}>
                        <TextField label={'Last Name'} 
                            onChangeText={(lastname) => this.changeLastName(lastname)}
                            highlightColor={color.white} 
                            value={this.clientData.lastname}
                            labelStyle={StyleSheet.flatten(styles.labelStyle)}
                            inputStyle={StyleSheet.flatten([styles.textbox])}
                            onFocus={() => this.onFocus('lastname')}
                        />
                    </View>
                    }

                  
                </View>

                <View style={styles.twocolumns}>
                    {
                        field_phone == 0 && 
                         <View style={styles.column}>
                            <TextField label={'Phone'} 
                                onChangeText={(phone) => this.changePhone(phone)}
                                highlightColor={color.white} 
                                keyboardType={"numeric"}
                                value={this.clientData.phone}
                                labelStyle={StyleSheet.flatten(styles.labelStyle)}
                                inputStyle={StyleSheet.flatten([styles.textbox])}
                                ref={'txtphoneinput'}
                                onFocus={() => this.onFocus('phone')}
                                maxLength={14}
                            />
                        </View>
                    }
                   {
                    field_birthdate == 0 && 
                                            <View style={styles.column}>
                            <TextField label={'Birthdate (MM / DD)'} 
                            keyboardType={"phone-pad"}
                            onChangeText={(birthdate) => this.changeBirthdate(birthdate)}
                            highlightColor={color.reddish} 
                            value={this.clientData.birthdate}
                            labelStyle={StyleSheet.flatten(styles.labelStyle)}
                            inputStyle={StyleSheet.flatten([styles.textbox])}
                            ref={'txtmonthinput'}
                            onFocus={() => this.onFocus('birthdate')}
                            maxLength={5}
                            />
                        </View>
                   }


                </View>

                <View style={styles.twocolumns}>
                    {
                        field_email == 0 && 
                        <View style={[styles.column, {width:"100%"}]}>
                        <TextField label={'Email'} 
                                onChangeText={(email) => this.changeEmail(email)}
                                highlightColor={color.white} 
                                value={this.state.email}
                                labelStyle={StyleSheet.flatten(styles.labelStyle)}
                                inputStyle={StyleSheet.flatten([styles.textbox])}
                                onFocus={() => this.onFocus('email')}
                            />
                        <MailModal
                            ref={this.mailmodalRef}
                            onSelectedMail={this._onSelectedMail}
                            top={120}
                        /> 
                    </View>
                    }
                    
                </View>
                <View style={[styles.twocolumns, styles.floatGroup, {marginTop:40, paddingRight:25, zIndex:-1}]}>
                    {
                        field_optout_sms == 0 && 
                                            <FloatSwitch
                        placeholder={'Marketing Opt-Out: SMS'}
                        value={this.clientData.OptOutSMS == 1 ? true : false}
                        onPress={this.onChangeOptOutSMS}
                        ref="txtOptOutSMS"
                    />
                    }
                    {
                        field_optout_email == 0 && 
                                            <FloatSwitch
                            placeholder={'Marketing Opt-Out: Email'}
                            value={this.clientData.OptOutMAIL == 1 ? true : false}
                            onPress={this.onChangeOptOutMAIL}
                            ref="txtOptOutMAIL"
                        />
                    }

                </View>
                <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', zIndex:-1}}>

                    <View style={[styles.btnSave,{width: 100, marginBottom: 300}]}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.btnSaveWraper}
                            onPress={async () => {await this.updateClient()}}
                        >
                            <LinearGradient
                                start={[0, 0]}
                                end={[1, 0]}
                                colors={[color.white, color.white]}
                                style={styles.btnLinear}
                            >
                                <Text style={styles.btnSaveText}>SAVE</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
                <SubmitLoader
                    ref="appointmentLoader"
                    visible={false}
                    textStyle={layout.textLoaderScreenSubmit}
                    textContent={"Processing..."}
                    color={Colors.spinnerLoaderColorSubmit}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height:550
    },
    twocolumns:{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    column:{
        flex:1,
        width: "50%",   
    },
    title:{
        fontSize:22,
        fontFamily:'Futura',
        textAlign:'center',
        color: color.blackish
    },
    column:{
        paddingTop:30,
        flex:1
    },
    contentsWrapperLeft:{
        marginTop:10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:color.white,
        marginLeft:20,
        marginRight:10
    },
    labelStyle:{
        fontSize:13,
        color:color.white,
        fontFamily:'Futura',
        marginLeft:10, 
    },
    textbox:{
        height:45,
        color:color.white,
        fontSize:20,
        marginLeft:10, 
        fontFamily:'Futura',
        marginBottom: 10,
        paddingRight:30
    },
    contentsWrapperRight:{
        marginTop:10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:color.white,
        marginLeft:10,
        marginRight:20
    },
    btnSave: {
        height: 45,
        justifyContent: 'flex-end',
        marginTop: 50,
        marginBottom: 15
    },
    btnSaveText: {
        color: color.pelorous,
        fontSize: 18,
        zIndex: 1,
        backgroundColor: color.white,
        fontWeight: 'bold',
        fontFamily:'Futura',
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
    vertical:{
        width:1,
        height:400,
        backgroundColor: color.whitishBorder,
        position:'absolute',
        top:75
    },
    btnSaveWraperNormal: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5
    },
    floatGroup:{
        height:50,
        marginTop:10
    },    
    clientTitle:{
        color:color.white,
        fontSize:25,
        fontFamily:'Futura',
    },
    btnSaveWraperNormal: {
        // position: "absolute",
        // top: 0,
        // bottom: 0,
        // left: 0,
        // right: 0,
        // justifyContent: "center",
        // alignItems: "center",
        // borderRadius: 5,
        marginLeft:65,
        marginTop:7,

    }, 
})