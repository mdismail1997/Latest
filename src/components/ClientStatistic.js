import React from "react";
import { StyleSheet, Text, View, Platform, Modal, TouchableOpacity, SafeAreaView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import setting from "../constants/Setting";
import { isLogged, jwtToken, getUserData } from "../helpers/authenticate";
import { WebView } from 'react-native-webview';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../assets/colors/colors";

export default class ClientStatistic extends React.Component {
    state = {
        modalVisible: this.props.visible
    };

    clientId = 0;
    clientName = '';
    url = '';
    close() {   
        this.setState({ modalVisible: false });
    }

    show = () => {
        this.setState({ modalVisible: true });
    };

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

    async UNSAFE_componentWillMount() {
        this.token = await jwtToken();
    }

    render() {
       

        return (
            <Modal
                animationType={"slide"}
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
                                        name={"close"}
                                        size={20}
                                        color={color.whiteRBG1}
                                        style={
                                                        Platform.OS ===
                                                        "android"
                                                            ? layout.navIcon
                                                            : layout.navIconIOS
                                                    }
                                    />
                                </View>
                            </TouchableOpacity>
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                
                                <Text style={layout.headertitle}>
                                    {this.clientName}
                                </Text>
                            </View>
                            
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.container}>
                    <WebView
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        javaScriptEnabled={true}
                        renderLoading={this.renderLoading}
                        source={{
                            uri: setting.apiUrl + this.url + '?clientid=' + this.clientId,
                            headers: { Authorization: "Bearer " + this.token }
                        }}
                        style={styles.container}
                    />
                </View>                     
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
