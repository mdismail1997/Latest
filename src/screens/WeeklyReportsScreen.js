import React from "react";
import { StyleSheet, Text, View, Platform, Dimensions, TouchableOpacity } from "react-native";
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import NavigationBarBackground from "../components/navigationBarBG";
import NavigationBarStaff from "../components/navigationBarStaff";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import setting from "../constants/Setting";
import { isLogged, jwtToken, getUserData } from "../helpers/authenticate";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../assets/colors/colors";
var {height, width} = Dimensions.get('window');
export default class WeeklyReportsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.webViewRef = React.createRef();
    }
    idtech = 0;
    state = {
        appIsReady: false
    };
    componentDidMount(){
        this.props.navigation.setOptions({
            headerTitle: "Weekly Reports",
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => this.renderLoading()}
                    activeOpacity={1}
                >
                    <View>
                        <Icon
                            name={"refresh"}
                            size={25}
                            color={color.whiteRGB}
                            style={{marginRight:10}}
                        />
                    </View>
                </TouchableOpacity>
            ),
        });
    }
    async UNSAFE_componentWillMount() {
        
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn) {
            this.token = await jwtToken();
            let userData = await getUserData();
            this.idtech = userData.id
            let fullname = userData.businessname;
            if(userData.role == 9){
                fullname = userData.fullname;
            }
        } else {
            this.props.navigator.push("login");
        }
        var screen = Dimensions.get('window');
        width = screen.width;
        height = screen.height;
        this.setState({appIsReady:true});
    }

    renderLoading = () => {
        var _this = this;
        setTimeout(function() {
            _this.webViewRef.current.reload();;
        }, 0);
        
    };

    onMessage = message => {
        console.log(message);
    };

    render() {
        if (this.state.appIsReady) {
            return (
                <View style={styles.container}>
                    <WebView
                        ref={this.webViewRef}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        javaScriptEnabled={true}
                        source={{
                            uri: setting.technicianSaleReportsUrl + '?type=Weekly&idtech='+this.idtech+'&height='+height,
                            headers: { Authorization: "Bearer " + this.token }
                        }}
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
