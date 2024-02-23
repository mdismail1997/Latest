import React from "react";
import {
    StyleSheet,
    View,
    Alert,
    Platform
} from "react-native";
import Customer from "../../components_checkin/clients/Customer";
import {
    jwtToken,

} from "../../helpers/authenticate";
import layout from "../../assets/styles/layout_checkin";
import Colors from "../../constants/Colors_checkin";
import SubmitLoader from "../../helpers/submitloader";
import setting from "../../constants/Setting";
import { color } from "../../assets/colors/colors";
import { api } from "../../api/api";
export default class ExpreeeCheckInScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: false
        }
    };
    userData = this.props.route.params.userData;
    isClientExists = this.props.route.params.isClientExists;
    clientSearchData = this.props.route.params.clientData;
    async UNSAFE_componentWillMount() {

    }
    onPressClient = async (client) => {
        let token = await jwtToken();
        this.clientData = client;
        this.refs.appointmentLoader.setState({ visible: true });
        fetch(setting.apiUrl + api.expressCheckinClient, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(this.clientData)
        })
            .then(response => response.json())
            .then(responseJson => {
                if (!responseJson.success) {
                    this.refs.appointmentLoader.setState({
                        visible: false
                    });
                    var _Alert = Alert;
                    setTimeout(function () {
                        _Alert.alert('Error', responseJson.message);
                    }, 200);
                } else {
                    this.refs.appointmentLoader.setState({
                        visible: false
                    });
                    var _this = this;
                    var checkinNumber = responseJson.checkinNumber;
                    var points = 0;
                    if (typeof (_this.clientSearchData.reward_point) != 'undefined') {
                        points = _this.clientSearchData.reward_point
                    }
                    _this.props.navigation.push('CheckInSuccess', {
                        logo_app: _this.props.route.params.logo_app,
                        checkinNumber: checkinNumber,
                        userData: _this.userData,
                        clientSearchData: _this.clientData,
                        points: points
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    close = () => {
        this.props.navigation.push('home', {
            businessname: this.props.route.params.userData.businessname, isBooked: true, isShowStaffCheckIn: this.props.route.params.isShowStaffCheckIn,
            logo_app: this.props.route.params.logo_app
        });
    }
    onClientUpdated = (client) => {
        this.clientData = client;
    }

    render() {
        let containerHeaderStepsStyle = styles.containerHeaderSteps;
        let headerStyle = styles.headerContainer;
        if (Platform.OS != 'ios') {
            headerStyle = styles.headerContainerAndroid;
            containerHeaderStepsStyle = styles.containerHeaderStepsAndroid;
        }
        return (
            <View style={styles.container}>
                <Customer
                    clientSearchData={this.clientSearchData}
                    isClientExists={this.isClientExists}
                    clients={this.props.route.params.clients}
                    onPress={this.onPressClient}
                    token={this.props.route.params.token}
                    onClientUpdated={this.onPressClient}
                    express="expresscheckin"
                    navigation={this.props.navigation}
                    userData={this.props.route.params.userData}
                />
                <SubmitLoader
                    ref="appointmentLoader"
                    visible={false}
                    textStyle={layout.textLoaderScreenSubmit}
                    textContent={"Processing..."}
                    color={Colors.spinnerLoaderColorSubmit}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerHeaderSteps: {
        height: 70
    },
    containerHeaderStepsAndroid: {
        height: 185
    },
    headerContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerContainerAndroid: {
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    closebtn: {
        position: 'absolute',
        right: 20,
        backgroundColor: 'transparent',
        top: 30
    },
    headerTitle: {
        color: color.white,
        backgroundColor: 'transparent',
        fontSize: 24,
        fontFamily: 'Futura'
    },
})