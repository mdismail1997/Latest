import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import layout from "../assets/styles/layout";
import { color } from "../assets/colors/colors";

export default class SearchCloseIcon extends React.Component {
    state = {
        visible: this.props.visible
    };

    _onPress = () => {
        this.props.onPress();
    };

    render() {
        if (this.state.visible) {
            return (
                <TouchableOpacity
                    style={layout.iconclosesearchbox}
                    activeOpacity={1}
                    onPress={this._onPress}
                >
                    <Icon
                        name={"close-circle-outline"}
                        size={20}
                        color={color.gray42}
                    />
                </TouchableOpacity>
            );
        }else return false
    }
}
