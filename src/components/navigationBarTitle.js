import React from "react";
import { StyleSheet, Text, View } from "react-native";

import layout from "../assets/styles/layout";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";

export default class NavigationBarTitle extends React.Component {
    render() {
       
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
