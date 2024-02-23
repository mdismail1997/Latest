import React from "react";
import { StyleSheet ,Text, View, Modal, TouchableOpacity, Alert } from "react-native";
import layout from "../../assets/styles/layout_checkin";
import { LinearGradient } from 'expo-linear-gradient';
import TextField from 'react-native-md-textinput';
import { emailRegx, formatPhone, inputBirthDate } from "../../helpers/Utils";
import SubmitLoader from "../../helpers/submitloader";
import Colors from "../../constants/Colors_checkin";
import setting from "../../constants/Setting";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../../assets/colors/colors";
import { api } from "../../api/api";

//import layout from "../assets/styles/layout";

export default class ModalEditClient extends React.Component {
    state = {
        modalVisible: false,
    }
    clientData = '';

    close() {
        this.setState({modalVisible: false});
    }

    show = (data) => {
        this.clientData = data;
        this.clientData.month = '';
        this.clientData.day = '';
        if(data.birthdate == null){
            data.birthdate = '';
            this.clientData.birthdate = '';
        }
        let birthdate = data.birthdate.split('/');
        this.clientData.month = birthdate[0];
        if(birthdate.length > 1){
            this.clientData.day = birthdate[1];
        }
        this.setState({modalVisible: true });
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

    updateClient = async () => {
        let isValid = true;
        
       if (String.prototype.trim.call(this.clientData.firstname) == "") {
           isValid = false;
           Alert.alert("Error", "Please enter first name");
       } else if (String.prototype.trim.call(this.clientData.lastname) == "") {
           isValid = false;
           Alert.alert("Error", "Please enter last name");
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
            //this.clientData.id = 0;
            //this.props.onPress(this.clientData);
            //console.log(this.clientData);
            
            this.refs.appointmentLoader.setState({ visible: true });

            
            fetch(setting.apiUrl + api.checkinClientUpdate, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + this.props.token
                },
                body: JSON.stringify(this.clientData)
            })
            .then(response => response.json())
            .then(responseJson => {
                if (!responseJson.success) {
                    
                    //console.log(responseJson);
                    this.refs.appointmentLoader.setState({
                        visible: false
                    });
                    let _this = this;
                    setTimeout(function(){
                        Alert.alert('Error',responseJson.message);
                    },10);
                    
                    //Alert.alert('Error', responseJson.message);
                    //return [];
                } else {
                    /*
                    let clients = this.props.clients;     
                    let clientFilterData = clients.filter(function(itemClient){
                        return itemClient.id != responseJson.data.id;       
                    });
                    clientFilterData.push(responseJson.data);    
                    AsyncStorage.setItem('list-client', JSON.stringify(clientFilterData)); */
                    
                    this.refs.appointmentLoader.setState({
                        visible: false
                    });

                    this.props.onUpdated(responseJson.data);
                }
            })
            .catch(error => {
                console.error(error);
                //return [];
            });
       }
    }

    render() {
        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
                supportedOrientations={['landscape']}
            >
                <View style={styles.container}>
                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>Update Client Information</Text>
                            
                            <TouchableOpacity style={styles.closebtnright} activeOpacity={1}
                                onPress={() => this.close()}>
                                <Icon
                                    name={'close'}
                                    size={30}
                                    color={color.whiteRBG1} style={styles.navIconIOS}
                                />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                    <View style={styles.columnContainer}>
                        <View style={styles.containerEditClient} keyboardShouldPersistTaps='always'>
                            <View style={styles.twocolumns}>
                                <TextField label={'First Name'} 
                                    onChangeText={(firstname) => this.changeFirstName(firstname)}
                                    highlightColor={color.reddish} 
                                    value={this.clientData.firstname}
                                    labelStyle={StyleSheet.flatten(styles.labelStyle)}
                                    inputStyle={StyleSheet.flatten([styles.textbox,{width: 270}])}
                                />
                                <TextField label={'Last Name'} 
                                    onChangeText={(lastname) => this.changeLastName(lastname)}
                                    highlightColor={color.reddish} 
                                    value={this.clientData.lastname}
                                    labelStyle={StyleSheet.flatten(styles.labelStyle)}
                                    inputStyle={StyleSheet.flatten([styles.textbox, {width: 270}])}
                                />
                            </View>
                            <TextField label={'Phone'} 
                                onChangeText={(phone) => this.changePhone(phone)}
                                highlightColor={color.reddish} 
                                value={this.clientData.phone}
                                labelStyle={StyleSheet.flatten(styles.labelStyle)}
                                inputStyle={StyleSheet.flatten([styles.textbox, {width: 270}])}
                                ref={'txtphoneinput'}
                                maxLength={14}
                            />
                            <TextField label={'Email'} 
                                onChangeText={(email) => this.changeEmail(email)}
                                highlightColor={color.reddish} 
                                value={this.clientData.email}
                                labelStyle={StyleSheet.flatten(styles.labelStyle)}
                                inputStyle={StyleSheet.flatten([styles.textbox, {width: 270}])}
                            />
                            
                            <TextField label={'Birthdate (MM / DD)'} 
                                onChangeText={(birthdate) => this.changeBirthdate(birthdate)}
                                highlightColor={color.reddish} 
                                value={this.clientData.birthdate}
                                labelStyle={StyleSheet.flatten(styles.labelStyle)}
                                inputStyle={StyleSheet.flatten([styles.textbox, {width: 560}])}
                                ref={'txtmonthinput'}
                                maxLength={5}
                            />

                            <View style={styles.onecolumn}>
                                
                                <View style={[styles.btnSave,{width: 270}]}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.btnSaveWraper}
                                        onPress={async () => {await this.updateClient()}}
                                    >
                                        <LinearGradient
                                            start={[0, 0]}
                                            end={[1, 0]}
                                            colors={[color.reddish, color.reddish]}
                                            style={styles.btnLinear}
                                        >
                                            <Text style={styles.btnSaveText}>Update</Text>
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
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: color.lightWhite
    },
    columnContainer:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'    
    },
    containerEditClient:{
        backgroundColor: color.white,
        width:600,
        paddingLeft:20,
        paddingRight:20,
    },
    headerContainer:{
        height:90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle:{
        color: color.white,
        backgroundColor:'transparent',
        fontSize:22,
        fontFamily:'Futura',
        marginTop:10
    },
    closebtn:{
        position:'absolute',
        left:20,
        backgroundColor:'transparent',
        top:35
    },
    closebtnright:{
        position:'absolute',
        right:20,
        backgroundColor:'transparent',
        top:35
    },
    twocolumns:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:560
    },
    onecolumn:{
        alignItems: 'center',
        justifyContent:'center',
        width:560
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
        backgroundColor: color.white,
        marginLeft:20,
        marginRight:10
    },
    labelStyle:{
        fontSize:16
    },
    textbox:{
        fontSize:20,
        height:45
    },
    contentsWrapperRight:{
        marginTop:10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white,
        marginLeft:10,
        marginRight:20
    },
    btnSave: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15
    },
    btnSaveText: {
        color:  color.white,
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
    }
});
