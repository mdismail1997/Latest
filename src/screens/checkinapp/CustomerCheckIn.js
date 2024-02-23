import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Alert,
    TextInput    
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
// import Router from "../../navigation/Router";
import layout from "../../assets/styles/layout_checkin";
import Colors from "../../constants/Colors";
import SubmitLoader from "../../helpers/submitloader";
import setting from "../../constants/Setting";
import { emailRegx, formatPhone } from "../../helpers/Utils";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../../assets/colors/colors";
import { gStrings } from "../../components/staticStrings";
import { api } from "../../api/api";

var {height, width} = Dimensions.get('window');

export default class CustomerCheckInScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: false
        }
    };

    state = {
        search: '',
    } 

    clients = this.props.route.params.clients
    appointments = [];

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }
    
    UNSAFE_componentWillMount(){

        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;
            _this.setState({ appIsReady: true });
        })
    }

    async loadAppointmentDetail () {
        let inputData = this.state.search;
        inputData = inputData.replace('(','');
        inputData = inputData.replace(')','');
        inputData = inputData.replace(' ','');
        inputData = inputData.replace('-','');
        if(String.prototype.trim.call(this.state.search) == ''){
            Alert.alert('Error','Please input Phone or Email');       
        }else if(!isNaN(inputData) && this.state.search.length != 14){
            Alert.alert('Error','Please input an valid Phone or Email');       
        }else if(isNaN(inputData) && !emailRegx.test(String.prototype.trim.call(this.state.search))){
            Alert.alert('Error','Please input an valid Phone or Email');      
        }else{
            let _this = this;    
            this.refs.authenticateLoader.setState({ visible: true });
            let clientData = {};
            await fetch(setting.apiUrl + api.checkinClientSearch + inputData, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + this.props.token
                }
            })
            .then(response => response.json())
            .then(responseJson => {
                this.searching = false;
                if (!responseJson.success) {
                    this.refs.authenticateLoader.setState({ visible: false });
                    setTimeout(function(){
                        Alert.alert('','No data available');
                    },100)
                } else {
                    clientData = responseJson.data;
                }
            })
            .catch(error => {
                console.error(error);
                //return [];
            });

            if(Object.keys(clientData).length){
                var isSuccess = await fetch(setting.apiUrl + api.checkinGetID + clientData.id, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + this.props.route.params.token
                    }
                })
                .then(response => response.json())
                .then(responseJson => {
                    if (!responseJson.success) {
                        return true;
                    } else {
                        _this.appointments = responseJson.data;
                        return true;
                    }
                })
                .catch(error => {
                    console.error(error);
                    return false;
                });
                this.refs.authenticateLoader.setState({ visible: false });
                if (isSuccess) {
                    if(_this.appointments.length){
                        this.props.navigation.push('Appointments',{
                            appointments: _this.appointments,
                            client: clientData,
                            clients: this.props.route.params.clients,
                            token: this.props.route.params.token,
                            businessname: this.props.route.params.businessname,
                            isShowStaffCheckIn: this.props.route.params.isShowStaffCheckIn
                        });      
                    }else{
                        setTimeout(function(){
                            Alert.alert('', gStrings.noApp);
                        },100)
                        
                    }
                    
                } else {
                    setTimeout(function(){
                        Alert.alert(
                            "Error",
                            "Search Failed. Please contact administrator."
                        );
                    },100)
                }        
            }
        }
    }

    changeSearch = (value) => {
        value = String.prototype.trim.call(value);
        value = value.replace('(','');
        value = value.replace(')','');
        value = value.replace(' ','');
        value = value.replace('-','');
        if(value.length >= 3 && !isNaN(value)){
            let formatValue = formatPhone(value);
            this.setState({search: formatValue});
        }else{
            this.setState({search: value});
        }
    }

    back = () => {
        this.props.navigation.push('home',{
            businessname: this.props.route.params.businessname,
            isShowStaffCheckIn: this.props.route.params.isShowStaffCheckIn,
            logo_app: this.props.route.params.logo_app
        });
    }

    render() {
      
        return(
            <LinearGradient start={[0, 0]} end={[1, 1.0]} colors={[color.reddish, color.reddish]} style={[styles.containerGradient]}>
                <TouchableOpacity style={styles.closebtn} activeOpacity={1}
                            onPress={this.back}>
                            <Icon
                                name={'chevron-left'}
                                size={30}
                                color={color.whiteRBG1} style={styles.navIconIOS}
                            />
                        </TouchableOpacity>
                <Text style={styles.lblcheckinheader}>Check-In Appointment</Text>
                <Text style={styles.lblcheckin}>Please enter your information to Check In</Text>
                <TextInput
                    style={[styles.txtSearch]}
                    placeholder='Search by Phone or Email' placeholderTextColor={color.white}
                    onChangeText={(search) => this.changeSearch(search)}
                    value={this.state.search} 
                    //value='(501) 222-4098'
                    underlineColorAndroid={'transparent'}
                />

                <TouchableOpacity activeOpacity={1} underlayColor={color.whiteRGB05}
                                    style={styles.btnSearch}
                                    onPress={async () => {await this.loadAppointmentDetail()}}>
                    <Text style={styles.txtsearchbtn}>Search</Text>
                </TouchableOpacity>
                
                <SubmitLoader
                        ref="authenticateLoader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmit}
                        textContent={"Processing..."}
                        color={Colors.spinnerLoaderColorSubmit}
                    />
            </LinearGradient>  
            
            
        )
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:-45
    },
    btnSearch: {
        backgroundColor:color.white,
        height:70,
        borderRadius:50,
        alignItems: 'center',
        justifyContent: 'center',
        width:400,
        marginTop:20
    },
    txtSearch: {
        height: 70,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 50,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 20,
        color: color.white,
        width:400,
        fontSize:24
    },
    containerGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lblcheckin:{
        color:color.white,
        fontSize:28,
        backgroundColor:'transparent',
        marginBottom:40,
        fontFamily:'Futura'
    },
    lblcheckinheader:{
        fontSize:36,
        color:color.white,
        backgroundColor:'transparent',
        marginBottom:20,
        fontFamily:'Futura'
    },
    txtsearchbtn: {
        fontSize:26,
        fontFamily:'Futura',
        color:color.reddish
    },
    closebtn:{
        position:'absolute',
        left:20,
        backgroundColor:'transparent',
        top:35
    }
});
