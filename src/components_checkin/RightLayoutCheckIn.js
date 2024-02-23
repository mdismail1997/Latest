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
import * as Animatable from 'react-native-animatable';
import { color } from "../assets/colors/colors";
import { images } from "../components/Images";
var {height, width} = Dimensions.get('window');
var widthRight = width * 0.3;
export default class RightLayoutCheckIn extends React.Component{
    state = {
        step: this.props.step,
        totalPriceService: 0,
        totalService: 0,
        client:  {
            "birthdate": "",
            "clientSponsor": "",
            "day": "",
            "email": "",
            "firstname": "",
            "id": 0,
            "lastname": "",
            "month": "",
            "phone": "",
          }
    }

    async UNSAFE_componentWillMount(){
        var screen = Dimensions.get('window');
        width = screen.width;
        height = screen.height;
        widthRight = width * 0.3;
        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;
            widthRight = width * 0.3;
            
            _this.setState({ appIsReady: true });
        })
    }
    close = () =>{
        var _this = this;
        _this.props.close();
    }
    setStepNumber = (stepNumber) => {
        this.setState({step: stepNumber});    
    }

    setClient = (client) => {
        this.setState({client: client});    
    }

    onPress = () => {
        this.props.onPress(this.state.step + 1,this.state.step);
    }
    setTextService = (service) =>{
        let price = 0;
        service.map((x, i) =>{
            if(typeof(x.quantity) == 'undefined'){
                x.quantity = 1;
            }
            price += (x.price * x.quantity);
        })
        this.setState({totalPriceService: price, totalService: service.length}); 

    }
    render() {
        let textTitle = 'choose';
        switch (this.state.step){
            case 1:

                textTitle = 'Choose Service';
            break;
            case 2:
                if(typeof(this.props.stepthree) != 'undefined'){
                    textTitle = 'View Summary';
                }else{
                    textTitle = 'Choose Time';
                }
            break;
            case 3:
                if(typeof(this.props.stepthree) != 'undefined'){
                    textTitle = 'Confirm & Book';
                }else{
                    textTitle = 'Choose Technician';
                }
                
            break;
            case 4:
                textTitle = 'View Summary';
            break;
            case 5:
                textTitle = 'Confirm & Book';
            break;
        }
        return(
            <View style={{flex:1, width:"30%", height:height, alignItems: 'center'}}>
            <TouchableOpacity style={styles.closebtn} activeOpacity={1}
                    onPress={this.close}>
                    <Image 
                        source={images.backIconColor}
                        style={[styles.backgroundFullscreen,{width: 36, height:36}]}/> 
                </TouchableOpacity>
            <View style={styles.logoLeftTop} >
                    {this.props.logo_app != ''
                        &&
                        <Animatable.Image 
                        animation="bounceIn"
                        duraton="1500"
                        source={{uri:this.props.logo_app}}
                        style={{width:200, height: 59}}
                        resizeMode="stretch"/>
                    }
            </View>
            <View style={{marginBottom: 25, zIndex:2, alignItems: 'center',justifyContent: 'center', flex:1}} >

                <Text style={styles.businessname_right}>{this.state.client.firstname} {this.state.client.lastname}</Text>
                <Text style={styles.copyright}>{this.state.client.email}</Text>
                <Text style={styles.copyrightPhone}>{this.state.client.phone}</Text>
                <View style={{ marginTop: 60}}>
                    { this.state.totalService > 0 &&
                        <View style={{ alignItems: 'center',justifyContent: 'center',}}>
                            <Text style={styles.textservice}>You choose {this.state.totalService} services</Text>
                            <Text style={styles.textservice}>From ${this.state.totalPriceService}</Text>
                        </View>
                    }

                    <TouchableOpacity activeOpacity={1} underlayColor={color.whiteRGB05} style={styles.btnSearch} onPress={this.onPress}>
                        <LinearGradient                             
                            start={[0, 0]}
                            end={[1, 0]}
                            colors={[color.pelorous, color.pelorous]}
                            style={styles.btnLinear}
                        >
                                <Text style={styles.txtsearchbtn}>{textTitle}</Text>
                        </LinearGradient>                 
                    </TouchableOpacity>
                </View>   
            </View>
            <Image 
            source={images.bgStep}
            style={[styles.backgroundFullscreen,{width: widthRight, height:height}]}/> 
        </View>
        )
    }
}
const styles = StyleSheet.create({
    businessname_right:{
        fontSize:26,
        backgroundColor:'transparent',
        color: color.reddish,
        fontFamily: 'Futura',
        bottom:30,
        zIndex:2,
    },
    copyright:{
        fontSize:16,
        backgroundColor:'transparent',
        color: color.reddish,
        fontFamily: 'Futura',
        bottom:10,
        zIndex:2,
    },
    copyrightPhone:{
        fontSize:16,
        backgroundColor:'transparent',
        color: color.reddish,
        fontFamily: 'Futura',
        bottom:10,
        zIndex:2,
    
    },
    backgroundFullscreen:{
        position:'absolute',
        zIndex:1
    },
    closebtn:{
        position:'absolute',
        right:50,
        backgroundColor:'transparent',
        top:30,
        zIndex:2
    },
    btnSearch: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:10
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius:0,
        padding:5,
        height:50,
        width:"100%",
        paddingRight:10,
        paddingLeft:10
        
    },
    txtsearchbtn: {
        fontSize:22,
        fontFamily:'Futura',
        color: color.white,
        backgroundColor:'transparent',
    },
    textservice: {
        fontSize:14,
        backgroundColor:'transparent',
        color: color.brownish,
        fontFamily: 'Futura',
        bottom:10,
        zIndex:2,
    },
    logoLeftTop:{
        zIndex:2,
        marginTop:100 
    }
})