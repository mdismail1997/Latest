import React from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    TouchableOpacity,
    Modal,
    Platform 
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from 'react-native-animatable';
import ModalHowitwork from '../../components_checkin/ModalHowitwork';
import { color } from "../../assets/colors/colors";

var {height, width} = Dimensions.get('window');
var marginTopByScreen = 0;
var marginBottomTextByScreen = 0;
var marginBottomButtonTextByScreen = 0;
var paddingBottomLogo = 0;
if(Platform.OS != "ios"){
    paddingBottomLogo = 70;
}
if(height > 1020){
    marginTopByScreen = 40;
    marginBottomTextByScreen = 30;
    marginBottomButtonTextByScreen = 60;
}else{
    marginTopByScreen = 0;
    marginBottomTextByScreen = 0;
    marginBottomButtonTextByScreen = 30;
}

export default class ScreenSaver extends React.Component {
    state = {
        modalVisible: false
    }

    

    logo_app = this.props.logo_app;
    businessname = this.props.businessname;

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    async UNSAFE_componentWillMount() {
       
        //Alert.alert('error');
        var screen = Dimensions.get('window');
        width = screen.width;
        height = screen.height;
        if(height > 1024){
            marginTopByScreen = 40;
            marginBottomTextByScreen = 30;
            marginBottomButtonTextByScreen = 60;
        }else{
            marginTopByScreen = 0;
            marginBottomTextByScreen = 0;
            marginBottomButtonTextByScreen = 30;
        }

        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;
            if(height > 1020){
                marginTopByScreen = 40;
                marginBottomTextByScreen = 30;
                marginBottomButtonTextByScreen = 60;
            }else{
                marginTopByScreen = 0;
                marginBottomTextByScreen = 0;
                marginBottomButtonTextByScreen = 30;
            }
            _this.setState({ appIsReady: true });
        })
    }

    show = () => {
        this.setState({ modalVisible: true });
    }

    close = () => {
        this.props.close();
        this.setState({modalVisible: false});
    }

    howitwork = () => {
        this.refs.ModalHowitwork.show();
    }

    onHowItWorkStart = () => {
        this.close();
    }

    render() {
        let logostyle = styles.logofont;
        if(this.businessname.indexOf('&') >= 0){
            logostyle = styles.logofontAngel;
        }
        
        
            return(
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.close()}
                    supportedOrientations={['landscape']}
                >
                    <View style={{flex:1,backgroundColor: color.white}}>
                       
                            <View style={[styles.maincontainer]}>
                                <View style={[styles.header,{width:width}]}>
                                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={{position:'relative',zIndex:10}}>
                                        <View style={{width:width,alignItems: 'center',justifyContent: 'center',position:'relative',top:50,zIndex:10,paddingBottom:paddingBottomLogo}}>
                                            <Text style={styles.welcome}>Welcome to</Text>
                                            {this.logo_app != ''
                                                &&
                                                <Animatable.Image 
                                                animation="bounceIn"
                                                duraton="1500"
                                            source={{uri:this.logo_app}}
                                            style={[styles.logo2]}
                                            resizeMode="stretch"
                                            />
                                            }

                                            {this.logo_app == ''
                                                &&        
                                                <Text style={[styles.logofontdefault,logostyle]}>{this.businessname}</Text>
                                            }
                                        </View>     
                                    </LinearGradient>

                                </View>
                                    
                                
                                <View style={{flex:1,width:width,alignItems:'center',marginTop:marginTopByScreen}}>
                                    <Text style={[styles.hometitle,{marginBottom:marginBottomTextByScreen}]}>WHAT WE OFFER OUR CLIENTS</Text>   
                                    <View style={styles.benefitcontainer}>
                                        <View style={styles.iconitem}>
                                            <Icon
                                                name={'tag-heart'}
                                                size={40}
                                                color={'#BDBDBE'}
                                            />
                                            <Text style={styles.iconlbl}>Earn Reward Points</Text>
                                        </View>

                                        <View style={styles.iconitem}>
                                            <Icon
                                                name={'calendar-text'}
                                                size={40}
                                                color={'#BDBDBE'}
                                            />
                                            <Text style={styles.iconlbl}>Advanced Booking</Text>
                                        </View>

                                        <View style={styles.iconitem}>
                                            <Icon
                                                name={'bell-outline'}
                                                size={40}
                                                color={'#BDBDBE'}
                                            />
                                            <Text style={styles.iconlbl}>Appointment Notification</Text>
                                        </View>
                                    </View>

                                    <View style={styles.benefitcontainer}>
                                        <View style={styles.iconitem}>
                                            <Icon
                                                name={'calendar-clock'}
                                                size={40}
                                                color={'#BDBDBE'}
                                            />
                                            <Text style={styles.iconlbl}>Appointment Reminder</Text>
                                        </View>

                                        <View style={styles.iconitem}>
                                            <Icon
                                                name={'gift'}
                                                size={40}
                                                color={'#BDBDBE'}
                                            />
                                            <Text style={styles.iconlbl}>Happy Birthday Discounts</Text>
                                        </View>

                                        <View style={styles.iconitem}>
                                            <Icon
                                                name={'sale'}
                                                size={40}
                                                color={'#BDBDBE'}
                                            />
                                            <Text style={styles.iconlbl}>Holidays Promotion</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity  activeOpacity={1} style={[styles.btnHomeOutline,{marginBottom:marginBottomButtonTextByScreen,marginTop:marginBottomButtonTextByScreen}]} onPress={this.howitwork}>  
                                            <Text style={styles.btnHomeTextOutline}>How It Works</Text>
                                        </TouchableOpacity>   
                                        <TouchableOpacity  activeOpacity={1} style={[styles.btnHome]} onPress={this.close}>  
                                            <LinearGradient
                                                start={[0, 0]}
                                                end={[1, 0]}
                                                colors={[color.pelorous, color.pelorous]}
                                                style={styles.btnLinear}
                                            >
                                                <Text style={styles.btnHomeText}>Start Your Appointment Now</Text>
                                            </LinearGradient>
                                            
                                        </TouchableOpacity>
                                        
                                </View>
                            </View>
                                 
                        
                    </View>

                    <ModalHowitwork ref='ModalHowitwork' onStart={this.onHowItWorkStart}/>
                </Modal>
            )  
        
        
    }
}

const styles = StyleSheet.create({
    header:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1
    },
    welcome:{
        fontSize:30,
        backgroundColor:'transparent',
        color: color.white,
        fontFamily: 'Futura',
        marginBottom:10
    },
    copyright:{
        fontSize:18,
        backgroundColor:'transparent',
        color: color.white,
        fontFamily: 'Futura',
        position:'absolute',
        bottom:40   
    },
    copyrightPhone:{
        fontSize:18,
        backgroundColor:'transparent',
        color: color.white,
        fontFamily: 'Futura',
        position:'absolute',
        bottom:10   
    },
    maincontainer: {
        flex: 1,
        /*justifyContent: 'center',*/
        alignItems: 'center',
    },
    maincontainerLoad: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentscontainer:{
        backgroundColor:'rgba(255,255,255,0.2)',
        paddingTop:20,
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20,
        borderRadius:10,
        alignItems: 'center',
    },
    containerGradient: {
        flex: 1,
		opacity:0.8,
		position:'absolute',
		top:0,
		bottom:0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:1
    },
    syncData:{
        backgroundColor:'rgba(0,0,0,0.3)',
        width:220,
        height:200
    },
    loadingText:{
        color: color.white,
        fontSize:20,
    },
    loadingText1:{
        color: color.white,
        fontSize:22,
        marginTop:-5
    },
    underline:{
        width:100,
        height:1,
        backgroundColor: color.white,
        marginTop:10,
        marginBottom:10
    },
    backgroundFullscreen:{
        position:'absolute',
    },
    logofontdefault:{
        backgroundColor:'transparent',
        color: color.white,
        fontSize:100,
        marginBottom:0,
        textAlign:'center',
        paddingLeft:20,
        paddingRight:20
    },
    logofont:{
        fontFamily: 'NeotericcRegular'
    },
    logofontAngel:{
        fontFamily: 'angel'
    },
    btnHome:{
        //backgroundColor:color.lightishPink,
        
        
        
        alignItems: 'center',
       
        marginBottom:40,
     
        alignItems:'center',
        justifyContent:'center'
    },
    iconmain:{
        marginRight:15,
        marginTop:4
    },
    btnHomeText:{
        color: color.white,
        fontSize:24,
        fontFamily:'Futura',
        textAlign:'center',
        backgroundColor:'transparent'
    },
    btnHomeOutline:{
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:5,
        paddingRight:5,
        borderRadius:40,
        height:50,
        alignItems: 'center',
        width:350,
        marginBottom:30,
        marginTop:30,
        borderWidth: 2,
        borderColor: color.lightishPink,
        alignItems:'center',
        justifyContent:'center'
    },
    btnHomeTextOutline:{
        color:color.lightishPink,
        fontSize:24,
        fontFamily:'Futura',
        textAlign:'center'
    },
    btnSetting:{
        position:'absolute',
        bottom:20,
        right:30
    },
    btnSettingText:{
        fontSize:18,
        backgroundColor:'transparent',
        color: color.white,
        fontFamily: 'Futura',
    },
    btnSettingStaffCheckIn:{
        position:'absolute',
        bottom:20,
        left:30
    },
    logo:{
        marginBottom:70
    },
    
    logo2:{
        marginBottom:0,
        position:'relative',
        zIndex:10
    },
    hometitle:{
        fontFamily:'Futura',
        textAlign:'center',
        fontSize:32,
        marginTop:30
    },
    benefitcontainer:{
        width:720,
        flexDirection:'row',
        marginTop:40
    },
    iconlbl:{
        fontFamily:'futuralight',
        textAlign:'center',
        fontSize:20,
        marginTop:5
    },
    iconitem:{
        alignItems:'center',
        width:240
    },
    btncontainer:{
        width:600,
        flexDirection:'row',
        marginTop:40,
        alignItems:'center',
        justifyContent:'center'
    },
    
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
   
        borderRadius:20,
        padding:5,
        height:50,
        width:350,
        shadowColor: color.blackRGB,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
    }
});
