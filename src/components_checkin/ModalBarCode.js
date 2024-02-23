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
    Platform,
} from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import layout from "../assets/styles/layout_checkin";
import Colors from "../constants/Colors_checkin";
import { color } from "../assets/colors/colors";

//import layout from "../assets/styles/layout";
var {height, width} = Dimensions.get('window');

   
export default class ModalBarCode extends React.Component {
    state = {
        modalVisible: false
    }

    isScanned = false;
    type = BarCodeScanner.Constants.Type.front;

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    async UNSAFE_componentWillMount() {
        
        //console.log(ScreenOrientation.Orientation);
        var screen = Dimensions.get('window');
        width = screen.width;
        height = screen.height;
        //console.log(BarCodeScanner.Constants);
        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;
            _this.setState({ appIsReady: true });
        })

        
    }

    close = () => {
        this.props.closeBarCode();
        this.setState({modalVisible: false});
    }

    show = (orien) => {

        this.isScanned = false;
        this.setState({modalVisible: true });
    }
    
    _handleBarCodeRead = ({ type, data }) => {
        if(!this.isScanned){
            this.isScanned = true;
            this.props.scanned(data);
        }
       
    }

    changeType = () => {
        this.type = this.type == BarCodeScanner.Constants.Type.front ?  BarCodeScanner.Constants.Type.back : BarCodeScanner.Constants.Type.front;
        this.setState({rerender:true});
    }

    

    /*
    cancel = () => {
        //console.log('ok');
    }*/

    render() {
        let colors = 'rgba(0,0,0,0.7)';
        return(
            <Modal
                animationType={'none'}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
                supportedOrientations={['landscape']}
            >
                <View style={styles.container}>
                    
                    <BarCodeScanner         
                        //aspectRatio={1.33}
                        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                        //flashMode={flashMode}
                        onBarCodeRead={this._handleBarCodeRead}
                        //ratio="4:3"
                        //ref={ref => this.camera = ref}
                        style={{flex:1, width: width, height:height}}
                        type={this.type}
                        >
                        <View style={styles.container2}>
                            <View style={{backgroundColor:colors, height: height / 2 - 125, width:width,alignItems:'center'}}>
                                <Text style={styles.texttop}>
                                    Scan QR Code
                                </Text>
                                <TouchableOpacity style={styles.switch} activeOpacity={1} onPress={this.changeType}>
                                    <Icon
                                        name={'camera-party-mode'}
                                        size={40}
                                        color={color.white} 
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{height:250,width:width,position:'relative',zIndex:1}}>
                                <View style={{flex:1, flexDirection:'row',justifyContent:'space-between'}}>
                                    <View style={{backgroundColor:colors, height:250, width:width / 2 - 125, position:'relative'}}>
                                        <View style={{position:'absolute',right:-17, top:-3, width:20, height:20,
                                            borderColor: color.white,borderWidth: 3,borderRightWidth: 0,borderBottomWidth: 0}}></View>
                                        <View style={{position:'absolute',right:-17, bottom:-3, width:20, height:20, 
                                            borderColor: color.white,borderWidth: 3,borderRightWidth: 0,borderTopWidth: 0}}></View>     
                                    </View>
                                    <View style={{backgroundColor:'transparent', height:250, width:250}}></View>
                                    <View style={{backgroundColor:colors, height:250, width:width / 2 - 125, position:'relative'}}>
                                        <View style={{position:'absolute',left:-17, top:-3, width:20, height:20, 
                                            borderColor: color.white,borderWidth: 3,borderLeftWidth: 0,borderBottomWidth: 0}}></View>
                                        <View style={{position:'absolute',left:-17, bottom:-3, width:20, height:20, 
                                            borderColor: color.white,borderWidth: 3,borderLeftWidth: 0,borderTopWidth: 0}}></View> 
                                    </View>
                                </View>
                            </View>
                            <View style={{backgroundColor:colors, height: height / 2 - 125, width:width,alignItems:'center'}}>
                                <Text style={styles.textbottom} onPress={this.close}>
                                    Cancel
                                </Text>
                            </View>
                        </View>
                    </BarCodeScanner>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container2:{
        flex:1,
        flexDirection:'column',
        justifyContent:'space-between'
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    camera: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').width,
    },  
    texttop: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        position:'absolute',
        top:70,
        color:color.white,
        zIndex:1
    },
    switch:{
        position:'absolute',
        top:120,
        zIndex:1
    },
    textbottom: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        position:'absolute',
        bottom:40,
        color:color.white,
        zIndex:1
    },
    instructions: {
        textAlign: 'center',
        color: color.blackish,
        marginBottom: 5,
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
rectangle: {
        height: 250,
        width: 250,
        borderWidth: 2,
        borderColor: color.white,
        backgroundColor: 'transparent',
    }, 
});
