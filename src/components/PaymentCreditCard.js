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
    Dimensions,
    Alert,
    SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import { TextInputMask } from "react-native-masked-text";
import FloatLabelTextField from "../components/FloatTextInput";
import {
    inputCurrency,
    inputCCNumber,
    inputCCExpireDate,
    inputCCCVV,
    validateCardNumber,
    validateExpireDate,
    validateCVC
} from "../helpers/Utils";
import { getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class PaymentCreditCard extends React.Component {
    state = {
        modalVisible: this.props.visible,
        value: this.props.value,
        remaining: this.props.remaining
    };
    amount = 0;
    ccnumber = "";
    ccholdername = "";
    ccexpiredate = "";
    cccvv = "";
    columnWidth = Dimensions.get("window").width / 2;

    close() {
        this.setState({ modalVisible: false });
    }

    show = () => {
        this.setState({ modalVisible: true });
    };

    onChangeTextCCAmount = value => {
        value = inputCurrency(value);
        this.amount = value;
        this.refs.ccamountinput.setState({ text: value });
    };

    onChangeTextCCNumber = value => {
        value = inputCCNumber(value);
        this.refs.ccnumberinput.setState({ text: value });
        this.ccnumber = value;
    };

    onChangeTextCCExpireDate = value => {
        value = inputCCExpireDate(value);
        this.refs.ccexpiredateinput.setState({ text: value });
        this.ccexpiredate = value;
    };

    onChangeTextCCCVV = value => {
        value = inputCCCVV(value);
        this.refs.cccvvinput.setState({ text: value });
        this.cccvv = value;
    };

    onChangeTextCCHoldername = value => {
        this.refs.ccholdernameinput.setState({ text: value });
        this.ccholdername = value;
    };

    validate = (amount, ccnumber, ccholdername, ccexpiredate, cccvv) => {
        let isValid = true;
        amountFormat = amount.replace("$", "");
        amountFormat = amountFormat.replace(",", "");
        if (amount == "") {
            isValid = false;
            Alert.alert("Error", "Please enter amount");
        }else if(amount != "" && amountFormat <= 0){
            isValid = false;
            Alert.alert("Error", "please enter amount larger 0"); 
        } else if (this.ccholdername == "") {
            isValid = false;
            Alert.alert("Error", "Please enter Cardholder's name");
        } else if (this.ccnumber == "") {
            isValid = false;
            Alert.alert("Error", "Please enter card number");
        } else if (this.ccexpiredate == "") {
            isValid = false;
            Alert.alert("Error", "Please enter expire date");
        } else if (this.cccvv == "") {
            isValid = false;
            Alert.alert("Error", "Please enter CVV");
        }

        if (isValid) {
            isValid = validateCardNumber(this.ccnumber);
            if (!isValid) {
                Alert.alert("Error", "Please enter a valid card number");
            }
        }

        if (isValid) {
            isValid = validateExpireDate(this.ccexpiredate);
            if (!isValid) {
                Alert.alert("Error", "Please enter valid month and year");
            }
        }

        if (isValid) {
            isValid = validateCVC(this.cccvv);
            if (!isValid) {
                Alert.alert("Error", "Please enter a valid cvv");
            }
        }

        return isValid;
    };

    addAmount = () => {
        let isValid = this.validate(
            this.amount,
            this.ccnumber,
            this.ccholdername,
            this.ccexpiredate,
            this.cccvv
        );
        if (isValid) {
            this.props.onSave(
                this.amount,
                this.ccnumber,
                this.ccholdername,
                this.ccexpiredate,
                this.cccvv
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
                                <Text style={layout.headertitle}>
                                    {this.getText('paymentcreditcard')}
                                </Text>
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
                            onChangeTextValue={this.onChangeTextCCAmount.bind(
                                this
                            )}
                            underlineColorAndroid="transparent"
                            ref="ccamountinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Cardholder's name"}
                            value={this.ccholdername}
                            onChangeTextValue={this.onChangeTextCCHoldername.bind(
                                this
                            )}
                            underlineColorAndroid="transparent"
                            ref="ccholdernameinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Card number"}
                            value={this.ccnumber}
                            onChangeTextValue={this.onChangeTextCCNumber.bind(
                                this
                            )}
                            underlineColorAndroid="transparent"
                            ref="ccnumberinput"
                        />
                    </View>
                    <View style={[layout.floatGroup, styles.twocolumn]}>
                        <FloatLabelTextField
                            placeholder={"Expire Date (MM / YY)"}
                            value={this.ccexpiredate}
                            onChangeTextValue={this.onChangeTextCCExpireDate.bind(
                                this
                            )}
                            underlineColorAndroid="transparent"
                            ref="ccexpiredateinput"
                            style={[{ width: this.columnWidth - 1 }]}
                        />
                        <View style={styles.seperatecolumn} />
                        <FloatLabelTextField
                            placeholder={"CVV"}
                            value={this.cccvv}
                            onChangeTextValue={this.onChangeTextCCCVV.bind(
                                this
                            )}
                            underlineColorAndroid="transparent"
                            ref="cccvvinput"
                            style={[{ width: this.columnWidth }]}
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
    },
    twocolumn: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    seperatecolumn: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderColor: color.whitishBorder,
        backgroundColor: "red",
        height: 45
    }
});
