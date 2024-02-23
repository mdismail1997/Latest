import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image   
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
// import Router from "../../navigation/Router";
import { getUserData } from "../../helpers/authenticate";
import * as Print from 'expo-print';
import { color } from "../../assets/colors/colors";
import { images } from "../../components/Images";
var {height, width} = Dimensions.get('window');

export default class CheckInSuccessScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: false
        }
    };

    state = {
        count : 10
    }

    businessName = '';
    interval = 0;


    UNSAFE_componentWillUnmount(){
        //clearInterval(this.interval);
        Dimensions.removeEventListener("change", () => {});
    }

    UNSAFE_componentWillMount(){
        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            _this.setState({ appIsReady: true });
        })

    }

    async UNSAFE_componentDidMount(){
        this.businessName = this.props.route.params.userData.businessname; 
        this.isShowStaffCheckIn = this.props.route.params.userData.isManageTurn;               
    }

    backToHome = () => {
        let _this = this;
        clearInterval(this.interval);
        _this.props.navigation.replace('home',{businessname: this.businessName, isBooked: true, isShowStaffCheckIn: this.isShowStaffCheckIn,logo_app: this.props.route.params.logo_app});
    }

    render() {
        let _this = this;
        if( _this.props.route.params.userData.PrintOut){
            let address = _this.props.route.params.userData.street_number + " " + _this.props.route.params.userData.street_name + " " + _this.props.route.params.userData.city + ", " + _this.props.route.params.userData.state + " " + _this.props.route.params.userData.zipcode;
        
        let html = '<html>';
        html += '<table style="border:none;width:100%;" cellpadding="0" cellspacing="0">';
        html += '<tr>';
        html += '<td style="width:100%;vertical-align:top;color: #787878;border-bottom:2px;border-bottom-style: dashed;padding-bottom:5px" colspan="2" >';
        html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:10px;">'+_this.props.route.params.userData.businessname+' </div>';
        html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:10px;">Address: '+address+'</div> ';
        html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:10px;">Phone: '+_this.props.route.params.userData.phone+'</div> ';
        html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:10px;">Website: '+_this.props.route.params.userData.domain+'</div> ';
        html += '</td>';
        html += '</tr> ';
        let name = _this.props.route.params.clientSearchData.firstname + " " + _this.props.route.params.clientSearchData.lastname;
        html += '<tr style="border-style:dashed;border-radius:10px;border-color:#269562;height:1px">';
        html += '<td style="padding-top:5px" colspan="2" >';
        html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:10px;">Client Infomation check- Ins </div>';
        html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:10px;">Name: '+name+' </div>';
        html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:10px;">Reward Points: '+_this.props.route.params.points+'</div> ';
        html += '<div style="line-height:25px;color:#787878;    font-family: sans-serif;font-size:10px;">Check- Ins Number: '+_this.props.route.params.checkinNumber+'</div> ';
        html += '</td>';
        html += '</tr>';
        
        
        html += ' </table>';
        html += '<html>';

            let options = {
            html: html
            }
            Print.printAsync(options);

        }
        return(
        
            <LinearGradient start={[0, 0]} end={[1, 1.0]} colors={[color.reddish, color.carrot]} style={[styles.containerGradient]}>
                <View style={{width:"35%"}}>
                    <Image source={images.bgSuccess} style={{width: "100%", height:height}}/>
                </View>
                <View style={{ width: "65%"}}>
                    <View style={styles.maincontainer}>
                        <View style={{alignItems: 'center', marginBottom: 70}}>
                            <Image source={images.logo} style={{width: 400, height: 58}}/>
                        </View>
                        <View style={styles.contentscontainer}>
                        <Text style={styles.booksuccesstext}>Checked In Successfully. Thank you!</Text>
                            <View style={styles.confirmbtn}>
                                <View style={styles.btnSave}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.btnSaveWraper}
                                        onPress={this.backToHome}
                                    >
                                        <LinearGradient
                                            start={[0, 0]}
                                            end={[1, 0]}
                                            colors={[color.pelorous, color.pelorous]}
                                            style={styles.btnLinear}
                                        >
                                            <Text style={styles.btnSaveText}>Back To Home Screen</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    
                                </View>        
                            </View>
                        </View>
                    </View>
                </View>
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
    row:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    booksuccesstext:{
        fontFamily:'Futura',
        fontSize:25,
        color: color.white,
        textAlign:'center',
        marginTop:10
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
    confirmbtn:{
        justifyContent: "center",
        alignItems: "center",
        width: 350
    },
    btnSave: {
        height: 45,
        width: 230,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15
    },
    btnSave01: {
        height: 45,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15,
        marginRight:20
    },
    btnSaveText: {
        color:  color.white,
        fontSize: 20,
        zIndex: 1,
        backgroundColor: "transparent"
    },
    btnSaveTextqs: {
        color: color.pelorous,
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
        borderRadius: 0,
        overflow: "hidden",
        flex: 1
    },
    countDown:{
        marginTop:15,
        fontSize:20,
        fontFamily:'Futura',
        color: color.white
         
    },

    containerGradient: {

        flex:1,flexDirection: 'row',flexWrap: 'wrap',alignItems: 'flex-start'
    },
    maincontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentscontainer:{
        alignItems: 'center',
    },
    loadingText1:{
        color: color.white,
        fontSize:20,
        marginTop:-5,
        fontFamily:'Futura',
        marginBottom:30
    },
    loadingText:{
        color: color.white,
        fontSize:35,
        fontFamily:'Futura',
        fontWeight: "bold",
        paddingLeft:30,
        paddingRight:30
    },
});
