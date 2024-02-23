import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions    
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
// import Router from "../../navigation/Router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getUserData } from "../../helpers/authenticate";
import { color } from "../../assets/colors/colors";

var {height, width} = Dimensions.get('window');

export default class WithoutBookingSuccessScreen extends React.Component {
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
        clearInterval(this.interval);
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

        let userData = await getUserData();
        this.businessName = userData.businessname; 
        this.isShowStaffCheckIn = userData.isManageTurn;
        let _this = this;
        this.interval = setInterval(function(){
            let stateData = {..._this.state};
            stateData.count--;
            _this.setState({count: stateData.count});
            if(stateData.count == 0){
                _this.props.navigation.replace('home',{businessname: _this.businessName, isBooked: true, isShowStaffCheckIn: _this.isShowStaffCheckIn, logo_app: _this.props.route.params.logo_app, isDisableBooking : true});
            }
        },1000);
    }

    backToHome = () => {
        clearInterval(this.interval);
        this.props.navigation.replace('home',{businessname: this.businessName, isBooked: true, isShowStaffCheckIn: this.isShowStaffCheckIn, logo_app: this.props.route.params.logo_app, isDisableBooking : true});
    }

    render() {
        let mess = 'Your check-in is completed. Thank you!';
        if(typeof(this.props.route.params.data) != 'undefined' && this.props.route.params.data.isPlusPoint){
            //mess = 'Your check-in is completed and earned '+this.props.route.params.data.point+' points. Thank you!';
            mess = (
                <Text>
                    Your check-in is completed and earned <Text style={{fontSize:60,color:'red'}}>{this.props.route.params.data.point}</Text> points. Thank you!
                </Text>  
            );
        }
        
        return(
            <View style={{flex:1}}>
                <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={styles.containerHeaderSteps}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Successfully Checked In</Text>
                    </View>
                </LinearGradient>  
                <View style={styles.container}>
                    <View style={[styles.row,{width: width - 70}]}>
                        <Icon
                            name={'calendar-check'}
                            size={100}
                            color={color.reddish}
                        />
                        <Text style={styles.booksuccesstext}>{mess}</Text>
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
                                        colors={[color.reddish, color.reddish]}
                                        style={styles.btnLinear}
                                    >
                                        <Text style={styles.btnSaveText}>Back To Home Screen</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>        
                        </View>
                        <Text style={styles.countDown}>Automatically redirect to home screen in {this.state.count} seconds</Text>
                    </View>
                </View> 
            </View>
            
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
        fontSize:30,
        color: color.blackish,
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
    countDown:{
        marginTop:15,
        fontSize:20,
        fontFamily:'Futura',
        color: color.silver
         
    }
});
