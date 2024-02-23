import React from "react";
import { StyleSheet, Text, View, Platform, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import NavigationBarBackground from "../components/navigationBarBG";
import NavigationBarBackButton from "../components/navigationBarBackButton";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import { isLogged, jwtToken, getUserData } from "../helpers/authenticate";
import { getPayouts } from "../api/getPayouts";
import ScrollableTabView from "react-native-scrollable-tab-view";
import DefaultTabBar from "../components/DefaultTabBar";
import LayoutWidth from "../constants/Layout";
import { color } from "../assets/colors/colors";

export default class PayoutScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: false,
            elevation: 0,
            renderLeft: () => {
                return false;
            },
            renderBackground: () => {
                return <NavigationBarBackground />;
            },
            renderTitle: route => {
                return (
                    <NavigationBarBackButton
                        navigatorid="root"
                        title={route.params.title}
                    />
                );
            }
        }
    };

    state = {
        appIsReady: false
    };

    async componentWillMount() {
        //let currentNavigatorUID = this.props.navigation.navigationState.currentNavigatorUID;
        //console.log( this.props.navigation.navigationState);

        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn) {
            this.token = await jwtToken();
            this.payouts = await getPayouts(this.token);
            let title = "Payouts";
            let altTitle = "";
            if(this.payouts.bank_exists){
                title = this.payouts.bank_name;
                altTitle = this.payouts.bank_last4;
            }
            this.props.route.config.navigationBar.visible = true;
            this.props.navigator.updateCurrentRouteParams({
                title: {
                    main: title,
                    alt: altTitle
                }
            });
            this.setState({ appIsReady: true });
            //this.userData = await getUserData();
        } else {
            this.props.navigator.replace("login");
        }
    }

    renderLoading = () => {
        return (
            <View style={styles.container}>
                <SpinnerLoader
                    visible={true}
                    textStyle={layout.textLoaderScreen}
                    overlayColor={"transparent"}
                    textContent={"Loading..."}
                    color={Colors.spinnerLoaderColor}
                />
            </View>
        );
    };

    onMessage = message => {
        console.log(message);
    };

    render() {
        if (this.state.appIsReady) {

            let schedulerpayouts = this.payouts.payouts.scheduled.data.map((item, i) => {
                let arrDate = item.date.split(' ');
                let dayname = arrDate.shift();
                return (
                    <View key={i} style={styles.payoutrow}>
                        <View style={[styles.payoutrowleft,{width:LayoutWidth.window.width - 90}]}>
                            <Text>Expected to arrive on {dayname}</Text>
                            <Text style={styles.payoutrowday}>{arrDate.join(' ')}</Text>
                        </View>
                        <View style={[styles.payoutrowright]}>
                            <Text style={styles.payoutrowamount}>${item.total}</Text>
                        </View>
                    </View>
                );
            });

            let depositedpayouts = this.payouts.payouts.deposited.data.map((item, i) => {
                let arrDate = item.date.split(' ');
                let dayname = arrDate.shift();
                return (
                    <View key={i} style={styles.payoutrow}>
                        <View style={[styles.payoutrowleft,{width:LayoutWidth.window.width - 90}]}>
                            <Text>Deposited on {dayname}</Text>
                            <Text style={styles.payoutrowday}>{arrDate.join(' ')}</Text>
                        </View>
                        <View style={[styles.payoutrowright]}>
                            <Text style={styles.payoutrowamount}>${item.total}</Text>
                        </View>
                    </View>
                );
            });

            return (
                <View style={styles.container}>
                    {
                        this.payouts.bank_exists &&
                        <View style={styles.container}>
                            <View style={styles.container}>
                                <ScrollableTabView
                                    renderTabBar={() => <DefaultTabBar backgroundColor={color.white} />}
                                    //onChangeTab={this.changeTab}
                                    locked={true}
                                    ref="tabPayout"
                                >
                                    <View
                                        tabLabel="Scheduled"
                                        style={{ flex: 1 }}
                                    >
                                        <View style={styles.totalpayout}>
                                            <Text>Total: ${this.payouts.payouts.scheduled.total}</Text>
                                        </View>
                                        <ScrollView style={styles.container}>
                                            {schedulerpayouts}
                                        </ScrollView>
                                    </View>
                                    <View
                                        tabLabel="Deposited"
                                        style={{ flex: 1 }}
                                    >
                                        <View style={styles.totalpayout}>
                                            <Text>Total: ${this.payouts.payouts.deposited.total}</Text>
                                        </View>
                                        <ScrollView style={styles.container}>
                                            {depositedpayouts}
                                        </ScrollView>
                                    </View>
                                </ScrollableTabView>
                            </View>
                        </View>}
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <SpinnerLoader
                        visible={true}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={"transparent"}
                        textContent={"Loading Payouts..."}
                        color={Colors.spinnerLoaderColor}
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    totalpayout:{
        height:40,
        justifyContent: 'center',
        backgroundColor: color.lightWhite,
        paddingLeft:15
    },
    payoutrow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        height:50,
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
    },
    payoutrowleft:{
        justifyContent: 'center',
        height:50,
        paddingLeft:15
    },
    payoutrowright:{
        justifyContent: 'center',
        height:50,
        paddingRight:15
    },
    payoutrowday:{
        fontSize:13,
        color: color.silver,
        marginTop:3
    },
    payoutrowamount:{
        fontSize:16,
        color: color.reddish
    }
});
