import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Platform,
    TextInput,
    FlatList,
    SafeAreaView,
    Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import { TextInputMask } from "react-native-masked-text";
import { getTextByKey } from "../helpers/language";
import FloatLabelTextField from "../components/FloatTextInput";
import {
    inputCurrency
} from "../helpers/Utils";
import { color } from "../assets/colors/colors";

export default class PaymentCash extends React.Component {
    state = {
        modalVisible: this.props.visible,
        value: this.props.value,
        remaining: this.props.remaining
    };
    amount = 0;

    close() {
        this.setState({ modalVisible: false });
    }

    show = () => {
        this.setState({ modalVisible: true });
    };

    onChangeText = value => {
        /*
        if (value != "") {
            value = value.replace("$", "");
            value = value.replace(",", "");
        }*/

        //this.amount = value;
        value = inputCurrency(value);
        this.amount = value;
        this.refs.ccamountinput.setState({ text: value });
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
        this.props.onSave("");
        //console.log(this.amount);
    };

    getText(key){
        return getTextByKey(this.props.language,key);
    }

    render() {
        //console.log(this.props.data);
        let calculateAmount = this.state.value;
        if(calculateAmount == ""){
            calculateAmount = this.state.remaining;
        }
        this.amount = "$" + calculateAmount;
        //calculateAmount = calculateAmount.toFixed(2);
        //console.log(calculateAmount);
        return (
            <Modal
                animationType={"none"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
            >
                <SafeAreaView style={{flex:1}}>
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
                                <Text style={layout.headertitle}>{this.getText('paymentcash')}</Text>
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
                                {/*
                    <TextInputMask
                        style={styles.inputamount}
                        placeholder="$0.00"
                        type={"money"}
                        underlineColorAndroid="transparent"
                        onChangeText={this.onChangeText.bind(this)}
                        value={calculateAmount}
                        options={{
                            precision: 2,
                            separator: ".",
                            delimiter: ",",
                            unit: "$"
                        }}
                    />*/}
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Amount"}
                            value={this.amount}
                            onChangeTextValue={this.onChangeText.bind(
                                this
                            )}
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
    }
});
