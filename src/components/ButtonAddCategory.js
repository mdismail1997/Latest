import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View } from "react-native";
import layout from "../assets/styles/layout";
import { getTextByKey } from '../helpers/language';
import { color } from '../assets/colors/colors';

export default class ButtonAddCategory extends React.Component{
    state = {
        isShowPlusService: true,
        count: 0
    }
    userData = this.props.userData;
    onPress = () => {
        this.props.onPress(0,"");
    }

    render(){
        if(this.userData.rewardpointDailyCheckInType == "bycategories")
        {
            return (
                <TouchableOpacity activeOpacity={1} onPress={this.onPress}>
                    <View style={[layout.floatGroup,styles.plusservicecontainer]}>
                        <Text style={styles.plusservice}>+ {getTextByKey(this.props.language,'addcategory')}</Text>
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