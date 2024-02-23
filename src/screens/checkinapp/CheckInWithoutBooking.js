import React from "react";
import {
    StyleSheet,
    View,
    Alert,
    Platform
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import ScrollableTabView from "react-native-scrollable-tab-view";
import HideTabBar from "../../components_checkin/scrolltab/HideTabBar";
import ListCategories from "../../components_checkin/services/ListCategories";
import Steps from "../../components_checkin/steps/stepswithoutbooking";
import layout from "../../assets/styles/layout_checkin";
import Colors from "../../constants/Colors_checkin";
import SubmitLoader from "../../helpers/submitloader";
import setting from "../../constants/Setting";
import { getDeviceId } from "../../helpers/authenticate";
import Customer from "../../components_checkin/clients/CustomerWithoutBooking";
import Summary from "../../components_checkin/summaryWithoutBooking";
import RightLayoutCheckIn from "../../components_checkin/RightLayoutCheckIn";
import { color } from "../../assets/colors/colors";
import { api } from "../../api/api";

export default class CheckInWithoutBookingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.steps = React.createRef();
        this.customerRef = React.createRef();
        this.tabsRef = React.createRef();
        this.summaryRef = React.createRef();
        this.rightLayoutRef = React.createRef();
        this.appointmentLoaderRef = React.createRef();
    }
    static route = {
        navigationBar: {
            visible: false
        }
    };

    clientData = '';

    deviceid = 0;
    selectServices = [];

    userData = this.props.route.params.userData;
    isClientExists = this.props.route.params.isClientExists;
    clientSearchData = this.props.route.params.clientData;


    async UNSAFE_componentWillMount() {
        this.deviceid = await getDeviceId();

    }
    onPressClient = (client) => {
        this.clientData = client;
        this.steps.current.setStep(2);
        this.tabsRef.current.goToPage(1);
    }

    onClientUpdated = (client) => {
        this.clientData = client;
        this.steps.current.setStep(2);
        this.tabsRef.current.goToPage(1);
    }

    onPressService = (services) => {
        this.selectServices = services;
    }

    async onPressStep(stepNumber, currentStep) {
        switch (stepNumber) {
            case 1:
                this.steps.current.setStep(1);
                this.tabsRef.current.goToPage(0);
                this.rightLayoutRef.current.setStepNumber(1);
                break;
            case 2:
                if (currentStep == 1) {
                    this.customerRef.current.nextChooseService();
                } else {
                    this.steps.current.setStep(2);
                    this.tabsRef.current.goToPage(1);
                }
                this.rightLayoutRef.current.setStepNumber(2);
                break;
            case 3:
                let isValid = Object.keys(this.selectServices).length;
                if (!isValid) {
                    Alert.alert('Error', 'Please choose categories');
                } else {
                    this.steps.current.setStep(3);
                    this.tabsRef.current.goToPage(2);
                    this.rightLayoutRef.current.setStepNumber(3);
                    let _this = this;
                    setTimeout(function () {
                        _this.setSummaryData(_this);
                    }, 0);
                }
                break;
            case 4:
                this.summaryRef.current.saveAppointment();
                break;
        }

    }

    onShowSummary = () => {
        this.steps.current.setStep(3);
        this.tabsRef.current.goToPage(2);
        let _this = this;
        setTimeout(function () {
            _this.setSummaryData(_this);
        }, 0);
    }

    setSummaryData = (_this) => {
        _this.summaryRef.current.setClient(_this.clientData, _this.props.route.params.userData);
        _this.summaryRef.current.setService(_this.selectServices);
        _this.summaryRef.current.setReady();

    }

    onCheckIn = (reward_point) => {
        this.appointmentLoaderRef.current.setState({ visible: true });
        let submitData = {};
        submitData.client_id = this.clientData.id;
        submitData.rewardpoint = reward_point;
        if (this.clientData.id == 0) {
            submitData.client_data = this.clientData;
        }
        submitData.categories = this.selectServices;
        fetch(setting.apiUrl + api.customerCheckin, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.props.route.params.token
            },
            body: JSON.stringify(submitData)
        })
            .then(response => response.json())
            .then(responseJson => {

                if (!responseJson.success) {
                    this.appointmentLoaderRef.current.setState({
                        visible: false
                    });
                    let _this = this;
                    setTimeout(function () {
                        _this.fetchError(responseJson);
                    }, 0);

                    //Alert.alert('Error', responseJson.message);
                    //return [];
                } else {

                    this.appointmentLoaderRef.current.setState({
                        visible: false
                    });
                    this.props.navigation.push('WithoutBookingSuccessScreen', { logo_app: this.props.route.params.logo_app, data: responseJson });
                }
            })
            .catch(error => {
                console.error(error);
                //return [];
            });
    }



    fetchError(responseJson) {
        if (
            responseJson.message == "token_expired" ||
            responseJson.message == "token_invalid"
        ) {
            this.props.navigation.push('login');
        } else {
            Alert.alert("Error", responseJson.message);
        }
    }



    close = () => {
        this.props.navigation.push('home', {
            businessname: this.props.route.params.userData.businessname, isBooked: true, isShowStaffCheckIn: this.props.route.params.isShowStaffCheckIn,
            logo_app: this.props.route.params.logo_app
        });
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
                <View style={{ width: "70%" }}>
                    <LinearGradient start={[0, 0]} end={[1, 1]} colors={[color.reddish, color.reddish]} style={containerHeaderStepsStyle}>
                        <Steps step={1} ref={this.steps} close={this.close} headerStyle={headerStyle} onPress={async (stepNumber, currentStep) => { await this.onPressStep(stepNumber, currentStep) }} />
                    </LinearGradient>

                    <View style={styles.containerTabs}>
                        <ScrollableTabView
                            ref={this.tabsRef}
                            renderTabBar={() => <HideTabBar />}
                            locked={true}

                        >
                            <View style={{ flex: 1 }}>
                                <Customer ref={this.customerRef} userData={this.userData} clientSearchData={this.clientSearchData} isClientExists={this.isClientExists} clients={this.props.route.params.clients} onPress={this.onPressClient} token={this.props.route.params.token} providerid={this.props.route.params.userData.id} onClientUpdated={this.onClientUpdated} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <ListCategories onPress={this.onPressService} onSelectedServices={this.goToTimePickerTab}
                                    listcombo={this.props.route.params.listcombo} categories={this.props.route.params.categories}
                                    onSave={this.onShowSummary} userData={this.userData} />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Summary ref={this.summaryRef} onPress={this.onCheckIn} token={this.props.token} />
                            </View>
                        </ScrollableTabView>
                        <SubmitLoader
                            ref={this.appointmentLoaderRef}
                            visible={false}
                            textStyle={layout.textLoaderScreenSubmit}
                            textContent={"Processing..."}
                            color={Colors.spinnerLoaderColorSubmit}
                        />

                    </View>
                </View>

                <RightLayoutCheckIn stepthree="ok" step={1} ref={this.rightLayoutRef} userData={this.props.route.params.userData} close={this.close} onPress={async (stepNumber, currentStep) => { await this.onPressStep(stepNumber, currentStep) }} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', position: 'relative',
    },
    containerTabs: {
        flex: 1,
        backgroundColor: color.reddish
    },
    containerHeaderSteps: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerHeaderStepsAndroid: {
        height: 185
    },
    headerContainer: {
        height: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerContainerAndroid: {
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    headerTitle: {
        color: color.white,
        backgroundColor: 'transparent',
        fontSize: 24,
        fontFamily: 'Futura'
    },
    closebtn: {
        position: 'absolute',
        right: 20,
        backgroundColor: 'transparent',
        top: 30
    },
    businessname_right: {
        fontSize: 26,
        backgroundColor: 'transparent',
        color: color.reddish,
        fontFamily: 'Futura',
        bottom: 30,
        zIndex: 2,
    },
    copyright: {
        fontSize: 16,
        backgroundColor: 'transparent',
        color: color.reddish,
        fontFamily: 'Futura',
        bottom: 10,
        zIndex: 2,
    },
    copyrightPhone: {
        fontSize: 16,
        backgroundColor: 'transparent',
        color: color.reddish,
        fontFamily: 'Futura',
        bottom: 10,
        zIndex: 2,

    },
    backgroundFullscreen: {
        position: 'absolute',
        zIndex: 1
    },
})