import React from "react";
import { StyleSheet, Text, View, TouchableOpacity,Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import layout from "../assets/styles/layout";
import { withNavigation } from "@expo/ex-navigation";
import { color } from "../assets/colors/colors";

@withNavigation
export default class NavigationBarBackButton extends React.Component {
    back = () => {
        let rootNavigator = this.props.navigation.getNavigator(this.props.navigatorid);
        rootNavigator.pop();
    }
    
    render() {
        //console.log(this.props.technicianList);
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={
                        layout.headerNavLeftContainer
                    }
                    activeOpacity={1}
                    onPress={() => this.back()}
                >
                    <View style={layout.headerNavLeft}>
                        <Icon
                            name={"arrow-left"}
                            size={30}
                            color={
                                color.whiteRBG1
                            }
                            style={
                                Platform.OS ===
                                "android"
                                    ? layout.navIcon
                                    : layout.navIconIOS
                            }
                        />
                    </View>
                </TouchableOpacity>
                <View style={styles.navContainer}>
                    <Text style={layout.navTitleText}>
                        {typeof this.props.title == 'object' ? this.props.title.main : this.props.title}
                    </Text>
                    {
                        typeof this.props.title == 'object' 
                        && this.props.title.alt != "" &&
                        <Text style={styles.navTitleText}>
                            {this.props.title.alt}
                        </Text>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    navContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navTitleText:{
        color: color.white,
        fontSize:14
    }
});
