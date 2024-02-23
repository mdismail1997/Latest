import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Modal,
    Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import CheckBox from 'react-native-check-box';
import { color } from "../assets/colors/colors";
export default class ModalConsentFormCovid19 extends React.Component{
    state = {
        visible: this.props.visible,
        check1:false,
        check2:false,
        check3:false,
        check4:false,
        check5:false,
        check6:false,
        check7:false,
        check8:false,
        check9:false,
        signature: ""
    }

    _handleOnRequestClose = () => {
        if(this.state.signature == ''){
            Alert.alert('Wrong Input!', 'Please enter Digital Signature', [
                {text: 'Okay'}
            ]);
            return;
        }
        this.props.onPress(this.state);
        this.setState({ visible: false });
    }

    onPressTechnician = (technician,servicekey) => {
        this.props.onPress(technician,servicekey,this.comboid);  
    }
    _onSetconsentform = (key) =>{
        switch(key){
            case 1:
                this.setState({check1: this.state.check1 ? false : true});
            break;
            case 2:
                this.setState({check2: this.state.check2 ? false : true});
            break;
            case 3:
                this.setState({check3: this.state.check3 ? false : true});
            break;
            case 4:
                this.setState({check4: this.state.check4 ? false : true});
            break;
            case 5:
                this.setState({check5: this.state.check5 ? false : true});
            break;
            case 6:
                this.setState({check6: this.state.check6 ? false : true});
            break;
            case 7:
                this.setState({check7: this.state.check7 ? false : true});
            break;
            case 8:
                this.setState({check8: this.state.check8 ? false : true});
            break;
            case 9:
                this.setState({check9: this.state.check9 ? false : true});
            break;
        }

    }
    textInputChange = (val) => {
        this.setState({signature: val});
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
                        <Text style={styles.headerTitle}>COVID Consent Form</Text>
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
                <ScrollView style={{backgroundColor: color.lightWhite,flex:1, paddingLeft:15, paddingRight:15}}>
                    <Text style={{textAlign:"center", lineHeight:25, fontSize: 20}}>COVID-19 Pandemic Hair / Skin/ Body Treatment Consent Form</Text>
                    <Text style={styles.formtextCenter}>Please take a moment to complete our consent form.</Text>
                    <Text style={styles.formtextCenter}>By submitting the form below you agree to knowingly and willingly consenting to have hair/skin/body service during the COVID-19 pandemic.</Text>
                    <Text style={styles.formtextCenter}>We reserve the right to refuse service if this form is not submitted. Thank you.</Text>
                    <Text style={styles.formtext}>I understand the COVID-19 virus has a long incubation period during which carriers of the virus may not show symptoms and still be highly contagious. It is impossible to determine who has it and who does not, given the current limits in virus testing. *</Text>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this._onSetconsentform(1)}
                        isChecked={this.state.check1}
                        rightText="Yes"
                        rightTextStyle={{fontSize:18,color:'#626365'}}
                        disabled={false}
                    />
                    <Text style={styles.formtext}>I understand that due to the frequency of visits of other clients, the characteristics of the virus, and the characteristics of hair services, that I have an elevated risk of contracting the virus simply by being in the salon. *</Text>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this._onSetconsentform(2)}
                        isChecked={this.state.check2}
                        rightText="Yes"
                        rightTextStyle={{fontSize:18,color:'#626365'}}
                        disabled={false}
                    />

                    <Text style={styles.formtext}>I confirm that I am not presenting any of the following symptoms of COVOID-19 listed below: *</Text>
                    <Text style={[styles.formtext,{marginLeft:15}]}>- Temperature above 98.7 degrees</Text>
                    <Text style={[styles.formtext,{marginLeft:15}]}>- Shortness of breath</Text>
                    <Text style={[styles.formtext,{marginLeft:15}]}>- Loss of sense of taste or smell</Text>
                    <Text style={[styles.formtext,{marginLeft:15}]}>- Dry cough</Text>
                    <Text style={[styles.formtext,{marginLeft:15}]}>- Sore Throat</Text>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this._onSetconsentform(3)}
                        isChecked={this.state.check3}
                        rightText="I Am Not Presenting Symptoms"
                        rightTextStyle={{fontSize:18,color:'#626365'}}
                        disabled={false}
                    />

                    <Text style={styles.formtext}>I confirm that I have not been around anyone with these symptoms in the past 14 days. *</Text>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this._onSetconsentform(4)}
                        isChecked={this.state.check4}
                        rightText="Yes"
                        rightTextStyle={{fontSize:18,color:'#626365'}}
                        disabled={false}
                    />

                    <Text style={styles.formtext}>I do not live with anyone who is sick or quarantined. *</Text>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this._onSetconsentform(5)}
                        isChecked={this.state.check5}
                        rightText="Yes"
                        rightTextStyle={{fontSize:18,color:'#626365'}}
                        disabled={false}
                    />

                    <Text style={styles.formtext}>To prevent the spread of contagious viruses and to help protect each other, I understand that I will have to follow the salon’s strict guidelines. *</Text>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this._onSetconsentform(6)}
                        isChecked={this.state.check6}
                        rightText="Yes"
                        rightTextStyle={{fontSize:18,color:'#626365'}}
                        disabled={false}
                    />
                    <Text style={styles.formtext}>I understand that air travel significantly increases my risk of contracting and transmitting the COVID-19 virus. And I understand that the CDC, OSHA and Board of Cosmetology and Barbers recommend social distancing of at least 6 feet. *</Text>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this._onSetconsentform(7)}
                        isChecked={this.state.check7}
                        rightText="Yes"
                        rightTextStyle={{fontSize:18,color:'#626365'}}
                        disabled={false}
                    />

                    <Text style={styles.formtext}>I verify that I have not traveled outside the United States in the past 14 days to countries that have been affected by COVID-19. *</Text>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this._onSetconsentform(8)}
                        isChecked={this.state.check8}
                        rightText="Yes"
                        rightTextStyle={{fontSize:18,color:'#626365'}}
                        disabled={false}
                    />
                    <Text style={styles.formtext}>I verify that I have not traveled domestically within the United States by commercial airline, bus, or train within the past 14 days. *</Text>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this._onSetconsentform(9)}
                        isChecked={this.state.check9}
                        rightText="Yes"
                        rightTextStyle={{fontSize:18,color:'#626365'}}
                        disabled={false}
                    />

                    <Text style={styles.formtext}>Digital Signature *</Text>
                    <Text style={styles.formtext}>Please type your full name below.</Text>
                    <Text style={styles.formtext}>By typing and submitting, this serves as a Digital Signature and verifies that you fully agree to our safety policy for our services.</Text>
                    <Text style={styles.formtext}>This digital signature holds the same authority as a handwritten one. Thank you.</Text>
                    <TextInput 
                    placeholder="Digital Signature *"
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 ,padding:10}}
                    onChangeText={(val) => this.textInputChange(val)}
                    value={this.state.signature}
                />

                <TouchableOpacity
                     onPress={() => this._handleOnRequestClose()}
                    style={[styles.signIn, {
                        borderColor: color.darkCyan,
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: color.darkCyan
                    }]}>Done</Text>
                </TouchableOpacity>
                <Text style={{marginTop:30}}></Text>
                </ScrollView>
            </Modal>
            
        )
    }
}

const styles = StyleSheet.create({
    formtextCenter:{
        textAlign:"center", lineHeight:25, fontSize: 16
    },
    formtext:{
        lineHeight:25, fontSize: 16, color:"#626365"
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
    closebtn:{
        position:'absolute',
        left:20,
        backgroundColor:'transparent',
        top:35
    },
    signIn: {
        width: 300,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
})
