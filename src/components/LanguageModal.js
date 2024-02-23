import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Modal, Platform, TextInput, FlatList, AsyncStorage, SafeAreaView } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import setting from "../constants/Setting";
import { color } from "../assets/colors/colors";


export default class LanguageModal extends React.Component {

    state = {
        modalVisible: this.props.visible,
    }

    selected = 'en-US';

    close() {
        this.setState({modalVisible: false});
    }

    show = (selectedLanguage) => {
        this.selected = selectedLanguage;
        this.setState({modalVisible: true}); 
    }

    _onPress = (languageName,languageKey) => {
        AsyncStorage.setItem(setting.language,languageKey);
        this.props.onPress(languageName,languageKey);
    }
    
    render() {
        //console.log(this.props.data);
        this.selectedEnglish = this.selected == 'en-US' || this.selected == '';
        this.selectedVietnam = this.selected == 'vi-VN';
        return(
            <Modal
                animationType={"slide"}
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
                                <Text style={layout.headertitle}>Select Language</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                
                <View style={{flex:1}}>
                    <View style={styles.containerItemLang}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onPress('English','en-US')} style={{flex:1}}>
                            <View style={styles.itemContainer}>
                                <Text style={styles.technicianname}>
                                    English
                                </Text>
                                {this.selectedEnglish &&
                                    <Icon
                                        name={'check'}
                                        size={20}
                                        color={color.reddish} 
                                        style={styles.righticon}
                                    />
                                }
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.containerItemLang}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._onPress('Viet Nam','vi-VN')} style={{flex:1}}>
                            <View style={styles.itemContainer}>
                                <Text style={styles.technicianname}>
                                    Viet Nam
                                </Text>
                                {this.selectedVietnam &&
                                    <Icon
                                        name={'check'}
                                        size={20}
                                        color={color.reddish} 
                                        style={styles.righticon}
                                    />
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
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
    },
    containerItemLang: {
        height:50,
        justifyContent: 'center',
        borderBottomColor: color.cream,
        borderBottomWidth: 0.5
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

        paddingLeft:10,
        paddingRight:10,
        position:'relative'
    },
    technicianname:{
        marginLeft:5,
        color: color.gray42,
        fontSize:16
    },
    righticon:{
        position:'absolute',
        right:15,
        color:color.reddish,
        fontSize:16
    }
});
