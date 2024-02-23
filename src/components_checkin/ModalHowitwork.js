import React from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    AlertIOS,
    Alert,
    Image,
    Modal,
    Platform 
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ImageResponsive from 'react-native-scalable-image';
import { color } from "../assets/colors/colors";
import { images } from "../components/Images";

//import layout from "../assets/styles/layout";
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
    marginBottomButtonTextByScreen = 70;
}else{
    marginTopByScreen = 0;
    marginBottomTextByScreen = 0;
    marginBottomButtonTextByScreen = 30;
}
//portrait default
var stepcontainerwidth = 750;
var stepwidth = 230;
var seperatorwidth = 30;
var stepfontsize = 16;
var stephintsize = 14;

if(width > height){
    stepcontainerwidth = 960;
    stepwidth = 300;
    seperatorwidth = 30;
    stepfontsize = 22;
    stephintsize = 17;
}

export default class ModalHowitwork extends React.Component {
    state = {
        modalVisible: false,
        styleAnimation: 'slide'
    }

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    async UNSAFE_componentWillMount() {
        
        var screen = Dimensions.get('window');
        width = screen.width;
        height = screen.height;
        
        var marginTopByScreen = 0;
        var marginBottomTextByScreen = 0;
        var marginBottomButtonTextByScreen = 0;
        if(height > 1020){
            marginTopByScreen = 40;
            marginBottomTextByScreen = 30;
            marginBottomButtonTextByScreen = 70;
        }else{
            marginTopByScreen = 0;
            marginBottomTextByScreen = 0;
            marginBottomButtonTextByScreen = 30;
        }

        if(width > height){
            stepcontainerwidth = 960;
            stepwidth = 300;
            seperatorwidth = 30;
            stepfontsize = 22;
            stephintsize = 17;
        }

        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;

            if(width > height){
                stepcontainerwidth = 960;
                stepwidth = 300;
                seperatorwidth = 30;
                stepfontsize = 22;
                stephintsize = 17;
            }else{
                stepcontainerwidth = 750;
                stepwidth = 230;
                seperatorwidth = 30;
                stepfontsize = 16;
                stephintsize = 14;
            }    

            var marginTopByScreen = 0;
            var marginBottomTextByScreen = 0;
            var marginBottomButtonTextByScreen = 0;
            if(height > 1020){
                marginTopByScreen = 40;
                marginBottomTextByScreen = 30;
                marginBottomButtonTextByScreen = 70;
            }else{
                marginTopByScreen = 0;
                marginBottomTextByScreen = 0;
                marginBottomButtonTextByScreen = 30;
            }
            _this.setState({ appIsReady: true });
        })
    }

    close = () => {
        
        this.setState({modalVisible: false});
    }

    show = () => {
        this.setState({styleAnimation : 'slide',modalVisible: true });
    }
    
    start = () => {
        this.setState({styleAnimation : 'none'});
        let _this = this;
        setTimeout(() => {
            _this.close();
            _this.props.onStart();
        },1)
    }

    render() {
        return(
            <Modal
                animationType={this.state.styleAnimation}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
                supportedOrientations={['landscape']}
            >
                <View style={styles.container}>
                    <View style={[styles.maincontainer]}>
                            <TouchableOpacity style={styles.closebtnright} activeOpacity={1}
                                onPress={() => this.close()}>
                                <Icon
                                    name={'close'}
                                    size={20}
                                    color={color.whiteRBG1} style={styles.navIconIOS}
                                />
                            </TouchableOpacity>
                            <View style={[styles.header,{width:width}]}>
                                <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={{position:'relative',zIndex:1, height:100}}>
                                    <View style={{width:width,alignItems: 'center',justifyContent: 'center',position:'relative',top:50,zIndex:1,paddingBottom:paddingBottomLogo}}>
                                        <Text style={[styles.logofontdefault,styles.logofont]}>How It Works</Text>
                                    </View>     
                                </LinearGradient>                                
                            </View>
                                
                            
                            <View style={{flex:1,width:width,alignItems:'center',marginTop:marginTopByScreen}}>
                                <Text style={[styles.hometitle,{marginBottom:marginBottomTextByScreen}]}>We provide an easy and efficient way of booking nail services</Text>   
                                <View style={[styles.benefitcontainer,{width:stepcontainerwidth}]}>
                                    <View style={[styles.iconitem,{width:stepwidth}]}>
                                        <Text style={[styles.iconstep,{fontSize:stepfontsize}]}>STEP 1</Text>
                                        <Text style={[styles.iconlbl,{fontSize:stepfontsize}]}>Enter Phone or Email</Text>
                                    </View>
                                    <View style={[styles.iconseperator,{width:seperatorwidth}]}>
                                        <ImageResponsive 
                                            source={images.hand01}
                                            height={15}
                                        />
                                    </View>
                                    <View style={[styles.iconitem,{width:stepwidth}]}>
                                        <Text style={[styles.iconstep,{fontSize:stepfontsize}]}>STEP 2</Text>
                                        <Text style={[styles.iconlbl,{fontSize:stepfontsize}]}>Continues if existing customer</Text>
                                        <Text style={[styles.iconhint,{fontSize: stephintsize}]}>If not please sign up</Text>
                                    </View>
                                    <View style={[styles.iconseperator,{width:seperatorwidth}]}>
                                        <ImageResponsive 
                                            source={images.hand01}
                                            height={15}
                                        />
                                    </View>
                                    <View style={[styles.iconitem,{width:stepwidth}]}>
                                        <Text style={[styles.iconstep,{fontSize:stepfontsize}]}>STEP 3</Text>
                                        <Text style={[styles.iconlbl,{fontSize:stepfontsize}]}>Choose "Service"</Text>
                                        <Text style={[styles.iconhint,{fontSize: stephintsize}]}>(To search your desired services)</Text>
                                    </View>
                                </View>
                                <View style={[styles.benefitcontainernobg,{width:stepcontainerwidth}]}>
                                    <View style={[styles.iconitemnobg,{width: stepwidth}]}></View>
                                    <View style={[styles.iconseperator,{width:seperatorwidth}]}></View>
                                    <View style={[styles.iconitemnobg,{width: stepwidth}]}></View>
                                    <View style={[styles.iconseperator,{width:seperatorwidth}]}></View>
                                    <View style={[styles.iconitemnobg,{width: stepwidth}]}>
                                        <ImageResponsive 
                                            source={images.hand03}
                                            height={20}
                                        />
                                    </View>
                                </View>
                                <View style={[styles.benefitcontainernobg,{width:stepcontainerwidth}]}>
                                    <View style={[styles.iconitem,{width:stepwidth}]}>
                                        <Text style={[styles.iconstep,{fontSize:stepfontsize}]}>STEP 6</Text>
                                        <Text style={[styles.iconlbl,{fontSize:stepfontsize}]}>Confirm & Book</Text>
                                        <Text style={[styles.iconhint,{fontSize: stephintsize}]}>(Complete)</Text>
                                    </View>
                                    
                                    <View style={[styles.iconseperator,{width:seperatorwidth}]}>
                                        <ImageResponsive 
                                            source={images.hand02}
                                            height={15}
                                        />
                                    </View>
                                    <View style={[styles.iconitem,{width:stepwidth}]}>
                                        <Text style={[styles.iconstep,{fontSize:stepfontsize}]}>STEP 5</Text>
                                        <Text style={[styles.iconlbl,{fontSize:stepfontsize}]}>Choose "Technician"</Text>
                                        <Text style={[styles.iconhint,{fontSize: stephintsize}]}>(Click "Any Technician" to select Technician for each service)</Text>
                                    </View>
                                    <View style={styles.iconseperator}>
                                        <ImageResponsive 
                                            source={images.hand02}
                                            height={15}
                                        />
                                    </View>
                                    <View style={[styles.iconitem,{width:stepwidth}]}>
                                        <Text style={[styles.iconstep,{fontSize:stepfontsize}]}>STEP 4</Text>
                                        <Text style={[styles.iconlbl,{fontSize:stepfontsize}]}>Choose "Time"</Text>
                                    </View>
                                </View>
                                <TouchableOpacity  activeOpacity={1} style={[styles.btnHome,{marginTop:marginBottomButtonTextByScreen}]} onPress={this.start}>  
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
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    header:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: color.white
    },
    welcome:{
        fontSize:24,
        backgroundColor:'transparent',
        color: color.white,
        fontFamily: 'futuralight',
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
        fontSize:40,
        marginBottom:0,
        textAlign:'center',
        paddingLeft:20,
        paddingRight:20
    },
    logofont:{
        fontFamily: 'futuralight'
    },
 
    btnHome:{
        //backgroundColor:'#EF75A4',
        marginBottom:40,
        alignItems:'center',
        justifyContent:'center'
    },
    iconmain:{
        marginRight:15,
        marginTop:4
    },
    logo:{
        marginBottom:70
    },
    
    logo2:{
        marginBottom:0
    },
    hometitle:{
        fontFamily:'futuralight',
        textAlign:'center',
        fontSize:32,
        marginTop:30
    },
    benefitcontainer:{
        flexDirection:'row',
        marginTop:40
    },
    iconstep:{
        fontFamily:'Futura',
        textAlign:'center',
        marginBottom:5
    },
    iconlbl:{
        fontFamily:'futuralight',
        textAlign:'center',
        fontSize:18
    },
    iconseperator:{
        width:30,
        alignItems:'center',
        justifyContent:'center'
    },
    iconitem:{
        backgroundColor:'#FFE9E7',
        justifyContent: "center",
        alignItems: "center",        
        padding:10
    },
    iconitemnobg:{
        justifyContent: "center",
        alignItems: "center",
    },
    benefitcontainernobg:{
     
        flexDirection:'row',
        marginTop:10
    },
    iconhint:{
        fontFamily:'futuralight',
        textAlign:'center',
        color:'#cc5967',
        marginTop:5
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
    },
    closebtnright:{
        position:'absolute',
        left:20,
        backgroundColor:'transparent',
        top:35,
        zIndex:100
    },
    btnHome:{
        alignItems: 'center',
        marginBottom:40,
        alignItems:'center',
        justifyContent:'center',
        marginTop:40
    },
    btnHomeText:{
        color: color.white,
        fontSize:24,
        fontFamily:'Futura',
        textAlign:'center',
        backgroundColor:'transparent'
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius:10,
        padding:5,
        height:50,
        width:350,
        shadowColor: color.blackRGB,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
    }
});
