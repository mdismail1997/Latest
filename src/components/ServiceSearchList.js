import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Modal, Platform, TextInput, FlatList, SectionList, SafeAreaView } from "react-native";
import ServiceSearchItem from "./ServiceSearchItem";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import { getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class ServiceSearchList extends React.Component {

    state = {
        modalVisible: false,
        showCloseSearchBoxClient: false,
        search:'',
        selected: this.props.selected,
        currentService: this.props.currentService
    }

    services = this.props.data;
    categories = this.props.categories;
    servicelist = [];
    selectedId = 0;
    async UNSAFE_componentWillMount(){
        this.processData('');
        this.setState({rerender: true});
    }

    show = (refdata,id) => {
        this.selectedId = id;
        this.setState({currentService: refdata, modalVisible: true});
    }

    processData = (searchtext) => {
        
        let servicesClone = [...this.services];
        let _this = this;
        this.categories.forEach(function(category){
            let serviceInCategories = servicesClone.filter(function(item){
                if(category != 'Combo'){
                    if(typeof(item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != ''){
                        if(searchtext != ''){
                            return item.category_customname == category && item.service_name.toLowerCase().indexOf(searchtext.toLowerCase()) >= 0;
                        }
                        return item.category_customname == category;
                    }else{
                        if(searchtext != ''){
                            return item.category_name == category && item.service_name.toLowerCase().indexOf(searchtext.toLowerCase()) >= 0;
                        }
                        return item.category_name == category;
                    }
                }else{
                    if(searchtext != ''){
                        return item.isCombo && item.service_name.toLowerCase().indexOf(searchtext.toLowerCase()) >= 0;
                    }
                    return item.isCombo;
                }
            });

            if(serviceInCategories.length){
                serviceData = {};
                serviceData.key = category;
                serviceData.data = serviceInCategories;
                _this.servicelist.push(serviceData);
            }
        });
    }

    close() {
        this.props.onClose();
        this.setState({modalVisible: false});
    }

    getText(key){
        return getTextByKey(this.props.language,key);
    }

    setCurrentService = (id) => {
        this.props.currentService = id;
    }

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (id, name, price,duration,isCombo,rewardpoint) => {
        this.props.onSelected(id, name, price,duration, isCombo, this.state.currentService, rewardpoint);
    };

    _renderItem = ({item}) => {
        return (
            <ServiceSearchItem
                id={item.id}
                onPressItem={this._onPressItem}
                selected={(item.id == this.selectedId)}
                name={item.service_name}
                price={item.price}
                isCombo={item.isCombo}
                duration={item.duration}
                rewardpoint={item.rewardpoint}
            />
        )
    };

    clearSearch = () => {
        this.refs['searchtextinput'].clear();
        this.setState({showCloseSearchBoxClient: false});
        //this.state.search = '';
        this.setState({search: ''});
    }

    changeSearchText = (searchtext) => {
        this.servicelist = [];
        this.processData(searchtext);
        if (String.prototype.trim.call(searchtext) == '') {
            this.setState({showCloseSearchBoxClient: false});
        } else {
            this.setState({showCloseSearchBoxClient: true});
        }
    }

    onDelete = () => {
        this.props.onDelete(this.state.currentService);
    };

    _renderSectionHeader = sectionHeader => {
        return (
            <View>
                <View style={styles.sectionheader}>
                    <View style={styles.sectionheadertext}>
                        <View style={styles.sectionheadertextcontainer}>
                            <Text style={styles.sectionheadertextcontent}>
                                {sectionHeader.section.key}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    render() {
        let serviceidrep = this.selectedId.toString().replace('service_','').replace('combo_','');
        if(serviceidrep != ''){
            serviceidrep = parseInt(serviceidrep);
        }
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
                                <Text style={layout.headertitle}>{this.getText('selectserviceaddappointment')}</Text>
                            </View>
                            {
                                serviceidrep > 0 &&
                                <TouchableOpacity
                                    style={layout.headerNavRightContainer}
                                    activeOpacity={1}
                                    onPress={() => this.onDelete()}
                                >
                                    <View style={layout.headerNavRight}>
                                        <Text style={layout.headerNavText}>
                                        {this.getText('delete')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    </LinearGradient>
                </View>
                <View style={styles.searchContainer}>
                    <View style={[layout.searchContainer]}>
                        <Icon
                            name={'magnify'}
                            size={20}
                            color={color.gray42} style={layout.iconsearchbox}
                        />
                        <TextInput
                            placeholder={this.getText('SearchService')} placeholderTextColor={color.gray42}
                            underlineColorAndroid={'transparent'}
                            style={layout.searchbox}
                            onChangeText={(searchtext) => this.changeSearchText(searchtext)}
                            ref={'searchtextinput'}
                        />

                        {this.state.showCloseSearchBoxClient &&
                        <TouchableOpacity style={layout.iconclosesearchbox} activeOpacity={1}
                                          onPress={() => this.clearSearch()}>
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
                {/*
                    <SectionList
                        data={this.props.data}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        extraData={(this.state )}
                        initialNumToRender={10}
                        renderSectionHeader={this._renderSectionHeader}
                    />
                */}

                    <SectionList
                        ref="sectionService"
                        renderItem={this._renderItem}
                        renderSectionHeader={this._renderSectionHeader}
                        keyExtractor={this._keyExtractor}
                        sections={this.servicelist}
                        //getItemLayout={this._getItemLayout}
                        stickySectionHeadersEnabled={true}
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
    },
    sectionheader: {
        height: 35,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: color.lightWhite
    },
    sectionheadertext: {
        marginLeft: 15,
        flexDirection: "row"
    },
    sectionheadertextcontainer: {
        height: 35,
        justifyContent: "center"
    },
    sectionheadertextcontent: {
        color: color.silver,
        fontSize:16
    },
    searchContainer:{
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder
    }
});
