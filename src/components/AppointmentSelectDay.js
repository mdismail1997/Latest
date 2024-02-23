import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import layout from "../assets/styles/layout";
import { color } from "../assets/colors/colors";
export default class AppointmentSelectDay extends React.Component {
    state = {
        byDayText: this.props.byDayText,
        isToday: this.props.isToday,
        isSearch: false,
        appointment_by_day:this.props.byDayDate
    };

    changeDate = (rule) => {
        this.props.changeDate(rule);
    }

    _today = () => {
        this.props.today();    
    }
    open_input_search = () =>{
        this.setState({isSearch:true})
    }
    close_input_search = () =>{
        this.props.search_appointment_by_day('', true);
        this.setState({isSearch:false})
    }
    changeSearchText = (searchtext) => {
       this.props.search_appointment_by_day(searchtext, true);
    }
    render() {
        return (
            <View style={styles.tabHeader}>
                <View style={styles.tabHeaderControlsInline}>
                    {this.state.isSearch == false &&
                    <View style={styles.tabHeaderControlsInline}>
                    <Text
                        style={[
                            styles.ByDateToday,
                            this.state.isToday
                                ? styles.isToday
                                : styles.notToday
                        ]}
                        onPress={() => this._today()}
                    >
                        {getTextByKey(this.props.language,'today')}
                    </Text>
                    <TouchableOpacity
                        style={styles.tabHeaderControlsInlineIconLeft}
                        onPress={() => this.changeDate("prev")}
                        activeOpacity={0.5}
                    >
                        <Icon
                            name={"chevron-left"}
                            size={22}
                            color={color.blackRGB6}
                        />
                    </TouchableOpacity>
                    <Text style={styles.bydaytext}>
                        {this.state.byDayText}
                    </Text>
                    <TouchableOpacity
                        style={styles.tabHeaderControlsInlineIconRight}
                        onPress={() => this.changeDate("next")}
                        activeOpacity={0.5}
                    >
                        <Icon
                            name={"chevron-right"}
                            size={22}
                            color={color.blackRGB6}
                        />
                    </TouchableOpacity>
                    {
                        this.props.isCalendar == true && 
                        <Text
                        style={[
                            styles.searchAppointment,
                            this.state.isToday
                                ? styles.isToday
                                : styles.notToday
                        ]}
                        onPress={() => this.open_input_search()}
                    >
                    <Icon
                            name={"magnify"}
                            size={22}
                            color={color.blackRGB6}
                        />
                    </Text>
                    }
                       
                    </View>
                    }
                    {
                        this.state.isSearch ==  true && 
                        <View style={styles.tabHeaderControlsInline}>
                            <View style={[styles.searchContainer, styles.searchinput]}>
                                <Icon
                                    name={'magnify'}
                                    size={20}
                                    color={color.gray42} style={layout.iconsearchbox}
                                />
                                <TextInput
                                    placeholder="Search ** by name, email, phone" placeholderTextColor={color.gray42}
                                    underlineColorAndroid={'transparent'}
                                    style={layout.searchbox}
                                    onChangeText={(searchtext) => this.changeSearchText(searchtext)}
                                    ref={'searchtextinput'}
                                    clearButtonMode="always"
                                />

                            </View>
                            <Text
                                style={[
                                    styles.searchAppointment,
                                    this.state.isToday
                                        ? styles.isToday
                                        : styles.notToday
                                ]}
                                onPress={() => this.close_input_search()}
                            >
                            <Icon
                                    name={"close"}
                                    size={22}
                                    color={color.blackRGB6}
                                />
                            </Text>
                        </View>
                    }
                    
                  
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabHeader: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder
    },
    tabHeaderControlsInline: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    tabHeaderControlsInlineIconLeft: {
        marginRight: 10,
        marginTop: 2
    },
    tabHeaderControlsInlineIconRight: {
        marginLeft: 10,
        marginTop: 2
    },
    ByDateToday: {
        position: "absolute",
        left: 15
    },
    isToday: {
        color: color.reddish
    },
    notToday: {
        color: color.blackRGB
    },
    searchAppointment: {
        position: "absolute",
        right: 10
    },
    searchinput: {
        width: '90%',
        marginTop: 10
    },
    searchContainer: {
        height:50,
        backgroundColor: color.lightWhite,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:10,
        justifyContent: 'center',
        position: "absolute",
        left:0
    },
});
