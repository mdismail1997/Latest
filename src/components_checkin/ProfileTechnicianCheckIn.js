import React from "react";
import { StyleSheet ,Text, View, Modal, TextInput, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { color } from "../assets/colors/colors";
//import layout from "../assets/styles/layout";

export default class ProfileTechnicianCheckIn extends React.Component {
    state = {
        modalVisible: false,
        value: '',
        animationType: 'fade',
        name: "",
        phone: "",
        email: "",
        message: "",
        datecheckin: "",
        datecheckout: "",
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
    
    submit = async (type) => {
        let isValid = true;
        if(!this.isAllowEmpty){
            if(String.prototype.trim.call(this.state.value) == '')
            {
                isValid = false;
                Alert.alert('Error', this.props.errorMessage);
            }
        }
        if(isValid){
            this.setState({animationType:'none'});    
            await this.props.onSubmit(this.state.value, type);
        }
    }
    
    render() {
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
                        <Text style={styles.heardertitle}>Welcome {this.state.name}</Text>
                        <Text style={styles.modaltitle}>{this.state.message}</Text>
                        <View style={[styles.clientContainer,{width: 560}]}>
                        <View style={styles.clienthalfrow}>
                            <Text style={styles.clientlbl}>Staff Name</Text>
                            <Text style={styles.clientvalue}>{this.state.name}</Text>
                        </View>
                        <View style={styles.clienthalfrow}>
                            <Text style={styles.clientlbl}>Email</Text>
                            <Text style={styles.clientvalue}>{this.state.email}</Text>
                        </View>
                        <View style={styles.clienthalfrow}>
                            <Text style={styles.clientlbl}>Phone</Text>
                            <Text style={styles.clientvalue}>{this.state.phone}</Text>
                        </View>
                        <View style={styles.clienthalfrow}>
                            <Text style={styles.clientlbl}>Check In</Text>
                            <Text style={styles.clientvalue}>{this.state.datecheckin}</Text>
                        </View>
                        <View style={styles.clienthalfrow}>
                            <Text style={styles.clientlbl}>Check Out</Text>
                            <Text style={styles.clientvalue}>{this.state.datecheckout}</Text>
                        </View>
                    </View>
                        <TouchableOpacity  activeOpacity={1} style={[styles.btnIcon]} onPress={this.close}>  
                            <Icon
                                name={'close'}
                                size={30}
                                color={color.whitishBorder}
                            />
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
        color:"#155724",
        paddingTop:10,
        paddingBottom:20,
        textAlign:'center'
    },
    heardertitle:{
        fontFamily: 'Futura',
        fontSize:26,
        paddingLeft:15,
        paddingRight:15,
        textAlign:'center'
    },
    txtLoginForm: {
        height:50,
        color:'#000',
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
    },
    btnleft:{
        marginLeft:10,
    },
    btnIcon:{
        position:'absolute',
        right:10,
        top:10
    },
    clientContainer:{
        justifyContent: "center",
        alignItems: "center",
    },
    clientTitle:{
        fontSize:22,
        marginBottom:10,
        fontFamily:'Futura',
        textAlign:'center'
    },
    clienthalfrow:{
        marginBottom:10,
        paddingBottom: 10,
        marginTop:4.5,
        width:460, 
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: 'rgba(249,193,152, 0.6)',
    },
    clientlbl:{
        fontSize:18,
        color:'#595c68',
        textAlign:'center',
        fontFamily:'Futura',
    },
    clientvalue:{
        color: color.silver,
        fontSize:18,
        marginLeft:10, 
        textAlign:"center",
        fontFamily:'Futura',
    },
});
