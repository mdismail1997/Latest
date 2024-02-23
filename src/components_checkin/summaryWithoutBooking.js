import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Alert,
    TextInput
} from "react-native";
import layout from "../assets/styles/layout_checkin";
import { LinearGradient } from 'expo-linear-gradient';
import ModalPromotions from '../components_checkin/ModalPromotions';
import CheckBox from 'react-native-check-box';
import Colors from "../constants/Colors_checkin";
import SubmitLoader from "../helpers/submitloader";
import IconLoader from "../helpers/iconloader";
import { color } from "../assets/colors/colors";

var width = Dimensions.get('window').width;
var columnWidth = width / 2;
var itemWidth = columnWidth - 23.5;
var lineWidth = columnWidth - 60;
var btnWidth = width - 30;
export default class Summary extends React.Component{
    state = {
        isReady : false,
        promo: ''
    }

    clientData = '';
    //service = '';
    //servicePrice = 0;
    services = [];
    
    //listServices = [];
    totalReward = 0;
    promotions = {};
    //gifts = [];
    //giftCodes = [];

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    UNSAFE_componentWillMount(){
        let _this = this;
        width = Dimensions.get('window').width;
        columnWidth = width / 2;
        itemWidth = columnWidth - 23.5;
        lineWidth = columnWidth - 60;
        btnWidth = width - 30;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            columnWidth = width / 2;
            itemWidth = columnWidth - 23.5;
            lineWidth = columnWidth - 60;
            btnWidth = width - 30;
            _this.setState({ isReady: true });
        })
    }

    setReady = () => {
        this.setState({isReady: true});
    }
    
   /* setClient = (client, userData) => {
        
        this.clientData = client;
        if(client.reward_point > 0 && !userData.isDisableApplyRewardPointCheckIn){
            if(typeof(this.promotions['reward_point']) != 'undefined'){
                this.promotions['reward_point'].amount = client.reward_point;    
            }else{
                this.promotions.reward_point = {
                    id: 'rewardpoint',
                    amount: client.reward_point,
                    checked: false
                }        
            }
        }
    }*/
    roundprice=(num) =>{
        return Math.round(num * 100) / 100;
    }
    setClient = (client,userData) => {
        this.clientData = client;
        this.userdata = userData;
        if(client.reward_point > 0 && !userData.isDisableApplyRewardPointCheckIn){
            let availableRewardPoint = 0;
            if(client.is_vip == true){
                if(userData.MaximumApplyRewardPointType == "percent"){
                    var percent = userData.MaximumApplyRewardPointVip; 
                    var amount = this.roundprice(client.reward_point * (percent / 100)); 
                    availableRewardPoint = amount;
                }else{
                    if(userData.MaximumApplyRewardPointVip <= client.reward_point){
                        availableRewardPoint = userData.MaximumApplyRewardPointVip;
                    }else{
                        availableRewardPoint = client.reward_point;
                    }
                }
            }else{
                if(userData.MaximumApplyRewardPointType == "percent"){
                    var percent = userData.MaximumApplyRewardPoint; 
                    var amount = this.roundprice(client.reward_point * (percent / 100)); 
                    availableRewardPoint = amount;
                }else{
                    if(userData.MaximumApplyRewardPoint <= client.reward_point){
                        availableRewardPoint = userData.MaximumApplyRewardPoint;
                    }else{
                        availableRewardPoint = client.reward_point;
                    }
                }
            }
            if(typeof(this.promotions['reward_point']) != 'undefined'){
                this.promotions['reward_point'].amount =  availableRewardPoint;     
            }else{
                this.promotions.reward_point = {
                    id: 'rewardpoint',
                    amount:  availableRewardPoint,
                    checked: false
                }        
            }
        }
    }
    

    setService = (services) => {
        this.services = services;
        //console.log(services);
        //this.combos = [];
        //this.listServices = listServices;
        //let _this = this;
        //console.log(services);
        /*
        services.forEach(function(service){
            if(service.id.indexOf('service') >= 0){
                _this.services.push(service);
            }
        });*/
        //this.services = services;
    }

    

    saveAppointment = () => {
        
        //console.log(promotionsData);
        let reward_point = 0;
        Object.keys(this.promotions).map((key,i) => {
            let item = this.promotions[key];
            if(item.checked && typeof(item.appliedAmount) != 'undefined' && item.appliedAmount > 0){
                
                reward_point = item.appliedAmount;
            }
        });
        this.props.onPress(reward_point);
    }

    renderItem = (x,i,techs) => {
        //let tech = techs[this.hour + '_' + x.id];
        let display = false;
        Object.keys(techs).map((techdatakey, i) => {
            let arr = techdatakey.split('_');
            arr.shift();
            if(arr.join('_') == x.id){
                tech = techs[techdatakey];
                display = (
                    <View key={x.id}>
                        {i > 0 && 
                            <View style={[styles.line,{width: lineWidth}]}></View>
                        }
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlblservice}>{x.service_name}</Text>
                            <Text style={styles.clientvalue}>with {tech.fullname}</Text>
                        </View>
                    </View>
                )
            }
        })
       return display;
        
    }

    

    

    

    renderPromotionsRewardPoint = () => {
        let display = false;
        let view = false;
        if(Object.keys(this.promotions).length > 0 && typeof(this.promotions['reward_point']) != 'undefined'){
            let item = this.promotions['reward_point'];
            let lbl = '';
            let availableAmount = 0;
            let disable = false;
            if (item.amount > 0) {
                availableAmount = item.amount;

                /*
                if(item.checked && typeof(item.appliedAmount) != 'undefined'){
                    this.tempTotal -= availableAmount;
                }*/
                
            }
            item.appliedAmount = availableAmount;
                lbl = 'Apply reward point $'+availableAmount; 
            display = (
                <View style={[styles.columnWraperRight,{width:itemWidth}]}>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlblheader}>PAYMENT</Text>
                                
                            </View>
                            <View style={[styles.line,{width: lineWidth}]}></View>

                    <View key={item.id} style={styles.checkboxcontainer}>
                        <CheckBox
                            style={{flex: 1, padding: 10}}
                            onClick={()=>this.onChecked(item,'reward_point')}
                            isChecked={item.checked}
                            rightText={lbl}
                            rightTextStyle={{fontSize:18,color: color.silver}}
                            disabled={disable}
                        />
                    </View>
                </View>
            )
            if(availableAmount > 0){
                return display;
            }else{
                return false;
            }
            
        }
        
        return view;
    }

    

    onChecked = (item,key) => {
        this.promotions[key].checked = item.checked ? false : true;
        this.setState({rerender: true });
    }

    

    

    render() {  
        let phone = '';
        let birthdate = '';
        if(this.clientData != ''){

            if (typeof this.clientData.phone != 'undefined' && this.clientData.phone != '' && this.clientData.phone != null) {
                phone = this.clientData.phone.toString().replace(/[^\d]+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }  

            if (typeof this.clientData.birthdate != 'undefined' && this.clientData.birthdate != '' && this.clientData.birthdate != null) {
                //birthdate = birthdate.replace('/','');
                birthdate = this.clientData.birthdate;
            }      
        }
        this.total = 0;
        this.tempTotal = 0;
        this.subtotal = 0;
        this.totalReward = 0;
        this.grandTotal = 0;
        let servicesDisplay = this.services.map((x, i) => {
            //this.total += x.price;
            //this.grandTotal += x.price;
            //console.log(x.rewardpoint);
            //this.totalReward += parseFloat(x.rewardpoint);
            //let techs = this.techniciansSelected[x.id];
            return (
                <View key={x.id}>
                    {i > 0 && 
                        <View style={[styles.line,{width: lineWidth}]}></View>
                    }
                    <View style={styles.clienttoprow}>
                        <Text style={styles.clientlblservice}>{x.name}</Text>
                        
                    </View>
                    
                </View>
            );
            
        });

        
        
        //let displayAppliedGiftCode = this.renderAppliedGiftCode();
        
        this.tempTotal = this.total;
        //let displayCoupon = this.renderCoupon();
        //this.tempTotal = this.total;
        let displayPromotionRewardPoint = this.renderPromotionsRewardPoint();
        //let displayAppliedRewardPoint = this.renderAppliedRewardPoint();
        //let displayPromotionGiftCode = this.renderPromotionsGiftCode();
        
        //let displayPromotionGift = this.renderPromotionsGiftBalance();
        //let displayPromotionGiftBalance = this.renderAppliedGiftBalance();
        return (
            <View style={{flex:1}}>
                <View style={styles.rowWrap}>
                    <ScrollView contentContainerStyle={styles.container} style={{width:columnWidth}} keyboardShouldPersistTaps="always">
                        <View style={[styles.columnWraperLeft,{width:itemWidth}]}>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlblheader}>INFORMATION</Text>
                            </View>
                            <View style={[styles.line,{width: lineWidth}]}></View>
                            <View style={[styles.clientrow]}>
                                <Text style={styles.clientlbl}>Full Name</Text>
                                <Text style={styles.clientvalue}>{this.clientData.firstname + ' ' + this.clientData.lastname}</Text>
                            </View>
                            <View style={[styles.line,{width: lineWidth}]}></View>
                            
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlbl}>Phone</Text>
                                <Text style={styles.clientvalue}>{phone}</Text>
                            </View>
                            <View style={[styles.line,{width: lineWidth}]}></View>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlbl}>Email</Text>
                                <Text style={styles.clientvalue}>{this.clientData.email}</Text>
                            </View>
                            <View style={[styles.line,{width: lineWidth}]}></View>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlbl}>Time</Text>
                                <Text style={styles.clientvalue}>{this.time}</Text>
                            </View>
                            
                        </View>
                        
                    </ScrollView>
                    <ScrollView contentContainerStyle={styles.container} style={{width:columnWidth}} keyboardShouldPersistTaps="always">
                        {
                            this.services.length > 0 && 
                            <View style={[styles.columnWraperRight,{width:itemWidth}]}>
                                <View style={styles.clientrow}>
                                    <Text style={styles.clientlblheader}>SERVICES</Text>
                                </View>
                                <View style={[styles.line,{width: lineWidth}]}></View>
                                {servicesDisplay}
                            </View>    
                        }
                        
                       

                          
                            {displayPromotionRewardPoint}
                          
                        
                            
                        
                    </ScrollView>
                </View>
                {/* <View style={[styles.btnBlockWraper,{width:btnWidth}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.btnSaveWraper}
                        onPress={this.saveAppointment}
                    >
                        <LinearGradient
                            start={[0, 0]}
                            end={[1, 0]}
                            colors={[ color.reddish,  color.reddish]}
                            style={styles.btnLinear}
                        >
                            <Text style={styles.btnSaveText}>Confirm & Check In</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View> */}

                

                <SubmitLoader
                    ref="appointmentLoader"
                    visible={false}
                    textStyle={layout.textLoaderScreenSubmit}
                    textContent={"Processing..."}
                    color={Colors.spinnerLoaderColorSubmit}
                />

                <IconLoader
                    ref="appointmentSuccessLoader"
                    visible={false}
                    textStyle={layout.textLoaderScreenSubmitSucccess}
                    textContent={"Appointment Booked"}
                    color={Colors.spinnerLoaderColorSubmit}
                />
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop:20
    },
    columnWraperLeft:{
        borderRadius:4,
        backgroundColor: color.white,
        marginLeft:15,
        marginRight:7.5,
        borderWidth: 0.5,
        borderColor: color.whitishBorder,
        marginBottom:15
    },
    columnWraperRight:{
        borderRadius:4,
        backgroundColor: color.white,
        marginLeft:7.5,
        marginRight:15,
        borderWidth: 0.5,
        borderColor: color.whitishBorder,
        marginBottom:15
    },
    rowWrap:{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: color.lightWhite,
        marginBottom:20
    },
    row:{
        marginTop:30
    },
    clientTitle:{
        fontSize:22,
        marginBottom:15,
        fontFamily:'Futura',
        marginLeft:15,
        marginRight:15
    },
    clientrow:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor: color.white,
        borderRadius:4,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        position:'relative'
    },
    clienttoprow:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor: color.white,
        borderRadius:4,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
    },
    clientbottomrow:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor: color.white,
        borderRadius:4,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:15,
        paddingTop:10
    },
    clientlbl:{
        fontSize:18,
        width:170,
        color: color.blackish
    },clientlblLong:{
        fontSize:18,
        color: color.blackish
    },
    clientshortvalue:{
        color: color.silver,
        fontSize:18,
        textAlign:'right'
    },
    clientlblservice:{
        fontSize:18,
        color: color.blackish
    },
    clientlblheader:{
        fontSize:18,
        color: color.reddish,
    },
    clientlbldot:{
        fontSize:18,
        color: color.blackish
    },
    clientvalue:{
        color: color.silver,
        fontSize:18,
        textAlign:'right'
    },
    confirmbtn:{
        justifyContent: "center",
        alignItems: "center",
        width: 400
    },
    btnSave: {
        height: 45,
        width: 200,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15
    },
    btnSaveText: {
        color:  color.white,
        fontSize: 30,
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
    line:{
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
        marginLeft:15
    },
    btnBlockWraper:{
        height:60,
        marginLeft:15,
        marginBottom:15
    },
    addpromotioncontainer:{
        position:'absolute',
        right:15,
        top:13
    },
    addpromotion:{
        fontFamily:'Futura',
        fontSize:18
    },
    searchContainer: {     
        height:50,
        justifyContent: 'center'
    },
    searchbox:{
        position:'absolute',
        zIndex:1,
        right:0,
        width:100,
        height:50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textbox:{
        height:50,
        color: color.black,
        paddingRight:20,
        paddingLeft:20,
        fontSize:16,
        backgroundColor: color.lightWhite,
        borderBottomLeftRadius:5,
        borderTopLeftRadius:5
    },
    btnLinearPromo:{
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        width:100,
        height:50,
        borderBottomRightRadius:5,
        borderTopRightRadius:5
    },
    txtsearchtext:{
        backgroundColor:'transparent',
        fontSize:18,
        color: color.white
    }
    
})