import React from "react";
import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTechniciansData, fetchServices, fetchGetCommissionTachnician } from "../helpers/fetchdata";
import { LinearGradient } from 'expo-linear-gradient';
import { isLogged, jwtToken, getUserData } from "../helpers/authenticate";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import layout from "../assets/styles/layout";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import setting from "../constants/Setting";
// import Router from "../navigation/Router";
import NavigationBarBackground from "../components/navigationBarBG";
import NavigationBarStaff from "../components/navigationBarStaff";
import SearchCloseIcon from "../components/SearchCloseIcon";
import StaffListTab from "../components/StaffListTab";
import StaffDetails from "../components/StaffDetails";
import CommissionTechnician from "../components/commissionTechnician";
import collect from "collect.js";
import { timestamp } from "../helpers/Utils";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";
import { api } from "../api/api";

export default class StaffScreen extends React.Component {
    constructor(props) {
        super(props);
        this.props.route.params.onCreate = this.commissionTechnicianFC;
    }
    languageKey = typeof(this.props.route.params.language) != 'undefined' ? this.props.route.params.language : 'en-US';
    state = {
        appIsReady: false,
        showCloseSearchBoxClient: false,
        search: "",
        selected: ""
    };
    async UNSAFE_componentWillMount() {
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn) {
            this.token = await jwtToken();
            var clients = await fetchTechniciansData(this.token);
            this.services = await fetchServices(this.token);
            this.clientsEloquent = collect([...clients]).sortBy('fullname');
            this.clients = this.clientsEloquent.toArray();
            this.userData = await getUserData();
            this.setState({ appIsReady: true });
        }
    }
    commissionTechnicianFC = () => {

    };

    clearSearchClient = () => {
        this.refs["searchtextinput"].clear();
        this.refs.SearchCloseIcon.setState({ visible: false });
        //this.setState({showCloseSearchBoxClient: false});
        this.refs.ClientListTab.data = this.clients;
        this.refs.ClientListTab.setState({ search: "" });
    };

    changeSearchTextClient = searchtext => {
        let value = searchtext;
        value = String.prototype.trim.call(value);
        value = value.replace('(','');
        value = value.replace(')','');
        value = value.replace(' ','');
        value = value.replace('-','');

        let results = [];
        if (String.prototype.trim.call(searchtext) == "") {
            //this.setState({showCloseSearchBoxClient: false});
            this.refs.SearchCloseIcon.setState({ visible: false });
            results = this.clients;
        } else {
            //this.setState({showCloseSearchBoxClient: true});
            this.refs.SearchCloseIcon.setState({ visible: true });
            results = this.clientsEloquent
                .filter(function(item) {
                    let phone = '';
                    if (typeof item.phone != 'undefined' && item.phone != '' && item.phone != null) {
                        phone = item.phone.replace(/[^\d]+/g, '');
                    }
                    return phone.indexOf(value) >= 0 || item.email.toLowerCase().indexOf(value.toString().toLowerCase()) >= 0 || 
                            item.fullname.toLowerCase().indexOf(value.toLowerCase()) >= 0;

                    /*        
                    return (
                        item.fullname
                            .toLowerCase()
                            .indexOf(searchtext.toLowerCase()) >= 0
                    );*/
                })
                .toArray();
        }

        this.refs.ClientListTab.data = results;
        this.refs.ClientListTab.setState({ search: searchtext, isRefresh: false });
    };

    onPressClient = (id, name) => {
        
        let clientData = this.clientsEloquent.first(function(item) {
            return item.id == id;
        });
        this.refs.clientdetails.isRefresh = false;
        this.refs.clientdetails.clientData = clientData;
        this.refs.clientdetails.setState({ modalVisible: true });
    };
   async onPresscCommission(id, name){
        let tech = await fetchGetCommissionTachnician(this.token, id);
        this.refs.commissionTechnician.title = name;
        this.refs.commissionTechnician.commission = tech;
        this.refs.commissionTechnician.techid = id;
        this.refs.commissionTechnician.setState({ modalVisible: true, appIsReady: true});
    }
    refresh = () => {
        this.refs.ClientListTab.setState({ extra: timestamp(true) });
    }

    SaveClientSuccess = (id, data) => {
        let clientDataFormat = {};
        clientDataFormat = data;
        if (id == 0) {
            this.refs.AddClient.close();
            this.clientsEloquent = this.clientsEloquent.push(clientDataFormat).sortBy('fullname');
            this.clients = this.clientsEloquent.toArray();
            this.refs.ClientListTab.data = this.clients;
            this.refs.ClientListTab.setState({ extra: timestamp(true) });
            AsyncStorage.setItem('list-technician_' + this.userData.id, JSON.stringify(this.clients));
        } else {
            this.clientsEloquent = this.clientsEloquent.reject(function(item) {
                return item.id == id;
            });
            this.clientsEloquent = this.clientsEloquent.push(clientDataFormat).sortBy('fullname');
            this.clients = this.clientsEloquent.toArray();
            AsyncStorage.setItem('list-technician_' + this.userData.id, JSON.stringify(this.clients));
            this.refs.ClientListTab.data = this.clients;

            this.refs.clientdetails.clientData = clientDataFormat;
            this.refs.clientdetails.setState({ modalVisible: true });
        }
    };

    refreshClients = async (search) => {
        var clientList = await fetch(setting.apiUrl + api.get_Technician, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.token,
            }
        }).then((response) => response.json()).then((responseJson) => {

            if (responseJson.success) {
                AsyncStorage.setItem('list-technician_' + this.userData.id, JSON.stringify(responseJson.data));
                return responseJson.data;
            } else {
                Alert.alert('Error', responseJson.message);
                return [];
            }
        }).catch((error) => {
            return [];
        });
        
        if(clientList.length){
            this.clients = clientList;
            this.clientsEloquent = collect([...clientList]).sortBy('fullname'); ;
        }

        this.changeSearchTextClient(search);
    }

    getText(key){
        return getTextByKey(this.languageKey,key);
    }

    render() {
        if (this.state.appIsReady) {
            return (
                <View style={styles.container}>
                    <View style={layout.searchContainer}>
                        <Icon
                            name={"magnify"}
                            size={20}
                            color={color.gray42}
                            style={layout.iconsearchbox}
                        />
                        <TextInput
                            placeholder={this.getText('clientsearchbyphonenameemail')}
                            placeholderTextColor={color.gray42}
                            underlineColorAndroid={"transparent"}
                            style={layout.searchbox}
                            onChangeText={searchtext =>
                                this.changeSearchTextClient(searchtext)}
                            ref={"searchtextinput"}
                        />

                        <SearchCloseIcon
                            visible={false}
                            onPress={this.clearSearchClient}
                            ref="SearchCloseIcon"
                        />
                    </View>
                    <View style={styles.clientlist}>
                        <StaffListTab
                            data={this.clients}
                            ref="ClientListTab"
                            onPress={this.onPressClient}
                            onPressItemCommission = {async (id, name)=> {await this.onPresscCommission(id , name)}}
                            userData={this.userData}
                            refresh={async (search) => { await this.refreshClients(search) }}
                        />
                    </View>

                    <StaffDetails
                        visible={false}
                        ref="clientdetails"     
                        refresh={this.refresh}
                        SaveClientSuccess={this.SaveClientSuccess}
                        token={this.token}
                        language={this.languageKey}
                        services= {this.services}
                    />
                    
                    <CommissionTechnician
                        visible={false}
                        ref="commissionTechnician"
                        token={this.token}
                        language={this.languageKey}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <SpinnerLoader
                        visible={true}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={"transparent"}
                        textContent={"Loading..."}
                        color={Colors.spinnerLoaderColor}
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    clientlist: {
        flex: 1,
        backgroundColor: color.lightWhite
    }
});
