import React from "react";
import { StyleSheet ,Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../../assets/colors/colors";
//import layout from "../assets/styles/layout";

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
                        <Text style={styles.calendarHeaderToday} onPress={this.toDayOnPress}>Today</Text>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onPress()}>
                            <View style={{flex:1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                                <Text style={styles.calendarHeaderText}>{this.props.headerTitle}</Text>
                                <Icon
                                    name={'menu-down'}
                                    size={20}
                                    color={color.white}
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
        height:30,
        marginBottom:15,
        marginTop:5
    },
    calendarHeaderContents: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarHeaderText:{
        fontSize: 18,
        fontFamily:'Futura',
        color:color.white
    },
    calendarHeaderToday:{
        color: color.white,
        position:'absolute',
        left: 15,
        fontSize: 22,
        fontFamily:'Futura'
    }
});
