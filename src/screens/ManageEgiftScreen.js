import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    AsyncStorage,
    Alert,
    ScrollView,
    TextInput
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DefaultTabBar from "../components/DefaultTabBar";
import ScrollableTabView from "react-native-scrollable-tab-view";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import layout from "../assets/styles/layout";
import NavigationBarBackground from "../components/navigationBarBG";
import NavigationBarTitle from "../components/navigationBarTitle";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import LanguageModal from "../components/LanguageModal";
import IconLoader from "../helpers/iconloader";
import BuyForMe from "../components/ManageEgift/BuyForMe";
import GiveAGift from "../components/ManageEgift/GiveAGift";
import EgiftSoldV from "../components/ManageEgift/EgiftSold";
import EgiftBalanceV from "../components/ManageEgift/EgiftBalance";
import {
    isLogged,
    jwtToken,
    getUserData,
    getDeviceId
} from "../helpers/authenticate";
import {
    fetchSellEgift,
    fetchBalanceEgift
} from "../helpers/fetchdata";
import { color } from "../assets/colors/colors";
export default class ManageEgiftScreen extends React.Component {
    languageKey = typeof(this.props.route.params.languageKey) != 'undefined' ? this.props.route.params.languageKey : 'en-US';

    static route = {
        navigationBar: {
            visible: true,
            elevation: 0,
            renderBackground: () => {
                return <NavigationBarBackground />;
            },
            renderTitle: route => {
                return (
                    <NavigationBarTitle
                        title={'manageegiftnav'}
                        language={route.params.language}
                    />
                );
            }
        }
    };

    state = {
        appIsReady: false,
        showCloseSearchBoxClient: false
    };
    egiftSoldData = [];
    balanceegiftData = [];
    async UNSAFE_componentWillMount() {
        this.token = await jwtToken();
        this.userData = await getUserData();
        this.clients = [];
        this.egiftSold = await fetchSellEgift(this.token);
        this.egiftSoldData = this.egiftSold;
        this.balanceegift = await fetchBalanceEgift(this.token);
        this.balanceegiftData = this.balanceegift;
        this.languageKey = await getLanguage();

        this.setState({ appIsReady: true });
    }

    async onPay(){
        let _this = this;
        _this.egiftSold = await fetchSellEgift(this.token);
        _this.balanceegift = await fetchBalanceEgift(this.token);
        setTimeout(function(){
            _this.refs.egiftsold.RefreshData(_this.egiftSold);
            // _this.refs.egiftbalance.RefreshData(_this.balanceegift);
        }, 100)
 
    }
    changeSearchText = (searchtext) => {
        let _this = this;
        _this.egiftSoldData = _this.egiftSold;
        if(searchtext != ""){
            _this.egiftSoldData = _this.egiftSoldData.filter(function(itemsearch){
                if(itemsearch.senderId != "" && itemsearch.senderId != null && itemsearch.senderId > 0){
                    let phone = '';
                    if (typeof itemsearch.sender_phone != 'undefined' && itemsearch.sender_phone != '' && itemsearch.sender_phone != null) {
                        phone = itemsearch.sender_phone.replace(/[^\d]+/g, '');
                    }
                    return itemsearch.sender_email.indexOf(searchtext.toLowerCase()) >= 0 || 
                    (itemsearch.sender_firstname + " "+ itemsearch.sender_lastname).toLowerCase().indexOf(searchtext.toLowerCase()) >= 0 ||
                    phone.indexOf(searchtext) >= 0; 
                }else{
                    let phone = '';
                    if (typeof itemsearch.buyer_phone != 'undefined' && itemsearch.buyer_phone != '' && itemsearch.buyer_phone != null) {
                        phone = itemsearch.buyer_phone.replace(/[^\d]+/g, '');
                    }
                    return itemsearch.buyer_email.indexOf(searchtext.toLowerCase()) >= 0 || 
                    (itemsearch.buyer_firstname + " "+ itemsearch.buyer_lastname).toLowerCase().indexOf(searchtext.toLowerCase()) >= 0 ||
                    phone.indexOf(searchtext) >= 0; 
                }

            });
        }
        
        this.refs.egiftsold.RefreshData(_this.egiftSoldData);
    }
    changeSearchGiftText = (searchtext) =>{
        let _this = this;
        _this.balanceegiftData = _this.balanceegift;
        if(searchtext != ""){
            _this.balanceegiftData = _this.balanceegiftData.filter(function(itemsearch){
                let phone = '';
                if (typeof itemsearch.phone != 'undefined' && itemsearch.phone != '' && itemsearch.phone != null) {
                    phone = itemsearch.phone.replace(/[^\d]+/g, '');
                }
                return itemsearch.email.indexOf(searchtext.toLowerCase()) >= 0 || 
                (itemsearch.clientname).toLowerCase().indexOf(searchtext.toLowerCase()) >= 0 ||
                phone.indexOf(searchtext) >= 0; 
            });
        }
        
        this.refs.egiftbalance.RefreshData(_this.balanceegiftData);
    }
    render() {
        if (this.state.appIsReady) {
            return (
                <View style={styles.container}>
                <ScrollableTabView
                        ref="tabs"
                        renderTabBar={() => <DefaultTabBar />}
                        locked={true}
                        //prerenderingSiblingsNumber={1}
                        onChangeTab={this.onChangeTab}
                        
                    >
                        <View style={{ flex: 1 }} tabLabel={'Sold'}>
                            <View style={{height:15}}></View>    
   
                            <View style={[layout.searchContainer]}>
                                <Icon
                                    name={'magnify'}
                                    size={20}
                                    color={color.gray42} style={layout.iconsearchbox}
                                />
                                <TextInput
                                    placeholder="Search buyer..." placeholderTextColor={color.gray42}
                                    underlineColorAndroid={'transparent'}
                                    style={layout.searchbox}
                                    onChangeText={(searchtext) => this.changeSearchText(searchtext)}
                                    ref={'searchtextinput'}
                                    clearButtonMode="always"
                                />
        
                            </View>

                                <EgiftSoldV ref="egiftsold" token={this.token} provider={this.userData} data={this.egiftSoldData} language={this.languageKey} />
                
                        </View>    
                        <View style={{ flex: 1 }} tabLabel={'Balance'}>
                            <View style={{height:15}}></View>    
              
                            <View style={[layout.searchContainer]}>
                                <Icon
                                    name={'magnify'}
                                    size={20}
                                    color={color.gray42} style={layout.iconsearchbox}
                                />
                                <TextInput
                                    placeholder="Search client..." placeholderTextColor={color.gray42}
                                    underlineColorAndroid={'transparent'}
                                    style={layout.searchbox}
                                    onChangeText={(searchtext) => this.changeSearchGiftText(searchtext)}
                                    ref={'searchtextinput'}
                                    clearButtonMode="always"
                                />
        
                            </View>
                                <EgiftBalanceV ref="egiftbalance" token={this.token} provider={this.userData} data={this.balanceegift} language={this.languageKey} />
                
                        </View>
                        
                        <View style={{ flex: 1 }} tabLabel={'For Me'}>
                            <View style={{height:15}}></View>  
                            <View style={{flex:1}}>
                            <BuyForMe ref="buyforme" provider={this.userData} onPay={async () => {await this.onPay()}} language={this.languageKey} token={this.token} clients={this.clients} />         
                            </View>      
                        </View>
                        <View style={{ flex: 1 }} tabLabel={'Give A Gift'}>
                            <View style={{height:15}}></View>  
                            <View style={{flex:1}}>
                            <GiveAGift ref="giveagift" provider={this.userData} onPay={async () => {await this.onPay()}} language={this.languageKey} token={this.token} clients={this.clients} />   
                            </View>
                        </View>
                        
                    </ScrollableTabView>

                    <IconLoader
                        ref="appointmentSuccessLoader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmitSucccess}
                        textContent={"Appointment Booked"}
                        color={Colors.spinnerLoaderColorSubmit}
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
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // marginTop:-45
    },
    
    blockcontent:{
        backgroundColor: color.white,
        
        
    },
    blockcontenttitle:{
        fontSize:20,
        paddingTop:15,
        paddingBottom:0,
        paddingLeft:15,
        paddingRight:15
    },
    blockcontens:{
        paddingTop:0,
        paddingBottom:0,
        paddingLeft:15,
        paddingRight:15
    },
    blockseperate:{
        height:10,
        backgroundColor: color.lightWhite
    },
    giftBusinessname:{
        position:'absolute',
        fontSize:30,
        backgroundColor:'transparent',
        textAlign:'center',
        top:20
    },
    giftTitle:{
        fontSize:18,
        textAlign:'center',
        marginTop:15
    },
    giftDescription:{
        fontSize:16,
        textAlign:'center',
        marginTop:15,
        marginBottom:15  
    },
    giftDescriptionContent:{
        fontSize:16,
        marginBottom:15
    },
    tabContent:{
        padding:15
    },
    row:{
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    headerContainer:{
        height:90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle:{
        color: color.white,
        backgroundColor:'transparent',
        fontSize:22,

        marginTop:10
    },
    confirmbtn:{
        justifyContent: "center",
        alignItems: "center",
        width: 350
    },
    btnSave: {
        height: 45,
        width: 230,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15
    },
    btnSaveText: {
        color:  color.white,
        fontSize: 20,
        zIndex: 1,
        backgroundColor: "transparent"
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    logofontdefault:{
        backgroundColor:'transparent',
        color: color.silver,
        fontSize:80,
        marginBottom:40
    },
 
    columnWraperLeft:{
        backgroundColor: color.white,
        borderWidth: 0.5,
        borderColor: color.whitishBorder,
        marginBottom:15
    },
    clientrow:{
        backgroundColor: color.white,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        position:'relative'
    },
    line:{
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
        marginLeft:15,
        position:'relative'
    },
    clientlblheader:{
        fontSize:18,
    },
    clientlbl:{
        flexDirection:'row',
    },
    clientlbl_text:{
        fontSize:11
    },
    settings:{
        position: 'absolute',
        zIndex: 1,
        left: 10,
        top:40,
        alignItems: 'center', 
        justifyContent: 'center', 
        color: color.white
    },
    searchContainer:{
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder
    },

});
