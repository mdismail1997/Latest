import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import layout from "../assets/styles/layout";
import {
    getUserData
} from "../helpers/authenticate";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";

export default class NavigationBarStaff extends React.Component {

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
