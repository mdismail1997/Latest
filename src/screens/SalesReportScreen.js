import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import NavigationBarBackground from "../components/navigationBarBG";
import NavigationBarStaff from "../components/navigationBarStaff";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import setting from "../constants/Setting";
import { isLogged, jwtToken, getUserData } from "../helpers/authenticate";

export default class SalesReportScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: true,
            elevation: 0,
            renderBackground: () => {
                return <NavigationBarBackground />;
            },
            renderTitle: route => {
                return (
                    <NavigationBarStaff
                        title={"salesreportnav"}
                        language={route.params.language}
                    />
                );
            }
        }
    };

    state = {
        appIsReady: false
    };

    async UNSAFE_componentWillMount() {
        //let currentNavigatorUID = this.props.navigation.navigationState.currentNavigatorUID;
        //console.log( this.props.navigation.navigationState);

        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn) {
            this.token = await jwtToken();
            let userData = await getUserData();
            let fullname = userData.businessname;
            if(userData.role == 9){
                fullname = userData.fullname;
            }
            // this.props.route.config.navigationBar.visible = true;
            // this.props.navigator.updateCurrentRouteParams({
            //     fullname: fullname
            // });
        } else {
            this.props.navigator.push("login");
        }
        this.setState({appIsReady:true});
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
            return (
                <View style={styles.container}>
                    <WebView
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        javaScriptEnabled={true}
                        renderLoading={this.renderLoading}
                        source={{
                            uri: setting.salesreportUrl,
                            headers: { Authorization: "Bearer " + this.token }
                        }}
                        style={styles.container}
                    />
                </View>
            );
        }else{
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
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
