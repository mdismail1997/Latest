import React from "react";
import {
    StyleSheet, Text, TouchableOpacity, View, Modal, AsyncStorage, TextInput, FlatList, SectionList
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NavigationBarBackground from "../components/navigationBarBG";
import NavigationBarStaff from "../components/navigationBarStaff";
import ServiceSearchItem from "../components/ServiceSearchItem";
import { getTextByKey } from "../helpers/language";
import layout from "../assets/styles/layout";
import {
    isLogged,
    jwtToken,
    getUserData
} from "../helpers/authenticate";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import UpdateService from "../components/UpdateService";
import collect from "collect.js";
import {
    fetchGetServicDetail,
    fetchCategoriesData,
    fetchServices
} from "../helpers/fetchdata";
import { color } from "../assets/colors/colors";
export default class ServiceScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: true,
            elevation: 0,
            renderBackground: () => {
                return <NavigationBarBackground />;
            },
            renderTitle: route => {
                return (
                    <NavigationBarStaff
                        title={"servicenav"}
                        language={route.params.language}
                    />
                );
            }
        }
    };
    state = {
        appIsReady: false,
        showCloseSearchBoxClient: false,
        search:'',
    }
    services = [];
    categories = [];
    servicelist = [];
    categoryData = [];
    token = '';
    userData = '';
    async UNSAFE_componentWillMount(){
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn){
            this.token = await jwtToken();
            this.services = await fetchServices(this.token);
            this.userData = await getUserData();
            this.categoryData = await fetchCategoriesData(this.token);
            var _this = this;
            this.services.forEach(function(item){
                let category = _this.categories.filter(function(itemCategory){
                    if(typeof(item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != ''){
                        return itemCategory == item.category_customname;
                    }else{
                        return itemCategory == item.category_name;
                    }
                    
                });
                if(!category.length){
                    if(typeof(item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != ''){
                        _this.categories.push(item.category_customname);    
                    }else{
                        _this.categories.push(item.category_name);
                    }
                    
                }
            });
            this.categories = this.categories.sort(function (a, b) {
                if (a < b) return -1;
                else if (a > b) return 1;
                return 0;
            });
        }
        this.processData('');
        this.setState({ appIsReady: true });
    }
    processData = (searchtext) => {
        
        let servicesClone = [...this.services];
        let _this = this;
        this.categories.forEach(function(category){
            let serviceInCategories = servicesClone.filter(function(item){
                if(typeof(item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != ''){
                    if(searchtext != ''){
                        //if( (typeof this.state.search == 'undefined' || (this.state.search != 'undefined' && item.fullname.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0)))
                        return item.category_customname == category && item.service_name.toLowerCase().indexOf(searchtext.toLowerCase()) >= 0;
                    }
                    return item.category_customname == category;
                }else{
                    if(searchtext != ''){
                        return item.category_name == category && item.service_name.toLowerCase().indexOf(searchtext.toLowerCase()) >= 0;
                    }
                    return item.category_name == category;
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
    
    getText(key){
        return getTextByKey(this.props.route.params.languageKey,key);
    }

    _keyExtractor = (item, index) => item.id;

    async _onPressItem(id) {
        this.refs.updateservice.isShowLoaderAppointmentDetails = false;
        this.token = await jwtToken();
        let service =  await fetchGetServicDetail(this.token, id);
            this.refs.updateservice.serviceData = service;
            this.refs.updateservice.categoryData = this.categoryData;
            this.refs.updateservice.categorySelectid = service.category_id;
            this.refs.updateservice.title = this.getText('updateservice');
            this.refs.updateservice.isShowLoaderAppointmentDetails = false;
            this.refs.updateservice.setState({ modalVisible: true });
    };
    SaveServiceSuccess = (Id, data) =>{
        this.services = collect(...[this.services]);
        this.services = this.services.reject(function(item) {
            return item.id == Id;
        });
        this.services = this.services.push(data);
        this.services = this.services.toArray();
        AsyncStorage.setItem('services_'+this.userData.id, JSON.stringify(this.services));
        this.refs.updateservice.setState({ modalVisible: false });
        var _this = this;
        this.services.forEach(function(item){
            let category = _this.categories.filter(function(itemCategory){
                if(typeof(item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != ''){
                    return itemCategory == item.category_customname;
                }else{
                    return itemCategory == item.category_name;
                }
                
            });
            if(!category.length){
                if(typeof(item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != ''){
                    _this.categories.push(item.category_customname);    
                }else{
                    _this.categories.push(item.category_name);
                }
                
            }
        });

        this.categories = this.categories.sort(function (a, b) {
            if (a < b) return -1;
            else if (a > b) return 1;
            return 0;
        });
        this.servicelist = [];
        this.processData('');
       this.setState({showCloseSearchBoxClient: false});
    }
    _renderItem = ({item}) => {
        return (
            <ServiceSearchItem
                id={item.id}
                onPressItem={async id => {
                    await this._onPressItem(id);
                }}
                selected={(item.id == this.selectedId)}
                name={item.service_name}
                price={item.price}
                point={item.rewardpoint}
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
        //console.log(searchtext);
        //this.setState({search: searchtext});
        //this.state.search = searchtext;
        //this.setState({modalVisible: true});
        //this.refs['listtechnician'].props.search = searchtext;
    }
    
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
        if(this.state.appIsReady){
            return (
                <View style={styles.container}>
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
                        <SectionList
                            ref="sectionService"
                            renderItem={this._renderItem}
                            renderSectionHeader={this._renderSectionHeader}
                            keyExtractor={this._keyExtractor}
                            sections={this.servicelist}
                            stickySectionHeadersEnabled={true}
                        />
                    </View>
                    <UpdateService
                        visible={false}
                        ref="updateservice"
                        token={this.token}
                        SaveServiceSuccess={this.SaveServiceSuccess}
                        language={this.props.route.params.languageKey}
                        category={this.categoryData}
                />
                </View>
            );
        }else{
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
    sectionheader: {
        height: 35,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: color.darkCyan
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
        color: color.white,
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
