import React from "react";
import { StyleSheet, Text, View, TextInput, AsyncStorage, Alert, TouchableOpacity } from "react-native";
import { fetchClientsData } from "../helpers/fetchdata";
import { LinearGradient } from 'expo-linear-gradient';
import { isLogged, jwtToken, getUserData } from "../helpers/authenticate";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import layout from "../assets/styles/layout";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import setting from "../constants/Setting";
// import Router from "../navigation/Router";
import NavigationBarBackground from "../components/navigationBarBG";
import NavigationBarClient from "../components/navigationBarClient";
import SearchCloseIcon from "../components/SearchCloseIcon";
import ClientListTab from "../components/ClientListTab";
import ClientDetails from "../components/ClientDetails";
import AddClient from "../components/AddClient";
import collect from "collect.js";
import { timestamp } from "../helpers/Utils";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { api } from "../api/api";

export default class ClientsScreen extends React.Component {
    componentDidMount() {
        this.props.navigation.setOptions({
            headerTitle: "Clients",
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => this.createClient()}
                    activeOpacity={1}
                    style={layout.headerNavRightContainer}
                >
                    <View style={layout.headerNavLeft}>
                        <Icon
                            name={"account-plus"}
                            size={25}
                            color={"rgba(255,255,255,0.8)"}
                            style={layout.navIcon}
                        />
                    </View>
                </TouchableOpacity>
            ),
        });
      }
    languageKey = typeof(this.props.route.params.language) != 'undefined' ? this.props.route.params.language : 'en-US';
    state = {
        appIsReady: false,
        showCloseSearchBoxClient: false,
        search: "",
        selected: ""
    };
    //languageKey = '';

    async UNSAFE_componentWillMount() {
        //this.languageKey = await getLanguage();

        //this.props.route.params.language = this.languageKey;
        //this.props.route.config.navigationBar.visible = true;
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn) {
            
            this.token = await jwtToken();
            var clients = await fetchClientsData(this.token);
            this.clientsEloquent = collect([...clients]).sortBy('fullname');
            this.clients = this.clientsEloquent.toArray();
            this.userData = await getUserData();
            //this.clientsEloquent = collect([...clients]);
            this.setState({ appIsReady: true });
        }
    }

    createClient = () => {
        this.refs.AddClient.title = "addnewclient";
        this.refs.AddClient.clientData = {};
        this.refs.AddClient.resetData();
        this.refs.AddClient.setState({ modalVisible: true });
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
                    if(item.email == null) item.email = '';
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

    /*
    onEdit = id => {
        this.refs.clientdetails.isRefresh = true;
        let data = this.clientsEloquent.first(function(item) {
            return item.id == id;
        });
        data.month = "";
        data.day = "";
        if (String.prototype.trim.call(data.birthdate) != "") {
            if (data.birthdate.indexOf("/") >= 0) {
                let birthdate = data.birthdate.split("/");
                if (birthdate.length > 1) {
                    data.month = birthdate[0];
                    data.day = birthdate[1];
                }
            }
        }
        if (String.prototype.trim.call(data.phone) != "") {
            data.phone = data.phone
                .replace(/[^\d]+/g, "")
                .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        }
        this.refs.AddClient.title = "Update Client";
        this.refs.AddClient.clientData = data;
        this.refs.AddClient.setState({ modalVisible: true });
    };*/

    refresh = () => {
        this.refs.ClientListTab.setState({ extra: timestamp(true) });
    }

    SaveClientSuccess = (id, data) => {
        
        let clientDataFormat = {};
        clientDataFormat.id = data.id;
        clientDataFormat.firstname = data.firstname;
        clientDataFormat.lastname = data.lastname;
        clientDataFormat.fullname = data.fullname;
        clientDataFormat.email = data.email;
        clientDataFormat.phone = data.phone;
        clientDataFormat.birthdate = data.birthdate;
        clientDataFormat.is_vip = data.is_vip;
        clientDataFormat.status = data.status;

        if (id == 0) {
            this.refs.AddClient.close();
            this.clientsEloquent = this.clientsEloquent.push(clientDataFormat).sortBy('fullname');
            this.clients = this.clientsEloquent.toArray();
            this.refs.ClientListTab.data = this.clients;
            this.refs.ClientListTab.setState({ extra: timestamp(true) });
   
            AsyncStorage.setItem('list-client', JSON.stringify(this.clients));
        } else {
            this.clientsEloquent = this.clientsEloquent.reject(function(item) {
                return item.id == id;
            });
            this.clientsEloquent = this.clientsEloquent.push(clientDataFormat).sortBy('fullname');
            this.clients = this.clientsEloquent.toArray();
            AsyncStorage.setItem('list-client', JSON.stringify(this.clients));
            this.refs.ClientListTab.data = this.clients;

            this.refs.clientdetails.clientData = clientDataFormat;
            this.refs.clientdetails.setState({ modalVisible: true });
        }
    };

    refreshClients = async (search) => {
        var clientList = await fetch(setting.apiUrl + api.getClients, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.token,
            }
        }).then((response) => response.json()).then((responseJson) => {

            if (responseJson.success) {
                AsyncStorage.setItem('list-client', JSON.stringify(responseJson.data));
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
                            color={"#6b6b6b"}
                            style={layout.iconsearchbox}
                        />
                        <TextInput
                            placeholder={this.getText('clientsearchbyphonenameemail')}
                            placeholderTextColor="#6b6b6b"
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
                        <ClientListTab
                            data={this.clients}
                            ref="ClientListTab"
                            onPress={this.onPressClient}
                            userData={this.userData}
                            refresh={async (search) => { await this.refreshClients(search) }}
                        />
                    </View>

                    <ClientDetails
                        visible={false}
                        ref="clientdetails"     
                        refresh={this.refresh}
                        SaveClientSuccess={this.SaveClientSuccess}
                        token={this.token}
                        language={this.languageKey}
                    />
                    <AddClient
                        visible={false}
                        ref="AddClient"
                        token={this.token}
                        SaveClientSuccess={this.SaveClientSuccess}
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
        backgroundColor: "#f2f2f2"
    }
});
