import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ScrollView,
    Platform,
    Modal
} from "react-native";
import layout from "../assets/styles/layout";
import FloatLabelTextField from "../components/FloatTextInput";
import { emailRegx, formatPhone } from "../helpers/Utils";
import { LinearGradient } from 'expo-linear-gradient';
import Colors from "../constants/Colors";
import SubmitLoader from "../helpers/submitloader";
import IconLoader from "../helpers/iconloader";
import setting from "../constants/Setting";
// import Router from "../navigation/Router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../assets/colors/colors";
import { api } from "../api/api";

export default class DetailProfileScreen extends React.Component {
    

    state = {
        modalVisible: this.props.visible
    };

    userData = this.props.userData;
    data = {...this.props.data};

    close() {
        this.setState({ modalVisible: false });
    }

    show = (passData) => {
        
        if(typeof(passData) != 'undefined'){
            this.data = {...passData};
        }
        this.setState({ modalVisible: true });
    };

    /*
    async componentWillMount() {
        this.data = this.props.route.params.data;
        this.userData = this.props.route.params.userData;
    }*/

    onChangeTextFirstName = value => {
        this.refs.txtfirstnameinput.setState({ text: value });
        this.data.FirstName = value;
    };

    onChangeTextLastName = value => {
        this.refs.txtlastnameinput.setState({ text: value });
        this.data.LastName = value;
    };

    onChangeTextBusinessName = value => {
        this.refs.txtbusinessnameinput.setState({ text: value });
        this.data.BusinessName = value;
    };

    onChangeTextEmail = value => {
        this.refs.txtemailinput.setState({ text: value });
        this.data.Email = value;
    };

    onChangeTextPhone = value => {
        let formatValue = formatPhone(value);
        if (formatValue == "(") formatValue = "";
        this.refs.txtphoneinput.setState({ text: formatValue });
        this.data.MobileNumber = formatValue;
    };

    onChangeTextBusinessPhone = value => {
        let formatValue = formatPhone(value);
        if (formatValue == "(") formatValue = "";
        this.refs.txtbusinessphoneinput.setState({ text: formatValue });
        this.data.BusinessPhone = formatValue;
    };

    save = () => {
      
        
        let isValid = true;
         
        if (String.prototype.trim.call(this.data.FirstName) == "") {
            isValid = false;
            Alert.alert("Error", "Please enter first name");
        } else if (String.prototype.trim.call(this.data.LastName) == "") {
            isValid = false;
            Alert.alert("Error", "Please enter last name");
        }else if (this.userData.role == 4 && String.prototype.trim.call(this.data.BusinessName) == "") {
            isValid = false;
            Alert.alert("Error", "Please enter business name");
        } else if (String.prototype.trim.call(this.data.Email) == "") {
            isValid = false;
            Alert.alert("Error", "Please enter email");
        } else if (
            !emailRegx.test(
                String.prototype.trim.call(this.data.Email)
            )
        ) {
            isValid = false;
            Alert.alert("Error", "Please enter a valid email");
        } else if (
            String.prototype.trim.call(this.data.MobileNumber) != "" &&
            this.data.MobileNumber.length != 14
        ) {
            isValid = false;
            Alert.alert(
                "Error",
                "Please enter a valid cell phone with mask (###) ###-#### or leave empty"
            );
        } else if (
            String.prototype.trim.call(this.data.BusinessPhone) != "" &&
            this.data.BusinessPhone.length != 14
        ) {
            isValid = false;
            Alert.alert(
                "Error",
                "Please enter a valid business phone with mask (###) ###-#### or leave empty"
            );
        } 

        if (isValid) {
            var formdata = {};
            //formdata.id = this.clientData.id;
            formdata.FirstName = String.prototype.trim.call(
                this.data.FirstName
            );
            formdata.LastName = String.prototype.trim.call(
                this.data.LastName
            );

            formdata.BusinessName = String.prototype.trim.call(
                this.data.BusinessName
            );

            formdata.email = String.prototype.trim.call(this.data.Email);

            if (
                String.prototype.trim.call(this.data.MobileNumber) != "" &&
                this.data.MobileNumber.length == 14
            ) {
                formdata.MobileNumber = this.data.MobileNumber;
            }

            if (
                String.prototype.trim.call(this.data.BusinessPhone) != "" &&
                this.data.BusinessPhone.length == 14
            ) {
                formdata.BusinessPhone = this.data.BusinessPhone;
            }
            
            this.refs.Loader.setState({ visible: true });   
            fetch(setting.apiUrl + api.profileUpdate, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + this.props.token
                },
                body: JSON.stringify(formdata)
            })
                .then(response => response.json())
                .then(responseJson => {
                    if (!responseJson.success) {
                        this.fetchError(responseJson);
                        //console.log(responseJson);
                        this.refs.Loader.setState({ visible: false });   
                        //Alert.alert('Error', responseJson.message);
                        //return [];
                    } else {
                        this.refs.Loader.setState({ visible: false });   

                        successMessage = "Profile Updated";

                        this.refs.SuccessLoader.setState({
                            textContent: successMessage,
                            visible: true
                        });

                        let _this = this;
                        setTimeout(function() {
                            _this.refs.SuccessLoader.setState({
                                visible: false
                            });
                            
                            _this.props.SaveSuccess(
                                responseJson.data
                            );
                        }, 2000);

                        //Alert.alert("OK", "Appointment Booked");
                    }
                })
                .catch(error => {
                    console.error(error);
                    //return [];
                });
        }
    };

    fetchError(responseJson) {
        if (
            responseJson.message == "token_expired" ||
            responseJson.message == "token_invalid"
        ) {
            
            let rootNavigator = this.props.navigation.getNavigator('root'); 
            rootNavigator.replace('login');
        } else {
            Alert.alert("Error", responseJson.message);
        }
    }

    render() {
       
        return(
            <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => this.close()}
        >
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
                                    name={"arrow-left"}
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
                            <Text style={layout.headertitle}>Edit Profile</Text>
                        </View>
                        
                    </View>
                </LinearGradient>
            </View>

            <ScrollView>
                <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"First name"}
                            value={this.data.FirstName}
                            onChangeTextValue={this.onChangeTextFirstName}
                            underlineColorAndroid="transparent"
                            ref="txtfirstnameinput"
                        />
                    </View>
                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Last name"}
                            value={this.data.LastName}
                            onChangeTextValue={this.onChangeTextLastName}
                            underlineColorAndroid="transparent"
                            ref="txtlastnameinput"
                        />
                    </View>

                    {
                        this.userData.role == 4 &&
                        <FloatLabelTextField
                            placeholder={"Business name"}
                            value={this.data.BusinessName}
                            onChangeTextValue={this.onChangeTextBusinessName}
                            underlineColorAndroid="transparent"
                            ref="txtbusinessnameinput"
                        />
                        
                    }

                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Email"}
                            value={this.data.Email}
                            onChangeTextValue={this.onChangeTextEmail}
                            underlineColorAndroid="transparent"
                            ref="txtemailinput"
                        />
                    </View>

                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Cell Phone"}
                            value={this.data.MobileNumber}
                            onChangeTextValue={this.onChangeTextPhone}
                            underlineColorAndroid="transparent"
                            ref="txtphoneinput"
                        />
                    </View>

                    <View style={layout.floatGroup}>
                        <FloatLabelTextField
                            placeholder={"Business Phone"}
                            value={this.data.BusinessPhone}
                            onChangeTextValue={this.onChangeTextBusinessPhone}
                            underlineColorAndroid="transparent"
                            ref="txtbusinessphoneinput"
                        />
                    </View>

                    <View style={styles.btnSave}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.btnSaveWraper}
                            onPress={this.save}
                        >
                            <LinearGradient
                                start={[0, 0]}
                                end={[1, 0]}
                                colors={[color.reddish, color.reddish]}
                                style={styles.btnLinear}
                            >
                                <Text style={styles.btnSaveText}>Save</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <SubmitLoader
                        ref="Loader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmit}
                        textContent={"Processing..."}
                        color={Colors.spinnerLoaderColorSubmit}
                    />
                    <IconLoader
                        ref="SuccessLoader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmitSucccess}
                        textContent={"Profile Saved"}
                        color={Colors.spinnerLoaderColorSubmit}
                    />
            </ScrollView>
        </Modal>

            
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
