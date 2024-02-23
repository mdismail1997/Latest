import React from "react";
import { StyleSheet ,Text, View, Modal, TextInput, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { color } from "../assets/colors/colors";
//import layout from "../assets/styles/layout";

export default class SwitchCheckIn extends React.Component {
    state = {
        modalVisible: false,
        value: '',
        animationType: 'fade'
    }

    type = this.props.type;
    isAllowEmpty = typeof(this.props.isAllowEmpty) == 'undefined' ? false : this.props.isAllowEmpty;

    close = () => {
        this.setState({modalVisible: false});
        if(typeof(this.props.onClose) != 'undefined'){
            this.props.onClose();
        }
    }

    show = () => {
        this.setState({animationType:'fade',value:'',modalVisible: true});
    }
    
    submit = async () => {
        this.setState({animationType:'none'});    
        await this.props.onSubmit(this.props.checkin);
    }
    
    render() {
        let textswitch = "Check-In";
        if(this.props.checkin) textswitch = "Express Check-In";
        return(
            <Modal
                animationType={this.state.animationType}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
                supportedOrientations={['landscape']}
            >
                <View style={styles.container}>
                    <View style={styles.modalcontainer}>
                        <Text style={styles.heardertitle}>{this.props.header}</Text>
                        <Text style={styles.modaltitle}>Do you want to switch {textswitch}?</Text>
    
                        <TouchableOpacity  activeOpacity={1} style={[styles.btnIcon]} onPress={this.close}>  
                            <Icon
                                name={'close'}
                                size={30}
                                color={color.whitishBorder}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity  activeOpacity={1} style={[styles.btnHome]} onPress={async () => {await this.submit();}}>  
                            <LinearGradient
                                start={[0, 0]}
                                end={[1, 0]}
                                colors={[color.pelorous, color.pelorous]}
                                style={styles.btnLinear}
                            >
                                <Text style={styles.btnHomeText}>{textswitch}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                            
                    </View>        
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        /*justifyContent: 'center',*/
        alignItems: 'center',
        backgroundColor: color.blackRGB,
        paddingTop:80
    },
    modalcontainer:{
        backgroundColor: color.whiteRBG1,
        borderRadius:4,
        paddingLeft:25,
        paddingRight:25,
        paddingTop:20,
        paddingBottom:20,
    },
    modaltitle:{
        fontFamily: 'futuralight',
        fontSize:20,
        
        paddingTop:10,
        paddingBottom:20,
        textAlign:'center'
    },
    heardertitle:{
        fontFamily: 'Futura',
        fontSize:26,
        paddingLeft:15,
        paddingRight:15,
        textAlign:'center',
        color: color.pelorous
    },
    txtLoginForm: {
        height:50,
        color: color.black,
        paddingRight:20,
        paddingLeft:20,
        fontSize:16,
        backgroundColor: color.lightWhite,
        borderWidth: 1, 
        borderColor: 'rgba(221,221,221,0.5)',
        borderRadius:4
    },
    btnHome:{
        alignItems: 'center',
        marginTop:20,
        alignItems:'center',
        justifyContent:'center'
    },
    btnHomeText:{
        color: color.white,
        fontSize:20,
        fontFamily:'Futura',
        textAlign:'center',
        backgroundColor:'transparent'
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius:4,
        padding:5,
        height:50,
        width:200,
        shadowColor:  color.blackRGB,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        width: 300
    },
    btnleft:{
        marginLeft:10,
    },
    btnIcon:{
        position:'absolute',
        right:10,
        top:10
    }
});
