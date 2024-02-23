import React from "react";
import { StyleSheet, Text, View, TextInput, AsyncStorage, Alert, TouchableOpacity, ActivityIndicator,FlatList, RefreshControl } from "react-native";
import { fetchClientsData } from "../helpers/fetchdata";
import { LinearGradient } from 'expo-linear-gradient';
import { isLogged, jwtToken, getUserData } from "../helpers/authenticate";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import layout from "../assets/styles/layout";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import SearchCloseIcon from "../components/SearchCloseIcon";
import ClientDetails from "../components/ClientDetails";
import AddClient from "../components/AddClient";
import collect from "collect.js";
import { timestamp } from "../helpers/Utils";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { ListItem, Avatar, SearchBar } from "react-native-elements";
import {fetchClientsDataByID} from '../api/fetchdata';
import { formatPhone } from "../helpers/Utils";
import { color } from "../assets/colors/colors";
export default class ClientsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.page = 1;
        this.state = {
          loading: false,
          isRefreshing: false,
          data: [],
          error: null,
          search: '',
          searchText: '',
          endDataSalon: false,
          showMore: true,
          search_old:''
        },
        this.timeout =  0;
      }
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
                        <Icons
                            name={"account-plus"}
                            size={25}
                            color={color.whiteRGB}
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
    async UNSAFE_componentWillMount() {
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn) {
            this.token = await jwtToken();
            // var clients = await fetchClientsData(this.token);
            // this.clientsEloquent = collect([...clients]).sortBy('fullname');
            // this.clients = this.clientsEloquent.toArray();
            // this.userData = await getUserData();
            this.makeRemoteRequest(this.page, '', this.state.endDataSalon);
            this.setState({ appIsReady: true });
        }
    }

    createClient = () => {
        this.refs.AddClient.title = "addnewclient";
        this.refs.AddClient.clientData = {};
        this.refs.AddClient.resetData();
        this.refs.AddClient.setState({ modalVisible: true });
    };

    onPressClient = (clientData) => {
        this.refs.clientdetails.isRefresh = false;
        this.refs.clientdetails.clientData = clientData;
        this.refs.clientdetails.setState({ modalVisible: true });
    };
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

        clientDataFormat.OptOutMAIL = data.OptOutMAIL;
        clientDataFormat.OptOutSMS = data.OptOutSMS;
        clientDataFormat.reward_point = data.reward_point;
        clientDataFormat.gift = data.gift;
        if (id == 0) {
            this.refs.AddClient.close();
            let listData = this.state.data;
            listData.unshift(clientDataFormat);
             this.setState({ loading: false, data: listData });
        } else {
            let listData = this.state.data;
            listData = listData.filter(function(item) {
                return item.id != id;
            });
            listData.unshift(clientDataFormat);
            this.setState({ loading: false, data: listData });
            this.refs.clientdetails.clientData = clientDataFormat;
            this.refs.clientdetails.setState({ modalVisible: true });
        }
    };

    getText(key){
        return getTextByKey(this.languageKey,key);
    }
        onScroll = () => {
            this.setState({hasScrolled: true})
        }
       makeRemoteRequest = async (page,search = '', endDataSalonP) => {
        if(endDataSalonP) return true;
        this.setState({ loading: true, searchText:search });
        this.get_data_client(page, search);
      };
    
      renderSeparator = () => {
        return (
          <View
            style={{
              height: 2,
              width: '100%',
              backgroundColor: '#CED0CE'
            }}
          />
        );
      };
      
      updateSearch = async(value) => {
        let value_default = value;
        value = String.prototype.trim.call(value);
        value = value.replace('(','');
        value = value.replace(')','');
        value = value.replace(' ','');
        value = value.replace('-','');
        let isphone = false;
        if(value.length >= 3 && !isNaN(value)){
            let formatValue = formatPhone(value);
            this.setState({ loading: true, searchText:formatValue });
            value = formatValue.replace(/[^\d]+/g, '');
            isphone = true;
        }else{
            this.setState({ loading: true, searchText:value_default });
        }
        this.page = 1;

        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = await setTimeout(() => {
            let value_search = value_default;
            if(isphone){
                value_search = value;
            }
            this.get_data_client(this.page, value_search);
        }, 800);
      };

      get_data_client = async(page, search) =>{
        let data = {
            page: page,
            search: search,
            take: 20,
            checkin:'checkin'
        }
        let result = await fetchClientsDataByID(data, this.token);
        let endDataSalon = false ;
        if(result.length == 0){
          endDataSalon = true;
        }else endDataSalon = false;
        let showMore =true;
        if(result.length < 20) showMore =false;
        let listData = this.state.data;
        let data_concat = listData.concat(result);
        if(search != this.state.search_old){
            data_concat = result;
            this.setState({ search_old:search});
        }
        this.setState({ loading: false, data: data_concat, endDataSalon: endDataSalon, showMore: showMore });

      }
      renderHeader = () => {
        return <SearchBar 
        inputContainerStyle={{height:40}}
        placeholder="Search your client here..." onChangeText={this.updateSearch} value={this.state.searchText} />;
        
      };
      handleLoadMore = () => {
        if (!this.state.loading && this.state.showMore) {
          this.page = this.page + 1;
          this.makeRemoteRequest(this.page, this.state.searchText, this.state.endDataSalon);
        }
      };
      renderFooter = () => {
        if (!this.state.loading) return null;
        return (
          <ActivityIndicator
            style={{ backgroundColor:'white',color: '#333', height: 30 }}
          />
        );
      };
      onRefresh() {
    //   this.refs.flatListRef.scrollToOffset({ animated: true, offset: 0 });
      }

    render() {
        if (this.state.appIsReady) {
            return (
                <View style={styles.container}>
                    <View style={styles.clientlist}>
                    <FlatList
                        ref="flatListRef"
                        data={this.state.data}
                        extraData={this.state}
                        refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                        }
                        renderItem={({ item, index }) => (
                        <ListItem  
                        activeOpacity={1} underlayColor="#DDDDDD" 
                        onPress={()=> this.onPressClient(item)} topDivider={false} bottomDivider={false} 
                        containerStyle={{marginTop:7.5,marginBottom:7.5, marginLeft:10, marginRight:10,  borderRadius:10, borderBottomWidth: 0, borderTopWidth: 0, backgroundColor:color.darkCyan}}>
                            <ListItem.Content>
                                <ListItem.Title style={{ color: 'white', fontWeight: 'bold' }}>{item.fullname}</ListItem.Title>
                            <ListItem.Subtitle style={{ color: 'white' }}>{item.email}</ListItem.Subtitle>
                            <ListItem.Subtitle style={{ color: 'white' }}>{item.phone}</ListItem.Subtitle>
                            </ListItem.Content>
                            <Icons name='chevron-right' />
                            </ListItem>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        // ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        stickyHeaderIndices={[0]}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={0}
                    />
                    </View>

                    <ClientDetails
                        visible={false}
                        ref="clientdetails"     
                        refresh={this.onRefresh}
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
        backgroundColor: color.lightWhite
    }
});
