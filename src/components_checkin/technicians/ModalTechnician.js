import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    TextInput,
    Platform,
    Image,
    Modal
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import OneService from "./OneService";
import { color } from "../../assets/colors/colors";
//import Modal from 'expo/src/Modal/Modal';

export default class ModalTechnician extends React.Component{
    state = {
        visible: this.props.visible,
        servicename: '',
        quantity:1
    }

    _handleOnRequestClose = () => {
        this.setState({ visible: false });
    }

    setData = (technicians,selectedTechnician,servicekey,comboid) => {
        this.comboid = comboid;
        this.refs.OneService.setData(technicians,selectedTechnician,servicekey);
    }

    onPressTechnician = (technician,servicekey) => {
        this.props.onPress(technician,servicekey,this.comboid);  
    }

    render() {
        return (
            <Modal
                animationType='slide'
                onRequestClose={() => this._handleOnRequestClose()}
                supportedOrientations={['landscape', 'portrait']}
                visible={this.state.visible}
                >
                <LinearGradient start={[0, 0]} end={[1, 0]} colors={['#db7b87', color.lightPink]} style={styles.containerHeaderSteps}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>{this.state.servicename}</Text>
                        <TouchableOpacity style={styles.closebtn} activeOpacity={1}
                            onPress={this._handleOnRequestClose}>
                            <Icon
                                name={'chevron-left'}
                                size={30}
                                color={color.whiteRBG1} style={styles.navIconIOS}
                            />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>  
                <View style={{backgroundColor: color.lightWhite,flex:1}}>
                    <OneService ref='OneService' onPress={this.onPressTechnician} quantity={this.state.quantity} providerData={this.props.providerData} />
                </View>
            </Modal>
            
        )
    }
}

const styles = StyleSheet.create({
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
    }
})
