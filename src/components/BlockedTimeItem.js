import React from "react";
import { StyleSheet, Text, View, TouchableOpacity,Alert } from "react-native";
import moment from "moment";
import { getStatus, getStatusColor, getUSState2Digit, get_time_zone, getCountry2Digit } from "../helpers/Utils";
import Swipeable from 'react-native-swipeable';
//import layout from "../assets/styles/layout";
import "../helpers/timezone";
import SubmitLoader from "../helpers/submitloader";
import layout from "../assets/styles/layout";
import IconLoader from "../helpers/iconloaderlongtext";
import Colors from "../constants/Colors";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class BlockedTimeItem extends React.Component {
    stateData = getUSState2Digit(this.props.userData.state);
    country = getCountry2Digit(this.props.userData.country);
    timezone = get_time_zone(this.country,this.stateData);
    isDone = false;
    data = this.props.data;
    rightbtntext = 'Check Out';
    isCheckOut = true;
    SwipeableRef = '';
    _onPress = () => {
        if(this.props.isEdit){
            this.props.onPressItem(this.props.id);
        }else{
            this.props.onViewItem(this.props.id);
        }
        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.data = nextProps.data;
        //console.log(this.data);    
        //this.state = { visible: this.props.visible, textContent: this.props.textContent };
    }

    onPressRightButton  = (data) => {
        if(this.isCheckOut){
            this.checkOut(data);
        }else{
            this.start(data);
        }
    }
    render() {
        let childcontent = (
            <View style={{flex:1}}>
                {this.props.id > 0 &&
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ flex: 1 }}
                        onPress={this._onPress}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={styles.itemrowTop}>
                                <Text style={styles.itemTopLeft}>
                                   {moment(this.data.start_time).format(
                                        "MM-DD-YYYY hh:mm A"
                                    )}
                                </Text>
                                <Text style={styles.itemTopRight}>
                                    {this.data.fullname} - {this.data.mobile}
                                </Text>
                            </View>
                            <View style={styles.itemrowBottom}>
                                <Text style={[styles.itemTopLeft]}>
                                {moment(this.data.end_time).format(
                                        "MM-DD-YYYY hh:mm A"
                                    )}
                                </Text>
                                <Text style={styles.itemBottomRight}>
                                   {this.data.title}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>}
                {this.props.id == 0 &&
                    <View style={styles.sectionheaderempty}>
                        <Text style={styles.sectionheaderemptytext}>
                            {getTextByKey(this.props.language,'noblockedtime')}
                        </Text>
                    </View>}
            </View>
        )

        return (
            <View style={styles.itemContainer}>
                {childcontent}
                <SubmitLoader
                    ref="appointmentLoader"
                    visible={false}
                    textStyle={layout.textLoaderScreenSubmit}
                    textContent={"Processing..."}
                    color={Colors.spinnerLoaderColorSubmit}
                />    
                <IconLoader
                    ref="appointmentSuccessLoader"
                    visible={false}
                    textStyle={layout.textLoaderScreenSubmitSucccess}
                    textContent={"Checked Out"}
                    color={Colors.spinnerLoaderColorSubmit}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    checkoutbtn:{
        height: 70,
        backgroundColor: color.reddish,
        justifyContent:'center',
        paddingRight:10,
        position:'absolute',
        alignItems: "center",
        width:100
      
    },
    checkoutbtnText:{
        color: color.white
    },
    itemContainer: {
        height: 70,
        borderBottomColor: color.cream,
        borderBottomWidth: 0.5
    },
    itemrowTop: {
        flex: 1,
        flexDirection: "row",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: 35,
        alignItems: "center",
        paddingTop: 8
    },
    itemrowBottom: {
        flex: 1,
        flexDirection: "row",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: 35,
        alignItems: "center",
        paddingBottom: 8
    },
    itemTopLeft: {
        paddingLeft: 15,
        width: 200
    },
    itemBottomLeft: {
        paddingLeft: 15,
        width: 200,
        color: color.silver
    },
    itemTopRight: {
        //paddingLeft:15
    },
    itemBottomRight: {
        color: color.silver
        // paddingLeft:15
    },
    sectionheaderempty: {
        paddingLeft: 15,
        justifyContent: "center",
        flex: 1
    },
    sectionheaderemptytext: {
        color: color.silver
    },
    checkouticon:{
        position:'absolute',
        top:25,
        right:15
    }
});
