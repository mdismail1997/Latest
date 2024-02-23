import React from "react";
import { StyleSheet ,Text, View, Modal, TextInput, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { color } from "../assets/colors/colors";

export default class Prompt extends React.Component {
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
                supportedOrientations={['landscape']}
                onRequestClose={() => this.close()}
            >
                <View style={styles.container}>
                    <View style={styles.modalcontainer}>
                        <Text style={styles.heardertitle}>{this.props.header}</Text>
                        <Text style={styles.modaltitle}>{this.props.title}</Text>
                        {
                            (this.props.type == 'password2' && this.props.stype == 'number') && 
                            <TextInput
                            keyboardType={"numeric"}
                                style={[styles.txtLoginForm]}
                                onChangeText={(value) => this.setState({value})}
                                value={this.state.value} underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                autoFocus={true}
                            />
                        }
                        {
                            this.props.type == 'password' && 
                            <TextInput
                                style={[styles.txtLoginForm]}
                                onChangeText={(value) => this.setState({value})}
                                value={this.state.value} underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                autoFocus={true}
                            />
                        }

   
                        <TouchableOpacity  activeOpacity={1} style={[styles.btnIcon]} onPress={this.close}>  
                            <Icon
                                name={'close'}
                                size={30}
                                color={color.brownish}
                            />
                        </TouchableOpacity>

                        {this.props.checkin == false &&
                            <TouchableOpacity  activeOpacity={1} style={[styles.btnHome]} onPress={async () => {await this.submit();}}>  
                                <LinearGradient
                                    start={[0, 0]}
                                    end={[1, 0]}
                                    colors={[color.pelorous, color.pelorous]}
                                    style={styles.btnLinear}
                                >
                                    <Text style={styles.btnHomeText}>{this.props.submittext}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        }
                        {this.props.checkin == true &&
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity  activeOpacity={1} style={[styles.btnHome]} onPress={async (type) => {await this.submit("checkin");}}>  
                                    <LinearGradient
                                        start={[0, 0]}
                                        end={[1, 0]}
                                        colors={[color.pelorous, color.pelorous]}
                                        style={styles.btnLinear}
                                    >
                                        <Text style={styles.btnHomeText}>Submit</Text>
                                    </LinearGradient>
                                    
                                </TouchableOpacity>
                                {/* <TouchableOpacity  activeOpacity={1} style={[styles.btnHome]} onPress={async (type) => {await this.submit("checkout");}}>  
                                    <LinearGradient
                                        start={[0, 0]}
                                        end={[1, 0]}
                                        colors={[color.pelorous, color.pelorous]}
                                        style={[styles.btnLinear, styles.btnleft]}
                                    >
                                        <Text style={styles.btnHomeText}>Check-Out</Text>
                                    </LinearGradient>
                                    
                                </TouchableOpacity> */}
                            </View>
                        }



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
        alignItems:'center',
        justifyContent:'center'
    },
    modaltitle:{
        fontFamily: 'futuralight',
        fontSize:20,
        color:color.brownish,
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
        color:color.brownish,
        paddingRight:20,
        paddingLeft:0,
        fontSize:16,
        backgroundColor:'transparent',
        borderWidth: 1, 
        borderColor: 'rgba(221,221,221,0)',
        borderRadius:0,
        borderBottomColor: color.brownish,
        borderBottomWidth: 2,
        marginBottom: 30,
        width:300
    },
    btnHome:{
        alignItems: 'center',
        marginTop:20,
        alignItems:'center',
        justifyContent:'center',
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
        borderRadius:0,
        padding:5,
        height:50,
        width:300,
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
    }
});
