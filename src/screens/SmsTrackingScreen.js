import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    SectionList,
    TouchableOpacity
} from "react-native";
import { getTextByKey } from "../helpers/language";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NavigationBarBackground from "../components/navigationBarBG";
import NavigationBarStaff from "../components/navigationBarStaff";
import {
    isLogged,
    jwtToken,
    getUserData
} from "../helpers/authenticate";
import collect from "collect.js";
import {
    fetchSmsTracking
} from "../helpers/fetchdata";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import layout from "../assets/styles/layout";
import moment from "moment";
import { getUSState2Digit, get_time_zone, getCountry2Digit } from "../helpers/Utils";
import ModalSelector from 'react-native-modal-selector';
import SubmitLoader from "../helpers/submitloader";
import { color } from "../assets/colors/colors";
export default class SmsTrackingScreen extends React.Component {
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
                        title={"smsnav"}
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
    smsData = [];
    ListSmsData = [];
    stateData = "";
    timezone = "";
    async UNSAFE_componentWillMount(){
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn){
            this.token = await jwtToken();
            this.userData = await getUserData();
            this.stateData = getUSState2Digit(this.userData.state);
            let country = getCountry2Digit(this.userData.country);
            this.timezone = get_time_zone(country,this.stateData);
            let res = this.getRangeDay("today");
            this.smsData = await fetchSmsTracking(this.token, res.fromdate, res.todate, this.timezone);
            this.processData("");
        }
        this.setState({ appIsReady: true });
    }

    processData = (searchtext)=>{
        this.ListSmsData = [];
        let collectionSms = collect(this.smsData);
        if(searchtext != ""){
            collectionSms = collectionSms.filter(function(itemsearch){
                let phone = '';
                if (typeof itemsearch.phone != 'undefined' && itemsearch.phone != '' && itemsearch.phone != null) {
                    phone = itemsearch.phone.replace(/[^\d]+/g, '');
                }
                return itemsearch.bookingcode.toLowerCase().indexOf(searchtext.toLowerCase()) >= 0 || 
                itemsearch.fullname.toLowerCase().indexOf(searchtext.toLowerCase()) >= 0 ||
                phone.indexOf(searchtext) >= 0; 
            })
        }
        let smsdata = collectionSms.groupBy(function (item, key) {
            return item.bookingcode;
          });
        let _this = this;
        smsdata.each((item, key) => {
            serviceData = {};
            serviceData.key = key;
            let itemsms = collect(item).sortBy("created");
            serviceData.data = itemsms.toArray();
            _this.ListSmsData.push(serviceData);
          });
    }

    clearSearch = () => {
        this.refs.searchtextinput.clear();
        this.processData("");
        this.setState({showCloseSearchBoxClient: false, search: ''});
    }

    changeSearchText = (searchtext) => {
        this.processData(searchtext);
      
        if (String.prototype.trim.call(searchtext) == '') {
            this.setState({showCloseSearchBoxClient: false});
        } else {
            this.setState({showCloseSearchBoxClient: true});
        }
    }
    getText(key){
        return getTextByKey(this.props.language,key);
    }
    toTimeZone(time, zone) {
        var utcCutoff = moment.utc(time, 'YYYYMMDD HH:mm:ss');
        var displayCutoff = utcCutoff.clone().tz(zone);
        return displayCutoff.format('DD-MM-YYYY hh:mm A');
    }
    _renderItem = ({item}) => {
        let status = this.getTextStatus(item.appointment_send_status);
        let date = this.toTimeZone(item.created, this.timezone);
        

        return (
            <View style={styles.itemContainer}>
                    <Icon
                        name={'check'}
                        size={20}
                        color={color.reddish} 
                    />
   
                <Text style={styles.statusname}>{status}</Text>
                <Text style={styles.statusdata}>{date}</Text>
            </View>
  
        )
    };
    getTextStatus = (data)=>{
        var type = "";
        switch(data) {
            case "0":
                type = "Appointment Pending";
                break;
            case "1":
                type = "Appointment Confirm";
                break;
            case "2":
                type = "Appointment Complete";
                break;
            case "3":
                type = "Appointment Cancel";
                break;
            case "birthday":
                type = "Birthday";
                break;
            case "reminder":
                type = "Reminder";
                break;
            case "reminder1day":
                type = "Reminder befor one day";
                break;
            case "reminder2hour":
                type = "Reminder befor two hour";
                break;
            case "re-appointment":
                type = "Re-appointment";
                break;
            case "notificationForBusiness":
                type = "notification For Business";
                break;
            case "notificationForTechnician":
                type = "notification For Technician";
                break;
            default:
                type = data;
        }
        return type;
    }
    _renderSectionHeader = sectionHeader => {
        let client = sectionHeader.section.data[0];
        let name = client.firstname + " " + client.lastname;
        let phone = client.phone;
        return (
            <View>
                <View style={styles.sectionheader}>
                    <View style={styles.sectionheadertext}>
                        <View style={styles.sectionheadertextcontainer}>
                            <Text style={styles.sectionheadertextcontent}>
                                {sectionHeader.section.key}
                            </Text>
                            <Text style={styles.sectionheadertextcontent}>
                                {name}
                            </Text>
                            <Text style={styles.sectionheadertextcontent}>
                                {phone}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    _keyExtractor = (item, index) => "sms"+ item.idsms;
    async getNewDataSms (type){
        this.refs.Loader.setState({ visible: true });   
        let res = this.getRangeDay(type);
        this.smsData = await fetchSmsTracking(this.token, res.fromdate, res.todate, this.timezone);
        
        this.processData("");
        this.setState({textInputValue: type});
        this.refs.Loader.setState({ visible: false });
    }
    getRangeDay (type){
        let datezone = moment().tz(this.timezone);
        let fromdate = "";
        let todate = "";
        let format = "YYYY-MM-DD HH:mm:ss";
        switch (type) {
            case "today":
                fromdate = datezone.clone().format(format);
                todate = datezone.clone().format(format);
                break;
            case "yesterday":
                fromdate = datezone.clone().add(-1, 'days').format(format);
                todate = datezone.clone().add(-1, 'days').format(format);
                break;
            case "week":
                fromdate = datezone.clone().format(format);
                todate = datezone.clone().add(-7, 'days').format(format);
                break;
            case "thisweek":
                fromdate = datezone.clone().endOf('week').format(format);
                todate = datezone.clone().startOf('week').format(format);
                break;
            case "month":
                fromdate = datezone.clone().format(format);
                todate = datezone.clone().add(-1, 'months').format(format);
                break;
            case "3month":
                fromdate = datezone.clone().format(format);
                todate = datezone.clone().add(-3, 'months').format(format);
                break;
            case "6month":
                fromdate = datezone.clone().format(format);
                todate = datezone.clone().add(-6, 'months').format(format);
                break;
            case "year":
                fromdate = datezone.clone().format(format);
                todate = datezone.clone().add(-1, 'years').format(format);
                break;
        }
        let res = {fromdate: fromdate, todate: todate};
        return res;
    }
    render(){
        const dataModalSelect = [
            { key: "today", section: this.state.textInputValue == "today" ? true : false,label: 'ToDay' },
            { key: "yesterday",section: this.state.textInputValue == "yesterday" ? true : false, label: 'Yesterday' },
            { key: "thisweek",section: this.state.textInputValue == "thisweek" ? true : false,label: 'This Week' },
            { key: "week",section: this.state.textInputValue == "week" ? true : false, label: 'Last 7 day' },
            { key: "month",section: this.state.textInputValue == "month" ? true : false, label: '1 months'},
            { key: "3month",section: this.state.textInputValue == "3month" ? true : false, label: '3 months'},
            { key: "6month",section: this.state.textInputValue == "6month" ? true : false, label: '6 months'},
            { key: "year",section: this.state.textInputValue == "year" ? true : false, label: '1 Year'}
        ];
        if(this.state.appIsReady){
            return(
                <View style={styles.container}>
                    <View style={styles.searchContainer}>
                    <View style={styles.totalrow}>
                        <View style={[styles.bookingrow, styles.bookingrowbd]}>
                            <View style={styles.totalrow_tiem}>
                                <Text style={styles.clientlbl}>SMS Total</Text>
                            </View>
                            <View style={styles.totalrow_tiem}>
                            <Text style={styles.totalrow_text}>{this.userData.planTotalCustomer}</Text>
                            </View>
                        </View>
                        <View style={styles.bookingrow, styles.bookingrowbd}>
                            <View style={styles.totalrow_tiem}>
                                <Text style={styles.clientlbl}>SMS Used Total</Text>
                            </View>
                            <View style={styles.totalrow_tiem}>
                            <Text style={styles.totalrow_text}>{this.userData.smsUsed > this.userData.planTotalCustomer ? this.userData.planTotalCustomer : this.userData.smsUsed}</Text>
                            </View>
                        </View>
                        <View style={styles.bookingrow, styles.bookingrowbd}>
                            <View style={styles.totalrow_tiem}>
                                <Text style={styles.clientlbl}>SMS Available</Text>
                            </View>
                            <View style={styles.totalrow_tiem}>
                            <Text style={styles.totalrow_text}>{(this.userData.planTotalCustomer - this.userData.smsUsed) < 0 ? 0 : this.userData.planTotalCustomer - this.userData.smsUsed}</Text>
                            </View>
                        </View>
                        <View style={styles.bookingrow}>
                            <View style={styles.totalrow_tiem}>
                                <ModalSelector
                                data={dataModalSelect}
                                initValue="To Day"
                                onChange={async (option)=>{ await this.getNewDataSms(option.key)}} />
                            </View>
                        </View>                                                                       

                    </View>

                        <View style={[layout.searchContainer]}>
                            <Icon
                                name={'magnify'}
                                size={20}
                                color={color.gray42} style={layout.iconsearchbox}
                            />
                            <TextInput
                                placeholder={this.getText('SearchclientOrBookingcode')} placeholderTextColor={color.gray42}
                                underlineColorAndroid={'transparent'}
                                style={layout.searchbox}
                                onChangeText={(searchtext) => this.changeSearchText(searchtext)}
                                ref={'searchtextinput'}
                                clearButtonMode="always"
                            />
    
                        </View>
                    </View>
                    <View style={{flex:1}}>
                        <SectionList
                            ref="sectionSMS"
                            renderItem={this._renderItem}
                            renderSectionHeader={this._renderSectionHeader}
                            keyExtractor={this._keyExtractor}
                            sections={this.ListSmsData}
                            stickySectionHeadersEnabled={true}
                        />
                    </View>
                    <SubmitLoader
                            ref="Loader"
                            visible={false}
                            textStyle={layout.textLoaderScreenSubmit}
                            textContent={this.getText('processing')}
                            color={Colors.spinnerLoaderColorSubmit}
                        />
                </View>
            )
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
        height: 40,
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
        justifyContent: "center",
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15
    },
    sectionheadertextcontent: {
        color: color.white,
        fontSize:14,
        width:"33.33333333333%"
    },
    searchContainer:{
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder
    },

    //ITEM SMS
    itemContainer: {
        height:50,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: color.cream,
        borderBottomWidth: 0.5,
        paddingLeft:10,
        paddingRight:10
    },
    statusname:{
        marginLeft:5,
        color:color.gray42,
        fontSize:12
    },
    statusdata:{
        position:'absolute',
        right:15,
        color:color.gray42,
        fontSize:12
    },
    //header sms total
    totalrow:{
        flexDirection:'row',
        backgroundColor:color.white,
        paddingLeft:15,
        paddingRight:15,

        position:'relative',
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    totalrow_tiem:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalrow_text:{
        color:'red',
        marginTop:5
    },
    bookingrow:{
        position:'relative', 
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:5,
        paddingBottom:5,
    },
    bookingrowbd:{
        borderRightWidth: 1,
        borderColor: color.whitishBorder,
    },
    clientlbl: {
        fontSize: 11,
         marginRight: 10
    }
});
