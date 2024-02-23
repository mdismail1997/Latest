import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Modal, Platform, TextInput, FlatList, SafeAreaView } from "react-native";
import AppointmentTechnicianSearchItem from "./AppointmentTechnicianSearchItem";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import moment from "moment";
import "../helpers/timezone";
import { getUSState2Digit, get_time_zone, getCountry2Digit } from "../helpers/Utils";
import collect from "collect.js";
import { getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class AppointmentTechnicianSearchList extends React.Component {

    state = {
        modalVisible: true,
        showCloseSearchBoxClient: false,
        search:'',
        selected: this.props.selected,
        currentService: this.props.currentService
    }
    turns = this.props.turns;
    data = this.props.data;
    services = this.props.services;

    stateData = getUSState2Digit(this.props.userData.state);
    country = getCountry2Digit(this.props.userData.country);
    timezone = get_time_zone(this.country,this.stateData);
    technicians = [];
    close() {
        this.props.onClose();
        this.setState({modalVisible: false});
    }

    show = (selectServices, appointmentDate, selected, currentService) => {
        this.state.currentService = currentService;
        if(currentService.indexOf("combo") >= 0){
            currentService = currentService.split('@');
            this.state.currentService = currentService[0];
        }
        let currentSelectService = selectServices[this.state.currentService];
        let isCombo = false;
        if(currentSelectService.id.indexOf("combo") >= 0){
            isCombo = true;
        }
        this.getTechnicianValidSkill(currentSelectService);
        this.setState({modalVisible: true});
        
    }

    getTechnicianValidSkill = (currentSelectService,appointmentDate) => {
        let date_now_timezone = moment().tz(this.timezone);
        let _this = this;
        var validTechs = [];
        let serviceDataList = this.services.filter(function(item){
            return item.id == currentSelectService.id;          
        });

        if(serviceDataList.length){
            let serviceData =  serviceDataList[0];
            for(var i = 0; i < this.data.length; i++){
                var techData = this.data[i];
                if(techData.id == 0){
                    validTechs.push(techData);
                }else{
                    let idService = serviceData.id.split('_')[1];
                    let skills = techData.skillsToServices;
                    // console.log(skills);
                    // console.log(idService+ "-" + item.id);
                    // console.log(_this.in_array(idService,skills));
                    //return _this.in_array(idService,skills);

                    //var skills = techData.skills.split(',');
                    if(this.in_array(idService,skills)){
                        validTechs.push(techData);
                    }
                }
                
            }
            //category_name       
        }
        var validTechsTurns = [];
        var sortedTechsTurns = [];
        var techNotCheckedInList = [];
        if(this.props.userData.isManageTurn && moment.tz(appointmentDate,this.timezone).isSame(date_now_timezone,'day')){
            validTechs.forEach(function(itemTech){
                if(itemTech.id == 0){
                    itemTech.turn = 0;
                    itemTech.checkinDate = '1970-01-01 00:00:00';
                    validTechsTurns.push(itemTech);
                }else{
                    var techCheckedInList = _this.turns.filter(function(item){
                        return item.technician_id == itemTech.id;
                    });
                    if(techCheckedInList.length){
                        var techCheckedIn = techCheckedInList[0];
                        if(techCheckedIn.check_out_date == '' || techCheckedIn.check_out_date == null){
                            itemTech.turn = techCheckedIn.TurnCount;
                            itemTech.checkinDate = techCheckedIn.checked_in_date;
                            itemTech.isServing = techCheckedIn.isServing;
                            itemTech.isOnline = 1;
                            validTechsTurns.push(itemTech);
                        }else if(techCheckedIn.check_out_date != '' && techCheckedIn.check_out_date != null){
                            if(moment(techCheckedIn.checked_in_date) > moment(techCheckedIn.check_out_date)){
                                itemTech.turn = techCheckedIn.TurnCount;
                                itemTech.checkinDate = techCheckedIn.checked_in_date;
                                itemTech.isServing = techCheckedIn.isServing;
                                itemTech.isOnline = 1;
                                validTechsTurns.push(itemTech);
                            }
                        }
    
                    }else{
                        itemTech.turn = 0;
                        itemTech.checkinDate = '';
                        itemTech.isServing = 0;
                        itemTech.isOnline = 0;
                        techNotCheckedInList.push(itemTech);
                    }
                }
            });

            validTechsTurns = collect(validTechsTurns);
            
            var techNoneTurnCount = validTechsTurns.where('turn', '=' , 0);
            if(techNoneTurnCount.count()){
                techNoneTurnCount.sortBy('checkinDate').each(function(itemTech){
                    sortedTechsTurns.push(itemTech);
                });
            }
     
            var techHaveTurnCount = validTechsTurns.where('turn', '>' , 0);
            if(techHaveTurnCount.count()){
                let max = techHaveTurnCount.max('turn');
                for(var i = 0.25; i <= max; i = i + 0.25){
                    let techWithTurn = techHaveTurnCount.where('turn', '=' , i);
                    if(typeof(techWithTurn) != 'undefined'){
                        techWithTurn.sortBy('checkinDate').each(function(itemTech){
                            sortedTechsTurns.push(itemTech);
                        });
                    }
                    
                }
            }

            techNotCheckedInList.forEach(function(item){
                sortedTechsTurns.push(item);
            })
            
            this.technicians = sortedTechsTurns;
        }else{
            this.technicians = validTechs;
        }

        
    }
    in_array (needle, haystack, argStrict) { 
        var key = ''
        var strict = !!argStrict
        if (strict) {
            for (key in haystack) {
            if (haystack[key] === needle) {
                return true
            }
            }
        } else {
            for (key in haystack) {
            if (haystack[key] == needle) {
                return true
            }
            }
        }
        return false
    }
    inArray(needle,haystack){
        var count=haystack.length;
        for(var i=0;i<count;i++)
        {
            if(haystack[i]===needle){return true;}
        }
        return false;
    }

    _keyExtractor = (item, index) => item.id + "_technician";

    _onPressItem = (id, name) => {
        // updater functions are preferred for transactional updates
        //console.log(id);

        this.props.onSelected(id,name,this.state.currentService);
        //this.setState({modalVisible: false});
        //this.props.selected = id;
        //this.setState({selected:id});
        //console.log(this.state);
    };

    getText(key){
        return getTextByKey(this.props.language,key);
    }

    _renderItem = ({item}) => {
        //console.log(item.fullname);
        if( (typeof this.state.search == 'undefined' || (this.state.search != 'undefined' && item.fullname.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0)))
        {
            return (
                <AppointmentTechnicianSearchItem
                    id={item.id}
                    onPressItem={this._onPressItem}
                    selected={(item.id == this.state.selected)}
                    name={item.fullname}
                    data={item}
                    userData={this.props.userData}
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
        //this.state.search = searchtext;
        //this.setState({modalVisible: true});
        //this.refs['listtechnician'].props.search = searchtext;
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
