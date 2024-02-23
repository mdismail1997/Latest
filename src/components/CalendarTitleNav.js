import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Platform,
    TextInput,
    Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import TechnicianSearchList from "./TechnicianSearchList";

import {
    getUserData
} from "../helpers/authenticate";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class CalendarTitleNav extends React.Component {
    state = {
        modalVisible: false,
        showCloseSearchBox: false,
        technicianSelected: 0,
        technicianFilterName: getTextByKey(this.props.language,"anytechnav")
    };

    //userdata = this.props.userdata;
    userdata = {
        role:0
    };
    close() {
        this.setState({ modalVisible: false });
        //Alert.alert('Error', 'Please enter password');
    }

    showListTechnician = () => {
        if (this.state.modalVisible) {
                this.setState({ modalVisible: false });
            } else this.setState({ modalVisible: true });
    };

    changeSearchText = searchtext => {
        if (String.prototype.trim.call(searchtext) == "") {
            this.setState({ showCloseSearchBox: false });
        } else {
            this.setState({ showCloseSearchBox: true });
        }
        this.searchtext = searchtext;
        this.refs["listtechnician"].props.search = searchtext;
    };

    clearSearch = () => {
        this.refs["searchtextinput"].clear();
        this.setState({ showCloseSearchBox: false });
        this.searchtext = "";
    };

    _onSelectedTechnician = (id, name) => {
        //console.log(name);
        this.props.onSelectTechnician(id);
        //this.setState({technicianSelected: id});
        this.setState({
            technicianSelected: id,
            technicianFilterName: name,
            modalVisible: false
        });
    };

    _onRefreshAppointment = () => {
        this.props.onRefreshAppointment();
    }

    _onPressNotificationAppointment = () => {
        this.props.onPressNotificationAppointment();
    }

    async UNSAFE_componentWillMount(){
        this.userdata = await getUserData();
         //console.log(this.props.badge);
    }

    render() {
    
        return (
            <View style={styles.container}>
                
                <TouchableOpacity
                    activeOpacity={1}
                    style={layout.headerNavLeftContainer}
                    onPress={() => this._onPressNotificationAppointment()}
                >
                    <View style={layout.headerNavLeft}>
                        <Icon
                            name={"bell-outline"}
                            size={25}
                            color={color.whiteRGB}
                            style={layout.navIcon}
                        />
                        {this.props.badge > 0 && 
                            <View style={styles.badgecontainer}>
                                <Text style={styles.badgetext}>{this.props.badge}</Text>
                            </View>
                        }
                        
                    </View>
                </TouchableOpacity>
                           
                <TouchableOpacity
                    onPress={() => this.showListTechnician()}
                    activeOpacity={1}
                >
                    <View style={layout.navContainer}>
                        {typeof this.userdata != "undefined" &&
                            this.userdata.role == 4 &&
                            <Text style={layout.navTitleText}>
                                {this.state.technicianFilterName}
                            </Text>}
                        {typeof this.userdata != "undefined" &&
                            this.userdata.role == 4 &&
                            <Icon
                                name={"menu-down"}
                                size={20}
                                color={color.whiteRGB05}
                                style={layout.navIcon}
                            />}
                        {typeof this.userdata != "undefined" &&
                            this.userdata.role == 9 &&
                            <Text style={layout.navTitleText}>
                                Appointments
                            </Text>}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => this._onRefreshAppointment()}
                    activeOpacity={1}
                    style={layout.headerNavRightContainer}
                >
                    <View style={layout.headerNavLeft}>
                        <Icon
                            name={"refresh"}
                            size={25}
                            color={color.whiteRGB}
                            style={layout.navIcon}
                        />
                    </View>
                </TouchableOpacity>

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.close()}
                >
                    <View
                        style={
                            Platform.OS === "android"
                                ? layout.headercontainerAndroid
                                : layout.headercontainer
                        }
                    >
                        <LinearGradient
                            start={[0, 0]}
                            end={[1, 0]}
                            colors={[color.reddish, color.reddish]}
                            style={
                                Platform.OS === "android"
                                    ? layout.headerAndroid
                                    : layout.header
                            }
                        >
                            <View style={layout.headercontrols}>
                                <TouchableOpacity
                                    style={layout.headerNavLeftContainer}
                                    activeOpacity={1}
                                    onPress={() => this.close()}
                                >
                                    <View style={layout.headerNavLeft}>
                                        <Icon
                                            name={"close"}
                                            size={30}
                                            color={color.whiteRBG1}
                                            style={
                                                Platform.OS === "android"
                                                    ? layout.navIcon
                                                    : layout.navIconIOS
                                            }
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Text style={layout.headertitle}>
                                        {getTextByKey(this.props.language,'selecttechnician')}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                    <View>
                        <View style={layout.searchContainer}>
                            <Icon
                                name={"magnify"}
                                size={20}
                                color={color.gray42}
                                style={layout.iconsearchbox}
                            />
                            <TextInput
                                placeholder={getTextByKey(this.props.language,'SearchTechnician')}
                                placeholderTextColor={color.gray42}
                                underlineColorAndroid={"transparent"}
                                style={layout.searchbox}
                                onChangeText={searchtext =>
                                    this.changeSearchText(searchtext)}
                                ref={"searchtextinput"}
                            />

                            {this.state.showCloseSearchBox &&
                                <TouchableOpacity
                                    style={layout.iconclosesearchbox}
                                    activeOpacity={1}
                                    onPress={() => this.clearSearch()}
                                >
                                    <Icon
                                        name={"close-circle-outline"}
                                        size={20}
                                        color={color.gray42}
                                    />
                                </TouchableOpacity>}
                        </View>
                    </View>
                    <View style={layout.listviewcontainer}>
                        <View style={layout.listview}>
                            <TechnicianSearchList
                                data={this.props.technicianList}
                                selected={this.state.technicianSelected}
                                search={this.searchtext}
                                onSelectedTechnician={
                                    this._onSelectedTechnician
                                }
                                ref={"listtechnician"}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    navContainerLeft:{
        position:'absolute',
        left:0
    },
    badgecontainer: {
        position:'absolute',
        right:-8,
        top:2,
        width:20,
        height:20,
        backgroundColor: color.white,
        borderRadius:18,
        justifyContent: "center",
        alignItems: "center",
        zIndex:100
    },
    badgetext:{
        color:color.reddish,
        fontSize:14,
        fontWeight:'bold'
    }
});
