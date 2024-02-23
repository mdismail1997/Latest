import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Modal, Platform, TextInput, FlatList, SafeAreaView } from "react-native";
import BlockedTimeTechnicianSearchItem from "./BlockedTimeTechnicianSearchItem";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import moment from "moment";
import "../helpers/timezone";
import { getUSState2Digit, get_time_zone } from "../helpers/Utils";
import collect from "collect.js";
import { getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class BlockedTimeTechnician extends React.Component {

    state = {
        modalVisible: true,
        showCloseSearchBoxClient: false,
        search:'',
        selected: this.props.selected,
    }
    technicians = this.props.data;
    close() {
        this.props.onClose();
        this.setState({modalVisible: false});
    }

    show = (techid) => {
        this.setState({modalVisible: true});
    }

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (id, name) => {
        this.props.onSelected(id,name);
    };

    getText(key){
        return getTextByKey(this.props.language,key);
    }

    _renderItem = ({item}) => {
        if( (typeof this.state.search == 'undefined' || (this.state.search != 'undefined' && item.fullname.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0)))
        {
            return (
                <BlockedTimeTechnicianSearchItem
                    id={item.id}
                    onPressItem={this._onPressItem}
                    selected={(item.id == this.state.selected)}
                    name={item.fullname}
                    data={item}
                />
            )
        }

    };

    clearSearchClient = () => {
        this.refs['searchtextinput'].clear();
        this.setState({showCloseSearchBoxClient: false});
        //this.state.search = '';
        this.setState({search: ''});
    }

    changeSearchTextClient = (searchtext) => {
        if (String.prototype.trim.call(searchtext) == '') {
            this.setState({showCloseSearchBoxClient: false});
        } else {
            this.setState({showCloseSearchBoxClient: true});
        }
        //console.log(searchtext);
        this.setState({search: searchtext});
    }

    render() {
        //console.log(this.props.data);
        return(
            <Modal
                animationType={"none"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}

            >
                <SafeAreaView style={{flex: 1}}>
                <View style={(Platform.OS === 'android' ? layout.headercontainerAndroid : layout.headercontainer )}>
                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]}
                                    style={( Platform.OS === 'android' ? layout.headerAndroid : layout.header)}>
                        <View style={layout.headercontrols}>
                            <TouchableOpacity style={layout.headerNavLeftContainer} activeOpacity={1}
                                              onPress={() => this.close()}>
                                <View style={layout.headerNavLeft}>
                                    <Icon
                                        name={'close'}
                                        size={20}
                                        color={color.whiteRBG1} style={(Platform.OS === 'android' ? layout.navIcon : layout.navIconIOS)}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={layout.headertitle}>{this.getText('selecttechnicianappointmentsearch')}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                <View >
                    <View style={layout.searchContainer}>
                        <Icon
                            name={'magnify'}
                            size={20}
                            color={color.gray42} style={layout.iconsearchbox}
                        />
                        <TextInput
                            placeholder={this.getText('selecttechnicianappointmentsearchtxt')} placeholderTextColor={color.gray42}
                            underlineColorAndroid={'transparent'}
                            style={layout.searchbox}
                            onChangeText={(searchtext) => this.changeSearchTextClient(searchtext)}
                            ref={'searchtextinput'}
                        />

                        {this.state.showCloseSearchBoxClient &&
                        <TouchableOpacity style={layout.iconclosesearchbox} activeOpacity={1}
                                          onPress={() => this.clearSearchClient()}>
                            <Icon
                                name={'close-circle-outline'}
                                size={20}
                                color={color.gray42}
                            />
                        </TouchableOpacity>
                        }


                    </View>
                </View>
                <View style={{flex:1}}>
                    <FlatList
                        data={this.technicians}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        extraData={(this.state )}
                        initialNumToRender={10}
                    />
                </View>
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
