import React from "react";
import { StyleSheet ,Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
//import layout from "../assets/styles/layout";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class CalendarStripHeader extends React.Component {
    _onPress = () => {
        this.props.onPress();
    };

    toDayOnPress = () => {
        this.props.toDayOnPress();
    }

    render() {
        
        return(

                <View style={styles.calendarHeaderContainer}>
                    <View style={styles.calendarHeaderContents}>
                        <Text style={styles.calendarHeaderToday} onPress={this.toDayOnPress}>{getTextByKey(this.props.language,'today')}</Text>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onPress()}>
                            <View style={{flex:1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                                <Text style={styles.calendarHeaderText}>{this.props.headerTitle}</Text>
                                <Icon
                                    name={'menu-down'}
                                    size={20}
                                    color={color.black}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

        );
    }
}

const styles = StyleSheet.create({
    calendarHeaderContainer: {
        height:20,
    },
    calendarHeaderContents: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarHeaderText:{
        fontSize: 16
    },
    calendarHeaderToday:{
        color: color.reddish,
        position:'absolute',
        left: 15
    }
});
