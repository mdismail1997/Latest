import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import layout from "../assets/styles/layout";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    getUserData
} from "../helpers/authenticate";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class NavigationBarClient extends React.Component {

    //languageKey = this.props.language;

    async UNSAFE_componentWillMount() {
        //this.languageKey = await getLanguage();
        
        //console.log('title - ' + this.props.title);
        this.userData = await getUserData();
    }

    createClient = () => {
        this.props.create();
    }

    render() {
        //console.log(this.props.language);
        //console.log(getTextByKey(this.props.language,this.props.title));
        return (
            <View style={styles.container}>
                <View style={layout.navContainer}>
                    <Text style={layout.navTitleText}>
                        {getTextByKey(this.props.language,this.props.title)}
                    </Text>
                </View>
                {
                    (typeof this.userData == "object" && ((this.userData.view_customer_information != "" && this.userData.view_customer_information == 1)
                        || this.userData.role == 4 || this.userData.role == 9)) &&
                    <View style={layout.navIconRight}>
                        <TouchableOpacity onPress={() => this.createClient()} activeOpacity={1}>
                            <Icon
                                name={'plus'}
                                size={20}
                                color={color.whiteRBG1} style={layout.navIcon}
                            />
                        </TouchableOpacity>
                    </View>
                }


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
