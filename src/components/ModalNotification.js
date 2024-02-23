import React from "react";
import { StyleSheet ,Text, View, Modal, TouchableOpacity, Platform, ScrollView, FlatList, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import layout from "../assets/styles/layout";
import { getTextByKey } from "../helpers/language";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import { fetchNotification } from "../helpers/fetchdata";
import setting from "../constants/Setting";
import { color } from "../assets/colors/colors";
import { api } from "../api/api";

export default class ModalNotification extends React.Component {
    state = {
        modalVisible: false,
        showLoader: false,
        styleAnimation: 'slide'
    }

    data = [];

    close() {
        this.setState({modalVisible: false});
    }

    show = () => {
        this.setState({styleAnimation : 'slide',showLoader: true,modalVisible: true});
        fetchNotification('list',this.props.token,this.callbackGetNotification);
    }
    clear = () => {
        this.setState({styleAnimation : 'slide',showLoader: true,modalVisible: true});
        fetchNotification('clearAll',this.props.token,this.callbackGetNotification);
    }
    callbackGetNotification = (data) => {
        this.data = data;
        Notifications.setBadgeCountAsync(0);
        this.setState({showLoader: false});
    }

    _keyExtractor = (item, index) => item.key.toString();

    getText(key){
        return getTextByKey(this.props.language,key);
    }

    onPress = (id,notificationid) => {
        this.setState({styleAnimation : 'none'});
        let _this = this;
        setTimeout(() => {
            _this.close();
            _this.props.onPress(notificationid);

            fetch(setting.apiUrl + api.notificationMarkAsRead + id, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + _this.props.token
                }
            })
            .catch(error => {
                console.error(error);
            });
        },1)        
    }

    _renderItem = ({item}) => {
        let itemStyle = item.isRead ? styles.itemRead : styles.item;    
        return(
            <View key={item.key} style={styles.itemContainer}>
                <Text onPress={() => {this.onPress(item.key,item.notification_id)}} style={itemStyle}><Text style={styles.itemTitle}>{item.title}</Text>{item.description}</Text>
            </View>
        )
    };

    render() {
        return(
            <Modal
                animationType={this.state.styleAnimation}
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
                                <Text style={layout.headertitle}>{this.getText('notification')}</Text>
                            </View>
                            <TouchableOpacity
                                            style={
                                                layout.headerNavRightContainer
                                            }
                                            activeOpacity={1}
                                            onPress={() => this.clear()}
                                        >
                                            <View style={layout.headerNavRight}>
                                                <Text
                                                    style={layout.headerNavText}
                                                >
                                                    {this.getText('clear')}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                <View style={{flex:1}}>
                    { !this.state.showLoader &&
                        <FlatList
                            data={this.data}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                        />
                    }
                    
                    <SpinnerLoader
                        visible={this.state.showLoader}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={color.white}
                        textContent={this.getText('loading')}
                        color={Colors.spinnerLoaderColor}
                        ref="loader"
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
        alignItems: 'center',
        backgroundColor: color.lightWhite,
    },
    item:{
        backgroundColor:'#edf2fa',
        borderWidth: 0.5,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#dddfe2',
        paddingLeft:15,
        paddingTop:10,
        paddingRight:15,
        paddingBottom:10,
        color:'#545454',
        fontSize:16
    },
    itemRead:{
        backgroundColor:color.white,
        borderWidth: 0.5,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#dddfe2',
        color:'#545454',
        paddingLeft:15,
        paddingTop:10,
        paddingRight:15,
        paddingBottom:10,
        fontSize:16
    },
    itemTitle:{
        fontWeight:'bold',
        color: color.black
    }
});
