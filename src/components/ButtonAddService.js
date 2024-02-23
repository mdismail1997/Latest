import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View } from "react-native";
import layout from "../assets/styles/layout";
import { getTextByKey } from '../helpers/language';
import { color } from '../assets/colors/colors';

export default class ButtonAddService extends React.Component{
    state = {
        isShowPlusService: false,
        count: 0
    }

    onPress = () => {
        this.props.onPress(0,'service_' + this.state.count);
    }

    render(){
        if(this.state.isShowPlusService)
        {
            return (
                <TouchableOpacity activeOpacity={1} onPress={this.onPress}>
                    <View style={[layout.floatGroup,styles.plusservicecontainer]}>
                        <Text style={styles.plusservice}>+ {getTextByKey(this.props.language,'addservice')}</Text>
                    </View>
                </TouchableOpacity>

            );
        }
        return false;
    }
}


const styles = StyleSheet.create({
    plusservicecontainer:{
        justifyContent: 'center',
        borderBottomWidth: 1 / 2,
        borderColor: color.grayishBlue,
        paddingLeft:15
    },
    plusservice:{
        color: color.reddish,
    }
});