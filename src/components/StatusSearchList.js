import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Modal, Platform, TextInput, FlatList, SafeAreaView } from "react-native";
import StatusSearchItem from "./StatusSearchItem";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import { getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class StatusSearchList extends React.Component {

    state = {
        modalVisible: true,
        showCloseSearchBoxClient: false,
        search:'',
        selected: this.props.selected
    }

    liststatus = {};

    close() {
        this.props.onClose();
        this.setState({modalVisible: false});
    }

    show = () => {
        this.liststatus = {};
        this.setState({modalVisible: true});
    }
    _keyExtractor = (item, index) => item.id;

    _onPressItem = (id, name) => {
        // updater functions are preferred for transactional updates
        //console.log(id);

        this.props.onSelected(id,name);
        //this.setState({modalVisible: false});
        //this.props.selected = id;
        //this.setState({selected:id});
        //console.log(this.state);
    };

    _renderItem = ({item}) => {
        //console.log(item.fullname);
        let statusselected = this.state.selected;
        if(statusselected == 'canceled'){
            statusselected = 'cancelled';
        }
        
        if(typeof(this.liststatus[item.id]) != 'undefined'){
            return false;    
        }else{
           
            this.liststatus[item.id] = true;
            return (
                <StatusSearchItem
                    id={item.id}
                    onPressItem={this._onPressItem}
                    selected={(item.id == this.state.selected)}
                    name={item.title}
                    language={this.props.language}
                />
            )
        }
        

    };

    getText(key){
        return getTextByKey(this.props.language,key);
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
                <SafeAreaView style={{flex:1}}>
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
                                <Text style={layout.headertitle}>{this.getText('selectstatustitle')}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                
                <View style={{flex:1}}>
                    <FlatList
                        data={this.props.data}
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
