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
    fetchChargedNewClient
} from "../helpers/fetchdata";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import layout from "../assets/styles/layout";
import moment from "moment";
import { getUSState2Digit, get_time_zone, getCountry2Digit } from "../helpers/Utils";
import ModalSelector from 'react-native-modal-selector';
import SubmitLoader from "../helpers/submitloader";
import { color } from "../assets/colors/colors";
export default class ChargedNewClient extends React.Component {
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
                        title={"chargednav"}
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
    ListClientData = [];
    stateData = "";
    timezone = "";
    monthlist = [];
    yearlist = [];
    DataMonth = "";
    DataYear = "";
    nameMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    totalAmount = 0;
    totalClient = 0;
    async UNSAFE_componentWillMount(){
        this.isLoggedIn = await isLogged();
        if (this.isLoggedIn){
            this.token = await jwtToken();
            this.userData = await getUserData();
            this.stateData = getUSState2Digit(this.userData.state);
            let country = getCountry2Digit(this.userData.country);
            this.timezone = get_time_zone(country,this.stateData);
            let res = this.getRangeDay("today");
            this.monthlist = this.getMonth(res.month);
            this.yearlist = this.getYear(res.year);
            this.DataMonth = res.month;
            this.DataYear = res.year;
            this.smsData = await fetchChargedNewClient(this.token, res.month, res.year);
            this.totalAmount = this.smsData.totalamount;
            this.totalClient = this.smsData.totalclient;
            this.ListClientData = [
                {title: 'Title1', data: this.smsData.data}
              ];
        }
        this.setState({ appIsReady: true });
    }
    getMonth (month){
        let months = [];
        let _thisname = this.nameMonth;
        for(i= 1; i<= 12; i++){
            let item =  { key: i, section: month == i ? true : false,label: _thisname[i - 1] };
            months.push(item);
        }
        return months;
    }
    getYear (year){
        let CurrentYear = moment().year();
        let years = [];
        for(i= 2017; i<= CurrentYear; i++){
            let item =  { key: i, section: year == i ? true : false,label: i };
            years.push(item);
        }
        return years;
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
        this.setState({showCloseSearchBoxClient: false, search: ''});
    }

    changeSearchText = (searchtext) => {
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
    _renderSectionHeader = sectionHeader => {
        return (
            <View>
                <View style={styles.sectionheader}>
                    <View style={styles.sectionheadertext}>
                        <View style={styles.sectionheadertextcontainer}>
                            <Text style={styles.sectionheadertextcontent}>
                                Name
                            </Text>
                            <Text style={styles.sectionheadertextcontent}>
                                Phone
                            </Text>
                            <Text style={styles.sectionheadertextcontent}>
                              Email
                            </Text>
                            <Text style={styles.sectionheadertextcontent}>
                              Amount
                            </Text>
                            <Text style={styles.sectionheadertextcontent}>
                              Payment date
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    _renderItem = ({item}) => {
        //let status = this.getTextStatus(item.appointment_send_status);
        let date = this.toTimeZone(item.created_at, this.timezone);
        

        return (
            <View>
                <View style={styles.sectionheaderitem}>
                    <View style={styles.sectionheadertext}>
                        <View style={styles.sectionheadertextcontainer}>
                            <Text style={styles.sectionheadertextcontent}>
                                {item.firstname + " " + item.lastname}
                            </Text>
                            <Text style={styles.sectionheadertextcontent}>
                                {item.phone}
                            </Text>
                            <Text style={styles.sectionheadertextcontent}>
                              {item.email}
                            </Text>
                            <Text style={styles.sectionheadertextcontent}>
                              ${item.amount}
                            </Text>
                            <Text style={styles.sectionheadertextcontent}>
                              {date}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
  
        )
    };
   
  

    _keyExtractor = (item, index) => "charged"+ item.id;
    async getNewDataSms (key, type){
        this.refs.Loader.setState({ visible: true });   
        if(type == "month"){
            this.DataMonth = key;
        }
        if(type == "year"){
            this.DataYear = key;
        }
        this.monthlist = this.getMonth(this.DataMonth);
        this.yearlist = this.getYear(this.DataYear);
        this.smsData = await fetchChargedNewClient(this.token, this.DataMonth, this.DataYear);
        this.totalAmount = this.smsData.totalamount;
        this.totalClient = this.smsData.totalclient;
        this.ListClientData = [
            {title: 'Title1', data: this.smsData.data}
          ];
          this.setState({ appIsReady: true });
        this.refs.Loader.setState({ visible: false });
    }
    getRangeDay (type){
        let datezone = moment();
        // let fromdate = "";
        // let todate = "";
        // let format = "YYYY-MM-DD HH:mm:ss";
        // switch (type) {
        //     case "today":
        //         fromdate = datezone.clone().format(format);
        //         todate = datezone.clone().format(format);
        //         break;
        //     case "yesterday":
        //         fromdate = datezone.clone().add(-1, 'days').format(format);
        //         todate = datezone.clone().add(-1, 'days').format(format);
        //         break;
        //     case "week":
        //         fromdate = datezone.clone().format(format);
        //         todate = datezone.clone().add(-7, 'days').format(format);
        //         break;
        //     case "thisweek":
        //         fromdate = datezone.clone().endOf('week').format(format);
        //         todate = datezone.clone().startOf('week').format(format);
        //         break;
        //     case "month":
        //         fromdate = datezone.clone().format(format);
        //         todate = datezone.clone().add(-1, 'months').format(format);
        //         break;
        //     case "3month":
        //         fromdate = datezone.clone().format(format);
        //         todate = datezone.clone().add(-3, 'months').format(format);
        //         break;
        //     case "6month":
        //         fromdate = datezone.clone().format(format);
        //         todate = datezone.clone().add(-6, 'months').format(format);
        //         break;
        //     case "year":
        //         fromdate = datezone.clone().format(format);
        //         todate = datezone.clone().add(-1, 'years').format(format);
        //         break;
        // }
        let res = {month: datezone.month() + 1, year: datezone.year()};
        return res;
    }
    render(){
        if(this.state.appIsReady){
            return(
                <View style={styles.container}>
                    <View style={styles.searchContainer}>
                    <View style={styles.totalrow}>
                        <View style={[styles.bookingrow]}>
                            <View style={styles.totalrow_tiem}>
                                <Text style={styles.clientlbl}>Total client</Text>
                            </View>
                            <View style={styles.totalrow_tiem}>
                            <Text style={styles.totalrow_text}>{this.totalClient}</Text>
                            </View>
                        </View>
                        <View style={styles.bookingrow}>
                            <View style={styles.totalrow_tiem}>
                                <Text style={styles.clientlbl}>Total Amount</Text>
                            </View>
                            <View style={styles.totalrow_tiem}>
                            <Text style={styles.totalrow_text}>${this.totalAmount}</Text>
                            </View>
                        </View>

                        <View style={styles.bookingrow}>
                            <View style={styles.totalrow_tiem}>
                                <ModalSelector
                                data={this.monthlist}
                                initValue={this.nameMonth[this.DataMonth - 1]}
                                onChange={async (option)=>{ await this.getNewDataSms(option.key, "month")}} />
                            </View>
                        </View>      
                        <View style={styles.bookingrow}>
                            <View style={styles.totalrow_tiem}>
                                <ModalSelector
                                data={this.yearlist}
                                initValue={this.DataYear + " Year"}
                                onChange={async (option)=>{ await this.getNewDataSms(option.key, "year")}} />
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
                            sections={this.ListClientData}
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
        height: 35,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: color.lightWhite
    },
    sectionheaderitem: {
        height: 50,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: color.white,
        borderBottomColor: color.cream,
        borderBottomWidth: 0.5,
        paddingLeft:10,
        paddingRight:10
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
    },
    sectionheadertextcontent: {
        color: color.silver,
        fontSize:16,
        width:"20%"
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
        // height:50,
        // flex: 1,
        // flexDirection: 'row',
        // alignItems: 'center',
        // borderBottomColor: color.cream,
        // borderBottomWidth: 0.5,
        // paddingLeft:10,
        // paddingRight:10
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    statusname:{
        marginLeft:5,
        color:color.gray42,
        fontSize:16
    },
    statusdata:{
        position:'absolute',
        right:15,
        color:color.gray42,
        fontSize:16
    },
    //header sms total
    totalrow:{
        flexDirection:'row',
        backgroundColor: color.white,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
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
    }
});
