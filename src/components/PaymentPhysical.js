import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Platform,
    Alert,
    SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import { getTextByKey } from "../helpers/language";
import FloatLabelTextField from "../components/FloatTextInput";
//import CardConnectHelper from "../CardConnectNativeModule";
import SubmitLoader from "../helpers/submitloader";
import Colors from "../constants/Colors";
import { color } from "../assets/colors/colors";

export default class PaymentPhysical extends React.Component {
    state = {
        modalVisible: this.props.visible,
        value: this.props.value,
        remaining: this.props.remaining,
        textConnect: 'Disconnected',
        ccnumber: "",
        ccholdername: "",
        ccexpiredate: "",
        accountType: "",
        loading:false
    };
    amount = 0;
  checkConnect = (isconnect)=>{
    this.setState({ textConnect: isconnect });
  }
  connected = (isconnect) =>{
    this.setState({ textConnect: isconnect });
  }
  swipeStarted = (message)=>{
    
    this.setState({loading: true})
    if(message != "started"){
        Alert.alert('Error', message);
    }
  }

  swipeSuccess = (data)=>{
/*     this.ccnumber = data.token;
    this.ccholdername = data.name;
    this.ccexpiredate = data.expiry;
    this.accountType = data.accountType;  */
    this.setState({ccnumber: data.token,  ccholdername:data.name, ccexpiredate: data.expiry, accountType: data.accountType})
   // this.refs.ccexpiredateinput.setState({ text: data.expiry });
    //this.refs["ccexpiredateinput"].setState({ text: data.expiry });
/*     this.refs.ccnumberinput.setState({ text: data.token });
    this.refs.ccholdernameinput.setState({ text: data.name });
*/

  }

    close() {
        this.setState({ modalVisible: false });
    }
    
    show = () => {
        this.setState({ modalVisible: true });
    };


    validate = (amount) => {
        let isValid = true;

      amountFormat = amount.replace("$", "");
      amountFormat = amountFormat.replace(",", "");
        if (amount == "") {
            isValid = false;
            Alert.alert("Error", "Please enter amount");
        }else if(amount != "" && amountFormat <= 0){
            isValid = false;
            Alert.alert("Error", "please enter amount larger 0"); 
        }
        return isValid;
    };
    addAmount = () => {
        let isValid = this.validate(
            this.amount,

        );
        if (isValid) {
            this.props.onSave(
                this.amount
            );
        }
    };
    onDelete = () => {
        this.props.onSave(
                "",
                "",
                "",
                "",
                ""
            );
        //console.log(this.amount);
    };

    getText(key){
        return getTextByKey(this.props.language,key);
    }
    onChangeTextCCHoldername = value => {
        this.refs.ccholdernameinput.setState({ text: value });
        this.ccholdername = value;
    };

    render() {
        //console.log(this.props.data);
        let calculateAmount = this.state.value;
        if(calculateAmount == ""){
            calculateAmount = this.state.remaining;
        }
        this.amount = "$" + calculateAmount;
        return (
            <Modal
                animationType={"none"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
            >
                <SafeAreaView style={{flex: 1}}>
                <View
                    style={
                        Platform.OS === "android"
                            ? layout.headercontainerAndroid
                            : layout.headercontainer
                    }
                >
                    <LinearGradient
                        start={[0, 0]}
                        end={[1, 0]}
                        colors={[color.reddish, color.reddish]}
                        style={
                            Platform.OS === "android"
                                ? layout.headerAndroid
                                : layout.header
                        }
                    >
                        <View style={layout.headercontrols}>
                            <TouchableOpacity
                                style={layout.headerNavLeftContainer}
                                activeOpacity={1}
                                onPress={() => this.close()}
                            >
                                <View style={layout.headerNavLeft}>
                                    <Icon
                                        name={"chevron-left"}
                                        size={30}
                                        color={color.whiteRBG1}
                                        style={
                                            Platform.OS === "android"
                                                ? layout.navIcon
                                                : layout.navIconIOS
                                        }
                                    />
                                </View>
                            </TouchableOpacity>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Text style={layout.headertitle}>{this.getText('paymentphysical')}</Text>
                            </View>
                            {this.amount != "" &&
                                <TouchableOpacity
                                    style={layout.headerNavRightContainer}
                                    activeOpacity={1}
                                    onPress={() => this.onDelete()}
                                >
                                    <View style={layout.headerNavRight}>
                                        <Text style={layout.headerNavText}>
                                            {this.getText('delete')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>}
                        </View>
                    </LinearGradient>
                </View>

                <View style={{ flex: 1, backgroundColor: color.lightWhite }}>
                <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Amount"}
                            value={this.amount}
                            underlineColorAndroid="transparent"
                            ref="ccamountinput"

                        />
                    </View>                            
                    <View style={styles.btnSave}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.btnSaveWraper}
                            onPress={this.addAmount}
                        >
                            <LinearGradient
                                start={[0, 0]}
                                end={[1, 0]}
                                colors={[color.reddish, color.reddish]}
                                style={styles.btnLinear}
                            >
                                <Text style={styles.btnSaveText}>{this.getText('paymentadd')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* <CardConnectHelper ref="CardConnect" checkConnect={this.checkConnect} connected={this.connected} swipeStarte={this.swipeStarted} swipeSuccess={this.swipeSuccess} amount={this.amount} />  */}
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    inputamount: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor: color.white,
        borderWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: color.whitishBorder
    },
    btnSave: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 15
    },
    btnSaveText: {
        color: color.white,
        fontSize: 16,
        zIndex: 1,
        backgroundColor: "transparent"
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 15,
        right: 15
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    btnconnect:{
        height: (Platform.OS == 'ios' ? 20 : 55),
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        flex: 1,
     },
     messageCardconnect:{
        alignItems: "center",
     },
     texttitleCard:{
        fontSize:20,
        color:"#333"
     }
});
