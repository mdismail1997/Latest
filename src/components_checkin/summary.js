import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Alert,
    TextInput,
    Platform
} from "react-native";
import layout from "../assets/styles/layout_checkin";
import { LinearGradient } from 'expo-linear-gradient';
import ModalPromotions from '../components_checkin/ModalPromotions';
import CheckBox from 'react-native-check-box';
import Colors from "../constants/Colors_checkin";
import SubmitLoader from "../helpers/submitloader";
import setting from "../constants/Setting";
import IconLoader from "../helpers/iconloader";
import ModalConsentFormCovid19 from './ModalConsentFormCovid19';
import { color } from "../assets/colors/colors";
import { api } from "../api/api";
var width = Dimensions.get('window').width;
var widthLeft = width * 0.7;
var columnWidth = Platform.OS == "ios" ? widthLeft : widthLeft;
var itemWidth = columnWidth - 23.5;
var lineWidth = columnWidth - 60;
var btnWidth = widthLeft - 30;
export default class Summary extends React.Component{
    state = {
        isReady : false,
        promo: '',
        consentForm: false
    }

    clientData = '';
    //service = '';
    //servicePrice = 0;
    services = [];
    combos = [];
    techniciansSelected = {};
    time = '';
    hour = '';
    listServices = [];
    totalReward = 0;
    promotions = {};
    total = 0;
    grandTotal = 0;
    userdata = {};
    printer= '';
    //gifts = [];
    //giftCodes = [];

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    async UNSAFE_componentDidMount(){
        let _this = this;
        width = Dimensions.get('window').width;
        widthLeft = width * 0.7;
        columnWidth = Platform.OS == "ios" ? widthLeft : widthLeft;
        itemWidth = columnWidth - 23.5;
        lineWidth = columnWidth - 60;
        btnWidth = widthLeft - 30;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            widthLeft = width * 0.7;
            columnWidth = Platform.OS == "ios" ? widthLeft : widthLeft;
            itemWidth = columnWidth - 23.5;
            lineWidth = columnWidth - 60;
            btnWidth = widthLeft - 30;
            _this.setState({ isReady: true });
        })
        this.setState({isReady: true});
      }
    setReady = () => {
        this.setState({isReady: true});
    }
    _onSetconsentform = () =>{
        let isChecked = this.state.consentForm ? false : true;
        if(isChecked){
            this.refs.ModalConsentFormCovid19.setState({visible:true});
        }
        this.setState({
            consentForm: isChecked
        });
    }
    _onPressconsentFormData = (data)=>{
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

    setCoupon = (coupon) => {
        if(typeof(coupon.code) != 'undefined' && coupon.code.length > 0){
            if(typeof(this.promotions['coupon']) == 'undefined'){
                this.promotions.coupon = {
                    id: 'coupon',
                    checked: true,
                    discountvalue: coupon.amount,
                    discounttype: coupon.discounttype,
                    discountid: coupon.id,
                    code: coupon.code,
                    service_discount: coupon.services,
                    service_type: coupon.service_type
                }
            }
        }else{
            if(typeof(this.promotions['coupon']) != 'undefined'){
                delete this.promotions.coupon;
            }
        }
    }

    //setGifts = (gift,giftCodes) => {
    setGifts = (gift) => {
        //this.gifts = gifts;
        //this.giftCodes = giftCodes;
        /*
        if(giftCodes.length){
            var giftcodeslist = [];
            giftCodes.forEach(function(item){
                var giftcodedata = {};
                giftcodedata.id = item.id;
                giftcodedata.balance = item.balance;
                giftcodedata.redeemCode = item.redeemCode; 
                giftcodeslist.push(giftcodedata);
            });
            if(typeof(this.promotions['giftcodes']) == 'undefined'){
                this.promotions.giftcodes = {
                    id: 'giftcodes',
                    checked: false,
                    data: giftcodeslist
                }
            }
        }*/


        if(typeof(gift.id) != 'undefined' && parseFloat(gift.balance) > 0){
            if(typeof(this.promotions['gift']) == 'undefined'){
                this.promotions.gift = {
                    id: 'gift',
                    checked: false,
                    balance: gift.balance,
                    giftid: gift.id,
                    codeids: gift.codeids
                }
            }
        }
        
    }

    setService = (services,listServices) => {
        this.services = [];
        this.combos = [];
        this.listServices = listServices;
        let _this = this;
        services.forEach(function(service){
            if(service.id.indexOf('service') >= 0){
                _this.services.push(service);
            }else{
                _this.combos.push(service);
            }
        });
        //this.services = services;
    }

    setTechnician = (techniciansSelected) => {
        this.techniciansSelected = techniciansSelected;
    }

    setTime = (selectedTime,hour, dayofweek, bookingday) => {
        this.time = selectedTime;
        this.hour = hour;
        this.dayofweek = dayofweek.toLowerCase();
        this.bookingday = bookingday; 
    }

    saveAppointment = () => {
        if(this.userdata.covid19 == 1 && this.state.consentForm == false){
            Alert.alert('Wrong Input!', 'Please Consent Form Covid 19', [
                {text: 'Okay'}
            ]);
            return;
        }
        let promotionsData = [];
        Object.keys(this.promotions).map((key,i) => {
            let item = this.promotions[key];
            if(item.checked && typeof(item.appliedAmount) != 'undefined' && item.appliedAmount > 0){
                let promo = {
                    type: item.id,
                    appliedAmount: item.appliedAmount,
                };
                if(item.id == 'gift'){
                    promo.codeids = item.codeids;
                    promo.id = item.giftid;
                }

                if(item.id == 'coupon'){
                    promo.discountid = item.discountid;
                    promo.code = item.code;
                }
                promotionsData.push(promo);
            }
        })
        this.props.onPress(promotionsData);
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

    renderCombo = (combo,i,techs) => {
        let combosDisplay = [];
        combosDisplay = combo.services.map((x, index) => {
            let serviceItemData = this.listServices.filter(function(item){
                return item.id == 'service_' + x.serviceid;        
            });
            let serviceItem = serviceItemData[0];
            return this.renderItem(serviceItem,index,techs);
        })
        let quantity = 1;
        if(typeof(combo.quantity) != 'undefined'){
            quantity = combo.quantity;
        }
        return (
            <View key={combo.id + '_' + i}  style={[styles.columnWraperRight,{width:itemWidth}]}>
                <View style={styles.clientrow}>
                    <Text style={styles.clientlblheader}>{combo.comboname} x{quantity} - ${(combo.price * quantity)}</Text>
                </View>
                <View style={[styles.line,{width: lineWidth}]}></View>
                {combosDisplay}
            </View>
        )
    }

    renderAppliedRewardPoint = () => {
        let view = false;
        let isAny = false;
        let displayPromotion = false;
        //typeof(this.promotions['reward_point']) != 'undefined'
        if(typeof(this.promotions['reward_point']) != 'undefined'){
            let item = this.promotions['reward_point'];
            if(item.checked && typeof(item.appliedAmount) != 'undefined'){
                isAny = true;
                this.total -= item.appliedAmount;
                let lbl = 'Applied Reward Point'; 
                let availableAmount = 0;
                let disable = false;
                displayPromotion = (
                    <View key={'reward_point'}>
                        <View style={[styles.line,{width: lineWidth}]}></View>
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlblLong}>{lbl}</Text>
                            <Text style={styles.clientshortvalue}>-${item.appliedAmount}</Text>
                        </View>
                    </View>
                ); 
            }
        }
        
        if(isAny){
            view = (
                <View>
                    {displayPromotion}
                    <View style={[styles.line,{width: lineWidth}]}></View>
                </View>
            );
        }

        return view;
    }

    renderAppliedGiftBalance = () => {
        let view = false;
        let isAny = false;
        let displayPromotion = false;
        //typeof(this.promotions['reward_point']) != 'undefined'
        if(typeof(this.promotions['gift']) != 'undefined'){
            let item = this.promotions['gift'];
            if(item.checked && typeof(item.appliedAmount) != 'undefined'){
                isAny = true;
                this.total -= item.appliedAmount;
                let lbl = 'Applied gift'; 
                let availableAmount = 0;
                let disable = false;
                displayPromotion = (
                    <View key={'giftdisplay_' + item.id}>
                        <View style={[styles.line,{width: lineWidth}]}></View>
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlblLong}>{lbl}</Text>
                            <Text style={styles.clientshortvalue}>-${item.appliedAmount}</Text>
                        </View>
                    </View>
                ); 
            }
        }
        
        if(isAny){
            view = (
                <View>
                    {displayPromotion}
                    <View style={[styles.line,{width: lineWidth}]}></View>
                </View>
            );
        }

        return view;
    }
    /*
    renderAppliedGiftCode = () => {
        let view = false;
        let isAny = false;
        let displayPromotion = false;
        //typeof(this.promotions['reward_point']) != 'undefined'
        if(typeof(this.promotions['giftcodes']) != 'undefined'){
            displayPromotion = this.promotions['giftcodes'].data.map((giftcodedata,i) => {
                if(giftcodedata.checked && typeof(giftcodedata.appliedAmount) != 'undefined'){
                    isAny = true;
                    this.total -= giftcodedata.appliedAmount;
                    let lbl = 'Applied gift'; 
        
                    let key = 'giftcodedisplay_' + giftcodedata.id;
                    return (
                        <View key={key}>
                            <View style={[styles.line,{width: lineWidth}]}></View>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlblLong}>{lbl}</Text>
                                <Text style={styles.clientshortvalue}>-${giftcodedata.appliedAmount}</Text>
                            </View>
                        </View>
                    );
                }
            })
            if(!isAny){
                displayPromotion = false;
            }
        }
        
        if(isAny){
            view = (
                <View>
                    {displayPromotion}
                    <View style={[styles.line,{width: lineWidth}]}></View>
                </View>
            );
        }

        return view;
    }*/
    roundprice=(num) =>{
        return Math.round(num * 100) / 100;
    }
    isInArray = (value, array)=> {
        return array.indexOf(value) > -1;
    }
    renderCoupon = () => {
        var _this = this;
        let display = false;
        let view = false;
        if(Object.keys(this.promotions).length > 0 && typeof(this.promotions['coupon']) != 'undefined' ){
            let item = this.promotions['coupon'];
            let lbl = '';
            let availableAmount = 0;
            let amountDiscont = item.discountvalue;
            var TotalDiscount = 0;
            this.services.map((service, i) => {
                if(service.id.indexOf('service') >= 0){
                    let isvalid = false;
                    if(item.service_type == 'allservice'){
                        isvalid = true;
                    }else{
                        var idservice = service.id.replace('service_','');
                        isvalid = _this.isInArray(parseInt(idservice), item.service_discount)
                    }
                    if(isvalid){
                        let quantity = 1;
                        if(typeof(service.quantity) != 'undefined'){
                            quantity = service.quantity;
                        }
                        let pricequantity = (service.price * quantity);
                        var discountprice = 0;
                        switch (item.discounttype) {
                            case 'percent':
                                    discountprice = _this.roundprice(parseFloat(pricequantity * (amountDiscont / 100)));;
                                break;
                            case 'fixedprice':
                                var dc_price = 0;
                                discountprice = pricequantity;
                                if (pricequantity >= amountDiscont) {
                                    dc_price = _this.roundprice(parseFloat(pricequantity - amountDiscont));
                                    discountprice = amountDiscont;
                                }
                                break;
                            case 'free':
                                discountprice = pricequantity;
                                break;
                        }
                        TotalDiscount += discountprice;
                    }
                }
            
            });            
            
            if (this.tempTotal <= TotalDiscount) {
                availableAmount = this.tempTotal;
            } else{
                availableAmount = TotalDiscount
            }

            
            if(item.checked && typeof(item.appliedAmount) != 'undefined'){
                this.tempTotal -= availableAmount;
            }
            if(availableAmount > 0){
                item.appliedAmount = availableAmount;
                lbl = 'Applied promo code ' + item.code;    
                this.total -= TotalDiscount;    
            }

            display = (
                <View key={'coupom'}>
                    <View style={[styles.line,{width: lineWidth}]}></View>
                    <View style={styles.clientrow}>
                        <Text style={styles.clientlblLong}>{lbl}</Text>
                        <Text style={styles.clientshortvalue}>-${item.appliedAmount}</Text>
                    </View>
                </View>
            );


            view = (
                <View>
                    {display}
                    <View style={[styles.line,{width: lineWidth}]}></View>
                </View>
                
            );
        }
        
        return view;
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
                if (this.tempTotal <= item.amount) {
                    availableAmount = this.tempTotal;
                } else{
                    availableAmount = item.amount;
                }

                
                if(item.checked && typeof(item.appliedAmount) != 'undefined'){
                    this.tempTotal -= availableAmount;
                }
                
            }
            if(availableAmount > 0){
                item.appliedAmount = availableAmount;
                lbl = 'Apply reward point $'+availableAmount;        
            }else{
                //lbl = '$' +item.amount+ ' Reward Point';  
                lbl = 'Apply reward point $'+this.tempTotal;   
                disable = true;             
            }
            display = (
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
            )

            view = (
                <View>
                    {display}
                    <View style={[styles.line,{width: lineWidth}]}></View>
                </View>
                
            );
        }
        
        return view;
    }

    renderPromotionsGiftBalance = () => {
        let display = false;
        let view = false;
        if(Object.keys(this.promotions).length > 0 && typeof(this.promotions['gift']) != 'undefined'){
            let item = this.promotions['gift'];
            let lbl = '';
            let availableAmount = 0;
            let disable = false;
            if (item.balance > 0) {
                if (this.tempTotal <= item.balance) {
                    availableAmount = this.tempTotal;
                } else{
                    availableAmount = item.balance;
                }
                
                if(item.checked && typeof(item.appliedAmount) != 'undefined'){
                    this.tempTotal -= availableAmount;
                }
                
            }
            if(availableAmount > 0){
                item.appliedAmount = availableAmount;
                lbl = 'Apply $'+availableAmount + ' of gift balance $' + item.balance;       
            }else{
                //lbl = '$' +item.amount+ ' Reward Point';  
                lbl = 'Apply $'+this.tempTotal + ' of gift balance $' + item.balance;  
                disable = true;             
            }
            display = (
                <View key={'gift_' + item.id} style={styles.checkboxcontainer}>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this.onChecked(item,'gift')}
                        isChecked={item.checked}
                        rightText={lbl}
                        rightTextStyle={{fontSize:18,color: color.silver}}
                        disabled={disable}
                    />
                </View>
            )

            view = (
                <View>
                    {display}
                    <View style={[styles.line,{width: lineWidth}]}></View>
                </View>
                
            );
        }
        
        return view;
    }

    /*
    renderPromotionsGiftCode = () => {
        
        //let tempTotal = this.total;
        let display = false;
        let view = false;
        let isAny = false;
        if(Object.keys(this.promotions).length > 0 && typeof(this.promotions['giftcodes']) != 'undefined'){
            isAny = true;
            display = this.promotions['giftcodes'].data.map((giftcodedata,i) => {
                let lbl = '';
                let availableAmount = 0;
                let disable = false;

                if (this.total <= giftcodedata.balance) {
                    availableAmount = this.total;
                } else{
                    availableAmount = giftcodedata.balance;
                }
                
                if(giftcodedata.checked && typeof(giftcodedata.appliedAmount) != 'undefined'){
                    this.tempTotal -= availableAmount; 
                }
                   
                
                if(availableAmount > 0){
                    giftcodedata.appliedAmount = availableAmount;
                    lbl = 'Apply $'+availableAmount + ' discount use gift balance $' + giftcodedata.balance;        
                }else{
                    lbl = 'Apply $'+this.tempTotal + ' discount use gift balance $' + giftcodedata.balance;         
                    disable = true;             
                }
                let key = 'giftcode_' + giftcodedata.id;
                return (
                    <View key={key} style={styles.checkboxcontainer}>
                        <CheckBox
                            style={{flex: 1, padding: 10}}
                            onClick={()=>this.onCheckedGiftCodes(giftcodedata,key)}
                            isChecked={giftcodedata.checked}
                            rightText={lbl}
                            rightTextStyle={{fontSize:18,color: color.silver}}
                            disabled={disable}
                        />
                    </View>
                )
            });

            if(isAny){
                view = (
                    <View>
                        {display}
                        <View style={[styles.line,{width: lineWidth}]}></View>
                    </View>
                    
                );
            }
            
        }
        
        return view;
    }*/

    onChecked = (item,key) => {
        this.promotions[key].checked = item.checked ? false : true;
        this.setState({rerender: true });
    }

    onCheckedGiftCodes = (item,key) => {
        //this.promotions[key].checked = item.checked ? false : true;
        this.promotions['giftcodes'].data.forEach(function(itemGiftCode){
            if('giftcode_' + itemGiftCode.id == key){
                itemGiftCode.checked = item.checked ? false : true;
            }
        })
        // rearrange checked first so we can calculate up-down balance
        let listchecked = this.promotions['giftcodes'].data.filter(function(itemGift){
            return itemGift.checked;
        })

        let listnotchecked = this.promotions['giftcodes'].data.filter(function(itemGift){
            return !itemGift.checked;
        })

        listnotchecked.forEach(function(itemGift){
            listchecked.push(itemGift);
        })

        this.promotions['giftcodes'].data = listchecked;

        this.setState({rerender: true });
    }

    openPromotions = () => {
        this.refs.ModalPromotions.show(this.promotions,this.grandTotal);
    }

    applypromotions = (promotions) => {
        this.promotions = promotions;
        this.setReady();
    }

    checkCode = async () => {
        if(String.prototype.trim.call(this.state.promo) == ''){
            Alert.alert('Error','Please enter code');
        }else{
            let code = this.state.promo;
            this.refs.appointmentLoader.setState({ visible: true });
            let postData = {
                clientid: this.clientData.id,
                dayofweek: this.dayofweek,
                bookingday: this.bookingday,
                code: code
            };
            await fetch(setting.apiUrl + api.promocodeCheck,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.props.token
                },
                body: JSON.stringify(postData)
            }).then((response) => response.json()).then((responseJson) => {
                this.refs.appointmentLoader.setState({ visible: false });
                if(!responseJson.success)
                {
                    setTimeout(function(){
                        Alert.alert('Error', 'Invalid Code');        
                    },100);
        
                }else
                {
                    if(responseJson.type == 'gift'){
                        let isReloadGift = false;
                        if(typeof(this.promotions['gift']) == 'undefined'){
                            this.promotions.gift = {
                                id: 'gift',
                                checked: false,
                                balance: responseJson.amount,
                                giftid: 0,
                                codeids: [responseJson.id]
                            }
                            isReloadGift = true;
                        }else{
                            let codes = this.promotions.gift.codeids.filter(function(codeid){
                                return codeid == responseJson.id;
                            })
                            if(!codes.length){
                                this.promotions.gift.balance = parseFloat(this.promotions.gift.balance) + parseFloat(responseJson.amount);
                                this.promotions.gift.codeids.push(responseJson.id);
                                isReloadGift = true;    
                                
                            }else{
                                setTimeout(function(){
                                    Alert.alert('Warning', 'Code already applied');        
                                },100);
                            }
                        }
                        if(isReloadGift){
                            this.setState({promo: '', rerender:true});

                            this.refs.appointmentSuccessLoader.setState({
                                textContent: 'Applied Successfully',
                                visible: true
                            });

                            let _this = this;
                            setTimeout(function() {
                                _this.refs.appointmentSuccessLoader.setState({
                                    visible: false
                                });
                                
                            }, 2000);
                        }
                        
                    }

                }
                
            }).catch((error) => {
                console.error(error);
            });
        }
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
            let quantity = 1;
            if(typeof(x.quantity) != 'undefined'){
                quantity = x.quantity;
            }
            this.total += (x.price * quantity);
            this.grandTotal += (x.price * quantity);


            if(this.userdata.rewardPointTypeBookingOnline == "byservice" && this.userdata.rewardPointTypePlusBookingOnline == "byfixed" && this.userdata.rewardPointPercentBookingOnline > 0){
                this.totalReward += this.userdata.rewardPointPercentBookingOnline;
            }else if(this.userdata.rewardPointTypeBookingOnline == "byservice" && this.userdata.rewardPointTypePlusBookingOnline == "byfixed" && this.userdata.rewardPointPercentBookingOnline == 0){
                if(this.clientData.is_vip == true && typeof(x.rewardpointvip) != "undefined"){
                    this.totalReward += parseFloat(x.rewardpointvip);
                }else{
                    this.totalReward += parseFloat(x.rewardpoint);
                }
            }else if(this.userdata.rewardPointTypeBookingOnline == "byservice" && this.userdata.rewardPointTypePlusBookingOnline == "bypercent" && this.userdata.rewardPointPercentBookingOnline > 0){
                    var price = x.price * quantity;
                    var point =  (this.userdata.rewardPointPercentBookingOnline / 100) * parseFloat(price);
                    this.totalReward += point;
            }else if(this.userdata.rewardPointTypeBookingOnline == "byservice" && this.userdata.rewardPointTypePlusBookingOnline == "bypercent" && this.userdata.rewardPointPercentBookingOnline == 0){
                if(this.clientData.is_vip == true && typeof(x.rewardpointvip) != "undefined"){
                    var percent = parseFloat(x.rewardpointvip);
                }else{
                    var percent = parseFloat(x.rewardpoint);
                }
                var price = parseFloat(x.price * quantity);
                var point =  (percent / 100) * parseFloat(price);
                this.totalReward += point;
            }

            let techs = this.techniciansSelected[x.id];
            let display = false;
            Object.keys(techs).map((techdatakey, i) => {
                let tech = techs[techdatakey];
                display = 
                    (<View key={x.id}>
                        {i > 0 && 
                            <View style={[styles.line,{width: lineWidth}]}></View>
                        }
                        <View style={styles.clienttoprow}>
                            <Text style={styles.clientlblservice}>{x.service_name + ' x'+quantity}</Text>
                            <Text style={styles.clientvalue}>{'$' + (x.price * quantity)}</Text>
                        </View>
                        <View style={styles.clientbottomrow}>
                            <Text style={styles.clientlbl}>Technician</Text>
                            <Text style={styles.clientvalue}>{tech.fullname}</Text>
                        </View>
                    </View>);

            })
            return display;
            
        });

        let combosDisplay = this.combos.map((x, i) => {
            let quantity = 1;
            if(typeof(x.quantity) != 'undefined'){
                quantity = x.quantity;
            }
            this.total += (x.price * quantity);
            this.grandTotal += (x.price * quantity);
            if(this.userdata.rewardPointTypeBookingOnline == "byservice" && this.userdata.rewardPointTypePlusBookingOnline == "byfixed" && this.userdata.rewardPointPercentBookingOnline > 0){
                this.totalReward += this.userdata.rewardPointPercentBookingOnline;
            }else if(this.userdata.rewardPointTypeBookingOnline == "byservice" && this.userdata.rewardPointTypePlusBookingOnline == "byfixed" && this.userdata.rewardPointPercentBookingOnline == 0){
                this.totalReward += parseFloat(x.rewardpoint);
            }else if(this.userdata.rewardPointTypeBookingOnline == "byservice" && this.userdata.rewardPointTypePlusBookingOnline == "bypercent" && this.userdata.rewardPointPercentBookingOnline > 0){
                    var price = x.price * quantity;
                    var point =  (this.userdata.rewardPointPercentBookingOnline / 100) * parseFloat(price);
                    this.totalReward += point;
            }else if(this.userdata.rewardPointTypeBookingOnline == "byservice" && this.userdata.rewardPointTypePlusBookingOnline == "bypercent" && this.userdata.rewardPointPercentBookingOnline == 0){
                var percent = parseFloat(x.rewardpoint);
                var price = parseFloat(x.price * quantity);
                var point =  (percent / 100) * parseFloat(price);
                this.totalReward += point;
            }
            let techs = this.techniciansSelected[x.id];
            return this.renderCombo(x,i,techs);
        });
        
        //let displayAppliedGiftCode = this.renderAppliedGiftCode();
        
        this.tempTotal = this.total;
        let displayCoupon = this.renderCoupon();
        this.tempTotal = this.total;
        let displayPromotionRewardPoint = this.renderPromotionsRewardPoint();
        let displayAppliedRewardPoint = this.renderAppliedRewardPoint();
        //let displayPromotionGiftCode = this.renderPromotionsGiftCode();
        
        let displayPromotionGift = this.renderPromotionsGiftBalance();
        let displayPromotionGiftBalance = this.renderAppliedGiftBalance();

        // if(typeof(this.userdata.isRewardPointTotalBill) != 'undefined' && this.userdata.isRewardPointTotalBill){
        //     this.totalReward = 0; 
        //     for (var i = 0; i < this.userdata.rewardpointtotalbill.length; i++){ 
        //         if(this.grandTotal >= this.userdata.rewardpointtotalbill[i].price){ 
        //             this.totalReward = this.userdata.rewardpointtotalbill[i].point; 
        //             break; 
        //         } 
        //     } 
            
        // }
        if(this.userdata.rewardPointTypeBookingOnline == "bytotalbill" && this.userdata.rewardPointTypePlusBookingOnline == "byfixed"){
            var totalbill = this.total;
  
            var calcPoint = 0;
            for(i = 0; i < this.userdata.rewardPointTotalBillBookingOnline.length; i++){
                    if(totalbill >= parseFloat(this.userdata.rewardPointTotalBillBookingOnline[i]['price'])){
                        calcPoint = parseFloat(this.userdata.rewardPointTotalBillBookingOnline[i]['point']);
                        break;
                    }
            }
            this.totalReward = calcPoint;
        }else if(this.userdata.rewardPointTypeBookingOnline == "bytotalbill" && this.userdata.rewardPointTypePlusBookingOnline == "bypercent"){
            var totalbill = this.total;
            var calcPoint = 0;
            for(i = 0; i < this.userdata.rewardPointTotalBillBookingOnline.length; i++){
                if(totalbill >= parseFloat(this.userdata.rewardPointTotalBillBookingOnline[i]['price'])){
                    calcPoint = parseFloat(this.userdata.rewardPointTotalBillBookingOnline[i]['point']);
                    break;
                }
            }
    
            var point =  (calcPoint / 100) * totalbill;
            this.totalReward = point;
        }
        this.totalReward = this.roundprice(this.totalReward);
       return(
        <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="always">
                    <View style={[styles.columnWraperLeft]}>
                        {this.userdata.covid19 == 1 && 
                                                <CheckBox
                                                style={{flex: 1, padding: 10}}
                                                onClick={()=>this._onSetconsentform()}
                                                isChecked={this.state.consentForm}
                                                rightText="Consent form void-19"
                                                rightTextStyle={{fontSize:18,color: color.silver}}
                                                disabled={false}
                                            />
                        }

                        <View style={styles.clientrow}>
                            <Text style={styles.clientlblheader}>PROFILE INFORMATION</Text>
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
                        <View style={[styles.line,{width: lineWidth}]}></View>
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlbl}>Reward point for this booking</Text>
                            <Text style={styles.clientvalue}>{this.totalReward}</Text>
                        </View>
                        <View style={[styles.line,{width: lineWidth}]}></View>
                        
                        <View style={[styles.clientrow, styles.reedomcontent]}>
                            <Text style={styles.clientlblheader}>REDEEM GIFT CODE</Text>
                            <View style={[styles.clientrowcus]}>
                            <View style={[styles.searchContainer,{width:350, alignSelf: 'stretch',}]} >
                                <TextInput
                                    style={[styles.textbox]}
                                    placeholder='Enter gift card code' 
                                    placeholderTextColor={color.placeHolderColor}
                                    onChangeText={(text) => this.setState({promo: text})}
                                    value={this.state.promo} 
                                    underlineColorAndroid={'transparent'}
                                />

                                <TouchableOpacity style={styles.searchbox} activeOpacity={1} onPress={async () => { await this.checkCode()}}>
                                    <LinearGradient
                                            start={[0, 0]}
                                            end={[1, 0]}
                                            colors={[color.reddish, color.lightPink]}
                                            style={[styles.btnLinearPromo, styles.active ]}
                                        >
                                        <Text style={styles.txtsearchtext}>Apply</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                        </View>
                        <View style={[styles.line,{width: lineWidth}]}></View>

                        
                    {
                        this.services.length > 0 && 
                        <View style={[styles.columnWraperRight]}>
                            <View style={styles.clientrow}>
                                <Text style={styles.clientlblheader}>SERVICES</Text>
                            </View>
                            <View style={[styles.line]}></View>
                            {servicesDisplay}
                        </View>    
                    }
                    
                    {
                        this.combos.length > 0 && 
                        combosDisplay
                    }
                        <View style={[styles.line]}></View>
                    <View style={[styles.columnWraperRight]}>
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlblheader}>PAYMENT</Text>
                            
                        </View>
                        <View style={[styles.line]}></View>
                        
                        {displayPromotionRewardPoint}
                      
                        {displayPromotionGift}
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlbl}>Sub total</Text>
                            <Text style={styles.clientvalue}>${this.grandTotal}</Text>
                        </View>
                        <View style={[styles.line]}></View>
                        {displayCoupon}
                        {displayAppliedRewardPoint}
                       
                        {displayPromotionGiftBalance}
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlbl}>Total</Text>
                            <Text style={styles.clientvalue}>${this.total}</Text>
                        </View>
                        
                    </View>
                    </View>   
                    
                    <ModalPromotions ref="ModalPromotions" applypromotions={this.applypromotions} />
                    <ModalConsentFormCovid19 visible={false} ref="ModalConsentFormCovid19" onPress={this._onPressconsentFormData} />
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
        </ScrollView>
       )
    }
}


const styles = StyleSheet.create({
    ...Platform.select({
        ios:{
            container: {
                marginTop:20,
                backgroundColor:"#ebebeb"
            },
            columnWraperLeft:{
                borderRadius:0,
                borderWidth: 0.5,
                borderColor: '#ebebeb',
                marginBottom:15
            },
            columnWraperRight:{
                marginBottom:15
            },
            rowWrap:{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginBottom:20,
                width:660,
                height:1000
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

                borderRadius:0,
                paddingLeft:15,
                paddingRight:15,
                paddingTop:15,
                paddingBottom:15,
                position:'relative'
            },
            clientrowcus:{
                flexDirection:'row',
                justifyContent:'space-between',
           
                borderRadius:0,
                paddingLeft:15,
                paddingRight:15,
                position:'relative'
            },
            clienttoprow:{
                flexDirection:'row',
                justifyContent:'space-between',
 
                borderRadius:0,
                paddingLeft:15,
                paddingRight:15,
                paddingTop:15,
            },
            clientbottomrow:{
                flexDirection:'row',
                justifyContent:'space-between',
                borderRadius:0,
                paddingLeft:15,
                paddingRight:15,
                paddingBottom:15,
                paddingTop:10
            },
            clientlbl:{
                fontSize:18,
                width:170,
                color: color.blackish,
                fontFamily:'Futura'
            },clientlblLong:{
                fontSize:18,
                color: color.blackish,
                fontFamily:'Futura'
            },
            clientshortvalue:{
                color: color.silver,
                fontSize:18,
                textAlign:'right',
                fontFamily:'Futura'
            },
            clientlblservice:{
                fontSize:18,
                color: color.blackish,
                fontFamily:'Futura'
            },
            clientlblheader:{
                fontSize:18,
                color:color.reddish,
                fontFamily:'Futura'
            },
            clientlbldot:{
                fontSize:18,
                color: color.blackish,
                fontFamily:'Futura'
            },
            clientvalue:{
                color: color.silver,
                fontSize:18,
                textAlign:'right',
                fontFamily:'Futura'
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
                color: color.white,
                fontSize: 30,
                zIndex: 1,
                backgroundColor: "transparent",
                fontFamily:'Futura'
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
                marginLeft:0,
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
                height:40,
                justifyContent: 'flex-end'
            },
            searchbox:{
                position:'absolute',
                zIndex:1,
                right:0,
                width:100,
                height:40,
                justifyContent: 'center',
                alignItems: 'center',
            },
            textbox:{
                height:40,
                color: color.black,
                paddingRight:20,
                paddingLeft:20,
                fontSize:16,
                backgroundColor: color.lightWhite,
                borderBottomLeftRadius:5,
                borderTopLeftRadius:5,
                fontFamily:'Futura'
            },
            btnLinearPromo:{
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                width:100,
                height:40,
                borderBottomRightRadius:5,
                borderTopRightRadius:5
            },
            txtsearchtext:{
                backgroundColor:'transparent',
                fontSize:18,
                color:color.white,
                fontFamily:'Futura'
            },
            reedomcontent:{
                alignItems: "center",
            },
        },
        android:{
            container: {
                marginTop:20
            },
            columnWraperLeft:{
                borderRadius:4,
                backgroundColor:'#ebebeb',
                marginLeft:0,
                marginRight:7.5,
                borderWidth: 0.5,
                borderColor: color.whitishBorder,
                marginBottom:15
            },
            columnWraperRight:{
                borderRadius:4,
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
                marginLeft:0,
                marginRight:15
            },
            clientrow:{
                flexDirection:'row',
                justifyContent:'space-between',
        
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
         
                borderRadius:4,
                paddingLeft:15,
                paddingRight:15,
                paddingTop:15,
            },
            clientbottomrow:{
                flexDirection:'row',
                justifyContent:'space-between',

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
                color:color.reddish,
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
                color: color.white,
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
                marginLeft:0
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
                color:color.white
            }
        }
    })
   
})
