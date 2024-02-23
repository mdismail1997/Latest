import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Keyboard,
    Alert,
    ActivityIndicator,
    Image
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import { LinearGradient } from 'expo-linear-gradient';
import { emailRegx, formatPhone } from "../../helpers/Utils";
import setting from "../../constants/Setting";
import { color } from "../../assets/colors/colors";
import { images } from "../../components/Images";
import { api } from "../../api/api";

export default class ReturnCustomer extends React.Component {
    state = {
        selectedClient: 0,
        showCloseSearchBox: false,
        search: '',
        data: this.props.clientSearchData
    }

    search = '';
    searchClicked = false;
    searching = false;

    changeSearch = (value) => {

        value = String.prototype.trim.call(value);
        value = value.replace('(', '');
        value = value.replace(')', '');
        value = value.replace(' ', '');
        value = value.replace('-', '');
        if (value.length >= 3 && !isNaN(value)) {
            let formatValue = formatPhone(value);
            this.setState({ search: formatValue });
        } else {
            this.setState({ search: value });
        }

        this.searchClicked = false;
        /*
        let formatValue = formatPhone(value);
        if (formatValue == "(") formatValue = "";
        this.setState({search: formatValue});
        this.search = formatValue.length == 14 ? formatValue : '';      
        if(this.search == '' && this.state.data != ''){
            this.setState({data: ''});        
        }
        this.searchClicked = false;*/
    }

    searchClient = async () => {
        let inputData = this.state.search;
        inputData = inputData.replace('(', '');
        inputData = inputData.replace(')', '');
        inputData = inputData.replace(' ', '');
        inputData = inputData.replace('-', '');
        if (String.prototype.trim.call(this.state.search) == '') {
            Alert.alert('Error', 'Please input Phone or Email');
        } else if (!isNaN(inputData) && this.state.search.length != 14) {
            Alert.alert('Error', 'Please input an valid Phone or Email');
        } else if (isNaN(inputData) && !emailRegx.test(String.prototype.trim.call(this.state.search))) {
            Alert.alert('Error', 'Please input an valid Phone or Email');
        } else {
            if (!this.searching) {
                this.searchClicked = true;
                let _this = this;
                Keyboard.dismiss();
                this.searching = true;
                this.setState({ data: '' });

                await fetch(setting.apiUrl + api.checkinClientSearch + inputData, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + this.props.token
                    }
                })
                    .then(response => response.json())
                    .then(responseJson => {
                        this.searching = false;
                        if (!responseJson.success) {
                            this.setState({ data: '' });
                        } else {
                            this.setState({ data: responseJson.data });
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        //return [];
                    });
                /*
                if(clients.length){
                    this.setState({data: clients[0]});
                }else{
                    this.setState({data: ''});
                }*/
            }

        }
    }

    saveClient = () => {
        this.props.onPress(this.state.data);
    }

    editClient = () => {
        this.props.onPressEdit(this.state.data);
    }
    nextChooseService = () => {
        this.saveClient();
    }


    render() {
        let fieldClient_app_checkin = '';
        let field_firstname = 0;
        let field_lastname = 0;
        let field_phone = 0;
        let field_birthdate = 0;
        let field_email = 0;
        let field_optout_sms = 0;
        let field_optout_email = 0;
        if (typeof (this.props.userData.fieldClient_app_checkin) != 'undefined' && this.props.userData.fieldClient_app_checkin != '' && this.props.userData.fieldClient_app_checkin != null) {
            fieldClient_app_checkin = this.props.userData.fieldClient_app_checkin;
            field_firstname = fieldClient_app_checkin['field_firstname'];
            field_lastname = fieldClient_app_checkin['field_lastname'];
            field_phone = fieldClient_app_checkin['field_phone'];
            field_birthdate = fieldClient_app_checkin['field_birthdate'];
            field_email = fieldClient_app_checkin['field_email'];
            field_optout_sms = fieldClient_app_checkin['field_optout_sms'];
            field_optout_email = fieldClient_app_checkin['field_optout_email'];
        }
        let phone = '';
        let birthdate = '';
        if (this.state.data != '') {
            if (typeof this.state.data.phone != 'undefined' && this.state.data.phone != '' && this.state.data.phone != null) {
                phone = this.state.data.phone.toString().replace(/[^\d]+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }

            if (typeof this.state.data.birthdate != 'undefined' && this.state.data.birthdate != '' && this.state.data.birthdate != null) {
                //birthdate = birthdate.replace('/','');
                birthdate = this.state.data.birthdate;
            }
        }

        return (

            <View style={styles.container}>

                {

                    this.state.data != '' &&

                    <View>

                        <View style={{ backgroundColor: color.placeHolderColor, width: 10 }}></View>
                        <View style={[styles.clientContainer]}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={styles.clientTitle}>Profile Information</Text>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.btnSaveWraperNormal}
                                    onPress={this.editClient}>
                                    <Image
                                        source={images.editIcon}
                                        style={{ width: 22, height: 22 }}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.twocolumns}>
                                {field_firstname == 0 &&
                                    <View style={styles.column}>
                                        <View style={styles.clienthalfrow}>
                                            <Text style={styles.clientlbl}>First Name</Text>
                                            <Text style={styles.clientvalue}>{this.state.data.firstname}</Text>
                                        </View>
                                    </View>
                                }

                                {
                                    field_lastname == 0 &&
                                    <View style={styles.column}>
                                        <View style={styles.clienthalfrow}>
                                            <Text style={styles.clientlbl}>Last Name</Text>
                                            <Text style={styles.clientvalue}>{this.state.data.lastname}</Text>
                                        </View>
                                    </View>
                                }

                                {
                                    field_birthdate == 0 &&
                                    <View style={styles.column}>
                                        <View style={styles.clienthalfrow}>
                                            <Text style={styles.clientlbl}>Birthdate</Text>
                                            <Text style={styles.clientvalue}>{birthdate}</Text>
                                        </View>
                                    </View>
                                }
                                {
                                    field_phone == 0 &&
                                    <View style={styles.column}>
                                        <View style={styles.clienthalfrow}>
                                            <Text style={styles.clientlbl}>Phone</Text>
                                            <Text style={styles.clientvalue}>{phone}</Text>
                                        </View>
                                    </View>
                                }
                                {
                                    field_email == 0 &&
                                    <View style={[styles.column, { width: "100%" }]}>
                                        <View style={[styles.clienthalfrow]}>
                                            <Text style={styles.clientlbl}>Email</Text>
                                            <Text style={styles.clientvalue}>{this.state.data.email}</Text>
                                        </View>
                                    </View>
                                }





                                <View style={[styles.column, { width: "100%" }]}>
                                    <View style={[styles.clienthalfrow]}>
                                        <Text style={styles.clientlbl}>Reward Point Balance</Text>
                                        <Text style={styles.clientvalue}>{this.state.data.reward_point}</Text>
                                    </View>
                                </View>


                            </View>

                        </View>
                    </View>
                }
                {
                    this.state.data.providerid == 9144 &&

                    <View style={[styles.clientContainer]}>
                        <Text style={styles.clientTitle}>Sponsor Information</Text>
                        <View style={styles.twocolumns}>
                            <View style={styles.column}>
                                <View style={styles.clienthalfrow}>
                                    <Text style={styles.clientlbl}>Full Name</Text>
                                    <Text style={styles.clientvalue}>{this.state.data.sponsor.name}</Text>
                                </View>
                            </View>


                            <View style={styles.column}>
                                <View style={styles.clienthalfrow}>
                                    <Text style={styles.clientlbl}>Phone</Text>
                                    <Text style={styles.clientvalue}>{this.state.data.sponsor.phone}</Text>
                                </View>
                            </View>

                            <View style={[styles.column, { width: "100%" }]}>
                                <View style={styles.clienthalfrow}>
                                    <Text style={styles.clientlbl}>Email</Text>
                                    <Text style={styles.clientvalue}>{this.state.data.sponsor.email}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                }
                {
                    (typeof (this.props.express) != 'undefined' && this.props.express == 'expresscheckin') &&
                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 35, marginTop: 35 }}>
                        <View style={[styles.btnSave, { width: 200 }]}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.btnSaveWraper}
                                onPress={this.saveClient}
                            >
                                <LinearGradient
                                    start={[0, 0]}
                                    end={[1, 0]}
                                    colors={[color.white, color.white]}
                                    style={styles.btnLinearSave}
                                >
                                    <Text style={styles.btnSaveText}>Confirm</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

                {
                    this.state.data == '' && this.state.search != '' && this.searchClicked && !this.searching &&
                    <View style={styles.clientContainer}>
                        <Text style={[styles.clientTitle, { textAlign: 'center' }]}>Sorry! No result found</Text>
                    </View>
                }

                {
                    this.searching &&
                    <View style={styles.clientLoaderContainer}>
                        <View style={styles.clientLoader}>
                            <ActivityIndicator
                                color={color.reddish}
                                size={'large'}
                                style={styles.Indicator}
                            />
                            <View style={styles.textContainer}>
                                <Text style={[styles.textContent]}>Searching...</Text>
                            </View>
                        </View>
                    </View>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    clientLoaderContainer: {
        // justifyContent: 'center',
        // alignItems: 'center',
        marginTop: 20
    },
    clientLoader: {
        // justifyContent: 'center',
        // alignItems: 'center',
        height: 100,
        width: 120
    },
    Indicator: {

    },
    textContent: {
        fontSize: 20,
        fontFamily: 'Futura',
        marginTop: 5,
        color: color.darkSilver
    },
    textbox: {
        height: 50,
        color: color.black,
        paddingRight: 20,
        paddingLeft: 20,
        fontSize: 16,
        backgroundColor: color.reddish,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5
    },
    twocolumns: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
        // width:560
    },
    searchContainer: {
        height: 50,
        justifyContent: 'center',
        marginTop: 15
    },
    searchbox: {
        position: 'absolute',
        zIndex: 1,
        right: 0,
        width: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        width: 100,
        height: 50,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5
    },
    txtsearchtext: {
        backgroundColor: 'transparent',
        fontSize: 18,
        color: color.white
    },
    disable: {
        opacity: 0.5
    },
    active: {
        opacity: 1
    },
    clientContainer: {
        marginTop: 15,
        // justifyContent: "center",
        // alignItems: "center",
    },
    clientrow: {
        flexDirection: 'row',
        marginBottom: 20,
        marginTop: 4.5
    },
    column: {
        paddingRight: 30,
        width: "50%",
    },
    clienthalfrow: {
        marginBottom: 10,
        paddingBottom: 10,
        marginTop: 4.5,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.white,
    },
    clientlbl: {
        fontSize: 13,
        color: color.white,
        fontFamily: 'Futura',
        marginLeft: 10,

    },
    clientlbldot: {
        fontSize: 18,
        color: '#333',

    },
    clientvalue: {
        color: color.white,
        fontSize: 20,
        marginLeft: 10,
        marginTop: 5,
        fontFamily: 'Futura',
    },
    clientTitle: {
        color: color.white,
        fontSize: 25,
        marginBottom: 35,
        fontFamily: 'Futura',
    },
    btnSave: {
        height: 50,
        marginTop: 10,
        marginBottom: 15,
        marginLeft: 0
    },
    btnSaveText: {
        color: color.pelorous,
        fontSize: 20,
        zIndex: 1,
        backgroundColor: "transparent",
        fontFamily: 'Futura',
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    btnSaveWraperNormal: {
        marginLeft: 65,
        marginTop: 7,

    },
    btnLinearSave: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    }

})