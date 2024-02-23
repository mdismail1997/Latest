import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions, Image  
} from "react-native";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
// import Router from "../../navigation/Router";
import { getUserData } from "../../helpers/authenticate";
import { color } from "../../assets/colors/colors";
import { images } from "../../components/Images";

var {height, width} = Dimensions.get('window');

export default class BookingSucccessScreen extends React.Component {
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
        height = Dimensions.get('window').height;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            height = Dimensions.get('window').height;
            width = screen.width;
            _this.setState({ appIsReady: true });
        })
    }

    async componentDidMount(){
        let userData = await getUserData();
        this.businessName = userData.businessname; 
        this.isShowStaffCheckIn = userData.isManageTurn;    
    }

    backToHome = () => {
        clearInterval(this.interval);
        this.props.navigation.replace('home',{businessname: this.businessName, isBooked: true, isShowStaffCheckIn: this.isShowStaffCheckIn, logo_app: this.props.route.params.logo_app});
    }

    async checkin (){
        this.props.navigation.push('checkin',this.props.route.params);
    }
    render() {
        return(
            <LinearGradient start={[0, 0]} end={[1, 1.0]} colors={[color.reddish, color.carrot]} style={[styles.containerGradient]}>
                <View style={{width:"35%"}}>
                    <Image source={require('../../assets/img_new/bg_success.png')} style={{width: "100%", height:height}}/>
                </View>
                <View style={{ width: "65%"}}>
                    <View style={styles.maincontainer}>
                        <View style={{alignItems: 'center', marginBottom: 70}}>
                        <Animatable.Image 
                            animation="bounceIn"
                            duraton="1500"
                            source={images.logo2x}
                            style={{width:300, height:50}}
                            resizeMode="stretch"
                            />
                        </View>
                        <View style={styles.contentscontainer}>
                            <Text style={styles.booksuccesstext}>Your booking is completed. We'll email appointment confirmation to your email address. Thank you!</Text>
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

                            <Text style={styles.countDown}>Would You Like to Book Your Next Appointment ?</Text>
                            <View style={[styles.confirmbtn, {flexDirection: 'row'}]}>
                                <View style={[styles.btnSave01]}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.btnSaveWraper}
                                        onPress={async () => {await this.checkin()}}
                                    >
                                        <LinearGradient
                                            start={[0, 0]}
                                            end={[1, 0]}
                                            colors={[color.white, color.white]}
                                            style={styles.btnLinear}
                                        >
                                            <Text style={styles.btnSaveTextqs}>YES</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    
                                </View>        
                                <View style={styles.btnSave01}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.btnSaveWraper}
                                        onPress={this.backToHome}
                                    >
                                        <LinearGradient
                                            start={[0, 0]}
                                            end={[1, 0]}
                                            colors={[color.white, color.white]}
                                            style={styles.btnLinear}
                                        >
                                            <Text style={styles.btnSaveTextqs}>NO</Text>
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
        color:color.white,
        textAlign:'center',
        marginTop:10
    },
    headerContainer:{
        height:90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle:{
        color:color.white,
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
        color: color.white,
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
        color:color.white
         
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
        color:color.white,
        fontSize:20,
        marginTop:-5,
        fontFamily:'Futura',
        marginBottom:30
    },
    loadingText:{
        color:color.white,
        fontSize:35,
        fontFamily:'Futura',
        fontWeight: "bold",
        paddingLeft:30,
        paddingRight:30
    },
});
