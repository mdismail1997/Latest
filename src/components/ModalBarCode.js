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
export default class ModalBarCode extends React.Component {
    state = {
        modalVisible: false
    }
    width_t = 0;
    height_t = 0;
    isScanned = false;
    type = BarCodeScanner.Constants.Type.back;

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    async UNSAFE_componentWillMount() {
        var screen = Dimensions.get('window');
        this.width_t = screen.width;
        this.height_t = screen.height;
        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            this.width_t = screen.width;
            this.height_t = screen.height;
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
    render() {
        let colors = 'rgba(0,0,0,0.7)';
        
        return(
            <Modal
                animationType={'none'}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
            >
                <View style={styles.container}>
                    <BarCodeScanner         
                        onBarCodeScanned={this._handleBarCodeRead}
                        style={{flex:1, width: this.width_t, height:this.height_t}}
                        type={this.type}
                        >
                        <View style={styles.container2}>
                            <View style={{backgroundColor:colors, height: this.height_t / 2 - 125, width:this.width_t,alignItems:'center'}}>
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
                 
                            <View style={{backgroundColor:colors, height: this.height_t / 2 - 125, width:this.width_t,alignItems:'center'}}>
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
        borderWidth: 2,
        borderColor: color.white,
        backgroundColor: 'transparent',
    }, 
});
